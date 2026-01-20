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

// Helper to create minimal HazardousMaterialItem for testing
function createClass4Material(
  unid: string,
  hazclassDiv: string,
  packagingParagraph: string,
  properShippingName: string,
  packingGroup: string = '',
  subsidiaryRisk: string = '',
  specialProvision: string = ''
): HazardousMaterialItem {
  return {
    unid,
    hazclassDiv,
    packagingParagraph,
    properShippingName,
    packingGroup, // Class 4 HAS packing groups (I, II, III)
    subsidiaryRisk,
    specialProvision,
    isTechnicalNameRequired: properShippingName.includes('N.O.S.'),
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

describe('SDDG Validation - Class 4 (Flammable Solids)', () => {
  describe('Key 7: Aircraft Type Validation', () => {
    describe('Positive Cases - Passenger and Cargo Aircraft (P5)', () => {
      // Division 4.1 - P5 scenarios
      test('Scenario 1: UN1325 - validates Passenger and Cargo with P5 special provision', () => {
        const material = createClass4Material('UN1325', '4.1', 'A8.3', 'FLAMMABLE SOLID, ORGANIC, N.O.S.', 'II', '', 'P5');
        const result = validateAircraftType(material, 'PASSENGER AND CARGO AIRCRAFT');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 2: UN1944 - validates Passenger and Cargo with P5 special provision', () => {
        const material = createClass4Material('UN1944', '4.1', 'A8.14', 'MATCHES, SAFETY', 'III', '', 'P5');
        const result = validateAircraftType(material, 'PASSENGER AND CARGO AIRCRAFT');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 5: UN2304 - validates Passenger and Cargo with P5 special provision', () => {
        const material = createClass4Material('UN2304', '4.1', 'A8.2', 'NAPHTHALENE, MOLTEN', 'III', '', 'P5');
        const result = validateAircraftType(material, 'PASSENGER AND CARGO AIRCRAFT');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 7: UN2000 - validates Passenger and Cargo with P5 special provision', () => {
        const material = createClass4Material('UN2000', '4.1', 'A8.3', 'CELLULOID', 'III', '', 'P5');
        const result = validateAircraftType(material, 'PASSENGER AND CARGO AIRCRAFT');
        expect(result.isValid).toBe(true);
      });

      // Division 4.2 - P5 scenario
      test('Scenario 12: UN1373 - validates Passenger and Cargo with P5 special provision', () => {
        const material = createClass4Material('UN1373', '4.2', 'A8.3', 'FIBERS or FABRICS, ANIMAL or VEGETABLE with oil, N.O.S.', 'III', '', 'P5');
        const result = validateAircraftType(material, 'PASSENGER AND CARGO AIRCRAFT');
        expect(result.isValid).toBe(true);
      });

      // Division 4.3 - P5 scenario
      test('Scenario 16: UN1402 - validates Passenger and Cargo with P5 special provision', () => {
        const material = createClass4Material('UN1402', '4.3', 'A8.3', 'CALCIUM CARBIDE', 'II', '', 'P5');
        const result = validateAircraftType(material, 'PASSENGER AND CARGO AIRCRAFT');
        expect(result.isValid).toBe(true);
      });
    });

    describe('Positive Cases - Cargo Aircraft Only (P3/P4)', () => {
      // Division 4.1 - P4 scenarios
      test('Scenario 3: UN1310 - validates CAO with P4 special provision', () => {
        const material = createClass4Material('UN1310', '4.1', 'A8.3', 'AMMONIUM PICRATE, WETTED', 'I', '', 'P4');
        const result = validateAircraftType(material, 'CARGO AIRCRAFT ONLY');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 4: UN1571 - validates CAO with P4 special provision', () => {
        const material = createClass4Material('UN1571', '4.1', 'A8.10', 'BARIUM AZIDE, WETTED', 'I', '6.1', 'P4');
        const result = validateAircraftType(material, 'CARGO AIRCRAFT ONLY');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 6: UN3221 - validates CAO with P4 special provision (self-reactive)', () => {
        const material = createClass4Material('UN3221', '4.1', 'A8.4', 'SELF-REACTIVE LIQUID TYPE B', '', '', 'P4');
        const result = validateAircraftType(material, 'CARGO AIRCRAFT ONLY');
        expect(result.isValid).toBe(true);
      });

      // Division 4.2 - P3/P4 scenarios
      test('Scenario 8: UN2845 - validates CAO with P3 special provision (pyrophoric liquid)', () => {
        const material = createClass4Material('UN2845', '4.2', 'A8.5', 'PYROPHORIC LIQUID, ORGANIC, N.O.S.', 'I', '', 'P3');
        const result = validateAircraftType(material, 'CARGO AIRCRAFT ONLY');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 9: UN1383 - validates CAO with P3 special provision (pyrophoric metal)', () => {
        const material = createClass4Material('UN1383', '4.2', 'A8.5', 'PYROPHORIC METAL, N.O.S.', 'I', '', 'P3');
        const result = validateAircraftType(material, 'CARGO AIRCRAFT ONLY');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 10: UN3088 - validates CAO with P4 special provision (self-heating)', () => {
        const material = createClass4Material('UN3088', '4.2', 'A8.3', 'SELF-HEATING SOLID, ORGANIC, N.O.S.', 'II', '', 'P4');
        const result = validateAircraftType(material, 'CARGO AIRCRAFT ONLY');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 11: UN2447 - validates CAO with P3 special provision (phosphorus)', () => {
        const material = createClass4Material('UN2447', '4.2', 'A8.5', 'PHOSPHORUS, WHITE, MOLTEN', 'I', '6.1', 'P3');
        const result = validateAircraftType(material, 'CARGO AIRCRAFT ONLY');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 13: UN3206 - validates CAO with P4 special provision', () => {
        const material = createClass4Material('UN3206', '4.2', 'A8.3', 'ALKALI METAL ALCOHOLATES, SELF-HEATING, CORROSIVE, N.O.S.', 'II', '8', 'P4');
        const result = validateAircraftType(material, 'CARGO AIRCRAFT ONLY');
        expect(result.isValid).toBe(true);
      });

      // Division 4.3 - P3/P4 scenarios
      test('Scenario 14: UN1428 - validates CAO with P3 special provision (sodium)', () => {
        const material = createClass4Material('UN1428', '4.3', 'A8.3', 'SODIUM', 'I', '', 'P3');
        const result = validateAircraftType(material, 'CARGO AIRCRAFT ONLY');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 15: UN1415 - validates CAO with P3 special provision (lithium)', () => {
        const material = createClass4Material('UN1415', '4.3', 'A8.3', 'LITHIUM', 'I', '', 'P3');
        const result = validateAircraftType(material, 'CARGO AIRCRAFT ONLY');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 17: UN2813 - validates CAO with P4 special provision', () => {
        const material = createClass4Material('UN2813', '4.3', 'A8.3', 'WATER-REACTIVE SOLID, N.O.S.', 'II', '', 'P4');
        const result = validateAircraftType(material, 'CARGO AIRCRAFT ONLY');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 18: UN1396 - validates CAO with P4 special provision', () => {
        const material = createClass4Material('UN1396', '4.3', 'A8.3', 'ALUMINIUM POWDER, UNCOATED', 'II', '', 'P4');
        const result = validateAircraftType(material, 'CARGO AIRCRAFT ONLY');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 19: UN1400 - validates CAO with P4 special provision', () => {
        const material = createClass4Material('UN1400', '4.3', 'A8.3', 'BARIUM', 'II', '', 'P4');
        const result = validateAircraftType(material, 'CARGO AIRCRAFT ONLY');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 20: UN3148 - validates CAO with P3 special provision (water-reactive liquid)', () => {
        const material = createClass4Material('UN3148', '4.3', 'A8.2', 'WATER-REACTIVE LIQUID, N.O.S.', 'I', '', 'P3');
        const result = validateAircraftType(material, 'CARGO AIRCRAFT ONLY');
        expect(result.isValid).toBe(true);
      });
    });

    describe('Negative Cases - From Alterations', () => {
      test('Scenario 3, Alteration 1: rejects Passenger and Cargo when P4 requires CAO', () => {
        const material = createClass4Material('UN1310', '4.1', 'A8.3', 'AMMONIUM PICRATE, WETTED', 'I', '', 'P4');
        const result = validateAircraftType(material, 'PASSENGER AND CARGO AIRCRAFT');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('CARGO AIRCRAFT ONLY');
      });

      test('Scenario 9, Alteration 2: rejects Passenger and Cargo when P3 requires CAO', () => {
        const material = createClass4Material('UN1383', '4.2', 'A8.5', 'PYROPHORIC METAL, N.O.S.', 'I', '', 'P3');
        const result = validateAircraftType(material, 'PASSENGER AND CARGO AIRCRAFT');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('CARGO AIRCRAFT ONLY');
      });

      test('Scenario 14, Alteration 2: rejects Passenger and Cargo when P3 requires CAO', () => {
        const material = createClass4Material('UN1428', '4.3', 'A8.3', 'SODIUM', 'I', '', 'P3');
        const result = validateAircraftType(material, 'PASSENGER AND CARGO AIRCRAFT');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('CARGO AIRCRAFT ONLY');
      });

      test('Scenario 18, Alteration 3: rejects Passenger and Cargo when P4 requires CAO', () => {
        const material = createClass4Material('UN1396', '4.3', 'A8.3', 'ALUMINIUM POWDER, UNCOATED', 'II', '', 'P4');
        const result = validateAircraftType(material, 'PASSENGER AND CARGO AIRCRAFT');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('CARGO AIRCRAFT ONLY');
      });

      test('P5 material incorrectly marked as CAO only is too restrictive', () => {
        const material = createClass4Material('UN1944', '4.1', 'A8.14', 'MATCHES, SAFETY', 'III', '', 'P5');
        const result = validateAircraftType(material, 'CARGO AIRCRAFT ONLY');
        expect(result.isValid).toBe(false);
      });
    });
  });

  describe('Key 11: UN/ID Number Validation', () => {
    describe('Positive Cases - Matching UN Numbers', () => {
      // Division 4.1
      test('Scenario 1: UN1325 - validates UN number correctly', () => {
        const material = createClass4Material('UN1325', '4.1', 'A8.3', 'FLAMMABLE SOLID, ORGANIC, N.O.S.', 'II');
        const result = validateUnidNumber(material, 'UN1325');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 2: UN1944 - validates UN number correctly', () => {
        const material = createClass4Material('UN1944', '4.1', 'A8.14', 'MATCHES, SAFETY', 'III');
        const result = validateUnidNumber(material, 'UN1944');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 3: UN1310 - validates UN number correctly', () => {
        const material = createClass4Material('UN1310', '4.1', 'A8.3', 'AMMONIUM PICRATE, WETTED', 'I');
        const result = validateUnidNumber(material, 'UN1310');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 4: UN1571 - validates UN number correctly', () => {
        const material = createClass4Material('UN1571', '4.1', 'A8.10', 'BARIUM AZIDE, WETTED', 'I', '6.1');
        const result = validateUnidNumber(material, 'UN1571');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 5: UN2304 - validates UN number correctly', () => {
        const material = createClass4Material('UN2304', '4.1', 'A8.2', 'NAPHTHALENE, MOLTEN', 'III');
        const result = validateUnidNumber(material, 'UN2304');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 6: UN3221 - validates UN number correctly', () => {
        const material = createClass4Material('UN3221', '4.1', 'A8.4', 'SELF-REACTIVE LIQUID TYPE B', '');
        const result = validateUnidNumber(material, 'UN3221');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 7: UN2000 - validates UN number correctly', () => {
        const material = createClass4Material('UN2000', '4.1', 'A8.3', 'CELLULOID', 'III');
        const result = validateUnidNumber(material, 'UN2000');
        expect(result.isValid).toBe(true);
      });

      // Division 4.2
      test('Scenario 8: UN2845 - validates UN number correctly', () => {
        const material = createClass4Material('UN2845', '4.2', 'A8.5', 'PYROPHORIC LIQUID, ORGANIC, N.O.S.', 'I');
        const result = validateUnidNumber(material, 'UN2845');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 9: UN1383 - validates UN number correctly', () => {
        const material = createClass4Material('UN1383', '4.2', 'A8.5', 'PYROPHORIC METAL, N.O.S.', 'I');
        const result = validateUnidNumber(material, 'UN1383');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 10: UN3088 - validates UN number correctly', () => {
        const material = createClass4Material('UN3088', '4.2', 'A8.3', 'SELF-HEATING SOLID, ORGANIC, N.O.S.', 'II');
        const result = validateUnidNumber(material, 'UN3088');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 11: UN2447 - validates UN number correctly', () => {
        const material = createClass4Material('UN2447', '4.2', 'A8.5', 'PHOSPHORUS, WHITE, MOLTEN', 'I', '6.1');
        const result = validateUnidNumber(material, 'UN2447');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 12: UN1373 - validates UN number correctly', () => {
        const material = createClass4Material('UN1373', '4.2', 'A8.3', 'FIBERS or FABRICS, ANIMAL or VEGETABLE with oil, N.O.S.', 'III');
        const result = validateUnidNumber(material, 'UN1373');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 13: UN3206 - validates UN number correctly', () => {
        const material = createClass4Material('UN3206', '4.2', 'A8.3', 'ALKALI METAL ALCOHOLATES, SELF-HEATING, CORROSIVE, N.O.S.', 'II', '8');
        const result = validateUnidNumber(material, 'UN3206');
        expect(result.isValid).toBe(true);
      });

      // Division 4.3
      test('Scenario 14: UN1428 - validates UN number correctly', () => {
        const material = createClass4Material('UN1428', '4.3', 'A8.3', 'SODIUM', 'I');
        const result = validateUnidNumber(material, 'UN1428');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 15: UN1415 - validates UN number correctly', () => {
        const material = createClass4Material('UN1415', '4.3', 'A8.3', 'LITHIUM', 'I');
        const result = validateUnidNumber(material, 'UN1415');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 16: UN1402 - validates UN number correctly', () => {
        const material = createClass4Material('UN1402', '4.3', 'A8.3', 'CALCIUM CARBIDE', 'II');
        const result = validateUnidNumber(material, 'UN1402');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 17: UN2813 - validates UN number correctly', () => {
        const material = createClass4Material('UN2813', '4.3', 'A8.3', 'WATER-REACTIVE SOLID, N.O.S.', 'II');
        const result = validateUnidNumber(material, 'UN2813');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 18: UN1396 - validates UN number correctly', () => {
        const material = createClass4Material('UN1396', '4.3', 'A8.3', 'ALUMINIUM POWDER, UNCOATED', 'II');
        const result = validateUnidNumber(material, 'UN1396');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 19: UN1400 - validates UN number correctly', () => {
        const material = createClass4Material('UN1400', '4.3', 'A8.3', 'BARIUM', 'II');
        const result = validateUnidNumber(material, 'UN1400');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 20: UN3148 - validates UN number correctly', () => {
        const material = createClass4Material('UN3148', '4.3', 'A8.2', 'WATER-REACTIVE LIQUID, N.O.S.', 'I');
        const result = validateUnidNumber(material, 'UN3148');
        expect(result.isValid).toBe(true);
      });

      test('handles lowercase UN prefix', () => {
        const material = createClass4Material('UN1325', '4.1', 'A8.3', 'FLAMMABLE SOLID, ORGANIC, N.O.S.', 'II');
        const result = validateUnidNumber(material, 'un1325');
        expect(result.isValid).toBe(true);
      });
    });

    describe('Negative Cases - From Alterations', () => {
      test('Scenario 2, Alteration 2: rejects UN1945 when UN1944 expected (similar number)', () => {
        const material = createClass4Material('UN1944', '4.1', 'A8.14', 'MATCHES, SAFETY', 'III');
        const result = validateUnidNumber(material, 'UN1945');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('UN1944');
      });

      test('Scenario 7, Alteration 1: rejects UN2002 when UN2000 expected (celluloid scrap confusion)', () => {
        const material = createClass4Material('UN2000', '4.1', 'A8.3', 'CELLULOID', 'III');
        const result = validateUnidNumber(material, 'UN2002');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('UN2000');
      });

      test('Scenario 15, Alteration 3: rejects UN1414 when UN1415 expected (transposition)', () => {
        const material = createClass4Material('UN1415', '4.3', 'A8.3', 'LITHIUM', 'I');
        const result = validateUnidNumber(material, 'UN1414');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('UN1415');
      });

      test('Scenario 18, Alteration 1: rejects UN1309 when UN1396 expected (coated vs uncoated)', () => {
        const material = createClass4Material('UN1396', '4.3', 'A8.3', 'ALUMINIUM POWDER, UNCOATED', 'II');
        const result = validateUnidNumber(material, 'UN1309');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('UN1396');
      });

      test('rejects missing UN prefix', () => {
        const material = createClass4Material('UN1325', '4.1', 'A8.3', 'FLAMMABLE SOLID, ORGANIC, N.O.S.', 'II');
        const result = validateUnidNumber(material, '1325');
        expect(result.isValid).toBe(false);
      });

      test('rejects empty UN number', () => {
        const material = createClass4Material('UN1325', '4.1', 'A8.3', 'FLAMMABLE SOLID, ORGANIC, N.O.S.', 'II');
        const result = validateUnidNumber(material, '');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('UN1325');
      });
    });
  });

  describe('Key 12: Proper Shipping Name Validation', () => {
    describe('Positive Cases - Matching PSN', () => {
      // Division 4.1
      test('Scenario 1: UN1325 - validates N.O.S. PSN with technical name correctly', () => {
        const material = createClass4Material(
          'UN1325', '4.1', 'A8.3',
          'FLAMMABLE SOLID, ORGANIC, N.O.S. (Naphthalene)', 'II'
        );
        const result = validateProperShippingName(
          material,
          'FLAMMABLE SOLID, ORGANIC, N.O.S. (Naphthalene)'
        );
        expect(result.isValid).toBe(true);
      });

      test('Scenario 2: UN1944 - validates PSN correctly', () => {
        const material = createClass4Material(
          'UN1944', '4.1', 'A8.14',
          'MATCHES, SAFETY (book, card or strike on box)', 'III'
        );
        const result = validateProperShippingName(
          material,
          'MATCHES, SAFETY (book, card or strike on box)'
        );
        expect(result.isValid).toBe(true);
      });

      test('Scenario 3: UN1310 - validates PSN correctly', () => {
        const material = createClass4Material(
          'UN1310', '4.1', 'A8.3',
          'AMMONIUM PICRATE, WETTED with not less than 10% water, by mass', 'I'
        );
        const result = validateProperShippingName(
          material,
          'AMMONIUM PICRATE, WETTED with not less than 10% water, by mass'
        );
        expect(result.isValid).toBe(true);
      });

      test('Scenario 4: UN1571 - validates PSN correctly', () => {
        const material = createClass4Material(
          'UN1571', '4.1', 'A8.10',
          'BARIUM AZIDE, WETTED with not less than 50% water, by mass', 'I', '6.1'
        );
        const result = validateProperShippingName(
          material,
          'BARIUM AZIDE, WETTED with not less than 50% water, by mass'
        );
        expect(result.isValid).toBe(true);
      });

      test('Scenario 5: UN2304 - validates PSN correctly', () => {
        const material = createClass4Material('UN2304', '4.1', 'A8.2', 'NAPHTHALENE, MOLTEN', 'III');
        const result = validateProperShippingName(material, 'NAPHTHALENE, MOLTEN');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 6: UN3221 - validates PSN correctly', () => {
        const material = createClass4Material('UN3221', '4.1', 'A8.4', 'SELF-REACTIVE LIQUID TYPE B', '');
        const result = validateProperShippingName(material, 'SELF-REACTIVE LIQUID TYPE B');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 7: UN2000 - validates PSN correctly', () => {
        const material = createClass4Material(
          'UN2000', '4.1', 'A8.3',
          'CELLULOID in blocks, rods, rolls, sheets, tubes, etc., except scrap', 'III'
        );
        const result = validateProperShippingName(
          material,
          'CELLULOID in blocks, rods, rolls, sheets, tubes, etc., except scrap'
        );
        expect(result.isValid).toBe(true);
      });

      // Division 4.2
      test('Scenario 8: UN2845 - validates N.O.S. PSN with technical name correctly', () => {
        const material = createClass4Material(
          'UN2845', '4.2', 'A8.5',
          'PYROPHORIC LIQUID, ORGANIC, N.O.S. (Trimethylaluminum)', 'I'
        );
        const result = validateProperShippingName(
          material,
          'PYROPHORIC LIQUID, ORGANIC, N.O.S. (Trimethylaluminum)'
        );
        expect(result.isValid).toBe(true);
      });

      test('Scenario 9: UN1383 - validates N.O.S. PSN with technical name correctly', () => {
        const material = createClass4Material(
          'UN1383', '4.2', 'A8.5',
          'PYROPHORIC METAL, N.O.S. (Hafnium powder)', 'I'
        );
        const result = validateProperShippingName(
          material,
          'PYROPHORIC METAL, N.O.S. (Hafnium powder)'
        );
        expect(result.isValid).toBe(true);
      });

      test('Scenario 10: UN3088 - validates N.O.S. PSN with technical name correctly', () => {
        const material = createClass4Material(
          'UN3088', '4.2', 'A8.3',
          'SELF-HEATING SOLID, ORGANIC, N.O.S. (Activated carbon)', 'II'
        );
        const result = validateProperShippingName(
          material,
          'SELF-HEATING SOLID, ORGANIC, N.O.S. (Activated carbon)'
        );
        expect(result.isValid).toBe(true);
      });

      test('Scenario 11: UN2447 - validates PSN correctly', () => {
        const material = createClass4Material('UN2447', '4.2', 'A8.5', 'PHOSPHORUS, WHITE, MOLTEN', 'I', '6.1');
        const result = validateProperShippingName(material, 'PHOSPHORUS, WHITE, MOLTEN');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 12: UN1373 - validates PSN correctly', () => {
        const material = createClass4Material(
          'UN1373', '4.2', 'A8.3',
          'FIBERS or FABRICS, ANIMAL or VEGETABLE with oil, N.O.S.', 'III'
        );
        const result = validateProperShippingName(
          material,
          'FIBERS or FABRICS, ANIMAL or VEGETABLE with oil, N.O.S.'
        );
        expect(result.isValid).toBe(true);
      });

      test('Scenario 13: UN3206 - validates N.O.S. PSN with technical name correctly', () => {
        const material = createClass4Material(
          'UN3206', '4.2', 'A8.3',
          'ALKALI METAL ALCOHOLATES, SELF-HEATING, CORROSIVE, N.O.S. (Sodium methoxide)', 'II', '8'
        );
        const result = validateProperShippingName(
          material,
          'ALKALI METAL ALCOHOLATES, SELF-HEATING, CORROSIVE, N.O.S. (Sodium methoxide)'
        );
        expect(result.isValid).toBe(true);
      });

      // Division 4.3
      test('Scenario 14: UN1428 - validates simple PSN correctly', () => {
        const material = createClass4Material('UN1428', '4.3', 'A8.3', 'SODIUM', 'I');
        const result = validateProperShippingName(material, 'SODIUM');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 15: UN1415 - validates simple PSN correctly', () => {
        const material = createClass4Material('UN1415', '4.3', 'A8.3', 'LITHIUM', 'I');
        const result = validateProperShippingName(material, 'LITHIUM');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 16: UN1402 - validates simple PSN correctly', () => {
        const material = createClass4Material('UN1402', '4.3', 'A8.3', 'CALCIUM CARBIDE', 'II');
        const result = validateProperShippingName(material, 'CALCIUM CARBIDE');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 17: UN2813 - validates N.O.S. PSN with technical name correctly', () => {
        const material = createClass4Material(
          'UN2813', '4.3', 'A8.3',
          'WATER-REACTIVE SOLID, N.O.S. (Calcium silicide)', 'II'
        );
        const result = validateProperShippingName(
          material,
          'WATER-REACTIVE SOLID, N.O.S. (Calcium silicide)'
        );
        expect(result.isValid).toBe(true);
      });

      test('Scenario 18: UN1396 - validates PSN correctly', () => {
        const material = createClass4Material('UN1396', '4.3', 'A8.3', 'ALUMINIUM POWDER, UNCOATED', 'II');
        const result = validateProperShippingName(material, 'ALUMINIUM POWDER, UNCOATED');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 19: UN1400 - validates simple PSN correctly', () => {
        const material = createClass4Material('UN1400', '4.3', 'A8.3', 'BARIUM', 'II');
        const result = validateProperShippingName(material, 'BARIUM');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 20: UN3148 - validates N.O.S. PSN with technical name correctly', () => {
        const material = createClass4Material(
          'UN3148', '4.3', 'A8.2',
          'WATER-REACTIVE LIQUID, N.O.S. (Diethylzinc solution)', 'I'
        );
        const result = validateProperShippingName(
          material,
          'WATER-REACTIVE LIQUID, N.O.S. (Diethylzinc solution)'
        );
        expect(result.isValid).toBe(true);
      });

      test('handles case insensitivity', () => {
        const material = createClass4Material('UN1428', '4.3', 'A8.3', 'SODIUM', 'I');
        const result = validateProperShippingName(material, 'Sodium');
        expect(result.isValid).toBe(true);
      });
    });

    describe('Negative Cases - From Alterations (Missing Technical Names)', () => {
      test('Scenario 1, Alteration 1: rejects N.O.S. without technical name', () => {
        const material = createClass4Material(
          'UN1325', '4.1', 'A8.3',
          'FLAMMABLE SOLID, ORGANIC, N.O.S. (Naphthalene)', 'II'
        );
        const result = validateProperShippingName(
          material,
          'FLAMMABLE SOLID, ORGANIC, N.O.S.'
        );
        expect(result.isValid).toBe(false);
      });

      test('Scenario 8, Alteration 1: rejects N.O.S. without technical name', () => {
        const material = createClass4Material(
          'UN2845', '4.2', 'A8.5',
          'PYROPHORIC LIQUID, ORGANIC, N.O.S. (Trimethylaluminum)', 'I'
        );
        const result = validateProperShippingName(
          material,
          'PYROPHORIC LIQUID, ORGANIC, N.O.S.'
        );
        expect(result.isValid).toBe(false);
      });

      test('Scenario 10, Alteration 1: rejects N.O.S. without technical name', () => {
        const material = createClass4Material(
          'UN3088', '4.2', 'A8.3',
          'SELF-HEATING SOLID, ORGANIC, N.O.S. (Activated carbon)', 'II'
        );
        const result = validateProperShippingName(
          material,
          'SELF-HEATING SOLID, ORGANIC, N.O.S.'
        );
        expect(result.isValid).toBe(false);
      });

      test('Scenario 13, Alteration 2: rejects N.O.S. without technical name', () => {
        const material = createClass4Material(
          'UN3206', '4.2', 'A8.3',
          'ALKALI METAL ALCOHOLATES, SELF-HEATING, CORROSIVE, N.O.S. (Sodium methoxide)', 'II', '8'
        );
        const result = validateProperShippingName(
          material,
          'ALKALI METAL ALCOHOLATES, SELF-HEATING, CORROSIVE, N.O.S.'
        );
        expect(result.isValid).toBe(false);
      });

      test('Scenario 17, Alteration 1: rejects N.O.S. without technical name', () => {
        const material = createClass4Material(
          'UN2813', '4.3', 'A8.3',
          'WATER-REACTIVE SOLID, N.O.S. (Calcium silicide)', 'II'
        );
        const result = validateProperShippingName(
          material,
          'WATER-REACTIVE SOLID, N.O.S.'
        );
        expect(result.isValid).toBe(false);
      });

      test('Scenario 20, Alteration 1: rejects N.O.S. without technical name', () => {
        const material = createClass4Material(
          'UN3148', '4.3', 'A8.2',
          'WATER-REACTIVE LIQUID, N.O.S. (Diethylzinc solution)', 'I'
        );
        const result = validateProperShippingName(
          material,
          'WATER-REACTIVE LIQUID, N.O.S.'
        );
        expect(result.isValid).toBe(false);
      });
    });

    describe('Negative Cases - From Alterations (Incomplete/Abbreviated PSN)', () => {
      test('Scenario 5, Alteration 3: rejects PSN missing "MOLTEN" qualifier', () => {
        const material = createClass4Material('UN2304', '4.1', 'A8.2', 'NAPHTHALENE, MOLTEN', 'III');
        const result = validateProperShippingName(material, 'NAPHTHALENE');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('NAPHTHALENE, MOLTEN');
      });

      test('Scenario 7, Alteration 3: rejects PSN mismatch (different material)', () => {
        const material = createClass4Material(
          'UN2000', '4.1', 'A8.3',
          'CELLULOID in blocks, rods, rolls, sheets, tubes, etc., except scrap', 'III'
        );
        const result = validateProperShippingName(material, 'CELLULOID SCRAP');
        expect(result.isValid).toBe(false);
      });

      test('Scenario 12, Alteration 2: rejects abbreviated PSN', () => {
        const material = createClass4Material(
          'UN1373', '4.2', 'A8.3',
          'FIBERS or FABRICS, ANIMAL or VEGETABLE with oil, N.O.S.', 'III'
        );
        const result = validateProperShippingName(material, 'FIBERS WITH OIL');
        expect(result.isValid).toBe(false);
      });
    });
  });

  describe('Key 13: Hazard Class Validation', () => {
    describe('Positive Cases - Valid Hazard Classes', () => {
      // Division 4.1 - Flammable Solids (7 scenarios)
      test('Scenario 1: UN1325 - validates 4.1 correctly (FLAMMABLE SOLID, ORGANIC, N.O.S.)', () => {
        const material = createClass4Material('UN1325', '4.1', 'A8.3', 'FLAMMABLE SOLID, ORGANIC, N.O.S.', 'II');
        const result = validateHazardClass(material, '4.1');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 2: UN1944 - validates 4.1 correctly (MATCHES, SAFETY)', () => {
        const material = createClass4Material('UN1944', '4.1', 'A8.14', 'MATCHES, SAFETY', 'III');
        const result = validateHazardClass(material, '4.1');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 3: UN1310 - validates 4.1 correctly (AMMONIUM PICRATE, WETTED)', () => {
        const material = createClass4Material('UN1310', '4.1', 'A8.3', 'AMMONIUM PICRATE, WETTED', 'I');
        const result = validateHazardClass(material, '4.1');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 4: UN1571 - validates 4.1 correctly (BARIUM AZIDE, WETTED with subsidiary 6.1)', () => {
        const material = createClass4Material('UN1571', '4.1', 'A8.10', 'BARIUM AZIDE, WETTED', 'I', '6.1');
        const result = validateHazardClass(material, '4.1');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 5: UN2304 - validates 4.1 correctly (NAPHTHALENE, MOLTEN)', () => {
        const material = createClass4Material('UN2304', '4.1', 'A8.2', 'NAPHTHALENE, MOLTEN', 'III');
        const result = validateHazardClass(material, '4.1');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 6: UN3221 - validates 4.1 correctly (SELF-REACTIVE LIQUID TYPE B - no PG)', () => {
        const material = createClass4Material('UN3221', '4.1', 'A8.4', 'SELF-REACTIVE LIQUID TYPE B', '');
        const result = validateHazardClass(material, '4.1');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 7: UN2000 - validates 4.1 correctly (CELLULOID)', () => {
        const material = createClass4Material('UN2000', '4.1', 'A8.3', 'CELLULOID', 'III');
        const result = validateHazardClass(material, '4.1');
        expect(result.isValid).toBe(true);
      });

      // Division 4.2 - Spontaneously Combustible (6 scenarios)
      test('Scenario 8: UN2845 - validates 4.2 correctly (PYROPHORIC LIQUID, ORGANIC, N.O.S.)', () => {
        const material = createClass4Material('UN2845', '4.2', 'A8.5', 'PYROPHORIC LIQUID, ORGANIC, N.O.S.', 'I');
        const result = validateHazardClass(material, '4.2');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 9: UN1383 - validates 4.2 correctly (PYROPHORIC METAL, N.O.S.)', () => {
        const material = createClass4Material('UN1383', '4.2', 'A8.5', 'PYROPHORIC METAL, N.O.S.', 'I');
        const result = validateHazardClass(material, '4.2');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 10: UN3088 - validates 4.2 correctly (SELF-HEATING SOLID, ORGANIC, N.O.S.)', () => {
        const material = createClass4Material('UN3088', '4.2', 'A8.3', 'SELF-HEATING SOLID, ORGANIC, N.O.S.', 'II');
        const result = validateHazardClass(material, '4.2');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 11: UN2447 - validates 4.2 correctly (PHOSPHORUS, WHITE, MOLTEN with subsidiary 6.1)', () => {
        const material = createClass4Material('UN2447', '4.2', 'A8.5', 'PHOSPHORUS, WHITE, MOLTEN', 'I', '6.1');
        const result = validateHazardClass(material, '4.2');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 12: UN1373 - validates 4.2 correctly (FIBERS/FABRICS, ANIMAL or VEGETABLE with oil)', () => {
        const material = createClass4Material('UN1373', '4.2', 'A8.3', 'FIBERS/FABRICS, ANIMAL or VEGETABLE with oil', 'III');
        const result = validateHazardClass(material, '4.2');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 13: UN3206 - validates 4.2 correctly (ALKALI METAL ALCOHOLATES, SELF-HEATING, CORROSIVE, N.O.S. with subsidiary 8)', () => {
        const material = createClass4Material('UN3206', '4.2', 'A8.3', 'ALKALI METAL ALCOHOLATES, SELF-HEATING, CORROSIVE, N.O.S.', 'II', '8');
        const result = validateHazardClass(material, '4.2');
        expect(result.isValid).toBe(true);
      });

      // Division 4.3 - Dangerous When Wet (7 scenarios)
      test('Scenario 14: UN1428 - validates 4.3 correctly (SODIUM)', () => {
        const material = createClass4Material('UN1428', '4.3', 'A8.3', 'SODIUM', 'I');
        const result = validateHazardClass(material, '4.3');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 15: UN1415 - validates 4.3 correctly (LITHIUM)', () => {
        const material = createClass4Material('UN1415', '4.3', 'A8.3', 'LITHIUM', 'I');
        const result = validateHazardClass(material, '4.3');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 16: UN1402 - validates 4.3 correctly (CALCIUM CARBIDE)', () => {
        const material = createClass4Material('UN1402', '4.3', 'A8.3', 'CALCIUM CARBIDE', 'II');
        const result = validateHazardClass(material, '4.3');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 17: UN2813 - validates 4.3 correctly (WATER-REACTIVE SOLID, N.O.S.)', () => {
        const material = createClass4Material('UN2813', '4.3', 'A8.3', 'WATER-REACTIVE SOLID, N.O.S.', 'II');
        const result = validateHazardClass(material, '4.3');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 18: UN1396 - validates 4.3 correctly (ALUMINIUM POWDER, UNCOATED)', () => {
        const material = createClass4Material('UN1396', '4.3', 'A8.3', 'ALUMINIUM POWDER, UNCOATED', 'II');
        const result = validateHazardClass(material, '4.3');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 19: UN1400 - validates 4.3 correctly (BARIUM)', () => {
        const material = createClass4Material('UN1400', '4.3', 'A8.3', 'BARIUM', 'II');
        const result = validateHazardClass(material, '4.3');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 20: UN3148 - validates 4.3 correctly (WATER-REACTIVE LIQUID, N.O.S.)', () => {
        const material = createClass4Material('UN3148', '4.3', 'A8.2', 'WATER-REACTIVE LIQUID, N.O.S.', 'I');
        const result = validateHazardClass(material, '4.3');
        expect(result.isValid).toBe(true);
      });
    });

    describe('Negative Cases - From Alterations', () => {
      // Invalid division (4.4 does not exist)
      test('Scenario 1, Alteration: rejects 4.4 (invalid division)', () => {
        const material = createClass4Material('UN1325', '4.1', 'A8.3', 'FLAMMABLE SOLID, ORGANIC, N.O.S.', 'II');
        const result = validateHazardClass(material, '4.4');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('4.1');
      });

      // Division mismatch: 4.1 vs 4.2
      test('Scenario 2, Alteration: rejects 4.2 when 4.1 expected', () => {
        const material = createClass4Material('UN1944', '4.1', 'A8.14', 'MATCHES, SAFETY', 'III');
        const result = validateHazardClass(material, '4.2');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('4.1');
      });

      // Division mismatch: 4.1 vs 4.3
      test('Scenario 3, Alteration: rejects 4.3 when 4.1 expected', () => {
        const material = createClass4Material('UN1310', '4.1', 'A8.3', 'AMMONIUM PICRATE, WETTED', 'I');
        const result = validateHazardClass(material, '4.3');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('4.1');
      });

      // Division mismatch: 4.2 vs 4.1
      test('Scenario 8, Alteration: rejects 4.1 when 4.2 expected', () => {
        const material = createClass4Material('UN2845', '4.2', 'A8.5', 'PYROPHORIC LIQUID, ORGANIC, N.O.S.', 'I');
        const result = validateHazardClass(material, '4.1');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('4.2');
      });

      // Division mismatch: 4.2 vs 4.3
      test('Scenario 10, Alteration: rejects 4.3 when 4.2 expected', () => {
        const material = createClass4Material('UN3088', '4.2', 'A8.3', 'SELF-HEATING SOLID, ORGANIC, N.O.S.', 'II');
        const result = validateHazardClass(material, '4.3');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('4.2');
      });

      // Division mismatch: 4.3 vs 4.1
      test('Scenario 14, Alteration: rejects 4.1 when 4.3 expected', () => {
        const material = createClass4Material('UN1428', '4.3', 'A8.3', 'SODIUM', 'I');
        const result = validateHazardClass(material, '4.1');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('4.3');
      });

      // Division mismatch: 4.3 vs 4.2
      test('Scenario 15, Alteration: rejects 4.2 when 4.3 expected', () => {
        const material = createClass4Material('UN1415', '4.3', 'A8.3', 'LITHIUM', 'I');
        const result = validateHazardClass(material, '4.2');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('4.3');
      });

      // Just "4" without division
      test('Scenario 16, Alteration: rejects just "4" without division', () => {
        const material = createClass4Material('UN1402', '4.3', 'A8.3', 'CALCIUM CARBIDE', 'II');
        const result = validateHazardClass(material, '4');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('4.3');
      });

      // Empty class
      test('Scenario 17, Alteration: rejects empty hazard class', () => {
        const material = createClass4Material('UN2813', '4.3', 'A8.3', 'WATER-REACTIVE SOLID, N.O.S.', 'II');
        const result = validateHazardClass(material, '');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('4.3');
      });

      // Wrong class entirely (Class 3 vs 4.1)
      test('Scenario 5, Alteration: rejects Class 3 when 4.1 expected', () => {
        const material = createClass4Material('UN2304', '4.1', 'A8.2', 'NAPHTHALENE, MOLTEN', 'III');
        const result = validateHazardClass(material, '3');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('4.1');
      });
    });
  });

  describe('Key 15: Packing Group Validation', () => {
    describe('Positive Cases - Valid Packing Groups', () => {
      // Division 4.1
      test('Scenario 1: UN1325 - validates PG II correctly', () => {
        const material = createClass4Material('UN1325', '4.1', 'A8.3', 'FLAMMABLE SOLID, ORGANIC, N.O.S.', 'II');
        const result = validatePackingGroup(material, 'II');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 2: UN1944 - validates PG III correctly', () => {
        const material = createClass4Material('UN1944', '4.1', 'A8.14', 'MATCHES, SAFETY', 'III');
        const result = validatePackingGroup(material, 'III');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 3: UN1310 - validates PG I correctly', () => {
        const material = createClass4Material('UN1310', '4.1', 'A8.3', 'AMMONIUM PICRATE, WETTED', 'I');
        const result = validatePackingGroup(material, 'I');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 4: UN1571 - validates PG I correctly', () => {
        const material = createClass4Material('UN1571', '4.1', 'A8.10', 'BARIUM AZIDE, WETTED', 'I', '6.1');
        const result = validatePackingGroup(material, 'I');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 5: UN2304 - validates PG III correctly', () => {
        const material = createClass4Material('UN2304', '4.1', 'A8.2', 'NAPHTHALENE, MOLTEN', 'III');
        const result = validatePackingGroup(material, 'III');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 6: UN3221 - validates empty PG correctly (self-reactive)', () => {
        const material = createClass4Material('UN3221', '4.1', 'A8.4', 'SELF-REACTIVE LIQUID TYPE B', '');
        const result = validatePackingGroup(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 7: UN2000 - validates PG III correctly', () => {
        const material = createClass4Material('UN2000', '4.1', 'A8.3', 'CELLULOID', 'III');
        const result = validatePackingGroup(material, 'III');
        expect(result.isValid).toBe(true);
      });

      // Division 4.2
      test('Scenario 8: UN2845 - validates PG I correctly', () => {
        const material = createClass4Material('UN2845', '4.2', 'A8.5', 'PYROPHORIC LIQUID, ORGANIC, N.O.S.', 'I');
        const result = validatePackingGroup(material, 'I');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 9: UN1383 - validates PG I correctly', () => {
        const material = createClass4Material('UN1383', '4.2', 'A8.5', 'PYROPHORIC METAL, N.O.S.', 'I');
        const result = validatePackingGroup(material, 'I');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 10: UN3088 - validates PG II correctly', () => {
        const material = createClass4Material('UN3088', '4.2', 'A8.3', 'SELF-HEATING SOLID, ORGANIC, N.O.S.', 'II');
        const result = validatePackingGroup(material, 'II');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 11: UN2447 - validates PG I correctly', () => {
        const material = createClass4Material('UN2447', '4.2', 'A8.5', 'PHOSPHORUS, WHITE, MOLTEN', 'I', '6.1');
        const result = validatePackingGroup(material, 'I');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 12: UN1373 - validates PG III correctly', () => {
        const material = createClass4Material('UN1373', '4.2', 'A8.3', 'FIBERS/FABRICS, ANIMAL or VEGETABLE with oil', 'III');
        const result = validatePackingGroup(material, 'III');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 13: UN3206 - validates PG II correctly', () => {
        const material = createClass4Material('UN3206', '4.2', 'A8.3', 'ALKALI METAL ALCOHOLATES, SELF-HEATING, CORROSIVE, N.O.S.', 'II', '8');
        const result = validatePackingGroup(material, 'II');
        expect(result.isValid).toBe(true);
      });

      // Division 4.3
      test('Scenario 14: UN1428 - validates PG I correctly', () => {
        const material = createClass4Material('UN1428', '4.3', 'A8.3', 'SODIUM', 'I');
        const result = validatePackingGroup(material, 'I');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 15: UN1415 - validates PG I correctly', () => {
        const material = createClass4Material('UN1415', '4.3', 'A8.3', 'LITHIUM', 'I');
        const result = validatePackingGroup(material, 'I');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 16: UN1402 - validates PG II correctly', () => {
        const material = createClass4Material('UN1402', '4.3', 'A8.3', 'CALCIUM CARBIDE', 'II');
        const result = validatePackingGroup(material, 'II');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 17: UN2813 - validates PG II correctly', () => {
        const material = createClass4Material('UN2813', '4.3', 'A8.3', 'WATER-REACTIVE SOLID, N.O.S.', 'II');
        const result = validatePackingGroup(material, 'II');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 18: UN1396 - validates PG II correctly', () => {
        const material = createClass4Material('UN1396', '4.3', 'A8.3', 'ALUMINIUM POWDER, UNCOATED', 'II');
        const result = validatePackingGroup(material, 'II');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 19: UN1400 - validates PG II correctly', () => {
        const material = createClass4Material('UN1400', '4.3', 'A8.3', 'BARIUM', 'II');
        const result = validatePackingGroup(material, 'II');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 20: UN3148 - validates PG I correctly', () => {
        const material = createClass4Material('UN3148', '4.3', 'A8.2', 'WATER-REACTIVE LIQUID, N.O.S.', 'I');
        const result = validatePackingGroup(material, 'I');
        expect(result.isValid).toBe(true);
      });
    });

    describe('Negative Cases - From Alterations', () => {
      // Wrong packing group
      test('Scenario 1, Alteration: rejects PG I when PG II expected', () => {
        const material = createClass4Material('UN1325', '4.1', 'A8.3', 'FLAMMABLE SOLID, ORGANIC, N.O.S.', 'II');
        const result = validatePackingGroup(material, 'I');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('II');
      });

      test('Scenario 2, Alteration: rejects PG I when PG III expected', () => {
        const material = createClass4Material('UN1944', '4.1', 'A8.14', 'MATCHES, SAFETY', 'III');
        const result = validatePackingGroup(material, 'I');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('III');
      });

      test('Scenario 3, Alteration: rejects PG II when PG I expected', () => {
        const material = createClass4Material('UN1310', '4.1', 'A8.3', 'AMMONIUM PICRATE, WETTED', 'I');
        const result = validatePackingGroup(material, 'II');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('I');
      });

      test('Scenario 4, Alteration: rejects PG III when PG I expected', () => {
        const material = createClass4Material('UN1571', '4.1', 'A8.10', 'BARIUM AZIDE, WETTED', 'I', '6.1');
        const result = validatePackingGroup(material, 'III');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('I');
      });

      // Empty when PG required
      test('Scenario 5, Alteration: rejects empty PG when PG III expected', () => {
        const material = createClass4Material('UN2304', '4.1', 'A8.2', 'NAPHTHALENE, MOLTEN', 'III');
        const result = validatePackingGroup(material, '');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('III');
      });

      // PG provided when none expected (self-reactive)
      test('Scenario 6, Alteration: rejects PG II when no PG expected (self-reactive)', () => {
        const material = createClass4Material('UN3221', '4.1', 'A8.4', 'SELF-REACTIVE LIQUID TYPE B', '');
        const result = validatePackingGroup(material, 'II');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('None');
      });

      test('Scenario 7, Alteration: rejects PG II when PG III expected', () => {
        const material = createClass4Material('UN2000', '4.1', 'A8.3', 'CELLULOID', 'III');
        const result = validatePackingGroup(material, 'II');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('III');
      });

      // Division 4.2 alterations
      test('Scenario 8, Alteration: rejects PG II when PG I expected', () => {
        const material = createClass4Material('UN2845', '4.2', 'A8.5', 'PYROPHORIC LIQUID, ORGANIC, N.O.S.', 'I');
        const result = validatePackingGroup(material, 'II');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('I');
      });

      test('Scenario 10, Alteration: rejects PG III when PG II expected', () => {
        const material = createClass4Material('UN3088', '4.2', 'A8.3', 'SELF-HEATING SOLID, ORGANIC, N.O.S.', 'II');
        const result = validatePackingGroup(material, 'III');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('II');
      });

      test('Scenario 12, Alteration: rejects PG I when PG III expected', () => {
        const material = createClass4Material('UN1373', '4.2', 'A8.3', 'FIBERS/FABRICS, ANIMAL or VEGETABLE with oil', 'III');
        const result = validatePackingGroup(material, 'I');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('III');
      });

      // Division 4.3 alterations
      test('Scenario 14, Alteration: rejects empty when PG I expected', () => {
        const material = createClass4Material('UN1428', '4.3', 'A8.3', 'SODIUM', 'I');
        const result = validatePackingGroup(material, '');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('I');
      });

      test('Scenario 16, Alteration: rejects PG I when PG II expected', () => {
        const material = createClass4Material('UN1402', '4.3', 'A8.3', 'CALCIUM CARBIDE', 'II');
        const result = validatePackingGroup(material, 'I');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('II');
      });

      test('Scenario 20, Alteration: rejects PG III when PG I expected', () => {
        const material = createClass4Material('UN3148', '4.3', 'A8.2', 'WATER-REACTIVE LIQUID, N.O.S.', 'I');
        const result = validatePackingGroup(material, 'III');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('I');
      });
    });

    describe('Case Insensitivity', () => {
      test('handles lowercase packing group input', () => {
        const material = createClass4Material('UN1325', '4.1', 'A8.3', 'FLAMMABLE SOLID, ORGANIC, N.O.S.', 'II');
        const result = validatePackingGroup(material, 'ii');
        expect(result.isValid).toBe(true);
      });

      test('handles mixed case packing group input', () => {
        const material = createClass4Material('UN1310', '4.1', 'A8.3', 'AMMONIUM PICRATE, WETTED', 'I');
        const result = validatePackingGroup(material, 'i');
        expect(result.isValid).toBe(true);
      });
    });
  });

  describe('Key 17: Packaging Instruction Validation', () => {
    describe('Positive Cases - Valid Packaging Instructions', () => {
      // Division 4.1
      test('Scenario 1: UN1325 - validates A8.3 correctly', () => {
        const material = createClass4Material('UN1325', '4.1', 'A8.3', 'FLAMMABLE SOLID, ORGANIC, N.O.S.', 'II');
        const result = validatePackingInstruction(material, 'A8.3');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 2: UN1944 - validates A8.14 correctly', () => {
        const material = createClass4Material('UN1944', '4.1', 'A8.14', 'MATCHES, SAFETY', 'III');
        const result = validatePackingInstruction(material, 'A8.14');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 3: UN1310 - validates A8.3 correctly', () => {
        const material = createClass4Material('UN1310', '4.1', 'A8.3', 'AMMONIUM PICRATE, WETTED', 'I');
        const result = validatePackingInstruction(material, 'A8.3');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 4: UN1571 - validates A8.10 correctly', () => {
        const material = createClass4Material('UN1571', '4.1', 'A8.10', 'BARIUM AZIDE, WETTED', 'I', '6.1');
        const result = validatePackingInstruction(material, 'A8.10');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 5: UN2304 - validates A8.2 correctly', () => {
        const material = createClass4Material('UN2304', '4.1', 'A8.2', 'NAPHTHALENE, MOLTEN', 'III');
        const result = validatePackingInstruction(material, 'A8.2');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 6: UN3221 - validates A8.4 correctly', () => {
        const material = createClass4Material('UN3221', '4.1', 'A8.4', 'SELF-REACTIVE LIQUID TYPE B', '');
        const result = validatePackingInstruction(material, 'A8.4');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 7: UN2000 - validates A8.3 correctly', () => {
        const material = createClass4Material('UN2000', '4.1', 'A8.3', 'CELLULOID', 'III');
        const result = validatePackingInstruction(material, 'A8.3');
        expect(result.isValid).toBe(true);
      });

      // Division 4.2
      test('Scenario 8: UN2845 - validates A8.5 correctly', () => {
        const material = createClass4Material('UN2845', '4.2', 'A8.5', 'PYROPHORIC LIQUID, ORGANIC, N.O.S.', 'I');
        const result = validatePackingInstruction(material, 'A8.5');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 9: UN1383 - validates A8.5 correctly', () => {
        const material = createClass4Material('UN1383', '4.2', 'A8.5', 'PYROPHORIC METAL, N.O.S.', 'I');
        const result = validatePackingInstruction(material, 'A8.5');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 10: UN3088 - validates A8.3 correctly', () => {
        const material = createClass4Material('UN3088', '4.2', 'A8.3', 'SELF-HEATING SOLID, ORGANIC, N.O.S.', 'II');
        const result = validatePackingInstruction(material, 'A8.3');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 11: UN2447 - validates A8.5 correctly', () => {
        const material = createClass4Material('UN2447', '4.2', 'A8.5', 'PHOSPHORUS, WHITE, MOLTEN', 'I', '6.1');
        const result = validatePackingInstruction(material, 'A8.5');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 12: UN1373 - validates A8.3 correctly', () => {
        const material = createClass4Material('UN1373', '4.2', 'A8.3', 'FIBERS/FABRICS, ANIMAL or VEGETABLE with oil', 'III');
        const result = validatePackingInstruction(material, 'A8.3');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 13: UN3206 - validates A8.3 correctly', () => {
        const material = createClass4Material('UN3206', '4.2', 'A8.3', 'ALKALI METAL ALCOHOLATES, SELF-HEATING, CORROSIVE, N.O.S.', 'II', '8');
        const result = validatePackingInstruction(material, 'A8.3');
        expect(result.isValid).toBe(true);
      });

      // Division 4.3
      test('Scenario 14: UN1428 - validates A8.3 correctly', () => {
        const material = createClass4Material('UN1428', '4.3', 'A8.3', 'SODIUM', 'I');
        const result = validatePackingInstruction(material, 'A8.3');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 15: UN1415 - validates A8.3 correctly', () => {
        const material = createClass4Material('UN1415', '4.3', 'A8.3', 'LITHIUM', 'I');
        const result = validatePackingInstruction(material, 'A8.3');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 16: UN1402 - validates A8.3 correctly', () => {
        const material = createClass4Material('UN1402', '4.3', 'A8.3', 'CALCIUM CARBIDE', 'II');
        const result = validatePackingInstruction(material, 'A8.3');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 17: UN2813 - validates A8.3 correctly', () => {
        const material = createClass4Material('UN2813', '4.3', 'A8.3', 'WATER-REACTIVE SOLID, N.O.S.', 'II');
        const result = validatePackingInstruction(material, 'A8.3');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 18: UN1396 - validates A8.3 correctly', () => {
        const material = createClass4Material('UN1396', '4.3', 'A8.3', 'ALUMINIUM POWDER, UNCOATED', 'II');
        const result = validatePackingInstruction(material, 'A8.3');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 19: UN1400 - validates A8.3 correctly', () => {
        const material = createClass4Material('UN1400', '4.3', 'A8.3', 'BARIUM', 'II');
        const result = validatePackingInstruction(material, 'A8.3');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 20: UN3148 - validates A8.2 correctly', () => {
        const material = createClass4Material('UN3148', '4.3', 'A8.2', 'WATER-REACTIVE LIQUID, N.O.S.', 'I');
        const result = validatePackingInstruction(material, 'A8.2');
        expect(result.isValid).toBe(true);
      });
    });

    describe('Negative Cases - From Alterations', () => {
      // Wrong A8.xx paragraph
      test('Scenario 1, Alteration: rejects A8.2 when A8.3 expected', () => {
        const material = createClass4Material('UN1325', '4.1', 'A8.3', 'FLAMMABLE SOLID, ORGANIC, N.O.S.', 'II');
        const result = validatePackingInstruction(material, 'A8.2');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('A8.3');
      });

      test('Scenario 2, Alteration: rejects A8.1 when A8.14 expected', () => {
        const material = createClass4Material('UN1944', '4.1', 'A8.14', 'MATCHES, SAFETY', 'III');
        const result = validatePackingInstruction(material, 'A8.1');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('A8.14');
      });

      test('Scenario 4, Alteration: rejects A8.3 when A8.10 expected', () => {
        const material = createClass4Material('UN1571', '4.1', 'A8.10', 'BARIUM AZIDE, WETTED', 'I', '6.1');
        const result = validatePackingInstruction(material, 'A8.3');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('A8.10');
      });

      test('Scenario 5, Alteration: rejects A8.3 when A8.2 expected', () => {
        const material = createClass4Material('UN2304', '4.1', 'A8.2', 'NAPHTHALENE, MOLTEN', 'III');
        const result = validatePackingInstruction(material, 'A8.3');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('A8.2');
      });

      test('Scenario 6, Alteration: rejects A8.3 when A8.4 expected', () => {
        const material = createClass4Material('UN3221', '4.1', 'A8.4', 'SELF-REACTIVE LIQUID TYPE B', '');
        const result = validatePackingInstruction(material, 'A8.3');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('A8.4');
      });

      // Wrong appendix entirely (A5.xx instead of A8.xx)
      test('Scenario 8, Alteration: rejects A5.5 when A8.5 expected', () => {
        const material = createClass4Material('UN2845', '4.2', 'A8.5', 'PYROPHORIC LIQUID, ORGANIC, N.O.S.', 'I');
        const result = validatePackingInstruction(material, 'A5.5');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('A8.5');
      });

      test('Scenario 10, Alteration: rejects A8.5 when A8.3 expected', () => {
        const material = createClass4Material('UN3088', '4.2', 'A8.3', 'SELF-HEATING SOLID, ORGANIC, N.O.S.', 'II');
        const result = validatePackingInstruction(material, 'A8.5');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('A8.3');
      });

      test('Scenario 14, Alteration: rejects A8.5 when A8.3 expected', () => {
        const material = createClass4Material('UN1428', '4.3', 'A8.3', 'SODIUM', 'I');
        const result = validatePackingInstruction(material, 'A8.5');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('A8.3');
      });

      test('Scenario 20, Alteration: rejects A8.3 when A8.2 expected', () => {
        const material = createClass4Material('UN3148', '4.3', 'A8.2', 'WATER-REACTIVE LIQUID, N.O.S.', 'I');
        const result = validatePackingInstruction(material, 'A8.3');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('A8.2');
      });

      // Empty packaging instruction
      test('Scenario 15, Alteration: rejects empty when A8.3 expected', () => {
        const material = createClass4Material('UN1415', '4.3', 'A8.3', 'LITHIUM', 'I');
        const result = validatePackingInstruction(material, '');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('A8.3');
      });

      // Typo - missing digit
      test('Scenario 2, Alteration: rejects A8.4 (typo) when A8.14 expected', () => {
        const material = createClass4Material('UN1944', '4.1', 'A8.14', 'MATCHES, SAFETY', 'III');
        const result = validatePackingInstruction(material, 'A8.4');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('A8.14');
      });
    });

    describe('Normalization', () => {
      test('handles trailing period in paragraph reference', () => {
        const material = createClass4Material('UN1325', '4.1', 'A8.3.', 'FLAMMABLE SOLID, ORGANIC, N.O.S.', 'II');
        const result = validatePackingInstruction(material, 'A8.3');
        expect(result.isValid).toBe(true);
      });

      test('handles case variations', () => {
        const material = createClass4Material('UN1325', '4.1', 'A8.3', 'FLAMMABLE SOLID, ORGANIC, N.O.S.', 'II');
        const result = validatePackingInstruction(material, 'a8.3');
        expect(result.isValid).toBe(true);
      });
    });
  });

  describe('Key 14: Subsidiary Risk Validation', () => {
    describe('Positive Cases - No Subsidiary Risk', () => {
      test('Scenario 1: UN1325 - validates empty subsidiary risk correctly', () => {
        const material = createClass4Material('UN1325', '4.1', 'A8.3', 'FLAMMABLE SOLID, ORGANIC, N.O.S.', 'II');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 2: UN1944 - validates empty subsidiary risk correctly', () => {
        const material = createClass4Material('UN1944', '4.1', 'A8.14', 'MATCHES, SAFETY', 'III');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 3: UN1310 - validates empty subsidiary risk correctly', () => {
        const material = createClass4Material('UN1310', '4.1', 'A8.3', 'AMMONIUM PICRATE, WETTED', 'I');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 5: UN2304 - validates empty subsidiary risk correctly', () => {
        const material = createClass4Material('UN2304', '4.1', 'A8.2', 'NAPHTHALENE, MOLTEN', 'III');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 6: UN3221 - validates empty subsidiary risk correctly', () => {
        const material = createClass4Material('UN3221', '4.1', 'A8.4', 'SELF-REACTIVE LIQUID TYPE B', '');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 7: UN2000 - validates empty subsidiary risk correctly', () => {
        const material = createClass4Material('UN2000', '4.1', 'A8.3', 'CELLULOID', 'III');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 8: UN2845 - validates empty subsidiary risk correctly', () => {
        const material = createClass4Material('UN2845', '4.2', 'A8.5', 'PYROPHORIC LIQUID, ORGANIC, N.O.S.', 'I');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 9: UN1383 - validates empty subsidiary risk correctly', () => {
        const material = createClass4Material('UN1383', '4.2', 'A8.5', 'PYROPHORIC METAL, N.O.S.', 'I');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 10: UN3088 - validates empty subsidiary risk correctly', () => {
        const material = createClass4Material('UN3088', '4.2', 'A8.3', 'SELF-HEATING SOLID, ORGANIC, N.O.S.', 'II');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 12: UN1373 - validates empty subsidiary risk correctly', () => {
        const material = createClass4Material('UN1373', '4.2', 'A8.3', 'FIBERS/FABRICS, ANIMAL or VEGETABLE with oil', 'III');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 14: UN1428 - validates empty subsidiary risk correctly', () => {
        const material = createClass4Material('UN1428', '4.3', 'A8.3', 'SODIUM', 'I');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 15: UN1415 - validates empty subsidiary risk correctly', () => {
        const material = createClass4Material('UN1415', '4.3', 'A8.3', 'LITHIUM', 'I');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 16: UN1402 - validates empty subsidiary risk correctly', () => {
        const material = createClass4Material('UN1402', '4.3', 'A8.3', 'CALCIUM CARBIDE', 'II');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 17: UN2813 - validates empty subsidiary risk correctly', () => {
        const material = createClass4Material('UN2813', '4.3', 'A8.3', 'WATER-REACTIVE SOLID, N.O.S.', 'II');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 18: UN1396 - validates empty subsidiary risk correctly', () => {
        const material = createClass4Material('UN1396', '4.3', 'A8.3', 'ALUMINIUM POWDER, UNCOATED', 'II');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 19: UN1400 - validates empty subsidiary risk correctly', () => {
        const material = createClass4Material('UN1400', '4.3', 'A8.3', 'BARIUM', 'II');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 20: UN3148 - validates empty subsidiary risk correctly', () => {
        const material = createClass4Material('UN3148', '4.3', 'A8.2', 'WATER-REACTIVE LIQUID, N.O.S.', 'I');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });
    });

    describe('Positive Cases - With Subsidiary Risk', () => {
      test('Scenario 4: UN1571 - validates subsidiary risk 6.1 correctly', () => {
        const material = createClass4Material('UN1571', '4.1', 'A8.10', 'BARIUM AZIDE, WETTED', 'I', '6.1');
        const result = validateSubsidiaryRisk(material, '6.1');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 11: UN2447 - validates subsidiary risk 6.1 correctly', () => {
        const material = createClass4Material('UN2447', '4.2', 'A8.5', 'PHOSPHORUS, WHITE, MOLTEN', 'I', '6.1');
        const result = validateSubsidiaryRisk(material, '6.1');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 13: UN3206 - validates subsidiary risk 8 correctly', () => {
        const material = createClass4Material('UN3206', '4.2', 'A8.3', 'ALKALI METAL ALCOHOLATES, SELF-HEATING, CORROSIVE, N.O.S.', 'II', '8');
        const result = validateSubsidiaryRisk(material, '8');
        expect(result.isValid).toBe(true);
      });
    });

    describe('Negative Cases - From Alterations', () => {
      // Missing subsidiary risk when required
      test('Scenario 4, Alteration: rejects empty when 6.1 expected', () => {
        const material = createClass4Material('UN1571', '4.1', 'A8.10', 'BARIUM AZIDE, WETTED', 'I', '6.1');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('6.1');
      });

      test('Scenario 11, Alteration: rejects empty when 6.1 expected', () => {
        const material = createClass4Material('UN2447', '4.2', 'A8.5', 'PHOSPHORUS, WHITE, MOLTEN', 'I', '6.1');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('6.1');
      });

      test('Scenario 13, Alteration: rejects empty when 8 expected', () => {
        const material = createClass4Material('UN3206', '4.2', 'A8.3', 'ALKALI METAL ALCOHOLATES, SELF-HEATING, CORROSIVE, N.O.S.', 'II', '8');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('8');
      });

      // Wrong subsidiary risk
      test('Scenario 4, Alteration: rejects 6.2 when 6.1 expected', () => {
        const material = createClass4Material('UN1571', '4.1', 'A8.10', 'BARIUM AZIDE, WETTED', 'I', '6.1');
        const result = validateSubsidiaryRisk(material, '6.2');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('6.1');
      });

      test('Scenario 11, Alteration: rejects 8 when 6.1 expected', () => {
        const material = createClass4Material('UN2447', '4.2', 'A8.5', 'PHOSPHORUS, WHITE, MOLTEN', 'I', '6.1');
        const result = validateSubsidiaryRisk(material, '8');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('6.1');
      });

      test('Scenario 13, Alteration: rejects 6.1 when 8 expected', () => {
        const material = createClass4Material('UN3206', '4.2', 'A8.3', 'ALKALI METAL ALCOHOLATES, SELF-HEATING, CORROSIVE, N.O.S.', 'II', '8');
        const result = validateSubsidiaryRisk(material, '6.1');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('8');
      });

      // Providing subsidiary risk when none expected
      test('Scenario 1, Alteration: rejects 6.1 when empty expected', () => {
        const material = createClass4Material('UN1325', '4.1', 'A8.3', 'FLAMMABLE SOLID, ORGANIC, N.O.S.', 'II');
        const result = validateSubsidiaryRisk(material, '6.1');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('None');
      });

      test('Scenario 8, Alteration: rejects 8 when empty expected', () => {
        const material = createClass4Material('UN2845', '4.2', 'A8.5', 'PYROPHORIC LIQUID, ORGANIC, N.O.S.', 'I');
        const result = validateSubsidiaryRisk(material, '8');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('None');
      });

      test('Scenario 14, Alteration: rejects 6.1 when empty expected', () => {
        const material = createClass4Material('UN1428', '4.3', 'A8.3', 'SODIUM', 'I');
        const result = validateSubsidiaryRisk(material, '6.1');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('None');
      });
    });
  });

  describe('Unified validateSDDGInspection() Function', () => {
    describe('Division 4.1 - Scenario 1: UN1325 - N.O.S. with Technical Name', () => {
      const material = createClass4Material(
        'UN1325', '4.1', 'A8.3',
        'FLAMMABLE SOLID, ORGANIC, N.O.S. (Naphthalene)', 'II', '', 'P5'
      );

      test('validates successful SDDG with all correct values', () => {
        const content = createSDDGContent({
          aircraftType: 'PASSENGER AND CARGO AIRCRAFT',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN1325',
          properShippingName: 'FLAMMABLE SOLID, ORGANIC, N.O.S. (Naphthalene)',
          hazardClass: '4.1',
          subsidiaryRisk: '',
          packingGroup: 'II',
          packingInstruction: 'A8.3',
        });

        const results = validateSDDGInspection(content, material);
        const failures = results.filter(r => !r.isValid);

        expect(failures).toHaveLength(0);
      });

      test('Alteration 1: identifies Key 12 missing technical name', () => {
        const content = createSDDGContent({
          aircraftType: 'PASSENGER AND CARGO AIRCRAFT',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN1325',
          properShippingName: 'FLAMMABLE SOLID, ORGANIC, N.O.S.',  // Missing technical name
          hazardClass: '4.1',
          subsidiaryRisk: '',
          packingGroup: 'II',
          packingInstruction: 'A8.3',
        });

        const results = validateSDDGInspection(content, material);
        const psnResult = results.find(r => r.key === 'properShippingName');

        expect(psnResult?.isValid).toBe(false);
      });
    });

    describe('Division 4.1 - Scenario 3: UN1310 - Wetted Explosive with CAO', () => {
      const material = createClass4Material(
        'UN1310', '4.1', 'A8.3',
        'AMMONIUM PICRATE, WETTED with not less than 10% water, by mass', 'I', '', 'P4'
      );

      test('validates successful SDDG with CAO aircraft type', () => {
        const content = createSDDGContent({
          aircraftType: 'CARGO AIRCRAFT ONLY',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN1310',
          properShippingName: 'AMMONIUM PICRATE, WETTED with not less than 10% water, by mass',
          hazardClass: '4.1',
          subsidiaryRisk: '',
          packingGroup: 'I',
          packingInstruction: 'A8.3',
        });

        const results = validateSDDGInspection(content, material);
        const failures = results.filter(r => !r.isValid);

        expect(failures).toHaveLength(0);
      });

      test('Alteration 1: identifies Key 7 showing Passenger and Cargo when P4 requires CAO', () => {
        const content = createSDDGContent({
          aircraftType: 'PASSENGER AND CARGO AIRCRAFT',  // Wrong - P4 requires CAO
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN1310',
          properShippingName: 'AMMONIUM PICRATE, WETTED with not less than 10% water, by mass',
          hazardClass: '4.1',
          subsidiaryRisk: '',
          packingGroup: 'I',
          packingInstruction: 'A8.3',
        });

        const results = validateSDDGInspection(content, material);
        const aircraftResult = results.find(r => r.key === 'aircraftType');

        expect(aircraftResult?.isValid).toBe(false);
        expect(aircraftResult?.expectedValue).toBe('CARGO AIRCRAFT ONLY');
      });
    });

    describe('Division 4.1 - Scenario 4: UN1571 - With Subsidiary Risk 6.1', () => {
      const material = createClass4Material(
        'UN1571', '4.1', 'A8.10',
        'BARIUM AZIDE, WETTED with not less than 50% water, by mass', 'I', '6.1', 'P4'
      );

      test('validates successful SDDG with subsidiary risk', () => {
        const content = createSDDGContent({
          aircraftType: 'CARGO AIRCRAFT ONLY',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN1571',
          properShippingName: 'BARIUM AZIDE, WETTED with not less than 50% water, by mass',
          hazardClass: '4.1',
          subsidiaryRisk: '6.1',
          packingGroup: 'I',
          packingInstruction: 'A8.10',
        });

        const results = validateSDDGInspection(content, material);
        const failures = results.filter(r => !r.isValid);

        expect(failures).toHaveLength(0);
      });

      test('Alteration 1: identifies Key 14 empty when 6.1 expected', () => {
        const content = createSDDGContent({
          aircraftType: 'CARGO AIRCRAFT ONLY',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN1571',
          properShippingName: 'BARIUM AZIDE, WETTED with not less than 50% water, by mass',
          hazardClass: '4.1',
          subsidiaryRisk: '',  // Missing subsidiary risk
          packingGroup: 'I',
          packingInstruction: 'A8.10',
        });

        const results = validateSDDGInspection(content, material);
        const subsidiaryResult = results.find(r => r.key === 'subsidiaryRisk');

        expect(subsidiaryResult?.isValid).toBe(false);
        expect(subsidiaryResult?.expectedValue).toBe('6.1');
      });

      test('Alteration 3: identifies Key 17 showing A8.3 instead of A8.10', () => {
        const content = createSDDGContent({
          aircraftType: 'CARGO AIRCRAFT ONLY',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN1571',
          properShippingName: 'BARIUM AZIDE, WETTED with not less than 50% water, by mass',
          hazardClass: '4.1',
          subsidiaryRisk: '6.1',
          packingGroup: 'I',
          packingInstruction: 'A8.3',  // Wrong instruction
        });

        const results = validateSDDGInspection(content, material);
        const packingResult = results.find(r => r.key === 'packingInstruction');

        expect(packingResult?.isValid).toBe(false);
        expect(packingResult?.expectedValue).toBe('A8.10');
      });
    });

    describe('Division 4.1 - Scenario 6: UN3221 - Self-Reactive (No PG)', () => {
      const material = createClass4Material(
        'UN3221', '4.1', 'A8.4',
        'SELF-REACTIVE LIQUID TYPE B', '', '', 'P4'
      );

      test('validates successful SDDG with empty packing group', () => {
        const content = createSDDGContent({
          aircraftType: 'CARGO AIRCRAFT ONLY',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN3221',
          properShippingName: 'SELF-REACTIVE LIQUID TYPE B',
          hazardClass: '4.1',
          subsidiaryRisk: '',
          packingGroup: '',  // Self-reactive has no PG
          packingInstruction: 'A8.4',
        });

        const results = validateSDDGInspection(content, material);
        const failures = results.filter(r => !r.isValid);

        expect(failures).toHaveLength(0);
      });
    });

    describe('Division 4.2 - Scenario 8: UN2845 - Pyrophoric Liquid N.O.S.', () => {
      const material = createClass4Material(
        'UN2845', '4.2', 'A8.5',
        'PYROPHORIC LIQUID, ORGANIC, N.O.S. (Trimethylaluminum)', 'I', '', 'P3'
      );

      test('validates successful SDDG with all correct values', () => {
        const content = createSDDGContent({
          aircraftType: 'CARGO AIRCRAFT ONLY',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN2845',
          properShippingName: 'PYROPHORIC LIQUID, ORGANIC, N.O.S. (Trimethylaluminum)',
          hazardClass: '4.2',
          subsidiaryRisk: '',
          packingGroup: 'I',
          packingInstruction: 'A8.5',
        });

        const results = validateSDDGInspection(content, material);
        const failures = results.filter(r => !r.isValid);

        expect(failures).toHaveLength(0);
      });

      test('Alteration 2: identifies Key 13 showing 4.1 instead of 4.2', () => {
        const content = createSDDGContent({
          aircraftType: 'CARGO AIRCRAFT ONLY',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN2845',
          properShippingName: 'PYROPHORIC LIQUID, ORGANIC, N.O.S. (Trimethylaluminum)',
          hazardClass: '4.1',  // Wrong division
          subsidiaryRisk: '',
          packingGroup: 'I',
          packingInstruction: 'A8.5',
        });

        const results = validateSDDGInspection(content, material);
        const hazardClassResult = results.find(r => r.key === 'hazardClass');

        expect(hazardClassResult?.isValid).toBe(false);
        expect(hazardClassResult?.expectedValue).toBe('4.2');
      });
    });

    describe('Division 4.2 - Scenario 11: UN2447 - With Subsidiary Risk 6.1', () => {
      const material = createClass4Material(
        'UN2447', '4.2', 'A8.5',
        'PHOSPHORUS, WHITE, MOLTEN', 'I', '6.1', 'P3'
      );

      test('validates successful SDDG with subsidiary risk', () => {
        const content = createSDDGContent({
          aircraftType: 'CARGO AIRCRAFT ONLY',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN2447',
          properShippingName: 'PHOSPHORUS, WHITE, MOLTEN',
          hazardClass: '4.2',
          subsidiaryRisk: '6.1',
          packingGroup: 'I',
          packingInstruction: 'A8.5',
        });

        const results = validateSDDGInspection(content, material);
        const failures = results.filter(r => !r.isValid);

        expect(failures).toHaveLength(0);
      });

      test('Alteration 2: identifies Key 14 empty when 6.1 expected', () => {
        const content = createSDDGContent({
          aircraftType: 'CARGO AIRCRAFT ONLY',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN2447',
          properShippingName: 'PHOSPHORUS, WHITE, MOLTEN',
          hazardClass: '4.2',
          subsidiaryRisk: '',  // Missing subsidiary risk
          packingGroup: 'I',
          packingInstruction: 'A8.5',
        });

        const results = validateSDDGInspection(content, material);
        const subsidiaryResult = results.find(r => r.key === 'subsidiaryRisk');

        expect(subsidiaryResult?.isValid).toBe(false);
        expect(subsidiaryResult?.expectedValue).toBe('6.1');
      });
    });

    describe('Division 4.2 - Scenario 13: UN3206 - With Subsidiary Risk 8', () => {
      const material = createClass4Material(
        'UN3206', '4.2', 'A8.3',
        'ALKALI METAL ALCOHOLATES, SELF-HEATING, CORROSIVE, N.O.S. (Sodium methoxide)', 'II', '8', 'P4'
      );

      test('validates successful SDDG with corrosive subsidiary risk', () => {
        const content = createSDDGContent({
          aircraftType: 'CARGO AIRCRAFT ONLY',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN3206',
          properShippingName: 'ALKALI METAL ALCOHOLATES, SELF-HEATING, CORROSIVE, N.O.S. (Sodium methoxide)',
          hazardClass: '4.2',
          subsidiaryRisk: '8',
          packingGroup: 'II',
          packingInstruction: 'A8.3',
        });

        const results = validateSDDGInspection(content, material);
        const failures = results.filter(r => !r.isValid);

        expect(failures).toHaveLength(0);
      });

      test('Alteration 3: identifies Key 14 empty when 8 expected', () => {
        const content = createSDDGContent({
          aircraftType: 'CARGO AIRCRAFT ONLY',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN3206',
          properShippingName: 'ALKALI METAL ALCOHOLATES, SELF-HEATING, CORROSIVE, N.O.S. (Sodium methoxide)',
          hazardClass: '4.2',
          subsidiaryRisk: '',  // Missing subsidiary risk
          packingGroup: 'II',
          packingInstruction: 'A8.3',
        });

        const results = validateSDDGInspection(content, material);
        const subsidiaryResult = results.find(r => r.key === 'subsidiaryRisk');

        expect(subsidiaryResult?.isValid).toBe(false);
        expect(subsidiaryResult?.expectedValue).toBe('8');
      });
    });

    describe('Division 4.3 - Scenario 14: UN1428 - Simple Sodium', () => {
      const material = createClass4Material(
        'UN1428', '4.3', 'A8.3',
        'SODIUM', 'I', '', 'P3'
      );

      test('validates successful SDDG with all correct values', () => {
        const content = createSDDGContent({
          aircraftType: 'CARGO AIRCRAFT ONLY',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN1428',
          properShippingName: 'SODIUM',
          hazardClass: '4.3',
          subsidiaryRisk: '',
          packingGroup: 'I',
          packingInstruction: 'A8.3',
        });

        const results = validateSDDGInspection(content, material);
        const failures = results.filter(r => !r.isValid);

        expect(failures).toHaveLength(0);
      });

      test('Alteration 1: identifies Key 13 showing 4.1 instead of 4.3', () => {
        const content = createSDDGContent({
          aircraftType: 'CARGO AIRCRAFT ONLY',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN1428',
          properShippingName: 'SODIUM',
          hazardClass: '4.1',  // Wrong division
          subsidiaryRisk: '',
          packingGroup: 'I',
          packingInstruction: 'A8.3',
        });

        const results = validateSDDGInspection(content, material);
        const hazardClassResult = results.find(r => r.key === 'hazardClass');

        expect(hazardClassResult?.isValid).toBe(false);
        expect(hazardClassResult?.expectedValue).toBe('4.3');
      });

      test('Alteration 2: identifies Key 7 showing Passenger and Cargo when P3 requires CAO', () => {
        const content = createSDDGContent({
          aircraftType: 'PASSENGER AND CARGO AIRCRAFT',  // Wrong - P3 requires CAO
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN1428',
          properShippingName: 'SODIUM',
          hazardClass: '4.3',
          subsidiaryRisk: '',
          packingGroup: 'I',
          packingInstruction: 'A8.3',
        });

        const results = validateSDDGInspection(content, material);
        const aircraftResult = results.find(r => r.key === 'aircraftType');

        expect(aircraftResult?.isValid).toBe(false);
        expect(aircraftResult?.expectedValue).toBe('CARGO AIRCRAFT ONLY');
      });
    });

    describe('Division 4.3 - Scenario 16: UN1402 - P5 Allows Passenger', () => {
      const material = createClass4Material(
        'UN1402', '4.3', 'A8.3',
        'CALCIUM CARBIDE', 'II', '', 'P5'
      );

      test('validates successful SDDG with Passenger and Cargo aircraft type', () => {
        const content = createSDDGContent({
          aircraftType: 'PASSENGER AND CARGO AIRCRAFT',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN1402',
          properShippingName: 'CALCIUM CARBIDE',
          hazardClass: '4.3',
          subsidiaryRisk: '',
          packingGroup: 'II',
          packingInstruction: 'A8.3',
        });

        const results = validateSDDGInspection(content, material);
        const failures = results.filter(r => !r.isValid);

        expect(failures).toHaveLength(0);
      });

      test('Alteration 2: identifies Key 15 showing I instead of II', () => {
        const content = createSDDGContent({
          aircraftType: 'PASSENGER AND CARGO AIRCRAFT',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN1402',
          properShippingName: 'CALCIUM CARBIDE',
          hazardClass: '4.3',
          subsidiaryRisk: '',
          packingGroup: 'I',  // Wrong packing group
          packingInstruction: 'A8.3',
        });

        const results = validateSDDGInspection(content, material);
        const packingGroupResult = results.find(r => r.key === 'packingGroup');

        expect(packingGroupResult?.isValid).toBe(false);
        expect(packingGroupResult?.expectedValue).toBe('II');
      });

      test('Alteration 3: identifies Key 13 showing just "4" instead of "4.3"', () => {
        const content = createSDDGContent({
          aircraftType: 'PASSENGER AND CARGO AIRCRAFT',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN1402',
          properShippingName: 'CALCIUM CARBIDE',
          hazardClass: '4',  // Missing division
          subsidiaryRisk: '',
          packingGroup: 'II',
          packingInstruction: 'A8.3',
        });

        const results = validateSDDGInspection(content, material);
        const hazardClassResult = results.find(r => r.key === 'hazardClass');

        expect(hazardClassResult?.isValid).toBe(false);
        expect(hazardClassResult?.expectedValue).toBe('4.3');
      });
    });

    describe('Division 4.3 - Scenario 20: UN3148 - Water-Reactive Liquid N.O.S.', () => {
      const material = createClass4Material(
        'UN3148', '4.3', 'A8.2',
        'WATER-REACTIVE LIQUID, N.O.S. (Diethylzinc solution)', 'I', '', 'P3'
      );

      test('validates successful SDDG with all correct values', () => {
        const content = createSDDGContent({
          aircraftType: 'CARGO AIRCRAFT ONLY',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN3148',
          properShippingName: 'WATER-REACTIVE LIQUID, N.O.S. (Diethylzinc solution)',
          hazardClass: '4.3',
          subsidiaryRisk: '',
          packingGroup: 'I',
          packingInstruction: 'A8.2',
        });

        const results = validateSDDGInspection(content, material);
        const failures = results.filter(r => !r.isValid);

        expect(failures).toHaveLength(0);
      });

      test('Alteration 1: identifies Key 12 missing technical name', () => {
        const content = createSDDGContent({
          aircraftType: 'CARGO AIRCRAFT ONLY',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN3148',
          properShippingName: 'WATER-REACTIVE LIQUID, N.O.S.',  // Missing technical name
          hazardClass: '4.3',
          subsidiaryRisk: '',
          packingGroup: 'I',
          packingInstruction: 'A8.2',
        });

        const results = validateSDDGInspection(content, material);
        const psnResult = results.find(r => r.key === 'properShippingName');

        expect(psnResult?.isValid).toBe(false);
      });

      test('Alteration 3: identifies Key 17 showing A8.3 instead of A8.2', () => {
        const content = createSDDGContent({
          aircraftType: 'CARGO AIRCRAFT ONLY',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN3148',
          properShippingName: 'WATER-REACTIVE LIQUID, N.O.S. (Diethylzinc solution)',
          hazardClass: '4.3',
          subsidiaryRisk: '',
          packingGroup: 'I',
          packingInstruction: 'A8.3',  // Wrong - liquids use A8.2
        });

        const results = validateSDDGInspection(content, material);
        const packingResult = results.find(r => r.key === 'packingInstruction');

        expect(packingResult?.isValid).toBe(false);
        expect(packingResult?.expectedValue).toBe('A8.2');
      });
    });

    describe('Multiple Errors Detection', () => {
      test('identifies multiple validation failures in single SDDG', () => {
        const material = createClass4Material(
          'UN1428', '4.3', 'A8.3',
          'SODIUM', 'I', '', 'P3'
        );

        const content = createSDDGContent({
          aircraftType: 'PASSENGER AND CARGO AIRCRAFT',  // Wrong - P3 requires CAO
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN1429',  // Wrong UN number
          properShippingName: 'SODIUM',
          hazardClass: '4.1',  // Wrong division
          subsidiaryRisk: '',
          packingGroup: 'II',  // Wrong packing group
          packingInstruction: 'A8.5',  // Wrong instruction
        });

        const results = validateSDDGInspection(content, material);
        const failures = results.filter(r => !r.isValid);

        // Should catch multiple errors
        expect(failures.length).toBeGreaterThanOrEqual(4);

        // Verify specific failures are identified
        const failedKeys = failures.map(f => f.key);
        expect(failedKeys).toContain('aircraftType');
        expect(failedKeys).toContain('unIdNo');
        expect(failedKeys).toContain('hazardClass');
        expect(failedKeys).toContain('packingGroup');
        expect(failedKeys).toContain('packingInstruction');
      });
    });

    describe('Edge Cases', () => {
      test('returns empty array when material is null', () => {
        const content = createSDDGContent({
          unIdNo: 'UN1428',
          hazardClass: '4.3',
        });

        const results = validateSDDGInspection(content, null);
        expect(results).toHaveLength(0);
      });

      test('returns empty array when content is null', () => {
        const material = createClass4Material('UN1428', '4.3', 'A8.3', 'SODIUM', 'I');
        const results = validateSDDGInspection(null, material);
        expect(results).toHaveLength(0);
      });
    });
  });
});
