// src/components/ui/FormField.tsx
import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, typography } from './theme';

interface FieldError {
  message?: string;
}

export interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: FieldError;
  children: ReactNode;
  flex?: number;
  style?: ViewStyle;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  required = false,
  error,
  children,
  flex,
  style,
}) => {
  return (
    <View style={[styles.container, flex !== undefined && { flex }, style]}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {required && <Text style={styles.required}>*</Text>}
      </View>
      {children}
      {error?.message && <Text style={styles.errorText}>{error.message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  labelRow: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  label: {
    ...typography.body,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  required: {
    color: colors.error,
    marginLeft: spacing.xs,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
    marginTop: spacing.xs,
  },
});
