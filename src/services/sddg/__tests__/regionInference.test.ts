import {
  computeValueRegion,
  computeLabelTopLeftRegion,
  computeLabelLeftValueRightRegion,
  computeLabelTopValueBottomRegion,
} from "../regionInference";
import { AnchorMatch, BoundingBox, AnchorConfig } from "../anchorTypes";

describe("regionInference", () => {
  const imageWidth = 2550;
  const imageHeight = 3300;

  describe("computeLabelTopLeftRegion", () => {
    it("should compute region below and right of anchor", () => {
      const anchor: AnchorMatch = {
        fieldId: "shipper",
        boundingBox: { x: 50, y: 100, width: 100, height: 20 },
        matchedPattern: "SHIPPER",
        confidence: 1.0
      };

      const boundingAnchors = new Map<string, AnchorMatch>([
        ["consignee", {
          fieldId: "consignee",
          boundingBox: { x: 50, y: 400, width: 120, height: 20 },
          matchedPattern: "CONSIGNEE",
          confidence: 1.0
        }]
      ]);

      const region = computeLabelTopLeftRegion(
        anchor,
        { boundedBy: [{ anchorId: "consignee", constrains: "maxY" }], direction: "below-and-right" },
        boundingAnchors,
        imageWidth,
        imageHeight
      );

      expect(region.boundingBox.x).toBe(50);
      expect(region.boundingBox.y).toBe(120); // anchor.y + anchor.height
      expect(region.boundingBox.height).toBeLessThanOrEqual(280); // up to consignee.y
    });
  });

  describe("computeLabelLeftValueRightRegion", () => {
    it("should compute region to the right of anchor on same line", () => {
      const anchor: AnchorMatch = {
        fieldId: "air_waybill",
        boundingBox: { x: 500, y: 100, width: 150, height: 20 },
        matchedPattern: "AIR WAYBILL NO.",
        confidence: 1.0
      };

      const region = computeLabelLeftValueRightRegion(
        anchor,
        { direction: "right" },
        new Map(),
        imageWidth,
        imageHeight
      );

      expect(region.boundingBox.x).toBe(650 + 10); // anchor.x + anchor.width + padding
      expect(region.boundingBox.y).toBe(100);
      expect(region.boundingBox.height).toBe(30); // anchor.height + padding
    });
  });

  describe("computeLabelTopValueBottomRegion", () => {
    it("should compute region directly below anchor", () => {
      const anchor: AnchorMatch = {
        fieldId: "airport_departure",
        boundingBox: { x: 200, y: 600, width: 200, height: 20 },
        matchedPattern: "AIRPORT OF DEPARTURE",
        confidence: 1.0
      };

      const region = computeLabelTopValueBottomRegion(
        anchor,
        { direction: "below" },
        new Map(),
        imageWidth,
        imageHeight
      );

      expect(region.boundingBox.x).toBe(200);
      expect(region.boundingBox.y).toBe(620); // anchor.y + anchor.height
      expect(region.boundingBox.width).toBe(200); // same as anchor width
    });
  });
});
