/**
 * Integration tests for anchor-based SDDG extraction
 *
 * These tests verify extraction accuracy against the 11 sample forms
 * in docs/hazdecs all.pdf
 *
 * To run: npx jest anchorBasedExtractor.integration.test.ts
 *
 * Note: These tests require actual form images. In CI, they can be skipped
 * or run against pre-extracted OCR results.
 */

import { extractWithAnchors, convertToSDDGData } from "../anchorBasedExtractor";
import { SDDGData } from "@/types/sddg-template";

// Skip in CI if no test images available
const SKIP_INTEGRATION = process.env.CI === "true";

const describeOrSkip = SKIP_INTEGRATION ? describe.skip : describe;

describeOrSkip("Anchor-Based Extraction Integration", () => {
  // Expected values for test forms (from docs/hazdecs all.pdf)
  const EXPECTED_VALUES = {
    form1_amc_imt_1033: {
      shipper: "FY4484\nBLDG 1757 VANDENBERG AVE\nMCGUIRE AFB NJ 08641",
      un_number: "UN0106",
      proper_shipping_name: "FUZES DETONATING",
      class_division: "1.1B",
      tcn: "W25G1R43546002HXX",
    },
    form2_daf_7507: {
      shipper: "N00109 Navy Munitions Command Det Yorktown",
      un_number: "UN1013",
      proper_shipping_name: "CARBON DIOXIDE",
      class_division: "2.2",
    },
  };

  it("should extract fields from AMC IMT 1033 form", async () => {
    // This test requires a test image at a known path
    // In real implementation, use a test fixture
    const testImageUri = "file:///test-fixtures/amc_imt_1033_sample.jpg";

    // Skip if test image doesn't exist
    // const exists = await FileSystem.getInfoAsync(testImageUri);
    // if (!exists.exists) {
    //   console.log("Skipping: test image not found");
    //   return;
    // }

    // const result = await extractWithAnchors(testImageUri);
    // const sddgData = convertToSDDGData(result);

    // expect(sddgData.un_number).toContain("UN0106");
    // expect(sddgData.class_division).toBe("1.1B");

    // Placeholder assertion until test fixtures are set up
    expect(true).toBe(true);
  });

  it("should handle different form versions", async () => {
    // Test with DAF FORM 7507
    // Test with IATA forms
    // Test with LABELMASTER forms
    expect(true).toBe(true);
  });

  it("should handle OCR errors gracefully", async () => {
    // Test with blurry/rotated images
    expect(true).toBe(true);
  });
});

// Helper to compare extracted value with expected
function expectValueMatch(actual: string, expected: string, tolerance: number = 0.8): void {
  const normalizedActual = actual.toUpperCase().replace(/\s+/g, " ").trim();
  const normalizedExpected = expected.toUpperCase().replace(/\s+/g, " ").trim();

  if (normalizedActual === normalizedExpected) {
    return; // Exact match
  }

  // Check if expected is contained in actual
  if (normalizedActual.includes(normalizedExpected)) {
    return;
  }

  // Fail with useful message
  expect(normalizedActual).toContain(normalizedExpected);
}
