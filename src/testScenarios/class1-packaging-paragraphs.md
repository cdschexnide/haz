# Class 1 (Explosives) Test Scenarios by Packaging Paragraph

## Overview

This document contains 24 comprehensive manual test scenarios for the HazPro mobile app Inspector workflow, covering **one material for each packaging paragraph from A5.4 through A5.27**. Each scenario is based on AFMAN 24-604 regulations (Attachments 5, 14, 15, and 17).

### Purpose

These scenarios are designed for manual testing by physically running through the app. Each scenario includes:
- **Material Details**: UN number, PSN, hazard class, packaging paragraph, special provisions
- **Expected SDDG Inspection**: What a successful SDDG should contain (Keys 7, 11-17)
- **Expected Package Inspection**: Required labels, markings, and POP marking validation
- **Alterations**: Intentional errors to test frustration handling

### Packaging Paragraph Coverage

| Paragraph | Material Type | Test Scenario |
|-----------|---------------|---------------|
| A5.4 | Wetted Primary Explosives | Scenario 1 |
| A5.5 | Powder Cake/Paste, Nitrocellulose Plasticized | Scenario 2 |
| A5.6 | Secondary Explosives (HMX, RDX, TNT) | Scenario 3 |
| A5.7 | Desensitized Explosives, Nitro Compounds | Scenario 4 |
| A5.8 | Black Powder, Flash Powder | Scenario 5 |
| A5.9 | Propellants, Nitro Salts | Scenario 6 |
| A5.10 | Nitroglycerin, Liquid Propellants | Scenario 7 |
| A5.11 | Blasting Explosives, ANFO | Scenario 8 |
| A5.12 | Ammunition, Military Ordnance | Scenario 9 |
| A5.13 | Detonators, Electric | Scenario 10 |
| A5.14 | Detonators, Non-Electric | Scenario 11 |
| A5.15 | Boosters, Supplementary Charges | Scenario 12 |
| A5.16 | Boosters w/Detonator, Primers, Tracers | Scenario 13 |
| A5.17 | Cartridges (Oil Well, Power Device) | Scenario 14 |
| A5.18 | Pyrotechnics, Signals, Air Bags | Scenario 15 |
| A5.19 | Cases, Cartridge (Empty with Primer) | Scenario 16 |
| A5.20 | Shaped Charges, Commercial Explosives | Scenario 17 |
| A5.21 | Flexible Linear Shaped Charges | Scenario 18 |
| A5.22 | Detonating Cord | Scenario 19 |
| A5.23 | Igniter Cord, Safety Fuse | Scenario 20 |
| A5.24 | Fuzes, Grenades | Scenario 21 |
| A5.25 | Igniters, Fuse Lighters | Scenario 22 |
| A5.26 | Propelling Charges | Scenario 23 |
| A5.27 | Water-Activated Contrivances | Scenario 24 |

### Class 1 Division Reference

| Division | Description | Example |
|----------|-------------|---------|
| 1.1 | Mass explosion hazard | UN0224 Barium Azide |
| 1.2 | Projection hazard | UN0248 Contrivances, Water-Activated |
| 1.3 | Fire hazard, minor blast/projection | UN0343 Nitrocellulose, Plasticized |
| 1.4 | Minor explosion hazard | UN0066 Cord, Igniter |
| 1.4S | No significant hazard | UN0507 Signals, Smoke |
| 1.5 | Very insensitive, mass explosion | NA0331 ANFO Mixture |
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
- Orientation labels (for specific materials)
- UN number and PSN markings
- EX number marking
- Military Shipping Label (MSL)
- POP Marking with PG code X or Y (Class 1 requires PG I or II rated packaging)

---

## Scenario 1: UN0224 - BARIUM AZIDE (A5.4)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN0224 |
| PSN | BARIUM AZIDE, dry or wetted with less than 50% water, by mass |
| Hazard Class | 1.1A |
| Packaging Paragraph | A5.4 |
| Special Provisions | P3, 111, 117 |
| Subsidiary Risk | 6.1 (Toxic) |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" (P3 requires CAO) |
| Key 11 | "UN0224" |
| Key 12 | "BARIUM AZIDE, dry or wetted with less than 50% water, by mass" |
| Key 13 | "1.1A" |
| Key 14 | "6.1" (Toxic subsidiary risk) |
| Key 15 | Empty (Class 1) |
| Key 16 | Net quantity + packaging + NEW (e.g., "1 steel drum (1A2) x 0.5 kg NEW") |
| Key 17 | "A5.4" |

### Expected Package Inspection (Successful)

**Labels Required:**
- EXPLOSIVE 1.1 with compatibility group A
- TOXIC 6.1 (subsidiary)
- Cargo Aircraft Only

**Markings Required:**
- UN0224
- PSN: "BARIUM AZIDE, dry or wetted with less than 50% water, by mass"
- EX number
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Allowed codes per A5.4:
  - Drums: 1A1, 1A2, 1N1, 1N2, 1H1, 1H2
  - Boxes: 4C2, 4D, 4F
- Packing group code: X or Y
- Special: Water-saturated cushioning material required

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Missing TOXIC 6.1 subsidiary label | Subsidiary hazard label validation |
| 2 | Key 14 left empty when subsidiary risk exists | SDDG subsidiary risk validation |
| 3 | POP marking shows "4G" (not authorized for A5.4) | Packaging code validation for wetted primaries |
| 4 | POP marking shows packing group "Z" | PG validation (Class 1 requires X or Y) |

---

## Scenario 2: UN0343 - NITROCELLULOSE, PLASTICIZED (A5.5)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN0343 |
| PSN | NITROCELLULOSE, PLASTICIZED with not less than 18% plasticizing substance, by mass |
| Hazard Class | 1.3C |
| Packaging Paragraph | A5.5 |
| Special Provisions | P4 |
| Subsidiary Risk | None |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" (P4 requires CAO) |
| Key 11 | "UN0343" |
| Key 12 | "NITROCELLULOSE, PLASTICIZED with not less than 18% plasticizing substance, by mass" |
| Key 13 | "1.3C" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | Net quantity + packaging + NEW (e.g., "2 fiberboard boxes (4G) x 5 kg NEW") |
| Key 17 | "A5.5" |

### Expected Package Inspection (Successful)

**Labels Required:**
- EXPLOSIVE 1.3 with compatibility group C
- Cargo Aircraft Only

**Markings Required:**
- UN0343
- PSN: "NITROCELLULOSE, PLASTICIZED with not less than 18% plasticizing substance, by mass"
- EX number
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Allowed codes per A5.5:
  - Boxes: 4A, 4B, 4N, 4C1, 4C2, 4D, 4F, 4G, 4H1, 4H2
  - Drums: 1A1, 1A2, 1B1, 1B2, 1N1, 1N2, 1H1, 1H2, 1D, 1G
- Packing group code: X or Y

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 12 shows "NITROCELLULOSE" without plasticizing percentage | PSN completeness validation |
| 2 | Label shows "1.1C" instead of "1.3C" | Division validation |
| 3 | Missing CAO label despite P4 requirement | CAO label validation |
| 4 | Key 17 shows "A5.9" instead of "A5.5" | Packaging instruction validation |

---

## Scenario 3: UN0483 - CYCLOTRIMETHYLENETRINITRAMINE (RDX), DESENSITIZED (A5.6)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN0483 |
| PSN | CYCLOTRIMETHYLENETRINITRAMINE (RDX), DESENSITIZED |
| Hazard Class | 1.1D |
| Packaging Paragraph | A5.6 |
| Special Provisions | P4 |
| Subsidiary Risk | None |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" |
| Key 11 | "UN0483" |
| Key 12 | "CYCLOTRIMETHYLENETRINITRAMINE (RDX), DESENSITIZED" |
| Key 13 | "1.1D" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | Net quantity + packaging + NEW (e.g., "1 fiberboard box (4G) x 10 kg NEW") |
| Key 17 | "A5.6" |

### Expected Package Inspection (Successful)

**Labels Required:**
- EXPLOSIVE 1.1 with compatibility group D
- Cargo Aircraft Only

**Markings Required:**
- UN0483
- PSN: "CYCLOTRIMETHYLENETRINITRAMINE (RDX), DESENSITIZED"
- EX number
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Allowed codes per A5.6:
  - Boxes: 4A, 4B, 4N, 4C1, 4C2, 4D, 4F, 4G, 4H1, 4H2
  - Drums: 1A1, 1A2, 1B1, 1B2, 1N1, 1N2, 1D, 1G, 1H1, 1H2
  - Bags: 5H2, 5H3, 5H4, 5L2, 5L3, 5M2 (dry solids only)
- Packing group code: X or Y

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | PSN abbreviated to "RDX, DESENSITIZED" without full chemical name | PSN completeness |
| 2 | POP marking shows "3A1" (jerrican - not authorized for A5.6) | Packaging code validation |
| 3 | Key 16 missing "NEW" designation | Explosive quantity format validation |
| 4 | Package shows "CYCLONITE" without "RDX" | PSN technical name validation |

---

## Scenario 4: UN0222 - AMMONIUM NITRATE (A5.7)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN0222 |
| PSN | AMMONIUM NITRATE with more than 0.2% combustible substances, including any organic substance calculated as carbon, to the exclusion of any other added substance |
| Hazard Class | 1.1D |
| Packaging Paragraph | A5.7 |
| Special Provisions | P4, A69 |
| Subsidiary Risk | None |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" |
| Key 11 | "UN0222" |
| Key 12 | "AMMONIUM NITRATE with more than 0.2% combustible substances..." (full PSN) |
| Key 13 | "1.1D" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | Net quantity + packaging + NEW |
| Key 17 | "A5.7" |

### Expected Package Inspection (Successful)

**Labels Required:**
- EXPLOSIVE 1.1 with compatibility group D
- Cargo Aircraft Only

**Markings Required:**
- UN0222
- PSN: Full proper shipping name
- EX number
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Allowed codes per A5.7:
  - Boxes: 4A, 4B, 4N, 4C1, 4C2, 4D, 4F, 4G, 4H1, 4H2
  - Drums: 1A1, 1A2, 1B1, 1B2, 1N1, 1N2, 1D, 1G, 1H1, 1H2
  - Bags: 5H2, 5H3, 5H4, 5L2, 5L3, 5M2
- Packing group code: X or Y
- Note: Inner packaging not required for UN0222

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 12 shows just "AMMONIUM NITRATE" without combustible substance qualifier | PSN completeness |
| 2 | Label shows compatibility group "E" instead of "D" | Compatibility group validation |
| 3 | POP marking missing entirely | UN specification marking validation |
| 4 | Key 17 shows "A5.2" instead of "A5.7" | Packaging paragraph validation |

---

## Scenario 5: UN0027 - BLACK POWDER (GUNPOWDER) (A5.8)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN0027 |
| PSN | BLACK POWDER (GUNPOWDER), granular or as a meal |
| Hazard Class | 1.1D |
| Packaging Paragraph | A5.8 |
| Special Provisions | P4 |
| Subsidiary Risk | None |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" |
| Key 11 | "UN0027" |
| Key 12 | "BLACK POWDER (GUNPOWDER), granular or as a meal" |
| Key 13 | "1.1D" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | Net quantity + packaging + NEW (e.g., "2 wooden boxes (4C1) x 4.5 kg NEW") |
| Key 17 | "A5.8" |

### Expected Package Inspection (Successful)

**Labels Required:**
- EXPLOSIVE 1.1 with compatibility group D
- Cargo Aircraft Only

**Markings Required:**
- UN0027
- PSN: "BLACK POWDER (GUNPOWDER), granular or as a meal"
- EX number
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Allowed codes per A5.8:
  - Boxes: 4A, 4B, 4C1, 4C2, 4D, 4F, 4G, 4H2, 4N
  - Drums: 1A1, 1A2, 1B1, 1B2, 1D, 1G, 1H1, 1H2, 1N1, 1N2
- Packing group code: X or Y
- At least one packaging must be sift-proof

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 12 missing "(GUNPOWDER)" qualifier | PSN completeness validation |
| 2 | POP marking shows "4H1" (expanded plastic - not authorized for A5.8) | Packaging code validation |
| 3 | MSL missing from package | Military Shipping Label check |
| 4 | Key 16 shows quantity in pounds only without metric | Metric requirement (Key 16.4.2) |

---

## Scenario 6: UN0132 - DEFLAGRATING METAL SALTS OF AROMATIC NITRODERIVATIVES, N.O.S. (A5.9)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN0132 |
| PSN | DEFLAGRATING METAL SALTS OF AROMATIC NITRODERIVATIVES, N.O.S. |
| Technical Name | (specify actual compound, e.g., Sodium Picramate) |
| Hazard Class | 1.3C |
| Packaging Paragraph | A5.9 |
| Special Provisions | P4 |
| Subsidiary Risk | None |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" |
| Key 11 | "UN0132" |
| Key 12 | "DEFLAGRATING METAL SALTS OF AROMATIC NITRODERIVATIVES, N.O.S. (Sodium Picramate)" |
| Key 13 | "1.3C" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | Net quantity + packaging + NEW |
| Key 17 | "A5.9" |

### Expected Package Inspection (Successful)

**Labels Required:**
- EXPLOSIVE 1.3 with compatibility group C
- Cargo Aircraft Only

**Markings Required:**
- UN0132
- PSN: "DEFLAGRATING METAL SALTS OF AROMATIC NITRODERIVATIVES, N.O.S. (Sodium Picramate)" with technical name in parentheses
- EX number
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Allowed codes per A5.9:
  - Boxes: 4A, 4C1, 4C2, 4D, 4F, 4G, 4H2, 4N
  - Drums: 1A1, 1A2, 1B1, 1B2, 1D, 1G, 1H1, 1H2, 1N1, 1N2
- Packing group code: X or Y
- Note: Packagings must be lead-free for UN0132

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 12 shows N.O.S. entry without technical name in parentheses | N.O.S. technical name requirement |
| 2 | Package marking shows technical name but not in parentheses | Technical name format |
| 3 | Label shows "1.1C" instead of "1.3C" | Division validation |
| 4 | POP marking shows "4B" (aluminum - may have lead content issues) | Special packaging restriction |

---

## Scenario 7: UN0143 - NITROGLYCERIN, DESENSITIZED (A5.10)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN0143 |
| PSN | NITROGLYCERIN, DESENSITIZED with not less than 40% non-volatile water insoluble phlegmatizer, by mass |
| Hazard Class | 1.1D |
| Packaging Paragraph | A5.10 |
| Special Provisions | P4 |
| Subsidiary Risk | 6.1 (Toxic) |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" |
| Key 11 | "UN0143" |
| Key 12 | "NITROGLYCERIN, DESENSITIZED with not less than 40% non-volatile water insoluble phlegmatizer, by mass" |
| Key 13 | "1.1D" |
| Key 14 | "6.1" (Toxic) |
| Key 15 | Empty |
| Key 16 | Net quantity + packaging + NEW (max 30 kg for boxes, 120 L for drums) |
| Key 17 | "A5.10" |

### Expected Package Inspection (Successful)

**Labels Required:**
- EXPLOSIVE 1.1 with compatibility group D
- TOXIC 6.1 (subsidiary)
- Cargo Aircraft Only

**Markings Required:**
- UN0143
- PSN: Full proper shipping name with phlegmatizer percentage
- EX number
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Allowed codes per A5.10:
  - Boxes: 4C1, 4C2, 4D, 4F (4G only for UN0144)
  - Drums: 1A1, 1A2, 1D, 1G, 1H1, 1H2 (1B1, 1B2, 1N1, 1N2 NOT for UN0144)
  - Composite: 6HA1
- Packing group code: X or Y
- Max net mass for box: 30 kg
- Max net volume for drum: 120 liters

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Missing TOXIC 6.1 subsidiary label | Subsidiary label validation |
| 2 | Key 14 empty when subsidiary risk exists | SDDG subsidiary risk validation |
| 3 | POP marking shows "1B1" (aluminum drum - not authorized for liquid nitro) | Packaging code restriction |
| 4 | Key 12 missing phlegmatizer percentage | PSN completeness for desensitized explosives |

---

## Scenario 8: NA0331 - AMMONIUM NITRATE-FUEL OIL MIXTURE (ANFO) (A5.11)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | NA0331 |
| PSN | AMMONIUM NITRATE-FUEL OIL MIXTURE containing only prilled ammonium nitrate and fuel oil |
| Hazard Class | 1.5D |
| Packaging Paragraph | A5.11 |
| Special Provisions | P4 |
| Subsidiary Risk | None |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" |
| Key 11 | "NA0331" (Note: NA prefix, not UN) |
| Key 12 | "AMMONIUM NITRATE-FUEL OIL MIXTURE containing only prilled ammonium nitrate and fuel oil" |
| Key 13 | "1.5D" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | Net quantity + packaging + NEW |
| Key 17 | "A5.11" |

### Expected Package Inspection (Successful)

**Labels Required:**
- EXPLOSIVE 1.5 with compatibility group D
- Cargo Aircraft Only

**Markings Required:**
- NA0331
- PSN: Full proper shipping name
- EX number
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Allowed codes per A5.11:
  - Boxes: 4A, 4B, 4C1, 4C2, 4D, 4F, 4G, 4H2, 4N
  - Drums: 1A1, 1A2, 1B1, 1B2, 1D, 1G, 1H1, 1H2, 1N1, 1N2
  - Jerricans: 3A1, 3A2, 3H1, 3H2
  - Bags: 5H1, 5H2, 5H3, 5H4, 5L2, 5L3, 5M2
- Packing group code: X or Y

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 11 shows "UN0331" instead of "NA0331" | ID number prefix validation |
| 2 | Label shows "EXPLOSIVE 1.1D" instead of "1.5D" | Division validation (1.5 is very insensitive) |
| 3 | Key 13 shows "1.5" without compatibility group "D" | Compatibility group completeness |
| 4 | POP marking shows PG code "Z" | Packing group validation |

---

## Scenario 9: UN0171 - AMMUNITION, ILLUMINATING (A5.12)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN0171 |
| PSN | AMMUNITION, ILLUMINATING with or without burster, expelling charge, or propelling charge |
| Hazard Class | 1.2G |
| Packaging Paragraph | A5.12 |
| Special Provisions | P4 |
| Subsidiary Risk | None |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" |
| Key 11 | "UN0171" |
| Key 12 | "AMMUNITION, ILLUMINATING with or without burster, expelling charge, or propelling charge" |
| Key 13 | "1.2G" (may include DOD IBD on separate line) |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | Net quantity + packaging + NEW |
| Key 17 | "A5.12" |

### Expected Package Inspection (Successful)

**Labels Required:**
- EXPLOSIVE 1.2 with compatibility group G
- Cargo Aircraft Only

**Markings Required:**
- UN0171
- PSN: "AMMUNITION, ILLUMINATING with or without burster, expelling charge, or propelling charge"
- EX number
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Allowed codes per A5.12:
  - Boxes: 4A, 4B, 4C1, 4C2, 4D, 4F, 4G, 4H1, 4H2, 4N
  - Drums: 1A1, 1A2, 1B1, 1B2, 1D, 1G, 1H1, 1H2, 1N1, 1N2
  - Large Packagings: 50A, 50B, 50C, 50D, 50F, 50G, 50H, 50N
- Packing group code: X or Y
- Inner packaging not required

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Label shows "1.3G" instead of "1.2G" | Division validation |
| 2 | Key 16 missing NEW (Net Explosive Weight) | Quantity validation for explosives |
| 3 | PSN abbreviated to "AMMO, ILLUM" | PSN abbreviation validation |
| 4 | Key 17 shows "A5.18" instead of "A5.12" | Packaging paragraph validation |

---

## Scenario 10: UN0030 - DETONATORS, ELECTRIC (A5.13)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN0030 |
| PSN | DETONATORS, ELECTRIC for blasting |
| Hazard Class | 1.1B |
| Packaging Paragraph | A5.13 |
| Special Provisions | P4, A69 |
| Subsidiary Risk | None |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" |
| Key 11 | "UN0030" |
| Key 12 | "DETONATORS, ELECTRIC for blasting" |
| Key 13 | "1.1B" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | Net quantity + packaging + NEW |
| Key 17 | "A5.13" |

### Expected Package Inspection (Successful)

**Labels Required:**
- EXPLOSIVE 1.1 with compatibility group B
- Cargo Aircraft Only

**Markings Required:**
- UN0030
- PSN: "DETONATORS, ELECTRIC for blasting"
- EX number
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Allowed codes per A5.13:
  - Boxes: 4A, 4B, 4C1, 4C2, 4D, 4F, 4G, 4H2, 4N
  - Drums: 1A1, 1A2, 1B1, 1B2, 1D, 1G, 1H1, 1H2, 1N1, 1N2
- Packing group code: X or Y
- Inner packaging may be pasteboard tubes or leg wires wound on spools

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 13 shows "1.4B" instead of "1.1B" | Division validation (significant safety difference) |
| 2 | Missing compatibility group "B" on label | Compatibility group validation |
| 3 | EX number missing from package | EX number validation |
| 4 | POP marking shows "4H1" (expanded plastic - not authorized for A5.13) | Packaging code validation |

---

## Scenario 11: UN0360 - DETONATOR ASSEMBLIES, NON-ELECTRIC (A5.14)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN0360 |
| PSN | DETONATOR ASSEMBLIES, NON-ELECTRIC for blasting |
| Hazard Class | 1.1B |
| Packaging Paragraph | A5.14 |
| Special Provisions | P4, A69 |
| Subsidiary Risk | None |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" |
| Key 11 | "UN0360" |
| Key 12 | "DETONATOR ASSEMBLIES, NON-ELECTRIC for blasting" |
| Key 13 | "1.1B" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | Net quantity + packaging + NEW |
| Key 17 | "A5.14" |

### Expected Package Inspection (Successful)

**Labels Required:**
- EXPLOSIVE 1.1 with compatibility group B
- Cargo Aircraft Only

**Markings Required:**
- UN0360
- PSN: "DETONATOR ASSEMBLIES, NON-ELECTRIC for blasting"
- EX number
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Allowed codes per A5.14:
  - Boxes: 4A, 4B, 4C1, 4C2, 4D, 4F, 4G, 4H2, 4N
  - Drums: 1A1, 1A2, 1B1, 1B2, 1D, 1G, 1H1, 1H2, 1N1, 1N2
- Packing group code: X or Y
- Inner packaging not required if packing configuration restricts free movement

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 12 shows "DETONATORS, NON-ELECTRIC" missing "ASSEMBLIES" | PSN completeness |
| 2 | Package labeled with "1.4B" instead of "1.1B" | Division validation |
| 3 | Key 17 shows "A5.13" instead of "A5.14" | Packaging paragraph validation |
| 4 | MSL missing from package | Military Shipping Label check |

---

## Scenario 12: UN0042 - BOOSTERS without detonator (A5.15)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN0042 |
| PSN | BOOSTERS without detonator |
| Hazard Class | 1.1D |
| Packaging Paragraph | A5.15 |
| Special Provisions | P4 |
| Subsidiary Risk | None |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" |
| Key 11 | "UN0042" |
| Key 12 | "BOOSTERS without detonator" |
| Key 13 | "1.1D" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | Net quantity + packaging + NEW |
| Key 17 | "A5.15" |

### Expected Package Inspection (Successful)

**Labels Required:**
- EXPLOSIVE 1.1 with compatibility group D
- Cargo Aircraft Only

**Markings Required:**
- UN0042
- PSN: "BOOSTERS without detonator"
- EX number
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Allowed codes per A5.15 (BOXES ONLY):
  - 4A, 4B, 4C1, 4C2, 4D, 4F, 4G, 4H2, 4N
- Packing group code: X or Y
- Inner packaging not required for articles with closed casings

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | POP marking shows "1A2" (drum - drums not authorized for A5.15) | Packaging code validation (boxes only) |
| 2 | Key 12 shows "BOOSTERS" without "without detonator" qualifier | PSN completeness (safety-critical distinction) |
| 3 | Label shows "1.1B" instead of "1.1D" | Compatibility group validation |
| 4 | POP marking shows packing group "Z" | PG validation |

---

## Scenario 13: UN0225 - BOOSTERS WITH DETONATOR (A5.16)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN0225 |
| PSN | BOOSTERS WITH DETONATOR |
| Hazard Class | 1.1B |
| Packaging Paragraph | A5.16 |
| Special Provisions | P4, 115 |
| Subsidiary Risk | None |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" |
| Key 11 | "UN0225" |
| Key 12 | "BOOSTERS WITH DETONATOR" |
| Key 13 | "1.1B" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | Net quantity + packaging + NEW |
| Key 17 | "A5.16" |

### Expected Package Inspection (Successful)

**Labels Required:**
- EXPLOSIVE 1.1 with compatibility group B
- Cargo Aircraft Only

**Markings Required:**
- UN0225
- PSN: "BOOSTERS WITH DETONATOR"
- EX number
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Allowed codes per A5.16 (BOXES ONLY):
  - 4A, 4B, 4C1, 4C2, 4D, 4F, 4G, 4H2, 4N
- Packing group code: X or Y
- Do not use trays for UN0225

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 12 shows "BOOSTERS" without "WITH DETONATOR" | PSN completeness (critical safety distinction from UN0042) |
| 2 | POP marking shows "1G" (fiberboard drum - drums not authorized) | Packaging code validation |
| 3 | Label shows compatibility group "D" instead of "B" | Compatibility group validation |
| 4 | Key 17 shows "A5.15" instead of "A5.16" | Packaging paragraph validation |

---

## Scenario 14: UN0277 - CARTRIDGES, OIL WELL (A5.17)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN0277 |
| PSN | CARTRIDGES, OIL WELL |
| Hazard Class | 1.3C |
| Packaging Paragraph | A5.17 |
| Special Provisions | P4, A69 |
| Subsidiary Risk | None |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" |
| Key 11 | "UN0277" |
| Key 12 | "CARTRIDGES, OIL WELL" |
| Key 13 | "1.3C" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | Net quantity + packaging + NEW |
| Key 17 | "A5.17" |

### Expected Package Inspection (Successful)

**Labels Required:**
- EXPLOSIVE 1.3 with compatibility group C
- Cargo Aircraft Only

**Markings Required:**
- UN0277
- PSN: "CARTRIDGES, OIL WELL"
- EX number
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Allowed codes per A5.17:
  - Boxes: 4A, 4B, 4C1, 4C2, 4D, 4F, 4G, 4H1, 4H2, 4N
  - Drums: 1A1, 1A2, 1B1, 1B2, 1D, 1G, 1H1, 1H2, 1N1, 1N2
- Packing group code: X or Y

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Label shows "1.4C" instead of "1.3C" | Division validation |
| 2 | Key 12 abbreviated to "CART, OIL WELL" | PSN abbreviation validation |
| 3 | POP marking shows "3A1" (jerrican - not authorized for A5.17) | Packaging code validation |
| 4 | EX number missing from package | EX number validation |

---

## Scenario 15: UN0507 - SIGNALS, SMOKE (A5.18)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN0507 |
| PSN | SIGNALS, SMOKE |
| Hazard Class | 1.4S |
| Packaging Paragraph | A5.18 |
| Special Provisions | P5 |
| Subsidiary Risk | None |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" (P5 allows passenger aircraft) |
| Key 11 | "UN0507" |
| Key 12 | "SIGNALS, SMOKE" |
| Key 13 | "1.4S" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | Net quantity + packaging |
| Key 17 | "A5.18" |

### Expected Package Inspection (Successful)

**Labels Required:**
- EXPLOSIVE 1.4 with compatibility group S (minimal hazard)
- NO Cargo Aircraft Only label (P5 allows passenger)

**Markings Required:**
- UN0507
- PSN: "SIGNALS, SMOKE"
- EX number
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Allowed codes per A5.18:
  - Boxes: 4A, 4B, 4C1, 4C2, 4D, 4F, 4G, 4H1, 4H2, 4N
  - Drums: 1A1, 1A2, 1B1, 1B2, 1D, 1G, 1H1, 1H2, 1N1, 1N2
- Packing group code: X or Y

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 7 shows "Cargo Aircraft Only" when P5 allows passenger | Aircraft limitation validation (overly restrictive) |
| 2 | Label shows "1.4G" instead of "1.4S" | Compatibility group validation (S is unique minimal hazard) |
| 3 | Package labeled as CAO when material is P5 | Label/SDDG consistency |
| 4 | Key 13 shows "1.4" without "S" compatibility group | Compatibility group completeness |

---

## Scenario 16: UN0379 - CASES, CARTRIDGE, EMPTY WITH PRIMER (A5.19)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN0379 |
| PSN | CASES, CARTRIDGE, EMPTY WITH PRIMER |
| Hazard Class | 1.4C |
| Packaging Paragraph | A5.19 |
| Special Provisions | P5, A69 |
| Subsidiary Risk | None |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" (P5 allows passenger) |
| Key 11 | "UN0379" |
| Key 12 | "CASES, CARTRIDGE, EMPTY WITH PRIMER" |
| Key 13 | "1.4C" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | Net quantity + packaging |
| Key 17 | "A5.19" |

### Expected Package Inspection (Successful)

**Labels Required:**
- EXPLOSIVE 1.4 with compatibility group C
- NO Cargo Aircraft Only label (P5 allows passenger)

**Markings Required:**
- UN0379
- PSN: "CASES, CARTRIDGE, EMPTY WITH PRIMER"
- EX number
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Allowed codes per A5.19:
  - Boxes: 4A, 4B, 4C1, 4C2, 4D, 4F, 4G, 4H2, 4N
  - Drums: 1A1, 1A2, 1B1, 1B2, 1D, 1G, 1H1, 1H2, 1N1, 1N2
- Packing group code: X or Y

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 12 shows "CASES, CARTRIDGE, EMPTY" missing "WITH PRIMER" | PSN completeness (safety-critical) |
| 2 | Label shows "1.4S" instead of "1.4C" | Compatibility group validation |
| 3 | POP marking shows "4H1" (expanded plastic - not authorized for A5.19) | Packaging code validation |
| 4 | Key 7 incorrectly shows "Cargo Aircraft Only" | Aircraft limitation validation |

---

## Scenario 17: UN0442 - CHARGES, EXPLOSIVE, COMMERCIAL (A5.20)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN0442 |
| PSN | CHARGES, EXPLOSIVE, COMMERCIAL without detonator |
| Hazard Class | 1.1D |
| Packaging Paragraph | A5.20 |
| Special Provisions | P4, A69 |
| Subsidiary Risk | None |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" |
| Key 11 | "UN0442" |
| Key 12 | "CHARGES, EXPLOSIVE, COMMERCIAL without detonator" |
| Key 13 | "1.1D" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | Net quantity + packaging + NEW |
| Key 17 | "A5.20" |

### Expected Package Inspection (Successful)

**Labels Required:**
- EXPLOSIVE 1.1 with compatibility group D
- Cargo Aircraft Only

**Markings Required:**
- UN0442
- PSN: "CHARGES, EXPLOSIVE, COMMERCIAL without detonator"
- EX number
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Allowed codes per A5.20:
  - Boxes: 4A, 4B, 4C1, 4C2, 4D, 4F, 4G, 4H2, 4N
  - Drums: 1A1, 1A2, 1B1, 1B2, 1D, 1G, 1H1, 1H2, 1N1, 1N2
- Packing group code: X or Y

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 12 missing "without detonator" qualifier | PSN completeness (safety-critical descriptor) |
| 2 | Label shows "1.2D" instead of "1.1D" | Division validation |
| 3 | Key 16 missing NEW for explosive article | Explosive quantity format validation |
| 4 | POP marking shows "3H1" (plastic jerrican - not authorized) | Packaging code validation |

---

## Scenario 18: UN0288 - CHARGES, SHAPED, FLEXIBLE, LINEAR (A5.21)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN0288 |
| PSN | CHARGES, SHAPED, FLEXIBLE, LINEAR |
| Hazard Class | 1.1D |
| Packaging Paragraph | A5.21 |
| Special Provisions | P4, A69 |
| Subsidiary Risk | None |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" |
| Key 11 | "UN0288" |
| Key 12 | "CHARGES, SHAPED, FLEXIBLE, LINEAR" |
| Key 13 | "1.1D" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | Net quantity + packaging + NEW |
| Key 17 | "A5.21" |

### Expected Package Inspection (Successful)

**Labels Required:**
- EXPLOSIVE 1.1 with compatibility group D
- Cargo Aircraft Only

**Markings Required:**
- UN0288
- PSN: "CHARGES, SHAPED, FLEXIBLE, LINEAR"
- EX number
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Allowed codes per A5.21:
  - Boxes: 4A, 4B, 4C1, 4C2, 4D, 4F, 4G, 4H2, 4N
  - Drums: 1A1, 1A2, 1B1, 1B2, 1G, 1H1, 1H2, 1N1, 1N2 (NOTE: 1D NOT authorized)
- Packing group code: X or Y
- Inner packaging not required if ends of articles are sealed

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | POP marking shows "1D" (plywood drum - not authorized for A5.21) | Packaging code validation |
| 2 | PSN abbreviated to "CHARGES, SHAPED, LINEAR" missing "FLEXIBLE" | PSN completeness |
| 3 | Label missing compatibility group "D" | Compatibility group validation |
| 4 | Key 17 shows "A5.20" instead of "A5.21" | Packaging paragraph validation |

---

## Scenario 19: UN0065 - CORD, DETONATING (flexible) (A5.22)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN0065 |
| PSN | CORD, DETONATING flexible |
| Hazard Class | 1.1D |
| Packaging Paragraph | A5.22 |
| Special Provisions | P4, 102, A69 |
| Subsidiary Risk | None |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" |
| Key 11 | "UN0065" |
| Key 12 | "CORD, DETONATING flexible" |
| Key 13 | "1.1D" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | Net quantity + packaging + NEW |
| Key 17 | "A5.22" |

### Expected Package Inspection (Successful)

**Labels Required:**
- EXPLOSIVE 1.1 with compatibility group D
- Cargo Aircraft Only

**Markings Required:**
- UN0065
- PSN: "CORD, DETONATING flexible"
- EX number
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Allowed codes per A5.22:
  - Boxes: 4A, 4B, 4C1, 4C2, 4D, 4F, 4G, 4H2, 4N
  - Drums: 1A1, 1A2, 1B1, 1B2, 1D, 1G, 1H1, 1H2, 1N1, 1N2
- Packing group code: X or Y
- Seal ends of detonating cord and fasten securely
- Inner packaging not required when securely fastened in coils

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 12 shows "DETONATING CORD" without "flexible" descriptor | PSN completeness |
| 2 | Ends of detonating cord not sealed | Special packaging requirement validation |
| 3 | Label shows "1.4D" instead of "1.1D" | Division validation |
| 4 | POP marking shows "4H1" (expanded plastic - not authorized) | Packaging code validation |

---

## Scenario 20: UN0066 - CORD, IGNITER (A5.23)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN0066 |
| PSN | CORD, IGNITER |
| Hazard Class | 1.4G |
| Packaging Paragraph | A5.23 |
| Special Provisions | P5, A69 |
| Subsidiary Risk | None |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" (P5 allows passenger) |
| Key 11 | "UN0066" |
| Key 12 | "CORD, IGNITER" |
| Key 13 | "1.4G" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | Net quantity + packaging |
| Key 17 | "A5.23" |

### Expected Package Inspection (Successful)

**Labels Required:**
- EXPLOSIVE 1.4 with compatibility group G
- NO Cargo Aircraft Only label (P5 allows passenger)

**Markings Required:**
- UN0066
- PSN: "CORD, IGNITER"
- EX number
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Allowed codes per A5.23:
  - Boxes: 4A, 4B, 4C1, 4C2, 4D, 4F, 4G, 4H2 (NOTE: 4N NOT authorized)
  - Drums: 1A1, 1A2, 1B1, 1B2, 1D, 1G, 1H1, 1H2, 1N1, 1N2
- Packing group code: X or Y

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | POP marking shows "4N" (other metal box - not authorized for A5.23) | Packaging code validation |
| 2 | Key 7 shows "Cargo Aircraft Only" when P5 allows passenger | Aircraft limitation validation |
| 3 | Label shows "1.1G" instead of "1.4G" | Division validation |
| 4 | Package incorrectly has CAO label | Label/SDDG consistency |

---

## Scenario 21: UN0106 - FUZES, DETONATING (A5.24)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN0106 |
| PSN | FUZES, DETONATING |
| Hazard Class | 1.1B |
| Packaging Paragraph | A5.24 |
| Special Provisions | P4 |
| Subsidiary Risk | None |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" |
| Key 11 | "UN0106" |
| Key 12 | "FUZES, DETONATING" |
| Key 13 | "1.1B" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | Net quantity + packaging + NEW |
| Key 17 | "A5.24" |

### Expected Package Inspection (Successful)

**Labels Required:**
- EXPLOSIVE 1.1 with compatibility group B
- Cargo Aircraft Only

**Markings Required:**
- UN0106
- PSN: "FUZES, DETONATING"
- EX number
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Allowed codes per A5.24:
  - Boxes: 4A, 4B, 4C1, 4C2, 4D, 4F, 4G, 4H2, 4N
  - Drums: 1A1, 1A2, 1B1, 1B2, 1D, 1G, 1H1, 1H2, 1N1, 1N2
- Packing group code: X or Y

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Package marking shows "FUSES" instead of "FUZES" | PSN spelling validation |
| 2 | Key 13 shows "1.4B" instead of "1.1B" | Division validation |
| 3 | Missing CAO label despite P4 requirement | CAO label validation |
| 4 | POP marking shows "4H1" (expanded plastic - not authorized) | Packaging code validation |

---

## Scenario 22: UN0121 - IGNITERS (A5.25)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN0121 |
| PSN | IGNITERS |
| Hazard Class | 1.1G |
| Packaging Paragraph | A5.25 |
| Special Provisions | P4 |
| Subsidiary Risk | None |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" |
| Key 11 | "UN0121" |
| Key 12 | "IGNITERS" |
| Key 13 | "1.1G" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | Net quantity + packaging + NEW |
| Key 17 | "A5.25" |

### Expected Package Inspection (Successful)

**Labels Required:**
- EXPLOSIVE 1.1 with compatibility group G
- Cargo Aircraft Only

**Markings Required:**
- UN0121
- PSN: "IGNITERS"
- EX number
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Allowed codes per A5.25:
  - Boxes: 4A, 4B, 4C1, 4C2, 4D, 4F, 4G, 4H2, 4N
  - Drums: 1A1, 1A2, 1B1, 1B2, 1D, 1G, 1H1, 1H2, 1N1, 1N2
- Packing group code: X or Y

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Label shows "1.4G" instead of "1.1G" | Division validation |
| 2 | Key 17 shows "A5.11" instead of "A5.25" | Packaging paragraph validation (A5.11 is ANFO) |
| 3 | POP marking shows packaging code not authorized by A5.25 | Packaging code validation |
| 4 | Key 13 shows "1.1" without compatibility group "G" | Compatibility group completeness |

---

## Scenario 23: UN0271 - CHARGES, PROPELLING (A5.26)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN0271 |
| PSN | CHARGES, PROPELLING |
| Hazard Class | 1.1C |
| Packaging Paragraph | A5.26 |
| Special Provisions | P4 |
| Subsidiary Risk | None |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" |
| Key 11 | "UN0271" |
| Key 12 | "CHARGES, PROPELLING" |
| Key 13 | "1.1C" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | Net quantity + packaging + NEW |
| Key 17 | "A5.26" |

### Expected Package Inspection (Successful)

**Labels Required:**
- EXPLOSIVE 1.1 with compatibility group C
- Cargo Aircraft Only

**Markings Required:**
- UN0271
- PSN: "CHARGES, PROPELLING"
- EX number
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Allowed codes per A5.26:
  - Boxes: 4A, 4B, 4C1, 4C2, 4D, 4F, 4G, 4H2, 4N
  - Drums: 1A1, 1A2, 1B1, 1B2, 1D, 1G, 1H1, 1H2, 1N1, 1N2
  - Composite: 6HH2 (plastic receptacle with outer solid box)
- Packing group code: X or Y
- Metal packagings must prevent explosion from internal pressure

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Label shows compatibility group "D" instead of "C" | Compatibility group validation |
| 2 | Key 12 abbreviated to "PROPELLING CHARGES" (word order) | PSN format validation |
| 3 | POP marking shows "4H1" (expanded plastic - not authorized) | Packaging code validation |
| 4 | Key 16 shows quantity without "NEW" designation | Explosive quantity format validation |

---

## Scenario 24: UN0248 - CONTRIVANCES, WATER-ACTIVATED (A5.27)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN0248 |
| PSN | CONTRIVANCES, WATER-ACTIVATED with burster, expelling charge, or propelling charge |
| Hazard Class | 1.2L |
| Packaging Paragraph | A5.27 |
| Special Provisions | P3 |
| Subsidiary Risk | None |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" (P3 requires CAO) |
| Key 11 | "UN0248" |
| Key 12 | "CONTRIVANCES, WATER-ACTIVATED with burster, expelling charge, or propelling charge" |
| Key 13 | "1.2L" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | Net quantity + packaging + NEW |
| Key 17 | "A5.27" |

### Expected Package Inspection (Successful)

**Labels Required:**
- EXPLOSIVE 1.2 with compatibility group L
- Cargo Aircraft Only

**Markings Required:**
- UN0248
- PSN: "CONTRIVANCES, WATER-ACTIVATED with burster, expelling charge, or propelling charge"
- EX number
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Allowed codes per A5.27:
  - Boxes: 4A, 4B, 4C1 (with metal liner), 4D (with metal liner), 4F (with metal liner), 4H1, 4H2, 4N
  - Drums: 1A1, 1A2, 1B1, 1B2, 1D, 1H1, 1H2, 1N1, 1N2 (NOTE: 1G NOT authorized)
- Packing group code: X or Y
- Packagings must be sealed against ingress of water
- Wood boxes (4C1, 4D, 4F) require metal liner
- 4G (fiberboard) and 4C2 (sift-proof wood) NOT authorized

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | POP marking shows "1G" (fiberboard drum - not authorized for water-activated) | Packaging code validation |
| 2 | POP marking shows "4G" (fiberboard box - not authorized for A5.27) | Packaging code validation |
| 3 | Key 12 missing "with burster, expelling charge, or propelling charge" | PSN completeness |
| 4 | Label shows "1.2D" instead of "1.2L" | Compatibility group validation (L is water-reactive) |
| 5 | Wood box (4C1) without required metal liner | Special packaging requirement |

---

## Quick Reference: Alteration Categories

| Category | Scenarios | Description |
|----------|-----------|-------------|
| **Packing Group** | 1, 4, 8, 12 | POP marking shows "Z" instead of X/Y |
| **Missing Labels** | 1, 2, 3, 7, 21 | CAO, Subsidiary, or Primary labels missing |
| **SDDG Key Errors** | 1, 2, 4, 5, 8, 11, 15, 16 | Key values incorrect or incomplete |
| **PSN Issues** | 2, 3, 4, 5, 6, 9, 11, 13, 17, 18, 19, 21, 24 | PSN abbreviated, incomplete, or misspelled |
| **Compatibility Group** | 4, 8, 10, 12, 13, 15, 16, 22, 23, 24 | Wrong or missing compatibility group |
| **Division Errors** | 2, 3, 7, 8, 9, 10, 11, 14, 17, 19, 20, 21, 22 | Wrong division number on label |
| **EX Number** | 10, 14 | Missing or malformed EX number |
| **Packaging Code** | 1, 3, 5, 7, 10, 12, 13, 14, 16, 17, 18, 19, 20, 21, 23, 24 | Unauthorized packaging code for paragraph |
| **Quantity Format** | 3, 5, 9, 17, 23 | Missing NEW, metric, or proper format |
| **N.O.S. Technical Name** | 6 | Missing or incorrect technical name |
| **Subsidiary Risk** | 1, 7 | Missing or wrong subsidiary information |
| **Aircraft Limitations** | 15, 16, 20 | CAO vs Passenger mismatch |
| **MSL** | 5, 11 | Missing Military Shipping Label |
| **Special Packaging** | 19, 24 | Cord end sealing, metal liner, water ingress |

---

## Division Coverage Summary

| Division | Scenarios |
|----------|-----------|
| 1.1 | 1 (1.1A), 3 (1.1D), 4 (1.1D), 5 (1.1D), 7 (1.1D), 10 (1.1B), 11 (1.1B), 12 (1.1D), 13 (1.1B), 17 (1.1D), 18 (1.1D), 19 (1.1D), 21 (1.1B), 22 (1.1G), 23 (1.1C) |
| 1.2 | 9 (1.2G), 24 (1.2L) |
| 1.3 | 2 (1.3C), 6 (1.3C), 14 (1.3C) |
| 1.4 | 16 (1.4C), 20 (1.4G) |
| 1.4S | 15 (1.4S) |
| 1.5 | 8 (1.5D) |

---

## Special Feature Coverage

| Feature | Scenarios |
|---------|-----------|
| Subsidiary Risk (6.1 Toxic) | 1, 7 |
| N.O.S. with Technical Name | 6 |
| P5 (Passenger Allowed) | 15, 16, 20 |
| P3/P4 (CAO Required) | All others |
| NA Prefix (not UN) | 8 |
| Wetted Explosives | 1 |
| Desensitized Explosives | 3, 7 |
| Water-Activated | 24 |
| Drums NOT Authorized | 12, 13 |
| Specific Codes NOT Authorized | 18 (1D), 20 (4N), 24 (1G, 4G, 4C2) |
| Metal Liner Required | 24 (wood boxes) |
| Sift-Proof Required | 5 |

---

## Test Execution Notes

1. **Setup**: For each scenario, prepare physical or mock materials matching the "Material Details"
2. **SDDG Phase**: Upload/parse an SDDG matching the "Expected SDDG" values, verify all Keys pass
3. **Package Phase**: Present package with correct labels/markings, verify ML detection and OCR work
4. **Alteration Phase**: Apply one alteration at a time, verify frustration is captured correctly
5. **Completion**: Verify AMC Form 1015 populates with correct frustration mappings

### Packaging Paragraph Validation Points

Each scenario includes packaging codes that are specifically authorized or prohibited for that paragraph. Key validation checks:

- **A5.4**: Limited to drums and specific wood boxes (wetted primaries need water-saturated cushioning)
- **A5.10**: Aluminum drums (1B1, 1B2) and other metal drums (1N1, 1N2) NOT for UN0144
- **A5.15, A5.16**: BOXES ONLY - no drums authorized
- **A5.21**: Plywood drum (1D) NOT authorized
- **A5.23**: 4N (other metal box) NOT authorized
- **A5.27**: Fiberboard (1G, 4G) NOT authorized; wood boxes require metal liner

### Aircraft Limitation Summary

| P Code | Aircraft Type | Scenarios |
|--------|---------------|-----------|
| P5 | Passenger and Cargo | 15, 16, 20 |
| P4 | Cargo Aircraft Only | 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 17, 18, 19, 21, 22, 23 |
| P3 | Cargo Aircraft Only | 1, 24 |
