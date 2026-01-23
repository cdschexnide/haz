# Class 6 Packaging Paragraph Test Scenarios (A10.2 - A10.13)

## Overview

This document contains 12 comprehensive test scenarios for the HazPro mobile app Inspector workflow, covering **one material for each Class 6 packaging paragraph** (A10.2 through A10.13) per AFMAN 24-604.

### Purpose

These scenarios are designed for manual testing by physically running through the app. Each scenario includes:
- **Material Details**: UN number, PSN, hazard class/division, packing group, packaging paragraph, special provisions
- **Expected SDDG Inspection**: What a successful SDDG should contain (Keys 7, 11-17)
- **Expected Package Inspection**: Required labels, markings, and POP marking validation
- **Alterations**: Intentional errors to test frustration handling

### Packaging Paragraph Coverage

| Paragraph | Material Type | Test Scenario |
|-----------|--------------|---------------|
| A10.2 | PG I Class 6.1 (Cylinders) | Scenario 1 |
| A10.3 | Bromoacetone, Methyl Bromide, Chloropicrin | Scenario 2 |
| A10.4 | Liquid Class 6.1 | Scenario 3 |
| A10.5 | Solid Class 6.1 | Scenario 4 |
| A10.6 | PG I Hazard Zone A/B (Inhalation) | Scenario 5 |
| A10.7 | Tear Gas Candles/Devices | Scenario 6 |
| A10.8 | Infectious Substances Category A | Scenario 7 |
| A10.9 | Biological Substances Category B | Scenario 8 |
| A10.10 | Medical/Clinical Waste | Scenario 9 |
| A10.11 | Chlorosilanes | Scenario 10 |
| A10.12 | Toxins from Living Sources | Scenario 11 |
| A10.13 | Articles Containing Toxic Substance | Scenario 12 |

### Key Validation Points

**SDDG Keys (per Attachment 17):**
- Key 7: Aircraft Limitations (CAO vs Passenger and Cargo)
- Key 11: UN Number (with RQ prefix if hazardous substance)
- Key 12: Proper Shipping Name (with technical name for N.O.S.)
- Key 13: Class and Division ("6.1" or "6.2")
- Key 14: Subsidiary Hazard (if applicable)
- Key 15: **REQUIRED for 6.1** (PG I, II, or III), **EMPTY for 6.2** (except UN3291)
- Key 16: Quantity and Type of Packing
- Key 17: Packaging Instructions (A10.xx paragraph)

**Package Inspection:**
- Primary hazard label (TOXIC for 6.1, INFECTIOUS SUBSTANCE for 6.2 Cat A)
- Subsidiary hazard labels (if Key 14 populated)
- Cargo Aircraft Only label (if P1-P4 aircraft type)
- Orientation labels (for liquids)
- UN number and PSN markings
- "POISON" marking (for 6.1 in plastic containers)
- "INHALATION HAZARD" marking (for Hazard Zone A/B materials)
- UN specification (POP) marking validation

---

## Scenario 1: A10.2 - NA1556 METHYLDICHLOROARSINE (Cylinders)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | NA1556 |
| PSN | METHYLDICHLOROARSINE |
| Hazard Class | 6.1 |
| Packing Group | I |
| Packaging Paragraph | A10.2 |
| Special Provisions | P2, 2 |
| Domestic Only | Yes (NA prefix) |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" (P2 restricts to CAO) |
| Key 11 | "NA1556" |
| Key 12 | "METHYLDICHLOROARSINE" |
| Key 13 | "6.1" |
| Key 14 | Empty |
| Key 15 | "I" (Packing Group I required) |
| Key 16 | Net quantity + cylinder type (e.g., "1 cylinder (3AA1800) x 25 kg") |
| Key 17 | "A10.2" |

### Expected Package Inspection (Successful)

**Labels Required:**
- TOXIC (skull and crossbones on white background)
- Cargo Aircraft Only

**Markings Required:**
- NA1556
- PSN: "METHYLDICHLOROARSINE"
- "POISON" or "TOXIC" marking
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Cylinder specification marking (3A1800, 3AA1800, 3AL1800, 3D, 3E1800, or 33)
- Must meet A3.3.2 cylinder requirements
- Max water capacity: 57 kg (3A/3AA/3AL) or 127 kg (3D/33)

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 7 shows "Passenger and Cargo Aircraft" | Aircraft limitation validation (P2 requires CAO) |
| 2 | Cylinder type not authorized for A10.2 | Packaging code validation |
| 3 | Missing Cargo Aircraft Only label | CAO label requirement for P2 material |

---

## Scenario 2: A10.3 - UN1569 BROMOACETONE

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1569 |
| PSN | BROMOACETONE |
| Hazard Class | 6.1 |
| Subsidiary Risk | 3 (Flammable) |
| Packing Group | II |
| Packaging Paragraph | A10.3 |
| Special Provisions | P2, 2 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" (P2 restricts to CAO) |
| Key 11 | "UN1569" |
| Key 12 | "BROMOACETONE" |
| Key 13 | "6.1" |
| Key 14 | "3" (Flammable subsidiary) |
| Key 15 | "II" |
| Key 16 | Net quantity + packaging (e.g., "1 fiberboard box (4G) x 500 g") |
| Key 17 | "A10.3" |

### Expected Package Inspection (Successful)

**Labels Required:**
- TOXIC (primary hazard)
- FLAMMABLE LIQUID (subsidiary Class 3)
- Cargo Aircraft Only
- Orientation arrows (liquid)

**Markings Required:**
- UN1569
- PSN: "BROMOACETONE"
- "POISON" or "TOXIC" marking
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Per A10.3.2.1: Boxes (4A, 4B, 4C1, 4C2, 4D, 4F, 4N) with inner glass/metal receptacle
- Or per A10.3.2.2: Cylinders (3A, 3AA, 3B, 3C, 3E, 4A, 4B, 4BA, 4BW, 4C)
- Packing group code: X or Y (PG II allows Y rating)
- Max per bottle: 500 g in boxes; 11 kg per outer box

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Missing FLAMMABLE LIQUID subsidiary label | Subsidiary hazard label validation |
| 2 | Key 14 left empty when subsidiary risk exists | SDDG subsidiary risk validation |
| 3 | POP marking shows packing group "Z" | PG validation (Z not sufficient for PG II) |

---

## Scenario 3: A10.4 - UN3426 ACRYLAMIDE SOLUTION (Liquid)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3426 |
| PSN | ACRYLAMIDE SOLUTION |
| Hazard Class | 6.1 |
| Packing Group | III |
| Packaging Paragraph | A10.4 |
| Special Provisions | P5 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" (P5 allows passenger) |
| Key 11 | "UN3426" |
| Key 12 | "ACRYLAMIDE SOLUTION" |
| Key 13 | "6.1" |
| Key 14 | Empty |
| Key 15 | "III" |
| Key 16 | Net quantity + packaging (e.g., "1 plastic drum (1H1) x 20 L") |
| Key 17 | "A10.4" |

### Expected Package Inspection (Successful)

**Labels Required:**
- TOXIC (or Class 6 PG III designation)
- Orientation arrows (liquid)

**Markings Required:**
- UN3426
- PSN: "ACRYLAMIDE SOLUTION"
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Per A10.4: Combination packaging (drums 1A2, 1B2, 1N2, 1D, 1G, 1H2; boxes 4A, 4B, 4C1, 4C2, 4D, 4F, 4G, 4H1, 4H2)
- Or single packaging (drums 1A1, 1A2, 1B1, 1B2, 1G with liner, 1H1, 1H2, 1N1, 1N2; jerricans 3A1, 3A2, 3B1, 3B2, 3H1, 3H2)
- Packing group code: X, Y, or Z (PG III allows Z rating)

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Missing orientation arrows for liquid | Orientation label validation |
| 2 | Key 15 shows "II" instead of "III" | Packing group accuracy validation |
| 3 | POP marking entirely missing | UN specification marking validation |

---

## Scenario 4: A10.5 - UN2713 ACRIDINE (Solid)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN2713 |
| PSN | ACRIDINE |
| Hazard Class | 6.1 |
| Packing Group | III |
| Packaging Paragraph | A10.5 |
| Special Provisions | P5 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" |
| Key 11 | "UN2713" |
| Key 12 | "ACRIDINE" |
| Key 13 | "6.1" |
| Key 14 | Empty |
| Key 15 | "III" |
| Key 16 | Net quantity + packaging (e.g., "1 fiberboard box (4G) x 10 kg") |
| Key 17 | "A10.5" |

### Expected Package Inspection (Successful)

**Labels Required:**
- TOXIC (or Class 6 PG III designation)

**Markings Required:**
- UN2713
- PSN: "ACRIDINE"
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Per A10.5: Combination packaging with inner glass/earthenware/plastic/metal
- Outer: drums (1A1, 1A2, 1B1, 1B2, 1D, 1G, 1H1, 1H2, 1N1, 1N2), boxes (4A, 4B, 4C1, 4C2, 4D, 4F, 4G, 4H2, 4N)
- Or single packaging: drums, boxes, bags (5H1, 5H2, 5H3, 5H4, 5L1, 5L2, 5L3, 5M2)
- Packing group code: X, Y, or Z
- "S" for solids in test pressure field

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 17 shows "A10.4" instead of "A10.5" | Packaging instruction validation (liquid vs solid) |
| 2 | Missing Military Shipping Label | MSL validation |
| 3 | Key 15 left empty | Packing group requirement for 6.1 |

---

## Scenario 5: A10.6 - UN1541 ACETONE CYANOHYDRIN, STABILIZED (Inhalation Hazard)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1541 |
| PSN | ACETONE CYANOHYDRIN, STABILIZED |
| Hazard Class | 6.1 |
| Packing Group | I |
| Packaging Paragraph | A10.6 |
| Special Provisions | P2, 2, N34 |
| Inhalation Hazard | Yes (Hazard Zone A or B) |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" (P2 restricts to CAO) |
| Key 11 | "UN1541" |
| Key 12 | "ACETONE CYANOHYDRIN, STABILIZED, INHALATION HAZARD ZONE [A/B]" |
| Key 13 | "6.1" |
| Key 14 | Empty |
| Key 15 | "I" |
| Key 16 | Net quantity + packaging |
| Key 17 | "A10.6" |

### Expected Package Inspection (Successful)

**Labels Required:**
- TOXIC INHALATION HAZARD (mandatory for Zone A/B)
- Cargo Aircraft Only
- Orientation arrows (liquid)

**Markings Required:**
- UN1541
- PSN: "ACETONE CYANOHYDRIN, STABILIZED"
- "INHALATION HAZARD" marking (unless on label)
- "POISON" or "TOXIC" marking
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Per A10.6: Seamless DOT/UN specification cylinders (NOT 8, 8AL, 39)
- Or drum-in-drum: Inner (1A1, 1B1, 1H1, 1N1, 6HA1) in outer (1A2, 1H2)
- Or combination packaging with impact-resistant receptacles (max 4 L inner, 16 L outer for Zone A)
- Packing group code: X only (PG I requires highest rating)
- Hydrostatic test requirements apply

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 12 missing "INHALATION HAZARD ZONE" designation | Zone designation requirement |
| 2 | Label shows regular TOXIC instead of TOXIC INHALATION HAZARD | Inhalation hazard label validation (A15.4.5.2 - mandatory) |
| 3 | POP marking shows packing group "Y" | PG validation (PG I requires X rating only) |

---

## Scenario 6: A10.7 - UN1700 TEAR GAS CANDLES

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1700 |
| PSN | TEAR GAS CANDLES |
| Hazard Class | 6.1 |
| Subsidiary Risk | 4.1 (Flammable Solid) |
| Packing Group | N/A |
| Packaging Paragraph | A10.7 |
| Special Provisions | P4 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" (P4 restricts to CAO) |
| Key 11 | "UN1700" |
| Key 12 | "TEAR GAS CANDLES" |
| Key 13 | "6.1" |
| Key 14 | "4.1" (Flammable Solid subsidiary) |
| Key 15 | Empty (no packing group for this entry) |
| Key 16 | Number of items + packaging (e.g., "24 tear gas candles in 1 drum (1A2) x 15 kg") |
| Key 17 | "A10.7" |

### Expected Package Inspection (Successful)

**Labels Required:**
- TOXIC (primary hazard)
- FLAMMABLE SOLID (subsidiary Class 4.1)
- Cargo Aircraft Only

**Markings Required:**
- UN1700
- PSN: "TEAR GAS CANDLES"
- "POISON" or "TOXIC" marking
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Per A10.7.1: Boxes (4A, 4B, 4C1 metal-strapped, 4C2 metal-strapped, 4D metal-strapped, 4F metal-strapped, 4N)
- Per A10.7.2: Drums (1A2, 1B2, 1H2, 1N2)
- Per A10.7.3: DOT 2P/2Q in fiberboard box (4G)
- Quantity limits: 50 items/35 kg (boxes), 24 items/35 kg (drums), 30 items/16 kg (2P/2Q)

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Missing FLAMMABLE SOLID subsidiary label | Subsidiary hazard label validation |
| 2 | Key 7 shows "Passenger and Cargo Aircraft" | Aircraft limitation validation (P4 requires CAO) |
| 3 | Exceeds 50 items per box | Quantity limitation validation |

---

## Scenario 7: A10.8 - UN2814 INFECTIOUS SUBSTANCE, AFFECTING HUMANS (Category A)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN2814 |
| PSN | INFECTIOUS SUBSTANCE, AFFECTING HUMANS |
| Scientific Name | (Bacillus anthracis - cultures) |
| Hazard Class | 6.2 |
| Category | A |
| Packaging Paragraph | A10.8 |
| Special Provisions | P1, A140, A502 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" (P1 restricts to CAO) |
| Key 11 | "UN2814" |
| Key 12 | "INFECTIOUS SUBSTANCE, AFFECTING HUMANS (Bacillus anthracis)" |
| Key 13 | "6.2" |
| Key 14 | Empty |
| Key 15 | **EMPTY** (Infectious substances do NOT have packing groups) |
| Key 16 | Net quantity + packaging description (triple packaging) |
| Key 17 | "A10.8" |
| Key 2/20 | **24-hour emergency contact number** (CRITICAL for 6.2) |

### Expected Package Inspection (Successful)

**Labels Required:**
- INFECTIOUS SUBSTANCE (biohazard symbol on white background)
- Cargo Aircraft Only
- Orientation arrows (required for ALL 6.2 materials)

**Markings Required:**
- UN2814
- PSN: "INFECTIOUS SUBSTANCE, AFFECTING HUMANS"
- Scientific name if known: "(Bacillus anthracis)"
- Shipper name and address
- Consignee name and address
- Name and telephone of responsible person (24-hour availability)
- Military Shipping Label (MSL)

**Triple Packaging Validation (per A10.8):**
1. Primary receptacle - leakproof, watertight
2. Secondary packaging - leakproof, with absorbent material between primary and secondary
3. Outer packaging - rigid, minimum 100mm smallest dimension
- UN specification marking must include "Class 6.2" text
- Optional "U" code when meeting 49 CFR 178.609(i)(3)

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 15 shows "II" (packing group entered when should be empty) | 6.2 packing group validation (must be empty) |
| 2 | Missing 24-hour emergency contact | Emergency contact requirement for 6.2 (Key 2/20) |
| 3 | Using TOXIC label instead of INFECTIOUS SUBSTANCE | Division label validation (6.1 vs 6.2) |

---

## Scenario 8: A10.9 - UN3373 BIOLOGICAL SUBSTANCE, CATEGORY B

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3373 |
| PSN | BIOLOGICAL SUBSTANCE, CATEGORY B |
| Hazard Class | 6.2 |
| Category | B |
| Packaging Paragraph | A10.9 |
| Special Provisions | P5, A508 |

**CRITICAL**: UN3373 does NOT require a hazard label - only specific markings.

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" (generally allowed) |
| Key 11 | "UN3373" |
| Key 12 | "BIOLOGICAL SUBSTANCE, CATEGORY B" |
| Key 13 | "6.2" |
| Key 14 | Empty |
| Key 15 | **EMPTY** (NO packing group for 6.2) |
| Key 16 | Net quantity + packaging description |
| Key 17 | "A10.9" |

**Note:** SDDG may NOT be required if all conditions in A17.5.4.1 are met (stabilizing hazmat ≤30 mL/30 g per inner packaging).

### Expected Package Inspection (Successful)

**Labels Required:**
- **NO HAZARD LABEL** (UN3373 is a critical exception)
- Orientation arrows (required for 6.2)

**Markings Required:**
- "UN3373" within a diamond-shaped border (minimum 50mm x 50mm, 2mm line width)
- "BIOLOGICAL SUBSTANCE, CATEGORY B" text (6mm minimum height)
- Shipper name and address
- Consignee name and address
- Emergency contact name and phone number
- Military Shipping Label (MSL)

**Triple Packaging Validation (P650 / A10.9):**
- Primary receptacle: leakproof, max 1 L (liquid) or siftproof (solid)
- Secondary packaging: leakproof (liquid) or siftproof (solid), with absorbent
- Outer packaging: rigid, drop test at 1.2m, minimum surface 100mm x 100mm
- Max 4 L (liquid) or 4 kg (solid) per outer packaging

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | INFECTIOUS SUBSTANCE label applied (should have NO label) | UN3373 no-label requirement validation |
| 2 | UN3373 diamond marking missing or wrong size (<50mm) | Diamond marking specification validation |
| 3 | Key 15 shows "II" (should be empty for 6.2) | Packing group empty validation for 6.2 |

---

## Scenario 9: A10.10 - UN3291 BIOMEDICAL WASTE, N.O.S.

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3291 |
| PSN | BIOMEDICAL WASTE, N.O.S. |
| Hazard Class | 6.2 |
| Packing Group | II |
| Packaging Paragraph | A10.10 |
| Special Provisions | P5, A117 |

**Note**: UN3291 is unique in Division 6.2 - it DOES have a packing group (PG II).

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" (with quantity restrictions) |
| Key 11 | "UN3291" |
| Key 12 | "BIOMEDICAL WASTE, N.O.S." (or "CLINICAL WASTE, UNSPECIFIED, N.O.S." or "REGULATED MEDICAL WASTE, N.O.S.") |
| Key 13 | "6.2" |
| Key 14 | Empty |
| Key 15 | "II" (UN3291 exceptionally has PG II) |
| Key 16 | Net quantity + packaging description |
| Key 17 | "A10.10" |

### Expected Package Inspection (Successful)

**Labels Required:**
- INFECTIOUS SUBSTANCE (biohazard symbol)
- Orientation arrows (for liquids or 6.2 general requirement)

**Markings Required:**
- UN3291
- PSN: "BIOMEDICAL WASTE, N.O.S."
- Shipper/consignee information
- Responsible person contact
- Military Shipping Label (MSL)

**POP Marking Validation (A10.10):**
- Single packaging: drums (1A2, 1B2, 1N2, 1D, 1G, 1H2), boxes (4A, 4B, 4C1, 4C2, 4D, 4F, 4G, 4H1, 4H2, 4N), jerricans (3A2, 3B2, 3H2)
- Removable head drums required
- Packing group code: X or Y (PG II performance level)
- Puncture-resistant for sharp objects

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 15 empty (should show "II" for UN3291) | UN3291 exception - PG II required |
| 2 | UN3373 marking applied instead of UN3291 | UN number accuracy for medical waste |
| 3 | POP marking shows packing group "Z" | PG II requires X or Y rating |

---

## Scenario 10: A10.11 - UN3361 CHLOROSILANES, TOXIC, CORROSIVE, N.O.S.

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3361 |
| PSN | CHLOROSILANES, TOXIC, CORROSIVE, N.O.S. |
| Technical Name | (Required - e.g., Trichlorosilane) |
| Hazard Class | 6.1 |
| Subsidiary Risk | 8 (Corrosive) |
| Packing Group | II |
| Packaging Paragraph | A10.11 |
| Special Provisions | P5 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" |
| Key 11 | "UN3361" |
| Key 12 | "CHLOROSILANES, TOXIC, CORROSIVE, N.O.S. (Trichlorosilane)" |
| Key 13 | "6.1" |
| Key 14 | "8" (Corrosive subsidiary) |
| Key 15 | "II" |
| Key 16 | Net quantity + packaging |
| Key 17 | "A10.11" |

### Expected Package Inspection (Successful)

**Labels Required:**
- TOXIC (primary hazard)
- CORROSIVE (subsidiary Class 8)
- Orientation arrows (liquid)

**Markings Required:**
- UN3361
- PSN with technical name: "CHLOROSILANES, TOXIC, CORROSIVE, N.O.S. (Trichlorosilane)"
- "POISON" or "TOXIC" marking
- Military Shipping Label (MSL)

**POP Marking Validation (A10.11):**
- Per A10.11.1: Combination packaging with glass/steel inner; outer drums (1A2, 1D, 1G, 1H2) or boxes (4A, 4C1, 4C2, 4D, 4F, 4G, 4H1, 4H2)
- Per A10.11.2: Composite drums (6HA1) with plastic inner
- Per A10.11.3: Single packaging drums (1A1) or jerricans (3A1)
- Per A10.11.4: Cylinders (NOT 3HT, 8, 8AL)
- Packing group code: X or Y

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Missing CORROSIVE subsidiary label | Subsidiary hazard label validation |
| 2 | Technical name missing from package marking | N.O.S. marking requirement |
| 3 | Key 14 left empty when subsidiary risk exists | SDDG subsidiary risk validation |

---

## Scenario 11: A10.12 - UN3172 TOXINS, EXTRACTED FROM LIVING SOURCES, LIQUID, N.O.S.

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3172 |
| PSN | TOXINS, EXTRACTED FROM LIVING SOURCES, LIQUID, N.O.S. |
| Technical Name | (Required - e.g., Ricin, Botulinum toxin) |
| Hazard Class | 6.1 |
| Packing Group | II |
| Packaging Paragraph | A10.12 |
| Special Provisions | P4, A43 |
| Transport Mode | Cargo Aircraft Only |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" (per Table A4.1/A4.2 - CAO only) |
| Key 11 | "UN3172" |
| Key 12 | "TOXINS, EXTRACTED FROM LIVING SOURCES, LIQUID, N.O.S. (Ricin)" |
| Key 13 | "6.1" |
| Key 14 | Empty |
| Key 15 | "II" |
| Key 16 | Net quantity + packaging (e.g., "1 glass inner x 2.5 L in fiberboard box (4G)") |
| Key 17 | "A10.12" |

### Expected Package Inspection (Successful)

**Labels Required:**
- TOXIC (skull and crossbones)
- Cargo Aircraft Only
- Orientation arrows (liquid)

**Markings Required:**
- UN3172
- PSN with technical name: "TOXINS, EXTRACTED FROM LIVING SOURCES, LIQUID, N.O.S. (Ricin)"
- "POISON" or "TOXIC" marking
- Military Shipping Label (MSL)

**POP Marking Validation (A10.12):**
- Per A10.12.1.1: Combination packaging
  - Inner: glass/plastic (max 2.5 L for PG II), metal (max 5.0 L for PG II)
  - Outer: drums, boxes, jerricans
- Per A10.12.1.2: Single packaging (drums, jerricans)
- Per A10.12.1.3: Composite with plastic inner
- Packing group code: X or Y
- Max outer packaging: 60 L for PG II

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 7 shows "Passenger and Cargo Aircraft" | Aircraft limitation validation (toxins are CAO only) |
| 2 | Missing technical name in Key 12 and package marking | N.O.S. technical name requirement |
| 3 | Inner packaging exceeds 2.5 L for glass/plastic (PG II) | Quantity limitation per inner packaging |

---

## Scenario 12: A10.13 - UN3546 ARTICLES CONTAINING TOXIC SUBSTANCE, N.O.S.

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3546 |
| PSN | ARTICLES CONTAINING TOXIC SUBSTANCE, N.O.S. |
| Technical Name | (Required - describe toxic substance) |
| Hazard Class | 6.1 |
| Packing Group | N/A (PG II performance standard) |
| Packaging Paragraph | A10.13 |
| Special Provisions | P5, 391 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" |
| Key 11 | "UN3546" |
| Key 12 | "ARTICLES CONTAINING TOXIC SUBSTANCE, N.O.S. (describe article and toxic substance)" |
| Key 13 | "6.1" |
| Key 14 | Empty (unless article has subsidiary hazard) |
| Key 15 | Empty (no packing group assigned, but PG II performance) |
| Key 16 | Number/type of articles + weight (e.g., "2 articles x 5 kg") |
| Key 17 | "A10.13" |

### Expected Package Inspection (Successful)

**Labels Required:**
- TOXIC (primary hazard)
- Orientation arrows (if containing liquids)

**Markings Required:**
- UN3546
- PSN with description: "ARTICLES CONTAINING TOXIC SUBSTANCE, N.O.S. (description)"
- Military Shipping Label (MSL)

**POP Marking Validation (A10.13):**
- Per A10.13.1: PG II performance level packagings
  - Drums (1A2, 1B2, 1N2, 1D, 1G, 1H2) - removable head
  - Boxes (4A, 4B, 4C1, 4C2, 4D, 4F, 4G, 4H1, 4H2, 4N)
  - Jerricans (3A2, 3B2, 3H2) - removable head
- Per A10.13.2: Robust articles may use strong outer packaging or be unpackaged/on pallets
- Packing group code: X or Y (PG II performance)
- Max: 60 L liquids, 100 kg solids per package

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 12 missing article description | PSN completeness for articles |
| 2 | Exceeds 60 L liquid content per package | Quantity limitation validation |
| 3 | Missing orientation arrows when article contains liquid | Orientation label requirement for liquids |

---

## Quick Reference: Packaging Paragraph Summary

| Paragraph | Division | PG | Material Type | Key Characteristics |
|-----------|----------|-----|---------------|---------------------|
| A10.2 | 6.1 | I | Cylinders (arsine, phosphine, phosgene) | Cylinder specs only, leakage test |
| A10.3 | 6.1 | I | Bromoacetone, methyl bromide, chloropicrin | Glass/metal in boxes OR cylinders |
| A10.4 | 6.1 | I/II/III | Liquid toxic substances | Combo, single, composite, cylinders |
| A10.5 | 6.1 | I/II/III | Solid toxic substances | Combo, single, composite, bags allowed |
| A10.6 | 6.1 | I | Inhalation hazard Zone A/B | Cylinders, drum-in-drum, combo |
| A10.7 | 6.1 | N/A | Tear gas candles/devices | Boxes, drums, DOT 2P/2Q |
| A10.8 | 6.2 | N/A | Infectious substances Cat A | Triple packaging, 100mm min dimension |
| A10.9 | 6.2 | N/A | Biological substances Cat B | Triple packaging, NO label required |
| A10.10 | 6.2 | II | Medical/clinical waste | Single packaging, puncture-resistant |
| A10.11 | 6.1 | I/II | Chlorosilanes | Combo, composite, single, cylinders |
| A10.12 | 6.1 | I/II/III | Toxins from living sources | CAO only, inner qty limits by PG |
| A10.13 | 6.1 | II (perf) | Articles with toxic substance | PG II packaging OR robust articles |

---

## Key 15 Validation Summary

**CRITICAL DISTINCTION:**

| Division | Key 15 Requirement | Exception |
|----------|-------------------|-----------|
| **6.1** | REQUIRED (I, II, or III) | A10.7 Tear Gas (no PG) |
| **6.2** | EMPTY | UN3291 Medical Waste (PG II) |

---

## Test Execution Checklist

1. **Before Testing**: Verify hazardousMaterialsList.ts contains all 12 UN numbers
2. **SDDG Phase**: Validate all keys match expected values
3. **Package Phase**: Verify ML detection and OCR accuracy
4. **Alterations**: Apply one at a time, verify frustration captured correctly
5. **Form 1015**: Confirm frustrations map to correct field numbers

### Field 87 Frustration Format

All frustrations documented as:
```
<field_number>. – <date> @ <time> – <LABEL> – Inspector: <name>
```
