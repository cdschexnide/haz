import { HazProPreparerContext } from "@//contexts/HazProPreparerProvider/reducer";

/**
 * Represents a required label with its display information
 */
export interface RequiredLabel {
  id: string;
  label: string;
  value?: string;
}

/**
 * Evaluates all labeling requirements based on the current hazardous material context
 * @param context - The HazProPreparerContext containing all shipment and material data
 * @returns Array of required labels with their display information
 */
export function evaluateLabelingRequirements(
  context: HazProPreparerContext
): RequiredLabel[] {
  const labels: RequiredLabel[] = [];

  const { hazardousMaterial, isExceptedQuantity } = context;

  // Excepted Quantities are EXEMPT from hazard labels per A19.2.13.3
  if (isExceptedQuantity === true) {
    return labels; // Return empty - no labels required
  }

  // Limited Quantities still require standard labels per A19.3.5
  // (No special handling needed - continue with standard label evaluation)

  // 1. Military Shipping Label (MSL) or DD Form 1387 - ALWAYS REQUIRED
  labels.push({
    id: "military-shipping-label",
    label: "Military Shipping Label (MSL) or DD Form 1387",
  });

  // 2. Primary Hazard - CONDITIONAL (exclude UN2807)
  if (hazardousMaterial?.unid !== "UN2807") {
    labels.push({
      id: "primary-hazard",
      label: "Primary Hazard",
      value: hazardousMaterial?.hazclassDiv,
    });
  }

  // 3. Magnetized Material - CONDITIONAL (only for UN2807)
  if (hazardousMaterial?.unid === "UN2807") {
    labels.push({
      id: "magnetized-material",
      label: "Magnetized Material",
    });
  }

  // 4. Subsidiary Risk - CONDITIONAL
  if (hazardousMaterial?.unid === "UN3222") {
    labels.push({
      id: "subsidiary-risk",
      label: "Subsidiary Risk",
      value: "EXPLOSIVE",
    });
  } else if (hazardousMaterial?.subsidiaryRisk) {
    labels.push({
      id: "subsidiary-risk",
      label: "Subsidiary Risk",
      value: hazardousMaterial.subsidiaryRisk,
    });
  }

  // 5. Handling Labels - CONDITIONAL (P1/P2/P3/P4 check)
  if (
    ["P1", "P2", "P3", "P4"].some(code =>
      hazardousMaterial?.specialProvision?.includes(code)
    )
  ) {
    labels.push({
      id: "cargo-aircraft-only",
      label: "Cargo Aircraft Only",
      value: "Cargo Aircraft Only",
    });
  }

  // 6. Label must include compatibility group - CONDITIONAL (Class 1 explosives)
  if (hazardousMaterial?.hazclassDiv?.startsWith("1")) {
    labels.push({
      id: "compatibility-group",
      label: "Label must include compatibility group",
    });
  }

  return labels;
}
