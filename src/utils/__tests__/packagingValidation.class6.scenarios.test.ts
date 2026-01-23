import { validatePackagingCodeV2 } from "../packagingWizardV2Helpers";
import { validatePopMarking } from "../validatePopMarking";
import { hazardousMaterialsList } from "@/hazardousMaterials/hazardousMaterialsList";
import { packagingDatabaseV2 } from "../../../server/lookupFunctions/packagingLookupV2";
import { class6ScenarioFixtures } from "@/testScenarios/class6-packaging-paragraphs.fixture";

function normalizeParagraph(paragraph: string): string {
  if (!paragraph) return "";
  return paragraph.endsWith(".") ? paragraph : `${paragraph}.`;
}

function findInvalidPackagingCode(alterations: { alteration: string }[]): string | null {
  for (const alteration of alterations) {
    if (!/packaging code|cylinder/i.test(alteration.alteration)) continue;
    const match = alteration.alteration.match(/\b[0-9][A-Z][0-9A-Z]{0,2}\b/);
    if (match) return match[0];
  }
  return null;
}

function expectedPackingGroupCodesFromScenario(packingGroupCode: string): string[] {
  const normalized = packingGroupCode.replace(/\\s+|,|\\./g, "").toUpperCase();
  if (!normalized) return [];
  const includesX = normalized.includes("X");
  const includesY = normalized.includes("Y");
  const includesZ = normalized.includes("Z");
  if (includesX || includesY || includesZ) {
    const codes: string[] = [];
    if (includesX) codes.push("X");
    if (includesY) codes.push("Y");
    if (includesZ) codes.push("Z");
    return codes;
  }
  return ["X", "Y", "Z"];
}

function expectedPackingGroupCodesFromMaterial(packingGroup: string | undefined): string[] {
  switch ((packingGroup || "").toUpperCase()) {
    case "I":
      return ["X"];
    case "II":
      return ["X", "Y"];
    case "III":
      return ["X", "Y", "Z"];
    default:
      return [];
  }
}

describe("POP marking validation - Class 6 scenarios", () => {
  test("allowed packaging codes are valid when packagingDatabaseV2 supports the paragraph", () => {
    const failures: string[] = [];

    for (const scenario of class6ScenarioFixtures) {
      const paragraph = normalizeParagraph(scenario.packagingParagraph);
      const allowedCodes = scenario.expectedPackage.pop.allowedCodes;
      if (!paragraph || allowedCodes.length === 0) continue;
      if (!packagingDatabaseV2[paragraph]) continue;

      const code = allowedCodes[0];
      const result = validatePackagingCodeV2(
        packagingDatabaseV2,
        paragraph,
        code
      );
      if (!result.isValid) {
        failures.push(
          `Scenario ${scenario.scenario}: expected ${code} to be valid for ${paragraph}`
        );
      }
    }

    expect(failures).toEqual([]);
  });

  test("known invalid packaging codes fail validation when packagingDatabaseV2 supports the paragraph", () => {
    const failures: string[] = [];

    for (const scenario of class6ScenarioFixtures) {
      const paragraph = normalizeParagraph(scenario.packagingParagraph);
      if (!paragraph) continue;
      if (!packagingDatabaseV2[paragraph]) continue;

      const invalid =
        findInvalidPackagingCode(scenario.alterations) || "9Z9";
      const allowedCodes = new Set(scenario.expectedPackage.pop.allowedCodes);
      if (allowedCodes.has(invalid)) continue;

      const result = validatePackagingCodeV2(
        packagingDatabaseV2,
        paragraph,
        invalid
      );
      if (result.isValid) {
        failures.push(
          `Scenario ${scenario.scenario}: expected ${invalid} to be invalid for ${paragraph}`
        );
      }
    }

    expect(failures).toEqual([]);
  });

  test("packing group determines valid POP code letters (when packing group exists)", () => {
    const failures: string[] = [];

    for (const scenario of class6ScenarioFixtures) {
      const material = hazardousMaterialsList.find(
        item => item.unid === scenario.unNumber
      );
      if (!material || !material.packingGroup) continue;

      const allowedCodes = scenario.expectedPackage.pop.allowedCodes;
      const code = allowedCodes[0] || "1A1";
      const paragraph = normalizeParagraph(scenario.packagingParagraph);
      const lookupOutput = {
        packaging: {
          packagingOptionsAndInstructions: {
            [paragraph]: {
              packagingInstructions: {
                outerPackaging: {
                  test: [`Test (${code})`],
                },
              },
            },
          },
          packagingAuthorization: [paragraph],
        },
        packingGroup: [],
        specialProvisions: {},
        pCode: "",
        isRadioactive: false,
      };

      const expectedFromScenario = expectedPackingGroupCodesFromScenario(
        scenario.expectedPackage.pop.packingGroupCode
      );
      const expectedFromMaterial = expectedPackingGroupCodesFromMaterial(
        material.packingGroup
      );
      const allowedByPg =
        expectedFromScenario.length > 0
          ? expectedFromScenario
          : expectedFromMaterial;
      if (allowedByPg.length === 0) continue;

      const validPg = allowedByPg[0];
      const invalidPg = "Z";

      const validResult = validatePopMarking(
        material,
        lookupOutput,
        code,
        validPg
      );
      if (!validResult.isValid) {
        failures.push(
          `Scenario ${scenario.scenario}: expected POP code ${code} with PG ${validPg} to be valid`
        );
      }

      if (!allowedByPg.includes(invalidPg)) {
        const invalidResult = validatePopMarking(
          material,
          lookupOutput,
          code,
          invalidPg
        );
        if (invalidResult.isValid) {
          failures.push(
            `Scenario ${scenario.scenario}: expected POP code ${code} with PG ${invalidPg} to be invalid`
          );
        }
      }
    }

    expect(failures).toEqual([]);
  });
});
