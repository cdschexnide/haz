# Preparer Workflow Architecture

**Last Updated:** 2026-01-14
**Audience:** Future Claude Code instances, engineers, maintainers
**Regulatory Basis:** AFMAN24-604 (Air Force Manual for Preparing Hazardous Materials for Military Air Shipments)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Complete Workflow Overview](#complete-workflow-overview)
3. [Workflow Phases](#workflow-phases)
4. [Screen-by-Screen Breakdown](#screen-by-screen-breakdown)
5. [PackagingScreen Branch Matrix](#packagingscreen-branch-matrix)
6. [Data / State Management Architecture](#data--state-management-architecture)
7. [Persistence Model](#persistence-model)
8. [Error Handling & Validation Patterns](#error-handling--validation-patterns)
9. [Key Technologies / Libraries](#key-technologies--libraries)
10. [Critical Implementation Notes](#critical-implementation-notes)
11. [File Locations Summary](#file-locations-summary)

---

## Companion Reference

For a code-accurate inventory of Preparer/Inspector global contexts and persistence contracts (including legacy vs active storage paths), see:

- `docs/architecture/persona-global-context-and-persistence.md`
- `docs/architecture/unified-graphql-api-draft.md`

---

## Executive Summary

This application is a hazardous materials (hazmat) preparation tool for the US Air Force, built around AFMAN24-604 regulations. Preparers use it to:

1. **Create shipment records** with TCN, shipper, consignee, and preparer information
2. **Identify hazardous materials** via UN number or proper shipping name search
3. **Determine quantity eligibility** (excepted, limited, or standard quantities)
4. **Select and validate packaging** using UN specification markings (POP markings)
5. **Generate required labels and markings** based on hazard classification
6. **Produce Shipper's Declaration** (SDDG form) for dangerous goods
7. **Certify shipments** with digital signature and persist to database

The core technical architecture uses:
- **Valtio** for reactive state management with `hazProPreparerContext`
- **React Navigation** with nested stacks for complex workflow routing
- **Expo FileSystem** for shipment persistence
- **Packaging Database V2** for AFMAN-compliant container validation

---

## Complete Workflow Overview

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          PREPARER WORKFLOW (2026-01-14)                          │
└─────────────────────────────────────────────────────────────────────────────────┘

  ╔════════════════════════════════════════════════════════════════════════════╗
  ║                        PHASE 1: SHIPMENT CREATION                           ║
  ╚════════════════════════════════════════════════════════════════════════════╝

┌──────────────────┐     ┌──────────────────┐     ┌─────────────────────────┐
│  Preparer        │     │ Disclaimer       │     │ ShipmentCreation        │
│  HomeScreen      │────▶│ Screen           │────▶│ Screen                  │
│                  │     │                  │     │                         │
│  "Create New     │     │  • Accept/Decline│     │  • TCN entry           │
│   Shipment"      │     │  • Legal notice  │     │  • POE/POD selection   │
│                  │     │                  │     │  • Shipper info        │
│  Or resume from  │     │                  │     │  • Consignee info      │
│  saved shipment  │     │                  │     │  • Preparer info       │
└────────┬─────────┘     └──────────────────┘     └─────────────────────────┘
         │                                                    │
         │ Long-press                                         │ Save & Continue
         │ to resume ────▶ Loads saved state                  ▼
         │
  ╔════════════════════════════════════════════════════════════════════════════╗
  ║                        PHASE 2: MATERIAL IDENTIFICATION                     ║
  ╚════════════════════════════════════════════════════════════════════════════╝

┌──────────────────────────────────────┐     ┌──────────────────────────────┐
│         MaterialIDScreen             │     │  ExplosiveDetailsWizard      │
│                                      │     │  (Class 1 Grandfathered)     │
│  • Search by UN number or PSN        │     │                              │
│  • Select material from results      │────▶│  • Multi-step wizard        │
│  • Packing group selection (if >1)   │     │  • Pre-1990 packaging       │
│  • Technical name (if A6.15)         │     │  • Skip packaging screens   │
│  • Flash point (Class 3)             │     └──────────────┬───────────────┘
│  • Grandfathered (Class 1)           │                    │
└──────────────────────────────────────┘                    │
                    │                                        │
                    │ Non-grandfathered Class 1              │
                    │ or other classes                       │
                    ▼                                        │
  ╔════════════════════════════════════════════════════════════════════════════╗
  ║                        PHASE 3: QUANTITY ENTRY                              ║
  ╚════════════════════════════════════════════════════════════════════════════╝

┌──────────────────────────────────────┐
│       QuantityEntryScreen            │
│                                      │
│  • Number of inner packages          │
│  • Quantity per inner package        │
│  • Total quantity                    │
│  • Gross weight                      │
│  • Kit containment checkbox          │
│                                      │
│  Automatic eligibility check:        │
│  ┌────────────────────────────────┐ │
│  │ EQ → LQ → Standard (waterfall) │ │
│  └────────────────────────────────┘ │
└──────────────────────────────────────┘
              │
    ┌─────────┴─────────┬────────────────────┐
    │                   │                    │
    ▼                   ▼                    ▼
┌────────────┐  ┌────────────────┐  ┌──────────────────────────┐
│ Excepted   │  │ Limited        │  │ Special Provisions       │
│ Quantity   │  │ Quantity       │  │ Acknowledgement          │
│ Packaging  │  │ Packaging      │  │ (standard workflow entry)│
│ Guidance   │  │ Guidance       │  │                          │
└─────┬──────┘  └───────┬────────┘  └──────────┬───────────────┘
      │                 │                      │
      ▼                 ▼                      │
┌──────────────────────────────────────────────┴──────────────┐
│                                                              │
│   SpecialProvisionsAcknowledgement (auto-skip if none)      │
│                                                              │
└───────────────────────────────┬──────────────────────────────┘
                                │
                   ┌────────────┴────────────┐
                   │                         │
                   ▼                         ▼
         [UNID-Based Routing]         [Standard Path]
                   │                         │
    ┌──────────────┴───────────┐            │
    │                          │            │
    ▼                          ▼            │
┌─────────────────┐  ┌─────────────────┐    │
│ UN3166 Fuel     │  │ DryIce Prep     │    │
│ UN2807 Magnet   │  │ Lithium Batteries│   │
│ UN3268 Safety   │  │ Capacitors      │    │
│ UN3529 Engines  │  │ Life Saving     │    │
│ UN3171 Battery  │  │ Kits            │    │
│ Vehicle         │  │ And more...     │    │
└────────┬────────┘  └────────┬────────┘    │
         │                    │             │
         └────────────────────┴─────────────┘
                              │
                              ▼
  ╔════════════════════════════════════════════════════════════════════════════╗
  ║                        PHASE 4: PACKAGING SELECTION                         ║
  ╚════════════════════════════════════════════════════════════════════════════╝

┌──────────────────────────────────────────────────────────────────────────────┐
│                           PackagingScreen                                     │
│                                                                               │
│  Entry Method Selection:                                                      │
│  ┌──────────────────────────────────────────────────────────────────────────┐│
│  │  [Scan POP]    [Enter POP]    [Walkthrough]   [COE/CAA]    [DOT-SP]    ││
│  │  (Disabled     (Manual or     (Wizard         (Certificate  (Special   ││
│  │   for Class 2)  Cylinder)      guidance)       upload)       permit)   ││
│  └──────────────────────────────────────────────────────────────────────────┘│
│                                                                               │
│  Class 2 (Cylinders): Always routes to CylinderEntryScreen                   │
│  Other Classes: Routes based on user selection                               │
└──────────────────────────────────────────────────────────────────────────────┘
              │
    ┌─────────┴────────────┬───────────────────┬──────────────────┐
    │                      │                   │                  │
    ▼                      ▼                   ▼                  ▼
┌────────────┐     ┌──────────────────┐  ┌──────────────┐  ┌──────────────┐
│ POPScanner │     │ ManualEntry      │  │ PackagingWiz │  │ Cylinder     │
│ Screen     │     │ PackagingType    │  │ ardV2        │  │ EntryScreen  │
│            │     │ Selection        │  │              │  │ (Class 2)    │
│ OCR scan   │     │                  │  │ 4-step       │  │              │
│ extraction │     │ Single/Combo/    │  │ walkthrough  │  │ MEGC or      │
│            │     │ Composite        │  │              │  │ individual   │
└─────┬──────┘     └────────┬─────────┘  └──────┬───────┘  └──────┬───────┘
      │                     │                   │                  │
      ▼                     ▼                   ▼                  │
┌────────────────────────────────────────────────────────────────┐│
│                  POPMarkingDataEntry                           ││
│                                                                ││
│  Fields A-H Entry (UN Specification Package Marking):          ││
│  ┌────────────────────────────────────────────────────────────┐││
│  │ A: UN Symbol     E: Test Pressure/S                       │││
│  │ B: Package Code  F: Year of Manufacture                   │││
│  │ C: Packing Group G: Country Code                          │││
│  │ D: Gross Mass    H: Manufacturer Symbol                   │││
│  └────────────────────────────────────────────────────────────┘││
│                                                                ││
│  Validation: Against packagingDatabaseV2                       ││
└─────────────────────────────────┬──────────────────────────────┘│
                                  │                               │
              ┌───────────────────┴───────────────────┐           │
              │                                       │           │
              ▼                                       ▼           │
     ┌────────────────┐                    ┌──────────────────┐   │
     │ Single         │                    │ Combination/     │   │
     │ Packaging      │                    │ Composite        │   │
     │                │                    │                  │   │
     │ Skip inner     │                    │ InnerPackaging   │   │
     │ packaging      │                    │ Wizard           │   │
     └───────┬────────┘                    └────────┬─────────┘   │
             │                                      │             │
             │                   ┌──────────────────┴──────────┐  │
             │                   │                             │  │
             │                   ▼                             │  │
             │          ┌─────────────────────┐               │  │
             │          │ AbsorbentCushioning │               │  │
             │          │ Requirements        │               │  │
             │          │ (if liquid)         │               │  │
             │          └──────────┬──────────┘               │  │
             │                     │                          │  │
             └─────────────────────┴──────────────────────────┴──┘
                                   │
                                   ▼
  ╔════════════════════════════════════════════════════════════════════════════╗
  ║                        PHASE 5: DOCUMENTATION                               ║
  ╚════════════════════════════════════════════════════════════════════════════╝

┌──────────────────────────────────────┐
│       LabelingAndMarking             │
│                                      │
│  Displays computed requirements:     │
│  • Primary hazard label              │
│  • Subsidiary hazard labels          │
│  • Cargo Aircraft Only (if P1-P4)    │
│  • MSL / DD Form 1387                │
│  • Other markings by material type   │
│                                      │
│  Vehicle exception: No labels needed │
│  Excepted Qty: Routes to EQ confirm  │
└──────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────┐
│   ShippersDeclarationScreen          │
│                                      │
│  SDDG Form with all data:            │
│  • Shipper/Consignee info            │
│  • UN number, PSN, hazard class      │
│  • Packaging details                 │
│  • Emergency contact numbers         │
│  • Signatory information             │
│                                      │
│  PDF generation & COE/CAA merge      │
│  Share functionality                 │
└──────────────────────────────────────┘
                    │
                    ▼
  ╔════════════════════════════════════════════════════════════════════════════╗
  ║                        PHASE 6: CERTIFICATION                               ║
  ╚════════════════════════════════════════════════════════════════════════════╝

┌──────────────────────────────────────┐
│          CertifyForm                 │
│                                      │
│  • Digital signature capture         │
│  • Signature preview                 │
│  • "Certify" saves with completed    │
│    status + resets context           │
│  • "Save & Exit" preserves state     │
└──────────────────────────────────────┘
                    │
      ┌─────────────┼──────────────┐
      │             │              │
   Cancel       Save & Exit    Certify
      │             │              │
      ▼             ▼              ▼
   Go Back     In-Progress     Completed
               (preserves)     (resets)
      │             │              │
      └─────────────┴──────────────┘
                    │
                    ▼
┌──────────────────────────────────────┐
│       PreparerHomeScreen             │
│                                      │
│  • Updated shipment list             │
│  • Can view/resume saved shipments   │
│  • Fresh context for new shipment    │
└──────────────────────────────────────┘
```

---

## Workflow Phases

### Phase 1: Shipment Creation
**Screens:** `PreparerHomeScreen` → `DisclaimerScreen` → `ShipmentCreationScreen`

Creates the foundational shipment record with transportation control number (TCN), ports of embarkation/destination, and party information (shipper, consignee, preparer).

### Phase 2: Material Identification
**Screens:** `MaterialIDScreen` → (optional) `ExplosiveDetailsWizard`

Identifies the hazardous material via UN number or proper shipping name search. Handles packing group selection, technical name requirements, and grandfathered explosive logic.

### Phase 3: Quantity Entry
**Screens:** `QuantityEntryScreen` → Quantity-specific guidance screens

Captures packaging quantities and determines eligibility path (excepted, limited, or standard workflow).

### Phase 4: Packaging Selection
**Screens:** `PackagingScreen` → Multiple branch paths → `POPMarkingDataEntry` → (optional) `InnerPackagingWizard`

The most complex phase with multiple branching paths based on hazard class, entry method, and packaging type.

### Phase 5: Documentation
**Screens:** `LabelingAndMarking` → `ShippersDeclarationScreen`

Computes and displays required labels/markings, then generates the Shipper's Declaration for Dangerous Goods (SDDG).

### Phase 6: Certification
**Screens:** `CertifyForm` → `PreparerHomeScreen`

Captures digital signature, persists the complete shipment, and resets context for the next shipment.

---

## Screen-by-Screen Breakdown

### PreparerHomeScreen

**File:** `src/components/PreparerHomeScreen.tsx`

**Purpose:** Entry point for Preparer workflow. Displays saved shipments and provides "Create New Shipment" action.

**Key UI Actions:**
- "Create New Shipment" button → `navigate("WrappedStack", { screen: "Disclaimer" })`
- Long-press on shipment row → Bottom sheet with Resume/View options
- Resume loads shipment state and navigates to appropriate step

**State Writes:**
- On resume: `actions.loadShipment(shipmentId)` replaces entire `hazProPreparerContext`

**Navigation Out:**
- Create new → `DisclaimerScreen`
- Resume → Step-specific screen based on `activeStep` value

---

### DisclaimerScreen

**File:** `src/components/DisclaimerScreen.tsx`

**Purpose:** Legal disclaimer that user must accept before proceeding.

**Key UI Actions:**
- "Accept" button → Proceeds to workflow
- "Decline" button → Returns to home

**State Writes:** None

**Navigation Out:**
- Accept (Preparer) → `ShipmentCreation`
- Decline → `PreparerHome`

---

### ShipmentCreationScreen

**File:** `src/components/ShipmentCreationScreen.tsx`

**Purpose:** Captures shipment details, shipper/consignee information, and preparer certification data.

**Field List:**

| Field | Form Name | Type | Validation | Required |
|-------|-----------|------|------------|----------|
| TCN | `tcn` | string | Exactly 17 characters | YES |
| POE Option | `poeOption` | enum | "Channel" or "Worldwide Mobility" | YES |
| POD Option | `podOption` | enum | "Channel" or "Worldwide Mobility" | YES |
| Chapter 3 | `isChapter3` | enum | "Yes" or "No" | YES |
| POE Details | `poe` | string | Required if poeOption === "Channel" | CONDITIONAL |
| POD Details | `pod` | string | Required if podOption === "Channel" | CONDITIONAL |
| Shipper Country | `shipperCountry` | string | Required if poeOption === "Channel" | CONDITIONAL |
| Shipper Location | `shipperLocation` | string | Required if poeOption === "Channel" | CONDITIONAL |
| Shipper Street | `shipperStreet` | string | Required if poeOption === "Channel" | CONDITIONAL |
| Shipper City | `shipperCity` | string | Required if poeOption === "Channel" | CONDITIONAL |
| Shipper State | `shipperState` | string | Disabled if country ≠ USA | NO |
| Shipper Zip | `shipperZipcode` | string | Required if poeOption === "Channel" | CONDITIONAL |
| Consignee Country | `consigneeCountry` | string | Required if podOption === "Channel" | CONDITIONAL |
| Consignee DODAAC | `consigneeDodaac` | string | 6 digits if podOption === "Channel" | CONDITIONAL |
| Preparer Name | `preparerName` | string | Non-empty | YES |
| Preparer Title | `preparerTitle` | string | Non-empty | YES |
| Certification Place | `certificationPlace` | string | Non-empty | YES |
| Certification Date | `certificationDate` | string | Valid date (YYYY-MM-DD) | YES |

**Key UI Actions:**
- Save & Continue → Validates form, proceeds to material identification
- Cancel → Returns to home (prompts if unsaved changes)

**State Writes:**
- Direct mutations on `store.hazProPreparerContext.shipment.*`
- Direct mutations on `store.hazProPreparerContext.shipper.*`
- Direct mutations on `store.hazProPreparerContext.consignee.*`
- Direct mutations on `store.hazProPreparerContext.preparer.*`

**Conditional Logic:**
- Country selection affects State field editability (USA only)
- POE/POD option selection shows/hides address fields
- "Worldwide Mobility" selection auto-fills read-only field

**Navigation Out:**
- Save & Continue → `MaterialID`
- Cancel → `PreparerHomeStack` → `PreparerHome`

---

### MaterialIDScreen

**File:** `src/components/MaterialIDScreen.tsx`

**Purpose:** Search and select hazardous material from AFMAN database. Handle packing group selection, technical name entry, and grandfathered explosive determination.

**Search Behavior:**
- Minimum 4 characters to trigger search
- Searches UN number (exact substring) and PSN (case-insensitive substring)
- No debounce (immediate filter on keystroke)
- Data source: `hazardousMaterialsList` from `../hazardousMaterials/hazardousMaterialsList`

**Key UI Actions:**
- Select material from search results → `handleMaterialSelect(material)`
- Packing group picker (if multiple) → Re-filters special provisions and packaging paragraphs
- Technical name picker/input → Stores in `store.hazProPreparerContext.technicalName`
- Grandfathered selection (Class 1 only) → Routes to `ExplosiveDetailsWizard`
- Flash point input (Class 3 only) → Stores in `hazardousMaterial.flashPoint`

**State Writes:**
- `store.hazProPreparerContext.hazardousMaterial` = deep clone of selected material
- `store.hazProPreparerContext.allowablePackingGroups` = material.packingGroup
- `store.hazProPreparerContext.specialProvisionsMap` = loaded from material
- `store.hazProPreparerContext.modifiersAndRequiredAcknowledgements` = loaded workflow modifiers
- `store.hazProPreparerContext.lookupFunctionsOutput` = result of `hazProContextLookup()`
- `store.hazProPreparerContext.technicalName` (if required)
- `store.hazProPreparerContext.isGrandfatheredExplosive` (Class 1 only)

**Navigation Out:**
- Class 1 + Grandfathered=YES → `ExplosiveDetailsWizard`
- Class 1 + Grandfathered=NO → `QuantityEntryScreen`
- Other classes → `QuantityEntryScreen`

---

### QuantityEntryScreen

**File:** `src/components/QuantityEntryScreen.tsx`

**Purpose:** Capture packaging quantities and determine eligibility path (excepted, limited, or standard).

**Input Fields:**

| Field | Type | Validation | Unit Options |
|-------|------|------------|--------------|
| Number of Inner Packages | integer | Numeric, > 0 | N/A |
| Quantity per Inner Package | decimal | Numeric, ≥ 0 | mL, L, g, kg (based on physical state) |
| Total Quantity | decimal | Numeric, ≥ 0 | mL, L, g, kg |
| Gross Weight | decimal | Numeric, ≥ 0 | kg, lbs |
| Is in Kit | boolean | Toggle | N/A |

**Eligibility Check Logic (300ms debounce):**
```
1. Check Excepted Quantity eligibility → isHazardousMaterialExceptedQuantity()
   If eligible → status = "excepted", store EQ data, return

2. Check Limited Quantity eligibility → isHazardousMaterialLimitedQuantity()
   If eligible → status = "limited", store LQ data, return

3. Default → status = "standard"
```

**State Writes:**
- `actions.updateExceptedQuantityData(eqData)` if excepted
- `actions.updateLimitedQuantityData(lqData)` if limited
- `actions.setIsExceptedQuantity(true/false)`
- `actions.setIsLimitedQuantity(true/false)`

**Navigation Out:**
- Excepted → `ExceptedQuantityPackagingGuidance`
- Limited → `LimitedQuantityPackagingGuidance`
- Standard → `SpecialProvisionsAcknowledgement`

---

### SpecialProvisionsAcknowledgementScreen

**File:** `src/components/SpecialProvisionsAcknowledgementScreen.tsx`

**Purpose:** Acknowledge special provisions for the selected material before packaging.

**Key UI Actions:**
- Acknowledge button → Proceeds to packaging or specialty screen

**State Writes:**
- `modifiersAndRequiredAcknowledgements.specialProvisionsAcknowledged = true`

**Navigation Out (extended UNID routing):**

| UN Number | Route |
|-----------|-------|
| UN3166 | `UN3166FuelEntryScreen` |
| UN2807 | `MagnetizedMaterialPrepScreen` |
| UN3268 | `SafetyDevicesPreparationScreen` |
| UN1845 | `DryIcePrepScreen` |
| UN3090, UN3480 | `LithiumBatteriesPrepScreen` |
| UN3529, UN3528, UN3530 | `EnginesInternalCombustion` |
| UN3171 | `BatteryPoweredVehicle` |
| UN3072, UN2990 | `LifeSavingAppliances` |
| UN3316 | `KitPreparationScreen` |
| Default | `PackagingScreen` |

---

### PackagingScreen

**File:** `src/components/PackagingScreen.tsx`

**Purpose:** Entry method selection for packaging. Routes to different flows based on hazard class and user choice.

**Key UI Actions:**

| Button | Action | Condition |
|--------|--------|-----------|
| Scan POP | → `POPScannerScreen` | Non-Class 2 only |
| Enter POP | → `ManualEntryPackagingTypeSelectionScreen` OR `CylinderEntryScreen` | Class 2 → Cylinder; else → Manual |
| Walkthrough | → `PackagingWizardV2` | Non-Class 2 only |
| Upload COE/CAA | → `CoeAndCaaDisclaimer` | All classes |
| Upload DOT-SP | → `DotSpScreen` | All classes |

**State Writes on Entry Method Selection:**
```typescript
store.hazProPreparerContext.packaging.usesPopMarking = true;  // or false for cylinders
store.hazProPreparerContext.packaging.usesDotCylinderMarking = false;  // or true for Class 2
store.hazProPreparerContext.packagingEntryMethod = 'scan' | 'manual' | 'walkthrough';
store.hazProPreparerContext.packaging.inputPOPMarking = { A: null, B: null, ... H: null };
```

**Navigation Out:** See Branch Matrix below

---

### POPMarkingDataEntry

**File:** `src/components/POPMarkingDataEntry.tsx`

**Purpose:** Enter and validate UN specification package marking fields (A-H).

**POP Marking Fields:**

| Field | Type | Description | Validation | Auto-fill |
|-------|------|-------------|------------|-----------|
| B | Text | Package type code | 2-4 alphanumeric; validated against AFMAN database | None |
| C | Button Group | Packing Group (X, Y, Z) | Must match `allowablePackingGroups()` | Auto-selected if only 1 option |
| D | Numeric | Max Gross Mass (kg) or Relative Density | Numeric only | None |
| E | Numeric/Text | Test Pressure (kPa) or "S" for solids | Numeric for liquids; "S" auto-filled for solids | Auto "S" for solids |
| F | Numeric | Year of Manufacture (2 digits) | Cannot exceed current year | None |
| G | Picker | Country code | Valid ISO country code with autocomplete | None |
| H | Text | Manufacturer/Certifier symbol | Alphanumeric | None |

**Key UI Actions:**
- Field B blur → Validates against `validatePackagingCodeV2()`
- Save & Exit → Persists "in-progress" and returns home
- Save & Continue → Validates and routes based on packaging type

**State Writes:**
- `store.hazProPreparerContext.packaging.inputPOPMarking.*` for each field
- `store.hazProPreparerContext.packaging.popIsValid` based on validation
- `store.hazProPreparerContext.packaging.totalNetMass`
- `store.hazProPreparerContext.packaging.totalNetVolume`
- `store.hazProPreparerContext.overpack` flag

**Navigation Out:**
- Single packaging → `LabelingAndMarking`
- Combination/Composite → `InnerPackagingWizard`

---

### InnerPackagingWizard

**File:** `src/components/InnerPackagingWizard.tsx`

**Purpose:** 3-step wizard for inner packaging selection (combination/composite packaging only).

**Steps:**
1. **Step 0:** Select inner packaging material type
2. **Step 1:** Enter container count and quantity per container
3. **Step 2:** Review and confirm

**State Writes:**
- `packaging.combinationPackaging.numberOfInnerContainers`
- `packaging.combinationPackaging.innerPackaging.packagingType`
- `packaging.totalNetMass.kg` (calculated)
- `absorbentStepRequired` (if liquid)

**Navigation Out:**
- If absorbent required → `AbsorbentCushioningRequirements`
- Otherwise → `LabelingAndMarking`

---

### LabelingAndMarking

**File:** `src/components/LabelingAndMarking.tsx`

**Purpose:** Display computed labeling and marking requirements based on hazard classification.

**Requirements Computation:** `evaluateLabelingRequirements(context)` considers:
- Hazard class/division (`hazclassDiv`)
- UN number (special cases like UN2807)
- Special provisions (P1-P4 for Cargo Aircraft Only)
- Subsidiary risk
- Excepted/Limited quantity status

**Standard Requirements:**

| Requirement | Condition |
|-------------|-----------|
| Military Shipping Label (MSL) or DD Form 1387 | Always required |
| Primary Hazard Label | Unless UN2807 (magnetized) |
| Subsidiary Hazard Label | If subsidiary risk exists |
| Cargo Aircraft Only | If P1, P2, P3, or P4 special provision |
| Compatibility Group | Class 1 explosives |

**Special Cases:**
- Vehicles (UN3166): "Vehicles do not require labels or markings, unless crated/packaged"
- Excepted Quantity: Auto-routes to `ExceptedQuantityConfirmationScreen`
- Limited Quantity: Shows LQ banner but proceeds normally

**State Writes:**
- `store.hazProPreparerContext.activeStep = 3`
- `completedSubsteps.push("LabelingAndMarking")`

**Navigation Out:**
- Excepted quantity → `ExceptedQuantityConfirmationScreen`
- Standard → `ShippersDeclarationScreen`

---

### ShippersDeclarationScreen

**File:** `src/components/ShippersDeclarationScreen.tsx`

**Purpose:** Generate and display the Shipper's Declaration for Dangerous Goods (SDDG) form.

**Data Sources:**

| SDDG Field | Source Path |
|------------|-------------|
| Shipper Name | `shipper?.address.shipperLocation` |
| Shipper Address | `shipper?.address` (street/city/state/zip) |
| Consignee DODAAC | `consignee?.address?.consigneeDodaac` |
| TCN/Reference | `shipment?.tcn` |
| Airport of Departure | `shipment?.poe` |
| Airport of Destination | `shipment?.pod` |
| UN/ID Number | `hazardousMaterial?.unid` |
| Proper Shipping Name | `hazardousMaterial?.properShippingName` |
| Hazard Class/Division | `hazardousMaterial?.hazclassDiv` |
| Packing Group | `hazardousMaterial?.packingGroup` |
| Quantity & Type | Calculated from packaging/special material data |
| Packing Instruction | `hazardousMaterial?.packagingParagraph` or waiver doc |
| Signatory Name/Title | `preparer?.preparerName`, `preparer?.preparerTitle` |
| Location/Date | `preparer?.certificationPlace`, `preparer?.certificationDate` |

**Emergency Phone Numbers:**
- Class 1 (Explosives): `+1(703)-695-4695/4696` / DSN: `312-225-4695/4696`
- Other classes: `1-800-851-8061` / `+1-804-279-3131`

**Key UI Actions:**
- Share SDDG → Generates PDF via `expo-print`, merges COE/CAA docs if present, opens share dialog
- Save & Continue → Proceeds to certification

**State Writes:**
- `store.hazProPreparerContext.activeStep = 4`
- `completedSubsteps.push("ShippersDeclarationScreen")`

**Navigation Out:** `Certify` (CertifyForm)

---

### CertifyForm

**File:** `src/components/CertifyForm.tsx`

**Purpose:** Capture digital signature and finalize shipment certification.

**Signature Capture:**
- Component: `SignatureModal` using `react-native-signature-canvas`
- Storage format: Base64-encoded PNG data URL
- Location: `store.hazProPreparerContext.preparer.signature`

**Key UI Actions:**
- Sign/Re-sign button → Opens `SignatureModal`
- Cancel → Goes back
- Save & Exit → `saveCurrentShipment("in-progress")` → Home (context preserved)
- Certify → `saveCurrentShipment("completed")` → Home (context reset)

**State Writes:**
- `store.hazProPreparerContext.preparer.signature = signatureDataUrl`
- On certify: `resetContext()` clears entire `hazProPreparerContext`

**Navigation Out:**
- Cancel → Previous screen
- Save & Exit → `PreparerHomeStack` → `PreparerHome`
- Certify → `PreparerHomeStack` → `PreparerHome`

---

## PackagingScreen Branch Matrix

| Trigger Condition | Branch Name | Entry Screen | Screen Sequence | Convergence Point |
|-------------------|-------------|--------------|-----------------|-------------------|
| Class 2 (hazclassDiv starts with "2") | Cylinder Flow | `CylinderEntryScreen` | CylinderEntry (3 steps) → | `LabelingAndMarking` |
| Non-Class 2, Scan method | POP Scanner | `POPScannerScreen` | POPScanner → POPScanResults → POPMarkingDataEntry → | Inner or Labeling |
| Non-Class 2, Manual entry | Manual Entry | `ManualEntryPackagingTypeSelection` | TypeSelection → POPMarkingDataEntry → | Inner or Labeling |
| Non-Class 2, Walkthrough | Wizard | `PackagingWizardV2` | PackagingWizard (4 steps) → POPMarkingDataEntry → | Inner or Labeling |
| Single packaging type | Single Exit | `POPMarkingDataEntry` | POPMarkingDataEntry → | `LabelingAndMarking` |
| Combination/Composite type | Inner Required | `POPMarkingDataEntry` | POPMarkingDataEntry → InnerPackagingWizard → | `LabelingAndMarking` |
| Inner + liquid + absorbent criteria | Absorbent | `InnerPackagingWizard` | InnerWizard → AbsorbentCushioning → | `LabelingAndMarking` |
| COE/CAA upload | Certificate | `CoeAndCaaDisclaimer` | CoeAndCaaDisclaimer → | Certificate flow |
| DOT-SP upload | Special Permit | `DotSpScreen` | DotSpScreen → | Permit flow |

### Branch Decision Logic in PackagingScreen

```typescript
// PackagingScreen.tsx routing logic
if (isClass2) {
  // Class 2 cylinders always go to CylinderEntryScreen
  navigation.navigate("CylinderEntryScreen");
} else {
  // Non-Class 2 offers multiple entry methods
  switch (selectedMethod) {
    case 'scan':
      navigation.navigate("POPScannerScreen");
      break;
    case 'manual':
      navigation.navigate("ManualEntryPackagingTypeSelectionScreen");
      break;
    case 'walkthrough':
      navigation.navigate("PackagingWizardV2");
      break;
  }
}
```

### POPMarkingDataEntry Exit Routing

```typescript
// POPMarkingDataEntry.tsx routing logic
const effectivePackagingType = getEffectivePackagingType();

if (effectivePackagingType?.toLowerCase() === "single") {
  navigation.navigate("LabelingAndMarking");
} else if (
  effectivePackagingType?.toLowerCase() === "combination" ||
  effectivePackagingType?.toLowerCase().includes("composite")
) {
  navigation.navigate("InnerPackagingWizard");
}
```

---

## Data / State Management Architecture

### State Provider Hierarchy

```
HazProStore (Valtio proxy)
├── hazProPreparerContext: HazProPreparerContext  ← Main shipment state
├── shipmentsIndex: Record<string, ShipmentMetadata>
├── isLoadingShipments: boolean
├── loadingShipmentId?: string
├── databaseError: string | null
├── sddgWorkflow: SDDGWorkflowState
└── sddgInspectionContext: SDDGInspectionContext
```

### HazProPreparerContext Shape

```typescript
interface HazProPreparerContext {
  // Core Material Data
  hazardousMaterial: HazardousMaterialItem | null;
  lookupFunctionsOutput: HazProContextLookupOutput | null;

  // Packaging Configuration
  packaging: {
    packagingType: "Single" | "Combination" | "Composite" | "";
    selectedPackagingOptionId?: string;
    usesPopMarking?: boolean;
    usesDotCylinderMarking?: boolean;
    inputPOPMarking: { A, B, C, D, E, F, G, H };
    totalNetMass?: { lbs: number; kg: number };
    totalNetVolume?: { liters: number; gallons: number };
    popIsValid?: boolean;
  } | null;

  // Shipment Details
  shipment: {
    poeOption: string;
    podOption: string;
    isChapter3?: string;
    tcn: string;
    poe: string;
    pod: string;
  } | null;
  currentShipmentId?: string;

  // Party Information
  preparer: Preparer | null;
  shipper: { name, address, phoneNumber } | null;
  consignee: { address, phoneNumber } | null;

  // Workflow State
  activeStep: number | null;
  activeSubstep: number | null;
  completedSubsteps: string[];

  // Certifications & Waivers
  usesCoeCertification: boolean;
  usesCaaCertification: boolean;
  usesDotSpPermit: boolean;

  // Special Material Data
  lithiumBatteryData?: LithiumBatteryData;
  dryIceData?: DryIceData;
  un3166Details?: UN3166Details;
  // ... other material-specific types
}
```

### Key Actions

| Action | Effect | Where Used |
|--------|--------|-----------|
| `updateHazardousMaterial(material)` | Sets hazardous material | MaterialIDScreen |
| `updatePackaging(updates)` | Patches packaging config | PackagingScreen, POPMarkingDataEntry |
| `updatePOPMarking(field, value)` | Updates individual POP field | POPMarkingDataEntry |
| `updateShipment(updates)` | Patches shipment details | ShipmentCreationScreen |
| `updateShipper(updates)` | Patches shipper info | ShipmentCreationScreen |
| `updateConsignee(updates)` | Patches consignee info | ShipmentCreationScreen |
| `updatePreparer(updates)` | Patches preparer info | CertifyForm |
| `setActiveStep(step)` | Sets current step (0-5) | Various screens |
| `completeSubstep(substep)` | Adds to `completedSubsteps[]` | Various screens |
| `saveCurrentShipment(status)` | Persists to database | Save & Exit, Certify |
| `loadShipment(id)` | Loads from database | Resume from home |
| `resetContext()` | Clears to initial state | After certification |

### Hook Access Patterns

```typescript
// Full store access (reactive)
const { state, store, actions } = useHazProStore();

// Actions only (no re-renders)
const actions = useHazProActions();

// Direct state access
const context = state.hazProPreparerContext;
const material = context.hazardousMaterial;
```

---

## Persistence Model

### Storage Backend

- **Technology:** Expo FileSystem (`expo-file-system`)
- **Location:** `DocumentsDirectory/app-data/shipments/`
- **Format:** JSON files per shipment

### Directory Structure

```
DocumentsDirectory/
├── app-data/
│   ├── shipments/
│   │   ├── shipment-{timestamp}.json
│   │   └── ...
│   ├── shipments-index.json
│   └── backups/
```

### SavedShipment Structure

```typescript
interface SavedShipment {
  id: string;                      // Timestamp-based unique ID
  status: "in-progress" | "completed";
  savedAt: Date;
  hazProPreparerContext: HazProPreparerContext;  // Complete snapshot
}
```

### Save/Load Flow

**Save Operation:**
```typescript
async saveCurrentShipment(status: "in-progress" | "completed") {
  const shipment: SavedShipment = {
    id: Date.now().toString(),
    status,
    savedAt: new Date(),
    hazProPreparerContext: hazProStore.hazProPreparerContext,
  };

  await ShipmentDatabase.saveShipment(shipment);
  await refreshShipmentsIndex();

  if (status === "completed") {
    resetContext();  // Clear form for next shipment
  }
}
```

**Load Operation:**
```typescript
async loadShipment(shipmentId: string) {
  const shipment = await ShipmentDatabase.loadShipment(shipmentId);
  hazProStore.hazProPreparerContext = shipment.hazProPreparerContext;
  hazProStore.currentShipmentId = shipmentId;
}
```

### Resume Capability

Users can resume in-progress shipments:
1. Long-press shipment in PreparerHomeScreen
2. Select "Resume Preparation"
3. `loadShipment()` replaces context with saved state
4. Navigation to appropriate step based on `activeStep`

**Step-to-Screen Mapping:**
```typescript
Step 1 → MaterialID
Step 2 → PackagingScreen (or specific substep)
Step 3 → LabelingAndMarking
Step 4 → ShippersDeclarationScreen
Step 5 → Certify
```

---

## Error Handling & Validation Patterns

### Form Validation

**Validation Library:** Yup with react-hook-form

```typescript
// ShipmentCreationScreen validation pattern
const schema = yup.object().shape({
  tcn: yup.string().length(17).required(),
  poeOption: yup.string().required(),
  // Conditional validation
  poe: yup.string().when('poeOption', {
    is: 'Channel',
    then: yup.string().required(),
  }),
});
```

### POP Marking Validation

```typescript
// POPMarkingDataEntry validation against AFMAN database
const validatePackagingCode = () => {
  const result = validatePackagingCodeV2(
    packagingDatabaseV2,
    packagingParagraph,
    fields.B,
    packagingType
  );

  if (!result?.isValid) {
    setPackagingCodeError("Packaging code not authorized for this material");
    store.hazProPreparerContext.packaging.popIsValid = false;
  }
};
```

### Database Error Handling

```typescript
try {
  await actions.saveCurrentShipment("completed");
} catch (error) {
  hazProStore.databaseError = error.message;
  // Error displayed via DatabaseErrorDisplay component
}

// UI displays error with retry option
<DatabaseErrorDisplay
  error={state.databaseError}
  onRetry={() => actions.saveCurrentShipment("completed")}
/>
```

### Quantity Limit Validation

```typescript
// QuantityEntryScreen
if (enteredQty > maxGrossMass) {
  Alert.alert(
    "Quantity Exceeds Limit",
    `The entered quantity (${enteredQty}) exceeds the maximum gross mass (${maxGrossMass} kg)`
  );
}
```

---

## Key Technologies / Libraries

### State Management

| Technology | Purpose |
|------------|---------|
| Valtio | Reactive proxy-based state (`hazProStore`) |
| React Context | Legacy provider (migration in progress) |

### Navigation

| Technology | Purpose |
|------------|---------|
| React Navigation | Stack/Drawer navigation |
| Nested Navigators | PreparerHomeStack, WrappedStack, MainStack |

### Forms

| Technology | Purpose |
|------------|---------|
| react-hook-form | Form state management |
| Yup | Schema validation |

### UI Components

| Technology | Purpose |
|------------|---------|
| React Native | Core UI |
| @expo/vector-icons | Icon library |
| react-native-signature-canvas | Signature capture |
| @react-native-picker/picker | Dropdown selection |
| @react-native-community/datetimepicker | Date selection |

### Persistence

| Technology | Purpose |
|------------|---------|
| expo-file-system | File system operations |
| expo-print | PDF generation |
| expo-sharing | Share functionality |
| pdf-lib | PDF merging (COE/CAA documents) |

### Data Sources

| Technology | Purpose |
|------------|---------|
| hazardousMaterialsList | Material lookup database |
| packagingDatabaseV2 | AFMAN packaging validation |

---

## Critical Implementation Notes

### 1. State Mutation Timing

**Always save to database BEFORE updating context state.** This prevents data loss if save fails.

```typescript
// CORRECT
await ShipmentDatabase.saveShipment(shipment);
resetContext();

// INCORRECT - data loss risk
resetContext();
await ShipmentDatabase.saveShipment(shipment);
```

### 2. Context Reset After Certification

The `resetContext()` function is called automatically when `saveCurrentShipment("completed")` succeeds. This clears the entire form for the next shipment.

**Preserved:** `shipmentsIndex` (users can still see history)
**Cleared:** All form fields, `completedSubsteps`, `activeStep`, signature

### 3. Navigation Stack Structure

```
navigate("WrappedStack", { screen: "ScreenName" })  // Most workflow screens
navigate("PreparerHomeStack", { screen: "PreparerHome" })  // Return to home
```

### 4. Class 2 Cylinder Special Handling

Class 2 (gases in cylinders) bypasses the standard POP marking flow entirely:
- Scan/Walkthrough buttons are disabled
- "Enter POP" always routes to `CylinderEntryScreen`
- `usesDotCylinderMarking = true`, `usesPopMarking = false`

### 5. Grandfathered Explosives

Class 1 materials packaged before January 1990 skip the packaging selection screens:
- Routes directly from `MaterialIDScreen` → `ExplosiveDetailsWizard` → `LabelingAndMarking`
- No POP marking entry required

### 6. Excepted Quantity Auto-Navigation

When `isExceptedQuantity === true`, `LabelingAndMarking` automatically navigates to `ExceptedQuantityConfirmationScreen`:

```typescript
useEffect(() => {
  if (isExceptedQuantity) {
    navigation.navigate("ExceptedQuantityConfirmationScreen");
  }
}, []);
```

### 7. inputPOPMarking Initialization

POP marking fields are initialized differently based on entry method:
- **Scanner:** Fields populated from OCR extraction
- **Manual/Walkthrough:** Field A set to "UN", others null
- **Solids:** Field E auto-set to "S"

### 8. Packaging Code Validation Database

The `packagingDatabaseV2` is the authoritative source for validating packaging codes against AFMAN 24-604. Located in `server/lookupFunctions/packagingLookupV2.ts`.

### 9. Step Tracking for Resume

The `completedSubsteps` array tracks which screens have been completed:
```typescript
["MaterialID", "PackagingScreen", "POPMarkingDataEntry", "LabelingAndMarking"]
```

Resume navigation uses this array to determine the starting point.

### 10. Signature Storage

Signatures are stored as Base64-encoded PNG data URLs in `preparer.signature`. This format is portable and can be directly rendered in HTML for PDF generation.

---

## File Locations Summary

| Screen | File Path |
|--------|-----------|
| Preparer Home | `src/components/PreparerHomeScreen.tsx` |
| Disclaimer | `src/components/DisclaimerScreen.tsx` |
| Shipment Creation | `src/components/ShipmentCreationScreen.tsx` |
| Material ID | `src/components/MaterialIDScreen.tsx` |
| Quantity Entry | `src/components/QuantityEntryScreen.tsx` |
| Special Provisions Acknowledgement | `src/components/SpecialProvisionsAcknowledgementScreen.tsx` |
| **Packaging Screen** | `src/components/PackagingScreen.tsx` |
| POP Scanner | `src/components/POPScannerScreen.tsx` |
| Manual Entry Type Selection | `src/components/ManualEntryPackagingTypeSelection.tsx` |
| Packaging Wizard V2 | `src/components/PackagingWizardV2.tsx` |
| **POP Marking Data Entry** | `src/components/POPMarkingDataEntry.tsx` |
| Inner Packaging Wizard | `src/components/InnerPackagingWizard.tsx` |
| Cylinder Entry | `src/components/CylinderEntryScreen.tsx` |
| **Labeling and Marking** | `src/components/LabelingAndMarking.tsx` |
| **Shippers Declaration** | `src/components/ShippersDeclarationScreen.tsx` |
| **Certify Form** | `src/components/CertifyForm.tsx` |
| Dry Ice Prep | `src/components/DryIcePrepScreen.tsx` |
| Lithium Batteries Prep | `src/components/LithiumBatteriesPrepScreen.tsx` |
| Magnetized Material Prep | `src/components/MagnetizedMaterialPrepScreen.tsx` |
| UN3166 Fuel Entry | `src/components/UN3166FuelEntryScreen.tsx` |
| Safety Devices Prep | `src/components/SafetyDevicesPreparationScreen.tsx` |
| Excepted Qty Packaging Guidance | `src/components/ExceptedQuantityPackagingGuidance.tsx` |
| Limited Qty Packaging Guidance | `src/components/LimitedQuantityPackagingGuidance.tsx` |

### State Management Files

| File | Purpose |
|------|---------|
| `src/stores/hazProStore.ts` | Root Valtio proxy store |
| `src/stores/useHazProStore.ts` | React hooks for store access |
| `src/stores/hazProActions.ts` | Action creators for mutations |
| `src/utils/valtio/types/HazProPreparerContext.ts` | Valtio entity definitions |

### Navigation Files

| File | Purpose |
|------|---------|
| `src/App.tsx` | Root app with Drawer Navigator |
| `src/components/MainLayoutNavigator.tsx` | Stack definitions (PreparerHomeStack, WrappedStack, MainStack) |

### Utility Files

| File | Purpose |
|------|---------|
| `src/utils/labelingRequirements.ts` | Label requirement computation |
| `server/lookupFunctions/packagingLookupV2.ts` | AFMAN packaging database |
| `src/hazardousMaterials/hazardousMaterialsList.ts` | Material search database |

---

## Changelog

| Date | Author | Changes |
|------|--------|---------|
| 2026-02-17 | Codex | Updated workflow to remove `GeneralPackagingAcknowledgementScreen` from the standard preparer path. Standard quantity now routes directly to `SpecialProvisionsAcknowledgement` (auto-skip when no provisions), then to UN-specific screens or `PackagingScreen`. |
| 2026-01-14 | Claude | Initial comprehensive documentation |
