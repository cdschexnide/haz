import {
  extractValueFromRegion,
  extractInlinePatternValue,
  extractCheckboxValue,
  applyPostProcessing,
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
});
