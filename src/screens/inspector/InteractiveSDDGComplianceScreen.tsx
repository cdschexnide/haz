import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useInspectionForm } from "../../contexts/InspectionFormProvider";
import { FrustrationRecord, InspectorShipment } from "../../types/sddg";
import InteractiveSDDGForm from "../../components/Inspector/InteractiveSDDGForm";
import SDDGFieldModal from "../../components/Inspector/SDDGFieldModal";
import SDDGRecommendedFrustrationBanner from "../../components/Inspector/SDDGRecommendedFrustrationBanner";
import {
  findHazMatByUnid,
  getAllRecommendedFrustrations,
} from "../../components/Inspector/utils/sddgValidation";
import { HazardousMaterialItem } from "../../hazardousMaterials/hazardousMaterialsList";
import { useDatabase } from "../../contexts/DataProvider";
import { useHazProActions } from "../../stores/useHazProStore";
import { DevBenchmarkButton } from "../../components/dev/DevBenchmarkButton";
import { useRenderTracker, useContextRenderTracker } from "@/hooks/useRenderTracker";
import {
  ScreenHeader,
  ActionFooter,
  InfoBox,
  colors,
  spacing,
  borderRadius,
} from "../../components/ui";

interface InteractiveSDDGComplianceScreenProps {
  navigation: any;
}

/**
 * Interactive SDDG Compliance Validation Screen
 *
 * Replaces the tedious 22-step wizard with a single interactive form where:
 * - All fields displayed at once
 * - Tap any field to add frustration
 * - Non-tapped fields are validated by default
 * - Supports recommended frustrations
 * - Supports reinspection mode
 */
const InteractiveSDDGComplianceScreenComponent: React.FC<
  InteractiveSDDGComplianceScreenProps
> = ({ navigation }) => {
  // === CONTEXT SUBSCRIPTIONS ===
  // NOTE: useInspectionForm() subscribes to ENTIRE context - potential render issue!
  const inspectionFormContext = useInspectionForm();
  const {
    inspection,
    workflow,
    addFrustration,
    removeFrustration,
    updateReinspectedInspection,
    completeReinspection,
    completeSDDGSubstep,
    setCurrentSDDGStep,
    setSDDGComplete,
    completeSDDGAndMoveToPackage,
    updateVerificationField,
    startNewInspection,
  } = inspectionFormContext;

  const database = useDatabase();
  const actions = useHazProActions();

  // === LOCAL STATE ===
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedField, setSelectedField] = useState<{
    key: string;
    label: string;
    value: string;
  } | null>(null);
  const [frustratedFields, setFrustratedFields] = useState<Set<string>>(
    new Set()
  );
  const [recommendedFrustrations, setRecommendedFrustrations] = useState<
    Map<string, string>
  >(new Map());
  const [dismissedRecommendations, setDismissedRecommendations] = useState<
    Set<string>
  >(new Set());
  const [hazMatData, setHazMatData] = useState<HazardousMaterialItem | null>(
    null
  );

  // === RENDER TRACKING ===
  useRenderTracker('InteractiveSDDGComplianceScreen', { navigation }, {
    modalVisible,
    selectedFieldKey: selectedField?.key,
    frustratedFieldsCount: frustratedFields.size,
    recommendedFrustrationsCount: recommendedFrustrations.size,
    dismissedCount: dismissedRecommendations.size,
    hasHazMatData: !!hazMatData,
    frustrationCount: inspection?.frustrations?.length ?? 0,
  });

  // Track context changes - THIS IS KEY to finding the render source
  useContextRenderTracker('InteractiveSDDGComplianceScreen', 'InspectionFormContext', {
    frustrationCount: inspection?.frustrations?.length ?? 0,
    reinspectionMode: workflow?.reinspection?.mode,
  });
  useContextRenderTracker('InteractiveSDDGComplianceScreen', 'Database', { isInitialized: database.isInitialized });

  const isReinspectionMode = workflow.reinspection.mode === "sddg";
  const existingFrustrations = inspection.frustrations || [];

  // Set active chevron when component mounts
  useEffect(() => {
    actions.setCurrentChevron("sddg");
  }, []);

  // Initialize frustrated fields from existing frustrations (for reinspection)
  useEffect(() => {
    const initialFrustrated = new Set<string>();
    existingFrustrations.forEach(f => {
      initialFrustrated.add(f.key);
    });
    setFrustratedFields(initialFrustrated);
  }, []);

  // Look up hazmat data when UN ID is available
  useEffect(() => {
    const unId = inspection?.verificationCopy?.unIdNo;
    if (unId) {
      const material = findHazMatByUnid(unId);
      setHazMatData(material);
      console.log(
        `🔍 [InteractiveSDDG] Loaded hazmat data for ${unId}:`,
        material
      );
    }
  }, [inspection?.verificationCopy?.unIdNo]);

  // Automated compliance checks
  useEffect(() => {
    const recommendations = new Map<string, string>();
    const verificationCopy = inspection.verificationCopy;

    if (!verificationCopy) return;

    const unIdNo = verificationCopy.unIdNo;

    // UN3508: Capacitor Wh rating check
    if (unIdNo === "UN3508") {
      const quantityAndPacking = verificationCopy.quantityAndPacking || "";
      if (!hasWhRating(quantityAndPacking)) {
        recommendations.set(
          "quantityAndPacking",
          "UN3508 capacitors require energy storage capacity in Watt-hours (Wh) to be specified. Missing Wh rating detected."
        );
      }
    }

    // UN2807: Magnetized material handling instructions
    if (unIdNo === "UN2807") {
      const additionalHandlingInfo =
        verificationCopy.additionalHandlingInfo || "";
      if (!hasUN2807HandlingInstructions(additionalHandlingInfo)) {
        recommendations.set(
          "additionalHandlingInfo",
          'UN2807 magnetized materials require specific handling instructions: "Do not store magnetic materials suitable for military airlift closer than 4.6 m (15 feet) to compass sensing devices or other devices unduly affected by magnetic fields". Missing required handling instructions detected.'
        );
      }
    }

    // UN1845: Dry ice packaging check
    if (unIdNo === "UN1845") {
      const quantityAndPacking = verificationCopy.quantityAndPacking || "";
      if (!hasApprovedDryIcePackaging(quantityAndPacking)) {
        recommendations.set(
          "quantityAndPacking",
          "UN1845 dry ice requires approved packaging types (fiberboard box, 4G, or polystyrene foam container). Current packaging may not meet requirements."
        );
      }
    }

    // General hazmat validation - validates all fields against database
    if (hazMatData && verificationCopy) {
      const generalRecommendations = getAllRecommendedFrustrations(
        verificationCopy,
        hazMatData
      );

      // Merge general recommendations with UN-specific ones
      // UN-specific recommendations take precedence (already in map)
      generalRecommendations.forEach(({ fieldKey, recommendation }) => {
        if (!recommendations.has(fieldKey)) {
          recommendations.set(fieldKey, recommendation);
        }
      });

      console.log(
        `✓ [InteractiveSDDG] Found ${generalRecommendations.length} general recommendations`
      );
    }

    setRecommendedFrustrations(recommendations);
  }, [inspection.verificationCopy, hazMatData]);

  // Helper: Check for Wh rating
  const hasWhRating = (text: string): boolean => {
    const lowerText = text.toLowerCase();
    const whPatterns = [
      /\d+\.?\d*\s?wh\b/i,
      /\d+\.?\d*\s?watt-?hours?\b/i,
      /\d+\.?\d*\s?w\.?h\.?\b/i,
    ];
    return whPatterns.some(pattern => pattern.test(lowerText));
  };

  // Helper: Check for UN2807 handling instructions
  const hasUN2807HandlingInstructions = (text: string): boolean => {
    const lowerText = text.toLowerCase();
    const requiredKeywords = [
      "4.6",
      "15 feet",
      "compass",
      "magnetic",
      "sensing",
      "device",
    ];
    return requiredKeywords.every(keyword => lowerText.includes(keyword));
  };

  // Helper: Check for approved dry ice packaging
  const hasApprovedDryIcePackaging = (text: string): boolean => {
    const lowerText = text.toLowerCase();
    return (
      lowerText.includes("fiberboard box") ||
      lowerText.includes("4g") ||
      lowerText.includes("polystyrene foam container")
    );
  };

  // Transform verificationCopy to form data structure
  const getFormData = () => {
    const copy = inspection.verificationCopy;
    if (!copy) {
      return null;
    }

    return {
      shipper: copy.shipper || "",
      consignee: copy.consignee || "",
      airwayBill: copy.airWaybillNumber || "",
      pagination: copy.pagination || "",
      shippersReferenceNumber: copy.shippersReferenceNumber || "",
      inspectionActivity: copy.inspectionActivity || "",
      aircraftType: copy.aircraftType || "",
      airportOfDeparture: copy.airportOfDeparture || "",
      airportOfDestination: copy.airportOfDestination || "",
      shipmentType: copy.shipmentType || "",
      hazardousMaterials: [
        {
          airWaybillNumber: copy.airWaybillNumber || "",
          unIdNo: copy.unIdNo || "",
          properShippingName: copy.properShippingName || "",
          hazardClass: copy.hazardClass || "",
          subsidiaryRisk: copy.subsidiaryRisk || "",
          packingGroup: copy.packingGroup || "",
          quantityAndPacking: copy.quantityAndPacking || "",
          packingInstruction: copy.packingInstruction || "",
          authorization: copy.authorization || "",
        },
      ],
      additionalHandlingInfo: copy.additionalHandlingInfo || "",
      emergencyTelephoneNumber: "1-800-851-8061 | 1-804-279-3131", // Default
      nameOfSignatory: copy.nameOfSignatory || "",
      placeAndDate: copy.placeAndDate || "",
      signature: copy.signature || "",
    };
  };

  // Recalculate form data on every render to ensure it's always up-to-date
  const formData = getFormData();

  // Handle field tap
  const handleFieldPress = useCallback(
    (fieldKey: string, fieldLabel: string, fieldValue: string) => {
      setSelectedField({ key: fieldKey, label: fieldLabel, value: fieldValue });
      setModalVisible(true);
    },
    []
  );

  // Handle frustration save
  const handleSaveFrustration = useCallback(
    (fieldKey: string, correctValue: string, additionalComments?: string) => {
      const fieldValue =
        inspection.verificationCopy?.[
          fieldKey as keyof typeof inspection.verificationCopy
        ] || "";

      addFrustration({
        key: fieldKey,
        fieldLabel: selectedField?.label || fieldKey,
        fieldValue: String(fieldValue),
        correctValue,
        defaultMessage:
          "This key of the SDDG is incorrect. Requires re-inspection",
        additionalComments,
      });

      setFrustratedFields(prev => new Set(prev).add(fieldKey));
      setModalVisible(false);
      setSelectedField(null);
    },
    [addFrustration, inspection.verificationCopy, selectedField]
  );

  // Handle frustration removal
  const handleRemoveFrustration = useCallback(
    (fieldKey: string) => {
      removeFrustration(fieldKey);
      setFrustratedFields(prev => {
        const next = new Set(prev);
        next.delete(fieldKey);
        return next;
      });
      setModalVisible(false);
      setSelectedField(null);
    },
    [removeFrustration]
  );

  // Handle recommended frustration accept
  const handleAcceptRecommendation = (fieldKey: string) => {
    const message = recommendedFrustrations.get(fieldKey);
    if (message) {
      const fieldValue =
        inspection.verificationCopy?.[
          fieldKey as keyof typeof inspection.verificationCopy
        ] || "";

      addFrustration({
        key: fieldKey,
        fieldLabel: `${fieldKey.toUpperCase()} (Recommended)`,
        fieldValue: String(fieldValue),
        correctValue: undefined, // Automated recommendations don't know the correct value
        defaultMessage:
          "This key of the SDDG is incorrect. Requires re-inspection",
        additionalComments: message,
      });

      setFrustratedFields(prev => new Set(prev).add(fieldKey));
      setRecommendedFrustrations(prev => {
        const next = new Map(prev);
        next.delete(fieldKey);
        return next;
      });
    }
  };

  // Handle recommended frustration dismiss
  const handleDismissRecommendation = (fieldKey: string) => {
    setDismissedRecommendations(prev => new Set(prev).add(fieldKey));
    setRecommendedFrustrations(prev => {
      const next = new Map(prev);
      next.delete(fieldKey);
      return next;
    });
  };

  // Handle OCR value correction
  const handleValueUpdate = useCallback(
    (fieldKey: string, newValue: string) => {
      console.log(`📝 [OCR Correction] Updating ${fieldKey}: "${newValue}"`);

      // Update the verification copy in global state
      // The fieldKey from the form matches the verificationCopy keys
      if (inspection.verificationCopy) {
        updateVerificationField(
          fieldKey as keyof typeof inspection.verificationCopy,
          newValue
        );
        console.log(`✓ [OCR Correction] Saved ${fieldKey}`);
      }
    },
    [inspection.verificationCopy, updateVerificationField]
  );

  // Handle continue to next screen (renamed from handleCompleteValidation)
  const handleContinue = async () => {
    const frustratedCount = frustratedFields.size;
    console.log("frustratedCount: ", frustratedCount);
    if (isReinspectionMode) {
      console.log("if block - isReinspectionMode");
      console.log(
        "📋 [InteractiveSDDG] Reinspection mode - updating inspection"
      );

      const result = await updateReinspectedInspection();
      console.log("const result = await updateReinspectedInspection();");
      console.log("result: ", result);
      if (!result.success) {
        console.log("if block - !result.success");
        Alert.alert("Error", result.error || "Failed to save reinspection");
        return;
      }

      completeReinspection();
      console.log("completeReinspection();");
      if (result.allResolved) {
        console.log("if block - result.allResolved");
        Alert.alert(
          "Reinspection Complete",
          "All SDDG frustrations have been resolved.",
          [
            {
              text: "OK",
              onPress: () =>
                navigation.navigate("InspectorHomeStack", {
                  screen: "InspectorHome",
                }),
            },
          ]
        );
      } else {
        console.log(
          "else block - if after reinspection, there are still frustrations, navigates to SDDGFrustrationSummary"
        );
        navigation.navigate("SDDGFrustrationSummary");
      }
      return;
    }

    // Normal flow
    if (frustratedCount === 0) {
      console.log("if block - frustratedCount === 0");
      // Zero frustrations - navigate to SDDGInspectionCompleteScreen
      console.log(
        "📋 [InteractiveSDDG] Zero frustrations - navigating to SDDGInspectionCompleteScreen"
      );

      completeSDDGSubstep("InteractiveSDDGComplianceScreen");

      // Navigate to the SDDG completion screen (user can Save & Exit or Continue to Package)
      navigation.navigate("SDDGInspectionCompleteScreen");
    } else {
      // Has frustrations - go to summary
      console.log("else block - indicates frustratedCount > 0");
      console.log("navigates to SDDGFrustrationSummary");
      completeSDDGSubstep("InteractiveSDDGComplianceScreen");
      setCurrentSDDGStep("frustration");
      navigation.navigate("SDDGFrustrationSummary");
    }
  };

  // Handle Save & Exit - save SDDG inspection only and exit
  const handleSaveAndExit = async () => {
    try {
      // 1. Validate we have data to save
      if (!inspection.verificationCopy) {
        Alert.alert("Error", "Cannot save inspection without SDDG data");
        return;
      }

      // 2. Mark SDDG workflow complete
      completeSDDGSubstep("InteractiveSDDGComplianceScreen");
      setSDDGComplete(true);

      // 3. Determine statuses
      const hasSddgFrustrations = frustratedFields.size > 0;
      const sddgStatus = hasSddgFrustrations ? "frustrated" : "verified";

      // 4. Get inspection ID if it exists
      const inspectionId = workflow.reinspection?.inspectionId;

      // 5. Check if this is reinspection or new inspection
      if (isReinspectionMode && inspectionId) {
        console.log(
          "💾 [SaveExit] Updating existing reinspection:",
          inspectionId
        );

        // Update existing inspection
        await database.updateInspection(inspectionId, {
          sddgStatus: sddgStatus as "verified" | "frustrated",
          sddgFrustrations: inspection.frustrations.length,
          totalFrustrations:
            inspection.frustrations.length +
            inspection.packageFrustrations.length,
          inspectionContext: inspection,
        });
      } else {
        console.log("💾 [SaveExit] Creating new partial inspection");

        const inspectionRecord: InspectorShipment = {
          id: Date.now().toString(),
          status: "in-progress",
          inspectedAt: new Date(),
          inspectionContext: inspection,
          tcn: inspection.verificationCopy.shippersReferenceNumber,
          unId: inspection.verificationCopy.unIdNo,
          properShippingName: inspection.verificationCopy.properShippingName,
          inspector: inspection.inspector,
          sddgStatus: sddgStatus as "verified" | "frustrated",
          packageStatus: null,
          totalFrustrations: inspection.frustrations.length,
          sddgFrustrations: inspection.frustrations.length,
          packageFrustrations: 0,
        };

        await database.saveInspection(inspectionRecord);
        console.log("💾 [SaveExit] Saved inspection:", inspectionRecord.id);
      }

      // 6. Show confirmation
      Alert.alert(
        "SDDG Inspection Saved",
        sddgStatus === "verified"
          ? "SDDG validation completed successfully. You can resume package inspection later."
          : "SDDG saved with frustrations. You can resume or reinspect later.",
        [
          {
            text: "OK",
            onPress: () => {
              // Clear state
              startNewInspection();
              // Navigate to InspectorHomeStack -> InspectorHome screen
              navigation.navigate("InspectorHomeStack", {
                screen: "InspectorHome",
              });
            },
          },
        ]
      );
    } catch (error) {
      console.error("💾 [SaveExit] Failed to save SDDG inspection:", error);
      Alert.alert("Error", "Failed to save inspection. Please try again.");
    }
  };

  // Handle view summary
  const handleViewSummary = () => {
    Alert.alert(
      "Frustrated Fields",
      `You have frustrated ${
        frustratedFields.size
      } field(s).\n\nFrustrated fields:\n${Array.from(frustratedFields)
        .map(key => `• ${key}`)
        .join("\n")}`,
      [{ text: "OK" }]
    );
  };

  const existingFrustration = selectedField
    ? existingFrustrations.find(f => f.key === selectedField.key)
    : null;

  const recommendedMessage = selectedField
    ? recommendedFrustrations.get(selectedField.key)
    : undefined;

  if (!formData) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <ScreenHeader
        title="Shipper's Declaration for Dangerous Goods"
        onBack={() => navigation.goBack()}
        rightIcon="help-outline"
        onRightPress={() =>
          Alert.alert(
            "How to Use",
            "Tap any field on the SDDG form to record a frustration. All untapped fields will be validated by default when you complete validation.",
            [{ text: "OK" }]
          )
        }
      />

      {/* Reinspection Mode Banner */}
      {isReinspectionMode && (
        <View style={styles.reinspectionBannerContainer}>
          <InfoBox
            variant="warning"
            message={`Reinspection Mode: Review ${workflow.reinspection.targetFrustrations.length} frustrated field(s)`}
          />
        </View>
      )}

      {/* Progress Indicator */}
      {/* <View style={styles.progressBar}>
        <View style={styles.progressItem}>
          <Text style={styles.progressLabel}>Validated</Text>
          <Text style={styles.progressValue}>{22 - frustratedFields.size}/22</Text>
        </View>
        <View style={styles.progressSeparator} />
        <View style={styles.progressItem}>
          <Text style={styles.progressLabel}>Frustrated</Text>
          <Text style={[styles.progressValue, styles.frustratedValue]}>{frustratedFields.size}/22</Text>
        </View>
      </View> */}

      {/* Recommended Frustrations Banners */}
      {/* {Array.from(recommendedFrustrations.entries())
        .filter(([key]) => !dismissedRecommendations.has(key))
        .map(([fieldKey, message]) => (
          <SDDGRecommendedFrustrationBanner
            key={fieldKey}
            message={message}
            onAccept={() => handleAcceptRecommendation(fieldKey)}
            onDismiss={() => handleDismissRecommendation(fieldKey)}
          />
        ))} */}

      {/* Scrollable Form */}
      <ScrollView style={styles.content}>
        <InteractiveSDDGForm
          extractedData={formData}
          frustratedFields={frustratedFields}
          recommendedFrustrations={recommendedFrustrations}
          onFieldPress={handleFieldPress}
        />
      </ScrollView>

      {/* Footer Actions */}
      <ActionFooter
        buttons={[
          {
            label: "Back",
            onPress: () => navigation.goBack(),
            variant: "outline",
            icon: "arrow-back",
          },
          {
            label: "Save & Exit",
            onPress: handleSaveAndExit,
            variant: "secondary",
            icon: "save",
          },
          {
            label: frustratedFields.size > 0 ? "Review Frustrations" : "Continue Inspection",
            onPress: handleContinue,
            variant: "primary",
            icon: "arrow-forward",
            iconPosition: "right",
          },
        ]}
      />

      {/* Field Modal - Progressive Disclosure */}
      <SDDGFieldModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setSelectedField(null);
        }}
        fieldKey={selectedField?.key || ""}
        fieldLabel={selectedField?.label || ""}
        fieldValue={selectedField?.value || ""}
        existingFrustration={existingFrustration}
        recommendedMessage={recommendedMessage}
        onSave={handleSaveFrustration}
        onRemove={handleRemoveFrustration}
        onValueUpdate={handleValueUpdate}
        allowValueEdit={true}
        isReinspectionMode={isReinspectionMode}
      />

      {/* Dev Benchmark Button - only visible in __DEV__ */}
      <DevBenchmarkButton position="bottom-right" />
    </SafeAreaView>
  );
};

// Wrap in React.memo with custom comparison
// The navigation prop from React Navigation changes frequently, so we ignore it
const InteractiveSDDGComplianceScreen = React.memo(
  InteractiveSDDGComplianceScreenComponent,
  () => true // Always consider props equal - state/context changes still trigger re-renders
);
export default InteractiveSDDGComplianceScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  reinspectionBannerContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  progressBar: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  progressItem: {
    flex: 1,
    alignItems: "center",
  },
  progressLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  progressValue: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.success,
  },
  frustratedValue: {
    color: colors.error,
  },
  progressSeparator: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.lg,
  },
  content: {
    flex: 1,
  },
});
