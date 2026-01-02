/**
 * Typography Theme Constants
 *
 * Defines font sizes, weights, line heights, and composite text styles
 * based on patterns found across the codebase.
 *
 * NOTE: These values are extracted from existing usage patterns.
 * Existing components should NOT be modified to use these values
 * until Phase 5 with proper snapshot testing in place.
 */

/**
 * Font size scale in pixels
 * Based on most commonly used values in the codebase
 */
export const fontSizes = {
  /** 12px - Extra small text, captions, fine print */
  xs: 12,
  /** 13px - Small secondary text */
  sm: 13,
  /** 14px - Base/default text size */
  base: 14,
  /** 15px - Slightly larger base text */
  md: 15,
  /** 16px - Standard body text, most common size */
  lg: 16,
  /** 18px - Section headers, larger body text */
  xl: 18,
  /** 20px - Subheadings, emphasis */
  "2xl": 20,
  /** 22px - Section titles */
  "3xl": 22,
  /** 24px - Page titles, major headings */
  "4xl": 24,
  /** 28px - Large display text */
  "5xl": 28,
  /** 32px - Major display headings */
  "6xl": 32,
} as const;

export type FontSize = keyof typeof fontSizes;
export type FontSizeValue = (typeof fontSizes)[FontSize];

/**
 * Font weight scale
 * Maps semantic names to CSS font-weight values
 */
export const fontWeights = {
  /** Normal/regular weight */
  normal: "400" as const,
  /** Medium weight - slightly heavier than normal */
  medium: "500" as const,
  /** Semibold - default for emphasized text */
  semibold: "600" as const,
  /** Bold - strong emphasis */
  bold: "700" as const,
  /** Extra bold - rarely used, special cases only */
  extrabold: "900" as const,
} as const;

export type FontWeight = keyof typeof fontWeights;
export type FontWeightValue = (typeof fontWeights)[FontWeight];

/**
 * Line height scale in pixels
 * Values are typically 1.2-1.5x the font size for readability
 */
export const lineHeights = {
  /** Tight line height for compact displays */
  tight: 14,
  /** Slightly compact */
  snug: 16,
  /** Normal line height */
  normal: 18,
  /** Relaxed line height - most common */
  relaxed: 20,
  /** Comfortable reading */
  comfortable: 22,
  /** Loose line height */
  loose: 24,
  /** Extra loose for large text */
  extraLoose: 32,
} as const;

export type LineHeight = keyof typeof lineHeights;
export type LineHeightValue = (typeof lineHeights)[LineHeight];

/**
 * Composite text style type
 */
export interface TextStyle {
  fontSize: number;
  fontWeight: string;
  lineHeight: number;
}

/**
 * Pre-defined text styles for common use cases
 * Based on patterns observed across the codebase
 */
export const textStyles = {
  /** Caption text - smallest readable text */
  caption: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.tight,
  },
  /** Secondary/supporting text */
  secondary: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.snug,
  },
  /** Default body text */
  body: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.normal,
  },
  /** Body text with medium emphasis */
  bodyMedium: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.relaxed,
  },
  /** Emphasized body text */
  bodyBold: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.relaxed,
  },
  /** Heading level 4 */
  h4: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.relaxed,
  },
  /** Heading level 3 */
  h3: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.comfortable,
  },
  /** Heading level 2 */
  h2: {
    fontSize: fontSizes["3xl"],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.loose,
  },
  /** Heading level 1 - page titles */
  h1: {
    fontSize: fontSizes["4xl"],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.extraLoose,
  },
  /** Large display text */
  display: {
    fontSize: fontSizes["5xl"],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.extraLoose,
  },
  /** Extra large display text */
  displayLarge: {
    fontSize: fontSizes["6xl"],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.extraLoose,
  },
} as const;

export type TextStyleName = keyof typeof textStyles;

/**
 * Main typography export object
 */
const typography = {
  fontSizes,
  fontWeights,
  lineHeights,
  textStyles,
} as const;

export default typography;
