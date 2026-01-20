# Preparer Workflow Phase 1-3 + Specialty Screens UI Refactor Design

**Date:** 2026-01-20
**Scope:** Phases 1-3 + Specialty Screens (~15 screens, ~13,400 lines)
**Target Reduction:** 66% (~13,400 → ~4,585 lines)

---

## Overview

This document defines the refactoring approach for the remaining preparer workflow screens not addressed in Phases 4-6. The design follows established patterns from the Phase 4-6 refactor while introducing new shared components for specialty material screens.

### Approach: Proportional Refactoring

- **Heavy refactor (500+ lines):** 11 screens — full component extraction, utility consolidation, theme tokens
- **Light touch (<500 lines):** 4 screens — theme token updates, minimal structural changes

### Key Design Decisions

| Decision | Choice |
|----------|--------|
| Specialty screens | `SpecialtyMaterialScreen` wrapper component |
| MaterialIDScreen | Extract utilities, keep as single screen |
| StyleSheets | Inline with theme tokens |
| Validation logic | Extract to utility functions |
| File location | Move to `src/screens/preparer/` |
| Implementation order | Foundation → Phase 1 → Phase 2-3 → Specialty |

---

## Current State Analysis

### Line Counts by Category

| Category | Screens | Total Lines | Largest File |
|----------|---------|-------------|--------------|
| Phase 1 (Shipment) | 3 | 1,225 | ShipmentCreationScreen (751) |
| Phase 2-3 (Material/Qty) | 4 | 3,455 | MaterialIDScreen (1,502) |
| Specialty | 8 | 8,761 | BatteryPoweredVehicle (1,875) |
| **Total** | **15** | **13,441** | — |

### Identified Patterns (Repeated Across Screens)

1. **3-button footer** (Cancel/Save & Exit/Continue) — identical in all specialty screens
2. **Special provisions filtering** — appears 3+ times in MaterialIDScreen
3. **A6 paragraph handling** — 5 identical conditional blocks
4. **Form validation `useMemo`** — same pattern in every screen
5. **Info/Warning panels** — similar colored containers everywhere
6. **StyleSheet bloat** — 400-1300 lines of styles per screen

---

## Foundation Components

### SpecialtyMaterialScreen Wrapper

**Location:** `src/components/preparer/SpecialtyMaterialScreen.tsx`
**Estimated size:** ~100 lines

**Purpose:** Provides the common shell for all 7 specialty material screens, handling header, info panel, scroll container, and 3-button footer.

```typescript
interface SpecialtyMaterialScreenProps {
  // Header
  title: string;
  onBack: () => void;

  // Material info panel
  material: {
    unid: string;
    properShippingName: string;
    hazardClass: string;
    packingGroup?: string;
  };

  // Footer actions
  onCancel: () => void;
  onSaveExit: () => void;
  onContinue: () => void;
  continueDisabled?: boolean;
  continueLabel?: string; // Default: "Save & Continue"

  // Content
  children: React.ReactNode;

  // Optional info/warning banners
  infoBanner?: string;
  warningBanner?: string;
}
```

**Renders:**
```
SafeAreaView
├── ScreenHeader (title, back button)
├── KeyboardAvoidingView
│   └── ScrollView
│       ├── MaterialInfoCard (UNID, PSN, class, PG)
│       ├── InfoBox? (if infoBanner)
│       ├── InfoBox variant="warning"? (if warningBanner)
│       └── {children} (form content)
└── ActionFooter (Cancel, Save & Exit, Continue)
```

---

## Utility Extractions

### Material ID Utilities

**Location:** `src/utils/materialId/`

#### `specialProvisionsUtils.ts` (~40 lines)

```typescript
// Filters a map to only include keys present in the array
export const filterMatchingKeys = <T>(
  sourceMap: Record<string, T>,
  keys: string[]
): Record<string, T> => {
  return keys.reduce((acc, key) => {
    if (sourceMap[key]) acc[key] = sourceMap[key];
    return acc;
  }, {} as Record<string, T>);
};

// Consolidates all workflow modifier sources
export const consolidateWorkflowModifiers = (): Record<string, any> => {
  return {
    ...numericSpecialProvisionsLabelingModifiers,
    ...aCodeLabelingModifiers,
    // ... all modifier sources
  };
};
```

#### `a6ParagraphHandlers.ts` (~60 lines)

```typescript
// Maps A6 paragraph codes to their workflow modifiers
const A6_MODIFIER_MAP: Record<string, Record<string, any>> = {
  'A6.4': A6_4WorkflowModifiers,
  'A6.5': A6_5WorkflowModifiers,
  'A6.6': A6_6WorkflowModifiers,
  'A6.9': A6_9WorkflowModifiers,
  'A6.15': A6_15WorkflowModifiers,
};

// Returns modifiers for a given packaging paragraph
export const getA6Modifiers = (
  packagingParagraph: string
): Record<string, any> | null => {
  return A6_MODIFIER_MAP[packagingParagraph] || null;
};
```

#### `temperatureConversion.ts` (~30 lines)

```typescript
export const fahrenheitToCelsius = (f: number): number =>
  (f - 32) * 5 / 9;

export const celsiusToFahrenheit = (c: number): number =>
  c * 9 / 5 + 32;

export const parseTemperatureInput = (
  value: string,
  unit: 'F' | 'C'
): { fahrenheit: number; celsius: number } => {
  const num = parseFloat(value);
  if (unit === 'F') {
    return { fahrenheit: num, celsius: fahrenheitToCelsius(num) };
  }
  return { fahrenheit: celsiusToFahrenheit(num), celsius: num };
};
```

### Eligibility Utilities

**Location:** `src/utils/eligibility/`

#### `eqLqEligibility.ts` (~80 lines)

```typescript
interface EligibilityResult {
  exceptedQuantity: boolean;
  limitedQuantity: boolean;
  standardQuantity: boolean;
  reason?: string;
}

export const calculateEligibility = (
  quantity: number,
  unit: string,
  material: HazardousMaterial,
  packagingType: string
): EligibilityResult => {
  // Waterfall check: Excepted → Limited → Standard
  // Returns first matching eligibility
};
```

### Navigation Utilities

**Location:** `src/utils/navigation/`

#### `unidRouting.ts` (~50 lines)

```typescript
// Maps UNIDs to their specialty screen routes
const UNID_ROUTE_MAP: Record<string, string> = {
  'UN3166': 'UN3166FuelEntryScreen',
  'UN2807': 'MagnetizedMaterialPrepScreen',
  'UN1845': 'DryIcePrepScreen',
  'UN3090': 'LithiumBatteriesPrepScreen',
  'UN3480': 'LithiumBatteriesPrepScreen',
  'UN3529': 'EnginesInternalCombustion',
  'UN3171': 'BatteryPoweredVehicle',
  'UN3072': 'LifeSavingAppliances',
  'UN2990': 'LifeSavingAppliances',
  'UN3316': 'KitPreparationScreen',
  'UN3268': 'SafetyDevicesPreparationScreen',
};

export const getSpecialtyRoute = (unid: string): string | null =>
  UNID_ROUTE_MAP[unid] || null;

export const getNextRoute = (unid: string, defaultRoute: string): string =>
  UNID_ROUTE_MAP[unid] || defaultRoute;
```

### Shipment Utilities

**Location:** `src/utils/shipment/`

#### `shipmentLoader.ts` (~40 lines)

```typescript
export const convertShipmentFile = (
  metadata: FileMetadata
): SavedShipment => {
  // Convert file metadata to SavedShipment structure
};

export const loadShipmentsList = async (): Promise<SavedShipment[]> => {
  // Load and convert all shipment files from storage
};
```

### Validation Utilities

**Location:** `src/utils/validation/`

#### `shipmentSchema.ts` (~60 lines)

```typescript
import * as yup from 'yup';

export const addressValidationSchema = yup.object().shape({
  country: yup.string().required('Country is required'),
  location: yup.string().required('Location is required'),
  streetAddress: yup.string().required('Street address is required'),
  city: yup.string().required('City is required'),
  state: yup.string().when('country', {
    is: 'USA',
    then: yup.string().required('State is required'),
  }),
  zipCode: yup.string().required('ZIP code is required'),
});

export const shipmentValidationSchema = yup.object().shape({
  tcn: yup.string().required('TCN is required'),
  poeOption: yup.string().required(),
  podOption: yup.string().required(),
  shipper: addressValidationSchema,
  consignee: addressValidationSchema,
  // ... additional fields
});
```

---

## Phase 1: Shipment Creation Screens

### DisclaimerScreen (51 → ~45 lines)

**Approach:** Light touch
**Changes:**
- Replace hardcoded colors with theme tokens
- Already uses `ConfirmationCard` — minimal changes needed

### PreparerHomeScreen (423 → ~350 lines)

**Approach:** Light touch
**Changes:**
- Replace hardcoded styles with theme tokens
- Extract shipment loading logic to `utils/shipment/shipmentLoader.ts`

### ShipmentCreationScreen (751 → ~400 lines)

**Approach:** Heavy refactor
**New location:** `src/screens/preparer/ShipmentCreationScreen.tsx`

**Extractions:**

| Component | Before | After | Destination |
|-----------|--------|-------|-------------|
| Validation schema | 60 lines inline | Import | `utils/validation/shipmentSchema.ts` |
| POE/POD handlers | 44 lines (duplicate) | 20 lines | Shared factory function |
| StyleSheet | 120 lines | 80 lines | Inline with theme tokens |

**Phase 1 Summary:**

| Screen | Before | After | Reduction |
|--------|--------|-------|-----------|
| DisclaimerScreen | 51 | 45 | 12% |
| PreparerHomeScreen | 423 | 350 | 17% |
| ShipmentCreationScreen | 751 | 400 | 47% |
| **Total** | **1,225** | **795** | **35%** |

---

## Phase 2-3: Material ID & Quantity Screens

### MaterialIDScreen (1,502 → ~650 lines)

**Approach:** Heavy refactor
**New location:** `src/screens/preparer/MaterialIDScreen.tsx`

**Extractions:**

| Extraction | Lines Saved | Destination |
|------------|-------------|-------------|
| StyleSheet | 425 → 200 | Inline with theme tokens |
| Special provisions filtering (3x) | ~60 | `utils/materialId/specialProvisionsUtils.ts` |
| A6 paragraph handlers (5 blocks) | ~80 | `utils/materialId/a6ParagraphHandlers.ts` |
| Temperature conversion | ~40 | `utils/materialId/temperatureConversion.ts` |
| Workflow modifiers consolidation | ~50 | `utils/materialId/specialProvisionsUtils.ts` |
| Duplicate logic in handlers | ~90 | Share between `handleMaterialSelect` and `handlePackingGroupSelection` |

**Key simplifications:**
- Replace 5 identical A6 conditionals with: `const modifiers = getA6Modifiers(packagingParagraph)`
- Replace 3 filter patterns with: `filterMatchingKeys(sourceMap, keys)`
- Consolidate shared logic between selection handlers

### ExplosiveDetailsWizard (893 → ~450 lines)

**Approach:** Heavy refactor
**New location:** `src/screens/preparer/ExplosiveDetailsWizardScreen.tsx`

**Extractions:**

| Extraction | Lines Saved |
|------------|-------------|
| Container factory function | ~40 |
| StyleSheet with theme tokens | ~150 |
| Container state sync logic | ~30 |

### QuantityEntryScreen (709 → ~400 lines)

**Approach:** Heavy refactor
**New location:** `src/screens/preparer/QuantityEntryScreen.tsx`

**Extractions:**

| Extraction | Lines Saved | Destination |
|------------|-------------|-------------|
| EQ/LQ eligibility logic | ~100 | `utils/eligibility/eqLqEligibility.ts` |
| StyleSheet | 172 → 100 | Inline with theme tokens |

### SpecialProvisionsAcknowledgementScreen (351 → ~150 lines)

**Approach:** Moderate refactor
**New location:** `src/screens/preparer/SpecialProvisionsAcknowledgementScreen.tsx`

**Extractions:**

| Extraction | Lines Saved | Destination |
|------------|-------------|-------------|
| UNID routing (11 conditionals) | ~60 | `utils/navigation/unidRouting.ts` |
| StyleSheet | ~80 | Theme tokens |

**Phase 2-3 Summary:**

| Screen | Before | After | Reduction |
|--------|--------|-------|-----------|
| MaterialIDScreen | 1,502 | 650 | 57% |
| ExplosiveDetailsWizard | 893 | 450 | 50% |
| QuantityEntryScreen | 709 | 400 | 44% |
| SpecialProvisionsAck | 351 | 150 | 57% |
| **Total** | **3,455** | **1,650** | **52%** |

---

## Specialty Screens

All specialty screens use the `SpecialtyMaterialScreen` wrapper component.

### Pattern Transformation

**Before (typical specialty screen ~800-1800 lines):**
```typescript
const Screen = () => {
  // 50 lines: imports, state setup
  // 100 lines: validation useMemo
  // 200 lines: handlers
  // 300 lines: render (SafeAreaView, ScrollView, header, info panel, form, footer)
  // 600+ lines: StyleSheet
}
```

**After (~100-250 lines):**
```typescript
const Screen = () => {
  const { state, store } = useHazProStore();
  const isFormValid = useMemo(() => validateForm(...), [deps]);

  return (
    <SpecialtyMaterialScreen
      title="UN3166 Fuel Entry"
      material={state.hazardousMaterial}
      onCancel={handleCancel}
      onSaveExit={handleSaveExit}
      onContinue={handleContinue}
      continueDisabled={!isFormValid}
    >
      {/* Only the unique form content */}
      <FormField label="Fuel Type">...</FormField>
      <FormField label="Tank Capacity">...</FormField>
    </SpecialtyMaterialScreen>
  );
};
```

### Individual Screen Estimates

| Screen | Before | After | Unique Logic |
|--------|--------|-------|--------------|
| UN3166FuelEntryScreen | 769 | 180 | Multi-tank entry, fuel type picker |
| DryIcePrepScreen | 1,603 | 250 | Aircraft type, sublimation calc |
| LithiumBatteriesPrepScreen | 1,317 | 300 | 4-step wizard, excepted qty logic |
| EnginesInternalCombustion | 811 | 150 | Fuel draining requirements |
| BatteryPoweredVehicle | 1,875 | 280 | SP134 redirect, vehicle vs equipment |
| LifeSavingAppliances | 1,002 | 200 | Component table, search |
| KitPreparationScreen | 1,132 | 220 | Substance limits, multi-container |
| AbsorbentCushioningRequirements | 252 | 100 | Material type picker (light touch) |

### Special Case: LithiumBatteriesPrepScreen

This screen has a 4-step internal wizard. Approach: Use `SpecialtyMaterialScreen` with internal step state — keeps it consistent with other specialty screens while supporting steps internally via local `currentStep` state.

**Specialty Screens Summary:**

| Category | Before | After | Reduction |
|----------|--------|-------|-----------|
| 8 Specialty Screens | 8,761 | 1,680 | **81%** |

---

## Implementation Phases

### Phase 0: Foundation (Build First)

| Task | Deliverable | Est. Lines |
|------|-------------|------------|
| 0.1 | `SpecialtyMaterialScreen` component | ~100 |
| 0.2 | `utils/materialId/specialProvisionsUtils.ts` | ~40 |
| 0.3 | `utils/materialId/a6ParagraphHandlers.ts` | ~60 |
| 0.4 | `utils/materialId/temperatureConversion.ts` | ~30 |
| 0.5 | `utils/eligibility/eqLqEligibility.ts` | ~80 |
| 0.6 | `utils/navigation/unidRouting.ts` | ~50 |
| 0.7 | `utils/shipment/shipmentLoader.ts` | ~40 |
| 0.8 | `utils/validation/shipmentSchema.ts` | ~60 |

**Phase 0 Total:** ~460 lines of foundation code

### Phase 1: Shipment Creation Screens

| Task | Screen | Priority |
|------|--------|----------|
| 1.1 | ShipmentCreationScreen (heavy) | High |
| 1.2 | PreparerHomeScreen (light) | Medium |
| 1.3 | DisclaimerScreen (light) | Low |

### Phase 2: Material Identification Screens

| Task | Screen | Priority |
|------|--------|----------|
| 2.1 | MaterialIDScreen (heavy) | High |
| 2.2 | ExplosiveDetailsWizard (heavy) | Medium |

### Phase 3: Quantity Entry Screens

| Task | Screen | Priority |
|------|--------|----------|
| 3.1 | QuantityEntryScreen (heavy) | High |
| 3.2 | SpecialProvisionsAcknowledgementScreen (moderate) | Medium |

### Phase 4: Specialty Screens (Batch)

| Task | Screen | Complexity |
|------|--------|------------|
| 4.1 | EnginesInternalCombustion | Simple |
| 4.2 | AbsorbentCushioningRequirements | Simple |
| 4.3 | UN3166FuelEntryScreen | Moderate |
| 4.4 | DryIcePrepScreen | Moderate |
| 4.5 | LifeSavingAppliances | Moderate |
| 4.6 | KitPreparationScreen | Moderate |
| 4.7 | LithiumBatteriesPrepScreen | Complex (steps) |
| 4.8 | BatteryPoweredVehicle | Complex (SP134) |

### Navigation Updates

After each phase, update imports in:
- `src/navigation/` — screen registrations
- `src/screens/preparer/index.ts` — exports

---

## File Structure (Final)

```
src/
├── components/
│   ├── ui/                              # Existing UI library
│   │   └── (19+ components)
│   └── preparer/
│       ├── index.ts                     # Updated exports
│       ├── SpecialtyMaterialScreen.tsx  # NEW
│       └── (existing components)
├── screens/preparer/
│   ├── index.ts                         # Updated exports
│   ├── ShipmentCreationScreen.tsx       # MOVED + refactored
│   ├── PreparerHomeScreen.tsx           # MOVED + light refactor
│   ├── DisclaimerScreen.tsx             # MOVED + light refactor
│   ├── MaterialIDScreen.tsx             # MOVED + refactored
│   ├── ExplosiveDetailsWizardScreen.tsx # MOVED + refactored
│   ├── QuantityEntryScreen.tsx          # MOVED + refactored
│   ├── SpecialProvisionsAckScreen.tsx   # MOVED + refactored
│   ├── UN3166FuelEntryScreen.tsx        # MOVED + refactored
│   ├── DryIcePrepScreen.tsx             # MOVED + refactored
│   ├── LithiumBatteriesPrepScreen.tsx   # MOVED + refactored
│   ├── EnginesInternalCombustion.tsx    # MOVED + refactored
│   ├── BatteryPoweredVehicle.tsx        # MOVED + refactored
│   ├── LifeSavingAppliances.tsx         # MOVED + refactored
│   ├── KitPreparationScreen.tsx         # MOVED + refactored
│   └── AbsorbentCushioningReqs.tsx      # MOVED + light refactor
└── utils/
    ├── materialId/
    │   ├── specialProvisionsUtils.ts    # NEW
    │   ├── a6ParagraphHandlers.ts       # NEW
    │   └── temperatureConversion.ts     # NEW
    ├── eligibility/
    │   └── eqLqEligibility.ts           # NEW
    ├── navigation/
    │   └── unidRouting.ts               # NEW
    ├── shipment/
    │   └── shipmentLoader.ts            # NEW
    └── validation/
        └── shipmentSchema.ts            # NEW
```

---

## Success Criteria

| Metric | Target |
|--------|--------|
| Total line reduction | 66% (13,441 → ~4,585) |
| Heavy refactor screens | 45-60% reduction each |
| Light touch screens | 10-20% reduction each |
| Test coverage | Maintain existing + add tests for new utilities |
| Functionality | 100% preserved — no behavioral changes |
| Navigation | All routes work identically |
| TypeScript | No new type errors |

---

## Summary

| Category | Before | After | Reduction |
|----------|--------|-------|-----------|
| Phase 1 (Shipment) | 1,225 | 795 | 35% |
| Phase 2-3 (Material/Qty) | 3,455 | 1,650 | 52% |
| Specialty Screens | 8,761 | 1,680 | 81% |
| **Total Screens** | **13,441** | **4,125** | **69%** |
| Foundation (new) | 0 | +460 | — |
| **Net Total** | **13,441** | **~4,585** | **66%** |
