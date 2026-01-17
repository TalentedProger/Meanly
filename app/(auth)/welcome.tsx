/**
 * MEANLY - Welcome Screen
 * Современный Welcome экран с тёмным дизайном
 */

import React from 'react';
import { 
  View, 
  StyleSheet, 
  Pressable,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '../../src/components/common';
import { useAuthStore } from '../../src/stores/authStore';
import { BrandColors, Spacing, BorderRadius, Shadows } from '../../src/constants/colors';

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { signInAsGuest, isLoading } = useAuthStore();

  const handleSignIn = () => {
    router.push('/(auth)/sign-in');
  };

  const handleSignUp = () => {
    router.push('/(auth)/sign-up');
  };

  const handleGuestContinue = async () => {
    try {
      await signInAsGuest();
      router.replace('/(tabs)');
    } catch (e) {
      console.error('Guest login error:', e);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={[BrandColors.graphite, '#1A1A1A', '#0F0F0F']}
        style={StyleSheet.absoluteFill}
      />

      {/* Decorative Elements */}
      <View style={styles.decorativeContainer}>
        <View style={[styles.decorativeCircle, styles.circle1]} />
        <View style={[styles.decorativeCircle, styles.circle2]} />
      </View>

      {/* Content */}
      <View style={[styles.content, { paddingTop: insets.top + 60 }]}>
        
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoWrapper}>
            <LinearGradient
              colors={[BrandColors.orange, '#FF7A4A']}
              style={styles.logoGradient}
            >
              <Ionicons name="flash" size={32} color={BrandColors.white} />
            </LinearGradient>
          </View>
        </View>

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.welcomeText}>Добро пожаловать</Text>
          <Text style={styles.appName}>в MEANLY</Text>
          <Text style={styles.tagline}>
            Говори ярче.{'\n'}Выражайся увереннее.
          </Text>
        </View>

        {/* Features */}
        <View style={styles.featuresContainer}>
          <FeatureChip icon="book-outline" text="Слово дня" />
          <FeatureChip icon="create-outline" text="Практика" />
          <FeatureChip icon="trending-up-outline" text="Прогресс" />
        </View>
      </View>

      {/* Bottom Section */}
      <View style={[styles.bottomSection, { paddingBottom: insets.bottom + 24 }]}>
        
        {/* Primary CTA */}
        <Pressable 
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleSignUp}
        >
          <LinearGradient
            colors={[BrandColors.orange, '#D54E20']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}
          >
            <Text style={styles.primaryButtonText}>Начать бесплатно</Text>
            <Ionicons name="arrow-forward" size={20} color={BrandColors.white} />
          </LinearGradient>
        </Pressable>

        {/* Secondary Actions */}
        <Pressable 
          style={styles.secondaryButton}
          onPress={handleSignIn}
        >
          <Text style={styles.secondaryButtonText}>Уже есть аккаунт? Войти</Text>
        </Pressable>

        <Pressable 
          style={styles.guestButton}
          onPress={handleGuestContinue}
          disabled={isLoading}
        >
          <Text style={styles.guestButtonText}>
            {isLoading ? 'Загрузка...' : 'Продолжить как гость'}
          </Text>
        </Pressable>

        {/* Terms */}
        <Text style={styles.terms}>
          Продолжая, вы соглашаетесь с Условиями использования
        </Text>
      </View>
    </View>
  );
}

function FeatureChip({ icon, text }: { icon: keyof typeof Ionicons.glyphMap; text: string }) {
  return (
    <View style={styles.featureChip}>
      <Ionicons name={icon} size={16} color={BrandColors.orange} />
      <Text style={styles.featureChipText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BrandColors.graphite,
  },
  decorativeContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  decorativeCircle: {
    position: 'absolute',
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  circle1: {
    width: 300,
    height: 300,
    top: -100,
    right: -100,
  },
  circle2: {
    width: 200,
    height: 200,
    bottom: 200,
    left: -80,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.screenHorizontal,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoWrapper: {
    ...Shadows.lg,
  },
  logoGradient: {
    width: 72,
    height: 72,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 8,
  },
  appName: {
    fontSize: 42,
    fontWeight: '700',
    color: BrandColors.white,
    marginBottom: 16,
    lineHeight: 52,
    includeFontPadding: false,
  },
  tagline: {
    fontSize: 18,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 26,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  featureChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  featureChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  bottomSection: {
    paddingHorizontal: Spacing.screenHorizontal,
    gap: 12,
  },
  primaryButton: {
    borderRadius: BorderRadius.button,
    overflow: 'hidden',
    ...Shadows.button,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
    gap: 10,
  },
  primaryButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: BrandColors.white,
  },
  secondaryButton: {
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: BorderRadius.button,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: BrandColors.white,
  },
  guestButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  guestButtonText: {
    fontSize: 15,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  terms: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.3)',
    textAlign: 'center',
    marginTop: 8,
  },
});
