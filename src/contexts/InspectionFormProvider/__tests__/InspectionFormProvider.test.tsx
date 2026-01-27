import React, { useEffect } from "react";
import { render, act } from "@testing-library/react-native";
import {
  InspectionFormProvider,
  useInspectionForm,
} from "@/contexts/InspectionFormProvider";

const mockDatabase = {
  isInitialized: true,
  saveInspection: jest.fn().mockResolvedValue("new-id"),
  updateInspection: jest.fn().mockResolvedValue(undefined),
  loadInspection: jest.fn().mockResolvedValue(null),
  listInspections: jest.fn().mockResolvedValue([]),
  deleteInspection: jest.fn().mockResolvedValue(undefined),
  getInspectionStats: jest.fn().mockResolvedValue({ total: 0 }),
};

jest.mock("@/contexts/DataProvider", () => ({
  useDatabase: () => mockDatabase,
}));

const TestHarness = ({
  onReady,
}: {
  onReady: (ctx: ReturnType<typeof useInspectionForm>) => void;
}) => {
  const ctx = useInspectionForm();
  useEffect(() => onReady(ctx), [ctx, onReady]);
  return null;
};

describe("InspectionFormProvider finalize + reset", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("saves new inspection then clears provider state", async () => {
    let ctx: ReturnType<typeof useInspectionForm> | null = null;
    render(
      <InspectionFormProvider>
        <TestHarness
          onReady={value => {
            ctx = value;
          }}
        />
      </InspectionFormProvider>
    );

    await act(async () => {
      ctx?.setExtractedSDDGContent(
        {
          shipper: "X",
          consignee: "Y",
          shippersReferenceNumber: "TCN1",
        } as any
      );
    });

    await act(async () => {
      const result = await (ctx as any).finalizeInspection();
      expect(result.success).toBe(true);
    });

    expect(ctx?.inspection.frustrations.length).toBe(0);
    expect(ctx?.inspection.packageFrustrations.length).toBe(0);
    expect(ctx?.inspectionId).toBe(null);
  });

  it("updates existing inspection then clears provider state", async () => {
    let ctx: ReturnType<typeof useInspectionForm> | null = null;
    mockDatabase.loadInspection.mockResolvedValueOnce({
      id: "existing-id",
      status: "frustrated",
      inspectedAt: new Date(),
      inspectionContext: {
        extractedContent: {
          shipper: "X",
          consignee: "Y",
          shippersReferenceNumber: "TCN1",
        },
        verificationCopy: {
          shipper: "X",
          consignee: "Y",
          shippersReferenceNumber: "TCN1",
        },
        frustrations: [],
        packageFrustrations: [],
      },
      tcn: "TCN1",
      unId: "UN0000",
      properShippingName: "TEST",
      inspector: "I",
      sddgStatus: "verified",
      packageStatus: "verified",
      totalFrustrations: 0,
      sddgFrustrations: 0,
      packageFrustrations: 0,
    });

    render(
      <InspectionFormProvider>
        <TestHarness
          onReady={value => {
            ctx = value;
          }}
        />
      </InspectionFormProvider>
    );

    await act(async () => {
      await ctx?.loadInspectionForEdit("existing-id");
    });

    await act(async () => {
      const result = await (ctx as any).finalizeInspection();
      expect(result.success).toBe(true);
    });

    expect(ctx?.inspectionId).toBe(null);
  });
});
