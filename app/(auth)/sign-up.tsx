/**
 * MEANLY - Sign Up Screen
 */

import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';

import { Text, Heading2, Input, Button, Icon, Divider } from '../../src/components/common';
import { useThemeStore } from '../../src/stores/themeStore';
import { useAuthStore } from '../../src/stores/authStore';
import { Spacing } from '../../src/constants/spacing';
import { validateEmail, validatePassword, validateDisplayName } from '../../src/utils/validators';

export default function SignUpScreen() {
  const router = useRouter();
  const { colors } = useThemeStore();
  const { signUp, signInWithGoogle, signInWithApple, isLoading, error: authError } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

  const handleSignUp = async () => {
    // Reset errors
    setErrors({});
    
    // Validate
    const nameValidation = validateDisplayName(name);
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);
    
    if (!nameValidation.valid || !emailValidation.valid || !passwordValidation.valid) {
      setErrors({
        name: nameValidation.error,
        email: emailValidation.error,
        password: passwordValidation.error,
      });
      return;
    }

    try {
      await signUp(email, password);
      router.replace('/(onboarding)/goal');
    } catch (e) {
      // Error is handled in authStore
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      await signInWithGoogle();
      router.replace('/(onboarding)/goal');
    } catch (e) {
      Alert.alert('Ошибка', 'Не удалось войти через Google');
    }
  };

  const handleAppleSignUp = async () => {
    try {
      await signInWithApple();
      router.replace('/(onboarding)/goal');
    } catch (e) {
      Alert.alert('Ошибка', 'Не удалось войти через Apple');
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgrounds.primary }]}>
      <View style={styles.content}>
        {/* Header */}
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon name="arrow-back" size="md" color={colors.text.primary} />
        </TouchableOpacity>
        
        <Heading2>Регистрация</Heading2>
        <Text variant="body" color={colors.text.secondary} style={styles.subtitle}>
          Создайте аккаунт, чтобы сохранять прогресс
        </Text>

        {/* Form */}
        <View style={styles.form}>
          {authError && (
            <View style={[styles.errorBanner, { backgroundColor: colors.semantic.errorLight }]}>
              <Text variant="bodySmall" color={colors.semantic.error}>
                {authError}
              </Text>
            </View>
          )}

          <Input
            label="Имя"
            placeholder="Как вас зовут?"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            autoComplete="name"
            error={errors.name}
          />

          <Input
            label="Email"
            placeholder="Введите ваш email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            error={errors.email}
          />

          <Input
            label="Пароль"
            placeholder="Придумайте пароль"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoComplete="password-new"
            error={errors.password}
            hint="Минимум 8 символов"
            rightIcon={
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Icon 
                  name={showPassword ? 'eye-off' : 'eye'} 
                  size="sm" 
                  color={colors.text.secondary} 
                />
              </TouchableOpacity>
            }
          />

          <Button
            title="Создать аккаунт"
            variant="primary"
            size="lg"
            isFullWidth
            onPress={handleSignUp}
            isLoading={isLoading}
            style={styles.signUpButton}
          />
        </View>

        {/* Social Sign Up */}
        <View style={styles.socialSection}>
          <Divider label="или" spacing="md" />

          <Button
            title="Продолжить с Google"
            variant="outline"
            size="lg"
            isFullWidth
            onPress={handleGoogleSignUp}
            leftIcon={<Text>🔵</Text>}
          />

          <Button
            title="Продолжить с Apple"
            variant="outline"
            size="lg"
            isFullWidth
            onPress={handleAppleSignUp}
            leftIcon={<Text>🍎</Text>}
            style={styles.appleButton}
          />
        </View>

        {/* Sign In Link */}
        <View style={styles.signInSection}>
          <Text variant="body" color={colors.text.secondary}>
            Уже есть аккаунт?{' '}
          </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/sign-in')}>
            <Text variant="bodyMedium" color={colors.primary}>
              Войти
            </Text>
          </TouchableOpacity>
        </View>

        {/* Terms */}
        <Text variant="caption" color={colors.text.secondary} align="center" style={styles.terms}>
          Создавая аккаунт, вы соглашаетесь с Условиями использования и Политикой конфиденциальности
        </Text>
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
  errorBanner: {
    padding: Spacing.md,
    borderRadius: 12,
    marginBottom: Spacing.sm,
  },
  signUpButton: {
    marginTop: Spacing.md,
  },
  socialSection: {
    marginTop: Spacing.xl,
  },
  appleButton: {
    marginTop: Spacing.sm,
  },
  signInSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.xl,
  },
  terms: {
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
});
