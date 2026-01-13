/**
 * Packaging Lookup V2 Tests - Class 1 (Explosives)
 *
 * Tests the packaging lookup functions for Class 1 explosive materials.
 * Class 1 packaging paragraphs are A5.xx (Attachment 5) in AFMAN24-604.
 *
 * Key differences from other hazard classes:
 * - Class 1 does NOT use traditional packing groups (I, II, III)
 * - Uses X/Y for POP (Performance-Oriented Packaging) marking instead
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

describe('Packaging Paragraph Lookup - Class 1 Explosives', () => {
  describe('Entry Existence Tests', () => {
    test('Scenario 1: A5.4. entry exists for BARIUM AZIDE (wetted explosives)', () => {
      const entry = getPackagingEntry('A5.4.');
      expect(entry).not.toBeNull();
      expect(entry?.hazardClass).toBe(1);
      expect(entry?.description).toContain('Barium Azide');
    });

    test('Scenario 2: A5.8. entry exists for BLACK POWDER', () => {
      const entry = getPackagingEntry('A5.8.');
      expect(entry).not.toBeNull();
      expect(entry?.hazardClass).toBe(1);
      expect(entry?.description).toContain('Black Powder');
    });

    test('Scenario 3: A5.9. entry exists for POWDER, SMOKELESS', () => {
      const entry = getPackagingEntry('A5.9.');
      expect(entry).not.toBeNull();
      expect(entry?.hazardClass).toBe(1);
      expect(entry?.description).toContain('Powder, Smokeless');
    });

    test('Scenario 4: A5.10. entry exists for NITROGLYCERIN materials', () => {
      const entry = getPackagingEntry('A5.10.');
      expect(entry).not.toBeNull();
      expect(entry?.hazardClass).toBe(1);
      expect(entry?.description).toContain('Nitroglycerin');
    });

    test('Scenario 5: A5.12. entry exists for MINES and ordnance', () => {
      const entry = getPackagingEntry('A5.12.');
      expect(entry).not.toBeNull();
      expect(entry?.hazardClass).toBe(1);
      expect(entry?.description).toContain('Mines');
    });

    test('Scenario 6: A5.21. entry exists for CHARGES, SHAPED, FLEXIBLE, LINEAR', () => {
      const entry = getPackagingEntry('A5.21.');
      expect(entry).not.toBeNull();
      expect(entry?.hazardClass).toBe(1);
      expect(entry?.description).toContain('Charges, Shaped, Flexible, Linear');
    });

    test('Non-existent paragraph returns null', () => {
      const entry = getPackagingEntry('A5.999.');
      expect(entry).toBeNull();
    });
  });

  describe('Authorized Packaging Codes', () => {
    test('A5.4. (BARIUM AZIDE) authorizes steel drums', () => {
      const options = getAvailablePackagingOptions('A5.4.', {});
      const containerCodes = extractContainerCodes(options);

      // Per A5.4.: Steel drums authorized
      expect(containerCodes).toContain('1A1');
      expect(containerCodes).toContain('1A2');
    });

    test('A5.8. (BLACK POWDER) authorizes 4G fiberboard box', () => {
      const options = getAvailablePackagingOptions('A5.8.', {});
      const containerCodes = extractContainerCodes(options);

      // Per A5.8.: 4G fiberboard box authorized
      expect(containerCodes).toContain('4G');
    });

    test('A5.8. (BLACK POWDER) authorizes drums and boxes', () => {
      const options = getAvailablePackagingOptions('A5.8.', {});
      const containerCodes = extractContainerCodes(options);

      // Per A5.8.: Various drums and boxes authorized
      expect(containerCodes).toContain('1A2'); // Steel drum with removable head
      expect(containerCodes).toContain('1B2'); // Aluminum drum with removable head
      expect(containerCodes).toContain('1D'); // Plywood drum
      expect(containerCodes).toContain('1G'); // Fiber drum
      expect(containerCodes).toContain('4C1'); // Ordinary natural wood box
      expect(containerCodes).toContain('4C2'); // Sift-proof natural wood box
      expect(containerCodes).toContain('4D'); // Plywood box
      expect(containerCodes).toContain('4F'); // Reconstituted wood box
      expect(containerCodes).toContain('4G'); // Fiberboard box
    });

    test('A5.8. (BLACK POWDER) does NOT authorize 4H1 (expanded plastic box)', () => {
      const options = getAvailablePackagingOptions('A5.8.', {});
      const containerCodes = extractContainerCodes(options);

      // Per A5.8.: 4H1 (expanded plastic box) NOT authorized - only 4H2 (solid plastic)
      expect(containerCodes).not.toContain('4H1');
      expect(containerCodes).toContain('4H2'); // Solid plastic box is authorized
    });

    test('A5.12. (MINES/Ordnance) authorizes both 4H1 and 4H2 plastic boxes', () => {
      const options = getAvailablePackagingOptions('A5.12.', {});
      const containerCodes = extractContainerCodes(options);

      // Per A5.12.: Both expanded and solid plastic boxes authorized
      expect(containerCodes).toContain('4H1'); // Expanded plastic box
      expect(containerCodes).toContain('4H2'); // Solid plastic box
    });

    test('A5.21. (SHAPED CHARGES) returns available packaging options', () => {
      const options = getAvailablePackagingOptions('A5.21.', {});
      expect(options.length).toBeGreaterThan(0);

      const containerCodes = extractContainerCodes(options);
      // Should have at least some container options
      expect(containerCodes.length).toBeGreaterThan(0);
    });
  });

  describe('Class 1 Packing Group Handling (X/Y only, no I/II/III)', () => {
    test('Class 1 materials work without traditional packing groups', () => {
      const entry = getPackagingEntry('A5.4.');
      expect(entry).not.toBeNull();

      // No packing group context should be needed for Class 1
      const options = getAvailablePackagingOptions('A5.4.', {
        packingGroup: undefined, // Class 1 has no PG
      });
      expect(options.length).toBeGreaterThan(0);
    });

    test('Class 1 entry retrieval does not depend on packing group', () => {
      // Class 1 explosives do not use packing groups I, II, III
      // They use X/Y for POP marking instead
      const optionsNoContext = getAvailablePackagingOptions('A5.8.', {});
      const optionsWithPGI = getAvailablePackagingOptions('A5.8.', {
        packingGroup: 'I',
      });
      const optionsWithPGII = getAvailablePackagingOptions('A5.8.', {
        packingGroup: 'II',
      });
      const optionsWithPGIII = getAvailablePackagingOptions('A5.8.', {
        packingGroup: 'III',
      });

      // All should return valid options since Class 1 doesn't use PG filtering
      expect(optionsNoContext.length).toBeGreaterThan(0);
      expect(optionsWithPGI.length).toBeGreaterThan(0);
      expect(optionsWithPGII.length).toBeGreaterThan(0);
      expect(optionsWithPGIII.length).toBeGreaterThan(0);
    });

    test('Multiple Class 1 paragraphs return packaging options without PG', () => {
      const paragraphs = ['A5.4.', 'A5.8.', 'A5.9.', 'A5.10.', 'A5.12.'];

      for (const paragraphId of paragraphs) {
        const options = getAvailablePackagingOptions(paragraphId, {});
        expect(options.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Packaging Option Structure Validation', () => {
    test('A5.4. packaging options have required structure', () => {
      const options = getAvailablePackagingOptions('A5.4.', {});
      expect(options.length).toBeGreaterThan(0);

      const firstOption = options[0];
      expect(firstOption).toHaveProperty('id');
      expect(firstOption).toHaveProperty('type');
      expect(firstOption).toHaveProperty('description');
      expect(firstOption).toHaveProperty('outerPackaging');
    });

    test('A5.8. packaging options include inner packaging requirements', () => {
      const options = getAvailablePackagingOptions('A5.8.', {});

      // At least one option should have inner packaging requirements
      const optionWithInner = options.find(
        (opt) => opt.innerPackaging?.required === true
      );
      expect(optionWithInner).toBeDefined();
      expect(optionWithInner?.innerPackaging?.materials?.length).toBeGreaterThan(
        0
      );
    });

    test('A5.12. has single packaging option (no inner packaging required)', () => {
      const options = getAvailablePackagingOptions('A5.12.', {});

      // A5.12 should have options where inner packaging is not required
      const singleOption = options.find(
        (opt) => opt.innerPackaging?.required === false
      );
      expect(singleOption).toBeDefined();
    });

    test('Outer packaging categories contain valid container codes', () => {
      const entry = getPackagingEntry('A5.8.');
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

    test('Non-existent paragraph returns empty options array', () => {
      const options = getAvailablePackagingOptions('A5.999.', {});
      expect(options).toEqual([]);
    });

    test('Empty context object is handled gracefully', () => {
      const options = getAvailablePackagingOptions('A5.4.', {});
      expect(options.length).toBeGreaterThan(0);
    });
  });
});
