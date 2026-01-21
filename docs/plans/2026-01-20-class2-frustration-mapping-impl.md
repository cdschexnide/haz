# Class 2 Frustration Mapping Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add frustration capabilities to Class 2 compressed gas inspection workflow, mapping frustrations to Form 1015 fields 19, 39, and 40.

**Architecture:** Extend `PackageFrustrationCategory` with `"cylinder-type"`, add `formField` property to checklist conditions and frustration records, update mapping logic to use explicit field overrides.

**Tech Stack:** React Native, TypeScript

---

## Task 1: Update PackageFrustrationCategory Type

**Files:**
- Modify: `src/types/sddg.ts:220-234`

**Step 1: Add cylinder-type category**

Add `"cylinder-type"` to the `PackageFrustrationCategory` union type after `"magnetized"`:

```typescript
export type PackageFrustrationCategory =
  | "marking"
  | "label"
  | "dryice"
  | "magnetized"
  | "cylinder-type"
  | "gmo"
  | "life-saving"
  | "safety-device"
  | "battery-vehicle"
  | "capacitor"
  | "engines-internal-combustion"
  | "first-aid-chemical-kit"
  | "lithium_battery"
  | "dangerous-goods-apparatus"
  | "inner-packaging";
```

**Step 2: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: No errors related to this change

**Step 3: Commit**

```bash
git add src/types/sddg.ts
git commit -m "feat(types): add cylinder-type to PackageFrustrationCategory"
```

---

## Task 2: Add formField to PackageFrustrationRecord

**Files:**
- Modify: `src/types/sddg.ts:236-249`

**Step 1: Add formField property**

Add optional `formField` property to `PackageFrustrationRecord` interface after `reinspectionHistory`:

```typescript
export interface PackageFrustrationRecord {
  id: string;
  category: PackageFrustrationCategory;
  itemId: string;
  itemLabel: string;
  expectedValues: string[];
  verificationStatus: "missing" | "incorrect";
  frustrationDate: Date;
  defaultMessage: string;
  additionalComments?: string;
  inspector: Inspector;
  afmanReference?: string;
  reinspectionHistory?: ReinspectionAttempt[];
  formField?: string;
}
```

**Step 2: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add src/types/sddg.ts
git commit -m "feat(types): add formField to PackageFrustrationRecord"
```

---

## Task 3: Add formField to InspectionCondition Interface

**Files:**
- Modify: `src/data/class2InspectionChecklists.ts:10-15`

**Step 1: Update InspectionCondition interface**

Add `formField` property to the interface:

```typescript
export interface InspectionCondition {
  id: string;
  label: string;
  description: string;
  afmanRef: string;
  formField: "19" | "40";
}
```

**Step 2: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: Errors about missing formField in all conditions (expected - we'll fix in next task)

**Step 3: Commit**

```bash
git add src/data/class2InspectionChecklists.ts
git commit -m "feat(class2): add formField to InspectionCondition interface"
```

---

## Task 4: Tag A6.2 Aerosols Conditions with formField

**Files:**
- Modify: `src/data/class2InspectionChecklists.ts:24-102`

**Step 1: Add formField to each A6.2 condition**

Tag each condition based on whether it relates to quantity (Field 19) or packaging/cylinder specs (Field 40):

```typescript
"A6.2": {
  paragraphId: "A6.2",
  title: "Aerosols",
  description:
    "Aerosols meeting the definition of Consumer Commodity packaging requirements",
  conditions: [
    {
      id: "a6.2-gross-weight",
      label: "Package gross weight ≤ 30 kg (66 lbs)",
      description:
        "The complete package must not exceed 30 kg (66 lbs) gross weight.",
      afmanRef: "AFMAN 24-604 A6.2",
      formField: "19",
    },
    {
      id: "a6.2-pressure-limit",
      label: "Pressure ≤ 970 kPa at 55°C (140 psig at 130°F)",
      description:
        "Pressure in the receptacle must not exceed 970 kPa at 55 degrees C (140 psig at 130 degrees F).",
      afmanRef: "AFMAN 24-604 A6.2",
      formField: "40",
    },
    {
      id: "a6.2-liquid-content",
      label: "Liquid content does not completely fill receptacle at 55°C",
      description:
        "The liquid content of the product and gas must not completely fill the receptacle at 55 degrees C (130 degrees F).",
      afmanRef: "AFMAN 24-604 A6.2",
      formField: "40",
    },
    {
      id: "a6.2-outer-packaging-performance",
      label: "Outer packaging meets limited quantity performance standards",
      description:
        "The outer packaging must be capable of meeting the limited quantity performance standards outlined in A19.3.4.",
      afmanRef: "AFMAN 24-604 A6.2",
      formField: "40",
    },
    {
      id: "a6.2-heat-test-large",
      label: "Aerosols >120 mL heat tested without defects",
      description:
        "Each aerosol exceeding 120 mL (4 fluid ounce) capacity must have been heated until the pressure in the aerosol is equivalent to the equilibrium pressure of the contents at 55 degrees C (130 degrees F) without evidence of leakage, distortion, or other defects.",
      afmanRef: "AFMAN 24-604 A6.2",
      formField: "40",
    },
    {
      id: "a6.2-lot-testing",
      label: "One aerosol per 500 lot heat tested",
      description:
        "One aerosol out of each lot of 500 or less, filled for shipment, must be heated until the pressure in the container is equivalent to the equilibrium pressure of the contents at 55 degrees C (130 degrees F) without evidence of leakage, distortion, or other defects.",
      afmanRef: "AFMAN 24-604 A6.2",
      formField: "40",
    },
    {
      id: "a6.2-pressure-1245kpa",
      label: "Pressure ≤ 1245 kPa with 1.5x burst capability",
      description:
        "Pressure in the aerosol container must not exceed 1245 kPa at 55 degrees C (180 psig at 130 degrees F) and each receptacle must be capable of withstanding without bursting a pressure of at least 1.5 times the equilibrium pressure of the contents at 55 degrees C (130 degrees F).",
      afmanRef: "AFMAN 24-604 A6.2",
      formField: "40",
    },
    {
      id: "a6.2-pressure-1500kpa",
      label: "Pressure ≤ 1500 kPa with 1.5x burst capability (if applicable)",
      description:
        "Pressure in the aerosol container must not exceed 1500 kPa at 55 degrees C (217 psig at 130 degrees F) and each receptacle must be capable of withstanding without bursting a pressure of at least 1.5 times the equilibrium pressure of the contents at 55 degrees C (130 degrees F).",
      afmanRef: "AFMAN 24-604 A6.2",
      formField: "40",
    },
    {
      id: "a6.2-proper-packaging",
      label: "Packaged per A6.2.1 requirements",
      description:
        'Package aerosol products identified under the proper shipping name "Aerosols" as follows: A6.2.1.',
      afmanRef: "AFMAN 24-604 A6.2.1",
      formField: "40",
    },
    {
      id: "a6.2-outer-packaging-tight",
      label: "Tightly packed in strong outer packaging",
      description:
        "Tightly pack aerosols in a strong outer packaging capable of meeting packaging performance test outlined in A19.3.4.",
      afmanRef: "AFMAN 24-604 A6.2",
      formField: "40",
    },
  ],
},
```

**Step 2: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: Still errors for other paragraphs (A6.3-A6.28)

**Step 3: Commit**

```bash
git add src/data/class2InspectionChecklists.ts
git commit -m "feat(class2): tag A6.2 conditions with formField"
```

---

## Task 5: Tag A6.3-A6.7 Conditions with formField

**Files:**
- Modify: `src/data/class2InspectionChecklists.ts:104-476`

**Step 1: Add formField to A6.3-A6.7 conditions**

Apply the following rules:
- Quantity/weight/capacity limits → `formField: "19"`
- Pressure/valve/cylinder/testing requirements → `formField: "40"`

A6.3 Small Receptacles:
- `a6.3-gross-weight` → "19"
- `a6.3-cylinder-spec` → "40"
- `a6.3-filling-requirements` → "40"
- `a6.3-pressure-limit` → "40"
- `a6.3-liquid-fill` → "40"
- `a6.3-burst-pressure-refillable` → "40"
- `a6.3-non-pressurized-samples` → "40"
- `a6.3-burst-pressure-nonrefillable` → "40"
- `a6.3-container-capacity` → "19"
- `a6.3-electronic-tubes` → "19"

A6.4 Liquefied Compressed Gases:
- `a6.4-handling-requirements` → "40"
- `a6.4-pressure-21c` → "40"
- `a6.4-pressure-54c` → "40"
- `a6.4-dot-3al-restriction` → "40"
- `a6.4-liquid-content` → "40"
- `a6.4-metal-container-burst` → "40"
- `a6.4-dot-4al-compliance` → "40"
- `a6.4-refrigerant-gases` → "40"
- `a6.4-high-pressure-dot2p` → "40"
- `a6.4-table-a6.1-compliance` → "40"

A6.5 Nonliquefied Compressed Gases:
- `a6.5-pressure-relief` → "40"
- `a6.5-diborane-density` → "19"
- `a6.5-flammable-volume` → "19"
- `a6.5-oxygen-service` → "40"
- `a6.5-pressure-limit` → "40"
- `a6.5-chlorine-limit` → "19"
- `a6.5-dot-3al-valves` → "40"
- `a6.5-charge-limit` → "19"
- `a6.5-cylinder-cleaning` → "40"
- `a6.5-rupture-disc-3ht` → "40"
- `a6.5-methane-purity` → "40"

A6.6 Liquefied Petroleum Gas:
- `a6.6-dot39-volume` → "19"
- `a6.6-heat-test` → "40"
- `a6.6-cylinder-types` → "40"
- `a6.6-2p-2q-containers` → "40"
- `a6.6-2p-2q-capacity` → "19"
- `a6.6-filling-pressure-241` → "40"
- `a6.6-filling-pressure-310` → "40"

A6.7 Fire Extinguishers:
- `a6.7-pressure-limit` → "40"
- `a6.7-large-no-liquefied` → "40"
- `a6.7-retest-requirements` → "40"
- `a6.7-metal-container-burst` → "40"
- `a6.7-burst-pressure-6x` → "40"
- `a6.7-small-fill-limit` → "40"
- `a6.7-inner-container-heat-test` → "40"
- `a6.7-dot-cylinders` → "40"
- `a6.7-2p-2q-inner` → "40"
- `a6.7-high-pressure-2q` → "40"

**Step 2: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: Still errors for A6.8-A6.28

**Step 3: Commit**

```bash
git add src/data/class2InspectionChecklists.ts
git commit -m "feat(class2): tag A6.3-A6.7 conditions with formField"
```

---

## Task 6: Tag A6.8-A6.14 Conditions with formField

**Files:**
- Modify: `src/data/class2InspectionChecklists.ts:478-928`

**Step 1: Add formField to A6.8-A6.14 conditions**

A6.8 Refrigerating Machines:
- `a6.8-refrigerant-limits` → "19"
- `a6.8-fluid-space` → "19"
- `a6.8-inside-package` → "40"
- `a6.8-ansi-ashrae-test` → "40"
- `a6.8-safety-relief` → "40"
- `a6.8-liquid-fill` → "40"
- `a6.8-low-pressure-conditions` → "40"
- `a6.8-high-pressure-conditions` → "40"
- `a6.8-group-a1-limit` → "19"
- `a6.8-vessel-manufacture` → "40"
- `a6.8-article-test` → "40"

A6.9 Acetylene Gas:
- `a6.9-49cfr-compliance` → "40"
- `a6.9-porous-material` → "40"
- `a6.9-dot-8-cylinders` → "40"

A6.10 Cigarette Lighters:
- `a6.10-refill-no-ignition` → "40"
- `a6.10-refill-capacity` → "19"
- `a6.10-liquid-fill` → "19"
- `a6.10-pressure-capability` → "40"
- `a6.10-refill-packaging` → "40"
- `a6.10-lighter-packaging` → "40"
- `a6.10-plastic-tray-partition` → "40"
- `a6.10-ignition-protection` → "40"
- `a6.10-design-approval` → "40"

A6.11 Cryogenic Liquids:
- `a6.11-overboard-vent` → "40"
- `a6.11-to-preparation` → "40"
- `a6.11-hydrogen-density` → "19"
- `a6.11-cryogenic-density` → "19"
- `a6.11-dewar-capacity` → "19"
- `a6.11-container-limit-one` → "19"
- `a6.11-c1-capacity` → "19"
- `a6.11-container-limit-five` → "19"
- `a6.11-container-limit-two` → "19"
- `a6.11-tmu-trailers` → "19"
- `a6.11-tmu-70m-lox` → "40"

A6.12 Ethyl Chloride:
- `a6.12-pg1-packaging` → "40"
- `a6.12-fiberboard-weight` → "19"
- `a6.12-outage` → "19"
- `a6.12-capsule-outer` → "19"
- `a6.12-capsule-quality` → "40"
- `a6.12-capsule-weight` → "19"
- `a6.12-drum-packaging` → "19"
- `a6.12-closure-integrity` → "40"
- `a6.12-box-packaging` → "19"

A6.13 Ethylene Oxide:
- `a6.13-glass-ampoules` → "19"
- `a6.13-metal-receptacles` → "19"
- `a6.13-pg1-performance` → "40"
- `a6.13-drum-fill` → "40"
- `a6.13-eductor-tubes` → "40"
- `a6.13-drum-hydrostatic` → "40"
- `a6.13-drum-leak-test` → "40"
- `a6.13-fusible-relief` → "40"
- `a6.13-cylinder-specs` → "40"
- `a6.13-drum-construction` → "40"
- `a6.13-cylinder-fire-test` → "40"
- `a6.13-drum-fire-test` → "40"

A6.14 Ethylamine:
- `a6.14-metal-drums` → "40"
- `a6.14-dot-cylinder` → "40"

**Step 2: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: Still errors for A6.15-A6.28

**Step 3: Commit**

```bash
git add src/data/class2InspectionChecklists.ts
git commit -m "feat(class2): tag A6.8-A6.14 conditions with formField"
```

---

## Task 7: Tag A6.15-A6.21 Conditions with formField

**Files:**
- Modify: `src/data/class2InspectionChecklists.ts:930-1393`

**Step 1: Add formField to A6.15-A6.21 conditions**

A6.15 Arsine, Cyanogen Chloride, etc:
- `a6.15-phosgene-limit` → "19"
- `a6.15-arsine-phosphine-no-3al` → "40"
- `a6.15-phosgene-density` → "19"
- `a6.15-cylinder-specs` → "40"
- `a6.15-safety-equipment` → "40"
- `a6.15-small-cylinder-specs` → "19"
- `a6.15-immersion-test` → "40"
- `a6.15-valve-sealed` → "40"

A6.16 Bromoacetone, Methyl Bromide:
- `a6.16-liquid-limit` → "19"
- `a6.16-bromoacetone-packaging` → "40"
- `a6.16-can-fill` → "40"
- `a6.16-vapor-pressure-130` → "40"
- `a6.16-vapor-pressure-140` → "40"
- `a6.16-1lb-can-pressure` → "40"
- `a6.16-1.75lb-can-pressure` → "40"
- `a6.16-pg1-compliance` → "40"
- `a6.16-can-construction` → "40"
- `a6.16-safety-equipment` → "40"
- `a6.16-methyl-bromide-fiberboard` → "19"
- `a6.16-cylinder-packaging` → "19"

A6.17 Gas Identification Sets:
- `a6.17-metal-can-wall` → "40"
- `a6.17-cylinder-wall` → "40"
- `a6.17-glass-receptacles` → "19"
- `a6.17-absorbed-material` → "40"
- `a6.17-pg1-compliance` → "40"
- `a6.17-sawdust-cushioning` → "40"
- `a6.17-glass-in-metal-can` → "40"
- `a6.17-small-liquid-toxic` → "19"
- `a6.17-screw-top-glass` → "19"

A6.18 Hexaethyl Tetraphosphate:
- `a6.18-cylinder-charge` → "19"
- `a6.18-filling-density` → "19"
- `a6.18-fiberboard-protection` → "40"
- `a6.18-organic-phosphate-limit` → "19"
- `a6.18-fiberboard-drop-test` → "40"
- `a6.18-wooden-box-drop-test` → "40"
- `a6.18-wooden-box-option` → "40"
- `a6.18-no-eduction-tube` → "40"
- `a6.18-dot-approved-valve` → "40"

A6.19 Class 2.3 Poisonous by Inhalation:
- `a6.19-inner-receptacle` → "19"
- `a6.19-cylinder-requirements` → "40"
- `a6.19-inner-drum-capacity` → "19"
- `a6.19-outer-1a2-thickness` → "40"
- `a6.19-outer-1h2-thickness` → "40"
- `a6.19-drum-hydrostatic` → "40"
- `a6.19-cap-seal` → "40"
- `a6.19-outer-liquid-limit` → "19"
- `a6.19-cushioning` → "40"
- `a6.19-pg1-drums` → "40"

A6.20 Nitric Oxide:
- `a6.20-valve-outlets` → "40"
- `a6.20-3e1800-wooden-box` → "40"
- `a6.20-cylinder-specs` → "40"
- `a6.20-stainless-valve` → "40"
- `a6.20-no-safety-device` → "40"

A6.21 Ethyl Methyl Ether:
- `a6.21-pg1-packaging` → "40"
- `a6.21-drums-jerricans` → "40"
- `a6.21-plastic-composite` → "40"
- `a6.21-glass-composite` → "40"
- `a6.21-combination-packaging` → "40"

**Step 2: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: Still errors for A6.22-A6.28

**Step 3: Commit**

```bash
git add src/data/class2InspectionChecklists.ts
git commit -m "feat(class2): tag A6.15-A6.21 conditions with formField"
```

---

## Task 8: Tag A6.22-A6.28 Conditions with formField

**Files:**
- Modify: `src/data/class2InspectionChecklists.ts:1395-1668`

**Step 1: Add formField to A6.22-A6.28 conditions**

A6.22 Chemical Under Pressure:
- `a6.22-internal-pressure` → "40"
- `a6.22-minimum-test-pressure` → "40"
- `a6.22-service-pressure` → "40"
- `a6.22-fill-limits` → "19"
- `a6.22-attachment-3-compliance` → "40"

A6.23 Fuel Cell Cartridges:
- `a6.23-weight-limit` → "19"
- `a6.23-packaging-types` → "40"

A6.24 Fuel Cell Cartridges in Equipment:
- `a6.24-no-charging` → "40"

A6.25 Fuel Cell Packed With Equipment:
- `a6.25-cartridge-limit` → "19"
- `a6.25-cushioning-protection` → "40"

A6.26 Metal Hydride Storage Systems:
- `a6.26-iso-16111` → "40"
- `a6.26-requalification` → "40"
- `a6.26-h-mark` → "40"
- `a6.26-capacity-limits` → "19"

A6.27 Flammable Gas Powered Engines:
- `a6.27-components-configured` → "40"
- `a6.27-tanks-closed` → "40"
- `a6.27-batteries-removed` → "40"
- `a6.27-fuel-emptied` → "40"
- `a6.27-technical-manuals` → "40"
- `a6.27-wet-cell-accessible` → "40"
- `a6.27-terminal-protection` → "40"
- `a6.27-batteries-upright` → "40"
- `a6.27-gel-batteries` → "40"
- `a6.27-orientation-secured` → "40"

A6.28 Articles Containing Flammable Gas:
- `a6.28-leakage-protection` → "40"
- `a6.28-article-enclosure` → "40"
- `a6.28-fragile-receptacles` → "40"
- `a6.28-gas-receptacles` → "40"
- `a6.28-classification` → "19"
- `a6.28-robust-articles` → "40"
- `a6.28-movement-prevention` → "40"

**Step 2: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: No errors - all conditions now have formField

**Step 3: Commit**

```bash
git add src/data/class2InspectionChecklists.ts
git commit -m "feat(class2): tag A6.22-A6.28 conditions with formField"
```

---

## Task 9: Add getPackageFrustrationField Function

**Files:**
- Modify: `src/utils/sddgToForm1015Mapping.ts:121-122`

**Step 1: Add cylinder-type mapping and helper function**

After the existing `PACKAGE_TO_FORM1015_MAPPING` object (around line 121), add:

```typescript
// Add to PACKAGE_TO_FORM1015_MAPPING
export const PACKAGE_TO_FORM1015_MAPPING: Record<string, string> = {
  // ... existing mappings ...
  "Cylinder Type Not Authorized": "39",
};

/**
 * Gets the Form 1015 field for a package frustration.
 * Handles explicit formField overrides for class2 wizard frustrations.
 * @param frustration The package frustration record
 * @returns The Form 1015 field ID or null if no mapping exists
 */
export function getPackageFrustrationField(
  frustration: PackageFrustrationRecord
): string | null {
  // 1. Check for explicit formField (class2 wizard frustrations)
  if (frustration.formField) {
    return frustration.formField;
  }

  // 2. Check category-based mapping for cylinder-type
  if (frustration.category === "cylinder-type") {
    return "39";
  }

  // 3. Fall back to label-based mapping (existing behavior)
  return PACKAGE_TO_FORM1015_MAPPING[frustration.itemLabel] || null;
}
```

**Step 2: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add src/utils/sddgToForm1015Mapping.ts
git commit -m "feat(mapping): add getPackageFrustrationField function and cylinder-type mapping"
```

---

## Task 10: Update mapFrustrationsToForm1015 to Use getPackageFrustrationField

**Files:**
- Modify: `src/utils/sddgToForm1015Mapping.ts:130-169`

**Step 1: Update mapFrustrationsToForm1015 function**

Replace the package frustration mapping logic to use `getPackageFrustrationField`:

```typescript
export function mapFrustrationsToForm1015(
  sddgFrustrations: FrustrationRecord[],
  packageFrustrations: PackageFrustrationRecord[],
  verificationCopy: any
): Set<string> {
  const form1015Ids = new Set<string>();

  // Map SDDG frustrations
  sddgFrustrations.forEach(frustration => {
    const form1015Id = SDDG_TO_FORM1015_MAPPING[frustration.key];
    if (form1015Id) {
      form1015Ids.add(form1015Id);
    }
  });

  // Map package frustrations (markings, labels, and class2)
  packageFrustrations.forEach(frustration => {
    // Only include frustrated items (missing or incorrect)
    if (
      frustration.verificationStatus === "missing" ||
      frustration.verificationStatus === "incorrect"
    ) {
      const form1015Id = getPackageFrustrationField(frustration);
      if (form1015Id) {
        form1015Ids.add(form1015Id);
      }
    }
  });

  // Check special mappings based on content
  if (verificationCopy?.properShippingName) {
    SPECIAL_MAPPINGS.forEach(rule => {
      if (rule.checkCondition(verificationCopy.properShippingName)) {
        form1015Ids.add(rule.form1015Id);
      }
    });
  }

  return form1015Ids;
}
```

**Step 2: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add src/utils/sddgToForm1015Mapping.ts
git commit -m "refactor(mapping): use getPackageFrustrationField in mapFrustrationsToForm1015"
```

---

## Task 11: Update mapFrustrationsToForm1015WithResolved

**Files:**
- Modify: `src/utils/sddgToForm1015Mapping.ts:180-221`

**Step 1: Update resolved package frustration mapping**

Update the function to use `getPackageFrustrationField` for resolved frustrations:

```typescript
export function mapFrustrationsToForm1015WithResolved(
  sddgFrustrations: FrustrationRecord[],
  packageFrustrations: PackageFrustrationRecord[],
  resolvedSddgFrustrations: FrustrationRecord[],
  resolvedPackageFrustrations: PackageFrustrationRecord[],
  verificationCopy: any
): { currentlyFrustrated: Set<string>; resolved: Set<string> } {
  // Map current frustrations (regular X)
  const currentlyFrustrated = mapFrustrationsToForm1015(
    sddgFrustrations,
    packageFrustrations,
    verificationCopy
  );

  // Map resolved frustrations (circled X)
  const resolved = new Set<string>();

  // Map resolved SDDG frustrations
  resolvedSddgFrustrations.forEach(frustration => {
    const form1015Id = SDDG_TO_FORM1015_MAPPING[frustration.key];
    if (form1015Id && !currentlyFrustrated.has(form1015Id)) {
      resolved.add(form1015Id);
    }
  });

  // Map resolved package frustrations
  resolvedPackageFrustrations.forEach(frustration => {
    if (
      frustration.verificationStatus === "missing" ||
      frustration.verificationStatus === "incorrect"
    ) {
      const form1015Id = getPackageFrustrationField(frustration);
      if (form1015Id && !currentlyFrustrated.has(form1015Id)) {
        resolved.add(form1015Id);
      }
    }
  });

  return { currentlyFrustrated, resolved };
}
```

**Step 2: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add src/utils/sddgToForm1015Mapping.ts
git commit -m "refactor(mapping): use getPackageFrustrationField in mapFrustrationsToForm1015WithResolved"
```

---

## Task 12: Update InspectorCompressedGasesScreen to Pass formField

**Files:**
- Modify: `src/screens/inspector/InspectorCompressedGasesScreen.tsx:132-159`

**Step 1: Update handleSaveFrustration to include formField**

Update the frustration data to include the condition's formField:

```typescript
const handleSaveFrustration = () => {
  if (!currentCondition) return;

  // Save the frustration
  const frustrationData = {
    category: "class2" as const,
    itemId: currentCondition.id,
    itemLabel: currentCondition.label,
    expectedValues: ["Pass"],
    verificationStatus: "incorrect" as const,
    defaultMessage: DEFAULT_FRUSTRATION_MESSAGE,
    additionalComments: additionalComments.trim() || undefined,
    afmanReference: currentCondition.afmanRef,
    formField: currentCondition.formField,
  };

  console.log(
    "💾 [InspectorCompressedGasesScreen] Saving frustration for condition:",
    currentCondition.id,
    "formField:",
    currentCondition.formField
  );
  addPackageFrustration(frustrationData);

  // Move to next step
  if (currentStep < totalSteps - 1) {
    setCurrentStep(currentStep + 1);
  } else {
    handleFinalSubmit();
  }
};
```

**Step 2: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add src/screens/inspector/InspectorCompressedGasesScreen.tsx
git commit -m "feat(compressed-gases): pass formField to frustration data"
```

---

## Task 13: Add Frustrate Option to CylinderTypeSelectionScreen

**Files:**
- Modify: `src/screens/inspector/InspectorCylinderTypeSelectionScreen.tsx`

**Step 1: Import addPackageFrustration from context**

Update the imports and destructuring:

```typescript
// Update line 12
import { useInspectionForm } from "../../contexts/InspectionFormProvider";

// Update line 29-30
const { inspection, addPackageFrustration } = useInspectionForm();
```

**Step 2: Add handleFrustrateCylinderType function**

Add after `handleCoeCaaSelect` function (around line 87):

```typescript
const handleFrustrateCylinderType = () => {
  const validCylinderTypes = cylinderTypes.map(c => c.label);

  addPackageFrustration({
    category: "cylinder-type",
    itemId: "cylinder-type-not-listed",
    itemLabel: "Cylinder Type Not Authorized",
    expectedValues: validCylinderTypes,
    verificationStatus: "incorrect",
    defaultMessage: `Cylinder type is not authorized for this material per AFMAN 24-604 ${baseParagraph || "A6"}`,
    afmanReference: baseParagraph || "A6",
  });

  // Navigate to next screen immediately
  navigation.navigate("InspectorCompressedGasesScreen");
};
```

**Step 3: Add Frustrate button to COE/CAA view**

Update the COE/CAA options view (around lines 166-217) to add the Frustrate button:

```typescript
{/* COE/CAA Options View */}
<>
  {/* Subtitle */}
  <View style={styles.subtitleContainer}>
    <Text style={styles.subtitle}>Non-Standard Cylinder Authorization</Text>
    <Text style={styles.instruction}>
      Select authorization type if applicable, or frustrate the shipment
    </Text>
  </View>

  {/* COE Button */}
  <TouchableOpacity
    style={styles.coeCaaButton}
    onPress={() => handleCoeCaaSelect("COE")}
  >
    <View style={styles.coeCaaButtonContent}>
      <MaterialIcons name="description" size={24} color="#8E8E93" />
      <View style={styles.coeCaaTextContainer}>
        <Text style={styles.coeCaaButtonText}>
          COE (Certificate of Equivalency)
        </Text>
        <Text style={styles.coeCaaSubtext}>Coming soon</Text>
      </View>
    </View>
  </TouchableOpacity>

  {/* CAA Button */}
  <TouchableOpacity
    style={styles.coeCaaButton}
    onPress={() => handleCoeCaaSelect("CAA")}
  >
    <View style={styles.coeCaaButtonContent}>
      <MaterialIcons name="verified-user" size={24} color="#8E8E93" />
      <View style={styles.coeCaaTextContainer}>
        <Text style={styles.coeCaaButtonText}>
          CAA (Competent Authority Approval)
        </Text>
        <Text style={styles.coeCaaSubtext}>Coming soon</Text>
      </View>
    </View>
  </TouchableOpacity>

  {/* Frustrate Button */}
  <TouchableOpacity
    style={styles.frustrateButton}
    onPress={handleFrustrateCylinderType}
  >
    <View style={styles.coeCaaButtonContent}>
      <MaterialIcons name="cancel" size={24} color="#FF3B30" />
      <View style={styles.coeCaaTextContainer}>
        <Text style={styles.frustrateButtonText}>
          Frustrate - Cylinder Type Not Authorized
        </Text>
        <Text style={styles.frustrateSubtext}>
          Mark shipment for non-compliance
        </Text>
      </View>
    </View>
  </TouchableOpacity>

  {/* Back Button */}
  <TouchableOpacity
    style={styles.backToCylindersButton}
    onPress={handleBackToCylinderTypes}
  >
    <MaterialIcons name="arrow-back" size={20} color="#007AFF" />
    <Text style={styles.backToCylindersText}>
      Back to Cylinder Types
    </Text>
  </TouchableOpacity>
</>
```

**Step 4: Add styles for frustrate button**

Add to the StyleSheet (around line 320):

```typescript
frustrateButton: {
  backgroundColor: "#FFF5F5",
  borderWidth: 2,
  borderColor: "#FF3B30",
  borderRadius: 10,
  padding: 20,
  marginBottom: 16,
},
frustrateButtonText: {
  fontSize: 16,
  fontWeight: "600",
  color: "#FF3B30",
},
frustrateSubtext: {
  fontSize: 13,
  color: "#FF3B30",
  marginTop: 4,
  opacity: 0.8,
},
```

**Step 5: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 6: Commit**

```bash
git add src/screens/inspector/InspectorCylinderTypeSelectionScreen.tsx
git commit -m "feat(cylinder-selection): add frustrate option for unauthorized cylinder types"
```

---

## Task 14: Update InspectionFormProvider Types (if needed)

**Files:**
- Check: `src/contexts/InspectionFormProvider/types.ts`

**Step 1: Verify addPackageFrustration accepts formField**

Check that the `AddPackageFrustrationData` type includes optional `formField`:

```typescript
export interface AddPackageFrustrationData {
  category: PackageFrustrationCategory;
  itemId: string;
  itemLabel: string;
  expectedValues: string[];
  verificationStatus: "missing" | "incorrect";
  defaultMessage: string;
  additionalComments?: string;
  afmanReference?: string;
  formField?: string;  // Add if not present
}
```

**Step 2: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit (if changes made)**

```bash
git add src/contexts/InspectionFormProvider/types.ts
git commit -m "feat(context): add formField to AddPackageFrustrationData"
```

---

## Task 15: Final Verification

**Step 1: Run full TypeScript check**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 2: Run tests (if any exist)**

Run: `npm test` or `yarn test`
Expected: All tests pass

**Step 3: Start development server**

Run: `npx expo start`
Expected: App compiles and runs without errors

**Step 4: Manual verification**

Test the following flows:
1. Navigate to CylinderTypeSelectionScreen → click "Not Listed" → click "Frustrate" → verify frustration created and navigates forward
2. Navigate to CompressedGasesScreen → frustrate a condition → verify formField is set in the frustration data
3. Navigate to Form 1015 → verify frustrated fields are marked correctly (Field 19, 39, or 40)

**Step 5: Final commit**

```bash
git add -A
git commit -m "feat: complete Class 2 frustration mapping to Form 1015

- Add cylinder-type category for Field 39 mapping
- Tag all A6.2-A6.28 conditions with formField (19 or 40)
- Add getPackageFrustrationField helper function
- Update CompressedGasesScreen to pass formField
- Add Frustrate option to CylinderTypeSelectionScreen"
```

---

Plan complete and saved to `docs/plans/2026-01-20-class2-frustration-mapping-impl.md`. Two execution options:

**1. Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration

**2. Parallel Session (separate)** - Open new session with executing-plans, batch execution with checkpoints

Which approach?
