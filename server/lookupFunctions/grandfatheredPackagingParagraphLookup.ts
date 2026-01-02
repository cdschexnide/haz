import {
  grandfatheredPackagingReferences,
  PackagingReference,
} from "../data/grandfatheredPackagingParagraphReferences";

/**
 * Retrieves a packaging reference by its key
 * @param key - The key of the packaging reference to retrieve (e.g., "A27.11.")
 * @returns The PackagingReference object corresponding to the provided key, or undefined if not found
 */
export function getPackagingReference(
  key: string
): PackagingReference | undefined {
  if (key in grandfatheredPackagingReferences) {
    return grandfatheredPackagingReferences[key];
  }

  return undefined;
}
