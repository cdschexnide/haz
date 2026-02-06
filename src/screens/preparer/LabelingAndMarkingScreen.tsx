// src/screens/preparer/LabelingAndMarkingScreen.tsx

import React, { useEffect, useState, useCallback } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import {
  ActionFooter,
  DocumentModal,
  colors,
  spacing,
} from '@/components/ui';
import {
  VehicleLabelingNotice,
  StandardLabelingContent,
  UnityPackagePreview,
} from '@/components/preparer';
import { useHazProStore } from '@/stores/useHazProStore';
import { useNavigationRef } from '@/contexts/NavigationRefProvider/useNavigationRef';
import { getContainerDescriptionFromCode } from '@/utils/getContainerDescriptionFromPackagingCode';
import { getDocumentNodes } from '../../../server/documentNodes';
import renderDocumentNodes from '../../../server/renderDocumentNodes/renderDocumentNodes';

export interface LabelingAndMarkingScreenProps {
  navigation: any;
}

export const LabelingAndMarkingScreen: React.FC<LabelingAndMarkingScreenProps> = ({
  navigation,
}) => {
  const {
    state,
    store,
    actions,
    requiredMarkings,
    requiredLabels,
    saveCurrentShipment,
  } = useHazProStore();
  const { navigate } = useNavigationRef();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState('');

  const completedSubsteps = state.hazProPreparerContext.completedSubsteps;
  const isVehicle = state.hazProPreparerContext.hazardousMaterial?.unid === 'UN3166';
  const packageCode = state.hazProPreparerContext.packaging?.inputPOPMarking?.B ?? '';
  const packageType = getContainerDescriptionFromCode(packageCode) ?? '';
  // EQ/LQ logic intentionally disabled for demo purposes.
  const isLimitedQuantity = false;

  // Update required markings and labels when relevant state changes
  useEffect(() => {
    store.hazProPreparerContext.activeStep = 3;
    actions.updateRequiredMarkingsAndLabels();
  }, [
    state.hazProPreparerContext.hazardousMaterial,
    state.hazProPreparerContext.packaging,
    state.hazProPreparerContext.lithiumBatteryData,
    state.hazProPreparerContext.dryIceData,
    state.hazProPreparerContext.technicalName,
    // state.hazProPreparerContext.isLithiumBatteryExceptedQuantity,
    // state.hazProPreparerContext.isLimitedQuantity,
    state.hazProPreparerContext.usesCaaCertification,
    state.hazProPreparerContext.usesCoeCertification,
    state.hazProPreparerContext.lookupFunctionsOutput,
  ]);

  // Extract attachment number from packaging paragraph (e.g., "A5.3.1" -> "5")
  const getAttachmentNumber = (paragraph: string): string => {
    return paragraph.split('.')[0].substring(1);
  };

  // Handle info button press - show packaging regulations modal
  const handleInfoPress = useCallback((id: string) => {
    const packagingParagraph =
      state.hazProPreparerContext.hazardousMaterial?.packagingParagraph;
    if (packagingParagraph) {
      const attachmentNumber = getAttachmentNumber(packagingParagraph);
      const documentNodesList = getDocumentNodes(attachmentNumber);
      const renderedContent = renderDocumentNodes(
        packagingParagraph,
        documentNodesList
      );
      setModalContent(renderedContent);
      setIsModalVisible(true);
    }
  }, [state.hazProPreparerContext.hazardousMaterial?.packagingParagraph]);

  // Navigation handlers
  const handleCancel = useCallback(() => {
    store.hazProPreparerContext.activeStep = 2;
    store.hazProPreparerContext.completedSubsteps = completedSubsteps.slice(0, -1);
    navigation.goBack();
  }, [completedSubsteps, navigation, store.hazProPreparerContext]);

  const handleSaveAndExit = useCallback(() => {
    saveCurrentShipment('in-progress');
    navigate('PreparerHomeStack', { screen: 'PreparerHome' });
  }, [saveCurrentShipment, navigate]);

  const handleSaveAndContinue = useCallback(() => {
    store.hazProPreparerContext.completedSubsteps = [
      ...completedSubsteps,
      'LabelingAndMarking',
    ];
    navigation.navigate('ShippersDeclarationScreen');
  }, [completedSubsteps, navigation, store.hazProPreparerContext]);

  // EQ/LQ routing intentionally disabled for demo purposes.

  const prepareShipmentData = useCallback(() => {
    const shipment = state.hazProPreparerContext.shipment;
    const shipper = state.hazProPreparerContext.shipper;
    const consignee = state.hazProPreparerContext.consignee;

    const shipperAddress = [
      shipper?.address?.shipperStreet,
      shipper?.address?.shipperCity,
      shipper?.address?.shipperState,
      shipper?.address?.shipperZipcode,
    ]
      .filter(Boolean)
      .join(' ')
      .trim();

    const consigneeAddress = [
      consignee?.address?.consigneeStreet,
      consignee?.address?.consigneeCity,
      consignee?.address?.consigneeState,
      consignee?.address?.consigneeZipcode,
    ]
      .filter(Boolean)
      .join(' ')
      .trim();

    return {
      tcn: shipment?.tcn || '',
      fromDodaac: shipment?.tcn?.substring(0, 6) || '',
      fromAddress: shipperAddress,
      poe: shipment?.poe?.substring(0, 3)?.toUpperCase() || '',
      pod: shipment?.pod?.substring(0, 3)?.toUpperCase() || '',
      consigneeDodaac: consignee?.address?.consigneeDodaac || '',
      consigneeAddress,
    };
  }, [
    state.hazProPreparerContext.consignee,
    state.hazProPreparerContext.shipment,
    state.hazProPreparerContext.shipper,
  ]);

  // Common footer buttons for both vehicle and standard shipments
  const footerButtons = [
    {
      label: 'Cancel',
      onPress: handleCancel,
      variant: 'outline' as const,
    },
    {
      label: 'Save & Exit',
      onPress: handleSaveAndExit,
      variant: 'secondary' as const,
    },
    {
      label: 'Save & Continue',
      onPress: handleSaveAndContinue,
      variant: 'primary' as const,
    },
  ];

  // Vehicle shipment - simplified view
  if (isVehicle) {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <VehicleLabelingNotice />
        </ScrollView>
        <ActionFooter buttons={footerButtons} />
      </View>
    );
  }

  // Standard shipment - full labeling and marking content
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <StandardLabelingContent
          requiredLabels={requiredLabels}
          requiredMarkings={requiredMarkings}
          limitedQuantity={isLimitedQuantity}
          onInfoPress={handleInfoPress}
        />
        <UnityPackagePreview
          requiredMarkings={requiredMarkings}
          requiredLabels={requiredLabels}
          packageCode={packageCode}
          packageType={packageType}
          shipmentData={prepareShipmentData()}
        />
      </ScrollView>

      <ActionFooter buttons={footerButtons} />

      <DocumentModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        title="Packaging Information"
        htmlContent={modalContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.lg,
  },
});

export default LabelingAndMarkingScreen;
