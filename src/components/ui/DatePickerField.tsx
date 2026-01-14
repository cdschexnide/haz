// src/components/ui/DatePickerField.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from './theme';

interface FieldError {
  message?: string;
}

export interface DatePickerFieldProps {
  label: string;
  value: Date | null;
  onChange: (date: Date) => void;
  required?: boolean;
  error?: FieldError;
}

export const DatePickerField: React.FC<DatePickerFieldProps> = ({
  label,
  value,
  onChange,
  required = false,
  error,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
  };

  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    if (event.type === 'set' && selectedDate) {
      onChange(selectedDate);
      if (Platform.OS === 'ios') {
        setShowPicker(false);
      }
    } else if (event.type === 'dismissed') {
      setShowPicker(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {required && <Text style={styles.required}>*</Text>}
      </View>
      <TouchableOpacity
        style={[styles.button, error && styles.buttonError]}
        onPress={() => setShowPicker(true)}
        activeOpacity={0.7}
      >
        <Text style={[styles.buttonText, !value && styles.placeholder]}>
          {value ? formatDate(value) : 'Select a date'}
        </Text>
        <MaterialIcons name="calendar-today" size={20} color={colors.textSecondary} />
      </TouchableOpacity>
      {error?.message && <Text style={styles.errorText}>{error.message}</Text>}
      {showPicker && (
        <DateTimePicker
          value={value || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleChange}
        />
      )}
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
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    minHeight: 44,
  },
  buttonError: {
    borderColor: colors.error,
  },
  buttonText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  placeholder: {
    color: colors.textSecondary,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
    marginTop: spacing.xs,
  },
});
