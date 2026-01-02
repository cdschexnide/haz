# Risk Register for HazPro Mobile App Refactoring

## Risk Assessment Methodology

Each risk is evaluated on:
- **Likelihood**: Low / Medium / High
- **Impact**: Low / Medium / High / Critical
- **Risk Level**: Calculated as Likelihood x Impact
- **Mitigation**: Specific actions to reduce risk

---

## CRITICAL RISKS (Must Address Before Proceeding)

### RISK-001: Zero Component Test Coverage

| Attribute | Value |
|-----------|-------|
| **Category** | Testing |
| **Likelihood** | Certain |
| **Impact** | Critical |
| **Risk Level** | CRITICAL |
| **Current State** | 0 of 225 components have tests |
| **Affected Phases** | Phase 5 (Component Migration) |

**Description:**
Without snapshot tests, any component modification could introduce visual changes that go undetected. This directly violates the "Zero User-Facing Changes" constraint.

**Mitigation:**
1. Install testing infrastructure before Phase 5
2. Create snapshot tests for ALL components before modifying them
3. Require snapshot test pass as PR gate
4. Implement visual regression testing

**Owner:** Development Team
**Status:** Open - Addressed by Phase 0

---

### RISK-002: GrandfatheredWizard Modification

| Attribute | Value |
|-----------|-------|
| **Category** | Component |
| **Likelihood** | High |
| **Impact** | Critical |
| **Risk Level** | CRITICAL |
| **Affected Files** | `src/components/GrandfatheredWizard.tsx` (4,065 lines) |
| **Affected Phases** | Phase 5 |

**Description:**
This is the largest component in the codebase with complex state management across 9+ wizard steps. Decomposition carries high risk of:
- State synchronization bugs
- Missing conditional branches
- Incorrect navigation flow
- Data loss between steps

**Mitigation:**
1. Create comprehensive snapshot tests for ALL wizard states
2. Document every wizard path manually
3. Extract ONE internal function at a time
4. Keep original component as wrapper
5. Full manual regression test after each extraction
6. Feature flag to toggle between old/new implementation

**Owner:** Development Team
**Status:** Open - Deferred to Phase 5

---

### RISK-003: Navigation Entry Point False Positives

| Attribute | Value |
|-----------|-------|
| **Category** | Dead Code Analysis |
| **Likelihood** | Medium |
| **Impact** | Critical |
| **Risk Level** | HIGH |
| **Affected Files** | `MainLayoutNavigator.tsx`, `InspectorLayoutNavigator.tsx`, `LoginScreen.tsx` |
| **Affected Phases** | Phase 1 |

**Description:**
Static analysis shows 0 imports for these files, but they may be:
- Entry points referenced in App.tsx via different patterns
- Dynamically imported
- Referenced via string paths in navigation config

Deleting these would break the entire application.

**Mitigation:**
1. DO NOT delete these files in Tier 1
2. Manually trace App.tsx to verify usage
3. Search for string references: `grep -r "MainLayoutNavigator" --include="*.ts*"`
4. Test app launch after any navigation-related changes

**Owner:** Development Team
**Status:** Open - Verified as false positives (these ARE used)

---

## HIGH RISKS

### RISK-004: Theme System Changes

| Attribute | Value |
|-----------|-------|
| **Category** | Styling |
| **Likelihood** | Medium |
| **Impact** | High |
| **Risk Level** | HIGH |
| **Affected Files** | All 225 components |
| **Affected Phases** | Phase 2, Phase 5 |

**Description:**
The codebase has 5,437+ hardcoded hex colors. Inconsistent color usage means:
- Different components use different hex values for "the same" color
- Replacing hardcoded values with theme variables could shift colors
- Users would notice visual differences

**Mitigation:**
1. Phase 2 only CREATES theme files - no replacements
2. Defer color replacement to Phase 5
3. Require visual regression testing before any color changes
4. Document exact hex values used in each component
5. One-to-one replacement only (no "close enough" colors)

**Owner:** Development Team
**Status:** Open - Deferred theme enforcement until visual regression in place

---

### RISK-005: InspectorAMC1015Form Decomposition

| Attribute | Value |
|-----------|-------|
| **Category** | Component |
| **Likelihood** | Medium |
| **Impact** | High |
| **Risk Level** | HIGH |
| **Affected Files** | `src/components/Inspector/InspectorAMC1015Form.tsx` (3,320 lines) |
| **Affected Phases** | Phase 5 |

**Description:**
Large form component with complex validation and data persistence. Risks:
- Form submission could fail silently
- Validation rules could be missed
- Data formatting could change
- Form state could be lost

**Mitigation:**
1. Create snapshot tests for all form states
2. Document all validation rules
3. Test form submission end-to-end manually
4. Extract by form section (not arbitrary cuts)
5. Verify data persistence after changes

**Owner:** Development Team
**Status:** Open - Deferred to Phase 5

---

### RISK-006: SDDG Extractor Version Consolidation

| Attribute | Value |
|-----------|-------|
| **Category** | Dead Code / Feature |
| **Likelihood** | Medium |
| **Impact** | High |
| **Risk Level** | HIGH |
| **Affected Files** | `SDDGTemplateExtractor.tsx`, `SDDGTemplateExtractorV2.tsx`, `SDDGTemplateExtractorV3.tsx` |
| **Affected Phases** | Phase 1 |

**Description:**
Three versions exist. V3 appears to be the latest, but:
- Older versions may handle edge cases V3 doesn't
- Some code paths might explicitly use V1 or V2
- Document extraction accuracy could degrade

**Mitigation:**
1. Search for ALL usages of each version
2. Compare extraction logic between versions
3. Test SDDG scanning with known documents
4. Keep V3 only if it's a strict superset of V1/V2 functionality
5. Manual test: scan 5+ different SDDG documents after deletion

**Owner:** Development Team
**Status:** Open - Requires verification before deletion

---

### RISK-007: Type Strictness Breaking Runtime

| Attribute | Value |
|-----------|-------|
| **Category** | Type Safety |
| **Likelihood** | Medium |
| **Impact** | Medium |
| **Risk Level** | MEDIUM-HIGH |
| **Affected Files** | Store files, context files, reducer files |
| **Affected Phases** | Phase 4 |

**Description:**
Currently 687 `any` types mask potential type mismatches. Adding stricter types could:
- Reveal existing bugs (good)
- Reject valid runtime data (bad)
- Break store operations that rely on loose typing

**Mitigation:**
1. Add types incrementally (one file at a time)
2. Use `unknown` instead of removing `any` entirely
3. Add runtime type guards for critical paths
4. Test with production-like data
5. Don't enable `strict: true` all at once

**Owner:** Development Team
**Status:** Open - Phase 4

---

## MEDIUM RISKS

### RISK-008: Hook Extraction State Timing

| Attribute | Value |
|-----------|-------|
| **Category** | Refactoring |
| **Likelihood** | Medium |
| **Impact** | Medium |
| **Risk Level** | MEDIUM |
| **Affected Files** | Components with complex state |
| **Affected Phases** | Phase 5 |

**Description:**
Extracting logic into custom hooks could change:
- When useEffect runs
- State update batching
- Re-render timing
- Memoization behavior

**Mitigation:**
1. Use React DevTools to verify render count before/after
2. Test state transitions manually
3. Add integration tests for state-heavy workflows
4. Keep hook logic identical to inline version

**Owner:** Development Team
**Status:** Open - Phase 5

---

### RISK-009: Build System Compatibility

| Attribute | Value |
|-----------|-------|
| **Category** | Infrastructure |
| **Likelihood** | Low |
| **Impact** | High |
| **Risk Level** | MEDIUM |
| **Affected Files** | package.json, metro.config.js, tsconfig.json |
| **Affected Phases** | Phase 0-2 |

**Description:**
Adding testing infrastructure could conflict with:
- Expo configuration
- Metro bundler
- Existing TypeScript config

**Mitigation:**
1. Use `jest-expo` preset for compatibility
2. Test build after adding each dependency
3. Don't modify existing config files (add new ones)
4. Verify `expo start` still works after changes

**Owner:** Development Team
**Status:** Open - Phase 0

---

### RISK-010: Store Migration to Typed Actions

| Attribute | Value |
|-----------|-------|
| **Category** | State Management |
| **Likelihood** | Medium |
| **Impact** | Medium |
| **Risk Level** | MEDIUM |
| **Affected Files** | `hazProActions.ts`, `hazProStore.ts`, `useHazProStore.ts` |
| **Affected Phases** | Phase 4 |

**Description:**
Replacing generic `UPDATE_FIELD` actions with specific typed actions could:
- Miss some action dispatches
- Break reducer logic
- Cause state to become stale

**Mitigation:**
1. Keep `UPDATE_FIELD` as fallback initially
2. Add new specific actions alongside existing ones
3. Migrate callers one at a time
4. Verify store state after each migration

**Owner:** Development Team
**Status:** Open - Phase 4

---

## LOW RISKS

### RISK-011: Console.log Removal

| Attribute | Value |
|-----------|-------|
| **Category** | Code Quality |
| **Likelihood** | Low |
| **Impact** | Low |
| **Risk Level** | LOW |
| **Affected Files** | `hazProActions.ts` |
| **Affected Phases** | Phase 1 (Quick Wins) |

**Description:**
Removing console.log statements has near-zero risk as they don't affect functionality.

**Mitigation:**
1. Verify they're not logging critical errors
2. Keep error-related logs if present
3. Only remove debug/info logs

**Owner:** Development Team
**Status:** Open - Quick Win

---

### RISK-012: New File Creation

| Attribute | Value |
|-----------|-------|
| **Category** | Infrastructure |
| **Likelihood** | Near Zero |
| **Impact** | None |
| **Risk Level** | ZERO |
| **Affected Files** | New files only |
| **Affected Phases** | Phase 2, Phase 3 |

**Description:**
Creating new files (theming, types, UI components) that aren't imported anywhere cannot affect existing functionality.

**Mitigation:**
None required - inherently safe.

**Owner:** Development Team
**Status:** Accepted

---

### RISK-013: Documentation Creation

| Attribute | Value |
|-----------|-------|
| **Category** | Documentation |
| **Likelihood** | None |
| **Impact** | None |
| **Risk Level** | ZERO |
| **Affected Files** | `docs/refactor/*` |
| **Affected Phases** | All |

**Description:**
Documentation files have no runtime impact.

**Mitigation:**
None required.

**Owner:** Development Team
**Status:** Accepted

---

## Risk Summary by Phase

| Phase | Critical Risks | High Risks | Medium Risks | Low Risks |
|-------|---------------|------------|--------------|-----------|
| Phase 0 | RISK-001 | - | RISK-009 | - |
| Phase 1 | RISK-003 | RISK-006 | - | RISK-011, RISK-012 |
| Phase 2 | - | RISK-004 | - | RISK-012 |
| Phase 3 | - | - | - | RISK-012 |
| Phase 4 | - | RISK-007 | RISK-010 | - |
| Phase 5 | RISK-002, RISK-005 | RISK-004 | RISK-008 | - |

---

## Risk Monitoring

### Weekly Risk Review Checklist

- [ ] Review any new risks identified during development
- [ ] Update risk status (Open/Mitigated/Closed)
- [ ] Verify mitigations are being followed
- [ ] Escalate any risks that increased in severity

### Risk Acceptance Criteria

A risk can be accepted when:
1. Mitigation is in place
2. Testing coverage exists for affected area
3. Rollback plan is documented
4. Team lead has approved

---

## Appendix: Component Risk Scores

Components ranked by modification risk (higher = more risky):

| Rank | Component | LOC | Imports | State Complexity | Risk Score |
|------|-----------|-----|---------|------------------|------------|
| 1 | GrandfatheredWizard | 4,065 | 29 | Very High | 100 |
| 2 | InspectorAMC1015Form | 3,320 | 11 | High | 85 |
| 3 | SDDGUploadAndParse | 2,787 | 11 | High | 80 |
| 4 | MainLayout | 830 | 13 | High (HOC) | 75 |
| 5 | InspectorMainLayout | 813 | 14 | High (HOC) | 75 |
| 6 | MaterialIDScreen | 1,502 | 22 | Medium | 70 |
| 7 | ShipmentCreationScreen | 1,495 | 13 | Medium | 65 |
| 8 | POPMarkingDataEntry | 1,101 | 14 | Medium | 60 |
| 9 | CylinderEntryScreen | 1,804 | 12 | Medium | 60 |
| 10 | PackagingWizardV2 | 1,160 | 17 | Medium | 55 |

**Risk Score Formula:**
`(LOC / 50) + (Imports * 2) + (State Complexity Factor)`

Where State Complexity Factor:
- Very High = 30
- High = 20
- Medium = 10
- Low = 5
