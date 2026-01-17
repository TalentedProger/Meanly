/**
 * MEANLY - Forgot Password Screen
 */

import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';

import { Text, Heading2, Input, Button, Icon } from '../../src/components/common';
import { useThemeStore } from '../../src/stores/themeStore';
import { Spacing } from '../../src/constants/spacing';
import { validateEmail } from '../../src/utils/validators';
import { authService } from '../../src/services/supabase';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { colors } = useThemeStore();

  const [email, setEmail] = useState('');
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleResetPassword = async () => {
    setError(undefined);
    
    // Validate
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      setError(emailValidation.error);
      return;
    }

    setIsLoading(true);
    
    try {
      const { error: resetError } = await authService.resetPassword(email);
      
      if (resetError) {
        setError('Не удалось отправить письмо. Попробуйте позже.');
      } else {
        setIsSuccess(true);
      }
    } catch (e) {
      setError('Произошла ошибка. Попробуйте позже.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (isSuccess) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.backgrounds.primary }]}>
        <View style={styles.successContent}>
          <View style={[styles.successIcon, { backgroundColor: colors.semantic.successLight }]}>
            <Icon name="mail" size="3xl" color={colors.semantic.success} />
          </View>
          
          <Heading2 align="center">Письмо отправлено!</Heading2>
          
          <Text variant="body" color={colors.text.secondary} align="center" style={styles.successText}>
            Мы отправили инструкции по восстановлению пароля на {email}
          </Text>
          
          <Button
            title="Вернуться ко входу"
            variant="primary"
            size="lg"
            isFullWidth
            onPress={() => router.push('/(auth)/sign-in')}
            style={styles.backToSignIn}
          />
          
          <Button
            title="Не получили письмо? Отправить снова"
            variant="ghost"
            size="md"
            isFullWidth
            onPress={() => {
              setIsSuccess(false);
              handleResetPassword();
            }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgrounds.primary }]}>
      <View style={styles.content}>
        {/* Header */}
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon name="arrow-back" size="md" color={colors.text.primary} />
        </TouchableOpacity>
        
        <Heading2>Восстановление пароля</Heading2>
        <Text variant="body" color={colors.text.secondary} style={styles.subtitle}>
          Введите email, на который зарегистрирован аккаунт. Мы отправим ссылку для восстановления пароля.
        </Text>

        {/* Form */}
        <View style={styles.form}>
          <Input
            label="Email"
            placeholder="Введите ваш email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            error={error}
          />

          <Button
            title="Отправить"
            variant="primary"
            size="lg"
            isFullWidth
            onPress={handleResetPassword}
            isLoading={isLoading}
            style={styles.submitButton}
          />
        </View>

        {/* Sign In Link */}
        <View style={styles.signInSection}>
          <Text variant="body" color={colors.text.secondary}>
            Вспомнили пароль?{' '}
          </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/sign-in')}>
            <Text variant="bodyMedium" color={colors.primary}>
              Войти
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: Spacing.screenHorizontal,
    paddingTop: Spacing.md,
  },
  backButton: {
    marginBottom: Spacing.lg,
  },
  subtitle: {
    marginTop: Spacing.xs,
    marginBottom: Spacing.xl,
  },
  form: {
    gap: Spacing.sm,
  },
  submitButton: {
    marginTop: Spacing.md,
  },
  signInSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.xl,
  },
  successContent: {
    flex: 1,
    padding: Spacing.screenHorizontal,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  successText: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  backToSignIn: {
    marginBottom: Spacing.sm,
  },
});
