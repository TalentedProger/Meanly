/**
 * MEANLY - Category Card Component
 * Card for displaying word categories with icon and count
 */

import React, { memo, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { Text } from '../common/Text';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Colors, Spacing, BorderRadius } from '../../constants/colors';
import { CATEGORIES, type CategoryId } from '../../constants/categories';

interface CategoryCardProps {
  categoryId: CategoryId;
  wordCount?: number;
  progress?: number; // 0-100
  isLocked?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const CategoryCard = memo(function CategoryCard({
  categoryId,
  wordCount = 0,
  progress = 0,
  isLocked = false,
  style,
}: CategoryCardProps) {
  const category = CATEGORIES.find((c) => c.id === categoryId);

  const handlePress = useCallback(() => {
    if (!isLocked) {
      router.push(`/explore?category=${categoryId}`);
    }
  }, [categoryId, isLocked]);

  if (!category) return null;

  return (
    <Card
      variant="elevated"
      onPress={handlePress}
      disabled={isLocked}
      style={[styles.card, isLocked && styles.cardLocked, style]}
    >
      {/* Icon */}
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: category.color + '20' },
        ]}
      >
        <Ionicons
          name={category.icon as keyof typeof Ionicons.glyphMap}
          size={28}
          color={isLocked ? Colors.gray400 : category.color}
        />
        {isLocked && (
          <View style={styles.lockOverlay}>
            <Ionicons name="lock-closed" size={16} color={Colors.white} />
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text
          variant="subtitle"
          numberOfLines={1}
          color={isLocked ? Colors.gray400 : Colors.textPrimary}
        >
          {category.name}
        </Text>
        
        <Text
          variant="caption"
          color={Colors.gray500}
          numberOfLines={2}
          style={styles.description}
        >
          {category.description}
        </Text>

        {/* Stats */}
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Ionicons name="document-text-outline" size={14} color={Colors.gray400} />
            <Text variant="caption" color={Colors.gray500}>
              {wordCount} слов
            </Text>
          </View>
          
          {progress > 0 && !isLocked && (
            <View style={styles.statItem}>
              <Ionicons name="checkmark-circle-outline" size={14} color={Colors.success} />
              <Text variant="caption" color={Colors.success}>
                {progress}%
              </Text>
            </View>
          )}
        </View>

        {/* Progress Bar */}
        {progress > 0 && !isLocked && (
          <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${progress}%`, backgroundColor: category.color },
                ]}
              />
            </View>
          </View>
        )}
      </View>

      {/* Pro Badge */}
      {isLocked && (
        <Badge variant="primary" size="sm" style={styles.proBadge}>
          PRO
        </Badge>
      )}
    </Card>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  cardLocked: {
    opacity: 0.7,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  description: {
    marginTop: Spacing.xxs,
    lineHeight: 18,
  },
  stats: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxs,
  },
  progressContainer: {
    marginTop: Spacing.sm,
  },
  progressTrack: {
    height: 4,
    backgroundColor: Colors.gray200,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: BorderRadius.full,
  },
  proBadge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
  },
});

export default CategoryCard;
