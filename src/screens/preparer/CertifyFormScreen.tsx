// src/screens/preparer/CertifyFormScreen.tsx

import React, { useEffect, useState, useCallback } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';

import {
  ActionFooter,
  LoadingOverlay,
  SectionHeader,
  colors,
  spacing,
  typography,
} from '@/components/ui';
import { CertificationInfoCard } from '@/components/preparer/CertificationInfoCard';
import { SignatureSection } from '@/components/preparer/SignatureSection';
import DatabaseErrorDisplay from '@/components/DatabaseErrorDisplay';
import { useNavigationRef } from '@/contexts/NavigationRefProvider/useNavigationRef';
import { useHazProStore } from '@/stores/useHazProStore';

export interface CertifyFormScreenProps {
  navigation: any;
}

/**
 * CertifyFormScreen - Screen for certifying hazmat shipments.
 * Displays signatory information, allows signature capture,
 * and provides options to save/exit or certify the shipment.
 */
export const CertifyFormScreen: React.FC<CertifyFormScreenProps> = ({
  navigation,
}) => {
  const { state, store, actions, isLoading, error } = useHazProStore();
  const { navigate } = useNavigationRef();

  const preparer = state.hazProPreparerContext.preparer;
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(
    preparer?.signature || null
  );

  // Set active step on mount
  useEffect(() => {
    store.hazProPreparerContext.activeStep = 5;
  }, [store.hazProPreparerContext]);

  // Retry handler for save errors
  const retryLastSaveOperation = useCallback(async () => {
    try {
      await actions.saveCurrentShipment('in-progress');
    } catch (err) {
      console.log('Retry failed:', err);
    }
  }, [actions]);

  // Handle signature capture
  const handleSignatureCapture = useCallback(
    (signature: string) => {
      setSignatureDataUrl(signature);
      if (store.hazProPreparerContext.preparer) {
        store.hazProPreparerContext.preparer.signature = signature;
      }
    },
    [store.hazProPreparerContext]
  );

  // Navigation handlers
  const handleCancel = useCallback(() => {
    store.hazProPreparerContext.activeStep = 4;
    navigation.goBack();
  }, [navigation, store.hazProPreparerContext]);

  const handleSaveAndExit = useCallback(async () => {
    try {
      await actions.saveCurrentShipment('in-progress');
      navigate('PreparerHomeStack', { screen: 'PreparerHome' });
    } catch (err) {
      console.log('Save failed, but error is handled by store:', err);
    }
  }, [actions, navigate]);

  const handleCertify = useCallback(async () => {
    try {
      await actions.saveCurrentShipment('completed');
      navigate('PreparerHomeStack', { screen: 'PreparerHome' });
    } catch (err) {
      console.log('Certification failed, but error is handled by store:', err);
    }
  }, [actions, navigate]);

  // Footer button configuration
  const footerButtons = [
    { label: 'Cancel', onPress: handleCancel, variant: 'outline' as const },
    {
      label: isLoading ? 'Saving...' : 'Save & Exit',
      onPress: handleSaveAndExit,
      variant: 'secondary' as const,
      disabled: isLoading,
      loading: isLoading,
    },
    {
      label: isLoading ? 'Certifying...' : 'Certify',
      onPress: handleCertify,
      variant: 'primary' as const,
      disabled: !signatureDataUrl || isLoading,
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.pageTitle}>Certify Shipment</Text>

        {error && (
          <View style={styles.errorContainer}>
            <DatabaseErrorDisplay
              error={error}
              service="HazProPreparerProvider"
              operation="saveShipment"
              onRetry={retryLastSaveOperation}
              showTechnicalDetails={false}
            />
          </View>
        )}

        <View style={styles.section}>
          <CertificationInfoCard
            preparerName={preparer?.preparerName ?? ''}
            preparerRank={preparer?.preparerRank ?? undefined}
            preparerTitle={preparer?.preparerTitle ?? ''}
            certificationPlace={preparer?.certificationPlace ?? ''}
          />
        </View>

        <View style={styles.section}>
          <SectionHeader title="Signature" />
          <SignatureSection
            signatureDataUrl={signatureDataUrl ?? undefined}
            onSignatureCapture={handleSignatureCapture}
            placeholder="Tap to sign"
          />
        </View>
      </ScrollView>

      <ActionFooter buttons={footerButtons} />
      <LoadingOverlay visible={isLoading} message="Processing..." />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  scrollView: { flex: 1 },
  scrollContent: { padding: spacing.lg, paddingBottom: spacing.xxl },
  pageTitle: {
    ...typography.headerTitle,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: spacing.xl,
    textAlign: 'center',
    color: colors.textPrimary,
  },
  errorContainer: { marginBottom: spacing.lg },
  section: { marginBottom: spacing.lg },
});

export default CertifyFormScreen;
