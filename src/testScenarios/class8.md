# Class 8 (Corrosive Substances) Test Scenarios

## Overview

This document contains 20 comprehensive manual test scenarios for the HazPro mobile app Inspector workflow, focusing on Class 8 (Corrosive Substances) materials. Each scenario is based on AFMAN 24-604 regulations (Attachments 12, 14, 15, and 17).

### Purpose

These scenarios are designed for manual testing by physically running through the app. Each scenario includes:
- **Material Details**: UN number, PSN, hazard class, packing group, packaging paragraph, special provisions
- **Expected SDDG Inspection**: What a successful SDDG should contain (Keys 7, 11-17)
- **Expected Package Inspection**: Required labels, markings, and POP marking validation
- **Alterations**: Intentional errors to test frustration handling

### Class 8 Reference - NO DIVISIONS

**IMPORTANT**: Class 8 is unique among hazard classes because it has **NO DIVISIONS**. Unlike Classes 2, 4, 5, and 6 which have divisions, Class 8 is simply "Corrosive Substances" with classification by Packing Group only.

| Class | Name | Hazard | Label | Key 13 Value |
|-------|------|--------|-------|--------------|
| 8 | Corrosive Substances | Destroys living tissue and/or corrodes metals | White upper/Black lower with dripping liquid | **Just "8"** |

### Packing Group Classification (Corrosivity Severity)

| Packing Group | Skin Corrosion | Exposure/Observation Time | Metal Corrosion | Hazard Level |
|---------------|----------------|---------------------------|-----------------|--------------|
| **PG I** | Full thickness destruction | ≤3 min exposure, ≤60 min observation | >6.25 mm/year at 55°C | **Highly Corrosive** |
| **PG II** | Full thickness destruction | >3 min to ≤60 min exposure, ≤14 days observation | >6.25 mm/year at 55°C | **Corrosive** |
| **PG III** | Full thickness destruction | >60 min to ≤4 hours exposure, ≤14 days observation | >6.25 mm/year at 55°C | **Mildly Corrosive** |

### Acid vs Base Reference

| Type | pH Level | Examples | Mechanism |
|------|----------|----------|-----------|
| **Acids** | Low (0-6) | Sulfuric, Hydrochloric, Nitric, Phosphoric | Attack metals and tissue |
| **Bases (Alkalis)** | High (8-14) | Sodium hydroxide, Potassium hydroxide, Ammonia | Saponify fats, severe burns |
| **Other** | Varies | Battery fluid, Hypochlorite solutions, Cleaning compounds | Various mechanisms |

### Key Validation Points

**CRITICAL - Class 8 Specific:**
1. **Key 13 = "8" ONLY** - No divisions (not "8.1" or "8.2")
2. **Key 15 ALWAYS Required** - Packing Group I, II, or III
3. **Single Label Type** - CORROSIVE (white/black with dripping liquid symbol)
4. **Orientation Labels MANDATORY** - Required for ALL corrosive liquids

**SDDG Keys (per Attachment 17):**
- Key 7: Aircraft Limitations (CAO vs Passenger and Cargo)
- Key 11: UN Number (e.g., "UN1830")
- Key 12: PSN with technical name for N.O.S. and concentration if applicable
- Key 13: Class - simply "8" (NO divisions)
- Key 14: Subsidiary Risk (3, 5.1, 6.1 if applicable)
- Key 15: Packing Group - **REQUIRED** (I, II, or III)
- Key 16: Quantity and Type of Packing
- Key 17: Packaging Instructions (A12.xx paragraph)

**Package Inspection:**
- CORROSIVE label (Class 8) - white upper/black lower with "8" in corner
- Subsidiary hazard labels (if Key 14 populated)
- Cargo Aircraft Only label (if P1-P4 or CAO aircraft type)
- Orientation labels (REQUIRED for all corrosive liquids)
- UN number and PSN markings (12mm minimum height)
- Technical name in parentheses for N.O.S. entries
- Military Shipping Label (MSL)
- POP Marking with appropriate PG code (X, Y, or Z)

### Key Differences from Other Classes

| Aspect | Class 2 | Class 4 | Class 5 | Class 6 | **Class 8** |
|--------|---------|---------|---------|---------|-------------|
| Divisions | 2.1, 2.2, 2.3 | 4.1, 4.2, 4.3 | 5.1, 5.2 | 6.1, 6.2 | **NONE** |
| Key 13 Value | "2.1", "2.2", "2.3" | "4.1", "4.2", "4.3" | "5.1", "5.2" | "6.1", "6.2" | **Just "8"** |
| Packing Group | Usually Empty | Required | 5.1: Yes, 5.2: No | 6.1: Yes, 6.2: No | **ALWAYS Required** |
| Label Variants | 3 different | 3 different | 2 different | 2 different | **1 only** |
| Packaging Attachment | A6.xx | A8.xx | A9.xx | A10.xx | **A12.xx** |

---

## Scenarios 1-6: Packing Group I (Highly Corrosive)

---

## Scenario 1: UN1830 - SULFURIC ACID, FUMING

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1830 |
| PSN | SULFURIC ACID, FUMING with less than 30% free sulfur trioxide |
| Hazard Class | 8 |
| Packing Group | I |
| Packaging Paragraph | A12.2 |
| Special Provisions | P3, A7, N34 |
| Physical State | Liquid |
| Type | Strong Acid |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" (P3 provision) |
| Key 11 | "UN1830" |
| Key 12 | "SULFURIC ACID, FUMING with less than 30% free sulfur trioxide" |
| Key 13 | "8" |
| Key 14 | Empty |
| Key 15 | "I" |
| Key 16 | Net quantity + packaging (e.g., "2 x 5L steel jerricans (3A1)") |
| Key 17 | "A12.2" |

### Expected Package Inspection (Successful)

**Labels Required:**
- CORROSIVE (Class 8) - white upper half, black lower half, "8" in corner
- Cargo Aircraft Only
- Orientation labels (This Way Up arrows) - on TWO OPPOSITE SIDES

**Markings Required:**
- UN1830 (12mm minimum height)
- PSN: "SULFURIC ACID, FUMING with less than 30% free sulfur trioxide"
- Military Shipping Label (MSL)
- Orientation arrows on TWO OPPOSITE SIDES

**POP Marking Validation:**
- Valid packaging codes from A12.2 for PG I liquids:
  - Drums: 1A1, 1A2, 1B1, 1B2, 1H1, 1H2, 1N1, 1N2
  - Jerricans: 3A1, 3A2, 3B1, 3B2, 3H1, 3H2
  - NOT authorized: 1G (fiber), 2C2 (wood barrel)
- Packing group code: **X only** (PG I requires X)

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 13 shows "8.1" instead of "8" | Class 8 has NO divisions validation |
| 2 | POP marking shows packing group "Y" | PG I requires X rating validation |
| 3 | Missing orientation labels on package | Orientation requirement for corrosive liquids |

---

## Scenario 2: UN1790 - HYDROFLUORIC ACID (>60%)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1790 |
| PSN | HYDROFLUORIC ACID with more than 60% strength |
| Hazard Class | 8 |
| Subsidiary Risk | 6.1 (Toxic) |
| Packing Group | I |
| Packaging Paragraph | A12.2 |
| Special Provisions | P3, A7, N5, N34 |
| Physical State | Liquid |
| Type | Strong Acid + Toxic |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" (P3 provision) |
| Key 11 | "UN1790" |
| Key 12 | "HYDROFLUORIC ACID with more than 60% strength" |
| Key 13 | "8" |
| Key 14 | "6.1" |
| Key 15 | "I" |
| Key 16 | Net quantity + packaging (e.g., "1 x 2.5L plastic jerrican (3H1)") |
| Key 17 | "A12.2" |

### Expected Package Inspection (Successful)

**Labels Required:**
- CORROSIVE (Class 8)
- TOXIC (Class 6.1) - subsidiary
- Cargo Aircraft Only
- Orientation labels (This Way Up arrows)

**Markings Required:**
- UN1790 (12mm minimum height)
- PSN: "HYDROFLUORIC ACID with more than 60% strength"
- Military Shipping Label (MSL)
- Orientation arrows on TWO OPPOSITE SIDES

**POP Marking Validation:**
- Plastic recommended due to N5 provision (glass restrictions)
- Packing group code: **X only**

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 14 empty when subsidiary risk exists | Subsidiary risk validation |
| 2 | Missing TOXIC 6.1 subsidiary label | Subsidiary label validation |
| 3 | Key 15 empty (packing group missing) | PG always required for Class 8 |

---

## Scenario 3: UN2032 - NITRIC ACID, RED FUMING

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN2032 |
| PSN | NITRIC ACID, RED FUMING |
| Hazard Class | 8 |
| Subsidiary Risks | 5.1 (Oxidizer), 6.1 (Toxic) |
| Packing Group | I |
| Packaging Paragraph | A12.11 |
| Special Provisions | P2, 2 |
| Physical State | Liquid |
| Type | Strong Acid + Oxidizer + Toxic |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" (P2 provision) |
| Key 11 | "UN2032" |
| Key 12 | "NITRIC ACID, RED FUMING" |
| Key 13 | "8" |
| Key 14 | "5.1, 6.1" |
| Key 15 | "I" |
| Key 16 | Net quantity + packaging (fixed quantity per A12.11) |
| Key 17 | "A12.11" |

### Expected Package Inspection (Successful)

**Labels Required:**
- CORROSIVE (Class 8)
- OXIDIZER (Class 5.1) - subsidiary
- TOXIC (Class 6.1) - subsidiary
- Cargo Aircraft Only
- Orientation labels

**Markings Required:**
- UN2032 (12mm minimum height)
- PSN: "NITRIC ACID, RED FUMING"
- Military Shipping Label (MSL)
- Orientation arrows

**POP Marking Validation:**
- Per A12.11 fixed quantity requirements
- Packing group code: **X only**

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 14 shows only "5.1" (missing 6.1) | Multiple subsidiary risks validation |
| 2 | Missing OXIDIZER 5.1 subsidiary label | Multiple subsidiary labels validation |
| 3 | Key 17 shows "A12.2" instead of "A12.11" | Packaging instruction validation |

---

## Scenario 4: UN2029 - HYDRAZINE, ANHYDROUS

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN2029 |
| PSN | HYDRAZINE, ANHYDROUS |
| Hazard Class | 8 |
| Subsidiary Risks | 3 (Flammable), 6.1 (Toxic) |
| Packing Group | I |
| Packaging Paragraph | A12.2 |
| Special Provisions | P3, A7, A10 |
| Physical State | Liquid |
| Type | Strong Base + Flammable + Toxic |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" (P3 provision) |
| Key 11 | "UN2029" |
| Key 12 | "HYDRAZINE, ANHYDROUS" |
| Key 13 | "8" |
| Key 14 | "3, 6.1" |
| Key 15 | "I" |
| Key 16 | Net quantity + packaging |
| Key 17 | "A12.2" |

### Expected Package Inspection (Successful)

**Labels Required:**
- CORROSIVE (Class 8)
- FLAMMABLE LIQUID (Class 3) - subsidiary
- TOXIC (Class 6.1) - subsidiary
- Cargo Aircraft Only
- Orientation labels

**Markings Required:**
- UN2029 (12mm minimum height)
- PSN: "HYDRAZINE, ANHYDROUS"
- Military Shipping Label (MSL)
- Orientation arrows

**POP Marking Validation:**
- Valid codes per A12.2
- Packing group code: **X only**

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Missing FLAMMABLE LIQUID 3 subsidiary label | Multiple subsidiary labels required |
| 2 | Key 7 shows "Passenger and Cargo Aircraft" | P3 requires CAO validation |
| 3 | Key 13 shows "8.2" | Class 8 NO divisions validation |

---

## Scenario 5: UN1760 - CORROSIVE LIQUID, N.O.S. (PG I)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1760 |
| PSN | CORROSIVE LIQUID, N.O.S. |
| Technical Name | (contains phosphorus trichloride) |
| Hazard Class | 8 |
| Packing Group | I |
| Packaging Paragraph | A12.2 |
| Special Provisions | P3, A7 |
| Physical State | Liquid |
| Type | N.O.S. - Technical Name Required |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" (P3 provision) |
| Key 11 | "UN1760" |
| Key 12 | "CORROSIVE LIQUID, N.O.S. (contains phosphorus trichloride)" |
| Key 13 | "8" |
| Key 14 | Empty |
| Key 15 | "I" |
| Key 16 | Net quantity + packaging |
| Key 17 | "A12.2" |

### Expected Package Inspection (Successful)

**Labels Required:**
- CORROSIVE (Class 8)
- Cargo Aircraft Only
- Orientation labels

**Markings Required:**
- UN1760 (12mm minimum height)
- PSN: "CORROSIVE LIQUID, N.O.S." with technical name in parentheses
- Technical name: "(contains phosphorus trichloride)"
- Military Shipping Label (MSL)
- Orientation arrows

**POP Marking Validation:**
- Valid codes per A12.2
- Packing group code: **X only**

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 12 missing technical name for N.O.S. | N.O.S. technical name requirement |
| 2 | Package marking missing technical name | N.O.S. marking requirement |
| 3 | Technical name not in parentheses | Technical name format validation |

---

## Scenario 6: UN2922 - CORROSIVE LIQUID, TOXIC, N.O.S. (PG I)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN2922 |
| PSN | CORROSIVE LIQUID, TOXIC, N.O.S. |
| Technical Name | (contains phenol, sodium hydroxide) |
| Hazard Class | 8 |
| Subsidiary Risk | 6.1 (Toxic) |
| Packing Group | I |
| Packaging Paragraph | A12.2 |
| Special Provisions | P3, A7 |
| Physical State | Liquid |
| Type | N.O.S. + Toxic Subsidiary |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" (P3 provision) |
| Key 11 | "UN2922" |
| Key 12 | "CORROSIVE LIQUID, TOXIC, N.O.S. (contains phenol, sodium hydroxide)" |
| Key 13 | "8" |
| Key 14 | "6.1" |
| Key 15 | "I" |
| Key 16 | Net quantity + packaging |
| Key 17 | "A12.2" |

### Expected Package Inspection (Successful)

**Labels Required:**
- CORROSIVE (Class 8)
- TOXIC (Class 6.1) - subsidiary
- Cargo Aircraft Only
- Orientation labels

**Markings Required:**
- UN2922 (12mm minimum height)
- PSN: "CORROSIVE LIQUID, TOXIC, N.O.S. (contains phenol, sodium hydroxide)"
- Technical names showing two contributing components
- Military Shipping Label (MSL)
- Orientation arrows

**POP Marking Validation:**
- Valid codes per A12.2
- Packing group code: **X only**

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Technical name lists only one component | N.O.S. requires minimum two components |
| 2 | Key 14 empty for toxic N.O.S. | Subsidiary in PSN must show in Key 14 |
| 3 | POP marking shows "Z" code | PG I requires X validation |

---

## Scenarios 7-14: Packing Group II (Corrosive)

---

## Scenario 7: UN1789 - HYDROCHLORIC ACID

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1789 |
| PSN | HYDROCHLORIC ACID |
| Hazard Class | 8 |
| Packing Group | II |
| Packaging Paragraph | A12.2 |
| Special Provisions | P4, A3, N41 |
| Physical State | Liquid |
| Type | Strong Inorganic Acid |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" (P4 provision) |
| Key 11 | "UN1789" |
| Key 12 | "HYDROCHLORIC ACID" |
| Key 13 | "8" |
| Key 14 | Empty |
| Key 15 | "II" |
| Key 16 | Net quantity + packaging (e.g., "4 x 2.5L glass carboys in fiberboard box") |
| Key 17 | "A12.2" |

### Expected Package Inspection (Successful)

**Labels Required:**
- CORROSIVE (Class 8)
- Cargo Aircraft Only
- Orientation labels

**Markings Required:**
- UN1789 (12mm minimum height)
- PSN: "HYDROCHLORIC ACID"
- Military Shipping Label (MSL)
- Orientation arrows

**POP Marking Validation:**
- Valid codes per A12.2 for PG II liquids
- Packing group code: **X or Y**

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | POP marking shows "Z" code | PG II requires X or Y validation |
| 2 | Missing CAO label despite P4 provision | CAO label requirement |
| 3 | UN number marking height less than 12mm | Marking size requirement |

---

## Scenario 8: UN2789 - ACETIC ACID, GLACIAL

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
| Type | Organic Acid + Flammable |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" (P5 allows passenger) |
| Key 11 | "UN2789" |
| Key 12 | "ACETIC ACID, GLACIAL or acetic acid solution, more than 80% acid, by mass" |
| Key 13 | "8" |
| Key 14 | "3" |
| Key 15 | "II" |
| Key 16 | Net quantity + packaging |
| Key 17 | "A12.2" |

### Expected Package Inspection (Successful)

**Labels Required:**
- CORROSIVE (Class 8)
- FLAMMABLE LIQUID (Class 3) - subsidiary
- NO Cargo Aircraft Only label (P5 allows passenger)
- Orientation labels

**Markings Required:**
- UN2789 (12mm minimum height)
- PSN: "ACETIC ACID, GLACIAL or acetic acid solution, more than 80% acid, by mass"
- Military Shipping Label (MSL)
- Orientation arrows

**POP Marking Validation:**
- Valid codes per A12.2
- Packing group code: **X or Y**

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Missing FLAMMABLE LIQUID 3 subsidiary label | Subsidiary label validation |
| 2 | Package has CAO label when P5 allows passenger | Unnecessary CAO label check |
| 3 | Key 14 empty when flammable subsidiary exists | Subsidiary risk validation |

---

## Scenario 9: UN1823 - SODIUM HYDROXIDE, SOLID

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1823 |
| PSN | SODIUM HYDROXIDE, SOLID |
| Hazard Class | 8 |
| Packing Group | II |
| Packaging Paragraph | A12.3 |
| Special Provisions | P5 |
| Physical State | Solid |
| Type | Strong Base (Solid) |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" (P5 allows passenger) |
| Key 11 | "UN1823" |
| Key 12 | "SODIUM HYDROXIDE, SOLID" |
| Key 13 | "8" |
| Key 14 | Empty |
| Key 15 | "II" |
| Key 16 | Net quantity + packaging (e.g., "2 x 25kg fiber drums (1G)") |
| Key 17 | "A12.3" |

### Expected Package Inspection (Successful)

**Labels Required:**
- CORROSIVE (Class 8)
- NO Cargo Aircraft Only (P5)
- NO orientation labels (solid - not liquid)

**Markings Required:**
- UN1823 (12mm minimum height)
- PSN: "SODIUM HYDROXIDE, SOLID"
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Valid codes per A12.3 for PG II solids:
  - Drums: 1A1, 1A2, 1B1, 1B2, 1G, 1H1, 1H2, 1N1, 1N2
  - Boxes: 4A, 4B, 4C1, 4C2, 4D, 4F, 4G, 4H1, 4H2, 4N
- Packing group code: **X or Y**

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 17 shows "A12.2" instead of "A12.3" | Liquid vs Solid packaging validation |
| 2 | Package has unnecessary orientation labels | Orientation for liquids only validation |
| 3 | PSN abbreviated to "NaOH SOLID" | PSN completeness validation |

---

## Scenario 10: UN2796 - BATTERY FLUID, ACID

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN2796 |
| PSN | BATTERY FLUID, ACID |
| Hazard Class | 8 |
| Packing Group | II |
| Packaging Paragraph | A12.4 |
| Special Provisions | P5, A3, A7, N6, N34 |
| Physical State | Liquid |
| Type | Battery Acid (Sulfuric) |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" (P5 allows passenger) |
| Key 11 | "UN2796" |
| Key 12 | "BATTERY FLUID, ACID" |
| Key 13 | "8" |
| Key 14 | Empty |
| Key 15 | "II" |
| Key 16 | Net quantity + packaging (e.g., "6 x 1L plastic bottles in fiberboard box") |
| Key 17 | "A12.4" |

### Expected Package Inspection (Successful)

**Labels Required:**
- CORROSIVE (Class 8)
- Orientation labels (Package Orientation for battery fluid)

**Markings Required:**
- UN2796 (12mm minimum height)
- PSN: "BATTERY FLUID, ACID"
- Military Shipping Label (MSL)
- Orientation arrows

**POP Marking Validation:**
- Valid codes per A12.4 (battery packaging)
- Packing group code: **X or Y**

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Missing orientation/package orientation labels | Battery fluid orientation requirement |
| 2 | Key 17 shows "A12.2" instead of "A12.4" | Battery-specific packaging instruction |
| 3 | Key 15 shows "III" instead of "II" | Packing group accuracy |

---

## Scenario 11: UN2794 - BATTERIES, WET, FILLED WITH ACID

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN2794 |
| PSN | BATTERIES, WET, FILLED WITH ACID, electric storage |
| Hazard Class | 8 |
| Packing Group | (No PG for batteries) |
| Packaging Paragraph | A12.4 |
| Special Provisions | P5 |
| Physical State | Liquid (Acid-filled) |
| Type | Wet Battery |

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
- Per A12.4 battery packaging requirements
- Acid/alkali-proof liner required
- Protection against short circuit required

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 15 shows "II" when wet batteries have no PG | Battery PG exception |
| 2 | Missing Package Orientation label | Wet battery orientation requirement |
| 3 | Key 12 shows only "BATTERIES" without full descriptor | PSN completeness |

---

## Scenario 12: UN1824 - SODIUM HYDROXIDE, SOLUTION

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1824 |
| PSN | SODIUM HYDROXIDE, SOLUTION |
| Hazard Class | 8 |
| Packing Group | II |
| Packaging Paragraph | A12.2 |
| Special Provisions | P5, N34 |
| Physical State | Liquid |
| Type | Strong Base Solution |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" (P5 allows passenger) |
| Key 11 | "UN1824" |
| Key 12 | "SODIUM HYDROXIDE, SOLUTION" |
| Key 13 | "8" |
| Key 14 | Empty |
| Key 15 | "II" |
| Key 16 | Net quantity + packaging |
| Key 17 | "A12.2" |

### Expected Package Inspection (Successful)

**Labels Required:**
- CORROSIVE (Class 8)
- Orientation labels

**Markings Required:**
- UN1824 (12mm minimum height)
- PSN: "SODIUM HYDROXIDE, SOLUTION"
- Military Shipping Label (MSL)
- Orientation arrows

**POP Marking Validation:**
- Valid codes per A12.2
- Packing group code: **X or Y**

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | UN number transposition "UN1842" vs "UN1824" | UN number accuracy |
| 2 | PSN abbreviated to "CAUSTIC SODA SOLUTION" | Official PSN requirement |
| 3 | Missing Military Shipping Label | MSL requirement |

---

## Scenario 13: UN2920 - CORROSIVE LIQUID, FLAMMABLE, N.O.S.

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN2920 |
| PSN | CORROSIVE LIQUID, FLAMMABLE, N.O.S. |
| Technical Name | (contains formic acid, methanol) |
| Hazard Class | 8 |
| Subsidiary Risk | 3 (Flammable) |
| Packing Group | II |
| Packaging Paragraph | A12.2 |
| Special Provisions | P3 |
| Physical State | Liquid |
| Type | N.O.S. + Flammable |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" (P3 provision) |
| Key 11 | "UN2920" |
| Key 12 | "CORROSIVE LIQUID, FLAMMABLE, N.O.S. (contains formic acid, methanol)" |
| Key 13 | "8" |
| Key 14 | "3" |
| Key 15 | "II" |
| Key 16 | Net quantity + packaging |
| Key 17 | "A12.2" |

### Expected Package Inspection (Successful)

**Labels Required:**
- CORROSIVE (Class 8)
- FLAMMABLE LIQUID (Class 3) - subsidiary
- Cargo Aircraft Only
- Orientation labels

**Markings Required:**
- UN2920 (12mm minimum height)
- PSN: "CORROSIVE LIQUID, FLAMMABLE, N.O.S. (contains formic acid, methanol)"
- Military Shipping Label (MSL)
- Orientation arrows

**POP Marking Validation:**
- Valid codes per A12.2
- Packing group code: **X or Y**

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 12 missing technical name | N.O.S. technical name requirement |
| 2 | Technical name on package doesn't match Key 12 | PSN/marking consistency |
| 3 | Key 14 empty when "FLAMMABLE" is in PSN | Subsidiary in PSN must show in Key 14 |

---

## Scenario 14: UN1802 - PERCHLORIC ACID

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1802 |
| PSN | PERCHLORIC ACID with not more than 50% acid, by mass |
| Hazard Class | 8 |
| Subsidiary Risk | 5.1 (Oxidizer) |
| Packing Group | II |
| Packaging Paragraph | A12.2 |
| Special Provisions | P4, N41 |
| Physical State | Liquid |
| Type | Acid + Oxidizer |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" (P4 provision) |
| Key 11 | "UN1802" |
| Key 12 | "PERCHLORIC ACID with not more than 50% acid, by mass" |
| Key 13 | "8" |
| Key 14 | "5.1" |
| Key 15 | "II" |
| Key 16 | Net quantity + packaging |
| Key 17 | "A12.2" |

### Expected Package Inspection (Successful)

**Labels Required:**
- CORROSIVE (Class 8)
- OXIDIZER (Class 5.1) - subsidiary
- Cargo Aircraft Only
- Orientation labels

**Markings Required:**
- UN1802 (12mm minimum height)
- PSN: "PERCHLORIC ACID with not more than 50% acid, by mass"
- Military Shipping Label (MSL)
- Orientation arrows

**POP Marking Validation:**
- Valid codes per A12.2
- Packing group code: **X or Y**

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Missing OXIDIZER 5.1 subsidiary label | Oxidizer subsidiary validation |
| 2 | Key 12 missing concentration qualifier | PSN completeness with concentration |
| 3 | Subsidiary label shows wrong class (e.g., "5.2" instead of "5.1") | Subsidiary label correctness |

---

## Scenarios 15-20: Packing Group III (Mildly Corrosive)

---

## Scenario 15: UN2790 - ACETIC ACID SOLUTION (10-50%)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN2790 |
| PSN | ACETIC ACID SOLUTION, not less than 10% and less than 50% acid, by mass |
| Hazard Class | 8 |
| Packing Group | III |
| Packaging Paragraph | A12.2 |
| Special Provisions | P5 |
| Physical State | Liquid |
| Type | Dilute Organic Acid |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" (P5 allows passenger) |
| Key 11 | "UN2790" |
| Key 12 | "ACETIC ACID SOLUTION, not less than 10% and less than 50% acid, by mass" |
| Key 13 | "8" |
| Key 14 | Empty |
| Key 15 | "III" |
| Key 16 | Net quantity + packaging |
| Key 17 | "A12.2" |

### Expected Package Inspection (Successful)

**Labels Required:**
- CORROSIVE (Class 8)
- Orientation labels

**Markings Required:**
- UN2790 (12mm minimum height)
- PSN: "ACETIC ACID SOLUTION, not less than 10% and less than 50% acid, by mass"
- Military Shipping Label (MSL)
- Orientation arrows

**POP Marking Validation:**
- Valid codes per A12.2 for PG III liquids (all codes authorized)
- Packing group code: **X, Y, or Z**

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 12 missing concentration range | PSN completeness for concentration-specific entries |
| 2 | Key 15 shows "II" instead of "III" | Packing group accuracy |
| 3 | Missing orientation labels for liquid | Orientation required for ALL corrosive liquids |

---

## Scenario 16: UN2672 - AMMONIA SOLUTION (10-35%)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN2672 |
| PSN | AMMONIA SOLUTION, relative density between 0.880 and 0.957 at 15°C, with more than 10% but not more than 35% ammonia |
| Hazard Class | 8 |
| Packing Group | III |
| Packaging Paragraph | A12.2 |
| Special Provisions | P5 |
| Physical State | Liquid |
| Type | Dilute Base Solution |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" (P5 allows passenger) |
| Key 11 | "UN2672" |
| Key 12 | "AMMONIA SOLUTION, relative density between 0.880 and 0.957 at 15°C, with more than 10% but not more than 35% ammonia" |
| Key 13 | "8" |
| Key 14 | Empty |
| Key 15 | "III" |
| Key 16 | Net quantity + packaging |
| Key 17 | "A12.2" |

### Expected Package Inspection (Successful)

**Labels Required:**
- CORROSIVE (Class 8)
- Orientation labels

**Markings Required:**
- UN2672 (12mm minimum height)
- PSN: "AMMONIA SOLUTION..." (may be abbreviated on marking if Key 12 complete)
- Military Shipping Label (MSL)
- Orientation arrows

**POP Marking Validation:**
- Valid codes per A12.2
- Packing group code: **X, Y, or Z**

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | PSN on package abbreviated to "AMMONIA" | PSN must match or be recognizable |
| 2 | Key 13 shows "8.3" | Class 8 NO divisions validation |
| 3 | POP marking shows unauthorized packaging code | Packaging code validation |

---

## Scenario 17: UN2809 - MERCURY

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
| Physical State | Liquid |
| Type | Metal + Toxic |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" (P5 allows passenger) |
| Key 11 | "UN2809" |
| Key 12 | "MERCURY" |
| Key 13 | "8" |
| Key 14 | "6.1" |
| Key 15 | "III" |
| Key 16 | Net quantity + packaging |
| Key 17 | "A12.9" |

### Expected Package Inspection (Successful)

**Labels Required:**
- CORROSIVE (Class 8)
- TOXIC (Class 6.1) - subsidiary
- Orientation labels

**Markings Required:**
- UN2809 (12mm minimum height)
- PSN: "MERCURY"
- Military Shipping Label (MSL)
- Orientation arrows

**POP Marking Validation:**
- Per A12.9 mercury-specific requirements
- Inner liner required - impervious to mercury
- Packing group code: **X, Y, or Z**

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 17 shows "A12.2" instead of "A12.9" | Mercury-specific packaging instruction |
| 2 | Missing TOXIC 6.1 subsidiary label | Subsidiary label validation |
| 3 | Key 14 empty when toxic subsidiary exists | Subsidiary risk validation |

---

## Scenario 18: UN1805 - PHOSPHORIC ACID, SOLUTION

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1805 |
| PSN | PHOSPHORIC ACID, SOLUTION |
| Hazard Class | 8 |
| Packing Group | III |
| Packaging Paragraph | A12.2 |
| Special Provisions | P5, A7, N34 |
| Physical State | Liquid |
| Type | Inorganic Acid Solution |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" (P5 allows passenger) |
| Key 11 | "UN1805" |
| Key 12 | "PHOSPHORIC ACID, SOLUTION" |
| Key 13 | "8" |
| Key 14 | Empty |
| Key 15 | "III" |
| Key 16 | Net quantity + packaging |
| Key 17 | "A12.2" |

### Expected Package Inspection (Successful)

**Labels Required:**
- CORROSIVE (Class 8)
- Orientation labels

**Markings Required:**
- UN1805 (12mm minimum height)
- PSN: "PHOSPHORIC ACID, SOLUTION"
- Military Shipping Label (MSL)
- Orientation arrows

**POP Marking Validation:**
- Valid codes per A12.2
- Packing group code: **X, Y, or Z**

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Missing CORROSIVE primary label | Primary label validation |
| 2 | CORROSIVE label wrong colors (e.g., all black) | Label color scheme validation |
| 3 | Class number on label shows "6" instead of "8" | Label class number validation |

---

## Scenario 19: UN1759 - CORROSIVE SOLID, N.O.S. (PG III)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1759 |
| PSN | CORROSIVE SOLID, N.O.S. |
| Technical Name | (contains zinc chloride) |
| Hazard Class | 8 |
| Packing Group | III |
| Packaging Paragraph | A12.3 |
| Special Provisions | P5 |
| Physical State | Solid |
| Type | N.O.S. Solid |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" (P5 allows passenger) |
| Key 11 | "UN1759" |
| Key 12 | "CORROSIVE SOLID, N.O.S. (contains zinc chloride)" |
| Key 13 | "8" |
| Key 14 | Empty |
| Key 15 | "III" |
| Key 16 | Net quantity + packaging |
| Key 17 | "A12.3" |

### Expected Package Inspection (Successful)

**Labels Required:**
- CORROSIVE (Class 8)
- NO orientation labels (solid)

**Markings Required:**
- UN1759 (12mm minimum height)
- PSN: "CORROSIVE SOLID, N.O.S. (contains zinc chloride)"
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Valid codes per A12.3 for PG III solids (all codes including bags authorized)
- Packing group code: **X, Y, or Z**

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 12 missing technical name for N.O.S. | N.O.S. technical name requirement |
| 2 | Key 17 shows "A12.2" instead of "A12.3" | Solid vs Liquid packaging validation |
| 3 | Package has unnecessary orientation labels | Orientation for liquids only |

---

## Scenario 20: UN3264 - CORROSIVE LIQUID, ACIDIC, INORGANIC, N.O.S. (PG III)

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3264 |
| PSN | CORROSIVE LIQUID, ACIDIC, INORGANIC, N.O.S. |
| Technical Name | (contains ferric chloride solution) |
| Hazard Class | 8 |
| Packing Group | III |
| Packaging Paragraph | A12.2 |
| Special Provisions | P5 |
| Physical State | Liquid |
| Type | N.O.S. Acidic Inorganic |

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo Aircraft" (P5 allows passenger) |
| Key 11 | "UN3264" |
| Key 12 | "CORROSIVE LIQUID, ACIDIC, INORGANIC, N.O.S. (contains ferric chloride solution)" |
| Key 13 | "8" |
| Key 14 | Empty |
| Key 15 | "III" |
| Key 16 | Net quantity + packaging |
| Key 17 | "A12.2" |

### Expected Package Inspection (Successful)

**Labels Required:**
- CORROSIVE (Class 8)
- Orientation labels

**Markings Required:**
- UN3264 (12mm minimum height)
- PSN: "CORROSIVE LIQUID, ACIDIC, INORGANIC, N.O.S. (contains ferric chloride solution)"
- Military Shipping Label (MSL)
- Orientation arrows

**POP Marking Validation:**
- Valid codes per A12.2
- Packing group code: **X, Y, or Z**

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Technical name missing from package | N.O.S. marking must include technical name |
| 2 | Key 12 shows generic "CORROSIVE LIQUID, N.O.S." without acidic/inorganic | Specific N.O.S. descriptor required |
| 3 | Missing orientation arrows on one side | Orientation on TWO OPPOSITE SIDES |

---

## Quick Reference: Alteration Categories

| Category | Scenarios | Description |
|----------|-----------|-------------|
| **NO DIVISIONS (Key 13)** | 1, 4, 16 | Key 13 shows "8.1", "8.2", etc. instead of just "8" |
| **Packing Group Code** | 1, 6, 7 | POP marking shows wrong X/Y/Z for material PG |
| **Missing PG (Key 15)** | 2 | Key 15 empty when PG always required for Class 8 |
| **Subsidiary Risk** | 2, 3, 8, 13, 14, 17 | Key 14 empty or wrong when subsidiary exists |
| **Missing Subsidiary Labels** | 2, 3, 4, 8, 14, 17, 18 | Subsidiary hazard labels missing from package |
| **Orientation Labels** | 1, 7, 10, 11, 15, 20 | Missing or incomplete orientation for liquids |
| **N.O.S. Technical Name** | 5, 6, 13, 19, 20 | Technical name missing or incomplete |
| **Packaging Instruction** | 3, 9, 10, 11, 17, 19 | Wrong A12.xx paragraph |
| **PSN Issues** | 9, 12, 15, 16 | PSN abbreviated, incomplete, or wrong |
| **UN Number** | 12 | Transposition or incorrect UN number |
| **Label Issues** | 8, 18, 19 | Wrong colors, missing primary, wrong class number |
| **MSL** | 12 | Missing Military Shipping Label |
| **Battery-Specific** | 10, 11 | Battery orientation, PG exception |

---

## Quick Reference: Coverage Summary

### Packing Group Coverage

| Packing Group | Scenarios | Count |
|---------------|-----------|-------|
| PG I (Highly Corrosive) | 1, 2, 3, 4, 5, 6 | 6 |
| PG II (Corrosive) | 7, 8, 9, 10, 12, 13, 14 | 7 |
| PG III (Mildly Corrosive) | 15, 16, 17, 18, 19, 20 | 6 |
| No PG (Batteries) | 11 | 1 |

### Physical State Coverage

| State | Scenarios | Count |
|-------|-----------|-------|
| Liquids | 1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 13, 14, 15, 16, 17, 18, 20 | 17 |
| Solids | 9, 19 | 2 |
| Batteries (Liquid-filled) | 11 | 1 |

### Chemical Type Coverage

| Type | Scenarios | Count |
|------|-----------|-------|
| Strong Inorganic Acids | 1, 2, 3, 7, 14 | 5 |
| Organic Acids | 8, 15 | 2 |
| Strong Bases | 4, 9, 12 | 3 |
| Dilute Bases | 16 | 1 |
| Battery Fluids | 10, 11 | 2 |
| N.O.S. Entries | 5, 6, 13, 19, 20 | 5 |
| Mercury (Metal) | 17 | 1 |
| Phosphoric Acid | 18 | 1 |

### Subsidiary Risk Coverage

| Subsidiary | Scenarios | Count |
|------------|-----------|-------|
| 8 + 3 (Flammable) | 4, 8, 13 | 3 |
| 8 + 5.1 (Oxidizer) | 3, 14 | 2 |
| 8 + 6.1 (Toxic) | 2, 3, 4, 6, 17 | 5 |
| 8 + Multiple | 3, 4 | 2 |
| Pure Class 8 | 1, 5, 7, 9, 10, 11, 12, 15, 16, 18, 19, 20 | 12 |

### Aircraft Limitation Coverage

| Aircraft Type | Scenarios | Count |
|---------------|-----------|-------|
| Cargo Aircraft Only (P1-P4) | 1, 2, 3, 4, 5, 6, 7, 13, 14 | 9 |
| Passenger and Cargo (P5) | 8, 9, 10, 11, 12, 15, 16, 17, 18, 19, 20 | 11 |

### N.O.S. Entries Coverage

| UN# | PSN | Scenarios |
|-----|-----|-----------|
| UN1760 | CORROSIVE LIQUID, N.O.S. | 5 |
| UN2922 | CORROSIVE LIQUID, TOXIC, N.O.S. | 6 |
| UN2920 | CORROSIVE LIQUID, FLAMMABLE, N.O.S. | 13 |
| UN1759 | CORROSIVE SOLID, N.O.S. | 19 |
| UN3264 | CORROSIVE LIQUID, ACIDIC, INORGANIC, N.O.S. | 20 |

### Packaging Paragraph Coverage

| Paragraph | Subject | Scenarios |
|-----------|---------|-----------|
| A12.2 | Liquid Class 8 Materials | 1, 2, 4, 5, 6, 7, 8, 12, 13, 14, 15, 16, 18, 20 |
| A12.3 | Solid Class 8 Materials | 9, 19 |
| A12.4 | Batteries | 10, 11 |
| A12.9 | Mercury | 17 |
| A12.11 | Fixed Quantity Corrosives | 3 |

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
   - Verify Key 15 has packing group (ALWAYS required for Class 8)
   - Check Key 14 for subsidiary risks
   - Verify Key 17 shows A12.xx paragraph

2. **Package Phase**:
   - Verify CORROSIVE label (white upper/black lower)
   - Check for orientation labels on ALL corrosive liquids
   - Verify subsidiary labels match Key 14
   - Check POP marking PG code (X/Y/Z) matches material PG

### Key Class 8 Considerations

1. **NO DIVISIONS** - This is the most critical validation:
   - Key 13 must show simply "8"
   - NOT "8.1", "8.2", or any variant
   - Any division designation is an ERROR

2. **Packing Group ALWAYS Required**:
   - Key 15 must contain "I", "II", or "III"
   - Exception: UN2794, UN2795 (wet batteries) have no PG

3. **Orientation Labels MANDATORY for Liquids**:
   - ALL corrosive liquids require orientation arrows
   - Must be on TWO OPPOSITE SIDES
   - Missing orientation is a common failure

4. **Single Label Type**:
   - Only ONE label design for Class 8
   - Severity indicated by PG, not different labels

5. **Material Compatibility**:
   - Some corrosives require specific packaging materials
   - Strong acids may corrode metal packaging
   - Check special provisions (N3, N40, A7)

### After Testing Summary

For each scenario, document:
- [ ] SDDG validation passed/failed with frustrations
- [ ] Package inspection passed/failed with frustrations
- [ ] Each alteration correctly captured as frustration
- [ ] AMC Form 1015 correctly populated with frustrations
- [ ] All Class 8-specific validations working (especially Key 13 = "8" only)

---

## Revision History

| Date | Author | Changes |
|------|--------|---------|
| 2026-01-12 | Claude | Initial comprehensive Class 8 test scenarios document |
