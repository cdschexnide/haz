import { HazardousMaterialItem, PhysicalState } from "../../types";

export const getHazardousMaterialPhysicalState = (
  hazardousMaterial: HazardousMaterialItem
): PhysicalState => {
  const hazardClass = hazardousMaterial.hazclassDiv.slice(0, 1);

  switch (hazardClass) {
    case "1":
    case "4":
    case "7":
      return PhysicalState.SOLID;

    case "2":
      return PhysicalState.GAS;

    case "3":
    case "8":
      return PhysicalState.LIQUID;

    case "5":
      // Oxidizers/peroxides can be solid or liquid — defaulting to solid for generalization
      return PhysicalState.SOLID;

    case "6":
    case "9":
      // Highly variable; return a default or fallback
      return PhysicalState.SOLID;

    default:
      // Unknown or malformed hazclassDiv
      return PhysicalState.SOLID;
  }
};

export const getHazardousMaterialPhysicalStateByHazardClass = (
  hazardClass: string
): PhysicalState => {
  switch (hazardClass) {
    case "1":
    case "4":
    case "7":
      return PhysicalState.SOLID;

    case "2":
      return PhysicalState.GAS;

    case "3":
    case "8":
      return PhysicalState.LIQUID;

    case "5":
      // Oxidizers/peroxides can be solid or liquid — defaulting to solid for generalization
      return PhysicalState.SOLID;

    case "6":
    case "9":
      // Highly variable; return a default or fallback
      return PhysicalState.SOLID;

    default:
      // Unknown or malformed hazclassDiv
      return PhysicalState.SOLID;
  }
};
