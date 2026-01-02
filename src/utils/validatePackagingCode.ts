import { packagingParagraphReferenceLookup } from "../../server/lookupFunctions/packagingTypesMap";

type PackagingMethodKey =
  | "singlePackaging"
  | "combinationPackaging"
  | "compositePackagingWithPlasticInnerReceptacles"
  | "compositePackagingWithGlassPorcelainOrStonewareInnerReceptacles";

type DeepUnknown = Record<string, unknown>;

interface PackagingParagraphEntry {
  description: string;
  packagingInstructions: Record<PackagingMethodKey, DeepUnknown>;
}

type PackagingParagraphReferenceLookup = Record<
  string,
  PackagingParagraphEntry
>;

interface ValidationResult {
  isValid: boolean;
  packagingMethod?: PackagingMethodKey;
}

const extractCodes = (s: string): string[] => {
  // Use a regex with string.match approach instead of matchAll for compatibility
  const regexMatches = s.match(/\(([^)]+)\)/g) || [];
  const matches = regexMatches.map((match: string) => match.slice(1, -1));

  const result: string[] = [];

  // Process the extracted content from parentheses
  for (const chunk of matches) {
    const parts = chunk.split(/or/i);
    for (const part of parts) {
      const trimmed = part.trim().toUpperCase();
      if (/^[0-9][A-Z][0-9]$/.test(trimmed)) {
        result.push(trimmed);
      }
    }
  }

  // Also look for codes outside of parentheses
  const standaloneMatches = s.match(/(^|\s)([0-9][A-Z][0-9])($|\s)/g) || [];
  for (const match of standaloneMatches) {
    result.push(match.trim().toUpperCase());
  }

  return result;
};

const collectAllCodes = (node: unknown): string[] => {
  if (node === null || node === undefined) {
    return [];
  }

  if (typeof node === "string") {
    return extractCodes(node);
  }

  if (Array.isArray(node)) {
    const results: string[] = [];
    for (const item of node) {
      if (typeof item === "string") {
        const codes = extractCodes(item);
        for (const code of codes) {
          results.push(code);
        }
      }
    }
    return results;
  }

  if (typeof node === "object" && node !== null) {
    const results: string[] = [];
    const objectNode = node as Record<string, unknown>;

    for (const key in objectNode) {
      if (Object.prototype.hasOwnProperty.call(objectNode, key)) {
        const val = objectNode[key];
        const codes = collectAllCodes(val);
        for (const code of codes) {
          results.push(code);
        }
      }
    }
    return results;
  }

  return [];
};

/**
 * Recursively traverses a packaging instruction structure to find all codes
 * This handles all types of packaging structures (Types 1-6 and variations)
 */
const extractCodesFromPackagingStructure = (structure: unknown): string[] => {
  if (!structure || typeof structure !== "object") {
    return [];
  }

  const allCodes: string[] = [];
  const obj = structure as Record<string, unknown>;

  // Look for packaging method keys first (common in Type 4, Type 5, Type 6)
  const packagingMethodKeys = [
    "combinationPackaging",
    "singlePackaging",
    "compositePackaging",
    "compositePackagingWithPlasticInnerReceptacles",
    "compositePackagingWithGlassPorcelainOrStonewareInnerReceptacles",
  ];

  // Process packaging methods if they exist
  for (const methodKey of packagingMethodKeys) {
    if (obj[methodKey] && typeof obj[methodKey] === "object") {
      const methodCodes = collectAllCodes(obj[methodKey]);
      for (const code of methodCodes) {
        if (allCodes.indexOf(code) === -1) {
          allCodes.push(code);
        }
      }
    }
  }

  // Process direct packaging types (common in Type 1, Type 2, Type 3)
  const directPackagingKeys = [
    "innerPackaging",
    "intermediatePackaging",
    "outerPackaging",
    "largePackagings",
  ];

  for (const key of directPackagingKeys) {
    if (obj[key] && typeof obj[key] === "object") {
      const keyCodes = collectAllCodes(obj[key]);
      for (const code of keyCodes) {
        if (allCodes.indexOf(code) === -1) {
          allCodes.push(code);
        }
      }
    }
  }

  // Process cylinderPackagingInstructions (Type 5)
  if (
    obj.cylinderPackagingInstructions &&
    typeof obj.cylinderPackagingInstructions === "object"
  ) {
    const cylinderCodes = collectAllCodes(obj.cylinderPackagingInstructions);
    for (const code of cylinderCodes) {
      if (allCodes.indexOf(code) === -1) {
        allCodes.push(code);
      }
    }
  }

  // Process subParagraphs (found in multiple types)
  if (obj.subParagraphs && typeof obj.subParagraphs === "object") {
    const subCodes = collectAllCodes(obj.subParagraphs);
    for (const code of subCodes) {
      if (allCodes.indexOf(code) === -1) {
        allCodes.push(code);
      }
    }
  }

  // Recursively check all other properties that might contain codes
  const processedKeys = [
    ...packagingMethodKeys,
    ...directPackagingKeys,
    "cylinderPackagingInstructions",
    "subParagraphs",
  ];

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      // Skip keys we've already processed
      let keyIsProcessed = false;
      for (let i = 0; i < processedKeys.length; i++) {
        if (processedKeys[i] === key) {
          keyIsProcessed = true;
          break;
        }
      }

      if (keyIsProcessed) {
        continue;
      }

      const value = obj[key];
      if (typeof value === "object" && value !== null) {
        const nestedCodes = extractCodesFromPackagingStructure(value);
        for (const code of nestedCodes) {
          if (allCodes.indexOf(code) === -1) {
            allCodes.push(code);
          }
        }
      } else if (typeof value === "string") {
        const stringCodes = extractCodes(value);
        for (const code of stringCodes) {
          if (allCodes.indexOf(code) === -1) {
            allCodes.push(code);
          }
        }
      }
    }
  }

  return allCodes;
};

export function validatePackagingCode(
  ppKey: string | undefined,
  code: string,
  packagingType?: string
): ValidationResult | undefined {
  if (!ppKey) {
    return undefined;
  }

  try {
    // Use an import approach that's compatible with the current environment
    let lookup = packagingParagraphReferenceLookup;

    if (!lookup || !lookup[ppKey]) {
      return undefined;
    }

    const normalised = code.toUpperCase();
    const entry = lookup[ppKey];

    // If there's no packagingInstructions field, we can't validate
    if (!entry.packagingInstructions) {
      return undefined;
    }

    const methods = entry.packagingInstructions as Record<string, unknown>;

    // Handle packaging type specific validation
    if (packagingType) {
      // Map the React component's packaging type to the corresponding method key
      const methodKeyMap: Record<string, PackagingMethodKey> = {
        Single: "singlePackaging",
        Combination: "combinationPackaging",
        CompositePackagingWithPlasticInnerReceptacles:
          "compositePackagingWithPlasticInnerReceptacles",
        CompositePackagingWithGlassPorcelainOrStonewareInnerReceptacles:
          "compositePackagingWithGlassPorcelainOrStonewareInnerReceptacles",
        Composite: "compositePackagingWithPlasticInnerReceptacles", // Default to plastic for generic "Composite"
      };

      const methodKey = methodKeyMap[packagingType];

      // First try the standard method key approach
      if (methodKey && methods[methodKey]) {
        const allCodes = collectAllCodes(methods[methodKey]);
        if (allCodes.indexOf(normalised) !== -1) {
          return { isValid: true, packagingMethod: methodKey };
        }
      }
      // Handle Type 3 structure (direct outerPackaging without method keys)
      else if (packagingType === "Single" && methods.outerPackaging) {
        const allCodes = collectAllCodes(methods.outerPackaging);
        if (allCodes.indexOf(normalised) !== -1) {
          return { isValid: true };
        }
      }

      return { isValid: false };
    }

    // If no packaging type specified, search all packaging methods
    // First, try to find codes in any packaging methods directly
    const standardMethodKeys = [
      "combinationPackaging",
      "singlePackaging",
      "compositePackaging",
      "compositePackagingWithPlasticInnerReceptacles",
      "compositePackagingWithGlassPorcelainOrStonewareInnerReceptacles",
    ];

    // Check standard methods first
    const methodKeys: PackagingMethodKey[] = [];
    for (const key of Object.keys(methods)) {
      for (const possibleKey of standardMethodKeys) {
        if (key === possibleKey) {
          methodKeys.push(key as PackagingMethodKey);
          break;
        }
      }
    }

    for (const methodKey of methodKeys) {
      if (methods[methodKey]) {
        const allCodes = collectAllCodes(methods[methodKey]);
        if (allCodes.indexOf(normalised) !== -1) {
          return { isValid: true, packagingMethod: methodKey };
        }
      }
    }

    // If we didn't find it in standard methods, use the more comprehensive search
    const allCodes = extractCodesFromPackagingStructure(
      entry.packagingInstructions
    );
    if (allCodes.indexOf(normalised) !== -1) {
      return { isValid: true };
    }

    return { isValid: false };
  } catch (error) {
    console.error("Error validating packaging code:", error);
    return undefined;
  }
}
