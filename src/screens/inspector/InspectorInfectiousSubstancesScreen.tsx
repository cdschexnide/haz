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

interface InspectorInfectiousSubstancesScreenProps {
  navigation: any;
}

// AFMAN 24-604 A10.8 Infectious Substances & GMOs Inspection Conditions
const INFECTIOUS_SUBSTANCES_CONDITIONS = [
  {
    id: "leakproof-primary-receptacle",
    label: "Leakproof primary receptacle verified",
    description: "Primary receptacle is leakproof and properly sealed.",
    afmanRef: "AFMAN 24-604 A10.8.2.1",
  },
  {
    id: "leakproof-secondary-packaging",
    label: "Leakproof secondary packaging verified",
    description: "Secondary packaging is leakproof and intact.",
    afmanRef: "AFMAN 24-604 A10.8.2.1",
  },
  {
    id: "absorbent-material-present",
    label: "Absorbent material between primary and secondary packaging",
    description:
      "Absorbent material is sufficient to absorb entire contents.",
    afmanRef: "AFMAN 24-604 A10.8.2.2",
  },
  {
    id: "multiple-receptacles-separated",
    label: "Multiple primary receptacles separated (if applicable)",
    description:
      "Multiple primary receptacles are separated to prevent contact.",
    afmanRef: "AFMAN 24-604 A10.8.2.2",
  },
  {
    id: "rigid-outer-packaging",
    label: "Rigid outer packaging used",
    description: "Inner packaging is placed in a rigid outer packaging.",
    afmanRef: "AFMAN 24-604 A10.8.2.3",
  },
  {
    id: "performance-test-compliance",
    label: "Package meets performance tests",
    description:
      "Package is capable of passing 49 CFR Section 178.609 tests.",
    afmanRef: "AFMAN 24-604 A10.8.2.4",
  },
  {
    id: "minimum-dimensions",
    label: "Minimum package dimensions met",
    description:
      "Smallest external dimension is at least 100 mm (3.9 inches).",
    afmanRef: "AFMAN 24-604 A10.8.2.5",
  },
  {
    id: "itemized-contents-list",
    label: "Itemized contents list included",
    description:
      "Itemized list enclosed between secondary and outer packaging.",
    afmanRef: "AFMAN 24-604 A10.8.2.6",
  },
  {
    id: "suspected-category-a-marking",
    label: "Suspected Category A marking added (if applicable)",
    description:
      'Use \"Suspected Category A Infectious Substance\" when required.',
    afmanRef: "AFMAN 24-604 A10.8.2.7",
  },
  {
    id: "pressure-temperature-tolerance",
    label: "Pressure/temperature tolerance verified",
    description:
      "Primary or secondary packaging withstands ≥95 kPa and -40°C to +55°C.",
    afmanRef: "AFMAN 24-604 A10.8.2.8",
  },
  {
    id: "select-agent-permits",
    label: "Select agent permits obtained (if applicable)",
    description:
      "Permits meet 42 CFR Part 73, 7 CFR Part 331, 9 CFR Part 121.",
    afmanRef: "AFMAN 24-604 A10.8.2.9",
  },
  {
    id: "transport-arrangements",
    label: "Advanced transport arrangements made",
    description:
      "Permits and transport arranged to prevent delivery delays.",
    afmanRef: "AFMAN 24-604 A10.8.2.10",
  },
  {
    id: "lyophilized-packaging",
    label: "Lyophilized packaging used (if applicable)",
    description:
      "Flame-sealed glass ampoules or rubber-stopped glass vials with metal seals.",
    afmanRef: "AFMAN 24-604 A10.8.3.1",
  },
  {
    id: "ambient-temp-packaging",
    label: "Ambient temperature packaging sealed (if applicable)",
    description:
      "Primary receptacles of glass/metal/plastic with positive leak-proof seal.",
    afmanRef: "AFMAN 24-604 A10.8.3.2",
  },
  {
    id: "refrigerated-packaging",
    label: "Refrigerated/frozen packaging handled (if applicable)",
    description:
      "Ice/dry ice outside secondary packaging with supports; leakproof outer for ice or venting for dry ice.",
    afmanRef: "AFMAN 24-604 A10.8.3.3",
  },
  {
    id: "liquid-nitrogen-packaging",
    label: "Liquid nitrogen packaging handled (if applicable)",
    description:
      "Metal vacuum insulated vessels vented to atmosphere; orientation markings applied.",
    afmanRef: "AFMAN 24-604 A10.8.3.4",
  },
];

export default function InspectorInfectiousSubstancesScreen({
  navigation,
}: InspectorInfectiousSubstancesScreenProps) {
  const { inspection, addPackageFrustration, removePackageFrustration } =
    useInspectionForm();
  const { actions } = useHazProStore();

  const [currentStep, setCurrentStep] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [additionalComments, setAdditionalComments] = useState("");

  const currentCondition = INFECTIOUS_SUBSTANCES_CONDITIONS[currentStep];
  const totalSteps = INFECTIOUS_SUBSTANCES_CONDITIONS.length;

  const unId =
    inspection?.verificationCopy?.unIdNo ||
    inspection?.extractedContent?.unIdNo;

  const existingFrustrations =
    inspection?.packageFrustrations?.filter(
      f => f.category === "infectious-substances"
    ) || [];
  const frustratedCount = existingFrustrations.length;
  const validatedCount = totalSteps - frustratedCount;

  const currentFrustration = existingFrustrations.find(
    f => f.itemId === currentCondition?.id
  );

  const DEFAULT_FRUSTRATION_MESSAGE =
    "This infectious substances inspection condition is not met. Requires re-inspection per AFMAN 24-604 A10.8.";

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
      category: "infectious-substances" as const,
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
        f => f.category === "infectious-substances"
      ) || [];

    if (currentFrustrations.length === 0) {
      Alert.alert(
        "Infectious Substances Inspection Complete",
        "All A10.8 conditions have been validated successfully.\n\nNo compliance issues were found. Proceeding to package summary.",
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

  if (unId !== "UN2814" && unId !== "UN2900" && unId !== "UN3245") {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Invalid material type for infectious substances inspection
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
          title="A10.8 Infectious Substances"
          subtitle="Verify infectious substances and GMO packaging requirements."
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
