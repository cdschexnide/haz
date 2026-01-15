// src/components/ui/LoadingOverlay.tsx

import React from 'react';
import { View, Text, StyleSheet, Modal, ActivityIndicator } from 'react-native';
import { colors, spacing, typography } from './theme';

export interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible,
  message,
}) => {
  if (!visible) {
    return null;
  }

  return (
    <Modal transparent visible={visible} testID="loading-overlay">
      <View style={styles.overlay}>
        <ActivityIndicator
          size="large"
          color={colors.primary}
          testID="loading-spinner"
        />
        {message && (
          <Text style={styles.message} testID="loading-message">
            {message}
          </Text>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    ...typography.body,
    color: colors.textPrimary,
    marginTop: spacing.lg,
    textAlign: 'center',
  },
});
