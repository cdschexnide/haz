import { findAnchors, fuzzyMatch } from "../anchorDetection";
import { SDDG_ANCHORS } from "../anchorConfig";
import { TextBlock } from "../anchorTypes";

describe("anchorDetection", () => {
  describe("fuzzyMatch", () => {
    it("should match exact text", () => {
      expect(fuzzyMatch("SHIPPER", ["SHIPPER", "Shipper"])).toBe(true);
    });

    it("should match case-insensitively", () => {
      expect(fuzzyMatch("shipper", ["SHIPPER", "Shipper"])).toBe(true);
    });

    it("should match with minor OCR errors (Levenshtein <= 2)", () => {
      expect(fuzzyMatch("SHPPER", ["SHIPPER"])).toBe(true);  // missing I
      expect(fuzzyMatch("SH1PPER", ["SHIPPER"])).toBe(true); // 1 instead of I
    });

    it("should not match unrelated text", () => {
      expect(fuzzyMatch("CONSIGNEE", ["SHIPPER"])).toBe(false);
    });

    it("should handle newlines in patterns", () => {
      expect(fuzzyMatch("UN or ID NO", ["UN or\nID NO"])).toBe(true);
    });
  });

  describe("findAnchors", () => {
    const mockTextBlocks: TextBlock[] = [
      { text: "SHIPPER", boundingBox: { x: 50, y: 100, width: 100, height: 20 }, confidence: 1.0 },
      { text: "FY4484", boundingBox: { x: 50, y: 130, width: 80, height: 20 }, confidence: 1.0 },
      { text: "CONSIGNEE", boundingBox: { x: 50, y: 300, width: 120, height: 20 }, confidence: 1.0 },
      { text: "AIR WAYBILL NO.", boundingBox: { x: 500, y: 100, width: 150, height: 20 }, confidence: 1.0 },
      { text: "UN or ID NO.", boundingBox: { x: 50, y: 500, width: 80, height: 40 }, confidence: 1.0 },
      { text: "PROPER SHIPPING NAME", boundingBox: { x: 150, y: 500, width: 200, height: 20 }, confidence: 1.0 },
    ];

    it("should find SHIPPER anchor", () => {
      const anchors = findAnchors(mockTextBlocks, SDDG_ANCHORS);
      const shipper = anchors.get("shipper");

      expect(shipper).toBeDefined();
      expect(shipper?.matchedPattern).toBe("SHIPPER");
      expect(shipper?.boundingBox.x).toBe(50);
      expect(shipper?.boundingBox.y).toBe(100);
    });

    it("should find multiple anchors", () => {
      const anchors = findAnchors(mockTextBlocks, SDDG_ANCHORS);

      expect(anchors.has("shipper")).toBe(true);
      expect(anchors.has("consignee")).toBe(true);
      expect(anchors.has("air_waybill")).toBe(true);
      expect(anchors.has("un_number")).toBe(true);
      expect(anchors.has("proper_shipping_name")).toBe(true);
    });

    it("should not find anchors that are not present", () => {
      const anchors = findAnchors(mockTextBlocks, SDDG_ANCHORS);

      expect(anchors.has("signature")).toBe(false);
      expect(anchors.has("emergency_telephone")).toBe(false);
    });

    it("should handle OCR errors in anchor labels", () => {
      const blocksWithOCRError: TextBlock[] = [
        { text: "SHPPER", boundingBox: { x: 50, y: 100, width: 100, height: 20 }, confidence: 0.8 },
      ];

      const anchors = findAnchors(blocksWithOCRError, SDDG_ANCHORS);
      expect(anchors.has("shipper")).toBe(true);
    });
  });
});
