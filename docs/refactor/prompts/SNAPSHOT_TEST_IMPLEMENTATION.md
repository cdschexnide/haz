# Continuation Prompt: Snapshot Test Implementation

## Context

You are continuing a refactoring effort on a React Native/Expo mobile application (HazPro). Previous sessions completed:

- **Phase 0**: Documentation (strategy docs, risk register, smoke tests)
- **Phase 1**: Dead code removal (44+ files, ~19,700 lines)
- **Phase 2 Foundation**: Theming and types barrel exports
- **Bug Fix**: Empty screen navigation fix
- **Testing Infrastructure**: Jest + React Native Testing Library configured
- **Test Strategy**: Comprehensive snapshot test strategy documented

**Current State:**
- 319 tests passing (315 utility + 4 DisclaimerScreen)
- 1 snapshot test working as proof-of-concept
- Jest infrastructure fully operational
- Strategy document defines 30 priority components

---

## CRITICAL CONSTRAINT: ZERO User-Facing Changes

This refactor must produce ZERO changes visible to users. Tests capture current behavior to prove future refactoring doesn't change it.

**Mantra: "Same car, rebuilt engine"**

---

## Your Task: Implement Snapshot Tests

### Session Goal

Create snapshot tests for **8-10 priority components** from the test strategy document. This establishes the safety net needed for Phase 5 (Component Migration).

### Reference Documents

**READ THESE FIRST:**
1. `/docs/refactor/SNAPSHOT_TEST_STRATEGY.md` - Full testing strategy with templates
2. `/src/components/__tests__/DisclaimerScreen.test.tsx` - Working example test
3. `/jest.setup.js` - Existing global mocks

---

## Approach: Three Phases

### Phase 1: Create Shared Mock Utilities (Sequential)

Before writing individual tests, create a shared mocks file to avoid duplication:

**Create:** `src/__mocks__/testUtils.tsx`

```typescript
/**
 * Shared test utilities and mock factories for HazPro component tests
 */
import React from 'react';

// ============================================
// MOCK FACTORIES
// ============================================

/**
 * Creates a mock HazPro store with customizable state
 */
export const createMockHazProStore = (overrides = {}) => ({
  state: {
    hazProPreparerContext: {
      activePersona: 'Preparer',
      activeStep: 0,
      packagingWizardStep: 0,
      hazardousMaterial: null,
      modifiersAndAcknowledgements: null,
      requiredMarkingsArray: [],
      requiredLabelsArray: [],
      shipper: null,
      consignee: null,
      preparer: null,
      ...overrides,
    },
    isLoadingShipments: false,
    databaseError: null,
    shipmentsIndex: [],
  },
  store: {
    hazProPreparerContext: {
      activePersona: 'Preparer',
      activeStep: 0,
      ...overrides,
    },
  },
  actions: {
    saveCurrentShipment: jest.fn().mockResolvedValue(undefined),
    loadShipment: jest.fn().mockResolvedValue(undefined),
    deleteShipment: jest.fn().mockResolvedValue(undefined),
    initializeDatabase: jest.fn().mockResolvedValue(undefined),
    refreshShipmentsIndex: jest.fn().mockResolvedValue(undefined),
  },
  isLoading: false,
  error: null,
  hazProContext: overrides,
  requiredMarkings: [],
  requiredLabels: [],
});

/**
 * Creates a mock navigation object
 */
export const createMockNavigation = () => ({
  navigate: jest.fn(),
  goBack: jest.fn(),
  setOptions: jest.fn(),
  addListener: jest.fn(() => jest.fn()),
  removeListener: jest.fn(),
  dispatch: jest.fn(),
  reset: jest.fn(),
  isFocused: jest.fn(() => true),
  canGoBack: jest.fn(() => true),
  getParent: jest.fn(),
  getState: jest.fn(() => ({ routes: [], index: 0 })),
});

/**
 * Creates a mock route object
 */
export const createMockRoute = (params = {}) => ({
  key: 'test-route',
  name: 'TestScreen',
  params,
});

/**
 * Creates a mock inspection form context
 */
export const createMockInspectionForm = (overrides = {}) => ({
  inspection: {
    id: 'test-inspection-id',
    sddgStatus: 'NOT_STARTED',
    packageStatus: 'NOT_STARTED',
    frustrations: [],
    packageFrustrations: [],
    ...overrides,
  },
  workflow: {
    currentChevron: 'SDDG',
    currentSDDGStep: 0,
    currentPackageStep: 0,
  },
  isProcessing: false,
  hasUnsavedChanges: false,
  startNewInspection: jest.fn(),
  loadInspectionForEdit: jest.fn(),
  saveCurrentInspection: jest.fn().mockResolvedValue(undefined),
  completeInspection: jest.fn(),
});

/**
 * Creates a mock database context
 */
export const createMockDatabase = () => ({
  loadShipment: jest.fn().mockResolvedValue(null),
  saveShipment: jest.fn().mockResolvedValue(undefined),
  deleteShipment: jest.fn().mockResolvedValue(undefined),
  loadInspection: jest.fn().mockResolvedValue(null),
  saveInspection: jest.fn().mockResolvedValue(undefined),
  getAllShipments: jest.fn().mockResolvedValue([]),
  getAllInspections: jest.fn().mockResolvedValue([]),
});

// ============================================
// SAMPLE DATA FIXTURES
// ============================================

export const sampleHazardousMaterial = {
  properShippingName: 'ACETONE',
  unid: 'UN1090',
  hazardClassDivisionNumber: '3',
  packingGroup: 'II',
  compatibilityGroup: 'N/A',
};

export const sampleShipper = {
  name: 'Test Shipper Inc.',
  address: '123 Test Street',
  city: 'Test City',
  state: 'TS',
  zip: '12345',
  phone: '555-123-4567',
};

export const sampleConsignee = {
  name: 'Test Consignee LLC',
  address: '456 Destination Ave',
  city: 'Dest City',
  state: 'DC',
  zip: '67890',
  phone: '555-987-6543',
};
```

**Commit this file before proceeding.**

### Phase 2: Implement Tests (Parallel with Subagents)

After the shared mocks are ready, use **parallel subagents** to create tests for independent components.

**Launch 3-4 subagents simultaneously**, each handling one component:

```
Subagent 1: CertifyForm (simple, 2 useState)
Subagent 2: PreparerHomeScreen (screen, list display)
Subagent 3: InspectorHomeScreen (screen, status display)
Subagent 4: ShippersDeclarationForm (form, read-only from store)
```

**Each subagent should:**
1. Read the component to understand its dependencies
2. Create the test file using templates from strategy doc
3. Run the test: `npm test -- --testPathPattern="ComponentName"`
4. Verify snapshot is created
5. Report back with file path and result

### Phase 3: Commit and Advance (Sequential)

After subagents complete:
1. Review each test file
2. Run full test suite: `npm test`
3. Commit each working test individually
4. Update CHANGELOG.md
5. If time permits, advance to next batch of components

---

## Component Priority List (This Session)

### Batch 1: Simple Components (Start Here)

| Component | File | Complexity | Notes |
|-----------|------|------------|-------|
| CertifyForm | `src/components/CertifyForm.tsx` | LOW | 2 useState, signature modal |
| ShippersDeclarationForm | `src/components/ShippersDeclarationForm.tsx` | LOW | Read-only from store |
| AcknowledgementScreen | `src/components/AcknowledgementScreen.tsx` | LOW | Simple display |

### Batch 2: Medium Screens

| Component | File | Complexity | Notes |
|-----------|------|------------|-------|
| PreparerHomeScreen | `src/components/PreparerHomeScreen.tsx` | MEDIUM | Shipment list, resume logic |
| InspectorHomeScreen | `src/components/Inspector/InspectorHomeScreen.tsx` | MEDIUM | Status routing |
| MaterialIDScreen | `src/components/MaterialIDScreen.tsx` | MEDIUM | Material selection |

### Batch 3: Forms and Wizards (If Time Permits)

| Component | File | Complexity | Notes |
|-----------|------|------------|-------|
| PackagingWizardV2 | `src/components/PackagingWizardV2.tsx` | MEDIUM-HIGH | Multi-step |
| InnerPackagingWizard | `src/components/InnerPackagingWizard.tsx` | MEDIUM | Step logic |

### DEFER to Later Sessions

These are too complex for initial testing:
- GrandfatheredWizard (4K LOC)
- InspectorAMC1015Form (3.3K LOC, PDF generation)
- CompatibilitySegregationModal (3.2K LOC, hazmat logic)
- SDDGUploadAndParse (2.8K LOC, ML integration)

---

## Subagent Prompt Template

When launching subagents, use this prompt pattern:

```
Create a snapshot test for the [ComponentName] component.

**Component Location:** [file path]

**Steps:**
1. Read the component to identify:
   - Props it receives
   - Hooks it uses (useHazProStore, useNavigation, etc.)
   - Any complex state or effects

2. Create test file at: src/components/__tests__/[ComponentName].test.tsx

3. Use the mock utilities from: src/__mocks__/testUtils.tsx
   Import: createMockHazProStore, createMockNavigation

4. Follow this test structure:
   - Mock all dependencies BEFORE importing component
   - Create at least one snapshot test
   - Add 1-2 assertions for key rendered content

5. Run: npm test -- --testPathPattern="[ComponentName]"

6. Report back:
   - Test file path
   - Number of tests passing
   - Snapshot created (yes/no)
   - Any issues encountered

Do NOT modify the component code. This is test creation only.
```

---

## Test File Template

```typescript
/**
 * @file [ComponentName].test.tsx
 * @description Snapshot test for [ComponentName] component.
 *
 * Captures baseline behavior before Phase 5 refactoring.
 * Any snapshot changes during refactoring indicate behavior change.
 */
import React from 'react';
import { render } from '@testing-library/react-native';
import {
  createMockHazProStore,
  createMockNavigation,
} from '../../__mocks__/testUtils';

// Mock dependencies BEFORE importing component
jest.mock('@/stores/useHazProStore', () => ({
  useHazProStore: () => createMockHazProStore(),
}));

// Import component AFTER mocks
import ComponentName from '../ComponentName';

describe('ComponentName', () => {
  const mockNavigation = createMockNavigation();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { toJSON } = render(
      <ComponentName navigation={mockNavigation} />
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('displays expected content', () => {
    const { getByText } = render(
      <ComponentName navigation={mockNavigation} />
    );
    // Add assertions for key visible content
    expect(getByText('Expected Text')).toBeTruthy();
  });
});
```

---

## Verification Commands

```bash
# Run specific test
npm test -- --testPathPattern="ComponentName"

# Run all component tests
npm test -- --testPathPattern="__tests__"

# Run full suite
npm test

# Update snapshots (ONLY if changes are intentional)
npm test -- --updateSnapshot --testPathPattern="ComponentName"

# Check TypeScript (pre-existing errors are OK)
npx tsc --noEmit
```

---

## Git Commit Requirements

**Commit each test individually:**

```bash
git add src/components/__tests__/ComponentName.test.tsx
git add src/components/__tests__/__snapshots__/ComponentName.test.tsx.snap
git commit -m "test: add snapshot test for ComponentName

Captures baseline behavior for Phase 5 refactoring safety.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

**Update CHANGELOG.md after each batch.**

---

## Success Criteria

Session is complete when:

- [ ] Shared mock utilities file created (`src/__mocks__/testUtils.tsx`)
- [ ] At least 6 new snapshot tests created and passing
- [ ] Each test committed individually
- [ ] Full test suite passes: `npm test`
- [ ] CHANGELOG.md updated with commits

---

## What NOT To Do

1. **DO NOT** modify any component code
2. **DO NOT** fix pre-existing TypeScript errors
3. **DO NOT** update snapshots to "make tests pass" without reviewing
4. **DO NOT** attempt the 4K+ LOC components this session
5. **DO NOT** create tests without running them first
6. **DO NOT** batch all commits together - commit incrementally

---

## Troubleshooting Common Issues

### "Cannot find module" errors
- Check the mock is placed BEFORE the import
- Verify path aliases (@/) are working

### "Objects are not valid as React child"
- Component is trying to render an object - mock needs adjustment
- Check if component expects specific prop shapes

### "useNavigation must be used within NavigationContainer"
- Navigation mock isn't working
- Ensure @react-navigation/native is mocked in jest.setup.js

### Snapshot is massive/unreadable
- Component renders too much - consider mocking child components
- Focus on top-level structure, not every nested element

### Test timeout
- Component has async effects - may need to use `waitFor` or `act`
- Check for infinite loops in useEffect

---

## After This Session

With 6-10 component tests in place:
- Future sessions can continue adding tests for remaining components
- Phase 5 can begin for components WITH tests
- Pattern is established for other developers to follow

**Next priority components for future sessions:**
1. PackagingWizardV2
2. ExplosiveDetailsWizardNew
3. DryIcePrepScreen
4. LithiumBatteriesPrepScreen
5. SDDGVerificationScreen

---

## Files to Reference

| File | Purpose |
|------|---------|
| `docs/refactor/SNAPSHOT_TEST_STRATEGY.md` | Full strategy with component priorities |
| `src/components/__tests__/DisclaimerScreen.test.tsx` | Working example |
| `jest.config.js` | Jest configuration |
| `jest.setup.js` | Global mocks |
| `docs/refactor/CHANGELOG.md` | Track commits |
