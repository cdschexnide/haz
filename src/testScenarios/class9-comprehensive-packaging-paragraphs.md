# Class 9 Comprehensive Packaging Paragraph Test Scenarios

## Overview

This document contains **19 comprehensive test scenarios** for the HazPro mobile app Inspector workflow, covering **every packaging paragraph in Attachment 13** (A13.2 through A13.20) for Class 9 (Miscellaneous Dangerous Goods) materials.

### Purpose

These scenarios are designed for manual testing by physically running through the app. Each scenario includes:
- **Material Details**: UN number, PSN, hazard class, packing group (if applicable), packaging paragraph, special provisions
- **Expected SDDG Inspection**: What a successful SDDG should contain (Keys 7, 11-17)
- **Expected Package Inspection**: Required labels, markings, and POP marking validation
- **Alterations**: Intentional errors to test frustration handling

### Source of Truth

All requirements are derived from:
- **Attachment 13** (`docs/attachment13/afmanAttachment13.pdf`) - Packaging instructions for Class 9
- **Attachment 14** (`docs/attachment14/attachment14.pdf`) - Marking requirements
- **Attachment 15** (`docs/attachment15/attachment15.pdf`) - Labeling requirements
- **Attachment 17** (`server/attachment17/attachment17.pdf`) - SDDG requirements

### Class 9 Key Facts

| Aspect | Requirement |
|--------|-------------|
| Hazard Class | 9 (NO divisions - just "9") |
| Key 13 Format | Simply "9" (never "9.1", "9.2", etc.) |
| Packing Group | Varies by material - many have NONE |
| Primary Label | CLASS 9 (7 black stripes, "9" in bottom) |
| Special Labels | Magnetized Material (UN2807 only) |

### Packaging Paragraph Coverage

| Paragraph | Material Type | Packing Group | POP Required |
|-----------|---------------|---------------|--------------|
| A13.2 | Ammonium Nitrate Fertilizer, Env. Hazardous, PCBs | III | Yes |
| A13.3 | Consumer Commodity | None | No |
| A13.4 | Vehicles (fuel/gas powered) | None | No |
| A13.5 | Articles Containing Misc. DG, N.O.S. | None | No |
| A13.6 | Battery-Powered Equipment/Vehicles | None | No |
| A13.7 | Lithium Batteries (standalone) | None | No |
| A13.8 | Lithium Batteries in Equipment/Cargo Unit | None | No |
| A13.9 | Lithium Batteries Packed With Equipment | None | No |
| A13.10 | Dry Ice (Carbon Dioxide, Solid) | None | No |
| A13.11 | Magnetized Material | None | No |
| A13.12 | Life-Saving Appliances | None | No |
| A13.13 | Dangerous Goods in Apparatus | None | No |
| A13.14 | Class 9 General (Benzoyl Peroxide) | III | Yes |
| A13.15 | Asbestos, Safety Devices | II or None | Varies |
| A13.16 | White Asbestos (Chrysotile) | III | Yes |
| A13.17 | Plastic Moulding Compound | III | Yes |
| A13.18 | Chemical/First Aid Kit | Varies | No |
| A13.19 | Capacitors | None | No |
| A13.20 | Engines, Internal Combustion | None | No |

---

## Scenario 1: A13.2 - AMMONIUM NITRATE BASED FERTILIZER (UN2071)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN2071 |
| PSN | AMMONIUM NITRATE BASED FERTILIZER |
| Hazard Class | 9 |
| Packing Group | III |
| Packaging Paragraph | A13.2 |
| Special Provisions | P5, 132 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" (P5 allows both) |
| Key 11 | "UN2071" |
| Key 12 | "AMMONIUM NITRATE BASED FERTILIZER" |
| Key 13 | "9" |
| Key 14 | Empty |
| Key 15 | "III" |
| Key 16 | Net quantity + packaging (e.g., "2 fiberboard boxes (4G) x 25 kg") |
| Key 17 | "A13.2" |

### Expected Package Inspection (Successful)

**Labels Required:**
- CLASS 9 (Miscellaneous Dangerous Goods)

**Markings Required:**
- UN2071
- PSN: "AMMONIUM NITRATE BASED FERTILIZER"

**POP Marking Validation:**
- **REQUIRED** - Packing Group III assigned
- Packing group code: **Z** (PG III only)
- Valid packaging codes per A13.2.3: 4A, 4B, 4C1, 4C2, 4D, 4F, 4G, 4H1, 4H2, 4N, 5H1-4, 5L1-3, 5M2

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 15 empty | Packing group required for this material |
| 2 | POP marking shows "Y" instead of "Z" | PG III requires Z code |
| 3 | Key 13 shows "9.3" instead of "9" | Class 9 has NO divisions |

---

## Scenario 2: A13.3 - CONSUMER COMMODITY (ID8000)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | ID8000 |
| PSN | CONSUMER COMMODITY |
| Hazard Class | 9 |
| Packing Group | None |
| Packaging Paragraph | A13.3 |
| Special Provisions | P5, A503 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" |
| Key 11 | "ID8000" |
| Key 12 | "CONSUMER COMMODITY" |
| Key 13 | "9" |
| Key 14 | Empty |
| Key 15 | Empty (no packing group) |
| Key 16 | Number + packaging (e.g., "1 fiberboard box x 15 kg") |
| Key 17 | "A13.3" |

### Expected Package Inspection (Successful)

**Labels Required:**
- CLASS 9 (or may be exempt per consumer commodity provisions)

**Markings Required:**
- ID8000
- PSN: "CONSUMER COMMODITY"

**Special Requirements:**
- Package weight not to exceed 30 kg (66 lbs)
- Inner packaging: liquids ≤500 mL, solids ≤500 g
- Must withstand 4-foot drop test

**POP Marking Validation:**
- **NOT REQUIRED** - No packing group assigned, strong outer packaging sufficient

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 15 shows "III" | Packing group validation (consumer commodities have none) |
| 2 | Key 11 shows "UN8000" instead of "ID8000" | ID prefix required for consumer commodities |
| 3 | Package exceeds 30 kg weight limit | Consumer commodity weight limitation |

---

## Scenario 3: A13.4 - VEHICLE, FLAMMABLE GAS POWERED (UN3166)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3166 |
| PSN | VEHICLE, FLAMMABLE GAS POWERED |
| Hazard Class | 9 |
| Packing Group | None |
| Packaging Paragraph | A13.4 |
| Special Provisions | P5, 135 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" |
| Key 11 | "UN3166" |
| Key 12 | "VEHICLE, FLAMMABLE GAS POWERED" |
| Key 13 | "9" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | Vehicle nomenclature (e.g., "2 FORKLIFTS") |
| Key 17 | "A13.4" |
| Key 19 | Accessorial hazards (fuel type, batteries, fire extinguishers) |

### Expected Package Inspection (Successful)

**Labels Required:**
- CLASS 9 (only if packaged/crated; exempt if readily identifiable)

**Markings Required:**
- UN3166 (only if packaged/crated)
- PSN: "VEHICLE, FLAMMABLE GAS POWERED" (only if packaged/crated)

**Special Requirements:**
- Fuel tank: Standard ≤1/2 full; Chapter 3 ≤3/4 full
- Batteries secured, terminals protected
- Fire extinguishers in approved holders
- LPG vehicles: Completely empty or cylinders per Attachment 6

**POP Marking Validation:**
- **NOT REQUIRED** - Vehicles not packed in UN specification packaging

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 12 shows "VEHICLE" without specifying power type | PSN must specify power source |
| 2 | Key 15 shows "II" | Packing group validation (vehicles have none) |
| 3 | Key 19 missing accessorial hazard documentation | Accessorial hazards required for vehicles |

---

## Scenario 4: A13.5 - ARTICLES CONTAINING MISCELLANEOUS DANGEROUS GOODS, N.O.S. (UN3548)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3548 |
| PSN | ARTICLES CONTAINING MISCELLANEOUS DANGEROUS GOODS, N.O.S. |
| Hazard Class | 9 |
| Packing Group | None |
| Packaging Paragraph | A13.5 |
| Special Provisions | P5, 391 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" |
| Key 11 | "UN3548" |
| Key 12 | "ARTICLES CONTAINING MISCELLANEOUS DANGEROUS GOODS, N.O.S." |
| Key 13 | "9" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | Description + packaging (e.g., "1 fiberboard box x 2 articles") |
| Key 17 | "A13.5" |

### Expected Package Inspection (Successful)

**Labels Required:**
- CLASS 9

**Markings Required:**
- UN3548
- PSN: "ARTICLES CONTAINING MISCELLANEOUS DANGEROUS GOODS, N.O.S."

**Special Requirements:**
- Pack to prevent movement and inadvertent operation
- Liquids: ≤60 L per package
- Solids: ≤100 kg per package
- PG II performance standard when packaged

**POP Marking Validation:**
- **NOT REQUIRED** for robust articles or properly packaged per A13.5

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 12 missing "N.O.S." designation | PSN completeness for generic entries |
| 2 | Key 17 shows "A13.14" instead of "A13.5" | Packaging paragraph validation |
| 3 | Package exceeds 60 L liquid limit | Quantity limitation validation |

---

## Scenario 5: A13.6 - BATTERY-POWERED EQUIPMENT (UN3171)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3171 |
| PSN | BATTERY-POWERED EQUIPMENT |
| Hazard Class | 9 |
| Packing Group | None |
| Packaging Paragraph | A13.6 |
| Special Provisions | P5, 134 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" |
| Key 11 | "UN3171" |
| Key 12 | "BATTERY-POWERED EQUIPMENT" |
| Key 13 | "9" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | Equipment description (e.g., "1 Electric Forklift") |
| Key 17 | "A13.6" |

### Expected Package Inspection (Successful)

**Labels Required:**
- CLASS 9 (if packaged/crated)

**Markings Required:**
- UN3171 (if packaged/crated)
- PSN: "BATTERY-POWERED EQUIPMENT" (if packaged/crated)

**Special Requirements:**
- Batteries secured upright in designed holders
- Terminals protected with non-conductive caps
- Lithium batteries: Must pass UN Manual of Tests and Criteria
- Non-spillable batteries: Secure against short circuits

**POP Marking Validation:**
- **NOT REQUIRED** - Equipment-integral packaging

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 17 shows "A13.4" instead of "A13.6" | Packaging paragraph (A13.4 is fuel vehicles) |
| 2 | Key 11 shows UN3166 instead of UN3171 | UN number for battery vs fuel powered |
| 3 | Key 12 shows "VEHICLE, FLAMMABLE LIQUID POWERED" but UN is UN3171 | PSN/UN consistency |

---

## Scenario 6: A13.7 - LITHIUM ION BATTERIES (UN3480)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3480 |
| PSN | LITHIUM ION BATTERIES (including lithium polymer batteries) |
| Hazard Class | 9 |
| Packing Group | None |
| Packaging Paragraph | A13.7 |
| Special Provisions | P5, 388 |

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
- Watt-hour (Wh) rating marked on battery/outer case

**POP Marking Validation:**
- **NOT REQUIRED** - No packing group assigned

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 13 shows "9.1" instead of "9" | Division validation (Class 9 has NO divisions) |
| 2 | Key 15 populated with "II" | Packing group validation (should be empty) |
| 3 | Missing Lithium Battery Handling Mark | Lithium battery marking requirement |

---

## Scenario 7: A13.8 - LITHIUM BATTERIES INSTALLED IN CARGO TRANSPORT UNIT (UN3536)

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

**Special Requirements:**
- Equipment provides equivalent protection to UN specification packaging
- Secure batteries in holders, protect from damage/short circuits
- Additional cells/batteries per A13.7.2

**POP Marking Validation:**
- **NOT REQUIRED** - Equipment-integral packaging

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 12 shows generic "LITHIUM BATTERIES" without specifying ion or metal | PSN must specify battery chemistry |
| 2 | Key 13 shows "9.2" | Class 9 has no divisions |
| 3 | Key 11 shows UN3480 instead of UN3536 | UN number validation for cargo transport unit |

---

## Scenario 8: A13.9 - LITHIUM ION BATTERIES PACKED WITH EQUIPMENT (UN3481)

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

**Special Requirements:**
- Inner packagings completely enclose cells/batteries
- Prevent short circuits, shifting, movement
- PG II performance requirements for outer packaging

**POP Marking Validation:**
- **NOT REQUIRED** - No packing group assigned

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 12 shows "PACKED WITH" but Key 17 shows "A13.8" (contained in) | Packaging instruction must match PSN configuration |
| 2 | Lithium mark shows "UN3480" instead of "UN3481" | UN match on lithium mark |
| 3 | PSN marking shows "CONTAINED IN" instead of "PACKED WITH" | PSN configuration validation |

---

## Scenario 9: A13.10 - CARBON DIOXIDE, SOLID (UN1845)

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
- Store in well-ventilated areas only

**POP Marking Validation:**
- **NOT REQUIRED** - No packing group assigned, UN specification packaging not required

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Missing net mass of dry ice marking | Dry ice net mass requirement (A14.4.8.4) |
| 2 | Key 15 shows "III" | Packing group validation (dry ice has none) |
| 3 | Package appears hermetically sealed | Packaging venting requirement |

---

## Scenario 10: A13.11 - MAGNETIZED MATERIAL (UN2807)

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
- **MAGNETIZED MATERIAL label ONLY** (NOT the CLASS 9 label per A15.3.3)

**Markings Required:**
- UN2807
- PSN: "MAGNETIZED MATERIAL"

**Special Requirements:**
- Field strength must not exceed 5.25 milligauss at 15 feet (4.6 m)
- Minimum 4 inches (102 mm) between magnetic surface and outside of package
- Store ≥4.6 m from compass sensing devices

**POP Marking Validation:**
- **NOT REQUIRED** - UN specification packaging not required per A13.11

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | CLASS 9 label applied instead of Magnetized Material label | Label type validation (magnetized material uses special label) |
| 2 | Both CLASS 9 and Magnetized Material labels present | Only magnetized label should be present (per A15.3.3) |
| 3 | Missing Magnetized Material label entirely | Required label validation |

---

## Scenario 11: A13.12 - LIFE-SAVING APPLIANCES, NOT SELF INFLATING (UN3072)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3072 |
| PSN | LIFE-SAVING APPLIANCES, NOT SELF INFLATING (containing dangerous goods as equipment) |
| Hazard Class | 9 |
| Packing Group | None |
| Packaging Paragraph | A13.12 |
| Special Provisions | P5, 182 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" |
| Key 11 | "UN3072" |
| Key 12 | "LIFE-SAVING APPLIANCES, NOT SELF INFLATING" |
| Key 13 | "9" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | Number + description (e.g., "1 fiberboard box x 3 life vests") |
| Key 17 | "A13.12" |

### Expected Package Inspection (Successful)

**Labels Required:**
- CLASS 9

**Markings Required:**
- UN3072
- PSN: "LIFE-SAVING APPLIANCES, NOT SELF INFLATING"

**Special Requirements:**
- Weather-resistant fiberboard or strong outer container
- Inner packaging to prevent accidental activation
- Suitably cushioned
- Store in cool, well-ventilated areas away from fire hazards

**POP Marking Validation:**
- **NOT REQUIRED** - UN specification packaging not required per A13.12

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 11 shows UN2990 instead of UN3072 | UN number validation (2990 is SELF-INFLATING) |
| 2 | Key 12 shows "SELF INFLATING" instead of "NOT SELF INFLATING" | PSN accuracy |
| 3 | Key 17 shows "A13.4" instead of "A13.12" | Packaging instruction validation |

---

## Scenario 12: A13.13 - DANGEROUS GOODS IN APPARATUS (UN3363)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3363 |
| PSN | DANGEROUS GOODS IN APPARATUS |
| Hazard Class | 9 |
| Packing Group | None |
| Packaging Paragraph | A13.13 |
| Special Provisions | P5 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" |
| Key 11 | "UN3363" |
| Key 12 | "DANGEROUS GOODS IN APPARATUS" |
| Key 13 | "9" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | Apparatus description + quantity |
| Key 17 | "A13.13" |

### Expected Package Inspection (Successful)

**Labels Required:**
- CLASS 9

**Markings Required:**
- UN3363
- PSN: "DANGEROUS GOODS IN APPARATUS"

**Special Requirements:**
- Strong outer packaging (unless apparatus provides equivalent protection)
- Only hazardous materials permitted as limited quantities (A19.3) or Division 2.2 gases
- Solids: ≤1 kg per package
- Liquids: ≤500 ml per package
- Class 2.2 gases: ≤0.5 kg per package

**POP Marking Validation:**
- **NOT REQUIRED** - No packing group assigned

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 15 shows "III" | Packing group validation (should be empty) |
| 2 | Package contains >1 kg of solid hazardous material | Quantity limitation (1 kg max for solids) |
| 3 | Key 12 shows "DANGEROUS GOODS IN MACHINERY" instead of "APPARATUS" | PSN accuracy |

---

## Scenario 13: A13.14 - BENZOYL PEROXIDE (UN2328)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN2328 |
| PSN | BENZOYL PEROXIDE |
| Hazard Class | 9 |
| Packing Group | III |
| Packaging Paragraph | A13.14 |
| Special Provisions | P5 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" |
| Key 11 | "UN2328" |
| Key 12 | "BENZOYL PEROXIDE" |
| Key 13 | "9" |
| Key 14 | Empty |
| Key 15 | "III" |
| Key 16 | Net quantity + packaging (e.g., "1 drum (1H1) x 50 L") |
| Key 17 | "A13.14" |

### Expected Package Inspection (Successful)

**Labels Required:**
- CLASS 9

**Markings Required:**
- UN2328
- PSN: "BENZOYL PEROXIDE"

**Special Requirements:**
- Any appropriate non-bulk packaging meeting Attachment 3 requirements
- Not liquid-full at 54C (130F) for containers ≤208 L
- If vapor pressure >110 kPa at 38C: Primary packaging must withstand vapor pressure at 54C

**POP Marking Validation:**
- **REQUIRED** - Packing Group III assigned
- Packing group code: **Z** (PG III only)

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 15 empty | Packing group required for this material |
| 2 | POP marking shows "Y" instead of "Z" | PG III requires Z code |
| 3 | Missing POP marking entirely | POP marking required for PG III material |

---

## Scenario 14: A13.15 - ASBESTOS, AMPHIBOLE (NA2212)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | NA2212 |
| PSN | ASBESTOS |
| Hazard Class | 9 |
| Packing Group | III |
| Packaging Paragraph | A13.15 |
| Special Provisions | P5, 156 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" |
| Key 11 | "NA2212" |
| Key 12 | "ASBESTOS" |
| Key 13 | "9" |
| Key 14 | Empty |
| Key 15 | "III" |
| Key 16 | Net quantity + packaging (e.g., "1 fiberboard box x 20 kg") |
| Key 17 | "A13.15" |

### Expected Package Inspection (Successful)

**Labels Required:**
- CLASS 9

**Markings Required:**
- NA2212
- PSN: "ASBESTOS"

**Special Requirements:**
- Dust and sift-proof packaging
- Rigid, leak-tight packaging (metal, plastic, or fiber drums)
- Or dust-proof bags palletized and unitized
- Minimize occupational exposure to airborne particles

**POP Marking Validation:**
- **REQUIRED** - Packing Group III assigned
- Packing group code: **Z**

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 11 shows "UN2212" instead of "NA2212" | Prefix validation (NA for North American) |
| 2 | Key 15 shows "II" instead of "III" | Packing group accuracy |
| 3 | POP marking shows "Y" instead of "Z" | PG III requires Z code |

---

## Scenario 15: A13.16 - WHITE ASBESTOS (UN2590)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN2590 |
| PSN | WHITE ASBESTOS (chrysotile, actinolite, anthophyllite, tremolite) |
| Hazard Class | 9 |
| Packing Group | III |
| Packaging Paragraph | A13.16 |
| Special Provisions | P5 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" |
| Key 11 | "UN2590" |
| Key 12 | "WHITE ASBESTOS (chrysotile)" or specific type in parentheses |
| Key 13 | "9" |
| Key 14 | Empty |
| Key 15 | "III" |
| Key 16 | Net quantity + packaging |
| Key 17 | "A13.16" |

### Expected Package Inspection (Successful)

**Labels Required:**
- CLASS 9

**Markings Required:**
- UN2590
- PSN: "WHITE ASBESTOS" with type in parentheses

**Special Requirements:**
- Rigid, leak-tight packaging
- Dust and sift-proof bags in strong outer fiberboard/wooden boxes
- Palletized and unitized (shrink-wrapped) acceptable

**POP Marking Validation:**
- **REQUIRED** - Packing Group III assigned
- Packing group code: **Z**

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 12 missing specific asbestos type in parentheses | PSN completeness |
| 2 | Key 15 empty | Packing group required for this material |
| 3 | Key 17 shows "A13.15" instead of "A13.16" | Packaging paragraph validation |

---

## Scenario 16: A13.17 - PLASTIC MOULDING COMPOUND (UN3314)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3314 |
| PSN | PLASTIC MOULDING COMPOUND (in dough, sheet, or extruded rope form evolving flammable vapor) |
| Hazard Class | 9 |
| Packing Group | III |
| Packaging Paragraph | A13.17 |
| Special Provisions | P5 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" |
| Key 11 | "UN3314" |
| Key 12 | "PLASTIC MOULDING COMPOUND" |
| Key 13 | "9" |
| Key 14 | Empty |
| Key 15 | "III" |
| Key 16 | Net quantity + packaging (e.g., "1 drum (1G) x 25 kg") |
| Key 17 | "A13.17" |

### Expected Package Inspection (Successful)

**Labels Required:**
- CLASS 9

**Markings Required:**
- UN3314
- PSN: "PLASTIC MOULDING COMPOUND"

**Special Requirements:**
- Inner: Sealed plastic liner
- Outer: Boxes (4A, 4B, 4C1, 4C2, 4D, 4F, 4G, 4H1, 4H2, 4N) or drums (1D, 1G)
- Alternative: Vapor-tight metal/plastic drums without liner

**POP Marking Validation:**
- **REQUIRED** - Packing Group III assigned
- Packing group code: **Z**
- Valid codes: 1A1, 1A2, 1B1, 1B2, 1D, 1G, 1H1, 1H2, 1N1, 1N2, 4A, 4B, 4C1, 4C2, 4D, 4F, 4G, 4H1, 4H2, 4N

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 15 empty | Packing group required |
| 2 | POP marking shows "Y" instead of "Z" | PG III requires Z code |
| 3 | Key 13 shows "3" instead of "9" | Hazard class validation (not Class 3 flammable) |

---

## Scenario 17: A13.18 - CHEMICAL KIT (UN3316)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3316 |
| PSN | CHEMICAL KIT |
| Hazard Class | 9 |
| Packing Group | None (determined by most restrictive inner) |
| Packaging Paragraph | A13.18 |
| Special Provisions | P5 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" |
| Key 11 | "UN3316" |
| Key 12 | "CHEMICAL KIT" |
| Key 13 | "9" |
| Key 14 | Empty |
| Key 15 | Empty (or most restrictive PG if assigned) |
| Key 16 | Number + packaging (e.g., "2 wooden boxes x 5 kg") |
| Key 17 | "A13.18" |

### Expected Package Inspection (Successful)

**Labels Required:**
- CLASS 9

**Markings Required:**
- UN3316
- PSN: "CHEMICAL KIT"

**Special Requirements:**
- Inner packaging: ≤250 ml for liquids, ≤250 g for solids
- Per kit total: ≤1 L liquids or ≤1 kg solids
- Per package total: ≤10 kg dangerous goods
- Only limited quantities (A19.3.2) and excepted quantities (A19.2) authorized

**POP Marking Validation:**
- **NOT REQUIRED** - Packaging per A13.18 specifications

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 12 shows "FIRST AID KIT" instead of "CHEMICAL KIT" | PSN distinction (different material) |
| 2 | Package exceeds 10 kg total dangerous goods | Quantity limitation validation |
| 3 | Inner receptacle exceeds 250 ml liquid limit | Inner packaging limitation |

---

## Scenario 18: A13.19 - CAPACITOR, ASYMMETRIC (UN3508)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3508 |
| PSN | CAPACITOR, ASYMMETRIC (with an energy storage capacity greater than 0.3 Wh) |
| Hazard Class | 9 |
| Packing Group | None |
| Packaging Paragraph | A13.19 |
| Special Provisions | P5 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" |
| Key 11 | "UN3508" |
| Key 12 | "CAPACITOR, ASYMMETRIC" |
| Key 13 | "9" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | Number + packaging (e.g., "10 fiberboard boxes x 2 kg") |
| Key 17 | "A13.19" |

### Expected Package Inspection (Successful)

**Labels Required:**
- CLASS 9

**Markings Required:**
- UN3508
- PSN: "CAPACITOR, ASYMMETRIC"
- **Energy storage capacity in Wh** marked on capacitor

**Special Requirements:**
- Not installed in equipment: Must be uncharged during transport
- Protect against short circuit:
  - ≤10 Wh: Protect or fit metal strap
  - >10 Wh: Fit metal strap connecting terminals
- Design to withstand 95 kPa pressure differential (if electrolyte meets hazard definition)

**POP Marking Validation:**
- **NOT REQUIRED** - No packing group assigned

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 15 shows "II" | Packing group validation (capacitors have none) |
| 2 | Missing Wh energy storage marking on capacitor | Wh rating requirement |
| 3 | Key 12 shows just "CAPACITOR" without "ASYMMETRIC" | PSN completeness |

---

## Scenario 19: A13.20 - ENGINE, INTERNAL COMBUSTION (UN3530)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3530 |
| PSN | ENGINE, INTERNAL COMBUSTION |
| Hazard Class | 9 |
| Packing Group | None |
| Packaging Paragraph | A13.20 |
| Special Provisions | P5, 135, A87 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" |
| Key 11 | "UN3530" |
| Key 12 | "ENGINE, INTERNAL COMBUSTION" |
| Key 13 | "9" |
| Key 14 | Empty |
| Key 15 | Empty |
| Key 16 | Engine description (e.g., "2 generators") |
| Key 17 | "A13.20" |
| Key 19 | Accessorial hazards (fuel, batteries) |

### Expected Package Inspection (Successful)

**Labels Required:**
- CLASS 9 (only if packaged/crated; exempt if readily identifiable per A14.3.15)

**Markings Required:**
- UN3530 (only if packaged/crated)
- PSN: "ENGINE, INTERNAL COMBUSTION" (only if packaged/crated)

**Special Requirements:**
- Completely drain fuel; ≤500 ml residual allowed in components/fuel lines
- All lines/tanks securely closed
- Chapter 3 authority (wheeled): Up to 1/2 tank
- Batteries: Upright in designed holders, terminals protected
- If drained and purged per technical manual: May be nonhazardous (A3.1.16.4)

**POP Marking Validation:**
- **NOT REQUIRED** - Engine-integral packaging

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 11 shows UN3528 instead of UN3530 | UN number validation (3528 is fuel cell engine) |
| 2 | Key 15 shows "III" | Packing group validation (engines have none) |
| 3 | Key 19 missing accessorial hazards (fuel, batteries) | Accessorial hazard documentation |

---

## Quick Reference: Packing Group Requirements

### Materials WITH Packing Group (POP REQUIRED)

| Scenario | UN Number | Material | Packing Group | POP Code |
|----------|-----------|----------|---------------|----------|
| 1 | UN2071 | Ammonium Nitrate Fertilizer | III | Z |
| 13 | UN2328 | Benzoyl Peroxide | III | Z |
| 14 | NA2212 | Asbestos | III | Z |
| 15 | UN2590 | White Asbestos | III | Z |
| 16 | UN3314 | Plastic Moulding Compound | III | Z |

### Materials WITHOUT Packing Group (POP NOT REQUIRED)

| Scenario | UN Number | Material |
|----------|-----------|----------|
| 2 | ID8000 | Consumer Commodity |
| 3 | UN3166 | Vehicle, Flammable Gas Powered |
| 4 | UN3548 | Articles Containing Misc. DG |
| 5 | UN3171 | Battery-Powered Equipment |
| 6 | UN3480 | Lithium Ion Batteries |
| 7 | UN3536 | Lithium Batteries in Cargo Unit |
| 8 | UN3481 | Lithium Batteries Packed With Equipment |
| 9 | UN1845 | Dry Ice |
| 10 | UN2807 | Magnetized Material |
| 11 | UN3072 | Life-Saving Appliances |
| 12 | UN3363 | Dangerous Goods in Apparatus |
| 17 | UN3316 | Chemical Kit |
| 18 | UN3508 | Capacitor, Asymmetric |
| 19 | UN3530 | Engine, Internal Combustion |

---

## Quick Reference: Special Marking Requirements

| Scenario | Material | Special Marking |
|----------|----------|-----------------|
| 6, 8 | Lithium Batteries | Lithium Battery Handling Mark (Figure A14.6) |
| 9 | Dry Ice | Net mass of dry ice marking |
| 10 | Magnetized Material | Magnetized Material label (NOT Class 9) |
| 18 | Capacitor | Energy storage capacity (Wh) marking |
| 3, 19 | Vehicles/Engines | Exempt from marking if readily identifiable |

---

## Quick Reference: Alteration Categories

| Category | Scenarios | Description |
|----------|-----------|-------------|
| **No Packing Group** | 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 17, 18, 19 | Key 15 should be empty but is populated |
| **Packing Group Required** | 1, 13, 14, 15, 16 | Key 15 missing when PG is required |
| **Division Errors** | 1, 6, 7 | Key 13 shows "9.x" instead of just "9" |
| **POP Code Errors** | 1, 13, 14, 15, 16 | Y vs Z code mismatch for PG |
| **PSN Completeness** | 4, 12, 15, 18 | Missing qualifiers or N.O.S. designation |
| **UN Number Prefix** | 2, 14 | ID vs UN vs NA prefix validation |
| **Label Type** | 10 | Magnetized Material vs Class 9 label |
| **Special Markings** | 6, 8, 9, 18 | Missing lithium mark, dry ice mass, Wh rating |
| **Packaging Instruction** | 4, 5, 11, 15 | Wrong A13.xx paragraph |
| **Quantity Limits** | 2, 4, 12, 17 | Exceeding consumer commodity, apparatus, or kit limits |

---

## Test Execution Notes

### Before Testing Checklist

1. **Ensure app is configured** with current AFMAN 24-604 data
2. **Verify ML model** includes CLASS 9 and Magnetized Material label detection
3. **Confirm OCR** can detect lithium battery marks, dry ice markings, and POP markings
4. **Prepare mock materials** matching Material Details for each scenario

### During Testing Guidance

1. **SDDG Phase**: Enter all Key values exactly as shown in "Expected SDDG" table
2. **Package Phase**: Present package images with correct labels/markings
3. **Alteration Phase**: Apply ONE alteration at a time, verify frustration captures correctly
4. **Reset**: Clear alterations before testing next scenario

### Key Class 9 Considerations

1. **NO DIVISIONS**: Class 9 shows simply "9" - never "9.1", "9.2", etc.
2. **Packing Group Varies**: Only 5 of 19 scenarios have packing groups
3. **Magnetized Material**: Uses special label, NOT the CLASS 9 label
4. **POP Marking**: Only required for materials WITH assigned packing group
5. **Vehicles/Engines**: Exempt from labeling/marking when readily identifiable
6. **Consumer Commodities**: Use ID prefix, not UN

---

## Changelog

| Date | Author | Changes |
|------|--------|---------|
| 2026-01-21 | Claude | Initial comprehensive documentation covering A13.2 through A13.20 |
