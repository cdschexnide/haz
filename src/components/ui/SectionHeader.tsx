// src/components/ui/SectionHeader.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from './theme';

export interface SectionHeaderProps {
  title: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
  count?: { completed: number; total: number };
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  icon,
  count,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {icon && (
          <MaterialIcons name={icon} size={20} color={colors.textSecondary} />
        )}
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    ...typography.cardTitle,
    color: colors.textSecondary,
  },
  countBadge: {
    backgroundColor: colors.surface,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  countText: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});
