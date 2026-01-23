import { validatePackagingCodeV2 } from "../packagingWizardV2Helpers";
import { validatePopMarking } from "../validatePopMarking";
import { hazardousMaterialsList } from "@/hazardousMaterials/hazardousMaterialsList";
import { packagingDatabaseV2 } from "../../../server/lookupFunctions/packagingLookupV2";
import { class1ScenarioFixtures } from "@/testScenarios/class1-packaging-paragraphs.fixture";

function normalizeParagraph(paragraph: string): string {
  if (!paragraph) return "";
  return paragraph.endsWith(".") ? paragraph : `${paragraph}.`;
}

function findInvalidPackagingCode(alterations: { alteration: string }[]): string | null {
  for (const alteration of alterations) {
    if (!/POP marking/i.test(alteration.alteration)) continue;
    const match = alteration.alteration.match(/\b[0-9][A-Z][0-9A-Z]{0,2}\b/);
    if (match) return match[0];
  }
  return null;
}

describe("POP marking validation - Class 1 scenarios", () => {
  test("allowed packaging codes are valid for their packaging paragraph", () => {
    const failures: string[] = [];

    for (const scenario of class1ScenarioFixtures) {
      const paragraph = normalizeParagraph(scenario.packagingParagraph);
      const allowedCodes = scenario.expectedPackage.pop.allowedCodes;
      if (!paragraph || allowedCodes.length === 0) continue;

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

  test("known invalid packaging codes fail validation", () => {
    const failures: string[] = [];

    for (const scenario of class1ScenarioFixtures) {
      const paragraph = normalizeParagraph(scenario.packagingParagraph);
      if (!paragraph) continue;

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

  test("class 1 packing group requires X or Y in POP validation", () => {
    const failures: string[] = [];

    for (const scenario of class1ScenarioFixtures) {
      const material = hazardousMaterialsList.find(
        item => item.unid === scenario.unNumber
      );
      if (!material) continue;

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

      const validResult = validatePopMarking(
        material,
        lookupOutput,
        code,
        "X"
      );
      if (!validResult.isValid) {
        failures.push(
          `Scenario ${scenario.scenario}: expected POP code ${code} with PG X to be valid`
        );
      }

      const invalidResult = validatePopMarking(
        material,
        lookupOutput,
        code,
        "Z"
      );
      if (invalidResult.isValid) {
        failures.push(
          `Scenario ${scenario.scenario}: expected POP code ${code} with PG Z to be invalid`
        );
      }
    }

    expect(failures).toEqual([]);
  });
});
