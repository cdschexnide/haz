import type { HazProPreparerContext } from "@/contexts/HazProPreparerProvider/reducer";
import { mapPreparerShipmentToInspectionSeed } from "@/utils/preparerShipmentToInspection";
import { getSddgQuantityAndTypeOfPacking } from "@/utils/getSddgQuantityAndTypeOfPacking";
import { PhysicalState } from "../../../types";

const createContext = (
  overrides: Partial<HazProPreparerContext> = {}
): HazProPreparerContext =>
  ({
    hazardousMaterial: {
      unid: "UN3363",
      properShippingName: "Dangerous goods in apparatus",
      hazclassDiv: "9",
      subsidiaryRisk: "",
      packingGroup: "II",
      specialProvision: "P5",
      packagingParagraph: "A13.13.",
      physicalState: PhysicalState.SOLID,
    },
    shipment: {
      tcn: "FB23000080609100XX",
      poe: "DOV",
      pod: "RMS",
      inspector: "",
    },
    shipper: {
      name: "Traffic Management Flight",
      address: {
        shipperLocation: "Traffic Management Flight",
        shipperStreet: "5236 Chase St",
        shipperCity: "Wright-Patterson AFB",
        shipperState: "OH",
        shipperZipcode: "45433",
        selectedShipperCountry: "United States of America",
      },
      phoneNumber: {
        number: "+1 (937) 257-4409",
        dsnNumber: "312-257-4409",
      },
    },
    consignee: {
      address: {
        consigneeDodaac: "FB5612",
        consigneeStreet: "435 ABW LRS",
        consigneeCity: "Ramstein AB",
        consigneeState: "",
        consigneeZipcode: "",
        selectedConsigneeCountry: "Germany",
      },
    },
    preparer: {
      preparerName: "Austin Stewart",
      preparerTitle: "Warehouse Foreman",
      certificationPlace: "WPAFB, OH",
      certificationDate: "2026-01-12",
    },
    packaging: {
      inputPOPMarking: {
        B: "4G",
      },
      totalNetMass: {
        kg: 15,
      },
      totalNetVolume: {
        liters: 0,
      },
    },
    additionalHandlingInfo: {
      notes: ["Handle with care", "Keep upright"],
    },
    specialAuthorizationType: null,
    specialAuthorizationReference: null,
    specialAuthorizationAttested: false,
    specialAuthorizationQuantityAndTypeOfPacking: null,
    usesCoeCertification: false,
    usesCaaCertification: false,
    usesDotSpPermit: false,
    coeAndCaaDocuments: {
      coeDocuments: [],
      caaDocuments: [],
    },
    dotSpWaivers: [],
    packingInstruction: "A13.13.",
    ...overrides,
  } as unknown as HazProPreparerContext);

describe("mapPreparerShipmentToInspectionSeed", () => {
  it("maps base preparer shipment fields to inspector SDDG content", () => {
    const context = createContext({
      hazardousMaterial: {
        unid: "UN2719",
        properShippingName: "Barium bromate",
        hazclassDiv: "5.1",
        subsidiaryRisk: "",
        packingGroup: "II",
        specialProvision: "P2",
        packagingParagraph: "A9.6.",
        physicalState: PhysicalState.SOLID,
      } as any,
    });

    const result = mapPreparerShipmentToInspectionSeed(context);

    expect(result.extractedContent.shippersReferenceNumber).toBe(
      "FB23000080609100XX"
    );
    expect(result.extractedContent.unIdNo).toBe("UN2719");
    expect(result.extractedContent.properShippingName).toBe("BARIUM BROMATE");
    expect(result.extractedContent.aircraftType).toBe("Cargo Aircraft Only");
    expect(result.extractedContent.quantityAndPacking).toBe(
      "1 FIBERBOARD BOX (4G) x 15 KG"
    );
    expect(result.extractedContent.authorization).toBe("AFMAN24-604");
    expect(result.extractedContent.additionalHandlingInfo).toBe(
      "Handle with care\nKeep upright"
    );
    expect(result.extractedContent.nameOfSignatory).toBe(
      "Austin Stewart Warehouse Foreman"
    );
    expect(result.extractedContent.placeAndDate).toBe(
      "WPAFB, OH 2026-01-12"
    );
    expect(result.specialAuthorization.type).toBeNull();
  });

  it("maps Key 20/21 from legacy preparer fields when preparer object is absent", () => {
    const context = createContext({
      preparer: null,
      preparerName: "Cody Schexnider",
      preparerTitle: "Hazmat Preparer",
      certificationPlace: "WPAFB, OH 45433",
      certificationDate: "2026-02-17",
    } as any);

    const result = mapPreparerShipmentToInspectionSeed(context);

    expect(result.extractedContent.nameOfSignatory).toBe(
      "Cody Schexnider Hazmat Preparer"
    );
    expect(result.extractedContent.placeAndDate).toBe(
      "WPAFB, OH 45433 2026-02-17"
    );
  });

  it("keeps key 16 identical to preparer output for 1A1 drum shipments", () => {
    const context = createContext({
      hazardousMaterial: {
        unid: "UN2719",
        properShippingName: "Barium bromate",
        hazclassDiv: "5.1",
        subsidiaryRisk: "6.1",
        packingGroup: "II",
        specialProvision: "P4",
        packagingParagraph: "A9.6.",
        physicalState: PhysicalState.SOLID,
      } as any,
      packaging: {
        inputPOPMarking: {
          B: "1A1",
        },
        totalNetMass: {
          kg: 25,
        },
        totalNetVolume: {
          liters: 0,
        },
      } as any,
    });

    const result = mapPreparerShipmentToInspectionSeed(context);
    const preparerKey16 = getSddgQuantityAndTypeOfPacking(context);

    expect(result.extractedContent.quantityAndPacking).toBe(preparerKey16);
    expect(result.extractedContent.quantityAndPacking).toBe(
      "1 NON-REMOVABLE HEAD STEEL DRUM (1A1) x 25 KG"
    );
  });

  it("uses attested special authorization for keys 17/18 and quantity", () => {
    const context = createContext({
      specialAuthorizationType: "DOT-SP",
      specialAuthorizationReference: "DOT-SP 12345",
      specialAuthorizationAttested: true,
      specialAuthorizationQuantityAndTypeOfPacking: "1 METAL BOX x 12 KG",
      dotSpWaivers: [
        {
          id: "dotsp-1",
          uri: "file://dotsp-1.pdf",
          base64Data: "base64-dotsp",
          waiverNumber: "DOT-SP 12345",
          dateAdded: "2026-01-10T00:00:00.000Z",
        },
      ],
    } as any);

    const result = mapPreparerShipmentToInspectionSeed(context);

    expect(result.specialAuthorization).toEqual({
      type: "DOT-SP",
      referenceNumber: "DOT-SP 12345",
      attested: true,
    });
    expect(result.extractedContent.packingInstruction).toBe("DOT-SP 12345");
    expect(result.extractedContent.authorization).toBe("DOT-SP");
    expect(result.extractedContent.quantityAndPacking).toBe(
      "1 METAL BOX x 12 KG"
    );
    expect(result.authorizationDocuments.dotSpWaivers).toHaveLength(1);
  });

  it("does not infer authorization type from documents without preparer attestation state", () => {
    const context = createContext({
      specialAuthorizationType: null,
      specialAuthorizationReference: null,
      specialAuthorizationAttested: false,
      usesCoeCertification: false,
      usesCaaCertification: false,
      usesDotSpPermit: false,
      coeAndCaaDocuments: {
        coeDocuments: [
          {
            id: "coe-1",
            documentType: "COE",
            uri: "file://coe-1.pdf",
            base64Data: "base64-coe",
            name: "COE-2026-001",
            dateAdded: "2026-01-08T00:00:00.000Z",
          },
        ],
        caaDocuments: [],
      },
      dotSpWaivers: [
        {
          id: "dotsp-2",
          uri: "file://dotsp-2.pdf",
          base64Data: "base64-dotsp-2",
          waiverNumber: "DOT-SP 67890",
          dateAdded: "2026-01-09T00:00:00.000Z",
        },
      ],
    } as any);

    const result = mapPreparerShipmentToInspectionSeed(context);

    expect(result.specialAuthorization.type).toBeNull();
    expect(result.specialAuthorization.referenceNumber).toBe("");
    expect(result.specialAuthorization.attested).toBe(false);
    expect(result.extractedContent.authorization).toBe("AFMAN24-604");
    expect(result.authorizationDocuments.coeDocuments).toHaveLength(1);
    expect(result.authorizationDocuments.dotSpWaivers).toHaveLength(1);
  });
});
