import { HazardousMaterialItem } from "../../../../../types";
import { PackagingQuantityParameters } from "../../isHazardousMaterialLimitedQuantity";

export interface CheckA19_3_2_1LimitedQuantityConditionInput {
  material: HazardousMaterialItem;
  packagingQuantities: PackagingQuantityParameters;
}

interface CheckA19_3_2_1LimitedQuantityConditionOutput {
  isLimited: boolean;
  reason: string;
  applicableRule: string;
}

/* 
    A19.3.2.1 - Limited Quantity Conditions per 49 CFR Section 173.63.

    Requirements for shipping as limited quantities:

      1) Ammunition must be packed in inside boxes, or in partitions that fit snugly in the outside packaging, or in metal clips;
      2) Primers must be protected from accidental initiation;
      3) Inside boxes, partitions, or metal clips must be packed in securely-closed strong outside packagings;
      4) Maximum gross weight is limited to **30 kg (66 pounds) per package**;
      5) Specific UN IDs (1.4S explosives) are permitted in limited quantities.
*/

export function check_A19_3_2_1_LimitedQuantityCondition(
  input: CheckA19_3_2_1LimitedQuantityConditionInput
): CheckA19_3_2_1LimitedQuantityConditionOutput | undefined {
  const { material, packagingQuantities } = input;
  const { unid, hazclassDiv } = material;
  const { grossQuantityPerPackageIn_g, grossQuantityPerPackageIn_kg } =
    packagingQuantities;

  if (hazclassDiv !== "1.4S") {
    return undefined;
  }

  const permittedUNIDs = new Set(["UN0012", "UN0323"]); // CARTRIDGES, SMALL ARMS & POWER DEVICE

  if (!permittedUNIDs.has(unid)) {
    return {
      isLimited: false,
      reason: `Material with UN ID ${unid} is not permitted as a limited quantity under A19.3.2.1.`,
      applicableRule: "A19.3.2.1",
    };
  }

  const normalizedGrossQuantityPerPackageIn_g =
    grossQuantityPerPackageIn_g ??
    (grossQuantityPerPackageIn_kg
      ? grossQuantityPerPackageIn_kg * 1000
      : undefined);

  if (typeof normalizedGrossQuantityPerPackageIn_g === "undefined") {
    return {
      isLimited: false,
      reason:
        "Error checking limited quantities condition A19.3.2.1: A gross weight per package quantity is required to make a determination.",
      applicableRule: "A19.3.2.1",
    };
  }

  if (normalizedGrossQuantityPerPackageIn_g > 30000) {
    return {
      isLimited: false,
      reason: `Per Table A19.2, the hazardous material exceeds the gross weight limits per package (30kg) for Class 1.4S materials.`,
      applicableRule: "A19.3.2.1",
    };
  }

  return {
    isLimited: true,
    reason:
      "Material meets the requirements for limited quantities under A19.3.2.1, including gross weight limits and UN ID restrictions.",
    applicableRule: "A19.3.2.1",
  };
}
