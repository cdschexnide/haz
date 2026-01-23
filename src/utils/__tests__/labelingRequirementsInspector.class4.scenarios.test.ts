import { evaluateLabelingRequirements } from "../labelingRequirementsInspector";
import { hazardousMaterialsList } from "@/hazardousMaterials/hazardousMaterialsList";
import {
  ExtractedSDDGContent,
  SDDGInspectionContext,
} from "@//types/sddg";
import { class4ScenarioFixtures } from "@/testScenarios/class4-attachment8-comprehensive.fixture";

function normalizeParagraph(paragraph: string): string {
  if (!paragraph) return "";
  return paragraph.endsWith(".") ? paragraph : `${paragraph}.`;
}

function buildContextFromScenario(
  scenario: (typeof class4ScenarioFixtures)[number]
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
  const directMatch = label.match(/\bDivision\\s*(\\d\\.\\d)\\b/i);
  if (directMatch) return directMatch[1];
  const numericMatch = label.match(/\b(\\d\\.\\d)\\b/);
  if (numericMatch) return numericMatch[1];
  return null;
}

function expectedSubsidiaryClasses(label: string): string[] {
  const matches = label.match(/\\b(\\d\\.\\d)\\b/g);
  return matches ? matches.map(match => match.trim()) : [];
}

describe("Labeling requirements - Class 4 scenarios", () => {
  test("expected labels are present in evaluateLabelingRequirements output", () => {
    const failures: string[] = [];

    for (const scenario of class4ScenarioFixtures) {
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

        if (/flammable solid|spontaneously combustible|dangerous when wet|division\\s*4/i.test(label)) {
          const hazardClass = extractHazardClassFromLabel(label) || material.hazclassDiv;
          const primary = result["Primary Hazard"] || [];
          const expected = `Class ${hazardClass}`;
          if (!primary.includes(expected)) {
            failures.push(
              `Scenario ${scenario.scenario}: missing Primary Hazard ${expected}`
            );
          }
        }

        if (/toxic|corrosive|subsidiary/i.test(label)) {
          const subsidiary = result["Subsidiary Hazard"] || [];
          const expectedClasses = expectedSubsidiaryClasses(label);
          for (const expectedClass of expectedClasses) {
            const expected = `Subsidiary Class ${expectedClass}`;
            const match = subsidiary.some(value =>
              value.toUpperCase().includes(expected.toUpperCase())
            );
            if (!match) {
              failures.push(
                `Scenario ${scenario.scenario}: missing Subsidiary Hazard ${expectedClass}`
              );
            }
          }
        }
      }
    }

    expect(failures).toEqual([]);
  });
});
