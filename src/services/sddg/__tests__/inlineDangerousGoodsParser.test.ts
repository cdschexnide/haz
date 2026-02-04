import {
  parseInlineDangerousGoods,
  detectInlineVariant,
  extractInlineDangerousGoods,
} from "../inlineDangerousGoodsParser";
import { TextBlock, AnchorMatch } from "../anchorTypes";

// Mock getTableColumnAnchors — detectInlineVariant imports it to get field IDs
jest.mock("../anchorConfig", () => ({
  getTableColumnAnchors: () => [
    { fieldId: "un_number", patternType: "table-column-header" },
    { fieldId: "proper_shipping_name", patternType: "table-column-header" },
    { fieldId: "class_division", patternType: "table-column-header" },
    { fieldId: "packing_group", patternType: "table-column-header" },
    { fieldId: "quantity_type_packing", patternType: "table-column-header" },
    { fieldId: "packing_inst", patternType: "table-column-header" },
    { fieldId: "authorization", patternType: "table-column-header" },
  ],
}));

describe("parseInlineDangerousGoods", () => {
  it("should parse a standard inline dangerous goods string", () => {
    const input =
      "UN1956,COMPRESSED GAS, N.O.S. (PENTAFLUOROETHANE, NITROGEN),2.2//\n" +
      "1 FIBREBOARD BOX X 2 KG//A6.5.";

    const result = parseInlineDangerousGoods(input);

    expect(result.un_number).toBe("UN1956");
    expect(result.proper_shipping_name).toBe(
      "COMPRESSED GAS, N.O.S. (PENTAFLUOROETHANE, NITROGEN)"
    );
    expect(result.class_division).toBe("2.2");
    expect(result.packing_group).toBeUndefined();
    expect(result.quantity_packing).toBe("1 FIBREBOARD BOX X 2 KG");
    expect(result.packing_inst).toBe("A6.5");
  });

  it("should parse with a packing group present", () => {
    const input =
      "UN0106,FUZES DETONATING,1.1B,II//\n" +
      "1 Wooden Box x 0.43488 Kg NEW//A5.24";

    const result = parseInlineDangerousGoods(input);

    expect(result.un_number).toBe("UN0106");
    expect(result.proper_shipping_name).toBe("FUZES DETONATING");
    expect(result.class_division).toBe("1.1B");
    expect(result.packing_group).toBe("II");
    expect(result.quantity_packing).toBe("1 Wooden Box x 0.43488 Kg NEW");
    expect(result.packing_inst).toBe("A5.24");
  });

  it("should parse with subsidiary risk in parentheses", () => {
    const input =
      "UN2924,FLAMMABLE LIQUID CORROSIVE N.O.S.,3(8),II//\n" +
      "1 DRUM X 50 KG//A3.3";

    const result = parseInlineDangerousGoods(input);

    expect(result.un_number).toBe("UN2924");
    expect(result.proper_shipping_name).toBe(
      "FLAMMABLE LIQUID CORROSIVE N.O.S."
    );
    expect(result.class_division).toBe("3");
    expect(result.subsidiary_risk).toBe("(8)");
    expect(result.packing_group).toBe("II");
    expect(result.quantity_packing).toBe("1 DRUM X 50 KG");
    expect(result.packing_inst).toBe("A3.3");
  });

  it("should parse class 1.4S compatibility group", () => {
    const input =
      "UN0323,CARTRIDGES POWER DEVICE,1.4S,II//\n" +
      "1 BOX X 10 KG//A1.3";

    const result = parseInlineDangerousGoods(input);

    expect(result.un_number).toBe("UN0323");
    expect(result.proper_shipping_name).toBe("CARTRIDGES POWER DEVICE");
    expect(result.class_division).toBe("1.4S");
    expect(result.packing_group).toBe("II");
  });

  it("should handle ID number prefix", () => {
    const input = "ID8000,CONSUMER COMMODITY,9//\n1 BOX X 5 KG//A200";

    const result = parseInlineDangerousGoods(input);

    expect(result.un_number).toBe("ID8000");
    expect(result.proper_shipping_name).toBe("CONSUMER COMMODITY");
    expect(result.class_division).toBe("9");
  });

  it("should handle OCR errors: O instead of 0 in UN number", () => {
    const input =
      "UNO106,FUZES DETONATING,1.1B//\n" +
      "1 Wooden Box x 0.43488 Kg//A5.24";

    const result = parseInlineDangerousGoods(input);

    expect(result.un_number).toBe("UN0106");
  });

  it("should return empty object for empty or unrecognizable input", () => {
    expect(parseInlineDangerousGoods("")).toEqual({});
    expect(parseInlineDangerousGoods("random text")).toEqual({});
  });

  it("should handle trailing period on packing instruction", () => {
    const input =
      "UN1956,COMPRESSED GAS N.O.S.,2.2//1 BOX X 2 KG//A6.5.";

    const result = parseInlineDangerousGoods(input);

    expect(result.packing_inst).toBe("A6.5");
  });

  it("should handle single-line format (no line break)", () => {
    const input =
      "UN1956,COMPRESSED GAS N.O.S.,2.2//1 BOX X 2 KG//A6.5";

    const result = parseInlineDangerousGoods(input);

    expect(result.un_number).toBe("UN1956");
    expect(result.proper_shipping_name).toBe("COMPRESSED GAS N.O.S.");
    expect(result.class_division).toBe("2.2");
    expect(result.quantity_packing).toBe("1 BOX X 2 KG");
    expect(result.packing_inst).toBe("A6.5");
  });

  it("should parse subsidiary risk as separate comma field", () => {
    const input =
      "UN1072,OXYGEN, COMPRESSED,2.2,(5.1)//\n" +
      "1 STEEL CYLINDER (DOT-3AA) X 2.72 KG//A6.5.//OVERPACK USED";

    const result = parseInlineDangerousGoods(input);

    expect(result.un_number).toBe("UN1072");
    expect(result.proper_shipping_name).toBe("OXYGEN, COMPRESSED");
    expect(result.class_division).toBe("2.2");
    expect(result.subsidiary_risk).toBe("(5.1)");
    expect(result.packing_group).toBeUndefined();
    expect(result.quantity_packing).toBe(
      "1 STEEL CYLINDER (DOT-3AA) X 2.72 KG OVERPACK USED"
    );
    expect(result.packing_inst).toBe("A6.5");
  });

  it("should handle 4+ sections with OVERPACK appended to quantity", () => {
    const input =
      "UN1956,COMPRESSED GAS N.O.S.,2.2//\n" +
      "1 BOX X 2 KG//A6.5//OVERPACK USED";

    const result = parseInlineDangerousGoods(input);

    expect(result.quantity_packing).toBe("1 BOX X 2 KG OVERPACK USED");
    expect(result.packing_inst).toBe("A6.5");
  });

  it("should handle subsidiary risk with packing group", () => {
    const input =
      "UN2924,FLAMMABLE LIQUID CORROSIVE N.O.S.,3,(8),II//\n" +
      "1 DRUM X 50 KG//A3.3";

    const result = parseInlineDangerousGoods(input);

    expect(result.un_number).toBe("UN2924");
    expect(result.proper_shipping_name).toBe(
      "FLAMMABLE LIQUID CORROSIVE N.O.S."
    );
    expect(result.class_division).toBe("3");
    expect(result.subsidiary_risk).toBe("(8)");
    expect(result.packing_group).toBe("II");
    expect(result.quantity_packing).toBe("1 DRUM X 50 KG");
    expect(result.packing_inst).toBe("A3.3");
  });

  it("should still handle subsidiary risk glued to class (backward compat)", () => {
    const input =
      "UN2924,FLAMMABLE LIQUID CORROSIVE N.O.S.,3(8),II//\n" +
      "1 DRUM X 50 KG//A3.3";

    const result = parseInlineDangerousGoods(input);

    expect(result.class_division).toBe("3");
    expect(result.subsidiary_risk).toBe("(8)");
    expect(result.packing_group).toBe("II");
  });

  it("should handle OCR whitespace around subsidiary risk parens", () => {
    const input =
      "UN1072,OXYGEN COMPRESSED,2.2, ( 5.1 )//\n" +
      "1 CYLINDER X 2.72 KG//A6.5";

    const result = parseInlineDangerousGoods(input);

    expect(result.class_division).toBe("2.2");
    expect(result.subsidiary_risk).toBe("(5.1)");
    expect(result.proper_shipping_name).toBe("OXYGEN COMPRESSED");
  });

  it("should handle OCR whitespace in packing instruction (A6 .5.)", () => {
    const input =
      "UN1072,OXYGEN, COMPRESSED,2.2,(5.1)//\n" +
      "1 STEEL CYLINDER (DOT-3AA) X 2.72 KG//A6 .5.//OVERPACK USED";

    const result = parseInlineDangerousGoods(input);

    expect(result.packing_inst).toBe("A6.5");
    expect(result.quantity_packing).toBe(
      "1 STEEL CYLINDER (DOT-3AA) X 2.72 KG OVERPACK USED"
    );
  });

  it("should handle OCR space between class and subsidiary", () => {
    const input =
      "UN1072,OXYGEN COMPRESSED,2.2 (5.1)//\n" +
      "1 CYLINDER X 2.72 KG//A6.5";

    const result = parseInlineDangerousGoods(input);

    expect(result.class_division).toBe("2.2");
    expect(result.subsidiary_risk).toBe("(5.1)");
  });
});

describe("detectInlineVariant", () => {
  it("should return true when all 3 signals present (no headers, descriptor, //)", () => {
    const anchors = new Map<string, AnchorMatch>([
      ["shipper", { fieldId: "shipper", boundingBox: { x: 0, y: 0, width: 100, height: 20 }, matchedPattern: "SHIPPER", confidence: 1 }],
      ["additional_handling", { fieldId: "additional_handling", boundingBox: { x: 0, y: 800, width: 200, height: 20 }, matchedPattern: "ADDITIONAL HANDLING", confidence: 1 }],
    ]);

    const textBlocks: TextBlock[] = [
      { text: "UN Number or Identification Number, proper shipping name, Class or Division", boundingBox: { x: 50, y: 400, width: 500, height: 20 }, confidence: 1 },
      { text: "UN1956,COMPRESSED GAS,2.2//1 BOX//A6.5", boundingBox: { x: 50, y: 450, width: 400, height: 20 }, confidence: 1 },
    ];

    expect(detectInlineVariant(anchors, textBlocks)).toBe(true);
  });

  it("should return true with 2 of 3 signals (no headers + // but no descriptor)", () => {
    const anchors = new Map<string, AnchorMatch>();
    const textBlocks: TextBlock[] = [
      { text: "UN1956,COMPRESSED GAS,2.2//1 BOX//A6.5", boundingBox: { x: 50, y: 450, width: 400, height: 20 }, confidence: 1 },
    ];

    expect(detectInlineVariant(anchors, textBlocks)).toBe(true);
  });

  it("should return true with 2 of 3 signals (descriptor + // but table headers present)", () => {
    const anchors = new Map<string, AnchorMatch>([
      ["un_number", { fieldId: "un_number", boundingBox: { x: 50, y: 300, width: 80, height: 20 }, matchedPattern: "UN or ID NO", confidence: 1 }],
      ["proper_shipping_name", { fieldId: "proper_shipping_name", boundingBox: { x: 150, y: 300, width: 150, height: 20 }, matchedPattern: "PROPER SHIPPING NAME", confidence: 1 }],
    ]);

    const textBlocks: TextBlock[] = [
      { text: "UN Number or Identification Number, proper shipping name, Class or Division", boundingBox: { x: 50, y: 400, width: 500, height: 20 }, confidence: 1 },
      { text: "UN1956,COMPRESSED GAS,2.2//1 BOX//A6.5", boundingBox: { x: 50, y: 450, width: 400, height: 20 }, confidence: 1 },
    ];

    expect(detectInlineVariant(anchors, textBlocks)).toBe(true);
  });

  it("should return false when table column headers are found and no other signals", () => {
    const anchors = new Map<string, AnchorMatch>([
      ["un_number", { fieldId: "un_number", boundingBox: { x: 50, y: 300, width: 80, height: 20 }, matchedPattern: "UN or ID NO", confidence: 1 }],
      ["proper_shipping_name", { fieldId: "proper_shipping_name", boundingBox: { x: 150, y: 300, width: 150, height: 20 }, matchedPattern: "PROPER SHIPPING NAME", confidence: 1 }],
      ["class_division", { fieldId: "class_division", boundingBox: { x: 320, y: 300, width: 100, height: 20 }, matchedPattern: "CLASS or DIVISION", confidence: 1 }],
    ]);

    const textBlocks: TextBlock[] = [
      { text: "UN0106 FUZES DETONATING 1.1B", boundingBox: { x: 50, y: 400, width: 300, height: 20 }, confidence: 1 },
    ];

    expect(detectInlineVariant(anchors, textBlocks)).toBe(false);
  });

  it("should return false with only 1 signal (no headers but nothing else)", () => {
    const anchors = new Map<string, AnchorMatch>();
    const textBlocks: TextBlock[] = [
      { text: "Some random text without any signals", boundingBox: { x: 50, y: 400, width: 200, height: 20 }, confidence: 1 },
    ];

    expect(detectInlineVariant(anchors, textBlocks)).toBe(false);
  });

  it("should handle relaxed descriptor matching (2 of 3 phrases)", () => {
    const anchors = new Map<string, AnchorMatch>();
    // Only 2 of the 3 descriptor phrases present (OCR missed one)
    const textBlocks: TextBlock[] = [
      { text: "UN Number or Identification Number, Class or Division", boundingBox: { x: 50, y: 400, width: 500, height: 20 }, confidence: 1 },
      { text: "UN1956,COMPRESSED GAS,2.2//1 BOX//A6.5", boundingBox: { x: 50, y: 450, width: 400, height: 20 }, confidence: 1 },
    ];

    expect(detectInlineVariant(anchors, textBlocks)).toBe(true);
  });
});

describe("extractInlineDangerousGoods", () => {
  it("should extract dangerous goods from text blocks between section boundaries", () => {
    const anchors = new Map<string, AnchorMatch>([
      ["nature_quantity_header", { fieldId: "nature_quantity_header", boundingBox: { x: 50, y: 350, width: 300, height: 20 }, matchedPattern: "NATURE AND QUANTITY", confidence: 1 }],
      ["additional_handling", { fieldId: "additional_handling", boundingBox: { x: 50, y: 600, width: 200, height: 20 }, matchedPattern: "ADDITIONAL HANDLING", confidence: 1 }],
    ]);

    const textBlocks: TextBlock[] = [
      // Section header
      { text: "NATURE AND QUANTITY OF DANGEROUS GOODS", boundingBox: { x: 50, y: 350, width: 300, height: 20 }, confidence: 1 },
      // Descriptive paragraph (should be stripped)
      { text: "UN Number or Identification Number, proper shipping name, Class or Division", boundingBox: { x: 50, y: 380, width: 500, height: 15 }, confidence: 1 },
      { text: "(subsidiary hazard), packing group (if required), and all", boundingBox: { x: 50, y: 398, width: 400, height: 15 }, confidence: 1 },
      { text: "other required information.", boundingBox: { x: 50, y: 416, width: 200, height: 15 }, confidence: 1 },
      // Actual data
      { text: "UN1956,COMPRESSED GAS, N.O.S. (PENTAFLUOROETHANE, NITROGEN),2.2//", boundingBox: { x: 50, y: 450, width: 500, height: 20 }, confidence: 1 },
      { text: "1 FIBREBOARD BOX X 2 KG//A6.5.", boundingBox: { x: 50, y: 475, width: 300, height: 20 }, confidence: 1 },
      // Below boundary (should not be included)
      { text: "Additional Handling Information", boundingBox: { x: 50, y: 600, width: 200, height: 20 }, confidence: 1 },
    ];

    const result = extractInlineDangerousGoods(textBlocks, anchors);

    expect(result.un_number).toBe("UN1956");
    expect(result.proper_shipping_name).toBe(
      "COMPRESSED GAS, N.O.S. (PENTAFLUOROETHANE, NITROGEN)"
    );
    expect(result.class_division).toBe("2.2");
    expect(result.quantity_packing).toBe("1 FIBREBOARD BOX X 2 KG");
    expect(result.packing_inst).toBe("A6.5");
  });

  it("should find section header from textBlocks when anchor not in map", () => {
    // The "nature_quantity_header" may not be a named anchor — test fallback
    const anchors = new Map<string, AnchorMatch>([
      ["additional_handling", { fieldId: "additional_handling", boundingBox: { x: 50, y: 600, width: 200, height: 20 }, matchedPattern: "ADDITIONAL HANDLING", confidence: 1 }],
    ]);

    const textBlocks: TextBlock[] = [
      { text: "NATURE AND QUANTITY OF DANGEROUS GOODS", boundingBox: { x: 50, y: 350, width: 300, height: 20 }, confidence: 1 },
      { text: "UN Number or Identification Number, proper shipping name, Class or Division", boundingBox: { x: 50, y: 380, width: 500, height: 15 }, confidence: 1 },
      { text: "UN1956,COMPRESSED GAS N.O.S.,2.2//1 BOX X 2 KG//A6.5", boundingBox: { x: 50, y: 450, width: 500, height: 20 }, confidence: 1 },
      { text: "Additional Handling Information", boundingBox: { x: 50, y: 600, width: 200, height: 20 }, confidence: 1 },
    ];

    const result = extractInlineDangerousGoods(textBlocks, anchors);

    expect(result.un_number).toBe("UN1956");
  });
});

describe("integration: inline variant fields merge into results map", () => {
  it("should produce ExtractionResult entries for all 7 table fields", () => {
    // This tests the shape of data that anchorBasedExtractor will merge
    const textBlocks: TextBlock[] = [
      { text: "NATURE AND QUANTITY OF DANGEROUS GOODS", boundingBox: { x: 50, y: 350, width: 300, height: 20 }, confidence: 1 },
      { text: "UN Number or Identification Number, proper shipping name, Class or Division", boundingBox: { x: 50, y: 380, width: 500, height: 15 }, confidence: 1 },
      { text: "UN1956,COMPRESSED GAS, N.O.S. (PENTAFLUOROETHANE, NITROGEN),2.2//", boundingBox: { x: 50, y: 450, width: 500, height: 20 }, confidence: 1 },
      { text: "1 FIBREBOARD BOX X 2 KG//A6.5.", boundingBox: { x: 50, y: 475, width: 300, height: 20 }, confidence: 1 },
      { text: "Additional Handling Information", boundingBox: { x: 50, y: 600, width: 200, height: 20 }, confidence: 1 },
    ];

    const anchors = new Map<string, AnchorMatch>([
      ["additional_handling", { fieldId: "additional_handling", boundingBox: { x: 50, y: 600, width: 200, height: 20 }, matchedPattern: "ADDITIONAL HANDLING", confidence: 1 }],
    ]);

    const parsed = extractInlineDangerousGoods(textBlocks, anchors);

    // Verify all expected fields are present
    expect(parsed.un_number).toBeDefined();
    expect(parsed.proper_shipping_name).toBeDefined();
    expect(parsed.class_division).toBeDefined();
    expect(parsed.quantity_packing).toBeDefined();
    expect(parsed.packing_inst).toBeDefined();
    // packing_group and authorization may be undefined — that's valid
  });
});
