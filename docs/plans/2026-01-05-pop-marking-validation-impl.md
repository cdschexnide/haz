# UN Specification Package Marking Validation Screen Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a validation screen that displays ML-detected POP markings, validates packaging code and packing group against AFMAN 24-604 requirements, and allows frustration creation for non-compliant fields.

**Architecture:** New screen component inserted between MLDetectionScreen and material-specific screens. Uses existing validation helpers (`validatePackagingCodeV2`), context (`useInspectionForm`), and display components (`SolidPopMarking`/`LiquidPopMarking`). Two states: "detected" (show validation UI) and "not_detected" (show Enter Manually / Mark as Missing options).

**Tech Stack:** React Native, TypeScript, react-native-elements ButtonGroup, InspectionFormProvider context, packagingDatabaseV2

---

## Task 1: Create Basic Screen Structure

**Files:**
- Create: `src/components/Inspector/InspectorPOPMarkingValidationScreen.tsx`

**Step 1: Create the screen file with basic structure**

Create `src/components/Inspector/InspectorPOPMarkingValidationScreen.tsx`:

```typescript
import React, { useEffect, useState, useCallback } from "react";
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
import { ButtonGroup } from "react-native-elements";
import { MaterialIcons } from "@expo/vector-icons";
import { useInspectionForm } from "../../contexts/InspectionFormProvider";
import { useHazProStore } from "../../stores/useHazProStore";
import { packagingDatabaseV2 } from "../../../server/lookupFunctions/packagingLookupV2";
import { validatePackagingCodeV2 } from "../../utils/packagingWizardV2Helpers";
import { hazardousMaterialsList } from "../../hazardousMaterials/hazardousMaterialsList";
import { PhysicalState } from "../../../types";
import SolidPopMarking from "../SolidPopMarking";
import LiquidPopMarking from "../LiquidPopMarking";
import colors from "../../theming/colors";

const hazardClass4ParagraphsWithNoPackingGroup = ["A8.6.", "A8.7.", "A8.8."];
const packagingParagraphValuesThatRequirePGIPackaging = ["A12.9.", "A12.11."];

const InspectorPOPMarkingValidationScreen = ({
  navigation,
}: {
  navigation: any;
}) => {
  const {
    inspection,
    updatePackagePopField,
    setPackagePopMarking,
    addPackageFrustration,
    removePackageFrustration,
  } = useInspectionForm();

  const { actions } = useHazProStore();

  // Get ML-detected POP marking
  const bestPopMarking = inspection.mlAnalysisResults?.bestPopMarking;
  const hasDetectedPOP = bestPopMarking !== null && bestPopMarking !== undefined;

  // Set active chevron when component mounts
  useEffect(() => {
    actions.setCurrentChevron("package");
  }, []);

  if (!hasDetectedPOP) {
    return <NotDetectedState navigation={navigation} />;
  }

  return <DetectedState navigation={navigation} />;
};

// Placeholder components - will be implemented in subsequent tasks
const NotDetectedState = ({ navigation }: { navigation: any }) => (
  <View style={styles.container}>
    <Text>Not Detected State - To be implemented</Text>
  </View>
);

const DetectedState = ({ navigation }: { navigation: any }) => (
  <View style={styles.container}>
    <Text>Detected State - To be implemented</Text>
  </View>
);

export default InspectorPOPMarkingValidationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
```

**Step 2: Commit**

```bash
git add src/components/Inspector/InspectorPOPMarkingValidationScreen.tsx
git commit -m "feat(inspector): add basic POP marking validation screen structure"
```

---

## Task 2: Register Screen in Navigator

**Files:**
- Modify: `src/components/Inspector/InspectorLayoutNavigator.tsx:1-50` (imports)
- Modify: `src/components/Inspector/InspectorLayoutNavigator.tsx:213-217` (screen registration)

**Step 1: Add import for new screen**

Add after line 47 (after `import MLDetectionScreen`):

```typescript
import InspectorPOPMarkingValidationScreen from "./InspectorPOPMarkingValidationScreen";
```

**Step 2: Register the screen in MainStack.Navigator**

Add after line 216 (after MLDetectionScreen registration):

```typescript
      <MainStack.Screen
        name="InspectorPOPMarkingValidationScreen"
        component={InspectorPOPMarkingValidationScreen}
      />
```

**Step 3: Commit**

```bash
git add src/components/Inspector/InspectorLayoutNavigator.tsx
git commit -m "feat(navigator): register InspectorPOPMarkingValidationScreen route"
```

---

## Task 3: Update MLDetectionScreen Navigation

**Files:**
- Modify: `src/components/Inspector/MLDetectionScreen.tsx:131-165` (navigateToNextScreen function)

**Step 1: Change navigateToNextScreen to route to validation screen**

Replace lines 131-165 with:

```typescript
  const navigateToNextScreen = useCallback(() => {
    // In modal mode, just close the modal
    if (onClose) {
      onClose();
      return;
    }
    // In navigation mode, navigate to the POP marking validation screen first
    if (!navigation) return;

    // Always go to POP marking validation screen first
    // That screen will then route to material-specific screens after validation
    navigation.navigate("InspectorPOPMarkingValidationScreen");
  }, [navigation, onClose]);
```

**Step 2: Commit**

```bash
git add src/components/Inspector/MLDetectionScreen.tsx
git commit -m "feat(ml-detection): route to POP marking validation screen after analysis"
```

---

## Task 4: Implement NotDetectedState Component

**Files:**
- Modify: `src/components/Inspector/InspectorPOPMarkingValidationScreen.tsx`

**Step 1: Replace NotDetectedState placeholder with full implementation**

Replace the `NotDetectedState` component with:

```typescript
const NotDetectedState = ({ navigation }: { navigation: any }) => {
  const { addPackageFrustration, inspection } = useInspectionForm();
  const [hasFrustrated, setHasFrustrated] = useState(false);

  const handleEnterManually = () => {
    navigation.navigate("InspectorPOPMarkingDataEntry");
  };

  const handleMarkAsMissing = () => {
    addPackageFrustration({
      category: "marking",
      itemId: "pop-marking-missing",
      itemLabel: "UN Specification Marking",
      expectedValues: ["UN specification marking present"],
      verificationStatus: "missing",
      defaultMessage:
        "Required UN specification packaging marking not found on package",
      afmanReference: "AFMAN 24-604 A14.2",
    });
    setHasFrustrated(true);
  };

  const navigateToNextScreen = () => {
    const unIdNo = inspection.extractedContent?.unIdNo || "";

    if (unIdNo === "UN1845") {
      navigation.navigate("InspectorDryIceScreen");
    } else if (unIdNo === "UN2807") {
      navigation.navigate("InspectorMagnetizedMaterialsScreen");
    } else if (unIdNo === "UN3072" || unIdNo === "UN2990") {
      navigation.navigate("InspectorLifeSavingAppliancesScreen");
    } else if (unIdNo === "UN3245") {
      navigation.navigate("InspectorGeneticallyModifiedOrganismsScreen");
    } else if (unIdNo === "UN3268") {
      navigation.navigate("InspectorSafetyDevicesScreen");
    } else if (unIdNo === "UN3508") {
      navigation.navigate("InspectorCapacitorsScreen");
    } else if (unIdNo === "UN3528" || unIdNo === "UN3529") {
      navigation.navigate("InspectorEnginesInternalCombustionScreen");
    } else if (unIdNo === "UN3316") {
      navigation.navigate("InspectorFirstAidChemicalKitScreen");
    } else if (unIdNo === "UN3363") {
      navigation.navigate("InspectorDangerousGoodsInApparatusScreen");
    } else if (unIdNo === "UN3171") {
      navigation.navigate("InspectorBatteryPoweredVehicleScreen");
    } else if (unIdNo === "UN3480" || unIdNo === "UN3090") {
      navigation.navigate("InspectorLithiumBatteriesScreen");
    } else {
      navigation.navigate("InspectorPackageVerification");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={100}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>UN Specification Marking Validation</Text>

        <View style={styles.warningCard}>
          <MaterialIcons name="warning" size={48} color="#F57C00" />
          <Text style={styles.warningTitle}>No POP Marking Detected</Text>
          <Text style={styles.warningText}>
            The ML/OCR analysis did not find a UN specification packaging
            marking on the package images.
          </Text>
          <Text style={styles.warningText}>
            Per AFMAN 24-604 A14.2, UN specification markings are mandatory for
            all hazmat packages unless exempted.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.optionButton}
          onPress={handleEnterManually}
        >
          <MaterialIcons name="edit" size={24} color={colors.blue} />
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionTitle}>Enter Manually</Text>
            <Text style={styles.optionDescription}>
              Navigate to manual POP marking entry
            </Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.optionButton,
            hasFrustrated && styles.optionButtonFrustrated,
          ]}
          onPress={handleMarkAsMissing}
          disabled={hasFrustrated}
        >
          <MaterialIcons
            name={hasFrustrated ? "check-circle" : "report-problem"}
            size={24}
            color={hasFrustrated ? "#4CAF50" : "#F57C00"}
          />
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionTitle}>
              {hasFrustrated ? "Marked as Missing" : "Mark as Missing (Frustration)"}
            </Text>
            <Text style={styles.optionDescription}>
              Package lacks required UN marking
            </Text>
          </View>
          {!hasFrustrated && (
            <MaterialIcons name="chevron-right" size={24} color="#999" />
          )}
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.saveExitButton}
          onPress={() => {
            Alert.alert("Save Progress", "Inspection progress saved.", [
              { text: "OK" },
            ]);
          }}
        >
          <Text style={styles.buttonText}>Save & Exit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.continueButton,
            !hasFrustrated && styles.disabledButton,
          ]}
          onPress={navigateToNextScreen}
          disabled={!hasFrustrated}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};
```

**Step 2: Add additional styles**

Add to the StyleSheet:

```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scroll: {
    padding: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#212529",
  },
  warningCard: {
    backgroundColor: "#FFF3E0",
    borderWidth: 1,
    borderColor: "#FFB74D",
    borderRadius: 8,
    padding: 20,
    alignItems: "center",
    marginBottom: 24,
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#E65100",
    marginTop: 12,
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    color: "#5D4037",
    textAlign: "center",
    marginBottom: 8,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#dee2e6",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  optionButtonFrustrated: {
    backgroundColor: "#E8F5E9",
    borderColor: "#4CAF50",
  },
  optionTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212529",
  },
  optionDescription: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
    backgroundColor: "#ffffff",
  },
  cancelButton: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: colors.blue,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  cancelButtonText: {
    color: colors.blue,
    fontSize: 16,
    fontWeight: "600",
  },
  saveExitButton: {
    flex: 1,
    height: 48,
    backgroundColor: "#6C757D",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
  },
  continueButton: {
    flex: 1,
    height: 48,
    backgroundColor: colors.blue,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: "#a0a0a0",
    opacity: 0.7,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
```

**Step 3: Commit**

```bash
git add src/components/Inspector/InspectorPOPMarkingValidationScreen.tsx
git commit -m "feat(pop-validation): implement NotDetectedState with manual entry and frustration options"
```

---

## Task 5: Implement DetectedState Component - Physical State Detection & Field Initialization

**Files:**
- Modify: `src/components/Inspector/InspectorPOPMarkingValidationScreen.tsx`

**Step 1: Replace DetectedState placeholder with field state and physical state detection**

Replace the `DetectedState` component with:

```typescript
const DetectedState = ({ navigation }: { navigation: any }) => {
  const {
    inspection,
    updatePackagePopField,
    setPackagePopMarking,
    addPackageFrustration,
    removePackageFrustration,
  } = useInspectionForm();

  const bestPopMarking = inspection.mlAnalysisResults?.bestPopMarking;

  // Detect physical state from extracted SDDG content
  const detectPhysicalState = (): PhysicalState => {
    const hazardousMaterial = hazardousMaterialsList.find(
      (material) => material.unid === inspection.extractedContent?.unIdNo
    );
    const psn = hazardousMaterial?.properShippingName?.toLowerCase() || "";
    const hazClass = hazardousMaterial?.hazclassDiv?.toLowerCase() || "";

    if (
      psn.includes("solid") ||
      psn.includes("powder") ||
      psn.includes("granules") ||
      psn.includes("flakes") ||
      hazClass === "4.1" ||
      hazClass === "4.2" ||
      hazClass === "4.3"
    ) {
      return PhysicalState.SOLID;
    }

    if (hazClass.startsWith("2.")) {
      return PhysicalState.SOLID;
    }

    if (
      hazClass === "3" ||
      psn.includes("liquid") ||
      psn.includes("solution")
    ) {
      return PhysicalState.LIQUID;
    }

    return PhysicalState.SOLID;
  };

  const physicalState = detectPhysicalState();

  // Initialize editable fields from ML-detected values
  const [fields, setFields] = useState({
    B: bestPopMarking?.fields?.B || "",
    C: bestPopMarking?.fields?.C || "",
    D: bestPopMarking?.fields?.D || "",
    E: bestPopMarking?.fields?.E || (physicalState === PhysicalState.SOLID ? "S" : ""),
    F: bestPopMarking?.fields?.F || "",
    G: bestPopMarking?.fields?.G || "",
    H: bestPopMarking?.fields?.H || "",
  });

  // Validation states: 'valid' | 'invalid' | 'frustrated'
  const [fieldBStatus, setFieldBStatus] = useState<"valid" | "invalid" | "frustrated">("valid");
  const [fieldCStatus, setFieldCStatus] = useState<"valid" | "invalid" | "frustrated">("valid");

  // Error messages
  const [fieldBError, setFieldBError] = useState<string | null>(null);
  const [fieldCError, setFieldCError] = useState<string | null>(null);

  // Initialize package pop marking in context
  useEffect(() => {
    if (bestPopMarking?.fields) {
      setPackagePopMarking({
        B: bestPopMarking.fields.B || "",
        C: bestPopMarking.fields.C || "",
        D: bestPopMarking.fields.D || "",
        E: bestPopMarking.fields.E || (physicalState === PhysicalState.SOLID ? "S" : ""),
        F: bestPopMarking.fields.F || "",
        G: bestPopMarking.fields.G || "",
        H: bestPopMarking.fields.H || "",
      });
    }
  }, []);

  const updateField = (key: keyof typeof fields, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
    updatePackagePopField(key, value);
  };

  // Placeholder for validation - will be implemented in next task
  return (
    <View style={styles.container}>
      <Text style={styles.title}>UN Specification Marking Validation</Text>
      <Text>Fields initialized: B={fields.B}, C={fields.C}</Text>
      <Text>Physical State: {physicalState}</Text>
    </View>
  );
};
```

**Step 2: Commit**

```bash
git add src/components/Inspector/InspectorPOPMarkingValidationScreen.tsx
git commit -m "feat(pop-validation): add DetectedState with field initialization and physical state detection"
```

---

## Task 6: Implement Validation Logic

**Files:**
- Modify: `src/components/Inspector/InspectorPOPMarkingValidationScreen.tsx` (DetectedState component)

**Step 1: Add allowablePackingGroups function and validation logic**

Add inside `DetectedState` component, after the `updateField` function:

```typescript
  // Determine allowable packing groups based on extracted SDDG data
  const allowablePackingGroups = useCallback(() => {
    const hazardClass = inspection.extractedContent?.hazardClass || "";
    const packingGroup = inspection.extractedContent?.packingGroup || "";
    const packingInstruction =
      inspection.extractedContent?.packingInstruction || "";

    if (hazardClass.startsWith("1")) {
      return ["X", "Y"];
    } else if (packingInstruction === "A7.12.") {
      return ["X", "Y"];
    } else if (hazardClass.startsWith("4") && packingGroup === "III") {
      return ["X", "Y"];
    } else if (
      packingInstruction &&
      hazardClass4ParagraphsWithNoPackingGroup.includes(packingInstruction)
    ) {
      return ["X", "Y"];
    } else if (
      packingInstruction &&
      packagingParagraphValuesThatRequirePGIPackaging.includes(packingInstruction)
    ) {
      return ["X"];
    } else if (packingGroup === "I") {
      return ["X"];
    } else if (packingGroup === "II") {
      return ["X", "Y"];
    } else if (packingGroup === "III") {
      return ["X", "Y", "Z"];
    }

    return ["X", "Y", "Z"];
  }, [inspection.extractedContent]);

  // Validate Field B (Packaging Code)
  const validateFieldB = useCallback(
    (value: string) => {
      const packagingParagraph = inspection.extractedContent?.packingInstruction;

      if (!packagingParagraph || value.trim() === "") {
        setFieldBError(null);
        setFieldBStatus("valid");
        return;
      }

      const result = validatePackagingCodeV2(
        packagingDatabaseV2,
        packagingParagraph,
        value,
        undefined
      );

      if (!result?.isValid) {
        setFieldBError(
          `Packaging code '${value}' not authorized for ${packagingParagraph}`
        );
        setFieldBStatus("invalid");
      } else {
        setFieldBError(null);
        setFieldBStatus("valid");
      }
    },
    [inspection.extractedContent?.packingInstruction]
  );

  // Validate Field C (Packing Group)
  const validateFieldC = useCallback(
    (value: string) => {
      const allowedGroups = allowablePackingGroups();

      if (!value || value.trim() === "") {
        setFieldCError("Packing group is required");
        setFieldCStatus("invalid");
        return;
      }

      if (!allowedGroups.includes(value)) {
        setFieldCError(
          `Packing group '${value}' insufficient. Required: ${allowedGroups.join(" or ")}`
        );
        setFieldCStatus("invalid");
      } else {
        setFieldCError(null);
        setFieldCStatus("valid");
      }
    },
    [allowablePackingGroups]
  );

  // Run initial validation on mount
  useEffect(() => {
    validateFieldB(fields.B);
    validateFieldC(fields.C);
  }, []);

  // Re-validate on field change
  useEffect(() => {
    validateFieldB(fields.B);
  }, [fields.B, validateFieldB]);

  useEffect(() => {
    validateFieldC(fields.C);
  }, [fields.C, validateFieldC]);
```

**Step 2: Commit**

```bash
git add src/components/Inspector/InspectorPOPMarkingValidationScreen.tsx
git commit -m "feat(pop-validation): implement packaging code and packing group validation logic"
```

---

## Task 7: Implement Frustration Handlers

**Files:**
- Modify: `src/components/Inspector/InspectorPOPMarkingValidationScreen.tsx` (DetectedState component)

**Step 1: Add frustration handlers**

Add inside `DetectedState` component, after the validation effects:

```typescript
  // Handle Field B frustration
  const handleFieldBFrustration = () => {
    const packagingParagraph = inspection.extractedContent?.packingInstruction || "unknown";
    addPackageFrustration({
      category: "marking",
      itemId: "pop-field-b-validation",
      itemLabel: "Packaging Code (Field B)",
      expectedValues: ["Valid packaging code for " + packagingParagraph],
      verificationStatus: "incorrect",
      defaultMessage: `Packaging code '${fields.B}' not authorized for ${packagingParagraph}`,
      afmanReference: "AFMAN 24-604 A14.2",
    });
    setFieldBStatus("frustrated");
  };

  // Handle Field C frustration
  const handleFieldCFrustration = () => {
    const allowedGroups = allowablePackingGroups();
    addPackageFrustration({
      category: "marking",
      itemId: "pop-field-c-validation",
      itemLabel: "Packing Group (Field C)",
      expectedValues: allowedGroups,
      verificationStatus: "incorrect",
      defaultMessage: `Packing group '${fields.C}' insufficient. Required: ${allowedGroups.join(" or ")}`,
      afmanReference: "AFMAN 24-604 A14.2",
    });
    setFieldCStatus("frustrated");
  };

  // Check if can continue (all fields valid or frustrated)
  const canContinue =
    (fieldBStatus === "valid" || fieldBStatus === "frustrated") &&
    (fieldCStatus === "valid" || fieldCStatus === "frustrated");

  // Navigate to next screen
  const navigateToNextScreen = () => {
    const unIdNo = inspection.extractedContent?.unIdNo || "";

    if (unIdNo === "UN1845") {
      navigation.navigate("InspectorDryIceScreen");
    } else if (unIdNo === "UN2807") {
      navigation.navigate("InspectorMagnetizedMaterialsScreen");
    } else if (unIdNo === "UN3072" || unIdNo === "UN2990") {
      navigation.navigate("InspectorLifeSavingAppliancesScreen");
    } else if (unIdNo === "UN3245") {
      navigation.navigate("InspectorGeneticallyModifiedOrganismsScreen");
    } else if (unIdNo === "UN3268") {
      navigation.navigate("InspectorSafetyDevicesScreen");
    } else if (unIdNo === "UN3508") {
      navigation.navigate("InspectorCapacitorsScreen");
    } else if (unIdNo === "UN3528" || unIdNo === "UN3529") {
      navigation.navigate("InspectorEnginesInternalCombustionScreen");
    } else if (unIdNo === "UN3316") {
      navigation.navigate("InspectorFirstAidChemicalKitScreen");
    } else if (unIdNo === "UN3363") {
      navigation.navigate("InspectorDangerousGoodsInApparatusScreen");
    } else if (unIdNo === "UN3171") {
      navigation.navigate("InspectorBatteryPoweredVehicleScreen");
    } else if (unIdNo === "UN3480" || unIdNo === "UN3090") {
      navigation.navigate("InspectorLithiumBatteriesScreen");
    } else {
      navigation.navigate("InspectorPackageVerification");
    }
  };
```

**Step 2: Commit**

```bash
git add src/components/Inspector/InspectorPOPMarkingValidationScreen.tsx
git commit -m "feat(pop-validation): implement frustration handlers and navigation logic"
```

---

## Task 8: Implement Full DetectedState UI

**Files:**
- Modify: `src/components/Inspector/InspectorPOPMarkingValidationScreen.tsx` (DetectedState return statement)

**Step 1: Replace the placeholder return with full UI**

Replace the return statement in `DetectedState` with:

```typescript
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={100}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>UN Specification Marking Validation</Text>

        {/* POP Marking Display */}
        <View style={styles.popDisplaySection}>
          <Text style={styles.sectionTitle}>Detected Marking</Text>
          <View style={styles.popRow}>
            {physicalState === PhysicalState.LIQUID ? (
              <LiquidPopMarking
                B={fields.B}
                C={fields.C}
                D={fields.D}
                E={fields.E}
                F={fields.F}
                G={fields.G}
                H={fields.H}
              />
            ) : (
              <SolidPopMarking
                B={fields.B}
                C={fields.C}
                D={fields.D}
                E="S"
                F={fields.F}
                G={fields.G}
                H={fields.H}
              />
            )}
          </View>
          <Text style={styles.confidenceText}>
            Detection Confidence: {((bestPopMarking?.confidence || 0) * 100).toFixed(0)}%
          </Text>
        </View>

        {/* Validation Section */}
        <View style={styles.validationSection}>
          <Text style={styles.sectionTitle}>Compliance Validation</Text>

          {/* Field B: Packaging Code */}
          <View style={styles.validationCard}>
            <View style={styles.validationHeader}>
              <Text style={styles.fieldLabel}>Field B: Packaging Code</Text>
              {fieldBStatus === "valid" && (
                <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
              )}
              {fieldBStatus === "invalid" && (
                <MaterialIcons name="cancel" size={24} color="#F44336" />
              )}
              {fieldBStatus === "frustrated" && (
                <MaterialIcons name="warning" size={24} color="#FF9800" />
              )}
            </View>

            <TextInput
              style={[
                styles.input,
                fieldBStatus === "invalid" && styles.inputError,
                fieldBStatus === "frustrated" && styles.inputFrustrated,
              ]}
              value={fields.B}
              onChangeText={(text) => updateField("B", text.toUpperCase())}
              placeholder="e.g., 4G, 1A1"
              editable={fieldBStatus !== "frustrated"}
            />

            {fieldBStatus === "valid" && (
              <Text style={styles.validText}>
                Authorized for {inspection.extractedContent?.packingInstruction || "this material"}
              </Text>
            )}

            {fieldBStatus === "invalid" && fieldBError && (
              <>
                <Text style={styles.errorText}>{fieldBError}</Text>
                <TouchableOpacity
                  style={styles.frustrationButton}
                  onPress={handleFieldBFrustration}
                >
                  <MaterialIcons name="report-problem" size={18} color="#fff" />
                  <Text style={styles.frustrationButtonText}>
                    Create Frustration
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {fieldBStatus === "frustrated" && (
              <Text style={styles.frustratedText}>
                Frustration created for this field
              </Text>
            )}
          </View>

          {/* Field C: Packing Group */}
          <View style={styles.validationCard}>
            <View style={styles.validationHeader}>
              <Text style={styles.fieldLabel}>Field C: Packing Group</Text>
              {fieldCStatus === "valid" && (
                <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
              )}
              {fieldCStatus === "invalid" && (
                <MaterialIcons name="cancel" size={24} color="#F44336" />
              )}
              {fieldCStatus === "frustrated" && (
                <MaterialIcons name="warning" size={24} color="#FF9800" />
              )}
            </View>

            <ButtonGroup
              buttons={allowablePackingGroups()}
              selectedIndex={allowablePackingGroups().indexOf(fields.C)}
              onPress={(selectedIndex) => {
                if (fieldCStatus !== "frustrated") {
                  const selectedValue = allowablePackingGroups()[selectedIndex];
                  updateField("C", selectedValue);
                }
              }}
              containerStyle={[
                styles.buttonGroupContainer,
                fieldCStatus === "invalid" && styles.buttonGroupError,
                fieldCStatus === "frustrated" && styles.buttonGroupFrustrated,
              ]}
              selectedButtonStyle={styles.selectedButton}
              textStyle={styles.buttonGroupText}
              disabled={fieldCStatus === "frustrated"}
            />

            <Text style={styles.allowedText}>
              Allowed: {allowablePackingGroups().join(", ")}
            </Text>

            {fieldCStatus === "valid" && (
              <Text style={styles.validText}>
                Meets requirement for PG {inspection.extractedContent?.packingGroup || "material"}
              </Text>
            )}

            {fieldCStatus === "invalid" && fieldCError && (
              <>
                <Text style={styles.errorText}>{fieldCError}</Text>
                <TouchableOpacity
                  style={styles.frustrationButton}
                  onPress={handleFieldCFrustration}
                >
                  <MaterialIcons name="report-problem" size={18} color="#fff" />
                  <Text style={styles.frustrationButtonText}>
                    Create Frustration
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {fieldCStatus === "frustrated" && (
              <Text style={styles.frustratedText}>
                Frustration created for this field
              </Text>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.saveExitButton}
          onPress={() => {
            Alert.alert("Save Progress", "Inspection progress saved.", [
              { text: "OK" },
            ]);
          }}
        >
          <Text style={styles.buttonText}>Save & Exit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.continueButton, !canContinue && styles.disabledButton]}
          onPress={navigateToNextScreen}
          disabled={!canContinue}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
```

**Step 2: Commit**

```bash
git add src/components/Inspector/InspectorPOPMarkingValidationScreen.tsx
git commit -m "feat(pop-validation): implement full DetectedState UI with editable fields and frustration buttons"
```

---

## Task 9: Add Remaining Styles

**Files:**
- Modify: `src/components/Inspector/InspectorPOPMarkingValidationScreen.tsx` (styles)

**Step 1: Add validation-specific styles**

Add these additional styles to the StyleSheet:

```typescript
  // Add to existing styles
  popDisplaySection: {
    borderWidth: 1,
    borderColor: "#dee2e6",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    backgroundColor: "#f8f9fa",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#495057",
    marginBottom: 12,
  },
  popRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  confidenceText: {
    fontSize: 12,
    color: "#6c757d",
    textAlign: "center",
    marginTop: 8,
  },
  validationSection: {
    marginBottom: 16,
  },
  validationCard: {
    borderWidth: 1,
    borderColor: "#dee2e6",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  validationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#212529",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fafafa",
    color: "#000",
  },
  inputError: {
    borderColor: "#F44336",
    backgroundColor: "#FFEBEE",
  },
  inputFrustrated: {
    borderColor: "#FF9800",
    backgroundColor: "#FFF3E0",
  },
  validText: {
    fontSize: 13,
    color: "#4CAF50",
    marginTop: 8,
  },
  errorText: {
    fontSize: 13,
    color: "#F44336",
    marginTop: 8,
  },
  frustratedText: {
    fontSize: 13,
    color: "#FF9800",
    marginTop: 8,
    fontStyle: "italic",
  },
  allowedText: {
    fontSize: 12,
    color: "#6c757d",
    marginTop: 4,
  },
  frustrationButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F44336",
    borderRadius: 4,
    padding: 10,
    marginTop: 12,
  },
  frustrationButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  buttonGroupContainer: {
    marginTop: 0,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    height: 48,
  },
  buttonGroupError: {
    borderColor: "#F44336",
  },
  buttonGroupFrustrated: {
    borderColor: "#FF9800",
    opacity: 0.7,
  },
  selectedButton: {
    backgroundColor: colors.blue,
  },
  buttonGroupText: {
    color: "#000",
  },
```

**Step 2: Commit**

```bash
git add src/components/Inspector/InspectorPOPMarkingValidationScreen.tsx
git commit -m "feat(pop-validation): add validation-specific styles"
```

---

## Task 10: Final Integration and Type Check

**Step 1: Run TypeScript compilation check**

```bash
npx tsc --noEmit
```

Expected: No type errors

**Step 2: Fix any type errors if present**

If there are type errors, fix them and run `npx tsc --noEmit` again.

**Step 3: Final commit**

```bash
git add -A
git commit -m "chore: fix any remaining type issues in POP marking validation screen"
```

---

## Summary of Changes

| File | Changes |
|------|---------|
| `src/components/Inspector/InspectorPOPMarkingValidationScreen.tsx` | New file - complete validation screen |
| `src/components/Inspector/InspectorLayoutNavigator.tsx` | Import + register new screen route |
| `src/components/Inspector/MLDetectionScreen.tsx` | Update navigation to go to validation screen |

## Testing Checklist

- [ ] Screen appears after MLDetectionScreen
- [ ] When POP marking detected: displays SolidPopMarking/LiquidPopMarking correctly
- [ ] Field B validation works against packagingDatabaseV2
- [ ] Field C validation shows correct allowable packing groups
- [ ] Editing fields triggers re-validation
- [ ] "Create Frustration" button appears for invalid fields
- [ ] After frustration created, field shows "frustrated" state
- [ ] Continue button disabled until all fields valid or frustrated
- [ ] When no POP detected: shows "Enter Manually" and "Mark as Missing" options
- [ ] "Enter Manually" navigates to InspectorPOPMarkingDataEntry
- [ ] "Mark as Missing" creates frustration and enables Continue
- [ ] Continue navigates to correct material-specific screen based on UN number
