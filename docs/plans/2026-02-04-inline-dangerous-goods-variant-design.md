# Inline Dangerous Goods Form Variant — Design

## Problem

The SDDG extraction pipeline currently supports only the AMC-IMT 1033 form, which has a tabular grid layout for the "Nature and Quantity of Dangerous Goods" section with 7 distinct columns. A variant form (Labelmaster F07LB) uses a comma-delimited inline format instead of a table, with `//` delimiters separating certain fields. The data wraps across lines. Example:

```
UN1956,COMPRESSED GAS, N.O.S. (PENTAFLUOROETHANE, NITROGEN),2.2//
1 FIBREBOARD BOX X 2 KG//A6.5.
```

The app needs to auto-detect and parse this variant.

## Approach

### Variant Detection

After OCR + anchor detection in `anchorBasedExtractor.ts`, check two signals:

1. **Fewer than 2 table column headers found** — The 7 `patternType: "table-column-header"` anchors (`un_number`, `proper_shipping_name`, `class_division`, etc.) won't be present on the inline variant since there are no column headers.
2. **Descriptive paragraph detected** — The inline variant has a paragraph describing the field order: "UN Number or Identification Number, proper shipping name, Class or Division...". This text is unique to the inline variant.

If both signals match, route to the inline parser instead of `computeAdaptiveTableRegions`.

Upper fields (Shipper, Consignee, Air Waybill, etc.) are extracted as normal — those sections are structurally similar on both forms.

### Text Isolation

1. Find the "NATURE AND QUANTITY OF DANGEROUS GOODS" text block (section header, exists on both variants).
2. Find the "Additional Handling" text block below (bottom boundary).
3. Collect all ML Kit text blocks between these two Y-coordinate boundaries, sorted in reading order.
4. Strip the descriptive paragraph by matching against known header phrases.
5. The remaining text is the raw inline dangerous goods string.

### Inline Parsing

`parseInlineDangerousGoods(text: string): Partial<SDDGData>` parses left-to-right using structural patterns:

1. **UN number** — Match `UN\d{4}` or `ID\d{4}` at the start. Remove from remaining text.
2. **Split on `//` delimiter** — Working from the end:
   - Last segment: packing instruction (e.g., `A6.5`)
   - Middle segment: quantity and type of packing (e.g., `1 FIBREBOARD BOX X 2 KG`)
   - Prefix: everything before the first `//`
3. **Class/division** — From the prefix, find the class/division pattern at the end (e.g., `2.2`, `1.1B`, `6.1(8)`). Regex: `\d\.\d[A-Z]?(\(\d(\.\d)?\))?`
4. **Proper shipping name** — Everything between the UN number and class/division, including parenthetical technical names.
5. **Packing group** — If present, a Roman numeral (I, II, III) between class/division and the first `//`. Not all materials have packing groups.

Existing post-processing rules (`extract_un_number`, `validate_packing_group`, `clean_quantity`) are applied to clean values.

## File Changes

### New file: `src/services/sddg/inlineDangerousGoodsParser.ts`

- `detectInlineVariant(anchors, textBlocks)` — Returns `true` if inline variant detected
- `extractInlineDangerousGoods(textBlocks, anchors)` — Locates and extracts inline text, calls parser
- `parseInlineDangerousGoods(text: string): Partial<SDDGData>` — Left-to-right parser

### Modified file: `src/services/sddg/anchorBasedExtractor.ts`

- After anchor detection, call `detectInlineVariant()`
- If inline: call `extractInlineDangerousGoods()`, merge results into extraction map for the 7 table fields
- If not inline: proceed with existing `computeAdaptiveTableRegions` flow

### No changes needed

- `SDDGData` type — same flat fields
- `cellBasedExtraction.ts` — table columns already skipped
- `anchorConfig.ts` — existing anchors used for upper fields and boundaries
- Downstream consumers — same `SDDGData` shape

### New test file: `src/services/sddg/__tests__/inlineDangerousGoodsParser.test.ts`

- Unit tests for `parseInlineDangerousGoods` with known inline format
- Unit tests for `detectInlineVariant` with both form types
- Integration-style test for `extractInlineDangerousGoods` with mock text blocks
