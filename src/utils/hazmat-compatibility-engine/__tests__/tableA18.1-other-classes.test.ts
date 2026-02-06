import { runGraphEngineOptimized, clearCache } from '../optimizedEngine';
import { COMPATIBILITY_GROUPS, HazmatCompatibilityKey } from '../engineTypes';

function createMaterial(
  hazardClass: string,
  unid: string,
  psn: string,
  compatibilityGroup: typeof COMPATIBILITY_GROUPS[number]
): HazmatCompatibilityKey {
  return {
    hazardClassDivisionNumber: hazardClass,
    unid,
    properShippingName: psn,
    compatibilityGroup,
    numericSpecialProvision: '',
  };
}

async function evaluatePair(material1: HazmatCompatibilityKey, material2: HazmatCompatibilityKey) {
  const result = await runGraphEngineOptimized([material1, material2], [], false);
  return {
    incompatible: result.hazmatCompatibilityKeys.length > 0,
    requiresSegregation: result.segregatedHazmatMaterials.length > 0,
    segregationMessage: result.segregatedHazmatMaterials[0]?.segregationDescription || 'N/A',
    noteCondition: result.segregatedHazmatMaterials[0]?.noteCondition || null,
  };
}

describe('PHASE 7: Class 2.1 (Flammable Gases) Relationships (Table A18.1)', () => {
  beforeEach(() => {
    clearCache();
  });

  describe('7.1 - Incompatible Pairs (X) - Cannot be loaded together', () => {
    test('Class 2.1 + Class 1.1D = Incompatible', async () => {
      const class21 = createMaterial('2.1', 'UN1011', 'BUTANE', 'N/A');
      const class11 = createMaterial('1.1', 'UN0004', 'AMMONIUM PICRATE', 'D');

      const result = await evaluatePair(class21, class11);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 2.1 + Class 1.2D = Incompatible', async () => {
      const class21 = createMaterial('2.1', 'UN1011', 'BUTANE', 'N/A');
      const class12 = createMaterial('1.2', 'UN0009', 'AMMUNITION, INCENDIARY', 'D');

      const result = await evaluatePair(class21, class12);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 2.1 + Class 1.3C = Incompatible', async () => {
      const class21 = createMaterial('2.1', 'UN1011', 'BUTANE', 'N/A');
      const class13 = createMaterial('1.3', 'UN0014', 'CARTRIDGES FOR WEAPONS, BLANK', 'C');

      const result = await evaluatePair(class21, class13);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 2.1 + Class 1.5D = Incompatible', async () => {
      const class21 = createMaterial('2.1', 'UN1011', 'BUTANE', 'N/A');
      const class15 = createMaterial('1.5', 'UN0331', 'EXPLOSIVES, BLASTING, TYPE B', 'D');

      const result = await evaluatePair(class21, class15);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 2.1 + Class 2.3 Gas Zone A = Incompatible', async () => {
      const class21 = createMaterial('2.1', 'UN1011', 'BUTANE', 'N/A');
      const class23ZoneA = createMaterial('2.3', 'UN1092', 'ACROLEIN, STABILIZED', 'N/A');

      const result = await evaluatePair(class21, class23ZoneA);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
    });
  });

  describe('7.2 - Segregation Pairs (O) - Requires segregation', () => {
    test('Class 2.1 + Class 1.4S = Segregation Required', async () => {
      const class21 = createMaterial('2.1', 'UN1011', 'BUTANE', 'N/A');
      const class14 = createMaterial('1.4', 'UN0297', 'AMMUNITION, ILLUMINATING', 'S');

      const result = await evaluatePair(class21, class14);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(true);
    });

    test('Class 2.1 + Class 2.3 Gas Other than Zone A = Segregation Required', async () => {
      const class21 = createMaterial('2.1', 'UN1011', 'BUTANE', 'N/A');
      const class23Other = createMaterial('2.3', 'UN1098', 'ALLYL ALCOHOL', 'N/A');

      const result = await evaluatePair(class21, class23Other);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(true);
    });

    test('Class 2.1 + Class 3 = Segregation Required', async () => {
      const class21 = createMaterial('2.1', 'UN1011', 'BUTANE', 'N/A');
      const class3 = createMaterial('3', 'UN1090', 'ACETONE', 'N/A');

      const result = await evaluatePair(class21, class3);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(true);
    });

    test('Class 2.1 + Class 4.2 = Incompatible', async () => {
      const class21 = createMaterial('2.1', 'UN1011', 'BUTANE', 'N/A');
      const class42 = createMaterial('4.2', 'UN1369', 'p-NITROSODIMETHYLANILINE', 'N/A');

      const result = await evaluatePair(class21, class42);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 2.1 + Class 4.3 = Incompatible', async () => {
      const class21 = createMaterial('2.1', 'UN1011', 'BUTANE', 'N/A');
      const class43 = createMaterial('4.3', 'UN1428', 'SODIUM', 'N/A');

      const result = await evaluatePair(class21, class43);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 2.1 + Class 5.1 = Incompatible', async () => {
      const class21 = createMaterial('2.1', 'UN1011', 'BUTANE', 'N/A');
      const class51 = createMaterial('5.1', 'UN1479', 'OXIDIZING SOLID, N.O.S.', 'N/A');

      const result = await evaluatePair(class21, class51);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 2.1 + Class 5.2 = Incompatible', async () => {
      const class21 = createMaterial('2.1', 'UN1011', 'BUTANE', 'N/A');
      const class52 = createMaterial('5.2', 'UN3109', 'ORGANIC PEROXIDE TYPE F, LIQUID', 'N/A');

      const result = await evaluatePair(class21, class52);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 2.1 + Class 6.1 = Segregation Required', async () => {
      const class21 = createMaterial('2.1', 'UN1011', 'BUTANE', 'N/A');
      const class61 = createMaterial('6.1', 'UN1541', 'ACETONE CYANOHYDRIN, STABILIZED', 'N/A');

      const result = await evaluatePair(class21, class61);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(true);
    });

    test('Class 2.1 + Class 7 = Segregation Required', async () => {
      const class21 = createMaterial('2.1', 'UN1011', 'BUTANE', 'N/A');
      const class7 = createMaterial('7', 'UN2912', 'RADIOACTIVE MATERIAL, LOW SPECIFIC ACTIVITY', 'N/A');

      const result = await evaluatePair(class21, class7);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(true);
    });

    test('Class 2.1 + Class 8 = Segregation Required', async () => {
      const class21 = createMaterial('2.1', 'UN1011', 'BUTANE', 'N/A');
      const class8 = createMaterial('8', 'UN1715', 'ACETIC ANHYDRIDE', 'N/A');

      const result = await evaluatePair(class21, class8);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(true);
    });

    test('Class 2.1 + Class 9 = Segregation Required', async () => {
      const class21 = createMaterial('2.1', 'UN1011', 'BUTANE', 'N/A');
      const class9 = createMaterial('9', 'UN3480', 'LITHIUM ION BATTERIES', 'N/A');

      const result = await evaluatePair(class21, class9);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(true);
      expect(result.noteCondition).toBe('note11');
    });
  });

  describe('7.3 - Compatible Pairs (Blank) - No restrictions', () => {
    test('Class 2.1 + Class 1.6N = Compatible', async () => {
      const class21 = createMaterial('2.1', 'UN1011', 'BUTANE', 'N/A');
      const class16 = createMaterial('1.6', 'UN0486', 'ARTICLES, EXPLOSIVE, EXTREMELY INSENSITIVE', 'N');

      const result = await evaluatePair(class21, class16);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 2.1 + Class 2.1 = Compatible', async () => {
      const class21a = createMaterial('2.1', 'UN1011', 'BUTANE', 'N/A');
      const class21b = createMaterial('2.1', 'UN1075', 'PETROLEUM GASES, LIQUEFIED', 'N/A');

      const result = await evaluatePair(class21a, class21b);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 2.1 + Class 2.2 = Compatible', async () => {
      const class21 = createMaterial('2.1', 'UN1011', 'BUTANE', 'N/A');
      const class22 = createMaterial('2.2', 'UN1066', 'NITROGEN, COMPRESSED', 'N/A');

      const result = await evaluatePair(class21, class22);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 2.1 + Class 4.1 = Compatible', async () => {
      const class21 = createMaterial('2.1', 'UN1011', 'BUTANE', 'N/A');
      const class41 = createMaterial('4.1', 'UN1325', 'FLAMMABLE SOLID, ORGANIC, N.O.S.', 'N/A');

      const result = await evaluatePair(class21, class41);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
    });
  });
});
// tested and verified phase 7
