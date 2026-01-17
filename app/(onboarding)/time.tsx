/**
 * MEANLY - Onboarding Time Screen
 * Step 3: Select daily time commitment
 */

import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

import { Text, Heading2, Button, Card, Icon } from '../../src/components/common';
import { useThemeStore } from '../../src/stores/themeStore';
import { useUserStore } from '../../src/stores/userStore';
import { Spacing } from '../../src/constants/spacing';
import { TIME_COMMITMENTS, type TimeCommitmentId } from '../../src/constants/categories';

export default function TimeScreen() {
  const router = useRouter();
  const { colors } = useThemeStore();
  const { setOnboardingData, completeOnboarding } = useUserStore();

  const [selectedTime, setSelectedTime] = useState<TimeCommitmentId | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleComplete = async () => {
    if (selectedTime) {
      setIsLoading(true);
      
      try {
        setOnboardingData({ timeCommitment: selectedTime });
        await completeOnboarding();
        router.replace('/(tabs)');
      } catch (e) {
        // Handle error
      } finally {
        setIsLoading(false);
      }
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
                { backgroundColor: colors.primary, width: '100%' }
              ]} 
            />
          </View>
          <Text variant="caption" color={colors.text.secondary}>
            Шаг 3 из 3
          </Text>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Heading2>Сколько времени в день?</Heading2>
          <Text variant="body" color={colors.text.secondary}>
            Мы подстроим план обучения под ваш график
          </Text>
        </View>

        {/* Time Options */}
        <View style={styles.options}>
          {TIME_COMMITMENTS.map((time) => {
            const isSelected = selectedTime === time.id;
            
            return (
              <TouchableOpacity
                key={time.id}
                onPress={() => setSelectedTime(time.id)}
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
                      <Text variant="h4">{time.icon}</Text>
                    </View>
                    <View style={styles.optionContent}>
                      <Text variant="bodyMedium">{time.labelRu}</Text>
                      <Text variant="caption" color={colors.text.secondary}>
                        {time.descriptionRu}
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

        {/* Complete Button */}
        <View style={styles.footer}>
          <Button
            title="Начать обучение"
            variant="primary"
            size="lg"
            isFullWidth
            onPress={handleComplete}
            disabled={!selectedTime}
            isLoading={isLoading}
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
