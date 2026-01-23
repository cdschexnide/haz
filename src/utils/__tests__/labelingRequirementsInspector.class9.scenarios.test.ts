import { evaluateLabelingRequirements } from "../labelingRequirementsInspector";
import { hazardousMaterialsList } from "@/hazardousMaterials/hazardousMaterialsList";
import {
  ExtractedSDDGContent,
  SDDGInspectionContext,
} from "@//types/sddg";
import { class9ScenarioFixtures } from "@/testScenarios/class9-comprehensive-packaging-paragraphs.fixture";

function normalizeParagraph(paragraph: string): string {
  if (!paragraph) return "";
  return paragraph.endsWith(".") ? paragraph : `${paragraph}.`;
}

function buildContextFromScenario(
  scenario: (typeof class9ScenarioFixtures)[number]
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
  const singleMatch = label.match(/\b([0-9])\\b/);
  if (singleMatch) return singleMatch[1];
  return null;
}

function expectedSubsidiaryClasses(label: string): string[] {
  const matches = label.match(/\\b(\\d(?:\\.\\d)?)\\b/g);
  return matches ? matches.map(match => match.trim()) : [];
}

function normalizeSubsidiaryLabel(label: string): string {
  return label.replace(/\s+/g, " ").toUpperCase();
}

describe("Labeling requirements - Class 9 scenarios", () => {
  test("expected labels are present in evaluateLabelingRequirements output", () => {
    const failures: string[] = [];

    for (const scenario of class9ScenarioFixtures) {
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

        if (/class 9|miscellaneous/i.test(label)) {
          const hazardClass = extractHazardClassFromLabel(label) || "9";
          const primary = result["Primary Hazard"] || [];
          const expected = `Class ${hazardClass}`;
          if (!primary.includes(expected)) {
            failures.push(
              `Scenario ${scenario.scenario}: missing Primary Hazard ${expected}`
            );
          }
        }

        if (/magnetized/i.test(label)) {
          const hasMagnetized = Object.keys(result).some(key =>
            key.toLowerCase().includes("magnetized")
          );
          if (!hasMagnetized) {
            failures.push(
              `Scenario ${scenario.scenario}: missing Magnetized Material label requirement`
            );
          }
        }

        if (/subsidiary|corrosive|flammable|toxic/i.test(label)) {
          const subsidiary = result["Subsidiary Hazard"] || [];
          const expectedClasses = expectedSubsidiaryClasses(label);
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
