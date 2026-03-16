# Design: Integrate DocumentScanner into SDDG Upload Flow

## Problem

SDDGUploadAndParse.tsx uses `expo-camera` (via a separate `SDDGCameraScreen`) for the "Take Photo" flow. This produces raw, uncorrected photos that require heavy software preprocessing (brightness normalization, contrast enhancement, sharpening) before OCR extraction. The result is inconsistent OCR quality that depends on how well the user frames and holds the camera.

Meanwhile, three other screens in the codebase already use `react-native-document-scanner-plugin` (`DocumentScanner.scanDocument()`):
- `CoeAndCaaScreen.tsx`
- `DotSpScreen.tsx`
- `WaiverUploadScreen.tsx`

This plugin provides automatic edge detection, perspective correction, and cropping at the native level — exactly what SDDG form scanning needs for reliable OCR accuracy.

## Current State

- `DocumentScanner` is **already imported** in `SDDGUploadAndParse.tsx` (lines 17-19) but unused
- A commented-out scan button exists at lines 2598-2620 with a reference to `handleDocumentScan`
- Dormant state variables exist: `showDocumentScanner` (line 93, never used), `isScanning` (line 92, never set to true)
- `SDDGCameraScreen.tsx` is referenced in exactly **4 files**:
  1. `src/screens/SDDG/SDDGCameraScreen.tsx` — the component itself
  2. `src/components/SDDGUploadAndParse.tsx` (line 2628) — the sole navigation caller
  3. `src/screens/inspector/InspectorLayoutNavigator.tsx` (line 75 import, lines 354-360 registration)
  4. `src/contexts/NavigationRefProvider/NavigationRefContext.ts` (line 73 route type)

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Call site | Inline in SDDGUploadAndParse | Matches CoeAndCaaScreen/DotSpScreen/WaiverUploadScreen pattern. DocumentScanner provides its own full-screen native UI, so a separate screen is unnecessary. |
| SDDGCameraScreen | Remove entirely from all 4 files | Only one caller. Dead code after this change. Complete removal surface documented below. |
| Image quality | `croppedImageQuality: 100` | Max quality for OCR accuracy. Other screens use 80 but they produce PDFs, not OCR input. See tradeoff note below. |
| Permissions | Explicit Android check + plugin-native iOS | Match CoeAndCaaScreen pattern: `PermissionsAndroid.request()` on Android, rely on plugin for iOS. Do NOT skip Android permissions — the plugin does not reliably self-prompt on all Android configurations. |
| Gallery flow | Keep existing ImagePicker | Already works well. No change needed. |
| Crop adjustment | `letUserAdjustCrop: true` | User can confirm/adjust document edges before the image is returned. Critical for ensuring full SDDG form capture. |
| Dead state cleanup | Remove dormant state, repurpose `isScanning` | `showDocumentScanner` and the commented-out button block must be removed. `isScanning` must be **kept and repurposed** as an in-flight guard around the async `scanDocument()` call to prevent double-tap/re-entry. |

### Image Quality Tradeoff (croppedImageQuality: 100)

Using quality 100 produces larger image files. Since SDDGProcessingScreen performs multiple OCR passes on the image, this increases memory pressure and processing time. However:
- Only one image is scanned at a time (`maxNumDocuments: 1`)
- The image is processed locally, not uploaded
- OCR accuracy is the primary goal for this flow

**Acceptance criteria**: If quality 100 causes noticeable lag or memory warnings on target devices during testing, fall back to 90.

## Data Flow

```
"Take Photo" button press
  -> [Android only] PermissionsAndroid.request(CAMERA) — match CoeAndCaaScreen pattern
  -> DocumentScanner.scanDocument({
       croppedImageQuality: 100,
       maxNumDocuments: 1,
       responseType: ResponseType.ImageFilePath,
       letUserAdjustCrop: true,
     })
  -> Returns: scannedImages[0] (perspective-corrected, cropped file path)
  -> Check devSettings.sddgExtractionMethod:
       "anchor-based" -> navigate("SDDGProcessingScreen", {imageUri: scannedImages[0], isScanned: true})
       "manual-regions" -> navigate("SDDGRegionAdjustmentScreen", {imageUri: scannedImages[0], isScanned: true})
         (SDDGRegionAdjustmentScreen accepts isScanned and forwards it to SDDGProcessingScreen at line 277,
          which disables preprocessing when true. Must pass isScanned: true to avoid unnecessary preprocessing
          on already-corrected document scanner output.)
```

### Downstream Preprocessing Behavior Change

**This is a material behavior change that must be validated.**

In `SDDGProcessingScreen.tsx` (lines 167-179), when `isScanned: true`:
- **Legacy template-based extraction**: Preprocessing is **disabled** (`enabled: false`). The code logs "Image from document scanner - skipping preprocessing (already enhanced)." This means brightness normalization, contrast enhancement, and sharpening are all skipped.
- **Anchor-based extraction**: Preprocessing config is **ignored entirely** — this path does not use the preprocessing pipeline regardless of the `isScanned` flag.

Previously, `SDDGCameraScreen` already passed `isScanned: true`, so this behavior is **not new** — the document scanner just produces a better input image for the same code path. The key validation is confirming that DocumentScanner output quality is equal to or better than expo-camera output for OCR purposes.

## Cancellation & Error Handling

The `scanDocument()` API can surface cancellation in two ways depending on platform:
1. Returns `{ scannedImages: [] }` or `{ scannedImages: null }` (normal cancel)
2. Throws an exception (some Android configurations on cancel)

**Implementation pattern** (matching CoeAndCaaScreen):
```typescript
try {
  const { scannedImages } = await DocumentScanner.scanDocument({...});
  if (!scannedImages || scannedImages.length === 0) {
    return; // User cancelled — silent no-op
  }
  // Route scannedImages[0] to processing...
} catch (error: any) {
  // Filter out user-cancellation exceptions vs real errors
  if (error?.message?.toLowerCase().includes("cancel")) {
    return; // User cancelled via exception path — silent no-op
  }
  Alert.alert("Scan Error", "Failed to scan document. Please try again.");
  console.error("DocumentScanner error:", error);
}
```

## Components Affected

### Modified
- **`src/components/SDDGUploadAndParse.tsx`**:
  - Replace "Take Photo" button handler (line 2628) with inline `DocumentScanner.scanDocument()` call
  - Add `handleDocumentScan` async function with permission check + scanner call + routing
  - Remove dormant state: `showDocumentScanner` (line 93)
  - Repurpose `isScanning` (line 92) as in-flight guard: set `true` before `scanDocument()`, `false` in finally block; disable button when true
  - Remove entire commented-out scanner button block (lines 2598-2620)
  - Remove unused expo-camera imports if any
- **`src/screens/inspector/InspectorLayoutNavigator.tsx`**:
  - Remove import of SDDGCameraScreen (line 75)
  - Remove `<RootStack.Screen name="SDDGCameraScreen" .../>` registration (lines 354-360)
- **`src/contexts/NavigationRefProvider/NavigationRefContext.ts`**:
  - Remove `SDDGCameraScreen: undefined;` route type (line 73)

### Deleted
- **`src/screens/SDDG/SDDGCameraScreen.tsx`** — No longer needed. Sole caller removed.

### Unchanged
- `SDDGProcessingScreen.tsx` — Receives same `{imageUri, isScanned}` params; preprocessing skip behavior already exists for `isScanned: true`
- `SDDGRegionAdjustmentScreen.tsx` — Now receives `{imageUri, isScanned: true}` instead of just `{imageUri}`, but the component already accepts and forwards `isScanned` (line 55 → line 277). No code change needed in this file.
- `InteractiveSDDGComplianceScreen.tsx` — No change
- Gallery flow (`handleGallerySelection`) — No change
- QR code flow — No change
- Manual entry flow — No change

## Expected Benefits

1. **Better OCR accuracy** — Perspective-corrected, edge-detected images with max quality
2. **Simpler code** — Remove a dedicated screen + dormant state, use inline call matching 3 other screens
3. **Better UX** — Native document scanner UI with edge detection guides, vs plain camera viewfinder
4. **Consistent codebase** — All document scanning now uses the same plugin and pattern
