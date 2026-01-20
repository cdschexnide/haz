// src/components/preparer/PackagingCodeCard.tsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '@/components/ui';

export interface PackagingCodeCardProps {
  code: string;
  description: string;
  restrictions?: string[];
  selected?: boolean;
  onPress?: () => void;
}

export const PackagingCodeCard: React.FC<PackagingCodeCardProps> = ({
  code,
  description,
  restrictions = [],
  selected = false,
  onPress,
}) => {
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      testID="packaging-code-card"
      style={[styles.container, selected && styles.containerSelected]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole={onPress ? 'button' : 'none'}
    >
      <View style={styles.header}>
        <Text style={styles.code}>{code}</Text>
        {selected && (
          <MaterialIcons name="check-circle" size={24} color={colors.success} />
        )}
      </View>
      <Text style={styles.description}>{description}</Text>
      {restrictions.length > 0 && (
        <View style={styles.restrictions}>
          {restrictions.map((restriction, index) => (
            <View key={index} style={styles.restrictionItem}>
              <MaterialIcons name="info" size={14} color={colors.warning} />
              <Text style={styles.restrictionText}>{restriction}</Text>
            </View>
          ))}
        </View>
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
  },
  containerSelected: {
    borderColor: colors.primary,
    borderWidth: 2,
    backgroundColor: colors.infoLight,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  code: {
    ...typography.headerTitle,
    color: colors.primary,
  },
  description: {
    ...typography.body,
    color: colors.textPrimary,
  },
  restrictions: {
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  restrictionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  restrictionText: {
    ...typography.caption,
    color: colors.warning,
    flex: 1,
  },
});
