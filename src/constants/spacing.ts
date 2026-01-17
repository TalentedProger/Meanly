/**
 * MEANLY Design System - Spacing
 * Consistent spacing scale for margins, paddings, and gaps
 */

// Base spacing unit (4px)
const BASE = 4;

// Spacing Scale
export const Spacing = {
  // Extra small
  xxs: BASE, // 4
  xs: BASE * 2, // 8
  
  // Small
  sm: BASE * 3, // 12
  
  // Medium
  md: BASE * 4, // 16
  
  // Large
  lg: BASE * 5, // 20
  xl: BASE * 6, // 24
  
  // Extra large
  '2xl': BASE * 8, // 32
  '3xl': BASE * 10, // 40
  '4xl': BASE * 12, // 48
  '5xl': BASE * 16, // 64
  
  // Screen margins
  screenHorizontal: BASE * 4, // 16
  screenVertical: BASE * 6, // 24
  
  // Card padding
  cardHorizontal: BASE * 4, // 16
  cardVertical: BASE * 5, // 20
  
  // Section spacing
  sectionGap: BASE * 8, // 32
  itemGap: BASE * 3, // 12
} as const;

// Border Radius
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
  
  // Component-specific
  button: 12,
  card: 16,
  input: 12,
  chip: 20,
  avatar: 9999,
  modal: 24,
} as const;

// Shadows (for iOS)
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
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  
  // Component-specific
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  
  button: {
    shadowColor: '#EC5E27',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  
  floating: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
} as const;

// Z-Index
export const ZIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modal: 1300,
  popover: 1400,
  tooltip: 1500,
  toast: 1600,
} as const;

// Icon Sizes
export const IconSize = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
} as const;

// Touch Target
export const TouchTarget = {
  minimum: 44, // Apple HIG minimum
  comfortable: 48,
  large: 56,
} as const;

export type SpacingValue = typeof Spacing[keyof typeof Spacing];
export type BorderRadiusValue = typeof BorderRadius[keyof typeof BorderRadius];
