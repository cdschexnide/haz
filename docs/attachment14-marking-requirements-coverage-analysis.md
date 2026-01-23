# AFMAN24-604 Attachment 14 Marking Requirements Coverage Analysis

**Generated:** 2026-01-21
**Source:** `docs/attachment14/attachment14.pdf`
**Target Function:** `src/utils/markingRequirementsInspector.tsx` → `evaluateMarkingRequirementsInspector()`

---

## Summary

This document compares every paragraph and subparagraph of AFMAN24-604 Attachment 14 (Marking Hazardous Materials) against the `evaluateMarkingRequirementsInspector` function to identify coverage gaps.

### Coverage Statistics

| Status | Count |
|--------|-------|
| ✅ CONDITION IS DEFINED | 9 |
| ❌ CONDITION NOT DEFINED | 78 |
| ⏸️ COMMENTED OUT (TODO) | 15 |
| **Total Requirements** | **87** |

---

## A14.1 - General Requirements

| Paragraph | Requirement Summary | Status |
|-----------|---------------------|--------|
| A14.1.1 | Mark hazardous materials according to MIL-STD-129 and this manual | ❌ CONDITION NOT DEFINED IN evaluateMarkingRequirementsInspector FUNCTION |
| A14.1.2 | Labels may be used to meet marking requirements | ❌ CONDITION NOT DEFINED IN evaluateMarkingRequirementsInspector FUNCTION |
| A14.1.3 | Place packages so markings/labels are visible on aircraft pallets | ❌ CONDITION NOT DEFINED IN evaluateMarkingRequirementsInspector FUNCTION |
| A14.1.4 | At least one package with markings visible; use marking board if prevented | ❌ CONDITION NOT DEFINED IN evaluateMarkingRequirementsInspector FUNCTION |
| A14.1.5 | Use marking board for unpackaged Class 1 articles with PSN authorized prior to Jan 1, 1990 | ❌ CONDITION NOT DEFINED IN evaluateMarkingRequirementsInspector FUNCTION |
| A14.1.6 | Full name and address of shipper and consignee required | ✅ CONDITION IS DEFINED IN evaluateMarkingRequirementsInspector FUNCTION |

**Notes on A14.1.6:** The function defines `Military Shipping Label (MSL) or DD Form 1387` with expected value "Full shipper and consignee name/address" at line 25-27.

---

## A14.2 - UN Packaging Specification Markings

| Paragraph | Requirement Summary | Status |
|-----------|---------------------|--------|
| A14.2 | UN specification markings mandatory for all packages (unless exempted by A3.1.1) | ⏸️ COMMENTED OUT (TODO) - Lines 70-79 contain commented POP Marking logic |

**Notes:** POP (UN specification) marking validation is handled separately in `InspectorPOPMarkingDataEntry.tsx`, not in the marking requirements evaluation.

---

## A14.3 - General Hazard Communication and Handling Markings

| Paragraph | Requirement Summary | Status |
|-----------|---------------------|--------|
| A14.3.1 | PSN and ID number on all packages (min 12mm high) | ✅ CONDITION IS DEFINED IN evaluateMarkingRequirementsInspector FUNCTION |
| A14.3.1.1 | PSN/ID on articles not requiring packaging | ❌ CONDITION NOT DEFINED IN evaluateMarkingRequirementsInspector FUNCTION |
| A14.3.1.2 | Technical name in parenthesis after PSN when required by A4.5.3 | ⏸️ COMMENTED OUT (TODO) - Lines 45-47 |
| A14.3.1.3 | Italicized descriptive words optional | ❌ CONDITION NOT DEFINED IN evaluateMarkingRequirementsInspector FUNCTION |
| A14.3.1.4 | Accessorial hazards do not require marking | ❌ CONDITION NOT DEFINED IN evaluateMarkingRequirementsInspector FUNCTION |
| A14.3.1.5 | No abbreviations except "w", "w/o", "N.O.S." | ❌ CONDITION NOT DEFINED IN evaluateMarkingRequirementsInspector FUNCTION |
| A14.3.2 | Mark "RQ" for hazardous substances | ⏸️ COMMENTED OUT (TODO) - Lines 94-100 |
| A14.3.2.1 | Mark technical name of hazardous substance | ❌ CONDITION NOT DEFINED IN evaluateMarkingRequirementsInspector FUNCTION |
| A14.3.2.2 | Mark waste stream number | ❌ CONDITION NOT DEFINED IN evaluateMarkingRequirementsInspector FUNCTION |
| A14.3.2.3 | Mark EPA designation | ❌ CONDITION NOT DEFINED IN evaluateMarkingRequirementsInspector FUNCTION |
| A14.3.3 | Hazardous waste marking requirements | ❌ CONDITION NOT DEFINED IN evaluateMarkingRequirementsInspector FUNCTION |
| A14.3.4 | Mark "Inhalation Hazard" for materials poisonous by inhalation | ✅ CONDITION IS DEFINED IN evaluateMarkingRequirementsInspector FUNCTION |
| A14.3.5 | Mark permit/COE/CAA number | ⏸️ COMMENTED OUT (TODO) - Lines 29-42 |
| A14.3.6 | Orientation marking - filling holes up for liquids | ⏸️ COMMENTED OUT (TODO) - Lines 114-118 |
| A14.3.6.1 | Orientation arrows on two opposite sides | ⏸️ COMMENTED OUT (TODO) - Lines 114-118 |
| A14.3.6.2 | Exemptions from orientation marking | ❌ CONDITION NOT DEFINED IN evaluateMarkingRequirementsInspector FUNCTION |
| A14.3.6.3 | Orientation not required for single packaging with obvious orientation | ❌ CONDITION NOT DEFINED IN evaluateMarkingRequirementsInspector FUNCTION |
| A14.3.7 | Mark "OVERPACK" on overpacks (min 12mm) | ⏸️ COMMENTED OUT (TODO) - Lines 120-123 |
| A14.3.8 | Freight containers: no PSN/UN numbers required | ❌ CONDITION NOT DEFINED IN evaluateMarkingRequirementsInspector FUNCTION |
| A14.3.9 | Unitized cargo - at least one package with UN spec markings exposed | ❌ CONDITION NOT DEFINED IN evaluateMarkingRequirementsInspector FUNCTION |
| A14.3.10 | Shrink wrap - markings visible through wrap | ❌ CONDITION NOT DEFINED IN evaluateMarkingRequirementsInspector FUNCTION |
| A14.3.11 | Marking boards in lieu of individual markings | ❌ CONDITION NOT DEFINED IN evaluateMarkingRequirementsInspector FUNCTION |
| A14.3.11.1 | Marking board condition 1: impractical/uneconomical | ❌ CONDITION NOT DEFINED IN evaluateMarkingRequirementsInspector FUNCTION |
| A14.3.11.2 | Marking board condition 2: pallet not broken down | ❌ CONDITION NOT DEFINED IN evaluateMarkingRequirementsInspector FUNCTION |
| A14.3.12 | Limited quantities marking (square-on-point with "Y") | ✅ CONDITION IS DEFINED IN evaluateMarkingRequirementsInspector FUNCTION |
| A14.3.12.1 | Limited quantity marking size requirements | ❌ CONDITION NOT DEFINED IN evaluateMarkingRequirementsInspector FUNCTION |
| A14.3.12.2 | Limited quantity marking color requirements | ❌ CONDITION NOT DEFINED IN evaluateMarkingRequirementsInspector FUNCTION |
| A14.3.13 | Excepted quantities marking per A19.2.13 | ⏸️ COMMENTED OUT (TODO) - Lines 130-133 |
| A14.3.14 | Consumer product warnings (informational) | ❌ CONDITION NOT DEFINED IN evaluateMarkingRequirementsInspector FUNCTION |
| A14.3.15 | Engines/machinery UN3528, UN3529, UN3530 - no markings required unless enclosed | ❌ CONDITION NOT DEFINED IN evaluateMarkingRequirementsInspector FUNCTION |

**Notes on A14.3.1:** The function defines `PSN and UN Number` at lines 66-68 for all materials except UN3166.

**Notes on A14.3.4:** The function checks for "inhalation hazard" in the PSN at lines 102-108.

**Notes on A14.3.12:** The function defines `Limited Quantity Marking` at lines 110-112 when `quantityType === "limited"`.

---

## A14.4 - Marking Requirements Applicable to Class

### A14.4.1 - Class 1 (Explosives)

| Paragraph | Requirement Summary | Status |
|-----------|---------------------|--------|
| A14.4.1.1 | Pre-1990 containers may ship without UN spec markings; DOT/military spec number required | ⏸️ COMMENTED OUT (TODO) - Lines 135-139 |
| A14.4.1.2 | Mark EX number or NSN for explosives | ❌ CONDITION NOT DEFINED IN evaluateMarkingRequirementsInspector FUNCTION |
| A14.4.1.3 | Mark "THIS SIDE UP" for explosives containing liquids | ⏸️ COMMENTED OUT (TODO) - Lines 141-144 |
| A14.4.1.4 | Mark "WARNING - EXPLOSIVE DEVICE EMBEDDED IN ***" for installed explosives | ❌ CONDITION NOT DEFINED IN evaluateMarkingRequirementsInspector FUNCTION |
| A14.4.1.5 | Display PSN and UN number on unpacked explosives | ❌ CONDITION NOT DEFINED IN evaluateMarkingRequirementsInspector FUNCTION |
| A14.4.1.6 | Mark DOT/military-federal spec number for grandfathered shipments | ⏸️ COMMENTED OUT (TODO) - Lines 135-139 |

---

### A14.4.2 - Class 2 (Gases)

| Paragraph | Requirement Summary | Status |
|-----------|---------------------|--------|
| A14.4.2.1 | Mark "THIS END UP" on ethylene oxide drums (A6.13.4) | ✅ CONDITION IS DEFINED IN evaluateMarkingRequirementsInspector FUNCTION |
| A14.4.2.2 | Mark year of test and "MEETS DOT REQUIREMENTS" for fire extinguishers | ✅ CONDITION IS DEFINED IN evaluateMarkingRequirementsInspector FUNCTION |
| A14.4.2.3 | Cryogenic liquids: orientation arrows, "THIS END UP", vent rate, handling instructions | ⏸️ COMMENTED OUT (TODO) - Lines 154-159 |
| A14.4.2.4 | Mark "INSIDE CONTAINERS COMPLY WITH PRESCRIBED SPECIFICATIONS" | ✅ CONDITION IS DEFINED IN evaluateMarkingRequirementsInspector FUNCTION |
| A14.4.2.4.1 | Above marking for aerosols/compressed gases per A6.2 | ✅ CONDITION IS DEFINED IN evaluateMarkingRequirementsInspector FUNCTION |
| A14.4.2.4.2 | Above marking for refrigerant gases/engine-starting fluid per A6.4.6/A6.4.7 | ✅ CONDITION IS DEFINED IN evaluateMarkingRequirementsInspector FUNCTION |
| A14.4.2.4.3 | Above marking for receptacles/cylinders per A3.3.2.7 | ❌ CONDITION NOT DEFINED IN evaluateMarkingRequirementsInspector FUNCTION |
| A14.4.2.4.4 | Above marking for cylinders per A3.3.2.3.2 | ❌ CONDITION NOT DEFINED IN evaluateMarkingRequirementsInspector FUNCTION |
| A14.4.2.4.5 | Above marking for LPG per A6.6.2 | ✅ CONDITION IS DEFINED IN evaluateMarkingRequirementsInspector FUNCTION |
| A14.4.2.5 | Aerosols (UN1950) may use alternate PSN | ❌ CONDITION NOT DEFINED IN evaluateMarkingRequirementsInspector FUNCTION |
| A14.4.2.6 | Mark "NON-ODORIZED" for unodorized LPG cylinders | ❌ CONDITION NOT DEFINED IN evaluateMarkingRequirementsInspector FUNCTION |

**Notes on A14.4.2.1:** The function checks for UN1040 (Ethylene Oxide) at lines 146-148 and adds "THIS END UP" marking.

**Notes on A14.4.2.2:** The function checks for UN1044 (Fire Extinguishers) at lines 150-152 and adds "MEETS DOT REQUIREMENTS" marking.

**Notes on A14.4.2.4:** The function checks multiple conditions at lines 162-175:
- `packingInstruction === "A6.2."` (aerosols/compressed gases)
- `properShippingName.includes("REFRIGERANT GAS")` with packing instruction A6.4
- UN1011, UN1012, UN1075, UN1978 (LPG-related UN numbers)

---

### A14.4.3 - Class 3 (Flammable Liquids)

| Paragraph | Requirement Summary | Status |
|-----------|---------------------|--------|
| A14.4.3.1 | Mark flash point on shipping container | ⏸️ COMMENTED OUT (TODO) - Lines 59-62, 177-179 |

---

### A14.4.4 - Class 5 (Oxidizers and Organic Peroxides)

| Paragraph | Requirement Summary | Status |
|-----------|---------------------|--------|
| A14.4.4.1 | Mark "INSIDE CONTAINERS COMPLY..." for bromine pentafluoride/trifluoride | ❌ CONDITION NOT DEFINED IN evaluateMarkingRequirementsInspector FUNCTION |
| A14.4.4.2 | Mark "oxygen generator, chemical" for chemical oxygen generators | ✅ CONDITION IS DEFINED IN evaluateMarkingRequirementsInspector FUNCTION |

**Notes on A14.4.4.2:** The function checks for UN3356 at lines 186-188 and adds "Oxygen Generator" marking.

---

### A14.4.5 - Class 6 (Toxic and Infectious Substances)

| Paragraph | Requirement Summary | Status |
|-----------|---------------------|--------|
| A14.4.5.1 | Mark "POISON" on plastic containers for Div 6.1 toxic | ⏸️ COMMENTED OUT (TODO) - Lines 190-194 |
| A14.4.5.2 | Mark Category A Infectious Substances per 49 CFR 178.609 | ❌ CONDITION NOT DEFINED IN evaluateMarkingRequirementsInspector FUNCTION |
| A14.4.5.2.1 | UN spec marking with "Class 6.2" | ❌ CONDITION NOT DEFINED IN evaluateMarkingRequirementsInspector FUNCTION |
| A14.4.5.2.2 | Mark name/telephone of responsible person | ❌ CONDITION NOT DEFINED IN evaluateMarkingRequirementsInspector FUNCTION |
| A14.4.5.3 | Mark "BIOLOGICAL SUBSTANCE, CATEGORY B" and "UN3373" | ✅ CONDITION IS DEFINED IN evaluateMarkingRequirementsInspector FUNCTION |
| A14.4.5.4 | Mark name/phone for emergency contact | ❌ CONDITION NOT DEFINED IN evaluateMarkingRequirementsInspector FUNCTION |

**Notes on A14.4.5.3:** The function checks for UN3373 at lines 197-202 and adds "BIOLOGICAL SUBSTANCE, CATEGORY B" and "UN3373" markings.

---

### A14.4.6 - Class 7 (Radioactive Materials)

| Paragraph | Requirement Summary | Status |
|-----------|---------------------|--------|
| A14.4.6.1 | General requirements for all radioactive package types | ❌ CONDITION NOT DEFINED IN evaluateMarkingRequirementsInspector FUNCTION |
| A14.4.6.1.1 | Mark gross weight for packages over 50 kg | ❌ CONDITION NOT DEFINED IN evaluateMarkingRequirementsInspector FUNCTION |
| A14.4.6.1.2 | Mark PSN, UN Number, net quantity when dry ice used | ❌ CONDITION NOT DEFINED IN evaluateMarkingRequirementsInspector FUNCTION |
| A14.4.6.1.3 | Marking size requirements (12mm/6mm) | ❌ CONDITION NOT DEFINED IN evaluateMarkingRequirementsInspector FUNCTION |
| A14.4.6.2.1 | Mark "Radioactive Material, Excepted Package" | ❌ CONDITION NOT DEFINED IN evaluateMarkingRequirementsInspector FUNCTION |
| A14.4.6.2.2 | PSN not required for limited quantities with UN ID in diamond | ❌ CONDITION NOT DEFINED IN evaluateMarkingRequirementsInspector FUNCTION |
| A14.4.6.3.1 | Mark "TYPE IP-1", "TYPE IP-2", or "TYPE IP-3" | ❌ CONDITION NOT DEFINED IN evaluateMarkingRequirementsInspector FUNCTION |
| A14.4.6.3.2 | Mark country code ("USA") | ❌ CONDITION NOT DEFINED IN evaluateMarkingRequirementsInspector FUNCTION |
| A14.4.6.3.3 | Mark manufacturer name | ❌ CONDITION NOT DEFINED IN evaluateMarkingRequirementsInspector FUNCTION |
| A14.4.6.4.1 | Mark "TYPE A" | ❌ CONDITION NOT DEFINED IN evaluateMarkingRequirementsInspector FUNCTION |
| A14.4.6.4.2 | Mark country code for Type A | ❌ CONDITION NOT DEFINED IN evaluateMarkingRequirementsInspector FUNCTION |
| A14.4.6.4.3 | Mark manufacturer name for Type A | ❌ CONDITION NOT DEFINED IN evaluateMarkingRequirementsInspector FUNCTION |
| A14.4.6.5.1 | Mark "TYPE B(U)" or "TYPE B(M)" | ❌ CONDITION NOT DEFINED IN evaluateMarkingRequirementsInspector FUNCTION |
| A14.4.6.5.2 | Mark identification mark from NRC | ❌ CONDITION NOT DEFINED IN evaluateMarkingRequirementsInspector FUNCTION |
| A14.4.6.5.3 | Mark serial number for Type B | ❌ CONDITION NOT DEFINED IN evaluateMarkingRequirementsInspector FUNCTION |
| A14.4.6.5.4 | Mark trefoil radiation symbol | ❌ CONDITION NOT DEFINED IN evaluateMarkingRequirementsInspector FUNCTION |

---

### A14.4.7 - Class 8 (Corrosives)

| Paragraph | Requirement Summary | Status |
|-----------|---------------------|--------|
| A14.4.7.1 | Mark "CHEMICAL KITS" or "FIRST AID KITS" | ⏸️ COMMENTED OUT (TODO) - Lines 204-210 |

---

### A14.4.8 - Class 9 (Miscellaneous Dangerous Goods)

| Paragraph | Requirement Summary | Status |
|-----------|---------------------|--------|
| A14.4.8.1 | Mark "THIS SIDE UP" for wheelchairs/equipment with battery removed | ⏸️ COMMENTED OUT (TODO) - Lines 220-224 |
| A14.4.8.2 | PSN/ID not required for Class 9 articles unless enclosed | ❌ CONDITION NOT DEFINED IN evaluateMarkingRequirementsInspector FUNCTION |
| A14.4.8.3 | Mark PSN/UN for "Dangerous Goods in Machinery/Apparatus" | ⏸️ COMMENTED OUT (TODO) - Lines 226-228 |
| A14.4.8.4 | Mark "DRY ICE", "UN1845", and net mass | ⏸️ COMMENTED OUT (TODO) - Lines 230-238 |
| A14.4.8.5 | Mark lithium battery mark for excepted lithium batteries | ⏸️ COMMENTED OUT (TODO) - Lines 240-249 |
| A14.4.8.5.1 | Lithium battery mark size requirements | ❌ CONDITION NOT DEFINED IN evaluateMarkingRequirementsInspector FUNCTION |
| A14.4.8.5.2 | Lithium battery mark color requirements | ❌ CONDITION NOT DEFINED IN evaluateMarkingRequirementsInspector FUNCTION |
| A14.4.8.5.3 | Lithium battery mark content requirements | ❌ CONDITION NOT DEFINED IN evaluateMarkingRequirementsInspector FUNCTION |
| A14.4.8.5.4 | Mark "LITHIUM METAL BATTERIES - FORBIDDEN FOR TRANSPORT ABOARD PASSENGER AIRCRAFT" for UN3090 | ⏸️ COMMENTED OUT (TODO) - Lines 244-249 |

---

## Additional Markings in Function (Not Mapped to Specific A14 Paragraph)

| Marking | Lines | Notes |
|---------|-------|-------|
| Energy Storage Capacity (UN3508) | 213-218 | For capacitors manufactured after Dec 31, 2015 - **may correspond to 49 CFR requirements rather than A14** |

---

## Recommendations

### High Priority (Core Requirements)

1. **A14.4.1.2 - EX Number/NSN for Explosives**: Critical for Class 1 materials; no current implementation
2. **A14.4.6.x - Radioactive Materials**: Entire Class 7 marking section is not implemented (16 requirements)
3. **A14.3.2 - Reportable Quantity ("RQ")**: Commented out; needed for hazardous substances

### Medium Priority (Common Scenarios)

4. **A14.4.3.1 - Flash Point**: Commented out; needed for all Class 3 flammable liquids
5. **A14.4.8.4 - Dry Ice Marking**: Commented out; common material
6. **A14.4.8.5 - Lithium Battery Mark**: Commented out; increasingly common

### Lower Priority (Specialized/Edge Cases)

7. **A14.3.5 - Permit/COE/CAA Numbers**: Commented out
8. **A14.3.6 - Orientation Marking**: Commented out
9. **A14.3.7 - Overpack Marking**: Commented out
10. **A14.4.4.1 - Bromine compounds**: Rare materials

---

## Function Implementation Status

### Currently Active Conditions

```typescript
// Line 25-27: Military Shipping Label (all shipments)
markings["Military Shipping Label (MSL) or DD Form 1387"] = [...]

// Line 66-68: PSN and UN Number (all except UN3166)
markings["PSN and UN Number"] = [...]

// Line 102-108: Inhalation Hazard
if (properShippingName.includes("inhalation hazard")) {...}

// Line 110-112: Limited Quantity
if (quantityType === "limited") {...}

// Line 146-148: THIS END UP (UN1040 - Ethylene Oxide)
if (unIdNo === "UN1040") {...}

// Line 150-152: MEETS DOT REQUIREMENTS (UN1044 - Fire Extinguishers)
if (unIdNo === "UN1044") {...}

// Line 162-175: INSIDE CONTAINERS COMPLY (A6.2, Refrigerant Gas, LPG)
if (packingInstruction === "A6.2." || ...) {...}

// Line 186-188: Oxygen Generator (UN3356)
if (unIdNo === "UN3356") {...}

// Line 197-202: Biological Substance (UN3373)
if (unIdNo === "UN3373") {...}

// Line 213-218: Energy Storage Capacity (UN3508)
if (unIdNo === "UN3508") {...}
```

### Commented Out (TODO) Conditions

- COE Number, DOT Special Permit, CAA Number (lines 29-42)
- Technical Name (lines 45-47)
- Installation Location (lines 49-52)
- Vent Rate in SCFH (lines 54-57)
- Flash Point (lines 59-62)
- DRY ICE quantity (lines 83-85)
- Excepted Lithium Batteries (lines 88-92)
- Reportable Quantity "RQ" (lines 94-100)
- Orientation Marking (lines 114-118)
- OVERPACK (lines 120-123)
- Limited Quantity alternate (lines 125-128)
- Excepted Quantity (lines 130-133)
- Grandfathered Explosive (lines 135-139)
- Class 1 liquid "THIS SIDE UP" (lines 141-144)
- Cryogenic liquid orientation/vent rate (lines 154-159)
- Flash Point for Class 3 (lines 177-179)
- Inside Containers Comply for Oxidizer (lines 181-184)
- POISON for Div 6.1 (lines 190-194)
- Chemical Kit / First Aid Kit (lines 204-210)
- Battery Equipment THIS SIDE UP (lines 220-224)
- Machinery PSN UN (lines 226-228)
- DRY ICE full marking (lines 230-238)
- Lithium Battery Mark (lines 240-242)
- Lithium Metal Warning (lines 244-249)
