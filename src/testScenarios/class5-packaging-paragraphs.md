# Class 5.1 (Oxidizers) Test Scenarios by Packaging Paragraph

## Overview

This document contains test scenarios for the HazPro mobile app Inspector workflow, covering **each packaging paragraph** in AFMAN 24-604 Attachment 9 for Class 5.1 (Oxidizers). Each scenario uses a representative material from the hazardousMaterialsList.

**Source Documents:**
- `docs/attachment9/afmanAttachment9.pdf` - Packaging instructions
- `docs/attachment14/attachment14.pdf` - Marking requirements
- `docs/attachment15/attachment15.pdf` - Labeling requirements
- `server/attachment17/attachment17.pdf` - SDDG requirements

### Purpose

These scenarios ensure coverage of ALL packaging paragraphs A9.5 through A9.10, testing the unique requirements of each paragraph type:

| Paragraph | Material Type | Key Feature |
|-----------|--------------|-------------|
| **A9.5** | Class 5.1 Liquids | Broadest packaging options; requires absorbent for PG I |
| **A9.6** | Class 5.1 Solids | Allows bags (5H, 5L, 5M); more PG I restrictions |
| **A9.7** | Iodine Pentafluoride | CYLINDERS ONLY (except acetylene types) |
| **A9.8** | Dual-hazard N.O.S. oxidizers | Requires Competent Authority Approval (CAA) |
| **A9.9** | Bromine Pentafluoride/Trifluoride | SPECIFIC cylinder specs; NO pressure relief; extremely dangerous |
| **A9.10** | Chemical Oxygen Generators | Drop test, actuation prevention, flame/thermal tests; forbidden after expiration |

### Test Scenario Structure

Each scenario includes:
- **Material Details**: UN number, PSN, hazard class, packaging paragraph, special provisions
- **Expected SDDG Inspection**: What a successful SDDG should contain (Keys 7, 11-17)
- **Expected Package Inspection**: Required labels, markings, and POP marking validation
- **Alterations**: Intentional errors to test frustration handling

---

## Scenario 1: A9.5 - UN3149 HYDROGEN PEROXIDE AND PEROXYACETIC ACID MIXTURES, STABILIZED

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3149 |
| PSN | HYDROGEN PEROXIDE AND PEROXYACETIC ACID MIXTURES, STABILIZED |
| Details | with acids, water and 5% or less peroxyacetic acid |
| Hazard Class | 5.1 |
| Packing Group | II |
| Subsidiary Risk | 8 (Corrosive) |
| Packaging Paragraph | A9.5 |
| Special Provisions | P5, A2, A3 |
| Technical Name Required | No |

### Packaging Paragraph A9.5 Key Requirements

- **Material Type**: Class 5.1 Oxidizing Liquids
- **Valid Packaging Codes**: Drums (1A1, 1A2, 1B1, 1B2, 1H1, 1H2, 1N1, 1N2), Jerricans (3A1, 3A2, 3B1, 3B2, 3H1, 3H2), Composite packagings (6HA1, 6HB1, etc.)
- **PG II Restrictions**: Wood barrels (2C1, 2C2) allowed; plywood drums allowed
- **Special Note**: Inner packagings for liquids require absorbent material for PG I (not applicable for PG II)

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo" (P5 provision) |
| Key 11 | "UN3149" |
| Key 12 | "HYDROGEN PEROXIDE AND PEROXYACETIC ACID MIXTURES, STABILIZED with acids, water and 5% or less peroxyacetic acid" |
| Key 13 | "5.1" |
| Key 14 | "8" |
| Key 15 | "II" |
| Key 16 | Net quantity + packaging (e.g., "2 plastic jerricans (3H1) x 10 L") |
| Key 17 | "A9.5" |

### Expected Package Inspection (Successful)

**Labels Required:**
- OXIDIZER 5.1 (primary) - yellow diamond, flame over circle, "5.1" in bottom corner
- CORROSIVE 8 (subsidiary)

**Markings Required:**
- UN3149 (minimum 12mm height for packages > 30L)
- PSN: "HYDROGEN PEROXIDE AND PEROXYACETIC ACID MIXTURES, STABILIZED"
- Military Shipping Label (MSL)
- Orientation arrows (liquid in combination packaging)

**POP Marking Validation:**
- Valid packaging code from A9.5 (jerricans: 3A1, 3A2, 3B1, 3B2, 3H1, 3H2; drums: 1A1, 1B1, 1H1, 1N1)
- Packing group code: **X or Y** (PG II allows X or Y)
- Format example: `UN 3H1 / Y 1.2 / 100 / 24 / USA / DOD`

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Missing CORROSIVE 8 subsidiary label | Subsidiary label validation for 5.1 with 8 subsidiary |
| 2 | POP marking shows code "Z" | PG code validation (PG II requires X or Y) |
| 3 | Key 14 empty instead of "8" | Subsidiary hazard documentation on SDDG |
| 4 | Missing orientation arrows | Liquid packaging orientation marking requirement |
| 5 | Key 17 shows "A9.6" (solids) instead of "A9.5" (liquids) | Packaging paragraph validation for liquid material |

---

## Scenario 2: A9.6 - UN1438 ALUMINIUM NITRATE

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
| Technical Name Required | No |

### Packaging Paragraph A9.6 Key Requirements

- **Material Type**: Class 5.1 Oxidizing Solids
- **Valid Packaging Codes**: Drums (1A1, 1A2, 1B1, 1B2, 1G, 1H1, 1H2, 1N1, 1N2), Boxes (4A, 4B, 4C1, 4C2, 4D, 4F, 4G, 4H2, 4N), **Bags** (5H1, 5H2, 5H3, 5H4, 5L1, 5L2, 5L3, 5M2 - NOT for PG I)
- **Key Difference from A9.5**: Allows bags for solid oxidizers
- **PG III Allowances**: Most permissive - all packaging types allowed

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Passenger and Cargo" (P5 provision) |
| Key 11 | "UN1438" |
| Key 12 | "ALUMINIUM NITRATE" |
| Key 13 | "5.1" |
| Key 14 | Empty (no subsidiary) |
| Key 15 | "III" |
| Key 16 | Net quantity + packaging (e.g., "4 fiberboard boxes (4G) x 25 kg") |
| Key 17 | "A9.6" |

### Expected Package Inspection (Successful)

**Labels Required:**
- OXIDIZER 5.1 (yellow diamond, flame over circle, "5.1" in bottom corner)

**Markings Required:**
- UN1438 (minimum 12mm height for packages > 30 kg)
- PSN: "ALUMINIUM NITRATE"
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Valid packaging code from A9.6 (boxes: 4A, 4B, 4G, 4N; drums: 1A1, 1A2, 1G, 1H2; bags: 5H1, 5H2, 5L1, 5M2)
- Packing group code: **X, Y, or Z** (PG III allows all codes)
- Format example: `UN 4G / Z 30 / S / 24 / USA / DOD`

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 15 shows "II" instead of "III" | Packing group accuracy validation |
| 2 | PSN spelled "ALUMINUM NITRATE" (American spelling) | PSN spelling validation (AFMAN uses British spelling) |
| 3 | Label missing "5.1" division number | Division number on OXIDIZER label |
| 4 | Key 15 empty | Packing group required validation for 5.1 |
| 5 | Key 17 shows "A9.5" (liquids) instead of "A9.6" (solids) | Packaging paragraph for solid material |

---

## Scenario 3: A9.7 - UN2495 IODINE PENTAFLUORIDE

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN2495 |
| PSN | IODINE PENTAFLUORIDE |
| Hazard Class | 5.1 |
| Packing Group | I |
| Subsidiary Risk | 6.1 (Toxic), 8 (Corrosive) |
| Packaging Paragraph | A9.7 |
| Special Provisions | P3 |
| Technical Name Required | No |

### Packaging Paragraph A9.7 Key Requirements

- **Material Type**: Iodine Pentafluoride (specific material)
- **CRITICAL**: **CYLINDERS ONLY** - No drums, boxes, jerricans, or other packaging types allowed
- **Valid Packaging Codes**: Any DOT specification cylinder EXCEPT those specified for acetylene (DOT 8, 8AL)
- **Note**: This is one of the most restrictive packaging paragraphs - only one material uses it

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" (P3 provision) |
| Key 11 | "UN2495" |
| Key 12 | "IODINE PENTAFLUORIDE" |
| Key 13 | "5.1" |
| Key 14 | "6.1, 8" |
| Key 15 | "I" |
| Key 16 | Net quantity + packaging (e.g., "1 cylinder (3AA) x 5 kg") |
| Key 17 | "A9.7" |

### Expected Package Inspection (Successful)

**Labels Required:**
- OXIDIZER 5.1 (primary)
- TOXIC 6.1 (subsidiary)
- CORROSIVE 8 (subsidiary)
- CARGO AIRCRAFT ONLY (P3 provision)

**Markings Required:**
- UN2495 (minimum 12mm height)
- PSN: "IODINE PENTAFLUORIDE"
- Military Shipping Label (MSL)

**POP Marking Validation:**
- **MUST be a cylinder** - any DOT spec except DOT 8, 8AL (acetylene)
- Packing group code: **X only** (PG I requires X)
- Cylinder specifications: 3A, 3AA, 3B, 3E, 4B, 4BA, 4BW, etc.

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | POP marking shows drum code "1A1" instead of cylinder | Cylinder-only packaging validation for A9.7 |
| 2 | Missing TOXIC 6.1 subsidiary label | Multiple subsidiary label validation |
| 3 | Missing CORROSIVE 8 subsidiary label | Multiple subsidiary label validation |
| 4 | POP marking shows packing group "Y" | PG validation (PG I requires X only) |
| 5 | Key 7 shows "Passenger and Cargo" | Aircraft limitation validation for P3 material |
| 6 | Missing CARGO AIRCRAFT ONLY label | CAO label requirement for P3 |
| 7 | Key 14 shows "6.1" only, missing "8" | Subsidiary documentation completeness |

---

## Scenario 4: A9.8 - UN3137 OXIDIZING SOLID, FLAMMABLE, N.O.S.

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3137 |
| PSN | OXIDIZING SOLID, FLAMMABLE, N.O.S. |
| Hazard Class | 5.1 |
| Packing Group | I |
| Subsidiary Risk | 4.1 (Flammable Solid) |
| Packaging Paragraph | A9.8 |
| Special Provisions | P4, 62 |
| Technical Name Required | **Yes** |

### Packaging Paragraph A9.8 Key Requirements

- **Material Type**: Oxidizing Substances with Multiple Hazards (N.O.S.)
  - Oxidizing Substances, Solid, Self-Heating, N.O.S.
  - Oxidizing Substances, Solid, Flammable, N.O.S.
  - Oxidizing Substances, Solid, Water Reactive, N.O.S.
- **CRITICAL**: **MUST ship according to a Competent Authority Approval (CAA)**
- **No Standard Packaging Codes**: Entirely dependent on CAA
- These are dual-hazard materials requiring special approval per paragraph 2.5

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" (P4 provision) |
| Key 11 | "UN3137" |
| Key 12 | "OXIDIZING SOLID, FLAMMABLE, N.O.S. (Technical Name)" |
| Key 13 | "5.1" |
| Key 14 | "4.1" |
| Key 15 | "I" |
| Key 16 | Net quantity + packaging (per CAA) |
| Key 17 | "A9.8" (and/or CAA reference) |

### Expected Package Inspection (Successful)

**Labels Required:**
- OXIDIZER 5.1 (primary)
- FLAMMABLE SOLID 4.1 (subsidiary)
- CARGO AIRCRAFT ONLY (P4 provision)

**Markings Required:**
- UN3137 (minimum 12mm height)
- PSN: "OXIDIZING SOLID, FLAMMABLE, N.O.S."
- **Technical name in parentheses** (REQUIRED for N.O.S.)
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Packaging as specified in Competent Authority Approval (CAA)
- Packing group code: **X only** (PG I requires X)
- CAA number may be required on package

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Key 12 missing technical name | N.O.S. technical name requirement |
| 2 | Package marking missing technical name | Package marking completeness for N.O.S. |
| 3 | Missing FLAMMABLE SOLID 4.1 subsidiary label | Subsidiary label for 4.1 |
| 4 | POP marking shows packing group "Y" | PG validation (PG I requires X only) |
| 5 | Key 7 shows "Passenger and Cargo" | Aircraft limitation validation for P4 |
| 6 | Missing CARGO AIRCRAFT ONLY label | CAO label requirement for P4 |
| 7 | Key 14 empty instead of "4.1" | Subsidiary hazard documentation |
| 8 | Technical name format wrong - no parentheses | Technical name format validation |

---

## Scenario 5: A9.9 - UN1745 BROMINE PENTAFLUORIDE

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1745 |
| PSN | BROMINE PENTAFLUORIDE |
| Hazard Class | 5.1 |
| Packing Group | I |
| Subsidiary Risk | 6.1 (Toxic), 8 (Corrosive) |
| Packaging Paragraph | A9.9 |
| Special Provisions | P1, 1 |
| Technical Name Required | No |
| isFixed | true |

### Packaging Paragraph A9.9 Key Requirements

- **Material Type**: Bromine Pentafluoride or Bromine Trifluoride (extremely dangerous oxidizers)
- **CRITICAL**: **SPECIFIC cylinder specifications ONLY**:
  - 3A150, 3AA150, 3B240, 3BN150, 3E1800, 4B240, 4BA240, 4BW240
- **EXTREMELY DANGEROUS** - approved chemical safety mask and clothing must be available
- **NO pressure relief device allowed** on any cylinder
- Specification 3E1800 cylinders must be overpacked in a strong wooden box
- Each valve outlet must be sealed with threaded cap or threaded plug

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" (P1 provision) |
| Key 11 | "UN1745" |
| Key 12 | "BROMINE PENTAFLUORIDE" |
| Key 13 | "5.1" |
| Key 14 | "6.1, 8" |
| Key 15 | "I" |
| Key 16 | Net quantity + specific cylinder spec (e.g., "1 cylinder (3AA150) x 10 kg") |
| Key 17 | "A9.9" |

### Expected Package Inspection (Successful)

**Labels Required:**
- OXIDIZER 5.1 (primary)
- TOXIC 6.1 (subsidiary)
- CORROSIVE 8 (subsidiary)
- CARGO AIRCRAFT ONLY (P1 provision)

**Markings Required:**
- UN1745 (minimum 12mm height)
- PSN: "BROMINE PENTAFLUORIDE"
- Military Shipping Label (MSL)
- For 3E1800 cylinders: Outer packaging marked "INSIDE CONTAINERS COMPLY WITH PRESCRIBED SPECIFICATIONS"

**POP Marking Validation:**
- **MUST be one of these specific cylinder specs**: 3A150, 3AA150, 3B240, 3BN150, 3E1800, 4B240, 4BA240, 4BW240
- Packing group code: **X only** (PG I requires X)
- Valve outlet must be sealed

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | POP marking shows generic cylinder "3A" without pressure rating | Specific cylinder spec validation for A9.9 |
| 2 | POP marking shows drum code "1A1" | Cylinder-only packaging validation |
| 3 | Missing TOXIC 6.1 subsidiary label | Multiple subsidiary label validation |
| 4 | Missing CORROSIVE 8 subsidiary label | Multiple subsidiary label validation |
| 5 | POP marking shows packing group "Y" | PG validation (PG I requires X only) |
| 6 | Key 7 shows "Passenger and Cargo" | Aircraft limitation validation for P1 (most restrictive) |
| 7 | Missing CARGO AIRCRAFT ONLY label | CAO label requirement for P1 |
| 8 | For 3E1800: Missing "INSIDE CONTAINERS COMPLY WITH PRESCRIBED SPECIFICATIONS" | Special marking for 3E1800 overpack |

---

## Scenario 6: A9.10 - UN3356 OXYGEN GENERATORS, CHEMICAL

### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3356 |
| PSN | OXYGEN GENERATORS, CHEMICAL |
| Details | including when contained in associated equipment, e.g., passenger service units (PSU's) portable breathing equipment (PBE) etc. |
| Hazard Class | 5.1 |
| Packing Group | II |
| Subsidiary Risk | None |
| Packaging Paragraph | A9.10 |
| Special Provisions | P4, 60 |
| Technical Name Required | No |

### Packaging Paragraph A9.10 Key Requirements

- **Material Type**: Chemical Oxygen Generators (including those in PBE/PSU equipment)
- **Valid Packaging**:
  - Rigid outer packaging at PG I or II performance level (49 CFR Part 178, Subparts L and M)
  - OR ATA Specification No. 300 Category I Shipping Container
- **Impact Resistance**: Must withstand 1.8 meter drop without actuation
- **Inadvertent Actuation Protection**:
  - Mechanically actuated (not in PBE): Two pins OR one pin + retaining ring OR primer cover + pin
  - Electrically actuated: Electrical leads mechanically shorted and shielded in metal foil
  - In PBE: Pin to prevent actuator striking primer + protective bag/pouch/case
- **Additional Tests Required**: Flame Penetration Resistance Test, Thermal Resistance Test
- **FORBIDDEN**: After manufacturer's expiration date OR after contents expended

### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | "Cargo Aircraft Only" (P4 provision) |
| Key 11 | "UN3356" |
| Key 12 | "OXYGEN GENERATORS, CHEMICAL" (may include equipment description) |
| Key 13 | "5.1" |
| Key 14 | Empty (no subsidiary) |
| Key 15 | "II" |
| Key 16 | Net quantity + packaging (e.g., "2 fiberboard boxes (4G) x 0.5 kg") |
| Key 17 | "A9.10" |

### Expected Package Inspection (Successful)

**Labels Required:**
- OXIDIZER 5.1
- CARGO AIRCRAFT ONLY (P4 provision)

**Markings Required:**
- UN3356 (minimum 12mm height)
- PSN: "OXYGEN GENERATORS, CHEMICAL"
- **Outside surface marking**: "oxygen generator, chemical" (A14.4.4)
- If in equipment (e.g., sealed PSU): **"Oxygen Generator Inside"**
- Military Shipping Label (MSL)

**POP Marking Validation:**
- Packaging at PG I or II performance level
- OR ATA Specification No. 300 Category I container
- Packing group code: **X or Y** (PG II allows X or Y)

### Alterations (Frustration Testing)

| # | Alteration | Tests |
|---|------------|-------|
| 1 | Missing "oxygen generator, chemical" outside surface marking | Special marking requirement for oxygen generators |
| 2 | Equipment containing generator missing "Oxygen Generator Inside" marking | Equipment marking requirement |
| 3 | POP marking shows packing group "Z" | PG code validation (PG II requires X or Y) |
| 4 | Key 7 shows "Passenger and Cargo" | Aircraft limitation validation for P4 |
| 5 | Missing CARGO AIRCRAFT ONLY label | CAO label requirement for P4 |
| 6 | Oxygen generator past expiration date | Expiration date validation (FORBIDDEN for air transport) |
| 7 | Generator contents already expended | Expended generator validation (FORBIDDEN for air transport) |
| 8 | Key 15 empty | Packing group required for 5.1 |

---

## Quick Reference Tables

### Scenario Coverage Summary

| Scenario | UN Number | PSN | PG | Subsidiary | Packaging Para | Key Feature |
|----------|-----------|-----|-----|------------|----------------|-------------|
| 1 | UN3149 | HYDROGEN PEROXIDE AND PEROXYACETIC ACID MIXTURES, STABILIZED | II | 8 | A9.5 | Liquid oxidizer, orientation arrows |
| 2 | UN1438 | ALUMINIUM NITRATE | III | None | A9.6 | Solid oxidizer, bags allowed |
| 3 | UN2495 | IODINE PENTAFLUORIDE | I | 6.1, 8 | A9.7 | **Cylinders ONLY** |
| 4 | UN3137 | OXIDIZING SOLID, FLAMMABLE, N.O.S. | I | 4.1 | A9.8 | **Requires CAA**, tech name required |
| 5 | UN1745 | BROMINE PENTAFLUORIDE | I | 6.1, 8 | A9.9 | **Specific cylinder specs**, no pressure relief |
| 6 | UN3356 | OXYGEN GENERATORS, CHEMICAL | II | None | A9.10 | Drop test, actuation prevention, expiration check |

### Distribution by Packing Group

| Packing Group | Scenarios | Count | POP Code Requirements |
|---------------|-----------|-------|----------------------|
| I | 3, 4, 5 | 3 | X only |
| II | 1, 6 | 2 | X or Y |
| III | 2 | 1 | X, Y, or Z |

### Distribution by Subsidiary Risk

| Subsidiary | Scenarios | Count |
|------------|-----------|-------|
| None | 2, 6 | 2 |
| 8 (Corrosive) | 1 | 1 |
| 6.1 (Toxic), 8 (Corrosive) | 3, 5 | 2 |
| 4.1 (Flammable Solid) | 4 | 1 |

### Special Provision Coverage

| P Code | Aircraft Type | Scenarios |
|--------|--------------|-----------|
| P1 | Cargo Aircraft Only (most restrictive) | 5 |
| P3 | Cargo Aircraft Only | 3 |
| P4 | Cargo Aircraft Only | 4, 6 |
| P5 | Passenger and Cargo | 1, 2 |

### Packaging Type Restrictions by Paragraph

| Paragraph | Allowed Packaging Types |
|-----------|------------------------|
| A9.5 | Drums, Jerricans, Boxes, Composite (broad range for liquids) |
| A9.6 | Drums, Boxes, Bags, Jerricans (broad range for solids) |
| A9.7 | **CYLINDERS ONLY** (except DOT 8, 8AL) |
| A9.8 | **Per CAA only** (no standard codes) |
| A9.9 | **Specific cylinders**: 3A150, 3AA150, 3B240, 3BN150, 3E1800, 4B240, 4BA240, 4BW240 |
| A9.10 | PG I/II rigid outer OR ATA Spec 300 Category I |

---

## Alteration Types Tested

| Alteration Category | Scenarios |
|--------------------|-----------|
| POP Marking PG Code | 1, 3, 4, 5, 6 |
| Subsidiary Label Missing | 1, 3, 4, 5 |
| CAO Label/Aircraft Type | 3, 4, 5, 6 |
| Technical Name Missing (N.O.S.) | 4 |
| Packaging Paragraph Validation | 1, 2 |
| Cylinder-Only Validation | 3, 5 |
| Specific Cylinder Spec Validation | 5 |
| Key 15 (Packing Group) Empty/Wrong | 2, 6 |
| Special Markings (oxygen generator, inside containers) | 5, 6 |
| Expiration/Expended Validation | 6 |
| PSN Spelling/Format | 2 |
| Division Number on Label | 2 |
| Orientation Arrows (liquid) | 1 |
| Multiple Subsidiary Documentation | 3, 5 |

---

## Test Execution Notes

### Prerequisites

1. Ensure the app has all 6 materials loaded from the hazardous materials list
2. Verify the SDDG parser handles all SDDG keys (7, 11-17)
3. Confirm ML detection is trained for:
   - OXIDIZER 5.1 labels
   - TOXIC 6.1 labels
   - CORROSIVE 8 labels
   - FLAMMABLE SOLID 4.1 labels
   - CARGO AIRCRAFT ONLY labels
4. Validate POP marking parser can:
   - Extract PG codes (X, Y, Z)
   - Identify cylinder specifications
   - Validate packaging codes against allowed lists

### Key Validation Points per Paragraph

| Paragraph | Critical Validations |
|-----------|---------------------|
| A9.5 | Liquid packaging codes, orientation arrows, subsidiary label (8) |
| A9.6 | Solid packaging codes, PSN spelling, bags allowed |
| A9.7 | **Cylinders only**, multiple subsidiaries (6.1, 8), PG I = X only |
| A9.8 | **CAA required**, N.O.S. technical name, PG I = X only |
| A9.9 | **Specific cylinder specs**, multiple subsidiaries, special markings for 3E1800 |
| A9.10 | **Special markings**, expiration check, equipment marking, drop test compliance |

### Testing Flow

1. **SDDG Upload**: Upload SDDG with material data
2. **SDDG Validation**: Verify all keys are correctly parsed and validated
3. **Package Inspection**: Scan/photograph package
4. **ML Detection**: Verify all required labels detected
5. **POP Marking**: Validate packaging code and PG code against paragraph requirements
6. **Subsidiary Labels**: Check for all required subsidiary labels
7. **Markings**: Verify UN number and PSN match SDDG
8. **Special Markings**: Check paragraph-specific markings (oxygen generator, inside containers, etc.)
9. **MSL**: Confirm Military Shipping Label presence
10. **Frustration Testing**: Apply alterations and verify errors are caught

---

## References

- AFMAN 24-604, Attachment 9 (Packaging Instructions for Class 5)
- AFMAN 24-604, Attachment 14 (Marking Requirements)
- AFMAN 24-604, Attachment 15 (Labeling Requirements)
- AFMAN 24-604, Attachment 17 (SDDG Requirements)
- `src/hazardousMaterials/hazardousMaterialsList.ts` (Material data source)
