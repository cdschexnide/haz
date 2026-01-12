  # Prompt: Create Class 9 (Miscellaneous Dangerous Goods) Test Scenarios

  Use this prompt with a new Claude Code instance to generate comprehensive test scenarios for Class 9 hazardous materials.

  ---

  ## Task Overview

  This is a mobile app used for hazardous material inspection. The Inspector persona workflow is defined in `docs/architecture/inspector-workflow-and-ml-detection.md`. Read this file first to understand the inspection workflow. The application's business logic is built on AFMAN 24-604.

  Create 20 comprehensive test scenarios for Class 9 hazardous materials. These are **manual test scenarios** - you will physically run through the app with these scenarios, not automated Jest tests.

  Each test scenario must include:
  1. **Material Details**: UN number, PSN, hazard class, packing group (if applicable), packaging paragraph, special provisions
  2. **Expected SDDG Inspection (Successful)**: What each SDDG Key should contain for a passing inspection
  3. **Expected Package Inspection (Successful)**: Required labels, markings, and POP marking validation
  4. **Alterations**: 2-3 intentional errors per scenario to test frustration handling (e.g., missing labels, wrong SDDG fields, incorrect packaging codes, wrong packing group on POP marking)

  ---

  ## Class 9 Overview

  **IMPORTANT**: Class 9 is the "miscellaneous" or "catch-all" class for hazardous materials that:
  - Present a danger during air transport
  - Do not meet the definitions of Classes 1-8
  - Have **NO DIVISIONS** (like Class 8)

  | Class | Name | Hazard | Label | Classification |
  |-------|------|--------|-------|----------------|
  | 9 | Miscellaneous Dangerous Goods | Various hazards not covered by Classes 1-8 | White with black stripes | **Packing Groups II, III, or NONE** |

  ### What Are Class 9 Materials?

  A diverse category including:
  - **Lithium batteries** (ion and metal)
  - **Dry ice** (solid carbon dioxide)
  - **Magnetized materials** (affect aircraft instruments)
  - **Environmentally hazardous substances** (marine pollutants)
  - **Elevated temperature materials** (hot liquids/solids)
  - **Vehicles and engines** (contain fuel, batteries)
  - **Air bag modules and seat belt pretensioners**
  - **Life-saving appliances** (self-inflating)
  - **Asbestos**
  - **Genetically modified organisms (GMOs)**
  - **Polychlorinated biphenyls (PCBs)**

  ### Packing Group Variations

  **CRITICAL**: Unlike Class 8 where PG is always required, Class 9 has MIXED requirements:

  | Material Type | Packing Group | Key 15 |
  |---------------|---------------|--------|
  | Environmentally hazardous (UN3077, UN3082) | III | Required |
  | Elevated temperature materials | III | Required |
  | Some N.O.S. entries | II or III | Required |
  | **Lithium batteries** | **NONE** | **Empty** |
  | **Dry ice (UN1845)** | **NONE** | **Empty** |
  | **Magnetized material (UN2807)** | **NONE** | **Empty** |
  | **Vehicles/Engines** | **NONE** | **Empty** |
  | **Air bag modules** | **NONE** | **Empty** |

  ---

  ## Required Research

  **CRITICAL**: The PDF attachments are the **SOURCE OF TRUTH** for all regulatory requirements. When in doubt, the PDF content takes precedence over any other source.

  Before writing the scenarios, you MUST read and analyze these AFMAN 24-604 attachments:

  ### Primary Source - Class 9 Packaging
  1. **Attachment 13** (`docs/attachment13/afmanAttachment13.pdf`) - Packaging instructions for Class 9
     - **This PDF is authoritative** - read it thoroughly
     - Contains A13.xx paragraphs with allowed packaging codes
     - A13.1: General requirements for miscellaneous dangerous goods
     - A13.2: Specific packaging by material type
     - **Lithium battery packaging requirements** (critical section)
     - Dry ice packaging requirements
     - Magnetized material requirements
     - Elevated temperature material requirements
     - Vehicle and engine requirements

  ### Supporting Sources (Same as other classes)
  2. **Attachment 14** (`docs/attachment14/attachment14.pdf`) - Marking requirements
     - **PDF is authoritative** - verify all marking requirements here
     - PSN and UN Number marking requirements (12mm minimum height)
     - **Lithium battery mark** (critical for batteries)
     - **"MARINE POLLUTANT"** marking
     - **"HOT"** marking for elevated temperature materials
     - Orientation marking requirements

  3. **Attachment 15** (`docs/attachment15/attachment15.pdf`) - Labeling requirements
     - **PDF is authoritative** - verify all labeling requirements here
     - CLASS 9 label - White with black stripes
     - **Lithium battery handling label** (when required)
     - Cargo Aircraft Only labels
     - Orientation labels

  4. **Attachment 17** (`server/attachment17/attachment17.pdf`) - SDDG certification requirements
     - **PDF is authoritative** - verify all Key requirements here
     - Table A17.1 with all Keys 1-22
     - Key 7: Aircraft Limitations (critical for lithium batteries)
     - Key 11: UN Number
     - Key 12: PSN (special requirements for batteries)
     - Key 13: Class - simply "9" (NO divisions)
     - Key 14: Subsidiary Risk (usually empty for Class 9)
     - Key 15: Packing Group - **varies by material** (may be empty)
     - Key 16: Quantity and Type of Packing
     - Key 17: Packaging Instructions (A13.xx for Class 9)

  ### Code Sources
  Also read these source files to understand the app's data and logic:
  - `src/hazardousMaterials/hazardousMaterialsList.ts` - Find diverse Class 9 materials from Table A4.1
  - `src/utils/labelingRequirementsInspector.tsx` - Understand labeling logic
  - `src/utils/markingRequirementsInspector.ts` - Understand marking logic
  - `server/lookupFunctions/packagingLookupV2.ts` - Understand packaging validation

  ### Reference Format
  - **`src/testScenarios/class1.md`** - Use this as your FORMAT REFERENCE for how scenarios should be structured
    - NOTE: This document is for Class 1 (Explosives) using Attachments 5, 14, 15, and 17
    - You are creating the equivalent for Class 9 using Attachments 13, 14, 15, and 17
    - Copy the structure, tables, and section organization, but populate with Class 9-specific content

  ---

  ## Class 9 Technical Reference

  ### Key Differences from Other Classes

  | Aspect | Class 1 | Class 6 | Class 8 | Class 9 |
  |--------|---------|---------|---------|---------|
  | Divisions | 1.1-1.6 | 6.1, 6.2 | None | **None** |
  | Key 13 | "1.1A", etc. | "6.1", "6.2" | "8" | **"9"** |
  | Packing Group | Empty | 6.1: Required, 6.2: Empty | Required | **Varies by material** |
  | Key 15 | Empty | Varies | Required | **Varies (often empty)** |
  | Packaging | A5.xx | A10.xx | A12.xx | **A13.xx** |
  | Special Marks | EX Number | Inhalation Hazard | None | **Lithium battery mark, HOT** |

  ### Single Label - CLASS 9

  | Class | Label | Appearance |
  |-------|-------|------------|
  | 9 | CLASS 9 / MISCELLANEOUS | Upper half: 7 black vertical stripes on white; Lower half: white with "9" |

  **Note**: There is only ONE label for Class 9. Additional markings (not labels) may be required for specific materials.

  ### Lithium Battery Categories (Major Focus Area)

  | UN Number | Description | Contains Lithium | Typical Key 15 |
  |-----------|-------------|------------------|----------------|
  | UN3480 | LITHIUM ION BATTERIES | Ion cells/batteries alone | Empty |
  | UN3481 | LITHIUM ION BATTERIES CONTAINED IN EQUIPMENT | Ion in/with equipment | Empty |
  | UN3481 | LITHIUM ION BATTERIES PACKED WITH EQUIPMENT | Ion packed with equipment | Empty |
  | UN3090 | LITHIUM METAL BATTERIES | Metal cells/batteries alone | Empty |
  | UN3091 | LITHIUM METAL BATTERIES CONTAINED IN EQUIPMENT | Metal in/with equipment | Empty |
  | UN3091 | LITHIUM METAL BATTERIES PACKED WITH EQUIPMENT | Metal packed with equipment | Empty |

  **Lithium Battery Restrictions:**
  - Watt-hour (Wh) rating limits
  - Lithium content (g) limits
  - State of Charge (SOC) requirements
  - Section I vs Section II packaging
  - Many are Cargo Aircraft Only or Forbidden

  ### POP Marking (When Applicable)

  | Code | Authorized Packing Groups | Materials |
  |------|--------------------------|-----------|
  | Y | II, III | Some Class 9 N.O.S. with PG |
  | Z | III only | Environmentally hazardous, some elevated temp |

  **Note**: Many Class 9 materials (batteries, dry ice, magnetized) do NOT require POP marking because they have no packing group.

  ---

  ## Scenario Diversity Requirements

  Ensure the 20 scenarios cover ALL of these categories:

  ### Lithium Batteries (At least 8 scenarios - major category)
  - [ ] UN3480 LITHIUM ION BATTERIES (standalone)
  - [ ] UN3481 LITHIUM ION BATTERIES CONTAINED IN EQUIPMENT
  - [ ] UN3481 LITHIUM ION BATTERIES PACKED WITH EQUIPMENT
  - [ ] UN3090 LITHIUM METAL BATTERIES (standalone)
  - [ ] UN3091 LITHIUM METAL BATTERIES CONTAINED IN EQUIPMENT
  - [ ] UN3091 LITHIUM METAL BATTERIES PACKED WITH EQUIPMENT
  - [ ] Section I vs Section II packaging distinction
  - [ ] CAO restrictions for batteries

  ### Other Class 9 Materials (At least 10 scenarios)
  - [ ] UN1845 DRY ICE (CARBON DIOXIDE, SOLID)
  - [ ] UN2807 MAGNETIZED MATERIAL
  - [ ] UN3077 ENVIRONMENTALLY HAZARDOUS SUBSTANCE, SOLID, N.O.S.
  - [ ] UN3082 ENVIRONMENTALLY HAZARDOUS SUBSTANCE, LIQUID, N.O.S.
  - [ ] UN3257 ELEVATED TEMPERATURE LIQUID, N.O.S.
  - [ ] UN3258 ELEVATED TEMPERATURE SOLID, N.O.S.
  - [ ] UN3166 VEHICLE or UN3166 ENGINE (fuel/battery powered)
  - [ ] UN3268 AIR BAG INFLATORS or AIR BAG MODULES or SEAT BELT PRETENSIONERS
  - [ ] UN2212 ASBESTOS (blue or brown varieties)
  - [ ] UN3245 GENETICALLY MODIFIED ORGANISMS

  ### Packing Group Coverage
  - [ ] Materials WITH packing group (UN3077, UN3082, elevated temp) - at least 4
  - [ ] Materials WITHOUT packing group (batteries, dry ice, magnetized) - at least 10

  ### Aircraft Limitations
  - [ ] Cargo Aircraft Only materials - at least 6 scenarios
  - [ ] Passenger and Cargo allowed - at least 6 scenarios
  - [ ] Note any Forbidden materials (don't include, but acknowledge)

  ### Special Marks/Labels
  - [ ] Lithium battery handling mark
  - [ ] "MARINE POLLUTANT" marking
  - [ ] "HOT" marking (elevated temperature)
  - [ ] Orientation labels where required

  ### Common Materials to Include

  **Lithium Batteries:**
  - UN3480 LITHIUM ION BATTERIES (Section I - large)
  - UN3480 LITHIUM ION BATTERIES (Section II - small)
  - UN3481 LITHIUM ION BATTERIES CONTAINED IN EQUIPMENT
  - UN3481 LITHIUM ION BATTERIES PACKED WITH EQUIPMENT
  - UN3090 LITHIUM METAL BATTERIES (Section I)
  - UN3090 LITHIUM METAL BATTERIES (Section II)
  - UN3091 LITHIUM METAL BATTERIES CONTAINED IN EQUIPMENT
  - UN3091 LITHIUM METAL BATTERIES PACKED WITH EQUIPMENT

  **Dry Ice and Gases:**
  - UN1845 CARBON DIOXIDE, SOLID (DRY ICE)
  - UN2857 REFRIGERATING MACHINES (containing non-flammable gas)

  **Magnetized Materials:**
  - UN2807 MAGNETIZED MATERIAL (field strength >0.002 T at 2.1m)

  **Environmentally Hazardous:**
  - UN3077 ENVIRONMENTALLY HAZARDOUS SUBSTANCE, SOLID, N.O.S. (PG III)
  - UN3082 ENVIRONMENTALLY HAZARDOUS SUBSTANCE, LIQUID, N.O.S. (PG III)

  **Elevated Temperature:**
  - UN3257 ELEVATED TEMPERATURE LIQUID, N.O.S. (≥100°C)
  - UN3258 ELEVATED TEMPERATURE SOLID, N.O.S. (≥240°C)

  **Vehicles and Engines:**
  - UN3166 VEHICLE, FLAMMABLE GAS POWERED
  - UN3166 VEHICLE, FLAMMABLE LIQUID POWERED
  - UN3166 ENGINE, INTERNAL COMBUSTION
  - UN3171 BATTERY-POWERED VEHICLE

  **Safety Devices:**
  - UN3268 AIR BAG INFLATORS
  - UN3268 AIR BAG MODULES
  - UN3268 SEAT BELT PRETENSIONERS
  - UN2990 LIFE-SAVING APPLIANCES, SELF-INFLATING
  - UN3072 LIFE-SAVING APPLIANCES, NOT SELF-INFLATING

  **Other:**
  - UN2212 ASBESTOS, BLUE (crocidolite) or BROWN (amosite, mysorite)
  - UN2590 ASBESTOS, WHITE (chrysotile, actinolite, anthophyllite, tremolite)
  - UN3245 GENETICALLY MODIFIED ORGANISMS
  - UN2315 POLYCHLORINATED BIPHENYLS, LIQUID
  - UN3432 POLYCHLORINATED BIPHENYLS, SOLID
  - UN3316 CHEMICAL KIT or FIRST AID KIT

  ---

  ## Expected SDDG Keys for Class 9

  ### General Class 9 Format

  | Key | Class 9 Specifics |
  |-----|------------------|
  | Key 7 | "Cargo Aircraft Only" OR "Passenger and Cargo Aircraft" - varies significantly by material |
  | Key 11 | UN number (e.g., "UN3480", "UN1845") |
  | Key 12 | Full PSN - see special requirements below |
  | Key 13 | **"9" only** - NO divisions |
  | Key 14 | Usually empty for Class 9 (rare subsidiaries) |
  | Key 15 | **Varies**: Empty for batteries/dry ice/magnetized; "III" for environmentally hazardous |
  | Key 16 | Quantity + packaging description |
  | Key 17 | A13.xx paragraph |

  ### Key 12 (PSN) Special Requirements by Material

  | Material | Key 12 Format |
  |----------|---------------|
  | Lithium batteries | Must specify "ION" or "METAL" and "CONTAINED IN" or "PACKED WITH" if applicable |
  | Dry ice | "CARBON DIOXIDE, SOLID" or "DRY ICE" |
  | Environmentally hazardous | Include technical name of hazardous substance |
  | Elevated temperature | Include temperature and substance if applicable |
  | Magnetized material | "MAGNETIZED MATERIAL" |
  | Vehicles | Specify power type (FLAMMABLE GAS, FLAMMABLE LIQUID, etc.) |

  ---

  ## Expected Labels for Class 9

  ### Primary Label

  | Class | Label Name | Appearance |
  |-------|------------|------------|
  | 9 | CLASS 9 / MISCELLANEOUS DANGEROUS GOODS | Upper half: 7 vertical black stripes on white; Lower half: "9" underlined |

  ### Additional Labels/Marks by Material Type

  | Material | Additional Requirements |
  |----------|------------------------|
  | **Lithium Batteries** | Lithium Battery Handling Label/Mark (specific design per regulations) |
  | **Dry Ice** | CLASS 9 label + net weight of dry ice marked |
  | **Elevated Temperature** | "HOT" marking (elevated temp liquids/solids) |
  | **Environmentally Hazardous** | CLASS 9 label + "MARINE POLLUTANT" mark if applicable |
  | **Magnetized** | CLASS 9 label only |
  | **CAO Materials** | Cargo Aircraft Only label when required |

  ### Lithium Battery Handling Mark (Critical)

  The lithium battery mark is REQUIRED for:
  - Section II lithium batteries shipped under certain provisions
  - Must include UN number (UN3480, UN3481, UN3090, or UN3091)
  - Must include telephone number for additional information
  - Specific dimensions and design per ICAO/IATA

  ---

  ## Expected Markings for Class 9

  | Marking | When Required |
  |---------|---------------|
  | UN Number | Required - min 12mm height (e.g., "UN3480") |
  | PSN | Required - full proper shipping name |
  | Technical Name | Required for N.O.S. entries (especially environmentally hazardous) |
  | **Lithium Battery Mark** | Required for applicable lithium battery shipments |
  | **Net Quantity of Dry Ice** | Required when dry ice is present |
  | **"HOT"** | Required for elevated temperature materials |
  | **"MARINE POLLUTANT"** | Required for environmentally hazardous substances |
  | Orientation Arrows | When required by packaging or contents |
  | Watt-hour Rating | On lithium ion batteries/equipment |
  | Lithium Content | On lithium metal batteries/equipment |

  ---

  ## Alteration Ideas for Frustration Testing

  ### SDDG Alterations
  1. Key 13 shows "9.1" or "9.2" instead of just "9" (Class 9 has NO divisions)
  2. Key 15 populated for lithium batteries (should be empty)
  3. Key 15 empty for environmentally hazardous substance (should be "III")
  4. Key 12 shows "LITHIUM BATTERIES" without specifying "ION" or "METAL"
  5. Key 12 missing "CONTAINED IN EQUIPMENT" or "PACKED WITH EQUIPMENT" distinction
  6. Key 12 missing technical name for N.O.S. entry
  7. Key 7 shows "Passenger and Cargo" for CAO-only lithium batteries
  8. Key 17 shows wrong A13.xx paragraph
  9. Key 11 confusion between UN3480/UN3481 or UN3090/UN3091

  ### Label Alterations
  1. Missing CLASS 9 label entirely
  2. Missing lithium battery handling mark when required
  3. Using lithium battery handling mark when NOT required
  4. Wrong UN number on lithium battery mark
  5. Missing CAO label for cargo-only batteries
  6. Using hazard label instead of lithium battery mark

  ### Marking Alterations
  1. UN number missing or incorrect
  2. PSN incomplete (missing ION/METAL or CONTAINED IN/PACKED WITH)
  3. Technical name missing for environmentally hazardous N.O.S.
  4. Net weight of dry ice missing
  5. "HOT" marking missing for elevated temperature material
  6. "MARINE POLLUTANT" missing when required
  7. Watt-hour rating missing on lithium ion batteries
  8. Lithium content missing on lithium metal batteries
  9. Phone number missing on lithium battery mark

  ### POP Marking Alterations (When Applicable)
  1. POP marking on lithium batteries (not required - no PG)
  2. Missing POP marking on environmentally hazardous substance
  3. Packing group code "Y" for PG III only material

  ### Lithium Battery Specific Alterations
  1. Section II battery documentation used for Section I battery
  2. Wrong Wh rating documentation
  3. State of Charge not verified/documented
  4. Battery shipped at >30% SOC when restriction applies
  5. Damaged/defective battery not identified

  ---

  ## Output Requirements

  Write the complete test scenarios document to:
  docs/plans/2026-XX-XX-class9-test-scenarios-design.md
  (Replace XX-XX with the current date)

  ### Document Structure (follow src/testScenarios/class1.md format)

  1. **Overview Section**
     - Purpose of the document
     - What each scenario includes
     - Class 9 reference (note: NO divisions, miscellaneous nature)
     - Lithium battery category breakdown
     - Packing group applicability table
     - Key validation points summary
     - Key differences from other classes

  2. **Scenarios 1-20** (organized by material category)
     - Scenarios 1-8: Lithium Batteries
       - UN3480 variants
       - UN3481 variants
       - UN3090 variants
       - UN3091 variants
       - Section I vs Section II
     - Scenarios 9-12: Common Class 9 Materials
       - Dry ice
       - Magnetized material
       - Vehicles/engines
     - Scenarios 13-16: Environmentally Hazardous
       - UN3077, UN3082
       - Marine pollutants
     - Scenarios 17-20: Other Class 9
       - Elevated temperature
       - Safety devices
       - Asbestos, GMOs, etc.

     Each scenario with:
     - Material Details table
     - Expected SDDG Inspection table (Keys 7, 11-17)
     - Expected Package Inspection (Labels, Markings, special marks)
     - Alterations table (3 alterations per scenario)

  3. **Quick Reference Tables**
     - Alteration categories covered
     - Material category coverage
     - Packing group applicability
     - Lithium battery type coverage
     - Special marking requirements by material
     - Packaging paragraph coverage (A13.xx)

  4. **Test Execution Notes**
     - Before testing checklist
     - During testing guidance
     - Key Class 9 considerations
     - Lithium battery inspection special notes
     - After testing summary requirements

  ---

  ## Process Checklist

  Before writing scenarios, complete this research:

  - [ ] Read `docs/architecture/inspector-workflow-and-ml-detection.md` (understand workflow)
  - [ ] Read `src/testScenarios/class1.md` (understand format)
  - [ ] **Read `docs/attachment13/afmanAttachment13.pdf` THOROUGHLY** (Class 9 packaging - SOURCE OF TRUTH)
  - [ ] **Read `docs/attachment14/attachment14.pdf` THOROUGHLY** (marking requirements - SOURCE OF TRUTH)
  - [ ] **Read `docs/attachment15/attachment15.pdf` THOROUGHLY** (labeling requirements - SOURCE OF TRUTH)
  - [ ] **Read `server/attachment17/attachment17.pdf` THOROUGHLY** (SDDG requirements - SOURCE OF TRUTH)
  - [ ] Search `src/hazardousMaterials/hazardousMaterialsList.ts` for Class 9 materials
  - [ ] Review `src/utils/labelingRequirementsInspector.tsx`
  - [ ] Review `src/utils/markingRequirementsInspector.ts`
  - [ ] Select 20 diverse materials covering all categories
  - [ ] Write all 20 scenarios
  - [ ] Add quick reference tables
  - [ ] Add test execution notes

  ---

  ## Important Notes

  1. **PDF ATTACHMENTS ARE THE SOURCE OF TRUTH** - When writing scenarios:
     - Always verify requirements against the PDF documents
     - If code/data conflicts with PDF, the PDF is correct
     - Quote or reference specific paragraph numbers when possible

  2. **NO DIVISIONS** - Like Class 8, Class 9 has no divisions:
     - Key 13 must show simply **"9"**
     - NOT "9.1", "9.2", or any variant
     - Any division designation is an ERROR

  3. **Packing Group Varies by Material** - This is unique to Class 9:
     - Some materials REQUIRE packing group (UN3077, UN3082, elevated temp)
     - Most materials have NO packing group (batteries, dry ice, magnetized)
     - Check each material individually against Attachment 13

  4. **Lithium Batteries are Complex** - Major focus area:
     - 6 different UN numbers (3480, 3481, 3090, 3091 with variants)
     - Section I vs Section II packaging distinction
     - Wh rating and lithium content limits
     - State of Charge requirements
     - Lithium battery handling mark requirements
     - Many are CAO only or have passenger restrictions

  5. **Lithium Battery Mark vs Label** - Important distinction:
     - The "lithium battery handling mark" is a MARKING, not a label
     - CLASS 9 label may or may not be required depending on section
     - Requirements vary by Section I vs Section II
     - Verify specific requirements in Attachment 13 and 15

  6. **Dry Ice is Common** - UN1845:
     - No packing group
     - Requires CLASS 9 label
     - Must mark net weight of dry ice
     - Often shipped as refrigerant for other goods

  7. **Environmentally Hazardous Substances** - UN3077/UN3082:
     - ALWAYS have Packing Group III
     - Require "MARINE POLLUTANT" marking
     - Require technical name identifying the hazardous substance

  8. **"HOT" Marking** - Elevated temperature materials:
     - UN3257 (liquid at ≥100°C) and UN3258 (solid at ≥240°C)
     - Require "HOT" marking on package
     - Have Packing Group III

  9. **Vehicle and Engine Complexity** - UN3166/UN3171:
     - Different variants (flammable gas powered, flammable liquid powered, battery)
     - Fuel and battery requirements
     - No packing group
     - Special documentation requirements

  10. **Use subagents for parallel research** - Read multiple PDF attachments and source files in parallel to speed up research phase.

  11. **Section I vs Section II for Batteries** - Critical distinction:
      - Section I: Larger batteries, more requirements, often CAO only
      - Section II: Smaller batteries, fewer requirements, may be passenger aircraft
      - Thresholds based on Wh rating (ion) or lithium content (metal)

  12. **State of Charge (SOC)** - For lithium batteries:
      - Some shipments require SOC ≤30%
      - Verify requirements in Attachment 13
      - Common alteration: shipping at higher SOC than allowed