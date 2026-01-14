# Prompt: Write Unit Tests for Class 4 (Flammable Solids) Test Scenarios

Use this prompt with a new Claude Code instance to generate Jest unit tests for Class 4 materials.

---

## Task Overview

This is a mobile app for hazardous material inspection built on **AFMAN 24-604**. You will write unit tests for Class 4 (Flammable Solids) based on the test scenarios in `src/testScenarios/class4.md`.

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

| New Class 4 Test File | Based On |
|-----------------------|----------|
| `src/components/Inspector/utils/__tests__/sddgValidation.class4.test.ts` | sddgValidation.class1.test.ts |
| `src/utils/__tests__/labelingRequirementsInspector.class4.test.ts` | labelingRequirementsInspector.class1.test.ts |
| `src/utils/__tests__/markingRequirements.class4.test.ts` | markingRequirements.class1.test.ts |
| `server/lookupFunctions/__tests__/packagingLookupV2.class4.test.ts` | packagingLookupV2.class1.test.ts |

---

## Class 4 Overview

Class 4 has **three divisions** (unlike Class 1's six):

| Division | Name | Hazard | Example |
|----------|------|--------|---------|
| 4.1 | Flammable Solids | Readily combustible, friction-sensitive | UN1325 Flammable Solid, Organic |
| 4.2 | Spontaneously Combustible | Pyrophoric, self-heating | UN2845 Pyrophoric Liquid, Organic |
| 4.3 | Dangerous When Wet | Emits flammable gas with water | UN1428 Sodium |

**Key differences from Class 1:**
- Class 4 HAS packing groups (I, II, III) - Key 15 is populated
- Packaging uses A8.xx paragraphs (not A5.xx)
- No EX number required
- No compatibility groups
- POP marking codes: X (PG I), Y (PG II), Z (PG III)

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
- EX number tests (note: Class 4 won't have these)
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

### Subagent 5: Read Class 4 Test Scenarios
```
Read src/testScenarios/class4.md completely

Extract for ALL scenarios (likely 20):
- Material Details (UN number, PSN, division, packing group, packaging paragraph)
- Expected SDDG Keys (7, 11-17)
- Expected Labels (4.1, 4.2, or 4.3 labels)
- Expected Markings
- POP Marking validation (X, Y, or Z based on packing group)
- All Alterations (test cases for failures)

Note any Class 4 specific requirements:
- Subsidiary hazards
- Special markings
- Division-specific rules
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
// sddgValidation.class4.test.ts
import { validateSDDGKeys } from '../sddgValidation'; // or actual function name from Class 1 tests

describe('Class 4 (Flammable Solids) SDDG Validation', () => {

  describe('Division 4.1 - Flammable Solids', () => {
    describe('Scenario X: UN1325 - FLAMMABLE SOLID, ORGANIC, N.O.S.', () => {
      const materialData = {
        unNumber: 'UN1325',
        hazardClass: '4.1',
        packingGroup: 'II',  // Class 4 HAS packing groups
        packagingParagraph: 'A8.x',
      };

      // Positive tests
      it('should validate Key 13 as "4.1"', () => {
        // ...
      });

      it('should require Key 15 to be "II"', () => {
        // ... Class 4 requires packing group
      });

      // Negative tests (from alterations)
      it('should reject Key 15 empty for Class 4 material', () => {
        // ...
      });
    });
  });

  describe('Division 4.2 - Spontaneously Combustible', () => {
    // ...
  });

  describe('Division 4.3 - Dangerous When Wet', () => {
    // ...
  });
});
```

### Key Adaptations for Class 4

| Aspect | Class 1 | Class 4 |
|--------|---------|---------|
| Key 13 | "1.1A" (with compat group) | "4.1", "4.2", "4.3" (no compat group) |
| Key 15 | Empty | **Required** (I, II, or III) |
| Key 17 | A5.xx | **A8.xx** |
| EX Number | Required | **Not required** |
| POP Code | X or Y only | X, Y, or Z (based on PG) |
| Labels | EXPLOSIVE 1.x + compat group | FLAMMABLE SOLID 4.1, etc. |

### Alteration Test Cases

Each scenario has ~3 alterations. Common Class 4 alterations to test:

```typescript
// Division validation
it('should reject division 4.4 (invalid)', () => { });
it('should reject division mismatch between SDDG and label', () => { });

// Packing group validation (Class 4 specific)
it('should reject empty Key 15 for Class 4', () => { });
it('should reject PG I for material that only allows II/III', () => { });
it('should reject POP code Z for PG II material', () => { });
it('should reject POP code Y for PG I material', () => { });

// Packaging instruction validation
it('should reject A5.xx packaging (wrong class)', () => { });
it('should validate A8.xx packaging codes', () => { });

// Label validation
it('should require FLAMMABLE SOLID label for 4.1', () => { });
it('should require SPONTANEOUSLY COMBUSTIBLE label for 4.2', () => { });
it('should require DANGEROUS WHEN WET label for 4.3', () => { });
```

---

## Phase 3: Run and Verify Tests

After writing all tests:

```bash
# Run Class 4 tests only
npm test -- --testPathPattern="class4"

# Run all validation tests to ensure no regressions
npm test -- --testPathPattern="sddgValidation|labelingRequirements|markingRequirements|packagingLookup"
```

### Success Criteria

- [ ] All Class 4 tests pass
- [ ] No regressions in Class 1 tests
- [ ] Coverage includes all 3 divisions (4.1, 4.2, 4.3)
- [ ] All scenarios from class4.md have tests
- [ ] All alterations converted to negative test cases
- [ ] Packing group validation tested (Class 4 specific)

---

## Phase 4: Document Results

Create a brief summary (no formal code review needed):

```markdown
## Class 4 Unit Test Summary

### Test Files Created
- sddgValidation.class4.test.ts: X tests
- labelingRequirementsInspector.class4.test.ts: X tests
- markingRequirements.class4.test.ts: X tests
- packagingLookupV2.class4.test.ts: X tests

### Coverage
- Scenarios covered: X of 20
- Division 4.1: X scenarios
- Division 4.2: X scenarios
- Division 4.3: X scenarios

### All tests passing: YES/NO
```

---

## Important Reminders

1. **SKIP CODE REVIEW** - Passing tests are sufficient validation
2. **COPY CLASS 1 PATTERNS EXACTLY** - Same imports, same structure, same assertion style
3. **CLASS 4 HAS PACKING GROUPS** - This is the biggest difference from Class 1
4. **A8.xx PACKAGING** - Not A5.xx
5. **NO EX NUMBERS** - Don't test for EX number requirements
6. **THREE DIVISIONS** - 4.1, 4.2, 4.3 (not six like Class 1)
7. **RUN TESTS FREQUENTLY** - Verify as you go, don't wait until the end

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
4. Write `sddgValidation.class4.test.ts`
5. Run tests, fix failures
6. Write `labelingRequirementsInspector.class4.test.ts`
7. Run tests, fix failures
8. Write `markingRequirements.class4.test.ts`
9. Run tests, fix failures
10. Write `packagingLookupV2.class4.test.ts`
11. Run tests, fix failures
12. Run full test suite
13. Invoke `superpowers:verification-before-completion`
14. Document results

**Passing tests = Done. No code review needed.**
