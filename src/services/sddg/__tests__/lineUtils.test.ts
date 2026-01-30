import {
  isHorizontal,
  isVertical,
  getLineAngle,
  mergeNearbyLines,
  findIntersection,
} from "../lineUtils";
import { Line } from "../opencvTypes";

describe("lineUtils", () => {
  describe("getLineAngle", () => {
    it("should return 0 for horizontal line", () => {
      const line: Line = { x1: 0, y1: 100, x2: 200, y2: 100 };
      expect(getLineAngle(line)).toBe(0);
    });

    it("should return 90 for vertical line", () => {
      const line: Line = { x1: 100, y1: 0, x2: 100, y2: 200 };
      expect(getLineAngle(line)).toBe(90);
    });

    it("should return 45 for diagonal line", () => {
      const line: Line = { x1: 0, y1: 0, x2: 100, y2: 100 };
      expect(getLineAngle(line)).toBe(45);
    });
  });

  describe("isHorizontal", () => {
    it("should return true for perfectly horizontal line", () => {
      const line: Line = { x1: 0, y1: 100, x2: 500, y2: 100 };
      expect(isHorizontal(line, 5)).toBe(true);
    });

    it("should return true for nearly horizontal line within tolerance", () => {
      const line: Line = { x1: 0, y1: 100, x2: 500, y2: 104 };
      expect(isHorizontal(line, 5)).toBe(true);
    });

    it("should return false for vertical line", () => {
      const line: Line = { x1: 100, y1: 0, x2: 100, y2: 500 };
      expect(isHorizontal(line, 5)).toBe(false);
    });
  });

  describe("isVertical", () => {
    it("should return true for perfectly vertical line", () => {
      const line: Line = { x1: 100, y1: 0, x2: 100, y2: 500 };
      expect(isVertical(line, 5)).toBe(true);
    });

    it("should return true for nearly vertical line within tolerance", () => {
      const line: Line = { x1: 100, y1: 0, x2: 104, y2: 500 };
      expect(isVertical(line, 5)).toBe(true);
    });

    it("should return false for horizontal line", () => {
      const line: Line = { x1: 0, y1: 100, x2: 500, y2: 100 };
      expect(isVertical(line, 5)).toBe(false);
    });
  });

  describe("mergeNearbyLines", () => {
    it("should merge two parallel horizontal lines close together", () => {
      const lines: Line[] = [
        { x1: 0, y1: 100, x2: 500, y2: 100 },
        { x1: 50, y1: 105, x2: 450, y2: 105 },
      ];
      const merged = mergeNearbyLines(lines, 15);
      expect(merged.length).toBe(1);
      expect(merged[0].x1).toBe(0);
      expect(merged[0].x2).toBe(500);
    });

    it("should not merge lines that are far apart", () => {
      const lines: Line[] = [
        { x1: 0, y1: 100, x2: 500, y2: 100 },
        { x1: 0, y1: 200, x2: 500, y2: 200 },
      ];
      const merged = mergeNearbyLines(lines, 15);
      expect(merged.length).toBe(2);
    });

    it("should handle empty input", () => {
      const merged = mergeNearbyLines([], 15);
      expect(merged.length).toBe(0);
    });
  });

  describe("findIntersection", () => {
    it("should find intersection of perpendicular lines", () => {
      const horizontal: Line = { x1: 0, y1: 100, x2: 500, y2: 100 };
      const vertical: Line = { x1: 200, y1: 0, x2: 200, y2: 300 };
      const intersection = findIntersection(horizontal, vertical);

      expect(intersection).not.toBeNull();
      expect(intersection!.x).toBeCloseTo(200, 0);
      expect(intersection!.y).toBeCloseTo(100, 0);
    });

    it("should return null for parallel lines", () => {
      const line1: Line = { x1: 0, y1: 100, x2: 500, y2: 100 };
      const line2: Line = { x1: 0, y1: 200, x2: 500, y2: 200 };
      const intersection = findIntersection(line1, line2);

      expect(intersection).toBeNull();
    });

    it("should return null if intersection is outside line segments", () => {
      const horizontal: Line = { x1: 0, y1: 100, x2: 100, y2: 100 };
      const vertical: Line = { x1: 200, y1: 0, x2: 200, y2: 300 };
      const intersection = findIntersection(horizontal, vertical);

      expect(intersection).toBeNull();
    });
  });
});
