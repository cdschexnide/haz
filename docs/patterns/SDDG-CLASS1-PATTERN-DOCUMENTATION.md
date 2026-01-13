# Class 1 SDDG Validation Test Patterns - Complete Reference

## File Location
`/src/components/Inspector/utils/__tests__/sddgValidation.class1.test.ts`

---

## 1. IMPORT STATEMENTS

```typescript
import {
  validateHazardClass,
  validatePackingGroup,
  validatePackingInstruction,
  validateSubsidiaryRisk,
} from '../sddgValidation';
import { HazardousMaterialItem } from '@/hazardousMaterials/hazardousMaterialsList';
```

**Key imports:**
- Four validation functions from parent module `sddgValidation`
- `HazardousMaterialItem` type from hazardousMaterials list
- No helper functions imported; factory functions defined locally

---

## 2. FACTORY FUNCTION SIGNATURE

### `createClass1Material` Function
**Location:** Lines 10-27

```typescript
function createClass1Material(
  unid: string,
  hazclassDiv: string,
  packagingParagraph: string,
  properShippingName: string,
  subsidiaryRisk: string = ''
): HazardousMaterialItem {
  return {
    unid,
    hazclassDiv,
    packagingParagraph,
    properShippingName,
    packingGroup: '', // Class 1 has no packing group
    subsidiaryRisk,
    specialProvision: '',
    isTechnicalNameRequired: false,
  } as HazardousMaterialItem;
}
```

**Parameters:**
- `unid`: UN identification number (e.g., 'UN0224')
- `hazclassDiv`: Hazard class with division (e.g., '1.1A')
- `packagingParagraph`: Packaging instruction paragraph (e.g., 'A5.2')
- `properShippingName`: Proper shipping name of material
- `subsidiaryRisk`: Optional subsidiary risk class (defaults to empty string)

**Critical Notes:**
- `packingGroup` is ALWAYS empty (`''`) for Class 1 - no packing groups in explosives
- `specialProvision` always empty string
- `isTechnicalNameRequired` always `false`
- Type cast as `HazardousMaterialItem` at return

---

## 3. DESCRIBE BLOCK HIERARCHY

```
describe('SDDG Validation - Class 1 Explosives')
├── describe('Key 13: Hazard Class Validation')
│   ├── describe('Positive Cases - Valid Hazard Classes')
│   │   └── test(...) x20 scenarios
│   └── describe('Negative Cases - From Alterations')
│       └── test(...) x8 alteration tests
├── describe('Key 15: Packing Group Validation')
│   └── describe('Class 1 Special Case - Empty Packing Group')
│       └── test(...) x3 tests
├── describe('Key 17: Packaging Instruction Validation')
│   ├── describe('Positive Cases')
│   │   └── test(...) x20 scenarios
│   ├── describe('Negative Cases - From Alterations')
│   │   └── test(...) x2 alteration tests
│   └── describe('Normalization')
│       └── test(...) x2 normalization tests
└── describe('Key 14: Subsidiary Risk Validation')
    ├── describe('Positive Cases - No Subsidiary Risk (Scenarios 6-13, 16-20)')
    │   └── test(...) x12 tests
    ├── describe('Positive Cases - With Subsidiary Risk (Scenarios 14-15)')
    │   └── test(...) x2 tests
    └── describe('Negative Cases - From Alterations')
        └── test(...) x3 alteration tests
```

**Pattern Notes:**
- Top-level describe spans entire Class 1 explosives validation
- Keys are numbered: 13, 14, 15, 17 (representing SDDG key columns)
- Each key has nested describe blocks for test categories
- Positive/negative cases separated explicitly
- Alteration tests grouped separately with reference to scenario numbers

---

## 4. SDDG KEY VALIDATION PATTERNS

### Key 13: Hazard Class Validation

**Function:** `validateHazardClass(material, expectedValue)`

**Valid Class 1 Hazard Classes (Divisions & Compatibility Groups):**
- `1.1A`, `1.1D`, `1.1C` (Division 1.1)
- `1.2D`, `1.2C` (Division 1.2)
- `1.3J`, `1.3G` (Division 1.3)
- `1.4B`, `1.4G`, `1.4S` (Division 1.4)
- `1.5D` (Division 1.5)
- `1.6N` (Division 1.6)

**Positive Test Pattern:**
```typescript
test('Scenario X: UNXXXX - validates 1.XY correctly', () => {
  const material = createClass1Material('UNXXXX', '1.XY', 'AX.Y', 'MATERIAL NAME');
  const result = validateHazardClass(material, '1.XY');
  expect(result.isValid).toBe(true);
});
```

**Positive Tests with Subsidiary Risk:**
```typescript
test('Scenario X: UNXXXX - validates 1.XY correctly (with subsidiary 5.1)', () => {
  const material = createClass1Material('UNXXXX', '1.XY', 'AX.Y', 'MATERIAL NAME', '5.1');
  const result = validateHazardClass(material, '1.XY');
  expect(result.isValid).toBe(true);
});
```

**Negative Test Patterns - Missing Components:**
- Missing compatibility group: `'1.1'` instead of `'1.1A'`
- Missing division: `'1'` instead of `'1.1D'`
- Missing both: `'1'` (incomplete class designation)

**Negative Test Pattern - Wrong Component:**
```typescript
test('Scenario X, Alteration Y: rejects 1.XZ when 1.XY expected', () => {
  const material = createClass1Material('UNXXXX', '1.XY', 'AX.Y', 'MATERIAL NAME');
  const result = validateHazardClass(material, '1.XZ'); // Wrong compat group
  expect(result.isValid).toBe(false);
  expect(result.expected).toBe('1.XY');
});
```

**Result Object:**
- `result.isValid`: boolean
- `result.expected`: string (only present in negative cases to show expected value)

---

### Key 15: Packing Group Validation

**Function:** `validatePackingGroup(material, expectedValue)`

**Class 1 Special Case:**
- All Class 1 materials have EMPTY packing group
- Always validates against `''` (empty string)

**Positive Test Pattern:**
```typescript
test('Scenario X: UNXXXX - accepts empty packing group', () => {
  const material = createClass1Material('UNXXXX', '1.XY', 'AX.Y', 'MATERIAL NAME');
  const result = validatePackingGroup(material, '');
  expect(result.isValid).toBe(true);
});
```

**Bulk Testing Pattern:**
```typescript
test('All Class 1 materials should have empty packing group in Key 15', () => {
  const materials = [
    createClass1Material('UN0224', '1.1A', 'A5.2', 'BARIUM AZIDE'),
    createClass1Material('UN0027', '1.1D', 'A5.3', 'BLACK POWDER'),
    // ... more materials
  ];

  materials.forEach((material) => {
    const result = validatePackingGroup(material, '');
    expect(result.isValid).toBe(true);
  });
});
```

---

### Key 17: Packaging Instruction Validation

**Function:** `validatePackingInstruction(material, expectedValue)`

**Valid Class 1 Packaging Instructions:**
- Format: `AX.Y` or `AX.YY` (e.g., `A5.2`, `A5.21`)
- Common values: A5.2, A5.3, A5.5, A5.6, A5.9, A5.10, A5.11, A5.12, A5.21, A5.27

**Positive Test Pattern:**
```typescript
test('Scenario X: UNXXXX - validates AX.Y correctly', () => {
  const material = createClass1Material('UNXXXX', '1.XY', 'AX.Y', 'MATERIAL NAME');
  const result = validatePackingInstruction(material, 'AX.Y');
  expect(result.isValid).toBe(true);
});
```

**Negative Test Pattern - Wrong Paragraph:**
```typescript
test('Scenario X, Alteration Y: rejects AX.Y when AX.Z expected', () => {
  const material = createClass1Material('UNXXXX', '1.XY', 'AX.Z', 'MATERIAL NAME');
  const result = validatePackingInstruction(material, 'AX.Y'); // Wrong paragraph
  expect(result.isValid).toBe(false);
  expect(result.expected).toBe('AX.Z');
});
```

**Normalization Tests:**
```typescript
test('handles trailing period in paragraph reference', () => {
  const material = createClass1Material('UN0224', '1.1A', 'A5.2.', 'BARIUM AZIDE');
  const result = validatePackingInstruction(material, 'A5.2');
  expect(result.isValid).toBe(true);
});

test('handles case variations', () => {
  const material = createClass1Material('UN0224', '1.1A', 'A5.2', 'BARIUM AZIDE');
  const result = validatePackingInstruction(material, 'a5.2');
  expect(result.isValid).toBe(true);
});
```

**Result Object:**
- `result.isValid`: boolean
- `result.expected`: string (only present in negative cases)

---

### Key 14: Subsidiary Risk Validation

**Function:** `validateSubsidiaryRisk(material, expectedValue)`

**Valid Values:**
- Empty string `''` (most Class 1 materials have no subsidiary risk)
- Risk class numbers: `'5.1'`, `'6.1'`, `'6.2'`, `'8'`, `'3'`, etc.

**Positive Test Pattern - No Subsidiary Risk (Most scenarios):**
```typescript
test('Scenario X: UNXXXX - validates empty subsidiary risk correctly', () => {
  const material = createClass1Material('UNXXXX', '1.XY', 'AX.Y', 'MATERIAL NAME');
  const result = validateSubsidiaryRisk(material, '');
  expect(result.isValid).toBe(true);
});
```

**Positive Test Pattern - With Subsidiary Risk (Specific scenarios):**
```typescript
test('Scenario X: UNXXXX - validates subsidiary risk X.X correctly', () => {
  const material = createClass1Material('UNXXXX', '1.XY', 'AX.Y', 'MATERIAL NAME', 'X.X');
  const result = validateSubsidiaryRisk(material, 'X.X');
  expect(result.isValid).toBe(true);
});
```

**Negative Test Pattern - Missing Expected Risk:**
```typescript
test('Scenario X, Alteration Y: rejects empty when X.X expected', () => {
  const material = createClass1Material('UNXXXX', '1.XY', 'AX.Y', 'MATERIAL NAME', 'X.X');
  const result = validateSubsidiaryRisk(material, ''); // Missing subsidiary risk
  expect(result.isValid).toBe(false);
  expect(result.expected).toBe('X.X');
});
```

**Negative Test Pattern - Wrong Risk Class:**
```typescript
test('Scenario X, Alteration Y: rejects X.X when Y.Y expected', () => {
  const material = createClass1Material('UNXXXX', '1.XY', 'AX.Y', 'MATERIAL NAME', 'Y.Y');
  const result = validateSubsidiaryRisk(material, 'X.X'); // Wrong subsidiary risk
  expect(result.isValid).toBe(false);
  expect(result.expected).toBe('Y.Y');
});
```

**Result Object:**
- `result.isValid`: boolean
- `result.expected`: string (only present in negative cases)

---

## 5. ASSERTION PATTERNS BY KEY TYPE

### Pattern 1: Valid Case (Positive Assertion)
```typescript
const result = validateXXX(material, expectedValue);
expect(result.isValid).toBe(true);
```
- Single assertion
- Only checks `isValid` property
- No `expected` field checked (not present in positive results)

### Pattern 2: Invalid Case (Negative Assertion)
```typescript
const result = validateXXX(material, providedValue);
expect(result.isValid).toBe(false);
expect(result.expected).toBe(expectedValue);
```
- Two assertions:
  1. `isValid` must be false
  2. `expected` property must match actual expected value from material

### Pattern 3: Bulk Iteration
```typescript
const materials = [material1, material2, ...];
materials.forEach((material) => {
  const result = validateXXX(material, expectedValue);
  expect(result.isValid).toBe(true);
});
```
- Used for testing common scenarios across multiple materials
- Each material tested independently
- All expected to pass

---

## 6. ALTERATION/NEGATIVE TEST STRUCTURE

**Alteration Naming Convention:**
- Reference test scenario and alteration number: "Scenario X, Alteration Y"
- Describes what was altered from the valid scenario
- Example: "Scenario 1, Alteration 3: rejects 1.1 without compatibility group A"

**Alteration Categories (By Key):**

**Key 13 (Hazard Class):**
- Alteration 1: Remove division designation (e.g., `'1'` instead of `'1.1D'`)
- Alteration 2: Change compatibility group (e.g., `'1.1D'` → `'1.1C'`)
- Alteration 3: Remove compatibility group (e.g., `'1.1'` instead of `'1.1A'`)

**Key 17 (Packaging Instruction):**
- Alteration 1: Wrong paragraph number (e.g., `'A5.2'` → `'A5.21'`)
- Alteration 2: Typo in paragraph (e.g., `'A5.1'` → `'A5.11'`)

**Key 14 (Subsidiary Risk):**
- Alteration 1: Only applies if material has subsidiary risk
- Alteration 2: Missing expected subsidiary risk (empty when risk expected)
- Alteration 3: Wrong risk class (e.g., `'5.1'` → `'4.1'`)

---

## 7. HELPER FUNCTIONS USED

**Only one helper function defined locally:**

### `createClass1Material`
- **Purpose:** Factory function for creating test materials
- **Defined:** Lines 10-27
- **Used:** In every test (called 20+ times per describe block)
- **No other helper functions:** All assertion logic inline in tests

---

## 8. TEST SCENARIO REFERENCE

**20 Primary Test Scenarios (Lines 32-150):**

| Scenario | UN | Hazard Class | Packaging | Material |
|----------|--------|---|---|---|
| 1 | UN0224 | 1.1A | A5.2 | BARIUM AZIDE, DRY |
| 2 | UN0027 | 1.1D | A5.3 | BLACK POWDER (GUNPOWDER) |
| 3 | UN0004 | 1.1D | A5.2 | AMMONIUM PICRATE |
| 4 | UN0160 | 1.1C | A5.21 | POWDER, SMOKELESS |
| 5 | UN0136 | 1.2D | A5.10 | MINES with bursting charge |
| 6 | UN0328 | 1.2C | A5.5 | CARTRIDGES FOR WEAPONS, INERT PROJECTILE |
| 7 | UN0247 | 1.3J | A5.12 | AMMUNITION, INCENDIARY, liquid or gel |
| 8 | UN0049 | 1.3G | A5.5 | CARTRIDGES, FLASH |
| 9 | UN0106 | 1.4B | A5.9 | FUZES, DETONATING |
| 10 | UN0325 | 1.4G | A5.11 | IGNITERS |
| 11 | UN0012 | 1.4S | A5.5 | CARTRIDGES FOR WEAPONS, INERT PROJECTILE |
| 12 | UN0331 | 1.5D | A5.2 | EXPLOSIVE, BLASTING, TYPE B |
| 13 | UN0486 | 1.6N | A5.27 | ARTICLES, EXPLOSIVE, EXTREMELY INSENSITIVE |
| 14 | UN0222 | 1.1D | A5.2 | AMMONIUM NITRATE (subsidiary 5.1) |
| 15 | UN0019 | 1.4G | A5.12 | AMMUNITION, TEAR-PRODUCING (subsidiary 6.1) |
| 16 | UN0124 | 1.1D | A5.10 | JET PERFORATING GUNS, CHARGED |
| 17 | UN0135 | 1.1A | A5.2 | MERCURY FULMINATE, WETTED |
| 18 | UN0473 | 1.1A | A5.2 | SUBSTANCES, EXPLOSIVE, N.O.S. |
| 19 | UN0059 | 1.1D | A5.6 | CHARGES, SHAPED, FLEXIBLE, LINEAR |
| 20 | UN0354 | 1.4D | A5.27 | ARTICLES, EXPLOSIVE, N.O.S. |

**Notes on Scenarios:**
- Covers all 6 Class 1 divisions (1.1 through 1.6)
- Multiple compatibility groups per division
- Scenarios 6-13, 16-20: No subsidiary risk
- Scenarios 14-15: Include subsidiary risk
- All represent real UN classified explosives

---

## 9. TEST COVERAGE SUMMARY

| Key | Positive Tests | Negative Tests | Total |
|-----|---|---|---|
| 13 (Hazard Class) | 20 | 8 | 28 |
| 15 (Packing Group) | 3 | 0 | 3 |
| 17 (Packaging Instruction) | 20 | 2 + 2 normalization | 24 |
| 14 (Subsidiary Risk) | 14 (12 empty + 2 with risk) | 3 | 17 |
| **TOTAL** | **57** | **13** | **70** |

---

## 10. KEY PATTERNS FOR CLASS 2 ADAPTATION

### What Will Change for Class 2:
1. **Factory function:** `createClass2Material` with `packingGroup` populated (Class 2 has I, II, III groups)
2. **Hazard classes:** 2.1 (Flammable gas), 2.2 (Non-flammable gas), 2.3 (Toxic gas)
3. **Packaging instructions:** Different format (e.g., `P200`, `P203` instead of `A5.X`)
4. **Packing groups:** Class 2 will have I, II, III (not empty)
5. **Subsidiary risks:** May be different set or more complex
6. **Describe block title:** "SDDG Validation - Class 2 Gases"

### What Stays the Same:
1. Import structure (same validation functions)
2. Test structure (positive/negative/alteration patterns)
3. Result object structure (`isValid`, `expected`)
4. Describe block hierarchy
5. Scenario numbering approach
6. Assertion patterns
7. Bulk iteration pattern for packing groups

---

## 11. EXACT CODE EXAMPLE: COMPLETE TEST BLOCK

Here's a complete example you can copy for Class 2:

```typescript
import {
  validateHazardClass,
  validatePackingGroup,
  validatePackingInstruction,
  validateSubsidiaryRisk,
} from '../sddgValidation';
import { HazardousMaterialItem } from '@/hazardousMaterials/hazardousMaterialsList';

function createClass2Material(
  unid: string,
  hazclassDiv: string,
  packagingParagraph: string,
  properShippingName: string,
  packingGroup: string,
  subsidiaryRisk: string = ''
): HazardousMaterialItem {
  return {
    unid,
    hazclassDiv,
    packagingParagraph,
    properShippingName,
    packingGroup, // Class 2: can be I, II, or III
    subsidiaryRisk,
    specialProvision: '',
    isTechnicalNameRequired: false,
  } as HazardousMaterialItem;
}

describe('SDDG Validation - Class 2 Gases', () => {
  describe('Key 13: Hazard Class Validation', () => {
    describe('Positive Cases - Valid Hazard Classes', () => {
      test('Scenario 1: UNXXXX - validates 2.1 correctly', () => {
        const material = createClass2Material('UNXXXX', '2.1', 'PXX', 'MATERIAL NAME', 'I');
        const result = validateHazardClass(material, '2.1');
        expect(result.isValid).toBe(true);
      });
      // ... more tests following same pattern
    });
  });
  // ... more describe blocks
});
```

---

## Summary

This documentation captures the complete pattern architecture of Class 1 SDDG validation tests. The key elements are:

1. **Single factory function** with 5 parameters (6th optional)
2. **Four validation functions** imported from parent module
3. **Hierarchical describe structure** organizing by key number, then by positive/negative/special cases
4. **Consistent assertion patterns** with `isValid` always checked, `expected` for negatives
5. **20 primary scenarios** covering all divisions and representing real UN materials
6. **Alteration naming** that references source scenario and alteration number
7. **Normalization tests** for handling variations in input format
8. **Bulk iteration** for simple validation across multiple materials

Use this as the template for Class 2, adapting the factory function signature and test data while maintaining the structural patterns.
