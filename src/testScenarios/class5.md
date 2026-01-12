# Class 5.1 (Oxidizers) Test Scenarios

## Overview

This document contains 20 comprehensive manual test scenarios for the HazPro mobile app Inspector workflow, focusing on Division 5.1 (Oxidizers) materials. Each scenario is based on AFMAN 24-604 regulations (Attachments 9, 14, 15, and 17).

**Note:** Division 5.2 (Organic Peroxides) is excluded from these scenarios as those shipments are not being inspected.

### Purpose

These scenarios are designed for manual testing by physically running through the app. Each scenario includes:
- **Material Details**: UN number, PSN, hazard class, packing group, packaging paragraph, special provisions
- **Expected SDDG Inspection**: What a successful SDDG should contain (Keys 7, 11-17)
- **Expected Package Inspection**: Required labels, markings, and POP marking validation
- **Alterations**: Intentional errors to test frustration handling

### Class 5.1 Key Differences from Class 1

| Aspect | Class 1 (Explosives) | Class 5.1 (Oxidizers) |
|--------|---------------------|----------------------|
| Key 15 (Packing Group) | Empty | **REQUIRED** (I, II, or III) |
| EX Number | Required | Not applicable |
| NET Explosive Weight | Required in Key 16 | Not applicable |
| Compatibility Group | Required (A-S) | Not applicable |
| Packaging Paragraph | A5.xx | A9.5 (liquids), A9.6 (solids) |
| Label | EXPLOSIVE + division | OXIDIZER (5.1 in bottom corner) |

### Division 5.1 Label Specifications

| Element | Requirement |
|---------|-------------|
| Symbol | Flame over circle |
| Background | Yellow |
| Division Number | "5.1" in bottom corner |
| Text | "OXIDIZER" |

### POP Marking Packing Group Codes (per Attachment 14)

| Code | Authorized Packing Groups |
|------|---------------------------|
| X | PG I, II, and III |
| Y | PG II and III only |
| Z | PG III only |

**Validation Rule:** The POP marking PG code must be compatible with the material's packing group:
- PG I materials REQUIRE code X
- PG II materials require code X or Y
- PG III materials can use X, Y, or Z

### Key Validation Points

**SDDG Keys (per Attachment 17):**
- Key 7: Aircraft Limitations (CAO for P1-P4, Passenger and Cargo for P5)
- Key 11: UN Number (format: "UN####")
- Key 12: Proper Shipping Name (with technical name in parentheses for N.O.S.)
- Key 13: Class and Division ("5.1")
- Key 14: Subsidiary Hazard (6.1, 8, 4.1, 4.2, 4.3 if applicable)
- Key 15: Packing Group (I, II, or III) - **REQUIRED for 5.1**
- Key 16: Quantity and Type of Packing
- Key 17: Packaging Instructions (A9.5 or A9.6)

**Package Inspection:**
- OXIDIZER label with "5.1" division number
- Subsidiary hazard labels (TOXIC 6.1, CORROSIVE 8, etc. if Key 14 populated)
- Cargo Aircraft Only label (if P1-P4 special provision)
- UN number and PSN markings (12mm minimum height)
- Military Shipping Label (MSL)
- POP Marking with appropriate PG code

---

## Scenario 1: UN1491 - POTASSIUM PEROXIDE (PG I)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1491 |
| PSN | POTASSIUM PEROXIDE |
| Hazard Class | 5.1 |
| Packing Group | I |
| Subsidiary Risk | None |
| Packaging Paragraph | A9.6 |
| Special Provisions | P5, A20, N34 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" (P5 but PG I requires extra care) |
| Key 11 | "UN1491" |
| Key 12 | "POTASSIUM PEROXIDE" |
| Key 13 | "5.1" |
| Key 14 | Empty |
| Key 15 | "I" |
| Key 16 | Net quantity + packaging (e.g., "1 steel drum (1A2) x 25 kg") |
| Key 17 | "A9.6" |

### Expected Package Inspection (Successful)

**Labels Required:**
- OXIDIZER 5.1 (yellow, flame over circle, "5.1" in bottom corner)

**Markings Required:**
- UN1491
- PSN: "POTASSIUM PEROXIDE"
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Valid packaging code from A9.6 (drums: 1A2, 1B2, 1N2, 1H2; boxes: 4A, 4B, 4N)
- Packing group code: **X only** (PG I requires X)

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | POP marking shows packing group "Y" | PG validation (PG I requires X only) |
| 2 | Key 15 shows "II" instead of "I" | Packing group mismatch with material |
| 3 | Label shows "5" without ".1" division | Division number validation |

---

## Scenario 2: UN1504 - SODIUM PEROXIDE (PG I)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1504 |
| PSN | SODIUM PEROXIDE |
| Hazard Class | 5.1 |
| Packing Group | I |
| Subsidiary Risk | None |
| Packaging Paragraph | A9.6 |
| Special Provisions | P3, A20, N34 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" (P3 provision) |
| Key 11 | "UN1504" |
| Key 12 | "SODIUM PEROXIDE" |
| Key 13 | "5.1" |
| Key 14 | Empty |
| Key 15 | "I" |
| Key 16 | Net quantity + packaging |
| Key 17 | "A9.6" |

### Expected Package Inspection (Successful)

**Labels Required:**
- OXIDIZER 5.1
- CARGO AIRCRAFT ONLY (due to P3 provision)

**Markings Required:**
- UN1504
- PSN: "SODIUM PEROXIDE"
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Valid packaging code from A9.6
- Packing group code: **X only**

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Missing CARGO AIRCRAFT ONLY label | CAO label validation for P3 |
| 2 | Key 7 shows "Passenger and Cargo" | Aircraft limitation validation |
| 3 | POP marking shows code "Z" | PG code validation (I requires X) |

---

## Scenario 3: UN1873 - PERCHLORIC ACID (PG I with Subsidiary)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1873 |
| PSN | PERCHLORIC ACID |
| Details | with more than 50% but 72% or less acid, by mass |
| Hazard Class | 5.1 |
| Packing Group | I |
| Subsidiary Risk | 8 (Corrosive) |
| Packaging Paragraph | A9.5 |
| Special Provisions | P3, A2, N41 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" (P3 provision) |
| Key 11 | "UN1873" |
| Key 12 | "PERCHLORIC ACID with more than 50% but 72% or less acid, by mass" |
| Key 13 | "5.1" |
| Key 14 | "8" |
| Key 15 | "I" |
| Key 16 | Net quantity + packaging (e.g., "1 glass carboy (3D2) x 5 L") |
| Key 17 | "A9.5" |

### Expected Package Inspection (Successful)

**Labels Required:**
- OXIDIZER 5.1 (primary)
- CORROSIVE 8 (subsidiary)
- CARGO AIRCRAFT ONLY

**Markings Required:**
- UN1873
- PSN: "PERCHLORIC ACID with more than 50% but 72% or less acid, by mass"
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Valid packaging code from A9.5 (liquids)
- Packing group code: **X only**

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Missing CORROSIVE 8 subsidiary label | Subsidiary label validation |
| 2 | Key 14 shows empty instead of "8" | Subsidiary hazard documentation |
| 3 | Key 12 missing concentration details | PSN completeness validation |

---

## Scenario 4: UN2466 - POTASSIUM SUPEROXIDE (PG I)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN2466 |
| PSN | POTASSIUM SUPEROXIDE |
| Hazard Class | 5.1 |
| Packing Group | I |
| Subsidiary Risk | None |
| Packaging Paragraph | A9.6 |
| Special Provisions | P5, A20 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo" (P5 provision) |
| Key 11 | "UN2466" |
| Key 12 | "POTASSIUM SUPEROXIDE" |
| Key 13 | "5.1" |
| Key 14 | Empty |
| Key 15 | "I" |
| Key 16 | Net quantity + packaging |
| Key 17 | "A9.6" |

### Expected Package Inspection (Successful)

**Labels Required:**
- OXIDIZER 5.1

**Markings Required:**
- UN2466
- PSN: "POTASSIUM SUPEROXIDE"
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Valid packaging code from A9.6
- Packing group code: **X only**

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 15 empty (like Class 1) | PG required validation for 5.1 |
| 2 | UN number shows "UN2446" (transposition) | UN number accuracy |
| 3 | MSL missing from package | Military Shipping Label check |

---

## Scenario 5: UN3139 - OXIDIZING LIQUID, N.O.S. (PG I, Technical Name Required)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3139 |
| PSN | OXIDIZING LIQUID, N.O.S. |
| Technical Name | (Hydrogen Peroxide, Peracetic Acid) |
| Hazard Class | 5.1 |
| Packing Group | I |
| Subsidiary Risk | None |
| Packaging Paragraph | A9.5 |
| Special Provisions | P3, 62, 127, A2 |
| Technical Name Required | Yes |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" (P3 provision) |
| Key 11 | "UN3139" |
| Key 12 | "OXIDIZING LIQUID, N.O.S. (Hydrogen Peroxide, Peracetic Acid)" |
| Key 13 | "5.1" |
| Key 14 | Empty |
| Key 15 | "I" |
| Key 16 | Net quantity + packaging |
| Key 17 | "A9.5" |

### Expected Package Inspection (Successful)

**Labels Required:**
- OXIDIZER 5.1
- CARGO AIRCRAFT ONLY

**Markings Required:**
- UN3139
- PSN: "OXIDIZING LIQUID, N.O.S. (Hydrogen Peroxide, Peracetic Acid)"
- Technical name in parentheses
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Valid packaging code from A9.5 (liquids)
- Packing group code: **X only**

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 12 missing technical name "(Hydrogen Peroxide, Peracetic Acid)" | Technical name requirement for N.O.S. |
| 2 | Package PSN marking missing technical name | Package marking completeness |
| 3 | Key 17 shows "A9.6" (solids) instead of "A9.5" (liquids) | Packaging paragraph validation |

---

## Scenario 6: UN1745 - BROMINE PENTAFLUORIDE (PG I, Multiple Subsidiaries)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1745 |
| PSN | BROMINE PENTAFLUORIDE |
| Hazard Class | 5.1 |
| Packing Group | I |
| Subsidiary Risk | 6.1, 8 |
| Packaging Paragraph | A9.9 |
| Special Provisions | P1, 1 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" (P1 provision) |
| Key 11 | "UN1745" |
| Key 12 | "BROMINE PENTAFLUORIDE" |
| Key 13 | "5.1" |
| Key 14 | "6.1, 8" |
| Key 15 | "I" |
| Key 16 | Net quantity + packaging |
| Key 17 | "A9.9" |

### Expected Package Inspection (Successful)

**Labels Required:**
- OXIDIZER 5.1 (primary)
- TOXIC 6.1 (subsidiary)
- CORROSIVE 8 (subsidiary)
- CARGO AIRCRAFT ONLY

**Markings Required:**
- UN1745
- PSN: "BROMINE PENTAFLUORIDE"
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Valid packaging code from A9.9
- Packing group code: **X only**

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Only one subsidiary label (missing CORROSIVE) | Multiple subsidiary label validation |
| 2 | Key 14 shows "6.1" only, missing "8" | Subsidiary documentation completeness |
| 3 | Missing CARGO AIRCRAFT ONLY label | P1 CAO requirement |

---

## Scenario 7: UN1439 - AMMONIUM DICHROMATE (PG II)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1439 |
| PSN | AMMONIUM DICHROMATE |
| Hazard Class | 5.1 |
| Packing Group | II |
| Subsidiary Risk | None |
| Packaging Paragraph | A9.6 |
| Special Provisions | P5 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo" (P5 provision) |
| Key 11 | "UN1439" |
| Key 12 | "AMMONIUM DICHROMATE" |
| Key 13 | "5.1" |
| Key 14 | Empty |
| Key 15 | "II" |
| Key 16 | Net quantity + packaging (e.g., "2 fiberboard boxes (4G) x 10 kg") |
| Key 17 | "A9.6" |

### Expected Package Inspection (Successful)

**Labels Required:**
- OXIDIZER 5.1

**Markings Required:**
- UN1439
- PSN: "AMMONIUM DICHROMATE"
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Valid packaging code from A9.6
- Packing group code: **X or Y** (PG II allows X or Y)

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | POP marking shows code "Z" | PG code validation (II requires X or Y) |
| 2 | Key 13 shows "5" without ".1" | Division validation |
| 3 | PSN spelled "AMMONIUM DICHROMATE" vs marking shows abbreviated | PSN accuracy |

---

## Scenario 8: UN1442 - AMMONIUM PERCHLORATE (PG II)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1442 |
| PSN | AMMONIUM PERCHLORATE |
| Hazard Class | 5.1 |
| Packing Group | II |
| Subsidiary Risk | None |
| Packaging Paragraph | A9.6 |
| Special Provisions | P5, 107, A9 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo" (P5 provision) |
| Key 11 | "UN1442" |
| Key 12 | "AMMONIUM PERCHLORATE" |
| Key 13 | "5.1" |
| Key 14 | Empty |
| Key 15 | "II" |
| Key 16 | Net quantity + packaging |
| Key 17 | "A9.6" |

### Expected Package Inspection (Successful)

**Labels Required:**
- OXIDIZER 5.1

**Markings Required:**
- UN1442
- PSN: "AMMONIUM PERCHLORATE"
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Valid packaging code from A9.6
- Packing group code: **X or Y**

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | UN number on package shows "UN1443" | UN number match validation |
| 2 | Key 15 shows "III" instead of "II" | Packing group accuracy |
| 3 | Label background is white instead of yellow | Label color validation |

---

## Scenario 9: UN1446 - BARIUM NITRATE (PG II with 6.1 Subsidiary)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1446 |
| PSN | BARIUM NITRATE |
| Hazard Class | 5.1 |
| Packing Group | II |
| Subsidiary Risk | 6.1 (Toxic) |
| Packaging Paragraph | A9.6 |
| Special Provisions | P5 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo" (P5 provision) |
| Key 11 | "UN1446" |
| Key 12 | "BARIUM NITRATE" |
| Key 13 | "5.1" |
| Key 14 | "6.1" |
| Key 15 | "II" |
| Key 16 | Net quantity + packaging |
| Key 17 | "A9.6" |

### Expected Package Inspection (Successful)

**Labels Required:**
- OXIDIZER 5.1 (primary)
- TOXIC 6.1 (subsidiary)

**Markings Required:**
- UN1446
- PSN: "BARIUM NITRATE"
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Valid packaging code from A9.6
- Packing group code: **X or Y**

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Missing TOXIC 6.1 subsidiary label | Subsidiary label requirement |
| 2 | Key 14 empty despite material having subsidiary | SDDG Key 14 validation |
| 3 | POP marking PG code shows "Z" | PG code validation |

---

## Scenario 10: UN2719 - BARIUM BROMATE (PG II with 6.1 Subsidiary)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN2719 |
| PSN | BARIUM BROMATE |
| Hazard Class | 5.1 |
| Packing Group | II |
| Subsidiary Risk | 6.1 (Toxic) |
| Packaging Paragraph | A9.6 |
| Special Provisions | P4 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" (P4 provision) |
| Key 11 | "UN2719" |
| Key 12 | "BARIUM BROMATE" |
| Key 13 | "5.1" |
| Key 14 | "6.1" |
| Key 15 | "II" |
| Key 16 | Net quantity + packaging |
| Key 17 | "A9.6" |

### Expected Package Inspection (Successful)

**Labels Required:**
- OXIDIZER 5.1 (primary)
- TOXIC 6.1 (subsidiary)
- CARGO AIRCRAFT ONLY (P4 provision)

**Markings Required:**
- UN2719
- PSN: "BARIUM BROMATE"
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Valid packaging code from A9.6
- Packing group code: **X or Y**

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 7 shows "Passenger and Cargo" | Aircraft limitation validation for P4 |
| 2 | Missing CARGO AIRCRAFT ONLY label | CAO label requirement |
| 3 | Key 15 shows "I" instead of "II" | Packing group validation |

---

## Scenario 11: UN1450 - BROMATES, INORGANIC, N.O.S. (PG II, Technical Name Required)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1450 |
| PSN | BROMATES, INORGANIC, N.O.S. |
| Technical Name | (Magnesium Bromate) |
| Hazard Class | 5.1 |
| Packing Group | II |
| Subsidiary Risk | None |
| Packaging Paragraph | A9.6 |
| Special Provisions | P5 |
| Technical Name Required | Yes |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo" (P5 provision) |
| Key 11 | "UN1450" |
| Key 12 | "BROMATES, INORGANIC, N.O.S. (Magnesium Bromate)" |
| Key 13 | "5.1" |
| Key 14 | Empty |
| Key 15 | "II" |
| Key 16 | Net quantity + packaging |
| Key 17 | "A9.6" |

### Expected Package Inspection (Successful)

**Labels Required:**
- OXIDIZER 5.1

**Markings Required:**
- UN1450
- PSN: "BROMATES, INORGANIC, N.O.S. (Magnesium Bromate)"
- Technical name in parentheses
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Valid packaging code from A9.6
- Packing group code: **X or Y**

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 12 shows "BROMATES, INORGANIC, N.O.S." without technical name | Technical name requirement |
| 2 | Package marking missing technical name | Marking completeness for N.O.S. |
| 3 | Technical name format wrong - no parentheses | Technical name format validation |

---

## Scenario 12: UN3212 - HYPOCHLORITES, INORGANIC, N.O.S. (PG II, Technical Name Required)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3212 |
| PSN | HYPOCHLORITES, INORGANIC, N.O.S. |
| Technical Name | (Lithium Hypochlorite) |
| Hazard Class | 5.1 |
| Packing Group | II |
| Subsidiary Risk | None |
| Packaging Paragraph | A9.6 |
| Special Provisions | P5, 349, A9 |
| Technical Name Required | Yes |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo" (P5 provision) |
| Key 11 | "UN3212" |
| Key 12 | "HYPOCHLORITES, INORGANIC, N.O.S. (Lithium Hypochlorite)" |
| Key 13 | "5.1" |
| Key 14 | Empty |
| Key 15 | "II" |
| Key 16 | Net quantity + packaging |
| Key 17 | "A9.6" |

### Expected Package Inspection (Successful)

**Labels Required:**
- OXIDIZER 5.1

**Markings Required:**
- UN3212
- PSN: "HYPOCHLORITES, INORGANIC, N.O.S. (Lithium Hypochlorite)"
- Technical name in parentheses
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Valid packaging code from A9.6
- Packing group code: **X or Y**

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 12 has technical name but package marking doesn't | SDDG vs package consistency |
| 2 | UN number shows "UN3112" (digit transposition) | UN number validation |
| 3 | Key 17 shows "A9.5" instead of "A9.6" | Packaging paragraph validation (solid vs liquid) |

---

## Scenario 13: UN3405 - BARIUM CHLORATE SOLUTION (PG II Liquid with 6.1 Subsidiary)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3405 |
| PSN | BARIUM CHLORATE SOLUTION |
| Hazard Class | 5.1 |
| Packing Group | II |
| Subsidiary Risk | 6.1 (Toxic) |
| Packaging Paragraph | A9.5 |
| Special Provisions | P4, A9, N34 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" (P4 provision) |
| Key 11 | "UN3405" |
| Key 12 | "BARIUM CHLORATE SOLUTION" |
| Key 13 | "5.1" |
| Key 14 | "6.1" |
| Key 15 | "II" |
| Key 16 | Net quantity + packaging (e.g., "1 plastic jerrican (3H1) x 10 L") |
| Key 17 | "A9.5" |

### Expected Package Inspection (Successful)

**Labels Required:**
- OXIDIZER 5.1 (primary)
- TOXIC 6.1 (subsidiary)
- CARGO AIRCRAFT ONLY (P4 provision)

**Markings Required:**
- UN3405
- PSN: "BARIUM CHLORATE SOLUTION"
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Valid packaging code from A9.5 (liquids - jerricans, drums, composite)
- Packing group code: **X or Y**

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 17 shows "A9.6" (solids) instead of "A9.5" (liquids) | Packaging paragraph for liquid |
| 2 | POP marking shows solid container code from A9.6 | Container type validation |
| 3 | Missing TOXIC 6.1 subsidiary label | Subsidiary label check |

---

## Scenario 14: UN1479 - OXIDIZING SOLID, N.O.S. (PG II, Technical Name Required)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1479 |
| PSN | OXIDIZING SOLID, N.O.S. |
| Technical Name | (Calcium Hypochlorite) |
| Hazard Class | 5.1 |
| Packing Group | II |
| Subsidiary Risk | None |
| Packaging Paragraph | A9.6 |
| Special Provisions | P5, 62 |
| Technical Name Required | Yes |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo" (P5 provision) |
| Key 11 | "UN1479" |
| Key 12 | "OXIDIZING SOLID, N.O.S. (Calcium Hypochlorite)" |
| Key 13 | "5.1" |
| Key 14 | Empty |
| Key 15 | "II" |
| Key 16 | Net quantity + packaging |
| Key 17 | "A9.6" |

### Expected Package Inspection (Successful)

**Labels Required:**
- OXIDIZER 5.1

**Markings Required:**
- UN1479
- PSN: "OXIDIZING SOLID, N.O.S. (Calcium Hypochlorite)"
- Technical name in parentheses
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Valid packaging code from A9.6
- Packing group code: **X or Y**

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 12 missing technical name | N.O.S. technical name requirement |
| 2 | Key 15 empty | Packing group required for 5.1 |
| 3 | Technical name on package but not on SDDG | Consistency validation |

---

## Scenario 15: UN2627 - NITRITES, INORGANIC, N.O.S. (PG II, Technical Name Required)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN2627 |
| PSN | NITRITES, INORGANIC, N.O.S. |
| Technical Name | (Sodium Nitrite) |
| Hazard Class | 5.1 |
| Packing Group | II |
| Subsidiary Risk | None |
| Packaging Paragraph | A9.6 |
| Special Provisions | P5, 33 |
| Technical Name Required | Yes |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo" (P5 provision) |
| Key 11 | "UN2627" |
| Key 12 | "NITRITES, INORGANIC, N.O.S. (Sodium Nitrite)" |
| Key 13 | "5.1" |
| Key 14 | Empty |
| Key 15 | "II" |
| Key 16 | Net quantity + packaging |
| Key 17 | "A9.6" |

### Expected Package Inspection (Successful)

**Labels Required:**
- OXIDIZER 5.1

**Markings Required:**
- UN2627
- PSN: "NITRITES, INORGANIC, N.O.S. (Sodium Nitrite)"
- Technical name in parentheses
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Valid packaging code from A9.6
- Packing group code: **X or Y**

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Package marking shows "NITRITES, INORGANIC" without "N.O.S." | PSN completeness |
| 2 | Key 12 shows technical name without parentheses | Technical name format |
| 3 | MSL missing from package | Military Shipping Label validation |

---

## Scenario 16: UN1438 - ALUMINIUM NITRATE (PG III)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1438 |
| PSN | ALUMINIUM NITRATE |
| Hazard Class | 5.1 |
| Packing Group | III |
| Subsidiary Risk | None |
| Packaging Paragraph | A9.6 |
| Special Provisions | P5, A1, A29 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo" (P5 provision) |
| Key 11 | "UN1438" |
| Key 12 | "ALUMINIUM NITRATE" |
| Key 13 | "5.1" |
| Key 14 | Empty |
| Key 15 | "III" |
| Key 16 | Net quantity + packaging (e.g., "4 fiberboard boxes (4G) x 25 kg") |
| Key 17 | "A9.6" |

### Expected Package Inspection (Successful)

**Labels Required:**
- OXIDIZER 5.1

**Markings Required:**
- UN1438
- PSN: "ALUMINIUM NITRATE"
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Valid packaging code from A9.6
- Packing group code: **X, Y, or Z** (PG III allows all codes)

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 15 shows "II" instead of "III" | Packing group accuracy |
| 2 | PSN spelled "ALUMINUM NITRATE" (American spelling) vs "ALUMINIUM" | PSN spelling validation |
| 3 | Label missing "5.1" division number | Division number on label |

---

## Scenario 17: UN1942 - AMMONIUM NITRATE (PG III)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1942 |
| PSN | AMMONIUM NITRATE |
| Details | with 0.2% or less total combustible material |
| Hazard Class | 5.1 |
| Packing Group | III |
| Subsidiary Risk | None |
| Packaging Paragraph | A9.6 |
| Special Provisions | P5, A1, A29 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo" (P5 provision) |
| Key 11 | "UN1942" |
| Key 12 | "AMMONIUM NITRATE with 0.2% or less total combustible material, including any organic substance calculated as carbon, to the exclusion of any other added substance" |
| Key 13 | "5.1" |
| Key 14 | Empty |
| Key 15 | "III" |
| Key 16 | Net quantity + packaging |
| Key 17 | "A9.6" |

### Expected Package Inspection (Successful)

**Labels Required:**
- OXIDIZER 5.1

**Markings Required:**
- UN1942
- PSN: "AMMONIUM NITRATE" (full description required)
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Valid packaging code from A9.6
- Packing group code: **X, Y, or Z**

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 12 shows only "AMMONIUM NITRATE" without concentration details | PSN completeness for specific UN |
| 2 | UN number shows "UN1492" (similar number) | UN number accuracy |
| 3 | Key 13 shows "5" without ".1" | Class/division completeness |

---

## Scenario 18: UN2067 - AMMONIUM NITRATE BASED FERTILIZER (PG III)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN2067 |
| PSN | AMMONIUM NITRATE BASED FERTILIZER |
| Hazard Class | 5.1 |
| Packing Group | III |
| Subsidiary Risk | None |
| Packaging Paragraph | A9.6 |
| Special Provisions | P5 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo" (P5 provision) |
| Key 11 | "UN2067" |
| Key 12 | "AMMONIUM NITRATE BASED FERTILIZER" |
| Key 13 | "5.1" |
| Key 14 | Empty |
| Key 15 | "III" |
| Key 16 | Net quantity + packaging |
| Key 17 | "A9.6" |

### Expected Package Inspection (Successful)

**Labels Required:**
- OXIDIZER 5.1

**Markings Required:**
- UN2067
- PSN: "AMMONIUM NITRATE BASED FERTILIZER"
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Valid packaging code from A9.6
- Packing group code: **X, Y, or Z**

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | PSN shows "AMMONIUM NITRATE FERTILIZER" (missing "BASED") | PSN accuracy |
| 2 | Key 15 empty | Packing group required for 5.1 |
| 3 | POP marking missing from package | POP marking presence validation |

---

## Scenario 19: UN1444 - AMMONIUM PERSULPHATE (PG III)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1444 |
| PSN | AMMONIUM PERSULPHATE |
| Hazard Class | 5.1 |
| Packing Group | III |
| Subsidiary Risk | None |
| Packaging Paragraph | A9.6 |
| Special Provisions | P5, A1, A29 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo" (P5 provision) |
| Key 11 | "UN1444" |
| Key 12 | "AMMONIUM PERSULPHATE" |
| Key 13 | "5.1" |
| Key 14 | Empty |
| Key 15 | "III" |
| Key 16 | Net quantity + packaging |
| Key 17 | "A9.6" |

### Expected Package Inspection (Successful)

**Labels Required:**
- OXIDIZER 5.1

**Markings Required:**
- UN1444
- PSN: "AMMONIUM PERSULPHATE"
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Valid packaging code from A9.6
- Packing group code: **X, Y, or Z**

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | PSN spelled "AMMONIUM PERSULFATE" (American spelling) | Spelling validation |
| 2 | Label shows generic hazard symbol without "5.1" | Label completeness |
| 3 | Key 7 shows "Cargo Aircraft Only" for P5 material | Aircraft type validation |

---

## Scenario 20: UN3219 - NITRITES, INORGANIC, AQUEOUS SOLUTION, N.O.S. (PG III Liquid, Technical Name Required)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3219 |
| PSN | NITRITES, INORGANIC, AQUEOUS SOLUTION, N.O.S. |
| Technical Name | (Potassium Nitrite) |
| Hazard Class | 5.1 |
| Packing Group | III |
| Subsidiary Risk | None |
| Packaging Paragraph | A9.5 |
| Special Provisions | P5 |
| Technical Name Required | Yes |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo" (P5 provision) |
| Key 11 | "UN3219" |
| Key 12 | "NITRITES, INORGANIC, AQUEOUS SOLUTION, N.O.S. (Potassium Nitrite)" |
| Key 13 | "5.1" |
| Key 14 | Empty |
| Key 15 | "III" |
| Key 16 | Net quantity + packaging (e.g., "2 plastic jerricans (3H1) x 20 L") |
| Key 17 | "A9.5" |

### Expected Package Inspection (Successful)

**Labels Required:**
- OXIDIZER 5.1

**Markings Required:**
- UN3219
- PSN: "NITRITES, INORGANIC, AQUEOUS SOLUTION, N.O.S. (Potassium Nitrite)"
- Technical name in parentheses
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Valid packaging code from A9.5 (liquids)
- Packing group code: **X, Y, or Z**

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 12 missing technical name "(Potassium Nitrite)" | N.O.S. technical name requirement |
| 2 | Key 17 shows "A9.6" (solids) instead of "A9.5" (liquids) | Liquid packaging validation |
| 3 | Package marking shows "NITRITES, INORGANIC, N.O.S." without "AQUEOUS SOLUTION" | PSN completeness |

---

## Quick Reference Tables

### Scenario Coverage Summary

| Scenario | UN Number | PSN | PG | Subsidiary | Type | N.O.S. |
|----------|-----------|-----|-----|------------|------|--------|
| 1 | UN1491 | POTASSIUM PEROXIDE | I | None | Solid | No |
| 2 | UN1504 | SODIUM PEROXIDE | I | None | Solid | No |
| 3 | UN1873 | PERCHLORIC ACID | I | 8 | Liquid | No |
| 4 | UN2466 | POTASSIUM SUPEROXIDE | I | None | Solid | No |
| 5 | UN3139 | OXIDIZING LIQUID, N.O.S. | I | None | Liquid | **Yes** |
| 6 | UN1745 | BROMINE PENTAFLUORIDE | I | 6.1, 8 | Liquid | No |
| 7 | UN1439 | AMMONIUM DICHROMATE | II | None | Solid | No |
| 8 | UN1442 | AMMONIUM PERCHLORATE | II | None | Solid | No |
| 9 | UN1446 | BARIUM NITRATE | II | 6.1 | Solid | No |
| 10 | UN2719 | BARIUM BROMATE | II | 6.1 | Solid | No |
| 11 | UN1450 | BROMATES, INORGANIC, N.O.S. | II | None | Solid | **Yes** |
| 12 | UN3212 | HYPOCHLORITES, INORGANIC, N.O.S. | II | None | Solid | **Yes** |
| 13 | UN3405 | BARIUM CHLORATE SOLUTION | II | 6.1 | Liquid | No |
| 14 | UN1479 | OXIDIZING SOLID, N.O.S. | II | None | Solid | **Yes** |
| 15 | UN2627 | NITRITES, INORGANIC, N.O.S. | II | None | Solid | **Yes** |
| 16 | UN1438 | ALUMINIUM NITRATE | III | None | Solid | No |
| 17 | UN1942 | AMMONIUM NITRATE | III | None | Solid | No |
| 18 | UN2067 | AMMONIUM NITRATE BASED FERTILIZER | III | None | Solid | No |
| 19 | UN1444 | AMMONIUM PERSULPHATE | III | None | Solid | No |
| 20 | UN3219 | NITRITES, INORGANIC, AQUEOUS SOLUTION, N.O.S. | III | None | Liquid | **Yes** |

### Distribution by Packing Group

| Packing Group | Scenarios | Count |
|---------------|-----------|-------|
| I | 1, 2, 3, 4, 5, 6 | 6 |
| II | 7, 8, 9, 10, 11, 12, 13, 14, 15 | 9 |
| III | 16, 17, 18, 19, 20 | 5 |

### Distribution by Subsidiary Risk

| Subsidiary | Scenarios | Count |
|------------|-----------|-------|
| None | 1, 2, 4, 5, 7, 8, 11, 12, 14, 15, 16, 17, 18, 19, 20 | 15 |
| 6.1 (Toxic) | 9, 10, 13 | 3 |
| 8 (Corrosive) | 3 | 1 |
| 6.1, 8 (Multiple) | 6 | 1 |

### Distribution by N.O.S. (Technical Name Required)

| Type | Scenarios | Count |
|------|-----------|-------|
| N.O.S. (tech name required) | 5, 11, 12, 14, 15, 20 | 6 |
| Named material | 1, 2, 3, 4, 6, 7, 8, 9, 10, 13, 16, 17, 18, 19 | 14 |

### Distribution by Physical State

| State | Packaging Paragraph | Scenarios | Count |
|-------|---------------------|-----------|-------|
| Solid | A9.6 | 1, 2, 4, 7, 8, 9, 10, 11, 12, 14, 15, 16, 17, 18, 19 | 15 |
| Liquid | A9.5 | 3, 5, 13, 20 | 4 |
| Special | A9.9 | 6 | 1 |

### Alteration Types Tested

| Alteration Category | Scenarios |
|--------------------|-----------|
| POP Marking PG Code | 1, 2, 3, 9 |
| Key 15 Packing Group | 4, 10, 14, 18 |
| Division/Class Format | 1, 7, 8, 16, 17 |
| Subsidiary Label Missing | 3, 6, 9, 13 |
| CAO Label/Aircraft Type | 2, 6, 10, 19 |
| Technical Name Missing | 5, 11, 12, 14, 15, 20 |
| UN Number Error | 4, 8, 12, 17 |
| PSN Completeness/Accuracy | 3, 11, 15, 16, 17, 18, 20 |
| MSL Missing | 4, 15 |
| Packaging Paragraph | 5, 12, 13, 20 |

---

## Test Execution Notes

### Prerequisites

1. Ensure the app has the following Class 5.1 materials loaded from the hazardous materials list
2. Verify the SDDG parser can handle all SDDG keys (7, 11-17)
3. Confirm ML detection is trained for OXIDIZER labels
4. Validate POP marking parser can extract PG codes (X, Y, Z)

### Key Differences from Class 1 Testing

1. **Key 15 is REQUIRED** - Unlike Class 1 where Key 15 is empty, Class 5.1 must have a packing group
2. **No EX Number** - Class 5.1 materials do not have EX numbers
3. **No NET Explosive Weight** - Key 16 does not include NEW for oxidizers
4. **No Compatibility Group** - Labels show "5.1" not a compatibility group letter
5. **PG Code Validation** - Must validate POP marking code matches material's packing group

### Testing Flow

1. **SDDG Upload**: Upload SDDG with material data
2. **SDDG Validation**: Verify all keys are correctly parsed and validated
3. **Package Inspection**: Scan/photograph package
4. **ML Detection**: Verify OXIDIZER label is detected
5. **POP Marking**: Validate packaging code and PG code
6. **Subsidiary Labels**: Check for required subsidiary labels
7. **Markings**: Verify UN number and PSN match SDDG
8. **MSL**: Confirm Military Shipping Label presence
9. **Frustration Testing**: Apply alterations and verify errors are caught

### Common Validation Failures to Test

1. PG I material with POP code Y or Z (should fail)
2. PG II material with POP code Z (should fail)
3. Missing technical name for N.O.S. entries
4. Empty Key 15 (packing group required for 5.1)
5. Missing subsidiary labels when Key 14 is populated
6. Liquid material with A9.6 (solids) packaging paragraph
7. CAO label missing for P1-P4 materials
