# Implementation Plan: SDDG Document Column & Multi-Document Sharing

**Date:** 2026-02-11
**Design doc:** `docs/plans/2026-02-11-inspector-document-sharing-design.md`

---

## Context

Inspectors need to view and share two documents per inspection from the InspectorHomeScreen: the scanned SDDG image and the AMC Form 1015 PDF. Currently only the AMC 1015 is viewable/shareable. Inspectors also need to export both as a combined PDF. This plan implements Approach B from the design doc: two icon columns with long-press selection mode and a floating action bar.

## Key Findings from Exploration

- Form 1015 HTML generation is **inline** in `Form1015Viewer.tsx` (lines 269-278) — needs extraction to a shared utility
- `src/utils/sddgPdfGenerator.ts` provides the **exact pattern** to follow for the extraction
- The long-press BottomSheet is a **non-functional placeholder** — safe to replace with selection mode
- The share icon SVG is already rendered inline in the header area with an empty `onPress` — reuse it
- `ActionFooter` component (`src/components/ui/ActionFooter.tsx`) supports buttons with icons, loading states, and variants
- No existing image zoom viewer — build a simple one with `ScrollView` + `Image`
- `TapGestureHandler` pattern already used for status cells — same approach for checkboxes in selection mode
- The standard expo-print/sharing pattern: `Print.printToFileAsync` → `FileSystem.copyAsync` → `Sharing.shareAsync` → cleanup

---

## Step 1: Extract Form 1015 HTML generation into shared utility

**Create** `src/utils/form1015PdfGenerator.ts`

Follow the `sddgPdfGenerator.ts` pattern:
- Export `generateForm1015Html(data: Form1015HtmlData): string` — takes TCN, pass/fail status, inspector name, date, and formatted frustration items
- Export `generateForm1015Pdf(data): Promise<string>` — returns temp PDF URI
- Export `shareForm1015Pdf(data): Promise<void>` — generates, shares, cleans up

**Modify** `src/components/Inspector/Form1015Viewer.tsx`
- Replace inline HTML generation (lines 269-278) with a call to `generateForm1015Html()`
- Replace the `generateAndSharePdf` body with a call to `shareForm1015Pdf()`
- Keep the component's frustration mapping logic (it computes the data passed to the utility)

---

## Step 2: Create SDDGImageViewer component

**Create** `src/components/Inspector/SDDGImageViewer.tsx`

Props:
```typescript
interface SDDGImageViewerProps {
  inspection: InspectorShipment;
  onClose: () => void;
}
```

Structure:
- `SafeAreaView` with header: title "SDDG Document", close X button, "Share PDF" button
- Body: `ScrollView` with `maximumZoomScale={3}` and `minimumZoomScale={1}` wrapping an `Image` component displaying `inspection.inspectionContext.originalImageUri`
- Share button: wraps image in `<img>` HTML, uses `Print.printToFileAsync` → `Sharing.shareAsync` pattern
- File naming: `SDDG_<sanitized_TCN>_<DATE>.pdf`
- Error state: if `originalImageUri` is null or file doesn't exist on disk, show "SDDG image not available" message

---

## Step 3: Add SDDG Doc column and viewer modal to InspectorHomeScreen

**Modify** `src/screens/inspector/InspectorHomeScreen.tsx`

Table header (line 714 area):
- Add `<Text style={...}>SDDG Doc</Text>` before the existing "AMC 1015" header

New state:
```typescript
const [sddgViewerModalVisible, setSddgViewerModalVisible] = useState(false);
const [selectedInspectionForSDDG, setSelectedInspectionForSDDG] = useState<InspectorShipment | null>(null);
```

New handler (mirror `handleViewForm1015`):
```typescript
const handleViewSDDG = async (inspection: InspectorShipment) => {
  const fullInspection = await database.loadInspection(inspection.id);
  if (!fullInspection?.inspectionContext?.originalImageUri) {
    Alert.alert("Not Available", "No SDDG image for this inspection.");
    return;
  }
  setSelectedInspectionForSDDG(fullInspection);
  setSddgViewerModalVisible(true);
};
```

Row rendering (inside `renderItem`, before the AMC 1015 icon cell):
- Add conditional SDDG doc icon cell: if `item.inspectionContext?.originalImageUri` exists, show `file-document` icon with `onPress={() => handleViewSDDG(item)}`; otherwise show dash text

Modal (alongside existing Form 1015 modal, ~line 965):
```tsx
<Modal visible={sddgViewerModalVisible} animationType="slide" presentationStyle="fullScreen">
  {selectedInspectionForSDDG && (
    <SDDGImageViewer
      inspection={selectedInspectionForSDDG}
      onClose={() => {
        setSddgViewerModalVisible(false);
        setSelectedInspectionForSDDG(null);
      }}
    />
  )}
</Modal>
```

---

## Step 4: Implement selection mode state and long-press behavior

**Modify** `src/screens/inspector/InspectorHomeScreen.tsx`

New state:
```typescript
const [selectionMode, setSelectionMode] = useState(false);
const [selectedDocuments, setSelectedDocuments] = useState<Map<string, Set<'sddg' | '1015'>>>(new Map());
```

Replace `handleLongPress` (currently opens non-functional BottomSheet):
```typescript
const handleLongPress = (item: InspectorShipment) => {
  setSelectionMode(true);
  const docs = new Set<'sddg' | '1015'>();
  if (item.inspectionContext?.originalImageUri) docs.add('sddg');
  docs.add('1015');
  setSelectedDocuments(new Map([[item.id, docs]]));
};
```

Add toggle and exit functions:
```typescript
const toggleDocumentSelection = (inspectionId: string, docType: 'sddg' | '1015') => {
  setSelectedDocuments(prev => {
    const next = new Map(prev);
    const docs = new Set(next.get(inspectionId) || []);
    if (docs.has(docType)) docs.delete(docType);
    else docs.add(docType);
    if (docs.size === 0) next.delete(inspectionId);
    else next.set(inspectionId, docs);
    return next;
  });
};

const exitSelectionMode = () => {
  setSelectionMode(false);
  setSelectedDocuments(new Map());
};
```

Row rendering changes: when `selectionMode === true`, the two doc columns render checkboxes (`MaterialIcons` `check-box` / `check-box-outline-blank`) inside `TapGestureHandler` wrappers (same pattern as SDDG/Package status cells) instead of file icons. Checked state derived from `selectedDocuments.get(item.id)?.has('sddg')` etc.

Remove the old BottomSheet component and its state (`bottomSheetVisible`, `selectedInspection`) — non-functional placeholder.

---

## Step 5: Implement floating action bar

**Modify** `src/screens/inspector/InspectorHomeScreen.tsx`

When `selectionMode === true`, render a floating bar absolutely positioned at the bottom (inside `GestureHandlerRootView`):

```tsx
{selectionMode && (
  <View style={styles.selectionActionBar}>
    <TouchableOpacity onPress={exitSelectionMode}>
      <MaterialIcons name="close" size={24} color={colors.textSecondary} />
    </TouchableOpacity>
    <Text style={styles.selectionCountText}>
      {totalSelectedCount} document{totalSelectedCount !== 1 ? 's' : ''} selected
    </Text>
    <TouchableOpacity
      onPress={handleShareSelected}
      disabled={totalSelectedCount === 0 || isGeneratingPdf}
      style={[styles.shareButton, totalSelectedCount === 0 && styles.shareButtonDisabled]}
    >
      {isGeneratingPdf ? (
        <ActivityIndicator size="small" color={colors.white} />
      ) : (
        <Svg width={28} height={28} viewBox="0 0 64 64" fill="none">
          {/* share icon SVG — reuse from existing header preview */}
        </Svg>
      )}
    </TouchableOpacity>
  </View>
)}
```

Compute `totalSelectedCount` from Map: sum of all Sets' sizes.

Style: `colors.surface` background, top border, horizontal padding, `flexDirection: 'row'`, `alignItems: 'center'`, `justifyContent: 'space-between'`, shadow, absolutely positioned at bottom.

---

## Step 6: Implement combined PDF share handler

**Modify** `src/screens/inspector/InspectorHomeScreen.tsx`

```typescript
const handleShareSelected = async () => {
  setIsGeneratingPdf(true);
  try {
    // 1. Load full inspections
    const inspectionIds = Array.from(selectedDocuments.keys());
    const loadedInspections = await Promise.all(
      inspectionIds.map(id => database.loadInspection(id))
    );

    // 2. Build HTML sections
    const htmlSections: string[] = [];
    const errors: string[] = [];

    for (const loaded of loadedInspections) {
      if (!loaded) continue;
      const docs = selectedDocuments.get(loaded.id);

      if (docs?.has('sddg')) {
        const imageUri = loaded.inspectionContext?.originalImageUri;
        if (imageUri) {
          htmlSections.push(
            `<div style="page-break-after:always;">
              <img src="${imageUri}" style="width:100%;max-height:100vh;object-fit:contain;" />
            </div>`
          );
        } else {
          errors.push(`SDDG image missing for ${loaded.tcn}`);
        }
      }

      if (docs?.has('1015')) {
        const html = generateForm1015Html(buildForm1015Data(loaded));
        htmlSections.push(`<div style="page-break-after:always;">${html}</div>`);
      }
    }

    // 3. Generate PDF
    const fullHtml = `<!DOCTYPE html><html><head>
      <style>@page{margin:0;} body{margin:0;}</style>
    </head><body>${htmlSections.join('')}</body></html>`;
    const { uri: pdfUri } = await Print.printToFileAsync({ html: fullHtml, base64: false });

    // 4. Determine filename
    const isSingleInspection = inspectionIds.length === 1;
    const singleInspection = isSingleInspection ? loadedInspections[0] : null;
    const date = new Date().toISOString().split('T')[0];
    let filename: string;

    if (isSingleInspection && selectedDocuments.get(inspectionIds[0])?.size === 1) {
      const docType = Array.from(selectedDocuments.get(inspectionIds[0])!)[0];
      const tcn = singleInspection?.tcn?.replace(/[^a-zA-Z0-9]/g, '_') || 'unknown';
      filename = docType === 'sddg'
        ? `SDDG_${tcn}_${date}.pdf`
        : `AMC1015_${tcn}_${date}.pdf`;
    } else if (isSingleInspection) {
      const tcn = singleInspection?.tcn?.replace(/[^a-zA-Z0-9]/g, '_') || 'unknown';
      filename = `Inspection_${tcn}_${date}.pdf`;
    } else {
      filename = `Inspections_${date}.pdf`;
    }

    // 5. Share and cleanup
    const newUri = `${FileSystem.cacheDirectory}${filename}`;
    await FileSystem.copyAsync({ from: pdfUri, to: newUri });
    await Sharing.shareAsync(newUri, { mimeType: 'application/pdf', UTI: 'com.adobe.pdf' });
    await FileSystem.deleteAsync(pdfUri, { idempotent: true });
    await FileSystem.deleteAsync(newUri, { idempotent: true });

    if (errors.length > 0) {
      Alert.alert('Warning',
        `${errors.length} document(s) could not be included:\n${errors.join('\n')}`
      );
    }

    exitSelectionMode();
  } catch (error) {
    Alert.alert('Error', 'Failed to generate PDF. Please try again.');
  } finally {
    setIsGeneratingPdf(false);
  }
};
```

Add helper `buildForm1015Data(inspection)` that extracts data needed by `generateForm1015Html` from a loaded `InspectorShipment` — mirrors the frustration mapping, inspector formatting, and date formatting logic currently in `Form1015Viewer`.

---

## Files Summary

| File | Action |
|------|--------|
| `src/utils/form1015PdfGenerator.ts` | **Create** — shared HTML/PDF generation utilities |
| `src/components/Inspector/SDDGImageViewer.tsx` | **Create** — SDDG image viewer with share |
| `src/components/Inspector/Form1015Viewer.tsx` | **Modify** — use extracted utility for HTML/PDF |
| `src/screens/inspector/InspectorHomeScreen.tsx` | **Modify** — SDDG doc column, selection mode, floating action bar, combined share |

---

## Verification

1. **SDDG Doc column**: Tap the SDDG doc icon on an inspection captured via camera/gallery — fullscreen image viewer opens, pinch-to-zoom works, "Share PDF" exports a single-page PDF of the image
2. **AMC 1015 column**: Tap the 1015 icon — existing Form1015Viewer opens (regression check, should work identically)
3. **Selection mode entry**: Long-press any row — both doc columns become checkboxes, floating action bar appears with count
4. **Checkbox toggling**: Tap checkboxes on/off across multiple rows, count updates correctly
5. **Single doc share**: Select only one doc, tap share — PDF with correct single-doc filename
6. **Combined share**: Select SDDG + 1015 for same inspection, tap share — combined PDF with SDDG image as first page, 1015 form as second page
7. **Multi-inspection share**: Select docs across 2+ rows, tap share — combined PDF with all selected docs
8. **Exit selection mode**: Tap X — checkboxes disappear, icons return, action bar hides
9. **Missing image**: Manual-entry inspection shows dash in SDDG Doc column, no icon to tap
10. **Run existing tests**: `npx jest --passWithNoTests` to check for regressions
