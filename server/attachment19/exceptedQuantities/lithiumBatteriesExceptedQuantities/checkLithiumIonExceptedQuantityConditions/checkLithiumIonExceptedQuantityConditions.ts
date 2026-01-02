import { LithiumBatteryExceptionParameters } from "../../isHazardousMaterialExceptedQuantity";
import { PackageLimitsForExceptedLithiumBatteriesTable } from "../../../tables/tableA3.5PackageLimitsForLithiumBatteries";

export interface CheckLithiumIonExceptedQuantityConditionsInput {
  inputMaterialUnid: string;
  lithiumBatteryInput: LithiumBatteryExceptionParameters;
  table_A3_5_PackageLimitsForExceptedLithiumIonBatteries: PackageLimitsForExceptedLithiumBatteriesTable;
}

export interface CheckLithiumIonExceptedQuantityConditionsOutput {
  isExcepted: boolean;
  reason: string;
  applicableRule: string;
}

export const checkLithiumIonExceptedQuantityConditions = (
  input: CheckLithiumIonExceptedQuantityConditionsInput
): CheckLithiumIonExceptedQuantityConditionsOutput | undefined => {
  if (!["UN3480", "UN3481"].includes(input.inputMaterialUnid)) {
    return {
      isExcepted: false,
      reason:
        "Material is not a Lithium Ion Battery (UN3480, UN3481), hence not eligible for excepted quantity determination.",
      applicableRule:
        "Table A3.5. - Package limits for Excepted Lithium Batteries",
    };
  }

  if (
    typeof input.lithiumBatteryInput?.wattHourRating === "undefined" ||
    typeof input.lithiumBatteryInput?.quantityIn_Kgs === "undefined"
  ) {
    return {
      isExcepted: false,
      reason:
        "Watt-hour rating and quantity must be provided for Lithium Ion Batteries (UN3480, UN3481) to make a determination for excepted quantities.",
      applicableRule:
        "Table A3.5. - Package limits for Excepted Lithium Batteries",
    };
  }

  if (input.lithiumBatteryInput.wattHourRating > 100) {
    return {
      isExcepted: false,
      reason:
        "Lithium Ion Batteries (UN3480, UN3481) exceed the maximum allowed watt-hour rating (100Wh).",
      applicableRule:
        "Table A3.5. - Package limits for Excepted Lithium Batteries",
    };
  }

  if (input.lithiumBatteryInput.wattHourRating <= 100) {
    return {
      isExcepted: true,
      reason:
        "Lithium Ion Batteries (UN3480, UN3481) comply with the watt-hour rating limit (≤100Wh).",
      applicableRule:
        "Table A3.5. - Package limits for Excepted Lithium Batteries",
    };
  }

  if (
    input.lithiumBatteryInput.wattHourRating > 0 &&
    input.lithiumBatteryInput.wattHourRating <= 2.7
  ) {
    const maxNetQuantityLimitPerPackageInKgs =
      input.table_A3_5_PackageLimitsForExceptedLithiumIonBatteries["2.7Wh"]
        .maximumNetQuantityPerPackage;

    if (
      typeof maxNetQuantityLimitPerPackageInKgs === "number" &&
      input.lithiumBatteryInput.quantityIn_Kgs >
        maxNetQuantityLimitPerPackageInKgs
    ) {
      return {
        isExcepted: false,
        reason:
          "Lithium Ion Batteries (UN3480, UN3481) exceed the maximum allowed net quantity per package (2.5kg).",
        applicableRule:
          "Table A3.5. - Package limits for Excepted Lithium Batteries",
      };
    }

    return {
      isExcepted: true,
      reason:
        "Lithium Ion Batteries (UN3480, UN3481) comply with the maximum allowed net quantity per package (≤2.5kg).",
      applicableRule:
        "Table A3.5. - Package limits for Excepted Lithium Batteries",
    };
  }

  if (
    input.lithiumBatteryInput.wattHourRating >= 0 &&
    input.lithiumBatteryInput.wattHourRating <= 100
  ) {
    const maxNumberOfBatteriesPerPackage =
      input.table_A3_5_PackageLimitsForExceptedLithiumIonBatteries[
        "2.7Wh-100Wh"
      ].maximumNumberOfBatteriesPerPackage;

    if (
      input.lithiumBatteryInput.numberOfLithiumBatteries &&
      maxNumberOfBatteriesPerPackage &&
      input.lithiumBatteryInput.numberOfLithiumBatteries >
        maxNumberOfBatteriesPerPackage
    ) {
      return {
        isExcepted: false,
        reason:
          "Lithium Ion Batteries (UN3480, UN3481) exceed the maximum allowed number of batteries per package (2).",
        applicableRule:
          "Table A3.5. - Package limits for Excepted Lithium Batteries",
      };
    }

    return {
      isExcepted: true,
      reason:
        "Lithium Ion Batteries (UN3480, UN3481) comply with the maximum allowed number of batteries per package (≤2).",
      applicableRule:
        "Table A3.5. - Package limits for Excepted Lithium Batteries",
    };
  }
};
