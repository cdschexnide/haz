export type ParsedQuantityUnit = "kg" | "g" | "l" | "ml";

export interface ParsedQuantity {
  value: number;
  unit: ParsedQuantityUnit;
}

export interface ParsedQuantityAndPacking {
  raw: string;
  normalized: string;
  packageCount: number | null;
  packagingDescription: string | null;
  packagingCode: string | null;
  quantityPerPackage: ParsedQuantity | null;
  totalQuantity: ParsedQuantity | null;
  isExplosiveWeight: boolean;
  isGrossWeight: boolean;
  isOverpackUsed: boolean;
  hasEachQualifier: boolean;
}

const UNIT_MATCH = "(KG|G|L|ML)";
const NUMBER_MATCH = "([0-9]*\\.?[0-9]+)";

const normalizeUnit = (unit: string): ParsedQuantityUnit => {
  const normalized = unit.toLowerCase();
  if (normalized === "ml") return "ml";
  if (normalized === "l") return "l";
  if (normalized === "g") return "g";
  return "kg";
};

const parseQuantity = (value: string, unit: string): ParsedQuantity => ({
  value: parseFloat(value),
  unit: normalizeUnit(unit),
});

const extractPackagingCode = (normalized: string): string | null => {
  const parenthetical = [...normalized.matchAll(/\(([^)]+)\)/g)];
  for (const match of parenthetical) {
    const content = match[1] || "";
    const codeMatch = content.match(/\b\d[A-Z]\d?[A-Z]?\b/);
    if (codeMatch) {
      return codeMatch[0];
    }
  }
  return null;
};

const extractTotalQuantity = (normalized: string): ParsedQuantity | null => {
  const totalMatch = normalized.match(
    new RegExp(`TOTAL\\s*${NUMBER_MATCH}\\s*${UNIT_MATCH}\\b`, "i")
  );
  if (!totalMatch) return null;
  return parseQuantity(totalMatch[1], totalMatch[2]);
};

const extractEachQuantity = (normalized: string): ParsedQuantity | null => {
  const eachMatch = normalized.match(
    new RegExp(
      `(?:@|PER)?\\s*${NUMBER_MATCH}\\s*${UNIT_MATCH}\\s*EACH\\b`,
      "i"
    )
  );
  if (!eachMatch) return null;
  return parseQuantity(eachMatch[1], eachMatch[2]);
};

const extractXQuantity = (normalized: string) => {
  const matches = [
    ...normalized.matchAll(
      new RegExp(`\\bX\\s*${NUMBER_MATCH}\\s*${UNIT_MATCH}\\b\\s*(G)?\\b`, "g")
    ),
  ];
  if (matches.length === 0) return null;
  const last = matches[matches.length - 1];
  return {
    quantity: parseQuantity(last[1], last[2]),
    isGrossWeight: Boolean(last[3]),
    index: last.index ?? normalized.length,
  };
};

const extractFirstQuantity = (normalized: string) => {
  const match = normalized.match(
    new RegExp(`\\b${NUMBER_MATCH}\\s*${UNIT_MATCH}\\b\\s*(G)?\\b`, "i")
  );
  if (!match) return null;
  return {
    quantity: parseQuantity(match[1], match[2]),
    isGrossWeight: Boolean(match[3]),
    index: match.index ?? normalized.length,
  };
};

export const parseQuantityAndPacking = (
  raw: string | null | undefined
): ParsedQuantityAndPacking => {
  const trimmed = (raw || "").trim();
  const normalized = trimmed.replace(/\s+/g, " ").toUpperCase();

  const packageCountMatch = normalized.match(/^\s*(\d+)\b/);
  const packageCount = packageCountMatch
    ? parseInt(packageCountMatch[1], 10)
    : null;

  const packagingCode = extractPackagingCode(normalized);
  const totalQuantity = extractTotalQuantity(normalized);
  const eachQuantity = extractEachQuantity(normalized);
  const xQuantity = extractXQuantity(normalized);
  const firstQuantity = extractFirstQuantity(normalized);

  let quantityPerPackage: ParsedQuantity | null = null;
  let isGrossWeight = false;
  let quantityIndex = normalized.length;
  let hasEachQualifier = false;

  if (eachQuantity) {
    quantityPerPackage = eachQuantity;
    hasEachQualifier = true;
    const eachMatch = normalized.match(
      new RegExp(`${NUMBER_MATCH}\\s*${UNIT_MATCH}\\s*EACH\\b`, "i")
    );
    if (eachMatch?.index !== undefined) {
      quantityIndex = eachMatch.index;
    }
  } else if (xQuantity) {
    quantityPerPackage = xQuantity.quantity;
    isGrossWeight = xQuantity.isGrossWeight;
    quantityIndex = xQuantity.index;
  } else if (firstQuantity) {
    quantityPerPackage = firstQuantity.quantity;
    isGrossWeight = firstQuantity.isGrossWeight;
    quantityIndex = firstQuantity.index;
  }

  const isExplosiveWeight = /\bN\.?E\.?W\b|\bNEW\b/i.test(normalized);
  const isOverpackUsed = normalized.includes("OVERPACK");

  const countEndIndex =
    packageCountMatch?.index !== undefined
      ? packageCountMatch.index + packageCountMatch[0].length
      : 0;
  const descriptionEndIndex =
    quantityIndex > countEndIndex ? quantityIndex : normalized.length;

  let description = normalized
    .slice(countEndIndex, descriptionEndIndex)
    .replace(/\([^)]*\)/g, " ")
    .replace(/\bX\b/gi, " ")
    .replace(/\b@/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!description) {
    description = null;
  }

  return {
    raw: trimmed,
    normalized,
    packageCount,
    packagingDescription: description,
    packagingCode,
    quantityPerPackage,
    totalQuantity,
    isExplosiveWeight,
    isGrossWeight,
    isOverpackUsed,
    hasEachQualifier,
  };
};
