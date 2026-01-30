import {
  computeTransform,
  applyTransformToTemplate,
  findCellContainingPoint,
  isTransformReasonable,
  matchFieldByPosition,
} from "../templateAutoAlignment";
import { DetectedCell, AlignmentTransform } from "../opencvTypes";
import { SDDGTemplate } from "@/types/sddg-template";

describe("templateAutoAlignment", () => {
  describe("findCellContainingPoint", () => {
    const cells: DetectedCell[] = [
      { x: 0, y: 0, width: 100, height: 50 },
      { x: 100, y: 0, width: 100, height: 50 },
      { x: 0, y: 50, width: 100, height: 50 },
    ];

    it("should find cell containing a point", () => {
      const cell = findCellContainingPoint(cells, 50, 25);
      expect(cell).toEqual({ x: 0, y: 0, width: 100, height: 50 });
    });

    it("should return null for point outside all cells", () => {
      const cell = findCellContainingPoint(cells, 300, 300);
      expect(cell).toBeNull();
    });
  });

  describe("matchFieldByPosition", () => {
    const cells: DetectedCell[] = [
      { x: 50, y: 100, width: 200, height: 100 },
      { x: 300, y: 100, width: 200, height: 100 },
      { x: 50, y: 500, width: 200, height: 100 },
    ];

    it("should match field to nearest cell within threshold", () => {
      const imageDims = { width: 1000, height: 1000 };
      const templateCenter = { x: 0.1, y: 0.15 };
      const threshold = 0.15;

      const cell = matchFieldByPosition(
        cells,
        templateCenter,
        imageDims,
        threshold
      );
      expect(cell).toEqual(cells[0]);
    });

    it("should return null if no cell within threshold", () => {
      const imageDims = { width: 1000, height: 1000 };
      const templateCenter = { x: 0.9, y: 0.9 };
      const threshold = 0.1;

      const cell = matchFieldByPosition(
        cells,
        templateCenter,
        imageDims,
        threshold
      );
      expect(cell).toBeNull();
    });
  });

  describe("computeTransform", () => {
    it("should compute identity transform for matching regions", () => {
      const matches = [
        { template: { x: 100, y: 100 }, detected: { x: 100, y: 100 } },
        { template: { x: 200, y: 200 }, detected: { x: 200, y: 200 } },
      ];
      const imageDims = { width: 1000, height: 1000 };

      const transform = computeTransform(matches, imageDims);

      expect(transform.offsetX).toBeCloseTo(0, 1);
      expect(transform.offsetY).toBeCloseTo(0, 1);
      expect(transform.scaleX).toBeCloseTo(1, 2);
      expect(transform.scaleY).toBeCloseTo(1, 2);
    });

    it("should track scaleX and scaleY counts separately", () => {
      const matches = [
        { template: { x: 100, y: 100 }, detected: { x: 110, y: 100 } },
        { template: { x: 200, y: 100 }, detected: { x: 220, y: 100 } },
      ];
      const imageDims = { width: 1000, height: 1000 };

      const transform = computeTransform(matches, imageDims);

      expect(transform.scaleX).toBeCloseTo(1.1, 1);
      expect(transform.scaleY).toBeCloseTo(1, 1);
    });
  });

  describe("isTransformReasonable", () => {
    const imageDims = { width: 2550, height: 3300 };

    it("should accept identity transform", () => {
      const transform: AlignmentTransform = {
        offsetX: 0,
        offsetY: 0,
        scaleX: 1,
        scaleY: 1,
      };
      expect(isTransformReasonable(transform, imageDims)).toBe(true);
    });

    it("should accept small offset", () => {
      const transform: AlignmentTransform = {
        offsetX: 100,
        offsetY: 100,
        scaleX: 1,
        scaleY: 1,
      };
      expect(isTransformReasonable(transform, imageDims)).toBe(true);
    });

    it("should reject large offset (>20%)", () => {
      const transform: AlignmentTransform = {
        offsetX: 600,
        offsetY: 0,
        scaleX: 1,
        scaleY: 1,
      };
      expect(isTransformReasonable(transform, imageDims)).toBe(false);
    });

    it("should reject extreme scale", () => {
      const transform: AlignmentTransform = {
        offsetX: 0,
        offsetY: 0,
        scaleX: 2.0,
        scaleY: 1,
      };
      expect(isTransformReasonable(transform, imageDims)).toBe(false);
    });
  });

  describe("applyTransformToTemplate", () => {
    it("should apply offset and scale to all regions", () => {
      const template: SDDGTemplate = {
        formType: "TEST",
        formName: "Test Form",
        identifiers: [],
        regions: {
          shipper: { x: 100, y: 200, w: 300, h: 100, fieldType: "text" },
        },
      };
      const transform: AlignmentTransform = {
        offsetX: 50,
        offsetY: 25,
        scaleX: 1.1,
        scaleY: 1.1,
      };

      const aligned = applyTransformToTemplate(template, transform);

      expect(aligned.regions.shipper!.x).toBe(Math.round(100 * 1.1 + 50));
      expect(aligned.regions.shipper!.y).toBe(Math.round(200 * 1.1 + 25));
      expect(aligned.regions.shipper!.w).toBe(Math.round(300 * 1.1));
      expect(aligned.regions.shipper!.h).toBe(Math.round(100 * 1.1));
    });
  });
});
