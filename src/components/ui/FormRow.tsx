// src/components/ui/FormRow.tsx
import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { spacing } from './theme';

export interface FormRowProps {
  children: ReactNode;
  lastRow?: boolean;
  style?: ViewStyle;
}

export const FormRow: React.FC<FormRowProps> = ({
  children,
  lastRow = false,
  style,
}) => {
  return (
    <View style={[styles.row, lastRow && styles.lastRow, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  lastRow: {
    marginBottom: 0,
  },
});
