/**
 * Label Matching Table
 * Maps YOLOX detection class names to requirement label strings.
 */

import { AggregatedLabel } from "../ml/types/ocr";

export const labelMatchingTable: Record<string, string[]> = {
  // === HAZARD CLASS 1 - EXPLOSIVES ===
  "explosives1": ["Class 1", "1"],
  "explosives1.1": ["Class 1.1", "1.1"],
  "explosives1.1A": ["Class 1.1A", "1.1A"],
  "explosives1.1B": ["Class 1.1B", "1.1B"],
  "explosives1.1C": ["Class 1.1C", "1.1C"],
  "explosives1.1D": ["Class 1.1D", "1.1D"],
  "explosives1.1E": ["Class 1.1E", "1.1E"],
  "explosives1.1F": ["Class 1.1F", "1.1F"],
  "explosives1.1G": ["Class 1.1G", "1.1G"],
  "explosives1.1J": ["Class 1.1J", "1.1J"],
  "explosives1.1L": ["Class 1.1L", "1.1L"],
  "explosives1.2": ["Class 1.2", "1.2"],
  "explosives1.2B": ["Class 1.2B", "1.2B"],
  "explosives1.2C": ["Class 1.2C", "1.2C"],
  "explosives1.2D": ["Class 1.2D", "1.2D"],
  "explosives1.2E": ["Class 1.2E", "1.2E"],
  "explosives1.2F": ["Class 1.2F", "1.2F"],
  "explosives1.2G": ["Class 1.2G", "1.2G"],
  "explosives1.2H": ["Class 1.2H", "1.2H"],
  "explosives1.2J": ["Class 1.2J", "1.2J"],
  "explosives1.2L": ["Class 1.2L", "1.2L"],
  "explosives1.3": ["Class 1.3", "1.3"],
  "explosives1.3C": ["Class 1.3C", "1.3C"],
  "explosives1.3G": ["Class 1.3G", "1.3G"],
  "explosives1.3H": ["Class 1.3H", "1.3H"],
  "explosives1.3J": ["Class 1.3J", "1.3J"],
  "explosives1.3K": ["Class 1.3K", "1.3K"],
  "explosives1.3L": ["Class 1.3L", "1.3L"],
  "explosives1.4": ["Class 1.4", "1.4"],
  "explosives1.4B": ["Class 1.4B", "1.4B"],
  "explosives1.4C": ["Class 1.4C", "1.4C"],
  "explosives1.4D": ["Class 1.4D", "1.4D"],
  "explosives1.4E": ["Class 1.4E", "1.4E"],
  "explosives1.4F": ["Class 1.4F", "1.4F"],
  "explosives1.4G": ["Class 1.4G", "1.4G"],
  "explosives1.4S": ["Class 1.4S", "1.4S"],
  "explosives1.5": ["Class 1.5", "1.5"],
  "explosives1.5D": ["Class 1.5D", "1.5D"],
  "explosives1.5D_blastingAgents": ["Class 1.5D", "1.5D", "Blasting Agents"],
  "explosives1.6": ["Class 1.6", "1.6"],
  "explosives1.6N": ["Class 1.6N", "1.6N"],

  // === HAZARD CLASS 2 - GASES ===
  "flammableGasHazmatClass2.1": ["Class 2.1", "2.1", "Flammable Gas"],
  "nonFlammableGasHazmatClass2.2": ["Class 2.2", "2.2", "Non-Flammable Gas"],
  "oxygenHazmatClass2.2": ["Class 2.2", "2.2", "OXYGEN"],
  "toxicGasHazmatClass2.3": ["Class 2.3", "2.3", "Toxic Gas"],
  "poisonGasHazmatClass2.3": ["Class 2.3", "2.3", "Poison Gas"],
  "inhalationHazardHazmatClass2.3": ["Class 2.3", "2.3", "Inhalation Hazard"],
  "UN1977": ["Class 2.2", "2.2"],
  "fireExtinguisherManufacturedPriorToJan1976Label": ["Class 2.2", "2.2"],
  "meetsDotRequirements": ["MEETS DOT REQUIREMENTS"],
  "nonOdorized": ["Non-Odorized"],

  // === HAZARD CLASS 3 - FLAMMABLE LIQUIDS ===
  "flammableHazmatClass3": ["Class 3", "3", "Flammable"],
  "flammableLiquidHazmatClass3": ["Class 3", "3", "Flammable Liquid"],
  "combustibleHazmatClass3": ["Class 3", "3", "Combustible"],
  "gasolineHazmatClass3": ["Class 3", "3", "Gasoline"],
  "fuelOilHazmatClass3": ["Class 3", "3", "Fuel Oil"],

  // === HAZARD CLASS 4 - FLAMMABLE SOLIDS ===
  "flammableSolidHazmatClass4.1": ["Class 4.1", "4.1", "Flammable Solid"],
  "spontaneouslyCombustibleHazmatClass4.2": ["Class 4.2", "4.2", "Spontaneously Combustible"],
  "dangerousWhenWetHazmatClass4.3": ["Class 4.3", "4.3", "Dangerous When Wet"],

  // === HAZARD CLASS 5 - OXIDIZERS ===
  "oxidizerHazmatClass5.1": ["Class 5.1", "5.1", "Oxidizer"],
  "oxidizingAgentHazmatClass5.1": ["Class 5.1", "5.1", "Oxidizing Agent"],
  "oxygenGeneratorChemicalWithUN3356": ["Class 5.1", "5.1", "Oxygen Generator"],

  // === HAZARD CLASS 6 - TOXIC/INFECTIOUS ===
  "toxicHazmatClass6": ["Class 6.1", "6.1", "TOXIC"],
  "poisonHazmatClass6.1": ["Class 6.1", "6.1", "Poison", "TOXIC"],
  "inhalationHazardHazmatClass6.1": ["Class 6.1", "6.1", "TOXIC INHALATION HAZARD", "Inhalation Hazard"],
  "harmfulStowAwayFromFoodStuffsHazmatClass6.1": ["Class 6.1", "6.1", "Harmful"],
  "hazmatClass6PackingGroupIII": ["Class 6 PG III", "6.1", "Class 6.1"],
  "infectiousSubstanceHazmatClass6.2": ["Class 6.2", "6.2", "INFECTIOUS SUBSTANCE"],
  "biologicalSubstanceCategoryBWithUN3373": ["Class 6.2", "6.2", "Biological Substance", "UN3373"],

  // === HAZARD CLASS 8 - CORROSIVE ===
  "corrosiveHazmatClass8": ["Class 8", "8", "Corrosive"],

  // === HAZARD CLASS 9 - MISCELLANEOUS ===
  "miscellaneousHazmatClass9": ["Class 9", "9", "Miscellaneous"],
  "variousDangerousSubstancesHazmatClass9": ["Class 9", "9"],
  "magnetizedMaterials": ["Magnetized Material"],
  "magnetizedMaterialsWithUN2807": ["Magnetized Material", "UN2807"],
  "exceptedLithiumBatteries": ["Excepted Lithium Batteries", "Lithium Battery Mark"],
  "lithiumMetalBatteriesForbiddenForPassengerAircraft": ["Lithium Metal", "CARGO AIRCRAFT ONLY"],
  "environmentallyHazardousSubstancesSolidNOS": ["Class 9", "9", "Environmentally Hazardous"],
  "chemicalKit": ["Chemical Kit"],
  "firstAidKit": ["First Aid Kit"],

  // === GENERAL MARKINGS ===
  "cargoAircraftOnly": ["Cargo Aircraft Only", "CAO"],
  "keepAwayFromHeat": ["Keep Away From Heat"],
  "orientationArrows": ["Orientation", "This Way Up", "This Side Up", "Package Orientation"],
  "thisEndUpWithOrientationArrows": ["This End Up", "Orientation"],
  "thisSideUpWithOrientationArrows": ["This Side Up", "Orientation"],
  "thisWayUpWithOrientationArrows": ["This Way Up", "Orientation"],
  "overpack": ["OVERPACK"],
  "limitedQuantityMarking": ["Limited Quantity"],
  "exceptedQuantityMarking": ["Excepted Quantity"],
  "inhalationHazardMarking": ["Inhalation Hazard"],
  "insideContainersComplyWithPrescriberdRegulations": ["Inside Containers Comply", "INSIDE CONTAINERS COMPLY WITH PRESCRIBED SPECIFICATIONS"],
  "biohazardLabelForBulkPackagesContainingRegulatedMedicalWaste": ["Biohazard", "Regulated Medical Waste"],
  "empty": ["EMPTY"],
};

export const markingMatchingPatterns: Record<string, RegExp[]> = {
  "PSN and UN Number": [/UN\s*\d{4}/i, /[A-Z\s]+UN\s*\d{4}/i],
  "Military Shipping Label (MSL) or DD Form 1387": [/DD\s*1387/i, /MSL/i, /MIL-STD-129/i],
  "Inhalation Hazard": [/INHALATION\s*HAZARD/i],
  "This End Up": [/THIS\s*END\s*UP/i],
  "DOT Requirements": [/MEETS\s*DOT\s*REQUIREMENTS/i],
  "Inside Containers Comply": [/INSIDE\s*CONTAINERS\s*COMPLY/i],
  "Oxygen Generator": [/OXYGEN\s*GENERATOR/i, /CHEMICAL/i],
  "Biological Substance": [/BIOLOGICAL\s*SUBSTANCE/i, /CATEGORY\s*B/i, /UN\s*3373/i],
  "Energy Storage Capacity": [/\d+\.?\d*\s*Wh/i, /WATT[\s-]*HOUR/i],
  "DRY ICE": [/DRY\s*ICE/i, /CARBON\s*DIOXIDE\s*SOLID/i],
};

/**
 * Normalize a class name for lookup by removing spaces and lowercasing
 * e.g., "Explosives1.1 B" -> "explosives1.1b"
 */
function normalizeClassName(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "");
}

/**
 * Create a normalized lookup map for case-insensitive matching
 */
const normalizedLabelMatchingTable: Record<string, string[]> = {};
for (const [key, values] of Object.entries(labelMatchingTable)) {
  normalizedLabelMatchingTable[normalizeClassName(key)] = values;
}

export function findMatchingDetection(
  requirementLabel: string,
  expectedValues: string[],
  detectedLabels: AggregatedLabel[]
): AggregatedLabel | null {
  let bestMatch: AggregatedLabel | null = null;
  let bestConfidence = 0;

  for (const detection of detectedLabels) {
    // Normalize the class name for lookup (handles "Explosives1.1 B" -> "explosives1.1b")
    const normalizedClassName = normalizeClassName(detection.className);
    const mappedValues = normalizedLabelMatchingTable[normalizedClassName];

    if (!mappedValues) {
      // Try direct expected value matching as fallback
      // This handles cases where className directly contains the hazard class
      const classNameLower = detection.className.toLowerCase();
      for (const expected of expectedValues) {
        const expectedLower = expected.toLowerCase().replace(/\s+/g, "");
        // Check if className contains the expected class (e.g., "explosives1.1b" contains "1.1b")
        const classWithoutExplosives = classNameLower.replace("explosives", "").replace(/\s+/g, "");
        if (classNameLower.includes(expectedLower) || expectedLower.includes(classWithoutExplosives)) {
          if (detection.maxConfidence > bestConfidence) {
            bestMatch = detection;
            bestConfidence = detection.maxConfidence;
          }
        }
      }
      continue;
    }

    for (const mapped of mappedValues) {
      for (const expected of expectedValues) {
        const mappedLower = mapped.toLowerCase();
        const expectedLower = expected.toLowerCase();

        if (expectedLower.includes(mappedLower) || mappedLower.includes(expectedLower)) {
          if (detection.maxConfidence > bestConfidence) {
            bestMatch = detection;
            bestConfidence = detection.maxConfidence;
          }
        }
      }
    }
  }

  return bestMatch;
}

export function findMatchingMarkingInOCR(markingLabel: string, ocrText: string): boolean {
  const patterns = markingMatchingPatterns[markingLabel];
  if (!patterns) return false;
  return patterns.some((pattern) => pattern.test(ocrText));
}

export function getUnmatchedDetections(
  detectedLabels: AggregatedLabel[],
  matchedClassNames: Set<string>
): AggregatedLabel[] {
  return detectedLabels.filter((detection) => !matchedClassNames.has(detection.className));
}
