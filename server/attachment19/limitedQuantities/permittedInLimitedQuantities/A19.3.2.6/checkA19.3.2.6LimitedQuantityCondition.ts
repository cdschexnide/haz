import { HazardousMaterialItem } from "../../../../../types";
import { table_A19_2_LimitedQuantityLimitsForHazardClass4 } from "../../../tables/tableA19.2LimitedQuantityLimitsForHazardClasses2Through9";
import { PackagingQuantityParameters } from "../../isHazardousMaterialLimitedQuantity";

interface CheckA19_3_2_6QuantityLimitsForLimitedConditionsInput {
  material: HazardousMaterialItem;
  packagingQuantities: PackagingQuantityParameters;
}

interface CheckA19_3_2_6QuantityLimitsForLimitedConditionsOutput {
  isApplicable: boolean;
  isLimited?: boolean;
  reason?: string;
  applicableRule: string;
}

// Class 4.3: PG II (500g inner / 5kg per package) & PG III (1kg inner / 10kg per package)
export const checkA19_3_2_6QuantityLimitsForLimitedConditions = (
  input: CheckA19_3_2_6QuantityLimitsForLimitedConditionsInput
): CheckA19_3_2_6QuantityLimitsForLimitedConditionsOutput | undefined => {
  const { material } = input;
  const {
    innerPackagingQuantityIn_g,
    innerPackagingQuantityIn_kg,
    quantityPerPackageIn_g,
    quantityPerPackageIn_kg,
  } = input.packagingQuantities;
  // Reject PG I materials immediately
  if (material.packingGroup === "I") {
    return {
      isApplicable: false,
      reason:
        "Per A19.3.2.6, Class 4.3 Packing Group I materials are NOT eligible for limited quantities.",
      applicableRule: "A19.3.2.6",
    };
  }

  const isPackingGroupIIOrIII =
    material.packingGroup === "II" || material.packingGroup === "III";
  const isClass4_3Solid = material.hazclassDiv === "4.3";

  // Ensure it's a valid Class 4.3 solid with PG II or III
  if (!(isClass4_3Solid && isPackingGroupIIOrIII)) {
    return undefined;
  }

  if (material.packingGroup === "II" || material.packingGroup === "III") {
    // Normalize inner packaging quantity to grams
    const normalizedInnerPackagingQuantityIn_g =
      innerPackagingQuantityIn_g ??
      (innerPackagingQuantityIn_kg
        ? innerPackagingQuantityIn_kg * 1000
        : undefined);

    // Normalize quantity per package to grams
    const normalizedQuantityPerPackageIn_g =
      quantityPerPackageIn_g ??
      (quantityPerPackageIn_kg ? quantityPerPackageIn_kg * 1000 : undefined);

    // Error handling for missing quantity values
    if (
      typeof normalizedInnerPackagingQuantityIn_g === "undefined" &&
      typeof normalizedQuantityPerPackageIn_g === "undefined"
    ) {
      return {
        isApplicable: true,
        isLimited: false,
        reason:
          "Error: Either an inner packaging quantity or a quantity per package is required to determine limited quantities.",
        applicableRule: "Table A19.2",
      };
    }

    // Define limits from Table A19.2
    const limits =
      table_A19_2_LimitedQuantityLimitsForHazardClass4["4.3"][
        material.packingGroup
      ].solid;
    const innerPackagingLimit = limits.innerPackagingQuantityLimit.g;
    const packageLimit = limits.quantityLimitPerPackage.g;

    // Check inner packaging limits
    if (
      typeof normalizedInnerPackagingQuantityIn_g !== "undefined" &&
      normalizedInnerPackagingQuantityIn_g > innerPackagingLimit
    ) {
      return {
        isApplicable: true,
        isLimited: false,
        reason: `Per Table A19.2, the hazardous material exceeds inner packaging limits (${innerPackagingLimit}g) for Class 4.3, Packing Group ${material.packingGroup}.`,
        applicableRule: "Table A19.2",
      };
    }

    // );
    // console.log(
    //   "typeof normalizedQuantityPerPackageIn_g: ",
    //   typeof normalizedQuantityPerPackageIn_g
    // );

    // if (typeof normalizedQuantityPerPackageIn_g !== "undefined") {
    //   console.log(
    //     "normalizedQuantityPerPackageIn_g > packageLimit: ",
    //     normalizedQuantityPerPackageIn_g > packageLimit
    //   );
    // }

    // Check per package limits
    if (
      typeof normalizedQuantityPerPackageIn_g !== "undefined" &&
      normalizedQuantityPerPackageIn_g > packageLimit
    ) {
      // console.log("QuantityPerPackageIn_g exceeds packageLimit");
      // console.log(
      //   "normalizedQuantityPerPackageIn_g: ",
      //   normalizedQuantityPerPackageIn_g
      // );
      return {
        isApplicable: true,
        isLimited: false,
        reason: `Per Table A19.2, the hazardous material exceeds per package limits (${packageLimit}g) for Class 4.3, Packing Group ${material.packingGroup}.`,
        applicableRule: "Table A19.2",
      };
    }

    return {
      isApplicable: true,
      isLimited: true,
      reason: `Material meets limited quantity requirements for Class 4.3 (excluding PG I) per Table A19.2.`,
      applicableRule: "A19.3.2.6",
    };
  }
};
