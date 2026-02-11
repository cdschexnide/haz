import { HazardousMaterialItem } from "../../../../types";
import { isHazardousMaterialExceptedQuantity } from "../../../../server/attachment19/exceptedQuantities/isHazardousMaterialExceptedQuantity";

const buildMaterial = (
  overrides: Partial<HazardousMaterialItem> = {}
): HazardousMaterialItem => ({
  isFixed: "",
  isDomesticShipment: false,
  isTechnicalNameRequired: false,
  unid: "UN1993",
  properShippingName: "FLAMMABLE LIQUID, N.O.S.",
  hazclassDiv: "3",
  subsidiaryRisk: "",
  packingGroup: "II",
  specialProvision: "",
  packagingParagraph: "P001",
  physicalState: "LIQUID",
  ...overrides,
});

describe("isHazardousMaterialExceptedQuantity", () => {
  it("returns explicit false for disqualified materials", () => {
    const result = isHazardousMaterialExceptedQuantity({
      material: buildMaterial({ hazclassDiv: "1.4" }),
      innerPackagingQuantityIn_mLs: 10,
      outerPackagingQuantityIn_mLs: 100,
    });

    expect(result.isExcepted).toBe(false);
    expect(result.applicableRule).toBe("A19.2.1.1");
  });

  it("fails when inner quantity exceeds the class 3 limit", () => {
    const result = isHazardousMaterialExceptedQuantity({
      material: buildMaterial(),
      innerPackagingQuantityIn_mLs: 31,
      outerPackagingQuantityIn_mLs: 200,
    });

    expect(result.isExcepted).toBe(false);
    expect(result.applicableRule).toContain("Table A19.1");
  });

  it("fails when outer quantity exceeds the class 3 PG II limit even if inner is valid", () => {
    const result = isHazardousMaterialExceptedQuantity({
      material: buildMaterial(),
      innerPackagingQuantityIn_mLs: 30,
      outerPackagingQuantityIn_mLs: 501,
    });

    expect(result.isExcepted).toBe(false);
    expect(result.applicableRule).toContain("Table A19.1");
  });

  it("passes when both inner and outer quantities are within class 3 PG II limits", () => {
    const result = isHazardousMaterialExceptedQuantity({
      material: buildMaterial(),
      innerPackagingQuantityIn_mLs: 30,
      outerPackagingQuantityIn_mLs: 500,
    });

    expect(result.isExcepted).toBe(true);
    expect(result.applicableRule).toBe("A19.2");
  });

  it("rejects class 8 UNIDs excluded by Table A19.1 note 4", () => {
    const result = isHazardousMaterialExceptedQuantity({
      material: buildMaterial({
        unid: "UN1774",
        properShippingName: "BROMINE",
        hazclassDiv: "8",
        packingGroup: "II",
      }),
      innerPackagingQuantityIn_mLs: 10,
      outerPackagingQuantityIn_mLs: 100,
    });

    expect(result.isExcepted).toBe(false);
    expect(result.applicableRule).toBe("Table A19.1 note 4");
  });
});
