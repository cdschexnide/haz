# Inline Parser Bugfix — Subsidiary Risk, OVERPACK, Multi-Section

## Problem

Real-world input `UN1072,OXYGEN, COMPRESSED,2.2,(5.1)//1 STEEL CYLINDER (DOT-3AA) X 2.72 KG//A6.5.//OVERPACK USED` exposes three parser bugs:

1. **Subsidiary risk as separate comma field** — `2.2,(5.1)` is not matched by the regex which expects subsidiary risk glued to the class number like `2.2(5.1)`. Result: `proper_shipping_name` incorrectly includes `2.2, (5.1)`.
2. **More than 3 `//` sections** — Input has 4 sections. Code assumes max 3, so `OVERPACK USED` is dropped.
3. **OVERPACK text should be appended to quantity** — `OVERPACK USED` belongs in the `quantity_packing` field.

Additionally, `subsidiary_risk` is not plumbed through the extraction pipeline — `mapToHazproFormat` hardcodes it to `""`.

## Fix: Parser Changes

### Whitespace normalization

Before regex matching, normalize whitespace around parentheses to handle OCR artifacts like `2.2 (5.1)` or `2.2 ( 5.1 )`:

```typescript
text.replace(/\(\s+/g, "(").replace(/\s+\)/g, ")")
```

### Regex

Old:
```
/,\s*(\d(?:\.\d)?[A-Z]{0,2}(?:\(\d(?:\.\d)?\))?)\s*(?:,\s*(III|II|I))?\s*$/
```

New (subsidiary risk as separate capture group, supports both glued `3(8)` and comma-separated `2.2,(5.1)`):
```
/,\s*(\d(?:\.\d)?[A-Z]{0,2})(?:(\(\d(?:\.\d)?\))|\s*,\s*(\(\d(?:\.\d)?\)))?\s*(?:,\s*(III|II|I))?\s*$/
```

Capture groups:
1. Class/division: `2.2`
2. Subsidiary risk glued: `(8)` from `3(8)` — or undefined
3. Subsidiary risk comma-separated: `(5.1)` from `2.2,(5.1)` — or undefined
4. Packing group: `II` (or undefined)

Result: `subsidiary_risk = group2 || group3 || undefined`

### Section handling

Instead of assuming exactly 3 `//` sections:
- Section 0: `firstSection` (PSN + class + subsidiary + packing group)
- Packing instruction: identified by explicit pattern `/^A\d+\.\d+\.?$/` (all AFMAN packing instructions are A-prefixed)
- Sections containing `OVERPACK`: appended to quantity
- Remaining middle sections: quantity

### New output field

`parseInlineDangerousGoods` returns `subsidiary_risk` as a new field on `Partial<SDDGData>`.

### Subsidiary risk splitting for table-based forms

`convertToSDDGData` (the common exit point for both table and inline paths) splits subsidiary risk from `class_division` if present. For table-based forms, the column "Class or Division (SUBSIDIARY RISK)" puts everything into `class_division` (e.g., `"2.2 (5.1)"`). The split regex extracts the trailing parenthesized value:

```typescript
const subMatch = rawClass.match(/\s*(\(\d(?:\.\d)?\))\s*$/);
```

This ensures both table-based and inline forms populate `subsidiary_risk` consistently.

## Fix: Plumbing Changes

1. **`src/types/sddg-template.ts`** — Add `subsidiary_risk?: string` to `SDDGData`
2. **`src/services/sddg/inlineDangerousGoodsParser.ts`** — Parser regex + section logic + return `subsidiary_risk`
3. **`src/services/sddg/anchorBasedExtractor.ts`** — Add `subsidiary_risk` to `convertToSDDGData` and inline `fieldMapping`
4. **`src/screens/SDDG/SDDGProcessingScreen.tsx`** — Change `subsidiaryRisk: ""` to `subsidiaryRisk: sddgData.subsidiary_risk || ""`
5. **`src/components/Inspector/InteractiveSDDGForm.tsx`** — Combine `hazardClass` and `subsidiaryRisk` for display in Class or Division cell
