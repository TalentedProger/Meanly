/**
 * MEANLY - Card Component
 * Reusable card container with shadows
 */

import React from 'react';
import { View, ViewProps, StyleSheet, Pressable } from 'react-native';

import { useThemeStore } from '../../stores/themeStore';
import { BorderRadius, Spacing, Shadows } from '../../constants/spacing';

export interface CardProps extends ViewProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onPress?: () => void;
  disabled?: boolean;
}

export function Card({
  children,
  variant = 'default',
  padding = 'md',
  onPress,
  disabled = false,
  style,
  ...props
}: CardProps) {
  const { colors } = useThemeStore();

  const getPaddingValue = () => {
    switch (padding) {
      case 'none':
        return 0;
      case 'sm':
        return Spacing.sm;
      case 'md':
        return Spacing.cardVertical;
      case 'lg':
        return Spacing.xl;
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: colors.backgrounds.card,
          ...Shadows.card,
        };
      case 'outlined':
        return {
          backgroundColor: colors.backgrounds.card,
          borderWidth: 1,
          borderColor: colors.border,
        };
      case 'filled':
        return {
          backgroundColor: colors.backgrounds.tertiary,
        };
      case 'default':
      default:
        return {
          backgroundColor: colors.backgrounds.card,
          ...Shadows.sm,
        };
    }
  };

  const cardStyle = [
    styles.card,
    getVariantStyles(),
    { padding: getPaddingValue() },
    disabled && styles.disabled,
    style,
  ];

  if (onPress && !disabled) {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={({ pressed }) => [
          cardStyle,
          pressed && styles.pressed,
        ]}
        {...props}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View style={cardStyle} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.card,
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  disabled: {
    opacity: 0.5,
  },
});
