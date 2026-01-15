// src/components/ui/ChecklistItem.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from './theme';

export interface ChecklistItemProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  description?: string;
}

export const ChecklistItem: React.FC<ChecklistItemProps> = ({
  label,
  checked,
  onChange,
  disabled = false,
  description,
}) => {
  const handlePress = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  const iconName = checked ? 'check-box' : 'check-box-outline-blank';
  const iconColor = disabled
    ? colors.textSecondary
    : checked
    ? colors.primary
    : colors.textSecondary;

  return (
    <TouchableOpacity
      style={[styles.container, disabled && styles.disabled]}
      onPress={handlePress}
      activeOpacity={disabled ? 1 : 0.7}
      disabled={disabled}
      testID="checklist-item"
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
    >
      <MaterialIcons name={iconName} size={24} color={iconColor} />
      <View style={styles.content}>
        <Text style={[styles.label, disabled && styles.disabledText]}>
          {label}
        </Text>
        {description && (
          <Text style={[styles.description, disabled && styles.disabledText]}>
            {description}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.sm,
  },
  disabled: {
    opacity: 0.6,
  },
  content: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  label: {
    ...typography.body,
    color: colors.textPrimary,
  },
  description: {
    ...typography.caption,
    marginTop: spacing.xs,
  },
  disabledText: {
    color: colors.textSecondary,
  },
});
