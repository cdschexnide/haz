# SDDG Validation Testing Design

**Date:** 2026-01-20
**Scope:** Extract SDDG frustration calculation logic into testable utilities
**Goal:** Enable unit testing of SDDG validation against defined test scenarios (Keys 7, 11-17)

---

## Design Decisions (Brainstormed)

1. **Validation consolidation:** Move inline validation logic (dry ice, capacitors, magnetized materials) to `sddgValidation.ts`
2. **Test structure:** Mirror marking tests pattern - `sddgValidation.class{N}.test.ts` files
3. **Unified function:** Create `validateSDDGInspection()` that validates all SDDG keys
4. **UN-specific rules:** Include in unified function (not separate pass)
5. **Return type:** Match existing frustration structure with `SDDGValidationResult`

---

## Architecture Overview

### File Structure

```
src/components/Inspector/utils/
├── sddgValidation.ts                    # Extended with new functions
└── __tests__/
    ├── sddgValidation.class1.test.ts    # NEW - Class 1 Explosives
    ├── sddgValidation.class2.test.ts    # NEW - Class 2 Gases
    ├── sddgValidation.class3.test.ts    # NEW - Class 3 Flammable Liquids
    ├── sddgValidation.class4.test.ts    # NEW - Class 4 Flammable Solids
    ├── sddgValidation.class5.test.ts    # NEW - Class 5 Oxidizers
    ├── sddgValidation.class8.test.ts    # NEW - Class 8 Corrosives
    └── sddgValidation.class9.test.ts    # NEW - Class 9 Misc
```

### Validation Flow

```
validateSDDGInspection(extractedContent, material)
  │
  ├─► Standard key validations (existing)
  │   ├─ validateAircraftType()        → Key 7
  │   ├─ validateUnidNumber()          → Key 11 (NEW)
  │   ├─ validateProperShippingName()  → Key 12
  │   ├─ validateHazardClass()         → Key 13
  │   ├─ validateSubsidiaryRisk()      → Key 14
  │   ├─ validatePackingGroup()        → Key 15
  │   └─ validatePackingInstruction()  → Key 17
  │
  └─► UN-specific validations (moved from component)
      ├─ UN1845 → validateDryIcePackaging()
      ├─ UN3508 → validateCapacitorWhRating()
      └─ UN2807 → validateMagnetizedMaterialHandling()
```

---

## New Types and Functions

### SDDGValidationResult Interface

```typescript
export interface SDDGValidationResult {
  key: string;              // SDDG key identifier
  fieldLabel: string;       // Human-readable label
  isValid: boolean;
  actualValue: string;
  expectedValue?: string;
  recommendation?: string;  // Frustration message for UI
  regulation?: string;      // AFMAN reference (e.g., "A5.2", "A13.10")
}
```

### Unified Validation Function

```typescript
/**
 * Validates all SDDG keys against expected values based on hazmat data.
 * Returns array of validation results - empty array means all valid.
 */
export function validateSDDGInspection(
  extractedContent: ExtractedSDDGContent,
  material: HazardousMaterialItem | null
): SDDGValidationResult[];
```

### UN-Specific Validators

```typescript
/**
 * UN1845 Dry Ice - Packaging must permit CO2 release
 * Per AFMAN24-604 A13.10
 */
export function validateDryIcePackaging(
  unid: string,
  packagingText: string
): SDDGValidationResult | null;

/**
 * UN3508 Capacitors - Must include Wh rating
 */
export function validateCapacitorWhRating(
  unid: string,
  packagingText: string
): SDDGValidationResult | null;

/**
 * UN2807 Magnetized Materials - Must include handling instructions
 */
export function validateMagnetizedMaterialHandling(
  unid: string,
  handlingText: string
): SDDGValidationResult | null;
```

---

## UN-Specific Validator Implementations

### UN1845 Dry Ice Packaging

```typescript
export function validateDryIcePackaging(
  unid: string,
  packagingText: string
): SDDGValidationResult | null {
  if (unid !== 'UN1845') return null;

  const approvedTypes = ['fiberboard box', '4g', 'polystyrene foam container'];
  const lowerText = packagingText.toLowerCase();
  const hasApprovedPackaging = approvedTypes.some(type => lowerText.includes(type));

  if (!hasApprovedPackaging) {
    return {
      key: 'quantityAndPacking',
      fieldLabel: 'Quantity and Type of Packing',
      isValid: false,
      actualValue: packagingText,
      expectedValue: 'Fiberboard box (4G) or Polystyrene foam container',
      recommendation: 'UN1845 dry ice packaging must be designed to permit CO2 release and prevent pressure build-up that could rupture the packaging.',
      regulation: 'A13.10',
    };
  }
  return null;
}
```

### UN3508 Capacitor Wh Rating

```typescript
export function validateCapacitorWhRating(
  unid: string,
  packagingText: string
): SDDGValidationResult | null {
  if (unid !== 'UN3508') return null;

  const whPatterns = [
    /\d+\.?\d*\s?wh\b/i,
    /\d+\.?\d*\s?watt-?hours?\b/i,
    /\d+\.?\d*\s?w\.?h\.?\b/i,
  ];
  const hasWhRating = whPatterns.some(pattern => pattern.test(packagingText));

  if (!hasWhRating) {
    return {
      key: 'quantityAndPacking',
      fieldLabel: 'Quantity and Type of Packing',
      isValid: false,
      actualValue: packagingText,
      expectedValue: 'Must include energy storage capacity in Watt-hours (Wh)',
      recommendation: 'UN3508 capacitors require energy storage capacity in Watt-hours (Wh) to be specified. Example: "2 pieces 1.5Wh"',
      regulation: 'A13.3',
    };
  }
  return null;
}
```

### UN2807 Magnetized Material Handling

```typescript
export function validateMagnetizedMaterialHandling(
  unid: string,
  handlingText: string
): SDDGValidationResult | null {
  if (unid !== 'UN2807') return null;

  const requiredKeywords = ['4.6', '15 feet', 'compass', 'magnetic', 'sensing', 'device'];
  const lowerText = handlingText.toLowerCase();
  const hasAllKeywords = requiredKeywords.every(kw => lowerText.includes(kw));

  if (!hasAllKeywords) {
    return {
      key: 'additionalHandlingInfo',
      fieldLabel: 'Additional Handling Information',
      isValid: false,
      actualValue: handlingText,
      expectedValue: 'Must include: "Do not store magnetic materials suitable for military airlift closer than 4.6 m (15 feet) to compass sensing devices..."',
      recommendation: 'UN2807 magnetized materials require specific handling instructions about distance from compass sensing devices.',
      regulation: 'A13.6',
    };
  }
  return null;
}
```

---

## Unified validateSDDGInspection Implementation

```typescript
export function validateSDDGInspection(
  extractedContent: ExtractedSDDGContent,
  material: HazardousMaterialItem | null
): SDDGValidationResult[] {
  const results: SDDGValidationResult[] = [];

  if (!material || !extractedContent) {
    return results;
  }

  const unid = extractedContent.unIdNo || '';

  // Standard key validations
  const standardValidations: Array<{
    key: string;
    fieldLabel: string;
    validator: () => { isValid: boolean; expected?: string; recommendation?: string };
    actualValue: string;
  }> = [
    {
      key: 'aircraftType',
      fieldLabel: 'Aircraft Type (Key 7)',
      validator: () => validateAircraftType(material, extractedContent.aircraftType || ''),
      actualValue: extractedContent.aircraftType || '',
    },
    {
      key: 'unIdNo',
      fieldLabel: 'UN/ID Number (Key 11)',
      validator: () => validateUnidNumber(material, extractedContent.unIdNo || ''),
      actualValue: extractedContent.unIdNo || '',
    },
    {
      key: 'properShippingName',
      fieldLabel: 'Proper Shipping Name (Key 12)',
      validator: () => validateProperShippingName(material, extractedContent.properShippingName || ''),
      actualValue: extractedContent.properShippingName || '',
    },
    {
      key: 'hazardClass',
      fieldLabel: 'Hazard Class/Division (Key 13)',
      validator: () => validateHazardClass(material, extractedContent.hazardClass || ''),
      actualValue: extractedContent.hazardClass || '',
    },
    {
      key: 'subsidiaryRisk',
      fieldLabel: 'Subsidiary Risk (Key 14)',
      validator: () => validateSubsidiaryRisk(material, extractedContent.subsidiaryRisk || ''),
      actualValue: extractedContent.subsidiaryRisk || '',
    },
    {
      key: 'packingGroup',
      fieldLabel: 'Packing Group (Key 15)',
      validator: () => validatePackingGroup(material, extractedContent.packingGroup || ''),
      actualValue: extractedContent.packingGroup || '',
    },
    {
      key: 'packingInstruction',
      fieldLabel: 'Packing Instruction (Key 17)',
      validator: () => validatePackingInstruction(material, extractedContent.packingInstruction || ''),
      actualValue: extractedContent.packingInstruction || '',
    },
  ];

  // Run standard validations
  for (const { key, fieldLabel, validator, actualValue } of standardValidations) {
    const result = validator();
    results.push({
      key,
      fieldLabel,
      isValid: result.isValid,
      actualValue,
      expectedValue: result.expected,
      recommendation: result.recommendation,
    });
  }

  // UN-specific validations
  const unSpecificValidators = [
    () => validateDryIcePackaging(unid, extractedContent.quantityAndPacking || ''),
    () => validateCapacitorWhRating(unid, extractedContent.quantityAndPacking || ''),
    () => validateMagnetizedMaterialHandling(unid, extractedContent.additionalHandlingInfo || ''),
  ];

  for (const validator of unSpecificValidators) {
    const result = validator();
    if (result) {
      const existingIndex = results.findIndex(r => r.key === result.key);
      if (existingIndex >= 0) {
        results[existingIndex] = result;
      } else {
        results.push(result);
      }
    }
  }

  return results;
}
```

---

## Test File Template

```typescript
// sddgValidation.class1.test.ts
import { validateSDDGInspection, SDDGValidationResult } from '../sddgValidation';
import { findHazMatByUnid } from '../sddgValidation';
import { ExtractedSDDGContent } from '@/types/sddg';

function createSDDGContent(overrides: Partial<ExtractedSDDGContent>): ExtractedSDDGContent {
  return {
    shipper: '',
    consignee: '',
    airWaybillNumber: '',
    pagination: '',
    shippersReferenceNumber: '',
    inspectionActivity: '',
    aircraftType: '',
    airportOfDeparture: '',
    airportOfDestination: '',
    shipmentType: '',
    unIdNo: '',
    properShippingName: '',
    hazardClass: '',
    subsidiaryRisk: '',
    packingGroup: '',
    quantityAndPacking: '',
    packingInstruction: '',
    authorization: '',
    additionalHandlingInfo: '',
    nameOfSignatory: '',
    placeAndDate: '',
    signature: '',
    ...overrides,
  };
}

describe('SDDG Validation - Class 1 Explosives', () => {
  describe('Scenario 1: UN0224 - BARIUM AZIDE, DRY', () => {
    const material = findHazMatByUnid('UN0224');

    test('validates successful SDDG with correct values', () => {
      const content = createSDDGContent({
        aircraftType: 'CARGO AIRCRAFT ONLY',
        unIdNo: 'UN0224',
        properShippingName: 'BARIUM AZIDE, DRY or wetted with less than 50% water, by mass',
        hazardClass: '1.1A',
        subsidiaryRisk: '',
        packingGroup: '',
        packingInstruction: 'A5.2',
      });

      const results = validateSDDGInspection(content, material);
      const failures = results.filter(r => !r.isValid);

      expect(failures).toHaveLength(0);
    });

    describe('Alterations', () => {
      test('Alteration 3: Key 13 shows "1.1" without compatibility group "A"', () => {
        const content = createSDDGContent({
          aircraftType: 'CARGO AIRCRAFT ONLY',
          unIdNo: 'UN0224',
          properShippingName: 'BARIUM AZIDE, DRY',
          hazardClass: '1.1',  // Missing compatibility group
          packingInstruction: 'A5.2',
        });

        const results = validateSDDGInspection(content, material);
        const hazardClassResult = results.find(r => r.key === 'hazardClass');

        expect(hazardClassResult?.isValid).toBe(false);
        expect(hazardClassResult?.expectedValue).toBe('1.1A');
      });
    });
  });

  // Additional scenarios follow same pattern...
});
```

---

## Component Refactoring

**File:** `src/components/SDDGComplianceValidation.tsx`

### Changes Required

1. **Update imports:**
```typescript
import {
  findHazMatByUnid,
  validateSDDGInspection,
  SDDGValidationResult,
} from "./Inspector/utils/sddgValidation";
```

2. **Remove inline validation functions:**
   - `isUN1845DryIce()`, `hasApprovedDryIcePackaging()`, `shouldShowDryIceWarning()`
   - `isUN3508Capacitor()`, `hasWhRating()`, `shouldShowCapacitorWhWarning()`
   - `isUN2807MagnetizedMaterial()`, `hasUN2807HandlingInstructions()`, `shouldShowMagnetizedMaterialWarning()`

3. **Add memoized validation results:**
```typescript
const validationResults = useMemo(() => {
  if (!inspection?.verificationCopy || !hazMatData) return [];
  return validateSDDGInspection(inspection.verificationCopy, hazMatData);
}, [inspection?.verificationCopy, hazMatData]);

const currentFieldValidation = validationResults.find(
  r => r.key === currentField?.key
);
```

4. **Simplify recommended frustration useEffect:**
```typescript
useEffect(() => {
  if (currentFieldValidation && !currentFieldValidation.isValid) {
    setRecommendedFrustration(currentFieldValidation.recommendation || null);
  } else {
    setRecommendedFrustration(null);
  }
}, [currentFieldValidation]);
```

---

## Implementation Order

### Phase 1: Extend sddgValidation.ts
1. Add `SDDGValidationResult` interface
2. Add `validateUnidNumber()` function (new - Key 11)
3. Add `validateDryIcePackaging()` function (moved from component)
4. Add `validateCapacitorWhRating()` function (moved from component)
5. Add `validateMagnetizedMaterialHandling()` function (moved from component)
6. Add `validateSDDGInspection()` unified function
7. Export all new functions

### Phase 2: Create Test Files
1. Create test helper `createSDDGContent()`
2. Create `sddgValidation.class1.test.ts` - 20 scenarios
3. Create remaining class test files
4. Verify all scenarios pass

### Phase 3: Refactor Component
1. Update imports
2. Remove inline validation functions
3. Replace useEffect logic
4. Update warning UI
5. Verify app functionality

---

## Test Commands

```bash
# Run all SDDG validation tests
npm test -- --testPathPattern="sddgValidation" --watchAll=false

# Run specific class tests
npm test -- --testPathPattern="sddgValidation.class1" --watchAll=false

# Run with coverage
npm test -- --testPathPattern="sddgValidation" --coverage --watchAll=false
```

---

## Success Criteria

- [ ] All UN-specific validation logic moved out of component
- [ ] `validateSDDGInspection()` validates all SDDG keys (7, 11-17)
- [ ] Test files created for each hazard class with scenarios
- [ ] All "successful" scenarios pass validation
- [ ] All "alteration" scenarios correctly identify failures
- [ ] Component refactored to use unified validation
- [ ] Existing app functionality preserved
- [ ] All tests pass
