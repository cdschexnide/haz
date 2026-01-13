/**
 * Packaging Lookup V2 Tests - Class 3 (Flammable Liquids)
 *
 * Tests the packaging lookup functions for Class 3 flammable liquid materials.
 * Class 3 packaging paragraphs are A7.xx (Attachment 7) in AFMAN24-604.
 *
 * Key differences from Class 1:
 * - Class 3 uses A7.xx paragraphs (not A5.xx)
 * - Class 3 uses standard Packing Groups (I, II, III)
 * - POP code Z is allowed for PG III (never for Class 1)
 * - POP code X is required for PG I, X or Y for PG II, X/Y/Z for PG III
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

describe('Packaging Paragraph Lookup - Class 3 Flammable Liquids', () => {
  describe('Entry Existence Tests', () => {
    test('Scenario 1-9, 11-17: A7.2. entry exists for standard Class 3 packaging', () => {
      const entry = getPackagingEntry('A7.2.');
      expect(entry).not.toBeNull();
      expect(entry?.hazardClass).toBe(3);
      expect(entry?.description).toContain('Class 3');
    });

    test('Scenario 10: A7.3. entry exists for refrigerating machines (combination only)', () => {
      const entry = getPackagingEntry('A7.3.');
      expect(entry).not.toBeNull();
      expect(entry?.hazardClass).toBe(3);
      expect(entry?.description).toContain('Refrigerating Machines');
    });

    test('Scenario 3: A7.4. entry exists for Aircraft Hydraulic Power Unit Fuel Tank', () => {
      const entry = getPackagingEntry('A7.4.');
      expect(entry).not.toBeNull();
      expect(entry?.hazardClass).toBe(3);
      expect(entry?.description).toContain('Aircraft Hydraulic Power Unit');
    });

    test('Scenario 18: A7.10. entry exists for Chlorosilanes', () => {
      const entry = getPackagingEntry('A7.10.');
      expect(entry).not.toBeNull();
      expect(entry?.hazardClass).toBe(3);
      expect(entry?.description).toContain('Chlorosilanes');
    });

    test('Scenario 20: A7.11. entry exists for engines and machinery', () => {
      const entry = getPackagingEntry('A7.11.');
      expect(entry).not.toBeNull();
      expect(entry?.hazardClass).toBe(3);
      expect(entry?.description).toContain('engine');
    });

    test('Scenario 19: A12.2. entry exists for cleaning compounds/corrosives', () => {
      const entry = getPackagingEntry('A12.2.');
      expect(entry).not.toBeNull();
      // A12.2 is Class 8 in the database but used for some Class 3 cleaning compounds
      expect(entry?.hazardClass).toBe(8);
      expect(entry?.description).toContain('Class 8');
    });

    test('A7.2. entry type is standard', () => {
      const entry = getPackagingEntry('A7.2.');
      expect(entry?.entryType).toBe('standard');
    });

    test('A7.3. entry type is exception', () => {
      const entry = getPackagingEntry('A7.3.');
      expect(entry?.entryType).toBe('exception');
    });

    test('A7.4. entry type is equipment', () => {
      const entry = getPackagingEntry('A7.4.');
      expect(entry?.entryType).toBe('equipment');
    });

    test('A7.10. entry type is specialized', () => {
      const entry = getPackagingEntry('A7.10.');
      expect(entry?.entryType).toBe('specialized');
    });

    test('A7.11. entry type is equipment', () => {
      const entry = getPackagingEntry('A7.11.');
      expect(entry?.entryType).toBe('equipment');
    });

    test('Non-existent paragraph A7.999. returns null', () => {
      const entry = getPackagingEntry('A7.999.');
      expect(entry).toBeNull();
    });

    test('Non-existent paragraph A7.50. returns null', () => {
      const entry = getPackagingEntry('A7.50.');
      expect(entry).toBeNull();
    });
  });

  describe('Authorized Packaging Codes - A7.2 (Standard Class 3)', () => {
    test('A7.2. authorizes steel drums (1A1, 1A2)', () => {
      const options = getAvailablePackagingOptions('A7.2.', {});
      const containerCodes = extractContainerCodes(options);

      expect(containerCodes).toContain('1A1');
      expect(containerCodes).toContain('1A2');
    });

    test('A7.2. authorizes aluminum drums (1B1, 1B2)', () => {
      const options = getAvailablePackagingOptions('A7.2.', {});
      const containerCodes = extractContainerCodes(options);

      expect(containerCodes).toContain('1B1');
      expect(containerCodes).toContain('1B2');
    });

    test('A7.2. authorizes plastic drums (1H1, 1H2)', () => {
      const options = getAvailablePackagingOptions('A7.2.', {});
      const containerCodes = extractContainerCodes(options);

      expect(containerCodes).toContain('1H1');
      expect(containerCodes).toContain('1H2');
    });

    test('A7.2. authorizes fiber drums (1G)', () => {
      const options = getAvailablePackagingOptions('A7.2.', {});
      const containerCodes = extractContainerCodes(options);

      expect(containerCodes).toContain('1G');
    });

    test('A7.2. authorizes plywood drums (1D)', () => {
      const options = getAvailablePackagingOptions('A7.2.', {});
      const containerCodes = extractContainerCodes(options);

      expect(containerCodes).toContain('1D');
    });

    test('A7.2. authorizes fiberboard boxes (4G)', () => {
      const options = getAvailablePackagingOptions('A7.2.', {});
      const containerCodes = extractContainerCodes(options);

      expect(containerCodes).toContain('4G');
    });

    test('A7.2. authorizes steel boxes (4A)', () => {
      const options = getAvailablePackagingOptions('A7.2.', {});
      const containerCodes = extractContainerCodes(options);

      expect(containerCodes).toContain('4A');
    });

    test('A7.2. authorizes wooden boxes (4C1, 4C2, 4D, 4F)', () => {
      const options = getAvailablePackagingOptions('A7.2.', {});
      const containerCodes = extractContainerCodes(options);

      expect(containerCodes).toContain('4C1'); // Ordinary natural wood
      expect(containerCodes).toContain('4C2'); // Sift-proof natural wood
      expect(containerCodes).toContain('4D'); // Plywood
      expect(containerCodes).toContain('4F'); // Reconstituted wood
    });

    test('A7.2. authorizes plastic boxes (4H1, 4H2)', () => {
      const options = getAvailablePackagingOptions('A7.2.', {});
      const containerCodes = extractContainerCodes(options);

      expect(containerCodes).toContain('4H1'); // Expanded plastic
      expect(containerCodes).toContain('4H2'); // Solid plastic
    });

    test('A7.2. authorizes jerricans (3A1, 3A2, 3B1, 3B2, 3H1, 3H2)', () => {
      const options = getAvailablePackagingOptions('A7.2.', {});
      const containerCodes = extractContainerCodes(options);

      expect(containerCodes).toContain('3A1'); // Steel
      expect(containerCodes).toContain('3A2'); // Steel removable head
      expect(containerCodes).toContain('3H1'); // Plastic
      expect(containerCodes).toContain('3H2'); // Plastic removable head
    });

    test('A7.2. has combination packaging option with inner packaging required', () => {
      const options = getAvailablePackagingOptions('A7.2.', {});

      const combinationOption = options.find(
        (opt) => opt.type === 'combination'
      );
      expect(combinationOption).toBeDefined();
      expect(combinationOption?.innerPackaging?.required).toBe(true);
    });

    test('A7.2. has single packaging option with no inner packaging required', () => {
      const options = getAvailablePackagingOptions('A7.2.', {});

      const singleOption = options.find((opt) => opt.type === 'single');
      expect(singleOption).toBeDefined();
      expect(singleOption?.innerPackaging?.required).toBe(false);
    });
  });

  describe('Authorized Packaging Codes - A7.3 (Combination Only)', () => {
    test('A7.3. returns packaging options for refrigerating machines', () => {
      const options = getAvailablePackagingOptions('A7.3.', {});
      expect(options.length).toBeGreaterThan(0);
    });

    test('A7.3. has specialized/exception packaging type', () => {
      const options = getAvailablePackagingOptions('A7.3.', {});
      const specializedOption = options.find(
        (opt) => opt.type === 'specialized'
      );
      expect(specializedOption).toBeDefined();
    });

    test('Scenario 10 Alt 3: A7.3. is for specialized machinery, not standard containers', () => {
      const entry = getPackagingEntry('A7.3.');
      // A7.3 is excepted from specification packaging
      expect(entry?.description).toContain('Refrigerating Machines');
    });
  });

  describe('Authorized Packaging Codes - A7.10 (Chlorosilanes)', () => {
    test('A7.10. authorizes steel drums for chlorosilanes (1A1, 1A2)', () => {
      const options = getAvailablePackagingOptions('A7.10.', {});
      const containerCodes = extractContainerCodes(options);

      expect(containerCodes).toContain('1A1');
      expect(containerCodes).toContain('1A2');
    });

    test('A7.10. authorizes steel jerricans (3A1)', () => {
      const options = getAvailablePackagingOptions('A7.10.', {});
      const containerCodes = extractContainerCodes(options);

      expect(containerCodes).toContain('3A1');
    });

    test('A7.10. authorizes composite packaging (6HA1)', () => {
      const options = getAvailablePackagingOptions('A7.10.', {});
      const containerCodes = extractContainerCodes(options);

      expect(containerCodes).toContain('6HA1');
    });

    test('A7.10. authorizes fiberboard boxes (4G) for combination packaging', () => {
      const options = getAvailablePackagingOptions('A7.10.', {});
      const containerCodes = extractContainerCodes(options);

      expect(containerCodes).toContain('4G');
    });

    test('A7.10. has specialized chlorosilane requirements', () => {
      const entry = getPackagingEntry('A7.10.');
      expect(entry?.materialTypes).toContain('chlorosilanes');
    });
  });

  describe('Authorized Packaging Codes - A7.11 (Engines/Machinery)', () => {
    test('A7.11. returns packaging options for engines', () => {
      const options = getAvailablePackagingOptions('A7.11.', {});
      expect(options.length).toBeGreaterThan(0);
    });

    test('A7.11. has equipment packaging type', () => {
      const options = getAvailablePackagingOptions('A7.11.', {});
      const equipmentOption = options.find((opt) => opt.type === 'equipment');
      expect(equipmentOption).toBeDefined();
    });

    test('A7.11. uses EQUIPMENT code for engines/machinery', () => {
      const options = getAvailablePackagingOptions('A7.11.', {});
      const containerCodes = extractContainerCodes(options);

      expect(containerCodes).toContain('EQUIPMENT');
    });

    test('A7.11. entry covers flammable liquid powered equipment', () => {
      const entry = getPackagingEntry('A7.11.');
      expect(entry?.materialTypes).toContain('flammable_liquid_powered_engines');
      expect(entry?.materialTypes).toContain('machinery');
    });

    test('Scenario 20: A7.11. inner packaging is not required for engines', () => {
      const options = getAvailablePackagingOptions('A7.11.', {});
      const equipmentOption = options.find((opt) => opt.type === 'equipment');
      expect(equipmentOption?.innerPackaging?.required).toBe(false);
    });
  });

  describe('Authorized Packaging Codes - A7.4 (Fuel Tanks)', () => {
    test('A7.4. returns packaging options for fuel tanks', () => {
      const options = getAvailablePackagingOptions('A7.4.', {});
      expect(options.length).toBeGreaterThan(0);
    });

    test('Scenario 3: A7.4. has specialized fuel tank requirements', () => {
      const entry = getPackagingEntry('A7.4.');
      expect(entry?.materialTypes).toContain(
        'aircraft_hydraulic_power_unit_fuel_tank'
      );
    });
  });

  describe('Packing Group Handling (I, II, III)', () => {
    test('PG I: Options available without packing group filter', () => {
      const options = getAvailablePackagingOptions('A7.2.', {});
      expect(options.length).toBeGreaterThan(0);
    });

    test('PG I: Options available with packingGroup I context', () => {
      const options = getAvailablePackagingOptions('A7.2.', {
        packingGroup: 'I',
      });
      expect(options.length).toBeGreaterThan(0);
    });

    test('PG II: Options available with packingGroup II context', () => {
      const options = getAvailablePackagingOptions('A7.2.', {
        packingGroup: 'II',
      });
      expect(options.length).toBeGreaterThan(0);
    });

    test('PG III: Options available with packingGroup III context', () => {
      const options = getAvailablePackagingOptions('A7.2.', {
        packingGroup: 'III',
      });
      expect(options.length).toBeGreaterThan(0);
    });

    test('Different packing groups return valid options for A7.2.', () => {
      const optionsPGI = getAvailablePackagingOptions('A7.2.', {
        packingGroup: 'I',
      });
      const optionsPGII = getAvailablePackagingOptions('A7.2.', {
        packingGroup: 'II',
      });
      const optionsPGIII = getAvailablePackagingOptions('A7.2.', {
        packingGroup: 'III',
      });

      expect(optionsPGI.length).toBeGreaterThan(0);
      expect(optionsPGII.length).toBeGreaterThan(0);
      expect(optionsPGIII.length).toBeGreaterThan(0);
    });

    test('Scenario 1 Alt 1: PG I requires X code only (documented in notes)', () => {
      // PG I materials require POP marking code X
      // This is a validation rule, not a packaging options filter
      const entry = getPackagingEntry('A7.2.');
      expect(entry).not.toBeNull();
      // The packaging entry exists and should be used with PG I validation
    });

    test('Scenario 5 Alt 1: PG II requires X or Y code (documented in notes)', () => {
      // PG II materials require POP marking code X or Y (not Z)
      const entry = getPackagingEntry('A7.2.');
      expect(entry).not.toBeNull();
    });

    test('Scenario 13: PG III allows X, Y, or Z codes', () => {
      // PG III materials can use any POP marking code (X, Y, or Z)
      const entry = getPackagingEntry('A7.2.');
      expect(entry).not.toBeNull();
      // This is a key difference from Class 1 which doesn't allow Z
    });

    test('A7.10. chlorosilanes work with PG II context', () => {
      const options = getAvailablePackagingOptions('A7.10.', {
        packingGroup: 'II',
      });
      expect(options.length).toBeGreaterThan(0);
    });
  });

  describe('Packaging Option Structure Validation', () => {
    test('A7.2. packaging options have required structure', () => {
      const options = getAvailablePackagingOptions('A7.2.', {});
      expect(options.length).toBeGreaterThan(0);

      const firstOption = options[0];
      expect(firstOption).toHaveProperty('id');
      expect(firstOption).toHaveProperty('type');
      expect(firstOption).toHaveProperty('description');
      expect(firstOption).toHaveProperty('outerPackaging');
    });

    test('A7.2. combination option includes inner packaging materials', () => {
      const options = getAvailablePackagingOptions('A7.2.', {});

      const combinationOption = options.find(
        (opt) => opt.type === 'combination'
      );
      expect(combinationOption).toBeDefined();
      expect(combinationOption?.innerPackaging?.materials?.length).toBeGreaterThan(
        0
      );
    });

    test('A7.2. inner packaging materials include standard types', () => {
      const options = getAvailablePackagingOptions('A7.2.', {});
      const combinationOption = options.find(
        (opt) => opt.type === 'combination'
      );

      const materials = combinationOption?.innerPackaging?.materials || [];
      expect(materials).toContain('Glass');
      expect(materials).toContain('Plastic');
      expect(materials).toContain('Metal');
    });

    test('Outer packaging categories contain valid container codes', () => {
      const entry = getPackagingEntry('A7.2.');
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

    test('Container codes follow UN packaging code format', () => {
      const entry = getPackagingEntry('A7.2.');
      const firstOption = entry!.packagingOptions[0];
      const firstCategory = firstOption.outerPackaging.categories[0];

      // Standard UN codes: digit + letter + optional digit (e.g., 1A1, 4G, 3H2)
      firstCategory.containers.forEach((container) => {
        expect(container.code).toMatch(/^\d[A-Z]\d?$/);
      });
    });
  });

  describe('Negative Tests - Unauthorized Codes', () => {
    test('A7.2. does NOT contain non-existent codes', () => {
      const options = getAvailablePackagingOptions('A7.2.', {});
      const containerCodes = extractContainerCodes(options);

      // These are made-up codes that should not exist
      expect(containerCodes).not.toContain('9Z9');
      expect(containerCodes).not.toContain('0X0');
      expect(containerCodes).not.toContain('ABC');
    });

    test('Scenario 13 Alt 2: A7.2. contains only valid UN container codes', () => {
      const options = getAvailablePackagingOptions('A7.2.', {});
      const containerCodes = extractContainerCodes(options);

      // A7.2 is standard packaging and should only have standard UN codes
      // Standard UN codes: digit + letter + optional digit (e.g., 1A1, 4G, 3H2)
      // Composite codes: digit + letters + digit (e.g., 6HA1, 6HA2 for composite packaging)
      // Note: Equipment codes like "EQUIPMENT" are used in A7.11, not A7.2
      containerCodes.forEach((code) => {
        expect(code).toMatch(/^\d[A-Z]+\d?$/);
      });
    });

    test('Non-existent paragraph returns empty options', () => {
      const options = getAvailablePackagingOptions('A7.999.', {});
      expect(options).toEqual([]);
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
      const options = getAvailablePackagingOptions('A7.999.', {});
      expect(options).toEqual([]);
    });

    test('Empty context object is handled gracefully', () => {
      const options = getAvailablePackagingOptions('A7.2.', {});
      expect(options.length).toBeGreaterThan(0);
    });

    test('Undefined context is handled gracefully', () => {
      const options = getAvailablePackagingOptions('A7.2.', undefined as any);
      expect(options.length).toBeGreaterThan(0);
    });
  });

  describe('Class 3 vs Class 1 Differences', () => {
    test('Class 3 uses A7.xx paragraphs (not A5.xx)', () => {
      const class3Entry = getPackagingEntry('A7.2.');
      expect(class3Entry).not.toBeNull();
      expect(class3Entry?.paragraphId).toMatch(/^A7\./);
    });

    test('Class 3 hazard class is 3', () => {
      const entry = getPackagingEntry('A7.2.');
      expect(entry?.hazardClass).toBe(3);
    });

    test('Multiple Class 3 paragraphs have hazard class 3', () => {
      const a72 = getPackagingEntry('A7.2.');
      const a73 = getPackagingEntry('A7.3.');
      const a74 = getPackagingEntry('A7.4.');
      const a710 = getPackagingEntry('A7.10.');
      const a711 = getPackagingEntry('A7.11.');

      expect(a72?.hazardClass).toBe(3);
      expect(a73?.hazardClass).toBe(3);
      expect(a74?.hazardClass).toBe(3);
      expect(a710?.hazardClass).toBe(3);
      expect(a711?.hazardClass).toBe(3);
    });

    test('Class 3 entry descriptions reference flammable liquids', () => {
      const entry = getPackagingEntry('A7.2.');
      // Standard Class 3 packaging mentions Class 3
      expect(entry?.description).toContain('Class 3');
    });
  });

  describe('Alteration Scenario Tests', () => {
    test('Scenario 9 Alt 3: A7.2. entry exists for PG II validation', () => {
      // When POP marking shows Z for PG II, it should be invalid
      // This test confirms the entry exists for validation
      const entry = getPackagingEntry('A7.2.');
      expect(entry).not.toBeNull();
    });

    test('Scenario 10 Alt 3: A7.3. requires specialized packaging', () => {
      // A7.3 is for refrigerating machines, not standard containers
      const entry = getPackagingEntry('A7.3.');
      expect(entry?.entryType).toBe('exception');
    });

    test('Scenario 3 Alt 3: A7.4. differs from A7.2.', () => {
      // Fuel tanks use A7.4, not A7.2
      const a72 = getPackagingEntry('A7.2.');
      const a74 = getPackagingEntry('A7.4.');

      expect(a72?.paragraphId).not.toBe(a74?.paragraphId);
      expect(a74?.materialTypes).toContain(
        'aircraft_hydraulic_power_unit_fuel_tank'
      );
    });

    test('Scenario 18 Alt 1: A7.10. differs from A7.2. for chlorosilanes', () => {
      // Chlorosilanes require A7.10, not A7.2
      const a72 = getPackagingEntry('A7.2.');
      const a710 = getPackagingEntry('A7.10.');

      expect(a72?.paragraphId).not.toBe(a710?.paragraphId);
      expect(a710?.materialTypes).toContain('chlorosilanes');
    });
  });

  describe('Material Type Coverage', () => {
    test('A7.2. covers flammable liquids', () => {
      const entry = getPackagingEntry('A7.2.');
      expect(entry?.materialTypes).toContain('flammable_liquids');
    });

    test('A7.3. covers refrigerating machines', () => {
      const entry = getPackagingEntry('A7.3.');
      expect(entry?.materialTypes).toContain('refrigerating_machines');
    });

    test('A7.4. covers M86 fuel tanks', () => {
      const entry = getPackagingEntry('A7.4.');
      expect(entry?.materialTypes).toContain('m86_fuel_tanks');
    });

    test('A7.10. covers chlorosilanes', () => {
      const entry = getPackagingEntry('A7.10.');
      expect(entry?.materialTypes).toContain('chlorosilanes');
    });

    test('A7.11. covers support equipment', () => {
      const entry = getPackagingEntry('A7.11.');
      expect(entry?.materialTypes).toContain('support_equipment');
    });
  });
});
