/**
 * MEANLY - Text Component
 * Themed text component with typography presets
 */

import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';

import { useThemeStore } from '../../stores/themeStore';
import { Typography, TypographyVariant } from '../../constants/typography';

interface TextProps extends RNTextProps {
  variant?: TypographyVariant;
  color?: string;
  align?: 'left' | 'center' | 'right';
  children: React.ReactNode;
}

export function Text({
  variant = 'bodyMedium',
  color,
  align = 'left',
  style,
  children,
  ...props
}: TextProps) {
  const { colors } = useThemeStore();

  const typographyStyle = Typography[variant];
  const textColor = color || colors.text.primary;

  return (
    <RNText
      style={[
        typographyStyle,
        { color: textColor, textAlign: align },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
}

// Convenient preset components
export function Heading1({ style, ...props }: Omit<TextProps, 'variant'>) {
  return <Text variant="h1" style={style} {...props} />;
}

export function Heading2({ style, ...props }: Omit<TextProps, 'variant'>) {
  return <Text variant="h2" style={style} {...props} />;
}

export function Heading3({ style, ...props }: Omit<TextProps, 'variant'>) {
  return <Text variant="h3" style={style} {...props} />;
}

export function Heading4({ style, ...props }: Omit<TextProps, 'variant'>) {
  return <Text variant="h4" style={style} {...props} />;
}

export function Body({ style, ...props }: Omit<TextProps, 'variant'>) {
  return <Text variant="bodyMedium" style={style} {...props} />;
}

export function BodySmall({ style, ...props }: Omit<TextProps, 'variant'>) {
  return <Text variant="bodySmall" style={style} {...props} />;
}

export function Caption({ style, ...props }: Omit<TextProps, 'variant'>) {
  const { colors } = useThemeStore();
  return <Text variant="caption" color={colors.text.secondary} style={style} {...props} />;
}

export function Label({ style, ...props }: Omit<TextProps, 'variant'>) {
  return <Text variant="label" style={style} {...props} />;
}
