/**
 * MEANLY - Root Index
 * Initial redirect based on auth/onboarding state
 */

import { Redirect } from 'expo-router';

import { useAuthStore } from '../src/stores/authStore';
import { useUserStore } from '../src/stores/userStore';

export default function Index() {
  const { isAuthenticated } = useAuthStore();
  const { hasCompletedOnboarding, hasSeenWelcomeScreens } = useUserStore();

  // Show intro screens for first-time users
  if (!hasSeenWelcomeScreens) {
    return <Redirect href="/(auth)/intro" />;
  }

  // Check authentication status
  if (!isAuthenticated()) {
    return <Redirect href="/(auth)/welcome" />;
  }

  // Check onboarding status
  if (!hasCompletedOnboarding) {
    return <Redirect href="/(onboarding)/goal" />;
  }

  // Authenticated and onboarded - go to main tabs
  return <Redirect href="/(tabs)" />;
}
