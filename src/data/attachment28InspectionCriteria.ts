/**
 * AFMAN 24-604 Attachment 28 Inspection Criteria
 *
 * Packaging inspection criteria filtered by packaging type and physical state.
 * Used by InspectorAttachment28WizardScreen.
 */

export type PackagingType = "single" | "combination" | "composite";
export type PhysicalState = "liquid" | "solid";

export interface A28InspectionCriterion {
  id: string;
  label: string;
  description: string;
  afmanRef: string;
  formField: string;
  packagingTypes: PackagingType[];
  physicalState: "liquid" | "solid" | "both";
}

/**
 * All Attachment 28 inspection criteria.
 * Filtered at runtime based on packaging type and physical state.
 */
export const ATTACHMENT_28_CRITERIA: A28InspectionCriterion[] = [
  // === Single Packaging Criteria (A28.2.1.1) ===
  {
    id: "a28-drum-ullage",
    label: "Drum Ullage",
    description:
      "Verify drum has adequate ullage (headspace) for thermal expansion. Insufficient ullage can cause container failure during air transport.",
    afmanRef: "AFMAN 24-604 A28.2.1.1.1",
    formField: "41",
    packagingTypes: ["single"],
    physicalState: "liquid",
  },
  {
    id: "a28-single-external-condition",
    label: "External Visual Condition",
    description:
      "Verify no dents or corrosion at chime or seam, and no dents causing paint chipping. Dents or corrosion at chime or seam, or dents causing paint chipping is considered damaged and requires removal from the transportation system.",
    afmanRef: "AFMAN 24-604 A28.2.1.1.2",
    formField: "37",
    packagingTypes: ["single"],
    physicalState: "both",
  },

  // === Combination Packaging Criteria (A28.2.1.2) ===
  {
    id: "a28-inner-orientation",
    label: "Inner Receptacle Orientation",
    description:
      "Verify inner receptacles are properly oriented per package markings. Closures must be positioned upward to prevent leakage.",
    afmanRef: "AFMAN 24-604 A28.2.1.2.1",
    formField: "48",
    packagingTypes: ["combination", "composite"],
    physicalState: "liquid",
  },
  {
    id: "a28-inner-ullage",
    label: "Inner Receptacle Ullage",
    description:
      "Verify inner receptacles have adequate ullage (headspace) for thermal expansion. Insufficient ullage can cause container failure during air transport.",
    afmanRef: "AFMAN 24-604 A28.2.1.2.2",
    formField: "41",
    packagingTypes: ["combination", "composite"],
    physicalState: "liquid",
  },
  {
    id: "a28-secondary-closure",
    label: "Inner Receptacle Secondary Closure",
    description:
      "Verify inner receptacles have proper secondary closure/seal. Secondary closures prevent leakage if primary closure fails.",
    afmanRef: "AFMAN 24-604 A28.2.1.2.3",
    formField: "49",
    packagingTypes: ["combination", "composite"],
    physicalState: "liquid",
  },
  {
    id: "a28-absorbent-cushioning",
    label: "Absorbent and Cushioning Material",
    description:
      "Verify adequate absorbent and cushioning material is present. Absorbent material must be sufficient to absorb entire contents of inner receptacles.",
    afmanRef: "AFMAN 24-604 A28.2.1.2.4",
    formField: "46",
    packagingTypes: ["combination", "composite"],
    physicalState: "liquid",
  },
  {
    id: "a28-leakproof-liner",
    label: "Leak-proof Liner",
    description:
      "Verify leak-proof liner is present covering item or lining outer container. Required to prevent leakage from escaping the outer packaging.",
    afmanRef: "AFMAN 24-604 A28.2.1.2.5",
    formField: "47",
    packagingTypes: ["combination", "composite"],
    physicalState: "liquid",
  },
  {
    id: "a28-air-eligible",
    label: "Air-Eligible",
    description:
      "Verify package meets air eligibility requirements. Package must be certified for air transport per applicable regulations.",
    afmanRef: "AFMAN 24-604 A28.2.1.2.6",
    formField: "57",
    packagingTypes: ["combination", "composite"],
    physicalState: "both",
  },
  {
    id: "a28-combo-external-condition",
    label: "External Visual Condition",
    description:
      "Verify no dents or corrosion at chime or seam, and no dents causing paint chipping. Dents or corrosion at chime or seam, or dents causing paint chipping is considered damaged and requires removal from the transportation system.",
    afmanRef: "AFMAN 24-604 A28.2.1.2.7",
    formField: "37",
    packagingTypes: ["combination", "composite"],
    physicalState: "both",
  },
];

/**
 * Determines physical state from inspection data.
 * Uses Key 16 unit (L vs KG) as primary signal, hazard class as fallback.
 */
export function determinePhysicalState(
  quantityAndPacking: string | undefined,
  hazardClass: string | undefined
): PhysicalState {
  const key16 = quantityAndPacking || "";
  const hc = hazardClass || "";

  // Primary: Check Key 16 for unit (L = liters for liquid, KG = solid)
  // Match patterns like "10 L", "5L", "10.5 L"
  if (/\d+\.?\d*\s*L\b/i.test(key16)) return "liquid";
  if (/\d+\.?\d*\s*KG\b/i.test(key16)) return "solid";

  // Fallback: Hazard class heuristics
  if (hc.startsWith("3")) return "liquid"; // Class 3: Flammable liquids
  if (hc.startsWith("4.1")) return "solid"; // Class 4.1: Flammable solids
  if (hc.startsWith("5.1")) return "solid"; // Class 5.1: Oxidizers (typically solid)
  if (hc.startsWith("8")) return "liquid"; // Class 8: Corrosives (often liquid)

  return "solid"; // Default assumption
}

/**
 * Filters criteria based on packaging type and physical state.
 */
export function getApplicableCriteria(
  packagingType: PackagingType,
  physicalState: PhysicalState
): A28InspectionCriterion[] {
  return ATTACHMENT_28_CRITERIA.filter((criterion) => {
    // Check packaging type match
    if (!criterion.packagingTypes.includes(packagingType)) {
      return false;
    }

    // Check physical state match
    if (
      criterion.physicalState !== "both" &&
      criterion.physicalState !== physicalState
    ) {
      return false;
    }

    return true;
  });
}

/**
 * Gets default frustration message for an A28 criterion.
 */
export function getA28DefaultFrustrationMessage(criterion: A28InspectionCriterion): string {
  return `Packaging inspection requirement not met. Requires re-inspection per ${criterion.afmanRef}.`;
}
