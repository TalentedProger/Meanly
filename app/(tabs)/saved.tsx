/**
 * MEANLY - Saved Words Screen
 * Сохранённые слова пользователя
 */

import React from 'react';
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
import { useSavedWordsStore } from '../../src/stores/savedWordsStore';
import { BrandColors, Spacing, BorderRadius, Shadows } from '../../src/constants/colors';

export default function SavedScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useThemeStore();
  const { savedWords, getTotalCount } = useSavedWordsStore();
  
  const totalCount = getTotalCount();

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
          <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Избранные</Text>
          <Text style={[styles.headerSubtitle, { color: colors.text.secondary }]}>
            {totalCount > 0 ? `${totalCount} слов в коллекции` : 'Твоя коллекция слов'}
          </Text>
        </View>

        {totalCount === 0 ? (
          /* Empty State */
          <View style={styles.emptyState}>
            <View style={[styles.emptyCard, { backgroundColor: isDark ? colors.backgrounds.card : BrandColors.white }]}>
              <View style={styles.emptyIconContainer}>
                <LinearGradient
                  colors={[BrandColors.steelBlue + '30', BrandColors.steelBlue + '10']}
                  style={styles.emptyIcon}
                >
                  <Ionicons name="bookmark-outline" size={48} color={BrandColors.steelBlue} />
                </LinearGradient>
              </View>
              
              <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>Пока пусто</Text>
              <Text style={[styles.emptyDescription, { color: colors.text.secondary }]}>
                Сохраняй слова, которые хочешь выучить, и они появятся здесь
              </Text>
              
              <Pressable 
                style={({ pressed }) => [
                  styles.exploreButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={() => router.push('/(tabs)/explore')}
              >
                <LinearGradient
                  colors={[BrandColors.steelBlue, '#1E3A5F']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.exploreButtonGradient}
                >
                  <Ionicons name="compass-outline" size={18} color={BrandColors.white} />
                  <Text style={styles.exploreButtonText}>Исследовать слова</Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>
        ) : (
          <>
            {/* Filter Chips */}
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.filtersScroll}
              contentContainerStyle={styles.filtersContainer}
            >
              <FilterChip label="Все" active />
              <FilterChip label="Новые" count={0} />
              <FilterChip label="Изучаю" count={0} />
              <FilterChip label="Знакомые" count={0} />
              <FilterChip label="Освоено" count={0} />
              <FilterChip label="Избранное" icon="heart" />
            </ScrollView>

            {/* Words List */}
            <View style={styles.wordsList}>
              {savedWords.map((item) => (
                <WordCard 
                  key={item.id}
                  word={item.word.word}
                  definition={item.word.definition}
                  strength={item.strength}
                  isFavorite={item.isFavorite}
                  onPress={() => {}}
                />
              ))}
            </View>
          </>
        )}

        {/* Quick Tips for empty state */}
        {totalCount === 0 && (
          <View style={[styles.tipsSection, { backgroundColor: isDark ? colors.backgrounds.card : BrandColors.white }]}>
            <Text style={[styles.tipsTitle, { color: colors.text.primary }]}>Как добавить слова?</Text>
            
            <View style={styles.tipItem}>
              <View style={[styles.tipNumber, { backgroundColor: isDark ? 'rgba(236, 94, 39, 0.2)' : 'rgba(236, 94, 39, 0.1)' }]}>
                <Text style={styles.tipNumberText}>1</Text>
              </View>
              <Text style={[styles.tipText, { color: colors.text.secondary }]}>
                Открой слово дня на главном экране
              </Text>
            </View>
            
            <View style={styles.tipItem}>
              <View style={[styles.tipNumber, { backgroundColor: isDark ? 'rgba(236, 94, 39, 0.2)' : 'rgba(236, 94, 39, 0.1)' }]}>
                <Text style={styles.tipNumberText}>2</Text>
              </View>
              <Text style={[styles.tipText, { color: colors.text.secondary }]}>
                Нажми кнопку "Изучить слово"
              </Text>
            </View>
            
            <View style={styles.tipItem}>
              <View style={[styles.tipNumber, { backgroundColor: isDark ? 'rgba(236, 94, 39, 0.2)' : 'rgba(236, 94, 39, 0.1)' }]}>
                <Text style={styles.tipNumberText}>3</Text>
              </View>
              <Text style={[styles.tipText, { color: colors.text.secondary }]}>
                Сохрани слово в свою коллекцию
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function FilterChip({ 
  label, 
  count,
  icon,
  active = false,
}: { 
  label: string;
  count?: number;
  icon?: keyof typeof Ionicons.glyphMap;
  active?: boolean;
}) {
  return (
    <Pressable 
      style={[
        styles.filterChip,
        active && styles.filterChipActive,
      ]}
    >
      {icon && (
        <Ionicons 
          name={icon} 
          size={14} 
          color={active ? BrandColors.white : BrandColors.graphite} 
        />
      )}
      <Text style={[
        styles.filterChipText,
        active && styles.filterChipTextActive,
      ]}>
        {label}
      </Text>
      {count !== undefined && count > 0 && (
        <View style={[
          styles.filterChipBadge,
          active && styles.filterChipBadgeActive,
        ]}>
          <Text style={[
            styles.filterChipBadgeText,
            active && styles.filterChipBadgeTextActive,
          ]}>
            {count}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

function WordCard({ 
  word, 
  definition,
  strength,
  isFavorite,
  onPress,
}: { 
  word: string;
  definition: string;
  strength: string;
  isFavorite: boolean;
  onPress: () => void;
}) {
  const getStrengthColor = () => {
    switch (strength) {
      case 'mastered': return BrandColors.deepGreen;
      case 'familiar': return BrandColors.steelBlue;
      case 'learning': return BrandColors.orange;
      default: return '#9CA3AF';
    }
  };

  const getStrengthLabel = () => {
    switch (strength) {
      case 'mastered': return 'Освоено';
      case 'familiar': return 'Знакомо';
      case 'learning': return 'Изучаю';
      default: return 'Новое';
    }
  };

  return (
    <Pressable 
      style={({ pressed }) => [
        styles.wordCard,
        pressed && styles.wordCardPressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.wordCardContent}>
        <View style={styles.wordCardHeader}>
          <Text style={styles.wordCardTitle}>{word}</Text>
          {isFavorite && (
            <Ionicons name="heart" size={16} color="#EF4444" />
          )}
        </View>
        <Text style={styles.wordCardDefinition} numberOfLines={2}>
          {definition}
        </Text>
      </View>
      <View style={styles.wordCardMeta}>
        <View style={[styles.strengthBadge, { backgroundColor: getStrengthColor() + '15' }]}>
          <Text style={[styles.strengthText, { color: getStrengthColor() }]}>
            {getStrengthLabel()}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
      </View>
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
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: Spacing.screenHorizontal,
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
  emptyState: {
    paddingHorizontal: Spacing.screenHorizontal,
    paddingTop: 20,
  },
  emptyCard: {
    alignItems: 'center',
    padding: 32,
    borderRadius: BorderRadius.card,
    ...Shadows.md,
  },
  emptyIconContainer: {
    marginBottom: 24,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: BrandColors.graphite,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 15,
    fontWeight: '400',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
    paddingHorizontal: 10,
  },
  exploreButton: {
    borderRadius: BorderRadius.button,
    overflow: 'hidden',
  },
  exploreButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 28,
    paddingVertical: 16,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  exploreButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: BrandColors.white,
  },
  tipsSection: {
    paddingHorizontal: Spacing.screenHorizontal,
    marginHorizontal: Spacing.screenHorizontal,
    marginTop: 40,
    padding: 20,
    borderRadius: BorderRadius.card,
    ...Shadows.sm,
  },
  tipsTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: BrandColors.graphite,
    marginBottom: 20,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  tipNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(236, 94, 39, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tipNumberText: {
    fontSize: 13,
    fontWeight: '700',
    color: BrandColors.orange,
  },
  tipText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#4B5563',
    flex: 1,
  },
  filtersScroll: {
    marginBottom: 16,
  },
  filtersContainer: {
    paddingHorizontal: Spacing.screenHorizontal,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: BrandColors.white,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterChipActive: {
    backgroundColor: BrandColors.graphite,
    borderColor: BrandColors.graphite,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: BrandColors.graphite,
  },
  filterChipTextActive: {
    color: BrandColors.white,
  },
  filterChipBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
  },
  filterChipBadgeActive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  filterChipBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
  },
  filterChipBadgeTextActive: {
    color: BrandColors.white,
  },
  wordsList: {
    paddingHorizontal: Spacing.screenHorizontal,
  },
  wordCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BrandColors.white,
    padding: 16,
    borderRadius: BorderRadius.lg,
    marginBottom: 10,
    ...Shadows.sm,
  },
  wordCardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  wordCardContent: {
    flex: 1,
  },
  wordCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  wordCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: BrandColors.graphite,
  },
  wordCardDefinition: {
    fontSize: 13,
    fontWeight: '400',
    color: '#6B7280',
    lineHeight: 18,
  },
  wordCardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginLeft: 12,
  },
  strengthBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  strengthText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
