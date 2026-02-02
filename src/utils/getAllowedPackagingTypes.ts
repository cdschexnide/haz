import { packagingDatabaseV2 } from "../../server/lookupFunctions/packagingLookupV2";
import { PackagingParagraphEntry } from "@/types/packagingStructure";
import { PhysicalState } from "@/types";
import { hazardousMaterialsList } from "@/hazardousMaterials/hazardousMaterialsList";

export type PackagingTypeSelection = "single" | "combination" | "composite";

const PACKAGING_TYPE_ORDER: PackagingTypeSelection[] = [
  "single",
  "combination",
  "composite",
];

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
  entry: PackagingParagraphEntry | undefined,
  unIdNo?: string
): PackagingTypeSelection[] => {
  if (!entry?.packagingOptions?.length) {
    return [];
  }

  const normalizedUnId = (unIdNo || "").toUpperCase();
  const hasExplicitMatch = normalizedUnId
    ? entry.packagingOptions.some(option =>
        option.applicableUNNumbers
          ?.map(un => un.toUpperCase())
          .includes(normalizedUnId)
      )
    : false;
  const types = new Set<PackagingTypeSelection>();
  entry.packagingOptions.forEach(option => {
    if (
      hasExplicitMatch &&
      (!option.applicableUNNumbers || option.applicableUNNumbers.length === 0)
    ) {
      return;
    }
    if (
      normalizedUnId &&
      option.applicableUNNumbers &&
      option.applicableUNNumbers.length > 0 &&
      !option.applicableUNNumbers
        .map(un => un.toUpperCase())
        .includes(normalizedUnId)
    ) {
      return;
    }
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
  const hazmatParagraph = hazardousMaterialsList.find(
    item => item.unid === (unIdNo || "").toUpperCase()
  )?.packagingParagraph;
  const resolvedParagraph = hazmatParagraph &&
    hazmatParagraph.toUpperCase() !== "FORBIDDEN"
      ? hazmatParagraph
      : packagingParagraph;
  const normalizedParagraph = normalizeParagraphKey(
    getPrimaryParagraph(resolvedParagraph)
  );
  if (!normalizedParagraph) {
    return PACKAGING_TYPE_ORDER;
  }

  let allowedTypes: PackagingTypeSelection[] = [];

    if (normalizedParagraph.startsWith("A13.2")) {
    const entry = packagingDatabase["A13.2."];
    if (entry?.packagingOptions?.length) {
      const physicalState = getA13_2PhysicalState(unIdNo, properShippingName);
      const stateKey =
        physicalState === PhysicalState.LIQUID ? "liquids" : "solids";
      const types = new Set<PackagingTypeSelection>();
      const normalizedUnId = (unIdNo || "").toUpperCase();
      const hasExplicitMatch = normalizedUnId
        ? entry.packagingOptions.some(option =>
            option.applicableUNNumbers
              ?.map(un => un.toUpperCase())
              .includes(normalizedUnId)
          )
        : false;

      entry.packagingOptions.forEach(option => {
        if (
          hasExplicitMatch &&
          (!option.applicableUNNumbers ||
            option.applicableUNNumbers.length === 0)
        ) {
          return;
        }
        if (
          normalizedUnId &&
          option.applicableUNNumbers &&
          option.applicableUNNumbers.length > 0 &&
          !option.applicableUNNumbers
            .map(un => un.toUpperCase())
            .includes(normalizedUnId)
        ) {
          return;
        }
        const isMatchingState =
          option.id.includes(`.${stateKey}_`) ||
          (physicalState === PhysicalState.LIQUID &&
            option.id.includes("otto_fuel_ii"));
        if (!isMatchingState) {
          return;
        }

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

      allowedTypes = PACKAGING_TYPE_ORDER.filter(type => types.has(type));
    }
  } else {
    allowedTypes = normalizePackagingTypesFromEntry(
      packagingDatabase[normalizedParagraph],
      unIdNo
    );
  }

  if (!allowedTypes.length) {
    allowedTypes = PACKAGING_TYPE_ORDER;
  }

  if (hasA2Restriction) {
    allowedTypes = allowedTypes.filter(type => type !== "single");
  }

  return allowedTypes;
};
