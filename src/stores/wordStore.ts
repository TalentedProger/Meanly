/**
 * MEANLY - Word Store
 * Word of the Day and current word state management
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Word, WordOfTheDay } from '../types/word';
import { getDemoWordOfTheDay, getAllDemoWords } from '../data/demoWords';

interface WordState {
  // Word of the Day
  wordOfTheDay: Word | null;
  wordOfTheDayDate: string | null;
  isLoadingWordOfDay: boolean;
  
  // Current word (being viewed/practiced)
  currentWord: Word | null;
  currentStep: number;
  
  // All words (for local mode)
  allWords: Word[];
  
  // Loading states
  isLoading: boolean;
  
  // Recent words
  recentWords: Word[];
  
  // Cache
  wordCache: Map<string, Word>;
  
  // Error
  error: string | null;
  
  // Actions - Word of the Day
  setWordOfTheDay: (word: Word, date: string) => void;
  setLoadingWordOfDay: (isLoading: boolean) => void;
  loadWordOfTheDay: () => Promise<void>;
  
  // Actions - All Words
  loadAllWords: () => Promise<void>;
  
  // Actions - Current Word
  setCurrentWord: (word: Word | null) => void;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetStep: () => void;
  
  // Actions - Recent Words
  addToRecentWords: (word: Word) => void;
  clearRecentWords: () => void;
  
  // Actions - Cache
  cacheWord: (word: Word) => void;
  getCachedWord: (id: string) => Word | undefined;
  clearCache: () => void;
  
  // Actions - Error
  setError: (error: string | null) => void;
  
  // Actions - Loading
  setLoading: (isLoading: boolean) => void;
  
  // Reset
  reset: () => void;
}

const MAX_RECENT_WORDS = 10;
const MAX_LEARNING_STEPS = 8;

const initialState = {
  wordOfTheDay: null,
  wordOfTheDayDate: null,
  isLoadingWordOfDay: false,
  currentWord: null,
  currentStep: 0,
  allWords: [],
  isLoading: false,
  recentWords: [],
  wordCache: new Map(),
  error: null,
};

export const useWordStore = create<WordState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Word of the Day Actions
      setWordOfTheDay: (word, date) => set({
        wordOfTheDay: word,
        wordOfTheDayDate: date,
        error: null,
      }),
      
      setLoadingWordOfDay: (isLoadingWordOfDay) => set({ isLoadingWordOfDay }),
      
      // Load Word of the Day (uses demo data in local mode)
      loadWordOfTheDay: async () => {
        const { wordOfTheDay, wordOfTheDayDate } = get();
        const today = new Date().toISOString().split('T')[0];
        
        // If already loaded for today, skip
        if (wordOfTheDay && wordOfTheDayDate === today) {
          return;
        }
        
        set({ isLoadingWordOfDay: true, error: null });
        
        try {
          // Use demo data for local mode
          const demoWord = getDemoWordOfTheDay();
          set({
            wordOfTheDay: demoWord,
            wordOfTheDayDate: today,
            isLoadingWordOfDay: false,
          });
        } catch (e) {
          set({
            error: 'Не удалось загрузить слово дня',
            isLoadingWordOfDay: false,
          });
        }
      },
      
      // Load All Words (demo data)
      loadAllWords: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const words = getAllDemoWords();
          set({
            allWords: words,
            isLoading: false,
          });
        } catch (e) {
          set({
            error: 'Не удалось загрузить слова',
            isLoading: false,
          });
        }
      },

      // Current Word Actions
      setCurrentWord: (currentWord) => set({ 
        currentWord,
        currentStep: 0,
      }),
      
      setCurrentStep: (currentStep) => set({ currentStep }),
      
      nextStep: () => {
        const { currentStep } = get();
        if (currentStep < MAX_LEARNING_STEPS) {
          set({ currentStep: currentStep + 1 });
        }
      },
      
      prevStep: () => {
        const { currentStep } = get();
        if (currentStep > 0) {
          set({ currentStep: currentStep - 1 });
        }
      },
      
      resetStep: () => set({ currentStep: 0 }),

      // Recent Words Actions
      addToRecentWords: (word) => {
        const { recentWords } = get();
        const filtered = recentWords.filter((w) => w.id !== word.id);
        const updated = [word, ...filtered].slice(0, MAX_RECENT_WORDS);
        set({ recentWords: updated });
      },
      
      clearRecentWords: () => set({ recentWords: [] }),

      // Cache Actions
      cacheWord: (word) => {
        const { wordCache } = get();
        const newCache = new Map(wordCache);
        newCache.set(word.id, word);
        set({ wordCache: newCache });
      },
      
      getCachedWord: (id) => {
        const { wordCache } = get();
        return wordCache.get(id);
      },
      
      clearCache: () => set({ wordCache: new Map() }),

      // Error
      setError: (error) => set({ error }),
      
      // Loading
      setLoading: (isLoading) => set({ isLoading }),

      // Reset
      reset: () => set(initialState),
    }),
    {
      name: 'meanly-word',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        wordOfTheDay: state.wordOfTheDay,
        wordOfTheDayDate: state.wordOfTheDayDate,
        recentWords: state.recentWords,
        allWords: state.allWords,
      }),
    }
  )
);
