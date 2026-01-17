/**
 * MEANLY - Step Complete Component
 * Step 8: Summary and completion screen
 */

import React, { memo, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withSequence,
} from 'react-native-reanimated';

import { Text } from '../common/Text';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Colors, Spacing, BorderRadius } from '../../constants/colors';
import type { Word, WordStrength } from '../../types/word';

interface StepCompleteProps {
  word: Word;
  onFinish: () => void;
  onSave?: () => void;
  onPracticeMore?: () => void;
  isSaved?: boolean;
  practiceScore?: number;
  newStrength?: WordStrength;
}

const STRENGTH_CONFIG: Record<WordStrength, { color: string; label: string }> = {
  new: { color: Colors.gray400, label: 'Новое' },
  learning: { color: Colors.accent, label: 'Изучаю' },
  familiar: { color: Colors.warning, label: 'Знакомое' },
  mastered: { color: Colors.success, label: 'Освоено' },
};

export const StepComplete = memo(function StepComplete({
  word,
  onFinish,
  onSave,
  onPracticeMore,
  isSaved = false,
  practiceScore = 0,
  newStrength = 'learning',
}: StepCompleteProps) {
  const scale = useSharedValue(0);
  const checkScale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 12 });
    checkScale.value = withDelay(300, withSequence(
      withSpring(1.2, { damping: 8 }),
      withSpring(1, { damping: 12 })
    ));
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  const strengthConfig = STRENGTH_CONFIG[newStrength];

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Animation */}
        <Animated.View style={[styles.successContainer, containerStyle]}>
          <Animated.View style={[styles.checkContainer, checkStyle]}>
            <View style={styles.checkCircle}>
              <Ionicons name="checkmark" size={48} color={Colors.white} />
            </View>
          </Animated.View>
          <Text variant="h2" style={styles.successTitle}>
            Отлично!
          </Text>
          <Text variant="body" color={Colors.gray600} style={styles.successText}>
            Вы изучили новое слово
          </Text>
        </Animated.View>

        {/* Word Summary */}
        <Card variant="elevated" style={styles.summaryCard}>
          <Text variant="h1" color={Colors.primary} style={styles.word}>
            {word.word}
          </Text>
          <Text variant="body" color={Colors.gray600} style={styles.definition}>
            {word.definition}
          </Text>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text variant="caption" color={Colors.gray400}>
                Уровень
              </Text>
              <Badge variant="secondary" size="sm">
                {word.level}
              </Badge>
            </View>
            <View style={styles.statItem}>
              <Text variant="caption" color={Colors.gray400}>
                Статус
              </Text>
              <Badge
                size="sm"
                style={{ backgroundColor: strengthConfig.color + '20' }}
              >
                <Text
                  variant="caption"
                  style={{ color: strengthConfig.color }}
                >
                  {strengthConfig.label}
                </Text>
              </Badge>
            </View>
            {practiceScore > 0 && (
              <View style={styles.statItem}>
                <Text variant="caption" color={Colors.gray400}>
                  Оценка
                </Text>
                <Text variant="subtitle" color={Colors.primary}>
                  {practiceScore}%
                </Text>
              </View>
            )}
          </View>
        </Card>

        {/* Actions */}
        <View style={styles.actions}>
          {!isSaved && onSave && (
            <Button
              title="Сохранить слово"
              variant="outline"
              onPress={onSave}
              rightIcon={<Ionicons name="bookmark-outline" size={20} color={Colors.primary} />}
              style={styles.actionButton}
            />
          )}
          
          {onPracticeMore && (
            <Button
              title="Практиковать ещё"
              variant="outline"
              onPress={onPracticeMore}
              rightIcon={<Ionicons name="refresh-outline" size={20} color={Colors.primary} />}
              style={styles.actionButton}
            />
          )}
        </View>

        {/* Tips for Next */}
        <Card variant="filled" style={styles.nextTipsCard}>
          <View style={styles.tipsHeader}>
            <Ionicons name="calendar-outline" size={20} color={Colors.accent} />
            <Text variant="subtitle" color={Colors.accent}>
              Что дальше?
            </Text>
          </View>
          <Text variant="body" color={Colors.gray600}>
            Слово добавлено в вашу очередь повторения.
            Мы напомним вам о нём через несколько дней,
            чтобы закрепить в памяти.
          </Text>
        </Card>
      </ScrollView>

      {/* Finish Button */}
      <View style={styles.buttons}>
        <Button
          title="Готово"
          onPress={onFinish}
          size="lg"
          rightIcon={<Ionicons name="checkmark-circle" size={20} color={Colors.white} />}
          style={styles.finishButton}
        />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  successContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  checkContainer: {
    marginBottom: Spacing.md,
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successTitle: {
    marginBottom: Spacing.xs,
  },
  successText: {
    textAlign: 'center',
  },
  summaryCard: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  word: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  definition: {
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.xl,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
  },
  statItem: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  actionButton: {
    flex: 1,
    minWidth: 150,
  },
  nextTipsCard: {
    backgroundColor: Colors.accent + '10',
    borderColor: Colors.accent + '30',
    borderWidth: 1,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  buttons: {
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
    backgroundColor: Colors.white,
  },
  finishButton: {
    width: '100%',
  },
});

export default StepComplete;
