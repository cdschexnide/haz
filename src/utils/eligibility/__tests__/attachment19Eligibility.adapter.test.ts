import { HazardousMaterialItem } from "../../../../types";
import { evaluateAttachment19Eligibility } from "../attachment19Eligibility";

const material: HazardousMaterialItem = {
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
};

const class51Material: HazardousMaterialItem = {
  isFixed: "",
  isDomesticShipment: false,
  isTechnicalNameRequired: false,
  unid: "UN2426",
  properShippingName: "AMMONIUM NITRATE, LIQUID",
  hazclassDiv: "5.1",
  subsidiaryRisk: "",
  packingGroup: "II",
  specialProvision: "",
  packagingParagraph: "P001",
  physicalState: "LIQUID",
};

const class8Material: HazardousMaterialItem = {
  isFixed: "",
  isDomesticShipment: false,
  isTechnicalNameRequired: false,
  unid: "UN1760",
  properShippingName: "CORROSIVE LIQUID, N.O.S.",
  hazclassDiv: "8",
  subsidiaryRisk: "",
  packingGroup: "II",
  specialProvision: "",
  packagingParagraph: "P001",
  physicalState: "LIQUID",
};

const class9Material: HazardousMaterialItem = {
  isFixed: "",
  isDomesticShipment: false,
  isTechnicalNameRequired: false,
  unid: "UN3082",
  properShippingName: "ENVIRONMENTALLY HAZARDOUS SUBSTANCE, LIQUID, N.O.S.",
  hazclassDiv: "9",
  subsidiaryRisk: "",
  packingGroup: "III",
  specialProvision: "",
  packagingParagraph: "P001",
  physicalState: "LIQUID",
};

const class41SolidMaterial: HazardousMaterialItem = {
  isFixed: "",
  isDomesticShipment: false,
  isTechnicalNameRequired: false,
  unid: "UN1325",
  properShippingName: "FLAMMABLE SOLID, ORGANIC, N.O.S.",
  hazclassDiv: "4.1",
  subsidiaryRisk: "",
  packingGroup: "II",
  specialProvision: "",
  packagingParagraph: "P001",
  physicalState: "SOLID",
};

describe("evaluateAttachment19Eligibility", () => {
  it("marks excepted quantity as eligible when both inner and outer values are within limits", () => {
    const result = evaluateAttachment19Eligibility({
      material,
      quantities: {
        numberOfInnerPackages: 10,
        quantityPerInnerPackage: { value: 30, unit: "mL" },
        totalPerPackage: { value: 500, unit: "mL" },
      },
    });

    expect(result.quantityType).toBe("excepted");
    expect(result.exceptedQuantityData.eligible).toBe(true);
  });

  it("marks excepted quantity as ineligible when outer value exceeds limit", () => {
    const result = evaluateAttachment19Eligibility({
      material,
      quantities: {
        numberOfInnerPackages: 10,
        quantityPerInnerPackage: { value: 30, unit: "mL" },
        totalPerPackage: { value: 501, unit: "mL" },
      },
    });

    expect(result.exceptedQuantityData.eligible).toBe(false);
  });

  it("classifies as limited when EQ fails but LQ passes", () => {
    const result = evaluateAttachment19Eligibility({
      material: class51Material,
      quantities: {
        numberOfInnerPackages: 5,
        quantityPerInnerPackage: { value: 100, unit: "mL" },
        totalPerPackage: { value: 500, unit: "mL" },
      },
    });

    expect(result.quantityType).toBe("limited");
    expect(result.exceptedQuantityData.eligible).toBe(false);
    expect(result.limitedQuantityData.eligible).toBe(true);
  });

  it("classifies as standard when both EQ and LQ limits are exceeded", () => {
    const result = evaluateAttachment19Eligibility({
      material: class51Material,
      quantities: {
        numberOfInnerPackages: 5,
        quantityPerInnerPackage: { value: 150, unit: "mL" },
        totalPerPackage: { value: 600, unit: "mL" },
      },
    });

    expect(result.quantityType).toBe("standard");
    expect(result.exceptedQuantityData.eligible).toBe(false);
    expect(result.limitedQuantityData.eligible).toBe(false);
  });

  it("classifies class 8 PG II liquid as limited when in Table A19.2 limits", () => {
    const result = evaluateAttachment19Eligibility({
      material: class8Material,
      quantities: {
        numberOfInnerPackages: 2,
        quantityPerInnerPackage: { value: 100, unit: "mL" },
        totalPerPackage: { value: 500, unit: "mL" },
      },
    });

    expect(result.quantityType).toBe("limited");
    expect(result.limitedQuantityData.eligible).toBe(true);
  });

  it("classifies class 9 permitted UNID as limited when within limits", () => {
    const result = evaluateAttachment19Eligibility({
      material: class9Material,
      quantities: {
        numberOfInnerPackages: 2,
        quantityPerInnerPackage: { value: 100, unit: "mL" },
        totalPerPackage: { value: 1000, unit: "mL" },
      },
    });

    expect(result.quantityType).toBe("limited");
    expect(result.limitedQuantityData.eligible).toBe(true);
  });

  it("classifies class 4.1 PG II solid as limited when within limits", () => {
    const result = evaluateAttachment19Eligibility({
      material: class41SolidMaterial,
      quantities: {
        numberOfInnerPackages: 10,
        quantityPerInnerPackage: { value: 500, unit: "g" },
        totalPerPackage: { value: 5000, unit: "g" },
      },
    });

    expect(result.quantityType).toBe("limited");
    expect(result.limitedQuantityData.eligible).toBe(true);
  });

  it("classifies class 4.1 PG II solid as standard when package limit is exceeded", () => {
    const result = evaluateAttachment19Eligibility({
      material: class41SolidMaterial,
      quantities: {
        numberOfInnerPackages: 10,
        quantityPerInnerPackage: { value: 500, unit: "g" },
        totalPerPackage: { value: 5001, unit: "g" },
      },
    });

    expect(result.quantityType).toBe("standard");
    expect(result.limitedQuantityData.eligible).toBe(false);
  });
});
