# Package Reinspection System Design

**Date:** 2026-01-06
**Author:** Claude Code (Sonnet 4.5)
**Status:** Approved for Implementation

---

## Executive Summary

This design adds package reinspection capability to the hazmat inspection workflow, mirroring the existing SDDG reinspection system. Inspectors can reinspect frustrated package items (UN Specification Package Marking, Markings, and Labels) with full audit trail tracking. All reinspection attempts are automatically documented in AMC Form 1015 Field 87.

---

## Design Principles

1. **Consistency with SDDG Reinspection** - Follow the same patterns as existing SDDG reinspection
2. **Audit Trail** - Every reinspection creates a `ReinspectionAttempt` entry with date, inspector, action (verified/frustrated), and comments
3. **Navigation Intelligence** - Skip screens that don't have frustrated items during reinspection
4. **Form 1015 Integration** - Reinspection history automatically appears in AMC Form 1015 Field 87 (comments section)

---

## Architecture Overview

### Reinspection Workflow State

The existing `workflow.reinspection` state in InspectionFormProvider tracks reinspection mode:

```typescript
reinspection: {
  mode: null | "sddg" | "package";  // What type of reinspection
  targetFrustrations: string[];      // IDs of items being reinspected
  currentIndex: number;              // Which item (unused for package)
  totalItems: number;                // Total count
}
```

When `mode === "package"`, the system is in package reinspection mode.

### Data Structures

Both `FrustrationRecord` (SDDG) and `PackageFrustrationRecord` (Package) already have:

```typescript
reinspectionHistory?: ReinspectionAttempt[];

interface ReinspectionAttempt {
  date: Date;
  inspector: string;
  action: "verified" | "frustrated";
  additionalComments?: string;
}
```

---

## Complete Workflow

```
InspectorHomeScreen
  ↓ (click "Frustrated" package status)
  ↓ (load inspection context)
PackageFrustrationSummary
  ↓ (click "Reinspect Frustrations")
  ↓ (call startPackageReinspection())
  ↓
[Check: POP frustrated?]
  ↓
Yes → InspectorPOPMarkingDataEntry (reinspection mode)
  ↓     - Validate/Frustrate Field B, Field C, etc.
  ↓     - Record reinspection attempts
  ↓
No → Skip to InspectorMarkingsLabelsValidationScreen
  ↓
InspectorMarkingsLabelsValidationScreen (reinspection mode)
  ↓ - Show only frustrated items
  ↓ - Validate ✓ → resolvePackageFrustration()
  ↓ - Frustrate ✗ → refrustratePackageFrustration()
  ↓
[Check: Any remaining frustrations?]
  ↓
Yes → PackageFrustrationSummary (review remaining)
No → PackageInspectionCompleteScreen
```

---

## Screen-Specific Behavior

### 1. PackageFrustrationSummary

**File:** `src/components/Inspector/PackageFrustrationSummary.tsx`

**Changes to `handleReinspectFrustrations()` (lines 103-151):**

```typescript
const handleReinspectFrustrations = () => {
  if (packageFrustrations.length === 0) {
    Alert.alert("No Frustrations", "There are no frustrated package items to reinspect.");
    return;
  }

  // Extract the frustrated item IDs
  const frustratedItemIds = packageFrustrations.map(f => f.itemId);

  // Start reinspection mode
  startPackageReinspection(frustratedItemIds);

  // Determine navigation based on what's frustrated
  const hasPOPFrustrations = packageFrustrations.some(f =>
    f.itemId.startsWith("pop-") || f.itemId.includes("pop-")
  );

  const hasMarkingOrLabelFrustrations = packageFrustrations.some(f =>
    f.category === "marking" || f.category === "label"
  );

  if (hasPOPFrustrations) {
    // Navigate to POP marking screen first
    console.log("📦 Navigating to POP marking reinspection");
    navigation.navigate("InspectorPOPMarkingDataEntry");
  } else if (hasMarkingOrLabelFrustrations) {
    // Skip POP, go directly to markings/labels
    console.log("📦 Navigating to markings/labels reinspection");
    navigation.navigate("InspectorMarkingsLabelsValidationScreen");
  } else {
    // Other categories (dry ice, magnetized, etc.) - not yet supported
    Alert.alert(
      "Reinspection Required",
      "Special inspection workflows require manual reinspection. Please contact your supervisor."
    );
  }
};
```

---

### 2. InspectorPOPMarkingDataEntry

**File:** `src/components/Inspector/InspectorPOPMarkingDataEntry.tsx`

#### Changes Needed:

1. **Add validation for Field B (Packaging Code) and Field C (Packing Group)**
2. **Add validation UI** (error messages, frustration buttons)
3. **Update `handleContinue()` navigation logic**

#### Validation Logic

```typescript
// Add validation state
const [fieldBStatus, setFieldBStatus] = useState<"valid" | "invalid" | "frustrated">("valid");
const [fieldCStatus, setFieldCStatus] = useState<"valid" | "invalid" | "frustrated">("valid");
const [fieldBError, setFieldBError] = useState<string | null>(null);
const [fieldCError, setFieldCError] = useState<string | null>(null);

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

// Run validation on mount and field change
useEffect(() => {
  validateFieldB(fields.B);
}, [fields.B, validateFieldB]);

useEffect(() => {
  validateFieldC(fields.C);
}, [fields.C, validateFieldC]);
```

#### Validation UI

Add frustration buttons for invalid fields:

```typescript
// After Field B input
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

// Similar UI for Field C
```

#### Navigation Logic

Replace existing `handleContinue()` logic (lines 291-427):

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

---

### 3. InspectorMarkingsLabelsValidationScreen

**File:** `src/components/Inspector/InspectorMarkingsLabelsValidationScreen.tsx`

#### Changes Needed:

1. **Detect reinspection mode** and filter to frustrated items only
2. **Use new context actions** for validate/frustrate in reinspection mode
3. **Update navigation logic** for reinspection completion

#### Reinspection Mode Detection

Add at top of component:

```typescript
const isReinspection = workflow.reinspection.mode === "package";
```

#### Update `handleValidate()` Function

```typescript
const handleValidate = useCallback((item: ValidationItem) => {
  const isReinspection = workflow.reinspection.mode === "package";

  if (isReinspection && item.validationStatus === "frustrated") {
    // REINSPECTION: Use resolvePackageFrustration
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

#### Update `handleFrustrate()` Function

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

#### Update `navigateToNextScreen()` Function

```typescript
const navigateToNextScreen = useCallback(() => {
  const isReinspection = workflow.reinspection.mode === "package";

  if (isReinspection) {
    // REINSPECTION MODE

    // Check if any package frustrations remain
    const remainingFrustrations = inspection.packageFrustrations.length;

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

#### Filter Items in Reinspection Mode

Update `initializeValidationItems()` to filter when in reinspection mode:

```typescript
const initializeValidationItems = useCallback(() => {
  // ... existing initialization logic ...

  // If in reinspection mode, filter to only frustrated items
  if (workflow.reinspection.mode === "package") {
    const frustratedIds = new Set(workflow.reinspection.targetFrustrations);

    const filteredSections = newSections.map(section => ({
      ...section,
      data: section.data.filter(item => frustratedIds.has(item.id)),
    })).filter(section => section.data.length > 0);

    setSections(filteredSections);
  } else {
    setSections(newSections);
  }
}, [inspection, workflow.reinspection]);
```

---

### 4. InspectorHomeScreen

**File:** `src/components/Inspector/InspectorHomeScreen.tsx`

#### Update `handlePackageStatusClick()`

Ensure inspection context is loaded before navigating to PackageFrustrationSummary:

```typescript
const handlePackageStatusClick = async (inspection: InspectorShipment) => {
  // Package not started yet (N/A)
  if (inspection.packageStatus === null) {
    // ... existing N/A handling ...
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

  // Package verified → Show detail view
  // ... existing verified handling ...
};
```

---

### 5. MLDetectionScreen

**File:** `src/components/Inspector/MLDetectionScreen.tsx`

#### Change Navigation Target

Update `navigateToNextScreen()` to navigate to `InspectorPOPMarkingDataEntry` instead of `InspectorPOPMarkingValidationScreen`:

```typescript
const navigateToNextScreen = useCallback(() => {
  // Use correctedResults if available (contains user corrections), otherwise use original
  const resultsToSave = correctedResults.length > 0
    ? correctedResults
    : (analysisResults || []);

  if (resultsToSave.length > 0) {
    const finalAggregated = aggregateResults(resultsToSave);
    console.log('[MLDetectionScreen] Saving ML results to context (with corrections)');
    setMLAnalysisResults(finalAggregated);
  }

  // Navigate to POP marking data entry instead of validation screen
  navigation.navigate("InspectorPOPMarkingDataEntry");
}, [navigation, correctedResults, analysisResults, setMLAnalysisResults]);
```

---

### 6. Delete InspectorPOPMarkingValidationScreen

**File:** `src/components/Inspector/InspectorPOPMarkingValidationScreen.tsx`

**Action:** Delete this entire file. Its functionality has been moved to `InspectorPOPMarkingDataEntry.tsx`.

---

## Context Provider Changes

**File:** `src/contexts/InspectionFormProvider/InspectionFormProvider.tsx`

### Add Two New Actions

#### 1. `resolvePackageFrustration(itemId, inspector, comments?)`

**Purpose:** Mark a frustrated package item as verified during reinspection

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

#### 2. `refrustratePackageFrustration(itemId, inspector, comments?)`

**Purpose:** Mark a frustrated package item as still frustrated during reinspection

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

### Add to Context Interface

```typescript
interface InspectionFormContextType {
  // ... existing properties ...

  // Package reinspection actions
  resolvePackageFrustration: (itemId: string, inspector: Inspector, comments?: string) => void;
  refrustratePackageFrustration: (itemId: string, inspector: Inspector, comments?: string) => void;
}
```

### Export in Provider Value

```typescript
const value = {
  // ... existing values ...
  resolvePackageFrustration,
  refrustratePackageFrustration,
};
```

---

## AMC Form 1015 Integration

**File:** `src/components/Inspector/InspectorAMC1015Form.tsx`

**Good news:** No changes needed!

The existing code (lines 236-257) already processes `reinspectionHistory` for package frustrations:

```typescript
// Add all reinspection attempts
if (frustration.reinspectionHistory && frustration.reinspectionHistory.length > 0) {
  frustration.reinspectionHistory.forEach(attempt => {
    const { formattedDate: reinspectDate, formattedTime: reinspectTime } =
      formatDateTime(new Date(attempt.date));
    const action = attempt.action === "verified" ? "VERIFIED" : "FRUSTRATED";
    const comments = attempt.additionalComments ? ` – ${attempt.additionalComments}` : "";

    allEntries.push({
      date: new Date(attempt.date),
      lineNumber,
      formatted: `${lineNumber}. – ${reinspectDate} @ ${reinspectTime} – REINSPECTED: ${action} – Inspector: ${formatInspector(attempt.inspector)}${comments}`,
    });
  });
}
```

Once we implement the context provider actions, reinspection history will automatically appear in Field 87.

---

## Testing Strategy

### Manual Testing Scenarios

1. **Package Reinspection - POP Frustrated**
   - Create inspection with frustrated POP Field B
   - Click "Frustrated" package status from home
   - Click "Reinspect Frustrations" from summary
   - Verify navigation to InspectorPOPMarkingDataEntry
   - Validate the field → check it moves to resolved
   - Verify AMC1015 shows reinspection entry

2. **Package Reinspection - Markings/Labels Only**
   - Create inspection with frustrated "PSN and UN Number" marking
   - Click "Frustrated" package status
   - Click "Reinspect Frustrations"
   - Verify skips POP screen, goes directly to Markings/Labels
   - Validate item → check it moves to resolved
   - Verify AMC1015 shows reinspection entry

3. **Package Reinspection - Mixed Items**
   - Create inspection with frustrated POP + Markings + Labels
   - Reinspect all items
   - Verify navigation flows correctly through screens
   - Verify all reinspection attempts appear in AMC1015

4. **Package Reinspection - Re-frustrate**
   - Create inspection with frustrated item
   - Start reinspection
   - Frustrate item again (still non-compliant)
   - Verify item stays in packageFrustrations
   - Verify reinspectionHistory shows "FRUSTRATED" entry
   - Verify AMC1015 shows both original and reinspection frustrations

5. **Screen Consolidation**
   - Complete ML detection
   - Verify navigation goes to InspectorPOPMarkingDataEntry
   - Verify validation logic works (Field B, Field C)
   - Verify frustration creation buttons work

---

## Files Modified Summary

| File | Changes |
|------|---------|
| `InspectionFormProvider.tsx` | Add `resolvePackageFrustration()` and `refrustratePackageFrustration()` actions |
| `PackageFrustrationSummary.tsx` | Update `handleReinspectFrustrations()` navigation logic |
| `InspectorHomeScreen.tsx` | Ensure context loaded before navigating to summary |
| `InspectorPOPMarkingDataEntry.tsx` | Add Field B/C validation, update navigation logic |
| `InspectorMarkingsLabelsValidationScreen.tsx` | Add reinspection mode detection, use new context actions, update navigation |
| `MLDetectionScreen.tsx` | Change navigation to `InspectorPOPMarkingDataEntry` |
| `InspectorPOPMarkingValidationScreen.tsx` | **DELETE** (functionality moved to DataEntry) |
| `InspectorAMC1015Form.tsx` | **NO CHANGES** (already supports reinspection history) |

---

## Future Enhancements

1. **Material-Specific Reinspection** - Add reinspection support for dry ice, magnetized materials, lithium batteries, etc.
2. **Bulk Reinspection** - Allow selecting specific items to reinspect instead of all
3. **Reinspection Comments** - Add UI for inspectors to add comments during reinspection
4. **Reinspection Analytics** - Track reinspection success rates, common frustration patterns

---

## Conclusion

This design provides a comprehensive package reinspection system that:
- ✅ Mirrors the existing SDDG reinspection pattern
- ✅ Provides full audit trail with `ReinspectionAttempt` tracking
- ✅ Integrates seamlessly with AMC Form 1015
- ✅ Uses intelligent navigation (skips irrelevant screens)
- ✅ Consolidates POP validation into DataEntry screen
- ✅ Requires minimal code changes (leverages existing infrastructure)

The system is ready for implementation.
