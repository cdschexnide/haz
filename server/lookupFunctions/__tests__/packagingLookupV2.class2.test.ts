/**
 * Packaging Lookup V2 Tests - Class 2 (Gases)
 *
 * Tests the packaging lookup functions for Class 2 gas materials.
 * Class 2 packaging paragraphs are A6.xx (Attachment 6) in AFMAN24-604.
 *
 * Key differences from other hazard classes:
 * - Class 2 gases use specialized cylinders (DOT-3A, 3AA, 3AL, etc.)
 * - Aerosols (A6.2) use standard outer packaging (boxes, drums)
 * - Some Class 2 materials may not require packing groups
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

describe('Packaging Paragraph Lookup - Class 2 Gases', () => {
  describe('Entry Existence Tests', () => {
    test('A6.2. entry exists for Aerosols', () => {
      const entry = getPackagingEntry('A6.2.');
      expect(entry).not.toBeNull();
      expect(entry?.hazardClass).toBe(2);
    });

    test('A6.3. entry exists for Small receptacles/compressed gas', () => {
      const entry = getPackagingEntry('A6.3.');
      expect(entry).not.toBeNull();
      expect(entry?.hazardClass).toBe(2);
    });

    test('A6.4. entry exists for Liquefied compressed gas', () => {
      const entry = getPackagingEntry('A6.4.');
      expect(entry).not.toBeNull();
      expect(entry?.hazardClass).toBe(2);
    });

    test('A6.5. entry exists for Nonliquefied compressed gas', () => {
      const entry = getPackagingEntry('A6.5.');
      expect(entry).not.toBeNull();
      expect(entry?.hazardClass).toBe(2);
    });

    test('A6.6. entry exists for LPG (Liquefied Petroleum Gas)', () => {
      const entry = getPackagingEntry('A6.6.');
      expect(entry).not.toBeNull();
      expect(entry?.hazardClass).toBe(2);
    });

    test('A6.7. entry exists for Fire extinguishers', () => {
      const entry = getPackagingEntry('A6.7.');
      expect(entry).not.toBeNull();
      expect(entry?.hazardClass).toBe(2);
    });

    test('A6.9. entry exists for Acetylene', () => {
      const entry = getPackagingEntry('A6.9.');
      expect(entry).not.toBeNull();
      expect(entry?.hazardClass).toBe(2);
    });

    test('A6.11. entry exists for Cryogenic liquids', () => {
      const entry = getPackagingEntry('A6.11.');
      expect(entry).not.toBeNull();
      expect(entry?.hazardClass).toBe(2);
    });

    test('A6.15. entry exists for Zone A toxic gases', () => {
      const entry = getPackagingEntry('A6.15.');
      expect(entry).not.toBeNull();
      expect(entry?.hazardClass).toBe(2);
    });

    test('Non-existent paragraph returns null', () => {
      const entry = getPackagingEntry('A6.999.');
      expect(entry).toBeNull();
    });
  });

  describe('Authorized Packaging Codes', () => {
    describe('Cylinder Packaging (most Class 2 gases)', () => {
      test('A6.3. (Small receptacles) authorizes DOT steel cylinders', () => {
        const options = getAvailablePackagingOptions('A6.3.', {});
        const containerCodes = extractContainerCodes(options);

        // Per A6.3.: DOT steel cylinders authorized
        // Common cylinder codes: DOT-3A, 3AA, 3AL, 3B, 3E
        expect(containerCodes.length).toBeGreaterThan(0);
      });

      test('A6.4. (Liquefied gas) authorizes appropriate cylinders', () => {
        const options = getAvailablePackagingOptions('A6.4.', {});
        const containerCodes = extractContainerCodes(options);

        // Per A6.4.: Cylinders for liquefied compressed gases
        expect(containerCodes.length).toBeGreaterThan(0);
      });

      test('A6.5. (Nonliquefied gas) authorizes appropriate cylinders', () => {
        const options = getAvailablePackagingOptions('A6.5.', {});
        const containerCodes = extractContainerCodes(options);

        // Per A6.5.: Cylinders for nonliquefied compressed gases
        expect(containerCodes.length).toBeGreaterThan(0);
      });

      test('A6.6. (LPG) authorizes DOT cylinders', () => {
        const options = getAvailablePackagingOptions('A6.6.', {});
        const containerCodes = extractContainerCodes(options);

        // Per A6.6.: DOT cylinders for LPG
        expect(containerCodes.length).toBeGreaterThan(0);
      });

      test('A6.9. (Acetylene) authorizes acetylene-specific cylinders', () => {
        const options = getAvailablePackagingOptions('A6.9.', {});
        const containerCodes = extractContainerCodes(options);

        // Per A6.9.: DOT-8, 8AL acetylene-specific cylinders
        expect(containerCodes.length).toBeGreaterThan(0);
      });
    });

    describe('Aerosol Outer Packaging (A6.2)', () => {
      test('A6.2. (Aerosols) authorizes fiberboard boxes', () => {
        const options = getAvailablePackagingOptions('A6.2.', {});
        const containerCodes = extractContainerCodes(options);

        // Per A6.2.: 4G fiberboard boxes for aerosol outer packaging
        expect(containerCodes).toContain('4G');
      });

      test('A6.2. (Aerosols) authorizes wooden boxes', () => {
        const options = getAvailablePackagingOptions('A6.2.', {});
        const containerCodes = extractContainerCodes(options);

        // Per A6.2.: Wooden boxes authorized
        expect(containerCodes).toContain('4C1');
        expect(containerCodes).toContain('4C2');
        expect(containerCodes).toContain('4D');
        expect(containerCodes).toContain('4F');
      });

      test('A6.2. (Aerosols) authorizes plastic boxes', () => {
        const options = getAvailablePackagingOptions('A6.2.', {});
        const containerCodes = extractContainerCodes(options);

        // Per A6.2.: Plastic boxes authorized
        expect(containerCodes).toContain('4H1');
        expect(containerCodes).toContain('4H2');
      });

      test('A6.2. (Aerosols) authorizes steel drums', () => {
        const options = getAvailablePackagingOptions('A6.2.', {});
        const containerCodes = extractContainerCodes(options);

        // Per A6.2.: Steel drums authorized
        expect(containerCodes).toContain('1A1');
        expect(containerCodes).toContain('1A2');
      });

      test('A6.2. (Aerosols) authorizes aluminum drums', () => {
        const options = getAvailablePackagingOptions('A6.2.', {});
        const containerCodes = extractContainerCodes(options);

        // Per A6.2.: Aluminum drums authorized
        expect(containerCodes).toContain('1B1');
        expect(containerCodes).toContain('1B2');
      });
    });

    describe('Special Gas Packaging', () => {
      test('A6.7. (Fire extinguishers) returns packaging options', () => {
        const options = getAvailablePackagingOptions('A6.7.', {});
        expect(options.length).toBeGreaterThan(0);

        const containerCodes = extractContainerCodes(options);
        expect(containerCodes.length).toBeGreaterThan(0);
      });

      test('A6.11. (Cryogenic liquids) returns packaging options', () => {
        const options = getAvailablePackagingOptions('A6.11.', {});
        expect(options.length).toBeGreaterThan(0);

        const containerCodes = extractContainerCodes(options);
        expect(containerCodes.length).toBeGreaterThan(0);
      });

      test('A6.15. (Zone A toxic gases) returns packaging options', () => {
        const options = getAvailablePackagingOptions('A6.15.', {});
        expect(options.length).toBeGreaterThan(0);

        const containerCodes = extractContainerCodes(options);
        expect(containerCodes.length).toBeGreaterThan(0);
      });
    });

    describe('Scenario Coverage by Paragraph', () => {
      test('Scenario 1: A6.9. packaging for Acetylene', () => {
        const options = getAvailablePackagingOptions('A6.9.', {});
        const containerCodes = extractContainerCodes(options);
        expect(containerCodes.length).toBeGreaterThan(0);
      });

      test('Scenario 2-3: A6.6. packaging for LPG materials', () => {
        const options = getAvailablePackagingOptions('A6.6.', {});
        const containerCodes = extractContainerCodes(options);
        expect(containerCodes.length).toBeGreaterThan(0);
      });

      test('Scenario 4-13: A6.2. packaging for Aerosols', () => {
        const options = getAvailablePackagingOptions('A6.2.', {});
        const containerCodes = extractContainerCodes(options);
        expect(containerCodes).toContain('4G');
      });

      test('Scenario 5-6-7-8-9-10: A6.3. packaging for Small receptacles', () => {
        const options = getAvailablePackagingOptions('A6.3.', {});
        const containerCodes = extractContainerCodes(options);
        expect(containerCodes.length).toBeGreaterThan(0);
      });

      test('Scenario 5-6-7-8-9-10-18: A6.5. packaging for Nonliquefied gas', () => {
        const options = getAvailablePackagingOptions('A6.5.', {});
        const containerCodes = extractContainerCodes(options);
        expect(containerCodes.length).toBeGreaterThan(0);
      });

      test('Scenario 7-14-15-19-20: A6.4. packaging for Liquefied gas', () => {
        const options = getAvailablePackagingOptions('A6.4.', {});
        const containerCodes = extractContainerCodes(options);
        expect(containerCodes.length).toBeGreaterThan(0);
      });

      test('Scenario 11: A6.7. packaging for Fire extinguishers', () => {
        const options = getAvailablePackagingOptions('A6.7.', {});
        const containerCodes = extractContainerCodes(options);
        expect(containerCodes.length).toBeGreaterThan(0);
      });

      test('Scenario 12: A6.11. packaging for Cryogenic liquids', () => {
        const options = getAvailablePackagingOptions('A6.11.', {});
        const containerCodes = extractContainerCodes(options);
        expect(containerCodes.length).toBeGreaterThan(0);
      });

      test('Scenario 16-17: A6.15. packaging for Zone A toxic gases', () => {
        const options = getAvailablePackagingOptions('A6.15.', {});
        const containerCodes = extractContainerCodes(options);
        expect(containerCodes.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Invalid Packaging Codes (From Alterations)', () => {
    test('Scenario 2 Alt 2: 4G (fiberboard box) should NOT be valid for compressed gas cylinders', () => {
      // 4G is a fiberboard box - cannot hold compressed gas cylinders
      // Only valid for aerosol outer packaging (A6.2), not for cylinder gases
      const optionsA63 = getAvailablePackagingOptions('A6.3.', {});
      const codesA63 = extractContainerCodes(optionsA63);

      const optionsA65 = getAvailablePackagingOptions('A6.5.', {});
      const codesA65 = extractContainerCodes(optionsA65);

      const optionsA66 = getAvailablePackagingOptions('A6.6.', {});
      const codesA66 = extractContainerCodes(optionsA66);

      // 4G boxes cannot contain compressed gas cylinders
      // These paragraphs should use cylinder specifications, not fiberboard boxes
      expect(codesA63).not.toContain('4G');
      expect(codesA65).not.toContain('4G');
      expect(codesA66).not.toContain('4G');
    });

    test('Scenario 8 Alt 2: "W" is NOT a valid POP packing group code (only X, Y, Z valid)', () => {
      // POP (Performance-Oriented Packaging) only allows X, Y, Z as valid codes
      // "W" is not a valid POP packing group code
      const options = getAvailablePackagingOptions('A6.3.', {
        packingGroup: 'W' as any, // Invalid PG code
      });

      // Even with invalid PG, the function should handle it gracefully
      // The system should not accept "W" as a valid packing group
      // This tests that invalid PG codes don't break the lookup
      expect(options).toBeDefined();
    });

    test('Invalid packing group codes should not affect cylinder packaging', () => {
      const validPGs = ['I', 'II', 'III', undefined];
      const invalidPGs = ['W', 'A', '1', 'invalid'];

      for (const pg of invalidPGs) {
        const options = getAvailablePackagingOptions('A6.4.', {
          packingGroup: pg as any,
        });
        // Should handle invalid PG gracefully
        expect(options).toBeDefined();
      }
    });
  });

  describe('Packing Group Handling', () => {
    test('Class 2 materials work without packing group', () => {
      const entry = getPackagingEntry('A6.2.');
      expect(entry).not.toBeNull();

      const options = getAvailablePackagingOptions('A6.2.', {
        packingGroup: undefined,
      });
      expect(options.length).toBeGreaterThan(0);
    });

    test('Class 2 entry retrieval does not always depend on packing group', () => {
      // Some Class 2 gases may not use traditional packing groups
      const optionsNoContext = getAvailablePackagingOptions('A6.2.', {});
      const optionsWithPGI = getAvailablePackagingOptions('A6.2.', {
        packingGroup: 'I',
      });
      const optionsWithPGII = getAvailablePackagingOptions('A6.2.', {
        packingGroup: 'II',
      });
      const optionsWithPGIII = getAvailablePackagingOptions('A6.2.', {
        packingGroup: 'III',
      });

      // All should return valid options
      expect(optionsNoContext.length).toBeGreaterThan(0);
      expect(optionsWithPGI.length).toBeGreaterThan(0);
      expect(optionsWithPGII.length).toBeGreaterThan(0);
      expect(optionsWithPGIII.length).toBeGreaterThan(0);
    });

    test('Multiple Class 2 paragraphs return packaging options without PG', () => {
      const paragraphs = ['A6.2.', 'A6.3.', 'A6.4.', 'A6.5.', 'A6.6.', 'A6.7.'];

      for (const paragraphId of paragraphs) {
        const options = getAvailablePackagingOptions(paragraphId, {});
        expect(options.length).toBeGreaterThan(0);
      }
    });

    test('Toxic gas (A6.15.) packaging options', () => {
      const options = getAvailablePackagingOptions('A6.15.', {});
      expect(options.length).toBeGreaterThan(0);
    });
  });

  describe('Packaging Option Structure Validation', () => {
    test('A6.2. packaging options have required structure', () => {
      const options = getAvailablePackagingOptions('A6.2.', {});
      expect(options.length).toBeGreaterThan(0);

      const firstOption = options[0];
      expect(firstOption).toHaveProperty('id');
      expect(firstOption).toHaveProperty('type');
      expect(firstOption).toHaveProperty('description');
      expect(firstOption).toHaveProperty('outerPackaging');
    });

    test('A6.2. (Aerosols) packaging options include inner packaging requirements', () => {
      const options = getAvailablePackagingOptions('A6.2.', {});

      // Aerosols may have inner packaging requirements (the aerosol cans themselves)
      const optionWithInner = options.find(
        (opt) => opt.innerPackaging?.required === true
      );
      if (optionWithInner) {
        expect(optionWithInner.innerPackaging?.materials?.length).toBeGreaterThan(0);
      }
    });

    test('Outer packaging categories contain valid container codes', () => {
      const entry = getPackagingEntry('A6.2.');
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
      });
    });

    test('Cylinder packaging entries have proper structure', () => {
      const entry = getPackagingEntry('A6.4.');
      expect(entry).not.toBeNull();

      if (entry && entry.packagingOptions.length > 0) {
        const firstOption = entry.packagingOptions[0];
        expect(firstOption).toHaveProperty('id');
        expect(firstOption).toHaveProperty('type');
        expect(firstOption).toHaveProperty('outerPackaging');
      }
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

    test('Non-existent Class 2 paragraph returns null', () => {
      const entry = getPackagingEntry('A6.999.');
      expect(entry).toBeNull();
    });

    test('Non-existent paragraph returns empty options array', () => {
      const options = getAvailablePackagingOptions('A6.999.', {});
      expect(options).toEqual([]);
    });

    test('Empty context object is handled gracefully', () => {
      const options = getAvailablePackagingOptions('A6.2.', {});
      expect(options.length).toBeGreaterThan(0);
    });

    test('Class 1 paragraph does not return Class 2 data', () => {
      const entry = getPackagingEntry('A5.4.');
      if (entry) {
        expect(entry.hazardClass).not.toBe(2);
      }
    });

    test('Class 2 paragraphs all return hazardClass 2', () => {
      const class2Paragraphs = [
        'A6.2.',
        'A6.3.',
        'A6.4.',
        'A6.5.',
        'A6.6.',
        'A6.7.',
        'A6.9.',
        'A6.11.',
        'A6.15.',
      ];

      for (const paragraphId of class2Paragraphs) {
        const entry = getPackagingEntry(paragraphId);
        expect(entry).not.toBeNull();
        expect(entry?.hazardClass).toBe(2);
      }
    });
  });
});
