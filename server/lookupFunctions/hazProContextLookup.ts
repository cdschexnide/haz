import {
  hazardousSubstancesCriteriaMap,
  ReportableQuantityCriteria,
} from "./hazardousSubstanceCriteria";
import {
  getSpecialProvisions,
  SpecialProvisionsOutput,
} from "./parseSpecialProvisionCodes";
import { packagingLookup, PackagingLookupOutput } from "./packagingLookup";
import {
  AbsorbentMaterialRequirement,
  absorbentMaterialRequirementLookup,
} from "./absorbentMaterialRequirementLookup";
import { hazardousMaterialsList } from "../../src/hazardousMaterials/hazardousMaterialsList";
import { HazardousMaterialContext, PhysicalState } from "../../types";
import {
  SpecialProvisionsMap,
  specialProvisionsMap,
} from "./specialProvisions";

export interface HazProContextLookupInput {
  context: HazardousMaterialContext;
  specialProvisionsMap: SpecialProvisionsMap;
  dotCylinderSpecifications: string[];
  inputDotCylinderSpecification?: string;
  liquidQuantityInLiters?: number;
  isCombinationPackaging?: boolean;
  innerPackagingMaterial?: string;
}

export interface HazProContextLookupOutput {
  packaging: {
    packagingOptionsAndInstructions:
      | PackagingLookupOutput["packagingInstructions"]
      | undefined;
    packagingAuthorization: string[];
  };
  packingGroup: string[];
  specialProvisions: SpecialProvisionsOutput;
  pCode: string;
  isRadioactive: boolean;
  absorbentCushioningCriteria?: AbsorbentMaterialRequirement;
  reportableQuantityRequirement?: ReportableQuantityCriteria;
}

export const hazProContextLookup = (
  input: HazProContextLookupInput
): HazProContextLookupOutput | string => {
  const {
    context,
    specialProvisionsMap,
    dotCylinderSpecifications,
    inputDotCylinderSpecification,
    liquidQuantityInLiters,
    isCombinationPackaging,
    innerPackagingMaterial,
  } = input;

  const hazardousMaterialItem = hazardousMaterialsList.find(
    hazardousMaterialItem =>
      hazardousMaterialItem.unid === context.hazardousMaterial?.unid &&
      hazardousMaterialItem.properShippingName ===
        context.hazardousMaterial.properShippingName
  );

  if (!hazardousMaterialItem) {
    return "Item is not found in Table A4.1. (Alphabetical Listing of Items) in AFMAN24-604.";
  }

  const packagingParagraphAuthorizationReferences = context.hazardousMaterial
    ?.packagingParagraph
    ? context.hazardousMaterial.packagingParagraph.split(", ")
    : [];

  const packagingOptionsAndInstructions = packagingLookup(
    context.hazardousMaterial
  );

  if (
    packagingParagraphAuthorizationReferences.some(auth =>
      auth.startsWith("A6")
    ) &&
    inputDotCylinderSpecification
  ) {
    if (!dotCylinderSpecifications.includes(inputDotCylinderSpecification)) {
      return "The DOT Cylinder Specification is invalid.";
    }
  }

  const packingGroup = context.hazardousMaterial?.packingGroup
    ? context.hazardousMaterial.packingGroup.split(" ")
    : [];

  const specialProvisionsArray = context.hazardousMaterial?.specialProvision
    ? context.hazardousMaterial.specialProvision.split(", ")
    : [];

  const pCodeMatch = specialProvisionsArray.find(provision =>
    /^P[1-5]$/.test(provision)
  );
  const pCode = pCodeMatch || "";

  const filteredSpecialProvisionsMap: SpecialProvisionsMap = Object.fromEntries(
    Object.entries(specialProvisionsMap).filter(
      ([key]) => !/^P[1-5]$/.test(key)
    )
  );

  const parsedSpecialProvisions = getSpecialProvisions({
    context,
    specialProvisionsMap: filteredSpecialProvisionsMap,
  });

  const reportableQuantityRequirement =
    Object.entries(hazardousSubstancesCriteriaMap).find(
      ([key]) =>
        key.toLowerCase() ===
        context.hazardousMaterial?.properShippingName.toLowerCase()
    )?.[1] || undefined;

  if (
    context.physicalState === PhysicalState.LIQUID &&
    typeof liquidQuantityInLiters !== "undefined" &&
    typeof isCombinationPackaging !== "undefined" &&
    typeof innerPackagingMaterial !== "undefined"
  ) {
    const absorbentCushioningRequired = absorbentMaterialRequirementLookup(
      context,
      liquidQuantityInLiters,
      isCombinationPackaging,
      innerPackagingMaterial
    );

    return {
      packaging: {
        packagingOptionsAndInstructions:
          packagingOptionsAndInstructions?.packagingInstructions,
        packagingAuthorization: packagingParagraphAuthorizationReferences,
      },
      packingGroup,
      specialProvisions: parsedSpecialProvisions,
      pCode,
      isRadioactive:
        context.hazardousMaterial?.hazclassDiv.startsWith("7") || false,
      absorbentCushioningCriteria: absorbentCushioningRequired,
      reportableQuantityRequirement,
    };
  }

  return {
    packaging: {
      packagingOptionsAndInstructions:
        packagingOptionsAndInstructions?.packagingInstructions,
      packagingAuthorization: packagingParagraphAuthorizationReferences,
    },
    packingGroup,
    specialProvisions: parsedSpecialProvisions,
    pCode,
    isRadioactive:
      context.hazardousMaterial?.hazclassDiv.startsWith("7") || false,
    reportableQuantityRequirement,
  };
};

// const mockHazardousMaterial = {
//   isFixed: "",
//   isDomesticShipment: false,
//   isTechnicalNameRequired: false,
//   unid: "UN2051",
//   properShippingName: "2-DIMETHYLAMINOETHANOL",
//   hazclassDiv: "8",
//   subsidiaryRisk: "3",
//   packingGroup: "II",
//   specialProvision: "P5",
//   packagingParagraph: "A12.2.",
// };

// const mockMarkingLookupInput: MarkingLookupInput = {
//   hazardousMaterial: mockHazardousMaterial,
//   isLimitedQuantity: false,
//   isExceptedQuantity: false,
//   technicalName: undefined,
//   dotSpecialPermits: undefined,
//   hasOrientationLabels: false,
//   isOverpack: false,
//   isFreightContainer: false,
//   olderThanJanuary1st1990: false,
//   containsLiquids: false,
//   containsInstalledExplosiveDevices: false,
//   authorizedToShipUnpacked: false,
//   fireExtinguisherRequirements: {
//     yearOfTest: "2024",
//     manufacturedBeforeJanuary1st1976: false,
//   },
//   isClass3FlammableLiquid: false,
//   dotCylinderSpecification: undefined,
//   emergencyContact: undefined,
//   contactResponsibleForInfectiousSubstance: undefined,
//   radioactiveMassMeasurements: undefined,
//   containsDryIce: false,
//   dryIceQuantityMeasurement: undefined,
//   packageCapacity: undefined,
//   packageType: undefined,
//   countryOfOrigin: undefined,
//   manufacturer: undefined,
//   indentificationMarkAllocatedByNRCorUSCompetentAuthority: undefined,
//   serialNumber: undefined,
//   containsWheelchairBattery: false,
//   isCratedOrEnclosed: false,
//   dryIceQuantity: undefined,
//   containsExceptedLithiumBatteries: false,
//   containsButtonCellBatteries: false,
//   smallBatteryCount: false,
// };

// const labelingLookupInput: LabelingLookupInput = {
//   hazardousMaterial: mockHazardousMaterial,
//   isLimitedQuantity: false,
//   isExceptedQuantity: false,
//   isOverpack: false,
//   isPalletized: true,
//   containsHazardousWaste: true,
//   containsMagnetizedMaterial: false,
//   hasOrientationLabels: true,
//   requiresRadioactiveLabel: false,
//   containsExplosives: false,
//   dotSpecialPermits: {
//     isDomesticExemption: false,
//   },
// };
// const mockContextInput: HazProContextLookupInput = {
//   context: {
//     hazardousMaterial: mockHazardousMaterial,
//     packagingParameters: {
//       liquidQuantityInLiters: 2,
//     },
//     isCombinationPackaging: true,
//     innerPackagingMaterial: "glass",
//     physicalState: PhysicalState.LIQUID,
//   },
//   specialProvisionsMap,
//   dotCylinderSpecifications,
//   markingContext: mockMarkingLookupInput,
//   labelingContext: labelingLookupInput,
// };
