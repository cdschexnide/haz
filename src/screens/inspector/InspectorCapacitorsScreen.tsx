import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
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

interface InspectorCapacitorsScreenProps {
  navigation: any;
}

export interface CapacitorInspectionField {
  key: string;
  label: string;
  description: string;
  afmanReference: string;
  isRequired: boolean;
  validationCriteria: string[];
}

// NOTE: Energy Storage Capacity marking (A13.19.1.5) is handled in InspectorPackageVerification
// as part of the UN3508 package markings requirements
const CAPACITOR_INSPECTION_FIELDS: CapacitorInspectionField[] = [
  {
    key: "installationStatus",
    label: "INSTALLATION STATUS VERIFICATION (A13.19.1.1)",
    description:
      "Verify if capacitor is installed in equipment or shipped separately",
    afmanReference: "AFMAN 24-604 A13.19.1.1",
    isRequired: true,
    validationCriteria: [
      "Capacitor properly installed in equipment OR",
      "Separate capacitor is in uncharged state",
    ],
  },
  {
    key: "shortCircuitProtection",
    label: "SHORT-CIRCUIT PROTECTION METHOD (A13.19.1.2)",
    description:
      "Verify appropriate protection based on energy storage capacity",
    afmanReference: "AFMAN 24-604 A13.19.1.2",
    isRequired: true,
    validationCriteria: [
      "≤10 Wh: Protected against short circuit OR metal strap",
      ">10 Wh: Metal strap connecting terminals required",
    ],
  },
  {
    key: "pressureDesignCompliance",
    label: "PRESSURE DESIGN SPECIFICATIONS (A13.19.1.3)",
    description: "Verify design withstands required pressure differential",
    afmanReference: "AFMAN 24-604 A13.19.1.3",
    isRequired: true,
    validationCriteria: [
      "Designed to withstand 95 kPa (0.95 bar, 14 psi) pressure differential",
      "Design certification or documentation available",
    ],
  },
  {
    key: "pressureReliefSystem",
    label: "PRESSURE RELIEF SYSTEM (A13.19.1.4)",
    description: "Verify safe pressure relief through vent or weak point",
    afmanReference: "AFMAN 24-604 A13.19.1.4",
    isRequired: true,
    validationCriteria: [
      "Pressure relief through vent or weak point",
      "Liquid containment by packaging or equipment",
    ],
  },
  {
    key: "outerPackaging",
    label: "OUTER PACKAGING COMPLIANCE (A13.19.2)",
    description: "Verify strong outer packaging with secure cushioning",
    afmanReference: "AFMAN 24-604 A13.19.2",
    isRequired: true,
    validationCriteria: [
      "Strong outer packaging present",
      "Capacitor securely cushioned",
      "Packaging prevents movement during transport",
    ],
  },
  {
    key: "electrolyteClassification",
    label: "ELECTROLYTE HAZARD CLASSIFICATION (A13.19.3-A13.19.6)",
    description:
      "Verify electrolyte classification and compliance requirements",
    afmanReference: "AFMAN 24-604 A13.19.3-A13.19.6",
    isRequired: true,
    validationCriteria: [
      "Non-hazardous electrolyte confirmed OR",
      "Hazardous electrolyte with proper certifications",
      "≤10 Wh with hazardous electrolyte: 1.2m drop test certification",
    ],
  },
];

const DEFAULT_FRUSTRATION_MESSAGE =
  "This aspect of the UN3508 capacitor inspection is non-compliant. Requires re-inspection";

export default function InspectorCapacitorsScreen({
  navigation,
}: InspectorCapacitorsScreenProps) {
  const {
    inspection,
    addPackageFrustration,
    removePackageFrustration,
    setCurrentSDDGStep,
    setCurrentSDDGScreen,
    completeSDDGSubstep,
  } = useInspectionForm();
  const { actions } = useHazProStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [additionalComments, setAdditionalComments] = useState("");

  // Get capacitor data and frustrations from store
  const capacitorFrustrations =
    inspection?.packageFrustrations?.filter(f => f.category === "capacitor") ||
    [];
  const frustratedCount = capacitorFrustrations.length;

  const currentField = CAPACITOR_INSPECTION_FIELDS[currentStep];
  const totalSteps = CAPACITOR_INSPECTION_FIELDS.length;
  const currentFrustration = capacitorFrustrations.find(
    f => f.id === currentField?.key
  );

  // Set active chevron when component mounts
  useEffect(() => {
    actions.setCurrentChevron("package");
  }, []);

  useEffect(() => {
    // Update workflow step when component mounts
    setCurrentSDDGStep("capacitor-inspection");
    setCurrentSDDGScreen("InspectorCapacitorsScreen");
  }, [setCurrentSDDGStep, setCurrentSDDGScreen]);

  useEffect(() => {
    // Reset edit mode when changing steps
    setIsEditMode(false);
    setAdditionalComments("");
  }, [currentStep]);

  const handleValidate = () => {
    // Remove any existing frustration for this field using the key
    // Note: The removePackageFrustration expects itemId, but capacitor frustrations use 'key' field
    // We need to find the frustration id that matches this field's key
    const existingFrustration = capacitorFrustrations.find(
      f => f.id === currentField.key
    );
    if (existingFrustration?.id) {
      removePackageFrustration(existingFrustration.id);
    }

    // Move to next step or complete
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
    // Remove existing frustration for this field first
    const existingFrustration = capacitorFrustrations.find(
      f => f.id === currentField.key
    );
    if (existingFrustration?.id) {
      removePackageFrustration(existingFrustration.id);
    }

    // Add new frustration using the context function
    const frustrationData = {
      category: "capacitor" as const,
      itemId: currentField.key,
      itemLabel: currentField.label,
      expectedValues: currentField.validationCriteria,
      verificationStatus: "incorrect" as const,
      defaultMessage: DEFAULT_FRUSTRATION_MESSAGE,
      additionalComments: additionalComments.trim() || undefined,
      afmanReference: currentField.afmanReference,
      // Note: addPackageFrustration will add id, frustrationDate, and inspector automatically
    };

    addPackageFrustration(frustrationData);

    // Move to next step or complete
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
    const finalFrustratedCount =
      inspection?.packageFrustrations?.filter(f => f.category === "capacitor")
        .length || 0;

    if (finalFrustratedCount === 0) {
      // No frustrations - proceed to package markings verification
      Alert.alert(
        "UN3508 Capacitor Inspection Complete",
        "All inspection criteria have been validated successfully.\n\nNo compliance issues were found. Proceeding to package markings verification.\n\nPackage markings for UN3508 will include:\n• PSN and UN Number\n• Military Shipping Label (MSL) or DD Form 1387\n• Energy Storage Capacity (for capacitors manufactured after December 31, 2015)",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Continue to Package Markings",
            style: "default",
            onPress: () => {
              completeSDDGSubstep("InspectorCapacitorsScreen");
              navigation.navigate("InspectorPackageVerification");
            },
          },
        ]
      );
    } else {
      // Has frustrations - proceed to package markings with frustrations
      Alert.alert(
        "UN3508 Capacitor Inspection Complete with Frustrations",
        `${finalFrustratedCount} inspection ${
          finalFrustratedCount === 1 ? "item has" : "items have"
        } been frustrated.\n\nProceeding to package markings verification.\n\nPackage markings for UN3508 will include:\n• PSN and UN Number\n• Military Shipping Label (MSL) or DD Form 1387\n• Energy Storage Capacity (for capacitors manufactured after December 31, 2015)`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Continue to Package Markings",
            style: "default",
            onPress: () => {
              completeSDDGSubstep("InspectorCapacitorsScreen");
              navigation.navigate("InspectorPackageVerification");
            },
          },
        ]
      );
    }
  };

  if (!currentField) {
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
        style={styles.keyboardContainer}
      >
        <ScreenHeader
          title="UN3508 Capacitors"
          onBack={() => navigation.goBack()}
          rightContent={
            <Text style={styles.stepIndicator}>
              {currentStep + 1}/{totalSteps}
            </Text>
          }
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.content}>
            {!isEditMode ? (
              /* Normal Validation Mode */
              <>
                <View style={styles.fieldContent}>
                  <View style={styles.fieldHeader}>
                    <Text style={styles.fieldLabel}>{currentField.label}</Text>
                    {currentFrustration && (
                      <MaterialIcons name="error" size={24} color={colors.error} />
                    )}
                  </View>

                  <Text style={styles.fieldDescription}>
                    {currentField.description}
                  </Text>

                  <Text style={styles.scannedValueLabel}>
                    Validation Criteria:
                  </Text>
                  <View style={styles.scannedValueContainer}>
                    {currentField.validationCriteria.map((criteria, index) => (
                      <Text key={index} style={styles.criteriaText}>
                        • {criteria}
                      </Text>
                    ))}
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
                    <Text style={styles.fieldLabel}>{currentField.label}</Text>
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
                    style={styles.saveFrustrationButton}
                    onPress={handleSaveFrustration}
                  >
                    <MaterialIcons name="save" size={20} color={colors.surface} />
                    <Text style={styles.saveFrustrationButtonText}>
                      Save Frustration
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </ScrollView>

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
    backgroundColor: colors.borderLight,
  },
  keyboardContainer: {
    flex: 1,
  },
  stepIndicator: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.lg,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
  },
  fieldContent: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    ...shadows.light,
  },
  fieldHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.md,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
    flex: 1,
    marginRight: spacing.sm,
  },
  fieldDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  scannedValueLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  scannedValueContainer: {
    backgroundColor: colors.borderLight,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    minHeight: 60,
  },
  criteriaText: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 18,
    marginBottom: spacing.xs,
  },
  complianceButtons: {
    flexDirection: "row",
    gap: spacing.md,
  },
  validateButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.success,
    borderRadius: borderRadius.md,
    paddingVertical: 14,
    gap: spacing.sm,
  },
  validateButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: "600",
  },
  frustrateButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.error,
    borderRadius: borderRadius.md,
    paddingVertical: 14,
    gap: spacing.sm,
  },
  frustrateButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: "600",
  },
  frustrationLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  defaultMessageContainer: {
    backgroundColor: colors.errorLight,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
  },
  defaultMessageLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.error,
    marginBottom: spacing.xs,
  },
  defaultMessage: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 18,
  },
  commentsLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  inputContainer: {
    backgroundColor: colors.borderLight,
    borderRadius: borderRadius.md,
    padding: 1,
  },
  textInput: {
    backgroundColor: colors.surface,
    borderRadius: 7,
    padding: spacing.md,
    fontSize: 16,
    color: colors.textPrimary,
    minHeight: 100,
    borderWidth: 1,
    borderColor: colors.border,
  },
  editModeButtons: {
    flexDirection: "row",
    gap: spacing.md,
  },
  cancelButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.textSecondary,
    borderRadius: borderRadius.md,
    paddingVertical: 14,
  },
  cancelButtonText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: "600",
  },
  saveFrustrationButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.error,
    borderRadius: borderRadius.md,
    paddingVertical: 14,
    gap: spacing.sm,
  },
  saveFrustrationButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: "600",
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
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  backButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    flexDirection: "row",
    justifyContent: "flex-start",
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
});
