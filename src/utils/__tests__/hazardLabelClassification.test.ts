import {
  extractHazardClassFromDetection,
  classifyHazardLabels,
  HazardClassificationResult,
} from "../hazardLabelClassification";
import type { ImageAnalysisResult } from "../../ml/types/ocr";
import type { Detection } from "../../ml/types/detection";

// Helper to build a minimal detection
function makeDetection(
  id: string,
  className: string,
  category: string,
  confidence: number,
  boxY: number
): Detection {
  return {
    id,
    className,
    category,
    confidence,
    classId: 0,
    box: { x: 50, y: boxY, width: 100, height: 100 },
  };
}

// Helper to build a minimal ImageAnalysisResult
function makeImageResult(detections: Detection[]): ImageAnalysisResult {
  return {
    imageUri: "test.jpg",
    imageWidth: 640,
    imageHeight: 640,
    detections,
    inferenceTime: 100,
    ocrResult: null,
    extractedMarkings: null,
    totalProcessingTime: 100,
  };
}

describe("extractHazardClassFromDetection", () => {
  test("returns null for general_marking category", () => {
    expect(extractHazardClassFromDetection("cargoAircraftOnly", "general_marking")).toBeNull();
  });

  test("extracts class from explosives className", () => {
    expect(extractHazardClassFromDetection("explosives1.1B", "hazardClass1")).toBe("1.1");
    expect(extractHazardClassFromDetection("explosives1.4S", "hazardClass1")).toBe("1.4");
    expect(extractHazardClassFromDetection("explosives1.1", "hazardClass1")).toBe("1.1");
    expect(extractHazardClassFromDetection("explosives1", "hazardClass1")).toBe("1");
  });

  test("extracts class from standard hazmat classNames", () => {
    expect(extractHazardClassFromDetection("corrosiveHazmatClass8", "hazardClass8")).toBe("8");
    expect(extractHazardClassFromDetection("poisonHazmatClass6.1", "hazardClass6")).toBe("6.1");
    expect(extractHazardClassFromDetection("flammableGasHazmatClass2.1", "hazardClass2")).toBe("2.1");
    expect(extractHazardClassFromDetection("flammableSolidHazmatClass4.1", "hazardClass4")).toBe("4.1");
    expect(extractHazardClassFromDetection("oxidizerHazmatClass5.1", "hazardClass5")).toBe("5.1");
    expect(extractHazardClassFromDetection("miscellaneousHazmatClass9", "hazardClass9")).toBe("9");
  });

  test("extracts class from class 6 edge cases", () => {
    expect(extractHazardClassFromDetection("toxicHazmatClass6", "hazardClass6")).toBe("6.1");
    expect(extractHazardClassFromDetection("hazmatClass6PackingGroupIII", "hazardClass6")).toBe("6.1");
    expect(extractHazardClassFromDetection("infectiousSubstanceHazmatClass6.2", "hazardClass6")).toBe("6.2");
  });

  test("extracts class from special class 2 labels via labelMatchingTable", () => {
    expect(extractHazardClassFromDetection("UN1977", "hazardClass2")).toBe("2.2");
    expect(extractHazardClassFromDetection("fireExtinguisherManufacturedPriorToJan1976Label", "hazardClass2")).toBe("2.2");
  });

  test("returns null for non-hazard class 2 labels", () => {
    expect(extractHazardClassFromDetection("meetsDotRequirements", "hazardClass2")).toBeNull();
    expect(extractHazardClassFromDetection("nonOdorized", "hazardClass2")).toBeNull();
  });
});

describe("classifyHazardLabels", () => {
  test("classifies primary hazard label from SDDG hazardClass", () => {
    const results = [
      makeImageResult([
        makeDetection("d1", "corrosiveHazmatClass8", "hazardClass8", 0.95, 100),
      ]),
    ];
    const sddgData = { hazardClass: "8", subsidiaryRisk: "" };

    const result = classifyHazardLabels(results, sddgData);

    expect(result.primaryDetection).not.toBeNull();
    expect(result.primaryDetection!.className).toBe("corrosiveHazmatClass8");
    expect(result.primaryDetection!.role).toBe("primary");
    expect(result.subsidiaryDetections).toHaveLength(0);
    expect(result.positionWarning).toBe(false);
  });

  test("classifies both primary and subsidiary from SDDG", () => {
    const results = [
      makeImageResult([
        makeDetection("d1", "corrosiveHazmatClass8", "hazardClass8", 0.9, 100),
        makeDetection("d2", "poisonHazmatClass6.1", "hazardClass6", 0.85, 250),
      ]),
    ];
    const sddgData = { hazardClass: "8", subsidiaryRisk: "6.1" };

    const result = classifyHazardLabels(results, sddgData);

    expect(result.primaryDetection).not.toBeNull();
    expect(result.primaryDetection!.className).toBe("corrosiveHazmatClass8");
    expect(result.subsidiaryDetections).toHaveLength(1);
    expect(result.subsidiaryDetections[0].className).toBe("poisonHazmatClass6.1");
    expect(result.positionWarning).toBe(false);
  });

  test("warns when primary label is below subsidiary in same image", () => {
    const results = [
      makeImageResult([
        makeDetection("d1", "corrosiveHazmatClass8", "hazardClass8", 0.9, 300), // lower
        makeDetection("d2", "poisonHazmatClass6.1", "hazardClass6", 0.85, 100), // higher
      ]),
    ];
    const sddgData = { hazardClass: "8", subsidiaryRisk: "6.1" };

    const result = classifyHazardLabels(results, sddgData);

    expect(result.positionWarning).toBe(true);
    expect(result.positionWarningMessage).toBeTruthy();
  });

  test("no position warning when labels are in different images", () => {
    const results = [
      makeImageResult([
        makeDetection("d1", "corrosiveHazmatClass8", "hazardClass8", 0.9, 300),
      ]),
      makeImageResult([
        makeDetection("d2", "poisonHazmatClass6.1", "hazardClass6", 0.85, 100),
      ]),
    ];
    const sddgData = { hazardClass: "8", subsidiaryRisk: "6.1" };

    const result = classifyHazardLabels(results, sddgData);

    expect(result.primaryDetection).not.toBeNull();
    expect(result.subsidiaryDetections).toHaveLength(1);
    expect(result.positionWarning).toBe(false);
  });

  test("handles SDDG hazardClass with compatibility group (e.g., '1.1D')", () => {
    const results = [
      makeImageResult([
        makeDetection("d1", "explosives1.1D", "hazardClass1", 0.9, 100),
      ]),
    ];
    const sddgData = { hazardClass: "1.1D", subsidiaryRisk: "" };

    const result = classifyHazardLabels(results, sddgData);

    expect(result.primaryDetection).not.toBeNull();
    expect(result.primaryDetection!.className).toBe("explosives1.1D");
  });

  test("handles comma-separated subsidiaryRisk", () => {
    const results = [
      makeImageResult([
        makeDetection("d1", "flammableHazmatClass3", "hazardClass3", 0.9, 100),
        makeDetection("d2", "corrosiveHazmatClass8", "hazardClass8", 0.85, 200),
        makeDetection("d3", "poisonHazmatClass6.1", "hazardClass6", 0.8, 300),
      ]),
    ];
    const sddgData = { hazardClass: "3", subsidiaryRisk: "6.1, 8" };

    const result = classifyHazardLabels(results, sddgData);

    expect(result.primaryDetection!.className).toBe("flammableHazmatClass3");
    expect(result.subsidiaryDetections).toHaveLength(2);
    const subClassNames = result.subsidiaryDetections.map((s) => s.className);
    expect(subClassNames).toContain("corrosiveHazmatClass8");
    expect(subClassNames).toContain("poisonHazmatClass6.1");
  });

  test("returns empty result when no SDDG hazardClass provided", () => {
    const results = [
      makeImageResult([
        makeDetection("d1", "corrosiveHazmatClass8", "hazardClass8", 0.9, 100),
      ]),
    ];
    const sddgData = { hazardClass: "", subsidiaryRisk: "" };

    const result = classifyHazardLabels(results, sddgData);

    expect(result.primaryDetection).toBeNull();
    expect(result.subsidiaryDetections).toHaveLength(0);
  });

  test("ignores non-hazard detections (general_marking)", () => {
    const results = [
      makeImageResult([
        makeDetection("d1", "cargoAircraftOnly", "general_marking", 0.95, 50),
        makeDetection("d2", "corrosiveHazmatClass8", "hazardClass8", 0.9, 100),
      ]),
    ];
    const sddgData = { hazardClass: "8", subsidiaryRisk: "" };

    const result = classifyHazardLabels(results, sddgData);

    expect(result.classifications).toHaveLength(1);
    expect(result.primaryDetection!.className).toBe("corrosiveHazmatClass8");
  });

  test("picks highest confidence when multiple detections match same role", () => {
    const results = [
      makeImageResult([
        makeDetection("d1", "corrosiveHazmatClass8", "hazardClass8", 0.7, 100),
      ]),
      makeImageResult([
        makeDetection("d2", "corrosiveHazmatClass8", "hazardClass8", 0.95, 150),
      ]),
    ];
    const sddgData = { hazardClass: "8", subsidiaryRisk: "" };

    const result = classifyHazardLabels(results, sddgData);

    expect(result.primaryDetection!.detectionId).toBe("d2");
    expect(result.primaryDetection!.confidence).toBe(0.95);
  });
});

describe("labelMatchingTable contract", () => {
  test("every hazardClass entry has a bare class number as second element", () => {
    const { labelMatchingTable } = require("../../utils/labelMatchingTable");
    const classMapping = require("../../ml/data/class_mapping.json");

    // Build set of classNames that belong to hazardClass categories
    const hazardClassNames = new Set<string>();
    for (const entry of Object.values(classMapping) as Array<{ name: string; category: string }>) {
      if (entry.category.startsWith("hazardClass")) {
        hazardClassNames.add(entry.name);
      }
    }

    const failures: string[] = [];
    for (const className of hazardClassNames) {
      const mapped = labelMatchingTable[className];
      if (!mapped) continue; // Not all classNames must be in the table
      if (mapped.length < 2) continue;
      const bareClass = mapped[1];
      if (!/^\d/.test(bareClass)) continue;
      if (!/^\d+(\.\d+)?([A-Z])?$/.test(bareClass)) {
        failures.push(`${className}: second element \"${bareClass}\" is not a numeric hazard class`);
      }
    }

    expect(failures).toEqual([]);
  });
});
