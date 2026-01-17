/**
 * MEANLY - Sign In Screen
 */

import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';

import { Text, Heading2, Input, Button, Icon, Divider } from '../../src/components/common';
import { useThemeStore } from '../../src/stores/themeStore';
import { useAuthStore } from '../../src/stores/authStore';
import { Spacing } from '../../src/constants/spacing';
import { validateEmail, validatePassword } from '../../src/utils/validators';

export default function SignInScreen() {
  const router = useRouter();
  const { colors } = useThemeStore();
  const { signIn, signInWithGoogle, signInWithApple, isLoading, error: authError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleSignIn = async () => {
    // Reset errors
    setErrors({});
    
    // Validate
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);
    
    if (!emailValidation.valid || !passwordValidation.valid) {
      setErrors({
        email: emailValidation.error,
        password: passwordValidation.error,
      });
      return;
    }

    try {
      await signIn(email, password);
      router.replace('/(tabs)');
    } catch (e) {
      // Error is handled in authStore
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      router.replace('/(tabs)');
    } catch (e) {
      Alert.alert('Ошибка', 'Не удалось войти через Google');
    }
  };

  const handleAppleSignIn = async () => {
    try {
      await signInWithApple();
      router.replace('/(tabs)');
    } catch (e) {
      Alert.alert('Ошибка', 'Не удалось войти через Apple');
    }
  };

  const handleForgotPassword = () => {
    router.push('/(auth)/forgot-password');
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
        
        <Heading2>Вход</Heading2>
        <Text variant="body" color={colors.text.secondary} style={styles.subtitle}>
          С возвращением! Войдите в свой аккаунт
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
            placeholder="Введите пароль"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoComplete="password"
            error={errors.password}
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

          <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPassword}>
            <Text variant="bodySmall" color={colors.primary}>
              Забыли пароль?
            </Text>
          </TouchableOpacity>

          <Button
            title="Войти"
            variant="primary"
            size="lg"
            isFullWidth
            onPress={handleSignIn}
            isLoading={isLoading}
            style={styles.signInButton}
          />
        </View>

        {/* Social Sign In */}
        <View style={styles.socialSection}>
          <Divider label="или" spacing="md" />

          <Button
            title="Продолжить с Google"
            variant="outline"
            size="lg"
            isFullWidth
            onPress={handleGoogleSignIn}
            leftIcon={<Text>🔵</Text>}
          />

          <Button
            title="Продолжить с Apple"
            variant="outline"
            size="lg"
            isFullWidth
            onPress={handleAppleSignIn}
            leftIcon={<Text>🍎</Text>}
            style={styles.appleButton}
          />
        </View>

        {/* Sign Up Link */}
        <View style={styles.signUpSection}>
          <Text variant="body" color={colors.text.secondary}>
            Нет аккаунта?{' '}
          </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/sign-up')}>
            <Text variant="bodyMedium" color={colors.primary}>
              Зарегистрироваться
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
  errorBanner: {
    padding: Spacing.md,
    borderRadius: 12,
    marginBottom: Spacing.sm,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: Spacing.xxs,
  },
  signInButton: {
    marginTop: Spacing.md,
  },
  socialSection: {
    marginTop: Spacing.xl,
  },
  appleButton: {
    marginTop: Spacing.sm,
  },
  signUpSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.xl,
  },
});
