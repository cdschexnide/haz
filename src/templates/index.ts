/**
 * Template Registry
 * Central registry for all SDDG form templates
 */

import { SDDGTemplate } from "@/types/sddg-template";
import { AMC_IMT_1033_TEMPLATE } from "./AMC_IMT_1033";

/**
 * All available templates
 * Add new templates here as they are created
 */
export const TEMPLATES: Record<string, SDDGTemplate> = {
  AMC_IMT_1033: AMC_IMT_1033_TEMPLATE,
};

/**
 * Get template by form type
 */
export function getTemplate(formType: string): SDDGTemplate | null {
  return TEMPLATES[formType] || null;
}

/**
 * Get all template types
 */
export function getAllTemplateTypes(): string[] {
  return Object.keys(TEMPLATES);
}

/**
 * Get template by name (case-insensitive)
 */
export function getTemplateByName(name: string): SDDGTemplate | null {
  const normalizedName = name.toUpperCase().replace(/[^A-Z0-9_]/g, "_");
  return TEMPLATES[normalizedName] || null;
}

/**
 * Check if a template exists
 */
export function hasTemplate(formType: string): boolean {
  return formType in TEMPLATES;
}

// Re-export individual templates
export { AMC_IMT_1033_TEMPLATE } from "./AMC_IMT_1033";

// Re-export types
export type {
  SDDGTemplate,
  Region,
  FieldRegion,
  SDDGData,
} from "@/types/sddg-template";
