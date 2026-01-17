/**
 * MEANLY - Step Context Component
 * Step 4: Show word contexts and usage profiles
 */

import React, { memo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '../common/Text';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Colors, Spacing, BorderRadius } from '../../constants/colors';
import type { Word, ContextProfile } from '../../types/word';

interface StepContextProps {
  word: Word;
  onNext: () => void;
  onBack: () => void;
}

const CONTEXT_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  formal: 'business-outline',
  informal: 'cafe-outline',
  professional: 'briefcase-outline',
  academic: 'school-outline',
  casual: 'chatbubbles-outline',
  literary: 'book-outline',
  technical: 'code-outline',
  default: 'chatbubble-ellipses-outline',
};

const CONTEXT_COLORS: Record<string, string> = {
  formal: Colors.accent,
  informal: Colors.success,
  professional: Colors.primary,
  academic: Colors.warning,
  casual: Colors.success,
  literary: Colors.secondary,
  technical: Colors.gray600,
  default: Colors.gray500,
};

export const StepContext = memo(function StepContext({
  word,
  onNext,
  onBack,
}: StepContextProps) {
  const contexts = word.contextProfiles || [];

  const getIcon = (context: string): keyof typeof Ionicons.glyphMap => {
    const key = context.toLowerCase();
    return CONTEXT_ICONS[key] || CONTEXT_ICONS.default;
  };

  const getColor = (context: string): string => {
    const key = context.toLowerCase();
    return CONTEXT_COLORS[key] || CONTEXT_COLORS.default;
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
          <Ionicons name="layers-outline" size={24} color={Colors.accent} />
          <Text variant="h3">Контексты использования</Text>
        </View>

        {/* Word reminder */}
        <View style={styles.wordReminder}>
          <Text variant="h2" color={Colors.primary}>
            {word.word}
          </Text>
        </View>

        {/* Description */}
        <Text variant="body" color={Colors.gray600} style={styles.description}>
          Понимание контекста помогает использовать слово уместно.
          Вот где и как можно применять это слово:
        </Text>

        {/* Context Cards */}
        {contexts.length > 0 ? (
          <View style={styles.contextsGrid}>
            {contexts.map((context: ContextProfile, index: number) => {
              const contextName = context.situation || context.tone;
              const color = getColor(context.tone);
              const icon = getIcon(context.tone);

              return (
                <Card
                  key={context.id || index}
                  variant="outlined"
                  style={[styles.contextCard, { borderColor: color + '40' }]}
                >
                  <View style={[styles.contextIcon, { backgroundColor: color + '15' }]}>
                    <Ionicons name={icon} size={24} color={color} />
                  </View>
                  <Text variant="subtitle" style={styles.contextName}>
                    {contextName}
                  </Text>
                  {context.example && (
                    <Text variant="caption" color={Colors.gray600} style={styles.contextExample}>
                      «{context.example}»
                    </Text>
                  )}
                  <Text variant="caption" color={Colors.gray500} style={styles.contextHint}>
                    Подходит для этого контекста
                  </Text>
                </Card>
              );
            })}
          </View>
        ) : (
          <Card variant="filled" style={styles.noContextCard}>
            <Ionicons name="globe-outline" size={32} color={Colors.gray400} />
            <Text variant="subtitle" color={Colors.gray500}>
              Универсальное слово
            </Text>
            <Text variant="body" color={Colors.gray500} style={styles.noContextText}>
              Это слово можно использовать в любом контексте.
            </Text>
          </Card>
        )}

        {/* Tips */}
        <Card variant="filled" style={styles.tipCard}>
          <View style={styles.tipHeader}>
            <Ionicons name="bulb-outline" size={20} color={Colors.warning} />
            <Text variant="subtitle" color={Colors.warning}>
              Запомните
            </Text>
          </View>
          <Text variant="body" color={Colors.gray600}>
            Неправильный контекст может изменить восприятие вашей речи.
            Формальные слова в неформальной обстановке звучат странно,
            и наоборот.
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
    marginBottom: Spacing.md,
  },
  description: {
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  contextsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  contextCard: {
    width: '47%',
    alignItems: 'center',
    padding: Spacing.md,
  },
  contextIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  contextName: {
    textAlign: 'center',
    marginBottom: Spacing.xxs,
  },
  contextExample: {
    textAlign: 'center',
    fontStyle: 'italic',
    marginVertical: Spacing.xs,
  },
  contextHint: {
    textAlign: 'center',
  },
  noContextCard: {
    alignItems: 'center',
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  noContextText: {
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  tipCard: {
    backgroundColor: Colors.warning + '10',
    borderColor: Colors.warning + '30',
    borderWidth: 1,
  },
  tipHeader: {
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

export default StepContext;
