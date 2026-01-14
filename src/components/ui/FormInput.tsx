// src/components/ui/FormInput.tsx
import React, { forwardRef } from 'react';
import {
  TextInput,
  TextInputProps,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { colors, spacing, borderRadius, typography } from './theme';

interface FieldError {
  message?: string;
}

export interface FormInputProps extends TextInputProps {
  error?: FieldError;
  disabled?: boolean;
  inputStyle?: ViewStyle;
}

export const FormInput = forwardRef<TextInput, FormInputProps>(
  ({ error, disabled = false, inputStyle, style, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        style={[
          styles.input,
          error && styles.inputError,
          disabled && styles.inputDisabled,
          inputStyle,
          style,
        ]}
        placeholderTextColor={colors.textSecondary}
        editable={!disabled}
        {...props}
      />
    );
  }
);

FormInput.displayName = 'FormInput';

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    ...typography.body,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
    minHeight: 44,
  },
  inputError: {
    borderColor: colors.error,
  },
  inputDisabled: {
    backgroundColor: colors.borderLight,
    color: colors.textSecondary,
  },
});
