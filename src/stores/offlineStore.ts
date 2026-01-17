/**
 * MEANLY - Offline Store
 * Offline state and sync queue management
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface OfflineQueueItem {
  id: string;
  type: 'save_word' | 'unsave_word' | 'practice_result' | 'update_notes';
  payload: Record<string, unknown>;
  timestamp: string;
  retryCount: number;
}

interface OfflineState {
  // Connection state
  isOnline: boolean;
  lastOnlineAt: string | null;
  
  // Sync queue
  queue: OfflineQueueItem[];
  isSyncing: boolean;
  lastSyncError: string | null;
  
  // Actions - Connection
  setOnline: (isOnline: boolean) => void;
  
  // Actions - Queue
  addToQueue: (item: Omit<OfflineQueueItem, 'id' | 'timestamp' | 'retryCount'>) => void;
  removeFromQueue: (id: string) => void;
  incrementRetry: (id: string) => void;
  clearQueue: () => void;
  
  // Actions - Sync
  setSyncing: (isSyncing: boolean) => void;
  setSyncError: (error: string | null) => void;
  
  // Computed
  getQueueSize: () => number;
  hasPendingChanges: () => boolean;
  
  // Reset
  reset: () => void;
}

const MAX_RETRIES = 3;

const initialState = {
  isOnline: true,
  lastOnlineAt: null,
  queue: [],
  isSyncing: false,
  lastSyncError: null,
};

export const useOfflineStore = create<OfflineState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Connection Actions
      setOnline: (isOnline) => {
        set({ 
          isOnline,
          lastOnlineAt: isOnline ? new Date().toISOString() : get().lastOnlineAt,
        });
      },

      // Queue Actions
      addToQueue: (item) => {
        const { queue } = get();
        const newItem: OfflineQueueItem = {
          ...item,
          id: `offline-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date().toISOString(),
          retryCount: 0,
        };
        set({ queue: [...queue, newItem] });
      },

      removeFromQueue: (id) => {
        const { queue } = get();
        set({ queue: queue.filter((item) => item.id !== id) });
      },

      incrementRetry: (id) => {
        const { queue } = get();
        set({
          queue: queue.map((item) =>
            item.id === id
              ? { ...item, retryCount: item.retryCount + 1 }
              : item
          ).filter((item) => item.retryCount < MAX_RETRIES),
        });
      },

      clearQueue: () => set({ queue: [] }),

      // Sync Actions
      setSyncing: (isSyncing) => set({ isSyncing }),
      
      setSyncError: (lastSyncError) => set({ lastSyncError }),

      // Computed
      getQueueSize: () => get().queue.length,
      
      hasPendingChanges: () => get().queue.length > 0,

      // Reset
      reset: () => set(initialState),
    }),
    {
      name: 'meanly-offline',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        queue: state.queue,
        lastOnlineAt: state.lastOnlineAt,
      }),
    }
  )
);
