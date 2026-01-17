/**
 * MEANLY Design System - Colors & Design Tokens
 * Фирменные цвета: Графит #2F2F2F, Оранжевый #EC5E27, Зелёный #00311F, Голубой #26538D
 */

// ========================
// BRAND COLORS
// ========================
export const BrandColors = {
  graphite: '#2F2F2F',
  orange: '#EC5E27',
  deepGreen: '#00311F',
  steelBlue: '#26538D',
  cream: '#FFF8F5',
  white: '#FFFFFF',
} as const;

// ========================
// SPACING SCALE
// ========================
export const Spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
  screenHorizontal: 24,
  screenVertical: 16,
  cardVertical: 20,
  cardHorizontal: 20,
} as const;

// ========================
// BORDER RADIUS
// ========================
export const BorderRadius = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  full: 9999,
  button: 16,
  card: 20,
  chip: 12,
  input: 14,
} as const;

// ========================
// SHADOWS
// ========================
export const Shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  button: {
    shadowColor: BrandColors.orange,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
} as const;

// ========================
// MAIN COLORS OBJECT
// ========================
export const Colors = {
  // Primary Brand Colors
  primary: BrandColors.orange,
  primaryLight: '#FF7A4A',
  primaryDark: '#C94A1D',
  primaryMuted: 'rgba(236, 94, 39, 0.15)',

  // Secondary Colors
  secondary: BrandColors.deepGreen,
  secondaryLight: '#004D2F',
  secondaryDark: '#001F13',

  // Accent Colors
  accent: BrandColors.steelBlue,
  accentLight: '#3A6AA8',
  accentDark: '#1C3E6B',

  // Graphite
  graphite: BrandColors.graphite,

  // Neutral Gray Scale
  gray50: '#FAFAFA',
  gray100: '#F5F5F5',
  gray200: '#EEEEEE',
  gray300: '#E0E0E0',
  gray400: '#BDBDBD',
  gray500: '#9E9E9E',
  gray600: '#757575',
  gray700: '#616161',
  gray800: '#424242',
  gray900: '#212121',

  // Semantic Colors
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  info: BrandColors.steelBlue,
  infoLight: '#DBEAFE',

  // Basic
  white: '#FFFFFF',
  black: '#000000',
  cream: BrandColors.cream,
  transparent: 'transparent',

  // Text Colors (flat)
  textPrimary: BrandColors.graphite,
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  textInverse: '#FFFFFF',

  // Background Colors (flat)
  background: '#FFFFFF',
  backgroundSecondary: '#F9FAFB',

  // Text Colors (nested)
  text: {
    primary: BrandColors.graphite,
    secondary: '#6B7280',
    tertiary: '#9CA3AF',
    inverse: '#FFFFFF',
    muted: '#9CA3AF',
    link: BrandColors.steelBlue,
    accent: BrandColors.orange,
  },

  // Background Colors (nested)
  backgrounds: {
    primary: '#FFFFFF',
    secondary: '#F9FAFB',
    tertiary: '#F3F4F6',
    card: '#FFFFFF',
    elevated: '#FFFFFF',
    overlay: 'rgba(0, 0, 0, 0.5)',
    dark: BrandColors.graphite,
    accent: 'rgba(236, 94, 39, 0.08)',
    cream: BrandColors.cream,
    whiteContainer: '#FFFFFF',
  },

  // Semantic Colors (nested)
  semantic: {
    success: '#10B981',
    successLight: '#D1FAE5',
    warning: '#F59E0B',
    warningLight: '#FEF3C7',
    error: '#EF4444',
    errorLight: '#FEE2E2',
    info: BrandColors.steelBlue,
    infoLight: '#DBEAFE',
  },

  // Word Learning Colors
  word: {
    good: '#10B981',
    bad: '#EF4444',
    before: '#6B7280',
    after: '#10B981',
    context: BrandColors.steelBlue,
    highlight: BrandColors.orange,
  },

  // UI Specific
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  divider: '#F3F4F6',
  disabled: '#D1D5DB',
  placeholder: '#9CA3AF',

  // Tab Bar
  tabBar: {
    active: BrandColors.orange,
    inactive: '#9CA3AF',
    background: '#FFFFFF',
  },

  // Gradients
  gradients: {
    primary: [BrandColors.orange, '#FF7A4A'],
    secondary: [BrandColors.deepGreen, '#004D2F'],
    accent: [BrandColors.steelBlue, '#3A6AA8'],
    dark: [BrandColors.graphite, '#1A1A1A'],
  },
} as const;

// ========================
// DARK THEME
// ========================
export const ColorsDark = {
  ...Colors,

  primary: BrandColors.orange,
  secondary: BrandColors.deepGreen,
  accent: '#4A7AB8',

  textPrimary: '#FFFFFF',
  textSecondary: '#A3A3A3',
  textTertiary: '#737373',
  
  background: '#121212',
  backgroundSecondary: '#1E1E1E',

  text: {
    primary: '#FFFFFF',
    secondary: '#A3A3A3',
    tertiary: '#737373',
    inverse: BrandColors.graphite,
    muted: '#6B7280',
    link: '#4A7AB8',
    accent: BrandColors.orange,
  },

  backgrounds: {
    primary: '#121212',
    secondary: '#1E1E1E',
    tertiary: '#2D2D2D',
    card: '#1A1A1A',
    elevated: '#222222',
    overlay: 'rgba(0, 0, 0, 0.7)',
    dark: '#0A0A0A',
    accent: 'rgba(236, 94, 39, 0.15)',
    cream: '#1E1E1E',
    // White containers in dark theme - 70% opacity gray
    whiteContainer: 'rgba(255, 255, 255, 0.12)',
  },

  border: '#333333',
  borderLight: '#2D2D2D',
  divider: '#2D2D2D',

  tabBar: {
    active: BrandColors.orange,
    inactive: '#737373',
    background: '#121212',
  },
} as const;

export type ThemeColors = typeof Colors | typeof ColorsDark;
