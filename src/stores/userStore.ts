/**
 * MEANLY - User Store
 * User profile and preferences state management
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import type { 
  User, 
  UserPreferences, 
  OnboardingData, 
  UserStats,
  UserGoal,
  UserLevel,
} from '../types/user';
import { DEFAULT_USER_PREFERENCES } from '../types/user';

interface UserState {
  // Profile
  profile: User | null;
  
  // Preferences
  preferences: UserPreferences;
  
  // Onboarding
  onboardingData: OnboardingData;
  hasCompletedOnboarding: boolean;
  
  // First launch welcome screens
  hasSeenWelcomeScreens: boolean;
  
  // Stats
  stats: UserStats | null;
  
  // Loading states
  isLoadingProfile: boolean;
  isLoadingStats: boolean;
  
  // Error
  error: string | null;
  
  // Actions - Profile
  setProfile: (profile: User | null) => void;
  updateProfile: (updates: Partial<User>) => void;
  
  // Actions - Preferences
  setPreferences: (preferences: UserPreferences) => void;
  updatePreference: <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => void;
  
  // Actions - Onboarding
  setOnboardingData: (data: OnboardingData) => void;
  setGoal: (goal: UserGoal) => void;
  setLevel: (level: UserLevel) => void;
  setDailyTime: (minutes: number) => void;
  completeOnboarding: () => void;
  
  // Actions - Welcome screens
  completeWelcomeScreens: () => void;
  
  // Actions - Stats
  setStats: (stats: UserStats) => void;
  incrementWordCount: () => void;
  incrementPracticeCount: () => void;
  updateStreak: (streak: number) => void;
  
  // Loading
  setLoadingProfile: (isLoading: boolean) => void;
  setLoadingStats: (isLoading: boolean) => void;
  
  // Error
  setError: (error: string | null) => void;
  
  // Reset
  reset: () => void;
}

const initialState = {
  profile: null,
  preferences: DEFAULT_USER_PREFERENCES,
  onboardingData: {},
  hasCompletedOnboarding: false,
  hasSeenWelcomeScreens: false,
  stats: null,
  isLoadingProfile: false,
  isLoadingStats: false,
  error: null,
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Profile Actions
      setProfile: (profile) => set({ profile, error: null }),
      
      updateProfile: (updates) => {
        const { profile } = get();
        if (profile) {
          set({ profile: { ...profile, ...updates } });
        }
      },

      // Preferences Actions
      setPreferences: (preferences) => set({ preferences }),
      
      updatePreference: (key, value) => {
        const { preferences } = get();
        set({ preferences: { ...preferences, [key]: value } });
      },

      // Onboarding Actions
      setOnboardingData: (data) => set({ onboardingData: data }),
      
      setGoal: (goal) => {
        const { onboardingData } = get();
        set({ onboardingData: { ...onboardingData, goal } });
      },
      
      setLevel: (level) => {
        const { onboardingData } = get();
        set({ onboardingData: { ...onboardingData, level } });
      },
      
      setDailyTime: (dailyTimeMinutes) => {
        const { onboardingData } = get();
        set({ onboardingData: { ...onboardingData, dailyTimeMinutes } });
      },
      
      completeOnboarding: () => {
        const { onboardingData } = get();
        set({
          hasCompletedOnboarding: true,
          onboardingData: {
            ...onboardingData,
            completedAt: new Date().toISOString(),
          },
        });
      },

      // Welcome Screens
      completeWelcomeScreens: () => {
        set({ hasSeenWelcomeScreens: true });
      },

      // Stats Actions
      setStats: (stats) => set({ stats }),
      
      incrementWordCount: () => {
        const { stats } = get();
        if (stats) {
          set({ 
            stats: { 
              ...stats, 
              wordsLearned: stats.wordsLearned + 1,
              weeklyWords: stats.weeklyWords + 1,
            } 
          });
        }
      },
      
      incrementPracticeCount: () => {
        const { stats } = get();
        if (stats) {
          set({ 
            stats: { 
              ...stats, 
              practiceCount: stats.practiceCount + 1,
              weeklyPractices: stats.weeklyPractices + 1,
            } 
          });
        }
      },
      
      updateStreak: (streak) => {
        const { stats } = get();
        if (stats) {
          set({ 
            stats: { 
              ...stats, 
              practiceStreak: streak,
              bestStreak: Math.max(stats.bestStreak, streak),
            } 
          });
        }
      },

      // Loading
      setLoadingProfile: (isLoadingProfile) => set({ isLoadingProfile }),
      setLoadingStats: (isLoadingStats) => set({ isLoadingStats }),

      // Error
      setError: (error) => set({ error }),

      // Reset
      reset: () => set(initialState),
    }),
    {
      name: 'meanly-user',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        preferences: state.preferences,
        onboardingData: state.onboardingData,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        hasSeenWelcomeScreens: state.hasSeenWelcomeScreens,
      }),
    }
  )
);
