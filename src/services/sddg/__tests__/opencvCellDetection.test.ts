import {
  detectCells,
  parseHoughLines,
  computeScaleAwareThresholds,
} from "../opencvCellDetection";
import { DEFAULT_CELL_DETECTION_CONFIG } from "../opencvTypes";

jest.mock("react-native-fast-opencv", () => ({
  OpenCV: {
    invoke: jest.fn(),
    toJSValue: jest.fn(),
  },
  ObjectType: { Mat: "Mat" },
  ColorConversionCodes: { COLOR_RGBA2GRAY: 11 },
  ThresholdTypes: { THRESH_BINARY_INV: 1 },
  AdaptiveThresholdTypes: { ADAPTIVE_THRESH_GAUSSIAN_C: 1 },
}));

describe("opencvCellDetection", () => {
  describe("parseHoughLines", () => {
    it("should parse HoughLinesP output array to Line objects", () => {
      const rawLines = [0, 100, 500, 100, 200, 0, 200, 300];
      const lines = parseHoughLines(rawLines);

      expect(lines.length).toBe(2);
      expect(lines[0]).toEqual({ x1: 0, y1: 100, x2: 500, y2: 100 });
      expect(lines[1]).toEqual({ x1: 200, y1: 0, x2: 200, y2: 300 });
    });

    it("should return empty array for null/undefined input", () => {
      expect(parseHoughLines(null as any)).toEqual([]);
      expect(parseHoughLines(undefined as any)).toEqual([]);
      expect(parseHoughLines([])).toEqual([]);
    });
  });

  describe("computeScaleAwareThresholds", () => {
    it("should compute pixel values from percentages", () => {
      const config = DEFAULT_CELL_DETECTION_CONFIG;
      const imageDims = { width: 2550, height: 3300 };

      const thresholds = computeScaleAwareThresholds(config, imageDims);

      expect(thresholds.minLineLength).toBe(Math.round(2550 * 0.05));
      expect(thresholds.maxLineGap).toBe(Math.round(2550 * 0.005));
      expect(thresholds.mergeDistance).toBe(Math.round(3300 * 0.005));
      expect(thresholds.minCellWidth).toBe(Math.round(2550 * 0.02));
      expect(thresholds.minCellHeight).toBe(Math.round(3300 * 0.01));
    });
  });

  describe("detectCells", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should return failure result when OpenCV throws", async () => {
      const { OpenCV } = require("react-native-fast-opencv");
      OpenCV.invoke.mockRejectedValue(new Error("OpenCV error"));

      const result = await detectCells("test-image.png");

      expect(result.success).toBe(false);
      expect(result.error).toContain("OpenCV error");
      expect(result.cells).toEqual([]);
    });

    it("should use 10 second timeout by default", () => {
      expect(DEFAULT_CELL_DETECTION_CONFIG.timeoutMs).toBe(10000);
    });
  });
});
