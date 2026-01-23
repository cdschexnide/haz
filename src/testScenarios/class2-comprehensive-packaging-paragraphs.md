# Class 2 (Gases) Comprehensive Test Scenarios by Packaging Paragraph

## Overview

This document contains **26 comprehensive test scenarios** for the HazPro mobile app Inspector workflow, covering **one material for each Attachment 6 packaging paragraph** (A6.2 through A6.28). Each scenario is based on AFMAN 24-604 regulations.

**Note:** A6.17 does not exist in the regulations, so this document contains 26 scenarios (not 27).

### Purpose

These scenarios are designed for manual testing by physically running through the app. Each scenario includes:
- **Material Details**: UN number, PSN, hazard class, packaging paragraph, special provisions
- **Expected SDDG Inspection**: What a successful SDDG should contain (Keys 7, 11-17)
- **Expected Package Inspection**: Required labels, markings, and POP marking validation
- **Alterations**: Intentional errors to test frustration handling

### Class 2 Division Reference

| Division | Description | Label Color | Example |
|----------|-------------|-------------|---------|
| 2.1 | Flammable Gas | Red | UN1950 Aerosols, Flammable |
| 2.2 | Non-flammable, Non-toxic Gas | Green | UN1002 Air, Compressed |
| 2.3 | Toxic Gas | White | UN1008 Boron Trifluoride |

### Special Provision Aircraft Limitation Reference

| P Code | Aircraft Type | Meaning |
|--------|---------------|---------|
| P1 | Cargo Aircraft Only | Most restrictive - Zone A toxic gases |
| P2 | Cargo Aircraft Only | Toxic gases Zone B-D |
| P4 | Cargo Aircraft Only | Flammable gases, cryogenic liquids |
| P5 | Passenger and Cargo Aircraft | Less hazardous materials |

### Key 19 Requirement for Class 2

**CRITICAL:** All Class 2 materials (except aerosols) require a cylinder position statement in Key 19:
- "Ship valve up in vertical position" OR
- "Ship in horizontal position"

---

## Packaging Paragraph A6.2 - Aerosols

---

## Scenario 1: UN1950 - AEROSOLS, FLAMMABLE

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
| Key 7 | "Passenger and Cargo Aircraft" |
| Key 11 | "UN1950" |
| Key 12 | "AEROSOLS, FLAMMABLE" |
| Key 13 | "2.1" |
| Key 14 | Empty |
| Key 15 | Empty (Class 2 has no PG) |
| Key 16 | "24 aerosol cans x 200 g" |
| Key 17 | "A6.2" |
| Key 19 | Not required for aerosols (no cylinder position statement needed) |

### Expected Package Inspection (Successful)

**Labels Required:**
- FLAMMABLE GAS (Division 2.1) - Red

**Markings Required:**
- UN1950
- PSN: "AEROSOLS, FLAMMABLE"
- "INSIDE CONTAINERS COMPLY WITH PRESCRIBED SPECIFICATIONS" (on outer packaging)

**POP Marking Validation:**
- Per A6.2: Outer packaging boxes (4G, 4C1, 4C2, 4D, 4F, 4H1, 4H2) or drums (1A1, 1A2, 1B1, 1B2)
- UN specification packaging NOT required for non-toxic aerosols
- Packing group code: X or Y (PG II level)

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 17 shows "A6.3" (compressed gas) instead of "A6.2" (aerosols) | Packaging instruction validation |
| 2 | PSN abbreviated to "AEROSOLS" without "FLAMMABLE" qualifier | PSN completeness validation |
| 3 | Missing "INSIDE CONTAINERS COMPLY WITH PRESCRIBED SPECIFICATIONS" marking | Aerosol outer package marking requirement |

---

## Packaging Paragraph A6.3 - Small Receptacles Containing Compressed Gas

---

## Scenario 2: UN1002 - AIR, COMPRESSED

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1002 |
| PSN | AIR, COMPRESSED |
| Hazard Class | 2.2 |
| Subsidiary Risk | None |
| Packing Group | None |
| Packaging Paragraph | A6.3, A6.5 |
| Special Provisions | P5, A124 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" |
| Key 11 | "UN1002" |
| Key 12 | "AIR, COMPRESSED" |
| Key 13 | "2.2" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | "2 small receptacles x 500 g" |
| Key 17 | "A6.3" |
| Key 19 | "Ship valve up in vertical position" |

### Expected Package Inspection (Successful)

**Labels Required:**
- NON-FLAMMABLE GAS (Division 2.2) - Green

**Markings Required:**
- UN1002
- PSN: "AIR, COMPRESSED"

**POP Marking Validation:**
- Per A6.3: Small receptacles max 120 mL (4 fl oz)
- UN specification packaging NOT required for small receptacles
- Max gross package weight: 30 kg (66 lbs)

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 19 missing cylinder position statement | Handling information validation for Class 2 |
| 2 | Label shows FLAMMABLE GAS (2.1) instead of NON-FLAMMABLE GAS (2.2) | Label division validation |
| 3 | Package weight exceeds 30 kg gross | A6.3 weight limit validation |

---

## Packaging Paragraph A6.4 - Liquefied Compressed Gases

---

## Scenario 3: UN1005 - AMMONIA, ANHYDROUS

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1005 |
| PSN | AMMONIA, ANHYDROUS |
| Hazard Class | 2.2 |
| Subsidiary Risk | None |
| Packing Group | None |
| Packaging Paragraph | A6.4 |
| Special Provisions | P2, 13 |
| Domestic Shipment | Yes |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" (P2 special provision) |
| Key 11 | "UN1005" |
| Key 12 | "AMMONIA, ANHYDROUS" |
| Key 13 | "2.2" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | "1 cylinder x 50 kg" |
| Key 17 | "A6.4" |
| Key 19 | "Ship valve up in vertical position" |

### Expected Package Inspection (Successful)

**Labels Required:**
- NON-FLAMMABLE GAS (Division 2.2) - Green
- Cargo Aircraft Only

**Markings Required:**
- UN1005
- PSN: "AMMONIA, ANHYDROUS"

**POP Marking Validation:**
- Per A6.4 and Table A6.1: DOT-3A480, 3AA480, 3A480X, 4AA480, 3, 3E1800, 3AL480
- Max filling density: 54%
- Packing group code: X, Y, or Z

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 7 shows "Passenger and Cargo Aircraft" (P2 requires CAO) | Aircraft limitation validation for P2 provision |
| 2 | Missing Cargo Aircraft Only label on package | CAO label validation |
| 3 | POP marking shows DOT-3AL (not authorized for ammonia per Table A6.1 note) | Cylinder specification validation |

---

## Packaging Paragraph A6.5 - Nonliquefied Compressed Gases

---

## Scenario 4: UN1008 - BORON TRIFLUORIDE

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1008 |
| PSN | BORON TRIFLUORIDE |
| Hazard Class | 2.3 |
| Subsidiary Risk | 8 (Corrosive) |
| Packing Group | None |
| Packaging Paragraph | A6.5 |
| Special Provisions | P2, 2 |
| Inhalation Hazard Zone | Zone B |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" |
| Key 11 | "UN1008" |
| Key 12 | "BORON TRIFLUORIDE, TOXIC-INHALATION HAZARD, ZONE B" |
| Key 13 | "2.3" |
| Key 14 | "(8)" |
| Key 15 | Empty |
| Key 16 | "1 cylinder x 25 kg" |
| Key 17 | "A6.5" |
| Key 19 | "Ship valve up in vertical position" |

### Expected Package Inspection (Successful)

**Labels Required:**
- TOXIC GAS (Division 2.3) - White
- CORROSIVE (Class 8) - subsidiary hazard label
- Cargo Aircraft Only

**Markings Required:**
- UN1008
- PSN: "BORON TRIFLUORIDE"
- "INHALATION HAZARD" marking (required for Division 2.3)

**POP Marking Validation:**
- Per A6.5: DOT cylinders 3A, 3AA, 3AL, 3B, 3E, 4B, 4BA, 4BW
- Note: DOT 3AL NOT authorized for Class 8 materials
- Packing group code: X, Y, or Z

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 12 missing "TOXIC-INHALATION HAZARD, ZONE B" designation | Inhalation hazard zone validation |
| 2 | Missing "INHALATION HAZARD" marking on package | Division 2.3 marking requirement |
| 3 | Missing CORROSIVE (8) subsidiary label | Subsidiary label validation |

---

## Packaging Paragraph A6.6 - Liquefied Petroleum Gas (LPG)

---

## Scenario 5: UN1012 - BUTYLENE

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1012 |
| PSN | BUTYLENE |
| Hazard Class | 2.1 |
| Subsidiary Risk | None |
| Packing Group | None |
| Packaging Paragraph | A6.6 |
| Special Provisions | P4 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" (P4 special provision) |
| Key 11 | "UN1012" |
| Key 12 | "BUTYLENE" |
| Key 13 | "2.1" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | "2 cylinders x 20 kg" |
| Key 17 | "A6.6" |
| Key 19 | "Ship valve up in vertical position" |

### Expected Package Inspection (Successful)

**Labels Required:**
- FLAMMABLE GAS (Division 2.1) - Red
- Cargo Aircraft Only

**Markings Required:**
- UN1012
- PSN: "BUTYLENE"

**POP Marking Validation:**
- Per A6.6: DOT 3, 3A, 3AA, 3AL, 3B, 3E, 4B, 4BA, 4B240ET, 4BW, 4E, 39
- DOT 39: max 1.23 L (75 cubic inches) internal volume
- Packing group code: X, Y, or Z

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 7 shows "Passenger and Cargo Aircraft" (P4 requires CAO) | Aircraft limitation validation |
| 2 | DOT 39 cylinder exceeds 1.23 L volume limit | A6.6 cylinder volume limit validation |
| 3 | Key 13 shows "2.2" instead of "2.1" | Hazard class validation |

---

## Packaging Paragraph A6.7 - Fire Extinguishers

---

## Scenario 6: UN1044 - FIRE EXTINGUISHERS

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
| Key 16 | "6 fire extinguishers x 5 kg" |
| Key 17 | "A6.7" |
| Key 19 | Not required (special article, not a cylinder) |

### Expected Package Inspection (Successful)

**Labels Required:**
- NON-FLAMMABLE GAS (Division 2.2) - Green

**Markings Required:**
- UN1044
- PSN: "FIRE EXTINGUISHERS"
- **"MEETS DOT REQUIREMENTS"** marking with year of test (per A14.4.2.2)

**POP Marking Validation:**
- Per A6.7: Fire extinguisher specifications per manufacturer
- Non-DOT fire extinguishers: max pressure 1660 kPa (241 psig) at 21C
- No POP marking required on fire extinguisher itself (article)

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Missing "MEETS DOT REQUIREMENTS" marking | Fire extinguisher specific marking validation |
| 2 | Key 17 shows "A6.3" instead of "A6.7" | Packaging instruction validation |
| 3 | Key 13 shows "2.1" instead of "2.2" | Hazard class validation |

---

## Packaging Paragraph A6.8 - Refrigerating Machines and Pressurized Articles

---

## Scenario 7: UN3164 - ARTICLES, PRESSURIZED, PNEUMATIC

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3164 |
| PSN | ARTICLES, PRESSURIZED, PNEUMATIC |
| Details | containing nonflammable gas |
| Hazard Class | 2.2 |
| Subsidiary Risk | None |
| Packing Group | None |
| Packaging Paragraph | A6.4, A6.5, A6.8 |
| Special Provisions | P5 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" |
| Key 11 | "UN3164" |
| Key 12 | "ARTICLES, PRESSURIZED, PNEUMATIC containing nonflammable gas" |
| Key 13 | "2.2" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | "2 accumulators x 10 kg" |
| Key 17 | "A6.8" |
| Key 19 | Not required for articles |

### Expected Package Inspection (Successful)

**Labels Required:**
- NON-FLAMMABLE GAS (Division 2.2) - Green

**Markings Required:**
- UN3164
- PSN: "ARTICLES, PRESSURIZED, PNEUMATIC"

**POP Marking Validation:**
- Per A6.8: Pressurized hydraulic/pneumatic articles (accumulators)
- Burst pressure must be >= 5x charged pressure at 21C
- Max 41 L (2500 cubic inches) fluid space
- No cylinder specification required for articles

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Article charged pressure exceeds safety limits (burst < 5x charged) | A6.8 safety requirement validation |
| 2 | Key 12 shows only "ARTICLES, PRESSURIZED" without "PNEUMATIC" | PSN completeness validation |
| 3 | Label shows FLAMMABLE GAS (2.1) instead of NON-FLAMMABLE GAS (2.2) | Label validation |

---

## Packaging Paragraph A6.9 - Acetylene Gas

---

## Scenario 8: UN1001 - ACETYLENE, DISSOLVED

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
| Key 7 | "Cargo Aircraft Only" (P4 special provision) |
| Key 11 | "UN1001" |
| Key 12 | "ACETYLENE, DISSOLVED" |
| Key 13 | "2.1" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | "1 cylinder x 5 kg" |
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
- Per A6.9: **ONLY** DOT 8 or 8AL cylinders authorized
- Cylinders must be metal shells filled with porous material
- Porous material charged with suitable solvent
- NO standard compressed gas cylinders allowed

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | POP marking shows DOT-3A (not authorized for acetylene) | A6.9 cylinder specification validation |
| 2 | Key 19 missing cylinder position statement | Handling information validation |
| 3 | Key 7 shows "Passenger and Cargo Aircraft" (P4 requires CAO) | Aircraft limitation validation |

---

## Packaging Paragraph A6.10 - Cigarette Lighters and Similar Devices

---

## Scenario 9: UN1057 - LIGHTER REFILLS

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1057 |
| PSN | LIGHTER REFILLS |
| Details | containing flammable gas, 4 or less fluid ounces (7.22 cubic inches) and 65 grams of flammable gas |
| Hazard Class | 2.1 |
| Subsidiary Risk | None |
| Packing Group | None |
| Packaging Paragraph | A6.10 |
| Special Provisions | P5 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" |
| Key 11 | "UN1057" |
| Key 12 | "LIGHTER REFILLS containing flammable gas" |
| Key 13 | "2.1" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | "50 lighter refills x 30 g" |
| Key 17 | "A6.10" |
| Key 19 | Not required for lighter refills |

### Expected Package Inspection (Successful)

**Labels Required:**
- FLAMMABLE GAS (Division 2.1) - Red

**Markings Required:**
- UN1057
- PSN: "LIGHTER REFILLS"

**POP Marking Validation:**
- Per A6.10: Design approval required per DOT 49 CFR 173.308
- Max 4 fl oz (7.22 cubic inches) or 65 grams Division 2.1 fuel per device
- Rigid non-bulk UN specification outer packaging at PG II level

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Individual lighter refill exceeds 65 grams | A6.10 quantity limit validation |
| 2 | Key 17 shows "A6.2" (aerosols) instead of "A6.10" | Packaging instruction validation |
| 3 | Missing protection of release device on inner packaging | A6.10 inner packaging requirement |

---

## Packaging Paragraph A6.11 - Cryogenic Liquids

---

## Scenario 10: UN1003 - AIR, REFRIGERATED LIQUID

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1003 |
| PSN | AIR, REFRIGERATED LIQUID |
| Details | cryogenic liquid |
| Hazard Class | 2.2 |
| Subsidiary Risk | 5.1 (Oxidizer) |
| Packing Group | None |
| Packaging Paragraph | A6.11 |
| Special Provisions | P4 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" (P4 special provision) |
| Key 11 | "UN1003" |
| Key 12 | "AIR, REFRIGERATED LIQUID" |
| Key 13 | "2.2" |
| Key 14 | "(5.1)" |
| Key 15 | Empty |
| Key 16 | "1 dewar x 25 L" |
| Key 17 | "A6.11" |
| Key 19 | "Vent container to outside of aircraft. Aircrew members monitor vent valves during flight." |

### Expected Package Inspection (Successful)

**Labels Required:**
- NON-FLAMMABLE GAS (Division 2.2) - Green
- OXIDIZER (5.1) - subsidiary hazard label - Yellow
- Cargo Aircraft Only
- Orientation labels (This Side Up with Arrows)

**Markings Required:**
- UN1003
- PSN: "AIR, REFRIGERATED LIQUID"
- **Orientation marking** "THIS SIDE UP" or "THIS END UP"
- **Vent rate marking**: "VENT RATE__SCFH" (letters at least 1/2 inch high)

**POP Marking Validation:**
- Per A6.11: DOT 4L cylinders (VERTICAL POSITION required)
- Dewars: max 25 L (max 6 per aircraft) or 100 L (max 1 per aircraft)
- Filling density per Figure A3.4

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Missing Orientation labels (This Side Up) | Cryogenic liquid orientation requirement |
| 2 | Key 19 missing venting instructions | Cryogenic venting requirement validation |
| 3 | Missing OXIDIZER (5.1) subsidiary label | Subsidiary label validation |

---

## Packaging Paragraph A6.12 - Ethyl Chloride

---

## Scenario 11: UN1037 - ETHYL CHLORIDE

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1037 |
| PSN | ETHYL CHLORIDE |
| Hazard Class | 2.1 |
| Subsidiary Risk | None |
| Packing Group | None |
| Packaging Paragraph | A6.12 |
| Special Provisions | P4, N86 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" |
| Key 11 | "UN1037" |
| Key 12 | "ETHYL CHLORIDE" |
| Key 13 | "2.1" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | "4 boxes x 2 kg" |
| Key 17 | "A6.12" |
| Key 19 | "Ship valve up in vertical position" |

### Expected Package Inspection (Successful)

**Labels Required:**
- FLAMMABLE GAS (Division 2.1) - Red
- Cargo Aircraft Only

**Markings Required:**
- UN1037
- PSN: "ETHYL CHLORIDE"

**POP Marking Validation:**
- Per A6.12: PG I performance level required
- Boxes: 4C1, 4C2, 4D, 4F, 4G (4G max 30 kg gross) with glass/earthenware/metal inner (max 500g each)
- Drums: Steel (1A1) max 100 L
- DOT cylinders: any except acetylene; **NO aluminum alloy**
- Outage min 7.5% at 21C

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | POP marking shows DOT-3AL (aluminum - not authorized) | A6.12 cylinder material restriction |
| 2 | Key 17 shows "A6.4" instead of "A6.12" | Packaging instruction validation |
| 3 | Missing 7.5% outage in container | A6.12 outage requirement |

---

## Packaging Paragraph A6.13 - Ethylene Oxide

---

## Scenario 12: UN1040 - ETHYLENE OXIDE

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1040 |
| PSN | ETHYLENE OXIDE |
| Details | up to a total pressure of 1 MPA (10 bar) at 50 degrees C |
| Hazard Class | 2.3 |
| Subsidiary Risk | 2.1 (Flammable) |
| Packing Group | None |
| Packaging Paragraph | A6.13 |
| Special Provisions | P2, 4 |
| Inhalation Hazard Zone | Zone D |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" |
| Key 11 | "UN1040" |
| Key 12 | "ETHYLENE OXIDE, TOXIC-INHALATION HAZARD, ZONE D" |
| Key 13 | "2.3" |
| Key 14 | "(2.1)" |
| Key 15 | Empty |
| Key 16 | "1 cylinder x 50 kg" |
| Key 17 | "A6.13" |
| Key 19 | "Ship valve up in vertical position" |

### Expected Package Inspection (Successful)

**Labels Required:**
- TOXIC GAS (Division 2.3) - White
- FLAMMABLE GAS (Division 2.1) - subsidiary hazard label - Red
- Cargo Aircraft Only

**Markings Required:**
- UN1040
- PSN: "ETHYLENE OXIDE"
- "INHALATION HAZARD" marking
- **"THIS END UP"** marking on drum top head (per A14.4.2.1)

**POP Marking Validation:**
- Per A6.13: DOT/UN cylinders (any except acetylene)
- NO silver, mercury, mercury alloys, or copper in contact with liquid/vapor
- Cylinders >4 L: pressurizing valves and insulation required
- Fusible relief device (69-77C yield) required
- Max 115 L nominal capacity

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 12 missing "TOXIC-INHALATION HAZARD, ZONE D" | Inhalation hazard zone validation |
| 2 | Missing FLAMMABLE GAS (2.1) subsidiary label | Subsidiary label validation |
| 3 | Missing "THIS END UP" marking on drum | A6.13 specific marking requirement |

---

## Packaging Paragraph A6.14 - Ethylamine

---

## Scenario 13: UN1036 - ETHYLAMINE

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1036 |
| PSN | ETHYLAMINE |
| Hazard Class | 2.1 |
| Subsidiary Risk | None |
| Packing Group | None |
| Packaging Paragraph | A6.14 |
| Special Provisions | P4, N87 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" |
| Key 11 | "UN1036" |
| Key 12 | "ETHYLAMINE" |
| Key 13 | "2.1" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | "1 drum x 100 L" |
| Key 17 | "A6.14" |
| Key 19 | "Ship valve up in vertical position" |

### Expected Package Inspection (Successful)

**Labels Required:**
- FLAMMABLE GAS (Division 2.1) - Red
- Cargo Aircraft Only

**Markings Required:**
- UN1036
- PSN: "ETHYLAMINE"

**POP Marking Validation:**
- Per A6.14: Metal drums (1A1) at PG I performance level
- Any DOT specification cylinder except acetylene
- Packing group code: X (PG I level)

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | POP marking shows packing group code "Z" (insufficient for PG I) | Packing group rating validation |
| 2 | Key 7 shows "Passenger and Cargo Aircraft" (P4 requires CAO) | Aircraft limitation validation |
| 3 | Key 17 shows "A6.4" instead of "A6.14" | Packaging instruction validation |

---

## Packaging Paragraph A6.15 - Extremely Dangerous Toxic Gases (Zone A)

---

## Scenario 14: UN3516 - ADSORBED GAS, TOXIC CORROSIVE N.O.S.

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3516 |
| PSN | ADSORBED GAS, TOXIC CORROSIVE N.O.S. |
| Details | Inhalation Hazard Zone A |
| Hazard Class | 2.3 |
| Subsidiary Risk | 8 (Corrosive) |
| Packing Group | None |
| Packaging Paragraph | A6.15 |
| Special Provisions | P1, 1 |
| Inhalation Hazard Zone | Zone A (Most Dangerous) |
| Technical Name Required | Yes |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" (P1 - most restrictive) |
| Key 11 | "UN3516" |
| Key 12 | "ADSORBED GAS, TOXIC CORROSIVE N.O.S. (Hydrogen cyanide), TOXIC-INHALATION HAZARD, ZONE A" |
| Key 13 | "2.3" |
| Key 14 | "(8)" |
| Key 15 | Empty |
| Key 16 | "1 cylinder x 10 kg" |
| Key 17 | "A6.15" |
| Key 19 | "Ship valve up in vertical position" |

### Expected Package Inspection (Successful)

**Labels Required:**
- TOXIC INHALATION HAZARD label (Zone A requires this specific label)
- CORROSIVE (Class 8) - subsidiary hazard label
- Cargo Aircraft Only

**Markings Required:**
- UN3516
- PSN: "ADSORBED GAS, TOXIC CORROSIVE N.O.S." with technical name "(Hydrogen cyanide)"
- "INHALATION HAZARD" marking
- "POISON" marking (may also be required for Zone A)

**POP Marking Validation:**
- Per A6.15: DOT 3A1800, 3AA1800, 3AL1800, 3D, 3E1800, 33
- Max 57 kg (125 lbs) water capacity for 3A, 3AA, 3AL, 3D, 33
- **NO DOT 3AL for arsine or phosphine**
- Packing group code: X (highest rating)

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 12 missing technical name for N.O.S. entry | Technical name requirement validation |
| 2 | Key 12 shows "ZONE B" instead of "ZONE A" | Zone accuracy validation (critical for Zone A) |
| 3 | Missing "INHALATION HAZARD" marking on package | Division 2.3 marking requirement |

---

## Packaging Paragraph A6.16 - Toxic Insecticide Gases and Mixtures

---

## Scenario 15: UN1581 - CHLOROPICRIN AND METHYL BROMIDE MIXTURES

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1581 |
| PSN | CHLOROPICRIN AND METHYL BROMIDE MIXTURES |
| Details | with more than 2% chloropicrin |
| Hazard Class | 2.3 |
| Subsidiary Risk | None |
| Packing Group | None |
| Packaging Paragraph | A6.16 |
| Special Provisions | P2, 2, N86 |
| Inhalation Hazard Zone | Zone B |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" |
| Key 11 | "UN1581" |
| Key 12 | "CHLOROPICRIN AND METHYL BROMIDE MIXTURES with more than 2% chloropicrin, TOXIC-INHALATION HAZARD, ZONE B" |
| Key 13 | "2.3" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | "2 cylinders x 50 kg" |
| Key 17 | "A6.16" |
| Key 19 | "Ship valve up in vertical position" |

### Expected Package Inspection (Successful)

**Labels Required:**
- TOXIC GAS (Division 2.3) - White
- Cargo Aircraft Only

**Markings Required:**
- UN1581
- PSN: "CHLOROPICRIN AND METHYL BROMIDE MIXTURES"
- "INHALATION HAZARD" marking

**POP Marking Validation:**
- Per A6.16: DOT 3A, 3AA, 3B, 3C, 3E, 4A, 4B, 4BA, 4BW, 4C
- Max 113 kg (250 lbs) water capacity (exception: methyl bromide not subject to this limit)
- Packing group code: X, Y, or Z

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 12 missing "with more than 2% chloropicrin" detail | PSN completeness validation |
| 2 | Cylinder water capacity exceeds 113 kg limit | A6.16 cylinder capacity validation |
| 3 | Key 12 shows "ZONE C" instead of "ZONE B" | Inhalation hazard zone accuracy |

---

## Packaging Paragraph A6.18 - Organophosphate/Compressed Gas Mixtures

---

## Scenario 16: UN1612 - HEXAETHYL TETRAPHOSPHATE AND COMPRESSED GAS MIXTURES

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1612 |
| PSN | HEXAETHYL TETRAPHOSPHATE AND COMPRESSED GAS MIXTURES |
| Hazard Class | 2.3 |
| Subsidiary Risk | None |
| Packing Group | None |
| Packaging Paragraph | A6.18 |
| Special Provisions | P2, 3 |
| Inhalation Hazard Zone | Zone C |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" |
| Key 11 | "UN1612" |
| Key 12 | "HEXAETHYL TETRAPHOSPHATE AND COMPRESSED GAS MIXTURES, TOXIC-INHALATION HAZARD, ZONE C" |
| Key 13 | "2.3" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | "4 cylinders x 5 kg" |
| Key 17 | "A6.18" |
| Key 19 | "Ship valve up in vertical position" |

### Expected Package Inspection (Successful)

**Labels Required:**
- TOXIC GAS (Division 2.3) - White
- Cargo Aircraft Only

**Markings Required:**
- UN1612
- PSN: "HEXAETHYL TETRAPHOSPHATE AND COMPRESSED GAS MIXTURES"
- "INHALATION HAZARD" marking

**POP Marking Validation:**
- Per A6.18: **ONLY** DOT 3A240, 3AA240, 3B240, 4A240, 4B240, 4BA240, 4BW240 (240 series)
- Max 20% organic phosphate by weight
- Max 5 kg per cylinder
- Max 80% filling density
- **NO eduction tube or fusible plug**
- Pack in 4G fiberboard box (max 4 cylinders) or 4C1, 4C2, 4D, 4F wooden box (max 12 cylinders)

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | POP marking shows DOT-3A1800 (not 240 series - not authorized) | A6.18 specific cylinder requirement |
| 2 | Cylinder has eduction tube (prohibited for A6.18) | A6.18 prohibited component validation |
| 3 | Key 12 missing "TOXIC-INHALATION HAZARD, ZONE C" | Inhalation hazard zone validation |

---

## Packaging Paragraph A6.19 - Hazard Zone A Materials (Special)

---

## Scenario 17: UN2534 - METHYLCHLOROSILANE

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN2534 |
| PSN | METHYLCHLOROSILANE |
| Hazard Class | 2.3 |
| Subsidiary Risk | 2.1 (Flammable), 8 (Corrosive) |
| Packing Group | None |
| Packaging Paragraph | A6.19 |
| Special Provisions | P2, 2, A2, A7, N34 |
| Inhalation Hazard Zone | Zone B |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" |
| Key 11 | "UN2534" |
| Key 12 | "METHYLCHLOROSILANE, TOXIC-INHALATION HAZARD, ZONE B" |
| Key 13 | "2.3" |
| Key 14 | "(2.1, 8)" |
| Key 15 | Empty |
| Key 16 | "1 cylinder x 25 kg" |
| Key 17 | "A6.19" |
| Key 19 | "Ship valve up in vertical position" |

### Expected Package Inspection (Successful)

**Labels Required:**
- TOXIC GAS (Division 2.3) - White
- FLAMMABLE GAS (Division 2.1) - subsidiary hazard label - Red
- CORROSIVE (Class 8) - subsidiary hazard label
- Cargo Aircraft Only

**Markings Required:**
- UN2534
- PSN: "METHYLCHLOROSILANE"
- "INHALATION HAZARD" marking

**POP Marking Validation:**
- Per A6.19: DOT cylinders per 49 CFR Part 178 Subpart C (EXCEPT 8, 8AL, and 39)
- May use drum-in-drum configuration for PG I materials
- Packing group code: X (highest rating)

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 14 shows only "(2.1)" missing "(8)" | Multiple subsidiary validation |
| 2 | Missing CORROSIVE (8) subsidiary label | Subsidiary label validation |
| 3 | POP marking shows DOT-39 (not authorized for Zone A) | A6.19 cylinder restriction validation |

---

## Packaging Paragraph A6.20 - Nitric Oxide

---

## Scenario 18: UN1660 - NITRIC OXIDE, COMPRESSED

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1660 |
| PSN | NITRIC OXIDE, COMPRESSED |
| Hazard Class | 2.3 |
| Subsidiary Risk | 5.1 (Oxidizer), 8 (Corrosive) |
| Packing Group | None |
| Packaging Paragraph | A6.20 |
| Special Provisions | P1, 1 |
| Inhalation Hazard Zone | Zone A |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" (P1 - most restrictive) |
| Key 11 | "UN1660" |
| Key 12 | "NITRIC OXIDE, COMPRESSED, TOXIC-INHALATION HAZARD, ZONE A" |
| Key 13 | "2.3" |
| Key 14 | "(5.1, 8)" |
| Key 15 | Empty |
| Key 16 | "1 cylinder x 20 kg" |
| Key 17 | "A6.20" |
| Key 19 | "Ship valve up in vertical position" |

### Expected Package Inspection (Successful)

**Labels Required:**
- TOXIC INHALATION HAZARD label (Zone A)
- OXIDIZER (5.1) - subsidiary hazard label - Yellow
- CORROSIVE (Class 8) - subsidiary hazard label
- Cargo Aircraft Only

**Markings Required:**
- UN1660
- PSN: "NITRIC OXIDE, COMPRESSED"
- "INHALATION HAZARD" marking
- "POISON" marking

**POP Marking Validation:**
- Per A6.20: **ONLY** DOT 3A1800, 3AA1800, 3AL1800, 3E1800
- Max 5170 kPa (750 psi) at 21C
- **Stainless steel valve required**
- **NO safety (pressure relief) devices**
- Valve outlet sealed with threaded cap/plug and inert gasket
- Packing group code: X

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Cylinder has pressure relief device (prohibited for nitric oxide) | A6.20 prohibited component validation |
| 2 | Key 14 missing "(5.1)" oxidizer subsidiary | Multiple subsidiary validation |
| 3 | Key 12 shows "ZONE B" instead of "ZONE A" | Zone A accuracy validation |

---

## Packaging Paragraph A6.21 - Ethyl Methyl Ether

---

## Scenario 19: UN1039 - ETHYL METHYL ETHER

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1039 |
| PSN | ETHYL METHYL ETHER |
| Hazard Class | 2.1 |
| Subsidiary Risk | None |
| Packing Group | None |
| Packaging Paragraph | A6.21 |
| Special Provisions | P4 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" |
| Key 11 | "UN1039" |
| Key 12 | "ETHYL METHYL ETHER" |
| Key 13 | "2.1" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | "1 drum x 50 L" |
| Key 17 | "A6.21" |
| Key 19 | "Ship valve up in vertical position" |

### Expected Package Inspection (Successful)

**Labels Required:**
- FLAMMABLE GAS (Division 2.1) - Red
- Cargo Aircraft Only

**Markings Required:**
- UN1039
- PSN: "ETHYL METHYL ETHER"

**POP Marking Validation:**
- Per A6.21: PG I performance level required
- Combination packaging: various drums, jerricans, boxes at PG I
- Single packaging: drums or jerricans (steel, aluminum, other metal, plastic)
- DOT cylinders: any except 3HT and acetylene cylinders
- Packing group code: X (PG I level)

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | POP marking shows packing group code "Y" (insufficient for PG I) | Packing group rating validation |
| 2 | POP marking shows DOT-3HT (not authorized for A6.21) | A6.21 cylinder restriction validation |
| 3 | Key 7 shows "Passenger and Cargo Aircraft" (P4 requires CAO) | Aircraft limitation validation |

---

## Packaging Paragraph A6.22 - Chemical Under Pressure N.O.S.

---

## Scenario 20: UN3500 - CHEMICAL UNDER PRESSURE, N.O.S.

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3500 |
| PSN | CHEMICAL UNDER PRESSURE, N.O.S. |
| Hazard Class | 2.2 |
| Subsidiary Risk | None |
| Packing Group | None |
| Packaging Paragraph | A6.22 |
| Special Provisions | P5, 362 |
| Technical Name Required | Yes |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" |
| Key 11 | "UN3500" |
| Key 12 | "CHEMICAL UNDER PRESSURE, N.O.S. (Nitrogen, cleaning compound)" |
| Key 13 | "2.2" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | "2 cylinders x 10 kg" |
| Key 17 | "A6.22" |
| Key 19 | "Ship valve up in vertical position" |

### Expected Package Inspection (Successful)

**Labels Required:**
- NON-FLAMMABLE GAS (Division 2.2) - Green

**Markings Required:**
- UN3500
- PSN: "CHEMICAL UNDER PRESSURE, N.O.S." with technical name "(Nitrogen, cleaning compound)"

**POP Marking Validation:**
- Per A6.22: DOT cylinders and UN pressure receptacles per A6.4 and A6.5
- At 50C: non-gaseous phase max 95% water capacity
- Not completely filled at 60C
- Minimum test pressure: 291 psig (20 bar)
- **Max 5-year requalification interval**
- Packing group code: X, Y, or Z

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 12 missing technical name for N.O.S. entry | Technical name requirement validation |
| 2 | Cylinder requalification date exceeds 5 years | A6.22 requalification interval validation |
| 3 | Label shows FLAMMABLE GAS (2.1) instead of NON-FLAMMABLE GAS (2.2) | Label division validation |

---

## Packaging Paragraphs A6.23, A6.24, A6.25 - Fuel Cell Cartridges

---

## Scenario 21: UN3479 - FUEL CELL CARTRIDGES

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3479 |
| PSN | FUEL CELL CARTRIDGES |
| Details | containing hydrogen in metal hydride |
| Hazard Class | 2.1 |
| Subsidiary Risk | None |
| Packing Group | II |
| Packaging Paragraph | A6.23, A6.24, A6.25 |
| Special Provisions | P5, 328 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" |
| Key 11 | "UN3479" |
| Key 12 | "FUEL CELL CARTRIDGES containing hydrogen in metal hydride" |
| Key 13 | "2.1" |
| Key 14 | Empty |
| Key 15 | "II" (This is one of the few Class 2 materials WITH a packing group) |
| Key 16 | "10 cartridges x 500 g" |
| Key 17 | "A6.23" (standalone) or "A6.24" (in equipment) or "A6.25" (packed with equipment) |
| Key 19 | Not required for fuel cell cartridges |

### Expected Package Inspection (Successful)

**Labels Required:**
- FLAMMABLE GAS (Division 2.1) - Red

**Markings Required:**
- UN3479
- PSN: "FUEL CELL CARTRIDGES containing hydrogen in metal hydride"

**POP Marking Validation:**
- Per A6.23 (standalone): Max 1 kg per cartridge
  - Outer packaging: Drums (1A2, 1B2, 1D, 1G, 1H2, 1N2), Jerricans (3A2, 3B2, 3H2), Boxes (4A, 4B, 4C1, 4C2, 4D, 4F, 4G, 4H1, 4H2, 4N)
- Per A6.24 (in equipment): UN spec packaging NOT required
  - Protect against short circuit and inadvertent operation
  - Fuel cell systems may NOT charge batteries during transport
- Per A6.25 (packed with equipment): UN spec packaging NOT required
  - Max cartridges: equipment requirement + 2 spares
- Packing group code: Y (for PG II)

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 15 empty (this material DOES have PG II) | Packing group requirement validation for fuel cells |
| 2 | Individual cartridge exceeds 1 kg limit | A6.23 weight limit validation |
| 3 | Fuel cell system charging battery during transport (A6.24) | A6.24 prohibition validation |

---

## Packaging Paragraph A6.26 - Metal Hydride Storage Systems

---

## Scenario 22: UN3468 - HYDROGEN IN A METAL HYDRIDE STORAGE SYSTEM

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3468 |
| PSN | HYDROGEN IN A METAL HYDRIDE STORAGE SYSTEM |
| Hazard Class | 2.1 |
| Subsidiary Risk | None |
| Packing Group | None |
| Packaging Paragraph | A6.26 |
| Special Provisions | P4, 167 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" |
| Key 11 | "UN3468" |
| Key 12 | "HYDROGEN IN A METAL HYDRIDE STORAGE SYSTEM" |
| Key 13 | "2.1" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | "1 storage system x 50 L" |
| Key 17 | "A6.26" |
| Key 19 | "Ship valve up in vertical position" |

### Expected Package Inspection (Successful)

**Labels Required:**
- FLAMMABLE GAS (Division 2.1) - Red
- Cargo Aircraft Only

**Markings Required:**
- UN3468
- PSN: "HYDROGEN IN A METAL HYDRIDE STORAGE SYSTEM"
- **"H" mark** for steel or composite receptacles with steel liners (per 49 CFR 173.301b(f))

**POP Marking Validation:**
- Per A6.26: Max 150 L water capacity
- Max 25 MPa developed pressure
- Designed per ISO 16111
- Steel or composite receptacles with steel liners: must bear **"H" mark**
- Max 5-year requalification interval per ISO 16111
- Packing group code: X, Y, or Z

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Missing "H" mark on steel receptacle | A6.26 hydrogen compatibility marking requirement |
| 2 | System water capacity exceeds 150 L | A6.26 capacity limit validation |
| 3 | Requalification date exceeds 5 years | A6.26 requalification interval validation |

---

## Packaging Paragraph A6.27 - Adsorbed Gases

---

## Scenario 23: UN3511 - ADSORBED GAS N.O.S.

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3511 |
| PSN | ADSORBED GAS N.O.S. |
| Hazard Class | 2.2 |
| Subsidiary Risk | None |
| Packing Group | None |
| Packaging Paragraph | A6.27 |
| Special Provisions | P5 |
| Technical Name Required | Yes |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" |
| Key 11 | "UN3511" |
| Key 12 | "ADSORBED GAS N.O.S. (Argon, krypton)" |
| Key 13 | "2.2" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | "2 cylinders x 10 kg" |
| Key 17 | "A6.27" |
| Key 19 | "Ship valve up in vertical position" |

### Expected Package Inspection (Successful)

**Labels Required:**
- NON-FLAMMABLE GAS (Division 2.2) - Green

**Markings Required:**
- UN3511
- PSN: "ADSORBED GAS N.O.S." with technical name "(Argon, krypton)"

**POP Marking Validation:**
- Per A6.27: Adsorbed gas cylinders per manufacturer specifications
- Gas adsorbed onto solid porous material
- Packing group code: X, Y, or Z

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 12 missing technical name for N.O.S. entry | Technical name requirement validation |
| 2 | Package marking shows PSN without technical name | Marking completeness for N.O.S. |
| 3 | Key 19 missing cylinder position statement | Handling information validation |

---

## Packaging Paragraph A6.28 - Articles Containing Gas N.O.S.

---

## Scenario 24: UN3537 - ARTICLES CONTAINING FLAMMABLE GAS, N.O.S.

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3537 |
| PSN | ARTICLES CONTAINING FLAMMABLE GAS, N.O.S. |
| Hazard Class | 2.1 |
| Subsidiary Risk | None |
| Packing Group | None |
| Packaging Paragraph | A6.28 |
| Special Provisions | P4, 391 |
| Technical Name Required | Yes |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" |
| Key 11 | "UN3537" |
| Key 12 | "ARTICLES CONTAINING FLAMMABLE GAS, N.O.S. (Propane heating element)" |
| Key 13 | "2.1" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | "2 articles x 25 kg" |
| Key 17 | "A6.28" |
| Key 19 | Not required for articles |

### Expected Package Inspection (Successful)

**Labels Required:**
- FLAMMABLE GAS (Division 2.1) - Red
- Cargo Aircraft Only

**Markings Required:**
- UN3537
- PSN: "ARTICLES CONTAINING FLAMMABLE GAS, N.O.S." with technical name "(Propane heating element)"

**POP Marking Validation:**
- Per A6.28: Max net quantity 150 kg per package
- When packaged: PG II performance level required
- Pack to prevent movement and inadvertent operation
- Outer packaging: Drums (1A2, 1B2, 1N2, 1D, 1G, 1H2), Boxes (4A, 4B, 4C1, 4C2, 4D, 4F, 4G, 4H1, 4H2, 4N), Jerricans (3A2, 3H2, 3B2)
- Robust articles: may be transported unpackaged or on pallets
- Packing group code: Y (for PG II level)

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 12 missing technical name for N.O.S. entry | Technical name requirement validation |
| 2 | Package net quantity exceeds 150 kg | A6.28 quantity limit validation |
| 3 | POP marking shows packing group code "Z" (insufficient for PG II) | Packing group rating validation |

---

## Supplemental Scenarios for Complete Coverage

The following scenarios provide additional coverage for specific Division 2.3 inhalation hazard zones not covered above:

---

## Scenario 25: UN1076 - PHOSGENE (Zone A - Extremely Dangerous)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1076 |
| PSN | PHOSGENE |
| Hazard Class | 2.3 |
| Subsidiary Risk | 8 (Corrosive) |
| Packing Group | None |
| Packaging Paragraph | A6.15 |
| Special Provisions | P1, 1 |
| Inhalation Hazard Zone | Zone A (LC50 ≤200 ppm) |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" (P1 - most restrictive) |
| Key 11 | "UN1076" |
| Key 12 | "PHOSGENE, TOXIC-INHALATION HAZARD, ZONE A" |
| Key 13 | "2.3" |
| Key 14 | "(8)" |
| Key 15 | Empty |
| Key 16 | "1 cylinder x 68 kg" |
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
- "POISON" marking

**POP Marking Validation:**
- Per A6.15 for phosgene specifically:
- Max 125% filling density
- Max 68 kg (150 lbs) per cylinder
- **Leakage test required**: immerse in 66C water bath for 30 min before transport
- Do not loosen valve after test or during transport
- Packing group code: X

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Cylinder exceeds 68 kg (150 lbs) limit for phosgene | A6.15 phosgene weight limit validation |
| 2 | Key 12 shows "ZONE B" instead of "ZONE A" | Zone accuracy validation (critical safety) |
| 3 | Valve loosened after water bath test | A6.15 phosgene valve handling validation |

---

## Scenario 26: UN3162 - LIQUEFIED GAS, TOXIC, N.O.S. (Zone D)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3162 |
| PSN | LIQUEFIED GAS, TOXIC, N.O.S. |
| Details | Inhalation Hazard Zone D |
| Hazard Class | 2.3 |
| Subsidiary Risk | None |
| Packing Group | None |
| Packaging Paragraph | A6.4 |
| Special Provisions | P2, 4 |
| Inhalation Hazard Zone | Zone D (Least Dangerous: LC50 >3000 to ≤5000 ppm) |
| Technical Name Required | Yes |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" |
| Key 11 | "UN3162" |
| Key 12 | "LIQUEFIED GAS, TOXIC, N.O.S. (Sulfur dioxide), TOXIC-INHALATION HAZARD, ZONE D" |
| Key 13 | "2.3" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | "2 cylinders x 30 kg" |
| Key 17 | "A6.4" |
| Key 19 | "Ship valve up in vertical position" |

### Expected Package Inspection (Successful)

**Labels Required:**
- TOXIC GAS (Division 2.3) - White
- Cargo Aircraft Only

**Markings Required:**
- UN3162
- PSN: "LIQUEFIED GAS, TOXIC, N.O.S." with technical name "(Sulfur dioxide)"
- "INHALATION HAZARD" marking

**POP Marking Validation:**
- Per A6.4: DOT cylinders 3A, 3AA, 3AL, 3B, 3E, 4B, 4BA, 4BW, 39
- Packing group code: X, Y, or Z

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 12 missing technical name for N.O.S. entry | Technical name requirement validation |
| 2 | Key 12 shows "ZONE A" instead of "ZONE D" (major safety difference) | Zone designation accuracy |
| 3 | Key 7 shows "Passenger and Cargo Aircraft" (toxic gases require CAO) | Aircraft limitation for Division 2.3 |

---

## Quick Reference Tables

### Packaging Paragraph Coverage Summary

| Paragraph | UN Number | PSN | Division | Zone | Scenario |
|-----------|-----------|-----|----------|------|----------|
| A6.2 | UN1950 | AEROSOLS, FLAMMABLE | 2.1 | - | 1 |
| A6.3 | UN1002 | AIR, COMPRESSED | 2.2 | - | 2 |
| A6.4 | UN1005 | AMMONIA, ANHYDROUS | 2.2 | - | 3 |
| A6.5 | UN1008 | BORON TRIFLUORIDE | 2.3 | B | 4 |
| A6.6 | UN1012 | BUTYLENE | 2.1 | - | 5 |
| A6.7 | UN1044 | FIRE EXTINGUISHERS | 2.2 | - | 6 |
| A6.8 | UN3164 | ARTICLES, PRESSURIZED, PNEUMATIC | 2.2 | - | 7 |
| A6.9 | UN1001 | ACETYLENE, DISSOLVED | 2.1 | - | 8 |
| A6.10 | UN1057 | LIGHTER REFILLS | 2.1 | - | 9 |
| A6.11 | UN1003 | AIR, REFRIGERATED LIQUID | 2.2 | - | 10 |
| A6.12 | UN1037 | ETHYL CHLORIDE | 2.1 | - | 11 |
| A6.13 | UN1040 | ETHYLENE OXIDE | 2.3 | D | 12 |
| A6.14 | UN1036 | ETHYLAMINE | 2.1 | - | 13 |
| A6.15 | UN3516 | ADSORBED GAS, TOXIC CORROSIVE N.O.S. | 2.3 | A | 14 |
| A6.16 | UN1581 | CHLOROPICRIN AND METHYL BROMIDE MIXTURES | 2.3 | B | 15 |
| A6.17 | N/A | **Does not exist** | - | - | - |
| A6.18 | UN1612 | HEXAETHYL TETRAPHOSPHATE MIXTURES | 2.3 | C | 16 |
| A6.19 | UN2534 | METHYLCHLOROSILANE | 2.3 | B | 17 |
| A6.20 | UN1660 | NITRIC OXIDE, COMPRESSED | 2.3 | A | 18 |
| A6.21 | UN1039 | ETHYL METHYL ETHER | 2.1 | - | 19 |
| A6.22 | UN3500 | CHEMICAL UNDER PRESSURE, N.O.S. | 2.2 | - | 20 |
| A6.23/24/25 | UN3479 | FUEL CELL CARTRIDGES | 2.1 | - | 21 |
| A6.26 | UN3468 | HYDROGEN IN METAL HYDRIDE STORAGE | 2.1 | - | 22 |
| A6.27 | UN3511 | ADSORBED GAS N.O.S. | 2.2 | - | 23 |
| A6.28 | UN3537 | ARTICLES CONTAINING FLAMMABLE GAS, N.O.S. | 2.1 | - | 24 |
| A6.15 | UN1076 | PHOSGENE | 2.3 | A | 25 |
| A6.4 | UN3162 | LIQUEFIED GAS, TOXIC, N.O.S. | 2.3 | D | 26 |

### Division Coverage

| Division | Scenarios | Count |
|----------|-----------|-------|
| 2.1 (Flammable Gas) | 1, 5, 8, 9, 11, 13, 19, 21, 22, 24 | 10 |
| 2.2 (Non-Flammable Gas) | 2, 3, 6, 7, 10, 20, 23 | 7 |
| 2.3 (Toxic Gas) | 4, 12, 14, 15, 16, 17, 18, 25, 26 | 9 |

### Inhalation Hazard Zone Coverage

| Zone | Scenarios | UN Numbers |
|------|-----------|------------|
| Zone A (Most Dangerous) | 14, 18, 25 | UN3516, UN1660, UN1076 |
| Zone B | 4, 15, 17 | UN1008, UN1581, UN2534 |
| Zone C | 16 | UN1612 |
| Zone D (Least Dangerous) | 12, 26 | UN1040, UN3162 |

### N.O.S. Entries Requiring Technical Names

| Scenario | UN Number | PSN |
|----------|-----------|-----|
| 14 | UN3516 | ADSORBED GAS, TOXIC CORROSIVE N.O.S. |
| 20 | UN3500 | CHEMICAL UNDER PRESSURE, N.O.S. |
| 23 | UN3511 | ADSORBED GAS N.O.S. |
| 24 | UN3537 | ARTICLES CONTAINING FLAMMABLE GAS, N.O.S. |
| 26 | UN3162 | LIQUEFIED GAS, TOXIC, N.O.S. |

### Special Cylinder Requirements

| Paragraph | Special Requirement |
|-----------|-------------------|
| A6.9 | ONLY DOT 8 or 8AL for acetylene |
| A6.12 | NO aluminum alloy cylinders |
| A6.15 | NO DOT 3AL for arsine/phosphine |
| A6.18 | ONLY 240 series cylinders; NO eduction tube/fusible plug |
| A6.19 | NO DOT 8, 8AL, or 39 cylinders |
| A6.20 | NO pressure relief device; stainless steel valve required |
| A6.21 | NO DOT 3HT cylinders |

### Key 19 Requirements by Material Type

| Material Type | Key 19 Requirement |
|---------------|-------------------|
| Cylinders (general) | "Ship valve up in vertical position" or "Ship in horizontal position" |
| Aerosols (A6.2) | Not required |
| Fire extinguishers (A6.7) | Not required |
| Articles (A6.8, A6.28) | Not required |
| Lighter refills (A6.10) | Not required |
| Cryogenic liquids (A6.11) | Venting instructions required |
| Fuel cell cartridges (A6.23-25) | Not required |

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

### Key Class 2 Validation Points
1. **Key 15 (Packing Group)**: Should be BLANK for most Class 2 materials (exception: UN3479 Fuel Cell Cartridges has PG II)
2. **Key 19 Requirement**: Cylinder position statement required for most Class 2 (exceptions: aerosols, fire extinguishers, articles, lighter refills, fuel cells)
3. **Zone Designation**: Division 2.3 toxic gases require "TOXIC-INHALATION HAZARD, ZONE X" in Key 12
4. **INHALATION HAZARD Marking**: Required on all Division 2.3 packages
5. **Technical Names**: Required for all N.O.S. entries in both Key 12 and package markings
6. **Cylinder Specifications**: Many A6.xx paragraphs have specific cylinder restrictions (see table above)

### After Testing
1. Compile all test results into a summary report
2. Categorize issues by severity (critical, major, minor)
3. Create bug reports for any validation failures
4. Update test scenarios if regulations or app logic have changed
