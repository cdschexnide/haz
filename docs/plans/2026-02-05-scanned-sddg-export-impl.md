# Scanned SDDG Export Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Persist scanned SDDG form images to durable storage and export them (instead of AMC Form 1015 PDFs) when the user taps the share button.

**Architecture:** The `setExtractedSDDGContent` method in `InspectionFormProvider` is the single funnel where all SDDG image URIs enter the system. We copy temp images to `FileSystem.documentDirectory/sddg_images/` there, then replace the PDF generation in both share buttons with direct image sharing via `Sharing.shareAsync`.

**Tech Stack:** React Native, expo-file-system, expo-sharing, expo-camera, expo-image-picker, expo-sqlite

**Design doc:** `docs/plans/2026-02-05-scanned-sddg-export-design.md`

---

### Task 1: Persist SDDG Image in InspectionFormProvider

**Files:**
- Modify: `src/contexts/InspectionFormProvider/InspectionFormProvider.tsx:599-624`

**Step 1: Add FileSystem import**

At the top of the file (after existing imports around line 22), add:

```typescript
import * as FileSystem from "expo-file-system";
```

**Step 2: Convert `setExtractedSDDGContent` from sync to async with image persistence**

Replace lines 599-624:

```typescript
  const setExtractedSDDGContent = useCallback(
    (content: ExtractedSDDGContent, imageUri: string = "") => {
      console.log("📝 [InspectionForm] Setting extracted SDDG content");

      setInspection(prev => {
        // CRITICAL: Preserve existing frustrations
        const existingFrustrations = [...prev.frustrations];
        const existingPackageFrustrations = [...prev.packageFrustrations];

        return {
          ...prev,
          extractedContent: { ...content },
          verificationCopy: { ...content }, // Create copy for user modifications
          originalImageUri: imageUri,
          inspectionStartTime: new Date(),
          inspectionCompleteTime: null,
          // PRESERVE frustrations
          frustrations: existingFrustrations,
          packageFrustrations: existingPackageFrustrations,
        };
      });

      setHasUnsavedChanges(true);
    },
    []
  );
```

With:

```typescript
  const setExtractedSDDGContent = useCallback(
    (content: ExtractedSDDGContent, imageUri: string = "") => {
      console.log("📝 [InspectionForm] Setting extracted SDDG content");

      // Persist the scanned SDDG image to durable storage (async, fire-and-forget for state update)
      const persistImage = async (tempUri: string): Promise<string> => {
        if (!tempUri) return "";
        try {
          const dir = `${FileSystem.documentDirectory}sddg_images/`;
          const dirInfo = await FileSystem.getInfoAsync(dir);
          if (!dirInfo.exists) {
            await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
          }
          const filename = `sddg_${Date.now()}.jpg`;
          const persistentUri = `${dir}${filename}`;
          await FileSystem.copyAsync({ from: tempUri, to: persistentUri });
          console.log("📝 [InspectionForm] SDDG image persisted to:", persistentUri);
          return persistentUri;
        } catch (err) {
          console.error("📝 [InspectionForm] Failed to persist SDDG image:", err);
          return tempUri; // Fallback to temp URI if copy fails
        }
      };

      // Set state immediately with temp URI, then update with persistent URI
      setInspection(prev => {
        // CRITICAL: Preserve existing frustrations
        const existingFrustrations = [...prev.frustrations];
        const existingPackageFrustrations = [...prev.packageFrustrations];

        // Clean up old persisted image if it exists in sddg_images/
        if (prev.originalImageUri && prev.originalImageUri.includes("sddg_images/")) {
          FileSystem.deleteAsync(prev.originalImageUri, { idempotent: true }).catch(() => {});
        }

        return {
          ...prev,
          extractedContent: { ...content },
          verificationCopy: { ...content },
          originalImageUri: imageUri,
          inspectionStartTime: new Date(),
          inspectionCompleteTime: null,
          frustrations: existingFrustrations,
          packageFrustrations: existingPackageFrustrations,
        };
      });

      // Copy to persistent storage and update the URI
      if (imageUri) {
        persistImage(imageUri).then(persistentUri => {
          if (persistentUri !== imageUri) {
            setInspection(prev => ({
              ...prev,
              originalImageUri: persistentUri,
            }));
          }
        });
      }

      setHasUnsavedChanges(true);
    },
    []
  );
```

**Step 3: Verify the app builds**

Run: `npx expo start` (or your dev build command) and confirm no build errors.

**Step 4: Manual smoke test**

1. Open the app in the inspector workflow
2. Take a photo of an SDDG form (or select from gallery)
3. Check the console log for "SDDG image persisted to: .../sddg_images/sddg_XXXX.jpg"
4. Verify the file exists at that path

**Step 5: Commit**

```bash
git add src/contexts/InspectionFormProvider/InspectionFormProvider.tsx
git commit -m "feat: persist scanned SDDG image to durable storage

Copy temp camera/gallery images to FileSystem.documentDirectory/sddg_images/
inside setExtractedSDDGContent. Cleans up old image on reinspection."
```

---

### Task 2: Replace Share in InspectorAMC1015Form

**Files:**
- Modify: `src/screens/inspector/InspectorAMC1015Form.tsx`

**Step 1: Remove unused imports**

Remove `* as Print from "expo-print"` from the import block (line 15). Keep `* as FileSystem from "expo-file-system"` and `* as Sharing from "expo-sharing"` (lines 14, 16).

**Step 2: Remove `generateFormHtml` and `generateAndSharePdf`**

Delete the `generateFormHtml` function (lines 338-1539) and `generateAndSharePdf` function (lines 1543-1575).

Also remove `formatFrustrationsForComments` (lines 136-312), `failedItems` (line 314), and `getCheckboxHTML` (lines 317-335) since they were only used by the HTML generation.

**Step 3: Remove `isGeneratingPdf` state**

Remove line 45: `const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);`

**Step 4: Add `shareScannedSDDG` function**

Add this after the existing variable declarations (after `inspectedByName`, around line 133):

```typescript
  const originalImageUri = inspection.originalImageUri;

  const shareScannedSDDG = async () => {
    if (!originalImageUri) return;
    try {
      const fileInfo = await FileSystem.getInfoAsync(originalImageUri);
      if (!fileInfo.exists) {
        Alert.alert("Error", "Scanned SDDG image not found. The file may have been deleted.");
        return;
      }
      await Sharing.shareAsync(originalImageUri, {
        mimeType: "image/jpeg",
        dialogTitle: "Share AMC Form 1015",
        UTI: "public.jpeg",
      });
    } catch (error) {
      console.error("Error sharing scanned SDDG:", error);
      Alert.alert("Error", "Failed to share the scanned SDDG image.");
    }
  };
```

**Step 5: Update the ActionFooter**

In the `ActionFooter` buttons array (around line 2805), replace the share button:

From:
```typescript
          {
            label: "Share",
            onPress: generateAndSharePdf,
            variant: "secondary",
            icon: "share",
            iconPosition: "left",
            loading: isGeneratingPdf,
            disabled: isGeneratingPdf,
          },
```

To conditionally include the share button only when an image exists. Replace the entire `ActionFooter` block:

```typescript
      <ActionFooter
        buttons={[
          {
            label: "Cancel",
            onPress: () => navigation?.goBack(),
            variant: "outline",
          },
          ...(originalImageUri
            ? [
                {
                  label: "Share",
                  onPress: shareScannedSDDG,
                  variant: "secondary" as const,
                  icon: "share" as const,
                  iconPosition: "left" as const,
                },
              ]
            : []),
          {
            label: "Complete Inspection",
            onPress: handleCompleteInspection,
            variant: "primary",
          },
        ]}
      />
```

**Step 6: Verify the app builds**

Run: `npx expo start` and confirm no build errors.

**Step 7: Commit**

```bash
git add src/screens/inspector/InspectorAMC1015Form.tsx
git commit -m "feat: share scanned SDDG image instead of generated PDF

Remove AMC Form 1015 HTML/PDF generation. Share button now exports
the persisted scanned SDDG image. Button hidden for manual entry."
```

---

### Task 3: Replace Share in Form1015Viewer

**Files:**
- Modify: `src/components/Inspector/Form1015Viewer.tsx`

**Step 1: Remove unused imports**

Remove `* as Print from "expo-print"` from the import block (line 14). Keep `* as FileSystem from "expo-file-system"` and `* as Sharing from "expo-sharing"`.

Also remove these unused imports since they were only needed for PDF generation:
- `mapFrustrationsToForm1015WithResolved` (line 18)
- `getForm1015FrustrationDescription` (line 19)
- `SDDG_TO_FORM1015_MAPPING` (line 20)
- `getPackageFrustrationField` (line 21)
- `getLatestReinspectionInfo` (line 23)
- `Form1015CheckBoxWithStatus` (line 24)

Wait — these imports are also used by the Form1015Viewer's checklist rendering (the main body of the component, not just PDF). Only remove `* as Print` since that's the only one exclusively used for PDF generation.

**Step 2: Remove `generateAndSharePdf` and related code**

Delete the `generateAndSharePdf` function (lines 265-305).

Remove `isGeneratingPdf` state (line 48): `const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);`

**Step 3: Add `shareScannedSDDG` function**

Add after the existing variable declarations:

```typescript
  const originalImageUri = context.originalImageUri || null;

  const shareScannedSDDG = async () => {
    if (!originalImageUri) return;
    try {
      const fileInfo = await FileSystem.getInfoAsync(originalImageUri);
      if (!fileInfo.exists) {
        Alert.alert("Error", "Scanned SDDG image not found. The file may have been deleted.");
        return;
      }
      await Sharing.shareAsync(originalImageUri, {
        mimeType: "image/jpeg",
        dialogTitle: "Share AMC Form 1015",
        UTI: "public.jpeg",
      });
    } catch (error) {
      console.error("Error sharing scanned SDDG:", error);
      Alert.alert("Error", "Failed to share the scanned SDDG image.");
    }
  };
```

**Step 4: Update the footer**

Replace the share button in the footer (lines 927-940):

From:
```tsx
        <TouchableOpacity
          style={[styles.shareBtn, isGeneratingPdf && styles.disabledBtn]}
          onPress={generateAndSharePdf}
          disabled={isGeneratingPdf}
        >
          {isGeneratingPdf ? (
            <ActivityIndicator color={colors.white} size="small" />
          ) : (
            <>
              <MaterialIcons name="share" size={18} color={colors.white} />
              <Text style={styles.shareBtnText}>Share PDF</Text>
            </>
          )}
        </TouchableOpacity>
```

To:
```tsx
        {originalImageUri && (
          <TouchableOpacity
            style={styles.shareBtn}
            onPress={shareScannedSDDG}
          >
            <MaterialIcons name="share" size={18} color={colors.white} />
            <Text style={styles.shareBtnText}>Share PDF</Text>
          </TouchableOpacity>
        )}
```

**Step 5: Clean up unused imports**

Since `ActivityIndicator` may no longer be used (check if it's used elsewhere in the file), remove it from the react-native import if unused.

**Step 6: Verify the app builds**

Run: `npx expo start` and confirm no build errors.

**Step 7: Commit**

```bash
git add src/components/Inspector/Form1015Viewer.tsx
git commit -m "feat: share scanned SDDG image from Form1015Viewer

Remove PDF generation from saved inspection viewer. Share button
exports the persisted scanned SDDG image. Hidden for manual entry."
```

---

### Task 4: Delete Image on Inspection Delete

**Files:**
- Modify: `src/contexts/DataProvider/DataProvider.tsx:450-465`

**Step 1: Add FileSystem import**

Add at the top of the file:

```typescript
import * as FileSystem from "expo-file-system";
```

**Step 2: Update `deleteInspection` to also delete the image file**

Replace the `deleteInspection` method:

From:
```typescript
  const deleteInspection = useCallback(async (id: string): Promise<void> => {
    try {
      const db = getDb();
      console.log("📊 [DataProvider] Deleting inspection:", id);

      await db.runAsync("DELETE FROM inspector_shipments WHERE id = ?", [id]);

      console.log("📊 [DataProvider] Inspection deleted successfully");
    } catch (err) {
      console.error("📊 [DataProvider] Failed to delete inspection:", err);
      throw new DatabaseError(
        "Failed to delete inspection",
        "DELETE_ERROR",
        err
      );
    }
  }, []);
```

To:
```typescript
  const deleteInspection = useCallback(async (id: string): Promise<void> => {
    try {
      const db = getDb();
      console.log("📊 [DataProvider] Deleting inspection:", id);

      // Load the inspection first to get the image URI for cleanup
      const inspection = await loadInspection(id);
      const imageUri = inspection?.inspectionContext?.originalImageUri;

      await db.runAsync("DELETE FROM inspector_shipments WHERE id = ?", [id]);

      // Clean up persisted SDDG image file if it exists
      if (imageUri && imageUri.includes("sddg_images/")) {
        await FileSystem.deleteAsync(imageUri, { idempotent: true }).catch(err => {
          console.warn("📊 [DataProvider] Failed to delete SDDG image:", err);
        });
      }

      console.log("📊 [DataProvider] Inspection deleted successfully");
    } catch (err) {
      console.error("📊 [DataProvider] Failed to delete inspection:", err);
      throw new DatabaseError(
        "Failed to delete inspection",
        "DELETE_ERROR",
        err
      );
    }
  }, [loadInspection]);
```

Note: Added `loadInspection` to the dependency array since it's now used inside the callback.

**Step 3: Verify the app builds**

Run: `npx expo start` and confirm no build errors.

**Step 4: Commit**

```bash
git add src/contexts/DataProvider/DataProvider.tsx
git commit -m "feat: delete SDDG image file when inspection is deleted

Load inspection before deletion to retrieve the image URI,
then clean up the persisted file in sddg_images/."
```

---

### Task 5: End-to-End Manual Verification

**No code changes. Manual testing only.**

**Test 1: Camera capture flow**
1. Start a new inspection
2. Take a photo of an SDDG form
3. Complete the full inspection workflow through to the AMC Form 1015 screen
4. Verify the "Share" button is visible
5. Tap "Share" — confirm the scanned SDDG image is shared (not a PDF)

**Test 2: Gallery selection flow**
1. Start a new inspection
2. Select an SDDG image from gallery
3. Complete the workflow to AMC Form 1015
4. Tap "Share" — confirm the scanned image is shared

**Test 3: Manual entry flow (no image)**
1. Start a new inspection using manual entry
2. Complete the workflow to AMC Form 1015
3. Verify the "Share" button is **not visible**

**Test 4: Saved inspection viewer**
1. Complete an inspection (camera or gallery) and save it
2. From InspectorHomeScreen, tap the "View" column for that inspection
3. In Form1015Viewer, verify the "Share PDF" button is visible
4. Tap "Share PDF" — confirm the scanned SDDG image is shared

**Test 5: Persistence across app restart**
1. Complete an inspection with a scanned SDDG image
2. Force-quit and relaunch the app
3. Load the saved inspection from the home screen
4. Tap "Share PDF" in Form1015Viewer — confirm the image still exists and is shared

**Step 6: Final commit (if any fixups needed)**

```bash
git add -A
git commit -m "fix: address issues found during manual verification"
```
