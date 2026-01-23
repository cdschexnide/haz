import { evaluateLabelingRequirements } from "../labelingRequirementsInspector";
import { hazardousMaterialsList } from "@/hazardousMaterials/hazardousMaterialsList";
import {
  ExtractedSDDGContent,
  SDDGInspectionContext,
} from "@//types/sddg";
import { class5ScenarioFixtures } from "@/testScenarios/class5-packaging-paragraphs.fixture";

function normalizeParagraph(paragraph: string): string {
  if (!paragraph) return "";
  return paragraph.endsWith(".") ? paragraph : `${paragraph}.`;
}

function buildContextFromScenario(
  scenario: (typeof class5ScenarioFixtures)[number]
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
  const directMatch = label.match(/\bClass\\s*([0-9](?:\\.[0-9])?)\\b/i);
  if (directMatch) return directMatch[1];
  const numericMatch = label.match(/\b([0-9]\\.[0-9])\\b/);
  if (numericMatch) return numericMatch[1];
  return null;
}

function normalizeSubsidiaryLabel(label: string): string {
  return label.replace(/\s+/g, " ").toUpperCase();
}

function expectedSubsidiaryClasses(label: string): string[] {
  const matches = label.match(/\\b(\\d(?:\\.\\d)?)\\b/g);
  return matches ? matches.map(match => match.trim()) : [];
}

describe("Labeling requirements - Class 5 scenarios", () => {
  test("expected labels are present in evaluateLabelingRequirements output", () => {
    const failures: string[] = [];

    for (const scenario of class5ScenarioFixtures) {
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

        if (/oxidizer|oxidi[sz]er|class 5/i.test(label)) {
          const hazardClass = extractHazardClassFromLabel(label) || "5.1";
          const primary = result["Primary Hazard"] || [];
          const expected = `Class ${hazardClass}`;
          if (!primary.includes(expected)) {
            failures.push(
              `Scenario ${scenario.scenario}: missing Primary Hazard ${expected}`
            );
          }
        }

        if (/corrosive|toxic|subsidiary/i.test(label)) {
          const subsidiary = result["Subsidiary Hazard"] || [];
          const expectedClasses = expectedSubsidiaryClasses(label);
          const actualClasses = subsidiary.flatMap(value =>
            value.match(/\d(?:\.\d)?/g)?.map(match => match.trim()) || []
          );
          if (expectedClasses.length === 0) {
            const normalizedLabel = normalizeSubsidiaryLabel(label);
            const match = subsidiary.some(value =>
              normalizeSubsidiaryLabel(value).includes(normalizedLabel)
            );
            if (!match) {
              failures.push(
                `Scenario ${scenario.scenario}: missing Subsidiary Hazard ${label}`
              );
            }
          }
          for (const expectedClass of expectedClasses) {
            if (!actualClasses.includes(expectedClass)) {
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
