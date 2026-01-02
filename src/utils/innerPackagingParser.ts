/**
 * Inner Packaging Container Type Parser
 *
 * Auto-detects outer container type from SDDG "Quantity and Type of Packing" field
 * Uses UN packaging codes and keywords to identify container types
 *
 * Reference: AFMAN 24-604, Attachment 28, Section A28.2.2
 */

import { ContainerType } from "@//types/innerPackaging";

/**
 * Parse container type from SDDG quantityAndPacking field
 *
 * Detects container type using:
 * 1. Keywords (fiberboard box, drum, jerrican, etc.)
 * 2. UN packaging codes (4G, 1A, 3H, etc.)
 *
 * Examples:
 * - "1 fiberboard box (4G) x 12 KG" → 'fiberboard-box'
 * - "2 drums x 50 L" → 'drum'
 * - "1 wooden box x 25 KG" → 'wood-box'
 *
 * @param quantityPacking - The "Quantity and Type of Packing" field from SDDG (Key 16)
 * @returns Detected container type or null if empty
 */
export function parseContainerTypeFromQuantityPacking(
  quantityPacking: string | null | undefined
): ContainerType {
  if (!quantityPacking) {
    return null;
  }

  const normalized = quantityPacking.toLowerCase().trim();

  // Check for fiberboard box
  // Keywords: fiberboard, fibreboard (UK spelling)
  // UN Codes: 4G (fiberboard box)
  if (
    normalized.includes("fiberboard box") ||
    normalized.includes("fibreboard box") ||
    normalized.includes("fiberboard boxes") ||
    normalized.includes("fibreboard boxes") ||
    /\b4g\b/i.test(normalized)
  ) {
    return "fiberboard-box";
  }

  // Check for wood box
  // Keywords: wood, wooden
  // UN Codes: 4C (wood box with sift-proof walls), 4D (plywood box), 4F (reconstituted wood box)
  if (
    normalized.includes("wood box") ||
    normalized.includes("wooden box") ||
    normalized.includes("wood boxes") ||
    normalized.includes("wooden boxes") ||
    normalized.includes("plywood box") ||
    /\b4c\b/i.test(normalized) ||
    /\b4d\b/i.test(normalized) ||
    /\b4f\b/i.test(normalized)
  ) {
    return "wood-box";
  }

  // Check for drum
  // Keywords: drum, drums
  // UN Codes: 1A (steel drum), 1B (aluminum drum), 1N (metal drum), 1H (plastic drum), 1D (plywood drum), 1G (fiber drum)
  if (
    normalized.includes("drum") ||
    /\b1a\b/i.test(normalized) ||
    /\b1b\b/i.test(normalized) ||
    /\b1n\b/i.test(normalized) ||
    /\b1h\b/i.test(normalized) ||
    /\b1d\b/i.test(normalized) ||
    /\b1g\b/i.test(normalized)
  ) {
    return "drum";
  }

  // Check for jerrican
  // Keywords: jerrican, jerry can
  // UN Codes: 3H (plastic jerrican), 3A (steel jerrican)
  if (
    normalized.includes("jerrican") ||
    normalized.includes("jerricans") ||
    normalized.includes("jerry can") ||
    normalized.includes("jerry cans") ||
    /\b3h\b/i.test(normalized) ||
    /\b3a\b/i.test(normalized)
  ) {
    return "jerrican";
  }

  // Check for overpack
  // Keywords: overpack
  if (normalized.includes("overpack")) {
    return "overpack";
  }

  // Default to non-specification if can't determine specific type
  // This allows the inspector to manually select the correct type
  return "non-specification";
}

/**
 * Get human-readable display label for container type
 *
 * @param type - Container type
 * @returns Display-friendly label for UI
 */
export function getContainerTypeLabel(type: ContainerType): string {
  const labels: Record<Exclude<ContainerType, null>, string> = {
    "fiberboard-box": "Fiberboard Box",
    "wood-box": "Wood Box",
    drum: "Drum",
    overpack: "Overpack",
    jerrican: "Jerrican",
    "non-specification": "Non-Specification Packaging",
  };

  return type ? labels[type] || "Unknown" : "Not Detected";
}

/**
 * Get all available container types with their labels
 * Useful for manual override dropdown
 *
 * @returns Array of container type options
 */
export function getContainerTypeOptions(): Array<{
  value: ContainerType;
  label: string;
}> {
  return [
    { value: "fiberboard-box", label: "Fiberboard Box (4G)" },
    { value: "wood-box", label: "Wood Box (4C/4D/4F)" },
    { value: "drum", label: "Drum (1A/1B/1H/etc.)" },
    { value: "overpack", label: "Overpack" },
    { value: "jerrican", label: "Jerrican (3H/3A)" },
    { value: "non-specification", label: "Non-Specification Packaging" },
  ];
}

/**
 * Check if a container type requires special handling for auto-detection
 *
 * @param type - Detected container type
 * @returns True if detection confidence is low and manual verification recommended
 */
export function requiresManualVerification(type: ContainerType): boolean {
  // Non-specification means we couldn't detect a specific type
  // User should verify or manually select
  return type === "non-specification" || type === null;
}
