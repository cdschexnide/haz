# Class 2 (Gases) Test Scenarios

## Overview

This document contains 20 comprehensive manual test scenarios for the HazPro mobile app Inspector workflow, focusing on Class 2 (Gases) materials. Each scenario is based on AFMAN 24-604 regulations (Attachments 6, 14, 15, and 17).

### Purpose

These scenarios are designed for manual testing by physically running through the app. Each scenario includes:
- **Material Details**: UN number, PSN, hazard class, packaging paragraph, special provisions
- **Expected SDDG Inspection**: What a successful SDDG should contain (Keys 7, 11-17, 19)
- **Expected Package Inspection**: Required labels, markings, and POP marking validation
- **Alterations**: Intentional errors to test frustration handling

### Class 2 Division Reference

| Division | Description | Label Color | Example |
|----------|-------------|-------------|---------|
| 2.1 | Flammable Gas | Red | UN1978 Propane |
| 2.2 | Non-flammable, Non-toxic Gas | Green | UN1066 Nitrogen |
| 2.3 | Toxic Gas | White | UN1017 Chlorine |

### Inhalation Hazard Zone Reference (Division 2.3)

| Zone | LC50 (ppm) | Hazard Level |
|------|------------|--------------|
| A | ≤200 | Most Dangerous |
| B | >200 to ≤1000 | High |
| C | >1000 to ≤3000 | Moderate |
| D | >3000 to ≤5000 | Least Dangerous |

### Key Differences from Class 1

| Aspect | Class 1 (Explosives) | Class 2 (Gases) |
|--------|---------------------|-----------------|
| Packing Group in Key 15 | Empty | May have PG (I, II, or III) for some materials |
| Packaging Paragraph | A5.xx | A6.xx |
| EX Number Marking | Required | Not Required |
| Key 19 (Handling Info) | Not Used | Cylinder position statement required |
| Packaging Types | Boxes, drums | Cylinders, pressure receptacles, aerosols |
| Special Marking | MSL, NEW | "INHALATION HAZARD" (2.3), "MEETS DOT REQUIREMENTS" (fire extinguishers) |

### Key Validation Points

**SDDG Keys (per Attachment 17):**
- Key 7: Aircraft Limitations (CAO vs Passenger and Cargo)
- Key 11: UN/NA/ID Number (with RQ prefix if applicable)
- Key 12: Proper Shipping Name (with technical name for N.O.S.; "TOXIC-INHALATION HAZARD" and "ZONE X" for Division 2.3)
- Key 13: Class and Division
- Key 14: Subsidiary Hazard (if applicable)
- Key 15: Packing Group (may be empty or have value depending on material)
- Key 16: Quantity and Type of Packing
- Key 17: Packaging Instructions (A6.xx paragraph)
- Key 19: Handling Information (cylinder position statement for Class 2)

**Package Inspection:**
- Primary hazard label (Division 2.1, 2.2, or 2.3)
- Subsidiary hazard labels (if Key 14 populated)
- Cargo Aircraft Only label (if P1-P4 or CAO aircraft type)
- UN number and PSN markings
- "INHALATION HAZARD" marking (Division 2.3 only)
- POP Marking validation (cylinder specifications for Class 2)
- Orientation labels (for cryogenic liquids)

---

## Division 2.1 - Flammable Gases (Scenarios 1-5)

---

## Scenario 1: UN1001 - ACETYLENE, DISSOLVED

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1001 |
| PSN | ACETYLENE, DISSOLVED |
| Hazard Class | 2.1 |
| Subsidiary Risk | None |
| Packing Group | None |
| Packaging Paragraph | A6.9 |
| Special Provisions | P4, N86, N88 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" (triggered by P4 special provision) |
| Key 11 | "UN1001" |
| Key 12 | "ACETYLENE, DISSOLVED" |
| Key 13 | "2.1" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | Net quantity + packaging (e.g., "1 cylinder x 5 kg") |
| Key 17 | "A6.9" |
| Key 19 | "Ship valve up in vertical position" |

### Expected Package Inspection (Successful)

**Labels Required:**
- FLAMMABLE GAS (Division 2.1) - Red
- Cargo Aircraft Only

**Markings Required:**
- UN1001
- PSN: "ACETYLENE, DISSOLVED"

**POP Marking Validation:**
- Acetylene cylinders per A6.9 (DOT-8, DOT-8AL authorized)
- Packing group code: X, Y, or Z

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 7 shows "Passenger and Cargo Aircraft" (P4 requires CAO) | Aircraft limitation validation for P4 provision |
| 2 | Missing Cargo Aircraft Only label on package | CAO label validation |
| 3 | Key 19 missing cylinder position statement | Handling information validation for Class 2 |

---

## Scenario 2: UN1011 - BUTANE

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1011 |
| PSN | BUTANE |
| Hazard Class | 2.1 |
| Subsidiary Risk | None |
| Packing Group | None |
| Packaging Paragraph | A6.3, A6.6 |
| Special Provisions | P4 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" |
| Key 11 | "UN1011" |
| Key 12 | "BUTANE" |
| Key 13 | "2.1" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | Net quantity + packaging (e.g., "2 cylinders x 10 kg") |
| Key 17 | "A6.3" or "A6.6" |
| Key 19 | "Ship valve up in vertical position" |

### Expected Package Inspection (Successful)

**Labels Required:**
- FLAMMABLE GAS (Division 2.1) - Red
- Cargo Aircraft Only

**Markings Required:**
- UN1011
- PSN: "BUTANE"

**POP Marking Validation:**
- Per A6.3 (small receptacles) or A6.6 (LPG): DOT cylinders 3A, 3AA, 3AL, 3B, 3E, 4B, 4BA, 4BW authorized
- Packing group code: X, Y, or Z

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 17 shows "A6.2" (aerosols) instead of "A6.3" or "A6.6" | Packaging instruction validation |
| 2 | POP marking shows packaging code "4G" (fiberboard box - not valid for gas cylinder) | Packaging code validation for Class 2 |
| 3 | Key 13 shows "2.2" instead of "2.1" | Hazard class validation |

---

## Scenario 3: UN1978 - PROPANE

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1978 |
| PSN | PROPANE |
| Hazard Class | 2.1 |
| Subsidiary Risk | None |
| Packing Group | None |
| Packaging Paragraph | A6.3, A6.6 |
| Special Provisions | P4 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" |
| Key 11 | "UN1978" |
| Key 12 | "PROPANE" |
| Key 13 | "2.1" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | Net quantity + packaging (e.g., "4 cylinders x 20 lb") |
| Key 17 | "A6.3" or "A6.6" |
| Key 19 | "Ship valve up in vertical position" |

### Expected Package Inspection (Successful)

**Labels Required:**
- FLAMMABLE GAS (Division 2.1) - Red
- Cargo Aircraft Only

**Markings Required:**
- UN1978
- PSN: "PROPANE"

**POP Marking Validation:**
- Per A6.3 or A6.6: DOT cylinders authorized
- Packing group code: X, Y, or Z

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | UN number on package shows "UN1979" (similar UN number) | UN number match with SDDG Key 11 |
| 2 | Label shows NON-FLAMMABLE GAS (2.2) instead of FLAMMABLE GAS (2.1) | Label division validation |
| 3 | Key 16 shows quantity only in imperial (lb) without metric | Metric requirement validation |

---

## Scenario 4: UN1950 - AEROSOLS, FLAMMABLE

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1950 |
| PSN | AEROSOLS, FLAMMABLE |
| Hazard Class | 2.1 |
| Subsidiary Risk | None |
| Packing Group | None |
| Packaging Paragraph | A6.2 |
| Special Provisions | P5 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" (P5 allows passenger aircraft) |
| Key 11 | "UN1950" |
| Key 12 | "AEROSOLS, FLAMMABLE" |
| Key 13 | "2.1" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | Net quantity + packaging (e.g., "24 aerosol cans x 200 g") |
| Key 17 | "A6.2" |
| Key 19 | Not required for aerosols (no cylinder position statement) |

### Expected Package Inspection (Successful)

**Labels Required:**
- FLAMMABLE GAS (Division 2.1) - Red

**Markings Required:**
- UN1950
- PSN: "AEROSOLS, FLAMMABLE"

**POP Marking Validation:**
- Per A6.2: Outer packaging - boxes 4G, 4C1, 4C2, 4D, 4F, 4H1, 4H2; drums 1A1, 1A2, 1B1, 1B2
- Packing group code: X, Y, or Z

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 17 shows "A6.3" (compressed gas) instead of "A6.2" (aerosols) | Packaging instruction validation |
| 2 | PSN abbreviated to "AEROSOLS" without "FLAMMABLE" qualifier | PSN completeness validation |
| 3 | Key 7 shows "Cargo Aircraft Only" when P5 allows passenger | Aircraft limitation validation |

---

## Scenario 5: UN1954 - COMPRESSED GAS, FLAMMABLE, N.O.S. (Technical Name Required)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1954 |
| PSN | COMPRESSED GAS, FLAMMABLE, N.O.S. |
| Hazard Class | 2.1 |
| Subsidiary Risk | None |
| Packing Group | None |
| Packaging Paragraph | A6.3, A6.5 |
| Special Provisions | P4 |
| Technical Name Required | Yes |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" |
| Key 11 | "UN1954" |
| Key 12 | "COMPRESSED GAS, FLAMMABLE, N.O.S. (Methane mixture)" - technical name in parentheses |
| Key 13 | "2.1" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | Net quantity + packaging |
| Key 17 | "A6.3" or "A6.5" |
| Key 19 | "Ship valve up in vertical position" |

### Expected Package Inspection (Successful)

**Labels Required:**
- FLAMMABLE GAS (Division 2.1) - Red
- Cargo Aircraft Only

**Markings Required:**
- UN1954
- PSN: "COMPRESSED GAS, FLAMMABLE, N.O.S." with technical name "(Methane mixture)"

**POP Marking Validation:**
- Per A6.3/A6.5: DOT cylinders authorized
- Packing group code: X, Y, or Z

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 12 missing technical name for N.O.S. entry | Technical name requirement validation |
| 2 | Package marking shows PSN without technical name | Marking completeness for N.O.S. |
| 3 | Key 19 shows incorrect position statement "Ship horizontal" | Cylinder position statement validation |

---

## Division 2.2 - Non-Flammable Gases (Scenarios 6-10)

---

## Scenario 6: UN1006 - ARGON, COMPRESSED

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1006 |
| PSN | ARGON, COMPRESSED |
| Hazard Class | 2.2 |
| Subsidiary Risk | None |
| Packing Group | None |
| Packaging Paragraph | A6.3, A6.5 |
| Special Provisions | P5 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" |
| Key 11 | "UN1006" |
| Key 12 | "ARGON, COMPRESSED" |
| Key 13 | "2.2" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | Net quantity + packaging (e.g., "1 cylinder x 50 L") |
| Key 17 | "A6.3" or "A6.5" |
| Key 19 | "Ship valve up in vertical position" |

### Expected Package Inspection (Successful)

**Labels Required:**
- NON-FLAMMABLE GAS (Division 2.2) - Green

**Markings Required:**
- UN1006
- PSN: "ARGON, COMPRESSED"

**POP Marking Validation:**
- Per A6.3/A6.5: DOT cylinders 3A, 3AA, 3AL, 3B, 3E, 4AA, 4B, 4BA, 4BW authorized
- Packing group code: X, Y, or Z

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Label shows FLAMMABLE GAS (2.1) instead of NON-FLAMMABLE GAS (2.2) | Label division validation |
| 2 | UN number missing from package | UN number marking validation |
| 3 | Key 11 shows "UN1007" (transposition error) | UN number match validation |

---

## Scenario 7: UN1013 - CARBON DIOXIDE

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1013 |
| PSN | CARBON DIOXIDE |
| Hazard Class | 2.2 |
| Subsidiary Risk | None |
| Packing Group | None |
| Packaging Paragraph | A6.3, A6.4, A6.5 |
| Special Provisions | P5 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" |
| Key 11 | "UN1013" |
| Key 12 | "CARBON DIOXIDE" |
| Key 13 | "2.2" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | Net quantity + packaging |
| Key 17 | "A6.3", "A6.4", or "A6.5" |
| Key 19 | "Ship valve up in vertical position" |

### Expected Package Inspection (Successful)

**Labels Required:**
- NON-FLAMMABLE GAS (Division 2.2) - Green

**Markings Required:**
- UN1013
- PSN: "CARBON DIOXIDE"

**POP Marking Validation:**
- Per A6.3/A6.4/A6.5: DOT cylinders authorized
- Packing group code: X, Y, or Z

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 13 shows "2.3" instead of "2.2" | Hazard class validation |
| 2 | Key 17 shows "A6.11" (cryogenic - wrong for compressed) | Packaging instruction validation |
| 3 | PSN on package shows "CO2" abbreviation instead of full name | PSN completeness validation |

---

## Scenario 8: UN1066 - NITROGEN, COMPRESSED

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1066 |
| PSN | NITROGEN, COMPRESSED |
| Hazard Class | 2.2 |
| Subsidiary Risk | None |
| Packing Group | None |
| Packaging Paragraph | A6.3, A6.5 |
| Special Provisions | P5 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" |
| Key 11 | "UN1066" |
| Key 12 | "NITROGEN, COMPRESSED" |
| Key 13 | "2.2" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | Net quantity + packaging |
| Key 17 | "A6.3" or "A6.5" |
| Key 19 | "Ship valve up in vertical position" |

### Expected Package Inspection (Successful)

**Labels Required:**
- NON-FLAMMABLE GAS (Division 2.2) - Green

**Markings Required:**
- UN1066
- PSN: "NITROGEN, COMPRESSED"

**POP Marking Validation:**
- Per A6.3/A6.5: DOT cylinders authorized
- Packing group code: X, Y, or Z

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 12 shows "NITROGEN, REFRIGERATED LIQUID" (wrong PSN - UN1977) | PSN/UN number match validation |
| 2 | POP marking shows packing group code "W" (invalid code) | Packing group code validation |
| 3 | Key 19 empty (missing cylinder position statement) | Handling information requirement |

---

## Scenario 9: UN1072 - OXYGEN, COMPRESSED (with Subsidiary Risk)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1072 |
| PSN | OXYGEN, COMPRESSED |
| Hazard Class | 2.2 |
| Subsidiary Risk | 5.1 (Oxidizer) |
| Packing Group | None |
| Packaging Paragraph | A6.3, A6.5 |
| Special Provisions | P5, 110 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" |
| Key 11 | "UN1072" |
| Key 12 | "OXYGEN, COMPRESSED" |
| Key 13 | "2.2" |
| Key 14 | "5.1" |
| Key 15 | Empty |
| Key 16 | Net quantity + packaging |
| Key 17 | "A6.3" or "A6.5" |
| Key 19 | "Ship valve up in vertical position" |

### Expected Package Inspection (Successful)

**Labels Required:**
- NON-FLAMMABLE GAS (Division 2.2) - Green OR OXYGEN label
- OXIDIZER (5.1) - subsidiary hazard label - Yellow

**Markings Required:**
- UN1072
- PSN: "OXYGEN, COMPRESSED"

**POP Marking Validation:**
- Per A6.3/A6.5: DOT cylinders authorized
- Packing group code: X, Y, or Z

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 14 empty (missing 5.1 subsidiary risk) | Subsidiary risk validation |
| 2 | Missing OXIDIZER (5.1) subsidiary label on package | Subsidiary label validation |
| 3 | Key 13 shows "5.1" as primary instead of "2.2" | Primary hazard class validation |

---

## Scenario 10: UN1956 - COMPRESSED GAS, N.O.S. (Technical Name Required)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1956 |
| PSN | COMPRESSED GAS, N.O.S. |
| Hazard Class | 2.2 |
| Subsidiary Risk | None |
| Packing Group | None |
| Packaging Paragraph | A6.3, A6.5 |
| Special Provisions | P5 |
| Technical Name Required | Yes |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" |
| Key 11 | "UN1956" |
| Key 12 | "COMPRESSED GAS, N.O.S. (Helium, Neon mixture)" - technical name in parentheses |
| Key 13 | "2.2" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | Net quantity + packaging |
| Key 17 | "A6.3" or "A6.5" |
| Key 19 | "Ship valve up in vertical position" |

### Expected Package Inspection (Successful)

**Labels Required:**
- NON-FLAMMABLE GAS (Division 2.2) - Green

**Markings Required:**
- UN1956
- PSN: "COMPRESSED GAS, N.O.S." with technical name "(Helium, Neon mixture)"

**POP Marking Validation:**
- Per A6.3/A6.5: DOT cylinders authorized
- Packing group code: X, Y, or Z

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 12 shows only "COMPRESSED GAS, N.O.S." without technical name | Technical name requirement validation |
| 2 | Package marking missing technical name | Marking completeness for N.O.S. |
| 3 | Key 17 shows "A6.2" (aerosols - incorrect for compressed gas) | Packaging instruction validation |

---

## Division 2.2 Special Cases + Division 2.3 Introduction (Scenarios 11-15)

---

## Scenario 11: UN1044 - FIRE EXTINGUISHERS

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1044 |
| PSN | FIRE EXTINGUISHERS |
| Details | containing compressed or liquefied gas |
| Hazard Class | 2.2 |
| Subsidiary Risk | None |
| Packing Group | None |
| Packaging Paragraph | A6.7 |
| Special Provisions | P5, 110 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" |
| Key 11 | "UN1044" |
| Key 12 | "FIRE EXTINGUISHERS containing compressed or liquefied gas" |
| Key 13 | "2.2" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | Net quantity + packaging (e.g., "6 fire extinguishers x 5 kg") |
| Key 17 | "A6.7" |
| Key 19 | Not required (special article, not a cylinder) |

### Expected Package Inspection (Successful)

**Labels Required:**
- NON-FLAMMABLE GAS (Division 2.2) - Green

**Markings Required:**
- UN1044
- PSN: "FIRE EXTINGUISHERS"
- "MEETS DOT REQUIREMENTS" marking (per A14.4.2)

**POP Marking Validation:**
- Per A6.7: Fire extinguisher specifications per manufacturer
- No POP marking required on fire extinguisher itself (article)

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Missing "MEETS DOT REQUIREMENTS" marking | Fire extinguisher specific marking validation |
| 2 | Key 17 shows "A6.3" instead of "A6.7" | Packaging instruction validation |
| 3 | Key 13 shows "2.1" instead of "2.2" | Hazard class validation |

---

## Scenario 12: UN1977 - NITROGEN, REFRIGERATED LIQUID (Cryogenic)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1977 |
| PSN | NITROGEN, REFRIGERATED LIQUID |
| Details | cryogenic liquid |
| Hazard Class | 2.2 |
| Subsidiary Risk | None |
| Packing Group | None |
| Packaging Paragraph | A6.11 |
| Special Provisions | P4, 346 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" (P4 special provision) |
| Key 11 | "UN1977" |
| Key 12 | "NITROGEN, REFRIGERATED LIQUID" |
| Key 13 | "2.2" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | Net quantity + packaging |
| Key 17 | "A6.11" |
| Key 19 | Cryogenic handling requirements |

### Expected Package Inspection (Successful)

**Labels Required:**
- NON-FLAMMABLE GAS (Division 2.2) - Green
- Cargo Aircraft Only
- Orientation labels (This Side Up with Arrows) - per A14.4.2 for cryogenic liquids

**Markings Required:**
- UN1977
- PSN: "NITROGEN, REFRIGERATED LIQUID"
- Orientation marking "THIS SIDE UP"

**POP Marking Validation:**
- Per A6.11: Cryogenic liquid containers (Dewars, vacuum-insulated containers)
- Packing group code: X, Y, or Z

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Missing Orientation labels (This Side Up) | Cryogenic liquid orientation requirement |
| 2 | Key 7 shows "Passenger and Cargo Aircraft" (P4 requires CAO) | Aircraft limitation validation |
| 3 | Key 17 shows "A6.5" instead of "A6.11" | Packaging instruction validation for cryogenic |

---

## Scenario 13: UN1950 - AEROSOLS, NON-FLAMMABLE (with Subsidiary Risk)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1950 |
| PSN | AEROSOLS |
| Details | non-flammable, containing substances in Class 8, Packing Group III |
| Hazard Class | 2.2 |
| Subsidiary Risk | 8 (Corrosive) |
| Packing Group | None |
| Packaging Paragraph | A6.2 |
| Special Provisions | P5 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" |
| Key 11 | "UN1950" |
| Key 12 | "AEROSOLS, non-flammable, containing substances in Class 8, Packing Group III" |
| Key 13 | "2.2" |
| Key 14 | "8" |
| Key 15 | Empty |
| Key 16 | Net quantity + packaging |
| Key 17 | "A6.2" |
| Key 19 | Not required for aerosols |

### Expected Package Inspection (Successful)

**Labels Required:**
- NON-FLAMMABLE GAS (Division 2.2) - Green
- CORROSIVE (Class 8) - subsidiary hazard label - White/Black

**Markings Required:**
- UN1950
- PSN: "AEROSOLS, non-flammable, containing substances in Class 8, Packing Group III"

**POP Marking Validation:**
- Per A6.2: Outer packaging boxes or drums
- Packing group code: X, Y, or Z

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 14 empty (missing Class 8 subsidiary) | Subsidiary risk validation |
| 2 | Missing CORROSIVE (8) subsidiary label | Subsidiary label validation |
| 3 | Key 12 shows "AEROSOLS, FLAMMABLE" instead of "AEROSOLS, non-flammable..." | PSN validation for subsidiary variant |

---

## Scenario 14: UN1017 - CHLORINE (Division 2.3 with Multiple Subsidiaries)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1017 |
| PSN | CHLORINE |
| Hazard Class | 2.3 |
| Subsidiary Risk | 5.1, 8 |
| Packing Group | None |
| Packaging Paragraph | A6.4 |
| Special Provisions | P2, 2, N86 |
| Inhalation Hazard Zone | Zone B (implied by P2 and special provision 2) |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" (P2 special provision) |
| Key 11 | "UN1017" |
| Key 12 | "CHLORINE, TOXIC-INHALATION HAZARD, ZONE B" |
| Key 13 | "2.3" |
| Key 14 | "5.1, 8" |
| Key 15 | Empty |
| Key 16 | Net quantity + packaging |
| Key 17 | "A6.4" |
| Key 19 | "Ship valve up in vertical position" |

### Expected Package Inspection (Successful)

**Labels Required:**
- TOXIC GAS (Division 2.3) - White OR TOXIC INHALATION HAZARD label
- OXIDIZER (5.1) - subsidiary hazard label - Yellow
- CORROSIVE (Class 8) - subsidiary hazard label - White/Black
- Cargo Aircraft Only

**Markings Required:**
- UN1017
- PSN: "CHLORINE"
- "INHALATION HAZARD" marking (required for Division 2.3)

**POP Marking Validation:**
- Per A6.4: DOT cylinders authorized for toxic gas
- Packing group code: X, Y, or Z

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 12 missing "TOXIC-INHALATION HAZARD, ZONE B" designation | Inhalation hazard zone validation |
| 2 | Missing "INHALATION HAZARD" marking on package | Division 2.3 marking requirement |
| 3 | Key 14 shows only "5.1" (missing "8" subsidiary) | Multiple subsidiary validation |

---

## Scenario 15: UN1053 - HYDROGEN SULFIDE (Division 2.3 with 2.1 Subsidiary)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1053 |
| PSN | HYDROGEN SULFIDE |
| Hazard Class | 2.3 |
| Subsidiary Risk | 2.1 |
| Packing Group | None |
| Packaging Paragraph | A6.4 |
| Special Provisions | P2, 2, N89 |
| Inhalation Hazard Zone | Zone B |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" |
| Key 11 | "UN1053" |
| Key 12 | "HYDROGEN SULFIDE, TOXIC-INHALATION HAZARD, ZONE B" |
| Key 13 | "2.3" |
| Key 14 | "2.1" |
| Key 15 | Empty |
| Key 16 | Net quantity + packaging |
| Key 17 | "A6.4" |
| Key 19 | "Ship valve up in vertical position" |

### Expected Package Inspection (Successful)

**Labels Required:**
- TOXIC GAS (Division 2.3) - White OR TOXIC INHALATION HAZARD label
- FLAMMABLE GAS (Division 2.1) - subsidiary hazard label - Red
- Cargo Aircraft Only

**Markings Required:**
- UN1053
- PSN: "HYDROGEN SULFIDE"
- "INHALATION HAZARD" marking

**POP Marking Validation:**
- Per A6.4: DOT cylinders authorized
- Packing group code: X, Y, or Z

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 14 empty (missing 2.1 subsidiary) | Subsidiary risk validation for toxic flammable gas |
| 2 | Missing FLAMMABLE GAS (2.1) subsidiary label | Subsidiary label validation |
| 3 | Key 12 shows "ZONE A" instead of "ZONE B" | Inhalation hazard zone accuracy |

---

## Division 2.3 - Toxic Gases with Inhalation Hazard Zones (Scenarios 16-20)

---

## Scenario 16: UN1076 - PHOSGENE (Zone A - Most Dangerous)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1076 |
| PSN | PHOSGENE |
| Hazard Class | 2.3 |
| Subsidiary Risk | 8 |
| Packing Group | None |
| Packaging Paragraph | A6.15 |
| Special Provisions | P1, 1 |
| Inhalation Hazard Zone | Zone A (LC50 ≤200 ppm) |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" (P1 special provision - most restrictive) |
| Key 11 | "UN1076" |
| Key 12 | "PHOSGENE, TOXIC-INHALATION HAZARD, ZONE A" |
| Key 13 | "2.3" |
| Key 14 | "8" |
| Key 15 | Empty |
| Key 16 | Net quantity + packaging |
| Key 17 | "A6.15" |
| Key 19 | "Ship valve up in vertical position" |

### Expected Package Inspection (Successful)

**Labels Required:**
- TOXIC INHALATION HAZARD label (Zone A requires this specific label)
- CORROSIVE (Class 8) - subsidiary hazard label
- Cargo Aircraft Only

**Markings Required:**
- UN1076
- PSN: "PHOSGENE"
- "INHALATION HAZARD" marking
- "POISON" marking (may also be required for Zone A)

**POP Marking Validation:**
- Per A6.15 (special packaging for Zone A): Specific DOT cylinder specifications
- Packing group code: X, Y, or Z

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 12 shows "ZONE B" instead of "ZONE A" | Zone accuracy validation (critical for Zone A materials) |
| 2 | Key 17 shows "A6.4" instead of "A6.15" | Zone A special packaging requirement |
| 3 | Missing "INHALATION HAZARD" marking on package | Toxic gas marking validation |

---

## Scenario 17: UN2199 - PHOSPHINE (Zone A with Flammable Subsidiary)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN2199 |
| PSN | PHOSPHINE |
| Hazard Class | 2.3 |
| Subsidiary Risk | 2.1 |
| Packing Group | None |
| Packaging Paragraph | A6.15 |
| Special Provisions | P1, 1 |
| Inhalation Hazard Zone | Zone A |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" |
| Key 11 | "UN2199" |
| Key 12 | "PHOSPHINE, TOXIC-INHALATION HAZARD, ZONE A" |
| Key 13 | "2.3" |
| Key 14 | "2.1" |
| Key 15 | Empty |
| Key 16 | Net quantity + packaging |
| Key 17 | "A6.15" |
| Key 19 | "Ship valve up in vertical position" |

### Expected Package Inspection (Successful)

**Labels Required:**
- TOXIC INHALATION HAZARD label
- FLAMMABLE GAS (Division 2.1) - subsidiary hazard label - Red
- Cargo Aircraft Only

**Markings Required:**
- UN2199
- PSN: "PHOSPHINE"
- "INHALATION HAZARD" marking

**POP Marking Validation:**
- Per A6.15: Zone A specific packaging
- Packing group code: X, Y, or Z

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 14 empty (missing 2.1 flammable subsidiary) | Subsidiary validation for toxic flammable Zone A |
| 2 | Missing FLAMMABLE GAS subsidiary label | Subsidiary label requirement |
| 3 | Key 17 shows "A6.5" instead of "A6.15" | Zone A packaging instruction validation |

---

## Scenario 18: UN1955 - COMPRESSED GAS, TOXIC, N.O.S. (Zone B)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1955 |
| PSN | COMPRESSED GAS, TOXIC, N.O.S. |
| Details | Inhalation Hazard Zone B |
| Hazard Class | 2.3 |
| Subsidiary Risk | None |
| Packing Group | None |
| Packaging Paragraph | A6.5 |
| Special Provisions | P2, 2 |
| Inhalation Hazard Zone | Zone B |
| Technical Name Required | Yes |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" |
| Key 11 | "UN1955" |
| Key 12 | "COMPRESSED GAS, TOXIC, N.O.S. (Boron trifluoride), TOXIC-INHALATION HAZARD, ZONE B" |
| Key 13 | "2.3" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | Net quantity + packaging |
| Key 17 | "A6.5" |
| Key 19 | "Ship valve up in vertical position" |

### Expected Package Inspection (Successful)

**Labels Required:**
- TOXIC GAS (Division 2.3) - White
- Cargo Aircraft Only

**Markings Required:**
- UN1955
- PSN: "COMPRESSED GAS, TOXIC, N.O.S." with technical name "(Boron trifluoride)"
- "INHALATION HAZARD" marking

**POP Marking Validation:**
- Per A6.5: DOT cylinders authorized for Zone B
- Packing group code: X, Y, or Z

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 12 missing technical name for N.O.S. entry | Technical name requirement for toxic N.O.S. |
| 2 | Key 12 shows "ZONE C" instead of "ZONE B" | Zone designation accuracy |
| 3 | Missing "INHALATION HAZARD" marking on package | Division 2.3 marking requirement |

---

## Scenario 19: UN3160 - LIQUEFIED GAS, TOXIC, FLAMMABLE, N.O.S. (Zone C)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3160 |
| PSN | LIQUEFIED GAS, TOXIC, FLAMMABLE, N.O.S. |
| Details | Inhalation Hazard Zone C |
| Hazard Class | 2.3 |
| Subsidiary Risk | 2.1 |
| Packing Group | None |
| Packaging Paragraph | A6.4 |
| Special Provisions | P2, 3 |
| Inhalation Hazard Zone | Zone C |
| Technical Name Required | Yes |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" |
| Key 11 | "UN3160" |
| Key 12 | "LIQUEFIED GAS, TOXIC, FLAMMABLE, N.O.S. (Methyl bromide mixture), TOXIC-INHALATION HAZARD, ZONE C" |
| Key 13 | "2.3" |
| Key 14 | "2.1" |
| Key 15 | Empty |
| Key 16 | Net quantity + packaging |
| Key 17 | "A6.4" |
| Key 19 | "Ship valve up in vertical position" |

### Expected Package Inspection (Successful)

**Labels Required:**
- TOXIC GAS (Division 2.3) - White
- FLAMMABLE GAS (Division 2.1) - subsidiary hazard label - Red
- Cargo Aircraft Only

**Markings Required:**
- UN3160
- PSN: "LIQUEFIED GAS, TOXIC, FLAMMABLE, N.O.S." with technical name
- "INHALATION HAZARD" marking

**POP Marking Validation:**
- Per A6.4: DOT cylinders authorized
- Packing group code: X, Y, or Z

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 14 empty (missing 2.1 flammable subsidiary) | Subsidiary validation for toxic flammable gas |
| 2 | Key 12 missing technical name | Technical name requirement for N.O.S. |
| 3 | Missing Cargo Aircraft Only label | CAO label requirement for Division 2.3 |

---

## Scenario 20: UN3160 - LIQUEFIED GAS, TOXIC, FLAMMABLE, N.O.S. (Zone D - Least Dangerous)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3160 |
| PSN | LIQUEFIED GAS, TOXIC, FLAMMABLE, N.O.S. |
| Details | Inhalation Hazard Zone D |
| Hazard Class | 2.3 |
| Subsidiary Risk | 2.1 |
| Packing Group | None |
| Packaging Paragraph | A6.4 |
| Special Provisions | P2, 4 |
| Inhalation Hazard Zone | Zone D |
| Technical Name Required | Yes |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" |
| Key 11 | "UN3160" |
| Key 12 | "LIQUEFIED GAS, TOXIC, FLAMMABLE, N.O.S. (Difluoroethane mixture), TOXIC-INHALATION HAZARD, ZONE D" |
| Key 13 | "2.3" |
| Key 14 | "2.1" |
| Key 15 | Empty |
| Key 16 | Net quantity + packaging |
| Key 17 | "A6.4" |
| Key 19 | "Ship valve up in vertical position" |

### Expected Package Inspection (Successful)

**Labels Required:**
- TOXIC GAS (Division 2.3) - White
- FLAMMABLE GAS (Division 2.1) - subsidiary hazard label - Red
- Cargo Aircraft Only

**Markings Required:**
- UN3160
- PSN: "LIQUEFIED GAS, TOXIC, FLAMMABLE, N.O.S." with technical name
- "INHALATION HAZARD" marking

**POP Marking Validation:**
- Per A6.4: DOT cylinders authorized
- Packing group code: X, Y, or Z

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 12 shows "ZONE A" instead of "ZONE D" | Zone designation validation (major safety difference) |
| 2 | Package marking shows UN3162 instead of UN3160 | UN number match validation |
| 3 | Key 7 shows "Passenger and Cargo Aircraft" (toxic gases require CAO) | Aircraft limitation for Division 2.3 |

---

## Quick Reference Tables

### Alteration Categories Covered

| Category | Scenario Numbers | Count |
|----------|------------------|-------|
| Aircraft Limitation (P1-P5) | 1, 4, 12, 20 | 4 |
| UN Number Validation | 3, 6, 20 | 3 |
| Hazard Class/Division | 2, 7, 11 | 3 |
| Subsidiary Risk | 9, 13, 14, 15, 17, 19 | 6 |
| Packaging Instruction | 2, 4, 7, 10, 12, 16, 17 | 7 |
| PSN/Technical Name | 4, 5, 7, 10, 18, 19 | 6 |
| Label Validation | 3, 6, 9, 13, 15, 17 | 6 |
| Marking Validation | 11, 14, 15, 16, 18 | 5 |
| POP Marking (Packaging Code) | 2, 8 | 2 |
| Inhalation Hazard Zone | 14, 15, 16, 18, 20 | 5 |
| Cylinder Position (Key 19) | 1, 5, 8 | 3 |
| CAO Label | 1, 2, 19 | 3 |

### Division Coverage

| Division | Scenarios | Count |
|----------|-----------|-------|
| 2.1 (Flammable Gas) | 1, 2, 3, 4, 5 | 5 |
| 2.2 (Non-Flammable Gas) | 6, 7, 8, 9, 10, 11, 12, 13 | 8 |
| 2.3 (Toxic Gas) | 14, 15, 16, 17, 18, 19, 20 | 7 |

### Special Features Coverage

| Feature | Scenario Numbers |
|---------|------------------|
| N.O.S. (Technical Name Required) | 5, 10, 18, 19, 20 |
| Subsidiary Risk - Single | 9, 15, 16, 17, 18, 19, 20 |
| Subsidiary Risk - Multiple | 13, 14 |
| Cryogenic Liquid | 12 |
| Aerosols | 4, 13 |
| Fire Extinguishers | 11 |
| Zone A (Most Dangerous) | 16, 17 |
| Zone B | 14, 15, 18 |
| Zone C | 19 |
| Zone D (Least Dangerous) | 20 |
| P4 (CAO Required) | 1, 2, 3, 5, 12 |
| P5 (Passenger Aircraft Allowed) | 4, 6, 7, 8, 9, 10, 11, 13 |
| P1 (Most Restrictive CAO) | 16, 17 |
| P2 (CAO Required) | 14, 15, 18, 19, 20 |

### Packaging Paragraph Coverage

| Paragraph | Purpose | Scenario Numbers |
|-----------|---------|------------------|
| A6.2 | Aerosols | 4, 13 |
| A6.3 | Small Receptacles/Compressed Gas | 2, 3, 5, 6, 7, 8, 9, 10 |
| A6.4 | Liquefied Compressed Gas | 7, 14, 15, 19, 20 |
| A6.5 | Nonliquefied Compressed Gas | 5, 6, 7, 8, 9, 10, 18 |
| A6.6 | Liquefied Petroleum Gas | 2, 3 |
| A6.7 | Fire Extinguishers | 11 |
| A6.9 | Acetylene Gas | 1 |
| A6.11 | Cryogenic Liquids | 12 |
| A6.15 | Zone A Toxic Gases | 16, 17 |

---

## Test Execution Notes

### Before Testing
1. Ensure the mobile device has the latest HazPro app version installed
2. Clear any cached inspection data from previous tests
3. Have AFMAN 24-604 Attachments 6, 14, 15, and 17 available for reference
4. Prepare mock SDDG documents with the specified values and alterations

### During Testing
1. Complete both SDDG and Package inspection for each scenario
2. Document any frustrations that are NOT detected by the app
3. Document any false positives (frustrations detected when they shouldn't be)
4. Note the user experience and any confusing prompts or screens
5. Capture screenshots of any unexpected behavior

### Key Class 2 Considerations
1. **Key 19 Requirement**: Unlike Class 1, Class 2 materials require handling information in Key 19 (cylinder position statement)
2. **No EX Number**: Class 2 does not require EX number marking (that's Class 1 only)
3. **Zone Designation**: Division 2.3 toxic gases require "TOXIC-INHALATION HAZARD, ZONE X" in Key 12
4. **INHALATION HAZARD Marking**: Required on all Division 2.3 packages
5. **Cylinder Packaging**: Most Class 2 materials use DOT cylinder specifications, not boxes/drums
6. **Packing Group**: May or may not be present depending on material - some Class 2 materials have packing groups, many do not
7. **Aerosol Exceptions**: Aerosols (A6.2) don't require cylinder position statements

### After Testing
1. Compile all test results into a summary report
2. Categorize issues by severity (critical, major, minor)
3. Create bug reports for any validation failures
4. Update test scenarios if regulations or app logic have changed
