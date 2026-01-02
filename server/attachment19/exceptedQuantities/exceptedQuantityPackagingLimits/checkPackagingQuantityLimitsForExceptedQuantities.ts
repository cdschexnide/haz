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
): CheckPackagingQuantityLimitsForExceptedQuantitiesOutput | undefined => {
  // Table A19.1 - Check excepted quantity packaging limits
  const inputMaterialHazardClassNumber = parseInt(
    input.material.hazclassDiv.slice(0, 1),
    10
  );
  const inputMaterialHazardClassDivisionNumber = input.material.hazclassDiv;
  const inputMaterialSubsidiaryRiskHazardClassNumbers =
    input.material.subsidiaryRisk
      .split(", ")
      .map(subsidiaryRiskHazardClassDivisionNumber =>
        parseInt(subsidiaryRiskHazardClassDivisionNumber.slice(0, 1), 10)
      );
  const inputMaterialSubsidiaryRiskHazardClassDivisionNumbers =
    input.material.subsidiaryRisk.split(", ");

  if (input.material.hazclassDiv === "2.2") {
    if (
      !input.innerPackagingQuantityIn_mLs &&
      !input.outerPackagingQuantityIn_mLs
    ) {
      throw Error(
        "Error checking excepted quantities packaging limits: A quantity (in mL) is required to make a determination for hazard class/division 2.2 excepted quantities."
      );
    }
    const hazardClass2_2CheckResult =
      checkHazardClass2_2QuantityLimitsForExceptedConditions({
        inputMaterialHazardClassNumber,
        inputMaterialHazardClassDivisionNumber,
        inputMaterialSubsidiaryRiskHazardClassNumbers,
        inputMaterialSubsidiaryRiskHazardClassDivisionNumbers,
        innerPackagingQuantityIn_mLs: input.innerPackagingQuantityIn_mLs,
        outerPackagingQuantityIn_mLs: input.outerPackagingQuantityIn_mLs,
      });

    if (
      typeof hazardClass2_2CheckResult !== "undefined" &&
      !hazardClass2_2CheckResult.isExcepted
    ) {
      return {
        isExcepted: false,
        reason: hazardClass2_2CheckResult.reason,
        applicableRule: hazardClass2_2CheckResult.applicableRule,
      };
    }
  } else if (inputMaterialHazardClassNumber === 3) {
    if (
      !input.innerPackagingQuantityIn_mLs &&
      !input.outerPackagingQuantityIn_mLs
    ) {
      throw Error(
        "Error checking excepted quantities packaging limits: A quantity (in mL) is required to make a determination for hazard class 3 excepted quantities."
      );
    }
    const hazardClass3CheckResult =
      checkHazardClass3QuantityLimitsForExceptedConditions({
        inputMaterialHazardClassNumber,
        inputMaterialHazardClassDivisionNumber,
        inputMaterialSubsidiaryRiskHazardClassNumbers,
        inputMaterialSubsidiaryRiskHazardClassDivisionNumbers,
        innerPackagingQuantityIn_mLs: input.innerPackagingQuantityIn_mLs,
        outerPackagingQuantityIn_mLs: input.outerPackagingQuantityIn_mLs,
        inputMaterialPackingGroup: input.material.packingGroup,
      });

    if (
      typeof hazardClass3CheckResult !== "undefined" &&
      !hazardClass3CheckResult.isExcepted
    ) {
      return {
        isExcepted: false,
        reason: hazardClass3CheckResult.reason,
        applicableRule: hazardClass3CheckResult.applicableRule,
      };
    }
  } else if (inputMaterialHazardClassNumber === 4) {
    if (
      !input.innerPackagingQuantityIn_mLs &&
      !input.outerPackagingQuantityIn_mLs &&
      !input.innerPackagingQuantityIn_grams &&
      !input.outerPackagingQuantityIn_grams
    ) {
      throw Error(
        "Error checking excepted quantities packaging limits: A quantity (in mL or g) is required to make a determination for hazard class 3 excepted quantities."
      );
    }
    const hazardClass4CheckResult =
      checkHazardClass4QuantityLimitsForExceptedConditions({
        inputMaterialHazardClassNumber,
        inputMaterialHazardClassDivisionNumber,
        inputMaterialSubsidiaryRiskHazardClassNumbers,
        inputMaterialSubsidiaryRiskHazardClassDivisionNumbers,
        innerPackagingQuantityIn_mLs: input.innerPackagingQuantityIn_mLs,
        outerPackagingQuantityIn_mLs: input.outerPackagingQuantityIn_mLs,
        innerPackagingQuantityIn_grams: input.innerPackagingQuantityIn_grams,
        outerPackagingQuantityIn_grams: input.outerPackagingQuantityIn_grams,
        inputMaterialPackingGroup: input.material.packingGroup,
      });

    if (
      typeof hazardClass4CheckResult !== "undefined" &&
      !hazardClass4CheckResult.isExcepted
    ) {
      return {
        isExcepted: false,
        reason: hazardClass4CheckResult.reason,
        applicableRule: hazardClass4CheckResult.applicableRule,
      };
    }
  } else if (inputMaterialHazardClassNumber === 5) {
    if (
      !input.innerPackagingQuantityIn_mLs &&
      !input.outerPackagingQuantityIn_mLs &&
      !input.innerPackagingQuantityIn_grams &&
      !input.outerPackagingQuantityIn_grams
    ) {
      throw Error(
        "Error checking excepted quantities packaging limits: A quantity (in mL or g) is required to make a determination for hazard class 5 excepted quantities."
      );
    }

    const hazardClass5CheckResult =
      checkHazardClass5QuantityLimitsForExceptedConditions({
        inputMaterialHazardClassNumber,
        inputMaterialHazardClassDivisionNumber,
        inputMaterialSubsidiaryRiskHazardClassNumbers,
        inputMaterialSubsidiaryRiskHazardClassDivisionNumbers,
        innerPackagingQuantityIn_mLs: input.innerPackagingQuantityIn_mLs,
        outerPackagingQuantityIn_mLs: input.outerPackagingQuantityIn_mLs,
        innerPackagingQuantityIn_grams: input.innerPackagingQuantityIn_grams,
        outerPackagingQuantityIn_grams: input.outerPackagingQuantityIn_grams,
        inputMaterialPackingGroup: input.material.packingGroup,
      });

    if (
      typeof hazardClass5CheckResult !== "undefined" &&
      !hazardClass5CheckResult.isExcepted
    ) {
      return {
        isExcepted: false,
        reason: hazardClass5CheckResult.reason,
        applicableRule: hazardClass5CheckResult.applicableRule,
      };
    }
  } else if (inputMaterialHazardClassNumber === 6) {
    if (
      !input.innerPackagingQuantityIn_mLs &&
      !input.outerPackagingQuantityIn_mLs &&
      !input.innerPackagingQuantityIn_grams &&
      !input.outerPackagingQuantityIn_grams
    ) {
      throw Error(
        "Error checking excepted quantities packaging limits: A quantity (in mL or g) is required to make a determination for hazard class 6 excepted quantities."
      );
    }

    const hazardClass6CheckResult =
      checkHazardClass6QuantityLimitsForExceptedConditions({
        inputMaterialHazardClassNumber,
        inputMaterialHazardClassDivisionNumber,
        inputMaterialSubsidiaryRiskHazardClassNumbers,
        inputMaterialSubsidiaryRiskHazardClassDivisionNumbers,
        innerPackagingQuantityIn_mLs: input.innerPackagingQuantityIn_mLs,
        outerPackagingQuantityIn_mLs: input.outerPackagingQuantityIn_mLs,
        innerPackagingQuantityIn_grams: input.innerPackagingQuantityIn_grams,
        outerPackagingQuantityIn_grams: input.outerPackagingQuantityIn_grams,
        inputMaterialPackingGroup: input.material.packingGroup,
      });

    if (
      typeof hazardClass6CheckResult !== "undefined" &&
      !hazardClass6CheckResult.isExcepted
    ) {
      return {
        isExcepted: false,
        reason: hazardClass6CheckResult.reason,
        applicableRule: hazardClass6CheckResult.applicableRule,
      };
    }
  } else if (inputMaterialHazardClassNumber === 8) {
    if (
      !input.innerPackagingQuantityIn_mLs &&
      !input.outerPackagingQuantityIn_mLs &&
      !input.innerPackagingQuantityIn_grams &&
      !input.outerPackagingQuantityIn_grams
    ) {
      throw Error(
        "Error checking excepted quantities packaging limits: A quantity (in mL or g) is required to make a determination for hazard class 8 excepted quantities."
      );
    }

    const hazardClass8CheckResult =
      checkHazardClass8QuantityLimitsForExceptedConditions({
        inputMaterialHazardClassNumber,
        inputMaterialHazardClassDivisionNumber,
        inputMaterialSubsidiaryRiskHazardClassNumbers,
        inputMaterialSubsidiaryRiskHazardClassDivisionNumbers,
        innerPackagingQuantityIn_mLs: input.innerPackagingQuantityIn_mLs,
        outerPackagingQuantityIn_mLs: input.outerPackagingQuantityIn_mLs,
        innerPackagingQuantityIn_grams: input.innerPackagingQuantityIn_grams,
        outerPackagingQuantityIn_grams: input.outerPackagingQuantityIn_grams,
        inputMaterialPackingGroup: input.material.packingGroup,
        inputMaterialUnid: input.material.unid,
      });

    if (
      typeof hazardClass8CheckResult !== "undefined" &&
      !hazardClass8CheckResult.isExcepted
    ) {
      return {
        isExcepted: false,
        reason: hazardClass8CheckResult.reason,
        applicableRule: hazardClass8CheckResult.applicableRule,
      };
    }
  } else if (inputMaterialHazardClassNumber === 9) {
    if (
      !input.innerPackagingQuantityIn_mLs &&
      !input.outerPackagingQuantityIn_mLs &&
      !input.innerPackagingQuantityIn_grams &&
      !input.outerPackagingQuantityIn_grams
    ) {
      throw Error(
        "Error checking excepted quantities packaging limits: A quantity (in mL or g) is required to make a determination for hazard class 9 excepted quantities."
      );
    }

    const hazardClass9CheckResult =
      checkHazardClass9QuantityLimitsForExceptedConditions({
        inputMaterialHazardClassNumber,
        inputMaterialHazardClassDivisionNumber,
        inputMaterialSubsidiaryRiskHazardClassNumbers,
        inputMaterialSubsidiaryRiskHazardClassDivisionNumbers,
        innerPackagingQuantityIn_mLs: input.innerPackagingQuantityIn_mLs,
        outerPackagingQuantityIn_mLs: input.outerPackagingQuantityIn_mLs,
        innerPackagingQuantityIn_grams: input.innerPackagingQuantityIn_grams,
        outerPackagingQuantityIn_grams: input.outerPackagingQuantityIn_grams,
        inputMaterialPackingGroup: input.material.packingGroup,
      });

    if (
      typeof hazardClass9CheckResult !== "undefined" &&
      !hazardClass9CheckResult.isExcepted
    ) {
      return {
        isExcepted: false,
        reason: hazardClass9CheckResult.reason,
        applicableRule: hazardClass9CheckResult.applicableRule,
      };
    }
  }
};
