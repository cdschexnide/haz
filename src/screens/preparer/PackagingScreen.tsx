// src/screens/preparer/PackagingScreen.tsx

import React, { useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { GridSelector, colors, spacing } from '@/components/ui';
import { useHazProStore } from '@/stores/useHazProStore';

export interface PackagingScreenProps {
  navigation: any;
}

export const PackagingScreen: React.FC<PackagingScreenProps> = ({ navigation }) => {
  const { state, store } = useHazProStore();
  const completedSubsteps = state.hazProPreparerContext.completedSubsteps;
  const isClass2 = state.hazProPreparerContext.hazardousMaterial?.hazclassDiv?.startsWith('2');

  useEffect(() => {
    store.hazProPreparerContext.activeStep = 2;
  }, []);

  const markStepComplete = useCallback(() => {
    store.hazProPreparerContext.completedSubsteps = [
      ...completedSubsteps,
      'PackagingScreen',
    ];
  }, [completedSubsteps, store.hazProPreparerContext]);

  const initializePOPMarking = useCallback(() => {
    if (store.hazProPreparerContext.packaging && !store.hazProPreparerContext.packaging.inputPOPMarking) {
      store.hazProPreparerContext.packaging.inputPOPMarking = {
        A: null, B: null, C: null, D: null, E: null, F: null, G: null, H: null,
      };
    }
  }, [store.hazProPreparerContext.packaging]);

  const setPackagingFlags = useCallback((usesCylinder: boolean, usesPop: boolean) => {
    if (store.hazProPreparerContext.packaging) {
      store.hazProPreparerContext.packaging.usesDotCylinderMarking = usesCylinder;
      store.hazProPreparerContext.packaging.usesPopMarking = usesPop;
    }
  }, [store.hazProPreparerContext.packaging]);

  const clearSpecialAuthorizationState = useCallback(() => {
    store.hazProPreparerContext.usesCoeCertification = false;
    store.hazProPreparerContext.usesCaaCertification = false;
    store.hazProPreparerContext.usesDotSpPermit = false;
    store.hazProPreparerContext.specialAuthorizationType = null;
    store.hazProPreparerContext.specialAuthorizationReference = null;
    store.hazProPreparerContext.specialAuthorizationAttested = false;
    store.hazProPreparerContext.specialAuthorizationPackingDescription = null;
    store.hazProPreparerContext.specialAuthorizationQuantityAndTypeOfPacking =
      null;
    store.hazProPreparerContext.packingInstruction =
      store.hazProPreparerContext.hazardousMaterial?.packagingParagraph || null;
  }, [store.hazProPreparerContext]);

  const handleScanPOP = useCallback(() => {
    clearSpecialAuthorizationState();
    markStepComplete();
    setPackagingFlags(false, true);
    store.hazProPreparerContext.packagingEntryMethod = 'scan';
    initializePOPMarking();
    navigation.navigate('POPScannerScreen');
  }, [clearSpecialAuthorizationState, markStepComplete, setPackagingFlags, initializePOPMarking, navigation]);

  const handleEnterPOP = useCallback(() => {
    clearSpecialAuthorizationState();
    markStepComplete();
    if (isClass2) {
      setPackagingFlags(true, false);
      navigation.navigate('CylinderEntryScreen');
    } else {
      setPackagingFlags(false, true);
      store.hazProPreparerContext.packagingEntryMethod = 'manual';
      initializePOPMarking();
      navigation.navigate('POPMarkingDataEntry');
    }
  }, [clearSpecialAuthorizationState, markStepComplete, setPackagingFlags, isClass2, initializePOPMarking, navigation]);

  const handleWalkthrough = useCallback(() => {
    clearSpecialAuthorizationState();
    markStepComplete();
    setPackagingFlags(false, true);
    store.hazProPreparerContext.packagingEntryMethod = 'walkthrough';
    store.hazProPreparerContext.packagingWizardStep = 1;
    if (store.hazProPreparerContext.packaging) {
      if (store.hazProPreparerContext.packaging.inputPOPMarking) {
        store.hazProPreparerContext.packaging.inputPOPMarking.B = null;
      }
    }
    if (store.hazProPreparerContext.shipment) {
      store.hazProPreparerContext.shipment.selectedOuterPackaging = null;
    }
    navigation.navigate('PackagingWizardV2');
  }, [clearSpecialAuthorizationState, markStepComplete, setPackagingFlags, navigation]);

  const handleUploadCOE = useCallback(() => {
    clearSpecialAuthorizationState();
    markStepComplete();
    navigation.navigate('CoeAndCaaScreen');
  }, [clearSpecialAuthorizationState, markStepComplete, navigation]);

  const handleUploadDOTSP = useCallback(() => {
    clearSpecialAuthorizationState();
    markStepComplete();
    navigation.navigate('DotSpScreen');
  }, [clearSpecialAuthorizationState, markStepComplete, navigation]);

  const banner = {
    id: 'scan',
    label: 'Scan POP Marking',
    icon: <Ionicons name="scan-outline" size={72} color={isClass2 ? colors.textSecondary : colors.white} />,
    onPress: handleScanPOP,
    disabled: isClass2,
  };

  const options = [
    {
      id: 'enter',
      label: 'Enter POP',
      icon: <MaterialIcons name="edit" size={72} color={colors.white} />,
      onPress: handleEnterPOP,
    },
    {
      id: 'coe',
      label: 'Upload COE/CAA',
      icon: <MaterialCommunityIcons name="certificate-outline" size={72} color={colors.white} />,
      onPress: handleUploadCOE,
    },
    {
      id: 'walkthrough',
      label: 'Walkthrough',
      icon: <MaterialCommunityIcons name="compass-outline" size={72} color={isClass2 ? colors.textSecondary : colors.white} />,
      onPress: handleWalkthrough,
      disabled: isClass2,
    },
    {
      id: 'dotsp',
      label: 'Upload DOT-SP',
      icon: <MaterialCommunityIcons name="file-document-outline" size={72} color={colors.white} />,
      onPress: handleUploadDOTSP,
    },
  ];

  return (
    <View style={styles.container}>
      <GridSelector options={options} banner={banner} columns={2} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: spacing.sm,
  },
});

export default PackagingScreen;
