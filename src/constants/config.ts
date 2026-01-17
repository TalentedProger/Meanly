/**
 * MEANLY App Configuration
 * Environment variables and constants
 */

// Supabase Configuration
export const SUPABASE_CONFIG = {
  url: process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://dagdugwedwiuqzosmjby.supabase.co',
  anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
} as const;

// API Configuration
export const API_CONFIG = {
  timeout: 30000, // 30 seconds
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
} as const;

// LLM Configuration
export const LLM_CONFIG = {
  timeout: 60000, // 60 seconds for LLM responses
  maxRetries: 2,
} as const;

// Cache Configuration
export const CACHE_CONFIG = {
  wordOfTheDayTTL: 24 * 60 * 60 * 1000, // 24 hours
  savedWordsTTL: 7 * 24 * 60 * 60 * 1000, // 7 days
  offlineSyncInterval: 5 * 60 * 1000, // 5 minutes
} as const;

// App Settings
export const APP_CONFIG = {
  name: 'MEANLY',
  version: '1.0.0',
  buildNumber: 1,
  
  // Feature flags
  features: {
    guestMode: true,
    offlineMode: true,
    darkTheme: true,
    pushNotifications: true,
    inAppPurchases: true,
  },
  
  // Default settings
  defaults: {
    dailyGoal: 5, // words per day
    practiceReminderHour: 10, // 10 AM
    wordOfDayHour: 6, // 6 AM
  },
  
  // Limits
  limits: {
    freeWordsPerDay: 3,
    freeSavedWords: 10,
    maxPracticeQueueSize: 20,
  },
} as const;

// Deep Linking
export const DEEP_LINK_CONFIG = {
  scheme: 'meanly',
  host: 'app',
  prefixes: ['meanly://', 'https://meanly.app'],
} as const;

// Analytics Events
export const ANALYTICS_EVENTS = {
  // Auth
  SIGN_UP: 'sign_up',
  SIGN_IN: 'sign_in',
  SIGN_OUT: 'sign_out',
  
  // Onboarding
  ONBOARDING_STARTED: 'onboarding_started',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  GOAL_SELECTED: 'goal_selected',
  LEVEL_SELECTED: 'level_selected',
  
  // Words
  WORD_VIEWED: 'word_viewed',
  WORD_SAVED: 'word_saved',
  WORD_UNSAVED: 'word_unsaved',
  
  // Practice
  PRACTICE_STARTED: 'practice_started',
  PRACTICE_SUBMITTED: 'practice_submitted',
  PRACTICE_COMPLETED: 'practice_completed',
  
  // Subscription
  SUBSCRIPTION_VIEWED: 'subscription_viewed',
  SUBSCRIPTION_STARTED: 'subscription_started',
  SUBSCRIPTION_CANCELLED: 'subscription_cancelled',
  
  // Engagement
  APP_OPENED: 'app_opened',
  PUSH_OPENED: 'push_opened',
  SCREEN_VIEW: 'screen_view',
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  // Auth
  ACCESS_TOKEN: 'auth_access_token',
  REFRESH_TOKEN: 'auth_refresh_token',
  USER_SESSION: 'auth_user_session',
  
  // User Preferences
  THEME: 'pref_theme',
  NOTIFICATIONS_ENABLED: 'pref_notifications',
  DAILY_REMINDER_TIME: 'pref_reminder_time',
  
  // Cache
  WORD_OF_THE_DAY: 'cache_word_of_day',
  SAVED_WORDS: 'cache_saved_words',
  PRACTICE_QUEUE: 'cache_practice_queue',
  OFFLINE_QUEUE: 'cache_offline_queue',
  
  // Onboarding
  ONBOARDING_COMPLETED: 'onboarding_completed',
  SELECTED_GOAL: 'onboarding_goal',
  SELECTED_LEVEL: 'onboarding_level',
  
  // Misc
  LAST_SYNC_TIME: 'last_sync_time',
  PUSH_TOKEN: 'push_token',
} as const;
