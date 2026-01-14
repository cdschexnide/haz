// src/components/preparer/ToolButtonsBar.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '@/components/ui/theme';

export interface ToolButtonConfig {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

export interface ToolButtonsBarProps {
  tools: ToolButtonConfig[];
}

export const ToolButtonsBar: React.FC<ToolButtonsBarProps> = ({ tools }) => {
  return (
    <View style={styles.container}>
      {tools.map((tool, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.toolButton, tool.disabled && styles.toolButtonDisabled]}
          onPress={tool.onPress}
          disabled={tool.disabled}
          activeOpacity={0.7}
        >
          <MaterialIcons
            name={tool.icon}
            size={24}
            color={tool.disabled ? colors.textSecondary : colors.primary}
          />
          <Text
            style={[styles.toolLabel, tool.disabled && styles.toolLabelDisabled]}
            numberOfLines={2}
          >
            {tool.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  toolButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.infoLight,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    minHeight: 80,
  },
  toolButtonDisabled: {
    backgroundColor: colors.borderLight,
  },
  toolLabel: {
    ...typography.caption,
    color: colors.primary,
    textAlign: 'center',
    marginTop: spacing.xs,
    fontWeight: '500',
  },
  toolLabelDisabled: {
    color: colors.textSecondary,
  },
});
