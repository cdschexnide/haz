import { HazmatCompatibilityKey } from './engineTypes';

export type A18Requirement = 'X' | '0' | '';

type BaseCategory =
  | '1.1'
  | '1.2'
  | '1.3'
  | '1.4'
  | '1.5'
  | '1.6'
  | '2.1'
  | '2.2'
  | '2.3ZA'
  | '2.3O'
  | '3'
  | '4.1'
  | '4.2'
  | '4.3'
  | '5.1'
  | '5.2'
  | '6.1PGI'
  | '7'
  | '8L'
  | '9L';

const LITHIUM_CLASS9_UNS = new Set(['UN3480', 'UN3090']);
const GAS_23_ZONE_A_UNS = new Set(['UN1092']);
const GAS_23_OTHER_UNS = new Set(['UN1098']);

const CLASS8_CORROSIVE_LIQUID_UNS = new Set([
  'UN1052', 'UN1715', 'UN1716', 'UN1718', 'UN1719', 'UN1724', 'UN1725',
  'UN1726', 'UN1728', 'UN1729', 'UN1730', 'UN1731', 'UN1732', 'UN1733',
  'UN1736', 'UN1739', 'UN1742', 'UN1743', 'UN1744', 'UN1747', 'UN1753',
  'UN1754', 'UN1755', 'UN1757', 'UN1758', 'UN1760', 'UN1761', 'UN1762',
  'UN1763', 'UN1764', 'UN1765', 'UN1766', 'UN1767', 'UN1768', 'UN1769',
  'UN1770', 'UN1771', 'UN1773', 'UN1774', 'UN1775', 'UN1776', 'UN1777',
  'UN1778', 'UN1779', 'UN1780', 'UN1781', 'UN1782', 'UN1783', 'UN1784',
  'UN1786', 'UN1787', 'UN1788', 'UN1789', 'UN1790', 'UN1791', 'UN1793',
  'UN1794', 'UN1796', 'UN1798', 'UN1799', 'UN1800', 'UN1801', 'UN1802',
  'UN1803', 'UN1804', 'UN1805', 'UN1806', 'UN1807', 'UN1808', 'UN1809',
  'UN1810', 'UN1814', 'UN1816', 'UN1817', 'UN1818', 'UN1819', 'UN1824',
  'UN1825', 'UN1826', 'UN1827', 'UN1828', 'UN1829', 'UN1830', 'UN1831',
  'UN1832', 'UN1833', 'UN1835', 'UN1836', 'UN1837', 'UN1839', 'UN1840',
  'UN1847', 'UN1848', 'UN1849', 'UN1898', 'UN1902', 'UN1903', 'UN1905',
  'UN1906', 'UN1907', 'UN1908', 'UN1938', 'UN1939', 'UN1940', 'UN2029',
  'UN2030', 'UN2031', 'UN2032', 'UN2051', 'UN2054', 'UN2079', 'UN2209',
  'UN2214', 'UN2215', 'UN2218', 'UN2225', 'UN2226', 'UN2240', 'UN2248',
  'UN2258', 'UN2259', 'UN2264', 'UN2269', 'UN2289', 'UN2305', 'UN2308',
  'UN2320', 'UN2326', 'UN2327', 'UN2357', 'UN2401', 'UN2434', 'UN2435',
  'UN2437', 'UN2439', 'UN2442', 'UN2443', 'UN2444', 'UN2475', 'UN2491',
  'UN2496', 'UN2502', 'UN2511', 'UN2513', 'UN2531', 'UN2564', 'UN2565',
  'UN2571', 'UN2576', 'UN2577', 'UN2578', 'UN2580', 'UN2581', 'UN2582',
  'UN2584', 'UN2586', 'UN2604', 'UN2619', 'UN2672', 'UN2677', 'UN2678',
  'UN2679', 'UN2680', 'UN2681', 'UN2682', 'UN2683', 'UN2685', 'UN2686',
  'UN2691', 'UN2692', 'UN2693', 'UN2698', 'UN2699', 'UN2705', 'UN2734',
  'UN2735', 'UN2751', 'UN2789', 'UN2790', 'UN2796', 'UN2797', 'UN2798',
  'UN2799', 'UN2801', 'UN2802', 'UN2809', 'UN2815', 'UN2817', 'UN2818',
  'UN2819', 'UN2820', 'UN2826', 'UN2829', 'UN2834', 'UN2837', 'UN2851',
  'UN2865', 'UN2869', 'UN2879', 'UN2904', 'UN2920', 'UN2922', 'UN2967',
  'UN2986', 'UN2987', 'UN3066', 'UN3093', 'UN3094', 'UN3144', 'UN3145',
  'UN3244', 'UN3264', 'UN3265', 'UN3266', 'UN3267', 'UN3301', 'UN3320',
  'UN3412', 'UN3421', 'UN3463', 'UN3471', 'UN3472', 'UN3484', 'UN3495',
  'UN3498',
]);

const pairRules = new Map<string, A18Requirement>();

const getPairKey = (a: BaseCategory, b: BaseCategory): string =>
  a < b ? `${a}|${b}` : `${b}|${a}`;

function getRequirementPriority(requirement: A18Requirement): number {
  switch (requirement) {
    case 'X':
      return 2;
    case '0':
      return 1;
    default:
      return 0;
  }
}

const setRule = (a: BaseCategory, b: BaseCategory, status: A18Requirement): void => {
  const key = getPairKey(a, b);
  const existing = pairRules.get(key);
  if (!existing) {
    pairRules.set(key, status);
    return;
  }

  // Some source relationships are asymmetrical across rows; keep the most restrictive result.
  pairRules.set(
    key,
    getRequirementPriority(status) > getRequirementPriority(existing) ? status : existing
  );
};

const setRules = (
  source: BaseCategory,
  targets: BaseCategory[],
  status: A18Requirement
): void => {
  targets.forEach(target => setRule(source, target, status));
};

// Table A18.1 canonical relationship map from docs/TableA18.1.relationships.md
setRules('1.1', ['2.1', '2.3ZA', '2.3O', '3', '4.1', '4.2', '4.3', '5.1', '5.2', '6.1PGI', '7', '8L'], 'X');
setRules('1.1', ['9L'], '0');

setRules('1.2', ['2.1', '2.3ZA', '2.3O', '3', '4.1', '4.2', '4.3', '5.1', '5.2', '6.1PGI', '7', '8L'], 'X');
setRules('1.2', ['9L'], '0');

setRules('1.3', ['2.1', '2.3ZA', '2.3O', '3', '4.1', '4.2', '4.3', '5.1', '5.2', '6.1PGI', '8L'], 'X');
setRules('1.3', ['7', '9L'], '0');

setRules('1.4', ['2.1', '2.3ZA', '2.3O', '3', '4.2', '6.1PGI', '8L', '9L'], '0');

setRules('1.5', ['2.1', '2.2', '2.3ZA', '2.3O', '3', '4.1', '4.2', '4.3', '5.1', '5.2', '6.1PGI', '7', '8L'], 'X');
setRules('1.5', ['9L'], '0');

setRules('1.6', ['9L'], '0');

setRules('2.1', ['1.1', '1.2', '1.3', '1.5', '2.3ZA'], 'X');
setRules('2.1', ['1.4', '2.3O', '4.2', '4.3', '5.1', '5.2', '6.1PGI', '7', '8L', '9L'], '0');

setRules('2.2', ['1.5'], 'X');

setRules('2.3ZA', ['1.1', '1.2', '1.3', '1.5', '2.1', '3', '4.1', '4.2', '4.3', '5.1', '5.2', '8L'], 'X');
setRules('2.3ZA', ['1.4'], '0');

setRules('2.3O', ['1.1', '1.2', '1.3', '1.5'], 'X');
setRules('2.3O', ['1.4', '2.1', '3', '4.1', '4.2', '4.3', '5.1', '5.2', '8L'], '0');

setRules('3', ['1.1', '1.2', '1.3', '1.5', '2.3ZA', '6.1PGI'], 'X');
setRules('3', ['1.4', '2.1', '2.3O', '4.1', '4.2', '4.3', '5.1', '5.2', '9L'], '0');

setRules('4.1', ['1.1', '1.2', '1.3', '1.5', '2.3ZA', '6.1PGI'], 'X');
setRules('4.1', ['2.3O', '3', '8L', '9L'], '0');

setRules('4.2', ['1.1', '1.2', '1.3', '1.5', '2.1', '2.3ZA', '6.1PGI', '8L'], 'X');
setRules('4.2', ['1.4', '2.3O', '3'], '0');

setRules('4.3', ['1.1', '1.2', '1.3', '1.5', '2.1', '2.3ZA', '6.1PGI'], 'X');
setRules('4.3', ['2.3O', '3', '8L'], '0');

setRules('5.1', ['1.1', '1.2', '1.3', '1.5', '2.1', '2.3ZA', '6.1PGI'], 'X');
setRules('5.1', ['2.3O', '3', '8L', '9L'], '0');

setRules('5.2', ['1.1', '1.2', '1.3', '1.5', '2.1', '2.3ZA', '6.1PGI'], 'X');
setRules('5.2', ['2.3O', '3', '8L'], '0');

setRules('6.1PGI', ['1.1', '1.2', '1.3', '1.5', '3', '4.1', '4.2', '4.3', '5.1', '5.2', '8L'], 'X');
setRules('6.1PGI', ['1.4', '2.1'], '0');

setRules('7', ['1.1', '1.2', '1.5'], 'X');
setRules('7', ['1.3', '2.1'], '0');

setRules('8L', ['1.1', '1.2', '1.3', '1.5', '2.3ZA', '4.2', '6.1PGI'], 'X');
setRules('8L', ['1.4', '2.1', '2.3O', '4.1', '4.3', '5.1', '5.2'], '0');

setRules('9L', ['1.1', '1.2', '1.3', '1.4', '1.5', '1.6', '2.1', '3', '4.1', '5.1'], '0');

function get2_3Category(material: HazmatCompatibilityKey): '2.3ZA' | '2.3O' {
  const unid = (material.unid || '').trim();
  const numericSpecialProvision = (material.numericSpecialProvision || '').trim();

  if (numericSpecialProvision === '1' || GAS_23_ZONE_A_UNS.has(unid)) {
    return '2.3ZA';
  }

  if (
    numericSpecialProvision === '2' ||
    numericSpecialProvision === '3' ||
    numericSpecialProvision === '4' ||
    GAS_23_OTHER_UNS.has(unid)
  ) {
    return '2.3O';
  }

  // Fallback for unknown 2.3 zone data: default to more restrictive Zone A.
  return '2.3ZA';
}

export function isClass8Liquid(material: HazmatCompatibilityKey): boolean {
  return (
    (material.hazardClassDivisionNumber || '').trim() === '8' &&
    CLASS8_CORROSIVE_LIQUID_UNS.has((material.unid || '').trim())
  );
}

export function isClass9LithiumOnly(material: HazmatCompatibilityKey): boolean {
  return (
    (material.hazardClassDivisionNumber || '').trim() === '9' &&
    LITHIUM_CLASS9_UNS.has((material.unid || '').trim())
  );
}

export function isClass61LiquidPGI(material: HazmatCompatibilityKey): boolean {
  if ((material.hazardClassDivisionNumber || '').trim() !== '6.1') {
    return false;
  }
  const packingGroup = (material.packingGroup || '').trim().toUpperCase();
  return packingGroup !== 'II' && packingGroup !== 'III';
}

function getCategory(material: HazmatCompatibilityKey): BaseCategory | null {
  const hazardClass = (material.hazardClassDivisionNumber || '').trim();

  switch (hazardClass) {
    case '2.3':
      return get2_3Category(material);
    case '6.1':
      return isClass61LiquidPGI(material) ? '6.1PGI' : null;
    case '8':
      return isClass8Liquid(material) ? '8L' : null;
    case '9':
      return isClass9LithiumOnly(material) ? '9L' : null;
    case '1.1':
    case '1.2':
    case '1.3':
    case '1.4':
    case '1.5':
    case '1.6':
    case '2.1':
    case '2.2':
    case '3':
    case '4.1':
    case '4.2':
    case '4.3':
    case '5.1':
    case '5.2':
    case '7':
      return hazardClass;
    default:
      return null;
  }
}

export function getTableA18_1Requirement(
  material1: HazmatCompatibilityKey,
  material2: HazmatCompatibilityKey
): A18Requirement {
  const category1 = getCategory(material1);
  const category2 = getCategory(material2);

  if (!category1 || !category2) {
    return '';
  }

  return pairRules.get(getPairKey(category1, category2)) || '';
}
