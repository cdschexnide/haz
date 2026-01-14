import {
  validateHazardClass,
  validatePackingGroup,
  validatePackingInstruction,
  validateSubsidiaryRisk,
} from '../sddgValidation';
import { HazardousMaterialItem } from '@/hazardousMaterials/hazardousMaterialsList';

// Helper to create minimal HazardousMaterialItem for testing Class 5.1 Oxidizers
function createClass5Material(
  unid: string,
  hazclassDiv: string,
  packagingParagraph: string,
  properShippingName: string,
  packingGroup: string,
  subsidiaryRisk: string = ''
): HazardousMaterialItem {
  return {
    unid,
    hazclassDiv,
    packagingParagraph,
    properShippingName,
    packingGroup, // Class 5.1 HAS packing groups (I, II, III)
    subsidiaryRisk,
    specialProvision: '',
    isTechnicalNameRequired: false,
  } as HazardousMaterialItem;
}

describe('SDDG Validation - Class 5.1 Oxidizers', () => {
  describe('Key 13: Hazard Class Validation', () => {
    describe('Positive Cases - Valid Hazard Classes', () => {
      test('Scenario 1: UN1491 - validates 5.1 correctly (PG I)', () => {
        const material = createClass5Material('UN1491', '5.1', 'A9.6', 'POTASSIUM PEROXIDE', 'I');
        const result = validateHazardClass(material, '5.1');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 2: UN1504 - validates 5.1 correctly (PG I)', () => {
        const material = createClass5Material('UN1504', '5.1', 'A9.6', 'SODIUM PEROXIDE', 'I');
        const result = validateHazardClass(material, '5.1');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 3: UN1873 - validates 5.1 correctly (PG I with 8 subsidiary)', () => {
        const material = createClass5Material(
          'UN1873',
          '5.1',
          'A9.5',
          'PERCHLORIC ACID with more than 50% but 72% or less acid, by mass',
          'I',
          '8'
        );
        const result = validateHazardClass(material, '5.1');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 4: UN2466 - validates 5.1 correctly (PG I)', () => {
        const material = createClass5Material('UN2466', '5.1', 'A9.6', 'POTASSIUM SUPEROXIDE', 'I');
        const result = validateHazardClass(material, '5.1');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 5: UN3139 - validates 5.1 correctly (PG I, N.O.S.)', () => {
        const material = createClass5Material(
          'UN3139',
          '5.1',
          'A9.5',
          'OXIDIZING LIQUID, N.O.S. (Hydrogen Peroxide, Peracetic Acid)',
          'I'
        );
        const result = validateHazardClass(material, '5.1');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 6: UN1745 - validates 5.1 correctly (PG I with 6.1, 8 subsidiaries)', () => {
        const material = createClass5Material('UN1745', '5.1', 'A9.9', 'BROMINE PENTAFLUORIDE', 'I', '6.1, 8');
        const result = validateHazardClass(material, '5.1');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 7: UN1439 - validates 5.1 correctly (PG II)', () => {
        const material = createClass5Material('UN1439', '5.1', 'A9.6', 'AMMONIUM DICHROMATE', 'II');
        const result = validateHazardClass(material, '5.1');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 8: UN1442 - validates 5.1 correctly (PG II)', () => {
        const material = createClass5Material('UN1442', '5.1', 'A9.6', 'AMMONIUM PERCHLORATE', 'II');
        const result = validateHazardClass(material, '5.1');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 9: UN1446 - validates 5.1 correctly (PG II with 6.1 subsidiary)', () => {
        const material = createClass5Material('UN1446', '5.1', 'A9.6', 'BARIUM NITRATE', 'II', '6.1');
        const result = validateHazardClass(material, '5.1');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 10: UN2719 - validates 5.1 correctly (PG II with 6.1 subsidiary)', () => {
        const material = createClass5Material('UN2719', '5.1', 'A9.6', 'BARIUM BROMATE', 'II', '6.1');
        const result = validateHazardClass(material, '5.1');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 11: UN1450 - validates 5.1 correctly (PG II, N.O.S.)', () => {
        const material = createClass5Material(
          'UN1450',
          '5.1',
          'A9.6',
          'BROMATES, INORGANIC, N.O.S. (Magnesium Bromate)',
          'II'
        );
        const result = validateHazardClass(material, '5.1');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 12: UN3212 - validates 5.1 correctly (PG II, N.O.S.)', () => {
        const material = createClass5Material(
          'UN3212',
          '5.1',
          'A9.6',
          'HYPOCHLORITES, INORGANIC, N.O.S. (Lithium Hypochlorite)',
          'II'
        );
        const result = validateHazardClass(material, '5.1');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 13: UN3405 - validates 5.1 correctly (PG II liquid with 6.1 subsidiary)', () => {
        const material = createClass5Material('UN3405', '5.1', 'A9.5', 'BARIUM CHLORATE SOLUTION', 'II', '6.1');
        const result = validateHazardClass(material, '5.1');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 14: UN1479 - validates 5.1 correctly (PG II, N.O.S.)', () => {
        const material = createClass5Material(
          'UN1479',
          '5.1',
          'A9.6',
          'OXIDIZING SOLID, N.O.S. (Calcium Hypochlorite)',
          'II'
        );
        const result = validateHazardClass(material, '5.1');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 15: UN2627 - validates 5.1 correctly (PG II, N.O.S.)', () => {
        const material = createClass5Material(
          'UN2627',
          '5.1',
          'A9.6',
          'NITRITES, INORGANIC, N.O.S. (Sodium Nitrite)',
          'II'
        );
        const result = validateHazardClass(material, '5.1');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 16: UN1438 - validates 5.1 correctly (PG III)', () => {
        const material = createClass5Material('UN1438', '5.1', 'A9.6', 'ALUMINIUM NITRATE', 'III');
        const result = validateHazardClass(material, '5.1');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 17: UN1942 - validates 5.1 correctly (PG III)', () => {
        const material = createClass5Material(
          'UN1942',
          '5.1',
          'A9.6',
          'AMMONIUM NITRATE with 0.2% or less total combustible material',
          'III'
        );
        const result = validateHazardClass(material, '5.1');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 18: UN2067 - validates 5.1 correctly (PG III)', () => {
        const material = createClass5Material('UN2067', '5.1', 'A9.6', 'AMMONIUM NITRATE BASED FERTILIZER', 'III');
        const result = validateHazardClass(material, '5.1');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 19: UN1444 - validates 5.1 correctly (PG III)', () => {
        const material = createClass5Material('UN1444', '5.1', 'A9.6', 'AMMONIUM PERSULPHATE', 'III');
        const result = validateHazardClass(material, '5.1');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 20: UN3219 - validates 5.1 correctly (PG III liquid, N.O.S.)', () => {
        const material = createClass5Material(
          'UN3219',
          '5.1',
          'A9.5',
          'NITRITES, INORGANIC, AQUEOUS SOLUTION, N.O.S. (Potassium Nitrite)',
          'III'
        );
        const result = validateHazardClass(material, '5.1');
        expect(result.isValid).toBe(true);
      });
    });

    describe('Negative Cases - From Alterations', () => {
      test('Scenario 1, Alteration 3: rejects 5 without .1 division', () => {
        const material = createClass5Material('UN1491', '5.1', 'A9.6', 'POTASSIUM PEROXIDE', 'I');
        const result = validateHazardClass(material, '5'); // Missing .1
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('5.1');
      });

      test('Scenario 7, Alteration 2: rejects 5 without .1 division', () => {
        const material = createClass5Material('UN1439', '5.1', 'A9.6', 'AMMONIUM DICHROMATE', 'II');
        const result = validateHazardClass(material, '5'); // Missing .1
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('5.1');
      });

      test('Scenario 17, Alteration 3: rejects 5 without .1 division', () => {
        const material = createClass5Material(
          'UN1942',
          '5.1',
          'A9.6',
          'AMMONIUM NITRATE with 0.2% or less total combustible material',
          'III'
        );
        const result = validateHazardClass(material, '5'); // Missing .1
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('5.1');
      });

      test('rejects wrong division 5.2 when 5.1 expected', () => {
        const material = createClass5Material('UN1491', '5.1', 'A9.6', 'POTASSIUM PEROXIDE', 'I');
        const result = validateHazardClass(material, '5.2'); // Wrong division
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('5.1');
      });

      test('rejects invalid division 5.3', () => {
        const material = createClass5Material('UN1491', '5.1', 'A9.6', 'POTASSIUM PEROXIDE', 'I');
        const result = validateHazardClass(material, '5.3'); // Invalid division
        expect(result.isValid).toBe(false);
      });
    });
  });

  describe('Key 15: Packing Group Validation', () => {
    describe('Positive Cases - PG I Oxidizers', () => {
      test('Scenario 1: UN1491 - validates packing group I correctly', () => {
        const material = createClass5Material('UN1491', '5.1', 'A9.6', 'POTASSIUM PEROXIDE', 'I');
        const result = validatePackingGroup(material, 'I');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 2: UN1504 - validates packing group I correctly', () => {
        const material = createClass5Material('UN1504', '5.1', 'A9.6', 'SODIUM PEROXIDE', 'I');
        const result = validatePackingGroup(material, 'I');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 3: UN1873 - validates packing group I correctly', () => {
        const material = createClass5Material(
          'UN1873',
          '5.1',
          'A9.5',
          'PERCHLORIC ACID with more than 50% but 72% or less acid, by mass',
          'I',
          '8'
        );
        const result = validatePackingGroup(material, 'I');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 4: UN2466 - validates packing group I correctly', () => {
        const material = createClass5Material('UN2466', '5.1', 'A9.6', 'POTASSIUM SUPEROXIDE', 'I');
        const result = validatePackingGroup(material, 'I');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 5: UN3139 - validates packing group I correctly', () => {
        const material = createClass5Material(
          'UN3139',
          '5.1',
          'A9.5',
          'OXIDIZING LIQUID, N.O.S. (Hydrogen Peroxide, Peracetic Acid)',
          'I'
        );
        const result = validatePackingGroup(material, 'I');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 6: UN1745 - validates packing group I correctly', () => {
        const material = createClass5Material('UN1745', '5.1', 'A9.9', 'BROMINE PENTAFLUORIDE', 'I', '6.1, 8');
        const result = validatePackingGroup(material, 'I');
        expect(result.isValid).toBe(true);
      });
    });

    describe('Positive Cases - PG II Oxidizers', () => {
      test('Scenario 7: UN1439 - validates packing group II correctly', () => {
        const material = createClass5Material('UN1439', '5.1', 'A9.6', 'AMMONIUM DICHROMATE', 'II');
        const result = validatePackingGroup(material, 'II');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 8: UN1442 - validates packing group II correctly', () => {
        const material = createClass5Material('UN1442', '5.1', 'A9.6', 'AMMONIUM PERCHLORATE', 'II');
        const result = validatePackingGroup(material, 'II');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 9: UN1446 - validates packing group II correctly', () => {
        const material = createClass5Material('UN1446', '5.1', 'A9.6', 'BARIUM NITRATE', 'II', '6.1');
        const result = validatePackingGroup(material, 'II');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 10: UN2719 - validates packing group II correctly', () => {
        const material = createClass5Material('UN2719', '5.1', 'A9.6', 'BARIUM BROMATE', 'II', '6.1');
        const result = validatePackingGroup(material, 'II');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 11: UN1450 - validates packing group II correctly', () => {
        const material = createClass5Material(
          'UN1450',
          '5.1',
          'A9.6',
          'BROMATES, INORGANIC, N.O.S. (Magnesium Bromate)',
          'II'
        );
        const result = validatePackingGroup(material, 'II');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 12: UN3212 - validates packing group II correctly', () => {
        const material = createClass5Material(
          'UN3212',
          '5.1',
          'A9.6',
          'HYPOCHLORITES, INORGANIC, N.O.S. (Lithium Hypochlorite)',
          'II'
        );
        const result = validatePackingGroup(material, 'II');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 13: UN3405 - validates packing group II correctly', () => {
        const material = createClass5Material('UN3405', '5.1', 'A9.5', 'BARIUM CHLORATE SOLUTION', 'II', '6.1');
        const result = validatePackingGroup(material, 'II');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 14: UN1479 - validates packing group II correctly', () => {
        const material = createClass5Material(
          'UN1479',
          '5.1',
          'A9.6',
          'OXIDIZING SOLID, N.O.S. (Calcium Hypochlorite)',
          'II'
        );
        const result = validatePackingGroup(material, 'II');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 15: UN2627 - validates packing group II correctly', () => {
        const material = createClass5Material(
          'UN2627',
          '5.1',
          'A9.6',
          'NITRITES, INORGANIC, N.O.S. (Sodium Nitrite)',
          'II'
        );
        const result = validatePackingGroup(material, 'II');
        expect(result.isValid).toBe(true);
      });
    });

    describe('Positive Cases - PG III Oxidizers', () => {
      test('Scenario 16: UN1438 - validates packing group III correctly', () => {
        const material = createClass5Material('UN1438', '5.1', 'A9.6', 'ALUMINIUM NITRATE', 'III');
        const result = validatePackingGroup(material, 'III');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 17: UN1942 - validates packing group III correctly', () => {
        const material = createClass5Material(
          'UN1942',
          '5.1',
          'A9.6',
          'AMMONIUM NITRATE with 0.2% or less total combustible material',
          'III'
        );
        const result = validatePackingGroup(material, 'III');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 18: UN2067 - validates packing group III correctly', () => {
        const material = createClass5Material('UN2067', '5.1', 'A9.6', 'AMMONIUM NITRATE BASED FERTILIZER', 'III');
        const result = validatePackingGroup(material, 'III');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 19: UN1444 - validates packing group III correctly', () => {
        const material = createClass5Material('UN1444', '5.1', 'A9.6', 'AMMONIUM PERSULPHATE', 'III');
        const result = validatePackingGroup(material, 'III');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 20: UN3219 - validates packing group III correctly', () => {
        const material = createClass5Material(
          'UN3219',
          '5.1',
          'A9.5',
          'NITRITES, INORGANIC, AQUEOUS SOLUTION, N.O.S. (Potassium Nitrite)',
          'III'
        );
        const result = validatePackingGroup(material, 'III');
        expect(result.isValid).toBe(true);
      });
    });

    describe('Negative Cases - From Alterations', () => {
      test('Scenario 1, Alteration 2: rejects II when I expected', () => {
        const material = createClass5Material('UN1491', '5.1', 'A9.6', 'POTASSIUM PEROXIDE', 'I');
        const result = validatePackingGroup(material, 'II'); // Wrong PG
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('I');
      });

      test('Scenario 4, Alteration 1: rejects empty when I expected', () => {
        const material = createClass5Material('UN2466', '5.1', 'A9.6', 'POTASSIUM SUPEROXIDE', 'I');
        const result = validatePackingGroup(material, ''); // Empty like Class 1 (wrong)
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('I');
      });

      test('Scenario 8, Alteration 2: rejects III when II expected', () => {
        const material = createClass5Material('UN1442', '5.1', 'A9.6', 'AMMONIUM PERCHLORATE', 'II');
        const result = validatePackingGroup(material, 'III'); // Wrong PG
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('II');
      });

      test('Scenario 10, Alteration 3: rejects I when II expected', () => {
        const material = createClass5Material('UN2719', '5.1', 'A9.6', 'BARIUM BROMATE', 'II', '6.1');
        const result = validatePackingGroup(material, 'I'); // Wrong PG
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('II');
      });

      test('Scenario 14, Alteration 2: rejects empty when II expected', () => {
        const material = createClass5Material(
          'UN1479',
          '5.1',
          'A9.6',
          'OXIDIZING SOLID, N.O.S. (Calcium Hypochlorite)',
          'II'
        );
        const result = validatePackingGroup(material, ''); // Empty (wrong)
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('II');
      });

      test('Scenario 16, Alteration 1: rejects II when III expected', () => {
        const material = createClass5Material('UN1438', '5.1', 'A9.6', 'ALUMINIUM NITRATE', 'III');
        const result = validatePackingGroup(material, 'II'); // Wrong PG
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('III');
      });

      test('Scenario 18, Alteration 2: rejects empty when III expected', () => {
        const material = createClass5Material('UN2067', '5.1', 'A9.6', 'AMMONIUM NITRATE BASED FERTILIZER', 'III');
        const result = validatePackingGroup(material, ''); // Empty (wrong)
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('III');
      });
    });
  });

  describe('Key 17: Packaging Instruction Validation', () => {
    describe('Positive Cases - A9.6 (Solids)', () => {
      test('Scenario 1: UN1491 - validates A9.6 correctly', () => {
        const material = createClass5Material('UN1491', '5.1', 'A9.6', 'POTASSIUM PEROXIDE', 'I');
        const result = validatePackingInstruction(material, 'A9.6');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 2: UN1504 - validates A9.6 correctly', () => {
        const material = createClass5Material('UN1504', '5.1', 'A9.6', 'SODIUM PEROXIDE', 'I');
        const result = validatePackingInstruction(material, 'A9.6');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 4: UN2466 - validates A9.6 correctly', () => {
        const material = createClass5Material('UN2466', '5.1', 'A9.6', 'POTASSIUM SUPEROXIDE', 'I');
        const result = validatePackingInstruction(material, 'A9.6');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 7: UN1439 - validates A9.6 correctly', () => {
        const material = createClass5Material('UN1439', '5.1', 'A9.6', 'AMMONIUM DICHROMATE', 'II');
        const result = validatePackingInstruction(material, 'A9.6');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 8: UN1442 - validates A9.6 correctly', () => {
        const material = createClass5Material('UN1442', '5.1', 'A9.6', 'AMMONIUM PERCHLORATE', 'II');
        const result = validatePackingInstruction(material, 'A9.6');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 9: UN1446 - validates A9.6 correctly', () => {
        const material = createClass5Material('UN1446', '5.1', 'A9.6', 'BARIUM NITRATE', 'II', '6.1');
        const result = validatePackingInstruction(material, 'A9.6');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 10: UN2719 - validates A9.6 correctly', () => {
        const material = createClass5Material('UN2719', '5.1', 'A9.6', 'BARIUM BROMATE', 'II', '6.1');
        const result = validatePackingInstruction(material, 'A9.6');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 11: UN1450 - validates A9.6 correctly', () => {
        const material = createClass5Material(
          'UN1450',
          '5.1',
          'A9.6',
          'BROMATES, INORGANIC, N.O.S. (Magnesium Bromate)',
          'II'
        );
        const result = validatePackingInstruction(material, 'A9.6');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 12: UN3212 - validates A9.6 correctly', () => {
        const material = createClass5Material(
          'UN3212',
          '5.1',
          'A9.6',
          'HYPOCHLORITES, INORGANIC, N.O.S. (Lithium Hypochlorite)',
          'II'
        );
        const result = validatePackingInstruction(material, 'A9.6');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 14: UN1479 - validates A9.6 correctly', () => {
        const material = createClass5Material(
          'UN1479',
          '5.1',
          'A9.6',
          'OXIDIZING SOLID, N.O.S. (Calcium Hypochlorite)',
          'II'
        );
        const result = validatePackingInstruction(material, 'A9.6');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 15: UN2627 - validates A9.6 correctly', () => {
        const material = createClass5Material(
          'UN2627',
          '5.1',
          'A9.6',
          'NITRITES, INORGANIC, N.O.S. (Sodium Nitrite)',
          'II'
        );
        const result = validatePackingInstruction(material, 'A9.6');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 16: UN1438 - validates A9.6 correctly', () => {
        const material = createClass5Material('UN1438', '5.1', 'A9.6', 'ALUMINIUM NITRATE', 'III');
        const result = validatePackingInstruction(material, 'A9.6');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 17: UN1942 - validates A9.6 correctly', () => {
        const material = createClass5Material(
          'UN1942',
          '5.1',
          'A9.6',
          'AMMONIUM NITRATE with 0.2% or less total combustible material',
          'III'
        );
        const result = validatePackingInstruction(material, 'A9.6');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 18: UN2067 - validates A9.6 correctly', () => {
        const material = createClass5Material('UN2067', '5.1', 'A9.6', 'AMMONIUM NITRATE BASED FERTILIZER', 'III');
        const result = validatePackingInstruction(material, 'A9.6');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 19: UN1444 - validates A9.6 correctly', () => {
        const material = createClass5Material('UN1444', '5.1', 'A9.6', 'AMMONIUM PERSULPHATE', 'III');
        const result = validatePackingInstruction(material, 'A9.6');
        expect(result.isValid).toBe(true);
      });
    });

    describe('Positive Cases - A9.5 (Liquids)', () => {
      test('Scenario 3: UN1873 - validates A9.5 correctly', () => {
        const material = createClass5Material(
          'UN1873',
          '5.1',
          'A9.5',
          'PERCHLORIC ACID with more than 50% but 72% or less acid, by mass',
          'I',
          '8'
        );
        const result = validatePackingInstruction(material, 'A9.5');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 5: UN3139 - validates A9.5 correctly', () => {
        const material = createClass5Material(
          'UN3139',
          '5.1',
          'A9.5',
          'OXIDIZING LIQUID, N.O.S. (Hydrogen Peroxide, Peracetic Acid)',
          'I'
        );
        const result = validatePackingInstruction(material, 'A9.5');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 13: UN3405 - validates A9.5 correctly', () => {
        const material = createClass5Material('UN3405', '5.1', 'A9.5', 'BARIUM CHLORATE SOLUTION', 'II', '6.1');
        const result = validatePackingInstruction(material, 'A9.5');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 20: UN3219 - validates A9.5 correctly', () => {
        const material = createClass5Material(
          'UN3219',
          '5.1',
          'A9.5',
          'NITRITES, INORGANIC, AQUEOUS SOLUTION, N.O.S. (Potassium Nitrite)',
          'III'
        );
        const result = validatePackingInstruction(material, 'A9.5');
        expect(result.isValid).toBe(true);
      });
    });

    describe('Positive Cases - A9.9 (Special)', () => {
      test('Scenario 6: UN1745 - validates A9.9 correctly', () => {
        const material = createClass5Material('UN1745', '5.1', 'A9.9', 'BROMINE PENTAFLUORIDE', 'I', '6.1, 8');
        const result = validatePackingInstruction(material, 'A9.9');
        expect(result.isValid).toBe(true);
      });
    });

    describe('Negative Cases - From Alterations', () => {
      test('Scenario 5, Alteration 3: rejects A9.6 when A9.5 expected (liquid)', () => {
        const material = createClass5Material(
          'UN3139',
          '5.1',
          'A9.5',
          'OXIDIZING LIQUID, N.O.S. (Hydrogen Peroxide, Peracetic Acid)',
          'I'
        );
        const result = validatePackingInstruction(material, 'A9.6'); // Wrong - solid vs liquid
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('A9.5');
      });

      test('Scenario 12, Alteration 3: rejects A9.5 when A9.6 expected', () => {
        const material = createClass5Material(
          'UN3212',
          '5.1',
          'A9.6',
          'HYPOCHLORITES, INORGANIC, N.O.S. (Lithium Hypochlorite)',
          'II'
        );
        const result = validatePackingInstruction(material, 'A9.5'); // Wrong
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('A9.6');
      });

      test('Scenario 13, Alteration 1: rejects A9.6 when A9.5 expected', () => {
        const material = createClass5Material('UN3405', '5.1', 'A9.5', 'BARIUM CHLORATE SOLUTION', 'II', '6.1');
        const result = validatePackingInstruction(material, 'A9.6'); // Wrong - liquid needs A9.5
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('A9.5');
      });

      test('Scenario 20, Alteration 2: rejects A9.6 when A9.5 expected', () => {
        const material = createClass5Material(
          'UN3219',
          '5.1',
          'A9.5',
          'NITRITES, INORGANIC, AQUEOUS SOLUTION, N.O.S. (Potassium Nitrite)',
          'III'
        );
        const result = validatePackingInstruction(material, 'A9.6'); // Wrong - liquid needs A9.5
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('A9.5');
      });

      test('rejects A5.xx packaging (wrong class - Class 1)', () => {
        const material = createClass5Material('UN1491', '5.1', 'A9.6', 'POTASSIUM PEROXIDE', 'I');
        const result = validatePackingInstruction(material, 'A5.2'); // Wrong class entirely
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('A9.6');
      });
    });

    describe('Normalization', () => {
      test('handles trailing period in paragraph reference', () => {
        const material = createClass5Material('UN1491', '5.1', 'A9.6.', 'POTASSIUM PEROXIDE', 'I');
        const result = validatePackingInstruction(material, 'A9.6');
        expect(result.isValid).toBe(true);
      });

      test('handles case variations', () => {
        const material = createClass5Material('UN1491', '5.1', 'A9.6', 'POTASSIUM PEROXIDE', 'I');
        const result = validatePackingInstruction(material, 'a9.6');
        expect(result.isValid).toBe(true);
      });
    });
  });

  describe('Key 14: Subsidiary Risk Validation', () => {
    describe('Positive Cases - No Subsidiary Risk', () => {
      test('Scenario 1: UN1491 - validates empty subsidiary risk correctly', () => {
        const material = createClass5Material('UN1491', '5.1', 'A9.6', 'POTASSIUM PEROXIDE', 'I');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 2: UN1504 - validates empty subsidiary risk correctly', () => {
        const material = createClass5Material('UN1504', '5.1', 'A9.6', 'SODIUM PEROXIDE', 'I');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 4: UN2466 - validates empty subsidiary risk correctly', () => {
        const material = createClass5Material('UN2466', '5.1', 'A9.6', 'POTASSIUM SUPEROXIDE', 'I');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 5: UN3139 - validates empty subsidiary risk correctly', () => {
        const material = createClass5Material(
          'UN3139',
          '5.1',
          'A9.5',
          'OXIDIZING LIQUID, N.O.S. (Hydrogen Peroxide, Peracetic Acid)',
          'I'
        );
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 7: UN1439 - validates empty subsidiary risk correctly', () => {
        const material = createClass5Material('UN1439', '5.1', 'A9.6', 'AMMONIUM DICHROMATE', 'II');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 8: UN1442 - validates empty subsidiary risk correctly', () => {
        const material = createClass5Material('UN1442', '5.1', 'A9.6', 'AMMONIUM PERCHLORATE', 'II');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 11: UN1450 - validates empty subsidiary risk correctly', () => {
        const material = createClass5Material(
          'UN1450',
          '5.1',
          'A9.6',
          'BROMATES, INORGANIC, N.O.S. (Magnesium Bromate)',
          'II'
        );
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 12: UN3212 - validates empty subsidiary risk correctly', () => {
        const material = createClass5Material(
          'UN3212',
          '5.1',
          'A9.6',
          'HYPOCHLORITES, INORGANIC, N.O.S. (Lithium Hypochlorite)',
          'II'
        );
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 14: UN1479 - validates empty subsidiary risk correctly', () => {
        const material = createClass5Material(
          'UN1479',
          '5.1',
          'A9.6',
          'OXIDIZING SOLID, N.O.S. (Calcium Hypochlorite)',
          'II'
        );
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 15: UN2627 - validates empty subsidiary risk correctly', () => {
        const material = createClass5Material(
          'UN2627',
          '5.1',
          'A9.6',
          'NITRITES, INORGANIC, N.O.S. (Sodium Nitrite)',
          'II'
        );
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 16: UN1438 - validates empty subsidiary risk correctly', () => {
        const material = createClass5Material('UN1438', '5.1', 'A9.6', 'ALUMINIUM NITRATE', 'III');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 17: UN1942 - validates empty subsidiary risk correctly', () => {
        const material = createClass5Material(
          'UN1942',
          '5.1',
          'A9.6',
          'AMMONIUM NITRATE with 0.2% or less total combustible material',
          'III'
        );
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 18: UN2067 - validates empty subsidiary risk correctly', () => {
        const material = createClass5Material('UN2067', '5.1', 'A9.6', 'AMMONIUM NITRATE BASED FERTILIZER', 'III');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 19: UN1444 - validates empty subsidiary risk correctly', () => {
        const material = createClass5Material('UN1444', '5.1', 'A9.6', 'AMMONIUM PERSULPHATE', 'III');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 20: UN3219 - validates empty subsidiary risk correctly', () => {
        const material = createClass5Material(
          'UN3219',
          '5.1',
          'A9.5',
          'NITRITES, INORGANIC, AQUEOUS SOLUTION, N.O.S. (Potassium Nitrite)',
          'III'
        );
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });
    });

    describe('Positive Cases - With Single Subsidiary Risk (8 or 6.1)', () => {
      test('Scenario 3: UN1873 - validates subsidiary risk 8 correctly', () => {
        const material = createClass5Material(
          'UN1873',
          '5.1',
          'A9.5',
          'PERCHLORIC ACID with more than 50% but 72% or less acid, by mass',
          'I',
          '8'
        );
        const result = validateSubsidiaryRisk(material, '8');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 9: UN1446 - validates subsidiary risk 6.1 correctly', () => {
        const material = createClass5Material('UN1446', '5.1', 'A9.6', 'BARIUM NITRATE', 'II', '6.1');
        const result = validateSubsidiaryRisk(material, '6.1');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 10: UN2719 - validates subsidiary risk 6.1 correctly', () => {
        const material = createClass5Material('UN2719', '5.1', 'A9.6', 'BARIUM BROMATE', 'II', '6.1');
        const result = validateSubsidiaryRisk(material, '6.1');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 13: UN3405 - validates subsidiary risk 6.1 correctly', () => {
        const material = createClass5Material('UN3405', '5.1', 'A9.5', 'BARIUM CHLORATE SOLUTION', 'II', '6.1');
        const result = validateSubsidiaryRisk(material, '6.1');
        expect(result.isValid).toBe(true);
      });
    });

    describe('Positive Cases - With Multiple Subsidiary Risks', () => {
      test('Scenario 6: UN1745 - validates multiple subsidiary risks 6.1, 8 correctly', () => {
        const material = createClass5Material('UN1745', '5.1', 'A9.9', 'BROMINE PENTAFLUORIDE', 'I', '6.1, 8');
        const result = validateSubsidiaryRisk(material, '6.1, 8');
        expect(result.isValid).toBe(true);
      });
    });

    describe('Negative Cases - From Alterations', () => {
      test('Scenario 3, Alteration 1: rejects empty when 8 expected', () => {
        const material = createClass5Material(
          'UN1873',
          '5.1',
          'A9.5',
          'PERCHLORIC ACID with more than 50% but 72% or less acid, by mass',
          'I',
          '8'
        );
        const result = validateSubsidiaryRisk(material, ''); // Missing subsidiary
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('8');
      });

      test('Scenario 6, Alteration 2: rejects 6.1 only when 6.1, 8 expected', () => {
        const material = createClass5Material('UN1745', '5.1', 'A9.9', 'BROMINE PENTAFLUORIDE', 'I', '6.1, 8');
        const result = validateSubsidiaryRisk(material, '6.1'); // Missing 8
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('6.1, 8');
      });

      test('Scenario 9, Alteration 1: rejects empty when 6.1 expected', () => {
        const material = createClass5Material('UN1446', '5.1', 'A9.6', 'BARIUM NITRATE', 'II', '6.1');
        const result = validateSubsidiaryRisk(material, ''); // Missing subsidiary
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('6.1');
      });

      test('Scenario 9, Alteration 3: rejects wrong PG code when subsidiary validated', () => {
        const material = createClass5Material('UN1446', '5.1', 'A9.6', 'BARIUM NITRATE', 'II', '6.1');
        const result = validateSubsidiaryRisk(material, '6.2'); // Wrong subsidiary
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('6.1');
      });

      test('Scenario 13, Alteration 3: rejects empty when 6.1 expected', () => {
        const material = createClass5Material('UN3405', '5.1', 'A9.5', 'BARIUM CHLORATE SOLUTION', 'II', '6.1');
        const result = validateSubsidiaryRisk(material, ''); // Missing subsidiary
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('6.1');
      });
    });
  });
});
