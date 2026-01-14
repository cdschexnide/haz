// src/components/ui/DetailCard.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows, typography } from './theme';

export interface DetailField {
  label: string;
  value: string | React.ReactNode;
  accent?: boolean;
}

export type DetailCardStatus = 'default' | 'success' | 'error' | 'warning';

export interface DetailCardProps {
  title?: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
  fields: DetailField[];
  status?: DetailCardStatus;
}

const statusColors: Record<DetailCardStatus, string> = {
  default: colors.border,
  success: colors.success,
  error: colors.error,
  warning: colors.warning,
};

export const DetailCard: React.FC<DetailCardProps> = ({
  title,
  icon,
  fields,
  status = 'default',
}) => {
  return (
    <View style={[styles.card, { borderColor: statusColors[status] }]}>
      {title && (
        <View style={styles.titleRow}>
          {icon && (
            <MaterialIcons name={icon} size={20} color={colors.textSecondary} />
          )}
          <Text style={styles.title}>{title}</Text>
        </View>
      )}
      {fields.map((field, index) => (
        <View
          key={index}
          style={[
            styles.field,
            field.accent && styles.fieldAccent,
            index < fields.length - 1 && styles.fieldBorder,
          ]}
        >
          <Text style={styles.fieldLabel}>{field.label}</Text>
          {typeof field.value === 'string' ? (
            <Text style={styles.fieldValue}>{field.value}</Text>
          ) : (
            field.value
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    padding: spacing.lg,
    ...shadows.light,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  title: {
    ...typography.cardTitle,
    color: colors.textPrimary,
  },
  field: {
    paddingVertical: spacing.sm,
  },
  fieldAccent: {
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    paddingLeft: spacing.md,
  },
  fieldBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  fieldLabel: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  fieldValue: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});
