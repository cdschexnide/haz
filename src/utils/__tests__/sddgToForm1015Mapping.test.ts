import {
  SDDG_TO_FORM1015_MAPPING,
  mapFrustrationsToForm1015WithResolved,
} from "../sddgToForm1015Mapping";
import type { FrustrationRecord } from "@/types/sddg";

const makeCopiesFrustration = (): FrustrationRecord => ({
  key: "sddgOriginalDocumentCopies",
  fieldLabel:
    "THREE ORIGINAL DOCUMENTS FOR EACH PSN UNDER A SINGLE TCN (ONLY TWO REQUIRED FOR CHAPTER 3)",
  fieldValue: "2 original documents present",
  frustrationDate: new Date("2026-02-18T00:00:00.000Z"),
  defaultMessage: "Shipment does not include the required number of original SDDG documents.",
  inspector: {
    inspectorName: "Inspector Test",
    inspectorRank: null,
    inspectorTitle: "SSgt",
  },
});

describe("sddgToForm1015Mapping", () => {
  it("maps sddgOriginalDocumentCopies to Form 1015 field 1", () => {
    expect(SDDG_TO_FORM1015_MAPPING.sddgOriginalDocumentCopies).toBe("1");
  });

  it("marks field 1 as currently frustrated for document copies frustration", () => {
    const { currentlyFrustrated, resolved } = mapFrustrationsToForm1015WithResolved(
      [makeCopiesFrustration()],
      [],
      [],
      [],
      null
    );

    expect(currentlyFrustrated.has("1")).toBe(true);
    expect(resolved.has("1")).toBe(false);
  });

  it("marks field 1 as resolved when copies frustration is resolved", () => {
    const { currentlyFrustrated, resolved } = mapFrustrationsToForm1015WithResolved(
      [],
      [],
      [makeCopiesFrustration()],
      [],
      null
    );

    expect(currentlyFrustrated.has("1")).toBe(false);
    expect(resolved.has("1")).toBe(true);
  });
});
