import React, { useState, useEffect, useMemo, useCallback } from "react";
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
import { useHazProStore } from "../../stores/useHazProStore";
import {
  getApplicableCriteria,
  determinePhysicalState,
  getA28DefaultFrustrationMessage,
  A28InspectionCriterion,
  PackagingType,
} from "../../data/attachment28InspectionCriteria";

interface InspectorAttachment28WizardScreenProps {
  navigation: any;
  route?: { params?: { continueRoute?: string; continueParams?: any } };
}

export default function InspectorAttachment28WizardScreen({
  navigation,
  route,
}: InspectorAttachment28WizardScreenProps) {
  const {
    inspection,
    workflow,
    addPackageFrustration,
    removePackageFrustration,
    resolvePackageFrustration,
    refrustratePackageFrustration,
  } = useInspectionForm();
  const { actions } = useHazProStore();

  const [currentStep, setCurrentStep] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [additionalComments, setAdditionalComments] = useState("");

  // Get packaging type from context
  const packagingType: PackagingType =
    inspection?.packagePackagingType || "combination";

  // Determine physical state from SDDG data
  const physicalState = useMemo(() => {
    const quantityAndPacking =
      inspection?.verificationCopy?.quantityAndPacking ||
      inspection?.extractedContent?.quantityAndPacking;
    const hazardClass =
      inspection?.verificationCopy?.hazardClass ||
      inspection?.extractedContent?.hazardClass;
    return determinePhysicalState(quantityAndPacking, hazardClass);
  }, [inspection]);

  // Get applicable criteria
  const criteria = useMemo(() => {
    return getApplicableCriteria(packagingType, physicalState);
  }, [packagingType, physicalState]);

  const currentCriterion: A28InspectionCriterion | undefined =
    criteria[currentStep];
  const totalSteps = criteria.length;

  // Get existing package frustrations for packaging category
  const existingFrustrations =
    inspection?.packageFrustrations?.filter((f) => f.category === "packaging") ||
    [];

  const currentFrustration = existingFrustrations.find(
    (f) => f.itemId === currentCriterion?.id
  );

  // Count validated vs frustrated
  const frustratedA28Ids = new Set(
    existingFrustrations
      .filter((f) => f.itemId.startsWith("a28-"))
      .map((f) => f.itemId)
  );
  const frustratedCount = criteria.filter((c) =>
    frustratedA28Ids.has(c.id)
  ).length;
  const validatedCount = currentStep - frustratedCount;

  // Set active chevron when component mounts
  useEffect(() => {
    actions.setCurrentChevron("package");
  }, [actions]);

  // Reset edit mode when changing steps
  useEffect(() => {
    setIsEditMode(false);
    setAdditionalComments("");
  }, [currentStep]);

  useEffect(() => {
    if (workflow.reinspection.mode !== "package") {
      return;
    }

    const targetIds = new Set(workflow.reinspection.targetFrustrations);
    if (targetIds.size === 0) {
      return;
    }

    const firstTargetIndex = criteria.findIndex((criterion) =>
      targetIds.has(criterion.id)
    );

    if (firstTargetIndex >= 0 && firstTargetIndex !== currentStep) {
      setCurrentStep(firstTargetIndex);
    }
  }, [criteria, currentStep, workflow.reinspection.mode, workflow.reinspection.targetFrustrations]);

  const navigateToNext = useCallback(() => {
    if (workflow.reinspection.mode !== "package") {
      if (route?.params?.continueRoute) {
        navigation.navigate(route.params.continueRoute, route.params.continueParams);
        return;
      }
    }

    const hasPackageFrustrations = (inspection?.packageFrustrations?.length ?? 0) > 0;
    if (hasPackageFrustrations) {
      navigation.navigate("PackageFrustrationSummary");
    } else {
      navigation.navigate("PackageInspectionCompleteScreen");
    }
  }, [
    navigation,
    inspection?.packageFrustrations?.length,
    route?.params?.continueParams,
    route?.params?.continueRoute,
    workflow.reinspection.mode,
  ]);

  const handleValidate = useCallback(() => {
    if (!currentCriterion) return;

    const isReinspection = workflow.reinspection.mode === "package";

    // Handle reinspection mode
    if (isReinspection && currentFrustration) {
      resolvePackageFrustration(currentCriterion.id, inspection.inspector);
    } else if (currentFrustration) {
      removePackageFrustration(currentCriterion.id);
    }

    // Move to next step or complete
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinalSubmit();
    }
  }, [
    currentCriterion,
    currentFrustration,
    currentStep,
    totalSteps,
    workflow.reinspection.mode,
    inspection.inspector,
    resolvePackageFrustration,
    removePackageFrustration,
  ]);

  const handleFrustrate = useCallback(() => {
    setIsEditMode(true);
    setAdditionalComments(currentFrustration?.additionalComments || "");
  }, [currentFrustration]);

  const handleSaveFrustration = useCallback(() => {
    if (!currentCriterion) return;

    const isReinspection = workflow.reinspection.mode === "package";
    const defaultMessage = getA28DefaultFrustrationMessage(currentCriterion);

    if (isReinspection) {
      refrustratePackageFrustration(currentCriterion.id, inspection.inspector);
    } else {
      // Remove existing frustration first to avoid duplicates
      removePackageFrustration(currentCriterion.id);

      addPackageFrustration({
        category: "packaging",
        itemId: currentCriterion.id,
        itemLabel: currentCriterion.label,
        expectedValues: ["Pass"],
        verificationStatus: "incorrect",
        defaultMessage,
        additionalComments: additionalComments.trim() || undefined,
        afmanReference: currentCriterion.afmanRef,
        formField: currentCriterion.formField,
      });
    }

    setIsEditMode(false);

    // Move to next step or complete
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinalSubmit();
    }
  }, [
    currentCriterion,
    currentStep,
    totalSteps,
    additionalComments,
    workflow.reinspection.mode,
    inspection.inspector,
    addPackageFrustration,
    removePackageFrustration,
    refrustratePackageFrustration,
  ]);

  const handleCancelFrustration = useCallback(() => {
    setIsEditMode(false);
    setAdditionalComments("");
  }, []);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const handleFinalSubmit = useCallback(() => {
    const currentFrustrations =
      inspection?.packageFrustrations?.filter(
        (f) => f.category === "packaging" && f.itemId.startsWith("a28-")
      ) || [];

    if (currentFrustrations.length === 0 && frustratedCount === 0) {
      Alert.alert(
        "Packaging Inspection Complete",
        "All packaging criteria have been validated successfully.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Continue",
            style: "default",
            onPress: navigateToNext,
          },
        ]
      );
    } else {
      navigateToNext();
    }
  }, [inspection?.packageFrustrations, frustratedCount, navigateToNext]);

  // Empty state: No applicable criteria
  if (criteria.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="close" size={24} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Packaging Inspection</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.emptyContainer}>
          <MaterialIcons name="check-circle" size={64} color="#34C759" />
          <Text style={styles.emptyTitle}>No Additional Inspection Required</Text>
          <Text style={styles.emptySubtitle}>
            All applicable packaging criteria have been verified in previous
            screens.
          </Text>
          <Text style={styles.emptyDetail}>
            Packaging Type: {packagingType.charAt(0).toUpperCase() + packagingType.slice(1)}
            {"\n"}
            Physical State: {physicalState.charAt(0).toUpperCase() + physicalState.slice(1)}
          </Text>

          <TouchableOpacity style={styles.continueButton} onPress={navigateToNext}>
            <Text style={styles.continueButtonText}>Continue</Text>
            <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Error state: No current criterion
  if (!currentCriterion || !inspection) {
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

  const packagingTypeLabel =
    packagingType.charAt(0).toUpperCase() + packagingType.slice(1);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="close" size={24} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            Packaging Inspection ({packagingTypeLabel})
          </Text>
          <Text style={styles.stepIndicator}>
            {currentStep + 1}/{totalSteps}
          </Text>
        </View>

        {/* Progress Bar */}
        {/* <View style={styles.progressBarContainer}>
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
        </View> */}

        {/* Main Content */}
        <View style={styles.mainContent}>
          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.fieldCard}>
              {!isEditMode ? (
                /* Review Mode UI */
                <>
                  <View style={styles.fieldContent}>
                    <View style={styles.fieldHeader}>
                      <Text style={styles.fieldLabel}>
                        {currentCriterion.label}
                      </Text>
                    </View>

                    <Text style={styles.descriptionLabel}>
                      Inspection Requirement:
                    </Text>
                    <View style={styles.previewContainer}>
                      <Text style={styles.previewText}>
                        {currentCriterion.description}
                      </Text>
                    </View>

                    {/* <View style={styles.afmanReference}>
                      <MaterialIcons name="book" size={16} color="#007AFF" />
                      <Text style={styles.afmanReferenceText}>
                        {currentCriterion.afmanRef}
                      </Text>
                    </View> */}

                    {currentFrustration && (
                      <View style={styles.frustrationIndicator}>
                        <MaterialIcons name="error" size={20} color="#FF3B30" />
                        <Text style={styles.frustrationText}>
                          Frustrated
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
                    <View style={styles.fieldHeaderWithIcon}>
                      <Text style={styles.fieldLabel}>
                        {currentCriterion.label}
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
                        {getA28DefaultFrustrationMessage(currentCriterion)}
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
                      <Text style={styles.saveButtonText}>Save Frustration</Text>
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
    fontSize: 17,
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
    paddingVertical: 12,
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
  fieldHeaderWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    marginBottom: 16,
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1D1D1F",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 15,
    color: "#8E8E93",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 22,
  },
  emptyDetail: {
    fontSize: 13,
    color: "#8E8E93",
    textAlign: "center",
    marginBottom: 24,
  },
  continueButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
    gap: 8,
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1D1D1F",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    gap: 8,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
