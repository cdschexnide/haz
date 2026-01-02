import { HazardousMaterialItem } from "../../types";

export interface IsOrganicPeroxideInput {
  hazardousMaterial?: HazardousMaterialItem;
}

interface IsOrganicPeroxideOutput {
  isOrganicPeroxide: boolean;
}

const isOrganicPeroxide = (
  input: IsOrganicPeroxideInput
): IsOrganicPeroxideOutput => {
  const { hazardousMaterial } = input;

  if (hazardousMaterial?.hazclassDiv === "5.2") {
    return {
      isOrganicPeroxide: true,
    };
  }

  return {
    isOrganicPeroxide: false,
  };
};

export default isOrganicPeroxide;
