import { runGraphEngineOptimized, clearCache } from '../optimizedEngine';
import { COMPATIBILITY_GROUPS, HazmatCompatibilityKey } from '../engineTypes';

/**
 * Test suite for Note 8 Condition (AFMAN 24-604 Table A18.1 Note 8)
 *
 * Note 8: Class 8 corrosive liquids may not be loaded above or adjacent to
 * Class 4 (flammable solid) material or Class 5 (oxidizing) material.
 *
 * Background: According to Table A18.1, some combinations of Class 8 + Class 4/5
 * may be compatible or require standard segregation. However, Note 8 creates a
 * specific segregation requirement for Class 8 corrosive liquids (192 specific UNs)
 * that prevents them from being loaded above or adjacent to Class 4 or Class 5 materials.
 */

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

describe('Note 8 Condition: Class 8 corrosive liquids segregation from Class 4 and 5', () => {
  beforeEach(() => {
    clearCache();
  });

  describe('POSITIVE TESTS: Note 8 applies and requires segregation', () => {
    test('UN1052 (Class 8 corrosive liquid) + Class 4.1 = Segregation required (Note 8)', async () => {
      const un1052 = createMaterial(
        '8',
        'UN1052',
        'HYDROGEN FLUORIDE, ANHYDROUS',
        'N/A'
      );
      const class41 = createMaterial(
        '4.1',
        'UN1325',
        'FLAMMABLE SOLID, ORGANIC, N.O.S.',
        'N/A'
      );

      const result = await evaluatePair(un1052, class41);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(true);
      expect(result.segregationMessage).toContain('corrosive liquids');
      expect(result.segregationMessage).toContain('Class 4');
      expect(result.segregationMessage).toContain('above or adjacent');
      expect(result.noteCondition).toBe('note8');
    });

    test('UN1789 (Class 8 corrosive liquid) + Class 4.2 = Incompatible by base table (not Note 8)', async () => {
      const un1789 = createMaterial(
        '8',
        'UN1789',
        'HYDROCHLORIC ACID',
        'N/A'
      );
      const class42 = createMaterial(
        '4.2',
        'UN1373',
        'FIBERS, ANIMAL OR VEGETABLE',
        'N/A'
      );

      const result = await evaluatePair(un1789, class42);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
      expect(result.noteCondition).toBeNull();
    });

    test('UN1830 (Class 8 corrosive liquid) + Class 4.3 = Segregation by base table (not Note 8)', async () => {
      const un1830 = createMaterial(
        '8',
        'UN1830',
        'SULFURIC ACID',
        'N/A'
      );
      const class43 = createMaterial(
        '4.3',
        'UN1428',
        'SODIUM',
        'N/A'
      );

      const result = await evaluatePair(un1830, class43);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(true);
      expect(result.noteCondition).toBeNull();
    });

    test('UN1824 (Class 8 corrosive liquid) + Class 5.1 = Segregation required (Note 8)', async () => {
      const un1824 = createMaterial(
        '8',
        'UN1824',
        'SODIUM HYDROXIDE SOLUTION',
        'N/A'
      );
      const class51 = createMaterial(
        '5.1',
        'UN1479',
        'OXIDIZING SOLID, N.O.S.',
        'N/A'
      );

      const result = await evaluatePair(un1824, class51);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(true);
      expect(result.segregationMessage).toContain('Class 5');
      expect(result.noteCondition).toBe('note8');
    });

    test('UN2031 (Nitric acid - Class 8 corrosive liquid) + Class 5.2 = Segregation required (Note 8)', async () => {
      const un2031 = createMaterial(
        '8',
        'UN2031',
        'NITRIC ACID',
        'N/A'
      );
      const class52 = createMaterial(
        '5.2',
        'UN3109',
        'ORGANIC PEROXIDE TYPE F, LIQUID',
        'N/A'
      );

      const result = await evaluatePair(un2031, class52);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(true);
      expect(result.noteCondition).toBe('note8');
    });

    test('Bidirectional: Class 4.1 + UN1052 (Class 8 corrosive liquid) = Segregation required', async () => {
      const class41 = createMaterial(
        '4.1',
        'UN1325',
        'FLAMMABLE SOLID, ORGANIC, N.O.S.',
        'N/A'
      );
      const un1052 = createMaterial(
        '8',
        'UN1052',
        'HYDROGEN FLUORIDE, ANHYDROUS',
        'N/A'
      );

      const result = await evaluatePair(class41, un1052);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(true);
      expect(result.noteCondition).toBe('note8');
    });

    test('Bidirectional: Class 5.1 + UN1789 (Class 8 corrosive liquid) = Segregation required', async () => {
      const class51 = createMaterial(
        '5.1',
        'UN1479',
        'OXIDIZING SOLID, N.O.S.',
        'N/A'
      );
      const un1789 = createMaterial(
        '8',
        'UN1789',
        'HYDROCHLORIC ACID',
        'N/A'
      );

      const result = await evaluatePair(class51, un1789);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(true);
      expect(result.noteCondition).toBe('note8');
    });

    test('Multiple Class 8 corrosive liquids from the list trigger Note 8 with Class 4.1', async () => {
      const corrosiveLiquidUNs = ['UN1052', 'UN1715', 'UN1789', 'UN1830', 'UN2031'];
      const class41 = createMaterial(
        '4.1',
        'UN1325',
        'FLAMMABLE SOLID, ORGANIC, N.O.S.',
        'N/A'
      );

      for (const unid of corrosiveLiquidUNs) {
        const corrosiveLiquid = createMaterial(
          '8',
          unid,
          'CORROSIVE LIQUID',
          'N/A'
        );

        const result = await evaluatePair(corrosiveLiquid, class41);

        expect(result.incompatible).toBe(false);
        expect(result.requiresSegregation).toBe(true);
        expect(result.noteCondition).toBe('note8');
      }
    });

    test('Multiple Class 8 corrosive liquids from the list trigger Note 8 with Class 5.1', async () => {
      const corrosiveLiquidUNs = ['UN1760', 'UN1805', 'UN1824', 'UN2032', 'UN2691'];
      const class51 = createMaterial(
        '5.1',
        'UN1479',
        'OXIDIZING SOLID, N.O.S.',
        'N/A'
      );

      for (const unid of corrosiveLiquidUNs) {
        const corrosiveLiquid = createMaterial(
          '8',
          unid,
          'CORROSIVE LIQUID',
          'N/A'
        );

        const result = await evaluatePair(corrosiveLiquid, class51);

        expect(result.incompatible).toBe(false);
        expect(result.requiresSegregation).toBe(true);
        expect(result.noteCondition).toBe('note8');
      }
    });

    test('Class 8 corrosive liquid from end of list (UN3498) + Class 4.1 = Note 8 applies', async () => {
      const un3498 = createMaterial(
        '8',
        'UN3498',
        'IODINE MONOCHLORIDE',
        'N/A'
      );
      const class41 = createMaterial(
        '4.1',
        'UN1325',
        'FLAMMABLE SOLID, ORGANIC, N.O.S.',
        'N/A'
      );

      const result = await evaluatePair(un3498, class41);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(true);
      expect(result.noteCondition).toBe('note8');
    });

    test('Class 8 corrosive liquid from middle of list (UN2269) + Class 5.1 = Note 8 applies', async () => {
      const un2269 = createMaterial(
        '8',
        'UN2269',
        '3,3-IMINODI-PROPIONITRILE',
        'N/A'
      );
      const class51 = createMaterial(
        '5.1',
        'UN1479',
        'OXIDIZING SOLID, N.O.S.',
        'N/A'
      );

      const result = await evaluatePair(un2269, class51);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(true);
      expect(result.noteCondition).toBe('note8');
    });
  });

  describe('NEGATIVE TESTS: Note 8 does NOT apply - normal rules prevail', () => {
    test('Non-corrosive-liquid Class 8 (NOT in list) + Class 4.1 = Follow normal Table A18.1 rules', async () => {
      const class8NotInList = createMaterial(
        '8',
        'UN2794',
        'BATTERIES, WET, FILLED WITH ACID',
        'N/A'
      );
      const class41 = createMaterial(
        '4.1',
        'UN1325',
        'FLAMMABLE SOLID, ORGANIC, N.O.S.',
        'N/A'
      );

      const result = await evaluatePair(class8NotInList, class41);

      // Non-liquid Class 8 does not map to A18.1 "8 liquid only" restrictions.
      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
      expect(result.noteCondition).toBeNull();
    });

    test('Non-corrosive-liquid Class 8 (NOT in list) + Class 5.1 = Follow normal Table A18.1 rules', async () => {
      const class8NotInList = createMaterial(
        '8',
        'UN3028',
        'BATTERIES, DRY, CONTAINING POTASSIUM HYDROXIDE SOLID',
        'N/A'
      );
      const class51 = createMaterial(
        '5.1',
        'UN1479',
        'OXIDIZING SOLID, N.O.S.',
        'N/A'
      );

      const result = await evaluatePair(class8NotInList, class51);

      // Table A18.1: Class 8 + Class 5.1 = '' (compatible)
      // Without Note 8, this is simply compatible
      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
      expect(result.noteCondition).toBeNull();
    });

    test('Class 8 corrosive liquid + Class 1.1 = Follow normal rules (not Class 4/5)', async () => {
      const un1789 = createMaterial(
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

      const result = await evaluatePair(un1789, class11);

      // Table A18.1: Class 8 + Class 1.1 = 'X' (incompatible)
      // Note 8 only applies to Class 4 and 5, not Class 1
      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
      expect(result.noteCondition).toBeNull();
    });

    test('Class 8 corrosive liquid + Class 2.1 = Follow normal rules (not Class 4/5)', async () => {
      const un1830 = createMaterial(
        '8',
        'UN1830',
        'SULFURIC ACID',
        'N/A'
      );
      const class21 = createMaterial(
        '2.1',
        'UN1011',
        'BUTANE',
        'N/A'
      );

      const result = await evaluatePair(un1830, class21);

      // Table A18.1: Class 8 + Class 2.1 = '0' (segregation required)
      // Note 8 doesn't apply, normal segregation rules apply
      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(true);
      expect(result.segregationMessage).toBe('88 Inches of Separation');
      expect(result.noteCondition).toBeNull();
    });

    test('Class 8 corrosive liquid + Class 3 = Follow normal rules (incompatible, not Class 4/5)', async () => {
      const un1789 = createMaterial(
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

      const result = await evaluatePair(un1789, class3);

      // A18.1 does not define a Class 8 liquid + Class 3 restriction.
      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
      expect(result.noteCondition).toBeNull();
    });

    test('Class 8 corrosive liquid + Class 6.1 = Follow normal rules (not Class 4/5)', async () => {
      const un1830 = createMaterial(
        '8',
        'UN1830',
        'SULFURIC ACID',
        'N/A'
      );
      const class61 = createMaterial(
        '6.1',
        'UN1541',
        'ACETONE CYANOHYDRIN, STABILIZED',
        'N/A'
      );

      const result = await evaluatePair(un1830, class61);

      // With PG unspecified, Class 6.1 resolves to PG I and is incompatible with Class 8 liquid.
      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
      expect(result.noteCondition).toBeNull();
    });

    test('Class 8 corrosive liquid + Class 7 = Follow normal rules (not Class 4/5)', async () => {
      const un1824 = createMaterial(
        '8',
        'UN1824',
        'SODIUM HYDROXIDE SOLUTION',
        'N/A'
      );
      const class7 = createMaterial(
        '7',
        'UN2912',
        'RADIOACTIVE MATERIAL, LOW SPECIFIC ACTIVITY',
        'N/A'
      );

      const result = await evaluatePair(un1824, class7);

      // Table A18.1: Class 8 + Class 7 = '' (compatible)
      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
      expect(result.noteCondition).toBeNull();
    });

    test('Class 8 corrosive liquid + another Class 8 = Follow normal rules (compatible)', async () => {
      const un1789 = createMaterial(
        '8',
        'UN1789',
        'HYDROCHLORIC ACID',
        'N/A'
      );
      const un1824 = createMaterial(
        '8',
        'UN1824',
        'SODIUM HYDROXIDE SOLUTION',
        'N/A'
      );

      const result = await evaluatePair(un1789, un1824);

      // Table A18.1: Class 8 + Class 8 = '' (compatible)
      // Note 8 only applies to Class 4 and 5
      // Note: This pair will trigger Note 5 check, but neither are nitric acid
      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
    });
  });

  describe('EDGE CASES: Verify specificity and boundary conditions', () => {
    test('UN1789 with itself = Compatible (identical materials)', async () => {
      const un1789a = createMaterial(
        '8',
        'UN1789',
        'HYDROCHLORIC ACID',
        'N/A'
      );
      const un1789b = createMaterial(
        '8',
        'UN1789',
        'HYDROCHLORIC ACID',
        'N/A'
      );

      const result = await evaluatePair(un1789a, un1789b);

      // Identical materials are always compatible
      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Similar UN number UN1051 (in list) vs UN1050 (not in list)', async () => {
      const un1051 = createMaterial(
        '8',
        'UN1051',
        'HYDROGEN CYANIDE, STABILIZED',
        'N/A'
      );
      const un1050 = createMaterial(
        '8',
        'UN1050',
        'HYDROGEN CHLORIDE, ANHYDROUS',
        'N/A'
      );
      const class41 = createMaterial(
        '4.1',
        'UN1325',
        'FLAMMABLE SOLID, ORGANIC, N.O.S.',
        'N/A'
      );

      // UN1051 is NOT in the list, UN1052 is the first in the list
      const result1 = await evaluatePair(un1051, class41);
      expect(result1.noteCondition).toBeNull();

      // UN1050 is also NOT in the list
      const result2 = await evaluatePair(un1050, class41);
      expect(result2.noteCondition).toBeNull();
    });

    test('UN1052 (first in list) triggers Note 8', async () => {
      const un1052 = createMaterial(
        '8',
        'UN1052',
        'HYDROGEN FLUORIDE, ANHYDROUS',
        'N/A'
      );
      const class41 = createMaterial(
        '4.1',
        'UN1325',
        'FLAMMABLE SOLID, ORGANIC, N.O.S.',
        'N/A'
      );

      const result = await evaluatePair(un1052, class41);

      expect(result.requiresSegregation).toBe(true);
      expect(result.noteCondition).toBe('note8');
    });

    test('UN3498 (last in list) triggers Note 8', async () => {
      const un3498 = createMaterial(
        '8',
        'UN3498',
        'IODINE MONOCHLORIDE',
        'N/A'
      );
      const class51 = createMaterial(
        '5.1',
        'UN1479',
        'OXIDIZING SOLID, N.O.S.',
        'N/A'
      );

      const result = await evaluatePair(un3498, class51);

      expect(result.requiresSegregation).toBe(true);
      expect(result.noteCondition).toBe('note8');
    });

    test('Adjacent UN number UN3499 (not in list) does not trigger Note 8', async () => {
      const un3499 = createMaterial(
        '8',
        'UN3499',
        'SOME OTHER MATERIAL',
        'N/A'
      );
      const class41 = createMaterial(
        '4.1',
        'UN1325',
        'FLAMMABLE SOLID, ORGANIC, N.O.S.',
        'N/A'
      );

      const result = await evaluatePair(un3499, class41);

      // UN3499 is not in Note 8 list and does not map to A18.1 8-liquid restrictions.
      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
      expect(result.noteCondition).toBeNull();
    });

    test('Prefix match UN17890 (hypothetical) = Does not apply', async () => {
      const notUN1789 = createMaterial(
        '8',
        'UN17890',
        'SOME OTHER MATERIAL',
        'N/A'
      );
      const class41 = createMaterial(
        '4.1',
        'UN1325',
        'FLAMMABLE SOLID, ORGANIC, N.O.S.',
        'N/A'
      );

      const result = await evaluatePair(notUN1789, class41);

      // Should not match UN1789 (exact matching required)
      expect(result.noteCondition).toBeNull();
    });

    test('Class 4 vs Class 5 - both trigger Note 8 with corrosive liquids', async () => {
      const un1789 = createMaterial(
        '8',
        'UN1789',
        'HYDROCHLORIC ACID',
        'N/A'
      );
      const class41 = createMaterial(
        '4.1',
        'UN1325',
        'FLAMMABLE SOLID, ORGANIC, N.O.S.',
        'N/A'
      );
      const class51 = createMaterial(
        '5.1',
        'UN1479',
        'OXIDIZING SOLID, N.O.S.',
        'N/A'
      );

      const result1 = await evaluatePair(un1789, class41);
      const result2 = await evaluatePair(un1789, class51);

      expect(result1.noteCondition).toBe('note8');
      expect(result2.noteCondition).toBe('note8');
    });

    test('Only Class 4.1 triggers Note 8 (not 4.2/4.3)', async () => {
      const un1789 = createMaterial(
        '8',
        'UN1789',
        'HYDROCHLORIC ACID',
        'N/A'
      );

      const class41 = createMaterial('4.1', 'UN1325', 'FLAMMABLE SOLID', 'N/A');
      const class42 = createMaterial('4.2', 'UN1373', 'FIBERS', 'N/A');
      const class43 = createMaterial('4.3', 'UN1428', 'SODIUM', 'N/A');

      const result1 = await evaluatePair(un1789, class41);
      const result2 = await evaluatePair(un1789, class42);
      const result3 = await evaluatePair(un1789, class43);

      expect(result1.noteCondition).toBe('note8');
      expect(result2.noteCondition).toBeNull();
      expect(result3.noteCondition).toBeNull();
    });

    test('All Class 5 subdivisions (5.1, 5.2) trigger Note 8', async () => {
      const un1830 = createMaterial(
        '8',
        'UN1830',
        'SULFURIC ACID',
        'N/A'
      );

      const class51 = createMaterial('5.1', 'UN1479', 'OXIDIZING SOLID', 'N/A');
      const class52 = createMaterial('5.2', 'UN3109', 'ORGANIC PEROXIDE', 'N/A');

      const result1 = await evaluatePair(un1830, class51);
      const result2 = await evaluatePair(un1830, class52);

      expect(result1.noteCondition).toBe('note8');
      expect(result2.noteCondition).toBe('note8');
    });
  });

  describe('MULTI-MATERIAL SCENARIOS: Note 8 in context of multiple materials', () => {
    test('Corrosive liquid + Class 4.1 + Class 5.1 = Both pairs require segregation', async () => {
      const un1789 = createMaterial(
        '8',
        'UN1789',
        'HYDROCHLORIC ACID',
        'N/A'
      );
      const class41 = createMaterial(
        '4.1',
        'UN1325',
        'FLAMMABLE SOLID, ORGANIC, N.O.S.',
        'N/A'
      );
      const class51 = createMaterial(
        '5.1',
        'UN1479',
        'OXIDIZING SOLID, N.O.S.',
        'N/A'
      );

      const result = await runGraphEngineOptimized([un1789, class41, class51], [], false);

      // Pairs evaluated:
      // 1. UN1789 + Class 4.1 = Segregation (Note 8)
      // 2. UN1789 + Class 5.1 = Segregation (Note 8)
      // 3. Class 4.1 + Class 5.1 = Compatible per Table A18.1
      expect(result.hazmatCompatibilityKeys.length).toBe(0);
      expect(result.segregatedHazmatMaterials.length).toBe(2);

      // Verify both segregation pairs involve UN1789
      const segregatedPairs = result.segregatedHazmatMaterials;
      expect(segregatedPairs.every(pair => pair.noteCondition === 'note8')).toBe(true);
      expect(segregatedPairs.every(pair =>
        pair.hazmatObjectPair.some(m => m.unid === 'UN1789')
      )).toBe(true);
    });

    test('Two corrosive liquids + Class 4.1 = Both pairs require segregation', async () => {
      const un1789 = createMaterial(
        '8',
        'UN1789',
        'HYDROCHLORIC ACID',
        'N/A'
      );
      const un1830 = createMaterial(
        '8',
        'UN1830',
        'SULFURIC ACID',
        'N/A'
      );
      const class41 = createMaterial(
        '4.1',
        'UN1325',
        'FLAMMABLE SOLID, ORGANIC, N.O.S.',
        'N/A'
      );

      const result = await runGraphEngineOptimized([un1789, un1830, class41], [], false);

      // Pairs evaluated:
      // 1. UN1789 + UN1830 = Compatible (Class 8 + Class 8)
      // 2. UN1789 + Class 4.1 = Segregation (Note 8)
      // 3. UN1830 + Class 4.1 = Segregation (Note 8)
      expect(result.hazmatCompatibilityKeys.length).toBe(0);
      expect(result.segregatedHazmatMaterials.length).toBe(2);

      const segregatedPairs = result.segregatedHazmatMaterials;
      expect(segregatedPairs.every(pair => pair.noteCondition === 'note8')).toBe(true);
      expect(segregatedPairs.every(pair =>
        pair.hazmatObjectPair.some(m => m.unid === 'UN1325')
      )).toBe(true);
    });

    test('Corrosive liquid + non-corrosive Class 8 + Class 4.1 = Mixed results', async () => {
      const un1789 = createMaterial(
        '8',
        'UN1789',
        'HYDROCHLORIC ACID',
        'N/A'
      );
      const un2794 = createMaterial(
        '8',
        'UN2794',
        'BATTERIES, WET, FILLED WITH ACID',
        'N/A'
      );
      const class41 = createMaterial(
        '4.1',
        'UN1325',
        'FLAMMABLE SOLID, ORGANIC, N.O.S.',
        'N/A'
      );

      const result = await runGraphEngineOptimized([un1789, un2794, class41], [], false);

      // Pairs evaluated:
      // 1. UN1789 + UN2794 = Compatible (both Class 8)
      // 2. UN1789 + Class 4.1 = Segregation (Note 8)
      // 3. UN2794 + Class 4.1 = Compatible (non-liquid Class 8)
      expect(result.hazmatCompatibilityKeys.length).toBe(0);
      expect(result.segregatedHazmatMaterials.length).toBe(1);

      // Verify segregation is for corrosive liquid
      const segregationPair = result.segregatedHazmatMaterials[0];
      expect(segregationPair.noteCondition).toBe('note8');
      expect(segregationPair.hazmatObjectPair.some(m => m.unid === 'UN1789')).toBe(true);

      // Non-corrosive Class 8 pair stays compatible, so no incompatible pairs are expected.
    });

    test('Corrosive liquid + Class 4.1 + Class 3 = Note 8 and incompatibility', async () => {
      const un1789 = createMaterial(
        '8',
        'UN1789',
        'HYDROCHLORIC ACID',
        'N/A'
      );
      const class41 = createMaterial(
        '4.1',
        'UN1325',
        'FLAMMABLE SOLID, ORGANIC, N.O.S.',
        'N/A'
      );
      const class3 = createMaterial(
        '3',
        'UN1090',
        'ACETONE',
        'N/A'
      );

      const result = await runGraphEngineOptimized([un1789, class41, class3], [], false);

      // Pairs evaluated:
      // 1. UN1789 + Class 4.1 = Segregation (Note 8)
      // 2. UN1789 + Class 3 = Compatible
      // 3. Class 4.1 + Class 3 = Segregation (base table).
      expect(result.hazmatCompatibilityKeys.length).toBe(0);
      expect(result.segregatedHazmatMaterials.length).toBe(2);

      expect(result.segregatedHazmatMaterials.some(pair => pair.noteCondition === 'note8')).toBe(true);
    });

    test('Multiple corrosive liquids with multiple Class 4 and 5 materials', async () => {
      const un1789 = createMaterial('8', 'UN1789', 'HYDROCHLORIC ACID', 'N/A');
      const un1830 = createMaterial('8', 'UN1830', 'SULFURIC ACID', 'N/A');
      const class41 = createMaterial('4.1', 'UN1325', 'FLAMMABLE SOLID', 'N/A');
      const class51 = createMaterial('5.1', 'UN1479', 'OXIDIZING SOLID', 'N/A');

      const result = await runGraphEngineOptimized([un1789, un1830, class41, class51], [], false);

      // Total pairs: 6
      // UN1789 + UN1830 = Compatible (both Class 8)
      // UN1789 + Class 4.1 = Segregation (Note 8)
      // UN1789 + Class 5.1 = Segregation (Note 8)
      // UN1830 + Class 4.1 = Segregation (Note 8)
      // UN1830 + Class 5.1 = Segregation (Note 8)
      // Class 4.1 + Class 5.1 = Compatible
      expect(result.hazmatCompatibilityKeys.length).toBe(0);
      expect(result.segregatedHazmatMaterials.length).toBe(4);
      expect(result.segregatedHazmatMaterials.every(pair => pair.noteCondition === 'note8')).toBe(true);
    });
  });

  describe('VERIFICATION: Confirm Note 8 is adding segregation requirement', () => {
    test('Baseline: Non-corrosive Class 8 + Class 4.1 = Incompatible (no segregation)', async () => {
      const class8NotInList = createMaterial(
        '8',
        'UN2794',
        'BATTERIES, WET, FILLED WITH ACID',
        'N/A'
      );
      const class41 = createMaterial(
        '4.1',
        'UN1325',
        'FLAMMABLE SOLID, ORGANIC, N.O.S.',
        'N/A'
      );

      const result = await evaluatePair(class8NotInList, class41);

      // Verify baseline: without Note 8, this pair is compatible (non-liquid Class 8).
      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Exception: Corrosive liquid (Class 8) + Class 4.1 = Segregation required', async () => {
      const un1789 = createMaterial(
        '8',
        'UN1789',
        'HYDROCHLORIC ACID',
        'N/A'
      );
      const class41 = createMaterial(
        '4.1',
        'UN1325',
        'FLAMMABLE SOLID, ORGANIC, N.O.S.',
        'N/A'
      );

      const result = await evaluatePair(un1789, class41);

      // Verify exception: With corrosive liquid, segregation is required (not incompatible)
      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(true);
      expect(result.noteCondition).toBe('note8');
    });

    test('Baseline: Non-corrosive Class 8 + Class 5.1 = Compatible', async () => {
      const class8NotInList = createMaterial(
        '8',
        'UN3028',
        'BATTERIES, DRY, CONTAINING POTASSIUM HYDROXIDE SOLID',
        'N/A'
      );
      const class51 = createMaterial(
        '5.1',
        'UN1479',
        'OXIDIZING SOLID, N.O.S.',
        'N/A'
      );

      const result = await evaluatePair(class8NotInList, class51);

      // Verify baseline: Class 8 + Class 5.1 = compatible
      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Exception: Corrosive liquid (Class 8) + Class 5.1 = Segregation required', async () => {
      const un1830 = createMaterial(
        '8',
        'UN1830',
        'SULFURIC ACID',
        'N/A'
      );
      const class51 = createMaterial(
        '5.1',
        'UN1479',
        'OXIDIZING SOLID, N.O.S.',
        'N/A'
      );

      const result = await evaluatePair(un1830, class51);

      // Verify exception: With corrosive liquid, segregation is required
      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(true);
      expect(result.noteCondition).toBe('note8');
    });
  });

  describe('NOTE CONDITION PAIRS: Verify noteConditionPairs tracking', () => {
    test('Note 8 pair should appear in noteConditionPairs array', async () => {
      const un1789 = createMaterial(
        '8',
        'UN1789',
        'HYDROCHLORIC ACID',
        'N/A'
      );
      const class41 = createMaterial(
        '4.1',
        'UN1325',
        'FLAMMABLE SOLID, ORGANIC, N.O.S.',
        'N/A'
      );

      const result = await evaluatePair(un1789, class41);

      expect(result.noteConditionPairs.length).toBe(1);
      expect(result.noteConditionPairs[0].noteCondition).toBe('note8');
      expect(result.noteConditionPairs[0].noteContent).toContain('corrosive liquids');
      expect(result.noteConditionPairs[0].noteContent).toContain('Class 4');
      expect(result.noteConditionPairs[0].noteContent).toContain('above or adjacent');
      expect(result.noteConditionPairs[0].status).toBe('segregation');
    });

    test('Note 8 with Class 5 should mention Class 5 in content', async () => {
      const un1830 = createMaterial(
        '8',
        'UN1830',
        'SULFURIC ACID',
        'N/A'
      );
      const class51 = createMaterial(
        '5.1',
        'UN1479',
        'OXIDIZING SOLID, N.O.S.',
        'N/A'
      );

      const result = await evaluatePair(un1830, class51);

      const notePair = result.noteConditionPairs[0];
      expect(notePair.noteContent).toContain('Class 8 corrosive liquids');
      expect(notePair.noteContent).toContain('Class 5');
      expect(notePair.noteContent).toContain('oxidizing');
    });

    test('Note 8 content should be descriptive and accurate', async () => {
      const un1789 = createMaterial(
        '8',
        'UN1789',
        'HYDROCHLORIC ACID',
        'N/A'
      );
      const class41 = createMaterial(
        '4.1',
        'UN1325',
        'FLAMMABLE SOLID, ORGANIC, N.O.S.',
        'N/A'
      );

      const result = await evaluatePair(un1789, class41);

      const notePair = result.noteConditionPairs[0];
      expect(notePair.noteContent).toContain('may not be loaded above or adjacent');
      expect(notePair.noteContent).toContain('flammable solid');
    });
  });

  describe('INTERACTION WITH OTHER NOTES: Note 8 priority and combinations', () => {
    test('Nitric acid (in both Note 5 and Note 8 lists) + Class 5.1 = Note 8 applies', async () => {
      const un2031 = createMaterial(
        '8',
        'UN2031',
        'NITRIC ACID',
        'N/A'
      );
      const class51 = createMaterial(
        '5.1',
        'UN1479',
        'OXIDIZING SOLID, N.O.S.',
        'N/A'
      );

      const result = await evaluatePair(un2031, class51);

      // UN2031 is in both Note 5 (nitric acid) and Note 8 (corrosive liquid) lists
      // When paired with Class 5.1, Note 8 should apply (checked before Note 5)
      expect(result.requiresSegregation).toBe(true);
      expect(result.noteCondition).toBe('note8');
    });

    test('Nitric acid + another Class 8 = Note 5 applies (not Note 8)', async () => {
      const un2031 = createMaterial(
        '8',
        'UN2031',
        'NITRIC ACID',
        'N/A'
      );
      const otherClass8 = createMaterial(
        '8',
        'UN1789',
        'HYDROCHLORIC ACID',
        'N/A'
      );

      const result = await evaluatePair(un2031, otherClass8);

      // UN2031 with another Class 8 triggers Note 5, not Note 8
      expect(result.requiresSegregation).toBe(true);
      expect(result.noteCondition).toBe('note5');
    });
  });
});
