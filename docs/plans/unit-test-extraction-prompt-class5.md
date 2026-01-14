# Prompt: Write Unit Tests for Class 5 (Oxidizers & Organic Peroxides) Test Scenarios

Use this prompt with a new Claude Code instance to generate Jest unit tests for Class 5 materials.

---

## Task Overview

This is a mobile app for hazardous material inspection built on **AFMAN 24-604**. You will write unit tests for Class 5 (Oxidizers and Organic Peroxides) based on the test scenarios in `src/testScenarios/class5.md`.

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

| New Class 5 Test File | Based On |
|-----------------------|----------|
| `src/components/Inspector/utils/__tests__/sddgValidation.class5.test.ts` | sddgValidation.class1.test.ts |
| `src/utils/__tests__/labelingRequirementsInspector.class5.test.ts` | labelingRequirementsInspector.class1.test.ts |
| `src/utils/__tests__/markingRequirements.class5.test.ts` | markingRequirements.class1.test.ts |
| `server/lookupFunctions/__tests__/packagingLookupV2.class5.test.ts` | packagingLookupV2.class1.test.ts |

---

## Class 5 Overview

Class 5 has **two divisions**:

| Division | Name | Hazard | Example |
|----------|------|--------|---------|
| 5.1 | Oxidizers | Yields oxygen, causes/enhances combustion | UN1942 Ammonium Nitrate |
| 5.2 | Organic Peroxides | Thermally unstable, may decompose explosively | UN3101 Organic Peroxide Type B |

**Key characteristics:**

### Division 5.1 - Oxidizers
- Has packing groups (I, II, III) - Key 15 populated
- Packaging uses A9.xx paragraphs
- Yellow label with flame-over-circle symbol
- POP marking codes: X (PG I), Y (PG II), Z (PG III)

### Division 5.2 - Organic Peroxides
- **NO packing groups** - Key 15 is EMPTY
- Uses Type designations (A through G) instead
- Packaging uses A9.xx paragraphs (different sections than 5.1)
- Red/yellow split label
- **Temperature control may be required** (Control and Emergency temperatures)
- Some types are FORBIDDEN (Type A)
- POP marking: typically Y (no PG assigned, but rated for PG II equivalent)

**Key differences from Class 1:**
- Division 5.1 HAS packing groups; Division 5.2 does NOT
- Packaging uses A9.xx paragraphs (not A5.xx)
- No EX number required
- No compatibility groups
- Organic peroxides have Type designations (A-G) that affect restrictions
- Temperature-controlled shipments may require special documentation

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

### Subagent 5: Read Class 5 Test Scenarios
```
Read src/testScenarios/class5.md completely

Extract for ALL scenarios (likely 20):
- Material Details (UN number, PSN, division, packing group OR peroxide type, packaging paragraph)
- Expected SDDG Keys (7, 11-17)
- Expected Labels (5.1 OXIDIZER or 5.2 ORGANIC PEROXIDE)
- Expected Markings
- POP Marking validation
- All Alterations (test cases for failures)

Note Class 5 specific requirements:
- Division 5.1 vs 5.2 differences
- Organic peroxide Type designations
- Temperature control requirements
- Subsidiary hazards (some oxidizers have them)
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
// sddgValidation.class5.test.ts
import { validateSDDGKeys } from '../sddgValidation'; // or actual function name from Class 1 tests

describe('Class 5 (Oxidizers & Organic Peroxides) SDDG Validation', () => {

  describe('Division 5.1 - Oxidizers', () => {
    describe('Scenario X: UN1942 - AMMONIUM NITRATE', () => {
      const materialData = {
        unNumber: 'UN1942',
        hazardClass: '5.1',
        packingGroup: 'III',  // Division 5.1 HAS packing groups
        packagingParagraph: 'A9.x',
      };

      // Positive tests
      it('should validate Key 13 as "5.1"', () => {
        // ...
      });

      it('should require Key 15 to be "III"', () => {
        // ... Division 5.1 requires packing group
      });

      // Negative tests (from alterations)
      it('should reject Key 15 empty for Division 5.1 material', () => {
        // ...
      });
    });
  });

  describe('Division 5.2 - Organic Peroxides', () => {
    describe('Scenario Y: UN3101 - ORGANIC PEROXIDE TYPE B, LIQUID', () => {
      const materialData = {
        unNumber: 'UN3101',
        hazardClass: '5.2',
        packingGroup: null,  // Division 5.2 has NO packing group
        peroxideType: 'B',   // Uses Type instead
        packagingParagraph: 'A9.x',
      };

      // Positive tests
      it('should validate Key 13 as "5.2"', () => {
        // ...
      });

      it('should accept empty Key 15 for Division 5.2', () => {
        // ... Division 5.2 does NOT have packing group
      });

      // Negative tests
      it('should reject Key 15 populated for Division 5.2', () => {
        // Division 5.2 should NOT have packing group
      });
    });
  });
});
```

### Key Adaptations for Class 5

| Aspect | Class 1 | Division 5.1 | Division 5.2 |
|--------|---------|--------------|--------------|
| Key 13 | "1.1A" (with compat) | "5.1" | "5.2" |
| Key 15 | Empty | **Required** (I, II, III) | **Empty** |
| Key 17 | A5.xx | **A9.xx** | **A9.xx** |
| EX Number | Required | Not required | Not required |
| POP Code | X or Y only | X, Y, or Z | Y (typically) |
| Labels | EXPLOSIVE + compat | OXIDIZER 5.1 | ORGANIC PEROXIDE 5.2 |
| Special | Compat groups | Subsidiary hazards | **Type A-G, temp control** |

### Division-Specific Test Cases

**Division 5.1 (Oxidizers):**
```typescript
// Packing group validation
it('should require packing group for Division 5.1', () => { });
it('should validate POP code matches packing group', () => { });

// Label validation
it('should require OXIDIZER 5.1 label (yellow, flame over circle)', () => { });

// Subsidiary hazards (some oxidizers have them)
it('should require subsidiary label when Key 14 populated', () => { });
```

**Division 5.2 (Organic Peroxides):**
```typescript
// NO packing group
it('should accept empty Key 15 for organic peroxides', () => { });
it('should REJECT populated Key 15 for organic peroxides', () => { });

// Type validation
it('should include peroxide Type in PSN (e.g., TYPE B)', () => { });
it('should reject Type A as FORBIDDEN', () => { });

// Temperature control (if applicable)
it('should require control temperature in documentation when applicable', () => { });
it('should require emergency temperature when applicable', () => { });

// Label validation
it('should require ORGANIC PEROXIDE 5.2 label (red/yellow split)', () => { });
```

### Alteration Test Cases

Common Class 5 alterations to test:

```typescript
// Division validation
it('should reject division 5.3 (invalid)', () => { });
it('should reject division mismatch between SDDG and label', () => { });

// Packing group validation (5.1 only)
it('should reject empty Key 15 for Division 5.1', () => { });
it('should reject POP code Z for PG II oxidizer', () => { });

// Organic peroxide specific
it('should reject packing group for Division 5.2', () => { });
it('should reject missing Type designation in PSN', () => { });
it('should reject Type A organic peroxide as FORBIDDEN', () => { });

// Packaging instruction validation
it('should reject A5.xx packaging (wrong class)', () => { });
it('should validate A9.xx packaging codes', () => { });

// Label validation
it('should reject FLAMMABLE label instead of OXIDIZER for 5.1', () => { });
it('should reject wrong label color/design for 5.2', () => { });
```

---

## Phase 3: Run and Verify Tests

After writing all tests:

```bash
# Run Class 5 tests only
npm test -- --testPathPattern="class5"

# Run all validation tests to ensure no regressions
npm test -- --testPathPattern="sddgValidation|labelingRequirements|markingRequirements|packagingLookup"
```

### Success Criteria

- [ ] All Class 5 tests pass
- [ ] No regressions in Class 1 tests
- [ ] Coverage includes both divisions (5.1, 5.2)
- [ ] All scenarios from class5.md have tests
- [ ] All alterations converted to negative test cases
- [ ] Division 5.1 packing group validation tested
- [ ] Division 5.2 NO packing group validation tested
- [ ] Organic peroxide Type designations tested

---

## Phase 4: Document Results

Create a brief summary (no formal code review needed):

```markdown
## Class 5 Unit Test Summary

### Test Files Created
- sddgValidation.class5.test.ts: X tests
- labelingRequirementsInspector.class5.test.ts: X tests
- markingRequirements.class5.test.ts: X tests
- packagingLookupV2.class5.test.ts: X tests

### Coverage
- Scenarios covered: X of 20
- Division 5.1 (Oxidizers): X scenarios
- Division 5.2 (Organic Peroxides): X scenarios

### Division-Specific Tests
- Division 5.1 packing group validation: PASS/FAIL
- Division 5.2 no packing group validation: PASS/FAIL
- Organic peroxide Type validation: PASS/FAIL

### All tests passing: YES/NO
```

---

## Important Reminders

1. **SKIP CODE REVIEW** - Passing tests are sufficient validation
2. **COPY CLASS 1 PATTERNS EXACTLY** - Same imports, same structure, same assertion style
3. **DIVISION 5.1 HAS PACKING GROUPS** - Key 15 required
4. **DIVISION 5.2 HAS NO PACKING GROUPS** - Key 15 must be empty, uses Type instead
5. **A9.xx PACKAGING** - Not A5.xx
6. **NO EX NUMBERS** - Don't test for EX number requirements
7. **TWO DIVISIONS** - 5.1 and 5.2 (different rules for each)
8. **ORGANIC PEROXIDE TYPES** - A through G, Type A is FORBIDDEN
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
4. Write `sddgValidation.class5.test.ts`
5. Run tests, fix failures
6. Write `labelingRequirementsInspector.class5.test.ts`
7. Run tests, fix failures
8. Write `markingRequirements.class5.test.ts`
9. Run tests, fix failures
10. Write `packagingLookupV2.class5.test.ts`
11. Run tests, fix failures
12. Run full test suite
13. Invoke `superpowers:verification-before-completion`
14. Document results

**Passing tests = Done. No code review needed.**
