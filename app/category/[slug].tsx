/**
 * MEANLY - Category Screen
 * Display words from a specific category
 */

import React, { useMemo, useState } from 'react';
import { 
  View, 
  StyleSheet, 
  FlatList, 
  Pressable,
  StatusBar,
  Modal,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '../../src/components/common';
import { useThemeStore } from '../../src/stores/themeStore';
import { useWordStore } from '../../src/stores/wordStore';
import { useSavedWordsStore } from '../../src/stores/savedWordsStore';
import { BrandColors, Spacing, BorderRadius, Shadows } from '../../src/constants/colors';
import { CATEGORIES } from '../../src/constants/categories';
import { DEMO_WORDS } from '../../src/data/demoWords';
import type { Word } from '../../src/types/word';

// Level colors
const LevelColors = {
  beginner: '#10B981',
  intermediate: '#F59E0B',
  advanced: '#EF4444',
};

type LevelFilter = 'all' | 'beginner' | 'intermediate' | 'advanced';

export default function CategoryScreen() {
  const { slug, level } = useLocalSearchParams<{ slug?: string; level?: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useThemeStore();
  const { setCurrentWord, setCurrentStep } = useWordStore();
  const { savedWords } = useSavedWordsStore();
  
  // Filter state
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedLevels, setSelectedLevels] = useState<LevelFilter[]>(['all']);

  // Find category
  const category = useMemo(() => {
    if (slug) {
      return CATEGORIES.find(c => c.id === slug);
    }
    return null;
  }, [slug]);

  // Get all words for this category (before filter)
  const allCategoryWords = useMemo(() => {
    let filteredWords = [...DEMO_WORDS];
    
    if (category) {
      filteredWords = filteredWords.filter(w => w.categoryId === category.id);
    }
    
    if (level) {
      filteredWords = filteredWords.filter(w => w.level === level);
    }
    
    return filteredWords;
  }, [category, level]);

  // Get words with level filter applied
  const words = useMemo(() => {
    if (selectedLevels.includes('all')) {
      return allCategoryWords;
    }
    return allCategoryWords.filter(w => selectedLevels.includes(w.level as LevelFilter));
  }, [allCategoryWords, selectedLevels]);

  // Calculate learned words in this category
  const learnedCount = useMemo(() => {
    const categoryWordIds = allCategoryWords.map(w => w.id);
    return savedWords.filter(sw => categoryWordIds.includes(sw.wordId)).length;
  }, [allCategoryWords, savedWords]);

  // Calculate progress percentage
  const progressPercent = useMemo(() => {
    if (allCategoryWords.length === 0) return 0;
    return Math.round((learnedCount / allCategoryWords.length) * 100);
  }, [learnedCount, allCategoryWords.length]);

  // Page title
  const pageTitle = useMemo(() => {
    if (category) return category.nameRu;
    if (level === 'beginner') return 'Начальный уровень';
    if (level === 'intermediate') return 'Средний уровень';
    if (level === 'advanced') return 'Продвинутый уровень';
    return 'Слова';
  }, [category, level]);

  const pageColor = useMemo(() => {
    if (category) return category.color;
    if (level) return LevelColors[level as keyof typeof LevelColors];
    return BrandColors.orange;
  }, [category, level]);

  const handleBack = () => {
    router.back();
  };

  const handleWordPress = (word: Word) => {
    setCurrentWord(word);
    setCurrentStep(1);
    router.push(`/word/${word.id}`);
  };

  const handleFilterToggle = (filterLevel: LevelFilter) => {
    if (filterLevel === 'all') {
      setSelectedLevels(['all']);
    } else {
      let newLevels = selectedLevels.filter(l => l !== 'all');
      if (newLevels.includes(filterLevel)) {
        newLevels = newLevels.filter(l => l !== filterLevel);
        if (newLevels.length === 0) {
          newLevels = ['all'];
        }
      } else {
        newLevels.push(filterLevel);
      }
      setSelectedLevels(newLevels);
    }
  };

  const renderWordItem = ({ item }: { item: Word }) => (
    <Pressable
      style={({ pressed }) => [
        styles.wordCard,
        { backgroundColor: isDark ? colors.backgrounds.card : BrandColors.white },
        pressed && styles.wordCardPressed,
      ]}
      onPress={() => handleWordPress(item)}
    >
      <View style={styles.wordContent}>
        <View style={styles.wordHeader}>
          <Text style={[styles.wordTitle, { color: colors.text.primary }]}>
            {item.word}
          </Text>
          <View style={[
            styles.levelBadge, 
            { backgroundColor: LevelColors[item.level as keyof typeof LevelColors] + '20' }
          ]}>
            <View style={[
              styles.levelDot,
              { backgroundColor: LevelColors[item.level as keyof typeof LevelColors] }
            ]} />
            <Text style={[
              styles.levelText,
              { color: LevelColors[item.level as keyof typeof LevelColors] }
            ]}>
              {item.level === 'beginner' ? 'Нач.' : item.level === 'intermediate' ? 'Сред.' : 'Прод.'}
            </Text>
          </View>
        </View>
        
        <Text style={[styles.wordBase, { color: colors.text.secondary }]}>
          вместо: {item.baseWord}
        </Text>
        
        <Text 
          style={[styles.wordDefinition, { color: colors.text.secondary }]} 
          numberOfLines={2}
        >
          {item.definition}
        </Text>
      </View>
      
      <View style={styles.wordArrow}>
        <Ionicons name="chevron-forward" size={20} color={pageColor} />
      </View>
    </Pressable>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.backgrounds.primary }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Header */}
      <LinearGradient
        colors={[pageColor, pageColor + 'CC']}
        style={[styles.header, { paddingTop: insets.top + 12 }]}
      >
        <View style={styles.headerTop}>
          <Pressable style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color={BrandColors.white} />
          </Pressable>
          
          <Text style={styles.headerTitle}>{pageTitle}</Text>
          
          <Pressable style={styles.filterButton} onPress={() => setShowFilterModal(true)}>
            <Ionicons name="filter" size={22} color={BrandColors.white} />
          </Pressable>
        </View>
        
        <View style={styles.headerStats}>
          <View style={styles.statsRow}>
            <View style={styles.statBadge}>
              <Text style={styles.statBadgeValue}>{allCategoryWords.length}</Text>
              <Text style={styles.statBadgeLabel}>слов</Text>
            </View>
            <View style={styles.statBadge}>
              <Text style={styles.statBadgeValue}>{learnedCount}</Text>
              <Text style={styles.statBadgeLabel}>изучено</Text>
            </View>
            <View style={styles.statBadge}>
              <Text style={styles.statBadgeValue}>{progressPercent}%</Text>
              <Text style={styles.statBadgeLabel}>прогресс</Text>
            </View>
          </View>
          {category && (
            <View style={styles.categoryIcon}>
              <Ionicons 
                name={category.icon as keyof typeof Ionicons.glyphMap} 
                size={40} 
                color="rgba(255,255,255,0.3)" 
              />
            </View>
          )}
        </View>
      </LinearGradient>

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => setShowFilterModal(false)}
        >
          <View 
            style={[
              styles.modalContent, 
              { backgroundColor: isDark ? colors.backgrounds.card : BrandColors.white }
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text.primary }]}>
                Фильтр по сложности
              </Text>
              <Pressable onPress={() => setShowFilterModal(false)}>
                <Ionicons name="close" size={24} color={colors.text.secondary} />
              </Pressable>
            </View>
            
            <View style={styles.filterOptions}>
              <FilterOption
                label="Все уровни"
                isSelected={selectedLevels.includes('all')}
                onPress={() => handleFilterToggle('all')}
                color={BrandColors.graphite}
                isDark={isDark}
              />
              <FilterOption
                label="Начальный"
                isSelected={selectedLevels.includes('beginner')}
                onPress={() => handleFilterToggle('beginner')}
                color={LevelColors.beginner}
                isDark={isDark}
              />
              <FilterOption
                label="Средний"
                isSelected={selectedLevels.includes('intermediate')}
                onPress={() => handleFilterToggle('intermediate')}
                color={LevelColors.intermediate}
                isDark={isDark}
              />
              <FilterOption
                label="Продвинутый"
                isSelected={selectedLevels.includes('advanced')}
                onPress={() => handleFilterToggle('advanced')}
                color={LevelColors.advanced}
                isDark={isDark}
              />
            </View>
            
            <Pressable 
              style={styles.applyButton}
              onPress={() => setShowFilterModal(false)}
            >
              <LinearGradient
                colors={[pageColor, pageColor + 'DD']}
                style={styles.applyButtonGradient}
              >
                <Text style={styles.applyButtonText}>Применить</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      {/* Words List */}
      <FlatList
        data={words}
        keyExtractor={(item) => item.id}
        renderItem={renderWordItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={48} color={colors.text.secondary} />
            <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
              Слова скоро появятся
            </Text>
          </View>
        }
      />
    </View>
  );
}

function FilterOption({
  label,
  isSelected,
  onPress,
  color,
  isDark,
}: {
  label: string;
  isSelected: boolean;
  onPress: () => void;
  color: string;
  isDark: boolean;
}) {
  return (
    <Pressable
      style={[
        styles.filterOption,
        isSelected && { backgroundColor: color + '20', borderColor: color },
        { borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)' },
      ]}
      onPress={onPress}
    >
      <View style={[styles.filterCheckbox, isSelected && { backgroundColor: color }]}>
        {isSelected && <Ionicons name="checkmark" size={14} color={BrandColors.white} />}
      </View>
      <Text style={[styles.filterOptionText, { color: isSelected ? color : isDark ? '#FFFFFF' : BrandColors.graphite }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.screenHorizontal,
    paddingBottom: 24,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: BrandColors.white,
    lineHeight: 28,
    includeFontPadding: false,
  },
  headerStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statBadge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    minWidth: 80,
  },
  statBadgeValue: {
    fontSize: 20,
    fontWeight: '800',
    color: BrandColors.white,
    lineHeight: 26,
    includeFontPadding: false,
  },
  statBadgeLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  categoryIcon: {
    opacity: 0.5,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    maxWidth: 340,
    borderRadius: BorderRadius.card,
    padding: 24,
    ...Shadows.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  filterOptions: {
    gap: 10,
    marginBottom: 24,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
  },
  filterCheckbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.2)',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterOptionText: {
    fontSize: 15,
    fontWeight: '500',
  },
  applyButton: {
    borderRadius: BorderRadius.button,
    overflow: 'hidden',
  },
  applyButtonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: BrandColors.white,
  },
  listContent: {
    padding: Spacing.screenHorizontal,
    paddingTop: 16,
    paddingBottom: 100,
  },
  wordCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: BorderRadius.lg,
    marginBottom: 10,
    ...Shadows.sm,
  },
  wordCardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  wordContent: {
    flex: 1,
  },
  wordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  wordTitle: {
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 24,
    includeFontPadding: false,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  levelDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  levelText: {
    fontSize: 11,
    fontWeight: '600',
  },
  wordBase: {
    fontSize: 13,
    fontWeight: '400',
    marginBottom: 6,
  },
  wordDefinition: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  wordArrow: {
    marginLeft: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: '500',
    marginTop: 12,
  },
});
