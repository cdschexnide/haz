/**
 * Spacing Theme Constants
 *
 * Defines consistent spacing values for margins, padding, and gaps
 * based on patterns found across the codebase.
 *
 * NOTE: These values are extracted from existing usage patterns.
 * Existing components should NOT be modified to use these values
 * until Phase 5 with proper snapshot testing in place.
 */

/**
 * Core spacing scale in pixels
 * Based on the most commonly used values across the codebase
 *
 * Pattern: Uses a 4px base unit with common increments
 */
export const spacing = {
  /** 0px - No spacing */
  none: 0,
  /** 2px - Minimal spacing (rare usage) */
  px: 2,
  /** 4px - Extra small spacing */
  xs: 4,
  /** 6px - Small tight spacing */
  sm: 6,
  /** 8px - Standard small spacing (very common) */
  md: 8,
  /** 10px - Medium-small spacing */
  base: 10,
  /** 12px - Standard medium spacing (very common) */
  lg: 12,
  /** 15px - Medium-large spacing */
  xl: 15,
  /** 16px - Standard large spacing (most common) */
  "2xl": 16,
  /** 20px - Large spacing (very common) */
  "3xl": 20,
  /** 24px - Extra large spacing */
  "4xl": 24,
  /** 32px - Double large spacing */
  "5xl": 32,
  /** 40px - Triple large spacing */
  "6xl": 40,
} as const;

export type SpacingKey = keyof typeof spacing;
export type SpacingValue = (typeof spacing)[SpacingKey];

/**
 * Semantic spacing aliases for specific use cases
 * Maps meaningful names to spacing values
 */
export const semanticSpacing = {
  /** Spacing between inline elements */
  inlineGap: spacing.xs,
  /** Standard gap between list items */
  listItemGap: spacing.md,
  /** Gap between form fields */
  formFieldGap: spacing.lg,
  /** Standard section padding */
  sectionPadding: spacing["2xl"],
  /** Card/container internal padding */
  cardPadding: spacing["2xl"],
  /** Screen edge padding */
  screenPadding: spacing["2xl"],
  /** Gap between major sections */
  sectionGap: spacing["3xl"],
  /** Large separator spacing */
  dividerSpacing: spacing["4xl"],
} as const;

export type SemanticSpacingKey = keyof typeof semanticSpacing;

/**
 * Helper type for spacing props that accept either a key or direct value
 */
export type SpacingProp = SpacingKey | number;

/**
 * Helper function to resolve spacing value
 * @param value - Either a spacing key or a direct number
 * @returns The resolved spacing value in pixels
 */
export const resolveSpacing = (value: SpacingProp): number => {
  if (typeof value === "number") {
    return value;
  }
  return spacing[value];
};

/**
 * Main spacing export object
 */
const spacingTheme = {
  spacing,
  semanticSpacing,
  resolveSpacing,
} as const;

export default spacingTheme;
