import { HazardousMaterialItem } from "../../../../types";
import { checkHazardClass2_2QuantityLimitsForExceptedConditions } from "./packagingQuantityLimits/hazardClass2.2/checkHazardClass2.2QuantityLimitsForExceptedConditions";
import { checkHazardClass3QuantityLimitsForExceptedConditions } from "./packagingQuantityLimits/hazardClass3/checkHazardClass3QuantityLimitsForExceptedConditions";
import { checkHazardClass4QuantityLimitsForExceptedConditions } from "./packagingQuantityLimits/hazardClass4/checkHazardClass4QuantityLimitsForExceptedConditions";
import { checkHazardClass5QuantityLimitsForExceptedConditions } from "./packagingQuantityLimits/hazardClass5/checkHazardClass5QuantityLimitsForExceptedConditions";
import { checkHazardClass6QuantityLimitsForExceptedConditions } from "./packagingQuantityLimits/hazardClass6/checkHazardClass6QuantityLimitsForExceptedConditions";
import { checkHazardClass8QuantityLimitsForExceptedConditions } from "./packagingQuantityLimits/hazardClass8/checkHazardClass8QuantityLimitsForExceptedConditions";
import { checkHazardClass9QuantityLimitsForExceptedConditions } from "./packagingQuantityLimits/hazardClass9/checkHazardClass9QuantityLimitsForExceptedConditions";

interface CheckPackagingQuantityLimitsForExceptedQuantitiesInput {
  material: HazardousMaterialItem;
  innerPackagingQuantityIn_grams?: number;
  outerPackagingQuantityIn_grams?: number;
  innerPackagingQuantityIn_mLs?: number;
  outerPackagingQuantityIn_mLs?: number;
}

interface CheckPackagingQuantityLimitsForExceptedQuantitiesOutput {
  isExcepted: boolean;
  reason: string;
  applicableRule: string;
}

export const checkPackagingQuantityLimitsForExceptedQuantities = (
  input: CheckPackagingQuantityLimitsForExceptedQuantitiesInput
): CheckPackagingQuantityLimitsForExceptedQuantitiesOutput => {
  // Table A19.1 - Check excepted quantity packaging limits
  const inputMaterialHazardClassNumber = parseInt(
    input.material.hazclassDiv.slice(0, 1),
    10
  );
  const inputMaterialHazardClassDivisionNumber = input.material.hazclassDiv;
  const inputMaterialSubsidiaryRiskHazardClassNumbers = input.material.subsidiaryRisk
    ? input.material.subsidiaryRisk
        .split(", ")
        .map(subsidiaryRiskHazardClassDivisionNumber =>
          parseInt(subsidiaryRiskHazardClassDivisionNumber.slice(0, 1), 10)
        )
        .filter(num => !Number.isNaN(num))
    : [];
  const inputMaterialSubsidiaryRiskHazardClassDivisionNumbers = input.material.subsidiaryRisk
    ? input.material.subsidiaryRisk.split(", ").filter(Boolean)
    : [];

  const hasInnerMl = typeof input.innerPackagingQuantityIn_mLs === "number";
  const hasOuterMl = typeof input.outerPackagingQuantityIn_mLs === "number";
  const hasInnerG = typeof input.innerPackagingQuantityIn_grams === "number";
  const hasOuterG = typeof input.outerPackagingQuantityIn_grams === "number";

  type QuantityCheckOutput = {
    isExcepted: boolean;
    reason: string;
    applicableRule: string;
  };

  const getFailure = (
    result: QuantityCheckOutput | undefined
  ): CheckPackagingQuantityLimitsForExceptedQuantitiesOutput | undefined => {
    if (typeof result !== "undefined" && !result.isExcepted) {
      return {
        isExcepted: false,
        reason: result.reason,
        applicableRule: result.applicableRule,
      };
    }
    return undefined;
  };

  const runInnerOuterChecks = (
    checkInner: () => QuantityCheckOutput | undefined,
    checkOuter: () => QuantityCheckOutput | undefined,
    hasInnerQuantity: boolean,
    hasOuterQuantity: boolean,
    missingQuantityError: string
  ): CheckPackagingQuantityLimitsForExceptedQuantitiesOutput | undefined => {
    if (!hasInnerQuantity && !hasOuterQuantity) {
      throw Error(missingQuantityError);
    }

    if (hasInnerQuantity) {
      const innerFailure = getFailure(checkInner());
      if (innerFailure) return innerFailure;
    }

    if (hasOuterQuantity) {
      const outerFailure = getFailure(checkOuter());
      if (outerFailure) return outerFailure;
    }

    return undefined;
  };

  if (input.material.hazclassDiv === "2.2") {
    const failure = runInnerOuterChecks(
      () =>
        checkHazardClass2_2QuantityLimitsForExceptedConditions({
          inputMaterialHazardClassNumber,
          inputMaterialHazardClassDivisionNumber,
          inputMaterialSubsidiaryRiskHazardClassNumbers,
          inputMaterialSubsidiaryRiskHazardClassDivisionNumbers,
          innerPackagingQuantityIn_mLs: input.innerPackagingQuantityIn_mLs,
          outerPackagingQuantityIn_mLs: undefined,
        }),
      () =>
        checkHazardClass2_2QuantityLimitsForExceptedConditions({
          inputMaterialHazardClassNumber,
          inputMaterialHazardClassDivisionNumber,
          inputMaterialSubsidiaryRiskHazardClassNumbers,
          inputMaterialSubsidiaryRiskHazardClassDivisionNumbers,
          innerPackagingQuantityIn_mLs: undefined,
          outerPackagingQuantityIn_mLs: input.outerPackagingQuantityIn_mLs,
        }),
      hasInnerMl,
      hasOuterMl,
      "Error checking excepted quantities packaging limits: A quantity (in mL) is required to make a determination for hazard class/division 2.2 excepted quantities."
    );

    if (failure) return failure;
  } else if (inputMaterialHazardClassNumber === 3) {
    const failure = runInnerOuterChecks(
      () =>
        checkHazardClass3QuantityLimitsForExceptedConditions({
          inputMaterialHazardClassNumber,
          inputMaterialHazardClassDivisionNumber,
          inputMaterialSubsidiaryRiskHazardClassNumbers,
          inputMaterialSubsidiaryRiskHazardClassDivisionNumbers,
          innerPackagingQuantityIn_mLs: input.innerPackagingQuantityIn_mLs,
          outerPackagingQuantityIn_mLs: undefined,
          inputMaterialPackingGroup: input.material.packingGroup,
        }),
      () =>
        checkHazardClass3QuantityLimitsForExceptedConditions({
          inputMaterialHazardClassNumber,
          inputMaterialHazardClassDivisionNumber,
          inputMaterialSubsidiaryRiskHazardClassNumbers,
          inputMaterialSubsidiaryRiskHazardClassDivisionNumbers,
          innerPackagingQuantityIn_mLs: undefined,
          outerPackagingQuantityIn_mLs: input.outerPackagingQuantityIn_mLs,
          inputMaterialPackingGroup: input.material.packingGroup,
        }),
      hasInnerMl,
      hasOuterMl,
      "Error checking excepted quantities packaging limits: A quantity (in mL) is required to make a determination for hazard class 3 excepted quantities."
    );

    if (failure) return failure;
  } else if (inputMaterialHazardClassNumber === 4) {
    const failure = runInnerOuterChecks(
      () =>
        checkHazardClass4QuantityLimitsForExceptedConditions({
          inputMaterialHazardClassNumber,
          inputMaterialHazardClassDivisionNumber,
          inputMaterialSubsidiaryRiskHazardClassNumbers,
          inputMaterialSubsidiaryRiskHazardClassDivisionNumbers,
          innerPackagingQuantityIn_mLs: input.innerPackagingQuantityIn_mLs,
          outerPackagingQuantityIn_mLs: undefined,
          innerPackagingQuantityIn_grams: input.innerPackagingQuantityIn_grams,
          outerPackagingQuantityIn_grams: undefined,
          inputMaterialPackingGroup: input.material.packingGroup,
        }),
      () =>
        checkHazardClass4QuantityLimitsForExceptedConditions({
          inputMaterialHazardClassNumber,
          inputMaterialHazardClassDivisionNumber,
          inputMaterialSubsidiaryRiskHazardClassNumbers,
          inputMaterialSubsidiaryRiskHazardClassDivisionNumbers,
          innerPackagingQuantityIn_mLs: undefined,
          outerPackagingQuantityIn_mLs: input.outerPackagingQuantityIn_mLs,
          innerPackagingQuantityIn_grams: undefined,
          outerPackagingQuantityIn_grams: input.outerPackagingQuantityIn_grams,
          inputMaterialPackingGroup: input.material.packingGroup,
        }),
      hasInnerMl || hasInnerG,
      hasOuterMl || hasOuterG,
      "Error checking excepted quantities packaging limits: A quantity (in mL or g) is required to make a determination for hazard class 4 excepted quantities."
    );

    if (failure) return failure;
  } else if (inputMaterialHazardClassNumber === 5) {
    const failure = runInnerOuterChecks(
      () =>
        checkHazardClass5QuantityLimitsForExceptedConditions({
          inputMaterialHazardClassNumber,
          inputMaterialHazardClassDivisionNumber,
          inputMaterialSubsidiaryRiskHazardClassNumbers,
          inputMaterialSubsidiaryRiskHazardClassDivisionNumbers,
          innerPackagingQuantityIn_mLs: input.innerPackagingQuantityIn_mLs,
          outerPackagingQuantityIn_mLs: undefined,
          innerPackagingQuantityIn_grams: input.innerPackagingQuantityIn_grams,
          outerPackagingQuantityIn_grams: undefined,
          inputMaterialPackingGroup: input.material.packingGroup,
        }),
      () =>
        checkHazardClass5QuantityLimitsForExceptedConditions({
          inputMaterialHazardClassNumber,
          inputMaterialHazardClassDivisionNumber,
          inputMaterialSubsidiaryRiskHazardClassNumbers,
          inputMaterialSubsidiaryRiskHazardClassDivisionNumbers,
          innerPackagingQuantityIn_mLs: undefined,
          outerPackagingQuantityIn_mLs: input.outerPackagingQuantityIn_mLs,
          innerPackagingQuantityIn_grams: undefined,
          outerPackagingQuantityIn_grams: input.outerPackagingQuantityIn_grams,
          inputMaterialPackingGroup: input.material.packingGroup,
        }),
      hasInnerMl || hasInnerG,
      hasOuterMl || hasOuterG,
      "Error checking excepted quantities packaging limits: A quantity (in mL or g) is required to make a determination for hazard class 5 excepted quantities."
    );

    if (failure) return failure;
  } else if (inputMaterialHazardClassNumber === 6) {
    const failure = runInnerOuterChecks(
      () =>
        checkHazardClass6QuantityLimitsForExceptedConditions({
          inputMaterialHazardClassNumber,
          inputMaterialHazardClassDivisionNumber,
          inputMaterialSubsidiaryRiskHazardClassNumbers,
          inputMaterialSubsidiaryRiskHazardClassDivisionNumbers,
          innerPackagingQuantityIn_mLs: input.innerPackagingQuantityIn_mLs,
          outerPackagingQuantityIn_mLs: undefined,
          innerPackagingQuantityIn_grams: input.innerPackagingQuantityIn_grams,
          outerPackagingQuantityIn_grams: undefined,
          inputMaterialPackingGroup: input.material.packingGroup,
        }),
      () =>
        checkHazardClass6QuantityLimitsForExceptedConditions({
          inputMaterialHazardClassNumber,
          inputMaterialHazardClassDivisionNumber,
          inputMaterialSubsidiaryRiskHazardClassNumbers,
          inputMaterialSubsidiaryRiskHazardClassDivisionNumbers,
          innerPackagingQuantityIn_mLs: undefined,
          outerPackagingQuantityIn_mLs: input.outerPackagingQuantityIn_mLs,
          innerPackagingQuantityIn_grams: undefined,
          outerPackagingQuantityIn_grams: input.outerPackagingQuantityIn_grams,
          inputMaterialPackingGroup: input.material.packingGroup,
        }),
      hasInnerMl || hasInnerG,
      hasOuterMl || hasOuterG,
      "Error checking excepted quantities packaging limits: A quantity (in mL or g) is required to make a determination for hazard class 6 excepted quantities."
    );

    if (failure) return failure;
  } else if (inputMaterialHazardClassNumber === 8) {
    const failure = runInnerOuterChecks(
      () =>
        checkHazardClass8QuantityLimitsForExceptedConditions({
          inputMaterialHazardClassNumber,
          inputMaterialHazardClassDivisionNumber,
          inputMaterialSubsidiaryRiskHazardClassNumbers,
          inputMaterialSubsidiaryRiskHazardClassDivisionNumbers,
          innerPackagingQuantityIn_mLs: input.innerPackagingQuantityIn_mLs,
          outerPackagingQuantityIn_mLs: undefined,
          innerPackagingQuantityIn_grams: input.innerPackagingQuantityIn_grams,
          outerPackagingQuantityIn_grams: undefined,
          inputMaterialPackingGroup: input.material.packingGroup,
          inputMaterialUnid: input.material.unid,
        }),
      () =>
        checkHazardClass8QuantityLimitsForExceptedConditions({
          inputMaterialHazardClassNumber,
          inputMaterialHazardClassDivisionNumber,
          inputMaterialSubsidiaryRiskHazardClassNumbers,
          inputMaterialSubsidiaryRiskHazardClassDivisionNumbers,
          innerPackagingQuantityIn_mLs: undefined,
          outerPackagingQuantityIn_mLs: input.outerPackagingQuantityIn_mLs,
          innerPackagingQuantityIn_grams: undefined,
          outerPackagingQuantityIn_grams: input.outerPackagingQuantityIn_grams,
          inputMaterialPackingGroup: input.material.packingGroup,
          inputMaterialUnid: input.material.unid,
        }),
      hasInnerMl || hasInnerG,
      hasOuterMl || hasOuterG,
      "Error checking excepted quantities packaging limits: A quantity (in mL or g) is required to make a determination for hazard class 8 excepted quantities."
    );

    if (failure) return failure;
  } else if (inputMaterialHazardClassNumber === 9) {
    const failure = runInnerOuterChecks(
      () =>
        checkHazardClass9QuantityLimitsForExceptedConditions({
          inputMaterialHazardClassNumber,
          inputMaterialHazardClassDivisionNumber,
          inputMaterialSubsidiaryRiskHazardClassNumbers,
          inputMaterialSubsidiaryRiskHazardClassDivisionNumbers,
          innerPackagingQuantityIn_mLs: input.innerPackagingQuantityIn_mLs,
          outerPackagingQuantityIn_mLs: undefined,
          innerPackagingQuantityIn_grams: input.innerPackagingQuantityIn_grams,
          outerPackagingQuantityIn_grams: undefined,
          inputMaterialPackingGroup: input.material.packingGroup,
        }),
      () =>
        checkHazardClass9QuantityLimitsForExceptedConditions({
          inputMaterialHazardClassNumber,
          inputMaterialHazardClassDivisionNumber,
          inputMaterialSubsidiaryRiskHazardClassNumbers,
          inputMaterialSubsidiaryRiskHazardClassDivisionNumbers,
          innerPackagingQuantityIn_mLs: undefined,
          outerPackagingQuantityIn_mLs: input.outerPackagingQuantityIn_mLs,
          innerPackagingQuantityIn_grams: undefined,
          outerPackagingQuantityIn_grams: input.outerPackagingQuantityIn_grams,
          inputMaterialPackingGroup: input.material.packingGroup,
        }),
      hasInnerMl || hasInnerG,
      hasOuterMl || hasOuterG,
      "Error checking excepted quantities packaging limits: A quantity (in mL or g) is required to make a determination for hazard class 9 excepted quantities."
    );

    if (failure) return failure;
  } else {
    return {
      isExcepted: false,
      reason: `No excepted-quantity limits defined in Table A19.1 for hazard class/division ${input.material.hazclassDiv}.`,
      applicableRule: "Table A19.1",
    };
  }

  return {
    isExcepted: true,
    reason: "Material satisfies Table A19.1 quantity limits.",
    applicableRule: "Table A19.1",
  };
};
