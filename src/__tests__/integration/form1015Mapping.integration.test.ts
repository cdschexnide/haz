/**
 * Form 1015 Mapping Integration Tests
 *
 * Verifies that frustrations created during the package workflow
 * map to the correct Form 1015 field numbers.
 */
import {
  generateTestFixtures,
  TestFixture,
} from "./fixtures/generateTestFixtures";
import {
  mapFrustrationsToForm1015WithResolved,
  SDDG_TO_FORM1015_MAPPING,
  PACKAGE_TO_FORM1015_MAPPING,
} from "@/utils/sddgToForm1015Mapping";
import {
  FrustrationRecord,
  PackageFrustrationRecord,
  Inspector,
} from "@/types/sddg";

const fixtures = generateTestFixtures();

const TEST_INSPECTOR: Inspector = {
  inspectorName: "TEST INSPECTOR",
  inspectorRank: "SGT",
  inspectorTitle: "Hazmat Inspector",
};

/**
 * Creates a package frustration record for a missing primary hazard label.
 */
function createMissingPrimaryHazardFrustration(
  hazardClass: string
): PackageFrustrationRecord {
  return {
    id: "test-primary-hazard",
    category: "label",
    itemId: "label-0-primary-hazard",
    itemLabel: "Primary Hazard",
    expectedValues: [`Class ${hazardClass}`],
    verificationStatus: "missing",
    frustrationDate: new Date(),
    defaultMessage: `Required label "Primary Hazard" not found on package`,
    inspector: TEST_INSPECTOR,
    afmanReference: "AFMAN 24-604",
  };
}

/**
 * Creates a package frustration record for an invalid packaging code.
 */
function createInvalidPackagingCodeFrustration(
  packagingParagraph: string
): PackageFrustrationRecord {
  return {
    id: "test-field-b",
    category: "marking",
    itemId: "pop-field-b-validation",
    itemLabel: "Packaging Code (Field B)",
    expectedValues: [`Valid packaging code for ${packagingParagraph}`],
    verificationStatus: "incorrect",
    frustrationDate: new Date(),
    defaultMessage: `Packaging code '9Z9' is not authorized for ${packagingParagraph}`,
    inspector: TEST_INSPECTOR,
    afmanReference: "AFMAN 24-604 A14.3",
  };
}

describe("Form 1015 Mapping Integration", () => {
  // =============================================
  // Per-material frustration mapping
  // =============================================
  describe("Frustration path maps to correct Form 1015 fields", () => {
    test.each(
      fixtures.map((f) => ({
        name: `${f.material.hazclassDiv} / ${f.material.packagingParagraph} / ${f.material.unid}`,
        fixture: f,
      }))
    )("$name", ({ fixture }) => {
      const primaryHazardFrustration = createMissingPrimaryHazardFrustration(
        fixture.material.hazclassDiv
      );
      const invalidCodeFrustration = createInvalidPackagingCodeFrustration(
        fixture.material.packagingParagraph
      );

      const result = mapFrustrationsToForm1015WithResolved(
        [], // No SDDG frustrations
        [primaryHazardFrustration, invalidCodeFrustration],
        [], // No resolved SDDG
        [], // No resolved package
        fixture.sddgData
      );

      // Primary Hazard -> Field 69
      expect(result.currentlyFrustrated.has("69")).toBe(true);

      // Packaging Code (Field B) -> Field 54
      expect(result.currentlyFrustrated.has("54")).toBe(true);
    });
  });

  // =============================================
  // Comprehensive one-time mapping test
  // =============================================
  describe("Complete frustration type mapping", () => {
    test("every frustration type maps to the correct Form 1015 field", () => {
      const sddgFrustrations: FrustrationRecord[] = [
        {
          key: "shipper",
          fieldLabel: "SHIPPER (Key 1)",
          fieldValue: "BAD SHIPPER",
          frustrationDate: new Date(),
          defaultMessage: "Incorrect",
          inspector: TEST_INSPECTOR,
        },
        {
          key: "unIdNo",
          fieldLabel: "UN ID NO (Key 11)",
          fieldValue: "UN9999",
          frustrationDate: new Date(),
          defaultMessage: "Incorrect",
          inspector: TEST_INSPECTOR,
        },
      ];

      const packageFrustrations: PackageFrustrationRecord[] = [
        {
          id: "1",
          category: "marking",
          itemId: "pop-marking-missing",
          itemLabel: "UN Specification Marking",
          expectedValues: ["UN specification marking present"],
          verificationStatus: "missing",
          frustrationDate: new Date(),
          defaultMessage: "Missing POP",
          inspector: TEST_INSPECTOR,
        },
        {
          id: "2",
          category: "marking",
          itemId: "pop-field-b-validation",
          itemLabel: "Packaging Code (Field B)",
          expectedValues: ["Valid code"],
          verificationStatus: "incorrect",
          frustrationDate: new Date(),
          defaultMessage: "Invalid code",
          inspector: TEST_INSPECTOR,
        },
        {
          id: "3",
          category: "marking",
          itemId: "pop-field-c-validation",
          itemLabel: "Packing Group (Field C)",
          expectedValues: ["X", "Y"],
          verificationStatus: "incorrect",
          frustrationDate: new Date(),
          defaultMessage: "Invalid PG",
          inspector: TEST_INSPECTOR,
        },
        {
          id: "4",
          category: "marking",
          itemId: "marking-0-psn-and-un-number",
          itemLabel: "PSN and UN Number",
          expectedValues: ["ACETONE UN1090"],
          verificationStatus: "missing",
          frustrationDate: new Date(),
          defaultMessage: "Missing marking",
          inspector: TEST_INSPECTOR,
        },
        {
          id: "5",
          category: "marking",
          itemId: "marking-1-msl",
          itemLabel: "Military Shipping Label (MSL) or DD Form 1387",
          expectedValues: ["MSL present"],
          verificationStatus: "missing",
          frustrationDate: new Date(),
          defaultMessage: "Missing MSL",
          inspector: TEST_INSPECTOR,
        },
        {
          id: "6",
          category: "label",
          itemId: "label-0-primary-hazard",
          itemLabel: "Primary Hazard",
          expectedValues: ["Class 3"],
          verificationStatus: "missing",
          frustrationDate: new Date(),
          defaultMessage: "Missing label",
          inspector: TEST_INSPECTOR,
        },
        {
          id: "7",
          category: "label",
          itemId: "label-1-subsidiary",
          itemLabel: "Subsidiary Hazard",
          expectedValues: ["Class 8"],
          verificationStatus: "missing",
          frustrationDate: new Date(),
          defaultMessage: "Missing label",
          inspector: TEST_INSPECTOR,
        },
        {
          id: "8",
          category: "label",
          itemId: "label-2-cao",
          itemLabel: "Cargo Aircraft Only",
          expectedValues: ["Cargo Aircraft Only"],
          verificationStatus: "missing",
          frustrationDate: new Date(),
          defaultMessage: "Missing label",
          inspector: TEST_INSPECTOR,
        },
      ];

      const result = mapFrustrationsToForm1015WithResolved(
        sddgFrustrations,
        packageFrustrations,
        [],
        [],
        null
      );

      // SDDG mappings
      expect(result.currentlyFrustrated.has("2")).toBe(true); // shipper
      expect(result.currentlyFrustrated.has("13")).toBe(true); // unIdNo

      // Package mappings
      expect(result.currentlyFrustrated.has("54")).toBe(true); // POP marking / Field B / Field C
      expect(result.currentlyFrustrated.has("53")).toBe(true); // PSN and UN Number
      expect(result.currentlyFrustrated.has("75")).toBe(true); // MSL
      expect(result.currentlyFrustrated.has("69")).toBe(true); // Primary Hazard
      expect(result.currentlyFrustrated.has("71")).toBe(true); // Subsidiary Hazard
      expect(result.currentlyFrustrated.has("72")).toBe(true); // Cargo Aircraft Only
    });

    test("SDDG_TO_FORM1015_MAPPING covers all critical SDDG fields", () => {
      const criticalFields = [
        "shipper",
        "consignee",
        "shippersReferenceNumber",
        "unIdNo",
        "properShippingName",
        "hazardClass",
        "packingGroup",
        "packingInstruction",
        "aircraftType",
      ];

      for (const field of criticalFields) {
        expect(SDDG_TO_FORM1015_MAPPING[field]).toBeDefined();
        expect(SDDG_TO_FORM1015_MAPPING[field]).toBeTruthy();
      }
    });

    test("PACKAGE_TO_FORM1015_MAPPING covers all critical package items", () => {
      const criticalItems = [
        "UN Specification Marking",
        "Packaging Code (Field B)",
        "Packing Group (Field C)",
        "PSN and UN Number",
        "Primary Hazard",
        "Cargo Aircraft Only",
      ];

      for (const item of criticalItems) {
        expect(PACKAGE_TO_FORM1015_MAPPING[item]).toBeDefined();
        expect(PACKAGE_TO_FORM1015_MAPPING[item]).toBeTruthy();
      }
    });
  });
});
