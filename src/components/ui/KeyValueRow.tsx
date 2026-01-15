// src/components/ui/KeyValueRow.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from './theme';

export interface KeyValueRowProps {
  label: string;
  value?: string | React.ReactNode;
  valueStyle?: 'default' | 'bold' | 'accent';
}

export const KeyValueRow: React.FC<KeyValueRowProps> = ({
  label,
  value,
  valueStyle = 'default',
}) => {
  // Return null if value is undefined or empty string
  if (value === undefined || value === '') {
    return null;
  }

  const isAccent = valueStyle === 'accent';
  const isBold = valueStyle === 'bold';

  return (
    <View
      testID="key-value-row"
      style={[styles.container, isAccent && styles.accentContainer]}
    >
      <Text style={styles.label}>{label}</Text>
      {typeof value === 'string' ? (
        <Text style={[styles.value, isBold && styles.valueBold]}>
          {value}
        </Text>
      ) : (
        value
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: spacing.sm,
    flexWrap: 'wrap',
  },
  accentContainer: {
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    paddingLeft: spacing.md,
  },
  label: {
    ...typography.body,
    color: colors.textSecondary,
    flex: 1,
    marginRight: spacing.sm,
  },
  value: {
    ...typography.body,
    fontWeight: '400',
    color: colors.textPrimary,
    flex: 2,
    textAlign: 'right',
  },
  valueBold: {
    fontWeight: '600',
  },
});
