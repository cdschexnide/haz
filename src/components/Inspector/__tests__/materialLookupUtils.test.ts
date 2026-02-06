import {
  mapMaterialToSDDGFields,
  filterMaterialsByUnid,
  getDeduplicatedUnids,
} from "../materialLookupUtils";
import { HazardousMaterialItem } from "../../../hazardousMaterials/hazardousMaterialsList";

describe("mapMaterialToSDDGFields", () => {
  it("maps a simple material with no subsidiary risk or details", () => {
    const material: HazardousMaterialItem = {
      isFixed: "false",
      isDomesticShipment: false,
      isTechnicalNameRequired: false,
      unid: "UN1088",
      properShippingName: "ACETAL",
      hazclassDiv: "3",
      subsidiaryRisk: "",
      packingGroup: "II",
      specialProvision: "P5",
      packagingParagraph: "A7.2.",
    };

    const result = mapMaterialToSDDGFields(material);

    expect(result.unIdNo).toBe("UN1088");
    expect(result.properShippingName).toBe("ACETAL");
    expect(result.hazardClass).toBe("3");
    expect(result.subsidiaryRisk).toBe("");
    expect(result.packingGroup).toBe("II");
    expect(result.packingInstruction).toBe("A7.2.");
    expect(result.authorization).toBe("P5");
  });

  it("includes subsidiary risk in hazardClass when present", () => {
    const material: HazardousMaterialItem = {
      isFixed: "false",
      isDomesticShipment: false,
      isTechnicalNameRequired: false,
      unid: "UN1072",
      properShippingName: "OXYGEN, COMPRESSED",
      hazclassDiv: "2.2",
      subsidiaryRisk: "5.1",
      packingGroup: "",
      specialProvision: "P5, 110",
      packagingParagraph: "A6.3., A6.5.",
    };

    const result = mapMaterialToSDDGFields(material);

    expect(result.hazardClass).toBe("2.2 (5.1)");
    expect(result.subsidiaryRisk).toBe("5.1");
    expect(result.packingInstruction).toBe("A6.3., A6.5.");
    expect(result.authorization).toBe("P5, 110");
  });

  it("uses only properShippingName without details", () => {
    const material: HazardousMaterialItem = {
      isFixed: "false",
      isDomesticShipment: false,
      isTechnicalNameRequired: false,
      unid: "UN2789",
      properShippingName: "ACETIC ACID, GLACIAL",
      details: "with more than 80% acid, by mass",
      hazclassDiv: "8",
      subsidiaryRisk: "3",
      packingGroup: "II",
      specialProvision: "P5, A3, A7, A10",
      packagingParagraph: "A12.2.",
    };

    const result = mapMaterialToSDDGFields(material);

    expect(result.properShippingName).toBe("ACETIC ACID, GLACIAL");
    expect(result.hazardClass).toBe("8 (3)");
  });

  it("sets empty fields to empty string", () => {
    const material: HazardousMaterialItem = {
      isFixed: "false",
      isDomesticShipment: false,
      isTechnicalNameRequired: false,
      unid: "UN1950",
      properShippingName: "AEROSOLS, FLAMMABLE",
      hazclassDiv: "2.1",
      subsidiaryRisk: "",
      packingGroup: "",
      specialProvision: "P5",
      packagingParagraph: "A6.2.",
    };

    const result = mapMaterialToSDDGFields(material);

    expect(result.packingGroup).toBe("");
  });

  it("normalizes undefined optional fields to empty string", () => {
    // Simulate a material where optional fields could be undefined at runtime
    const material = {
      isFixed: "false",
      isDomesticShipment: false,
      isTechnicalNameRequired: false,
      unid: "UN9999",
      properShippingName: "TEST MATERIAL",
      hazclassDiv: "3",
      subsidiaryRisk: undefined as unknown as string,
      packingGroup: undefined as unknown as string,
      specialProvision: undefined as unknown as string,
      packagingParagraph: "A7.2.",
    } as HazardousMaterialItem;

    const result = mapMaterialToSDDGFields(material);

    expect(result.subsidiaryRisk).toBe("");
    expect(result.packingGroup).toBe("");
    expect(result.authorization).toBe("");
    expect(result.hazardClass).toBe("3");
  });
});

describe("filterMaterialsByUnid", () => {
  const materials: HazardousMaterialItem[] = [
    {
      isFixed: "false",
      isDomesticShipment: false,
      isTechnicalNameRequired: false,
      unid: "UN1950",
      properShippingName: "AEROSOLS, FLAMMABLE",
      hazclassDiv: "2.1",
      subsidiaryRisk: "",
      packingGroup: "",
      specialProvision: "P5",
      packagingParagraph: "A6.2.",
    },
    {
      isFixed: "false",
      isDomesticShipment: false,
      isTechnicalNameRequired: false,
      unid: "UN1950",
      properShippingName: "AEROSOLS",
      details: "flammable, containing toxic gas",
      hazclassDiv: "2.3",
      subsidiaryRisk: "2.1",
      packingGroup: "",
      specialProvision: "",
      packagingParagraph: "FORBIDDEN",
    },
    {
      isFixed: "false",
      isDomesticShipment: false,
      isTechnicalNameRequired: false,
      unid: "UN1950",
      properShippingName: "AEROSOLS, NON-FLAMMABLE",
      hazclassDiv: "2.2",
      subsidiaryRisk: "",
      packingGroup: "",
      specialProvision: "P5",
      packagingParagraph: "A6.2.",
    },
  ];

  it("returns only non-FORBIDDEN materials for a given UNID", () => {
    const result = filterMaterialsByUnid(materials, "UN1950");

    expect(result).toHaveLength(2);
    expect(result[0].properShippingName).toBe("AEROSOLS, FLAMMABLE");
    expect(result[1].properShippingName).toBe("AEROSOLS, NON-FLAMMABLE");
  });

  it("returns empty array when no matches", () => {
    const result = filterMaterialsByUnid(materials, "UN9999");
    expect(result).toHaveLength(0);
  });
});

describe("getDeduplicatedUnids", () => {
  const materials: HazardousMaterialItem[] = [
    {
      isFixed: "false",
      isDomesticShipment: false,
      isTechnicalNameRequired: false,
      unid: "UN1950",
      properShippingName: "AEROSOLS, FLAMMABLE",
      hazclassDiv: "2.1",
      subsidiaryRisk: "",
      packingGroup: "",
      specialProvision: "P5",
      packagingParagraph: "A6.2.",
    },
    {
      isFixed: "false",
      isDomesticShipment: false,
      isTechnicalNameRequired: false,
      unid: "UN1950",
      properShippingName: "AEROSOLS",
      hazclassDiv: "",
      subsidiaryRisk: "",
      packingGroup: "",
      specialProvision: "",
      packagingParagraph: "FORBIDDEN",
    },
    {
      isFixed: "false",
      isDomesticShipment: false,
      isTechnicalNameRequired: false,
      unid: "UN1088",
      properShippingName: "ACETAL",
      hazclassDiv: "3",
      subsidiaryRisk: "",
      packingGroup: "II",
      specialProvision: "P5",
      packagingParagraph: "A7.2.",
    },
  ];

  it("returns deduplicated UNIDs with first non-FORBIDDEN PSN as subtitle", () => {
    const result = getDeduplicatedUnids(materials, "UN", "19");

    expect(result).toHaveLength(1);
    expect(result[0].unid).toBe("UN1950");
    expect(result[0].subtitle).toBe("AEROSOLS, FLAMMABLE");
  });

  it("filters by prefix and digits", () => {
    const result = getDeduplicatedUnids(materials, "UN", "1088");

    expect(result).toHaveLength(1);
    expect(result[0].unid).toBe("UN1088");
    expect(result[0].subtitle).toBe("ACETAL");
  });

  it("returns empty when no digits match", () => {
    const result = getDeduplicatedUnids(materials, "UN", "9999");
    expect(result).toHaveLength(0);
  });

  it("returns empty when digits is empty", () => {
    const result = getDeduplicatedUnids(materials, "UN", "");
    expect(result).toHaveLength(0);
  });

  it("uses first non-FORBIDDEN PSN even when FORBIDDEN entries come first", () => {
    const forbiddenFirstMaterials: HazardousMaterialItem[] = [
      {
        isFixed: "false",
        isDomesticShipment: false,
        isTechnicalNameRequired: false,
        unid: "UN7777",
        properShippingName: "THING A",
        hazclassDiv: "",
        subsidiaryRisk: "",
        packingGroup: "",
        specialProvision: "",
        packagingParagraph: "FORBIDDEN",
      },
      {
        isFixed: "false",
        isDomesticShipment: false,
        isTechnicalNameRequired: false,
        unid: "UN7777",
        properShippingName: "THING B",
        hazclassDiv: "",
        subsidiaryRisk: "",
        packingGroup: "",
        specialProvision: "",
        packagingParagraph: "FORBIDDEN",
      },
      {
        isFixed: "false",
        isDomesticShipment: false,
        isTechnicalNameRequired: false,
        unid: "UN7777",
        properShippingName: "THING C (VALID)",
        hazclassDiv: "3",
        subsidiaryRisk: "",
        packingGroup: "II",
        specialProvision: "P5",
        packagingParagraph: "A7.2.",
      },
    ];

    const result = getDeduplicatedUnids(forbiddenFirstMaterials, "UN", "7777");

    expect(result).toHaveLength(1);
    expect(result[0].unid).toBe("UN7777");
    expect(result[0].subtitle).toBe("THING C (VALID)");
  });

  it("excludes UNIDs where ALL entries are FORBIDDEN", () => {
    const allForbiddenMaterials: HazardousMaterialItem[] = [
      {
        isFixed: "false",
        isDomesticShipment: false,
        isTechnicalNameRequired: false,
        unid: "UN8888",
        properShippingName: "BANNED ITEM A",
        hazclassDiv: "",
        subsidiaryRisk: "",
        packingGroup: "",
        specialProvision: "",
        packagingParagraph: "FORBIDDEN",
      },
      {
        isFixed: "false",
        isDomesticShipment: false,
        isTechnicalNameRequired: false,
        unid: "UN8888",
        properShippingName: "BANNED ITEM B",
        hazclassDiv: "",
        subsidiaryRisk: "",
        packingGroup: "",
        specialProvision: "",
        packagingParagraph: "FORBIDDEN",
      },
      {
        isFixed: "false",
        isDomesticShipment: false,
        isTechnicalNameRequired: false,
        unid: "UN8889",
        properShippingName: "VALID ITEM",
        hazclassDiv: "3",
        subsidiaryRisk: "",
        packingGroup: "I",
        specialProvision: "P5",
        packagingParagraph: "A7.2.",
      },
    ];

    const result = getDeduplicatedUnids(allForbiddenMaterials, "UN", "888");

    // UN8888 excluded (all FORBIDDEN), UN8889 included
    expect(result).toHaveLength(1);
    expect(result[0].unid).toBe("UN8889");
  });
});
