# Continuation Prompt: Testing Infrastructure Setup

## Context

You are continuing a refactoring effort on a React Native/Expo mobile application (HazPro). Previous sessions completed Phase 0 (documentation), Phase 1 (dead code removal - 44+ files, ~19,700 lines), Phase 2 foundation (theming/types files), and a critical bug fix. Your job is to set up testing infrastructure that will serve as the safety net for future refactoring.

---

## CRITICAL CONSTRAINT: ZERO User-Facing Changes

**This refactor must produce ZERO changes visible to users:**
- No visual changes (colors, spacing, fonts, layouts)
- No behavioral changes (button actions, navigation flows, form submissions)
- No UX flow changes (screen order, modal timing, validation messages)
- No performance regressions

**Mantra: "Same car, rebuilt engine"**

The purpose of testing infrastructure is to **lock in current behavior** so that future refactoring phases can confidently make internal changes while guaranteeing the user experience remains identical.

---

## Why Testing Infrastructure First?

The codebase currently has **0% component test coverage**:
- Only 8 test files exist, all for utility functions in `/src/utils/hazmat-compatibility-engine/__tests__/`
- 225 components have zero tests
- No snapshot tests
- No visual regression tests

**Without tests, we cannot safely refactor.** Future phases (especially Phase 5: Component Migration) require snapshot tests to prove that internal changes don't alter rendered output.

Tests serve as **behavioral documentation** - they capture "what the app currently does" so refactoring can focus purely on "how it does it internally."

---

## What's Been Done

### Phase 0: Documentation ✅
- `docs/refactor/TESTING_STRATEGY.md` - Testing requirements
- `docs/refactor/RISK_REGISTER.md` - Risk assessment
- `docs/refactor/SMOKE_TEST_CHECKLISTS.md` - Manual test procedures
- `docs/refactor/CHANGELOG.md` - All commits tracked

### Phase 1: Dead Code Removal ✅
- 44+ files removed (~19,700 lines)
- Console.log cleanup in hazProActions.ts

### Phase 2: Foundation Setup ✅
- `src/theming/typography.ts` - Font scales
- `src/theming/spacing.ts` - Spacing scales
- `src/theming/index.ts` - Barrel export
- `src/types/index.ts` - Types barrel export

### Bug Fix ✅
- Removed empty `InspectorNewLabelingAndMarkingScreen.tsx`
- Fixed broken navigation in `InspectorHomeScreen.tsx`

### Git State
- **Branch**: `mobile-app-refactor`
- **Base**: `develop`
- **Working directory**: Should be clean

---

## Your Task: Set Up Testing Infrastructure

### Goal
Install and configure testing tools so that:
1. Existing utility tests continue to pass
2. New snapshot tests can be written for components
3. Future phases have a foundation for regression testing

### Step 1: Install Testing Dependencies

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

**Important**: Match `react-test-renderer` version to the React version in dependencies (currently 19.0.0).

### Step 2: Add Test Scripts

Add to `package.json` scripts:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

### Step 3: Create Jest Configuration

Create `jest.config.js` in project root:

```javascript
module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|react-native-elements|@rneui/.*|react-native-paper)'
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
  },
  testEnvironment: 'node'
};
```

### Step 4: Verify Existing Tests Pass

Run the existing utility tests to ensure they still work:

```bash
npm test -- --testPathPattern="hazmat-compatibility-engine"
```

These tests are in:
- `src/utils/hazmat-compatibility-engine/__tests__/note1-condition.test.ts`
- `src/utils/hazmat-compatibility-engine/__tests__/note4-condition.test.ts`
- `src/utils/hazmat-compatibility-engine/__tests__/note5-condition.test.ts`
- `src/utils/hazmat-compatibility-engine/__tests__/note6-condition.test.ts`
- `src/utils/hazmat-compatibility-engine/__tests__/note8-condition.test.ts`
- `src/utils/hazmat-compatibility-engine/__tests__/tableA18.1-class1.test.ts`
- `src/utils/hazmat-compatibility-engine/__tests__/tableA18.1-other-classes.test.ts`
- `src/utils/hazmat-compatibility-engine/engineComparison.test.ts`

### Step 5: Create a Sample Snapshot Test

Create a simple snapshot test to verify the infrastructure works. Choose a small, simple component.

Example structure:
```
src/components/__tests__/
  SimpleComponent.test.tsx
```

### Step 6: Document Test Running Instructions

Update `docs/refactor/TESTING_STRATEGY.md` with:
- How to run tests
- How to update snapshots
- Test file naming conventions

---

## Key Considerations

### Mocking Requirements

React Native components often need mocks. You may need to create:
- `jest.setup.js` for global mocks
- Mocks for navigation (`@react-navigation/*`)
- Mocks for native modules (camera, file system, etc.)

### Common Issues to Watch For

1. **Transform errors**: If you see "unexpected token" errors, update `transformIgnorePatterns`
2. **Native module errors**: Mock native modules that can't run in Jest
3. **Navigation context**: Components using navigation hooks need `NavigationContainer` wrapper

### DO NOT Fix Pre-existing Issues

The codebase has ~50+ TypeScript errors. These are pre-existing and should NOT be fixed unless explicitly requested. Focus only on testing infrastructure.

---

## Verification Pattern

For every change:
1. **Before**: Verify existing tests pass (if any)
2. **During**: Make minimal changes
3. **After**: Run `npm test` and `npx tsc --noEmit`

---

## Files to Reference

1. `/Users/home/.claude/plans/piped-splashing-allen.md` - Full refactoring roadmap
2. `docs/refactor/TESTING_STRATEGY.md` - Current testing strategy document
3. `docs/refactor/CHANGELOG.md` - All commits made
4. `package.json` - Current dependencies
5. `tsconfig.json` - TypeScript configuration

---

## Git Commit Requirements

**All changes must be committed with:**
1. Descriptive commit message
2. Footer with Claude Code attribution:
   ```
   🤖 Generated with [Claude Code](https://claude.com/claude-code)

   Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
   ```
3. Commit hash recorded in `docs/refactor/CHANGELOG.md`

---

## Success Criteria

Testing infrastructure is complete when:
- [ ] All testing dependencies installed
- [ ] `npm test` command works
- [ ] Existing utility tests pass
- [ ] Jest configuration handles React Native/Expo
- [ ] At least one snapshot test works as proof-of-concept
- [ ] CHANGELOG.md updated with commits

---

## What NOT To Do

1. **DO NOT** write tests for all 225 components (that's future work)
2. **DO NOT** fix pre-existing TypeScript errors
3. **DO NOT** modify any component code
4. **DO NOT** change any user-facing behavior
5. **DO NOT** add visual regression tools yet (Storybook/Chromatic is future work)

The goal is minimal, working test infrastructure - not comprehensive test coverage.

---

## After Completion

Once testing infrastructure is set up, the next phases can proceed:
- **Phase 3**: UI component library (new components need tests)
- **Phase 4**: Type safety improvements
- **Phase 5**: Component migration (requires snapshot tests before modifying each component)

Report:
1. List of commits made (hash + description)
2. Any issues encountered and how they were resolved
3. Confirmation that existing tests pass
4. Next recommended steps
