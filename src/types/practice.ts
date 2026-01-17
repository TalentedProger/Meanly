/**
 * MEANLY - Practice Types
 * Types for practice sessions and LLM interactions
 */

// Practice session
export interface PracticeSession {
  id: string;
  userId: string;
  startedAt: string;
  completedAt?: string;
  
  // Queue
  wordIds: string[];
  currentIndex: number;
  
  // Results
  results: PracticeResult[];
  
  // Stats
  totalWords: number;
  correctCount: number;
  partialCount: number;
  incorrectCount: number;
}

// Individual practice result
export interface PracticeResult {
  wordId: string;
  userSentence: string;
  evaluation: LLMEvaluation;
  timestamp: string;
  timeSpentMs: number;
}

// LLM Evaluation result
export interface LLMEvaluation {
  // Overall verdict
  verdict: PracticeVerdict;
  
  // Feedback
  comment: string; // Soft, encouraging feedback
  
  // Suggestions
  suggestedVersion?: string; // Improved version of user's sentence
  tips?: string[]; // Optional tips for improvement
  
  // Metadata
  processingTimeMs?: number;
  modelVersion?: string;
}

export type PracticeVerdict = 
  | 'excellent' // Perfect usage
  | 'good' // Correct but could be better
  | 'partial' // Mostly correct, minor issues
  | 'needs_work'; // Incorrect usage

// LLM Request (sent to proxy)
export interface LLMCheckRequest {
  wordId: string;
  word: string;
  definition: string;
  userSentence: string;
  contexts?: string[]; // Optional context hints
}

// LLM Response (from proxy)
export interface LLMCheckResponse {
  success: boolean;
  evaluation?: LLMEvaluation;
  error?: LLMError;
}

export interface LLMError {
  code: LLMErrorCode;
  message: string;
  retryable: boolean;
}

export type LLMErrorCode = 
  | 'TIMEOUT'
  | 'RATE_LIMITED'
  | 'INVALID_INPUT'
  | 'CONTENT_FILTERED'
  | 'SERVICE_ERROR'
  | 'NETWORK_ERROR';

// Practice queue configuration
export interface PracticeQueueConfig {
  // Sources
  includeWordOfDay: boolean;
  includeWeakWords: boolean; // Words with low strength
  includeRecommended: boolean;
  includeSavedWords: boolean;
  
  // Limits
  maxQueueSize: number;
  weakWordsRatio: number; // 0-1, portion of weak words
  
  // Filters
  levelFilter?: 'beginner' | 'intermediate' | 'advanced';
  categoryFilter?: string;
}

// Default practice queue config
export const DEFAULT_PRACTICE_CONFIG: PracticeQueueConfig = {
  includeWordOfDay: true,
  includeWeakWords: true,
  includeRecommended: true,
  includeSavedWords: true,
  maxQueueSize: 10,
  weakWordsRatio: 0.3,
};

// Practice reminder
export interface PracticeReminder {
  id: string;
  userId: string;
  time: string; // HH:MM
  daysOfWeek: number[]; // 0-6, Sunday = 0
  isEnabled: boolean;
  message?: string;
}

// Spaced repetition intervals (in hours)
export const SPACED_REPETITION_INTERVALS = {
  new: 4, // 4 hours
  learning: 24, // 1 day
  familiar: 72, // 3 days
  mastered: 168, // 7 days
} as const;

// Practice session summary
export interface PracticeSessionSummary {
  sessionId: string;
  duration: number; // seconds
  wordsCompleted: number;
  
  // Breakdown
  excellent: number;
  good: number;
  partial: number;
  needsWork: number;
  
  // Achievements unlocked during session
  achievements?: string[];
  
  // Next steps
  suggestedNextAction: 'continue' | 'review_weak' | 'explore_new' | 'rest';
}

// Offline practice queue item
export interface OfflinePracticeItem {
  id: string;
  wordId: string;
  userSentence: string;
  timestamp: string;
  synced: boolean;
}

// Sentence evaluation from LLM (used in UI components)
export interface SentenceEvaluation {
  score: number; // 0-100
  isCorrect: boolean;
  feedback: string; // Human-readable feedback
  suggestions: string[]; // Improvement suggestions
  grammarErrors: string[]; // Grammar issues found
  contextScore: number; // How well word fits context (0-100)
  originalSentence: string; // User's original sentence
  improvedVersion?: string; // AI-improved version
}
