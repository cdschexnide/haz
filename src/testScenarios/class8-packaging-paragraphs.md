# Class 8 Packaging Paragraph Test Scenarios (A12.2 - A12.15)

## Overview

This document contains test scenarios covering **one material for each packaging paragraph** in AFMAN 24-604 Attachment 12 (Class 8 - Corrosive Substances). These scenarios are designed to validate the Inspector workflow for the full range of Class 8 packaging requirements.

### Purpose

Each scenario tests a unique packaging paragraph with its specific requirements:
- **Material Details**: UN number, PSN, hazard class, packaging paragraph, special provisions
- **Expected SDDG Inspection**: What a successful SDDG should contain (Keys 7, 11-17)
- **Expected Package Inspection**: Required labels, markings, and POP marking validation
- **Alterations**: Intentional errors to test frustration handling

### Packaging Paragraph Summary

| Paragraph | Material Type | Test Material |
|-----------|---------------|---------------|
| A12.2 | Liquid Class 8 | UN2789 - Acetic Acid, Glacial |
| A12.3 | Solid Class 8 | UN2583 - Alkylsulfonic Acids, Solid |
| A12.4 | Batteries | UN2794 - Batteries, Wet, Filled with Acid |
| A12.5 | Smoke Bombs | UN2028 - Bombs, Smoke, Non-Explosive |
| A12.6 | UN3547 Articles | UN3547 - Articles Containing Corrosive Substance, N.O.S. |
| A12.7 | Gallium | UN2803 - Gallium |
| A12.8 | Hydrogen Fluoride | UN1052 - Hydrogen Fluoride, Anhydrous |
| A12.9 | Mercury | UN2809 - Mercury |
| A12.10 | Nitric Acid Mixtures | UN2031 - Nitric Acid (>70%) |
| A12.11 | Inhalation Hazard | UN1740 - Bromoacetyl Bromide |
| A12.12/13/14 | Fuel Cells | UN3477 - Fuel Cell Cartridges |
| A12.15 | Chlorosilanes | UN2987 - Chlorosilanes, Corrosive, N.O.S. |

### Class 8 Key Validation Points

**CRITICAL - Class 8 Specific:**
1. **Key 13 = "8" ONLY** - No divisions (not "8.1" or "8.2")
2. **Key 15 ALWAYS Required** - Packing Group I, II, or III (except batteries)
3. **Single Label Type** - CORROSIVE (white/black with dripping liquid symbol)
4. **Orientation Labels** - Required for ALL corrosive liquids

---

## Scenario 1: A12.2 - UN2789 ACETIC ACID, GLACIAL

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN2789 |
| PSN | ACETIC ACID, GLACIAL or acetic acid solution, more than 80% acid, by mass |
| Hazard Class | 8 |
| Subsidiary Risk | 3 (Flammable) |
| Packing Group | II |
| Packaging Paragraph | A12.2 |
| Special Provisions | P5, A3, A7, A10 |
| Physical State | Liquid |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" (P5 allows passenger) |
| Key 11 | "UN2789" |
| Key 12 | "ACETIC ACID, GLACIAL or acetic acid solution, more than 80% acid, by mass" |
| Key 13 | "8" |
| Key 14 | "3" |
| Key 15 | "II" |
| Key 16 | Net quantity + packaging (e.g., "2 x 5L glass carboys in fiberboard box (4G)") |
| Key 17 | "A12.2" |

### Expected Package Inspection (Successful)

**Labels Required:**
- CORROSIVE (Class 8) - white upper half, black lower half, "8" in corner
- FLAMMABLE LIQUID (Class 3) - subsidiary hazard label
- Orientation labels (This Way Up arrows) - on TWO OPPOSITE SIDES

**Markings Required:**
- UN2789 (12mm minimum height)
- PSN: "ACETIC ACID, GLACIAL or acetic acid solution, more than 80% acid, by mass"
- Military Shipping Label (MSL)
- Orientation arrows on TWO OPPOSITE SIDES

**POP Marking Validation:**
- Valid packaging codes from A12.2 for PG II liquids:
  - Combination: Inner glass/plastic in outer drums/boxes
  - Single: 1A1, 1A2, 1B1, 1B2, 1H1, 1H2, 1N1, 1N2
  - Composite: 6HA1, 6HB1, 6HG1, 6HH1, 6HD1
- Packing group code: **X or Y** (PG II requires X or Y)

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 14 empty when flammable subsidiary exists | Subsidiary risk validation |
| 2 | Missing FLAMMABLE LIQUID 3 subsidiary label | Subsidiary label requirement |
| 3 | POP marking shows packing group "Z" | PG II requires X or Y rating validation |
| 4 | Missing orientation labels on package | Orientation requirement for corrosive liquids |

---

## Scenario 2: A12.3 - UN2583 ALKYLSULFONIC ACIDS, SOLID

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN2583 |
| PSN | ALKYLSULFONIC ACIDS, SOLID |
| Details | with more than 5% free sulfuric acid |
| Hazard Class | 8 |
| Subsidiary Risk | None |
| Packing Group | II |
| Packaging Paragraph | A12.3 |
| Special Provisions | P5 |
| Physical State | Solid |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" (P5 allows passenger) |
| Key 11 | "UN2583" |
| Key 12 | "ALKYLSULFONIC ACIDS, SOLID with more than 5% free sulfuric acid" |
| Key 13 | "8" |
| Key 14 | Empty |
| Key 15 | "II" |
| Key 16 | Net quantity + packaging (e.g., "2 x 25kg fiber drums (1G)") |
| Key 17 | "A12.3" |

### Expected Package Inspection (Successful)

**Labels Required:**
- CORROSIVE (Class 8)
- NO Cargo Aircraft Only label (P5 allows passenger)
- NO orientation labels (solid material - not required)

**Markings Required:**
- UN2583 (12mm minimum height)
- PSN: "ALKYLSULFONIC ACIDS, SOLID with more than 5% free sulfuric acid"
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Valid packaging codes from A12.3 for PG II solids:
  - Combination: Inner glass/plastic/metal in outer drums/boxes
  - Single: 1A1, 1A2, 1B1, 1B2, 1G, 1H1, 1H2, 1N1, 1N2
  - Boxes: 4A, 4B, 4C1, 4C2, 4D, 4F, 4G, 4H2, 4N
  - **Bags NOT authorized for PG II solids**
- Packing group code: **X or Y**

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 17 shows "A12.2" instead of "A12.3" | Solid vs Liquid packaging paragraph validation |
| 2 | Package has unnecessary orientation labels | Orientation not required for solids |
| 3 | POP marking shows bag packaging (5H1) | Bags not authorized for PG II solids |
| 4 | Key 13 shows "8.1" instead of "8" | Class 8 has NO divisions validation |

---

## Scenario 3: A12.4 - UN2794 BATTERIES, WET, FILLED WITH ACID

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN2794 |
| PSN | BATTERIES, WET, FILLED WITH ACID |
| Details | electric storage |
| Hazard Class | 8 |
| Subsidiary Risk | None |
| Packing Group | None (batteries exempted) |
| Packaging Paragraph | A12.4 |
| Special Provisions | P5 |
| Physical State | Liquid (acid-filled) |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" (P5 allows passenger) |
| Key 11 | "UN2794" |
| Key 12 | "BATTERIES, WET, FILLED WITH ACID, electric storage" |
| Key 13 | "8" |
| Key 14 | Empty |
| Key 15 | Empty (No PG for wet batteries per Table A4.1) |
| Key 16 | Number of batteries + weight (e.g., "2 batteries x 15 kg each") |
| Key 17 | "A12.4" |

### Expected Package Inspection (Successful)

**Labels Required:**
- CORROSIVE (Class 8)
- Package Orientation labels (required per A15.4.7.1 for wet-cell batteries)

**Markings Required:**
- UN2794 (12mm minimum height)
- PSN: "BATTERIES, WET, FILLED WITH ACID, electric storage"
- Military Shipping Label (MSL)
- Orientation markings if not obvious

**POP Marking Validation:**
- Per A12.4 battery packaging requirements:
  - Wooden boxes: 4C1, 4C2, 4D, 4F
  - Fiberboard: 4G
  - Plastic: 4H2, 1H2, 3H2
  - Plywood drums: 1D
  - Fiber drums: 1G
- Acid/alkali-proof liner required
- Protection against short circuit required
- **PG II performance standards apply**

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 15 shows "II" when wet batteries have no PG | Battery PG exception validation |
| 2 | Missing Package Orientation label | Wet battery orientation requirement |
| 3 | Key 12 shows only "BATTERIES" without full descriptor | PSN completeness validation |
| 4 | Key 17 shows "A12.2" instead of "A12.4" | Battery-specific packaging instruction |

---

## Scenario 4: A12.5 - UN2028 BOMBS, SMOKE, NON-EXPLOSIVE

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN2028 |
| PSN | BOMBS, SMOKE, NON-EXPLOSIVE |
| Details | with corrosive liquid, without initiating device |
| Hazard Class | 8 |
| Subsidiary Risk | None |
| Packing Group | II |
| Packaging Paragraph | A12.5 |
| Special Provisions | P4 |
| Physical State | Device containing liquid |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" (P4 provision) |
| Key 11 | "UN2028" |
| Key 12 | "BOMBS, SMOKE, NON-EXPLOSIVE with corrosive liquid, without initiating device" |
| Key 13 | "8" |
| Key 14 | Empty |
| Key 15 | "II" |
| Key 16 | Quantity + packaging (e.g., "4 units in wooden box (4C1)") |
| Key 17 | "A12.5" |

### Expected Package Inspection (Successful)

**Labels Required:**
- CORROSIVE (Class 8)
- Cargo Aircraft Only (P4 requires CAO)
- Orientation labels (contains liquid corrosive)

**Markings Required:**
- UN2028 (12mm minimum height)
- PSN: "BOMBS, SMOKE, NON-EXPLOSIVE with corrosive liquid, without initiating device"
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Per A12.5 requirements (PG II performance standard):
  - Boxes: 4A, 4B, 4C1, 4C2, 4D, 4F, 4G, 4H2, 4N
  - Drums: 1A2, 1B2, 1D, 1G, 1H2, 1N2
- Must be without ignition elements, bursting charges, detonating fuses, or explosive components

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 7 shows "Passenger and Cargo Aircraft" | P4 requires CAO validation |
| 2 | Missing Cargo Aircraft Only label | CAO label requirement for P4 |
| 3 | Key 17 shows "A12.2" instead of "A12.5" | Smoke bomb specific packaging validation |
| 4 | Key 12 missing "without initiating device" qualifier | PSN completeness for safety devices |

---

## Scenario 5: A12.6 - UN3547 ARTICLES CONTAINING CORROSIVE SUBSTANCE, N.O.S.

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3547 |
| PSN | ARTICLES CONTAINING CORROSIVE SUBSTANCE, N.O.S. |
| Hazard Class | 8 |
| Subsidiary Risk | None |
| Packing Group | None |
| Packaging Paragraph | A12.6 |
| Special Provisions | P5, 391 |
| Technical Name Required | Yes |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" (P5 allows passenger) |
| Key 11 | "UN3547" |
| Key 12 | "ARTICLES CONTAINING CORROSIVE SUBSTANCE, N.O.S. (contains sulfuric acid cartridge)" |
| Key 13 | "8" |
| Key 14 | Empty |
| Key 15 | Empty (no PG for articles) |
| Key 16 | Quantity + description (e.g., "2 units x 500g each in fiberboard box") |
| Key 17 | "A12.6" |

### Expected Package Inspection (Successful)

**Labels Required:**
- CORROSIVE (Class 8)
- Orientation labels if liquid contents

**Markings Required:**
- UN3547 (12mm minimum height)
- PSN with technical name: "ARTICLES CONTAINING CORROSIVE SUBSTANCE, N.O.S. (contains sulfuric acid cartridge)"
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Per A12.6 requirements:
  - Max 30L for liquids, 50 kg for solids per package
  - PG II performance standard required
  - Removable head drums, boxes, or jerricans
- Robust articles may transport unpackaged or on pallets

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 12 missing technical name for N.O.S. | Technical name requirement for N.O.S. articles |
| 2 | Package marking missing technical name | N.O.S. marking requirement |
| 3 | Key 15 shows "II" when articles have no PG | Article PG exception |
| 4 | Package exceeds 30L liquid limit | A12.6 quantity limit validation |

---

## Scenario 6: A12.7 - UN2803 GALLIUM

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN2803 |
| PSN | GALLIUM |
| Hazard Class | 8 |
| Subsidiary Risk | None |
| Packing Group | III |
| Packaging Paragraph | A12.7 |
| Special Provisions | P3 |
| Physical State | Liquid (low melting point metal) |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" (P3 provision) |
| Key 11 | "UN2803" |
| Key 12 | "GALLIUM" |
| Key 13 | "8" |
| Key 14 | Empty |
| Key 15 | "III" |
| Key 16 | Net quantity + packaging (e.g., "1 x 2.5 kg plastic inner in fiberboard box") |
| Key 17 | "A12.7" |

### Expected Package Inspection (Successful)

**Labels Required:**
- CORROSIVE (Class 8)
- Cargo Aircraft Only (P3 requires CAO)
- Orientation labels (liquid metal)

**Markings Required:**
- UN2803 (12mm minimum height)
- PSN: "GALLIUM"
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Per A12.7 gallium-specific requirements:
  - Semi-rigid plastic inner packaging (max 2.5 kg each)
  - Individually sealed in strong, leak-tight, puncture-resistant bag impervious to liquid gallium
  - Outer: Wooden, plywood, fiberboard, plastic boxes, or steel/fiber/plastic drums
  - **PG I performance standard required**
- If keeping solid: Requires dry ice or refrigeration

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 7 shows "Passenger and Cargo Aircraft" | P3 requires CAO validation |
| 2 | Key 17 shows "A12.2" instead of "A12.7" | Gallium-specific packaging instruction |
| 3 | Missing leak-tight bag impervious to gallium | Gallium-specific liner requirement |
| 4 | POP marking shows PG III rating (Z) | A12.7 requires PG I performance despite PG III material |

---

## Scenario 7: A12.8 - UN1052 HYDROGEN FLUORIDE, ANHYDROUS

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1052 |
| PSN | HYDROGEN FLUORIDE, ANHYDROUS |
| Hazard Class | 8 |
| Subsidiary Risk | 6.1 (Toxic) |
| Packing Group | I |
| Packaging Paragraph | A12.8 |
| Special Provisions | P2, 3, N86 |
| Physical State | Liquefied gas |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" (P2 provision) |
| Key 11 | "UN1052" |
| Key 12 | "HYDROGEN FLUORIDE, ANHYDROUS" |
| Key 13 | "8" |
| Key 14 | "6.1" |
| Key 15 | "I" |
| Key 16 | Cylinder description (e.g., "1 x DOT 3AA cylinder, 50 kg") |
| Key 17 | "A12.8" |

### Expected Package Inspection (Successful)

**Labels Required:**
- CORROSIVE (Class 8)
- TOXIC (Class 6.1) - subsidiary hazard label
- Cargo Aircraft Only (P2 requires CAO)

**Markings Required:**
- UN1052 (12mm minimum height)
- PSN: "HYDROGEN FLUORIDE, ANHYDROUS"
- Military Shipping Label (MSL)
- Cylinder specification marking

**POP Marking Validation:**
- Per A12.8 cylinder-only requirements:
  - DOT cylinders: 3, 3A, 3AA, 3B, 3BN, 3E
  - Also 4B, 4BA, 4BW if not brazed
  - **Filling density: Max 85% of water weight capacity**
- Alternative inspection: Complete external visual inspection per 49 CFR Part 180

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 14 empty when toxic subsidiary exists | Subsidiary risk validation |
| 2 | Missing TOXIC 6.1 subsidiary label | Subsidiary label requirement |
| 3 | Key 17 shows "A12.2" instead of "A12.8" | HF cylinder-specific packaging instruction |
| 4 | Non-cylinder packaging specified | A12.8 cylinder-only requirement |

---

## Scenario 8: A12.9 - UN2809 MERCURY

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN2809 |
| PSN | MERCURY |
| Hazard Class | 8 |
| Subsidiary Risk | 6.1 (Toxic) |
| Packing Group | III |
| Packaging Paragraph | A12.9 |
| Special Provisions | P5 |
| Physical State | Liquid (metallic) |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" (P5 allows passenger) |
| Key 11 | "UN2809" |
| Key 12 | "MERCURY" |
| Key 13 | "8" |
| Key 14 | "6.1" |
| Key 15 | "III" |
| Key 16 | Net quantity + packaging (e.g., "1 x 3.5 kg glass ampoule in steel drum") |
| Key 17 | "A12.9" |

### Expected Package Inspection (Successful)

**Labels Required:**
- CORROSIVE (Class 8)
- TOXIC (Class 6.1) - subsidiary hazard label
- Orientation labels (liquid)

**Markings Required:**
- UN2809 (12mm minimum height)
- PSN: "MERCURY"
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Per A12.9 mercury-specific requirements:
  - **PG I performance standard required** (despite PG III material)
  - Inner: Earthenware, glass, plastic (max 3.5 kg), glass ampoules (max 0.5 kg), or iron/steel flasks (max 35 kg)
  - Outer: Steel drums (1A1/1A2), plywood (1D), fiber (1G), metal (1N1/1N2), steel jerricans (3A2), or boxes
  - Inner or outer must have strong, leak-proof, puncture-resistant liner impervious to mercury

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 17 shows "A12.2" instead of "A12.9" | Mercury-specific packaging instruction |
| 2 | Missing TOXIC 6.1 subsidiary label | Subsidiary label validation |
| 3 | Key 14 empty when toxic subsidiary exists | Subsidiary risk validation |
| 4 | Missing mercury-impervious liner | Mercury liner requirement |

---

## Scenario 9: A12.10 - UN2031 NITRIC ACID (>70%)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN2031 |
| PSN | NITRIC ACID |
| Details | other than red fuming, with more than 70% nitric acid |
| Hazard Class | 8 |
| Subsidiary Risk | 5.1 (Oxidizer) |
| Packing Group | I |
| Packaging Paragraph | A12.10 |
| Special Provisions | P3 |
| Physical State | Liquid |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" (P3 provision) |
| Key 11 | "UN2031" |
| Key 12 | "NITRIC ACID, other than red fuming, with more than 70% nitric acid" |
| Key 13 | "8" |
| Key 14 | "5.1" |
| Key 15 | "I" |
| Key 16 | Net quantity + packaging (e.g., "1 x 2.5L glass bottle in wooden box") |
| Key 17 | "A12.10" |

### Expected Package Inspection (Successful)

**Labels Required:**
- CORROSIVE (Class 8)
- OXIDIZER (Class 5.1) - subsidiary hazard label
- Cargo Aircraft Only (P3 requires CAO)
- Orientation labels

**Markings Required:**
- UN2031 (12mm minimum height)
- PSN: "NITRIC ACID, other than red fuming, with more than 70% nitric acid"
- Military Shipping Label (MSL)
- Orientation arrows

**POP Marking Validation:**
- Per A12.10 nitric acid specific requirements:
  - Concentration-dependent packaging restrictions
  - For >70%: Stainless steel drum (1A1) with specific thickness requirements
  - Or glass bottles (max 2.5L) in wooden boxes
  - **Do not package with any other material if >40% concentration**

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 14 empty when oxidizer subsidiary exists | Subsidiary risk validation |
| 2 | Missing OXIDIZER 5.1 subsidiary label | Subsidiary label requirement |
| 3 | Key 17 shows "A12.2" instead of "A12.10" | Nitric acid specific packaging instruction |
| 4 | Key 12 missing concentration qualifier | PSN completeness for concentration-specific entries |

---

## Scenario 10: A12.11 - UN1740 HYDROGENBROMIDE, ANHYDROUS (Inhalation Hazard)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1740 |
| PSN | HYDROGENBROMIDE, ANHYDROUS |
| Hazard Class | 8 |
| Subsidiary Risk | 6.1 (Toxic - Inhalation Hazard) |
| Packing Group | I |
| Packaging Paragraph | A12.11 |
| Special Provisions | P2, 2, N34 |
| Physical State | Liquefied gas |
| Inhalation Hazard Zone | Zone B |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" (P2 provision) |
| Key 11 | "UN1740" |
| Key 12 | "HYDROGENBROMIDE, ANHYDROUS" |
| Key 13 | "8" |
| Key 14 | "6.1" |
| Key 15 | "I" |
| Key 16 | Cylinder or double drum description |
| Key 17 | "A12.11" |

### Expected Package Inspection (Successful)

**Labels Required:**
- CORROSIVE (Class 8)
- TOXIC (Class 6.1) - subsidiary hazard label
- Cargo Aircraft Only (P2 requires CAO)
- INHALATION HAZARD marking (if Zone A or B)

**Markings Required:**
- UN1740 (12mm minimum height)
- PSN: "HYDROGENBROMIDE, ANHYDROUS"
- "INHALATION HAZARD" marking
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Per A12.11 inhalation hazard requirements:
  - **Hazard Zone B** allows:
    - Seamless DOT/UN cylinders per 49 CFR 173.40
    - Double drum system with rigorous testing requirements
    - Combination packagings with impact-resistant inner receptacles
  - **PG I testing required for both inner and outer independently**

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Missing INHALATION HAZARD marking | Inhalation hazard marking requirement |
| 2 | Key 17 shows "A12.2" instead of "A12.11" | Inhalation hazard specific packaging instruction |
| 3 | Single packaging instead of double drum system | Double containment requirement |
| 4 | Missing TOXIC 6.1 subsidiary label | Subsidiary label requirement for inhalation hazard |

---

## Scenario 11: A12.12/13/14 - UN3477 FUEL CELL CARTRIDGES

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3477 |
| PSN | FUEL CELL CARTRIDGES |
| Details | containing corrosive substances |
| Hazard Class | 8 |
| Subsidiary Risk | None |
| Packing Group | II |
| Packaging Paragraph | A12.12, A12.13, A12.14 |
| Special Provisions | P5, 328 |
| Physical State | Cartridge device |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" (P5 allows passenger) |
| Key 11 | "UN3477" |
| Key 12 | "FUEL CELL CARTRIDGES containing corrosive substances" |
| Key 13 | "8" |
| Key 14 | Empty |
| Key 15 | "II" |
| Key 16 | Quantity + weight (e.g., "4 cartridges x 1 kg each in fiberboard box") |
| Key 17 | "A12.12" or "A12.13" or "A12.14" (depending on configuration) |

### Expected Package Inspection (Successful)

**Labels Required:**
- CORROSIVE (Class 8)
- NO Cargo Aircraft Only (P5 allows passenger)

**Markings Required:**
- UN3477 (12mm minimum height)
- PSN: "FUEL CELL CARTRIDGES containing corrosive substances"
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Per A12.12 (cartridges alone):
  - Weight max 1 kg per cartridge
  - Inner packaging not required
  - Drums, jerricans, or boxes authorized
- Per A12.13 (cartridges in equipment):
  - UN spec packaging not required
  - Strong outer container
  - Protect terminals against short circuit
  - **Fuel cells may NOT charge batteries during transport**
- Per A12.14 (cartridges packed with equipment):
  - Max cartridges = equipment need + 2 spares

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Cartridge weight exceeds 1 kg | A12.12 weight limit validation |
| 2 | More than equipment need + 2 spare cartridges | A12.14 cartridge limit |
| 3 | Key 17 shows "A12.2" instead of fuel cell paragraph | Fuel cell specific packaging instruction |
| 4 | Fuel cells charging batteries during transport | A12.13 charging prohibition |

---

## Scenario 12: A12.15 - UN2987 CHLOROSILANES, CORROSIVE, N.O.S.

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN2987 |
| PSN | CHLOROSILANES, CORROSIVE, N.O.S. |
| Hazard Class | 8 |
| Subsidiary Risk | None |
| Packing Group | II |
| Packaging Paragraph | A12.15 |
| Special Provisions | P4 |
| Technical Name Required | Yes |
| Physical State | Liquid |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" (P4 provision) |
| Key 11 | "UN2987" |
| Key 12 | "CHLOROSILANES, CORROSIVE, N.O.S. (contains dimethyldichlorosilane)" |
| Key 13 | "8" |
| Key 14 | Empty |
| Key 15 | "II" |
| Key 16 | Net quantity + packaging (e.g., "1 x 20L steel drum (1A1)") |
| Key 17 | "A12.15" |

### Expected Package Inspection (Successful)

**Labels Required:**
- CORROSIVE (Class 8)
- Cargo Aircraft Only (P4 requires CAO)
- Orientation labels (liquid)

**Markings Required:**
- UN2987 (12mm minimum height)
- PSN with technical name: "CHLOROSILANES, CORROSIVE, N.O.S. (contains dimethyldichlorosilane)"
- Military Shipping Label (MSL)
- Orientation arrows

**POP Marking Validation:**
- Per A12.15 chlorosilane-specific requirements:
  - **PG I or PG II performance standard required**
  - Combination: Glass or steel inner in drums/boxes
  - Composite: Plastic inner in steel drum (6HA1)
  - Single: Steel drums (1A1) or steel jerricans (3A1)
  - Cylinders: As prescribed for compressed gas EXCEPT specs 8, 8AL, 3HT

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 12 missing technical name for N.O.S. | Technical name requirement |
| 2 | Package marking missing technical name | N.O.S. marking requirement |
| 3 | Key 7 shows "Passenger and Cargo Aircraft" | P4 requires CAO validation |
| 4 | Plastic single packaging (not composite) | Chlorosilane packaging material restrictions |

---

## Quick Reference: Alteration Categories

| Category | Scenarios | Description |
|----------|-----------|-------------|
| **NO DIVISIONS (Key 13)** | 2 | Key 13 shows "8.1", "8.2", etc. instead of just "8" |
| **Packing Group Code** | 1, 6, 8 | POP marking shows wrong X/Y/Z for material PG |
| **Missing Subsidiary Risk (Key 14)** | 1, 7, 8, 9, 10 | Key 14 empty when subsidiary exists |
| **Missing Subsidiary Labels** | 1, 7, 8, 9, 10 | Subsidiary hazard labels missing |
| **Orientation Labels** | 1, 2 | Missing or unnecessary orientation labels |
| **N.O.S. Technical Name** | 5, 12 | Technical name missing or incomplete |
| **Packaging Instruction** | 2, 3, 4, 6, 7, 8, 9, 10, 11 | Wrong A12.xx paragraph |
| **PSN Issues** | 3, 4, 9 | PSN incomplete or missing qualifiers |
| **CAO Requirement** | 4, 6, 7, 12 | P3/P4 requires CAO validation |
| **Battery-Specific** | 3 | Battery PG exception |
| **Material-Specific Packaging** | 6, 7, 8, 10, 11, 12 | Unique packaging requirements |

---

## Quick Reference: Coverage Summary

### Packaging Paragraph Coverage

| Paragraph | Material | Physical State | Key Features |
|-----------|----------|----------------|--------------|
| A12.2 | Acetic Acid, Glacial | Liquid | Flammable subsidiary, combination packaging |
| A12.3 | Alkylsulfonic Acids | Solid | No bags for PG II, no orientation |
| A12.4 | Batteries, Wet | Liquid-filled | No PG, short-circuit protection |
| A12.5 | Smoke Bombs | Device | Non-explosive, CAO required |
| A12.6 | Articles, N.O.S. | Article | Technical name, 30L/50kg limit |
| A12.7 | Gallium | Liquid metal | PG I performance, gallium-impervious liner |
| A12.8 | Hydrogen Fluoride | Liquefied gas | Cylinder-only, 85% fill density |
| A12.9 | Mercury | Liquid metal | PG I performance, mercury-impervious liner |
| A12.10 | Nitric Acid | Liquid | Concentration-dependent, oxidizer |
| A12.11 | Inhalation Hazard | Liquefied gas | Double containment, Zone A/B |
| A12.12/13/14 | Fuel Cells | Cartridge | 1kg limit, no charging in transport |
| A12.15 | Chlorosilanes | Liquid | Steel/glass only, N.O.S. |

### Aircraft Limitation Coverage

| Aircraft Type | Scenarios | Count |
|---------------|-----------|-------|
| Cargo Aircraft Only (P2/P3/P4) | 4, 6, 7, 9, 10, 12 | 6 |
| Passenger and Cargo (P5) | 1, 2, 3, 5, 8, 11 | 6 |

### Subsidiary Risk Coverage

| Subsidiary | Scenarios | Count |
|------------|-----------|-------|
| 8 + 3 (Flammable) | 1 | 1 |
| 8 + 5.1 (Oxidizer) | 9 | 1 |
| 8 + 6.1 (Toxic) | 7, 8, 10 | 3 |
| Pure Class 8 | 2, 3, 4, 5, 6, 11, 12 | 7 |

### N.O.S. Entries Coverage

| UN# | PSN | Scenario |
|-----|-----|----------|
| UN3547 | ARTICLES CONTAINING CORROSIVE SUBSTANCE, N.O.S. | 5 |
| UN2987 | CHLOROSILANES, CORROSIVE, N.O.S. | 12 |

---

## Test Execution Notes

### Before Testing Checklist

- [ ] Verify app is in Inspector mode
- [ ] Ensure device camera is functional for ML detection
- [ ] Have reference materials ready for each scenario
- [ ] Prepare mock SDDG forms with correct and altered values
- [ ] Prepare mock packages with correct and altered labels/markings
- [ ] Note: Class 8 has NO divisions - Key 13 must be "8" only

### During Testing Guidance

1. **SDDG Phase**:
   - Verify Key 13 shows simply "8" (not "8.1", "8.2", etc.)
   - Verify Key 15 has packing group (except batteries and articles)
   - Check Key 14 for subsidiary risks
   - Verify Key 17 shows correct A12.xx paragraph

2. **Package Phase**:
   - Verify CORROSIVE label (white upper/black lower)
   - Check for orientation labels on corrosive liquids
   - Verify subsidiary labels match Key 14
   - Check POP marking PG code (X/Y/Z) matches requirements
   - Verify material-specific packaging requirements

### Key Class 8 Considerations

1. **NO DIVISIONS** - Key 13 must show simply "8"
2. **Packing Group Usually Required** - Except batteries (A12.4) and articles (A12.6)
3. **Orientation Labels** - Required for ALL corrosive liquids
4. **Material-Specific Paragraphs** - Each A12.x has unique requirements
5. **Performance Standards May Differ** - Some materials require higher PG performance than their classification (e.g., A12.7 Gallium, A12.9 Mercury)

---

## Revision History

| Date | Author | Changes |
|------|--------|---------|
| 2026-01-21 | Claude | Initial comprehensive Class 8 packaging paragraph test scenarios (A12.2-A12.15) |
