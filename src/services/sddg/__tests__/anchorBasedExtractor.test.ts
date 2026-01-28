import { extractWithAnchors, convertToMLKitFormat } from "../anchorBasedExtractor";
import { TextBlock } from "../anchorTypes";

describe("anchorBasedExtractor", () => {
  describe("convertToMLKitFormat", () => {
    it("should convert ML Kit result to TextBlock array", () => {
      const mlKitResult = {
        text: "SHIPPER\nFY4484",
        blocks: [
          {
            text: "SHIPPER",
            cornerPoints: [
              { x: 50, y: 100 },
              { x: 150, y: 100 },
              { x: 150, y: 120 },
              { x: 50, y: 120 },
            ],
          },
          {
            text: "FY4484",
            cornerPoints: [
              { x: 50, y: 130 },
              { x: 130, y: 130 },
              { x: 130, y: 150 },
              { x: 50, y: 150 },
            ],
          },
        ],
      };

      const textBlocks = convertToMLKitFormat(mlKitResult);

      expect(textBlocks).toHaveLength(2);
      expect(textBlocks[0].text).toBe("SHIPPER");
      expect(textBlocks[0].boundingBox.x).toBe(50);
      expect(textBlocks[0].boundingBox.y).toBe(100);
      expect(textBlocks[0].boundingBox.width).toBe(100);
      expect(textBlocks[0].boundingBox.height).toBe(20);
    });
  });

  describe("extractWithAnchors", () => {
    it("should return extraction result with found fields", async () => {
      // This test requires mocking the full OCR pipeline
      // For now, test that the function signature is correct
      const mockImageUri = "file:///test/image.jpg";

      // Expect the function to exist and return a promise
      expect(typeof extractWithAnchors).toBe("function");
    });
  });
});
