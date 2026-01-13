# Prompt: Add Unit Tests for Class 1 Scenarios 6-20

Use this prompt with a new Claude Code instance to extend the existing unit tests with scenarios 6-20.

---

## Task Overview

This is a continuation of the unit test extraction work. A previous Claude instance already created unit tests for **Scenarios 1-5** from `src/testScenarios/class1.md`.

Your task is to **add unit tests for Scenarios 6-20** to the existing test files.

**IMPORTANT:**
- Use superpowers skills and subagents throughout this task
- Do NOT create new test files - ADD to the existing ones
- Follow the patterns established in the existing tests

---

## Reference Document

**Read this first:** `docs/plans/2026-01-13-class1-unit-tests.md`

This document contains:
- The implementation plan from scenarios 1-5
- Test file locations and structure
- Patterns and conventions used
- Any gap analysis or notes from the first implementation

---

## Existing Test Files (Add to These)

The previous implementation created tests in:

```
src/utils/__tests__/
├── labelingRequirementsInspector.test.ts
├── markingRequirements.test.ts
└── sddgValidation.test.ts

server/lookupFunctions/__tests__/
└── packagingLookupV2.test.ts
```

**Your job:** Add new `describe` blocks for scenarios 6-20 to these existing files.

---

## Phase 1: Research (Use Subagents in Parallel)

Launch these subagents simultaneously:

### Subagent 1: Read Reference Document
```
Read docs/plans/2026-01-13-class1-unit-tests.md thoroughly.
Extract:
- Test file structure and locations
- Function signatures discovered
- Patterns used for positive/negative tests
- Any gaps or issues noted
- Conventions for test naming
```

### Subagent 2: Read Existing Test Files
```
Read all existing test files created by the previous implementation:
- src/utils/__tests__/labelingRequirementsInspector.test.ts
- src/utils/__tests__/markingRequirements.test.ts
- src/utils/__tests__/sddgValidation.test.ts
- server/lookupFunctions/__tests__/packagingLookupV2.test.ts

Document:
- Import statements used
- Mock patterns
- Describe block structure
- Test case naming conventions
- Helper functions or fixtures
```

### Subagent 3: Extract Scenarios 6-10 from class1.md
```
Read src/testScenarios/class1.md and extract from Scenarios 6-10:
- Material Details (UN number, PSN, hazard class, packaging paragraph)
- Expected SDDG Keys (7, 11-17)
- Expected Labels
- Expected Markings
- POP Marking validation rules
- All Alterations (3 per scenario = 15 test cases)
```

### Subagent 4: Extract Scenarios 11-15 from class1.md
```
Read src/testScenarios/class1.md and extract from Scenarios 11-15:
- Material Details
- Expected SDDG Keys
- Expected Labels (note: Scenario 11 is 1.4S - passenger allowed)
- Expected Markings
- POP Marking validation
- All Alterations
```

### Subagent 5: Extract Scenarios 16-20 from class1.md
```
Read src/testScenarios/class1.md and extract from Scenarios 16-20:
- Material Details
- Expected SDDG Keys
- Expected Labels
- Expected Markings (note: Scenario 17 has RQ, Scenario 18/20 have N.O.S. with technical names)
- POP Marking validation
- All Alterations
```

---

## Phase 2: Scenario Summary for Test Cases

After research, you should have these scenarios to add:

### Scenario 6: UN0328 - CARTRIDGES FOR WEAPONS, INERT PROJECTILE
- Division: 1.2C
- Alterations: PSN abbreviated, POP missing, UN number similar (UN0329)

### Scenario 7: UN0247 - AMMUNITION, INCENDIARY
- Division: 1.3J
- Special: Orientation labels required, CAO required (P3)
- Alterations: Missing orientation label, wrong aircraft limitation, missing CAO label

### Scenario 8: UN0049 - CARTRIDGES, FLASH
- Division: 1.3G
- Alterations: Wrong division on label (1.1G vs 1.3G), metric missing in Key 16, EX number missing

### Scenario 9: UN0106 - FUZES, DETONATING
- Division: 1.4B
- Special: P1 requires CAO
- Alterations: Division "1.4" without "B", CAO label missing, Key 17 wrong

### Scenario 10: UN0323 - CARTRIDGES, POWER DEVICE
- Division: 1.4C
- Alterations: Compatibility group wrong, PSN abbreviated, packaging code unauthorized

### Scenario 11: UN0012 - CARTRIDGES FOR WEAPONS, SMALL ARMS (1.4S)
- Division: 1.4S
- Special: **P5 - Passenger aircraft allowed** (only 1.4S scenario)
- Alterations: Key 7 shows CAO (should be PAX), wrong compatibility group, label shows 1.4 without S

### Scenario 12: UN0331 - EXPLOSIVE, BLASTING, TYPE B
- Division: 1.5D
- Alterations: Division shows "1.1D", POP code Z, PSN incomplete

### Scenario 13: UN0486 - ARTICLES, EXPLOSIVE, EEI
- Division: 1.6N
- Alterations: Missing compatibility group N, PSN abbreviated, wrong Key 17

### Scenario 14: UN0222 - AMMONIUM NITRATE (with Subsidiary Risk)
- Division: 1.1D
- Special: **Subsidiary hazard 5.1 (Oxidizer)** - Key 14 populated
- Alterations: Missing subsidiary label, Key 14 empty, wrong subsidiary class

### Scenario 15: UN0019 - AMMUNITION, TEAR-PRODUCING (with Subsidiary Risk)
- Division: 1.4G
- Special: **Subsidiary hazard 6.1 (Toxic)** - Key 14 populated
- Alterations: Missing toxic label, Key 14 shows 6.2, label positioning

### Scenario 16: UN0124 - JET PERFORATING GUNS, CHARGED
- Division: 1.1D
- Alterations: PSN missing "without detonator", Key 16 missing NEW, PSN abbreviated

### Scenario 17: UN0135 - MERCURY FULMINATE, WETTED (RQ Material)
- Division: 1.1A
- Special: **RQ (Reportable Quantity)** - Key 11 has "RQ" prefix
- Alterations: Missing RQ prefix in Key 11, missing RQ marking, wetted percentage missing

### Scenario 18: UN0473 - SUBSTANCES, EXPLOSIVE, N.O.S. (Technical Name Required)
- Division: 1.1A
- Special: **N.O.S. requires technical name** in Key 12 and markings
- Alterations: Missing technical name in Key 12, wrong format, mismatch between marking and SDDG

### Scenario 19: UN0059 - CHARGES, SHAPED (Multiple Package Configuration)
- Division: 1.1D
- Special: **Multiple packages** - Key 16 shows "3 wooden boxes"
- Alterations: Missing packaging code descriptor, only 2 of 3 packages labeled, NEW in pounds only

### Scenario 20: UN0354 - ARTICLES, EXPLOSIVE, N.O.S. (N.O.S. with IBD)
- Division: 1.4D
- Special: **IBD (Inhabited Building Distance)** in Key 13, **N.O.S. with technical name**
- Alterations: Missing IBD info, N.O.S. without technical name, technical name mismatch

---

## Phase 3: Add Tests to Existing Files

Use the `superpowers:test-driven-development` skill before writing.

### Pattern to Follow

Read the existing tests and match their style. Add new describe blocks:

```typescript
// In labelingRequirementsInspector.test.ts
// ADD after existing Scenarios 1-5 describe blocks:

describe('Scenario 6: UN0328 - CARTRIDGES FOR WEAPONS, INERT PROJECTILE', () => {
  const materialData = {
    unNumber: 'UN0328',
    hazardClass: '1.2C',
    packagingParagraph: 'A5.5',
  };

  it('should require EXPLOSIVE 1.2 label with compatibility group C', () => {
    // ... test implementation matching existing pattern
  });
});

describe('Scenario 7: UN0247 - AMMUNITION, INCENDIARY', () => {
  // ... includes orientation label tests
});

// ... continue for scenarios 8-20
```

### Special Test Cases to Include

**Scenario 11 (1.4S):**
```typescript
it('should allow passenger aircraft for 1.4S (P5)', () => {
  // Key 7 should NOT require "Cargo Aircraft Only"
});
```

**Scenarios 14-15 (Subsidiary Hazards):**
```typescript
it('should require subsidiary OXIDIZER 5.1 label', () => {
  // Key 14 = "5.1"
});

it('should fail when subsidiary label missing', () => {
  // Alteration test
});
```

**Scenario 17 (RQ):**
```typescript
it('should require RQ prefix in Key 11 when quantity exceeds threshold', () => {
  // Key 11 = "RQ, UN0135"
});
```

**Scenarios 18, 20 (N.O.S.):**
```typescript
it('should require technical name in Key 12 for N.O.S. entries', () => {
  // Key 12 = "SUBSTANCES, EXPLOSIVE, N.O.S. (Lead Styphnate)"
});
```

**Scenario 20 (IBD):**
```typescript
it('should include DOD IBD in Key 13 when applicable', () => {
  // Key 13 = "1.4D" with "DOD IBD 60 ft" on separate line
});
```

---

## Phase 4: Verify Tests

Use `superpowers:verification-before-completion` skill.

1. **Run all tests:**
   ```bash
   npm test -- --testPathPattern="class1|labelingRequirements|markingRequirements|packagingLookup|sddgValidation"
   ```

2. **Verify coverage:**
   - All 15 scenarios (6-20) have positive tests
   - All 45 alterations (3 per scenario) have negative tests
   - Special cases covered: 1.4S, subsidiary hazards, RQ, N.O.S., IBD

3. **Check for regressions:**
   - Existing tests for scenarios 1-5 still pass
   - No duplicate test names

---

## Deliverables

1. **Updated test files** with scenarios 6-20 added
2. **Test count summary:**
   - Scenarios 1-5: (existing count)
   - Scenarios 6-20: (new count)
   - Total: X tests
3. **Special case coverage confirmation:**
   - [ ] 1.4S passenger aircraft (Scenario 11)
   - [ ] Subsidiary hazards (Scenarios 14-15)
   - [ ] RQ materials (Scenario 17)
   - [ ] N.O.S. with technical names (Scenarios 18, 20)
   - [ ] IBD documentation (Scenario 20)
   - [ ] Multiple package configuration (Scenario 19)
   - [ ] Orientation labels (Scenario 7)

---

## Skills to Invoke

| When | Skill |
|------|-------|
| Start of task | `superpowers:using-superpowers` |
| Before planning tests | `superpowers:writing-plans` |
| Before writing code | `superpowers:test-driven-development` |
| If tests fail unexpectedly | `superpowers:systematic-debugging` |
| Before claiming done | `superpowers:verification-before-completion` |

---

## Important Notes

1. **READ THE REFERENCE DOCUMENT FIRST** - `docs/plans/2026-01-13-class1-unit-tests.md` has critical context
2. **MATCH EXISTING PATTERNS** - consistency with scenarios 1-5 tests is essential
3. **ADD, DON'T REPLACE** - you're extending existing files, not rewriting them
4. **45 NEW NEGATIVE TESTS** - each of the 15 scenarios has 3 alterations
5. **SPECIAL CASES MATTER** - scenarios 11, 14-15, 17, 18, 20 test unique validation paths
6. **RUN FULL TEST SUITE** - ensure you don't break existing tests
