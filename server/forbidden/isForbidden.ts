import { forbiddenProperShippingNames } from "./forbiddenProperShippingNames";
import { HazardousMaterialItem, HazardousMaterialContext } from "../../types";

export interface IsForbiddenInput {
  hazardousMaterial?: HazardousMaterialItem;
  context?: HazardousMaterialContext;
  hazardousMaterials: HazardousMaterialItem[];
}

interface IsForbiddenOutput {
  isForbidden: boolean;
  message: string;
  applicableDocumentNodeIds: string[];
}

const isForbidden = (input: IsForbiddenInput): IsForbiddenOutput => {
  const { hazardousMaterial, context, hazardousMaterials } = input;

  const normalizedProperShippingName =
    context?.hazardousMaterial?.properShippingName.toLowerCase();

  const isHazardousMaterialForbiddenFoundInPSNList =
    forbiddenProperShippingNames.some(
      name => name.toLowerCase() === normalizedProperShippingName
    );

  const hazardousMaterialFromList = hazardousMaterials.find(
    material =>
      (hazardousMaterial &&
        material.unid
          .toLowerCase()
          .includes(hazardousMaterial.unid.toLowerCase())) ||
      material.properShippingName
        .toLowerCase()
        .includes(hazardousMaterial?.properShippingName?.toLowerCase() || "")
  );

  if (
    isHazardousMaterialForbiddenFoundInPSNList ||
    hazardousMaterialFromList?.packagingParagraph === "FORBIDDEN"
  ) {
    return {
      isForbidden: true,
      message: `According to Table A4.1., ${context?.hazardousMaterial?.properShippingName} (${context?.hazardousMaterial?.unid}) is forbidden. Forbidden item(s) may not be shipped via military airlift unless waived per paragraph 2.3.1.`,
      applicableDocumentNodeIds: ["Table A4.1."],
    };
  }

  return {
    isForbidden: false,
    message: `According to Table A4.1., ${context?.hazardousMaterial?.properShippingName} (${context?.hazardousMaterial?.unid}) is not forbidden.`,
    applicableDocumentNodeIds: ["Table A4.1."],
  };
};

export default isForbidden;
