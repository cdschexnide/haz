// src/components/ui/SelectableCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing } from './theme';

export interface SelectableCardProps {
  title: string;
  subtitle: string;
  selected: boolean;
  disabled?: boolean;
  disabledReason?: string;
  onPress: () => void;
}

export const SelectableCard: React.FC<SelectableCardProps> = ({
  title,
  subtitle,
  selected,
  disabled = false,
  disabledReason,
  onPress,
}) => {
  const cardStyle = [
    styles.card,
    selected && !disabled && styles.cardSelected,
    disabled && styles.cardDisabled,
  ];

  const titleStyle = [
    styles.title,
    disabled && styles.titleDisabled,
  ];

  const subtitleStyle = [
    styles.subtitle,
    disabled && styles.subtitleDisabled,
  ];

  return (
    <TouchableOpacity
      style={cardStyle}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View style={styles.radioContainer}>
        <View style={[
          styles.radioOuter,
          selected && !disabled && styles.radioOuterSelected,
          disabled && styles.radioOuterDisabled,
        ]}>
          {selected && !disabled && <View style={styles.radioInner} />}
        </View>
      </View>
      <View style={styles.content}>
        <Text style={titleStyle}>{title}</Text>
        <Text style={subtitleStyle}>{subtitle}</Text>
        {disabled && disabledReason && (
          <Text style={styles.disabledReason}>{disabledReason}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  cardDisabled: {
    backgroundColor: colors.backgroundSecondary,
  },
  radioContainer: {
    marginRight: spacing.md,
    paddingTop: 2,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: colors.primary,
  },
  radioOuterDisabled: {
    borderColor: colors.textSecondary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  titleDisabled: {
    color: colors.textSecondary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  subtitleDisabled: {
    color: colors.textSecondary,
  },
  disabledReason: {
    fontSize: 14,
    color: colors.error,
    marginTop: spacing.xs,
  },
});
