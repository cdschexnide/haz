# Continuation Prompt for HazPro Mobile App Refactoring

## Context

You are continuing a refactoring effort on a React Native/Expo mobile application (HazPro). Previous sessions completed Phase 0 (documentation) and significant Phase 1 work (dead code removal). Your job is to continue the refactoring safely.

## Critical Constraint: ZERO User-Facing Changes

**This refactor must produce ZERO changes visible to users:**
- No visual changes (colors, spacing, fonts, layouts)
- No behavioral changes (button actions, navigation flows, form submissions)
- No UX flow changes (screen order, modal timing, validation messages)
- No performance regressions

**Mantra: "Same car, rebuilt engine"**

---

## What's Been Done

### Documentation Created (in `docs/refactor/`)
- `TESTING_STRATEGY.md` - Testing requirements, identified 0% component test coverage
- `RISK_REGISTER.md` - Risk assessment for all phases
- `SMOKE_TEST_CHECKLISTS.md` - 14 manual test checklists
- `CHANGELOG.md` - Tracks all commits with hashes and descriptions

### Dead Code Removed (Phase 1 - Mostly Complete)

**Total: 44+ files, ~19,700+ lines removed**

| Category | Files Removed | Lines |
|----------|---------------|-------|
| SDDG processor/extractor files | 9 | ~3,000 |
| Inspector components | 4 | ~1,500 |
| Wizard/Packaging files | 6 | ~2,000 |
| PackagingWizardV2 subcomponents | 5 | ~1,200 |
| Misc unused components | 9 | ~3,000 |
| Unused utility files | 7 | ~5,200 |
| Render helper components | 2 | ~110 |
| Legacy SDDG screen | 1 | ~743 |
| Dev test script | 1 | ~97 |
| Console.log cleanup | - | ~120 |

### Key Finding
The codebase has **0% component test coverage** - only 8 test files exist, all for utility functions.

### Git State
- **Branch**: `mobile-app-refactor`
- **Base**: `develop`
- **Commits ahead**: 14 (not yet pushed)
- **Working directory**: Should be clean

---

## What's Left To Do

### Recommended Next Steps (In Order)

#### 1. Set Up Testing Infrastructure (Phase 0.5) - LOW RISK
This enables snapshot testing which is required before Phase 5.

**Add to `package.json` devDependencies:**
```json
{
  "@testing-library/react-native": "^12.4.0",
  "@testing-library/jest-native": "^5.4.3",
  "jest": "^29.7.0",
  "jest-expo": "~51.0.0",
  "@types/jest": "^29.5.0",
  "react-test-renderer": "19.0.0"
}
```

**Add test scripts to `package.json`:**
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

**Create `jest.config.js`** - see `docs/refactor/TESTING_STRATEGY.md` for full config.

**Verification**: Run existing tests in `src/utils/hazmat-compatibility-engine/__tests__/`

#### 2. Foundation Setup (Phase 2) - ZERO RISK
Creates new files only, no modifications to existing code.

**Create theming files:**
- `src/theming/typography.ts` - Font sizes, weights, line heights
- `src/theming/spacing.ts` - Consistent spacing values
- `src/theming/index.ts` - Barrel export

**Create types structure:**
- `src/types/index.ts` - Barrel export
- Split large type files into domain-specific files (shipment, hazmat, packaging, etc.)

#### 3. Fix Empty Screen Issue (Phase 1 Cleanup) - LOW RISK
`src/components/Inspector/InspectorNewLabelingAndMarkingScreen.tsx` is:
- Empty file (0 bytes)
- Referenced in `InspectorHomeScreen.tsx` navigation
- NOT registered in `InspectorLayoutNavigator.tsx`

**Options:**
1. Delete the file AND remove the navigation call in InspectorHomeScreen.tsx
2. Implement a placeholder screen if the feature is planned

---

## Future Phases (Per Roadmap)

| Phase | Description | Risk | Prerequisites |
|-------|-------------|------|---------------|
| Phase 3 | UI component library (Button, FormField, Modal, Text) | ZERO | Phase 2 complete |
| Phase 4 | Type safety improvements (reduce `any` types) | LOW | Phase 3 complete |
| Phase 5 | Component migration to new abstractions | HIGH | Snapshot tests required |

---

## Key Files To Read Before Making Changes

1. `/Users/home/.claude/plans/piped-splashing-allen.md` - Full refactoring roadmap
2. `docs/refactor/TESTING_STRATEGY.md` - Test requirements per phase
3. `docs/refactor/RISK_REGISTER.md` - Risk assessment
4. `docs/refactor/SMOKE_TEST_CHECKLISTS.md` - Manual test procedures
5. `docs/refactor/CHANGELOG.md` - All commits made so far

---

## Verification Pattern

For every change:
1. **Before**: Verify the change is safe (grep for imports, check navigation)
2. **During**: Make minimal changes
3. **After**: Run `npx tsc --noEmit` to verify build

**Note**: ~50+ pre-existing TypeScript errors exist. These are NOT to be fixed unless explicitly requested.

---

## Dead Code Deletion Pattern

If you find more dead code:

```bash
# Step 1: Search for imports
grep -r "from.*ComponentName" src/ --include="*.tsx" --include="*.ts"

# Step 2: Also check server/ directory
grep -r "ComponentName" server/ --include="*.ts" --include="*.tsx"

# Step 3: If 0 results (or only self-reference), safe to delete
rm src/path/to/ComponentName.tsx

# Step 4: Verify build
npx tsc --noEmit 2>&1 | grep -i "ComponentName"  # Should show nothing new
```

---

## Files Known To Be USED (Do NOT Delete)

These were verified as actively imported:
- `MainLayoutNavigator.tsx` (navigation entry point)
- `InspectorLayoutNavigator.tsx` (navigation entry point)
- `LoginScreen.tsx` (app entry point)
- `PackagingWizardV2.tsx` and its actively used subcomponents
- `packagingCategoryGenerator.ts` (used by server/)
- All components in `src/components/shared/` that are imported elsewhere

---

## Git Commit Requirements

**All changes must be committed with:**
1. Descriptive commit message explaining what changed and why
2. Footer with Claude Code attribution:
   ```
   🤖 Generated with [Claude Code](https://claude.com/claude-code)

   Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
   ```
3. Commit hash recorded in `docs/refactor/CHANGELOG.md`

**When user asks for commit hashes, only report commits from the CURRENT SESSION.**

---

## Pre-Existing Issues (Do NOT Fix Unless Asked)

- ~50+ TypeScript errors exist in the codebase (type mismatches, missing properties)
- Valtio generated types have broken imports
- These are pre-existing and fixing them could change behavior

---

## Start Here

1. Read the key documentation files listed above
2. Ask the user what they'd like to focus on:
   - Testing infrastructure setup (recommended - enables future phases)
   - Foundation setup (Phase 2 - create theming/types files)
   - Fix the empty InspectorNewLabelingAndMarkingScreen issue
   - Continue dead code exploration
   - Something else

Then proceed with that task, maintaining the zero user-facing changes constraint.

---

## Session Tracking

When you complete work, provide:
1. List of commits made (hash + description)
2. Summary of files changed/deleted
3. Updated line counts
4. Next recommended steps
