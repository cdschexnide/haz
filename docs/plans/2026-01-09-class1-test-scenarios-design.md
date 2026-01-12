# Class 1 (Explosives) Test Scenarios

## Overview

This document contains 20 comprehensive manual test scenarios for the HazPro mobile app Inspector workflow, focusing on Class 1 (Explosives) materials. Each scenario is based on AFMAN 24-604 regulations (Attachments 5, 14, 15, and 17).

### Purpose

These scenarios are designed for manual testing by physically running through the app. Each scenario includes:
- **Material Details**: UN number, PSN, hazard class, packaging paragraph, special provisions
- **Expected SDDG Inspection**: What a successful SDDG should contain (Keys 7, 11-17)
- **Expected Package Inspection**: Required labels, markings, and POP marking validation
- **Alterations**: Intentional errors to test frustration handling

### Class 1 Division Reference

| Division | Description | Example |
|----------|-------------|---------|
| 1.1 | Mass explosion hazard | UN0224 Barium Azide |
| 1.2 | Projection hazard | UN0136 Mines |
| 1.3 | Fire hazard, minor blast/projection | UN0247 Ammunition, Incendiary |
| 1.4 | Minor explosion hazard | UN0106 Fuzes, Detonating |
| 1.4S | No significant hazard | UN0012 Small Arms Cartridges |
| 1.5 | Very insensitive, mass explosion | UN0331 Explosive, Blasting, Type B |
| 1.6 | Extremely insensitive | UN0486 Articles, EEI |

### Key Validation Points

**SDDG Keys (per Attachment 17):**
- Key 7: Aircraft Limitations (CAO vs Passenger and Cargo)
- Key 11: UN/NA/ID Number (with RQ prefix if applicable)
- Key 12: Proper Shipping Name (with technical name for N.O.S.)
- Key 13: Class and Division with Compatibility Group (DOD IBD if applicable)
- Key 14: Subsidiary Hazard (if applicable)
- Key 15: Packing Group (empty for Class 1)
- Key 16: Quantity and Type of Packing (with NEW for explosives)
- Key 17: Packaging Instructions (A5.xx paragraph)

**Package Inspection:**
- Primary hazard label with compatibility group
- Subsidiary hazard labels (if Key 14 populated)
- Cargo Aircraft Only label (if P1-P4 or CAO aircraft type)
- Orientation labels (for specific materials like UN0247)
- UN number and PSN markings
- EX number marking
- Military Shipping Label (MSL)
- POP Marking with PG code X or Y (Class 1 requires PG I or II)

---

## Scenario 1: UN0224 - BARIUM AZIDE, DRY

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN0224 |
| PSN | BARIUM AZIDE, DRY or wetted with less than 50% water, by mass |
| Hazard Class | 1.1A |
| Packaging Paragraph | A5.2 |
| Special Provisions | None |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" (1.1A is CAO only) |
| Key 11 | "UN0224" |
| Key 12 | "BARIUM AZIDE, DRY or wetted with less than 50% water, by mass" |
| Key 13 | "1.1A" |
| Key 14 | Empty |
| Key 15 | Empty (Class 1) |
| Key 16 | Net quantity + packaging (e.g., "1 fiberboard box (4G) x 0.5 kg") |
| Key 17 | "A5.2" |

### Expected Package Inspection (Successful)

**Labels Required:**
- EXPLOSIVE 1.1 with compatibility group A

**Markings Required:**
- UN0224
- PSN: "BARIUM AZIDE, DRY or wetted with less than 50% water, by mass"
- EX number
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Valid packaging code from A5.2 (4G boxes authorized)
- Packing group code: X or Y

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | POP marking shows packing group "Z" | PG validation (Class 1 requires X or Y) |
| 2 | Missing EX number marking | EX Number validation |
| 3 | Key 13 shows "1.1" without compatibility group "A" | Hazard class completeness validation |

---

## Scenario 2: UN0027 - BLACK POWDER (GUNPOWDER)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN0027 |
| PSN | BLACK POWDER (GUNPOWDER), granular or as a meal |
| Hazard Class | 1.1D |
| Packaging Paragraph | A5.3 |
| Special Provisions | None |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" |
| Key 11 | "UN0027" |
| Key 12 | "BLACK POWDER (GUNPOWDER), granular or as a meal" |
| Key 13 | "1.1D" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | Net quantity + packaging (e.g., "2 wooden boxes x 4.5 kg (10 pounds)") |
| Key 17 | "A5.3" |

### Expected Package Inspection (Successful)

**Labels Required:**
- EXPLOSIVE 1.1 with compatibility group D

**Markings Required:**
- UN0027
- PSN: "BLACK POWDER (GUNPOWDER), granular or as a meal"
- EX number
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Allowed codes per A5.3:
  - Drums: 1A2, 1B2, 1D, 1G, 1H2
  - Boxes: 4C1, 4C2, 4D, 4F, 4G
- Packing group code: X or Y

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | POP marking shows "4H1" (not authorized for A5.3) | Packaging code validation |
| 2 | Key 12 missing "(GUNPOWDER)" qualifier | PSN completeness validation |
| 3 | MSL missing from package | Military Shipping Label check |

---

## Scenario 3: UN0004 - AMMONIUM PICRATE

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN0004 |
| PSN | AMMONIUM PICRATE, dry or wetted with less than 10% water, by mass |
| Hazard Class | 1.1D |
| Packaging Paragraph | A5.2 |
| Special Provisions | None |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" |
| Key 11 | "UN0004" |
| Key 12 | "AMMONIUM PICRATE, dry or wetted with less than 10% water, by mass" |
| Key 13 | "1.1D" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | Net quantity + packaging |
| Key 17 | "A5.2" |

### Expected Package Inspection (Successful)

**Labels Required:**
- EXPLOSIVE 1.1 with compatibility group D

**Markings Required:**
- UN0004
- PSN: "AMMONIUM PICRATE, dry or wetted with less than 10% water, by mass"
- EX number
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Per A5.2 (4G boxes authorized)
- Packing group code: X or Y

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Label shows "EXPLOSIVE 1" without division ".1" | Label division validation |
| 2 | UN number on package shows "UN0005" (transposition) | UN number match with SDDG Key 11 |
| 3 | POP marking shows PG code "Z" | Packing group validation |

---

## Scenario 4: UN0160 - POWDER, SMOKELESS

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN0160 |
| PSN | POWDER, SMOKELESS |
| Hazard Class | 1.1C |
| Packaging Paragraph | A5.21 |
| Special Provisions | None |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" |
| Key 11 | "UN0160" |
| Key 12 | "POWDER, SMOKELESS" |
| Key 13 | "1.1C" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | Net quantity + packaging |
| Key 17 | "A5.21" |

### Expected Package Inspection (Successful)

**Labels Required:**
- EXPLOSIVE 1.1 with compatibility group C

**Markings Required:**
- UN0160
- PSN: "POWDER, SMOKELESS"
- EX number
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Per A5.21 requirements
- Packing group code: X or Y

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 17 shows "A5.2" instead of "A5.21" | Packaging instruction validation |
| 2 | Label shows compatibility group "D" instead of "C" | Compatibility group validation |
| 3 | EX number format incorrect (missing required digits) | EX number format validation |

---

## Scenario 5: UN0136 - MINES with bursting charge

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN0136 |
| PSN | MINES with bursting charge |
| Hazard Class | 1.2D |
| Packaging Paragraph | A5.10 |
| Special Provisions | None |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" |
| Key 11 | "UN0136" |
| Key 12 | "MINES with bursting charge" |
| Key 13 | "1.2D" (per Key 13.1, may include DOD IBD on separate line) |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | Net quantity + packaging + NEW (Net Explosive Weight) |
| Key 17 | "A5.10" |

### Expected Package Inspection (Successful)

**Labels Required:**
- EXPLOSIVE 1.2 with compatibility group D

**Markings Required:**
- UN0136
- PSN: "MINES with bursting charge"
- EX number
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Per A5.10 requirements
- Packing group code: X or Y

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 16 missing NEW (Net Explosive Weight) | Quantity validation for explosives |
| 2 | Package shows EXPLOSIVE 1.1D label instead of 1.2D | Division validation |
| 3 | Key 13 shows "1.2" without compatibility group | Hazard class completeness |

---

## Scenario 6: UN0328 - CARTRIDGES FOR WEAPONS, INERT PROJECTILE

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN0328 |
| PSN | CARTRIDGES FOR WEAPONS, INERT PROJECTILE |
| Hazard Class | 1.2C |
| Packaging Paragraph | A5.5 |
| Special Provisions | None |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" |
| Key 11 | "UN0328" |
| Key 12 | "CARTRIDGES FOR WEAPONS, INERT PROJECTILE" |
| Key 13 | "1.2C" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | Net quantity + packaging + NEW |
| Key 17 | "A5.5" |

### Expected Package Inspection (Successful)

**Labels Required:**
- EXPLOSIVE 1.2 with compatibility group C

**Markings Required:**
- UN0328
- PSN: "CARTRIDGES FOR WEAPONS, INERT PROJECTILE"
- EX number
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Per A5.5 requirements
- Packing group code: X or Y

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | PSN on package abbreviated to "CART FOR WEAPONS" | PSN completeness validation |
| 2 | POP marking missing entirely | UN specification marking validation |
| 3 | Key 11 shows "UN0329" (similar UN number) | UN number match |

---

## Scenario 7: UN0247 - AMMUNITION, INCENDIARY

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN0247 |
| PSN | AMMUNITION, INCENDIARY with or without burster, expelling charge or propelling charge |
| Hazard Class | 1.3J |
| Packaging Paragraph | A5.12 |
| Special Provisions | P3 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" (triggered by P3 special provision) |
| Key 11 | "UN0247" |
| Key 12 | "AMMUNITION, INCENDIARY with or without burster, expelling charge or propelling charge" |
| Key 13 | "1.3J" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | Net quantity + packaging + NEW |
| Key 17 | "A5.12" |

### Expected Package Inspection (Successful)

**Labels Required:**
- EXPLOSIVE 1.3 with compatibility group J
- Cargo Aircraft Only
- Orientation (This Side Up with Arrows) - required for liquid incendiary ammunition

**Markings Required:**
- UN0247
- PSN: "AMMUNITION, INCENDIARY with or without burster, expelling charge or propelling charge"
- EX number
- Military Shipping Label (MSL)
- "THIS SIDE UP" marking

**POP Marking Validation:**
- Per A5.12:
  - Boxes: 4A, 4B, 4C1, 4C2, 4D, 4F, 4G, 4H1, 4H2, 4N
  - Drums allowed
- Packing group code: X or Y

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Missing Orientation label (This Side Up with Arrows) | Orientation label validation for liquid incendiary |
| 2 | Key 7 shows "Passenger and Cargo Aircraft" (P3 requires CAO) | Aircraft limitation validation |
| 3 | Missing Cargo Aircraft Only label on package | CAO label validation |

---

## Scenario 8: UN0049 - CARTRIDGES, FLASH

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN0049 |
| PSN | CARTRIDGES, FLASH |
| Hazard Class | 1.3G |
| Packaging Paragraph | A5.5 |
| Special Provisions | None |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" |
| Key 11 | "UN0049" |
| Key 12 | "CARTRIDGES, FLASH" |
| Key 13 | "1.3G" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | Net quantity + packaging + NEW |
| Key 17 | "A5.5" |

### Expected Package Inspection (Successful)

**Labels Required:**
- EXPLOSIVE 1.3 with compatibility group G

**Markings Required:**
- UN0049
- PSN: "CARTRIDGES, FLASH"
- EX number
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Per A5.5 requirements
- Packing group code: X or Y

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Label shows "1.1G" instead of "1.3G" | Division validation |
| 2 | Key 16 shows quantity in pounds only without metric | Metric requirement (Key 16.4.2) |
| 3 | EX number missing from package | EX number validation |

---

## Scenario 9: UN0106 - FUZES, DETONATING

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN0106 |
| PSN | FUZES, DETONATING |
| Hazard Class | 1.4B |
| Packaging Paragraph | A5.9 |
| Special Provisions | P1 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" (triggered by P1 special provision) |
| Key 11 | "UN0106" |
| Key 12 | "FUZES, DETONATING" |
| Key 13 | "1.4B" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | Net quantity + packaging + NEW |
| Key 17 | "A5.9" |

### Expected Package Inspection (Successful)

**Labels Required:**
- EXPLOSIVE 1.4 with compatibility group B
- Cargo Aircraft Only

**Markings Required:**
- UN0106
- PSN: "FUZES, DETONATING"
- EX number
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Per A5.9 requirements
- Packing group code: X or Y

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Missing CAO label despite P1 special provision | CAO label validation |
| 2 | Key 13 shows "1.4S" instead of "1.4B" | Compatibility group validation (S vs B significant) |
| 3 | Package marking shows "FUSES" instead of "FUZES" | PSN spelling validation |

---

## Scenario 10: UN0325 - IGNITERS

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN0325 |
| PSN | IGNITERS |
| Hazard Class | 1.4G |
| Packaging Paragraph | A5.11 |
| Special Provisions | None |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" |
| Key 11 | "UN0325" |
| Key 12 | "IGNITERS" |
| Key 13 | "1.4G" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | Net quantity + packaging + NEW |
| Key 17 | "A5.11" |

### Expected Package Inspection (Successful)

**Labels Required:**
- EXPLOSIVE 1.4 with compatibility group G

**Markings Required:**
- UN0325
- PSN: "IGNITERS"
- EX number
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Per A5.11 requirements
- Packing group code: X or Y

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | POP marking shows packaging code not authorized by A5.11 | Packaging code validation |
| 2 | Key 17 shows "A5.1" instead of "A5.11" | Packaging instruction validation |
| 3 | UN number marking shows "UN0325" but stencil is faded/illegible | Marking legibility validation |

---

## Scenario 11: UN0012 - CARTRIDGES FOR WEAPONS, INERT PROJECTILE (1.4S)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN0012 |
| PSN | CARTRIDGES FOR WEAPONS, INERT PROJECTILE or CARTRIDGES, SMALL ARMS |
| Hazard Class | 1.4S |
| Packaging Paragraph | A5.5 |
| Special Provisions | P5 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" (P5 allows passenger aircraft) |
| Key 11 | "UN0012" |
| Key 12 | "CARTRIDGES FOR WEAPONS, INERT PROJECTILE" or "CARTRIDGES, SMALL ARMS" |
| Key 13 | "1.4S" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | Net quantity + packaging |
| Key 17 | "A5.5" |

### Expected Package Inspection (Successful)

**Labels Required:**
- EXPLOSIVE 1.4 with compatibility group S (Note: 1.4S has minimal hazard label)
- NO Cargo Aircraft Only label (P5 allows passenger)

**Markings Required:**
- UN0012
- PSN: "CARTRIDGES FOR WEAPONS, INERT PROJECTILE" or "CARTRIDGES, SMALL ARMS"
- EX number
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Per A5.5 requirements
- Packing group code: X or Y

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 7 shows "Cargo Aircraft Only" when P5 allows passenger | Aircraft limitation validation (overly restrictive) |
| 2 | Label shows "1.4G" instead of "1.4S" | Compatibility group validation (S is unique) |
| 3 | Package labeled as CAO when material is P5 | Label/SDDG consistency |

---

## Scenario 12: UN0331 - EXPLOSIVE, BLASTING, TYPE B

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN0331 |
| PSN | EXPLOSIVE, BLASTING, TYPE B |
| Hazard Class | 1.5D |
| Packaging Paragraph | A5.1 |
| Special Provisions | None |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" |
| Key 11 | "UN0331" |
| Key 12 | "EXPLOSIVE, BLASTING, TYPE B" |
| Key 13 | "1.5D" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | Net quantity + packaging + NEW |
| Key 17 | "A5.1" |

### Expected Package Inspection (Successful)

**Labels Required:**
- EXPLOSIVE 1.5 with compatibility group D (orange label with "1.5" and "D")

**Markings Required:**
- UN0331
- PSN: "EXPLOSIVE, BLASTING, TYPE B"
- EX number
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Per A5.1 requirements
- Packing group code: X or Y

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Label shows "EXPLOSIVE 1.1D" instead of "1.5D" | Division validation (1.5 is distinct) |
| 2 | Key 12 shows "EXPLOSIVE, BLASTING, TYPE A" instead of "TYPE B" | PSN validation |
| 3 | POP marking shows PG code "Z" | Packing group validation |

---

## Scenario 13: UN0486 - ARTICLES, EXPLOSIVE, EXTREMELY INSENSITIVE (ARTICLES, EEI)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN0486 |
| PSN | ARTICLES, EXPLOSIVE, EXTREMELY INSENSITIVE (ARTICLES, EEI) |
| Hazard Class | 1.6N |
| Packaging Paragraph | A5.27 |
| Special Provisions | None |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" |
| Key 11 | "UN0486" |
| Key 12 | "ARTICLES, EXPLOSIVE, EXTREMELY INSENSITIVE" or "ARTICLES, EEI" |
| Key 13 | "1.6N" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | Net quantity + packaging + NEW |
| Key 17 | "A5.27" |

### Expected Package Inspection (Successful)

**Labels Required:**
- EXPLOSIVE 1.6 with compatibility group N

**Markings Required:**
- UN0486
- PSN: "ARTICLES, EXPLOSIVE, EXTREMELY INSENSITIVE" or "ARTICLES, EEI"
- EX number
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Per A5.27 requirements
- Packing group code: X or Y

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 13 shows "1.6" without compatibility group "N" | Compatibility group validation |
| 2 | PSN abbreviated incorrectly on package | PSN completeness |
| 3 | Key 17 shows "A5.2" instead of "A5.27" | Packaging instruction validation |

---

## Scenario 14: UN0222 - AMMONIUM NITRATE (with Subsidiary Risk)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN0222 |
| PSN | AMMONIUM NITRATE with more than 0.2% combustible substances |
| Hazard Class | 1.1D |
| Subsidiary Risk | 5.1 (Oxidizer) |
| Packaging Paragraph | A5.2 |
| Special Provisions | None |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" |
| Key 11 | "UN0222" |
| Key 12 | "AMMONIUM NITRATE with more than 0.2% combustible substances, including any organic substance calculated as carbon, to the exclusion of any other added substance" |
| Key 13 | "1.1D" |
| Key 14 | "5.1" (Oxidizer subsidiary risk) |
| Key 15 | Empty |
| Key 16 | Net quantity + packaging + NEW |
| Key 17 | "A5.2" |

### Expected Package Inspection (Successful)

**Labels Required:**
- EXPLOSIVE 1.1 with compatibility group D (primary)
- OXIDIZER 5.1 (subsidiary)

**Markings Required:**
- UN0222
- PSN: "AMMONIUM NITRATE with more than 0.2% combustible substances..."
- EX number
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Per A5.2 requirements
- Packing group code: X or Y

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Missing OXIDIZER 5.1 subsidiary label | Subsidiary hazard label validation |
| 2 | Key 14 left empty when subsidiary risk exists | SDDG subsidiary risk validation |
| 3 | Subsidiary label shows wrong class (e.g., 4.1 instead of 5.1) | Subsidiary label correctness |

---

## Scenario 15: UN0019 - AMMUNITION, TEAR-PRODUCING (with Subsidiary Risk)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN0019 |
| PSN | AMMUNITION, TEAR-PRODUCING with burster, expelling charge, or propelling charge |
| Hazard Class | 1.4G |
| Subsidiary Risk | 6.1 (Toxic) |
| Packaging Paragraph | A5.12 |
| Special Provisions | None |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" |
| Key 11 | "UN0019" |
| Key 12 | "AMMUNITION, TEAR-PRODUCING with burster, expelling charge, or propelling charge" |
| Key 13 | "1.4G" |
| Key 14 | "6.1" (Toxic subsidiary risk) |
| Key 15 | Empty |
| Key 16 | Net quantity + packaging + NEW |
| Key 17 | "A5.12" |

### Expected Package Inspection (Successful)

**Labels Required:**
- EXPLOSIVE 1.4 with compatibility group G (primary)
- TOXIC 6.1 (subsidiary)

**Markings Required:**
- UN0019
- PSN: "AMMUNITION, TEAR-PRODUCING with burster, expelling charge, or propelling charge"
- EX number
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Per A5.12 requirements
- Packing group code: X or Y

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | TOXIC 6.1 subsidiary label missing | Subsidiary label validation |
| 2 | Key 14 shows "6.2" instead of "6.1" | Subsidiary risk accuracy (6.2 is Infectious, not Toxic) |
| 3 | Labels present but positioned incorrectly (subsidiary covering primary) | Label placement validation |

---

## Scenario 16: UN0124 - JET PERFORATING GUNS, CHARGED

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN0124 |
| PSN | JET PERFORATING GUNS, CHARGED, oil well, without detonator |
| Hazard Class | 1.1D |
| Packaging Paragraph | A5.10 |
| Special Provisions | None |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" |
| Key 11 | "UN0124" |
| Key 12 | "JET PERFORATING GUNS, CHARGED, oil well, without detonator" |
| Key 13 | "1.1D" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | Net quantity + packaging + NEW |
| Key 17 | "A5.10" |

### Expected Package Inspection (Successful)

**Labels Required:**
- EXPLOSIVE 1.1 with compatibility group D

**Markings Required:**
- UN0124
- PSN: "JET PERFORATING GUNS, CHARGED, oil well, without detonator" (full descriptor)
- EX number
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Per A5.10 requirements
- Packing group code: X or Y

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | PSN on package missing "without detonator" qualifier | PSN completeness (safety-critical descriptor) |
| 2 | Key 16 missing NEW for explosive article | Explosive quantity format validation |
| 3 | Package shows "JET GUNS" abbreviated PSN | PSN abbreviation validation |

---

## Scenario 17: UN0135 - MERCURY FULMINATE, WETTED (RQ Material)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN0135 |
| PSN | MERCURY FULMINATE, WETTED with not less than 20% water, or mixture of alcohol and water, by mass |
| Hazard Class | 1.1A |
| Packaging Paragraph | A5.2 |
| Special Provisions | RQ (Reportable Quantity) |
| RQ Threshold | 10 lbs |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" |
| Key 11 | "RQ, UN0135" (RQ prefix required per Key 11.1) |
| Key 12 | "MERCURY FULMINATE, WETTED with not less than 20% water, or mixture of alcohol and water, by mass" |
| Key 13 | "1.1A" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | Net quantity + packaging + NEW (must exceed RQ threshold) |
| Key 17 | "A5.2" |

### Expected Package Inspection (Successful)

**Labels Required:**
- EXPLOSIVE 1.1 with compatibility group A

**Markings Required:**
- UN0135
- PSN: "MERCURY FULMINATE, WETTED with not less than 20% water, or mixture of alcohol and water, by mass"
- EX number
- Military Shipping Label (MSL)
- "RQ" marking on package

**POP Marking Validation:**
- Per A5.2 requirements
- Packing group code: X or Y

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 11 missing "RQ" prefix when quantity exceeds reportable threshold | RQ validation |
| 2 | Package missing "RQ" marking | RQ marking validation |
| 3 | Key 12 missing wetted percentage qualifier | PSN completeness for wetted explosives |

---

## Scenario 18: UN0473 - SUBSTANCES, EXPLOSIVE, N.O.S. (Technical Name Required)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN0473 |
| PSN | SUBSTANCES, EXPLOSIVE, N.O.S. |
| Technical Name | (Lead Styphnate) |
| Hazard Class | 1.1A |
| Packaging Paragraph | A5.2 |
| Special Provisions | None |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" |
| Key 11 | "UN0473" |
| Key 12 | "SUBSTANCES, EXPLOSIVE, N.O.S. (Lead Styphnate)" (per Key 12.1 - technical name required for N.O.S.) |
| Key 13 | "1.1A" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | Net quantity + packaging + NEW |
| Key 17 | "A5.2" |

### Expected Package Inspection (Successful)

**Labels Required:**
- EXPLOSIVE 1.1 with compatibility group A

**Markings Required:**
- UN0473
- PSN: "SUBSTANCES, EXPLOSIVE, N.O.S. (Lead Styphnate)" with technical name in parentheses
- EX number
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Per A5.2 requirements
- Packing group code: X or Y

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 12 shows "SUBSTANCES, EXPLOSIVE, N.O.S." without technical name | N.O.S. technical name requirement |
| 2 | Package marking shows technical name but not in parentheses | Technical name format |
| 3 | Technical name on package doesn't match Key 12 | PSN/marking consistency |

---

## Scenario 19: UN0059 - CHARGES, SHAPED, without detonator (Multiple Package Configuration)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN0059 |
| PSN | CHARGES, SHAPED, without detonator |
| Hazard Class | 1.1D |
| Packaging Paragraph | A5.6 |
| Special Provisions | None |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" |
| Key 11 | "UN0059" |
| Key 12 | "CHARGES, SHAPED, without detonator" |
| Key 13 | "1.1D" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | "3 wooden boxes (4C1) x 120 kg (264.6 pounds) NEW" (per Key 16.4.4 format for explosives) |
| Key 17 | "A5.6" |

### Expected Package Inspection (Successful)

**Labels Required:**
- EXPLOSIVE 1.1 with compatibility group D (on each package)

**Markings Required (on each package):**
- UN0059
- PSN: "CHARGES, SHAPED, without detonator"
- EX number
- Military Shipping Label (MSL)

**POP Marking Validation:**
- 4C1 per A5.6
- Packing group code: X or Y

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 16 shows "3 boxes x 120 kg" without packaging code descriptor | Quantity format validation |
| 2 | Only 2 of 3 packages have required labels | Per-package label validation |
| 3 | NEW shown in pounds only "264.6 pounds NEW" without metric | Metric requirement (Key 16.4.2) |

---

## Scenario 20: UN0354 - ARTICLES, EXPLOSIVE, N.O.S. (N.O.S. with IBD)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN0354 |
| PSN | ARTICLES, EXPLOSIVE, N.O.S. |
| Technical Name | (Detonating Cord Assembly) |
| Hazard Class | 1.4D |
| IBD (Inhabited Building Distance) | 60 ft |
| Packaging Paragraph | A5.27 |
| Special Provisions | None |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" |
| Key 11 | "UN0354" |
| Key 12 | "ARTICLES, EXPLOSIVE, N.O.S. (Detonating Cord Assembly)" |
| Key 13 | "1.4D" with separate line "DOD IBD 60 ft" (per Key 13.1) |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | Net quantity + packaging + NEW |
| Key 17 | "A5.27" |
| Key 19 | May contain additional IBD/subdivision information |

### Expected Package Inspection (Successful)

**Labels Required:**
- EXPLOSIVE 1.4 with compatibility group D

**Markings Required:**
- UN0354
- PSN: "ARTICLES, EXPLOSIVE, N.O.S. (Detonating Cord Assembly)" with technical name
- EX number
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Per A5.27 requirements
- Packing group code: X or Y

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 13 missing DOD IBD information when required | IBD documentation validation |
| 2 | N.O.S. entry without technical name on package | N.O.S. marking requirement |
| 3 | Key 12 technical name doesn't match EX number approval document | Technical name/EX consistency |

---

## Quick Reference: Alteration Categories

| Category | Scenarios | Description |
|----------|-----------|-------------|
| **Packing Group** | 1, 3, 12 | POP marking shows "Z" instead of X/Y |
| **Missing Labels** | 7, 9, 14, 15 | CAO, Orientation, or Subsidiary labels missing |
| **SDDG Key Errors** | 2, 4, 5, 8, 10, 13 | Key values incorrect or incomplete |
| **PSN Issues** | 2, 6, 16, 18 | PSN abbreviated, incomplete, or misspelled |
| **UN Number Mismatch** | 3, 6 | Package UN doesn't match SDDG |
| **Compatibility Group** | 1, 9, 11, 13 | Wrong or missing compatibility group |
| **Division Errors** | 3, 5, 8, 12 | Wrong division number on label |
| **EX Number** | 1, 4, 8 | Missing or malformed EX number |
| **Packaging Code** | 2, 10 | Unauthorized packaging code for paragraph |
| **Quantity Format** | 5, 8, 16, 19 | Missing NEW, metric, or proper format |
| **RQ Requirements** | 17 | Missing RQ prefix or marking |
| **N.O.S. Technical Name** | 18, 20 | Missing or incorrect technical name |
| **Subsidiary Risk** | 14, 15 | Missing or wrong subsidiary information |
| **Aircraft Limitations** | 7, 11 | CAO vs Passenger mismatch |
| **MSL** | 2 | Missing Military Shipping Label |

---

## Test Execution Notes

1. **Setup**: For each scenario, prepare physical or mock materials matching the "Material Details"
2. **SDDG Phase**: Upload/parse an SDDG matching the "Expected SDDG" values, verify all Keys pass
3. **Package Phase**: Present package with correct labels/markings, verify ML detection and OCR work
4. **Alteration Phase**: Apply one alteration at a time, verify frustration is captured correctly
5. **Completion**: Verify AMC Form 1015 populates with correct frustration mappings

### Division Coverage Summary

| Division | Scenarios |
|----------|-----------|
| 1.1 | 1, 2, 3, 4, 14, 16, 17, 18, 19 |
| 1.2 | 5, 6 |
| 1.3 | 7, 8 |
| 1.4 | 9, 10, 15, 20 |
| 1.4S | 11 |
| 1.5 | 12 |
| 1.6 | 13 |

### Special Feature Coverage

| Feature | Scenarios |
|---------|-----------|
| Subsidiary Risk | 14, 15 |
| RQ Materials | 17 |
| N.O.S. with Technical Name | 18, 20 |
| Orientation Labels | 7 |
| P5 (Passenger Allowed) | 11 |
| P1-P4 (CAO Required) | 7, 9 |
| IBD Documentation | 20 |
| Multiple Package Config | 19 |
| Wetted Explosives | 3, 17 |
