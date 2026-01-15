// src/components/preparer/ShipmentContextMenu.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BottomSheet } from '@rneui/themed';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '@/components/ui/theme';

interface SavedShipment {
  id: string;
  status: 'in-progress' | 'completed';
  savedAt: Date;
  hazProPreparerContext: any;
}

export interface ShipmentContextMenuProps {
  visible: boolean;
  shipment: SavedShipment | null;
  onClose: () => void;
  onResume: () => void;
  onViewSDDG: () => void;
}

export const ShipmentContextMenu: React.FC<ShipmentContextMenuProps> = ({
  visible,
  shipment,
  onClose,
  onResume,
  onViewSDDG,
}) => {
  if (!shipment) return null;

  const isCompleted = shipment.status === 'completed';

  return (
    <BottomSheet isVisible={visible} onBackdropPress={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Shipment Options</Text>
        </View>

        {!isCompleted && (
          <TouchableOpacity style={styles.option} onPress={onResume}>
            <MaterialIcons name="play-arrow" size={24} color={colors.primary} />
            <Text style={styles.optionText}>Resume Preparation</Text>
          </TouchableOpacity>
        )}

        {isCompleted && (
          <TouchableOpacity style={styles.option} onPress={onViewSDDG}>
            <MaterialIcons name="description" size={24} color={colors.primary} />
            <Text style={styles.optionText}>View SDDG</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.option, styles.cancelOption]}
          onPress={onClose}
        >
          <MaterialIcons name="close" size={24} color={colors.textSecondary} />
          <Text style={[styles.optionText, styles.cancelText]}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    paddingBottom: spacing.xl,
  },
  header: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    ...typography.headerTitle,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  optionText: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  cancelOption: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: spacing.sm,
    paddingTop: spacing.lg,
  },
  cancelText: {
    color: colors.textSecondary,
  },
});
