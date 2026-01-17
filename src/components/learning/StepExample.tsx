/**
 * MEANLY - Step Example Component
 * Step 3: Show good example of word usage
 */

import React, { memo, useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';

import { Text } from '../common/Text';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Colors, Spacing, BorderRadius } from '../../constants/colors';
import type { Word } from '../../types/word';

interface StepExampleProps {
  word: Word;
  onNext: () => void;
  onBack: () => void;
}

export const StepExample = memo(function StepExample({
  word,
  onNext,
  onBack,
}: StepExampleProps) {
  const [showTranslation, setShowTranslation] = useState(false);
  const example = word.goodExample;

  const handleSpeak = () => {
    if (example) {
      Speech.speak(example.sentence, {
        language: 'ru-RU',
        rate: 0.8,
      });
    }
  };

  if (!example) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Ionicons name="document-text-outline" size={48} color={Colors.gray300} />
          <Text variant="body" color={Colors.gray500}>
            Пример не найден
          </Text>
        </View>
        <View style={styles.buttons}>
          <Button title="Назад" variant="outline" onPress={onBack} style={styles.backButton} />
          <Button title="Далее" onPress={onNext} style={styles.nextButton} />
        </View>
      </View>
    );
  }

  // Highlight the word in the sentence
  const highlightWord = (sentence: string) => {
    const wordLower = word.word.toLowerCase();
    const parts = sentence.split(new RegExp(`(${word.word}|${wordLower})`, 'gi'));
    
    return parts.map((part, index) => {
      const isHighlighted = part.toLowerCase() === wordLower;
      return (
        <Text
          key={index}
          variant="body"
          style={[
            styles.sentenceText,
            isHighlighted && styles.highlightedWord,
          ]}
        >
          {part}
        </Text>
      );
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
          <Text variant="h3" style={styles.headerText}>
            Хороший пример
          </Text>
        </View>

        {/* Word reminder */}
        <View style={styles.wordReminder}>
          <Text variant="caption" color={Colors.gray400}>
            Слово:
          </Text>
          <Text variant="subtitle" color={Colors.primary}>
            {word.word}
          </Text>
        </View>

        {/* Example Card */}
        <Card variant="elevated" style={styles.exampleCard}>
          <View style={styles.exampleHeader}>
            <View style={styles.contextBadge}>
              <Ionicons name="chatbubble-ellipses-outline" size={14} color={Colors.accent} />
              <Text variant="caption" color={Colors.accent}>
                {example.contextProfile || 'Пример'}
              </Text>
            </View>
            <Pressable onPress={handleSpeak} hitSlop={8}>
              <Ionicons name="volume-high" size={22} color={Colors.primary} />
            </Pressable>
          </View>

          <View style={styles.sentenceContainer}>
            <Text style={styles.quoteStart}>"</Text>
            <View style={styles.sentenceWrapper}>
              {highlightWord(example.sentence)}
            </View>
            <Text style={styles.quoteEnd}>"</Text>
          </View>

          {/* Translation toggle */}
          {example.translation && (
            <Pressable
              onPress={() => setShowTranslation(!showTranslation)}
              style={styles.translationToggle}
            >
              <Ionicons
                name={showTranslation ? 'eye-off-outline' : 'eye-outline'}
                size={16}
                color={Colors.gray500}
              />
              <Text variant="caption" color={Colors.gray500}>
                {showTranslation ? 'Скрыть перевод' : 'Показать перевод'}
              </Text>
            </Pressable>
          )}

          {showTranslation && example.translation && (
            <View style={styles.translationContainer}>
              <Text variant="body" color={Colors.gray600} style={styles.translation}>
                {example.translation}
              </Text>
            </View>
          )}
        </Card>

        {/* Explanation */}
        <Card variant="filled" style={styles.explanationCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="information-circle-outline" size={20} color={Colors.accent} />
            <Text variant="subtitle" color={Colors.accent}>
              Почему это хороший пример?
            </Text>
          </View>
          <Text variant="body" color={Colors.gray600}>
            В этом предложении слово "{word.word}" использовано правильно и уместно.
            Контекст помогает понять его значение и как его применять.
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  headerText: {
    color: Colors.success,
  },
  wordReminder: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  exampleCard: {
    marginBottom: Spacing.md,
  },
  exampleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  contextBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxs,
    backgroundColor: Colors.accent + '15',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xxs,
    borderRadius: BorderRadius.full,
  },
  sentenceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  quoteStart: {
    fontSize: 32,
    color: Colors.gray300,
    lineHeight: 36,
    marginRight: Spacing.xxs,
  },
  sentenceWrapper: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  sentenceText: {
    fontSize: 18,
    lineHeight: 28,
    color: Colors.textPrimary,
  },
  highlightedWord: {
    color: Colors.primary,
    fontWeight: '600',
    backgroundColor: Colors.primary + '20',
  },
  quoteEnd: {
    fontSize: 32,
    color: Colors.gray300,
    lineHeight: 36,
    marginLeft: Spacing.xxs,
    alignSelf: 'flex-end',
  },
  translationToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
  },
  translationContainer: {
    marginTop: Spacing.sm,
    padding: Spacing.sm,
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.sm,
  },
  translation: {
    fontStyle: 'italic',
  },
  explanationCard: {
    backgroundColor: Colors.accent + '10',
    borderColor: Colors.accent + '30',
    borderWidth: 1,
  },
  cardHeader: {
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

export default StepExample;
