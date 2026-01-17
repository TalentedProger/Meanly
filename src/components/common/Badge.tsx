/**
 * MEANLY - Badge Component
 * Small status indicator or label
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

import { Text } from './Text';
import { useThemeStore } from '../../stores/themeStore';
import { BorderRadius, Spacing } from '../../constants/spacing';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'pro' | 'primary' | 'secondary' | 'outline';

interface BadgeProps {
  label?: string;
  children?: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

export function Badge({
  label,
  children,
  variant = 'default',
  size = 'md',
  style,
}: BadgeProps) {
  const { colors } = useThemeStore();

  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return {
          backgroundColor: colors.semantic.successLight,
          textColor: colors.semantic.success,
          borderColor: 'transparent',
        };
      case 'warning':
        return {
          backgroundColor: colors.semantic.warningLight,
          textColor: colors.semantic.warning,
          borderColor: 'transparent',
        };
      case 'error':
        return {
          backgroundColor: colors.semantic.errorLight,
          textColor: colors.semantic.error,
          borderColor: 'transparent',
        };
      case 'info':
        return {
          backgroundColor: colors.semantic.infoLight,
          textColor: colors.semantic.info,
          borderColor: 'transparent',
        };
      case 'pro':
        return {
          backgroundColor: colors.primary,
          textColor: colors.text.inverse,
          borderColor: 'transparent',
        };
      case 'primary':
        return {
          backgroundColor: colors.primary,
          textColor: colors.text.inverse,
          borderColor: 'transparent',
        };
      case 'secondary':
        return {
          backgroundColor: colors.secondary,
          textColor: colors.text.inverse,
          borderColor: 'transparent',
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          textColor: colors.text.primary,
          borderColor: colors.border,
        };
      case 'default':
      default:
        return {
          backgroundColor: colors.backgrounds.tertiary,
          textColor: colors.text.secondary,
          borderColor: 'transparent',
        };
    }
  };

  const variantStyles = getVariantStyles();
  const isSmall = size === 'sm';
  const content = children || label;

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: variantStyles.backgroundColor,
          paddingHorizontal: isSmall ? Spacing.xs : Spacing.sm,
          paddingVertical: isSmall ? 2 : Spacing.xxs,
          borderWidth: variantStyles.borderColor !== 'transparent' ? 1 : 0,
          borderColor: variantStyles.borderColor,
        },
        style,
      ]}
    >
      {typeof content === 'string' ? (
        <Text
          variant={isSmall ? 'captionMedium' : 'label'}
          color={variantStyles.textColor}
        >
          {content}
        </Text>
      ) : (
        content
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: BorderRadius.chip,
    alignSelf: 'flex-start',
  },
});
