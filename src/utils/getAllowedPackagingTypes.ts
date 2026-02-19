import { packagingDatabaseV2 } from "../../server/lookupFunctions/packagingLookupV2";
import { PackagingOption, PackagingParagraphEntry } from "@/types/packagingStructure";
import { PhysicalState } from "@/types";
import { hazardousMaterialsList } from "@/hazardousMaterials/hazardousMaterialsList";

export type PackagingTypeSelection = "single" | "combination" | "composite";

const PACKAGING_TYPE_ORDER: PackagingTypeSelection[] = [
  "single",
  "combination",
  "composite",
];

const PACKAGING_SELECTION_TO_OPTION_TYPES: Record<
  PackagingTypeSelection,
  string[]
> = {
  single: ["single", "cylinder"],
  combination: ["combination"],
  composite: ["composite", "composite_plastic", "composite_glass"],
};

const A13_2_LIQUID_UNIDS = new Set([
  "UN1941",
  "UN1990",
  "UN2315",
  "UN3082",
  "UN3151",
  "NA3082",
  "NA3334",
]);

const A13_2_SOLID_UNIDS = new Set([
  "NA1350",
  "NA3077",
  "UN1931",
  "UN2071",
  "UN2216",
  "UN2969",
  "UN3077",
  "UN3152",
  "UN3432",
]);

const normalizeParagraphKey = (paragraphId: string): string => {
  const trimmed = paragraphId.trim().toUpperCase();
  if (!trimmed) {
    return "";
  }
  return trimmed.endsWith(".") ? trimmed : `${trimmed}.`;
};

const getPrimaryParagraph = (paragraphValue: string): string => {
  if (!paragraphValue) {
    return "";
  }
  const primary = paragraphValue.split(/[,:]/)[0]?.trim() || "";
  return primary;
};

const getA13_2PhysicalState = (
  unIdNo?: string,
  properShippingName?: string
): PhysicalState => {
  const normalizedUnId = (unIdNo || "").toUpperCase();
  const psn = (properShippingName || "").toLowerCase();

  if (
    A13_2_LIQUID_UNIDS.has(normalizedUnId) ||
    psn.includes("liquid") ||
    psn.includes("solution")
  ) {
    return PhysicalState.LIQUID;
  }

  if (
    A13_2_SOLID_UNIDS.has(normalizedUnId) ||
    psn.includes("solid") ||
    psn.includes("powder") ||
    psn.includes("flakes") ||
    psn.includes("meal") ||
    psn.includes("scrap") ||
    psn.includes("beans")
  ) {
    return PhysicalState.SOLID;
  }

  return PhysicalState.SOLID;
};

const normalizePackagingTypesFromEntry = (
  options: PackagingOption[]
): PackagingTypeSelection[] => {
  const types = new Set<PackagingTypeSelection>();
  options.forEach(option => {
    const normalizedType = option.type.toLowerCase();
    if (normalizedType === "single" || normalizedType === "combination") {
      types.add(normalizedType as PackagingTypeSelection);
      return;
    }
    if (normalizedType === "cylinder") {
      types.add("single");
      return;
    }
    if (normalizedType.startsWith("composite")) {
      types.add("composite");
    }
  });

  return PACKAGING_TYPE_ORDER.filter(type => types.has(type));
};

const filterOptionsByApplicableUN = (
  options: PackagingOption[],
  unIdNo?: string
): PackagingOption[] => {
  const normalizedUnId = (unIdNo || "").toUpperCase();
  if (!normalizedUnId) {
    return options;
  }

  const hasExplicitMatch = options.some(option =>
    option.applicableUNNumbers
      ?.map(un => un.toUpperCase())
      .includes(normalizedUnId)
  );

  return options.filter(option => {
    if (
      hasExplicitMatch &&
      (!option.applicableUNNumbers || option.applicableUNNumbers.length === 0)
    ) {
      return false;
    }
    if (
      option.applicableUNNumbers &&
      option.applicableUNNumbers.length > 0 &&
      !option.applicableUNNumbers
        .map(un => un.toUpperCase())
        .includes(normalizedUnId)
    ) {
      return false;
    }
    return true;
  });
};

const getRelevantPackagingOptions = ({
  packagingParagraph,
  unIdNo,
  properShippingName,
  packagingDatabase,
}: {
  packagingParagraph: string;
  unIdNo?: string;
  properShippingName?: string;
  packagingDatabase: Record<string, PackagingParagraphEntry>;
}): PackagingOption[] => {
  const hazmatParagraph = hazardousMaterialsList.find(
    item => item.unid === (unIdNo || "").toUpperCase()
  )?.packagingParagraph;
  const resolvedParagraph =
    hazmatParagraph && hazmatParagraph.toUpperCase() !== "FORBIDDEN"
      ? hazmatParagraph
      : packagingParagraph;
  const normalizedParagraph = normalizeParagraphKey(
    getPrimaryParagraph(resolvedParagraph)
  );

  if (!normalizedParagraph) {
    return [];
  }

  if (normalizedParagraph.startsWith("A13.2")) {
    const entry = packagingDatabase["A13.2."];
    if (!entry?.packagingOptions?.length) {
      return [];
    }

    const physicalState = getA13_2PhysicalState(unIdNo, properShippingName);
    const stateKey = physicalState === PhysicalState.LIQUID ? "liquids" : "solids";
    const unFilteredOptions = filterOptionsByApplicableUN(
      entry.packagingOptions,
      unIdNo
    );

    return unFilteredOptions.filter(
      option =>
        option.id.includes(`.${stateKey}_`) ||
        (physicalState === PhysicalState.LIQUID &&
          option.id.includes("otto_fuel_ii"))
    );
  }

  const entry = packagingDatabase[normalizedParagraph];
  if (!entry?.packagingOptions?.length) {
    return [];
  }

  return filterOptionsByApplicableUN(entry.packagingOptions, unIdNo);
};

export const getPackagingTypeSelectionFromContext = (
  packagingType?: string | null
): PackagingTypeSelection | "" => {
  const normalized = (packagingType || "")
    .toLowerCase()
    .replace(/[\s_-]/g, "");

  if (!normalized) {
    return "";
  }
  if (normalized === "single" || normalized === "cylinder") {
    return "single";
  }
  if (normalized === "combination") {
    return "combination";
  }
  if (normalized.startsWith("composite")) {
    return "composite";
  }

  return "";
};

export const resolvePackagingOptionForSelection = ({
  packagingParagraph,
  selection,
  hasA2Restriction,
  unIdNo,
  properShippingName,
  existingOptionId,
  packagingDatabase = packagingDatabaseV2,
}: {
  packagingParagraph: string;
  selection: PackagingTypeSelection;
  hasA2Restriction?: boolean;
  unIdNo?: string;
  properShippingName?: string;
  existingOptionId?: string | null;
  packagingDatabase?: Record<string, PackagingParagraphEntry>;
}): { optionId: string | null; optionType: string | null } => {
  if (hasA2Restriction && selection === "single") {
    return { optionId: null, optionType: null };
  }

  const options = getRelevantPackagingOptions({
    packagingParagraph,
    unIdNo,
    properShippingName,
    packagingDatabase,
  });

  if (!options.length) {
    return { optionId: null, optionType: null };
  }

  const allowedTypes = new Set(PACKAGING_SELECTION_TO_OPTION_TYPES[selection]);
  const matchingOptions = options.filter(option =>
    allowedTypes.has(option.type.toLowerCase())
  );

  if (!matchingOptions.length) {
    return { optionId: null, optionType: null };
  }

  const preferredOption =
    (existingOptionId
      ? matchingOptions.find(option => option.id === existingOptionId)
      : undefined) || matchingOptions[0];

  return {
    optionId: preferredOption.id,
    optionType: preferredOption.type,
  };
};

export const getAllowedPackagingTypes = ({
  packagingParagraph,
  hasA2Restriction,
  unIdNo,
  properShippingName,
  packagingDatabase = packagingDatabaseV2,
}: {
  packagingParagraph: string;
  hasA2Restriction?: boolean;
  unIdNo?: string;
  properShippingName?: string;
  packagingDatabase?: Record<string, PackagingParagraphEntry>;
}): PackagingTypeSelection[] => {
  const relevantOptions = getRelevantPackagingOptions({
    packagingParagraph,
    unIdNo,
    properShippingName,
    packagingDatabase,
  });
  let allowedTypes: PackagingTypeSelection[] =
    normalizePackagingTypesFromEntry(relevantOptions);

  if (!allowedTypes.length) {
    allowedTypes = PACKAGING_TYPE_ORDER;
  }

  if (hasA2Restriction) {
    allowedTypes = allowedTypes.filter(type => type !== "single");
  }

  return allowedTypes;
};
