# Testing Patterns

**Analysis Date:** 2026-01-30

## Test Framework

**Runner:**
- Jest 29.7.0
- Preset: `jest-expo` (for Expo/React Native support)
- Config: `/Users/codyschexnider/Documents/Technergetics/refactor/haz/jest.config.js`

**Assertion Library:**
- Built-in Jest matchers via `@testing-library/react-native/extend-expect`
- `@testing-library/react-native` 12.4.0 for React Native component testing
- Custom matchers extended in `jest.setup.js`

**Run Commands:**
```bash
npm test                  # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
```

## Test File Organization

**Location:**
- Co-located pattern: Tests placed in `__tests__` subdirectories alongside source code
- Example: `src/services/sddg/anchorDetection.ts` → `src/services/sddg/__tests__/anchorDetection.test.ts`
- Component tests: `src/components/preparer/__tests__/CountryAutocomplete.test.tsx`

**Naming:**
- `*.test.ts` for unit tests of utilities/services
- `*.test.tsx` for component tests
- Scenario tests: `*.scenarios.test.ts` for test suites covering multiple conditions
- Integration tests: `*.integration.test.ts`

**Structure:**
```
src/
├── services/sddg/
│   ├── anchorDetection.ts
│   └── __tests__/
│       ├── anchorDetection.test.ts
│       ├── anchorBasedExtractor.test.ts
│       └── cellBuilder.test.ts
├── utils/
│   ├── markingRequirements.ts
│   └── __tests__/
│       ├── markingRequirements.class1.test.ts
│       └── markingRequirements.class1.scenarios.test.ts
```

## Test Structure

**Suite Organization:**
```typescript
import { fuzzyMatch } from "../anchorDetection";
import { SDDG_ANCHORS } from "../anchorConfig";

describe("anchorDetection", () => {
  describe("fuzzyMatch", () => {
    it("should match exact text", () => {
      expect(fuzzyMatch("SHIPPER", ["SHIPPER", "Shipper"])).toBe(true);
    });

    it("should match case-insensitively", () => {
      expect(fuzzyMatch("shipper", ["SHIPPER", "Shipper"])).toBe(true);
    });

    it("should handle OCR errors", () => {
      expect(fuzzyMatch("SHPPER", ["SHIPPER"])).toBe(true);
    });
  });

  describe("findAnchors", () => {
    it("should find SHIPPER anchor", () => {
      // test implementation
    });
  });
});
```

**Patterns:**
- Setup: Minimal, often no explicit setup needed
- Teardown: `jest.clearAllMocks()` in `beforeEach()`
- Assertion: Direct `expect()` statements with clear assertion intent

**Example setup from component test:**
```typescript
describe("InspectionFormProvider finalize + reset", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("saves new inspection then clears provider state", async () => {
    // test body
  });
});
```

## Mocking

**Framework:** Jest mocks (`jest.mock()`, `jest.fn()`)

**Patterns:**
```typescript
// Mock entire modules
jest.mock('@/contexts/DataProvider', () => ({
  useDatabase: () => mockDatabase,
}));

// Mock individual functions
const mockDatabase = {
  saveInspection: jest.fn().mockResolvedValue("new-id"),
  updateInspection: jest.fn().mockResolvedValue(undefined),
  loadInspection: jest.fn().mockResolvedValue(null),
};

// Mock with return values
jest.mock('expo-file-system', () => ({
  documentDirectory: 'file:///mock/',
  readAsStringAsync: jest.fn(),
  writeAsStringAsync: jest.fn(),
}));

// Reset mocks between tests
jest.clearAllMocks();
```

**What to Mock:**
- External dependencies: `expo-file-system`, `expo-sqlite`, `@react-navigation/native`
- Context providers and their hooks
- Hardware APIs: `expo-camera`, `expo-image-picker`
- Gesture handlers: `react-native-gesture-handler`
- Reanimated: `react-native-reanimated`

**What NOT to Mock:**
- Business logic utilities (validation functions, parsers)
- Core type definitions and interfaces
- Database schema and migrations (tested separately)
- Pure functions and algorithms

**Global Mocks in jest.setup.js:**
- `react-native-reanimated`: Full mock with call handler
- `expo-file-system`: All methods mocked
- `expo-sqlite`: Database operations mocked
- `@react-native-async-storage/async-storage`: Pre-configured mock
- `expo-camera`: Camera permissions and constants
- `expo-image-picker`: Image library and camera launchers
- `react-native-gesture-handler`: All gesture handlers
- React Navigation: `useNavigation()`, `useRoute()`, `useFocusEffect()`
- `react-native-webview`: WebView mock

## Fixtures and Factories

**Test Data:**
```typescript
// Context factory pattern
function createClass1Context(
  unNumber: string,
  hazardClass: string,
  properShippingName: string,
  options: {
    usesPopMarking?: boolean;
    isLimitedQuantity?: boolean;
    isExceptedQuantity?: boolean;
  } = {}
): HazProPreparerContext {
  const hazardousMaterial: HazardousMaterialItem = {
    unid: unNumber,
    properShippingName,
    hazclassDiv: hazardClass,
    packingGroup: '', // Class 1 explosives typically have no packing group
    packagingParagraph: 'A3.3.1.',
  };
  return { hazardousMaterial, /* ... */ };
}
```

**Location:**
- Factories placed within test files that use them
- Shared fixtures: `src/testScenarios/` directory
- Example: `src/testScenarios/class6-packaging-paragraphs.fixture.ts`

**Pattern:** Builder pattern for constructing test contexts
```typescript
const testContext = createClass1Context('UN0335', '1.1D', 'Powder, fire', {
  usesPopMarking: true,
  isLimitedQuantity: false,
});
```

## Coverage

**Requirements:**
- Coverage configuration in `jest.config.js`
- Collected from: `src/**/*.{ts,tsx}`
- Excluded: `src/**/*.d.ts`, `src/**/__tests__/**`

**View Coverage:**
```bash
npm run test:coverage
```

**Coverage report location:** `coverage/` directory with HTML report at `coverage/lcov-report/index.html`

## Test Types

**Unit Tests:**
- Scope: Individual functions and utilities
- Approach: Test pure functions with various inputs and edge cases
- Example: `anchorDetection.test.ts` tests fuzzy matching algorithm with exact, case-insensitive, and OCR error scenarios
- Location: `src/services/sddg/__tests__/*.test.ts`, `src/utils/__tests__/*.test.ts`

**Integration Tests:**
- Scope: Multiple components working together
- Approach: Full component rendering with context providers
- Example: `InspectionFormProvider.test.tsx` tests form state management across save/load/finalize
- Location: `src/contexts/**/__tests__/*.test.tsx`

**Scenario-Based Tests:**
- Scope: Domain-specific test cases (e.g., hazmat regulation classes)
- Approach: Parametrized test patterns with multiple scenarios
- Example: `markingRequirements.class1.scenarios.test.ts`, `sddgValidation.class3.scenarios.test.ts`
- Pattern: Each class (Class 1-9) has dedicated scenario tests

**E2E Tests:**
- Not currently used
- Could be added with Detox or Expo Testing Library for full app flows

## Common Patterns

**Async Testing:**
```typescript
it("saves inspection then clears state", async () => {
  let ctx: ReturnType<typeof useInspectionForm> | null = null;
  render(
    <InspectionFormProvider>
      <TestHarness
        onReady={value => {
          ctx = value;
        }}
      />
    </InspectionFormProvider>
  );

  await act(async () => {
    ctx?.setExtractedSDDGContent({ shipper: "X" } as any);
  });

  await act(async () => {
    const result = await (ctx as any).finalizeInspection();
    expect(result.success).toBe(true);
  });
});
```

**Error Testing:**
```typescript
it("should match case-insensitively", () => {
  expect(fuzzyMatch("shipper", ["SHIPPER"])).toBe(true);
});

it("should not match unrelated text", () => {
  expect(fuzzyMatch("CONSIGNEE", ["SHIPPER"])).toBe(false);
});
```

**Component Testing with Mocks:**
```typescript
const mockDatabase = {
  isInitialized: true,
  saveInspection: jest.fn().mockResolvedValue("new-id"),
  updateInspection: jest.fn().mockResolvedValue(undefined),
};

jest.mock("@/contexts/DataProvider", () => ({
  useDatabase: () => mockDatabase,
}));

it("test with mocked context", () => {
  render(<InspectionFormProvider><TestComponent /></InspectionFormProvider>);
  // assertions
});
```

## Test Environment

**Environment:** `node` (as configured in `jest.config.js`)

**Transform Patterns:**
- TypeScript transformed via babel-jest
- React Native modules transformed via jest-expo
- Path aliases resolved at test runtime

**Module Name Mapping:**
- `@/(.*)` → `<rootDir>/src/$1` (allows tests to use `@/` imports)

**Ignored Patterns:**
- Node modules (except specific React Native packages)
- Server directories
- `.worktrees/` directory
- `.d.ts` files from coverage collection

**Global Configuration:**
- Timeout: 30000ms (for SQLite operations and async tests)
- Warning suppression for known harmless warnings (Animated, lifecycle methods)
- Matchers extended from `@testing-library/react-native`

---

*Testing analysis: 2026-01-30*
