import { HazProContextLookupOutput } from "../../server/lookupFunctions/hazProContextLookup";
import { HazardousMaterialItem } from "../../types";
import { getAllOuterPackagingOptions } from "./getPackagingOptions";

type ValidationResult = {
  isValid: boolean;
  errors?: string[];
  availablePackingGroups?: string[];
  availablePackagingOptions?: Record<string, string[]>;
};

export const validatePopMarking = (
  hazardousMaterial: HazardousMaterialItem | null,
  lookupOutput: HazProContextLookupOutput | null,
  packagingCodeFromPOP: string | undefined, // e.g., "4A"
  packingGroupFromPOP: string | undefined // e.g., "X", "Y", "Z"
): ValidationResult => {
  let errors: string[] = [];

  if (!packagingCodeFromPOP || !packingGroupFromPOP) {
    return {
      isValid: false,
      errors: ["Packing group code or packaging code is missing."],
    };
  }

  const isHazClass1 = hazardousMaterial?.hazclassDiv.startsWith("1");

  const validPGFromPOP: Record<string, string[]> = {
    X: ["I", "II", "III"],
    Y: ["II", "III"],
    Z: ["III"],
  };

  let isPGCompatible = false;
  let requiredPGsFromPOP: string[] = [];

  if (isHazClass1) {
    // Class 1 materials require PG X or Y, and the hazardousMaterial.packingGroup is an empty string
    isPGCompatible = packingGroupFromPOP === "X" || packingGroupFromPOP === "Y";
    requiredPGsFromPOP = ["X", "Y"];
    if (!isPGCompatible) {
      errors.push(
        `All Class 1 hazardous materials must be packaged in packaging that meets the PG I or II performance level (X or Y).`
      );
    }
  } else {
    const hazMatPackingGroups =
      hazardousMaterial?.packingGroup.split(" ") ?? [];

    // Define allowed packing groups based on hazardous material's PG
    switch (hazardousMaterial?.packingGroup) {
      case "I":
        requiredPGsFromPOP = ["X"];
        break;
      case "II":
        requiredPGsFromPOP = ["X", "Y"];
        break;
      case "III":
        requiredPGsFromPOP = ["X", "Y", "Z"];
        break;
      default:
        requiredPGsFromPOP = [];
    }

    isPGCompatible = requiredPGsFromPOP.includes(packingGroupFromPOP);

    if (!isPGCompatible) {
      errors.push(
        `The POP marking's packing group code "${packingGroupFromPOP}" is not compatible with the hazardous material's packing group "${hazardousMaterial?.packingGroup}". ` +
          `The valid options for this hazardous material are: ${requiredPGsFromPOP
            .map(pg => `"${pg}"`)
            .join(", ")}.`
      );
    }
  }

  const availableOuterPackagingTypesMap =
    getAllOuterPackagingOptions(lookupOutput) || {};

  let isPackagingCodeValid: boolean = false;
  const outerPackagingOptions: string[] = [];

  if (typeof availableOuterPackagingTypesMap.outerPackaging !== "undefined") {
    for (const key in availableOuterPackagingTypesMap.outerPackaging) {
      outerPackagingOptions.push(
        availableOuterPackagingTypesMap.outerPackaging[key]
      );
    }
  }
  if (typeof availableOuterPackagingTypesMap.singlePackaging !== "undefined") {
    for (const key in availableOuterPackagingTypesMap.singlePackaging) {
      outerPackagingOptions.push(
        availableOuterPackagingTypesMap.singlePackaging[key]
      );
    }
  }
  if (
    typeof availableOuterPackagingTypesMap.combinationPackaging !== "undefined"
  ) {
    for (const key in availableOuterPackagingTypesMap.combinationPackaging) {
      outerPackagingOptions.push(
        availableOuterPackagingTypesMap.combinationPackaging[key]
      );
    }
  }
  if (
    typeof availableOuterPackagingTypesMap.compositePackagingWithPlasticInnerReceptacles !==
    "undefined"
  ) {
    for (const key in availableOuterPackagingTypesMap.compositePackagingWithPlasticInnerReceptacles) {
      outerPackagingOptions.push(
        availableOuterPackagingTypesMap
          .compositePackagingWithPlasticInnerReceptacles[key]
      );
    }
  }
  if (
    typeof availableOuterPackagingTypesMap.compositePackagingWithGlassPorcelainOrStonewareInnerReceptacles !==
    "undefined"
  ) {
    for (const key in availableOuterPackagingTypesMap.compositePackagingWithGlassPorcelainOrStonewareInnerReceptacles) {
      outerPackagingOptions.push(
        availableOuterPackagingTypesMap
          .compositePackagingWithGlassPorcelainOrStonewareInnerReceptacles[key]
      );
    }
  }
  if (
    typeof availableOuterPackagingTypesMap.compositePackaging !== "undefined"
  ) {
    for (const key in availableOuterPackagingTypesMap.compositePackaging) {
      outerPackagingOptions.push(
        availableOuterPackagingTypesMap.compositePackaging[key]
      );
    }
  }

  isPackagingCodeValid = outerPackagingOptions
    .flat()
    .some(code => code.includes(`(${packagingCodeFromPOP})`));

  // if (!isPackagingCodeValid) {
  //   errors.push(
  //     `The POP marking's packaging code "${packagingCodeFromPOP}" is not valid.` +
  //     `The valid packaging options for this hazardous material are:\n${Object.entries(filteredOuterPackagingTypesMap)
  //       .map(([category, options]) => `${category}: ${options.join(", ")}`)
  //       .join("\n")}`
  //   );
  // }

  if (!isPackagingCodeValid) {
    errors.push(
      `The POP marking's packaging code "${packagingCodeFromPOP}" is not valid.`
    );
  }

  return {
    isValid: isPGCompatible && isPackagingCodeValid,
    errors: errors.length > 0 ? errors : undefined,
    availablePackingGroups: isPGCompatible ? undefined : requiredPGsFromPOP,
    // availablePackagingOptions: isPackagingCodeValid ? undefined : filteredOuterPackagingTypesMap,
  };
};
