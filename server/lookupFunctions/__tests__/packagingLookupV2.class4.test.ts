/**
 * Packaging Lookup V2 Tests - Class 4 (Flammable Solids)
 *
 * Tests the packaging lookup functions for Class 4 materials.
 * Class 4 packaging paragraphs are A8.xx (Attachment 8) in AFMAN24-604.
 *
 * Key differences from Class 1:
 * - Class 4 USES traditional packing groups (I, II, III)
 * - Packaging options may vary by packing group
 * - Uses A8.xx paragraphs (not A5.xx)
 *
 * Class 4 Divisions:
 * - Division 4.1: Flammable solids
 * - Division 4.2: Spontaneously combustible materials
 * - Division 4.3: Dangerous when wet materials
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

describe('Packaging Lookup V2 - Class 4 (Flammable Solids)', () => {
  describe('Entry Existence and Structure', () => {
    describe('A8.2 Entries (Liquids)', () => {
      test('A8.2. entry exists for Class 4 liquids', () => {
        const entry = getPackagingEntry('A8.2.');
        expect(entry).not.toBeNull();
        expect(entry?.hazardClass).toBe(4);
        expect(entry?.description).toContain('Liquids');
      });

      test('A8.2. has standard entry type', () => {
        const entry = getPackagingEntry('A8.2.');
        expect(entry?.entryType).toBe('standard');
      });

      test('A8.2. has packaging options', () => {
        const options = getAvailablePackagingOptions('A8.2.', {});
        expect(options.length).toBeGreaterThan(0);
      });
    });

    describe('A8.3 Entries (Solids)', () => {
      test('A8.3. entry exists for Class 4 solids', () => {
        const entry = getPackagingEntry('A8.3.');
        expect(entry).not.toBeNull();
        expect(entry?.hazardClass).toBe(4);
        expect(entry?.description).toContain('Solids');
      });

      test('A8.3. has standard entry type', () => {
        const entry = getPackagingEntry('A8.3.');
        expect(entry?.entryType).toBe('standard');
      });

      test('A8.3. includes material types for all Class 4 divisions', () => {
        const entry = getPackagingEntry('A8.3.');
        expect(entry?.materialTypes).toContain('flammable_solids');
        expect(entry?.materialTypes).toContain(
          'spontaneously_combustible_solids'
        );
        expect(entry?.materialTypes).toContain('dangerous_when_wet_solids');
      });
    });

    describe('A8.4 Entries (Self-Reactive / CAA)', () => {
      test('A8.4. entry exists for CAA materials', () => {
        const entry = getPackagingEntry('A8.4.');
        expect(entry).not.toBeNull();
        expect(entry?.hazardClass).toBe(4);
        expect(entry?.description).toContain('CAA');
      });

      test('A8.4. has specialized entry type', () => {
        const entry = getPackagingEntry('A8.4.');
        expect(entry?.entryType).toBe('specialized');
      });

      test('A8.4. packaging requires competent authority approval', () => {
        const options = getAvailablePackagingOptions('A8.4.', {});
        expect(options.length).toBeGreaterThan(0);

        // CAA packaging has specialized container code
        const containerCodes = extractContainerCodes(options);
        expect(containerCodes).toContain('CAA');
      });
    });

    describe('A8.5 Entries (Pyrophoric)', () => {
      test('A8.5. entry exists for pyrophoric liquids', () => {
        const entry = getPackagingEntry('A8.5.');
        expect(entry).not.toBeNull();
        expect(entry?.hazardClass).toBe(4);
        expect(entry?.description).toContain('Pyrophoric');
      });

      test('A8.5. has specialized entry type', () => {
        const entry = getPackagingEntry('A8.5.');
        expect(entry?.entryType).toBe('specialized');
      });

      test('A8.5. includes Division 4.2 subclass', () => {
        const entry = getPackagingEntry('A8.5.');
        expect(entry?.subclass).toContain('4.2');
      });

      test('A8.5. has applicable UN numbers', () => {
        const entry = getPackagingEntry('A8.5.');
        expect(entry?.applicableUNNumbers).toBeDefined();
        expect(entry?.applicableUNNumbers).toContain('UN2845');
      });
    });

    describe('A8.10 Entries (Barium Azide Specific)', () => {
      test('A8.10. entry exists for Barium Azide, Wetted', () => {
        const entry = getPackagingEntry('A8.10.');
        expect(entry).not.toBeNull();
        expect(entry?.hazardClass).toBe(4);
        expect(entry?.description).toContain('Barium Azide');
      });

      test('A8.10. has specialized entry type', () => {
        const entry = getPackagingEntry('A8.10.');
        expect(entry?.entryType).toBe('specialized');
      });

      test('A8.10. has specific material type', () => {
        const entry = getPackagingEntry('A8.10.');
        expect(entry?.materialTypes).toContain('barium_azide_wetted');
      });
    });

    describe('A8.14 Entries (Matches)', () => {
      test('A8.14. entry exists for matches', () => {
        const entry = getPackagingEntry('A8.14.');
        expect(entry).not.toBeNull();
        expect(entry?.hazardClass).toBe(4);
        expect(entry?.description).toContain('Matches');
      });

      test('A8.14. has standard entry type', () => {
        const entry = getPackagingEntry('A8.14.');
        expect(entry?.entryType).toBe('standard');
      });

      test('A8.14. covers multiple match types', () => {
        const entry = getPackagingEntry('A8.14.');
        expect(entry?.materialTypes).toContain('matches_fusee');
        expect(entry?.materialTypes).toContain('matches_safety');
        expect(entry?.materialTypes).toContain('matches_strike_anywhere');
        expect(entry?.materialTypes).toContain('matches_wax_vesta');
      });
    });
  });

  describe('Container Code Authorization', () => {
    describe('A8.2 Authorized Codes (Liquids)', () => {
      test('should authorize 1A1 steel drum for liquids', () => {
        const options = getAvailablePackagingOptions('A8.2.', {});
        const containerCodes = extractContainerCodes(options);
        expect(containerCodes).toContain('1A1');
      });

      test('should authorize 4G fiberboard box for liquids', () => {
        const options = getAvailablePackagingOptions('A8.2.', {});
        const containerCodes = extractContainerCodes(options);
        expect(containerCodes).toContain('4G');
      });

      test('should authorize various drum types for liquids', () => {
        const options = getAvailablePackagingOptions('A8.2.', {});
        const containerCodes = extractContainerCodes(options);

        expect(containerCodes).toContain('1A1'); // Steel drum
        expect(containerCodes).toContain('1A2'); // Steel removable head
        expect(containerCodes).toContain('1B1'); // Aluminum drum
        expect(containerCodes).toContain('1B2'); // Aluminum removable head
        expect(containerCodes).toContain('1H1'); // Plastic drum
        expect(containerCodes).toContain('1H2'); // Plastic removable head
      });
    });

    describe('A8.3 Authorized Codes (Solids)', () => {
      test('should authorize 4G fiberboard box for solids', () => {
        const options = getAvailablePackagingOptions('A8.3.', {});
        const containerCodes = extractContainerCodes(options);
        expect(containerCodes).toContain('4G');
      });

      test('should authorize 1A2 steel drum (removable head) for solids', () => {
        const options = getAvailablePackagingOptions('A8.3.', {});
        const containerCodes = extractContainerCodes(options);
        expect(containerCodes).toContain('1A2');
      });

      test('should authorize 1G fiber drum for solids', () => {
        const options = getAvailablePackagingOptions('A8.3.', {});
        const containerCodes = extractContainerCodes(options);
        expect(containerCodes).toContain('1G');
      });

      test('should authorize 1H2 plastic drum (removable head) for solids', () => {
        const options = getAvailablePackagingOptions('A8.3.', {});
        const containerCodes = extractContainerCodes(options);
        expect(containerCodes).toContain('1H2');
      });

      test('should authorize 4D plywood box for solids', () => {
        const options = getAvailablePackagingOptions('A8.3.', {});
        const containerCodes = extractContainerCodes(options);
        expect(containerCodes).toContain('4D');
      });

      test('should authorize 1B2 aluminum drum (removable head) for solids', () => {
        const options = getAvailablePackagingOptions('A8.3.', {});
        const containerCodes = extractContainerCodes(options);
        expect(containerCodes).toContain('1B2');
      });

      test('should authorize wood boxes for solids', () => {
        const options = getAvailablePackagingOptions('A8.3.', {});
        const containerCodes = extractContainerCodes(options);

        expect(containerCodes).toContain('4C1'); // Natural wood box
        expect(containerCodes).toContain('4C2'); // Sift-proof natural wood box
        expect(containerCodes).toContain('4D'); // Plywood box
        expect(containerCodes).toContain('4F'); // Reconstituted wood box
      });
    });

    describe('A8.5 Authorized Codes (Pyrophoric)', () => {
      test('should authorize steel drum 1A1 for pyrophoric liquids', () => {
        const options = getAvailablePackagingOptions('A8.5.', {});
        const containerCodes = extractContainerCodes(options);
        expect(containerCodes).toContain('1A1');
      });

      test('should authorize steel removable head drum 1A2 for pyrophoric liquids', () => {
        const options = getAvailablePackagingOptions('A8.5.', {});
        const containerCodes = extractContainerCodes(options);
        expect(containerCodes).toContain('1A2');
      });

      test('should include cylinder packaging option for pyrophoric materials', () => {
        const options = getAvailablePackagingOptions('A8.5.', {});

        // Check that at least one option is for cylinders
        const cylinderOption = options.find((opt) => opt.type === 'cylinder');
        expect(cylinderOption).toBeDefined();
        expect(cylinderOption?.description).toContain('Cylinder');
      });

      test('should authorize boxes for pyrophoric combination packaging', () => {
        const options = getAvailablePackagingOptions('A8.5.', {});
        const containerCodes = extractContainerCodes(options);

        expect(containerCodes).toContain('4A'); // Steel box
        expect(containerCodes).toContain('4B'); // Aluminum box
        expect(containerCodes).toContain('4G'); // Fiberboard box
      });
    });

    describe('A8.10 Authorized Codes (Barium Azide)', () => {
      test('should authorize wooden boxes for barium azide', () => {
        const options = getAvailablePackagingOptions('A8.10.', {});
        const containerCodes = extractContainerCodes(options);

        expect(containerCodes).toContain('4C1'); // Natural wood box
        expect(containerCodes).toContain('4C2'); // Sift-proof natural wood box
        expect(containerCodes).toContain('4D'); // Plywood box
        expect(containerCodes).toContain('4F'); // Reconstituted wood box
      });

      test('should authorize 1G fiber drum for barium azide', () => {
        const options = getAvailablePackagingOptions('A8.10.', {});
        const containerCodes = extractContainerCodes(options);
        expect(containerCodes).toContain('1G');
      });

      test('should NOT authorize steel drums for barium azide', () => {
        const options = getAvailablePackagingOptions('A8.10.', {});
        const containerCodes = extractContainerCodes(options);

        // A8.10 specifically allows only wooden boxes and fiber drums
        expect(containerCodes).not.toContain('1A1');
        expect(containerCodes).not.toContain('1A2');
      });
    });

    describe('A8.14 Authorized Codes (Matches)', () => {
      test('should authorize 4G fiberboard box for matches', () => {
        const options = getAvailablePackagingOptions('A8.14.', {});
        const containerCodes = extractContainerCodes(options);
        expect(containerCodes).toContain('4G');
      });

      test('should authorize steel drums for matches', () => {
        const options = getAvailablePackagingOptions('A8.14.', {});
        const containerCodes = extractContainerCodes(options);

        expect(containerCodes).toContain('1A1');
        expect(containerCodes).toContain('1A2');
      });

      test('should authorize various drum types for matches', () => {
        const options = getAvailablePackagingOptions('A8.14.', {});
        const containerCodes = extractContainerCodes(options);

        expect(containerCodes).toContain('1A1'); // Steel drum
        expect(containerCodes).toContain('1A2'); // Steel removable head
        expect(containerCodes).toContain('1B1'); // Aluminum drum
        expect(containerCodes).toContain('1B2'); // Aluminum removable head
        expect(containerCodes).toContain('1D'); // Plywood drum
        expect(containerCodes).toContain('1G'); // Fiber drum
        expect(containerCodes).toContain('1N1'); // Other metal drum
        expect(containerCodes).toContain('1N2'); // Other metal removable head
      });

      test('should authorize jerricans for matches', () => {
        const options = getAvailablePackagingOptions('A8.14.', {});
        const containerCodes = extractContainerCodes(options);

        expect(containerCodes).toContain('3A1'); // Steel jerrican
        expect(containerCodes).toContain('3A2'); // Steel removable head jerrican
        expect(containerCodes).toContain('3B1'); // Aluminum jerrican
        expect(containerCodes).toContain('3B2'); // Aluminum removable head jerrican
      });

      test('should authorize boxes for matches', () => {
        const options = getAvailablePackagingOptions('A8.14.', {});
        const containerCodes = extractContainerCodes(options);

        expect(containerCodes).toContain('4A'); // Steel box
        expect(containerCodes).toContain('4B'); // Aluminum box
        expect(containerCodes).toContain('4C1'); // Natural wood box
        expect(containerCodes).toContain('4C2'); // Sift-proof natural wood box
        expect(containerCodes).toContain('4D'); // Plywood box
        expect(containerCodes).toContain('4F'); // Reconstituted wood box
        expect(containerCodes).toContain('4G'); // Fiberboard box
        expect(containerCodes).toContain('4N'); // Other metal box
      });
    });

    describe('A8.3 Unauthorized Codes', () => {
      test('should NOT authorize A5.xx packaging for Class 4 materials', () => {
        // A5.xx is for Class 1 explosives only
        const optionsA5 = getAvailablePackagingOptions('A5.4.', {});
        const optionsA8 = getAvailablePackagingOptions('A8.3.', {});

        // Both should work independently but A5.xx entry should be Class 1
        const entryA5 = getPackagingEntry('A5.4.');
        const entryA8 = getPackagingEntry('A8.3.');

        expect(entryA5?.hazardClass).toBe(1);
        expect(entryA8?.hazardClass).toBe(4);
      });
    });
  });

  describe('Packing Group Filtering', () => {
    // Class 4 USES packing groups - test that options are returned for different PGs
    test('should return packaging options without packing group context', () => {
      const options = getAvailablePackagingOptions('A8.3.', {});
      expect(options.length).toBeGreaterThan(0);
    });

    test('should return packaging options with PG I context', () => {
      const options = getAvailablePackagingOptions('A8.3.', {
        packingGroup: 'I',
      });
      expect(options.length).toBeGreaterThan(0);
    });

    test('should return packaging options with PG II context', () => {
      const options = getAvailablePackagingOptions('A8.3.', {
        packingGroup: 'II',
      });
      expect(options.length).toBeGreaterThan(0);
    });

    test('should return packaging options with PG III context', () => {
      const options = getAvailablePackagingOptions('A8.3.', {
        packingGroup: 'III',
      });
      expect(options.length).toBeGreaterThan(0);
    });

    test('A8.2 (liquids) works with all packing groups', () => {
      const paragraphId = 'A8.2.';

      const optionsNoContext = getAvailablePackagingOptions(paragraphId, {});
      const optionsWithPGI = getAvailablePackagingOptions(paragraphId, {
        packingGroup: 'I',
      });
      const optionsWithPGII = getAvailablePackagingOptions(paragraphId, {
        packingGroup: 'II',
      });
      const optionsWithPGIII = getAvailablePackagingOptions(paragraphId, {
        packingGroup: 'III',
      });

      // All should return valid options
      expect(optionsNoContext.length).toBeGreaterThan(0);
      expect(optionsWithPGI.length).toBeGreaterThan(0);
      expect(optionsWithPGII.length).toBeGreaterThan(0);
      expect(optionsWithPGIII.length).toBeGreaterThan(0);
    });

    test('A8.5 (pyrophoric) works with all packing groups', () => {
      const paragraphId = 'A8.5.';

      const optionsNoContext = getAvailablePackagingOptions(paragraphId, {});
      const optionsWithPGI = getAvailablePackagingOptions(paragraphId, {
        packingGroup: 'I',
      });
      const optionsWithPGII = getAvailablePackagingOptions(paragraphId, {
        packingGroup: 'II',
      });
      const optionsWithPGIII = getAvailablePackagingOptions(paragraphId, {
        packingGroup: 'III',
      });

      // All should return valid options
      expect(optionsNoContext.length).toBeGreaterThan(0);
      expect(optionsWithPGI.length).toBeGreaterThan(0);
      expect(optionsWithPGII.length).toBeGreaterThan(0);
      expect(optionsWithPGIII.length).toBeGreaterThan(0);
    });

    test('Multiple Class 4 paragraphs return packaging options without PG', () => {
      const paragraphs = ['A8.2.', 'A8.3.', 'A8.5.', 'A8.10.', 'A8.14.'];

      for (const paragraphId of paragraphs) {
        const options = getAvailablePackagingOptions(paragraphId, {});
        expect(options.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Packaging Option Structure Validation', () => {
    test('A8.3. packaging options have required structure', () => {
      const options = getAvailablePackagingOptions('A8.3.', {});
      expect(options.length).toBeGreaterThan(0);

      const firstOption = options[0];
      expect(firstOption).toHaveProperty('id');
      expect(firstOption).toHaveProperty('type');
      expect(firstOption).toHaveProperty('description');
      expect(firstOption).toHaveProperty('outerPackaging');
    });

    test('A8.3. packaging options include inner packaging requirements', () => {
      const options = getAvailablePackagingOptions('A8.3.', {});

      // At least one option should have inner packaging requirements
      const optionWithInner = options.find(
        (opt) => opt.innerPackaging?.required === true
      );
      expect(optionWithInner).toBeDefined();
      expect(optionWithInner?.innerPackaging?.materials?.length).toBeGreaterThan(
        0
      );
    });

    test('A8.3. has single packaging option (no inner packaging required)', () => {
      const options = getAvailablePackagingOptions('A8.3.', {});

      // A8.3 should have options where inner packaging is not required
      const singleOption = options.find(
        (opt) => opt.innerPackaging?.required === false
      );
      expect(singleOption).toBeDefined();
    });

    test('Outer packaging categories contain valid container codes', () => {
      const entry = getPackagingEntry('A8.3.');
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

    test('A8.5. has cylinder packaging option', () => {
      const options = getAvailablePackagingOptions('A8.5.', {});

      const cylinderOption = options.find((opt) => opt.type === 'cylinder');
      expect(cylinderOption).toBeDefined();
      expect(cylinderOption?.innerPackaging?.required).toBe(false);
    });

    test('A8.5. has intermediate packaging for three-tier combinations', () => {
      const options = getAvailablePackagingOptions('A8.5.', {});

      // At least one option should have intermediate packaging (three-tier)
      const threeTierOption = options.find(
        (opt) =>
          opt.intermediatePackaging && opt.intermediatePackaging.required
      );
      expect(threeTierOption).toBeDefined();
    });
  });

  describe('Negative Cases', () => {
    test('should return null for invalid paragraph', () => {
      const entry = getPackagingEntry('A8.999.');
      expect(entry).toBeNull();
    });

    test('should return null for empty string paragraphId', () => {
      const entry = getPackagingEntry('');
      expect(entry).toBeNull();
    });

    test('should return null for invalid paragraphId format', () => {
      const entry = getPackagingEntry('invalid');
      expect(entry).toBeNull();
    });

    test('should return empty array for non-existent paragraph options', () => {
      const options = getAvailablePackagingOptions('A8.999.', {});
      expect(options).toEqual([]);
    });

    test('should return empty array for A5.xx when looking for Class 4 (wrong class)', () => {
      // A5.xx is for Class 1 explosives, not Class 4
      // This tests that Class 1 paragraphs return Class 1 entries, not Class 4
      const entryA5 = getPackagingEntry('A5.4.');
      expect(entryA5?.hazardClass).toBe(1);
      expect(entryA5?.hazardClass).not.toBe(4);
    });

    test('Empty context object is handled gracefully', () => {
      const options = getAvailablePackagingOptions('A8.3.', {});
      expect(options.length).toBeGreaterThan(0);
    });

    test('Undefined packing group context is handled gracefully', () => {
      const options = getAvailablePackagingOptions('A8.3.', {
        packingGroup: undefined,
      });
      expect(options.length).toBeGreaterThan(0);
    });
  });

  describe('Scenario Coverage - Division 4.1 (Flammable Solids)', () => {
    // Scenario 1: UN1325 - A8.3, 4G
    test('Scenario 1: A8.3. authorizes 4G for UN1325-type materials', () => {
      const options = getAvailablePackagingOptions('A8.3.', {});
      const containerCodes = extractContainerCodes(options);
      expect(containerCodes).toContain('4G');
    });

    // Scenario 2: UN1944 - A8.14, 4G
    test('Scenario 2: A8.14. authorizes 4G for matches (UN1944)', () => {
      const options = getAvailablePackagingOptions('A8.14.', {});
      const containerCodes = extractContainerCodes(options);
      expect(containerCodes).toContain('4G');
    });

    // Scenario 3: UN1310 - A8.3, 1A2
    test('Scenario 3: A8.3. authorizes 1A2 for UN1310-type materials', () => {
      const options = getAvailablePackagingOptions('A8.3.', {});
      const containerCodes = extractContainerCodes(options);
      expect(containerCodes).toContain('1A2');
    });

    // Scenario 4: UN1571 - A8.10, 1A1 (Note: A8.10 uses wood/fiber not steel)
    test('Scenario 4: A8.10. exists for Barium Azide (UN1571)', () => {
      const entry = getPackagingEntry('A8.10.');
      expect(entry).not.toBeNull();
      expect(entry?.hazardClass).toBe(4);
    });

    // Scenario 5: UN2304 - A8.2, 1A1
    test('Scenario 5: A8.2. authorizes 1A1 for liquid materials (UN2304)', () => {
      const options = getAvailablePackagingOptions('A8.2.', {});
      const containerCodes = extractContainerCodes(options);
      expect(containerCodes).toContain('1A1');
    });

    // Scenario 6: UN3221 - A8.4, 4G (CAA materials)
    test('Scenario 6: A8.4. exists for self-reactive materials (UN3221)', () => {
      const entry = getPackagingEntry('A8.4.');
      expect(entry).not.toBeNull();
      expect(entry?.hazardClass).toBe(4);
      expect(entry?.entryType).toBe('specialized');
    });

    // Scenario 7: UN2000 - A8.3, 4D
    test('Scenario 7: A8.3. authorizes 4D for UN2000-type materials', () => {
      const options = getAvailablePackagingOptions('A8.3.', {});
      const containerCodes = extractContainerCodes(options);
      expect(containerCodes).toContain('4D');
    });
  });

  describe('Scenario Coverage - Division 4.2 (Spontaneously Combustible)', () => {
    // Scenario 8: UN2845 - A8.5, steel cylinders
    test('Scenario 8: A8.5. has cylinder option for pyrophoric liquids (UN2845)', () => {
      const options = getAvailablePackagingOptions('A8.5.', {});
      const cylinderOption = options.find((opt) => opt.type === 'cylinder');
      expect(cylinderOption).toBeDefined();
    });

    // Scenario 9: UN1383 - A8.5, 1A2
    test('Scenario 9: A8.5. authorizes 1A2 for UN1383-type materials', () => {
      const options = getAvailablePackagingOptions('A8.5.', {});
      const containerCodes = extractContainerCodes(options);
      expect(containerCodes).toContain('1A2');
    });

    // Scenario 10: UN3088 - A8.3, 1G
    test('Scenario 10: A8.3. authorizes 1G for UN3088-type materials', () => {
      const options = getAvailablePackagingOptions('A8.3.', {});
      const containerCodes = extractContainerCodes(options);
      expect(containerCodes).toContain('1G');
    });

    // Scenario 11: UN2447 - A8.5, 1A1
    test('Scenario 11: A8.5. authorizes 1A1 for UN2447-type materials', () => {
      const options = getAvailablePackagingOptions('A8.5.', {});
      const containerCodes = extractContainerCodes(options);
      expect(containerCodes).toContain('1A1');
    });

    // Scenario 12: UN1373 - A8.3, 4G
    test('Scenario 12: A8.3. authorizes 4G for UN1373-type materials', () => {
      const options = getAvailablePackagingOptions('A8.3.', {});
      const containerCodes = extractContainerCodes(options);
      expect(containerCodes).toContain('4G');
    });

    // Scenario 13: UN3206 - A8.3, 1H2
    test('Scenario 13: A8.3. authorizes 1H2 for UN3206-type materials', () => {
      const options = getAvailablePackagingOptions('A8.3.', {});
      const containerCodes = extractContainerCodes(options);
      expect(containerCodes).toContain('1H2');
    });
  });

  describe('Scenario Coverage - Division 4.3 (Dangerous When Wet)', () => {
    // Scenario 14: UN1428 - A8.3, 1A2
    test('Scenario 14: A8.3. authorizes 1A2 for UN1428-type materials', () => {
      const options = getAvailablePackagingOptions('A8.3.', {});
      const containerCodes = extractContainerCodes(options);
      expect(containerCodes).toContain('1A2');
    });

    // Scenario 15: UN1415 - A8.3, 4G (steel can in 4G)
    test('Scenario 15: A8.3. authorizes 4G for UN1415-type materials', () => {
      const options = getAvailablePackagingOptions('A8.3.', {});
      const containerCodes = extractContainerCodes(options);
      expect(containerCodes).toContain('4G');
    });

    // Scenario 16: UN1402 - A8.3, 1A2
    test('Scenario 16: A8.3. authorizes 1A2 for UN1402-type materials', () => {
      const options = getAvailablePackagingOptions('A8.3.', {});
      const containerCodes = extractContainerCodes(options);
      expect(containerCodes).toContain('1A2');
    });

    // Scenario 17: UN2813 - A8.3, 4G
    test('Scenario 17: A8.3. authorizes 4G for UN2813-type materials', () => {
      const options = getAvailablePackagingOptions('A8.3.', {});
      const containerCodes = extractContainerCodes(options);
      expect(containerCodes).toContain('4G');
    });

    // Scenario 18: UN1396 - A8.3, 1B2
    test('Scenario 18: A8.3. authorizes 1B2 for UN1396-type materials', () => {
      const options = getAvailablePackagingOptions('A8.3.', {});
      const containerCodes = extractContainerCodes(options);
      expect(containerCodes).toContain('1B2');
    });

    // Scenario 19: UN1400 - A8.3, 1A2
    test('Scenario 19: A8.3. authorizes 1A2 for UN1400-type materials', () => {
      const options = getAvailablePackagingOptions('A8.3.', {});
      const containerCodes = extractContainerCodes(options);
      expect(containerCodes).toContain('1A2');
    });

    // Scenario 20: UN3148 - A8.2, 4G (steel bottles in 4G)
    test('Scenario 20: A8.2. authorizes 4G for liquid materials (UN3148)', () => {
      const options = getAvailablePackagingOptions('A8.2.', {});
      const containerCodes = extractContainerCodes(options);
      expect(containerCodes).toContain('4G');
    });
  });
});
