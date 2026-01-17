/**
 * MEANLY - Navigation Types
 * Type definitions for Expo Router navigation
 */

import type { Word } from './word';

// Tab routes
export type TabRoutes = {
  index: undefined; // Home
  explore: undefined;
  practice: undefined;
  saved: undefined;
  profile: undefined;
};

// Auth routes
export type AuthRoutes = {
  welcome: undefined;
  'sign-in': undefined;
  'sign-up': undefined;
  'forgot-password': { email?: string };
};

// Onboarding routes
export type OnboardingRoutes = {
  goal: undefined;
  level: undefined;
  time: undefined;
};

// Word routes
export type WordRoutes = {
  '[id]': { id: string };
};

// Category routes
export type CategoryRoutes = {
  '[slug]': { slug: string };
};

// Root routes
export type RootRoutes = {
  '(tabs)': TabRoutes;
  '(auth)': AuthRoutes;
  '(onboarding)': OnboardingRoutes;
  word: WordRoutes;
  category: CategoryRoutes;
  subscription: undefined;
  '+not-found': undefined;
};

// Screen params type helper
export type ScreenParams<T extends keyof RootRoutes> = RootRoutes[T];

// Navigation ref type
export type NavigationState = {
  index: number;
  routes: {
    key: string;
    name: string;
    params?: Record<string, unknown>;
  }[];
};

// Deep link params
export type DeepLinkParams = {
  word?: string; // Word ID for deep linking
  category?: string; // Category slug
  action?: 'practice' | 'view' | 'save';
};

// Tab bar icon names (Ionicons)
export const TAB_ICONS = {
  index: {
    active: 'home',
    inactive: 'home-outline',
  },
  explore: {
    active: 'compass',
    inactive: 'compass-outline',
  },
  practice: {
    active: 'play-circle',
    inactive: 'play-circle-outline',
  },
  saved: {
    active: 'bookmark',
    inactive: 'bookmark-outline',
  },
  profile: {
    active: 'person',
    inactive: 'person-outline',
  },
} as const;

// Tab bar labels (Russian)
export const TAB_LABELS = {
  index: 'Главная',
  explore: 'Поиск',
  practice: 'Практика',
  saved: 'Избранные',
  profile: 'Профиль',
} as const;
