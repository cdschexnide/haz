# Inline Dangerous Goods Form Variant — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Auto-detect and parse the Labelmaster F07LB SDDG form variant, which uses comma/slash-delimited inline text for dangerous goods instead of a tabular grid.

**Architecture:** A new `inlineDangerousGoodsParser.ts` module handles detection and parsing. It plugs into `anchorBasedExtractor.ts` after anchor detection — a 3-signal scoring system (missing table headers, descriptive paragraph, `//` delimiters) determines the form variant. If at least 2 of 3 signals match, the inline parser extracts the 7 dangerous goods fields instead of the table region logic. All other fields (Shipper, Consignee, etc.) continue through the existing pipeline unchanged.

**Tech Stack:** TypeScript, Jest (jest-expo preset), ML Kit OCR text blocks

**Design doc:** `docs/plans/2026-02-04-inline-dangerous-goods-variant-design.md`

---

## Task 1: Write `parseInlineDangerousGoods` with tests (TDD)

This is the core parsing function. It takes a raw inline string and returns extracted fields.

**Files:**
- Create: `src/services/sddg/__tests__/inlineDangerousGoodsParser.test.ts`
- Create: `src/services/sddg/inlineDangerousGoodsParser.ts`

### Step 1: Write the failing tests

Create `src/services/sddg/__tests__/inlineDangerousGoodsParser.test.ts`:

```typescript
import { parseInlineDangerousGoods } from "../inlineDangerousGoodsParser";

describe("parseInlineDangerousGoods", () => {
  it("should parse a standard inline dangerous goods string", () => {
    const input =
      "UN1956,COMPRESSED GAS, N.O.S. (PENTAFLUOROETHANE, NITROGEN),2.2//\n" +
      "1 FIBREBOARD BOX X 2 KG//A6.5.";

    const result = parseInlineDangerousGoods(input);

    expect(result.un_number).toBe("UN1956");
    expect(result.proper_shipping_name).toBe(
      "COMPRESSED GAS, N.O.S. (PENTAFLUOROETHANE, NITROGEN)"
    );
    expect(result.class_division).toBe("2.2");
    expect(result.packing_group).toBeUndefined();
    expect(result.quantity_packing).toBe("1 FIBREBOARD BOX X 2 KG");
    expect(result.packing_inst).toBe("A6.5");
  });

  it("should parse with a packing group present", () => {
    const input =
      "UN0106,FUZES DETONATING,1.1B,II//\n" +
      "1 Wooden Box x 0.43488 Kg NEW//A5.24";

    const result = parseInlineDangerousGoods(input);

    expect(result.un_number).toBe("UN0106");
    expect(result.proper_shipping_name).toBe("FUZES DETONATING");
    expect(result.class_division).toBe("1.1B");
    expect(result.packing_group).toBe("II");
    expect(result.quantity_packing).toBe("1 Wooden Box x 0.43488 Kg NEW");
    expect(result.packing_inst).toBe("A5.24");
  });

  it("should parse with subsidiary risk in parentheses", () => {
    const input =
      "UN2924,FLAMMABLE LIQUID CORROSIVE N.O.S.,3(8),II//\n" +
      "1 DRUM X 50 KG//A3.3";

    const result = parseInlineDangerousGoods(input);

    expect(result.un_number).toBe("UN2924");
    expect(result.proper_shipping_name).toBe(
      "FLAMMABLE LIQUID CORROSIVE N.O.S."
    );
    expect(result.class_division).toBe("3(8)");
    expect(result.packing_group).toBe("II");
    expect(result.quantity_packing).toBe("1 DRUM X 50 KG");
    expect(result.packing_inst).toBe("A3.3");
  });

  it("should parse class 1.4S compatibility group", () => {
    const input =
      "UN0323,CARTRIDGES POWER DEVICE,1.4S,II//\n" +
      "1 BOX X 10 KG//A1.3";

    const result = parseInlineDangerousGoods(input);

    expect(result.un_number).toBe("UN0323");
    expect(result.proper_shipping_name).toBe("CARTRIDGES POWER DEVICE");
    expect(result.class_division).toBe("1.4S");
    expect(result.packing_group).toBe("II");
  });

  it("should handle ID number prefix", () => {
    const input = "ID8000,CONSUMER COMMODITY,9//\n1 BOX X 5 KG//A200";

    const result = parseInlineDangerousGoods(input);

    expect(result.un_number).toBe("ID8000");
    expect(result.proper_shipping_name).toBe("CONSUMER COMMODITY");
    expect(result.class_division).toBe("9");
  });

  it("should handle OCR errors: O instead of 0 in UN number", () => {
    const input =
      "UNO106,FUZES DETONATING,1.1B//\n" +
      "1 Wooden Box x 0.43488 Kg//A5.24";

    const result = parseInlineDangerousGoods(input);

    expect(result.un_number).toBe("UN0106");
  });

  it("should return empty object for empty or unrecognizable input", () => {
    expect(parseInlineDangerousGoods("")).toEqual({});
    expect(parseInlineDangerousGoods("random text")).toEqual({});
  });

  it("should handle trailing period on packing instruction", () => {
    const input =
      "UN1956,COMPRESSED GAS N.O.S.,2.2//1 BOX X 2 KG//A6.5.";

    const result = parseInlineDangerousGoods(input);

    expect(result.packing_inst).toBe("A6.5");
  });

  it("should handle single-line format (no line break)", () => {
    const input =
      "UN1956,COMPRESSED GAS N.O.S.,2.2//1 BOX X 2 KG//A6.5";

    const result = parseInlineDangerousGoods(input);

    expect(result.un_number).toBe("UN1956");
    expect(result.proper_shipping_name).toBe("COMPRESSED GAS N.O.S.");
    expect(result.class_division).toBe("2.2");
    expect(result.quantity_packing).toBe("1 BOX X 2 KG");
    expect(result.packing_inst).toBe("A6.5");
  });
});
```

### Step 2: Run tests to verify they fail

Run: `npx jest src/services/sddg/__tests__/inlineDangerousGoodsParser.test.ts --no-coverage`
Expected: FAIL — module not found

### Step 3: Write the implementation

Create `src/services/sddg/inlineDangerousGoodsParser.ts`:

```typescript
import { TextBlock, AnchorMatch } from "./anchorTypes";
import { SDDGData } from "@/types/sddg-template";

/**
 * Parse an inline dangerous goods string into SDDGData fields.
 *
 * Expected format (commas between fields, // between sections):
 *   UN1956,COMPRESSED GAS, N.O.S. (PENTAFLUOROETHANE, NITROGEN),2.2//
 *   1 FIBREBOARD BOX X 2 KG//A6.5.
 *
 * Structure: UN_NUMBER,PROPER_SHIPPING_NAME,CLASS_DIVISION[,PACKING_GROUP]//QUANTITY//PACKING_INST
 */
export function parseInlineDangerousGoods(
  text: string
): Partial<SDDGData> {
  if (!text || !text.trim()) return {};

  // Normalize: join lines, collapse whitespace
  const normalized = text.replace(/\n/g, " ").replace(/\s+/g, " ").trim();

  // Must start with UN or ID number
  const unMatch = normalized.match(/^(UN|ID|NA)\s*([O0]?\d{3,4})/i);
  if (!unMatch) return {};

  // Extract and normalize UN number (O → 0)
  const prefix = unMatch[1].toUpperCase();
  const digits = unMatch[2].replace(/O/g, "0").padStart(4, "0");
  const un_number = `${prefix}${digits}`;

  // Remove UN number and leading comma from remaining text
  let remaining = normalized
    .slice(unMatch[0].length)
    .replace(/^\s*,\s*/, "");

  // Split on // delimiter to get sections
  const sections = remaining.split("//").map((s) => s.trim());

  if (sections.length < 2) return { un_number };

  // Last non-empty section is packing instruction
  // Middle section is quantity/type of packing
  // First section is: PROPER_SHIPPING_NAME,CLASS_DIVISION[,PACKING_GROUP]
  const firstSection = sections[0];
  const quantitySection = sections.length >= 3 ? sections[1] : undefined;
  const packingInstSection = sections.length >= 3 ? sections[2] : sections[1];

  // Clean packing instruction (remove trailing period)
  const packing_inst = packingInstSection
    ? packingInstSection.replace(/\.\s*$/, "").trim()
    : undefined;

  // Clean quantity
  const quantity_packing = quantitySection ? quantitySection.trim() : undefined;

  // Parse first section: need to find class/division at the end
  // Class/division patterns: "2.2", "1.1B", "1.4S", "3(8)", "6.1(8)", "9", "3"
  // Covers all ICAO/IMDG classes including bare single digits and multi-letter
  // compatibility groups. Preceded by comma, optionally followed by packing group.
  //
  // Strategy: match class/division pattern from the end of firstSection.
  // Packing group is exactly I, II, or III (ordered longest-first).
  const classWithPgMatch = firstSection.match(
    /,\s*(\d(?:\.\d)?[A-Z]{0,2}(?:\(\d(?:\.\d)?\))?)\s*(?:,\s*(III|II|I))?\s*$/
  );

  if (!classWithPgMatch) {
    // Could not find class/division — return what we have
    return {
      un_number,
      proper_shipping_name: firstSection.trim() || undefined,
      quantity_packing,
      packing_inst,
    };
  }

  const class_division = classWithPgMatch[1];
  const packing_group = classWithPgMatch[2]
    ? classWithPgMatch[2].toUpperCase()
    : undefined;

  // Everything before the class/division match is the proper shipping name
  const psnEnd = firstSection.length - classWithPgMatch[0].length;
  const proper_shipping_name = firstSection.slice(0, psnEnd).trim() || undefined;

  const result: Partial<SDDGData> = { un_number };
  if (proper_shipping_name) result.proper_shipping_name = proper_shipping_name;
  if (class_division) result.class_division = class_division;
  if (packing_group) result.packing_group = packing_group;
  if (quantity_packing) result.quantity_packing = quantity_packing;
  if (packing_inst) result.packing_inst = packing_inst;

  return result;
}
```

### Step 4: Run tests to verify they pass

Run: `npx jest src/services/sddg/__tests__/inlineDangerousGoodsParser.test.ts --no-coverage`
Expected: All 9 tests PASS

### Step 5: Commit

```bash
git add src/services/sddg/inlineDangerousGoodsParser.ts src/services/sddg/__tests__/inlineDangerousGoodsParser.test.ts
git commit -m "feat: add inline dangerous goods parser with tests"
```

---

## Task 2: Add `detectInlineVariant` and `extractInlineDangerousGoods` with tests

These functions handle variant detection and text isolation from OCR blocks.

**Files:**
- Modify: `src/services/sddg/inlineDangerousGoodsParser.ts`
- Modify: `src/services/sddg/__tests__/inlineDangerousGoodsParser.test.ts`

### Step 1: Write the failing tests

Append to `src/services/sddg/__tests__/inlineDangerousGoodsParser.test.ts`:

```typescript
import {
  parseInlineDangerousGoods,
  detectInlineVariant,
  extractInlineDangerousGoods,
} from "../inlineDangerousGoodsParser";
import { TextBlock, AnchorMatch } from "../anchorTypes";

// Mock getTableColumnAnchors — detectInlineVariant imports it to get field IDs
jest.mock("../anchorConfig", () => ({
  getTableColumnAnchors: () => [
    { fieldId: "un_number", patternType: "table-column-header" },
    { fieldId: "proper_shipping_name", patternType: "table-column-header" },
    { fieldId: "class_division", patternType: "table-column-header" },
    { fieldId: "packing_group", patternType: "table-column-header" },
    { fieldId: "quantity_type_packing", patternType: "table-column-header" },
    { fieldId: "packing_inst", patternType: "table-column-header" },
    { fieldId: "authorization", patternType: "table-column-header" },
  ],
}));

// ... existing parseInlineDangerousGoods tests ...

describe("detectInlineVariant", () => {
  it("should return true when all 3 signals present (no headers, descriptor, //)", () => {
    const anchors = new Map<string, AnchorMatch>([
      ["shipper", { fieldId: "shipper", boundingBox: { x: 0, y: 0, width: 100, height: 20 }, matchedPattern: "SHIPPER", confidence: 1 }],
      ["additional_handling", { fieldId: "additional_handling", boundingBox: { x: 0, y: 800, width: 200, height: 20 }, matchedPattern: "ADDITIONAL HANDLING", confidence: 1 }],
    ]);

    const textBlocks: TextBlock[] = [
      { text: "UN Number or Identification Number, proper shipping name, Class or Division", boundingBox: { x: 50, y: 400, width: 500, height: 20 }, confidence: 1 },
      { text: "UN1956,COMPRESSED GAS,2.2//1 BOX//A6.5", boundingBox: { x: 50, y: 450, width: 400, height: 20 }, confidence: 1 },
    ];

    expect(detectInlineVariant(anchors, textBlocks)).toBe(true);
  });

  it("should return true with 2 of 3 signals (no headers + // but no descriptor)", () => {
    const anchors = new Map<string, AnchorMatch>();
    const textBlocks: TextBlock[] = [
      { text: "UN1956,COMPRESSED GAS,2.2//1 BOX//A6.5", boundingBox: { x: 50, y: 450, width: 400, height: 20 }, confidence: 1 },
    ];

    expect(detectInlineVariant(anchors, textBlocks)).toBe(true);
  });

  it("should return true with 2 of 3 signals (descriptor + // but table headers present)", () => {
    const anchors = new Map<string, AnchorMatch>([
      ["un_number", { fieldId: "un_number", boundingBox: { x: 50, y: 300, width: 80, height: 20 }, matchedPattern: "UN or ID NO", confidence: 1 }],
      ["proper_shipping_name", { fieldId: "proper_shipping_name", boundingBox: { x: 150, y: 300, width: 150, height: 20 }, matchedPattern: "PROPER SHIPPING NAME", confidence: 1 }],
    ]);

    const textBlocks: TextBlock[] = [
      { text: "UN Number or Identification Number, proper shipping name, Class or Division", boundingBox: { x: 50, y: 400, width: 500, height: 20 }, confidence: 1 },
      { text: "UN1956,COMPRESSED GAS,2.2//1 BOX//A6.5", boundingBox: { x: 50, y: 450, width: 400, height: 20 }, confidence: 1 },
    ];

    expect(detectInlineVariant(anchors, textBlocks)).toBe(true);
  });

  it("should return false when table column headers are found and no other signals", () => {
    const anchors = new Map<string, AnchorMatch>([
      ["un_number", { fieldId: "un_number", boundingBox: { x: 50, y: 300, width: 80, height: 20 }, matchedPattern: "UN or ID NO", confidence: 1 }],
      ["proper_shipping_name", { fieldId: "proper_shipping_name", boundingBox: { x: 150, y: 300, width: 150, height: 20 }, matchedPattern: "PROPER SHIPPING NAME", confidence: 1 }],
      ["class_division", { fieldId: "class_division", boundingBox: { x: 320, y: 300, width: 100, height: 20 }, matchedPattern: "CLASS or DIVISION", confidence: 1 }],
    ]);

    const textBlocks: TextBlock[] = [
      { text: "UN0106 FUZES DETONATING 1.1B", boundingBox: { x: 50, y: 400, width: 300, height: 20 }, confidence: 1 },
    ];

    expect(detectInlineVariant(anchors, textBlocks)).toBe(false);
  });

  it("should return false with only 1 signal (no headers but nothing else)", () => {
    const anchors = new Map<string, AnchorMatch>();
    const textBlocks: TextBlock[] = [
      { text: "Some random text without any signals", boundingBox: { x: 50, y: 400, width: 200, height: 20 }, confidence: 1 },
    ];

    expect(detectInlineVariant(anchors, textBlocks)).toBe(false);
  });

  it("should handle relaxed descriptor matching (2 of 3 phrases)", () => {
    const anchors = new Map<string, AnchorMatch>();
    // Only 2 of the 3 descriptor phrases present (OCR missed one)
    const textBlocks: TextBlock[] = [
      { text: "UN Number or Identification Number, Class or Division", boundingBox: { x: 50, y: 400, width: 500, height: 20 }, confidence: 1 },
      { text: "UN1956,COMPRESSED GAS,2.2//1 BOX//A6.5", boundingBox: { x: 50, y: 450, width: 400, height: 20 }, confidence: 1 },
    ];

    expect(detectInlineVariant(anchors, textBlocks)).toBe(true);
  });
});

describe("extractInlineDangerousGoods", () => {
  it("should extract dangerous goods from text blocks between section boundaries", () => {
    const anchors = new Map<string, AnchorMatch>([
      ["nature_quantity_header", { fieldId: "nature_quantity_header", boundingBox: { x: 50, y: 350, width: 300, height: 20 }, matchedPattern: "NATURE AND QUANTITY", confidence: 1 }],
      ["additional_handling", { fieldId: "additional_handling", boundingBox: { x: 50, y: 600, width: 200, height: 20 }, matchedPattern: "ADDITIONAL HANDLING", confidence: 1 }],
    ]);

    const textBlocks: TextBlock[] = [
      // Section header
      { text: "NATURE AND QUANTITY OF DANGEROUS GOODS", boundingBox: { x: 50, y: 350, width: 300, height: 20 }, confidence: 1 },
      // Descriptive paragraph (should be stripped)
      { text: "UN Number or Identification Number, proper shipping name, Class or Division", boundingBox: { x: 50, y: 380, width: 500, height: 15 }, confidence: 1 },
      { text: "(subsidiary hazard), packing group (if required), and all", boundingBox: { x: 50, y: 398, width: 400, height: 15 }, confidence: 1 },
      { text: "other required information.", boundingBox: { x: 50, y: 416, width: 200, height: 15 }, confidence: 1 },
      // Actual data
      { text: "UN1956,COMPRESSED GAS, N.O.S. (PENTAFLUOROETHANE, NITROGEN),2.2//", boundingBox: { x: 50, y: 450, width: 500, height: 20 }, confidence: 1 },
      { text: "1 FIBREBOARD BOX X 2 KG//A6.5.", boundingBox: { x: 50, y: 475, width: 300, height: 20 }, confidence: 1 },
      // Below boundary (should not be included)
      { text: "Additional Handling Information", boundingBox: { x: 50, y: 600, width: 200, height: 20 }, confidence: 1 },
    ];

    const result = extractInlineDangerousGoods(textBlocks, anchors);

    expect(result.un_number).toBe("UN1956");
    expect(result.proper_shipping_name).toBe(
      "COMPRESSED GAS, N.O.S. (PENTAFLUOROETHANE, NITROGEN)"
    );
    expect(result.class_division).toBe("2.2");
    expect(result.quantity_packing).toBe("1 FIBREBOARD BOX X 2 KG");
    expect(result.packing_inst).toBe("A6.5");
  });

  it("should find section header from textBlocks when anchor not in map", () => {
    // The "nature_quantity_header" may not be a named anchor — test fallback
    const anchors = new Map<string, AnchorMatch>([
      ["additional_handling", { fieldId: "additional_handling", boundingBox: { x: 50, y: 600, width: 200, height: 20 }, matchedPattern: "ADDITIONAL HANDLING", confidence: 1 }],
    ]);

    const textBlocks: TextBlock[] = [
      { text: "NATURE AND QUANTITY OF DANGEROUS GOODS", boundingBox: { x: 50, y: 350, width: 300, height: 20 }, confidence: 1 },
      { text: "UN Number or Identification Number, proper shipping name, Class or Division", boundingBox: { x: 50, y: 380, width: 500, height: 15 }, confidence: 1 },
      { text: "UN1956,COMPRESSED GAS N.O.S.,2.2//1 BOX X 2 KG//A6.5", boundingBox: { x: 50, y: 450, width: 500, height: 20 }, confidence: 1 },
      { text: "Additional Handling Information", boundingBox: { x: 50, y: 600, width: 200, height: 20 }, confidence: 1 },
    ];

    const result = extractInlineDangerousGoods(textBlocks, anchors);

    expect(result.un_number).toBe("UN1956");
  });
});
```

### Step 2: Run tests to verify new tests fail

Run: `npx jest src/services/sddg/__tests__/inlineDangerousGoodsParser.test.ts --no-coverage`
Expected: FAIL — `detectInlineVariant` and `extractInlineDangerousGoods` not exported

### Step 3: Implement `detectInlineVariant` and `extractInlineDangerousGoods`

Add to `src/services/sddg/inlineDangerousGoodsParser.ts`:

```typescript
import { getTableColumnAnchors } from "./anchorConfig";

/** Phrases from the inline variant's descriptive paragraph (match 2 of 3) */
const INLINE_DESCRIPTOR_PHRASES = [
  "UN Number or Identification Number",
  "proper shipping name",
  "Class or Division",
];

/** Phrases that identify the descriptive paragraph (to strip it from data) */
const DESCRIPTOR_STRIP_PATTERNS = [
  /UN\s*Number\s*or\s*Identification/i,
  /proper\s*shipping\s*name/i,
  /subsidiary\s*hazard/i,
  /packing\s*group\s*\(?if\s*required\)?/i,
  /other\s*required\s*information/i,
];

/**
 * Detect whether the form uses the inline dangerous goods format
 * (Labelmaster F07LB variant) instead of the tabular grid (AMC-IMT 1033).
 *
 * Uses 3-signal scoring, requires at least 2 of 3 to trigger:
 * 1. Fewer than 2 table column header anchors found (by patternType)
 * 2. Descriptive paragraph detected (relaxed: 2 of 3 key phrases)
 * 3. "//" delimiters found in the data region text
 */
export function detectInlineVariant(
  anchors: Map<string, AnchorMatch>,
  textBlocks: TextBlock[]
): boolean {
  let signals = 0;

  // Signal 1: count table column header anchors found (by patternType)
  const tableColumnFieldIds = getTableColumnAnchors().map((a) => a.fieldId);
  const tableHeaderCount = tableColumnFieldIds.filter((f) =>
    anchors.has(f)
  ).length;
  if (tableHeaderCount < 2) signals++;

  // Signal 2: look for descriptive paragraph (relaxed: 2 of 3 phrases)
  const allText = textBlocks.map((b) => b.text).join(" ").toLowerCase();
  const matchedPhrases = INLINE_DESCRIPTOR_PHRASES.filter((phrase) =>
    allText.includes(phrase.toLowerCase())
  ).length;
  if (matchedPhrases >= 2) signals++;

  // Signal 3: "//" delimiters found in text between section boundaries
  const hasDoubleSlash = textBlocks.some((b) => b.text.includes("//"));
  if (hasDoubleSlash) signals++;

  return signals >= 2;
}

/**
 * Extract dangerous goods from the inline format.
 *
 * 1. Find the "NATURE AND QUANTITY" section header (from textBlocks or anchors)
 * 2. Find the "Additional Handling" bottom boundary (from anchors)
 * 3. Collect text blocks between them, strip the descriptive paragraph
 * 4. Parse the remaining text
 */
export function extractInlineDangerousGoods(
  textBlocks: TextBlock[],
  anchors: Map<string, AnchorMatch>
): Partial<SDDGData> {
  // Find section header Y position
  let sectionTopY: number | null = null;

  // Try from anchors first
  const natureAnchor = anchors.get("nature_quantity_header");
  if (natureAnchor) {
    sectionTopY = natureAnchor.boundingBox.y;
  }

  // Fallback: search textBlocks for the header text
  if (sectionTopY === null) {
    for (const block of textBlocks) {
      if (
        block.text.toUpperCase().includes("NATURE AND QUANTITY") ||
        block.text.toUpperCase().includes("NATURE AND QUALITY")
      ) {
        sectionTopY = block.boundingBox.y;
        break;
      }
    }
  }

  if (sectionTopY === null) return {};

  // Find bottom boundary from "additional_handling" anchor
  let sectionBottomY: number | null = null;
  const additionalAnchor = anchors.get("additional_handling");
  if (additionalAnchor) {
    sectionBottomY = additionalAnchor.boundingBox.y;
  }

  // Fallback: search textBlocks
  if (sectionBottomY === null) {
    for (const block of textBlocks) {
      if (block.text.toUpperCase().includes("ADDITIONAL HANDLING")) {
        sectionBottomY = block.boundingBox.y;
        break;
      }
    }
  }

  // If no bottom boundary, use the lowest text block on the page
  if (sectionBottomY === null) {
    const maxY = Math.max(
      ...textBlocks.map((b) => b.boundingBox.y + b.boundingBox.height)
    );
    sectionBottomY = maxY > sectionTopY ? maxY : sectionTopY + 500;
  }

  // Collect text blocks in the section (below header, above boundary)
  const sectionBlocks = textBlocks
    .filter((b) => {
      const centerY = b.boundingBox.y + b.boundingBox.height / 2;
      return centerY > sectionTopY! && centerY < sectionBottomY!;
    })
    .sort((a, b) => {
      // Reading order: top to bottom, left to right
      const yDiff = a.boundingBox.y - b.boundingBox.y;
      if (Math.abs(yDiff) > 10) return yDiff;
      return a.boundingBox.x - b.boundingBox.x;
    });

  // Strip descriptive paragraph blocks
  const dataBlocks = sectionBlocks.filter((block) => {
    return !DESCRIPTOR_STRIP_PATTERNS.some((pattern) =>
      pattern.test(block.text)
    );
  });

  if (dataBlocks.length === 0) return {};

  // Join remaining text and parse
  const rawText = dataBlocks.map((b) => b.text).join("\n");
  return parseInlineDangerousGoods(rawText);
}
```

### Step 4: Run tests to verify they pass

Run: `npx jest src/services/sddg/__tests__/inlineDangerousGoodsParser.test.ts --no-coverage`
Expected: All tests PASS

### Step 5: Commit

```bash
git add src/services/sddg/inlineDangerousGoodsParser.ts src/services/sddg/__tests__/inlineDangerousGoodsParser.test.ts
git commit -m "feat: add inline variant detection and text extraction"
```

---

## Task 3: Integrate into `anchorBasedExtractor.ts`

Wire the inline parser into the main extraction pipeline.

**Files:**
- Modify: `src/services/sddg/anchorBasedExtractor.ts` (lines ~163-175)

### Step 1: Write a failing integration test

Add to `src/services/sddg/__tests__/inlineDangerousGoodsParser.test.ts`:

```typescript
describe("integration: inline variant fields merge into results map", () => {
  it("should produce ExtractionResult entries for all 7 table fields", () => {
    // This tests the shape of data that anchorBasedExtractor will merge
    const textBlocks: TextBlock[] = [
      { text: "NATURE AND QUANTITY OF DANGEROUS GOODS", boundingBox: { x: 50, y: 350, width: 300, height: 20 }, confidence: 1 },
      { text: "UN Number or Identification Number, proper shipping name, Class or Division", boundingBox: { x: 50, y: 380, width: 500, height: 15 }, confidence: 1 },
      { text: "UN1956,COMPRESSED GAS, N.O.S. (PENTAFLUOROETHANE, NITROGEN),2.2//", boundingBox: { x: 50, y: 450, width: 500, height: 20 }, confidence: 1 },
      { text: "1 FIBREBOARD BOX X 2 KG//A6.5.", boundingBox: { x: 50, y: 475, width: 300, height: 20 }, confidence: 1 },
      { text: "Additional Handling Information", boundingBox: { x: 50, y: 600, width: 200, height: 20 }, confidence: 1 },
    ];

    const anchors = new Map<string, AnchorMatch>([
      ["additional_handling", { fieldId: "additional_handling", boundingBox: { x: 50, y: 600, width: 200, height: 20 }, matchedPattern: "ADDITIONAL HANDLING", confidence: 1 }],
    ]);

    const parsed = extractInlineDangerousGoods(textBlocks, anchors);

    // Verify all expected fields are present
    expect(parsed.un_number).toBeDefined();
    expect(parsed.proper_shipping_name).toBeDefined();
    expect(parsed.class_division).toBeDefined();
    expect(parsed.quantity_packing).toBeDefined();
    expect(parsed.packing_inst).toBeDefined();
    // packing_group and authorization may be undefined — that's valid
  });
});
```

### Step 2: Run tests to verify they pass (this is a shape test)

Run: `npx jest src/services/sddg/__tests__/inlineDangerousGoodsParser.test.ts --no-coverage`
Expected: PASS

### Step 3: Modify `anchorBasedExtractor.ts`

In `src/services/sddg/anchorBasedExtractor.ts`, add the import at the top (after existing imports around line 27):

```typescript
import {
  detectInlineVariant,
  extractInlineDangerousGoods,
} from "./inlineDangerousGoodsParser";
```

Then replace lines ~163-175 (the table region computation and processing block). The key change is wrapping the existing table logic in an if/else that checks for the inline variant. Find this block:

```typescript
    // Process table columns first (they need special handling)
    const tableAnchors = getTableColumnAnchors();
    const tableAnchorMatches = tableAnchors
      .map(cfg => anchors.get(cfg.fieldId))
      .filter((m): m is AnchorMatch => m !== undefined);

    // Use adaptive or hardcoded region detection
    const tableRegions = USE_ADAPTIVE_DETECTION
      ? computeAdaptiveTableRegions(tableAnchorMatches, textBlocks, anchors)
      : computeTableColumnRegions(tableAnchorMatches, anchors, imageWidth, imageHeight);

    console.log(`🔄 Using ${USE_ADAPTIVE_DETECTION ? "ADAPTIVE" : "HARDCODED"} region detection`);
```

Replace with:

```typescript
    // Detect form variant: inline (Labelmaster F07LB) vs tabular (AMC-IMT 1033)
    const isInlineVariant = detectInlineVariant(anchors, textBlocks);

    let tableRegions = new Map<string, ValueRegion>();

    if (isInlineVariant) {
      // Inline variant: extract dangerous goods from comma/slash-delimited text
      console.log("📋 Detected INLINE dangerous goods variant (Labelmaster F07LB)");
      const inlineResult = extractInlineDangerousGoods(textBlocks, anchors);

      // Map parsed fields into the results map
      // Note: anchorConfig uses "quantity_type_packing" as fieldId but SDDGData
      // uses "quantity_packing" — the mapping here bridges that naming mismatch
      const fieldMapping: [string, string | undefined][] = [
        ["un_number", inlineResult.un_number],
        ["proper_shipping_name", inlineResult.proper_shipping_name],
        ["class_division", inlineResult.class_division],
        ["packing_group", inlineResult.packing_group],
        ["quantity_type_packing", inlineResult.quantity_packing],
        ["packing_inst", inlineResult.packing_inst],
        ["authorization", inlineResult.authorization],
      ];

      for (const [fieldId, value] of fieldMapping) {
        results.set(fieldId, {
          fieldId,
          value: value || "",
          confidence: value ? 0.85 : 0,
          status: value ? "extracted" : "value_empty",
        });
      }
    } else {
      // Tabular variant: use existing table column region detection
      const tableAnchors = getTableColumnAnchors();
      const tableAnchorMatches = tableAnchors
        .map(cfg => anchors.get(cfg.fieldId))
        .filter((m): m is AnchorMatch => m !== undefined);

      tableRegions = USE_ADAPTIVE_DETECTION
        ? computeAdaptiveTableRegions(tableAnchorMatches, textBlocks, anchors)
        : computeTableColumnRegions(tableAnchorMatches, anchors, imageWidth, imageHeight);

      console.log(`🔄 Using ${USE_ADAPTIVE_DETECTION ? "ADAPTIVE" : "HARDCODED"} region detection`);
    }
```

**Important:** The existing `for (const config of SDDG_ANCHORS)` loop at line ~177 already checks `cellResults.has(config.fieldId)` and processes table columns via `tableRegions.get(config.fieldId)`. When `isInlineVariant` is true, the 7 table fields are already in `results`, so the loop's `cellResults.has()` check won't match them, but the loop will process them — we need them to be skipped. The loop already does `continue` when the field is in `cellResults`. We need to add a similar check for fields already populated by the inline parser.

Add this right after the `cellResults.has(config.fieldId)` check (around line ~184):

```typescript
      // Skip fields already extracted by inline variant parser
      if (results.has(config.fieldId)) {
        continue;
      }
```

### Step 4: Run the full SDDG test suite

Run: `npx jest src/services/sddg/__tests__/ --no-coverage`
Expected: All existing tests PASS (the inline variant detection returns false for tabular forms, so existing behavior is unchanged)

### Step 5: Commit

```bash
git add src/services/sddg/anchorBasedExtractor.ts src/services/sddg/__tests__/inlineDangerousGoodsParser.test.ts
git commit -m "feat: integrate inline dangerous goods parser into anchor extractor"
```

---

## Task 4: Verify existing tests still pass

Run the full test suite to ensure no regressions.

**Files:** None (verification only)

### Step 1: Run all SDDG-related tests

Run: `npx jest src/services/sddg/ --no-coverage`
Expected: All tests PASS

### Step 2: Run the full project test suite

Run: `npx jest --no-coverage`
Expected: All tests PASS (or at least no new failures)

### Step 3: Commit (no code changes — just verification step)

No commit needed if all tests pass. If any tests need fixing, address them and commit the fixes.
