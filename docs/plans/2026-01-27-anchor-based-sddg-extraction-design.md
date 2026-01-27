# Anchor-Based SDDG Extraction Design

**Created:** 2026-01-27
**Status:** Ready for Implementation
**Problem:** Manual region adjustment for SDDG forms takes 3-4 minutes per form - unacceptable UX
**Solution:** Anchor-based dynamic region detection that finds field labels and infers value positions automatically

---

## Problem Statement

The current SDDG extraction workflow requires inspectors to manually drag and resize 23 regions to align with the photographed form. This is necessary because:

1. Forms are photographed in field conditions (clipboards, tables, packages)
2. Camera angle, distance, and orientation vary significantly between photos
3. Multiple form versions exist (AMC IMT 1033, DAF FORM 7507, IATA/commercial forms)
4. Fixed template coordinates don't align with the actual form regions in photos

The manual adjustment works but takes 3-4 minutes per form, making it the worst part of the inspector workflow.

---

## Solution: Anchor-Based Dynamic Region Detection

Instead of fixed coordinates, we find the field **labels** (anchors) in the OCR results and use their positions to dynamically compute where the values are. The form "tells us" where its fields are.

**Key Insight:** Field labels are semantically consistent across all form versions:
- "SHIPPER" / "Shipper"
- "CONSIGNEE" / "Consignee"
- "UN or ID NO." / "UN or ID No."
- etc.

---

## High-Level Algorithm

### Phase 1: Full-Page OCR
Run Google ML Kit OCR on the entire SDDG image. Returns all text blocks with bounding boxes (x, y, width, height) and text content. No region cropping - we need the full picture first.

### Phase 2: Anchor Detection
Search OCR results for known field labels. Each anchor has variations to match (e.g., `["SHIPPER", "Shipper", "Shipper:"]`). When we find "SHIPPER" at position (50, 100), we know where the Shipper field starts.

### Phase 3: Value Region Inference
For each detected anchor, compute the value region based on its pattern type:
- **Label-top-left**: Value below and right of label, bounded by next anchor
- **Label-left-value-right**: Value to the right on same horizontal line
- **Table-header**: Value directly below header within column width

### Phase 4: Value Extraction
Collect all OCR text blocks within each computed value region. Aggregate multi-line text in reading order (top-to-bottom, left-to-right). Apply post-processing.

---

## Pipeline Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        ANCHOR-BASED EXTRACTION PIPELINE                      │
└─────────────────────────────────────────────────────────────────────────────┘

  ┌──────────────┐
  │ Camera/      │
  │ Gallery      │
  │ Image        │
  └──────┬───────┘
         │
         ▼
  ┌──────────────────────────────────────────────────────────────────────────┐
  │  STEP 1: FULL-PAGE OCR (Google ML Kit)                                    │
  │                                                                           │
  │  Input:  Raw image URI                                                    │
  │  Output: Array of TextBlock { text, boundingBox: {x, y, w, h} }          │
  │                                                                           │
  │  Note: Run on full image, no cropping. ~1-2 seconds on device.           │
  └──────────────────────────────────────────────────────────────────────────┘
         │
         ▼
  ┌──────────────────────────────────────────────────────────────────────────┐
  │  STEP 2: ANCHOR DETECTION                                                 │
  │                                                                           │
  │  For each AnchorConfig:                                                   │
  │    - Search OCR blocks for labelPatterns match (case-insensitive)        │
  │    - Record anchor position: { fieldId, boundingBox, confidence }        │
  │                                                                           │
  │  Output: Map<fieldId, AnchorMatch>                                        │
  │                                                                           │
  │  Handle missing anchors: log warning, mark field as "not found"          │
  └──────────────────────────────────────────────────────────────────────────┘
         │
         ▼
  ┌──────────────────────────────────────────────────────────────────────────┐
  │  STEP 3: VALUE REGION COMPUTATION                                         │
  │                                                                           │
  │  For each detected anchor:                                                │
  │    - Apply pattern-specific rules to compute value region bounds         │
  │    - Use positions of OTHER anchors as boundaries                        │
  │                                                                           │
  │  Output: Map<fieldId, ValueRegion { x, y, w, h }>                        │
  └──────────────────────────────────────────────────────────────────────────┘
         │
         ▼
  ┌──────────────────────────────────────────────────────────────────────────┐
  │  STEP 4: VALUE EXTRACTION                                                 │
  │                                                                           │
  │  For each value region:                                                   │
  │    - Find all OCR blocks whose center falls within the region            │
  │    - Sort by reading order (top-to-bottom, left-to-right)                │
  │    - Concatenate text (with spaces/newlines as appropriate)              │
  │    - Apply post-processing (remove label prefix, clean whitespace)       │
  │                                                                           │
  │  Output: Map<fieldId, extractedValue: string>                            │
  └──────────────────────────────────────────────────────────────────────────┘
         │
         ▼
  ┌──────────────────────────────────────────────────────────────────────────┐
  │  STEP 5: MAP TO SDDGData STRUCTURE                                        │
  │                                                                           │
  │  Convert extracted values to existing SDDGData format                     │
  │  (same structure InteractiveSDDGComplianceScreen expects)                │
  └──────────────────────────────────────────────────────────────────────────┘
```

---

## Anchor Configuration Structure

```typescript
interface AnchorConfig {
  fieldId: string;                    // e.g., "shipper", "un_number"
  labelPatterns: string[];            // Text variations to match
  patternType: AnchorPatternType;     // How value relates to label
  valueRegionRules: ValueRegionRules; // How to compute value bounds
  postProcessing?: string[];          // Cleanup rules
}

type AnchorPatternType =
  | "label-top-left-value-fills-box"  // SHIPPER, CONSIGNEE, ADDITIONAL HANDLING
  | "label-left-value-right"          // AIR WAYBILL NO, TCN, SIGNATURE
  | "label-top-value-bottom"          // AIRPORT OF DEPARTURE, NAME/TITLE
  | "table-column-header"             // UN, PSN, CLASS, PACKING GROUP, etc.
  | "checkbox-pair"                   // AIRCRAFT TYPE, SHIPMENT TYPE
  | "inline-pattern";                 // PAGE x of y PAGES
```

---

## Value Region Inference Rules

### Pattern: `label-top-left-value-fills-box`
Used for: SHIPPER, CONSIGNEE, ADDITIONAL HANDLING

```
┌─────────────────────────────────┐
│ SHIPPER ←── anchor found here   │
│   FY4484                        │
│   BLDG 1757 VANDENBERG AVE      │  ← value region: everything below
│   MCGUIRE AFB NJ 08641          │    and right of anchor, until we
│                                 │    hit the next anchor below/right
└─────────────────────────────────┘
```

Logic:
1. Find anchor bounding box (label position)
2. Value region starts at: `x = anchor.x`, `y = anchor.y + anchor.height`
3. Value region ends at: nearest anchor below OR nearest anchor to the right
4. Collect all OCR blocks within this rectangle

### Pattern: `label-left-value-right`
Used for: AIR WAYBILL NO, TCN, SIGNATURE

```
┌──────────────────────────────────────────┐
│ AIR WAYBILL NO.  │  MR # 22227854        │
│ ←── anchor       │  ←── value region     │
└──────────────────────────────────────────┘
```

Logic:
1. Find anchor bounding box
2. Value region starts at: `x = anchor.x + anchor.width + padding`
3. Value region has same `y` and `height` as anchor (same horizontal band)
4. Value region extends to form edge OR next anchor to the right

### Pattern: `label-top-value-bottom`
Used for: AIRPORT OF DEPARTURE, NAME/TITLE, PLACE AND DATE

```
┌─────────────────────────┐
│ AIRPORT OF DEPARTURE    │ ←── anchor
├─────────────────────────┤
│ WRI                     │ ←── value region (directly below)
└─────────────────────────┘
```

Logic:
1. Find anchor bounding box
2. Value region starts at: `x = anchor.x`, `y = anchor.y + anchor.height`
3. Value region has same `width` as anchor (same column)
4. Value region extends down until next horizontal anchor

### Pattern: `table-column-header`
Used for: UN, PSN, CLASS, PACKING GROUP, QTY, PACKING INST, AUTHORIZATION

```
┌─────────┬──────────────────┬───────────┬─────────┬───────────┬────────────┬─────────────┐
│ UN or   │ PROPER SHIPPING  │ CLASS or  │ PACKING │ QUANTITY  │ PACKING    │AUTHORIZATION│
│ ID NO.  │ NAME             │ DIVISION  │ GROUP   │ AND TYPE  │ INST       │             │
├─────────┼──────────────────┼───────────┼─────────┼───────────┼────────────┼─────────────┤
│ UN3091  │ LITHIUM METAL    │     9     │         │ 1 Wooden  │   A13.8    │             │
│         │ BATTERIES        │           │         │ Box x     │            │             │
└─────────┴──────────────────┴───────────┴─────────┴───────────┴────────────┴─────────────┘
```

Logic:
1. Find all table column header anchors
2. Sort left-to-right by x-position to establish column order
3. For each column:
   - `x`: from this header's left edge
   - `width`: to next header's left edge (or table right edge for last column)
   - `y`: below the header row
   - `height`: down to ADDITIONAL HANDLING anchor
4. Aggregate multi-line text in top-to-bottom order

### Pattern: `checkbox-pair`
Used for: AIRCRAFT TYPE, SHIPMENT TYPE

```
┌─────────────────┬────────────────┐
│ PASSENGER AND   │  XXXXXXXXXX    │  ← X'd out = NOT selected
│ CARGO AIRCRAFT  │  XXXXXXXXXXX   │
├─────────────────┼────────────────┤
│ CARGO AIRCRAFT  │                │  ← empty/clear = SELECTED
│ ONLY            │    (blank)     │
└─────────────────┴────────────────┘
```

Logic:
1. Find both option labels
2. For each option, look for X patterns in adjacent region
3. Option WITHOUT X marks is the selected value

---

## Complete Anchor Configuration

```typescript
const SDDG_ANCHORS: AnchorConfig[] = [
  // === HEADER SECTION ===
  {
    fieldId: "shipper",
    labelPatterns: ["SHIPPER", "Shipper"],
    patternType: "label-top-left-value-fills-box",
    valueRegionRules: { boundedBy: ["phone_number", "consignee", "air_waybill"] },
    postProcessing: ["remove_label_prefix", "trim"]
  },
  {
    fieldId: "phone_number",
    labelPatterns: ["PHONE NUMBER", "Phone Number", "PHONE NO"],
    patternType: "label-left-value-right",
    valueRegionRules: { direction: "right", includeDSN: true }
  },
  {
    fieldId: "consignee",
    labelPatterns: ["CONSIGNEE", "Consignee"],
    patternType: "label-top-left-value-fills-box",
    valueRegionRules: { boundedBy: ["transportation_details", "inspector"] },
    postProcessing: ["remove_label_prefix", "trim"]
  },
  {
    fieldId: "air_waybill",
    labelPatterns: ["AIR WAYBILL NO", "Air Waybill No"],
    patternType: "label-left-value-right",
    valueRegionRules: { direction: "right" }
  },
  {
    fieldId: "page_info",
    labelPatterns: ["PAGE"],
    patternType: "inline-pattern",
    valueRegionRules: { regex: "PAGE\\s+(\\d+)\\s+OF\\s+(\\d+)\\s+PAGES?" }
  },
  {
    fieldId: "shipper_reference_tcn",
    labelPatterns: ["SHIPPER'S REFERENCE", "Shipper's Reference", "TCN"],
    patternType: "label-left-value-right",
    valueRegionRules: { direction: "right" },
    postProcessing: ["remove_tcn_prefix", "remove_spaces"]
  },

  // === TRANSPORTATION SECTION ===
  {
    fieldId: "airport_departure",
    labelPatterns: ["AIRPORT OF DEPARTURE", "Airport of Departure"],
    patternType: "label-top-value-bottom",
    valueRegionRules: { direction: "below" }
  },
  {
    fieldId: "airport_destination",
    labelPatterns: ["AIRPORT OF DESTINATION", "Airport of Destination"],
    patternType: "label-top-value-bottom",
    valueRegionRules: { direction: "below", fallback: "right" }
  },
  {
    fieldId: "aircraft_type",
    labelPatterns: ["PASSENGER AND CARGO AIRCRAFT", "CARGO AIRCRAFT ONLY"],
    patternType: "checkbox-pair",
    valueRegionRules: {
      options: [
        { label: "PASSENGER AND CARGO AIRCRAFT", value: "passenger_and_cargo" },
        { label: "CARGO AIRCRAFT ONLY", value: "cargo_only" }
      ]
    }
  },
  {
    fieldId: "shipment_type",
    labelPatterns: ["NON-RADIOACTIVE", "RADIOACTIVE"],
    patternType: "checkbox-pair",
    valueRegionRules: {
      options: [
        { label: "NON-RADIOACTIVE", value: "non_radioactive" },
        { label: "RADIOACTIVE", value: "radioactive" }
      ]
    }
  },

  // === DANGEROUS GOODS TABLE ===
  {
    fieldId: "un_number",
    labelPatterns: ["UN or ID NO", "UN or ID No", "UN NO", "UN or\nID NO"],
    patternType: "table-column-header",
    valueRegionRules: { columnIndex: 0, rowBoundedBy: ["additional_handling"] }
  },
  {
    fieldId: "proper_shipping_name",
    labelPatterns: ["PROPER SHIPPING NAME", "Proper Shipping Name"],
    patternType: "table-column-header",
    valueRegionRules: { columnIndex: 1, rowBoundedBy: ["additional_handling"] }
  },
  {
    fieldId: "class_division",
    labelPatterns: ["CLASS or DIVISION", "Class or Division", "CLASS OR DIVISION"],
    patternType: "table-column-header",
    valueRegionRules: { columnIndex: 2, rowBoundedBy: ["additional_handling"] }
  },
  {
    fieldId: "packing_group",
    labelPatterns: ["PACKING GROUP", "Packing Group", "PACK-\nING\nGROUP"],
    patternType: "table-column-header",
    valueRegionRules: { columnIndex: 3, rowBoundedBy: ["additional_handling"] }
  },
  {
    fieldId: "quantity_type_packing",
    labelPatterns: ["QUANTITY AND TYPE", "Quantity and Type", "QUANTITY AND\nTYPE"],
    patternType: "table-column-header",
    valueRegionRules: { columnIndex: 4, rowBoundedBy: ["additional_handling"] }
  },
  {
    fieldId: "packing_inst",
    labelPatterns: ["PACKING INST", "Packing Inst", "PACKING\nINST"],
    patternType: "table-column-header",
    valueRegionRules: { columnIndex: 5, rowBoundedBy: ["additional_handling"] }
  },
  {
    fieldId: "authorization",
    labelPatterns: ["AUTHORIZATION", "Authorization"],
    patternType: "table-column-header",
    valueRegionRules: { columnIndex: 6, rowBoundedBy: ["additional_handling"] }
  },

  // === FOOTER SECTION ===
  {
    fieldId: "additional_handling",
    labelPatterns: ["ADDITIONAL HANDLING INFORMATION", "Additional Handling Information"],
    patternType: "label-top-left-value-fills-box",
    valueRegionRules: { boundedBy: ["emergency_telephone", "signature_block"] },
    postProcessing: ["remove_label_prefix"]
  },
  {
    fieldId: "emergency_telephone",
    labelPatterns: ["EMERGENCY TELEPHONE", "Emergency Telephone", "EMERGENCY CONTACT"],
    patternType: "label-left-value-right",
    valueRegionRules: { direction: "right" }
  },
  {
    fieldId: "name_title_signatory",
    labelPatterns: ["NAME/TITLE OF SIGNATORY", "Name/Title of Signatory", "NAME OF SIGNATORY"],
    patternType: "label-top-value-bottom",
    valueRegionRules: { direction: "below" }
  },
  {
    fieldId: "place_date",
    labelPatterns: ["PLACE AND DATE", "Place and Date"],
    patternType: "label-top-value-bottom",
    valueRegionRules: { direction: "below" }
  },
  {
    fieldId: "signature",
    labelPatterns: ["SIGNATURE", "Signature"],
    patternType: "label-left-value-right",
    valueRegionRules: { direction: "right" }
  }
];
```

---

## Integration with Existing Workflow

### Current Flow (painful):
```
SDDGUploadAndParse → SDDGRegionAdjustmentScreen → SDDGProcessingScreen
                         ↑
                    3-4 minutes of
                    manual region dragging
```

### New Flow (automatic):
```
SDDGUploadAndParse → SDDGProcessingScreen (with anchor-based extraction)
                         ↑
                    ~2-3 seconds
                    fully automatic
```

### Dev Settings Toggle

```typescript
interface DevSettings {
  sddgExtractionMethod: "anchor-based" | "manual-regions";
  showExtractionDebugOverlay: boolean;
}
```

SDDGRegionAdjustmentScreen remains available as a fallback via dev settings until anchor-based extraction is proven reliable.

### Files Unchanged
- InteractiveSDDGComplianceScreen
- SDDGFrustrationSummary
- SDDGInspectionCompleteScreen
- InspectionFormProvider
- All downstream inspector workflow

---

## Error Handling

### Anchor Not Found
- Log warning: "Anchor 'CONSIGNEE' not found in OCR results"
- Mark field as `{ value: null, status: "anchor_not_found" }`
- Continue extracting other fields (don't fail entire extraction)

### Multiple Matches for Same Anchor
- Take the one with highest confidence score
- Or position most consistent with expected form layout

### OCR Misreads Label
- Use fuzzy matching with Levenshtein distance threshold
- Include common OCR errors in labelPatterns

### Value Region Overlaps
- Use anchor positions as hard boundaries
- Assign OCR block to region whose anchor is closest

---

## Implementation Plan

### New Files to Create

| File | Purpose |
|------|---------|
| `src/services/sddg/anchorBasedExtractor.ts` | Main extraction logic (4 phases) |
| `src/services/sddg/anchorConfig.ts` | SDDG_ANCHORS configuration |
| `src/services/sddg/anchorDetection.ts` | Find anchors in OCR results |
| `src/services/sddg/regionInference.ts` | Compute value regions from anchors |
| `src/services/sddg/valueExtraction.ts` | Extract text from regions |
| `src/config/devSettings.ts` | Dev toggle for extraction method |

### Files to Modify

| File | Changes |
|------|---------|
| `src/screens/SDDG/SDDGProcessingScreen.tsx` | Call new extractor based on dev setting |
| `src/components/SDDGUploadAndParse.tsx` | Route based on dev setting |
| Dev settings screen | Add extraction method toggle |

### Testing Strategy

1. Use the 11 forms from `docs/hazdecs all.pdf` as test cases
2. For each form, verify all fields extract correctly
3. Compare extraction accuracy vs. manual region adjustment
4. Edge cases: rotated photos, partial visibility, poor lighting

---

## Constraints

- **Fully offline**: No network calls, all processing on-device
- **Google ML Kit OCR**: Existing OCR infrastructure
- **React Native**: Mobile app environment
- **Multiple form versions**: AMC IMT 1033, DAF FORM 7507, IATA/commercial forms

---

## Success Criteria

1. Extraction takes < 5 seconds (vs 3-4 minutes currently)
2. Accuracy >= 95% on the 11 test forms
3. No manual region adjustment required for typical photos
4. Graceful degradation when anchors aren't found (fallback available)
