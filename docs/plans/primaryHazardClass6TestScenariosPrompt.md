  # Prompt: Create Class 6 (Toxic and Infectious Substances) Test Scenarios

  Use this prompt with a new Claude Code instance to generate comprehensive test scenarios for Class 6 hazardous materials.

  ---

  ## Task Overview

  This is a mobile app used for hazardous material inspection. The Inspector persona workflow is defined in `docs/architecture/inspector-workflow-and-ml-detection.md`. Read this file first to understand the inspection workflow. The application's business logic is built on AFMAN 24-604.

  Create 20 comprehensive test scenarios for Class 6 hazardous materials. These are **manual test scenarios** - you will physically run through the app with these scenarios, not automated Jest tests.

  Each test scenario must include:
  1. **Material Details**: UN number, PSN, hazard class/division, packing group (6.1) or category (6.2), packaging paragraph, special provisions
  2. **Expected SDDG Inspection (Successful)**: What each SDDG Key should contain for a passing inspection
  3. **Expected Package Inspection (Successful)**: Required labels, markings, and POP marking validation
  4. **Alterations**: 2-3 intentional errors per scenario to test frustration handling (e.g., missing labels, wrong SDDG fields, incorrect packaging codes, wrong packing group on POP marking)

  ---

  ## Class 6 Division Overview

  **CRITICAL**: Class 6 has TWO fundamentally different divisions:

  | Division | Name | Hazard | Label | Classification System |
  |----------|------|--------|-------|----------------------|
  | 6.1 | Toxic Substances | Poison - harmful if swallowed, inhaled, or skin contact | White with skull & crossbones | **Packing Groups I, II, III** |
  | 6.2 | Infectious Substances | Contains pathogens - bacteria, viruses, etc. | White with biohazard symbol | **Categories A and B** (NO Packing Groups) |

  ### Division 6.1 - Toxic Substances (Poisons)
  Materials that are:
  - Liable to cause death or serious injury if swallowed, inhaled, or absorbed through skin
  - Classified by toxicity measurements (LD50, LC50)

  **Classification by Packing Group (based on toxicity):**

  | Packing Group | Oral LD50 (mg/kg) | Dermal LD50 (mg/kg) | Inhalation LC50 (mg/L) | Hazard Level |
  |---------------|-------------------|---------------------|------------------------|--------------|
  | PG I | ≤5 | ≤50 | ≤0.2 (dusts/mists) | **Highly Toxic** |
  | PG II | >5 to ≤50 | >50 to ≤200 | >0.2 to ≤2 | **Toxic** |
  | PG III | >50 to ≤300 | >200 to ≤1000 | >2 to ≤4 | **Harmful** |

  **Inhalation Hazard**: Some Division 6.1 materials have inhalation toxicity and require:
  - "POISON INHALATION HAZARD" or "TOXIC INHALATION HAZARD" marking
  - Similar to Class 2.3 toxic gases
  - May have Hazard Zone designations (A, B, C, D)

  ### Division 6.2 - Infectious Substances
  Materials known or reasonably expected to contain **pathogens** (disease-causing microorganisms):
  - Bacteria, viruses, rickettsiae, parasites, fungi
  - Prions
  - Other agents (genetically modified organisms, biological products)

  **Classification by Category (NOT Packing Groups):**

  | Category | UN Number | Criteria | Risk Level |
  |----------|-----------|----------|------------|
  | **Category A** | UN2814 (humans) | Capable of causing permanent disability, life-threatening or fatal disease in healthy humans/animals | **Highest Risk** |
  | **Category A** | UN2900 (animals) | Capable of causing permanent disability, life-threatening or fatal disease in animals | **Highest Risk** |
  | **Category B** | UN3373 | Does not meet Category A criteria | Lower Risk |

  **Examples:**
  - Category A: Ebola virus, Anthrax (cultures), HIV (cultures), Rabies virus
  - Category B: Diagnostic specimens, most patient samples, non-cultured materials

  ---

  ## Required Research

  Before writing the scenarios, you MUST read and analyze these AFMAN 24-604 attachments:

  ### Primary Source - Class 6 Packaging
  1. **Attachment 10** (`docs/attachment10/afmanAttachment10.pdf`) - Packaging instructions for Class 6
     - Contains A10.xx paragraphs with allowed packaging codes
     - A10.1: General requirements for toxic substances
     - A10.2: Division 6.1 Toxic Substances packaging (by packing group)
     - A10.3: Division 6.1 Toxic substances by inhalation
     - A10.4: Division 6.2 Infectious Substances packaging
     - Triple packaging requirements for 6.2 (primary, secondary, outer)
     - Packing Instructions P620 (Category A) and P650 (Category B)
     - Quantity limitations

  ### Supporting Sources (Same as other classes)
  2. **Attachment 14** (`docs/attachment14/attachment14.pdf`) - Marking requirements
     - PSN and UN Number marking requirements (12mm minimum height)
     - "POISON" or "TOXIC" marking for 6.1
     - "INHALATION HAZARD" marking for inhalation toxics
     - "INFECTIOUS SUBSTANCE" marking for 6.2 Category A
     - "BIOLOGICAL SUBSTANCE, CATEGORY B" marking for UN3373
     - "MARINE POLLUTANT" marking if applicable
     - Shipper/consignee name and address requirements (critical for 6.2)

  3. **Attachment 15** (`docs/attachment15/attachment15.pdf`) - Labeling requirements
     - TOXIC label (Division 6.1) - White with skull and crossbones
     - INFECTIOUS SUBSTANCE label (Division 6.2) - White with biohazard symbol
     - "PG III" label variant considerations for low-toxicity 6.1
     - Subsidiary hazard labels (3 Flammable, 8 Corrosive, etc.)
     - Cargo Aircraft Only labels
     - Orientation labels (required for liquids and 6.2)

  4. **Attachment 17** (`server/attachment17/attachment17.pdf`) - SDDG certification requirements
     - Table A17.1 with all Keys 1-22
     - Key 7: Aircraft Limitations
     - Key 11: UN Number
     - Key 12: PSN (with technical name for N.O.S.; scientific name for 6.2)
     - Key 13: Class and Division (6.1 or 6.2)
     - Key 14: Subsidiary Risk
     - Key 15: Packing Group (for 6.1 ONLY - empty for 6.2)
     - Key 16: Quantity and Type of Packing
     - Key 17: Packaging Instructions (A10.xx for Class 6)
     - Key 20: Emergency contact information (especially important for 6.2)

  ### Code Sources
  Also read these source files to understand the app's data and logic:
  - `src/hazardousMaterials/hazardousMaterialsList.ts` - Find diverse Class 6 materials from Table A4.1
  - `src/utils/labelingRequirementsInspector.tsx` - Understand labeling logic
  - `src/utils/markingRequirementsInspector.ts` - Understand marking logic
  - `server/lookupFunctions/packagingLookupV2.ts` - Understand packaging validation

  ### Reference Format
  - **`src/testScenarios/class1.md`** - Use this as your FORMAT REFERENCE for how scenarios should be structured
    - NOTE: This document is for Class 1 (Explosives) using Attachments 5, 14, 15, and 17
    - You are creating the equivalent for Class 6 using Attachments 10, 14, 15, and 17
    - Copy the structure, tables, and section organization, but populate with Class 6-specific content

  ---

  ## Class 6 Technical Reference

  ### Key Differences from Other Classes

  | Aspect | Class 1 | Class 4 | Class 5 | Class 6 |
  |--------|---------|---------|---------|---------|
  | Divisions | 1.1-1.6 | 4.1, 4.2, 4.3 | 5.1, 5.2 | 6.1, 6.2 |
  | Key 15 | Empty | Required | 5.1: Required, 5.2: Empty | **6.1: Required, 6.2: Empty** |
  | Classification | Compat Groups | Hazard Type | PG vs Type | **PG (6.1) vs Category (6.2)** |
  | Special Marking | EX Number | Division-specific | Temp control (5.2) | **POISON/INHALATION HAZARD (6.1), INFECTIOUS (6.2)** |
  | Packaging Paragraph | A5.xx | A8.xx | A9.xx | A10.xx |

  ### Division 6.1 - Labels by Toxicity

  | Packing Group | Primary Label | Common Marking |
  |---------------|---------------|----------------|
  | PG I | TOXIC (skull & crossbones) | "POISON" or "TOXIC" |
  | PG II | TOXIC (skull & crossbones) | "POISON" or "TOXIC" |
  | PG III | TOXIC (or HARMFUL in some regions) | May use "HARMFUL" |

  **Inhalation Hazard Materials (6.1):**
  - Require "POISON INHALATION HAZARD" or "TOXIC INHALATION HAZARD" marking
  - May have Hazard Zone (A, B, C, D) in PSN
  - Similar requirements to Class 2.3 toxic gases

  ### Division 6.2 - Categories and Labels

  | Category | UN Number | Label | Key Marking |
  |----------|-----------|-------|-------------|
  | A (Humans) | UN2814 | INFECTIOUS SUBSTANCE | "INFECTIOUS SUBSTANCE, AFFECTING HUMANS" |
  | A (Animals) | UN2900 | INFECTIOUS SUBSTANCE | "INFECTIOUS SUBSTANCE, AFFECTING ANIMALS only" |
  | B | UN3373 | None (marking only) | "BIOLOGICAL SUBSTANCE, CATEGORY B" (in diamond) |

  **Triple Packaging for 6.2:**
  1. **Primary receptacle** - Watertight, contains the specimen
  2. **Secondary packaging** - Watertight, contains absorbent material
  3. **Outer packaging** - Rigid, meets drop test requirements

  ### POP Marking Packing Group Codes (Division 6.1 Only)

  | Code | Authorized Packing Groups | Meaning |
  |------|--------------------------|---------|
  | X | I, II, III | Suitable for all packing groups |
  | Y | II, III | Suitable for PG II and III only |
  | Z | III only | Suitable for PG III only |

  **Note**: Division 6.2 Infectious Substances do not use packing groups or POP marking codes - they use specific packaging instructions (P620 for Category A, P650 for Category B).

  ---

  ## Scenario Diversity Requirements

  Ensure the 20 scenarios cover ALL of these categories:

  ### Divisions (Must have both represented)
  - [ ] Division 6.1 Toxic Substances (at least 14 scenarios)
  - [ ] Division 6.2 Infectious Substances (at least 5 scenarios)

  ### Division 6.1 Packing Groups (Must have all three)
  - [ ] Packing Group I - Highly Toxic (at least 3 scenarios)
  - [ ] Packing Group II - Toxic (at least 5 scenarios)
  - [ ] Packing Group III - Harmful (at least 4 scenarios)

  ### Division 6.1 Route of Exposure
  - [ ] Oral toxicity materials
  - [ ] Dermal (skin) toxicity materials
  - [ ] Inhalation toxicity materials (with "INHALATION HAZARD" marking)

  ### Division 6.2 Categories
  - [ ] Category A - UN2814 (affecting humans) - at least 2 scenarios
  - [ ] Category A - UN2900 (affecting animals) - at least 1 scenario
  - [ ] Category B - UN3373 - at least 2 scenarios

  ### Subsidiary Risks
  - [ ] 6.1 with 3 (Flammable) subsidiary
  - [ ] 6.1 with 8 (Corrosive) subsidiary
  - [ ] 6.1 with both flammable and corrosive subsidiaries
  - [ ] Pure Class 6 without subsidiary (majority)

  ### Special Cases
  - [ ] N.O.S. entries requiring technical names (at least 4)
  - [ ] Inhalation hazard materials with Zone designation
  - [ ] Pesticides/Insecticides (common 6.1 materials)
  - [ ] Cyanide compounds
  - [ ] Arsenic compounds
  - [ ] Medical/clinical waste (6.2)
  - [ ] Diagnostic specimens (6.2 Category B)
  - [ ] Marine pollutant materials

  ### Aircraft Limitations
  - [ ] CAO only materials (especially PG I) - at least 5 scenarios
  - [ ] Passenger and Cargo allowed - at least 6 scenarios
  - [ ] Note quantity limitations for 6.2

  ### Physical States
  - [ ] Solid toxic substances
  - [ ] Liquid toxic substances
  - [ ] Toxic solutions
  - [ ] Infectious substances (liquid specimens, cultures)

  ### Common Materials to Include by Division

  **Division 6.1 - Toxic Substances (PG I - Highly Toxic):**
  - UN1556 ARSENIC COMPOUND, LIQUID, N.O.S. (technical name required)
  - UN1557 ARSENIC COMPOUND, SOLID, N.O.S.
  - UN1680 POTASSIUM CYANIDE, SOLID
  - UN1689 SODIUM CYANIDE, SOLID
  - UN2810 TOXIC LIQUID, ORGANIC, N.O.S. (PG I variant)
  - UN3381 TOXIC BY INHALATION LIQUID, N.O.S. (Inhalation Hazard Zone A)
  - UN3382 TOXIC BY INHALATION LIQUID, N.O.S. (Inhalation Hazard Zone B)
  - UN1583 CHLOROPICRIN MIXTURE, N.O.S.

  **Division 6.1 - Toxic Substances (PG II - Toxic):**
  - UN1593 DICHLOROMETHANE (Methylene chloride)
  - UN2810 TOXIC LIQUID, ORGANIC, N.O.S. (PG II variant)
  - UN2811 TOXIC SOLID, ORGANIC, N.O.S.
  - UN3288 TOXIC SOLID, INORGANIC, N.O.S.
  - UN2927 TOXIC LIQUID, CORROSIVE, ORGANIC, N.O.S. (6.1 + 8)
  - UN3289 TOXIC LIQUID, CORROSIVE, INORGANIC, N.O.S.
  - UN2929 TOXIC LIQUID, FLAMMABLE, ORGANIC, N.O.S. (6.1 + 3)
  - UN1602 DYE, LIQUID, TOXIC, N.O.S.

  **Division 6.1 - Toxic Substances (PG III - Harmful):**
  - UN2810 TOXIC LIQUID, ORGANIC, N.O.S. (PG III variant)
  - UN2811 TOXIC SOLID, ORGANIC, N.O.S. (PG III variant)
  - UN3077 ENVIRONMENTALLY HAZARDOUS SUBSTANCE, SOLID, N.O.S.
  - UN3082 ENVIRONMENTALLY HAZARDOUS SUBSTANCE, LIQUID, N.O.S.
  - UN2588 PESTICIDE, SOLID, TOXIC, N.O.S.
  - UN2902 PESTICIDE, LIQUID, TOXIC, N.O.S.
  - UN1851 MEDICINE, LIQUID, TOXIC, N.O.S.
  - UN3249 MEDICINE, SOLID, TOXIC, N.O.S.

  **Division 6.2 - Infectious Substances:**
  - UN2814 INFECTIOUS SUBSTANCE, AFFECTING HUMANS (Category A)
  - UN2900 INFECTIOUS SUBSTANCE, AFFECTING ANIMALS only (Category A)
  - UN3373 BIOLOGICAL SUBSTANCE, CATEGORY B
  - UN3291 CLINICAL WASTE, UNSPECIFIED, N.O.S. (regulated medical waste)

  ---

  ## Expected SDDG Keys for Class 6

  ### For Division 6.1 (Toxic Substances)

  | Key | Division 6.1 Specifics |
  |-----|----------------------|
  | Key 7 | "Cargo Aircraft Only" OR "Passenger and Cargo Aircraft" based on PG and provisions |
  | Key 11 | UN number (e.g., "UN2810") |
  | Key 12 | Full PSN with technical name for N.O.S.; may include "INHALATION HAZARD, ZONE X" |
  | Key 13 | "6.1" |
  | Key 14 | Subsidiary risk if applicable (e.g., "3", "8", or empty) |
  | Key 15 | **REQUIRED**: "I", "II", or "III" |
  | Key 16 | Quantity + packaging description |
  | Key 17 | A10.xx paragraph |
  | Key 20 | Emergency contact (recommended for highly toxic) |

  ### For Division 6.2 (Infectious Substances)

  | Key | Division 6.2 Specifics |
  |-----|----------------------|
  | Key 7 | Often "Cargo Aircraft Only" for Category A; Category B may allow passenger |
  | Key 11 | UN number: UN2814, UN2900, or UN3373 |
  | Key 12 | Full PSN (e.g., "INFECTIOUS SUBSTANCE, AFFECTING HUMANS") with scientific name of pathogen if known |
  | Key 13 | "6.2" |
  | Key 14 | Usually empty (subsidiaries rare for 6.2) |
  | Key 15 | **EMPTY** (infectious substances don't have packing groups) |
  | Key 16 | Quantity + packaging description (must meet P620 or P650) |
  | Key 17 | A10.xx paragraph (typically A10.4.x) |
  | Key 20 | **CRITICAL** - Emergency contact with 24-hour availability |

  ---

  ## Expected Labels for Class 6

  ### Division 6.1 Labels

  | Packing Group | Primary Label | Symbol |
  |---------------|---------------|--------|
  | PG I | TOXIC | Skull and crossbones on white |
  | PG II | TOXIC | Skull and crossbones on white |
  | PG III | TOXIC (or HARMFUL) | Skull and crossbones (or St. Andrew's cross) |

  ### Division 6.2 Labels

  | Category | Label Requirement | Appearance |
  |----------|------------------|------------|
  | A (UN2814, UN2900) | INFECTIOUS SUBSTANCE | Biohazard symbol on white |
  | B (UN3373) | **NO LABEL** - Marking only | Diamond marking with "UN3373" |

  ### Subsidiary Labels

  | Subsidiary | When Required |
  |------------|---------------|
  | FLAMMABLE LIQUID (3) - Red | When Key 14 contains "3" |
  | CORROSIVE (8) - White/Black | When Key 14 contains "8" |
  | Cargo Aircraft Only | When P1-P4 special provision OR aircraft type is CAO |
  | Orientation (This Side Up) | For liquids, ALL 6.2 materials |

  ---

  ## Expected Markings for Class 6

  ### Division 6.1 Markings

  | Marking | Requirement |
  |---------|-------------|
  | UN Number | Required - min 12mm height (e.g., "UN2810") |
  | PSN | Required - full proper shipping name |
  | Technical Name | Required for N.O.S. entries - in parentheses |
  | "POISON" or "TOXIC" | Required for PG I and II (may be required for PG III) |
  | "INHALATION HAZARD" | Required for inhalation toxic materials |
  | "MARINE POLLUTANT" | When applicable |
  | Orientation Arrows | For liquids |

  ### Division 6.2 Markings

  | Marking | Category A | Category B |
  |---------|------------|------------|
  | UN Number | "UN2814" or "UN2900" | "UN3373" in diamond |
  | PSN | "INFECTIOUS SUBSTANCE, AFFECTING HUMANS/ANIMALS" | "BIOLOGICAL SUBSTANCE, CATEGORY B" |
  | Scientific Name | If known (e.g., "Bacillus anthracis") | If known |
  | Shipper Name/Address | **REQUIRED** | **REQUIRED** |
  | Consignee Name/Address | **REQUIRED** | **REQUIRED** |
  | Responsible Person Contact | **REQUIRED** - 24hr availability | **REQUIRED** |
  | Orientation Arrows | **REQUIRED** | **REQUIRED** |

  **UN3373 Special Marking:**
  - Diamond-shaped marking (minimum 50mm x 50mm)
  - Contains "UN3373"
  - No hazard label required
  - "BIOLOGICAL SUBSTANCE, CATEGORY B" text near diamond

  ---

  ## Alteration Ideas for Frustration Testing

  ### SDDG Alterations
  1. Key 13 shows "6" instead of "6.1" or "6.2" (division required)
  2. Key 13 shows wrong division (e.g., "6.1" for infectious substance)
  3. Key 15 empty for 6.1 material (packing group required for toxic substances)
  4. Key 15 populated for 6.2 material (infectious substances don't have PG)
  5. Key 15 shows wrong packing group for 6.1 material
  6. Key 12 missing technical name for N.O.S. entry
  7. Key 12 missing "INHALATION HAZARD, ZONE X" for inhalation toxic
  8. Key 14 empty when subsidiary risk exists
  9. Key 7 shows "Passenger and Cargo" for CAO-only material
  10. Key 17 shows wrong A10.xx paragraph
  11. Key 20 missing emergency contact for 6.2 material

  ### Label Alterations
  1. Wrong division label (TOXIC on infectious substance or vice versa)
  2. Missing primary hazard label entirely
  3. Using INFECTIOUS SUBSTANCE label on UN3373 (should be marking only)
  4. Missing subsidiary hazard label (3 or 8)
  5. Missing CAO label when required
  6. Missing orientation labels for liquids or 6.2 materials

  ### Marking Alterations
  1. UN number missing or incorrect
  2. PSN abbreviated or incomplete
  3. Technical name missing for N.O.S.
  4. "POISON" or "TOXIC" marking missing for PG I/II material
  5. "INHALATION HAZARD" marking missing for inhalation toxic
  6. UN3373 diamond marking missing or wrong size
  7. Shipper/consignee information missing for 6.2
  8. Emergency contact missing for Category A infectious

  ### POP Marking Alterations (6.1 Only)
  1. Packing group code "Z" for PG II toxic (incompatible)
  2. Packing group code "Y" for PG I toxic (incompatible)
  3. Invalid packaging code for A10.xx paragraph
  4. Missing POP marking entirely

  ### 6.2 Packaging Alterations
  1. Not using triple packaging system
  2. Missing absorbent material in secondary packaging
  3. Primary receptacle not watertight
  4. Outer packaging not meeting rigidity requirements
  5. Not using P620 (Category A) or P650 (Category B) compliant packaging

  ---

  ## Output Requirements

  Write the complete test scenarios document to:
  docs/plans/2026-XX-XX-class6-test-scenarios-design.md
  (Replace XX-XX with the current date)

  ### Document Structure (follow src/testScenarios/class1.md format)

  1. **Overview Section**
     - Purpose of the document
     - What each scenario includes
     - Class 6 Division reference table (6.1 vs 6.2)
     - Division 6.1 Packing Group toxicity table
     - Division 6.2 Category reference table
     - Key validation points summary
     - Key differences from other classes

  2. **Scenarios 1-20** (organized by division and severity)
     - Scenarios 1-14: Division 6.1 Toxic Substances
       - Scenarios 1-4: PG I (Highly Toxic)
       - Scenarios 5-9: PG II (Toxic)
       - Scenarios 10-14: PG III (Harmful)
     - Scenarios 15-20: Division 6.2 Infectious Substances
       - Scenarios 15-17: Category A (UN2814, UN2900)
       - Scenarios 18-20: Category B (UN3373)

     Each scenario with:
     - Material Details table
     - Expected SDDG Inspection table (Keys 7, 11-17, 20)
     - Expected Package Inspection (Labels, Markings, POP Marking or Triple Packaging)
     - Alterations table (3 alterations per scenario)

  3. **Quick Reference Tables**
     - Alteration categories covered
     - Division coverage
     - Packing group coverage (6.1)
     - Category coverage (6.2)
     - Route of exposure coverage (oral, dermal, inhalation)
     - Special features coverage (N.O.S., subsidiaries, inhalation hazard, etc.)
     - Packaging paragraph coverage (A10.xx)

  4. **Test Execution Notes**
     - Before testing checklist
     - During testing guidance
     - Key Class 6 considerations (especially 6.1 vs 6.2 differences)
     - Triple packaging verification for 6.2
     - Inhalation hazard special requirements
     - After testing summary requirements

  ---

  ## Process Checklist

  Before writing scenarios, complete this research:

  - [ ] Read `docs/architecture/inspector-workflow-and-ml-detection.md` (understand workflow)
  - [ ] Read `src/testScenarios/class1.md` (understand format)
  - [ ] Read `docs/attachment10/afmanAttachment10.pdf` (Class 6 packaging - both divisions)
  - [ ] Read `docs/attachment14/attachment14.pdf` (marking requirements)
  - [ ] Read `docs/attachment15/attachment15.pdf` (labeling requirements)
  - [ ] Read `server/attachment17/attachment17.pdf` (SDDG requirements)
  - [ ] Search `src/hazardousMaterials/hazardousMaterialsList.ts` for Class 6 materials (6.1 and 6.2)
  - [ ] Review `src/utils/labelingRequirementsInspector.tsx`
  - [ ] Review `src/utils/markingRequirementsInspector.ts`
  - [ ] Select 20 diverse materials covering both divisions
  - [ ] Write all 20 scenarios
  - [ ] Add quick reference tables
  - [ ] Add test execution notes

  ---

  ## Important Notes

  1. **Division Classification is Fundamentally Different** - Critical distinction:
     - Division 6.1 (Toxic): Uses **Packing Groups I, II, III** → Key 15 REQUIRED
     - Division 6.2 (Infectious): Uses **Categories A and B** → Key 15 EMPTY

     This mirrors the Class 5 pattern (5.1 has PG, 5.2 doesn't).

  2. **UN3373 is Special** - Category B infectious substances:
     - Do NOT get a hazard label
     - Get a diamond-shaped MARKING with "UN3373"
     - Get "BIOLOGICAL SUBSTANCE, CATEGORY B" text marking
     - This is a common error - applying label when only marking is required

  3. **Inhalation Hazard Materials** - Some 6.1 materials have inhalation toxicity:
     - Require "POISON INHALATION HAZARD" or "TOXIC INHALATION HAZARD" marking
     - May have Zone designation (A, B, C, D) in PSN/Key 12
     - Similar treatment to Class 2.3 toxic gases
     - Examples: UN3381, UN3382, UN3383, UN3384

  4. **Triple Packaging for 6.2** - ALL infectious substances require:
     - Primary receptacle (watertight)
     - Secondary packaging (watertight, with absorbent)
     - Outer packaging (rigid)

     This is not negotiable and different from other classes.

  5. **Emergency Contact is Critical for 6.2** - Key 20 must contain:
     - 24-hour emergency contact
     - Person knowledgeable about shipment contents
     - Phone number that will be answered

     Missing this is a serious violation for infectious substances.

  6. **6.1 as Subsidiary Risk is Common** - Many materials in other classes have 6.1 (Toxic) as subsidiary:
     - Class 2.3 toxic gases (primary hazard)
     - Class 3 flammable liquids with 6.1 subsidiary
     - Class 8 corrosives with 6.1 subsidiary

     Understanding 6.1 helps with other class inspections.

  7. **N.O.S. Entries are Numerous** - Class 6.1 has many generic entries:
     - UN2810/2811 TOXIC LIQUID/SOLID, ORGANIC, N.O.S.
     - UN3287/3288 TOXIC LIQUID/SOLID, INORGANIC, N.O.S.
     - UN2927/3289 TOXIC LIQUID, CORROSIVE, ORGANIC/INORGANIC, N.O.S.
     - UN2929/3290 TOXIC LIQUID, FLAMMABLE, ORGANIC/INORGANIC, N.O.S.

     ALL require technical names in Key 12 and markings.

  8. **Pesticides** - Large category within 6.1:
     - UN2588 PESTICIDE, SOLID, TOXIC, N.O.S.
     - UN2902 PESTICIDE, LIQUID, TOXIC, N.O.S.
     - Various packing groups based on active ingredient toxicity
     - Technical name must identify active ingredient(s)

  9. **Use subagents for parallel research** - Read multiple PDF attachments and source files in parallel to speed up research phase.

  10. **Different Labels for Each Division**:
      - 6.1: TOXIC (skull and crossbones on white)
      - 6.2: INFECTIOUS SUBSTANCE (biohazard symbol on white)
      - UN3373: NO LABEL - diamond marking only

      Mixing these up is a critical error.

  11. **Orientation Labels** - Required for:
      - All liquid toxic substances (6.1 liquids)
      - ALL Division 6.2 materials (even if contents appear solid)
      - Missing orientation is a common oversight