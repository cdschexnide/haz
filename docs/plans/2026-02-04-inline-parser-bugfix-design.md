# Inline Parser Bugfix — Subsidiary Risk, OVERPACK, Multi-Section

## Problem

Real-world input `UN1072,OXYGEN, COMPRESSED,2.2,(5.1)//1 STEEL CYLINDER (DOT-3AA) X 2.72 KG//A6.5.//OVERPACK USED` exposes three parser bugs:

1. **Subsidiary risk as separate comma field** — `2.2,(5.1)` is not matched by the regex which expects subsidiary risk glued to the class number like `2.2(5.1)`. Result: `proper_shipping_name` incorrectly includes `2.2, (5.1)`.
2. **More than 3 `//` sections** — Input has 4 sections. Code assumes max 3, so `OVERPACK USED` is dropped.
3. **OVERPACK text should be appended to quantity** — `OVERPACK USED` belongs in the `quantity_packing` field.

Additionally, `subsidiary_risk` is not plumbed through the extraction pipeline — `mapToHazproFormat` hardcodes it to `""`.

## Fix: Parser Changes

### Regex

Old:
```
/,\s*(\d(?:\.\d)?[A-Z]{0,2}(?:\(\d(?:\.\d)?\))?)\s*(?:,\s*(III|II|I))?\s*$/
```

New (subsidiary risk as separate capture group after comma):
```
/,\s*(\d(?:\.\d)?[A-Z]{0,2})\s*(?:,\s*(\(\d(?:\.\d)?\)))?\s*(?:,\s*(III|II|I))?\s*$/
```

Capture groups:
1. Class/division: `2.2`
2. Subsidiary risk: `(5.1)` (with parens, or undefined)
3. Packing group: `II` (or undefined)

### Section handling

Instead of assuming exactly 3 `//` sections:
- Section 0: `firstSection` (PSN + class + subsidiary + packing group)
- Last section matching `/^[A-Z]?\d/`: packing instruction
- Sections containing `OVERPACK`: appended to quantity
- Remaining middle sections: quantity

### New output field

`parseInlineDangerousGoods` returns `subsidiary_risk` as a new field on `Partial<SDDGData>`.

## Fix: Plumbing Changes

1. **`src/types/sddg-template.ts`** — Add `subsidiary_risk?: string` to `SDDGData`
2. **`src/services/sddg/inlineDangerousGoodsParser.ts`** — Parser regex + section logic + return `subsidiary_risk`
3. **`src/services/sddg/anchorBasedExtractor.ts`** — Add `subsidiary_risk` to `convertToSDDGData` and inline `fieldMapping`
4. **`src/screens/SDDG/SDDGProcessingScreen.tsx`** — Change `subsidiaryRisk: ""` to `subsidiaryRisk: sddgData.subsidiary_risk || ""`
5. **`src/components/Inspector/InteractiveSDDGForm.tsx`** — Combine `hazardClass` and `subsidiaryRisk` for display in Class or Division cell
