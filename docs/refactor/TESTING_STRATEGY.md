# Testing Strategy for HazPro Mobile App Refactoring

## Quick Reference: Running Tests

### Available Commands

```bash
# Run all tests
npm test

# Run tests in watch mode (auto-rerun on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run specific test file
npm test -- --testPathPattern="DisclaimerScreen"

# Run tests matching a pattern
npm test -- --testPathPattern="hazmat-compatibility-engine"

# Update snapshots (when intentional changes are made)
npm test -- --updateSnapshot
```

### Test File Naming Conventions

- Test files: `ComponentName.test.tsx` or `utilityName.test.ts`
- Test location: `__tests__/` subdirectory next to the source files
- Snapshot files: Auto-generated in `__tests__/__snapshots__/`

### When to Update Snapshots

Only update snapshots (`npm test -- --updateSnapshot`) when:
1. You intentionally changed a component's visual output
2. You reviewed the diff and confirmed the changes are correct
3. The changes align with the refactoring goal of "Same car, rebuilt engine"

**NEVER** update snapshots to "make tests pass" without reviewing the changes.

---

## Current State Analysis (Updated 2025-12-31)

### Test Infrastructure Status: OPERATIONAL ✅

The testing infrastructure is now fully configured and working:
- Jest configured via `jest.config.js`
- React Native/Expo testing via `jest-expo` preset
- Path aliases working (`@/` → `src/`)
- Snapshot testing working
- Global mocks for React Native modules in `jest.setup.js`

### Existing Test Coverage

**Test Suites: 8 total (7 passing, 1 utility script)**

Utility function tests in `/src/utils/hazmat-compatibility-engine/__tests__/`:
- `note1-condition.test.ts` ✅
- `note4-condition.test.ts` ✅
- `note5-condition.test.ts` ✅
- `note6-condition.test.ts` ✅
- `note8-condition.test.ts` ✅
- `tableA18.1-class1.test.ts` ✅
- `tableA18.1-other-classes.test.ts` ✅
- `engineComparison.test.ts` (utility script, not a Jest test)

Component snapshot tests in `/src/components/__tests__/`:
- `DisclaimerScreen.test.tsx` ✅ (proof-of-concept)

**Total Tests: 319 passing**

### Component Test Coverage

- 1 of 225 components have tests (DisclaimerScreen - proof-of-concept)
- 1 snapshot test capturing baseline
- Visual regression tests: not yet configured
- E2E tests: not yet configured

### Installed Test Dependencies

```json
{
  "devDependencies": {
    "@testing-library/react-native": "^12.4.0",
    "@types/jest": "^29.5.0",
    "jest": "^29.7.0",
    "jest-expo": "~53.0.0",
    "react-test-renderer": "19.0.0"
  }
}
```

---

## Required Test Infrastructure Setup

### Phase 0.1: Install Testing Dependencies

Add to `package.json` devDependencies:

```json
{
  "devDependencies": {
    "@testing-library/react-native": "^12.4.0",
    "@testing-library/jest-native": "^5.4.3",
    "jest": "^29.7.0",
    "jest-expo": "~51.0.0",
    "@types/jest": "^29.5.0",
    "react-test-renderer": "19.0.0"
  }
}
```

Add test script:
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

### Phase 0.2: Configure Jest

Create `jest.config.js`:

```javascript
module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)'
  ],
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**'
  ],
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)', '**/*.test.[jt]s?(x)'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
};
```

---

## Test Requirements by Phase

### Before Phase 1 (Dead Code Removal)

**Required Tests: NONE**

Dead code deletion requires zero tests because:
- Code is confirmed unused via static analysis (grep)
- Removing unused code cannot break functionality
- Build verification is sufficient

**Verification Method:**
1. `grep -r "ComponentName" --include="*.tsx" src/` confirms 0 imports
2. `npx tsc --noEmit` confirms build still works
3. App launches successfully

### Before Phase 2 (Foundation Setup)

**Required Tests: NONE**

Phase 2 only creates NEW files (no modifications to existing code):
- theming/typography.ts
- theming/spacing.ts
- theming/index.ts
- /src/types/ structure

**Verification Method:**
1. `npx tsc --noEmit` confirms TypeScript compiles
2. New files don't break existing imports

### Before Phase 3 (UI Component Library)

**Required Tests: Snapshot tests for new components**

New UI components must have tests BEFORE being used anywhere:

```typescript
// src/components/ui/__tests__/Button.test.tsx
import React from 'react';
import { render } from '@testing-library/react-native';
import { Button } from '../Button';

describe('Button', () => {
  it('renders primary variant correctly', () => {
    const { toJSON } = render(
      <Button variant="primary" onPress={() => {}}>
        Click me
      </Button>
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders secondary variant correctly', () => {
    const { toJSON } = render(
      <Button variant="secondary" onPress={() => {}}>
        Click me
      </Button>
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders disabled state correctly', () => {
    const { toJSON } = render(
      <Button variant="primary" onPress={() => {}} disabled>
        Click me
      </Button>
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
```

### Before Phase 4 (Type Safety Improvements)

**Required Tests: Type compilation verification**

Type changes require:
1. `npx tsc --noEmit --strict` passes
2. Existing functionality tests pass
3. Manual smoke tests for affected workflows

**No new snapshot tests required** - type changes don't affect visual output.

### Before Phase 5 (Component Migration)

**CRITICAL: Snapshot tests MUST exist for EVERY component being modified**

Before migrating ANY component:

1. **Create baseline snapshot test:**
```typescript
// src/components/__tests__/DisclaimerScreen.test.tsx
import React from 'react';
import { render } from '@testing-library/react-native';
import { DisclaimerScreen } from '../DisclaimerScreen';

// Mock navigation
const mockNavigation = { navigate: jest.fn(), goBack: jest.fn() };

describe('DisclaimerScreen', () => {
  it('renders correctly', () => {
    const { toJSON } = render(
      <DisclaimerScreen navigation={mockNavigation} />
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
```

2. **Run snapshot and capture baseline:**
```bash
npm test -- --updateSnapshot
```

3. **Make refactoring changes**

4. **Run snapshot comparison:**
```bash
npm test
```

5. **Snapshot must pass with ZERO differences**

---

## Visual Regression Testing Strategy

### Recommended Tool: Storybook + Chromatic

**Why Storybook + Chromatic:**
- Industry standard for React Native
- CI/CD integration
- Visual diff highlighting
- Free tier available

### Alternative: Loki

**Why Loki (if self-hosted preferred):**
- No external service dependency
- Works with Storybook
- Docker-based screenshot comparison

### Setup Steps

1. Install Storybook:
```bash
npx storybook@latest init
```

2. Create stories for critical components:
```typescript
// src/components/DisclaimerScreen.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { DisclaimerScreen } from './DisclaimerScreen';

const meta: Meta<typeof DisclaimerScreen> = {
  title: 'Screens/DisclaimerScreen',
  component: DisclaimerScreen,
};

export default meta;
type Story = StoryObj<typeof DisclaimerScreen>;

export const Default: Story = {};
```

3. Capture baseline screenshots before any changes

4. Configure CI to run visual regression on every PR

---

## Component Priority for Testing

### Tier 1: MUST Have Tests Before Any Modification (Phase 5)

These components are used in critical workflows:

| Component | LOC | Workflows Affected |
|-----------|-----|-------------------|
| GrandfatheredWizard | 4,065 | Explosive packaging |
| InspectorAMC1015Form | 3,320 | Inspection forms |
| SDDGUploadAndParse | 2,787 | SDDG verification |
| MaterialIDScreen | 1,502 | Material identification |
| ShipmentCreationScreen | 1,495 | Shipment creation |
| POPMarkingDataEntry | 1,101 | POP marking |
| MainLayout | 830 | All preparer screens |
| InspectorMainLayout | 813 | All inspector screens |

### Tier 2: Should Have Tests Before Modification

| Component | LOC | Priority |
|-----------|-----|----------|
| PreparerHomeScreen | 997 | Medium |
| InspectorHomeScreen | 1,166 | Medium |
| All wizard components | Various | Medium |
| All form components | Various | Medium |

### Tier 3: Can Have Tests Added Incrementally

- Shared UI components
- Modal components
- Simple display components

---

## Test Coverage Goals

| Phase | Target Coverage | Focus Area |
|-------|-----------------|------------|
| Phase 0 | Infrastructure only | Setup Jest, configure CI |
| Phase 1 | 0% (no tests needed) | Dead code removal |
| Phase 2 | 0% (new files only) | Foundation setup |
| Phase 3 | 100% of new UI | New component library |
| Phase 4 | Compilation verification | Type safety |
| Phase 5 | 100% of modified components | Component migration |

**End Goal:** 40%+ line coverage on src/ directory

---

## CI/CD Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Test

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm test -- --coverage
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

### PR Requirements

Every PR must pass:
1. `npx tsc --noEmit` - TypeScript compilation
2. `npm test` - All unit/snapshot tests
3. Visual regression (when configured)
4. Manual smoke test for affected workflow

---

## Test Checklist Template

Use this checklist for every component modification in Phase 5:

```markdown
## Pre-Modification Checklist

- [ ] Snapshot test exists for this component
- [ ] Baseline snapshot committed to repository
- [ ] Manual smoke test documented
- [ ] Visual regression baseline captured (if configured)

## Post-Modification Checklist

- [ ] `npm test` passes with ZERO snapshot changes
- [ ] `npx tsc --noEmit` passes
- [ ] Manual smoke test passed
- [ ] Visual regression passed (if configured)
- [ ] No new console warnings/errors
```

---

## Next Steps

1. [x] Install testing dependencies (add to package.json) - DONE 2025-12-31
2. [x] Create jest.config.js - DONE 2025-12-31
3. [x] Verify existing tests still pass - DONE 2025-12-31 (315 tests passing)
4. [x] Create proof-of-concept snapshot test - DONE 2025-12-31 (DisclaimerScreen)
5. [ ] Set up CI pipeline for tests (GitHub Actions)
6. [ ] Evaluate and choose visual regression tool
7. [ ] Create Storybook stories for Tier 1 components
8. [ ] Capture baseline visual regression screenshots
9. [ ] Add snapshot tests for remaining components before Phase 5 modifications
