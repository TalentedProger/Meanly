/**
 * MEANLY - Step Definition Component
 * Step 2: Show word definition and meaning
 */

import React, { memo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '../common/Text';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Colors, Spacing, BorderRadius } from '../../constants/colors';
import type { Word } from '../../types/word';

interface StepDefinitionProps {
  word: Word;
  onNext: () => void;
  onBack: () => void;
}

export const StepDefinition = memo(function StepDefinition({
  word,
  onNext,
  onBack,
}: StepDefinitionProps) {
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Word Header */}
        <View style={styles.header}>
          <Text variant="h2" style={styles.word}>
            {word.word}
          </Text>
          <Text variant="caption" color={Colors.gray500}>
            {word.partOfSpeech}
          </Text>
        </View>

        {/* Definition Card */}
        <Card variant="elevated" style={styles.definitionCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="book-outline" size={20} color={Colors.primary} />
            <Text variant="subtitle" color={Colors.primary}>
              Определение
            </Text>
          </View>
          <Text variant="body" style={styles.definition}>
            {word.definition}
          </Text>
        </Card>

        {/* Contexts */}
        {word.contextProfiles && word.contextProfiles.length > 0 && (
          <View style={styles.contextsSection}>
            <Text variant="subtitle" style={styles.sectionTitle}>
              Контексты использования
            </Text>
            {word.contextProfiles.map((context, index) => (
              <View key={context.id || index} style={styles.contextItem}>
                <View style={styles.contextIcon}>
                  <Ionicons name="chatbubbles-outline" size={16} color={Colors.accent} />
                </View>
                <Text variant="body" color={Colors.gray600}>
                  {context.situation}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Tips */}
        <Card variant="filled" style={styles.tipCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="bulb-outline" size={20} color={Colors.warning} />
            <Text variant="subtitle" color={Colors.warning}>
              Совет
            </Text>
          </View>
          <Text variant="body" color={Colors.gray600}>
            Попробуйте представить ситуацию, в которой вы бы использовали это слово.
            Это поможет лучше запомнить его значение.
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
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  word: {
    marginBottom: Spacing.xs,
  },
  definitionCard: {
    marginBottom: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  definition: {
    lineHeight: 26,
    color: Colors.textPrimary,
  },
  contextsSection: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    marginBottom: Spacing.sm,
    color: Colors.textPrimary,
  },
  contextItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
    padding: Spacing.sm,
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.sm,
  },
  contextIcon: {
    marginTop: 2,
  },
  tipCard: {
    backgroundColor: Colors.warning + '10',
    borderColor: Colors.warning + '30',
    borderWidth: 1,
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

export default StepDefinition;
