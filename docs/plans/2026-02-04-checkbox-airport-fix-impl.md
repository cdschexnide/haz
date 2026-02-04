# Checkbox & Airport Extraction Fix — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix three bugs: checkbox X-mark detection failing on garbled OCR, double-inversion in mapToHazproFormat, and airport of destination not extracted when label+value are in the same OCR block.

**Architecture:** Bug 2 is a one-line mapping fix in `mapToHazproFormat()`. Bug 1 adds a garble-detection fallback inside `extractCheckboxValue()` that splits text blocks into spatial groups and compares readability. Bug 3 adds a post-extraction regex fallback in `anchorBasedExtractor.ts` for airport_destination.

**Tech Stack:** TypeScript, React Native, Jest, ML Kit OCR (text blocks with bounding boxes)

**Design doc:** `docs/plans/2026-02-04-checkbox-airport-fix-design.md`

---

### Task 1: Fix mapToHazproFormat double-inversion

**Files:**
- Modify: `src/screens/SDDG/SDDGProcessingScreen.tsx:37-56`

**Context:**
`extractCheckboxValue()` returns the SELECTED (non-X'd) option value. `convertToSDDGData()` stores this as booleans (`cargo_aircraft_only`, `non_radioactive`, `radioactive`) where `true` means that option IS selected. But `mapToHazproFormat()` currently inverts these, treating them as "has X marks". Remove the inversion so the booleans map directly.

**Step 1: Fix aircraftType mapping**

In `src/screens/SDDG/SDDGProcessingScreen.tsx`, change lines 37-41 from:

```typescript
    aircraftType: sddgData.cargo_aircraft_only
      ? "Passenger and Cargo Aircraft"
      : "Cargo Aircraft Only",
```

to:

```typescript
    aircraftType: sddgData.cargo_aircraft_only
      ? "Cargo Aircraft Only"
      : "Passenger and Cargo Aircraft",
```

**Step 2: Fix shipmentType mapping**

In the same file, change lines 50-56 from:

```typescript
    shipmentType: sddgData.radioactive
      ? "Non-Radioactive"
      : sddgData.non_radioactive
      ? "Radioactive"
      : "",
```

to:

```typescript
    shipmentType: sddgData.non_radioactive
      ? "Non-Radioactive"
      : sddgData.radioactive
      ? "Radioactive"
      : "",
```

**Step 3: Update the comments**

Replace the inversion comments above each mapping. The `aircraftType` comment (lines 37-38):

```typescript
    // Key 7: Aircraft Type — direct mapping from checkbox detection
    // extractCheckboxValue returns the selected (non-X'd) option
```

The `shipmentType` comment (lines 49-51):

```typescript
    // Key 10: Shipment Type — direct mapping from checkbox detection
    // extractCheckboxValue returns the selected (non-X'd) option
```

**Step 4: Run existing tests to confirm no regressions**

Run: `npx jest src/services/sddg/__tests__/valueExtraction.test.ts --verbose`
Expected: All existing tests pass (this change is in the mapping layer, not the extraction layer).

**Step 5: Commit**

```bash
git add src/screens/SDDG/SDDGProcessingScreen.tsx
git commit -m "fix: remove double-inversion in mapToHazproFormat checkbox mapping

extractCheckboxValue returns the selected (non-X'd) option. The boolean
fields in SDDGData represent the actual selection, not which checkbox
has X marks. Remove the inversion so booleans map directly to display
strings."
```

---

### Task 2: Add garble-detection fallback to extractCheckboxValue

**Files:**
- Modify: `src/services/sddg/valueExtraction.ts:250-340`
- Test: `src/services/sddg/__tests__/valueExtraction.test.ts`

**Context:**
When OCR garbles X marks into the option label text (e.g., `"CARC0X"` instead of clean `"XXXXXXX"`), no X blocks are found and the function defaults to `options[0]`. The fallback should:
1. Find text blocks in the checkbox Y-band
2. Split them into left/right spatial groups
3. Compare each group's text quality against each option label
4. The group with the cleaner match is the selected (non-X'd) option

**Step 1: Write failing tests for garbled checkbox detection**

Add these test cases to `src/services/sddg/__tests__/valueExtraction.test.ts`, inside the existing `describe("extractCheckboxValue", ...)` block, after the existing test:

```typescript
    it("should detect X'd option from garbled OCR — aircraft type (3-line split)", () => {
      // Real OCR: PASSENGER/AND CARGO/AIRCRAFT split across 3 lines (clean)
      // CARGO AIRCRAFT ONLY garbled as "CARC0X" due to X marks
      const textBlocks: TextBlock[] = [
        { text: "PASSENGER", boundingBox: { x: 80, y: 488, width: 100, height: 15 }, confidence: 1.0 },
        { text: "AND CARGO", boundingBox: { x: 78, y: 499, width: 100, height: 15 }, confidence: 1.0 },
        { text: "AIRCRAFT", boundingBox: { x: 78, y: 512, width: 90, height: 15 }, confidence: 1.0 },
        { text: "CARC0X", boundingBox: { x: 205, y: 494, width: 80, height: 15 }, confidence: 1.0 },
      ];

      const options = [
        { label: "PASSENGER AND CARGO AIRCRAFT", value: "passenger_and_cargo" },
        { label: "CARGO AIRCRAFT ONLY", value: "cargo_only" },
      ];

      const value = extractCheckboxValue(textBlocks, options);
      expect(value).toBe("passenger_and_cargo");
    });

    it("should detect X'd option from garbled OCR — shipment type (single block)", () => {
      // Real OCR: "NON-RADIOACTIVE" is clean, "RADIOACTIVE" garbled as "RAOUDBCOOKX"
      // Both merged into single block: "NON-RADIOACTIVE RAOUDBCOOKX"
      const textBlocks: TextBlock[] = [
        { text: "NON-RADIOACTIVE RAOUDBCOOKX", boundingBox: { x: 545, y: 574, width: 300, height: 15 }, confidence: 1.0 },
      ];

      const options = [
        { label: "NON-RADIOACTIVE", value: "non_radioactive" },
        { label: "RADIOACTIVE", value: "radioactive" },
      ];

      const value = extractCheckboxValue(textBlocks, options);
      expect(value).toBe("non_radioactive");
    });

    it("should detect X'd option from garbled OCR — aircraft type (2-line split)", () => {
      // Variation: "PASSENGER AND" / "CARGO AIRCRAFT" on left, garbled on right
      const textBlocks: TextBlock[] = [
        { text: "PASSENGER AND", boundingBox: { x: 80, y: 488, width: 120, height: 15 }, confidence: 1.0 },
        { text: "CARGO AIRCRAFT", boundingBox: { x: 80, y: 505, width: 120, height: 15 }, confidence: 1.0 },
        { text: "CARGOX", boundingBox: { x: 210, y: 488, width: 90, height: 15 }, confidence: 1.0 },
        { text: "AIRCRAFTXX", boundingBox: { x: 210, y: 500, width: 90, height: 15 }, confidence: 1.0 },
        { text: "ONLXX", boundingBox: { x: 210, y: 512, width: 70, height: 15 }, confidence: 1.0 },
      ];

      const options = [
        { label: "PASSENGER AND CARGO AIRCRAFT", value: "passenger_and_cargo" },
        { label: "CARGO AIRCRAFT ONLY", value: "cargo_only" },
      ];

      const value = extractCheckboxValue(textBlocks, options);
      expect(value).toBe("passenger_and_cargo");
    });

    it("should still detect clean X blocks (regression)", () => {
      // Image 2 scenario: clean "XXXX" block + clean label text
      const textBlocks: TextBlock[] = [
        { text: "XXXX", boundingBox: { x: 80, y: 490, width: 80, height: 20 }, confidence: 1.0 },
        { text: "CARGO AIRCRAFT", boundingBox: { x: 210, y: 488, width: 120, height: 15 }, confidence: 1.0 },
        { text: "ONLY", boundingBox: { x: 210, y: 505, width: 50, height: 15 }, confidence: 1.0 },
      ];

      const options = [
        { label: "PASSENGER AND CARGO AIRCRAFT", value: "passenger_and_cargo" },
        { label: "CARGO AIRCRAFT ONLY", value: "cargo_only" },
      ];

      const value = extractCheckboxValue(textBlocks, options);
      expect(value).toBe("cargo_only");
    });

    it("should handle no text blocks found at all", () => {
      const textBlocks: TextBlock[] = [];
      const options = [
        { label: "NON-RADIOACTIVE", value: "non_radioactive" },
        { label: "RADIOACTIVE", value: "radioactive" },
      ];

      const value = extractCheckboxValue(textBlocks, options);
      expect(value).toBe("non_radioactive"); // Default to first option
    });
```

**Step 2: Run tests to verify they fail**

Run: `npx jest src/services/sddg/__tests__/valueExtraction.test.ts --verbose`
Expected: The 3 garbled OCR tests FAIL (the regression test and empty test should still pass).

**Step 3: Implement the garble-detection fallback**

In `src/services/sddg/valueExtraction.ts`, replace the `extractCheckboxValue` function (lines 250-340) with:

```typescript
/**
 * Extract checkbox value by detecting which option is NOT X'd out.
 *
 * Strategy 1: Find standalone "XXXXX" blocks and pair each with the closest option label.
 * Strategy 2 (fallback): When X marks are garbled into the label text by OCR,
 *   split text blocks into spatial groups and compare readability — the group
 *   whose text more cleanly matches an option label is the selected (non-X'd) option.
 */
export function extractCheckboxValue(
  textBlocks: TextBlock[],
  options: CheckboxOption[]
): string {
  if (textBlocks.length === 0) {
    return options[0]?.value ?? "";
  }

  // === Strategy 1: Standalone X-block detection ===
  const xBlocks = textBlocks.filter(block => {
    const text = block.text.toUpperCase().replace(/\s+/g, "");
    return /^X{3,}$/.test(text) || /X{4,}/.test(text);
  });

  if (xBlocks.length > 0) {
    return resolveWithXBlocks(textBlocks, xBlocks, options);
  }

  // === Strategy 2: Garble-detection fallback ===
  return resolveWithGarbleDetection(textBlocks, options);
}

/**
 * Strategy 1: Pair X blocks with nearest option labels.
 * Returns the option NOT associated with any X block.
 */
function resolveWithXBlocks(
  textBlocks: TextBlock[],
  xBlocks: TextBlock[],
  options: CheckboxOption[]
): string {
  // Find option label blocks
  const optionBlocks: Array<{ option: CheckboxOption; block: TextBlock }> = [];
  for (const opt of options) {
    const normalizedLabel = opt.label.toUpperCase().replace(/\s+/g, " ").trim();
    for (const block of textBlocks) {
      const normalizedText = block.text.toUpperCase().replace(/\s+/g, " ").trim();
      if (
        normalizedText === normalizedLabel ||
        (normalizedText.includes(normalizedLabel) &&
          normalizedText.length <= normalizedLabel.length + 5)
      ) {
        optionBlocks.push({ option: opt, block });
        break;
      }
    }
  }

  // For each X block, find the closest option by center-to-center distance
  const xdOptions = new Set<string>();
  for (const xBlock of xBlocks) {
    const xCenterX = xBlock.boundingBox.x + xBlock.boundingBox.width / 2;
    const xCenterY = xBlock.boundingBox.y + xBlock.boundingBox.height / 2;

    let closestOption: string | null = null;
    let closestDist = Infinity;

    for (const { option, block } of optionBlocks) {
      const optCenterX = block.boundingBox.x + block.boundingBox.width / 2;
      const optCenterY = block.boundingBox.y + block.boundingBox.height / 2;
      const dist = Math.sqrt(
        Math.pow(xCenterX - optCenterX, 2) + Math.pow(xCenterY - optCenterY, 2)
      );
      if (dist < closestDist) {
        closestDist = dist;
        closestOption = option.value;
      }
    }

    if (closestOption) xdOptions.add(closestOption);
  }

  // If only one option was found as a text block, infer based on X position
  if (optionBlocks.length === 1) {
    const matchedBlock = optionBlocks[0].block;
    const matchedValue = optionBlocks[0].option.value;
    const matchedRight = matchedBlock.boundingBox.x + matchedBlock.boundingBox.width;

    for (const xBlock of xBlocks) {
      const xLeft = xBlock.boundingBox.x;
      if (xLeft > matchedRight + matchedBlock.boundingBox.width * 0.5) {
        xdOptions.delete(matchedValue);
        for (const opt of options) {
          if (opt.value !== matchedValue) {
            xdOptions.add(opt.value);
          }
        }
      }
    }
  }

  // Return the option NOT X'd out
  for (const opt of options) {
    if (!xdOptions.has(opt.value)) {
      return opt.value;
    }
  }

  return options[0]?.value ?? "";
}

/**
 * Strategy 2: Garble-detection fallback.
 * When OCR merges X marks into label text, the X'd option's text becomes garbled
 * while the non-X'd option remains cleanly readable.
 *
 * Split text blocks into left/right spatial groups, then compare each group's
 * text against option labels. The better-matching group is the selected option.
 */
function resolveWithGarbleDetection(
  textBlocks: TextBlock[],
  options: CheckboxOption[]
): string {
  // Step 1: Find candidate blocks in the checkbox Y-band.
  // Use all blocks whose text contains fragments of any option keyword.
  const optionKeywords = options.flatMap(opt =>
    opt.label.toUpperCase().split(/\s+/).filter(w => w.length >= 4)
  );

  // Collect blocks that might be in the checkbox area.
  // Start with blocks that share any keyword fragment, then expand to nearby blocks.
  const keywordBlocks = textBlocks.filter(block => {
    const upper = block.text.toUpperCase();
    return optionKeywords.some(kw => upper.includes(kw) || levenshteinSmall(upper, kw) <= 2);
  });

  if (keywordBlocks.length === 0) {
    return options[0]?.value ?? "";
  }

  // Compute Y-band from keyword blocks (with padding)
  const minY = Math.min(...keywordBlocks.map(b => b.boundingBox.y)) - 30;
  const maxY = Math.max(...keywordBlocks.map(b => b.boundingBox.y + b.boundingBox.height)) + 30;

  // All blocks in the Y-band
  const bandBlocks = textBlocks.filter(block => {
    const centerY = block.boundingBox.y + block.boundingBox.height / 2;
    return centerY >= minY && centerY <= maxY;
  });

  if (bandBlocks.length === 0) {
    return options[0]?.value ?? "";
  }

  // Step 2: Split into left/right groups by finding the X-coordinate gap.
  const sortedByX = [...bandBlocks].sort((a, b) => a.boundingBox.x - b.boundingBox.x);

  let bestGapIdx = 0;
  let bestGapSize = 0;
  for (let i = 0; i < sortedByX.length - 1; i++) {
    const rightEdge = sortedByX[i].boundingBox.x + sortedByX[i].boundingBox.width;
    const nextLeft = sortedByX[i + 1].boundingBox.x;
    const gap = nextLeft - rightEdge;
    if (gap > bestGapSize) {
      bestGapSize = gap;
      bestGapIdx = i;
    }
  }

  // If gap is too small (< 20px), fall back to median split
  let leftGroup: TextBlock[];
  let rightGroup: TextBlock[];

  if (bestGapSize >= 20 && sortedByX.length >= 2) {
    leftGroup = sortedByX.slice(0, bestGapIdx + 1);
    rightGroup = sortedByX.slice(bestGapIdx + 1);
  } else {
    // Median split
    const medianX = sortedByX[Math.floor(sortedByX.length / 2)].boundingBox.x;
    leftGroup = bandBlocks.filter(b => b.boundingBox.x + b.boundingBox.width / 2 < medianX);
    rightGroup = bandBlocks.filter(b => b.boundingBox.x + b.boundingBox.width / 2 >= medianX);
  }

  // Step 3: Score each group against each option label.
  const leftText = leftGroup.map(b => b.text).join(" ").toUpperCase();
  const rightText = rightGroup.map(b => b.text).join(" ").toUpperCase();

  // Score = how well the group text matches an option label (lower = better match)
  let bestOption: string = options[0]?.value ?? "";
  let bestScore = Infinity;

  for (const opt of options) {
    const normalizedLabel = opt.label.toUpperCase();
    const labelWords = normalizedLabel.split(/\s+/).filter(w => w.length >= 3);

    const leftMatchScore = computeGroupMatchScore(leftText, labelWords);
    const rightMatchScore = computeGroupMatchScore(rightText, labelWords);

    // The group with the better (lower) score for this option is where the clean label is
    const betterScore = Math.min(leftMatchScore, rightMatchScore);
    if (betterScore < bestScore) {
      bestScore = betterScore;
      bestOption = opt.value;
    }
  }

  return bestOption;
}

/**
 * Score how well a text string matches an array of expected label words.
 * Lower score = better match. Counts how many label words appear in the text.
 * Also penalizes X-contamination (high proportion of X characters).
 */
function computeGroupMatchScore(groupText: string, labelWords: string[]): number {
  if (groupText.length === 0) return Infinity;

  // Count label words found in the group text
  let matchedWords = 0;
  for (const word of labelWords) {
    if (groupText.includes(word)) {
      matchedWords++;
    }
  }

  // Word match ratio (0 = no matches, 1 = all words found)
  const matchRatio = labelWords.length > 0 ? matchedWords / labelWords.length : 0;

  // X-contamination: proportion of X characters (excluding expected X's like in "NON-")
  const xCount = (groupText.match(/X/g) || []).length;
  const alphaCount = (groupText.match(/[A-Z]/g) || []).length;
  const xRatio = alphaCount > 0 ? xCount / alphaCount : 0;

  // Score: lower is better. Reward word matches, penalize X contamination.
  // matchRatio of 1.0 with xRatio of 0 gives score near 0 (perfect).
  // matchRatio of 0.0 with xRatio of 0.5 gives score near 1.5 (bad).
  return (1 - matchRatio) + xRatio;
}

/**
 * Small Levenshtein helper for short strings (keyword matching).
 * Only used for option keyword detection, not full fuzzy matching.
 */
function levenshteinSmall(a: string, b: string): number {
  if (a.length > 30 || b.length > 30) return Math.abs(a.length - b.length);
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}
```

**Step 4: Run tests to verify they pass**

Run: `npx jest src/services/sddg/__tests__/valueExtraction.test.ts --verbose`
Expected: ALL tests pass, including the 3 new garbled OCR tests and the existing regression test.

**Step 5: Commit**

```bash
git add src/services/sddg/valueExtraction.ts src/services/sddg/__tests__/valueExtraction.test.ts
git commit -m "feat: add garble-detection fallback for checkbox X-mark detection

When OCR merges X marks into label text (e.g., CARC0X, RAOUDBCOOKX),
standalone X-block detection fails. New fallback splits text blocks into
left/right spatial groups by X-coordinate gap, then scores each group's
readability against option labels. The group with cleaner text match
is the selected (non-X'd) option."
```

---

### Task 3: Add airport of destination inline extraction fallback

**Files:**
- Modify: `src/services/sddg/anchorBasedExtractor.ts`
- Test: `src/services/sddg/__tests__/valueExtraction.test.ts`

**Context:**
OCR sometimes produces `"Alirport of Destination (optional): SUU"` — the label (with typo) and value in one block. The anchor detector fails because the Levenshtein distance for the full string is too high, and even if the anchor were found, the `"below"` extraction wouldn't find "SUU" since it's in the same block after a colon.

Fix: After the main extraction loop in `extractWithAnchors()`, check if `airport_destination` is empty. If so, scan all text blocks for a regex match and extract the 3-letter code.

**Step 1: Write failing test**

Add a new describe block at the end of `src/services/sddg/__tests__/valueExtraction.test.ts`:

```typescript
  describe("airport destination inline fallback", () => {
    // These test the helper function that will be exported from valueExtraction.ts
    it("should extract airport code from inline label:value block", () => {
      const textBlocks: TextBlock[] = [
        { text: "Alirport of Destination (optional): SUU", boundingBox: { x: 61, y: 554, width: 300, height: 15 }, confidence: 1.0 },
        { text: "Other text block", boundingBox: { x: 100, y: 100, width: 100, height: 15 }, confidence: 1.0 },
      ];

      const value = extractAirportDestinationFallback(textBlocks);
      expect(value).toBe("SUU");
    });

    it("should extract from clean Airport of Destination text", () => {
      const textBlocks: TextBlock[] = [
        { text: "Airport of Destination (optional): HIK", boundingBox: { x: 61, y: 554, width: 300, height: 15 }, confidence: 1.0 },
      ];

      const value = extractAirportDestinationFallback(textBlocks);
      expect(value).toBe("HIK");
    });

    it("should extract from block without colon using trailing code", () => {
      const textBlocks: TextBlock[] = [
        { text: "Airport of Destination(optional) SUU", boundingBox: { x: 61, y: 554, width: 300, height: 15 }, confidence: 1.0 },
      ];

      const value = extractAirportDestinationFallback(textBlocks);
      expect(value).toBe("SUU");
    });

    it("should return empty string when no matching block found", () => {
      const textBlocks: TextBlock[] = [
        { text: "PASSENGER AND CARGO AIRCRAFT", boundingBox: { x: 100, y: 400, width: 200, height: 20 }, confidence: 1.0 },
      ];

      const value = extractAirportDestinationFallback(textBlocks);
      expect(value).toBe("");
    });
  });
```

Also update the import at the top of the test file to include `extractAirportDestinationFallback`:

```typescript
import {
  extractValueFromRegion,
  extractInlinePatternValue,
  extractCheckboxValue,
  applyPostProcessing,
  extractAirportDestinationFallback,
} from "../valueExtraction";
```

**Step 2: Run tests to verify they fail**

Run: `npx jest src/services/sddg/__tests__/valueExtraction.test.ts --verbose`
Expected: FAIL — `extractAirportDestinationFallback` is not exported.

**Step 3: Implement the fallback function**

Add to the end of `src/services/sddg/valueExtraction.ts` (before the final closing, after `applyPostProcessing`):

```typescript
/**
 * Fallback extraction for airport of destination when anchor detection fails.
 * Scans text blocks for an OCR line containing "Airport of Dest..." and extracts
 * the 3-letter airport code after it (typically after a colon or at the end).
 */
export function extractAirportDestinationFallback(textBlocks: TextBlock[]): string {
  for (const block of textBlocks) {
    const text = block.text;
    // Match "A[li]rport of Dest..." with OCR typo tolerance
    if (/A[LIli]r?port\s+of\s+Dest/i.test(text)) {
      // Try extracting code after colon: "...: SUU"
      const colonMatch = text.match(/:\s*([A-Z]{3})\b/);
      if (colonMatch) return colonMatch[1];

      // Try extracting trailing 3-letter uppercase code: "...) SUU" or "...nal SUU"
      const trailingMatch = text.match(/\b([A-Z]{3})\s*$/);
      if (trailingMatch) return trailingMatch[1];
    }
  }
  return "";
}
```

**Step 4: Run tests to verify they pass**

Run: `npx jest src/services/sddg/__tests__/valueExtraction.test.ts --verbose`
Expected: ALL tests pass.

**Step 5: Wire the fallback into anchorBasedExtractor**

In `src/services/sddg/anchorBasedExtractor.ts`, add the import at the top (with the other valueExtraction imports, around line 23):

```typescript
import {
  extractValueFromRegion,
  extractInlinePatternValue,
  extractCheckboxValue,
  applyPostProcessing,
  extractAirportDestinationFallback,
} from "./valueExtraction";
```

Then, after the main extraction `for` loop (after line 336, before the `return` statement), add:

```typescript
    // Fallback: airport_destination when anchor detection failed
    // Handles cases where OCR merges the label and value into one block
    // (e.g., "Alirport of Destination (optional): SUU")
    const destResult = results.get("airport_destination");
    if (!destResult?.value) {
      const fallbackValue = extractAirportDestinationFallback(textBlocks);
      if (fallbackValue) {
        results.set("airport_destination", {
          fieldId: "airport_destination",
          value: fallbackValue,
          confidence: 0.75,
          status: "extracted",
        });
      }
    }
```

**Step 6: Run all SDDG extraction tests**

Run: `npx jest src/services/sddg/__tests__/valueExtraction.test.ts --verbose`
Expected: ALL pass.

**Step 7: Commit**

```bash
git add src/services/sddg/valueExtraction.ts src/services/sddg/__tests__/valueExtraction.test.ts src/services/sddg/anchorBasedExtractor.ts
git commit -m "feat: add airport of destination inline extraction fallback

When OCR produces the label and airport code in a single block
(e.g., 'Alirport of Destination (optional): SUU'), anchor detection
fails due to OCR typos and the value being inline. New fallback scans
for blocks matching the airport of destination pattern and extracts
the 3-letter code."
```
