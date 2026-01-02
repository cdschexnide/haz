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
import { useInspectionForm } from "../../../src/contexts/InspectionFormProvider";
import { PackageFrustrationRecord } from "../../../src/types/sddg";
import { useHazProStore } from "../../../src/stores/useHazProStore";

interface InspectorLithiumBatteriesScreenProps {
  navigation: any;
}

// AFMAN 24-604 A13.7 Lithium Batteries (UN3480/UN3090) Inspection Requirements
const LITHIUM_BATTERY_INSPECTION_CONDITIONS = [
  {
    id: "un-38-3-test-requirements",
    label: "UN Manual of Tests and Criteria (38.3) compliance verified",
    description:
      "Verify batteries meet UN Manual of Tests and Criteria requirements per A3.3.9.2 (except A3.3.9.2.3)",
    afmanRef: "AFMAN 24-604 A13.7.1 & A3.3.9.2",
  },
  {
    id: "non-metallic-inner-packaging",
    label: "Non-metallic inner packaging completely encloses battery",
    description:
      "Verify non-metallic inner packaging completely encloses the cell or battery and separates from contact with equipment or conductive materials",
    afmanRef: "AFMAN 24-604 A13.7.2.1",
  },
  {
    id: "short-circuit-protection",
    label: "Protection against external short circuits verified",
    description:
      "Verify batteries have adequate protection against external short circuits including terminal protection and secure placement",
    afmanRef: "AFMAN 24-604 A13.7.2.1",
  },
  {
    id: "outer-packaging-compliance",
    label: "Outer packaging meets UN specification requirements",
    description:
      "Verify outer packaging is metal box (4A, 4B, 4N), wooden box (4C1, 4C2, 4D, 4F), fiberboard box (4G), solid plastic box (4H1, 4H2), or appropriate drum/jerrican meeting PG II performance level",
    afmanRef: "AFMAN 24-604 A13.7.2.1",
  },
  {
    id: "battery-terminals-secure",
    label: "Battery terminals properly secured and protected",
    description:
      "Verify battery terminals do not support weight of other elements and are secured to prevent inadvertent movement",
    afmanRef: "AFMAN 24-604 A13.7.2.2",
  },
  {
    id: "weight-limit-compliance",
    label: "Battery weight and packaging requirements verified",
    description:
      "For batteries >12kg: verify use of strong outer packagings, protective enclosures, or pallets. For batteries ≤12kg: verify UN specification packaging compliance",
    afmanRef: "AFMAN 24-604 A13.7.2.1 & A13.7.2.2",
  },
  {
    id: "large-packaging-compliance",
    label: "Large packaging requirements verified (if applicable)",
    description:
      "For single batteries in large packagings: verify metal with non-conductive lining (50A, 50B, 50N), rigid plastic (50H), wooden (50C, 50D, 50F), or rigid fiberboard (50G) meeting PG II performance level",
    afmanRef: "AFMAN 24-604 A13.7.2.3",
  },
  {
    id: "separation-from-hazmat",
    label: "Proper separation from incompatible hazardous materials",
    description:
      "Verify lithium batteries (UN3480/UN3090) are not in same package/overpack as Class 1 (except 1.4S), Division 2.1, Class 3, Division 4.1, or Division 5.1 materials",
    afmanRef: "AFMAN 24-604 A13.7.3",
  },
  {
    id: "watt-hour-rating-verification",
    label: "Watt-hour rating verification (UN3480 only)",
    description:
      "For UN3480 lithium-ion batteries: verify watt-hour rating is clearly marked and within acceptable limits for transport classification",
    afmanRef: "AFMAN 24-604 A13.7 & Table A3.5",
    isConditional: true,
    condition: "UN3480",
  },
  {
    id: "lithium-content-verification",
    label: "Lithium content verification (UN3090 only)",
    description:
      "For UN3090 lithium metal batteries: verify lithium content is clearly marked and within acceptable limits for transport classification",
    afmanRef: "AFMAN 24-604 A13.7 & Table A3.5",
    isConditional: true,
    condition: "UN3090",
  },
  {
    id: "excepted-quantity-compliance",
    label: "Excepted quantity requirements verified (if applicable)",
    description:
      "If claiming excepted quantity status: verify compliance with quantity limits, packaging requirements, and marking/labeling per Table A3.5",
    afmanRef: "AFMAN 24-604 Table A3.5",
    isConditional: true,
    condition: "excepted_quantity",
  },
  {
    id: "damage-assessment",
    label: "Battery condition and damage assessment",
    description:
      "Verify batteries are not defective, damaged, or showing signs of leakage. Damaged batteries are prohibited from air transport",
    afmanRef: "AFMAN 24-604 A13.7 General Safety Requirements",
  },
  {
    id: "packaging-integrity",
    label: "Overall packaging integrity verification",
    description:
      "Verify complete packaging system maintains integrity, proper closures, and adequate protection for air transport conditions",
    afmanRef: "AFMAN 24-604 A13.7.2.1",
  },
];

export default function InspectorLithiumBatteriesScreen({
  navigation,
}: InspectorLithiumBatteriesScreenProps) {
  const { inspection, addPackageFrustration, removePackageFrustration } =
    useInspectionForm();
  const { actions } = useHazProStore();

  const [currentStep, setCurrentStep] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [additionalComments, setAdditionalComments] = useState("");

  // Get current UN ID for verification and conditional requirements
  const unId =
    inspection?.verificationCopy?.unIdNo ||
    inspection?.extractedContent?.unIdNo;
  const properShippingName =
    inspection?.verificationCopy?.properShippingName ||
    inspection?.extractedContent?.properShippingName;

  // Filter conditions based on UN ID and requirements
  const getApplicableConditions = () => {
    return LITHIUM_BATTERY_INSPECTION_CONDITIONS.filter(condition => {
      if (!condition.isConditional) return true;

      if (condition.condition === "UN3480") return unId === "UN3480";
      if (condition.condition === "UN3090") return unId === "UN3090";
      if (condition.condition === "excepted_quantity") {
        // This would need to be determined based on the specific shipment data
        // For now, include it for inspection consideration
        return true;
      }

      return true;
    });
  };

  const applicableConditions = getApplicableConditions();
  const currentCondition = applicableConditions[currentStep];
  const totalSteps = applicableConditions.length;

  // Get existing package frustrations for lithium batteries
  const existingFrustrations =
    inspection?.packageFrustrations?.filter(
      f => f.category === "lithium_battery"
    ) || [];
  const frustratedCount = existingFrustrations.length;
  const validatedCount = totalSteps - frustratedCount;

  const currentFrustration = existingFrustrations.find(
    f => f.itemId === currentCondition?.id
  );

  console.log("🔋 [InspectorLithiumBatteries] Component rendered");
  console.log("🔋 [InspectorLithiumBatteries] UN ID:", unId);
  console.log("🔋 [InspectorLithiumBatteries] Current step:", currentStep);
  console.log(
    "🔋 [InspectorLithiumBatteries] Applicable conditions:",
    applicableConditions.length
  );
  console.log(
    "🔋 [InspectorLithiumBatteries] Existing frustrations:",
    existingFrustrations.length
  );

  // Default frustration message
  const DEFAULT_FRUSTRATION_MESSAGE = `This ${unId} lithium battery packaging requirement is not met. Requires re-inspection per AFMAN 24-604 A13.7.`;

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
      category: "lithium_battery" as const,
      itemId: currentCondition.id,
      itemLabel: currentCondition.label,
      expectedValues: ["Pass"],
      verificationStatus: "incorrect" as const,
      defaultMessage: DEFAULT_FRUSTRATION_MESSAGE,
      additionalComments: additionalComments.trim() || undefined,
      afmanReference: currentCondition.afmanRef,
    };

    console.log(
      "💾 [InspectorLithiumBatteries] Saving frustration for condition:",
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
    console.log("🚨 [InspectorLithiumBatteries] handleFinalSubmit called");

    const currentFrustrations =
      inspection?.packageFrustrations?.filter(
        f => f.category === "lithium_battery"
      ) || [];
    const currentFrustratedCount = currentFrustrations.length;

    console.log(
      "🚨 [InspectorLithiumBatteries] frustratedCount:",
      currentFrustratedCount
    );

    if (currentFrustratedCount === 0) {
      // No frustrations - proceed to package markings
      Alert.alert(
        `${unId} Lithium Battery Inspection Complete`,
        "All packaging requirements have been validated successfully.\\n\\nNo compliance issues were found. Proceeding to package markings inspection.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Continue",
            style: "default",
            onPress: () => {
              // Navigate to Package Markings Screen
              navigation.navigate("InspectorPackageVerification");
            },
          },
        ]
      );
    } else {
      // Has frustrations - navigate to package markings screen
      navigation.navigate("InspectorPackageVerification");
    }
  };

  // Verify this is UN3480 or UN3090
  if (unId !== "UN3480" && unId !== "UN3090") {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Invalid material type for lithium battery inspection
          </Text>
          <Text style={styles.errorSubText}>
            Expected UN3480 or UN3090, found: {unId || "Unknown"}
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

  const getBatteryTypeDisplay = () => {
    if (unId === "UN3480") return "Lithium Ion Batteries";
    if (unId === "UN3090") return "Lithium Metal Batteries";
    return "Lithium Batteries";
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
          <Text style={styles.headerTitle}>
            {unId} {getBatteryTypeDisplay()}
          </Text>
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

        {/* Material Info Section */}
        <View style={styles.materialInfoSection}>
          <Text style={styles.materialInfoLabel}>CURRENT MATERIAL</Text>
          <Text style={styles.materialInfoText}>UN ID: {unId}</Text>
          <Text style={styles.materialInfoText}>
            Proper Shipping Name: {properShippingName}
          </Text>
          <Text style={styles.materialInfoText}>
            Battery Type: {getBatteryTypeDisplay()}
          </Text>
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
                      {currentCondition.isConditional && (
                        <View style={styles.conditionalBadge}>
                          <Text style={styles.conditionalBadgeText}>
                            {currentCondition.condition?.toUpperCase()}
                          </Text>
                        </View>
                      )}
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
  materialInfoSection: {
    backgroundColor: "#FFF8DC",
    borderRadius: 8,
    padding: 12,
    margin: 16,
    borderWidth: 1,
    borderColor: "#FFB000",
  },
  materialInfoLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFB000",
    marginBottom: 6,
  },
  materialInfoText: {
    fontSize: 13,
    color: "#1D1D1F",
    marginBottom: 2,
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
  conditionalBadge: {
    backgroundColor: "#FFB000",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  conditionalBadgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#FFFFFF",
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
