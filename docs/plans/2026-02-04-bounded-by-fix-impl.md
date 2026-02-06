# Adaptive Region Detection `boundedBy` Fix — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make `findValueBlocks` in `adaptiveRegionDetection.ts` respect the `boundedBy` constraints defined in anchor configs, preventing shipper/consignee/other fields from grabbing text blocks that belong to adjacent fields.

**Architecture:** After computing the initial pixel-based search area, iterate over `boundedBy` anchor IDs and constrain `maxY`/`maxX` based on found bounding anchor positions.

**Tech Stack:** TypeScript

**Design doc:** `docs/plans/2026-02-04-bounded-by-fix-design.md`

---

### Task 1: Apply `boundedBy` constraints in `findValueBlocks`

**Files:**
- Modify: `src/services/sddg/adaptiveRegionDetection.ts:179-253`

**Step 1: Add `boundedBy` constraint logic**

In `src/services/sddg/adaptiveRegionDetection.ts`, inside the `findValueBlocks` function, add the following block **after** the search area is computed (after line 194, before the "Reference point" comment at line 196):

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

        // If bounding anchor is below, constrain maxY
        if (boundCenterY > anchorCenterY && boundBox.y < searchArea.maxY) {
          searchArea.maxY = boundBox.y;
        }

        // If bounding anchor is to the right, constrain maxX
        if (boundCenterX > anchorCenterX && boundBox.x < searchArea.maxX) {
          searchArea.maxX = boundBox.x;
        }
      }
    }
```

**Step 2: Add a debug log for the constrained search area**

After the new constraint block (and before the "Reference point" comment), add:

```typescript
    console.log(`🔍 ${anchor.fieldId} search area: x=[${Math.round(searchArea.minX)}, ${Math.round(searchArea.maxX)}] y=[${Math.round(searchArea.minY)}, ${Math.round(searchArea.maxY)}]`);
```

**Step 3: Run existing tests to confirm no regressions**

Run: `npx jest src/services/sddg/__tests__/ --verbose`
Expected: Pre-existing test results unchanged (some tests in anchorDetection/regionInference/anchorBasedExtractor have pre-existing failures documented in the handoff — those are unrelated).

Run: `npx jest src/services/sddg/__tests__/valueExtraction.test.ts --verbose`
Expected: ALL pass (17/17).

Run: `npx jest src/components/Inspector/__tests__/parseShipperInfo.test.ts --verbose`
Expected: ALL pass (12/12).

**Step 4: Commit**

```bash
git add src/services/sddg/adaptiveRegionDetection.ts
git commit -m "fix: apply boundedBy constraints in adaptive region detection

findValueBlocks now respects the boundedBy anchor IDs defined in
anchorConfig.ts. For each bounding anchor that was found, constrains
the search area: below anchors limit maxY, right-side anchors limit
maxX. Prevents shipper from grabbing consignee data and TCN values,
and consignee from grabbing transport details and warning text."
```
