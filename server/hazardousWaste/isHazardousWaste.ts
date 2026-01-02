import { HazardousMaterialItem } from "../../types";

export interface isHazardousWasteInput {
  hazardousMaterial?: HazardousMaterialItem;
}

interface isHazardousWasteOutput {
  isHazardousWaste: boolean;
}

const isHazardousWaste = (
  input: isHazardousWasteInput
): isHazardousWasteOutput => {
  const { hazardousMaterial } = input;

  if (hazardousMaterial?.properShippingName.toLowerCase().includes("waste")) {
    return {
      isHazardousWaste: true,
    };
  }

  return {
    isHazardousWaste: false,
  };
};

export default isHazardousWaste;
