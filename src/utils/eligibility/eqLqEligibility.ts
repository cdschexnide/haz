// src/utils/eligibility/eqLqEligibility.ts

export enum QuantityType {
  EXCEPTED = 'excepted',
  LIMITED = 'limited',
  STANDARD = 'standard',
}

export interface EligibilityResult {
  exceptedQuantity: boolean;
  limitedQuantity: boolean;
  standardQuantity: boolean;
  recommendedType: QuantityType;
  reason?: string;
}

export interface EligibilityInput {
  quantity: number;
  unit: string;
  eqMaxInner: number;
  lqMaxInner: number;
  prohibitedFromEQ?: boolean;
  prohibitedFromLQ?: boolean;
}

/**
 * Calculates quantity type eligibility based on material limits.
 * Returns which quantity types (excepted, limited, standard) the shipment qualifies for.
 */
export const calculateEligibility = (input: EligibilityInput): EligibilityResult => {
  const { quantity, eqMaxInner, lqMaxInner, prohibitedFromEQ, prohibitedFromLQ } = input;

  const exceptedQuantity = !prohibitedFromEQ && eqMaxInner > 0 && quantity <= eqMaxInner;
  const limitedQuantity = !prohibitedFromLQ && lqMaxInner > 0 && quantity <= lqMaxInner;
  const standardQuantity = true; // Always eligible for standard

  // Recommend the most restrictive eligible type (least paperwork)
  let recommendedType = QuantityType.STANDARD;
  if (limitedQuantity) recommendedType = QuantityType.LIMITED;
  if (exceptedQuantity) recommendedType = QuantityType.EXCEPTED;

  return {
    exceptedQuantity,
    limitedQuantity,
    standardQuantity,
    recommendedType,
  };
};

/**
 * Returns human-readable description of eligibility result.
 */
export const getEligibilityDescription = (result: EligibilityResult): string => {
  const eligible: string[] = [];
  if (result.exceptedQuantity) eligible.push('Excepted Quantity');
  if (result.limitedQuantity) eligible.push('Limited Quantity');
  if (result.standardQuantity) eligible.push('Standard Quantity');
  return eligible.join(', ');
};
