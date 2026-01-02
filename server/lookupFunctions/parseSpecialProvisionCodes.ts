import { HazardousMaterialContext } from "../../types";
import { SpecialProvisionsMap } from "./specialProvisions";

interface GetSpecialProvisionsInput {
  context: HazardousMaterialContext;
  specialProvisionsMap: SpecialProvisionsMap;
}

export interface SpecialProvisionsOutput {
  [key: string]: string;
}

export function getSpecialProvisions(
  input: GetSpecialProvisionsInput
): SpecialProvisionsOutput {
  const { context, specialProvisionsMap } = input;
  const specialProvisionCodes = context.hazardousMaterial?.specialProvision
    ?.split(",")
    .map(code => code.trim());

  if (!specialProvisionCodes || specialProvisionCodes.length === 0) {
    return {};
  }

  const provisions: { [key: string]: string } = {};
  for (const code of specialProvisionCodes) {
    if (specialProvisionsMap[code]) {
      provisions[code] = specialProvisionsMap[code];
    }
  }

  return provisions;
}
