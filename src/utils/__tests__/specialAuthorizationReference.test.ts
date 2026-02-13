import {
  doesAuthorizationReferenceMatchDocument,
  findMatchingAuthorizationDocuments,
  normalizeAuthorizationReference,
} from "../specialAuthorizationReference";

describe("specialAuthorizationReference", () => {
  describe("normalizeAuthorizationReference", () => {
    it("normalizes COE references consistently", () => {
      expect(normalizeAuthorizationReference(" COE-123 45 ", "COE")).toBe(
        "12345"
      );
      expect(normalizeAuthorizationReference("12345", "COE")).toBe("12345");
    });

    it("normalizes CAA references consistently", () => {
      expect(normalizeAuthorizationReference("CAA 98-76", "CAA")).toBe("9876");
      expect(normalizeAuthorizationReference("98 76", "CAA")).toBe("9876");
    });

    it("normalizes DOT-SP references across common formats", () => {
      expect(
        normalizeAuthorizationReference("DOT-SP 12345", "DOT-SP")
      ).toBe("12345");
      expect(normalizeAuthorizationReference("DOT SP-12345", "DOT-SP")).toBe(
        "12345"
      );
      expect(
        normalizeAuthorizationReference("Special Permit 12345", "DOT-SP")
      ).toBe("12345");
    });
  });

  describe("doesAuthorizationReferenceMatchDocument", () => {
    it("matches COE key17 against COE document name", () => {
      const matches = doesAuthorizationReferenceMatchDocument({
        key17Reference: "COE 22-999",
        type: "COE",
        document: {
          id: "1",
          documentType: "COE",
          base64Data: "abc",
          name: "22-999",
          dateAdded: new Date().toISOString(),
        },
      });
      expect(matches).toBe(true);
    });

    it("matches DOT-SP key17 against waiver number", () => {
      const matches = doesAuthorizationReferenceMatchDocument({
        key17Reference: "Shipment per DOT-SP 20456",
        type: "DOT-SP",
        document: {
          id: "1",
          uri: "file:///tmp/waiver.pdf",
          base64Data: "abc",
          waiverNumber: "20456",
          dateAdded: new Date().toISOString(),
        },
      });
      expect(matches).toBe(true);
    });

    it("returns false when references do not match", () => {
      const matches = doesAuthorizationReferenceMatchDocument({
        key17Reference: "DOT-SP 99999",
        type: "DOT-SP",
        document: {
          id: "1",
          uri: "file:///tmp/waiver.pdf",
          base64Data: "abc",
          waiverNumber: "12345",
          dateAdded: new Date().toISOString(),
        },
      });
      expect(matches).toBe(false);
    });
  });

  describe("findMatchingAuthorizationDocuments", () => {
    it("returns only matching references", () => {
      const docs = [
        {
          id: "1",
          documentType: "CAA" as const,
          base64Data: "abc",
          name: "CAA-1177",
          dateAdded: new Date().toISOString(),
        },
        {
          id: "2",
          documentType: "CAA" as const,
          base64Data: "abc",
          name: "CAA-8899",
          dateAdded: new Date().toISOString(),
        },
      ];

      const matches = findMatchingAuthorizationDocuments({
        key17Reference: "CAA-8899",
        type: "CAA",
        documents: docs,
      });

      expect(matches).toHaveLength(1);
      expect((matches[0] as { id: string }).id).toBe("2");
    });
  });
});
