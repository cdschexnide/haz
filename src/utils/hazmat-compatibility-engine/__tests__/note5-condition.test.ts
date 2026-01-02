import { runGraphEngineOptimized, clearCache } from '../optimizedEngine';
import { COMPATIBILITY_GROUPS, HazmatCompatibilityKey } from '../engineTypes';

/**
 * Test suite for Note 5 Condition (AFMAN 24-604 Table A18.1 Note 5)
 *
 * Note 5: Nitric acid in carboys (UN1796, UN1826, UN2031, UN2032) requires
 * 88 inches (2.2 m) segregation in all directions from other Class 8
 * corrosive materials in carboys when loaded on the same aircraft.
 *
 * Background: According to Table A18.1, Class 8 + Class 8 = '' (compatible, no restrictions).
 * However, Note 5 creates a segregation requirement specifically for nitric acid in carboys
 * when paired with other Class 8 materials.
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

describe('Note 5 Condition: Nitric acid in carboys segregation from other Class 8', () => {
  beforeEach(() => {
    clearCache();
  });

  describe('POSITIVE TESTS: Note 5 applies and requires segregation', () => {
    test('UN1796 (Nitric acid) + other Class 8 = Segregation required (Note 5)', async () => {
      const un1796 = createMaterial(
        '8',
        'UN1796',
        'NITRATING ACID MIXTURE',
        'N/A'
      );
      const otherClass8 = createMaterial(
        '8',
        'UN1789',
        'HYDROCHLORIC ACID',
        'N/A'
      );

      const result = await evaluatePair(un1796, otherClass8);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(true);
      expect(result.segregationMessage).toContain('nitric acid');
      expect(result.segregationMessage).toContain('88 inches');
      expect(result.segregationMessage).toContain('carboys');
      expect(result.noteCondition).toBe('note5');
    });

    test('UN1826 (Nitric acid) + other Class 8 = Segregation required (Note 5)', async () => {
      const un1826 = createMaterial(
        '8',
        'UN1826',
        'NITRATING ACID MIXTURE, SPENT',
        'N/A'
      );
      const otherClass8 = createMaterial(
        '8',
        'UN1830',
        'SULFURIC ACID',
        'N/A'
      );

      const result = await evaluatePair(un1826, otherClass8);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(true);
      expect(result.segregationMessage).toContain('nitric acid');
      expect(result.noteCondition).toBe('note5');
    });

    test('UN2031 (Nitric acid) + other Class 8 = Segregation required (Note 5)', async () => {
      const un2031 = createMaterial(
        '8',
        'UN2031',
        'NITRIC ACID',
        'N/A'
      );
      const otherClass8 = createMaterial(
        '8',
        'UN2790',
        'ACETIC ACID SOLUTION',
        'N/A'
      );

      const result = await evaluatePair(un2031, otherClass8);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(true);
      expect(result.segregationMessage).toContain('nitric acid');
      expect(result.noteCondition).toBe('note5');
    });

    test('UN2032 (Nitric acid) + other Class 8 = Segregation required (Note 5)', async () => {
      const un2032 = createMaterial(
        '8',
        'UN2032',
        'NITRIC ACID, RED FUMING',
        'N/A'
      );
      const otherClass8 = createMaterial(
        '8',
        'UN1824',
        'SODIUM HYDROXIDE SOLUTION',
        'N/A'
      );

      const result = await evaluatePair(un2032, otherClass8);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(true);
      expect(result.segregationMessage).toContain('nitric acid');
      expect(result.noteCondition).toBe('note5');
    });

    test('Bidirectional: Other Class 8 + UN1796 (Nitric acid) = Segregation required', async () => {
      const otherClass8 = createMaterial(
        '8',
        'UN1789',
        'HYDROCHLORIC ACID',
        'N/A'
      );
      const un1796 = createMaterial(
        '8',
        'UN1796',
        'NITRATING ACID MIXTURE',
        'N/A'
      );

      const result = await evaluatePair(otherClass8, un1796);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(true);
      expect(result.noteCondition).toBe('note5');
    });

    test('Bidirectional: Other Class 8 + UN2031 (Nitric acid) = Segregation required', async () => {
      const otherClass8 = createMaterial(
        '8',
        'UN1824',
        'SODIUM HYDROXIDE SOLUTION',
        'N/A'
      );
      const un2031 = createMaterial(
        '8',
        'UN2031',
        'NITRIC ACID',
        'N/A'
      );

      const result = await evaluatePair(otherClass8, un2031);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(true);
      expect(result.noteCondition).toBe('note5');
    });

    test('All four nitric acid UNs should trigger Note 5 with same Class 8 material', async () => {
      const nitricAcidUNs = ['UN1796', 'UN1826', 'UN2031', 'UN2032'];
      const otherClass8 = createMaterial(
        '8',
        'UN1789',
        'HYDROCHLORIC ACID',
        'N/A'
      );

      for (const unid of nitricAcidUNs) {
        const nitricAcid = createMaterial(
          '8',
          unid,
          'NITRIC ACID',
          'N/A'
        );

        const result = await evaluatePair(nitricAcid, otherClass8);

        expect(result.incompatible).toBe(false);
        expect(result.requiresSegregation).toBe(true);
        expect(result.noteCondition).toBe('note5');
      }
    });

    test('Nitric acid with different Class 8 materials (verify works with various Class 8)', async () => {
      const un2031 = createMaterial(
        '8',
        'UN2031',
        'NITRIC ACID',
        'N/A'
      );

      const otherClass8Materials = [
        createMaterial('8', 'UN1789', 'HYDROCHLORIC ACID', 'N/A'),
        createMaterial('8', 'UN1824', 'SODIUM HYDROXIDE SOLUTION', 'N/A'),
        createMaterial('8', 'UN1830', 'SULFURIC ACID', 'N/A'),
        createMaterial('8', 'UN2790', 'ACETIC ACID SOLUTION', 'N/A'),
        createMaterial('8', 'UN1805', 'PHOSPHORIC ACID SOLUTION', 'N/A'),
      ];

      for (const otherClass8 of otherClass8Materials) {
        const result = await evaluatePair(un2031, otherClass8);

        expect(result.incompatible).toBe(false);
        expect(result.requiresSegregation).toBe(true);
        expect(result.noteCondition).toBe('note5');
      }
    });
  });

  describe('NEGATIVE TESTS: Note 5 does NOT apply - normal rules prevail', () => {
    test('Nitric acid (UN2031) + non-Class 8 material = Follow normal Table A18.1 rules', async () => {
      const un2031 = createMaterial(
        '8',
        'UN2031',
        'NITRIC ACID',
        'N/A'
      );
      const class3 = createMaterial(
        '3',
        'UN1090',
        'ACETONE',
        'N/A'
      );

      const result = await evaluatePair(un2031, class3);

      // Table A18.1: Class 8 + Class 3 = 'X' (incompatible)
      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
      expect(result.noteCondition).toBeNull();
    });

    test('Nitric acid (UN2031) + Class 2.1 = Incompatible (not Class 8)', async () => {
      const un2031 = createMaterial(
        '8',
        'UN2031',
        'NITRIC ACID',
        'N/A'
      );
      const class21 = createMaterial(
        '2.1',
        'UN1011',
        'BUTANE',
        'N/A'
      );

      const result = await evaluatePair(un2031, class21);

      // Table A18.1: Class 8 + Class 2.1 = '0' (segregation required)
      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(true);
      expect(result.segregationMessage).toBe('88 Inches of Separation');
      expect(result.noteCondition).toBeNull();
    });

    test('Nitric acid (UN1796) + Class 1.1 = Incompatible (not Class 8)', async () => {
      const un1796 = createMaterial(
        '8',
        'UN1796',
        'NITRATING ACID MIXTURE',
        'N/A'
      );
      const class11 = createMaterial(
        '1.1',
        'UN0004',
        'AMMONIUM PICRATE',
        'D'
      );

      const result = await evaluatePair(un1796, class11);

      // Table A18.1: Class 8 + Class 1.1 = 'X' (incompatible)
      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
      expect(result.noteCondition).toBeNull();
    });

    test('Other Class 8 material (NOT nitric acid) + Class 8 = Compatible (no Note 5)', async () => {
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

      const result = await evaluatePair(class8a, class8b);

      // Without Note 5, Class 8 + Class 8 = '' (compatible, no restrictions)
      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
      expect(result.segregationMessage).toBe('N/A');
      expect(result.noteCondition).toBeNull();
    });

    test('Nitric acid (UN2031) + Class 5.1 = Segregation required (Note 8, not Note 5)', async () => {
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

      // UN2031 is in the Note 8 corrosive liquids list
      // Note 8: Class 8 corrosive liquids require segregation from Class 5 materials
      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(true);
      expect(result.noteCondition).toBe('note8');
    });

    test('Nitric acid (UN1826) + Class 7 = Compatible (not Class 8)', async () => {
      const un1826 = createMaterial(
        '8',
        'UN1826',
        'NITRATING ACID MIXTURE, SPENT',
        'N/A'
      );
      const class7 = createMaterial(
        '7',
        'UN2912',
        'RADIOACTIVE MATERIAL, LOW SPECIFIC ACTIVITY',
        'N/A'
      );

      const result = await evaluatePair(un1826, class7);

      // Table A18.1: Class 8 + Class 7 = '' (compatible)
      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
      expect(result.noteCondition).toBeNull();
    });

    test('Nitric acid (UN2032) + Class 4.1 = Segregation required (Note 8, not Note 5)', async () => {
      const un2032 = createMaterial(
        '8',
        'UN2032',
        'NITRIC ACID, RED FUMING',
        'N/A'
      );
      const class41 = createMaterial(
        '4.1',
        'UN1325',
        'FLAMMABLE SOLID, ORGANIC, N.O.S.',
        'N/A'
      );

      const result = await evaluatePair(un2032, class41);

      // UN2032 is in the Note 8 corrosive liquids list
      // Note 8: Class 8 corrosive liquids require segregation from Class 4 materials
      // Note 8 is checked BEFORE Table A18.1 lookup, so segregation overrides incompatibility
      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(true);
      expect(result.noteCondition).toBe('note8');
    });
  });

  describe('EDGE CASES: Verify specificity and boundary conditions', () => {
    test('UN2031 with itself = Compatible (identical materials)', async () => {
      const un2031a = createMaterial(
        '8',
        'UN2031',
        'NITRIC ACID',
        'N/A'
      );
      const un2031b = createMaterial(
        '8',
        'UN2031',
        'NITRIC ACID',
        'N/A'
      );

      const result = await evaluatePair(un2031a, un2031b);

      // Identical materials are always compatible
      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Two different nitric acid UNs together = Note 5 applies', async () => {
      const un1796 = createMaterial(
        '8',
        'UN1796',
        'NITRATING ACID MIXTURE',
        'N/A'
      );
      const un2031 = createMaterial(
        '8',
        'UN2031',
        'NITRIC ACID',
        'N/A'
      );

      const result = await evaluatePair(un1796, un2031);

      // Both are nitric acid in carboys, both are Class 8
      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(true);
      expect(result.noteCondition).toBe('note5');
    });

    test('Similar UN number UN1795 (NOT in nitric acid list) + Class 8 = No Note 5', async () => {
      const un1795 = createMaterial(
        '8',
        'UN1795',
        'SOME OTHER ACID',
        'N/A'
      );
      const otherClass8 = createMaterial(
        '8',
        'UN1789',
        'HYDROCHLORIC ACID',
        'N/A'
      );

      const result = await evaluatePair(un1795, otherClass8);

      // UN1795 is adjacent to UN1796 but not in the list
      // Class 8 + Class 8 = '' (compatible, no segregation)
      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
      expect(result.noteCondition).toBeNull();
    });

    test('Similar UN number UN2030 (NOT in nitric acid list) + Class 8 = No Note 5', async () => {
      const un2030 = createMaterial(
        '8',
        'UN2030',
        'SOME OTHER ACID',
        'N/A'
      );
      const otherClass8 = createMaterial(
        '8',
        'UN1824',
        'SODIUM HYDROXIDE SOLUTION',
        'N/A'
      );

      const result = await evaluatePair(un2030, otherClass8);

      // UN2030 is adjacent to UN2031 but not in the list
      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
      expect(result.noteCondition).toBeNull();
    });

    test('Similar UN number UN2033 (NOT in nitric acid list) + Class 8 = No Note 5', async () => {
      const un2033 = createMaterial(
        '8',
        'UN2033',
        'SOME OTHER ACID',
        'N/A'
      );
      const otherClass8 = createMaterial(
        '8',
        'UN1830',
        'SULFURIC ACID',
        'N/A'
      );

      const result = await evaluatePair(un2033, otherClass8);

      // UN2033 is adjacent to UN2032 but not in the list
      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
      expect(result.noteCondition).toBeNull();
    });

    test('Prefix match UN17960 (hypothetical) = Does not apply', async () => {
      const notUN1796 = createMaterial(
        '8',
        'UN17960',
        'SOME OTHER MATERIAL',
        'N/A'
      );
      const otherClass8 = createMaterial(
        '8',
        'UN1789',
        'HYDROCHLORIC ACID',
        'N/A'
      );

      const result = await evaluatePair(notUN1796, otherClass8);

      // Should not match UN1796 (exact matching required)
      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
      expect(result.noteCondition).toBeNull();
    });
  });

  describe('MULTI-MATERIAL SCENARIOS: Note 5 in context of multiple materials', () => {
    test('UN2031 + two other Class 8 materials = Both pairs require segregation', async () => {
      const un2031 = createMaterial(
        '8',
        'UN2031',
        'NITRIC ACID',
        'N/A'
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

      const result = await runGraphEngineOptimized([un2031, class8a, class8b], [], false);

      // Pairs evaluated:
      // 1. UN2031 + UN1789 = Segregation (Note 5)
      // 2. UN2031 + UN1824 = Segregation (Note 5)
      // 3. UN1789 + UN1824 = Compatible (normal Class 8 + Class 8)
      expect(result.hazmatCompatibilityKeys.length).toBe(0);
      expect(result.segregatedHazmatMaterials.length).toBe(2);

      // Verify both segregation pairs involve UN2031
      const segregatedPairs = result.segregatedHazmatMaterials;
      expect(segregatedPairs.every(pair => pair.noteCondition === 'note5')).toBe(true);
      expect(segregatedPairs.every(pair =>
        pair.hazmatObjectPair.some(m => m.unid === 'UN2031')
      )).toBe(true);
    });

    test('Two nitric acid UNs + one other Class 8 = All pairs require segregation', async () => {
      const un1796 = createMaterial(
        '8',
        'UN1796',
        'NITRATING ACID MIXTURE',
        'N/A'
      );
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

      const result = await runGraphEngineOptimized([un1796, un2031, otherClass8], [], false);

      // All three pairs require segregation:
      // 1. UN1796 + UN2031 = Segregation (Note 5)
      // 2. UN1796 + UN1789 = Segregation (Note 5)
      // 3. UN2031 + UN1789 = Segregation (Note 5)
      expect(result.hazmatCompatibilityKeys.length).toBe(0);
      expect(result.segregatedHazmatMaterials.length).toBe(3);
      expect(result.segregatedHazmatMaterials.every(pair => pair.noteCondition === 'note5')).toBe(true);
    });

    test('Nitric acid + Class 8 + incompatible Class 3 = Mixed results', async () => {
      const un2031 = createMaterial(
        '8',
        'UN2031',
        'NITRIC ACID',
        'N/A'
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

      const result = await runGraphEngineOptimized([un2031, class8, class3], [], false);

      // Pairs evaluated:
      // 1. UN2031 + UN1789 = Segregation (Note 5)
      // 2. UN2031 + UN1090 = Incompatible (Class 8 + 3 = 'X')
      // 3. UN1789 + UN1090 = Incompatible (Class 8 + 3 = 'X')
      expect(result.hazmatCompatibilityKeys.length).toBe(2);
      expect(result.segregatedHazmatMaterials.length).toBe(1);

      // Verify segregation pair is the nitric acid + other Class 8
      const segregationPair = result.segregatedHazmatMaterials[0];
      expect(segregationPair.noteCondition).toBe('note5');
      expect(segregationPair.hazmatObjectPair.some(m => m.unid === 'UN2031')).toBe(true);
      expect(segregationPair.hazmatObjectPair.some(m => m.unid === 'UN1789')).toBe(true);
    });

    test('Nitric acid + multiple non-Class 8 materials = Note 5 does not apply (but Note 8 may)', async () => {
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
      const class7 = createMaterial(
        '7',
        'UN2912',
        'RADIOACTIVE MATERIAL',
        'N/A'
      );

      const result = await runGraphEngineOptimized([un2031, class51, class7], [], false);

      // Pairs evaluated:
      // 1. UN2031 + Class 5.1 = Segregation required (Note 8, not Note 5)
      // 2. UN2031 + Class 7 = Compatible
      // 3. Class 5.1 + Class 7 = Compatible
      expect(result.hazmatCompatibilityKeys.length).toBe(0);
      expect(result.segregatedHazmatMaterials.length).toBe(1);

      // Verify the segregation is due to Note 8, not Note 5
      expect(result.segregatedHazmatMaterials[0].noteCondition).toBe('note8');
    });
  });

  describe('VERIFICATION: Confirm Note 5 is adding segregation requirement', () => {
    test('Baseline: Regular Class 8 + Class 8 = Compatible (no segregation)', async () => {
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

      const result = await evaluatePair(class8a, class8b);

      // Verify baseline: Class 8 + Class 8 without nitric acid = compatible, no segregation
      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Exception: Nitric acid (Class 8) + other Class 8 = Segregation required', async () => {
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

      // Verify exception: With nitric acid, segregation is required
      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(true);
      expect(result.noteCondition).toBe('note5');
    });

    test('Verify all four nitric acid UNs add segregation requirement', async () => {
      const nitricAcidUNs = ['UN1796', 'UN1826', 'UN2031', 'UN2032'];
      const otherClass8 = createMaterial(
        '8',
        'UN1789',
        'HYDROCHLORIC ACID',
        'N/A'
      );

      for (const unid of nitricAcidUNs) {
        const nitricAcid = createMaterial(
          '8',
          unid,
          'NITRIC ACID',
          'N/A'
        );

        const result = await evaluatePair(nitricAcid, otherClass8);

        // All four should add segregation requirement
        expect(result.requiresSegregation).toBe(true);
        expect(result.noteCondition).toBe('note5');
      }
    });
  });

  describe('NOTE CONDITION PAIRS: Verify noteConditionPairs tracking', () => {
    test('Note 5 pair should appear in noteConditionPairs array', async () => {
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

      expect(result.noteConditionPairs.length).toBe(1);
      expect(result.noteConditionPairs[0].noteCondition).toBe('note5');
      expect(result.noteConditionPairs[0].noteContent).toContain('nitric acid');
      expect(result.noteConditionPairs[0].noteContent).toContain('2.2 m');
      expect(result.noteConditionPairs[0].noteContent).toContain('88 inches');
      expect(result.noteConditionPairs[0].status).toBe('segregation');
    });

    test('Note 5 content should be descriptive and accurate', async () => {
      const un1796 = createMaterial(
        '8',
        'UN1796',
        'NITRATING ACID MIXTURE',
        'N/A'
      );
      const otherClass8 = createMaterial(
        '8',
        'UN1824',
        'SODIUM HYDROXIDE SOLUTION',
        'N/A'
      );

      const result = await evaluatePair(un1796, otherClass8);

      const notePair = result.noteConditionPairs[0];
      expect(notePair.noteContent).toContain('Separate nitric acid');
      expect(notePair.noteContent).toContain('carboys');
      expect(notePair.noteContent).toContain('corrosives materials');
      expect(notePair.noteContent).toContain('same aircraft');
    });
  });
});
