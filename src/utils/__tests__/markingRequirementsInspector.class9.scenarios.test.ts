import { evaluateMarkingRequirementsInspector } from "../markingRequirementsInspector";
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

describe("Marking requirements - Class 9 scenarios", () => {
  test("MSL and PSN+UN markings are required for all scenarios", () => {
    const failures: string[] = [];

    for (const scenario of class9ScenarioFixtures) {
      // TODO: UN3166 PSN marking requirement depends on packaged/crated vs readily identifiable
      if (scenario.scenario === 3) continue;

      const material = hazardousMaterialsList.find(
        item => item.unid === scenario.unNumber
      );
      if (!material) continue;

      const context = buildContextFromScenario(scenario);
      const markings = evaluateMarkingRequirementsInspector(context);

      if (!markings["Military Shipping Label (MSL) or DD Form 1387"]) {
        failures.push(
          `Scenario ${scenario.scenario}: missing MSL/DD1387 marking requirement`
        );
      }

      const psnUn = markings["PSN and UN Number"];
      if (!psnUn || psnUn.length === 0) {
        failures.push(
          `Scenario ${scenario.scenario}: missing PSN and UN Number marking requirement`
        );
      } else {
        const expected = `${material.properShippingName} ${material.unid}`;
        if (!psnUn.includes(expected)) {
          failures.push(
            `Scenario ${scenario.scenario}: PSN/UN marking value mismatch (${expected})`
          );
        }
      }
    }

    expect(failures).toEqual([]);
  });
});
