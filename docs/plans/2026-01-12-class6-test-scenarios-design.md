# Class 6 (Toxic and Infectious Substances) Test Scenarios

## Overview

This document contains 20 comprehensive manual test scenarios for the HazPro mobile app Inspector workflow, focusing on Class 6 (Toxic and Infectious Substances) materials. Each scenario is based on AFMAN 24-604 regulations (Attachments 10, 14, 15, and 17).

### Purpose

These scenarios are designed for manual testing by physically running through the app. Each scenario includes:
- **Material Details**: UN number, PSN, hazard class/division, packing group (6.1) or category (6.2), packaging paragraph, special provisions
- **Expected SDDG Inspection**: What a successful SDDG should contain (Keys 7, 11-17, 20)
- **Expected Package Inspection**: Required labels, markings, and POP marking validation (6.1) or triple packaging verification (6.2)
- **Alterations**: Intentional errors to test frustration handling

### Class 6 Division Reference

**CRITICAL**: Class 6 has TWO fundamentally different divisions:

| Division | Name | Hazard | Label | Classification System |
|----------|------|--------|-------|----------------------|
| 6.1 | Toxic Substances | Poison - harmful if swallowed, inhaled, or skin contact | White with skull & crossbones | **Packing Groups I, II, III** |
| 6.2 | Infectious Substances | Contains pathogens - bacteria, viruses, etc. | White with biohazard symbol | **Categories A and B** (NO Packing Groups) |

### Division 6.1 Packing Group Toxicity Reference

| Packing Group | Oral LD50 (mg/kg) | Dermal LD50 (mg/kg) | Inhalation LC50 (mg/L) | Hazard Level |
|---------------|-------------------|---------------------|------------------------|--------------|
| PG I | ≤5 | ≤50 | ≤0.2 (dusts/mists) | **Highly Toxic** |
| PG II | >5 to ≤50 | >50 to ≤200 | >0.2 to ≤2 | **Toxic** |
| PG III | >50 to ≤300 | >200 to ≤1000 | >2 to ≤4 | **Harmful** |

### Division 6.2 Category Reference

| Category | UN Number | Criteria | Risk Level | Label Required |
|----------|-----------|----------|------------|----------------|
| **Category A** | UN2814 (humans) | Capable of causing permanent disability, life-threatening or fatal disease in healthy humans | **Highest Risk** | INFECTIOUS SUBSTANCE |
| **Category A** | UN2900 (animals) | Capable of causing permanent disability, life-threatening or fatal disease in animals | **Highest Risk** | INFECTIOUS SUBSTANCE |
| **Category B** | UN3373 | Does not meet Category A criteria | Lower Risk | **NO LABEL - Marking only** |

### Key Validation Points

**SDDG Keys (per Attachment 17):**
- Key 7: Aircraft Limitations (CAO vs Passenger and Cargo)
- Key 11: UN Number (with RQ prefix if applicable)
- Key 12: Proper Shipping Name (with technical name for N.O.S.; scientific name for 6.2)
- Key 13: Class and Division ("6.1" or "6.2")
- Key 14: Subsidiary Hazard (if applicable - 3 Flammable, 8 Corrosive)
- Key 15: **REQUIRED for 6.1** (Packing Group I, II, or III), **EMPTY for 6.2**
- Key 16: Quantity and Type of Packing
- Key 17: Packaging Instructions (A10.xx paragraph)
- Key 20: Emergency contact (critical for 6.2)

**Package Inspection:**
- Primary hazard label (TOXIC for 6.1, INFECTIOUS SUBSTANCE for 6.2 Cat A, **NO LABEL** for UN3373)
- Subsidiary hazard labels (if Key 14 populated)
- Cargo Aircraft Only label (if P1-P4 or CAO aircraft type)
- Orientation labels (for liquids and ALL 6.2 materials)
- UN number and PSN markings
- "POISON" or "TOXIC" marking (for 6.1 PG I/II)
- "INHALATION HAZARD" marking (for inhalation toxic materials)
- "BIOLOGICAL SUBSTANCE, CATEGORY B" diamond marking (for UN3373)
- Shipper/consignee information (critical for 6.2)
- Military Shipping Label (MSL)
- POP Marking validation (6.1 only - uses X, Y, Z codes)

### Key Differences from Other Classes

| Aspect | Class 1 | Class 4 | Class 5 | Class 6 |
|--------|---------|---------|---------|---------|
| Divisions | 1.1-1.6 | 4.1, 4.2, 4.3 | 5.1, 5.2 | 6.1, 6.2 |
| Key 15 | Empty | Required | 5.1: Required, 5.2: Empty | **6.1: Required, 6.2: Empty** |
| Classification | Compat Groups | Hazard Type | PG vs Type | **PG (6.1) vs Category (6.2)** |
| Special Marking | EX Number | Division-specific | Temp control (5.2) | **POISON/INHALATION HAZARD (6.1), INFECTIOUS (6.2)** |
| Packaging Paragraph | A5.xx | A8.xx | A9.xx | A10.xx |

---

## Scenario 1: UN1680 - POTASSIUM CYANIDE, SOLID (PG I)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1680 |
| PSN | POTASSIUM CYANIDE, SOLID |
| Hazard Class | 6.1 |
| Packing Group | I |
| Packaging Paragraph | A10.5 |
| Special Provisions | P5, N74, N75 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" (P5 allows passenger with quantity limits) |
| Key 11 | "UN1680" |
| Key 12 | "POTASSIUM CYANIDE, SOLID" |
| Key 13 | "6.1" |
| Key 14 | Empty |
| Key 15 | "I" (Packing Group I required) |
| Key 16 | Net quantity + packaging (e.g., "1 fiberboard box (4G) x 5 kg") |
| Key 17 | "A10.5" |

### Expected Package Inspection (Successful)

**Labels Required:**
- TOXIC (skull and crossbones on white background)

**Markings Required:**
- UN1680
- PSN: "POTASSIUM CYANIDE, SOLID"
- "POISON" or "TOXIC" marking
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Valid packaging code from A10.5 (4G boxes authorized)
- Packing group code: **X only** (PG I requires highest rating)

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | POP marking shows packing group "Y" | PG validation (PG I requires X rating only) |
| 2 | Key 15 left empty | Packing group requirement validation for 6.1 |
| 3 | Missing "POISON" or "TOXIC" marking on package | Toxic marking validation for PG I |

---

## Scenario 2: UN1689 - SODIUM CYANIDE, SOLID (PG I)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1689 |
| PSN | SODIUM CYANIDE, SOLID |
| Hazard Class | 6.1 |
| Packing Group | I |
| Packaging Paragraph | A10.5 |
| Special Provisions | P3, N74, N75 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" (P3 restricts to CAO) |
| Key 11 | "UN1689" |
| Key 12 | "SODIUM CYANIDE, SOLID" |
| Key 13 | "6.1" |
| Key 14 | Empty |
| Key 15 | "I" |
| Key 16 | Net quantity + packaging |
| Key 17 | "A10.5" |

### Expected Package Inspection (Successful)

**Labels Required:**
- TOXIC (skull and crossbones)
- Cargo Aircraft Only

**Markings Required:**
- UN1689
- PSN: "SODIUM CYANIDE, SOLID"
- "POISON" or "TOXIC" marking
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Per A10.5 requirements
- Packing group code: X only

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Missing Cargo Aircraft Only label | CAO label validation for P3 material |
| 2 | Key 7 shows "Passenger and Cargo Aircraft" | Aircraft limitation validation (P3 requires CAO) |
| 3 | POP marking shows packing group "Z" | PG validation (completely wrong for PG I) |

---

## Scenario 3: UN3381 - TOXIC BY INHALATION LIQUID, N.O.S. (PG I, Hazard Zone A)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3381 |
| PSN | TOXIC BY INHALATION LIQUID, N.O.S., INHALATION HAZARD ZONE A |
| Technical Name | (Hydrogen Cyanide Solution) |
| Hazard Class | 6.1 |
| Packing Group | I |
| Packaging Paragraph | A10.6 |
| Special Provisions | P1, 2, T22 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" (P1 restricts to CAO) |
| Key 11 | "UN3381" |
| Key 12 | "TOXIC BY INHALATION LIQUID, N.O.S. (Hydrogen Cyanide Solution), INHALATION HAZARD ZONE A" |
| Key 13 | "6.1" |
| Key 14 | Empty |
| Key 15 | "I" |
| Key 16 | Net quantity + packaging |
| Key 17 | "A10.6" |

### Expected Package Inspection (Successful)

**Labels Required:**
- TOXIC INHALATION HAZARD (or TOXIC with INHALATION HAZARD text)
- Cargo Aircraft Only
- Orientation arrows (required for liquids)

**Markings Required:**
- UN3381
- PSN with technical name: "TOXIC BY INHALATION LIQUID, N.O.S. (Hydrogen Cyanide Solution)"
- "INHALATION HAZARD" marking
- "POISON" or "TOXIC" marking
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Per A10.6 requirements (Hazard Zone A specific - drum-in-drum may be required)
- Packing group code: X only

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 12 missing technical name "(Hydrogen Cyanide Solution)" | N.O.S. technical name requirement |
| 2 | Missing "INHALATION HAZARD" marking on package | Inhalation hazard marking validation |
| 3 | Key 12 missing "INHALATION HAZARD ZONE A" designation | Zone designation requirement |

---

## Scenario 4: UN1556 - ARSENIC COMPOUND, LIQUID, N.O.S. (PG I)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1556 |
| PSN | ARSENIC COMPOUND, LIQUID, N.O.S. |
| Technical Name | (Arsenic Trioxide Solution) |
| Hazard Class | 6.1 |
| Packing Group | I |
| Packaging Paragraph | A10.4 |
| Special Provisions | P3, A4 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" (P3 restricts to CAO) |
| Key 11 | "UN1556" |
| Key 12 | "ARSENIC COMPOUND, LIQUID, N.O.S. (Arsenic Trioxide Solution)" |
| Key 13 | "6.1" |
| Key 14 | Empty |
| Key 15 | "I" |
| Key 16 | Net quantity + packaging |
| Key 17 | "A10.4" |

### Expected Package Inspection (Successful)

**Labels Required:**
- TOXIC (skull and crossbones)
- Cargo Aircraft Only
- Orientation arrows (required for liquids)

**Markings Required:**
- UN1556
- PSN with technical name: "ARSENIC COMPOUND, LIQUID, N.O.S. (Arsenic Trioxide Solution)"
- "POISON" or "TOXIC" marking
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Per A10.4 requirements
- Packing group code: X only

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | PSN on package missing technical name | N.O.S. marking requirement |
| 2 | Missing orientation arrows for liquid | Orientation label validation |
| 3 | Key 17 shows "A10.5" instead of "A10.4" | Packaging instruction validation (solid vs liquid) |

---

## Scenario 5: UN1654 - NICOTINE (PG II)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1654 |
| PSN | NICOTINE |
| Hazard Class | 6.1 |
| Packing Group | II |
| Packaging Paragraph | A10.4 |
| Special Provisions | P5 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" |
| Key 11 | "UN1654" |
| Key 12 | "NICOTINE" |
| Key 13 | "6.1" |
| Key 14 | Empty |
| Key 15 | "II" |
| Key 16 | Net quantity + packaging |
| Key 17 | "A10.4" |

### Expected Package Inspection (Successful)

**Labels Required:**
- TOXIC (skull and crossbones)
- Orientation arrows (liquid)

**Markings Required:**
- UN1654
- PSN: "NICOTINE"
- "POISON" or "TOXIC" marking
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Per A10.4 requirements
- Packing group code: X or Y (PG II allows Y rating)

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 15 shows "III" instead of "II" | Packing group accuracy validation |
| 2 | POP marking shows packing group "Z" | PG validation (Z not sufficient for PG II) |
| 3 | Missing TOXIC label on package | Primary hazard label validation |

---

## Scenario 6: UN2929 - TOXIC LIQUID, FLAMMABLE, ORGANIC, N.O.S. (PG II with 3 Subsidiary)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN2929 |
| PSN | TOXIC LIQUID, FLAMMABLE, ORGANIC, N.O.S. |
| Technical Name | (Methyl Isocyanate) |
| Hazard Class | 6.1 |
| Subsidiary Risk | 3 (Flammable) |
| Packing Group | II |
| Packaging Paragraph | A10.4 |
| Special Provisions | P4, 387, A3, A7 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" (P4 restricts to CAO) |
| Key 11 | "UN2929" |
| Key 12 | "TOXIC LIQUID, FLAMMABLE, ORGANIC, N.O.S. (Methyl Isocyanate)" |
| Key 13 | "6.1" |
| Key 14 | "3" (Flammable subsidiary) |
| Key 15 | "II" |
| Key 16 | Net quantity + packaging |
| Key 17 | "A10.4" |

### Expected Package Inspection (Successful)

**Labels Required:**
- TOXIC (primary hazard)
- FLAMMABLE LIQUID (subsidiary Class 3)
- Cargo Aircraft Only
- Orientation arrows (liquid)

**Markings Required:**
- UN2929
- PSN with technical name: "TOXIC LIQUID, FLAMMABLE, ORGANIC, N.O.S. (Methyl Isocyanate)"
- "POISON" or "TOXIC" marking
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Per A10.4 requirements
- Packing group code: X or Y

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Missing FLAMMABLE LIQUID subsidiary label | Subsidiary hazard label validation |
| 2 | Key 14 left empty when subsidiary risk exists | SDDG subsidiary risk validation |
| 3 | Technical name missing from package marking | N.O.S. marking requirement |

---

## Scenario 7: UN2927 - TOXIC LIQUID, CORROSIVE, ORGANIC, N.O.S. (PG II with 8 Subsidiary)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN2927 |
| PSN | TOXIC LIQUID, CORROSIVE, ORGANIC, N.O.S. |
| Technical Name | (Phenol, Chlorinated) |
| Hazard Class | 6.1 |
| Subsidiary Risk | 8 (Corrosive) |
| Packing Group | II |
| Packaging Paragraph | A10.4 |
| Special Provisions | P5, T14 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" |
| Key 11 | "UN2927" |
| Key 12 | "TOXIC LIQUID, CORROSIVE, ORGANIC, N.O.S. (Phenol, Chlorinated)" |
| Key 13 | "6.1" |
| Key 14 | "8" (Corrosive subsidiary) |
| Key 15 | "II" |
| Key 16 | Net quantity + packaging |
| Key 17 | "A10.4" |

### Expected Package Inspection (Successful)

**Labels Required:**
- TOXIC (primary hazard)
- CORROSIVE (subsidiary Class 8)
- Orientation arrows (liquid)

**Markings Required:**
- UN2927
- PSN with technical name: "TOXIC LIQUID, CORROSIVE, ORGANIC, N.O.S. (Phenol, Chlorinated)"
- "POISON" or "TOXIC" marking
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Per A10.4 requirements
- Packing group code: X or Y

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Missing CORROSIVE subsidiary label | Subsidiary hazard label validation |
| 2 | Key 14 shows "3" instead of "8" | Subsidiary risk accuracy validation |
| 3 | PSN abbreviated to "TOXIC LIQ, CORR, ORG, N.O.S." | PSN completeness validation |

---

## Scenario 8: UN3382 - TOXIC BY INHALATION LIQUID, N.O.S. (PG II, Hazard Zone B)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3382 |
| PSN | TOXIC BY INHALATION LIQUID, N.O.S., INHALATION HAZARD ZONE B |
| Technical Name | (Chloroform) |
| Hazard Class | 6.1 |
| Packing Group | II |
| Packaging Paragraph | A10.6 |
| Special Provisions | P2, 2, T11 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" (P2 restricts to CAO) |
| Key 11 | "UN3382" |
| Key 12 | "TOXIC BY INHALATION LIQUID, N.O.S. (Chloroform), INHALATION HAZARD ZONE B" |
| Key 13 | "6.1" |
| Key 14 | Empty |
| Key 15 | "II" |
| Key 16 | Net quantity + packaging |
| Key 17 | "A10.6" |

### Expected Package Inspection (Successful)

**Labels Required:**
- TOXIC INHALATION HAZARD
- Cargo Aircraft Only
- Orientation arrows (liquid)

**Markings Required:**
- UN3382
- PSN with technical name: "TOXIC BY INHALATION LIQUID, N.O.S. (Chloroform)"
- "INHALATION HAZARD" marking
- "POISON" or "TOXIC" marking
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Per A10.6 requirements (Zone B specific)
- Packing group code: X or Y

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 12 shows "ZONE A" instead of "ZONE B" | Zone designation accuracy |
| 2 | Label shows regular TOXIC instead of TOXIC INHALATION HAZARD | Inhalation hazard label validation |
| 3 | Missing orientation arrows for liquid | Orientation requirement validation |

---

## Scenario 9: UN2588 - PESTICIDE, SOLID, TOXIC, N.O.S. (PG II)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN2588 |
| PSN | PESTICIDE, SOLID, TOXIC, N.O.S. |
| Technical Name | (Parathion) |
| Hazard Class | 6.1 |
| Packing Group | II |
| Packaging Paragraph | A10.5 |
| Special Provisions | P5 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" |
| Key 11 | "UN2588" |
| Key 12 | "PESTICIDE, SOLID, TOXIC, N.O.S. (Parathion)" |
| Key 13 | "6.1" |
| Key 14 | Empty |
| Key 15 | "II" |
| Key 16 | Net quantity + packaging |
| Key 17 | "A10.5" |

### Expected Package Inspection (Successful)

**Labels Required:**
- TOXIC (skull and crossbones)

**Markings Required:**
- UN2588
- PSN with technical name: "PESTICIDE, SOLID, TOXIC, N.O.S. (Parathion)"
- "POISON" or "TOXIC" marking
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Per A10.5 requirements
- Packing group code: X or Y

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Technical name missing active ingredient | Pesticide technical name requirement |
| 2 | Key 15 left empty | Packing group requirement for 6.1 |
| 3 | POP marking shows unauthorized packaging code | Packaging code validation |

---

## Scenario 10: UN2810 - TOXIC LIQUID, ORGANIC, N.O.S. (PG III)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN2810 |
| PSN | TOXIC LIQUID, ORGANIC, N.O.S. |
| Technical Name | (Ethylene Glycol) |
| Hazard Class | 6.1 |
| Packing Group | III |
| Packaging Paragraph | A10.4 |
| Special Provisions | P5 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" |
| Key 11 | "UN2810" |
| Key 12 | "TOXIC LIQUID, ORGANIC, N.O.S. (Ethylene Glycol)" |
| Key 13 | "6.1" |
| Key 14 | Empty |
| Key 15 | "III" |
| Key 16 | Net quantity + packaging |
| Key 17 | "A10.4" |

### Expected Package Inspection (Successful)

**Labels Required:**
- Class 6 PG III (or TOXIC with "PG III" designation)
- Orientation arrows (liquid)

**Markings Required:**
- UN2810
- PSN with technical name: "TOXIC LIQUID, ORGANIC, N.O.S. (Ethylene Glycol)"
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Per A10.4 requirements
- Packing group code: X, Y, or Z (PG III allows Z rating)

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 12 missing technical name | N.O.S. technical name requirement |
| 2 | Label shows "TOXIC" without PG III indication | PG III label distinction |
| 3 | Key 13 shows "6" instead of "6.1" | Division specification requirement |

---

## Scenario 11: UN2811 - TOXIC SOLID, ORGANIC, N.O.S. (PG III)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN2811 |
| PSN | TOXIC SOLID, ORGANIC, N.O.S. |
| Technical Name | (Naphthalene) |
| Hazard Class | 6.1 |
| Packing Group | III |
| Packaging Paragraph | A10.5 |
| Special Provisions | P5 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" |
| Key 11 | "UN2811" |
| Key 12 | "TOXIC SOLID, ORGANIC, N.O.S. (Naphthalene)" |
| Key 13 | "6.1" |
| Key 14 | Empty |
| Key 15 | "III" |
| Key 16 | Net quantity + packaging |
| Key 17 | "A10.5" |

### Expected Package Inspection (Successful)

**Labels Required:**
- Class 6 PG III (or TOXIC with "PG III" designation)

**Markings Required:**
- UN2811
- PSN with technical name: "TOXIC SOLID, ORGANIC, N.O.S. (Naphthalene)"
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Per A10.5 requirements
- Packing group code: X, Y, or Z

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Technical name on package doesn't match Key 12 | PSN/marking consistency |
| 2 | Key 15 shows "II" instead of "III" | Packing group accuracy |
| 3 | Missing Military Shipping Label | MSL validation |

---

## Scenario 12: UN1690 - SODIUM FLUORIDE, SOLID (PG III)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1690 |
| PSN | SODIUM FLUORIDE, SOLID |
| Hazard Class | 6.1 |
| Packing Group | III |
| Packaging Paragraph | A10.5 |
| Special Provisions | P5 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" |
| Key 11 | "UN1690" |
| Key 12 | "SODIUM FLUORIDE, SOLID" |
| Key 13 | "6.1" |
| Key 14 | Empty |
| Key 15 | "III" |
| Key 16 | Net quantity + packaging |
| Key 17 | "A10.5" |

### Expected Package Inspection (Successful)

**Labels Required:**
- Class 6 PG III (or TOXIC)

**Markings Required:**
- UN1690
- PSN: "SODIUM FLUORIDE, SOLID"
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Per A10.5 requirements
- Packing group code: X, Y, or Z

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 17 shows "A10.4" instead of "A10.5" | Packaging instruction validation (liquid vs solid) |
| 2 | POP marking entirely missing | UN specification marking validation |
| 3 | UN number marking shows "UN1690" with illegible characters | Marking legibility validation |

---

## Scenario 13: UN3082 - ENVIRONMENTALLY HAZARDOUS SUBSTANCE, LIQUID, N.O.S. (PG III, Marine Pollutant)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3082 |
| PSN | ENVIRONMENTALLY HAZARDOUS SUBSTANCE, LIQUID, N.O.S. |
| Technical Name | (Diesel Fuel) |
| Hazard Class | 9 (Note: Often classified 6.1 PG III in some contexts) |
| Packing Group | III |
| Packaging Paragraph | A10.4 |
| Special Provisions | 8, 146, 335, A112, N33 |
| Marine Pollutant | Yes |

**Note**: While UN3082 is typically Class 9, this scenario represents PG III toxic materials that are also marine pollutants.

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" |
| Key 11 | "UN3082" |
| Key 12 | "ENVIRONMENTALLY HAZARDOUS SUBSTANCE, LIQUID, N.O.S. (Diesel Fuel), MARINE POLLUTANT" |
| Key 13 | "9" |
| Key 14 | Empty |
| Key 15 | "III" |
| Key 16 | Net quantity + packaging |
| Key 17 | "A10.4" |

### Expected Package Inspection (Successful)

**Labels Required:**
- Class 9 (Miscellaneous)
- Orientation arrows (liquid)

**Markings Required:**
- UN3082
- PSN with technical name: "ENVIRONMENTALLY HAZARDOUS SUBSTANCE, LIQUID, N.O.S. (Diesel Fuel)"
- "MARINE POLLUTANT" marking (fish and tree symbol)
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Per A10.4 requirements
- Packing group code: X, Y, or Z

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Missing "MARINE POLLUTANT" marking | Marine pollutant marking validation |
| 2 | Key 12 missing technical name | N.O.S. technical name requirement |
| 3 | Missing orientation arrows for liquid | Orientation requirement validation |

---

## Scenario 14: UN2902 - PESTICIDE, LIQUID, TOXIC, N.O.S. (PG III)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN2902 |
| PSN | PESTICIDE, LIQUID, TOXIC, N.O.S. |
| Technical Name | (Malathion) |
| Hazard Class | 6.1 |
| Packing Group | III |
| Packaging Paragraph | A10.4 |
| Special Provisions | P5 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" |
| Key 11 | "UN2902" |
| Key 12 | "PESTICIDE, LIQUID, TOXIC, N.O.S. (Malathion)" |
| Key 13 | "6.1" |
| Key 14 | Empty |
| Key 15 | "III" |
| Key 16 | Net quantity + packaging |
| Key 17 | "A10.4" |

### Expected Package Inspection (Successful)

**Labels Required:**
- Class 6 PG III (or TOXIC)
- Orientation arrows (liquid)

**Markings Required:**
- UN2902
- PSN with technical name: "PESTICIDE, LIQUID, TOXIC, N.O.S. (Malathion)"
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Per A10.4 requirements
- Packing group code: X, Y, or Z

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | PSN on package shows "PESTICIDE, LIQ, TOX" abbreviated | PSN abbreviation validation |
| 2 | Key 13 shows "6.2" instead of "6.1" | Division accuracy (toxic vs infectious) |
| 3 | Technical name "(Malathion)" missing from package | Pesticide active ingredient marking |

---

## Scenario 15: UN2814 - INFECTIOUS SUBSTANCE, AFFECTING HUMANS (Category A)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN2814 |
| PSN | INFECTIOUS SUBSTANCE, AFFECTING HUMANS |
| Scientific Name | (Bacillus anthracis - Anthrax cultures) |
| Hazard Class | 6.2 |
| Category | A |
| Packaging Paragraph | A10.8 |
| Special Provisions | P1, A140, A502 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" (P1 restricts to CAO) |
| Key 11 | "UN2814" |
| Key 12 | "INFECTIOUS SUBSTANCE, AFFECTING HUMANS (Bacillus anthracis)" |
| Key 13 | "6.2" |
| Key 14 | Empty |
| Key 15 | **EMPTY** (Infectious substances do NOT have packing groups) |
| Key 16 | Net quantity + packaging description (triple packaging) |
| Key 17 | "A10.8" |
| Key 20 | **24-hour emergency contact number** (CRITICAL for 6.2) |

### Expected Package Inspection (Successful)

**Labels Required:**
- INFECTIOUS SUBSTANCE (biohazard symbol on white background)
- Cargo Aircraft Only
- Orientation arrows (required for ALL 6.2 materials)

**Markings Required:**
- UN2814
- PSN: "INFECTIOUS SUBSTANCE, AFFECTING HUMANS"
- Scientific name if known: "(Bacillus anthracis)"
- Shipper name and address
- Consignee name and address
- Responsible person contact (24-hour availability)
- Military Shipping Label (MSL)

**Triple Packaging Validation:**
1. Primary receptacle - watertight
2. Secondary packaging - watertight, with absorbent material
3. Outer packaging - rigid, meets drop test requirements

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 15 shows "II" (packing group entered when should be empty) | 6.2 packing group validation (must be empty) |
| 2 | Missing 24-hour emergency contact in Key 20 | Emergency contact requirement for 6.2 |
| 3 | Using TOXIC label instead of INFECTIOUS SUBSTANCE | Division label validation (6.1 vs 6.2) |

---

## Scenario 16: UN2814 - INFECTIOUS SUBSTANCE, AFFECTING HUMANS (Category A - Viral)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN2814 |
| PSN | INFECTIOUS SUBSTANCE, AFFECTING HUMANS |
| Scientific Name | (Ebola virus cultures) |
| Hazard Class | 6.2 |
| Category | A |
| Packaging Paragraph | A10.8 |
| Special Provisions | P1, A140, A502 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" |
| Key 11 | "UN2814" |
| Key 12 | "INFECTIOUS SUBSTANCE, AFFECTING HUMANS (Ebola virus)" |
| Key 13 | "6.2" |
| Key 14 | Empty |
| Key 15 | **EMPTY** |
| Key 16 | Net quantity + packaging description |
| Key 17 | "A10.8" |
| Key 20 | 24-hour emergency contact |

### Expected Package Inspection (Successful)

**Labels Required:**
- INFECTIOUS SUBSTANCE (biohazard symbol)
- Cargo Aircraft Only
- Orientation arrows

**Markings Required:**
- UN2814
- PSN: "INFECTIOUS SUBSTANCE, AFFECTING HUMANS"
- Scientific name: "(Ebola virus)"
- Shipper/consignee information
- 24-hour responsible person contact
- Military Shipping Label (MSL)

**Triple Packaging Validation:**
- Primary, secondary, and outer packaging verified

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 13 shows "6.1" instead of "6.2" | Division accuracy validation |
| 2 | Missing shipper/consignee information on package | Shipper/consignee marking requirement for 6.2 |
| 3 | Label shows TOXIC (skull) instead of INFECTIOUS SUBSTANCE (biohazard) | Label symbol validation |

---

## Scenario 17: UN2900 - INFECTIOUS SUBSTANCE, AFFECTING ANIMALS only (Category A)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN2900 |
| PSN | INFECTIOUS SUBSTANCE, AFFECTING ANIMALS only |
| Scientific Name | (Foot-and-mouth disease virus) |
| Hazard Class | 6.2 |
| Category | A |
| Packaging Paragraph | A10.8 |
| Special Provisions | P3, A140 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" (P3 restricts to CAO) |
| Key 11 | "UN2900" |
| Key 12 | "INFECTIOUS SUBSTANCE, AFFECTING ANIMALS only (Foot-and-mouth disease virus)" |
| Key 13 | "6.2" |
| Key 14 | Empty |
| Key 15 | **EMPTY** |
| Key 16 | Net quantity + packaging description |
| Key 17 | "A10.8" |
| Key 20 | 24-hour emergency contact |

### Expected Package Inspection (Successful)

**Labels Required:**
- INFECTIOUS SUBSTANCE (biohazard symbol)
- Cargo Aircraft Only
- Orientation arrows

**Markings Required:**
- UN2900
- PSN: "INFECTIOUS SUBSTANCE, AFFECTING ANIMALS only"
- Scientific name: "(Foot-and-mouth disease virus)"
- Shipper/consignee information
- 24-hour responsible person contact
- Military Shipping Label (MSL)

**Triple Packaging Validation:**
- Primary, secondary, and outer packaging verified

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 12 shows "AFFECTING HUMANS" instead of "AFFECTING ANIMALS only" | PSN accuracy for animal-affecting pathogens |
| 2 | Key 7 shows "Passenger and Cargo Aircraft" | Aircraft limitation validation (P3 requires CAO) |
| 3 | Missing scientific name when known | Scientific name marking requirement |

---

## Scenario 18: UN3373 - BIOLOGICAL SUBSTANCE, CATEGORY B (Diagnostic Specimen)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3373 |
| PSN | BIOLOGICAL SUBSTANCE, CATEGORY B |
| Hazard Class | 6.2 |
| Category | B |
| Packaging Paragraph | A10.9 |
| Special Provisions | P5, A508 |

**CRITICAL**: UN3373 does NOT require a hazard label - only specific markings.

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" (generally allowed) |
| Key 11 | "UN3373" |
| Key 12 | "BIOLOGICAL SUBSTANCE, CATEGORY B" |
| Key 13 | "6.2" |
| Key 14 | Empty |
| Key 15 | **EMPTY** (NO packing group for 6.2) |
| Key 16 | Net quantity + packaging description |
| Key 17 | "A10.9" |
| Key 20 | Emergency contact (recommended) |

### Expected Package Inspection (Successful)

**Labels Required:**
- **NO HAZARD LABEL** (UN3373 is a critical exception)
- Orientation arrows (required for 6.2)

**Markings Required:**
- "UN3373" within a diamond-shaped border (minimum 50mm x 50mm)
- "BIOLOGICAL SUBSTANCE, CATEGORY B" text
- Shipper name and address
- Consignee name and address
- Responsible person contact
- Military Shipping Label (MSL)

**Triple Packaging Validation (P650):**
- Primary receptacle (leakproof)
- Secondary packaging (leakproof)
- Outer packaging (rigid, minimum 100mm dimension)

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | INFECTIOUS SUBSTANCE label applied (should have NO label) | UN3373 no-label requirement validation |
| 2 | UN3373 diamond marking missing or wrong size | Diamond marking specification validation |
| 3 | Key 15 shows "II" (should be empty for 6.2) | Packing group empty validation for 6.2 |

---

## Scenario 19: UN3373 - BIOLOGICAL SUBSTANCE, CATEGORY B (Clinical Sample)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3373 |
| PSN | BIOLOGICAL SUBSTANCE, CATEGORY B |
| Contents | Blood sample for diagnostic testing |
| Hazard Class | 6.2 |
| Category | B |
| Packaging Paragraph | A10.9 |
| Special Provisions | P5, A508 |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" |
| Key 11 | "UN3373" |
| Key 12 | "BIOLOGICAL SUBSTANCE, CATEGORY B" |
| Key 13 | "6.2" |
| Key 14 | Empty |
| Key 15 | **EMPTY** |
| Key 16 | "2 outer packages x 500 mL (max 4 L total)" |
| Key 17 | "A10.9" |

### Expected Package Inspection (Successful)

**Labels Required:**
- **NO HAZARD LABEL**
- Orientation arrows

**Markings Required:**
- "UN3373" diamond marking (50mm x 50mm minimum, 2mm line width)
- "BIOLOGICAL SUBSTANCE, CATEGORY B" text (6mm minimum height)
- Shipper/consignee information
- Responsible person contact
- Military Shipping Label (MSL)

**Packaging Validation (A10.9.2 for Liquids):**
- Primary receptacle: max 1 L per receptacle, leakproof
- Absorbent material between primary and secondary
- Secondary packaging: leakproof
- Outer packaging: drop test at 1.2m, minimum surface 100mm x 100mm

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Diamond marking shows "6.2" instead of "UN3373" | UN3373 marking content validation |
| 2 | Key 13 shows "6.1" instead of "6.2" | Division validation for biological substances |
| 3 | Missing responsible person contact information | Contact information requirement for 6.2 |

---

## Scenario 20: UN3291 - CLINICAL WASTE, UNSPECIFIED, N.O.S. (Regulated Medical Waste)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3291 |
| PSN | CLINICAL WASTE, UNSPECIFIED, N.O.S. |
| Hazard Class | 6.2 |
| Packing Group | II |
| Packaging Paragraph | A10.10 |
| Special Provisions | P5, A117 |

**Note**: UN3291 (regulated medical waste) is unique in Division 6.2 - it does have a packing group (PG II).

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" (with quantity restrictions) |
| Key 11 | "UN3291" |
| Key 12 | "CLINICAL WASTE, UNSPECIFIED, N.O.S." or "BIOMEDICAL WASTE, N.O.S." or "REGULATED MEDICAL WASTE, N.O.S." |
| Key 13 | "6.2" |
| Key 14 | Empty |
| Key 15 | "II" (UN3291 exceptionally has PG II) |
| Key 16 | Net quantity + packaging description |
| Key 17 | "A10.10" |

### Expected Package Inspection (Successful)

**Labels Required:**
- INFECTIOUS SUBSTANCE (biohazard symbol)
- Orientation arrows (for liquids or 6.2 general requirement)

**Markings Required:**
- UN3291
- PSN: "CLINICAL WASTE, UNSPECIFIED, N.O.S."
- Shipper/consignee information
- Responsible person contact
- Military Shipping Label (MSL)

**POP Marking Validation (A10.10):**
- Valid packaging codes: 1A2, 1B2, 1N2, 1D, 1G, 1H2, 4A, 4B, 4C1, 4C2, 4D, 4F, 4G, 4H1, 4H2, 4N, 3A2, 3B2, 3H2
- Packing group code: X or Y (PG II performance level)

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 15 empty (should show "II" for UN3291) | UN3291 exception - PG II required |
| 2 | UN3373 marking applied instead of UN3291 | UN number accuracy for medical waste |
| 3 | POP marking shows packing group "Z" | PG II requires X or Y rating |

---

## Quick Reference: Alteration Categories

| Category | Scenarios | Description |
|----------|-----------|-------------|
| **Packing Group Validation** | 1, 2, 3, 5, 9, 18, 19, 20 | POP code vs material PG, Key 15 empty/populated |
| **Key 15 Empty vs Populated** | 10, 11, 15, 18, 19, 20 | 6.1 requires PG, 6.2 must be empty |
| **Missing Labels** | 2, 5, 6, 7, 15, 16, 18 | CAO, subsidiary, primary hazard labels |
| **Wrong Labels** | 15, 16, 18 | TOXIC on 6.2, INFECTIOUS on UN3373 |
| **SDDG Key Errors** | 2, 4, 7, 8, 10, 14, 16, 17, 19 | Key values incorrect or incomplete |
| **PSN Issues** | 6, 7, 10, 14, 17 | PSN abbreviated, incomplete, or wrong |
| **Technical Name** | 3, 4, 6, 7, 9, 10, 11 | N.O.S. entries missing technical name |
| **Inhalation Hazard** | 3, 8 | Zone designation, marking requirements |
| **Subsidiary Risk** | 6, 7 | Missing or wrong subsidiary labels/Key 14 |
| **Aircraft Limitations** | 2, 17 | CAO vs Passenger mismatch |
| **UN3373 Special** | 18, 19 | No label, diamond marking requirements |
| **6.2 Emergency Contact** | 15, 16, 17, 19 | 24-hour contact requirement |
| **Shipper/Consignee** | 16, 19 | Missing information for 6.2 |
| **Orientation Labels** | 4, 8 | Missing for liquids/6.2 materials |
| **Marine Pollutant** | 13 | Marine pollutant marking |
| **Packaging Code** | 2, 9, 12, 20 | Unauthorized code for paragraph |

---

## Division Coverage Summary

| Division | Packing Group/Category | Scenarios |
|----------|------------------------|-----------|
| **6.1 Toxic** | PG I (Highly Toxic) | 1, 2, 3, 4 |
| **6.1 Toxic** | PG II (Toxic) | 5, 6, 7, 8, 9 |
| **6.1 Toxic** | PG III (Harmful) | 10, 11, 12, 13, 14 |
| **6.2 Infectious** | Category A (UN2814) | 15, 16 |
| **6.2 Infectious** | Category A (UN2900) | 17 |
| **6.2 Infectious** | Category B (UN3373) | 18, 19 |
| **6.2 Infectious** | UN3291 Medical Waste | 20 |

---

## Special Feature Coverage

| Feature | Scenarios |
|---------|-----------|
| N.O.S. with Technical Name | 3, 4, 6, 7, 8, 9, 10, 11, 13, 14 |
| Inhalation Hazard (Zone A) | 3 |
| Inhalation Hazard (Zone B) | 8 |
| Subsidiary Risk - Flammable (3) | 6 |
| Subsidiary Risk - Corrosive (8) | 7 |
| Cyanide Compounds | 1, 2 |
| Arsenic Compounds | 4 |
| Pesticides | 9, 14 |
| Marine Pollutant | 13 |
| Category A Human | 15, 16 |
| Category A Animal | 17 |
| Category B (UN3373) | 18, 19 |
| Regulated Medical Waste | 20 |
| CAO Required (P1-P4) | 2, 3, 4, 6, 8, 15, 16, 17 |
| Passenger Allowed (P5) | 1, 5, 7, 9, 10, 11, 12, 13, 14, 18, 19, 20 |
| Triple Packaging Required | 15, 16, 17, 18, 19 |

---

## Packaging Paragraph Coverage (A10.xx)

| Paragraph | Materials | Scenarios |
|-----------|-----------|-----------|
| A10.4 | Liquid Class 6.1 | 4, 5, 6, 7, 8, 10, 13, 14 |
| A10.5 | Solid Class 6.1 | 1, 2, 9, 11, 12 |
| A10.6 | PG I Hazard Zone A & B (Inhalation) | 3, 8 |
| A10.8 | Infectious Substances (Category A) | 15, 16, 17 |
| A10.9 | Biological Substances, Category B | 18, 19 |
| A10.10 | Regulated Medical/Clinical Waste | 20 |

---

## Test Execution Notes

### Before Testing Checklist

1. **Prepare Test Materials**: Gather or mock materials matching the "Material Details" for each scenario
2. **Verify App Configuration**: Ensure latest app version with Class 6 validation logic
3. **Database Verification**: Confirm hazardousMaterialsList.ts contains all test UN numbers
4. **Label Assets**: Have physical or digital versions of required labels:
   - TOXIC (skull and crossbones)
   - TOXIC INHALATION HAZARD
   - INFECTIOUS SUBSTANCE (biohazard)
   - Class 6 PG III
   - FLAMMABLE LIQUID (subsidiary)
   - CORROSIVE (subsidiary)
   - Cargo Aircraft Only
   - Orientation arrows
5. **Marking Assets**: Prepare package markings including:
   - UN number stencils
   - PSN text with technical names
   - UN3373 diamond marking template
   - "POISON"/"TOXIC" markings
   - "INHALATION HAZARD" marking

### During Testing Guidance

1. **SDDG Phase**: Upload/parse an SDDG matching the "Expected SDDG" values, verify all Keys pass
2. **Package Phase**: Present package with correct labels/markings, verify ML detection and OCR work
3. **Key 15 Validation**:
   - For 6.1: MUST contain I, II, or III
   - For 6.2: MUST be empty (except UN3291)
4. **UN3373 Special Case**: Verify app correctly expects NO label (marking only)
5. **6.2 Triple Packaging**: Verify triple packaging structure (primary, secondary, outer)
6. **Alteration Phase**: Apply one alteration at a time, verify frustration is captured correctly
7. **Emergency Contact**: Verify Key 20 validation for Division 6.2 materials

### Key Class 6 Considerations

1. **Division Classification is Fundamentally Different**:
   - Division 6.1 (Toxic): Uses **Packing Groups I, II, III** → Key 15 REQUIRED
   - Division 6.2 (Infectious): Uses **Categories A and B** → Key 15 EMPTY
   - UN3291 is unique exception: Division 6.2 with PG II

2. **UN3373 is Special**:
   - Do NOT get a hazard label
   - Get a diamond-shaped MARKING with "UN3373"
   - Get "BIOLOGICAL SUBSTANCE, CATEGORY B" text marking
   - This is a common error - applying label when only marking is required

3. **Inhalation Hazard Materials**:
   - Require "POISON INHALATION HAZARD" or "TOXIC INHALATION HAZARD" marking
   - May have Zone designation (A, B, C, D) in PSN/Key 12
   - Similar treatment to Class 2.3 toxic gases

4. **Triple Packaging for 6.2**:
   - Primary receptacle (watertight)
   - Secondary packaging (watertight, with absorbent)
   - Outer packaging (rigid)
   - This is NOT negotiable and different from other classes

5. **Emergency Contact is Critical for 6.2**:
   - Key 20 must contain 24-hour emergency contact
   - Person knowledgeable about shipment contents
   - Phone number that will be answered
   - Missing this is a serious violation for infectious substances

### After Testing Summary Requirements

- Document all frustration triggers and app responses
- Verify Form 1015 field mappings for Class 6 frustrations
- Record any edge cases or unexpected behaviors
- Note ML detection accuracy for TOXIC vs INFECTIOUS labels
- Document POP marking validation accuracy for packing group codes
