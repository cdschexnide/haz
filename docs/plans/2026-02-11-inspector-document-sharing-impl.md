# Implementation Plan: SDDG Document Column & Multi-Document Sharing

**Date:** 2026-02-11 (revised per code review)
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
- No existing image zoom viewer — build one using `PinchGestureHandler` from `react-native-gesture-handler` (already installed) for cross-platform support
- `TapGestureHandler` pattern already used for status cells — same approach for checkboxes in selection mode
- The standard expo-print/sharing pattern: `Print.printToFileAsync` → `FileSystem.copyAsync` → `Sharing.shareAsync` → cleanup
- **Critical:** `listInspections()` returns lightweight metadata WITHOUT `inspectionContext` (performance optimization at `DataProvider.tsx:497`). A denormalized `has_sddg_image` column is needed.

---

## Step 1: Add `has_sddg_image` denormalized column (schema migration v2→v3)

**Modify** `src/contexts/DataProvider/schema.ts`
- Bump `SCHEMA_VERSION` from 2 to 3
- Add `has_sddg_image INTEGER NOT NULL DEFAULT 0` to `CREATE_TABLES_SQL`
- Add `migrateV2ToV3()`: `ALTER TABLE inspector_shipments ADD COLUMN has_sddg_image INTEGER NOT NULL DEFAULT 0;` then backfill existing rows: `UPDATE inspector_shipments SET has_sddg_image = 1 WHERE inspection_context LIKE '%originalImageUri%' AND inspection_context NOT LIKE '%"originalImageUri":null%';`
- Register migration in `initializeDatabase()`

**Modify** `src/contexts/DataProvider/DataProvider.tsx`
- `inspectionToRow()`: add `has_sddg_image: inspection.inspectionContext?.originalImageUri ? 1 : 0`
- `rowToMetadata()`: add `hasSddgImage: row.has_sddg_image === 1`
- `listInspections()` query: add `has_sddg_image` to the selected columns
- `saveInspection()` / `updateInspection()`: include `has_sddg_image` in INSERT/UPDATE

**Modify** `src/types/sddg.ts`
- Add `hasSddgImage?: boolean` to `InspectorShipment` interface

---

## Step 2: Extract Form 1015 HTML generation into shared utility

**Create** `src/utils/form1015PdfGenerator.ts`

Follow the `sddgPdfGenerator.ts` pattern:

```typescript
export interface Form1015HtmlData {
  tcn: string;
  allPassed: boolean;
  inspectedByName: string;
  inspectedByDate: string;
  failedItems: Array<{ formatted: string }>;
}

// Returns HTML FRAGMENT (no <!DOCTYPE>, <html>, <head>, <body> wrappers)
// This allows standalone use (wrapped in full doc) and combined use (nested in combined doc)
export function generateForm1015Html(data: Form1015HtmlData): string { ... }

// Wraps fragment in full HTML document and generates PDF
export async function shareForm1015Pdf(data: Form1015HtmlData): Promise<void> { ... }

// Builds Form1015HtmlData from a loaded InspectorShipment
// Single source of truth — used by both Form1015Viewer and combined share
export function buildForm1015Data(inspection: InspectorShipment): Form1015HtmlData { ... }
```

The `buildForm1015Data()` helper extracts the frustration mapping, inspector formatting, and date formatting logic currently duplicated in `Form1015Viewer`. This is the **single source of truth** — both standalone and combined export use this same function, eliminating drift risk.

**Modify** `src/components/Inspector/Form1015Viewer.tsx`
- Replace inline HTML generation (lines 269-278) with `generateForm1015Html(buildForm1015Data(inspection))`
- Replace `generateAndSharePdf` body with `shareForm1015Pdf(buildForm1015Data(inspection))`
- Remove the component-local frustration-to-HTML mapping that's now in `buildForm1015Data`

---

## Step 3: Create SDDGImageViewer component

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
- Body: Use `PinchGestureHandler` from `react-native-gesture-handler` wrapping an `Animated.Image` with scale transforms for **cross-platform** pinch-to-zoom (not `ScrollView` `maximumZoomScale` which is iOS-only)
- **On mount:** verify image exists on disk via `FileSystem.getInfoAsync(originalImageUri)`. If file is missing, show "SDDG image not available" error state.
- Share button: wraps image in `<img>` HTML, uses `Print.printToFileAsync` → `Sharing.shareAsync` pattern
- File naming: `SDDG_<sanitized_TCN>_<DATE>.pdf`

---

## Step 4: Add SDDG Doc column and viewer modal to InspectorHomeScreen

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
- Add conditional SDDG doc icon cell: if `item.hasSddgImage` (denormalized metadata flag from Step 1), show `file-document` icon with `onPress={() => handleViewSDDG(item)}`; otherwise show dash text

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

## Step 5: Implement selection mode state, long-press, and gesture coexistence

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
  if (item.hasSddgImage) docs.add('sddg');  // Use denormalized flag, not inspectionContext
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

**Android BackHandler:** Register a `BackHandler` listener when `selectionMode` is true:
```typescript
useEffect(() => {
  if (!selectionMode) return;
  const handler = BackHandler.addEventListener('hardwareBackPress', () => {
    exitSelectionMode();
    return true; // Prevent default back navigation
  });
  return () => handler.remove();
}, [selectionMode]);
```

**Gesture coexistence:** Disable `Swipeable` rows during selection mode to prevent gesture conflicts:
```tsx
<Swipeable
  enabled={!selectionMode}  // Disable swipe actions during selection mode
  renderLeftActions={renderLeftActions(item)}
  renderRightActions={renderRightActions(item)}
  ...
>
```

Row rendering changes: when `selectionMode === true`, the two doc columns render checkboxes (`MaterialIcons` `check-box` / `check-box-outline-blank`) inside `TapGestureHandler` wrappers instead of file icons. Checked state derived from `selectedDocuments.get(item.id)?.has('sddg')` etc.

Remove the old BottomSheet component and its state (`bottomSheetVisible`, `selectedInspection`) — non-functional placeholder.

---

## Step 6: Implement floating action bar

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

## Step 7: Implement combined PDF share handler

**Modify** `src/screens/inspector/InspectorHomeScreen.tsx`

```typescript
const handleShareSelected = async () => {
  setIsGeneratingPdf(true);
  try {
    // 1. Load full inspections using Promise.allSettled (not Promise.all)
    // so one failure doesn't abort the entire share
    const inspectionIds = Array.from(selectedDocuments.keys());
    const settledResults = await Promise.allSettled(
      inspectionIds.map(id => database.loadInspection(id))
    );

    const htmlSections: string[] = [];
    const errors: string[] = [];

    // 2. Process in table order (inspectionIds preserves Map insertion order,
    // which matches FlatList order since selections happen via rendered rows)
    // Within each inspection: SDDG first, then AMC 1015
    for (let i = 0; i < settledResults.length; i++) {
      const result = settledResults[i];
      if (result.status === 'rejected' || !result.value) {
        errors.push(`Failed to load inspection ${inspectionIds[i]}`);
        continue;
      }

      const loaded = result.value;
      const docs = selectedDocuments.get(loaded.id);

      if (docs?.has('sddg')) {
        const imageUri = loaded.inspectionContext?.originalImageUri;
        if (imageUri) {
          // Verify file actually exists on disk (not just a stale URI)
          const fileInfo = await FileSystem.getInfoAsync(imageUri);
          if (fileInfo.exists) {
            htmlSections.push(
              `<div style="page-break-after:always;">
                <img src="${imageUri}" style="width:100%;max-height:100vh;object-fit:contain;" />
              </div>`
            );
          } else {
            errors.push(`SDDG image file missing on disk for ${loaded.tcn}`);
          }
        } else {
          errors.push(`SDDG image URI missing for ${loaded.tcn}`);
        }
      }

      if (docs?.has('1015')) {
        // Use shared utility — single source of truth (no drift from Form1015Viewer)
        const data = buildForm1015Data(loaded);
        const fragment = generateForm1015Html(data);
        htmlSections.push(`<div style="page-break-after:always;">${fragment}</div>`);
      }
    }

    // 3. Abort if ALL documents failed — don't generate an empty PDF
    if (htmlSections.length === 0) {
      Alert.alert(
        'Export Failed',
        errors.length > 0
          ? `No documents could be exported:\n${errors.join('\n')}`
          : 'No documents selected.'
      );
      return;
    }

    // 4. Wrap fragments in single HTML document shell
    const fullHtml = `<!DOCTYPE html>
      <html><head>
        <meta charset="utf-8">
        <style>@page { margin: 10mm; } body { margin: 0; font-family: sans-serif; }</style>
      </head><body>${htmlSections.join('')}</body></html>`;
    const { uri: pdfUri } = await Print.printToFileAsync({ html: fullHtml, base64: false });

    // 5. Determine filename
    const isSingleInspection = inspectionIds.length === 1;
    const date = new Date().toISOString().split('T')[0];
    let filename: string;

    if (isSingleInspection) {
      const singleResult = settledResults[0];
      const singleInspection = singleResult.status === 'fulfilled' ? singleResult.value : null;
      const tcn = singleInspection?.tcn?.replace(/[^a-zA-Z0-9]/g, '_') || 'unknown';
      const selectedDocs = selectedDocuments.get(inspectionIds[0]);

      if (selectedDocs?.size === 1) {
        const docType = Array.from(selectedDocs)[0];
        filename = docType === 'sddg'
          ? `SDDG_${tcn}_${date}.pdf`
          : `AMC1015_${tcn}_${date}.pdf`;
      } else {
        filename = `Inspection_${tcn}_${date}.pdf`;
      }
    } else {
      filename = `Inspections_${date}.pdf`;
    }

    // 6. Share and cleanup
    const newUri = `${FileSystem.cacheDirectory}${filename}`;
    await FileSystem.copyAsync({ from: pdfUri, to: newUri });
    await Sharing.shareAsync(newUri, { mimeType: 'application/pdf', UTI: 'com.adobe.pdf' });
    await FileSystem.deleteAsync(pdfUri, { idempotent: true });
    await FileSystem.deleteAsync(newUri, { idempotent: true });

    // 7. Report partial failures
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

---

## Files Summary

| File | Action |
|------|--------|
| `src/contexts/DataProvider/schema.ts` | **Modify** — add `has_sddg_image` column, migration v2→v3 |
| `src/contexts/DataProvider/DataProvider.tsx` | **Modify** — set `has_sddg_image` on save/update, include in metadata query |
| `src/types/sddg.ts` | **Modify** — add `hasSddgImage?: boolean` to `InspectorShipment` |
| `src/utils/form1015PdfGenerator.ts` | **Create** — shared HTML fragment generation + `buildForm1015Data()` (single source of truth) |
| `src/components/Inspector/SDDGImageViewer.tsx` | **Create** — SDDG image viewer with cross-platform pinch-to-zoom |
| `src/components/Inspector/Form1015Viewer.tsx` | **Modify** — delegate to shared utility |
| `src/screens/inspector/InspectorHomeScreen.tsx` | **Modify** — SDDG doc column, selection mode, BackHandler, gesture coexistence, floating action bar, combined share |

---

## Verification

### Manual Testing
1. **SDDG Doc column**: Tap the SDDG doc icon on an inspection captured via camera/gallery — fullscreen image viewer opens, pinch-to-zoom works on both iOS and Android, "Share PDF" exports a single-page PDF
2. **Missing SDDG**: Manual-entry inspection shows dash in SDDG Doc column, no icon to tap
3. **AMC 1015 column**: Tap the 1015 icon — existing Form1015Viewer opens (regression check, identical behavior)
4. **Selection mode entry**: Long-press any row — both doc columns become checkboxes, floating action bar appears with count, swipe actions are disabled
5. **Checkbox toggling**: Tap checkboxes on/off across multiple rows, count updates correctly
6. **Android back**: Press hardware back while in selection mode — exits selection mode without navigating away
7. **Single doc share**: Select only one doc, tap share — PDF with correct single-doc filename
8. **Combined share**: Select SDDG + 1015 for same inspection — combined PDF with SDDG image first, 1015 form second
9. **Multi-inspection share**: Select docs across 2+ rows — combined PDF ordered by table order
10. **Partial failure**: Delete an SDDG image file from disk, select it + a valid 1015 — share succeeds with warning about the missing image
11. **Total failure**: Select only documents that will fail — error alert, no empty PDF generated
12. **Exit selection mode**: Tap X — checkboxes disappear, icons return, action bar hides, swipe re-enabled

### Automated Tests
13. **Run existing tests**: `npx jest --passWithNoTests` for regression check
14. **New unit tests for `form1015PdfGenerator.ts`**: test `buildForm1015Data()` produces correct structure from InspectorShipment, test `generateForm1015Html()` returns fragment (no `<!DOCTYPE>` or `<html>` tags)
15. **New unit tests for selection state**: test `toggleDocumentSelection` map operations (add, remove, empty set cleanup), test `totalSelectedCount` computation
16. **New unit tests for filename logic**: test single-SDDG, single-1015, combined single-inspection, multi-inspection filename patterns
17. **New unit test for schema migration**: test `migrateV2ToV3` adds column and backfills correctly
