/**
 * MEANLY - Button Component
 * Customizable button with various styles
 */

import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';

import { Text } from './Text';
import { useThemeStore } from '../../stores/themeStore';
import { BorderRadius, Spacing, Shadows, TouchTarget } from '../../constants/spacing';
import { Typography } from '../../constants/typography';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<TouchableOpacityProps, 'children'> {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
  isFullWidth?: boolean;
}

export function Button({
  title,
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  isLoading = false,
  isFullWidth = false,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const { colors } = useThemeStore();

  const isDisabled = disabled || isLoading;

  // Get variant styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: isDisabled ? colors.disabled : colors.primary,
          borderColor: 'transparent',
          textColor: colors.text.inverse,
          loadingColor: colors.text.inverse,
        };
      case 'secondary':
        return {
          backgroundColor: isDisabled ? colors.disabled : colors.secondary,
          borderColor: 'transparent',
          textColor: colors.text.inverse,
          loadingColor: colors.text.inverse,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: isDisabled ? colors.disabled : colors.primary,
          textColor: isDisabled ? colors.disabled : colors.primary,
          loadingColor: colors.primary,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          textColor: isDisabled ? colors.disabled : colors.primary,
          loadingColor: colors.primary,
        };
      case 'danger':
        return {
          backgroundColor: isDisabled ? colors.disabled : colors.semantic.error,
          borderColor: 'transparent',
          textColor: colors.text.inverse,
          loadingColor: colors.text.inverse,
        };
    }
  };

  // Get size styles
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          paddingVertical: Spacing.xs,
          paddingHorizontal: Spacing.md,
          minHeight: TouchTarget.minimum - 8,
          textVariant: 'buttonSmall' as const,
        };
      case 'md':
        return {
          paddingVertical: Spacing.sm,
          paddingHorizontal: Spacing.lg,
          minHeight: TouchTarget.minimum,
          textVariant: 'button' as const,
        };
      case 'lg':
        return {
          paddingVertical: Spacing.md,
          paddingHorizontal: Spacing.xl,
          minHeight: TouchTarget.comfortable,
          textVariant: 'button' as const,
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={isDisabled}
      style={[
        styles.button,
        {
          backgroundColor: variantStyles.backgroundColor,
          borderColor: variantStyles.borderColor,
          paddingVertical: sizeStyles.paddingVertical,
          paddingHorizontal: sizeStyles.paddingHorizontal,
          minHeight: sizeStyles.minHeight,
        },
        variant === 'outline' && styles.outlineButton,
        variant === 'primary' && !isDisabled && Shadows.button,
        isFullWidth && styles.fullWidth,
        style,
      ]}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={variantStyles.loadingColor} size="small" />
      ) : (
        <View style={styles.content}>
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
          <Text
            variant={sizeStyles.textVariant}
            color={variantStyles.textColor}
            style={styles.text}
          >
            {title}
          </Text>
          {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: BorderRadius.button,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  outlineButton: {
    borderWidth: 2,
  },
  fullWidth: {
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  },
  leftIcon: {
    marginRight: Spacing.xs,
  },
  rightIcon: {
    marginLeft: Spacing.xs,
  },
});
