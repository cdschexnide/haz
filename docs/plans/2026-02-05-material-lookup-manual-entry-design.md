# Material Lookup for SDDG Manual Entry

**Date:** 2026-02-05
**Status:** Design approved, ready for implementation
**Revision:** 2 — addresses code review findings (dedup bug, Submit UX, normalization, fallback)

---

## Problem

When an inspector uses Manual Entry for the SDDG form, they must type every field in the NATURE AND QUANTITY OF DANGEROUS GOODS section by hand. This is slow, error-prone, and unnecessary — the hazardous materials database already contains the correct values for each UN/NA/ID number.

## Solution

Replace the plain text input for the UN or ID No. cell with a specialized lookup modal. The inspector types a 4-digit number, submits, selects the material, and all other fields auto-populate from the database.

---

## UX Flow

### Step 1: Prefix + Typeahead + Submit

When the user taps the "UN or ID No." cell in the NATURE AND QUANTITY table, a `MaterialLookupModal` opens instead of the `SimpleFieldEditModal`.

The modal shows:
1. **Segmented control** with three options: `UN | NA | ID` (defaults to `UN`)
2. **Numeric text input** (`keyboardType="number-pad"`) with placeholder "Enter 4-digit number..."
3. **Typeahead dropdown** that appears as the user types, providing visual feedback of matching UNIDs
4. **Submit button** that the user presses to proceed (no auto-select on typing)

The typeahead filters `hazardousMaterialsList` using `prefix + digits` (e.g., typing "1950" with prefix "UN" matches `unid === "UN1950"`). Results are **deduplicated by UNID** — UN1950 appears once even though 19 entries exist. Each typeahead row shows:
- The full UNID (e.g., "UN1950")
- The PSN of the first non-FORBIDDEN match as a subtitle (e.g., "AEROSOLS, FLAMMABLE")

UNIDs where **all** entries are FORBIDDEN are excluded from the typeahead entirely. Only UNIDs with at least one non-FORBIDDEN material appear.

FORBIDDEN materials (those with `packagingParagraph === "FORBIDDEN"`) are excluded from typeahead subtitles and from the detail picker.

The user can proceed by either:
- **Tapping a typeahead result** — resolves that UNID
- **Pressing the Submit button** — resolves `prefix + digits` as the full UNID

Both actions trigger the same resolution logic (Step 2a or 2b below). The user is free to type digits, toggle the prefix, and adjust before submitting — nothing auto-fires.

### Step 2a: Single Match

If only one non-FORBIDDEN material exists for the resolved UNID (e.g., UN1088), the modal auto-populates all fields and closes immediately.

### Step 2b: Multiple Matches

If multiple non-FORBIDDEN materials exist (e.g., UN1950), the modal transitions to a **detail table view**:

- **Back button** to return to the typeahead search
- **Header** showing the selected UNID and count of available materials
- **Scrollable table** with columns:
  - PSN/Description (`properShippingName` + `details` if present)
  - Hazard Class/Div (`hazclassDiv`)
  - Subsidiary Risk (`subsidiaryRisk`)
  - Packing Group (`packingGroup`)
  - Special Provision (`specialProvision`)
  - Packaging Paragraph (`packagingParagraph`)
- Tapping a row selects it, auto-populates all fields, and closes the modal

---

## Field Auto-Population Mapping

When a `HazardousMaterialItem` is selected, these `ExtractedSDDGContent` fields are updated. All values are normalized to empty string (`""`) if undefined or missing in the source material, ensuring cells display "Tap..." for unfilled fields.

| ExtractedSDDGContent field | Source | Example (UN1088) | Example (UN1072) |
|---|---|---|---|
| `unIdNo` | `material.unid` | `"UN1088"` | `"UN1072"` |
| `properShippingName` | `material.properShippingName` (+ `, ${material.details}` if details exists) | `"ACETAL"` | `"OXYGEN, COMPRESSED"` |
| `hazardClass` | `material.hazclassDiv` (+ ` (${material.subsidiaryRisk})` if subsidiaryRisk exists) | `"3"` | `"2.2 (5.1)"` |
| `subsidiaryRisk` | `material.subsidiaryRisk` | `""` | `"5.1"` |
| `packingGroup` | `material.packingGroup` | `"II"` | `""` |
| `packingInstruction` | `material.packagingParagraph` | `"A7.2."` | `"A6.3., A6.5."` |
| `authorization` | `material.specialProvision` | `"P5"` | `"P5, 110"` |

**Not auto-populated:** `quantityAndPacking` (Key 16) — this is package-specific data the inspector enters manually.

**`hazardClass` display format:** When `subsidiaryRisk` is non-empty, the cell displays `"hazclassDiv (subsidiaryRisk)"` (e.g., "2.2 (5.1)"). The raw `subsidiaryRisk` is also stored separately in `ExtractedSDDGContent.subsidiaryRisk` for downstream compliance checks.

**`properShippingName` with details:** When a material has a `details` property, the PSN field shows `"PSN, details"` (e.g., "AEROSOLS, flammable, containing substances in Class 8, Packing Group III").

---

## Component Architecture

### New File: `src/components/Inspector/MaterialLookupModal.tsx`

Self-contained modal with two internal view states.

**Props:**
```typescript
interface MaterialLookupModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (material: HazardousMaterialItem) => void;
  onManualEntry: () => void;  // fallback to SimpleFieldEditModal for unIdNo
}
```

**Internal state:**
```typescript
const [prefix, setPrefix] = useState<'UN' | 'NA' | 'ID'>('UN');
const [digits, setDigits] = useState('');
const [mode, setMode] = useState<'search' | 'detail'>('search');
const [selectedUnid, setSelectedUnid] = useState<string | null>(null);
```

**Search view:**
1. Segmented control — three `TouchableOpacity` buttons for UN/NA/ID
2. `TextInput` with `keyboardType="number-pad"`
3. `FlatList` typeahead dropdown with deduplicated UNIDs (excluding all-FORBIDDEN UNIDs)
4. Submit button — resolves `prefix + digits`, triggers Step 2a/2b
5. "Enter Manually" link — closes modal and opens `SimpleFieldEditModal` for the `unIdNo` field

**Detail view (multiple matches):**
1. Back arrow to return to search
2. UNID header + material count
3. `FlatList` table with 6 columns, horizontal scroll for small screens, deterministic keys
4. Row tap triggers `onSelect`

### Integration in `SDDGManualEntryScreen.tsx`

Changes:
1. Add `materialLookupVisible` state
2. Special-case the `unIdNo` field tap: open `MaterialLookupModal` instead of `SimpleFieldEditModal`
3. `onSelect` handler: update `formData` for all mapped fields, call `updateVerificationField` for each field, close modal
4. `onManualEntry` handler: close `MaterialLookupModal`, open `SimpleFieldEditModal` for `unIdNo`
5. Auto-populated cells display their values (no longer show "Tap...")

The existing `SimpleFieldEditModal` remains untouched — still used for all other fields (and as fallback for `unIdNo`).

---

## Files Changed

| File | Change |
|---|---|
| `src/components/Inspector/materialLookupUtils.ts` | **New file** — pure helper functions |
| `src/components/Inspector/__tests__/materialLookupUtils.test.ts` | **New file** — tests for helpers |
| `src/components/Inspector/MaterialLookupModal.tsx` | **New file** — modal component |
| `src/screens/inspector/SDDGManualEntryScreen.tsx` | Import modal, add state, special-case unIdNo tap, add onSelect/onManualEntry handlers |

---

## Edge Cases

1. **No matches found:** Typeahead shows "No materials found" message. User can tap "Enter Manually" to close the modal and type the UN number directly via `SimpleFieldEditModal`.
2. **All matches are FORBIDDEN:** The UNID is excluded from typeahead results entirely. If the user types the exact 4 digits and submits, the modal shows "All entries for {UNID} are forbidden for air transport" and offers the "Enter Manually" fallback.
3. **User changes prefix after typing digits:** Typeahead re-filters with the new prefix. Nothing auto-fires until user taps a result or presses Submit.
4. **User re-opens modal after auto-population:** Modal resets to search state. User can select a different material, which overwrites the previously populated fields.
5. **Fields that are empty or undefined in the material (e.g., packingGroup for UN1950 aerosols):** All fields are normalized to `""` via `|| ""`. The cell reverts to showing "Tap..." so the inspector knows it's unfilled.
