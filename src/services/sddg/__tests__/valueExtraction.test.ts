import {
  extractValueFromRegion,
  extractInlinePatternValue,
  extractCheckboxValue,
  applyPostProcessing,
  extractAirportDestinationFallback,
} from "../valueExtraction";
import { TextBlock, ValueRegion, BoundingBox } from "../anchorTypes";

describe("valueExtraction", () => {
  describe("extractValueFromRegion", () => {
    const textBlocks: TextBlock[] = [
      { text: "FY4484", boundingBox: { x: 60, y: 130, width: 80, height: 20 }, confidence: 1.0 },
      { text: "BLDG 1757 VANDENBERG AVE", boundingBox: { x: 60, y: 160, width: 250, height: 20 }, confidence: 1.0 },
      { text: "MCGUIRE AFB NJ 08641", boundingBox: { x: 60, y: 190, width: 200, height: 20 }, confidence: 1.0 },
      // Outside region
      { text: "CONSIGNEE", boundingBox: { x: 50, y: 400, width: 120, height: 20 }, confidence: 1.0 },
    ];

    it("should extract text blocks within region", () => {
      const region: ValueRegion = {
        fieldId: "shipper",
        boundingBox: { x: 50, y: 120, width: 300, height: 200 },
        anchorMatch: { fieldId: "shipper", boundingBox: { x: 50, y: 100, width: 100, height: 20 }, matchedPattern: "SHIPPER", confidence: 1.0 }
      };

      const value = extractValueFromRegion(textBlocks, region);

      expect(value).toContain("FY4484");
      expect(value).toContain("BLDG 1757 VANDENBERG AVE");
      expect(value).toContain("MCGUIRE AFB NJ 08641");
      expect(value).not.toContain("CONSIGNEE");
    });

    it("should return empty string if no blocks in region", () => {
      const region: ValueRegion = {
        fieldId: "empty",
        boundingBox: { x: 1000, y: 1000, width: 100, height: 100 },
        anchorMatch: { fieldId: "empty", boundingBox: { x: 0, y: 0, width: 0, height: 0 }, matchedPattern: "", confidence: 0 }
      };

      const value = extractValueFromRegion(textBlocks, region);
      expect(value).toBe("");
    });
  });

  describe("extractInlinePatternValue", () => {
    const textBlocks: TextBlock[] = [
      { text: "PAGE 1 OF 1 PAGES", boundingBox: { x: 500, y: 150, width: 150, height: 20 }, confidence: 1.0 },
    ];

    it("should extract inline pattern matches", () => {
      const regex = "PAGE\\s*(\\d+)\\s*OF\\s*(\\d+)\\s*PAGES?";
      const value = extractInlinePatternValue(textBlocks, regex);

      expect(value).toBe("PAGE 1 OF 1 PAGES");
    });

    it("should return empty string if pattern not found", () => {
      const value = extractInlinePatternValue(textBlocks, "NOTFOUND\\d+");
      expect(value).toBe("");
    });
  });

  describe("extractCheckboxValue", () => {
    it("should detect which option is NOT X'd out", () => {
      const textBlocks: TextBlock[] = [
        { text: "PASSENGER AND CARGO AIRCRAFT", boundingBox: { x: 100, y: 400, width: 200, height: 20 }, confidence: 1.0 },
        { text: "XXXXXXXXXX", boundingBox: { x: 320, y: 400, width: 100, height: 20 }, confidence: 1.0 },
        { text: "CARGO AIRCRAFT ONLY", boundingBox: { x: 100, y: 440, width: 150, height: 20 }, confidence: 1.0 },
      ];

      const options = [
        { label: "PASSENGER AND CARGO AIRCRAFT", value: "passenger_and_cargo" },
        { label: "CARGO AIRCRAFT ONLY", value: "cargo_only" },
      ];

      const value = extractCheckboxValue(textBlocks, options);
      expect(value).toBe("cargo_only"); // PASSENGER option is X'd out
    });

    it("should detect X'd option from garbled OCR — aircraft type (3-line split)", () => {
      // Real OCR: PASSENGER/AND CARGO/AIRCRAFT split across 3 lines (clean)
      // CARGO AIRCRAFT ONLY garbled as "CARC0X" due to X marks
      const textBlocks: TextBlock[] = [
        { text: "PASSENGER", boundingBox: { x: 80, y: 488, width: 100, height: 15 }, confidence: 1.0 },
        { text: "AND CARGO", boundingBox: { x: 78, y: 499, width: 100, height: 15 }, confidence: 1.0 },
        { text: "AIRCRAFT", boundingBox: { x: 78, y: 512, width: 90, height: 15 }, confidence: 1.0 },
        { text: "CARC0X", boundingBox: { x: 205, y: 494, width: 80, height: 15 }, confidence: 1.0 },
      ];

      const options = [
        { label: "PASSENGER AND CARGO AIRCRAFT", value: "passenger_and_cargo" },
        { label: "CARGO AIRCRAFT ONLY", value: "cargo_only" },
      ];

      const value = extractCheckboxValue(textBlocks, options);
      expect(value).toBe("passenger_and_cargo");
    });

    it("should detect X'd option from garbled OCR — shipment type (single block)", () => {
      // Real OCR: "NON-RADIOACTIVE" is clean, "RADIOACTIVE" garbled as "RAOUDBCOOKX"
      // Both merged into single block: "NON-RADIOACTIVE RAOUDBCOOKX"
      const textBlocks: TextBlock[] = [
        { text: "NON-RADIOACTIVE RAOUDBCOOKX", boundingBox: { x: 545, y: 574, width: 300, height: 15 }, confidence: 1.0 },
      ];

      const options = [
        { label: "NON-RADIOACTIVE", value: "non_radioactive" },
        { label: "RADIOACTIVE", value: "radioactive" },
      ];

      const value = extractCheckboxValue(textBlocks, options);
      expect(value).toBe("non_radioactive");
    });

    it("should detect X'd option from garbled OCR — aircraft type (2-line split)", () => {
      // Variation: "PASSENGER AND" / "CARGO AIRCRAFT" on left, garbled on right
      const textBlocks: TextBlock[] = [
        { text: "PASSENGER AND", boundingBox: { x: 80, y: 488, width: 120, height: 15 }, confidence: 1.0 },
        { text: "CARGO AIRCRAFT", boundingBox: { x: 80, y: 505, width: 120, height: 15 }, confidence: 1.0 },
        { text: "CARGOX", boundingBox: { x: 210, y: 488, width: 90, height: 15 }, confidence: 1.0 },
        { text: "AIRCRAFTXX", boundingBox: { x: 210, y: 500, width: 90, height: 15 }, confidence: 1.0 },
        { text: "ONLXX", boundingBox: { x: 210, y: 512, width: 70, height: 15 }, confidence: 1.0 },
      ];

      const options = [
        { label: "PASSENGER AND CARGO AIRCRAFT", value: "passenger_and_cargo" },
        { label: "CARGO AIRCRAFT ONLY", value: "cargo_only" },
      ];

      const value = extractCheckboxValue(textBlocks, options);
      expect(value).toBe("passenger_and_cargo");
    });

    it("should still detect clean X blocks (regression)", () => {
      // Image 2 scenario: clean "XXXX" block + clean label text
      const textBlocks: TextBlock[] = [
        { text: "XXXX", boundingBox: { x: 80, y: 490, width: 80, height: 20 }, confidence: 1.0 },
        { text: "CARGO AIRCRAFT", boundingBox: { x: 210, y: 488, width: 120, height: 15 }, confidence: 1.0 },
        { text: "ONLY", boundingBox: { x: 210, y: 505, width: 50, height: 15 }, confidence: 1.0 },
      ];

      const options = [
        { label: "PASSENGER AND CARGO AIRCRAFT", value: "passenger_and_cargo" },
        { label: "CARGO AIRCRAFT ONLY", value: "cargo_only" },
      ];

      const value = extractCheckboxValue(textBlocks, options);
      expect(value).toBe("cargo_only");
    });

    it("should handle no text blocks found at all", () => {
      const textBlocks: TextBlock[] = [];
      const options = [
        { label: "NON-RADIOACTIVE", value: "non_radioactive" },
        { label: "RADIOACTIVE", value: "radioactive" },
      ];

      const value = extractCheckboxValue(textBlocks, options);
      expect(value).toBe("non_radioactive"); // Default to first option
    });
  });

  describe("applyPostProcessing", () => {
    it("should remove label prefix", () => {
      const result = applyPostProcessing("SHIPPER FY4484\nBLDG 1757", ["remove_label_prefix", "trim"]);
      expect(result).toBe("FY4484\nBLDG 1757");
    });

    it("should remove TCN prefix", () => {
      const result = applyPostProcessing("TCN: W25G1R43546002HXX", ["remove_tcn_prefix"]);
      expect(result).toBe("W25G1R43546002HXX");
    });

    it("should remove spaces", () => {
      const result = applyPostProcessing("W25G 1R43 5460 02HXX", ["remove_spaces"]);
      expect(result).toBe("W25G1R43546002HXX");
    });
  });

  describe("airport destination inline fallback", () => {
    it("should extract airport code from inline label:value block", () => {
      const textBlocks: TextBlock[] = [
        { text: "Alirport of Destination (optional): SUU", boundingBox: { x: 61, y: 554, width: 300, height: 15 }, confidence: 1.0 },
        { text: "Other text block", boundingBox: { x: 100, y: 100, width: 100, height: 15 }, confidence: 1.0 },
      ];

      const value = extractAirportDestinationFallback(textBlocks);
      expect(value).toBe("SUU");
    });

    it("should extract from clean Airport of Destination text", () => {
      const textBlocks: TextBlock[] = [
        { text: "Airport of Destination (optional): HIK", boundingBox: { x: 61, y: 554, width: 300, height: 15 }, confidence: 1.0 },
      ];

      const value = extractAirportDestinationFallback(textBlocks);
      expect(value).toBe("HIK");
    });

    it("should extract from block without colon using trailing code", () => {
      const textBlocks: TextBlock[] = [
        { text: "Airport of Destination(optional) SUU", boundingBox: { x: 61, y: 554, width: 300, height: 15 }, confidence: 1.0 },
      ];

      const value = extractAirportDestinationFallback(textBlocks);
      expect(value).toBe("SUU");
    });

    it("should return empty string when no matching block found", () => {
      const textBlocks: TextBlock[] = [
        { text: "PASSENGER AND CARGO AIRCRAFT", boundingBox: { x: 100, y: 400, width: 200, height: 20 }, confidence: 1.0 },
      ];

      const value = extractAirportDestinationFallback(textBlocks);
      expect(value).toBe("");
    });
  });
});
