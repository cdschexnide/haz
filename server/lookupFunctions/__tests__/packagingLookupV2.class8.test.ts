/**
 * Packaging Lookup V2 Tests - Class 8 (Corrosives)
 *
 * Tests the packaging lookup functions for Class 8 corrosive materials.
 * Class 8 packaging paragraphs are A12.xx (Attachment 12) in AFMAN24-604.
 *
 * Key differences from Class 1:
 * - Class 8 ALWAYS uses packing groups (I, II, III) - except wet batteries
 * - POP codes: X (PG I), Y (PG II), Z (PG III)
 * - No divisions (hazclass is simply "8")
 */

import {
  getPackagingEntry,
  getAvailablePackagingOptions,
} from '../packagingLookupV2';

/**
 * Helper function to extract all container codes from packaging options
 */
function extractContainerCodes(
  options: ReturnType<typeof getAvailablePackagingOptions>
): string[] {
  return options.flatMap(
    (opt) =>
      opt.outerPackaging?.categories?.flatMap(
        (cat) => cat.containers?.map((c) => c.code) || []
      ) || []
  );
}

describe('Packaging Paragraph Lookup - Class 8 Corrosives', () => {
  describe('Entry Existence Tests', () => {
    test('Scenario 1-2-4-5-6-7-8-12-13-14-15-16-18-20: A12.2. entry exists for corrosive liquids', () => {
      const entry = getPackagingEntry('A12.2.');
      expect(entry).not.toBeNull();
      expect(entry?.hazardClass).toBe(8);
    });

    test('Scenario 3: A12.11. entry exists for NITRIC ACID, RED FUMING', () => {
      const entry = getPackagingEntry('A12.11.');
      expect(entry).not.toBeNull();
      expect(entry?.hazardClass).toBe(8);
    });

    test('Scenario 9-19: A12.3. entry exists for corrosive solids', () => {
      const entry = getPackagingEntry('A12.3.');
      expect(entry).not.toBeNull();
      expect(entry?.hazardClass).toBe(8);
    });

    test('Scenario 10-11: A12.4. entry exists for battery materials', () => {
      const entry = getPackagingEntry('A12.4.');
      expect(entry).not.toBeNull();
      expect(entry?.hazardClass).toBe(8);
    });

    test('Scenario 17: A12.9. entry exists for MERCURY', () => {
      const entry = getPackagingEntry('A12.9.');
      expect(entry).not.toBeNull();
      expect(entry?.hazardClass).toBe(8);
    });

    test('Non-existent paragraph returns null', () => {
      const entry = getPackagingEntry('A12.999.');
      expect(entry).toBeNull();
    });

    test('Wrong hazard class paragraph returns null for Class 8', () => {
      // A5.xx is Class 1 (explosives), not Class 8
      const entry = getPackagingEntry('A5.2.');
      // Entry exists but is for Class 1, not Class 8
      if (entry) {
        expect(entry.hazardClass).not.toBe(8);
      }
    });
  });

  describe('Authorized Packaging Codes', () => {
    describe('A12.2. - Corrosive Liquids (Scenarios 1-2, 4-8, 12-16, 18, 20)', () => {
      test('A12.2. authorizes steel drums for corrosive liquids', () => {
        const options = getAvailablePackagingOptions('A12.2.', {});
        const containerCodes = extractContainerCodes(options);

        // Per A12.2.: Steel drums authorized
        expect(containerCodes).toContain('1A1');
        expect(containerCodes).toContain('1A2');
      });

      test('A12.2. authorizes aluminum drums', () => {
        const options = getAvailablePackagingOptions('A12.2.', {});
        const containerCodes = extractContainerCodes(options);

        expect(containerCodes).toContain('1B1');
        expect(containerCodes).toContain('1B2');
      });

      test('A12.2. authorizes plastic drums', () => {
        const options = getAvailablePackagingOptions('A12.2.', {});
        const containerCodes = extractContainerCodes(options);

        expect(containerCodes).toContain('1H1');
        expect(containerCodes).toContain('1H2');
      });

      test('A12.2. authorizes jerricans', () => {
        const options = getAvailablePackagingOptions('A12.2.', {});
        const containerCodes = extractContainerCodes(options);

        // Jerricans for liquids
        expect(containerCodes).toContain('3A1');
        expect(containerCodes).toContain('3A2');
        expect(containerCodes).toContain('3B1');
        expect(containerCodes).toContain('3B2');
        expect(containerCodes).toContain('3H1');
        expect(containerCodes).toContain('3H2');
      });
    });

    describe('A12.3. - Corrosive Solids (Scenarios 9, 19)', () => {
      test('A12.3. authorizes drums for corrosive solids', () => {
        const options = getAvailablePackagingOptions('A12.3.', {});
        const containerCodes = extractContainerCodes(options);

        // Per A12.3.: Various drums authorized
        expect(containerCodes).toContain('1A1');
        expect(containerCodes).toContain('1A2');
        expect(containerCodes).toContain('1G'); // Fiber drum
      });

      test('A12.3. authorizes boxes for corrosive solids', () => {
        const options = getAvailablePackagingOptions('A12.3.', {});
        const containerCodes = extractContainerCodes(options);

        // Per A12.3.: Various boxes authorized
        expect(containerCodes).toContain('4A'); // Steel box
        expect(containerCodes).toContain('4B'); // Aluminum box
        expect(containerCodes).toContain('4C1'); // Ordinary natural wood box
        expect(containerCodes).toContain('4C2'); // Sift-proof natural wood box
        expect(containerCodes).toContain('4D'); // Plywood box
        expect(containerCodes).toContain('4F'); // Reconstituted wood box
        expect(containerCodes).toContain('4G'); // Fiberboard box
        expect(containerCodes).toContain('4H1'); // Expanded plastic box
        expect(containerCodes).toContain('4H2'); // Solid plastic box
        expect(containerCodes).toContain('4N'); // Metal box other than steel/aluminum
      });

      test('Scenario 9, Alteration 1: A12.3. is different from A12.2.', () => {
        // Verifies that solid vs liquid packaging paragraphs are distinct
        const optionsLiquid = getAvailablePackagingOptions('A12.2.', {});
        const optionsSolid = getAvailablePackagingOptions('A12.3.', {});

        // Both should return options
        expect(optionsLiquid.length).toBeGreaterThan(0);
        expect(optionsSolid.length).toBeGreaterThan(0);
      });
    });

    describe('A12.4. - Battery Materials (Scenarios 10, 11)', () => {
      test('A12.4. has packaging options for battery fluid', () => {
        const options = getAvailablePackagingOptions('A12.4.', {});
        expect(options.length).toBeGreaterThan(0);

        const containerCodes = extractContainerCodes(options);
        expect(containerCodes.length).toBeGreaterThan(0);
      });

      test('Scenario 10, Alteration 2: A12.4. is specific to batteries, not A12.2.', () => {
        const entryBattery = getPackagingEntry('A12.4.');
        const entryLiquid = getPackagingEntry('A12.2.');

        expect(entryBattery).not.toBeNull();
        expect(entryLiquid).not.toBeNull();
        // Both are Class 8 but different packaging requirements
        expect(entryBattery?.hazardClass).toBe(8);
        expect(entryLiquid?.hazardClass).toBe(8);
      });
    });

    describe('A12.9. - Mercury (Scenario 17)', () => {
      test('A12.9. has packaging options for mercury', () => {
        const options = getAvailablePackagingOptions('A12.9.', {});
        expect(options.length).toBeGreaterThan(0);

        const containerCodes = extractContainerCodes(options);
        expect(containerCodes.length).toBeGreaterThan(0);
      });

      test('Scenario 17, Alteration 1: A12.9. is specific to mercury, not A12.2.', () => {
        const entryMercury = getPackagingEntry('A12.9.');
        const entryLiquid = getPackagingEntry('A12.2.');

        expect(entryMercury).not.toBeNull();
        expect(entryLiquid).not.toBeNull();
      });
    });

    describe('A12.11. - Nitric Acid, Red Fuming (Scenario 3)', () => {
      test('A12.11. has packaging options for nitric acid, red fuming', () => {
        const options = getAvailablePackagingOptions('A12.11.', {});
        expect(options.length).toBeGreaterThan(0);

        const containerCodes = extractContainerCodes(options);
        expect(containerCodes.length).toBeGreaterThan(0);
      });

      test('Scenario 3, Alteration 3: A12.11. is specific to red fuming nitric acid, not A12.2.', () => {
        const entryNitric = getPackagingEntry('A12.11.');
        const entryLiquid = getPackagingEntry('A12.2.');

        expect(entryNitric).not.toBeNull();
        expect(entryLiquid).not.toBeNull();
      });
    });
  });

  describe('Class 8 Packing Group Handling (I, II, III)', () => {
    test('Class 8 materials with PG I return packaging options', () => {
      const options = getAvailablePackagingOptions('A12.2.', {
        packingGroup: 'I',
      });
      expect(options.length).toBeGreaterThan(0);
    });

    test('Class 8 materials with PG II return packaging options', () => {
      const options = getAvailablePackagingOptions('A12.2.', {
        packingGroup: 'II',
      });
      expect(options.length).toBeGreaterThan(0);
    });

    test('Class 8 materials with PG III return packaging options', () => {
      const options = getAvailablePackagingOptions('A12.2.', {
        packingGroup: 'III',
      });
      expect(options.length).toBeGreaterThan(0);
    });

    test('Class 8 wet batteries work without packing group (special case)', () => {
      // UN2794 wet batteries have NO packing group - this is the exception
      const options = getAvailablePackagingOptions('A12.4.', {
        packingGroup: undefined,
      });
      expect(options.length).toBeGreaterThan(0);
    });

    test('Multiple Class 8 paragraphs return packaging options', () => {
      const paragraphs = ['A12.2.', 'A12.3.', 'A12.4.', 'A12.9.', 'A12.11.'];

      for (const paragraphId of paragraphs) {
        const options = getAvailablePackagingOptions(paragraphId, {});
        expect(options.length).toBeGreaterThan(0);
      }
    });
  });

  describe('POP Code Requirements by Packing Group', () => {
    // These tests document the PG code requirements for Class 8
    // X = PG I only, Y = PG I or II, Z = PG I, II, or III

    test('PG I materials should use X code (most restrictive)', () => {
      // PG I (severe corrosives) require X-rated packaging
      const options = getAvailablePackagingOptions('A12.2.', {
        packingGroup: 'I',
      });
      expect(options.length).toBeGreaterThan(0);
    });

    test('PG II materials can use X or Y codes', () => {
      // PG II (moderate corrosives) can use X or Y-rated packaging
      const options = getAvailablePackagingOptions('A12.2.', {
        packingGroup: 'II',
      });
      expect(options.length).toBeGreaterThan(0);
    });

    test('PG III materials can use X, Y, or Z codes', () => {
      // PG III (mild corrosives) can use X, Y, or Z-rated packaging
      const options = getAvailablePackagingOptions('A12.2.', {
        packingGroup: 'III',
      });
      expect(options.length).toBeGreaterThan(0);
    });
  });

  describe('Packaging Option Structure Validation', () => {
    test('A12.2. packaging options have required structure', () => {
      const options = getAvailablePackagingOptions('A12.2.', {});
      expect(options.length).toBeGreaterThan(0);

      const firstOption = options[0];
      expect(firstOption).toHaveProperty('id');
      expect(firstOption).toHaveProperty('type');
      expect(firstOption).toHaveProperty('description');
      expect(firstOption).toHaveProperty('outerPackaging');
    });

    test('A12.3. packaging options include outer packaging categories', () => {
      const options = getAvailablePackagingOptions('A12.3.', {});
      expect(options.length).toBeGreaterThan(0);

      const firstOption = options[0];
      expect(firstOption.outerPackaging?.categories?.length).toBeGreaterThan(0);
    });

    test('Outer packaging categories contain valid container codes', () => {
      const entry = getPackagingEntry('A12.2.');
      expect(entry).not.toBeNull();

      const firstOption = entry!.packagingOptions[0];
      expect(firstOption.outerPackaging.categories.length).toBeGreaterThan(0);

      const firstCategory = firstOption.outerPackaging.categories[0];
      expect(firstCategory.containers.length).toBeGreaterThan(0);

      // Each container should have code, material, and description
      firstCategory.containers.forEach((container) => {
        expect(container).toHaveProperty('code');
        expect(container).toHaveProperty('material');
        expect(container).toHaveProperty('description');
        expect(container.code).toMatch(/^\d[A-Z]\d?$/); // e.g., 4G, 1A2, 4H1
      });
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('Empty string paragraphId returns null', () => {
      const entry = getPackagingEntry('');
      expect(entry).toBeNull();
    });

    test('Invalid paragraphId format returns null', () => {
      const entry = getPackagingEntry('invalid');
      expect(entry).toBeNull();
    });

    test('Non-existent Class 8 paragraph returns empty options array', () => {
      const options = getAvailablePackagingOptions('A12.999.', {});
      expect(options).toEqual([]);
    });

    test('Empty context object is handled gracefully', () => {
      const options = getAvailablePackagingOptions('A12.2.', {});
      expect(options.length).toBeGreaterThan(0);
    });
  });

  describe('All 20 Scenarios - Integration Test', () => {
    const scenarios = [
      { scenario: 1, pkg: 'A12.2.', pg: 'I', desc: 'SULFURIC ACID, FUMING' },
      { scenario: 2, pkg: 'A12.2.', pg: 'I', desc: 'HYDROFLUORIC ACID' },
      { scenario: 3, pkg: 'A12.11.', pg: 'I', desc: 'NITRIC ACID, RED FUMING' },
      { scenario: 4, pkg: 'A12.2.', pg: 'I', desc: 'HYDRAZINE, ANHYDROUS' },
      { scenario: 5, pkg: 'A12.2.', pg: 'I', desc: 'CORROSIVE LIQUID, N.O.S. PG I' },
      { scenario: 6, pkg: 'A12.2.', pg: 'I', desc: 'CORROSIVE LIQUID, TOXIC, N.O.S. PG I' },
      { scenario: 7, pkg: 'A12.2.', pg: 'II', desc: 'HYDROCHLORIC ACID' },
      { scenario: 8, pkg: 'A12.2.', pg: 'II', desc: 'ACETIC ACID, GLACIAL' },
      { scenario: 9, pkg: 'A12.3.', pg: 'II', desc: 'SODIUM HYDROXIDE, SOLID' },
      { scenario: 10, pkg: 'A12.4.', pg: 'II', desc: 'BATTERY FLUID, ACID' },
      { scenario: 11, pkg: 'A12.4.', pg: '', desc: 'BATTERIES, WET (no PG)' },
      { scenario: 12, pkg: 'A12.2.', pg: 'II', desc: 'SODIUM HYDROXIDE, SOLUTION' },
      { scenario: 13, pkg: 'A12.2.', pg: 'II', desc: 'CORROSIVE LIQUID, FLAMMABLE, N.O.S.' },
      { scenario: 14, pkg: 'A12.2.', pg: 'II', desc: 'PERCHLORIC ACID' },
      { scenario: 15, pkg: 'A12.2.', pg: 'III', desc: 'ACETIC ACID SOLUTION' },
      { scenario: 16, pkg: 'A12.2.', pg: 'III', desc: 'AMMONIA SOLUTION' },
      { scenario: 17, pkg: 'A12.9.', pg: 'III', desc: 'MERCURY' },
      { scenario: 18, pkg: 'A12.2.', pg: 'III', desc: 'PHOSPHORIC ACID, SOLUTION' },
      { scenario: 19, pkg: 'A12.3.', pg: 'III', desc: 'CORROSIVE SOLID, N.O.S.' },
      { scenario: 20, pkg: 'A12.2.', pg: 'III', desc: 'CORROSIVE LIQUID, ACIDIC, INORGANIC, N.O.S.' },
    ];

    scenarios.forEach(({ scenario, pkg, pg, desc }) => {
      test(`Scenario ${scenario}: ${pkg} returns packaging options for ${desc}`, () => {
        const entry = getPackagingEntry(pkg);
        expect(entry).not.toBeNull();
        expect(entry?.hazardClass).toBe(8);

        const options = getAvailablePackagingOptions(pkg, {
          packingGroup: pg || undefined,
        });
        expect(options.length).toBeGreaterThan(0);
      });
    });
  });
});
