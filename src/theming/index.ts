/**
 * Theming Barrel Export
 *
 * Provides a single entry point for all theming constants.
 * Import from '@/theming' or 'src/theming' to access colors, typography, and spacing.
 *
 * Usage:
 *   import { colors, typography, spacing } from '@/theming';
 *   import { fontSizes, textStyles } from '@/theming';
 */

// Colors (existing)
export { default as colors } from "./colors";

// Typography (new)
export { default as typography } from "./typography";
export {
  fontSizes,
  fontWeights,
  lineHeights,
  textStyles,
  type FontSize,
  type FontSizeValue,
  type FontWeight,
  type FontWeightValue,
  type LineHeight,
  type LineHeightValue,
  type TextStyle,
  type TextStyleName,
} from "./typography";

// Spacing (new)
export { default as spacingTheme } from "./spacing";
export {
  spacing,
  semanticSpacing,
  resolveSpacing,
  type SpacingKey,
  type SpacingValue,
  type SemanticSpacingKey,
  type SpacingProp,
} from "./spacing";

/**
 * Combined theme object
 * Provides access to all theme values in a single object
 */
import colors from "./colors";
import typography from "./typography";
import spacingTheme from "./spacing";

const theme = {
  colors,
  typography,
  spacing: spacingTheme,
} as const;

export default theme;
