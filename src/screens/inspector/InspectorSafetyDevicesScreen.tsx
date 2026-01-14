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
import {
  ScreenHeader,
  InfoBox,
  colors,
  spacing,
  borderRadius,
  shadows,
} from "../ui";

interface InspectorSafetyDevicesScreenProps {
  navigation: any;
}

// AFMAN 24-604 A13.15 Safety Devices Inspection Conditions
const SAFETY_DEVICE_INSPECTION_CONDITIONS = [
  {
    id: "device-type-identification",
    label: "Device type properly identified",
    description:
      "Verify device is correctly identified as Air Bag Inflator, Air Bag Module, or Seat-Belt Pretensioner",
    afmanRef: "AFMAN 24-604 A13.15",
  },
  {
    id: "dot-approval-verification",
    label: "DOT approval per 49 CFR 173.166",
    description:
      "Verify device is approved by DOT according to 49 CFR Section 173.166 for Class 9 safety devices",
    afmanRef: "AFMAN 24-604 A13.15",
  },
  {
    id: "un-series-6c-test-compliance",
    label: "UN Series 6(c) test compliance verified (Special Provision 160)",
    description:
      "Device must have passed UN Series 6(c) test per DOT Special Provision 160: no explosion of device, no fragmentation of device casing or pressure vessel, no projection hazard, and no thermal effect that would significantly hinder fire-fighting or emergency response efforts",
    afmanRef: "DOT Special Provision 160 / AFMAN 24-604 A13.15",
  },
  {
    id: "quantity-verification",
    label: "Quantity matches documentation",
    description:
      "Verify the number of safety device articles matches the shipping documentation",
    afmanRef: "AFMAN 24-604 A13.15",
  },
];

export default function InspectorSafetyDevicesScreen({
  navigation,
}: InspectorSafetyDevicesScreenProps) {
  const { inspection, addPackageFrustration, removePackageFrustration } =
    useInspectionForm();
  const { actions } = useHazProStore();

  const [currentStep, setCurrentStep] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [additionalComments, setAdditionalComments] = useState("");

  const currentCondition = SAFETY_DEVICE_INSPECTION_CONDITIONS[currentStep];
  const totalSteps = SAFETY_DEVICE_INSPECTION_CONDITIONS.length;

  // Get current UN ID for verification
  const unId =
    inspection?.verificationCopy?.unIdNo ||
    inspection?.extractedContent?.unIdNo;
  const properShippingName =
    inspection?.verificationCopy?.properShippingName ||
    inspection?.extractedContent?.properShippingName;

  // Get existing package frustrations for safety devices
  const existingFrustrations =
    inspection?.packageFrustrations?.filter(
      f => f.category === "safety-device"
    ) || [];
  const frustratedCount = existingFrustrations.length;
  const validatedCount = totalSteps - frustratedCount;

  const currentFrustration = existingFrustrations.find(
    f => f.itemId === currentCondition?.id
  );

  console.log("🛡️ [InspectorSafetyDevices] Component rendered");
  console.log("🛡️ [InspectorSafetyDevices] UN ID:", unId);
  console.log("🛡️ [InspectorSafetyDevices] Current step:", currentStep);
  console.log(
    "🛡️ [InspectorSafetyDevices] Existing frustrations:",
    existingFrustrations.length
  );

  // Default frustration message
  const DEFAULT_FRUSTRATION_MESSAGE =
    "This safety device inspection condition is not met. Requires re-inspection per AFMAN 24-604 A13.15.";

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
      category: "safety-device" as const,
      itemId: currentCondition.id,
      itemLabel: currentCondition.label,
      expectedValues: ["Pass"],
      verificationStatus: "incorrect" as const,
      defaultMessage: DEFAULT_FRUSTRATION_MESSAGE,
      additionalComments: additionalComments.trim() || undefined,
      afmanReference: currentCondition.afmanRef,
    };

    console.log(
      "💾 [InspectorSafetyDevices] Saving frustration for condition:",
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
    console.log("🚨 [InspectorSafetyDevices] handleFinalSubmit called");

    const currentFrustrations =
      inspection?.packageFrustrations?.filter(
        f => f.category === "safety-device"
      ) || [];
    const currentFrustratedCount = currentFrustrations.length;

    console.log(
      "🚨 [InspectorSafetyDevices] frustratedCount:",
      currentFrustratedCount
    );

    if (currentFrustratedCount === 0) {
      // No frustrations - proceed to package frustration summary
      Alert.alert(
        "UN3268 Safety Devices Inspection Complete",
        "All conditions have been validated successfully.\n\nNo compliance issues were found. Proceeding to package summary.",
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

  // Verify this is UN3268
  if (unId !== "UN3268") {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Invalid material type for safety device inspection
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
        <ScreenHeader
          title="UN3268 Safety Devices"
          onBack={() => navigation.goBack()}
          rightContent={
            <Text style={styles.stepIndicator}>
              {currentStep + 1}/{totalSteps}
            </Text>
          }
        />

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
          <Text style={styles.progressText}>
            Validated: {validatedCount} | Frustrated: {frustratedCount}
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
                    </View>

                    <Text style={styles.descriptionLabel}>
                      Inspection Requirement:
                    </Text>
                    <View style={styles.previewContainer}>
                      <Text style={styles.previewText}>
                        {currentCondition.description}
                      </Text>
                    </View>

                    {/* AFMAN Reference */}
                    <View style={styles.afmanReference}>
                      <MaterialIcons name="book" size={16} color={colors.primary} />
                      <Text style={styles.afmanReferenceText}>
                        {currentCondition.afmanRef}
                      </Text>
                    </View>

                    {currentFrustration && (
                      <InfoBox
                        variant="error"
                        message="Previously Frustrated"
                      />
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
                        color={colors.surface}
                      />
                      <Text style={styles.validateButtonText}>Validate</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.frustrateButton}
                      onPress={handleFrustrate}
                    >
                      <MaterialIcons name="cancel" size={24} color={colors.surface} />
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
                      <MaterialIcons name="error" size={24} color={colors.error} />
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
                      <MaterialIcons name="save" size={20} color={colors.surface} />
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
                color={currentStep === 0 ? "#C7C7CC" : colors.primary}
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
    backgroundColor: colors.background,
  },
  stepIndicator: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.primary,
  },
  progressBarContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
  },
  progressBarBackground: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: spacing.sm,
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
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  fieldCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    ...shadows.medium,
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
    marginBottom: spacing.lg,
  },
  fieldLabel: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.textPrimary,
    flex: 1,
  },
  descriptionLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  previewContainer: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    minHeight: 60,
  },
  previewText: {
    fontSize: 16,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  afmanReference: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.infoLight,
    padding: 10,
    borderRadius: 6,
    marginBottom: spacing.lg,
  },
  afmanReferenceText: {
    marginLeft: 6,
    fontSize: 13,
    color: colors.primary,
    fontWeight: "500",
  },
  complianceButtons: {
    flexDirection: "row",
    gap: spacing.md,
  },
  validateButton: {
    flex: 1,
    backgroundColor: colors.success,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    ...shadows.light,
  },
  validateButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: spacing.sm,
  },
  frustrateButton: {
    flex: 1,
    backgroundColor: colors.error,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    ...shadows.light,
  },
  frustrateButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: spacing.sm,
  },
  frustrationLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  defaultMessageContainer: {
    backgroundColor: colors.errorLight,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.error,
  },
  defaultMessageLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.error,
    marginBottom: spacing.xs,
  },
  defaultMessage: {
    fontSize: 16,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  commentsLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  inputContainer: {
    borderWidth: 2,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
    borderColor: colors.error,
  },
  textInput: {
    padding: spacing.lg,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: "top",
  },
  editModeButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.textSecondary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: "center",
  },
  cancelButtonText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    flex: 1,
    backgroundColor: colors.error,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  saveButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: spacing.xs,
  },
  footer: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 16,
    color: colors.primary,
    marginLeft: spacing.xs,
  },
  navButtonTextDisabled: {
    color: "#C7C7CC",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  errorText: {
    fontSize: 18,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  backButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxl,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
  },
  backButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: "600",
  },
});
