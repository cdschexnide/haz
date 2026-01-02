import { HazardousMaterialItem } from "../../types";
import {
  PackagingParagraphReferenceLookup,
  packagingParagraphReferenceLookup,
} from "./packagingTypesMap";

export interface PackagingLookupOutput {
  packagingInstructions: Partial<PackagingParagraphReferenceLookup> | null;
}

export function packagingLookup(
  hazardousMaterial: HazardousMaterialItem | null
): PackagingLookupOutput | undefined {
  const packagingRefs = hazardousMaterial?.packagingParagraph.split(", ");

  if (!packagingRefs) {
    return undefined;
  }

  const relevantInstructions = packagingRefs.reduce((acc, ref) => {
    if (packagingParagraphReferenceLookup[ref]) {
      acc[ref] = packagingParagraphReferenceLookup[ref];
    }
    return acc;
  }, {} as Partial<PackagingParagraphReferenceLookup>);

  return {
    packagingInstructions:
      Object.keys(relevantInstructions).length > 0
        ? relevantInstructions
        : null,
  };
}
