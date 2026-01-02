import { HazProContextLookupOutput } from "../../server/lookupFunctions/hazProContextLookup";

type PackagingTypeA = "Inner" | "Outer";

/* for packaging paragraph references with only inner and outer packaging options */
export const getPackagingOptionsForCombinationOnlyPackaging = (
  packagingType: PackagingTypeA,
  lookupOutput: HazProContextLookupOutput | null | any
) => {
  if (lookupOutput === null) return null;

  const packagingAuthorizationKey =
    lookupOutput.packaging?.packagingAuthorization?.[0] || "";

  const packagingOptions =
    lookupOutput.packaging?.packagingOptionsAndInstructions?.[
      packagingAuthorizationKey
    ]?.packagingInstructions;

  if (!packagingOptions) return null;

  if (packagingType === "Inner") {
    const innerPackagingOptions = packagingOptions.innerPackaging;
    return innerPackagingOptions;
  } else if (packagingType === "Outer") {
    const outerPackagingOptions = packagingOptions.outerPackaging;
    return outerPackagingOptions;
  }
};

/* for packaging paragraph references with a single innerPackaging.receptacles property */
export const getInnerReceptaclesOptions = (
  lookupOutput: HazProContextLookupOutput | null | any
) => {
  if (lookupOutput === null) return null;
  const packagingAuthorizationKey =
    lookupOutput.packaging?.packagingAuthorization?.[0] || "";

  const packagingOptions =
    lookupOutput.packaging?.packagingOptionsAndInstructions?.[
      packagingAuthorizationKey
    ]?.packagingInstructions;

  if (!packagingOptions) return null;

  const innerPackagingOptions = packagingOptions.innerPackaging.receptacles;
  return innerPackagingOptions;
};

export type PackagingTypeCategories =
  | "Single"
  | "Combination"
  | "Composite"
  | "CompositePackagingWithPlasticInnerReceptacles"
  | "CompositePackagingWithGlassPorcelainOrStonewareInnerReceptacles";

/* for packaging paragraph references with:
    innerPackaging
    outerPackaging
    singlePackaging
    combinationPackaging
    compositePackaging
    compositePackagingWithPlasticInnerReceptacles
    compositePackagingWithGlassPorcelainOrStonewareInnerReceptacles 
*/
export const getPackagingOptionsByCategory = (
  category: PackagingTypeCategories,
  lookupOutput: HazProContextLookupOutput | null | any,
  innerPackaging?: boolean,
  outerPackaging?: boolean
) => {
  const packagingOptionsAndInstructions =
    lookupOutput?.packaging.packagingOptionsAndInstructions;

  for (const key in packagingOptionsAndInstructions) {
    const packagingInstructions =
      packagingOptionsAndInstructions[key]?.packagingInstructions;

    if (!packagingInstructions) continue;

    if (
      typeof packagingInstructions.innerPackaging !== "undefined" &&
      innerPackaging === true
    ) {
      return packagingInstructions.innerPackaging;
    } else if (
      typeof packagingInstructions.outerPackaging !== "undefined" &&
      outerPackaging === true
    ) {
      return packagingInstructions.outerPackaging;
    }

    switch (category) {
      case "Single":
        if (typeof packagingInstructions.singlePackaging !== "undefined") {
          if (
            typeof packagingInstructions.singlePackaging?.innerPackaging !==
              "undefined" &&
            packagingInstructions.singlePackaging.innerPackaging?.required ===
              true &&
            innerPackaging === true
          ) {
            return packagingInstructions.singlePackaging.innerPackaging;
          } else if (
            typeof packagingInstructions.singlePackaging?.innerPackaging !==
              "undefined" &&
            packagingInstructions.singlePackaging.innerPackaging?.required ===
              false &&
            innerPackaging === true
          ) {
            return packagingInstructions.singlePackaging.innerPackaging
              .required;
          } else if (
            typeof packagingInstructions.singlePackaging?.outerPackaging !==
              "undefined" &&
            outerPackaging === true
          ) {
            return packagingInstructions.singlePackaging.outerPackaging;
          }
        }
        break;
      case "Combination":
        if (typeof packagingInstructions.combinationPackaging !== "undefined") {
          if (
            typeof packagingInstructions.combinationPackaging
              ?.innerPackaging !== "undefined" &&
            packagingInstructions.combinationPackaging.innerPackaging
              ?.required === true &&
            innerPackaging === true
          ) {
            return packagingInstructions.combinationPackaging.innerPackaging;
          } else if (
            typeof packagingInstructions.combinationPackaging
              ?.innerPackaging !== "undefined" &&
            packagingInstructions.combinationPackaging.innerPackaging
              ?.required === false &&
            innerPackaging === true
          ) {
            return packagingInstructions.combinationPackaging.innerPackaging
              .required;
          } else if (
            typeof packagingInstructions.combinationPackaging
              ?.outerPackaging !== "undefined" &&
            outerPackaging === true
          ) {
            return packagingInstructions.combinationPackaging.outerPackaging;
          }
        }
        break;
      case "CompositePackagingWithPlasticInnerReceptacles":
        if (
          typeof packagingInstructions.compositePackagingWithPlasticInnerReceptacles !==
          "undefined"
        ) {
          if (innerPackaging === true) {
            return packagingInstructions
              .compositePackagingWithPlasticInnerReceptacles.innerPackaging;
          } else if (outerPackaging === true) {
            return packagingInstructions
              .compositePackagingWithPlasticInnerReceptacles.outerPackaging;
          }
        }
        break;
      case "CompositePackagingWithGlassPorcelainOrStonewareInnerReceptacles":
        if (
          typeof packagingInstructions.compositePackagingWithGlassPorcelainOrStonewareInnerReceptacles !==
          "undefined"
        ) {
          if (innerPackaging === true) {
            return packagingInstructions
              .compositePackagingWithGlassPorcelainOrStonewareInnerReceptacles
              .innerReceptacle;
          } else if (outerPackaging === true) {
            return packagingInstructions
              .compositePackagingWithGlassPorcelainOrStonewareInnerReceptacles
              .outerPackaging;
          }
        }
        break;
      case "Composite":
        if (typeof packagingInstructions.compositePackaging !== "undefined") {
          if (
            typeof packagingInstructions.compositePackaging.innerPackaging !==
              "undefined" &&
            innerPackaging === true
          ) {
            return packagingInstructions.compositePackaging.innerPackaging
              .required;
          } else if (
            typeof packagingInstructions.compositePackaging.innerReceptacle !==
              "undefined" &&
            innerPackaging === true
          ) {
            return packagingInstructions.compositePackaging.innerReceptacle;
          } else if (
            typeof packagingInstructions.compositePackaging.outerPackaging !==
              "undefined" &&
            outerPackaging === true
          ) {
            return packagingInstructions.compositePackaging.outerPackaging;
          }
        }
        break;
      default:
        return null;
    }
  }

  return null;
};

/* for packaging paragraph references with:
    innerPackaging
    outerPackaging
    singlePackaging
    combinationPackaging
    compositePackaging
    compositePackagingWithPlasticInnerReceptacles
    compositePackagingWithGlassPorcelainOrStonewareInnerReceptacles 
*/
export const getAllOuterPackagingOptions = (
  lookupOutput: HazProContextLookupOutput | null | any
) => {
  const outerPackagingOptions: Record<string, any> = {};

  const packagingOptionsAndInstructions =
    lookupOutput?.packaging.packagingOptionsAndInstructions;

  for (const key in packagingOptionsAndInstructions) {
    const packagingInstructions =
      packagingOptionsAndInstructions[key]?.packagingInstructions;

    if (!packagingInstructions) continue;

    if (typeof packagingInstructions.outerPackaging !== "undefined") {
      outerPackagingOptions["outerPackaging"] =
        packagingInstructions.outerPackaging;
    }

    if (
      typeof packagingInstructions.singlePackaging !== "undefined" &&
      typeof packagingInstructions.singlePackaging?.outerPackaging !==
        "undefined"
    ) {
      outerPackagingOptions["singlePackaging"] =
        packagingInstructions.singlePackaging.outerPackaging;
    }

    if (
      typeof packagingInstructions.combinationPackaging !== "undefined" &&
      typeof packagingInstructions.combinationPackaging?.outerPackaging !==
        "undefined"
    ) {
      outerPackagingOptions["combinationPackaging"] =
        packagingInstructions.combinationPackaging.outerPackaging;
    }

    if (
      typeof packagingInstructions.compositePackagingWithPlasticInnerReceptacles !==
      "undefined"
    ) {
      outerPackagingOptions["compositePackagingWithPlasticInnerReceptacles"] =
        packagingInstructions.compositePackagingWithPlasticInnerReceptacles.outerPackaging;
    }

    if (
      typeof packagingInstructions.compositePackagingWithGlassPorcelainOrStonewareInnerReceptacles !==
      "undefined"
    ) {
      outerPackagingOptions[
        "compositePackagingWithGlassPorcelainOrStonewareInnerReceptacles"
      ] =
        packagingInstructions.compositePackagingWithGlassPorcelainOrStonewareInnerReceptacles.outerPackaging;
    }

    if (
      typeof packagingInstructions.compositePackaging !== "undefined" &&
      typeof packagingInstructions.compositePackaging.outerPackaging !==
        "undefined"
    ) {
      outerPackagingOptions["compositePackaging"] =
        packagingInstructions.compositePackaging.outerPackaging;
    }

    return outerPackagingOptions;
  }

  return null;
};
