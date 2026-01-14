// src/components/ui/ValidationCard.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBadge, BadgeStatus } from './StatusBadge';
import { colors, spacing, borderRadius, shadows, typography } from './theme';

export type ValidationStatus = 'pending' | 'validated' | 'frustrated';
export type MatchStatus = 'matched' | 'unmatched';

export interface ValidationCardProps {
  label: string;
  expectedValues: string[];
  validationStatus: ValidationStatus;
  matchStatus?: MatchStatus;
  confidence?: number;
  afmanReference?: string;
  onValidate: () => void;
  onFrustrate: () => void;
  disabled?: boolean;
}

export const ValidationCard: React.FC<ValidationCardProps> = ({
  label,
  expectedValues,
  validationStatus,
  matchStatus,
  confidence,
  afmanReference,
  onValidate,
  onFrustrate,
  disabled = false,
}) => {
  const getBorderColor = (): string => {
    if (validationStatus === 'validated') return colors.success;
    if (validationStatus === 'frustrated') return colors.error;
    if (matchStatus === 'unmatched') return colors.warning;
    return colors.border;
  };

  const getBackgroundColor = (): string => {
    if (validationStatus === 'validated') return colors.successLight;
    if (validationStatus === 'frustrated') return colors.errorLight;
    if (matchStatus === 'unmatched') return colors.warningLight;
    return colors.surface;
  };

  const getBadgeStatus = (): BadgeStatus => {
    if (validationStatus === 'validated') return 'verified';
    if (validationStatus === 'frustrated') return 'frustrated';
    if (matchStatus === 'matched') return 'detected';
    if (matchStatus === 'unmatched') return 'not-detected';
    return 'pending';
  };

  return (
    <View
      style={[
        styles.card,
        {
          borderLeftColor: getBorderColor(),
          backgroundColor: getBackgroundColor(),
        },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <StatusBadge status={getBadgeStatus()} />
      </View>

      {/* Expected Values */}
      <View style={styles.expectedContainer}>
        {expectedValues.map((value, index) => (
          <View key={index} style={styles.chip}>
            <Text style={styles.chipText}>{value}</Text>
          </View>
        ))}
      </View>

      {/* Confidence & Reference */}
      {(confidence !== undefined || afmanReference) && (
        <View style={styles.metaRow}>
          {confidence !== undefined && (
            <Text style={styles.metaText}>
              Confidence: {Math.round(confidence * 100)}%
            </Text>
          )}
          {afmanReference && (
            <Text style={styles.metaText}>{afmanReference}</Text>
          )}
        </View>
      )}

      {/* Actions */}
      {validationStatus === 'pending' && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.validateButton]}
            onPress={onValidate}
            disabled={disabled}
            activeOpacity={0.7}
          >
            <MaterialIcons name="check" size={24} color={colors.success} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.frustrateButton]}
            onPress={onFrustrate}
            disabled={disabled}
            activeOpacity={0.7}
          >
            <MaterialIcons name="close" size={24} color={colors.error} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderLeftWidth: 4,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.light,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  label: {
    ...typography.cardTitle,
    flex: 1,
    marginRight: spacing.sm,
    color: colors.textPrimary,
  },
  expectedContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  chip: {
    backgroundColor: colors.background,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  chipText: {
    ...typography.caption,
    color: colors.textPrimary,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  metaText: {
    ...typography.caption,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  validateButton: {
    borderColor: colors.success,
    backgroundColor: colors.successLight,
  },
  frustrateButton: {
    borderColor: colors.error,
    backgroundColor: colors.errorLight,
  },
});
