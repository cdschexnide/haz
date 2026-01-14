/**
 * Cylinder Types by Packaging Paragraph
 *
 * Maps AFMAN 24-604 Attachment 6 packaging paragraphs (A6.2-A6.28)
 * to their valid cylinder/container types for Class 2 compressed gases.
 *
 * Used by InspectorCylinderTypeSelectionScreen to display valid options
 * for the inspector to select when validating cylinder markings.
 */

export interface CylinderType {
  id: string; // e.g., "DOT-3A"
  label: string; // e.g., "DOT 3A"
  restrictions?: string; // e.g., "NOT for Class 8 materials"
}

/**
 * Cylinder types organized by packaging paragraph.
 * Some paragraphs (like A6.8, A6.23-A6.25) don't require specific
 * cylinder types and are not included here.
 */
export const CYLINDER_TYPES_BY_PARAGRAPH: Record<string, CylinderType[]> = {
  // A6.2 - Aerosols (Consumer Commodity)
  "A6.2": [
    { id: "DOT-2P", label: "DOT 2P" },
    { id: "DOT-2Q", label: "DOT 2Q" },
    { id: "ICAO-IP7", label: "ICAO/IATA IP7" },
    { id: "ICAO-IP7A", label: "ICAO/IATA IP7A" },
    { id: "ICAO-IP7B", label: "ICAO/IATA IP7B" },
  ],

  // A6.3 - Small Receptacles Containing Compressed Gas
  "A6.3": [
    { id: "DOT-2P", label: "DOT 2P" },
    { id: "DOT-2Q", label: "DOT 2Q" },
    { id: "DOT-39", label: "DOT 39" },
  ],

  // A6.4 - Liquefied Compressed Gases
  "A6.4": [
    { id: "DOT-3", label: "DOT 3" },
    { id: "DOT-3A", label: "DOT 3A" },
    { id: "DOT-3AA", label: "DOT 3AA" },
    { id: "DOT-3AL", label: "DOT 3AL", restrictions: "NOT for Class 8 materials" },
    { id: "DOT-3B", label: "DOT 3B" },
    { id: "DOT-3BN", label: "DOT 3BN" },
    { id: "DOT-3E", label: "DOT 3E" },
    { id: "DOT-3HT", label: "DOT 3HT" },
    { id: "DOT-4", label: "DOT 4" },
    { id: "DOT-4A", label: "DOT 4A" },
    { id: "DOT-4AL", label: "DOT 4AL" },
    { id: "DOT-4B", label: "DOT 4B" },
    { id: "DOT-4BA", label: "DOT 4BA" },
    { id: "DOT-4B240ET", label: "DOT 4B240ET" },
    { id: "DOT-4BW", label: "DOT 4BW" },
    { id: "DOT-4E", label: "DOT 4E", restrictions: "Multiple restrictions apply" },
    { id: "DOT-9", label: "DOT 9" },
    { id: "DOT-25", label: "DOT 25" },
    { id: "DOT-26", label: "DOT 26" },
    { id: "DOT-38", label: "DOT 38" },
    { id: "DOT-39", label: "DOT 39" },
    { id: "DOT-40", label: "DOT 40" },
    { id: "DOT-41", label: "DOT 41" },
    { id: "DOT-2P", label: "DOT 2P" },
    { id: "DOT-2Q", label: "DOT 2Q" },
  ],

  // A6.5 - Nonliquefied Compressed Gases
  "A6.5": [
    { id: "DOT-3", label: "DOT 3" },
    { id: "DOT-3A", label: "DOT 3A" },
    { id: "DOT-3AA", label: "DOT 3AA" },
    { id: "DOT-3AL", label: "DOT 3AL" },
    { id: "DOT-3AX", label: "DOT 3AX" },
    { id: "DOT-3AAX", label: "DOT 3AAX" },
    { id: "DOT-3B", label: "DOT 3B" },
    { id: "DOT-3E", label: "DOT 3E" },
    { id: "DOT-3HT", label: "DOT 3HT" },
    { id: "DOT-3T", label: "DOT 3T" },
    { id: "DOT-4B", label: "DOT 4B" },
    { id: "DOT-4BA", label: "DOT 4BA" },
    { id: "DOT-4BW", label: "DOT 4BW" },
    { id: "DOT-39", label: "DOT 39" },
  ],

  // A6.6 - Liquefied Petroleum Gas (LPG)
  "A6.6": [
    { id: "DOT-3", label: "DOT 3" },
    { id: "DOT-3A", label: "DOT 3A" },
    { id: "DOT-3AA", label: "DOT 3AA" },
    { id: "DOT-3AL", label: "DOT 3AL" },
    { id: "DOT-3B", label: "DOT 3B" },
    { id: "DOT-3E", label: "DOT 3E" },
    { id: "DOT-4B", label: "DOT 4B" },
    { id: "DOT-4BA", label: "DOT 4BA" },
    { id: "DOT-4B240ET", label: "DOT 4B240ET" },
    { id: "DOT-4BW", label: "DOT 4BW" },
    { id: "DOT-4E", label: "DOT 4E" },
    { id: "DOT-39", label: "DOT 39" },
    { id: "DOT-2P", label: "DOT 2P" },
    { id: "DOT-2Q", label: "DOT 2Q" },
  ],

  // A6.7 - Fire Extinguishers
  "A6.7": [
    { id: "DOT-3A", label: "DOT 3A" },
    { id: "DOT-3AA", label: "DOT 3AA" },
    { id: "DOT-3AL", label: "DOT 3AL" },
    { id: "DOT-3E", label: "DOT 3E" },
    { id: "DOT-3HT", label: "DOT 3HT" },
    { id: "DOT-4B", label: "DOT 4B" },
    { id: "DOT-4BA", label: "DOT 4BA" },
    { id: "DOT-4B240ET", label: "DOT 4B240ET" },
    { id: "DOT-4BW", label: "DOT 4BW" },
    { id: "DOT-4D", label: "DOT 4D" },
    { id: "DOT-4DA", label: "DOT 4DA" },
    { id: "DOT-4DS", label: "DOT 4DS" },
    { id: "DOT-2P", label: "DOT 2P" },
    { id: "DOT-2Q", label: "DOT 2Q" },
    { id: "NON-DOT-SPEC", label: "Non-DOT (marked 'MEETS DOT REQUIREMENTS')" },
  ],

  // A6.8 - Refrigerating Machines, Air Conditioners, and Pressurized Equipment
  // No DOT specification cylinders required - factory-tested units exempt
  // Not included in this list

  // A6.9 - Acetylene Gas
  "A6.9": [
    { id: "DOT-8", label: "DOT 8" },
    { id: "DOT-8AL", label: "DOT 8AL" },
    { id: "UN-ACETYLENE", label: "UN Cylinder (marked 'USA')" },
  ],

  // A6.10 - Cigarette Lighters or Similar Devices Charged With Fuel
  "A6.10": [
    { id: "LIGHTER-DEVICE", label: "Lighter Device" },
    { id: "LIGHTER-REFILL", label: "Lighter Refill" },
  ],

  // A6.11 - Cryogenic Liquids
  "A6.11": [
    { id: "DOT-4L", label: "DOT 4L" },
    { id: "DEWAR", label: "Dewar (25 L capacity)" },
    { id: "TMU-27M", label: "TMU-27M (189 L/50 gal)" },
    { id: "C-1", label: "C-1 Container (1892 L/500 gal)" },
    { id: "LS-160", label: "LS-160" },
    { id: "LS-240", label: "LS-240" },
  ],

  // A6.12 - Ethyl Chloride
  "A6.12": [
    { id: "DOT-3A", label: "DOT 3A" },
    { id: "DOT-3AA", label: "DOT 3AA" },
    { id: "DOT-3B", label: "DOT 3B" },
    { id: "DOT-3E", label: "DOT 3E" },
    { id: "DOT-4B", label: "DOT 4B" },
    { id: "DOT-4BA", label: "DOT 4BA" },
    { id: "DOT-4BW", label: "DOT 4BW" },
    { id: "DRUM-1A1", label: "Steel Drum (1A1)" },
  ],

  // A6.13 - Ethylene Oxide
  "A6.13": [
    { id: "DOT-3A", label: "DOT 3A" },
    { id: "DOT-3AA", label: "DOT 3AA" },
    { id: "DOT-3B", label: "DOT 3B" },
    { id: "DOT-4B", label: "DOT 4B" },
    { id: "DOT-4BA", label: "DOT 4BA" },
    { id: "DOT-4BW", label: "DOT 4BW" },
  ],

  // A6.14 - Ethylamine (Monoethylamine, Aminoethane)
  "A6.14": [
    { id: "DOT-3A", label: "DOT 3A" },
    { id: "DOT-3AA", label: "DOT 3AA" },
    { id: "DOT-3AL", label: "DOT 3AL" },
    { id: "DOT-3B", label: "DOT 3B" },
    { id: "DOT-3E", label: "DOT 3E" },
    { id: "DOT-4B", label: "DOT 4B" },
    { id: "DOT-4BA", label: "DOT 4BA" },
    { id: "DOT-4BW", label: "DOT 4BW" },
    { id: "DRUM-1A1", label: "Metal Drum (1A1)" },
  ],

  // A6.15 - Arsine; Cyanogen Chloride; Cyanogen; Germane; Phosphine; Phosgene
  "A6.15": [
    { id: "DOT-3A1800", label: "DOT 3A1800" },
    { id: "DOT-3AA1800", label: "DOT 3AA1800" },
    { id: "DOT-3AL1800", label: "DOT 3AL1800", restrictions: "NOT for Arsine/Phosphine" },
    { id: "DOT-3D", label: "DOT 3D" },
    { id: "DOT-3E1800", label: "DOT 3E1800" },
    { id: "DOT-33", label: "DOT 33" },
  ],

  // A6.16 - Bromoacetone; Methyl Bromide; Chloropicrin Mixtures
  "A6.16": [
    { id: "DOT-3A", label: "DOT 3A" },
    { id: "DOT-3AA", label: "DOT 3AA" },
    { id: "DOT-3B", label: "DOT 3B" },
    { id: "DOT-3C", label: "DOT 3C" },
    { id: "DOT-3E", label: "DOT 3E" },
    { id: "DOT-4A", label: "DOT 4A" },
    { id: "DOT-4B", label: "DOT 4B" },
    { id: "DOT-4BA", label: "DOT 4BA" },
    { id: "DOT-4BW", label: "DOT 4BW" },
    { id: "DOT-4C", label: "DOT 4C" },
  ],

  // A6.17 - Gas Identification Sets
  "A6.17": [
    { id: "GLASS-RECEPTACLE", label: "Glass Receptacle (≤40 mL)" },
    { id: "METAL-CAN", label: "Metal Can" },
    { id: "STEEL-CYLINDER", label: "Steel Cylinder" },
  ],

  // A6.18 - Hexaethyl Tetraphosphate and Toxic Insecticide Gases
  "A6.18": [
    { id: "DOT-3A240", label: "DOT 3A240" },
    { id: "DOT-3AA240", label: "DOT 3AA240" },
    { id: "DOT-3B240", label: "DOT 3B240" },
    { id: "DOT-4A240", label: "DOT 4A240" },
    { id: "DOT-4B240", label: "DOT 4B240" },
    { id: "DOT-4BA240", label: "DOT 4BA240" },
    { id: "DOT-4BW240", label: "DOT 4BW240" },
  ],

  // A6.19 - Class 2.3 Materials (Poisonous by Inhalation, Hazard Zone A)
  "A6.19": [
    { id: "DOT-3A", label: "DOT 3A" },
    { id: "DOT-3AA", label: "DOT 3AA" },
    { id: "DOT-3AL", label: "DOT 3AL" },
    { id: "DOT-3B", label: "DOT 3B" },
    { id: "DOT-3E", label: "DOT 3E" },
    { id: "DOT-4B", label: "DOT 4B" },
    { id: "DOT-4BA", label: "DOT 4BA" },
    { id: "DOT-4BW", label: "DOT 4BW" },
    { id: "DRUM-1A1", label: "Inner Drum (1A1)" },
    { id: "DRUM-1B1", label: "Inner Drum (1B1)" },
    { id: "DRUM-1H1", label: "Inner Drum (1H1)" },
    { id: "DRUM-1N1", label: "Inner Drum (1N1)" },
  ],

  // A6.20 - Nitric Oxide
  "A6.20": [
    { id: "DOT-3A1800", label: "DOT 3A1800" },
    { id: "DOT-3AA1800", label: "DOT 3AA1800" },
    { id: "DOT-3AL1800", label: "DOT 3AL1800" },
    { id: "DOT-3E1800", label: "DOT 3E1800" },
  ],

  // A6.21 - Ethyl Methyl Ether
  "A6.21": [
    { id: "DOT-3A", label: "DOT 3A" },
    { id: "DOT-3AA", label: "DOT 3AA" },
    { id: "DOT-3AL", label: "DOT 3AL" },
    { id: "DOT-3B", label: "DOT 3B" },
    { id: "DOT-3E", label: "DOT 3E" },
    { id: "DOT-4B", label: "DOT 4B" },
    { id: "DOT-4BA", label: "DOT 4BA" },
    { id: "DOT-4BW", label: "DOT 4BW" },
    { id: "DRUM-1A1", label: "Steel Drum (1A1)" },
    { id: "DRUM-1B1", label: "Aluminum Drum (1B1)" },
    { id: "DRUM-1H1", label: "Plastic Drum (1H1)" },
  ],

  // A6.22 - Chemical Under Pressure N.O.S.
  "A6.22": [
    { id: "DOT-3A", label: "DOT 3A" },
    { id: "DOT-3AA", label: "DOT 3AA" },
    { id: "DOT-3AL", label: "DOT 3AL" },
    { id: "DOT-3B", label: "DOT 3B" },
    { id: "DOT-3E", label: "DOT 3E" },
    { id: "DOT-4B", label: "DOT 4B" },
    { id: "DOT-4BA", label: "DOT 4BA" },
    { id: "DOT-4BW", label: "DOT 4BW" },
  ],

  // A6.23 - Fuel Cell Cartridges
  // No DOT specification cylinders - outer packaging only
  // Not included in this list

  // A6.24 - Fuel Cell Cartridges Contained in Equipment
  // UN specification packaging NOT required
  // Not included in this list

  // A6.25 - Fuel Cell Packed With Equipment
  // UN specification packaging NOT required
  // Not included in this list

  // A6.26 - Metal Hydride Storage Systems
  "A6.26": [
    { id: "UN-METAL-HYDRIDE", label: "UN Metal Hydride Storage System" },
  ],

  // A6.27 - Flammable Gas Powered Engines and Machinery
  "A6.27": [
    { id: "NON-DOT-FUEL-TANK", label: "Non-DOT Fuel Tank (emptied)" },
  ],

  // A6.28 - Articles Containing Flammable Gas N.O.S.
  "A6.28": [
    { id: "ARTICLE-CONTAINER", label: "Article Container" },
  ],
};

/**
 * Extract the base A6.X paragraph from a full packaging paragraph string.
 * Examples:
 *   "A6.5.1" -> "A6.5"
 *   "A6.4" -> "A6.4"
 *   "A6.11.2.3" -> "A6.11"
 *
 * @param packagingParagraph The full packaging paragraph string
 * @returns The base A6.X paragraph or null if not found
 */
export function extractA6Paragraph(packagingParagraph: string): string | null {
  if (!packagingParagraph) return null;

  // Match A6.X or A6.XX (e.g., A6.5, A6.11, A6.28)
  const match = packagingParagraph.match(/A6\.(\d{1,2})/i);
  if (match) {
    return `A6.${match[1]}`;
  }

  return null;
}

/**
 * Get the list of valid cylinder types for a given packaging paragraph.
 *
 * @param packagingParagraph The packaging paragraph (e.g., "A6.5.1", "A6.4")
 * @returns Array of valid cylinder types, or empty array if paragraph not found
 */
export function getCylinderTypesForParagraph(
  packagingParagraph: string
): CylinderType[] {
  const baseParagraph = extractA6Paragraph(packagingParagraph);
  if (!baseParagraph) return [];

  return CYLINDER_TYPES_BY_PARAGRAPH[baseParagraph] || [];
}

/**
 * Check if a packaging paragraph has cylinder type requirements.
 * Some paragraphs (A6.8, A6.23-A6.25) don't require cylinder type validation.
 *
 * @param packagingParagraph The packaging paragraph to check
 * @returns true if cylinder types are defined for this paragraph
 */
export function hasCylinderTypeRequirements(
  packagingParagraph: string
): boolean {
  const types = getCylinderTypesForParagraph(packagingParagraph);
  return types.length > 0;
}

/**
 * Paragraph titles for display purposes.
 */
export const PARAGRAPH_TITLES: Record<string, string> = {
  "A6.2": "Aerosols",
  "A6.3": "Small Receptacles",
  "A6.4": "Liquefied Compressed Gases",
  "A6.5": "Nonliquefied Compressed Gases",
  "A6.6": "Liquefied Petroleum Gas (LPG)",
  "A6.7": "Fire Extinguishers",
  "A6.8": "Refrigerating Machines/AC",
  "A6.9": "Acetylene Gas",
  "A6.10": "Cigarette Lighters",
  "A6.11": "Cryogenic Liquids",
  "A6.12": "Ethyl Chloride",
  "A6.13": "Ethylene Oxide",
  "A6.14": "Ethylamine",
  "A6.15": "Toxic Gases (Arsine, Phosgene, etc.)",
  "A6.16": "Bromoacetone/Methyl Bromide",
  "A6.17": "Gas Identification Sets",
  "A6.18": "Toxic Insecticide Gases",
  "A6.19": "Class 2.3 Hazard Zone A",
  "A6.20": "Nitric Oxide",
  "A6.21": "Ethyl Methyl Ether",
  "A6.22": "Chemical Under Pressure N.O.S.",
  "A6.23": "Fuel Cell Cartridges",
  "A6.24": "Fuel Cells in Equipment",
  "A6.25": "Fuel Cells Packed With Equipment",
  "A6.26": "Metal Hydride Storage Systems",
  "A6.27": "Flammable Gas Engines",
  "A6.28": "Articles Containing Flammable Gas",
};
