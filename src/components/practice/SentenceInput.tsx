/**
 * MEANLY - Sentence Input Component
 * Input field for user sentence with character counter and word highlighting
 */

import React, { memo, useCallback, useMemo } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '../common/Text';
import { Colors, Spacing, BorderRadius, Typography } from '../../constants/colors';

interface SentenceInputProps extends Omit<TextInputProps, 'style'> {
  value: string;
  onChangeText: (text: string) => void;
  targetWord: string;
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  disabled?: boolean;
}

export const SentenceInput = memo(function SentenceInput({
  value,
  onChangeText,
  targetWord,
  placeholder = 'Введите предложение...',
  minLength = 20,
  maxLength = 200,
  disabled = false,
  ...props
}: SentenceInputProps) {
  const charCount = value.length;
  const wordLower = targetWord.toLowerCase();
  const containsWord = value.toLowerCase().includes(wordLower);

  const status = useMemo(() => {
    if (charCount === 0) return 'empty';
    if (charCount < minLength) return 'short';
    if (!containsWord) return 'missing-word';
    return 'valid';
  }, [charCount, minLength, containsWord]);

  const statusConfig = useMemo(() => {
    switch (status) {
      case 'empty':
        return {
          color: Colors.gray400,
          message: `Минимум ${minLength} символов`,
          icon: 'create-outline' as const,
        };
      case 'short':
        return {
          color: Colors.warning,
          message: `Ещё ${minLength - charCount} символов`,
          icon: 'alert-circle-outline' as const,
        };
      case 'missing-word':
        return {
          color: Colors.error,
          message: `Добавьте слово "${targetWord}"`,
          icon: 'close-circle-outline' as const,
        };
      case 'valid':
        return {
          color: Colors.success,
          message: 'Готово к проверке',
          icon: 'checkmark-circle-outline' as const,
        };
    }
  }, [status, minLength, charCount, targetWord]);

  const handleChange = useCallback(
    (text: string) => {
      if (text.length <= maxLength) {
        onChangeText(text);
      }
    },
    [maxLength, onChangeText]
  );

  return (
    <View style={styles.container}>
      {/* Input Container */}
      <View
        style={[
          styles.inputContainer,
          disabled && styles.inputDisabled,
          status === 'valid' && styles.inputValid,
          status === 'missing-word' && styles.inputError,
        ]}
      >
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={handleChange}
          placeholder={placeholder}
          placeholderTextColor={Colors.gray400}
          multiline
          numberOfLines={4}
          editable={!disabled}
          textAlignVertical="top"
          {...props}
        />
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        {/* Status Message */}
        <View style={styles.statusContainer}>
          <Ionicons
            name={statusConfig.icon}
            size={14}
            color={statusConfig.color}
          />
          <Text variant="caption" style={{ color: statusConfig.color }}>
            {statusConfig.message}
          </Text>
        </View>

        {/* Character Counter */}
        <View style={styles.counterContainer}>
          <Text
            variant="caption"
            color={charCount > maxLength * 0.9 ? Colors.warning : Colors.gray400}
          >
            {charCount}/{maxLength}
          </Text>
        </View>
      </View>

      {/* Word Highlight Indicator */}
      {containsWord && (
        <View style={styles.wordIndicator}>
          <Ionicons name="checkmark" size={12} color={Colors.success} />
          <Text variant="caption" color={Colors.success}>
            Слово "{targetWord}" найдено
          </Text>
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    gap: Spacing.xs,
  },
  inputContainer: {
    borderWidth: 2,
    borderColor: Colors.gray300,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.white,
    overflow: 'hidden',
  },
  inputDisabled: {
    backgroundColor: Colors.gray100,
    opacity: 0.7,
  },
  inputValid: {
    borderColor: Colors.success,
  },
  inputError: {
    borderColor: Colors.error,
  },
  input: {
    padding: Spacing.md,
    fontSize: Typography.presets.body.fontSize,
    lineHeight: 24,
    color: Colors.textPrimary,
    minHeight: 120,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxs,
  },
  counterContainer: {
    alignItems: 'flex-end',
  },
  wordIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxs,
    backgroundColor: Colors.success + '15',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xxs,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
});

export default SentenceInput;
