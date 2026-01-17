/**
 * MEANLY - Step Word Component
 * Step 1: Display word with pronunciation
 */

import React, { memo } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';

import { Text } from '../common/Text';
import { Button } from '../common/Button';
import { Colors, Spacing, BorderRadius } from '../../constants/colors';
import type { Word } from '../../types/word';

interface StepWordProps {
  word: Word;
  onNext: () => void;
}

export const StepWord = memo(function StepWord({ word, onNext }: StepWordProps) {
  const handleSpeak = () => {
    Speech.speak(word.word, {
      language: 'ru-RU',
      rate: 0.8,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Main Word Display */}
        <View style={styles.wordContainer}>
          <Text variant="h1" style={styles.word}>
            {word.word}
          </Text>
          
          {word.pronunciation && (
            <View style={styles.pronunciationRow}>
              <Text variant="body" color={Colors.gray500} style={styles.pronunciation}>
                [{word.pronunciation}]
              </Text>
              <Pressable onPress={handleSpeak} hitSlop={8} style={styles.speakButton}>
                <Ionicons name="volume-high" size={24} color={Colors.primary} />
              </Pressable>
            </View>
          )}
        </View>

        {/* Base Word */}
        {word.baseWord && word.baseWord !== word.word && (
          <View style={styles.baseWordContainer}>
            <Text variant="caption" color={Colors.gray400}>
              Базовая форма:
            </Text>
            <Text variant="subtitle" color={Colors.gray600}>
              {word.baseWord}
            </Text>
          </View>
        )}

        {/* Part of Speech */}
        <View style={styles.posContainer}>
          <Text variant="caption" color={Colors.gray400}>
            Часть речи:
          </Text>
          <Text variant="body" color={Colors.textPrimary}>
            {word.partOfSpeech}
          </Text>
        </View>

        {/* Level Indicator */}
        <View style={styles.levelContainer}>
          <Ionicons name="speedometer-outline" size={16} color={Colors.gray400} />
          <Text variant="caption" color={Colors.gray500}>
            Уровень: {word.level}
          </Text>
        </View>
      </View>

      {/* Next Button */}
      <Button
        title="Далее"
        onPress={onNext}
        size="lg"
        rightIcon={<Ionicons name="arrow-forward" size={20} color={Colors.white} />}
        style={styles.nextButton}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: Spacing.lg,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wordContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  word: {
    fontSize: 42,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  pronunciationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  pronunciation: {
    fontStyle: 'italic',
    fontSize: 18,
  },
  speakButton: {
    padding: Spacing.xs,
    backgroundColor: Colors.primaryLight + '30',
    borderRadius: BorderRadius.full,
  },
  baseWordContainer: {
    alignItems: 'center',
    marginBottom: Spacing.md,
    padding: Spacing.md,
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.md,
  },
  posContainer: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.lg,
  },
  nextButton: {
    marginTop: Spacing.lg,
  },
});

export default StepWord;
