import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useInspectionForm } from "@/contexts/InspectionFormProvider";
import { SDDG_FIELD_DEFINITIONS } from "@/types/sddg";
import InspectorSDDGMiniPreview from "./Inspector/InspectorSDDGMiniPreview";
import InspectorSDDGModalView from "./Inspector/InspectorSDDGModalView";
import {
  transformExtractedContentToInspectorProps,
  hasValidExtractedContent,
} from "./Inspector/utils/transformExtractedData";
import { HazardousMaterialItem } from "@/hazardousMaterials/hazardousMaterialsList";
import {
  findHazMatByUnid,
  getRecommendedFrustration,
  validateSDDGInspection,
  validateDryIcePackaging,
  validateCapacitorWhRating,
  validateMagnetizedMaterialHandling,
  SDDGValidationResult,
} from "./Inspector/utils/sddgValidation";

interface SDDGComplianceValidationProps {
  navigation: any;
}

export default function SDDGComplianceValidation({
  navigation,
}: SDDGComplianceValidationProps) {
  const {
    inspection,
    workflow,
    inspectionId,
    setCurrentSDDGStep,
    setCurrentSDDGScreen,
    addFrustration,
    removeFrustration,
    updateVerificationField,
    completeSDDGSubstep,
    setSDDGComplete,
    completeInspection,
    saveCurrentInspection,
    completeSDDGAndMoveToPackage,
    completeReinspection,
    updateReinspectedInspection,
    startNewInspection,
  } = useInspectionForm();

  const [currentStep, setCurrentStep] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [correctValue, setCorrectValue] = useState("");
  const [additionalComments, setAdditionalComments] = useState("");
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [hazMatData, setHazMatData] = useState<HazardousMaterialItem | null>(
    null
  );
  const [recommendedFrustration, setRecommendedFrustration] = useState<
    string | null
  >(null);
  const [dryIcePackagingAnswer, setDryIcePackagingAnswer] = useState<
    "yes" | "no" | null
  >(null);
  const [editedValue, setEditedValue] = useState("");

  // Filter fields based on reinspection mode
  const getFieldsToInspect = () => {
    const reinspectionState = workflow.reinspection;
    if (
      reinspectionState.mode === "sddg" &&
      reinspectionState.targetFrustrations.length > 0
    ) {
      // In reinspection mode, only show frustrated fields
      return SDDG_FIELD_DEFINITIONS.filter(field =>
        reinspectionState.targetFrustrations.includes(field.key)
      );
    }
    // Normal mode, show all fields
    return SDDG_FIELD_DEFINITIONS;
  };

  const fieldsToInspect = getFieldsToInspect();
  const currentField = fieldsToInspect[currentStep];
  const totalSteps = fieldsToInspect.length;
  const isReinspectionMode = workflow.reinspection.mode === "sddg";

  // Access frustrations from inspection context
  const frustrations = inspection.frustrations || [];
  const frustratedCount = frustrations.length;

  // Use verificationCopy (the corrected data) instead of extractedContent
  const currentFieldValue =
    inspection?.verificationCopy && currentField
      ? inspection.verificationCopy[currentField.key]
      : "";

  const currentFrustration = frustrations.find(
    f => f.key === currentField?.key
  );

  const validatedCount = totalSteps - frustratedCount;

  // Update workflow step when component mounts
  useEffect(() => {
    setCurrentSDDGStep("compliance");
    setCurrentSDDGScreen("SDDGComplianceValidation");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(
    "🔍 [ComplianceValidation] Render - frustratedCount:",
    frustratedCount
  );
  console.log(
    "🔍 [ComplianceValidation] Render - frustrations count:",
    frustrations.length
  );

  // Transform verification copy for Inspector components - use try/catch for safety
  console.log(
    "🔍 [ComplianceValidation] Has verification data:",
    !!inspection?.verificationCopy
  );
  console.log("🔍 [ComplianceValidation] Frustration count:", frustratedCount);

  let transformedData = null;
  let hasValidData = false;

  try {
    if (inspection?.verificationCopy) {
      // Create a plain object from the data
      const plainVerificationCopy = { ...inspection.verificationCopy };
      transformedData = transformExtractedContentToInspectorProps(
        plainVerificationCopy
      );
      hasValidData = hasValidExtractedContent(plainVerificationCopy);
    }
  } catch (error) {
    console.error("Error transforming verification data:", error);
    transformedData = null;
    hasValidData = false;
  }

  console.log(
    "🔍 [ComplianceValidation] Has transformed data:",
    !!transformedData
  );

  // Helper functions using the unified validators from sddgValidation.ts
  const getUnid = (): string => {
    return (
      inspection?.verificationCopy?.unIdNo ||
      inspection?.extractedContent?.unIdNo ||
      ""
    );
  };

  const shouldShowDryIceWarning = (): boolean => {
    if (currentField?.key !== "quantityAndPacking") return false;
    const result = validateDryIcePackaging(getUnid(), currentFieldValue);
    return result !== null; // Returns warning result if invalid
  };

  const shouldShowCapacitorWhWarning = (): boolean => {
    if (currentField?.key !== "quantityAndPacking") return false;
    const result = validateCapacitorWhRating(getUnid(), currentFieldValue);
    return result !== null;
  };

  const shouldShowMagnetizedMaterialWarning = (): boolean => {
    if (currentField?.key !== "additionalHandlingInfo") return false;
    const result = validateMagnetizedMaterialHandling(getUnid(), currentFieldValue);
    return result !== null;
  };

  // Default frustration message
  const DEFAULT_FRUSTRATION_MESSAGE =
    "This key of the SDDG is incorrect. Requires re-inspection";

  // Look up hazmat data when UN ID is available
  useEffect(() => {
    const unId = inspection?.verificationCopy?.unIdNo;
    if (unId) {
      const material = findHazMatByUnid(unId);
      setHazMatData(material);
    }
  }, [inspection?.verificationCopy?.unIdNo]);

  // Calculate recommended frustration for current field
  useEffect(() => {
    if (currentField && inspection?.verificationCopy) {
      // In reinspection mode, use editedValue; otherwise use currentFieldValue
      const fieldValue = isReinspectionMode
        ? editedValue
        : inspection.verificationCopy[currentField.key] || "";

      const unid = getUnid();

      // Check for UN-specific validations using the utility functions
      if (currentField.key === "quantityAndPacking") {
        // Check UN3508 Capacitor Wh rating
        const capacitorResult = validateCapacitorWhRating(unid, fieldValue);
        if (capacitorResult) {
          setRecommendedFrustration(capacitorResult.recommendation || null);
          return;
        }

        // Check UN1845 Dry Ice packaging (note: this is handled separately with yes/no UI)
        // We don't set recommendation here as dry ice has its own UI flow
      }

      // Check for UN2807 magnetized material handling instructions
      if (currentField.key === "additionalHandlingInfo") {
        const magnetizedResult = validateMagnetizedMaterialHandling(unid, fieldValue);
        if (magnetizedResult) {
          setRecommendedFrustration(magnetizedResult.recommendation || null);
          return;
        }
      }

      // Standard hazmat-based recommendations
      if (hazMatData) {
        const recommendation = getRecommendedFrustration(
          currentField.key,
          hazMatData,
          fieldValue,
          {
            packagingType: inspection.packagePackagingType || null,
            quantityAndPacking: inspection.verificationCopy?.quantityAndPacking || null,
          }
        );
        setRecommendedFrustration(recommendation);
      } else {
        setRecommendedFrustration(null);
      }
    } else {
      setRecommendedFrustration(null);
    }
  }, [
    currentField,
    hazMatData,
    inspection?.verificationCopy,
    currentFieldValue,
    isReinspectionMode,
    editedValue,
  ]);

  useEffect(() => {
    // Reset edit mode and dry ice answer when changing steps
    setIsEditMode(false);
    setAdditionalComments("");
    setDryIcePackagingAnswer(null);
  }, [currentStep]);

  // Initialize editedValue when field changes (for reinspection mode)
  useEffect(() => {
    setEditedValue(currentFieldValue || "");
  }, [currentField, currentFieldValue]);

  // Handle automatic frustration when user answers "No" to dry ice packaging question
  useEffect(() => {
    if (shouldShowDryIceWarning() && dryIcePackagingAnswer === "no") {
      Alert.alert(
        "Frustration Required",
        "Since the packaging is not designed to permit CO2 release, this field must be frustrated per AFMAN24-604 A13.10.",
        [
          {
            text: "OK",
            onPress: () => {
              setIsEditMode(true);
              setAdditionalComments(
                "Packaging not designed to permit CO2 release per AFMAN24-604 A13.10"
              );
            },
          },
        ]
      );
    }
  }, [dryIcePackagingAnswer]);

  const handleValidate = () => {
    // Check for dry ice packaging restriction
    if (shouldShowDryIceWarning()) {
      if (dryIcePackagingAnswer !== "yes") {
        Alert.alert(
          "Answer Required",
          "Please answer the packaging question before validating.",
          [{ text: "OK" }]
        );
        return;
      }
    }

    // In reinspection mode, update the field value if changed
    if (isReinspectionMode && editedValue !== currentFieldValue) {
      updateVerificationField(currentField.key, editedValue);
    }

    // Remove any existing frustration for this field
    removeFrustration(currentField.key);

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

  const handleApplyRecommendation = () => {
    // Apply the recommended frustration
    setIsEditMode(true);
    setAdditionalComments(recommendedFrustration || "");
  };

  const handleSaveFrustration = () => {
    // In reinspection mode, update the field value if changed
    if (isReinspectionMode && editedValue !== currentFieldValue) {
      updateVerificationField(currentField.key, editedValue);
    }

    // Validate that correctValue is provided
    if (!correctValue.trim()) {
      Alert.alert(
        "Correct Value Required",
        "Please provide the correct value for this field before saving the frustration."
      );
      return;
    }

    // Save the frustration with the current/edited value
    const frustrationData = {
      key: currentField.key,
      fieldLabel: currentField.label,
      fieldValue: isReinspectionMode
        ? editedValue
        : currentFieldValue || "No data extracted",
      correctValue: correctValue.trim(),
      defaultMessage: DEFAULT_FRUSTRATION_MESSAGE,
      additionalComments: additionalComments.trim() || undefined,
    };

    console.log(
      "💾 [ComplianceValidation] Saving frustration for key:",
      currentField.key
    );
    addFrustration(frustrationData);

    // Move to next step
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinalSubmit();
    }
  };

  const handleCancelFrustration = () => {
    setIsEditMode(false);
    setCorrectValue("");
    setAdditionalComments("");
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinalSubmit = async () => {
    console.log("🚨 [ComplianceValidation] handleFinalSubmit called");
    console.log("🚨 [ComplianceValidation] frustratedCount:", frustratedCount);
    console.log(
      "🚨 [ComplianceValidation] frustrations count:",
      frustrations.length
    );
    console.log(
      "🚨 [ComplianceValidation] frustrations length:",
      frustratedCount
    );

    if (isReinspectionMode) {
      // Handle reinspection completion
      console.log(
        "🔄 [ComplianceValidation] Reinspection mode - updating inspection"
      );

      const finishReinspection = async (overrideId?: string) => {
        const result = await updateReinspectedInspection(overrideId);

        if (!result.success) {
          Alert.alert("Error", result.error || "Failed to save reinspection");
          return;
        }

        completeReinspection();

        if (result.allResolved) {
          Alert.alert(
            "Reinspection Complete",
            "All SDDG frustrations have been resolved. This inspection is now verified.",
            [
              {
                text: "OK",
                onPress: () => {
                  startNewInspection();
                  navigation.navigate("InspectorHomeScreen");
                },
              },
            ]
          );
        } else {
          console.log(
            "🔄 [ComplianceValidation] Some frustrations remain, showing summary"
          );
          navigation.navigate("SDDGFrustrationSummary");
        }
      };

      if (!inspectionId) {
        Alert.alert(
          "Complete Reinspection",
          "This inspection hasn't been saved yet. Do you want to save and complete the reinspection?",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Yes, Complete",
              onPress: () => {
                void (async () => {
                  try {
                    const newId = await saveCurrentInspection();
                    await finishReinspection(newId);
                  } catch (error) {
                    console.error(
                      "🔄 [ComplianceValidation] Failed to create and update inspection:",
                      error
                    );
                    Alert.alert(
                      "Error",
                      "Failed to save inspection. Please try again."
                    );
                  }
                })();
              },
            },
          ]
        );
        return;
      }

      await finishReinspection();
      return;
    }

    if (frustratedCount === 0) {
      // No frustrations - navigate to SDDG completion success screen
      completeSDDGSubstep("SDDGComplianceValidation");
      navigation.navigate("SDDGInspectionCompleteScreen");
    } else {
      // Mark compliance step as complete when navigating to frustration summary
      console.log(
        "🚨 [ComplianceValidation] About to show frustration summary"
      );
      console.log(
        "🚨 [ComplianceValidation] Frustrations count before actions:",
        frustrations.length
      );

      completeSDDGSubstep("SDDGComplianceValidation");
      setCurrentSDDGStep("frustration");
      setCurrentSDDGScreen("SDDGFrustrationSummary");

      console.log(
        "🚨 [ComplianceValidation] Frustrations count after actions:",
        frustrations.length
      );
      // Has frustrations - navigate to summary screen
      navigation.navigate("SDDGFrustrationSummary");
    }
  };

  if (!currentField || !inspection?.verificationCopy) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No verification data available</Text>
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
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>AFMAN24-604 Compliance</Text>
            {isReinspectionMode && (
              <Text style={styles.reinspectionIndicator}>
                REINSPECTION MODE
              </Text>
            )}
          </View>
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
            {/* Current Field */}
            <View style={styles.fieldCard}>
              {!isEditMode ? (
                /* Review Mode UI */
                <>
                  <View style={styles.fieldContent}>
                    <View style={styles.fieldHeader}>
                      <Text style={styles.fieldLabel}>
                        {currentField.label}
                      </Text>
                    </View>

                    {isReinspectionMode && currentFrustration ? (
                      /* Reinspection Mode - Show editable field */
                      <>
                        {/* Show original frustrated value for reference */}
                        <View style={styles.originalValueContainer}>
                          <Text style={styles.originalValueLabel}>
                            Original frustrated value:
                          </Text>
                          <Text style={styles.originalValue}>
                            {currentFrustration.fieldValue}
                          </Text>
                        </View>

                        {/* Editable field for corrected value */}
                        <View style={styles.editableFieldContainer}>
                          <Text style={styles.editableFieldLabel}>
                            Current Value (verify and update if corrected):
                          </Text>
                          <TextInput
                            style={styles.editInput}
                            value={editedValue}
                            onChangeText={setEditedValue}
                            placeholder="Enter corrected value from SDDG"
                            placeholderTextColor="#999"
                            autoCapitalize="none"
                            autoCorrect={false}
                            multiline={false}
                          />
                        </View>
                      </>
                    ) : (
                      /* Normal Mode - Show scanned value read-only */
                      <>
                        <Text style={styles.extractedLabel}>
                          Scanned Value:
                        </Text>
                        <View style={styles.previewContainer}>
                          <Text style={styles.previewText}>
                            {currentFieldValue || "No data extracted"}
                          </Text>
                        </View>
                      </>
                    )}

                    {/* Recommended Frustration */}
                    {recommendedFrustration && !currentFrustration && (
                      <View style={styles.recommendationContainer}>
                        <MaterialIcons
                          name="warning"
                          size={20}
                          color="#FF9500"
                        />
                        <View style={styles.recommendationContent}>
                          <Text style={styles.recommendationTitle}>
                            Recommended Frustration
                          </Text>
                          <Text style={styles.recommendationText}>
                            {recommendedFrustration}
                          </Text>
                          <TouchableOpacity onPress={handleApplyRecommendation}>
                            <Text style={styles.applyRecommendationButton}>
                              Apply Recommended Frustration
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}

                    {/* Conditional UI for QUANTITY AND TYPE OF PACKING field */}
                    {currentField.key === "quantityAndPacking" && (
                      <>
                        {shouldShowDryIceWarning() ? (
                          /* Dry Ice Packaging Warning for UN1845 */
                          <View style={styles.dryIceWarningContainer}>
                            <MaterialIcons
                              name="warning"
                              size={20}
                              color="#FF3B30"
                            />
                            <View style={styles.dryIceWarningContent}>
                              <Text style={styles.dryIceWarningTitle}>
                                Packaging Verification Required
                              </Text>
                              <Text style={styles.dryIceWarningText}>
                                The packaging type does not explicitly list
                                "Fiberboard box", "4G", or "Polystyrene foam
                                container".
                                {"\n\n"}
                                Is the packaging designed and constructed to
                                permit the release of carbon dioxide gas and to
                                prevent a build-up of pressure that could
                                rupture the packaging?
                              </Text>

                              <View style={styles.dryIceAnswerButtons}>
                                <TouchableOpacity
                                  style={[
                                    styles.answerButton,
                                    dryIcePackagingAnswer === "yes" &&
                                      styles.answerButtonSelected,
                                  ]}
                                  onPress={() =>
                                    setDryIcePackagingAnswer("yes")
                                  }
                                >
                                  <Text
                                    style={[
                                      styles.answerButtonText,
                                      dryIcePackagingAnswer === "yes" &&
                                        styles.answerButtonTextSelected,
                                    ]}
                                  >
                                    Yes
                                  </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                  style={[
                                    styles.answerButton,
                                    dryIcePackagingAnswer === "no" &&
                                      styles.answerButtonSelected,
                                  ]}
                                  onPress={() => setDryIcePackagingAnswer("no")}
                                >
                                  <Text
                                    style={[
                                      styles.answerButtonText,
                                      dryIcePackagingAnswer === "no" &&
                                        styles.answerButtonTextSelected,
                                    ]}
                                  >
                                    No
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          </View>
                        ) : shouldShowCapacitorWhWarning() ? (
                          /* UN3508 Capacitor Wh Rating Warning */
                          <View style={styles.dryIceWarningContainer}>
                            <MaterialIcons
                              name="warning"
                              size={20}
                              color="#FF3B30"
                            />
                            <View style={styles.dryIceWarningContent}>
                              <Text style={styles.dryIceWarningTitle}>
                                Energy Storage Capacity Required
                              </Text>
                              <Text style={styles.dryIceWarningText}>
                                UN3508 capacitors must specify energy storage
                                capacity in Watt-hours (Wh) in the quantity and
                                packing field.
                                {"\n\n"}
                                Examples: "2 pieces 1.5Wh", "1 capacitor 10 Wh",
                                "3x 25 watt-hours"
                                {"\n\n"}
                                No Wh rating detected in current field value.
                              </Text>
                            </View>
                          </View>
                        ) : (
                          /* Standard special note */
                          <View style={styles.specialNoteContainer}>
                            <MaterialIcons
                              name="info"
                              size={16}
                              color="#FF9500"
                            />
                            <Text style={styles.specialNoteText}>
                              HazPro validates UN POP lookups but may not
                              include all package name variations; inspectors
                              must use judgment to verify package type accuracy.
                            </Text>
                          </View>
                        )}
                      </>
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
                        {currentField.label}
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

                    <View style={styles.requiredFieldHeader}>
                      <Text style={styles.correctValueLabel}>
                        Correct Value:
                      </Text>
                      <View style={styles.requiredBadge}>
                        <Text style={styles.requiredBadgeText}>REQUIRED</Text>
                      </View>
                    </View>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={[styles.textInput, styles.correctValueInput]}
                        value={correctValue}
                        onChangeText={setCorrectValue}
                        placeholder="Enter the correct value for this field..."
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoFocus={true}
                      />
                    </View>
                    <Text style={styles.helperText}>
                      What should this field contain? This is the most important
                      information for re-inspection.
                    </Text>

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

          {/* Interactive Document Preview */}
          <View style={styles.staticDocumentPreview}>
            {hasValidData && transformedData && (
              <InspectorSDDGMiniPreview
                extractedData={transformedData}
                onPress={() => setShowDocumentModal(true)}
                currentValidationField={currentField.key}
              />
            )}
          </View>
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

            <TouchableOpacity
              style={styles.summaryButton}
              onPress={() => {
                const frustrationList = inspection.frustrations
                  .map(
                    f =>
                      `• ${f.fieldLabel}\n  ${f.defaultMessage}\n  ${
                        f.additionalComments
                          ? `Additional: ${f.additionalComments}`
                          : ""
                      }`
                  )
                  .join("\n\n");

                Alert.alert(
                  "Frustration Summary",
                  frustrationList || "No frustrations recorded",
                  [{ text: "OK" }]
                );
              }}
            >
              <MaterialIcons name="list" size={20} color="#007AFF" />
              <Text style={styles.summaryButtonText}>View Summary</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Document Modal */}
        {hasValidData && transformedData && (
          <InspectorSDDGModalView
            visible={showDocumentModal}
            extractedData={transformedData}
            onClose={() => setShowDocumentModal(false)}
          />
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
  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    color: "#1D1D1F",
  },
  reinspectionIndicator: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FF3B30",
    textAlign: "center",
    marginTop: 2,
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
    marginRight: 280, // Make room for larger document preview
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
  requiredBadge: {
    backgroundColor: "#FF3B30",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  requiredText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  extractedLabel: {
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
  originalValueContainer: {
    padding: 12,
    backgroundColor: "#F5F5F5",
    borderRadius: 6,
    marginBottom: 12,
    marginTop: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#FF6B6B",
  },
  originalValueLabel: {
    fontSize: 13,
    color: "#666",
    marginBottom: 4,
    fontWeight: "600",
  },
  originalValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  editableFieldContainer: {
    marginVertical: 12,
    padding: 12,
    backgroundColor: "#FFF9E6",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FFD700",
  },
  editableFieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  editInput: {
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#FFF",
    minHeight: 44,
    color: "#000",
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
  requiredFieldHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    marginTop: 4,
    gap: 8,
  },
  correctValueLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1D1D1F",
  },
  requiredBadge: {
    backgroundColor: "#FF3B30",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  requiredBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  correctValueInput: {
    minHeight: 44,
    fontWeight: "600",
    borderColor: "#007AFF",
  },
  helperText: {
    fontSize: 12,
    color: "#8E8E93",
    fontStyle: "italic",
    marginTop: 4,
    marginBottom: 16,
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
  summaryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  summaryButtonText: {
    fontSize: 16,
    color: "#007AFF",
    marginLeft: 4,
  },
  staticDocumentPreview: {
    position: "absolute",
    right: 16,
    top: 16,
    width: 260,
  },
  documentPreviewLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#8E8E93",
    marginBottom: 12,
    textAlign: "center",
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
    marginBottom: 20,
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
  specialNoteContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FFF3E0",
    borderWidth: 1,
    borderColor: "#FF9500",
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  specialNoteText: {
    flex: 1,
    fontSize: 13,
    color: "#1D1D1F",
    lineHeight: 18,
    marginLeft: 8,
  },
  recommendationContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FFF9E6",
    borderWidth: 1,
    borderColor: "#FF9500",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  recommendationContent: {
    flex: 1,
    marginLeft: 8,
  },
  recommendationTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FF9500",
    marginBottom: 4,
  },
  recommendationText: {
    fontSize: 14,
    color: "#1D1D1F",
    lineHeight: 20,
    marginBottom: 8,
  },
  applyRecommendationButton: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007AFF",
    textDecorationLine: "underline",
  },
  dryIceWarningContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FFEBEE",
    borderWidth: 1,
    borderColor: "#FF3B30",
    borderRadius: 8,
    padding: 16,
    marginVertical: 16,
  },
  dryIceWarningContent: {
    flex: 1,
    marginLeft: 12,
  },
  dryIceWarningTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FF3B30",
    marginBottom: 8,
  },
  dryIceWarningText: {
    fontSize: 14,
    color: "#1D1D1F",
    lineHeight: 20,
    marginBottom: 16,
  },
  dryIceAnswerButtons: {
    flexDirection: "row",
    gap: 12,
  },
  answerButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#D1D1D6",
    backgroundColor: "#FFFFFF",
  },
  answerButtonSelected: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  answerButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1D1D1F",
  },
  answerButtonTextSelected: {
    color: "#FFFFFF",
  },
});
