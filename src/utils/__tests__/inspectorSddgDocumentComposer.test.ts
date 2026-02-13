import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
import { mergeSDDGWithAttachments } from "../sddgPdfGenerator";
import {
  composeInspectorSddgPdf,
  getInspectorAuthorizationAttachmentContext,
} from "../inspectorSddgDocumentComposer";

jest.mock("expo-print", () => ({
  printToFileAsync: jest.fn(),
}));

jest.mock("expo-file-system", () => ({
  cacheDirectory: "file:///mock/cache/",
  EncodingType: {
    Base64: "base64",
  },
  readAsStringAsync: jest.fn(),
  writeAsStringAsync: jest.fn(),
  getInfoAsync: jest.fn(),
  deleteAsync: jest.fn(),
}));

jest.mock("../sddgPdfGenerator", () => ({
  mergeSDDGWithAttachments: jest.fn(),
}));

describe("inspectorSddgDocumentComposer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (Print.printToFileAsync as jest.Mock).mockResolvedValue({
      uri: "file:///mock/cache/sddg.pdf",
    });
    (FileSystem.readAsStringAsync as jest.Mock).mockResolvedValue("base64image");
    (FileSystem.writeAsStringAsync as jest.Mock).mockResolvedValue(undefined);
    (FileSystem.getInfoAsync as jest.Mock).mockImplementation((uri: string) => {
      if (uri.includes("missing")) {
        return Promise.resolve({ exists: false });
      }
      return Promise.resolve({ exists: true });
    });
    (mergeSDDGWithAttachments as jest.Mock).mockResolvedValue(
      "file:///mock/cache/merged.pdf"
    );
  });

  const baseInspection = {
    id: "1",
    status: "completed" as const,
    inspectedAt: new Date(),
    tcn: "TCN123",
    unId: "UN1234",
    properShippingName: "TEST MATERIAL",
    inspector: "Inspector One",
    sddgStatus: "verified" as const,
    packageStatus: "verified" as const,
    totalFrustrations: 0,
    sddgFrustrations: 0,
    packageFrustrations: 0,
    inspectionContext: {
      originalImageUri: "file:///mock/sddg-image.jpg",
      specialAuthorizationType: null,
      specialAuthorizationAttested: false,
      coeAndCaaDocuments: {
        coeDocuments: [],
        caaDocuments: [],
      },
      dotSpWaivers: [],
    },
  };

  it("returns SDDG-only result when no attested authorization is present", async () => {
    const result = await composeInspectorSddgPdf(baseInspection as any);

    expect(result.includesAuthAttachments).toBe(false);
    expect(result.pdfUri).toBe("file:///mock/cache/sddg.pdf");
    expect(mergeSDDGWithAttachments).not.toHaveBeenCalled();
  });

  it("merges SDDG with COE attachments when attested", async () => {
    const inspection = {
      ...baseInspection,
      inspectionContext: {
        ...baseInspection.inspectionContext,
        specialAuthorizationType: "COE",
        specialAuthorizationAttested: true,
        coeAndCaaDocuments: {
          coeDocuments: [
            {
              id: "coe1",
              documentType: "COE",
              uri: "file:///mock/coe.pdf",
              base64Data: "",
              name: "COE-123",
              dateAdded: new Date().toISOString(),
            },
          ],
          caaDocuments: [],
        },
      },
    };

    const result = await composeInspectorSddgPdf(inspection as any);

    expect(result.includesAuthAttachments).toBe(true);
    expect(result.pdfUri).toBe("file:///mock/cache/merged.pdf");
    expect(mergeSDDGWithAttachments).toHaveBeenCalledWith(
      "file:///mock/cache/sddg.pdf",
      ["file:///mock/coe.pdf"]
    );
  });

  it("falls back to SDDG-only when merge fails", async () => {
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    (mergeSDDGWithAttachments as jest.Mock).mockRejectedValueOnce(
      new Error("merge failed")
    );

    const inspection = {
      ...baseInspection,
      inspectionContext: {
        ...baseInspection.inspectionContext,
        specialAuthorizationType: "DOT-SP",
        specialAuthorizationAttested: true,
        dotSpWaivers: [
          {
            id: "dot1",
            uri: "file:///mock/dotsp.pdf",
            base64Data: "",
            waiverNumber: "DOT-SP-12345",
            dateAdded: new Date().toISOString(),
          },
        ],
      },
    };

    const result = await composeInspectorSddgPdf(inspection as any);

    expect(result.includesAuthAttachments).toBe(false);
    expect(result.pdfUri).toBe("file:///mock/cache/sddg.pdf");
    expect(result.warnings.length).toBeGreaterThan(0);
    errorSpy.mockRestore();
  });

  it("resolves attachment context for selected type only", () => {
    const inspection = {
      ...baseInspection,
      inspectionContext: {
        ...baseInspection.inspectionContext,
        specialAuthorizationType: "CAA",
        specialAuthorizationAttested: true,
        coeAndCaaDocuments: {
          coeDocuments: [{ id: "coe1" }],
          caaDocuments: [{ id: "caa1" }],
        },
      },
    };

    const context = getInspectorAuthorizationAttachmentContext(inspection as any);

    expect(context.type).toBe("CAA");
    expect(context.attachments).toHaveLength(1);
    expect((context.attachments[0] as { id: string }).id).toBe("caa1");
  });
});
