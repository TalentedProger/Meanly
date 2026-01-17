/**
 * MEANLY - Word Detail Screen
 * 8-step word learning flow
 */

import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, StatusBar } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { Text, Heading2, Button, Card, Badge, Icon, Spinner } from '../../src/components/common';
import { useThemeStore } from '../../src/stores/themeStore';
import { useWordStore } from '../../src/stores/wordStore';
import { useSavedWordsStore } from '../../src/stores/savedWordsStore';
import { useAuthStore } from '../../src/stores/authStore';
import { Spacing } from '../../src/constants/spacing';
import { BrandColors } from '../../src/constants/colors';
import { evaluateSentenceLocal } from '../../src/services/llm';
import type { UserWord } from '../../src/types/word';

export default function WordDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors, isDark } = useThemeStore();
  const { currentWord, currentStep, setCurrentStep, isLoading } = useWordStore();
  const { savedWords, addWord } = useSavedWordsStore();
  const { user } = useAuthStore();

  // Check if word is already saved
  const isWordSaved = (wordId: string) => savedWords.some(w => w.wordId === wordId);

  // Practice state
  const [userSentence, setUserSentence] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [evaluation, setEvaluation] = useState<{
    isCorrect: boolean;
    feedback: string;
    score: number;
    suggestions: string[];
  } | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const handleClose = () => {
    router.back();
  };

  const handleNext = () => {
    if (currentStep < 8) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete learning flow
      router.back();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCheckSentence = async () => {
    if (!userSentence.trim() || !currentWord) return;
    
    setIsChecking(true);
    try {
      const result = await evaluateSentenceLocal(userSentence, currentWord);
      setEvaluation(result);
      
      // Auto advance to step 8 after successful check
      if (result.isCorrect) {
        setTimeout(() => {
          setCurrentStep(8);
        }, 2000);
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось проверить предложение. Попробуйте ещё раз.');
    } finally {
      setIsChecking(false);
    }
  };

  const handleSaveWord = async () => {
    if (!currentWord) return;
    
    try {
      // Create UserWord from Word
      const userWord: UserWord = {
        id: `uw_${Date.now()}`,
        userId: user?.id || 'guest',
        wordId: currentWord.id,
        word: currentWord,
        strength: 'new',
        practiceCount: 0,
        correctCount: 0,
        lastPracticedAt: undefined,
        savedAt: new Date().toISOString(),
        isFavorite: true,
        notes: undefined,
        isOfflineCached: true,
      };
      
      addWord(userWord);
      setIsSaved(true);
      Alert.alert('Успешно!', `Слово "${currentWord.word}" добавлено в избранное`);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось сохранить слово');
    }
  };

  const handleToggleSave = () => {
    if (currentWord && !isWordSaved(currentWord.id)) {
      handleSaveWord();
    }
  };

  if (isLoading || !currentWord) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.backgrounds.primary }]}>
        <Spinner fullScreen message="Загрузка слова..." />
      </SafeAreaView>
    );
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>
              Новое слово
            </Text>
            <Text variant="wordTitle" align="center" style={styles.mainWord}>
              {currentWord.word}
            </Text>
            <Text variant="bodySmall" color={colors.text.secondary} align="center">
              вместо: {currentWord.baseWord}
            </Text>
          </View>
        );
      
      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>
              Значение
            </Text>
            <Text variant="wordDefinition" style={styles.definition}>
              {currentWord.definition}
            </Text>
          </View>
        );
      
      case 3:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>
              Удачный пример
            </Text>
            <Card variant="elevated" padding="md" style={styles.exampleCard}>
              <View style={[styles.exampleIndicator, { backgroundColor: colors.semantic.success }]} />
              <Text variant="wordExample">
                "{currentWord.goodExample?.sentence}"
              </Text>
              <Text variant="caption" color={colors.text.secondary} style={styles.exampleContext}>
                {currentWord.goodExample?.contextProfile || 'В разговоре'}
              </Text>
            </Card>
          </View>
        );
      
      case 4:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>
              Неудачный пример
            </Text>
            <Card variant="elevated" padding="md" style={styles.exampleCard}>
              <View style={[styles.exampleIndicator, { backgroundColor: colors.semantic.error }]} />
              <Text variant="wordExample">
                "{currentWord.badExample?.sentence}"
              </Text>
              <Text variant="caption" color={colors.semantic.error} style={styles.exampleContext}>
                ❌ {currentWord.badExample?.explanation}
              </Text>
            </Card>
          </View>
        );
      
      case 5:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>
              Где использовать
            </Text>
            {currentWord.contexts?.map((context, index) => (
              <Card key={index} variant="outlined" padding="sm" style={styles.contextCard}>
                <View style={styles.contextRow}>
                  <Badge label={context.situation} variant="info" size="sm" />
                  <Text variant="caption" color={colors.text.secondary}>
                    {context.tone}
                  </Text>
                </View>
              </Card>
            ))}
          </View>
        );
      
      case 6:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>
              Мнемоника
            </Text>
            <Card variant="elevated" padding="lg">
              <Text variant="body" align="center">
                {currentWord.mnemonic || 'Попробуйте придумать свою ассоциацию для этого слова'}
              </Text>
            </Card>
          </View>
        );
      
      case 7:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>
              Ваша очередь!
            </Text>
            <Text variant="body" color={colors.text.secondary} align="center" style={styles.practicePrompt}>
              Составьте предложение со словом "{currentWord.word}"
            </Text>
            
            {/* Practice Input */}
            <View style={[styles.inputContainer, { 
              backgroundColor: isDark ? colors.backgrounds.card : BrandColors.white,
              borderColor: evaluation ? (evaluation.isCorrect ? colors.semantic.success : colors.semantic.error) : colors.backgrounds.tertiary 
            }]}>
              <TextInput
                style={[styles.textInput, { color: colors.text.primary }]}
                placeholder="Напишите ваше предложение здесь..."
                placeholderTextColor={colors.text.secondary}
                multiline
                numberOfLines={4}
                value={userSentence}
                onChangeText={setUserSentence}
                editable={!isChecking && !evaluation?.isCorrect}
              />
            </View>
            
            {/* Check Button or Result */}
            {!evaluation ? (
              <Button
                title={isChecking ? 'Проверяем...' : 'Проверить'}
                variant="primary"
                size="lg"
                isFullWidth
                onPress={handleCheckSentence}
                disabled={!userSentence.trim() || isChecking}
                isLoading={isChecking}
                style={styles.checkButton}
              />
            ) : (
              <View style={styles.evaluationContainer}>
                <View style={[
                  styles.evaluationBadge, 
                  { backgroundColor: evaluation.isCorrect ? colors.semantic.successLight : colors.semantic.errorLight }
                ]}>
                  <Icon 
                    name={evaluation.isCorrect ? 'checkmark-circle' : 'alert-circle'} 
                    size="md" 
                    color={evaluation.isCorrect ? colors.semantic.success : colors.semantic.error} 
                  />
                  <Text 
                    variant="bodyMedium" 
                    color={evaluation.isCorrect ? colors.semantic.success : colors.semantic.error}
                  >
                    {evaluation.isCorrect ? 'Отлично!' : 'Попробуйте ещё'}
                  </Text>
                </View>
                
                <Card variant="elevated" padding="md" style={styles.feedbackCard}>
                  <Text variant="body" color={colors.text.primary}>
                    {evaluation.feedback}
                  </Text>
                  
                  {evaluation.suggestions.length > 0 && (
                    <View style={styles.suggestionsContainer}>
                      <Text variant="label" color={colors.text.secondary} style={styles.suggestionsLabel}>
                        Подсказки:
                      </Text>
                      {evaluation.suggestions.map((suggestion, index) => (
                        <Text key={index} variant="bodySmall" color={colors.text.secondary}>
                          • {suggestion}
                        </Text>
                      ))}
                    </View>
                  )}
                </Card>
                
                {!evaluation.isCorrect && (
                  <Button
                    title="Попробовать снова"
                    variant="outline"
                    size="md"
                    onPress={() => {
                      setEvaluation(null);
                      setUserSentence('');
                    }}
                    style={styles.retryButton}
                  />
                )}
              </View>
            )}
          </View>
        );
      
      case 8:
        return (
          <View style={styles.stepContent}>
            <View style={[styles.completeIcon, { backgroundColor: colors.semantic.successLight }]}>
              <Icon name="checkmark-circle" size="3xl" color={colors.semantic.success} />
            </View>
            <Heading2 align="center">Отлично!</Heading2>
            <Text variant="body" color={colors.text.secondary} align="center" style={styles.completeText}>
              Вы изучили слово "{currentWord.word}"
            </Text>
            
            {/* Save Button */}
            {!isSaved && !isWordSaved(currentWord.id) ? (
              <Button
                title="Добавить в избранное"
                variant="primary"
                size="lg"
                leftIcon={<Icon name="bookmark-outline" size="sm" color={BrandColors.white} />}
                onPress={handleSaveWord}
                style={styles.saveButton}
              />
            ) : (
              <View style={styles.savedBadge}>
                <Icon name="bookmark" size="sm" color={colors.semantic.success} />
                <Text variant="bodyMedium" color={colors.semantic.success}>
                  Сохранено в избранное
                </Text>
              </View>
            )}
            
            {/* Practice Stats */}
            {evaluation && (
              <Card variant="outlined" padding="md" style={styles.statsCard}>
                <Text variant="label" color={colors.text.secondary} align="center">
                  Ваш результат
                </Text>
                <View style={styles.scoreContainer}>
                  <Text variant="h2" color={colors.primary}>
                    {evaluation.score}/100
                  </Text>
                </View>
              </Card>
            )}
          </View>
        );
      
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgrounds.primary }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIconButton} onPress={handleClose}>
          <Icon name="close" size={32} color={colors.text.primary} />
        </TouchableOpacity>
        
        <View style={styles.stepIndicator}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((step) => (
            <View
              key={step}
              style={[
                styles.stepDot,
                { backgroundColor: step <= currentStep ? colors.primary : colors.backgrounds.tertiary }
              ]}
            />
          ))}
        </View>
        
        <TouchableOpacity style={styles.headerIconButton} onPress={handleToggleSave}>
          <Icon 
            name={isSaved || (currentWord && isWordSaved(currentWord.id)) ? "bookmark" : "bookmark-outline"} 
            size={32} 
            color={isSaved || (currentWord && isWordSaved(currentWord.id)) ? colors.primary : colors.text.primary} 
          />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {renderStepContent()}
      </ScrollView>

      {/* Navigation */}
      <View style={styles.navigation}>
        <TouchableOpacity
          style={[
            styles.navButtonBack,
            { borderColor: isDark ? BrandColors.white : BrandColors.graphite },
            currentStep === 1 && styles.navButtonDisabled,
          ]}
          onPress={handlePrevious}
          disabled={currentStep === 1}
        >
          <Text style={[styles.navButtonBackText, { color: isDark ? BrandColors.white : BrandColors.graphite }]}>
            Назад
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.navButtonNext}
          onPress={handleNext}
        >
          <Text style={styles.navButtonNextText}>
            {currentStep === 8 ? 'Готово' : 'Далее'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.screenHorizontal,
  },
  headerIconButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepIndicator: {
    flexDirection: 'row',
    gap: 6,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.screenHorizontal,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing['3xl'],
  },
  stepContent: {
    flex: 1,
    alignItems: 'center',
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: BrandColors.graphite,
    marginBottom: Spacing.md,
    textAlign: 'center',
    lineHeight: 32,
    includeFontPadding: false,
  },
  mainWord: {
    marginVertical: Spacing.lg,
  },
  definition: {
    marginTop: Spacing.md,
  },
  exampleCard: {
    marginTop: Spacing.md,
    width: '100%',
  },
  exampleIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  exampleContext: {
    marginTop: Spacing.sm,
  },
  contextCard: {
    marginTop: Spacing.sm,
    width: '100%',
  },
  contextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  practicePrompt: {
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  inputPlaceholder: {
    width: '100%',
    minHeight: 120,
    justifyContent: 'center',
  },
  inputContainer: {
    width: '100%',
    minHeight: 120,
    borderRadius: 16,
    borderWidth: 2,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    textAlignVertical: 'top',
  },
  checkButton: {
    marginTop: Spacing.sm,
  },
  evaluationContainer: {
    width: '100%',
    alignItems: 'center',
  },
  evaluationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    marginBottom: Spacing.md,
  },
  feedbackCard: {
    width: '100%',
    marginBottom: Spacing.md,
  },
  suggestionsContainer: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  suggestionsLabel: {
    marginBottom: Spacing.xs,
  },
  retryButton: {
    marginTop: Spacing.sm,
  },
  completeText: {
    marginBottom: Spacing.xl,
  },
  saveButton: {
    marginBottom: Spacing.md,
  },
  savedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: Spacing.xl,
  },
  statsCard: {
    width: '100%',
    marginTop: Spacing.md,
  },
  scoreContainer: {
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  completeIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  navigation: {
    flexDirection: 'row',
    padding: Spacing.screenHorizontal,
    paddingBottom: Spacing.lg,
    gap: Spacing.md,
  },
  navButtonBack: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonBackText: {
    fontSize: 16,
    fontWeight: '600',
  },
  navButtonNext: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: BrandColors.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonNextText: {
    fontSize: 16,
    fontWeight: '600',
    color: BrandColors.white,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
});
