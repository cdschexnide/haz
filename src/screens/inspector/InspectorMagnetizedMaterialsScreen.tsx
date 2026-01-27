import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useInspectionForm } from "../../contexts/InspectionFormProvider";
import { useHazProStore } from "../../stores/useHazProStore";
import {
  ScreenHeader,
  InfoBox,
  colors,
  spacing,
  borderRadius,
  shadows,
} from "../../components/ui";
import { navigateToPackageOutcome } from "../../utils/navigateToPackageOutcome";

interface InspectorMagnetizedMaterialsScreenProps {
  navigation: any;
}

// AFMAN 24-604 A13.11 Magnetized Material Inspection Conditions
const MAGNETIZED_INSPECTION_CONDITIONS = [
  {
    id: "handling-separation",
    label: "Handling separation from sensitive equipment",
    description:
      "Maintain 4.6 m (15 ft) separation from compass sensing devices or sensitive equipment during storage.",
    afmanRef: "AFMAN 24-604 A13.11",
  },
  {
    id: "field-strength",
    label: "Field strength within limits",
    description:
      "Verify shielding reduces field to 5.25 milligauss or less, or compass deviation is 2 degrees or less at 4.6 m; measure with operational meters (ideally two).",
    afmanRef: "AFMAN 24-604 A13.11",
  },
  {
    id: "blocking-bracing",
    label: "Blocking and bracing adequate",
    description:
      "Provide blocking and bracing to prevent movement; package magnetic tubes individually per MIL-E-75 when applicable.",
    afmanRef: "AFMAN 24-604 A13.11",
  },
  {
    id: "protective-distance",
    label: "Protective distance from container exterior",
    description:
      "Ensure protective distance between magnetic surface and container outside is at least 102 mm (4 inches).",
    afmanRef: "AFMAN 24-604 A13.11",
  },
  {
    id: "air-eligibility",
    label: "Air eligibility confirmed",
    description:
      "Materials with field strength over 0.00525 gauss at 4.6 m are forbidden for air movement; confirm eligibility.",
    afmanRef: "AFMAN 24-604 A13.11",
  },
];

export default function InspectorMagnetizedMaterialsScreen({
  navigation,
}: InspectorMagnetizedMaterialsScreenProps) {
  const { inspection, workflow, addPackageFrustration, removePackageFrustration } =
    useInspectionForm();
  const { actions } = useHazProStore();

  const [currentStep, setCurrentStep] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [additionalComments, setAdditionalComments] = useState("");

  const isReinspection = workflow.reinspection.mode === "package";
  const targetFrustrations = workflow.reinspection.targetFrustrations;
  const targetSet = useMemo(
    () => new Set(targetFrustrations),
    [targetFrustrations]
  );
  const filteredConditions = useMemo(
    () =>
      isReinspection
        ? MAGNETIZED_INSPECTION_CONDITIONS.filter(condition =>
            targetSet.has(condition.id)
          )
        : MAGNETIZED_INSPECTION_CONDITIONS,
    [isReinspection, targetSet]
  );

  const currentCondition = filteredConditions[currentStep];
  const totalSteps = filteredConditions.length;

  const unId =
    inspection?.verificationCopy?.unIdNo ||
    inspection?.extractedContent?.unIdNo;

  const existingFrustrations =
    inspection?.packageFrustrations?.filter(f => f.category === "magnetized") ||
    [];
  const relevantFrustrations = isReinspection
    ? existingFrustrations.filter(f => targetSet.has(f.itemId))
    : existingFrustrations;
  const frustratedCount = relevantFrustrations.length;
  const validatedCount = Math.max(totalSteps - frustratedCount, 0);

  const currentFrustration = relevantFrustrations.find(
    f => f.itemId === currentCondition?.id
  );

  const DEFAULT_FRUSTRATION_MESSAGE =
    "This magnetized material inspection condition is not met. Requires re-inspection per AFMAN 24-604 A13.11.";

  useEffect(() => {
    actions.setCurrentChevron("package");
  }, []);

  useEffect(() => {
    setIsEditMode(false);
    setAdditionalComments("");
  }, [currentStep]);

  useEffect(() => {
    if (currentStep > 0 && currentStep >= totalSteps) {
      setCurrentStep(0);
    }
  }, [currentStep, totalSteps]);

  const handleValidate = () => {
    removePackageFrustration(currentCondition.id);

    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinalSubmit();
    }
  };

  const handleFrustrate = () => {
    setIsEditMode(true);
    setAdditionalComments(currentFrustration?.additionalComments || "");
  };

  const handleSaveFrustration = () => {
    const frustrationData = {
      category: "magnetized" as const,
      itemId: currentCondition.id,
      itemLabel: currentCondition.label,
      expectedValues: ["Pass"],
      verificationStatus: "incorrect" as const,
      defaultMessage: DEFAULT_FRUSTRATION_MESSAGE,
      additionalComments: additionalComments.trim() || undefined,
      afmanReference: currentCondition.afmanRef,
    };

    console.log(
      "💾 [InspectorMagnetizedMaterials] Saving frustration for condition:",
      currentCondition.id
    );
    addPackageFrustration(frustrationData);

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

  const handleContinue = () => {
    navigation.navigate("InspectorSpecialProvisionsScreen", {
      continueRoute: "MLDetectionScreen",
      continueParams: { unIdNo: unId || "" },
    });
  };

  const handleFinalSubmit = () => {
    if (isReinspection) {
      const remainingFrustrations = (inspection?.packageFrustrations || [])
        .filter(f => targetSet.has(f.itemId));
      const hasMarkingOrLabelFrustrations = remainingFrustrations.some(
        f => f.category === "marking" || f.category === "label"
      );

      if (hasMarkingOrLabelFrustrations) {
        navigation.navigate("InspectorMarkingsLabelsValidationScreen");
        return;
      }

      if (remainingFrustrations.length > 0) {
        navigation.navigate("PackageFrustrationSummary");
        return;
      }

      navigation.navigate("PackageInspectionCompleteScreen");
      return;
    }

    const currentFrustrations =
      inspection?.packageFrustrations?.filter(f => f.category === "magnetized") ||
      [];

    if (currentFrustrations.length === 0) {
      Alert.alert(
        "UN2807 Magnetized Material Inspection Complete",
        "All A13.11 conditions have been validated successfully.\n\nNo compliance issues were found. Proceeding to package summary.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Continue",
            style: "default",
            onPress: handleContinue,
          },
        ]
      );
    } else {
      handleContinue();
    }
  };

  if (unId !== "UN2807") {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Invalid material type for magnetized material inspection
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

  if (isReinspection && totalSteps === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            No magnetized material items require reinspection.
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("PackageFrustrationSummary")}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>Back to Summary</Text>
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
          title="UN2807 Magnetized Material"
          onBack={() => navigation.goBack()}
          rightContent={
            <Text style={styles.stepIndicator}>
              {totalSteps === 0 ? 0 : currentStep + 1}/{totalSteps}
            </Text>
          }
        />

        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width:
                    totalSteps === 0
                      ? "0%"
                      : `${((currentStep + 1) / totalSteps) * 100}%`,
                },
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
            <View style={styles.fieldCard}>
              {!isEditMode ? (
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
                      <MaterialIcons
                        name="cancel"
                        size={24}
                        color={colors.surface}
                      />
                      <Text style={styles.frustrateButtonText}>Frustrate</Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.fieldContent}>
                    <View style={styles.fieldHeader}>
                      <Text style={styles.fieldLabel}>
                        {currentCondition.label}
                      </Text>
                      <MaterialIcons
                        name="error"
                        size={24}
                        color={colors.error}
                      />
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
                      <MaterialIcons
                        name="save"
                        size={20}
                        color={colors.surface}
                      />
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
    textAlign: "center",
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
