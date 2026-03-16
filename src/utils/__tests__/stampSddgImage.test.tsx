jest.mock("expo-file-system", () => ({
  documentDirectory: "file:///tmp/",
  getInfoAsync: jest.fn(),
  makeDirectoryAsync: jest.fn(),
  moveAsync: jest.fn(),
  readAsStringAsync: jest.fn(),
}));

jest.mock("expo-print", () => ({
  printToFileAsync: jest.fn(),
}));

import {
  STAMP_TIMEOUT_MS,
  buildStampLines,
  scaleToMax,
} from "../stampSddgImage";

describe("stampSddgImage", () => {
  it("exports expected timeout", () => {
    expect(STAMP_TIMEOUT_MS).toBe(10000);
  });

  describe("scaleToMax", () => {
    it("returns original dimensions when already under max", () => {
      expect(scaleToMax(1200, 800)).toEqual({ width: 1200, height: 800 });
    });

    it("downscales while preserving aspect ratio", () => {
      expect(scaleToMax(4096, 3072)).toEqual({ width: 2048, height: 1536 });
    });

    it("downscales portrait images", () => {
      expect(scaleToMax(2000, 4000)).toEqual({ width: 1024, height: 2048 });
    });
  });

  describe("buildStampLines", () => {
    it("formats stamp lines with rank", () => {
      const lines = buildStampLines(
        {
          inspectorName: "Jeremiah Huffman",
          inspectorRank: "SrA",
          inspectorTitle: "JB MDL (KWRI)",
        },
        new Date("2026-02-19T12:00:00.000Z")
      );

      expect(lines.line1).toBe("Inspected by SrA Jeremiah Huffman");
      expect(lines.line2).toContain("JB MDL (KWRI) Date:");
    });

    it("formats stamp lines without rank", () => {
      const lines = buildStampLines(
        {
          inspectorName: "John Smith",
          inspectorRank: null,
          inspectorTitle: "JB MDL (KWRI)",
        },
        new Date("2026-02-19T12:00:00.000Z")
      );

      expect(lines.line1).toBe("Inspected by John Smith");
      expect(lines.line2).toContain("JB MDL (KWRI) Date:");
    });
  });
});
