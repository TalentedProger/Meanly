/**
 * MEANLY - Home Screen (Tab)
 * Современный главный экран со словом дня
 */

import React, { useEffect } from 'react';
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
import { useWordStore } from '../../src/stores/wordStore';
import { useAuthStore } from '../../src/stores/authStore';
import { BrandColors, Spacing, BorderRadius, Shadows } from '../../src/constants/colors';

// Цвета уровней сложности
const LevelColors = {
  beginner: '#10B981',     // Зелёный
  intermediate: '#F59E0B', // Жёлтый/Оранжевый
  advanced: '#EF4444',     // Красный
};

const getLevelColor = (level: string) => {
  return LevelColors[level as keyof typeof LevelColors] || LevelColors.intermediate;
};

const getLevelText = (level: string) => {
  switch (level) {
    case 'beginner': return 'Начальный';
    case 'intermediate': return 'Средний';
    case 'advanced': return 'Продвинутый';
    default: return 'Средний';
  }
};

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useThemeStore();
  const { wordOfTheDay, isLoadingWordOfDay, loadWordOfTheDay } = useWordStore();
  const { user } = useAuthStore();

  // Load word of the day on mount
  useEffect(() => {
    loadWordOfTheDay();
  }, []);

  // Use loaded word or fallback
  const displayWord = wordOfTheDay || {
    id: 'demo',
    word: 'Великолепный',
    baseWord: 'Хороший',
    definition: 'Превосходящий обычный уровень, выдающийся по своим качествам, вызывающий восхищение.',
    level: 'intermediate',
    partOfSpeech: 'прилагательное',
    goodExample: {
      sentence: 'Сегодня был великолепный закат — небо переливалось оттенками розового и золотого.'
    },
  };

  const handlePractice = () => {
    router.push(`/word/${displayWord.id}`);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Доброе утро';
    if (hour < 18) return 'Добрый день';
    return 'Добрый вечер';
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
          <View style={styles.headerLeft}>
            <View style={[styles.greetingContainer, { borderBottomColor: colors.text.primary }]}>
              <Text style={[styles.greeting, { color: colors.text.primary }]}>
                {getGreeting()}, <Text style={[styles.greetingName, { color: colors.text.primary }]}>{user?.isGuest ? 'Гость' : (user?.displayName || 'Пользователь')}</Text>
              </Text>
            </View>
          </View>
          <Pressable style={styles.profileButton}>
            <LinearGradient
              colors={[BrandColors.orange, '#D54E20']}
              style={styles.profileGradient}
            >
              <Ionicons name="person" size={18} color={BrandColors.white} />
            </LinearGradient>
          </Pressable>
        </View>

        {/* Date Badge */}
        <View style={styles.dateBadge}>
          <Ionicons name="calendar-outline" size={14} color={BrandColors.steelBlue} />
          <Text style={styles.dateText}>
            {new Date().toLocaleDateString('ru-RU', { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'long' 
            })}
          </Text>
        </View>

        {/* Word of the Day Card */}
        <View style={styles.wordCardContainer}>
          <LinearGradient
            colors={[BrandColors.graphite, '#1F1F1F']}
            style={styles.wordCard}
          >
            {/* Card Header */}
            <View style={styles.cardHeader}>
              <View style={styles.wordOfDayBadge}>
                <Ionicons name="sparkles" size={12} color={BrandColors.orange} />
                <Text style={styles.wordOfDayText}>Слово дня</Text>
              </View>
              <View style={[styles.levelBadgeContainer, { backgroundColor: getLevelColor(displayWord.level) + '25' }]}>
                <View style={[styles.levelDot, { backgroundColor: getLevelColor(displayWord.level) }]} />
                <Text style={[styles.levelBadgeText, { color: getLevelColor(displayWord.level) }]}>
                  {getLevelText(displayWord.level)}
                </Text>
              </View>
            </View>

            {/* Word */}
            <Text style={styles.word}>{displayWord.word}</Text>
            
            {/* Base Word */}
            <View style={styles.baseWordContainer}>
              <Ionicons name="swap-horizontal" size={14} color="rgba(255,255,255,0.5)" />
              <Text style={styles.baseWord}>вместо: {displayWord.baseWord}</Text>
            </View>

            {/* Definition */}
            <Text style={styles.definition}>{displayWord.definition}</Text>

            {/* Example */}
            <View style={styles.exampleContainer}>
              <Text style={styles.exampleLabel}>Пример использования:</Text>
              <Text style={styles.example}>«{displayWord.goodExample?.sentence}»</Text>
            </View>

            {/* Action Button */}
            <Pressable 
              style={({ pressed }) => [
                styles.practiceButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={handlePractice}
            >
              <Text style={styles.practiceButtonText}>Изучить слово</Text>
              <Ionicons name="arrow-forward" size={18} color={BrandColors.graphite} />
            </Pressable>
          </LinearGradient>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Ваш прогресс</Text>
          <View style={styles.statsRow}>
            <StatCard 
              icon="checkmark-circle" 
              value="0" 
              label="Изучено" 
              color={BrandColors.orange}
              isDark={isDark}
            />
            <StatCard 
              icon="bookmark" 
              value="0" 
              label="Сохранено" 
              color={BrandColors.steelBlue}
              isDark={isDark}
            />
            <StatCard 
              icon="flame" 
              value="0" 
              label="Серия дней" 
              color={BrandColors.deepGreen}
              isDark={isDark}
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Быстрые действия</Text>
          <View style={styles.actionsGrid}>
            <ActionCard 
              icon="library-outline" 
              title="Все слова" 
              subtitle="Просмотреть каталог"
              onPress={() => router.push('/(tabs)/explore')}
            />
            <ActionCard 
              icon="create-outline" 
              title="Практика" 
              subtitle="Тренировать слова"
              onPress={() => router.push('/(tabs)/practice')}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function StatCard({ 
  icon, 
  value, 
  label, 
  color,
  isDark,
}: { 
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  label: string;
  color: string;
  isDark: boolean;
}) {
  // Создаём градиентные цвета на основе основного цвета - ярче для тёмной темы
  const gradientColors = isDark 
    ? [color + '35', color + '50'] // Более яркие для тёмной темы
    : [color + '12', color + '20'];

  return (
    <View style={[styles.statCard, { borderColor: isDark ? color + '70' : color + '40' }]}>
      <LinearGradient
        colors={gradientColors as [string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.statCardGradient}
      >
        <View style={[styles.statIconContainer, { backgroundColor: isDark ? color + '50' : color + '25' }]}>
          <Ionicons name={icon} size={22} color={isDark ? BrandColors.white : color} />
        </View>
        <Text style={[styles.statValue, isDark && styles.statValueDark]}>{value}</Text>
        <Text style={[styles.statLabel, isDark && styles.statLabelDark]}>{label}</Text>
      </LinearGradient>
    </View>
  );
}

function ActionCard({ 
  icon, 
  title, 
  subtitle,
  onPress,
}: { 
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <Pressable 
      style={({ pressed }) => [
        styles.actionCard,
        pressed && styles.actionCardPressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.actionIconContainer}>
        <Ionicons name={icon} size={24} color={BrandColors.graphite} />
      </View>
      <Text style={styles.actionTitle}>{title}</Text>
      <Text style={styles.actionSubtitle}>{subtitle}</Text>
      <Ionicons 
        name="chevron-forward" 
        size={16} 
        color={BrandColors.graphite} 
        style={styles.actionArrow}
      />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 12,
  },
  headerLeft: {
    flex: 1,
  },
  greetingContainer: {
    alignSelf: 'flex-start',
    borderBottomWidth: 2,
    paddingBottom: 4,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28,
    includeFontPadding: false,
  },
  greetingName: {
    fontSize: 22,
    fontWeight: '800',
  },
  profileButton: {
    ...Shadows.sm,
  },
  profileGradient: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(38, 83, 141, 0.1)',
    borderRadius: BorderRadius.full,
    marginBottom: 20,
  },
  dateText: {
    fontSize: 13,
    fontWeight: '500',
    color: BrandColors.steelBlue,
    textTransform: 'capitalize',
  },
  wordCardContainer: {
    ...Shadows.lg,
    borderRadius: BorderRadius.card,
    marginBottom: 28,
  },
  wordCard: {
    padding: 24,
    paddingTop: 20,
    paddingBottom: 24,
    borderRadius: BorderRadius.card,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  wordOfDayBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'rgba(236, 94, 39, 0.15)',
    borderRadius: BorderRadius.full,
  },
  wordOfDayText: {
    fontSize: 12,
    fontWeight: '600',
    color: BrandColors.orange,
  },
  levelBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
  },
  levelDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  levelBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  word: {
    fontSize: 34,
    fontWeight: '700',
    color: BrandColors.white,
    marginBottom: 10,
    lineHeight: 42,
  },
  baseWordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  baseWord: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  definition: {
    fontSize: 16,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 24,
    marginBottom: 20,
  },
  exampleContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    padding: 16,
    borderRadius: BorderRadius.md,
    marginBottom: 20,
  },
  exampleLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.5)',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  example: {
    fontSize: 15,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.9)',
    fontStyle: 'italic',
    lineHeight: 22,
  },
  practiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: BrandColors.white,
    paddingVertical: 16,
    borderRadius: BorderRadius.button,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  practiceButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: BrandColors.graphite,
  },
  statsSection: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: BrandColors.graphite,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'transparent',
    ...Shadows.md,
  },
  statCardGradient: {
    padding: 16,
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
    minHeight: 110,
    justifyContent: 'center',
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: BrandColors.graphite,
    marginBottom: 4,
    lineHeight: 34,
    includeFontPadding: false,
  },
  statValueDark: {
    color: BrandColors.white,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  statLabelDark: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  actionsSection: {
    marginBottom: 20,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: BrandColors.white,
    padding: 16,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    ...Shadows.md,
  },
  actionCardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  actionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: BrandColors.graphite,
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 12,
    fontWeight: '400',
    color: '#6B7280',
  },
  actionArrow: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
});
