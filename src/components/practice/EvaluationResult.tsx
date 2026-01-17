/**
 * MEANLY - Evaluation Result Component
 * Display AI evaluation results with score and feedback
 */

import React, { memo, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeIn,
  SlideInRight,
} from 'react-native-reanimated';

import { Text } from '../common/Text';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Colors, Spacing, BorderRadius } from '../../constants/colors';
import type { SentenceEvaluation } from '../../types/practice';
import type { Word } from '../../types/word';

interface EvaluationResultProps {
  evaluation: SentenceEvaluation;
  word: Word;
}

const SCORE_THRESHOLDS = {
  excellent: 90,
  good: 70,
  ok: 50,
};

export const EvaluationResult = memo(function EvaluationResult({
  evaluation,
  word,
}: EvaluationResultProps) {
  const scoreConfig = useMemo(() => {
    if (evaluation.score >= SCORE_THRESHOLDS.excellent) {
      return {
        color: Colors.success,
        label: 'Отлично!',
        icon: 'star' as const,
        bgColor: Colors.success + '15',
      };
    }
    if (evaluation.score >= SCORE_THRESHOLDS.good) {
      return {
        color: Colors.accent,
        label: 'Хорошо!',
        icon: 'thumbs-up' as const,
        bgColor: Colors.accent + '15',
      };
    }
    if (evaluation.score >= SCORE_THRESHOLDS.ok) {
      return {
        color: Colors.warning,
        label: 'Неплохо',
        icon: 'hand-left' as const,
        bgColor: Colors.warning + '15',
      };
    }
    return {
      color: Colors.error,
      label: 'Нужно исправить',
      icon: 'refresh' as const,
      bgColor: Colors.error + '15',
    };
  }, [evaluation.score]);

  return (
    <View style={styles.container}>
      {/* Score Card */}
      <Animated.View entering={FadeIn.duration(300)}>
        <Card
          variant="elevated"
          style={[styles.scoreCard, { backgroundColor: scoreConfig.bgColor }]}
        >
          <View style={styles.scoreHeader}>
            <View style={[styles.scoreCircle, { borderColor: scoreConfig.color }]}>
              <Text variant="h1" style={[styles.scoreText, { color: scoreConfig.color }]}>
                {evaluation.score}
              </Text>
              <Text variant="caption" color={scoreConfig.color}>
                из 100
              </Text>
            </View>
            <View style={styles.scoreInfo}>
              <View style={styles.labelRow}>
                <Ionicons name={scoreConfig.icon} size={24} color={scoreConfig.color} />
                <Text variant="h3" style={{ color: scoreConfig.color }}>
                  {scoreConfig.label}
                </Text>
              </View>
              {evaluation.contextScore !== undefined && (
                <Text variant="caption" color={Colors.gray500}>
                  Уместность: {evaluation.contextScore}%
                </Text>
              )}
            </View>
          </View>
        </Card>
      </Animated.View>

      {/* User's Sentence */}
      <Animated.View entering={SlideInRight.delay(100).duration(300)}>
        <Card variant="outlined" style={styles.sentenceCard}>
          <Text variant="caption" color={Colors.gray400} style={styles.sentenceLabel}>
            Ваше предложение:
          </Text>
          <Text variant="body" style={styles.sentenceText}>
            "{evaluation.originalSentence}"
          </Text>
        </Card>
      </Animated.View>

      {/* Feedback */}
      <Animated.View entering={SlideInRight.delay(200).duration(300)}>
        <Card variant="filled" style={styles.feedbackCard}>
          <View style={styles.feedbackHeader}>
            <Ionicons name="chatbubble-ellipses-outline" size={18} color={Colors.accent} />
            <Text variant="subtitle" color={Colors.accent}>
              Обратная связь
            </Text>
          </View>
          <Text variant="body" color={Colors.gray600}>
            {evaluation.feedback}
          </Text>
        </Card>
      </Animated.View>

      {/* Grammar Errors */}
      {evaluation.grammarErrors && evaluation.grammarErrors.length > 0 && (
        <Animated.View entering={SlideInRight.delay(300).duration(300)}>
          <Card variant="outlined" style={styles.errorsCard}>
            <View style={styles.errorsHeader}>
              <Ionicons name="alert-circle-outline" size={18} color={Colors.error} />
              <Text variant="subtitle" color={Colors.error}>
                Ошибки
              </Text>
            </View>
            {evaluation.grammarErrors.map((error: string, index: number) => (
              <View key={index} style={styles.errorItem}>
                <View style={styles.errorDot} />
                <Text variant="body" color={Colors.gray600}>
                  {error}
                </Text>
              </View>
            ))}
          </Card>
        </Animated.View>
      )}

      {/* Suggestions */}
      {evaluation.suggestions && evaluation.suggestions.length > 0 && (
        <Animated.View entering={SlideInRight.delay(400).duration(300)}>
          <Card variant="filled" style={styles.suggestionsCard}>
            <View style={styles.suggestionsHeader}>
              <Ionicons name="bulb-outline" size={18} color={Colors.warning} />
              <Text variant="subtitle" color={Colors.warning}>
                Как улучшить
              </Text>
            </View>
            {evaluation.suggestions.map((suggestion: string, index: number) => (
              <View key={index} style={styles.suggestionItem}>
                <Text variant="body" style={styles.suggestionNumber}>
                  {index + 1}
                </Text>
                <Text variant="body" color={Colors.gray600}>
                  {suggestion}
                </Text>
              </View>
            ))}
          </Card>
        </Animated.View>
      )}

      {/* Improved Version */}
      {evaluation.improvedVersion && (
        <Animated.View entering={SlideInRight.delay(500).duration(300)}>
          <Card variant="outlined" style={styles.improvedCard}>
            <View style={styles.improvedHeader}>
              <Ionicons name="sparkles" size={18} color={Colors.success} />
              <Text variant="subtitle" color={Colors.success}>
                Улучшенный вариант
              </Text>
            </View>
            <Text variant="body" style={styles.improvedText}>
              "{evaluation.improvedVersion}"
            </Text>
          </Card>
        </Animated.View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
  },
  scoreCard: {
    padding: Spacing.lg,
  },
  scoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  scoreText: {
    fontSize: 28,
    fontWeight: '700',
  },
  scoreInfo: {
    flex: 1,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  sentenceCard: {
    padding: Spacing.md,
  },
  sentenceLabel: {
    marginBottom: Spacing.xs,
  },
  sentenceText: {
    fontStyle: 'italic',
    color: Colors.textPrimary,
  },
  feedbackCard: {
    padding: Spacing.md,
  },
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  errorsCard: {
    borderColor: Colors.error + '40',
    padding: Spacing.md,
  },
  errorsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  errorItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  errorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.error,
    marginTop: 8,
  },
  suggestionsCard: {
    backgroundColor: Colors.warning + '10',
    padding: Spacing.md,
  },
  suggestionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  suggestionNumber: {
    width: 20,
    height: 20,
    backgroundColor: Colors.warning + '30',
    borderRadius: 10,
    textAlign: 'center',
    lineHeight: 20,
    fontSize: 12,
    color: Colors.warning,
    fontWeight: '600',
  },
  improvedCard: {
    borderColor: Colors.success + '40',
    padding: Spacing.md,
  },
  improvedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  improvedText: {
    color: Colors.gray600,
    fontStyle: 'italic',
  },
});

export default EvaluationResult;
