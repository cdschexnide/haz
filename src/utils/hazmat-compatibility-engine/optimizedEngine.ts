import { Rule } from 'json-rules-engine';
import { CheckCompatibleHazmatInput } from './resolvers-types';
import {
  CheckCompatibleHazmatOutput,
  COMPATIBILITY_GROUPS,
  HazmatCompatibilityKey,
  HazmatPairBeforeLookup,
  SegregatedHazmatMaterial,
  NoteConditionPair,
} from './engineTypes';
import { allHazmatCompatibilityKeys } from './allHazmatCompatibilityKeys';
import { parseNumericSpecialProvisionCode } from './engineHelperFunctions';
import {
  getSegregationRequirement,
  getClass1Compatibility,
  getSegregationMessage,
} from './lookupTables';
import { checkCompatibility } from './checkCompatibility';

// Result cache for hazard class combinations
const pairResultsCache = new Map<string, PairEvaluationResult>();

interface PairEvaluationResult {
  incompatible: boolean;
  requiresSegregation: boolean;
  segregationMessage: string;
  noteCondition?: 'note1' | 'note4' | 'note5' | 'note6' | 'note8' | 'note9' | 'note11' | 'note12' | null;
  noteContent?: string;
}

/**
 * Create a deterministic cache key for a material pair based on hazard class and compatibility group
 */
function getCacheKey(material1: HazmatCompatibilityKey, material2: HazmatCompatibilityKey): string {
  const key1 = `${material1.hazardClassDivisionNumber}-${material1.compatibilityGroup || 'N/A'}`;
  const key2 = `${material2.hazardClassDivisionNumber}-${material2.compatibilityGroup || 'N/A'}`;
  // Ensure consistent ordering for cache hits
  return key1 < key2 ? `${key1}:${key2}` : `${key2}:${key1}`;
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

  // List of cyanide UN numbers from note4Condition
  const cyanideUNs = new Set([
    'UN1051', 'UN1565', 'UN1575', 'UN1587', 'UN1588', 'UN1613', 'UN1614',
    'UN1620', 'UN1626', 'UN1636', 'UN1642', 'UN1653', 'UN1679', 'UN1680',
    'UN1684', 'UN1689', 'UN1694', 'UN1713', 'UN1935', 'UN2316', 'UN2317',
    'UN3294', 'UN3413', 'UN3414', 'UN3449'
  ]);

  // Check if one material is a cyanide and the other is Class 8
  const material1IsCyanide = cyanideUNs.has(unid1);
  const material2IsCyanide = cyanideUNs.has(unid2);
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
  const unid1 = material1.unid || '';
  const unid2 = material2.unid || '';
  const hazardClass1 = material1.hazardClassDivisionNumber || '';
  const hazardClass2 = material2.hazardClassDivisionNumber || '';

  // List of Class 8 corrosive liquid UN numbers from exceptions.ts
  const class8CorrosiveLiquids = new Set([
    'UN1052', 'UN1715', 'UN1716', 'UN1718', 'UN1719', 'UN1724', 'UN1725', 'UN1726', 'UN1728', 'UN1729',
    'UN1730', 'UN1731', 'UN1732', 'UN1733', 'UN1736', 'UN1739', 'UN1742', 'UN1743', 'UN1744', 'UN1747',
    'UN1753', 'UN1754', 'UN1755', 'UN1757', 'UN1758', 'UN1760', 'UN1761', 'UN1762', 'UN1763', 'UN1764',
    'UN1765', 'UN1766', 'UN1767', 'UN1768', 'UN1769', 'UN1770', 'UN1771', 'UN1773', 'UN1774', 'UN1775',
    'UN1776', 'UN1777', 'UN1778', 'UN1779', 'UN1780', 'UN1781', 'UN1782', 'UN1783', 'UN1784', 'UN1786',
    'UN1787', 'UN1788', 'UN1789', 'UN1790', 'UN1791', 'UN1793', 'UN1794', 'UN1796', 'UN1798', 'UN1799',
    'UN1800', 'UN1801', 'UN1802', 'UN1803', 'UN1804', 'UN1805', 'UN1806', 'UN1807', 'UN1808', 'UN1809',
    'UN1810', 'UN1814', 'UN1816', 'UN1817', 'UN1818', 'UN1819', 'UN1824', 'UN1825', 'UN1826', 'UN1827',
    'UN1828', 'UN1829', 'UN1830', 'UN1831', 'UN1832', 'UN1833', 'UN1835', 'UN1836', 'UN1837', 'UN1839',
    'UN1840', 'UN1847', 'UN1848', 'UN1849', 'UN1898', 'UN1902', 'UN1903', 'UN1905', 'UN1906', 'UN1907',
    'UN1908', 'UN1938', 'UN1939', 'UN1940', 'UN2029', 'UN2030', 'UN2031', 'UN2032', 'UN2051', 'UN2054',
    'UN2079', 'UN2209', 'UN2214', 'UN2215', 'UN2218', 'UN2225', 'UN2226', 'UN2240', 'UN2248', 'UN2258',
    'UN2259', 'UN2264', 'UN2269', 'UN2289', 'UN2305', 'UN2308', 'UN2320', 'UN2326', 'UN2327', 'UN2357',
    'UN2401', 'UN2434', 'UN2435', 'UN2437', 'UN2439', 'UN2442', 'UN2443', 'UN2444', 'UN2475', 'UN2491',
    'UN2496', 'UN2502', 'UN2511', 'UN2513', 'UN2531', 'UN2564', 'UN2565', 'UN2571', 'UN2576', 'UN2577',
    'UN2578', 'UN2580', 'UN2581', 'UN2582', 'UN2584', 'UN2586', 'UN2604', 'UN2619', 'UN2672', 'UN2677',
    'UN2678', 'UN2679', 'UN2680', 'UN2681', 'UN2682', 'UN2683', 'UN2685', 'UN2686', 'UN2691', 'UN2692',
    'UN2693', 'UN2698', 'UN2699', 'UN2705', 'UN2734', 'UN2735', 'UN2751', 'UN2789', 'UN2790', 'UN2796',
    'UN2797', 'UN2798', 'UN2799', 'UN2801', 'UN2802', 'UN2809', 'UN2815', 'UN2817', 'UN2818', 'UN2819',
    'UN2820', 'UN2826', 'UN2829', 'UN2834', 'UN2837', 'UN2851', 'UN2865', 'UN2869', 'UN2879', 'UN2904',
    'UN2920', 'UN2922', 'UN2967', 'UN2986', 'UN2987', 'UN3066', 'UN3093', 'UN3094', 'UN3144', 'UN3145',
    'UN3244', 'UN3264', 'UN3265', 'UN3266', 'UN3267', 'UN3301', 'UN3320', 'UN3412', 'UN3421', 'UN3463',
    'UN3471', 'UN3472', 'UN3484', 'UN3495', 'UN3498'
  ]);

  // Check if one material is a Class 8 corrosive liquid and the other is Class 4 or 5
  const material1IsCorrosiveLiquid = class8CorrosiveLiquids.has(unid1);
  const material2IsCorrosiveLiquid = class8CorrosiveLiquids.has(unid2);
  const material1IsClass4Or5 = hazardClass1.startsWith('4') || hazardClass1.startsWith('5');
  const material2IsClass4Or5 = hazardClass2.startsWith('4') || hazardClass2.startsWith('5');

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

  // Check note12Condition: UN3528 does not require segregation from other materials
  if (checkNote12Condition(material1, material2)) {
    if (debug) {
      console.log(`Note 12 applies: UN3528 does not require segregation from other hazardous materials`);
      console.log(`  ${unid1} (${hazardClass1}) + ${unid2} (${hazardClass2})`);
    }
    return {
      incompatible: false,
      requiresSegregation: false,
      segregationMessage: 'No Restrictions',
      noteCondition: 'note12',
      noteContent: "Segregation is not required between UN3528 and other hazardous materials",
    };
  }

  // Check note9Condition: UN1950 aerosol cans can ship with incompatible items if segregated
  if (checkNote9Condition(material1, material2)) {
    if (debug) {
      console.log(`Note 9 applies: UN1950 aerosol cans may be shipped with incompatible items when separated by 88 inches`);
      console.log(`  ${unid1} (${hazardClass1}) + ${unid2} (${hazardClass2})`);
    }
    return {
      incompatible: false,
      requiresSegregation: true,
      segregationMessage: 'Class 2.1 aerosol cans may be shipped with other incompatible items when separated in all directions by a minimum of 88 inches',
      noteCondition: 'note9',
      noteContent: "Class 2.1 aerosol cans may be shipped with other incompatible items when separated in all directions by a minimum of 88 inches"
    };
  }

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
  if (checkNote5Condition(material1, material2)) {
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
  if (checkNote8Condition(material1, material2)) {
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
  if (checkNote11Condition(material1, material2)) {
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

  // Check cache first
  const cacheKey = getCacheKey(material1, material2);
  if (pairResultsCache.has(cacheKey)) {
    if (debug) {
      console.log(`Cache hit for pair: ${cacheKey}`);
    }
    return pairResultsCache.get(cacheKey)!;
  }

  // Get base segregation requirement from Table A18.1
  const segregationResult = getSegregationRequirement(hazardClass1, hazardClass2);

  let incompatible = segregationResult === 'X';
  let requiresSegregation = segregationResult === '0';
  let segregationMessage = getSegregationMessage(segregationResult);

  // Special handling for Class 1 explosives using Table A18.2
  const isClass1Material1 = hazardClass1.startsWith('1');
  const isClass1Material2 = hazardClass2.startsWith('1');

  if (isClass1Material1 || isClass1Material2) {
    // If both are Class 1, check compatibility groups using Table A18.2
    if (isClass1Material1 && isClass1Material2) {
      const group1 = compatGroup1 || 'N/A';
      const group2 = compatGroup2 || 'N/A';

      if (group1 !== 'N/A' && group2 !== 'N/A') {
        const class1Result = getClass1Compatibility(group1, group2);
        if (class1Result === 'X') {
          incompatible = true;
          segregationMessage = 'Cannot Be Loaded';
        }
      }
    }

    // Apply additional Class 1 explosive rules from checkCompatibility
    // Create safe material objects for checkCompatibility
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
      const class1CompatibilityResult = checkCompatibility([safeMaterial1, safeMaterial2], debug);
      if (class1CompatibilityResult.length > 0) {
        incompatible = true;
        segregationMessage = 'Cannot Be Loaded';
      }
    } catch (error) {
      console.warn('Error in checkCompatibility for Class 1 explosives:', error);
      // Don't fail the entire operation, just skip the Class 1 specific checks
    }
  }

  const result: PairEvaluationResult = {
    incompatible,
    requiresSegregation,
    segregationMessage,
    noteCondition: null,
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
): Promise<CheckCompatibleHazmatOutput> => {
  const startTime = performance.now();

  console.log('hazmatObjects: ', JSON.stringify(hazmatObjects, null, 2));

  if (debug) {
    console.log('Starting optimized graph engine processing');
    console.log(`Processing ${hazmatObjects?.length || 0} hazmat objects`);
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
  const segregationPairs: SegregatedHazmatMaterial[] = [];
  const noteConditionPairs: NoteConditionPair[] = [];

  // Single pass through all pairs
  for (let i = 0; i < hazmatKeys.length; i++) {
    for (let j = i + 1; j < hazmatKeys.length; j++) {
      const result = evaluatePair(hazmatKeys[i], hazmatKeys[j], debug);

      if (result.incompatible) {
        incompatiblePairs.push([hazmatKeys[i], hazmatKeys[j]]);
      }

      if (result.requiresSegregation) {
        segregationPairs.push({
          hazmatObjectPair: [hazmatKeys[i], hazmatKeys[j]],
          segregationDescription: result.segregationMessage,
          noteCondition: result.noteCondition,
        });
      }

      // Capture ALL pairs with note conditions for UI display
      if (result.noteCondition && result.noteContent) {
        noteConditionPairs.push({
          hazmatObjectPair: [hazmatKeys[i], hazmatKeys[j]],
          noteCondition: result.noteCondition,
          noteContent: result.noteContent,
          status: result.incompatible ? 'incompatible' :
                  result.requiresSegregation ? 'segregation' :
                  'compatible'
        });
      }
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
    segregatedHazmatMaterials: segregationPairs,
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