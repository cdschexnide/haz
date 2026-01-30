# Cell-Based Extraction Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Use OpenCV cell detection to auto-size field regions, then extract all OCR text inside each cell — replacing the anchor-based spatial proximity approach for non-table, non-checkbox fields.

**Architecture:** OpenCV detects grid lines → builds cell bounding boxes → OCR text inside each cell is matched to a field label → all text in the cell becomes the field value. Falls back to existing anchor-based extraction when OpenCV fails or a field has no matching cell.

**Tech Stack:** react-native-fast-opencv (existing), @react-native-ml-kit/text-recognition (existing), TypeScript

---

### Task 1: Create cellBasedExtraction.ts — cell-to-field mapping

**Files:**
- Create: `src/services/sddg/cellBasedExtraction.ts`

**Step 1: Write the cell-to-field mapping module**

Create `src/services/sddg/cellBasedExtraction.ts` with:

```typescript
/**
 * Cell-Based Extraction
 *
 * Uses OpenCV-detected cell boundaries to define field regions,
 * then extracts all OCR text inside each cell.
 *
 * This replaces the anchor-based spatial proximity approach
 * for non-table, non-checkbox fields. The cell boundary IS
 * the source of truth for what text belongs to a field.
 */

import { TextBlock, BoundingBox, ExtractionResult, AnchorExtractionResult } from "./anchorTypes";
import { DetectedCell, CellDetectionResult } from "./opencvTypes";
import { detectCells } from "./opencvCellDetection";
import { SDDG_ANCHORS, getAnchorConfig } from "./anchorConfig";
import { applyPostProcessing } from "./valueExtraction";

/**
 * Field label mapping — ordered by specificity (longest/most-specific first)
 * to avoid ambiguity (e.g., "SHIPPER'S REFERENCE" must match before "SHIPPER")
 */
const CELL_FIELD_LABELS: Array<{
  fieldId: string;
  labels: string[];
  excludeLabels?: string[];
}> = [
  // Most specific first
  {
    fieldId: "shipper_reference_tcn",
    labels: ["SHIPPER'S REFERENCE", "SHIPPERS REFERENCE", "TCN"],
  },
  {
    fieldId: "shipper",
    labels: ["SHIPPER"],
    excludeLabels: ["SHIPPER'S REFERENCE", "SHIPPERS REFERENCE"],
  },
  { fieldId: "consignee", labels: ["CONSIGNEE"] },
  { fieldId: "air_waybill", labels: ["AIR WAYBILL"] },
  { fieldId: "airport_departure", labels: ["AIRPORT OF DEPARTURE"] },
  { fieldId: "airport_destination", labels: ["AIRPORT OF DESTINATION"] },
  { fieldId: "additional_handling", labels: ["ADDITIONAL HANDLING"] },
  {
    fieldId: "name_title_signatory",
    labels: ["NAME/TITLE OF SIGNATORY", "NAME OF SIGNATORY"],
  },
  { fieldId: "place_date", labels: ["PLACE AND DATE"] },
  { fieldId: "emergency_telephone", labels: ["EMERGENCY TELEPHONE"] },
  {
    fieldId: "signature",
    labels: ["SIGNATURE"],
    excludeLabels: ["NAME/TITLE OF SIGNATORY", "NAME OF SIGNATORY"],
  },
];

/**
 * Check if a text block's center falls inside a cell
 */
function isBlockCenterInCell(block: TextBlock, cell: DetectedCell): boolean {
  const centerX = block.boundingBox.x + block.boundingBox.width / 2;
  const centerY = block.boundingBox.y + block.boundingBox.height / 2;

  return (
    centerX >= cell.x &&
    centerX <= cell.x + cell.width &&
    centerY >= cell.y &&
    centerY <= cell.y + cell.height
  );
}

/**
 * Get all text blocks whose center falls inside a cell
 */
function getTextBlocksInCell(
  cell: DetectedCell,
  textBlocks: TextBlock[]
): TextBlock[] {
  return textBlocks.filter(block => isBlockCenterInCell(block, cell));
}

/**
 * Concatenate the text in a cell as a single uppercase string for label matching
 */
function getCellText(cell: DetectedCell, textBlocks: TextBlock[]): string {
  const blocks = getTextBlocksInCell(cell, textBlocks);
  return blocks
    .map(b => b.text)
    .join(" ")
    .toUpperCase()
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Map detected cells to field IDs by checking which label text appears inside each cell.
 * Returns a Map from fieldId to the DetectedCell that contains that field.
 */
export function mapCellsToFields(
  cells: DetectedCell[],
  textBlocks: TextBlock[]
): Map<string, DetectedCell> {
  const fieldCellMap = new Map<string, DetectedCell>();
  const assignedCells = new Set<number>(); // Track cell indices already assigned

  // Process labels in priority order (most specific first)
  for (const fieldDef of CELL_FIELD_LABELS) {
    for (let i = 0; i < cells.length; i++) {
      if (assignedCells.has(i)) continue;

      const cellText = getCellText(cells[i], textBlocks);
      if (!cellText) continue;

      // Check if any of this field's labels appear in the cell text
      const hasLabel = fieldDef.labels.some(label =>
        cellText.includes(label.toUpperCase())
      );
      if (!hasLabel) continue;

      // Check exclude labels — if any exclude label is present, skip this cell
      const hasExcludeLabel = fieldDef.excludeLabels?.some(label =>
        cellText.includes(label.toUpperCase())
      );
      if (hasExcludeLabel) continue;

      fieldCellMap.set(fieldDef.fieldId, cells[i]);
      assignedCells.add(i);
      console.log(
        `📦 Cell mapped: ${fieldDef.fieldId} → cell at (${Math.round(cells[i].x)}, ${Math.round(cells[i].y)}) ${Math.round(cells[i].width)}x${Math.round(cells[i].height)}`
      );
      break; // Move to next field
    }
  }

  return fieldCellMap;
}

/**
 * Extract all text from a cell in reading order.
 * No label filtering — the cell boundary defines what belongs to the field.
 */
export function extractTextFromCell(
  cell: DetectedCell,
  textBlocks: TextBlock[]
): string {
  const blocks = getTextBlocksInCell(cell, textBlocks);

  if (blocks.length === 0) return "";

  // Sort by reading order (top-to-bottom, left-to-right)
  const LINE_THRESHOLD = 15; // pixels — blocks within 15px vertically are on same line
  const sorted = [...blocks].sort((a, b) => {
    const yDiff = a.boundingBox.y - b.boundingBox.y;
    if (Math.abs(yDiff) < LINE_THRESHOLD) {
      return a.boundingBox.x - b.boundingBox.x;
    }
    return yDiff;
  });

  // Concatenate with appropriate separators
  let result = "";
  let lastY = -Infinity;

  for (const block of sorted) {
    const yDiff = block.boundingBox.y - lastY;

    if (result.length > 0) {
      if (yDiff > LINE_THRESHOLD) {
        result += "\n";
      } else {
        result += " ";
      }
    }

    result += block.text;
    lastY = block.boundingBox.y;
  }

  return result;
}

/**
 * Fields that should NOT use cell-based extraction
 * (they have specialized extraction logic in the anchor pipeline)
 */
const SKIP_CELL_EXTRACTION = new Set([
  // Table column fields — handled by computeAdaptiveTableRegions
  "un_number",
  "proper_shipping_name",
  "class_division",
  "packing_group",
  "quantity_type_packing",
  "packing_inst",
  "authorization",
  // Checkbox fields — handled by extractCheckboxValue
  "aircraft_type",
  "shipment_type",
  // Inline pattern fields
  "page_info",
  // Phone number is now captured inside the shipper cell
  "phone_number",
]);

/**
 * Run cell-based extraction: OpenCV cell detection + OCR text inside cells.
 *
 * Returns a Map of fieldId → extracted value for fields that were
 * successfully extracted via cell boundaries. Fields not in this map
 * should fall back to anchor-based extraction.
 */
export async function extractFieldsFromCells(
  imageUri: string,
  textBlocks: TextBlock[]
): Promise<{
  cellResults: Map<string, string>;
  cellDetection: CellDetectionResult;
}> {
  const cellResults = new Map<string, string>();

  // Step 1: Detect cells via OpenCV
  console.log("🔲 Running OpenCV cell detection...");
  const cellDetection = await detectCells(imageUri);

  if (!cellDetection.success) {
    console.log(
      `⚠️ Cell detection failed: ${cellDetection.error || "< 10 cells detected"}. Will use anchor-based fallback.`
    );
    return { cellResults, cellDetection };
  }

  console.log(
    `✅ Cell detection: ${cellDetection.cells.length} cells found (${cellDetection.imageWidth}x${cellDetection.imageHeight})`
  );

  // Step 2: Map cells to fields
  const fieldCellMap = mapCellsToFields(cellDetection.cells, textBlocks);
  console.log(
    `🗺️ Mapped ${fieldCellMap.size} fields to cells: ${[...fieldCellMap.keys()].join(", ")}`
  );

  // Step 3: Extract text from each mapped cell
  for (const [fieldId, cell] of fieldCellMap) {
    if (SKIP_CELL_EXTRACTION.has(fieldId)) continue;

    let value = extractTextFromCell(cell, textBlocks);

    // Apply post-processing from anchor config
    const config = getAnchorConfig(fieldId);
    if (config?.postProcessing && config.postProcessing.length > 0) {
      value = applyPostProcessing(value, config.postProcessing);
    }

    if (value) {
      cellResults.set(fieldId, value);
      console.log(
        `📦 Cell extracted ${fieldId}: "${value.substring(0, 60)}${value.length > 60 ? "..." : ""}"`
      );
    }
  }

  return { cellResults, cellDetection };
}
```

**Step 2: Commit**

```bash
git add src/services/sddg/cellBasedExtraction.ts
git commit -m "feat: add cell-based extraction module

Maps OpenCV-detected cells to field labels, extracts all OCR text
inside each cell boundary. No isKnownLabel filtering needed."
```

---

### Task 2: Integrate cell-based extraction into anchorBasedExtractor.ts

**Files:**
- Modify: `src/services/sddg/anchorBasedExtractor.ts`

**Step 1: Add import and call cell-based extraction before anchor loop**

At the top of the file, add import:

```typescript
import { extractFieldsFromCells } from "./cellBasedExtraction";
```

**Step 2: Modify extractWithAnchors() to use cell results**

Inside `extractWithAnchors()`, after the OCR step (after line 89: `const textBlocks = convertToMLKitFormat(mlKitResult);`), add the cell-based extraction call:

```typescript
    // Step 1b: Try cell-based extraction (OpenCV cells + OCR text inside)
    console.log("🔲 Attempting cell-based extraction...");
    const { cellResults, cellDetection } = await extractFieldsFromCells(
      imageUri,
      textBlocks
    );
    console.log(`🔲 Cell-based extraction got ${cellResults.size} fields`);
```

Then, inside the main `for (const config of SDDG_ANCHORS)` loop (at the top, after `processedFields++` and the `onProgress` call), add an early-out check:

```typescript
      // Check if cell-based extraction already got this field
      if (cellResults.has(config.fieldId)) {
        const cellValue = cellResults.get(config.fieldId)!;
        results.set(config.fieldId, {
          fieldId: config.fieldId,
          value: cellValue,
          confidence: 0.95,
          status: "extracted",
        });
        console.log(`📦 ${config.fieldId}: using cell-based result`);
        continue;
      }
```

This goes right after the `onProgress` callback (line 172) and before the existing `const anchor = anchors.get(config.fieldId);` line (line 174).

**Step 3: Commit**

```bash
git add src/services/sddg/anchorBasedExtractor.ts
git commit -m "feat: integrate cell-based extraction into anchor pipeline

Cell-based results take priority for non-table, non-checkbox fields.
Anchor-based logic remains as fallback for unmapped fields."
```

---

### Task 3: Verify no changes needed in SDDGProcessingScreen.tsx

**Files:**
- Review (no changes): `src/screens/SDDG/SDDGProcessingScreen.tsx`

The processing screen already calls `extractWithAnchors(imageUri, onProgress)` at line 140. Since we integrated cell-based extraction *inside* `extractWithAnchors()`, no changes are needed here. The hybrid behavior is transparent to the caller.

**Step 1: Verify the flow**

Confirm that:
1. `SDDGProcessingScreen` calls `extractWithAnchors()` (line 140)
2. `extractWithAnchors()` now internally calls `extractFieldsFromCells()` first
3. Cell-extracted fields short-circuit the anchor loop
4. Non-cell fields (tables, checkboxes, unmapped) still use anchor logic
5. `convertToSDDGData()` and `mapToHazproFormat()` are unchanged — they consume the same `AnchorExtractionResult` structure

No commit needed — no files changed.

---

### Task 4: Test on device

**Step 1: Build and run**

```bash
npx react-native run-ios
```

or for Android:

```bash
npx react-native run-android
```

**Step 2: Scan SDDG form and check results**

Scan the same SDDG form used in the session screenshots. Check:

1. **Shipper block**: Should now include phone number and DSN (e.g., `(609) 754-2665` and `650-2665`)
2. **Consignee block**: Should now include first address line (e.g., `0000 HQ CJTF-HOA LOG`)
3. **All other fields**: Should still extract correctly (no regression)

Check the console logs for:
- `🔲 Cell detection: N cells found` — confirms OpenCV ran
- `📦 Cell mapped: shipper → cell at (x, y)` — confirms shipper cell was identified
- `📦 Cell mapped: consignee → cell at (x, y)` — confirms consignee cell was identified
- `📦 Cell extracted shipper: "..."` — confirms text was extracted from cell
- `📦 Cell extracted consignee: "..."` — confirms text was extracted from cell
- Fields not mapped to cells should show `📐 Adaptive ...` logs (anchor fallback)

**Step 3: Commit if passing**

```bash
git add -A
git commit -m "test: verify cell-based extraction on device"
```

---

## Summary of Changes

| File | Action | Purpose |
|------|--------|---------|
| `src/services/sddg/cellBasedExtraction.ts` | Create | Cell-to-field mapping + text extraction from cells |
| `src/services/sddg/anchorBasedExtractor.ts` | Modify | Call cell extraction first, use results, fall back to anchors |
| `src/screens/SDDG/SDDGProcessingScreen.tsx` | None | No changes — hybrid behavior is internal to extractWithAnchors |

## Rollback

If cell-based extraction causes regressions, the fix is one line: comment out or remove the `extractFieldsFromCells()` call in `anchorBasedExtractor.ts`. The anchor-based logic remains fully intact as fallback.
