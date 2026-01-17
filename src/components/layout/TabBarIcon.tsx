/**
 * MEANLY - Tab Bar Icon Component
 * Custom icon for tab bar with badge support
 */

import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '../common/Text';
import { Colors, Spacing, BorderRadius } from '../../constants/colors';

interface TabBarIconProps {
  name: keyof typeof Ionicons.glyphMap;
  color: string;
  size?: number;
  focused?: boolean;
  badge?: number | boolean;
}

export const TabBarIcon = memo(function TabBarIcon({
  name,
  color,
  size = 24,
  focused = false,
  badge,
}: TabBarIconProps) {
  const showBadge = badge === true || (typeof badge === 'number' && badge > 0);
  const badgeText = typeof badge === 'number' ? (badge > 99 ? '99+' : badge.toString()) : '';

  return (
    <View style={styles.container}>
      <Ionicons
        name={focused ? name : (`${name}-outline` as keyof typeof Ionicons.glyphMap)}
        size={size}
        color={color}
      />
      {showBadge && (
        <View style={[styles.badge, badgeText ? styles.badgeWithText : styles.badgeDot]}>
          {badgeText ? (
            <Text variant="caption" style={styles.badgeText}>
              {badgeText}
            </Text>
          ) : null}
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    backgroundColor: Colors.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeDot: {
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  badgeWithText: {
    top: -4,
    right: -8,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '600',
    lineHeight: 14,
  },
});

export default TabBarIcon;
