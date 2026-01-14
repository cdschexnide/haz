// src/components/ui/ActionFooter.tsx

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Button, ButtonVariant } from './Button';
import { colors, spacing } from './theme';

export interface FooterButton {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  icon?: keyof typeof MaterialIcons.glyphMap;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
}

export interface ActionFooterProps {
  buttons: FooterButton[];
  style?: ViewStyle;
}

export const ActionFooter: React.FC<ActionFooterProps> = ({ buttons, style }) => {
  return (
    <View style={[styles.footer, style]}>
      {buttons.map((button, index) => {
        // Default: last button is primary, others are outline
        const defaultVariant: ButtonVariant =
          index === buttons.length - 1 ? 'primary' : 'outline';

        return (
          <Button
            key={index}
            label={button.label}
            onPress={button.onPress}
            variant={button.variant ?? defaultVariant}
            icon={button.icon}
            iconPosition={button.iconPosition}
            loading={button.loading}
            disabled={button.disabled}
            fullWidth
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
