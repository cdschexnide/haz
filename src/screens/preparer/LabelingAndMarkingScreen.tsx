// src/screens/preparer/LabelingAndMarkingScreen.tsx

import React, { useEffect, useState, useCallback } from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import {
  ActionFooter,
  DocumentModal,
  colors,
  spacing,
  borderRadius,
  typography,
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
  const hazMat = state.hazProPreparerContext.hazardousMaterial;
  const isVehicle = hazMat?.unid === 'UN3166';
  const packageCode = state.hazProPreparerContext.packaging?.inputPOPMarking?.B ?? '';
  const packageType = getContainerDescriptionFromCode(packageCode) ?? '';
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
  const handleInfoPress = useCallback(() => {
    const packagingParagraph = hazMat?.packagingParagraph;
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
  }, [hazMat?.packagingParagraph]);

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

  const subtitle = [
    hazMat?.unid,
    hazMat?.properShippingName,
    hazMat?.hazclassDiv ? `Class ${hazMat.hazclassDiv}` : '',
  ]
    .filter(Boolean)
    .join(' \u00B7 ');

  // Vehicle shipment - simplified view (still with 3D preview)
  if (isVehicle) {
    return (
      <View style={styles.container}>
        <View style={styles.columnsContainer}>
          <View style={styles.leftColumn}>
            <ScrollView contentContainerStyle={styles.leftContent}>
              <View style={styles.header}>
                <Text style={styles.headerTitle}>Labeling & Marking Requirements</Text>
                <Text style={styles.headerSubtitle}>{subtitle}</Text>
              </View>
              <VehicleLabelingNotice />
            </ScrollView>
          </View>
          <View style={styles.rightColumn}>
            <UnityPackagePreview
              requiredMarkings={requiredMarkings}
              requiredLabels={requiredLabels}
              packageCode={packageCode}
              packageType={packageType}
              shipmentData={prepareShipmentData()}
            />
            <View style={styles.disclaimerRow}>
              <MaterialIcons name="info-outline" size={20} color={colors.primary} />
              <Text style={styles.disclaimerText}>
                This 3D rendering is for reference only. Label and marking placement on actual packages may differ.
              </Text>
            </View>
          </View>
        </View>
        <ActionFooter buttons={footerButtons} />
      </View>
    );
  }

  // Standard shipment - two-column layout
  return (
    <View style={styles.container}>
      <View style={styles.columnsContainer}>
        <View style={styles.leftColumn}>
          <ScrollView contentContainerStyle={styles.leftContent}>
            <View style={styles.header}>
              <View style={styles.headerTopRow}>
                <Text style={styles.headerTitle}>Labeling & Marking Requirements</Text>
                <TouchableOpacity
                  testID="info-button"
                  style={styles.infoButton}
                  onPress={handleInfoPress}
                  accessibilityLabel="View packaging regulations"
                  accessibilityRole="button"
                >
                  <MaterialIcons name="menu-book" size={20} color={colors.primary} />
                  <Text style={styles.infoButtonText}>Regs</Text>
                </TouchableOpacity>
              </View>
            </View>

            <StandardLabelingContent
              requiredLabels={requiredLabels}
              requiredMarkings={requiredMarkings}
              limitedQuantity={isLimitedQuantity}
            />
          </ScrollView>
        </View>

        <View style={styles.rightColumn}>
          <UnityPackagePreview
            requiredMarkings={requiredMarkings}
            requiredLabels={requiredLabels}
            packageCode={packageCode}
            packageType={packageType}
            shipmentData={prepareShipmentData()}
          />
          <View style={styles.disclaimerRow}>
            <MaterialIcons name="info-outline" size={20} color={colors.primary} />
            <Text style={styles.disclaimerText}>
              This 3D rendering is for reference only. Label and marking placement on actual packages may differ.
            </Text>
          </View>
        </View>
      </View>

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
  columnsContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  leftColumn: {
    flex: 45,
  },
  leftContent: {
    paddingBottom: spacing.lg,
  },
  rightColumn: {
    flex: 55,
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
  },
  header: {
    padding: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.headerTitle,
    color: colors.textPrimary,
    flex: 1,
  },
  headerSubtitle: {
    ...typography.caption,
    marginTop: spacing.xs,
  },
  infoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.infoLight,
  },
  infoButtonText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  disclaimerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
    marginHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.infoLight,
    borderRadius: borderRadius.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  disclaimerText: {
    ...typography.caption,
    color: colors.textPrimary,
    flex: 1,
  },
});

export default LabelingAndMarkingScreen;
