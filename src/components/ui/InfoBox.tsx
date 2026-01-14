// src/components/ui/InfoBox.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from './theme';

export type InfoBoxVariant = 'info' | 'success' | 'warning' | 'error';

export interface InfoBoxProps {
  message: string;
  variant?: InfoBoxVariant;
  title?: string;
}

interface VariantConfig {
  bg: string;
  border: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  iconColor: string;
}

const variantConfig: Record<InfoBoxVariant, VariantConfig> = {
  info: {
    bg: colors.infoLight,
    border: colors.primary,
    icon: 'info',
    iconColor: colors.primary,
  },
  success: {
    bg: colors.successLight,
    border: colors.success,
    icon: 'check-circle',
    iconColor: colors.success,
  },
  warning: {
    bg: colors.warningLight,
    border: colors.warning,
    icon: 'warning',
    iconColor: colors.warning,
  },
  error: {
    bg: colors.errorLight,
    border: colors.error,
    icon: 'error',
    iconColor: colors.error,
  },
};

export const InfoBox: React.FC<InfoBoxProps> = ({
  message,
  variant = 'info',
  title,
}) => {
  const config = variantConfig[variant];

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: config.bg, borderLeftColor: config.border },
      ]}
    >
      <MaterialIcons name={config.icon} size={20} color={config.iconColor} />
      <View style={styles.content}>
        {title && <Text style={styles.title}>{title}</Text>}
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    padding: spacing.md,
    borderLeftWidth: 4,
    borderRadius: borderRadius.md,
  },
  content: {
    flex: 1,
  },
  title: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: spacing.xs,
    color: colors.textPrimary,
  },
  message: {
    ...typography.body,
    color: colors.textPrimary,
    lineHeight: 20,
  },
});
