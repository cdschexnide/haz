# Class 3 (Flammable Liquids) Test Scenarios

## Overview

This document contains 20 comprehensive manual test scenarios for the HazPro mobile app Inspector workflow, focusing on Class 3 (Flammable Liquids) materials. Each scenario is based on AFMAN 24-604 regulations (Attachments 7, 14, 15, and 17).

### Purpose

These scenarios are designed for manual testing by physically running through the app. Each scenario includes:
- **Material Details**: UN number, PSN, hazard class, packing group, packaging paragraph, special provisions
- **Expected SDDG Inspection**: What a successful SDDG should contain (Keys 7, 11-17)
- **Expected Package Inspection**: Required labels, markings, and POP marking validation
- **Alterations**: Intentional errors to test frustration handling

### Class 3 Packing Group Reference

| Packing Group | Flash Point | Boiling Point | Aircraft Limitation |
|---------------|-------------|---------------|---------------------|
| I | - | ≤35°C (95°F) | P1-P3 (CAO only) |
| II | <23°C (73°F) | >35°C (95°F) | P4-P5 |
| III | ≥23°C but ≤60°C | >35°C (95°F) | P5 |

### Key Validation Points

**SDDG Keys (per Attachment 17):**
- Key 7: Aircraft Limitations (CAO vs Passenger and Cargo)
- Key 11: UN/NA/ID Number (with RQ prefix if applicable)
- Key 12: Proper Shipping Name (with technical name for N.O.S.)
- Key 13: Class (just "3" - no divisions or compatibility groups)
- Key 14: Subsidiary Hazard (if applicable: 6.1, 8)
- Key 15: Packing Group (ALWAYS required for Class 3: I, II, or III)
- Key 16: Quantity and Type of Packing
- Key 17: Packaging Instructions (A7.xx paragraph)

**Package Inspection:**
- FLAMMABLE LIQUID label (Class 3 primary hazard)
- Subsidiary hazard labels (if Key 14 populated: TOXIC for 6.1, CORROSIVE for 8)
- Cargo Aircraft Only label (if P1-P4 or CAO aircraft type)
- Orientation labels (for liquid combination packaging)
- UN number and PSN markings (12mm minimum height)
- Military Shipping Label (MSL)
- POP Marking with appropriate PG code (X, Y, or Z)

**POP Marking Packing Group Codes:**
| Code | Authorized Packing Groups | Materials |
|------|---------------------------|-----------|
| X | I, II, III | All Class 3 |
| Y | II, III | PG II and III only |
| Z | III | PG III only |

---

## Scenario 1: UN1089 - ACETALDEHYDE

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1089 |
| PSN | ACETALDEHYDE |
| Hazard Class | 3 |
| Packing Group | I |
| Packaging Paragraph | A7.2 |
| Special Provisions | P3 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" (PG I with P3 is CAO only) |
| Key 11 | "UN1089" |
| Key 12 | "ACETALDEHYDE" |
| Key 13 | "3" |
| Key 14 | Empty (no subsidiary risk) |
| Key 15 | "I" |
| Key 16 | Net quantity + packaging (e.g., "2 steel drums x 20 L") |
| Key 17 | "A7.2" |

### Expected Package Inspection (Successful)

**Labels Required:**
- FLAMMABLE LIQUID (Class 3)
- Cargo Aircraft Only

**Markings Required:**
- UN1089
- PSN: "ACETALDEHYDE" (12mm minimum height)
- Orientation arrows (two opposite sides for combination packaging)
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Valid packaging codes per A7.2:
  - Combination: Inner max 1L (PG I), outer drums (1A1, 1A2, 1B1, 1B2, 1N1, 1N2, 1H1, 1H2) or boxes (4A, 4B, 4C1, 4C2, 4D, 4F, 4G, 4H1, 4H2)
  - Single: Drums (1A1, 1B1, 1N1, 1H1), jerricans (3A1, 3B1, 3H1)
- Packing group code: X (required for PG I)

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | POP marking shows packing group "Y" | PG validation (PG I requires X only) |
| 2 | Key 15 shows "II" instead of "I" | Packing group match validation |
| 3 | Missing orientation arrows on package | Orientation marking validation for liquids |

---

## Scenario 2: UN1093 - ACRYLONITRILE, STABILIZED

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1093 |
| PSN | ACRYLONITRILE, STABILIZED |
| Hazard Class | 3 |
| Subsidiary Risk | 6.1 |
| Packing Group | I |
| Packaging Paragraph | A7.2 |
| Special Provisions | P3 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" |
| Key 11 | "UN1093" |
| Key 12 | "ACRYLONITRILE, STABILIZED" |
| Key 13 | "3" |
| Key 14 | "6.1" |
| Key 15 | "I" |
| Key 16 | Net quantity + packaging |
| Key 17 | "A7.2" |

### Expected Package Inspection (Successful)

**Labels Required:**
- FLAMMABLE LIQUID (Class 3) - primary
- TOXIC (Class 6.1) - subsidiary
- Cargo Aircraft Only

**Markings Required:**
- UN1093
- PSN: "ACRYLONITRILE, STABILIZED"
- Orientation arrows
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Per A7.2 (PG I combination or single packaging)
- Packing group code: X

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Missing TOXIC subsidiary label | Subsidiary hazard label validation |
| 2 | Key 14 empty (missing subsidiary risk) | SDDG subsidiary risk completeness |
| 3 | Label shows POISON instead of TOXIC | Label terminology validation |

---

## Scenario 3: UN3165 - AIRCRAFT HYDRAULIC POWER UNIT FUEL TANK

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3165 |
| PSN | AIRCRAFT HYDRAULIC POWER UNIT FUEL TANK |
| Details | containing a mixture of anhydrous hydrazine and monomethyl hydrazine; M86 fuel |
| Hazard Class | 3 |
| Subsidiary Risk | 6.1, 8 |
| Packing Group | I |
| Packaging Paragraph | A7.4 |
| Special Provisions | P3, A501 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" |
| Key 11 | "UN3165" |
| Key 12 | "AIRCRAFT HYDRAULIC POWER UNIT FUEL TANK" |
| Key 13 | "3" |
| Key 14 | "6.1, 8" |
| Key 15 | "I" |
| Key 16 | Net quantity + packaging |
| Key 17 | "A7.4" |

### Expected Package Inspection (Successful)

**Labels Required:**
- FLAMMABLE LIQUID (Class 3) - primary
- TOXIC (Class 6.1) - first subsidiary
- CORROSIVE (Class 8) - second subsidiary
- Cargo Aircraft Only

**Markings Required:**
- UN3165
- PSN: "AIRCRAFT HYDRAULIC POWER UNIT FUEL TANK"
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Per A7.4 (specialized packaging for fuel tanks)
- Packing group code: X

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Missing CORROSIVE label (only TOXIC shown) | Multiple subsidiary labels validation |
| 2 | Key 14 shows only "6.1" (missing 8) | Complete subsidiary risk validation |
| 3 | Key 17 shows "A7.2" instead of "A7.4" | Packaging paragraph match validation |

---

## Scenario 4: UN1991 - CHLOROPRENE, STABILIZED

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1991 |
| PSN | CHLOROPRENE, STABILIZED |
| Hazard Class | 3 |
| Subsidiary Risk | 6.1 |
| Packing Group | I |
| Packaging Paragraph | A7.2 |
| Special Provisions | P3, 387 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" |
| Key 11 | "UN1991" |
| Key 12 | "CHLOROPRENE, STABILIZED" |
| Key 13 | "3" |
| Key 14 | "6.1" |
| Key 15 | "I" |
| Key 16 | Net quantity + packaging |
| Key 17 | "A7.2" |

### Expected Package Inspection (Successful)

**Labels Required:**
- FLAMMABLE LIQUID (Class 3) - primary
- TOXIC (Class 6.1) - subsidiary
- Cargo Aircraft Only

**Markings Required:**
- UN1991
- PSN: "CHLOROPRENE, STABILIZED"
- Orientation arrows
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Per A7.2
- Packing group code: X

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | PSN shows "CHLOROPRENE" without "STABILIZED" | PSN completeness validation |
| 2 | POP marking code "Z" | Packing group code validation (PG I needs X) |
| 3 | Aircraft type shows "Passenger and Cargo" | Aircraft limitation validation (P3 = CAO) |

---

## Scenario 5: UN1090 - ACETONE

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1090 |
| PSN | ACETONE |
| Hazard Class | 3 |
| Packing Group | II |
| Packaging Paragraph | A7.2 |
| Special Provisions | P5 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo" (P5 allows passenger aircraft) |
| Key 11 | "UN1090" |
| Key 12 | "ACETONE" |
| Key 13 | "3" |
| Key 14 | Empty |
| Key 15 | "II" |
| Key 16 | Net quantity + packaging (e.g., "4 fiberboard boxes x 5 L") |
| Key 17 | "A7.2" |

### Expected Package Inspection (Successful)

**Labels Required:**
- FLAMMABLE LIQUID (Class 3)

**Markings Required:**
- UN1090
- PSN: "ACETONE"
- Orientation arrows (for combination packaging)
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Per A7.2 (PG II combination: inner max 2.5L, or single packaging)
- Packing group code: X or Y

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | POP marking shows "Z" | PG code validation (PG II needs X or Y) |
| 2 | UN number on package shows "UN1091" | UN number match with SDDG Key 11 |
| 3 | Missing FLAMMABLE LIQUID label | Primary hazard label validation |

---

## Scenario 6: UN1114 - BENZENE

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1114 |
| PSN | BENZENE |
| Hazard Class | 3 |
| Packing Group | II |
| Packaging Paragraph | A7.2 |
| Special Provisions | P5 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo" |
| Key 11 | "UN1114" |
| Key 12 | "BENZENE" |
| Key 13 | "3" |
| Key 14 | Empty |
| Key 15 | "II" |
| Key 16 | Net quantity + packaging |
| Key 17 | "A7.2" |

### Expected Package Inspection (Successful)

**Labels Required:**
- FLAMMABLE LIQUID (Class 3)

**Markings Required:**
- UN1114
- PSN: "BENZENE"
- Orientation arrows
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Per A7.2
- Packing group code: X or Y

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 15 empty (missing packing group) | Packing group required validation (Class 3 always needs PG) |
| 2 | PSN marking less than 12mm height | PSN marking size validation |
| 3 | Orientation arrows on only one side | Orientation marking placement (needs two opposite sides) |

---

## Scenario 7: UN1987 - ALCOHOLS, N.O.S. (Technical Name Required)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1987 |
| PSN | ALCOHOLS, N.O.S. |
| Technical Name Required | Yes |
| Hazard Class | 3 |
| Packing Group | II |
| Packaging Paragraph | A7.2 |
| Special Provisions | P5 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo" |
| Key 11 | "UN1987" |
| Key 12 | "ALCOHOLS, N.O.S. (contains ethanol, methanol)" - technical name in parentheses |
| Key 13 | "3" |
| Key 14 | Empty |
| Key 15 | "II" |
| Key 16 | Net quantity + packaging |
| Key 17 | "A7.2" |

### Expected Package Inspection (Successful)

**Labels Required:**
- FLAMMABLE LIQUID (Class 3)

**Markings Required:**
- UN1987
- PSN: "ALCOHOLS, N.O.S." with technical name "(contains ethanol, methanol)"
- Orientation arrows
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Per A7.2
- Packing group code: X or Y

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 12 shows "ALCOHOLS, N.O.S." without technical name | Technical name requirement for N.O.S. entries |
| 2 | Package marking missing technical name | Technical name marking validation |
| 3 | Technical name not in parentheses | Technical name format validation |

---

## Scenario 8: UN3274 - ALCOHOLATES SOLUTION, N.O.S.

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3274 |
| PSN | ALCOHOLATES SOLUTION, N.O.S. |
| Details | in alcohol |
| Technical Name Required | Yes |
| Hazard Class | 3 |
| Subsidiary Risk | 8 |
| Packing Group | II |
| Packaging Paragraph | A7.2 |
| Special Provisions | P5 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo" |
| Key 11 | "UN3274" |
| Key 12 | "ALCOHOLATES SOLUTION, N.O.S. (contains sodium methoxide)" |
| Key 13 | "3" |
| Key 14 | "8" |
| Key 15 | "II" |
| Key 16 | Net quantity + packaging |
| Key 17 | "A7.2" |

### Expected Package Inspection (Successful)

**Labels Required:**
- FLAMMABLE LIQUID (Class 3) - primary
- CORROSIVE (Class 8) - subsidiary

**Markings Required:**
- UN3274
- PSN with technical name
- Orientation arrows
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Per A7.2
- Packing group code: X or Y

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Missing CORROSIVE subsidiary label | Subsidiary label validation |
| 2 | Key 14 empty | SDDG subsidiary risk validation |
| 3 | Technical name missing from both SDDG and package | N.O.S. technical name requirement |

---

## Scenario 9: UN2733 - AMINES, FLAMMABLE, CORROSIVE N.O.S.

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN2733 |
| PSN | AMINES, FLAMMABLE, CORROSIVE N.O.S. |
| Technical Name Required | Yes |
| Hazard Class | 3 |
| Subsidiary Risk | 8 |
| Packing Group | II |
| Packaging Paragraph | A7.2 |
| Special Provisions | P4 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" (P4 = CAO) |
| Key 11 | "UN2733" |
| Key 12 | "AMINES, FLAMMABLE, CORROSIVE N.O.S. (contains diethylamine)" |
| Key 13 | "3" |
| Key 14 | "8" |
| Key 15 | "II" |
| Key 16 | Net quantity + packaging |
| Key 17 | "A7.2" |

### Expected Package Inspection (Successful)

**Labels Required:**
- FLAMMABLE LIQUID (Class 3) - primary
- CORROSIVE (Class 8) - subsidiary
- Cargo Aircraft Only

**Markings Required:**
- UN2733
- PSN with technical name
- Orientation arrows
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Per A7.2
- Packing group code: X or Y

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Aircraft type shows "Passenger and Cargo" | P4 aircraft limitation validation |
| 2 | Missing Cargo Aircraft Only label | CAO label requirement validation |
| 3 | POP marking shows "Z" | PG code validation for PG II |

---

## Scenario 10: UN2251 - BICYCLO[2,2,1]HEPTA-2,5-DIENE, STABILIZED

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN2251 |
| PSN | BICYCLO[2,2,1]HEPTA-2,5-DIENE, STABILIZED |
| Hazard Class | 3 |
| Packing Group | II |
| Packaging Paragraph | A7.3 |
| Special Provisions | P5, 387 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo" |
| Key 11 | "UN2251" |
| Key 12 | "BICYCLO[2,2,1]HEPTA-2,5-DIENE, STABILIZED" |
| Key 13 | "3" |
| Key 14 | Empty |
| Key 15 | "II" |
| Key 16 | Net quantity + packaging |
| Key 17 | "A7.3" |

### Expected Package Inspection (Successful)

**Labels Required:**
- FLAMMABLE LIQUID (Class 3)

**Markings Required:**
- UN2251
- PSN (full chemical name)
- Orientation arrows
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Per A7.3 (combination packaging only)
- Packing group code: X or Y

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 17 shows "A7.2" instead of "A7.3" | Packaging paragraph validation |
| 2 | PSN missing "STABILIZED" qualifier | PSN completeness validation |
| 3 | Single packaging used (A7.3 requires combination) | Packaging type validation per paragraph |

---

## Scenario 11: UN1278 - 1-CHLOROPROPANE (Marine Pollutant)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1278 |
| PSN | 1-CHLOROPROPANE |
| Hazard Class | 3 |
| Packing Group | II |
| Packaging Paragraph | A7.2 |
| Special Provisions | P5, N34 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo" |
| Key 11 | "UN1278" |
| Key 12 | "1-CHLOROPROPANE, MARINE POLLUTANT" |
| Key 13 | "3" |
| Key 14 | Empty |
| Key 15 | "II" |
| Key 16 | Net quantity + packaging |
| Key 17 | "A7.2" |

### Expected Package Inspection (Successful)

**Labels Required:**
- FLAMMABLE LIQUID (Class 3)

**Markings Required:**
- UN1278
- PSN: "1-CHLOROPROPANE"
- Marine Pollutant mark (if ≥5L or ≥5kg)
- Orientation arrows
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Per A7.2
- Packing group code: X or Y

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Missing Marine Pollutant mark on package (quantity ≥5L) | Marine pollutant marking validation |
| 2 | Key 12 missing "MARINE POLLUTANT" designation | SDDG marine pollutant notation |
| 3 | N34 special provision not reflected in documentation | Special provision compliance |

---

## Scenario 12: UN1139 - COATING SOLUTION

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1139 |
| PSN | COATING SOLUTION |
| Details | includes surface treatments or coatings used for industrial or other purposes |
| Hazard Class | 3 |
| Packing Group | II |
| Packaging Paragraph | A7.2 |
| Special Provisions | P5 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo" |
| Key 11 | "UN1139" |
| Key 12 | "COATING SOLUTION" |
| Key 13 | "3" |
| Key 14 | Empty |
| Key 15 | "II" |
| Key 16 | Net quantity + packaging |
| Key 17 | "A7.2" |

### Expected Package Inspection (Successful)

**Labels Required:**
- FLAMMABLE LIQUID (Class 3)

**Markings Required:**
- UN1139
- PSN: "COATING SOLUTION"
- Orientation arrows
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Per A7.2
- Packing group code: X or Y

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 11 shows "UN1263" (PAINT instead of COATING SOLUTION) | UN number/PSN consistency validation |
| 2 | Inner packaging exceeds 2.5L limit for PG II combination | Quantity limit per inner packaging validation |
| 3 | MSL missing from package | Military Shipping Label requirement |

---

## Scenario 13: UN2332 - ACETALDEHYDE OXIME

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN2332 |
| PSN | ACETALDEHYDE OXIME |
| Hazard Class | 3 |
| Packing Group | III |
| Packaging Paragraph | A7.2 |
| Special Provisions | P5 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo" |
| Key 11 | "UN2332" |
| Key 12 | "ACETALDEHYDE OXIME" |
| Key 13 | "3" |
| Key 14 | Empty |
| Key 15 | "III" |
| Key 16 | Net quantity + packaging |
| Key 17 | "A7.2" |

### Expected Package Inspection (Successful)

**Labels Required:**
- FLAMMABLE LIQUID (Class 3)

**Markings Required:**
- UN2332
- PSN: "ACETALDEHYDE OXIME"
- Orientation arrows
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Per A7.2 (PG III: combination inner max 5L, or single packaging)
- Packing group code: X, Y, or Z

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 15 shows "II" instead of "III" | Packing group accuracy validation |
| 2 | POP marking shows unauthorized code (e.g., combination 4A steel box not listed) | Packaging code authorization validation |
| 3 | UN marking less than 12mm height | Marking size compliance |

---

## Scenario 14: UN1986 - ALCOHOLS, FLAMMABLE, TOXIC, N.O.S.

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1986 |
| PSN | ALCOHOLS, FLAMMABLE, TOXIC, N.O.S. |
| Technical Name Required | Yes |
| Hazard Class | 3 |
| Subsidiary Risk | 6.1 |
| Packing Group | III |
| Packaging Paragraph | A7.2 |
| Special Provisions | P5 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo" |
| Key 11 | "UN1986" |
| Key 12 | "ALCOHOLS, FLAMMABLE, TOXIC, N.O.S. (contains allyl alcohol)" |
| Key 13 | "3" |
| Key 14 | "6.1" |
| Key 15 | "III" |
| Key 16 | Net quantity + packaging |
| Key 17 | "A7.2" |

### Expected Package Inspection (Successful)

**Labels Required:**
- FLAMMABLE LIQUID (Class 3) - primary
- TOXIC (Class 6.1) - subsidiary

**Markings Required:**
- UN1986
- PSN with technical name
- Orientation arrows
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Per A7.2
- Packing group code: X, Y, or Z

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Technical name missing from Key 12 | N.O.S. technical name requirement |
| 2 | Missing TOXIC subsidiary label | Subsidiary hazard label validation |
| 3 | Key 14 shows "TOXIC" instead of "6.1" | Subsidiary risk format validation (numeric) |

---

## Scenario 15: UN2607 - ACROLEIN DIMER, STABILIZED

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN2607 |
| PSN | ACROLEIN DIMER, STABILIZED |
| Hazard Class | 3 |
| Packing Group | III |
| Packaging Paragraph | A7.2 |
| Special Provisions | P5 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo" |
| Key 11 | "UN2607" |
| Key 12 | "ACROLEIN DIMER, STABILIZED" |
| Key 13 | "3" |
| Key 14 | Empty |
| Key 15 | "III" |
| Key 16 | Net quantity + packaging |
| Key 17 | "A7.2" |

### Expected Package Inspection (Successful)

**Labels Required:**
- FLAMMABLE LIQUID (Class 3)

**Markings Required:**
- UN2607
- PSN: "ACROLEIN DIMER, STABILIZED"
- Orientation arrows
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Per A7.2
- Packing group code: X, Y, or Z

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | PSN shows "ACROLEIN DIMER" without "STABILIZED" | PSN completeness (stabilized qualifier required) |
| 2 | Package shows wrong UN number "UN1092" (ACROLEIN) | UN number differentiation validation |
| 3 | POP marking shows PG code not matching declared PG | PG code/PG consistency |

---

## Scenario 16: UN1263 - PAINT

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1263 |
| PSN | PAINT |
| Details | including paint, lacquer, enamel, stain, shellac solutions, varnish, polish, liquid filler, and liquid lacquer base |
| Hazard Class | 3 |
| Packing Group | III |
| Packaging Paragraph | A7.2 |
| Special Provisions | P5, 367 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo" |
| Key 11 | "UN1263" |
| Key 12 | "PAINT" |
| Key 13 | "3" |
| Key 14 | Empty |
| Key 15 | "III" |
| Key 16 | Net quantity + packaging (e.g., "10 fiberboard boxes x 4 L cans") |
| Key 17 | "A7.2" |

### Expected Package Inspection (Successful)

**Labels Required:**
- FLAMMABLE LIQUID (Class 3)

**Markings Required:**
- UN1263
- PSN: "PAINT"
- Orientation arrows
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Per A7.2
- Packing group code: X, Y, or Z

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 12 shows "VARNISH" but Key 11 shows UN1263 | PSN/UN number consistency |
| 2 | Inner packaging exceeds 5L limit for PG III | Quantity limit validation |
| 3 | Label shows Class 9 instead of Class 3 | Hazard class label accuracy |

---

## Scenario 17: UN1263 - PAINT RELATED MATERIAL

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1263 |
| PSN | PAINT RELATED MATERIAL |
| Details | including paint thinning, drying, removing, or reducing compound |
| Hazard Class | 3 |
| Packing Group | III |
| Packaging Paragraph | A7.2 |
| Special Provisions | P5, 367 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo" |
| Key 11 | "UN1263" |
| Key 12 | "PAINT RELATED MATERIAL" |
| Key 13 | "3" |
| Key 14 | Empty |
| Key 15 | "III" |
| Key 16 | Net quantity + packaging |
| Key 17 | "A7.2" |

### Expected Package Inspection (Successful)

**Labels Required:**
- FLAMMABLE LIQUID (Class 3)

**Markings Required:**
- UN1263
- PSN: "PAINT RELATED MATERIAL"
- Orientation arrows
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Per A7.2
- Packing group code: X, Y, or Z

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 12 shows just "PAINT" not "PAINT RELATED MATERIAL" | PSN precision validation (same UN, different PSN) |
| 2 | Package marking shows abbreviated PSN | PSN full name requirement |
| 3 | Orientation arrows missing entirely | Orientation marking requirement for liquids |

---

## Scenario 18: UN2985 - CHLOROSILANES, FLAMMABLE, CORROSIVE, N.O.S.

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN2985 |
| PSN | CHLOROSILANES, FLAMMABLE, CORROSIVE, N.O.S. |
| Hazard Class | 3 |
| Subsidiary Risk | 8 |
| Packing Group | II |
| Packaging Paragraph | A7.10 |
| Special Provisions | P4 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" (P4 = CAO) |
| Key 11 | "UN2985" |
| Key 12 | "CHLOROSILANES, FLAMMABLE, CORROSIVE, N.O.S." |
| Key 13 | "3" |
| Key 14 | "8" |
| Key 15 | "II" |
| Key 16 | Net quantity + packaging |
| Key 17 | "A7.10" |

### Expected Package Inspection (Successful)

**Labels Required:**
- FLAMMABLE LIQUID (Class 3) - primary
- CORROSIVE (Class 8) - subsidiary
- Cargo Aircraft Only

**Markings Required:**
- UN2985
- PSN
- Orientation arrows
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Per A7.10 (specialized chlorosilane packaging)
- Packing group code: X or Y

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 17 shows "A7.2" instead of "A7.10" | Specialized packaging paragraph validation |
| 2 | Aircraft type "Passenger and Cargo" | P4 limitation validation (requires CAO) |
| 3 | Missing Cargo Aircraft Only label | CAO label requirement |

---

## Scenario 19: NA1993 - COMPOUNDS, CLEANING LIQUID (Domestic)

### Material Details

| Field | Value |
|-------|-------|
| UN/NA Number | NA1993 |
| PSN | COMPOUNDS, CLEANING LIQUID |
| Hazard Class | 3 |
| Packing Group | III |
| Packaging Paragraph | A12.2 |
| Special Provisions | P5 |
| Domestic Shipment | Yes |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo" |
| Key 11 | "NA1993" |
| Key 12 | "COMPOUNDS, CLEANING LIQUID" |
| Key 13 | "3" |
| Key 14 | Empty |
| Key 15 | "III" |
| Key 16 | Net quantity + packaging |
| Key 17 | "A12.2" |

### Expected Package Inspection (Successful)

**Labels Required:**
- FLAMMABLE LIQUID (Class 3)

**Markings Required:**
- NA1993 (domestic NA prefix, not UN)
- PSN: "COMPOUNDS, CLEANING LIQUID"
- Orientation arrows
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Per A12.2 (note: this is corrosive packaging paragraph in database - verify)
- Packing group code: X, Y, or Z

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 11 shows "UN1993" instead of "NA1993" | Domestic shipment ID prefix validation |
| 2 | Package marking shows "UN1993" | NA vs UN marking validation |
| 3 | Shipped internationally with NA number | Domestic-only ID number validation |

---

## Scenario 20: UN3528 - ENGINE, INTERNAL COMBUSTION, FLAMMABLE LIQUID POWERED

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3528 |
| PSN | ENGINE, INTERNAL COMBUSTION, FLAMMABLE LIQUID POWERED |
| Hazard Class | 3 |
| Packing Group | None (special article) |
| Packaging Paragraph | A7.11 |
| Special Provisions | P5, 135, A87 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo" |
| Key 11 | "UN3528" |
| Key 12 | "ENGINE, INTERNAL COMBUSTION, FLAMMABLE LIQUID POWERED" |
| Key 13 | "3" |
| Key 14 | Empty |
| Key 15 | Empty or "N/A" (engines don't have packing groups) |
| Key 16 | Description of engine (e.g., "1 gasoline engine") |
| Key 17 | "A7.11" |

### Expected Package Inspection (Successful)

**Labels Required:**
- FLAMMABLE LIQUID (Class 3)

**Markings Required:**
- UN3528
- PSN: "ENGINE, INTERNAL COMBUSTION, FLAMMABLE LIQUID POWERED"
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Per A7.11 (engine-specific requirements)
- POP marking may not apply to engines (verify per special provision 135)

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 15 shows "II" (engines shouldn't have PG) | Packing group applicability validation |
| 2 | Key 12 shows "MACHINERY" instead of "ENGINE" | PSN precision (MACHINERY vs ENGINE distinction) |
| 3 | Missing FLAMMABLE LIQUID label | Primary hazard label requirement |

---

## Quick Reference Tables

### Aircraft Limitation by Special Provision

| Provision | Aircraft Type | Description |
|-----------|---------------|-------------|
| P1 | Forbidden | Not permitted on any aircraft |
| P2 | CAO Only | Cargo aircraft, with operator approval |
| P3 | CAO Only | Cargo aircraft only |
| P4 | CAO Only | Cargo aircraft only |
| P5 | PAX or CAO | Passenger and cargo aircraft permitted |

### Packing Group to POP Code Mapping

| Packing Group | Valid POP Codes | Invalid POP Codes |
|---------------|-----------------|-------------------|
| I | X only | Y, Z |
| II | X, Y | Z |
| III | X, Y, Z | None |

### Class 3 Packaging Paragraphs Used

| Paragraph | Description | Scenarios |
|-----------|-------------|-----------|
| A7.2 | Standard Class 3 packaging | 1-9, 11-17 |
| A7.3 | Combination packaging only | 10 |
| A7.4 | Specialized fuel tanks | 3 |
| A7.10 | Chlorosilanes | 18 |
| A7.11 | Engines and machinery | 20 |
| A12.2 | Corrosive/cleaning compounds | 19 |

### Subsidiary Hazard Labels

| Subsidiary Risk | Label Required |
|-----------------|----------------|
| 6.1 | TOXIC |
| 8 | CORROSIVE |
| 6.1, 8 | TOXIC + CORROSIVE (both) |

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
4. Record time to complete each inspection

### Alterations Testing Process
1. First complete a successful inspection with correct data
2. Then introduce each alteration individually
3. Verify the app properly flags the issue
4. Confirm frustration message is clear and actionable

### Key Differences from Class 1
- Key 15 is ALWAYS populated (Packing Groups I, II, or III)
- No compatibility groups (hazard class is just "3")
- No EX number marking required
- Orientation arrows required for most liquid packaging
- POP marking allows Z code for PG III materials
