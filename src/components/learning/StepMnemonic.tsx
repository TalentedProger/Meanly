/**
 * MEANLY - Step Mnemonic Component
 * Step 6: Show mnemonic/memory aid for the word
 */

import React, { memo, useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '../common/Text';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Input } from '../common/Input';
import { Colors, Spacing, BorderRadius } from '../../constants/colors';
import type { Word } from '../../types/word';

interface StepMnemonicProps {
  word: Word;
  onNext: () => void;
  onBack: () => void;
  onSaveNote?: (note: string) => void;
}

export const StepMnemonic = memo(function StepMnemonic({
  word,
  onNext,
  onBack,
  onSaveNote,
}: StepMnemonicProps) {
  const [userNote, setUserNote] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);

  const handleSaveNote = () => {
    if (userNote.trim()) {
      onSaveNote?.(userNote.trim());
      setShowNoteInput(false);
    }
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
          <Ionicons name="bulb-outline" size={24} color={Colors.warning} />
          <Text variant="h3">Мнемоника</Text>
        </View>

        {/* Word reminder */}
        <View style={styles.wordReminder}>
          <Text variant="h2" color={Colors.primary}>
            {word.word}
          </Text>
        </View>

        {/* Description */}
        <Text variant="body" color={Colors.gray600} style={styles.description}>
          Ассоциация или подсказка для запоминания слова
        </Text>

        {/* Mnemonic Card */}
        {word.mnemonic ? (
          <Card variant="elevated" style={styles.mnemonicCard}>
            <View style={styles.mnemonicIcon}>
              <Ionicons name="sparkles" size={32} color={Colors.warning} />
            </View>
            <Text variant="body" style={styles.mnemonicText}>
              {word.mnemonic}
            </Text>
          </Card>
        ) : (
          <Card variant="filled" style={styles.noMnemonicCard}>
            <Ionicons name="sparkles-outline" size={32} color={Colors.gray400} />
            <Text variant="subtitle" color={Colors.gray500}>
              Создайте свою ассоциацию
            </Text>
            <Text variant="body" color={Colors.gray500} style={styles.noMnemonicText}>
              Придумайте образ или историю, которая поможет запомнить это слово.
            </Text>
          </Card>
        )}

        {/* Tips */}
        <Card variant="filled" style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <Ionicons name="help-circle-outline" size={20} color={Colors.accent} />
            <Text variant="subtitle" color={Colors.accent}>
              Как создать мнемонику
            </Text>
          </View>
          <View style={styles.tipsList}>
            <View style={styles.tipItem}>
              <Text variant="body" style={styles.tipNumber}>1</Text>
              <Text variant="body" color={Colors.gray600}>
                Найдите созвучное слово на другом языке
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Text variant="body" style={styles.tipNumber}>2</Text>
              <Text variant="body" color={Colors.gray600}>
                Представьте яркую картинку или сцену
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Text variant="body" style={styles.tipNumber}>3</Text>
              <Text variant="body" color={Colors.gray600}>
                Свяжите с личным опытом или эмоцией
              </Text>
            </View>
          </View>
        </Card>

        {/* User Note Section */}
        <Pressable
          onPress={() => setShowNoteInput(!showNoteInput)}
          style={styles.addNoteToggle}
        >
          <Ionicons
            name={showNoteInput ? 'remove-circle-outline' : 'add-circle-outline'}
            size={20}
            color={Colors.primary}
          />
          <Text variant="subtitle" color={Colors.primary}>
            {showNoteInput ? 'Скрыть' : 'Добавить свою заметку'}
          </Text>
        </Pressable>

        {showNoteInput && (
          <Card variant="outlined" style={styles.noteCard}>
            <Input
              placeholder="Ваша ассоциация или заметка..."
              value={userNote}
              onChangeText={setUserNote}
              multiline
              numberOfLines={3}
              style={styles.noteInput}
            />
            <Button
              title="Сохранить"
              variant="outline"
              size="sm"
              onPress={handleSaveNote}
              disabled={!userNote.trim()}
              style={styles.saveButton}
            />
          </Card>
        )}
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
    marginBottom: Spacing.sm,
  },
  description: {
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  mnemonicCard: {
    alignItems: 'center',
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    backgroundColor: Colors.warning + '10',
    borderColor: Colors.warning + '30',
    borderWidth: 1,
  },
  mnemonicIcon: {
    marginBottom: Spacing.md,
  },
  mnemonicText: {
    fontSize: 18,
    lineHeight: 28,
    textAlign: 'center',
    color: Colors.textPrimary,
    fontStyle: 'italic',
  },
  noMnemonicCard: {
    alignItems: 'center',
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  noMnemonicText: {
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  tipsCard: {
    marginBottom: Spacing.lg,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  tipsList: {
    gap: Spacing.sm,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  tipNumber: {
    width: 24,
    height: 24,
    backgroundColor: Colors.accent + '20',
    borderRadius: BorderRadius.full,
    textAlign: 'center',
    lineHeight: 24,
    color: Colors.accent,
    fontWeight: '600',
  },
  addNoteToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  noteCard: {
    marginBottom: Spacing.md,
  },
  noteInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    marginTop: Spacing.sm,
    alignSelf: 'flex-end',
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

export default StepMnemonic;
