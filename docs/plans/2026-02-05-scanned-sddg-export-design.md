# Scanned SDDG Form Export Design

**Date:** 2026-02-05
**Status:** Draft
**Feature:** Store scanned SDDG form locally and export it via share buttons

---

## Problem

When an inspector scans an SDDG form (via camera or gallery), the raw image URI is stored in `inspection.originalImageUri` within the `InspectionFormProvider` context and eventually serialized into the SQLite `inspection_context` JSON blob. However:

1. **The image file itself is ephemeral** — it lives in the OS temp/cache directory (from `expo-camera` or `expo-image-picker`). The OS can clean it up at any time.
2. **Only the URI string is persisted** — when loading a saved inspection from SQLite, `originalImageUri` may point to a deleted file.
3. **The share buttons generate an AMC Form 1015 PDF** — they don't share the original scanned SDDG form.

## Goal

When "Share AMC Form 1015" (in `InspectorAMC1015Form`) or "Share PDF" (in `Form1015Viewer`) is pressed, export the **original scanned SDDG form image** instead of the generated AMC Form 1015 PDF.

---

## Design

### 1. Persist the Scanned Image

**Location:** `src/contexts/InspectionFormProvider/InspectionFormProvider.tsx`
**Method:** `setExtractedSDDGContent(content, imageUri)`

This is the single funnel point where all SDDG image URIs enter the system. All paths (camera capture, gallery selection) flow through `SDDGProcessingScreen` which calls this method.

**Change:** Before storing `imageUri` as `originalImageUri`, copy the temp file to persistent app storage:

```
FileSystem.documentDirectory + 'sddg_images/' + <timestamp>.jpg
```

Steps:
1. Ensure `sddg_images/` directory exists (create if not)
2. Generate filename: `sddg_<Date.now()>.jpg`
3. Copy from temp URI to persistent path using `FileSystem.copyAsync()`
4. Store the persistent URI (not the temp URI) as `originalImageUri`
5. If `imageUri` is empty/falsy (manual entry), skip the copy and store `null`

### 2. Replace Share Functionality

#### `InspectorAMC1015Form.tsx`

- **Remove:** `generateFormHtml()` function, `generateAndSharePdf()` method, `expo-print` import
- **Add:** `shareScannedSDDG()` that:
  1. Reads `inspection.originalImageUri` from `InspectionFormProvider` context
  2. Verifies file exists via `FileSystem.getInfoAsync()`
  3. Calls `Sharing.shareAsync(originalImageUri, { mimeType: 'image/jpeg', dialogTitle: 'Share AMC Form 1015' })`
  4. Shows error alert if file is missing
- **Hide** the share button entirely when `originalImageUri` is null (manual entry inspections)
- Button label stays "Share AMC Form 1015"

#### `Form1015Viewer.tsx`

- **Remove:** `generateAndSharePdf()` method, `expo-print` import
- **Add:** `shareScannedSDDG()` that:
  1. Reads `inspection.inspectionContext.originalImageUri` from the `InspectorShipment` prop
  2. Same file verification and sharing logic as above
- **Hide** the share button entirely when `originalImageUri` is null
- Button label stays "Share PDF"

### 3. Cleanup on Inspection Delete

**Location:** `src/contexts/DataProvider/DataProvider.tsx`

In the delete inspection method: after deleting the SQLite row, also delete the image file at the stored `originalImageUri` path if it exists. Use `FileSystem.deleteAsync(uri, { idempotent: true })`.

### 4. Reinspection Handling

When `setExtractedSDDGContent` is called during reinspection with a new image URI, the old persistent image becomes orphaned. To handle this:
- Before copying the new image, check if `inspection.originalImageUri` already points to a file in `sddg_images/`
- If so, delete the old file before storing the new one

---

## Edge Cases

| Scenario | Behavior |
|----------|----------|
| Manual entry (no image) | `originalImageUri` stays `null`, share button hidden |
| Image file missing at share time | Alert: "Scanned SDDG image not found" |
| Reinspection with new scan | Old image deleted, new image persisted |
| Inspection deleted | Image file deleted alongside SQLite row |
| App reinstall / data clear | Image files and SQLite DB are both in documentDirectory, cleared together |

---

## Files Changed

| File | Change |
|------|--------|
| `src/contexts/InspectionFormProvider/InspectionFormProvider.tsx` | Copy temp image to persistent storage in `setExtractedSDDGContent` |
| `src/screens/inspector/InspectorAMC1015Form.tsx` | Remove PDF generation, replace with image sharing, hide button when no image |
| `src/components/Inspector/Form1015Viewer.tsx` | Remove PDF generation, replace with image sharing, hide button when no image |
| `src/contexts/DataProvider/DataProvider.tsx` | Delete image file on inspection delete |

## Files Unchanged

| File | Reason |
|------|--------|
| `SDDGCameraScreen.tsx` | Still captures photo and passes temp URI — no change needed |
| `SDDGProcessingScreen.tsx` | Still calls `setExtractedSDDGContent(data, imageUri)` — no change needed |
| `SDDGUploadAndParse.tsx` | Gallery path unchanged |
| Types (`sddg.ts`) | `originalImageUri: string \| null` already exists |
| SQLite schema | `inspection_context` JSON blob already includes `originalImageUri` |

## Data Flow

```
Camera/Gallery
    → temp URI
    → SDDGProcessingScreen
    → setExtractedSDDGContent(data, tempUri)
    → [NEW] copy to FileSystem.documentDirectory/sddg_images/<timestamp>.jpg
    → store persistent URI as originalImageUri in context
    → saved to SQLite as part of inspection_context JSON blob
    → share button reads persistent URI
    → Sharing.shareAsync(persistentUri, { mimeType: 'image/jpeg' })
```
