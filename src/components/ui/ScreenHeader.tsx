// src/components/ui/ScreenHeader.tsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from './theme';

export interface ScreenHeaderProps {
  title: string;
  onBack?: () => void;
  onClose?: () => void;
  rightIcon?: keyof typeof MaterialIcons.glyphMap;
  onRightPress?: () => void;
  rightBadgeCount?: number;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  onBack,
  onClose,
  rightIcon,
  onRightPress,
  rightBadgeCount,
}) => {
  const leftAction = onClose || onBack;
  const leftIconName = onClose ? 'close' : 'arrow-back';

  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={leftAction}
        disabled={!leftAction}
      >
        {leftAction && (
          <MaterialIcons name={leftIconName} size={24} color={colors.primary} />
        )}
      </TouchableOpacity>

      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      <TouchableOpacity
        style={styles.iconButton}
        onPress={onRightPress}
        disabled={!onRightPress}
      >
        {rightIcon && (
          <View>
            <MaterialIcons name={rightIcon} size={24} color={colors.primary} />
            {rightBadgeCount !== undefined && rightBadgeCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {rightBadgeCount > 99 ? '99+' : rightBadgeCount}
                </Text>
              </View>
            )}
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.headerTitle,
    flex: 1,
    textAlign: 'center',
    color: colors.textPrimary,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -10,
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
});
