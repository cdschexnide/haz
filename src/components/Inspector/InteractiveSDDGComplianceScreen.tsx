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
import { useInspectionForm } from "../../../src/contexts/InspectionFormProvider";
import { FrustrationRecord, InspectorShipment } from "../../../src/types/sddg";
import InteractiveSDDGForm from "./InteractiveSDDGForm";
import SDDGFieldModal from "./SDDGFieldModal";
import SDDGRecommendedFrustrationBanner from "./SDDGRecommendedFrustrationBanner";
import {
  findHazMatByUnid,
  getAllRecommendedFrustrations,
} from "./utils/sddgValidation";
import { HazardousMaterialItem } from "../../../src/hazardousMaterials/hazardousMaterialsList";
import { useDatabase } from "../../../src/contexts/DataProvider";
import { useHazProStore } from "../../../src/stores/useHazProStore";

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
const InteractiveSDDGComplianceScreen: React.FC<
  InteractiveSDDGComplianceScreenProps
> = ({ navigation }) => {
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
  } = useInspectionForm();

  const database = useDatabase();
  const { actions } = useHazProStore();

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
      // Zero frustrations - mark SDDG complete and route to package inspection
      console.log(
        "📋 [InteractiveSDDG] Zero frustrations - proceeding to package inspection"
      );

      completeSDDGSubstep("InteractiveSDDGComplianceScreen");
      setSDDGComplete(true);
      completeSDDGAndMoveToPackage();

      // Route to ML Detection Screen first, passing UN number for subsequent routing
      const unIdNo = inspection.verificationCopy?.unIdNo || "";
      console.log("const unIdNo = inspection.verificationCopy?.unIdNo");
      console.log("unIdNo:", unIdNo);
      console.log("Navigating to MLDetectionScreen for label detection");

      // Navigate to ML Detection Screen - it will handle routing to package verification
      // or specialized screens based on UN number after detection is complete
      navigation.navigate("MLDetectionScreen", { unIdNo });
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Shipper's Declaration for Dangerous Goods
        </Text>
        <TouchableOpacity
          onPress={() =>
            Alert.alert(
              "How to Use",
              "Tap any field on the SDDG form to record a frustration. All untapped fields will be validated by default when you complete validation.",
              [{ text: "OK" }]
            )
          }
        >
          <MaterialIcons name="help-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Reinspection Mode Banner */}
      {isReinspectionMode && (
        <View style={styles.reinspectionBanner}>
          <MaterialIcons name="refresh" size={20} color="#FF9500" />
          <Text style={styles.reinspectionText}>
            Reinspection Mode: Review{" "}
            {workflow.reinspection.targetFrustrations.length} frustrated
            field(s)
          </Text>
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
      <View style={styles.footer}>
        {/* Left: Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={20} color="#007AFF" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        {/* Center: Save & Exit Button */}
        <TouchableOpacity
          style={styles.saveExitButton}
          onPress={handleSaveAndExit}
        >
          <MaterialIcons name="save" size={20} color="#ffffff" />
          <Text style={styles.saveExitButtonText}>Save & Exit</Text>
        </TouchableOpacity>

        {/* Right: Continue Button */}
        <TouchableOpacity style={styles.primaryButton} onPress={handleContinue}>
          <Text style={styles.primaryButtonText}>
            {frustratedFields.size > 0
              ? "Review Frustrations"
              : "Continue to Package"}
          </Text>
          <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

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
    </SafeAreaView>
  );
};

export default InteractiveSDDGComplianceScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: "#1D1D1F",
    textAlign: "center",
    marginHorizontal: 16,
  },
  reinspectionBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF9F0",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#FF9500",
    gap: 8,
  },
  reinspectionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FF9500",
  },
  progressBar: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  progressItem: {
    flex: 1,
    alignItems: "center",
  },
  progressLabel: {
    fontSize: 12,
    color: "#8E8E93",
    marginBottom: 4,
  },
  progressValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#34C759",
  },
  frustratedValue: {
    color: "#FF3B30",
  },
  progressSeparator: {
    width: 1,
    backgroundColor: "#E5E5EA",
    marginHorizontal: 16,
  },
  content: {
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
    backgroundColor: "#ffffff",
  },
  backButton: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: "#007AFF",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    flexDirection: "row",
    gap: 4,
  },
  backButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },
  saveExitButton: {
    flex: 1,
    height: 48,
    backgroundColor: "#6C757D",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
    flexDirection: "row",
    gap: 6,
  },
  saveExitButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  primaryButton: {
    flex: 1,
    height: 48,
    backgroundColor: "#007AFF",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    flexDirection: "row",
    gap: 6,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
