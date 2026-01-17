/**
 * MEANLY - Practice Screen
 * Практика изученных слов
 */

import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  Pressable,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '../../src/components/common';
import { useThemeStore } from '../../src/stores/themeStore';
import { BrandColors, Spacing, BorderRadius, Shadows } from '../../src/constants/colors';

export default function PracticeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useThemeStore();
  const [isSessionActive, setIsSessionActive] = useState(false);

  const handleStartPractice = () => {
    setIsSessionActive(true);
    // TODO: Navigate to practice session
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.backgrounds.primary }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Практика</Text>
          <Text style={[styles.headerSubtitle, { color: colors.text.secondary }]}>Закрепи изученные слова</Text>
        </View>

        {/* Main Practice Card */}
        <View style={styles.mainCardContainer}>
          <LinearGradient
            colors={['#1a1a2e', '#16213e', '#0f3d3e', BrandColors.deepGreen]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.mainCard}
          >
            <View style={styles.mainCardIcon}>
              <Ionicons name="play-circle" size={64} color="rgba(255,255,255,0.95)" />
            </View>
            
            <Text style={styles.mainCardTitle}>Начни практику</Text>
            <Text style={styles.mainCardSubtitle}>
              Мы подберём слова из твоего списка для повторения и практики
            </Text>

            <Pressable 
              style={({ pressed }) => [
                styles.startButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleStartPractice}
            >
              <Text style={styles.startButtonText}>Начать сессию</Text>
              <Ionicons name="arrow-forward" size={18} color={BrandColors.white} />
            </Pressable>
          </LinearGradient>
        </View>

        {/* Practice Types */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Виды практики</Text>
          
          <PracticeTypeCard 
            icon="flash"
            iconColor={BrandColors.steelBlue}
            title="Быстрая практика"
            subtitle="5 слов • ~2 минуты"
            onPress={() => {}}
          />
          
          <PracticeTypeCard 
            icon="refresh"
            iconColor={BrandColors.orange}
            title="Повторение"
            subtitle="Слова для закрепления"
            onPress={() => {}}
          />
          
          <PracticeTypeCard 
            icon="trophy"
            iconColor={BrandColors.deepGreen}
            title="Испытание"
            subtitle="Проверь свои знания"
            onPress={() => {}}
          />
        </View>

        {/* Stats */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Статистика</Text>
          
          <View style={styles.statsGrid}>
            <View style={[styles.statItem, { backgroundColor: isDark ? colors.backgrounds.card : BrandColors.white }]}>
              <View style={[styles.statIcon, { backgroundColor: 'rgba(236, 94, 39, 0.1)' }]}>
                <Ionicons name="time-outline" size={20} color={BrandColors.orange} />
              </View>
              <Text style={[styles.statValue, { color: colors.text.primary }]}>0</Text>
              <View style={styles.statLabelContainer}>
                <Text style={[styles.statLabel, { color: colors.text.secondary }]}>минут</Text>
                <Text style={[styles.statLabel, { color: colors.text.secondary }]}>сегодня</Text>
              </View>
            </View>
            
            <View style={[styles.statItem, { backgroundColor: isDark ? colors.backgrounds.card : BrandColors.white }]}>
              <View style={[styles.statIcon, { backgroundColor: 'rgba(38, 83, 141, 0.1)' }]}>
                <Ionicons name="checkmark-circle-outline" size={20} color={BrandColors.steelBlue} />
              </View>
              <Text style={[styles.statValue, { color: colors.text.primary }]}>0</Text>
              <View style={styles.statLabelContainer}>
                <Text style={[styles.statLabel, { color: colors.text.secondary }]}>слов</Text>
                <Text style={[styles.statLabel, { color: colors.text.secondary }]}>повторено</Text>
              </View>
            </View>
            
            <View style={[styles.statItem, { backgroundColor: isDark ? colors.backgrounds.card : BrandColors.white }]}>
              <View style={[styles.statIcon, { backgroundColor: 'rgba(0, 49, 31, 0.1)' }]}>
                <Ionicons name="trending-up-outline" size={20} color={BrandColors.deepGreen} />
              </View>
              <Text style={[styles.statValue, { color: colors.text.primary }]}>0%</Text>
              <View style={styles.statLabelContainer}>
                <Text style={[styles.statLabel, { color: colors.text.secondary }]}>точность</Text>
                <Text style={[styles.statLabel, { color: colors.text.secondary }]}>понимания</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Tips */}
        <View style={styles.tipCard}>
          <View style={styles.tipIcon}>
            <Ionicons name="bulb" size={20} color={BrandColors.steelBlue} />
          </View>
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Совет дня</Text>
            <Text style={styles.tipText}>
              Практикуйтесь каждый день по 5-10 минут для лучшего запоминания слов
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function PracticeTypeCard({ 
  icon, 
  iconColor,
  title, 
  subtitle,
  onPress,
}: { 
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <Pressable 
      style={({ pressed }) => [
        styles.typeCard,
        { borderColor: iconColor + '30' },
        pressed && styles.typeCardPressed,
      ]}
      onPress={onPress}
    >
      <View style={[styles.typeIcon, { backgroundColor: iconColor + '15' }]}>
        <Ionicons name={icon} size={22} color={iconColor} />
      </View>
      <View style={styles.typeContent}>
        <Text style={styles.typeTitle}>{title}</Text>
        <Text style={styles.typeSubtitle}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={iconColor} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.screenHorizontal,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 20,
    paddingTop: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: BrandColors.graphite,
    marginBottom: 4,
    lineHeight: 38,
    includeFontPadding: false,
  },
  headerSubtitle: {
    fontSize: 15,
    fontWeight: '400',
    color: '#6B7280',
  },
  mainCardContainer: {
    ...Shadows.lg,
    borderRadius: BorderRadius.card,
    marginBottom: 28,
    overflow: 'hidden',
  },
  mainCard: {
    padding: 28,
    borderRadius: BorderRadius.card,
    alignItems: 'center',
  },
  mainCardIcon: {
    marginBottom: 16,
  },
  mainCardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: BrandColors.white,
    marginBottom: 8,
    textAlign: 'center',
  },
  mainCardSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: BorderRadius.button,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: BrandColors.white,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: BrandColors.graphite,
    marginBottom: 14,
  },
  typeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BrandColors.white,
    padding: 16,
    borderRadius: BorderRadius.lg,
    marginBottom: 10,
    borderWidth: 1.5,
    ...Shadows.md,
  },
  typeCardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  typeIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  typeContent: {
    flex: 1,
  },
  typeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: BrandColors.graphite,
    marginBottom: 3,
  },
  typeSubtitle: {
    fontSize: 13,
    fontWeight: '400',
    color: '#6B7280',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  statItem: {
    flex: 1,
    backgroundColor: BrandColors.white,
    padding: 14,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    ...Shadows.md,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 6,
    lineHeight: 30,
    includeFontPadding: false,
  },
  statLabelContainer: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 15,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(38, 83, 141, 0.08)',
    padding: 16,
    borderRadius: BorderRadius.lg,
    marginBottom: 20,
  },
  tipIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(38, 83, 141, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: BrandColors.steelBlue,
    marginBottom: 4,
  },
  tipText: {
    fontSize: 13,
    fontWeight: '400',
    color: '#4B5563',
    lineHeight: 18,
  },
});
