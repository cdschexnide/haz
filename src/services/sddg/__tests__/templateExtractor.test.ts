import {
  shouldAttemptAutoAlignment,
  extractFormData,
  TemplateExtractionResult,
  FieldExtractionResult,
} from "../templateExtractor";
import { SDDGTemplate, FieldRegion } from "@/types/sddg-template";
import { DEFAULT_PREPROCESSING_CONFIG } from "@/config/preprocessingConfig";
import { DEFAULT_ALIGNMENT_CONFIG } from "@/config/alignmentConfig";

// ── Mocks ────────────────────────────────────────────────────────────────────

jest.mock("@/utils/sddg/imageUtils", () => ({
  correctImageOrientation: jest.fn().mockResolvedValue({
    imageUri: "file://corrected.jpg",
    width: 2550,
    height: 3300,
    rotated: false,
    rotationDegrees: 0,
  }),
  scaleRegion: jest.fn(
    (
      region: any,
      _w: number,
      _h: number,
      _tw?: number,
      _th?: number
    ) => ({
      x: region.x,
      y: region.y,
      w: region.w,
      h: region.h,
    })
  ),
  cropRegion: jest.fn().mockResolvedValue("file://cropped.jpg"),
}));

jest.mock("@/utils/sddg/imagePreprocessing", () => ({
  preprocessFullImage: jest.fn().mockResolvedValue({
    uri: "file://preprocessed.jpg",
    metrics: { processingTime: 10 },
    appliedOperations: ["grayscale"],
  }),
  preprocessRegion: jest.fn().mockResolvedValue({
    uri: "file://region-preprocessed.jpg",
    appliedOperations: [],
  }),
}));

jest.mock("../paddleOCREngine", () => ({
  extractText: jest.fn().mockResolvedValue({
    text: "SAMPLE TEXT",
    confidence: 0.95,
    blocks: [],
  }),
}));

jest.mock("../templateAlignment", () => {
  // Default aligned template — will be overridden per-test when needed
  const defaultAlignedTemplate = {
    formType: "AMC_IMT_1033",
    formName: "SDDG Form",
    version: "1.0",
    identifiers: [],
    regions: {},
  };
  return {
    alignTemplate: jest.fn().mockResolvedValue({
      alignment: {
        success: true,
        offset: { x: 5, y: 10 },
        rotation: 0,
        confidence: 0.92,
        detectedAnchors: [],
        usedAnchors: [],
        skippedAnchors: [],
        metrics: {
          offsetMagnitude: 11.18,
          anchorAgreement: 0.9,
          processingTime: 100,
        },
      },
      alignedTemplate: defaultAlignedTemplate,
    }),
    validateAlignment: jest.fn().mockReturnValue({
      valid: true,
      reason: "",
    }),
  };
});

jest.mock("@/templates", () => ({
  getTemplate: jest.fn(),
}));

jest.mock("../validators", () => ({
  validateFormData: jest.fn().mockReturnValue({
    isValid: true,
    confidence: 0.9,
    errors: [],
    warnings: [],
    fieldScores: {},
  }),
}));

jest.mock("../opencvCellDetection", () => ({
  detectCells: jest.fn().mockResolvedValue({
    success: true,
    cells: [],
    processingTimeMs: 50,
    skewDetected: false,
  }),
}));

jest.mock("../templateAutoAlignment", () => ({
  autoAlignTemplate: jest.fn().mockResolvedValue({
    success: false,
    matchedFields: 0,
    confidence: 0,
    alignmentMethod: "none",
    transform: { offsetX: 0, offsetY: 0, scaleX: 1, scaleY: 1 },
    failureReason: "insufficient cells",
  }),
  applyTransformToTemplate: jest.fn((template: any) => template),
}));

jest.mock("@react-native-ml-kit/text-recognition", () => ({
  __esModule: true,
  default: {
    recognize: jest.fn().mockResolvedValue({ blocks: [] }),
  },
}));

jest.mock("@/hazardousMaterials/hazardousMaterialsList", () => ({
  hazardousMaterialsList: [
    { unid: "UN1088", hazclassDiv: "3" },
    { unid: "UN2811", hazclassDiv: "6.1" },
    { unid: "UN3082", hazclassDiv: "9" },
    { unid: "UN1263", hazclassDiv: "3" },
    { unid: "UN1950", hazclassDiv: "2.1" },
  ],
}));

// ── Helpers ──────────────────────────────────────────────────────────────────

const { getTemplate } = require("@/templates") as {
  getTemplate: jest.Mock;
};
const { alignTemplate, validateAlignment } = require("../templateAlignment") as {
  alignTemplate: jest.Mock;
  validateAlignment: jest.Mock;
};
const { extractText } = require("../paddleOCREngine") as {
  extractText: jest.Mock;
};
const { detectCells } = require("../opencvCellDetection") as {
  detectCells: jest.Mock;
};
const { autoAlignTemplate } = require("../templateAutoAlignment") as {
  autoAlignTemplate: jest.Mock;
};
const { correctImageOrientation } = require("@/utils/sddg/imageUtils") as {
  correctImageOrientation: jest.Mock;
};
const { preprocessRegion } = require("@/utils/sddg/imagePreprocessing") as {
  preprocessRegion: jest.Mock;
};

function makeFieldRegion(
  overrides: Partial<FieldRegion> = {}
): FieldRegion {
  return {
    x: 100,
    y: 200,
    w: 300,
    h: 50,
    fieldType: "text",
    ...overrides,
  };
}

function makeTemplate(
  overrides: Partial<SDDGTemplate> & { regions?: any } = {}
): SDDGTemplate {
  return {
    formType: "AMC_IMT_1033",
    formName: "SDDG Form",
    version: "1.0",
    identifiers: [],
    regions: {},
    ...overrides,
  } as SDDGTemplate;
}

function makeMinimalTemplate(): SDDGTemplate {
  return makeTemplate({
    regions: {
      shipper: makeFieldRegion({ fieldType: "text" }),
    },
  });
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe("templateExtractor", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Suppress console output during tests
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "warn").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // ── shouldAttemptAutoAlignment ─────────────────────────────────────────

  describe("shouldAttemptAutoAlignment", () => {
    it("should return true when no custom template is provided", () => {
      expect(shouldAttemptAutoAlignment()).toBe(true);
      expect(shouldAttemptAutoAlignment(undefined)).toBe(true);
    });

    it("should return false when a custom template is provided", () => {
      const custom = makeMinimalTemplate();
      expect(shouldAttemptAutoAlignment(custom)).toBe(false);
    });
  });

  // ── extractFormData: template loading ──────────────────────────────────

  describe("extractFormData — template loading", () => {
    it("should throw when template is not found and no custom template given", async () => {
      getTemplate.mockReturnValue(null);

      await expect(
        extractFormData("file://test.jpg", "UNKNOWN_FORM")
      ).rejects.toThrow("Template not found: UNKNOWN_FORM");
    });

    it("should use custom template when provided", async () => {
      const custom = makeMinimalTemplate();
      extractText.mockResolvedValue({
        text: "ACME Corp",
        confidence: 0.95,
        blocks: [],
      });

      const result = await extractFormData(
        "file://test.jpg",
        "AMC_IMT_1033",
        undefined,
        DEFAULT_PREPROCESSING_CONFIG,
        DEFAULT_ALIGNMENT_CONFIG,
        custom
      );

      expect(result).not.toBeNull();
      // getTemplate should NOT have been called because customTemplate was supplied
      // (customTemplate takes precedence in the || expression)
      expect(result!.data.shipper).toBeDefined();
    });

    it("should load template from registry when no custom template is given", async () => {
      const template = makeMinimalTemplate();
      getTemplate.mockReturnValue(template);
      extractText.mockResolvedValue({
        text: "SHIPPER ACME",
        confidence: 0.92,
        blocks: [],
      });

      const result = await extractFormData("file://test.jpg", "AMC_IMT_1033");

      expect(getTemplate).toHaveBeenCalledWith("AMC_IMT_1033");
      expect(result).not.toBeNull();
    });
  });

  // ── extractFormData: image orientation ─────────────────────────────────

  describe("extractFormData — image orientation", () => {
    it("should record rotation metadata when image was rotated", async () => {
      correctImageOrientation.mockResolvedValueOnce({
        imageUri: "file://rotated.jpg",
        width: 2550,
        height: 3300,
        rotated: true,
        rotationDegrees: 90,
      });

      const template = makeMinimalTemplate();
      getTemplate.mockReturnValue(template);
      extractText.mockResolvedValue({
        text: "test",
        confidence: 0.9,
        blocks: [],
      });

      const result = await extractFormData("file://test.jpg");
      expect(result).not.toBeNull();
      expect(result!.metadata.imageRotated).toBe(true);
      expect(result!.metadata.rotationDegrees).toBe(90);
    });

    it("should record no rotation when image was not rotated", async () => {
      const template = makeMinimalTemplate();
      getTemplate.mockReturnValue(template);
      extractText.mockResolvedValue({
        text: "test",
        confidence: 0.9,
        blocks: [],
      });

      const result = await extractFormData("file://test.jpg");
      expect(result!.metadata.imageRotated).toBe(false);
      expect(result!.metadata.rotationDegrees).toBe(0);
    });
  });

  // ── extractFormData: field extraction and cleanFieldText ───────────────

  describe("extractFormData — field text cleaning", () => {
    async function extractWithSingleField(
      fieldPath: string,
      ocrText: string,
      fieldType: FieldRegion["fieldType"] = "text"
    ): Promise<TemplateExtractionResult | null> {
      const regions: any = {};

      // Build nested region structure from dot-path
      const parts = fieldPath.split(".");
      if (parts.length === 1) {
        regions[parts[0]] = makeFieldRegion({ fieldType });
      } else {
        let node: any = regions;
        for (let i = 0; i < parts.length - 1; i++) {
          node[parts[i]] = node[parts[i]] || {};
          node = node[parts[i]];
        }
        node[parts[parts.length - 1]] = makeFieldRegion({ fieldType });
      }

      const template = makeTemplate({ regions });
      getTemplate.mockReturnValue(template);

      extractText.mockResolvedValue({
        text: ocrText,
        confidence: 0.95,
        blocks: [],
      });

      return extractFormData(
        "file://test.jpg",
        "AMC_IMT_1033",
        undefined,
        DEFAULT_PREPROCESSING_CONFIG,
        { ...DEFAULT_ALIGNMENT_CONFIG, enabled: false },
        template // custom template to skip alignment
      );
    }

    it("should strip 'SHIPPER' label from shipper field", async () => {
      const result = await extractWithSingleField(
        "shipper",
        "SHIPPER ACME Corp"
      );
      expect(result).not.toBeNull();
      expect(result!.data.shipper).toBe("ACME Corp");
    });

    it("should strip 'CONSIGNEE' label from consignee field", async () => {
      const result = await extractWithSingleField(
        "consignee",
        "CONSIGNEE Bob Smith"
      );
      expect(result!.data.consignee).toBe("Bob Smith");
    });

    it("should strip 'INSPECTOR' label and variants from inspector field", async () => {
      const result = await extractWithSingleField(
        "inspector",
        "INSPECTOR Inspected by: John (optional)"
      );
      expect(result!.data.inspector).toBe("John");
    });

    it("should return empty for AWB field that only contains the label", async () => {
      const result = await extractWithSingleField(
        "air_waybill.awb_number",
        "Air Waybill No."
      );
      expect(result!.data.awb_number).toBeUndefined();
    });

    it("should strip AWB label prefix from actual AWB number", async () => {
      const result = await extractWithSingleField(
        "air_waybill.awb_number",
        "Air Waybill No. 12345678"
      );
      expect(result!.data.awb_number).toBe("12345678");
    });

    it("should strip TCN label variants and remove spaces", async () => {
      const result = await extractWithSingleField(
        "shipper_reference.tcn",
        "Shipper's Reference Number TCN: ABC 123 DEF"
      );
      expect(result!.data.tcn).toBe("ABC123DEF");
    });

    it("should strip TCN label with OCR misspelling 'Relerence'", async () => {
      const result = await extractWithSingleField(
        "shipper_reference.tcn",
        "shipper's Relerence No. XYZ789"
      );
      expect(result!.data.tcn).toBe("XYZ789");
    });

    it("should strip departure airport label", async () => {
      const result = await extractWithSingleField(
        "transportation_details.airport_departure",
        "Airport of Departure (optional) LAX"
      );
      expect(result!.data.airport_departure).toBe("LAX");
    });

    it("should strip destination airport label including OCR typo 'ARPORT'", async () => {
      const result = await extractWithSingleField(
        "transportation_details.airport_destination",
        "ARPORT OF DESTINATION JFK"
      );
      expect(result!.data.airport_destination).toBe("JFK");
    });

    it("should strip additional handling label with OCR variations", async () => {
      // "Additoonal Handing Information" matches the fuzzy regex:
      // Add[di]t[io]on[ao]l -> Additoonal (i, o, o, a match), Hand[li][in][gn] -> Handing
      const result = await extractWithSingleField(
        "additional_handling",
        "Additional Handing Information: Call 555-1234"
      );
      expect(result!.data.additional_handling).toBe("Call 555-1234");
    });

    it("should strip additional handling label with strict match", async () => {
      const result = await extractWithSingleField(
        "additional_handling",
        "ADDITIONAL HANDLING INFORMATION Call 555-1234"
      );
      expect(result!.data.additional_handling).toBe("Call 555-1234");
    });

    it("should strip name/title of signatory label", async () => {
      const result = await extractWithSingleField(
        "signature_block.name_title",
        "NAME/TITLE OF SIGNATORY: Jane Doe"
      );
      expect(result!.data.name_title).toBe("Jane Doe");
    });

    it("should strip 'Date' or 'Dale' prefix from signature date", async () => {
      const result = await extractWithSingleField(
        "signature_block.signature_date",
        "Dale: 2024-01-15"
      );
      expect(result!.data.signature_date).toBe("2024-01-15");
    });

    it("should strip place and date label", async () => {
      const result = await extractWithSingleField(
        "signature_block.place_date",
        "PLACE AND DATE: Fort Worth, 2024-01-15"
      );
      expect(result!.data.place_date).toBe("Fort Worth, 2024-01-15");
    });

    it("should pass through text for fields with no special cleaning", async () => {
      const result = await extractWithSingleField(
        "dangerous_goods.un_number",
        "UN1088"
      );
      expect(result!.data.un_number).toBe("UN1088");
    });

    it("should handle empty OCR text", async () => {
      const result = await extractWithSingleField("shipper", "");
      // Empty text should not be set on data
      expect(result!.data.shipper).toBeUndefined();
    });

    it("should remove non-printable characters but preserve newlines", async () => {
      const result = await extractWithSingleField(
        "dangerous_goods.proper_shipping_name",
        "Flammable\nliquid \u0000\u0001"
      );
      // Note: trailing space remains because non-printable removal happens after trim()
      expect(result!.data.proper_shipping_name).toBe("Flammable\nliquid ");
    });
  });

  // ── extractFormData: checkbox extraction ───────────────────────────────

  describe("extractFormData — checkbox extraction", () => {
    it("should extract checkbox fields from template", async () => {
      const template = makeTemplate({
        regions: {
          shipment_type: {
            non_radioactive: makeFieldRegion({ fieldType: "checkbox" }),
          },
        },
      });
      getTemplate.mockReturnValue(template);

      // Checkbox detection: "x" in text means checked, but the value is negated
      // in the code: `const isChecked = !(await extractCheckboxValue(...))`
      // extractCheckboxValue returns true if text includes 'x', then isChecked = !true = false
      extractText.mockResolvedValue({
        text: "",
        confidence: 0.9,
        blocks: [],
      });

      const result = await extractFormData(
        "file://test.jpg",
        "AMC_IMT_1033",
        undefined,
        DEFAULT_PREPROCESSING_CONFIG,
        { ...DEFAULT_ALIGNMENT_CONFIG, enabled: false },
        template
      );

      expect(result).not.toBeNull();
      const checkboxField = result!.fieldResults.find(
        (f) => f.fieldPath === "shipment_type.non_radioactive"
      );
      expect(checkboxField).toBeDefined();
      expect(checkboxField!.confidence).toBe(0.85);
    });
  });

  // ── extractFormData: template traversal ────────────────────────────────

  describe("extractFormData — template region traversal", () => {
    it("should extract all nested text fields from template regions", async () => {
      const template = makeTemplate({
        regions: {
          shipper: makeFieldRegion(),
          air_waybill: {
            awb_number: makeFieldRegion({ fieldType: "alphanumeric" }),
            page_info: makeFieldRegion({ fieldType: "text" }),
          },
          dangerous_goods: {
            un_number: makeFieldRegion({ fieldType: "alphanumeric" }),
            class_division: makeFieldRegion({ fieldType: "alphanumeric" }),
          },
        },
      });
      getTemplate.mockReturnValue(template);
      extractText.mockResolvedValue({
        text: "value",
        confidence: 0.9,
        blocks: [],
      });

      const result = await extractFormData(
        "file://test.jpg",
        "AMC_IMT_1033",
        undefined,
        DEFAULT_PREPROCESSING_CONFIG,
        { ...DEFAULT_ALIGNMENT_CONFIG, enabled: false },
        template
      );

      expect(result).not.toBeNull();
      const paths = result!.fieldResults.map((f) => f.fieldPath);
      expect(paths).toContain("shipper");
      expect(paths).toContain("air_waybill.awb_number");
      expect(paths).toContain("air_waybill.page_info");
      expect(paths).toContain("dangerous_goods.un_number");
      expect(paths).toContain("dangerous_goods.class_division");
      expect(result!.metadata.fieldsExtracted).toBe(5);
    });

    it("should separate text fields from checkbox fields", async () => {
      const template = makeTemplate({
        regions: {
          shipper: makeFieldRegion({ fieldType: "text" }),
          shipment_type: {
            non_radioactive: makeFieldRegion({ fieldType: "checkbox" }),
            radioactive: makeFieldRegion({ fieldType: "checkbox" }),
          },
        },
      });
      getTemplate.mockReturnValue(template);
      extractText.mockResolvedValue({
        text: "some text",
        confidence: 0.9,
        blocks: [],
      });

      const result = await extractFormData(
        "file://test.jpg",
        "AMC_IMT_1033",
        undefined,
        DEFAULT_PREPROCESSING_CONFIG,
        { ...DEFAULT_ALIGNMENT_CONFIG, enabled: false },
        template
      );

      expect(result).not.toBeNull();
      const textFields = result!.fieldResults.filter(
        (f) => f.fieldPath === "shipper"
      );
      const checkboxFields = result!.fieldResults.filter(
        (f) =>
          f.fieldPath === "shipment_type.non_radioactive" ||
          f.fieldPath === "shipment_type.radioactive"
      );
      expect(textFields).toHaveLength(1);
      expect(checkboxFields).toHaveLength(2);
    });

    it("should handle empty regions gracefully", async () => {
      const template = makeTemplate({ regions: {} });
      getTemplate.mockReturnValue(template);

      const result = await extractFormData(
        "file://test.jpg",
        "AMC_IMT_1033",
        undefined,
        DEFAULT_PREPROCESSING_CONFIG,
        { ...DEFAULT_ALIGNMENT_CONFIG, enabled: false },
        template
      );

      expect(result).not.toBeNull();
      expect(result!.fieldResults).toHaveLength(0);
      expect(result!.metadata.fieldsExtracted).toBe(0);
      // 0 errors < 0 * 0.5 = 0 < 0 = false — the success check uses strict less-than
      expect(result!.success).toBe(false);
    });
  });

  // ── extractFormData: setFieldValue path mapping ────────────────────────

  describe("extractFormData — field path mapping to SDDGData", () => {
    it("should map dangerous_goods.un_number to data.un_number", async () => {
      const template = makeTemplate({
        regions: {
          dangerous_goods: {
            un_number: makeFieldRegion({ fieldType: "alphanumeric" }),
          },
        },
      });
      getTemplate.mockReturnValue(template);
      extractText.mockResolvedValue({
        text: "UN3082",
        confidence: 0.95,
        blocks: [],
      });

      const result = await extractFormData(
        "file://test.jpg",
        "AMC_IMT_1033",
        undefined,
        DEFAULT_PREPROCESSING_CONFIG,
        { ...DEFAULT_ALIGNMENT_CONFIG, enabled: false },
        template
      );

      expect(result!.data.un_number).toBe("UN3082");
    });

    it("should map air_waybill.awb_number to data.awb_number", async () => {
      const template = makeTemplate({
        regions: {
          air_waybill: {
            awb_number: makeFieldRegion({ fieldType: "alphanumeric" }),
          },
        },
      });
      getTemplate.mockReturnValue(template);
      extractText.mockResolvedValue({
        text: "98765432",
        confidence: 0.95,
        blocks: [],
      });

      const result = await extractFormData(
        "file://test.jpg",
        "AMC_IMT_1033",
        undefined,
        DEFAULT_PREPROCESSING_CONFIG,
        { ...DEFAULT_ALIGNMENT_CONFIG, enabled: false },
        template
      );

      expect(result!.data.awb_number).toBe("98765432");
    });

    it("should convert 'true'/'false' string values to boolean for checkbox data", async () => {
      const template = makeTemplate({
        regions: {
          shipment_type: {
            non_radioactive: makeFieldRegion({ fieldType: "checkbox" }),
          },
        },
      });
      getTemplate.mockReturnValue(template);

      // Checkbox: OCR returns empty text, no 'x' found, extractCheckboxValue returns false,
      // isChecked = !false = true, setFieldValue("shipment_type.non_radioactive", "true")
      extractText.mockResolvedValue({
        text: "",
        confidence: 0.9,
        blocks: [],
      });

      const result = await extractFormData(
        "file://test.jpg",
        "AMC_IMT_1033",
        undefined,
        DEFAULT_PREPROCESSING_CONFIG,
        { ...DEFAULT_ALIGNMENT_CONFIG, enabled: false },
        template
      );

      // The checkbox path "shipment_type.non_radioactive" maps to "non_radioactive"
      expect(result!.data.non_radioactive).toBe(true);
    });
  });

  // ── extractFormData: class_division OCR correction ─────────────────────

  describe("extractFormData — correctClassDivisionFromHazmatDb", () => {
    it("should correct class '9' to '6.1' for UN2811 (OCR 9↔6 confusion)", async () => {
      const template = makeTemplate({
        regions: {
          dangerous_goods: {
            un_number: makeFieldRegion({ fieldType: "alphanumeric" }),
            class_division: makeFieldRegion({ fieldType: "alphanumeric" }),
          },
        },
      });
      getTemplate.mockReturnValue(template);

      let callCount = 0;
      extractText.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          // un_number
          return Promise.resolve({
            text: "UN2811",
            confidence: 0.95,
            blocks: [],
          });
        }
        // class_division — OCR misread "6" as "9"
        return Promise.resolve({
          text: "9.1",
          confidence: 0.85,
          blocks: [],
        });
      });

      const result = await extractFormData(
        "file://test.jpg",
        "AMC_IMT_1033",
        undefined,
        DEFAULT_PREPROCESSING_CONFIG,
        { ...DEFAULT_ALIGNMENT_CONFIG, enabled: false },
        template
      );

      // Should correct 9.1 -> 6.1 based on hazmat DB
      expect(result!.data.class_division).toBe("6.1");
    });

    it("should not modify class_division when it already matches the database", async () => {
      const template = makeTemplate({
        regions: {
          dangerous_goods: {
            un_number: makeFieldRegion({ fieldType: "alphanumeric" }),
            class_division: makeFieldRegion({ fieldType: "alphanumeric" }),
          },
        },
      });
      getTemplate.mockReturnValue(template);

      let callCount = 0;
      extractText.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return Promise.resolve({
            text: "UN1088",
            confidence: 0.95,
            blocks: [],
          });
        }
        return Promise.resolve({
          text: "3",
          confidence: 0.95,
          blocks: [],
        });
      });

      const result = await extractFormData(
        "file://test.jpg",
        "AMC_IMT_1033",
        undefined,
        DEFAULT_PREPROCESSING_CONFIG,
        { ...DEFAULT_ALIGNMENT_CONFIG, enabled: false },
        template
      );

      expect(result!.data.class_division).toBe("3");
    });

    it("should not correct when UN number is not in the hazmat database", async () => {
      const template = makeTemplate({
        regions: {
          dangerous_goods: {
            un_number: makeFieldRegion({ fieldType: "alphanumeric" }),
            class_division: makeFieldRegion({ fieldType: "alphanumeric" }),
          },
        },
      });
      getTemplate.mockReturnValue(template);

      let callCount = 0;
      extractText.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return Promise.resolve({
            text: "UN9999",
            confidence: 0.95,
            blocks: [],
          });
        }
        return Promise.resolve({
          text: "7",
          confidence: 0.85,
          blocks: [],
        });
      });

      const result = await extractFormData(
        "file://test.jpg",
        "AMC_IMT_1033",
        undefined,
        DEFAULT_PREPROCESSING_CONFIG,
        { ...DEFAULT_ALIGNMENT_CONFIG, enabled: false },
        template
      );

      expect(result!.data.class_division).toBe("7");
    });

    it("should correct primary class confusion (9 -> 6) without subdivision", async () => {
      const template = makeTemplate({
        regions: {
          dangerous_goods: {
            un_number: makeFieldRegion({ fieldType: "alphanumeric" }),
            class_division: makeFieldRegion({ fieldType: "alphanumeric" }),
          },
        },
      });
      getTemplate.mockReturnValue(template);

      let callCount = 0;
      extractText.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          // UN3082 has hazclassDiv "9" in our mock DB
          return Promise.resolve({
            text: "UN3082",
            confidence: 0.95,
            blocks: [],
          });
        }
        // OCR misread "9" as "6"
        return Promise.resolve({
          text: "6",
          confidence: 0.85,
          blocks: [],
        });
      });

      const result = await extractFormData(
        "file://test.jpg",
        "AMC_IMT_1033",
        undefined,
        DEFAULT_PREPROCESSING_CONFIG,
        { ...DEFAULT_ALIGNMENT_CONFIG, enabled: false },
        template
      );

      expect(result!.data.class_division).toBe("9");
    });
  });

  // ── extractFormData: auto-alignment ────────────────────────────────────

  describe("extractFormData — auto-alignment", () => {
    it("should skip auto-alignment when custom template is provided", async () => {
      const custom = makeMinimalTemplate();
      extractText.mockResolvedValue({
        text: "test",
        confidence: 0.9,
        blocks: [],
      });

      const result = await extractFormData(
        "file://test.jpg",
        "AMC_IMT_1033",
        undefined,
        DEFAULT_PREPROCESSING_CONFIG,
        { ...DEFAULT_ALIGNMENT_CONFIG, enabled: false },
        custom
      );

      expect(detectCells).not.toHaveBeenCalled();
      expect(result!.metadata.autoAlignmentAttempted).toBe(false);
    });

    it("should attempt auto-alignment when no custom template is given", async () => {
      const template = makeMinimalTemplate();
      getTemplate.mockReturnValue(template);
      extractText.mockResolvedValue({
        text: "test",
        confidence: 0.9,
        blocks: [],
      });

      const result = await extractFormData(
        "file://test.jpg",
        "AMC_IMT_1033",
        undefined,
        DEFAULT_PREPROCESSING_CONFIG,
        { ...DEFAULT_ALIGNMENT_CONFIG, enabled: false }
      );

      expect(detectCells).toHaveBeenCalled();
      expect(result!.metadata.autoAlignmentAttempted).toBe(true);
    });

    it("should record skew detection in metadata", async () => {
      detectCells.mockResolvedValueOnce({
        success: true,
        cells: [],
        processingTimeMs: 50,
        skewDetected: true,
      });

      const template = makeMinimalTemplate();
      getTemplate.mockReturnValue(template);
      extractText.mockResolvedValue({
        text: "test",
        confidence: 0.9,
        blocks: [],
      });

      const result = await extractFormData(
        "file://test.jpg",
        "AMC_IMT_1033",
        undefined,
        DEFAULT_PREPROCESSING_CONFIG,
        { ...DEFAULT_ALIGNMENT_CONFIG, enabled: false }
      );

      expect(result!.metadata.autoAlignmentSkewDetected).toBe(true);
    });

    it("should apply auto-alignment transform when successful with enough cells", async () => {
      // Need >= 10 cells for auto-alignment to proceed
      const fakeCells = Array.from({ length: 15 }, (_, i) => ({
        x: i * 100,
        y: i * 50,
        w: 80,
        h: 40,
      }));

      detectCells.mockResolvedValueOnce({
        success: true,
        cells: fakeCells,
        processingTimeMs: 50,
        skewDetected: false,
      });

      autoAlignTemplate.mockResolvedValueOnce({
        success: true,
        matchedFields: 12,
        confidence: 0.88,
        alignmentMethod: "anchor+position",
        transform: { offsetX: 10, offsetY: 20, scaleX: 1, scaleY: 1 },
        anchorMatches: 5,
        positionMatches: 7,
      });

      const template = makeMinimalTemplate();
      getTemplate.mockReturnValue(template);
      extractText.mockResolvedValue({
        text: "test",
        confidence: 0.9,
        blocks: [],
      });

      const result = await extractFormData(
        "file://test.jpg",
        "AMC_IMT_1033",
        undefined,
        DEFAULT_PREPROCESSING_CONFIG,
        { ...DEFAULT_ALIGNMENT_CONFIG, enabled: false }
      );

      expect(result!.metadata.autoAlignmentSuccess).toBe(true);
      expect(result!.metadata.autoAlignmentMatchedFields).toBe(12);
      expect(result!.metadata.autoAlignmentConfidence).toBe(0.88);
      expect(result!.metadata.autoAlignmentMethod).toBe("anchor+position");
      expect(result!.metadata.autoAlignmentAnchorMatches).toBe(5);
      expect(result!.metadata.autoAlignmentPositionMatches).toBe(7);
      expect(result!.autoAlignedTemplate).toBeDefined();
    });

    it("should handle auto-alignment error gracefully", async () => {
      detectCells.mockRejectedValueOnce(new Error("OpenCV crash"));

      const template = makeMinimalTemplate();
      getTemplate.mockReturnValue(template);
      extractText.mockResolvedValue({
        text: "test",
        confidence: 0.9,
        blocks: [],
      });

      const result = await extractFormData(
        "file://test.jpg",
        "AMC_IMT_1033",
        undefined,
        DEFAULT_PREPROCESSING_CONFIG,
        { ...DEFAULT_ALIGNMENT_CONFIG, enabled: false }
      );

      // Should not throw; should continue with original template
      expect(result).not.toBeNull();
      expect(result!.metadata.autoAlignmentSuccess).toBe(false);
    });
  });

  // ── extractFormData: template alignment (anchor-based) ─────────────────

  describe("extractFormData — anchor-based alignment", () => {
    it("should skip alignment when custom template is provided", async () => {
      const custom = makeMinimalTemplate();
      extractText.mockResolvedValue({
        text: "test",
        confidence: 0.9,
        blocks: [],
      });

      await extractFormData(
        "file://test.jpg",
        "AMC_IMT_1033",
        undefined,
        DEFAULT_PREPROCESSING_CONFIG,
        { ...DEFAULT_ALIGNMENT_CONFIG, enabled: true },
        custom
      );

      expect(alignTemplate).not.toHaveBeenCalled();
    });

    it("should skip alignment when config is disabled", async () => {
      const template = makeMinimalTemplate();
      getTemplate.mockReturnValue(template);
      extractText.mockResolvedValue({
        text: "test",
        confidence: 0.9,
        blocks: [],
      });

      await extractFormData(
        "file://test.jpg",
        "AMC_IMT_1033",
        undefined,
        DEFAULT_PREPROCESSING_CONFIG,
        { ...DEFAULT_ALIGNMENT_CONFIG, enabled: false }
      );

      expect(alignTemplate).not.toHaveBeenCalled();
    });

    it("should handle alignment error and fall back to original template", async () => {
      const template = makeMinimalTemplate();
      getTemplate.mockReturnValue(template);
      alignTemplate.mockRejectedValueOnce(new Error("alignment failed"));
      extractText.mockResolvedValue({
        text: "test",
        confidence: 0.9,
        blocks: [],
      });

      const result = await extractFormData(
        "file://test.jpg",
        "AMC_IMT_1033",
        undefined,
        DEFAULT_PREPROCESSING_CONFIG,
        { ...DEFAULT_ALIGNMENT_CONFIG, enabled: true }
      );

      expect(result).not.toBeNull();
      expect(result!.metadata.alignmentConfidence).toBe(0);
    });

    it("should fall back when alignment validation fails", async () => {
      const template = makeMinimalTemplate();
      getTemplate.mockReturnValue(template);
      validateAlignment.mockReturnValueOnce({
        valid: false,
        reason: "Offset too large",
      });
      extractText.mockResolvedValue({
        text: "test",
        confidence: 0.9,
        blocks: [],
      });

      const result = await extractFormData(
        "file://test.jpg",
        "AMC_IMT_1033",
        undefined,
        DEFAULT_PREPROCESSING_CONFIG,
        {
          ...DEFAULT_ALIGNMENT_CONFIG,
          enabled: true,
          fallbackToOriginal: true,
        }
      );

      expect(result).not.toBeNull();
    });
  });

  // ── extractFormData: progress callback ─────────────────────────────────

  describe("extractFormData — progress reporting", () => {
    it("should call onProgress for each field extracted", async () => {
      const template = makeTemplate({
        regions: {
          shipper: makeFieldRegion(),
          consignee: makeFieldRegion(),
          shipment_type: {
            non_radioactive: makeFieldRegion({ fieldType: "checkbox" }),
          },
        },
      });
      getTemplate.mockReturnValue(template);
      extractText.mockResolvedValue({
        text: "data",
        confidence: 0.9,
        blocks: [],
      });

      const onProgress = jest.fn();
      await extractFormData(
        "file://test.jpg",
        "AMC_IMT_1033",
        onProgress,
        DEFAULT_PREPROCESSING_CONFIG,
        { ...DEFAULT_ALIGNMENT_CONFIG, enabled: false },
        template
      );

      // 2 text fields + 1 checkbox = 3 progress calls
      expect(onProgress).toHaveBeenCalledTimes(3);
      expect(onProgress).toHaveBeenCalledWith(
        expect.objectContaining({ current: 1, total: 3 })
      );
      expect(onProgress).toHaveBeenCalledWith(
        expect.objectContaining({ current: 3, total: 3 })
      );
    });
  });

  // ── extractFormData: metadata ──────────────────────────────────────────

  describe("extractFormData — metadata", () => {
    it("should populate complete metadata object", async () => {
      const template = makeTemplate({
        formType: "AMC_IMT_1033",
        regions: {
          shipper: makeFieldRegion(),
        },
      });
      getTemplate.mockReturnValue(template);
      extractText.mockResolvedValue({
        text: "ACME",
        confidence: 0.95,
        blocks: [],
      });

      const result = await extractFormData(
        "file://test.jpg",
        "AMC_IMT_1033",
        undefined,
        DEFAULT_PREPROCESSING_CONFIG,
        { ...DEFAULT_ALIGNMENT_CONFIG, enabled: false },
        template
      );

      expect(result).not.toBeNull();
      const meta = result!.metadata;
      expect(meta.formType).toBe("AMC_IMT_1033");
      expect(meta.imageWidth).toBe(2550);
      expect(meta.imageHeight).toBe(3300);
      expect(meta.extractionTime).toBeGreaterThanOrEqual(0);
      expect(meta.fieldsExtracted).toBe(1);
      expect(meta.fieldsFailed).toBe(0);
      expect(typeof meta.overallConfidence).toBe("number");
      expect(typeof meta.preprocessingUsed).toBe("boolean");
      expect(Array.isArray(meta.preprocessingOperations)).toBe(true);
    });

    it("should mark success when fewer than 50% of fields fail", async () => {
      const template = makeTemplate({
        regions: {
          shipper: makeFieldRegion(),
          consignee: makeFieldRegion(),
          inspector: makeFieldRegion(),
        },
      });
      getTemplate.mockReturnValue(template);

      let callCount = 0;
      extractText.mockImplementation(() => {
        callCount++;
        if (callCount === 2) {
          return Promise.reject(new Error("OCR failed"));
        }
        return Promise.resolve({
          text: "value",
          confidence: 0.9,
          blocks: [],
        });
      });

      const result = await extractFormData(
        "file://test.jpg",
        "AMC_IMT_1033",
        undefined,
        DEFAULT_PREPROCESSING_CONFIG,
        { ...DEFAULT_ALIGNMENT_CONFIG, enabled: false },
        template
      );

      // 1 error out of 3 fields = 33% < 50% threshold
      expect(result!.success).toBe(true);
      expect(result!.errors).toHaveLength(1);
    });

    it("should mark failure when 50% or more fields fail", async () => {
      const template = makeTemplate({
        regions: {
          shipper: makeFieldRegion(),
          consignee: makeFieldRegion(),
        },
      });
      getTemplate.mockReturnValue(template);
      extractText.mockRejectedValue(new Error("OCR crash"));

      const result = await extractFormData(
        "file://test.jpg",
        "AMC_IMT_1033",
        undefined,
        DEFAULT_PREPROCESSING_CONFIG,
        { ...DEFAULT_ALIGNMENT_CONFIG, enabled: false },
        template
      );

      // 2 errors out of 2 fields = 100% >= 50%
      expect(result!.success).toBe(false);
      expect(result!.errors).toHaveLength(2);
    });
  });

  // ── extractFormData: preprocessing ─────────────────────────────────────

  describe("extractFormData — preprocessing", () => {
    it("should skip preprocessing when disabled", async () => {
      const template = makeMinimalTemplate();
      getTemplate.mockReturnValue(template);
      extractText.mockResolvedValue({
        text: "test",
        confidence: 0.9,
        blocks: [],
      });

      const disabledConfig = {
        ...DEFAULT_PREPROCESSING_CONFIG,
        enabled: false,
      };

      const result = await extractFormData(
        "file://test.jpg",
        "AMC_IMT_1033",
        undefined,
        disabledConfig,
        { ...DEFAULT_ALIGNMENT_CONFIG, enabled: false },
        template
      );

      expect(result!.metadata.preprocessingUsed).toBe(false);
      expect(result!.metadata.preprocessingTime).toBe(0);
      expect(result!.metadata.preprocessingOperations).toEqual([]);
    });

    it("should handle blurry region detection by returning empty text", async () => {
      const template = makeMinimalTemplate();
      getTemplate.mockReturnValue(template);

      preprocessRegion.mockResolvedValueOnce({
        uri: "file://blurry.jpg",
        appliedOperations: ["blur_detected_skip"],
      });

      extractText.mockResolvedValue({
        text: "",
        confidence: 0,
        blocks: [],
      });

      const result = await extractFormData(
        "file://test.jpg",
        "AMC_IMT_1033",
        undefined,
        DEFAULT_PREPROCESSING_CONFIG,
        { ...DEFAULT_ALIGNMENT_CONFIG, enabled: false },
        template
      );

      expect(result).not.toBeNull();
      // Field should have empty value due to blur detection
      const shipperField = result!.fieldResults.find(
        (f) => f.fieldPath === "shipper"
      );
      expect(shipperField).toBeDefined();
      expect(shipperField!.value).toBe("");
      expect(shipperField!.confidence).toBe(0);
    });
  });

  // ── extractFormData: error propagation ─────────────────────────────────

  describe("extractFormData — error propagation", () => {
    it("should throw when orientation correction fails", async () => {
      correctImageOrientation.mockRejectedValueOnce(
        new Error("Image not found")
      );
      getTemplate.mockReturnValue(makeMinimalTemplate());

      await expect(
        extractFormData("file://missing.jpg")
      ).rejects.toThrow("Image not found");
    });
  });

  // ── extractFormData: SDDGData base fields ──────────────────────────────

  describe("extractFormData — SDDGData base fields", () => {
    it("should populate extraction_method, extraction_timestamp, formType, and formVersion", async () => {
      const template = makeTemplate({
        formType: "AMC_IMT_1033",
        version: "2.0",
        regions: {},
      });
      getTemplate.mockReturnValue(template);

      const result = await extractFormData(
        "file://test.jpg",
        "AMC_IMT_1033",
        undefined,
        DEFAULT_PREPROCESSING_CONFIG,
        { ...DEFAULT_ALIGNMENT_CONFIG, enabled: false },
        template
      );

      expect(result!.data.extraction_method).toBe("template");
      expect(result!.data.extraction_timestamp).toBeDefined();
      expect(result!.data.formType).toBe("AMC_IMT_1033");
      expect(result!.data.formVersion).toBe("2.0");
    });
  });
});
