import { dotCylinderSpecifications } from "../../server/lookupFunctions/dotCylinderSpecifications";

export const validateCylinderDOTSpecification = (specification: string) => {
  if (!specification) {
    return { isValid: false, errors: ["Cylinder specification is required."] };
  }

  if (!dotCylinderSpecifications.includes(specification)) {
    return {
      isValid: false,
      errors: [
        `"${specification}" is not a valid DOT cylinder specification. Select a valid specification from the list.`,
      ],
    };
  }

  return { isValid: true, errors: [] };
};
