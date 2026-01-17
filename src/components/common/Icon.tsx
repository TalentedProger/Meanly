/**
 * MEANLY - Icon Component
 * Wrapper for Expo Vector Icons
 */

import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StyleProp, TextStyle } from 'react-native';

import { useThemeStore } from '../../stores/themeStore';
import { IconSize } from '../../constants/spacing';

type IoniconsName = keyof typeof Ionicons.glyphMap;

interface IconProps {
  name: IoniconsName;
  size?: keyof typeof IconSize | number;
  color?: string;
  style?: StyleProp<TextStyle>;
}

export function Icon({
  name,
  size = 'md',
  color,
  style,
}: IconProps) {
  const { colors } = useThemeStore();

  const iconSize = typeof size === 'number' ? size : IconSize[size];
  const iconColor = color || colors.text.primary;

  return (
    <Ionicons
      name={name}
      size={iconSize}
      color={iconColor}
      style={style}
    />
  );
}

// Common icon presets
export function IconChevronRight(props: Omit<IconProps, 'name'>) {
  return <Icon name="chevron-forward" {...props} />;
}

export function IconChevronLeft(props: Omit<IconProps, 'name'>) {
  return <Icon name="chevron-back" {...props} />;
}

export function IconClose(props: Omit<IconProps, 'name'>) {
  return <Icon name="close" {...props} />;
}

export function IconCheck(props: Omit<IconProps, 'name'>) {
  return <Icon name="checkmark" {...props} />;
}

export function IconBookmark(props: Omit<IconProps, 'name'> & { filled?: boolean }) {
  const { filled, ...rest } = props;
  return <Icon name={filled ? "bookmark" : "bookmark-outline"} {...rest} />;
}

export function IconHeart(props: Omit<IconProps, 'name'> & { filled?: boolean }) {
  const { filled, ...rest } = props;
  return <Icon name={filled ? "heart" : "heart-outline"} {...rest} />;
}

export function IconSearch(props: Omit<IconProps, 'name'>) {
  return <Icon name="search" {...props} />;
}

export function IconSettings(props: Omit<IconProps, 'name'>) {
  return <Icon name="settings-outline" {...props} />;
}

export function IconUser(props: Omit<IconProps, 'name'>) {
  return <Icon name="person-outline" {...props} />;
}

export function IconHome(props: Omit<IconProps, 'name'>) {
  return <Icon name="home-outline" {...props} />;
}

export function IconPlay(props: Omit<IconProps, 'name'>) {
  return <Icon name="play-circle-outline" {...props} />;
}

export function IconRefresh(props: Omit<IconProps, 'name'>) {
  return <Icon name="refresh" {...props} />;
}

export function IconWarning(props: Omit<IconProps, 'name'>) {
  return <Icon name="warning-outline" {...props} />;
}

export function IconInfo(props: Omit<IconProps, 'name'>) {
  return <Icon name="information-circle-outline" {...props} />;
}

export type { IoniconsName };
