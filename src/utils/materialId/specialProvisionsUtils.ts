import {
  numericSpecialProvisionsLabelingModifiers,
  aCodeLabelingModifiers,
} from '../../../server/attachment3/workflowModifiers/workflowModifierCategories/labelingModifiers';

/**
 * Filters a source map to only include entries whose keys are in the provided array.
 * Used for extracting relevant special provisions from larger modifier maps.
 */
export const filterMatchingKeys = <T>(
  sourceMap: Record<string, T>,
  keys: string[]
): Record<string, T> => {
  return keys.reduce((acc, key) => {
    if (sourceMap[key] !== undefined) {
      acc[key] = sourceMap[key];
    }
    return acc;
  }, {} as Record<string, T>);
};

/**
 * Consolidates all workflow modifier sources into a single lookup object.
 * Used by MaterialIDScreen to find modifiers from any source.
 */
export const consolidateWorkflowModifiers = (): Record<string, any> => {
  return {
    ...numericSpecialProvisionsLabelingModifiers,
    ...aCodeLabelingModifiers,
  };
};
