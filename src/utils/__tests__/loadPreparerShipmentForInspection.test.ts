import { loadPreparerShipmentForInspection } from "../loadPreparerShipmentForInspection";
import ShipmentDatabase from "@/services/shipment/ShipmentDatabase";

jest.mock("@/services/shipment/ShipmentDatabase", () => ({
  __esModule: true,
  default: {
    initialize: jest.fn(),
    loadShipment: jest.fn(),
  },
}));

const mockLoadShipment = ShipmentDatabase.loadShipment as jest.Mock;

describe("loadPreparerShipmentForInspection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns an InspectionSeed when shipment has valid hazProPreparerContext", async () => {
    mockLoadShipment.mockResolvedValue({
      id: "ship-1",
      metadata: {
        id: "ship-1",
        status: "completed",
        savedAt: "2026-01-01",
        tcn: "TCN001",
      },
      hazProPreparerContext: {
        hazardousMaterial: {
          unid: "UN3363",
          properShippingName: "Dangerous goods in apparatus",
          hazclassDiv: "9",
          subsidiaryRisk: "",
          packingGroup: "II",
          specialProvision: "P5",
          packagingParagraph: "A13.13.",
        },
        shipment: { tcn: "TCN001", poe: "DOV", pod: "RMS", inspector: "" },
        shipper: {
          name: "Test",
          address: { shipperLocation: "Test" },
          phoneNumber: {},
        },
        consignee: { address: { consigneeDodaac: "FB5612" } },
        preparer: { preparerName: "Test User", preparerTitle: "Tester" },
      },
    });

    const result = await loadPreparerShipmentForInspection("ship-1");

    expect(result.extractedContent.unIdNo).toBe("UN3363");
    expect(result.extractedContent.properShippingName).toBe(
      "DANGEROUS GOODS IN APPARATUS"
    );
    expect(result.extractedContent.shippersReferenceNumber).toBe("TCN001");
    expect(result.specialAuthorization).toBeDefined();
    expect(result.authorizationDocuments).toBeDefined();
  });

  it("throws when shipment is not found", async () => {
    mockLoadShipment.mockResolvedValue(null);

    await expect(
      loadPreparerShipmentForInspection("nonexistent")
    ).rejects.toThrow("Shipment was found but its data is unavailable");
  });

  it("throws when hazProPreparerContext is missing", async () => {
    mockLoadShipment.mockResolvedValue({
      id: "ship-2",
      metadata: {
        id: "ship-2",
        status: "completed",
        savedAt: "2026-01-01",
        tcn: "TCN002",
      },
      hazProPreparerContext: null,
    });

    await expect(loadPreparerShipmentForInspection("ship-2")).rejects.toThrow(
      "Shipment was found but its data is unavailable"
    );
  });
});
