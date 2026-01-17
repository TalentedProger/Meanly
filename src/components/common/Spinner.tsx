/**
 * MEANLY - Spinner Component
 * Loading indicator
 */

import React from 'react';
import { ActivityIndicator, View, StyleSheet, ViewStyle } from 'react-native';

import { Text } from './Text';
import { useThemeStore } from '../../stores/themeStore';
import { Spacing } from '../../constants/spacing';

interface SpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  message?: string;
  fullScreen?: boolean;
  style?: ViewStyle;
}

export function Spinner({
  size = 'large',
  color,
  message,
  fullScreen = false,
  style,
}: SpinnerProps) {
  const { colors } = useThemeStore();
  const spinnerColor = color || colors.primary;

  const content = (
    <>
      <ActivityIndicator size={size} color={spinnerColor} />
      {message && (
        <Text
          variant="bodySmall"
          color={colors.text.secondary}
          style={styles.message}
        >
          {message}
        </Text>
      )}
    </>
  );

  if (fullScreen) {
    return (
      <View
        style={[
          styles.fullScreen,
          { backgroundColor: colors.backgrounds.primary },
          style,
        ]}
      >
        {content}
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      {content}
    </View>
  );
}

// Inline spinner for buttons and small areas
export function SpinnerInline({
  size = 'small',
  color,
}: Pick<SpinnerProps, 'size' | 'color'>) {
  const { colors } = useThemeStore();
  return <ActivityIndicator size={size} color={color || colors.primary} />;
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    marginTop: Spacing.md,
    textAlign: 'center',
  },
});
