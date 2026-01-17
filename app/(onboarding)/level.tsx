/**
 * MEANLY - Onboarding Level Screen
 * Step 2: Select current level
 */

import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

import { Text, Heading2, Button, Card, Icon } from '../../src/components/common';
import { useThemeStore } from '../../src/stores/themeStore';
import { useUserStore } from '../../src/stores/userStore';
import { Spacing } from '../../src/constants/spacing';
import { LEVELS, type LevelId } from '../../src/constants/categories';

export default function LevelScreen() {
  const router = useRouter();
  const { colors } = useThemeStore();
  const { setOnboardingData } = useUserStore();

  const [selectedLevel, setSelectedLevel] = useState<LevelId | null>(null);

  const handleContinue = () => {
    if (selectedLevel) {
      setOnboardingData({ level: selectedLevel });
      router.push('/(onboarding)/time');
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgrounds.primary }]}>
      <View style={styles.content}>
        {/* Back Button */}
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon name="arrow-back" size="md" color={colors.text.primary} />
        </TouchableOpacity>

        {/* Progress */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { backgroundColor: colors.backgrounds.tertiary }]}>
            <View 
              style={[
                styles.progressFill, 
                { backgroundColor: colors.primary, width: '66%' }
              ]} 
            />
          </View>
          <Text variant="caption" color={colors.text.secondary}>
            Шаг 2 из 3
          </Text>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Heading2>Каков ваш уровень?</Heading2>
          <Text variant="body" color={colors.text.secondary}>
            Мы адаптируем сложность слов под вас
          </Text>
        </View>

        {/* Level Options */}
        <View style={styles.options}>
          {LEVELS.map((level) => {
            const isSelected = selectedLevel === level.id;
            
            return (
              <TouchableOpacity
                key={level.id}
                onPress={() => setSelectedLevel(level.id)}
                activeOpacity={0.7}
              >
                <Card
                  variant={isSelected ? 'elevated' : 'outlined'}
                  padding="md"
                  style={[
                    styles.optionCard,
                    isSelected && { borderColor: colors.primary, borderWidth: 2 }
                  ]}
                >
                  <View style={styles.optionRow}>
                    <View style={[styles.optionIcon, { backgroundColor: colors.backgrounds.secondary }]}>
                      <Text variant="h4">{level.icon}</Text>
                    </View>
                    <View style={styles.optionContent}>
                      <Text variant="bodyMedium">{level.labelRu}</Text>
                      <Text variant="caption" color={colors.text.secondary} numberOfLines={2}>
                        {level.descriptionRu}
                      </Text>
                    </View>
                    {isSelected && (
                      <Icon name="checkmark-circle" size="md" color={colors.primary} />
                    )}
                  </View>
                </Card>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Continue Button */}
        <View style={styles.footer}>
          <Button
            title="Продолжить"
            variant="primary"
            size="lg"
            isFullWidth
            onPress={handleContinue}
            disabled={!selectedLevel}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: Spacing.screenHorizontal,
    paddingTop: Spacing.md,
  },
  backButton: {
    marginBottom: Spacing.md,
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  progressBar: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    marginBottom: Spacing.sm,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  options: {
    flex: 1,
    gap: Spacing.md,
  },
  optionCard: {
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  optionContent: {
    flex: 1,
  },
  footer: {
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
});
