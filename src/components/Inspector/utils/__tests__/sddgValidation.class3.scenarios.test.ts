import {
  getAllRecommendedFrustrations,
  validateSDDGInspection,
} from "../sddgValidation";
import { hazardousMaterialsList } from "@/hazardousMaterials/hazardousMaterialsList";
import { ExtractedSDDGContent } from "@/types/sddg";
import { class3ScenarioFixtures } from "@/testScenarios/class3-packaging-paragraphs.fixture";

const KEY_MAP: Record<string, keyof ExtractedSDDGContent> = {
  "Key 7": "aircraftType",
  "Key 10": "shipmentType",
  "Key 11": "unIdNo",
  "Key 12": "properShippingName",
  "Key 13": "hazardClass",
  "Key 14": "subsidiaryRisk",
  "Key 15": "packingGroup",
  "Key 17": "packingInstruction",
};

function normalizeParagraph(paragraph: string): string {
  if (!paragraph) return "";
  return paragraph.endsWith(".") ? paragraph : `${paragraph}.`;
}

function normalizeExpectedValue(value: string): string {
  if (!value) return "";
  const quoted = value.match(/\"([^\"]+)\"/);
  if (quoted) {
    const quotedValue = quoted[1].trim();
    if (/(^|\b)(empty|none|n\/a)(\b|$)/i.test(quotedValue)) {
      return "";
    }
    return quotedValue;
  }
  const cleaned = value.trim().replace(/\*/g, "");
  if (/(^|\b)(empty|none|n\/a)(\b|$)/i.test(cleaned)) {
    return "";
  }
  return value.replace(/\s*\([^)]*\)\s*$/, "").trim();
}

function normalizeAircraftTypeValue(value: string): string {
  const normalized = value.toUpperCase().trim();
  if (!normalized) return "";
  if (normalized.includes("PASSENGER") && normalized.includes("CARGO")) {
    return "PASSENGER AND CARGO AIRCRAFT";
  }
  if (normalized.includes("CARGO")) {
    return "CARGO AIRCRAFT ONLY";
  }
  return value;
}

function normalizePsnForComparison(value: string): string {
  return value
    .toUpperCase()
    .replace(/\([^)]*\)/g, "")
    .replace(/[.,]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function getExpectedValue(
  expected: Record<string, string>,
  key: string
): string {
  const raw = expected[key] || "";
  return normalizeExpectedValue(raw);
}

function deriveExpectedAircraftType(specialProvision?: string): string {
  if (!specialProvision) return "";
  const match = specialProvision.toUpperCase().match(/\bP([1-5])\b/);
  if (!match) return "";
  const pNumber = match[1];
  if (["1", "2", "3", "4"].includes(pNumber)) return "CARGO AIRCRAFT ONLY";
  if (pNumber === "5") return "PASSENGER AND CARGO AIRCRAFT";
  return "";
}

function buildExtractedContent(
  scenario: (typeof class3ScenarioFixtures)[number]
): ExtractedSDDGContent {
  const material = hazardousMaterialsList.find(
    item => item.unid === scenario.unNumber
  );
  const expected = scenario.expectedSddg;
  const expectedPsn = getExpectedValue(expected, "Key 12");

  const shipmentType =
    getExpectedValue(expected, "Key 10") ||
    (material?.hazclassDiv?.startsWith("7")
      ? "RADIOACTIVE"
      : "NON-RADIOACTIVE");

  const aircraftType =
    normalizeAircraftTypeValue(getExpectedValue(expected, "Key 7")) ||
    deriveExpectedAircraftType(material?.specialProvision);

  return {
    shipper: "",
    consignee: "",
    airWaybillNumber: "",
    pagination: "",
    shippersReferenceNumber: "",
    inspectionActivity: "",
    aircraftType,
    airportOfDeparture: "",
    airportOfDestination: "",
    shipmentType,
    unIdNo: scenario.unNumber,
    properShippingName:
      material?.properShippingName || expectedPsn || "",
    hazardClass:
      getExpectedValue(expected, "Key 13") || material?.hazclassDiv || "",
    subsidiaryRisk:
      getExpectedValue(expected, "Key 14") || material?.subsidiaryRisk || "",
    packingGroup:
      material?.packingGroup || getExpectedValue(expected, "Key 15") || "",
    quantityAndPacking: "",
    packingInstruction:
      normalizeParagraph(material?.packagingParagraph || "") ||
      getExpectedValue(expected, "Key 17"),
    authorization: "",
    additionalHandlingInfo: "",
    nameOfSignatory: "",
    placeAndDate: "",
    signature: "",
  };
}

function normalizeSubsidiaryRisk(value: string | undefined): string {
  return (value || "").replace(/\s+/g, "").toUpperCase();
}

function splitPackingGroups(value: string | undefined): string[] {
  return (value || "")
    .split(/[:/,]/)
    .map(group => group.trim().toUpperCase())
    .filter(Boolean);
}

function splitPackingInstructions(value: string | undefined): string[] {
  return (value || "")
    .split(/[,;:]/)
    .map(entry => normalizeParagraph(entry.trim()))
    .filter(Boolean);
}

function inferTargetKey(alteration: string): keyof ExtractedSDDGContent | null {
  const match = alteration.match(/Key\s*(\d+)/i);
  if (match) {
    const key = `Key ${match[1]}`;
    return KEY_MAP[key] || null;
  }

  if (/UN number|UN\d{4}/i.test(alteration)) return "unIdNo";
  if (/proper shipping name|PSN/i.test(alteration)) return "properShippingName";
  if (/subsidiary/i.test(alteration)) return "subsidiaryRisk";
  if (/packing group/i.test(alteration)) return "packingGroup";
  if (/packaging paragraph|packing instruction/i.test(alteration)) {
    return "packingInstruction";
  }
  if (/hazard class|division|flammable/i.test(alteration)) return "hazardClass";
  if (/aircraft/i.test(alteration)) return "aircraftType";
  if (/radioactive/i.test(alteration)) return "shipmentType";
  return null;
}

function shouldSkipAlteration(
  alteration: { alteration: string; tests: string },
  targetKey: keyof ExtractedSDDGContent,
  material: { properShippingName?: string } | null
): boolean {
  const combined = `${alteration.alteration} ${alteration.tests}`.toLowerCase();
  if (
    combined.includes("label") ||
    combined.includes("marking") ||
    combined.includes("pop")
  ) {
    return true;
  }

  if (targetKey === "properShippingName") {
    const quoted = alteration.alteration.match(/\"([^\"]+)\"/);
    if (quoted && material?.properShippingName) {
      const normalizedQuoted = normalizePsnForComparison(quoted[1]);
      const normalizedMaterial = normalizePsnForComparison(
        material.properShippingName
      );
      if (normalizedQuoted === normalizedMaterial) {
        return true;
      }
    }
  }

  return false;
}

function applyAlteration(
  extracted: ExtractedSDDGContent,
  alteration: string,
  key: keyof ExtractedSDDGContent
): ExtractedSDDGContent {
  const updated = { ...extracted };
  if (key === "aircraftType") {
    const normalizedAircraft = extracted.aircraftType.trim().toUpperCase();
    updated.aircraftType =
      normalizedAircraft === "CARGO AIRCRAFT ONLY"
        ? "PASSENGER AND CARGO AIRCRAFT"
        : "CARGO AIRCRAFT ONLY";
    return updated;
  }
  if (key === "shipmentType") {
    updated.shipmentType =
      extracted.shipmentType === "RADIOACTIVE"
        ? "NON-RADIOACTIVE"
        : "RADIOACTIVE";
    return updated;
  }
  if (key === "unIdNo") {
    const match = alteration.match(/\b[A-Z]{2}\d{4}\b/);
    if (match) {
      updated.unIdNo = match[0];
      return updated;
    }
    const digits = extracted.unIdNo.match(/\d{4}/);
    if (digits) {
      const last = digits[0];
      const next =
        last.slice(0, 3) + ((parseInt(last.slice(-1), 10) + 1) % 10);
      updated.unIdNo = extracted.unIdNo.replace(last, next);
      return updated;
    }
    updated.unIdNo = "UN0000";
    return updated;
  }
  if (key === "properShippingName") {
    const quoted = alteration.match(/\"([^\"]+)\"/);
    updated.properShippingName = quoted ? quoted[1] : "INVALID PSN";
    return updated;
  }
  if (key === "hazardClass") {
    const match = alteration.match(/\b\d\.\d[A-Z]?\b/);
    updated.hazardClass = match ? match[0] : "3";
    return updated;
  }
  if (key === "subsidiaryRisk") {
    if (/empty/i.test(alteration)) {
      updated.subsidiaryRisk = "";
      return updated;
    }
    const match = alteration.match(/\b\d\.\d\b/);
    updated.subsidiaryRisk = match ? match[0] : "6.1";
    return updated;
  }
  if (key === "packingGroup") {
    const match = alteration.match(/\bI{1,3}\b/);
    updated.packingGroup = match ? match[0] : "III";
    return updated;
  }
  if (key === "packingInstruction") {
    const match = alteration.match(/A\d+\.\d+/);
    updated.packingInstruction = match ? match[0] : "A0.0";
    return updated;
  }
  updated[key] = "INVALID" as ExtractedSDDGContent[keyof ExtractedSDDGContent];
  return updated;
}

describe("SDDG recommended frustrations - Class 3 scenarios", () => {
  test("scenario docs align with hazardousMaterialsList", () => {
    const mismatches: string[] = [];

    for (const scenario of class3ScenarioFixtures) {
      const material = hazardousMaterialsList.find(
        item => item.unid === scenario.unNumber
      );
      if (!material) {
        mismatches.push(
          `Scenario ${scenario.scenario}: missing hazmat item for ${scenario.unNumber}`
        );
        continue;
      }

      const expected = scenario.expectedSddg;
      const expectedPsn = getExpectedValue(expected, "Key 12");
      const expectedHazardClass = getExpectedValue(expected, "Key 13");
      const expectedSubsidiaryRisk = getExpectedValue(expected, "Key 14");
      const expectedPackingInstruction = getExpectedValue(expected, "Key 17");
      const expectedPackingGroup = getExpectedValue(expected, "Key 15");
      if (
        expectedPsn &&
        material.properShippingName &&
        !normalizePsnForComparison(expectedPsn).startsWith(
          normalizePsnForComparison(material.properShippingName)
        )
      ) {
        mismatches.push(
          `Scenario ${scenario.scenario}: PSN mismatch (${expectedPsn} vs ${material.properShippingName})`
        );
      }
      if (
        expectedHazardClass &&
        material.hazclassDiv &&
        expectedHazardClass !== material.hazclassDiv
      ) {
        mismatches.push(
          `Scenario ${scenario.scenario}: hazard class mismatch (${expectedHazardClass} vs ${material.hazclassDiv})`
        );
      }
      if (
        expectedSubsidiaryRisk !== "" &&
        normalizeSubsidiaryRisk(expectedSubsidiaryRisk) !==
          normalizeSubsidiaryRisk(material.subsidiaryRisk)
      ) {
        mismatches.push(
          `Scenario ${scenario.scenario}: subsidiary risk mismatch (${expectedSubsidiaryRisk} vs ${material.subsidiaryRisk || "None"})`
        );
      }
      if (
        expectedPackingGroup !== "" &&
        !splitPackingGroups(material.packingGroup).includes(
          expectedPackingGroup.toUpperCase()
        )
      ) {
        mismatches.push(
          `Scenario ${scenario.scenario}: packing group mismatch (${expectedPackingGroup} vs ${material.packingGroup || "None"})`
        );
      }
      if (
        expectedPackingInstruction &&
        !splitPackingInstructions(material.packagingParagraph).includes(
          normalizeParagraph(expectedPackingInstruction)
        )
      ) {
        mismatches.push(
          `Scenario ${scenario.scenario}: packing instruction mismatch (${expectedPackingInstruction} vs ${material.packagingParagraph})`
        );
      }
    }

    expect(mismatches).toEqual([]);
  });

  test("correct SDDG data does not trigger recommendations for keys 7,10,12-15,17", () => {
    const failures: string[] = [];

    for (const scenario of class3ScenarioFixtures) {
      const material = hazardousMaterialsList.find(
        item => item.unid === scenario.unNumber
      );
      if (!material) continue;

      const extracted = buildExtractedContent(scenario);
      const recommendations = getAllRecommendedFrustrations(
        extracted,
        material,
        {
          quantityAndPacking: extracted.quantityAndPacking,
        }
      );
      const flagged = recommendations
        .map(item => item.fieldKey)
        .filter(key =>
          [
            "aircraftType",
            "shipmentType",
            "properShippingName",
            "hazardClass",
            "subsidiaryRisk",
            "packingGroup",
            "packingInstruction",
          ].includes(key)
        );

      if (flagged.length > 0) {
        failures.push(
          `Scenario ${scenario.scenario}: unexpected recommendations for ${flagged.join(", ")}`
        );
      }
    }

    expect(failures).toEqual([]);
  });

  test("alterations trigger recommendations for targeted SDDG keys", () => {
    const failures: string[] = [];

    for (const scenario of class3ScenarioFixtures) {
      const material = hazardousMaterialsList.find(
        item => item.unid === scenario.unNumber
      );
      if (!material) continue;

      const extracted = buildExtractedContent(scenario);
      for (const alteration of scenario.alterations) {
        const targetKey = inferTargetKey(alteration.alteration);
        if (
          !targetKey ||
          targetKey === "unIdNo" ||
          targetKey === "quantityAndPacking"
        ) {
          continue;
        }
        if (shouldSkipAlteration(alteration, targetKey, material)) {
          continue;
        }

        const mutated = applyAlteration(
          extracted,
          alteration.alteration,
          targetKey
        );
        const recommendations = getAllRecommendedFrustrations(
          mutated,
          material,
          {
            quantityAndPacking: mutated.quantityAndPacking,
          }
        );
        const recommendedKeys = recommendations.map(item => item.fieldKey);
        if (!recommendedKeys.includes(targetKey)) {
          failures.push(
            `Scenario ${scenario.scenario} alteration ${alteration.id}: expected recommendation for ${targetKey}`
          );
        }
      }
    }

    expect(failures).toEqual([]);
  });

  test("UN/ID alterations are flagged by validateSDDGInspection", () => {
    const failures: string[] = [];

    for (const scenario of class3ScenarioFixtures) {
      const material = hazardousMaterialsList.find(
        item => item.unid === scenario.unNumber
      );
      if (!material) continue;

      const extracted = buildExtractedContent(scenario);
      for (const alteration of scenario.alterations) {
        const targetKey = inferTargetKey(alteration.alteration);
        if (targetKey !== "unIdNo") continue;

        const mutated = applyAlteration(
          extracted,
          alteration.alteration,
          targetKey
        );
        const results = validateSDDGInspection(mutated, material);
        const unResult = results.find(result => result.key === "unIdNo");
        if (!unResult || unResult.isValid) {
          failures.push(
            `Scenario ${scenario.scenario} alteration ${alteration.id}: expected UN/ID validation failure`
          );
        }
      }
    }

    expect(failures).toEqual([]);
  });
});
