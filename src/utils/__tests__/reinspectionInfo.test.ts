import { getLatestReinspectionInfo } from "../reinspectionInfo";
import { FrustrationRecord, PackageFrustrationRecord } from "@/types/sddg";

const makeAttempt = (date: string, inspector: string) => ({
  date: new Date(date),
  inspector,
  action: "verified" as const,
});

const makeSddgFrustration = (
  attempts: ReturnType<typeof makeAttempt>[] = []
): FrustrationRecord => ({
  key: "shipper",
  fieldLabel: "SHIPPER",
  fieldValue: "X",
  frustrationDate: new Date("2026-01-01T00:00:00Z"),
  defaultMessage: "msg",
  inspector: "I" as any,
  reinspectionHistory: attempts,
});

const makePackageFrustration = (
  attempts: ReturnType<typeof makeAttempt>[] = []
): PackageFrustrationRecord => ({
  id: "1",
  category: "marking",
  itemId: "marking-1",
  itemLabel: "PSN",
  expectedValues: ["PSN"],
  verificationStatus: "missing",
  defaultMessage: "msg",
  frustrationDate: new Date("2026-01-01T00:00:00Z"),
  inspector: "I" as any,
  reinspectionHistory: attempts,
});

describe("getLatestReinspectionInfo", () => {
  it("returns null when no reinspection history exists", () => {
    const result = getLatestReinspectionInfo({
      sddgFrustrations: [],
      packageFrustrations: [],
      resolvedSddgFrustrations: [],
      resolvedPackageFrustrations: [],
    });

    expect(result.latestDate).toBeNull();
    expect(result.latestInspector).toBe("");
  });

  it("returns latest inspector from resolved frustrations", () => {
    const result = getLatestReinspectionInfo({
      sddgFrustrations: [],
      packageFrustrations: [],
      resolvedSddgFrustrations: [
        makeSddgFrustration([
          makeAttempt("2026-01-02T00:00:00Z", "Inspector A"),
        ]),
      ],
      resolvedPackageFrustrations: [],
    });

    expect(result.latestInspector).toBe("Inspector A");
  });

  it("returns latest inspector from current frustrations when unresolved", () => {
    const result = getLatestReinspectionInfo({
      sddgFrustrations: [
        makeSddgFrustration([
          makeAttempt("2026-01-03T00:00:00Z", "Inspector B"),
        ]),
      ],
      packageFrustrations: [],
      resolvedSddgFrustrations: [],
      resolvedPackageFrustrations: [],
    });

    expect(result.latestInspector).toBe("Inspector B");
  });

  it("returns the latest inspector across all histories", () => {
    const result = getLatestReinspectionInfo({
      sddgFrustrations: [
        makeSddgFrustration([
          makeAttempt("2026-01-01T00:00:00Z", "Inspector A"),
        ]),
      ],
      packageFrustrations: [
        makePackageFrustration([
          makeAttempt("2026-01-04T00:00:00Z", "Inspector C"),
        ]),
      ],
      resolvedSddgFrustrations: [
        makeSddgFrustration([
          makeAttempt("2026-01-02T00:00:00Z", "Inspector B"),
        ]),
      ],
      resolvedPackageFrustrations: [],
    });

    expect(result.latestInspector).toBe("Inspector C");
  });
});
