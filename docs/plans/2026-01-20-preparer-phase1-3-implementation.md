# Preparer Phase 1-3 + Specialty Screens Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refactor 15 preparer screens from ~13,400 lines to ~4,585 lines (66% reduction) using established UI patterns.

**Architecture:** Extract shared patterns into `SpecialtyMaterialScreen` wrapper and utility modules. Migrate screens to `src/screens/preparer/` with theme token styling. Heavy refactor for 500+ line screens, light touch for smaller ones.

**Tech Stack:** React Native, Expo, TypeScript, Zustand (useHazProStore), Jest, React Native Testing Library

---

## Phase 0: Foundation

### Task 0.1: Temperature Conversion Utility

**Files:**
- Create: `src/utils/materialId/temperatureConversion.ts`
- Create: `src/utils/materialId/__tests__/temperatureConversion.test.ts`

**Step 1: Write failing tests**

```typescript
// src/utils/materialId/__tests__/temperatureConversion.test.ts
import {
  fahrenheitToCelsius,
  celsiusToFahrenheit,
  parseTemperatureInput,
} from '../temperatureConversion';

describe('temperatureConversion', () => {
  describe('fahrenheitToCelsius', () => {
    it('converts 32°F to 0°C', () => {
      expect(fahrenheitToCelsius(32)).toBe(0);
    });

    it('converts 212°F to 100°C', () => {
      expect(fahrenheitToCelsius(212)).toBe(100);
    });

    it('converts -40°F to -40°C', () => {
      expect(fahrenheitToCelsius(-40)).toBe(-40);
    });
  });

  describe('celsiusToFahrenheit', () => {
    it('converts 0°C to 32°F', () => {
      expect(celsiusToFahrenheit(0)).toBe(32);
    });

    it('converts 100°C to 212°F', () => {
      expect(celsiusToFahrenheit(100)).toBe(212);
    });
  });

  describe('parseTemperatureInput', () => {
    it('parses Fahrenheit input and converts to both units', () => {
      const result = parseTemperatureInput('212', 'F');
      expect(result.fahrenheit).toBe(212);
      expect(result.celsius).toBe(100);
    });

    it('parses Celsius input and converts to both units', () => {
      const result = parseTemperatureInput('100', 'C');
      expect(result.celsius).toBe(100);
      expect(result.fahrenheit).toBe(212);
    });
  });
});
```

**Step 2: Run test to verify it fails**

```bash
npm test -- --testPathPattern="temperatureConversion" --watchAll=false
```

Expected: FAIL with "Cannot find module '../temperatureConversion'"

**Step 3: Write implementation**

```typescript
// src/utils/materialId/temperatureConversion.ts

/**
 * Temperature conversion utilities for hazmat material handling.
 * Used by specialty screens that require temperature specifications.
 */

export const fahrenheitToCelsius = (f: number): number => {
  return ((f - 32) * 5) / 9;
};

export const celsiusToFahrenheit = (c: number): number => {
  return (c * 9) / 5 + 32;
};

export interface TemperatureResult {
  fahrenheit: number;
  celsius: number;
}

export const parseTemperatureInput = (
  value: string,
  unit: 'F' | 'C'
): TemperatureResult => {
  const num = parseFloat(value);
  if (unit === 'F') {
    return { fahrenheit: num, celsius: fahrenheitToCelsius(num) };
  }
  return { fahrenheit: celsiusToFahrenheit(num), celsius: num };
};
```

**Step 4: Run test to verify it passes**

```bash
npm test -- --testPathPattern="temperatureConversion" --watchAll=false
```

Expected: PASS (6 tests)

**Step 5: Commit**

```bash
git add src/utils/materialId/temperatureConversion.ts src/utils/materialId/__tests__/temperatureConversion.test.ts
git commit -m "feat(utils): add temperature conversion utilities for material screens"
```

---

### Task 0.2: Special Provisions Utils

**Files:**
- Create: `src/utils/materialId/specialProvisionsUtils.ts`
- Create: `src/utils/materialId/__tests__/specialProvisionsUtils.test.ts`

**Step 1: Write failing tests**

```typescript
// src/utils/materialId/__tests__/specialProvisionsUtils.test.ts
import {
  filterMatchingKeys,
  consolidateWorkflowModifiers,
} from '../specialProvisionsUtils';

describe('specialProvisionsUtils', () => {
  describe('filterMatchingKeys', () => {
    it('returns only keys present in the filter array', () => {
      const sourceMap = { A1: 'value1', A2: 'value2', A3: 'value3' };
      const keys = ['A1', 'A3'];
      const result = filterMatchingKeys(sourceMap, keys);
      expect(result).toEqual({ A1: 'value1', A3: 'value3' });
    });

    it('returns empty object when no keys match', () => {
      const sourceMap = { A1: 'value1', A2: 'value2' };
      const keys = ['B1', 'B2'];
      const result = filterMatchingKeys(sourceMap, keys);
      expect(result).toEqual({});
    });

    it('handles empty source map', () => {
      const result = filterMatchingKeys({}, ['A1', 'A2']);
      expect(result).toEqual({});
    });

    it('handles empty keys array', () => {
      const sourceMap = { A1: 'value1' };
      const result = filterMatchingKeys(sourceMap, []);
      expect(result).toEqual({});
    });
  });

  describe('consolidateWorkflowModifiers', () => {
    it('returns an object with all modifier sources combined', () => {
      const result = consolidateWorkflowModifiers();
      expect(typeof result).toBe('object');
      expect(result).not.toBeNull();
    });
  });
});
```

**Step 2: Run test to verify it fails**

```bash
npm test -- --testPathPattern="specialProvisionsUtils" --watchAll=false
```

Expected: FAIL with "Cannot find module"

**Step 3: Write implementation**

```typescript
// src/utils/materialId/specialProvisionsUtils.ts
import { numericSpecialProvisionsLabelingModifiers } from '@/server/attachment3/numericSpecialProvisionsLabelingModifiers';
import { aCodeLabelingModifiers } from '@/server/attachment3/aCodeLabelingModifiers';

/**
 * Filters a source map to only include entries whose keys are in the provided array.
 * Used for extracting relevant special provisions from larger modifier maps.
 */
export const filterMatchingKeys = <T>(
  sourceMap: Record<string, T>,
  keys: string[]
): Record<string, T> => {
  return keys.reduce((acc, key) => {
    if (sourceMap[key] !== undefined) {
      acc[key] = sourceMap[key];
    }
    return acc;
  }, {} as Record<string, T>);
};

/**
 * Consolidates all workflow modifier sources into a single lookup object.
 * Used by MaterialIDScreen to find modifiers from any source.
 */
export const consolidateWorkflowModifiers = (): Record<string, any> => {
  return {
    ...numericSpecialProvisionsLabelingModifiers,
    ...aCodeLabelingModifiers,
  };
};
```

**Step 4: Run test to verify it passes**

```bash
npm test -- --testPathPattern="specialProvisionsUtils" --watchAll=false
```

Expected: PASS (5 tests)

**Step 5: Commit**

```bash
git add src/utils/materialId/specialProvisionsUtils.ts src/utils/materialId/__tests__/specialProvisionsUtils.test.ts
git commit -m "feat(utils): add special provisions filtering utilities"
```

---

### Task 0.3: A6 Paragraph Handlers

**Files:**
- Create: `src/utils/materialId/a6ParagraphHandlers.ts`
- Create: `src/utils/materialId/__tests__/a6ParagraphHandlers.test.ts`

**Step 1: Write failing tests**

```typescript
// src/utils/materialId/__tests__/a6ParagraphHandlers.test.ts
import { getA6Modifiers, isA6Paragraph } from '../a6ParagraphHandlers';

describe('a6ParagraphHandlers', () => {
  describe('isA6Paragraph', () => {
    it('returns true for A6.4', () => {
      expect(isA6Paragraph('A6.4')).toBe(true);
    });

    it('returns true for A6.15', () => {
      expect(isA6Paragraph('A6.15')).toBe(true);
    });

    it('returns false for A7.1', () => {
      expect(isA6Paragraph('A7.1')).toBe(false);
    });

    it('returns false for empty string', () => {
      expect(isA6Paragraph('')).toBe(false);
    });
  });

  describe('getA6Modifiers', () => {
    it('returns modifiers for A6.4', () => {
      const result = getA6Modifiers('A6.4');
      expect(result).not.toBeNull();
      expect(typeof result).toBe('object');
    });

    it('returns null for unknown paragraph', () => {
      const result = getA6Modifiers('A99.99');
      expect(result).toBeNull();
    });

    it('returns null for non-A6 paragraph', () => {
      const result = getA6Modifiers('A7.1');
      expect(result).toBeNull();
    });
  });
});
```

**Step 2: Run test to verify it fails**

```bash
npm test -- --testPathPattern="a6ParagraphHandlers" --watchAll=false
```

Expected: FAIL

**Step 3: Write implementation**

```typescript
// src/utils/materialId/a6ParagraphHandlers.ts
import { A6_4WorkflowModifiers } from '@/server/attachment6/A6_4WorkflowModifiers';
import { A6_5WorkflowModifiers } from '@/server/attachment6/A6_5WorkflowModifiers';
import { A6_6WorkflowModifiers } from '@/server/attachment6/A6_6WorkflowModifiers';
import { A6_9WorkflowModifiers } from '@/server/attachment6/A6_9WorkflowModifiers';
import { A6_15WorkflowModifiers } from '@/server/attachment6/A6_15WorkflowModifiers';

/**
 * Maps A6 packaging paragraph codes to their workflow modifier objects.
 */
const A6_MODIFIER_MAP: Record<string, Record<string, any>> = {
  'A6.4': A6_4WorkflowModifiers,
  'A6.5': A6_5WorkflowModifiers,
  'A6.6': A6_6WorkflowModifiers,
  'A6.9': A6_9WorkflowModifiers,
  'A6.15': A6_15WorkflowModifiers,
};

/**
 * Checks if a packaging paragraph is an A6 paragraph with modifiers.
 */
export const isA6Paragraph = (paragraph: string): boolean => {
  return paragraph in A6_MODIFIER_MAP;
};

/**
 * Returns workflow modifiers for a given A6 packaging paragraph.
 * Returns null if the paragraph is not an A6 paragraph or has no modifiers.
 */
export const getA6Modifiers = (
  packagingParagraph: string
): Record<string, any> | null => {
  return A6_MODIFIER_MAP[packagingParagraph] || null;
};
```

**Step 4: Run test to verify it passes**

```bash
npm test -- --testPathPattern="a6ParagraphHandlers" --watchAll=false
```

Expected: PASS (6 tests)

**Step 5: Commit**

```bash
git add src/utils/materialId/a6ParagraphHandlers.ts src/utils/materialId/__tests__/a6ParagraphHandlers.test.ts
git commit -m "feat(utils): add A6 paragraph modifier lookup utilities"
```

---

### Task 0.4: UNID Routing Utility

**Files:**
- Create: `src/utils/navigation/unidRouting.ts`
- Create: `src/utils/navigation/__tests__/unidRouting.test.ts`

**Step 1: Write failing tests**

```typescript
// src/utils/navigation/__tests__/unidRouting.test.ts
import { getSpecialtyRoute, getNextRoute, SPECIALTY_UNIDS } from '../unidRouting';

describe('unidRouting', () => {
  describe('getSpecialtyRoute', () => {
    it('returns UN3166FuelEntryScreen for UN3166', () => {
      expect(getSpecialtyRoute('UN3166')).toBe('UN3166FuelEntryScreen');
    });

    it('returns LithiumBatteriesPrepScreen for UN3090', () => {
      expect(getSpecialtyRoute('UN3090')).toBe('LithiumBatteriesPrepScreen');
    });

    it('returns LithiumBatteriesPrepScreen for UN3480', () => {
      expect(getSpecialtyRoute('UN3480')).toBe('LithiumBatteriesPrepScreen');
    });

    it('returns null for unknown UNID', () => {
      expect(getSpecialtyRoute('UN9999')).toBeNull();
    });
  });

  describe('getNextRoute', () => {
    it('returns specialty route when UNID has one', () => {
      expect(getNextRoute('UN3166', 'DefaultRoute')).toBe('UN3166FuelEntryScreen');
    });

    it('returns default route when UNID has no specialty route', () => {
      expect(getNextRoute('UN9999', 'DefaultRoute')).toBe('DefaultRoute');
    });
  });

  describe('SPECIALTY_UNIDS', () => {
    it('contains UN3166', () => {
      expect(SPECIALTY_UNIDS).toContain('UN3166');
    });

    it('contains lithium battery UNIDs', () => {
      expect(SPECIALTY_UNIDS).toContain('UN3090');
      expect(SPECIALTY_UNIDS).toContain('UN3480');
    });
  });
});
```

**Step 2: Run test to verify it fails**

```bash
npm test -- --testPathPattern="unidRouting" --watchAll=false
```

Expected: FAIL

**Step 3: Write implementation**

```typescript
// src/utils/navigation/unidRouting.ts

/**
 * Maps UNIDs to their specialty screen routes.
 * These materials require additional preparation steps beyond standard flow.
 */
const UNID_ROUTE_MAP: Record<string, string> = {
  'UN3166': 'UN3166FuelEntryScreen',
  'UN2807': 'MagnetizedMaterialPrepScreen',
  'UN1845': 'DryIcePrepScreen',
  'UN3090': 'LithiumBatteriesPrepScreen',
  'UN3091': 'LithiumBatteriesPrepScreen',
  'UN3480': 'LithiumBatteriesPrepScreen',
  'UN3481': 'LithiumBatteriesPrepScreen',
  'UN3529': 'EnginesInternalCombustion',
  'UN3171': 'BatteryPoweredVehicle',
  'UN3072': 'LifeSavingAppliances',
  'UN2990': 'LifeSavingAppliances',
  'UN3316': 'KitPreparationScreen',
  'UN3268': 'SafetyDevicesPreparationScreen',
};

/**
 * List of all UNIDs that have specialty screens.
 */
export const SPECIALTY_UNIDS = Object.keys(UNID_ROUTE_MAP);

/**
 * Returns the specialty screen route for a UNID, or null if none exists.
 */
export const getSpecialtyRoute = (unid: string): string | null => {
  return UNID_ROUTE_MAP[unid] || null;
};

/**
 * Returns the specialty route for a UNID, or the default route if none exists.
 */
export const getNextRoute = (unid: string, defaultRoute: string): string => {
  return UNID_ROUTE_MAP[unid] || defaultRoute;
};

/**
 * Checks if a UNID requires a specialty screen.
 */
export const hasSpecialtyScreen = (unid: string): boolean => {
  return unid in UNID_ROUTE_MAP;
};
```

**Step 4: Run test to verify it passes**

```bash
npm test -- --testPathPattern="unidRouting" --watchAll=false
```

Expected: PASS (7 tests)

**Step 5: Commit**

```bash
git add src/utils/navigation/unidRouting.ts src/utils/navigation/__tests__/unidRouting.test.ts
git commit -m "feat(utils): add UNID routing utilities for specialty screens"
```

---

### Task 0.5: EQ/LQ Eligibility Utility

**Files:**
- Create: `src/utils/eligibility/eqLqEligibility.ts`
- Create: `src/utils/eligibility/__tests__/eqLqEligibility.test.ts`

**Step 1: Write failing tests**

```typescript
// src/utils/eligibility/__tests__/eqLqEligibility.test.ts
import {
  EligibilityResult,
  calculateEligibility,
  QuantityType,
} from '../eqLqEligibility';

describe('eqLqEligibility', () => {
  describe('calculateEligibility', () => {
    it('returns excepted quantity eligible for small amounts', () => {
      const result = calculateEligibility({
        quantity: 0.5,
        unit: 'L',
        eqMaxInner: 1,
        lqMaxInner: 5,
      });
      expect(result.exceptedQuantity).toBe(true);
      expect(result.limitedQuantity).toBe(true);
      expect(result.standardQuantity).toBe(true);
    });

    it('returns only limited and standard for medium amounts', () => {
      const result = calculateEligibility({
        quantity: 2,
        unit: 'L',
        eqMaxInner: 1,
        lqMaxInner: 5,
      });
      expect(result.exceptedQuantity).toBe(false);
      expect(result.limitedQuantity).toBe(true);
      expect(result.standardQuantity).toBe(true);
    });

    it('returns only standard for large amounts', () => {
      const result = calculateEligibility({
        quantity: 10,
        unit: 'L',
        eqMaxInner: 1,
        lqMaxInner: 5,
      });
      expect(result.exceptedQuantity).toBe(false);
      expect(result.limitedQuantity).toBe(false);
      expect(result.standardQuantity).toBe(true);
    });

    it('returns none eligible when eqMaxInner is 0', () => {
      const result = calculateEligibility({
        quantity: 0.5,
        unit: 'L',
        eqMaxInner: 0,
        lqMaxInner: 0,
      });
      expect(result.exceptedQuantity).toBe(false);
      expect(result.limitedQuantity).toBe(false);
    });
  });

  describe('QuantityType enum', () => {
    it('has expected values', () => {
      expect(QuantityType.EXCEPTED).toBe('excepted');
      expect(QuantityType.LIMITED).toBe('limited');
      expect(QuantityType.STANDARD).toBe('standard');
    });
  });
});
```

**Step 2: Run test to verify it fails**

```bash
npm test -- --testPathPattern="eqLqEligibility" --watchAll=false
```

Expected: FAIL

**Step 3: Write implementation**

```typescript
// src/utils/eligibility/eqLqEligibility.ts

export enum QuantityType {
  EXCEPTED = 'excepted',
  LIMITED = 'limited',
  STANDARD = 'standard',
}

export interface EligibilityResult {
  exceptedQuantity: boolean;
  limitedQuantity: boolean;
  standardQuantity: boolean;
  recommendedType: QuantityType;
  reason?: string;
}

export interface EligibilityInput {
  quantity: number;
  unit: string;
  eqMaxInner: number;
  lqMaxInner: number;
  prohibitedFromEQ?: boolean;
  prohibitedFromLQ?: boolean;
}

/**
 * Calculates quantity type eligibility based on material limits.
 * Returns which quantity types (excepted, limited, standard) the shipment qualifies for.
 */
export const calculateEligibility = (input: EligibilityInput): EligibilityResult => {
  const { quantity, eqMaxInner, lqMaxInner, prohibitedFromEQ, prohibitedFromLQ } = input;

  const exceptedQuantity = !prohibitedFromEQ && eqMaxInner > 0 && quantity <= eqMaxInner;
  const limitedQuantity = !prohibitedFromLQ && lqMaxInner > 0 && quantity <= lqMaxInner;
  const standardQuantity = true; // Always eligible for standard

  // Recommend the most restrictive eligible type (least paperwork)
  let recommendedType = QuantityType.STANDARD;
  if (limitedQuantity) recommendedType = QuantityType.LIMITED;
  if (exceptedQuantity) recommendedType = QuantityType.EXCEPTED;

  return {
    exceptedQuantity,
    limitedQuantity,
    standardQuantity,
    recommendedType,
  };
};

/**
 * Returns human-readable description of eligibility result.
 */
export const getEligibilityDescription = (result: EligibilityResult): string => {
  const eligible: string[] = [];
  if (result.exceptedQuantity) eligible.push('Excepted Quantity');
  if (result.limitedQuantity) eligible.push('Limited Quantity');
  if (result.standardQuantity) eligible.push('Standard Quantity');
  return eligible.join(', ');
};
```

**Step 4: Run test to verify it passes**

```bash
npm test -- --testPathPattern="eqLqEligibility" --watchAll=false
```

Expected: PASS (5 tests)

**Step 5: Commit**

```bash
git add src/utils/eligibility/eqLqEligibility.ts src/utils/eligibility/__tests__/eqLqEligibility.test.ts
git commit -m "feat(utils): add EQ/LQ eligibility calculation utilities"
```

---

### Task 0.6: Shipment Validation Schema

**Files:**
- Create: `src/utils/validation/shipmentSchema.ts`
- Create: `src/utils/validation/__tests__/shipmentSchema.test.ts`

**Step 1: Write failing tests**

```typescript
// src/utils/validation/__tests__/shipmentSchema.test.ts
import { addressValidationSchema, shipmentValidationSchema } from '../shipmentSchema';

describe('shipmentSchema', () => {
  describe('addressValidationSchema', () => {
    it('validates complete USA address', async () => {
      const address = {
        country: 'USA',
        location: 'Base XYZ',
        streetAddress: '123 Main St',
        city: 'Springfield',
        state: 'IL',
        zipCode: '62701',
      };
      await expect(addressValidationSchema.validate(address)).resolves.toBeTruthy();
    });

    it('requires state for USA addresses', async () => {
      const address = {
        country: 'USA',
        location: 'Base XYZ',
        streetAddress: '123 Main St',
        city: 'Springfield',
        zipCode: '62701',
      };
      await expect(addressValidationSchema.validate(address)).rejects.toThrow();
    });

    it('does not require state for non-USA addresses', async () => {
      const address = {
        country: 'Germany',
        location: 'Base ABC',
        streetAddress: '456 Other St',
        city: 'Berlin',
        zipCode: '10115',
      };
      await expect(addressValidationSchema.validate(address)).resolves.toBeTruthy();
    });
  });

  describe('shipmentValidationSchema', () => {
    it('validates complete shipment', async () => {
      const shipment = {
        tcn: 'TCN123456',
        poeOption: 'aerial',
        podOption: 'surface',
      };
      await expect(shipmentValidationSchema.validate(shipment)).resolves.toBeTruthy();
    });

    it('requires tcn', async () => {
      const shipment = {
        poeOption: 'aerial',
        podOption: 'surface',
      };
      await expect(shipmentValidationSchema.validate(shipment)).rejects.toThrow('TCN');
    });
  });
});
```

**Step 2: Run test to verify it fails**

```bash
npm test -- --testPathPattern="shipmentSchema" --watchAll=false
```

Expected: FAIL

**Step 3: Write implementation**

```typescript
// src/utils/validation/shipmentSchema.ts
import * as yup from 'yup';

/**
 * Validation schema for address fields.
 * State is conditionally required for USA addresses.
 */
export const addressValidationSchema = yup.object().shape({
  country: yup.string().required('Country is required'),
  location: yup.string().required('Location is required'),
  streetAddress: yup.string().required('Street address is required'),
  city: yup.string().required('City is required'),
  state: yup.string().when('country', {
    is: 'USA',
    then: (schema) => schema.required('State is required for USA addresses'),
    otherwise: (schema) => schema.optional(),
  }),
  zipCode: yup.string().required('ZIP code is required'),
});

/**
 * Validation schema for shipment creation form.
 */
export const shipmentValidationSchema = yup.object().shape({
  tcn: yup.string().required('TCN is required'),
  poeOption: yup.string().required('Port of Embarkation is required'),
  podOption: yup.string().required('Port of Debarkation is required'),
});

/**
 * Validation schema for preparer information.
 */
export const preparerValidationSchema = yup.object().shape({
  name: yup.string().required('Preparer name is required'),
  title: yup.string().required('Title is required'),
  certificationPlace: yup.string().required('Certification place is required'),
});
```

**Step 4: Run test to verify it passes**

```bash
npm test -- --testPathPattern="shipmentSchema" --watchAll=false
```

Expected: PASS (5 tests)

**Step 5: Commit**

```bash
git add src/utils/validation/shipmentSchema.ts src/utils/validation/__tests__/shipmentSchema.test.ts
git commit -m "feat(utils): add shipment validation schemas with yup"
```

---

### Task 0.7: Shipment Loader Utility

**Files:**
- Create: `src/utils/shipment/shipmentLoader.ts`
- Create: `src/utils/shipment/__tests__/shipmentLoader.test.ts`

**Step 1: Write failing tests**

```typescript
// src/utils/shipment/__tests__/shipmentLoader.test.ts
import { convertShipmentFile, SavedShipment } from '../shipmentLoader';

describe('shipmentLoader', () => {
  describe('convertShipmentFile', () => {
    it('converts file metadata to SavedShipment structure', () => {
      const metadata = {
        filename: 'TCN123456.json',
        name: 'TCN123456',
        lastModified: '2026-01-20T10:00:00Z',
        size: 1024,
      };

      const result = convertShipmentFile(metadata);

      expect(result.tcn).toBe('TCN123456');
      expect(result.filename).toBe('TCN123456.json');
      expect(result.lastModified).toBe('2026-01-20T10:00:00Z');
    });

    it('extracts TCN from filename without extension', () => {
      const metadata = {
        filename: 'SHIP-2026-001.json',
        name: 'SHIP-2026-001',
        lastModified: '2026-01-20T10:00:00Z',
        size: 512,
      };

      const result = convertShipmentFile(metadata);
      expect(result.tcn).toBe('SHIP-2026-001');
    });
  });
});
```

**Step 2: Run test to verify it fails**

```bash
npm test -- --testPathPattern="shipmentLoader" --watchAll=false
```

Expected: FAIL

**Step 3: Write implementation**

```typescript
// src/utils/shipment/shipmentLoader.ts

export interface FileMetadata {
  filename: string;
  name: string;
  lastModified: string;
  size: number;
}

export interface SavedShipment {
  tcn: string;
  filename: string;
  lastModified: string;
  unid?: string;
  hazardClass?: string;
  poe?: string;
  pod?: string;
  status?: string;
}

/**
 * Converts file metadata from storage to SavedShipment structure.
 */
export const convertShipmentFile = (metadata: FileMetadata): SavedShipment => {
  // Extract TCN from filename (remove .json extension)
  const tcn = metadata.name.replace(/\.json$/, '');

  return {
    tcn,
    filename: metadata.filename,
    lastModified: metadata.lastModified,
  };
};

/**
 * Enriches a SavedShipment with data from the shipment file content.
 */
export const enrichShipmentData = (
  shipment: SavedShipment,
  content: any
): SavedShipment => {
  return {
    ...shipment,
    unid: content?.hazardousMaterial?.unid,
    hazardClass: content?.hazardousMaterial?.hazardClass,
    poe: content?.shipment?.poeOption,
    pod: content?.shipment?.podOption,
    status: content?.status || 'draft',
  };
};
```

**Step 4: Run test to verify it passes**

```bash
npm test -- --testPathPattern="shipmentLoader" --watchAll=false
```

Expected: PASS (2 tests)

**Step 5: Commit**

```bash
git add src/utils/shipment/shipmentLoader.ts src/utils/shipment/__tests__/shipmentLoader.test.ts
git commit -m "feat(utils): add shipment file loader utilities"
```

---

### Task 0.8: SpecialtyMaterialScreen Component

**Files:**
- Create: `src/components/preparer/SpecialtyMaterialScreen.tsx`
- Create: `src/components/preparer/__tests__/SpecialtyMaterialScreen.test.tsx`

**Step 1: Write failing tests**

```typescript
// src/components/preparer/__tests__/SpecialtyMaterialScreen.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SpecialtyMaterialScreen } from '../SpecialtyMaterialScreen';

const mockMaterial = {
  unid: 'UN3166',
  properShippingName: 'Engines, internal combustion',
  hazardClass: '9',
  packingGroup: undefined,
};

describe('SpecialtyMaterialScreen', () => {
  const defaultProps = {
    title: 'Fuel Entry',
    material: mockMaterial,
    onBack: jest.fn(),
    onCancel: jest.fn(),
    onSaveExit: jest.fn(),
    onContinue: jest.fn(),
    children: <></>,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders title in header', () => {
    const { getByText } = render(<SpecialtyMaterialScreen {...defaultProps} />);
    expect(getByText('Fuel Entry')).toBeTruthy();
  });

  it('renders material info card with UNID', () => {
    const { getByText } = render(<SpecialtyMaterialScreen {...defaultProps} />);
    expect(getByText('UN3166')).toBeTruthy();
  });

  it('renders material proper shipping name', () => {
    const { getByText } = render(<SpecialtyMaterialScreen {...defaultProps} />);
    expect(getByText('Engines, internal combustion')).toBeTruthy();
  });

  it('calls onCancel when Cancel pressed', () => {
    const { getByText } = render(<SpecialtyMaterialScreen {...defaultProps} />);
    fireEvent.press(getByText('Cancel'));
    expect(defaultProps.onCancel).toHaveBeenCalled();
  });

  it('calls onSaveExit when Save & Exit pressed', () => {
    const { getByText } = render(<SpecialtyMaterialScreen {...defaultProps} />);
    fireEvent.press(getByText('Save & Exit'));
    expect(defaultProps.onSaveExit).toHaveBeenCalled();
  });

  it('calls onContinue when Continue pressed', () => {
    const { getByText } = render(<SpecialtyMaterialScreen {...defaultProps} />);
    fireEvent.press(getByText('Save & Continue'));
    expect(defaultProps.onContinue).toHaveBeenCalled();
  });

  it('disables continue button when continueDisabled is true', () => {
    const { getByText } = render(
      <SpecialtyMaterialScreen {...defaultProps} continueDisabled={true} />
    );
    const continueButton = getByText('Save & Continue');
    expect(continueButton.props.accessibilityState?.disabled).toBe(true);
  });

  it('renders info banner when provided', () => {
    const { getByText } = render(
      <SpecialtyMaterialScreen {...defaultProps} infoBanner="Important info" />
    );
    expect(getByText('Important info')).toBeTruthy();
  });

  it('renders warning banner when provided', () => {
    const { getByText } = render(
      <SpecialtyMaterialScreen {...defaultProps} warningBanner="Warning message" />
    );
    expect(getByText('Warning message')).toBeTruthy();
  });

  it('renders children content', () => {
    const { getByTestId } = render(
      <SpecialtyMaterialScreen {...defaultProps}>
        <></>
      </SpecialtyMaterialScreen>
    );
    // Children should be rendered inside scroll view
    expect(getByTestId('specialty-content')).toBeTruthy();
  });
});
```

**Step 2: Run test to verify it fails**

```bash
npm test -- --testPathPattern="SpecialtyMaterialScreen" --watchAll=false
```

Expected: FAIL

**Step 3: Write implementation**

```typescript
// src/components/preparer/SpecialtyMaterialScreen.tsx
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import {
  ScreenHeader,
  ActionFooter,
  DetailCard,
  InfoBox,
  colors,
  spacing,
} from '@/components/ui';

export interface MaterialInfo {
  unid: string;
  properShippingName: string;
  hazardClass: string;
  packingGroup?: string;
}

export interface SpecialtyMaterialScreenProps {
  // Header
  title: string;
  onBack: () => void;

  // Material info panel
  material: MaterialInfo;

  // Footer actions
  onCancel: () => void;
  onSaveExit: () => void;
  onContinue: () => void;
  continueDisabled?: boolean;
  continueLabel?: string;

  // Content
  children: React.ReactNode;

  // Optional banners
  infoBanner?: string;
  warningBanner?: string;
}

/**
 * Wrapper component for specialty material screens.
 * Provides consistent header, material info card, scroll area, and 3-button footer.
 */
export const SpecialtyMaterialScreen: React.FC<SpecialtyMaterialScreenProps> = ({
  title,
  onBack,
  material,
  onCancel,
  onSaveExit,
  onContinue,
  continueDisabled = false,
  continueLabel = 'Save & Continue',
  children,
  infoBanner,
  warningBanner,
}) => {
  const materialDetails = [
    { label: 'UN/ID', value: material.unid },
    { label: 'Proper Shipping Name', value: material.properShippingName },
    { label: 'Hazard Class', value: material.hazardClass },
    ...(material.packingGroup
      ? [{ label: 'Packing Group', value: material.packingGroup }]
      : []),
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title={title} onBack={onBack} />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <DetailCard title="Material Information" items={materialDetails} />

          {infoBanner && (
            <InfoBox variant="info" message={infoBanner} />
          )}

          {warningBanner && (
            <InfoBox variant="warning" message={warningBanner} />
          )}

          <View testID="specialty-content" style={styles.content}>
            {children}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <ActionFooter
        buttons={[
          { label: 'Cancel', onPress: onCancel, variant: 'ghost' },
          { label: 'Save & Exit', onPress: onSaveExit, variant: 'outline' },
          {
            label: continueLabel,
            onPress: onContinue,
            disabled: continueDisabled,
          },
        ]}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  content: {
    gap: spacing.md,
  },
});

export default SpecialtyMaterialScreen;
```

**Step 4: Run test to verify it passes**

```bash
npm test -- --testPathPattern="SpecialtyMaterialScreen" --watchAll=false
```

Expected: PASS (10 tests)

**Step 5: Update exports**

```typescript
// Add to src/components/preparer/index.ts
export * from './SpecialtyMaterialScreen';
```

**Step 6: Commit**

```bash
git add src/components/preparer/SpecialtyMaterialScreen.tsx src/components/preparer/__tests__/SpecialtyMaterialScreen.test.tsx src/components/preparer/index.ts
git commit -m "feat(preparer): add SpecialtyMaterialScreen wrapper component"
```

---

## Phase 1: Shipment Creation Screens

### Task 1.1: DisclaimerScreen Theme Tokens (Light Touch)

**Files:**
- Modify: `src/screens/preparer/DisclaimerScreen.tsx`

**Step 1: Read current file**

```bash
# Review the current implementation
cat src/screens/preparer/DisclaimerScreen.tsx
```

**Step 2: Update styles to use theme tokens**

Replace any hardcoded colors/spacing with theme token imports. The file is already small (~51 lines) and uses ConfirmationCard, so changes are minimal.

**Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors

**Step 4: Commit**

```bash
git add src/screens/preparer/DisclaimerScreen.tsx
git commit -m "refactor(preparer): apply theme tokens to DisclaimerScreen"
```

---

### Task 1.2: PreparerHomeScreen Light Refactor

**Files:**
- Modify: `src/screens/preparer/PreparerHomeScreen.tsx`

**Step 1: Read current implementation**

Review the current 423-line file for:
- Hardcoded colors/spacing
- Inline shipment loading logic

**Step 2: Extract shipment loading to utility**

Move `convertShipmentFile` usage to import from `src/utils/shipment/shipmentLoader.ts`.

**Step 3: Replace hardcoded styles with theme tokens**

Update StyleSheet to use `colors`, `spacing`, `typography` from `@/components/ui`.

**Step 4: Verify tests pass**

```bash
npm test -- --testPathPattern="PreparerHomeScreen" --watchAll=false
```

Expected: PASS

**Step 5: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

**Step 6: Commit**

```bash
git add src/screens/preparer/PreparerHomeScreen.tsx
git commit -m "refactor(preparer): apply theme tokens and extract utilities from PreparerHomeScreen"
```

---

### Task 1.3: ShipmentCreationScreen Heavy Refactor

**Files:**
- Modify: `src/screens/preparer/ShipmentCreationScreen.tsx`

**Step 1: Read current implementation (751 lines)**

Identify:
- Inline validation schema (~60 lines)
- Duplicate POE/POD handlers
- StyleSheet bloat

**Step 2: Import validation schema**

Replace inline yup schema with import from `src/utils/validation/shipmentSchema.ts`.

**Step 3: Consolidate POE/POD handlers**

Create factory function for POE/POD option change handlers.

**Step 4: Update StyleSheet with theme tokens**

Replace hardcoded values with theme tokens.

**Step 5: Verify tests pass**

```bash
npm test -- --testPathPattern="ShipmentCreationScreen" --watchAll=false
```

**Step 6: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

**Step 7: Commit**

```bash
git add src/screens/preparer/ShipmentCreationScreen.tsx
git commit -m "refactor(preparer): heavy refactor ShipmentCreationScreen with extracted utilities"
```

---

## Phase 2: Material Identification Screens

### Task 2.1: MaterialIDScreen Heavy Refactor

**Files:**
- Modify: `src/components/MaterialIDScreen.tsx`
- Create: `src/screens/preparer/MaterialIDScreen.tsx` (new location)

**Step 1: Read current implementation (1,502 lines)**

This is a complex screen. Identify extraction targets:
- Special provisions filtering (3 occurrences)
- A6 paragraph handlers (5 conditionals)
- Temperature conversion
- StyleSheet (425+ lines)

**Step 2: Import utilities**

```typescript
import { filterMatchingKeys, consolidateWorkflowModifiers } from '@/utils/materialId/specialProvisionsUtils';
import { getA6Modifiers, isA6Paragraph } from '@/utils/materialId/a6ParagraphHandlers';
import { parseTemperatureInput } from '@/utils/materialId/temperatureConversion';
```

**Step 3: Replace inline logic with utility calls**

Replace repeated patterns:
```typescript
// Before (repeated 5x)
if (packagingParagraph === 'A6.4') {
  // 15 lines of logic
} else if (packagingParagraph === 'A6.5') {
  // 15 lines of logic
}
// ... etc

// After
const modifiers = getA6Modifiers(packagingParagraph);
if (modifiers) {
  // Single block using modifiers
}
```

**Step 4: Update StyleSheet with theme tokens**

Reduce from 425 lines to ~200 lines by using theme tokens.

**Step 5: Move to new location**

```bash
mv src/components/MaterialIDScreen.tsx src/screens/preparer/MaterialIDScreen.tsx
```

**Step 6: Update exports**

Add to `src/screens/preparer/index.ts`.

**Step 7: Update navigation imports**

Update `src/components/MainLayoutNavigator.tsx` to import from new location.

**Step 8: Verify tests pass**

```bash
npm test -- --testPathPattern="MaterialID" --watchAll=false
```

**Step 9: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

**Step 10: Commit**

```bash
git add -A
git commit -m "refactor(preparer): heavy refactor MaterialIDScreen with utility extractions"
```

---

### Task 2.2: ExplosiveDetailsWizard Refactor

**Files:**
- Modify: `src/components/ExplosiveDetailsWizardNew.tsx` → `src/screens/preparer/ExplosiveDetailsWizardScreen.tsx`

**Step 1: Read current implementation (893 lines)**

**Step 2: Extract container factory function**

**Step 3: Update StyleSheet with theme tokens**

**Step 4: Move and rename file**

**Step 5: Update navigation**

**Step 6: Verify and commit**

```bash
git commit -m "refactor(preparer): refactor ExplosiveDetailsWizard with theme tokens"
```

---

## Phase 3: Quantity Entry Screens

### Task 3.1: QuantityEntryScreen Heavy Refactor

**Files:**
- Modify: `src/components/QuantityEntryScreen.tsx` → `src/screens/preparer/QuantityEntryScreen.tsx`

**Step 1: Read current implementation (709 lines)**

**Step 2: Import eligibility utility**

```typescript
import { calculateEligibility, QuantityType } from '@/utils/eligibility/eqLqEligibility';
```

**Step 3: Replace inline eligibility logic (~100 lines) with utility call**

**Step 4: Update StyleSheet with theme tokens**

**Step 5: Move to new location and update exports**

**Step 6: Verify and commit**

```bash
git commit -m "refactor(preparer): heavy refactor QuantityEntryScreen with eligibility utilities"
```

---

### Task 3.2: SpecialProvisionsAcknowledgementScreen Refactor

**Files:**
- Modify: `src/components/SpecialProvisionsAcknowledgementScreen.tsx` → `src/screens/preparer/`

**Step 1: Read current implementation (351 lines)**

**Step 2: Import UNID routing utility**

```typescript
import { getNextRoute, hasSpecialtyScreen } from '@/utils/navigation/unidRouting';
```

**Step 3: Replace 11 UNID conditionals with utility call**

```typescript
// Before
if (unid === 'UN3166') {
  navigation.navigate('UN3166FuelEntryScreen');
} else if (unid === 'UN2807') {
  navigation.navigate('MagnetizedMaterialPrepScreen');
}
// ... 9 more conditionals

// After
const route = getNextRoute(unid, 'PackagingScreen');
navigation.navigate(route);
```

**Step 4: Update StyleSheet**

**Step 5: Move and update exports**

**Step 6: Verify and commit**

```bash
git commit -m "refactor(preparer): refactor SpecialProvisionsAcknowledgement with routing utilities"
```

---

## Phase 4: Specialty Screens

### Task 4.1: EnginesInternalCombustion (Simple)

**Files:**
- Modify: `src/components/EnginesInternalCombustion.tsx` → `src/screens/preparer/`

**Step 1: Read current implementation (811 lines)**

**Step 2: Wrap with SpecialtyMaterialScreen**

Replace SafeAreaView/ScrollView/ActionFooter pattern with SpecialtyMaterialScreen wrapper.

**Step 3: Keep only unique form content**

Target: ~150 lines

**Step 4: Move and update navigation**

**Step 5: Commit**

```bash
git commit -m "refactor(preparer): migrate EnginesInternalCombustion to SpecialtyMaterialScreen"
```

---

### Task 4.2: AbsorbentCushioningRequirements (Light Touch)

**Files:**
- Modify: `src/components/AbsorbentCushioningRequirements.tsx`

This is already small (252 lines). Apply theme tokens only.

**Commit**

```bash
git commit -m "refactor(preparer): apply theme tokens to AbsorbentCushioningRequirements"
```

---

### Task 4.3: UN3166FuelEntryScreen

**Files:**
- Modify: `src/components/UN3166FuelEntryScreen.tsx` → `src/screens/preparer/`

**Step 1: Read current implementation (769 lines)**

**Step 2: Wrap with SpecialtyMaterialScreen**

**Step 3: Keep multi-tank entry and fuel type picker logic**

Target: ~180 lines

**Commit**

```bash
git commit -m "refactor(preparer): migrate UN3166FuelEntryScreen to SpecialtyMaterialScreen"
```

---

### Task 4.4: DryIcePrepScreen

**Files:**
- Modify: `src/components/DryIcePrepScreen.tsx` → `src/screens/preparer/`

Target: 1,603 → ~250 lines

**Commit**

```bash
git commit -m "refactor(preparer): migrate DryIcePrepScreen to SpecialtyMaterialScreen"
```

---

### Task 4.5: LifeSavingAppliances

**Files:**
- Modify: `src/components/LifeSavingAppliances.tsx` → `src/screens/preparer/`

Target: 1,002 → ~200 lines

**Commit**

```bash
git commit -m "refactor(preparer): migrate LifeSavingAppliances to SpecialtyMaterialScreen"
```

---

### Task 4.6: KitPreparationScreen

**Files:**
- Modify: `src/components/KitPreparationScreen.tsx` → `src/screens/preparer/`

Target: 1,132 → ~220 lines

**Commit**

```bash
git commit -m "refactor(preparer): migrate KitPreparationScreen to SpecialtyMaterialScreen"
```

---

### Task 4.7: LithiumBatteriesPrepScreen (Complex - Internal Steps)

**Files:**
- Modify: `src/components/LithiumBatteriesPrepScreen.tsx` → `src/screens/preparer/`

This screen has a 4-step internal wizard. Use SpecialtyMaterialScreen with local `currentStep` state.

Target: 1,317 → ~300 lines

**Commit**

```bash
git commit -m "refactor(preparer): migrate LithiumBatteriesPrepScreen to SpecialtyMaterialScreen"
```

---

### Task 4.8: BatteryPoweredVehicle (Complex - SP134 Redirect)

**Files:**
- Modify: `src/components/BatteryPoweredVehicle.tsx` → `src/screens/preparer/`

Target: 1,875 → ~280 lines

**Commit**

```bash
git commit -m "refactor(preparer): migrate BatteryPoweredVehicle to SpecialtyMaterialScreen"
```

---

## Phase 5: Navigation & Cleanup

### Task 5.1: Update MainLayoutNavigator Imports

**Files:**
- Modify: `src/components/MainLayoutNavigator.tsx`

Update all imports for migrated screens to use `@/screens/preparer`.

**Commit**

```bash
git commit -m "refactor(nav): update imports for Phase 1-3 migrated screens"
```

---

### Task 5.2: Update Screen Exports

**Files:**
- Modify: `src/screens/preparer/index.ts`

Ensure all migrated screens are exported.

**Commit**

```bash
git commit -m "feat(preparer): export all Phase 1-3 migrated screens"
```

---

### Task 5.3: Delete Old Files

**Files to delete:**
- Old screen files in `src/components/` that were migrated

**Commit**

```bash
git commit -m "chore: delete old Phase 1-3 screen files"
```

---

### Task 5.4: Final Verification

**Step 1: Run all tests**

```bash
npm test -- --watchAll=false --testPathIgnorePatterns=".worktrees"
```

**Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

**Step 3: Verify line counts**

```bash
wc -l src/screens/preparer/*.tsx
```

Target: ~4,585 total lines (66% reduction from 13,441)

---

## Summary

| Phase | Tasks | Target Reduction |
|-------|-------|------------------|
| Phase 0: Foundation | 8 tasks | +460 lines (new utilities) |
| Phase 1: Shipment | 3 tasks | 1,225 → 795 (35%) |
| Phase 2: Material ID | 2 tasks | 2,395 → 1,100 (54%) |
| Phase 3: Quantity | 2 tasks | 1,060 → 550 (48%) |
| Phase 4: Specialty | 8 tasks | 8,761 → 1,680 (81%) |
| Phase 5: Cleanup | 4 tasks | — |
| **Total** | **27 tasks** | **13,441 → ~4,585 (66%)** |
