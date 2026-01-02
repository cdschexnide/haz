interface CheckHazardClass9QuantityLimitsForExceptedConditionsInput {
  inputMaterialHazardClassNumber: number | undefined;
  inputMaterialHazardClassDivisionNumber: string | undefined;
  inputMaterialSubsidiaryRiskHazardClassNumbers: number[];
  inputMaterialSubsidiaryRiskHazardClassDivisionNumbers: string[];
  innerPackagingQuantityIn_mLs?: number;
  outerPackagingQuantityIn_mLs?: number;
  innerPackagingQuantityIn_grams?: number;
  outerPackagingQuantityIn_grams?: number;
  inputMaterialPackingGroup: string | undefined;
}

interface CheckHazardClass9QuantityLimitsForExceptedConditionsOutput {
  isExcepted: boolean;
  reason: string;
  applicableRule: string;
}

export const checkHazardClass9QuantityLimitsForExceptedConditions = (
  input: CheckHazardClass9QuantityLimitsForExceptedConditionsInput
): CheckHazardClass9QuantityLimitsForExceptedConditionsOutput | undefined => {
  const {
    inputMaterialHazardClassNumber,
    inputMaterialSubsidiaryRiskHazardClassNumbers,
    innerPackagingQuantityIn_mLs,
    outerPackagingQuantityIn_mLs,
    innerPackagingQuantityIn_grams,
    outerPackagingQuantityIn_grams,
    inputMaterialPackingGroup,
  } = input;

  if (
    inputMaterialHazardClassNumber === 9 ||
    inputMaterialSubsidiaryRiskHazardClassNumbers.includes(9)
  ) {
    if (
      (inputMaterialPackingGroup === "II" || !inputMaterialPackingGroup) &&
      (innerPackagingQuantityIn_mLs || innerPackagingQuantityIn_grams) &&
      !outerPackagingQuantityIn_grams &&
      !outerPackagingQuantityIn_mLs
    ) {
      // inner packaging check for Hazard Class 9, packingGroup II
      if (innerPackagingQuantityIn_grams && innerPackagingQuantityIn_grams > 30)
        return {
          isExcepted: false,
          reason:
            "Material exceeds excepted quantity limits for inner packagings (30g) for Hazard Class 9, Packing Group II.",
          applicableRule:
            "Table A19.1. - Excepted Quantity Limits for Inner and Outer Packaging",
        };
      else if (
        innerPackagingQuantityIn_grams &&
        innerPackagingQuantityIn_grams <= 30
      )
        return {
          isExcepted: true,
          reason:
            "Material satisfies excepted quantity limits for inner packagings (30g) for Hazard Class 9, Packing Group II.",
          applicableRule:
            "Table A19.1. - Excepted Quantity Limits for Inner and Outer Packaging",
        };
      else if (
        innerPackagingQuantityIn_mLs &&
        innerPackagingQuantityIn_mLs > 30
      )
        return {
          isExcepted: false,
          reason:
            "Material exceeds excepted quantity limits for inner packagings (30mL) for Hazard Class 9, Packing Group II.",
          applicableRule:
            "Table A19.1. - Excepted Quantity Limits for Inner and Outer Packaging",
        };
      else if (
        innerPackagingQuantityIn_mLs &&
        innerPackagingQuantityIn_mLs <= 30
      )
        return {
          isExcepted: true,
          reason:
            "Material satisfies excepted quantity limits for inner packagings (30mL) for Hazard Class 9, Packing Group II.",
          applicableRule:
            "Table A19.1. - Excepted Quantity Limits for Inner and Outer Packaging",
        };
    } else if (
      inputMaterialPackingGroup === "III" &&
      (innerPackagingQuantityIn_mLs || innerPackagingQuantityIn_grams) &&
      !outerPackagingQuantityIn_grams &&
      !outerPackagingQuantityIn_mLs
    ) {
      // inner packaging check for Hazard Class 9, packingGroup III
      if (innerPackagingQuantityIn_grams && innerPackagingQuantityIn_grams > 30)
        return {
          isExcepted: false,
          reason:
            "Material exceeds excepted quantity limits for inner packagings (30g) for Hazard Class 9, Packing Group III.",
          applicableRule:
            "Table A19.1. - Excepted Quantity Limits for Inner and Outer Packaging",
        };
      else if (
        innerPackagingQuantityIn_grams &&
        innerPackagingQuantityIn_grams <= 30
      )
        return {
          isExcepted: true,
          reason:
            "Material satisfies excepted quantity limits for inner packagings (30g) for Hazard Class 9, Packing Group III.",
          applicableRule:
            "Table A19.1. - Excepted Quantity Limits for Inner and Outer Packaging",
        };
      else if (
        innerPackagingQuantityIn_mLs &&
        innerPackagingQuantityIn_mLs > 30
      )
        return {
          isExcepted: false,
          reason:
            "Material exceeds excepted quantity limits for inner packagings (30mL) for Hazard Class 9, Packing Group III.",
          applicableRule:
            "Table A19.1. - Excepted Quantity Limits for Inner and Outer Packaging",
        };
      else if (
        innerPackagingQuantityIn_mLs &&
        innerPackagingQuantityIn_mLs <= 30
      )
        return {
          isExcepted: true,
          reason:
            "Material satisfies excepted quantity limits for inner packagings (30mL) for Hazard Class 9, Packing Group III.",
          applicableRule:
            "Table A19.1. - Excepted Quantity Limits for Inner and Outer Packaging",
        };
    } else if (
      // outer packaging check for Hazard Class 9, packingGroup II
      (inputMaterialPackingGroup === "II" || !inputMaterialPackingGroup) &&
      (outerPackagingQuantityIn_mLs || outerPackagingQuantityIn_grams) &&
      !innerPackagingQuantityIn_grams &&
      !innerPackagingQuantityIn_mLs
    ) {
      if (
        outerPackagingQuantityIn_grams &&
        outerPackagingQuantityIn_grams > 500
      )
        return {
          isExcepted: false,
          reason:
            "Material exceeds excepted quantity limits for outer packagings (500g) for Hazard Class 9, Packing Group II.",
          applicableRule:
            "Table A19.1. - Excepted Quantity Limits for Inner and Outer Packaging",
        };
      else if (
        outerPackagingQuantityIn_grams &&
        outerPackagingQuantityIn_grams <= 500
      )
        return {
          isExcepted: true,
          reason:
            "Material satisfies excepted quantity limits for outer packagings (500g) for Hazard Class 9, Packing Group II.",
          applicableRule:
            "Table A19.1. - Excepted Quantity Limits for Inner and Outer Packaging",
        };
      else if (
        outerPackagingQuantityIn_mLs &&
        outerPackagingQuantityIn_mLs > 500
      )
        return {
          isExcepted: false,
          reason:
            "Material exceeds excepted quantity limits for outer packagings (500mL) for Hazard Class 9, Packing Group II.",
          applicableRule:
            "Table A19.1. - Excepted Quantity Limits for Inner and Outer Packaging",
        };
      else if (
        outerPackagingQuantityIn_mLs &&
        outerPackagingQuantityIn_mLs <= 500
      )
        return {
          isExcepted: true,
          reason:
            "Material satisfies excepted quantity limits for outer packagings (500mL) for Hazard Class 9, Packing Group II.",
          applicableRule:
            "Table A19.1. - Excepted Quantity Limits for Inner and Outer Packaging",
        };
    } else if (
      // outer packaging check for Hazard Class 9, packingGroup III
      inputMaterialPackingGroup === "III" &&
      (outerPackagingQuantityIn_mLs || outerPackagingQuantityIn_grams) &&
      !innerPackagingQuantityIn_grams &&
      !innerPackagingQuantityIn_mLs
    ) {
      if (
        outerPackagingQuantityIn_grams &&
        outerPackagingQuantityIn_grams > 1000
      )
        return {
          isExcepted: false,
          reason:
            "Material exceeds excepted quantity limits for outer packagings (1kg) for Hazard Class 9, Packing Group III.",
          applicableRule:
            "Table A19.1. - Excepted Quantity Limits for Inner and Outer Packaging",
        };
      else if (
        outerPackagingQuantityIn_grams &&
        outerPackagingQuantityIn_grams <= 1000
      )
        return {
          isExcepted: true,
          reason:
            "Material satisfies excepted quantity limits for outer packagings (1kg) for Hazard Class 9, Packing Group III.",
          applicableRule:
            "Table A19.1. - Excepted Quantity Limits for Inner and Outer Packaging",
        };
      else if (
        outerPackagingQuantityIn_mLs &&
        outerPackagingQuantityIn_mLs > 1000
      )
        return {
          isExcepted: false,
          reason:
            "Material exceeds excepted quantity limits for outer packagings (1L) for Hazard Class 9, Packing Group III.",
          applicableRule:
            "Table A19.1. - Excepted Quantity Limits for Inner and Outer Packaging",
        };
      else if (
        outerPackagingQuantityIn_mLs &&
        outerPackagingQuantityIn_mLs <= 1000
      )
        return {
          isExcepted: true,
          reason:
            "Material satisfies excepted quantity limits for outer packagings (1L) for Hazard Class 9, Packing Group III.",
          applicableRule:
            "Table A19.1. - Excepted Quantity Limits for Inner and Outer Packaging",
        };
    }
  }
};
