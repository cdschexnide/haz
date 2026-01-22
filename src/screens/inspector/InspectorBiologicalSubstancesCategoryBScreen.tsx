import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
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

interface InspectorBiologicalSubstancesCategoryBScreenProps {
  navigation: any;
}

// AFMAN 24-604 A10.9 Biological Substances, Category B Inspection Conditions
const CATEGORY_B_CONDITIONS = [
  {
    id: "primary-secondary-outer-packaging",
    label: "Primary, secondary, and rigid outer packaging used",
    description:
      "Packaging consists of primary receptacle, secondary packaging, and rigid outer packaging.",
    afmanRef: "AFMAN 24-604 A10.9.1.1",
  },
  {
    id: "secondary-protection",
    label: "Secondary packaging prevents break/leak",
    description:
      "Primary receptacle is packed so it cannot break, be punctured, or leak into secondary packaging.",
    afmanRef: "AFMAN 24-604 A10.9.1.2",
  },
  {
    id: "cushioning",
    label: "Secondary packaging secured with cushioning",
    description:
      "Cushioning prevents leakage from impairing protective properties.",
    afmanRef: "AFMAN 24-604 A10.9.1.3",
  },
  {
    id: "drop-test",
    label: "Package passes drop test",
    description: "Package passes 49 CFR 178.603 drop test at 1.2 meters.",
    afmanRef: "AFMAN 24-604 A10.9.1.4",
  },
  {
    id: "marking-requirements",
    label: "Category B markings applied",
    description: "Outer packaging marked per A14.4.5.3 and A14.4.5.4.",
    afmanRef: "AFMAN 24-604 A10.9.1.5",
  },
  {
    id: "minimum-dimensions",
    label: "Minimum dimension met",
    description:
      "At least one surface is 100 mm x 100 mm (3.9 inches x 3.9 inches).",
    afmanRef: "AFMAN 24-604 A10.9.1.6",
  },
  {
    id: "liquid-primary-capacity",
    label: "Liquid primary receptacles <= 1 L (if applicable)",
    description:
      "Liquid primary receptacles do not exceed 1 L capacity.",
    afmanRef: "AFMAN 24-604 A10.9.2.1",
  },
  {
    id: "liquid-absorbent",
    label: "Absorbent material for liquids (if applicable)",
    description:
      "Absorbent material between primary and secondary packaging is sufficient.",
    afmanRef: "AFMAN 24-604 A10.9.2.2",
  },
  {
    id: "liquid-secondary-leakproof",
    label: "Secondary packaging leakproof for liquids (if applicable)",
    description: "Secondary packaging is leakproof for liquid specimens.",
    afmanRef: "AFMAN 24-604 A10.9.2.3",
  },
  {
    id: "liquid-pressure-temperature",
    label: "Liquid packaging pressure tolerance (if applicable)",
    description:
      "Primary receptacle or secondary packaging withstands ≥95 kPa from -40°C to +55°C.",
    afmanRef: "AFMAN 24-604 A10.9.2.4",
  },
  {
    id: "liquid-outer-quantity",
    label: "Liquid outer packaging <= 4 L (if applicable)",
    description:
      "Maximum quantity per outer package is 4 L (excluding ice/dry ice/liquid nitrogen).",
    afmanRef: "AFMAN 24-604 A10.9.2.5",
  },
  {
    id: "solid-siftproof-primary",
    label: "Solid primary receptacle siftproof (if applicable)",
    description:
      "Solid primary receptacle is siftproof and within weight limits.",
    afmanRef: "AFMAN 24-604 A10.9.3.1",
  },
  {
    id: "solid-siftproof-secondary",
    label: "Solid secondary packaging siftproof (if applicable)",
    description: "Secondary packaging is siftproof.",
    afmanRef: "AFMAN 24-604 A10.9.3.2",
  },
  {
    id: "solid-separation",
    label: "Solid primary receptacles separated (if applicable)",
    description:
      "Multiple primary receptacles are wrapped/separated to prevent contact.",
    afmanRef: "AFMAN 24-604 A10.9.3.3",
  },
  {
    id: "solid-outer-weight",
    label: "Solid outer packaging weight limits met (if applicable)",
    description:
      "Outer packaging <= 4 kg unless shipping body parts/organs.",
    afmanRef: "AFMAN 24-604 A10.9.3.4",
  },
  {
    id: "solid-residual-liquid",
    label: "Residual liquids handled (if applicable)",
    description:
      "If residual liquid is possible, use liquid packaging with absorbent material.",
    afmanRef: "AFMAN 24-604 A10.9.3.5",
  },
  {
    id: "refrigerated-frozen",
    label: "Refrigerated/frozen packaging handled (if applicable)",
    description:
      "Ice/dry ice outside secondary packaging; leakproof outer for ice or venting for dry ice.",
    afmanRef: "AFMAN 24-604 A10.9.4.1",
  },
  {
    id: "liquid-nitrogen",
    label: "Liquid nitrogen packaging handled (if applicable)",
    description:
      "Metal vacuum insulated vessels vented to atmosphere with orientation markings.",
    afmanRef: "AFMAN 24-604 A10.9.4.2",
  },
];

export default function InspectorBiologicalSubstancesCategoryBScreen({
  navigation,
}: InspectorBiologicalSubstancesCategoryBScreenProps) {
  const { inspection, addPackageFrustration, removePackageFrustration } =
    useInspectionForm();
  const { actions } = useHazProStore();

  const [currentStep, setCurrentStep] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [additionalComments, setAdditionalComments] = useState("");

  const currentCondition = CATEGORY_B_CONDITIONS[currentStep];
  const totalSteps = CATEGORY_B_CONDITIONS.length;

  const unId =
    inspection?.verificationCopy?.unIdNo ||
    inspection?.extractedContent?.unIdNo;

  const existingFrustrations =
    inspection?.packageFrustrations?.filter(
      f => f.category === "biological-category-b"
    ) || [];
  const frustratedCount = existingFrustrations.length;
  const validatedCount = totalSteps - frustratedCount;

  const currentFrustration = existingFrustrations.find(
    f => f.itemId === currentCondition?.id
  );

  const DEFAULT_FRUSTRATION_MESSAGE =
    "This Category B biological substances inspection condition is not met. Requires re-inspection per AFMAN 24-604 A10.9.";

  useEffect(() => {
    actions.setCurrentChevron("package");
  }, []);

  useEffect(() => {
    setIsEditMode(false);
    setAdditionalComments("");
  }, [currentStep]);

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
      category: "biological-category-b" as const,
      itemId: currentCondition.id,
      itemLabel: currentCondition.label,
      expectedValues: ["Pass"],
      verificationStatus: "incorrect" as const,
      defaultMessage: DEFAULT_FRUSTRATION_MESSAGE,
      additionalComments: additionalComments.trim() || undefined,
      afmanReference: currentCondition.afmanRef,
    };

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
    const currentFrustrations =
      inspection?.packageFrustrations?.filter(
        f => f.category === "biological-category-b"
      ) || [];

    if (currentFrustrations.length === 0) {
      Alert.alert(
        "Category B Inspection Complete",
        "All A10.9 conditions have been validated successfully.\n\nNo compliance issues were found. Proceeding to package summary.",
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

  if (unId !== "UN3373") {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Invalid material type for Category B inspection
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
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScreenHeader
          title="A10.9 Biological Substances"
          subtitle="Verify Category B packaging requirements."
          showBackButton
          onBack={() => navigation.goBack()}
        />
        <ScrollView contentContainerStyle={styles.content}>
          <InfoBox
            title="Inspection Progress"
            variant="info"
            message={`${validatedCount} of ${totalSteps} conditions validated`}
          />

          <View style={styles.conditionCard}>
            <View style={styles.conditionHeader}>
              <Text style={styles.conditionTitle}>
                {currentCondition.label}
              </Text>
              <Text style={styles.conditionRef}>{currentCondition.afmanRef}</Text>
            </View>
            <Text style={styles.conditionDescription}>
              {currentCondition.description}
            </Text>
          </View>

          {!isEditMode ? (
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.validateButton}
                onPress={handleValidate}
              >
                <MaterialIcons name="check-circle" size={20} color="#fff" />
                <Text style={styles.buttonText}>Validate</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.frustrateButton}
                onPress={handleFrustrate}
              >
                <MaterialIcons name="error" size={20} color="#fff" />
                <Text style={styles.buttonText}>Frustrate</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.frustrationForm}>
              <Text style={styles.frustrationLabel}>Add Comments</Text>
              <TextInput
                style={styles.textInput}
                multiline
                numberOfLines={4}
                value={additionalComments}
                onChangeText={setAdditionalComments}
                placeholder="Describe the issue..."
                placeholderTextColor={colors.textSecondary}
              />
              <View style={styles.frustrationActions}>
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
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={styles.navigationButtons}>
            <TouchableOpacity
              style={[
                styles.navButton,
                currentStep === 0 && styles.navButtonDisabled,
              ]}
              onPress={handleBack}
              disabled={currentStep === 0}
            >
              <MaterialIcons
                name="arrow-back"
                size={18}
                color={currentStep === 0 ? colors.textSecondary : colors.primary}
              />
              <Text
                style={[
                  styles.navButtonText,
                  currentStep === 0 && styles.navButtonTextDisabled,
                ]}
              >
                Previous
              </Text>
            </TouchableOpacity>
            <View style={styles.stepIndicator}>
              <Text style={styles.stepText}>
                {currentStep + 1} / {totalSteps}
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  conditionCard: {
    backgroundColor: colors.card,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.medium,
  },
  conditionHeader: {
    marginBottom: spacing.md,
  },
  conditionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  conditionRef: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  conditionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: "row",
    gap: spacing.md,
  },
  validateButton: {
    flex: 1,
    backgroundColor: colors.success,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  frustrateButton: {
    flex: 1,
    backgroundColor: colors.error,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  frustrationForm: {
    backgroundColor: colors.card,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.small,
  },
  frustrationLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.sm,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: 14,
    color: colors.text,
    textAlignVertical: "top",
    backgroundColor: colors.background,
  },
  frustrationActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: spacing.md,
    gap: spacing.md,
  },
  cancelButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    color: colors.textSecondary,
    fontWeight: "600",
  },
  saveButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  navigationButtons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    color: colors.primary,
    fontWeight: "600",
  },
  navButtonTextDisabled: {
    color: colors.textSecondary,
  },
  stepIndicator: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
  },
  stepText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  backButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
