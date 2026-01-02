import { PackageLimitsForExceptedLithiumBatteriesTable } from "../../tables/tableA3.5PackageLimitsForLithiumBatteries";
import { LithiumBatteryExceptionParameters } from "../isHazardousMaterialExceptedQuantity";
import {
  checkLithiumMetalExceptedQuantityConditions,
  CheckLithiumMetalExceptedQuantityConditionsOutput,
} from "./checkLithiumMetalExceptedQuantityConditions/checkLithiumMetalExceptedQuantityConditions";

export interface IsLithiumBatteryExceptedQuantityInput {
  materialUnid: string;
  lithiumBatteryInput?: LithiumBatteryExceptionParameters;
  table_A3_5_PackageLimitsForExceptedLithiumIonBatteries: PackageLimitsForExceptedLithiumBatteriesTable;
  table_A3_5_PackageLimitsForExceptedLithiumMetalBatteries: PackageLimitsForExceptedLithiumBatteriesTable;
}

export interface IsLithiumBatteryExceptedQuantityOutput {
  isExcepted: boolean;
  reason: string;
  applicableRule: string;
}

export const isLithiumBatteryExceptedQuantity = (
  input: IsLithiumBatteryExceptedQuantityInput
): CheckLithiumMetalExceptedQuantityConditionsOutput | undefined => {
  const { materialUnid } = input;

  if (["UN3090", "UN3091"].includes(materialUnid)) {
    return checkLithiumMetalExceptedQuantityConditions({
      inputMaterialUnid: materialUnid,
      lithiumBatteryInput:
        input.lithiumBatteryInput as LithiumBatteryExceptionParameters,
      table_A3_5_PackageLimitsForExceptedLithiumMetalBatteries:
        input.table_A3_5_PackageLimitsForExceptedLithiumMetalBatteries,
    });
  }

  if (["UN3480", "UN3481"].includes(materialUnid)) {
    if (!input.lithiumBatteryInput) {
      return {
        isExcepted: false,
        reason:
          "Lithium-ion battery parameters (Wh rating, quantity, etc.) are required to determine excepted quantity.",
        applicableRule:
          "Table A3.5 – Package limits for Excepted Lithium Batteries",
      };
    }

    const { wattHourRating, quantityIn_Kgs } = input.lithiumBatteryInput;

    if (wattHourRating > 100) {
      return {
        isExcepted: false,
        reason:
          "Lithium-ion batteries exceed the maximum watt-hour rating (100 Wh).",
        applicableRule:
          "Table A3.5 – Package limits for Excepted Lithium Batteries",
      };
    }

    const maxNetQty = input
      .table_A3_5_PackageLimitsForExceptedLithiumIonBatteries["≤100Wh"]
      .maximumNetQuantityPerPackage as number | undefined;

    if (typeof maxNetQty === "number" && quantityIn_Kgs > maxNetQty) {
      return {
        isExcepted: false,
        reason: `Net mass (${quantityIn_Kgs} kg) exceeds the Table A3.5 package limit (${maxNetQty} kg).`,
        applicableRule:
          "Table A3.5 – Package limits for Excepted Lithium Batteries",
      };
    }

    return {
      isExcepted: true,
      reason: "Lithium-ion batteries meet all excepted-quantity limits.",
      applicableRule:
        "Table A3.5 – Package limits for Excepted Lithium Batteries",
    };
  }
  return {
    isExcepted: false,
    reason:
      "Material is not classified as a lithium battery (UN3090/91 or UN3480/81).",
    applicableRule:
      "Table A3.5 – Package limits for Excepted Lithium Batteries",
  };
};
