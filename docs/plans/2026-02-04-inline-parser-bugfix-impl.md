# Inline Parser Bugfix Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix three parser bugs (subsidiary risk parsing, 4+ section handling, OVERPACK appending) and plumb `subsidiary_risk` through the extraction pipeline to the UI.

**Architecture:** Update the regex in `parseInlineDangerousGoods` to capture subsidiary risk as a separate comma-delimited field. Rework `//`-section handling to support 4+ sections and append OVERPACK text to quantity. Add `subsidiary_risk` field to `SDDGData`, thread it through `convertToSDDGData`, `mapToHazproFormat`, and the `InteractiveSDDGForm` display.

**Tech Stack:** TypeScript, Jest (jest-expo preset), React Native

**Design doc:** `docs/plans/2026-02-04-inline-parser-bugfix-design.md`

---

## Task 1: Fix parser regex and section handling with tests (TDD)

**Files:**
- Modify: `src/services/sddg/__tests__/inlineDangerousGoodsParser.test.ts`
- Modify: `src/services/sddg/inlineDangerousGoodsParser.ts`

### Step 1: Update existing tests and add new failing tests

In `src/services/sddg/__tests__/inlineDangerousGoodsParser.test.ts`, the existing test "should parse with subsidiary risk in parentheses" (line 54) tests `3(8)` glued to the class. That test should still pass (backward compatible). Add new tests after line 129 (before the closing `});` of the `parseInlineDangerousGoods` describe block):

```typescript
  it("should parse subsidiary risk as separate comma field", () => {
    const input =
      "UN1072,OXYGEN, COMPRESSED,2.2,(5.1)//\n" +
      "1 STEEL CYLINDER (DOT-3AA) X 2.72 KG//A6.5.//OVERPACK USED";

    const result = parseInlineDangerousGoods(input);

    expect(result.un_number).toBe("UN1072");
    expect(result.proper_shipping_name).toBe("OXYGEN, COMPRESSED");
    expect(result.class_division).toBe("2.2");
    expect(result.subsidiary_risk).toBe("(5.1)");
    expect(result.packing_group).toBeUndefined();
    expect(result.quantity_packing).toBe(
      "1 STEEL CYLINDER (DOT-3AA) X 2.72 KG OVERPACK USED"
    );
    expect(result.packing_inst).toBe("A6.5");
  });

  it("should handle 4+ sections with OVERPACK appended to quantity", () => {
    const input =
      "UN1956,COMPRESSED GAS N.O.S.,2.2//\n" +
      "1 BOX X 2 KG//A6.5//OVERPACK USED";

    const result = parseInlineDangerousGoods(input);

    expect(result.quantity_packing).toBe("1 BOX X 2 KG OVERPACK USED");
    expect(result.packing_inst).toBe("A6.5");
  });

  it("should handle subsidiary risk with packing group", () => {
    const input =
      "UN2924,FLAMMABLE LIQUID CORROSIVE N.O.S.,3,(8),II//\n" +
      "1 DRUM X 50 KG//A3.3";

    const result = parseInlineDangerousGoods(input);

    expect(result.un_number).toBe("UN2924");
    expect(result.proper_shipping_name).toBe(
      "FLAMMABLE LIQUID CORROSIVE N.O.S."
    );
    expect(result.class_division).toBe("3");
    expect(result.subsidiary_risk).toBe("(8)");
    expect(result.packing_group).toBe("II");
    expect(result.quantity_packing).toBe("1 DRUM X 50 KG");
    expect(result.packing_inst).toBe("A3.3");
  });

  it("should still handle subsidiary risk glued to class (backward compat)", () => {
    const input =
      "UN2924,FLAMMABLE LIQUID CORROSIVE N.O.S.,3(8),II//\n" +
      "1 DRUM X 50 KG//A3.3";

    const result = parseInlineDangerousGoods(input);

    expect(result.class_division).toBe("3");
    expect(result.subsidiary_risk).toBe("(8)");
    expect(result.packing_group).toBe("II");
  });
```

Also update the existing test "should parse with subsidiary risk in parentheses" (line 54) to expect the new separate fields:

Replace:
```typescript
    expect(result.class_division).toBe("3(8)");
```

With:
```typescript
    expect(result.class_division).toBe("3");
    expect(result.subsidiary_risk).toBe("(8)");
```

### Step 2: Run tests to verify new tests fail

Run: `npx jest src/services/sddg/__tests__/inlineDangerousGoodsParser.test.ts --no-coverage`
Expected: FAIL — `subsidiary_risk` is not on the result, and OVERPACK test fails

### Step 3: Update the parser implementation

Replace the entire `parseInlineDangerousGoods` function in `src/services/sddg/inlineDangerousGoodsParser.ts` (lines 32-112) with:

```typescript
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
  const remaining = normalized
    .slice(unMatch[0].length)
    .replace(/^\s*,\s*/, "");

  // Split on // delimiter to get sections
  const sections = remaining.split("//").map((s) => s.trim()).filter((s) => s.length > 0);

  if (sections.length < 2) return { un_number };

  // Section 0: PROPER_SHIPPING_NAME,CLASS_DIVISION[,(SUBSIDIARY)][,PACKING_GROUP]
  const firstSection = sections[0];

  // Remaining sections (1+): identify packing instruction, OVERPACK, and quantity
  const remainingSections = sections.slice(1);

  // Find packing instruction: matches pattern like "A6.5", "A200", "A5.24"
  let packing_inst: string | undefined;
  let packingInstIdx = -1;
  for (let i = 0; i < remainingSections.length; i++) {
    const cleaned = remainingSections[i].replace(/\.\s*$/, "").trim();
    if (/^[A-Z]?\d/.test(cleaned) && !(/^OVERPACK/i.test(cleaned)) && !(/^\d+\s+(STEEL|FIBRE|WOOD|BOX|DRUM|CYLINDER|JERRICAN|BAG)/i.test(cleaned))) {
      packing_inst = cleaned;
      packingInstIdx = i;
      break;
    }
  }

  // Collect quantity parts and OVERPACK parts
  const quantityParts: string[] = [];
  for (let i = 0; i < remainingSections.length; i++) {
    if (i === packingInstIdx) continue;
    const section = remainingSections[i];
    // OVERPACK text gets appended to quantity
    if (/OVERPACK/i.test(section)) {
      quantityParts.push(section);
    } else if (packing_inst === undefined || i < packingInstIdx) {
      // Sections before packing instruction are quantity
      quantityParts.push(section);
    }
  }
  const quantity_packing = quantityParts.length > 0
    ? quantityParts.join(" ").trim()
    : undefined;

  // Parse first section: find class/division, optional subsidiary risk, optional packing group
  // New regex: class/division is a bare number, subsidiary risk is separate comma + parens
  // Also handles backward-compat glued format like 3(8)
  const classWithPgMatch = firstSection.match(
    /,\s*(\d(?:\.\d)?[A-Z]{0,2})(?:(\(\d(?:\.\d)?\))|\s*,\s*(\(\d(?:\.\d)?\)))?\s*(?:,\s*(III|II|I))?\s*$/
  );

  if (!classWithPgMatch) {
    return {
      un_number,
      proper_shipping_name: firstSection.trim() || undefined,
      quantity_packing,
      packing_inst,
    };
  }

  const class_division = classWithPgMatch[1];
  // Subsidiary risk: capture group 2 (glued) or capture group 3 (comma-separated)
  const subsidiary_risk = classWithPgMatch[2] || classWithPgMatch[3] || undefined;
  const packing_group = classWithPgMatch[4]
    ? classWithPgMatch[4].toUpperCase()
    : undefined;

  // Everything before the class/division match is the proper shipping name
  const psnEnd = firstSection.length - classWithPgMatch[0].length;
  const proper_shipping_name = firstSection.slice(0, psnEnd).trim() || undefined;

  const result: Partial<SDDGData> = { un_number };
  if (proper_shipping_name) result.proper_shipping_name = proper_shipping_name;
  if (class_division) result.class_division = class_division;
  if (subsidiary_risk) result.subsidiary_risk = subsidiary_risk;
  if (packing_group) result.packing_group = packing_group;
  if (quantity_packing) result.quantity_packing = quantity_packing;
  if (packing_inst) result.packing_inst = packing_inst;

  return result;
}
```

### Step 4: Run tests to verify they pass

Run: `npx jest src/services/sddg/__tests__/inlineDangerousGoodsParser.test.ts --no-coverage`
Expected: All tests PASS (including the old tests — the existing "subsidiary risk in parentheses" test was updated in Step 1)

### Step 5: Commit

```bash
git add src/services/sddg/inlineDangerousGoodsParser.ts src/services/sddg/__tests__/inlineDangerousGoodsParser.test.ts
git commit -m "fix: parse subsidiary risk, OVERPACK, and 4+ sections in inline parser"
```

---

## Task 2: Add `subsidiary_risk` to `SDDGData` type

**Files:**
- Modify: `src/types/sddg-template.ts`

### Step 1: Add the field

In `src/types/sddg-template.ts`, find this block (around line 120-127):

```typescript
  // Dangerous Goods (single row extraction)
  un_number?: string;
  proper_shipping_name?: string;
  class_division?: string;
  packing_group?: string;
```

Add `subsidiary_risk` after `class_division`:

```typescript
  // Dangerous Goods (single row extraction)
  un_number?: string;
  proper_shipping_name?: string;
  class_division?: string;
  subsidiary_risk?: string;
  packing_group?: string;
```

### Step 2: Run tests to verify nothing breaks

Run: `npx jest src/services/sddg/__tests__/inlineDangerousGoodsParser.test.ts --no-coverage`
Expected: All tests PASS (adding an optional field is backward-compatible)

### Step 3: Commit

```bash
git add src/types/sddg-template.ts
git commit -m "feat: add subsidiary_risk field to SDDGData type"
```

---

## Task 3: Thread `subsidiary_risk` through extraction pipeline

**Files:**
- Modify: `src/services/sddg/anchorBasedExtractor.ts`
- Modify: `src/screens/SDDG/SDDGProcessingScreen.tsx`

### Step 1: Update `convertToSDDGData` in `anchorBasedExtractor.ts`

In `src/services/sddg/anchorBasedExtractor.ts`, find the dangerous goods block in `convertToSDDGData` (around line 398-405):

```typescript
    // Dangerous goods table
    un_number: get("un_number"),
    proper_shipping_name: get("proper_shipping_name"),
    class_division: get("class_division"),
    packing_group: get("packing_group"),
```

Add `subsidiary_risk` after `class_division`:

```typescript
    // Dangerous goods table
    un_number: get("un_number"),
    proper_shipping_name: get("proper_shipping_name"),
    class_division: get("class_division"),
    subsidiary_risk: get("subsidiary_risk"),
    packing_group: get("packing_group"),
```

### Step 2: Add `subsidiary_risk` to the inline fieldMapping

In the same file, find the `fieldMapping` array (around line 180-188):

```typescript
      const fieldMapping: [string, string | undefined][] = [
        ["un_number", inlineResult.un_number],
        ["proper_shipping_name", inlineResult.proper_shipping_name],
        ["class_division", inlineResult.class_division],
        ["packing_group", inlineResult.packing_group],
```

Add `subsidiary_risk` after `class_division`:

```typescript
      const fieldMapping: [string, string | undefined][] = [
        ["un_number", inlineResult.un_number],
        ["proper_shipping_name", inlineResult.proper_shipping_name],
        ["class_division", inlineResult.class_division],
        ["subsidiary_risk", inlineResult.subsidiary_risk],
        ["packing_group", inlineResult.packing_group],
```

### Step 3: Update `mapToHazproFormat` in `SDDGProcessingScreen.tsx`

In `src/screens/SDDG/SDDGProcessingScreen.tsx`, find line 68:

```typescript
    // Key 14: Subsidiary Risk (not in SddgOCR template - leave blank)
    subsidiaryRisk: "",
```

Replace with:

```typescript
    // Key 14: Subsidiary Risk
    subsidiaryRisk: sddgData.subsidiary_risk || "",
```

### Step 4: Run tests

Run: `npx jest src/services/sddg/__tests__/ --no-coverage`
Expected: All inline parser tests PASS, no regressions

### Step 5: Commit

```bash
git add src/services/sddg/anchorBasedExtractor.ts src/screens/SDDG/SDDGProcessingScreen.tsx
git commit -m "feat: thread subsidiary_risk through extraction pipeline to UI"
```

---

## Task 4: Display combined class/division + subsidiary risk in InteractiveSDDGForm

**Files:**
- Modify: `src/components/Inspector/InteractiveSDDGForm.tsx`

### Step 1: Update the hazardClass cell value

In `src/components/Inspector/InteractiveSDDGForm.tsx`, find the hazardClass field definition (around line 535-539):

```typescript
              {
                key: "hazardClass",
                label: "CLASS or DIVISION (Key 13)",
                value: hazmat.hazardClass || "",
              },
```

Replace with:

```typescript
              {
                key: "hazardClass",
                label: "CLASS or DIVISION (Key 13)",
                value: [hazmat.hazardClass, hazmat.subsidiaryRisk]
                  .filter(Boolean)
                  .join(" ") || "",
              },
```

This renders `"2.2 (5.1)"` when both are present, `"2.2"` when only class is present, and `""` when neither is present.

### Step 2: Run the full test suite

Run: `npx jest --no-coverage`
Expected: All tests PASS (or no new failures beyond pre-existing ones)

### Step 3: Commit

```bash
git add src/components/Inspector/InteractiveSDDGForm.tsx
git commit -m "feat: display subsidiary risk alongside class/division in SDDG form"
```

---

## Task 5: Verify all tests pass

**Files:** None (verification only)

### Step 1: Run all SDDG tests

Run: `npx jest src/services/sddg/__tests__/ --no-coverage`
Expected: All tests PASS (pre-existing failures in anchorDetection, regionInference, anchorBasedExtractor are acceptable)

### Step 2: Run full test suite

Run: `npx jest --no-coverage`
Expected: No new failures
