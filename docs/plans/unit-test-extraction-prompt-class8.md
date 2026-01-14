# Prompt: Write Unit Tests for Class 8 (Corrosives) Test Scenarios

Use this prompt with a new Claude Code instance to generate Jest unit tests for Class 8 materials.

---

## Task Overview

This is a mobile app for hazardous material inspection built on **AFMAN 24-604**. You will write unit tests for Class 8 (Corrosives) based on the test scenarios in `src/testScenarios/class8.md`.

**Follow the exact patterns** established in the Class 1 implementation.

**SKIP CODE REVIEW** - Passing tests are all the validation needed. Do not invoke the code-reviewer skill or request reviews. Just write tests, run them, fix any failures, and confirm they pass.

---

## Reference Implementation

The Class 1 tests establish the patterns you must follow. Study these files:

| Class 1 Test File | Purpose |
|-------------------|---------|
| `src/components/Inspector/utils/__tests__/sddgValidation.class1.test.ts` | SDDG key validation tests |
| `src/utils/__tests__/labelingRequirementsInspector.class1.test.ts` | Label requirement tests |
| `src/utils/__tests__/markingRequirements.class1.test.ts` | Marking requirement tests |
| `server/lookupFunctions/__tests__/packagingLookupV2.class1.test.ts` | Packaging code validation tests |

**Reference document:** `docs/plans/2026-01-13-class1-unit-tests.md`

---

## Your Deliverables

Create these new test files following the Class 1 naming convention:

| New Class 8 Test File | Based On |
|-----------------------|----------|
| `src/components/Inspector/utils/__tests__/sddgValidation.class8.test.ts` | sddgValidation.class1.test.ts |
| `src/utils/__tests__/labelingRequirementsInspector.class8.test.ts` | labelingRequirementsInspector.class1.test.ts |
| `src/utils/__tests__/markingRequirements.class8.test.ts` | markingRequirements.class1.test.ts |
| `server/lookupFunctions/__tests__/packagingLookupV2.class8.test.ts` | packagingLookupV2.class1.test.ts |

---

## Class 8 Overview

**CRITICAL: Class 8 has NO DIVISIONS** (like Class 3 and Class 9).

| Class | Name | Hazard | Label |
|-------|------|--------|-------|
| 8 | Corrosives | Destroys living tissue, corrodes metals | White top / Black bottom with test tubes over hand/metal |

**Key characteristics:**

- **NO divisions** - Key 13 is simply "8" (NOT "8.1" or "8.2")
- **ALWAYS has packing groups** (I, II, or III) - Key 15 is REQUIRED
- Packaging uses **A12.xx** paragraphs
- No EX number required
- No compatibility groups
- POP marking codes: X (PG I), Y (PG II), Z (PG III)
- Single CORROSIVE label design (white/black split)
- Many corrosives have **subsidiary hazards** (toxic, flammable, oxidizer)

**Key differences from Class 1:**

| Aspect | Class 1 | Class 8 |
|--------|---------|---------|
| Divisions | 1.1 - 1.6 | **NONE** |
| Key 13 | "1.1A" (with compat) | **"8" only** |
| Key 15 | Empty | **REQUIRED** (I, II, III) |
| Key 17 | A5.xx | **A12.xx** |
| EX Number | Required | Not required |
| Compat Groups | A-S | None |
| POP Code | X or Y only | **X, Y, or Z** |
| Subsidiary | Rare | **Common** |

---

## Phase 1: Research (Use Subagents in Parallel)

Launch **6 parallel subagents**:

### Subagent 1: Study Class 1 SDDG Validation Tests
```
Read src/components/Inspector/utils/__tests__/sddgValidation.class1.test.ts

Extract:
- Import statements
- Mock patterns
- Describe block structure
- How materialData objects are constructed
- Positive vs negative test patterns
- Helper functions or fixtures
```

### Subagent 2: Study Class 1 Labeling Tests
```
Read src/utils/__tests__/labelingRequirementsInspector.class1.test.ts

Extract:
- Function being tested and its signature
- How label assertions are structured
- Pattern for testing required vs optional labels
- How subsidiary hazard labels are tested
```

### Subagent 3: Study Class 1 Marking Tests
```
Read src/utils/__tests__/markingRequirements.class1.test.ts

Extract:
- Function being tested and its signature
- How marking requirements are asserted
- Pattern for testing missing markings
```

### Subagent 4: Study Class 1 Packaging Tests
```
Read server/lookupFunctions/__tests__/packagingLookupV2.class1.test.ts

Extract:
- Function being tested and its signature
- How packaging codes are validated
- How packing group codes are tested
- Pattern for authorized vs unauthorized codes
```

### Subagent 5: Read Class 8 Test Scenarios
```
Read src/testScenarios/class8.md completely

Extract for ALL scenarios (likely 20):
- Material Details (UN number, PSN, packing group, packaging paragraph)
- Expected SDDG Keys (7, 11-17)
- Expected Labels (CORROSIVE 8 + any subsidiary labels)
- Expected Markings
- POP Marking validation (X, Y, or Z based on packing group)
- All Alterations (test cases for failures)

Note Class 8 specific requirements:
- NO divisions (Key 13 = "8" only)
- Packing group always required
- Subsidiary hazards (toxic 6.1, flammable 3, oxidizer 5.1)
- Corrosive to metals vs corrosive to skin distinction
```

### Subagent 6: Read Reference Document
```
Read docs/plans/2026-01-13-class1-unit-tests.md

Extract:
- Overall test strategy
- Gap analysis findings
- Any patterns or conventions documented
- Issues encountered and solutions
```

---

## Phase 2: Write Tests

**DO NOT use superpowers:code-reviewer or superpowers:requesting-code-review.**

Use these skills only:
- `superpowers:using-superpowers` - at start
- `superpowers:test-driven-development` - before writing tests
- `superpowers:systematic-debugging` - if tests fail
- `superpowers:verification-before-completion` - to confirm tests pass

### Test Structure

Follow this pattern (adapted from Class 1):

```typescript
// sddgValidation.class8.test.ts
import { validateSDDGKeys } from '../sddgValidation'; // or actual function name from Class 1 tests

describe('Class 8 (Corrosives) SDDG Validation', () => {

  describe('Packing Group I - Severe Corrosives', () => {
    describe('Scenario X: UN1789 - HYDROCHLORIC ACID', () => {
      const materialData = {
        unNumber: 'UN1789',
        hazardClass: '8',  // NO division - just "8"
        packingGroup: 'I',
        packagingParagraph: 'A12.x',
      };

      // Positive tests
      it('should validate Key 13 as "8" (no division)', () => {
        const result = validateKey13('8', materialData);
        expect(result.valid).toBe(true);
      });

      it('should REJECT Key 13 with division like "8.1"', () => {
        const result = validateKey13('8.1', materialData);
        expect(result.valid).toBe(false);
        expect(result.error).toMatch(/no division|invalid/i);
      });

      it('should require Key 15 packing group "I"', () => {
        // ...
      });
    });
  });

  describe('Packing Group II - Moderate Corrosives', () => {
    // ...
  });

  describe('Packing Group III - Minor Corrosives', () => {
    // ...
  });

  describe('Corrosives with Subsidiary Hazards', () => {
    describe('Scenario Y: UN2922 - CORROSIVE LIQUID, TOXIC, N.O.S.', () => {
      const materialData = {
        unNumber: 'UN2922',
        hazardClass: '8',
        subsidiaryHazard: '6.1',  // Toxic subsidiary
        packingGroup: 'II',
        packagingParagraph: 'A12.x',
      };

      it('should require Key 14 to show "6.1"', () => {
        // ...
      });

      it('should require TOXIC 6.1 subsidiary label', () => {
        // ...
      });
    });
  });
});
```

### Key Adaptations for Class 8

| Aspect | Class 1 | Class 8 |
|--------|---------|---------|
| Key 13 | "1.1A" (division + compat) | **"8" ONLY** (no division) |
| Key 15 | Empty | **REQUIRED** (I, II, or III) |
| Key 17 | A5.xx | **A12.xx** |
| EX Number | Required | Not required |
| POP Code | X or Y | **X, Y, or Z** |
| Subsidiary | Rare | **Common** (6.1, 3, 5.1) |

### Critical Test: No Division Validation

**This is the most important Class 8 test:**

```typescript
describe('Class 8 Division Validation', () => {
  it('should accept Key 13 as "8" (correct)', () => {
    expect(validateKey13('8')).toEqual({ valid: true });
  });

  it('should REJECT Key 13 as "8.1" (invalid - no divisions)', () => {
    expect(validateKey13('8.1')).toEqual({
      valid: false,
      error: expect.stringMatching(/division|invalid/i)
    });
  });

  it('should REJECT Key 13 as "8.2" (invalid - no divisions)', () => {
    expect(validateKey13('8.2')).toEqual({
      valid: false,
      error: expect.stringMatching(/division|invalid/i)
    });
  });
});
```

### Packing Group Test Cases

```typescript
describe('Class 8 Packing Group Validation', () => {
  // Key 15 is REQUIRED for Class 8
  it('should REJECT empty Key 15 for Class 8', () => {
    const result = validateKey15('', { hazardClass: '8' });
    expect(result.valid).toBe(false);
  });

  it('should accept Key 15 = "I" for PG I corrosive', () => {
    const result = validateKey15('I', { hazardClass: '8', expectedPG: 'I' });
    expect(result.valid).toBe(true);
  });

  // POP code must match packing group
  it('should require POP code X for PG I', () => { });
  it('should require POP code Y for PG II', () => { });
  it('should require POP code Z for PG III', () => { });
  it('should REJECT POP code Z for PG II material', () => { });
  it('should REJECT POP code Y for PG I material', () => { });
});
```

### Subsidiary Hazard Test Cases

Class 8 commonly has subsidiary hazards:

```typescript
describe('Class 8 Subsidiary Hazards', () => {
  describe('Corrosive + Toxic (6.1)', () => {
    it('should require Key 14 = "6.1" for toxic corrosives', () => { });
    it('should require TOXIC 6.1 subsidiary label', () => { });
    it('should fail when subsidiary label missing', () => { });
  });

  describe('Corrosive + Flammable (3)', () => {
    it('should require Key 14 = "3" for flammable corrosives', () => { });
    it('should require FLAMMABLE LIQUID 3 subsidiary label', () => { });
  });

  describe('Corrosive + Oxidizer (5.1)', () => {
    it('should require Key 14 = "5.1" for oxidizing corrosives', () => { });
    it('should require OXIDIZER 5.1 subsidiary label', () => { });
  });
});
```

### Alteration Test Cases

Common Class 8 alterations to test:

```typescript
// Division validation (Class 8 has NONE)
it('should reject Key 13 = "8.1" (no divisions exist)', () => { });
it('should reject Key 13 = "8.2" (no divisions exist)', () => { });

// Packing group validation (REQUIRED for Class 8)
it('should reject empty Key 15 for Class 8', () => { });
it('should reject wrong packing group', () => { });
it('should reject POP code mismatch with packing group', () => { });

// Subsidiary hazard validation
it('should reject missing subsidiary label when Key 14 populated', () => { });
it('should reject wrong subsidiary class', () => { });
it('should reject empty Key 14 when subsidiary hazard exists', () => { });

// Packaging instruction validation
it('should reject A5.xx packaging (wrong class)', () => { });
it('should validate A12.xx packaging codes', () => { });

// Label validation
it('should require CORROSIVE label', () => { });
it('should reject wrong label (e.g., OXIDIZER instead of CORROSIVE)', () => { });

// N.O.S. technical name (for entries like UN2922)
it('should require technical name for N.O.S. entries', () => { });
```

---

## Phase 3: Run and Verify Tests

After writing all tests:

```bash
# Run Class 8 tests only
npm test -- --testPathPattern="class8"

# Run all validation tests to ensure no regressions
npm test -- --testPathPattern="sddgValidation|labelingRequirements|markingRequirements|packagingLookup"
```

### Success Criteria

- [ ] All Class 8 tests pass
- [ ] No regressions in other class tests
- [ ] **NO DIVISION validation tested** (Key 13 = "8" only)
- [ ] All 3 packing groups covered (I, II, III)
- [ ] POP code validation tested for each PG
- [ ] Subsidiary hazard scenarios tested (6.1, 3, 5.1)
- [ ] All scenarios from class8.md have tests
- [ ] All alterations converted to negative test cases

---

## Phase 4: Document Results

Create a brief summary (no formal code review needed):

```markdown
## Class 8 Unit Test Summary

### Test Files Created
- sddgValidation.class8.test.ts: X tests
- labelingRequirementsInspector.class8.test.ts: X tests
- markingRequirements.class8.test.ts: X tests
- packagingLookupV2.class8.test.ts: X tests

### Coverage
- Scenarios covered: X of 20
- Packing Group I: X scenarios
- Packing Group II: X scenarios
- Packing Group III: X scenarios
- With subsidiary hazards: X scenarios

### Critical Tests
- No division validation (Key 13 = "8" only): PASS/FAIL
- Packing group required validation: PASS/FAIL
- POP code/PG match validation: PASS/FAIL
- Subsidiary hazard label validation: PASS/FAIL

### All tests passing: YES/NO
```

---

## Important Reminders

1. **SKIP CODE REVIEW** - Passing tests are sufficient validation
2. **COPY CLASS 1 PATTERNS EXACTLY** - Same imports, same structure, same assertion style
3. **CLASS 8 HAS NO DIVISIONS** - Key 13 must be "8" only, reject "8.1", "8.2", etc.
4. **PACKING GROUP ALWAYS REQUIRED** - Key 15 must be populated (I, II, or III)
5. **A12.xx PACKAGING** - Not A5.xx
6. **NO EX NUMBERS** - Don't test for EX number requirements
7. **SUBSIDIARY HAZARDS ARE COMMON** - Test Key 14 and subsidiary labels
8. **POP CODE MUST MATCH PG** - X=I, Y=II, Z=III
9. **RUN TESTS FREQUENTLY** - Verify as you go, don't wait until the end

---

## Skills Checklist

| Skill | Use When |
|-------|----------|
| `superpowers:using-superpowers` | Start of task |
| `superpowers:test-driven-development` | Before writing any test code |
| `superpowers:systematic-debugging` | When tests fail unexpectedly |
| `superpowers:verification-before-completion` | Final verification that all tests pass |
| ~~`superpowers:code-reviewer`~~ | **DO NOT USE** |
| ~~`superpowers:requesting-code-review`~~ | **DO NOT USE** |

---

## Execution Order

1. Launch 6 subagents in parallel for research
2. Wait for all research to complete
3. Invoke `superpowers:test-driven-development`
4. Write `sddgValidation.class8.test.ts`
5. Run tests, fix failures
6. Write `labelingRequirementsInspector.class8.test.ts`
7. Run tests, fix failures
8. Write `markingRequirements.class8.test.ts`
9. Run tests, fix failures
10. Write `packagingLookupV2.class8.test.ts`
11. Run tests, fix failures
12. Run full test suite
13. Invoke `superpowers:verification-before-completion`
14. Document results

**Passing tests = Done. No code review needed.**
