# Consignee Block Fix — Design

**Date:** 2026-02-04
**Branch:** `inspector-persona-testing`

---

## Problem

The consignee block has three layers of issues:

### 1. Extraction boundary — wrong constraints from `boundedBy`

The `boundedBy` primary-direction heuristic in `findValueBlocks` misclassifies diagonal bounding anchors. For consignee bounded by `airport_departure` at (321, 435):

- verticalOffset ≈ 225px, horizontalOffset ≈ 336px
- Horizontal dominates → classified as "primarily to the right" → constrains maxX to 321
- But airport_departure is also significantly **below** — it should constrain maxY, not maxX

Result: `x=[24, 321] y=[200, 478]` — too narrow (excludes GA blocks at x=348) and too tall (includes boilerplate at y=344-464).

### 2. Extraction filtering — missing KNOWN_LABELS

- "TRANSPORT DETAILS" leaks in because KNOWN_LABELS only has "TRANSPORTATION DETAILS"
- "be handed to the operator" leaks in because it's a separate OCR block from "Two completed and signed copies..." which does match

### 3. SW3119 lost from anchor text

OCR produces `"Consignee SW3119"` as a single block. `findValueBlocks` skips the anchor block entirely. The account code (DoDAAC) is lost.

### 4. Parsing — rigid slots

`parseConsigneeInfo` forces data into `name/street/city/phone` — drops data after line 3, same bug that was just fixed for shipper.

---

## Fix

### Layer 1: Explicit `boundedBy` constraint directions

Replace `boundedBy: string[]` with explicit constraint directions:

```typescript
boundedBy?: Array<{ anchorId: string; constrains: "maxY" | "maxX" }>;
```

Updated configs:

```typescript
// Shipper: consignee is below, air_waybill is to the right
shipper: {
  boundedBy: [
    { anchorId: "consignee", constrains: "maxY" },
    { anchorId: "air_waybill", constrains: "maxX" },
  ]
}

// Consignee: airport_departure is below, shipment_type is to the right
consignee: {
  boundedBy: [
    { anchorId: "airport_departure", constrains: "maxY" },
    { anchorId: "shipment_type", constrains: "maxX" },
  ]
}

// Additional handling: emergency_telephone is below, name_title_signatory is to the right
additional_handling: {
  boundedBy: [
    { anchorId: "emergency_telephone", constrains: "maxY" },
    { anchorId: "name_title_signatory", constrains: "maxX" },
  ]
}
```

Constraint logic in `findValueBlocks` simplifies to:

```typescript
for (const bound of config.valueRegionRules.boundedBy) {
  const boundAnchor = allAnchors.get(bound.anchorId);
  if (!boundAnchor) continue;

  if (bound.constrains === "maxY" && boundAnchor.boundingBox.y < searchArea.maxY) {
    searchArea.maxY = boundAnchor.boundingBox.y;
  } else if (bound.constrains === "maxX" && boundAnchor.boundingBox.x < searchArea.maxX) {
    searchArea.maxX = boundAnchor.boundingBox.x;
  }
}
```

No more center-point calculations or primary-direction heuristics.

`regionInference.ts` also uses `boundedBy` in 4 loops — update each to extract `bound.anchorId` instead of using the string directly. regionInference.ts has its own position-based logic for determining X vs Y, so the `constrains` field is unused there.

Expected consignee search area: changes from `x=[24, 321] y=[200, 478]` to approximately `x=[24, 545] y=[200, 435]`.

### Layer 2: KNOWN_LABELS additions

Add to the KNOWN_LABELS array in `adaptiveRegionDetection.ts`:

```typescript
"TRANSPORT DETAILS",
"HANDED TO THE OPERATOR",
```

### Layer 3: Anchor text residual recovery

In `findValueBlocks`, after skipping the anchor block, check if the anchor text contains non-label content. If so, include a synthetic block with the residual text:

```typescript
const anchorResidual = anchor.text
  .replace(/^(SHIPPER|CONSIGNEE|ADDITIONAL\s*HANDLING\s*INFORMATION)\s*/i, "")
  .trim();

if (anchorResidual) {
  candidates.push({
    block: { ...anchor, text: anchorResidual } as TextBlock,
    distance: 0,
  });
}
```

"Consignee SW3119" → residual "SW3119" → prepended to value output.

### Layer 4: Consignee parser redesign

Replace rigid `name/street/city/phone` with dynamic `addressLines`:

```typescript
interface ConsigneeInfo {
  addressLines: string[];
}
```

Parsing: split into lines, trim, filter empty. No phone/DSN extraction needed — consignee blocks don't contain phone numbers.

JSX rendering changes from rigid slots to `addressLines.map()`.

---

## Expected result

Before:
```
DLA DISTRIBUTION WARNER ROBINS 455 BYRON STREET BLDG 376
ROBINS A F B ROBINS A F B
be handed to the operator
TRANSPORT DETAILS
(delete non-applicoble)
```

After:
```
SW3119
DLA DISTRIBUTION WARNER ROBINS
455 BYRON STREET BLDG 376
ROBINS A F B
GA 31098-1887
ROBINS A F B
GA 310981887
```

---

## Files modified

- `src/services/sddg/anchorTypes.ts` — Update `boundedBy` type
- `src/services/sddg/anchorConfig.ts` — Update 3 `boundedBy` entries to new format
- `src/services/sddg/adaptiveRegionDetection.ts` — Simplify constraint loop, add anchor residual recovery, add KNOWN_LABELS entries
- `src/services/sddg/regionInference.ts` — Update 4 loops to use `bound.anchorId`
- `src/services/sddg/__tests__/regionInference.test.ts` — Update test to use new format
- `src/components/Inspector/InteractiveSDDGForm.tsx` — Rewrite `parseConsigneeInfo`, update JSX

---

## Testing

- Existing `valueExtraction.test.ts` (17 tests) — should pass unchanged
- Existing `parseShipperInfo.test.ts` (12 tests) — should pass unchanged
- Existing `regionInference.test.ts` — update to new `boundedBy` format
- New `parseConsigneeInfo.test.ts` — multi-line, single-line, empty input
- Manual verification of consignee search area bounds via debug log
