/**
 * MEANLY - Auth Store
 * User authentication state management
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import type { User, AuthSession } from '../types/user';
import * as authServiceModule from '../services/supabase/auth';

interface AuthState {
  // State
  user: User | null;
  session: AuthSession | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  
  // Actions
  setUser: (user: User | null) => void;
  setSession: (session: AuthSession | null) => void;
  setLoading: (isLoading: boolean) => void;
  setInitialized: (isInitialized: boolean) => void;
  setError: (error: string | null) => void;
  
  // Auth methods
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signInAsGuest: () => Promise<void>;
  signOut: () => Promise<void>;
  
  // Computed
  isAuthenticated: () => boolean;
  isGuest: () => boolean;
  
  // Reset
  reset: () => void;
}

const initialState = {
  user: null,
  session: null,
  isLoading: false,
  isInitialized: false,
  error: null,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Actions
      setUser: (user) => set({ user, error: null }),
      
      setSession: (session) => set({ 
        session,
        user: session?.user || null,
        error: null,
      }),
      
      setLoading: (isLoading) => set({ isLoading }),
      
      setInitialized: (isInitialized) => set({ isInitialized }),
      
      setError: (error) => set({ error, isLoading: false }),
      
      // Auth methods
      signIn: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const result = await authServiceModule.signInWithEmail({ email, password });
          if (result?.user) {
            const user: User = {
              id: result.user.id,
              email: result.user.email || '',
              isGuest: false,
              createdAt: result.user.created_at,
            };
            set({ user, isLoading: false });
          }
        } catch (e: any) {
          const errorMessage = authServiceModule.formatAuthError(e);
          set({ error: errorMessage, isLoading: false });
          throw e;
        }
      },
      
      signUp: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const result = await authServiceModule.signUpWithEmail({ email, password });
          if (result?.user) {
            const user: User = {
              id: result.user.id,
              email: result.user.email || '',
              isGuest: false,
              createdAt: result.user.created_at,
            };
            set({ user, isLoading: false });
          }
        } catch (e: any) {
          const errorMessage = authServiceModule.formatAuthError(e);
          set({ error: errorMessage, isLoading: false });
          throw e;
        }
      },
      
      signInWithGoogle: async () => {
        set({ isLoading: true, error: null });
        try {
          // Note: In real app, you would get idToken from expo-auth-session
          // For now, this is a placeholder
          throw new Error('Google sign-in requires expo-auth-session setup');
        } catch (e: any) {
          const errorMessage = authServiceModule.formatAuthError(e);
          set({ error: errorMessage, isLoading: false });
          throw e;
        }
      },
      
      signInWithApple: async () => {
        set({ isLoading: true, error: null });
        try {
          // Note: In real app, you would get idToken from expo-apple-authentication
          // For now, this is a placeholder
          throw new Error('Apple sign-in requires expo-apple-authentication setup');
        } catch (e: any) {
          const errorMessage = authServiceModule.formatAuthError(e);
          set({ error: errorMessage, isLoading: false });
          throw e;
        }
      },
      
      signInAsGuest: async () => {
        set({ isLoading: true, error: null });
        try {
          // Локальный гостевой режим без Supabase
          const guestUser: User = {
            id: `guest_${Date.now()}`,
            email: '',
            isGuest: true,
            createdAt: new Date().toISOString(),
          };
          set({ user: guestUser, isLoading: false, isInitialized: true });
        } catch (e: any) {
          set({ error: 'Не удалось войти как гость', isLoading: false });
          throw e;
        }
      },
      
      signOut: async () => {
        set({ isLoading: true });
        try {
          await authServiceModule.signOut();
          set(initialState);
        } catch (e) {
          set({ isLoading: false });
          throw e;
        }
      },

      // Computed
      isAuthenticated: () => {
        const { user } = get();
        return !!user;
      },

      isGuest: () => {
        const { user } = get();
        return user?.isGuest === true;
      },

      // Reset
      reset: () => set(initialState),
    }),
    {
      name: 'meanly-auth',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        isInitialized: state.isInitialized,
      }),
    }
  )
);
