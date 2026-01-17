/**
 * MEANLY - Practice Store
 * Practice session state management
 */

import { create } from 'zustand';

import type { 
  PracticeSession, 
  PracticeResult, 
  LLMEvaluation,
  PracticeVerdict,
} from '../types/practice';
import type { Word } from '../types/word';

interface PracticeState {
  // Current session
  session: PracticeSession | null;
  
  // Practice queue
  practiceQueue: Word[];
  currentIndex: number;
  
  // Current practice
  currentWord: Word | null;
  userSentence: string;
  isChecking: boolean;
  evaluation: LLMEvaluation | null;
  
  // Session results
  results: PracticeResult[];
  
  // UI state
  isSessionActive: boolean;
  showResult: boolean;
  
  // Error
  error: string | null;
  
  // Actions - Session
  startSession: (words: Word[]) => void;
  endSession: () => void;
  resetSession: () => void;
  
  // Actions - Practice
  setUserSentence: (sentence: string) => void;
  clearUserSentence: () => void;
  setChecking: (isChecking: boolean) => void;
  setEvaluation: (evaluation: LLMEvaluation) => void;
  
  // Actions - Navigation
  nextWord: () => void;
  skipWord: () => void;
  
  // Actions - Results
  addResult: (result: PracticeResult) => void;
  
  // Computed
  getCurrentProgress: () => { current: number; total: number; percentage: number };
  getSessionSummary: () => SessionSummary | null;
  
  // Error
  setError: (error: string | null) => void;
}

interface SessionSummary {
  totalWords: number;
  completedWords: number;
  excellent: number;
  good: number;
  partial: number;
  needsWork: number;
  skipped: number;
}

const initialState = {
  session: null,
  practiceQueue: [],
  currentIndex: 0,
  currentWord: null,
  userSentence: '',
  isChecking: false,
  evaluation: null,
  results: [],
  isSessionActive: false,
  showResult: false,
  error: null,
};

export const usePracticeStore = create<PracticeState>()((set, get) => ({
  ...initialState,

  // Session Actions
  startSession: (words) => {
    if (words.length === 0) {
      set({ error: 'No words to practice' });
      return;
    }

    const session: PracticeSession = {
      id: `session-${Date.now()}`,
      userId: '', // Will be set by caller
      startedAt: new Date().toISOString(),
      wordIds: words.map((w) => w.id),
      currentIndex: 0,
      results: [],
      totalWords: words.length,
      correctCount: 0,
      partialCount: 0,
      incorrectCount: 0,
    };

    set({
      session,
      practiceQueue: words,
      currentIndex: 0,
      currentWord: words[0],
      isSessionActive: true,
      results: [],
      userSentence: '',
      evaluation: null,
      showResult: false,
      error: null,
    });
  },

  endSession: () => {
    const { session, results } = get();
    if (session) {
      set({
        session: {
          ...session,
          completedAt: new Date().toISOString(),
        },
        isSessionActive: false,
      });
    }
  },

  resetSession: () => set(initialState),

  // Practice Actions
  setUserSentence: (userSentence) => set({ userSentence }),
  
  clearUserSentence: () => set({ userSentence: '' }),
  
  setChecking: (isChecking) => set({ isChecking }),
  
  setEvaluation: (evaluation) => set({ 
    evaluation, 
    showResult: true,
    isChecking: false,
  }),

  // Navigation Actions
  nextWord: () => {
    const { practiceQueue, currentIndex, userSentence, evaluation } = get();
    
    // Save result before moving
    if (evaluation) {
      const result: PracticeResult = {
        wordId: practiceQueue[currentIndex].id,
        userSentence,
        evaluation,
        timestamp: new Date().toISOString(),
        timeSpentMs: 0, // Could be tracked
      };
      get().addResult(result);
    }

    const nextIndex = currentIndex + 1;
    
    if (nextIndex >= practiceQueue.length) {
      // Session complete
      get().endSession();
    } else {
      set({
        currentIndex: nextIndex,
        currentWord: practiceQueue[nextIndex],
        userSentence: '',
        evaluation: null,
        showResult: false,
      });
    }
  },

  skipWord: () => {
    const { practiceQueue, currentIndex, results } = get();
    
    // Add skipped result
    const result: PracticeResult = {
      wordId: practiceQueue[currentIndex].id,
      userSentence: '',
      evaluation: {
        verdict: 'needs_work' as PracticeVerdict,
        comment: 'Пропущено',
      },
      timestamp: new Date().toISOString(),
      timeSpentMs: 0,
    };
    
    set({ results: [...results, result] });
    
    const nextIndex = currentIndex + 1;
    
    if (nextIndex >= practiceQueue.length) {
      get().endSession();
    } else {
      set({
        currentIndex: nextIndex,
        currentWord: practiceQueue[nextIndex],
        userSentence: '',
        evaluation: null,
        showResult: false,
      });
    }
  },

  // Results Actions
  addResult: (result) => {
    const { results, session } = get();
    const newResults = [...results, result];
    
    // Update session stats
    if (session) {
      const verdict = result.evaluation.verdict;
      set({
        results: newResults,
        session: {
          ...session,
          results: newResults,
          correctCount: session.correctCount + (verdict === 'excellent' || verdict === 'good' ? 1 : 0),
          partialCount: session.partialCount + (verdict === 'partial' ? 1 : 0),
          incorrectCount: session.incorrectCount + (verdict === 'needs_work' ? 1 : 0),
        },
      });
    } else {
      set({ results: newResults });
    }
  },

  // Computed
  getCurrentProgress: () => {
    const { currentIndex, practiceQueue, results } = get();
    const total = practiceQueue.length;
    const current = currentIndex + 1;
    const percentage = total > 0 ? Math.round((results.length / total) * 100) : 0;
    return { current, total, percentage };
  },

  getSessionSummary: () => {
    const { practiceQueue, results, isSessionActive } = get();
    
    if (practiceQueue.length === 0) return null;

    const summary: SessionSummary = {
      totalWords: practiceQueue.length,
      completedWords: results.length,
      excellent: 0,
      good: 0,
      partial: 0,
      needsWork: 0,
      skipped: 0,
    };

    for (const result of results) {
      switch (result.evaluation.verdict) {
        case 'excellent':
          summary.excellent++;
          break;
        case 'good':
          summary.good++;
          break;
        case 'partial':
          summary.partial++;
          break;
        case 'needs_work':
          if (result.userSentence === '') {
            summary.skipped++;
          } else {
            summary.needsWork++;
          }
          break;
      }
    }

    return summary;
  },

  // Error
  setError: (error) => set({ error }),
}));
