/**
 * MEANLY - Empty State Component
 * Displayed when no content is available
 */

import React, { memo, ReactNode } from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '../common/Text';
import { Button } from '../common/Button';
import { Colors, Spacing } from '../../constants/colors';

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  actionTitle?: string;
  onAction?: () => void;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const EmptyState = memo(function EmptyState({
  icon = 'document-outline',
  title,
  description,
  actionTitle,
  onAction,
  children,
  style,
}: EmptyStateProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={64} color={Colors.gray300} />
      </View>
      
      <Text variant="h3" color={Colors.gray500} style={styles.title}>
        {title}
      </Text>
      
      {description && (
        <Text variant="body" color={Colors.gray400} style={styles.description}>
          {description}
        </Text>
      )}

      {actionTitle && onAction && (
        <Button
          title={actionTitle}
          onPress={onAction}
          variant="outline"
          style={styles.button}
        />
      )}

      {children}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  iconContainer: {
    marginBottom: Spacing.lg,
    opacity: 0.5,
  },
  title: {
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  description: {
    textAlign: 'center',
    marginBottom: Spacing.lg,
    maxWidth: 280,
  },
  button: {
    marginTop: Spacing.md,
  },
});

export default EmptyState;
