/**
 * MEANLY - Saved Words Store
 * User's saved words state management
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import type { UserWord, WordFilters, WordSortOption, WordStrength } from '../types/word';

interface SavedWordsState {
  // Words
  savedWords: UserWord[];
  isLoading: boolean;
  lastSyncedAt: string | null;
  
  // Filters
  filters: WordFilters;
  sortOption: WordSortOption;
  
  // Selection (for bulk actions)
  selectedWordIds: Set<string>;
  
  // Offline
  pendingChanges: PendingChange[];
  
  // Error
  error: string | null;
  
  // Actions - Words
  setSavedWords: (words: UserWord[]) => void;
  addWord: (word: UserWord) => void;
  removeWord: (wordId: string) => void;
  updateWord: (wordId: string, updates: Partial<UserWord>) => void;
  
  // Actions - Filters
  setFilters: (filters: WordFilters) => void;
  clearFilters: () => void;
  setSortOption: (option: WordSortOption) => void;
  
  // Actions - Selection
  toggleSelection: (wordId: string) => void;
  selectAll: () => void;
  clearSelection: () => void;
  deleteSelected: () => void;
  
  // Actions - Sync
  setLastSyncedAt: (timestamp: string) => void;
  addPendingChange: (change: PendingChange) => void;
  clearPendingChanges: () => void;
  
  // Computed
  getFilteredWords: () => UserWord[];
  getWordsByStrength: (strength: WordStrength) => UserWord[];
  getTotalCount: () => number;
  
  // Loading/Error
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Reset
  reset: () => void;
}

interface PendingChange {
  type: 'save' | 'unsave' | 'update';
  wordId: string;
  data?: Partial<UserWord>;
  timestamp: string;
}

const initialState = {
  savedWords: [],
  isLoading: false,
  lastSyncedAt: null,
  filters: {},
  sortOption: 'savedAt_desc' as WordSortOption,
  selectedWordIds: new Set<string>(),
  pendingChanges: [],
  error: null,
};

export const useSavedWordsStore = create<SavedWordsState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Words Actions
      setSavedWords: (savedWords) => set({ savedWords, error: null }),
      
      addWord: (word) => {
        const { savedWords } = get();
        if (!savedWords.find((w) => w.wordId === word.wordId)) {
          set({ savedWords: [word, ...savedWords] });
        }
      },
      
      removeWord: (wordId) => {
        const { savedWords, selectedWordIds } = get();
        const newSelected = new Set(selectedWordIds);
        newSelected.delete(wordId);
        set({
          savedWords: savedWords.filter((w) => w.wordId !== wordId),
          selectedWordIds: newSelected,
        });
      },
      
      updateWord: (wordId, updates) => {
        const { savedWords } = get();
        set({
          savedWords: savedWords.map((w) =>
            w.wordId === wordId ? { ...w, ...updates } : w
          ),
        });
      },

      // Filters Actions
      setFilters: (filters) => set({ filters }),
      
      clearFilters: () => set({ filters: {} }),
      
      setSortOption: (sortOption) => set({ sortOption }),

      // Selection Actions
      toggleSelection: (wordId) => {
        const { selectedWordIds } = get();
        const newSelected = new Set(selectedWordIds);
        if (newSelected.has(wordId)) {
          newSelected.delete(wordId);
        } else {
          newSelected.add(wordId);
        }
        set({ selectedWordIds: newSelected });
      },
      
      selectAll: () => {
        const { savedWords } = get();
        set({ selectedWordIds: new Set(savedWords.map((w) => w.wordId)) });
      },
      
      clearSelection: () => set({ selectedWordIds: new Set() }),
      
      deleteSelected: () => {
        const { savedWords, selectedWordIds } = get();
        set({
          savedWords: savedWords.filter((w) => !selectedWordIds.has(w.wordId)),
          selectedWordIds: new Set(),
        });
      },

      // Sync Actions
      setLastSyncedAt: (lastSyncedAt) => set({ lastSyncedAt }),
      
      addPendingChange: (change) => {
        const { pendingChanges } = get();
        set({ pendingChanges: [...pendingChanges, change] });
      },
      
      clearPendingChanges: () => set({ pendingChanges: [] }),

      // Computed
      getFilteredWords: () => {
        const { savedWords, filters, sortOption } = get();
        let result = [...savedWords];

        // Apply filters
        if (filters.categoryId) {
          result = result.filter((w) => w.word.categoryId === filters.categoryId);
        }
        if (filters.level) {
          result = result.filter((w) => w.word.level === filters.level);
        }
        if (filters.strength) {
          result = result.filter((w) => w.strength === filters.strength);
        }
        if (filters.searchQuery) {
          const query = filters.searchQuery.toLowerCase();
          result = result.filter(
            (w) =>
              w.word.word.toLowerCase().includes(query) ||
              w.word.baseWord.toLowerCase().includes(query) ||
              w.word.definition.toLowerCase().includes(query)
          );
        }
        if (filters.offlineOnly) {
          result = result.filter((w) => w.isOfflineCached);
        }

        // Apply sorting
        switch (sortOption) {
          case 'savedAt_desc':
            result.sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());
            break;
          case 'savedAt_asc':
            result.sort((a, b) => new Date(a.savedAt).getTime() - new Date(b.savedAt).getTime());
            break;
          case 'alphabetical':
            result.sort((a, b) => a.word.word.localeCompare(b.word.word, 'ru'));
            break;
          case 'strength':
            const strengthOrder = { mastered: 0, familiar: 1, learning: 2, new: 3 };
            result.sort((a, b) => strengthOrder[a.strength] - strengthOrder[b.strength]);
            break;
          case 'lastPracticed':
            result.sort((a, b) => {
              if (!a.lastPracticedAt) return 1;
              if (!b.lastPracticedAt) return -1;
              return new Date(b.lastPracticedAt).getTime() - new Date(a.lastPracticedAt).getTime();
            });
            break;
        }

        return result;
      },
      
      getWordsByStrength: (strength) => {
        const { savedWords } = get();
        return savedWords.filter((w) => w.strength === strength);
      },
      
      getTotalCount: () => get().savedWords.length,

      // Loading/Error
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      // Reset
      reset: () => set({ ...initialState, selectedWordIds: new Set() }),
    }),
    {
      name: 'meanly-saved-words',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        savedWords: state.savedWords,
        lastSyncedAt: state.lastSyncedAt,
        pendingChanges: state.pendingChanges,
      }),
    }
  )
);
