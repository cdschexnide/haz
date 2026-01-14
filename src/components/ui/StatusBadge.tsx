// src/components/ui/StatusBadge.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from './theme';

export type BadgeStatus =
  | 'verified'
  | 'frustrated'
  | 'detected'
  | 'not-detected'
  | 'matched'
  | 'unmatched'
  | 'pending'
  | 'na'
  | 'in-progress';

export interface StatusBadgeProps {
  status: BadgeStatus;
  label?: string;
  size?: 'sm' | 'md';
}

interface BadgeConfig {
  bg: string;
  text: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  defaultLabel: string;
}

const badgeConfig: Record<BadgeStatus, BadgeConfig> = {
  verified: {
    bg: colors.success,
    text: '#FFFFFF',
    icon: 'check-circle',
    defaultLabel: 'Verified',
  },
  frustrated: {
    bg: colors.error,
    text: '#FFFFFF',
    icon: 'cancel',
    defaultLabel: 'Frustrated',
  },
  detected: {
    bg: colors.success,
    text: '#FFFFFF',
    icon: 'check-circle',
    defaultLabel: 'Detected',
  },
  'not-detected': {
    bg: colors.warning,
    text: '#FFFFFF',
    icon: 'search-off',
    defaultLabel: 'Not Detected',
  },
  matched: {
    bg: colors.success,
    text: '#FFFFFF',
    icon: 'check-circle',
    defaultLabel: 'Matched',
  },
  unmatched: {
    bg: colors.warning,
    text: '#FFFFFF',
    icon: 'help-outline',
    defaultLabel: 'Unmatched',
  },
  pending: {
    bg: colors.border,
    text: colors.textSecondary,
    icon: 'schedule',
    defaultLabel: 'Pending',
  },
  na: {
    bg: colors.background,
    text: colors.textSecondary,
    icon: 'remove',
    defaultLabel: 'N/A',
  },
  'in-progress': {
    bg: colors.primary,
    text: '#FFFFFF',
    icon: 'autorenew',
    defaultLabel: 'In Progress',
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  size = 'md',
}) => {
  const config = badgeConfig[status];
  const isSmall = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: config.bg },
        isSmall && styles.badgeSmall,
      ]}
    >
      <MaterialIcons
        name={config.icon}
        size={isSmall ? 12 : 14}
        color={config.text}
      />
      <Text
        style={[
          styles.label,
          { color: config.text },
          isSmall && styles.labelSmall,
        ]}
      >
        {label ?? config.defaultLabel}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  badgeSmall: {
    paddingVertical: 2,
    paddingHorizontal: spacing.xs,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
  labelSmall: {
    fontSize: 10,
  },
});
