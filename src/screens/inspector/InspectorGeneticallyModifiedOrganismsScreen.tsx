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

interface InspectorGeneticallyModifiedOrganismsScreenProps {
  navigation: any;
}

// AFMAN 24-604 A10.8 UN3245 Genetically Modified Organisms Inspection Conditions
const GMO_INSPECTION_CONDITIONS = [
  {
    id: "leakproof-primary-receptacle",
    label: "Leakproof primary receptacle verified",
    description: "Verify primary receptacle is leakproof and properly sealed",
    afmanRef: "AFMAN 24-604 A10.8.2.1",
  },
  {
    id: "leakproof-secondary-packaging",
    label: "Leakproof secondary packaging verified",
    description: "Verify secondary packaging is leakproof and intact",
    afmanRef: "AFMAN 24-604 A10.8.2.1",
  },
  {
    id: "absorbent-material-present",
    label: "Absorbent material between primary and secondary packaging",
    description:
      "Verify sufficient absorbent material is present between primary receptacle and secondary packaging",
    afmanRef: "AFMAN 24-604 A10.8.2.2",
  },
  {
    id: "multiple-receptacles-separated",
    label: "Multiple primary receptacles properly separated",
    description:
      "Verify multiple primary receptacles are separated with absorbent material to prevent contact",
    afmanRef: "AFMAN 24-604 A10.8.2.2",
  },
  {
    id: "rigid-outer-packaging",
    label: "Rigid outer packaging with minimum dimensions",
    description:
      "Verify outer packaging is rigid and at least 100mm (3.9 inches) in smallest external dimension",
    afmanRef: "AFMAN 24-604 A10.8.2.3 & A10.8.2.5",
  },
  {
    id: "performance-test-compliance",
    label: "Package capable of passing performance tests",
    description:
      "Verify package is capable of passing tests specified in 49 CFR Section 178.609",
    afmanRef: "AFMAN 24-604 A10.8.2.4",
  },
  {
    id: "contents-list-present",
    label: "Itemized contents list between secondary and outer packaging",
    description:
      "Verify itemized list of contents is enclosed between secondary and outer packaging",
    afmanRef: "AFMAN 24-604 A10.8.2.6",
  },
  {
    id: "suspected-category-a-marking",
    label: 'Proper "Suspected Category A" marking (if applicable)',
    description:
      'Verify "Suspected Category A Infectious Substance" marking on contents list if material is suspected Category A',
    afmanRef: "AFMAN 24-604 A10.8.2.7",
  },
  {
    id: "pressure-temperature-tolerance",
    label: "Pressure and temperature tolerance verified",
    description:
      "Verify primary receptacle/secondary packaging can withstand ≥95 kPa pressure and -40°C to +55°C temperature range",
    afmanRef: "AFMAN 24-604 A10.8.2.8",
  },
  {
    id: "select-agent-permits",
    label: "Biological select agent permits obtained",
    description:
      "Verify all necessary permits are obtained per 42 CFR Part 73, 7 CFR Part 331, and 9 CFR Part 121",
    afmanRef: "AFMAN 24-604 A10.8.2.9",
  },
  {
    id: "transport-arrangements",
    label: "Advanced transport arrangements made",
    description:
      "Verify advanced arrangements made for permits and timely transport without delay",
    afmanRef: "AFMAN 24-604 A10.8.2.10",
  },
  {
    id: "primary-receptacle-seal-quality",
    label: "Primary receptacle seal quality verified",
    description:
      "Verify proper seal type: flame-sealed glass ampoules, rubber stopped glass vials with metal seals, or heat seal/crimp seal for other materials",
    afmanRef: "AFMAN 24-604 A10.8.3.1 & A10.8.3.2",
  },
  {
    id: "temperature-control-setup",
    label: "Temperature control setup verified (if required)",
    description:
      "Verify proper refrigeration setup: ice/dry ice outside secondary packaging, interior supports, leakproof outer packaging for ice, CO2 venting for dry ice",
    afmanRef: "AFMAN 24-604 A10.8.3.3 & A10.8.3.4",
  },
];

export default function InspectorGeneticallyModifiedOrganismsScreen({
  navigation,
}: InspectorGeneticallyModifiedOrganismsScreenProps) {
  const { inspection, addPackageFrustration, removePackageFrustration } =
    useInspectionForm();
  const { actions } = useHazProStore();

  const [currentStep, setCurrentStep] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [additionalComments, setAdditionalComments] = useState("");

  const currentCondition = GMO_INSPECTION_CONDITIONS[currentStep];
  const totalSteps = GMO_INSPECTION_CONDITIONS.length;

  // Get current UN ID for verification
  const unId =
    inspection?.verificationCopy?.unIdNo ||
    inspection?.extractedContent?.unIdNo;
  const properShippingName =
    inspection?.verificationCopy?.properShippingName ||
    inspection?.extractedContent?.properShippingName;

  // Get existing package frustrations for GMO
  const existingFrustrations =
    inspection?.packageFrustrations?.filter(f => f.category === "gmo") || [];
  const frustratedCount = existingFrustrations.length;
  const validatedCount = totalSteps - frustratedCount;

  const currentFrustration = existingFrustrations.find(
    f => f.itemId === currentCondition?.id
  );

  console.log("🧬 [InspectorGeneticallyModifiedOrganisms] Component rendered");
  console.log("🧬 [InspectorGeneticallyModifiedOrganisms] UN ID:", unId);
  console.log(
    "🧬 [InspectorGeneticallyModifiedOrganisms] Current step:",
    currentStep
  );
  console.log(
    "🧬 [InspectorGeneticallyModifiedOrganisms] Existing frustrations:",
    existingFrustrations.length
  );

  // Default frustration message
  const DEFAULT_FRUSTRATION_MESSAGE =
    "This UN3245 genetically modified organisms packaging requirement is not met. Requires re-inspection per AFMAN 24-604 A10.8.";

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
      category: "gmo" as const,
      itemId: currentCondition.id,
      itemLabel: currentCondition.label,
      expectedValues: ["Pass"],
      verificationStatus: "incorrect" as const,
      defaultMessage: DEFAULT_FRUSTRATION_MESSAGE,
      additionalComments: additionalComments.trim() || undefined,
      afmanReference: currentCondition.afmanRef,
    };

    console.log(
      "💾 [InspectorGeneticallyModifiedOrganisms] Saving frustration for condition:",
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
      "🚨 [InspectorGeneticallyModifiedOrganisms] handleFinalSubmit called"
    );

    const currentFrustrations =
      inspection?.packageFrustrations?.filter(f => f.category === "gmo") || [];
    const currentFrustratedCount = currentFrustrations.length;

    console.log(
      "🚨 [InspectorGeneticallyModifiedOrganisms] frustratedCount:",
      currentFrustratedCount
    );

    if (currentFrustratedCount === 0) {
      // No frustrations - proceed to package frustration summary
      Alert.alert(
        "UN3245 Genetically Modified Organisms Inspection Complete",
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

  // Verify this is UN3245
  if (unId !== "UN3245") {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Invalid material type for genetically modified organisms inspection
          </Text>
          <Text style={styles.errorSubText}>
            Expected UN3245, found: {unId || "Unknown"}
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
            UN3245 Genetically Modified Organisms
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
  materialInfoSection: {
    backgroundColor: "#F0F8FF",
    borderRadius: 8,
    padding: 12,
    margin: 16,
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  materialInfoLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#007AFF",
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
  progressText: {
    fontSize: 12,
    color: "#8E8E93",
    textAlign: "center",
    marginTop: 8,
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
