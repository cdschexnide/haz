# Inspector Home Screen: SDDG Document Column and Multi-Document Sharing

**Date:** 2026-02-11
**Status:** Design approved (revised per code review 2026-02-11)

---

## Problem

Inspectors need to view and share two documents per inspection: the scanned SDDG form (image) and the AMC Form 1015 (generated PDF). Currently only the AMC 1015 is viewable/shareable from the home screen. Inspectors also need to export both documents as a single combined PDF.

## Design

### Table Layout

Add an 8th column "SDDG Doc" to the inspection table, inserted before the existing "AMC 1015" column:

```
| TCN | UN No. | PSN | SDDG | Package | Inspector | SDDG Doc | AMC 1015 |
```

- Both document columns render a `MaterialCommunityIcons` `file-document` icon (icon-only, ~44px wide)
- The SDDG Doc icon only appears if the inspection has a stored SDDG image. **Note:** `listInspections()` returns lightweight metadata without `inspectionContext`, so a new denormalized `has_sddg_image` boolean column must be added to the `inspector_shipments` table (schema migration v2→v3) and included in the metadata query. The column is set during `saveInspection` / `updateInspection` based on whether `inspectionContext.originalImageUri` is truthy. Manual-entry inspections (no image) show a dash.
- Tapping either icon opens a fullscreen modal for that document

### SDDG Image Viewer

New component: `SDDGImageViewer`

- **Props:** `inspection: InspectorShipment`, `onClose: () => void`
- **Layout:** `SafeAreaView` with header bar (title "SDDG Document", close X, "Share PDF" button) and a zoomable image body
- **Zoom:** Use `react-native-gesture-handler` `PinchGestureHandler` + `Animated` transforms for cross-platform pinch-to-zoom (iOS and Android). `ScrollView` `maximumZoomScale`/`minimumZoomScale` is iOS-only and unreliable on Android.
- **Share:** Wraps the image into a single-page PDF via `Print.printToFileAsync` with `<img>` tag in HTML, shares via `Sharing.shareAsync`
- **File naming:** `SDDG_<TCN>_<DATE>.pdf`
- **Error state:** Verify file exists on disk via `FileSystem.getInfoAsync` before displaying. If missing, show "SDDG image not available" with close button.

**Modal in InspectorHomeScreen:** New state variables `sddgViewerModalVisible` and `selectedInspectionForSDDG`, same pattern as `form1015ModalVisible` / `selectedInspectionForForm`.

### Long-Press Selection Mode

Long-pressing any row enters "selection mode" for multi-document sharing.

**Entering selection mode:**
- Long-press a row -> that row is selected, its existing documents are pre-checked (SDDG only if `hasSddgImage` is true on the metadata row)
- The two document icon cells across all rows transform into checkboxes (`MaterialIcons` `check-box` / `check-box-outline-blank`)
- A floating action bar slides up from the bottom
- Replaces the current long-press BottomSheet behavior (which is unused/non-functional)
- **Swipeable rows are disabled** during selection mode (`enabled={!selectionMode}` on the `Swipeable` component) to prevent gesture conflicts between checkbox taps, swipe actions, and long-press

**While in selection mode:**
- Tap any checkbox to toggle on/off (works across rows)
- Floating action bar shows document count ("2 documents selected") and the share icon SVG button (`assets/share-icon.svg`)
- A Cancel/X button exits selection mode

**Exiting selection mode:**
- Tap Cancel/X
- After sharing completes
- Hardware back on Android (via `BackHandler` event listener registered when `selectionMode` is true)

### Selection Mode State

All state is local to `InspectorHomeScreen`:

```typescript
const [selectionMode, setSelectionMode] = useState(false);
const [selectedDocuments, setSelectedDocuments] = useState<Map<string, Set<'sddg' | '1015'>>>(new Map());
// Map key = inspection.id, Set values = which docs are selected for that row
```

**Entering:**
```typescript
const handleLongPress = (item: InspectorShipment) => {
  setSelectionMode(true);
  const docs = new Set<'sddg' | '1015'>();
  if (item.hasSddgImage) docs.add('sddg');  // Use denormalized metadata flag
  docs.add('1015');
  setSelectedDocuments(new Map([[item.id, docs]]));
};
```

**Toggling:** Update the Map, add/remove doc types per inspection ID. Empty Sets remove the key. Empty Map disables the share button.

**Row rendering:** When `selectionMode === true`, the two doc columns render checkboxes instead of file icons. Rest of the row renders normally.

### Combined PDF Generation

**Share flow when user taps the share button:**

1. **Load full inspections.** Use `Promise.allSettled` (not `Promise.all`) to load inspections in parallel. Failed loads are skipped with an error message; one failure does not abort the entire share.

2. **Build HTML.** Iterate loaded inspections in **table order** (matching the FlatList's `inspected_at` descending order). Within each inspection, SDDG comes first, then AMC 1015. For each:
   - If `'sddg'` selected: verify image exists on disk via `FileSystem.getInfoAsync`. If exists, append `<img>` section. If not, add to error list.
   - If `'1015'` selected: call `generateForm1015Html()` (which returns an HTML **fragment**, not a full document) and append it
   - Insert `page-break-after: always` between sections

3. **Check for empty result.** If all selected documents failed (htmlSections is empty), show an error Alert and abort — do not generate/share an empty PDF.

4. **Generate PDF.** Single `Print.printToFileAsync({ html })` call. The combined generator wraps all HTML fragments in a single `<!DOCTYPE html>` document shell.

5. **Share.** Copy to named file, then `Sharing.shareAsync()`.

6. **Cleanup.** Delete temp files, exit selection mode.

**File naming:**
- Single doc from one inspection: `SDDG_<TCN>_<DATE>.pdf` or `AMC1015_<TCN>_<DATE>.pdf`
- Combined from one inspection: `Inspection_<TCN>_<DATE>.pdf`
- Multiple inspections: `Inspections_<DATE>.pdf`

**Loading indicator:** `ActivityIndicator` overlay or disabled share button with spinner while generating.

**Error handling:** If an inspection fails to load or image file is missing on disk, skip it. If any documents were skipped, show Alert after sharing: "N document(s) could not be included: ..." with specific TCN references. If ALL documents fail, show error and do not share.

### HTML Composition Contract

The shared `generateForm1015Html()` utility returns an HTML **fragment** (the form content with inline styles, no `<!DOCTYPE>`, `<html>`, `<head>`, or `<body>` tags). This allows:
- **Form1015Viewer** to wrap the fragment in a full HTML document for standalone PDF generation
- **Combined PDF generator** to nest multiple fragments inside a single HTML document shell with page breaks

This avoids producing malformed HTML from nesting full documents inside another document.

## Files to Create/Modify

| File | Change |
|------|--------|
| `src/components/Inspector/SDDGImageViewer.tsx` | **New** — SDDG image viewer with cross-platform pinch-to-zoom |
| `src/utils/form1015PdfGenerator.ts` | **New** — shared HTML fragment generation + `buildForm1015Data()` helper (single source of truth for frustration mapping logic) |
| `src/components/Inspector/Form1015Viewer.tsx` | **Modify** — delegate to shared utility, remove inline HTML generation |
| `src/screens/inspector/InspectorHomeScreen.tsx` | **Modify** — SDDG Doc column, selection mode, floating action bar, BackHandler, combined share |
| `src/contexts/DataProvider/schema.ts` | **Modify** — add `has_sddg_image` column, migration v2→v3 |
| `src/contexts/DataProvider/DataProvider.tsx` | **Modify** — set `has_sddg_image` on save/update, include in metadata query and `rowToMetadata` |
| `src/types/sddg.ts` | **Modify** — add `hasSddgImage?: boolean` to `InspectorShipment` |

## No Changes Needed

- **InspectionFormProvider** — `originalImageUri` is already stored and persisted
- **SDDGProcessingScreen** — already passes image URI to `setExtractedSDDGContent`
