/**
 * MEANLY - Word of the Day Card Component
 * Featured card for the daily word with special styling
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
import { LinearGradient } from 'expo-linear-gradient';

import { Text } from '../common/Text';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Colors, Spacing, BorderRadius, Shadows } from '../../constants/colors';
import type { Word } from '../../types/word';

interface WordOfDayCardProps {
  word: Word;
  onStart?: () => void;
  onSave?: () => void;
  isSaved?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const WordOfDayCard = memo(function WordOfDayCard({
  word,
  onStart,
  onSave,
  isSaved = false,
  style,
}: WordOfDayCardProps) {
  const handleStart = useCallback(() => {
    if (onStart) {
      onStart();
    } else {
      router.push(`/word/${word.id}`);
    }
  }, [word.id, onStart]);

  const handleSave = useCallback(() => {
    onSave?.();
  }, [onSave]);

  return (
    <View style={[styles.container, style]}>
      <LinearGradient
        colors={[Colors.primary, Colors.primaryDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.labelContainer}>
            <Ionicons name="sunny" size={16} color={Colors.white} />
            <Text variant="caption" style={styles.label}>
              СЛОВО ДНЯ
            </Text>
          </View>
          <Pressable onPress={handleSave} hitSlop={8}>
            <Ionicons
              name={isSaved ? 'bookmark' : 'bookmark-outline'}
              size={24}
              color={Colors.white}
            />
          </Pressable>
        </View>

        {/* Word */}
        <View style={styles.wordSection}>
          <Text variant="h1" style={styles.word}>
            {word.word}
          </Text>
          {word.pronunciation && (
            <Text variant="body" style={styles.pronunciation}>
              [{word.pronunciation}]
            </Text>
          )}
        </View>

        {/* Meta */}
        <View style={styles.meta}>
          <Badge
            variant="secondary"
            size="sm"
            style={styles.badge}
          >
            <Text variant="caption" style={styles.badgeText}>
              {word.partOfSpeech}
            </Text>
          </Badge>
          <Badge
            variant="outline"
            size="sm"
            style={StyleSheet.flatten([styles.badge, styles.levelBadge])}
          >
            <Text variant="caption" style={styles.badgeText}>
              {word.level}
            </Text>
          </Badge>
        </View>

        {/* Definition */}
        <Text variant="body" style={styles.definition} numberOfLines={3}>
          {word.definition}
        </Text>

        {/* Example */}
        {word.goodExample && (
          <View style={styles.exampleContainer}>
            <Text variant="caption" style={styles.exampleLabel}>
              Пример:
            </Text>
            <Text variant="body" style={styles.example} numberOfLines={2}>
              "{word.goodExample.sentence}"
            </Text>
          </View>
        )}

        {/* Start Button */}
        <Button
          title="Изучить слово"
          variant="secondary"
          size="lg"
          onPress={handleStart}
          rightIcon={<Ionicons name="arrow-forward" size={20} color={Colors.primary} />}
          style={styles.startButton}
        />
      </LinearGradient>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadows.large,
  },
  gradient: {
    padding: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xxs,
    borderRadius: BorderRadius.full,
  },
  label: {
    color: Colors.white,
    fontWeight: '600',
    letterSpacing: 1,
  },
  wordSection: {
    marginBottom: Spacing.sm,
  },
  word: {
    color: Colors.white,
    fontSize: 36,
    fontWeight: '700',
    marginBottom: Spacing.xxs,
  },
  pronunciation: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontStyle: 'italic',
  },
  meta: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  badge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: 'transparent',
  },
  levelBadge: {
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  badgeText: {
    color: Colors.white,
  },
  definition: {
    color: Colors.white,
    lineHeight: 24,
    marginBottom: Spacing.md,
  },
  exampleContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
  },
  exampleLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: Spacing.xxs,
  },
  example: {
    color: Colors.white,
    fontStyle: 'italic',
  },
  startButton: {
    backgroundColor: Colors.white,
  },
});

export default WordOfDayCard;
