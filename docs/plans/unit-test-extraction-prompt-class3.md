# Prompt: Add Unit Tests for Class 3 (Flammable Liquids) Test Scenarios

Use this prompt with a new Claude Code instance to create unit tests for Class 3 materials.

---

## Task Overview

You are creating unit tests for **Class 3 (Flammable Liquids)** from `src/testScenarios/class3.md`.

This task is similar to the Class 1 unit test implementation documented in `docs/plans/2026-01-13-class1-unit-tests.md`.

**IMPORTANT:**
- Use superpowers skills and subagents throughout this task
- Skip code review - passing tests are sufficient validation
- Follow the EXACT patterns established in Class 1 test files
- Create NEW test files with `.class3.test.ts` suffix (parallel to Class 1 files)

---

## Reference Documents

**Read these first:**
1. `docs/plans/2026-01-13-class1-unit-tests.md` - Implementation patterns and conventions
2. `src/testScenarios/class3.md` - All 20 Class 3 test scenarios

---

## Test Files to Create (Parallel to Class 1)

Create these new test files following Class 1 patterns:

```
src/utils/__tests__/
├── labelingRequirementsInspector.class3.test.ts  (copy patterns from .class1.test.ts)
├── markingRequirements.class3.test.ts            (copy patterns from .class1.test.ts)

src/components/Inspector/utils/__tests__/
└── sddgValidation.class3.test.ts                 (copy patterns from .class1.test.ts)

server/lookupFunctions/__tests__/
└── packagingLookupV2.class3.test.ts              (copy patterns from .class1.test.ts)
```

---

## Phase 1: Research (Use Subagents in Parallel)

Launch these subagents simultaneously:

### Subagent 1: Read Class 1 Test Patterns
```
Read all existing Class 1 test files to extract patterns:
- src/utils/__tests__/labelingRequirementsInspector.class1.test.ts
- src/utils/__tests__/markingRequirements.class1.test.ts
- src/components/Inspector/utils/__tests__/sddgValidation.class1.test.ts
- server/lookupFunctions/__tests__/packagingLookupV2.class1.test.ts

Extract:
- Import statements
- Helper function signatures (createClass1Context, createClass1Material)
- Describe block structure
- Test naming conventions
- Assertion patterns
```

### Subagent 2: Extract Scenarios 1-5 from class3.md
```
Read src/testScenarios/class3.md and extract Scenarios 1-5:
- Material Details (UN number, PSN, hazard class, packing group, packaging paragraph)
- Expected SDDG Keys (7, 11-17)
- Expected Labels (primary, subsidiary)
- Expected Markings
- POP Marking validation rules
- All Alterations (3 per scenario)

SPECIAL CASES:
- Scenario 1: PG I with P3 (CAO required)
- Scenario 2: PG I with subsidiary 6.1 (TOXIC)
- Scenario 3: Multiple subsidiary risks (6.1, 8)
- Scenario 4: PG I with P3 and 6.1
- Scenario 5: PG II with P5 (passenger allowed)
```

### Subagent 3: Extract Scenarios 6-10 from class3.md
```
Read src/testScenarios/class3.md and extract Scenarios 6-10:
- Material Details
- Expected SDDG Keys
- Expected Labels/Markings
- Alterations

SPECIAL CASES:
- Scenario 7: N.O.S. with technical name required
- Scenario 8: N.O.S. with subsidiary 8 (CORROSIVE)
- Scenario 9: N.O.S. with subsidiary 8 and P4 (CAO)
- Scenario 10: A7.3 packaging (combination only)
```

### Subagent 4: Extract Scenarios 11-15 from class3.md
```
Read src/testScenarios/class3.md and extract Scenarios 11-15:
- Material Details
- Expected SDDG Keys
- Expected Labels/Markings
- Alterations

SPECIAL CASES:
- Scenario 11: Marine Pollutant (N34 provision)
- Scenario 13: PG III (allows X, Y, or Z POP codes)
- Scenario 14: N.O.S. with subsidiary 6.1 and PG III
```

### Subagent 5: Extract Scenarios 16-20 from class3.md
```
Read src/testScenarios/class3.md and extract Scenarios 16-20:
- Material Details
- Expected SDDG Keys
- Expected Labels/Markings
- Alterations

SPECIAL CASES:
- Scenario 16-17: Same UN1263 but different PSNs (PAINT vs PAINT RELATED MATERIAL)
- Scenario 18: A7.10 packaging (chlorosilanes)
- Scenario 19: NA prefix (domestic shipment)
- Scenario 20: No packing group (engine/article)
```

---

## Key Differences from Class 1

| Aspect | Class 1 (Explosives) | Class 3 (Flammable Liquids) |
|--------|---------------------|----------------------------|
| Key 13 | Division + Compatibility (1.1A, 1.4S) | Just "3" (no divisions) |
| Key 15 | Empty (no packing group) | **ALWAYS required** (I, II, or III) |
| EX Number | Required | Not applicable |
| Orientation | Some items | Most items (liquids) |
| POP Code Z | Never | Allowed for PG III |
| Subsidiary | 5.1, 6.1 possible | 6.1, 8 common |

---

## Phase 2: Scenario Summary

### Packing Group I Scenarios (CAO required)
| # | UN | PSN | Subsidiary | Provision |
|---|-----|-----|------------|-----------|
| 1 | UN1089 | ACETALDEHYDE | None | P3 |
| 2 | UN1093 | ACRYLONITRILE, STABILIZED | 6.1 | P3 |
| 3 | UN3165 | AIRCRAFT HYDRAULIC POWER UNIT FUEL TANK | 6.1, 8 | P3 |
| 4 | UN1991 | CHLOROPRENE, STABILIZED | 6.1 | P3 |

### Packing Group II Scenarios
| # | UN | PSN | Subsidiary | Provision |
|---|-----|-----|------------|-----------|
| 5 | UN1090 | ACETONE | None | P5 |
| 6 | UN1114 | BENZENE | None | P5 |
| 7 | UN1987 | ALCOHOLS, N.O.S. | None | P5 (Technical name) |
| 8 | UN3274 | ALCOHOLATES SOLUTION, N.O.S. | 8 | P5 (Technical name) |
| 9 | UN2733 | AMINES, FLAMMABLE, CORROSIVE N.O.S. | 8 | P4 (CAO) |
| 10 | UN2251 | BICYCLO[2,2,1]HEPTA-2,5-DIENE, STABILIZED | None | P5 |
| 11 | UN1278 | 1-CHLOROPROPANE | None (Marine Pollutant) | P5 |
| 12 | UN1139 | COATING SOLUTION | None | P5 |
| 18 | UN2985 | CHLOROSILANES, FLAMMABLE, CORROSIVE, N.O.S. | 8 | P4 (CAO) |

### Packing Group III Scenarios
| # | UN | PSN | Subsidiary | Provision |
|---|-----|-----|------------|-----------|
| 13 | UN2332 | ACETALDEHYDE OXIME | None | P5 |
| 14 | UN1986 | ALCOHOLS, FLAMMABLE, TOXIC, N.O.S. | 6.1 | P5 (Technical name) |
| 15 | UN2607 | ACROLEIN DIMER, STABILIZED | None | P5 |
| 16 | UN1263 | PAINT | None | P5 |
| 17 | UN1263 | PAINT RELATED MATERIAL | None | P5 |
| 19 | NA1993 | COMPOUNDS, CLEANING LIQUID | None | P5 (Domestic) |

### Special Cases
| # | UN | PSN | Special Feature |
|---|-----|-----|-----------------|
| 20 | UN3528 | ENGINE, INTERNAL COMBUSTION | No packing group (article) |

---

## Phase 3: Create Test Files

Use the `superpowers:subagent-driven-development` skill to dispatch implementer subagents.

### Helper Function Pattern for Class 3

```typescript
// In sddgValidation.class3.test.ts
function createClass3Material(
  unid: string,
  packingGroup: string,  // 'I', 'II', 'III', or '' for articles
  packagingParagraph: string,
  properShippingName: string,
  subsidiaryRisk: string = ''
): HazardousMaterialItem {
  return {
    unid,
    hazclassDiv: '3',  // Always "3" for Class 3
    packagingParagraph,
    properShippingName,
    packingGroup,      // REQUIRED for Class 3 (unlike Class 1)
    subsidiaryRisk,
    specialProvision: '',
    isTechnicalNameRequired: properShippingName.includes('N.O.S.'),
  } as HazardousMaterialItem;
}
```

```typescript
// In labelingRequirementsInspector.class3.test.ts
function createClass3Context(
  unNumber: string,
  packingGroup: string,
  properShippingName: string,
  subsidiaryRisk: string = '',
  aircraftType: string = 'CARGO AIRCRAFT ONLY'
): SDDGInspectionContext {
  // ... similar to Class 1 but with:
  // - hazardClass: '3' (not '1.1A')
  // - packingGroup: populated (not empty)
  // - subsidiaryRisk: '6.1', '8', or '6.1, 8'
}
```

### Test Structure Example

```typescript
describe('Labeling Requirements - Class 3 Flammable Liquids', () => {
  describe('Primary Hazard Label', () => {
    test('Scenario 1: UN1089 - returns FLAMMABLE LIQUID label', () => {
      const context = createClass3Context('UN1089', 'I', 'ACETALDEHYDE');
      const result = evaluateLabelingRequirements(context);
      expect(result['Primary Hazard']).toBeDefined();
      expect(result['Primary Hazard']).toContain('Flammable Liquid');
    });
  });

  describe('Cargo Aircraft Only Label', () => {
    test('Scenario 1: UN1089 with P3 requires CAO label', () => {
      const context = createClass3Context('UN1089', 'I', 'ACETALDEHYDE');
      const result = evaluateLabelingRequirements(context);
      expect(result['Cargo Aircraft Only']).toBeDefined();
    });

    test('Scenario 5: UN1090 with P5 does NOT require CAO label', () => {
      const context = createClass3Context('UN1090', 'II', 'ACETONE', '', 'Passenger and Cargo');
      const result = evaluateLabelingRequirements(context);
      expect(result['Cargo Aircraft Only']).toBeUndefined();
    });
  });

  describe('Subsidiary Hazard Label', () => {
    test('Scenario 2: UN1093 requires TOXIC 6.1 subsidiary label', () => {
      const context = createClass3Context('UN1093', 'I', 'ACRYLONITRILE, STABILIZED', '6.1');
      const result = evaluateLabelingRequirements(context);
      expect(result['Subsidiary Hazard']).toBeDefined();
      expect(result['Subsidiary Hazard']).toContain('Toxic');
    });

    test('Scenario 3: UN3165 requires both TOXIC and CORROSIVE labels', () => {
      const context = createClass3Context('UN3165', 'I', 'AIRCRAFT HYDRAULIC POWER UNIT FUEL TANK', '6.1, 8');
      const result = evaluateLabelingRequirements(context);
      expect(result['Subsidiary Hazard']).toContain('Toxic');
      expect(result['Subsidiary Hazard']).toContain('Corrosive');
    });
  });

  describe('Orientation Labels (This Side Up)', () => {
    test('Scenario 1: UN1089 liquid requires orientation labels', () => {
      // Class 3 liquids in combination packaging require orientation
    });
  });
});
```

### Key Tests by Module

**sddgValidation.class3.test.ts:**
- Key 13: Always validates as "3" (no divisions)
- Key 15: ALWAYS validates packing group (I, II, III)
- Key 14: Validates subsidiary risk (6.1, 8, or both)
- Key 17: Validates packaging paragraphs (A7.2, A7.3, A7.4, A7.10, A7.11, A12.2)

**labelingRequirementsInspector.class3.test.ts:**
- Primary: FLAMMABLE LIQUID label for all scenarios
- CAO: Required for P1-P4, NOT required for P5
- Subsidiary: TOXIC (6.1), CORROSIVE (8), or both
- Orientation: Required for most liquid packaging

**markingRequirements.class3.test.ts:**
- PSN and UN number markings
- Technical name for N.O.S. entries (Scenarios 7, 8, 9, 14)
- Marine Pollutant marking (Scenario 11)
- NA vs UN prefix (Scenario 19)
- Orientation arrows

**packagingLookupV2.class3.test.ts:**
- A7.2: Standard Class 3 packaging
- A7.3: Combination packaging only (Scenario 10)
- A7.4: Specialized fuel tanks (Scenario 3)
- A7.10: Chlorosilanes (Scenario 18)
- A7.11: Engines (Scenario 20)
- A12.2: Domestic cleaning compounds (Scenario 19)
- POP code validation: X only for PG I, X/Y for PG II, X/Y/Z for PG III

---

## Phase 4: Verify Tests

Run all Class 3 tests:
```bash
npm test -- --testPathPattern="class3" --no-coverage
```

Run combined Class 1 + Class 3 to verify no regressions:
```bash
npm test -- --testPathPattern="class1|class3|labelingRequirements|markingRequirements|packagingLookup|sddgValidation" --no-coverage
```

### Expected Test Counts

| Test File | Positive Tests | Negative Tests | Total |
|-----------|----------------|----------------|-------|
| labelingRequirementsInspector.class3.test.ts | ~30 | ~20 | ~50 |
| markingRequirements.class3.test.ts | ~30 | ~25 | ~55 |
| sddgValidation.class3.test.ts | ~40 | ~25 | ~65 |
| packagingLookupV2.class3.test.ts | ~20 | ~10 | ~30 |
| **Total** | ~120 | ~80 | **~200** |

---

## Deliverables

1. **New test files** (4 files with `.class3.test.ts` suffix)
2. **Test count summary** with passing/skipped breakdown
3. **Special case coverage confirmation:**
   - [ ] Packing Group I (CAO required, POP X only)
   - [ ] Packing Group II (POP X or Y)
   - [ ] Packing Group III (POP X, Y, or Z)
   - [ ] Subsidiary hazards 6.1 (TOXIC)
   - [ ] Subsidiary hazards 8 (CORROSIVE)
   - [ ] Multiple subsidiary hazards (6.1, 8)
   - [ ] N.O.S. with technical names (Scenarios 7, 8, 9, 14)
   - [ ] Marine Pollutant (Scenario 11)
   - [ ] Domestic NA prefix (Scenario 19)
   - [ ] No packing group - articles (Scenario 20)
   - [ ] Same UN, different PSN (Scenarios 16-17)
   - [ ] Special packaging paragraphs (A7.3, A7.4, A7.10, A7.11, A12.2)

---

## Skills to Invoke

| When | Skill |
|------|-------|
| Start of task | `superpowers:using-superpowers` |
| Dispatching parallel research | `superpowers:dispatching-parallel-agents` |
| Writing test code | `superpowers:subagent-driven-development` |
| If tests fail unexpectedly | `superpowers:systematic-debugging` |
| Before claiming done | `superpowers:verification-before-completion` |

---

## Important Notes

1. **READ CLASS 1 TEST FILES FIRST** - patterns must match exactly
2. **CREATE NEW FILES** - don't modify Class 1 test files
3. **CLASS 3 ALWAYS HAS PACKING GROUP** - unlike Class 1 (except Scenario 20 engine)
4. **60 NEGATIVE TESTS** - each of 20 scenarios has 3 alterations
5. **N.O.S. TECHNICAL NAMES** - critical for Scenarios 7, 8, 9, 14
6. **POP CODE VALIDATION DIFFERS** - PG III allows Z code (unlike Class 1)
7. **RUN FULL TEST SUITE** - ensure Class 1 tests still pass

---

## Quick Start Commands

```bash
# Clone patterns from Class 1 files
ls -la src/utils/__tests__/*class1*
ls -la src/components/Inspector/utils/__tests__/*class1*
ls -la server/lookupFunctions/__tests__/*class1*

# After creating tests, verify
npm test -- --testPathPattern="class3" --no-coverage

# Full regression
npm test -- --testPathPattern="class1|class3" --no-coverage
```
