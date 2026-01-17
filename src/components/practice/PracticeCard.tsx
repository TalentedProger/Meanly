/**
 * MEANLY - Practice Card Component
 * Card for practice session queue display
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

import { Text } from '../common/Text';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Colors, Spacing, BorderRadius } from '../../constants/colors';
import type { Word, WordStrength } from '../../types/word';

interface PracticeCardProps {
  word: Word;
  strength?: WordStrength;
  onPractice: (wordId: string) => void;
  onSkip?: (wordId: string) => void;
  dueDate?: Date;
  style?: StyleProp<ViewStyle>;
}

const STRENGTH_CONFIG: Record<WordStrength, { color: string; label: string; icon: keyof typeof Ionicons.glyphMap }> = {
  new: { color: Colors.gray400, label: 'Новое', icon: 'add-circle-outline' },
  learning: { color: Colors.accent, label: 'Изучаю', icon: 'school-outline' },
  familiar: { color: Colors.warning, label: 'Знакомое', icon: 'star-half-outline' },
  mastered: { color: Colors.success, label: 'Освоено', icon: 'checkmark-circle-outline' },
};

export const PracticeCard = memo(function PracticeCard({
  word,
  strength = 'new',
  onPractice,
  onSkip,
  dueDate,
  style,
}: PracticeCardProps) {
  const config = STRENGTH_CONFIG[strength];

  const handlePractice = useCallback(() => {
    onPractice(word.id);
  }, [word.id, onPractice]);

  const handleSkip = useCallback(() => {
    onSkip?.(word.id);
  }, [word.id, onSkip]);

  const formatDueDate = (date: Date): string => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (diff < 0) return 'Просрочено';
    if (hours < 1) return 'Сейчас';
    if (hours < 24) return `Через ${hours}ч`;
    if (days === 1) return 'Завтра';
    return `Через ${days}д`;
  };

  return (
    <Card variant="elevated" style={[styles.card, style]}>
      <View style={styles.header}>
        {/* Strength Indicator */}
        <View style={[styles.strengthBadge, { backgroundColor: config.color + '20' }]}>
          <Ionicons name={config.icon} size={16} color={config.color} />
          <Text variant="caption" style={{ color: config.color }}>
            {config.label}
          </Text>
        </View>

        {/* Due Date */}
        {dueDate && (
          <Text variant="caption" color={Colors.gray400}>
            {formatDueDate(dueDate)}
          </Text>
        )}
      </View>

      {/* Word Content */}
      <View style={styles.content}>
        <Text variant="h2" style={styles.word}>
          {word.word}
        </Text>
        <Text variant="body" color={Colors.gray500} numberOfLines={2}>
          {word.definition}
        </Text>
      </View>

      {/* Meta Info */}
      <View style={styles.meta}>
        <Badge variant="secondary" size="sm">
          {word.partOfSpeech}
        </Badge>
        <Badge variant="outline" size="sm">
          {word.level}
        </Badge>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        {onSkip && (
          <Button
            title="Пропустить"
            variant="ghost"
            size="sm"
            onPress={handleSkip}
            style={styles.skipButton}
          />
        )}
        <Button
          title="Практиковать"
          onPress={handlePractice}
          rightIcon={<Ionicons name="create-outline" size={18} color={Colors.white} />}
          style={styles.practiceButton}
        />
      </View>
    </Card>
  );
});

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  strengthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxs,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xxs,
    borderRadius: BorderRadius.full,
  },
  content: {
    marginBottom: Spacing.md,
  },
  word: {
    marginBottom: Spacing.xs,
    color: Colors.textPrimary,
  },
  meta: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
    paddingTop: Spacing.md,
  },
  skipButton: {
    flex: 0,
  },
  practiceButton: {
    flex: 0,
  },
});

export default PracticeCard;
