# SDDG Save & Exit and Reinspection Flow Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add Save & Exit functionality to SDDGFrustrationSummary, route zero-frustration flow through SDDGInspectionCompleteScreen, and update InspectorHomeScreen navigation.

**Architecture:** The existing SDDGInspectionCompleteScreen.tsx handles the zero-frustration success state. We need to add a Back button to its footer, add Save & Exit to SDDGFrustrationSummary, update InteractiveSDDGComplianceScreen to route to SDDGInspectionCompleteScreen, and update InspectorHomeScreen SDDG/Package column click behavior.

**Tech Stack:** React Native, TypeScript, React Navigation, InspectionFormProvider context

---

## Task 1: Add Back Button to SDDGInspectionCompleteScreen Footer

**Files:**
- Modify: `src/components/SDDGInspectionCompleteScreen.tsx:245-272` (footer section)

**Step 1: Add Back button to footer**

In `src/components/SDDGInspectionCompleteScreen.tsx`, update the footer to include a Back button:

```typescript
{/* Action Buttons */}
<View style={styles.footer}>
  {/* Back Button */}
  <TouchableOpacity
    style={styles.backButton}
    onPress={() => navigation.goBack()}
    disabled={isSaving}
  >
    <MaterialIcons name="arrow-back" size={20} color="#007AFF" />
    <Text style={styles.backButtonText}>Back</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.saveButton}
    onPress={handleSaveAndExit}
    disabled={isSaving}
  >
    {isSaving ? (
      <ActivityIndicator color="#007AFF" />
    ) : (
      <>
        <MaterialIcons name="save" size={20} color="#007AFF" />
        <Text style={styles.saveButtonText}>Save & Exit</Text>
      </>
    )}
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.continueButton}
    onPress={handleContinueToPackage}
    disabled={isSaving}
  >
    <Text style={styles.continueButtonText}>Continue to Package</Text>
    <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />
  </TouchableOpacity>
</View>
```

**Step 2: Add backButton styles**

Add to the StyleSheet:

```typescript
backButton: {
  flex: 0.8,
  backgroundColor: "#FFFFFF",
  borderWidth: 2,
  borderColor: "#8E8E93",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  paddingVertical: 14,
  borderRadius: 12,
  gap: 4,
},
backButtonText: {
  color: "#8E8E93",
  fontSize: 16,
  fontWeight: "600",
},
```

**Step 3: Fix Save & Exit navigation path**

Update `handleSaveAndExit` navigation from:
```typescript
navigation.navigate("InspectorHomeScreen");
```

To:
```typescript
navigation.navigate("InspectorHomeStack", { screen: "InspectorHome" });
```

**Step 4: Verify visually**

Run the app, navigate to SDDGInspectionCompleteScreen, verify:
- Back button appears in footer left side
- Back button navigates back to previous screen
- Save & Exit and Continue buttons still work

**Step 5: Commit**

```bash
git add src/components/SDDGInspectionCompleteScreen.tsx
git commit -m "feat(sddg): add Back button to SDDGInspectionCompleteScreen footer"
```

---

## Task 2: Update InteractiveSDDGComplianceScreen Button Text and Navigation

**Files:**
- Modify: `src/components/Inspector/InteractiveSDDGComplianceScreen.tsx:638-645` (button text)
- Modify: `src/components/Inspector/InteractiveSDDGComplianceScreen.tsx:402-422` (handleContinue zero-frustration path)

**Step 1: Rename button text**

Change the button text from dynamic to always show "Continue Inspection":

Find this code (around line 638-645):
```typescript
<TouchableOpacity style={styles.primaryButton} onPress={handleContinue}>
  <Text style={styles.primaryButtonText}>
    {frustratedFields.size > 0
      ? "Review Frustrations"
      : "Continue to Package"}
  </Text>
  <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />
</TouchableOpacity>
```

Change to:
```typescript
<TouchableOpacity style={styles.primaryButton} onPress={handleContinue}>
  <Text style={styles.primaryButtonText}>
    {frustratedFields.size > 0
      ? "Review Frustrations"
      : "Continue Inspection"}
  </Text>
  <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />
</TouchableOpacity>
```

**Step 2: Update zero-frustration navigation**

Find this code in `handleContinue` (around line 402-422):
```typescript
if (frustratedCount === 0) {
  console.log("if block - frustratedCount === 0");
  // Zero frustrations - mark SDDG complete and route to package inspection
  console.log(
    "📋 [InteractiveSDDG] Zero frustrations - proceeding to package inspection"
  );

  completeSDDGSubstep("InteractiveSDDGComplianceScreen");
  setSDDGComplete(true);
  completeSDDGAndMoveToPackage();

  // Route to ML Detection Screen first, passing UN number for subsequent routing
  const unIdNo = inspection.verificationCopy?.unIdNo || "";
  console.log("const unIdNo = inspection.verificationCopy?.unIdNo");
  console.log("unIdNo:", unIdNo);
  console.log("Navigating to MLDetectionScreen for label detection");

  // Navigate to ML Detection Screen - it will handle routing to package verification
  // or specialized screens based on UN number after detection is complete
  navigation.navigate("MLDetectionScreen", { unIdNo });
}
```

Change to:
```typescript
if (frustratedCount === 0) {
  console.log("if block - frustratedCount === 0");
  // Zero frustrations - navigate to SDDGInspectionCompleteScreen
  console.log(
    "📋 [InteractiveSDDG] Zero frustrations - navigating to SDDGInspectionCompleteScreen"
  );

  completeSDDGSubstep("InteractiveSDDGComplianceScreen");

  // Navigate to the SDDG completion screen (user can Save & Exit or Continue to Package)
  navigation.navigate("SDDGInspectionCompleteScreen");
}
```

**Step 3: Verify navigation flow**

Run the app:
1. Start new inspection with SDDG that has no frustrations
2. Click "Continue Inspection"
3. Verify it navigates to SDDGInspectionCompleteScreen (not MLDetectionScreen)

**Step 4: Commit**

```bash
git add src/components/Inspector/InteractiveSDDGComplianceScreen.tsx
git commit -m "feat(sddg): route zero-frustration flow through SDDGInspectionCompleteScreen"
```

---

## Task 3: Add Save & Exit Button to SDDGFrustrationSummary

**Files:**
- Modify: `src/components/SDDGFrustrationSummary.tsx:244-268` (footer section)
- Modify: `src/components/SDDGFrustrationSummary.tsx:1-40` (imports and hooks)
- Modify: `src/components/SDDGFrustrationSummary.tsx` (add handleSaveAndExit function)
- Modify: `src/components/SDDGFrustrationSummary.tsx:273-434` (styles)

**Step 1: Add database hook import**

Add `useDatabase` import at top of file (around line 11):
```typescript
import { useDatabase } from "@/contexts/DataProvider";
```

**Step 2: Add database hook in component**

After line 36 (`const { actions } = useHazProStore();`), add:
```typescript
const database = useDatabase();
const [isSaving, setIsSaving] = useState(false);
```

And add `useState` to React import at line 1:
```typescript
import React, { useEffect, useState } from "react";
```

**Step 3: Add ActivityIndicator import**

Update the react-native import (line 2-9) to include `ActivityIndicator`:
```typescript
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
```

**Step 4: Add InspectorShipment type import**

Add to imports (around line 12):
```typescript
import { FrustrationRecord, InspectorShipment } from "@/types/sddg";
```

**Step 5: Add handleSaveAndExit function**

Add this function after `handleCompleteWithFrustration` (around line 162):

```typescript
// Handle Save & Exit - save inspection with frustrations and exit without continuing to package
const handleSaveAndExit = async () => {
  try {
    setIsSaving(true);

    const sddgData = inspection.verificationCopy;
    if (!sddgData) {
      Alert.alert("Error", "No SDDG data available to save");
      return;
    }

    // Mark SDDG workflow complete
    completeSDDGSubstep("SDDGFrustrationSummary");
    setSDDGComplete(true);

    // Create inspection record with frustrated SDDG status
    const inspectionRecord: InspectorShipment = {
      id: Date.now().toString(),
      status: "in-progress",
      inspectedAt: new Date(),
      inspectionContext: { ...inspection },
      tcn: sddgData.shippersReferenceNumber || "N/A",
      unId: sddgData.unIdNo || "N/A",
      properShippingName: sddgData.properShippingName || "N/A",
      inspector: inspection.inspector,
      sddgStatus: "frustrated",
      packageStatus: null,
      totalFrustrations: frustrations.length,
      sddgFrustrations: frustrations.length,
      packageFrustrations: 0,
    };

    console.log(
      "📝 [SDDGFrustrationSummary] Saving inspection with frustrations"
    );

    await database.saveInspection(inspectionRecord);

    console.log(
      "📝 [SDDGFrustrationSummary] Inspection saved successfully"
    );

    Alert.alert(
      "Inspection Saved",
      `SDDG inspection saved with ${frustrations.length} frustration(s). You can reinspect or continue package inspection later.`,
      [
        {
          text: "OK",
          onPress: () => {
            startNewInspection();
            navigation.navigate("InspectorHomeStack", {
              screen: "InspectorHome",
            });
          },
        },
      ]
    );
  } catch (error) {
    console.error(
      "📝 [SDDGFrustrationSummary] Failed to save inspection:",
      error
    );
    Alert.alert("Save Failed", "Failed to save inspection. Please try again.");
  } finally {
    setIsSaving(false);
  }
};
```

**Step 6: Update footer with Save & Exit button**

Replace the footer section (around lines 244-268) with:

```typescript
{/* Action Buttons */}
<View style={styles.footer}>
  <TouchableOpacity
    style={styles.cancelButton}
    onPress={handleCancel}
    disabled={isSaving}
  >
    <Text style={styles.cancelButtonText}>Cancel</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.saveExitButton}
    onPress={handleSaveAndExit}
    disabled={isSaving}
  >
    {isSaving ? (
      <ActivityIndicator color="#FFFFFF" size="small" />
    ) : (
      <>
        <MaterialIcons name="save" size={18} color="#FFFFFF" />
        <Text style={styles.saveExitButtonText}>Save & Exit</Text>
      </>
    )}
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.reinspectionButton}
    onPress={handleReinspectFrustrations}
    disabled={isSaving}
  >
    <MaterialIcons name="refresh" size={20} color="#007AFF" />
    <Text style={styles.reinspectionButtonText}>Reinspect</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.completeButton}
    onPress={handleCompleteWithFrustration}
    disabled={isSaving}
  >
    <Text style={styles.completeButtonText}>Continue</Text>
  </TouchableOpacity>
</View>
```

**Step 7: Add saveExitButton styles**

Add these styles to the StyleSheet (after reinspectionButton styles around line 417):

```typescript
saveExitButton: {
  flex: 1,
  backgroundColor: "#6C757D",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  paddingVertical: 16,
  paddingHorizontal: 8,
  borderRadius: 12,
  gap: 4,
},
saveExitButtonText: {
  color: "#FFFFFF",
  fontSize: 14,
  fontWeight: "600",
},
```

**Step 8: Verify functionality**

Run the app:
1. Create frustrations in InteractiveSDDGComplianceScreen
2. Navigate to SDDGFrustrationSummary
3. Click "Save & Exit"
4. Verify inspection is saved and navigates to InspectorHomeScreen
5. Verify inspection appears with "Frustrated" SDDG status and "N/A" Package status

**Step 9: Commit**

```bash
git add src/components/SDDGFrustrationSummary.tsx
git commit -m "feat(sddg): add Save & Exit button to SDDGFrustrationSummary"
```

---

## Task 4: Update InspectorHomeScreen SDDG Click Handler

**Files:**
- Modify: `src/components/Inspector/InspectorHomeScreen.tsx:210-269` (handleSDDGStatusClick function)

**Step 1: Update handleSDDGStatusClick for verified status**

Find `handleSDDGStatusClick` function (around line 211-269) and update the "verified" case:

Replace this block:
```typescript
if (inspection.sddgStatus === "verified") {
  console.log("🔍 [InspectorHome] Status is verified, showing alert");
  Alert.alert(
    "SDDG Verified",
    "This inspection's SDDG has been verified and passed compliance validation.",
    [{ text: "OK" }]
  );
  return;
}
```

With:
```typescript
if (inspection.sddgStatus === "verified") {
  console.log("🔍 [InspectorHome] Status is verified, navigating to SDDGInspectionCompleteScreen");

  try {
    await loadInspectionForEdit(inspection.id);
    navigate("InspectorWrappedStack", {
      screen: "SDDGInspectionCompleteScreen",
    });
  } catch (error) {
    console.error("🔍 [InspectorHome] Failed to load inspection:", error);
    Alert.alert(
      "Error",
      "Failed to load inspection data. Please try again.",
      [{ text: "OK" }]
    );
  }
  return;
}
```

**Step 2: Verify navigation**

Run the app:
1. Have an inspection saved with sddgStatus: "verified" and packageStatus: null
2. Click on the "Verified" SDDG status
3. Verify it navigates to SDDGInspectionCompleteScreen (not shows an alert)

**Step 3: Commit**

```bash
git add src/components/Inspector/InspectorHomeScreen.tsx
git commit -m "feat(home): navigate to SDDGInspectionCompleteScreen when SDDG status is verified"
```

---

## Task 5: Update InspectorHomeScreen Package Column to Show "N/A"

**Files:**
- Modify: `src/components/Inspector/InspectorHomeScreen.tsx:717-735` (Package status cell rendering)

**Step 1: Update Package status display logic**

Find the Package Status Cell rendering (around line 717-735):

Replace the status text logic:
```typescript
<Text
  style={[
    styles.columnText,
    styles.statusText,
    item.packageStatus === null
      ? styles.notStartedStatus
      : item.packageStatus === "verified"
      ? styles.verifiedStatus
      : styles.frustratedStatus,
  ]}
>
  {item.packageStatus === null
    ? "Not Started"
    : item.packageStatus === "verified"
    ? "Verified"
    : "Frustrated"}
</Text>
```

With:
```typescript
<Text
  style={[
    styles.columnText,
    styles.statusText,
    item.packageStatus === null
      ? styles.naStatus
      : item.packageStatus === "verified"
      ? styles.verifiedStatus
      : styles.frustratedStatus,
  ]}
>
  {item.packageStatus === null
    ? "N/A"
    : item.packageStatus === "verified"
    ? "Verified"
    : "Frustrated"}
</Text>
```

**Step 2: Add naStatus style**

Add this style (after notStartedStatus around line 1022):

```typescript
naStatus: {
  backgroundColor: "#F5F5F5",
  color: "#8E8E93",
},
```

**Step 3: Verify display**

Run the app:
1. Have an inspection with sddgStatus set but packageStatus: null
2. Verify Package column shows "N/A" (not "Not Started")

**Step 4: Commit**

```bash
git add src/components/Inspector/InspectorHomeScreen.tsx
git commit -m "feat(home): show N/A for Package column when SDDG complete but package not started"
```

---

## Task 6: Update handlePackageStatusClick for N/A Status

**Files:**
- Modify: `src/components/Inspector/InspectorHomeScreen.tsx:272-337` (handlePackageStatusClick function)

**Step 1: Update the null packageStatus case**

Find `handlePackageStatusClick` (around line 272-337) and update the null case:

Replace:
```typescript
if (inspection.packageStatus === null) {
  Alert.alert(
    "Package Not Started",
    "The package inspection has not been started yet. Would you like to continue with the package inspection now?",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Continue",
        onPress: async () => {
          try {
            await loadInspectionForEdit(inspection.id);
            // Navigate to package verification screen
            console.log("📦 Navigating to package inspection...");
            navigate("InspectorWrappedStack", {
              screen: "InspectorPackageVerification",
            });
          } catch (error) {
            console.error("Failed to load inspection:", error);
            Alert.alert(
              "Error",
              "Failed to load inspection data. Please try again.",
              [{ text: "OK" }]
            );
          }
        },
      },
    ]
  );
  return;
}
```

With:
```typescript
if (inspection.packageStatus === null) {
  Alert.alert(
    "Package Inspection Not Started",
    "The package inspection has not been started yet. Would you like to continue to package inspection now?",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Continue",
        onPress: async () => {
          try {
            await loadInspectionForEdit(inspection.id);
            // Navigate to ML Detection Screen for package inspection
            const unIdNo = inspection.unId || "";
            console.log("📦 Navigating to MLDetectionScreen for package inspection...");
            navigate("InspectorWrappedStack", {
              screen: "MLDetectionScreen",
              params: { unIdNo },
            });
          } catch (error) {
            console.error("Failed to load inspection:", error);
            Alert.alert(
              "Error",
              "Failed to load inspection data. Please try again.",
              [{ text: "OK" }]
            );
          }
        },
      },
    ]
  );
  return;
}
```

**Step 2: Verify N/A click behavior**

Run the app:
1. Click on "N/A" in Package column
2. Verify alert shows with option to continue to package inspection
3. Click "Continue" and verify it navigates to MLDetectionScreen

**Step 3: Commit**

```bash
git add src/components/Inspector/InspectorHomeScreen.tsx
git commit -m "feat(home): update Package N/A click to navigate to MLDetectionScreen"
```

---

## Task 7: Final Integration Test

**Step 1: Test complete zero-frustration flow**

1. Start new inspection
2. Upload/process SDDG
3. In InteractiveSDDGComplianceScreen, don't add any frustrations
4. Click "Continue Inspection"
5. Verify navigation to SDDGInspectionCompleteScreen
6. Click "Back" - verify returns to InteractiveSDDGComplianceScreen
7. Click "Continue Inspection" again
8. Click "Save & Exit"
9. Verify inspection appears in home with SDDG: "Verified", Package: "N/A"
10. Click "Verified" - verify navigates to SDDGInspectionCompleteScreen
11. Click "Continue to Package" - verify navigates to MLDetectionScreen

**Step 2: Test complete frustrated flow**

1. Start new inspection
2. Upload/process SDDG
3. In InteractiveSDDGComplianceScreen, add at least one frustration
4. Click "Review Frustrations"
5. In SDDGFrustrationSummary, click "Save & Exit"
6. Verify inspection appears in home with SDDG: "Frustrated", Package: "N/A"
7. Click "Frustrated" - verify navigates to SDDGFrustrationSummary
8. Click "Reinspect" - verify navigates to InteractiveSDDGComplianceScreen in reinspection mode

**Step 3: Test Package N/A click**

1. From home screen, click "N/A" in Package column
2. Verify alert appears
3. Click "Continue"
4. Verify navigates to MLDetectionScreen

**Step 4: Final commit**

```bash
git add -A
git commit -m "feat(sddg): complete Save & Exit and reinspection flow implementation"
```

---

## Summary of Changes

| File | Change |
|------|--------|
| `src/components/SDDGInspectionCompleteScreen.tsx` | Add Back button, fix navigation path |
| `src/components/Inspector/InteractiveSDDGComplianceScreen.tsx` | Rename button, route to SDDGInspectionCompleteScreen |
| `src/components/SDDGFrustrationSummary.tsx` | Add Save & Exit button with database save logic |
| `src/components/Inspector/InspectorHomeScreen.tsx` | Update SDDG click handler, show N/A for Package |

---

## Changelog

| Date | Author | Changes |
|------|--------|---------|
| 2026-01-06 | Claude Code | Initial design document |
| 2026-01-06 | Claude Code | Converted to implementation plan with detailed steps |
