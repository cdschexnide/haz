// src/components/ui/theme.ts

export const colors = {
  // Primary actions
  primary: '#007AFF',
  primaryPressed: '#0056B3',

  // Semantic colors
  success: '#34C759',
  error: '#FF3B30',
  warning: '#FF9500',

  // Neutral
  textPrimary: '#1D1D1F',
  textSecondary: '#8E8E93',
  border: '#E5E5EA',
  borderLight: '#F2F2F7',
  background: '#F8F9FA',
  backgroundSecondary: '#F4F4F4',
  surface: '#FFFFFF',
  white: '#FFFFFF',

  // Status backgrounds
  successLight: '#F0FFF4',
  errorLight: '#FFF5F5',
  warningLight: '#FFF9E6',
  infoLight: '#E3F2FD',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
};

export const typography = {
  headerTitle: { fontSize: 18, fontWeight: '600' as const },
  cardTitle: { fontSize: 16, fontWeight: '600' as const },
  body: { fontSize: 14, fontWeight: '400' as const },
  caption: { fontSize: 12, color: colors.textSecondary },
  label: { fontSize: 11, fontWeight: '600' as const, textTransform: 'uppercase' as const },
};

export const shadows = {
  light: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
};
