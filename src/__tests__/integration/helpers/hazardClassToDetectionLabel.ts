import { labelMatchingTable } from "@/utils/labelMatchingTable";

/**
 * Reverse lookup: given a hazard class string (e.g., "3", "1.1B"),
 * return the ML detection className used in AggregatedLabel.
 *
 * Prefers the most specific match (e.g., "explosives1.1B" over "explosives1.1").
 */

// Build reverse map at import time
const reverseMap = new Map<string, string>();

for (const [className, matchStrings] of Object.entries(labelMatchingTable)) {
  for (const matchString of matchStrings) {
    // Match on patterns like "Class 3", "3", "1.1B", "Class 1.1B"
    const normalized = matchString.toLowerCase().replace(/^class\s+/, "").trim();
    // Only store first match (most specific entries come first in the table)
    if (!reverseMap.has(normalized)) {
      reverseMap.set(normalized, className);
    }
  }
}

export function getDetectionLabelForHazardClass(
  hazardClass: string
): string | null {
  if (!hazardClass || hazardClass === "FORBIDDEN") return null;

  const normalized = hazardClass.toLowerCase().trim();

  // Try exact match first
  if (reverseMap.has(normalized)) {
    return reverseMap.get(normalized)!;
  }

  // Try with "class " prefix stripped
  const withoutClass = normalized.replace(/^class\s+/, "");
  if (reverseMap.has(withoutClass)) {
    return reverseMap.get(withoutClass)!;
  }

  return null;
}
