import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useInspectionForm } from "../../contexts/InspectionFormProvider";
import { PackageFrustrationRecord } from "../../types/sddg";
import { useHazProStore } from "../../stores/useHazProStore";

interface InspectorEnginesInternalCombustionScreenProps {
  navigation: any;
}

// AFMAN 24-604 A7.11 Internal Combustion Engine Inspection Conditions (UN3528 & UN3529 only)
const getEngineInspectionConditions = (unId: string) => {
  const isUN3528 = unId === "UN3528"; // Flammable liquid powered
  const isUN3529 = unId === "UN3529"; // Flammable gas powered

  const baseConditions = [
    {
      id: "technical-manual-compliance",
      label: "Technical manual compliance verified",
      description:
        "Verify equipment service or technical manual was used to prepare item for shipment",
      afmanRef: "AFMAN 24-604 A7.11.1",
    },
    {
      id: "fuel-draining-verification",
      label: "Fuel draining completed",
      description:
        "Verify engine-powered equipment has been completely drained of fuel with maximum 500ml (17 ounces) residual in engine components and fuel lines",
      afmanRef: "AFMAN 24-604 A7.11.2",
    },
    {
      id: "fuel-tank-security",
      label: "Fuel tanks and lines securely closed",
      description:
        "Verify all fuel lines and tanks are securely closed to prevent leakage of fuel",
      afmanRef: "AFMAN 24-604 A7.11.2",
    },
  ];

  // Add purging requirement only for UN3528 (flammable liquid)
  if (isUN3528) {
    baseConditions.push({
      id: "fuel-system-purging",
      label: "Fuel system purging completed",
      description:
        "Verify engine has been drained and purged when required by technical manual",
      afmanRef: "AFMAN 24-604 A7.11.2",
    });
  }

  // Add gas-specific requirements for UN3529
  if (isUN3529) {
    baseConditions.push({
      id: "gaseous-fuel-emptying",
      label: "Gaseous fuel completely emptied",
      description:
        "Verify gaseous fuel has been completely emptied from non-DOT specification pressurized vessels",
      afmanRef: "AFMAN 24-604 A7.11.2",
    });
  }

  const additionalConditions = [
    {
      id: "large-fuel-system-drainage",
      label: "Large fuel system drainage verified",
      description:
        "For engines with large fuel systems that cannot be drained to 500ml, verify drainage to extent that no free-standing liquid remains in fuel tank, lines, or system",
      afmanRef: "AFMAN 24-604 A7.11.2.1",
    },
    {
      id: "single-axle-equipment-drainage",
      label: "Single axle equipment completely drained (if applicable)",
      description:
        "Verify single axle equipment loaded with tongue resting on aircraft floor has been completely drained",
      afmanRef: "AFMAN 24-604 A7.11.2.3",
    },
    {
      id: "damaged-engine-preparation",
      label: "Damaged/inoperable engine preparation (if applicable)",
      description:
        "For damaged or inoperable engines where purging cannot be accomplished, verify drainage to maximum extent possible and installation of plugs, caps, and covers over all openings",
      afmanRef: "AFMAN 24-604 A7.11.2.4",
    },
    {
      id: "upright-orientation-packaging",
      label: "Upright orientation packaging verified",
      description:
        "Verify engines/machinery are secured in strong, rigid outer packaging in orientation to prevent accidental leakage and prevent movement during transport that would change orientation",
      afmanRef: "AFMAN 24-604 A7.11.2.6",
    },
    {
      id: "freight-container-fuel-requirements",
      label: "Freight container fuel requirements (if applicable)",
      description:
        "When loaded in freight container, verify fuel tanks are drained and system is purged if required by technical directive or if flash point of fuel is less than 38°C (100°F)",
      afmanRef: "AFMAN 24-604 A7.11.2.8",
    },
    {
      id: "battery-installation-compliance",
      label: "Battery installation compliance verified",
      description:
        "Verify batteries are secured upright in designed holders with terminals protected to prevent short circuit by use of battery boxes, protective covers, or taping",
      afmanRef: "AFMAN 24-604 A7.11.3.1",
    },
    {
      id: "freight-container-battery-removal",
      label: "Freight container battery removal (if applicable)",
      description:
        "When loaded in freight container, verify acid or alkali batteries have been removed and packaged separately",
      afmanRef: "AFMAN 24-604 A7.11.3.2",
    },
    {
      id: "non-spillable-battery-verification",
      label: "Non-spillable battery verification (if applicable)",
      description:
        "Verify non-spillable and non-hazardous gel-type batteries remain upright in equipment holder with cables disconnected and terminals taped",
      afmanRef: "AFMAN 24-604 A7.11.3.2",
    },
    {
      id: "lithium-battery-security",
      label: "Lithium battery security (if applicable)",
      description:
        "Verify lithium batteries are securely fastened in battery holder with terminals protected and are of a type that has passed UN Manual of Tests and Criteria",
      afmanRef: "AFMAN 24-604 A7.11.2.12",
    },
  ];

  return [...baseConditions, ...additionalConditions];
};

export default function InspectorEnginesInternalCombustionScreen({
  navigation,
}: InspectorEnginesInternalCombustionScreenProps) {
  const { inspection, addPackageFrustration, removePackageFrustration } =
    useInspectionForm();
  const { actions } = useHazProStore();

  const [currentStep, setCurrentStep] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [additionalComments, setAdditionalComments] = useState("");

  // Get current UN ID for verification
  const unId =
    inspection?.verificationCopy?.unIdNo ||
    inspection?.extractedContent?.unIdNo;
  const properShippingName =
    inspection?.verificationCopy?.properShippingName ||
    inspection?.extractedContent?.properShippingName;

  const INSPECTION_CONDITIONS = getEngineInspectionConditions(unId || "");
  const currentCondition = INSPECTION_CONDITIONS[currentStep];
  const totalSteps = INSPECTION_CONDITIONS.length;

  // Get existing package frustrations for engines
  const existingFrustrations =
    inspection?.packageFrustrations?.filter(
      f => f.category === "engines-internal-combustion"
    ) || [];
  const frustratedCount = existingFrustrations.length;
  const validatedCount = totalSteps - frustratedCount;

  const currentFrustration = existingFrustrations.find(
    f => f.itemId === currentCondition?.id
  );

  console.log("🔧 [InspectorEnginesInternalCombustion] Component rendered");
  console.log("🔧 [InspectorEnginesInternalCombustion] UN ID:", unId);
  console.log(
    "🔧 [InspectorEnginesInternalCombustion] Current step:",
    currentStep
  );
  console.log(
    "🔧 [InspectorEnginesInternalCombustion] Existing frustrations:",
    existingFrustrations.length
  );

  // Default frustration message
  const DEFAULT_FRUSTRATION_MESSAGE = `This ${unId} engine packaging requirement is not met. Requires re-inspection per AFMAN 24-604 A7.11.`;

  // Set active chevron when component mounts
  useEffect(() => {
    actions.setCurrentChevron("package");
  }, []);

  useEffect(() => {
    // Reset edit mode when changing steps
    setIsEditMode(false);
    setAdditionalComments("");
  }, [currentStep]);

  const handleValidate = () => {
    // Remove any existing frustration for this condition
    removePackageFrustration(currentCondition.id);

    // Move to next step
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinalSubmit();
    }
  };

  const handleFrustrate = () => {
    // Switch to edit mode to add comments
    setIsEditMode(true);
    setAdditionalComments(currentFrustration?.additionalComments || "");
  };

  const handleSaveFrustration = () => {
    // Save the frustration
    const frustrationData = {
      category: "engines-internal-combustion" as const,
      itemId: currentCondition.id,
      itemLabel: currentCondition.label,
      expectedValues: ["Pass"],
      verificationStatus: "incorrect" as const,
      defaultMessage: DEFAULT_FRUSTRATION_MESSAGE,
      additionalComments: additionalComments.trim() || undefined,
      afmanReference: currentCondition.afmanRef,
    };

    console.log(
      "💾 [InspectorEnginesInternalCombustion] Saving frustration for condition:",
      currentCondition.id
    );
    addPackageFrustration(frustrationData);

    // Move to next step
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinalSubmit();
    }
  };

  const handleCancelFrustration = () => {
    setIsEditMode(false);
    setAdditionalComments("");
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinalSubmit = () => {
    console.log(
      "🚨 [InspectorEnginesInternalCombustion] handleFinalSubmit called"
    );

    const currentFrustrations =
      inspection?.packageFrustrations?.filter(
        f => f.category === "engines-internal-combustion"
      ) || [];
    const currentFrustratedCount = currentFrustrations.length;

    console.log(
      "🚨 [InspectorEnginesInternalCombustion] frustratedCount:",
      currentFrustratedCount
    );

    if (currentFrustratedCount === 0) {
      // No frustrations - proceed to package frustration summary
      Alert.alert(
        `${unId} Internal Combustion Engine Inspection Complete`,
        "All packaging requirements have been validated successfully.\\n\\nNo compliance issues were found. Proceeding to package summary.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Continue",
            style: "default",
            onPress: () => {
              // Navigate to Package Markings Screen
              navigation.navigate("InspectorAttachment28WizardScreen");
            },
          },
        ]
      );
    } else {
      // Has frustrations - navigate to package markings screen
      navigation.navigate("InspectorAttachment28WizardScreen");
    }
  };

  // Verify this is UN3528 or UN3529
  if (unId !== "UN3528" && unId !== "UN3529") {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Invalid material type for internal combustion engine inspection
          </Text>
          <Text style={styles.errorSubText}>
            Expected UN3528 or UN3529, found: {unId || "Unknown"}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!currentCondition || !inspection) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No inspection data available</Text>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const getHeaderTitle = () => {
    if (unId === "UN3528") {
      return "UN3528 Flammable Liquid Powered Engine";
    } else if (unId === "UN3529") {
      return "UN3529 Flammable Gas Powered Engine";
    }
    return "Internal Combustion Engine";
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="close" size={24} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{getHeaderTitle()}</Text>
          <Text style={styles.stepIndicator}>
            {currentStep + 1}/{totalSteps}
          </Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${((currentStep + 1) / totalSteps) * 100}%` },
              ]}
            />
          </View>
        </View>

        <View style={styles.mainContent}>
          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Current Condition */}
            <View style={styles.fieldCard}>
              {!isEditMode ? (
                /* Review Mode UI */
                <>
                  <View style={styles.fieldContent}>
                    <View style={styles.fieldHeader}>
                      <Text style={styles.fieldLabel}>
                        {currentCondition.label}
                      </Text>
                    </View>

                    <Text style={styles.descriptionLabel}>
                      Inspection Requirement:
                    </Text>
                    <View style={styles.previewContainer}>
                      <Text style={styles.previewText}>
                        {currentCondition.description}
                      </Text>
                    </View>

                    <View style={styles.afmanReference}>
                      <MaterialIcons name="book" size={16} color="#007AFF" />
                      <Text style={styles.afmanReferenceText}>
                        {currentCondition.afmanRef}
                      </Text>
                    </View>

                    {currentFrustration && (
                      <View style={styles.frustrationIndicator}>
                        <MaterialIcons name="error" size={20} color="#FF3B30" />
                        <Text style={styles.frustrationText}>
                          Previously Frustrated
                        </Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.complianceButtons}>
                    <TouchableOpacity
                      style={styles.validateButton}
                      onPress={handleValidate}
                    >
                      <MaterialIcons
                        name="check-circle"
                        size={24}
                        color="#FFFFFF"
                      />
                      <Text style={styles.validateButtonText}>Validate</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.frustrateButton}
                      onPress={handleFrustrate}
                    >
                      <MaterialIcons name="cancel" size={24} color="#FFFFFF" />
                      <Text style={styles.frustrateButtonText}>Frustrate</Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                /* Frustration Edit Mode UI */
                <>
                  <View style={styles.fieldContent}>
                    <View style={styles.fieldHeader}>
                      <Text style={styles.fieldLabel}>
                        {currentCondition.label}
                      </Text>
                      <MaterialIcons name="error" size={24} color="#FF3B30" />
                    </View>

                    <Text style={styles.frustrationLabel}>
                      Frustration Details:
                    </Text>

                    <View style={styles.defaultMessageContainer}>
                      <Text style={styles.defaultMessageLabel}>
                        Default Message:
                      </Text>
                      <Text style={styles.defaultMessage}>
                        {DEFAULT_FRUSTRATION_MESSAGE}
                      </Text>
                    </View>

                    <Text style={styles.commentsLabel}>
                      Additional Comments (Optional):
                    </Text>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.textInput}
                        value={additionalComments}
                        onChangeText={setAdditionalComments}
                        placeholder="Add specific compliance issues or notes..."
                        multiline={true}
                        numberOfLines={4}
                        textAlignVertical="top"
                      />
                    </View>
                  </View>

                  <View style={styles.editModeButtons}>
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={handleCancelFrustration}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.saveButton}
                      onPress={handleSaveFrustration}
                    >
                      <MaterialIcons name="save" size={20} color="#FFFFFF" />
                      <Text style={styles.saveButtonText}>
                        Save Frustration
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </ScrollView>
        </View>

        {/* Navigation Footer */}
        {!isEditMode && (
          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.navButton,
                currentStep === 0 && styles.navButtonDisabled,
              ]}
              onPress={handleBack}
              disabled={currentStep === 0}
            >
              <MaterialIcons
                name="chevron-left"
                size={24}
                color={currentStep === 0 ? "#C7C7CC" : "#007AFF"}
              />
              <Text
                style={[
                  styles.navButtonText,
                  currentStep === 0 && styles.navButtonTextDisabled,
                ]}
              >
                Back
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
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
    textAlign: "center",
    color: "#1D1D1F",
    marginHorizontal: 8,
  },
  stepIndicator: {
    fontSize: 16,
    fontWeight: "500",
    color: "#007AFF",
  },
  progressBarContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: "#FFFFFF",
  },
  progressBarBackground: {
    height: 4,
    backgroundColor: "#E5E5EA",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#007AFF",
    borderRadius: 2,
  },
  mainContent: {
    flex: 1,
    flexDirection: "row",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 20,
  },
  fieldCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    minHeight: "70%",
    flex: 1,
    justifyContent: "space-between",
  },
  fieldContent: {
    flex: 1,
  },
  fieldHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1D1D1F",
    flex: 1,
  },
  descriptionLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#8E8E93",
    marginBottom: 8,
  },
  previewContainer: {
    backgroundColor: "#F8F9FA",
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    minHeight: 60,
  },
  previewText: {
    fontSize: 16,
    color: "#1D1D1F",
    lineHeight: 22,
  },
  afmanReference: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F8FF",
    padding: 10,
    borderRadius: 6,
    marginBottom: 16,
  },
  afmanReferenceText: {
    marginLeft: 6,
    fontSize: 13,
    color: "#007AFF",
    fontWeight: "500",
  },
  frustrationIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF5F5",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  frustrationText: {
    marginLeft: 8,
    color: "#FF3B30",
    fontWeight: "500",
  },
  complianceButtons: {
    flexDirection: "row",
    gap: 12,
  },
  validateButton: {
    flex: 1,
    backgroundColor: "#34C759",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: "#34C759",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  validateButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  frustrateButton: {
    flex: 1,
    backgroundColor: "#FF3B30",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: "#FF3B30",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  frustrateButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  frustrationLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1D1D1F",
    marginBottom: 16,
  },
  defaultMessageContainer: {
    backgroundColor: "#FFF5F5",
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#FF3B30",
  },
  defaultMessageLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FF3B30",
    marginBottom: 4,
  },
  defaultMessage: {
    fontSize: 16,
    color: "#1D1D1F",
    lineHeight: 22,
  },
  commentsLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#8E8E93",
    marginBottom: 8,
  },
  inputContainer: {
    borderWidth: 2,
    borderRadius: 8,
    backgroundColor: "#F8F9FA",
    borderColor: "#FF3B30",
  },
  textInput: {
    padding: 16,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: "top",
  },
  editModeButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#8E8E93",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#8E8E93",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#FF3B30",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 4,
  },
  footer: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 16,
    color: "#007AFF",
    marginLeft: 4,
  },
  navButtonTextDisabled: {
    color: "#C7C7CC",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#8E8E93",
    marginBottom: 8,
    textAlign: "center",
  },
  errorSubText: {
    fontSize: 14,
    color: "#8E8E93",
    marginBottom: 20,
    textAlign: "center",
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#007AFF",
    borderRadius: 8,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
