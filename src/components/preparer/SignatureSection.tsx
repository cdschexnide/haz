// src/components/preparer/SignatureSection.tsx
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import SignatureModal from '@/components/SignatureModal';
import { colors, spacing, borderRadius, typography } from '@/components/ui/theme';

export interface SignatureSectionProps {
  signatureDataUrl?: string;
  onSignatureCapture: (dataUrl: string) => void;
  placeholder?: string;
  label?: string;
}

export const SignatureSection: React.FC<SignatureSectionProps> = ({
  signatureDataUrl,
  onSignatureCapture,
  placeholder = 'Tap to sign',
  label,
}) => {
  const [showModal, setShowModal] = useState(false);

  const handlePress = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleConfirm = (signature: string) => {
    onSignatureCapture(signature);
    setShowModal(false);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        testID="signature-pressable"
        style={styles.pressable}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        {signatureDataUrl ? (
          <View style={styles.signatureContainer}>
            <Image
              testID="signature-image"
              source={{ uri: signatureDataUrl }}
              style={styles.signatureImage}
              resizeMode="contain"
            />
          </View>
        ) : (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>{placeholder}</Text>
          </View>
        )}
      </TouchableOpacity>
      <SignatureModal
        visible={showModal}
        onClose={handleClose}
        onConfirm={handleConfirm}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  pressable: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  signatureContainer: {
    minHeight: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    padding: spacing.sm,
  },
  signatureImage: {
    width: '100%',
    height: 100,
  },
  placeholderContainer: {
    minHeight: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
  },
  placeholderText: {
    ...typography.body,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
});
