/**
 * MEANLY - Step Good Bad Component
 * Step 5: Compare good and bad examples
 */

import React, { memo, useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '../common/Text';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Colors, Spacing, BorderRadius } from '../../constants/colors';
import type { Word } from '../../types/word';

interface StepGoodBadProps {
  word: Word;
  onNext: () => void;
  onBack: () => void;
}

export const StepGoodBad = memo(function StepGoodBad({
  word,
  onNext,
  onBack,
}: StepGoodBadProps) {
  const [showExplanation, setShowExplanation] = useState(false);
  const goodExample = word.goodExample;
  const badExample = word.badExample;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="git-compare-outline" size={24} color={Colors.accent} />
          <Text variant="h3">Сравните примеры</Text>
        </View>

        {/* Word reminder */}
        <View style={styles.wordReminder}>
          <Text variant="subtitle" color={Colors.gray500}>
            Слово:
          </Text>
          <Text variant="h2" color={Colors.primary}>
            {word.word}
          </Text>
        </View>

        {/* Good Example */}
        <Card variant="elevated" style={[styles.exampleCard, styles.goodCard]}>
          <View style={styles.exampleHeader}>
            <View style={styles.labelContainer}>
              <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
              <Text variant="subtitle" color={Colors.success}>
                Правильно
              </Text>
            </View>
          </View>
          
          {goodExample ? (
            <Text variant="body" style={styles.exampleText}>
              "{goodExample.sentence}"
            </Text>
          ) : (
            <Text variant="body" color={Colors.gray400}>
              Пример не указан
            </Text>
          )}
        </Card>

        {/* Bad Example */}
        <Card variant="elevated" style={[styles.exampleCard, styles.badCard]}>
          <View style={styles.exampleHeader}>
            <View style={styles.labelContainer}>
              <Ionicons name="close-circle" size={20} color={Colors.error} />
              <Text variant="subtitle" color={Colors.error}>
                Неправильно
              </Text>
            </View>
          </View>
          
          {badExample ? (
            <Text variant="body" style={styles.exampleText}>
              "{badExample.sentence}"
            </Text>
          ) : (
            <Text variant="body" color={Colors.gray400}>
              Пример не указан
            </Text>
          )}
        </Card>

        {/* Toggle Explanation */}
        <Pressable
          onPress={() => setShowExplanation(!showExplanation)}
          style={styles.toggleButton}
        >
          <Ionicons
            name={showExplanation ? 'chevron-up-circle' : 'chevron-down-circle'}
            size={20}
            color={Colors.primary}
          />
          <Text variant="subtitle" color={Colors.primary}>
            {showExplanation ? 'Скрыть объяснение' : 'Показать объяснение'}
          </Text>
        </Pressable>

        {/* Explanation */}
        {showExplanation && (
          <Card variant="filled" style={styles.explanationCard}>
            <View style={styles.explanationSection}>
              <View style={styles.explanationHeader}>
                <Ionicons name="checkmark" size={16} color={Colors.success} />
                <Text variant="caption" color={Colors.success}>
                  Почему это правильно:
                </Text>
              </View>
              <Text variant="body" color={Colors.gray600}>
                В хорошем примере слово "{word.word}" использовано в правильном
                контексте и с правильным значением.
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.explanationSection}>
              <View style={styles.explanationHeader}>
                <Ionicons name="close" size={16} color={Colors.error} />
                <Text variant="caption" color={Colors.error}>
                  Почему это неправильно:
                </Text>
              </View>
              <Text variant="body" color={Colors.gray600}>
                В плохом примере слово использовано неуместно или с неправильным
                значением, что делает предложение странным.
              </Text>
            </View>
          </Card>
        )}

        {/* Key Insight */}
        <Card variant="filled" style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <Ionicons name="key-outline" size={20} color={Colors.warning} />
            <Text variant="subtitle" color={Colors.warning}>
              Ключевой вывод
            </Text>
          </View>
          <Text variant="body" color={Colors.gray600}>
            Обращайте внимание на контекст и сочетаемость слов.
            Даже правильное слово в неправильном месте звучит неестественно.
          </Text>
        </Card>
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.buttons}>
        <Button
          title="Назад"
          variant="outline"
          onPress={onBack}
          style={styles.backButton}
        />
        <Button
          title="Далее"
          onPress={onNext}
          rightIcon={<Ionicons name="arrow-forward" size={20} color={Colors.white} />}
          style={styles.nextButton}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  wordReminder: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  exampleCard: {
    marginBottom: Spacing.md,
  },
  goodCard: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.success,
  },
  badCard: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.error,
  },
  exampleHeader: {
    marginBottom: Spacing.sm,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  exampleText: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.textPrimary,
    fontStyle: 'italic',
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  explanationCard: {
    marginBottom: Spacing.md,
  },
  explanationSection: {
    marginBottom: Spacing.sm,
  },
  explanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.gray200,
    marginVertical: Spacing.sm,
  },
  insightCard: {
    backgroundColor: Colors.warning + '10',
    borderColor: Colors.warning + '30',
    borderWidth: 1,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  buttons: {
    flexDirection: 'row',
    padding: Spacing.lg,
    gap: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
    backgroundColor: Colors.white,
  },
  backButton: {
    flex: 1,
  },
  nextButton: {
    flex: 2,
  },
});

export default StepGoodBad;
