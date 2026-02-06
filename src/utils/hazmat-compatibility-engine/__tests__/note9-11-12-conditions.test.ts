import { runGraphEngineOptimized, clearCache } from '../optimizedEngine';
import { COMPATIBILITY_GROUPS, HazmatCompatibilityKey } from '../engineTypes';

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

describe('Notes 9, 11, and 12 behavior', () => {
  beforeEach(() => {
    clearCache();
  });

  test('Note 9: UN1950 converts otherwise incompatible pair to segregation', async () => {
    const aerosol = createMaterial('2.1', 'UN1950', 'AEROSOLS', 'N/A');
    const class11 = createMaterial('1.1', 'UN0004', 'AMMONIUM PICRATE', 'D');

    const result = await runGraphEngineOptimized([aerosol, class11], [], false);
    expect(result.hazmatCompatibilityKeys.length).toBe(0);
    expect(result.segregatedHazmatMaterials.length).toBe(1);
    expect(result.segregatedHazmatMaterials[0].noteCondition).toBe('note9');
  });

  test('Note 9: UN1950 does not add segregation when pair is already compatible', async () => {
    const aerosol = createMaterial('2.1', 'UN1950', 'AEROSOLS', 'N/A');
    const class22 = createMaterial('2.2', 'UN1066', 'NITROGEN, COMPRESSED', 'N/A');

    const result = await runGraphEngineOptimized([aerosol, class22], [], false);
    expect(result.hazmatCompatibilityKeys.length).toBe(0);
    expect(result.segregatedHazmatMaterials.length).toBe(0);
    expect(result.noteConditionPairs.some((pair) => pair.noteCondition === 'note9')).toBe(false);
  });

  test('Note 11: UN3480 with Class 3 requires segregation', async () => {
    const lithium = createMaterial('9', 'UN3480', 'LITHIUM ION BATTERIES', 'N/A');
    const class3 = createMaterial('3', 'UN1090', 'ACETONE', 'N/A');

    const result = await runGraphEngineOptimized([lithium, class3], [], false);
    expect(result.hazmatCompatibilityKeys.length).toBe(0);
    expect(result.segregatedHazmatMaterials.length).toBe(1);
    expect(result.segregatedHazmatMaterials[0].noteCondition).toBe('note11');
  });

  test('Note 11: UN3480 with Class 1.4S remains segregation from base table without note11 tag', async () => {
    const lithium = createMaterial('9', 'UN3480', 'LITHIUM ION BATTERIES', 'N/A');
    const class14s = createMaterial('1.4', 'UN0297', 'AMMUNITION, ILLUMINATING', 'S');

    const result = await runGraphEngineOptimized([lithium, class14s], [], false);
    expect(result.hazmatCompatibilityKeys.length).toBe(0);
    expect(result.segregatedHazmatMaterials.length).toBe(1);
    expect(result.noteConditionPairs.some((pair) => pair.noteCondition === 'note11')).toBe(false);
  });

  test('Note 12: UN3528 removes segregation requirement but not incompatibility', async () => {
    const un3528 = createMaterial('3', 'UN3528', 'ENGINE, INTERNAL COMBUSTION', 'N/A');
    const lithium = createMaterial('9', 'UN3480', 'LITHIUM ION BATTERIES', 'N/A');
    const class11 = createMaterial('1.1', 'UN0004', 'AMMONIUM PICRATE', 'D');

    const segregationOverride = await runGraphEngineOptimized([un3528, lithium], [], false);
    expect(segregationOverride.hazmatCompatibilityKeys.length).toBe(0);
    expect(segregationOverride.segregatedHazmatMaterials.length).toBe(0);
    expect(segregationOverride.noteConditionPairs.some((pair) => pair.noteCondition === 'note12')).toBe(true);

    const incompatibleStillFails = await runGraphEngineOptimized([un3528, class11], [], false);
    expect(incompatibleStillFails.hazmatCompatibilityKeys.length).toBe(1);
    expect(incompatibleStillFails.segregatedHazmatMaterials.length).toBe(0);
    expect(incompatibleStillFails.noteConditionPairs.some((pair) => pair.noteCondition === 'note12')).toBe(false);
  });
});
