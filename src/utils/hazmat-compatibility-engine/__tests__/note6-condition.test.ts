import { runGraphEngineOptimized, clearCache } from '../optimizedEngine';
import { COMPATIBILITY_GROUPS, HazmatCompatibilityKey } from '../engineTypes';

//  Note 6: Charged electric storage batteries (UN2794, UN2795, UN2800, UN3028)
//  CANNOT be loaded with Class 1.1 or 1.2 explosives (incompatibility rule).
//  Table A18.1, Class 8 + Class 1.1 = 'X' (incompatible)
//  and Class 8 + Class 1.2 = 'X' (incompatible). Note 6 reinforces this specific
//  incompatibility for charged electric storage batteries with additional emphasis.

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
    compatibilityGroup: compatibilityGroup,
    numericSpecialProvision: 'N/A',
  };
}

// Helper function to evaluate a pair and return the result
async function evaluatePair(material1: HazmatCompatibilityKey, material2: HazmatCompatibilityKey) {
  const result = await runGraphEngineOptimized([material1, material2], [], false);
  return {
    incompatible: result.hazmatCompatibilityKeys.length > 0,
    requiresSegregation: result.segregatedHazmatMaterials.length > 0,
    segregationMessage: result.segregatedHazmatMaterials[0]?.segregationDescription || 'N/A',
    noteCondition: result.segregatedHazmatMaterials[0]?.noteCondition || null,
    noteConditionPairs: result.noteConditionPairs,
  };
}

describe('Note 6 Condition: Charged electric storage batteries with Class 1.1 and 1.2', () => {
  beforeEach(() => {
    clearCache();
  });

  describe('POSITIVE TESTS: Note 6 applies and creates incompatibility', () => {
    test('UN2794 (Battery) + Class 1.1 = Incompatible (Note 6)', async () => {
      const un2794 = createMaterial(
        '8',
        'UN2794',
        'BATTERIES, WET, FILLED WITH ACID',
        'N/A'
      );
      const class11 = createMaterial(
        '1.1',
        'UN0004',
        'AMMONIUM PICRATE',
        'D'
      );

      const result = await evaluatePair(un2794, class11);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
      expect(result.noteConditionPairs.length).toBe(1);
      expect(result.noteConditionPairs[0].noteCondition).toBe('note6');
      expect(result.noteConditionPairs[0].status).toBe('incompatible');
    });

    test('UN2794 (Battery) + Class 1.2 = Incompatible (Note 6)', async () => {
      const un2794 = createMaterial(
        '8',
        'UN2794',
        'BATTERIES, WET, FILLED WITH ACID',
        'N/A'
      );
      const class12 = createMaterial(
        '1.2',
        'UN0009',
        'AMMUNITION, INCENDIARY',
        'D'
      );

      const result = await evaluatePair(un2794, class12);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
      expect(result.noteConditionPairs.length).toBe(1);
      expect(result.noteConditionPairs[0].noteCondition).toBe('note6');
      expect(result.noteConditionPairs[0].status).toBe('incompatible');
    });

    test('UN2795 (Battery) + Class 1.1 = Incompatible (Note 6)', async () => {
      const un2795 = createMaterial(
        '8',
        'UN2795',
        'BATTERIES, WET, FILLED WITH ALKALI',
        'N/A'
      );
      const class11 = createMaterial(
        '1.1',
        'UN0027',
        'BLACK POWDER, GUNPOWDER',
        'D'
      );

      const result = await evaluatePair(un2795, class11);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
      expect(result.noteConditionPairs[0].noteCondition).toBe('note6');
    });

    test('UN2795 (Battery) + Class 1.2 = Incompatible (Note 6)', async () => {
      const un2795 = createMaterial(
        '8',
        'UN2795',
        'BATTERIES, WET, FILLED WITH ALKALI',
        'N/A'
      );
      const class12 = createMaterial(
        '1.2',
        'UN0010',
        'AMMUNITION, INCENDIARY',
        'G'
      );

      const result = await evaluatePair(un2795, class12);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
      expect(result.noteConditionPairs[0].noteCondition).toBe('note6');
    });

    test('UN2800 (Battery) + Class 1.1 = Incompatible (Note 6)', async () => {
      const un2800 = createMaterial(
        '8',
        'UN2800',
        'BATTERIES, WET, NON-SPILLABLE',
        'N/A'
      );
      const class11 = createMaterial(
        '1.1',
        'UN0033',
        'BOMBS',
        'D'
      );

      const result = await evaluatePair(un2800, class11);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
      expect(result.noteConditionPairs[0].noteCondition).toBe('note6');
    });

    test('UN2800 (Battery) + Class 1.2 = Incompatible (Note 6)', async () => {
      const un2800 = createMaterial(
        '8',
        'UN2800',
        'BATTERIES, WET, NON-SPILLABLE',
        'N/A'
      );
      const class12 = createMaterial(
        '1.2',
        'UN0114',
        'GUANYL NITROSAMINOGUANYL TETRAZENE',
        'C'
      );

      const result = await evaluatePair(un2800, class12);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
      expect(result.noteConditionPairs[0].noteCondition).toBe('note6');
    });

    test('UN3028 (Battery) + Class 1.1 = Incompatible (Note 6)', async () => {
      const un3028 = createMaterial(
        '8',
        'UN3028',
        'BATTERIES, DRY, CONTAINING POTASSIUM HYDROXIDE SOLID',
        'N/A'
      );
      const class11 = createMaterial(
        '1.1',
        'UN0072',
        'CYCLOTRIMETHYLENETRINITRAMINE',
        'D'
      );

      const result = await evaluatePair(un3028, class11);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
      expect(result.noteConditionPairs[0].noteCondition).toBe('note6');
    });

    test('UN3028 (Battery) + Class 1.2 = Incompatible (Note 6)', async () => {
      const un3028 = createMaterial(
        '8',
        'UN3028',
        'BATTERIES, DRY, CONTAINING POTASSIUM HYDROXIDE SOLID',
        'N/A'
      );
      const class12 = createMaterial(
        '1.2',
        'UN0241',
        'EXPLOSIVE, BLASTING, TYPE E',
        'D'
      );

      const result = await evaluatePair(un3028, class12);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
      expect(result.noteConditionPairs[0].noteCondition).toBe('note6');
    });

    test('Bidirectional: Class 1.1 + UN2794 (Battery) = Incompatible', async () => {
      const class11 = createMaterial(
        '1.1',
        'UN0004',
        'AMMONIUM PICRATE',
        'D'
      );
      const un2794 = createMaterial(
        '8',
        'UN2794',
        'BATTERIES, WET, FILLED WITH ACID',
        'N/A'
      );

      const result = await evaluatePair(class11, un2794);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
      expect(result.noteConditionPairs[0].noteCondition).toBe('note6');
    });

    test('Bidirectional: Class 1.2 + UN2795 (Battery) = Incompatible', async () => {
      const class12 = createMaterial(
        '1.2',
        'UN0009',
        'AMMUNITION, INCENDIARY',
        'D'
      );
      const un2795 = createMaterial(
        '8',
        'UN2795',
        'BATTERIES, WET, FILLED WITH ALKALI',
        'N/A'
      );

      const result = await evaluatePair(class12, un2795);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
      expect(result.noteConditionPairs[0].noteCondition).toBe('note6');
    });

    test('All four battery UNs should trigger Note 6 with Class 1.1', async () => {
      const batteryUNs = ['UN2794', 'UN2795', 'UN2800', 'UN3028'];
      const class11 = createMaterial(
        '1.1',
        'UN0004',
        'AMMONIUM PICRATE',
        'D'
      );

      for (const unid of batteryUNs) {
        const battery = createMaterial(
          '8',
          unid,
          'BATTERY',
          'N/A'
        );

        const result = await evaluatePair(battery, class11);

        expect(result.incompatible).toBe(true);
        expect(result.requiresSegregation).toBe(false);
        expect(result.noteConditionPairs[0].noteCondition).toBe('note6');
      }
    });

    test('All four battery UNs should trigger Note 6 with Class 1.2', async () => {
      const batteryUNs = ['UN2794', 'UN2795', 'UN2800', 'UN3028'];
      const class12 = createMaterial(
        '1.2',
        'UN0009',
        'AMMUNITION, INCENDIARY',
        'D'
      );

      for (const unid of batteryUNs) {
        const battery = createMaterial(
          '8',
          unid,
          'BATTERY',
          'N/A'
        );

        const result = await evaluatePair(battery, class12);

        expect(result.incompatible).toBe(true);
        expect(result.requiresSegregation).toBe(false);
        expect(result.noteConditionPairs[0].noteCondition).toBe('note6');
      }
    });

    test('Battery with different Class 1.1 compatibility groups = All incompatible', async () => {
      const un2794 = createMaterial(
        '8',
        'UN2794',
        'BATTERIES, WET, FILLED WITH ACID',
        'N/A'
      );

      const class11Materials = [
        createMaterial('1.1', 'UN0473', 'SUBSTANCES, EXPLOSIVE, N.O.S.', 'A'),
        createMaterial('1.1', 'UN0461', 'COMPONENTS, EXPLOSIVE TRAIN, N.O.S.', 'B'),
        createMaterial('1.1', 'UN0114', 'GUANYL NITROSAMINOGUANYL TETRAZENE', 'C'),
        createMaterial('1.1', 'UN0004', 'AMMONIUM PICRATE', 'D'),
      ];

      for (const class11 of class11Materials) {
        const result = await evaluatePair(un2794, class11);

        expect(result.incompatible).toBe(true);
        expect(result.noteConditionPairs[0].noteCondition).toBe('note6');
      }
    });

    test('Battery with different Class 1.2 compatibility groups = All incompatible', async () => {
      const un2800 = createMaterial(
        '8',
        'UN2800',
        'BATTERIES, WET, NON-SPILLABLE',
        'N/A'
      );

      const class12Materials = [
        createMaterial('1.2', 'UN0009', 'AMMUNITION, INCENDIARY', 'D'),
        createMaterial('1.2', 'UN0010', 'AMMUNITION, INCENDIARY', 'G'),
        createMaterial('1.2', 'UN0350', 'ARTICLES, EXPLOSIVE, N.O.S.', 'B'),
      ];

      for (const class12 of class12Materials) {
        const result = await evaluatePair(un2800, class12);

        expect(result.incompatible).toBe(true);
        expect(result.noteConditionPairs[0].noteCondition).toBe('note6');
      }
    });
  });

  describe('NEGATIVE TESTS: Note 6 does NOT apply - normal rules prevail', () => {
    test('Battery (UN2794) + Class 1.3 = Incompatible (normal rule, not Note 6)', async () => {
      const un2794 = createMaterial(
        '8',
        'UN2794',
        'BATTERIES, WET, FILLED WITH ACID',
        'N/A'
      );
      const class13 = createMaterial(
        '1.3',
        'UN0242',
        'CHARGES, PROPELLING',
        'C'
      );

      const result = await evaluatePair(un2794, class13);

      // Table A18.1: Class 8 + Class 1.3 = 'X' (incompatible)
      // Note 6 doesn't apply (only for 1.1 and 1.2)
      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
      // Note 6 should NOT be in noteConditionPairs since it's not 1.1 or 1.2
      const hasNote6 = result.noteConditionPairs.some(pair => pair.noteCondition === 'note6');
      expect(hasNote6).toBe(false);
    });

    test('Battery (UN2795) + Class 1.4 = Compatible (normal rule)', async () => {
      const un2795 = createMaterial(
        '8',
        'UN2795',
        'BATTERIES, WET, FILLED WITH ALKALI',
        'N/A'
      );
      const class14 = createMaterial(
        '1.4',
        'UN0297',
        'AMMUNITION, ILLUMINATING',
        'S'
      );

      const result = await evaluatePair(un2795, class14);

      // Table A18.1: Class 8 + Class 1.4 = '' (compatible)
      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(true);
      const hasNote6 = result.noteConditionPairs.some(pair => pair.noteCondition === 'note6');
      expect(hasNote6).toBe(false);
    });

    test('Battery (UN2800) + Class 1.5 = Incompatible (normal rule)', async () => {
      const un2800 = createMaterial(
        '8',
        'UN2800',
        'BATTERIES, WET, NON-SPILLABLE',
        'N/A'
      );
      const class15 = createMaterial(
        '1.5',
        'UN0331',
        'EXPLOSIVES, BLASTING, TYPE B',
        'D'
      );

      const result = await evaluatePair(un2800, class15);

      // Table A18.1: Class 8 + Class 1.5 = 'X' (incompatible)
      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
      const hasNote6 = result.noteConditionPairs.some(pair => pair.noteCondition === 'note6');
      expect(hasNote6).toBe(false);
    });

    test('Battery (UN3028) + Class 1.6 = Compatible (normal rule)', async () => {
      const un3028 = createMaterial(
        '8',
        'UN3028',
        'BATTERIES, DRY, CONTAINING POTASSIUM HYDROXIDE SOLID',
        'N/A'
      );
      const class16 = createMaterial(
        '1.6',
        'UN0486',
        'ARTICLES, EXPLOSIVE, EXTREMELY INSENSITIVE',
        'N'
      );

      const result = await evaluatePair(un3028, class16);

      // Table A18.1: Class 8 + Class 1.6 = '' (compatible)
      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
      const hasNote6 = result.noteConditionPairs.some(pair => pair.noteCondition === 'note6');
      expect(hasNote6).toBe(false);
    });

    test('Battery (UN2794) + Class 2.1 = Segregation required (normal rule)', async () => {
      const un2794 = createMaterial(
        '8',
        'UN2794',
        'BATTERIES, WET, FILLED WITH ACID',
        'N/A'
      );
      const class21 = createMaterial(
        '2.1',
        'UN1011',
        'BUTANE',
        'N/A'
      );

      const result = await evaluatePair(un2794, class21);

      // Table A18.1: Class 8 + Class 2.1 = '0' (segregation required)
      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(true);
      expect(result.segregationMessage).toBe('88 Inches of Separation');
      const hasNote6 = result.noteConditionPairs.some(pair => pair.noteCondition === 'note6');
      expect(hasNote6).toBe(false);
    });

    test('Battery (UN2795) + Class 3 = Incompatible (normal rule)', async () => {
      const un2795 = createMaterial(
        '8',
        'UN2795',
        'BATTERIES, WET, FILLED WITH ALKALI',
        'N/A'
      );
      const class3 = createMaterial(
        '3',
        'UN1090',
        'ACETONE',
        'N/A'
      );

      const result = await evaluatePair(un2795, class3);

      // Table A18.1: Class 8 + Class 3 = 'X' (incompatible)
      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
      const hasNote6 = result.noteConditionPairs.some(pair => pair.noteCondition === 'note6');
      expect(hasNote6).toBe(false);
    });

    // test('Battery (UN2800) + Class 5.1 = Segregation required (Note 8, not Note 6)', async () => {
    //   const un2800 = createMaterial(
    //     '8',
    //     'UN2800',
    //     'BATTERIES, WET, NON-SPILLABLE',
    //     'N/A'
    //   );
    //   const class51 = createMaterial(
    //     '5.1',
    //     'UN1479',
    //     'OXIDIZING SOLID, N.O.S.',
    //     'N/A'
    //   );

    //   const result = await evaluatePair(un2800, class51);

    //   // Note 8: Class 8 corrosive liquids require segregation from Class 5 materials
    //   // UN2800 is in the Note 8 list
    //   expect(result.incompatible).toBe(false);
    //   expect(result.requiresSegregation).toBe(true);
    //   expect(result.noteConditionPairs[0].noteCondition).toBe('note8');
    // });

    test('Battery (UN3028) + Class 7 = Compatible (normal rule)', async () => {
      const un3028 = createMaterial(
        '8',
        'UN3028',
        'BATTERIES, DRY, CONTAINING POTASSIUM HYDROXIDE SOLID',
        'N/A'
      );
      const class7 = createMaterial(
        '7',
        'UN2912',
        'RADIOACTIVE MATERIAL, LOW SPECIFIC ACTIVITY',
        'N/A'
      );

      const result = await evaluatePair(un3028, class7);

      // Table A18.1: Class 8 + Class 7 = '' (compatible)
      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
      const hasNote6 = result.noteConditionPairs.some(pair => pair.noteCondition === 'note6');
      expect(hasNote6).toBe(false);
    });

    test('Battery (UN2794) + other Class 8 = Compatible (normal rule)', async () => {
      const un2794 = createMaterial(
        '8',
        'UN2794',
        'BATTERIES, WET, FILLED WITH ACID',
        'N/A'
      );
      const otherClass8 = createMaterial(
        '8',
        'UN1789',
        'HYDROCHLORIC ACID',
        'N/A'
      );

      const result = await evaluatePair(un2794, otherClass8);

      // Table A18.1: Class 8 + Class 8 = '' (compatible)
      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
      const hasNote6 = result.noteConditionPairs.some(pair => pair.noteCondition === 'note6');
      expect(hasNote6).toBe(false);
    });

    test('Other Class 8 material (NOT battery) + Class 1.1 = Incompatible (no Note 6)', async () => {
      const otherClass8 = createMaterial(
        '8',
        'UN1789',
        'HYDROCHLORIC ACID',
        'N/A'
      );
      const class11 = createMaterial(
        '1.1',
        'UN0004',
        'AMMONIUM PICRATE',
        'D'
      );

      const result = await evaluatePair(otherClass8, class11);

      // Without Note 6, Class 8 + Class 1.1 = 'X' (incompatible)
      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
      // Should not have Note 6 in noteConditionPairs
      const hasNote6 = result.noteConditionPairs.some(pair => pair.noteCondition === 'note6');
      expect(hasNote6).toBe(false);
    });

    test('Other Class 8 material (NOT battery) + Class 1.2 = Incompatible (no Note 6)', async () => {
      const otherClass8 = createMaterial(
        '8',
        'UN1824',
        'SODIUM HYDROXIDE SOLUTION',
        'N/A'
      );
      const class12 = createMaterial(
        '1.2',
        'UN0009',
        'AMMUNITION, INCENDIARY',
        'D'
      );

      const result = await evaluatePair(otherClass8, class12);

      // Without Note 6, Class 8 + Class 1.2 = 'X' (incompatible)
      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
      const hasNote6 = result.noteConditionPairs.some(pair => pair.noteCondition === 'note6');
      expect(hasNote6).toBe(false);
    });
  });

  describe('EDGE CASES: Verify specificity and boundary conditions', () => {
    test('UN2794 with itself = Compatible (identical materials)', async () => {
      const un2794a = createMaterial(
        '8',
        'UN2794',
        'BATTERIES, WET, FILLED WITH ACID',
        'N/A'
      );
      const un2794b = createMaterial(
        '8',
        'UN2794',
        'BATTERIES, WET, FILLED WITH ACID',
        'N/A'
      );

      const result = await evaluatePair(un2794a, un2794b);

      // Identical materials are always compatible
      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Two different battery UNs together = Compatible (both Class 8)', async () => {
      const un2794 = createMaterial(
        '8',
        'UN2794',
        'BATTERIES, WET, FILLED WITH ACID',
        'N/A'
      );
      const un2795 = createMaterial(
        '8',
        'UN2795',
        'BATTERIES, WET, FILLED WITH ALKALI',
        'N/A'
      );

      const result = await evaluatePair(un2794, un2795);

      // Both are Class 8, so compatible
      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Similar UN number UN2793 (NOT in battery list) + Class 1.1 = Incompatible (no Note 6)', async () => {
      const un2793 = createMaterial(
        '8',
        'UN2793',
        'SOME OTHER MATERIAL',
        'N/A'
      );
      const class11 = createMaterial(
        '1.1',
        'UN0004',
        'AMMONIUM PICRATE',
        'D'
      );

      const result = await evaluatePair(un2793, class11);

      // UN2793 is adjacent to UN2794 but not in the battery list
      // Class 8 + Class 1.1 = 'X' (incompatible), but no Note 6
      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
      const hasNote6 = result.noteConditionPairs.some(pair => pair.noteCondition === 'note6');
      expect(hasNote6).toBe(false);
    });

    test('Similar UN number UN2796 (NOT in battery list) + Class 1.1 = Incompatible (no Note 6)', async () => {
      const un2796 = createMaterial(
        '8',
        'UN2796',
        'SULFURIC ACID',
        'N/A'
      );
      const class11 = createMaterial(
        '1.1',
        'UN0004',
        'AMMONIUM PICRATE',
        'D'
      );

      const result = await evaluatePair(un2796, class11);

      // UN2796 is adjacent to UN2795 but not in the battery list
      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
      const hasNote6 = result.noteConditionPairs.some(pair => pair.noteCondition === 'note6');
      expect(hasNote6).toBe(false);
    });

    test('Similar UN number UN2799 (NOT in battery list) + Class 1.2 = Incompatible (no Note 6)', async () => {
      const un2799 = createMaterial(
        '8',
        'UN2799',
        'SOME OTHER MATERIAL',
        'N/A'
      );
      const class12 = createMaterial(
        '1.2',
        'UN0009',
        'AMMUNITION, INCENDIARY',
        'D'
      );

      const result = await evaluatePair(un2799, class12);

      // UN2799 is adjacent to UN2800 but not in the battery list
      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
      const hasNote6 = result.noteConditionPairs.some(pair => pair.noteCondition === 'note6');
      expect(hasNote6).toBe(false);
    });

    test('Similar UN number UN3029 (NOT in battery list) + Class 1.1 = Incompatible (no Note 6)', async () => {
      const un3029 = createMaterial(
        '8',
        'UN3029',
        'SOME OTHER MATERIAL',
        'N/A'
      );
      const class11 = createMaterial(
        '1.1',
        'UN0004',
        'AMMONIUM PICRATE',
        'D'
      );

      const result = await evaluatePair(un3029, class11);

      // UN3029 is adjacent to UN3028 but not in the battery list
      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
      const hasNote6 = result.noteConditionPairs.some(pair => pair.noteCondition === 'note6');
      expect(hasNote6).toBe(false);
    });

    test('Prefix match UN27940 (hypothetical) = Does not apply', async () => {
      const notUN2794 = createMaterial(
        '8',
        'UN27940',
        'SOME OTHER MATERIAL',
        'N/A'
      );
      const class11 = createMaterial(
        '1.1',
        'UN0004',
        'AMMONIUM PICRATE',
        'D'
      );

      const result = await evaluatePair(notUN2794, class11);

      // Should not match UN2794 (exact matching required)
      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
      const hasNote6 = result.noteConditionPairs.some(pair => pair.noteCondition === 'note6');
      expect(hasNote6).toBe(false);
    });
  });

  describe('MULTI-MATERIAL SCENARIOS: Note 6 in context of multiple materials', () => {
    test('UN2794 (Battery) + Class 1.1 + Class 1.2 = Both pairs incompatible (Note 6)', async () => {
      const un2794 = createMaterial(
        '8',
        'UN2794',
        'BATTERIES, WET, FILLED WITH ACID',
        'N/A'
      );
      const class11 = createMaterial(
        '1.1',
        'UN0004',
        'AMMONIUM PICRATE',
        'D'
      );
      const class12 = createMaterial(
        '1.2',
        'UN0009',
        'AMMUNITION, INCENDIARY',
        'D'
      );

      const result = await runGraphEngineOptimized([un2794, class11, class12], [], false);

      // Pairs evaluated:
      // 1. UN2794 + Class 1.1 = Incompatible (Note 6)
      // 2. UN2794 + Class 1.2 = Incompatible (Note 6)
      // 3. Class 1.1 + Class 1.2 = Compatible per Table A18.1
      expect(result.hazmatCompatibilityKeys.length).toBe(2);

      // Verify both incompatible pairs involve UN2794
      const incompatiblePairs = result.hazmatCompatibilityKeys;
      expect(incompatiblePairs.every(pair =>
        pair.some(m => m.unid === 'UN2794')
      )).toBe(true);

      // Verify Note 6 appears in noteConditionPairs
      const note6Pairs = result.noteConditionPairs.filter(pair => pair.noteCondition === 'note6');
      expect(note6Pairs.length).toBe(2);
    });

    test('Two batteries + Class 1.1 = Both batteries incompatible with Class 1.1', async () => {
      const un2794 = createMaterial(
        '8',
        'UN2794',
        'BATTERIES, WET, FILLED WITH ACID',
        'N/A'
      );
      const un2795 = createMaterial(
        '8',
        'UN2795',
        'BATTERIES, WET, FILLED WITH ALKALI',
        'N/A'
      );
      const class11 = createMaterial(
        '1.1',
        'UN0004',
        'AMMONIUM PICRATE',
        'D'
      );

      const result = await runGraphEngineOptimized([un2794, un2795, class11], [], false);

      // Pairs evaluated:
      // 1. UN2794 + UN2795 = Compatible (both Class 8)
      // 2. UN2794 + Class 1.1 = Incompatible (Note 6)
      // 3. UN2795 + Class 1.1 = Incompatible (Note 6)
      expect(result.hazmatCompatibilityKeys.length).toBe(2);

      // Both incompatible pairs should involve Class 1.1
      const incompatiblePairs = result.hazmatCompatibilityKeys;
      expect(incompatiblePairs.every(pair =>
        pair.some(m => m.unid === 'UN0004')
      )).toBe(true);

      const note6Pairs = result.noteConditionPairs.filter(pair => pair.noteCondition === 'note6');
      expect(note6Pairs.length).toBe(2);
    });

    test('Battery + Class 1.1 + other Class 8 = Battery incompatible with 1.1, other 8 also incompatible', async () => {
      const un2794 = createMaterial(
        '8',
        'UN2794',
        'BATTERIES, WET, FILLED WITH ACID',
        'N/A'
      );
      const class11 = createMaterial(
        '1.1',
        'UN0004',
        'AMMONIUM PICRATE',
        'D'
      );
      const otherClass8 = createMaterial(
        '8',
        'UN1789',
        'HYDROCHLORIC ACID',
        'N/A'
      );

      const result = await runGraphEngineOptimized([un2794, class11, otherClass8], [], false);

      // Pairs evaluated:
      // 1. UN2794 + Class 1.1 = Incompatible (Note 6)
      // 2. UN2794 + UN1789 = Compatible
      // 3. Class 1.1 + UN1789 = Incompatible (Class 8 + 1.1 = 'X')
      expect(result.hazmatCompatibilityKeys.length).toBe(2);

      // One pair should trigger Note 6 (UN2794 + Class 1.1)
      const note6Pairs = result.noteConditionPairs.filter(pair => pair.noteCondition === 'note6');
      expect(note6Pairs.length).toBe(1);
      expect(note6Pairs[0].hazmatObjectPair.some(m => m.unid === 'UN2794')).toBe(true);
      expect(note6Pairs[0].hazmatObjectPair.some(m => m.unid === 'UN0004')).toBe(true);
    });

    test('Battery + Class 1.3 + Class 1.4 = Mixed compatibility', async () => {
      const un2800 = createMaterial(
        '8',
        'UN2800',
        'BATTERIES, WET, NON-SPILLABLE',
        'N/A'
      );
      const class13 = createMaterial(
        '1.3',
        'UN0242',
        'CHARGES, PROPELLING',
        'C'
      );
      const class14 = createMaterial(
        '1.4',
        'UN0297',
        'AMMUNITION, ILLUMINATING',
        'S'
      );

      const result = await runGraphEngineOptimized([un2800, class13, class14], [], false);

      // Pairs evaluated:
      // 1. UN2800 + Class 1.3 = Incompatible (Table A18.1, not Note 6)
      // 2. UN2800 + Class 1.4 = Compatible
      // 3. Class 1.3 + Class 1.4 = Compatible
      expect(result.hazmatCompatibilityKeys.length).toBe(1);

      // Should NOT have Note 6 (only applies to 1.1 and 1.2)
      const note6Pairs = result.noteConditionPairs.filter(pair => pair.noteCondition === 'note6');
      expect(note6Pairs.length).toBe(0);
    });
  });

  describe('VERIFICATION: Confirm Note 6 is identifying specific incompatibility', () => {
    test('Baseline: Class 8 (non-battery) + Class 1.1 IS incompatible (but no Note 6)', async () => {
      const class8 = createMaterial(
        '8',
        'UN1789',
        'HYDROCHLORIC ACID',
        'N/A'
      );
      const class11 = createMaterial(
        '1.1',
        'UN0004',
        'AMMONIUM PICRATE',
        'D'
      );

      const result = await evaluatePair(class8, class11);

      // Verify baseline: incompatible, but no Note 6
      expect(result.incompatible).toBe(true);
      const hasNote6 = result.noteConditionPairs.some(pair => pair.noteCondition === 'note6');
      expect(hasNote6).toBe(false);
    });

    test('Exception: Battery (Class 8) + Class 1.1 IS incompatible WITH Note 6', async () => {
      const un2794 = createMaterial(
        '8',
        'UN2794',
        'BATTERIES, WET, FILLED WITH ACID',
        'N/A'
      );
      const class11 = createMaterial(
        '1.1',
        'UN0004',
        'AMMONIUM PICRATE',
        'D'
      );

      const result = await evaluatePair(un2794, class11);

      // Verify exception: incompatible WITH Note 6
      expect(result.incompatible).toBe(true);
      expect(result.noteConditionPairs[0].noteCondition).toBe('note6');
    });

    test('Baseline: Class 8 (non-battery) + Class 1.2 IS incompatible (but no Note 6)', async () => {
      const class8 = createMaterial(
        '8',
        'UN1824',
        'SODIUM HYDROXIDE SOLUTION',
        'N/A'
      );
      const class12 = createMaterial(
        '1.2',
        'UN0009',
        'AMMUNITION, INCENDIARY',
        'D'
      );

      const result = await evaluatePair(class8, class12);

      // Verify baseline: incompatible, but no Note 6
      expect(result.incompatible).toBe(true);
      const hasNote6 = result.noteConditionPairs.some(pair => pair.noteCondition === 'note6');
      expect(hasNote6).toBe(false);
    });

    test('Exception: Battery (Class 8) + Class 1.2 IS incompatible WITH Note 6', async () => {
      const un2795 = createMaterial(
        '8',
        'UN2795',
        'BATTERIES, WET, FILLED WITH ALKALI',
        'N/A'
      );
      const class12 = createMaterial(
        '1.2',
        'UN0009',
        'AMMUNITION, INCENDIARY',
        'D'
      );

      const result = await evaluatePair(un2795, class12);

      // Verify exception: incompatible WITH Note 6
      expect(result.incompatible).toBe(true);
      expect(result.noteConditionPairs[0].noteCondition).toBe('note6');
    });

    test('Verify all four battery UNs add Note 6 identification', async () => {
      const batteryUNs = ['UN2794', 'UN2795', 'UN2800', 'UN3028'];
      const class11 = createMaterial(
        '1.1',
        'UN0004',
        'AMMONIUM PICRATE',
        'D'
      );

      for (const unid of batteryUNs) {
        const battery = createMaterial(
          '8',
          unid,
          'BATTERY',
          'N/A'
        );

        const result = await evaluatePair(battery, class11);

        // All four should be incompatible WITH Note 6
        expect(result.incompatible).toBe(true);
        expect(result.noteConditionPairs[0].noteCondition).toBe('note6');
      }
    });
  });

  describe('NOTE CONDITION PAIRS: Verify noteConditionPairs tracking', () => {
    test('Note 6 pair should appear in noteConditionPairs array', async () => {
      const un2794 = createMaterial(
        '8',
        'UN2794',
        'BATTERIES, WET, FILLED WITH ACID',
        'N/A'
      );
      const class11 = createMaterial(
        '1.1',
        'UN0004',
        'AMMONIUM PICRATE',
        'D'
      );

      const result = await evaluatePair(un2794, class11);

      expect(result.noteConditionPairs.length).toBe(1);
      expect(result.noteConditionPairs[0].noteCondition).toBe('note6');
      expect(result.noteConditionPairs[0].noteContent).toContain('electric storage batteries');
      expect(result.noteConditionPairs[0].noteContent).toContain('Class 8');
      expect(result.noteConditionPairs[0].noteContent).toContain('1.1 or 1.2');
      expect(result.noteConditionPairs[0].status).toBe('incompatible');
    });

    test('Note 6 content should be descriptive and accurate', async () => {
      const un2800 = createMaterial(
        '8',
        'UN2800',
        'BATTERIES, WET, NON-SPILLABLE',
        'N/A'
      );
      const class12 = createMaterial(
        '1.2',
        'UN0009',
        'AMMUNITION, INCENDIARY',
        'D'
      );

      const result = await evaluatePair(un2800, class12);

      const notePair = result.noteConditionPairs[0];
      expect(notePair.noteContent).toContain('Do not load');
      expect(notePair.noteContent).toContain('charged electric storage batteries');
      expect(notePair.noteContent).toContain('same aircraft');
      expect(notePair.noteContent).toContain('any Class 1.1 or 1.2');
    });

    test('Multiple Note 6 pairs should all be tracked', async () => {
      const un2794 = createMaterial(
        '8',
        'UN2794',
        'BATTERIES, WET, FILLED WITH ACID',
        'N/A'
      );
      const class11 = createMaterial(
        '1.1',
        'UN0004',
        'AMMONIUM PICRATE',
        'D'
      );
      const class12 = createMaterial(
        '1.2',
        'UN0009',
        'AMMUNITION, INCENDIARY',
        'D'
      );

      const result = await runGraphEngineOptimized([un2794, class11, class12], [], false);

      const note6Pairs = result.noteConditionPairs.filter(pair => pair.noteCondition === 'note6');
      expect(note6Pairs.length).toBe(2);
      expect(note6Pairs.every(pair => pair.status === 'incompatible')).toBe(true);
    });
  });
});
