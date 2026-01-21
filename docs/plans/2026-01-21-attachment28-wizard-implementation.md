# Attachment 28 Packaging Inspection Wizard Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a wizard screen that presents AFMAN 24-604 Attachment 28 packaging inspection criteria based on packaging type and physical state.

**Architecture:** Create a data file defining A28 criteria with filtering logic, a wizard screen following the `InspectorCompressedGasesScreen` pattern, update navigation from `InspectorMarkingsLabelsValidationScreen` and material-specific screens to route through the new wizard before frustration summary.

**Tech Stack:** React Native, TypeScript, React Navigation, InspectionFormProvider context

---

## Task 1: Create A28 Criteria Data File

**Files:**
- Create: `src/data/attachment28InspectionCriteria.ts`

**Step 1: Create the data file with types and criteria**

```typescript
/**
 * AFMAN 24-604 Attachment 28 Inspection Criteria
 *
 * Packaging inspection criteria filtered by packaging type and physical state.
 * Used by InspectorAttachment28WizardScreen.
 */

export type PackagingType = "single" | "combination" | "composite";
export type PhysicalState = "liquid" | "solid";

export interface A28InspectionCriterion {
  id: string;
  label: string;
  description: string;
  afmanRef: string;
  formField: string;
  packagingTypes: PackagingType[];
  physicalState: "liquid" | "solid" | "both";
}

/**
 * All Attachment 28 inspection criteria.
 * Filtered at runtime based on packaging type and physical state.
 */
export const ATTACHMENT_28_CRITERIA: A28InspectionCriterion[] = [
  // === Single Packaging Criteria (A28.2.1.1) ===
  {
    id: "a28-drum-ullage",
    label: "Drum Ullage",
    description:
      "Verify drum has adequate ullage (headspace) for thermal expansion. Insufficient ullage can cause container failure during air transport.",
    afmanRef: "AFMAN 24-604 A28.2.1.1.1",
    formField: "41",
    packagingTypes: ["single"],
    physicalState: "liquid",
  },
  {
    id: "a28-single-external-condition",
    label: "External Visual Condition",
    description:
      "Verify no dents or corrosion at chime or seam, and no dents causing paint chipping. Dents or corrosion at chime or seam, or dents causing paint chipping is considered damaged and requires removal from the transportation system.",
    afmanRef: "AFMAN 24-604 A28.2.1.1.2",
    formField: "37",
    packagingTypes: ["single"],
    physicalState: "both",
  },

  // === Combination Packaging Criteria (A28.2.1.2) ===
  {
    id: "a28-inner-orientation",
    label: "Inner Receptacle Orientation",
    description:
      "Verify inner receptacles are properly oriented per package markings. Closures must be positioned upward to prevent leakage.",
    afmanRef: "AFMAN 24-604 A28.2.1.2.1",
    formField: "48",
    packagingTypes: ["combination", "composite"],
    physicalState: "liquid",
  },
  {
    id: "a28-inner-ullage",
    label: "Inner Receptacle Ullage",
    description:
      "Verify inner receptacles have adequate ullage (headspace) for thermal expansion. Insufficient ullage can cause container failure during air transport.",
    afmanRef: "AFMAN 24-604 A28.2.1.2.2",
    formField: "41",
    packagingTypes: ["combination", "composite"],
    physicalState: "liquid",
  },
  {
    id: "a28-secondary-closure",
    label: "Inner Receptacle Secondary Closure",
    description:
      "Verify inner receptacles have proper secondary closure/seal. Secondary closures prevent leakage if primary closure fails.",
    afmanRef: "AFMAN 24-604 A28.2.1.2.3",
    formField: "49",
    packagingTypes: ["combination", "composite"],
    physicalState: "liquid",
  },
  {
    id: "a28-absorbent-cushioning",
    label: "Absorbent and Cushioning Material",
    description:
      "Verify adequate absorbent and cushioning material is present. Absorbent material must be sufficient to absorb entire contents of inner receptacles.",
    afmanRef: "AFMAN 24-604 A28.2.1.2.4",
    formField: "46",
    packagingTypes: ["combination", "composite"],
    physicalState: "liquid",
  },
  {
    id: "a28-leakproof-liner",
    label: "Leak-proof Liner",
    description:
      "Verify leak-proof liner is present covering item or lining outer container. Required to prevent leakage from escaping the outer packaging.",
    afmanRef: "AFMAN 24-604 A28.2.1.2.5",
    formField: "47",
    packagingTypes: ["combination", "composite"],
    physicalState: "liquid",
  },
  {
    id: "a28-air-eligible",
    label: "Air-Eligible",
    description:
      "Verify package meets air eligibility requirements. Package must be certified for air transport per applicable regulations.",
    afmanRef: "AFMAN 24-604 A28.2.1.2.6",
    formField: "57",
    packagingTypes: ["combination", "composite"],
    physicalState: "both",
  },
  {
    id: "a28-combo-external-condition",
    label: "External Visual Condition",
    description:
      "Verify no dents or corrosion at chime or seam, and no dents causing paint chipping. Dents or corrosion at chime or seam, or dents causing paint chipping is considered damaged and requires removal from the transportation system.",
    afmanRef: "AFMAN 24-604 A28.2.1.2.7",
    formField: "37",
    packagingTypes: ["combination", "composite"],
    physicalState: "both",
  },
];

/**
 * Determines physical state from inspection data.
 * Uses Key 16 unit (L vs KG) as primary signal, hazard class as fallback.
 */
export function determinePhysicalState(
  quantityAndPacking: string | undefined,
  hazardClass: string | undefined
): PhysicalState {
  const key16 = quantityAndPacking || "";
  const hc = hazardClass || "";

  // Primary: Check Key 16 for unit (L = liters for liquid, KG = solid)
  // Match patterns like "10 L", "5L", "10.5 L"
  if (/\d+\.?\d*\s*L\b/i.test(key16)) return "liquid";
  if (/\d+\.?\d*\s*KG\b/i.test(key16)) return "solid";

  // Fallback: Hazard class heuristics
  if (hc.startsWith("3")) return "liquid"; // Class 3: Flammable liquids
  if (hc.startsWith("4.1")) return "solid"; // Class 4.1: Flammable solids
  if (hc.startsWith("5.1")) return "solid"; // Class 5.1: Oxidizers (typically solid)
  if (hc.startsWith("8")) return "liquid"; // Class 8: Corrosives (often liquid)

  return "solid"; // Default assumption
}

/**
 * Filters criteria based on packaging type and physical state.
 */
export function getApplicableCriteria(
  packagingType: PackagingType,
  physicalState: PhysicalState
): A28InspectionCriterion[] {
  return ATTACHMENT_28_CRITERIA.filter((criterion) => {
    // Check packaging type match
    if (!criterion.packagingTypes.includes(packagingType)) {
      return false;
    }

    // Check physical state match
    if (
      criterion.physicalState !== "both" &&
      criterion.physicalState !== physicalState
    ) {
      return false;
    }

    return true;
  });
}

/**
 * Gets default frustration message for an A28 criterion.
 */
export function getA28DefaultFrustrationMessage(criterion: A28InspectionCriterion): string {
  return `Packaging inspection requirement not met. Requires re-inspection per ${criterion.afmanRef}.`;
}
```

**Step 2: Verify file compiles**

Run: `npx tsc src/data/attachment28InspectionCriteria.ts --noEmit --skipLibCheck`
Expected: No errors

**Step 3: Commit**

```bash
git add src/data/attachment28InspectionCriteria.ts
git commit -m "feat(a28): add Attachment 28 inspection criteria data file

Define A28InspectionCriterion interface and criteria array for
packaging inspection wizard. Includes physical state detection
from Key 16 unit and hazard class, plus filtering by packaging type.

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 2: Add Form 1015 Mappings for A28 Criteria

**Files:**
- Modify: `src/utils/sddgToForm1015Mapping.ts:84-123`

**Step 1: Add A28 criteria to PACKAGE_TO_FORM1015_MAPPING**

Add these entries to the `PACKAGE_TO_FORM1015_MAPPING` object after line 122 (before the closing brace):

```typescript
  // Attachment 28 Packaging Inspection criteria
  "Drum Ullage": "41",
  "Inner Receptacle Ullage": "41",
  "External Visual Condition": "37",
  "Inner Receptacle Orientation": "48",
  "Inner Receptacle Secondary Closure": "49",
  "Absorbent and Cushioning Material": "46",
  "Leak-proof Liner": "47",
  "Air-Eligible": "57",
```

**Step 2: Verify file compiles**

Run: `npx tsc src/utils/sddgToForm1015Mapping.ts --noEmit --skipLibCheck`
Expected: No errors

**Step 3: Commit**

```bash
git add src/utils/sddgToForm1015Mapping.ts
git commit -m "feat(a28): add Form 1015 field mappings for A28 criteria

Map packaging inspection criteria labels to Form 1015 fields:
- Ullage → 41
- External Visual Condition → 37
- Inner Receptacle Orientation → 48
- Secondary Closure → 49
- Absorbent Material → 46
- Leak-proof Liner → 47
- Air-Eligible → 57

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 3: Create the A28 Wizard Screen Component

**Files:**
- Create: `src/screens/inspector/InspectorAttachment28WizardScreen.tsx`

**Step 1: Create the wizard screen**

```typescript
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
}

export default function InspectorAttachment28WizardScreen({
  navigation,
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

  const navigateToNext = useCallback(() => {
    const hasPackageFrustrations = (inspection?.packageFrustrations?.length ?? 0) > 0;

    if (hasPackageFrustrations) {
      navigation.navigate("PackageFrustrationSummary");
    } else {
      navigation.navigate("PackageInspectionCompleteScreen");
    }
  }, [navigation, inspection?.packageFrustrations?.length]);

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

                    <View style={styles.afmanReference}>
                      <MaterialIcons name="book" size={16} color="#007AFF" />
                      <Text style={styles.afmanReferenceText}>
                        {currentCriterion.afmanRef}
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
```

**Step 2: Verify file compiles**

Run: `npx tsc src/screens/inspector/InspectorAttachment28WizardScreen.tsx --noEmit --skipLibCheck`
Expected: No errors

**Step 3: Commit**

```bash
git add src/screens/inspector/InspectorAttachment28WizardScreen.tsx
git commit -m "feat(a28): add Attachment 28 packaging inspection wizard screen

Wizard presents applicable A28 criteria based on packaging type
(single/combination/composite) and physical state (liquid/solid).
Uses uniform Validate/Frustrate pattern matching CompressedGasesScreen.

Features:
- Progress bar with validated/frustrated counts
- Frustration edit mode with comments
- Empty state when no criteria apply
- Navigation to frustration summary or complete screen

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 4: Register Screen in Navigator

**Files:**
- Modify: `src/screens/inspector/InspectorLayoutNavigator.tsx`

**Step 1: Add import at line 41 (after InspectorMarkingsLabelsValidationScreen import)**

```typescript
import InspectorAttachment28WizardScreen from "./InspectorAttachment28WizardScreen";
```

**Step 2: Add screen registration inside MainStack.Navigator (after InspectorMarkingsLabelsValidationScreen, around line 254)**

```typescript
      <MainStack.Screen
        name="InspectorAttachment28WizardScreen"
        component={InspectorAttachment28WizardScreen}
      />
```

**Step 3: Verify app compiles**

Run: `npx expo start` and verify no errors
Expected: App starts without errors

**Step 4: Commit**

```bash
git add src/screens/inspector/InspectorLayoutNavigator.tsx
git commit -m "feat(a28): register InspectorAttachment28WizardScreen in navigator

Add import and screen registration for the new A28 packaging
inspection wizard in InspectorLayoutNavigator.

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 5: Update InspectorMarkingsLabelsValidationScreen Navigation

**Files:**
- Modify: `src/screens/inspector/InspectorMarkingsLabelsValidationScreen.tsx:661-724`

**Step 1: Update navigateToNextScreen function**

Replace the else block at line 712-724 (the "No material-specific screen needed" section) with navigation to A28 wizard:

Find this code (around line 711-724):
```typescript
    } else {
      // No material-specific screen needed - go directly to summary or complete
      // Check if there are any package frustrations from POP validation or markings/labels validation
      const hasPackageFrustrations = inspection.packageFrustrations.length > 0;

      if (hasPackageFrustrations) {
        // Navigate to frustration summary to review package issues
        navigation.navigate("PackageFrustrationSummary");
      } else {
        // No frustrations - inspection is complete
        navigation.navigate("PackageInspectionCompleteScreen");
      }
    }
```

Replace with:
```typescript
    } else {
      // No material-specific screen needed - go to A28 packaging inspection wizard
      navigation.navigate("InspectorAttachment28WizardScreen");
    }
```

**Step 2: Verify app compiles and navigates correctly**

Run: `npx expo start`
Expected: App starts, navigation from MarkingsLabels to A28 wizard works

**Step 3: Commit**

```bash
git add src/screens/inspector/InspectorMarkingsLabelsValidationScreen.tsx
git commit -m "feat(a28): update MarkingsLabels navigation to A28 wizard

When no material-specific screen is needed, navigate to the
InspectorAttachment28WizardScreen instead of directly to
frustration summary.

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 6: Update Material-Specific Screens Navigation

Each material-specific screen that currently navigates to frustration summary or complete screen needs to navigate to the A28 wizard instead. The A28 wizard will then handle final navigation.

**Files to modify:**
- `src/screens/inspector/InspectorDryIceScreen.tsx`
- `src/screens/inspector/InspectorMagnetizedMaterialsScreen.tsx`
- `src/screens/inspector/InspectorLithiumBatteriesScreen.tsx`
- `src/screens/inspector/InspectorCapacitorsScreen.tsx`
- `src/screens/inspector/InspectorFirstAidChemicalKitScreen.tsx`
- `src/screens/inspector/InspectorDangerousGoodsInApparatusScreen.tsx`
- `src/screens/inspector/InspectorBatteryPoweredVehicleScreen.tsx`
- `src/screens/inspector/InspectorEnginesInternalCombustionScreen.tsx`
- `src/screens/inspector/InspectorLifeSavingAppliancesScreen.tsx`
- `src/screens/inspector/InspectorGeneticallyModifiedOrganismsScreen.tsx`
- `src/screens/inspector/InspectorSafetyDevicesScreen.tsx`

**Step 1: For each file, find navigation calls to PackageFrustrationSummary, PackageInspectionCompleteScreen, or InspectorPackageVerification and update them**

Example pattern - in each file, find code like:
```typescript
navigation.navigate("PackageFrustrationSummary");
// or
navigation.navigate("PackageInspectionCompleteScreen");
// or
navigation.navigate("InspectorPackageVerification");
```

Replace with:
```typescript
navigation.navigate("InspectorAttachment28WizardScreen");
```

**Note:** Some screens like `InspectorDryIceScreen` navigate to `InspectorPackageVerification`. Update these to `InspectorAttachment28WizardScreen`.

**Step 2: Verify each file compiles**

Run: `npx tsc src/screens/inspector/Inspector*.tsx --noEmit --skipLibCheck`
Expected: No errors

**Step 3: Commit all changes**

```bash
git add src/screens/inspector/InspectorDryIceScreen.tsx \
        src/screens/inspector/InspectorMagnetizedMaterialsScreen.tsx \
        src/screens/inspector/InspectorLithiumBatteriesScreen.tsx \
        src/screens/inspector/InspectorCapacitorsScreen.tsx \
        src/screens/inspector/InspectorFirstAidChemicalKitScreen.tsx \
        src/screens/inspector/InspectorDangerousGoodsInApparatusScreen.tsx \
        src/screens/inspector/InspectorBatteryPoweredVehicleScreen.tsx \
        src/screens/inspector/InspectorEnginesInternalCombustionScreen.tsx \
        src/screens/inspector/InspectorLifeSavingAppliancesScreen.tsx \
        src/screens/inspector/InspectorGeneticallyModifiedOrganismsScreen.tsx \
        src/screens/inspector/InspectorSafetyDevicesScreen.tsx

git commit -m "feat(a28): update material-specific screens to navigate to A28 wizard

All material-specific inspection screens now navigate to
InspectorAttachment28WizardScreen instead of directly to
frustration summary or package complete screen.

Affected screens:
- DryIce, MagnetizedMaterials, LithiumBatteries
- Capacitors, FirstAidChemicalKit, DangerousGoodsInApparatus
- BatteryPoweredVehicle, EnginesInternalCombustion
- LifeSavingAppliances, GeneticallyModifiedOrganisms, SafetyDevices

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 7: Manual Testing Checklist

**Step 1: Test single packaging + liquid flow**

1. Start new inspection with Class 3 (flammable liquid) material
2. Select "Single" packaging type
3. Complete ML detection, POP marking, markings/labels
4. Verify A28 wizard shows: Drum Ullage, External Visual Condition
5. Validate both → verify navigation to complete/summary

**Step 2: Test single packaging + solid flow**

1. Start new inspection with Class 4.1 (flammable solid) material
2. Select "Single" packaging type
3. Complete workflow to A28 wizard
4. Verify A28 wizard shows only: External Visual Condition
5. Validate → verify navigation works

**Step 3: Test combination packaging + liquid flow**

1. Start new inspection with Class 3 (flammable liquid) material
2. Select "Combination" packaging type
3. Complete workflow to A28 wizard
4. Verify A28 wizard shows all 7 liquid criteria
5. Frustrate one item, validate others → verify navigation to frustration summary

**Step 4: Test combination packaging + solid flow**

1. Start new inspection with Class 4.1 (flammable solid) material
2. Select "Combination" packaging type
3. Complete workflow to A28 wizard
4. Verify A28 wizard shows: Air-Eligible, External Visual Condition
5. Validate both → verify navigation to complete screen

**Step 5: Test empty state**

1. Check if there's a scenario with no applicable criteria
2. Verify empty state UI displays correctly
3. Verify Continue button navigates correctly

**Step 6: Test frustration appears on Form 1015**

1. Create inspection with A28 frustration
2. Complete to AMC Form 1015 screen
3. Verify frustrated item shows correct Form 1015 field number

---

## Summary

| Task | Description | Files |
|------|-------------|-------|
| 1 | Create A28 criteria data file | `src/data/attachment28InspectionCriteria.ts` |
| 2 | Add Form 1015 mappings | `src/utils/sddgToForm1015Mapping.ts` |
| 3 | Create wizard screen component | `src/screens/inspector/InspectorAttachment28WizardScreen.tsx` |
| 4 | Register screen in navigator | `src/screens/inspector/InspectorLayoutNavigator.tsx` |
| 5 | Update MarkingsLabels navigation | `src/screens/inspector/InspectorMarkingsLabelsValidationScreen.tsx` |
| 6 | Update material-specific screens | 11 files in `src/screens/inspector/` |
| 7 | Manual testing | N/A |

Total estimated commits: 6
