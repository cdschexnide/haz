import { checkLithiumMetalExceptedQuantityConditions } from "./checkLithiumMetalExceptedQuantityConditions";
import { table_A3_5_PackageLimitsForExceptedLithiumMetalBatteries } from "../../../tables/tableA3.5PackageLimitsForLithiumBatteries";

describe("checkLithiumMetalExceptedQuantityConditions", () => {
  it("should return false if the lithium content exceeds 2g for UN3090 or UN3091", () => {
    const input = {
      inputMaterialUnid: "UN3091",
      lithiumBatteryInput: {
        wattHourRating: 0,
        quantityIn_Kgs: 1,
        lithiumContentInGrams: 2.5,
        numberOfLithiumBatteries: 1,
      },
      table_A3_5_PackageLimitsForExceptedLithiumMetalBatteries,
    };

    const result = checkLithiumMetalExceptedQuantityConditions(input);

    expect(result).toEqual({
      isExcepted: false,
      reason:
        "Lithium Metal Batteries (UN3090, UN3091) exceed the maximum allowed lithium content (2g).",
    });
  });

  it("should return false if the net quantity per package exceeds maximum for lithium content <= 0.3g", () => {
    const input = {
      inputMaterialUnid: "UN3090",
      lithiumBatteryInput: {
        wattHourRating: 0,
        quantityIn_Kgs: 3,
        lithiumContentInGrams: 0.2,
        numberOfLithiumBatteries: 1,
      },
      table_A3_5_PackageLimitsForExceptedLithiumMetalBatteries,
    };

    const result = checkLithiumMetalExceptedQuantityConditions(input);

    expect(result).toEqual({
      isExcepted: false,
      reason:
        "Lithium Metal Batteries (UN3090, UN3091) exceed the maximum allowed net quantity per package (2.5kg).",
    });
  });

  it("should return false if the number of batteries per package exceeds limit for lithium metal batteries with lithium content between 0.3g and 2g", () => {
    const input = {
      inputMaterialUnid: "UN3091",
      lithiumBatteryInput: {
        wattHourRating: 0,
        quantityIn_Kgs: 1,
        lithiumContentInGrams: 1.5,
        numberOfLithiumBatteries: 3,
      },
      table_A3_5_PackageLimitsForExceptedLithiumMetalBatteries,
    };

    const result = checkLithiumMetalExceptedQuantityConditions(input);

    expect(result).toEqual({
      isExcepted: false,
      reason:
        "Lithium Metal Batteries (UN3090, UN3091) exceed the maximum allowed number of batteries per package (2).",
    });
  });

  it("should return true if all conditions are satisfied for lithium content <= 0.3g", () => {
    const input = {
      inputMaterialUnid: "UN3090",
      lithiumBatteryInput: {
        wattHourRating: 0,
        quantityIn_Kgs: 2.0,
        lithiumContentInGrams: 0.2,
        numberOfLithiumBatteries: 1,
      },
      table_A3_5_PackageLimitsForExceptedLithiumMetalBatteries,
    };

    const result = checkLithiumMetalExceptedQuantityConditions(input);

    expect(result).toEqual({
      isExcepted: true,
      reason: "",
    });
  });

  it("should return true if all conditions are satisfied for lithium content between 0.3g and 2g", () => {
    const input = {
      inputMaterialUnid: "UN3091",
      lithiumBatteryInput: {
        wattHourRating: 0,
        quantityIn_Kgs: 1,
        lithiumContentInGrams: 1,
        numberOfLithiumBatteries: 2,
      },
      table_A3_5_PackageLimitsForExceptedLithiumMetalBatteries,
    };

    const result = checkLithiumMetalExceptedQuantityConditions(input);

    expect(result).toEqual({
      isExcepted: true,
      reason: "",
    });
  });
});
