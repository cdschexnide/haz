# Cell-Based Extraction Design

## Problem

The current anchor-based extraction pipeline misses data in two specific cases:

1. **Shipper phone/DSN missing**: The `phone_number` field is configured as a separate anchor, and the shipper field's `boundedBy` rule excludes it. The `isKnownLabel` filter also discards any block containing "PHONE NUMBER" or "DSN".

2. **Consignee first address line missing**: ML Kit merges "CONSIGNEE 0000 HQ CJTF-HOA LOG" into one text line. The `isKnownLabel` check sees "CONSIGNEE" (9 chars, passes the >= 5 length check) and discards the entire block including the concatenated first address line.

Both bugs stem from the same root cause: the anchor-based approach works "inside out" — find a label, search nearby for values, aggressively filter out labels. This breaks when OCR merges labels with values or when field boundaries don't match the anchor's spatial proximity model.

## Solution: Cell-Based Extraction (Hybrid)

Use OpenCV to detect form cell boundaries, then extract ALL text inside each cell. This mirrors the legacy manual-region approach (which was ~100% accurate) but automates the region sizing.

### Pipeline

```
1. detectCells(imageUri)             -> DetectedCell[]
2. Full-page OCR (ML Kit)            -> TextBlock[]
3. mapCellsToFields(cells, blocks)   -> Map<fieldId, DetectedCell>
4. For each mapped cell:
     extractTextFromCell(cell, blocks) -> field value
     applyPostProcessing(value)        -> cleaned value
5. For unmapped fields:
     fall back to extractWithAnchors() anchor-based logic
6. For table fields:
     keep existing computeAdaptiveTableRegions() logic
```

### Cell-to-Field Mapping

For each detected cell, collect all OCR text blocks whose center falls inside the cell. Check concatenated text for known field labels. Match longer/more-specific labels first to avoid ambiguity.

| Priority | Label pattern | Field ID |
|----------|--------------|----------|
| 1 | "SHIPPER'S REFERENCE" or "TCN" | `shipper_reference_tcn` |
| 2 | "SHIPPER" (excluding cells matching priority 1) | `shipper` |
| 3 | "CONSIGNEE" | `consignee` |
| 4 | "AIR WAYBILL" | `air_waybill` |
| 5 | "AIRPORT OF DEPARTURE" | `airport_departure` |
| 6 | "AIRPORT OF DESTINATION" | `airport_destination` |
| 7 | "ADDITIONAL HANDLING" | `additional_handling` |
| 8 | "NAME/TITLE OF SIGNATORY" or "NAME OF SIGNATORY" | `name_title_signatory` |
| 9 | "PLACE AND DATE" | `place_date` |
| 10 | "EMERGENCY TELEPHONE" | `emergency_telephone` |
| 11 | "SIGNATURE" (standalone, not in "NAME/TITLE OF SIGNATORY") | `signature` |

### Text Extraction From Cell

For a mapped cell:
1. Collect all TextBlocks whose center (centerX, centerY) falls within the cell bounds
2. Sort by reading order (top-to-bottom, left-to-right using Y-threshold for same-line detection)
3. Concatenate with newlines between lines, spaces within lines
4. Apply existing `postProcessing` from `anchorConfig.ts` (e.g., `remove_label_prefix`, `trim`)

No `isKnownLabel` filtering — the cell boundary defines what belongs to the field.

### Fallback Strategy

- If `detectCells()` returns `success: false` (< 10 cells): skip cell-based extraction entirely, use anchor-based as-is
- If a specific field has no matching cell: use anchor-based extraction for that field only
- Table column fields (un_number, proper_shipping_name, etc.): always use existing `computeAdaptiveTableRegions()` logic
- Checkbox fields (aircraft_type, shipment_type): always use existing `extractCheckboxValue()` logic

### Edge Cases

- **Label ambiguity**: "SHIPPER" vs "SHIPPER'S REFERENCE" — match longer labels first
- **Merged OCR text**: Not a problem — we take all text in the cell regardless of merging
- **OpenCV failure**: Falls back to current anchor approach — no regression
- **Table fields**: Kept separate — cell detection gives individual column cells but the existing adaptive table logic already handles this well

## Files

### New

- `src/services/sddg/cellBasedExtraction.ts` — Core module:
  - `mapCellsToFields(cells, textBlocks)`: Identifies cells by checking OCR text inside each
  - `extractTextFromCell(cell, textBlocks)`: Collects and concatenates text in reading order
  - `extractWithCellHybrid(imageUri, onProgress?)`: Full pipeline orchestrator

### Modified

- `src/services/sddg/anchorBasedExtractor.ts` — Accept optional cell-based results, skip anchor logic for fields already extracted via cells
- `src/screens/SDDG/SDDGProcessingScreen.tsx` — Call new hybrid pipeline

### Unchanged

- `src/services/sddg/opencvCellDetection.ts` — Used as-is
- `src/services/sddg/lineUtils.ts`, `cellBuilder.ts`, `opencvTypes.ts` — Used as-is
- `src/services/sddg/anchorConfig.ts` — Reused for post-processing rules
- `src/services/sddg/valueExtraction.ts` — Reused for table/checkbox extraction
- `src/services/sddg/adaptiveRegionDetection.ts` — Reused for fallback
