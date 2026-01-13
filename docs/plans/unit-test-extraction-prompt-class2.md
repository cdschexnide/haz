# Prompt: Add Unit Tests for Class 2 (Gases) Scenarios

Use this prompt with a new Claude Code instance to create unit tests for Class 2 hazardous materials.

---

## Task Overview

Create unit tests for **all 20 scenarios** from `src/testScenarios/class2.md` following the same patterns established in the Class 1 implementation.

**IMPORTANT:**
- Use superpowers skills and subagents throughout this task
- Follow the patterns established in the Class 1 test files
- Skip code review - passing tests are the only review needed
- Create new `.class2.test.ts` files parallel to the existing `.class1.test.ts` files

---

## Reference Files

**Read these first to understand the patterns:**

1. `docs/plans/2026-01-13-class1-unit-tests.md` - Implementation plan with patterns
2. `src/testScenarios/class2.md` - All 20 Class 2 scenarios with alterations

**Existing Class 1 test files to use as patterns:**

```
src/utils/__tests__/labelingRequirementsInspector.class1.test.ts
src/utils/__tests__/markingRequirements.class1.test.ts
src/components/Inspector/utils/__tests__/sddgValidation.class1.test.ts
server/lookupFunctions/__tests__/packagingLookupV2.class1.test.ts
```

---

## Test Files to Create

Create these new test files:

```
src/utils/__tests__/labelingRequirementsInspector.class2.test.ts
src/utils/__tests__/markingRequirements.class2.test.ts
src/components/Inspector/utils/__tests__/sddgValidation.class2.test.ts
server/lookupFunctions/__tests__/packagingLookupV2.class2.test.ts
```

---

## Phase 1: Research (Use Parallel Subagents)

Launch these subagents simultaneously:

### Subagent 1: Read Class 1 Implementation Plan
```
Read docs/plans/2026-01-13-class1-unit-tests.md thoroughly.
Extract:
- Test file structure and locations
- Factory function patterns
- Positive/negative test organization
- Test naming conventions
- Gap documentation patterns (test.skip with comments)
```

### Subagent 2: Read Existing Class 1 Test Files
```
Read all Class 1 test files to understand exact patterns:
- src/utils/__tests__/labelingRequirementsInspector.class1.test.ts
- src/utils/__tests__/markingRequirements.class1.test.ts
- src/components/Inspector/utils/__tests__/sddgValidation.class1.test.ts
- server/lookupFunctions/__tests__/packagingLookupV2.class1.test.ts

Document:
- Import statements
- Factory function signatures
- Describe block hierarchy
- Assertion patterns
- How gaps are documented
```

### Subagent 3: Extract Scenarios 1-7 from class2.md
```
Read src/testScenarios/class2.md and extract Scenarios 1-7:
- Division 2.1 (Flammable Gas): Scenarios 1-5
- Division 2.2 (Non-Flammable Gas): Scenarios 6-7
For each scenario extract:
- UN number, PSN, hazard class, subsidiary risk
- Expected SDDG Keys (7, 11-17, 19)
- Expected Labels and Markings
- All 3 Alterations per scenario
```

### Subagent 4: Extract Scenarios 8-14 from class2.md
```
Read src/testScenarios/class2.md and extract Scenarios 8-14:
- Division 2.2 continued: Scenarios 8-13
- Division 2.3 (Toxic Gas) start: Scenario 14
Special cases:
- Scenario 9: UN1072 OXYGEN has subsidiary 5.1
- Scenario 11: Fire extinguisher (MEETS DOT REQUIREMENTS marking)
- Scenario 12: Cryogenic liquid (orientation labels)
- Scenario 13: Aerosol with subsidiary 8
- Scenario 14: UN1017 CHLORINE has multiple subsidiaries 5.1 and 8, Zone B
```

### Subagent 5: Extract Scenarios 15-20 from class2.md
```
Read src/testScenarios/class2.md and extract Scenarios 15-20:
- Division 2.3 (Toxic Gas): All scenarios
Special cases:
- Inhalation Hazard Zones (A, B, C, D)
- N.O.S. with technical names (Scenarios 18-20)
- "INHALATION HAZARD" marking required for all 2.3
- "TOXIC-INHALATION HAZARD, ZONE X" in Key 12
```

---

## Phase 2: Key Class 2 Differences from Class 1

**These differences MUST be reflected in the tests:**

| Aspect | Class 1 (Explosives) | Class 2 (Gases) |
|--------|---------------------|-----------------|
| Packing Group in Key 15 | Always empty | May have PG or be empty |
| Packaging Paragraph | A5.xx | A6.xx |
| EX Number Marking | Required | NOT Required |
| Key 19 (Handling Info) | Not Used | Cylinder position statement required |
| Packaging Types | Boxes, drums | Cylinders, pressure receptacles, aerosols |
| Special Markings | MSL, NEW | "INHALATION HAZARD" (2.3), "MEETS DOT REQUIREMENTS" (fire extinguishers) |
| Orientation Labels | Not typical | Required for cryogenic liquids |
| Subsidiary Labeling | Some materials | Common (5.1, 8, 2.1 subsidiaries) |

---

## Phase 3: Scenario Summary for Test Cases

### Division 2.1 - Flammable Gases (Scenarios 1-5)

**Scenario 1**: UN1001, 2.1, ACETYLENE, DISSOLVED
- P4: CAO required
- Key 19: "Ship valve up in vertical position"
- Alterations: Key 7 PAX vs CAO, missing CAO label, missing Key 19

**Scenario 2**: UN1011, 2.1, BUTANE
- P4: CAO required
- Alterations: Wrong Key 17 (A6.2 vs A6.3), POP code 4G invalid for cylinder, wrong Key 13 (2.2)

**Scenario 3**: UN1978, 2.1, PROPANE
- P4: CAO required
- Alterations: Wrong UN (UN1979), wrong label (2.2 vs 2.1), metric missing in Key 16

**Scenario 4**: UN1950, 2.1, AEROSOLS, FLAMMABLE
- **P5: Passenger aircraft allowed** (no CAO required)
- Key 19: Not required for aerosols
- Alterations: Wrong Key 17 (A6.3), PSN abbreviated, Key 7 shows CAO

**Scenario 5**: UN1954, 2.1, COMPRESSED GAS, FLAMMABLE, N.O.S.
- **Technical name required in Key 12 and markings**
- P4: CAO required
- Alterations: Missing technical name in Key 12, missing tech name on package, wrong Key 19

### Division 2.2 - Non-Flammable Gases (Scenarios 6-13)

**Scenario 6**: UN1006, 2.2, ARGON, COMPRESSED
- P5: Passenger allowed
- Alterations: Wrong label (2.1 vs 2.2), missing UN marking, wrong UN in Key 11

**Scenario 7**: UN1013, 2.2, CARBON DIOXIDE
- P5: Passenger allowed
- Alterations: Wrong Key 13 (2.3), wrong Key 17 (A6.11 cryogenic), PSN abbreviated "CO2"

**Scenario 8**: UN1066, 2.2, NITROGEN, COMPRESSED
- P5: Passenger allowed
- Alterations: Wrong PSN (REFRIGERATED LIQUID), invalid POP code W, missing Key 19

**Scenario 9**: UN1072, 2.2, OXYGEN, COMPRESSED
- **Subsidiary risk 5.1 (Oxidizer)** - Key 14 populated
- P5: Passenger allowed
- Alterations: Key 14 empty, missing 5.1 label, wrong primary class (5.1 vs 2.2)

**Scenario 10**: UN1956, 2.2, COMPRESSED GAS, N.O.S.
- **Technical name required**
- P5: Passenger allowed
- Alterations: Missing technical name Key 12, missing tech name marking, wrong Key 17

**Scenario 11**: UN1044, 2.2, FIRE EXTINGUISHERS
- **Special marking: "MEETS DOT REQUIREMENTS"**
- Key 19: Not required (article, not cylinder)
- Alterations: Missing MEETS DOT marking, wrong Key 17 (A6.3 vs A6.7), wrong Key 13

**Scenario 12**: UN1977, 2.2, NITROGEN, REFRIGERATED LIQUID
- **Cryogenic: Orientation labels required**
- **P4: CAO required**
- Alterations: Missing orientation labels, Key 7 PAX vs CAO, wrong Key 17

**Scenario 13**: UN1950, 2.2, AEROSOLS (non-flammable with subsidiary 8)
- **Subsidiary risk 8 (Corrosive)** - Key 14 populated
- P5: Passenger allowed
- Alterations: Key 14 empty, missing 8 label, wrong Key 12 (FLAMMABLE vs non-flammable)

### Division 2.3 - Toxic Gases (Scenarios 14-20)

**Scenario 14**: UN1017, 2.3, CHLORINE
- **Multiple subsidiaries: 5.1 AND 8**
- **Zone B designation in Key 12**
- **"INHALATION HAZARD" marking required**
- P2: CAO required
- Alterations: Missing Zone designation, missing INHALATION marking, Key 14 shows only 5.1

**Scenario 15**: UN1053, 2.3, HYDROGEN SULFIDE
- **Subsidiary 2.1 (Flammable)**
- **Zone B**
- P2: CAO required
- Alterations: Missing 2.1 subsidiary, missing flammable label, wrong Zone (A vs B)

**Scenario 16**: UN1076, 2.3, PHOSGENE
- **ZONE A - Most Dangerous**
- **Subsidiary 8**
- **P1: Most restrictive CAO**
- Special packaging A6.15 for Zone A
- Alterations: Zone B vs A, wrong Key 17 (A6.4 vs A6.15), missing INHALATION marking

**Scenario 17**: UN2199, 2.3, PHOSPHINE
- **ZONE A**
- **Subsidiary 2.1 (Flammable)**
- P1: CAO required
- Alterations: Missing 2.1 subsidiary, missing flammable label, wrong Key 17

**Scenario 18**: UN1955, 2.3, COMPRESSED GAS, TOXIC, N.O.S.
- **Zone B**
- **Technical name required**
- P2: CAO required
- Alterations: Missing technical name, wrong Zone (C vs B), missing INHALATION marking

**Scenario 19**: UN3160, 2.3, LIQUEFIED GAS, TOXIC, FLAMMABLE, N.O.S.
- **Zone C**
- **Subsidiary 2.1**
- **Technical name required**
- P2: CAO required
- Alterations: Missing 2.1 subsidiary, missing tech name, missing CAO label

**Scenario 20**: UN3160, 2.3, LIQUEFIED GAS, TOXIC, FLAMMABLE, N.O.S.
- **Zone D - Least Dangerous**
- **Subsidiary 2.1**
- **Technical name required**
- P2: CAO required
- Alterations: Wrong Zone (A vs D), wrong UN (3162 vs 3160), Key 7 PAX vs CAO

---

## Phase 4: Write Tests Using Parallel Subagents

Dispatch 4 parallel subagents, one for each test file:

### Subagent A: labelingRequirementsInspector.class2.test.ts

Create tests for:
1. **Primary Hazard Labels** - All 20 scenarios
   - Division 2.1: FLAMMABLE GAS (Red)
   - Division 2.2: NON-FLAMMABLE GAS (Green)
   - Division 2.3: TOXIC GAS / TOXIC INHALATION HAZARD (White)

2. **Subsidiary Hazard Labels**
   - Scenario 9: OXIDIZER 5.1
   - Scenario 13: CORROSIVE 8
   - Scenario 14: OXIDIZER 5.1 AND CORROSIVE 8
   - Scenarios 15, 17, 19, 20: FLAMMABLE GAS 2.1

3. **CAO Labels**
   - P1 (most restrictive): Scenarios 16, 17
   - P2: Scenarios 14, 15, 18, 19, 20
   - P4: Scenarios 1, 2, 3, 5, 12
   - P5 (passenger allowed - NO CAO): Scenarios 4, 6, 7, 8, 9, 10, 11, 13

4. **Orientation Labels**
   - Scenario 12: Cryogenic liquid requires "This Side Up"

### Subagent B: markingRequirements.class2.test.ts

Create tests for:
1. **PSN and UN Number** - All 20 scenarios

2. **Technical Name for N.O.S.**
   - Scenario 5: COMPRESSED GAS, FLAMMABLE, N.O.S. (Methane mixture)
   - Scenario 10: COMPRESSED GAS, N.O.S. (Helium, Neon mixture)
   - Scenarios 18-20: Various toxic N.O.S.

3. **INHALATION HAZARD Marking** (Division 2.3 only)
   - Scenarios 14-20: All must have "INHALATION HAZARD"

4. **MEETS DOT REQUIREMENTS Marking**
   - Scenario 11: Fire extinguishers only

5. **POP Marking**
   - Cylinder specifications for most Class 2
   - Box/drum codes for aerosols (A6.2)

### Subagent C: sddgValidation.class2.test.ts

Create tests for:
1. **Key 13: Hazard Class Validation** - All 20 scenarios
   - 2.1, 2.2, or 2.3

2. **Key 14: Subsidiary Risk Validation**
   - Scenario 9: 5.1
   - Scenario 13: 8
   - Scenario 14: 5.1, 8 (multiple)
   - Scenarios 15, 17, 19, 20: 2.1

3. **Key 15: Packing Group**
   - Most Class 2: Empty
   - Some materials may have PG

4. **Key 17: Packaging Instruction**
   - A6.2: Aerosols
   - A6.3: Small receptacles/compressed gas
   - A6.4: Liquefied compressed gas
   - A6.5: Nonliquefied compressed gas
   - A6.6: LPG
   - A6.7: Fire extinguishers
   - A6.9: Acetylene
   - A6.11: Cryogenic liquids
   - A6.15: Zone A toxic gases

5. **Key 19: Handling Information**
   - Cylinder position statement required for most
   - NOT required for aerosols (Scenarios 4, 13)
   - NOT required for fire extinguishers (Scenario 11)

6. **Division 2.3 Special: Zone Designation in Key 12**
   - Zone A: Scenarios 16, 17
   - Zone B: Scenarios 14, 15, 18
   - Zone C: Scenario 19
   - Zone D: Scenario 20

### Subagent D: packagingLookupV2.class2.test.ts

Create tests for:
1. **Entry Existence** - All A6.xx paragraphs
   - A6.2, A6.3, A6.4, A6.5, A6.6, A6.7, A6.9, A6.11, A6.15

2. **Authorized Packaging Codes**
   - Cylinders: DOT-3A, 3AA, 3AL, 3B, 3E, 4AA, 4B, 4BA, 4BW, etc.
   - Boxes/Drums for aerosols: 4G, 4C1, 4C2, 4D, 4F, 4H1, 4H2, 1A1, 1A2, 1B1, 1B2

3. **Invalid Codes (From Alterations)**
   - 4G invalid for compressed gas cylinders (Scenario 2)
   - "W" is not a valid POP packing group code (Scenario 8)

---

## Phase 5: Verify Tests

1. **Run all tests:**
   ```bash
   npm test -- --testPathPattern="class2" --no-coverage
   ```

2. **Verify coverage:**
   - All 20 scenarios have positive tests
   - All 60 alterations (3 per scenario) have negative tests
   - Special cases covered: N.O.S., subsidiaries, zones, cryogenic, fire extinguishers

3. **Check no regressions:**
   - Run Class 1 tests still pass: `npm test -- --testPathPattern="class1"`

---

## Deliverables

1. **New test files:**
   - `src/utils/__tests__/labelingRequirementsInspector.class2.test.ts`
   - `src/utils/__tests__/markingRequirements.class2.test.ts`
   - `src/components/Inspector/utils/__tests__/sddgValidation.class2.test.ts`
   - `server/lookupFunctions/__tests__/packagingLookupV2.class2.test.ts`

2. **Test count summary:**
   - Positive tests: ~80 (20 scenarios x 4 validation areas)
   - Negative tests: ~60 (20 scenarios x 3 alterations)
   - Total: ~140+ tests

3. **Special case coverage confirmation:**
   - [ ] N.O.S. with technical names (Scenarios 5, 10, 18-20)
   - [ ] Subsidiary hazards (Scenarios 9, 13, 14, 15, 17, 19, 20)
   - [ ] Multiple subsidiaries (Scenario 14)
   - [ ] Inhalation hazard zones (Scenarios 14-20)
   - [ ] INHALATION HAZARD marking (Division 2.3)
   - [ ] Cryogenic/orientation labels (Scenario 12)
   - [ ] Fire extinguisher marking (Scenario 11)
   - [ ] P5 passenger aircraft (Scenarios 4, 6-11, 13)
   - [ ] Key 19 cylinder position (most scenarios)
   - [ ] Key 19 NOT required (aerosols, fire extinguishers)

---

## Skills to Invoke

| When | Skill |
|------|-------|
| Start of task | `superpowers:using-superpowers` |
| Before writing tests | `superpowers:test-driven-development` |
| Running parallel agents | `superpowers:dispatching-parallel-agents` |
| Executing the plan | `superpowers:subagent-driven-development` |
| If tests fail unexpectedly | `superpowers:systematic-debugging` |
| Before claiming done | `superpowers:verification-before-completion` |

---

## Important Notes

1. **CREATE NEW FILES** - Class 2 tests go in separate `.class2.test.ts` files
2. **MATCH EXISTING PATTERNS** - Copy factory functions and test structure from Class 1
3. **60 NEGATIVE TESTS** - Each of the 20 scenarios has 3 alterations
4. **KEY 19 IS NEW** - Class 1 doesn't use Key 19, Class 2 does (cylinder position)
5. **ZONE DESIGNATIONS** - Division 2.3 has "TOXIC-INHALATION HAZARD, ZONE X" in Key 12
6. **INHALATION HAZARD** - Required marking for ALL Division 2.3 materials
7. **RUN FULL TEST SUITE** - Ensure Class 1 tests still pass after adding Class 2
8. **SKIP CODE REVIEW** - Passing tests are all the review needed
9. **USE SUBAGENTS** - Parallel agents for research, parallel agents for writing tests
