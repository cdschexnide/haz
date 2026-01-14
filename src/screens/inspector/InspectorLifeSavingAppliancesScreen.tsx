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
import { useHazProStore } from "../../../src/stores/useHazProStore";
import { PackageFrustrationRecord } from "../../../src/types/sddg";
import {
  ScreenHeader,
  InfoBox,
  colors,
  spacing,
  borderRadius,
  shadows,
} from "../ui";

interface InspectorLifeSavingAppliancesScreenProps {
  navigation: any;
}

// AFMAN 24-604 A13.12 Life-Saving Appliances Inspection Conditions
const LIFE_SAVING_INSPECTION_CONDITIONS = [
  {
    id: "storage-handling-compliance",
    label: "Storage and handling compliance",
    description:
      "Verify materials are stored in cool, well-ventilated areas away from fire hazards and sources of heat or ignition. Verify no rough handling or dropping has occurred.",
    afmanRef: "AFMAN 24-604 A13.12.1",
  },
  {
    id: "outer-container-integrity",
    label: "Outer container integrity",
    description:
      "Verify weather-resistant fiberboard or other securely closed strong outer container is used and in good condition.",
    afmanRef: "AFMAN 24-604 A13.12.2.1",
  },
  {
    id: "inner-packaging-adequacy",
    label: "Inner packaging adequacy",
    description:
      "Verify hazardous materials contained in the kit are packed in inner packaging that is adequate to prevent accidental activation.",
    afmanRef: "AFMAN 24-604 A13.12.2.1",
  },
  {
    id: "cushioning-adequacy",
    label: "Cushioning adequacy",
    description:
      "Verify inner packagings are suitably cushioned to prevent movement during transport.",
    afmanRef: "AFMAN 24-604 A13.12.2.1",
  },
  {
    id: "component-documentation",
    label: "Component documentation",
    description:
      "Verify all hazardous components contained within the life-saving appliance are properly documented and accounted for.",
    afmanRef: "AFMAN 24-604 A13.12",
  },
  {
    id: "packaging-standard-compliance",
    label: "General packaging requirements compliance",
    description:
      "Verify packagings meet the general requirements of A3.1. UN specification packaging is not required for life-saving appliances.",
    afmanRef: "AFMAN 24-604 A13.12.2.1",
  },
];

export default function InspectorLifeSavingAppliancesScreen({
  navigation,
}: InspectorLifeSavingAppliancesScreenProps) {
  const { state, actions } = useHazProStore();
  const sddgInspectionContext = state.sddgInspectionContext;

  const [currentStep, setCurrentStep] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [additionalComments, setAdditionalComments] = useState("");

  const currentCondition = LIFE_SAVING_INSPECTION_CONDITIONS[currentStep];
  const totalSteps = LIFE_SAVING_INSPECTION_CONDITIONS.length;

  // Get current UN ID for verification
  const unId =
    sddgInspectionContext?.verificationCopy?.unIdNo ||
    sddgInspectionContext?.extractedContent?.unIdNo;
  const properShippingName =
    sddgInspectionContext?.verificationCopy?.properShippingName ||
    sddgInspectionContext?.extractedContent?.properShippingName;

  // Get existing package frustrations for life-saving appliances
  const existingFrustrations =
    state.sddgInspectionContext?.packageFrustrations?.filter(
      f => f.category === "life-saving"
    ) || [];
  const frustratedCount = existingFrustrations.length;
  const validatedCount = totalSteps - frustratedCount;

  const currentFrustration = existingFrustrations.find(
    f => f.itemId === currentCondition?.id
  );

  console.log("🛟 [InspectorLifeSavingAppliances] Component rendered");
  console.log("🛟 [InspectorLifeSavingAppliances] UN ID:", unId);
  console.log("🛟 [InspectorLifeSavingAppliances] Current step:", currentStep);
  console.log(
    "🛟 [InspectorLifeSavingAppliances] Existing frustrations:",
    existingFrustrations.length
  );

  // Default frustration message
  const DEFAULT_FRUSTRATION_MESSAGE =
    "This life-saving appliance inspection condition is not met. Requires re-inspection per AFMAN 24-604 A13.12.";

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
    actions.removePackageFrustration(currentCondition.id);

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
    const frustrationData: PackageFrustrationRecord = {
      id: currentCondition.id,
      category: "life-saving",
      itemId: currentCondition.id,
      itemLabel: currentCondition.label,
      expectedValues: ["Pass"],
      verificationStatus: "incorrect",
      frustrationDate: new Date(),
      defaultMessage: DEFAULT_FRUSTRATION_MESSAGE,
      additionalComments: additionalComments.trim() || undefined,
      inspector: sddgInspectionContext?.inspector,
      afmanReference: currentCondition.afmanRef,
    };

    console.log(
      "💾 [InspectorLifeSavingAppliances] Saving frustration for condition:",
      currentCondition.id
    );
    actions.addPackageFrustration(frustrationData);

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
    console.log("🚨 [InspectorLifeSavingAppliances] handleFinalSubmit called");

    const currentFrustrations =
      state.sddgInspectionContext?.packageFrustrations?.filter(
        f => f.category === "life-saving"
      ) || [];
    const currentFrustratedCount = currentFrustrations.length;

    console.log(
      "🚨 [InspectorLifeSavingAppliances] frustratedCount:",
      currentFrustratedCount
    );

    const materialType =
      unId === "UN3072"
        ? "UN3072 Life-Saving Appliances (Not Self-Inflating)"
        : "UN2990 Life-Saving Appliances (Self-Inflating)";

    if (currentFrustratedCount === 0) {
      // No frustrations - proceed to package frustration summary
      Alert.alert(
        `${materialType} Inspection Complete`,
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

  // Verify this is UN3072 or UN2990
  if (unId !== "UN3072" && unId !== "UN2990") {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Invalid material type for life-saving appliances inspection
          </Text>
          <Text style={styles.errorSubtext}>Expected: UN3072 or UN2990</Text>
          <Text style={styles.errorSubtext}>Found: {unId}</Text>
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

  if (!currentCondition || !sddgInspectionContext) {
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

  const materialType =
    unId === "UN3072"
      ? "Life-Saving Appliances (Not Self-Inflating)"
      : "Life-Saving Appliances (Self-Inflating)";

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScreenHeader
          title={`${unId} ${materialType}`}
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
                      <MaterialIcons
                        name="menu-book"
                        size={16}
                        color={colors.primary}
                      />
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
    marginBottom: 10,
    textAlign: "center",
  },
  errorSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 5,
    textAlign: "center",
  },
  backButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxl,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    marginTop: spacing.xl,
  },
  backButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: "600",
  },
});
