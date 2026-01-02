/**
 * Inner Packaging Inspection Helper Utilities
 *
 * Helper functions for inner packaging inspection workflow
 * Based on AFMAN 24-604, Attachment 28
 */

import {
  ContainerType,
  InnerPackagingInspectionItem,
  InnerPackagingInspectionData,
} from "@//types/innerPackaging";
import { PackageFrustrationRecord, SDDGInspectionContext } from "@//types/sddg";

/**
 * Initialize default inspection items for inner packaging
 * Based on A28.2.1.2 Combination Packaging inspection areas
 *
 * @returns Array of 6 inspection items with 'pending' status
 */
export function initializeInnerPackagingInspectionItems(): InnerPackagingInspectionItem[] {
  return [
    {
      id: "inner-orientation",
      label: "Inner receptacle orientation",
      status: "pending",
      afmanReference: "A28.2.1.2.1",
    },
    {
      id: "inner-ullage",
      label: "Inner receptacle ullage",
      status: "pending",
      afmanReference: "A28.2.1.2.2",
    },
    {
      id: "inner-secondary-closure",
      label: "Inner receptacle secondary closure",
      status: "pending",
      afmanReference: "A28.2.1.2.3",
    },
    {
      id: "inner-absorbent-cushioning",
      label: "Absorbent and cushioning material",
      status: "pending",
      afmanReference: "A28.2.1.2.4",
    },
    {
      id: "inner-leak-proof-liner",
      label: "Leak-proof liner (covering item or lining outer container)",
      status: "pending",
      afmanReference: "A28.2.1.2.5",
    },
    {
      id: "inner-air-eligible",
      label: "Air-eligible",
      status: "pending",
      afmanReference: "A28.2.1.2.6",
    },
  ];
}

/**
 * Initialize complete inner packaging inspection data structure
 *
 * @param containerType - Detected or selected container type
 * @returns Initialized inspection data with defaults
 */
export function initializeInnerPackagingInspection(
  containerType: ContainerType
): InnerPackagingInspectionData {
  return {
    hasInnerPackaging: true,
    containerType,
    inspectionItems: initializeInnerPackagingInspectionItems(),
    openedAt: null,
    inspectedAt: null,
    closedAt: null,
    newCertificationRequired: false,
    reclosureMethod: "",
    inspectorNotes: "",
    overallStatus: "pending",
  };
}

/**
 * Determine if new shipper's certification is required after reclosure
 * Based on AFMAN 24-604 A28.2.2 procedures
 *
 * Certification Requirements:
 * - Fiberboard Box (tape-only, following procedures): NO
 * - Fiberboard Box (adhesive/stapled): YES
 * - Wood Box: YES (always, components must be replaced)
 * - Drum: YES (always, gaskets replaced)
 * - Overpack: NO
 * - Jerrican: NO
 * - Non-Specification: NO
 *
 * @param containerType - Type of container that was opened
 * @param reclosureMethod - How the container was reclosed (relevant for fiberboard)
 * @returns True if new certification required, false otherwise
 */
export function determineNewCertificationRequired(
  containerType: ContainerType,
  reclosureMethod?: string
): boolean {
  switch (containerType) {
    case "drum":
      // A28.2.2.6.3 - Always requires new certification
      return true;

    case "wood-box":
      // A28.2.2.4.3 - Always requires new certification (components replaced)
      return true;

    case "fiberboard-box":
      // A28.2.2.2.7 - Only if adhesive/stapled
      // A28.2.2.2.8 - Tape-only following procedures = no cert required
      return (
        reclosureMethod === "adhesive-sealed" || reclosureMethod === "stapled"
      );

    case "overpack":
      // A28.2.2.7.2 - No new certification required
      return false;

    case "non-specification":
      // A28.2.2.8.2 - No new certification required
      return false;

    case "jerrican":
      // A28.2.2.9.2 - No new certification required
      return false;

    default:
      return false;
  }
}

/**
 * Create a package frustration record from a failed inspection item
 *
 * @param inspectionItem - The inspection item that failed
 * @returns Package frustration record (without auto-generated fields)
 */
export function createInnerPackagingFrustration(
  inspectionItem: InnerPackagingInspectionItem
): Omit<PackageFrustrationRecord, "id" | "frustrationDate" | "inspector"> {
  return {
    category: "inner-packaging",
    itemId: inspectionItem.id,
    itemLabel: inspectionItem.label,
    expectedValues: ["Pass"],
    verificationStatus: "incorrect",
    defaultMessage: `Inner packaging inspection item failed: ${inspectionItem.label}`,
    additionalComments: inspectionItem.notes || "",
    afmanReference: inspectionItem.afmanReference,
  };
}

/**
 * Check if all inspection items have been completed (not pending)
 *
 * @param inspectionItems - Array of inspection items
 * @returns True if all items are completed, false if any are pending
 */
export function areAllInspectionItemsCompleted(
  inspectionItems: InnerPackagingInspectionItem[]
): boolean {
  return inspectionItems.every(item => item.status !== "pending");
}

/**
 * Calculate overall compliance status based on inspection items
 *
 * @param inspectionItems - Array of inspection items
 * @returns Overall compliance status
 */
export function calculateOverallStatus(
  inspectionItems: InnerPackagingInspectionItem[]
): "compliant" | "non-compliant" | "pending" {
  // If any items are still pending, overall is pending
  if (!areAllInspectionItemsCompleted(inspectionItems)) {
    return "pending";
  }

  // If any items failed, overall is non-compliant
  const hasFailed = inspectionItems.some(item => item.status === "fail");
  if (hasFailed) {
    return "non-compliant";
  }

  // All items passed or N/A
  return "compliant";
}

/**
 * Get friendly display text for reclosure method
 *
 * @param reclosureMethod - The reclosure method value
 * @returns Human-readable description
 */
export function getReclosureMethodLabel(reclosureMethod: string): string {
  const labels: Record<string, string> = {
    "tape-only": "Tape only (following AFMAN procedures)",
    "adhesive-sealed": "Adhesive sealed on inside flaps",
    stapled: "Stitched/Stapled",
  };

  return labels[reclosureMethod] || reclosureMethod || "Not specified";
}

/**
 * Detects if material is in liquid state
 * Based on hazard class and proper shipping name
 *
 * @param inspection - The inspection context with SDDG data
 * @returns True if material is a liquid, false otherwise
 */
export function checkIfMaterialIsLiquid(
  inspection: SDDGInspectionContext
): boolean {
  const hazardClass = inspection.verificationCopy?.hazardClass || "";
  const properShippingName =
    inspection.verificationCopy?.properShippingName?.toLowerCase() || "";

  // Class 3 = Flammable Liquids (always liquid)
  if (hazardClass.startsWith("3")) return true;

  // Check shipping name for liquid indicators
  const liquidKeywords = ["liquid", "solution", "molten"];
  return liquidKeywords.some(keyword => properShippingName.includes(keyword));
}

/**
 * Determines if leak-proof liner is required based on material properties
 * and outer packaging type per AFMAN 24-604 and 49 CFR 173
 *
 * Requirements:
 * - Material must be a liquid
 * - Hazard class must be one that requires leak containment (3, 4.1-4.3, 8, 5.1, 5.2, 6.1)
 * - Outer packaging must NOT be liquid-tight (fiberboard, wood, fiber drums)
 *
 * Non-liquid-tight packaging types:
 * - Fiberboard boxes (4G) - porous material
 * - Wood boxes (4C, 4D, 4F) - has gaps
 * - Fiber drums (1G) - porous material
 * - Non-specification - assume not liquid-tight for safety
 *
 * @param inspection - The inspection context with SDDG and inner packaging data
 * @returns True if leak-proof liner is required, false otherwise
 */
export function requiresLeakProofLiner(
  inspection: SDDGInspectionContext
): boolean {
  // 1. Check if material is a liquid
  const isLiquid = checkIfMaterialIsLiquid(inspection);
  if (!isLiquid) return false;

  // 2. Check if hazard class requires liner protection
  const hazardClass = inspection.verificationCopy?.hazardClass || "";
  const classRequiresLiner = [
    "3",
    "4.1",
    "4.2",
    "4.3",
    "8",
    "5.1",
    "5.2",
    "6.1",
  ].some(c => hazardClass.startsWith(c));
  if (!classRequiresLiner) return false;

  // 3. Check outer packaging type
  const containerType = inspection.innerPackagingInspection?.containerType;
  if (!containerType) return false;

  // 4. Determine if packaging is NOT liquid-tight
  const nonLiquidTightTypes: ContainerType[] = [
    "fiberboard-box",
    "wood-box",
    "non-specification",
  ];
  return nonLiquidTightTypes.includes(containerType);
}
