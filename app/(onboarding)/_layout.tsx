/**
 * MEANLY - Onboarding Layout
 * Onboarding flow screens
 */

import React from 'react';
import { Stack } from 'expo-router';

import { useThemeStore } from '../../src/stores/themeStore';

export default function OnboardingLayout() {
  const { colors } = useThemeStore();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.backgrounds.primary },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="goal" />
      <Stack.Screen name="level" />
      <Stack.Screen name="time" />
    </Stack>
  );
}
