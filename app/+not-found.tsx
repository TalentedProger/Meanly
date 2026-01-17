/**
 * MEANLY - Not Found Screen
 * 404 fallback
 */

import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Link, Stack } from 'expo-router';

import { Text, Heading2, Button, Icon } from '../src/components/common';
import { useThemeStore } from '../src/stores/themeStore';
import { Spacing } from '../src/constants/spacing';

export default function NotFoundScreen() {
  const { colors } = useThemeStore();

  return (
    <>
      <Stack.Screen options={{ title: 'Страница не найдена' }} />
      <SafeAreaView style={[styles.container, { backgroundColor: colors.backgrounds.primary }]}>
        <View style={styles.content}>
          <View style={[styles.iconContainer, { backgroundColor: colors.backgrounds.secondary }]}>
            <Icon name="help-circle-outline" size="3xl" color={colors.text.secondary} />
          </View>
          
          <Heading2 align="center">Упс!</Heading2>
          
          <Text variant="body" color={colors.text.secondary} align="center" style={styles.message}>
            Эта страница не существует или была удалена
          </Text>
          
          <Link href="/(tabs)" asChild>
            <Button
              title="На главную"
              variant="primary"
              size="lg"
              style={styles.button}
            />
          </Link>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.screenHorizontal,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  message: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  button: {
    minWidth: 200,
  },
});
