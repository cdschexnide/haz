# Leak-Proof Liner Detection Implementation

## Overview

This document describes the implementation of automatic leak-proof liner requirement detection per AFMAN 24-604 and 49 CFR 173 regulations. The feature dynamically determines when leak-proof liners are required during inner packaging inspection based on material properties and packaging type.

## Regulatory Background

### AFMAN 24-604 Requirement
> "Leak containment must be provided for hazardous liquids when required outer packaging is not liquid-tight. Use a leak-proof liner."

### 49 CFR 173 Requirements
- Required for liquids in **Packing Groups I, II, and III**
- Particularly for hazard classes: **3, 4.1-4.3, 8, 5.1, 5.2, 6.1**
- Liner must be **leakproof and puncture-resistant**, impervious to contents
- Minimum thickness: **3 mils (0.003 inches)** for fiberboard boxes

---

## Implementation Date
October 2025

---

## Technical Implementation

### 1. Utility Functions (`utils/innerPackagingInspection.ts`)

#### `checkIfMaterialIsLiquid(inspection)`
Detects if the hazardous material is in liquid state.

**Logic:**
- If hazard class starts with `"3"` → always liquid (Class 3 = Flammable Liquids)
- Check `properShippingName` for keywords: `"liquid"`, `"solution"`, `"molten"`

**Returns:** `boolean`

#### `requiresLeakProofLiner(inspection)`
Determines if leak-proof liner is mandatory based on all criteria.

**Requirements (all must be true):**
1. ✅ Material is a liquid
2. ✅ Hazard class requires leak containment (3, 4.1-4.3, 8, 5.1, 5.2, 6.1)
3. ✅ Outer packaging is NOT liquid-tight

**Returns:** `boolean`

---

## Packaging Classification

### Non-Liquid-Tight Packaging (Requires Liner)

These packaging types are **porous or have gaps**:

| Container Type | UN Codes | Reason |
|----------------|----------|---------|
| Fiberboard boxes | 4G, 4GV, 4GU | Cardboard is porous, absorbs liquid |
| Wood boxes | 4C, 4D, 4F | Wood has gaps, absorbs liquid |
| Fiber drums | 1G | Fiberboard material is porous |
| Non-specification | N/A | Unknown - assume not liquid-tight for safety |

### Liquid-Tight Packaging (No Liner Required)

These are **sealed containers**:

| Container Type | UN Codes | Material |
|----------------|----------|----------|
| Metal drums | 1A, 1B, 1N | Steel, Aluminum |
| Plastic drums | 1H | Plastic |
| Metal jerricans | 3A, 3B | Steel, Aluminum |
| Plastic jerricans | 3H | Plastic |
| Composite packagings | 6H | Various (designed for liquids) |
| Overpacks | N/A | Depends on contents, typically sealed |

---

## UI/UX Enhancements

### InnerPackagingInspection.tsx Updates

#### Visual Indicators

**When leak-proof liner is required:**
- Item card highlighted with **yellow background** (`#fff9e6`)
- **Yellow border** (2px, `#ffc107`)
- **Warning badge**: "⚠️ REQUIRED BY AFMAN 24-604"
- Enhanced label: *"Leak-proof liner (covering item or lining outer container) (REQUIRED - liquid in non-liquid-tight packaging)"*

#### Dynamic Labels

**Absorbent material item (for all liquids):**
- Enhanced to: *"Absorbent and cushioning material (required for liquids)"*

**Leak-proof liner item (when required):**
- Enhanced to: *"Leak-proof liner (covering item or lining outer container) (REQUIRED - liquid in non-liquid-tight packaging)"*

---

## Decision Tree

```
Is material a liquid?
├─ NO → Liner NOT required ✗
└─ YES
    └─ Is hazard class 3, 4.x, 5.x, 6.1, or 8?
        ├─ NO → Liner NOT required ✗
        └─ YES
            └─ Is outer packaging liquid-tight?
                ├─ YES (metal/plastic drum/jerrican) → Liner NOT required ✗
                └─ NO (fiberboard, wood, fiber) → Liner REQUIRED ✓
```

---

## Data Sources

The implementation uses existing data from the inspection workflow:

| Data Field | Source | Purpose |
|------------|--------|---------|
| `hazardClass` | `inspection.verificationCopy.hazardClass` | Determine if class requires leak containment |
| `properShippingName` | `inspection.verificationCopy.properShippingName` | Detect liquid state from keywords |
| `containerType` | `inspection.innerPackagingInspection.containerType` | Determine if packaging is liquid-tight |
| `quantityAndPacking` | `inspection.verificationCopy.quantityAndPacking` | Already parsed to `containerType` in step 6.1 |

---

## Example Scenarios

### Scenario 1: Flammable Liquid in Fiberboard Box
**Input:**
- Hazard Class: `"3"`
- Proper Shipping Name: `"Paint, liquid"`
- Container Type: `"fiberboard-box"`
- Quantity/Packing: `"1 fiberboard box (4G) x 12 KG"`

**Result:** ✅ **Liner REQUIRED**
- Class 3 = liquid
- Fiberboard box = not liquid-tight
- Item #5 highlighted with warning badge

### Scenario 2: Corrosive Liquid in Steel Drum
**Input:**
- Hazard Class: `"8"`
- Proper Shipping Name: `"Corrosive liquid, acidic"`
- Container Type: `"drum"`
- Quantity/Packing: `"1 steel drum (1A) x 50 L"`

**Result:** ✗ **Liner NOT required**
- Class 8 liquid, but steel drum is liquid-tight
- Item #5 displays normal (no highlight)

### Scenario 3: Flammable Solid in Fiberboard Box
**Input:**
- Hazard Class: `"4.1"`
- Proper Shipping Name: `"Matches, safety"`
- Container Type: `"fiberboard-box"`
- Quantity/Packing: `"1 fiberboard box (4G) x 10 KG"`

**Result:** ✗ **Liner NOT required**
- Not a liquid (no "liquid" in PSN, class 4.1 can be solid)
- Item #5 displays normal

### Scenario 4: Flammable Liquid in Wood Box
**Input:**
- Hazard Class: `"3"`
- Proper Shipping Name: `"Ethanol solution"`
- Container Type: `"wood-box"`
- Quantity/Packing: `"1 plywood box (4D) x 25 KG"`

**Result:** ✅ **Liner REQUIRED**
- Class 3 = liquid, "solution" keyword
- Plywood box = not liquid-tight
- Item #5 highlighted with warning badge

---

## Integration with Existing Workflow

### Inspection Flow
1. **Step 6.1**: InnerPackagingConfirmation - auto-detect `containerType` from Key 16
2. **Step 6.2**: OpeningProcedures - open container
3. **Step 6.3**: InnerPackagingInspection - **LINER DETECTION OCCURS HERE**
   - `requiresLeakProofLiner()` runs automatically
   - Item #5 dynamically highlighted if required
4. **Step 6.4**: ClosingProcedures - close container

### Frustration Tracking
- If inspector marks leak-proof liner item as **"Fail"** → creates package frustration
- Category: `'inner-packaging'`
- Flows to PackageFrustrationSummary and AMC Form 1015

---

## Code Locations

### New Code
- **`utils/innerPackagingInspection.ts`**: Lines 210-265
  - `checkIfMaterialIsLiquid()`
  - `requiresLeakProofLiner()`

### Modified Code
- **`components/Inspector/InnerPackaging/InnerPackagingInspection.tsx`**
  - Added imports: `requiresLeakProofLiner`, `checkIfMaterialIsLiquid`, `useMemo`
  - Added state: `linerRequired`, `isLiquid` (lines 33-34)
  - Added helper: `getItemLabel()` (lines 39-51)
  - Enhanced rendering: Dynamic highlighting and badges (lines 122-145)
  - Added styles: `itemCardHighlighted`, `requiredBadge`, `requiredBadgeText` (lines 281-329)

---

## Testing Scenarios

### Manual Testing Checklist

- [ ] **Class 3 liquid + fiberboard** → Liner required, item highlighted
- [ ] **Class 3 liquid + steel drum** → Liner NOT required, normal display
- [ ] **Class 8 liquid + wood box** → Liner required, item highlighted
- [ ] **Class 4.1 solid + fiberboard** → Liner NOT required (not liquid)
- [ ] **Class 6.1 solution + fiberboard** → Liner required ("solution" = liquid)
- [ ] **No hazard class data** → Liner NOT required (safe default)
- [ ] **No container type** → Liner NOT required (missing data)
- [ ] **Non-spec packaging + liquid** → Liner required (assume not liquid-tight)

### Edge Cases
- [ ] Empty/null `properShippingName` → Uses only hazard class
- [ ] Hazard class without subdivision (e.g., "4" vs "4.1") → Uses `startsWith()` matching
- [ ] Mixed case in PSN → `toLowerCase()` handles it
- [ ] UN number without container type → Falls back gracefully

---

## Performance Considerations

- **Memoization**: Uses `useMemo()` to cache `linerRequired` and `isLiquid` calculations
- **Computation**: O(1) complexity - simple string checks and lookups
- **Re-renders**: Only recalculates when `inspection` object changes
- **No API calls**: All logic runs client-side with existing data

---

## Future Enhancements

1. **Liner Thickness Validation**
   - Add field to specify liner thickness in mils
   - Validate ≥3 mils for fiberboard per 49 CFR 173

2. **Liner Material Type**
   - Dropdown: Polyethylene, PVC, other
   - Document liner material on inspection record

3. **UN Number Cross-Reference**
   - Maintain lookup table of specific UN numbers known to be liquids
   - More accurate than keyword matching for edge cases

4. **Photo Documentation**
   - Allow inspectors to photograph leak-proof liner
   - Attach to inspection item #5

5. **Packing Group Integration**
   - Currently checks all PG levels
   - Could refine to specifically flag PG I, II, III differently

---

## Compliance Notes

1. **Regulatory Alignment**: Implementation follows both AFMAN 24-604 and 49 CFR 173 requirements for military air shipment preparation

2. **Conservative Approach**: When data is ambiguous, system defaults to NOT requiring liner (avoids false alarms), but highlights items for inspector attention

3. **Inspector Override**: Inspectors can still mark any item Pass/Fail/N/A regardless of auto-detection, maintaining human oversight

4. **Audit Trail**: All decisions documented through inspection items with AFMAN references and frustration tracking

---

## Support and Maintenance

### Updating Regulations
If AFMAN 24-604 or 49 CFR 173 requirements change:
1. Update hazard class list in `requiresLeakProofLiner()` (line 254)
2. Update liquid keywords in `checkIfMaterialIsLiquid()` (line 225)
3. Update packaging classifications in `requiresLeakProofLiner()` (line 263)

### Adding New Container Types
To support additional UN packaging codes:
1. Add to `ContainerType` union in `types/innerPackaging.ts`
2. Add parsing logic in `utils/innerPackagingParser.ts`
3. Update `nonLiquidTightTypes` array if not liquid-tight

---

## Conclusion

The leak-proof liner detection feature enhances compliance and inspector guidance by automatically identifying when AFMAN 24-604 requires leak-proof liners. The implementation is:
- ✅ **Regulation-compliant** (AFMAN 24-604, 49 CFR 173)
- ✅ **Automatic** (no manual configuration)
- ✅ **Visual** (clear UI indicators)
- ✅ **Integrated** (uses existing workflow data)
- ✅ **Performance-optimized** (memoized, client-side)

Inspectors now receive clear, contextual guidance on leak-proof liner requirements based on the specific hazardous material and packaging combination being inspected.
