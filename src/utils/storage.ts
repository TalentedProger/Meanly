/**
 * MEANLY - Storage Utilities
 * AsyncStorage helpers for local data persistence
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/config';

/**
 * Get an item from storage with type safety
 */
export async function getItem<T>(key: string): Promise<T | null> {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value === null) return null;
    return JSON.parse(value) as T;
  } catch (error) {
    console.error(`[Storage] Error getting item "${key}":`, error);
    return null;
  }
}

/**
 * Set an item in storage
 */
export async function setItem<T>(key: string, value: T): Promise<boolean> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`[Storage] Error setting item "${key}":`, error);
    return false;
  }
}

/**
 * Remove an item from storage
 */
export async function removeItem(key: string): Promise<boolean> {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`[Storage] Error removing item "${key}":`, error);
    return false;
  }
}

/**
 * Clear all storage (use with caution!)
 */
export async function clearAll(): Promise<boolean> {
  try {
    await AsyncStorage.clear();
    return true;
  } catch (error) {
    console.error('[Storage] Error clearing storage:', error);
    return false;
  }
}

/**
 * Get multiple items at once
 */
export async function getMultiple<T extends Record<string, unknown>>(
  keys: string[]
): Promise<Partial<T>> {
  try {
    const pairs = await AsyncStorage.multiGet(keys);
    const result: Record<string, unknown> = {};
    
    for (const [key, value] of pairs) {
      if (value !== null) {
        try {
          result[key] = JSON.parse(value);
        } catch {
          result[key] = value;
        }
      }
    }
    
    return result as Partial<T>;
  } catch (error) {
    console.error('[Storage] Error getting multiple items:', error);
    return {};
  }
}

/**
 * Set multiple items at once
 */
export async function setMultiple(
  items: Record<string, unknown>
): Promise<boolean> {
  try {
    const pairs: [string, string][] = Object.entries(items).map(
      ([key, value]) => [key, JSON.stringify(value)]
    );
    await AsyncStorage.multiSet(pairs);
    return true;
  } catch (error) {
    console.error('[Storage] Error setting multiple items:', error);
    return false;
  }
}

/**
 * Check if a key exists
 */
export async function hasItem(key: string): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(key);
    return value !== null;
  } catch {
    return false;
  }
}

// Convenience functions for common storage operations

/**
 * Get cached Word of the Day
 */
export async function getCachedWordOfDay() {
  return getItem<{
    wordId: string;
    date: string;
    data: unknown;
    cachedAt: number;
  }>(STORAGE_KEYS.WORD_OF_THE_DAY);
}

/**
 * Cache Word of the Day
 */
export async function cacheWordOfDay(wordId: string, data: unknown) {
  const today = new Date().toISOString().split('T')[0];
  return setItem(STORAGE_KEYS.WORD_OF_THE_DAY, {
    wordId,
    date: today,
    data,
    cachedAt: Date.now(),
  });
}

/**
 * Get cached saved words
 */
export async function getCachedSavedWords<T>(): Promise<T[] | null> {
  return getItem<T[]>(STORAGE_KEYS.SAVED_WORDS);
}

/**
 * Cache saved words
 */
export async function cacheSavedWords<T>(words: T[]): Promise<boolean> {
  return setItem(STORAGE_KEYS.SAVED_WORDS, words);
}

/**
 * Get offline queue
 */
export async function getOfflineQueue<T>(): Promise<T[]> {
  const queue = await getItem<T[]>(STORAGE_KEYS.OFFLINE_QUEUE);
  return queue || [];
}

/**
 * Add item to offline queue
 */
export async function addToOfflineQueue<T>(item: T): Promise<boolean> {
  const queue = await getOfflineQueue<T>();
  queue.push(item);
  return setItem(STORAGE_KEYS.OFFLINE_QUEUE, queue);
}

/**
 * Clear offline queue
 */
export async function clearOfflineQueue(): Promise<boolean> {
  return removeItem(STORAGE_KEYS.OFFLINE_QUEUE);
}

/**
 * Check if onboarding is completed
 */
export async function isOnboardingCompleted(): Promise<boolean> {
  return (await getItem<boolean>(STORAGE_KEYS.ONBOARDING_COMPLETED)) === true;
}

/**
 * Mark onboarding as completed
 */
export async function markOnboardingCompleted(): Promise<boolean> {
  return setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, true);
}
