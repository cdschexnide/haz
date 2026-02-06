import { runGraphEngineOptimized, clearCache } from '../optimizedEngine';
import { COMPATIBILITY_GROUPS, HazmatCompatibilityKey } from '../engineTypes';

//  Note 4: Cyanides or cyanide mixtures (Class 6.1) CANNOT be loaded with
//  any Class 8 materials. This is an incompatibility rule that makes normally
//  compatible or segregation-required materials completely incompatible.

//  Table A18.1, requires at least 88 inches of segregation between Class 6.1 and Class 8 materials
//  Note 4 creates an exception that makes specific cyanide materials completely
//  incompatible with any Class 8 materials.

//  Cyanide UN Numbers covered by Note 4:
//  UN1051, UN1565, UN1575, UN1587, UN1588, UN1613, UN1614, UN1620, UN1626, UN1636,
//  UN1642, UN1653, UN1679, UN1680, UN1684, UN1689, UN1694, UN1713, UN1935, UN2316,
//  UN2317, UN3294, UN3413, UN3414, UN3449

function createMaterial(
  hazardClass: string,
  unid: string,
  psn: string,
  compatibilityGroup: typeof COMPATIBILITY_GROUPS[number],
  packingGroup?: string
): HazmatCompatibilityKey {
  return {
    hazardClassDivisionNumber: hazardClass,
    unid,
    properShippingName: psn,
    compatibilityGroup: compatibilityGroup,
    numericSpecialProvision: 'N/A',
    packingGroup: packingGroup || '',
  };
}

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

describe('Note 4 Condition: Cyanides (Class 6.1) with Class 8 materials', () => {
  beforeEach(() => {
    clearCache();
  });

  describe('POSITIVE TESTS: Note 4 applies and causes incompatibility', () => {
    test('UN1051 (Hydrogen cyanide, stabilized) + Class 8 = Incompatible (Note 4)', async () => {
      const un1051 = createMaterial(
        '6.1',
        'UN1051',
        'HYDROGEN CYANIDE, STABILIZED',
        'N/A',
        'I'
      );
      const class8 = createMaterial(
        '8',
        'UN1789',
        'HYDROCHLORIC ACID',
        'N/A'
      );

      const result = await evaluatePair(un1051, class8);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
      expect(result.segregationMessage).toBe('N/A');
    });

    test('UN1565 (Barium cyanide) + Class 8 = Incompatible (Note 4)', async () => {
      const un1565 = createMaterial(
        '6.1',
        'UN1565',
        'BARIUM CYANIDE',
        'N/A',
        'I'
      );
      const class8 = createMaterial(
        '8',
        'UN1824',
        'SODIUM HYDROXIDE SOLUTION',
        'N/A'
      );

      const result = await evaluatePair(un1565, class8);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
    });

    test('UN1613 (Hydrocyanic acid) + Class 8 = Incompatible (Note 4)', async () => {
      const un1613 = createMaterial(
        '6.1',
        'UN1613',
        'HYDROCYANIC ACID, AQUEOUS SOLUTION',
        'N/A',
        'I'
      );
      const class8 = createMaterial(
        '8',
        'UN1830',
        'SULFURIC ACID',
        'N/A'
      );

      const result = await evaluatePair(un1613, class8);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
    });

    test('UN1689 (Sodium cyanide) + Class 8 = Incompatible (Note 4)', async () => {
      const un1689 = createMaterial(
        '6.1',
        'UN1689',
        'SODIUM CYANIDE',
        'N/A',
        'I'
      );
      const class8 = createMaterial(
        '8',
        'UN2796',
        'SULFURIC ACID',
        'N/A'
      );

      const result = await evaluatePair(un1689, class8);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
    });

    test('UN1935 (Cyanide solution) + Class 8 = Incompatible (Note 4)', async () => {
      const un1935 = createMaterial(
        '6.1',
        'UN1935',
        'CYANIDE SOLUTION, N.O.S.',
        'N/A',
        'I'
      );
      const class8 = createMaterial(
        '8',
        'UN1805',
        'PHOSPHORIC ACID SOLUTION',
        'N/A'
      );

      const result = await evaluatePair(un1935, class8);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Bidirectional: Class 8 + UN1051 (Cyanide) = Incompatible', async () => {
      const class8 = createMaterial(
        '8',
        'UN1789',
        'HYDROCHLORIC ACID',
        'N/A'
      );
      const un1051 = createMaterial(
        '6.1',
        'UN1051',
        'HYDROGEN CYANIDE, STABILIZED',
        'N/A',
        'I'
      );

      const result = await evaluatePair(class8, un1051);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Bidirectional: Class 8 + UN1689 (Sodium cyanide) = Incompatible', async () => {
      const class8 = createMaterial(
        '8',
        'UN1824',
        'SODIUM HYDROXIDE SOLUTION',
        'N/A'
      );
      const un1689 = createMaterial(
        '6.1',
        'UN1689',
        'SODIUM CYANIDE',
        'N/A',
        'I'
      );

      const result = await evaluatePair(class8, un1689);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Multiple cyanide UNs with different Class 8 materials', async () => {
      const cyanideUNs = ['UN1051', 'UN1565', 'UN1613', 'UN1689', 'UN1935', 'UN2316', 'UN3294'];
      const class8Materials = [
        createMaterial('8', 'UN1789', 'HYDROCHLORIC ACID', 'N/A'),
        createMaterial('8', 'UN1824', 'SODIUM HYDROXIDE SOLUTION', 'N/A'),
        createMaterial('8', 'UN1830', 'SULFURIC ACID', 'N/A'),
      ];

      for (const cyanideUN of cyanideUNs) {
        const cyanide = createMaterial(
          '6.1',
          cyanideUN,
          'CYANIDE MATERIAL',
          'N/A',
          'I'
        );

        for (const class8 of class8Materials) {
          const result = await evaluatePair(cyanide, class8);

          expect(result.incompatible).toBe(true);
          expect(result.requiresSegregation).toBe(false);
        }
      }
    });

    test('All 24 cyanide UNs should trigger Note 4 with Class 8', async () => {
      const allCyanideUNs = [
        'UN1051', 'UN1565', 'UN1575', 'UN1587', 'UN1588', 'UN1613', 'UN1614',
        'UN1620', 'UN1626', 'UN1636', 'UN1642', 'UN1653', 'UN1679', 'UN1680',
        'UN1684', 'UN1689', 'UN1694', 'UN1713', 'UN1935', 'UN2316', 'UN2317',
        'UN3294', 'UN3413', 'UN3414', 'UN3449'
      ];
      const class8 = createMaterial(
        '8',
        'UN1789',
        'HYDROCHLORIC ACID',
        'N/A'
      );

      for (const cyanideUN of allCyanideUNs) {
        const cyanide = createMaterial(
          '6.1',
          cyanideUN,
          'CYANIDE MATERIAL',
          'N/A',
          'I'
        );

        const result = await evaluatePair(cyanide, class8);

        expect(result.incompatible).toBe(true);
        expect(result.requiresSegregation).toBe(false);
      }
    });

    test('Cyanide with different types of Class 8 materials (all should be incompatible)', async () => {
      const un1689 = createMaterial(
        '6.1',
        'UN1689',
        'SODIUM CYANIDE',
        'N/A',
        'I'
      );

      const class8Materials = [
        createMaterial('8', 'UN1789', 'HYDROCHLORIC ACID', 'N/A'),
        createMaterial('8', 'UN1824', 'SODIUM HYDROXIDE SOLUTION', 'N/A'),
        createMaterial('8', 'UN1830', 'SULFURIC ACID', 'N/A'),
        createMaterial('8', 'UN2031', 'NITRIC ACID', 'N/A'),
        createMaterial('8', 'UN2790', 'ACETIC ACID SOLUTION', 'N/A'),
        createMaterial('8', 'UN2794', 'BATTERIES, WET, FILLED WITH ACID', 'N/A'),
        createMaterial('8', 'UN1805', 'PHOSPHORIC ACID SOLUTION', 'N/A'),
      ];

      for (const class8 of class8Materials) {
        const result = await evaluatePair(un1689, class8);

        expect(result.incompatible).toBe(true);
        expect(result.requiresSegregation).toBe(false);
      }
    });
  });

  describe('NEGATIVE TESTS: Note 4 does NOT apply - normal rules prevail', () => {
    test('Non-cyanide Class 6.1 PG I + Class 8 = Incompatible per base table (no Note 4)', async () => {
      const nonCyanide61 = createMaterial(
        '6.1',
        'UN1541',
        'ACETONE CYANOHYDRIN, STABILIZED',
        'N/A',
        'I'
      );
      const class8 = createMaterial(
        '8',
        'UN1789',
        'HYDROCHLORIC ACID',
        'N/A'
      );

      const result = await evaluatePair(nonCyanide61, class8);

      // Base Table A18.1: Class 6.1 PG I + Class 8 liquid = 'X' (incompatible)
      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
      expect(result.segregationMessage).toBe('N/A');
      expect(result.noteCondition).toBeNull();
    });

    test('Cyanide (UN1689) + Class 3 = Incompatible (follow normal rules)', async () => {
      const un1689 = createMaterial(
        '6.1',
        'UN1689',
        'SODIUM CYANIDE',
        'N/A',
        'I'
      );
      const class3 = createMaterial(
        '3',
        'UN1090',
        'ACETONE',
        'N/A'
      );

      const result = await evaluatePair(un1689, class3);

      // Table A18.1: Class 6.1 PG I + Class 3 = 'X' (incompatible)
      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
      expect(result.noteCondition).toBeNull();
    });

    test('Cyanide (UN1051) + Class 2.1 = Segregation required (follow normal rules)', async () => {
      const un1051 = createMaterial(
        '6.1',
        'UN1051',
        'HYDROGEN CYANIDE, STABILIZED',
        'N/A',
        'I'
      );
      const class21 = createMaterial(
        '2.1',
        'UN1011',
        'BUTANE',
        'N/A'
      );

      const result = await evaluatePair(un1051, class21);

      // Table A18.1: Class 6.1 + Class 2.1 = '0' (segregation required)
      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(true);
      expect(result.segregationMessage).toBe('88 Inches of Separation');
      expect(result.noteCondition).toBeNull();
    });

    test('Cyanide (UN1613) + Class 1.1 = Follow normal rules (incompatible)', async () => {
      const un1613 = createMaterial(
        '6.1',
        'UN1613',
        'HYDROCYANIC ACID, AQUEOUS SOLUTION',
        'N/A',
        'I'
      );
      const class11 = createMaterial(
        '1.1',
        'UN0004',
        'AMMONIUM PICRATE',
        'D'
      );

      const result = await evaluatePair(un1613, class11);

      // Table A18.1: Class 6.1 + Class 1.1 = 'X' (incompatible)
      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
      expect(result.noteCondition).toBeNull();
    });

    test('Cyanide (UN1689) + Class 5.1 = Follow normal rules (incompatible)', async () => {
      const un1689 = createMaterial(
        '6.1',
        'UN1689',
        'SODIUM CYANIDE',
        'N/A',
        'I'
      );
      const class51 = createMaterial(
        '5.1',
        'UN1479',
        'OXIDIZING SOLID, N.O.S.',
        'N/A'
      );

      const result = await evaluatePair(un1689, class51);

      // Table A18.1: Class 6.1 + Class 5.1 = 'X' (incompatible)
      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
      expect(result.noteCondition).toBeNull();
    });

    test('Cyanide (UN1935) + Class 7 = Follow normal rules (compatible)', async () => {
      const un1935 = createMaterial(
        '6.1',
        'UN1935',
        'CYANIDE SOLUTION, N.O.S.',
        'N/A',
        'I'
      );
      const class7 = createMaterial(
        '7',
        'UN2912',
        'RADIOACTIVE MATERIAL, LOW SPECIFIC ACTIVITY',
        'N/A'
      );

      const result = await evaluatePair(un1935, class7);

      // Table A18.1: Class 6.1 + Class 7 = '' (compatible)
      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
      expect(result.noteCondition).toBeNull();
    });

    test('Cyanide (UN1051) + non-lithium Class 9 = Compatible (outside A18.1 scoped Class 9)', async () => {
      const un1051 = createMaterial(
        '6.1',
        'UN1051',
        'HYDROGEN CYANIDE, STABILIZED',
        'N/A',
        'I'
      );
      const class9 = createMaterial(
        '9',
        'UN3077',
        'ENVIRONMENTALLY HAZARDOUS SUBSTANCE, SOLID, N.O.S.',
        'N/A'
      );

      const result = await evaluatePair(un1051, class9);

      // Table A18.1 Class 9 rules apply only to UN3480/UN3090.
      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
      expect(result.noteCondition).toBeNull();
    });

    test('Class 6.1 PG II (not PG I) with cyanide UN + Class 8 = No restrictions', async () => {
      // Note: Class 6.1 PG II/III don't have segregation restrictions per Table A18.1
      const cyanidePG2 = createMaterial(
        '6.1',
        'UN1689',
        'SODIUM CYANIDE',
        'N/A',
        'II'
      );
      const class8 = createMaterial(
        '8',
        'UN1789',
        'HYDROCHLORIC ACID',
        'N/A'
      );

      const result = await evaluatePair(cyanidePG2, class8);

      // Class 6.1 PG II materials are exempt from Table A18.1 segregation rules
      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
      expect(result.segregationMessage).toBe('N/A');
    });

    test('Class 6.1 PG III (not PG I) with cyanide UN + Class 8 = No restrictions', async () => {
      const cyanidePG3 = createMaterial(
        '6.1',
        'UN1689',
        'SODIUM CYANIDE',
        'N/A',
        'III'
      );
      const class8 = createMaterial(
        '8',
        'UN1789',
        'HYDROCHLORIC ACID',
        'N/A'
      );

      const result = await evaluatePair(cyanidePG3, class8);

      // Class 6.1 PG III materials are exempt from Table A18.1 segregation rules
      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
      expect(result.segregationMessage).toBe('N/A');
    });
  });

  describe('EDGE CASES: Verify specificity and boundary conditions', () => {
    test('UN1689 (Sodium cyanide) with itself = Compatible (identical materials)', async () => {
      const un1689a = createMaterial(
        '6.1',
        'UN1689',
        'SODIUM CYANIDE',
        'N/A',
        'I'
      );
      const un1689b = createMaterial(
        '6.1',
        'UN1689',
        'SODIUM CYANIDE',
        'N/A',
        'I'
      );

      const result = await evaluatePair(un1689a, un1689b);

      // Identical materials are always compatible
      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Two different cyanides together = Follow normal Class 6.1 + 6.1 rules', async () => {
      const un1051 = createMaterial(
        '6.1',
        'UN1051',
        'HYDROGEN CYANIDE, STABILIZED',
        'N/A',
        'I'
      );
      const un1689 = createMaterial(
        '6.1',
        'UN1689',
        'SODIUM CYANIDE',
        'N/A',
        'I'
      );

      const result = await evaluatePair(un1051, un1689);

      // Table A18.1: Class 6.1 + Class 6.1 = '' (compatible)
      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
      expect(result.noteCondition).toBeNull();
    });

    test('Similar UN number UN1050 (NOT a cyanide) + Class 8 = Incompatible by base table', async () => {
      const un1050 = createMaterial(
        '6.1',
        'UN1050',
        'HYDROGEN CHLORIDE, ANHYDROUS',
        'N/A',
        'I'
      );
      const class8 = createMaterial(
        '8',
        'UN1789',
        'HYDROCHLORIC ACID',
        'N/A'
      );

      const result = await evaluatePair(un1050, class8);

      // UN1050 is not in Note 4 list, but 6.1 PG I + 8 liquid is still incompatible.
      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
      expect(result.noteCondition).toBeNull();
    });

    test('Similar UN number UN1690 (NOT a cyanide) + Class 8 = Incompatible by base table', async () => {
      const un1690 = createMaterial(
        '6.1',
        'UN1690',
        'SODIUM FLUORIDE',
        'N/A',
        'I'
      );
      const class8 = createMaterial(
        '8',
        'UN1789',
        'HYDROCHLORIC ACID',
        'N/A'
      );

      const result = await evaluatePair(un1690, class8);

      // UN1690 is not in Note 4 list, but 6.1 PG I + 8 liquid is still incompatible.
      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
      expect(result.noteCondition).toBeNull();
    });

    test('Prefix match UN10510 (hypothetical) = Note 4 does not apply, base table still does', async () => {
      const notUN1051 = createMaterial(
        '6.1',
        'UN10510',
        'SOME OTHER MATERIAL',
        'N/A',
        'I'
      );
      const class8 = createMaterial(
        '8',
        'UN1789',
        'HYDROCHLORIC ACID',
        'N/A'
      );

      const result = await evaluatePair(notUN1051, class8);

      // Should not match UN1051 (exact matching required), but 6.1 PG I + 8 liquid remains incompatible.
      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
      expect(result.noteCondition).toBeNull();
    });

    test('UN1052 (NOT a cyanide, but close to UN1051) + Class 8 = Incompatible by base table', async () => {
      const un1052 = createMaterial(
        '6.1',
        'UN1052',
        'HYDROGEN FLUORIDE, ANHYDROUS',
        'N/A',
        'I'
      );
      const class8 = createMaterial(
        '8',
        'UN1789',
        'HYDROCHLORIC ACID',
        'N/A'
      );

      const result = await evaluatePair(un1052, class8);

      // UN1052 is not in Note 4 list, but 6.1 PG I + 8 liquid remains incompatible.
      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
      expect(result.noteCondition).toBeNull();
    });

    test('Cyanide with battery (Class 8 battery) = Still incompatible', async () => {
      const un1689 = createMaterial(
        '6.1',
        'UN1689',
        'SODIUM CYANIDE',
        'N/A',
        'I'
      );
      const battery = createMaterial(
        '8',
        'UN2794',
        'BATTERIES, WET, FILLED WITH ACID',
        'N/A'
      );

      const result = await evaluatePair(un1689, battery);

      // Note 4 applies to ALL Class 8 materials, including batteries
      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
    });
  });

  describe('MULTI-MATERIAL SCENARIOS: Note 4 in context of multiple materials', () => {
    test('Cyanide + multiple Class 8 materials = All pairs incompatible', async () => {
      const un1689 = createMaterial(
        '6.1',
        'UN1689',
        'SODIUM CYANIDE',
        'N/A',
        'I'
      );
      const class8a = createMaterial(
        '8',
        'UN1789',
        'HYDROCHLORIC ACID',
        'N/A'
      );
      const class8b = createMaterial(
        '8',
        'UN1824',
        'SODIUM HYDROXIDE SOLUTION',
        'N/A'
      );

      const result = await runGraphEngineOptimized([un1689, class8a, class8b], [], false);

      // Pairs evaluated:
      // 1. UN1689 + UN1789 = Incompatible (Note 4)
      // 2. UN1689 + UN1824 = Incompatible (Note 4)
      // 3. UN1789 + UN1824 = Compatible (Class 8 + 8)
      expect(result.hazmatCompatibilityKeys.length).toBe(2);

      // Verify both incompatible pairs involve the cyanide
      const incompatiblePairs = result.hazmatCompatibilityKeys;
      expect(incompatiblePairs.every(pair =>
        pair.some(m => m.unid === 'UN1689')
      )).toBe(true);
    });

    test('Multiple cyanides + one Class 8 = All cyanide-Class8 pairs incompatible', async () => {
      const un1051 = createMaterial(
        '6.1',
        'UN1051',
        'HYDROGEN CYANIDE, STABILIZED',
        'N/A',
        'I'
      );
      const un1689 = createMaterial(
        '6.1',
        'UN1689',
        'SODIUM CYANIDE',
        'N/A',
        'I'
      );
      const class8 = createMaterial(
        '8',
        'UN1789',
        'HYDROCHLORIC ACID',
        'N/A'
      );

      const result = await runGraphEngineOptimized([un1051, un1689, class8], [], false);

      // Pairs evaluated:
      // 1. UN1051 + UN1689 = Compatible (Class 6.1 + 6.1)
      // 2. UN1051 + UN1789 = Incompatible (Note 4)
      // 3. UN1689 + UN1789 = Incompatible (Note 4)
      expect(result.hazmatCompatibilityKeys.length).toBe(2);
      expect(result.segregatedHazmatMaterials.length).toBe(0);

      // Verify both incompatible pairs involve Class 8
      const incompatiblePairs = result.hazmatCompatibilityKeys;
      expect(incompatiblePairs.every(pair =>
        pair.some(m => m.unid === 'UN1789')
      )).toBe(true);
    });

    test('Cyanide + Class 8 + non-cyanide Class 6.1 = Mixed results', async () => {
      const cyanide = createMaterial(
        '6.1',
        'UN1689',
        'SODIUM CYANIDE',
        'N/A',
        'I'
      );
      const class8 = createMaterial(
        '8',
        'UN1789',
        'HYDROCHLORIC ACID',
        'N/A'
      );
      const nonCyanide61 = createMaterial(
        '6.1',
        'UN1541',
        'ACETONE CYANOHYDRIN, STABILIZED',
        'N/A',
        'I'
      );

      const result = await runGraphEngineOptimized([cyanide, class8, nonCyanide61], [], false);

      // Pairs evaluated:
      // 1. UN1689 + UN1789 = Incompatible (Note 4)
      // 2. UN1689 + UN1541 = Compatible (Class 6.1 + 6.1)
      // 3. UN1789 + UN1541 = Incompatible (Class 8 liquid + 6.1 PG I)
      expect(result.hazmatCompatibilityKeys.length).toBe(2);
      expect(result.segregatedHazmatMaterials.length).toBe(0);

      // Verify the incompatible pair is cyanide + Class 8
      const incompatiblePair = result.hazmatCompatibilityKeys[0];
      expect(incompatiblePair.some(m => m.unid === 'UN1689')).toBe(true);
      expect(incompatiblePair.some(m => m.unid === 'UN1789')).toBe(true);
    });

    test('Cyanide + Class 8 + Class 3 = Mixed compatibility', async () => {
      const cyanide = createMaterial(
        '6.1',
        'UN1689',
        'SODIUM CYANIDE',
        'N/A',
        'I'
      );
      const class8 = createMaterial(
        '8',
        'UN1789',
        'HYDROCHLORIC ACID',
        'N/A'
      );
      const class3 = createMaterial(
        '3',
        'UN1090',
        'ACETONE',
        'N/A'
      );

      const result = await runGraphEngineOptimized([cyanide, class8, class3], [], false);

      // Pairs evaluated:
      // 1. UN1689 + UN1789 = Incompatible (Note 4)
      // 2. UN1689 + UN1090 = Incompatible (Table A18.1: 6.1 PG I + 3 = 'X')
      // 3. UN1789 + UN1090 = Compatible (Table A18.1 has no 8 liquid + 3 relationship)
      expect(result.hazmatCompatibilityKeys.length).toBe(2);
      expect(result.segregatedHazmatMaterials.length).toBe(0);
    });
  });

  describe('VERIFICATION: Confirm Note 4 is causing incompatibility', () => {
    test('Baseline: Non-cyanide Class 6.1 + Class 8 = Incompatible by base table', async () => {
      const nonCyanide61 = createMaterial(
        '6.1',
        'UN1541',
        'ACETONE CYANOHYDRIN, STABILIZED',
        'N/A',
        'I'
      );
      const class8 = createMaterial(
        '8',
        'UN1789',
        'HYDROCHLORIC ACID',
        'N/A'
      );

      const result = await evaluatePair(nonCyanide61, class8);

      // Verify baseline: without Note 4, Class 6.1 PG I + Class 8 liquid is already incompatible.
      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
      expect(result.segregationMessage).toBe('N/A');
    });

    test('Exception: Cyanide (Class 6.1) + Class 8 = Incompatible', async () => {
      const cyanide = createMaterial(
        '6.1',
        'UN1689',
        'SODIUM CYANIDE',
        'N/A',
        'I'
      );
      const class8 = createMaterial(
        '8',
        'UN1789',
        'HYDROCHLORIC ACID',
        'N/A'
      );

      const result = await evaluatePair(cyanide, class8);

      // Verify exception: with cyanide, they are incompatible (not just segregated)
      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Verify all 24 cyanide UNs cause incompatibility with Class 8', async () => {
      const allCyanideUNs = [
        'UN1051', 'UN1565', 'UN1575', 'UN1587', 'UN1588', 'UN1613', 'UN1614',
        'UN1620', 'UN1626', 'UN1636', 'UN1642', 'UN1653', 'UN1679', 'UN1680',
        'UN1684', 'UN1689', 'UN1694', 'UN1713', 'UN1935', 'UN2316', 'UN2317',
        'UN3294', 'UN3413', 'UN3414', 'UN3449'
      ];
      const class8 = createMaterial(
        '8',
        'UN1789',
        'HYDROCHLORIC ACID',
        'N/A'
      );

      for (const cyanideUN of allCyanideUNs) {
        const cyanide = createMaterial(
          '6.1',
          cyanideUN,
          'CYANIDE MATERIAL',
          'N/A',
          'I'
        );

        const result = await evaluatePair(cyanide, class8);

        // All 24 should cause incompatibility
        expect(result.incompatible).toBe(true);
        expect(result.requiresSegregation).toBe(false);
      }
    });
  });

  describe('NOTE CONDITION PAIRS: Verify noteConditionPairs tracking', () => {
    test('Note 4 pair should appear in noteConditionPairs array', async () => {
      const cyanide = createMaterial(
        '6.1',
        'UN1689',
        'SODIUM CYANIDE',
        'N/A',
        'I'
      );
      const class8 = createMaterial(
        '8',
        'UN1789',
        'HYDROCHLORIC ACID',
        'N/A'
      );

      const result = await evaluatePair(cyanide, class8);

      expect(result.noteConditionPairs.length).toBe(1);
      expect(result.noteConditionPairs[0].noteCondition).toBe('note4');
      expect(result.noteConditionPairs[0].noteContent).toContain('cyanide');
      expect(result.noteConditionPairs[0].noteContent).toContain('Class 6.1');
      expect(result.noteConditionPairs[0].noteContent).toContain('Class 8');
      expect(result.noteConditionPairs[0].status).toBe('incompatible');
    });

    test('Note 4 content should be descriptive and accurate', async () => {
      const cyanide = createMaterial(
        '6.1',
        'UN1051',
        'HYDROGEN CYANIDE, STABILIZED',
        'N/A',
        'I'
      );
      const class8 = createMaterial(
        '8',
        'UN1824',
        'SODIUM HYDROXIDE SOLUTION',
        'N/A'
      );

      const result = await evaluatePair(cyanide, class8);

      const notePair = result.noteConditionPairs[0];
      expect(notePair.noteContent).toContain('Do not load');
      expect(notePair.noteContent).toContain('transport');
      expect(notePair.noteContent).toContain('store');
      expect(notePair.noteContent).toContain('cyanide');
    });

    test('Multiple Note 4 pairs should all be tracked', async () => {
      const cyanide = createMaterial(
        '6.1',
        'UN1689',
        'SODIUM CYANIDE',
        'N/A',
        'I'
      );
      const class8a = createMaterial(
        '8',
        'UN1789',
        'HYDROCHLORIC ACID',
        'N/A'
      );
      const class8b = createMaterial(
        '8',
        'UN1824',
        'SODIUM HYDROXIDE SOLUTION',
        'N/A'
      );

      const result = await runGraphEngineOptimized([cyanide, class8a, class8b], [], false);

      // Should have 2 note condition pairs (cyanide with each Class 8)
      expect(result.noteConditionPairs.length).toBe(2);
      expect(result.noteConditionPairs.every(pair => pair.noteCondition === 'note4')).toBe(true);
      expect(result.noteConditionPairs.every(pair => pair.status === 'incompatible')).toBe(true);
      expect(result.noteConditionPairs.every(pair =>
        pair.hazmatObjectPair.some(m => m.unid === 'UN1689')
      )).toBe(true);
    });
  });
});
