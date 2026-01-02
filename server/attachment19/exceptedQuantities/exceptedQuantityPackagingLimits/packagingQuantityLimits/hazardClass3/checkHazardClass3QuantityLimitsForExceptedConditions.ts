interface CheckHazardClass3QuantityLimitsForExceptedConditionsInput {
  inputMaterialHazardClassNumber: number | undefined;
  inputMaterialHazardClassDivisionNumber: string | undefined;
  inputMaterialSubsidiaryRiskHazardClassNumbers: number[];
  inputMaterialSubsidiaryRiskHazardClassDivisionNumbers: string[];
  innerPackagingQuantityIn_mLs?: number;
  outerPackagingQuantityIn_mLs?: number;
  inputMaterialPackingGroup: string | undefined;
}

interface CheckHazardClass3QuantityLimitsForExceptedConditionsOutput {
  isExcepted: boolean;
  reason: string;
  applicableRule: string;
}

export const checkHazardClass3QuantityLimitsForExceptedConditions = (
  input: CheckHazardClass3QuantityLimitsForExceptedConditionsInput
): CheckHazardClass3QuantityLimitsForExceptedConditionsOutput | undefined => {
  const {
    inputMaterialHazardClassNumber,
    inputMaterialSubsidiaryRiskHazardClassNumbers,
    innerPackagingQuantityIn_mLs,
    outerPackagingQuantityIn_mLs,
    inputMaterialPackingGroup,
  } = input;

  if (
    inputMaterialHazardClassNumber === 3 ||
    inputMaterialSubsidiaryRiskHazardClassNumbers.includes(3)
  ) {
    if (
      !outerPackagingQuantityIn_mLs &&
      innerPackagingQuantityIn_mLs &&
      innerPackagingQuantityIn_mLs > 30
    ) {
      // inner packaging check for Hazard Class 3
      return {
        isExcepted: false,
        reason:
          "Material exceeds excepted quantity limits for inner packagings (30mL) for Hazard Class 3",
        applicableRule:
          "Table A19.1. - Excepted Quantity Limits for Inner and Outer Packaging",
      };
    } else if (
      !outerPackagingQuantityIn_mLs &&
      innerPackagingQuantityIn_mLs &&
      innerPackagingQuantityIn_mLs <= 30
    ) {
      return {
        isExcepted: true,
        reason:
          "Material satisfies excepted quantity limits for inner packagings (30mL) for Hazard Class 3.",
        applicableRule:
          "Table A19.1. - Excepted Quantity Limits for Inner and Outer Packaging",
      };
    } else if (
      // outer packaging check for Hazard Class 3, packingGroup I
      inputMaterialPackingGroup === "I" &&
      !innerPackagingQuantityIn_mLs &&
      outerPackagingQuantityIn_mLs &&
      outerPackagingQuantityIn_mLs > 300
    ) {
      return {
        isExcepted: false,
        reason:
          "Material exceeds excepted quantity limits for outer packagings (300mL) for Hazard Class 3, Packing Group I.",
        applicableRule:
          "Table A19.1. - Excepted Quantity Limits for Inner and Outer Packaging",
      };
    } else if (
      // outer packaging check for Hazard Class 3, packingGroup I
      inputMaterialPackingGroup === "I" &&
      !innerPackagingQuantityIn_mLs &&
      outerPackagingQuantityIn_mLs &&
      outerPackagingQuantityIn_mLs <= 300
    ) {
      return {
        isExcepted: true,
        reason:
          "Material satisifies excepted quantity limits for outer packagings (300mL) for Hazard Class 3, Packing Group I.",
        applicableRule:
          "Table A19.1. - Excepted Quantity Limits for Inner and Outer Packaging",
      };
    } else if (
      // outer packaging check for Hazard Class 3, packingGroup II
      inputMaterialPackingGroup === "II" &&
      !innerPackagingQuantityIn_mLs &&
      outerPackagingQuantityIn_mLs &&
      outerPackagingQuantityIn_mLs > 500
    ) {
      return {
        isExcepted: false,
        reason:
          "Material exceeds excepted quantity limits for outer packagings (500mL) for Hazard Class 3, Packing Group II.",
        applicableRule:
          "Table A19.1. - Excepted Quantity Limits for Inner and Outer Packaging",
      };
    } else if (
      // outer packaging check for Hazard Class 3, packingGroup II
      inputMaterialPackingGroup === "II" &&
      !innerPackagingQuantityIn_mLs &&
      outerPackagingQuantityIn_mLs &&
      outerPackagingQuantityIn_mLs <= 500
    ) {
      return {
        isExcepted: true,
        reason:
          "Material satisifies excepted quantity limits for outer packagings (500mL) for Hazard Class 3, Packing Group II.",
        applicableRule:
          "Table A19.1. - Excepted Quantity Limits for Inner and Outer Packaging",
      };
    } else if (
      // outer packaging check for Hazard Class 3, packingGroup III
      inputMaterialPackingGroup === "III" &&
      !innerPackagingQuantityIn_mLs &&
      outerPackagingQuantityIn_mLs &&
      outerPackagingQuantityIn_mLs > 1000
    ) {
      return {
        isExcepted: false,
        reason:
          "Material exceeds excepted quantity limits for outer packagings (1L) for Hazard Class 3, Packing Group III.",
        applicableRule:
          "Table A19.1. - Excepted Quantity Limits for Inner and Outer Packaging",
      };
    } else if (
      // outer packaging check for Hazard Class 3, packingGroup III
      inputMaterialPackingGroup === "III" &&
      !innerPackagingQuantityIn_mLs &&
      outerPackagingQuantityIn_mLs &&
      outerPackagingQuantityIn_mLs <= 1000
    ) {
      return {
        isExcepted: true,
        reason:
          "Material satisfies excepted quantity limits for outer packagings (1L) for Hazard Class 3, Packing Group III.",
        applicableRule:
          "Table A19.1. - Excepted Quantity Limits for Inner and Outer Packaging",
      };
    }
  }
};
