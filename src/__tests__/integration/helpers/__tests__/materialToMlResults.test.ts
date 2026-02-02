import {
  materialToHappyMlResults,
  materialToFrustrationMlResults,
} from "../materialToMlResults";
import { HazardousMaterialItem } from "@/hazardousMaterials/hazardousMaterialsList";

const acetone: HazardousMaterialItem = {
  isFixed: "false",
  isDomesticShipment: false,
  isTechnicalNameRequired: false,
  unid: "UN1090",
  properShippingName: "ACETONE",
  hazclassDiv: "3",
  subsidiaryRisk: "",
  packingGroup: "II",
  specialProvision: "P5",
  packagingParagraph: "A7.2.",
};

describe("materialToHappyMlResults", () => {
  test("includes correct UN number", () => {
    const results = materialToHappyMlResults(acetone);
    expect(results.allUnNumbers).toContain("UN1090");
  });

  test("includes primary hazard label", () => {
    const results = materialToHappyMlResults(acetone);
    expect(results.allDetectedLabels.length).toBeGreaterThan(0);
    expect(results.allDetectedLabels[0].maxConfidence).toBeGreaterThan(0.8);
  });

  test("includes UN+PSN pair", () => {
    const results = materialToHappyMlResults(acetone);
    expect(results.allUnWithPSN).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ un: "UN1090", psn: "ACETONE" }),
      ])
    );
  });

  test("includes POP marking with valid packaging code", () => {
    const results = materialToHappyMlResults(acetone);
    expect(results.bestPopMarking).not.toBeNull();
    expect(results.bestPopMarking!.fields.B).toBeTruthy();
    // Should not be the invalid code
    expect(results.bestPopMarking!.fields.B).not.toBe("9Z9");
  });
});

describe("materialToFrustrationMlResults", () => {
  test("has empty detected labels", () => {
    const results = materialToFrustrationMlResults(acetone);
    expect(results.allDetectedLabels).toEqual([]);
  });

  test("has invalid POP marking code", () => {
    const results = materialToFrustrationMlResults(acetone);
    expect(results.bestPopMarking).not.toBeNull();
    expect(results.bestPopMarking!.fields.B).toBe("9Z9");
  });

  test("still includes UN number (OCR still works)", () => {
    const results = materialToFrustrationMlResults(acetone);
    expect(results.allUnNumbers).toContain("UN1090");
  });
});
