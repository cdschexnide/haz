import {
  HazardousMaterialItem,
  hazardousMaterialsList,
} from "../../../../src/hazardousMaterials/hazardousMaterialsList";

/**
 * Finds a hazardous material by its UN ID
 */
export function findHazMatByUnid(unid: string): HazardousMaterialItem | null {
  if (!unid) return null;

  // Normalize the UN ID (remove any spaces, ensure uppercase)
  const normalizedUnid = unid.trim().toUpperCase();

  // Find the first matching material
  return (
    hazardousMaterialsList.find(
      item => item.unid && item.unid.toUpperCase() === normalizedUnid
    ) || null
  );
}

/**
 * Validates aircraft type based on special provisions
 * P1, P2, P3 = Passenger and Cargo Aircraft
 * P4, P5 = Cargo Aircraft Only
 */
export function validateAircraftType(
  material: HazardousMaterialItem | null,
  actualValue: string
): { isValid: boolean; expected?: string; recommendation?: string } {
  if (!material || !material.specialProvision) {
    return { isValid: true }; // Can't validate without data
  }

  const specialProvisions = material.specialProvision.toUpperCase();
  let expectedType: string | null = null;
  let relevantPCode: string | null = null;

  // Check for P codes in special provisions and extract the relevant one
  const pCodeMatch = specialProvisions.match(/\bP([12345])\b/);
  if (pCodeMatch) {
    const pNumber = pCodeMatch[1];
    relevantPCode = `P${pNumber}`;

    if (["5"].includes(pNumber)) {
      expectedType = "PASSENGER AND CARGO AIRCRAFT";
    } else if (["1", "2", "3", "4"].includes(pNumber)) {
      expectedType = "CARGO AIRCRAFT ONLY";
    }
  }

  if (!expectedType || !relevantPCode) {
    return { isValid: true }; // No relevant P code found, can't determine expected type
  }

  const normalizedActual = actualValue?.toUpperCase()?.trim() || "";
  const isValid =
    normalizedActual === expectedType ||
    normalizedActual === expectedType.replace(" ", "_"); // Handle underscores

  if (!isValid) {
    return {
      isValid: false,
      expected: expectedType,
      recommendation: `Expected "${expectedType}" based on special provision ${relevantPCode}, but found "${actualValue}"`,
    };
  }

  return { isValid: true };
}

/**
 * Validates shipment type based on hazard class
 * Class 7 = Radioactive
 * All others = Non-Radioactive
 */
export function validateShipmentType(
  material: HazardousMaterialItem | null,
  actualValue: string
): { isValid: boolean; expected?: string; recommendation?: string } {
  if (!material || !material.hazclassDiv) {
    return { isValid: true }; // Can't validate without data
  }

  const expectedType = material.hazclassDiv.startsWith("7")
    ? "RADIOACTIVE"
    : "NON-RADIOACTIVE";

  const normalizedActual =
    actualValue?.toUpperCase()?.trim()?.replace("-", "") || "";
  const normalizedExpected = expectedType.replace("-", "");

  const isValid = normalizedActual === normalizedExpected;

  if (!isValid) {
    return {
      isValid: false,
      expected: expectedType,
      recommendation: `Expected "${expectedType}" based on hazard class ${material.hazclassDiv}, but found "${actualValue}"`,
    };
  }

  return { isValid: true };
}

/**
 * Validates proper shipping name
 */
export function validateProperShippingName(
  material: HazardousMaterialItem | null,
  actualValue: string
): { isValid: boolean; expected?: string; recommendation?: string } {
  if (!material || !material.properShippingName) {
    return { isValid: true }; // Can't validate without data
  }

  const normalizedActual = actualValue?.toUpperCase()?.trim() || "";
  const normalizedExpected = material.properShippingName.toUpperCase().trim();

  // For UN3171, there are two valid names: BATTERY-POWERED VEHICLE and BATTERY-POWERED EQUIPMENT
  // Check if the UN ID is UN3171 and handle both cases
  if (material.unid === "UN3171") {
    const validNames = ["BATTERY-POWERED VEHICLE", "BATTERY-POWERED EQUIPMENT"];
    const isValid = validNames.some(name => normalizedActual === name);

    if (!isValid) {
      return {
        isValid: false,
        expected: validNames.join(" or "),
        recommendation: `Expected "${validNames.join('" or "')}" for ${
          material.unid
        }, but found "${actualValue}"`,
      };
    }
    return { isValid: true };
  }

  const isValid = normalizedActual === normalizedExpected;

  if (!isValid) {
    return {
      isValid: false,
      expected: material.properShippingName,
      recommendation: `Expected "${material.properShippingName}" for ${material.unid}, but found "${actualValue}"`,
    };
  }

  return { isValid: true };
}

/**
 * Validates hazard class/division
 */
export function validateHazardClass(
  material: HazardousMaterialItem | null,
  actualValue: string
): { isValid: boolean; expected?: string; recommendation?: string } {
  if (!material || !material.hazclassDiv) {
    return { isValid: true }; // Can't validate without data
  }

  const normalizedActual = actualValue?.trim() || "";
  const normalizedExpected = material.hazclassDiv.trim();

  const isValid = normalizedActual === normalizedExpected;

  if (!isValid) {
    return {
      isValid: false,
      expected: material.hazclassDiv,
      recommendation: `Expected class/division "${material.hazclassDiv}" for ${material.unid}, but found "${actualValue}"`,
    };
  }

  return { isValid: true };
}

/**
 * Validates subsidiary risk
 */
export function validateSubsidiaryRisk(
  material: HazardousMaterialItem | null,
  actualValue: string
): { isValid: boolean; expected?: string; recommendation?: string } {
  if (!material) {
    return { isValid: true }; // Can't validate without data
  }

  const normalizedActual = actualValue?.trim() || "";
  const normalizedExpected = material.subsidiaryRisk?.trim() || "";

  // If expected is empty, actual should also be empty
  const isValid = normalizedActual === normalizedExpected;

  if (!isValid) {
    const expectedDisplay = normalizedExpected || "None";
    const actualDisplay = normalizedActual || "None";
    return {
      isValid: false,
      expected: expectedDisplay,
      recommendation: `Expected subsidiary risk "${expectedDisplay}" for ${material.unid}, but found "${actualDisplay}"`,
    };
  }

  return { isValid: true };
}

/**
 * Validates packing group
 */
export function validatePackingGroup(
  material: HazardousMaterialItem | null,
  actualValue: string
): { isValid: boolean; expected?: string; recommendation?: string } {
  if (!material) {
    return { isValid: true }; // Can't validate without data
  }

  const normalizedActual = actualValue?.trim()?.toUpperCase() || "";
  const normalizedExpected = material.packingGroup?.trim()?.toUpperCase() || "";

  // If expected is empty, actual should also be empty
  const isValid = normalizedActual === normalizedExpected;

  if (!isValid) {
    const expectedDisplay = normalizedExpected || "None";
    const actualDisplay = normalizedActual || "None";
    return {
      isValid: false,
      expected: expectedDisplay,
      recommendation: `Expected packing group "${expectedDisplay}" for ${material.unid}, but found "${actualDisplay}"`,
    };
  }

  return { isValid: true };
}

/**
 * Validates packing instruction
 */
export function validatePackingInstruction(
  material: HazardousMaterialItem | null,
  actualValue: string
): { isValid: boolean; expected?: string; recommendation?: string } {
  if (!material || !material.packagingParagraph) {
    return { isValid: true }; // Can't validate without data
  }

  // Normalize by removing trailing periods and converting to uppercase
  const normalizedActual =
    actualValue?.trim()?.toUpperCase()?.replace(/\.$/, "") || "";
  const normalizedExpected = material.packagingParagraph
    .trim()
    .toUpperCase()
    .replace(/\.$/, "");

  const isValid = normalizedActual === normalizedExpected;

  if (!isValid) {
    return {
      isValid: false,
      expected: material.packagingParagraph,
      recommendation: `Expected packing instruction "${material.packagingParagraph}" for ${material.unid} (per Table A4.1.), but found "${actualValue}"`,
    };
  }

  return { isValid: true };
}

/**
 * Gets recommended frustration for a specific field
 */
export function getRecommendedFrustration(
  fieldKey: string,
  material: HazardousMaterialItem | null,
  actualValue: string
): string | null {
  if (!material) return null;

  let validation: { isValid: boolean; recommendation?: string };

  switch (fieldKey) {
    case "aircraftType":
      validation = validateAircraftType(material, actualValue);
      break;
    case "shipmentType":
      validation = validateShipmentType(material, actualValue);
      break;
    case "properShippingName":
      validation = validateProperShippingName(material, actualValue);
      break;
    case "hazardClass":
      validation = validateHazardClass(material, actualValue);
      break;
    case "subsidiaryRisk":
      validation = validateSubsidiaryRisk(material, actualValue);
      break;
    case "packingGroup":
      validation = validatePackingGroup(material, actualValue);
      break;
    case "packingInstruction":
      validation = validatePackingInstruction(material, actualValue);
      break;
    default:
      return null;
  }

  return validation.isValid ? null : validation.recommendation || null;
}

/**
 * Gets all recommended frustrations for the current SDDG data
 */
export function getAllRecommendedFrustrations(
  extractedContent: any,
  material: HazardousMaterialItem | null
): Array<{ fieldKey: string; recommendation: string }> {
  if (!material || !extractedContent) return [];

  const recommendations: Array<{ fieldKey: string; recommendation: string }> =
    [];

  const fieldsToValidate = [
    { key: "aircraftType", value: extractedContent.aircraftType },
    { key: "shipmentType", value: extractedContent.shipmentType },
    { key: "properShippingName", value: extractedContent.properShippingName },
    { key: "hazardClass", value: extractedContent.hazardClass },
    { key: "subsidiaryRisk", value: extractedContent.subsidiaryRisk },
    { key: "packingGroup", value: extractedContent.packingGroup },
    { key: "packingInstruction", value: extractedContent.packingInstruction },
  ];

  fieldsToValidate.forEach(({ key, value }) => {
    const recommendation = getRecommendedFrustration(key, material, value);
    if (recommendation) {
      recommendations.push({ fieldKey: key, recommendation });
    }
  });

  return recommendations;
}
