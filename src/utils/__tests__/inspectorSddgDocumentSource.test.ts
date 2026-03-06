import {
  getInspectorSddgFormDataFromInspection,
  hasRenderableInspectionSddgContent,
  resolveInspectorSddgDocumentAvailability,
} from "../inspectorSddgDocumentSource";

const buildInspection = (overrides?: Record<string, any>) => ({
  id: "1",
  status: "in-progress" as const,
  inspectedAt: new Date(),
  tcn: "TCN123",
  unId: "UN1234",
  properShippingName: "TEST MATERIAL",
  inspector: "Inspector",
  sddgStatus: "verified" as const,
  packageStatus: null,
  totalFrustrations: 0,
  sddgFrustrations: 0,
  packageFrustrations: 0,
  inspectionContext: {
    originalImageUri: null,
    extractedContent: null,
    verificationCopy: null,
  },
  ...overrides,
});

describe("inspectorSddgDocumentSource", () => {
  it("resolves image source when image uri exists", () => {
    const inspection = buildInspection({
      inspectionContext: {
        originalImageUri: "file:///tmp/sddg.jpg",
        extractedContent: null,
        verificationCopy: null,
      },
    });

    expect(resolveInspectorSddgDocumentAvailability(inspection as any)).toEqual({
      source: "image",
      hasViewableDocument: true,
    });
  });

  it("resolves digital source when no image but sddg content exists", () => {
    const inspection = buildInspection({
      inspectionContext: {
        originalImageUri: null,
        verificationCopy: {
          shipper: "Shipper",
          consignee: "Consignee",
          airWaybillNumber: "",
          pagination: "",
          shippersReferenceNumber: "TCN123",
          inspectionActivity: "",
          aircraftType: "Passenger and Cargo Aircraft",
          airportOfDeparture: "AAA",
          airportOfDestination: "BBB",
          shipmentType: "Non-Radioactive",
          unIdNo: "UN1234",
          properShippingName: "TEST MATERIAL",
          hazardClass: "3",
          subsidiaryRisk: "",
          packingGroup: "II",
          quantityAndPacking: "1 fiberboard box x 10 KG",
          packingInstruction: "A1.1",
          authorization: "AFMAN24-604",
          additionalHandlingInfo: "",
          nameOfSignatory: "John Doe",
          placeAndDate: "Dover 2026-02-20",
          signature: "",
        },
      },
    });

    expect(hasRenderableInspectionSddgContent(inspection as any)).toBe(true);
    expect(resolveInspectorSddgDocumentAvailability(inspection as any)).toEqual({
      source: "digital",
      hasViewableDocument: true,
    });
  });

  it("returns none when no image and no content", () => {
    const inspection = buildInspection();
    expect(resolveInspectorSddgDocumentAvailability(inspection as any)).toEqual({
      source: "none",
      hasViewableDocument: false,
    });
  });

  it("maps inspection content into inspector form data", () => {
    const inspection = buildInspection({
      inspectionContext: {
        originalImageUri: null,
        verificationCopy: {
          shipper: "Shipper",
          consignee: "Consignee",
          airWaybillNumber: "AWB",
          pagination: "PAGE 1 OF 1",
          shippersReferenceNumber: "TCN123",
          inspectionActivity: "ACT",
          aircraftType: "Passenger and Cargo Aircraft",
          airportOfDeparture: "AAA",
          airportOfDestination: "BBB",
          shipmentType: "Non-Radioactive",
          unIdNo: "UN1234",
          properShippingName: "TEST MATERIAL",
          hazardClass: "3",
          subsidiaryRisk: "",
          packingGroup: "II",
          quantityAndPacking: "1 box x 10 KG",
          packingInstruction: "A1.1",
          authorization: "AFMAN24-604",
          additionalHandlingInfo: "Handle with care",
          nameOfSignatory: "John Doe",
          placeAndDate: "Dover 2026-02-20",
          signature: "",
        },
      },
    });

    const formData = getInspectorSddgFormDataFromInspection(inspection as any);
    expect(formData?.hazardousMaterials[0].unIdNo).toBe("UN1234");
    expect(formData?.hazardousMaterials[0].packingInstruction).toBe("A1.1");
    expect(formData?.emergencyTelephoneNumber).toBe(
      "1-800-851-8061 | 1-804-279-3131"
    );
  });
});
