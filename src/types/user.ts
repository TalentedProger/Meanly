/**
 * MEANLY - User Types
 * Types for user profiles, preferences, and authentication
 */

// User profile
export interface User {
  id: string;
  email?: string;
  phone?: string;
  
  // Profile info
  displayName?: string;
  avatarUrl?: string;
  
  // Onboarding data (optional until completed)
  goal?: UserGoal;
  level?: UserLevel;
  dailyTimeMinutes?: number;
  
  // Subscription
  subscriptionStatus?: SubscriptionStatus;
  subscriptionExpiresAt?: string;
  
  // Stats
  wordsLearned?: number;
  practiceStreak?: number;
  totalPractices?: number;
  
  // Settings
  language?: 'ru' | 'en';
  timezone?: string;
  
  // Metadata
  createdAt?: string;
  updatedAt?: string;
  lastSeenAt?: string;
  
  // Auth
  authProvider?: AuthProvider;
  isGuest?: boolean;
  hasCompletedOnboarding?: boolean;
}

export type UserGoal = 'confident' | 'beautiful' | 'vocabulary';

export type UserLevel = 'beginner' | 'intermediate' | 'advanced';

export type SubscriptionStatus = 
  | 'free'
  | 'pro'
  | 'pro_trial'
  | 'pro_expired'
  | 'pro_cancelled';

export type AuthProvider = 
  | 'google'
  | 'apple'
  | 'email'
  | 'phone'
  | 'guest';

// User preferences (local storage)
export interface UserPreferences {
  // Theme
  theme: 'light' | 'dark' | 'system';
  
  // Notifications
  notificationsEnabled: boolean;
  wordOfDayPushEnabled: boolean;
  practiceReminderEnabled: boolean;
  practiceReminderTime: string; // HH:MM format
  
  // Learning
  dailyGoal: number; // words per day
  autoPlayPronunciation: boolean;
  showTranslations: boolean;
  
  // Privacy
  analyticsEnabled: boolean;
  crashReportingEnabled: boolean;
}

// Default user preferences
export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  theme: 'system',
  notificationsEnabled: true,
  wordOfDayPushEnabled: true,
  practiceReminderEnabled: true,
  practiceReminderTime: '10:00',
  dailyGoal: 5,
  autoPlayPronunciation: false,
  showTranslations: true,
  analyticsEnabled: true,
  crashReportingEnabled: true,
};

// Auth session
export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // Unix timestamp
  user: User;
}

// Guest user data (for merge on conversion)
export interface GuestUserData {
  savedWordIds: string[];
  practiceHistory: PracticeHistoryItem[];
  onboardingData: OnboardingData;
  preferences: UserPreferences;
}

// Practice history item
export interface PracticeHistoryItem {
  wordId: string;
  sentence: string;
  result: 'correct' | 'partial' | 'incorrect';
  timestamp: string;
  synced: boolean;
}

// Onboarding data
export interface OnboardingData {
  goal?: UserGoal;
  level?: UserLevel;
  dailyTimeMinutes?: number;
  timeCommitment?: string;
  completedAt?: string;
}

// User stats
export interface UserStats {
  wordsLearned: number;
  wordsSaved: number;
  practiceCount: number;
  practiceStreak: number;
  bestStreak: number;
  totalPracticeTime: number; // minutes
  
  // Weekly stats
  weeklyWords: number;
  weeklyPractices: number;
  
  // By level
  wordsByLevel: {
    beginner: number;
    intermediate: number;
    advanced: number;
  };
  
  // By strength
  wordsByStrength: {
    new: number;
    learning: number;
    familiar: number;
    mastered: number;
  };
}

// Notification settings
export interface NotificationSettings {
  wordOfDayEnabled: boolean;
  wordOfDayTime: string; // HH:MM
  practiceReminderEnabled: boolean;
  practiceReminderTime: string;
  weeklyReportEnabled: boolean;
  newContentEnabled: boolean;
}
