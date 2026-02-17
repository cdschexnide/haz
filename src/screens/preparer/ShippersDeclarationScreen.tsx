// src/screens/preparer/ShippersDeclarationScreen.tsx

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import QRCode from 'qrcode';

import {
  ActionFooter,
  InfoBox,
  LoadingOverlay,
  colors,
  spacing,
} from '@/components/ui';
import ShippersDeclarationForm from '@/components/ShippersDeclarationForm';
import { useHazProStore } from '@/stores/useHazProStore';
import { useNavigationRef } from '@/contexts/NavigationRefProvider/useNavigationRef';
import { getHazardousMaterialPhysicalStateByHazardClass } from '@/utils/getHazardousMaterialPhysicalState';
import { appendInhalationHazardIfNeeded } from '@/utils/specialProvisionsHelpers';
import { getSddgQuantityAndTypeOfPacking } from '@/utils/getSddgQuantityAndTypeOfPacking';
import {
  generateSDDGDocumentHtml,
  convertHtmlToPdf,
  mergeSDDGWithAttachments,
  type SDDGFormData,
} from '@/utils/sddgPdfGenerator';
import { getAfmanHandlingInstructions } from '@/data/afmanHandlingInstructions';

// Emergency contact numbers
const EMERGENCY_NUMBERS = {
  class1Collect: '+1(703)-695-4695/4696',
  class1Dsn: '312-225-4695/4696',
  nonClass1Domestic: '1-800-851-8061',
  nonClass1International: '+1-804-279-3131',
} as const;

export interface ShippersDeclarationScreenProps {
  navigation: any;
}

/**
 * Extracts SDDG form data from the HazPro store state.
 * This prepares all the data needed for PDF generation.
 */
const useSDDGFormData = () => {
  const { state } = useHazProStore();
  const ctx = state.hazProPreparerContext;

  // Calculate emergency phone numbers based on hazard class
  const isClass1 = ctx.hazardousMaterial?.hazclassDiv?.startsWith('1');
  const emergencyPhoneNumber1 = isClass1
    ? EMERGENCY_NUMBERS.class1Collect
    : EMERGENCY_NUMBERS.nonClass1Domestic;
  const emergencyPhoneNumber2 = isClass1
    ? EMERGENCY_NUMBERS.class1Dsn
    : EMERGENCY_NUMBERS.nonClass1International;

  // Build additional info HTML for the PDF
  const buildAdditionalInfoHtml = useCallback((): string => {
    let html = '';

    if (ctx.isGrandfatheredExplosive) {
      html += `<p class="info-line">Government-owned goods packaged before 1 January 1990.</p>`;
    }

    if (ctx.hazardousMaterial?.unid === 'UN3166') {
      // Vehicle fuel details
      html += `<p class="info-line">${ctx.un3166Details.fuel?.properShippingName}, ${ctx.un3166Details.fuel?.hazclassDiv}, ${ctx.un3166Details.amount} ${ctx.un3166Details.unit.toUpperCase()}</p>`;

      // Accessorial hazards
      if (ctx.un3166Details.accessorialHazards.batteries) {
        const batteries = ctx.un3166Details.accessorialHazards.batteries;
        html += `<p class="info-line">${batteries.quantity} x ${batteries.accessorialHazardousMaterialIdentification?.properShippingName.toUpperCase()}, ${batteries.accessorialHazardousMaterialIdentification?.hazclassDiv}</p>`;
      }

      if (ctx.un3166Details.accessorialHazards.fireExtinguishers) {
        const extinguishers = ctx.un3166Details.accessorialHazards.fireExtinguishers;
        html += `<p class="info-line">${extinguishers.quantity} x ${extinguishers.accessorialHazardousMaterialIdentification?.properShippingName.toUpperCase()}, ${extinguishers.accessorialHazardousMaterialIdentification?.hazclassDiv}</p>`;
      }

      if (ctx.un3166Details.accessorialHazards.starterFluid) {
        const fluid = ctx.un3166Details.accessorialHazards.starterFluid;
        html += `<p class="info-line">${fluid.accessorialHazardousMaterialIdentification?.properShippingName.toUpperCase()}, ${fluid.accessorialHazardousMaterialIdentification?.hazclassDiv}, 1 x ${fluid.volume.liters} LITERS</p>`;
      }

      if (ctx.un3166Details.accessorialHazards.other?.length) {
        html += `<p class="info-line">AVIATION REGULATED LIQUID, N.O.S., 9, 5 x 1 LITER</p>`;
      }
    } else {
      // Non-vehicle hazardous materials
      const hazmat = ctx.hazardousMaterial;
      const stateChar = hazmat?.hazclassDiv?.[0];
      const physicalState = getHazardousMaterialPhysicalStateByHazardClass(stateChar || '');

      if (physicalState === 'SOLID') {
        if (ctx.isGrandfatheredExplosive) {
          html += `<p class="info-line">${hazmat?.properShippingName?.toUpperCase()}, ${hazmat?.hazclassDiv}, ${ctx.shipment?.totalNetExplosiveWeight} KG</p>`;
        } else {
          html += `<p class="info-line">${hazmat?.properShippingName?.toUpperCase()}, ${hazmat?.hazclassDiv}, ${ctx.packaging?.totalNetMass?.kg} KG</p>`;
        }
      } else if (physicalState === 'LIQUID' || physicalState === 'GAS') {
        html += `<p class="info-line">${hazmat?.properShippingName?.toUpperCase()}, ${hazmat?.hazclassDiv}, ${ctx.packaging?.totalNetVolume?.liters} LITERS</p>`;
      }
    }

    const afmanHandlingInstructions = getAfmanHandlingInstructions({
      packagingParagraph: ctx.hazardousMaterial?.packagingParagraph,
      unid: ctx.hazardousMaterial?.unid,
    });

    afmanHandlingInstructions.forEach(instruction => {
      html += `<p class="info-line">${instruction}</p>`;
    });

    return html;
  }, [ctx]);

  const quantityAndTypeOfPacking = useMemo(
    () => getSddgQuantityAndTypeOfPacking(ctx),
    [ctx]
  );

  const specialAuthorizationType = useMemo(() => {
    if (ctx.specialAuthorizationAttested && ctx.specialAuthorizationType) {
      return ctx.specialAuthorizationType;
    }
    if (ctx.usesDotSpPermit) {
      return 'DOT-SP';
    }
    if (ctx.usesCoeCertification) {
      return 'COE';
    }
    if (ctx.usesCaaCertification) {
      return 'CAA';
    }
    return null;
  }, [
    ctx.specialAuthorizationAttested,
    ctx.specialAuthorizationType,
    ctx.usesDotSpPermit,
    ctx.usesCoeCertification,
    ctx.usesCaaCertification,
  ]);

  const specialAuthorizationReference = useMemo(() => {
    if (ctx.specialAuthorizationReference) {
      return ctx.specialAuthorizationReference;
    }

    if (specialAuthorizationType === 'COE') {
      return (
        ctx.coeAndCaaDocuments?.coeDocuments?.[
          (ctx.coeAndCaaDocuments?.coeDocuments?.length || 1) - 1
        ]?.name ?? ''
      );
    }
    if (specialAuthorizationType === 'CAA') {
      return (
        ctx.coeAndCaaDocuments?.caaDocuments?.[
          (ctx.coeAndCaaDocuments?.caaDocuments?.length || 1) - 1
        ]?.name ?? ''
      );
    }
    if (specialAuthorizationType === 'DOT-SP') {
      return (
        ctx.dotSpWaivers?.[(ctx.dotSpWaivers?.length || 1) - 1]?.waiverNumber ??
        ''
      );
    }

    return '';
  }, [
    ctx.specialAuthorizationReference,
    ctx.coeAndCaaDocuments,
    ctx.dotSpWaivers,
    specialAuthorizationType,
  ]);

  // Calculate packing instruction
  const packingInstruction = useMemo(() => {
    if (specialAuthorizationType) {
      return (
        specialAuthorizationReference ||
        ctx.packingInstruction ||
        ctx.hazardousMaterial?.packagingParagraph ||
        ''
      );
    }
    return ctx.packingInstruction || ctx.hazardousMaterial?.packagingParagraph || '';
  }, [
    specialAuthorizationType,
    specialAuthorizationReference,
    ctx.packingInstruction,
    ctx.hazardousMaterial?.packagingParagraph,
  ]);

  // Calculate authorization
  const authorization = useMemo(() => {
    if (specialAuthorizationType) {
      return specialAuthorizationType;
    }
    return 'AFMAN24-604';
  }, [
    specialAuthorizationType,
  ]);

  // Determine if cargo aircraft only
  const isCargoAircraftOnly = useMemo(() => {
    const specialProvisions = ctx.hazardousMaterial?.specialProvision ?? '';
    return ['P1', 'P2', 'P3', 'P4'].some((p) => specialProvisions.includes(p));
  }, [ctx.hazardousMaterial?.specialProvision]);

  // Prepare shipping name with inhalation hazard suffix if needed
  const shippingName = appendInhalationHazardIfNeeded(
    ctx.hazardousMaterial?.properShippingName,
    ctx.specialProvisionsMap
  );

  // Calculate shipment type
  const shipmentType = ctx.hazardousMaterial?.hazclassDiv?.startsWith('7')
    ? 'RADIOACTIVE'
    : 'NON-RADIOACTIVE';

  return {
    // Shipper info
    shipperName: ctx.shipper?.address.shipperLocation,
    shipperStreet: ctx.shipper?.address.shipperStreet ?? '',
    shipperCity: ctx.shipper?.address.shipperCity ?? '',
    shipperState: ctx.shipper?.address.shipperState ?? '',
    shipperZipcode: ctx.shipper?.address.shipperZipcode ?? '',
    shipperPhoneNumber: ctx.shipper?.phoneNumber?.number ?? '',

    // Consignee info
    consigneeDodaac: ctx.consignee?.address?.consigneeDodaac ?? '',
    consigneeStreet: ctx.consignee?.address?.consigneeStreet ?? '',
    consigneeCity: ctx.consignee?.address?.consigneeCity ?? '',
    consigneeCountry: ctx.consignee?.address?.selectedConsigneeCountry ?? '',

    // Shipment info
    referenceNumber: ctx.shipment?.tcn ?? '',
    airportOfDeparture: ctx.shipment?.poe ?? '',
    airportOfDestination: ctx.shipment?.pod ?? '',
    shipmentType: shipmentType as 'RADIOACTIVE' | 'NON-RADIOACTIVE',

    // Hazmat info
    unid: ctx.hazardousMaterial?.unid ?? '',
    shippingName: shippingName ?? '',
    classDiv: ctx.hazardousMaterial?.hazclassDiv ?? '',
    packingGroup: ctx.hazardousMaterial?.packingGroup ?? '',
    quantityAndTypeOfPacking,
    packingInstruction,
    authorization,

    // Signatory info
    signatoryName: ctx.preparer?.preparerName ?? '',
    signatoryTitle: ctx.preparer?.preparerTitle ?? '',
    location: ctx.preparer?.certificationPlace ?? '',
    date: ctx.preparer?.certificationDate ?? '',

    // Transport and additional info
    isCargoAircraftOnly,
    emergencyPhoneNumber1,
    emergencyPhoneNumber2,
    additionalInfoHtml: buildAdditionalInfoHtml(),
  } as SDDGFormData;
};

/**
 * ShippersDeclarationScreen - Main screen for viewing and sharing SDDG forms.
 *
 * This screen displays the Shipper's Declaration for Dangerous Goods (SDDG) form
 * and provides functionality to generate and share the form as a PDF, optionally
 * including COE/CAA attachment documents.
 */
export const ShippersDeclarationScreen: React.FC<ShippersDeclarationScreenProps> = ({
  navigation,
}) => {
  const { state, store, saveCurrentShipment } = useHazProStore();
  const { navigate } = useNavigationRef();

  const formRef = useRef<View>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const completedSubsteps = state.hazProPreparerContext.completedSubsteps;
  const isExceptedQuantity = state.hazProPreparerContext.isExceptedQuantity;
  const isLimitedQuantity = state.hazProPreparerContext.isLimitedQuantity;

  // Extract SDDG form data from store
  const formData = useSDDGFormData();

  // Set active step on mount
  useEffect(() => {
    store.hazProPreparerContext.activeStep = 4;
  }, [store.hazProPreparerContext]);

  // Prepare form props for the visual form component
  const shipperAddress = useMemo(() => {
    return `${formData.shipperStreet} ${formData.shipperCity}, ${formData.shipperState} ${formData.shipperZipcode}`;
  }, [formData]);

  /**
   * Generates QR code data URL for the reference number.
   */
  const generateQRCode = async (referenceNumber: string): Promise<string> => {
    if (!referenceNumber) return '';
    try {
      return await QRCode.toDataURL(referenceNumber, {
        width: 85,
        margin: 1,
        color: { dark: '#000000', light: '#ffffff' },
      });
    } catch (error) {
      console.warn('QR PNG generation failed, falling back to SVG:', error);
      try {
        const svg = await QRCode.toString(referenceNumber, {
          type: 'svg',
          margin: 1,
          color: { dark: '#000000', light: '#ffffff' },
        });
        return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
      } catch (svgError) {
        console.error('QR code generation failed:', svgError);
        return '';
      }
    }
  };

  /**
   * Writes a base64 PDF document to a temporary file.
   */
  const writeAttachmentToPdf = async (base64Data: string, index: number): Promise<string | null> => {
    try {
      let cleanBase64 = base64Data;
      if (base64Data.startsWith('data:')) {
        cleanBase64 = base64Data.split(',')[1];
      }

      const tempPath = `${FileSystem.cacheDirectory}attachment_${index}_${Date.now()}.pdf`;
      await FileSystem.writeAsStringAsync(tempPath, cleanBase64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      return tempPath;
    } catch (error) {
      console.error(`Error writing attachment ${index}:`, error);
      return null;
    }
  };

  /**
   * Generates and shares the SDDG PDF, optionally including authorization attachments.
   */
  const generateAndSharePdf = useCallback(async () => {
    try {
      setIsGeneratingPdf(true);
      console.log('== Starting PDF generation process ==');

      // Generate QR code
      const qrCodeDataUrl = await generateQRCode(formData.referenceNumber);

      // Generate SDDG HTML and convert to PDF
      const html = generateSDDGDocumentHtml(formData, qrCodeDataUrl);
      const sddgPdfUri = await convertHtmlToPdf(html);
      console.log('Created SDDG PDF at:', sddgPdfUri);

      // Resolve available authorization documents
      const coeAndCaaDocuments = state.hazProPreparerContext.coeAndCaaDocuments ?? {
        coeDocuments: [],
        caaDocuments: [],
      };
      const coeDocuments = coeAndCaaDocuments.coeDocuments ?? [];
      const caaDocuments = coeAndCaaDocuments.caaDocuments ?? [];
      const dotSpDocuments = state.hazProPreparerContext.dotSpWaivers ?? [];

      const specialAuthorizationType =
        (state.hazProPreparerContext.specialAuthorizationAttested
          ? state.hazProPreparerContext.specialAuthorizationType
          : null) ??
        (state.hazProPreparerContext.usesDotSpPermit
          ? 'DOT-SP'
          : state.hazProPreparerContext.usesCoeCertification
          ? 'COE'
          : state.hazProPreparerContext.usesCaaCertification
          ? 'CAA'
          : null);

      let documentsToMerge: ReadonlyArray<{ base64Data: string }> = [];
      let docType = '';

      if (specialAuthorizationType === 'COE') {
        documentsToMerge = coeDocuments;
        docType = 'COE';
      } else if (specialAuthorizationType === 'CAA') {
        documentsToMerge = caaDocuments;
        docType = 'CAA';
      } else if (specialAuthorizationType === 'DOT-SP') {
        documentsToMerge = dotSpDocuments;
        docType = 'DOT-SP';
      } else if (coeDocuments.length > 0) {
        documentsToMerge = coeDocuments;
        docType = 'COE';
      } else if (caaDocuments.length > 0) {
        documentsToMerge = caaDocuments;
        docType = 'CAA';
      } else if (dotSpDocuments.length > 0) {
        documentsToMerge = dotSpDocuments;
        docType = 'DOT-SP';
      }

      console.log(
        `Found ${coeDocuments.length} COE docs, ${caaDocuments.length} CAA docs, and ${dotSpDocuments.length} DOT-SP docs`
      );

      const hasDocuments = documentsToMerge.length > 0;

      // If no attachments, just share the SDDG
      if (!hasDocuments) {
        console.log('No additional documents, sharing only SDDG');
        await Sharing.shareAsync(sddgPdfUri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Share SDDG',
        });
        // Delay cleanup so target apps (Outlook, Teams) can finish uploading
        setTimeout(() => {
          FileSystem.deleteAsync(sddgPdfUri, { idempotent: true });
        }, 60000);
        return;
      }

      console.log(`Using ${documentsToMerge.length} ${docType} documents to merge`);

      // Write attachment PDFs to temporary files
      const attachmentUris: string[] = [];
      for (let i = 0; i < documentsToMerge.length; i++) {
        const doc = documentsToMerge[i];
        if (doc.base64Data && doc.base64Data.trim() !== '') {
          const attachmentUri = await writeAttachmentToPdf(doc.base64Data, i);
          if (attachmentUri) {
            attachmentUris.push(attachmentUri);
          }
        }
      }

      // Merge PDFs if we have attachments
      if (attachmentUris.length > 0) {
        try {
          const mergedPdfUri = await mergeSDDGWithAttachments(sddgPdfUri, attachmentUris);
          console.log(`Created merged PDF at: ${mergedPdfUri}`);

          // Share the merged PDF
          await Sharing.shareAsync(mergedPdfUri, {
            mimeType: 'application/pdf',
            dialogTitle: `SDDG with ${docType}`,
            UTI: 'com.adobe.pdf',
          });

          // Delay cleanup so target apps (Outlook, Teams) can finish uploading
          setTimeout(() => {
            FileSystem.deleteAsync(sddgPdfUri, { idempotent: true });
            for (const uri of attachmentUris) {
              FileSystem.deleteAsync(uri, { idempotent: true });
            }
            FileSystem.deleteAsync(mergedPdfUri, { idempotent: true });
          }, 60000);

          console.log('PDF generation and sharing completed');
          return;
        } catch (mergeError) {
          console.error('Error merging PDFs:', mergeError);
          // Cleanup attachment URIs on error
          for (const uri of attachmentUris) {
            await FileSystem.deleteAsync(uri, { idempotent: true });
          }
        }
      }

      // Fallback: Share SDDG only if merge fails
      Alert.alert(
        'Warning',
        'Unable to include attachments. Sharing only the SDDG form.',
        [{ text: 'OK' }]
      );
      await Sharing.shareAsync(sddgPdfUri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Share SDDG',
      });
      // Delay cleanup so target apps (Outlook, Teams) can finish uploading
      setTimeout(() => {
        FileSystem.deleteAsync(sddgPdfUri, { idempotent: true });
      }, 60000);
    } catch (error) {
      console.error('Error generating or sharing PDF:', error);
      Alert.alert('Error', 'Failed to generate or share PDF');
    } finally {
      setIsGeneratingPdf(false);
    }
  }, [
    formData,
    state.hazProPreparerContext.coeAndCaaDocuments,
    state.hazProPreparerContext.dotSpWaivers,
    state.hazProPreparerContext.specialAuthorizationType,
    state.hazProPreparerContext.specialAuthorizationAttested,
    state.hazProPreparerContext.usesCoeCertification,
    state.hazProPreparerContext.usesCaaCertification,
    state.hazProPreparerContext.usesDotSpPermit,
  ]);

  // Navigation handlers
  const handleCancel = useCallback(() => {
    store.hazProPreparerContext.completedSubsteps = completedSubsteps.slice(0, -1);
    navigation.goBack();
  }, [completedSubsteps, navigation, store.hazProPreparerContext]);

  const handleSaveAndContinue = useCallback(() => {
    store.hazProPreparerContext.completedSubsteps = [
      ...completedSubsteps,
      'ShippersDeclarationScreen',
    ];
    navigate('Certify');
  }, [completedSubsteps, navigate, store.hazProPreparerContext]);

  // Redirect excepted quantities to confirmation screen
  useEffect(() => {
    if (isExceptedQuantity) {
      navigation.navigate('ExceptedQuantityConfirmationScreen');
    }
  }, [isExceptedQuantity, navigation]);

  if (isExceptedQuantity) {
    return null;
  }

  // Footer button configuration
  const footerButtons = [
    {
      label: 'Cancel',
      onPress: handleCancel,
      variant: 'outline' as const,
    },
    {
      label: 'Share SDDG',
      onPress: generateAndSharePdf,
      variant: 'secondary' as const,
      loading: isGeneratingPdf,
      disabled: isGeneratingPdf,
    },
    {
      label: 'Save & Continue',
      onPress: handleSaveAndContinue,
      variant: 'primary' as const,
    },
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Limited Quantity informational banner */}
        {isLimitedQuantity && (
          <View style={styles.bannerContainer}>
            <InfoBox
              variant="warning"
              title="Limited Quantity Shipment"
              message="This shipment qualifies as a Limited Quantity. The SDDG form is still required, but no UN specification packaging (POP marking) is needed."
            />
          </View>
        )}

        {/* SDDG Form Preview */}
        <View
          style={styles.formContainer}
          ref={formRef}
          collapsable={false}
        >
          <ShippersDeclarationForm
            shipperName={formData.shipperName}
            shipperAddress={shipperAddress}
            phoneNumber={state.hazProPreparerContext.shipper?.phoneNumber as any}
            dsNumber=""
            airWaybillNo="N/A"
            referenceNumber={formData.referenceNumber}
            airportOfDeparture={formData.airportOfDeparture}
            airportOfDestination={formData.airportOfDestination}
            shipmentType={formData.shipmentType}
            unid={formData.unid}
            shippingName={formData.shippingName}
            classDiv={formData.classDiv}
            packingGroup={formData.packingGroup}
            quantityAndPacking={formData.quantityAndTypeOfPacking}
            packingInstruction={formData.packingInstruction}
            authorization={formData.authorization}
            signatoryName={formData.signatoryName}
            signatoryTitle={formData.signatoryTitle}
            location={formData.location}
            date={formData.date}
            cargoOnly={formData.isCargoAircraftOnly}
            additionalInfo={state.hazProPreparerContext.un3166Details?.accessorialHazards?.other as any}
          />
        </View>
      </ScrollView>

      <ActionFooter buttons={footerButtons} />

      <LoadingOverlay
        visible={isGeneratingPdf}
        message="Generating PDF..."
      />
    </KeyboardAvoidingView>
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
    flexGrow: 1,
  },
  bannerContainer: {
    padding: spacing.lg,
    paddingBottom: 0,
  },
  formContainer: {
    flex: 1,
    backgroundColor: colors.surface,
  },
});

export default ShippersDeclarationScreen;
