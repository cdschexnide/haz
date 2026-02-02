import { materialToSddg } from "../materialToSddg";
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

const dissolvedGas: HazardousMaterialItem = {
  isFixed: "false",
  isDomesticShipment: false,
  isTechnicalNameRequired: false,
  unid: "UN1001",
  properShippingName: "ACETYLENE, DISSOLVED",
  hazclassDiv: "2.1",
  subsidiaryRisk: "",
  packingGroup: "",
  specialProvision: "P5",
  packagingParagraph: "A6.9.",
};

describe("materialToSddg", () => {
  test("maps all material fields correctly", () => {
    const sddg = materialToSddg(acetone);
    expect(sddg.unIdNo).toBe("UN1090");
    expect(sddg.properShippingName).toBe("ACETONE");
    expect(sddg.hazardClass).toBe("3");
    expect(sddg.packingGroup).toBe("II");
    expect(sddg.subsidiaryRisk).toBe("");
    expect(sddg.packingInstruction).toBe("A7.2.");
  });

  test("provides sensible defaults for non-material fields", () => {
    const sddg = materialToSddg(acetone);
    expect(sddg.shipper).toBeTruthy();
    expect(sddg.consignee).toBeTruthy();
    expect(sddg.shippersReferenceNumber).toBeTruthy();
    expect(sddg.aircraftType).toBeTruthy();
    expect(sddg.nameOfSignatory).toBeTruthy();
    expect(sddg.placeAndDate).toBeTruthy();
  });

  test("handles materials with no packing group", () => {
    const sddg = materialToSddg(dissolvedGas);
    expect(sddg.packingGroup).toBe("");
    expect(sddg.unIdNo).toBe("UN1001");
  });

  test("returns valid ExtractedSDDGContent shape with all 22 fields", () => {
    const sddg = materialToSddg(acetone);
    const requiredFields = [
      "shipper",
      "consignee",
      "airWaybillNumber",
      "pagination",
      "shippersReferenceNumber",
      "inspectionActivity",
      "aircraftType",
      "airportOfDeparture",
      "airportOfDestination",
      "shipmentType",
      "unIdNo",
      "properShippingName",
      "hazardClass",
      "subsidiaryRisk",
      "packingGroup",
      "quantityAndPacking",
      "packingInstruction",
      "authorization",
      "additionalHandlingInfo",
      "nameOfSignatory",
      "placeAndDate",
      "signature",
    ];
    for (const field of requiredFields) {
      expect(sddg).toHaveProperty(field);
      expect(typeof (sddg as any)[field]).toBe("string");
    }
  });
});
