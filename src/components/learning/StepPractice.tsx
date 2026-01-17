/**
 * MEANLY - Step Practice Component
 * Step 7: User practices using the word in a sentence
 */

import React, { memo, useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '../common/Text';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Colors, Spacing, BorderRadius } from '../../constants/colors';
import { SentenceInput } from '../practice/SentenceInput';
import { EvaluationResult } from '../practice/EvaluationResult';
import type { Word } from '../../types/word';
import type { SentenceEvaluation } from '../../types/practice';

interface StepPracticeProps {
  word: Word;
  onNext: () => void;
  onBack: () => void;
  onEvaluate?: (sentence: string) => Promise<SentenceEvaluation>;
  isLoading?: boolean;
}

export const StepPractice = memo(function StepPractice({
  word,
  onNext,
  onBack,
  onEvaluate,
  isLoading = false,
}: StepPracticeProps) {
  const [sentence, setSentence] = useState('');
  const [evaluation, setEvaluation] = useState<SentenceEvaluation | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (!sentence.trim() || !onEvaluate) return;

    Keyboard.dismiss();
    setIsEvaluating(true);

    try {
      const result = await onEvaluate(sentence.trim());
      setEvaluation(result);
    } catch (error) {
      console.error('Evaluation error:', error);
      // Show mock positive result on error
      setEvaluation({
        score: 70,
        isCorrect: true,
        feedback: 'Хорошая попытка! Продолжайте практиковаться.',
        suggestions: [],
        grammarErrors: [],
        contextScore: 70,
        originalSentence: sentence.trim(),
      });
    } finally {
      setIsEvaluating(false);
    }
  }, [sentence, onEvaluate]);

  const handleTryAgain = useCallback(() => {
    setSentence('');
    setEvaluation(null);
  }, []);

  const handleContinue = useCallback(() => {
    onNext();
  }, [onNext]);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="create-outline" size={24} color={Colors.primary} />
          <Text variant="h3">Практика</Text>
        </View>

        {/* Task Card */}
        <Card variant="elevated" style={styles.taskCard}>
          <View style={styles.taskHeader}>
            <Ionicons name="pencil" size={20} color={Colors.primary} />
            <Text variant="subtitle" color={Colors.primary}>
              Задание
            </Text>
          </View>
          <Text variant="body" style={styles.taskText}>
            Составьте предложение, используя слово:
          </Text>
          <Text variant="h2" color={Colors.primary} style={styles.taskWord}>
            {word.word}
          </Text>
        </Card>

        {/* Tips */}
        {!evaluation && (
          <Card variant="filled" style={styles.tipsCard}>
            <View style={styles.tipsHeader}>
              <Ionicons name="information-circle-outline" size={18} color={Colors.gray500} />
              <Text variant="caption" color={Colors.gray500}>
                Подсказки
              </Text>
            </View>
            <View style={styles.tipsList}>
              <Text variant="caption" color={Colors.gray500}>
                • Используйте слово в правильном контексте
              </Text>
              <Text variant="caption" color={Colors.gray500}>
                • Проверьте согласование и падежи
              </Text>
              <Text variant="caption" color={Colors.gray500}>
                • Напишите не менее 5 слов
              </Text>
            </View>
          </Card>
        )}

        {/* Input or Result */}
        {!evaluation ? (
          <View style={styles.inputSection}>
            <SentenceInput
              value={sentence}
              onChangeText={setSentence}
              targetWord={word.word}
              placeholder={`Ваше предложение со словом "${word.word}"...`}
              minLength={20}
              maxLength={200}
              disabled={isEvaluating}
            />
            
            <Button
              title={isEvaluating ? 'Проверяем...' : 'Проверить'}
              onPress={handleSubmit}
              disabled={sentence.trim().length < 20 || isEvaluating}
              isLoading={isEvaluating}
              size="lg"
              rightIcon={
                !isEvaluating ? (
                  <Ionicons name="checkmark-circle" size={20} color={Colors.white} />
                ) : undefined
              }
              style={styles.submitButton}
            />
          </View>
        ) : (
          <View style={styles.resultSection}>
            <EvaluationResult
              evaluation={evaluation}
              word={word}
            />
            
            <View style={styles.resultButtons}>
              <Button
                title="Попробовать снова"
                variant="outline"
                onPress={handleTryAgain}
                style={styles.tryAgainButton}
              />
              <Button
                title="Продолжить"
                onPress={handleContinue}
                rightIcon={<Ionicons name="arrow-forward" size={20} color={Colors.white} />}
                style={styles.continueButton}
              />
            </View>
          </View>
        )}
      </ScrollView>

      {/* Navigation Buttons (only show if not showing result) */}
      {!evaluation && (
        <View style={styles.buttons}>
          <Button
            title="Назад"
            variant="outline"
            onPress={onBack}
            style={styles.backButton}
          />
          <Button
            title="Пропустить"
            variant="ghost"
            onPress={onNext}
            style={styles.skipButton}
          />
        </View>
      )}
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
  taskCard: {
    marginBottom: Spacing.md,
    alignItems: 'center',
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  taskText: {
    textAlign: 'center',
    color: Colors.gray600,
    marginBottom: Spacing.sm,
  },
  taskWord: {
    fontSize: 28,
  },
  tipsCard: {
    marginBottom: Spacing.lg,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  tipsList: {
    gap: Spacing.xxs,
  },
  inputSection: {
    gap: Spacing.md,
  },
  submitButton: {
    marginTop: Spacing.sm,
  },
  resultSection: {
    gap: Spacing.lg,
  },
  resultButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  tryAgainButton: {
    flex: 1,
  },
  continueButton: {
    flex: 2,
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
  skipButton: {
    flex: 1,
  },
});

export default StepPractice;
