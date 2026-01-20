// src/components/ui/GridSelector.tsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography } from './theme';

export interface GridOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
  disabled?: boolean;
}

export interface GridSelectorProps {
  options: GridOption[];
  columns?: 2 | 3;
  banner?: GridOption;
}

export const GridSelector: React.FC<GridSelectorProps> = ({
  options,
  columns = 2,
  banner,
}) => {
  const renderOption = (option: GridOption, isBanner: boolean = false) => {
    const isDisabled = option.disabled ?? false;

    return (
      <TouchableOpacity
        key={option.id}
        testID={`grid-option-${option.id}`}
        style={[
          isBanner ? styles.banner : styles.option,
          isBanner ? {} : { width: `${100 / columns - 1}%` as any },
          isDisabled && styles.optionDisabled,
        ]}
        onPress={option.onPress}
        disabled={isDisabled}
        activeOpacity={isDisabled ? 1 : 0.7}
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled }}
        accessibilityLabel={option.label}
      >
        <View style={styles.iconContainer}>{option.icon}</View>
        <Text style={[styles.label, isDisabled && styles.labelDisabled]}>
          {option.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {banner && renderOption(banner, true)}
      <View style={styles.grid}>
        {options.map(option => renderOption(option))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacing.sm,
  },
  banner: {
    width: '100%',
    height: 100,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.sm,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  grid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'space-between',
  },
  option: {
    aspectRatio: 1,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    marginBottom: spacing.sm,
  },
  optionDisabled: {
    backgroundColor: colors.borderLight,
  },
  iconContainer: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.cardTitle,
    fontSize: 20,
    color: colors.white,
    textAlign: 'center',
    fontWeight: '700',
  },
  labelDisabled: {
    color: colors.textSecondary,
  },
});
