interface CheckHazardClass2_2QuantityLimitsForExceptedConditionsInput {
  inputMaterialHazardClassNumber: number | undefined;
  inputMaterialHazardClassDivisionNumber: string | undefined;
  inputMaterialSubsidiaryRiskHazardClassNumbers: number[];
  inputMaterialSubsidiaryRiskHazardClassDivisionNumbers: string[];
  innerPackagingQuantityIn_mLs?: number;
  outerPackagingQuantityIn_mLs?: number;
}

interface CheckHazardClass2_2QuantityLimitsForExceptedConditionsOutput {
  isExcepted: boolean;
  reason: string;
  applicableRule: string;
}

export const checkHazardClass2_2QuantityLimitsForExceptedConditions = (
  input: CheckHazardClass2_2QuantityLimitsForExceptedConditionsInput
): CheckHazardClass2_2QuantityLimitsForExceptedConditionsOutput | undefined => {
  const {
    inputMaterialHazardClassDivisionNumber,
    inputMaterialSubsidiaryRiskHazardClassDivisionNumbers,
    innerPackagingQuantityIn_mLs,
    outerPackagingQuantityIn_mLs,
  } = input;

  if (
    inputMaterialHazardClassDivisionNumber === "2.2" ||
    inputMaterialSubsidiaryRiskHazardClassDivisionNumbers.includes("2.2")
  ) {
    if (
      !outerPackagingQuantityIn_mLs &&
      innerPackagingQuantityIn_mLs &&
      innerPackagingQuantityIn_mLs > 30
    ) {
      return {
        isExcepted: false,
        reason:
          "Material exceeds excepted quantity limits for inner packagings (30mL) for Hazard Class 2.2",
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
          "Material satisfies excepted quantity limits for inner packagings (30mL) for Hazard Class 2.2.",
        applicableRule:
          "Table A19.1. - Excepted Quantity Limits for Inner and Outer Packaging",
      };
    } else if (
      !innerPackagingQuantityIn_mLs &&
      outerPackagingQuantityIn_mLs &&
      outerPackagingQuantityIn_mLs > 1000
    ) {
      return {
        isExcepted: false,
        reason:
          "Material exceeds excepted quantity limits for outer packagings (1L) for Hazard Class 2.2.",
        applicableRule:
          "Table A19.1. - Excepted Quantity Limits for Inner and Outer Packaging",
      };
    } else if (
      !innerPackagingQuantityIn_mLs &&
      outerPackagingQuantityIn_mLs &&
      outerPackagingQuantityIn_mLs <= 1000
    ) {
      return {
        isExcepted: true,
        reason:
          "Material satisfies excepted quantity limits for outer packagings (1L) for Hazard Class 2.2.",
        applicableRule:
          "Table A19.1. - Excepted Quantity Limits for Inner and Outer Packaging",
      };
    }
  }
};
