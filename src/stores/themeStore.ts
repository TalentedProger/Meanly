/**
 * MEANLY - Theme Store
 * Theme (light/dark) state management
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance, ColorSchemeName } from 'react-native';

import { Colors, ColorsDark, ThemeColors } from '../constants/colors';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  // Theme mode
  mode: ThemeMode;
  
  // Computed actual theme
  isDark: boolean;
  colors: ThemeColors;
  
  // Actions
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  
  // System theme listener
  updateSystemTheme: (colorScheme: ColorSchemeName) => void;
}

const getSystemTheme = (): boolean => {
  return Appearance.getColorScheme() === 'dark';
};

const initialIsDark = getSystemTheme();

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'system',
      isDark: initialIsDark,
      colors: initialIsDark ? ColorsDark : Colors,

      setMode: (mode) => {
        let isDark: boolean;
        
        switch (mode) {
          case 'dark':
            isDark = true;
            break;
          case 'light':
            isDark = false;
            break;
          case 'system':
          default:
            isDark = getSystemTheme();
            break;
        }

        set({
          mode,
          isDark,
          colors: isDark ? ColorsDark : Colors,
        });
      },

      toggleTheme: () => {
        const { mode, isDark } = get();
        
        // If in system mode, switch to manual mode
        if (mode === 'system') {
          set({
            mode: isDark ? 'light' : 'dark',
            isDark: !isDark,
            colors: isDark ? Colors : ColorsDark,
          });
        } else {
          // Toggle between light and dark
          const newMode = mode === 'light' ? 'dark' : 'light';
          set({
            mode: newMode,
            isDark: newMode === 'dark',
            colors: newMode === 'dark' ? ColorsDark : Colors,
          });
        }
      },

      updateSystemTheme: (colorScheme) => {
        const { mode } = get();
        
        // Only update if in system mode
        if (mode === 'system') {
          const isDark = colorScheme === 'dark';
          set({
            isDark,
            colors: isDark ? ColorsDark : Colors,
          });
        }
      },
    }),
    {
      name: 'meanly-theme',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        mode: state.mode,
      }),
      onRehydrateStorage: () => (state) => {
        // After rehydration, recalculate isDark and colors based on mode
        if (state) {
          let isDark: boolean;
          switch (state.mode) {
            case 'dark':
              isDark = true;
              break;
            case 'light':
              isDark = false;
              break;
            case 'system':
            default:
              isDark = getSystemTheme();
              break;
          }
          state.isDark = isDark;
          state.colors = isDark ? ColorsDark : Colors;
        }
      },
    }
  )
);

// Setup system theme listener
export function setupThemeListener() {
  const subscription = Appearance.addChangeListener(({ colorScheme }) => {
    useThemeStore.getState().updateSystemTheme(colorScheme);
  });
  
  return () => subscription.remove();
}
