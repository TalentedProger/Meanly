/**
 * MEANLY - Supabase Client
 * Lazy initialization - only creates client when actually needed
 * Supports offline/local mode without Supabase credentials
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

import { SUPABASE_CONFIG } from '../../constants/config';
import type { Database } from './database.types';

// Singleton instance
let supabaseInstance: SupabaseClient<Database> | null = null;

// Check if Supabase is properly configured
export function isSupabaseConfigured(): boolean {
  return !!(
    SUPABASE_CONFIG.url &&
    SUPABASE_CONFIG.anonKey &&
    SUPABASE_CONFIG.url !== 'https://your-project.supabase.co' &&
    SUPABASE_CONFIG.anonKey.length > 10
  );
}

// Secure storage adapter for auth tokens
const ExpoSecureStoreAdapter = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(key);
    } catch {
      // Fallback to AsyncStorage if SecureStore fails
      return await AsyncStorage.getItem(key);
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch {
      // Fallback to AsyncStorage if SecureStore fails
      await AsyncStorage.setItem(key, value);
    }
  },
  removeItem: async (key: string): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch {
      // Fallback to AsyncStorage if SecureStore fails
      await AsyncStorage.removeItem(key);
    }
  },
};

/**
 * Get Supabase client instance (lazy initialization)
 * Returns null if Supabase is not configured
 */
export function getSupabaseClient(): SupabaseClient<Database> | null {
  if (!isSupabaseConfigured()) {
    console.warn('[Supabase] Not configured - running in local/offline mode');
    return null;
  }

  if (!supabaseInstance) {
    supabaseInstance = createClient<Database>(
      SUPABASE_CONFIG.url,
      SUPABASE_CONFIG.anonKey,
      {
        auth: {
          storage: ExpoSecureStoreAdapter,
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
        },
        global: {
          headers: {
            'x-client-info': 'meanly-mobile',
          },
        },
      }
    );
  }

  return supabaseInstance;
}

/**
 * Legacy export for backward compatibility
 * WARNING: This will throw if Supabase is not configured
 * Prefer using getSupabaseClient() instead
 */
export const supabase = new Proxy({} as SupabaseClient<Database>, {
  get(_target, prop) {
    const client = getSupabaseClient();
    if (!client) {
      // Return no-op functions for common methods to prevent crashes
      if (prop === 'auth') {
        return {
          getUser: async () => ({ data: { user: null }, error: null }),
          getSession: async () => ({ data: { session: null }, error: null }),
          signOut: async () => ({ error: null }),
          signInWithPassword: async () => ({ data: { user: null, session: null }, error: { message: 'Supabase not configured' } }),
          signUp: async () => ({ data: { user: null, session: null }, error: { message: 'Supabase not configured' } }),
          resetPasswordForEmail: async () => ({ error: { message: 'Supabase not configured' } }),
          onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        };
      }
      if (prop === 'from') {
        return () => ({
          select: () => ({ data: null, error: { message: 'Supabase not configured' } }),
          insert: () => ({ data: null, error: { message: 'Supabase not configured' } }),
          update: () => ({ data: null, error: { message: 'Supabase not configured' } }),
          delete: () => ({ data: null, error: { message: 'Supabase not configured' } }),
        });
      }
      console.warn(`[Supabase] Not configured - ${String(prop)} called but returning mock`);
      return () => {};
    }
    return (client as any)[prop];
  },
});

// Get current user
export async function getCurrentUser() {
  const client = getSupabaseClient();
  if (!client) return null;
  
  const { data: { user }, error } = await client.auth.getUser();
  if (error) throw error;
  return user;
}

// Get current session
export async function getCurrentSession() {
  const client = getSupabaseClient();
  if (!client) return null;
  
  const { data: { session }, error } = await client.auth.getSession();
  if (error) throw error;
  return session;
}

// Sign out
export async function signOut() {
  const client = getSupabaseClient();
  if (!client) return;
  
  const { error } = await client.auth.signOut();
  if (error) throw error;
}

export default supabase;
