# Class 3 (Flammable Liquids) Test Scenarios by Packaging Paragraph

## Overview

This document contains test scenarios for the HazPro mobile app Inspector workflow, covering **one material per Class 3 packaging paragraph** (A7.2 through A7.12). Each scenario is based on AFMAN 24-604 regulations (Attachments 7, 14, 15, and 17).

### Purpose

These scenarios are designed for manual testing by physically running through the app. Each scenario includes:
- **Material Details**: UN number, PSN, hazard class, packaging paragraph, special provisions
- **Expected SDDG Inspection**: What a successful SDDG should contain (Keys 7, 11-17)
- **Expected Package Inspection**: Required labels, markings, and POP marking validation
- **Alterations**: Intentional errors to test frustration handling

### Packaging Paragraphs Covered

| Paragraph | Description | Material Selected |
|-----------|-------------|-------------------|
| A7.2 | Standard Class 3 packaging | UN1089 ACETALDEHYDE |
| A7.3 | Combination packaging only (refrigerating machines exception) | UN2251 BICYCLO[2,2,1] HEPTA-2,5-DIENE, STABILIZED |
| A7.4 | Aircraft Hydraulic Power Unit Fuel Tank | UN3165 AIRCRAFT HYDRAULIC POWER UNIT FUEL TANK |
| A7.5 | *Not found in database* | N/A |
| A7.6 | Polyester Resin Kits | UN3269 POLYESTER RESIN KIT |
| A7.7 | Fuel Cell Cartridges | UN3473 FUEL CELL CARTRIDGES |
| A7.8 | Fuel Cell Cartridges Contained in Equipment | UN3473 FUEL CELL CARTRIDGES CONTAINED IN EQUIPMENT |
| A7.9 | Fuel Cell Cartridges Packed With Equipment | UN3473 FUEL CELL CARTRIDGES PACKED WITH EQUIPMENT |
| A7.10 | Chlorosilanes | UN2985 CHLOROSILANES, FLAMMABLE, CORROSIVE, N.O.S. |
| A7.11 | Engines and Machinery | UN3528 ENGINE, INTERNAL COMBUSTION, FLAMMABLE LIQUID POWERED |
| A7.12 | Articles Containing Flammable Liquid | UN3540 ARTICLES CONTAINING FLAMMABLE LIQUID, N.O.S. |

### Key Reference Tables

**Packing Group to POP Code Mapping:**
| Code | Authorized Packing Groups | Materials |
|------|---------------------------|-----------|
| X | I, II, III | All Class 3 |
| Y | II, III | PG II and III only |
| Z | III | PG III only |

**Aircraft Limitation by Special Provision:**
| Provision | Aircraft Type | CAO Label Required |
|-----------|---------------|-------------------|
| P1 | Forbidden | N/A |
| P2 | CAO Only (with approval) | Yes |
| P3 | CAO Only | Yes |
| P4 | CAO Only | Yes |
| P5 | Passenger and Cargo | No |

---

## Scenario 1: A7.2 - UN1089 ACETALDEHYDE

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1089 |
| PSN | ACETALDEHYDE |
| Hazard Class | 3 |
| Subsidiary Risk | None |
| Packing Group | I |
| Packaging Paragraph | A7.2. |
| Special Provisions | P3 |
| Technical Name Required | No |

### Expected SDDG Inspection (Successful)

| Key | Field | Expected Value | AFMAN Reference |
|-----|-------|----------------|-----------------|
| Key 7 | Aircraft Limitations | "Cargo Aircraft Only" (P3 = CAO only) | A17.1.2.3-A17.1.2.4 |
| Key 11 | UN Number | "UN1089" | Table A17.1, Key 11 |
| Key 12 | Proper Shipping Name | "ACETALDEHYDE" | Table A17.1, Key 12 |
| Key 13 | Hazard Class | "3" | Table A17.1, Key 13 |
| Key 14 | Subsidiary Risk | Empty (no subsidiary risk) | Table A17.1, Key 14 |
| Key 15 | Packing Group | "I" | Table A17.1, Key 15 |
| Key 16 | Quantity and Type | Net quantity + packaging (e.g., "2 steel drums x 20 L") | Table A17.1, Key 16 |
| Key 17 | Packaging Instructions | "A7.2" | Table A17.1, Key 17 |

### Expected Package Inspection (Successful)

**Labels Required:**
- FLAMMABLE LIQUID (Class 3) - primary hazard (A15.2.1)
- Cargo Aircraft Only (A15.3.1) - required for P3 materials

**Markings Required:**
- UN1089 (12mm minimum height for packages >30L) (A14.3.1)
- PSN: "ACETALDEHYDE" (12mm minimum height) (A14.3.1)
- Orientation arrows on two opposite sides (for combination packaging) (A14.3.6)
- Military Shipping Label (MSL) per MIL-STD-129 (A14.1.1)
- Flash point marking (A14.4.3.1)

**POP Marking Validation:**
- Valid packaging codes per A7.2.1 (combination) or A7.2.2 (single):
  - Combination outer: 1A2, 1B2, 1N2, 1D, 1G, 1H2, 4A, 4B, 4C1, 4C2, 4D, 4F, 4G, 4H1, 4H2, 3A2, 3H2, 3B2
  - Single: 1A1, 1A2, 1B1, 1B2, 1N1, 1N2, 1H1, 1H2, 3A1, 3A2, 3B1, 3B2, 3H1, 3H2
  - **PG I Restrictions:** No fiber drum with liner (1G) for single; no wooden barrels
- Packing group code: **X only** (required for PG I)
- Test pressure: minimum 250 kPa for PG I liquids (Figure A14.2)

### Alterations (Frustration Testing)

| # | Alteration | Expected Frustration | AFMAN Violation |
|---|------------|---------------------|-----------------|
| 1 | POP marking shows packing group "Y" instead of "X" | PG validation failure - PG I requires X only | A14.2 |
| 2 | Key 7 shows "Passenger and Cargo" | Aircraft limitation violation - P3 requires CAO | A17.1.2.3 |
| 3 | Missing orientation arrows on package | Orientation marking validation failure | A14.3.6 |
| 4 | Missing Cargo Aircraft Only label | CAO label requirement violation | A15.3.1 |

---

## Scenario 2: A7.3 - UN2251 BICYCLO[2,2,1] HEPTA-2,5-DIENE, STABILIZED

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN2251 |
| PSN | BICYCLO[2,2,1] HEPTA-2,5-DIENE, STABILIZED |
| Hazard Class | 3 |
| Subsidiary Risk | None |
| Packing Group | II |
| Packaging Paragraph | A7.3 |
| Special Provisions | P5, 387 |
| Technical Name Required | No |

### Expected SDDG Inspection (Successful)

| Key | Field | Expected Value | AFMAN Reference |
|-----|-------|----------------|-----------------|
| Key 7 | Aircraft Limitations | "Passenger and Cargo" (P5) | A17.1.2.3 |
| Key 11 | UN Number | "UN2251" | Table A17.1, Key 11 |
| Key 12 | Proper Shipping Name | "BICYCLO[2,2,1] HEPTA-2,5-DIENE, STABILIZED" | Table A17.1, Key 12 |
| Key 13 | Hazard Class | "3" | Table A17.1, Key 13 |
| Key 14 | Subsidiary Risk | Empty | Table A17.1, Key 14 |
| Key 15 | Packing Group | "II" | Table A17.1, Key 15 |
| Key 16 | Quantity and Type | Net quantity + packaging | Table A17.1, Key 16 |
| Key 17 | Packaging Instructions | "A7.3" | Table A17.1, Key 17 |

### Expected Package Inspection (Successful)

**Labels Required:**
- FLAMMABLE LIQUID (Class 3) - primary hazard (A15.2.1)

**Markings Required:**
- UN2251 (A14.3.1)
- PSN: "BICYCLO[2,2,1] HEPTA-2,5-DIENE, STABILIZED" (full chemical name) (A14.3.1)
- Orientation arrows on two opposite sides (A14.3.6)
- Military Shipping Label (MSL) (A14.1.1)

**POP Marking Validation:**
- A7.3 is for refrigerating machines containing <= 7 kg flammable liquid
- Excepted from specification packaging if conditions met
- If UN specification packaging used: Packing group code X or Y

### Alterations (Frustration Testing)

| # | Alteration | Expected Frustration | AFMAN Violation |
|---|------------|---------------------|-----------------|
| 1 | Key 17 shows "A7.2" instead of "A7.3" | Packaging paragraph mismatch | A17.1, Key 17 |
| 2 | PSN missing "STABILIZED" qualifier | PSN completeness validation failure | A14.3.1 |
| 3 | Missing FLAMMABLE LIQUID label | Primary hazard label missing | A15.2.1 |

---

## Scenario 3: A7.4 - UN3165 AIRCRAFT HYDRAULIC POWER UNIT FUEL TANK

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3165 |
| PSN | AIRCRAFT HYDRAULIC POWER UNIT FUEL TANK |
| Details | containing a mixture of anhydrous hydrazine and monomethyl hydrazine; M86 fuel |
| Hazard Class | 3 |
| Subsidiary Risk | 6.1, 8 |
| Packing Group | I |
| Packaging Paragraph | A7.4. |
| Special Provisions | P3, A501 |
| Technical Name Required | No |

### Expected SDDG Inspection (Successful)

| Key | Field | Expected Value | AFMAN Reference |
|-----|-------|----------------|-----------------|
| Key 7 | Aircraft Limitations | "Cargo Aircraft Only" (P3 = CAO) | A17.1.2.3-A17.1.2.4 |
| Key 11 | UN Number | "UN3165" | Table A17.1, Key 11 |
| Key 12 | Proper Shipping Name | "AIRCRAFT HYDRAULIC POWER UNIT FUEL TANK" | Table A17.1, Key 12 |
| Key 13 | Hazard Class | "3" | Table A17.1, Key 13 |
| Key 14 | Subsidiary Risk | "6.1, 8" (both subsidiaries) | Table A17.1, Key 14 |
| Key 15 | Packing Group | "I" | Table A17.1, Key 15 |
| Key 16 | Quantity and Type | Net quantity + packaging (e.g., "1 fuel tank unit x 42 L") | Table A17.1, Key 16 |
| Key 17 | Packaging Instructions | "A7.4" | Table A17.1, Key 17 |

### Expected Package Inspection (Successful)

**Labels Required:**
- FLAMMABLE LIQUID (Class 3) - primary hazard (A15.2.1)
- TOXIC (Class 6.1) - first subsidiary (A15.4.5.1)
- CORROSIVE (Class 8) - second subsidiary (A15.4.7)
- Cargo Aircraft Only (A15.3.1)

**Markings Required:**
- UN3165 (A14.3.1)
- PSN: "AIRCRAFT HYDRAULIC POWER UNIT FUEL TANK" (A14.3.1)
- Military Shipping Label (MSL) (A14.1.1)

**POP Marking Validation:**
- A7.4 is specialized packaging for fuel tanks (Unit Type 1 or Unit Type 2)
- Must comply with design pressure, burst pressure, and leak test requirements per A7.4.2
- Packing group code: **X** (required for PG I)

### Alterations (Frustration Testing)

| # | Alteration | Expected Frustration | AFMAN Violation |
|---|------------|---------------------|-----------------|
| 1 | Missing TOXIC subsidiary label | Subsidiary hazard label missing | A15.2.1, A15.4.5.1 |
| 2 | Missing CORROSIVE subsidiary label | Second subsidiary hazard label missing | A15.2.1, A15.4.7 |
| 3 | Key 14 shows only "6.1" (missing 8) | Incomplete subsidiary risk | Table A17.1, Key 14 |
| 4 | Key 17 shows "A7.2" instead of "A7.4" | Packaging paragraph mismatch | Table A17.1, Key 17 |
| 5 | POP marking shows "Y" instead of "X" | PG I requires X only | A14.2 |

---

## Scenario 4: A7.6 - UN3269 POLYESTER RESIN KIT

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3269 |
| PSN | POLYESTER RESIN KIT |
| Details | liquid base material |
| Hazard Class | 3 |
| Subsidiary Risk | None |
| Packing Group | II (or III) |
| Packaging Paragraph | A7.6. |
| Special Provisions | P5 |
| Technical Name Required | No |

### Expected SDDG Inspection (Successful)

| Key | Field | Expected Value | AFMAN Reference |
|-----|-------|----------------|-----------------|
| Key 7 | Aircraft Limitations | "Passenger and Cargo" (P5) | A17.1.2.3 |
| Key 11 | UN Number | "UN3269" | Table A17.1, Key 11 |
| Key 12 | Proper Shipping Name | "POLYESTER RESIN KIT" | Table A17.1, Key 12 |
| Key 13 | Hazard Class | "3" | Table A17.1, Key 13 |
| Key 14 | Subsidiary Risk | Empty | Table A17.1, Key 14 |
| Key 15 | Packing Group | "II" (or "III") | Table A17.1, Key 15 |
| Key 16 | Quantity and Type | **Aggregate quantity** (e.g., "1 fiberboard box x 5 kg") | Table A17.1, Key 16.1.8 |
| Key 17 | Packaging Instructions | "A7.6" | Table A17.1, Key 17 |

### Expected Package Inspection (Successful)

**Labels Required:**
- FLAMMABLE LIQUID (Class 3) - primary hazard (A15.2.1)

**Markings Required:**
- UN3269 (A14.3.1)
- PSN: "POLYESTER RESIN KIT" (A14.3.1)
- Orientation arrows on two opposite sides (A14.3.6)
- Military Shipping Label (MSL) (A14.1.1)

**POP Marking Validation:**
- A7.6 is a two-component kit: base material (Class 3) + organic peroxide activator
- Max total quantity per package: 5 kg (PG II) or 10 kg (PG III)
- Valid outer packaging codes: 1A2, 1B2, 1G, 1H2, 1N2, 3A2, 3B2, 3H2, 4A, 4B, 4C1, 4C2, 4D, 4F, 4G, 4H1, 4H2, 4N
- Packing group code: X or Y (for PG II); X, Y, or Z (for PG III)

### Alterations (Frustration Testing)

| # | Alteration | Expected Frustration | AFMAN Violation |
|---|------------|---------------------|-----------------|
| 1 | Total quantity exceeds 5 kg for PG II | Quantity limit exceeded | A7.6 |
| 2 | Key 16 shows individual component quantities instead of aggregate | Quantity format error for KIT | Table A17.1, Key 16.1.8 |
| 3 | Missing orientation arrows | Orientation marking validation failure | A14.3.6 |

---

## Scenario 5: A7.7 - UN3473 FUEL CELL CARTRIDGES

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3473 |
| PSN | FUEL CELL CARTRIDGES |
| Details | containing flammable liquids |
| Hazard Class | 3 |
| Subsidiary Risk | None |
| Packing Group | II |
| Packaging Paragraph | A7.7., A7.8., A7.9. |
| Special Provisions | P5, 328 |
| Technical Name Required | No |

### Expected SDDG Inspection (Successful)

| Key | Field | Expected Value | AFMAN Reference |
|-----|-------|----------------|-----------------|
| Key 7 | Aircraft Limitations | "Passenger and Cargo" (P5) | A17.1.2.3 |
| Key 11 | UN Number | "UN3473" | Table A17.1, Key 11 |
| Key 12 | Proper Shipping Name | "FUEL CELL CARTRIDGES" | Table A17.1, Key 12 |
| Key 13 | Hazard Class | "3" | Table A17.1, Key 13 |
| Key 14 | Subsidiary Risk | Empty | Table A17.1, Key 14 |
| Key 15 | Packing Group | "II" | Table A17.1, Key 15 |
| Key 16 | Quantity and Type | "1 fiberboard box x [number] cartridges" | Table A17.1, Key 16 |
| Key 17 | Packaging Instructions | "A7.7" | Table A17.1, Key 17 |

### Expected Package Inspection (Successful)

**Labels Required:**
- FLAMMABLE LIQUID (Class 3) - primary hazard (A15.2.1)

**Markings Required:**
- UN3473 (A14.3.1)
- PSN: "FUEL CELL CARTRIDGES" (A14.3.1)
- Military Shipping Label (MSL) (A14.1.1)

**POP Marking Validation:**
- A7.7 is combination packaging with cartridge as inner
- Valid outer packaging codes: 1A2, 1B2, 1D, 1G, 1H2, 1N2, 3A2, 3B2, 3H2, 4A, 4B, 4C1, 4C2, 4D, 4F, 4G, 4H1, 4H2, 4N
- Packing group code: X or Y (for PG II)

### Alterations (Frustration Testing)

| # | Alteration | Expected Frustration | AFMAN Violation |
|---|------------|---------------------|-----------------|
| 1 | Key 17 shows "A7.2" instead of "A7.7" | Packaging paragraph mismatch | Table A17.1, Key 17 |
| 2 | Missing FLAMMABLE LIQUID label | Primary hazard label missing | A15.2.1 |
| 3 | POP marking shows "Z" | PG II requires X or Y, not Z | A14.2 |

---

## Scenario 6: A7.8 - UN3473 FUEL CELL CARTRIDGES CONTAINED IN EQUIPMENT

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3473 |
| PSN | FUEL CELL CARTRIDGES CONTAINED IN EQUIPMENT |
| Details | containing flammable liquids |
| Hazard Class | 3 |
| Subsidiary Risk | None |
| Packing Group | II |
| Packaging Paragraph | A7.7., A7.8., A7.9. |
| Special Provisions | P5, 328 |
| Technical Name Required | No |

### Expected SDDG Inspection (Successful)

| Key | Field | Expected Value | AFMAN Reference |
|-----|-------|----------------|-----------------|
| Key 7 | Aircraft Limitations | "Passenger and Cargo" (P5) | A17.1.2.3 |
| Key 11 | UN Number | "UN3473" | Table A17.1, Key 11 |
| Key 12 | Proper Shipping Name | "FUEL CELL CARTRIDGES CONTAINED IN EQUIPMENT" | Table A17.1, Key 12 |
| Key 13 | Hazard Class | "3" | Table A17.1, Key 13 |
| Key 14 | Subsidiary Risk | Empty | Table A17.1, Key 14 |
| Key 15 | Packing Group | "II" | Table A17.1, Key 15 |
| Key 16 | Quantity and Type | Description of equipment | Table A17.1, Key 16 |
| Key 17 | Packaging Instructions | "A7.8" | Table A17.1, Key 17 |

### Expected Package Inspection (Successful)

**Labels Required:**
- FLAMMABLE LIQUID (Class 3) - primary hazard (A15.2.1)

**Markings Required:**
- UN3473 (A14.3.1)
- PSN: "FUEL CELL CARTRIDGES CONTAINED IN EQUIPMENT" (A14.3.1)
- Military Shipping Label (MSL) (A14.1.1)

**POP Marking Validation:**
- A7.8: UN specification packaging NOT required
- Must protect fuel cells against short circuit
- Terminals must be protected using covers, taping, etc.

### Alterations (Frustration Testing)

| # | Alteration | Expected Frustration | AFMAN Violation |
|---|------------|---------------------|-----------------|
| 1 | Key 12 shows "FUEL CELL CARTRIDGES" (missing "CONTAINED IN EQUIPMENT") | PSN mismatch | Table A17.1, Key 12 |
| 2 | Missing FLAMMABLE LIQUID label | Primary hazard label missing | A15.2.1 |

---

## Scenario 7: A7.9 - UN3473 FUEL CELL CARTRIDGES PACKED WITH EQUIPMENT

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3473 |
| PSN | FUEL CELL CARTRIDGES PACKED WITH EQUIPMENT |
| Details | containing flammable liquids |
| Hazard Class | 3 |
| Subsidiary Risk | None |
| Packing Group | II |
| Packaging Paragraph | A7.7., A7.8., A7.9. |
| Special Provisions | P5, 328 |
| Technical Name Required | No |

### Expected SDDG Inspection (Successful)

| Key | Field | Expected Value | AFMAN Reference |
|-----|-------|----------------|-----------------|
| Key 7 | Aircraft Limitations | "Passenger and Cargo" (P5) | A17.1.2.3 |
| Key 11 | UN Number | "UN3473" | Table A17.1, Key 11 |
| Key 12 | Proper Shipping Name | "FUEL CELL CARTRIDGES PACKED WITH EQUIPMENT" | Table A17.1, Key 12 |
| Key 13 | Hazard Class | "3" | Table A17.1, Key 13 |
| Key 14 | Subsidiary Risk | Empty | Table A17.1, Key 14 |
| Key 15 | Packing Group | "II" | Table A17.1, Key 15 |
| Key 16 | Quantity and Type | Description (max cartridges = equipment need + 2 spares) | Table A17.1, Key 16 |
| Key 17 | Packaging Instructions | "A7.9" | Table A17.1, Key 17 |

### Expected Package Inspection (Successful)

**Labels Required:**
- FLAMMABLE LIQUID (Class 3) - primary hazard (A15.2.1)

**Markings Required:**
- UN3473 (A14.3.1)
- PSN: "FUEL CELL CARTRIDGES PACKED WITH EQUIPMENT" (A14.3.1)
- Military Shipping Label (MSL) (A14.1.1)

**POP Marking Validation:**
- A7.9: UN specification packaging NOT required
- Fuel cartridges protected from damage during transport
- Maximum cartridges: number required to power equipment + 2 spares

### Alterations (Frustration Testing)

| # | Alteration | Expected Frustration | AFMAN Violation |
|---|------------|---------------------|-----------------|
| 1 | Key 12 shows "FUEL CELL CARTRIDGES" (missing "PACKED WITH EQUIPMENT") | PSN mismatch | Table A17.1, Key 12 |
| 2 | Number of cartridges exceeds equipment need + 2 | Quantity exceeds limit | A7.9 |

---

## Scenario 8: A7.10 - UN2985 CHLOROSILANES, FLAMMABLE, CORROSIVE, N.O.S.

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN2985 |
| PSN | CHLOROSILANES, FLAMMABLE, CORROSIVE, N.O.S. |
| Hazard Class | 3 |
| Subsidiary Risk | 8 |
| Packing Group | II |
| Packaging Paragraph | A7.10. |
| Special Provisions | P4 |
| Technical Name Required | Yes (N.O.S. entry) |

### Expected SDDG Inspection (Successful)

| Key | Field | Expected Value | AFMAN Reference |
|-----|-------|----------------|-----------------|
| Key 7 | Aircraft Limitations | "Cargo Aircraft Only" (P4 = CAO) | A17.1.2.3-A17.1.2.4 |
| Key 11 | UN Number | "UN2985" | Table A17.1, Key 11 |
| Key 12 | Proper Shipping Name | "CHLOROSILANES, FLAMMABLE, CORROSIVE, N.O.S. (contains [technical name])" | Table A17.1, Key 12 |
| Key 13 | Hazard Class | "3" | Table A17.1, Key 13 |
| Key 14 | Subsidiary Risk | "8" | Table A17.1, Key 14 |
| Key 15 | Packing Group | "II" | Table A17.1, Key 15 |
| Key 16 | Quantity and Type | Net quantity + packaging | Table A17.1, Key 16 |
| Key 17 | Packaging Instructions | "A7.10" | Table A17.1, Key 17 |

### Expected Package Inspection (Successful)

**Labels Required:**
- FLAMMABLE LIQUID (Class 3) - primary hazard (A15.2.1)
- CORROSIVE (Class 8) - subsidiary (A15.4.7)
- Cargo Aircraft Only (A15.3.1)

**Markings Required:**
- UN2985 (A14.3.1)
- PSN with technical name in parentheses (A14.3.1, A14.3.1.2)
- Orientation arrows on two opposite sides (A14.3.6)
- Military Shipping Label (MSL) (A14.1.1)

**POP Marking Validation:**
- A7.10 is specialized chlorosilane packaging
- Combination: inner glass or steel, outer 1A2, 1D, 1G, 1H2, 4A, 4C1, 4C2, 4D, 4F, 4G, 4H1, 4H2
- Single: 1A1 (steel drum), 3A1 (steel jerrican)
- Composite: 6HA1 (steel outer with plastic inner)
- **NO aluminum cylinders allowed**
- Packing group code: X or Y (for PG II)
- Performance standard: PG I or PG II

### Alterations (Frustration Testing)

| # | Alteration | Expected Frustration | AFMAN Violation |
|---|------------|---------------------|-----------------|
| 1 | Key 17 shows "A7.2" instead of "A7.10" | Specialized packaging paragraph required | Table A17.1, Key 17 |
| 2 | Key 7 shows "Passenger and Cargo" | P4 requires Cargo Aircraft Only | A17.1.2.3-A17.1.2.4 |
| 3 | Missing Cargo Aircraft Only label | CAO label required for P4 | A15.3.1 |
| 4 | Missing CORROSIVE subsidiary label | Subsidiary hazard label missing | A15.2.1, A15.4.7 |
| 5 | Technical name missing from Key 12 | N.O.S. requires technical name | Table A17.1, Key 12.1 |
| 6 | POP marking shows aluminum packaging | Aluminum not authorized for chlorosilanes | A7.10.4 |

---

## Scenario 9: A7.11 - UN3528 ENGINE, INTERNAL COMBUSTION, FLAMMABLE LIQUID POWERED

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3528 |
| PSN | ENGINE, INTERNAL COMBUSTION, FLAMMABLE LIQUID POWERED |
| Hazard Class | 3 |
| Subsidiary Risk | None |
| Packing Group | **None** (special article) |
| Packaging Paragraph | A7.11 |
| Special Provisions | P5, 135, A87 |
| Technical Name Required | No |

### Expected SDDG Inspection (Successful)

| Key | Field | Expected Value | AFMAN Reference |
|-----|-------|----------------|-----------------|
| Key 7 | Aircraft Limitations | "Passenger and Cargo" (P5) | A17.1.2.3 |
| Key 11 | UN Number | "UN3528" | Table A17.1, Key 11 |
| Key 12 | Proper Shipping Name | "ENGINE, INTERNAL COMBUSTION, FLAMMABLE LIQUID POWERED" | Table A17.1, Key 12 |
| Key 13 | Hazard Class | "3" | Table A17.1, Key 13 |
| Key 14 | Subsidiary Risk | Empty | Table A17.1, Key 14 |
| Key 15 | Packing Group | **Empty or "N/A"** (engines don't have packing groups) | A17.5.6.1 |
| Key 16 | Quantity and Type | Description (e.g., "1 gasoline engine") | Table A17.1, Key 16.1.3 |
| Key 17 | Packaging Instructions | "A7.11" | Table A17.1, Key 17 |
| Key 19 | Additional Info | Fuel type, hazard class, and net quantity (e.g., "Gasoline, 3, 500 ml") | A17.5.6.1, Table A17.1 Key 19.7.1 |

### Expected Package Inspection (Successful)

**Labels Required:**
- FLAMMABLE LIQUID (Class 3) - **only if packaged/crated/enclosed** (A15.1.7)
- If unpackaged and readily identifiable: **no labels required**

**Markings Required:**
- UN3528 - **only if packaged/crated/enclosed** (A14.3.15)
- PSN: "ENGINE, INTERNAL COMBUSTION, FLAMMABLE LIQUID POWERED" - **only if enclosed**
- Military Shipping Label (MSL) (A14.1.1)
- If unpackaged and readily identifiable: **no markings required except MSL**

**POP Marking Validation:**
- POP marking may not apply to engines
- Must comply with technical orders/manuals per A7.11
- Fuel limitations:
  - Standard engine: max 500 ml in components/lines, tanks drained
  - Large fuel systems: no free-standing liquid
  - Wheeled SE (Chapter 3): up to 1/2 tank
  - In freight container: completely drained; purge if flash point < 38C

### Alterations (Frustration Testing)

| # | Alteration | Expected Frustration | AFMAN Violation |
|---|------------|---------------------|-----------------|
| 1 | Key 15 shows "II" (engines shouldn't have PG) | Packing group not applicable for engines | A17.5.6.1 |
| 2 | Key 12 shows "MACHINERY" instead of "ENGINE" | PSN precision (MACHINERY vs ENGINE distinction) | Table A17.1, Key 12 |
| 3 | Missing FLAMMABLE LIQUID label when crated | Label required when enclosed | A15.1.7 |
| 4 | Key 19 missing fuel quantity information | Accessorial hazard info required | A17.5.6.1, Key 19.7.1 |
| 5 | Fuel quantity exceeds 500 ml (standard engine) | Fuel limitation exceeded | A7.11 |

---

## Scenario 10: A7.12 - UN3540 ARTICLES CONTAINING FLAMMABLE LIQUID, N.O.S.

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3540 |
| PSN | ARTICLES CONTAINING FLAMMABLE LIQUID, N.O.S. |
| Hazard Class | 3 |
| Subsidiary Risk | None |
| Packing Group | **None** (special article) |
| Packaging Paragraph | A7.12 |
| Special Provisions | P5, 391 |
| Technical Name Required | Yes (N.O.S. entry) |

### Expected SDDG Inspection (Successful)

| Key | Field | Expected Value | AFMAN Reference |
|-----|-------|----------------|-----------------|
| Key 7 | Aircraft Limitations | "Passenger and Cargo" (P5) | A17.1.2.3 |
| Key 11 | UN Number | "UN3540" | Table A17.1, Key 11 |
| Key 12 | Proper Shipping Name | "ARTICLES CONTAINING FLAMMABLE LIQUID, N.O.S. (contains [technical name])" | Table A17.1, Key 12 |
| Key 13 | Hazard Class | "3" | Table A17.1, Key 13 |
| Key 14 | Subsidiary Risk | Empty | Table A17.1, Key 14 |
| Key 15 | Packing Group | **Empty** (articles don't have packing groups) | Table A17.1, Key 15 |
| Key 16 | Quantity and Type | Description + net quantity (max 60 L per package) | Table A17.1, Key 16 |
| Key 17 | Packaging Instructions | "A7.12" | Table A17.1, Key 17 |

### Expected Package Inspection (Successful)

**Labels Required:**
- FLAMMABLE LIQUID (Class 3) - primary hazard (A15.2.1)

**Markings Required:**
- UN3540 (A14.3.1)
- PSN with technical name in parentheses (A14.3.1, A14.3.1.2)
- Military Shipping Label (MSL) (A14.1.1)
- If unpackaged: display PSN and UN number on item itself, cradle, handling/storage/launching device (A14.3.1.1)

**POP Marking Validation:**
- A7.12 has max net quantity of 60 L per package
- Performance standard: PG II
- Packaged articles:
  - Valid outer codes: 1A2, 1B2, 1N2, 1D, 1G, 1H2, 4A, 4B, 4C1, 4C2, 4D, 4F, 4G, 4H1, 4H2, 4N, 3A2, 3H2, 3B2
- Robust articles: may be unpackaged or on pallets

### Alterations (Frustration Testing)

| # | Alteration | Expected Frustration | AFMAN Violation |
|---|------------|---------------------|-----------------|
| 1 | Technical name missing from Key 12 | N.O.S. requires technical name | Table A17.1, Key 12.1 |
| 2 | Net quantity exceeds 60 L per package | Quantity limit exceeded | A7.12 |
| 3 | Missing FLAMMABLE LIQUID label | Primary hazard label missing | A15.2.1 |
| 4 | Key 15 shows "II" | Packing group not applicable for articles | Table A17.1, Key 15 |
| 5 | Unpackaged article missing UN number marking | Marking required per A14.3.1.1 | A14.3.1.1 |

---

## Quick Reference Tables

### Materials Summary by Packaging Paragraph

| Paragraph | UN Number | PSN | PG | Subsidiary | Aircraft | CAO Label |
|-----------|-----------|-----|-------|------------|----------|-----------|
| A7.2 | UN1089 | ACETALDEHYDE | I | None | CAO | Yes |
| A7.3 | UN2251 | BICYCLO[2,2,1] HEPTA-2,5-DIENE, STABILIZED | II | None | PAX | No |
| A7.4 | UN3165 | AIRCRAFT HYDRAULIC POWER UNIT FUEL TANK | I | 6.1, 8 | CAO | Yes |
| A7.6 | UN3269 | POLYESTER RESIN KIT | II/III | None | PAX | No |
| A7.7 | UN3473 | FUEL CELL CARTRIDGES | II | None | PAX | No |
| A7.8 | UN3473 | FUEL CELL CARTRIDGES CONTAINED IN EQUIPMENT | II | None | PAX | No |
| A7.9 | UN3473 | FUEL CELL CARTRIDGES PACKED WITH EQUIPMENT | II | None | PAX | No |
| A7.10 | UN2985 | CHLOROSILANES, FLAMMABLE, CORROSIVE, N.O.S. | II | 8 | CAO | Yes |
| A7.11 | UN3528 | ENGINE, INTERNAL COMBUSTION, FLAMMABLE LIQUID POWERED | N/A | None | PAX | No |
| A7.12 | UN3540 | ARTICLES CONTAINING FLAMMABLE LIQUID, N.O.S. | N/A | None | PAX | No |

### POP Marking Requirements by Scenario

| Paragraph | POP Required | Valid PG Codes | Special Restrictions |
|-----------|--------------|----------------|---------------------|
| A7.2 | Yes | PG I: X only; PG II: X,Y; PG III: X,Y,Z | No fiber drum (1G) for PG I single; no wood barrels |
| A7.3 | Conditional | X, Y | Excepted if refrigerating machine <= 7 kg |
| A7.4 | Specialized | X only | Specific design/burst pressure requirements |
| A7.6 | Yes | PG II: X,Y; PG III: X,Y,Z | Two-component kit; aggregate quantity limits |
| A7.7 | Yes | X, Y | Cartridge as inner packaging |
| A7.8 | Not Required | N/A | Protect against short circuit |
| A7.9 | Not Required | N/A | Max cartridges = equipment need + 2 |
| A7.10 | Yes | X, Y | No aluminum cylinders; glass/steel inner only |
| A7.11 | May Not Apply | N/A | Per technical orders/manuals |
| A7.12 | Yes (PG II perf) | X, Y | Max 60 L per package |

### N.O.S. Technical Name Requirements

| UN Number | PSN | Technical Name Required |
|-----------|-----|------------------------|
| UN2985 | CHLOROSILANES, FLAMMABLE, CORROSIVE, N.O.S. | **Yes** |
| UN3540 | ARTICLES CONTAINING FLAMMABLE LIQUID, N.O.S. | **Yes** |

---

## Test Execution Notes

### Before Testing
1. Ensure app is updated to latest version
2. Clear any cached inspection data
3. Have reference materials available (AFMAN 24-604 Attachments 7, 14, 15, 17)

### During Testing
1. Document actual vs expected results for each key
2. Screenshot any frustrations/failures
3. Note any app crashes or unexpected behavior
4. Verify correct navigation through packaging-specific screens

### Alterations Testing Process
1. First complete a successful inspection with correct data
2. Then introduce each alteration individually
3. Verify the app properly flags the issue
4. Confirm frustration message is clear and actionable
5. Verify correct Form 1015 field mapping for frustrations

### Special Considerations for These Scenarios
- **A7.4, A7.11, A7.12**: Special articles without standard packing groups
- **A7.7, A7.8, A7.9**: Three variants of same UN number with different PSNs
- **A7.10**: Specialized chlorosilane restrictions (no aluminum)
- **N.O.S. entries**: Must verify technical name handling
