# Continuation Prompt: Snapshot Test Implementation (Session 2)

## Instructions for Claude Code

**USE ULTRATHINK** for all planning and implementation decisions. This ensures thorough analysis before action.

**USE PARALLEL SUBAGENTS** when creating tests for independent components. Launch 3-4 subagents simultaneously to maximize efficiency.

---

## Context: Current State

You are continuing a snapshot test implementation effort on a React Native/Expo mobile application (HazPro). The previous session completed:

**Tests Already Created (7 components, 45 tests, 10 snapshots):**

| Component | Location | Tests | Snapshots |
|-----------|----------|-------|-----------|
| DisclaimerScreen | `src/components/__tests__/` | 4 | 1 |
| CertifyForm | `src/components/__tests__/` | 7 | 1 |
| ShippersDeclarationForm | `src/components/__tests__/` | 10 | 3 |
| AcknowledgementScreen | `src/components/__tests__/` | 6 | 2 |
| PreparerHomeScreen | `src/components/__tests__/` | 7 | 1 |
| InspectorHomeScreen | `src/components/Inspector/__tests__/` | 6 | 1 |
| MaterialIDScreen | `src/components/__tests__/` | 5 | 1 |

**Infrastructure Already in Place:**
- `jest.config.js` - Jest configuration
- `jest.setup.js` - Global mocks for React Native modules
- `src/__mocks__/testUtils.tsx` - Shared mock factories and sample data

---

## CRITICAL CONSTRAINT: ZERO User-Facing Changes

This refactor must produce ZERO changes visible to users. Tests capture current behavior to prove future refactoring doesn't change it.

**Mantra: "Same car, rebuilt engine"**

---

## Your Task: Continue Snapshot Test Implementation

### Session Goal

Create snapshot tests for **6-8 additional priority components**. This continues building the safety net for Phase 5 (Component Migration).

### Reference Documents

**READ THESE FIRST:**
1. `/docs/refactor/SNAPSHOT_TEST_STRATEGY.md` - Full testing strategy with templates
2. `/src/components/__tests__/CertifyForm.test.tsx` - Well-documented example test
3. `/src/__mocks__/testUtils.tsx` - Existing mock utilities
4. `/jest.setup.js` - Global mocks already configured

---

## Priority Components for This Session

### Batch 1: Screens (Start Here - Launch in Parallel)

| Component | File | LOC | Complexity | Notes |
|-----------|------|-----|------------|-------|
| ShipmentCreationScreen | `src/components/ShipmentCreationScreen.tsx` | 1,495 | MEDIUM | Entry point, data initialization |
| AccessorialHazardsScreen | `src/components/AccessorialHazardsScreen.tsx` | 1,135 | MEDIUM | Hazard entry form |
| KitPreparationScreen | `src/components/KitPreparationScreen.tsx` | 1,132 | MEDIUM | Kit assembly |

### Batch 2: Prep Screens (After Batch 1)

| Component | File | LOC | Complexity | Notes |
|-----------|------|-----|------------|-------|
| SDDGVerificationScreen | `src/components/SDDGVerificationScreen.tsx` | 1,318 | MEDIUM | Verification flow |
| LithiumBatteriesPrepScreen | `src/components/LithiumBatteriesPrepScreen.tsx` | 1,317 | MEDIUM | Special material handling |
| DryIcePrepScreen | `src/components/DryIcePrepScreen.tsx` | 1,603 | MEDIUM | Quantity calculations |

### Batch 3: Wizards (If Time Permits)

| Component | File | LOC | Complexity | Notes |
|-----------|------|-----|------------|-------|
| PackagingWizardV2 | `src/components/PackagingWizardV2.tsx` | 1,160 | MEDIUM-HIGH | Multi-step wizard |
| InnerPackagingWizard | `src/components/InnerPackagingWizard.tsx` | ~800 | MEDIUM | Step logic |

### DEFER to Later Sessions

These are too complex for this session:
- GrandfatheredWizard (4K LOC)
- InspectorAMC1015Form (3.3K LOC)
- CompatibilitySegregationModal (3.2K LOC)
- SDDGUploadAndParse (2.8K LOC)

---

## Approach: Three Phases

### Phase 1: Review Existing Patterns (Sequential)

Before creating new tests:
1. Read `src/components/__tests__/CertifyForm.test.tsx` - See established patterns
2. Read `src/__mocks__/testUtils.tsx` - Understand available mock factories
3. Read the first target component to identify its dependencies

### Phase 2: Create Tests (Parallel with Subagents)

**Launch 3 subagents simultaneously** for each batch:

```
Batch 1 Parallel Execution:
  Subagent 1: ShipmentCreationScreen
  Subagent 2: AccessorialHazardsScreen
  Subagent 3: KitPreparationScreen

Wait for Batch 1 to complete, then...

Batch 2 Parallel Execution:
  Subagent 1: SDDGVerificationScreen
  Subagent 2: LithiumBatteriesPrepScreen
  Subagent 3: DryIcePrepScreen
```

### Phase 3: Commit and Verify (Sequential)

After each batch:
1. Run: `npm test -- --testPathPattern="ComponentName"` for each
2. Run: `npm test` for full suite
3. Commit each test file individually
4. Update CHANGELOG.md after all tests complete

---

## Subagent Prompt Template

When launching subagents, use this pattern:

```
Create a snapshot test for the [ComponentName] component.

**Component Location:** [file path]

**Steps:**
1. Read the component to identify:
   - Props it receives
   - Hooks it uses (useHazProStore, useNavigation, etc.)
   - Child components that need mocking
   - Any async effects

2. Create test file at: src/components/__tests__/[ComponentName].test.tsx

3. Follow this mock pattern (CRITICAL - mocks MUST be defined before import):
   ```typescript
   // All jest.mock() calls go here BEFORE any imports of the component
   jest.mock('@/stores/useHazProStore', () => ({
     useHazProStore: () => ({
       state: { hazProPreparerContext: { ... } },
       store: { hazProPreparerContext: { ... } },
       actions: { ... },
     }),
   }));

   // Import component AFTER mocks
   import ComponentName from '../ComponentName';
   ```

4. Create at least:
   - 1 snapshot test
   - 2-3 content verification tests

5. Run: npm test -- --testPathPattern="[ComponentName]" --no-watchman

6. Report back:
   - Test file path
   - Number of tests passing
   - Snapshot created (yes/no)
   - Any issues encountered

Do NOT modify the component code. This is test creation only.
```

---

## Critical Technical Patterns

### Jest Hoisting Constraint

Jest hoists `jest.mock()` calls to the top of the file. This means:

**WRONG - Will fail:**
```typescript
import { createMockHazProStore } from '../../__mocks__/testUtils';

jest.mock('@/stores/useHazProStore', () => ({
  useHazProStore: () => createMockHazProStore(), // ERROR: Can't reference imports in factory
}));
```

**CORRECT - Inline the mock data:**
```typescript
jest.mock('@/stores/useHazProStore', () => ({
  useHazProStore: () => ({
    state: {
      hazProPreparerContext: {
        activePersona: 'Preparer',
        activeStep: 0,
        hazardousMaterial: null,
        // ... inline all needed state
      },
    },
    store: { /* ... */ },
    actions: {
      saveCurrentShipment: jest.fn().mockResolvedValue(undefined),
      // ... inline all needed actions
    },
    isLoading: false,
    error: null,
  }),
}));

// Import AFTER mocks
import ComponentName from '../ComponentName';
```

### Mocking Child Components

For complex components with many children, mock them as simple Views:

```typescript
jest.mock('@/components/SomeChildComponent', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: (props) => <View testID="mock-some-child" {...props} />,
  };
});
```

### Handling Async Effects

Components with useEffect that load data may log after tests complete. This is acceptable:
- The warning "Cannot log after tests are done" doesn't fail the test
- It indicates the component has async behavior
- Use `waitFor` if you need to test the loaded state

---

## Verification Commands

```bash
# Run specific test
npm test -- --testPathPattern="ComponentName" --no-watchman

# Run all component tests
npm test -- --testPathPattern="__tests__" --no-watchman

# Run full suite
npm test --no-watchman

# Update snapshots (ONLY if changes are intentional)
npm test -- --updateSnapshot --testPathPattern="ComponentName"
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

**Update CHANGELOG.md after all tests are committed.**

---

## Success Criteria

Session is complete when:

- [ ] At least 6 new snapshot tests created and passing
- [ ] Each test committed individually
- [ ] Full test suite passes: `npm test`
- [ ] CHANGELOG.md updated with new commits

**Expected End State:**
- 13+ component test suites (7 existing + 6+ new)
- 80+ tests passing
- 15+ snapshots

---

## What NOT To Do

1. **DO NOT** modify any component code
2. **DO NOT** fix pre-existing TypeScript errors
3. **DO NOT** update snapshots to "make tests pass" without reviewing
4. **DO NOT** attempt the 4K+ LOC components this session
5. **DO NOT** create tests without running them first
6. **DO NOT** batch all commits together - commit incrementally
7. **DO NOT** use `createMockHazProStore()` from testUtils inside `jest.mock()` factories

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
- Component renders too much - mock child components as Views
- Focus on top-level structure, not every nested element

### Test timeout
- Component has async effects - may need `waitFor` or `act`
- Check for infinite loops in useEffect
- Increase timeout if needed: `jest.setTimeout(10000)`

### "Cannot log after tests are done"
- This is a warning, not a failure
- Indicates component has async effects that complete after test
- Acceptable for components that load data on mount

---

## Files to Reference

| File | Purpose |
|------|---------|
| `docs/refactor/SNAPSHOT_TEST_STRATEGY.md` | Full strategy with component priorities |
| `src/components/__tests__/CertifyForm.test.tsx` | Well-structured example |
| `src/components/__tests__/PreparerHomeScreen.test.tsx` | Complex component example |
| `src/__mocks__/testUtils.tsx` | Mock factories (for reference, not direct import in mocks) |
| `jest.config.js` | Jest configuration |
| `jest.setup.js` | Global mocks |
| `docs/refactor/CHANGELOG.md` | Track commits |

---

## After This Session

With 13+ component tests in place:
- Approximately 40% of priority components will have tests
- Future sessions can continue adding remaining tests
- Phase 5 can begin for components WITH tests

**Remaining priority components for future sessions:**
1. ExplosiveDetailsWizardNew
2. CylinderEntryScreen
3. POPMarkingDataEntry
4. SDDGComplianceValidation
5. InspectorPackageVerificationScreen
6. CoeAndCaaScreen
