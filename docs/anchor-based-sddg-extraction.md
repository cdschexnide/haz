# Anchor-Based SDDG Extraction System

This document explains how the anchor-based extraction system works for parsing Shipper's Declaration for Dangerous Goods (SDDG) forms.

## Overview

The system uses **Google ML Kit OCR** to extract text from scanned forms, then uses **anchor detection** to find field labels and **region inference** to determine where field values are located.

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Scanned Image  │ ──▶ │   ML Kit OCR    │ ──▶ │ Anchor Detection│ ──▶ │ Region Inference│
└─────────────────┘     └─────────────────┘     └─────────────────┘     └─────────────────┘
                                                                                  │
                                                                                  ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   SDDGData      │ ◀── │ Post-Processing │ ◀── │ Value Extraction│
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## Key Files

| File | Purpose |
|------|---------|
| `anchorConfig.ts` | Defines all field configurations (labels, patterns, post-processing) |
| `anchorDetection.ts` | Finds field labels in OCR text blocks |
| `regionInference.ts` | Computes value regions based on anchor positions |
| `valueExtraction.ts` | Extracts text from regions, applies post-processing |
| `anchorBasedExtractor.ts` | Main orchestrator that ties everything together |
| `anchorTypes.ts` | TypeScript type definitions |

---

## 1. Anchor Configuration (`anchorConfig.ts`)

This is the **most important file for adjustments**. Each field has a configuration object:

```typescript
{
  fieldId: "shipper",                    // Unique identifier
  labelPatterns: ["SHIPPER", "Shipper"], // Text patterns to find the label
  patternType: "label-top-left-value-fills-box", // How value relates to label
  valueRegionRules: {                    // Rules for computing value region
    boundedBy: ["phone_number", "consignee"],
    direction: "below-and-right"
  },
  postProcessing: ["remove_label_prefix", "trim"] // Value cleanup rules
}
```

### Pattern Types

| Pattern Type | Description | Use Case |
|--------------|-------------|----------|
| `label-top-left-value-fills-box` | Value is below/right of label, bounded by other anchors | Multi-line fields (shipper, consignee) |
| `label-left-value-right` | Value is to the right of label on same line | Single-line fields (phone, signature) |
| `label-top-value-bottom` | Value is directly below label | Stacked fields (airport, signatory name) |
| `table-column-header` | Table column - value below header in column area | Dangerous goods table |
| `checkbox-pair` | Detect which option is NOT X'd out | Aircraft type, shipment type |
| `inline-pattern` | Extract via regex from anywhere on page | Page info (PAGE 1 OF 1) |

### Adding a New Label Pattern

If OCR produces variations of a label, add them to `labelPatterns`:

```typescript
labelPatterns: [
  "PACKING INST",    // Standard
  "PACKING sNST",    // Common OCR error
  "PACKINGINST",     // No space
  "PACKING\nINST"    // Line break
]
```

---

## 2. Anchor Detection (`anchorDetection.ts`)

### How Matching Works

1. **Exact match** (score 0): Text equals pattern exactly
2. **Contains match** (score 1-10): Text starts with or contains pattern
3. **Fuzzy match** (score 10+): Levenshtein distance within threshold

```typescript
// The scoring function determines match quality
function calculateMatchScore(normalizedText, normalizedPattern) {
  // Exact match is best
  if (normalizedText === normalizedPattern) {
    return { score: 0, matchType: "exact" };
  }

  // startsWith check for labels with attached text
  if (normalizedText.startsWith(normalizedPattern)) {
    // Accept if pattern is >= 25% of text
    ...
  }

  // Fuzzy match for OCR errors (only for patterns >= 8 chars)
  ...
}
```

### Key Constants

```typescript
// In normalizeText - strips OCR artifacts before matching
function stripOcrArtifacts(text) {
  return text.replace(/^[\|\[\]\(\)\{\}\/\\]+\s*/, ""); // Remove leading |, [, etc.
}
```

### Common Adjustments

**Problem**: Anchor not found due to OCR error
**Solution**: Add the OCR variation to `labelPatterns` in `anchorConfig.ts`

**Problem**: Wrong anchor matched (e.g., "SHIPPER" matches "SHIPPER'S REFERENCE")
**Solution**: The scoring prefers shorter/exact matches. If still wrong, make patterns more specific.

---

## 3. Region Inference (`regionInference.ts`)

Once anchors are found, the system computes **value regions** - bounding boxes where value text should be.

### Key Constants

```typescript
const PADDING = 5;                    // Gap between anchor and value region
const DEFAULT_REGION_HEIGHT = 60;     // Default height for single values
const DEFAULT_REGION_WIDTH = 200;     // Default width for single values
const MAX_MULTI_LINE_HEIGHT = 120;    // Max height for multi-line fields
const MAX_TABLE_HEIGHT = 300;         // Max height for table data rows
const MAX_TABLE_COLUMN_WIDTH = 400;   // Max width for table columns
const COLUMN_LEFT_PADDING = 50;       // Extend table columns left of header
```

### Region Computation by Pattern Type

#### `label-top-left-value-fills-box`
```
┌─────────────────────────┐
│ SHIPPER (anchor)        │
├─────────────────────────┤
│ ┌─────────────────────┐ │
│ │ Value region        │ │  ← Below anchor, bounded by other anchors
│ │ (address lines)     │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

#### `label-left-value-right`
```
┌─────────────────────────────────────┐
│ PHONE NUMBER: │ (609) 754-2665      │
│    (anchor)   │   (value region)    │
└─────────────────────────────────────┘
```

#### `table-column-header`
```
┌──────────┬─────────────────┬───────────┐
│ UN or ID │ PROPER SHIPPING │ CLASS or  │  ← Headers (anchors)
│    NO    │      NAME       │ DIVISION  │
├──────────┼─────────────────┼───────────┤
│ UN0106   │ FUZES DETONATING│   1.1B    │  ← Value regions
│          │                 │           │     (columns below headers)
└──────────┴─────────────────┴───────────┘
```

### Common Adjustments

**Problem**: Value region too small, missing text
**Solution**: Increase `DEFAULT_REGION_HEIGHT` or `MAX_MULTI_LINE_HEIGHT`

**Problem**: Value region capturing wrong content
**Solution**: Add `boundedBy` references to other anchors that should limit the region

**Problem**: Table columns misaligned with data
**Solution**: Adjust `COLUMN_LEFT_PADDING` (columns extend this far left of header)

---

## 4. Value Extraction (`valueExtraction.ts`)

### How Text is Captured

1. Find all OCR text blocks whose **center** is within the value region
2. If no blocks found, try blocks with **any overlap** (for spanning text)
3. Sort blocks by reading order (top-to-bottom, left-to-right)
4. Concatenate with appropriate separators (space or newline)
5. Filter out known labels (SHIPPER, CONSIGNEE, etc.)

### Key Functions

```typescript
// Check if block center is in region (strict)
function isBlockCenterInRegion(block, region) { ... }

// Check if block overlaps region at all (lenient)
function isBlockInRegion(block, region) { ... }

// Extract portion of text that falls within region
function extractPortionInRegion(block, region) { ... }
```

### Known Labels Filter

```typescript
const KNOWN_LABELS = [
  "SHIPPER", "CONSIGNEE", "AIR WAYBILL", ...
];

// Blocks matching these are filtered out of extracted values
function isKnownLabel(text) { ... }
```

**To add a label to filter**: Add it to the `KNOWN_LABELS` array.

---

## 5. Post-Processing Rules (`valueExtraction.ts`)

Post-processing cleans up extracted values. Rules are defined per-field in `anchorConfig.ts`.

### Available Rules

| Rule | Description | Example |
|------|-------------|---------|
| `trim` | Remove leading/trailing whitespace | " value " → "value" |
| `remove_label_prefix` | Remove SHIPPER/CONSIGNEE/etc prefix | "SHIPPER John" → "John" |
| `remove_tcn_prefix` | Remove TCN:/SHIPPER'S REF prefix | "TCN: ABC123" → "ABC123" |
| `remove_spaces` | Remove all spaces | "AB CD" → "ABCD" |
| `uppercase` | Convert to uppercase | "abc" → "ABC" |
| `extract_un_number` | Parse UN/ID number pattern | "UNO106 FUZES" → "UN0106" |
| `extract_shipping_name` | Get text after UN number | "UNO106 FUZES" → "FUZES" |
| `validate_packing_group` | Only accept Roman numerals | "0.4348" → "" |
| `clean_quantity` | Fix partial words | "oden Box" → "Wooden Box" |

### Adding a New Post-Processing Rule

1. Add the rule in `applyPostProcessing()`:

```typescript
case "my_new_rule":
  result = result.replace(/something/, "replacement");
  break;
```

2. Add the rule to field config in `anchorConfig.ts`:

```typescript
postProcessing: ["my_new_rule", "trim"]
```

---

## 6. Debugging

### Console Logs

The system outputs detailed logs:

```
🔍 Running full-page OCR...
📝 OCR Lines: "SHIPPER" at (365, 382)    ← All detected text with positions
✅ OCR complete: 80 text blocks found

🎯 Finding anchors...
🎯 Anchor "shipper" found [exact]: "SHIPPER" at (365, 382)
❌ Anchor "consignee" NOT found (patterns: CONSIGNEE, Consignee...)

📊 Table: headerBottom=1122, tableBottom=1422, height=295
📊 Column un_number: x=360, width=168     ← Column boundaries

📐 Region for shipper: (365, 398) 400x107  ← Computed region
📦 shipper: "BLDG 1757 VANDENBERG AVE..."  ← Extracted value
```

### Common Issues and Solutions

| Symptom | Likely Cause | Solution |
|---------|--------------|----------|
| Anchor NOT found | OCR text doesn't match patterns | Add OCR variation to `labelPatterns` |
| Anchor found wrong text | Multiple texts match, wrong one scored higher | Make pattern more specific |
| Value empty | Region doesn't contain any text blocks | Check region position in logs, adjust constants |
| Value has wrong content | Region too large or positioned wrong | Add `boundedBy` anchors, adjust padding constants |
| Value truncated | `extractPortionInRegion` cut too much | Adjust overlap thresholds in that function |
| Table columns misaligned | Header x != data x | Increase `COLUMN_LEFT_PADDING` |

### Testing a Change

1. Make your change to the relevant file
2. Rebuild the app
3. Scan a form
4. Check console logs for the specific field
5. Verify the extracted value

---

## 7. Quick Reference: Making Common Adjustments

### "OCR produces 'PACKING sNST' but anchor not found"
→ Add `"PACKING sNST"` to `labelPatterns` in `anchorConfig.ts`

### "UN number includes shipping name"
→ Uses `extract_un_number` post-processing (already configured)

### "Packing group shows quantity data"
→ Uses `validate_packing_group` post-processing (already configured)

### "Value region too small"
→ In `regionInference.ts`, increase:
- `DEFAULT_REGION_HEIGHT` (for label-top-value-bottom)
- `MAX_MULTI_LINE_HEIGHT` (for label-top-left-value-fills-box)
- `VALUE_REGION_HEIGHT` in `computeLabelLeftValueRightRegion` (for label-left-value-right)

### "Table column missing data on the left"
→ In `regionInference.ts`, increase `COLUMN_LEFT_PADDING`

### "Certain text appearing in extracted values shouldn't"
→ Add to `KNOWN_LABELS` array in `valueExtraction.ts`

### "Need new post-processing logic"
→ Add case in `applyPostProcessing()` in `valueExtraction.ts`, then reference in field's `postProcessing` array in `anchorConfig.ts`

---

## File Locations

```
src/services/sddg/
├── anchorTypes.ts          # Type definitions
├── anchorConfig.ts         # Field configurations ← MOST COMMON EDITS
├── anchorDetection.ts      # Label finding logic
├── regionInference.ts      # Region computation ← ADJUST CONSTANTS HERE
├── valueExtraction.ts      # Value extraction & post-processing
└── anchorBasedExtractor.ts # Main orchestrator
```
