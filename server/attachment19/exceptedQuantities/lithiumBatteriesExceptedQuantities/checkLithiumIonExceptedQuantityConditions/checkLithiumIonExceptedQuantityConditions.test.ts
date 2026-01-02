import { checkLithiumIonExceptedQuantityConditions } from "./checkLithiumIonExceptedQuantityConditions";
import { table_A3_5_PackageLimitsForExceptedLithiumIonBatteries } from "../../../tables/tableA3.5PackageLimitsForLithiumBatteries";

describe("checkLithiumIonExceptedQuantityConditions", () => {
  it("should return false if the watt-hour rating exceeds 100Wh for UN3480 or UN3481", () => {
    const input = {
      inputMaterialUnid: "UN3480",
      lithiumBatteryInput: {
        wattHourRating: 101,
        quantityIn_Kgs: 1,
        lithiumContentInGrams: 5,
        numberOfLithiumBatteries: 1,
      },
      table_A3_5_PackageLimitsForExceptedLithiumIonBatteries,
    };

    const result = checkLithiumIonExceptedQuantityConditions(input);

    expect(result).toEqual({
      isExcepted: false,
      reason:
        "Lithium Ion Batteries (UN3480, UN3481) exceed the maximum allowed watt-hour rating (100Wh).",
    });
  });

  it("should return true if watt-hour rating is exactly 100Wh", () => {
    const input = {
      inputMaterialUnid: "UN3481",
      lithiumBatteryInput: {
        wattHourRating: 100,
        quantityIn_Kgs: 1,
        lithiumContentInGrams: 5,
        numberOfLithiumBatteries: 2,
      },
      table_A3_5_PackageLimitsForExceptedLithiumIonBatteries,
    };

    const result = checkLithiumIonExceptedQuantityConditions(input);

    expect(result).toEqual({
      isExcepted: true,
      reason: "",
    });
  });

  it("should return false if the net quantity exceeds maximum allowed for watt-hour rating <= 2.7 Wh", () => {
    const input = {
      inputMaterialUnid: "UN3480",
      lithiumBatteryInput: {
        wattHourRating: 2.5,
        quantityIn_Kgs: 3,
        lithiumContentInGrams: 5,
        numberOfLithiumBatteries: 1,
      },
      table_A3_5_PackageLimitsForExceptedLithiumIonBatteries,
    };

    const result = checkLithiumIonExceptedQuantityConditions(input);

    expect(result).toEqual({
      isExcepted: false,
      reason:
        "Lithium Ion Batteries (UN3480, UN3481) exceed the maximum allowed net quantity per package (2.5kg).",
    });
  });

  it("should return false if the number of batteries exceeds maximum allowed for watt-hour rating between 2.7Wh and 100Wh", () => {
    const input = {
      inputMaterialUnid: "UN3481",
      lithiumBatteryInput: {
        wattHourRating: 50,
        quantityIn_Kgs: 1,
        lithiumContentInGrams: 5,
        numberOfLithiumBatteries: 3,
      },
      table_A3_5_PackageLimitsForExceptedLithiumIonBatteries,
    };

    const result = checkLithiumIonExceptedQuantityConditions(input);

    expect(result).toEqual({
      isExcepted: false,
      reason:
        "Lithium Ion Batteries (UN3480, UN3481) exceed the maximum allowed number of batteries per package (2).",
    });
  });

  it("should return true if all the conditions are satisfied for watt-hour rating <= 2.7 Wh", () => {
    const input = {
      inputMaterialUnid: "UN3480",
      lithiumBatteryInput: {
        wattHourRating: 2.5,
        quantityIn_Kgs: 2.0,
        lithiumContentInGrams: 5,
        numberOfLithiumBatteries: 1,
      },
      table_A3_5_PackageLimitsForExceptedLithiumIonBatteries,
    };

    const result = checkLithiumIonExceptedQuantityConditions(input);

    expect(result).toEqual({
      isExcepted: true,
      reason: "",
    });
  });

  it("should return true if all the conditions are satisfied for watt-hour rating between 2.7Wh and 100Wh", () => {
    const input = {
      inputMaterialUnid: "UN3481",
      lithiumBatteryInput: {
        wattHourRating: 75,
        quantityIn_Kgs: 1,
        lithiumContentInGrams: 5,
        numberOfLithiumBatteries: 2,
      },
      table_A3_5_PackageLimitsForExceptedLithiumIonBatteries,
    };

    const result = checkLithiumIonExceptedQuantityConditions(input);

    expect(result).toEqual({
      isExcepted: true,
      reason: "",
    });
  });
});
