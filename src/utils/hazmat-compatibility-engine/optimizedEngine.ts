import { Rule } from 'json-rules-engine';
import { CheckCompatibleHazmatInput } from './resolvers-types';
import {
  CheckCompatibleHazmatOutput,
  COMPATIBILITY_GROUPS,
  HazmatCompatibilityKey,
  HazmatPairBeforeLookup,
  SegregatedHazmatMaterial,
  NoteConditionPair,
  NoteCondition,
} from './engineTypes';
import { allHazmatCompatibilityKeys } from './allHazmatCompatibilityKeys';
import { parseNumericSpecialProvisionCode } from './engineHelperFunctions';
import {
  getClass1Compatibility,
  getSegregationMessage,
} from './lookupTables';
import { evaluateClass1PairWithNotes } from './checkCompatibility';
import {
  getTableA18_1Requirement,
  isClass61LiquidPGI,
  isClass8Liquid,
} from './tableA18Resolver';

// Result cache for hazard class combinations
const pairResultsCache = new Map<string, PairEvaluationResult>();

interface PairEvaluationResult {
  incompatible: boolean;
  requiresSegregation: boolean;
  segregationMessage: string;
  noteCondition?: NoteCondition | null;
  noteContent?: string;
  appliedNotes?: Array<{ noteCondition: NoteCondition; noteContent: string }>;
}

export interface CompatibilityEngineOptions {
  chapter3Enabled?: boolean;
}

const CYANIDE_UNS = new Set([
  'UN1051', 'UN1565', 'UN1575', 'UN1587', 'UN1588', 'UN1613', 'UN1614',
  'UN1620', 'UN1626', 'UN1636', 'UN1642', 'UN1653', 'UN1679', 'UN1680',
  'UN1684', 'UN1689', 'UN1694', 'UN1713', 'UN1935', 'UN2316', 'UN2317',
  'UN3294', 'UN3413', 'UN3414', 'UN3449',
]);

const INHALATION_HAZARD_ZONE_A_UNS = new Set(
  allHazmatCompatibilityKeys
    .filter(key =>
      (key.additionalInformation || '').toUpperCase().includes('HAZARD ZONE A')
    )
    .map(key => (key.unid || '').trim())
    .filter(Boolean)
);

const CHAPTER3_GROUP_RESTRICTED_EXPLOSIVES = new Set(['A', 'J', 'K', 'L']);
const CHAPTER3_HIGH_EXPLOSIVE_DIVISIONS = new Set(['1.1', '1.2', '1.3']);
const CHAPTER3_GAS_ZONE_A_UNS = new Set(['UN1092']);

const CHAPTER3_GENERAL_NOTE_CONTENT =
  'Chapter 3 authorization permits deviations from Table A18.1 and Table A18.2; normally incompatible hazardous materials may be transported on the same aircraft when separated to the maximum extent possible.';
const CHAPTER3_GENERAL_SEGREGATION_MESSAGE =
  'Chapter 3 authorization: separate to the maximum extent possible.';

/**
 * Create a deterministic cache key for a material pair.
 * Includes UN and packing-group data because Table A18.1 contains qualifier-based rules.
 */
function getCacheKey(
  material1: HazmatCompatibilityKey,
  material2: HazmatCompatibilityKey,
  chapter3Enabled: boolean
): string {
  const key1 = [
    material1.unid || '',
    material1.hazardClassDivisionNumber || '',
    material1.compatibilityGroup || 'N/A',
    material1.packingGroup || '',
  ].join('-');
  const key2 = [
    material2.unid || '',
    material2.hazardClassDivisionNumber || '',
    material2.compatibilityGroup || 'N/A',
    material2.packingGroup || '',
  ].join('-');
  // Ensure consistent ordering for cache hits
  const modePrefix = chapter3Enabled ? 'ch3' : 'std';
  return key1 < key2
    ? `${modePrefix}:${key1}:${key2}`
    : `${modePrefix}:${key2}:${key1}`;
}

/**
 * Check if note1Condition applies: UN2067 (Ammonium nitrate fertilizer, Class 5.1)
 * can be loaded with Class 1.1 or 1.5 materials, overriding normal incompatibility
 *
 * Note 1 from Table A18.1 (AFMAN 24-604)
 */
function checkNote1Condition(
  material1: HazmatCompatibilityKey,
  material2: HazmatCompatibilityKey
): boolean {
  const unid1 = material1.unid || '';
  const unid2 = material2.unid || '';
  const hazardClass1 = material1.hazardClassDivisionNumber || '';
  const hazardClass2 = material2.hazardClassDivisionNumber || '';

  // Check if one material is UN2067 and the other is Class 1.1 or 1.5
  const material1IsUN2067 = unid1 === 'UN2067';
  const material2IsUN2067 = unid2 === 'UN2067';
  const material1Is11Or15 = hazardClass1 === '1.1' || hazardClass1 === '1.5';
  const material2Is11Or15 = hazardClass2 === '1.1' || hazardClass2 === '1.5';

  return (material1IsUN2067 && material2Is11Or15) ||
         (material2IsUN2067 && material1Is11Or15);
}

/**
 * Check if note4Condition applies: Cyanides or cyanide mixtures (Class 6.1)
 * CANNOT be loaded with any Class 8 materials (incompatibility rule)
 *
 * Note 4 from Table A18.1 (AFMAN 24-604)
 */
function checkNote4Condition(
  material1: HazmatCompatibilityKey,
  material2: HazmatCompatibilityKey
): boolean {
  const unid1 = material1.unid || '';
  const unid2 = material2.unid || '';
  const hazardClass1 = material1.hazardClassDivisionNumber || '';
  const hazardClass2 = material2.hazardClassDivisionNumber || '';

  // Check if one material is a cyanide and the other is Class 8
  const material1IsCyanide = CYANIDE_UNS.has(unid1);
  const material2IsCyanide = CYANIDE_UNS.has(unid2);
  const material1IsClass8 = hazardClass1 === '8';
  const material2IsClass8 = hazardClass2 === '8';

  return (material1IsCyanide && material2IsClass8) ||
         (material2IsCyanide && material1IsClass8);
}

/**
 * Check if note5Condition applies: Nitric acid in carboys (Class 8) requires
 * 88" segregation from other Class 8 materials (segregation requirement)
 *
 * Note 5 from Table A18.1 (AFMAN 24-604)
 */
function checkNote5Condition(
  material1: HazmatCompatibilityKey,
  material2: HazmatCompatibilityKey
): boolean {
  const unid1 = material1.unid || '';
  const unid2 = material2.unid || '';
  const hazardClass1 = material1.hazardClassDivisionNumber || '';
  const hazardClass2 = material2.hazardClassDivisionNumber || '';

  // List of nitric acid in carboys UN numbers from note5Condition
  const nitricAcidUNs = new Set(['UN1796', 'UN1826', 'UN2031', 'UN2032']);

  // Check if one material is nitric acid and the other is Class 8
  const material1IsNitricAcid = nitricAcidUNs.has(unid1);
  const material2IsNitricAcid = nitricAcidUNs.has(unid2);
  const material1IsClass8 = hazardClass1 === '8';
  const material2IsClass8 = hazardClass2 === '8';

  return (material1IsNitricAcid && material2IsClass8) ||
         (material2IsNitricAcid && material1IsClass8);
}

/**
 * Check if note6Condition applies: Charged electric storage batteries (Class 8)
 * CANNOT be loaded with Class 1.1 or 1.2 explosives (incompatibility rule)
 *
 * Note 6 from Table A18.1 (AFMAN 24-604)
 */
function checkNote6Condition(
  material1: HazmatCompatibilityKey,
  material2: HazmatCompatibilityKey
): boolean {
  const unid1 = material1.unid || '';
  const unid2 = material2.unid || '';
  const hazardClass1 = material1.hazardClassDivisionNumber || '';
  const hazardClass2 = material2.hazardClassDivisionNumber || '';

  // List of charged electric storage battery UN numbers from note6Condition
  const batteryUNs = new Set(['UN2794', 'UN2795', 'UN2800', 'UN3028']);

  // Check if one material is a battery and the other is Class 1.1 or 1.2
  const material1IsBattery = batteryUNs.has(unid1);
  const material2IsBattery = batteryUNs.has(unid2);
  const material1Is11Or12 = hazardClass1 === '1.1' || hazardClass1 === '1.2';
  const material2Is11Or12 = hazardClass2 === '1.1' || hazardClass2 === '1.2';

  return (material1IsBattery && material2Is11Or12) ||
         (material2IsBattery && material1Is11Or12);
}

/**
 * Check if note8Condition applies: Class 8 corrosive liquids require segregation
 * from Class 4 or Class 5 materials (cannot be loaded above or adjacent)
 *
 * Note 8 from Table A18.1 (AFMAN 24-604)
 */
function checkNote8Condition(
  material1: HazmatCompatibilityKey,
  material2: HazmatCompatibilityKey
): boolean {
  const hazardClass1 = material1.hazardClassDivisionNumber || '';
  const hazardClass2 = material2.hazardClassDivisionNumber || '';

  // Check if one material is a Class 8 corrosive liquid and the other is Class 4 or 5
  const material1IsCorrosiveLiquid = isClass8Liquid(material1);
  const material2IsCorrosiveLiquid = isClass8Liquid(material2);
  // Note 8 language references "Class 4 (flammable solid)" which corresponds to Division 4.1.
  const material1IsClass4Or5 = hazardClass1 === '4.1' || hazardClass1.startsWith('5');
  const material2IsClass4Or5 = hazardClass2 === '4.1' || hazardClass2.startsWith('5');

  return (material1IsCorrosiveLiquid && material2IsClass4Or5) ||
         (material2IsCorrosiveLiquid && material1IsClass4Or5);
}

/**
 * Check if note9Condition applies: UN1950 (Class 2.1 aerosol cans) may be shipped
 * with incompatible items when separated by 88 inches (segregation requirement)
 *
 * Note 9 from Table A18.1 (AFMAN 24-604)
 */
function checkNote9Condition(
  material1: HazmatCompatibilityKey,
  material2: HazmatCompatibilityKey
): boolean {
  const unid1 = material1.unid || '';
  const unid2 = material2.unid || '';

  // Check if either material is UN1950 (aerosol cans)
  return unid1 === 'UN1950' || unid2 === 'UN1950';
}

/**
 * Check if note11Condition applies: Lithium batteries (UN3480, UN3090) must be
 * segregated from various hazard classes (segregation requirement)
 *
 * Note 11 from Table A18.1 (AFMAN 24-604)
 */
function checkNote11Condition(
  material1: HazmatCompatibilityKey,
  material2: HazmatCompatibilityKey
): boolean {
  const unid1 = material1.unid || '';
  const unid2 = material2.unid || '';
  const hazardClass1 = material1.hazardClassDivisionNumber || '';
  const hazardClass2 = material2.hazardClassDivisionNumber || '';

  // List of lithium battery UN numbers
  const lithiumBatteryUNs = new Set(['UN3480', 'UN3090']);

  // Classes that require segregation from lithium batteries
  // Note: Excludes 1.4S - lithium batteries are compatible with 1.4S without segregation
  const segregatedClasses = new Set(['1.1', '1.2', '1.3', '1.5', '1.6', '2.1', '3', '4.1', '5.1']);

  // Check if one material is a lithium battery and the other is a segregated class
  const material1IsLithiumBattery = lithiumBatteryUNs.has(unid1);
  const material2IsLithiumBattery = lithiumBatteryUNs.has(unid2);
  const material1RequiresSegregation = segregatedClasses.has(hazardClass1);
  const material2RequiresSegregation = segregatedClasses.has(hazardClass2);

  return (material1IsLithiumBattery && material2RequiresSegregation) ||
         (material2IsLithiumBattery && material1RequiresSegregation);
}

/**
 * Check if note12Condition applies: UN3528 does NOT require segregation from
 * other hazardous materials (removes segregation requirement)
 *
 * Note 12 from Table A18.1 (AFMAN 24-604)
 */
function checkNote12Condition(
  material1: HazmatCompatibilityKey,
  material2: HazmatCompatibilityKey
): boolean {
  const unid1 = material1.unid || '';
  const unid2 = material2.unid || '';

  // Check if either material is UN3528
  return unid1 === 'UN3528' || unid2 === 'UN3528';
}

function isInhalationHazardZoneA(material: HazmatCompatibilityKey): boolean {
  const unid = (material.unid || '').trim();
  const numericSpecialProvision = (material.numericSpecialProvision || '').trim();
  const hazardClass = (material.hazardClassDivisionNumber || '').trim();

  if (INHALATION_HAZARD_ZONE_A_UNS.has(unid)) {
    return true;
  }

  // Numeric SP 1 is the Zone A discriminator for gases in this ruleset.
  if (
    hazardClass === '2.3' &&
    (numericSpecialProvision === '1' || CHAPTER3_GAS_ZONE_A_UNS.has(unid))
  ) {
    return true;
  }

  return false;
}

function checkChapter3Condition1(
  material1: HazmatCompatibilityKey,
  material2: HazmatCompatibilityKey
): boolean {
  const hazardClass1 = (material1.hazardClassDivisionNumber || '').trim();
  const hazardClass2 = (material2.hazardClassDivisionNumber || '').trim();
  const compatibilityGroup1 = (material1.compatibilityGroup || '').trim();
  const compatibilityGroup2 = (material2.compatibilityGroup || '').trim();

  const material1RestrictedGroup =
    CHAPTER3_GROUP_RESTRICTED_EXPLOSIVES.has(compatibilityGroup1);
  const material2RestrictedGroup =
    CHAPTER3_GROUP_RESTRICTED_EXPLOSIVES.has(compatibilityGroup2);

  if (
    material1RestrictedGroup &&
    compatibilityGroup2 !== 'S' &&
    hazardClass2 !== '9'
  ) {
    return true;
  }

  if (
    material2RestrictedGroup &&
    compatibilityGroup1 !== 'S' &&
    hazardClass1 !== '9'
  ) {
    return true;
  }

  return false;
}

function checkChapter3Condition2(
  material1: HazmatCompatibilityKey,
  material2: HazmatCompatibilityKey
): boolean {
  const hazardClass1 = (material1.hazardClassDivisionNumber || '').trim();
  const hazardClass2 = (material2.hazardClassDivisionNumber || '').trim();

  return hazardClass1 === '7' || hazardClass2 === '7';
}

function checkChapter3Condition3(
  material1: HazmatCompatibilityKey,
  material2: HazmatCompatibilityKey
): boolean {
  const hazardClass1 = (material1.hazardClassDivisionNumber || '').trim();
  const hazardClass2 = (material2.hazardClassDivisionNumber || '').trim();

  const material1IsHighExplosive =
    CHAPTER3_HIGH_EXPLOSIVE_DIVISIONS.has(hazardClass1);
  const material2IsHighExplosive =
    CHAPTER3_HIGH_EXPLOSIVE_DIVISIONS.has(hazardClass2);

  return (
    (material1IsHighExplosive && isInhalationHazardZoneA(material2)) ||
    (material2IsHighExplosive && isInhalationHazardZoneA(material1))
  );
}

function checkChapter3Condition4(
  material1: HazmatCompatibilityKey,
  material2: HazmatCompatibilityKey
): boolean {
  const hazardClass1 = (material1.hazardClassDivisionNumber || '').trim();
  const hazardClass2 = (material2.hazardClassDivisionNumber || '').trim();

  const material1IsHighExplosive =
    CHAPTER3_HIGH_EXPLOSIVE_DIVISIONS.has(hazardClass1);
  const material2IsHighExplosive =
    CHAPTER3_HIGH_EXPLOSIVE_DIVISIONS.has(hazardClass2);

  return (
    (material1IsHighExplosive && isClass61LiquidPGI(material2)) ||
    (material2IsHighExplosive && isClass61LiquidPGI(material1))
  );
}

function checkChapter3Condition5(
  material1: HazmatCompatibilityKey,
  material2: HazmatCompatibilityKey
): boolean {
  return checkNote4Condition(material1, material2);
}

/**
 * Transform input hazmat objects to internal format with numeric special provisions
 */
function transformInputToKeys(hazmatObjects: CheckCompatibleHazmatInput[]): HazmatCompatibilityKey[] {
  return hazmatObjects.map((obj) => {
    if (!obj) {
      console.warn('transformInputToKeys: Found undefined object in hazmatObjects');
      return {
        compatibilityGroup: 'N/A' as typeof COMPATIBILITY_GROUPS[number],
        hazardClassDivisionNumber: '',
        properShippingName: '',
        unid: '',
        numericSpecialProvision: '',
        packingGroup: ''
      };
    }

    try {
      const compatibilityGroup = (obj.compatibilityGroup || '').trim() as typeof COMPATIBILITY_GROUPS[number];
      const hazardClassDivisionNumber = (obj.hazardClassDivisionNumber || '').trim();
      const properShippingName = (obj.properShippingName || '').trim();
      const unid = (obj.unid || '').trim();
      const packingGroup = (obj.packingGroup || '').trim();

      // Find matching key for numeric special provision
      let numericSpecialProvision = '';
      try {
        const matchingKey = allHazmatCompatibilityKeys.find((key) => {
          return (
            key.compatibilityGroup === compatibilityGroup &&
            key.hazardClassDivisionNumber === hazardClassDivisionNumber &&
            key.properShippingName === properShippingName &&
            key.unid === unid
          );
        });

        if (matchingKey && matchingKey.numericSpecialProvision) {
          numericSpecialProvision = parseNumericSpecialProvisionCode(
            String(matchingKey.numericSpecialProvision)
          );
        }
      } catch (error) {
        console.warn('Error finding numeric special provision:', error);
      }

      return {
        compatibilityGroup,
        hazardClassDivisionNumber,
        properShippingName,
        unid,
        numericSpecialProvision,
        packingGroup
      };
    } catch (error) {
      console.warn('Error transforming hazmat object:', error, obj);
      return {
        compatibilityGroup: 'N/A' as typeof COMPATIBILITY_GROUPS[number],
        hazardClassDivisionNumber: (obj.hazardClassDivisionNumber || '').trim(),
        properShippingName: (obj.properShippingName || '').trim(),
        unid: (obj.unid || '').trim(),
        numericSpecialProvision: '',
        packingGroup: ''
      };
    }
  });
}

/**
 * Evaluate compatibility and segregation requirements for a pair of materials
 */
function evaluatePair(
  material1: HazmatCompatibilityKey,
  material2: HazmatCompatibilityKey,
  debug?: boolean,
  chapter3Enabled: boolean = false,
): PairEvaluationResult {
  // Defensive checks for undefined materials or properties
  if (!material1 || !material2) {
    console.warn('evaluatePair: One or both materials are undefined', { material1, material2 });
    return {
      incompatible: false,
      requiresSegregation: false,
      segregationMessage: 'No Restrictions',
      noteCondition: null,
    };
  }

  // Ensure required properties exist and trim whitespace
  const hazardClass1 = (material1.hazardClassDivisionNumber || '').trim();
  const hazardClass2 = (material2.hazardClassDivisionNumber || '').trim();
  const compatGroup1 = (material1.compatibilityGroup || '').trim();
  const compatGroup2 = (material2.compatibilityGroup || '').trim();
  const unid1 = (material1.unid || '').trim();
  const unid2 = (material2.unid || '').trim();
  const psn1 = (material1.properShippingName || '').trim();
  const psn2 = (material2.properShippingName || '').trim();
  const packingGroup1 = (material1.packingGroup || '').trim();
  const packingGroup2 = (material2.packingGroup || '').trim();

  const cacheKey = getCacheKey(material1, material2, chapter3Enabled);
  if (pairResultsCache.has(cacheKey)) {
    if (debug) {
      console.log(`Cache hit for pair: ${cacheKey}`);
    }
    return pairResultsCache.get(cacheKey)!;
  }

  if (chapter3Enabled) {
    if (checkChapter3Condition1(material1, material2)) {
      const result: PairEvaluationResult = {
        incompatible: true,
        requiresSegregation: false,
        segregationMessage: 'Cannot Be Loaded',
        noteCondition: 'chapter3_note1',
        noteContent:
          'Chapter 3 restriction (A18.4.1): Explosives in compatibility groups A, J, K, and L can only be shipped with material in compatibility group S and Class 9.',
      };
      pairResultsCache.set(cacheKey, result);
      return result;
    }

    if (checkChapter3Condition2(material1, material2)) {
      const result: PairEvaluationResult = {
        incompatible: true,
        requiresSegregation: false,
        segregationMessage: 'Cannot Be Loaded',
        noteCondition: 'chapter3_note2',
        noteContent:
          'Chapter 3 restriction (A18.4.2): Fissile class III radioactive materials (Class 7) cannot be loaded, transported, or stored on the same aircraft with any other hazardous material.',
      };
      pairResultsCache.set(cacheKey, result);
      return result;
    }

    if (checkChapter3Condition3(material1, material2)) {
      const result: PairEvaluationResult = {
        incompatible: true,
        requiresSegregation: false,
        segregationMessage: 'Cannot Be Loaded',
        noteCondition: 'chapter3_note3',
        noteContent:
          'Chapter 3 restriction (A18.4.3): Class 1.1, 1.2, and 1.3 cannot be shipped with any Inhalation Hazard Zone A material.',
      };
      pairResultsCache.set(cacheKey, result);
      return result;
    }

    if (checkChapter3Condition4(material1, material2)) {
      const result: PairEvaluationResult = {
        incompatible: true,
        requiresSegregation: false,
        segregationMessage: 'Cannot Be Loaded',
        noteCondition: 'chapter3_note4',
        noteContent:
          'Chapter 3 restriction (A18.4.4): Class 1.1, 1.2, and 1.3 cannot be shipped with Class 6.1 poisonous liquids, Packing Group I.',
      };
      pairResultsCache.set(cacheKey, result);
      return result;
    }

    if (checkChapter3Condition5(material1, material2)) {
      const result: PairEvaluationResult = {
        incompatible: true,
        requiresSegregation: false,
        segregationMessage: 'Cannot Be Loaded',
        noteCondition: 'chapter3_note5',
        noteContent:
          'Chapter 3 restriction (A18.4.5): Cyanides or cyanide mixtures (Class 6.1) cannot be loaded, transported, or stored with any corrosive Class 8 material.',
      };
      pairResultsCache.set(cacheKey, result);
      return result;
    }

    const baselineResult = evaluatePair(material1, material2, debug, false);
    if (baselineResult.incompatible || baselineResult.requiresSegregation) {
      const result: PairEvaluationResult = {
        incompatible: false,
        requiresSegregation: true,
        segregationMessage: CHAPTER3_GENERAL_SEGREGATION_MESSAGE,
        noteCondition: 'chapter3_general',
        noteContent: CHAPTER3_GENERAL_NOTE_CONTENT,
      };
      pairResultsCache.set(cacheKey, result);
      return result;
    }

    const result: PairEvaluationResult = {
      incompatible: false,
      requiresSegregation: false,
      segregationMessage: 'No Restrictions',
      noteCondition: null,
    };
    pairResultsCache.set(cacheKey, result);
    return result;
  }

  // Check if materials are identical
  if (
    hazardClass1 === hazardClass2 &&
    compatGroup1 === compatGroup2 &&
    psn1 === psn2 &&
    unid1 === unid2
  ) {
    return {
      incompatible: false,
      requiresSegregation: false,
      segregationMessage: 'No Restrictions',
      noteCondition: null,
    };
  }

  // Class 6.1 with Packing Group II or III: No restrictions apply
  // Table A18.1 segregation rules only apply to Class 6.1 Packing Group I materials
  const material1IsClass61NonPGI = hazardClass1 === '6.1' && packingGroup1 !== 'I' && packingGroup1 !== '';
  const material2IsClass61NonPGI = hazardClass2 === '6.1' && packingGroup2 !== 'I' && packingGroup2 !== '';

  if (material1IsClass61NonPGI || material2IsClass61NonPGI) {
    if (debug) {
      console.log(`Class 6.1 with Packing Group II or III detected - no restrictions apply`);
      console.log(`  ${unid1} (${hazardClass1}, PG ${packingGroup1}) + ${unid2} (${hazardClass2}, PG ${packingGroup2})`);
    }
    return {
      incompatible: false,
      requiresSegregation: false,
      segregationMessage: 'No Restrictions',
      noteCondition: null,
    };
  }

  // Check note1Condition exception: UN2067 can be loaded with Class 1.1 or 1.5
  if (checkNote1Condition(material1, material2)) {
    if (debug) {
      console.log(`Note 1 exception applies: UN2067 (Ammonium nitrate fertilizer) can be loaded with Class 1.1 or 1.5 materials`);
      console.log(`  ${unid1} (${hazardClass1}) + ${unid2} (${hazardClass2})`);
    }
    return {
      incompatible: false,
      requiresSegregation: false,
      segregationMessage: 'No Restrictions',
      noteCondition: 'note1',
      noteContent: "Ammonium nitrate fertilizer may be loaded, transported, or stored with Class 1.1 or 1.5 materials"
    };
  }

  const hasNote12 = checkNote12Condition(material1, material2);

  // Check note4Condition: Cyanides cannot be loaded with Class 8
  if (checkNote4Condition(material1, material2)) {
    if (debug) {
      console.log(`Note 4 applies: Cyanides or cyanide mixtures cannot be loaded with Class 8 materials`);
      console.log(`  ${unid1} (${hazardClass1}) + ${unid2} (${hazardClass2})`);
    }
    return {
      incompatible: true,
      requiresSegregation: false,
      segregationMessage: 'Cannot Be Loaded',
      noteCondition: 'note4',
      noteContent: "Do not load, transport, or store cyanides or cyanide mixtures (Class 6.1) with any Class 8 materials"
    };
  }

  // Check note6Condition: Batteries cannot be loaded with Class 1.1 or 1.2
  if (checkNote6Condition(material1, material2)) {
    if (debug) {
      console.log(`Note 6 applies: Charged electric storage batteries cannot be loaded with Class 1.1 or 1.2`);
      console.log(`  ${unid1} (${hazardClass1}) + ${unid2} (${hazardClass2})`);
    }
    return {
      incompatible: true,
      requiresSegregation: false,
      segregationMessage: 'Cannot Be Loaded',
      noteCondition: 'note6',
      noteContent: "Do not load, transport, or store charged electric storage batteries (Class 8) on the same aircraft with any Class 1.1 or 1.2."
    };
  }

  // Check note5Condition: Nitric acid requires segregation from other Class 8
  if (checkNote5Condition(material1, material2) && !hasNote12) {
    if (debug) {
      console.log(`Note 5 applies: Nitric acid in carboys requires 88" segregation from other Class 8 materials`);
      console.log(`  ${unid1} (${hazardClass1}) + ${unid2} (${hazardClass2})`);
    }
    return {
      incompatible: false,
      requiresSegregation: true,
      segregationMessage: 'Separate nitric acid (Class 8) in carboys by 2.2 m (88 inches) in all directions from other corrosives materials in carboys',
      noteCondition: 'note5',
      noteContent: "Separate nitric acid (Class 8) in carboys by 2.2 m (88 inches) in all directions from other corrosives materials in carboys when loaded on the same aircraft"
    };
  }

  // Check note8Condition: Class 8 corrosive liquids require segregation from Class 4 or 5
  if (checkNote8Condition(material1, material2) && !hasNote12) {
    if (debug) {
      console.log(`Note 8 applies: Class 8 corrosive liquids may not be loaded above or adjacent to Class 4 or 5 materials`);
      console.log(`  ${unid1} (${hazardClass1}) + ${unid2} (${hazardClass2})`);
    }
    return {
      incompatible: false,
      requiresSegregation: true,
      segregationMessage: 'Class 8 corrosive liquids may not be loaded above or adjacent to Class 4 (flammable solid) material or Class 5 (oxidizing) material',
      noteCondition: 'note8',
      noteContent: "Class 8 corrosive liquids may not be loaded above or adjacent to Class 4 (flammable solid) material or Class 5 (oxidizing) material."
    };
  }

  // Check note11Condition: Lithium batteries require segregation from various classes
  if (checkNote11Condition(material1, material2) && !hasNote12) {
    if (debug) {
      console.log(`Note 11 applies: Lithium batteries must be segregated from Class 1 (except 1.4S), 2.1, 3, 4.1, or 5.1`);
      console.log(`  ${unid1} (${hazardClass1}) + ${unid2} (${hazardClass2})`);
    }
    return {
      incompatible: false,
      requiresSegregation: true,
      segregationMessage: 'Segregate lithium batteries (UN3480 and UN3090 only) from hazardous materials classified in Class 1 (other than Division 1.4S), Division 2.1, Class 3, Division 4.1 or Division 5.1',
      noteCondition: 'note11',
      noteContent: "Segregate lithium batteries (UN3480 and UN3090 only) from hazardous materials classified in Class 1 (other than Division 1.4S), Division 2.1, Class 3, Division 4.1 or Division 5.1."
    };
  }

  // Get base segregation requirement from Table A18.1 (qualifier-aware).
  const segregationResult = getTableA18_1Requirement(material1, material2);

  let incompatible = segregationResult === 'X';
  let requiresSegregation = segregationResult === '0';
  let segregationMessage = getSegregationMessage(segregationResult);
  let appliedNotes: Array<{ noteCondition: NoteCondition; noteContent: string }> = [];

  // Special handling for Class 1 explosives using Table A18.2
  const isClass1Material1 = hazardClass1.startsWith('1');
  const isClass1Material2 = hazardClass2.startsWith('1');

  if (isClass1Material1 && isClass1Material2) {
    // Table A18.2 defines pure compatible/incompatible results (no segregation) for Class 1 pairings.
    // The checkCompatibility helper applies both the base table and Notes 1-8 exception rules.
    const safeMaterial1 = {
      compatibilityGroup: compatGroup1 as typeof COMPATIBILITY_GROUPS[number],
      hazardClassDivisionNumber: hazardClass1,
      properShippingName: psn1,
      unid: unid1,
      numericSpecialProvision: material1.numericSpecialProvision || '',
    };
    const safeMaterial2 = {
      compatibilityGroup: compatGroup2 as typeof COMPATIBILITY_GROUPS[number],
      hazardClassDivisionNumber: hazardClass2,
      properShippingName: psn2,
      unid: unid2,
      numericSpecialProvision: material2.numericSpecialProvision || '',
    };

    try {
      const class1Evaluation = evaluateClass1PairWithNotes(safeMaterial1, safeMaterial2);
      incompatible = !class1Evaluation.compatible;
      requiresSegregation = false;
      segregationMessage = incompatible ? 'Cannot Be Loaded' : 'No Restrictions';
      appliedNotes = class1Evaluation.appliedNotes;
    } catch (error) {
      console.warn('Error in checkCompatibility for Class 1 explosives:', error);
      // Fallback to base Table A18.2 compatibility groups if note-rule evaluation fails.
      const group1 = compatGroup1 || 'N/A';
      const group2 = compatGroup2 || 'N/A';
      if (group1 !== 'N/A' && group2 !== 'N/A') {
        const class1Result = getClass1Compatibility(group1, group2);
        incompatible = class1Result === 'X';
        requiresSegregation = false;
        segregationMessage = incompatible ? 'Cannot Be Loaded' : 'No Restrictions';
      }
    }
  }

  // Note 9 only applies when UN1950 is otherwise incompatible and converts to segregation.
  if (checkNote9Condition(material1, material2) && incompatible) {
    if (debug) {
      console.log(`Note 9 applies: UN1950 aerosol cans convert incompatibility to 88-inch segregation`);
      console.log(`  ${unid1} (${hazardClass1}) + ${unid2} (${hazardClass2})`);
    }
    const note9Result: PairEvaluationResult = {
      incompatible: false,
      requiresSegregation: true,
      segregationMessage:
        'Class 2.1 aerosol cans may be shipped with other incompatible items when separated in all directions by a minimum of 88 inches',
      noteCondition: 'note9',
      noteContent:
        'Class 2.1 aerosol cans may be shipped with other incompatible items when separated in all directions by a minimum of 88 inches',
    };
    pairResultsCache.set(cacheKey, note9Result);
    return note9Result;
  }

  // Note 12 removes segregation only; it does not override an incompatibility.
  if (hasNote12 && requiresSegregation && !incompatible) {
    if (debug) {
      console.log(`Note 12 applies: UN3528 removes segregation requirement`);
      console.log(`  ${unid1} (${hazardClass1}) + ${unid2} (${hazardClass2})`);
    }
    const note12Result: PairEvaluationResult = {
      incompatible: false,
      requiresSegregation: false,
      segregationMessage: 'No Restrictions',
      noteCondition: 'note12',
      noteContent: 'Segregation is not required between UN3528 and other hazardous materials',
    };
    pairResultsCache.set(cacheKey, note12Result);
    return note12Result;
  }

  const primaryAppliedNote = appliedNotes[0];
  const result: PairEvaluationResult = {
    incompatible,
    requiresSegregation,
    segregationMessage,
    noteCondition: primaryAppliedNote?.noteCondition || null,
    noteContent: primaryAppliedNote?.noteContent,
    appliedNotes: appliedNotes.length > 0 ? appliedNotes : undefined,
  };

  // Cache the result
  pairResultsCache.set(cacheKey, result);

  if (debug) {
    console.log(`Evaluated pair: ${unid1} - ${unid2}`, result);
  }

  return result;
}

/**
 * Optimized version of runGraphEngine using direct table lookups and single-pass processing
 */
export const runGraphEngineOptimized = async (
  hazmatObjects: CheckCompatibleHazmatInput[],
  rules: Rule[], // Keep for compatibility, but not used in optimized version
  debug?: boolean,
  options?: CompatibilityEngineOptions,
): Promise<CheckCompatibleHazmatOutput> => {
  const startTime = performance.now();
  const chapter3Enabled = !!options?.chapter3Enabled;

  console.log('hazmatObjects: ', JSON.stringify(hazmatObjects, null, 2));

  if (debug) {
    console.log('Starting optimized graph engine processing');
    console.log(`Processing ${hazmatObjects?.length || 0} hazmat objects`);
    console.log(`Chapter 3 mode: ${chapter3Enabled ? 'enabled' : 'disabled'}`);
  }

  // Defensive check for input
  if (!hazmatObjects || !Array.isArray(hazmatObjects)) {
    console.warn('runGraphEngineOptimized: Invalid hazmatObjects input', hazmatObjects);
    return {
      hazmatCompatibilityKeys: [],
      segregatedHazmatMaterials: [],
      noteConditionPairs: [],
    };
  }

  if (hazmatObjects.length === 0) {
    return {
      hazmatCompatibilityKeys: [],
      segregatedHazmatMaterials: [],
      noteConditionPairs: [],
    };
  }

  // Transform input to internal format
  const hazmatKeys = transformInputToKeys(hazmatObjects);
  console.log("HazmatKeys: ", JSON.stringify(hazmatKeys, null, 2));
  const incompatiblePairs: HazmatPairBeforeLookup[] = [];
  const incompatiblePairIndices: [number, number][] = [];
  const segregationPairs: SegregatedHazmatMaterial[] = [];
  const segregationPairIndices: [number, number][] = [];
  const noteConditionPairs: NoteConditionPair[] = [];

  // Single pass through all pairs
  for (let i = 0; i < hazmatKeys.length; i++) {
    for (let j = i + 1; j < hazmatKeys.length; j++) {
      const result = evaluatePair(
        hazmatKeys[i],
        hazmatKeys[j],
        debug,
        chapter3Enabled
      );

      if (result.incompatible) {
        incompatiblePairs.push([hazmatKeys[i], hazmatKeys[j]]);
        incompatiblePairIndices.push([i, j]);
      }

      if (result.requiresSegregation) {
        segregationPairs.push({
          hazmatObjectPair: [hazmatKeys[i], hazmatKeys[j]],
          pairIndices: [i, j],
          segregationDescription: result.segregationMessage,
          noteCondition: result.noteCondition,
        });
        segregationPairIndices.push([i, j]);
      }

      // Capture ALL applied note conditions for UI display.
      const notesToRecord =
        result.appliedNotes && result.appliedNotes.length > 0
          ? result.appliedNotes
          : result.noteCondition && result.noteContent
          ? [{ noteCondition: result.noteCondition, noteContent: result.noteContent }]
          : [];

      notesToRecord.forEach(note => {
        noteConditionPairs.push({
          hazmatObjectPair: [hazmatKeys[i], hazmatKeys[j]],
          pairIndices: [i, j],
          noteCondition: note.noteCondition,
          noteContent: note.noteContent,
          status: result.incompatible
            ? 'incompatible'
            : result.requiresSegregation
            ? 'segregation'
            : 'compatible',
        });
      });
    }
  }

  const endTime = performance.now();
  const executionTime = endTime - startTime;

  if (debug) {
    console.log(`Found ${incompatiblePairs.length} incompatible pairs`);
    console.log(`Found ${segregationPairs.length} segregation pairs`);
    console.log(`Found ${noteConditionPairs.length} note condition pairs`);
    console.log(`Cache size: ${pairResultsCache.size}`);
  }

  // Always log execution time to show performance improvement
  console.log(`🚀 runGraphEngineOptimized completed in ${executionTime.toFixed(2)}ms (${hazmatObjects?.length || 0} materials, ${Math.floor(((hazmatObjects?.length || 0) * ((hazmatObjects?.length || 0) - 1)) / 2)} pairs)`);

  return {
    hazmatCompatibilityKeys: incompatiblePairs,
    incompatiblePairIndices,
    segregatedHazmatMaterials: segregationPairs,
    segregationPairIndices,
    noteConditionPairs: noteConditionPairs,
  };
};

/**
 * Clear the results cache (useful for testing or memory management)
 */
export function clearCache(): void {
  pairResultsCache.clear();
}

/**
 * Get cache statistics for debugging
 */
export function getCacheStats(): { size: number; keys: string[] } {
  return {
    size: pairResultsCache.size,
    keys: Array.from(pairResultsCache.keys()),
  };
}
