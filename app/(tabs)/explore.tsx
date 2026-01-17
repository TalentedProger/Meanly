/**
 * MEANLY - Explore Screen
 * Просмотр и поиск слов по категориям
 */

import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  Pressable,
  TextInput,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '../../src/components/common';
import { useThemeStore } from '../../src/stores/themeStore';
import { BrandColors, Spacing, BorderRadius, Shadows } from '../../src/constants/colors';
import { CATEGORIES } from '../../src/constants/categories';

export default function ExploreScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useThemeStore();
  const [searchQuery, setSearchQuery] = useState('');

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
          <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Исследовать</Text>
          <Text style={[styles.headerSubtitle, { color: colors.text.secondary }]}>Найди новые слова для своего словаря</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchIcon}>
            <Ionicons name="search" size={20} color="#9CA3AF" />
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder="Поиск слов..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Pressable 
              style={styles.clearButton}
              onPress={() => setSearchQuery('')}
            >
              <Ionicons name="close-circle" size={18} color="#9CA3AF" />
            </Pressable>
          )}
        </View>

        {/* Featured Banner */}
        <Pressable style={styles.bannerContainer}>
          <LinearGradient
            colors={[BrandColors.deepGreen, '#002215']}
            style={styles.banner}
          >
            <View style={styles.bannerContent}>
              <View style={styles.bannerBadge}>
                <Ionicons name="flame" size={12} color={BrandColors.orange} />
                <Text style={styles.bannerBadgeText}>Популярное</Text>
              </View>
              <Text style={styles.bannerTitle}>Слова для собеседований</Text>
              <Text style={styles.bannerSubtitle}>25 слов для уверенной речи</Text>
            </View>
            <View style={styles.bannerIcon}>
              <Ionicons name="briefcase" size={40} color="rgba(255,255,255,0.2)" />
            </View>
          </LinearGradient>
        </Pressable>

        {/* Categories */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Категории</Text>
          <Text style={[styles.sectionCount, { color: colors.text.secondary }]}>{CATEGORIES.length} категорий</Text>
        </View>

        <View style={styles.categoriesGrid}>
          {CATEGORIES.map((category, index) => (
            <CategoryCard 
              key={category.id}
              category={category}
              index={index}
              onPress={() => router.push({ pathname: '/category/[slug]', params: { slug: category.id } })}
            />
          ))}
        </View>

        {/* Difficulty Levels */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>По уровню сложности</Text>
        </View>

        <View style={styles.levelsRow}>
          <LevelCard 
            level="beginner"
            title="Начальный"
            count={120}
            color={BrandColors.deepGreen}
            onPress={() => router.push({ pathname: '/category/[slug]', params: { slug: 'all', level: 'beginner' } })}
          />
          <LevelCard 
            level="intermediate"
            title="Средний"
            count={85}
            color={BrandColors.steelBlue}
            onPress={() => router.push({ pathname: '/category/[slug]', params: { slug: 'all', level: 'intermediate' } })}
          />
          <LevelCard 
            level="advanced"
            title="Продвинутый"
            count={45}
            color={BrandColors.orange}
            onPress={() => router.push({ pathname: '/category/[slug]', params: { slug: 'all', level: 'advanced' } })}
          />
        </View>
      </ScrollView>
    </View>
  );
}

function CategoryCard({ 
  category, 
  index,
  onPress,
}: { 
  category: typeof CATEGORIES[0];
  index: number;
  onPress: () => void;
}) {
  return (
    <Pressable 
      style={({ pressed }) => [
        styles.categoryCard,
        pressed && styles.categoryCardPressed,
      ]}
      onPress={onPress}
    >
      <LinearGradient
        colors={['#1a1a1a', category.color + 'CC']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.categoryGradient}
      >
        <View style={styles.categoryIconContainer}>
          <Ionicons 
            name={category.icon as keyof typeof Ionicons.glyphMap} 
            size={22} 
            color={BrandColors.white}
          />
        </View>
        <View style={styles.categoryContent}>
          <View style={styles.categoryHeader}>
            <Text style={styles.categoryName}>{category.nameRu}</Text>
            {category.isPro && (
              <View style={styles.proBadge}>
                <Ionicons name="diamond" size={10} color={BrandColors.white} />
                <Text style={styles.proBadgeText}>PRO</Text>
              </View>
            )}
          </View>
          <Text style={styles.categoryDescription} numberOfLines={2}>
            {category.descriptionRu}
          </Text>
        </View>
        <View style={styles.categoryArrowContainer}>
          <Ionicons name="chevron-forward" size={18} color={BrandColors.white} />
        </View>
      </LinearGradient>
    </Pressable>
  );
}

function LevelCard({ 
  level, 
  title, 
  count,
  color,
  onPress,
}: { 
  level: string;
  title: string;
  count: number;
  color: string;
  onPress: () => void;
}) {
  return (
    <Pressable 
      style={({ pressed }) => [
        styles.levelCard,
        pressed && styles.levelCardPressed,
      ]}
      onPress={onPress}
    >
      <View style={[styles.levelIcon, { backgroundColor: color + '15' }]}>
        <Ionicons 
          name={level === 'beginner' ? 'leaf' : level === 'intermediate' ? 'trending-up' : 'rocket'} 
          size={18} 
          color={color} 
        />
      </View>
      <Text style={styles.levelTitle}>{title}</Text>
      <Text style={styles.levelCount}>{count} слов</Text>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BrandColors.white,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: 14,
    marginBottom: 20,
    ...Shadows.sm,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '400',
    color: BrandColors.graphite,
    paddingVertical: 14,
  },
  clearButton: {
    padding: 4,
  },
  bannerContainer: {
    ...Shadows.md,
    borderRadius: BorderRadius.card,
    marginBottom: 24,
  },
  banner: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: BorderRadius.card,
    overflow: 'hidden',
  },
  bannerContent: {
    flex: 1,
  },
  bannerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(236, 94, 39, 0.2)',
    borderRadius: BorderRadius.full,
    marginBottom: 10,
  },
  bannerBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: BrandColors.orange,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: BrandColors.white,
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  bannerIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: BrandColors.graphite,
  },
  sectionCount: {
    fontSize: 13,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  categoriesGrid: {
    marginBottom: 28,
  },
  categoryCard: {
    borderRadius: BorderRadius.lg,
    marginBottom: 10,
    overflow: 'hidden',
    ...Shadows.md,
  },
  categoryCardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  categoryGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  categoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  categoryContent: {
    flex: 1,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 15,
    fontWeight: '600',
    color: BrandColors.white,
  },
  proBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: BorderRadius.full,
  },
  proBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: BrandColors.white,
  },
  categoryDescription: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 18,
  },
  categoryArrowContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  levelCard: {
    flex: 1,
    backgroundColor: BrandColors.white,
    padding: 16,
    paddingVertical: 20,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 130,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
    ...Shadows.md,
  },
  levelCardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  levelIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  levelTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: BrandColors.graphite,
    marginBottom: 4,
    textAlign: 'center',
  },
  levelCount: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9CA3AF',
  },
});
