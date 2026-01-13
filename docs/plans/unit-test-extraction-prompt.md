# Prompt: Extract Validation Rules and Write Unit Tests for Class 1 Scenarios 1-5

Use this prompt with a new Claude Code instance to generate Jest unit tests based on manual test scenarios.

---

## Task Overview

This is a mobile app for hazardous material inspection built on **AFMAN 24-604**. The `src/testScenarios/class1.md` file contains manual test scenarios that describe expected app behavior for Class 1 (Explosives) materials.

Your task is to **extract the validation rules** from Scenarios 1-5 and **write Jest unit tests** for the underlying validation logic.

**IMPORTANT:** Use the superpowers skills and subagents throughout this task. Before writing any code, invoke the appropriate skills (brainstorming, test-driven-development, writing-plans).

---

## Target Files for Testing

You will write tests for these validation modules:

| File | Purpose |
|------|---------|
| `src/utils/labelingRequirementsInspector.tsx` | Determines required labels based on material data |
| `src/utils/markingRequirements.ts` | Determines required markings based on material data |
| `server/lookupFunctions/packagingLookupV2.ts` | Validates packaging codes against allowed lists |
| SDDG validation logic (locate in codebase) | Validates SDDG Key values |

---

## Phase 1: Research (Use Subagents)

Launch parallel subagents to research these files simultaneously:

### Subagent 1: Read Test Scenarios
```
Read src/testScenarios/class1.md and extract from Scenarios 1-5:
- Material Details (UN number, PSN, hazard class, packaging paragraph)
- Expected SDDG Keys (7, 11-17)
- Expected Labels
- Expected Markings
- POP Marking validation rules
- All Alterations (these become test cases for failure conditions)
```

### Subagent 2: Analyze labelingRequirementsInspector.tsx
```
Read src/utils/labelingRequirementsInspector.tsx and document:
- Function signatures and parameters
- How it determines required labels
- Class 1 specific logic (explosives, compatibility groups)
- Return type structure
- Any existing tests
```

### Subagent 3: Analyze markingRequirements.ts
```
Read src/utils/markingRequirements.ts and document:
- Function signatures and parameters
- How it determines required markings
- Class 1 specific logic (EX number, PSN format)
- Return type structure
- Any existing tests
```

### Subagent 4: Analyze packagingLookupV2.ts
```
Read server/lookupFunctions/packagingLookupV2.ts and document:
- Function signatures and parameters
- How it validates packaging codes
- How it maps packaging paragraphs (A5.xx) to allowed codes
- Packing group code validation (X, Y, Z)
- Any existing tests
```

### Subagent 5: Find SDDG Validation Logic
```
Search the codebase for SDDG key validation:
- grep for "key13", "key 13", "hazardClass" validation
- grep for "key15", "packing group" validation
- grep for "key17", "packaging instruction" validation
- Look in src/contexts/, src/utils/, src/components/Inspector/
- Document any validation functions found
```

---

## Phase 2: Extract Test Cases from Scenarios

After research completes, extract these test cases from Scenarios 1-5:

### Scenario 1: UN0224 - BARIUM AZIDE, DRY

**Positive Test Cases (Expected Behavior):**
- Label requirements should include "EXPLOSIVE 1.1 with compatibility group A"
- Marking requirements should include UN0224, PSN, EX number, MSL
- POP marking should accept codes from A5.2 with packing group X or Y
- Key 13 should be "1.1A"
- Key 15 should be empty (Class 1 has no packing group)
- Key 17 should be "A5.2"

**Negative Test Cases (From Alterations):**
1. POP marking shows packing group "Z" → should fail validation
2. Missing EX number marking → should fail marking validation
3. Key 13 shows "1.1" without compatibility group "A" → should fail SDDG validation

### Scenario 2: UN0027 - BLACK POWDER (GUNPOWDER)

**Positive Test Cases:**
- Label: "EXPLOSIVE 1.1 with compatibility group D"
- Markings: UN0027, full PSN with "(GUNPOWDER)", EX number, MSL
- POP codes per A5.3: 1A2, 1B2, 1D, 1G, 1H2, 4C1, 4C2, 4D, 4F, 4G
- Key 13: "1.1D"

**Negative Test Cases (From Alterations):**
1. POP marking shows "4H1" → should fail (not authorized for A5.3)
2. Key 12 missing "(GUNPOWDER)" qualifier → should fail PSN validation
3. MSL missing from package → should fail marking validation

### Scenario 3: UN0004 - AMMONIUM PICRATE

**Positive Test Cases:**
- Label: "EXPLOSIVE 1.1 with compatibility group D"
- Key 13: "1.1D"
- POP codes per A5.2 with X or Y

**Negative Test Cases (From Alterations):**
1. Label shows "EXPLOSIVE 1" without division ".1" → should fail
2. UN number on package shows "UN0005" → should fail UN match
3. POP marking shows PG code "Z" → should fail

### Scenario 4: UN0160 - POWDER, SMOKELESS

**Positive Test Cases:**
- Label: "EXPLOSIVE 1.1 with compatibility group C"
- Key 13: "1.1C"
- Key 17: "A5.21"

**Negative Test Cases (From Alterations):**
1. Key 17 shows "A5.2" instead of "A5.21" → should fail
2. Label shows compatibility group "D" instead of "C" → should fail
3. EX number format incorrect → should fail

### Scenario 5: UN0136 - MINES with bursting charge

**Positive Test Cases:**
- Label: "EXPLOSIVE 1.2 with compatibility group D"
- Key 13: "1.2D"
- Key 16 should include NEW (Net Explosive Weight)

**Negative Test Cases (From Alterations):**
1. Key 16 missing NEW → should fail quantity validation
2. Package shows EXPLOSIVE 1.1D instead of 1.2D → should fail division
3. Key 13 shows "1.2" without compatibility group → should fail

---

## Phase 3: Write Unit Tests

Use the test-driven-development skill before writing tests. Structure tests as follows:

### Test File Structure

```
src/utils/__tests__/
├── labelingRequirementsInspector.test.ts
├── markingRequirements.test.ts
└── sddgValidation.test.ts

server/lookupFunctions/__tests__/
└── packagingLookupV2.test.ts
```

### Test Template

```typescript
// labelingRequirementsInspector.test.ts
import { getLabelingRequirements } from '../labelingRequirementsInspector';

describe('Class 1 Explosives - Labeling Requirements', () => {
  describe('Scenario 1: UN0224 - BARIUM AZIDE, DRY', () => {
    const materialData = {
      unNumber: 'UN0224',
      hazardClass: '1.1A',
      packagingParagraph: 'A5.2',
      // ... other required fields
    };

    it('should require EXPLOSIVE 1.1 label with compatibility group A', () => {
      const result = getLabelingRequirements(materialData);
      expect(result).toContainEqual(
        expect.objectContaining({
          label: 'EXPLOSIVE 1.1',
          compatibilityGroup: 'A'
        })
      );
    });

    it('should require Cargo Aircraft Only label for 1.1A', () => {
      const result = getLabelingRequirements(materialData);
      expect(result).toContainEqual(
        expect.objectContaining({ label: 'Cargo Aircraft Only' })
      );
    });
  });

  describe('Scenario 2: UN0027 - BLACK POWDER', () => {
    // ... tests for scenario 2
  });

  // ... scenarios 3-5
});
```

### Alteration Tests (Negative Cases)

```typescript
describe('Class 1 Validation Failures', () => {
  describe('POP Marking Validation', () => {
    it('should reject packing group code Z for Class 1 (Scenario 1, Alteration 1)', () => {
      const result = validatePOPMarkingCode({
        packingGroupCode: 'Z',
        hazardClass: '1.1A'
      });
      expect(result.valid).toBe(false);
      expect(result.error).toMatch(/Class 1|packing group/i);
    });

    it('should reject unauthorized packaging code 4H1 for A5.3 (Scenario 2, Alteration 1)', () => {
      const result = validatePackagingCode({
        code: '4H1',
        packagingParagraph: 'A5.3'
      });
      expect(result.valid).toBe(false);
    });
  });

  describe('SDDG Key Validation', () => {
    it('should reject Key 13 without compatibility group (Scenario 1, Alteration 3)', () => {
      const result = validateKey13('1.1', { expectedClass: '1.1A' });
      expect(result.valid).toBe(false);
      expect(result.error).toMatch(/compatibility group/i);
    });

    it('should reject Key 17 mismatch (Scenario 4, Alteration 1)', () => {
      const result = validateKey17('A5.2', { expectedParagraph: 'A5.21' });
      expect(result.valid).toBe(false);
    });
  });

  describe('Marking Validation', () => {
    it('should require EX number for Class 1 (Scenario 1, Alteration 2)', () => {
      const result = validateMarkings({
        unNumber: 'UN0224',
        hazardClass: '1.1A',
        markingsPresent: ['UN0224', 'PSN'] // missing EX number
      });
      expect(result.valid).toBe(false);
      expect(result.missing).toContain('EX number');
    });
  });
});
```

---

## Phase 4: Verify Tests

After writing tests, use the verification-before-completion skill:

1. Run the tests: `npm test -- --testPathPattern="class1|labelingRequirements|markingRequirements|packagingLookup"`
2. Verify all tests pass OR document which tests fail due to missing implementation
3. If tests fail, determine if it's:
   - A test issue (wrong assumptions about function signatures)
   - A missing feature (validation logic doesn't exist yet)
   - A bug (validation logic exists but is incorrect)

---

## Deliverables

1. **Test files** in appropriate `__tests__/` directories
2. **Coverage report** showing which scenarios are covered
3. **Gap analysis** documenting any validation logic that doesn't exist yet
4. **Summary** of test results

---

## Skills to Use

Invoke these skills at appropriate phases:

| Phase | Skill |
|-------|-------|
| Before starting | `superpowers:using-superpowers` |
| Planning test structure | `superpowers:writing-plans` |
| Before writing tests | `superpowers:test-driven-development` |
| When stuck on implementation | `superpowers:systematic-debugging` |
| Before claiming completion | `superpowers:verification-before-completion` |

---

## Important Notes

1. **Don't guess function signatures** - read the actual source files first
2. **Match the existing test patterns** - look for existing `*.test.ts` files for style guidance
3. **Tests should be deterministic** - no external dependencies, mock everything
4. **Each alteration = one test case** - the alterations table is your test case spec
5. **Positive tests first** - verify expected behavior before testing failures
6. **Document gaps** - if validation logic doesn't exist, note it rather than skipping

---

## Example Subagent Invocation

```
Use the Task tool with subagent_type="general-purpose" to:

1. "Research labeling requirements" - Read and analyze labelingRequirementsInspector.tsx
2. "Research marking requirements" - Read and analyze markingRequirements.ts
3. "Research packaging validation" - Read and analyze packagingLookupV2.ts
4. "Extract test cases" - Parse scenarios 1-5 from class1.md
5. "Find SDDG validation" - Search codebase for SDDG key validation logic

Run these in parallel for efficiency, then synthesize findings before writing tests.
```
