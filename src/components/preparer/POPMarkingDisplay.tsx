// src/components/preparer/POPMarkingDisplay.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography } from '@/components/ui';
import { POPMarkingFields } from './POPMarkingForm';

export interface POPMarkingDisplayProps {
  values: POPMarkingFields;
  physicalState: 'solid' | 'liquid';
  variant?: 'compact' | 'full';
}

export const POPMarkingDisplay: React.FC<POPMarkingDisplayProps> = ({
  values,
  physicalState,
  variant = 'full',
}) => {
  const isCompact = variant === 'compact';

  // Format: u/B/C/D/E/F/G/H for solids: u/4G/Y/50/S/24/USA/ABC
  // Format: u/B/C/D/E/F/G/H for liquids: u/1A1/X/1.2/100/24/USA/XYZ
  const topLine = `${values.A} ${values.B}/${values.C}/${values.D}`;
  const bottomLine = physicalState === 'liquid'
    ? `${values.E}/${values.F}`
    : `${values.E}/${values.F}`;
  const countryLine = `${values.G}/${values.H}`;

  return (
    <View
      testID="pop-display-container"
      style={[styles.container, isCompact && styles.containerCompact]}
    >
      <View style={styles.unSymbol}>
        <Text style={styles.unText}>UN</Text>
      </View>
      <View style={styles.markingContent}>
        <Text style={[styles.markingText, isCompact && styles.markingTextCompact]}>
          {topLine}
        </Text>
        <Text style={[styles.markingText, isCompact && styles.markingTextCompact]}>
          {bottomLine}
        </Text>
        <Text style={[styles.markingText, isCompact && styles.markingTextCompact]}>
          {countryLine}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.textPrimary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.md,
  },
  containerCompact: {
    padding: spacing.sm,
    gap: spacing.sm,
  },
  unSymbol: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.textPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unText: {
    ...typography.body,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  markingContent: {
    flex: 1,
  },
  markingText: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
    fontFamily: 'monospace',
  },
  markingTextCompact: {
    fontSize: 12,
  },
});
