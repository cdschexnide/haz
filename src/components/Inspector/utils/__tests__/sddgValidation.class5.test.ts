import {
  validateAircraftType,
  validateHazardClass,
  validatePackingGroup,
  validatePackingInstruction,
  validateProperShippingName,
  validateSubsidiaryRisk,
  validateUnidNumber,
  validateSDDGInspection,
  SDDGValidationResult,
} from '../sddgValidation';
import { HazardousMaterialItem } from '@/hazardousMaterials/hazardousMaterialsList';
import { ExtractedSDDGContent } from '@/types/sddg';

// Helper to create minimal HazardousMaterialItem for testing Class 5.1 Oxidizers
function createClass5Material(
  unid: string,
  hazclassDiv: string,
  packagingParagraph: string,
  properShippingName: string,
  packingGroup: string,
  subsidiaryRisk: string = '',
  specialProvision: string = ''
): HazardousMaterialItem {
  return {
    unid,
    hazclassDiv,
    packagingParagraph,
    properShippingName,
    packingGroup, // Class 5.1 HAS packing groups (I, II, III)
    subsidiaryRisk,
    specialProvision,
    isTechnicalNameRequired: false,
  } as HazardousMaterialItem;
}

// Helper to create ExtractedSDDGContent for unified validation testing
function createSDDGContent(overrides: Partial<ExtractedSDDGContent>): ExtractedSDDGContent {
  return {
    shipper: '',
    consignee: '',
    airWaybillNumber: '',
    pagination: '',
    shippersReferenceNumber: '',
    inspectionActivity: '',
    aircraftType: '',
    airportOfDeparture: '',
    airportOfDestination: '',
    shipmentType: '',
    unIdNo: '',
    properShippingName: '',
    hazardClass: '',
    subsidiaryRisk: '',
    packingGroup: '',
    quantityAndPacking: '',
    packingInstruction: '',
    authorization: '',
    additionalHandlingInfo: '',
    nameOfSignatory: '',
    placeAndDate: '',
    signature: '',
    ...overrides,
  };
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

  describe('Key 7: Aircraft Type Validation', () => {
    describe('Positive Cases - Cargo Aircraft Only (P1-P4)', () => {
      test('Scenario 2: UN1504 - validates CAO with P3 special provision', () => {
        const material = createClass5Material(
          'UN1504', '5.1', 'A9.6', 'SODIUM PEROXIDE', 'I', '', 'P3'
        );
        const result = validateAircraftType(material, 'CARGO AIRCRAFT ONLY');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 3: UN1873 - validates CAO with P3 special provision', () => {
        const material = createClass5Material(
          'UN1873', '5.1', 'A9.5',
          'PERCHLORIC ACID with more than 50% but 72% or less acid, by mass',
          'I', '8', 'P3'
        );
        const result = validateAircraftType(material, 'CARGO AIRCRAFT ONLY');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 5: UN3139 - validates CAO with P3 special provision (N.O.S.)', () => {
        const material = createClass5Material(
          'UN3139', '5.1', 'A9.5',
          'OXIDIZING LIQUID, N.O.S. (Hydrogen Peroxide, Peracetic Acid)',
          'I', '', 'P3'
        );
        const result = validateAircraftType(material, 'CARGO AIRCRAFT ONLY');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 6: UN1745 - validates CAO with P1 special provision', () => {
        const material = createClass5Material(
          'UN1745', '5.1', 'A9.9', 'BROMINE PENTAFLUORIDE', 'I', '6.1, 8', 'P1'
        );
        const result = validateAircraftType(material, 'CARGO AIRCRAFT ONLY');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 10: UN2719 - validates CAO with P4 special provision', () => {
        const material = createClass5Material(
          'UN2719', '5.1', 'A9.6', 'BARIUM BROMATE', 'II', '6.1', 'P4'
        );
        const result = validateAircraftType(material, 'CARGO AIRCRAFT ONLY');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 13: UN3405 - validates CAO with P4 special provision', () => {
        const material = createClass5Material(
          'UN3405', '5.1', 'A9.5', 'BARIUM CHLORATE SOLUTION', 'II', '6.1', 'P4'
        );
        const result = validateAircraftType(material, 'CARGO AIRCRAFT ONLY');
        expect(result.isValid).toBe(true);
      });
    });

    describe('Positive Cases - Passenger and Cargo Aircraft (P5)', () => {
      test('Scenario 4: UN2466 - validates Passenger and Cargo with P5 special provision', () => {
        const material = createClass5Material(
          'UN2466', '5.1', 'A9.6', 'POTASSIUM SUPEROXIDE', 'I', '', 'P5'
        );
        const result = validateAircraftType(material, 'PASSENGER AND CARGO AIRCRAFT');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 7: UN1439 - validates Passenger and Cargo with P5 special provision', () => {
        const material = createClass5Material(
          'UN1439', '5.1', 'A9.6', 'AMMONIUM DICHROMATE', 'II', '', 'P5'
        );
        const result = validateAircraftType(material, 'PASSENGER AND CARGO AIRCRAFT');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 8: UN1442 - validates Passenger and Cargo with P5 special provision', () => {
        const material = createClass5Material(
          'UN1442', '5.1', 'A9.6', 'AMMONIUM PERCHLORATE', 'II', '', 'P5'
        );
        const result = validateAircraftType(material, 'PASSENGER AND CARGO AIRCRAFT');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 9: UN1446 - validates Passenger and Cargo with P5 special provision', () => {
        const material = createClass5Material(
          'UN1446', '5.1', 'A9.6', 'BARIUM NITRATE', 'II', '6.1', 'P5'
        );
        const result = validateAircraftType(material, 'PASSENGER AND CARGO AIRCRAFT');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 16: UN1438 - validates Passenger and Cargo with P5 special provision', () => {
        const material = createClass5Material(
          'UN1438', '5.1', 'A9.6', 'ALUMINIUM NITRATE', 'III', '', 'P5'
        );
        const result = validateAircraftType(material, 'PASSENGER AND CARGO AIRCRAFT');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 17: UN1942 - validates Passenger and Cargo with P5 special provision', () => {
        const material = createClass5Material(
          'UN1942', '5.1', 'A9.6',
          'AMMONIUM NITRATE with 0.2% or less total combustible material',
          'III', '', 'P5'
        );
        const result = validateAircraftType(material, 'PASSENGER AND CARGO AIRCRAFT');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 19: UN1444 - validates Passenger and Cargo with P5 special provision', () => {
        const material = createClass5Material(
          'UN1444', '5.1', 'A9.6', 'AMMONIUM PERSULPHATE', 'III', '', 'P5'
        );
        const result = validateAircraftType(material, 'PASSENGER AND CARGO AIRCRAFT');
        expect(result.isValid).toBe(true);
      });
    });

    describe('Negative Cases - From Alterations', () => {
      test('Scenario 2, Alteration 2: rejects Passenger and Cargo when P3 requires CAO', () => {
        const material = createClass5Material(
          'UN1504', '5.1', 'A9.6', 'SODIUM PEROXIDE', 'I', '', 'P3'
        );
        const result = validateAircraftType(material, 'PASSENGER AND CARGO AIRCRAFT');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('CARGO AIRCRAFT ONLY');
      });

      test('Scenario 10, Alteration 1: rejects Passenger and Cargo when P4 requires CAO', () => {
        const material = createClass5Material(
          'UN2719', '5.1', 'A9.6', 'BARIUM BROMATE', 'II', '6.1', 'P4'
        );
        const result = validateAircraftType(material, 'PASSENGER AND CARGO AIRCRAFT');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('CARGO AIRCRAFT ONLY');
      });

      test('Scenario 19, Alteration 3: rejects CAO when P5 allows passenger', () => {
        const material = createClass5Material(
          'UN1444', '5.1', 'A9.6', 'AMMONIUM PERSULPHATE', 'III', '', 'P5'
        );
        const result = validateAircraftType(material, 'CARGO AIRCRAFT ONLY');
        expect(result.isValid).toBe(false);
      });
    });
  });

  describe('Key 11: UN/ID Number Validation', () => {
    describe('Positive Cases - Matching UN Numbers', () => {
      test('Scenario 1: UN1491 - validates UN number correctly', () => {
        const material = createClass5Material('UN1491', '5.1', 'A9.6', 'POTASSIUM PEROXIDE', 'I');
        const result = validateUnidNumber(material, 'UN1491');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 2: UN1504 - validates UN number correctly', () => {
        const material = createClass5Material('UN1504', '5.1', 'A9.6', 'SODIUM PEROXIDE', 'I');
        const result = validateUnidNumber(material, 'UN1504');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 5: UN3139 - validates UN number correctly (N.O.S.)', () => {
        const material = createClass5Material(
          'UN3139', '5.1', 'A9.5',
          'OXIDIZING LIQUID, N.O.S. (Hydrogen Peroxide, Peracetic Acid)',
          'I'
        );
        const result = validateUnidNumber(material, 'UN3139');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 7: UN1439 - validates UN number correctly', () => {
        const material = createClass5Material('UN1439', '5.1', 'A9.6', 'AMMONIUM DICHROMATE', 'II');
        const result = validateUnidNumber(material, 'UN1439');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 11: UN1450 - validates UN number correctly (N.O.S.)', () => {
        const material = createClass5Material(
          'UN1450', '5.1', 'A9.6',
          'BROMATES, INORGANIC, N.O.S. (Magnesium Bromate)',
          'II'
        );
        const result = validateUnidNumber(material, 'UN1450');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 17: UN1942 - validates UN number correctly', () => {
        const material = createClass5Material(
          'UN1942', '5.1', 'A9.6',
          'AMMONIUM NITRATE with 0.2% or less total combustible material',
          'III'
        );
        const result = validateUnidNumber(material, 'UN1942');
        expect(result.isValid).toBe(true);
      });

      test('handles lowercase UN prefix', () => {
        const material = createClass5Material('UN1491', '5.1', 'A9.6', 'POTASSIUM PEROXIDE', 'I');
        const result = validateUnidNumber(material, 'un1491');
        expect(result.isValid).toBe(true);
      });
    });

    describe('Negative Cases - From Alterations', () => {
      test('Scenario 4, Alteration 2: rejects UN2446 when UN2466 expected (transposition)', () => {
        const material = createClass5Material('UN2466', '5.1', 'A9.6', 'POTASSIUM SUPEROXIDE', 'I');
        const result = validateUnidNumber(material, 'UN2446');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('UN2466');
      });

      test('Scenario 8, Alteration 1: rejects UN1443 when UN1442 expected', () => {
        const material = createClass5Material('UN1442', '5.1', 'A9.6', 'AMMONIUM PERCHLORATE', 'II');
        const result = validateUnidNumber(material, 'UN1443');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('UN1442');
      });

      test('Scenario 12, Alteration 2: rejects UN3112 when UN3212 expected (digit transposition)', () => {
        const material = createClass5Material(
          'UN3212', '5.1', 'A9.6',
          'HYPOCHLORITES, INORGANIC, N.O.S. (Lithium Hypochlorite)',
          'II'
        );
        const result = validateUnidNumber(material, 'UN3112');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('UN3212');
      });

      test('Scenario 17, Alteration 2: rejects UN1492 when UN1942 expected (similar number)', () => {
        const material = createClass5Material(
          'UN1942', '5.1', 'A9.6',
          'AMMONIUM NITRATE with 0.2% or less total combustible material',
          'III'
        );
        const result = validateUnidNumber(material, 'UN1492');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('UN1942');
      });

      test('rejects missing UN prefix', () => {
        const material = createClass5Material('UN1491', '5.1', 'A9.6', 'POTASSIUM PEROXIDE', 'I');
        const result = validateUnidNumber(material, '1491');
        expect(result.isValid).toBe(false);
      });
    });
  });

  describe('Key 12: Proper Shipping Name Validation', () => {
    describe('Positive Cases - Matching PSN', () => {
      test('Scenario 1: UN1491 - validates PSN correctly', () => {
        const material = createClass5Material('UN1491', '5.1', 'A9.6', 'POTASSIUM PEROXIDE', 'I');
        const result = validateProperShippingName(material, 'POTASSIUM PEROXIDE');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 2: UN1504 - validates PSN correctly', () => {
        const material = createClass5Material('UN1504', '5.1', 'A9.6', 'SODIUM PEROXIDE', 'I');
        const result = validateProperShippingName(material, 'SODIUM PEROXIDE');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 3: UN1873 - validates PSN with concentration details', () => {
        const material = createClass5Material(
          'UN1873', '5.1', 'A9.5',
          'PERCHLORIC ACID with more than 50% but 72% or less acid, by mass',
          'I', '8'
        );
        const result = validateProperShippingName(
          material,
          'PERCHLORIC ACID with more than 50% but 72% or less acid, by mass'
        );
        expect(result.isValid).toBe(true);
      });

      test('Scenario 6: UN1745 - validates PSN correctly', () => {
        const material = createClass5Material('UN1745', '5.1', 'A9.9', 'BROMINE PENTAFLUORIDE', 'I', '6.1, 8');
        const result = validateProperShippingName(material, 'BROMINE PENTAFLUORIDE');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 7: UN1439 - validates PSN correctly', () => {
        const material = createClass5Material('UN1439', '5.1', 'A9.6', 'AMMONIUM DICHROMATE', 'II');
        const result = validateProperShippingName(material, 'AMMONIUM DICHROMATE');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 17: UN1942 - validates PSN with concentration details', () => {
        const material = createClass5Material(
          'UN1942', '5.1', 'A9.6',
          'AMMONIUM NITRATE with 0.2% or less total combustible material, including any organic substance calculated as carbon, to the exclusion of any other added substance',
          'III'
        );
        const result = validateProperShippingName(
          material,
          'AMMONIUM NITRATE with 0.2% or less total combustible material, including any organic substance calculated as carbon, to the exclusion of any other added substance'
        );
        expect(result.isValid).toBe(true);
      });

      test('Scenario 18: UN2067 - validates PSN correctly', () => {
        const material = createClass5Material('UN2067', '5.1', 'A9.6', 'AMMONIUM NITRATE BASED FERTILIZER', 'III');
        const result = validateProperShippingName(material, 'AMMONIUM NITRATE BASED FERTILIZER');
        expect(result.isValid).toBe(true);
      });

      test('handles case insensitivity', () => {
        const material = createClass5Material('UN1491', '5.1', 'A9.6', 'POTASSIUM PEROXIDE', 'I');
        const result = validateProperShippingName(material, 'Potassium Peroxide');
        expect(result.isValid).toBe(true);
      });
    });

    describe('N.O.S. Technical Name Cases', () => {
      test('Scenario 5: validates N.O.S. PSN with technical name', () => {
        const material = createClass5Material(
          'UN3139', '5.1', 'A9.5',
          'OXIDIZING LIQUID, N.O.S. (Hydrogen Peroxide, Peracetic Acid)',
          'I'
        );
        const result = validateProperShippingName(
          material,
          'OXIDIZING LIQUID, N.O.S. (Hydrogen Peroxide, Peracetic Acid)'
        );
        expect(result.isValid).toBe(true);
      });

      test('Scenario 11: validates N.O.S. PSN with technical name', () => {
        const material = createClass5Material(
          'UN1450', '5.1', 'A9.6',
          'BROMATES, INORGANIC, N.O.S. (Magnesium Bromate)',
          'II'
        );
        const result = validateProperShippingName(
          material,
          'BROMATES, INORGANIC, N.O.S. (Magnesium Bromate)'
        );
        expect(result.isValid).toBe(true);
      });

      test('Scenario 12: validates N.O.S. PSN with technical name', () => {
        const material = createClass5Material(
          'UN3212', '5.1', 'A9.6',
          'HYPOCHLORITES, INORGANIC, N.O.S. (Lithium Hypochlorite)',
          'II'
        );
        const result = validateProperShippingName(
          material,
          'HYPOCHLORITES, INORGANIC, N.O.S. (Lithium Hypochlorite)'
        );
        expect(result.isValid).toBe(true);
      });

      test('Scenario 14: validates N.O.S. PSN with technical name', () => {
        const material = createClass5Material(
          'UN1479', '5.1', 'A9.6',
          'OXIDIZING SOLID, N.O.S. (Calcium Hypochlorite)',
          'II'
        );
        const result = validateProperShippingName(
          material,
          'OXIDIZING SOLID, N.O.S. (Calcium Hypochlorite)'
        );
        expect(result.isValid).toBe(true);
      });

      test('Scenario 15: validates N.O.S. PSN with technical name', () => {
        const material = createClass5Material(
          'UN2627', '5.1', 'A9.6',
          'NITRITES, INORGANIC, N.O.S. (Sodium Nitrite)',
          'II'
        );
        const result = validateProperShippingName(
          material,
          'NITRITES, INORGANIC, N.O.S. (Sodium Nitrite)'
        );
        expect(result.isValid).toBe(true);
      });

      test('Scenario 20: validates N.O.S. aqueous solution PSN with technical name', () => {
        const material = createClass5Material(
          'UN3219', '5.1', 'A9.5',
          'NITRITES, INORGANIC, AQUEOUS SOLUTION, N.O.S. (Potassium Nitrite)',
          'III'
        );
        const result = validateProperShippingName(
          material,
          'NITRITES, INORGANIC, AQUEOUS SOLUTION, N.O.S. (Potassium Nitrite)'
        );
        expect(result.isValid).toBe(true);
      });
    });

    describe('Negative Cases - From Alterations', () => {
      test('Scenario 3, Alteration 3: rejects PSN missing concentration details', () => {
        const material = createClass5Material(
          'UN1873', '5.1', 'A9.5',
          'PERCHLORIC ACID with more than 50% but 72% or less acid, by mass',
          'I', '8'
        );
        const result = validateProperShippingName(material, 'PERCHLORIC ACID');
        expect(result.isValid).toBe(false);
      });

      test('Scenario 5, Alteration 1: rejects N.O.S. without technical name', () => {
        const material = createClass5Material(
          'UN3139', '5.1', 'A9.5',
          'OXIDIZING LIQUID, N.O.S. (Hydrogen Peroxide, Peracetic Acid)',
          'I'
        );
        const result = validateProperShippingName(material, 'OXIDIZING LIQUID, N.O.S.');
        expect(result.isValid).toBe(false);
      });

      test('Scenario 11, Alteration 1: rejects N.O.S. without technical name', () => {
        const material = createClass5Material(
          'UN1450', '5.1', 'A9.6',
          'BROMATES, INORGANIC, N.O.S. (Magnesium Bromate)',
          'II'
        );
        const result = validateProperShippingName(material, 'BROMATES, INORGANIC, N.O.S.');
        expect(result.isValid).toBe(false);
      });

      test('Scenario 14, Alteration 1: rejects N.O.S. without technical name', () => {
        const material = createClass5Material(
          'UN1479', '5.1', 'A9.6',
          'OXIDIZING SOLID, N.O.S. (Calcium Hypochlorite)',
          'II'
        );
        const result = validateProperShippingName(material, 'OXIDIZING SOLID, N.O.S.');
        expect(result.isValid).toBe(false);
      });

      test('Scenario 16, Alteration 2: rejects American spelling ALUMINUM vs ALUMINIUM', () => {
        const material = createClass5Material('UN1438', '5.1', 'A9.6', 'ALUMINIUM NITRATE', 'III');
        const result = validateProperShippingName(material, 'ALUMINUM NITRATE');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('ALUMINIUM NITRATE');
      });

      test('Scenario 18, Alteration 1: rejects PSN missing "BASED"', () => {
        const material = createClass5Material('UN2067', '5.1', 'A9.6', 'AMMONIUM NITRATE BASED FERTILIZER', 'III');
        const result = validateProperShippingName(material, 'AMMONIUM NITRATE FERTILIZER');
        expect(result.isValid).toBe(false);
      });

      test('Scenario 20, Alteration 3: rejects PSN missing "AQUEOUS SOLUTION"', () => {
        const material = createClass5Material(
          'UN3219', '5.1', 'A9.5',
          'NITRITES, INORGANIC, AQUEOUS SOLUTION, N.O.S. (Potassium Nitrite)',
          'III'
        );
        const result = validateProperShippingName(material, 'NITRITES, INORGANIC, N.O.S. (Potassium Nitrite)');
        expect(result.isValid).toBe(false);
      });
    });
  });

  describe('Unified validateSDDGInspection() Function', () => {
    describe('Scenario 1: UN1491 - Complete SDDG Validation (PG I)', () => {
      const material = createClass5Material(
        'UN1491', '5.1', 'A9.6', 'POTASSIUM PEROXIDE', 'I', '', 'P5'
      );

      test('validates successful SDDG with all correct values', () => {
        const content = createSDDGContent({
          aircraftType: 'PASSENGER AND CARGO AIRCRAFT',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN1491',
          properShippingName: 'POTASSIUM PEROXIDE',
          hazardClass: '5.1',
          subsidiaryRisk: '',
          packingGroup: 'I',
          packingInstruction: 'A9.6',
        });

        const results = validateSDDGInspection(content, material);
        const failures = results.filter(r => !r.isValid);

        expect(failures).toHaveLength(0);
      });

      test('Alteration 2: identifies Key 15 showing "II" instead of "I"', () => {
        const content = createSDDGContent({
          aircraftType: 'PASSENGER AND CARGO AIRCRAFT',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN1491',
          properShippingName: 'POTASSIUM PEROXIDE',
          hazardClass: '5.1',
          subsidiaryRisk: '',
          packingGroup: 'II',  // Wrong packing group
          packingInstruction: 'A9.6',
        });

        const results = validateSDDGInspection(content, material);
        const packingGroupResult = results.find(r => r.key === 'packingGroup');

        expect(packingGroupResult?.isValid).toBe(false);
        expect(packingGroupResult?.expectedValue).toBe('I');
      });
    });

    describe('Scenario 3: UN1873 - With Subsidiary Risk 8 (Corrosive)', () => {
      const material = createClass5Material(
        'UN1873', '5.1', 'A9.5',
        'PERCHLORIC ACID with more than 50% but 72% or less acid, by mass',
        'I', '8', 'P3'
      );

      test('validates successful SDDG with subsidiary risk', () => {
        const content = createSDDGContent({
          aircraftType: 'CARGO AIRCRAFT ONLY',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN1873',
          properShippingName: 'PERCHLORIC ACID with more than 50% but 72% or less acid, by mass',
          hazardClass: '5.1',
          subsidiaryRisk: '8',
          packingGroup: 'I',
          packingInstruction: 'A9.5',
        });

        const results = validateSDDGInspection(content, material);
        const failures = results.filter(r => !r.isValid);

        expect(failures).toHaveLength(0);
      });

      test('Alteration 2: identifies Key 14 empty when 8 expected', () => {
        const content = createSDDGContent({
          aircraftType: 'CARGO AIRCRAFT ONLY',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN1873',
          properShippingName: 'PERCHLORIC ACID with more than 50% but 72% or less acid, by mass',
          hazardClass: '5.1',
          subsidiaryRisk: '',  // Missing subsidiary
          packingGroup: 'I',
          packingInstruction: 'A9.5',
        });

        const results = validateSDDGInspection(content, material);
        const subsidiaryResult = results.find(r => r.key === 'subsidiaryRisk');

        expect(subsidiaryResult?.isValid).toBe(false);
        expect(subsidiaryResult?.expectedValue).toBe('8');
      });
    });

    describe('Scenario 6: UN1745 - Multiple Subsidiary Risks (6.1, 8)', () => {
      const material = createClass5Material(
        'UN1745', '5.1', 'A9.9', 'BROMINE PENTAFLUORIDE', 'I', '6.1, 8', 'P1'
      );

      test('validates successful SDDG with multiple subsidiary risks', () => {
        const content = createSDDGContent({
          aircraftType: 'CARGO AIRCRAFT ONLY',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN1745',
          properShippingName: 'BROMINE PENTAFLUORIDE',
          hazardClass: '5.1',
          subsidiaryRisk: '6.1, 8',
          packingGroup: 'I',
          packingInstruction: 'A9.9',
        });

        const results = validateSDDGInspection(content, material);
        const failures = results.filter(r => !r.isValid);

        expect(failures).toHaveLength(0);
      });

      test('Alteration 2: identifies Key 14 showing only 6.1 when 6.1, 8 expected', () => {
        const content = createSDDGContent({
          aircraftType: 'CARGO AIRCRAFT ONLY',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN1745',
          properShippingName: 'BROMINE PENTAFLUORIDE',
          hazardClass: '5.1',
          subsidiaryRisk: '6.1',  // Missing 8
          packingGroup: 'I',
          packingInstruction: 'A9.9',
        });

        const results = validateSDDGInspection(content, material);
        const subsidiaryResult = results.find(r => r.key === 'subsidiaryRisk');

        expect(subsidiaryResult?.isValid).toBe(false);
        expect(subsidiaryResult?.expectedValue).toBe('6.1, 8');
      });
    });

    describe('Scenario 5: UN3139 - N.O.S. with Technical Name', () => {
      const material = createClass5Material(
        'UN3139', '5.1', 'A9.5',
        'OXIDIZING LIQUID, N.O.S. (Hydrogen Peroxide, Peracetic Acid)',
        'I', '', 'P3'
      );

      test('validates successful SDDG with N.O.S. and technical name', () => {
        const content = createSDDGContent({
          aircraftType: 'CARGO AIRCRAFT ONLY',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN3139',
          properShippingName: 'OXIDIZING LIQUID, N.O.S. (Hydrogen Peroxide, Peracetic Acid)',
          hazardClass: '5.1',
          subsidiaryRisk: '',
          packingGroup: 'I',
          packingInstruction: 'A9.5',
        });

        const results = validateSDDGInspection(content, material);
        const failures = results.filter(r => !r.isValid);

        expect(failures).toHaveLength(0);
      });

      test('Alteration 1: identifies Key 12 missing technical name', () => {
        const content = createSDDGContent({
          aircraftType: 'CARGO AIRCRAFT ONLY',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN3139',
          properShippingName: 'OXIDIZING LIQUID, N.O.S.',  // Missing technical name
          hazardClass: '5.1',
          subsidiaryRisk: '',
          packingGroup: 'I',
          packingInstruction: 'A9.5',
        });

        const results = validateSDDGInspection(content, material);
        const psnResult = results.find(r => r.key === 'properShippingName');

        expect(psnResult?.isValid).toBe(false);
      });

      test('Alteration 3: identifies Key 17 showing A9.6 instead of A9.5', () => {
        const content = createSDDGContent({
          aircraftType: 'CARGO AIRCRAFT ONLY',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN3139',
          properShippingName: 'OXIDIZING LIQUID, N.O.S. (Hydrogen Peroxide, Peracetic Acid)',
          hazardClass: '5.1',
          subsidiaryRisk: '',
          packingGroup: 'I',
          packingInstruction: 'A9.6',  // Wrong - solid vs liquid
        });

        const results = validateSDDGInspection(content, material);
        const packingResult = results.find(r => r.key === 'packingInstruction');

        expect(packingResult?.isValid).toBe(false);
        expect(packingResult?.expectedValue).toBe('A9.5');
      });
    });

    describe('Scenario 10: UN2719 - CAO Required (P4)', () => {
      const material = createClass5Material(
        'UN2719', '5.1', 'A9.6', 'BARIUM BROMATE', 'II', '6.1', 'P4'
      );

      test('validates successful SDDG with CAO', () => {
        const content = createSDDGContent({
          aircraftType: 'CARGO AIRCRAFT ONLY',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN2719',
          properShippingName: 'BARIUM BROMATE',
          hazardClass: '5.1',
          subsidiaryRisk: '6.1',
          packingGroup: 'II',
          packingInstruction: 'A9.6',
        });

        const results = validateSDDGInspection(content, material);
        const failures = results.filter(r => !r.isValid);

        expect(failures).toHaveLength(0);
      });

      test('Alteration 1: identifies Key 7 showing Passenger and Cargo when P4 requires CAO', () => {
        const content = createSDDGContent({
          aircraftType: 'PASSENGER AND CARGO AIRCRAFT',  // Wrong - P4 requires CAO
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN2719',
          properShippingName: 'BARIUM BROMATE',
          hazardClass: '5.1',
          subsidiaryRisk: '6.1',
          packingGroup: 'II',
          packingInstruction: 'A9.6',
        });

        const results = validateSDDGInspection(content, material);
        const aircraftResult = results.find(r => r.key === 'aircraftType');

        expect(aircraftResult?.isValid).toBe(false);
        expect(aircraftResult?.expectedValue).toBe('CARGO AIRCRAFT ONLY');
      });
    });

    describe('Scenario 17: UN1942 - PG III Oxidizer', () => {
      const material = createClass5Material(
        'UN1942', '5.1', 'A9.6',
        'AMMONIUM NITRATE with 0.2% or less total combustible material, including any organic substance calculated as carbon, to the exclusion of any other added substance',
        'III', '', 'P5'
      );

      test('validates successful SDDG with PG III', () => {
        const content = createSDDGContent({
          aircraftType: 'PASSENGER AND CARGO AIRCRAFT',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN1942',
          properShippingName: 'AMMONIUM NITRATE with 0.2% or less total combustible material, including any organic substance calculated as carbon, to the exclusion of any other added substance',
          hazardClass: '5.1',
          subsidiaryRisk: '',
          packingGroup: 'III',
          packingInstruction: 'A9.6',
        });

        const results = validateSDDGInspection(content, material);
        const failures = results.filter(r => !r.isValid);

        expect(failures).toHaveLength(0);
      });

      test('Alteration 1: identifies incomplete PSN', () => {
        const content = createSDDGContent({
          aircraftType: 'PASSENGER AND CARGO AIRCRAFT',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN1942',
          properShippingName: 'AMMONIUM NITRATE',  // Missing concentration details
          hazardClass: '5.1',
          subsidiaryRisk: '',
          packingGroup: 'III',
          packingInstruction: 'A9.6',
        });

        const results = validateSDDGInspection(content, material);
        const psnResult = results.find(r => r.key === 'properShippingName');

        expect(psnResult?.isValid).toBe(false);
      });

      test('Alteration 3: identifies Key 13 showing 5 without .1', () => {
        const content = createSDDGContent({
          aircraftType: 'PASSENGER AND CARGO AIRCRAFT',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN1942',
          properShippingName: 'AMMONIUM NITRATE with 0.2% or less total combustible material, including any organic substance calculated as carbon, to the exclusion of any other added substance',
          hazardClass: '5',  // Missing .1
          subsidiaryRisk: '',
          packingGroup: 'III',
          packingInstruction: 'A9.6',
        });

        const results = validateSDDGInspection(content, material);
        const hazardClassResult = results.find(r => r.key === 'hazardClass');

        expect(hazardClassResult?.isValid).toBe(false);
        expect(hazardClassResult?.expectedValue).toBe('5.1');
      });
    });

    describe('Multiple Errors Detection', () => {
      test('identifies multiple validation failures in single SDDG', () => {
        const material = createClass5Material(
          'UN1491', '5.1', 'A9.6', 'POTASSIUM PEROXIDE', 'I', '', 'P5'
        );

        const content = createSDDGContent({
          aircraftType: 'PASSENGER AND CARGO AIRCRAFT',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN1492',  // Wrong UN number
          properShippingName: 'POTASSIUM',  // Incomplete PSN
          hazardClass: '5',  // Missing .1
          subsidiaryRisk: '',
          packingGroup: 'II',  // Wrong PG
          packingInstruction: 'A9.5',  // Wrong instruction
        });

        const results = validateSDDGInspection(content, material);
        const failures = results.filter(r => !r.isValid);

        // Should catch multiple errors
        expect(failures.length).toBeGreaterThanOrEqual(4);

        // Verify specific failures are identified
        const failedKeys = failures.map(f => f.key);
        expect(failedKeys).toContain('unIdNo');
        expect(failedKeys).toContain('hazardClass');
        expect(failedKeys).toContain('packingGroup');
        expect(failedKeys).toContain('packingInstruction');
      });
    });

    describe('Edge Cases', () => {
      test('returns empty array when material is null', () => {
        const content = createSDDGContent({
          unIdNo: 'UN1491',
          hazardClass: '5.1',
        });

        const results = validateSDDGInspection(content, null);
        expect(results).toHaveLength(0);
      });

      test('returns empty array when content is null', () => {
        const material = createClass5Material('UN1491', '5.1', 'A9.6', 'POTASSIUM PEROXIDE', 'I');
        const results = validateSDDGInspection(null, material);
        expect(results).toHaveLength(0);
      });
    });
  });
});
