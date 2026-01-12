# Class 4 (Flammable Solids) Test Scenarios

## Overview

This document contains 20 comprehensive manual test scenarios for Class 4 hazardous materials in the HAZ mobile inspection app. These scenarios are designed for physical walk-throughs of the Inspector persona workflow to validate SDDG inspection, package inspection, and frustration handling.

### What Each Scenario Includes

1. **Material Details**: UN number, PSN, hazard class/division, packing group, packaging paragraph, special provisions
2. **Expected SDDG Inspection (Successful)**: What each SDDG Key should contain for a passing inspection
3. **Expected Package Inspection (Successful)**: Required labels, markings, and POP marking validation
4. **Alterations**: 3 intentional errors per scenario to test frustration handling

### Class 4 Division Reference

| Division | Name | Hazard | Primary Label |
|----------|------|--------|---------------|
| 4.1 | Flammable Solids | Burns readily, friction-sensitive, self-reactive | Red/White vertical stripes (FLAMMABLE SOLID) |
| 4.2 | Spontaneously Combustible | Pyrophoric or self-heating | Upper white, lower red (SPONTANEOUSLY COMBUSTIBLE) |
| 4.3 | Dangerous When Wet | Emits flammable gas when wet | Blue (DANGEROUS WHEN WET) |

### Key Validation Points Summary

#### SDDG Inspection (Keys)

| Key | Description | Class 4 Specifics |
|-----|-------------|-------------------|
| Key 7 | Aircraft Limitations | "Cargo Aircraft Only" OR "Passenger and Cargo Aircraft" |
| Key 11 | UN Number | Format: "UN####" (e.g., "UN1428") |
| Key 12 | PSN | Full name; technical name in parentheses for N.O.S. |
| Key 13 | Class/Division | Must show full division: "4.1", "4.2", or "4.3" (NOT just "4") |
| Key 14 | Subsidiary Risk | "6.1", "8", "4.2", or empty if none |
| Key 15 | Packing Group | "I", "II", or "III" (required for most Class 4) |
| Key 16 | Quantity/Packing | Quantity + packaging description |
| Key 17 | Packaging Paragraph | A8.xx format (e.g., "A8.3.") |
| Key 19 | Handling Information | Temperature control for self-reactive substances |

#### Package Inspection

| Category | Requirements |
|----------|--------------|
| **Primary Label** | Division-specific: 4.1 (striped), 4.2 (white/red), 4.3 (blue) |
| **Subsidiary Labels** | Per Key 14: TOXIC (6.1), CORROSIVE (8), etc. |
| **CAO Label** | When P1-P4 special provision applies |
| **UN Marking** | "UN####" - minimum 12mm height |
| **PSN Marking** | Full proper shipping name |
| **Technical Name** | Required for N.O.S. entries |
| **POP Marking** | Packaging code + packing group rating (X/Y/Z) |

### Key Differences from Other Classes

| Aspect | Class 1 | Class 2 | Class 3 | Class 4 |
|--------|---------|---------|---------|---------|
| Divisions | 1.1-1.6 + Compat | 2.1, 2.2, 2.3 | None | **4.1, 4.2, 4.3** |
| Key 15 (PG) | Empty | Usually Empty | Always Required | **Usually Required** |
| Key 17 (Para) | A5.xx | A6.xx | A7.xx | **A8.xx** |
| Key 19 | Not Used | Cylinder position | Not Used | **Temp control (some)** |
| Primary Label | EXPLOSIVE | Division-specific | FLAMMABLE LIQUID | **Division-specific** |

---

## Division 4.1 - Flammable Solids (Scenarios 1-7)

---

### Scenario 1: UN1325 - FLAMMABLE SOLID, ORGANIC, N.O.S.

**Purpose**: Test N.O.S. entry requiring technical name, PG II material

#### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1325 |
| PSN | FLAMMABLE SOLID, ORGANIC, N.O.S. |
| Technical Name | (Naphthalene) |
| Hazard Class/Division | 4.1 |
| Packing Group | II |
| Packaging Paragraph | A8.3. |
| Special Provisions | P5 |
| Subsidiary Risk | None |

#### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | Passenger and Cargo Aircraft |
| Key 11 | UN1325 |
| Key 12 | FLAMMABLE SOLID, ORGANIC, N.O.S. (Naphthalene) |
| Key 13 | 4.1 |
| Key 14 | (empty) |
| Key 15 | II |
| Key 16 | 1 fiberboard box (4G) x 10 kg |
| Key 17 | A8.3. |

#### Expected Package Inspection (Successful)

**Labels Required:**
- FLAMMABLE SOLID (Division 4.1) - Red/white vertical stripes

**Markings Required:**
- UN1325 (minimum 12mm height)
- FLAMMABLE SOLID, ORGANIC, N.O.S. (Naphthalene)
- Technical name visible in parentheses

**POP Marking Validation:**
- Packaging Code: 4G
- Packing Group Rating: Y (authorized for PG II)

#### Alterations (Frustration Testing)

| # | Category | Alteration | Expected Result |
|---|----------|------------|-----------------|
| 1 | SDDG - Key 12 | Technical name missing: "FLAMMABLE SOLID, ORGANIC, N.O.S." (no Naphthalene) | Frustration: Missing technical name for N.O.S. entry |
| 2 | Label | Wrong division label: Division 4.3 DANGEROUS WHEN WET label applied | Frustration: Incorrect primary hazard label |
| 3 | POP Marking | Packing group code "Z" instead of "Y" | Frustration: PG II material in Z-rated package (only valid for PG III) |

---

### Scenario 2: UN1944 - MATCHES, SAFETY

**Purpose**: Test common Division 4.1 material, no subsidiary risk

#### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1944 |
| PSN | MATCHES, SAFETY (book, card or strike on box) |
| Hazard Class/Division | 4.1 |
| Packing Group | III |
| Packaging Paragraph | A8.14. |
| Special Provisions | P5 |
| Subsidiary Risk | None |

#### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | Passenger and Cargo Aircraft |
| Key 11 | UN1944 |
| Key 12 | MATCHES, SAFETY (book, card or strike on box) |
| Key 13 | 4.1 |
| Key 14 | (empty) |
| Key 15 | III |
| Key 16 | 2 fiberboard boxes (4G) x 25 kg |
| Key 17 | A8.14. |

#### Expected Package Inspection (Successful)

**Labels Required:**
- FLAMMABLE SOLID (Division 4.1) - Red/white vertical stripes

**Markings Required:**
- UN1944 (minimum 12mm height)
- MATCHES, SAFETY (book, card or strike on box)

**POP Marking Validation:**
- Packaging Code: 4G
- Packing Group Rating: Z (authorized for PG III)

#### Alterations (Frustration Testing)

| # | Category | Alteration | Expected Result |
|---|----------|------------|-----------------|
| 1 | SDDG - Key 13 | Division shows "4" instead of "4.1" | Frustration: Incomplete division - must specify 4.1, 4.2, or 4.3 |
| 2 | Marking | UN number shows "UN1945" (matches, wax) | Frustration: UN number mismatch with PSN |
| 3 | SDDG - Key 15 | Packing group shows "II" instead of "III" | Frustration: Incorrect packing group |

---

### Scenario 3: UN1310 - AMMONIUM PICRATE, WETTED

**Purpose**: Test wetted/desensitized explosive classified as 4.1, PG I material

#### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1310 |
| PSN | AMMONIUM PICRATE, WETTED with not less than 10% water, by mass |
| Hazard Class/Division | 4.1 |
| Packing Group | I |
| Packaging Paragraph | A8.3. |
| Special Provisions | P4, 13, A8, A19, A20, N41 |
| Subsidiary Risk | None |

#### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | Cargo Aircraft Only |
| Key 11 | UN1310 |
| Key 12 | AMMONIUM PICRATE, WETTED with not less than 10% water, by mass |
| Key 13 | 4.1 |
| Key 14 | (empty) |
| Key 15 | I |
| Key 16 | 1 steel drum (1A2) x 50 kg |
| Key 17 | A8.3. |

#### Expected Package Inspection (Successful)

**Labels Required:**
- FLAMMABLE SOLID (Division 4.1) - Red/white vertical stripes
- Cargo Aircraft Only

**Markings Required:**
- UN1310 (minimum 12mm height)
- AMMONIUM PICRATE, WETTED with not less than 10% water, by mass

**POP Marking Validation:**
- Packaging Code: 1A2
- Packing Group Rating: X (required for PG I)

#### Alterations (Frustration Testing)

| # | Category | Alteration | Expected Result |
|---|----------|------------|-----------------|
| 1 | SDDG - Key 7 | Shows "Passenger and Cargo Aircraft" | Frustration: P4 special provision requires Cargo Aircraft Only |
| 2 | POP Marking | Packing group code "Y" instead of "X" | Frustration: PG I material requires X-rated packaging |
| 3 | Label | Missing Cargo Aircraft Only label | Frustration: CAO label required per special provision |

---

### Scenario 4: UN1571 - BARIUM AZIDE, WETTED

**Purpose**: Test 4.1 material with 6.1 (TOXIC) subsidiary risk, PG I

#### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1571 |
| PSN | BARIUM AZIDE, WETTED with not less than 50% water, by mass |
| Hazard Class/Division | 4.1 |
| Packing Group | I |
| Packaging Paragraph | A8.10. |
| Special Provisions | P4, 162, A2 |
| Subsidiary Risk | 6.1 |

#### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | Cargo Aircraft Only |
| Key 11 | UN1571 |
| Key 12 | BARIUM AZIDE, WETTED with not less than 50% water, by mass |
| Key 13 | 4.1 |
| Key 14 | 6.1 |
| Key 15 | I |
| Key 16 | 1 steel drum (1A1) x 25 kg |
| Key 17 | A8.10. |

#### Expected Package Inspection (Successful)

**Labels Required:**
- FLAMMABLE SOLID (Division 4.1) - Red/white vertical stripes
- TOXIC (6.1) - White with skull and crossbones
- Cargo Aircraft Only

**Markings Required:**
- UN1571 (minimum 12mm height)
- BARIUM AZIDE, WETTED with not less than 50% water, by mass

**POP Marking Validation:**
- Packaging Code: 1A1
- Packing Group Rating: X (required for PG I)

#### Alterations (Frustration Testing)

| # | Category | Alteration | Expected Result |
|---|----------|------------|-----------------|
| 1 | SDDG - Key 14 | Subsidiary risk empty (should be "6.1") | Frustration: Missing subsidiary hazard declaration |
| 2 | Label | Missing TOXIC (6.1) subsidiary label | Frustration: Subsidiary hazard label required |
| 3 | SDDG - Key 17 | Shows "A8.3." instead of "A8.10." | Frustration: Incorrect packaging paragraph |

---

### Scenario 5: UN2304 - NAPHTHALENE, MOLTEN

**Purpose**: Test molten material (liquid form of 4.1), orientation requirements

#### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN2304 |
| PSN | NAPHTHALENE, MOLTEN |
| Hazard Class/Division | 4.1 |
| Packing Group | III |
| Packaging Paragraph | A8.2. |
| Special Provisions | P5 |
| Subsidiary Risk | None |

#### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | Passenger and Cargo Aircraft |
| Key 11 | UN2304 |
| Key 12 | NAPHTHALENE, MOLTEN |
| Key 13 | 4.1 |
| Key 14 | (empty) |
| Key 15 | III |
| Key 16 | 1 steel drum (1A1) x 100 L |
| Key 17 | A8.2. |

#### Expected Package Inspection (Successful)

**Labels Required:**
- FLAMMABLE SOLID (Division 4.1) - Red/white vertical stripes
- Orientation arrows (This Side Up) - for liquid/molten material

**Markings Required:**
- UN2304 (minimum 12mm height)
- NAPHTHALENE, MOLTEN

**POP Marking Validation:**
- Packaging Code: 1A1
- Packing Group Rating: Z (authorized for PG III)

#### Alterations (Frustration Testing)

| # | Category | Alteration | Expected Result |
|---|----------|------------|-----------------|
| 1 | Label | Missing orientation arrows | Frustration: Molten/liquid materials require orientation labels |
| 2 | SDDG - Key 17 | Shows "A8.3." (solids) instead of "A8.2." (liquids) | Frustration: Molten materials use liquid packaging paragraph |
| 3 | Marking | PSN abbreviated as "NAPHTHALENE" (missing MOLTEN) | Frustration: Incomplete proper shipping name |

---

### Scenario 6: UN3221 - SELF-REACTIVE LIQUID TYPE B

**Purpose**: Test self-reactive substance requiring temperature control

#### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3221 |
| PSN | SELF-REACTIVE LIQUID TYPE B |
| Hazard Class/Division | 4.1 |
| Packing Group | (none - self-reactive) |
| Packaging Paragraph | A8.4. |
| Special Provisions | P4, 53 |
| Subsidiary Risk | None |
| Control Temperature | +35°C |
| Emergency Temperature | +40°C |

#### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | Cargo Aircraft Only |
| Key 11 | UN3221 |
| Key 12 | SELF-REACTIVE LIQUID TYPE B |
| Key 13 | 4.1 |
| Key 14 | (empty) |
| Key 15 | (empty - self-reactive substances have no PG) |
| Key 16 | 4 glass bottles in fiberboard box (4G) x 0.5 L each |
| Key 17 | A8.4. |
| Key 19 | Control Temperature: +35°C, Emergency Temperature: +40°C. Protect from direct sunlight and all sources of heat and place in adequately ventilated area. |

#### Expected Package Inspection (Successful)

**Labels Required:**
- FLAMMABLE SOLID (Division 4.1) - Red/white vertical stripes
- KEEP AWAY FROM HEAT
- Cargo Aircraft Only

**Markings Required:**
- UN3221 (minimum 12mm height)
- SELF-REACTIVE LIQUID TYPE B
- Control Temperature: +35°C
- Emergency Temperature: +40°C

**POP Marking Validation:**
- Packaging Code: 4G
- Packing Group Rating: (per CAA requirements)

#### Alterations (Frustration Testing)

| # | Category | Alteration | Expected Result |
|---|----------|------------|-----------------|
| 1 | SDDG - Key 19 | Temperature control information missing | Frustration: Self-reactive substances require control/emergency temperatures |
| 2 | Label | Missing KEEP AWAY FROM HEAT label | Frustration: Required for self-reactive substances |
| 3 | Marking | Control temperature marking missing from package | Frustration: Temperature control marking required on package |

---

### Scenario 7: UN2000 - CELLULOID

**Purpose**: Test common 4.1 material, PG III, standard packaging

#### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN2000 |
| PSN | CELLULOID in blocks, rods, rolls, sheets, tubes, etc., except scrap |
| Hazard Class/Division | 4.1 |
| Packing Group | III |
| Packaging Paragraph | A8.3. |
| Special Provisions | P5 |
| Subsidiary Risk | None |

#### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | Passenger and Cargo Aircraft |
| Key 11 | UN2000 |
| Key 12 | CELLULOID in blocks, rods, rolls, sheets, tubes, etc., except scrap |
| Key 13 | 4.1 |
| Key 14 | (empty) |
| Key 15 | III |
| Key 16 | 1 plywood box (4D) x 30 kg |
| Key 17 | A8.3. |

#### Expected Package Inspection (Successful)

**Labels Required:**
- FLAMMABLE SOLID (Division 4.1) - Red/white vertical stripes

**Markings Required:**
- UN2000 (minimum 12mm height)
- CELLULOID in blocks, rods, rolls, sheets, tubes, etc., except scrap

**POP Marking Validation:**
- Packaging Code: 4D
- Packing Group Rating: Z (authorized for PG III)

#### Alterations (Frustration Testing)

| # | Category | Alteration | Expected Result |
|---|----------|------------|-----------------|
| 1 | Marking | UN number shows "UN2002" (Celluloid scrap - 4.2) | Frustration: UN number mismatch - different hazard class |
| 2 | SDDG - Key 13 | Shows "4.2" instead of "4.1" | Frustration: Incorrect division |
| 3 | SDDG - Key 12 | Shows "CELLULOID SCRAP" (different material) | Frustration: PSN mismatch with UN number |

---

## Division 4.2 - Spontaneously Combustible (Scenarios 8-13)

---

### Scenario 8: UN2845 - PYROPHORIC LIQUID, ORGANIC, N.O.S.

**Purpose**: Test N.O.S. pyrophoric liquid requiring technical name, PG I

#### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN2845 |
| PSN | PYROPHORIC LIQUID, ORGANIC, N.O.S. |
| Technical Name | (Trimethylaluminum) |
| Hazard Class/Division | 4.2 |
| Packing Group | I |
| Packaging Paragraph | A8.5. |
| Special Provisions | P3, A2, A5, A7 |
| Subsidiary Risk | None |

#### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | Cargo Aircraft Only |
| Key 11 | UN2845 |
| Key 12 | PYROPHORIC LIQUID, ORGANIC, N.O.S. (Trimethylaluminum) |
| Key 13 | 4.2 |
| Key 14 | (empty) |
| Key 15 | I |
| Key 16 | 2 steel cylinders x 5 L each |
| Key 17 | A8.5. |

#### Expected Package Inspection (Successful)

**Labels Required:**
- SPONTANEOUSLY COMBUSTIBLE (Division 4.2) - Upper white, lower red
- Cargo Aircraft Only

**Markings Required:**
- UN2845 (minimum 12mm height)
- PYROPHORIC LIQUID, ORGANIC, N.O.S. (Trimethylaluminum)
- Technical name visible in parentheses

**POP Marking Validation:**
- Cylinder specification marking
- Packing Group Rating: X (required for PG I)

#### Alterations (Frustration Testing)

| # | Category | Alteration | Expected Result |
|---|----------|------------|-----------------|
| 1 | SDDG - Key 12 | Technical name missing | Frustration: N.O.S. entry requires technical name |
| 2 | Label | Division 4.1 FLAMMABLE SOLID label instead of 4.2 | Frustration: Wrong division label |
| 3 | POP Marking | Packing group code "Y" instead of "X" | Frustration: PG I requires X-rated packaging |

---

### Scenario 9: UN1383 - PYROPHORIC METAL, N.O.S.

**Purpose**: Test N.O.S. pyrophoric solid, technical name required

#### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1383 |
| PSN | PYROPHORIC METAL, N.O.S. |
| Technical Name | (Hafnium powder) |
| Hazard Class/Division | 4.2 |
| Packing Group | I |
| Packaging Paragraph | A8.5. |
| Special Provisions | P3, A2, A5, A7 |
| Subsidiary Risk | None |

#### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | Cargo Aircraft Only |
| Key 11 | UN1383 |
| Key 12 | PYROPHORIC METAL, N.O.S. (Hafnium powder) |
| Key 13 | 4.2 |
| Key 14 | (empty) |
| Key 15 | I |
| Key 16 | 1 steel drum (1A2) x 25 kg |
| Key 17 | A8.5. |

#### Expected Package Inspection (Successful)

**Labels Required:**
- SPONTANEOUSLY COMBUSTIBLE (Division 4.2) - Upper white, lower red
- Cargo Aircraft Only

**Markings Required:**
- UN1383 (minimum 12mm height)
- PYROPHORIC METAL, N.O.S. (Hafnium powder)
- Technical name visible in parentheses

**POP Marking Validation:**
- Packaging Code: 1A2
- Packing Group Rating: X (required for PG I)

#### Alterations (Frustration Testing)

| # | Category | Alteration | Expected Result |
|---|----------|------------|-----------------|
| 1 | Marking | Technical name missing from package | Frustration: N.O.S. requires technical name on marking |
| 2 | SDDG - Key 7 | Shows "Passenger and Cargo Aircraft" | Frustration: P3 requires Cargo Aircraft Only |
| 3 | SDDG - Key 15 | Shows "II" instead of "I" | Frustration: Incorrect packing group |

---

### Scenario 10: UN3088 - SELF-HEATING SOLID, ORGANIC, N.O.S.

**Purpose**: Test N.O.S. self-heating solid, PG II

#### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3088 |
| PSN | SELF-HEATING SOLID, ORGANIC, N.O.S. |
| Technical Name | (Activated carbon) |
| Hazard Class/Division | 4.2 |
| Packing Group | II |
| Packaging Paragraph | A8.3. |
| Special Provisions | P4, A2, A7 |
| Subsidiary Risk | None |

#### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | Cargo Aircraft Only |
| Key 11 | UN3088 |
| Key 12 | SELF-HEATING SOLID, ORGANIC, N.O.S. (Activated carbon) |
| Key 13 | 4.2 |
| Key 14 | (empty) |
| Key 15 | II |
| Key 16 | 1 fiber drum (1G) x 50 kg |
| Key 17 | A8.3. |

#### Expected Package Inspection (Successful)

**Labels Required:**
- SPONTANEOUSLY COMBUSTIBLE (Division 4.2) - Upper white, lower red
- Cargo Aircraft Only

**Markings Required:**
- UN3088 (minimum 12mm height)
- SELF-HEATING SOLID, ORGANIC, N.O.S. (Activated carbon)
- Technical name visible in parentheses

**POP Marking Validation:**
- Packaging Code: 1G
- Packing Group Rating: Y (authorized for PG II)

#### Alterations (Frustration Testing)

| # | Category | Alteration | Expected Result |
|---|----------|------------|-----------------|
| 1 | SDDG - Key 12 | Technical name missing | Frustration: N.O.S. entry requires technical name |
| 2 | Label | Missing Cargo Aircraft Only label | Frustration: P4 requires CAO label |
| 3 | POP Marking | Packing group code "Z" instead of "Y" | Frustration: PG II requires Y or X rated packaging |

---

### Scenario 11: UN2447 - PHOSPHORUS, WHITE, MOLTEN

**Purpose**: Test 4.2 material with 6.1 (TOXIC) subsidiary, molten material

#### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN2447 |
| PSN | PHOSPHORUS, WHITE, MOLTEN |
| Hazard Class/Division | 4.2 |
| Packing Group | I |
| Packaging Paragraph | A8.5. |
| Special Provisions | P3, A19 |
| Subsidiary Risk | 6.1 |

#### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | Cargo Aircraft Only |
| Key 11 | UN2447 |
| Key 12 | PHOSPHORUS, WHITE, MOLTEN |
| Key 13 | 4.2 |
| Key 14 | 6.1 |
| Key 15 | I |
| Key 16 | 1 steel drum (1A1) x 50 L |
| Key 17 | A8.5. |

#### Expected Package Inspection (Successful)

**Labels Required:**
- SPONTANEOUSLY COMBUSTIBLE (Division 4.2) - Upper white, lower red
- TOXIC (6.1) - White with skull and crossbones
- Cargo Aircraft Only
- Orientation arrows (This Side Up) - molten/liquid material

**Markings Required:**
- UN2447 (minimum 12mm height)
- PHOSPHORUS, WHITE, MOLTEN

**POP Marking Validation:**
- Packaging Code: 1A1
- Packing Group Rating: X (required for PG I)

#### Alterations (Frustration Testing)

| # | Category | Alteration | Expected Result |
|---|----------|------------|-----------------|
| 1 | Label | Missing TOXIC (6.1) subsidiary label | Frustration: Subsidiary hazard label required |
| 2 | SDDG - Key 14 | Empty (should be "6.1") | Frustration: Missing subsidiary risk declaration |
| 3 | Label | Missing orientation arrows | Frustration: Molten materials require orientation labels |

---

### Scenario 12: UN1373 - FIBERS, ANIMAL or VEGETABLE with oil

**Purpose**: Test self-heating material, PG III

#### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1373 |
| PSN | FIBERS or FABRICS, ANIMAL or VEGETABLE with oil, N.O.S. |
| Hazard Class/Division | 4.2 |
| Packing Group | III |
| Packaging Paragraph | A8.3. |
| Special Provisions | P5 |
| Subsidiary Risk | None |

#### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | Passenger and Cargo Aircraft |
| Key 11 | UN1373 |
| Key 12 | FIBERS or FABRICS, ANIMAL or VEGETABLE with oil, N.O.S. |
| Key 13 | 4.2 |
| Key 14 | (empty) |
| Key 15 | III |
| Key 16 | 2 fiberboard boxes (4G) x 20 kg each |
| Key 17 | A8.3. |

#### Expected Package Inspection (Successful)

**Labels Required:**
- SPONTANEOUSLY COMBUSTIBLE (Division 4.2) - Upper white, lower red

**Markings Required:**
- UN1373 (minimum 12mm height)
- FIBERS or FABRICS, ANIMAL or VEGETABLE with oil, N.O.S.

**POP Marking Validation:**
- Packaging Code: 4G
- Packing Group Rating: Z (authorized for PG III)

#### Alterations (Frustration Testing)

| # | Category | Alteration | Expected Result |
|---|----------|------------|-----------------|
| 1 | SDDG - Key 13 | Shows "4" instead of "4.2" | Frustration: Must specify full division |
| 2 | Marking | PSN abbreviated as "FIBERS WITH OIL" | Frustration: Incomplete proper shipping name |
| 3 | SDDG - Key 15 | Empty (should be "III") | Frustration: Packing group required |

---

### Scenario 13: UN3206 - ALKALI METAL ALCOHOLATES, SELF-HEATING, CORROSIVE, N.O.S.

**Purpose**: Test N.O.S. with 8 (CORROSIVE) subsidiary, technical name required

#### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3206 |
| PSN | ALKALI METAL ALCOHOLATES, SELF-HEATING, CORROSIVE, N.O.S. |
| Technical Name | (Sodium methoxide) |
| Hazard Class/Division | 4.2 |
| Packing Group | II |
| Packaging Paragraph | A8.3. |
| Special Provisions | P4, A7 |
| Subsidiary Risk | 8 |

#### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | Cargo Aircraft Only |
| Key 11 | UN3206 |
| Key 12 | ALKALI METAL ALCOHOLATES, SELF-HEATING, CORROSIVE, N.O.S. (Sodium methoxide) |
| Key 13 | 4.2 |
| Key 14 | 8 |
| Key 15 | II |
| Key 16 | 1 plastic drum (1H2) x 30 kg |
| Key 17 | A8.3. |

#### Expected Package Inspection (Successful)

**Labels Required:**
- SPONTANEOUSLY COMBUSTIBLE (Division 4.2) - Upper white, lower red
- CORROSIVE (8) - Upper white, lower black
- Cargo Aircraft Only

**Markings Required:**
- UN3206 (minimum 12mm height)
- ALKALI METAL ALCOHOLATES, SELF-HEATING, CORROSIVE, N.O.S. (Sodium methoxide)
- Technical name visible in parentheses

**POP Marking Validation:**
- Packaging Code: 1H2
- Packing Group Rating: Y (authorized for PG II)

#### Alterations (Frustration Testing)

| # | Category | Alteration | Expected Result |
|---|----------|------------|-----------------|
| 1 | Label | Missing CORROSIVE (8) subsidiary label | Frustration: Subsidiary hazard label required |
| 2 | SDDG - Key 12 | Technical name missing | Frustration: N.O.S. requires technical name |
| 3 | SDDG - Key 14 | Empty (should be "8") | Frustration: Missing subsidiary risk declaration |

---

## Division 4.3 - Dangerous When Wet (Scenarios 14-20)

---

### Scenario 14: UN1428 - SODIUM

**Purpose**: Test common water-reactive material, PG I

#### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1428 |
| PSN | SODIUM |
| Hazard Class/Division | 4.3 |
| Packing Group | I |
| Packaging Paragraph | A8.3. |
| Special Provisions | P3, A8, A19, N34, N40 |
| Subsidiary Risk | None |

#### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | Cargo Aircraft Only |
| Key 11 | UN1428 |
| Key 12 | SODIUM |
| Key 13 | 4.3 |
| Key 14 | (empty) |
| Key 15 | I |
| Key 16 | 1 steel drum (1A2) x 25 kg |
| Key 17 | A8.3. |

#### Expected Package Inspection (Successful)

**Labels Required:**
- DANGEROUS WHEN WET (Division 4.3) - Blue
- Cargo Aircraft Only

**Markings Required:**
- UN1428 (minimum 12mm height)
- SODIUM
- MARINE POLLUTANT (if N34 applies per shipment)

**POP Marking Validation:**
- Packaging Code: 1A2
- Packing Group Rating: X (required for PG I)

#### Alterations (Frustration Testing)

| # | Category | Alteration | Expected Result |
|---|----------|------------|-----------------|
| 1 | Label | Division 4.1 FLAMMABLE SOLID label instead of 4.3 DANGEROUS WHEN WET | Frustration: Wrong division label |
| 2 | SDDG - Key 7 | Shows "Passenger and Cargo Aircraft" | Frustration: P3 requires Cargo Aircraft Only |
| 3 | POP Marking | Packing group code "Y" instead of "X" | Frustration: PG I requires X-rated packaging |

---

### Scenario 15: UN1415 - LITHIUM

**Purpose**: Test common water-reactive metal, PG I

#### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1415 |
| PSN | LITHIUM |
| Hazard Class/Division | 4.3 |
| Packing Group | I |
| Packaging Paragraph | A8.3. |
| Special Provisions | P3, A19 |
| Subsidiary Risk | None |

#### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | Cargo Aircraft Only |
| Key 11 | UN1415 |
| Key 12 | LITHIUM |
| Key 13 | 4.3 |
| Key 14 | (empty) |
| Key 15 | I |
| Key 16 | 1 steel can in fiberboard box (4G) x 5 kg |
| Key 17 | A8.3. |

#### Expected Package Inspection (Successful)

**Labels Required:**
- DANGEROUS WHEN WET (Division 4.3) - Blue
- Cargo Aircraft Only

**Markings Required:**
- UN1415 (minimum 12mm height)
- LITHIUM

**POP Marking Validation:**
- Packaging Code: 4G (outer)
- Packing Group Rating: X (required for PG I)

#### Alterations (Frustration Testing)

| # | Category | Alteration | Expected Result |
|---|----------|------------|-----------------|
| 1 | SDDG - Key 13 | Shows "4.1" instead of "4.3" | Frustration: Incorrect division |
| 2 | Label | Missing Cargo Aircraft Only label | Frustration: P3 requires CAO label |
| 3 | Marking | UN number shows "UN1414" (transposition error) | Frustration: UN number incorrect |

---

### Scenario 16: UN1402 - CALCIUM CARBIDE

**Purpose**: Test material with variable packing groups (I and II)

#### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1402 |
| PSN | CALCIUM CARBIDE |
| Hazard Class/Division | 4.3 |
| Packing Group | II |
| Packaging Paragraph | A8.3. |
| Special Provisions | P5, A1, A8, N34 |
| Subsidiary Risk | None |

#### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | Passenger and Cargo Aircraft |
| Key 11 | UN1402 |
| Key 12 | CALCIUM CARBIDE |
| Key 13 | 4.3 |
| Key 14 | (empty) |
| Key 15 | II |
| Key 16 | 2 steel drums (1A2) x 50 kg each |
| Key 17 | A8.3. |

#### Expected Package Inspection (Successful)

**Labels Required:**
- DANGEROUS WHEN WET (Division 4.3) - Blue

**Markings Required:**
- UN1402 (minimum 12mm height)
- CALCIUM CARBIDE

**POP Marking Validation:**
- Packaging Code: 1A2
- Packing Group Rating: Y (authorized for PG II)

#### Alterations (Frustration Testing)

| # | Category | Alteration | Expected Result |
|---|----------|------------|-----------------|
| 1 | POP Marking | Packing group code "Z" instead of "Y" | Frustration: PG II requires Y or X rated packaging |
| 2 | SDDG - Key 15 | Shows "I" instead of "II" | Frustration: Incorrect packing group |
| 3 | SDDG - Key 13 | Shows "4" instead of "4.3" | Frustration: Must specify full division |

---

### Scenario 17: UN2813 - WATER-REACTIVE SOLID, N.O.S.

**Purpose**: Test N.O.S. water-reactive solid requiring technical name

#### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN2813 |
| PSN | WATER-REACTIVE SOLID, N.O.S. |
| Technical Name | (Calcium silicide) |
| Hazard Class/Division | 4.3 |
| Packing Group | II |
| Packaging Paragraph | A8.3. |
| Special Provisions | P4, A2, A7 |
| Subsidiary Risk | None |

#### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | Cargo Aircraft Only |
| Key 11 | UN2813 |
| Key 12 | WATER-REACTIVE SOLID, N.O.S. (Calcium silicide) |
| Key 13 | 4.3 |
| Key 14 | (empty) |
| Key 15 | II |
| Key 16 | 1 fiberboard box (4G) x 25 kg |
| Key 17 | A8.3. |

#### Expected Package Inspection (Successful)

**Labels Required:**
- DANGEROUS WHEN WET (Division 4.3) - Blue
- Cargo Aircraft Only

**Markings Required:**
- UN2813 (minimum 12mm height)
- WATER-REACTIVE SOLID, N.O.S. (Calcium silicide)
- Technical name visible in parentheses

**POP Marking Validation:**
- Packaging Code: 4G
- Packing Group Rating: Y (authorized for PG II)

#### Alterations (Frustration Testing)

| # | Category | Alteration | Expected Result |
|---|----------|------------|-----------------|
| 1 | SDDG - Key 12 | Technical name missing | Frustration: N.O.S. requires technical name |
| 2 | Marking | Technical name missing from package | Frustration: Technical name required on package marking |
| 3 | Label | Missing Cargo Aircraft Only label | Frustration: P4 requires CAO label |

---

### Scenario 18: UN1396 - ALUMINIUM POWDER, UNCOATED

**Purpose**: Test material with PG II option

#### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1396 |
| PSN | ALUMINIUM POWDER, UNCOATED |
| Hazard Class/Division | 4.3 |
| Packing Group | II |
| Packaging Paragraph | A8.3. |
| Special Provisions | P4, A19, A20 |
| Subsidiary Risk | None |

#### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | Cargo Aircraft Only |
| Key 11 | UN1396 |
| Key 12 | ALUMINIUM POWDER, UNCOATED |
| Key 13 | 4.3 |
| Key 14 | (empty) |
| Key 15 | II |
| Key 16 | 1 aluminum drum (1B2) x 50 kg |
| Key 17 | A8.3. |

#### Expected Package Inspection (Successful)

**Labels Required:**
- DANGEROUS WHEN WET (Division 4.3) - Blue
- Cargo Aircraft Only

**Markings Required:**
- UN1396 (minimum 12mm height)
- ALUMINIUM POWDER, UNCOATED

**POP Marking Validation:**
- Packaging Code: 1B2
- Packing Group Rating: Y (authorized for PG II)

#### Alterations (Frustration Testing)

| # | Category | Alteration | Expected Result |
|---|----------|------------|-----------------|
| 1 | Marking | UN number shows "UN1309" (Aluminium powder, coated - 4.1) | Frustration: UN number mismatch - different material/class |
| 2 | SDDG - Key 13 | Shows "4.1" instead of "4.3" | Frustration: Wrong division (confusing coated vs uncoated) |
| 3 | SDDG - Key 7 | Shows "Passenger and Cargo Aircraft" | Frustration: P4 requires Cargo Aircraft Only |

---

### Scenario 19: UN1400 - BARIUM

**Purpose**: Test water-reactive metal, PG II

#### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1400 |
| PSN | BARIUM |
| Hazard Class/Division | 4.3 |
| Packing Group | II |
| Packaging Paragraph | A8.3. |
| Special Provisions | P4, A19 |
| Subsidiary Risk | None |

#### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | Cargo Aircraft Only |
| Key 11 | UN1400 |
| Key 12 | BARIUM |
| Key 13 | 4.3 |
| Key 14 | (empty) |
| Key 15 | II |
| Key 16 | 1 steel drum (1A2) x 30 kg |
| Key 17 | A8.3. |

#### Expected Package Inspection (Successful)

**Labels Required:**
- DANGEROUS WHEN WET (Division 4.3) - Blue
- Cargo Aircraft Only

**Markings Required:**
- UN1400 (minimum 12mm height)
- BARIUM

**POP Marking Validation:**
- Packaging Code: 1A2
- Packing Group Rating: Y (authorized for PG II)

#### Alterations (Frustration Testing)

| # | Category | Alteration | Expected Result |
|---|----------|------------|-----------------|
| 1 | Label | Missing primary DANGEROUS WHEN WET label | Frustration: Primary hazard label required |
| 2 | POP Marking | Missing entirely | Frustration: POP marking required |
| 3 | SDDG - Key 15 | Empty (should be "II") | Frustration: Packing group required |

---

### Scenario 20: UN3148 - WATER-REACTIVE LIQUID, N.O.S.

**Purpose**: Test N.O.S. water-reactive liquid, orientation requirements

#### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3148 |
| PSN | WATER-REACTIVE LIQUID, N.O.S. |
| Technical Name | (Diethylzinc solution) |
| Hazard Class/Division | 4.3 |
| Packing Group | I |
| Packaging Paragraph | A8.2. |
| Special Provisions | P3, A2, A5, A7 |
| Subsidiary Risk | None |

#### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | Cargo Aircraft Only |
| Key 11 | UN3148 |
| Key 12 | WATER-REACTIVE LIQUID, N.O.S. (Diethylzinc solution) |
| Key 13 | 4.3 |
| Key 14 | (empty) |
| Key 15 | I |
| Key 16 | 2 steel bottles in fiberboard box (4G) x 1 L each |
| Key 17 | A8.2. |

#### Expected Package Inspection (Successful)

**Labels Required:**
- DANGEROUS WHEN WET (Division 4.3) - Blue
- Cargo Aircraft Only
- Orientation arrows (This Side Up) - liquid material

**Markings Required:**
- UN3148 (minimum 12mm height)
- WATER-REACTIVE LIQUID, N.O.S. (Diethylzinc solution)
- Technical name visible in parentheses

**POP Marking Validation:**
- Packaging Code: 4G
- Packing Group Rating: X (required for PG I)

#### Alterations (Frustration Testing)

| # | Category | Alteration | Expected Result |
|---|----------|------------|-----------------|
| 1 | SDDG - Key 12 | Technical name missing | Frustration: N.O.S. requires technical name |
| 2 | Label | Missing orientation arrows | Frustration: Liquid materials require orientation labels |
| 3 | SDDG - Key 17 | Shows "A8.3." (solids) instead of "A8.2." (liquids) | Frustration: Liquid uses different packaging paragraph |

---

## Quick Reference Tables

### Alteration Categories Covered

| Category | Count | Scenarios |
|----------|-------|-----------|
| SDDG - Key 7 (Aircraft) | 6 | 3, 9, 14, 15, 18, 20 |
| SDDG - Key 12 (PSN/Tech Name) | 8 | 1, 6, 8, 10, 13, 17, 20 |
| SDDG - Key 13 (Division) | 6 | 2, 7, 12, 15, 16, 18 |
| SDDG - Key 14 (Subsidiary) | 3 | 4, 11, 13 |
| SDDG - Key 15 (Packing Group) | 5 | 2, 9, 12, 16, 19 |
| SDDG - Key 17 (Paragraph) | 3 | 4, 5, 20 |
| SDDG - Key 19 (Temp Control) | 1 | 6 |
| Label - Wrong Division | 4 | 1, 8, 14, 15 |
| Label - Missing Primary | 1 | 19 |
| Label - Missing Subsidiary | 3 | 4, 11, 13 |
| Label - Missing CAO | 4 | 3, 10, 15, 17 |
| Label - Missing Orientation | 3 | 5, 11, 20 |
| Label - Missing Keep Away | 1 | 6 |
| Marking - UN Number | 4 | 2, 7, 15, 18 |
| Marking - PSN Incomplete | 3 | 5, 7, 12 |
| Marking - Tech Name Missing | 3 | 9, 17 |
| Marking - Temp Control | 1 | 6 |
| POP - Wrong PG Code | 7 | 1, 3, 8, 10, 14, 16 |
| POP - Missing | 1 | 19 |

### Division Coverage

| Division | Scenarios | Count |
|----------|-----------|-------|
| 4.1 - Flammable Solids | 1, 2, 3, 4, 5, 6, 7 | 7 |
| 4.2 - Spontaneously Combustible | 8, 9, 10, 11, 12, 13 | 6 |
| 4.3 - Dangerous When Wet | 14, 15, 16, 17, 18, 19, 20 | 7 |

### Packing Group Coverage

| Packing Group | Scenarios | Count |
|---------------|-----------|-------|
| I | 3, 4, 6, 8, 9, 11, 14, 15, 20 | 9 |
| II | 1, 10, 13, 16, 17, 18, 19 | 7 |
| III | 2, 5, 7, 12 | 4 |
| None (Self-reactive) | 6 | 1 |

### Special Features Coverage

| Feature | Scenarios | Count |
|---------|-----------|-------|
| N.O.S. (Technical Name Required) | 1, 8, 9, 10, 13, 17, 20 | 7 |
| Subsidiary Risk 6.1 (Toxic) | 4, 11 | 2 |
| Subsidiary Risk 8 (Corrosive) | 13 | 1 |
| Wetted/Desensitized | 3, 4 | 2 |
| Self-Reactive (Temp Control) | 6 | 1 |
| Pyrophoric | 8, 9 | 2 |
| Self-Heating | 10, 12, 13 | 3 |
| Water-Reactive | 14, 15, 16, 17, 18, 19, 20 | 7 |
| Molten/Liquid Form | 5, 8, 11, 20 | 4 |
| Marine Pollutant (N34) | 14, 16 | 2 |

### Aircraft Limitation Coverage

| Limitation | Scenarios | Count |
|------------|-----------|-------|
| Cargo Aircraft Only (P3/P4) | 3, 4, 6, 8, 9, 10, 11, 13, 14, 15, 17, 18, 19, 20 | 14 |
| Passenger and Cargo Aircraft (P5) | 1, 2, 5, 7, 12, 16 | 6 |

### Packaging Paragraph Coverage

| Paragraph | Description | Scenarios | Count |
|-----------|-------------|-----------|-------|
| A8.2. | Class 4 Liquids | 5, 20 | 2 |
| A8.3. | Class 4 Solids | 1, 3, 4, 7, 10, 12, 13, 14, 15, 16, 17, 18, 19 | 13 |
| A8.4. | Self-Reactive Substances | 6 | 1 |
| A8.5. | Pyrophoric Materials | 8, 9, 11 | 3 |
| A8.10. | Barium Azide | 4 | 1 |
| A8.14. | Matches | 2 | 1 |

---

## Test Execution Notes

### Before Testing

1. **Ensure app is updated** to latest version with Class 4 support
2. **Review Inspector workflow** in `docs/architecture/inspector-workflow-and-ml-detection.md`
3. **Prepare test materials list** - print or have scenarios accessible
4. **Clear any previous test data** if needed
5. **Verify ML detection** is working for hazmat label recognition

### During Testing

For each scenario:

1. **SDDG Phase**:
   - Enter/scan SDDG data matching the "Expected SDDG Inspection" table
   - Verify all Keys are validated correctly
   - Note any unexpected validation errors

2. **Package Phase**:
   - Verify label detection and validation
   - Check marking requirements are correctly identified
   - Validate POP marking against material requirements

3. **Alteration Phase**:
   - Apply one alteration at a time
   - Verify frustration is detected and displayed
   - Verify correct frustration message
   - Reset to successful state before next alteration

4. **Documentation**:
   - Record pass/fail for each validation point
   - Note any unexpected behavior
   - Screenshot any issues

### Key Class 4 Considerations

1. **Division is CRITICAL** - Class 4 has three distinct divisions (4.1, 4.2, 4.3) with DIFFERENT labels. Key 13 must show the full division (e.g., "4.2"), not just "4".

2. **Each Division Has a Different Label**:
   - 4.1: Red/white vertical stripes (FLAMMABLE SOLID)
   - 4.2: Upper white, lower red (SPONTANEOUSLY COMBUSTIBLE)
   - 4.3: Blue (DANGEROUS WHEN WET)

3. **Packing Group Usually Required** - Most Class 4 materials have packing groups, but self-reactive substances (4.1) may not.

4. **Pyrophoric vs Self-Heating (4.2)** - Both are Division 4.2 but have different packaging requirements:
   - Pyrophoric: Uses A8.5. (stricter requirements)
   - Self-heating: Uses A8.3. (standard requirements)

5. **Temperature Control** - Self-reactive substances (4.1) may require control/emergency temperatures in Key 19 and on package markings.

6. **Orientation Labels** - Required for molten materials (UN2304, UN2447) and liquids (UN2845, UN3148).

7. **Technical Names** - N.O.S. entries MUST have technical names in Key 12 AND on package markings.

### After Testing

1. **Compile results** into summary document
2. **Categorize issues** by severity:
   - Critical: Validation fails incorrectly or passes incorrectly
   - Major: Frustration message unclear or missing
   - Minor: UI/UX improvements needed
3. **Create tickets** for any issues found
4. **Update scenarios** if requirements have changed
