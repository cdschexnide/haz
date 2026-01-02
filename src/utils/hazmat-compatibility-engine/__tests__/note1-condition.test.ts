import { runGraphEngineOptimized, clearCache } from '../optimizedEngine';
import { COMPATIBILITY_GROUPS, HazmatCompatibilityKey } from '../engineTypes';

/**
 * Test suite for Note 1 Condition (AFMAN 24-604 Table A18.1 Note 1)
 *
 * Note 1: UN2067 (Ammonium nitrate fertilizer, Class 5.1) may be loaded
 * with Class 1.1 or 1.5 materials, overriding normal incompatibility.
 *
 * Background: According to Table A18.1, Class 5.1 + Class 1.1 = 'X' (incompatible)
 * and Class 5.1 + Class 1.5 = 'X' (incompatible). However, Note 1 creates an
 * exception specifically for UN2067.
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
  };
}

describe('Note 1 Condition: UN2067 with Class 1.1 and 1.5', () => {
  beforeEach(() => {
    clearCache();
  });

  describe('POSITIVE TESTS: Note 1 applies and overrides incompatibility', () => {
    test('UN2067 (Class 5.1) + Class 1.1 = Compatible (Note 1 exception)', async () => {
      const un2067 = createMaterial(
        '5.1',
        'UN2067',
        'AMMONIUM NITRATE BASED FERTILIZER',
        'N/A'
      );
      const class11 = createMaterial(
        '1.1',
        'UN0004',
        'AMMONIUM PICRATE',
        'D'
      );

      const result = await evaluatePair(un2067, class11);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
      expect(result.segregationMessage).toBe('N/A');
      // Note: noteCondition is not returned for incompatible pairs, only segregation pairs
    });

    test('UN2067 (Class 5.1) + Class 1.5 = Compatible (Note 1 exception)', async () => {
      const un2067 = createMaterial(
        '5.1',
        'UN2067',
        'AMMONIUM NITRATE BASED FERTILIZER',
        'N/A'
      );
      const class15 = createMaterial(
        '1.5',
        'UN0331',
        'EXPLOSIVES, BLASTING, TYPE B',
        'D'
      );

      const result = await evaluatePair(un2067, class15);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
      expect(result.segregationMessage).toBe('N/A');
    });

    test('Class 1.1 + UN2067 (Class 5.1) = Compatible (bidirectional check)', async () => {
      const class11 = createMaterial(
        '1.1',
        'UN0027',
        'BLACK POWDER, GUNPOWDER',
        'D'
      );
      const un2067 = createMaterial(
        '5.1',
        'UN2067',
        'AMMONIUM NITRATE BASED FERTILIZER',
        'N/A'
      );

      const result = await evaluatePair(class11, un2067);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.5 + UN2067 (Class 5.1) = Compatible (bidirectional check)', async () => {
      const class15 = createMaterial(
        '1.5',
        'UN0331',
        'EXPLOSIVES, BLASTING, TYPE B',
        'D'
      );
      const un2067 = createMaterial(
        '5.1',
        'UN2067',
        'AMMONIUM NITRATE BASED FERTILIZER',
        'N/A'
      );

      const result = await evaluatePair(class15, un2067);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
    });

    test('UN2067 with multiple Class 1.1 materials (verify exception works for different 1.1 items)', async () => {
      const un2067 = createMaterial(
        '5.1',
        'UN2067',
        'AMMONIUM NITRATE BASED FERTILIZER',
        'N/A'
      );
      const class11a = createMaterial(
        '1.1',
        'UN0033',
        'BOMBS',
        'D'
      );

      const result = await evaluatePair(un2067, class11a);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
    });

    test('UN2067 with multiple Class 1.5 materials (verify exception works for different 1.5 items)', async () => {
      const un2067 = createMaterial(
        '5.1',
        'UN2067',
        'AMMONIUM NITRATE BASED FERTILIZER',
        'N/A'
      );
      const class15b = createMaterial(
        '1.5',
        'UN0332',
        'EXPLOSIVES, BLASTING, TYPE E',
        'D'
      );

      const result = await evaluatePair(un2067, class15b);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
    });
  });

  describe('NEGATIVE TESTS: Note 1 does NOT apply - normal rules prevail', () => {
    test('Other Class 5.1 material (NOT UN2067) + Class 1.1 = Incompatible', async () => {
      const otherClass51 = createMaterial(
        '5.1',
        'UN1479',
        'OXIDIZING SOLID, N.O.S.',
        'N/A'
      );
      const class11 = createMaterial(
        '1.1',
        'UN0004',
        'AMMONIUM PICRATE',
        'D'
      );

      const result = await evaluatePair(otherClass51, class11);

      // Without Note 1 exception, Class 5.1 + Class 1.1 = 'X' (incompatible)
      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Other Class 5.1 material (NOT UN2067) + Class 1.5 = Incompatible', async () => {
      const otherClass51 = createMaterial(
        '5.1',
        'UN1479',
        'OXIDIZING SOLID, N.O.S.',
        'N/A'
      );
      const class15 = createMaterial(
        '1.5',
        'UN0331',
        'EXPLOSIVES, BLASTING, TYPE B',
        'D'
      );

      const result = await evaluatePair(otherClass51, class15);

      // Without Note 1 exception, Class 5.1 + Class 1.5 = 'X' (incompatible)
      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
    });

    test('UN2067 (Class 5.1) + Class 1.2 = Follow normal rules (not 1.1 or 1.5)', async () => {
      const un2067 = createMaterial(
        '5.1',
        'UN2067',
        'AMMONIUM NITRATE BASED FERTILIZER',
        'N/A'
      );
      const class12 = createMaterial(
        '1.2',
        'UN0009',
        'AMMUNITION, INCENDIARY',
        'D'
      );

      const result = await evaluatePair(un2067, class12);

      // Note 1 only applies to Class 1.1 and 1.5, not 1.2
      // Class 5.1 + Class 1.2 = 'X' (incompatible) per Table A18.1
      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
    });

    test('UN2067 (Class 5.1) + Class 1.3 = Follow normal rules (not 1.1 or 1.5)', async () => {
      const un2067 = createMaterial(
        '5.1',
        'UN2067',
        'AMMONIUM NITRATE BASED FERTILIZER',
        'N/A'
      );
      const class13 = createMaterial(
        '1.3',
        'UN0010',
        'AMMUNITION, INCENDIARY',
        'G'
      );

      const result = await evaluatePair(un2067, class13);

      // Note 1 only applies to Class 1.1 and 1.5, not 1.3
      // Class 5.1 + Class 1.3 = 'X' (incompatible) per Table A18.1
      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
    });

    test('UN2067 (Class 5.1) + Class 1.4 = Follow normal rules (compatible)', async () => {
      const un2067 = createMaterial(
        '5.1',
        'UN2067',
        'AMMONIUM NITRATE BASED FERTILIZER',
        'N/A'
      );
      const class14 = createMaterial(
        '1.4',
        'UN0297',
        'AMMUNITION, ILLUMINATING',
        'S'
      );

      const result = await evaluatePair(un2067, class14);

      // Class 5.1 + Class 1.4 = '' (compatible) per Table A18.1
      // Note 1 doesn't apply, but they're compatible anyway
      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
    });

    test('UN2067 (Class 5.1) + Class 2.1 = Follow normal rules', async () => {
      const un2067 = createMaterial(
        '5.1',
        'UN2067',
        'AMMONIUM NITRATE BASED FERTILIZER',
        'N/A'
      );
      const class21 = createMaterial(
        '2.1',
        'UN1011',
        'BUTANE',
        'N/A'
      );

      const result = await evaluatePair(un2067, class21);

      // Class 5.1 + Class 2.1 = '0' (segregation required) per Table A18.1
      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(true);
      expect(result.segregationMessage).toBe('88 Inches of Separation');
    });

    test('UN2067 (Class 5.1) + Class 3 = Follow normal rules', async () => {
      const un2067 = createMaterial(
        '5.1',
        'UN2067',
        'AMMONIUM NITRATE BASED FERTILIZER',
        'N/A'
      );
      const class3 = createMaterial(
        '3',
        'UN1090',
        'ACETONE',
        'N/A'
      );

      const result = await evaluatePair(un2067, class3);

      // Class 5.1 + Class 3 = '' (compatible) per Table A18.1
      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
    });

    test('UN2067 (Class 5.1) + Class 6.1 = Follow normal rules (incompatible)', async () => {
      const un2067 = createMaterial(
        '5.1',
        'UN2067',
        'AMMONIUM NITRATE BASED FERTILIZER',
        'N/A'
      );
      const class61 = createMaterial(
        '6.1',
        'UN1541',
        'ACETONE CYANOHYDRIN, STABILIZED',
        'N/A'
      );

      const result = await evaluatePair(un2067, class61);

      // Class 5.1 + Class 6.1 = 'X' (incompatible) per Table A18.1
      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
    });
  });

  describe('EDGE CASES: Verify specificity and boundary conditions', () => {
    test('UN2067 with itself = Compatible (identical materials)', async () => {
      const un2067a = createMaterial(
        '5.1',
        'UN2067',
        'AMMONIUM NITRATE BASED FERTILIZER',
        'N/A'
      );
      const un2067b = createMaterial(
        '5.1',
        'UN2067',
        'AMMONIUM NITRATE BASED FERTILIZER',
        'N/A'
      );

      const result = await evaluatePair(un2067a, un2067b);

      // Identical materials are always compatible
      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
    });

    test('UN2067 with different compatibility groups for Class 1.1', async () => {
      const un2067 = createMaterial(
        '5.1',
        'UN2067',
        'AMMONIUM NITRATE BASED FERTILIZER',
        'N/A'
      );
      const class11GroupA = createMaterial(
        '1.1',
        'UN0473',
        'SUBSTANCES, EXPLOSIVE, N.O.S.',
        'A'
      );

      const result = await evaluatePair(un2067, class11GroupA);

      // Note 1 should apply regardless of compatibility group
      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Similar UN number UN2068 (NOT UN2067) + Class 1.1 = Incompatible', async () => {
      const un2068 = createMaterial(
        '5.1',
        'UN2068',
        'AMMONIUM NITRATE BASED FERTILIZER',
        'N/A'
      );
      const class11 = createMaterial(
        '1.1',
        'UN0004',
        'AMMONIUM PICRATE',
        'D'
      );

      const result = await evaluatePair(un2068, class11);

      // Note 1 only applies to UN2067, not similar UN numbers
      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
    });

    test('UN2067 prefix but different number (UN20670) = Does not apply', async () => {
      // This is a hypothetical test to ensure exact matching
      const notUN2067 = createMaterial(
        '5.1',
        'UN20670',
        'SOME OTHER MATERIAL',
        'N/A'
      );
      const class11 = createMaterial(
        '1.1',
        'UN0004',
        'AMMONIUM PICRATE',
        'D'
      );

      const result = await evaluatePair(notUN2067, class11);

      // Should not match UN2067
      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
    });
  });

  describe('MULTI-MATERIAL SCENARIOS: Note 1 in context of multiple materials', () => {
    test('UN2067 + Class 1.1 + Class 1.5 = All compatible due to Note 1', async () => {
      const un2067 = createMaterial(
        '5.1',
        'UN2067',
        'AMMONIUM NITRATE BASED FERTILIZER',
        'N/A'
      );
      const class11 = createMaterial(
        '1.1',
        'UN0004',
        'AMMONIUM PICRATE',
        'D'
      );
      const class15 = createMaterial(
        '1.5',
        'UN0331',
        'EXPLOSIVES, BLASTING, TYPE B',
        'D'
      );

      const result = await runGraphEngineOptimized([un2067, class11, class15], [], false);

      // UN2067 should be compatible with both Class 1.1 and 1.5
      // Class 1.1 and 1.5 are compatible with each other per Table A18.1
      expect(result.hazmatCompatibilityKeys.length).toBe(0);
      expect(result.segregatedHazmatMaterials.length).toBe(0);
    });

    test('UN2067 + Class 1.1 + Other Class 5.1 = Other 5.1 incompatible with 1.1', async () => {
      const un2067 = createMaterial(
        '5.1',
        'UN2067',
        'AMMONIUM NITRATE BASED FERTILIZER',
        'N/A'
      );
      const class11 = createMaterial(
        '1.1',
        'UN0004',
        'AMMONIUM PICRATE',
        'D'
      );
      const otherClass51 = createMaterial(
        '5.1',
        'UN1479',
        'OXIDIZING SOLID, N.O.S.',
        'N/A'
      );

      const result = await runGraphEngineOptimized([un2067, class11, otherClass51], [], false);

      // UN2067 compatible with Class 1.1 (Note 1)
      // Other Class 5.1 NOT compatible with Class 1.1 (no exception)
      expect(result.hazmatCompatibilityKeys.length).toBe(1);
      // Verify the incompatible pair contains both materials (order may vary)
      const incompatiblePair = result.hazmatCompatibilityKeys[0];
      expect(incompatiblePair).toHaveLength(2);
      expect(incompatiblePair.some(m => m.unid === 'UN1479')).toBe(true);
      expect(incompatiblePair.some(m => m.unid === 'UN0004')).toBe(true);
    });
  });

  describe('VERIFICATION: Confirm Note 1 is actually overriding incompatibility', () => {
    test('Baseline: Class 5.1 (non-UN2067) + Class 1.1 IS incompatible', async () => {
      const class51 = createMaterial(
        '5.1',
        'UN1479',
        'OXIDIZING SOLID, N.O.S.',
        'N/A'
      );
      const class11 = createMaterial(
        '1.1',
        'UN0004',
        'AMMONIUM PICRATE',
        'D'
      );

      const result = await evaluatePair(class51, class11);

      // Verify baseline: without exception, they are incompatible
      expect(result.incompatible).toBe(true);
    });

    test('Exception: UN2067 (Class 5.1) + Class 1.1 IS compatible', async () => {
      const un2067 = createMaterial(
        '5.1',
        'UN2067',
        'AMMONIUM NITRATE BASED FERTILIZER',
        'N/A'
      );
      const class11 = createMaterial(
        '1.1',
        'UN0004',
        'AMMONIUM PICRATE',
        'D'
      );

      const result = await evaluatePair(un2067, class11);

      // Verify exception: with UN2067, they are compatible
      expect(result.incompatible).toBe(false);
    });

    test('Baseline: Class 5.1 (non-UN2067) + Class 1.5 IS incompatible', async () => {
      const class51 = createMaterial(
        '5.1',
        'UN1479',
        'OXIDIZING SOLID, N.O.S.',
        'N/A'
      );
      const class15 = createMaterial(
        '1.5',
        'UN0331',
        'EXPLOSIVES, BLASTING, TYPE B',
        'D'
      );

      const result = await evaluatePair(class51, class15);

      // Verify baseline: without exception, they are incompatible
      expect(result.incompatible).toBe(true);
    });

    test('Exception: UN2067 (Class 5.1) + Class 1.5 IS compatible', async () => {
      const un2067 = createMaterial(
        '5.1',
        'UN2067',
        'AMMONIUM NITRATE BASED FERTILIZER',
        'N/A'
      );
      const class15 = createMaterial(
        '1.5',
        'UN0331',
        'EXPLOSIVES, BLASTING, TYPE B',
        'D'
      );

      const result = await evaluatePair(un2067, class15);

      // Verify exception: with UN2067, they are compatible
      expect(result.incompatible).toBe(false);
    });
  });
});
