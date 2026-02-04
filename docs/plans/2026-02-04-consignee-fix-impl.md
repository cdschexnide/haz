# Consignee Block Fix — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix the consignee block extraction and parsing so it captures all address data (including DoDAAC codes and zip codes), excludes boilerplate text, and renders dynamically instead of in rigid slots.

**Architecture:** Four layers — (1) change `boundedBy` type from `string[]` to explicit `{ anchorId, constrains }` objects across the type definition, anchor configs, and all consumers; (2) add missing patterns to KNOWN_LABELS; (3) recover non-label content from anchor text blocks; (4) rewrite `parseConsigneeInfo` with dynamic `addressLines`.

**Tech Stack:** TypeScript, React Native

**Design doc:** `docs/plans/2026-02-04-consignee-fix-design.md`

---

### Task 1: Update `boundedBy` type and anchor configs

**Files:**
- Modify: `src/services/sddg/anchorTypes.ts:34`
- Modify: `src/services/sddg/anchorConfig.ts:14,30,220`

**Step 1: Update the `ValueRegionRules` interface**

In `src/services/sddg/anchorTypes.ts`, replace line 34:

```typescript
  boundedBy?: string[];           // Other anchor fieldIds that bound this region
```

with:

```typescript
  boundedBy?: Array<{ anchorId: string; constrains: "maxY" | "maxX" }>;  // Explicit boundary constraints
```

**Step 2: Update shipper `boundedBy` in anchorConfig**

In `src/services/sddg/anchorConfig.ts`, replace line 14:

```typescript
      boundedBy: ["phone_number", "consignee", "air_waybill"],
```

with:

```typescript
      boundedBy: [
        { anchorId: "consignee", constrains: "maxY" },
        { anchorId: "air_waybill", constrains: "maxX" },
      ],
```

Note: `phone_number` is dropped — it's never found in the logs and the other two provide sufficient bounds.

**Step 3: Update consignee `boundedBy` in anchorConfig**

In `src/services/sddg/anchorConfig.ts`, replace line 30:

```typescript
      boundedBy: ["airport_departure", "aircraft_type", "shipment_type"],
```

with:

```typescript
      boundedBy: [
        { anchorId: "airport_departure", constrains: "maxY" },
        { anchorId: "shipment_type", constrains: "maxX" },
      ],
```

Note: `aircraft_type` is dropped — it's rarely found and `shipment_type` provides the right-side bound.

**Step 4: Update additional_handling `boundedBy` in anchorConfig**

In `src/services/sddg/anchorConfig.ts`, replace line 220:

```typescript
      boundedBy: ["emergency_telephone", "name_title_signatory"],
```

with:

```typescript
      boundedBy: [
        { anchorId: "emergency_telephone", constrains: "maxY" },
        { anchorId: "name_title_signatory", constrains: "maxX" },
      ],
```

**Step 5: Commit**

```bash
git add src/services/sddg/anchorTypes.ts src/services/sddg/anchorConfig.ts
git commit -m "refactor: change boundedBy from string[] to explicit constraint objects

Each entry now specifies which axis it constrains (maxY or maxX),
eliminating heuristic-based direction detection that misclassified
diagonal bounding anchors."
```

---

### Task 2: Update `regionInference.ts` to use new `boundedBy` format

**Files:**
- Modify: `src/services/sddg/regionInference.ts:37-56,98-99,142-143`
- Modify: `src/services/sddg/__tests__/regionInference.test.ts:33`

**Step 1: Update `computeLabelTopLeftRegion` (lines 37-56)**

Replace the two `boundedBy` loops. The first loop (lines 37-44) finds anchors below:

```typescript
  if (rules.boundedBy) {
    for (const boundId of rules.boundedBy) {
      const boundAnchor = allAnchors.get(boundId);
```

becomes:

```typescript
  if (rules.boundedBy) {
    for (const bound of rules.boundedBy) {
      const boundAnchor = allAnchors.get(bound.anchorId);
```

The second loop (lines 50-56) finds anchors to the right:

```typescript
  if (rules.boundedBy) {
    for (const boundId of rules.boundedBy) {
      const boundAnchor = allAnchors.get(boundId);
```

becomes:

```typescript
  if (rules.boundedBy) {
    for (const bound of rules.boundedBy) {
      const boundAnchor = allAnchors.get(bound.anchorId);
```

**Step 2: Update `computeLabelLeftValueRightRegion` (lines 98-104)**

Replace:

```typescript
  if (rules.boundedBy) {
    for (const boundId of rules.boundedBy) {
      const boundAnchor = allAnchors.get(boundId);
```

with:

```typescript
  if (rules.boundedBy) {
    for (const bound of rules.boundedBy) {
      const boundAnchor = allAnchors.get(bound.anchorId);
```

**Step 3: Update `computeLabelTopValueBottomRegion` (lines 142-148)**

Replace:

```typescript
  if (rules.boundedBy) {
    for (const boundId of rules.boundedBy) {
      const boundAnchor = allAnchors.get(boundId);
```

with:

```typescript
  if (rules.boundedBy) {
    for (const bound of rules.boundedBy) {
      const boundAnchor = allAnchors.get(bound.anchorId);
```

**Step 4: Update the test**

In `src/services/sddg/__tests__/regionInference.test.ts`, replace line 33:

```typescript
        { boundedBy: ["consignee"], direction: "below-and-right" },
```

with:

```typescript
        { boundedBy: [{ anchorId: "consignee", constrains: "maxY" }], direction: "below-and-right" },
```

**Step 5: Run tests**

Run: `npx jest src/services/sddg/__tests__/regionInference.test.ts --verbose`
Expected: ALL pass (3/3).

**Step 6: Commit**

```bash
git add src/services/sddg/regionInference.ts src/services/sddg/__tests__/regionInference.test.ts
git commit -m "refactor: update regionInference to use new boundedBy format

regionInference.ts has its own position-based logic for determining
X vs Y constraints, so it just extracts bound.anchorId from each
entry. The constrains field is unused here."
```

---

### Task 3: Simplify `findValueBlocks` constraint logic in `adaptiveRegionDetection.ts`

**Files:**
- Modify: `src/services/sddg/adaptiveRegionDetection.ts:14-47,196-227`

**Step 1: Add KNOWN_LABELS entries**

In `src/services/sddg/adaptiveRegionDetection.ts`, in the KNOWN_LABELS array, after line 39 (`"TRANSPORTATION DETAILS",`), add:

```typescript
  "TRANSPORT DETAILS",
```

After line 41 (`"DECLARATION MUST",`), add:

```typescript
  "HANDED TO THE OPERATOR",
```

**Step 2: Replace the `boundedBy` constraint loop**

In `src/services/sddg/adaptiveRegionDetection.ts`, replace lines 196-227 (the entire `boundedBy` constraint block including the debug log):

```typescript
  // Apply boundedBy constraints from anchor config
  // These limit the search area so fields don't grab blocks from adjacent fields
  if (config.valueRegionRules.boundedBy) {
    for (const boundId of config.valueRegionRules.boundedBy) {
      const boundAnchor = allAnchors.get(boundId);
      if (!boundAnchor) continue;

      const boundBox = boundAnchor.boundingBox;
      const anchorCenterX = anchorBox.x + anchorBox.width / 2;
      const anchorCenterY = anchorBox.y + anchorBox.height / 2;
      const boundCenterX = boundBox.x + boundBox.width / 2;
      const boundCenterY = boundBox.y + boundBox.height / 2;

      const verticalOffset = boundCenterY - anchorCenterY;
      const horizontalOffset = boundCenterX - anchorCenterX;

      // Determine primary direction: only apply the dominant constraint
      // e.g., consignee is primarily BELOW shipper (not to the right),
      // air_waybill is primarily to the RIGHT (not below)
      if (verticalOffset > 0 && verticalOffset >= Math.abs(horizontalOffset)) {
        // Primarily below → constrain maxY only
        if (boundBox.y < searchArea.maxY) {
          searchArea.maxY = boundBox.y;
        }
      } else if (horizontalOffset > 0 && horizontalOffset > Math.abs(verticalOffset)) {
        // Primarily to the right → constrain maxX only
        if (boundBox.x < searchArea.maxX) {
          searchArea.maxX = boundBox.x;
        }
      }
    }
  }

  console.log(
    `🔍 ${anchor.fieldId} search area: x=[${Math.round(searchArea.minX)}, ${Math.round(searchArea.maxX)}] y=[${Math.round(searchArea.minY)}, ${Math.round(searchArea.maxY)}]`
  );
```

with:

```typescript
  // Apply boundedBy constraints from anchor config
  // Each entry explicitly declares which axis it constrains
  if (config.valueRegionRules.boundedBy) {
    for (const bound of config.valueRegionRules.boundedBy) {
      const boundAnchor = allAnchors.get(bound.anchorId);
      if (!boundAnchor) continue;

      if (bound.constrains === "maxY" && boundAnchor.boundingBox.y < searchArea.maxY) {
        searchArea.maxY = boundAnchor.boundingBox.y;
      } else if (bound.constrains === "maxX" && boundAnchor.boundingBox.x < searchArea.maxX) {
        searchArea.maxX = boundAnchor.boundingBox.x;
      }
    }
  }

  console.log(
    `🔍 ${anchor.fieldId} search area: x=[${Math.round(searchArea.minX)}, ${Math.round(searchArea.maxX)}] y=[${Math.round(searchArea.minY)}, ${Math.round(searchArea.maxY)}]`
  );
```

**Step 3: Add anchor text residual recovery**

In the same file, inside the `for (const block of textBlocks)` loop, find the anchor-skip block (lines 241-247):

```typescript
    // Skip the anchor itself
    if (
      Math.abs(block.boundingBox.x - anchorBox.x) < 5 &&
      Math.abs(block.boundingBox.y - anchorBox.y) < 5
    ) {
      continue;
    }
```

Replace with:

```typescript
    // Skip the anchor itself, but recover any non-label residual text
    if (
      Math.abs(block.boundingBox.x - anchorBox.x) < 5 &&
      Math.abs(block.boundingBox.y - anchorBox.y) < 5
    ) {
      // Check if anchor text has extra content beyond the label (e.g., "Consignee SW3119")
      const residual = block.text
        .replace(/^(SHIPPER|CONSIGNEE|ADDITIONAL\s*HANDLING\s*INFORMATION)\s*/i, "")
        .trim();
      if (residual && residual !== block.text.trim()) {
        candidates.push({ block: { ...block, text: residual }, distance: 0 });
      }
      continue;
    }
```

The `residual !== block.text.trim()` check ensures we only add the residual when the label prefix was actually stripped (avoids treating random blocks near the anchor as residuals).

**Step 4: Run existing tests**

Run: `npx jest src/services/sddg/__tests__/valueExtraction.test.ts --verbose`
Expected: ALL pass (17/17).

Run: `npx jest src/services/sddg/__tests__/regionInference.test.ts --verbose`
Expected: ALL pass (3/3).

Run: `npx jest src/components/Inspector/__tests__/parseShipperInfo.test.ts --verbose`
Expected: ALL pass (12/12).

**Step 5: Commit**

```bash
git add src/services/sddg/adaptiveRegionDetection.ts
git commit -m "fix: use explicit boundedBy constraints and recover anchor residual text

- Replace heuristic primary-direction detection with explicit constrains
  field (maxY or maxX) from anchor config
- Add TRANSPORT DETAILS and HANDED TO THE OPERATOR to KNOWN_LABELS
- Recover non-label content from anchor text (e.g., SW3119 from
  'Consignee SW3119') by stripping label prefix and adding residual
  as a candidate block"
```

---

### Task 4: Rewrite `parseConsigneeInfo` and update JSX

**Files:**
- Modify: `src/components/Inspector/InteractiveSDDGForm.tsx:214-265,404-408`
- Create: `src/components/Inspector/__tests__/parseConsigneeInfo.test.ts`

**Step 1: Write the tests**

Create `src/components/Inspector/__tests__/parseConsigneeInfo.test.ts`:

```typescript
import { parseConsigneeInfo } from "../InteractiveSDDGForm";

describe("parseConsigneeInfo", () => {
  it("should handle multi-line consignee with all address lines", () => {
    const input =
      "SW3119\nDLA DISTRIBUTION WARNER ROBINS\n455 BYRON STREET BLDG 376\nROBINS A F B\nGA 31098-1887\nROBINS A F B\nGA 310981887";
    const result = parseConsigneeInfo(input);
    expect(result.addressLines).toEqual([
      "SW3119",
      "DLA DISTRIBUTION WARNER ROBINS",
      "455 BYRON STREET BLDG 376",
      "ROBINS A F B",
      "GA 31098-1887",
      "ROBINS A F B",
      "GA 310981887",
    ]);
  });

  it("should handle simple 2-line consignee", () => {
    const input = "NUWC KEYPORT (US NAVY)\n610 DOWELL STREET\nKEYPORT, WA 98345 US";
    const result = parseConsigneeInfo(input);
    expect(result.addressLines).toEqual([
      "NUWC KEYPORT (US NAVY)",
      "610 DOWELL STREET",
      "KEYPORT, WA 98345 US",
    ]);
  });

  it("should handle single-line consignee", () => {
    const input = "DF YOUNG INC 176-20 147 AVENUE JAMAICA NY 11434";
    const result = parseConsigneeInfo(input);
    expect(result.addressLines).toEqual([
      "DF YOUNG INC 176-20 147 AVENUE JAMAICA NY 11434",
    ]);
  });

  it("should filter out empty lines", () => {
    const input = "DLA DISTRIBUTION\n\n\n455 BYRON STREET";
    const result = parseConsigneeInfo(input);
    expect(result.addressLines).toEqual([
      "DLA DISTRIBUTION",
      "455 BYRON STREET",
    ]);
  });

  it("should return fallback for empty input", () => {
    const result = parseConsigneeInfo("");
    expect(result.addressLines).toEqual(["No consignee data"]);
  });

  it("should return fallback for undefined-like input", () => {
    const result = parseConsigneeInfo(undefined as unknown as string);
    expect(result.addressLines).toEqual(["No consignee data"]);
  });
});
```

**Step 2: Run tests to verify they fail**

Run: `npx jest src/components/Inspector/__tests__/parseConsigneeInfo.test.ts --verbose`
Expected: FAIL — `parseConsigneeInfo` is not exported / returns wrong shape.

**Step 3: Rewrite `parseConsigneeInfo`**

In `src/components/Inspector/InteractiveSDDGForm.tsx`, replace the entire `parseConsigneeInfo` function (lines 214-265) with:

```typescript
export const parseConsigneeInfo = (consignee: string): { addressLines: string[] } => {
  if (!consignee) {
    return { addressLines: ["No consignee data"] };
  }

  const lines = consignee
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) {
    return { addressLines: ["No consignee data"] };
  }

  return { addressLines: lines };
};
```

Note: The old `parseConsigneeInfo` was a `const` (not exported). Add `export` so tests can import it. Also ensure `parseShipperInfo` is exported the same way (it should already be from the previous task).

**Step 4: Update the JSX rendering**

In the same file, replace lines 404-408:

```tsx
              <View style={styles.boxLeft}>
                <Text style={styles.label}>Consignee</Text>
                <Text style={[styles.text, { paddingLeft: 25 }]}>{consigneeInfo.name}</Text>
                <Text style={[styles.text, { paddingLeft: 25 }]}>{consigneeInfo.street}</Text>
                <Text style={[styles.text, { paddingLeft: 25 }]}>{consigneeInfo.city}</Text>
              </View>
```

with:

```tsx
              <View style={styles.boxLeft}>
                <Text style={styles.label}>Consignee</Text>
                {consigneeInfo.addressLines.map((line, i) => (
                  <Text key={i} style={[styles.text, { paddingLeft: 25 }]}>{line}</Text>
                ))}
              </View>
```

**Step 5: Run tests**

Run: `npx jest src/components/Inspector/__tests__/parseConsigneeInfo.test.ts --verbose`
Expected: ALL pass (6/6).

Run: `npx jest src/components/Inspector/__tests__/parseShipperInfo.test.ts --verbose`
Expected: ALL pass (12/12) — no regressions.

**Step 6: Commit**

```bash
git add src/components/Inspector/InteractiveSDDGForm.tsx src/components/Inspector/__tests__/parseConsigneeInfo.test.ts
git commit -m "fix: rewrite parseConsigneeInfo with dynamic addressLines

Replace rigid name/street/city/phone slots with dynamic addressLines
array. All lines are preserved in original order. JSX renders each
line dynamically instead of fixed slots."
```
