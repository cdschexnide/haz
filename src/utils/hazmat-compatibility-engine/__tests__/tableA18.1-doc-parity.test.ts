import { runGraphEngineOptimized, clearCache } from '../optimizedEngine';
import { COMPATIBILITY_GROUPS, HazmatCompatibilityKey } from '../engineTypes';

type ResultCode = 'X' | '0' | '';

function createMaterial(
  hazardClass: string,
  unid: string,
  psn: string,
  compatibilityGroup: typeof COMPATIBILITY_GROUPS[number],
  packingGroup: string = ''
): HazmatCompatibilityKey {
  return {
    hazardClassDivisionNumber: hazardClass,
    unid,
    properShippingName: psn,
    compatibilityGroup,
    numericSpecialProvision: 'N/A',
    packingGroup,
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

function buildExpectedMap(): Map<string, ResultCode> {
  const rules = new Map<string, ResultCode>();
  const key = (a: string, b: string) => (a < b ? `${a}|${b}` : `${b}|${a}`);
  const priority = (value: ResultCode) => (value === 'X' ? 2 : value === '0' ? 1 : 0);
  const setRules = (source: string, targets: string[], status: ResultCode) => {
    targets.forEach(target => {
      const k = key(source, target);
      const existing = rules.get(k) || '';
      rules.set(k, priority(status) > priority(existing) ? status : existing);
    });
  };

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

  return rules;
}

describe('Table A18.1 Doc Parity', () => {
  beforeEach(() => {
    clearCache();
  });

  test('all documented category relationships resolve exactly as the docs define', async () => {
    const materials: Record<string, HazmatCompatibilityKey> = {
      '1.1': createMaterial('1.1', 'UN0004', 'CLASS 1.1 D', 'D'),
      '1.2': createMaterial('1.2', 'UN0009', 'CLASS 1.2 D', 'D'),
      '1.3': createMaterial('1.3', 'UN0014', 'CLASS 1.3 C', 'C'),
      '1.4': createMaterial('1.4', 'UN0297', 'CLASS 1.4 S', 'S'),
      '1.5': createMaterial('1.5', 'UN0331', 'CLASS 1.5 D', 'D'),
      '1.6': createMaterial('1.6', 'UN0486', 'CLASS 1.6 N', 'N'),
      '2.1': createMaterial('2.1', 'UN1011', 'CLASS 2.1', 'N/A'),
      '2.2': createMaterial('2.2', 'UN1066', 'CLASS 2.2', 'N/A'),
      '2.3ZA': createMaterial('2.3', 'UN1092', 'CLASS 2.3 ZONE A', 'N/A'),
      '2.3O': createMaterial('2.3', 'UN1098', 'CLASS 2.3 OTHER', 'N/A'),
      '3': createMaterial('3', 'UN1090', 'CLASS 3', 'N/A'),
      '4.1': createMaterial('4.1', 'UN1325', 'CLASS 4.1', 'N/A'),
      '4.2': createMaterial('4.2', 'UN1369', 'CLASS 4.2', 'N/A'),
      '4.3': createMaterial('4.3', 'UN1428', 'CLASS 4.3', 'N/A'),
      '5.1': createMaterial('5.1', 'UN1479', 'CLASS 5.1', 'N/A'),
      '5.2': createMaterial('5.2', 'UN3109', 'CLASS 5.2', 'N/A'),
      '6.1PGI': createMaterial('6.1', 'UN1541', 'CLASS 6.1 PG I', 'N/A', 'I'),
      '7': createMaterial('7', 'UN2912', 'CLASS 7', 'N/A'),
      '8L': createMaterial('8', 'UN1789', 'CLASS 8 LIQUID', 'N/A'),
      '9L': createMaterial('9', 'UN3480', 'CLASS 9 LITHIUM', 'N/A'),
    };

    const categories = Object.keys(materials);
    const expected = buildExpectedMap();
    const pairKey = (a: string, b: string) => (a < b ? `${a}|${b}` : `${b}|${a}`);

    for (let i = 0; i < categories.length; i++) {
      for (let j = i + 1; j < categories.length; j++) {
        const a = categories[i];
        const b = categories[j];
        const actual = await evaluatePair(materials[a], materials[b]);
        const expectedResult = expected.get(pairKey(a, b)) || '';
        if (actual !== expectedResult) {
          throw new Error(
            `Mismatch for ${a} vs ${b}: expected ${expectedResult || "blank"}, got ${actual || "blank"}`
          );
        }
      }
    }
  });

  test('qualifier scopes are enforced: non-qualifying class 6.1/8/9 do not inherit restricted rules', async () => {
    const class11 = createMaterial('1.1', 'UN0004', 'CLASS 1.1 D', 'D');
    const class61PgII = createMaterial('6.1', 'UN1541', 'CLASS 6.1 PG II', 'N/A', 'II');
    const class8NonLiquid = createMaterial('8', 'UN8000', 'CLASS 8 NON-LIQUID', 'N/A');
    const class9NonLithium = createMaterial('9', 'UN9000', 'CLASS 9 NON-LITHIUM', 'N/A');

    expect(await evaluatePair(class11, class61PgII)).toBe('');
    expect(await evaluatePair(class11, class8NonLiquid)).toBe('');
    expect(await evaluatePair(class11, class9NonLithium)).toBe('');
  });

  test('2.3 fallback policy defaults unknown zone to Zone A (restrictive)', async () => {
    const class23Unknown = createMaterial('2.3', 'UN9999', 'CLASS 2.3 UNKNOWN', 'N/A');
    const class21 = createMaterial('2.1', 'UN1011', 'CLASS 2.1', 'N/A');

    expect(await evaluatePair(class23Unknown, class21)).toBe('X');
  });
});
