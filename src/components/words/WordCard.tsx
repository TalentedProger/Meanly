/**
 * MEANLY - Word Card Component
 * Compact card showing word preview with save/favorite actions
 */

import React, { memo, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { Text } from '../common/Text';
import { Badge } from '../common/Badge';
import { Card } from '../common/Card';
import { Colors, Spacing, BorderRadius } from '../../constants/colors';
import type { Word, WordStrength } from '../../types/word';

interface WordCardProps {
  word: Word;
  isSaved?: boolean;
  isFavorite?: boolean;
  strength?: WordStrength;
  onSave?: (wordId: string) => void;
  onFavorite?: (wordId: string) => void;
  showActions?: boolean;
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
}

const STRENGTH_COLORS: Record<WordStrength, string> = {
  new: Colors.gray400,
  learning: Colors.accent,
  familiar: Colors.warning,
  mastered: Colors.success,
};

const STRENGTH_LABELS: Record<WordStrength, string> = {
  new: 'Новое',
  learning: 'Изучаю',
  familiar: 'Знакомое',
  mastered: 'Освоено',
};

export const WordCard = memo(function WordCard({
  word,
  isSaved = false,
  isFavorite = false,
  strength,
  onSave,
  onFavorite,
  showActions = true,
  compact = false,
  style,
}: WordCardProps) {
  const handlePress = useCallback(() => {
    router.push(`/word/${word.id}`);
  }, [word.id]);

  const handleSave = useCallback(() => {
    onSave?.(word.id);
  }, [word.id, onSave]);

  const handleFavorite = useCallback(() => {
    onFavorite?.(word.id);
  }, [word.id, onFavorite]);

  return (
    <Card
      variant="elevated"
      onPress={handlePress}
      style={[styles.card, compact && styles.cardCompact, style]}
    >
      <View style={styles.content}>
        {/* Word Header */}
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text variant="h3" style={styles.word}>
              {word.word}
            </Text>
            {word.pronunciation && (
              <Text variant="caption" color={Colors.gray500} style={styles.pronunciation}>
                [{word.pronunciation}]
              </Text>
            )}
          </View>
          
          {/* Actions */}
          {showActions && (
            <View style={styles.actions}>
              <Pressable
                onPress={handleFavorite}
                hitSlop={8}
                style={styles.actionButton}
              >
                <Ionicons
                  name={isFavorite ? 'heart' : 'heart-outline'}
                  size={20}
                  color={isFavorite ? Colors.error : Colors.gray400}
                />
              </Pressable>
              <Pressable
                onPress={handleSave}
                hitSlop={8}
                style={styles.actionButton}
              >
                <Ionicons
                  name={isSaved ? 'bookmark' : 'bookmark-outline'}
                  size={20}
                  color={isSaved ? Colors.primary : Colors.gray400}
                />
              </Pressable>
            </View>
          )}
        </View>

        {/* Part of Speech & Level */}
        <View style={styles.meta}>
          <Badge variant="secondary" size="sm">
            {word.partOfSpeech}
          </Badge>
          <Badge variant="outline" size="sm">
            {word.level}
          </Badge>
          {strength && (
            <Badge
              size="sm"
              style={{ backgroundColor: STRENGTH_COLORS[strength] + '20' }}
            >
              <Text
                variant="caption"
                style={{ color: STRENGTH_COLORS[strength] }}
              >
                {STRENGTH_LABELS[strength]}
              </Text>
            </Badge>
          )}
          {word.isPro && (
            <Badge variant="primary" size="sm">
              PRO
            </Badge>
          )}
        </View>

        {/* Definition */}
        {!compact && (
          <Text
            variant="body"
            color={Colors.gray600}
            numberOfLines={2}
            style={styles.definition}
          >
            {word.definition}
          </Text>
        )}

        {/* Example Preview */}
        {!compact && word.goodExample && (
          <View style={styles.examplePreview}>
            <Ionicons name="chatbubble-outline" size={14} color={Colors.gray400} />
            <Text
              variant="caption"
              color={Colors.gray500}
              numberOfLines={1}
              style={styles.exampleText}
            >
              "{word.goodExample.sentence}"
            </Text>
          </View>
        )}
      </View>
    </Card>
  );
});

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.sm,
  },
  cardCompact: {
    padding: Spacing.sm,
  },
  content: {
    gap: Spacing.xs,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flex: 1,
    gap: Spacing.xs,
  },
  word: {
    color: Colors.textPrimary,
  },
  pronunciation: {
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  actionButton: {
    padding: Spacing.xxs,
  },
  meta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  definition: {
    marginTop: Spacing.xxs,
  },
  examplePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
  },
  exampleText: {
    flex: 1,
    fontStyle: 'italic',
  },
});

export default WordCard;
