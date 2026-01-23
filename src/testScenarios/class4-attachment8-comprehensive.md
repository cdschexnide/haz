# Class 4 (Attachment 8) Comprehensive Test Scenarios

## Overview

This document contains test scenarios for Class 4 hazardous materials covering **all packaging paragraphs in AFMAN 24-604 Attachment 8** (A8.2 through A8.22). Each scenario tests a unique packaging paragraph with one representative material.

### Source Documents
- **Packaging Instructions**: AFMAN 24-604 Attachment 8 (docs/attachment8/afmanAttachment8.pdf)
- **Marking Requirements**: AFMAN 24-604 Attachment 14 (docs/attachment14/attachment14.pdf)
- **Labeling Requirements**: AFMAN 24-604 Attachment 15 (docs/attachment15/attachment15.pdf)
- **SDDG Requirements**: AFMAN 24-604 Attachment 17 (server/attachment17/attachment17.pdf)
- **Material Data**: src/hazardousMaterials/hazardousMaterialsList.ts

### Packaging Paragraph Reference

| Paragraph | Material Type | Division | Representative Material |
|-----------|--------------|----------|------------------------|
| A8.2 | Class 4 Liquids | 4.1, 4.2, 4.3 | UN1421 ALKALI METAL ALLOYS, LIQUID, N.O.S. |
| A8.3 | Class 4 Solids | 4.1, 4.2, 4.3 | UN1428 SODIUM |
| A8.4 | CAA Materials | 4.1 | UN2956 MUSK XYLENE |
| A8.5 | Pyrophoric Liquids | 4.2 | UN2870 ALUMINIUM BOROHYDRIDE |
| A8.7 | Self-Reactive Liquids D/F | 4.1 | UN3225 SELF-REACTIVE LIQUID TYPE D |
| A8.8 | Self-Reactive Solids F | 4.1 | UN3230 SELF-REACTIVE SOLID TYPE F |
| A8.10 | Barium Azide (wetted) | 4.1 | UN1571 BARIUM AZIDE |
| A8.11 | Pyrophoric Solids | 4.2 | UN1855 CALCIUM, PYROPHORIC |
| A8.12 | Nitrocellulose Film | 4.1 | UN1324 FILMS, NITROCELLULOSE BASE |
| A8.13 | Fusees | 4.1 | NA1325 FUSEE |
| A8.14 | Matches | 4.1 | UN1944 MATCHES, SAFETY |
| A8.15 | Articles with Flammable Solid | 4.1 | UN3541 ARTICLES CONTAINING FLAMMABLE SOLID, N.O.S. |
| A8.16 | Phosphorus (white/yellow) | 4.2 | UN1381 PHOSPHORUS, WHITE, DRY |
| A8.17 | Smokeless Powder | 4.1 | NA3178 SMOKELESS POWDER FOR SMALL ARMS |
| A8.18 | Sodium Batteries/Cells | 4.3 | UN3292 BATTERIES, CONTAINING SODIUM |
| A8.19 | Polyester Resin Kits | 4.1 | UN3527 POLYESTER RESIN KIT |
| A8.20-22 | Fuel Cell Cartridges | 4.3 | UN3476 FUEL CELL CARTRIDGES |

**Note**: A8.6 and A8.9 cover specific chemical compounds (Diphenyloxide-4,4-Disulphohydrazide; Diazo compounds) not present in the hazardousMaterialsList.

---

## Class 4 Label Reference

| Division | Label Name | Color Scheme |
|----------|-----------|--------------|
| 4.1 | FLAMMABLE SOLID | Red/white vertical stripes |
| 4.2 | SPONTANEOUSLY COMBUSTIBLE | Upper white, lower red |
| 4.3 | DANGEROUS WHEN WET | Blue background |

---

## A8.2 - Class 4 Liquids

### Scenario 1: UN1421 - ALKALI METAL ALLOYS, LIQUID, N.O.S.

**Purpose**: Test Class 4.3 liquid material requiring N.O.S. technical name, orientation labels, PG I

#### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1421 |
| PSN | ALKALI METAL ALLOYS, LIQUID, N.O.S. |
| Technical Name | (Sodium-potassium alloy) |
| Hazard Class/Division | 4.3 |
| Packing Group | I |
| Packaging Paragraph | A8.2. |
| Special Provisions | P3, A2, A7, N34 |
| Subsidiary Risk | None |

#### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | Cargo Aircraft Only |
| Key 11 | UN1421 |
| Key 12 | ALKALI METAL ALLOYS, LIQUID, N.O.S. (Sodium-potassium alloy) |
| Key 13 | 4.3 |
| Key 14 | (empty) |
| Key 15 | I |
| Key 16 | 1 steel drum (1A1) x 25 L |
| Key 17 | A8.2. |

#### Expected Package Inspection (Successful)

**Labels Required:**
- DANGEROUS WHEN WET (Division 4.3) - Blue
- Cargo Aircraft Only
- Orientation arrows (This Side Up) - liquid material

**Markings Required:**
- UN1421 (minimum 12mm height)
- ALKALI METAL ALLOYS, LIQUID, N.O.S. (Sodium-potassium alloy)
- Technical name visible in parentheses

**POP Marking Validation:**
- Packaging Code: 1A1
- Packing Group Rating: X (required for PG I)
- Test Pressure: ≥250 kPa (liquids, PG I)

#### Alterations (Frustration Testing)

| # | Category | Alteration | Expected Result |
|---|----------|------------|-----------------|
| 1 | SDDG - Key 12 | Technical name missing: "ALKALI METAL ALLOYS, LIQUID, N.O.S." | Frustration: Missing technical name for N.O.S. entry |
| 2 | Label | Missing orientation arrows | Frustration: Liquid materials require orientation labels |
| 3 | POP Marking | Packing group code "Y" instead of "X" | Frustration: PG I material requires X-rated packaging |

---

## A8.3 - Class 4 Solids

### Scenario 2: UN1428 - SODIUM

**Purpose**: Test common Class 4.3 solid, PG I, no N.O.S./technical name

#### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1428 |
| PSN | SODIUM |
| Hazard Class/Division | 4.3 |
| Packing Group | I |
| Packaging Paragraph | A8.3. |
| Special Provisions | P3, A7, A8, A19, A20, N34 |
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

**POP Marking Validation:**
- Packaging Code: 1A2
- Packing Group Rating: X (required for PG I)
- Contents Indicator: S (solids)

#### Alterations (Frustration Testing)

| # | Category | Alteration | Expected Result |
|---|----------|------------|-----------------|
| 1 | Label | Division 4.1 FLAMMABLE SOLID label instead of 4.3 | Frustration: Wrong division label |
| 2 | SDDG - Key 7 | Shows "Passenger and Cargo Aircraft" | Frustration: P3 requires Cargo Aircraft Only |
| 3 | POP Marking | Packing group code "Z" instead of "X" | Frustration: PG I requires X-rated packaging |

---

## A8.4 - CAA Materials (Self-Reactive)

### Scenario 3: UN2956 - MUSK XYLENE

**Purpose**: Test Class 4.1 material requiring Competent Authority Approval (CAA)

#### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN2956 |
| PSN | MUSK XYLENE |
| Alternate PSN | 5-TERT-BUTYL-2,4,6-TRINITRO-M-XYLENE |
| Hazard Class/Division | 4.1 |
| Packing Group | III |
| Packaging Paragraph | A8.4. |
| Special Provisions | P5 |
| Subsidiary Risk | None |

#### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | Passenger and Cargo Aircraft |
| Key 11 | UN2956 |
| Key 12 | MUSK XYLENE |
| Key 13 | 4.1 |
| Key 14 | (empty) |
| Key 15 | III |
| Key 16 | 1 fiberboard box (4G) x 25 kg |
| Key 17 | A8.4. |

#### Expected Package Inspection (Successful)

**Labels Required:**
- FLAMMABLE SOLID (Division 4.1) - Red/white vertical stripes

**Markings Required:**
- UN2956 (minimum 12mm height)
- MUSK XYLENE

**POP Marking Validation:**
- Packaging per CAA requirements
- Packing Group Rating: Z (authorized for PG III)

**Special Note**: A8.4 materials must be prepared according to Competent Authority Approval (CAA). Packaging must comply with the CAA (T-0).

#### Alterations (Frustration Testing)

| # | Category | Alteration | Expected Result |
|---|----------|------------|-----------------|
| 1 | SDDG - Key 17 | Shows "A8.3." instead of "A8.4." | Frustration: Incorrect packaging paragraph - CAA materials require A8.4. |
| 2 | SDDG - Key 15 | Shows "II" instead of "III" | Frustration: Incorrect packing group |
| 3 | SDDG - Key 13 | Shows "4" instead of "4.1" | Frustration: Must specify full division |

---

## A8.5 - Pyrophoric Liquids

### Scenario 4: UN2870 - ALUMINIUM BOROHYDRIDE

**Purpose**: Test Division 4.2 pyrophoric liquid with 4.3 subsidiary risk

#### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN2870 |
| PSN | ALUMINIUM BOROHYDRIDE |
| Hazard Class/Division | 4.2 |
| Packing Group | I |
| Packaging Paragraph | A8.5. |
| Special Provisions | P3 |
| Subsidiary Risk | 4.3 |

#### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | Cargo Aircraft Only |
| Key 11 | UN2870 |
| Key 12 | ALUMINIUM BOROHYDRIDE |
| Key 13 | 4.2 |
| Key 14 | 4.3 |
| Key 15 | I |
| Key 16 | 2 steel cylinders x 5 L each |
| Key 17 | A8.5. |

#### Expected Package Inspection (Successful)

**Labels Required:**
- SPONTANEOUSLY COMBUSTIBLE (Division 4.2) - Upper white, lower red
- DANGEROUS WHEN WET (4.3) - Blue (subsidiary)
- Cargo Aircraft Only
- Orientation arrows (This Side Up) - liquid material

**Markings Required:**
- UN2870 (minimum 12mm height)
- ALUMINIUM BOROHYDRIDE

**POP Marking Validation:**
- Steel or nickel specification cylinder (min 1206 kPa design pressure)
- Or combination packaging per A8.5.2/A8.5.3

**Note**: Per A15.4.4, Division 4.1 subsidiary label is NOT required when 4.2 label is present.

#### Alterations (Frustration Testing)

| # | Category | Alteration | Expected Result |
|---|----------|------------|-----------------|
| 1 | Label | Missing DANGEROUS WHEN WET (4.3) subsidiary label | Frustration: Subsidiary hazard label required |
| 2 | SDDG - Key 14 | Empty (should be "4.3") | Frustration: Missing subsidiary risk declaration |
| 3 | Label | Missing orientation arrows | Frustration: Liquid materials require orientation labels |

---

## A8.7 - Self-Reactive Liquid Type D/F

### Scenario 5: UN3225 - SELF-REACTIVE LIQUID TYPE D

**Purpose**: Test Division 4.1 self-reactive liquid, no temperature control required

#### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3225 |
| PSN | SELF-REACTIVE LIQUID TYPE D |
| Hazard Class/Division | 4.1 |
| Packing Group | (none - self-reactive) |
| Packaging Paragraph | A8.7. |
| Special Provisions | P5 |
| Subsidiary Risk | None |
| Technical Name Required | Yes |

#### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | Passenger and Cargo Aircraft |
| Key 11 | UN3225 |
| Key 12 | SELF-REACTIVE LIQUID TYPE D (technical name per A4.5.3) |
| Key 13 | 4.1 |
| Key 14 | (empty) |
| Key 15 | (empty - self-reactive substances have no PG) |
| Key 16 | 4 glass bottles in fiberboard box (4G) x 0.5 L each |
| Key 17 | A8.7. |

#### Expected Package Inspection (Successful)

**Labels Required:**
- FLAMMABLE SOLID (Division 4.1) - Red/white vertical stripes
- KEEP AWAY FROM HEAT (required for self-reactive substances per A15.3.5)
- Orientation arrows (liquid)

**Markings Required:**
- UN3225 (minimum 12mm height)
- SELF-REACTIVE LIQUID TYPE D
- Technical name in parentheses

**POP Marking Validation:**
- Packaging Code: 4G or 1G
- Temperature controls NOT required for Type D

#### Alterations (Frustration Testing)

| # | Category | Alteration | Expected Result |
|---|----------|------------|-----------------|
| 1 | Label | Missing KEEP AWAY FROM HEAT label | Frustration: Required for self-reactive substances |
| 2 | SDDG - Key 15 | Shows "II" (should be empty for self-reactive) | Frustration: Self-reactive substances do not have packing groups |
| 3 | SDDG - Key 12 | Technical name missing | Frustration: Technical name required per A4.5.3 |

---

## A8.8 - Self-Reactive Solid Type F

### Scenario 6: UN3230 - SELF-REACTIVE SOLID TYPE F

**Purpose**: Test Division 4.1 self-reactive solid

#### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3230 |
| PSN | SELF-REACTIVE SOLID TYPE F |
| Hazard Class/Division | 4.1 |
| Packing Group | (none - self-reactive) |
| Packaging Paragraph | A8.8. |
| Special Provisions | P5 |
| Subsidiary Risk | None |
| Technical Name Required | Yes |

#### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | Passenger and Cargo Aircraft |
| Key 11 | UN3230 |
| Key 12 | SELF-REACTIVE SOLID TYPE F (technical name per A4.5.3) |
| Key 13 | 4.1 |
| Key 14 | (empty) |
| Key 15 | (empty - self-reactive) |
| Key 16 | 1 fiber drum (1G) x 50 kg |
| Key 17 | A8.8. |

#### Expected Package Inspection (Successful)

**Labels Required:**
- FLAMMABLE SOLID (Division 4.1) - Red/white vertical stripes
- KEEP AWAY FROM HEAT

**Markings Required:**
- UN3230 (minimum 12mm height)
- SELF-REACTIVE SOLID TYPE F
- Technical name in parentheses

**POP Marking Validation:**
- Packaging Code: 1G (fiber drum with plastic liner)
- Max gross weight: 50 kg (110 lbs)

#### Alterations (Frustration Testing)

| # | Category | Alteration | Expected Result |
|---|----------|------------|-----------------|
| 1 | Label | Missing KEEP AWAY FROM HEAT label | Frustration: Required for self-reactive substances |
| 2 | SDDG - Key 17 | Shows "A8.7." (liquids) instead of "A8.8." (solids) | Frustration: Incorrect packaging paragraph |
| 3 | Marking | Technical name missing from package | Frustration: Technical name required on marking |

---

## A8.10 - Barium Azide (Wetted)

### Scenario 7: UN1571 - BARIUM AZIDE

**Purpose**: Test wetted explosive classified as 4.1 with 6.1 subsidiary

#### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1571 |
| PSN | BARIUM AZIDE |
| Details | wetted with 50% or more water, by mass |
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
| Key 12 | BARIUM AZIDE, wetted with not less than 50% water, by mass |
| Key 13 | 4.1 |
| Key 14 | 6.1 |
| Key 15 | I |
| Key 16 | 4 glass receptacles in wooden box (4C1) x 0.5 kg each |
| Key 17 | A8.10. |

#### Expected Package Inspection (Successful)

**Labels Required:**
- FLAMMABLE SOLID (Division 4.1) - Red/white vertical stripes
- TOXIC (6.1) - White with skull and crossbones
- Cargo Aircraft Only

**Markings Required:**
- UN1571 (minimum 12mm height)
- BARIUM AZIDE, wetted with not less than 50% water, by mass

**POP Marking Validation:**
- Packaging Code: 4C1, 4C2, 4D, 4F (wood), or 1G (fiber)
- Inner glass receptacles: max 0.5 kg each
- Rubber stoppers wire-tied for securement

#### Alterations (Frustration Testing)

| # | Category | Alteration | Expected Result |
|---|----------|------------|-----------------|
| 1 | Label | Missing TOXIC (6.1) subsidiary label | Frustration: Subsidiary hazard label required |
| 2 | SDDG - Key 14 | Empty (should be "6.1") | Frustration: Missing subsidiary risk declaration |
| 3 | POP Marking | Packing group code "Y" instead of "X" | Frustration: PG I material requires X-rated packaging |

---

## A8.11 - Pyrophoric Solids

### Scenario 8: UN1855 - CALCIUM, PYROPHORIC

**Purpose**: Test Division 4.2 pyrophoric solid

#### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1855 |
| PSN | CALCIUM, PYROPHORIC |
| Hazard Class/Division | 4.2 |
| Packing Group | I |
| Packaging Paragraph | A8.11. |
| Special Provisions | P3 |
| Subsidiary Risk | None |

#### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | Cargo Aircraft Only |
| Key 11 | UN1855 |
| Key 12 | CALCIUM, PYROPHORIC |
| Key 13 | 4.2 |
| Key 14 | (empty) |
| Key 15 | I |
| Key 16 | 2 metal receptacles in wooden box (4C1) x 15 kg each |
| Key 17 | A8.11. |

#### Expected Package Inspection (Successful)

**Labels Required:**
- SPONTANEOUSLY COMBUSTIBLE (Division 4.2) - Upper white, lower red
- Cargo Aircraft Only

**Markings Required:**
- UN1855 (minimum 12mm height)
- CALCIUM, PYROPHORIC

**POP Marking Validation:**
- Outer: 4C1, 4C2, 4D, 4F (wood), 4G (fiberboard), 1G, 1D, or metal drums
- Inner: Metal receptacles with positive closure (NOT friction)
- Max inner capacity: 15 kg each (7.5 kg for 4G)

#### Alterations (Frustration Testing)

| # | Category | Alteration | Expected Result |
|---|----------|------------|-----------------|
| 1 | Label | Division 4.1 FLAMMABLE SOLID label instead of 4.2 | Frustration: Wrong division label |
| 2 | SDDG - Key 7 | Shows "Passenger and Cargo Aircraft" | Frustration: P3 requires Cargo Aircraft Only |
| 3 | SDDG - Key 17 | Shows "A8.3." instead of "A8.11." | Frustration: Pyrophoric solids require A8.11. |

---

## A8.12 - Nitrocellulose Film

### Scenario 9: UN1324 - FILMS, NITROCELLULOSE BASE

**Purpose**: Test Division 4.1 nitrocellulose film

#### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1324 |
| PSN | FILMS, NITROCELLULOSE BASE |
| Details | gelatine coated (except scrap) |
| Hazard Class/Division | 4.1 |
| Packing Group | III |
| Packaging Paragraph | A8.12. |
| Special Provisions | P5 |
| Subsidiary Risk | None |

#### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | Passenger and Cargo Aircraft |
| Key 11 | UN1324 |
| Key 12 | FILMS, NITROCELLULOSE BASE, gelatine coated (except scrap) |
| Key 13 | 4.1 |
| Key 14 | (empty) |
| Key 15 | III |
| Key 16 | 2 fiberboard boxes (4G) x 30 kg each |
| Key 17 | A8.12. |

#### Expected Package Inspection (Successful)

**Labels Required:**
- FLAMMABLE SOLID (Division 4.1) - Red/white vertical stripes

**Markings Required:**
- UN1324 (minimum 12mm height)
- FILMS, NITROCELLULOSE BASE

**POP Marking Validation:**
- Packaging Code: 1A2, 1B2, 1D, 1G, 3A2, 3B2, 4A, 4B, 4C1, 4C2, 4D, 4F, 4G, 4N
- Each reel in tightly closed inner packaging
- Cover secured with adhesive tape or paper
- Fiber drums/fiberboard boxes: only for film not exceeding 600 m

#### Alterations (Frustration Testing)

| # | Category | Alteration | Expected Result |
|---|----------|------------|-----------------|
| 1 | SDDG - Key 15 | Empty (should be "III") | Frustration: Packing group required |
| 2 | SDDG - Key 13 | Shows "4" instead of "4.1" | Frustration: Must specify full division |
| 3 | POP Marking | Packing group code "X" (overkill but valid) | No frustration - X is authorized for PG III |

---

## A8.13 - Fusees

### Scenario 10: NA1325 - FUSEE (Railway or Highway)

**Purpose**: Test Division 4.1 fusee (domestic shipment)

#### Material Details

| Field | Value |
|-------|-------|
| UN Number | NA1325 |
| PSN | FUSEE |
| Details | railway or highway |
| Hazard Class/Division | 4.1 |
| Packing Group | II |
| Packaging Paragraph | A8.13. |
| Special Provisions | P5 |
| Subsidiary Risk | None |
| Domestic Only | Yes |

#### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | Passenger and Cargo Aircraft |
| Key 11 | NA1325 |
| Key 12 | FUSEE, railway or highway |
| Key 13 | 4.1 |
| Key 14 | (empty) |
| Key 15 | II |
| Key 16 | 1 fiberboard box (4G) x 20 kg |
| Key 17 | A8.13. |

#### Expected Package Inspection (Successful)

**Labels Required:**
- FLAMMABLE SOLID (Division 4.1) - Red/white vertical stripes

**Markings Required:**
- NA1325 (minimum 12mm height) - Note: NA prefix for domestic
- FUSEE

**POP Marking Validation:**
- Packaging Code: 1A2, 1D, 1G, 3A2, 4C1, 4C2, 4D, 4F, 4G
- Fusees with spikes: reinforced ends to prevent penetration
- Packages must pass drop test with spike in downward position

#### Alterations (Frustration Testing)

| # | Category | Alteration | Expected Result |
|---|----------|------------|-----------------|
| 1 | SDDG - Key 11 | Shows "UN1325" instead of "NA1325" | Frustration: Incorrect ID number prefix for domestic shipment |
| 2 | POP Marking | Packing group code "Z" instead of "Y" | Frustration: PG II requires Y or X rated packaging |
| 3 | SDDG - Key 17 | Shows "A8.3." instead of "A8.13." | Frustration: Fusees require A8.13. |

---

## A8.14 - Matches

### Scenario 11: UN1944 - MATCHES, SAFETY

**Purpose**: Test Division 4.1 safety matches

#### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1944 |
| PSN | MATCHES, SAFETY |
| Details | book, card or strike on box |
| Hazard Class/Division | 4.1 |
| Packing Group | III |
| Packaging Paragraph | A8.14 |
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
| Key 16 | 2 fiberboard boxes (4G) x 25 kg each |
| Key 17 | A8.14. |

#### Expected Package Inspection (Successful)

**Labels Required:**
- FLAMMABLE SOLID (Division 4.1) - Red/white vertical stripes

**Markings Required:**
- UN1944 (minimum 12mm height)
- MATCHES, SAFETY (book, card or strike on box)

**POP Marking Validation:**
- Packaging Code: 1A1, 1A2, 1B1, 1B2, 1D, 1G, 1N1, 1N2, 3A1, 3A2, 3B1, 3B2, 4A, 4B, 4C1, 4C2, 4D, 4F, 4G, 4N
- Packing Group Rating: Z (authorized for PG III)
- Matches must NOT ignite spontaneously at 93.3C (200F) for 8 consecutive hours

#### Alterations (Frustration Testing)

| # | Category | Alteration | Expected Result |
|---|----------|------------|-----------------|
| 1 | SDDG - Key 13 | Shows "4" instead of "4.1" | Frustration: Must specify full division |
| 2 | Marking | UN number shows "UN1945" (matches, wax) | Frustration: UN number mismatch with PSN |
| 3 | SDDG - Key 15 | Shows "II" instead of "III" | Frustration: Incorrect packing group |

---

## A8.15 - Articles Containing Flammable Solid

### Scenario 12: UN3541 - ARTICLES CONTAINING FLAMMABLE SOLID, N.O.S.

**Purpose**: Test articles containing flammable solids, N.O.S. entry

#### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3541 |
| PSN | ARTICLES CONTAINING FLAMMABLE SOLID, N.O.S. |
| Hazard Class/Division | 4.1 |
| Packing Group | (none for articles) |
| Packaging Paragraph | A8.15 |
| Special Provisions | P5, 391 |
| Subsidiary Risk | None |
| Technical Name Required | Yes |

#### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | Passenger and Cargo Aircraft |
| Key 11 | UN3541 |
| Key 12 | ARTICLES CONTAINING FLAMMABLE SOLID, N.O.S. (technical name) |
| Key 13 | 4.1 |
| Key 14 | (empty) |
| Key 15 | (empty - articles) |
| Key 16 | 2 fiberboard boxes (4G) x 25 kg each |
| Key 17 | A8.15 |

#### Expected Package Inspection (Successful)

**Labels Required:**
- FLAMMABLE SOLID (Division 4.1) - Red/white vertical stripes

**Markings Required:**
- UN3541 (minimum 12mm height)
- ARTICLES CONTAINING FLAMMABLE SOLID, N.O.S.
- Technical name in parentheses

**POP Marking Validation:**
- Performance Level: PG II required
- Packaging Code: 1A2, 1B2, 1N2, 1D, 1G, 1H2, 3A2, 3B2, 3H2, 4A, 4B, 4C1, 4C2, 4D, 4F, 4G, 4H1, 4H2, 4N
- Max net quantity per package: 50 kg
- Robust articles may be transported unpackaged or on pallets (A8.15.2)

#### Alterations (Frustration Testing)

| # | Category | Alteration | Expected Result |
|---|----------|------------|-----------------|
| 1 | SDDG - Key 12 | Technical name missing | Frustration: N.O.S. entry requires technical name |
| 2 | Marking | Technical name missing from package | Frustration: Technical name required on package marking |
| 3 | SDDG - Key 17 | Shows "A8.3." instead of "A8.15" | Frustration: Articles require A8.15 |

---

## A8.16 - Phosphorus (White/Yellow)

### Scenario 13: UN1381 - PHOSPHORUS, WHITE, DRY

**Purpose**: Test Division 4.2 phosphorus with 6.1 subsidiary

#### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN1381 |
| PSN | PHOSPHORUS, WHITE, DRY |
| Hazard Class/Division | 4.2 |
| Packing Group | I |
| Packaging Paragraph | A8.16. |
| Special Provisions | P3, N34 |
| Subsidiary Risk | 6.1 |

#### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | Cargo Aircraft Only |
| Key 11 | UN1381 |
| Key 12 | PHOSPHORUS, WHITE, DRY |
| Key 13 | 4.2 |
| Key 14 | 6.1 |
| Key 15 | I |
| Key 16 | 1 steel drum (1A2) x 50 kg |
| Key 17 | A8.16. |

#### Expected Package Inspection (Successful)

**Labels Required:**
- SPONTANEOUSLY COMBUSTIBLE (Division 4.2) - Upper white, lower red
- TOXIC (6.1) - White with skull and crossbones
- Cargo Aircraft Only

**Markings Required:**
- UN1381 (minimum 12mm height)
- PHOSPHORUS, WHITE, DRY

**POP Marking Validation:**
- For dry phosphorus: Cast solid required
- Packaging Code: 1A2, 1B2, 1N2 (steel/aluminum/metal drums) - max 115 L (30 gal)
- Or projectiles/bombs without bursting elements (T-0)

#### Alterations (Frustration Testing)

| # | Category | Alteration | Expected Result |
|---|----------|------------|-----------------|
| 1 | Label | Missing TOXIC (6.1) subsidiary label | Frustration: Subsidiary hazard label required |
| 2 | SDDG - Key 14 | Empty (should be "6.1") | Frustration: Missing subsidiary risk declaration |
| 3 | SDDG - Key 7 | Shows "Passenger and Cargo Aircraft" | Frustration: P3 requires Cargo Aircraft Only |

---

## A8.17 - Smokeless Powder

### Scenario 14: NA3178 - SMOKELESS POWDER FOR SMALL ARMS

**Purpose**: Test Division 4.1 smokeless powder (domestic only)

#### Material Details

| Field | Value |
|-------|-------|
| UN Number | NA3178 |
| PSN | SMOKELESS POWDER FOR SMALL ARMS |
| Details | 100 pounds or less |
| Hazard Class/Division | 4.1 |
| Packing Group | I |
| Packaging Paragraph | A8.17. |
| Special Provisions | P4 |
| Subsidiary Risk | None |
| Domestic Only | Yes |

#### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | Cargo Aircraft Only |
| Key 11 | NA3178 |
| Key 12 | SMOKELESS POWDER FOR SMALL ARMS (100 pounds or less) |
| Key 13 | 4.1 |
| Key 14 | (empty) |
| Key 15 | I |
| Key 16 | 10 inner containers in 1 fiberboard box (4G) x 3.6 kg each inner |
| Key 17 | A8.17. |

#### Expected Package Inspection (Successful)

**Labels Required:**
- FLAMMABLE SOLID (Division 4.1) - Red/white vertical stripes
- Cargo Aircraft Only

**Markings Required:**
- NA3178 (minimum 12mm height) - Note: NA prefix for domestic
- SMOKELESS POWDER FOR SMALL ARMS

**POP Marking Validation:**
- Combination packaging ONLY
- Inner packagings: max 3.6 kg (8 lbs) net mass each
- Outer packaging: UN 4G fiberboard boxes meeting PG I standards
- Max on aircraft: 45.4 kg (100 lbs)

#### Alterations (Frustration Testing)

| # | Category | Alteration | Expected Result |
|---|----------|------------|-----------------|
| 1 | SDDG - Key 7 | Shows "Passenger and Cargo Aircraft" | Frustration: P4 requires Cargo Aircraft Only |
| 2 | Label | Missing Cargo Aircraft Only label | Frustration: P4 requires CAO label |
| 3 | POP Marking | Packing group code "Y" instead of "X" | Frustration: PG I material requires X-rated packaging |

---

## A8.18 - Sodium Batteries/Cells

### Scenario 15: UN3292 - BATTERIES, CONTAINING SODIUM

**Purpose**: Test Division 4.3 sodium batteries

#### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3292 |
| PSN | BATTERIES, CONTAINING SODIUM |
| Hazard Class/Division | 4.3 |
| Packing Group | (none for batteries) |
| Packaging Paragraph | A8.18. |
| Special Provisions | P5 |
| Subsidiary Risk | None |

#### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | Passenger and Cargo Aircraft |
| Key 11 | UN3292 |
| Key 12 | BATTERIES, CONTAINING SODIUM |
| Key 13 | 4.3 |
| Key 14 | (empty) |
| Key 15 | (empty - batteries) |
| Key 16 | 2 batteries (unpackaged or protective packaging) |
| Key 17 | A8.18. |

#### Expected Package Inspection (Successful)

**Labels Required:**
- DANGEROUS WHEN WET (Division 4.3) - Blue

**Markings Required:**
- UN3292 (minimum 12mm height)
- BATTERIES, CONTAINING SODIUM

**POP Marking Validation:**
- Batteries in metal casing: UN specification containers NOT required
- May ship unpackaged or in non-specification protective packaging
- Cells secured within and fully enclosed by metal casing (T-0)
- Do NOT transport at temperature where liquid elemental sodium is present
- External battery temperature: max 55C (130F)

#### Alterations (Frustration Testing)

| # | Category | Alteration | Expected Result |
|---|----------|------------|-----------------|
| 1 | Label | Division 4.1 FLAMMABLE SOLID label instead of 4.3 | Frustration: Wrong division label |
| 2 | SDDG - Key 13 | Shows "4" instead of "4.3" | Frustration: Must specify full division |
| 3 | SDDG - Key 17 | Shows "A8.3." instead of "A8.18." | Frustration: Sodium batteries require A8.18. |

---

## A8.19 - Polyester Resin Kits

### Scenario 16: UN3527 - POLYESTER RESIN KIT

**Purpose**: Test Division 4.1 polyester resin kit (two-component)

#### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3527 |
| PSN | POLYESTER RESIN KIT |
| Details | solid base material |
| Hazard Class/Division | 4.1 |
| Packing Group | II |
| Packaging Paragraph | A8.19. |
| Special Provisions | P5 |
| Subsidiary Risk | None |

#### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | Passenger and Cargo Aircraft |
| Key 11 | UN3527 |
| Key 12 | POLYESTER RESIN KIT, solid base material |
| Key 13 | 4.1 |
| Key 14 | (empty) |
| Key 15 | II |
| Key 16 | 1 fiberboard box (4G) containing base + activator x 5 kg total |
| Key 17 | A8.19. |

#### Expected Package Inspection (Successful)

**Labels Required:**
- FLAMMABLE SOLID (Division 4.1) - Red/white vertical stripes

**Markings Required:**
- UN3527 (minimum 12mm height)
- POLYESTER RESIN KIT

**POP Marking Validation:**
- Two components: base material (Class 4.1) + organic peroxide activator
- Components separately packed in inner packagings
- PG II base: max 5 kg total per package
- Organic peroxide: max 125 ml liquids; 500 g solids per inner
- Only Type D, E, or F organic peroxides (no temperature control required)

#### Alterations (Frustration Testing)

| # | Category | Alteration | Expected Result |
|---|----------|------------|-----------------|
| 1 | SDDG - Key 15 | Empty (should be "II") | Frustration: Packing group required |
| 2 | POP Marking | Packing group code "Z" instead of "Y" | Frustration: PG II requires Y or X rated packaging |
| 3 | SDDG - Key 17 | Shows "A8.3." instead of "A8.19." | Frustration: Polyester resin kits require A8.19. |

---

## A8.20/A8.21/A8.22 - Fuel Cell Cartridges

### Scenario 17: UN3476 - FUEL CELL CARTRIDGES (water-reactive)

**Purpose**: Test Division 4.3 fuel cell cartridges

#### Material Details

| Field | Value |
|-------|-------|
| UN Number | UN3476 |
| PSN | FUEL CELL CARTRIDGES |
| Details | containing water-reactive substances |
| Hazard Class/Division | 4.3 |
| Packing Group | II |
| Packaging Paragraph | A8.20., A8.21., A8.22. |
| Special Provisions | P5, 328 |
| Subsidiary Risk | None |

#### Expected SDDG Inspection (Successful)

| Key | Expected Value |
|-----|----------------|
| Key 7 | Passenger and Cargo Aircraft |
| Key 11 | UN3476 |
| Key 12 | FUEL CELL CARTRIDGES, containing water-reactive substances |
| Key 13 | 4.3 |
| Key 14 | (empty) |
| Key 15 | II |
| Key 16 | 4 fuel cell cartridges in fiberboard box (4G) x 1 kg each |
| Key 17 | A8.20. |

#### Expected Package Inspection (Successful)

**Labels Required:**
- DANGEROUS WHEN WET (Division 4.3) - Blue

**Markings Required:**
- UN3476 (minimum 12mm height)
- FUEL CELL CARTRIDGES

**POP Marking Validation:**
- A8.20: Cartridges alone - max fuel cell weight 1 kg
- A8.21: Contained in equipment - UN spec NOT required, strong outer container
- A8.22: Packed with equipment - UN spec NOT required, strong outer container
- Packaging Codes (A8.20): 1D, 1G, 1H2, 3H2, 4C1, 4C2, 4D, 4F, 4G, 4H2

#### Alterations (Frustration Testing)

| # | Category | Alteration | Expected Result |
|---|----------|------------|-----------------|
| 1 | Label | Division 4.1 FLAMMABLE SOLID label instead of 4.3 | Frustration: Wrong division label |
| 2 | POP Marking | Packing group code "Z" instead of "Y" | Frustration: PG II requires Y or X rated packaging |
| 3 | SDDG - Key 13 | Shows "4" instead of "4.3" | Frustration: Must specify full division |

---

## Quick Reference Tables

### Alteration Categories Summary

| Category | Scenarios Tested |
|----------|-----------------|
| SDDG - Key 7 (Aircraft) | 1, 2, 4, 8, 13, 14 |
| SDDG - Key 11 (UN Number) | 10 |
| SDDG - Key 12 (PSN/Tech Name) | 1, 5, 6, 12 |
| SDDG - Key 13 (Division) | 3, 6, 9, 11, 15, 17 |
| SDDG - Key 14 (Subsidiary) | 4, 7, 13 |
| SDDG - Key 15 (Packing Group) | 3, 5, 9, 11, 16 |
| SDDG - Key 17 (Paragraph) | 3, 6, 8, 10, 12, 15, 16 |
| Label - Wrong Division | 2, 4, 8, 15, 17 |
| Label - Missing Subsidiary | 4, 7, 13 |
| Label - Missing CAO | 14 |
| Label - Missing Orientation | 1, 4 |
| Label - Missing Keep Away | 5, 6 |
| Marking - UN Number | 10, 11 |
| Marking - Tech Name Missing | 6, 12 |
| POP - Wrong PG Code | 1, 2, 7, 10, 14, 16, 17 |

### Division Coverage

| Division | Scenarios |
|----------|-----------|
| 4.1 - Flammable Solids | 3, 5, 6, 7, 9, 10, 11, 12, 14, 16 |
| 4.2 - Spontaneously Combustible | 4, 8, 13 |
| 4.3 - Dangerous When Wet | 1, 2, 15, 17 |

### Packaging Paragraph Coverage

| Paragraph | Scenario | Material |
|-----------|----------|----------|
| A8.2 | 1 | UN1421 ALKALI METAL ALLOYS, LIQUID, N.O.S. |
| A8.3 | 2 | UN1428 SODIUM |
| A8.4 | 3 | UN2956 MUSK XYLENE |
| A8.5 | 4 | UN2870 ALUMINIUM BOROHYDRIDE |
| A8.7 | 5 | UN3225 SELF-REACTIVE LIQUID TYPE D |
| A8.8 | 6 | UN3230 SELF-REACTIVE SOLID TYPE F |
| A8.10 | 7 | UN1571 BARIUM AZIDE |
| A8.11 | 8 | UN1855 CALCIUM, PYROPHORIC |
| A8.12 | 9 | UN1324 FILMS, NITROCELLULOSE BASE |
| A8.13 | 10 | NA1325 FUSEE |
| A8.14 | 11 | UN1944 MATCHES, SAFETY |
| A8.15 | 12 | UN3541 ARTICLES CONTAINING FLAMMABLE SOLID, N.O.S. |
| A8.16 | 13 | UN1381 PHOSPHORUS, WHITE, DRY |
| A8.17 | 14 | NA3178 SMOKELESS POWDER FOR SMALL ARMS |
| A8.18 | 15 | UN3292 BATTERIES, CONTAINING SODIUM |
| A8.19 | 16 | UN3527 POLYESTER RESIN KIT |
| A8.20-22 | 17 | UN3476 FUEL CELL CARTRIDGES |

---

## Test Execution Notes

### Before Testing

1. **Verify materials exist** in `src/hazardousMaterials/hazardousMaterialsList.ts`
2. **Review Inspector workflow** in `docs/architecture/inspector-workflow-and-ml-detection.md`
3. **Understand packaging paragraph specifics** from Attachment 8 analysis
4. **Prepare test data** matching expected SDDG values

### Key Class 4 Considerations

1. **Division is CRITICAL** - Class 4 has three distinct divisions (4.1, 4.2, 4.3) with DIFFERENT labels
2. **Each Division Has a Different Label**:
   - 4.1: Red/white vertical stripes (FLAMMABLE SOLID)
   - 4.2: Upper white, lower red (SPONTANEOUSLY COMBUSTIBLE)
   - 4.3: Blue (DANGEROUS WHEN WET)
3. **Self-Reactive Substances (4.1)** - No packing group; require KEEP AWAY FROM HEAT label
4. **Pyrophoric Materials (4.2)** - Require special packaging per A8.5 (liquids) or A8.11 (solids)
5. **Technical Names** - N.O.S. entries MUST have technical names in Key 12 AND on package markings
6. **Orientation Labels** - Required for liquids and molten materials
7. **CAO Requirements** - Check special provisions (P3, P4) for Cargo Aircraft Only restrictions

### Document History

| Date | Author | Changes |
|------|--------|---------|
| 2026-01-20 | Claude | Initial comprehensive documentation covering all A8.x paragraphs |
