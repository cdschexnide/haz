import { runGraphEngineOptimized, clearCache } from '../optimizedEngine';
import { COMPATIBILITY_GROUPS, HazmatCompatibilityKey } from '../engineTypes';

function createClass1Material(
  hazardClass: string,
  compatibilityGroup: typeof COMPATIBILITY_GROUPS[number],
  unid: string,
  properShippingName: string = `CLASS ${hazardClass} GROUP ${compatibilityGroup}`
): HazmatCompatibilityKey {
  return {
    hazardClassDivisionNumber: hazardClass,
    compatibilityGroup,
    unid,
    properShippingName,
    numericSpecialProvision: 'N/A',
    packingGroup: '',
  };
}

async function evaluatePair(
  material1: HazmatCompatibilityKey,
  material2: HazmatCompatibilityKey
): Promise<{ incompatible: boolean; requiresSegregation: boolean }> {
  const result = await runGraphEngineOptimized([material1, material2], [], false);
  return {
    incompatible: result.hazmatCompatibilityKeys.length > 0,
    requiresSegregation: result.segregatedHazmatMaterials.length > 0,
  };
}

describe('Table A18.2 Notes 1-8', () => {
  beforeEach(() => {
    clearCache();
  });

  test('Note 1: Group B UN0257 may ship with Group C', async () => {
    const b = createClass1Material('1.1', 'B', 'UN0257');
    const c = createClass1Material('1.3', 'C', 'UN0200');
    const output = await runGraphEngineOptimized([b, c], [], false);
    expect(output.hazmatCompatibilityKeys.length).toBe(0);
    expect(output.segregatedHazmatMaterials.length).toBe(0);
    expect(
      output.noteConditionPairs.some(
        note =>
          note.noteCondition === 'a18_2_note1' &&
          note.status === 'compatible' &&
          note.hazmatObjectPair.some(material => material.unid === 'UN0257')
      )
    ).toBe(true);
  });

  test('Note 1 negative: Group B UN0258 with Group C remains incompatible', async () => {
    const b = createClass1Material('1.1', 'B', 'UN0258');
    const c = createClass1Material('1.3', 'C', 'UN0200');
    const result = await evaluatePair(b, c);
    expect(result.incompatible).toBe(true);
    expect(result.requiresSegregation).toBe(false);
  });

  test('Note 2: Group B in EOD MK 663 MOD 0 container may ship with Group H', async () => {
    const bMk663 = createClass1Material(
      '1.1',
      'B',
      'UN0258',
      'EXPLOSIVE, B TYPE, PACKAGED IN EOD MK 663, MOD 0 CONTAINER'
    );
    const h = createClass1Material('1.2', 'H', 'UN0400');
    const result = await evaluatePair(bMk663, h);
    expect(result.incompatible).toBe(false);
    expect(result.requiresSegregation).toBe(false);
  });

  test('Note 3: Group F UN0292 may ship with Group D', async () => {
    const f = createClass1Material('1.2', 'F', 'UN0292');
    const d = createClass1Material('1.1', 'D', 'UN0106');
    const result = await evaluatePair(f, d);
    expect(result.incompatible).toBe(false);
    expect(result.requiresSegregation).toBe(false);
  });

  test('Note 4: Group G UN0019 may ship with Group H', async () => {
    const g = createClass1Material('1.3', 'G', 'UN0019');
    const h = createClass1Material('1.2', 'H', 'UN0400');
    const result = await evaluatePair(g, h);
    expect(result.incompatible).toBe(false);
    expect(result.requiresSegregation).toBe(false);
  });

  test('Note 5: Group G UN0314 may ship with Group E', async () => {
    const g = createClass1Material('1.3', 'G', 'UN0314');
    const e = createClass1Material('1.2', 'E', 'UN0241');
    const result = await evaluatePair(g, e);
    expect(result.incompatible).toBe(false);
    expect(result.requiresSegregation).toBe(false);
  });

  test('Note 6: Group L only with identical item', async () => {
    const l1 = createClass1Material('1.1', 'L', 'UN0500', 'ITEM L A');
    const l2 = createClass1Material('1.1', 'L', 'UN0500', 'ITEM L B');
    const l3 = createClass1Material('1.1', 'L', 'UN0501', 'ITEM L C');

    const sameUnid = await evaluatePair(l1, l2);
    expect(sameUnid.incompatible).toBe(false);

    const differentUnid = await evaluatePair(l1, l3);
    expect(differentUnid.incompatible).toBe(true);
  });

  test('Note 7: Class 1.1/1.2 may not ship with UN0333-UN0337', async () => {
    const class11 = createClass1Material('1.1', 'D', 'UN0106');
    const restricted = createClass1Material('1.3', 'D', 'UN0333');
    const result = await evaluatePair(class11, restricted);
    expect(result.incompatible).toBe(true);
    expect(result.requiresSegregation).toBe(false);
  });

  test('Note 8: Class 1.4 B/G may ship together and with 1.4 C/D/E', async () => {
    const b14 = createClass1Material('1.4', 'B', 'UN0012');
    const g14 = createClass1Material('1.4', 'G', 'UN0310');
    const c14 = createClass1Material('1.4', 'C', 'UN0323');

    const bg = await evaluatePair(b14, g14);
    expect(bg.incompatible).toBe(false);

    const bc = await evaluatePair(b14, c14);
    expect(bc.incompatible).toBe(false);
  });

  test('Note 8 scope: same groups outside Class 1.4 remain incompatible', async () => {
    const b11 = createClass1Material('1.1', 'B', 'UN0012');
    const g11 = createClass1Material('1.1', 'G', 'UN0310');
    const result = await evaluatePair(b11, g11);
    expect(result.incompatible).toBe(true);
  });
});
