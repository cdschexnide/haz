import { HazProPreparerContext } from "../../src/contexts/HazProPreparerProvider/reducer";
import { PhysicalState } from "../../types";

/**
 * Represents a required marking with its display information and metadata
 */
export interface RequiredMarking {
  id: string;
  label: string;
  value?: string;
  displayValue?: string;
  renderType?: "simple" | "pop" | "custom";
  metadata?: Record<string, any>;
}

/**
 * Evaluates all marking requirements based on the current hazardous material context
 * @param context - The HazProPreparerContext containing all shipment and material data
 * @returns Array of required markings with their display information
 */
export function evaluateMarkingRequirements(
  context: HazProPreparerContext
): RequiredMarking[] {
  const markings: RequiredMarking[] = [];

  const {
    hazardousMaterial,
    packaging,
    technicalName,
    lithiumBatteryData,
    isLithiumBatteryExceptedQuantity,
    dryIceData,
    usesCaaCertification,
    usesCoeCertification,
    isLimitedQuantity,
    isExceptedQuantity,
    shipment,
    lookupFunctionsOutput,
    overpack,
  } = context;

  // Excepted Quantities (general) - ONLY require "E" marking per A19.2
  if (isExceptedQuantity === true) {
    const shipperOrConsigneeName =
      shipment?.shipper?.name ||
      shipment?.consignee?.name ||
      "SHIPPER/CONSIGNEE";

    markings.push({
      id: "excepted-quantity-e-marking",
      label: "Excepted Quantity E Marking",
      value: `E marking required: Class ${hazardousMaterial?.hazclassDiv}, ${shipperOrConsigneeName}`,
      renderType: "custom",
    });

    // Return ONLY the E marking - excepted quantities are exempt from all other markings
    return markings;
  }

  // Calculate quantity for reportable quantity check
  const quantity =
    hazardousMaterial?.physicalState === PhysicalState.SOLID
      ? packaging?.totalNetMass?.kg ?? 0
      : 0;

  const reportableQuantityAmount =
    lookupFunctionsOutput?.reportableQuantityRequirement?.kilograms ?? 0;

  // 1. Proper Shipping Name and UN Number - ALWAYS REQUIRED
  markings.push({
    id: "proper-shipping-name-unid",
    label: "Proper Shipping Name and UN Number",
    value: `${hazardousMaterial?.properShippingName ?? ""} ${
      hazardousMaterial?.unid ?? ""
    }`.trim(),
  });

  // 2. Reportable Quantity - CONDITIONAL
  if (quantity > reportableQuantityAmount && reportableQuantityAmount !== 0) {
    markings.push({
      id: "reportable-quantity",
      label: "Reportable Quantity",
      value: "RQ appended to Proper Shipping Name",
    });
  }

  // 3. Technical Name - CONDITIONAL
  if (hazardousMaterial?.isTechnicalNameRequired) {
    markings.push({
      id: "technical-name",
      label: "Technical Name",
      value: technicalName || "",
    });
  }

  // 4. Lithium Battery Marking - CONDITIONAL
  if (typeof lithiumBatteryData !== "undefined") {
    markings.push({
      id: "lithium-battery-marking",
      label: "Lithium Battery Marking",
      value: technicalName || "",
    });
  }

  // 5. Watt Hour Storage Capacity - CONDITIONAL
  if (
    hazardousMaterial?.unid === "UN3508" ||
    hazardousMaterial?.unid === "UN3499"
  ) {
    markings.push({
      id: "watt-hour-storage-capacity",
      label: "Watt Hour Storage Capacity",
      value: "Mark capacitors with the energy storage capacity in Wh",
    });
  }

  // 6. CHEMICAL KIT or FIRST AID KIT - CONDITIONAL
  if (hazardousMaterial?.unid === "UN3316") {
    const kitLabel =
      hazardousMaterial.properShippingName === "CHEMICAL KIT"
        ? "CHEMICAL KIT"
        : "FIRST AID KIT";
    markings.push({
      id: "kit-marking",
      label: kitLabel,
    });
  }

  // 7. Lithium Battery Excepted Quantity Marking - CONDITIONAL
  if (isLithiumBatteryExceptedQuantity === true) {
    markings.push({
      id: "lithium-battery-excepted-quantity",
      label: "Lithium Battery Excepted Quantity Marking",
      value: technicalName || "",
    });
  }

  // 8. Net Mass of Dry Ice - CONDITIONAL with CALCULATION
  if (typeof dryIceData !== "undefined" && dryIceData.quantity) {
    const quantityKg = parseFloat(dryIceData.quantity);
    const quantityLbs = (quantityKg * 2.20462262).toFixed(2);
    markings.push({
      id: "net-mass-dry-ice",
      label: "Net Mass of Dry Ice",
      value: `${dryIceData.quantity} KG (${quantityLbs}LBS)`,
    });
  }

  // 9. POP Marking - CONDITIONAL with SPECIAL RENDERING
  // POP marking is NOT required for Limited Quantities (no UN spec packaging per A19.3)
  if (
    !usesCaaCertification &&
    !usesCoeCertification &&
    !isLimitedQuantity &&
    packaging?.usesPopMarking
  ) {
    markings.push({
      id: "pop-marking",
      label: "POP Marking, stenciled and/or printed",
      renderType: "pop",
      metadata: {
        B: packaging.inputPOPMarking?.B,
        C: packaging.inputPOPMarking?.C,
        D: packaging.inputPOPMarking?.D,
        E: packaging.inputPOPMarking?.E,
        F: packaging.inputPOPMarking?.F,
        G: packaging.inputPOPMarking?.G,
        H: packaging.inputPOPMarking?.H,
      },
    });
  }

  // 10. Flash Point - CONDITIONAL
  if (hazardousMaterial?.flashPoint) {
    markings.push({
      id: "flash-point",
      label: "Flash Point",
      value: `${hazardousMaterial.flashPoint.celsius}°C (${hazardousMaterial.flashPoint.fahrenheit}°F)`,
    });
  }

  // 11. Cylinder Marking - CONDITIONAL
  if (packaging?.usesDotCylinderMarking === true) {
    markings.push({
      id: "cylinder-marking",
      label: "Cylinder Marking",
      value: packaging.inputCylinderPOPMarking,
    });
  }

  // 12. Limited Quantity - CONDITIONAL (boolean flag)
  if (isLimitedQuantity) {
    markings.push({
      id: "limited-quantity",
      label: "Limited Quantity",
    });
  }

  // 13. OVERPACK - CONDITIONAL (boolean flag)
  if (overpack) {
    markings.push({
      id: "overpack",
      label: "OVERPACK",
    });
  }

  // Note: Orientation Marking is intentionally omitted (commented out in original code)
  // See lines 133-137 and 500-508 in LabelingAndMarking.tsx

  return markings;
}
