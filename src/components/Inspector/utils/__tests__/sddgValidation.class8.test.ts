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

// Helper to create minimal HazardousMaterialItem for testing Class 8 materials
function createClass8Material(
  unid: string,
  hazclassDiv: string,
  packagingParagraph: string,
  properShippingName: string,
  packingGroup: string,
  subsidiaryRisk: string = '',
  isTechnicalNameRequired: boolean = false,
  specialProvision: string = ''
): HazardousMaterialItem {
  return {
    unid,
    hazclassDiv,
    packagingParagraph,
    properShippingName,
    packingGroup,
    subsidiaryRisk,
    specialProvision,
    isTechnicalNameRequired,
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

describe('SDDG Validation - Class 8 Corrosives', () => {
  describe('Key 7: Aircraft Type Validation', () => {
    describe('Positive Cases - Cargo Aircraft Only (P1-P4)', () => {
      test('Scenario 1: UN1830 - validates CAO with P3 special provision', () => {
        const material = createClass8Material(
          'UN1830', '8', 'A12.2',
          'SULFURIC ACID, FUMING with less than 30% free sulfur trioxide',
          'I', '', false, 'P3, A7, N34'
        );
        const result = validateAircraftType(material, 'CARGO AIRCRAFT ONLY');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 2: UN1790 - validates CAO with P3 special provision', () => {
        const material = createClass8Material(
          'UN1790', '8', 'A12.2',
          'HYDROFLUORIC ACID with more than 60% strength',
          'I', '6.1', false, 'P3, A7, N5, N34'
        );
        const result = validateAircraftType(material, 'CARGO AIRCRAFT ONLY');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 3: UN2032 - validates CAO with P2 special provision', () => {
        const material = createClass8Material(
          'UN2032', '8', 'A12.11',
          'NITRIC ACID, RED FUMING',
          'I', '5.1, 6.1', false, 'P2, 2'
        );
        const result = validateAircraftType(material, 'CARGO AIRCRAFT ONLY');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 4: UN2029 - validates CAO with P3 special provision', () => {
        const material = createClass8Material(
          'UN2029', '8', 'A12.2',
          'HYDRAZINE, ANHYDROUS',
          'I', '3, 6.1', false, 'P3, A7, A10'
        );
        const result = validateAircraftType(material, 'CARGO AIRCRAFT ONLY');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 5: UN1760 - validates CAO with P3 special provision (N.O.S.)', () => {
        const material = createClass8Material(
          'UN1760', '8', 'A12.2',
          'CORROSIVE LIQUID, N.O.S.',
          'I', '', true, 'P3, A7'
        );
        const result = validateAircraftType(material, 'CARGO AIRCRAFT ONLY');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 6: UN2922 - validates CAO with P3 special provision (N.O.S. Toxic)', () => {
        const material = createClass8Material(
          'UN2922', '8', 'A12.2',
          'CORROSIVE LIQUID, TOXIC, N.O.S.',
          'I', '6.1', true, 'P3, A7'
        );
        const result = validateAircraftType(material, 'CARGO AIRCRAFT ONLY');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 7: UN1789 - validates CAO with P4 special provision', () => {
        const material = createClass8Material(
          'UN1789', '8', 'A12.2',
          'HYDROCHLORIC ACID',
          'II', '', false, 'P4, A3, N41'
        );
        const result = validateAircraftType(material, 'CARGO AIRCRAFT ONLY');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 13: UN2920 - validates CAO with P3 special provision (N.O.S. Flammable)', () => {
        const material = createClass8Material(
          'UN2920', '8', 'A12.2',
          'CORROSIVE LIQUID, FLAMMABLE, N.O.S.',
          'II', '3', true, 'P3'
        );
        const result = validateAircraftType(material, 'CARGO AIRCRAFT ONLY');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 14: UN1802 - validates CAO with P4 special provision', () => {
        const material = createClass8Material(
          'UN1802', '8', 'A12.2',
          'PERCHLORIC ACID with not more than 50% acid, by mass',
          'II', '5.1', false, 'P4, N41'
        );
        const result = validateAircraftType(material, 'CARGO AIRCRAFT ONLY');
        expect(result.isValid).toBe(true);
      });
    });

    describe('Positive Cases - Passenger and Cargo Aircraft (P5)', () => {
      test('Scenario 8: UN2789 - validates Passenger and Cargo with P5 special provision', () => {
        const material = createClass8Material(
          'UN2789', '8', 'A12.2',
          'ACETIC ACID, GLACIAL or acetic acid solution, more than 80% acid, by mass',
          'II', '3', false, 'P5, A3, A7, A10'
        );
        const result = validateAircraftType(material, 'PASSENGER AND CARGO AIRCRAFT');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 9: UN1823 - validates Passenger and Cargo with P5 special provision (solid)', () => {
        const material = createClass8Material(
          'UN1823', '8', 'A12.3',
          'SODIUM HYDROXIDE, SOLID',
          'II', '', false, 'P5'
        );
        const result = validateAircraftType(material, 'PASSENGER AND CARGO AIRCRAFT');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 10: UN2796 - validates Passenger and Cargo with P5 special provision', () => {
        const material = createClass8Material(
          'UN2796', '8', 'A12.4',
          'BATTERY FLUID, ACID',
          'II', '', false, 'P5, A3, A7, N6, N34'
        );
        const result = validateAircraftType(material, 'PASSENGER AND CARGO AIRCRAFT');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 11: UN2794 - validates Passenger and Cargo with P5 special provision (wet battery)', () => {
        const material = createClass8Material(
          'UN2794', '8', 'A12.4',
          'BATTERIES, WET, FILLED WITH ACID, electric storage',
          '', '', false, 'P5'
        );
        const result = validateAircraftType(material, 'PASSENGER AND CARGO AIRCRAFT');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 12: UN1824 - validates Passenger and Cargo with P5 special provision', () => {
        const material = createClass8Material(
          'UN1824', '8', 'A12.2',
          'SODIUM HYDROXIDE, SOLUTION',
          'II', '', false, 'P5, N34'
        );
        const result = validateAircraftType(material, 'PASSENGER AND CARGO AIRCRAFT');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 15: UN2790 - validates Passenger and Cargo with P5 special provision', () => {
        const material = createClass8Material(
          'UN2790', '8', 'A12.2',
          'ACETIC ACID SOLUTION, not less than 10% and less than 50% acid, by mass',
          'III', '', false, 'P5'
        );
        const result = validateAircraftType(material, 'PASSENGER AND CARGO AIRCRAFT');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 16: UN2672 - validates Passenger and Cargo with P5 special provision', () => {
        const material = createClass8Material(
          'UN2672', '8', 'A12.2',
          'AMMONIA SOLUTION, relative density between 0.880 and 0.957 at 15°C, with more than 10% but not more than 35% ammonia',
          'III', '', false, 'P5'
        );
        const result = validateAircraftType(material, 'PASSENGER AND CARGO AIRCRAFT');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 17: UN2809 - validates Passenger and Cargo with P5 special provision', () => {
        const material = createClass8Material(
          'UN2809', '8', 'A12.9',
          'MERCURY',
          'III', '6.1', false, 'P5'
        );
        const result = validateAircraftType(material, 'PASSENGER AND CARGO AIRCRAFT');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 18: UN1805 - validates Passenger and Cargo with P5 special provision', () => {
        const material = createClass8Material(
          'UN1805', '8', 'A12.2',
          'PHOSPHORIC ACID, SOLUTION',
          'III', '', false, 'P5, A7, N34'
        );
        const result = validateAircraftType(material, 'PASSENGER AND CARGO AIRCRAFT');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 19: UN1759 - validates Passenger and Cargo with P5 special provision (solid N.O.S.)', () => {
        const material = createClass8Material(
          'UN1759', '8', 'A12.3',
          'CORROSIVE SOLID, N.O.S.',
          'III', '', true, 'P5'
        );
        const result = validateAircraftType(material, 'PASSENGER AND CARGO AIRCRAFT');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 20: UN3264 - validates Passenger and Cargo with P5 special provision (N.O.S.)', () => {
        const material = createClass8Material(
          'UN3264', '8', 'A12.2',
          'CORROSIVE LIQUID, ACIDIC, INORGANIC, N.O.S.',
          'III', '', true, 'P5'
        );
        const result = validateAircraftType(material, 'PASSENGER AND CARGO AIRCRAFT');
        expect(result.isValid).toBe(true);
      });
    });

    describe('Negative Cases - From Alterations', () => {
      test('Scenario 4, Alteration 2: rejects Passenger and Cargo when P3 requires CAO', () => {
        const material = createClass8Material(
          'UN2029', '8', 'A12.2',
          'HYDRAZINE, ANHYDROUS',
          'I', '3, 6.1', false, 'P3, A7, A10'
        );
        const result = validateAircraftType(material, 'PASSENGER AND CARGO AIRCRAFT');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('CARGO AIRCRAFT ONLY');
      });

      test('Scenario 7, Alteration 2: rejects Passenger and Cargo when P4 requires CAO', () => {
        const material = createClass8Material(
          'UN1789', '8', 'A12.2',
          'HYDROCHLORIC ACID',
          'II', '', false, 'P4, A3, N41'
        );
        const result = validateAircraftType(material, 'PASSENGER AND CARGO AIRCRAFT');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('CARGO AIRCRAFT ONLY');
      });

      test('Scenario 8, Alteration 2: rejects CAO when P5 allows passenger (overly restrictive but acceptable)', () => {
        const material = createClass8Material(
          'UN2789', '8', 'A12.2',
          'ACETIC ACID, GLACIAL',
          'II', '3', false, 'P5, A3, A7, A10'
        );
        const result = validateAircraftType(material, 'CARGO AIRCRAFT ONLY');
        expect(result.isValid).toBe(false);
      });
    });
  });

  describe('Key 11: UN/ID Number Validation', () => {
    describe('Positive Cases - Matching UN Numbers', () => {
      test('Scenario 1: UN1830 - validates UN number correctly', () => {
        const material = createClass8Material('UN1830', '8', 'A12.2', 'SULFURIC ACID, FUMING', 'I');
        const result = validateUnidNumber(material, 'UN1830');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 2: UN1790 - validates UN number correctly', () => {
        const material = createClass8Material('UN1790', '8', 'A12.2', 'HYDROFLUORIC ACID', 'I', '6.1');
        const result = validateUnidNumber(material, 'UN1790');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 3: UN2032 - validates UN number correctly', () => {
        const material = createClass8Material('UN2032', '8', 'A12.11', 'NITRIC ACID, RED FUMING', 'I', '5.1, 6.1');
        const result = validateUnidNumber(material, 'UN2032');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 7: UN1789 - validates UN number correctly', () => {
        const material = createClass8Material('UN1789', '8', 'A12.2', 'HYDROCHLORIC ACID', 'II');
        const result = validateUnidNumber(material, 'UN1789');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 11: UN2794 - validates UN number correctly (wet battery)', () => {
        const material = createClass8Material('UN2794', '8', 'A12.4', 'BATTERIES, WET, FILLED WITH ACID', '');
        const result = validateUnidNumber(material, 'UN2794');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 17: UN2809 - validates UN number correctly (mercury)', () => {
        const material = createClass8Material('UN2809', '8', 'A12.9', 'MERCURY', 'III', '6.1');
        const result = validateUnidNumber(material, 'UN2809');
        expect(result.isValid).toBe(true);
      });

      test('handles lowercase UN prefix', () => {
        const material = createClass8Material('UN1789', '8', 'A12.2', 'HYDROCHLORIC ACID', 'II');
        const result = validateUnidNumber(material, 'un1789');
        expect(result.isValid).toBe(true);
      });
    });

    describe('Negative Cases - From Alterations', () => {
      test('Scenario 12, Alteration 1: rejects UN1842 when UN1824 expected (transposition)', () => {
        const material = createClass8Material('UN1824', '8', 'A12.2', 'SODIUM HYDROXIDE, SOLUTION', 'II');
        const result = validateUnidNumber(material, 'UN1842');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('UN1824');
      });

      test('rejects similar UN number (UN1788 vs UN1789)', () => {
        const material = createClass8Material('UN1789', '8', 'A12.2', 'HYDROCHLORIC ACID', 'II');
        const result = validateUnidNumber(material, 'UN1788');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('UN1789');
      });

      test('rejects missing UN prefix', () => {
        const material = createClass8Material('UN1830', '8', 'A12.2', 'SULFURIC ACID, FUMING', 'I');
        const result = validateUnidNumber(material, '1830');
        expect(result.isValid).toBe(false);
      });

      test('rejects completely wrong UN number', () => {
        const material = createClass8Material('UN2032', '8', 'A12.11', 'NITRIC ACID, RED FUMING', 'I', '5.1, 6.1');
        const result = validateUnidNumber(material, 'UN3264');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('UN2032');
      });
    });
  });

  describe('Key 12: Proper Shipping Name Validation', () => {
    describe('Positive Cases - Matching PSN', () => {
      test('Scenario 1: UN1830 - validates PSN correctly', () => {
        const material = createClass8Material(
          'UN1830', '8', 'A12.2',
          'SULFURIC ACID, FUMING with less than 30% free sulfur trioxide', 'I'
        );
        const result = validateProperShippingName(
          material,
          'SULFURIC ACID, FUMING with less than 30% free sulfur trioxide'
        );
        expect(result.isValid).toBe(true);
      });

      test('Scenario 2: UN1790 - validates PSN with concentration correctly', () => {
        const material = createClass8Material(
          'UN1790', '8', 'A12.2',
          'HYDROFLUORIC ACID with more than 60% strength', 'I', '6.1'
        );
        const result = validateProperShippingName(
          material,
          'HYDROFLUORIC ACID with more than 60% strength'
        );
        expect(result.isValid).toBe(true);
      });

      test('Scenario 7: UN1789 - validates simple PSN correctly', () => {
        const material = createClass8Material('UN1789', '8', 'A12.2', 'HYDROCHLORIC ACID', 'II');
        const result = validateProperShippingName(material, 'HYDROCHLORIC ACID');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 9: UN1823 - validates solid PSN correctly', () => {
        const material = createClass8Material('UN1823', '8', 'A12.3', 'SODIUM HYDROXIDE, SOLID', 'II');
        const result = validateProperShippingName(material, 'SODIUM HYDROXIDE, SOLID');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 17: UN2809 - validates simple PSN correctly (mercury)', () => {
        const material = createClass8Material('UN2809', '8', 'A12.9', 'MERCURY', 'III', '6.1');
        const result = validateProperShippingName(material, 'MERCURY');
        expect(result.isValid).toBe(true);
      });

      test('handles case insensitivity', () => {
        const material = createClass8Material('UN1789', '8', 'A12.2', 'HYDROCHLORIC ACID', 'II');
        const result = validateProperShippingName(material, 'Hydrochloric Acid');
        expect(result.isValid).toBe(true);
      });
    });

    describe('Negative Cases - From Alterations', () => {
      test('Scenario 9, Alteration 3: rejects abbreviated PSN "NaOH SOLID"', () => {
        const material = createClass8Material('UN1823', '8', 'A12.3', 'SODIUM HYDROXIDE, SOLID', 'II');
        const result = validateProperShippingName(material, 'NaOH SOLID');
        expect(result.isValid).toBe(false);
      });

      test('Scenario 11, Alteration 3: rejects incomplete PSN "BATTERIES" for wet batteries', () => {
        const material = createClass8Material(
          'UN2794', '8', 'A12.4',
          'BATTERIES, WET, FILLED WITH ACID, electric storage', ''
        );
        const result = validateProperShippingName(material, 'BATTERIES');
        expect(result.isValid).toBe(false);
      });

      test('Scenario 12, Alteration 2: rejects common name "CAUSTIC SODA SOLUTION"', () => {
        const material = createClass8Material('UN1824', '8', 'A12.2', 'SODIUM HYDROXIDE, SOLUTION', 'II');
        const result = validateProperShippingName(material, 'CAUSTIC SODA SOLUTION');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('SODIUM HYDROXIDE, SOLUTION');
      });

      test('Scenario 16, Alteration 1: rejects abbreviated PSN "AMMONIA"', () => {
        const material = createClass8Material(
          'UN2672', '8', 'A12.2',
          'AMMONIA SOLUTION, relative density between 0.880 and 0.957 at 15°C, with more than 10% but not more than 35% ammonia',
          'III'
        );
        const result = validateProperShippingName(material, 'AMMONIA');
        expect(result.isValid).toBe(false);
      });
    });

    describe('N.O.S. Technical Name Cases', () => {
      test('Scenario 5: validates N.O.S. PSN with technical name', () => {
        const material = createClass8Material(
          'UN1760', '8', 'A12.2',
          'CORROSIVE LIQUID, N.O.S. (contains phosphorus trichloride)', 'I', '', true
        );
        const result = validateProperShippingName(
          material,
          'CORROSIVE LIQUID, N.O.S. (contains phosphorus trichloride)'
        );
        expect(result.isValid).toBe(true);
      });

      test('Scenario 5, Alteration 1: rejects N.O.S. without technical name', () => {
        const material = createClass8Material(
          'UN1760', '8', 'A12.2',
          'CORROSIVE LIQUID, N.O.S. (contains phosphorus trichloride)', 'I', '', true
        );
        const result = validateProperShippingName(material, 'CORROSIVE LIQUID, N.O.S.');
        expect(result.isValid).toBe(false);
      });

      test('Scenario 6: validates N.O.S. Toxic PSN with technical name', () => {
        const material = createClass8Material(
          'UN2922', '8', 'A12.2',
          'CORROSIVE LIQUID, TOXIC, N.O.S. (contains phenol, sodium hydroxide)', 'I', '6.1', true
        );
        const result = validateProperShippingName(
          material,
          'CORROSIVE LIQUID, TOXIC, N.O.S. (contains phenol, sodium hydroxide)'
        );
        expect(result.isValid).toBe(true);
      });

      test('Scenario 13: validates N.O.S. Flammable PSN with technical name', () => {
        const material = createClass8Material(
          'UN2920', '8', 'A12.2',
          'CORROSIVE LIQUID, FLAMMABLE, N.O.S. (contains formic acid, methanol)', 'II', '3', true
        );
        const result = validateProperShippingName(
          material,
          'CORROSIVE LIQUID, FLAMMABLE, N.O.S. (contains formic acid, methanol)'
        );
        expect(result.isValid).toBe(true);
      });

      test('Scenario 13, Alteration 1: rejects N.O.S. Flammable without technical name', () => {
        const material = createClass8Material(
          'UN2920', '8', 'A12.2',
          'CORROSIVE LIQUID, FLAMMABLE, N.O.S. (contains formic acid, methanol)', 'II', '3', true
        );
        const result = validateProperShippingName(
          material,
          'CORROSIVE LIQUID, FLAMMABLE, N.O.S.'
        );
        expect(result.isValid).toBe(false);
      });

      test('Scenario 19: validates solid N.O.S. PSN with technical name', () => {
        const material = createClass8Material(
          'UN1759', '8', 'A12.3',
          'CORROSIVE SOLID, N.O.S. (contains zinc chloride)', 'III', '', true
        );
        const result = validateProperShippingName(
          material,
          'CORROSIVE SOLID, N.O.S. (contains zinc chloride)'
        );
        expect(result.isValid).toBe(true);
      });

      test('Scenario 20: validates acidic inorganic N.O.S. PSN with technical name', () => {
        const material = createClass8Material(
          'UN3264', '8', 'A12.2',
          'CORROSIVE LIQUID, ACIDIC, INORGANIC, N.O.S. (contains ferric chloride solution)', 'III', '', true
        );
        const result = validateProperShippingName(
          material,
          'CORROSIVE LIQUID, ACIDIC, INORGANIC, N.O.S. (contains ferric chloride solution)'
        );
        expect(result.isValid).toBe(true);
      });

      test('Scenario 20, Alteration 2: rejects generic N.O.S. without acidic/inorganic', () => {
        const material = createClass8Material(
          'UN3264', '8', 'A12.2',
          'CORROSIVE LIQUID, ACIDIC, INORGANIC, N.O.S. (contains ferric chloride solution)', 'III', '', true
        );
        const result = validateProperShippingName(
          material,
          'CORROSIVE LIQUID, N.O.S. (contains ferric chloride solution)'
        );
        expect(result.isValid).toBe(false);
      });
    });
  });

  describe('Key 13: Hazard Class Validation', () => {
    describe('Positive Cases - Valid Hazard Class (NO DIVISIONS)', () => {
      // Packing Group I Scenarios (1-6)
      test('Scenario 1: UN1830 - validates "8" correctly (SULFURIC ACID, FUMING)', () => {
        const material = createClass8Material('UN1830', '8', 'A12.2', 'SULFURIC ACID, FUMING with less than 30% free sulfur trioxide', 'I');
        const result = validateHazardClass(material, '8');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 2: UN1790 - validates "8" correctly (HYDROFLUORIC ACID)', () => {
        const material = createClass8Material('UN1790', '8', 'A12.2', 'HYDROFLUORIC ACID with more than 60% strength', 'I', '6.1');
        const result = validateHazardClass(material, '8');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 3: UN2032 - validates "8" correctly (NITRIC ACID, RED FUMING)', () => {
        const material = createClass8Material('UN2032', '8', 'A12.11', 'NITRIC ACID, RED FUMING', 'I', '5.1, 6.1');
        const result = validateHazardClass(material, '8');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 4: UN2029 - validates "8" correctly (HYDRAZINE, ANHYDROUS)', () => {
        const material = createClass8Material('UN2029', '8', 'A12.2', 'HYDRAZINE, ANHYDROUS', 'I', '3, 6.1');
        const result = validateHazardClass(material, '8');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 5: UN1760 - validates "8" correctly (CORROSIVE LIQUID, N.O.S. PG I)', () => {
        const material = createClass8Material('UN1760', '8', 'A12.2', 'CORROSIVE LIQUID, N.O.S.', 'I', '', true);
        const result = validateHazardClass(material, '8');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 6: UN2922 - validates "8" correctly (CORROSIVE LIQUID, TOXIC, N.O.S. PG I)', () => {
        const material = createClass8Material('UN2922', '8', 'A12.2', 'CORROSIVE LIQUID, TOXIC, N.O.S.', 'I', '6.1', true);
        const result = validateHazardClass(material, '8');
        expect(result.isValid).toBe(true);
      });

      // Packing Group II Scenarios (7-14)
      test('Scenario 7: UN1789 - validates "8" correctly (HYDROCHLORIC ACID)', () => {
        const material = createClass8Material('UN1789', '8', 'A12.2', 'HYDROCHLORIC ACID', 'II');
        const result = validateHazardClass(material, '8');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 8: UN2789 - validates "8" correctly (ACETIC ACID, GLACIAL)', () => {
        const material = createClass8Material('UN2789', '8', 'A12.2', 'ACETIC ACID, GLACIAL', 'II', '3');
        const result = validateHazardClass(material, '8');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 9: UN1823 - validates "8" correctly (SODIUM HYDROXIDE, SOLID)', () => {
        const material = createClass8Material('UN1823', '8', 'A12.3', 'SODIUM HYDROXIDE, SOLID', 'II');
        const result = validateHazardClass(material, '8');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 10: UN2796 - validates "8" correctly (BATTERY FLUID, ACID)', () => {
        const material = createClass8Material('UN2796', '8', 'A12.4', 'BATTERY FLUID, ACID', 'II');
        const result = validateHazardClass(material, '8');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 11: UN2794 - validates "8" correctly (BATTERIES, WET - No PG)', () => {
        const material = createClass8Material('UN2794', '8', 'A12.4', 'BATTERIES, WET, FILLED WITH ACID, electric storage', '');
        const result = validateHazardClass(material, '8');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 12: UN1824 - validates "8" correctly (SODIUM HYDROXIDE, SOLUTION)', () => {
        const material = createClass8Material('UN1824', '8', 'A12.2', 'SODIUM HYDROXIDE, SOLUTION', 'II');
        const result = validateHazardClass(material, '8');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 13: UN2920 - validates "8" correctly (CORROSIVE LIQUID, FLAMMABLE, N.O.S.)', () => {
        const material = createClass8Material('UN2920', '8', 'A12.2', 'CORROSIVE LIQUID, FLAMMABLE, N.O.S.', 'II', '3', true);
        const result = validateHazardClass(material, '8');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 14: UN1802 - validates "8" correctly (PERCHLORIC ACID)', () => {
        const material = createClass8Material('UN1802', '8', 'A12.2', 'PERCHLORIC ACID with not more than 50% acid, by mass', 'II', '5.1');
        const result = validateHazardClass(material, '8');
        expect(result.isValid).toBe(true);
      });

      // Packing Group III Scenarios (15-20)
      test('Scenario 15: UN2790 - validates "8" correctly (ACETIC ACID SOLUTION)', () => {
        const material = createClass8Material('UN2790', '8', 'A12.2', 'ACETIC ACID SOLUTION', 'III');
        const result = validateHazardClass(material, '8');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 16: UN2672 - validates "8" correctly (AMMONIA SOLUTION)', () => {
        const material = createClass8Material('UN2672', '8', 'A12.2', 'AMMONIA SOLUTION', 'III');
        const result = validateHazardClass(material, '8');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 17: UN2809 - validates "8" correctly (MERCURY)', () => {
        const material = createClass8Material('UN2809', '8', 'A12.9', 'MERCURY', 'III', '6.1');
        const result = validateHazardClass(material, '8');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 18: UN1805 - validates "8" correctly (PHOSPHORIC ACID, SOLUTION)', () => {
        const material = createClass8Material('UN1805', '8', 'A12.2', 'PHOSPHORIC ACID, SOLUTION', 'III');
        const result = validateHazardClass(material, '8');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 19: UN1759 - validates "8" correctly (CORROSIVE SOLID, N.O.S.)', () => {
        const material = createClass8Material('UN1759', '8', 'A12.3', 'CORROSIVE SOLID, N.O.S.', 'III', '', true);
        const result = validateHazardClass(material, '8');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 20: UN3264 - validates "8" correctly (CORROSIVE LIQUID, ACIDIC, INORGANIC, N.O.S.)', () => {
        const material = createClass8Material('UN3264', '8', 'A12.2', 'CORROSIVE LIQUID, ACIDIC, INORGANIC, N.O.S.', 'III', '', true);
        const result = validateHazardClass(material, '8');
        expect(result.isValid).toBe(true);
      });
    });

    describe('Negative Cases - Class 8 Has NO Divisions (Critical Validation)', () => {
      test('Scenario 1, Alteration 1: REJECTS "8.1" (Class 8 has no divisions)', () => {
        const material = createClass8Material('UN1830', '8', 'A12.2', 'SULFURIC ACID, FUMING', 'I');
        const result = validateHazardClass(material, '8.1');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('8');
      });

      test('Scenario 4, Alteration 3: REJECTS "8.2" (Class 8 has no divisions)', () => {
        const material = createClass8Material('UN2029', '8', 'A12.2', 'HYDRAZINE, ANHYDROUS', 'I', '3, 6.1');
        const result = validateHazardClass(material, '8.2');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('8');
      });

      test('Scenario 16, Alteration 2: REJECTS "8.3" (Class 8 has no divisions)', () => {
        const material = createClass8Material('UN2672', '8', 'A12.2', 'AMMONIA SOLUTION', 'III');
        const result = validateHazardClass(material, '8.3');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('8');
      });

      test('Scenario 3, Alteration 1: REJECTS "8.0" (Class 8 has no divisions)', () => {
        const material = createClass8Material('UN2032', '8', 'A12.11', 'NITRIC ACID, RED FUMING', 'I', '5.1, 6.1');
        const result = validateHazardClass(material, '8.0');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('8');
      });

      test('Scenario 6, Alteration 3: REJECTS "8.5" (Class 8 has no divisions)', () => {
        const material = createClass8Material('UN2922', '8', 'A12.2', 'CORROSIVE LIQUID, TOXIC, N.O.S.', 'I', '6.1', true);
        const result = validateHazardClass(material, '8.5');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('8');
      });

      test('REJECTS wrong class entirely (e.g., "3" instead of "8")', () => {
        const material = createClass8Material('UN1789', '8', 'A12.2', 'HYDROCHLORIC ACID', 'II');
        const result = validateHazardClass(material, '3');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('8');
      });
    });
  });

  describe('Key 15: Packing Group Validation', () => {
    describe('Packing Group I - Severe Corrosives (Scenarios 1-6)', () => {
      test('Scenario 1: UN1830 - validates PG I correctly', () => {
        const material = createClass8Material('UN1830', '8', 'A12.2', 'SULFURIC ACID, FUMING', 'I');
        const result = validatePackingGroup(material, 'I');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 2: UN1790 - validates PG I correctly', () => {
        const material = createClass8Material('UN1790', '8', 'A12.2', 'HYDROFLUORIC ACID', 'I', '6.1');
        const result = validatePackingGroup(material, 'I');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 3: UN2032 - validates PG I correctly', () => {
        const material = createClass8Material('UN2032', '8', 'A12.11', 'NITRIC ACID, RED FUMING', 'I', '5.1, 6.1');
        const result = validatePackingGroup(material, 'I');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 4: UN2029 - validates PG I correctly', () => {
        const material = createClass8Material('UN2029', '8', 'A12.2', 'HYDRAZINE, ANHYDROUS', 'I', '3, 6.1');
        const result = validatePackingGroup(material, 'I');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 5: UN1760 - validates PG I correctly', () => {
        const material = createClass8Material('UN1760', '8', 'A12.2', 'CORROSIVE LIQUID, N.O.S.', 'I', '', true);
        const result = validatePackingGroup(material, 'I');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 6: UN2922 - validates PG I correctly', () => {
        const material = createClass8Material('UN2922', '8', 'A12.2', 'CORROSIVE LIQUID, TOXIC, N.O.S.', 'I', '6.1', true);
        const result = validatePackingGroup(material, 'I');
        expect(result.isValid).toBe(true);
      });
    });

    describe('Packing Group II - Moderate Corrosives (Scenarios 7-14, except 11)', () => {
      test('Scenario 7: UN1789 - validates PG II correctly', () => {
        const material = createClass8Material('UN1789', '8', 'A12.2', 'HYDROCHLORIC ACID', 'II');
        const result = validatePackingGroup(material, 'II');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 8: UN2789 - validates PG II correctly', () => {
        const material = createClass8Material('UN2789', '8', 'A12.2', 'ACETIC ACID, GLACIAL', 'II', '3');
        const result = validatePackingGroup(material, 'II');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 9: UN1823 - validates PG II correctly', () => {
        const material = createClass8Material('UN1823', '8', 'A12.3', 'SODIUM HYDROXIDE, SOLID', 'II');
        const result = validatePackingGroup(material, 'II');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 10: UN2796 - validates PG II correctly', () => {
        const material = createClass8Material('UN2796', '8', 'A12.4', 'BATTERY FLUID, ACID', 'II');
        const result = validatePackingGroup(material, 'II');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 12: UN1824 - validates PG II correctly', () => {
        const material = createClass8Material('UN1824', '8', 'A12.2', 'SODIUM HYDROXIDE, SOLUTION', 'II');
        const result = validatePackingGroup(material, 'II');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 13: UN2920 - validates PG II correctly', () => {
        const material = createClass8Material('UN2920', '8', 'A12.2', 'CORROSIVE LIQUID, FLAMMABLE, N.O.S.', 'II', '3', true);
        const result = validatePackingGroup(material, 'II');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 14: UN1802 - validates PG II correctly', () => {
        const material = createClass8Material('UN1802', '8', 'A12.2', 'PERCHLORIC ACID', 'II', '5.1');
        const result = validatePackingGroup(material, 'II');
        expect(result.isValid).toBe(true);
      });
    });

    describe('Packing Group III - Mild Corrosives (Scenarios 15-20)', () => {
      test('Scenario 15: UN2790 - validates PG III correctly', () => {
        const material = createClass8Material('UN2790', '8', 'A12.2', 'ACETIC ACID SOLUTION', 'III');
        const result = validatePackingGroup(material, 'III');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 16: UN2672 - validates PG III correctly', () => {
        const material = createClass8Material('UN2672', '8', 'A12.2', 'AMMONIA SOLUTION', 'III');
        const result = validatePackingGroup(material, 'III');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 17: UN2809 - validates PG III correctly', () => {
        const material = createClass8Material('UN2809', '8', 'A12.9', 'MERCURY', 'III', '6.1');
        const result = validatePackingGroup(material, 'III');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 18: UN1805 - validates PG III correctly', () => {
        const material = createClass8Material('UN1805', '8', 'A12.2', 'PHOSPHORIC ACID, SOLUTION', 'III');
        const result = validatePackingGroup(material, 'III');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 19: UN1759 - validates PG III correctly', () => {
        const material = createClass8Material('UN1759', '8', 'A12.3', 'CORROSIVE SOLID, N.O.S.', 'III', '', true);
        const result = validatePackingGroup(material, 'III');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 20: UN3264 - validates PG III correctly', () => {
        const material = createClass8Material('UN3264', '8', 'A12.2', 'CORROSIVE LIQUID, ACIDIC, INORGANIC, N.O.S.', 'III', '', true);
        const result = validatePackingGroup(material, 'III');
        expect(result.isValid).toBe(true);
      });
    });

    describe('Special Case - Wet Batteries (Scenario 11)', () => {
      test('Scenario 11: UN2794 - validates EMPTY packing group (battery exception)', () => {
        const material = createClass8Material('UN2794', '8', 'A12.4', 'BATTERIES, WET, FILLED WITH ACID', '');
        const result = validatePackingGroup(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 11, Alteration 1: REJECTS PG II for wet batteries (should be empty)', () => {
        const material = createClass8Material('UN2794', '8', 'A12.4', 'BATTERIES, WET, FILLED WITH ACID', '');
        const result = validatePackingGroup(material, 'II');
        expect(result.isValid).toBe(false);
        // Note: "None" is returned instead of empty string for display purposes
        expect(result.expected).toBe('None');
      });
    });

    describe('Negative Cases - Wrong Packing Groups', () => {
      test('Scenario 2, Alteration 3: REJECTS empty PG when I is required', () => {
        const material = createClass8Material('UN1790', '8', 'A12.2', 'HYDROFLUORIC ACID', 'I', '6.1');
        const result = validatePackingGroup(material, '');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('I');
      });

      test('Scenario 7, Alteration 1: REJECTS PG III when II is required', () => {
        const material = createClass8Material('UN1789', '8', 'A12.2', 'HYDROCHLORIC ACID', 'II');
        const result = validatePackingGroup(material, 'III');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('II');
      });

      test('Scenario 10, Alteration 3: REJECTS PG III when II is required', () => {
        const material = createClass8Material('UN2796', '8', 'A12.4', 'BATTERY FLUID, ACID', 'II');
        const result = validatePackingGroup(material, 'III');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('II');
      });

      test('Scenario 15, Alteration 2: REJECTS PG II when III is required', () => {
        const material = createClass8Material('UN2790', '8', 'A12.2', 'ACETIC ACID SOLUTION', 'III');
        const result = validatePackingGroup(material, 'II');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('III');
      });

      test('REJECTS PG I when II is required', () => {
        const material = createClass8Material('UN1789', '8', 'A12.2', 'HYDROCHLORIC ACID', 'II');
        const result = validatePackingGroup(material, 'I');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('II');
      });
    });
  });

  describe('Key 17: Packaging Instruction Validation', () => {
    describe('Positive Cases - A12.xx Packaging Instructions', () => {
      test('Scenario 1: UN1830 - validates A12.2 correctly', () => {
        const material = createClass8Material('UN1830', '8', 'A12.2', 'SULFURIC ACID, FUMING', 'I');
        const result = validatePackingInstruction(material, 'A12.2');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 2: UN1790 - validates A12.2 correctly', () => {
        const material = createClass8Material('UN1790', '8', 'A12.2', 'HYDROFLUORIC ACID', 'I', '6.1');
        const result = validatePackingInstruction(material, 'A12.2');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 3: UN2032 - validates A12.11 correctly', () => {
        const material = createClass8Material('UN2032', '8', 'A12.11', 'NITRIC ACID, RED FUMING', 'I', '5.1, 6.1');
        const result = validatePackingInstruction(material, 'A12.11');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 9: UN1823 - validates A12.3 correctly (solid)', () => {
        const material = createClass8Material('UN1823', '8', 'A12.3', 'SODIUM HYDROXIDE, SOLID', 'II');
        const result = validatePackingInstruction(material, 'A12.3');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 10: UN2796 - validates A12.4 correctly (battery)', () => {
        const material = createClass8Material('UN2796', '8', 'A12.4', 'BATTERY FLUID, ACID', 'II');
        const result = validatePackingInstruction(material, 'A12.4');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 11: UN2794 - validates A12.4 correctly (wet battery)', () => {
        const material = createClass8Material('UN2794', '8', 'A12.4', 'BATTERIES, WET, FILLED WITH ACID', '');
        const result = validatePackingInstruction(material, 'A12.4');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 17: UN2809 - validates A12.9 correctly (mercury)', () => {
        const material = createClass8Material('UN2809', '8', 'A12.9', 'MERCURY', 'III', '6.1');
        const result = validatePackingInstruction(material, 'A12.9');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 19: UN1759 - validates A12.3 correctly (solid N.O.S.)', () => {
        const material = createClass8Material('UN1759', '8', 'A12.3', 'CORROSIVE SOLID, N.O.S.', 'III', '', true);
        const result = validatePackingInstruction(material, 'A12.3');
        expect(result.isValid).toBe(true);
      });
    });

    describe('Negative Cases - Wrong Packaging Instructions', () => {
      test('Scenario 3, Alteration 3: REJECTS A12.2 when A12.11 expected', () => {
        const material = createClass8Material('UN2032', '8', 'A12.11', 'NITRIC ACID, RED FUMING', 'I', '5.1, 6.1');
        const result = validatePackingInstruction(material, 'A12.2');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('A12.11');
      });

      test('Scenario 9, Alteration 1: REJECTS A12.2 when A12.3 expected (liquid vs solid)', () => {
        const material = createClass8Material('UN1823', '8', 'A12.3', 'SODIUM HYDROXIDE, SOLID', 'II');
        const result = validatePackingInstruction(material, 'A12.2');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('A12.3');
      });

      test('Scenario 10, Alteration 2: REJECTS A12.2 when A12.4 expected (battery)', () => {
        const material = createClass8Material('UN2796', '8', 'A12.4', 'BATTERY FLUID, ACID', 'II');
        const result = validatePackingInstruction(material, 'A12.2');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('A12.4');
      });

      test('Scenario 17, Alteration 1: REJECTS A12.2 when A12.9 expected (mercury)', () => {
        const material = createClass8Material('UN2809', '8', 'A12.9', 'MERCURY', 'III', '6.1');
        const result = validatePackingInstruction(material, 'A12.2');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('A12.9');
      });

      test('Scenario 19, Alteration 2: REJECTS A12.2 when A12.3 expected (solid)', () => {
        const material = createClass8Material('UN1759', '8', 'A12.3', 'CORROSIVE SOLID, N.O.S.', 'III', '', true);
        const result = validatePackingInstruction(material, 'A12.2');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('A12.3');
      });

      test('REJECTS A5.xx packaging (wrong hazard class)', () => {
        const material = createClass8Material('UN1789', '8', 'A12.2', 'HYDROCHLORIC ACID', 'II');
        const result = validatePackingInstruction(material, 'A5.2');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('A12.2');
      });
    });

    describe('Normalization', () => {
      test('handles trailing period in paragraph reference', () => {
        const material = createClass8Material('UN1789', '8', 'A12.2.', 'HYDROCHLORIC ACID', 'II');
        const result = validatePackingInstruction(material, 'A12.2');
        expect(result.isValid).toBe(true);
      });

      test('handles case variations', () => {
        const material = createClass8Material('UN1789', '8', 'A12.2', 'HYDROCHLORIC ACID', 'II');
        const result = validatePackingInstruction(material, 'a12.2');
        expect(result.isValid).toBe(true);
      });
    });
  });

  describe('Key 14: Subsidiary Risk Validation', () => {
    describe('Positive Cases - No Subsidiary Risk', () => {
      test('Scenario 1: UN1830 - validates empty subsidiary risk correctly', () => {
        const material = createClass8Material('UN1830', '8', 'A12.2', 'SULFURIC ACID, FUMING', 'I');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 7: UN1789 - validates empty subsidiary risk correctly', () => {
        const material = createClass8Material('UN1789', '8', 'A12.2', 'HYDROCHLORIC ACID', 'II');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 9: UN1823 - validates empty subsidiary risk correctly', () => {
        const material = createClass8Material('UN1823', '8', 'A12.3', 'SODIUM HYDROXIDE, SOLID', 'II');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 15: UN2790 - validates empty subsidiary risk correctly', () => {
        const material = createClass8Material('UN2790', '8', 'A12.2', 'ACETIC ACID SOLUTION', 'III');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 18: UN1805 - validates empty subsidiary risk correctly', () => {
        const material = createClass8Material('UN1805', '8', 'A12.2', 'PHOSPHORIC ACID, SOLUTION', 'III');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });
    });

    describe('Positive Cases - Single Subsidiary Risk (6.1 Toxic)', () => {
      test('Scenario 2: UN1790 - validates subsidiary risk 6.1 correctly', () => {
        const material = createClass8Material('UN1790', '8', 'A12.2', 'HYDROFLUORIC ACID', 'I', '6.1');
        const result = validateSubsidiaryRisk(material, '6.1');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 6: UN2922 - validates subsidiary risk 6.1 correctly', () => {
        const material = createClass8Material('UN2922', '8', 'A12.2', 'CORROSIVE LIQUID, TOXIC, N.O.S.', 'I', '6.1', true);
        const result = validateSubsidiaryRisk(material, '6.1');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 17: UN2809 - validates subsidiary risk 6.1 correctly', () => {
        const material = createClass8Material('UN2809', '8', 'A12.9', 'MERCURY', 'III', '6.1');
        const result = validateSubsidiaryRisk(material, '6.1');
        expect(result.isValid).toBe(true);
      });
    });

    describe('Positive Cases - Single Subsidiary Risk (3 Flammable)', () => {
      test('Scenario 8: UN2789 - validates subsidiary risk 3 correctly', () => {
        const material = createClass8Material('UN2789', '8', 'A12.2', 'ACETIC ACID, GLACIAL', 'II', '3');
        const result = validateSubsidiaryRisk(material, '3');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 13: UN2920 - validates subsidiary risk 3 correctly', () => {
        const material = createClass8Material('UN2920', '8', 'A12.2', 'CORROSIVE LIQUID, FLAMMABLE, N.O.S.', 'II', '3', true);
        const result = validateSubsidiaryRisk(material, '3');
        expect(result.isValid).toBe(true);
      });
    });

    describe('Positive Cases - Single Subsidiary Risk (5.1 Oxidizer)', () => {
      test('Scenario 14: UN1802 - validates subsidiary risk 5.1 correctly', () => {
        const material = createClass8Material('UN1802', '8', 'A12.2', 'PERCHLORIC ACID', 'II', '5.1');
        const result = validateSubsidiaryRisk(material, '5.1');
        expect(result.isValid).toBe(true);
      });
    });

    describe('Positive Cases - Multiple Subsidiary Risks', () => {
      test('Scenario 3: UN2032 - validates multiple subsidiary risks 5.1, 6.1 correctly', () => {
        const material = createClass8Material('UN2032', '8', 'A12.11', 'NITRIC ACID, RED FUMING', 'I', '5.1, 6.1');
        const result = validateSubsidiaryRisk(material, '5.1, 6.1');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 4: UN2029 - validates multiple subsidiary risks 3, 6.1 correctly', () => {
        const material = createClass8Material('UN2029', '8', 'A12.2', 'HYDRAZINE, ANHYDROUS', 'I', '3, 6.1');
        const result = validateSubsidiaryRisk(material, '3, 6.1');
        expect(result.isValid).toBe(true);
      });
    });

    describe('Negative Cases - Missing or Wrong Subsidiary Risk', () => {
      test('Scenario 2, Alteration 1: REJECTS empty when 6.1 expected', () => {
        const material = createClass8Material('UN1790', '8', 'A12.2', 'HYDROFLUORIC ACID', 'I', '6.1');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('6.1');
      });

      test('Scenario 3, Alteration 1: REJECTS only "5.1" when "5.1, 6.1" expected', () => {
        const material = createClass8Material('UN2032', '8', 'A12.11', 'NITRIC ACID, RED FUMING', 'I', '5.1, 6.1');
        const result = validateSubsidiaryRisk(material, '5.1');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('5.1, 6.1');
      });

      test('Scenario 8, Alteration 3: REJECTS empty when 3 expected', () => {
        const material = createClass8Material('UN2789', '8', 'A12.2', 'ACETIC ACID, GLACIAL', 'II', '3');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('3');
      });

      test('Scenario 13, Alteration 3: REJECTS empty when 3 expected (N.O.S. flammable)', () => {
        const material = createClass8Material('UN2920', '8', 'A12.2', 'CORROSIVE LIQUID, FLAMMABLE, N.O.S.', 'II', '3', true);
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('3');
      });

      test('Scenario 14, Alteration 1: REJECTS empty when 5.1 expected', () => {
        const material = createClass8Material('UN1802', '8', 'A12.2', 'PERCHLORIC ACID', 'II', '5.1');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('5.1');
      });

      test('Scenario 14, Alteration 3: REJECTS "5.2" when "5.1" expected (wrong division)', () => {
        const material = createClass8Material('UN1802', '8', 'A12.2', 'PERCHLORIC ACID', 'II', '5.1');
        const result = validateSubsidiaryRisk(material, '5.2');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('5.1');
      });

      test('Scenario 17, Alteration 2: REJECTS empty when 6.1 expected (mercury)', () => {
        const material = createClass8Material('UN2809', '8', 'A12.9', 'MERCURY', 'III', '6.1');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('6.1');
      });

      test('REJECTS wrong subsidiary class (6.2 instead of 6.1)', () => {
        const material = createClass8Material('UN1790', '8', 'A12.2', 'HYDROFLUORIC ACID', 'I', '6.1');
        const result = validateSubsidiaryRisk(material, '6.2');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('6.1');
      });
    });
  });

  describe('All 20 Scenarios - Integration Validation', () => {
    const scenarios = [
      { scenario: 1, unid: 'UN1830', hazClass: '8', pg: 'I', pkg: 'A12.2', subsidiary: '', psn: 'SULFURIC ACID, FUMING' },
      { scenario: 2, unid: 'UN1790', hazClass: '8', pg: 'I', pkg: 'A12.2', subsidiary: '6.1', psn: 'HYDROFLUORIC ACID' },
      { scenario: 3, unid: 'UN2032', hazClass: '8', pg: 'I', pkg: 'A12.11', subsidiary: '5.1, 6.1', psn: 'NITRIC ACID, RED FUMING' },
      { scenario: 4, unid: 'UN2029', hazClass: '8', pg: 'I', pkg: 'A12.2', subsidiary: '3, 6.1', psn: 'HYDRAZINE, ANHYDROUS' },
      { scenario: 5, unid: 'UN1760', hazClass: '8', pg: 'I', pkg: 'A12.2', subsidiary: '', psn: 'CORROSIVE LIQUID, N.O.S.' },
      { scenario: 6, unid: 'UN2922', hazClass: '8', pg: 'I', pkg: 'A12.2', subsidiary: '6.1', psn: 'CORROSIVE LIQUID, TOXIC, N.O.S.' },
      { scenario: 7, unid: 'UN1789', hazClass: '8', pg: 'II', pkg: 'A12.2', subsidiary: '', psn: 'HYDROCHLORIC ACID' },
      { scenario: 8, unid: 'UN2789', hazClass: '8', pg: 'II', pkg: 'A12.2', subsidiary: '3', psn: 'ACETIC ACID, GLACIAL' },
      { scenario: 9, unid: 'UN1823', hazClass: '8', pg: 'II', pkg: 'A12.3', subsidiary: '', psn: 'SODIUM HYDROXIDE, SOLID' },
      { scenario: 10, unid: 'UN2796', hazClass: '8', pg: 'II', pkg: 'A12.4', subsidiary: '', psn: 'BATTERY FLUID, ACID' },
      { scenario: 11, unid: 'UN2794', hazClass: '8', pg: '', pkg: 'A12.4', subsidiary: '', psn: 'BATTERIES, WET, FILLED WITH ACID' },
      { scenario: 12, unid: 'UN1824', hazClass: '8', pg: 'II', pkg: 'A12.2', subsidiary: '', psn: 'SODIUM HYDROXIDE, SOLUTION' },
      { scenario: 13, unid: 'UN2920', hazClass: '8', pg: 'II', pkg: 'A12.2', subsidiary: '3', psn: 'CORROSIVE LIQUID, FLAMMABLE, N.O.S.' },
      { scenario: 14, unid: 'UN1802', hazClass: '8', pg: 'II', pkg: 'A12.2', subsidiary: '5.1', psn: 'PERCHLORIC ACID' },
      { scenario: 15, unid: 'UN2790', hazClass: '8', pg: 'III', pkg: 'A12.2', subsidiary: '', psn: 'ACETIC ACID SOLUTION' },
      { scenario: 16, unid: 'UN2672', hazClass: '8', pg: 'III', pkg: 'A12.2', subsidiary: '', psn: 'AMMONIA SOLUTION' },
      { scenario: 17, unid: 'UN2809', hazClass: '8', pg: 'III', pkg: 'A12.9', subsidiary: '6.1', psn: 'MERCURY' },
      { scenario: 18, unid: 'UN1805', hazClass: '8', pg: 'III', pkg: 'A12.2', subsidiary: '', psn: 'PHOSPHORIC ACID, SOLUTION' },
      { scenario: 19, unid: 'UN1759', hazClass: '8', pg: 'III', pkg: 'A12.3', subsidiary: '', psn: 'CORROSIVE SOLID, N.O.S.' },
      { scenario: 20, unid: 'UN3264', hazClass: '8', pg: 'III', pkg: 'A12.2', subsidiary: '', psn: 'CORROSIVE LIQUID, ACIDIC, INORGANIC, N.O.S.' },
    ];

    scenarios.forEach(({ scenario, unid, hazClass, pg, pkg, subsidiary, psn }) => {
      test(`Scenario ${scenario}: ${unid} - all validations pass`, () => {
        const material = createClass8Material(unid, hazClass, pkg, psn, pg, subsidiary);

        expect(validateHazardClass(material, hazClass).isValid).toBe(true);
        expect(validatePackingGroup(material, pg).isValid).toBe(true);
        expect(validatePackingInstruction(material, pkg).isValid).toBe(true);
        expect(validateSubsidiaryRisk(material, subsidiary).isValid).toBe(true);
      });
    });
  });

  describe('Unified validateSDDGInspection() Function', () => {
    describe('Scenario 1: UN1830 - Complete SDDG Validation (PG I, CAO)', () => {
      const material = createClass8Material(
        'UN1830', '8', 'A12.2',
        'SULFURIC ACID, FUMING with less than 30% free sulfur trioxide',
        'I', '', false, 'P3, A7, N34'
      );

      test('validates successful SDDG with all correct values', () => {
        const content = createSDDGContent({
          aircraftType: 'CARGO AIRCRAFT ONLY',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN1830',
          properShippingName: 'SULFURIC ACID, FUMING with less than 30% free sulfur trioxide',
          hazardClass: '8',
          subsidiaryRisk: '',
          packingGroup: 'I',
          packingInstruction: 'A12.2',
        });

        const results = validateSDDGInspection(content, material);
        const failures = results.filter(r => !r.isValid);

        expect(failures).toHaveLength(0);
      });

      test('Alteration 1: identifies Key 13 showing "8.1" instead of "8" (Class 8 has NO divisions)', () => {
        const content = createSDDGContent({
          aircraftType: 'CARGO AIRCRAFT ONLY',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN1830',
          properShippingName: 'SULFURIC ACID, FUMING with less than 30% free sulfur trioxide',
          hazardClass: '8.1',  // Invalid - Class 8 has no divisions
          subsidiaryRisk: '',
          packingGroup: 'I',
          packingInstruction: 'A12.2',
        });

        const results = validateSDDGInspection(content, material);
        const hazardClassResult = results.find(r => r.key === 'hazardClass');

        expect(hazardClassResult?.isValid).toBe(false);
        expect(hazardClassResult?.expectedValue).toBe('8');
      });
    });

    describe('Scenario 7: UN1789 - Hydrochloric Acid (PG II, P4 CAO)', () => {
      const material = createClass8Material(
        'UN1789', '8', 'A12.2',
        'HYDROCHLORIC ACID',
        'II', '', false, 'P4, A3, N41'
      );

      test('validates successful SDDG with all correct values', () => {
        const content = createSDDGContent({
          aircraftType: 'CARGO AIRCRAFT ONLY',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN1789',
          properShippingName: 'HYDROCHLORIC ACID',
          hazardClass: '8',
          subsidiaryRisk: '',
          packingGroup: 'II',
          packingInstruction: 'A12.2',
        });

        const results = validateSDDGInspection(content, material);
        const failures = results.filter(r => !r.isValid);

        expect(failures).toHaveLength(0);
      });

      test('Alteration 1: identifies Key 15 showing "Z" instead of "Y" (PG II requires X or Y)', () => {
        const content = createSDDGContent({
          aircraftType: 'CARGO AIRCRAFT ONLY',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN1789',
          properShippingName: 'HYDROCHLORIC ACID',
          hazardClass: '8',
          subsidiaryRisk: '',
          packingGroup: 'III',  // Wrong - should be II
          packingInstruction: 'A12.2',
        });

        const results = validateSDDGInspection(content, material);
        const pgResult = results.find(r => r.key === 'packingGroup');

        expect(pgResult?.isValid).toBe(false);
        expect(pgResult?.expectedValue).toBe('II');
      });

      test('Alteration 2: identifies missing CAO label when P4 requires it', () => {
        const content = createSDDGContent({
          aircraftType: 'PASSENGER AND CARGO AIRCRAFT',  // Wrong - P4 requires CAO
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN1789',
          properShippingName: 'HYDROCHLORIC ACID',
          hazardClass: '8',
          subsidiaryRisk: '',
          packingGroup: 'II',
          packingInstruction: 'A12.2',
        });

        const results = validateSDDGInspection(content, material);
        const aircraftResult = results.find(r => r.key === 'aircraftType');

        expect(aircraftResult?.isValid).toBe(false);
        expect(aircraftResult?.expectedValue).toBe('CARGO AIRCRAFT ONLY');
      });
    });

    describe('Scenario 8: UN2789 - Acetic Acid, Glacial (PG II, P5 PAX, subsidiary 3)', () => {
      const material = createClass8Material(
        'UN2789', '8', 'A12.2',
        'ACETIC ACID, GLACIAL or acetic acid solution, more than 80% acid, by mass',
        'II', '3', false, 'P5, A3, A7, A10'
      );

      test('validates successful SDDG with all correct values', () => {
        const content = createSDDGContent({
          aircraftType: 'PASSENGER AND CARGO AIRCRAFT',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN2789',
          properShippingName: 'ACETIC ACID, GLACIAL or acetic acid solution, more than 80% acid, by mass',
          hazardClass: '8',
          subsidiaryRisk: '3',
          packingGroup: 'II',
          packingInstruction: 'A12.2',
        });

        const results = validateSDDGInspection(content, material);
        const failures = results.filter(r => !r.isValid);

        expect(failures).toHaveLength(0);
      });

      test('Alteration 3: identifies Key 14 empty when subsidiary 3 required', () => {
        const content = createSDDGContent({
          aircraftType: 'PASSENGER AND CARGO AIRCRAFT',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN2789',
          properShippingName: 'ACETIC ACID, GLACIAL or acetic acid solution, more than 80% acid, by mass',
          hazardClass: '8',
          subsidiaryRisk: '',  // Missing subsidiary risk 3
          packingGroup: 'II',
          packingInstruction: 'A12.2',
        });

        const results = validateSDDGInspection(content, material);
        const subsidiaryResult = results.find(r => r.key === 'subsidiaryRisk');

        expect(subsidiaryResult?.isValid).toBe(false);
        expect(subsidiaryResult?.expectedValue).toBe('3');
      });
    });

    describe('Scenario 11: UN2794 - Wet Batteries (No PG, P5 PAX)', () => {
      const material = createClass8Material(
        'UN2794', '8', 'A12.4',
        'BATTERIES, WET, FILLED WITH ACID, electric storage',
        '', '', false, 'P5'
      );

      test('validates successful SDDG with empty packing group (battery exception)', () => {
        const content = createSDDGContent({
          aircraftType: 'PASSENGER AND CARGO AIRCRAFT',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN2794',
          properShippingName: 'BATTERIES, WET, FILLED WITH ACID, electric storage',
          hazardClass: '8',
          subsidiaryRisk: '',
          packingGroup: '',  // Empty - wet batteries have no PG
          packingInstruction: 'A12.4',
        });

        const results = validateSDDGInspection(content, material);
        const failures = results.filter(r => !r.isValid);

        expect(failures).toHaveLength(0);
      });

      test('Alteration 1: identifies Key 15 showing "II" when should be empty (battery exception)', () => {
        const content = createSDDGContent({
          aircraftType: 'PASSENGER AND CARGO AIRCRAFT',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN2794',
          properShippingName: 'BATTERIES, WET, FILLED WITH ACID, electric storage',
          hazardClass: '8',
          subsidiaryRisk: '',
          packingGroup: 'II',  // Wrong - wet batteries have no PG
          packingInstruction: 'A12.4',
        });

        const results = validateSDDGInspection(content, material);
        const pgResult = results.find(r => r.key === 'packingGroup');

        expect(pgResult?.isValid).toBe(false);
      });
    });

    describe('Scenario 17: UN2809 - Mercury (PG III, P5 PAX, subsidiary 6.1)', () => {
      const material = createClass8Material(
        'UN2809', '8', 'A12.9',
        'MERCURY',
        'III', '6.1', false, 'P5'
      );

      test('validates successful SDDG with all correct values', () => {
        const content = createSDDGContent({
          aircraftType: 'PASSENGER AND CARGO AIRCRAFT',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN2809',
          properShippingName: 'MERCURY',
          hazardClass: '8',
          subsidiaryRisk: '6.1',
          packingGroup: 'III',
          packingInstruction: 'A12.9',
        });

        const results = validateSDDGInspection(content, material);
        const failures = results.filter(r => !r.isValid);

        expect(failures).toHaveLength(0);
      });

      test('Alteration 1: identifies Key 17 showing A12.2 instead of A12.9 (mercury-specific)', () => {
        const content = createSDDGContent({
          aircraftType: 'PASSENGER AND CARGO AIRCRAFT',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN2809',
          properShippingName: 'MERCURY',
          hazardClass: '8',
          subsidiaryRisk: '6.1',
          packingGroup: 'III',
          packingInstruction: 'A12.2',  // Wrong - should be A12.9
        });

        const results = validateSDDGInspection(content, material);
        const pkgResult = results.find(r => r.key === 'packingInstruction');

        expect(pkgResult?.isValid).toBe(false);
        expect(pkgResult?.expectedValue).toBe('A12.9');
      });

      test('Alteration 3: identifies Key 14 empty when 6.1 expected', () => {
        const content = createSDDGContent({
          aircraftType: 'PASSENGER AND CARGO AIRCRAFT',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN2809',
          properShippingName: 'MERCURY',
          hazardClass: '8',
          subsidiaryRisk: '',  // Missing toxic subsidiary
          packingGroup: 'III',
          packingInstruction: 'A12.9',
        });

        const results = validateSDDGInspection(content, material);
        const subsidiaryResult = results.find(r => r.key === 'subsidiaryRisk');

        expect(subsidiaryResult?.isValid).toBe(false);
        expect(subsidiaryResult?.expectedValue).toBe('6.1');
      });
    });

    describe('Scenario 3: UN2032 - Nitric Acid, Red Fuming (Multiple Subsidiary Risks)', () => {
      const material = createClass8Material(
        'UN2032', '8', 'A12.11',
        'NITRIC ACID, RED FUMING',
        'I', '5.1, 6.1', false, 'P2, 2'
      );

      test('validates successful SDDG with multiple subsidiary risks', () => {
        const content = createSDDGContent({
          aircraftType: 'CARGO AIRCRAFT ONLY',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN2032',
          properShippingName: 'NITRIC ACID, RED FUMING',
          hazardClass: '8',
          subsidiaryRisk: '5.1, 6.1',
          packingGroup: 'I',
          packingInstruction: 'A12.11',
        });

        const results = validateSDDGInspection(content, material);
        const failures = results.filter(r => !r.isValid);

        expect(failures).toHaveLength(0);
      });

      test('Alteration 1: identifies Key 14 showing only "5.1" (missing 6.1)', () => {
        const content = createSDDGContent({
          aircraftType: 'CARGO AIRCRAFT ONLY',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN2032',
          properShippingName: 'NITRIC ACID, RED FUMING',
          hazardClass: '8',
          subsidiaryRisk: '5.1',  // Missing 6.1
          packingGroup: 'I',
          packingInstruction: 'A12.11',
        });

        const results = validateSDDGInspection(content, material);
        const subsidiaryResult = results.find(r => r.key === 'subsidiaryRisk');

        expect(subsidiaryResult?.isValid).toBe(false);
        expect(subsidiaryResult?.expectedValue).toBe('5.1, 6.1');
      });

      test('Alteration 3: identifies Key 17 showing A12.2 instead of A12.11', () => {
        const content = createSDDGContent({
          aircraftType: 'CARGO AIRCRAFT ONLY',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN2032',
          properShippingName: 'NITRIC ACID, RED FUMING',
          hazardClass: '8',
          subsidiaryRisk: '5.1, 6.1',
          packingGroup: 'I',
          packingInstruction: 'A12.2',  // Wrong - should be A12.11
        });

        const results = validateSDDGInspection(content, material);
        const pkgResult = results.find(r => r.key === 'packingInstruction');

        expect(pkgResult?.isValid).toBe(false);
        expect(pkgResult?.expectedValue).toBe('A12.11');
      });
    });

    describe('Scenario 5: UN1760 - N.O.S. with Technical Name', () => {
      const material = createClass8Material(
        'UN1760', '8', 'A12.2',
        'CORROSIVE LIQUID, N.O.S. (contains phosphorus trichloride)',
        'I', '', true, 'P3, A7'
      );

      test('validates successful SDDG with N.O.S. and technical name', () => {
        const content = createSDDGContent({
          aircraftType: 'CARGO AIRCRAFT ONLY',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN1760',
          properShippingName: 'CORROSIVE LIQUID, N.O.S. (contains phosphorus trichloride)',
          hazardClass: '8',
          subsidiaryRisk: '',
          packingGroup: 'I',
          packingInstruction: 'A12.2',
        });

        const results = validateSDDGInspection(content, material);
        const failures = results.filter(r => !r.isValid);

        expect(failures).toHaveLength(0);
      });

      test('Alteration 1: identifies Key 12 missing technical name for N.O.S.', () => {
        const content = createSDDGContent({
          aircraftType: 'CARGO AIRCRAFT ONLY',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN1760',
          properShippingName: 'CORROSIVE LIQUID, N.O.S.',  // Missing technical name
          hazardClass: '8',
          subsidiaryRisk: '',
          packingGroup: 'I',
          packingInstruction: 'A12.2',
        });

        const results = validateSDDGInspection(content, material);
        const psnResult = results.find(r => r.key === 'properShippingName');

        expect(psnResult?.isValid).toBe(false);
      });
    });

    describe('Multiple Errors Detection', () => {
      test('identifies multiple validation failures in single SDDG', () => {
        const material = createClass8Material(
          'UN1789', '8', 'A12.2',
          'HYDROCHLORIC ACID',
          'II', '', false, 'P4'
        );

        const content = createSDDGContent({
          aircraftType: 'PASSENGER AND CARGO AIRCRAFT',  // Wrong - P4 requires CAO
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN1788',  // Wrong UN number
          properShippingName: 'HCL ACID',  // Wrong PSN
          hazardClass: '8.1',  // Wrong - Class 8 has no divisions
          subsidiaryRisk: '',
          packingGroup: 'III',  // Wrong - should be II
          packingInstruction: 'A12.4',  // Wrong - should be A12.2
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
          unIdNo: 'UN1789',
          hazardClass: '8',
        });

        const results = validateSDDGInspection(content, null);
        expect(results).toHaveLength(0);
      });

      test('returns empty array when content is null', () => {
        const material = createClass8Material('UN1789', '8', 'A12.2', 'HYDROCHLORIC ACID', 'II');
        const results = validateSDDGInspection(null, material);
        expect(results).toHaveLength(0);
      });
    });
  });
});
