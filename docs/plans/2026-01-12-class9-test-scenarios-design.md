# Class 9 (Miscellaneous Dangerous Goods) Test Scenarios

## Overview

This document contains 20 comprehensive manual test scenarios for the HazPro mobile app Inspector workflow, focusing on Class 9 (Miscellaneous Dangerous Goods) materials. Each scenario is based on AFMAN 24-604 regulations (Attachments 13, 14, 15, and 17).

### Purpose

These scenarios are designed for manual testing by physically running through the app. Each scenario includes:
- **Material Details**: UN number, PSN, hazard class, packing group (if applicable), packaging paragraph, special provisions
- **Expected SDDG Inspection**: What a successful SDDG should contain (Keys 7, 11-17)
- **Expected Package Inspection**: Required labels, markings, and special marks
- **Alterations**: Intentional errors to test frustration handling

### Class 9 Reference

| Class | Name | Description | Label |
|-------|------|-------------|-------|
| 9 | Miscellaneous Dangerous Goods | Materials presenting a danger during air transport that do not meet definitions of Classes 1-8 | White with 7 black vertical stripes; "9" in lower half |

**CRITICAL**: Class 9 has **NO divisions** (unlike Classes 1, 2, or 6). Key 13 must show simply **"9"**.

### Lithium Battery Category Breakdown

| UN Number | Description | Batteries Alone/With Equipment |
|-----------|-------------|-------------------------------|
| UN3480 | LITHIUM ION BATTERIES | Standalone |
| UN3481 | LITHIUM ION BATTERIES CONTAINED IN EQUIPMENT | Installed in equipment |
| UN3481 | LITHIUM ION BATTERIES PACKED WITH EQUIPMENT | Shipped alongside equipment |
| UN3090 | LITHIUM METAL BATTERIES | Standalone |
| UN3091 | LITHIUM METAL BATTERIES CONTAINED IN EQUIPMENT | Installed in equipment |
| UN3091 | LITHIUM METAL BATTERIES PACKED WITH EQUIPMENT | Shipped alongside equipment |

### Packing Group Applicability Table

| Material Type | Packing Group | Key 15 |
|---------------|---------------|--------|
| Lithium Batteries (all UN numbers) | **NONE** | **Empty** |
| Dry Ice (UN1845) | **NONE** | **Empty** |
| Magnetized Material (UN2807) | **NONE** | **Empty** |
| Vehicles/Engines (UN3166, UN3171) | **NONE** | **Empty** |
| Safety Devices (UN3268) | **NONE** | **Empty** |
| Life-Saving Appliances (UN2990) | **NONE** | **Empty** |
| Genetically Modified Organisms (UN3245) | **NONE** | **Empty** |
| Environmentally Hazardous (UN3077, UN3082) | **III** | Required |
| PCBs (UN2315, UN3432) | **II** | Required |
| Asbestos, Amphibole (UN2212) | **II** | Required |
| Asbestos, Chrysotile (UN2590) | **III** | Required |

### Key Validation Points

**SDDG Keys (per Attachment 17):**
- Key 7: Aircraft Limitations (CAO vs Passenger and Cargo)
- Key 11: UN/NA/ID Number
- Key 12: Proper Shipping Name (with technical name for N.O.S. entries)
- Key 13: Class - **"9" ONLY** (NO divisions)
- Key 14: Subsidiary Hazard (usually empty for Class 9)
- Key 15: Packing Group (varies by material - many are empty)
- Key 16: Quantity and Type of Packing
- Key 17: Packaging Instructions (A13.xx paragraph)

**Package Inspection:**
- CLASS 9 label (or Magnetized Material label for UN2807)
- Lithium Battery Handling Mark (when applicable)
- Cargo Aircraft Only label (when required)
- UN number and PSN markings
- Special markings: Net mass of dry ice, "MARINE POLLUTANT", technical names
- POP Marking (only for materials WITH packing group)

### Key Differences from Other Classes

| Aspect | Class 1 | Class 6 | Class 8 | Class 9 |
|--------|---------|---------|---------|---------|
| Divisions | 1.1-1.6 | 6.1, 6.2 | None | **None** |
| Key 13 | "1.1A", etc. | "6.1", "6.2" | "8" | **"9"** |
| Packing Group | Empty | Varies | Required | **Varies by material** |
| Key 15 | Empty | Varies | Required | **Often empty** |
| Packaging | A5.xx | A10.xx | A12.xx | **A13.xx** |
| Special Marks | EX Number | Inhalation Hazard | None | **Lithium mark, HOT, Marine Pollutant** |
| POP Marking | X or Y | Y or Z | Y or Z | **Y or Z (when applicable)** |

---

## Scenario 1: UN3480 - LITHIUM ION BATTERIES (Section I - Large Batteries)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3480 |
| PSN | LITHIUM ION BATTERIES (including lithium polymer batteries) |
| Hazard Class | 9 |
| Packing Group | None |
| Packaging Paragraph | A13.7 |
| Special Provisions | P5, 388 |
| Section | I (cells >20 Wh or batteries >100 Wh) |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" (P5 allows passenger aircraft) |
| Key 11 | "UN3480" |
| Key 12 | "LITHIUM ION BATTERIES (including lithium polymer batteries)" |
| Key 13 | "9" |
| Key 14 | Empty |
| Key 15 | Empty (no packing group for lithium batteries) |
| Key 16 | Net quantity + packaging (e.g., "1 fiberboard box (4G) x 5 kg") |
| Key 17 | "A13.7" |

### Expected Package Inspection (Successful)

**Labels Required:**
- CLASS 9 (Miscellaneous Dangerous Goods)

**Markings Required:**
- UN3480
- PSN: "LITHIUM ION BATTERIES"
- Lithium Battery Handling Mark (Figure A14.6) with:
  - UN3480 in the asterisk position
  - Telephone number for additional information

**POP Marking Validation:**
- **NOT REQUIRED** - No packing group assigned
- If POP marking present: Packaging code must be from A13.7 list (4G, 4A, 4B, etc.)

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 13 shows "9.1" instead of "9" | Division validation (Class 9 has NO divisions) |
| 2 | Key 15 populated with "II" | Packing group validation (should be empty) |
| 3 | Missing Lithium Battery Handling Mark | Lithium battery marking requirement |

---

## Scenario 2: UN3480 - LITHIUM ION BATTERIES (Section II - Small Batteries)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3480 |
| PSN | LITHIUM ION BATTERIES (including lithium polymer batteries) |
| Hazard Class | 9 |
| Packing Group | None |
| Packaging Paragraph | A13.7 |
| Special Provisions | P5, 388 |
| Section | II (cells ≤20 Wh and batteries ≤100 Wh) |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" |
| Key 11 | "UN3480" |
| Key 12 | "LITHIUM ION BATTERIES (including lithium polymer batteries)" |
| Key 13 | "9" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | Net quantity + packaging (e.g., "2 fiberboard boxes (4G) x 2 kg") |
| Key 17 | "A13.7" |

### Expected Package Inspection (Successful)

**Labels Required:**
- CLASS 9 label (may be exempt for Section II with lithium battery mark only)

**Markings Required:**
- UN3480
- PSN: "LITHIUM ION BATTERIES"
- Lithium Battery Handling Mark with UN3480 and telephone number
- Watt-hour (Wh) rating marked on battery/outer case

**POP Marking Validation:**
- **NOT REQUIRED** - No packing group assigned

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Lithium Battery Mark shows "UN3481" instead of "UN3480" | UN number match on lithium mark |
| 2 | Telephone number missing from Lithium Battery Mark | Lithium mark completeness |
| 3 | Watt-hour rating not marked on batteries | Wh rating requirement |

---

## Scenario 3: UN3481 - LITHIUM ION BATTERIES CONTAINED IN EQUIPMENT

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3481 |
| PSN | LITHIUM ION BATTERIES CONTAINED IN EQUIPMENT (including lithium polymer batteries) |
| Hazard Class | 9 |
| Packing Group | None |
| Packaging Paragraph | A13.8 |
| Special Provisions | P5, 388 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" |
| Key 11 | "UN3481" |
| Key 12 | "LITHIUM ION BATTERIES CONTAINED IN EQUIPMENT (including lithium polymer batteries)" |
| Key 13 | "9" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | Number + equipment description (e.g., "2 laptop computers x 0.5 kg") |
| Key 17 | "A13.8" |

### Expected Package Inspection (Successful)

**Labels Required:**
- CLASS 9 (may be exempt for small batteries in equipment)

**Markings Required:**
- UN3481
- PSN: "LITHIUM ION BATTERIES CONTAINED IN EQUIPMENT"
- Lithium Battery Handling Mark (when required per A13.8)

**POP Marking Validation:**
- **NOT REQUIRED** - No packing group assigned

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 12 shows "LITHIUM ION BATTERIES" without "CONTAINED IN EQUIPMENT" | PSN completeness - must specify configuration |
| 2 | Key 17 shows "A13.7" instead of "A13.8" | Packaging instruction validation |
| 3 | UN number shows UN3480 instead of UN3481 | UN number validation for equipment configuration |

---

## Scenario 4: UN3481 - LITHIUM ION BATTERIES PACKED WITH EQUIPMENT

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3481 |
| PSN | LITHIUM ION BATTERIES PACKED WITH EQUIPMENT (including lithium polymer batteries) |
| Hazard Class | 9 |
| Packing Group | None |
| Packaging Paragraph | A13.9 |
| Special Provisions | P5, 388 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" |
| Key 11 | "UN3481" |
| Key 12 | "LITHIUM ION BATTERIES PACKED WITH EQUIPMENT (including lithium polymer batteries)" |
| Key 13 | "9" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | Number + packaging (e.g., "1 fiberboard box x 3 kg") |
| Key 17 | "A13.9" |

### Expected Package Inspection (Successful)

**Labels Required:**
- CLASS 9

**Markings Required:**
- UN3481
- PSN: "LITHIUM ION BATTERIES PACKED WITH EQUIPMENT"
- Lithium Battery Handling Mark with UN3481 and telephone number

**POP Marking Validation:**
- **NOT REQUIRED** - No packing group assigned

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 12 shows "PACKED WITH" but Key 17 shows "A13.8" (contained in) | Packaging instruction must match PSN configuration |
| 2 | Lithium mark shows "UN3480" instead of "UN3481" | UN match on lithium mark |
| 3 | PSN marking shows "CONTAINED IN" instead of "PACKED WITH" | PSN configuration validation |

---

## Scenario 5: UN3090 - LITHIUM METAL BATTERIES (Standalone)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3090 |
| PSN | LITHIUM METAL BATTERIES (including lithium alloy batteries) |
| Hazard Class | 9 |
| Packing Group | None |
| Packaging Paragraph | A13.7 |
| Special Provisions | **P4**, 388 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | **"Cargo Aircraft Only"** (P4 - forbidden on passenger aircraft) |
| Key 11 | "UN3090" |
| Key 12 | "LITHIUM METAL BATTERIES (including lithium alloy batteries)" |
| Key 13 | "9" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | Net quantity + packaging |
| Key 17 | "A13.7" |

### Expected Package Inspection (Successful)

**Labels Required:**
- CLASS 9
- **Cargo Aircraft Only** (required for P4 materials)

**Markings Required:**
- UN3090
- PSN: "LITHIUM METAL BATTERIES"
- Lithium Battery Handling Mark with UN3090 and telephone number
- **"LITHIUM METAL BATTERIES - FORBIDDEN FOR TRANSPORT ABOARD PASSENGER AIRCRAFT"** OR CAO label
- Lithium content (g) marked on battery

**POP Marking Validation:**
- **NOT REQUIRED** - No packing group assigned

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 7 shows "Passenger and Cargo Aircraft" | Aircraft limitation validation (P4 requires CAO) |
| 2 | Missing Cargo Aircraft Only label | CAO label requirement for P4 |
| 3 | Key 12 shows "LITHIUM ION" instead of "LITHIUM METAL" | Battery chemistry type validation |

---

## Scenario 6: UN3091 - LITHIUM METAL BATTERIES CONTAINED IN EQUIPMENT

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3091 |
| PSN | LITHIUM METAL BATTERIES CONTAINED IN EQUIPMENT (including lithium alloy batteries) |
| Hazard Class | 9 |
| Packing Group | None |
| Packaging Paragraph | A13.8 |
| Special Provisions | **P4**, 388 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | **"Cargo Aircraft Only"** |
| Key 11 | "UN3091" |
| Key 12 | "LITHIUM METAL BATTERIES CONTAINED IN EQUIPMENT (including lithium alloy batteries)" |
| Key 13 | "9" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | Equipment description + quantity |
| Key 17 | "A13.8" |

### Expected Package Inspection (Successful)

**Labels Required:**
- CLASS 9
- Cargo Aircraft Only

**Markings Required:**
- UN3091
- PSN: "LITHIUM METAL BATTERIES CONTAINED IN EQUIPMENT"
- Lithium Battery Handling Mark with UN3091 and telephone number

**POP Marking Validation:**
- **NOT REQUIRED** - No packing group assigned

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Missing "CONTAINED IN EQUIPMENT" in PSN marking | PSN configuration validation |
| 2 | Key 11 shows UN3090 instead of UN3091 | UN number for equipment configuration |
| 3 | Lithium Battery Mark shows UN3091 but PSN says "PACKED WITH" | Consistency between mark and PSN |

---

## Scenario 7: UN3091 - LITHIUM METAL BATTERIES PACKED WITH EQUIPMENT

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3091 |
| PSN | LITHIUM METAL BATTERIES PACKED WITH EQUIPMENT (including lithium alloy batteries) |
| Hazard Class | 9 |
| Packing Group | None |
| Packaging Paragraph | A13.9 |
| Special Provisions | **P4**, 388 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | **"Cargo Aircraft Only"** |
| Key 11 | "UN3091" |
| Key 12 | "LITHIUM METAL BATTERIES PACKED WITH EQUIPMENT (including lithium alloy batteries)" |
| Key 13 | "9" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | Packaging description + quantity |
| Key 17 | "A13.9" |

### Expected Package Inspection (Successful)

**Labels Required:**
- CLASS 9
- Cargo Aircraft Only

**Markings Required:**
- UN3091
- PSN: "LITHIUM METAL BATTERIES PACKED WITH EQUIPMENT"
- Lithium Battery Handling Mark with UN3091 and telephone number

**POP Marking Validation:**
- **NOT REQUIRED** - No packing group assigned

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 17 shows "A13.8" instead of "A13.9" | Packaging instruction for packed with vs contained in |
| 2 | PSN on package shows "ION" instead of "METAL" | Battery chemistry validation on marking |
| 3 | Missing CAO label with P4 special provision | CAO requirement validation |

---

## Scenario 8: UN3536 - LITHIUM BATTERIES INSTALLED IN CARGO TRANSPORT UNIT

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3536 |
| PSN | LITHIUM BATTERIES INSTALLED IN CARGO TRANSPORT UNIT (lithium ion batteries or lithium metal batteries) |
| Hazard Class | 9 |
| Packing Group | None |
| Packaging Paragraph | A13.8 |
| Special Provisions | P5, 389 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" |
| Key 11 | "UN3536" |
| Key 12 | "LITHIUM BATTERIES INSTALLED IN CARGO TRANSPORT UNIT (lithium ion batteries)" OR "(lithium metal batteries)" |
| Key 13 | "9" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | Description of cargo transport unit |
| Key 17 | "A13.8" |

### Expected Package Inspection (Successful)

**Labels Required:**
- CLASS 9

**Markings Required:**
- UN3536
- PSN with battery type specified (ion or metal)

**POP Marking Validation:**
- **NOT REQUIRED** - No packing group assigned

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 12 shows generic "LITHIUM BATTERIES" without specifying ion or metal | PSN must specify battery chemistry |
| 2 | Key 13 shows "9.2" | Class 9 has no divisions |
| 3 | Key 11 shows UN3480 or UN3090 instead of UN3536 | UN number validation for cargo transport unit |

---

## Scenario 9: UN1845 - CARBON DIOXIDE, SOLID (DRY ICE)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1845 |
| PSN | CARBON DIOXIDE, SOLID |
| Hazard Class | 9 |
| Packing Group | None |
| Packaging Paragraph | A13.10 |
| Special Provisions | P5 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" |
| Key 11 | "UN1845" |
| Key 12 | "CARBON DIOXIDE, SOLID" or "DRY ICE" |
| Key 13 | "9" |
| Key 14 | Empty |
| Key 15 | Empty (no packing group for dry ice) |
| Key 16 | Net mass of dry ice (e.g., "1 polystyrene container x 10 kg") |
| Key 17 | "A13.10" |

### Expected Package Inspection (Successful)

**Labels Required:**
- CLASS 9

**Markings Required:**
- UN1845
- PSN: "CARBON DIOXIDE, SOLID" or "DRY ICE"
- **Net mass of dry ice** (e.g., "NET MASS 10 kg")

**Special Requirements:**
- Packaging must permit release of CO2 gas
- Must NOT be hermetically sealed

**POP Marking Validation:**
- **NOT REQUIRED** - No packing group assigned, UN specification packaging not required

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Missing net mass of dry ice marking | Dry ice net mass requirement |
| 2 | Key 15 shows "III" | Packing group validation (dry ice has none) |
| 3 | Package appears hermetically sealed | Packaging venting requirement |

---

## Scenario 10: UN2807 - MAGNETIZED MATERIAL

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN2807 |
| PSN | MAGNETIZED MATERIAL |
| Hazard Class | 9 |
| Packing Group | None |
| Packaging Paragraph | A13.11 |
| Special Provisions | P5 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" |
| Key 11 | "UN2807" |
| Key 12 | "MAGNETIZED MATERIAL" |
| Key 13 | "9" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | Number + packaging (no net quantity required) |
| Key 17 | "A13.11" |

### Expected Package Inspection (Successful)

**Labels Required:**
- **MAGNETIZED MATERIAL label ONLY** (NOT the CLASS 9 label)

**Markings Required:**
- UN2807
- PSN: "MAGNETIZED MATERIAL"

**Special Requirements:**
- Field strength must not exceed 5.25 milligauss at 15 feet (4.6 m)
- Minimum 4 inches (102 mm) between magnetic surface and outside of package

**POP Marking Validation:**
- **NOT REQUIRED** - UN specification packaging not required per A13.11

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | CLASS 9 label applied instead of Magnetized Material label | Label type validation (magnetized material uses special label) |
| 2 | Both CLASS 9 and Magnetized Material labels present | Only magnetized label should be present (per A15.3.3) |
| 3 | Key 16 includes net weight (not required for magnetized material) | Quantity format validation |

---

## Scenario 11: UN3166 - VEHICLE, FLAMMABLE LIQUID POWERED

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3166 |
| PSN | VEHICLE, FLAMMABLE LIQUID POWERED |
| Hazard Class | 9 |
| Packing Group | None |
| Packaging Paragraph | A13.4 |
| Special Provisions | P5, 135 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" |
| Key 11 | "UN3166" |
| Key 12 | "VEHICLE, FLAMMABLE LIQUID POWERED" |
| Key 13 | "9" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | Vehicle nomenclature (e.g., "2 TRUCKS") |
| Key 17 | "A13.4" |
| Key 19 | Accessorial hazards (fuel, batteries, fire extinguishers) |

### Expected Package Inspection (Successful)

**Labels Required:**
- CLASS 9 (if vehicle is packaged/crated; exempt if readily identifiable)

**Markings Required:**
- UN3166 (if packaged/crated)
- PSN: "VEHICLE, FLAMMABLE LIQUID POWERED" (if packaged/crated)

**Special Requirements:**
- Fuel tank no more than one-half full (default)
- Batteries secured, terminals protected
- Fire extinguishers in approved holders

**POP Marking Validation:**
- **NOT REQUIRED** - Vehicles not packed in UN specification packaging

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 12 shows just "VEHICLE" without power type | PSN must specify power source |
| 2 | Key 15 shows "III" | Packing group validation (vehicles have none) |
| 3 | Key 19 missing accessorial hazards (fuel, battery) | Accessorial hazard documentation |

---

## Scenario 12: UN3171 - BATTERY-POWERED VEHICLE

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3171 |
| PSN | BATTERY-POWERED VEHICLE |
| Hazard Class | 9 |
| Packing Group | None |
| Packaging Paragraph | A13.6 |
| Special Provisions | P5, 134 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" |
| Key 11 | "UN3171" |
| Key 12 | "BATTERY-POWERED VEHICLE" |
| Key 13 | "9" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | Vehicle description (e.g., "1 Electric Forklift") |
| Key 17 | "A13.6" |

### Expected Package Inspection (Successful)

**Labels Required:**
- CLASS 9 (if packaged/crated)

**Markings Required:**
- UN3171 (if packaged/crated)
- PSN: "BATTERY-POWERED VEHICLE" (if packaged/crated)

**Special Requirements:**
- Batteries secured in holders
- Terminals protected with non-conductive caps
- Wet-cell batteries: may need removal and packaging per A12.4

**POP Marking Validation:**
- **NOT REQUIRED** - Vehicles not packed in UN specification packaging

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 17 shows "A13.4" instead of "A13.6" | Packaging instruction validation |
| 2 | Key 11 shows UN3166 instead of UN3171 | UN number for battery vs fuel powered |
| 3 | Key 12 shows "VEHICLE, FLAMMABLE LIQUID POWERED" but UN is UN3171 | PSN/UN consistency |

---

## Scenario 13: UN3077 - ENVIRONMENTALLY HAZARDOUS SUBSTANCE, SOLID, N.O.S.

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3077 |
| PSN | ENVIRONMENTALLY HAZARDOUS SUBSTANCE, SOLID, N.O.S. |
| Technical Name | (Copper sulfate) |
| Hazard Class | 9 |
| Packing Group | **III** |
| Packaging Paragraph | A13.2 |
| Special Provisions | P5, 8, A197 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" |
| Key 11 | "UN3077" |
| Key 12 | "ENVIRONMENTALLY HAZARDOUS SUBSTANCE, SOLID, N.O.S. (Copper sulfate)" |
| Key 13 | "9" |
| Key 14 | Empty |
| Key 15 | **"III"** (Packing Group III required) |
| Key 16 | Net quantity + packaging (e.g., "1 fiberboard box (4G) x 25 kg") |
| Key 17 | "A13.2" |

### Expected Package Inspection (Successful)

**Labels Required:**
- CLASS 9

**Markings Required:**
- UN3077
- PSN: "ENVIRONMENTALLY HAZARDOUS SUBSTANCE, SOLID, N.O.S. (Copper sulfate)" with technical name
- **"MARINE POLLUTANT"** marking (if applicable)

**POP Marking Validation:**
- **REQUIRED** - Packing Group III assigned
- Packing group code: **Z** (PG III only)
- Valid packaging codes per A13.2.3: 1A1/2, 1B1/2, 1D, 1G, 1H1/2, 1N1/2, 4A-4N, 5H1-4, etc.

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 12 missing technical name "(Copper sulfate)" | N.O.S. technical name requirement |
| 2 | Key 15 empty | Packing group required for environmentally hazardous |
| 3 | POP marking shows code "Y" instead of "Z" | PG III requires Z code |

---

## Scenario 14: UN3082 - ENVIRONMENTALLY HAZARDOUS SUBSTANCE, LIQUID, N.O.S.

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3082 |
| PSN | ENVIRONMENTALLY HAZARDOUS SUBSTANCE, LIQUID, N.O.S. |
| Technical Name | (Tributyltin oxide) |
| Hazard Class | 9 |
| Packing Group | **III** |
| Packaging Paragraph | A13.2 |
| Special Provisions | P5, 8, A197 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" |
| Key 11 | "UN3082" |
| Key 12 | "ENVIRONMENTALLY HAZARDOUS SUBSTANCE, LIQUID, N.O.S. (Tributyltin oxide)" |
| Key 13 | "9" |
| Key 14 | Empty |
| Key 15 | **"III"** |
| Key 16 | Net quantity + packaging (e.g., "1 drum (1H1) x 200 L") |
| Key 17 | "A13.2" |

### Expected Package Inspection (Successful)

**Labels Required:**
- CLASS 9

**Markings Required:**
- UN3082
- PSN: "ENVIRONMENTALLY HAZARDOUS SUBSTANCE, LIQUID, N.O.S. (Tributyltin oxide)" with technical name
- **"MARINE POLLUTANT"** marking
- Orientation arrows (for combination packaging with liquid)

**POP Marking Validation:**
- **REQUIRED** - Packing Group III assigned
- Packing group code: **Z**
- Valid packaging codes per A13.2.2: 1A1/2, 1B1/2, 1G, 1H1/2, 1N1/2, 3A1/2, 3B1/2, 3H1/2, etc.

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Missing "MARINE POLLUTANT" marking | Marine pollutant marking requirement |
| 2 | Technical name missing from package marking | N.O.S. technical name on package |
| 3 | POP marking shows "4G" (box) for liquid | Packaging type validation (liquids need drums/jerricans) |

---

## Scenario 15: UN2315 - POLYCHLORINATED BIPHENYLS, LIQUID

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN2315 |
| PSN | POLYCHLORINATED BIPHENYLS, LIQUID |
| Hazard Class | 9 |
| Packing Group | **II** |
| Packaging Paragraph | A13.2 |
| Special Provisions | P5, 9 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" |
| Key 11 | "UN2315" |
| Key 12 | "POLYCHLORINATED BIPHENYLS, LIQUID" |
| Key 13 | "9" |
| Key 14 | Empty |
| Key 15 | **"II"** (Packing Group II required) |
| Key 16 | Net quantity + packaging (e.g., "1 drum (1A1) x 100 L") |
| Key 17 | "A13.2" |

### Expected Package Inspection (Successful)

**Labels Required:**
- CLASS 9

**Markings Required:**
- UN2315
- PSN: "POLYCHLORINATED BIPHENYLS, LIQUID"
- Orientation arrows (for liquid in combination packaging)

**POP Marking Validation:**
- **REQUIRED** - Packing Group II assigned
- Packing group code: **Y** (PG II or III)
- Valid packaging codes per A13.2.2

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 15 shows "III" instead of "II" | Packing group accuracy |
| 2 | POP marking shows code "Z" | PG II requires Y (Z is PG III only) |
| 3 | PSN shows "PCB, LIQUID" (abbreviated) | PSN abbreviation validation |

---

## Scenario 16: UN3432 - POLYCHLORINATED BIPHENYLS, SOLID

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3432 |
| PSN | POLYCHLORINATED BIPHENYLS, SOLID |
| Hazard Class | 9 |
| Packing Group | **II** |
| Packaging Paragraph | A13.2 |
| Special Provisions | P5, 9 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" |
| Key 11 | "UN3432" |
| Key 12 | "POLYCHLORINATED BIPHENYLS, SOLID" |
| Key 13 | "9" |
| Key 14 | Empty |
| Key 15 | **"II"** |
| Key 16 | Net quantity + packaging (e.g., "2 fiberboard boxes (4G) x 15 kg") |
| Key 17 | "A13.2" |

### Expected Package Inspection (Successful)

**Labels Required:**
- CLASS 9

**Markings Required:**
- UN3432
- PSN: "POLYCHLORINATED BIPHENYLS, SOLID"

**POP Marking Validation:**
- **REQUIRED** - Packing Group II assigned
- Packing group code: **Y**
- Valid packaging codes per A13.2.3 (solid packaging)

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 11 shows UN2315 instead of UN3432 | UN number for solid vs liquid |
| 2 | Missing POP marking entirely | POP marking required for PG II material |
| 3 | Key 12 shows "LIQUID" instead of "SOLID" | PSN physical state validation |

---

## Scenario 17: UN3268 - SAFETY DEVICES (AIR BAG INFLATORS)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3268 |
| PSN | SAFETY DEVICES, electrically initiated |
| Hazard Class | 9 |
| Packing Group | None |
| Packaging Paragraph | A13.15 |
| Special Provisions | P5, 160 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" |
| Key 11 | "UN3268" |
| Key 12 | "SAFETY DEVICES, electrically initiated" |
| Key 13 | "9" |
| Key 14 | Empty |
| Key 15 | Empty (no packing group) |
| Key 16 | Number + packaging (e.g., "10 fiberboard boxes (4G) x 5 kg") |
| Key 17 | "A13.15" |

### Expected Package Inspection (Successful)

**Labels Required:**
- CLASS 9

**Markings Required:**
- UN3268
- PSN: "SAFETY DEVICES, electrically initiated" (may also show "AIR BAG INFLATORS" or "SEAT BELT PRETENSIONERS")

**POP Marking Validation:**
- Valid packaging codes per A13.15: 4A, 4B, 4C1, 4C2, 4D, 4F, 4G, 4H1, 4H2, 4N, 1A2, 1B2, 1D, 1G, 1H2, 1N2, 3A2, 3B2, 3H2
- No packing group code required (no PG assigned)

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 15 shows "II" | Packing group validation (safety devices have none) |
| 2 | Key 17 shows "A5.15" instead of "A13.15" | Packaging instruction class prefix (A5 is Class 1, A13 is Class 9) |
| 3 | Label shows "EXPLOSIVE 1.4G" instead of CLASS 9 | Hazard class label validation |

---

## Scenario 18: UN2212 - ASBESTOS, AMPHIBOLE

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN2212 |
| PSN | ASBESTOS, AMPHIBOLE (amosite, tremolite, actinolite, anthophyllite, or crocidolite) |
| Hazard Class | 9 |
| Packing Group | **II** |
| Packaging Paragraph | A13.15 |
| Special Provisions | P5, 156 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" |
| Key 11 | "UN2212" |
| Key 12 | "ASBESTOS, AMPHIBOLE (amosite)" or other specific type |
| Key 13 | "9" |
| Key 14 | Empty |
| Key 15 | **"II"** |
| Key 16 | Net quantity + packaging |
| Key 17 | "A13.15" |

### Expected Package Inspection (Successful)

**Labels Required:**
- CLASS 9

**Markings Required:**
- UN2212
- PSN: "ASBESTOS, AMPHIBOLE" with specific type in parentheses

**POP Marking Validation:**
- **REQUIRED** - Packing Group II assigned
- Packing group code: **Y**
- Dust/sift-proof packaging required

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 12 shows "ASBESTOS" without specifying amphibole type | PSN completeness |
| 2 | Key 15 shows "III" instead of "II" | Packing group accuracy |
| 3 | POP marking shows "Z" instead of "Y" | PG II requires Y code |

---

## Scenario 19: UN3245 - GENETICALLY MODIFIED ORGANISMS

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3245 |
| PSN | GENETICALLY MODIFIED ORGANISMS |
| Hazard Class | 9 |
| Packing Group | None |
| Packaging Paragraph | A10.8 |
| Special Provisions | P5 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" |
| Key 11 | "UN3245" |
| Key 12 | "GENETICALLY MODIFIED ORGANISMS" or "GENETICALLY MODIFIED MICRO-ORGANISMS" |
| Key 13 | "9" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | Number + packaging description |
| Key 17 | "A10.8" |

### Expected Package Inspection (Successful)

**Labels Required:**
- CLASS 9

**Markings Required:**
- UN3245
- PSN: "GENETICALLY MODIFIED ORGANISMS"

**Special Requirements:**
- Triple packaging system (primary, secondary, outer)
- 95 kPa pressure differential requirement
- Absorbent material between primary and secondary

**POP Marking Validation:**
- **NOT REQUIRED** - No packing group assigned

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 17 shows "A13.xx" instead of "A10.8" | Packaging instruction validation (GMOs use A10.8, not A13) |
| 2 | Key 15 shows "III" | Packing group validation (GMOs have none) |
| 3 | Key 13 shows "6.2" | Class validation (GMOs are Class 9, not 6.2) |

---

## Scenario 20: UN2990 - LIFE-SAVING APPLIANCES, SELF INFLATING

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN2990 |
| PSN | LIFE-SAVING APPLIANCES, SELF INFLATING |
| Hazard Class | 9 |
| Packing Group | None |
| Packaging Paragraph | A13.12 |
| Special Provisions | P5 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" |
| Key 11 | "UN2990" |
| Key 12 | "LIFE-SAVING APPLIANCES, SELF INFLATING" |
| Key 13 | "9" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | Number + description (e.g., "1 fiberboard box x 3 inflatable rafts") |
| Key 17 | "A13.12" |

### Expected Package Inspection (Successful)

**Labels Required:**
- CLASS 9

**Markings Required:**
- UN2990
- PSN: "LIFE-SAVING APPLIANCES, SELF INFLATING"

**Special Requirements:**
- Weather-resistant fiberboard or strong outer container
- Must protect against accidental activation

**POP Marking Validation:**
- **NOT REQUIRED** - UN specification packaging not required per A13.12

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 11 shows UN3072 instead of UN2990 | UN number validation (3072 is NOT self-inflating) |
| 2 | Key 12 missing "SELF INFLATING" qualifier | PSN completeness |
| 3 | Key 17 shows "A13.4" instead of "A13.12" | Packaging instruction validation |

---

## Quick Reference: Alteration Categories

| Category | Scenarios | Description |
|----------|-----------|-------------|
| **No Packing Group** | 1, 2, 9, 10, 11, 12, 17, 19, 20 | Key 15 should be empty but is populated |
| **Packing Group Required** | 13, 14, 15, 16, 18 | Key 15 missing when PG is required |
| **Division Errors** | 1, 8 | Key 13 shows "9.x" instead of just "9" |
| **PSN Configuration** | 3, 4, 6, 7 | Missing "CONTAINED IN" or "PACKED WITH" |
| **Battery Chemistry** | 5, 7 | ION vs METAL confusion |
| **UN Number Mismatch** | 3, 6, 12, 16, 20 | Wrong UN number for configuration |
| **Lithium Mark Errors** | 1, 2, 4 | Missing mark, wrong UN, missing phone |
| **Technical Name** | 13, 14 | Missing N.O.S. technical name |
| **POP Code Errors** | 13, 14, 15, 18 | Y vs Z code mismatch for PG |
| **Aircraft Limitations** | 5 | P4 requires CAO but shows PAX |
| **Label Type** | 10, 17 | Wrong label (magnetized vs Class 9) |
| **Packaging Instruction** | 3, 7, 11, 17, 19, 20 | Wrong A13.xx paragraph |
| **Special Markings** | 9, 14 | Missing dry ice weight, marine pollutant |

---

## Material Category Coverage

| Category | Scenarios | UN Numbers |
|----------|-----------|------------|
| **Lithium Ion Batteries** | 1, 2, 3, 4 | UN3480, UN3481 |
| **Lithium Metal Batteries** | 5, 6, 7 | UN3090, UN3091 |
| **Lithium in Cargo Unit** | 8 | UN3536 |
| **Dry Ice** | 9 | UN1845 |
| **Magnetized Material** | 10 | UN2807 |
| **Vehicles** | 11, 12 | UN3166, UN3171 |
| **Environmentally Hazardous** | 13, 14 | UN3077, UN3082 |
| **PCBs** | 15, 16 | UN2315, UN3432 |
| **Safety Devices** | 17 | UN3268 |
| **Asbestos** | 18 | UN2212 |
| **GMOs** | 19 | UN3245 |
| **Life-Saving Appliances** | 20 | UN2990 |

---

## Packing Group Applicability Coverage

| With Packing Group | Without Packing Group |
|-------------------|----------------------|
| 13: UN3077 (PG III) | 1, 2: UN3480 |
| 14: UN3082 (PG III) | 3, 4: UN3481 |
| 15: UN2315 (PG II) | 5: UN3090 |
| 16: UN3432 (PG II) | 6, 7: UN3091 |
| 18: UN2212 (PG II) | 8: UN3536 |
| | 9: UN1845 |
| | 10: UN2807 |
| | 11: UN3166 |
| | 12: UN3171 |
| | 17: UN3268 |
| | 19: UN3245 |
| | 20: UN2990 |

**Total:** 5 scenarios with PG, 15 scenarios without PG

---

## Lithium Battery Type Coverage

| Battery Type | Scenarios | Special Provisions |
|--------------|-----------|-------------------|
| Section I Ion | 1 | P5 |
| Section II Ion | 2 | P5 |
| Ion Contained | 3 | P5 |
| Ion Packed With | 4 | P5 |
| Metal Standalone | 5 | **P4** (CAO) |
| Metal Contained | 6 | **P4** (CAO) |
| Metal Packed With | 7 | **P4** (CAO) |
| Cargo Transport Unit | 8 | P5 |

---

## Special Marking Requirements Coverage

| Marking | Scenarios | When Required |
|---------|-----------|---------------|
| Lithium Battery Handling Mark | 1, 2, 3, 4, 5, 6, 7 | All lithium battery shipments |
| Watt-hour Rating | 2 | Lithium ion batteries |
| Lithium Content (g) | 5 | Lithium metal batteries |
| Net Mass of Dry Ice | 9 | UN1845 shipments |
| "MARINE POLLUTANT" | 13, 14 | Environmentally hazardous substances |
| Magnetized Material Label | 10 | UN2807 only |
| CAO Label | 5, 6, 7 | P4 materials |
| Orientation Arrows | 14 | Liquids in combination packaging |

---

## Packaging Paragraph Coverage (A13.xx)

| Paragraph | Material Type | Scenarios |
|-----------|---------------|-----------|
| A13.2 | Environmentally Hazardous, PCBs | 13, 14, 15, 16 |
| A13.4 | Vehicles (fuel powered) | 11 |
| A13.6 | Battery-powered vehicles | 12 |
| A13.7 | Lithium batteries standalone | 1, 2, 5 |
| A13.8 | Lithium in equipment, UN3536 | 3, 6, 8 |
| A13.9 | Lithium packed with equipment | 4, 7 |
| A13.10 | Dry ice | 9 |
| A13.11 | Magnetized material | 10 |
| A13.12 | Life-saving appliances | 20 |
| A13.15 | Safety devices, asbestos | 17, 18 |
| A10.8 | GMOs | 19 |

---

## Test Execution Notes

### Before Testing Checklist

1. **Ensure app is configured** with current AFMAN 24-604 data
2. **Verify ML model** includes CLASS 9 and Magnetized Material label detection
3. **Confirm OCR** can detect lithium battery marks and POP markings
4. **Prepare mock materials** matching Material Details for each scenario

### During Testing Guidance

1. **SDDG Phase**: Enter all Key values exactly as shown in "Expected SDDG" table
2. **Package Phase**: Present package images with correct labels/markings
3. **Alteration Phase**: Apply ONE alteration at a time, verify frustration captures correctly
4. **Reset**: Clear alterations before testing next scenario

### Key Class 9 Considerations

1. **NO DIVISIONS**: Class 9 shows simply "9" - never "9.1", "9.2", etc.
2. **Packing Group Varies**: Check each material - many have NO packing group
3. **Lithium Battery Mark**: Different from CLASS 9 label - verify both when required
4. **Magnetized Material**: Uses special label, NOT the CLASS 9 label
5. **POP Marking**: Only required for materials WITH assigned packing group
6. **Vehicles**: Exempt from labeling/marking when readily identifiable (not packaged)

### Lithium Battery Inspection Special Notes

1. **UN Number Match**: Lithium mark must show same UN as SDDG Key 11
2. **Telephone Number**: Required on all lithium battery marks
3. **P4 vs P5**: Lithium METAL batteries (UN3090, UN3091) are P4 = Cargo Aircraft Only
4. **Configuration**: "CONTAINED IN" vs "PACKED WITH" must match Key 12 and Key 17
5. **Wh Rating**: Required marking for lithium ion batteries
6. **Lithium Content**: Required marking for lithium metal batteries

### After Testing Summary Requirements

1. **Document** which scenarios passed/failed
2. **Note** any ML detection issues (missed labels, incorrect classifications)
3. **Record** OCR accuracy for lithium marks, POP markings, UN numbers
4. **Verify** AMC Form 1015 populates correctly with frustration data
5. **Report** any regulatory interpretation questions for Class 9 materials

---

## Appendix: Class 9 Label Appearance

### CLASS 9 Label

```
    ╱╲
   ╱  ╲
  ╱ ║║ ╲
 ╱  ║║  ╲
╱   ║║   ╲
\   ║║   /
 \  ║║  /
  \    /
   \ 9 /
    ╲╱
```

- Upper half: 7 black vertical stripes on white background
- Lower half: White with underlined "9"
- Diamond shape, minimum 10 cm (4 inches) per side

### Magnetized Material Label

- Same diamond shape as hazard labels
- Blue symbol of horseshoe magnet
- Text: "Magnetized Material" (optional per variation)
- Used INSTEAD of Class 9 label for UN2807

### Lithium Battery Handling Mark (Figure A14.6)

```
┌────────────────────────────┐
│   ╔════════════════════╗   │  ← Red hatched border
│   ║  [Battery Symbol]  ║   │
│   ║                    ║   │
│   ║      UN3480*       ║   │  ← UN number
│   ║                    ║   │
│   ║  +1-800-XXX-XXXX** ║   │  ← Telephone number
│   ╚════════════════════╝   │
└────────────────────────────┘

Minimum dimensions: 120mm x 110mm (or 105mm x 74mm for small packages)
```
