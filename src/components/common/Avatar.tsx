/**
 * MEANLY - Avatar Component
 * User avatar with fallback initials
 */

import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

import { Text } from './Text';
import { useThemeStore } from '../../stores/themeStore';
import { BorderRadius } from '../../constants/spacing';
import { getInitials } from '../../utils/formatters';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  source?: string | null;
  name?: string;
  size?: AvatarSize;
}

const SIZES: Record<AvatarSize, { container: number; text: number }> = {
  sm: { container: 32, text: 12 },
  md: { container: 40, text: 14 },
  lg: { container: 56, text: 18 },
  xl: { container: 80, text: 24 },
};

export function Avatar({
  source,
  name = '',
  size = 'md',
}: AvatarProps) {
  const { colors } = useThemeStore();
  const sizeConfig = SIZES[size];

  const containerStyle = {
    width: sizeConfig.container,
    height: sizeConfig.container,
    borderRadius: sizeConfig.container / 2,
  };

  if (source) {
    return (
      <Image
        source={{ uri: source }}
        style={[styles.image, containerStyle]}
      />
    );
  }

  // Fallback to initials
  const initials = getInitials(name);

  return (
    <View
      style={[
        styles.fallback,
        containerStyle,
        { backgroundColor: colors.primary },
      ]}
    >
      <Text
        style={{ fontSize: sizeConfig.text }}
        color={colors.text.inverse}
      >
        {initials}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    resizeMode: 'cover',
  },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
