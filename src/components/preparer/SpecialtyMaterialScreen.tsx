// src/components/preparer/SpecialtyMaterialScreen.tsx
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import {
  ScreenHeader,
  ActionFooter,
  DetailCard,
  InfoBox,
  colors,
  spacing,
} from '@/components/ui';

export interface MaterialInfo {
  unid: string;
  properShippingName: string;
  hazardClass: string;
  packingGroup?: string;
}

export interface SpecialtyMaterialScreenProps {
  // Header
  title: string;
  onBack: () => void;

  // Material info panel
  material: MaterialInfo;

  // Footer actions
  onCancel: () => void;
  onSaveExit: () => void;
  onContinue: () => void;
  continueDisabled?: boolean;
  continueLabel?: string;

  // Content
  children: React.ReactNode;

  // Optional banners
  infoBanner?: string;
  warningBanner?: string;
}

/**
 * Wrapper component for specialty material screens.
 * Provides consistent header, material info card, scroll area, and 3-button footer.
 */
export const SpecialtyMaterialScreen: React.FC<SpecialtyMaterialScreenProps> = ({
  title,
  onBack,
  material,
  onCancel,
  onSaveExit,
  onContinue,
  continueDisabled = false,
  continueLabel = 'Save & Continue',
  children,
  infoBanner,
  warningBanner,
}) => {
  const materialFields = [
    { label: 'UN/ID', value: material.unid },
    { label: 'Proper Shipping Name', value: material.properShippingName },
    { label: 'Hazard Class', value: material.hazardClass },
    ...(material.packingGroup
      ? [{ label: 'Packing Group', value: material.packingGroup }]
      : []),
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title={title} onBack={onBack} />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <DetailCard title="Material Information" fields={materialFields} />

          {infoBanner && (
            <InfoBox variant="info" message={infoBanner} />
          )}

          {warningBanner && (
            <InfoBox variant="warning" message={warningBanner} />
          )}

          <View testID="specialty-content" style={styles.content}>
            {children}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <ActionFooter
        buttons={[
          { label: 'Cancel', onPress: onCancel, variant: 'ghost' },
          { label: 'Save & Exit', onPress: onSaveExit, variant: 'outline' },
          {
            label: continueLabel,
            onPress: onContinue,
            disabled: continueDisabled,
          },
        ]}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  content: {
    gap: spacing.md,
  },
});

export default SpecialtyMaterialScreen;
