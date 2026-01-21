import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useInspectionForm } from "../../contexts/InspectionFormProvider";
import {
  DryIceShipmentData,
  DryIceInspectionItem,
  VerificationStatus,
} from "../../types/dryIceInspection";
import {
  generateDryIceInspectionItems,
  getDefaultFrustrationMessage,
} from "../../utils/dryIceInspectionItems";
import { useHazProStore } from "../../stores/useHazProStore";
import {
  ScreenHeader,
  StepIndicator,
  InfoBox,
  colors,
  spacing,
  borderRadius,
  shadows,
} from "../../components/ui";

interface InspectorDryIceScreenProps {
  navigation: any;
  route?: {
    params?: {
      dryIceData?: DryIceShipmentData;
    };
  };
}

export default function InspectorDryIceScreen({
  navigation,
  route,
}: InspectorDryIceScreenProps) {
  const { inspection, addPackageFrustration, removePackageFrustration } =
    useInspectionForm();
  const { actions } = useHazProStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [additionalComments, setAdditionalComments] = useState("");

  // Get SDDG Key 16 quantity data for dry ice inspection
  const getSDDGQuantityPacking = (): string | undefined => {
    const verificationData = inspection?.verificationCopy;
    const extractedData = inspection?.extractedContent;

    // Try to get quantity and packing from verification data or extracted content
    const quantityPacking =
      verificationData?.quantityAndPacking || extractedData?.quantityAndPacking;

    return quantityPacking;
  };

  const inspectionItems = useMemo(() => {
    const sddgQuantityPacking = getSDDGQuantityPacking();
    return generateDryIceInspectionItems(sddgQuantityPacking);
  }, [inspection]);

  const [items, setItems] = useState<DryIceInspectionItem[]>(inspectionItems);

  const currentItem = items[currentStep];
  const totalSteps = items.length;

  // Get dry ice frustrations from context
  const packageFrustrations = inspection?.packageFrustrations || [];
  const dryIceFrustrations = packageFrustrations.filter(
    f => f.category === "dryice"
  );
  const currentFrustration = dryIceFrustrations.find(
    f => f.itemId === currentItem?.id
  );

  // Set active chevron when component mounts
  useEffect(() => {
    actions.setCurrentChevron("package");
  }, []);

  useEffect(() => {
    if (currentStep < totalSteps) {
      setIsEditMode(false);
      setAdditionalComments(currentFrustration?.additionalComments || "");
    }
  }, [currentStep, currentFrustration]);

  const handleValidate = () => {
    // Remove any existing frustration from context
    if (currentFrustration) {
      removePackageFrustration(currentItem.id);
    }

    // Update item status
    setItems(prev =>
      prev.map(item =>
        item.id === currentItem.id
          ? { ...item, verificationStatus: "pass" as VerificationStatus }
          : item
      )
    );

    // Move to next step or complete inspection
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Last step validated - navigate to package markings
      navigation.navigate("InspectorAttachment28WizardScreen");
    }
  };

  const handleFrustrate = () => {
    // Switch to edit mode to add comments
    setIsEditMode(true);
    setAdditionalComments(currentFrustration?.additionalComments || "");
  };

  const handleSaveFrustration = () => {
    // Create frustration data compatible with PackageFrustrationRecord
    const frustrationData = {
      category: "dryice" as const,
      itemId: currentItem.id,
      itemLabel: currentItem.label,
      expectedValues: [currentItem.description], // Use description as expected value
      verificationStatus: "incorrect" as const, // Dry ice failures are typically incorrect rather than missing
      defaultMessage: getDefaultFrustrationMessage(currentItem.id),
      additionalComments: additionalComments.trim() || undefined,
      afmanReference: currentItem.requirement,
    };

    console.log(
      "🧊 [DryIceScreen] Creating frustration for dry ice item:",
      currentItem.id
    );
    addPackageFrustration(frustrationData);

    // Update item status
    setItems(prev =>
      prev.map(item =>
        item.id === currentItem.id
          ? { ...item, verificationStatus: "fail" as VerificationStatus }
          : item
      )
    );

    setIsEditMode(false);

    // Move to next step or complete inspection
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Last step frustrated - navigate to package markings
      navigation.navigate("InspectorAttachment28WizardScreen");
    }
  };

  const handleCancelFrustration = () => {
    setIsEditMode(false);
  };

  // Map verification statuses to step statuses for StepIndicator
  const stepStatuses = items.map(item => {
    if (item.verificationStatus === "pass") return "pass" as const;
    if (item.verificationStatus === "fail") return "fail" as const;
    return "pending" as const;
  });

  if (!currentItem) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No inspection items available</Text>
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
      <ScreenHeader
        title="Dry Ice Inspection"
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        {!isEditMode ? (
          <>
            <View style={styles.fieldContent}>
              <View style={styles.fieldHeader}>
                <Text style={styles.fieldLabel}>{currentItem.label}</Text>
              </View>

              <Text style={styles.extractedLabel}>Description:</Text>
              <View style={styles.previewContainer}>
                <Text style={styles.previewText}>
                  {currentItem.description}
                </Text>
              </View>

              <Text style={styles.requirementText}>
                {currentItem.requirement}
              </Text>

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
                <MaterialIcons name="check-circle" size={24} color={colors.surface} />
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
              <View style={styles.fieldHeaderWithIcon}>
                <Text style={styles.fieldLabel}>{currentItem.label}</Text>
                <MaterialIcons name="error" size={24} color={colors.error} />
              </View>

              <Text style={styles.frustrationLabel}>Frustration Details:</Text>

              <View style={styles.defaultMessageContainer}>
                <Text style={styles.defaultMessageLabel}>Default Message:</Text>
                <Text style={styles.defaultMessage}>
                  {getDefaultFrustrationMessage(currentItem.id)}
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

            <View style={styles.editButtons}>
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
                <Text style={styles.saveButtonText}>Save Frustration</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.navButton,
            currentStep === 0 && styles.navButtonDisabled,
          ]}
          onPress={() => setCurrentStep(Math.max(0, currentStep - 1))}
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
            Previous
          </Text>
        </TouchableOpacity>

        <View style={styles.stepIndicatorContainer}>
          <Text style={styles.stepText}>
            {currentStep + 1} of {totalSteps}
          </Text>
          <StepIndicator
            totalSteps={totalSteps}
            currentStep={currentStep}
            stepStatuses={stepStatuses}
            showLabel={false}
          />
        </View>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => {
            if (currentStep < totalSteps - 1) {
              setCurrentStep(currentStep + 1);
            } else {
              // Navigate to package markings when manually completing
              navigation.navigate("InspectorAttachment28WizardScreen");
            }
          }}
        >
          <Text style={styles.navButtonText}>
            {currentStep < totalSteps - 1 ? "Next" : "Complete"}
          </Text>
          <MaterialIcons name="chevron-right" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  fieldContent: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.medium,
  },
  fieldHeader: {
    marginBottom: spacing.lg,
  },
  fieldHeaderWithIcon: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  fieldLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  extractedLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  previewContainer: {
    backgroundColor: colors.borderLight,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  previewText: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  requirementText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: "italic",
    marginBottom: spacing.lg,
  },
  complianceButtons: {
    flexDirection: "row",
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  validateButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.success,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
  },
  validateButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: spacing.sm,
  },
  frustrateButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.error,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
  },
  frustrateButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: spacing.sm,
  },
  frustrationLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.error,
    marginBottom: spacing.lg,
  },
  defaultMessageContainer: {
    backgroundColor: colors.borderLight,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  defaultMessageLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  defaultMessage: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  commentsLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: 14,
    minHeight: 100,
  },
  editButtons: {
    flexDirection: "row",
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  cancelButton: {
    flex: 1,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
  },
  cancelButtonText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    flex: 1,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    backgroundColor: colors.error,
    alignItems: "center",
  },
  saveButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: "500",
  },
  navButtonTextDisabled: {
    color: "#C7C7CC",
  },
  stepIndicatorContainer: {
    alignItems: "center",
  },
  stepText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
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
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  backButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: "600",
  },
});
