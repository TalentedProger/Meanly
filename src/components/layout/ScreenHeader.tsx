/**
 * MEANLY - Screen Header Component
 * Reusable header with back button, title, and actions
 */

import React, { memo, ReactNode, useCallback } from 'react';
import { View, StyleSheet, Pressable, ViewStyle, StyleProp } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useNavigation } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '../common/Text';
import { Colors, Spacing, BorderRadius } from '../../constants/colors';

interface ScreenHeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  leftAction?: ReactNode;
  rightAction?: ReactNode;
  transparent?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const ScreenHeader = memo(function ScreenHeader({
  title,
  subtitle,
  showBack = true,
  onBack,
  leftAction,
  rightAction,
  transparent = false,
  style,
}: ScreenHeaderProps) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const handleBack = useCallback(() => {
    if (onBack) {
      onBack();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      router.back();
    }
  }, [onBack, navigation]);

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + Spacing.sm },
        transparent && styles.transparent,
        style,
      ]}
    >
      <View style={styles.content}>
        {/* Left Side */}
        <View style={styles.leftContainer}>
          {showBack ? (
            <Pressable
              onPress={handleBack}
              hitSlop={8}
              style={styles.backButton}
            >
              <Ionicons
                name="chevron-back"
                size={28}
                color={transparent ? Colors.white : Colors.textPrimary}
              />
            </Pressable>
          ) : leftAction ? (
            <View style={styles.actionContainer}>{leftAction}</View>
          ) : (
            <View style={styles.placeholder} />
          )}
        </View>

        {/* Center - Title */}
        <View style={styles.titleContainer}>
          {title && (
            <Text
              variant="subtitle"
              numberOfLines={1}
              style={[
                styles.title,
                transparent && styles.titleTransparent,
              ]}
            >
              {title}
            </Text>
          )}
          {subtitle && (
            <Text
              variant="caption"
              numberOfLines={1}
              color={transparent ? 'rgba(255,255,255,0.8)' : Colors.gray500}
            >
              {subtitle}
            </Text>
          )}
        </View>

        {/* Right Side */}
        <View style={styles.rightContainer}>
          {rightAction ? (
            <View style={styles.actionContainer}>{rightAction}</View>
          ) : (
            <View style={styles.placeholder} />
          )}
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
    paddingBottom: Spacing.sm,
  },
  transparent: {
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    minHeight: 44,
  },
  leftContainer: {
    width: 44,
    alignItems: 'flex-start',
  },
  rightContainer: {
    width: 44,
    alignItems: 'flex-end',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
  },
  titleTransparent: {
    color: Colors.white,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    width: 40,
    height: 40,
  },
});

export default ScreenHeader;
