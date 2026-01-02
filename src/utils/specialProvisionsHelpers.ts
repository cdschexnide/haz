/**
 * Utility functions for handling special provisions workflow modifications
 */

/**
 * Appends "(INHALATION HAZARD)" to the shipping name if the material has
 * special provision codes 1, 2, 3, or 4 (indicating inhalation toxicity).
 *
 * Per AFMAN24-604, materials with these special provisions must have
 * "INHALATION HAZARD" indicated on shipping documentation.
 *
 * @param shippingName - The proper shipping name of the hazardous material
 * @param specialProvisionsMap - Map of special provision codes applicable to the material
 * @returns The shipping name with "(INHALATION HAZARD)" appended if applicable
 */
export const appendInhalationHazardIfNeeded = (
  shippingName: string | undefined,
  specialProvisionsMap: Record<string, string> | undefined
): string | undefined => {
  if (!shippingName) return undefined;

  // Special provision codes 1-4 indicate inhalation toxicity in different hazard zones
  const inhalationHazardCodes = ["1", "2", "3", "4", "6", "13"];

  const hasInhalationHazard =
    specialProvisionsMap &&
    inhalationHazardCodes.some(code => code in specialProvisionsMap);

  return hasInhalationHazard
    ? `${shippingName} (INHALATION HAZARD)`
    : shippingName;
};

/**
 * Checks if single packaging is prohibited by special provision A2.
 *
 * Special provision A2 states: "Single packagings are not permitted."
 *
 * @param specialProvisionsMap - Map of special provision codes applicable to the material
 * @returns True if A2 special provision is present, false otherwise
 */
export const isSinglePackagingProhibited = (
  specialProvisionsMap: Record<string, string> | undefined
): boolean => {
  return !!(specialProvisionsMap && "A2" in specialProvisionsMap);
};
