# AFMAN 24-604 Attachment 6: Class 2 Compressed Gases - Cylinder Requirements Reference

**Source Document:** AFMAN 24-604, 9 October 2020, Pages 270-300
**Purpose:** Authoritative reference for cylinder/container type validation in InspectorCylinderTypeSelectionScreen
**Last Updated:** 2026-01-20

---

## Table of Contents

1. [Overview](#overview)
2. [Table A6.1 - Cylinder Requirements for Compressed Gases](#table-a61---cylinder-requirements-for-compressed-gases)
3. [Paragraph Requirements (A6.2 - A6.28)](#paragraph-requirements-a62---a628)
4. [Implementation Guidance](#implementation-guidance)

---

## Overview

### Key Concepts

1. **Table A6.1** is the primary reference for specific gases - it maps gas names to authorized cylinder specifications
2. **Packaging paragraphs** (A6.2-A6.28) either:
   - Reference Table A6.1 for specific gases
   - Provide default cylinder lists "if not in Table A6.1"
   - Specify unique requirements for special materials
3. **"Same Type With Higher Service Pressure"** - cylinders with higher service pressure ratings than listed are also authorized
4. **Legacy cylinders** - some older DOT specs are authorized for existing cylinders only (no new construction)

### Paragraph-to-Table A6.1 Relationship

| Paragraph | References Table A6.1? | Has Own Cylinder List? | Notes |
|-----------|------------------------|------------------------|-------|
| A6.2 | No | Yes (aerosol containers) | DOT 2P, 2Q, ICAO/IATA IP7 series |
| A6.3 | No | No (small receptacles) | Non-specification containers |
| A6.4 | **YES** | Yes (defaults) | Primary reference for liquefied gases |
| A6.5 | **YES** | Yes (defaults) | Primary reference for nonliquefied gases |
| A6.6 | **YES** | Yes | LPG - references Table A6.1 |
| A6.7 | Partial (A6.4.1, Table A6.1) | Yes | Fire extinguishers |
| A6.8 | No | **EXEMPT** | Refrigerating machines - no cylinder selection |
| A6.9 | No | Yes | Acetylene only - DOT 8, 8AL |
| A6.10 | No | **N/A** | Cigarette lighters - not cylinders |
| A6.11 | No | Yes (specialized) | Cryogenic - DOT 4L + specialized containers |
| A6.12 | No | Yes | Ethyl chloride specific |
| A6.13 | No | Yes | Ethylene oxide specific |
| A6.14 | No | Yes | Ethylamine specific |
| A6.15 | No | Yes | Toxic gases (Arsine, Phosgene, etc.) |
| A6.16 | No | Yes | Bromoacetone, Methyl bromide, etc. |
| A6.17 | No | Yes (specialized) | Gas identification sets |
| A6.18 | No | Yes | Insecticide gas mixtures |
| A6.19 | No | Yes | Class 2.3 Hazard Zone A |
| A6.20 | No | Yes | Nitric oxide specific |
| A6.21 | No | Yes | Ethyl methyl ether |
| A6.22 | References A6.4/A6.5 | Via reference | Chemical under pressure N.O.S. |
| A6.23 | No | **N/A** | Fuel cell cartridges - not cylinders |
| A6.24 | No | **EXEMPT** | Fuel cells in equipment - no UN spec required |
| A6.25 | No | **EXEMPT** | Fuel cells with equipment - no UN spec required |
| A6.26 | No | Yes (UN spec) | Metal hydride storage - ISO 16111 |
| A6.27 | No | **EXEMPT** | Gas powered engines - tanks emptied |
| A6.28 | No | **N/A** | Articles containing gas - not cylinders |

---

## Table A6.1 - Cylinder Requirements for Compressed Gases

### How to Read This Table

- **Filling Density**: Maximum permitted filling density in percent (see A3.3.2.6)
- **Cylinders**: Authorized DOT specifications - cylinders of the same type with HIGHER service pressure are also authorized
- Service pressure numbers in cylinder specs (e.g., "3A1800") indicate minimum service pressure in psig

### Complete Gas-to-Cylinder Mapping

| Gas Name | Max Fill Density | Authorized Cylinders | Notes |
|----------|------------------|---------------------|-------|
| **Anhydrous ammonia** | 54% | DOT-3A480, DOT-3AA480, DOT-3A480X, DOT-4AA480, DOT-3, DOT-3E1800, DOT-3AL480 | |
| **Bromotrifluoromethane (R-13B1, H-1301)** | 124% | DOT-3A400, DOT-3AA400, DOT-3B400, DOT-4AA480, DOT-4B400, DOT-4BA400, DOT-4BW400, DOT-3E1800, DOT-39, DOT-3AL400 | |
| **Carbon dioxide** | 68% | DOT-3A1800, DOT-3AX1800, DOT-3AA1800, DOT-3AAX1800, DOT-3, DOT-3E1800, DOT-3T1800, DOT-3HT2000, DOT-39, DOT-3AL1800 | See notes 3, 4 |
| **Carbon dioxide, refrigerated liquid** | N/A | DOT-4L | |
| **Chlorine** | 125% | DOT-3A480, DOT-3AA480, DOT-3, DOT-3BN480, DOT-3E1800 | See note 1 - max 150 lbs after Nov 1935 |
| **Chlorodifluoroethane (R-142b)** | 100% | DOT-3A150, DOT-3AA150, DOT-3B150, DOT-4B150, DOT-4BA225, DOT-4BW225, DOT-3E1800, DOT-39, DOT-3AL150 | See note 4 |
| **Chlorodifluoromethane (R-22)** | 105% | DOT-3A240, DOT-3AA240, DOT-3B240, DOT-4B240, DOT-4BA240, DOT-4BW240, DOT-4B240ET, DOT-4E240, DOT-39, DOT-3E1800, DOT-3AL240 | See note 4 |
| **Chloropentafluoroethane (R-115)** | 110% | DOT-3A225, DOT-3AA225, DOT-3B225, DOT-4A225, DOT-4BA225, DOT-4B225, DOT-4BW225, DOT-3E1800, DOT-39, DOT-3AL225 | |
| **Chlorotrifluoromethane (R-13)** | 100% | DOT-3A1800, DOT-3AA1800, DOT-3, DOT-3E1800, DOT-39, DOT-3AL1800 | See note 4 |
| **Cyclopropane** | 55% | DOT-3A225, DOT-3A480X, DOT-3AA225, DOT-3B225, DOT-4AA480, DOT-4B225, DOT-4BA225, DOT-4BW225, DOT-4B240ET, DOT-3, DOT-3E1800, DOT-39, DOT-3AL225 | See note 4 |
| **Dichlorodifluoromethane (R-12)** | 119% | DOT-3A225, DOT-3AA225, DOT-3B225, DOT-4B225, DOT-4BA225, DOT-4BW225, DOT-4B240ET, DOT-4E225, DOT-39, DOT-3E1800, DOT-3AL225 | See note 4 |
| **Dichlorodifluoromethane/difluoroethane mixture (R-500)** | Not liquid full at 55°C | DOT-3A240, DOT-3AA240, DOT-3B240, DOT-3E1800, DOT-4B240, DOT-4BA240, DOT-4BW240, DOT-4E240, DOT-39 | See note 4 |
| **Difluoroethane (R-152a)** | 79% | DOT-3A150, DOT-3AA150, DOT-3B150, DOT-4B150, DOT-4BA225, DOT-4BW225, DOT-3E1800, DOT-3AL150 | See note 4 |
| **1,1-Difluoroethylene (R-1132A)** | 73% | DOT-3A2200, DOT-3AA2200, DOT-3AX2200, DOT-3AAX2200, DOT-3T2200, DOT-39 | |
| **Dimethylamine, anhydrous** | 59% | DOT-3A150, DOT-3AA150, DOT-3B150, DOT-4B150, DOT-4BA225, DOT-4BW225, ICC-3E1800 | |
| **Ethane** | 35.8% | DOT-3A1800, DOT-3AX1800, DOT-3AA1800, DOT-3AAX1800, DOT-3, DOT-3E1800, DOT-3T1800, DOT-39, DOT-3AL1800 | See note 4 |
| **Ethane (higher pressure)** | 36.8% | DOT-3A2000, DOT-3AX2000, DOT-3AA2000, DOT-3AAX2000, DOT-3T2000, DOT-39, DOT-3AL2000 | See note 4 |
| **Ethylene** | 31.0% | DOT-3A1800, DOT-3AX1800, DOT-3AA1800, DOT-3AAX1800, DOT-3, DOT-3E1800, DOT-3T1800, DOT-39, DOT-3AL1800 | See note 4 |
| **Ethylene (2000 psig)** | 32.5% | DOT-3A2000, DOT-3AX2000, DOT-3AA2000, DOT-3AAX2000, DOT-3T2000, DOT-39, DOT-3AL2000 | See note 4 |
| **Ethylene (2400 psig)** | 35.5% | DOT-3A2400, DOT-3AX2400, DOT-3AA2400, DOT-3AAX2400, DOT-3T2400, DOT-39, DOT-3AL2400 | See note 4 |
| **Hydrogen chloride, anhydrous** | 65% | DOT-3A1800, DOT-3AA1800, DOT-3AX1800, DOT-3AAX1800, DOT-3, DOT-3T1800, DOT-3E1800 | |
| **Hydrogen sulfide** | 62.5% | DOT-3A, DOT-3AA, DOT-3B, DOT-4A, DOT-4B, DOT-4BA, DOT-4BW, DOT-3E1800, DOT-3AL | Notes 5, 6 - NOT 480 psi service; valve sealed |
| **Insecticide gases, liquefied** | Not liquid full at 55°C | DOT-3A300, DOT-3AA300, DOT-3B300, DOT-4B300, DOT-4BA300, DOT-4BW300, DOT-3E1800 | Notes 4, 8 - Only DOT 2P per A6.4.6 |
| **Liquefied nonflammable gases (other)** | Not liquid full at 55°C | Per A6.4.1 + DOT-3HT, DOT-4D, DOT-4DA, DOT-4DS | Notes 3, 4 - filled with N2, CO2, or air |
| **Methylacetylene-propadiene, stabilized** | Not liquid full at 55°C | DOT-4B240 (no brazed seams), DOT-4BA240 (no brazed seams), DOT-3A240, DOT-3AA240, DOT-3B240, DOT-3E1800, DOT-4BW240, DOT-4E240, DOT-4B240ET, DOT-3AL240 | Note 2 |
| **Methyl chloride** | 84% | DOT-3, DOT-3A225, DOT-3AA225, DOT-3B225, DOT-3E1800, DOT-4B225, DOT-4BA225, DOT-4BW225, DOT-4B240ET | Pre-Dec 1936: DOT-3A150, 3B150, 4B150 also OK |
| **Methyl mercaptan** | 80% | DOT-3A240, DOT-3AA240, DOT-3B240, DOT-4B240, DOT-4B240ET, DOT-3E1800, DOT-4BA240, DOT-4BW240 | |
| **Nitrosyl chloride** | 110% | DOT-3BN400 **ONLY** | |
| **Nitrous oxide** | 68% | DOT-3A1800, DOT-3AA1800, DOT-3AX1800, DOT-3AAX1800, DOT-3, DOT-3E1800, DOT-3T1800, DOT-3HT2000, DOT-39, DOT-3AL1800 | Notes 3, 4, 7 |
| **Refrigerant gas, N.O.S. / Dispersant gas, N.O.S.** | Not liquid full at 55°C | DOT-3A240, DOT-3AA240, DOT-3AL240, DOT-3B240, DOT-3E1800, DOT-4B240, DOT-4BA240, DOT-4BW240, DOT-4E240, DOT-39 | Notes 4, 9 |
| **Sulfur dioxide** | 125% | DOT-3, DOT-3A225, DOT-3AA225, DOT-3AL225, DOT-3B225, DOT-3E1800, DOT-4B225, DOT-4BA225, DOT-4BW225, DOT-4B240ET, DOT-39 | See note 4 |
| **Sulfur hexafluoride** | 120% | DOT-3A1000, DOT-3AA1000, DOT-3AAX2400, DOT-3, DOT-3AL1000, DOT-3E1800, DOT-3T1800 | |
| **Sulfuryl fluoride** | 106% | DOT-3A480, DOT-3AA480, DOT-3E1800, DOT-4B480, DOT-4BA480, DOT-4BW480 | |
| **Tetrafluoroethylene, stabilized** | 90% | DOT-3A1200, DOT-3AA1200, DOT-3E1800 | |
| **Trifluorochloroethylene, stabilized** | 115% | DOT-3A300, DOT-3AA300, DOT-3B300, DOT-3E1800, DOT-4B300, DOT-4BA300, DOT-4BW300 | |
| **Trimethylamine, anhydrous** | 57% | DOT-3A150, DOT-3AA150, DOT-3B150, DOT-4B150, DOT-4BA225, DOT-4BW225, DOT-3E1800 | |
| **Vinyl chloride** | 84% | DOT-4B150 (no brazed seams), DOT-4BA225 (no brazed seams), DOT-4BW225, DOT-3A150, DOT-3AA150, DOT-3AL150, DOT-3E1800 | Note 2 |
| **Vinyl fluoride, stabilized** | 62% | DOT-3A1800, DOT-3AA1800, DOT-3E1800, DOT-3AL1800 | |
| **Vinyl methyl ether** | 68% | DOT-4B150 (no brazed seams), DOT-4BA225 (no brazed seams), DOT-4BW225, DOT-3A150, DOT-3AA150, DOT-3B1800, DOT-3E1800 | Note 2 |

### Table A6.1 Notes

1. **Chlorine cylinders** purchased after Oct 1, 1944 must have only one aperture (neck for valve with safety device). After Nov 1, 1935: max 150 lbs gas.
2. **Acetylide-forming gases** (vinyl chloride, vinyl methyl ether, MAPP): All valve/safety device parts in contact with contents must not cause acetylide formation.
3. **DOT-3HT cylinders**: Aircraft use only, 24-year max service life, nonflammable gases only, frangible disc relief device required (90% of min test pressure), pack in strong outer packaging.
4. **Additional requirements**: Refer to A3.3.2.7 for applicable additional packaging requirements.
5. **Hydrogen sulfide**: DOT specification cylinder with 480 psi service pressure NOT authorized.
6. **Hydrogen sulfide**: Each valve outlet must be sealed by threaded cap or threaded solid plug.
7. **Nitrous oxide in DOT-3AL**: Must have brass or stainless steel valves, cleaned per Federal Specification RR-C-901c.
8. **Insecticide gases**: See A6.4.1 and A6.4.6 - Only DOT 2P authorized for A6.4.6 packaging.
9. **Refrigerant/Dispersant N.O.S.**: See A6.4.6 for additional requirements.

---

## Paragraph Requirements (A6.2 - A6.28)

### A6.2 - Aerosols

**Applies to:** Aerosol products under PSN "Aerosols" meeting "Consumer Commodity" definition

**Container Types (NOT traditional cylinders):**

| Pressure Range at 55°C | Authorized Containers |
|------------------------|----------------------|
| ≤970 kPa (140 psig) | Non-refillable non-metal ≤120 mL, OR metal/plastic ≤1L |
| >970 - ≤1105 kPa (140-160 psig) | DOT 2P, ICAO/IATA IP7, IP7A, IP7B |
| >1105 - ≤1245 kPa (160-180 psig) | DOT 2Q, ICAO/IATA IP7A, IP7B |
| >1245 - ≤1500 kPa (180-217 psig) | ICAO/IATA IP7B only |

**Outer Packaging:** Fiberboard (4G), wooden (4C1, 4C2), plywood (4D), reconstituted (4F), plastic (4H1, 4H2) - PG II

**Inspector Note:** These are aerosol containers, NOT cylinders. UN specification packaging NOT required for non-toxic aerosols.

---

### A6.3 - Small Receptacles Containing Compressed Gas

**Applies to:** Small receptacles other than aerosols or Consumer Commodities

**Container Types:** Non-specification containers
- Containers ≤120 mL (except lighter refills)
- Metal containers for nonhazardous materials
- Electronic tubes ≤489 mL at ≤241 kPa
- Fire alarm system containers ≤570.7 mL at ≤482.6 kPa

**Max Package Weight:** 30 kg (66 lbs)

**Inspector Note:** UN specification packaging NOT required. These are small receptacles, not traditional cylinders.

**Exception - Vehicle Systems (A6.3.6, A6.3.7):** Cylinders in passenger restraints or tire inflation systems must comply with:
- 49 CFR Part 178 cylinder specifications
- A6.6 (LPG paragraph) for the gas contained
- Table A6.1 for the gas contained

---

### A6.4 - Liquefied Compressed Gases

**Applies to:** Liquefied compressed gases including nontoxic and nonflammable mixtures

**PRIMARY REFERENCE: Table A6.1** - If gas is listed, use those specifications

**Default Cylinders (if NOT in Table A6.1):**
- DOT-3, 3A, 3AA, 3AL, 3B, 3BN, 3E, 4B, 4BA, 4B240ET, 4BW, 4E, 39

**Legacy Cylinders (existing only, no new construction):**
- DOT-3, 3D, 4, 4A, 9, 25, 26, 38, 40, 41

**Restrictions:**
| Cylinder | Restriction |
|----------|-------------|
| DOT-3AL | NOT for Class 8 (corrosive) primary or subsidiary hazard |
| DOT-4E, 39 | NOT for: pyrophoric liquids, carbon bisulfide, ethyl chloride, ethylene oxide, nickel carbonyl, spirits of nitroglycerin, toxic materials (Class 6.1 or 2.3) unless specifically authorized |

**Special Cases:**

| Material | Specific Cylinders |
|----------|-------------------|
| CO2/O2 mixture, Oxidizing N.O.S., Nitrous oxide | DOT-3A, 3AA, 3AL, 3E, 3HT, 39 + UN ISO 9809-1, -2, -3, ISO 7866 |
| CO2 refrigerated liquid, Nitrous oxide refrigerated | DOT-4AL |
| Refrigerant gases (nonpoisonous, nonflammable) | A6.4.1 cylinders OR DOT 2P, 2Q in strong boxes |
| Engine starting fluid | A6.4.1 cylinders OR DOT 2P, OR non-spec metal ≤500 mL |

**Also Authorized:**
- Foreign cylinders per A3.3.2.10
- UN Specification cylinders per 49 CFR 173.304b marked "USA"

---

### A6.5 - Nonliquefied Compressed Gases

**Applies to:** Nonliquefied compressed gases

**PRIMARY REFERENCE: Table A6.1** - If gas is listed, use those specifications

**Default Cylinders (if NOT in Table A6.1):**
- DOT-3, 3A, 3AA, 3AL, 3B, 3E, 4B, 4BA, 4BW

**Legacy Cylinders (existing only, no new construction):**
- DOT-3, 3C, 3D, 4, 4A, 4C, 25, 26, 33, 38

**Special Cylinder Requirements:**

| Cylinder | Requirements/Restrictions |
|----------|--------------------------|
| DOT-3HT | Aircraft only, 24-year max life, nonflammable only, frangible disc (90% test pressure), pack in strong outer packaging |
| DOT-39 | For flammable: max 1.23 L internal volume. For oxygen: straight threads, brass/stainless valves, cleaned per DLAI 4145.25 or MIL-STD-1411, max 20,684 kPa (3000 psig) |
| DOT-3AL | Flammable gases: cargo aircraft only. Oxygen: per 49 CFR 173.302a(a)(5) |
| DOT-3AX, 3AAX, 3T | Division 2.1, 2.2, and carbon monoxide. 3T NOT for hydrogen. Methane: min 98% purity, no corroding components |

**Specific Materials:**

| Material | Authorized Cylinders | Notes |
|----------|---------------------|-------|
| Compressed oxygen/oxidizing gases | DOT-3A, 3AA, 3AL, 3E, 3HT, 39, 4E (<200 psig) + UN ISO 9809-1, -2, -3, ISO 7866 | Rigid outer packaging required (PG I or II, or ATA Spec 300 Cat I) |
| Carbon monoxide | DOT-3A, 3AX, 3AA, 3AAX, 3AL, 3, 3E, 3T (min 1800 psig service) | Max 6895 kPa (1000 psig) at 21°C; if dry/sulfur-free: max 5/6 service pressure or 13,790 kPa |
| Fluorine | DOT-3A1000, 3AA1000, 3BN400 **ONLY** | No safety relief device, valve protection caps, max 2758 kPa (400 psig), max 2.7 kg (6 lbs) |
| Diborane/mixtures | DOT-3AL, 3AA (min 1800 psig service) | Max 7% fill density |

**Also Authorized:**
- UN Specification cylinders per 49 CFR 173.302b
- Foreign cylinders per A3.3.2.10

---

### A6.6 - Liquefied Petroleum Gas (LPG)

**Applies to:** Liquefied petroleum gas

**Authorized Cylinders:**
- DOT-3, 3A, 3AA, 3AL, 3B, 3E, 4B, 4BA, 4B240ET, 4BW, 4E, 39

**Restrictions:**
- DOT-39: max 1.23 L (75 cubic inches) internal volume
- Must comply with Table A6.1 for named gases

**Also Authorized:**
- DOT 2P or 2Q containers in strong wooden/fiberboard boxes (heated to 54°C test)
- Foreign cylinders per A3.3.2.10
- UN Specification cylinders marked "USA"

---

### A6.7 - Fire Extinguishers

**Applies to:** Fire extinguishers (may be secured in vehicle holders per A3.3.2.13)

**DOT Specification Cylinders (A6.7.1):**
- DOT-3A, 3AA, 3AL, 3E, 4B, 4BA, 4B240ET, 4BW
- Requirements: extinguishing agents only, nonflammable/nontoxic/noncorrosive dry gas, external corrosion-resistant coating

**DOT 2P/2Q Containers (A6.7.2):**
- Pressure-based selection similar to aerosols
- ≤920 kPa (141 psig): standard containers
- >920 - ≤1100 kPa (141-160 psig): DOT 2P
- >1100 kPa (160 psig): DOT 2Q

**Non-DOT Specification (A6.7.3):**
- Marked "MEETS DOT REQUIREMENTS"
- Max 1660 kPa (241 psig) at 21°C
- Max 18 L (1,100 cubic inches) internal volume
- Contents: not flammable, toxic, or corrosive

**Fire Suppression Bottles:**
- DOT-3HT, 4D, 4DA, 4DS
- Use PSN: "Liquefied Gases, UN1058" or "Compressed Gas, N.O.S., UN1956"

**Specific Models:**
- FEU-1/M (37.8 L/10 gal): No special packing required

**Also Authorized:**
- Foreign fire extinguishers per A3.3.2.10
- UN Specification cylinders marked "USA"
- Large fire extinguishers: may be unpackaged with valve protection

---

### A6.8 - Refrigerating Machines, Air Conditioners, Articles Pressurized

**Applies to:** Factory-tested refrigerating machines, air conditioners, components, and pressurized hydraulic/pneumatic articles

**EXEMPT FROM SPECIFICATION PACKAGING** when conditions met:
- Pressure vessels ≤2268 kg Group A1 refrigerant OR ≤22.7 kg other
- Safety relief device per ANSI/ASHRAE Standard 15
- Individual shut-off valves at each opening
- Manufactured/tested per ANSI/ASHRAE Standard 15 (or ASME if >152.4 mm diameter)

**Articles, Pressurized Hydraulic/Pneumatic:**
- Accumulators in vehicles/equipment with ≥5x burst pressure: **EXEMPT**
- ≤1380 kPa (200 psig): max 41 L fluid space, no specification requirements
- >1380 kPa (200 psig): max 41 L, test to 3x charged pressure, ≥5x burst pressure

**Inspector Note:** NO CYLINDER TYPE SELECTION REQUIRED for this paragraph.

---

### A6.9 - Acetylene Gas

**Applies to:** Acetylene gas

**Authorized Cylinders:**
- DOT-8
- DOT-8AL

**Requirements:**
- Metal shells filled with porous material
- Charged with suitable solvent per 49 CFR 178.59 or 178.60
- Per 49 CFR 173.303(a) through (e)

**Also Authorized:**
- Foreign cylinders per A3.3.2.6
- UN Specification cylinders per 49 CFR 173.303(f) marked "USA"

---

### A6.10 - Cigarette Lighters or Similar Devices

**Applies to:** Cigarette lighters and similar devices charged with fuel

**NOT CYLINDERS** - These are devices with specific requirements:
- Max 10 grams liquefied gas per device
- Liquid portion ≤85% volumetric capacity at 15°C
- Device withstands 2x vapor pressure at 55°C

**Packaging:** UN specification outer packaging at PG II level

**Lighter Refills:**
- No ignition element, must have release device
- Max 4 fluid ounces (7.22 cubic inches)
- Max 65 grams Division 2.1 fuel

**Inspector Note:** NO CYLINDER TYPE SELECTION - these are devices, not cylinders.

---

### A6.11 - Cryogenic Liquids

**Applies to:** Cryogenic liquids (argon, helium, neon, nitrogen, oxygen, hydrogen)

**DOT Specification:**
- DOT-4L cylinders (vertical position)

**Specialized Containers:**

| Container | Capacity | Material | Notes |
|-----------|----------|----------|-------|
| TMU-27M (MIL-T-38170) | 189 L (50 gal) | LIN/LOX | Trailer mounted |
| C-1 | 1892 L (500 gal) | Cryogenics | |
| Dewar | 25 L (6.6 gal) | Cryogenics | Max 6 per aircraft |
| Dewar (100 L) | 100 L (26.4 gal) | Cryogenics | Max 1 per aircraft, nonskid base |
| NRU-5/E (MIL-T-38261) | 1514 L (400 gal) | Cryogenics | Air-transportable |
| LS-160 | 150 L max | LIN | Max 1 per aircraft |
| TMU-70/M (MIL-A-85415) | N/A | LOX | Servicing trailer, absolute pressure relief |
| TMU-24E (MIL-T-27720) | 1514 L (400 gal) | LOX/LIN | Cargo pallet mounted |
| LSHe-102 | 109 L (28.8 gal) | Liquid helium | Shipping skid, absolute pressure relief |
| LSHe-30 | 30 L (7.9 gal) | Liquid helium/neon | Max 5 per aircraft |
| LSNe-75 | 75 L (19.8 gal) | Liquid neon | Max 2 per aircraft |
| CRU-87/U | 10 L | PTLOX | Max 25 per aircraft (10 on C-21) |
| CRU-50/A | 20 L | NPTLOX | Max 25 per aircraft |
| 500 gal trailer | 500 gal | LIN/LOX | NSN 3655-01-601-2544RN, etc. |

**Also Authorized:**
- Foreign cylinders per A3.3.2.10
- UN Specification cylinders marked "USA"

---

### A6.12 - Ethyl Chloride

**Applies to:** Ethyl chloride (PG I performance level, 7.5% outage)

**Authorized Packaging:**

| Type | Specifications |
|------|---------------|
| Boxes | Inner: glass, earthenware, metal (≤500g each). Outer: 4C1, 4C2, 4D, 4F, 4G (4G max 30 kg) |
| Drums | Steel drum 1A1 (≤100 L) - no inner required |
| DOT Cylinders | Any DOT spec except acetylene. **NOT aluminum alloy** |
| Capsules | Max 150 g per capsule, strong outer packaging (max 75 kg) |

---

### A6.13 - Ethylene Oxide

**Applies to:** Ethylene oxide

**Material Restrictions:** NO silver, mercury, copper (or alloys) in parts contacting EO. Copper alloys OK if no free acetylene.

**Authorized Packaging:**

| Type | Specifications |
|------|---------------|
| Boxes | Inner: glass ampoules/vials (≤100g) OR metal receptacles (≤340g). Outer: 4C1, 4C2, 4D, 4F, 4G. Max 100g glass or 2.5 kg metal per outer. |
| DOT Cylinders | Any spec except acetylene. >4L: pressurizing valves + insulation. >19L: eductor tubes. Seamless/welded steel only (not brazed), max 115 L, not liquid full below 82°C. Fusible relief 69-77°C. |
| Steel Drums | 1A1, max 231 L, lagged, welded (inner 1.7mm, outer 2.4mm), 690 kPa hydrostatic, fusible relief 69-77°C |

---

### A6.14 - Ethylamine (Monoethylamine, Aminoethane)

**Applies to:** Ethylamine

**Authorized Packaging:**
- Metal drums 1A1 (PG I level)
- Any DOT specification cylinder except acetylene

---

### A6.15 - Arsine; Cyanogen Chloride; Cyanogen; Germane; Phosphine; Phosgene; Liquefied Gas, Toxic

**Applies to:** Extremely dangerous toxic gases

**Authorized Cylinders:**
- DOT-3A1800, 3AA1800, 3AL1800, 3D, 3E1800, 33
- Max 57 kg (125 lbs) water capacity for 3A, 3AA, 3AL, 3D, 33

**Restrictions:**
| Material | Restriction |
|----------|-------------|
| Arsine | NOT in DOT-3AL |
| Phosphine | NOT in DOT-3AL |
| Phosgene | Max 125% fill density, max 68 kg (150 lbs), leakage test in 66°C water bath |

---

### A6.16 - Bromoacetone; Methyl Bromide; Chloropicrin Mixtures; Insecticide Gases, Toxic, N.O.S.

**Applies to:** Toxic fumigants and mixtures

**Authorized Cylinders:**
- DOT-3A, 3AA, 3B, 3C, 3E, 4A, 4B, 4BA, 4BW, 4C
- Max 113 kg (250 lbs) water capacity (except methyl bromide - no limit)

**Other Packaging:**
- Bromoacetone: Glass/tubes in hermetically sealed metal in fiberboard in boxes (4A, 4B, 4N, 4C1, 4C2, 4D, 4F). Max 500g/bottle, max 11 kg/outer. PG I.
- Methyl bromide mixtures (≤2% chloropicrin): Fiberboard (4G) with metal cans (≤1 lb or ≤1.75 lbs with specific pressure ratings)

---

### A6.17 - Gas Identification Sets

**Applies to:** Gas identification sets containing toxic material (PG I)

**Authorized Packaging:**
- Glass inner receptacles ≤40 mL, hermetically sealed
- Fiberboard receptacles with absorbent
- Max 12 fiberboard in 4G box
- Max 4 boxes in steel cylinder (wall ≥3.7 mm, hermetically sealed)

**Absorbed Materials (charcoal/silica gel):**
- ≤5 mL liquid or ≤5 g solid: glass ≤120 mL in metal can (≥0.30 mm wall) in metal/wooden boxes. Max 100 mL or 100 g per outer.
- ≤5 mL liquid or ≤20 g solid: glass ≥60 mL screw-top, hermetically sealed. Max 12 bottles in plastic case with absorbent/partitions, then fiberboard, then metal/wooden box.

---

### A6.18 - Hexaethyl Tetraphosphate and Compressed Gas Mixtures; Insecticide Gases, Toxic, N.O.S.; Parathion Mixtures; Tetraethyl Dithiopyrophosphate/Pyrophosphate Mixtures

**Applies to:** Organic phosphate insecticide mixtures with nonflammable compressed gas (≤20% phosphate by weight)

**Authorized Cylinders:**
- DOT-3A240, 3AA240, 3B240, 4A240, 4B240, 4BA240, 4BW240

**Requirements:**
- Max 5 kg mixture per cylinder
- Max 80% fill density
- No eduction tube or fusible plug
- DOT-approved valve only

**Outer Packaging:**
- Fiberboard box (4G): max 4 cylinders
- Wooden box (4C1, 4C2, 4D, 4F): max 12 cylinders
- Must protect valve, withstand 1.8 m drop

---

### A6.19 - Class 2.3 Materials, Poisonous by Inhalation (Hazard Zone A)

**Applies to:** Class 2.3, PG I, Inhalation Hazard Zone A materials

**Authorized Cylinders:**
- DOT cylinders per 49 CFR Part 178 Subpart C
- **NOT authorized:** DOT-8, 8AL, 39

**Drum Packaging (alternative):**
- Inner drum: 1A1, 1B1, 1H1, 1N1, or 6HA1 (≤220 L, specific thickness requirements)
- Outer drum: 1A2 (≥1.35 mm) or 1H2 (≥6.30 mm)
- Both PG I tested, 100 kPa hydrostatic on outer
- Inner: 550 kPa hydrostatic, leakproof at 2x vapor pressure at 55°C
- Screw closures with torque, physical retention, cap seal (100 kPa)
- Cushioning: 5 cm sides, 7.6 cm top/bottom

**Inner Packaging System (alternative):**
- Impact-resistant receptacle (glass, earthenware, plastic, metal) in absorbent
- In leak-tight metal/plastic packaging
- In various drums, jerricans, boxes (all PG I)
- Inner receptacle max 4 L, outer max 16 L total

---

### A6.20 - Nitric Oxide

**Applies to:** Nitric oxide

**Authorized Cylinders:**
- DOT-3A1800, 3AA1800, 3AL1800, 3E1800 **ONLY**

**Requirements:**
- Max 5,170 kPa (750 psi) at 21°C
- Stainless steel valve
- Valve seat material resistant to NO and NO2
- **NO safety relief devices**
- Valve outlet sealed by solid threaded cap/plug with inert gasket
- Cleaned per 49 CFR 173.337(b)
- DOT-3E1800: pack in strong wooden boxes

---

### A6.21 - Ethyl Methyl Ether

**Applies to:** Ethyl methyl ether (PG I)

**Authorized Packaging:**

| Option | Inner | Outer |
|--------|-------|-------|
| Combination | Glass, earthenware, plastic, metal, ampoules | Drums (1A1/2, 1B1/2, 1N1/2, 1D, 1G, 1H1/2), Jerricans (3A1/2, 3B1/2, 3H1/2), Boxes (4A, 4B, 4C1/2, 4D, 4F, 4G, 4H1/2) |
| Single | Not required | Drums (1A1/2, 1B1/2, 1N1/2, 1H1/2), Jerricans (3A1/2, 3B1/2, 3H1/2) |
| Composite (plastic) | Plastic | Drums (6HA1, 6HB1, 6HG1, 6HH1), Boxes (6HA2, 6HB2, 6HC, 6HD2, 6HG2) |
| Composite (glass) | Glass, porcelain, stoneware | Drums (6PA1, 6PB1, 6PG1), Boxes (6PA2, 6PB2, 6PC, 6PG2), Plastic (6PH1, 6PH2) |
| DOT Cylinders | N/A | Any DOT spec except 3HT and acetylene |

---

### A6.22 - Chemical Under Pressure N.O.S.

**Applies to:** Chemical under pressure N.O.S.

**Authorized:** DOT cylinders and UN pressure receptacles per A6.4 and A6.5 (use most restrictive if multiple apply)

**Requirements:**
- At 50°C: non-gaseous phase ≤95% water capacity, not completely filled at 60°C
- Internal pressure at 65°C may not exceed test pressure
- Min test pressure: per 49 CFR Part 178 for propellant, but not less than 291 psig (20 bar)
- Requalification: max 5 years

---

### A6.23 - Fuel Cell Cartridges

**Applies to:** Fuel cell cartridges (max 1 kg)

**NOT CYLINDERS** - Package in:
- Drums: 1A2, 1B2, 1D, 1G, 1H2, 1N2
- Jerricans: 3A2, 3B2, 3H2
- Boxes: 4A, 4B, 4C1, 4C2, 4D, 4F, 4G, 4H1, 4H2, 4N

**Inspector Note:** NO CYLINDER TYPE SELECTION for this paragraph.

---

### A6.24 - Fuel Cell Cartridges Contained in Equipment

**Applies to:** Fuel cells installed in equipment

**UN SPECIFICATION PACKAGING NOT REQUIRED**

Requirements:
- Protect against short circuit
- Protect against inadvertent operation
- May not charge batteries during transport

**Inspector Note:** NO CYLINDER TYPE SELECTION - exempt from specification packaging.

---

### A6.25 - Fuel Cell Packed With Equipment

**Applies to:** Fuel cells packed with equipment

**UN SPECIFICATION PACKAGING NOT REQUIRED**

Requirements:
- Inner packagings or cushioning/dividers to protect cartridges
- Max cartridges: number to power equipment + 2 spares

**Inspector Note:** NO CYLINDER TYPE SELECTION - exempt from specification packaging.

---

### A6.26 - Metal Hydride Storage Systems

**Applies to:** UN Metal hydride storage systems (UN3468)

**Requirements:**
- Pressure receptacles ≤150 L water capacity
- Max developed pressure ≤25 MPa
- Designed, constructed, inspected, tested per ISO 16111
- Steel receptacles or composite with steel liners: marked per 49 CFR 173.301b(f) with "H" for hydrogen-bearing gases
- Requalification: max 5 years per 49 CFR 180.207 and ISO 16111

---

### A6.27 - Flammable Gas Powered Engines and Machinery

**Applies to:** Engines and machinery powered by flammable gas

**CYLINDER TYPE SELECTION NOT APPLICABLE**

Requirements:
- Prepare per service technical manuals
- Engines drained and purged per technical manual with no other hazmat: **NONHAZARDOUS**
- LPG/compressed gas powered: fuel completely emptied from non-DOT tanks, lines, regulators. Tanks securely closed. Purging not required.
- Fuel cell powered: secure and protect fuel cell

**Inspector Note:** NO CYLINDER TYPE SELECTION - tanks are emptied or equipment is exempt.

---

### A6.28 - Articles Containing Flammable/Non-flammable Gas, N.O.S.

**Applies to:** UN3537, UN3538 - Articles containing gas

**NOT TRADITIONAL CYLINDERS** - Package in PG II packaging:
- Drums: 1A2, 1B2, 1N2, 1D, 1G, 1H2
- Boxes: 4A, 4B, 4C1, 4C2, 4D, 4F, 4G, 4H1, 4H2, 4N
- Jerricans: 3A2, 3B2, 3H2

**Robust Articles:** May use strong outer packaging or transport unpackaged/on pallets

**Inspector Note:** NO CYLINDER TYPE SELECTION - these are articles, not standalone cylinders.

---

## Implementation Guidance

### Data Structure for InspectorCylinderTypeSelectionScreen

The current implementation needs significant restructuring:

```typescript
interface CylinderRequirement {
  // Which gases this applies to (from Table A6.1 or paragraph-specific)
  gasNames?: string[];  // If specific gases, list them
  appliesTo?: 'all' | 'default' | 'specific';  // How to apply

  // Authorized cylinder types
  cylinders: CylinderSpec[];

  // Restrictions
  restrictions?: Restriction[];

  // Notes
  notes?: string[];
}

interface CylinderSpec {
  spec: string;          // e.g., "DOT-3A", "DOT-3A1800"
  minServicePressure?: number;  // If number suffix, this is min pressure
  restrictions?: string[];      // e.g., "no brazed seams", "NOT for Class 8"
}

interface ParagraphRequirements {
  paragraph: string;
  title: string;

  // Does this paragraph require cylinder selection?
  requiresCylinderSelection: boolean;

  // If not, why?
  exemptReason?: 'not_cylinders' | 'exempt_from_specs' | 'equipment' | 'emptied';

  // References Table A6.1?
  referencesTableA61: boolean;

  // Default cylinders (when gas not in Table A6.1)
  defaultCylinders?: CylinderSpec[];

  // Legacy cylinders (existing only)
  legacyCylinders?: CylinderSpec[];

  // Other authorized containers (non-cylinders)
  otherContainers?: ContainerType[];

  // Special cases within paragraph
  specialCases?: SpecialCase[];
}
```

### Paragraphs Requiring NO Cylinder Selection

| Paragraph | Reason | What to Show Inspector |
|-----------|--------|------------------------|
| A6.8 | Exempt from specification packaging | "Factory-tested units exempt - verify ANSI/ASHRAE compliance" |
| A6.10 | Devices, not cylinders | "Cigarette lighters - verify device requirements" |
| A6.23 | Cartridges, not cylinders | "Fuel cell cartridges - verify outer packaging" |
| A6.24 | UN spec not required | "Fuel cell in equipment - verify protection requirements" |
| A6.25 | UN spec not required | "Fuel cell with equipment - verify protection requirements" |
| A6.27 | Tanks emptied | "Gas powered engine - verify tanks emptied and closed" |
| A6.28 | Articles, not cylinders | "Article containing gas - verify PG II packaging" |

### Paragraphs With Table A6.1 Dependency

For A6.4, A6.5, and A6.6, the screen should:
1. Check if the gas name matches an entry in Table A6.1
2. If YES: show ONLY the cylinders from Table A6.1 for that gas
3. If NO: show the default cylinder list for the paragraph

### Screen Logic Flow

```
1. Get packing instruction (e.g., "A6.5")
2. Get proper shipping name / gas name from SDDG

3. If paragraph in [A6.8, A6.10, A6.23, A6.24, A6.25, A6.27, A6.28]:
   → Skip cylinder selection, show appropriate message

4. If paragraph in [A6.4, A6.5, A6.6]:
   a. Look up gas name in Table A6.1
   b. If found: display Table A6.1 cylinders for that gas
   c. If not found: display paragraph default cylinders

5. For other paragraphs:
   → Display paragraph-specific cylinder list

6. Always include:
   - Foreign cylinders option (per A3.3.2.10)
   - UN Specification option (where applicable)
   - "Not Listed / COE / CAA" option
```

### Validation Rules

When inspector selects a cylinder:
1. Verify it's in the authorized list
2. Check any restrictions (e.g., DOT-3AL not for Class 8)
3. Verify service pressure meets minimum (if applicable)
4. Check material-specific restrictions (e.g., no aluminum for ethyl chloride)

---

## Changelog

| Date | Author | Changes |
|------|--------|---------|
| 2026-01-20 | Claude | Initial comprehensive documentation from AFMAN 24-604 Attachment 6 PDF |
