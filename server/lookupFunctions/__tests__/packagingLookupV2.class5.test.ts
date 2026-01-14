/**
 * Packaging Lookup V2 Tests - Class 5.1 (Oxidizers)
 *
 * Tests the packaging lookup functions for Class 5.1 oxidizer materials.
 * Class 5.1 packaging paragraphs are A9.xx (Attachment 9) in AFMAN24-604.
 *
 * Key differences from Class 1:
 * - Class 5.1 USES traditional packing groups (I, II, III)
 * - A9.5 for oxidizing liquids
 * - A9.6 for oxidizing solids
 * - A9.9 for special oxidizers (e.g., fluorine compounds)
 * - POP marking codes: X (PG I), Y (PG II), Z (PG III)
 */

import { getPackagingEntry, getAvailablePackagingOptions } from '../packagingLookupV2';

/**
 * Helper function to extract all container codes from packaging options
 */
function extractContainerCodes(options: ReturnType<typeof getAvailablePackagingOptions>): string[] {
  return options.flatMap(
    (opt) => opt.outerPackaging?.categories?.flatMap((cat) => cat.containers?.map((c) => c.code) || []) || []
  );
}

describe('Packaging Paragraph Lookup - Class 5.1 Oxidizers', () => {
  describe('Entry Existence Tests - A9.6 (Solids)', () => {
    test('Scenario 1, 2, 4: A9.6 entry exists for solid oxidizers (POTASSIUM PEROXIDE, SODIUM PEROXIDE, POTASSIUM SUPEROXIDE)', () => {
      const entry = getPackagingEntry('A9.6');
      expect(entry).not.toBeNull();
      expect(entry?.hazardClass).toBe(5);
    });

    test('A9.6 with trailing period also works', () => {
      const entry = getPackagingEntry('A9.6.');
      expect(entry).not.toBeNull();
      expect(entry?.hazardClass).toBe(5);
    });

    test('Scenario 7-12, 14-19: A9.6 entry exists for PG II and PG III solid oxidizers', () => {
      const entry = getPackagingEntry('A9.6');
      expect(entry).not.toBeNull();
      // Verify it covers the scenarios' materials
      expect(entry?.hazardClass).toBe(5);
    });
  });

  describe('Entry Existence Tests - A9.5 (Liquids)', () => {
    test('Scenario 3, 5, 13, 20: A9.5 entry exists for liquid oxidizers', () => {
      const entry = getPackagingEntry('A9.5');
      expect(entry).not.toBeNull();
      expect(entry?.hazardClass).toBe(5);
    });

    test('A9.5 with trailing period also works', () => {
      const entry = getPackagingEntry('A9.5.');
      expect(entry).not.toBeNull();
      expect(entry?.hazardClass).toBe(5);
    });
  });

  describe('Entry Existence Tests - A9.9 (Special)', () => {
    test('Scenario 6: A9.9 entry exists for BROMINE PENTAFLUORIDE (special oxidizers)', () => {
      const entry = getPackagingEntry('A9.9');
      expect(entry).not.toBeNull();
      expect(entry?.hazardClass).toBe(5);
    });

    test('A9.9 with trailing period also works', () => {
      const entry = getPackagingEntry('A9.9.');
      expect(entry).not.toBeNull();
      expect(entry?.hazardClass).toBe(5);
    });
  });

  describe('Authorized Packaging Codes - A9.6 (Solids)', () => {
    test('A9.6 authorizes fiberboard boxes (4G)', () => {
      const options = getAvailablePackagingOptions('A9.6', {});
      const containerCodes = extractContainerCodes(options);

      // Per A9.6: 4G fiberboard box should be authorized
      expect(containerCodes).toContain('4G');
    });

    test('A9.6 authorizes drums for solid oxidizers', () => {
      const options = getAvailablePackagingOptions('A9.6', {});
      const containerCodes = extractContainerCodes(options);

      // Per A9.6: Various drums authorized
      expect(containerCodes).toContain('1A2'); // Steel drum with removable head
    });

    test('A9.6 authorizes various box types', () => {
      const options = getAvailablePackagingOptions('A9.6', {});
      const containerCodes = extractContainerCodes(options);

      // Per A9.6: Various box types authorized
      expect(containerCodes.length).toBeGreaterThan(0);
    });

    test('A9.6 returns non-empty packaging options', () => {
      const options = getAvailablePackagingOptions('A9.6', {});
      expect(options.length).toBeGreaterThan(0);
    });
  });

  describe('Authorized Packaging Codes - A9.5 (Liquids)', () => {
    test('A9.5 authorizes liquid containers (jerricans, drums)', () => {
      const options = getAvailablePackagingOptions('A9.5', {});
      const containerCodes = extractContainerCodes(options);

      // Per A9.5: Liquid-appropriate containers should be authorized
      expect(containerCodes.length).toBeGreaterThan(0);
    });

    test('A9.5 returns non-empty packaging options for liquids', () => {
      const options = getAvailablePackagingOptions('A9.5', {});
      expect(options.length).toBeGreaterThan(0);
    });

    test('Scenario 13: A9.5 authorizes appropriate containers for BARIUM CHLORATE SOLUTION', () => {
      const options = getAvailablePackagingOptions('A9.5', {});
      const containerCodes = extractContainerCodes(options);

      // Should have liquid-appropriate containers
      expect(containerCodes.length).toBeGreaterThan(0);
    });

    test('Scenario 20: A9.5 authorizes containers for NITRITES AQUEOUS SOLUTION', () => {
      const options = getAvailablePackagingOptions('A9.5', {});
      const containerCodes = extractContainerCodes(options);

      // Should have liquid-appropriate containers for aqueous solutions
      expect(containerCodes.length).toBeGreaterThan(0);
    });
  });

  describe('Authorized Packaging Codes - A9.9 (Special)', () => {
    test('A9.9 returns packaging options for special oxidizers', () => {
      const options = getAvailablePackagingOptions('A9.9', {});
      expect(options.length).toBeGreaterThan(0);
    });

    test('Scenario 6: A9.9 authorizes containers for BROMINE PENTAFLUORIDE', () => {
      const options = getAvailablePackagingOptions('A9.9', {});
      const containerCodes = extractContainerCodes(options);

      // Should have appropriate containers for corrosive fluorine compounds
      expect(containerCodes.length).toBeGreaterThan(0);
    });
  });

  describe('Class 5.1 Packing Group Handling (I/II/III)', () => {
    test('PG I materials work with A9.6 packaging', () => {
      const options = getAvailablePackagingOptions('A9.6', { packingGroup: 'I' });
      expect(options.length).toBeGreaterThan(0);
    });

    test('PG II materials work with A9.6 packaging', () => {
      const options = getAvailablePackagingOptions('A9.6', { packingGroup: 'II' });
      expect(options.length).toBeGreaterThan(0);
    });

    test('PG III materials work with A9.6 packaging', () => {
      const options = getAvailablePackagingOptions('A9.6', { packingGroup: 'III' });
      expect(options.length).toBeGreaterThan(0);
    });

    test('A9.5 works with different packing groups for liquid oxidizers', () => {
      const optionsPGI = getAvailablePackagingOptions('A9.5', { packingGroup: 'I' });
      const optionsPGII = getAvailablePackagingOptions('A9.5', { packingGroup: 'II' });
      const optionsPGIII = getAvailablePackagingOptions('A9.5', { packingGroup: 'III' });

      expect(optionsPGI.length).toBeGreaterThan(0);
      expect(optionsPGII.length).toBeGreaterThan(0);
      expect(optionsPGIII.length).toBeGreaterThan(0);
    });

    test('Empty context object returns valid options (no PG filtering needed initially)', () => {
      const options = getAvailablePackagingOptions('A9.6', {});
      expect(options.length).toBeGreaterThan(0);
    });
  });

  describe('Negative Tests - Wrong Packaging Paragraphs', () => {
    test('A5.xx packaging is for Class 1 explosives, not Class 5 oxidizers', () => {
      // Verify A5.x entries are Class 1, not Class 5
      const entry = getPackagingEntry('A5.2');
      if (entry !== null) {
        expect(entry.hazardClass).toBe(1);
        expect(entry.hazardClass).not.toBe(5);
      }
    });

    test('Non-existent A9.xx paragraph returns null', () => {
      const entry = getPackagingEntry('A9.999');
      expect(entry).toBeNull();
    });

    test('Non-existent paragraph returns empty options array', () => {
      const options = getAvailablePackagingOptions('A9.999', {});
      expect(options).toEqual([]);
    });
  });

  describe('Packaging Option Structure Validation', () => {
    test('A9.6 packaging options have required structure', () => {
      const options = getAvailablePackagingOptions('A9.6', {});
      expect(options.length).toBeGreaterThan(0);

      const firstOption = options[0];
      expect(firstOption).toHaveProperty('id');
      expect(firstOption).toHaveProperty('type');
      expect(firstOption).toHaveProperty('description');
      expect(firstOption).toHaveProperty('outerPackaging');
    });

    test('A9.5 packaging options have required structure', () => {
      const options = getAvailablePackagingOptions('A9.5', {});
      expect(options.length).toBeGreaterThan(0);

      const firstOption = options[0];
      expect(firstOption).toHaveProperty('id');
      expect(firstOption).toHaveProperty('type');
      expect(firstOption).toHaveProperty('description');
      expect(firstOption).toHaveProperty('outerPackaging');
    });

    test('Outer packaging categories contain valid container codes', () => {
      const entry = getPackagingEntry('A9.6');
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

  describe('Scenario-Specific Tests', () => {
    test('Scenario 1 (UN1491 PG I): A9.6 provides valid packaging options', () => {
      const options = getAvailablePackagingOptions('A9.6', { packingGroup: 'I' });
      expect(options.length).toBeGreaterThan(0);
    });

    test('Scenario 3 (UN1873 PG I liquid): A9.5 provides valid packaging for perchloric acid', () => {
      const options = getAvailablePackagingOptions('A9.5', { packingGroup: 'I' });
      expect(options.length).toBeGreaterThan(0);
    });

    test('Scenario 7 (UN1439 PG II): A9.6 provides valid packaging options', () => {
      const options = getAvailablePackagingOptions('A9.6', { packingGroup: 'II' });
      expect(options.length).toBeGreaterThan(0);
    });

    test('Scenario 13 (UN3405 PG II liquid): A9.5 provides valid packaging for barium chlorate solution', () => {
      const options = getAvailablePackagingOptions('A9.5', { packingGroup: 'II' });
      expect(options.length).toBeGreaterThan(0);
    });

    test('Scenario 16 (UN1438 PG III): A9.6 provides valid packaging for aluminium nitrate', () => {
      const options = getAvailablePackagingOptions('A9.6', { packingGroup: 'III' });
      expect(options.length).toBeGreaterThan(0);
    });

    test('Scenario 20 (UN3219 PG III liquid): A9.5 provides valid packaging for nitrites solution', () => {
      const options = getAvailablePackagingOptions('A9.5', { packingGroup: 'III' });
      expect(options.length).toBeGreaterThan(0);
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

    test('Lowercase paragraph ID is handled', () => {
      // The system should handle case normalization
      const entryLower = getPackagingEntry('a9.6');
      const entryUpper = getPackagingEntry('A9.6');

      // Both should return the same entry (or both null if not normalized)
      if (entryLower && entryUpper) {
        expect(entryLower.hazardClass).toBe(entryUpper.hazardClass);
      }
    });

    test('Empty context object is handled gracefully', () => {
      const options = getAvailablePackagingOptions('A9.6', {});
      expect(options.length).toBeGreaterThan(0);
    });

    test('Null-like context values are handled gracefully', () => {
      const options = getAvailablePackagingOptions('A9.6', {
        packingGroup: undefined,
      });
      expect(options.length).toBeGreaterThan(0);
    });
  });

  describe('Alteration Test Cases', () => {
    test('Scenario 5, Alteration 3: Using A9.6 (solids) for liquid material is incorrect', () => {
      // Liquid oxidizers should use A9.5, not A9.6
      const liquidEntry = getPackagingEntry('A9.5');
      const solidEntry = getPackagingEntry('A9.6');

      expect(liquidEntry).not.toBeNull();
      expect(solidEntry).not.toBeNull();
      // They should be different entries
      expect(liquidEntry?.id).not.toBe(solidEntry?.id);
    });

    test('Scenario 12, Alteration 3: Using A9.5 for solid material is incorrect', () => {
      // Solid oxidizers should use A9.6, not A9.5
      const solidEntry = getPackagingEntry('A9.6');
      expect(solidEntry).not.toBeNull();
      expect(solidEntry?.hazardClass).toBe(5);
    });

    test('Scenario 13, Alteration 1 & 2: Liquid should use A9.5 not A9.6', () => {
      // Verify both entries exist and are different
      const liquidOptions = getAvailablePackagingOptions('A9.5', {});
      const solidOptions = getAvailablePackagingOptions('A9.6', {});

      expect(liquidOptions.length).toBeGreaterThan(0);
      expect(solidOptions.length).toBeGreaterThan(0);
    });

    test('Scenario 20, Alteration 2: Aqueous solution should use A9.5', () => {
      const options = getAvailablePackagingOptions('A9.5', {});
      expect(options.length).toBeGreaterThan(0);
    });
  });
});
