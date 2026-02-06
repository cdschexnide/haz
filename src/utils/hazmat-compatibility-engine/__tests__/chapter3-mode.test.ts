import { clearCache, runGraphEngineOptimized } from '../optimizedEngine';
import { COMPATIBILITY_GROUPS, HazmatCompatibilityKey } from '../engineTypes';

function createMaterial(
  hazardClass: string,
  unid: string,
  properShippingName: string,
  compatibilityGroup: typeof COMPATIBILITY_GROUPS[number] = 'N/A',
  packingGroup: string = ''
): HazmatCompatibilityKey {
  return {
    hazardClassDivisionNumber: hazardClass,
    unid,
    properShippingName,
    compatibilityGroup,
    numericSpecialProvision: 'N/A',
    packingGroup,
  };
}

async function evaluatePair(
  material1: HazmatCompatibilityKey,
  material2: HazmatCompatibilityKey,
  chapter3Enabled: boolean
) {
  const result = await runGraphEngineOptimized(
    [material1, material2],
    [],
    false,
    { chapter3Enabled }
  );

  return {
    incompatible: result.hazmatCompatibilityKeys.length > 0,
    requiresSegregation: result.segregatedHazmatMaterials.length > 0,
    noteConditions: result.noteConditionPairs.map(note => note.noteCondition),
  };
}

describe('Chapter 3 mode', () => {
  beforeEach(() => {
    clearCache();
  });

  test('overrides baseline incompatibility to Chapter 3 segregation', async () => {
    const class11 = createMaterial('1.1', 'UN0004', 'AMMONIUM PICRATE', 'D');
    const class3 = createMaterial('3', 'UN1090', 'ACETONE');

    const baseline = await evaluatePair(class11, class3, false);
    expect(baseline.incompatible).toBe(true);
    expect(baseline.requiresSegregation).toBe(false);

    const chapter3 = await evaluatePair(class11, class3, true);
    expect(chapter3.incompatible).toBe(false);
    expect(chapter3.requiresSegregation).toBe(true);
    expect(chapter3.noteConditions).toContain('chapter3_general');
  });

  test('A18.4.1: groups A/J/K/L are restricted to group S or Class 9', async () => {
    const groupA = createMaterial('1.1', 'UN0005', 'EXPLOSIVE A', 'A');
    const groupD = createMaterial('1.1', 'UN0106', 'EXPLOSIVE D', 'D');
    const result = await evaluatePair(groupA, groupD, true);

    expect(result.incompatible).toBe(true);
    expect(result.requiresSegregation).toBe(false);
    expect(result.noteConditions).toContain('chapter3_note1');
  });

  test('A18.4.2: Class 7 cannot be shipped with any other hazardous material', async () => {
    const class7 = createMaterial(
      '7',
      'UN2912',
      'RADIOACTIVE MATERIAL, LOW SPECIFIC ACTIVITY'
    );
    const class9 = createMaterial('9', 'UN3480', 'LITHIUM ION BATTERIES');
    const result = await evaluatePair(class7, class9, true);

    expect(result.incompatible).toBe(true);
    expect(result.noteConditions).toContain('chapter3_note2');
  });

  test('A18.4.3: Class 1.1/1.2/1.3 cannot ship with inhalation hazard zone A', async () => {
    const class12 = createMaterial('1.2', 'UN0009', 'AMMUNITION, INCENDIARY', 'D');
    const zoneA = createMaterial('2.3', 'UN1092', 'ACROLEIN, STABILIZED');
    const result = await evaluatePair(class12, zoneA, true);

    expect(result.incompatible).toBe(true);
    expect(result.noteConditions).toContain('chapter3_note3');
  });

  test('A18.4.4: Class 1.1/1.2/1.3 cannot ship with Class 6.1 PG I', async () => {
    const class13 = createMaterial('1.3', 'UN0014', 'CARTRIDGES FOR WEAPONS, BLANK', 'C');
    const class61PgI = createMaterial(
      '6.1',
      'UN1541',
      'ACETONE CYANOHYDRIN, STABILIZED',
      'N/A',
      'I'
    );
    const result = await evaluatePair(class13, class61PgI, true);

    expect(result.incompatible).toBe(true);
    expect(result.noteConditions).toContain('chapter3_note4');
  });

  test('A18.4.5: cyanides cannot ship with Class 8 corrosives', async () => {
    const cyanide = createMaterial('6.1', 'UN1689', 'SODIUM CYANIDE', 'N/A', 'I');
    const class8 = createMaterial('8', 'UN1789', 'HYDROCHLORIC ACID');
    const result = await evaluatePair(cyanide, class8, true);

    expect(result.incompatible).toBe(true);
    expect(result.noteConditions).toContain('chapter3_note5');
  });

  test('cache keeps Chapter 3 and baseline results isolated', async () => {
    const groupA = createMaterial('1.1', 'UN0005', 'EXPLOSIVE A', 'A');
    const groupS = createMaterial('1.4', 'UN0297', 'AMMUNITION, ILLUMINATING', 'S');

    const baseline = await evaluatePair(groupA, groupS, false);
    expect(baseline.incompatible).toBe(true);

    const chapter3 = await evaluatePair(groupA, groupS, true);
    expect(chapter3.incompatible).toBe(false);
    expect(chapter3.requiresSegregation).toBe(true);
    expect(chapter3.noteConditions).toContain('chapter3_general');
  });
});
