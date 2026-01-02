# Snapshot Test Strategy for HazPro Refactoring

## Executive Summary

This document defines a practical, focused testing strategy for the HazPro mobile app refactoring. The core principle is:

> **"You don't need 100% coverage. You need coverage on what you're touching."**

Tests serve as **behavioral documentation** - they capture "what the app currently does" so refactoring can focus purely on "how it does it internally." Snapshot tests are particularly suited because they:
- Capture the exact rendered output
- Fail if anything changes
- Show exactly what changed in the diff

### Why Tests Before Refactoring?

By definition, refactoring is "changing internal structure without changing external behavior." Tests that verify current behavior are the mechanism to prove you've achieved this. Without them, you're just hoping.

These are **characterization tests** (Michael Feathers' concept from *Working Effectively with Legacy Code*) - tests that capture what the code currently does, not what it should do.

```
Before: Code does X (tests verify X)
Refactor: Change internals
After: Code still does X (tests still pass) ✓
```

---

## What We're NOT Testing

**Explicitly excluded from this strategy:**

1. **Storybook + Chromatic Visual Regression** - Setup overhead is significant (225 components need stories), and we're not touching styling
2. **E2E Tests (Detox/Maestro)** - Requires device farm, not needed for internal refactoring
3. **100% Coverage** - We focus only on components being modified
4. **Integration Tests for Everything** - Only critical paths get integration coverage

**Why no visual regression tools?**
- Snapshot tests cover 80% of the risk - if the React tree is identical, visual differences are unlikely
- Our constraint is "zero changes" - we're not touching styling
- Manual smoke tests fill the gap for critical flows

---

## Prioritization Framework

### Decision Matrix

| Factor | Weight | Description |
|--------|--------|-------------|
| LOC (Lines of Code) | HIGH | More code = more risk |
| User Flow Criticality | HIGH | Breaks user ability to complete tasks |
| State Complexity | MEDIUM | Complex state = complex bugs |
| Modification Order | HIGH | Test before you touch |

### Tier System

**Tier 1: MUST Test Before ANY Modification**
- Components over 2000 LOC
- Critical user path screens (shipment creation, inspection flows)
- Complex state managers (wizards, multi-step forms)

**Tier 2: SHOULD Test Before Modification**
- Components 1000-2000 LOC
- Shared UI components used by multiple screens
- Navigation containers

**Tier 3: CAN Add Incrementally**
- Simple display components
- Utility modals
- Static screens

---

## Component Test Priority List

### Tier 1: Critical (Test First) - 13.6K LOC

| Component | LOC | Type | Risk Factor |
|-----------|-----|------|-------------|
| GrandfatheredWizard.tsx | 4,064 | Wizard | Multi-step state machine, explosive packaging |
| InspectorAMC1015Form.tsx | 3,319 | Form | PDF generation, complex validation |
| CompatibilitySegregationModal.tsx | 3,228 | Modal | Hazmat compatibility logic |
| SDDGUploadAndParse.tsx | 2,786 | Component | Document parsing, ML integration |

### Tier 2: High Priority - 6.8K LOC

| Component | LOC | Type | Risk Factor |
|-----------|-----|------|-------------|
| BatteryPoweredVehicle.tsx | 1,875 | Form | Multi-requirement validation |
| CylinderEntryScreen.tsx | 1,804 | Screen | Class 2 special handling |
| DryIcePrepScreen.tsx | 1,603 | Screen | Quantity calculations |
| MLDetectionScreen.tsx | 1,595 | Screen | Camera/ML integration |
| MaterialIDScreen.tsx | 1,502 | Screen | Material selection routing |
| ShipmentCreationScreen.tsx | 1,495 | Screen | Entry point, data initialization |

### Tier 3: Medium Priority - 15K LOC

| Component | LOC | Type | Risk Factor |
|-----------|-----|------|-------------|
| SDDGComplianceValidation.tsx | 1,479 | Screen | Validation logic |
| ShippersDeclarationScreen.tsx | 1,379 | Screen | Form submission |
| SDDGVerificationScreen.tsx | 1,318 | Screen | Verification flow |
| LithiumBatteriesPrepScreen.tsx | 1,317 | Screen | Special material handling |
| ShippersDeclarationForm.tsx | 1,240 | Form | PDF generation |
| PackagingWizardV2.tsx | 1,160 | Wizard | Multi-step packaging selection |
| InspectorHomeScreen.tsx | 1,166 | Screen | Resume logic, status routing |
| AccessorialHazardsScreen.tsx | 1,135 | Screen | Hazard entry |
| KitPreparationScreen.tsx | 1,132 | Screen | Kit assembly |
| CoeAndCaaScreen.tsx | 1,129 | Screen | Certification |
| InspectorPackageVerificationScreen.tsx | 1,127 | Screen | Package inspection |
| POPMarkingDataEntry.tsx | 1,101 | Form | POP marking entry |
| PreparerHomeScreen.tsx | 997 | Screen | Resume logic, shipment list |

---

## Critical User Paths

These navigation flows MUST be preserved. Breaking any step breaks the user's ability to complete their task.

### Preparer Critical Path

```
PreparerHome
  ↓ "Create New Shipment"
Disclaimer ← SNAPSHOT TEST REQUIRED
  ↓ Accept
ShipmentCreation ← SNAPSHOT TEST REQUIRED
  ↓
MaterialID ← SNAPSHOT TEST REQUIRED
  ↓ [Select material]
PackagingScreen ← SNAPSHOT TEST REQUIRED
  ├─ Class 2 → CylinderEntryScreen
  ├─ Scan → POPScannerScreen → POPScanResultsScreen
  └─ Manual → ManualEntryPackagingTypeSelectionScreen
  ↓
LabelingAndMarking
  ↓
ShippersDeclarationScreen ← SNAPSHOT TEST REQUIRED
  ↓
CertifyForm ← SNAPSHOT TEST REQUIRED
  ↓
[Shipment Complete]
```

### Inspector Critical Path

```
InspectorHome
  ↓ "Start New Inspection"
InspectorDisclaimerScreen
  ↓
SDDGUploadAndParse ← SNAPSHOT TEST REQUIRED
  ↓
SDDGVerificationScreen ← SNAPSHOT TEST REQUIRED
  ↓
SDDGComplianceValidation ← SNAPSHOT TEST REQUIRED
  ├─ Valid: SDDGInspectionCompleteScreen
  └─ Frustrated: SDDGFrustrationSummary
  ↓
InspectorPackageVerification ← SNAPSHOT TEST REQUIRED
  ↓
PackageInspectionCompleteScreen
```

### High-Risk Resume Flows

Resume/load flows have complex state-based navigation:

**Preparer Resume:**
- Loads shipment from database
- Maps `activeStep` + `packagingWizardStep` to screen name
- Navigates to appropriate point

**Inspector Resume:**
- Loads inspection from database
- Routes based on `sddgStatus` and `packageStatus`
- 5+ different navigation paths

---

## Mocking Patterns

### Core Dependencies to Mock

Every component test will need some combination of these mocks:

#### 1. useHazProStore Hook

```typescript
// __mocks__/stores/useHazProStore.ts
export const mockHazProStore = {
  state: {
    hazProPreparerContext: {
      activePersona: 'Preparer',
      activeStep: 0,
      packagingWizardStep: 0,
      hazardousMaterial: null,
      modifiersAndAcknowledgements: null,
      // ... other fields
    },
    isLoadingShipments: false,
    databaseError: null,
  },
  store: {
    hazProPreparerContext: { /* same structure, mutable */ },
  },
  actions: {
    saveCurrentShipment: jest.fn(),
    loadShipment: jest.fn(),
    deleteShipment: jest.fn(),
    initializeDatabase: jest.fn(),
    refreshShipmentsIndex: jest.fn(),
  },
};

jest.mock('@/stores/useHazProStore', () => ({
  useHazProStore: () => mockHazProStore,
}));
```

#### 2. Navigation Context

```typescript
// Already in jest.setup.js
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    setOptions: jest.fn(),
  }),
  useRoute: () => ({ params: {} }),
}));
```

#### 3. Database Operations

```typescript
jest.mock('@/contexts/DatabaseProvider', () => ({
  useDatabase: () => ({
    loadShipment: jest.fn(),
    saveShipment: jest.fn(),
    loadInspection: jest.fn(),
    saveInspection: jest.fn(),
  }),
}));
```

#### 4. Inspection Form Context

```typescript
jest.mock('@/contexts/InspectionFormProvider', () => ({
  useInspectionForm: () => ({
    inspection: { /* mock inspection object */ },
    workflow: { currentChevron: 'SDDG', currentSDDGStep: 0 },
    startNewInspection: jest.fn(),
    loadInspectionForEdit: jest.fn(),
    saveCurrentInspection: jest.fn(),
  }),
}));
```

---

## Test Templates

### Template 1: Simple Screen Snapshot

```typescript
// src/components/__tests__/ScreenName.test.tsx
import React from 'react';
import { render } from '@testing-library/react-native';

// Mock dependencies BEFORE importing component
jest.mock('@/stores/useHazProStore', () => ({
  useHazProStore: () => ({
    state: {
      hazProPreparerContext: {
        activePersona: 'Preparer',
      },
    },
  }),
}));

import ScreenName from '../ScreenName';

describe('ScreenName', () => {
  const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
    setOptions: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { toJSON } = render(
      <ScreenName navigation={mockNavigation} />
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
```

### Template 2: Form with State

```typescript
// src/components/__tests__/FormComponent.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

jest.mock('@/stores/useHazProStore', () => ({
  useHazProStore: () => ({
    state: {
      hazProPreparerContext: {
        // Form-specific state
        hazardousMaterial: {
          properShippingName: 'TEST MATERIAL',
          unid: 'UN1234',
        },
      },
    },
    actions: {
      saveCurrentShipment: jest.fn(),
    },
  }),
}));

import FormComponent from '../FormComponent';

describe('FormComponent', () => {
  it('renders with initial state', () => {
    const { toJSON, getByText } = render(<FormComponent navigation={{}} />);
    expect(toJSON()).toMatchSnapshot();
    expect(getByText('TEST MATERIAL')).toBeTruthy();
  });

  it('maintains same output after interaction', () => {
    const { toJSON, getByTestId } = render(<FormComponent navigation={{}} />);
    const initialSnapshot = toJSON();

    // Simulate user interaction
    fireEvent.press(getByTestId('submit-button'));

    // For refactoring, we want same output (unless behavior intentionally changed)
    expect(toJSON()).toEqual(initialSnapshot);
  });
});
```

### Template 3: Wizard with Steps

```typescript
// src/components/__tests__/WizardComponent.test.tsx
import React from 'react';
import { render } from '@testing-library/react-native';

jest.mock('@/stores/useHazProStore', () => ({
  useHazProStore: () => ({
    state: {
      hazProPreparerContext: {
        packagingWizardStep: 0,
        // Other wizard state
      },
    },
    store: {
      hazProPreparerContext: {
        packagingWizardStep: 0,
      },
    },
  }),
}));

import WizardComponent from '../WizardComponent';

describe('WizardComponent', () => {
  // Test each step independently
  describe('Step 0', () => {
    it('renders step 0 correctly', () => {
      const { toJSON } = render(<WizardComponent navigation={{}} />);
      expect(toJSON()).toMatchSnapshot();
    });
  });

  describe('Step 1', () => {
    beforeEach(() => {
      // Update mock for step 1
      jest.doMock('@/stores/useHazProStore', () => ({
        useHazProStore: () => ({
          state: {
            hazProPreparerContext: {
              packagingWizardStep: 1,
            },
          },
        }),
      }));
    });

    it('renders step 1 correctly', () => {
      const { toJSON } = render(<WizardComponent navigation={{}} />);
      expect(toJSON()).toMatchSnapshot();
    });
  });
});
```

### Template 4: Modal Component

```typescript
// src/components/__tests__/ModalComponent.test.tsx
import React from 'react';
import { render } from '@testing-library/react-native';

import ModalComponent from '../ModalComponent';

describe('ModalComponent', () => {
  it('renders when visible', () => {
    const { toJSON } = render(
      <ModalComponent
        visible={true}
        onClose={jest.fn()}
        data={{ /* mock data */ }}
      />
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders nothing when hidden', () => {
    const { toJSON } = render(
      <ModalComponent
        visible={false}
        onClose={jest.fn()}
        data={null}
      />
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
```

---

## Pre-Modification Workflow

### Before Touching ANY Component

```markdown
## Pre-Modification Checklist for [ComponentName]

### 1. Create Snapshot Test
- [ ] Test file created at `src/components/__tests__/[ComponentName].test.tsx`
- [ ] All required dependencies mocked
- [ ] Test runs successfully: `npm test -- --testPathPattern="[ComponentName]"`

### 2. Capture Baseline
- [ ] Snapshot file generated in `__tests__/__snapshots__/`
- [ ] Snapshot committed to git
- [ ] Baseline commit hash recorded: ___________

### 3. Understand Current Behavior
- [ ] Read the component code
- [ ] Identify all props and their uses
- [ ] Identify all hooks and side effects
- [ ] Document expected behavior

### 4. Ready to Refactor
- [ ] Tests pass with zero snapshot changes
- [ ] TypeScript compiles: `npx tsc --noEmit`
```

### After Modifying Component

```markdown
## Post-Modification Checklist for [ComponentName]

### 1. Tests Pass
- [ ] `npm test -- --testPathPattern="[ComponentName]"` passes
- [ ] Snapshot comparison shows ZERO differences
- [ ] If differences exist, they are INTENTIONAL and reviewed

### 2. TypeScript Compiles
- [ ] `npx tsc --noEmit` passes (ignoring pre-existing errors)

### 3. Manual Verification
- [ ] Smoke test the affected flow (see SMOKE_TEST_CHECKLISTS.md)
- [ ] No new console warnings/errors

### 4. Document Changes
- [ ] Update CHANGELOG.md with commit
- [ ] Note any intentional behavior changes
```

---

## Coverage Goals by Phase

| Phase | Target | Focus |
|-------|--------|-------|
| **Current** | Infrastructure only | Jest setup complete ✓ |
| **Phase 3** (UI Library) | 100% of new components | New components need tests |
| **Phase 4** (Types) | Compilation verification | No snapshot tests needed |
| **Phase 5** (Migration) | 100% of modified components | Add test BEFORE each modification |

**End Goal:** Snapshot tests for all 30 high-priority components before Phase 5 modifications.

---

## Test Execution Commands

```bash
# Run all tests
npm test

# Run specific component test
npm test -- --testPathPattern="ComponentName"

# Run with coverage
npm run test:coverage

# Update snapshots (ONLY when changes are intentional)
npm test -- --updateSnapshot

# Run in watch mode during development
npm run test:watch

# Run only snapshot tests
npm test -- --testPathPattern="__tests__"
```

---

## Honest Limitations

Tests are **necessary but not sufficient**:

| Limitation | Mitigation |
|------------|------------|
| Tests only catch what they cover | Prioritize high-risk components |
| Snapshots don't catch pixel-level visual differences | Manual smoke tests for critical flows |
| Tests don't catch performance regressions | Before/after profiling if concerned |
| Mocking can hide integration issues | Integration tests for critical paths only |
| Snapshot serialization may miss some details | Test key text content explicitly |

---

## Summary

The testing strategy for HazPro refactoring is:

1. **Focus on what you're touching** - Not 100% coverage
2. **Snapshot tests as primary mechanism** - Captures exact rendered output
3. **Add tests BEFORE modifying** - Never refactor without baseline
4. **Manual smoke tests for visual verification** - Humans catch what snapshots miss
5. **No Storybook/Chromatic** - Overhead not justified for internal refactoring

The mental model:

```
┌─────────────────────────────────────┐
│         Current Behavior            │
│  (captured by tests/snapshots)      │
├─────────────────────────────────────┤
│         Internal Code               │
│  (this is what you're changing)     │
└─────────────────────────────────────┘
```

Tests form a contract around the behavior. You can freely restructure everything inside as long as the contract holds.
