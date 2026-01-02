import { HazardousMaterialItem } from "../../../../../types";

export interface Check_A19_2_1_2_ExceptedQuantityConditionInput {
  material: HazardousMaterialItem;
}

interface Check_A19_2_1_2_ExceptedQuantityConditionOutput {
  isExcepted: boolean;
  reason: string;
  applicableRule: string;
}

export const check_A19_2_1_2_ExceptedQuantityCondition = (
  input: Check_A19_2_1_2_ExceptedQuantityConditionInput
): Check_A19_2_1_2_ExceptedQuantityConditionOutput | undefined => {
  const inputMaterialHazardClassDivisionNumber = input.material.hazclassDiv;
  const inputMaterialContainsSubsidiaryRisk =
    input.material.subsidiaryRisk !== "";

  const A19_2_1_2ConditionA =
    inputMaterialHazardClassDivisionNumber === "2.1" ||
    inputMaterialHazardClassDivisionNumber === "2.3";

  const A19_2_1_2ConditionB =
    inputMaterialHazardClassDivisionNumber === "2.2" &&
    inputMaterialContainsSubsidiaryRisk;

  const A19_2_1_2ConditionC = input.material.unid === "UN1950";

  if (A19_2_1_2ConditionA || A19_2_1_2ConditionB || A19_2_1_2ConditionC) {
    return {
      isExcepted: false,
      reason:
        "Class 2, Division 2.1 or 2.3 materials, or aerosols, cannot qualify as excepted quantities.",
      applicableRule: "A19.2.1.2",
    };
  }
};
