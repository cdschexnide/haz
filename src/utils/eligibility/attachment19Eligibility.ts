import { hazardousMaterialsList } from "@/hazardousMaterials/hazardousMaterialsList";
import { ExtractedSDDGContent } from "@/types/sddg";
import {
  ExceptedQuantityData,
  HazardousMaterialItem,
  LimitedQuantityData,
} from "../../../types";
import {
  isHazardousMaterialExceptedQuantity,
  IsHazardousMaterialExceptedQuantityInput,
} from "../../../server/attachment19/exceptedQuantities/isHazardousMaterialExceptedQuantity";
import {
  isHazardousMaterialLimitedQuantity,
  IsHazardousMaterialLimitedQuantityInput,
} from "../../../server/attachment19/limitedQuantities/isHazardousMaterialLimitedQuantity";

type QuantityUnitInner = "mL" | "g";
type QuantityUnitOuter = "mL" | "g" | "L" | "kg";
type WeightUnit = "kg" | "lbs";

export interface Attachment19EligibilityInput {
  material?: HazardousMaterialItem;
  sddgContent?: ExtractedSDDGContent;
  quantities?: {
    numberOfInnerPackages?: number;
    quantityPerInnerPackage?: {
      value: number;
      unit: QuantityUnitInner;
    };
    totalPerPackage?: {
      value: number;
      unit: QuantityUnitOuter;
    };
    grossWeight?: {
      value: number;
      unit: WeightUnit;
    };
    isInKit?: boolean;
    mixedMaterials?: ExceptedQuantityData["mixedMaterials"];
    qValue?: number;
  };
}

export interface Attachment19EligibilityResult {
  quantityType: "standard" | "excepted" | "limited";
  exceptedQuantityData: ExceptedQuantityData;
  limitedQuantityData: LimitedQuantityData;
}

const KG_PER_LB = 0.453592;
const ML_PER_L = 1000;
const G_PER_KG = 1000;

const toMl = (
  value: number,
  unit: QuantityUnitOuter | QuantityUnitInner
) => {
  if (unit === "mL") return value;
  if (unit === "L") return value * ML_PER_L;
  return undefined;
};

const toGrams = (
  value: number,
  unit: QuantityUnitOuter | QuantityUnitInner
) => {
  if (unit === "g") return value;
  if (unit === "kg") return value * G_PER_KG;
  return undefined;
};

const toKg = (value: number, unit: WeightUnit) =>
  unit === "kg" ? value : value * KG_PER_LB;

const resolveMaterial = (
  input: Attachment19EligibilityInput
): HazardousMaterialItem | undefined => {
  if (input.material) return input.material;
  if (!input.sddgContent) return undefined;

  const { unIdNo, properShippingName } = input.sddgContent;
  const matchingByUn = hazardousMaterialsList.filter(
    item => item.unid === unIdNo
  );

  if (matchingByUn.length === 1) return matchingByUn[0];
  if (matchingByUn.length > 1) {
    const matchByPsn = matchingByUn.find(
      item =>
        item.properShippingName.trim().toLowerCase() ===
        properShippingName.trim().toLowerCase()
    );
    return matchByPsn || matchingByUn[0];
  }

  return undefined;
};

export const evaluateAttachment19Eligibility = (
  input: Attachment19EligibilityInput
): Attachment19EligibilityResult => {
  const material = resolveMaterial(input);
  const quantities = input.quantities || {};

  const defaultInnerUnit: QuantityUnitInner =
    quantities.quantityPerInnerPackage?.unit || "mL";
  const defaultOuterUnit: QuantityUnitOuter =
    quantities.totalPerPackage?.unit || "mL";

  const buildExceptedData = (
    eligible: boolean,
    exclusionReason?: string,
    exceedsLimits?: boolean
  ): ExceptedQuantityData => ({
    eligible,
    exclusionReason,
    isInKit: quantities.isInKit ?? false,
    numberOfInnerPackages: quantities.numberOfInnerPackages ?? 0,
    quantityPerInnerPackage: {
      value: quantities.quantityPerInnerPackage?.value ?? 0,
      unit: defaultInnerUnit,
    },
    totalOuterQuantity: {
      value: quantities.totalPerPackage?.value ?? 0,
      unit: defaultOuterUnit,
    },
    exceedsLimits: exceedsLimits ?? false,
    limits: {
      maxInner: { value: 0, unit: defaultInnerUnit },
      maxOuter: { value: 0, unit: defaultOuterUnit },
    },
    mixedMaterials: quantities.mixedMaterials,
    qValue: quantities.qValue,
  });

  const buildLimitedData = (
    eligible: boolean,
    exclusionReason?: string,
    permissionReason?: string,
    exceedsLimits?: boolean
  ): LimitedQuantityData => ({
    eligible,
    exclusionReason,
    permissionReason,
    quantityPerInnerPackage: {
      value: quantities.quantityPerInnerPackage?.value ?? 0,
      unit: defaultInnerUnit,
    },
    totalPerPackage: {
      value: quantities.totalPerPackage?.value ?? 0,
      unit: defaultOuterUnit,
    },
    grossWeight: {
      value: quantities.grossWeight?.value ?? 0,
      unit: quantities.grossWeight?.unit ?? "kg",
    },
    exceedsLimits: exceedsLimits ?? false,
    limits: {
      maxInner: { value: 0, unit: defaultInnerUnit },
      maxPerPackage: { value: 0, unit: defaultOuterUnit },
      maxGrossWeight: { value: 30, unit: "kg" },
    },
  });

  if (!material) {
    return {
      quantityType: "standard",
      exceptedQuantityData: buildExceptedData(false, "A19.2"),
      limitedQuantityData: buildLimitedData(false, "A19.3"),
    };
  }

  const isLiquid =
    material.physicalState?.toString().toLowerCase() === "liquid";

  const innerQuantityValue =
    quantities.quantityPerInnerPackage?.value ?? 0;
  const innerQuantityUnit = quantities.quantityPerInnerPackage?.unit;
  const outerQuantityValue = quantities.totalPerPackage?.value ?? 0;
  const outerQuantityUnit = quantities.totalPerPackage?.unit;

  const eqInput: IsHazardousMaterialExceptedQuantityInput = {
    material,
    containedInChemicalKitOrFirstAidKit: quantities.isInKit,
    innerPackagingQuantityIn_mLs:
      isLiquid && innerQuantityUnit
        ? toMl(innerQuantityValue, innerQuantityUnit)
        : undefined,
    outerPackagingQuantityIn_mLs:
      isLiquid && outerQuantityUnit
        ? toMl(outerQuantityValue, outerQuantityUnit)
        : undefined,
    innerPackagingQuantityIn_grams:
      !isLiquid && innerQuantityUnit
        ? toGrams(innerQuantityValue, innerQuantityUnit)
        : undefined,
    outerPackagingQuantityIn_grams:
      !isLiquid && outerQuantityUnit
        ? toGrams(outerQuantityValue, outerQuantityUnit)
        : undefined,
  };

  const eqResult = isHazardousMaterialExceptedQuantity(eqInput);
  const isExceptedEligible = eqResult.isExcepted;
  const eqExceedsLimits =
    eqResult.applicableRule?.includes("A19.2.2") ||
    eqResult.applicableRule?.includes("Table A19.1") ||
    false;

  const lqInput: IsHazardousMaterialLimitedQuantityInput = {
    materials: [
      {
        material,
        packagingQuantities: {
          physicalState: material.physicalState,
          containedInPolyesterResinKitOrChemicalKitOrFirstAidKit:
            quantities.isInKit === true,
          innerPackagingVolumeIn_mL:
            isLiquid && innerQuantityUnit
              ? toMl(innerQuantityValue, innerQuantityUnit)
              : undefined,
          innerPackagingQuantityIn_g:
            !isLiquid && innerQuantityUnit
              ? toGrams(innerQuantityValue, innerQuantityUnit)
              : undefined,
          quantityPerPackageIn_mL:
            isLiquid && outerQuantityUnit
              ? toMl(outerQuantityValue, outerQuantityUnit)
              : undefined,
          quantityPerPackageIn_g:
            !isLiquid && outerQuantityUnit
              ? toGrams(outerQuantityValue, outerQuantityUnit)
              : undefined,
          grossQuantityPerPackageIn_kg: quantities.grossWeight
            ? toKg(quantities.grossWeight.value, quantities.grossWeight.unit)
            : undefined,
        },
      },
    ],
  };

  const lqResult = isHazardousMaterialLimitedQuantity(lqInput);
  const isLimitedEligible = !!lqResult?.isLimited;
  const lqExceedsLimits =
    lqResult?.applicableRule?.includes("A19.3.3") ||
    lqResult?.applicableRule?.includes("Table A19.2") ||
    false;

  const quantityType = isExceptedEligible
    ? "excepted"
    : isLimitedEligible
    ? "limited"
    : "standard";

  return {
    quantityType,
    exceptedQuantityData: buildExceptedData(
      isExceptedEligible,
      isExceptedEligible ? undefined : eqResult.applicableRule,
      eqExceedsLimits
    ),
    limitedQuantityData: buildLimitedData(
      isLimitedEligible,
      isLimitedEligible ? undefined : lqResult?.applicableRule,
      isLimitedEligible ? lqResult?.applicableRule : undefined,
      lqExceedsLimits
    ),
  };
};
