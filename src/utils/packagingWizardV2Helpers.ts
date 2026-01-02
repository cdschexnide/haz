/**
 * Helper functions for PackagingWizardV2 component
 * Handles filtering, mapping, and validation logic for packagingDatabaseV2
 */

import {
  Container,
  PackagingOption,
  PackagingCategory,
  PackingGroupRestriction,
  SpecialRequirement,
  IntermediatePackaging,
  PackagingParagraphEntry,
} from "@//types/packagingStructure";

/**
 * Maps packaging type codes to user-friendly display labels
 */
export function getPackagingTypeLabel(type: string): string {
  const typeMap: Record<string, string> = {
    single: "Single Packaging",
    combination: "Combination Packaging",
    composite_plastic: "Composite with Plastic Inner Receptacles",
    composite_glass:
      "Composite with Glass/Porcelain/Stoneware Inner Receptacles",
    composite: "Composite Packaging",
    cylinder: "Cylinder Packaging",
    specialized: "Specialized Packaging",
    equipment: "Equipment Packaging",
  };

  return (
    typeMap[type] ||
    type.charAt(0).toUpperCase() + type.slice(1).replace(/_/g, " ")
  );
}

/**
 * Checks if a container is prohibited for a given packing group
 */
export function isContainerProhibited(
  containerCode: string,
  userPackingGroup: string,
  restrictions: PackingGroupRestriction[]
): boolean {
  if (!userPackingGroup || !restrictions || restrictions.length === 0) {
    return false;
  }

  // Extract packing groups from string like "I II III" or "II III"
  const packingGroups = userPackingGroup.split(" ").filter(pg => pg.trim());

  for (const restriction of restrictions) {
    // Check if restriction applies to any of the user's packing groups
    const appliesToUser =
      packingGroups.includes(restriction.packingGroup) ||
      restriction.packingGroup === "all";

    if (appliesToUser && restriction.restriction === "prohibited") {
      // Check if container code is in the conditions
      if (restriction.conditions?.includes(containerCode)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Checks if a container has restrictions (but not prohibited)
 */
export function hasContainerRestrictions(
  containerCode: string,
  userPackingGroup: string,
  restrictions: PackingGroupRestriction[]
): boolean {
  if (!userPackingGroup || !restrictions || restrictions.length === 0) {
    return false;
  }

  const packingGroups = userPackingGroup.split(" ").filter(pg => pg.trim());

  for (const restriction of restrictions) {
    const appliesToUser =
      packingGroups.includes(restriction.packingGroup) ||
      restriction.packingGroup === "all";

    if (appliesToUser && restriction.restriction !== "prohibited") {
      if (restriction.conditions?.includes(containerCode)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Filters containers to remove prohibited options based on packing group
 */
export function filterAvailableContainers(
  containers: Container[],
  userPackingGroup: string,
  restrictions: PackingGroupRestriction[]
): Container[] {
  if (!userPackingGroup || !restrictions || restrictions.length === 0) {
    return containers;
  }

  return containers.filter(
    container =>
      !isContainerProhibited(container.code, userPackingGroup, restrictions)
  );
}

/**
 * Gets restrictions applicable to the user's packing group
 */
export function getApplicableRestrictions(
  userPackingGroup: string,
  restrictions: PackingGroupRestriction[]
): PackingGroupRestriction[] {
  if (!userPackingGroup || !restrictions || restrictions.length === 0) {
    return [];
  }

  const packingGroups = userPackingGroup.split(" ").filter(pg => pg.trim());

  return restrictions.filter(restriction => {
    return (
      packingGroups.includes(restriction.packingGroup) ||
      restriction.packingGroup === "all"
    );
  });
}

/**
 * Gets restriction description for a specific container code
 */
export function getContainerRestrictionDescription(
  containerCode: string,
  userPackingGroup: string,
  restrictions: PackingGroupRestriction[]
): string | null {
  if (!userPackingGroup || !restrictions || restrictions.length === 0) {
    return null;
  }

  const packingGroups = userPackingGroup.split(" ").filter(pg => pg.trim());

  for (const restriction of restrictions) {
    const appliesToUser =
      packingGroups.includes(restriction.packingGroup) ||
      restriction.packingGroup === "all";

    if (appliesToUser && restriction.conditions?.includes(containerCode)) {
      return restriction.description || null;
    }
  }

  return null;
}

/**
 * Filters special requirements based on selected packaging option
 */
export function getApplicableSpecialRequirements(
  selectedOption: PackagingOption | null,
  allRequirements: SpecialRequirement[]
): SpecialRequirement[] {
  if (!selectedOption || !allRequirements || allRequirements.length === 0) {
    return [];
  }

  return allRequirements.filter(requirement => {
    // If no applicableContainers specified, it applies to all
    if (
      !requirement.applicableContainers ||
      requirement.applicableContainers.length === 0
    ) {
      return true;
    }

    // Check if any of the applicableContainers match the selected option type
    return requirement.applicableContainers.some(
      container =>
        container === selectedOption.type || container === selectedOption.id
    );
  });
}

/**
 * Groups containers by material for display
 */
export function groupContainersByMaterial(
  containers: Container[]
): Record<string, Container[]> {
  const grouped: Record<string, Container[]> = {};

  for (const container of containers) {
    const material = container.material || "Unknown";
    if (!grouped[material]) {
      grouped[material] = [];
    }
    grouped[material].push(container);
  }

  return grouped;
}

/**
 * Gets a preview of materials available in a category
 */
export function getCategoryMaterialsPreview(
  category: PackagingCategory,
  maxItems: number = 3
): string {
  const uniqueMaterials = [
    ...new Set(category.containers.map(c => c.material)),
  ];

  if (uniqueMaterials.length === 0) {
    return "";
  }

  const displayMaterials = uniqueMaterials.slice(0, maxItems);
  const remaining = uniqueMaterials.length - maxItems;

  let preview = displayMaterials
    .map(m => m.charAt(0).toUpperCase() + m.slice(1).replace(/_/g, " "))
    .join(", ");

  if (remaining > 0) {
    preview += `, +${remaining} more`;
  }

  return preview;
}

/**
 * Capitalizes category type for display
 */
export function formatCategoryType(type: string): string {
  return type.charAt(0).toUpperCase() + type.slice(1).replace(/_/g, " ");
}

/**
 * Checks if inner packaging is required for the selected option
 */
export function isInnerPackagingRequired(
  option: PackagingOption | null
): boolean {
  return option?.innerPackaging?.required === true;
}

/**
 * Checks if intermediate packaging is required for the selected option
 */
export function isIntermediatePackagingRequired(
  option: PackagingOption | null
): boolean {
  return option?.intermediatePackaging?.required === true;
}

/**
 * Checks if the option has intermediate packaging defined
 */
export function hasIntermediatePackaging(
  option: PackagingOption | null
): boolean {
  return (
    option?.intermediatePackaging !== undefined &&
    option?.intermediatePackaging !== null
  );
}

/**
 * Gets all notes for a selected packaging option
 */
export function getAllNotesForOption(option: PackagingOption | null): string[] {
  if (!option) {
    return [];
  }

  const notes: string[] = [];

  if (option.notes && option.notes.length > 0) {
    notes.push(...option.notes);
  }

  if (
    option.innerPackaging?.specialRequirements &&
    option.innerPackaging.specialRequirements.length > 0
  ) {
    notes.push(...option.innerPackaging.specialRequirements);
  }

  return notes;
}

/**
 * Gets all requirements for intermediate packaging
 */
export function getAllIntermediateRequirements(
  option: PackagingOption | null
): string[] {
  if (!option || !option.intermediatePackaging) {
    return [];
  }

  const requirements: string[] = [];

  if (option.intermediatePackaging.description) {
    requirements.push(option.intermediatePackaging.description);
  }

  if (
    option.intermediatePackaging.closureRequirements &&
    option.intermediatePackaging.closureRequirements.length > 0
  ) {
    requirements.push(...option.intermediatePackaging.closureRequirements);
  }

  if (
    option.intermediatePackaging.specialRequirements &&
    option.intermediatePackaging.specialRequirements.length > 0
  ) {
    requirements.push(...option.intermediatePackaging.specialRequirements);
  }

  return requirements;
}

/**
 * Maps V2 packaging option types to legacy packaging method names
 */
export function mapPackagingTypeToMethod(type: string): string {
  const typeMap: Record<string, string> = {
    single: "Single",
    combination: "Combination",
    composite_plastic: "CompositePackagingWithPlasticInnerReceptacles",
    composite_glass:
      "CompositePackagingWithGlassPorcelainOrStonewareInnerReceptacles",
    composite: "Composite",
    cylinder: "Cylinder",
    specialized: "Specialized",
    equipment: "Equipment",
  };

  return typeMap[type] || type.charAt(0).toUpperCase() + type.slice(1);
}

/**
 * Validation result interface for packaging code validation
 */
export interface PackagingCodeValidationResult {
  isValid: boolean;
  packagingMethod?: string;
}

/**
 * Validates a packaging code against packagingDatabaseV2
 *
 * @param packagingDatabaseV2 - The V2 packaging database
 * @param packagingParagraphId - The packaging paragraph ID (e.g., "A5.4.")
 * @param code - The packaging code to validate (e.g., "1A1")
 * @param packagingType - Optional packaging type to filter by (e.g., "single", "combination")
 * @returns Validation result with isValid and optional packagingMethod
 */
export function validatePackagingCodeV2(
  packagingDatabaseV2: Record<string, PackagingParagraphEntry>,
  packagingParagraphId: string,
  code: string,
  packagingType?: string
): PackagingCodeValidationResult {
  // Normalize the input code
  const normalizedCode = code.trim().toUpperCase();

  // Look up the packaging entry
  const packagingEntry: PackagingParagraphEntry =
    packagingDatabaseV2[packagingParagraphId];
  if (!packagingEntry) {
    return { isValid: false };
  }
  console.log("packagingEntry: ", JSON.stringify(packagingEntry, null, 2));

  // Get packaging options
  const packagingOptions: PackagingOption[] =
    packagingEntry.packagingOptions || [];
  if (packagingOptions.length === 0) {
    return { isValid: false };
  }

  console.log("packagingOptions: ", JSON.stringify(packagingEntry, null, 2));

  // If packagingType is provided, filter to matching options
  let relevantOptions = packagingOptions;
  if (packagingType) {
    // Normalize packagingType to lowercase for comparison
    const normalizedType = packagingType.toLowerCase();
    relevantOptions = packagingOptions.filter(
      option => option.type.toLowerCase() === normalizedType
    );
  }

  // Search through all relevant options
  for (const option of relevantOptions) {
    // Check if this option has outer packaging
    if (!option.outerPackaging || !option.outerPackaging.categories) {
      continue;
    }

    // Check all categories in outer packaging
    for (const category of option.outerPackaging.categories) {
      if (!category.containers) {
        continue;
      }

      // Check all containers in this category
      for (const container of category.containers) {
        if (container.code.toUpperCase() === normalizedCode) {
          // Found a match!
          return {
            isValid: true,
            packagingMethod: mapPackagingTypeToMethod(option.type),
          };
        }
      }
    }
  }

  // No match found
  return { isValid: false };
}

/**
 * Category availability information
 */
export interface CategoryAvailabilityInfo {
  total: number;
  available: number;
  prohibited: number;
}

/**
 * Checks if ALL containers in a category are prohibited for the user's packing group
 */
export function isCategoryFullyProhibited(
  category: PackagingCategory,
  userPackingGroup: string,
  restrictions: PackingGroupRestriction[]
): boolean {
  if (!category.containers || category.containers.length === 0) {
    return false;
  }

  const availableContainers = filterAvailableContainers(
    category.containers,
    userPackingGroup,
    restrictions
  );

  return availableContainers.length === 0;
}

/**
 * Checks if SOME (but not all) containers in a category are prohibited
 */
export function isCategoryPartiallyRestricted(
  category: PackagingCategory,
  userPackingGroup: string,
  restrictions: PackingGroupRestriction[]
): boolean {
  if (!category.containers || category.containers.length === 0) {
    return false;
  }

  const totalCount = category.containers.length;
  const availableCount = filterAvailableContainers(
    category.containers,
    userPackingGroup,
    restrictions
  ).length;

  return availableCount > 0 && availableCount < totalCount;
}

/**
 * Gets all restriction messages relevant to containers in this category
 * Only returns messages if the ENTIRE category is fully prohibited.
 * Individual container code restrictions are handled in Step 3.
 */
export function getCategoryRestrictionMessages(
  category: PackagingCategory,
  userPackingGroup: string,
  restrictions: PackingGroupRestriction[]
): string[] {
  // Only return messages if the entire category is prohibited
  // Individual code restrictions will be shown in Step 3
  if (!isCategoryFullyProhibited(category, userPackingGroup, restrictions)) {
    return [];
  }

  const messages: string[] = [];
  const categoryCodes = category.containers.map(c => c.code);
  const packingGroups = userPackingGroup.split(" ").filter(pg => pg.trim());

  for (const restriction of restrictions) {
    const appliesToUser =
      packingGroups.includes(restriction.packingGroup) ||
      restriction.packingGroup === "all";

    if (!appliesToUser) continue;

    // Check if this restriction applies to any container in this category
    const hasRelevantCodes = restriction.conditions?.some(code =>
      categoryCodes.includes(code)
    );

    if (hasRelevantCodes && restriction.description) {
      messages.push(restriction.description);
    }
  }

  return messages;
}

/**
 * Gets availability information for a category (total, available, prohibited counts)
 */
export function getCategoryAvailabilityInfo(
  category: PackagingCategory,
  userPackingGroup: string,
  restrictions: PackingGroupRestriction[]
): CategoryAvailabilityInfo {
  if (!category.containers || category.containers.length === 0) {
    return { total: 0, available: 0, prohibited: 0 };
  }

  const total = category.containers.length;
  const available = filterAvailableContainers(
    category.containers,
    userPackingGroup,
    restrictions
  ).length;
  const prohibited = total - available;

  return { total, available, prohibited };
}
