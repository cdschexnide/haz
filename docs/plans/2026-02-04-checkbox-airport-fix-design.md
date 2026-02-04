# SDDG Checkbox & Airport Extraction Fix — Design

**Date:** 2026-02-04
**Branch:** `inspector-persona-testing`

---

## Problem Summary

Four symptoms, three root causes:

| Symptom | Root Cause |
|---------|-----------|
| Aircraft type: shows "Cargo Aircraft Only" instead of "Passenger and Cargo Aircraft" | Bug 1 (X detection) + Bug 2 (inversion) |
| Shipment type: shows "Radioactive" instead of "Non-Radioactive" | Bug 1 (X detection) + Bug 2 (inversion) |
| Airport of Destination: empty instead of "SUU" | Bug 3 (anchor not found + inline value) |

---

## Bug 1: Checkbox X-mark detection fails on garbled OCR

### Current behavior

`extractCheckboxValue()` in `valueExtraction.ts` looks for standalone text blocks matching `/^X{3,}$/` or `/X{4,}/`. When OCR garbles X marks into the option label text (e.g., `"CARC0X"`, `"RAOUDBCOOKX"`), no X blocks are found and the function defaults to `options[0]`.

### Fix: Two-column readability comparison fallback

Add a fallback in `extractCheckboxValue()` when `xBlocks.length === 0`:

**Step 1 — Find the checkbox band.**
Identify all text blocks in the Y-range of the checkbox area. Bootstrap from blocks that partially match any option keyword (PASSENGER, CARGO, RADIOACTIVE, NON-RADIOACTIVE, etc.). Use a generous Y tolerance (~50px above/below the matched blocks).

**Step 2 — Split into left/right groups.**
Sort candidate blocks by X-coordinate. Find the largest horizontal gap between adjacent blocks to split into two groups. If no clear gap, use median X as the split point.

**Step 3 — Score each group's readability.**
For each group, concatenate the text and compute two scores:
- **Label match score**: Best fuzzy match distance (Levenshtein) between the concatenated group text and each option label. Lower = better match.
- **X contamination score**: Count of `X` characters as a proportion of total alphabetic characters. Higher = more likely X'd out.

Combine into a single "garble score" — groups with worse label matches and higher X contamination are the X'd/deleted option.

**Step 4 — Return the selected option.**
The group with the better readability (lower garble score) maps to the matching option label. Return that option's value as the selected (non-X'd) option.

### Files modified

- `src/services/sddg/valueExtraction.ts` — Add fallback logic in `extractCheckboxValue()`

---

## Bug 2: `mapToHazproFormat` double-inversion

### Current behavior

`extractCheckboxValue()` returns the **selected** (non-X'd) option value. `convertToSDDGData()` stores this directly as booleans:
- `cargo_aircraft_only: get("aircraft_type") === "cargo_only"` → true when cargo IS the selected type
- `non_radioactive: get("shipment_type") === "non_radioactive"` → true when non-radioactive IS selected

But `mapToHazproFormat()` then **inverts** these, treating the booleans as "this checkbox has X marks":
```typescript
// Current (wrong):
aircraftType: sddgData.cargo_aircraft_only
  ? "Passenger and Cargo Aircraft"  // inverts!
  : "Cargo Aircraft Only",

shipmentType: sddgData.radioactive
  ? "Non-Radioactive"               // inverts!
  : sddgData.non_radioactive
  ? "Radioactive"                    // inverts!
  : "",
```

### Fix: Remove the inversion

```typescript
// Fixed (direct mapping):
aircraftType: sddgData.cargo_aircraft_only
  ? "Cargo Aircraft Only"
  : "Passenger and Cargo Aircraft",

shipmentType: sddgData.non_radioactive
  ? "Non-Radioactive"
  : sddgData.radioactive
  ? "Radioactive"
  : "",
```

### Files modified

- `src/screens/SDDG/SDDGProcessingScreen.tsx` — Fix `mapToHazproFormat()` lines 37-56

---

## Bug 3: Airport of Destination not extracted

### Current behavior

OCR produces `"Alirport of Destination (optional): SUU"` — a single block with the label (with OCR typo "Alirport") and the value "SUU" concatenated. The anchor detector fails because:
1. "ALIRPORT" doesn't match "AIRPORT" (fuzzy match on the full 40-char string vs 22-char pattern has too-high Levenshtein distance)
2. Even if the anchor were found, the `"below"` extraction direction wouldn't find "SUU" since it's in the same block after a colon

### Fix: Regex-based inline extraction fallback

In `anchorBasedExtractor.ts`, after the main extraction loop, add a targeted fallback for `airport_destination` when it has an empty value:

1. Scan all text blocks for a match against `/A[LI]R?PORT\s+OF\s+DEST/i`
2. If found, extract the 3-letter airport code using `/:\s*([A-Z]{3})\b/`
3. Set the result

This is similar to how `airport_departure` already works when the OCR splits the label and value into separate blocks — it just handles the case where they're merged.

### Files modified

- `src/services/sddg/anchorBasedExtractor.ts` — Add post-extraction fallback for `airport_destination`

---

## Testing

### Existing tests
- `src/services/sddg/__tests__/valueExtraction.test.ts` — Add tests for garbled checkbox detection
- `src/services/sddg/__tests__/inlineDangerousGoodsParser.test.ts` — Unaffected (DG table extraction)

### New test cases for `extractCheckboxValue`
1. Clean X block detection (existing behavior, regression test)
2. Garbled X in text — aircraft type: "PASSENGER"/"AND CARGO"/"AIRCRAFT" clean + "CARC0X" garbled
3. Garbled X in text — shipment type: "NON-RADIOACTIVE RAOUDBCOOKX" single block
4. Multi-line labels with X on different sides
5. No text blocks found at all (edge case)

### New test cases for airport destination fallback
1. `"Alirport of Destination (optional): SUU"` → extracts "SUU"
2. `"Airport of Destination (optional): HIK"` → extracts "HIK"
3. No matching block → returns empty string

### Manual test
Re-scan the same SDDG image and verify:
- Aircraft type → "Passenger and Cargo Aircraft"
- Shipment type → "Non-Radioactive"
- Airport of Departure → "HIK" (unchanged)
- Airport of Destination → "SUU"
