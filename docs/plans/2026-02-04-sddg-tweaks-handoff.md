# SDDG Form Extraction — Handoff for Continued Work

**Date:** 2026-02-04
**Branch:** `inspector-persona-testing`
**Base branch for PRs:** `temp-transfer`

---

## What's Done

The **NATURE AND QUANTITY OF DANGEROUS GOODS** table is fully working for both form variants:

1. **AMC-IMT 1033 (tabular grid)** — 7-column table with OpenCV cell detection + ML Kit OCR
2. **Labelmaster F07LB (inline format)** — Comma/slash-delimited text like `UN1072,OXYGEN, COMPRESSED,2.2,(5.1)//1 STEEL CYLINDER (DOT-3AA) X 2.72 KG//A6.5.//OVERPACK USED`

### Inline variant features implemented:
- **Auto-detection** via 3-signal scoring (fewer table headers, descriptive paragraph, `//` delimiters) — requires 2 of 3
- **Parser** handles: UN/ID/NA prefixes, commas within proper shipping names, class/division with subsidiary risk (glued `3(8)` or comma-separated `2.2,(5.1)`), packing group, `//` section splitting, A-prefixed packing instructions, OVERPACK appending to quantity
- **OCR robustness**: whitespace normalization around parentheses, space-stripping in packing instruction detection (e.g., `A6 .5.` → `A6.5`), O→0 in UN numbers
- **Subsidiary risk** stored separately in SDDGData, split from table-based `class_division` in `convertToSDDGData`, displayed combined as `"2.2 (5.1)"` in the form

---

## Uncommitted Changes

All changes are in the working tree (unstaged). There are **two independent groups** of changes mixed together:

### Group 1: Inline variant + parser bugfixes (SDDG extraction)
New files:
- `src/services/sddg/inlineDangerousGoodsParser.ts` — Parser, variant detector, text extractor (3 exported functions)
- `src/services/sddg/__tests__/inlineDangerousGoodsParser.test.ts` — 25 tests (all passing)

Modified files:
- `src/services/sddg/anchorBasedExtractor.ts` — Inline/tabular branching, cell-override guard, subsidiary risk split in `convertToSDDGData`
- `src/types/sddg-template.ts` — Added `subsidiary_risk?: string` to `SDDGData` and `DangerousGood`
- `src/screens/SDDG/SDDGProcessingScreen.tsx` — `mapToHazproFormat`: wires `subsidiary_risk` through; strips packing instruction whitespace
- `src/components/Inspector/InteractiveSDDGForm.tsx` — Displays hazardClass + subsidiaryRisk combined in Class/Division cell

### Group 2: Test fixture fixes (pre-existing failures, separate effort)
See `docs/plans/2026-02-03-test-fix-handoff.md` for full details. Modified files include test fixtures, labeling logic, and scenario data. Category A is mostly done (2 issues remain), Category C is not started.

### Group 3: Other uncommitted changes (unrelated)
- `src/ml/hooks/useDetection.ts`, `src/ml/types/ocr.ts`, `src/screens/inspector/MLDetectionScreen.tsx` — ML detection screen changes
- `src/__tests__/integration/helpers/materialToMlResults.ts` — Integration test helper
- `src/components/Inspector/utils/sddgValidation.ts` and related class test files — SDDG validation logic
- `src/utils/hazardLabelClassification.ts` + test — Hazard label classification (new, untracked)

---

## Architecture: How SDDG Extraction Works

### Data Flow
```
Camera/Scanner Image
    ↓
SDDGProcessingScreen.tsx
    ↓
extractWithAnchors(imageUri) → anchorBasedExtractor.ts
    ├─ ML Kit OCR → TextBlock[]
    ├─ Cell-based extraction (OpenCV cells + OCR text)
    ├─ Anchor detection (find field labels)
    ├─ Variant detection → inline or tabular?
    │   ├─ Inline: inlineDangerousGoodsParser.ts → parse fields
    │   └─ Tabular: region inference → extract from grid cells
    └─ Per-field extraction for non-table fields
    ↓
convertToSDDGData(results) → SDDGData
    ↓
mapToHazproFormat(sddgData) → ExtractedSDDGContent (22 keys)
    ↓
InspectionFormProvider → InteractiveSDDGForm (renders 22-field layout)
```

### Key Files

| File | Purpose |
|------|---------|
| `src/services/sddg/anchorBasedExtractor.ts` | Main extraction orchestrator. `extractWithAnchors()` runs OCR, finds anchors, branches inline/tabular, extracts all fields. `convertToSDDGData()` maps results to SDDGData. |
| `src/services/sddg/anchorConfig.ts` | `SDDG_ANCHORS` array — defines all field configs (label patterns, pattern types, value region rules, post-processing). `getTableColumnAnchors()` returns subset with `patternType: "table-column-header"`. |
| `src/services/sddg/anchorDetection.ts` | `findAnchors()` matches OCR text blocks to anchor configs using text matching + Levenshtein distance. |
| `src/services/sddg/inlineDangerousGoodsParser.ts` | Inline variant: `detectInlineVariant()`, `extractInlineDangerousGoods()`, `parseInlineDangerousGoods()`. |
| `src/services/sddg/regionInference.ts` | Computes value regions relative to anchors (hardcoded geometry). |
| `src/services/sddg/adaptiveRegionDetection.ts` | Computes value regions by finding nearby text blocks (adaptive, no hardcoded positions). |
| `src/services/sddg/valueExtraction.ts` | Extracts text from regions, applies post-processing, handles inline patterns and checkboxes. |
| `src/services/sddg/cellBasedExtraction.ts` | OpenCV cell detection + OCR text mapping for tabular forms. |
| `src/services/sddg/validators.ts` | Validates extracted SDDGData (shipper, consignee, AWB, DG table, signature). |
| `src/types/sddg-template.ts` | `SDDGData` interface — the canonical extracted data shape. |
| `src/screens/SDDG/SDDGProcessingScreen.tsx` | `mapToHazproFormat()` transforms SDDGData → ExtractedSDDGContent (22 keys used by inspector). Notable: inverts checkbox logic (X = delete option), uppercases PSN, strips packing inst whitespace. |
| `src/components/Inspector/InteractiveSDDGForm.tsx` | Renders 22-field SDDG form with tappable zones. Parses shipper/consignee blocks, handles aircraft type X-overlays, renders DG table. |

### SDDGData Fields (src/types/sddg-template.ts)
```
shipper, consignee, inspector, awb_number, page_info, tcn, shipper_reference,
airport_departure, airport_destination, cargo_aircraft_only, passenger_and_cargo,
non_radioactive, radioactive, un_number, proper_shipping_name, class_division,
subsidiary_risk, packing_group, quantity_packing, packing_inst, authorization,
additional_handling, emergency_phone, name_title, place_date, signature,
signature_date, confidence, extraction_method, extraction_timestamp
```

### ExtractedSDDGContent Keys (22 keys, mapped in mapToHazproFormat)
```
shipper, consignee, airWaybillNumber, pagination, shippersReferenceNumber,
inspectionActivity, aircraftType, airportOfDeparture, airportOfDestination,
shipmentType, unIdNo, properShippingName, hazardClass, subsidiaryRisk,
packingGroup, quantityAndPacking, packingInstruction, authorization,
additionalHandlingInfo, nameOfSignatory, placeAndDate, signature
```

### Pattern Types in anchorConfig.ts
- `label-top-left-value-fills-box` — Label at top-left, value fills the box below/right (shipper, consignee)
- `label-left-value-right` — Label on left, value on right (AWB, phone)
- `inline-pattern` — Regex matched directly against OCR text (page info)
- `checkbox-pair` — Two options, X marks deletion (aircraft type, shipment type)
- `table-column-header` — Column header in DG table (un_number, PSN, class, etc.)
- `label-above-value-below` — Label above, value in box below (additional handling, signature)

---

## Important Implementation Details

### Checkbox inversion logic
On SDDG forms, an X **deletes** the option (opposite of typical checkboxes). So if `cargo_aircraft_only` has an X, the actual selection is "Passenger and Cargo Aircraft". This inversion happens in `mapToHazproFormat()`.

### Subsidiary risk flow
- **Inline forms**: Parser extracts `subsidiary_risk` as separate field (e.g., `"(5.1)"`)
- **Tabular forms**: Column "Class or Division (SUBSIDIARY RISK)" puts everything into `class_division` (e.g., `"2.2 (5.1)"`)
- **`convertToSDDGData()`**: If `subsidiary_risk` already exists (inline path), uses it directly. Otherwise, splits trailing parenthesized value from `class_division` using regex `/\s*(\(\d(?:\.\d)?\))\s*$/`
- **Display**: `InteractiveSDDGForm` combines them: `[hazmat.hazardClass, hazmat.subsidiaryRisk].filter(Boolean).join(" ")`

### Cell-based vs anchor-based extraction priority
In `anchorBasedExtractor.ts`, the extraction loop checks in this order:
1. `results.has(fieldId)` — already extracted (e.g., by inline parser) → skip
2. `cellResults.has(fieldId)` — cell-based extraction got it → use that
3. Anchor-based extraction — find anchor, compute region, extract value

The inline parser results are checked **before** cell results to prevent cell-based garbage from overwriting correctly parsed inline fields.

### Packing instruction detection
All valid AFMAN packing instructions are A-prefixed (A1.1 through A13.20). The regex `/^A\d+\.\d+$/` matches after stripping trailing dots and collapsing internal whitespace. The OCR-robustness fix strips all spaces before testing: `cleaned.replace(/\s+/g, "")`.

### Pre-existing test failures
3 test files in `src/services/sddg/__tests__/` have pre-existing failures unrelated to inline variant work:
- `regionInference.test.ts`
- `anchorDetection.test.ts`
- `anchorBasedExtractor.test.ts`

These existed before any inline variant changes and are confirmed on the base commit.

---

## Non-DG-Table Fields That May Need Tweaking

The rest of the SDDG form has fields extracted via anchor-based or cell-based methods. Each field is defined in `anchorConfig.ts` with its own pattern type and value region rules. Common issues to watch for:

- **Shipper / Consignee**: Multi-line blocks parsed into name/street/city/phone/DSN in `InteractiveSDDGForm.tsx`
- **Airport codes**: Single-value fields, sometimes garbled by OCR
- **Aircraft type / Shipment type**: Checkbox pairs with deletion semantics
- **Additional handling**: Multi-line block with emergency phone numbers (DSN + collect format)
- **Signature / Name/Title / Place and Date**: Bottom-of-form fields, often affected by OCR quality on handwriting
- **Place and Date**: Has a position-based fallback in `anchorBasedExtractor.ts` (inferred from `name_title_signatory` position when anchor not found)

---

## Design Documents

- `docs/plans/2026-02-04-inline-dangerous-goods-variant-design.md` — Original inline variant design
- `docs/plans/2026-02-04-inline-dangerous-goods-impl.md` — Implementation plan (4 tasks)
- `docs/plans/2026-02-04-inline-parser-bugfix-design.md` — Bugfix design (subsidiary risk, OVERPACK, multi-section)
- `docs/plans/2026-02-04-inline-parser-bugfix-impl.md` — Bugfix implementation plan
- `docs/plans/2026-02-03-test-fix-handoff.md` — Pre-existing test failure handoff (Categories A/B/C)
