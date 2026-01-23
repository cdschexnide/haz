import { evaluateLabelingRequirements } from "../labelingRequirementsInspector";
import { hazardousMaterialsList } from "@/hazardousMaterials/hazardousMaterialsList";
import {
  ExtractedSDDGContent,
  SDDGInspectionContext,
} from "@//types/sddg";
import { class1ScenarioFixtures } from "@/testScenarios/class1-packaging-paragraphs.fixture";

function normalizeParagraph(paragraph: string): string {
  if (!paragraph) return "";
  return paragraph.endsWith(".") ? paragraph : `${paragraph}.`;
}

function buildContextFromScenario(
  scenario: (typeof class1ScenarioFixtures)[number]
): SDDGInspectionContext {
  const material = hazardousMaterialsList.find(
    item => item.unid === scenario.unNumber
  );
  const extractedContent: ExtractedSDDGContent = {
    shipper: "",
    consignee: "",
    airWaybillNumber: "",
    pagination: "",
    shippersReferenceNumber: "",
    inspectionActivity: "",
    aircraftType: "CARGO AIRCRAFT ONLY",
    airportOfDeparture: "",
    airportOfDestination: "",
    shipmentType: "",
    unIdNo: scenario.unNumber,
    properShippingName: material?.properShippingName || "",
    hazardClass: material?.hazclassDiv || "",
    subsidiaryRisk: material?.subsidiaryRisk || "",
    packingGroup: material?.packingGroup || "",
    quantityAndPacking: "",
    packingInstruction: normalizeParagraph(material?.packagingParagraph || ""),
    authorization: "",
    additionalHandlingInfo: "",
    nameOfSignatory: "",
    placeAndDate: "",
    signature: "",
  };

  return {
    extractedContent,
    verificationCopy: extractedContent,
    originalImageUri: null,
    frustrations: [],
    packageFrustrations: [],
    resolvedFrustrations: [],
    resolvedPackageFrustrations: [],
    magnetizedMaterialInspection: null,
    innerPackagingInspection: null,
    packagePopMarking: null,
    mlAnalysisResults: null,
    inspector: null,
    inspectionStartTime: null,
    inspectionCompleteTime: null,
  } as SDDGInspectionContext;
}

function extractHazardClassFromLabel(label: string): string | null {
  const compatibilityMatch = label.match(
    /\b([0-9]\.[0-9])\b.*compatibility group\s*([A-Z])/i
  );
  if (compatibilityMatch) {
    return `${compatibilityMatch[1]}${compatibilityMatch[2].toUpperCase()}`;
  }
  const directMatch = label.match(/\b([0-9]\.[0-9][A-Z])\b/);
  if (directMatch) return directMatch[1];
  const numericMatch = label.match(/\b([0-9]\.[0-9])\b/);
  if (numericMatch) return numericMatch[1];
  return null;
}

describe("Labeling requirements - Class 1 scenarios", () => {
  test("expected labels are present in evaluateLabelingRequirements output", () => {
    const failures: string[] = [];

    for (const scenario of class1ScenarioFixtures) {
      const material = hazardousMaterialsList.find(
        item => item.unid === scenario.unNumber
      );
      if (!material) continue;

      const context = buildContextFromScenario(scenario);
      const result = evaluateLabelingRequirements(context);

      for (const label of scenario.expectedPackage.labels) {
        if (/Cargo Aircraft Only/i.test(label)) {
          if (!result["Cargo Aircraft Only"]) {
            failures.push(
              `Scenario ${scenario.scenario}: missing Cargo Aircraft Only label requirement`
            );
          }
        }

        if (/Explosive/i.test(label)) {
          const hazardClass = extractHazardClassFromLabel(label);
          if (hazardClass) {
            const primary = result["Primary Hazard"] || [];
            const expected = `Class ${hazardClass}`;
            if (!primary.includes(expected)) {
              failures.push(
                `Scenario ${scenario.scenario}: missing Primary Hazard ${expected}`
              );
            }
          }
        }

        if (/Toxic/i.test(label) && /6\\.1/.test(label)) {
          const subsidiary = result["Subsidiary Hazard"] || [];
          if (!subsidiary.includes("Subsidiary Class 6.1")) {
            failures.push(
              `Scenario ${scenario.scenario}: missing Subsidiary Hazard 6.1`
            );
          }
        }

        if (/orientation|this side up|this way up/i.test(label)) {
          const hasOrientation = Object.keys(result).some(key =>
            key.toLowerCase().includes("orientation")
          );
          if (!hasOrientation) {
            failures.push(
              `Scenario ${scenario.scenario}: missing orientation label requirement`
            );
          }
        }
      }
    }

    expect(failures).toEqual([]);
  });
});
