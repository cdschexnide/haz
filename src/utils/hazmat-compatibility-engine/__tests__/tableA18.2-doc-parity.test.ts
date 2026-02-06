import { runGraphEngineOptimized, clearCache } from '../optimizedEngine';
import { COMPATIBILITY_GROUPS, HazmatCompatibilityKey } from '../engineTypes';

type ResultCode = 'X' | '0' | '';

function createClass1Material(
  compatibilityGroup: typeof COMPATIBILITY_GROUPS[number],
  unid: string
): HazmatCompatibilityKey {
  return {
    hazardClassDivisionNumber: '1.1',
    unid,
    properShippingName: `CLASS 1 GROUP ${compatibilityGroup}`,
    compatibilityGroup,
    numericSpecialProvision: 'N/A',
    packingGroup: '',
  };
}

async function evaluatePair(
  material1: HazmatCompatibilityKey,
  material2: HazmatCompatibilityKey
): Promise<ResultCode> {
  const result = await runGraphEngineOptimized([material1, material2], [], false);
  if (result.hazmatCompatibilityKeys.length > 0) {
    return 'X';
  }
  if (result.segregatedHazmatMaterials.length > 0) {
    return '0';
  }
  return '';
}

describe('Table A18.2 Doc Parity', () => {
  beforeEach(() => {
    clearCache();
  });

  test('all Class 1 compatibility-group relationships match docs/TableA18.2.relationships.md', async () => {
    const groups: Array<typeof COMPATIBILITY_GROUPS[number]> = [
      'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'N', 'S',
    ];

    const materials = groups.reduce<Record<string, HazmatCompatibilityKey>>(
      (acc, group, index) => {
        acc[group] = createClass1Material(group, `UN9${100 + index}`);
        return acc;
      },
      {}
    );

    const incompatiblePairs = new Set([
      'A|B', 'A|C', 'A|D', 'A|E', 'A|F', 'A|G', 'A|H', 'A|J', 'A|K', 'A|L', 'A|N', 'A|S',
      'B|C', 'B|D', 'B|E', 'B|F', 'B|G', 'B|H', 'B|J', 'B|K', 'B|L', 'B|N',
      'C|F', 'C|G', 'C|H', 'C|J', 'C|K', 'C|L',
      'D|F', 'D|G', 'D|H', 'D|J', 'D|K', 'D|L',
      'E|F', 'E|G', 'E|H', 'E|J', 'E|K', 'E|L',
      'F|G', 'F|H', 'F|J', 'F|K', 'F|L', 'F|N',
      'G|H', 'G|J', 'G|K', 'G|L', 'G|N',
      'H|J', 'H|K', 'H|L', 'H|N',
      'J|K', 'J|L', 'J|N',
      'K|L', 'K|N',
      'L|N', 'L|S',
    ]);

    const key = (a: string, b: string) => (a < b ? `${a}|${b}` : `${b}|${a}`);

    for (let i = 0; i < groups.length; i++) {
      for (let j = i + 1; j < groups.length; j++) {
        const a = groups[i];
        const b = groups[j];
        const actual = await evaluatePair(materials[a], materials[b]);
        const expected = incompatiblePairs.has(key(a, b)) ? 'X' : '';
        expect(actual).toBe(expected);
      }
    }
  });
});
