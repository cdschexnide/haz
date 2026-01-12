  # Prompt: Create Class 8 (Corrosive Substances) Test Scenarios

  Use this prompt with a new Claude Code instance to generate comprehensive test scenarios for Class 8 hazardous materials.

  ---

  ## Task Overview

  This is a mobile app used for hazardous material inspection. The Inspector persona workflow is defined in `docs/architecture/inspector-workflow-and-ml-detection.md`. Read this file first to understand the inspection workflow. The application's business logic is built on AFMAN 24-604.

  Create 20 comprehensive test scenarios for Class 8 hazardous materials. These are **manual test scenarios** - you will physically run through the app with these scenarios, not automated Jest tests.

  Each test scenario must include:
  1. **Material Details**: UN number, PSN, hazard class, packing group, packaging paragraph, special provisions
  2. **Expected SDDG Inspection (Successful)**: What each SDDG Key should contain for a passing inspection
  3. **Expected Package Inspection (Successful)**: Required labels, markings, and POP marking validation
  4. **Alterations**: 2-3 intentional errors per scenario to test frustration handling (e.g., missing labels, wrong SDDG fields, incorrect packaging codes, wrong packing group on POP marking)

  ---

  ## Class 8 Overview

  **IMPORTANT**: Class 8 is unique among hazard classes because it has **NO DIVISIONS**. Unlike Classes 2, 4, 5, and 6 which have divisions, Class 8 is simply "Corrosive Substances" with classification by Packing Group only.

  | Class | Name | Hazard | Label | Classification |
  |-------|------|--------|-------|----------------|
  | 8 | Corrosive Substances | Destroys living tissue and/or corrodes metals | White/Black (dripping liquid) | **Packing Groups I, II, III** |

  ### What Are Corrosive Substances?

  Materials that:
  - Cause **full thickness destruction of intact skin tissue** within a specified period
  - Exhibit a **corrosion rate on steel or aluminum** exceeding specified thresholds
  - Include both **acids** and **bases (alkalis)**

  ### Classification by Packing Group (Corrosivity Severity)

  | Packing Group | Skin Corrosion | Exposure Time | Metal Corrosion | Hazard Level |
  |---------------|----------------|---------------|-----------------|--------------|
  | **PG I** | Full thickness destruction | ≤3 minutes observation, ≤60 min | >6.25 mm/year on steel or aluminum at 55°C | **Highly Corrosive** |
  | **PG II** | Full thickness destruction | >3 min to ≤60 min exposure, ≤14 days observation | >6.25 mm/year at 55°C | **Corrosive** |
  | **PG III** | Full thickness destruction | >60 min to ≤4 hours exposure, ≤14 days observation | >6.25 mm/year at 55°C | **Mildly Corrosive** |

  ### Types of Corrosives

  | Type | Examples | Key Characteristics |
  |------|----------|---------------------|
  | **Acids** | Sulfuric acid, Hydrochloric acid, Nitric acid | Low pH, attack metals and tissue |
  | **Bases (Alkalis)** | Sodium hydroxide, Potassium hydroxide, Ammonia | High pH, saponify fats, severe burns |
  | **Other** | Battery fluid, Hypochlorite solutions, Cleaning compounds | Various mechanisms |

  ---

  ## Required Research

  Before writing the scenarios, you MUST read and analyze these AFMAN 24-604 attachments:

  ### Primary Source - Class 8 Packaging
  1. **Attachment 12** (`docs/attachment12/afmanAttachment12.pdf`) - Packaging instructions for Class 8
     - Contains A12.xx paragraphs with allowed packaging codes
     - A12.1: General requirements for corrosives
     - A12.2: Corrosive liquids packaging (by packing group)
     - A12.3: Corrosive solids packaging (by packing group)
     - Inner packaging requirements for combination packaging
     - Material compatibility requirements (acid vs base, material resistance)
     - Quantity limitations per package

  ### Supporting Sources (Same as other classes)
  2. **Attachment 14** (`docs/attachment14/attachment14.pdf`) - Marking requirements
     - PSN and UN Number marking requirements (12mm minimum height)
     - Orientation marking requirements (critical for corrosive liquids)
     - "MARINE POLLUTANT" marking if applicable
     - Technical name requirements for N.O.S. entries

  3. **Attachment 15** (`docs/attachment15/attachment15.pdf`) - Labeling requirements
     - CORROSIVE label (Class 8) - White upper half, black lower half
     - Subsidiary hazard labels (3 Flammable, 5.1 Oxidizer, 6.1 Toxic)
     - Cargo Aircraft Only labels
     - Orientation labels (required for corrosive liquids)

  4. **Attachment 17** (`server/attachment17/attachment17.pdf`) - SDDG certification requirements
     - Table A17.1 with all Keys 1-22
     - Key 7: Aircraft Limitations
     - Key 11: UN Number
     - Key 12: PSN (with technical name for N.O.S.)
     - Key 13: Class - simply "8" (NO divisions)
     - Key 14: Subsidiary Risk
     - Key 15: Packing Group - REQUIRED (I, II, or III)
     - Key 16: Quantity and Type of Packing
     - Key 17: Packaging Instructions (A12.xx for Class 8)

  ### Code Sources
  Also read these source files to understand the app's data and logic:
  - `src/hazardousMaterials/hazardousMaterialsList.ts` - Find diverse Class 8 materials from Table A4.1
  - `src/utils/labelingRequirementsInspector.tsx` - Understand labeling logic
  - `src/utils/markingRequirementsInspector.ts` - Understand marking logic
  - `server/lookupFunctions/packagingLookupV2.ts` - Understand packaging validation

  ### Reference Format
  - **`src/testScenarios/class1.md`** - Use this as your FORMAT REFERENCE for how scenarios should be structured
    - NOTE: This document is for Class 1 (Explosives) using Attachments 5, 14, 15, and 17
    - You are creating the equivalent for Class 8 using Attachments 12, 14, 15, and 17
    - Copy the structure, tables, and section organization, but populate with Class 8-specific content

  ---

  ## Class 8 Technical Reference

  ### Key Differences from Other Classes

  | Aspect | Class 2 | Class 4 | Class 5 | Class 6 | Class 8 |
  |--------|---------|---------|---------|---------|---------|
  | Divisions | 2.1, 2.2, 2.3 | 4.1, 4.2, 4.3 | 5.1, 5.2 | 6.1, 6.2 | **NONE** |
  | Key 13 Value | "2.1", "2.2", "2.3" | "4.1", "4.2", "4.3" | "5.1", "5.2" | "6.1", "6.2" | **Just "8"** |
  | Packing Group | Usually Empty | Required | 5.1: Yes, 5.2: No | 6.1: Yes, 6.2: No | **ALWAYS Required** |
  | Label Variants | 3 different | 3 different | 2 different | 2 different | **1 only** |
  | Packaging | A6.xx | A8.xx | A9.xx | A10.xx | **A12.xx** |

  ### Single Label - CORROSIVE

  | Class | Label | Appearance | Symbol |
  |-------|-------|------------|--------|
  | 8 | CORROSIVE | Upper half white, lower half black | Liquids dripping on hand and metal |

  **Note**: There is only ONE label for Class 8, regardless of packing group. The severity is indicated by the packing group designation, not different labels.

  ### POP Marking Packing Group Codes

  | Code | Authorized Packing Groups | Meaning |
  |------|--------------------------|---------|
  | X | I, II, III | Suitable for all packing groups |
  | Y | II, III | Suitable for PG II and III only |
  | Z | III only | Suitable for PG III only |

  **Critical Validation**:
  - A PG I corrosive in a "Y" marked package = FAILURE
  - A PG II corrosive in a "Z" marked package = FAILURE

  ### Common Class 8 Special Provisions

  | Provision | Meaning | Aircraft Restriction |
  |-----------|---------|---------------------|
  | P1 | Forbidden on passenger aircraft, CAO with restrictions | Cargo Aircraft Only |
  | P2 | Forbidden on passenger aircraft | Cargo Aircraft Only |
  | P4 | Cargo Aircraft Only | Cargo Aircraft Only |
  | P5 | Passenger and Cargo Aircraft allowed | None |
  | A3 | Limited to combination packagings | Packaging restriction |
  | A7 | Steel or aluminum not authorized | Packaging restriction |
  | N3 | Glass inner packaging not authorized | Packaging restriction |
  | N34 | Marine pollutant | Requires marking |
  | N40 | Plastic packaging only | Packaging restriction |

  ### Class 8 as Subsidiary Risk

  Class 8 (Corrosive) is one of the **most common subsidiary risks**:

  | Primary Class | Common Combination | Example Materials |
  |---------------|-------------------|-------------------|
  | 2.3 (Toxic Gas) | 2.3 + 8 | Chlorine, Phosgene, Hydrogen chloride |
  | 3 (Flammable Liquid) | 3 + 8 | Formic acid, Acetic anhydride |
  | 5.1 (Oxidizer) | 5.1 + 8 | Nitric acid, Chromium trioxide |
  | 6.1 (Toxic) | 6.1 + 8 | Phenol solutions, Arsenic trichloride |

  Understanding Class 8 requirements is essential for inspecting materials from other classes that have corrosive subsidiaries.

  ---

  ## Scenario Diversity Requirements

  Ensure the 20 scenarios cover ALL of these categories:

  ### Packing Groups (Must have all three well-represented)
  - [ ] Packing Group I - Highly Corrosive (at least 5 scenarios)
  - [ ] Packing Group II - Corrosive (at least 8 scenarios)
  - [ ] Packing Group III - Mildly Corrosive (at least 5 scenarios)

  ### Physical States
  - [ ] Corrosive liquids (majority - at least 12 scenarios)
  - [ ] Corrosive solids (at least 5 scenarios)
  - [ ] Corrosive solutions (at least 3 scenarios)

  ### Chemical Types
  - [ ] Acids (at least 6 scenarios)
  - [ ] Bases/Alkalis (at least 4 scenarios)
  - [ ] Other corrosives (cleaning compounds, battery fluids, etc.)

  ### Subsidiary Risks
  - [ ] Class 8 with 3 (Flammable) subsidiary
  - [ ] Class 8 with 5.1 (Oxidizer) subsidiary
  - [ ] Class 8 with 6.1 (Toxic) subsidiary
  - [ ] Pure Class 8 without subsidiary (majority)

  ### Special Cases
  - [ ] N.O.S. entries requiring technical names (at least 4)
  - [ ] Battery fluid/electrolyte (common military item)
  - [ ] Environmentally hazardous corrosives (marine pollutant)
  - [ ] Hypochlorite solutions (bleach/sanitizers)
  - [ ] Cleaning compounds
  - [ ] Paint removers/strippers

  ### Aircraft Limitations
  - [ ] CAO only materials (especially PG I) - at least 5 scenarios
  - [ ] Passenger and Cargo allowed - at least 8 scenarios

  ### Common Materials to Include

  **Packing Group I - Highly Corrosive:**
  - UN1830 SULFURIC ACID (>51%)
  - UN1789 HYDROCHLORIC ACID (strong concentrations)
  - UN2031 NITRIC ACID (>70%)
  - UN1824 SODIUM HYDROXIDE SOLUTION (high concentration)
  - UN1814 POTASSIUM HYDROXIDE SOLUTION
  - UN2923 CORROSIVE SOLID, TOXIC, N.O.S. (8 + 6.1)
  - UN2922 CORROSIVE LIQUID, TOXIC, N.O.S. (8 + 6.1)
  - UN1760 CORROSIVE LIQUID, N.O.S.

  **Packing Group II - Corrosive:**
  - UN1830 SULFURIC ACID (10-51%)
  - UN2796 BATTERY FLUID, ACID (sulfuric acid)
  - UN2794 BATTERY FLUID, ALKALI
  - UN1805 PHOSPHORIC ACID, LIQUID
  - UN1823 SODIUM HYDROXIDE, SOLID
  - UN2920 CORROSIVE LIQUID, FLAMMABLE, N.O.S. (8 + 3)
  - UN2921 CORROSIVE SOLID, FLAMMABLE, N.O.S. (8 + 3)
  - UN3264 CORROSIVE LIQUID, ACIDIC, INORGANIC, N.O.S.
  - UN3266 CORROSIVE LIQUID, BASIC, INORGANIC, N.O.S.
  - UN1791 HYPOCHLORITE SOLUTION
  - UN2735 AMINES, LIQUID, CORROSIVE, N.O.S.

  **Packing Group III - Mildly Corrosive:**
  - UN2797 BATTERY FLUID, ALKALI (weak)
  - UN2795 BATTERY FLUID, ACID (weak)
  - UN1760 CORROSIVE LIQUID, N.O.S. (PG III variant)
  - UN3265 CORROSIVE LIQUID, ACIDIC, ORGANIC, N.O.S.
  - UN3267 CORROSIVE LIQUID, BASIC, ORGANIC, N.O.S.
  - UN1759 CORROSIVE SOLID, N.O.S.
  - UN2584 ALKYL SULFONIC ACIDS, LIQUID
  - UN3263 CORROSIVE SOLID, BASIC, INORGANIC, N.O.S.
  - UN3261 CORROSIVE SOLID, ACIDIC, ORGANIC, N.O.S.
  - UN2586 ALKYL SULFONIC ACIDS, SOLID

  **Special Items:**
  - UN3028 BATTERY, DRY, CONTAINING POTASSIUM HYDROXIDE SOLID (if applicable)
  - UN1778 FLUOROSILICIC ACID
  - UN1802 PERCHLORIC ACID (≤50%)
  - UN1779 FORMIC ACID (8 + 3 subsidiary)
  - UN2789 ACETIC ACID, GLACIAL (8 + 3 subsidiary)

  ---

  ## Expected SDDG Keys for Class 8

  | Key | Class 8 Specifics |
  |-----|------------------|
  | Key 7 | "Cargo Aircraft Only" OR "Passenger and Cargo Aircraft" based on PG and provisions |
  | Key 11 | UN number (e.g., "UN1830") |
  | Key 12 | Full PSN with technical name for N.O.S.; may include concentration |
  | Key 13 | **"8" only** - NO divisions (not "8.1" or "8.2" - just "8") |
  | Key 14 | Subsidiary risk if applicable (e.g., "3", "5.1", "6.1", or empty) |
  | Key 15 | **ALWAYS REQUIRED**: "I", "II", or "III" |
  | Key 16 | Quantity + packaging description (e.g., "4 x 5L jerricans (3H1)") |
  | Key 17 | A12.xx paragraph |

  **Key 13 Note**: This is a critical validation point. Class 8 has NO divisions. Key 13 must show simply "8", not "8.1", "8.2", or any other variant. This is different from classes like 2, 4, 5, and 6 which require division designations.

  ---

  ## Expected Labels for Class 8

  ### Primary Label (Only One)

  | Class | Label Name | Appearance | Symbol |
  |-------|------------|------------|--------|
  | 8 | CORROSIVE | Upper half white, lower half black, "8" in bottom corner | Two test tubes dripping liquid onto hand and metal surface |

  ### Subsidiary Labels (When Applicable)

  | Subsidiary | When Required | Label Appearance |
  |------------|---------------|------------------|
  | FLAMMABLE LIQUID (3) | When Key 14 contains "3" | Red |
  | OXIDIZER (5.1) | When Key 14 contains "5.1" | Yellow |
  | TOXIC (6.1) | When Key 14 contains "6.1" | White with skull & crossbones |
  | Cargo Aircraft Only | When P1-P4 provision OR aircraft type is CAO | White with airplane |
  | Orientation (This Side Up) | **Required for ALL corrosive liquids** | Two arrows pointing up |

  ---

  ## Expected Markings for Class 8

  | Marking | Requirement |
  |---------|-------------|
  | UN Number | Required - min 12mm height (e.g., "UN1830") |
  | PSN | Required - full proper shipping name |
  | Technical Name | Required for N.O.S. entries - in parentheses |
  | Concentration | When applicable (e.g., "SULFURIC ACID, 40%") |
  | "MARINE POLLUTANT" | When N34 special provision applies |
  | Orientation Arrows | **REQUIRED for all corrosive liquids** |
  | Shipper/Consignee | Required on outer packaging |

  **Orientation Marking Critical**: Unlike some other classes where orientation is optional, corrosive liquids REQUIRE orientation arrows. This is a common inspection failure point.

  ---

  ## Alteration Ideas for Frustration Testing

  ### SDDG Alterations
  1. Key 13 shows "8.1" or "8.2" instead of just "8" (Class 8 has NO divisions)
  2. Key 15 empty (packing group ALWAYS required for Class 8)
  3. Key 15 shows wrong packing group
  4. Key 12 missing technical name for N.O.S. entry
  5. Key 12 missing concentration when applicable
  6. Key 14 empty when subsidiary risk exists
  7. Key 7 shows "Passenger and Cargo" for PG I CAO-only material
  8. Key 17 shows wrong A12.xx paragraph
  9. Key 11 transposition error (UN1830 vs UN1803)

  ### Label Alterations
  1. Missing CORROSIVE primary label entirely
  2. Wrong color scheme on CORROSIVE label
  3. Missing subsidiary hazard label (3, 5.1, or 6.1)
  4. Missing CAO label when required
  5. Wrong class number in label corner (e.g., "6" instead of "8")
  6. Missing orientation labels for corrosive liquid

  ### Marking Alterations
  1. UN number missing or incorrect
  2. PSN abbreviated (e.g., "SULF. ACID" instead of full name)
  3. Technical name missing for N.O.S.
  4. Concentration missing when required
  5. Orientation arrows missing for corrosive liquid
  6. "MARINE POLLUTANT" missing when required
  7. Wrong orientation (arrows pointing sideways)

  ### POP Marking Alterations
  1. Packing group code "Z" for PG II corrosive (incompatible)
  2. Packing group code "Y" for PG I corrosive (incompatible)
  3. Invalid packaging code for A12.xx paragraph
  4. Missing POP marking entirely
  5. Packaging material incompatible with contents (e.g., metal for strong acid)

  ---

  ## Output Requirements

  Write the complete test scenarios document to:
  docs/plans/2026-XX-XX-class8-test-scenarios-design.md
  (Replace XX-XX with the current date)

  ### Document Structure (follow src/testScenarios/class1.md format)

  1. **Overview Section**
     - Purpose of the document
     - What each scenario includes
     - Class 8 reference (note: NO divisions)
     - Packing group classification table
     - Acid vs Base reference
     - Key validation points summary
     - Key differences from other classes

  2. **Scenarios 1-20** (organized by packing group and type)
     - Scenarios 1-6: Packing Group I (Highly Corrosive)
       - Include acids and bases
     - Scenarios 7-14: Packing Group II (Corrosive)
       - Include acids, bases, battery fluids
     - Scenarios 15-20: Packing Group III (Mildly Corrosive)
       - Include various corrosive types

     Each scenario with:
     - Material Details table
     - Expected SDDG Inspection table (Keys 7, 11-17)
     - Expected Package Inspection (Labels, Markings, POP Marking)
     - Alterations table (3 alterations per scenario)

  3. **Quick Reference Tables**
     - Alteration categories covered
     - Packing group coverage
     - Physical state coverage (liquid vs solid)
     - Chemical type coverage (acid vs base vs other)
     - Subsidiary risk coverage
     - Special features coverage (N.O.S., battery fluids, marine pollutant)
     - Packaging paragraph coverage (A12.xx)

  4. **Test Execution Notes**
     - Before testing checklist
     - During testing guidance
     - Key Class 8 considerations (especially no-division validation)
     - Orientation label requirements for liquids
     - Material compatibility notes
     - After testing summary requirements

  ---

  ## Process Checklist

  Before writing scenarios, complete this research:

  - [ ] Read `docs/architecture/inspector-workflow-and-ml-detection.md` (understand workflow)
  - [ ] Read `src/testScenarios/class1.md` (understand format)
  - [ ] Read `docs/attachment12/afmanAttachment12.pdf` (Class 8 packaging)
  - [ ] Read `docs/attachment14/attachment14.pdf` (marking requirements)
  - [ ] Read `docs/attachment15/attachment15.pdf` (labeling requirements)
  - [ ] Read `server/attachment17/attachment17.pdf` (SDDG requirements)
  - [ ] Search `src/hazardousMaterials/hazardousMaterialsList.ts` for Class 8 materials
  - [ ] Review `src/utils/labelingRequirementsInspector.tsx`
  - [ ] Review `src/utils/markingRequirementsInspector.ts`
  - [ ] Select 20 diverse materials covering all packing groups
  - [ ] Write all 20 scenarios
  - [ ] Add quick reference tables
  - [ ] Add test execution notes

  ---

  ## Important Notes

  1. **NO DIVISIONS - This is Critical** - Class 8 is unique among the major hazard classes:
     - Key 13 must show simply **"8"**
     - NOT "8.1", "8.2", or any division
     - This is a major validation point - any division designation is an ERROR
     - Compare to Class 4 (4.1, 4.2, 4.3) or Class 6 (6.1, 6.2) which require divisions

  2. **Packing Group is ALWAYS Required** - Unlike some classes where PG may be empty:
     - Key 15 MUST contain "I", "II", or "III"
     - Missing packing group is a critical validation failure
     - PG determines severity and affects packaging requirements

  3. **Single Label Type** - Only ONE label design for Class 8:
     - CORROSIVE (white/black with dripping liquid symbol)
     - Severity is indicated by packing group designation, not different labels
     - This differs from Class 4 (three different labels) or Class 2 (three different labels)

  4. **Orientation Labels are MANDATORY for Liquids** - This is often overlooked:
     - ALL corrosive liquids require orientation arrows
     - Missing orientation is a common inspection failure
     - Includes solutions, not just pure liquids

  5. **Battery Fluid is Common Military Item** - Include scenarios for:
     - UN2796 BATTERY FLUID, ACID
     - UN2794 BATTERY FLUID, ALKALI
     - These are frequently shipped and inspected

  6. **Class 8 as Subsidiary is Very Common** - Understanding Class 8 helps with:
     - Class 2.3 toxic gases (often have 8 subsidiary)
     - Class 6.1 toxic substances (often have 8 subsidiary)
     - Class 3 flammable liquids (some have 8 subsidiary)
     - When 8 is subsidiary, still need CORROSIVE subsidiary label

  7. **N.O.S. Entries are Numerous** - Class 8 has many generic entries:
     - UN1760 CORROSIVE LIQUID, N.O.S.
     - UN1759 CORROSIVE SOLID, N.O.S.
     - UN3264/3265/3266/3267 (acidic/basic, organic/inorganic variants)
     - UN2920/2921/2922/2923 (flammable/toxic combinations)

     ALL require technical names in Key 12 and markings.

  8. **Concentration May Be Part of PSN** - Some corrosives include concentration:
     - "SULFURIC ACID, 40%"
     - "NITRIC ACID, other than red fuming, with more than 70% acid"
     - Concentration affects packing group assignment

  9. **Material Compatibility** - Some corrosives have packaging restrictions:
     - Strong acids may corrode metal packaging
     - N40 provision: Plastic packaging only
     - A7 provision: Steel or aluminum not authorized
     - N3 provision: Glass inner packaging not authorized

  10. **Use subagents for parallel research** - Read multiple PDF attachments and source files in parallel to speed up research phase.

  11. **Acids vs Bases** - Include both types:
      - Acids (low pH): Sulfuric, Hydrochloric, Nitric, Phosphoric
      - Bases (high pH): Sodium hydroxide, Potassium hydroxide, Ammonia solutions
      - Both are equally "corrosive" from a regulatory standpoint