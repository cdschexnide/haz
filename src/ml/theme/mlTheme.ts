/**
 * ML Detection Module Theme
 * Isolated design system for ML detection components
 */

import { ViewStyle, TextStyle, Platform } from 'react-native';

// =============================================================================
// COLOR PALETTE
// =============================================================================

export const colors = {
  // Primary - Deep blue to teal gradient range
  primary: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },

  // Secondary - Cyan/Teal accent
  secondary: {
    50: '#ECFEFF',
    100: '#CFFAFE',
    200: '#A5F3FC',
    300: '#67E8F9',
    400: '#22D3EE',
    500: '#06B6D4',
    600: '#0891B2',
    700: '#0E7490',
    800: '#155E75',
    900: '#164E63',
  },

  // Neutral - Slate grays for backgrounds/text
  neutral: {
    0: '#FFFFFF',
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
    950: '#020617',
  },

  // Success - Emerald green
  success: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    200: '#A7F3D0',
    300: '#6EE7B7',
    400: '#34D399',
    500: '#10B981',
    600: '#059669',
    700: '#047857',
    800: '#065F46',
    900: '#064E3B',
  },

  // Warning - Amber
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },

  // Error/Danger - Rose
  error: {
    50: '#FFF1F2',
    100: '#FFE4E6',
    200: '#FECDD3',
    300: '#FDA4AF',
    400: '#FB7185',
    500: '#F43F5E',
    600: '#E11D48',
    700: '#BE123C',
    800: '#9F1239',
    900: '#881337',
  },

  // Hazmat category colors
  hazmat: {
    general: '#3B82F6',     // Blue
    class1: '#EF4444',      // Red - Explosives
    class2: '#22C55E',      // Green - Gases
    class3: '#F97316',      // Orange - Flammable Liquids
    class4: '#EAB308',      // Yellow - Flammable Solids
    class5: '#A855F7',      // Purple - Oxidizers
    class6: '#EC4899',      // Pink - Toxic/Infectious
    class8: '#6366F1',      // Indigo - Corrosives
    class9: '#64748B',      // Slate - Miscellaneous
    unknown: '#94A3B8',     // Gray
  },

  // Overlay/transparency colors
  overlay: {
    dark90: 'rgba(15, 23, 42, 0.9)',
    dark80: 'rgba(15, 23, 42, 0.8)',
    dark60: 'rgba(15, 23, 42, 0.6)',
    dark40: 'rgba(15, 23, 42, 0.4)',
    light90: 'rgba(255, 255, 255, 0.9)',
    light80: 'rgba(255, 255, 255, 0.8)',
    light60: 'rgba(255, 255, 255, 0.6)',
    light20: 'rgba(255, 255, 255, 0.2)',
    light10: 'rgba(255, 255, 255, 0.1)',
    light05: 'rgba(255, 255, 255, 0.05)',
  },
} as const;

// =============================================================================
// SPACING
// =============================================================================

export const spacing = {
  0: 0,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  3.5: 14,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  11: 44,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
  28: 112,
  32: 128,
} as const;

// =============================================================================
// BORDER RADIUS
// =============================================================================

export const radius = {
  none: 0,
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  '4xl': 32,
  full: 9999,
} as const;

// =============================================================================
// SHADOWS
// =============================================================================

export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  } as ViewStyle,

  xs: {
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  } as ViewStyle,

  sm: {
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  } as ViewStyle,

  md: {
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  } as ViewStyle,

  lg: {
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  } as ViewStyle,

  xl: {
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 12,
  } as ViewStyle,

  '2xl': {
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.15,
    shadowRadius: 32,
    elevation: 16,
  } as ViewStyle,

  primary: {
    shadowColor: colors.primary[500],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  } as ViewStyle,
} as const;

// =============================================================================
// TEXT STYLES
// =============================================================================

export const textStyles = {
  h1: {
    fontSize: 36,
    lineHeight: 44,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: colors.neutral[900],
  } as TextStyle,

  h2: {
    fontSize: 30,
    lineHeight: 38,
    fontWeight: '700',
    letterSpacing: -0.3,
    color: colors.neutral[900],
  } as TextStyle,

  h3: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700',
    color: colors.neutral[900],
  } as TextStyle,

  h4: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600',
    color: colors.neutral[800],
  } as TextStyle,

  body: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400',
    color: colors.neutral[600],
  } as TextStyle,

  bodySmall: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400',
    color: colors.neutral[500],
  } as TextStyle,

  label: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    letterSpacing: 0.3,
    color: colors.neutral[700],
  } as TextStyle,

  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
    color: colors.neutral[500],
  } as TextStyle,
} as const;

// =============================================================================
// THEME EXPORT
// =============================================================================

export const mlTheme = {
  colors,
  spacing,
  radius,
  shadows,
  textStyles,
} as const;

export default mlTheme;
