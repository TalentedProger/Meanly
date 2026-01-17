/**
 * MEANLY - Divider Component
 * Visual separator line
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

import { Text } from './Text';
import { useThemeStore } from '../../stores/themeStore';
import { Spacing } from '../../constants/spacing';

interface DividerProps {
  label?: string;
  spacing?: 'none' | 'sm' | 'md' | 'lg';
  style?: ViewStyle;
}

export function Divider({
  label,
  spacing = 'md',
  style,
}: DividerProps) {
  const { colors } = useThemeStore();

  const getSpacingValue = () => {
    switch (spacing) {
      case 'none':
        return 0;
      case 'sm':
        return Spacing.sm;
      case 'md':
        return Spacing.md;
      case 'lg':
        return Spacing.lg;
    }
  };

  const marginVertical = getSpacingValue();

  if (label) {
    return (
      <View style={[styles.containerWithLabel, { marginVertical }, style]}>
        <View style={[styles.line, { backgroundColor: colors.divider }]} />
        <Text
          variant="caption"
          color={colors.text.secondary}
          style={styles.label}
        >
          {label}
        </Text>
        <View style={[styles.line, { backgroundColor: colors.divider }]} />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.divider,
        { backgroundColor: colors.divider, marginVertical },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  divider: {
    height: 1,
    width: '100%',
  },
  containerWithLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  line: {
    flex: 1,
    height: 1,
  },
  label: {
    marginHorizontal: Spacing.md,
  },
});
