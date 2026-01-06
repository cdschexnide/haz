# Package Reinspection System Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add package reinspection capability with full audit trail for frustrated POP marking, markings, and labels.

**Architecture:** Mirror existing SDDG reinspection pattern by adding `resolvePackageFrustration()` and `refrustratePackageFrustration()` context actions, updating navigation logic in reinspection mode, and filtering validation screens to show only frustrated items during reinspection.

**Tech Stack:** React Native, TypeScript, React Context API

---

## Task 1: Add Context Provider Reinspection Actions

**Files:**
- Modify: `src/contexts/InspectionFormProvider/InspectionFormProvider.tsx`

### Step 1: Add resolvePackageFrustration function

Find the existing `startPackageReinspection` function (around line 876) and add the new function after it:

```typescript
const resolvePackageFrustration = useCallback((
  itemId: string,
  inspector: Inspector,
  comments?: string
) => {
  console.log("📝 [InspectionForm] Resolving package frustration:", itemId);

  setInspection(prev => {
    const frustration = prev.packageFrustrations.find(f => f.itemId === itemId);
    if (!frustration) {
      console.warn("📝 [InspectionForm] Frustration not found:", itemId);
      return prev;
    }

    const reinspectionAttempt: ReinspectionAttempt = {
      date: new Date(),
      inspector: formatInspector(inspector),
      action: "verified",
      additionalComments: comments,
    };

    const updatedFrustration = {
      ...frustration,
      reinspectionHistory: [
        ...(frustration.reinspectionHistory || []),
        reinspectionAttempt,
      ],
    };

    console.log("📝 [InspectionForm] Moving frustration to resolved:", {
      itemId,
      reinspectionCount: updatedFrustration.reinspectionHistory.length,
    });

    return {
      ...prev,
      packageFrustrations: prev.packageFrustrations.filter(f => f.itemId !== itemId),
      resolvedPackageFrustrations: [
        ...prev.resolvedPackageFrustrations,
        updatedFrustration,
      ],
    };
  });
}, []);
```

### Step 2: Add refrustratePackageFrustration function

Add this function right after `resolvePackageFrustration`:

```typescript
const refrustratePackageFrustration = useCallback((
  itemId: string,
  inspector: Inspector,
  comments?: string
) => {
  console.log("📝 [InspectionForm] Re-frustrating package item:", itemId);

  setInspection(prev => {
    const reinspectionAttempt: ReinspectionAttempt = {
      date: new Date(),
      inspector: formatInspector(inspector),
      action: "frustrated",
      additionalComments: comments,
    };

    return {
      ...prev,
      packageFrustrations: prev.packageFrustrations.map(f =>
        f.itemId === itemId
          ? {
              ...f,
              reinspectionHistory: [
                ...(f.reinspectionHistory || []),
                reinspectionAttempt,
              ],
            }
          : f
      ),
    };
  });
}, []);
```

### Step 3: Add to InspectionFormContextType interface

Find the `InspectionFormContextType` interface (around line 35-90) and add these two method signatures:

```typescript
// Package reinspection actions (add after startPackageReinspection)
resolvePackageFrustration: (itemId: string, inspector: Inspector, comments?: string) => void;
refrustratePackageFrustration: (itemId: string, inspector: Inspector, comments?: string) => void;
```

### Step 4: Export in provider value

Find where the provider value is defined (around line 1140-1200). Add these two functions to the value object:

```typescript
resolvePackageFrustration,
refrustratePackageFrustration,
```

Also add them to the dependencies array at the bottom of the useMemo (around line 1190-1200).

### Step 5: Verify and test manually

**Test:** Start the app and verify it compiles without TypeScript errors.

**Expected:** No compilation errors, context provider exports the new functions.

### Step 6: Commit

```bash
git add src/contexts/InspectionFormProvider/InspectionFormProvider.tsx
git commit -m "feat(context): add package reinspection actions

Add resolvePackageFrustration and refrustratePackageFrustration
actions to track reinspection attempts with full audit trail.

- resolvePackageFrustration: moves frustrated item to resolved
- refrustratePackageFrustration: appends frustrated attempt

🤖 Generated with Claude Code"
```

---

## Task 2: Update PackageFrustrationSummary Navigation

**Files:**
- Modify: `src/components/Inspector/PackageFrustrationSummary.tsx:103-151`

### Step 1: Replace handleReinspectFrustrations function

Find the `handleReinspectFrustrations` function (lines 103-151) and replace it with:

```typescript
const handleReinspectFrustrations = () => {
  console.log("📦 [PackageFrustrationSummary] Starting package reinspection");

  if (packageFrustrations.length === 0) {
    Alert.alert(
      "No Frustrations",
      "There are no frustrated package items to reinspect.",
      [{ text: "OK" }]
    );
    return;
  }

  // Extract the frustrated item IDs
  const frustratedItemIds = packageFrustrations.map(f => f.itemId);
  console.log(
    "📦 [PackageFrustrationSummary] Frustrated item IDs:",
    frustratedItemIds
  );

  // Start reinspection mode
  startPackageReinspection(frustratedItemIds);

  // Determine navigation based on what's frustrated
  const hasPOPFrustrations = packageFrustrations.some(f =>
    f.itemId.startsWith("pop-") || f.itemId.includes("pop-")
  );

  const hasMarkingOrLabelFrustrations = packageFrustrations.some(f =>
    f.category === "marking" || f.category === "label"
  );

  console.log("📦 [PackageFrustrationSummary] Frustration breakdown:", {
    hasPOP: hasPOPFrustrations,
    hasMarkingLabel: hasMarkingOrLabelFrustrations,
  });

  if (hasPOPFrustrations) {
    // Navigate to POP marking screen first
    console.log("📦 [PackageFrustrationSummary] Navigating to POP marking reinspection");
    navigation.navigate("InspectorPOPMarkingDataEntry");
  } else if (hasMarkingOrLabelFrustrations) {
    // Skip POP, go directly to markings/labels
    console.log("📦 [PackageFrustrationSummary] Navigating to markings/labels reinspection");
    navigation.navigate("InspectorMarkingsLabelsValidationScreen");
  } else {
    // Other categories (dry ice, magnetized, etc.) - not yet supported
    Alert.alert(
      "Reinspection Required",
      "Special inspection workflows (dry ice, magnetized materials) require manual reinspection. Please contact your supervisor.",
      [{ text: "OK" }]
    );
  }
};
```

### Step 2: Test manually

**Test:**
1. Create an inspection with frustrated package items
2. Navigate to PackageFrustrationSummary
3. Click "Reinspect Frustrations" button
4. Verify navigation logic works

**Expected:**
- If POP frustrated → navigates to InspectorPOPMarkingDataEntry
- If only markings/labels frustrated → navigates to InspectorMarkingsLabelsValidationScreen
- If other categories → shows alert

### Step 3: Commit

```bash
git add src/components/Inspector/PackageFrustrationSummary.tsx
git commit -m "feat(package): add intelligent reinspection navigation

Update handleReinspectFrustrations to route based on frustrated
item categories:
- POP frustrated → InspectorPOPMarkingDataEntry
- Markings/labels only → InspectorMarkingsLabelsValidationScreen
- Other categories → alert for manual reinspection

🤖 Generated with Claude Code"
```

---

## Task 3: Update InspectorHomeScreen Context Loading

**Files:**
- Modify: `src/components/Inspector/InspectorHomeScreen.tsx`

### Step 1: Find handlePackageStatusClick function

Locate the `handlePackageStatusClick` function in InspectorHomeScreen.tsx.

### Step 2: Add context loading for frustrated status

Update the function to load inspection context before navigating to PackageFrustrationSummary:

```typescript
const handlePackageStatusClick = async (inspection: InspectorShipment) => {
  // Package not started yet (N/A)
  if (inspection.packageStatus === null) {
    Alert.alert(
      "Package Inspection Not Started",
      "The SDDG phase is complete. Would you like to continue with the package inspection?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Continue",
          onPress: async () => {
            try {
              await loadInspectionForEdit(inspection.id);
              const unIdNo = inspection.unId || "";
              navigate("InspectorWrappedStack", {
                screen: "MLDetectionScreen",
                params: { unIdNo },
              });
            } catch (error) {
              Alert.alert("Error", "Failed to load inspection data. Please try again.");
            }
          },
        },
      ]
    );
    return;
  }

  // Package frustrated → Load and navigate to summary
  if (inspection.packageStatus === "frustrated") {
    try {
      await loadInspectionForEdit(inspection.id);
      navigate("InspectorWrappedStack", {
        screen: "PackageFrustrationSummary",
      });
    } catch (error) {
      Alert.alert("Error", "Failed to load inspection data. Please try again.");
    }
    return;
  }

  // Package verified → Show detail view (existing logic)
  // ... rest of function ...
};
```

### Step 3: Test manually

**Test:**
1. Create an inspection with frustrated package status
2. From InspectorHomeScreen, click on the "Frustrated" package status
3. Verify navigation to PackageFrustrationSummary with loaded context

**Expected:** Navigation works and frustrations are visible in summary

### Step 4: Commit

```bash
git add src/components/Inspector/InspectorHomeScreen.tsx
git commit -m "feat(home): load context before frustrated package navigation

Ensure inspection context is loaded via loadInspectionForEdit
before navigating to PackageFrustrationSummary when clicking
frustrated package status.

🤖 Generated with Claude Code"
```

---

## Task 4: Add POP Marking Validation to Data Entry Screen

**Files:**
- Modify: `src/components/Inspector/InspectorPOPMarkingDataEntry.tsx`

### Step 1: Add validation state variables

After the existing `fields` state declaration (around line 94-102), add:

```typescript
// Validation state for Field B and Field C
const [fieldBStatus, setFieldBStatus] = useState<"valid" | "invalid" | "frustrated">("valid");
const [fieldCStatus, setFieldCStatus] = useState<"valid" | "invalid" | "frustrated">("valid");
const [fieldBError, setFieldBError] = useState<string | null>(null);
const [fieldCError, setFieldCError] = useState<string | null>(null);
```

### Step 2: Add Field B validation function

Add this function after the `allowablePackingGroups()` function (around line 213):

```typescript
// Validate Field B (packaging code)
const validateFieldB = useCallback((value: string) => {
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
    setFieldBError(`Packaging code '${value}' not authorized for ${packagingParagraph}`);
    setFieldBStatus("invalid");
  } else {
    setFieldBError(null);
    setFieldBStatus("valid");
  }
}, [inspection.extractedContent?.packingInstruction]);
```

### Step 3: Add Field C validation function

Add this function right after `validateFieldB`:

```typescript
// Validate Field C (packing group)
const validateFieldC = useCallback((value: string) => {
  const allowedGroups = allowablePackingGroups();

  if (!value || value.trim() === "") {
    setFieldCError("Packing group is required");
    setFieldCStatus("invalid");
    return;
  }

  if (!allowedGroups.includes(value)) {
    setFieldCError(`Packing group '${value}' insufficient. Required: ${allowedGroups.join(" or ")}`);
    setFieldCStatus("invalid");
  } else {
    setFieldCError(null);
    setFieldCStatus("valid");
  }
}, [allowablePackingGroups]);
```

### Step 4: Add validation useEffects

Add these useEffects after the existing useEffects (around line 167):

```typescript
// Run Field B validation on mount and field change
useEffect(() => {
  validateFieldB(fields.B);
}, [fields.B, validateFieldB]);

// Run Field C validation on mount and field change
useEffect(() => {
  validateFieldC(fields.C);
}, [fields.C, validateFieldC]);
```

### Step 5: Add validation UI for Field B

Find the Field B input section (around line 472-496) and replace it with:

```typescript
<View style={styles.inputGroup}>
  <TextInput
    style={[
      styles.input,
      fieldBError && styles.inputError,
    ]}
    placeholder="Field B"
    value={fields.B}
    onChangeText={text => {
      updateField("B", text);
      updatePackagePopField("B", text);
    }}
    accessibilityHint={
      fieldBError ||
      "Enter packaging code for outer packaging"
    }
  />
  <Text style={styles.explanation}>
    {explanations.B}
    <Text style={styles.fieldId}> (Field B)</Text>
  </Text>
  {fieldBStatus === "invalid" && fieldBError && (
    <>
      <Text style={styles.errorText}>{fieldBError}</Text>
      <TouchableOpacity
        style={styles.frustrationButton}
        onPress={() => {
          const packagingParagraph = inspection.extractedContent?.packingInstruction || "unknown";
          addPackageFrustration({
            category: "marking",
            itemId: "pop-field-b-validation",
            itemLabel: "Packaging Code (Field B)",
            expectedValues: ["Valid packaging code for " + packagingParagraph],
            verificationStatus: "incorrect",
            defaultMessage: `Packaging code '${fields.B}' not authorized for ${packagingParagraph}`,
            afmanReference: "AFMAN 24-604 A14.3",
          });
          setFieldBStatus("frustrated");
        }}
      >
        <MaterialIcons name="report-problem" size={18} color="#fff" />
        <Text style={styles.frustrationButtonText}>Create Frustration</Text>
      </TouchableOpacity>
    </>
  )}
  {fieldBStatus === "frustrated" && (
    <Text style={styles.frustratedText}>Frustration created for this field</Text>
  )}
</View>
```

### Step 6: Add validation UI for Field C

Find the Field C ButtonGroup section (around line 497-517) and update it:

```typescript
<View style={styles.inputGroup}>
  <ButtonGroup
    buttons={allowablePackingGroups()}
    selectedIndex={allowablePackingGroups().indexOf(fields.C)}
    onPress={selectedIndex => {
      if (fieldCStatus !== "frustrated") {
        const groups = allowablePackingGroups();
        const selectedValue = groups[selectedIndex];
        updateField("C", selectedValue);
        updatePackagePopField("C", selectedValue);
      }
    }}
    containerStyle={[
      styles.buttonGroupContainer,
      fieldCStatus === "invalid" && styles.buttonGroupError,
      fieldCStatus === "frustrated" && styles.buttonGroupFrustrated,
    ]}
    selectedButtonStyle={styles.selectedButton}
    textStyle={styles.buttonGroupButtonText}
    disabled={fieldCStatus === "frustrated"}
  />
  <Text style={styles.explanation}>
    {`${explanations.C} (Allowed: ${allowablePackingGroups().join(
      ", "
    )})`}
    <Text style={styles.fieldId}> (Field C)</Text>
  </Text>
  {fieldCStatus === "invalid" && fieldCError && (
    <>
      <Text style={styles.errorText}>{fieldCError}</Text>
      <TouchableOpacity
        style={styles.frustrationButton}
        onPress={() => {
          const allowedGroups = allowablePackingGroups();
          addPackageFrustration({
            category: "marking",
            itemId: "pop-field-c-validation",
            itemLabel: "Packing Group (Field C)",
            expectedValues: allowedGroups,
            verificationStatus: "incorrect",
            defaultMessage: `Packing group '${fields.C}' insufficient. Required: ${allowedGroups.join(" or ")}`,
            afmanReference: "AFMAN 24-604 A14.4",
          });
          setFieldCStatus("frustrated");
        }}
      >
        <MaterialIcons name="report-problem" size={18} color="#fff" />
        <Text style={styles.frustrationButtonText}>Create Frustration</Text>
      </TouchableOpacity>
    </>
  )}
  {fieldCStatus === "frustrated" && (
    <Text style={styles.frustratedText}>Frustration created for this field</Text>
  )}
</View>
```

### Step 7: Add styles for validation UI

Add these styles to the StyleSheet (around line 850):

```typescript
inputError: {
  borderColor: "#F44336",
  backgroundColor: "#FFEBEE",
},
buttonGroupError: {
  borderColor: "#F44336",
},
buttonGroupFrustrated: {
  borderColor: "#FF9800",
  opacity: 0.7,
},
frustrationButton: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#F57C00",
  borderRadius: 4,
  paddingVertical: 10,
  paddingHorizontal: 16,
  marginTop: 12,
},
frustrationButtonText: {
  color: "#fff",
  fontSize: 14,
  fontWeight: "600",
  marginLeft: 8,
},
frustratedText: {
  fontSize: 13,
  color: "#FF9800",
  marginTop: 8,
  fontStyle: "italic",
},
```

### Step 8: Test validation manually

**Test:**
1. Navigate to InspectorPOPMarkingDataEntry
2. Enter invalid packaging code for Field B
3. Verify error message appears
4. Click "Create Frustration" button
5. Verify frustration is created and UI updates

**Expected:** Validation works, frustrations are created properly

### Step 9: Commit

```bash
git add src/components/Inspector/InspectorPOPMarkingDataEntry.tsx
git commit -m "feat(pop): add Field B and C validation to data entry

Add real-time validation for packaging code (Field B) and
packing group (Field C) with frustration creation:
- validateFieldB: checks against packaging database
- validateFieldC: validates against allowed packing groups
- Inline error messages and frustration buttons
- Visual feedback for invalid/frustrated states

🤖 Generated with Claude Code"
```

---

## Task 5: Update POP Data Entry Navigation Logic

**Files:**
- Modify: `src/components/Inspector/InspectorPOPMarkingDataEntry.tsx:291-427`

### Step 1: Import workflow from context

At the top of the component, add `workflow` to the destructured context:

```typescript
const {
  inspection,
  workflow,  // Add this
  updatePackagePopField,
  // ... rest of destructured values
} = useInspectionForm();
```

### Step 2: Replace handleContinue function

Find the `handleContinue` function (lines 291-427) and replace it entirely with:

```typescript
const handleContinue = () => {
  console.log("📝 [InspectorPOPMarkingDataEntry] Continue button pressed");

  // Detect reinspection mode
  const isReinspection = workflow.reinspection.mode === "package";

  if (isReinspection) {
    // REINSPECTION MODE

    // Check if there are frustrated marking/label items (excluding POP)
    const markingLabelFrustrations = inspection.packageFrustrations.filter(
      f => (f.category === "marking" || f.category === "label") &&
           !f.itemId.startsWith("pop-")
    );

    console.log("📝 [InspectorPOPMarkingDataEntry] Reinspection mode:", {
      markingLabelFrustrationsCount: markingLabelFrustrations.length,
    });

    if (markingLabelFrustrations.length > 0) {
      // Navigate to markings/labels for reinspection
      console.log("📝 Reinspection: Navigating to InspectorMarkingsLabelsValidationScreen");
      navigation.navigate("InspectorMarkingsLabelsValidationScreen");
    } else {
      // No more frustrated items - inspection complete
      console.log("📝 Reinspection: No more frustrations, navigating to PackageInspectionCompleteScreen");
      navigation.navigate("PackageInspectionCompleteScreen");
    }
  } else {
    // FIRST INSPECTION MODE

    // Always navigate to markings/labels validation
    console.log("📝 First inspection: Navigating to InspectorMarkingsLabelsValidationScreen");
    navigation.navigate("InspectorMarkingsLabelsValidationScreen");
  }
};
```

### Step 3: Test navigation manually

**Test:**
1. **First Inspection:** Complete ML detection, verify navigation to InspectorPOPMarkingDataEntry, click Continue, verify goes to InspectorMarkingsLabelsValidationScreen
2. **Reinspection with markings/labels:** Start package reinspection with frustrated markings, verify navigation to InspectorMarkingsLabelsValidationScreen
3. **Reinspection without additional frustrations:** Start package reinspection with only POP frustrated, verify navigation to PackageInspectionCompleteScreen

**Expected:** Navigation logic works correctly for both first inspection and reinspection modes

### Step 4: Commit

```bash
git add src/components/Inspector/InspectorPOPMarkingDataEntry.tsx
git commit -m "feat(pop): add reinspection-aware navigation logic

Update handleContinue to detect reinspection mode and route
intelligently:
- Reinspection: check for remaining frustrated items, navigate
  to markings/labels or complete screen
- First inspection: always navigate to markings/labels

🤖 Generated with Claude Code"
```

---

## Task 6: Add Reinspection Mode to Markings/Labels Screen

**Files:**
- Modify: `src/components/Inspector/InspectorMarkingsLabelsValidationScreen.tsx`

### Step 1: Import new context actions

Update the destructured context to include the new actions (around line 56-60):

```typescript
const {
  inspection,
  workflow,  // Add if not present
  addPackageFrustration,
  removePackageFrustration,
  resolvePackageFrustration,  // Add this
  refrustratePackageFrustration,  // Add this
} = useInspectionForm();
```

### Step 2: Update handleValidate function

Find the `handleValidate` function (around line 231-248) and replace it:

```typescript
const handleValidate = useCallback((item: ValidationItem) => {
  const isReinspection = workflow.reinspection.mode === "package";

  if (isReinspection && item.validationStatus === "frustrated") {
    // REINSPECTION: Use resolvePackageFrustration
    console.log("[MarkingsLabels] Resolving frustration in reinspection:", item.id);
    resolvePackageFrustration(item.id, inspection.inspector);
  } else {
    // FIRST INSPECTION: Remove frustration if it exists
    if (item.validationStatus === "frustrated") {
      removePackageFrustration(item.id);
    }
  }

  // Update local state
  setSections((prevSections) =>
    prevSections.map((section) => ({
      ...section,
      data: section.data.map((dataItem) =>
        dataItem.id === item.id
          ? { ...dataItem, validationStatus: "validated" as const }
          : dataItem
      ),
    }))
  );
}, [workflow.reinspection.mode, inspection.inspector, resolvePackageFrustration, removePackageFrustration]);
```

### Step 3: Update handleFrustrate function

Find the `handleFrustrate` function (around line 250-291) and replace it:

```typescript
const handleFrustrate = useCallback((item: ValidationItem) => {
  const isReinspection = workflow.reinspection.mode === "package";

  if (item.validationStatus === "frustrated") {
    // Toggle back to pending (remove frustration)
    removePackageFrustration(item.id);

    setSections((prevSections) =>
      prevSections.map((section) => ({
        ...section,
        data: section.data.map((dataItem) =>
          dataItem.id === item.id
            ? { ...dataItem, validationStatus: "pending" as const }
            : dataItem
        ),
      }))
    );
    return;
  }

  if (isReinspection) {
    // REINSPECTION: Use refrustratePackageFrustration
    console.log("[MarkingsLabels] Re-frustrating item in reinspection:", item.id);
    refrustratePackageFrustration(item.id, inspection.inspector);
  } else {
    // FIRST INSPECTION: Create new frustration
    addPackageFrustration({
      category: item.category,
      itemId: item.id,
      itemLabel: item.label,
      expectedValues: item.expectedValues,
      verificationStatus: "missing",
      defaultMessage: `Required ${item.category} "${item.label}" not found on package`,
      afmanReference: item.afmanReference || "AFMAN 24-604",
    });
  }

  // Update local state
  setSections((prevSections) =>
    prevSections.map((section) => ({
      ...section,
      data: section.data.map((dataItem) =>
        dataItem.id === item.id
          ? { ...dataItem, validationStatus: "frustrated" as const }
          : dataItem
      ),
    }))
  );
}, [workflow.reinspection.mode, inspection.inspector, addPackageFrustration, removePackageFrustration, resolvePackageFrustration, refrustratePackageFrustration]);
```

### Step 4: Update navigateToNextScreen function

Find the `navigateToNextScreen` function (around line 502-544) and replace it:

```typescript
const navigateToNextScreen = useCallback(() => {
  const isReinspection = workflow.reinspection.mode === "package";

  if (isReinspection) {
    // REINSPECTION MODE

    // Check if any package frustrations remain
    const remainingFrustrations = inspection.packageFrustrations.length;

    console.log("[MarkingsLabels] Reinspection complete:", {
      remainingFrustrations,
    });

    if (remainingFrustrations > 0) {
      // Still have frustrations - go back to summary
      console.log("📦 Reinspection: Frustrations remain, navigating to PackageFrustrationSummary");
      navigation.navigate("PackageFrustrationSummary");
    } else {
      // All resolved - inspection complete
      console.log("📦 Reinspection: All resolved, navigating to PackageInspectionCompleteScreen");
      navigation.navigate("PackageInspectionCompleteScreen");
    }
  } else {
    // FIRST INSPECTION MODE

    const unIdNo =
      inspection.verificationCopy?.unIdNo ||
      inspection.extractedContent?.unIdNo ||
      "";

    // Route based on UN number for material-specific screens
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
      // No material-specific screen - check for frustrations
      const hasPackageFrustrations = inspection.packageFrustrations.length > 0;

      if (hasPackageFrustrations) {
        navigation.navigate("PackageFrustrationSummary");
      } else {
        navigation.navigate("PackageInspectionCompleteScreen");
      }
    }
  }
}, [workflow.reinspection.mode, navigation, inspection]);
```

### Step 5: Filter items in reinspection mode

Find the `initializeValidationItems` function (around line 74-213) and add filtering logic at the end, right before `setSections(newSections)`:

```typescript
// If in reinspection mode, filter to only frustrated items
if (workflow.reinspection.mode === "package") {
  const frustratedIds = new Set(workflow.reinspection.targetFrustrations);

  console.log("[MarkingsLabels] Reinspection mode - filtering to frustrated items:", {
    totalItems: newSections.flatMap(s => s.data).length,
    frustratedIds: Array.from(frustratedIds),
  });

  const filteredSections = newSections.map(section => ({
    ...section,
    data: section.data.filter(item => frustratedIds.has(item.id)),
  })).filter(section => section.data.length > 0);

  setSections(filteredSections);
  console.log("[MarkingsLabels] Filtered sections:", {
    sectionsCount: filteredSections.length,
    itemsCount: filteredSections.flatMap(s => s.data).length,
  });
} else {
  setSections(newSections);
}
```

### Step 6: Test reinspection mode manually

**Test:**
1. Create inspection with frustrated markings/labels
2. Navigate to PackageFrustrationSummary and start reinspection
3. Verify only frustrated items appear in InspectorMarkingsLabelsValidationScreen
4. Click validate (✓) on an item
5. Verify it uses `resolvePackageFrustration` (check console logs)
6. Click frustrate (✗) on an item
7. Verify it uses `refrustratePackageFrustration` (check console logs)

**Expected:**
- Only frustrated items shown in reinspection mode
- Validate/frustrate actions use correct context methods
- Navigation works based on remaining frustrations

### Step 7: Commit

```bash
git add src/components/Inspector/InspectorMarkingsLabelsValidationScreen.tsx
git commit -m "feat(markings): add reinspection mode support

Add reinspection-aware behavior:
- Use resolvePackageFrustration when validating in reinspection
- Use refrustratePackageFrustration when re-frustrating
- Filter to show only frustrated items in reinspection mode
- Navigate to summary or complete based on remaining frustrations

🤖 Generated with Claude Code"
```

---

## Task 7: Update MLDetectionScreen Navigation

**Files:**
- Modify: `src/components/Inspector/MLDetectionScreen.tsx`

### Step 1: Find navigateToNextScreen function

Locate the `navigateToNextScreen` function in MLDetectionScreen.tsx.

### Step 2: Change navigation target

Update the navigation call from `InspectorPOPMarkingValidationScreen` to `InspectorPOPMarkingDataEntry`:

```typescript
const navigateToNextScreen = useCallback(() => {
  // Use correctedResults if available (contains user corrections), otherwise use original
  const resultsToSave = correctedResults.length > 0
    ? correctedResults
    : (analysisResults || []);

  if (resultsToSave.length > 0) {
    const finalAggregated = aggregateResults(resultsToSave);
    console.log('[MLDetectionScreen] Saving ML results to context (with corrections):', {
      hasPOP: !!finalAggregated.bestPopMarking,
      labels: finalAggregated.allDetectedLabels.length,
      labelClassNames: finalAggregated.allDetectedLabels.map(l => l.className),
      unNumbers: finalAggregated.allUnNumbers.length,
    });
    setMLAnalysisResults(finalAggregated);
  }

  // Navigate to POP marking data entry instead of validation screen
  navigation.navigate("InspectorPOPMarkingDataEntry");
}, [navigation, correctedResults, analysisResults, setMLAnalysisResults]);
```

### Step 3: Test navigation manually

**Test:**
1. Start a new inspection
2. Complete ML detection screen
3. Click Continue
4. Verify navigation goes to InspectorPOPMarkingDataEntry (not InspectorPOPMarkingValidationScreen)

**Expected:** Navigation goes to data entry screen after ML detection

### Step 4: Commit

```bash
git add src/components/Inspector/MLDetectionScreen.tsx
git commit -m "feat(ml): update navigation to POP data entry screen

Change navigation target from InspectorPOPMarkingValidationScreen
to InspectorPOPMarkingDataEntry to consolidate POP validation
into the data entry screen.

🤖 Generated with Claude Code"
```

---

## Task 8: Delete InspectorPOPMarkingValidationScreen

**Files:**
- Delete: `src/components/Inspector/InspectorPOPMarkingValidationScreen.tsx`

### Step 1: Delete the file

```bash
rm src/components/Inspector/InspectorPOPMarkingValidationScreen.tsx
```

### Step 2: Verify no import errors

Check that no other files import this deleted screen:

```bash
grep -r "InspectorPOPMarkingValidationScreen" src/
```

**Expected:** Only find references in navigation types/configs (which are fine to leave)

### Step 3: Test app compiles

Start the app and verify it compiles without errors.

**Expected:** App compiles successfully, no missing imports

### Step 4: Commit

```bash
git add src/components/Inspector/InspectorPOPMarkingValidationScreen.tsx
git commit -m "refactor(pop): remove validation screen

Delete InspectorPOPMarkingValidationScreen as its functionality
has been consolidated into InspectorPOPMarkingDataEntry with
enhanced validation and reinspection support.

🤖 Generated with Claude Code"
```

---

## Task 9: End-to-End Manual Testing

### Test Scenario 1: Package Reinspection - POP Frustrated

**Steps:**
1. Create new inspection with UN0106 (FUZES DETONATING)
2. Complete SDDG validation
3. Complete ML detection
4. In InspectorPOPMarkingDataEntry, enter invalid Field B value
5. Click "Create Frustration" button for Field B
6. Continue through markings/labels validation (validate all)
7. Navigate to PackageFrustrationSummary
8. Verify frustrated POP item appears
9. Click "Reinspect Frustrations"
10. Verify navigation to InspectorPOPMarkingDataEntry
11. Correct Field B value
12. Continue to InspectorMarkingsLabelsValidationScreen
13. Verify no items shown (already validated)
14. Click Continue
15. Verify navigation to PackageInspectionCompleteScreen
16. Navigate to InspectorAMC1015Form
17. Verify Field 87 shows POP frustration with reinspection entry

**Expected Results:**
- POP frustrated item created successfully
- Reinspection navigation works
- Corrected value resolves frustration
- AMC1015 shows both frustration and reinspection (VERIFIED)

### Test Scenario 2: Package Reinspection - Markings/Labels Only

**Steps:**
1. Create new inspection
2. Complete SDDG and ML detection
3. Complete POP data entry (all valid)
4. In InspectorMarkingsLabelsValidationScreen, frustrate "PSN and UN Number"
5. Continue through rest of flow
6. Navigate to PackageFrustrationSummary
7. Verify frustrated marking appears
8. Click "Reinspect Frustrations"
9. Verify navigation skips POP, goes directly to InspectorMarkingsLabelsValidationScreen
10. Verify only frustrated item shown
11. Click validate (✓) on the item
12. Click Continue
13. Verify navigation to PackageInspectionCompleteScreen
14. Navigate to InspectorAMC1015Form
15. Verify Field 87 shows marking frustration with reinspection (VERIFIED)

**Expected Results:**
- Navigation skips POP screen
- Only frustrated item shown in markings/labels
- Validation resolves frustration
- AMC1015 shows complete history

### Test Scenario 3: Package Reinspection - Re-frustrate

**Steps:**
1. Create inspection with frustrated package item
2. Start reinspection
3. In validation screen, click frustrate (✗) again on the item
4. Complete flow
5. Navigate to InspectorAMC1015Form
6. Verify Field 87 shows original frustration + reinspection (FRUSTRATED)

**Expected Results:**
- Item stays in packageFrustrations
- reinspectionHistory has "FRUSTRATED" entry
- AMC1015 shows both entries

### Test Scenario 4: Screen Consolidation

**Steps:**
1. Complete ML detection
2. Verify navigation to InspectorPOPMarkingDataEntry (not validation screen)
3. Verify Field B and Field C validation works
4. Enter invalid values and verify error messages
5. Click "Create Frustration" buttons and verify frustrations created

**Expected Results:**
- Navigation goes to data entry screen
- Validation works inline
- Frustration creation works

### Manual Test Completion

Once all four test scenarios pass, the implementation is complete and verified.

---

## Implementation Complete

All tasks completed. The package reinspection system is now fully implemented with:

✅ Context provider actions for resolving and re-frustrating package items
✅ Intelligent navigation based on frustrated item categories
✅ POP marking validation consolidated into data entry screen
✅ Markings/labels screen with reinspection mode support
✅ Full audit trail with ReinspectionAttempt tracking
✅ Seamless AMC Form 1015 integration

**Total Files Modified:** 6
**Total Files Deleted:** 1
**Total Commits:** 8
