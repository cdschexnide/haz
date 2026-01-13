import {
  validateHazardClass,
  validatePackingGroup,
  validatePackingInstruction,
  validateSubsidiaryRisk,
} from '../sddgValidation';
import { HazardousMaterialItem } from '@/hazardousMaterials/hazardousMaterialsList';

// Helper to create minimal HazardousMaterialItem for testing
function createClass2Material(
  unid: string,
  hazclassDiv: string,
  packagingParagraph: string,
  properShippingName: string,
  subsidiaryRisk: string = '',
  packingGroup: string = ''
): HazardousMaterialItem {
  return {
    unid,
    hazclassDiv,
    packagingParagraph,
    properShippingName,
    packingGroup,
    subsidiaryRisk,
    specialProvision: '',
    isTechnicalNameRequired: false,
  } as HazardousMaterialItem;
}

describe('SDDG Validation - Class 2 Gases', () => {
  describe('Key 13: Hazard Class Validation', () => {
    describe('Positive Cases - Division 2.1 (Flammable Gases)', () => {
      test('Scenario 1: UN1001 - validates 2.1 correctly', () => {
        const material = createClass2Material('UN1001', '2.1', 'A6.9', 'ACETYLENE, DISSOLVED');
        const result = validateHazardClass(material, '2.1');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 2: UN1011 - validates 2.1 correctly', () => {
        const material = createClass2Material('UN1011', '2.1', 'A6.6', 'BUTANE');
        const result = validateHazardClass(material, '2.1');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 3: UN1978 - validates 2.1 correctly', () => {
        const material = createClass2Material('UN1978', '2.1', 'A6.6', 'PROPANE');
        const result = validateHazardClass(material, '2.1');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 4: UN1950 - validates 2.1 correctly (aerosol)', () => {
        const material = createClass2Material('UN1950', '2.1', 'A6.2', 'AEROSOLS, flammable');
        const result = validateHazardClass(material, '2.1');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 5: UN1954 - validates 2.1 correctly', () => {
        const material = createClass2Material('UN1954', '2.1', 'A6.5', 'COMPRESSED GAS, FLAMMABLE, N.O.S.');
        const result = validateHazardClass(material, '2.1');
        expect(result.isValid).toBe(true);
      });
    });

    describe('Positive Cases - Division 2.2 (Non-flammable, Non-toxic Gases)', () => {
      test('Scenario 6: UN1006 - validates 2.2 correctly', () => {
        const material = createClass2Material('UN1006', '2.2', 'A6.5', 'ARGON, COMPRESSED');
        const result = validateHazardClass(material, '2.2');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 7: UN1013 - validates 2.2 correctly', () => {
        const material = createClass2Material('UN1013', '2.2', 'A6.4', 'CARBON DIOXIDE');
        const result = validateHazardClass(material, '2.2');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 8: UN1066 - validates 2.2 correctly', () => {
        const material = createClass2Material('UN1066', '2.2', 'A6.5', 'NITROGEN, COMPRESSED');
        const result = validateHazardClass(material, '2.2');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 9: UN1072 - validates 2.2 correctly (with subsidiary 5.1)', () => {
        const material = createClass2Material('UN1072', '2.2', 'A6.5', 'OXYGEN, COMPRESSED', '5.1');
        const result = validateHazardClass(material, '2.2');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 10: UN1956 - validates 2.2 correctly', () => {
        const material = createClass2Material('UN1956', '2.2', 'A6.5', 'COMPRESSED GAS, N.O.S.');
        const result = validateHazardClass(material, '2.2');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 11: UN1044 - validates 2.2 correctly', () => {
        const material = createClass2Material('UN1044', '2.2', 'A6.7', 'FIRE EXTINGUISHERS');
        const result = validateHazardClass(material, '2.2');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 12: UN1977 - validates 2.2 correctly', () => {
        const material = createClass2Material('UN1977', '2.2', 'A6.11', 'NITROGEN, REFRIGERATED LIQUID');
        const result = validateHazardClass(material, '2.2');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 13: UN1950 - validates 2.2 correctly (aerosol with subsidiary 8)', () => {
        const material = createClass2Material('UN1950', '2.2', 'A6.2', 'AEROSOLS, non-flammable', '8');
        const result = validateHazardClass(material, '2.2');
        expect(result.isValid).toBe(true);
      });
    });

    describe('Positive Cases - Division 2.3 (Toxic Gases)', () => {
      test('Scenario 14: UN1017 - validates 2.3 correctly (Zone B, subsidiary 5.1, 8)', () => {
        const material = createClass2Material('UN1017', '2.3', 'A6.4', 'CHLORINE', '5.1, 8');
        const result = validateHazardClass(material, '2.3');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 15: UN1053 - validates 2.3 correctly (Zone B, subsidiary 2.1)', () => {
        const material = createClass2Material('UN1053', '2.3', 'A6.4', 'HYDROGEN SULFIDE', '2.1');
        const result = validateHazardClass(material, '2.3');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 16: UN1076 - validates 2.3 correctly (Zone A, subsidiary 8)', () => {
        const material = createClass2Material('UN1076', '2.3', 'A6.15', 'PHOSGENE', '8');
        const result = validateHazardClass(material, '2.3');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 17: UN2199 - validates 2.3 correctly (Zone A, subsidiary 2.1)', () => {
        const material = createClass2Material('UN2199', '2.3', 'A6.15', 'PHOSPHINE', '2.1');
        const result = validateHazardClass(material, '2.3');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 18: UN1955 - validates 2.3 correctly (Zone B)', () => {
        const material = createClass2Material('UN1955', '2.3', 'A6.5', 'COMPRESSED GAS, TOXIC, N.O.S.');
        const result = validateHazardClass(material, '2.3');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 19: UN3160 - validates 2.3 correctly (Zone C, subsidiary 2.1)', () => {
        const material = createClass2Material('UN3160', '2.3', 'A6.4', 'LIQUEFIED GAS, TOXIC, FLAMMABLE, N.O.S.', '2.1');
        const result = validateHazardClass(material, '2.3');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 20: UN3160 - validates 2.3 correctly (Zone D, subsidiary 2.1)', () => {
        const material = createClass2Material('UN3160', '2.3', 'A6.4', 'LIQUEFIED GAS, TOXIC, FLAMMABLE, N.O.S.', '2.1');
        const result = validateHazardClass(material, '2.3');
        expect(result.isValid).toBe(true);
      });
    });

    describe('Negative Cases - From Alterations', () => {
      test('Scenario 2, Alteration 3: rejects 2.2 when 2.1 expected', () => {
        const material = createClass2Material('UN1011', '2.1', 'A6.6', 'BUTANE');
        const result = validateHazardClass(material, '2.2'); // Wrong division
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('2.1');
      });

      test('Scenario 7, Alteration 1: rejects 2.3 when 2.2 expected', () => {
        const material = createClass2Material('UN1013', '2.2', 'A6.4', 'CARBON DIOXIDE');
        const result = validateHazardClass(material, '2.3'); // Wrong division
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('2.2');
      });

      test('Scenario 9, Alteration 3: rejects 5.1 when 2.2 expected (confusion with subsidiary)', () => {
        const material = createClass2Material('UN1072', '2.2', 'A6.5', 'OXYGEN, COMPRESSED', '5.1');
        const result = validateHazardClass(material, '5.1'); // Subsidiary listed as primary
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('2.2');
      });

      test('Scenario 11, Alteration 3: rejects 2.1 when 2.2 expected', () => {
        const material = createClass2Material('UN1044', '2.2', 'A6.7', 'FIRE EXTINGUISHERS');
        const result = validateHazardClass(material, '2.1'); // Wrong division
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('2.2');
      });
    });
  });

  describe('Key 14: Subsidiary Risk Validation', () => {
    describe('Positive Cases - No Subsidiary Risk', () => {
      test('Scenario 1: UN1001 - validates empty subsidiary risk correctly', () => {
        const material = createClass2Material('UN1001', '2.1', 'A6.9', 'ACETYLENE, DISSOLVED');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 2: UN1011 - validates empty subsidiary risk correctly', () => {
        const material = createClass2Material('UN1011', '2.1', 'A6.6', 'BUTANE');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 3: UN1978 - validates empty subsidiary risk correctly', () => {
        const material = createClass2Material('UN1978', '2.1', 'A6.6', 'PROPANE');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 4: UN1950 - validates empty subsidiary risk correctly (flammable aerosol)', () => {
        const material = createClass2Material('UN1950', '2.1', 'A6.2', 'AEROSOLS, flammable');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 5: UN1954 - validates empty subsidiary risk correctly', () => {
        const material = createClass2Material('UN1954', '2.1', 'A6.5', 'COMPRESSED GAS, FLAMMABLE, N.O.S.');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 6: UN1006 - validates empty subsidiary risk correctly', () => {
        const material = createClass2Material('UN1006', '2.2', 'A6.5', 'ARGON, COMPRESSED');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 7: UN1013 - validates empty subsidiary risk correctly', () => {
        const material = createClass2Material('UN1013', '2.2', 'A6.4', 'CARBON DIOXIDE');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 8: UN1066 - validates empty subsidiary risk correctly', () => {
        const material = createClass2Material('UN1066', '2.2', 'A6.5', 'NITROGEN, COMPRESSED');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 10: UN1956 - validates empty subsidiary risk correctly', () => {
        const material = createClass2Material('UN1956', '2.2', 'A6.5', 'COMPRESSED GAS, N.O.S.');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 11: UN1044 - validates empty subsidiary risk correctly', () => {
        const material = createClass2Material('UN1044', '2.2', 'A6.7', 'FIRE EXTINGUISHERS');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 12: UN1977 - validates empty subsidiary risk correctly', () => {
        const material = createClass2Material('UN1977', '2.2', 'A6.11', 'NITROGEN, REFRIGERATED LIQUID');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 18: UN1955 - validates empty subsidiary risk correctly', () => {
        const material = createClass2Material('UN1955', '2.3', 'A6.5', 'COMPRESSED GAS, TOXIC, N.O.S.');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });
    });

    describe('Positive Cases - With Subsidiary Risk', () => {
      test('Scenario 9: UN1072 - validates subsidiary risk 5.1 correctly', () => {
        const material = createClass2Material('UN1072', '2.2', 'A6.5', 'OXYGEN, COMPRESSED', '5.1');
        const result = validateSubsidiaryRisk(material, '5.1');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 13: UN1950 - validates subsidiary risk 8 correctly', () => {
        const material = createClass2Material('UN1950', '2.2', 'A6.2', 'AEROSOLS, non-flammable', '8');
        const result = validateSubsidiaryRisk(material, '8');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 14: UN1017 - validates subsidiary risk 5.1, 8 correctly (multiple)', () => {
        const material = createClass2Material('UN1017', '2.3', 'A6.4', 'CHLORINE', '5.1, 8');
        const result = validateSubsidiaryRisk(material, '5.1, 8');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 15: UN1053 - validates subsidiary risk 2.1 correctly', () => {
        const material = createClass2Material('UN1053', '2.3', 'A6.4', 'HYDROGEN SULFIDE', '2.1');
        const result = validateSubsidiaryRisk(material, '2.1');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 16: UN1076 - validates subsidiary risk 8 correctly', () => {
        const material = createClass2Material('UN1076', '2.3', 'A6.15', 'PHOSGENE', '8');
        const result = validateSubsidiaryRisk(material, '8');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 17: UN2199 - validates subsidiary risk 2.1 correctly', () => {
        const material = createClass2Material('UN2199', '2.3', 'A6.15', 'PHOSPHINE', '2.1');
        const result = validateSubsidiaryRisk(material, '2.1');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 19: UN3160 - validates subsidiary risk 2.1 correctly', () => {
        const material = createClass2Material('UN3160', '2.3', 'A6.4', 'LIQUEFIED GAS, TOXIC, FLAMMABLE, N.O.S.', '2.1');
        const result = validateSubsidiaryRisk(material, '2.1');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 20: UN3160 - validates subsidiary risk 2.1 correctly', () => {
        const material = createClass2Material('UN3160', '2.3', 'A6.4', 'LIQUEFIED GAS, TOXIC, FLAMMABLE, N.O.S.', '2.1');
        const result = validateSubsidiaryRisk(material, '2.1');
        expect(result.isValid).toBe(true);
      });
    });

    describe('Negative Cases - From Alterations', () => {
      test('Scenario 9, Alteration 1: rejects empty when 5.1 expected', () => {
        const material = createClass2Material('UN1072', '2.2', 'A6.5', 'OXYGEN, COMPRESSED', '5.1');
        const result = validateSubsidiaryRisk(material, ''); // Missing subsidiary risk
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('5.1');
      });

      test('Scenario 13, Alteration 1: rejects empty when 8 expected', () => {
        const material = createClass2Material('UN1950', '2.2', 'A6.2', 'AEROSOLS, non-flammable', '8');
        const result = validateSubsidiaryRisk(material, ''); // Missing subsidiary risk
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('8');
      });

      test('Scenario 14, Alteration 3: rejects only 5.1 when 5.1, 8 expected', () => {
        const material = createClass2Material('UN1017', '2.3', 'A6.4', 'CHLORINE', '5.1, 8');
        const result = validateSubsidiaryRisk(material, '5.1'); // Missing 8
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('5.1, 8');
      });

      test('Scenario 15, Alteration 1: rejects empty when 2.1 expected', () => {
        const material = createClass2Material('UN1053', '2.3', 'A6.4', 'HYDROGEN SULFIDE', '2.1');
        const result = validateSubsidiaryRisk(material, ''); // Missing subsidiary risk
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('2.1');
      });

      test('Scenario 17, Alteration 1: rejects empty when 2.1 expected', () => {
        const material = createClass2Material('UN2199', '2.3', 'A6.15', 'PHOSPHINE', '2.1');
        const result = validateSubsidiaryRisk(material, ''); // Missing subsidiary risk
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('2.1');
      });

      test('Scenario 19, Alteration 1: rejects empty when 2.1 expected', () => {
        const material = createClass2Material('UN3160', '2.3', 'A6.4', 'LIQUEFIED GAS, TOXIC, FLAMMABLE, N.O.S.', '2.1');
        const result = validateSubsidiaryRisk(material, ''); // Missing subsidiary risk
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('2.1');
      });
    });
  });

  describe('Key 15: Packing Group Validation', () => {
    describe('Class 2 Special Case - Empty Packing Group', () => {
      test('Scenario 1: UN1001 - accepts empty packing group', () => {
        const material = createClass2Material('UN1001', '2.1', 'A6.9', 'ACETYLENE, DISSOLVED');
        const result = validatePackingGroup(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 2: UN1011 - accepts empty packing group', () => {
        const material = createClass2Material('UN1011', '2.1', 'A6.6', 'BUTANE');
        const result = validatePackingGroup(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 6: UN1006 - accepts empty packing group', () => {
        const material = createClass2Material('UN1006', '2.2', 'A6.5', 'ARGON, COMPRESSED');
        const result = validatePackingGroup(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 14: UN1017 - accepts empty packing group (Division 2.3)', () => {
        const material = createClass2Material('UN1017', '2.3', 'A6.4', 'CHLORINE', '5.1, 8');
        const result = validatePackingGroup(material, '');
        expect(result.isValid).toBe(true);
      });

      test('All Class 2 materials should have empty packing group in Key 15', () => {
        const materials = [
          createClass2Material('UN1001', '2.1', 'A6.9', 'ACETYLENE, DISSOLVED'),
          createClass2Material('UN1011', '2.1', 'A6.6', 'BUTANE'),
          createClass2Material('UN1978', '2.1', 'A6.6', 'PROPANE'),
          createClass2Material('UN1950', '2.1', 'A6.2', 'AEROSOLS, flammable'),
          createClass2Material('UN1006', '2.2', 'A6.5', 'ARGON, COMPRESSED'),
          createClass2Material('UN1017', '2.3', 'A6.4', 'CHLORINE', '5.1, 8'),
        ];

        materials.forEach((material) => {
          const result = validatePackingGroup(material, '');
          expect(result.isValid).toBe(true);
        });
      });
    });
  });

  describe('Key 17: Packaging Instruction Validation', () => {
    describe('Positive Cases - Division 2.1', () => {
      test('Scenario 1: UN1001 - validates A6.9 correctly (Acetylene)', () => {
        const material = createClass2Material('UN1001', '2.1', 'A6.9', 'ACETYLENE, DISSOLVED');
        const result = validatePackingInstruction(material, 'A6.9');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 2: UN1011 - validates A6.6 correctly (LPG)', () => {
        const material = createClass2Material('UN1011', '2.1', 'A6.6', 'BUTANE');
        const result = validatePackingInstruction(material, 'A6.6');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 3: UN1978 - validates A6.6 correctly (LPG)', () => {
        const material = createClass2Material('UN1978', '2.1', 'A6.6', 'PROPANE');
        const result = validatePackingInstruction(material, 'A6.6');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 4: UN1950 - validates A6.2 correctly (Aerosols)', () => {
        const material = createClass2Material('UN1950', '2.1', 'A6.2', 'AEROSOLS, flammable');
        const result = validatePackingInstruction(material, 'A6.2');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 5: UN1954 - validates A6.5 correctly (Nonliquefied)', () => {
        const material = createClass2Material('UN1954', '2.1', 'A6.5', 'COMPRESSED GAS, FLAMMABLE, N.O.S.');
        const result = validatePackingInstruction(material, 'A6.5');
        expect(result.isValid).toBe(true);
      });
    });

    describe('Positive Cases - Division 2.2', () => {
      test('Scenario 6: UN1006 - validates A6.5 correctly (Nonliquefied)', () => {
        const material = createClass2Material('UN1006', '2.2', 'A6.5', 'ARGON, COMPRESSED');
        const result = validatePackingInstruction(material, 'A6.5');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 7: UN1013 - validates A6.4 correctly (Liquefied)', () => {
        const material = createClass2Material('UN1013', '2.2', 'A6.4', 'CARBON DIOXIDE');
        const result = validatePackingInstruction(material, 'A6.4');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 8: UN1066 - validates A6.5 correctly (Nonliquefied)', () => {
        const material = createClass2Material('UN1066', '2.2', 'A6.5', 'NITROGEN, COMPRESSED');
        const result = validatePackingInstruction(material, 'A6.5');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 9: UN1072 - validates A6.5 correctly (Nonliquefied with subsidiary)', () => {
        const material = createClass2Material('UN1072', '2.2', 'A6.5', 'OXYGEN, COMPRESSED', '5.1');
        const result = validatePackingInstruction(material, 'A6.5');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 10: UN1956 - validates A6.5 correctly (Nonliquefied)', () => {
        const material = createClass2Material('UN1956', '2.2', 'A6.5', 'COMPRESSED GAS, N.O.S.');
        const result = validatePackingInstruction(material, 'A6.5');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 11: UN1044 - validates A6.7 correctly (Fire extinguishers)', () => {
        const material = createClass2Material('UN1044', '2.2', 'A6.7', 'FIRE EXTINGUISHERS');
        const result = validatePackingInstruction(material, 'A6.7');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 12: UN1977 - validates A6.11 correctly (Cryogenic)', () => {
        const material = createClass2Material('UN1977', '2.2', 'A6.11', 'NITROGEN, REFRIGERATED LIQUID');
        const result = validatePackingInstruction(material, 'A6.11');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 13: UN1950 - validates A6.2 correctly (Aerosols)', () => {
        const material = createClass2Material('UN1950', '2.2', 'A6.2', 'AEROSOLS, non-flammable', '8');
        const result = validatePackingInstruction(material, 'A6.2');
        expect(result.isValid).toBe(true);
      });
    });

    describe('Positive Cases - Division 2.3', () => {
      test('Scenario 14: UN1017 - validates A6.4 correctly (Liquefied toxic)', () => {
        const material = createClass2Material('UN1017', '2.3', 'A6.4', 'CHLORINE', '5.1, 8');
        const result = validatePackingInstruction(material, 'A6.4');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 15: UN1053 - validates A6.4 correctly (Liquefied toxic)', () => {
        const material = createClass2Material('UN1053', '2.3', 'A6.4', 'HYDROGEN SULFIDE', '2.1');
        const result = validatePackingInstruction(material, 'A6.4');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 16: UN1076 - validates A6.15 correctly (Zone A toxic)', () => {
        const material = createClass2Material('UN1076', '2.3', 'A6.15', 'PHOSGENE', '8');
        const result = validatePackingInstruction(material, 'A6.15');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 17: UN2199 - validates A6.15 correctly (Zone A toxic)', () => {
        const material = createClass2Material('UN2199', '2.3', 'A6.15', 'PHOSPHINE', '2.1');
        const result = validatePackingInstruction(material, 'A6.15');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 18: UN1955 - validates A6.5 correctly (Nonliquefied toxic)', () => {
        const material = createClass2Material('UN1955', '2.3', 'A6.5', 'COMPRESSED GAS, TOXIC, N.O.S.');
        const result = validatePackingInstruction(material, 'A6.5');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 19: UN3160 - validates A6.4 correctly (Liquefied toxic)', () => {
        const material = createClass2Material('UN3160', '2.3', 'A6.4', 'LIQUEFIED GAS, TOXIC, FLAMMABLE, N.O.S.', '2.1');
        const result = validatePackingInstruction(material, 'A6.4');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 20: UN3160 - validates A6.4 correctly (Liquefied toxic)', () => {
        const material = createClass2Material('UN3160', '2.3', 'A6.4', 'LIQUEFIED GAS, TOXIC, FLAMMABLE, N.O.S.', '2.1');
        const result = validatePackingInstruction(material, 'A6.4');
        expect(result.isValid).toBe(true);
      });
    });

    describe('Negative Cases - From Alterations', () => {
      test('Scenario 2, Alteration 1: rejects A6.2 when A6.6 expected', () => {
        const material = createClass2Material('UN1011', '2.1', 'A6.6', 'BUTANE');
        const result = validatePackingInstruction(material, 'A6.2'); // Wrong paragraph
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('A6.6');
      });

      test('Scenario 4, Alteration 1: rejects A6.3 when A6.2 expected', () => {
        const material = createClass2Material('UN1950', '2.1', 'A6.2', 'AEROSOLS, flammable');
        const result = validatePackingInstruction(material, 'A6.3'); // Wrong paragraph
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('A6.2');
      });

      test('Scenario 7, Alteration 2: rejects A6.11 when A6.4 expected', () => {
        const material = createClass2Material('UN1013', '2.2', 'A6.4', 'CARBON DIOXIDE');
        const result = validatePackingInstruction(material, 'A6.11'); // Wrong paragraph
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('A6.4');
      });

      test('Scenario 10, Alteration 3: rejects A6.2 when A6.5 expected', () => {
        const material = createClass2Material('UN1956', '2.2', 'A6.5', 'COMPRESSED GAS, N.O.S.');
        const result = validatePackingInstruction(material, 'A6.2'); // Wrong paragraph
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('A6.5');
      });

      test('Scenario 11, Alteration 2: rejects A6.3 when A6.7 expected', () => {
        const material = createClass2Material('UN1044', '2.2', 'A6.7', 'FIRE EXTINGUISHERS');
        const result = validatePackingInstruction(material, 'A6.3'); // Wrong paragraph
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('A6.7');
      });

      test('Scenario 12, Alteration 3: rejects A6.5 when A6.11 expected', () => {
        const material = createClass2Material('UN1977', '2.2', 'A6.11', 'NITROGEN, REFRIGERATED LIQUID');
        const result = validatePackingInstruction(material, 'A6.5'); // Wrong paragraph
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('A6.11');
      });

      test('Scenario 16, Alteration 2: rejects A6.4 when A6.15 expected', () => {
        const material = createClass2Material('UN1076', '2.3', 'A6.15', 'PHOSGENE', '8');
        const result = validatePackingInstruction(material, 'A6.4'); // Wrong paragraph
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('A6.15');
      });

      test('Scenario 17, Alteration 3: rejects A6.5 when A6.15 expected', () => {
        const material = createClass2Material('UN2199', '2.3', 'A6.15', 'PHOSPHINE', '2.1');
        const result = validatePackingInstruction(material, 'A6.5'); // Wrong paragraph
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('A6.15');
      });
    });

    describe('Normalization', () => {
      test('handles trailing period in paragraph reference', () => {
        const material = createClass2Material('UN1001', '2.1', 'A6.9.', 'ACETYLENE, DISSOLVED');
        const result = validatePackingInstruction(material, 'A6.9');
        expect(result.isValid).toBe(true);
      });

      test('handles case variations', () => {
        const material = createClass2Material('UN1001', '2.1', 'A6.9', 'ACETYLENE, DISSOLVED');
        const result = validatePackingInstruction(material, 'a6.9');
        expect(result.isValid).toBe(true);
      });
    });
  });
});
