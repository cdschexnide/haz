import { ImageSourcePropType } from 'react-native';

const hazardDiamondMap: Record<string, ImageSourcePropType> = {
  // Class 1 - Explosives
  '1': require('../../assets/hazmatPngs/primaryHazardLabels/hazardClass1/explosives1.png'),
  '1.1': require('../../assets/hazmatPngs/primaryHazardLabels/hazardClass1/explosives1.1.png'),
  '1.2': require('../../assets/hazmatPngs/primaryHazardLabels/hazardClass1/explosives1.2.png'),
  '1.3': require('../../assets/hazmatPngs/primaryHazardLabels/hazardClass1/explosives1.3.png'),
  '1.4': require('../../assets/hazmatPngs/primaryHazardLabels/hazardClass1/explosives1.4.png'),
  '1.5': require('../../assets/hazmatPngs/primaryHazardLabels/hazardClass1/explosives1.5.png'),
  '1.6': require('../../assets/hazmatPngs/primaryHazardLabels/hazardClass1/explosives1.6.png'),

  // Class 2 - Gases
  '2.1': require('../../assets/hazmatPngs/primaryHazardLabels/hazardClass2/flammableGasHazmatClass2.1.png'),
  '2.2': require('../../assets/hazmatPngs/primaryHazardLabels/hazardClass2/nonFlammableGasHazmatClass2.2.png'),
  '2.3': require('../../assets/hazmatPngs/primaryHazardLabels/hazardClass2/toxicGasHazmatClass2.3.png'),

  // Class 3 - Flammable Liquids
  '3': require('../../assets/hazmatPngs/primaryHazardLabels/hazardClass3/flammableLiquidHazmatClass3.png'),

  // Class 4 - Flammable Solids
  '4.1': require('../../assets/hazmatPngs/primaryHazardLabels/hazardClass4/flammableSolidHazmatClass4.1.png'),
  '4.2': require('../../assets/hazmatPngs/primaryHazardLabels/hazardClass4/spontaneouslyCombustibleHazmatClass4.2.png'),
  '4.3': require('../../assets/hazmatPngs/primaryHazardLabels/hazardClass4/dangerousWhenWetHazmatClass4.3.png'),

  // Class 5 - Oxidizers (5.2 intentionally excluded — not in scope)
  '5.1': require('../../assets/hazmatPngs/primaryHazardLabels/hazardClass5/oxidizerHazmatClass5.1.png'),

  // Class 6 - Toxic / Infectious
  '6.1': require('../../assets/hazmatPngs/primaryHazardLabels/hazardClass6/toxicHazmatClass6.png'),
  '6.2': require('../../assets/hazmatPngs/primaryHazardLabels/hazardClass6/infectiousSubstanceHazmatClass6.2.png'),

  // Class 8 - Corrosive
  '8': require('../../assets/hazmatPngs/primaryHazardLabels/hazardClass8/corrosiveHazmatClass8.png'),

  // Class 9 - Miscellaneous
  '9': require('../../assets/hazmatPngs/primaryHazardLabels/hazardClass9/miscellaneousHazmatClass9.png'),
};

const hazardClassNames: Record<string, string> = {
  '1': 'Explosives',
  '1.1': 'Explosives (Mass Explosion)',
  '1.2': 'Explosives (Projection)',
  '1.3': 'Explosives (Fire/Minor Blast)',
  '1.4': 'Explosives (Minor)',
  '1.5': 'Explosives (Insensitive)',
  '1.6': 'Explosives (Extremely Insensitive)',
  '2.1': 'Flammable Gas',
  '2.2': 'Non-Flammable Gas',
  '2.3': 'Toxic Gas',
  '3': 'Flammable Liquid',
  '4.1': 'Flammable Solid',
  '4.2': 'Spontaneously Combustible',
  '4.3': 'Dangerous When Wet',
  '5.1': 'Oxidizer',
  '6.1': 'Toxic',
  '6.2': 'Infectious Substance',
  '8': 'Corrosive',
  '9': 'Miscellaneous Dangerous Goods',
};

/**
 * Normalizes a hazclassDiv string to a base key for lookup.
 * Handles Class 1 compatibility letters: "1.1D" -> "1.1", "1.4S" -> "1.4"
 */
function normalizeHazclassDiv(hazclassDiv: string): string {
  // Class 1 with compatibility letter: match pattern like "1.1D", "1.3G", "1.4S"
  const class1Match = hazclassDiv.match(/^(1\.\d)[A-Z]$/);
  if (class1Match) {
    return class1Match[1];
  }
  return hazclassDiv;
}

/**
 * Returns the hazard diamond image source for a given hazclassDiv string.
 * Handles Class 1 compatibility letters (e.g., "1.1D" -> "1.1").
 * Returns null if no image is available for the given class.
 */
export function getHazardDiamondImage(
  hazclassDiv: string | undefined | null
): ImageSourcePropType | null {
  if (!hazclassDiv) return null;
  const key = normalizeHazclassDiv(hazclassDiv);
  return hazardDiamondMap[key] ?? null;
}

/**
 * Returns the human-readable name for a hazard class/division.
 * Handles Class 1 compatibility letters (e.g., "1.1D" -> "Explosives (Mass Explosion)").
 * Returns null if unknown.
 */
export function getHazardClassName(
  hazclassDiv: string | undefined | null
): string | null {
  if (!hazclassDiv) return null;
  const key = normalizeHazclassDiv(hazclassDiv);
  return hazardClassNames[key] ?? null;
}

/**
 * Parses a subsidiary risk string into individual risk values.
 * Real data includes comma-separated values like "2.1, 8" or "5.1, 8".
 * Returns an array of trimmed individual values.
 */
export function parseSubsidiaryRisks(
  subsidiaryRisk: string | undefined | null
): string[] {
  if (!subsidiaryRisk || subsidiaryRisk.trim() === '') return [];
  return subsidiaryRisk.split(',').map(s => s.trim()).filter(Boolean);
}

