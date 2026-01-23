import { evaluateMarkingRequirementsInspector } from "../markingRequirementsInspector";
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

describe("Marking requirements - Class 1 scenarios", () => {
  test("MSL and PSN+UN markings are required for all scenarios", () => {
    const failures: string[] = [];

    for (const scenario of class1ScenarioFixtures) {
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

  test("EX/NSN and OVERPACK markings are required when applicable", () => {
    const scenario = class1ScenarioFixtures[0];
    const context = buildContextFromScenario(scenario);
    context.extractedContent.quantityAndPacking = "10 boxes overpack";
    context.verificationCopy.quantityAndPacking = "10 boxes overpack";

    const markings = evaluateMarkingRequirementsInspector(context);

    expect(markings["EX Number/NSN"]).toEqual(["EX number or NSN"]);
    expect(markings["OVERPACK"]).toEqual(["OVERPACK"]);
  });
});
