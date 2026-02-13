import {
  AFMAN_PACKAGING_PARAGRAPHS,
  isValidAfmanPackagingParagraph,
  normalizePackingInstructionToken,
} from "../afmanPackagingParagraphs";

describe("afmanPackagingParagraphs", () => {
  test("normalizes common packing instruction variants", () => {
    expect(normalizePackingInstructionToken("a6.3")).toBe("A6.3.");
    expect(normalizePackingInstructionToken("A6.3., A6.4.")).toBe("A6.3.");
    expect(normalizePackingInstructionToken(" A13.8 ")).toBe("A13.8.");
  });

  test("accepts listed AFMAN packaging paragraphs", () => {
    expect(isValidAfmanPackagingParagraph("A5.1.")).toBe(true);
    expect(isValidAfmanPackagingParagraph("A5.12")).toBe(true);
    expect(isValidAfmanPackagingParagraph("A5.12.")).toBe(true);
    expect(isValidAfmanPackagingParagraph("A6.28")).toBe(true);
    expect(isValidAfmanPackagingParagraph("A13.20")).toBe(true);
  });

  test("rejects non-AFMAN paragraph values", () => {
    expect(isValidAfmanPackagingParagraph("DOT-SP 12345")).toBe(false);
    expect(isValidAfmanPackagingParagraph("COE-2026-001")).toBe(false);
    expect(isValidAfmanPackagingParagraph("A4.3")).toBe(false);
    expect(isValidAfmanPackagingParagraph("A13.21")).toBe(false);
  });

  test("set contains expected range boundaries", () => {
    expect(AFMAN_PACKAGING_PARAGRAPHS.has("A5.1.")).toBe(true);
    expect(AFMAN_PACKAGING_PARAGRAPHS.has("A5.27.")).toBe(true);
    expect(AFMAN_PACKAGING_PARAGRAPHS.has("A6.28.")).toBe(true);
    expect(AFMAN_PACKAGING_PARAGRAPHS.has("A13.20.")).toBe(true);
  });
});
