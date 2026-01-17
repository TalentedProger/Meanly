/**
 * MEANLY - Profile Screen
 * Современный профиль с секциями как на референсах
 */

import React from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  Pressable,
  StatusBar,
  Switch,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '../../src/components/common';
import { useThemeStore } from '../../src/stores/themeStore';
import { useAuthStore } from '../../src/stores/authStore';
import { BrandColors, Spacing, BorderRadius, Shadows } from '../../src/constants/colors';

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark, toggleTheme } = useThemeStore();
  const { user, signOut } = useAuthStore();

  const isGuest = user?.isGuest ?? false;

  const handleSignOut = () => {
    Alert.alert(
      'Выйти из аккаунта',
      'Вы уверены, что хотите выйти?',
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Выйти', 
          style: 'destructive',
          onPress: () => signOut(),
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.backgrounds.primary }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Профиль</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <LinearGradient
            colors={[BrandColors.graphite, '#1F1F1F']}
            style={styles.profileGradient}
          >
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={[BrandColors.orange, '#D54E20']}
                style={styles.avatar}
              >
                <Ionicons name="person" size={32} color={BrandColors.white} />
              </LinearGradient>
            </View>
            
            <Text style={styles.profileName}>
              {isGuest ? 'Гость' : (user?.displayName || 'Пользователь')}
            </Text>
            
            {isGuest ? (
              <View style={styles.guestBadge}>
                <Ionicons name="information-circle" size={14} color={BrandColors.orange} />
                <Text style={styles.guestBadgeText}>Гостевой режим</Text>
              </View>
            ) : (
              <Text style={styles.profileEmail}>{user?.email}</Text>
            )}

            {isGuest && (
              <Pressable 
                style={({ pressed }) => [
                  styles.upgradeButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={() => router.push('/(auth)/welcome')}
              >
                <Ionicons name="sparkles" size={16} color={BrandColors.graphite} />
                <Text style={styles.upgradeButtonText}>Создать аккаунт</Text>
              </Pressable>
            )}
          </LinearGradient>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Аккаунт</Text>
          <View style={styles.sectionContent}>
            <SettingsItem 
              icon="person-outline"
              title="Редактировать профиль"
              onPress={() => {}}
            />
            <SettingsItem 
              icon="school-outline"
              title="Уровень"
              value="Средний"
              onPress={() => {}}
            />
            <SettingsItem 
              icon="flag-outline"
              title="Цель обучения"
              value="Говорить увереннее"
              onPress={() => {}}
              isLast
            />
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Настройки</Text>
          <View style={styles.sectionContent}>
            <SettingsItem 
              icon={isDark ? 'moon' : 'sunny-outline'}
              title="Тёмная тема"
              rightElement={
                <Switch
                  value={isDark}
                  onValueChange={toggleTheme}
                  trackColor={{ 
                    false: '#E5E7EB', 
                    true: BrandColors.orange 
                  }}
                  thumbColor={BrandColors.white}
                />
              }
            />
            <SettingsItem 
              icon="notifications-outline"
              title="Уведомления"
              value="Включены"
              onPress={() => {}}
            />
            <SettingsItem 
              icon="language-outline"
              title="Язык"
              value="Русский"
              onPress={() => {}}
            />
            <SettingsItem 
              icon="time-outline"
              title="Время занятий"
              value="5 минут в день"
              onPress={() => {}}
              isLast
            />
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Поддержка</Text>
          <View style={styles.sectionContent}>
            <SettingsItem 
              icon="help-circle-outline"
              title="Помощь"
              onPress={() => {}}
            />
            <SettingsItem 
              icon="mail-outline"
              title="Обратная связь"
              onPress={() => {}}
            />
            <SettingsItem 
              icon="document-text-outline"
              title="Условия использования"
              onPress={() => {}}
            />
            <SettingsItem 
              icon="shield-checkmark-outline"
              title="Политика конфиденциальности"
              onPress={() => {}}
              isLast
            />
          </View>
        </View>

        {/* Pro Section */}
        <Pressable 
          style={({ pressed }) => [
            styles.proCard,
            pressed && styles.proCardPressed,
          ]}
        >
          <LinearGradient
            colors={[BrandColors.steelBlue, '#1E4470']}
            style={styles.proGradient}
          >
            <View style={styles.proIcon}>
              <Ionicons name="diamond" size={24} color={BrandColors.white} />
            </View>
            <View style={styles.proContent}>
              <Text style={styles.proTitle}>MEANLY PRO</Text>
              <Text style={styles.proSubtitle}>Разблокируй все возможности</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.6)" />
          </LinearGradient>
        </Pressable>

        {/* Sign Out */}
        <Pressable 
          style={({ pressed }) => [
            styles.signOutButton,
            pressed && styles.signOutPressed,
          ]}
          onPress={handleSignOut}
        >
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={styles.signOutText}>Выйти из аккаунта</Text>
        </Pressable>

        {/* Version */}
        <Text style={styles.version}>MEANLY v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

function SettingsItem({ 
  icon, 
  title, 
  value,
  rightElement,
  onPress,
  isLast = false,
}: { 
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value?: string;
  rightElement?: React.ReactNode;
  onPress?: () => void;
  isLast?: boolean;
}) {
  const content = (
    <View style={[styles.settingsItem, !isLast && styles.settingsItemBorder]}>
      <View style={styles.settingsItemLeft}>
        <View style={styles.settingsIconContainer}>
          <Ionicons name={icon} size={20} color={BrandColors.graphite} />
        </View>
        <Text style={styles.settingsItemTitle}>{title}</Text>
      </View>
      <View style={styles.settingsItemRight}>
        {value && <Text style={styles.settingsItemValue}>{value}</Text>}
        {rightElement}
        {!rightElement && onPress && (
          <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
        )}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <Pressable 
        style={({ pressed }) => pressed && styles.settingsItemPressed}
        onPress={onPress}
      >
        {content}
      </Pressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.screenHorizontal,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 20,
    paddingTop: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: BrandColors.graphite,
    lineHeight: 38,
    includeFontPadding: false,
  },
  profileCard: {
    ...Shadows.lg,
    borderRadius: BorderRadius.card,
    marginBottom: 24,
  },
  profileGradient: {
    padding: 24,
    borderRadius: BorderRadius.card,
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  profileName: {
    fontSize: 22,
    fontWeight: '700',
    color: BrandColors.white,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  guestBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(236, 94, 39, 0.15)',
    borderRadius: BorderRadius.full,
    marginTop: 8,
  },
  guestBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: BrandColors.orange,
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: BrandColors.white,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: BorderRadius.button,
    marginTop: 16,
  },
  upgradeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: BrandColors.graphite,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
    marginLeft: 4,
  },
  sectionContent: {
    backgroundColor: BrandColors.white,
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  settingsItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingsItemPressed: {
    backgroundColor: '#F9FAFB',
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingsIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingsItemTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: BrandColors.graphite,
  },
  settingsItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingsItemValue: {
    fontSize: 14,
    fontWeight: '400',
    color: '#9CA3AF',
  },
  proCard: {
    ...Shadows.md,
    borderRadius: BorderRadius.lg,
    marginBottom: 24,
  },
  proCardPressed: {
    opacity: 0.95,
    transform: [{ scale: 0.99 }],
  },
  proGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: BorderRadius.lg,
  },
  proIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  proContent: {
    flex: 1,
  },
  proTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: BrandColors.white,
    marginBottom: 2,
  },
  proSubtitle: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: BorderRadius.lg,
    marginBottom: 20,
  },
  signOutPressed: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  signOutText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#EF4444',
  },
  version: {
    fontSize: 12,
    fontWeight: '400',
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 20,
  },
});
