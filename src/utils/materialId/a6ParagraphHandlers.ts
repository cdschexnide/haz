// src/utils/materialId/a6ParagraphHandlers.ts
import {
  A6_3WorkflowModifiers,
  A6_4WorkflowModifiers,
  A6_5WorkflowModifiers,
  A6_6WorkflowModifiers,
  A6_9WorkflowModifiers,
  A6_15WorkflowModifiers,
} from '@/components/Data';

/**
 * Type definition for A6 workflow modifiers.
 */
export interface A6WorkflowModifiers {
  informativeStatementsDocumentNodes: JSX.Element[];
  workflowModifiersDocumentNodes: JSX.Element[];
}

/**
 * Maps A6 packaging paragraph codes to their workflow modifier objects.
 */
const A6_MODIFIER_MAP: Record<string, A6WorkflowModifiers> = {
  'A6.3': A6_3WorkflowModifiers,
  'A6.4': A6_4WorkflowModifiers,
  'A6.5': A6_5WorkflowModifiers,
  'A6.6': A6_6WorkflowModifiers,
  'A6.9': A6_9WorkflowModifiers,
  'A6.15': A6_15WorkflowModifiers,
};

/**
 * Checks if a packaging paragraph is an A6 paragraph with modifiers.
 */
export const isA6Paragraph = (paragraph: string): boolean => {
  return paragraph in A6_MODIFIER_MAP;
};

/**
 * Returns workflow modifiers for a given A6 packaging paragraph.
 * Returns null if the paragraph is not an A6 paragraph or has no modifiers.
 */
export const getA6Modifiers = (
  packagingParagraph: string
): A6WorkflowModifiers | null => {
  return A6_MODIFIER_MAP[packagingParagraph] || null;
};

export { A6_MODIFIER_MAP };
