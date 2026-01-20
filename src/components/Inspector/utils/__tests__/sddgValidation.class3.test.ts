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

// Helper to create minimal HazardousMaterialItem for Class 3 testing
function createClass3Material(
  unid: string,
  packingGroup: string, // 'I', 'II', 'III', or '' for articles
  packagingParagraph: string,
  properShippingName: string,
  subsidiaryRisk: string = '',
  specialProvision: string = ''
): HazardousMaterialItem {
  return {
    unid,
    hazclassDiv: '3', // Always "3" for Class 3
    packagingParagraph,
    properShippingName,
    packingGroup,
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

describe('SDDG Validation - Class 3 Flammable Liquids', () => {
  describe('Key 13: Hazard Class Validation', () => {
    describe('Positive Cases - All scenarios validate "3"', () => {
      test('Scenario 1: UN1089 ACETALDEHYDE - validates hazard class 3', () => {
        const material = createClass3Material('UN1089', 'I', 'A7.2', 'ACETALDEHYDE');
        const result = validateHazardClass(material, '3');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 2: UN1093 ACRYLONITRILE, STABILIZED - validates hazard class 3', () => {
        const material = createClass3Material('UN1093', 'I', 'A7.2', 'ACRYLONITRILE, STABILIZED', '6.1');
        const result = validateHazardClass(material, '3');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 3: UN3165 AIRCRAFT HYDRAULIC POWER UNIT FUEL TANK - validates hazard class 3', () => {
        const material = createClass3Material('UN3165', 'I', 'A7.4', 'AIRCRAFT HYDRAULIC POWER UNIT FUEL TANK', '6.1, 8');
        const result = validateHazardClass(material, '3');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 4: UN1991 CHLOROPRENE, STABILIZED - validates hazard class 3', () => {
        const material = createClass3Material('UN1991', 'I', 'A7.2', 'CHLOROPRENE, STABILIZED', '6.1');
        const result = validateHazardClass(material, '3');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 5: UN1090 ACETONE - validates hazard class 3', () => {
        const material = createClass3Material('UN1090', 'II', 'A7.2', 'ACETONE');
        const result = validateHazardClass(material, '3');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 6: UN1114 BENZENE - validates hazard class 3', () => {
        const material = createClass3Material('UN1114', 'II', 'A7.2', 'BENZENE');
        const result = validateHazardClass(material, '3');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 7: UN1987 ALCOHOLS, N.O.S. - validates hazard class 3', () => {
        const material = createClass3Material('UN1987', 'II', 'A7.2', 'ALCOHOLS, N.O.S.');
        const result = validateHazardClass(material, '3');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 8: UN3274 ALCOHOLATES SOLUTION, N.O.S. - validates hazard class 3', () => {
        const material = createClass3Material('UN3274', 'II', 'A7.2', 'ALCOHOLATES SOLUTION, N.O.S.', '8');
        const result = validateHazardClass(material, '3');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 9: UN2733 AMINES, FLAMMABLE, CORROSIVE N.O.S. - validates hazard class 3', () => {
        const material = createClass3Material('UN2733', 'II', 'A7.2', 'AMINES, FLAMMABLE, CORROSIVE N.O.S.', '8');
        const result = validateHazardClass(material, '3');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 10: UN2251 BICYCLO[2,2,1]HEPTA-2,5-DIENE, STABILIZED - validates hazard class 3', () => {
        const material = createClass3Material('UN2251', 'II', 'A7.3', 'BICYCLO[2,2,1]HEPTA-2,5-DIENE, STABILIZED');
        const result = validateHazardClass(material, '3');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 11: UN1278 1-CHLOROPROPANE - validates hazard class 3', () => {
        const material = createClass3Material('UN1278', 'II', 'A7.2', '1-CHLOROPROPANE');
        const result = validateHazardClass(material, '3');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 12: UN1139 COATING SOLUTION - validates hazard class 3', () => {
        const material = createClass3Material('UN1139', 'II', 'A7.2', 'COATING SOLUTION');
        const result = validateHazardClass(material, '3');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 13: UN2332 ACETALDEHYDE OXIME - validates hazard class 3', () => {
        const material = createClass3Material('UN2332', 'III', 'A7.2', 'ACETALDEHYDE OXIME');
        const result = validateHazardClass(material, '3');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 14: UN1986 ALCOHOLS, FLAMMABLE, TOXIC, N.O.S. - validates hazard class 3', () => {
        const material = createClass3Material('UN1986', 'III', 'A7.2', 'ALCOHOLS, FLAMMABLE, TOXIC, N.O.S.', '6.1');
        const result = validateHazardClass(material, '3');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 15: UN2607 ACROLEIN DIMER, STABILIZED - validates hazard class 3', () => {
        const material = createClass3Material('UN2607', 'III', 'A7.2', 'ACROLEIN DIMER, STABILIZED');
        const result = validateHazardClass(material, '3');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 16: UN1263 PAINT - validates hazard class 3', () => {
        const material = createClass3Material('UN1263', 'III', 'A7.2', 'PAINT');
        const result = validateHazardClass(material, '3');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 17: UN1263 PAINT RELATED MATERIAL - validates hazard class 3', () => {
        const material = createClass3Material('UN1263', 'III', 'A7.2', 'PAINT RELATED MATERIAL');
        const result = validateHazardClass(material, '3');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 18: UN2985 CHLOROSILANES, FLAMMABLE, CORROSIVE, N.O.S. - validates hazard class 3', () => {
        const material = createClass3Material('UN2985', 'II', 'A7.10', 'CHLOROSILANES, FLAMMABLE, CORROSIVE, N.O.S.', '8');
        const result = validateHazardClass(material, '3');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 19: NA1993 COMPOUNDS, CLEANING LIQUID - validates hazard class 3', () => {
        const material = createClass3Material('NA1993', 'III', 'A12.2', 'COMPOUNDS, CLEANING LIQUID');
        const result = validateHazardClass(material, '3');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 20: UN3528 ENGINE, INTERNAL COMBUSTION - validates hazard class 3', () => {
        const material = createClass3Material('UN3528', '', 'A7.11', 'ENGINE, INTERNAL COMBUSTION');
        const result = validateHazardClass(material, '3');
        expect(result.isValid).toBe(true);
      });
    });

    describe('Negative Cases - Wrong hazard class', () => {
      test('rejects "2" when "3" expected for flammable liquid', () => {
        const material = createClass3Material('UN1089', 'I', 'A7.2', 'ACETALDEHYDE');
        const result = validateHazardClass(material, '2');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('3');
      });

      test('rejects "4.1" when "3" expected', () => {
        const material = createClass3Material('UN1090', 'II', 'A7.2', 'ACETONE');
        const result = validateHazardClass(material, '4.1');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('3');
      });

      test('rejects "3.1" (invalid format) when "3" expected', () => {
        const material = createClass3Material('UN1114', 'II', 'A7.2', 'BENZENE');
        const result = validateHazardClass(material, '3.1');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('3');
      });

      test('rejects empty hazard class', () => {
        const material = createClass3Material('UN1263', 'III', 'A7.2', 'PAINT');
        const result = validateHazardClass(material, '');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('3');
      });
    });
  });

  describe('Key 15: Packing Group Validation', () => {
    describe('Positive Cases - Packing Group I', () => {
      test('Scenario 1: UN1089 ACETALDEHYDE - validates PG I', () => {
        const material = createClass3Material('UN1089', 'I', 'A7.2', 'ACETALDEHYDE');
        const result = validatePackingGroup(material, 'I');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 2: UN1093 ACRYLONITRILE, STABILIZED - validates PG I', () => {
        const material = createClass3Material('UN1093', 'I', 'A7.2', 'ACRYLONITRILE, STABILIZED', '6.1');
        const result = validatePackingGroup(material, 'I');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 3: UN3165 AIRCRAFT HYDRAULIC POWER UNIT FUEL TANK - validates PG I', () => {
        const material = createClass3Material('UN3165', 'I', 'A7.4', 'AIRCRAFT HYDRAULIC POWER UNIT FUEL TANK', '6.1, 8');
        const result = validatePackingGroup(material, 'I');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 4: UN1991 CHLOROPRENE, STABILIZED - validates PG I', () => {
        const material = createClass3Material('UN1991', 'I', 'A7.2', 'CHLOROPRENE, STABILIZED', '6.1');
        const result = validatePackingGroup(material, 'I');
        expect(result.isValid).toBe(true);
      });
    });

    describe('Positive Cases - Packing Group II', () => {
      test('Scenario 5: UN1090 ACETONE - validates PG II', () => {
        const material = createClass3Material('UN1090', 'II', 'A7.2', 'ACETONE');
        const result = validatePackingGroup(material, 'II');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 6: UN1114 BENZENE - validates PG II', () => {
        const material = createClass3Material('UN1114', 'II', 'A7.2', 'BENZENE');
        const result = validatePackingGroup(material, 'II');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 7: UN1987 ALCOHOLS, N.O.S. - validates PG II', () => {
        const material = createClass3Material('UN1987', 'II', 'A7.2', 'ALCOHOLS, N.O.S.');
        const result = validatePackingGroup(material, 'II');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 8: UN3274 ALCOHOLATES SOLUTION, N.O.S. - validates PG II', () => {
        const material = createClass3Material('UN3274', 'II', 'A7.2', 'ALCOHOLATES SOLUTION, N.O.S.', '8');
        const result = validatePackingGroup(material, 'II');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 9: UN2733 AMINES, FLAMMABLE, CORROSIVE N.O.S. - validates PG II', () => {
        const material = createClass3Material('UN2733', 'II', 'A7.2', 'AMINES, FLAMMABLE, CORROSIVE N.O.S.', '8');
        const result = validatePackingGroup(material, 'II');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 10: UN2251 BICYCLO[2,2,1]HEPTA-2,5-DIENE, STABILIZED - validates PG II', () => {
        const material = createClass3Material('UN2251', 'II', 'A7.3', 'BICYCLO[2,2,1]HEPTA-2,5-DIENE, STABILIZED');
        const result = validatePackingGroup(material, 'II');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 11: UN1278 1-CHLOROPROPANE - validates PG II', () => {
        const material = createClass3Material('UN1278', 'II', 'A7.2', '1-CHLOROPROPANE');
        const result = validatePackingGroup(material, 'II');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 12: UN1139 COATING SOLUTION - validates PG II', () => {
        const material = createClass3Material('UN1139', 'II', 'A7.2', 'COATING SOLUTION');
        const result = validatePackingGroup(material, 'II');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 18: UN2985 CHLOROSILANES, FLAMMABLE, CORROSIVE, N.O.S. - validates PG II', () => {
        const material = createClass3Material('UN2985', 'II', 'A7.10', 'CHLOROSILANES, FLAMMABLE, CORROSIVE, N.O.S.', '8');
        const result = validatePackingGroup(material, 'II');
        expect(result.isValid).toBe(true);
      });
    });

    describe('Positive Cases - Packing Group III', () => {
      test('Scenario 13: UN2332 ACETALDEHYDE OXIME - validates PG III', () => {
        const material = createClass3Material('UN2332', 'III', 'A7.2', 'ACETALDEHYDE OXIME');
        const result = validatePackingGroup(material, 'III');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 14: UN1986 ALCOHOLS, FLAMMABLE, TOXIC, N.O.S. - validates PG III', () => {
        const material = createClass3Material('UN1986', 'III', 'A7.2', 'ALCOHOLS, FLAMMABLE, TOXIC, N.O.S.', '6.1');
        const result = validatePackingGroup(material, 'III');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 15: UN2607 ACROLEIN DIMER, STABILIZED - validates PG III', () => {
        const material = createClass3Material('UN2607', 'III', 'A7.2', 'ACROLEIN DIMER, STABILIZED');
        const result = validatePackingGroup(material, 'III');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 16: UN1263 PAINT - validates PG III', () => {
        const material = createClass3Material('UN1263', 'III', 'A7.2', 'PAINT');
        const result = validatePackingGroup(material, 'III');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 17: UN1263 PAINT RELATED MATERIAL - validates PG III', () => {
        const material = createClass3Material('UN1263', 'III', 'A7.2', 'PAINT RELATED MATERIAL');
        const result = validatePackingGroup(material, 'III');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 19: NA1993 COMPOUNDS, CLEANING LIQUID - validates PG III', () => {
        const material = createClass3Material('NA1993', 'III', 'A12.2', 'COMPOUNDS, CLEANING LIQUID');
        const result = validatePackingGroup(material, 'III');
        expect(result.isValid).toBe(true);
      });
    });

    describe('Positive Cases - No Packing Group (Special Articles)', () => {
      test('Scenario 20: UN3528 ENGINE, INTERNAL COMBUSTION - validates empty PG for article', () => {
        const material = createClass3Material('UN3528', '', 'A7.11', 'ENGINE, INTERNAL COMBUSTION');
        const result = validatePackingGroup(material, '');
        expect(result.isValid).toBe(true);
      });
    });

    describe('Negative Cases - From Alterations', () => {
      test('Scenario 1, Alteration 2: rejects PG II when PG I expected', () => {
        const material = createClass3Material('UN1089', 'I', 'A7.2', 'ACETALDEHYDE');
        const result = validatePackingGroup(material, 'II');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('I');
      });

      test('Scenario 6, Alteration 1: rejects empty PG when PG II expected', () => {
        const material = createClass3Material('UN1114', 'II', 'A7.2', 'BENZENE');
        const result = validatePackingGroup(material, '');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('II');
      });

      test('Scenario 13, Alteration 1: rejects PG II when PG III expected', () => {
        const material = createClass3Material('UN2332', 'III', 'A7.2', 'ACETALDEHYDE OXIME');
        const result = validatePackingGroup(material, 'II');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('III');
      });

      test('Scenario 20, Alteration 1: rejects PG II for ENGINE (should have no PG)', () => {
        const material = createClass3Material('UN3528', '', 'A7.11', 'ENGINE, INTERNAL COMBUSTION');
        const result = validatePackingGroup(material, 'II');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('None');
      });

      test('rejects PG I when PG III expected', () => {
        const material = createClass3Material('UN1263', 'III', 'A7.2', 'PAINT');
        const result = validatePackingGroup(material, 'I');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('III');
      });

      test('rejects PG III when PG I expected', () => {
        const material = createClass3Material('UN1093', 'I', 'A7.2', 'ACRYLONITRILE, STABILIZED', '6.1');
        const result = validatePackingGroup(material, 'III');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('I');
      });

      test('rejects PG I when PG II expected', () => {
        const material = createClass3Material('UN1090', 'II', 'A7.2', 'ACETONE');
        const result = validatePackingGroup(material, 'I');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('II');
      });

      test('rejects PG III when PG II expected', () => {
        const material = createClass3Material('UN2251', 'II', 'A7.3', 'BICYCLO[2,2,1]HEPTA-2,5-DIENE, STABILIZED');
        const result = validatePackingGroup(material, 'III');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('II');
      });
    });
  });

  describe('Key 17: Packaging Instruction Validation', () => {
    describe('Positive Cases - A7.2 (Standard Class 3 Packaging)', () => {
      test('Scenario 1: UN1089 ACETALDEHYDE - validates A7.2', () => {
        const material = createClass3Material('UN1089', 'I', 'A7.2', 'ACETALDEHYDE');
        const result = validatePackingInstruction(material, 'A7.2');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 2: UN1093 ACRYLONITRILE, STABILIZED - validates A7.2', () => {
        const material = createClass3Material('UN1093', 'I', 'A7.2', 'ACRYLONITRILE, STABILIZED', '6.1');
        const result = validatePackingInstruction(material, 'A7.2');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 4: UN1991 CHLOROPRENE, STABILIZED - validates A7.2', () => {
        const material = createClass3Material('UN1991', 'I', 'A7.2', 'CHLOROPRENE, STABILIZED', '6.1');
        const result = validatePackingInstruction(material, 'A7.2');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 5: UN1090 ACETONE - validates A7.2', () => {
        const material = createClass3Material('UN1090', 'II', 'A7.2', 'ACETONE');
        const result = validatePackingInstruction(material, 'A7.2');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 6: UN1114 BENZENE - validates A7.2', () => {
        const material = createClass3Material('UN1114', 'II', 'A7.2', 'BENZENE');
        const result = validatePackingInstruction(material, 'A7.2');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 7: UN1987 ALCOHOLS, N.O.S. - validates A7.2', () => {
        const material = createClass3Material('UN1987', 'II', 'A7.2', 'ALCOHOLS, N.O.S.');
        const result = validatePackingInstruction(material, 'A7.2');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 8: UN3274 ALCOHOLATES SOLUTION, N.O.S. - validates A7.2', () => {
        const material = createClass3Material('UN3274', 'II', 'A7.2', 'ALCOHOLATES SOLUTION, N.O.S.', '8');
        const result = validatePackingInstruction(material, 'A7.2');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 9: UN2733 AMINES, FLAMMABLE, CORROSIVE N.O.S. - validates A7.2', () => {
        const material = createClass3Material('UN2733', 'II', 'A7.2', 'AMINES, FLAMMABLE, CORROSIVE N.O.S.', '8');
        const result = validatePackingInstruction(material, 'A7.2');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 11: UN1278 1-CHLOROPROPANE - validates A7.2', () => {
        const material = createClass3Material('UN1278', 'II', 'A7.2', '1-CHLOROPROPANE');
        const result = validatePackingInstruction(material, 'A7.2');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 12: UN1139 COATING SOLUTION - validates A7.2', () => {
        const material = createClass3Material('UN1139', 'II', 'A7.2', 'COATING SOLUTION');
        const result = validatePackingInstruction(material, 'A7.2');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 13: UN2332 ACETALDEHYDE OXIME - validates A7.2', () => {
        const material = createClass3Material('UN2332', 'III', 'A7.2', 'ACETALDEHYDE OXIME');
        const result = validatePackingInstruction(material, 'A7.2');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 14: UN1986 ALCOHOLS, FLAMMABLE, TOXIC, N.O.S. - validates A7.2', () => {
        const material = createClass3Material('UN1986', 'III', 'A7.2', 'ALCOHOLS, FLAMMABLE, TOXIC, N.O.S.', '6.1');
        const result = validatePackingInstruction(material, 'A7.2');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 15: UN2607 ACROLEIN DIMER, STABILIZED - validates A7.2', () => {
        const material = createClass3Material('UN2607', 'III', 'A7.2', 'ACROLEIN DIMER, STABILIZED');
        const result = validatePackingInstruction(material, 'A7.2');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 16: UN1263 PAINT - validates A7.2', () => {
        const material = createClass3Material('UN1263', 'III', 'A7.2', 'PAINT');
        const result = validatePackingInstruction(material, 'A7.2');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 17: UN1263 PAINT RELATED MATERIAL - validates A7.2', () => {
        const material = createClass3Material('UN1263', 'III', 'A7.2', 'PAINT RELATED MATERIAL');
        const result = validatePackingInstruction(material, 'A7.2');
        expect(result.isValid).toBe(true);
      });
    });

    describe('Positive Cases - A7.3 (Combination Packaging Only)', () => {
      test('Scenario 10: UN2251 BICYCLO[2,2,1]HEPTA-2,5-DIENE, STABILIZED - validates A7.3', () => {
        const material = createClass3Material('UN2251', 'II', 'A7.3', 'BICYCLO[2,2,1]HEPTA-2,5-DIENE, STABILIZED');
        const result = validatePackingInstruction(material, 'A7.3');
        expect(result.isValid).toBe(true);
      });
    });

    describe('Positive Cases - A7.4 (Specialized Fuel Tanks)', () => {
      test('Scenario 3: UN3165 AIRCRAFT HYDRAULIC POWER UNIT FUEL TANK - validates A7.4', () => {
        const material = createClass3Material('UN3165', 'I', 'A7.4', 'AIRCRAFT HYDRAULIC POWER UNIT FUEL TANK', '6.1, 8');
        const result = validatePackingInstruction(material, 'A7.4');
        expect(result.isValid).toBe(true);
      });
    });

    describe('Positive Cases - A7.10 (Chlorosilanes)', () => {
      test('Scenario 18: UN2985 CHLOROSILANES, FLAMMABLE, CORROSIVE, N.O.S. - validates A7.10', () => {
        const material = createClass3Material('UN2985', 'II', 'A7.10', 'CHLOROSILANES, FLAMMABLE, CORROSIVE, N.O.S.', '8');
        const result = validatePackingInstruction(material, 'A7.10');
        expect(result.isValid).toBe(true);
      });
    });

    describe('Positive Cases - A7.11 (Engines and Machinery)', () => {
      test('Scenario 20: UN3528 ENGINE, INTERNAL COMBUSTION - validates A7.11', () => {
        const material = createClass3Material('UN3528', '', 'A7.11', 'ENGINE, INTERNAL COMBUSTION');
        const result = validatePackingInstruction(material, 'A7.11');
        expect(result.isValid).toBe(true);
      });
    });

    describe('Positive Cases - A12.2 (Cleaning Compounds)', () => {
      test('Scenario 19: NA1993 COMPOUNDS, CLEANING LIQUID - validates A12.2', () => {
        const material = createClass3Material('NA1993', 'III', 'A12.2', 'COMPOUNDS, CLEANING LIQUID');
        const result = validatePackingInstruction(material, 'A12.2');
        expect(result.isValid).toBe(true);
      });
    });

    describe('Negative Cases - From Alterations', () => {
      test('Scenario 3, Alteration 3: rejects A7.2 when A7.4 expected', () => {
        const material = createClass3Material('UN3165', 'I', 'A7.4', 'AIRCRAFT HYDRAULIC POWER UNIT FUEL TANK', '6.1, 8');
        const result = validatePackingInstruction(material, 'A7.2');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('A7.4');
      });

      test('Scenario 10, Alteration 1: rejects A7.2 when A7.3 expected', () => {
        const material = createClass3Material('UN2251', 'II', 'A7.3', 'BICYCLO[2,2,1]HEPTA-2,5-DIENE, STABILIZED');
        const result = validatePackingInstruction(material, 'A7.2');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('A7.3');
      });

      test('Scenario 18, Alteration 1: rejects A7.2 when A7.10 expected', () => {
        const material = createClass3Material('UN2985', 'II', 'A7.10', 'CHLOROSILANES, FLAMMABLE, CORROSIVE, N.O.S.', '8');
        const result = validatePackingInstruction(material, 'A7.2');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('A7.10');
      });

      test('rejects A7.3 when A7.2 expected', () => {
        const material = createClass3Material('UN1090', 'II', 'A7.2', 'ACETONE');
        const result = validatePackingInstruction(material, 'A7.3');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('A7.2');
      });

      test('rejects A7.11 when A7.2 expected', () => {
        const material = createClass3Material('UN1263', 'III', 'A7.2', 'PAINT');
        const result = validatePackingInstruction(material, 'A7.11');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('A7.2');
      });

      test('rejects A12.2 when A7.11 expected', () => {
        const material = createClass3Material('UN3528', '', 'A7.11', 'ENGINE, INTERNAL COMBUSTION');
        const result = validatePackingInstruction(material, 'A12.2');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('A7.11');
      });
    });

    describe('Normalization', () => {
      test('handles trailing period in paragraph reference', () => {
        const material = createClass3Material('UN1089', 'I', 'A7.2.', 'ACETALDEHYDE');
        const result = validatePackingInstruction(material, 'A7.2');
        expect(result.isValid).toBe(true);
      });

      test('handles case variations', () => {
        const material = createClass3Material('UN1089', 'I', 'A7.2', 'ACETALDEHYDE');
        const result = validatePackingInstruction(material, 'a7.2');
        expect(result.isValid).toBe(true);
      });
    });
  });

  describe('Key 14: Subsidiary Risk Validation', () => {
    describe('Positive Cases - No Subsidiary Risk', () => {
      test('Scenario 1: UN1089 ACETALDEHYDE - validates empty subsidiary risk', () => {
        const material = createClass3Material('UN1089', 'I', 'A7.2', 'ACETALDEHYDE');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 5: UN1090 ACETONE - validates empty subsidiary risk', () => {
        const material = createClass3Material('UN1090', 'II', 'A7.2', 'ACETONE');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 6: UN1114 BENZENE - validates empty subsidiary risk', () => {
        const material = createClass3Material('UN1114', 'II', 'A7.2', 'BENZENE');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 7: UN1987 ALCOHOLS, N.O.S. - validates empty subsidiary risk', () => {
        const material = createClass3Material('UN1987', 'II', 'A7.2', 'ALCOHOLS, N.O.S.');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 10: UN2251 BICYCLO[2,2,1]HEPTA-2,5-DIENE, STABILIZED - validates empty subsidiary risk', () => {
        const material = createClass3Material('UN2251', 'II', 'A7.3', 'BICYCLO[2,2,1]HEPTA-2,5-DIENE, STABILIZED');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 11: UN1278 1-CHLOROPROPANE - validates empty subsidiary risk', () => {
        const material = createClass3Material('UN1278', 'II', 'A7.2', '1-CHLOROPROPANE');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 12: UN1139 COATING SOLUTION - validates empty subsidiary risk', () => {
        const material = createClass3Material('UN1139', 'II', 'A7.2', 'COATING SOLUTION');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 13: UN2332 ACETALDEHYDE OXIME - validates empty subsidiary risk', () => {
        const material = createClass3Material('UN2332', 'III', 'A7.2', 'ACETALDEHYDE OXIME');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 15: UN2607 ACROLEIN DIMER, STABILIZED - validates empty subsidiary risk', () => {
        const material = createClass3Material('UN2607', 'III', 'A7.2', 'ACROLEIN DIMER, STABILIZED');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 16: UN1263 PAINT - validates empty subsidiary risk', () => {
        const material = createClass3Material('UN1263', 'III', 'A7.2', 'PAINT');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 17: UN1263 PAINT RELATED MATERIAL - validates empty subsidiary risk', () => {
        const material = createClass3Material('UN1263', 'III', 'A7.2', 'PAINT RELATED MATERIAL');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 19: NA1993 COMPOUNDS, CLEANING LIQUID - validates empty subsidiary risk', () => {
        const material = createClass3Material('NA1993', 'III', 'A12.2', 'COMPOUNDS, CLEANING LIQUID');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 20: UN3528 ENGINE, INTERNAL COMBUSTION - validates empty subsidiary risk', () => {
        const material = createClass3Material('UN3528', '', 'A7.11', 'ENGINE, INTERNAL COMBUSTION');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });
    });

    describe('Positive Cases - Subsidiary Risk 6.1 (TOXIC)', () => {
      test('Scenario 2: UN1093 ACRYLONITRILE, STABILIZED - validates subsidiary risk 6.1', () => {
        const material = createClass3Material('UN1093', 'I', 'A7.2', 'ACRYLONITRILE, STABILIZED', '6.1');
        const result = validateSubsidiaryRisk(material, '6.1');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 4: UN1991 CHLOROPRENE, STABILIZED - validates subsidiary risk 6.1', () => {
        const material = createClass3Material('UN1991', 'I', 'A7.2', 'CHLOROPRENE, STABILIZED', '6.1');
        const result = validateSubsidiaryRisk(material, '6.1');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 14: UN1986 ALCOHOLS, FLAMMABLE, TOXIC, N.O.S. - validates subsidiary risk 6.1', () => {
        const material = createClass3Material('UN1986', 'III', 'A7.2', 'ALCOHOLS, FLAMMABLE, TOXIC, N.O.S.', '6.1');
        const result = validateSubsidiaryRisk(material, '6.1');
        expect(result.isValid).toBe(true);
      });
    });

    describe('Positive Cases - Subsidiary Risk 8 (CORROSIVE)', () => {
      test('Scenario 8: UN3274 ALCOHOLATES SOLUTION, N.O.S. - validates subsidiary risk 8', () => {
        const material = createClass3Material('UN3274', 'II', 'A7.2', 'ALCOHOLATES SOLUTION, N.O.S.', '8');
        const result = validateSubsidiaryRisk(material, '8');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 9: UN2733 AMINES, FLAMMABLE, CORROSIVE N.O.S. - validates subsidiary risk 8', () => {
        const material = createClass3Material('UN2733', 'II', 'A7.2', 'AMINES, FLAMMABLE, CORROSIVE N.O.S.', '8');
        const result = validateSubsidiaryRisk(material, '8');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 18: UN2985 CHLOROSILANES, FLAMMABLE, CORROSIVE, N.O.S. - validates subsidiary risk 8', () => {
        const material = createClass3Material('UN2985', 'II', 'A7.10', 'CHLOROSILANES, FLAMMABLE, CORROSIVE, N.O.S.', '8');
        const result = validateSubsidiaryRisk(material, '8');
        expect(result.isValid).toBe(true);
      });
    });

    describe('Positive Cases - Multiple Subsidiary Risks (6.1, 8)', () => {
      test('Scenario 3: UN3165 AIRCRAFT HYDRAULIC POWER UNIT FUEL TANK - validates subsidiary risk 6.1, 8', () => {
        const material = createClass3Material('UN3165', 'I', 'A7.4', 'AIRCRAFT HYDRAULIC POWER UNIT FUEL TANK', '6.1, 8');
        const result = validateSubsidiaryRisk(material, '6.1, 8');
        expect(result.isValid).toBe(true);
      });
    });

    describe('Negative Cases - From Alterations', () => {
      test('Scenario 2, Alteration 2: rejects empty when 6.1 expected', () => {
        const material = createClass3Material('UN1093', 'I', 'A7.2', 'ACRYLONITRILE, STABILIZED', '6.1');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('6.1');
      });

      test('Scenario 3, Alteration 2: rejects 6.1 only when 6.1, 8 expected', () => {
        const material = createClass3Material('UN3165', 'I', 'A7.4', 'AIRCRAFT HYDRAULIC POWER UNIT FUEL TANK', '6.1, 8');
        const result = validateSubsidiaryRisk(material, '6.1');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('6.1, 8');
      });

      test('Scenario 8, Alteration 2: rejects empty when 8 expected', () => {
        const material = createClass3Material('UN3274', 'II', 'A7.2', 'ALCOHOLATES SOLUTION, N.O.S.', '8');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('8');
      });

      test('rejects 6.2 when 6.1 expected', () => {
        const material = createClass3Material('UN1986', 'III', 'A7.2', 'ALCOHOLS, FLAMMABLE, TOXIC, N.O.S.', '6.1');
        const result = validateSubsidiaryRisk(material, '6.2');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('6.1');
      });

      test('rejects 8 when 6.1 expected', () => {
        const material = createClass3Material('UN1991', 'I', 'A7.2', 'CHLOROPRENE, STABILIZED', '6.1');
        const result = validateSubsidiaryRisk(material, '8');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('6.1');
      });

      test('rejects 6.1 when 8 expected', () => {
        const material = createClass3Material('UN2733', 'II', 'A7.2', 'AMINES, FLAMMABLE, CORROSIVE N.O.S.', '8');
        const result = validateSubsidiaryRisk(material, '6.1');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('8');
      });

      test('rejects 8 only when 6.1, 8 expected', () => {
        const material = createClass3Material('UN3165', 'I', 'A7.4', 'AIRCRAFT HYDRAULIC POWER UNIT FUEL TANK', '6.1, 8');
        const result = validateSubsidiaryRisk(material, '8');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('6.1, 8');
      });

      test('rejects subsidiary risk when none expected', () => {
        const material = createClass3Material('UN1090', 'II', 'A7.2', 'ACETONE');
        const result = validateSubsidiaryRisk(material, '6.1');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('None');
      });
    });
  });

  describe('Key 7: Aircraft Type Validation', () => {
    describe('Positive Cases - Cargo Aircraft Only (P1-P4)', () => {
      test('Scenario 1: UN1089 ACETALDEHYDE - validates CAO with P3 special provision', () => {
        const material = createClass3Material('UN1089', 'I', 'A7.2', 'ACETALDEHYDE', '', 'P3');
        const result = validateAircraftType(material, 'CARGO AIRCRAFT ONLY');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 2: UN1093 ACRYLONITRILE, STABILIZED - validates CAO with P3 special provision', () => {
        const material = createClass3Material('UN1093', 'I', 'A7.2', 'ACRYLONITRILE, STABILIZED', '6.1', 'P3');
        const result = validateAircraftType(material, 'CARGO AIRCRAFT ONLY');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 3: UN3165 AIRCRAFT HYDRAULIC POWER UNIT FUEL TANK - validates CAO with P3 special provision', () => {
        const material = createClass3Material('UN3165', 'I', 'A7.4', 'AIRCRAFT HYDRAULIC POWER UNIT FUEL TANK', '6.1, 8', 'P3');
        const result = validateAircraftType(material, 'CARGO AIRCRAFT ONLY');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 4: UN1991 CHLOROPRENE, STABILIZED - validates CAO with P3 special provision', () => {
        const material = createClass3Material('UN1991', 'I', 'A7.2', 'CHLOROPRENE, STABILIZED', '6.1', 'P3');
        const result = validateAircraftType(material, 'CARGO AIRCRAFT ONLY');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 9: UN2733 AMINES, FLAMMABLE, CORROSIVE N.O.S. - validates CAO with P4 special provision', () => {
        const material = createClass3Material('UN2733', 'II', 'A7.2', 'AMINES, FLAMMABLE, CORROSIVE N.O.S.', '8', 'P4');
        const result = validateAircraftType(material, 'CARGO AIRCRAFT ONLY');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 18: UN2985 CHLOROSILANES, FLAMMABLE, CORROSIVE, N.O.S. - validates CAO with P4 special provision', () => {
        const material = createClass3Material('UN2985', 'II', 'A7.10', 'CHLOROSILANES, FLAMMABLE, CORROSIVE, N.O.S.', '8', 'P4');
        const result = validateAircraftType(material, 'CARGO AIRCRAFT ONLY');
        expect(result.isValid).toBe(true);
      });
    });

    describe('Positive Cases - Passenger and Cargo Aircraft (P5)', () => {
      test('Scenario 5: UN1090 ACETONE - validates Passenger and Cargo with P5 special provision', () => {
        const material = createClass3Material('UN1090', 'II', 'A7.2', 'ACETONE', '', 'P5');
        const result = validateAircraftType(material, 'PASSENGER AND CARGO AIRCRAFT');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 6: UN1114 BENZENE - validates Passenger and Cargo with P5 special provision', () => {
        const material = createClass3Material('UN1114', 'II', 'A7.2', 'BENZENE', '', 'P5');
        const result = validateAircraftType(material, 'PASSENGER AND CARGO AIRCRAFT');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 7: UN1987 ALCOHOLS, N.O.S. - validates Passenger and Cargo with P5 special provision', () => {
        const material = createClass3Material('UN1987', 'II', 'A7.2', 'ALCOHOLS, N.O.S.', '', 'P5');
        const result = validateAircraftType(material, 'PASSENGER AND CARGO AIRCRAFT');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 8: UN3274 ALCOHOLATES SOLUTION, N.O.S. - validates Passenger and Cargo with P5 special provision', () => {
        const material = createClass3Material('UN3274', 'II', 'A7.2', 'ALCOHOLATES SOLUTION, N.O.S.', '8', 'P5');
        const result = validateAircraftType(material, 'PASSENGER AND CARGO AIRCRAFT');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 10: UN2251 BICYCLO[2,2,1]HEPTA-2,5-DIENE, STABILIZED - validates Passenger and Cargo with P5 special provision', () => {
        const material = createClass3Material('UN2251', 'II', 'A7.3', 'BICYCLO[2,2,1]HEPTA-2,5-DIENE, STABILIZED', '', 'P5');
        const result = validateAircraftType(material, 'PASSENGER AND CARGO AIRCRAFT');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 11: UN1278 1-CHLOROPROPANE - validates Passenger and Cargo with P5 special provision', () => {
        const material = createClass3Material('UN1278', 'II', 'A7.2', '1-CHLOROPROPANE', '', 'P5');
        const result = validateAircraftType(material, 'PASSENGER AND CARGO AIRCRAFT');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 12: UN1139 COATING SOLUTION - validates Passenger and Cargo with P5 special provision', () => {
        const material = createClass3Material('UN1139', 'II', 'A7.2', 'COATING SOLUTION', '', 'P5');
        const result = validateAircraftType(material, 'PASSENGER AND CARGO AIRCRAFT');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 13: UN2332 ACETALDEHYDE OXIME - validates Passenger and Cargo with P5 special provision', () => {
        const material = createClass3Material('UN2332', 'III', 'A7.2', 'ACETALDEHYDE OXIME', '', 'P5');
        const result = validateAircraftType(material, 'PASSENGER AND CARGO AIRCRAFT');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 14: UN1986 ALCOHOLS, FLAMMABLE, TOXIC, N.O.S. - validates Passenger and Cargo with P5 special provision', () => {
        const material = createClass3Material('UN1986', 'III', 'A7.2', 'ALCOHOLS, FLAMMABLE, TOXIC, N.O.S.', '6.1', 'P5');
        const result = validateAircraftType(material, 'PASSENGER AND CARGO AIRCRAFT');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 15: UN2607 ACROLEIN DIMER, STABILIZED - validates Passenger and Cargo with P5 special provision', () => {
        const material = createClass3Material('UN2607', 'III', 'A7.2', 'ACROLEIN DIMER, STABILIZED', '', 'P5');
        const result = validateAircraftType(material, 'PASSENGER AND CARGO AIRCRAFT');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 16: UN1263 PAINT - validates Passenger and Cargo with P5 special provision', () => {
        const material = createClass3Material('UN1263', 'III', 'A7.2', 'PAINT', '', 'P5');
        const result = validateAircraftType(material, 'PASSENGER AND CARGO AIRCRAFT');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 17: UN1263 PAINT RELATED MATERIAL - validates Passenger and Cargo with P5 special provision', () => {
        const material = createClass3Material('UN1263', 'III', 'A7.2', 'PAINT RELATED MATERIAL', '', 'P5');
        const result = validateAircraftType(material, 'PASSENGER AND CARGO AIRCRAFT');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 19: NA1993 COMPOUNDS, CLEANING LIQUID - validates Passenger and Cargo with P5 special provision', () => {
        const material = createClass3Material('NA1993', 'III', 'A12.2', 'COMPOUNDS, CLEANING LIQUID', '', 'P5');
        const result = validateAircraftType(material, 'PASSENGER AND CARGO AIRCRAFT');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 20: UN3528 ENGINE, INTERNAL COMBUSTION - validates Passenger and Cargo with P5 special provision', () => {
        const material = createClass3Material('UN3528', '', 'A7.11', 'ENGINE, INTERNAL COMBUSTION', '', 'P5');
        const result = validateAircraftType(material, 'PASSENGER AND CARGO AIRCRAFT');
        expect(result.isValid).toBe(true);
      });
    });

    describe('Negative Cases - From Alterations', () => {
      test('Scenario 4, Alteration 3: rejects Passenger and Cargo when P3 requires CAO', () => {
        const material = createClass3Material('UN1991', 'I', 'A7.2', 'CHLOROPRENE, STABILIZED', '6.1', 'P3');
        const result = validateAircraftType(material, 'PASSENGER AND CARGO AIRCRAFT');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('CARGO AIRCRAFT ONLY');
      });

      test('Scenario 9, Alteration 1: rejects Passenger and Cargo when P4 requires CAO', () => {
        const material = createClass3Material('UN2733', 'II', 'A7.2', 'AMINES, FLAMMABLE, CORROSIVE N.O.S.', '8', 'P4');
        const result = validateAircraftType(material, 'PASSENGER AND CARGO AIRCRAFT');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('CARGO AIRCRAFT ONLY');
      });

      test('Scenario 18, Alteration 2: rejects Passenger and Cargo when P4 requires CAO', () => {
        const material = createClass3Material('UN2985', 'II', 'A7.10', 'CHLOROSILANES, FLAMMABLE, CORROSIVE, N.O.S.', '8', 'P4');
        const result = validateAircraftType(material, 'PASSENGER AND CARGO AIRCRAFT');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('CARGO AIRCRAFT ONLY');
      });

      test('rejects CAO when P5 allows Passenger and Cargo', () => {
        const material = createClass3Material('UN1090', 'II', 'A7.2', 'ACETONE', '', 'P5');
        const result = validateAircraftType(material, 'CARGO AIRCRAFT ONLY');
        expect(result.isValid).toBe(false);
      });
    });
  });

  describe('Key 11: UN/ID Number Validation', () => {
    describe('Positive Cases - Matching UN Numbers', () => {
      test('Scenario 1: UN1089 ACETALDEHYDE - validates UN number correctly', () => {
        const material = createClass3Material('UN1089', 'I', 'A7.2', 'ACETALDEHYDE');
        const result = validateUnidNumber(material, 'UN1089');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 2: UN1093 ACRYLONITRILE, STABILIZED - validates UN number correctly', () => {
        const material = createClass3Material('UN1093', 'I', 'A7.2', 'ACRYLONITRILE, STABILIZED', '6.1');
        const result = validateUnidNumber(material, 'UN1093');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 3: UN3165 AIRCRAFT HYDRAULIC POWER UNIT FUEL TANK - validates UN number correctly', () => {
        const material = createClass3Material('UN3165', 'I', 'A7.4', 'AIRCRAFT HYDRAULIC POWER UNIT FUEL TANK', '6.1, 8');
        const result = validateUnidNumber(material, 'UN3165');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 5: UN1090 ACETONE - validates UN number correctly', () => {
        const material = createClass3Material('UN1090', 'II', 'A7.2', 'ACETONE');
        const result = validateUnidNumber(material, 'UN1090');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 7: UN1987 ALCOHOLS, N.O.S. - validates UN number correctly', () => {
        const material = createClass3Material('UN1987', 'II', 'A7.2', 'ALCOHOLS, N.O.S.');
        const result = validateUnidNumber(material, 'UN1987');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 10: UN2251 BICYCLO[2,2,1]HEPTA-2,5-DIENE, STABILIZED - validates UN number correctly', () => {
        const material = createClass3Material('UN2251', 'II', 'A7.3', 'BICYCLO[2,2,1]HEPTA-2,5-DIENE, STABILIZED');
        const result = validateUnidNumber(material, 'UN2251');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 13: UN2332 ACETALDEHYDE OXIME - validates UN number correctly', () => {
        const material = createClass3Material('UN2332', 'III', 'A7.2', 'ACETALDEHYDE OXIME');
        const result = validateUnidNumber(material, 'UN2332');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 16: UN1263 PAINT - validates UN number correctly', () => {
        const material = createClass3Material('UN1263', 'III', 'A7.2', 'PAINT');
        const result = validateUnidNumber(material, 'UN1263');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 18: UN2985 CHLOROSILANES, FLAMMABLE, CORROSIVE, N.O.S. - validates UN number correctly', () => {
        const material = createClass3Material('UN2985', 'II', 'A7.10', 'CHLOROSILANES, FLAMMABLE, CORROSIVE, N.O.S.', '8');
        const result = validateUnidNumber(material, 'UN2985');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 19: NA1993 COMPOUNDS, CLEANING LIQUID - validates NA number correctly (domestic)', () => {
        const material = createClass3Material('NA1993', 'III', 'A12.2', 'COMPOUNDS, CLEANING LIQUID');
        const result = validateUnidNumber(material, 'NA1993');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 20: UN3528 ENGINE, INTERNAL COMBUSTION - validates UN number correctly', () => {
        const material = createClass3Material('UN3528', '', 'A7.11', 'ENGINE, INTERNAL COMBUSTION');
        const result = validateUnidNumber(material, 'UN3528');
        expect(result.isValid).toBe(true);
      });

      test('handles lowercase UN prefix', () => {
        const material = createClass3Material('UN1090', 'II', 'A7.2', 'ACETONE');
        const result = validateUnidNumber(material, 'un1090');
        expect(result.isValid).toBe(true);
      });
    });

    describe('Negative Cases - From Alterations', () => {
      test('Scenario 5, Alteration 2: rejects UN1091 when UN1090 expected (transposition)', () => {
        const material = createClass3Material('UN1090', 'II', 'A7.2', 'ACETONE');
        const result = validateUnidNumber(material, 'UN1091');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('UN1090');
      });

      test('Scenario 12, Alteration 1: rejects UN1263 when UN1139 expected (wrong PSN)', () => {
        const material = createClass3Material('UN1139', 'II', 'A7.2', 'COATING SOLUTION');
        const result = validateUnidNumber(material, 'UN1263');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('UN1139');
      });

      test('Scenario 15, Alteration 2: rejects UN1092 when UN2607 expected (wrong ACROLEIN number)', () => {
        const material = createClass3Material('UN2607', 'III', 'A7.2', 'ACROLEIN DIMER, STABILIZED');
        const result = validateUnidNumber(material, 'UN1092');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('UN2607');
      });

      test('Scenario 19, Alteration 1: rejects UN1993 when NA1993 expected (domestic ID)', () => {
        const material = createClass3Material('NA1993', 'III', 'A12.2', 'COMPOUNDS, CLEANING LIQUID');
        const result = validateUnidNumber(material, 'UN1993');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('NA1993');
      });

      test('rejects missing UN/NA prefix', () => {
        const material = createClass3Material('UN1090', 'II', 'A7.2', 'ACETONE');
        const result = validateUnidNumber(material, '1090');
        expect(result.isValid).toBe(false);
      });
    });
  });

  describe('Key 12: Proper Shipping Name Validation', () => {
    describe('Positive Cases - Matching PSN', () => {
      test('Scenario 1: UN1089 ACETALDEHYDE - validates PSN correctly', () => {
        const material = createClass3Material('UN1089', 'I', 'A7.2', 'ACETALDEHYDE');
        const result = validateProperShippingName(material, 'ACETALDEHYDE');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 2: UN1093 ACRYLONITRILE, STABILIZED - validates PSN correctly', () => {
        const material = createClass3Material('UN1093', 'I', 'A7.2', 'ACRYLONITRILE, STABILIZED', '6.1');
        const result = validateProperShippingName(material, 'ACRYLONITRILE, STABILIZED');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 3: UN3165 AIRCRAFT HYDRAULIC POWER UNIT FUEL TANK - validates PSN correctly', () => {
        const material = createClass3Material('UN3165', 'I', 'A7.4', 'AIRCRAFT HYDRAULIC POWER UNIT FUEL TANK', '6.1, 8');
        const result = validateProperShippingName(material, 'AIRCRAFT HYDRAULIC POWER UNIT FUEL TANK');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 5: UN1090 ACETONE - validates simple PSN correctly', () => {
        const material = createClass3Material('UN1090', 'II', 'A7.2', 'ACETONE');
        const result = validateProperShippingName(material, 'ACETONE');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 10: UN2251 BICYCLO[2,2,1]HEPTA-2,5-DIENE, STABILIZED - validates complex PSN correctly', () => {
        const material = createClass3Material('UN2251', 'II', 'A7.3', 'BICYCLO[2,2,1]HEPTA-2,5-DIENE, STABILIZED');
        const result = validateProperShippingName(material, 'BICYCLO[2,2,1]HEPTA-2,5-DIENE, STABILIZED');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 11: UN1278 1-CHLOROPROPANE - validates PSN with leading digit correctly', () => {
        const material = createClass3Material('UN1278', 'II', 'A7.2', '1-CHLOROPROPANE');
        const result = validateProperShippingName(material, '1-CHLOROPROPANE');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 16: UN1263 PAINT - validates simple PSN correctly', () => {
        const material = createClass3Material('UN1263', 'III', 'A7.2', 'PAINT');
        const result = validateProperShippingName(material, 'PAINT');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 17: UN1263 PAINT RELATED MATERIAL - validates PSN correctly (same UN, different PSN)', () => {
        const material = createClass3Material('UN1263', 'III', 'A7.2', 'PAINT RELATED MATERIAL');
        const result = validateProperShippingName(material, 'PAINT RELATED MATERIAL');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 20: UN3528 ENGINE, INTERNAL COMBUSTION - validates long PSN correctly', () => {
        const material = createClass3Material('UN3528', '', 'A7.11', 'ENGINE, INTERNAL COMBUSTION, FLAMMABLE LIQUID POWERED');
        const result = validateProperShippingName(material, 'ENGINE, INTERNAL COMBUSTION, FLAMMABLE LIQUID POWERED');
        expect(result.isValid).toBe(true);
      });

      test('handles case insensitivity', () => {
        const material = createClass3Material('UN1090', 'II', 'A7.2', 'ACETONE');
        const result = validateProperShippingName(material, 'Acetone');
        expect(result.isValid).toBe(true);
      });
    });

    describe('N.O.S. Technical Name Cases (Scenarios 7, 8, 9, 14)', () => {
      test('Scenario 7: validates N.O.S. PSN with technical name', () => {
        const material = createClass3Material(
          'UN1987', 'II', 'A7.2',
          'ALCOHOLS, N.O.S. (contains ethanol, methanol)'
        );
        const result = validateProperShippingName(
          material,
          'ALCOHOLS, N.O.S. (contains ethanol, methanol)'
        );
        expect(result.isValid).toBe(true);
      });

      test('Scenario 8: validates N.O.S. PSN with technical name and subsidiary risk', () => {
        const material = createClass3Material(
          'UN3274', 'II', 'A7.2',
          'ALCOHOLATES SOLUTION, N.O.S. (contains sodium methoxide)', '8'
        );
        const result = validateProperShippingName(
          material,
          'ALCOHOLATES SOLUTION, N.O.S. (contains sodium methoxide)'
        );
        expect(result.isValid).toBe(true);
      });

      test('Scenario 9: validates N.O.S. PSN with technical name', () => {
        const material = createClass3Material(
          'UN2733', 'II', 'A7.2',
          'AMINES, FLAMMABLE, CORROSIVE N.O.S. (contains diethylamine)', '8'
        );
        const result = validateProperShippingName(
          material,
          'AMINES, FLAMMABLE, CORROSIVE N.O.S. (contains diethylamine)'
        );
        expect(result.isValid).toBe(true);
      });

      test('Scenario 14: validates N.O.S. PSN with toxic technical name', () => {
        const material = createClass3Material(
          'UN1986', 'III', 'A7.2',
          'ALCOHOLS, FLAMMABLE, TOXIC, N.O.S. (contains allyl alcohol)', '6.1'
        );
        const result = validateProperShippingName(
          material,
          'ALCOHOLS, FLAMMABLE, TOXIC, N.O.S. (contains allyl alcohol)'
        );
        expect(result.isValid).toBe(true);
      });

      test('Scenario 7, Alteration 1: rejects N.O.S. without technical name', () => {
        const material = createClass3Material(
          'UN1987', 'II', 'A7.2',
          'ALCOHOLS, N.O.S. (contains ethanol, methanol)'
        );
        const result = validateProperShippingName(
          material,
          'ALCOHOLS, N.O.S.'
        );
        expect(result.isValid).toBe(false);
      });

      test('Scenario 8, Alteration 3: rejects N.O.S. without technical name', () => {
        const material = createClass3Material(
          'UN3274', 'II', 'A7.2',
          'ALCOHOLATES SOLUTION, N.O.S. (contains sodium methoxide)', '8'
        );
        const result = validateProperShippingName(
          material,
          'ALCOHOLATES SOLUTION, N.O.S.'
        );
        expect(result.isValid).toBe(false);
      });

      test('Scenario 14, Alteration 1: rejects N.O.S. without technical name', () => {
        const material = createClass3Material(
          'UN1986', 'III', 'A7.2',
          'ALCOHOLS, FLAMMABLE, TOXIC, N.O.S. (contains allyl alcohol)', '6.1'
        );
        const result = validateProperShippingName(
          material,
          'ALCOHOLS, FLAMMABLE, TOXIC, N.O.S.'
        );
        expect(result.isValid).toBe(false);
      });
    });

    describe('Negative Cases - From Alterations', () => {
      test('Scenario 4, Alteration 1: rejects PSN missing "STABILIZED" qualifier', () => {
        const material = createClass3Material(
          'UN1991', 'I', 'A7.2',
          'CHLOROPRENE, STABILIZED', '6.1'
        );
        const result = validateProperShippingName(material, 'CHLOROPRENE');
        expect(result.isValid).toBe(false);
      });

      test('Scenario 10, Alteration 2: rejects PSN missing "STABILIZED" qualifier', () => {
        const material = createClass3Material(
          'UN2251', 'II', 'A7.3',
          'BICYCLO[2,2,1]HEPTA-2,5-DIENE, STABILIZED'
        );
        const result = validateProperShippingName(material, 'BICYCLO[2,2,1]HEPTA-2,5-DIENE');
        expect(result.isValid).toBe(false);
      });

      test('Scenario 15, Alteration 1: rejects PSN missing "STABILIZED" qualifier', () => {
        const material = createClass3Material(
          'UN2607', 'III', 'A7.2',
          'ACROLEIN DIMER, STABILIZED'
        );
        const result = validateProperShippingName(material, 'ACROLEIN DIMER');
        expect(result.isValid).toBe(false);
      });

      test('Scenario 16, Alteration 1: rejects wrong PSN for same UN number', () => {
        const material = createClass3Material(
          'UN1263', 'III', 'A7.2',
          'PAINT'
        );
        const result = validateProperShippingName(material, 'VARNISH');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('PAINT');
      });

      test('Scenario 17, Alteration 1: rejects PAINT when PAINT RELATED MATERIAL expected', () => {
        const material = createClass3Material(
          'UN1263', 'III', 'A7.2',
          'PAINT RELATED MATERIAL'
        );
        const result = validateProperShippingName(material, 'PAINT');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('PAINT RELATED MATERIAL');
      });

      test('Scenario 20, Alteration 2: rejects MACHINERY when ENGINE expected', () => {
        const material = createClass3Material(
          'UN3528', '', 'A7.11',
          'ENGINE, INTERNAL COMBUSTION, FLAMMABLE LIQUID POWERED'
        );
        const result = validateProperShippingName(material, 'MACHINERY, INTERNAL COMBUSTION, FLAMMABLE LIQUID POWERED');
        expect(result.isValid).toBe(false);
      });

      test('rejects abbreviated PSN', () => {
        const material = createClass3Material(
          'UN3165', 'I', 'A7.4',
          'AIRCRAFT HYDRAULIC POWER UNIT FUEL TANK', '6.1, 8'
        );
        const result = validateProperShippingName(material, 'AIRCRAFT FUEL TANK');
        expect(result.isValid).toBe(false);
      });
    });
  });

  describe('Unified validateSDDGInspection() Function', () => {
    describe('Scenario 1: UN1089 - Complete SDDG Validation (PG I, CAO)', () => {
      const material = createClass3Material(
        'UN1089', 'I', 'A7.2', 'ACETALDEHYDE', '', 'P3'
      );

      test('validates successful SDDG with all correct values', () => {
        const content = createSDDGContent({
          aircraftType: 'CARGO AIRCRAFT ONLY',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN1089',
          properShippingName: 'ACETALDEHYDE',
          hazardClass: '3',
          subsidiaryRisk: '',
          packingGroup: 'I',
          packingInstruction: 'A7.2',
        });

        const results = validateSDDGInspection(content, material);
        const failures = results.filter(r => !r.isValid);

        expect(failures).toHaveLength(0);
      });

      test('Alteration 2: identifies Key 15 showing "II" instead of "I"', () => {
        const content = createSDDGContent({
          aircraftType: 'CARGO AIRCRAFT ONLY',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN1089',
          properShippingName: 'ACETALDEHYDE',
          hazardClass: '3',
          subsidiaryRisk: '',
          packingGroup: 'II',  // Wrong - should be I
          packingInstruction: 'A7.2',
        });

        const results = validateSDDGInspection(content, material);
        const pgResult = results.find(r => r.key === 'packingGroup');

        expect(pgResult?.isValid).toBe(false);
        expect(pgResult?.expectedValue).toBe('I');
      });
    });

    describe('Scenario 2: UN1093 - With Subsidiary Risk 6.1', () => {
      const material = createClass3Material(
        'UN1093', 'I', 'A7.2', 'ACRYLONITRILE, STABILIZED', '6.1', 'P3'
      );

      test('validates successful SDDG with subsidiary risk', () => {
        const content = createSDDGContent({
          aircraftType: 'CARGO AIRCRAFT ONLY',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN1093',
          properShippingName: 'ACRYLONITRILE, STABILIZED',
          hazardClass: '3',
          subsidiaryRisk: '6.1',
          packingGroup: 'I',
          packingInstruction: 'A7.2',
        });

        const results = validateSDDGInspection(content, material);
        const failures = results.filter(r => !r.isValid);

        expect(failures).toHaveLength(0);
      });

      test('Alteration 2: identifies Key 14 empty when 6.1 expected', () => {
        const content = createSDDGContent({
          aircraftType: 'CARGO AIRCRAFT ONLY',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN1093',
          properShippingName: 'ACRYLONITRILE, STABILIZED',
          hazardClass: '3',
          subsidiaryRisk: '',  // Missing subsidiary risk
          packingGroup: 'I',
          packingInstruction: 'A7.2',
        });

        const results = validateSDDGInspection(content, material);
        const subsidiaryResult = results.find(r => r.key === 'subsidiaryRisk');

        expect(subsidiaryResult?.isValid).toBe(false);
        expect(subsidiaryResult?.expectedValue).toBe('6.1');
      });
    });

    describe('Scenario 3: UN3165 - Multiple Subsidiary Risks (6.1, 8)', () => {
      const material = createClass3Material(
        'UN3165', 'I', 'A7.4', 'AIRCRAFT HYDRAULIC POWER UNIT FUEL TANK', '6.1, 8', 'P3'
      );

      test('validates successful SDDG with multiple subsidiary risks', () => {
        const content = createSDDGContent({
          aircraftType: 'CARGO AIRCRAFT ONLY',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN3165',
          properShippingName: 'AIRCRAFT HYDRAULIC POWER UNIT FUEL TANK',
          hazardClass: '3',
          subsidiaryRisk: '6.1, 8',
          packingGroup: 'I',
          packingInstruction: 'A7.4',
        });

        const results = validateSDDGInspection(content, material);
        const failures = results.filter(r => !r.isValid);

        expect(failures).toHaveLength(0);
      });

      test('Alteration 2: identifies Key 14 showing only "6.1" (missing 8)', () => {
        const content = createSDDGContent({
          aircraftType: 'CARGO AIRCRAFT ONLY',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN3165',
          properShippingName: 'AIRCRAFT HYDRAULIC POWER UNIT FUEL TANK',
          hazardClass: '3',
          subsidiaryRisk: '6.1',  // Missing 8
          packingGroup: 'I',
          packingInstruction: 'A7.4',
        });

        const results = validateSDDGInspection(content, material);
        const subsidiaryResult = results.find(r => r.key === 'subsidiaryRisk');

        expect(subsidiaryResult?.isValid).toBe(false);
        expect(subsidiaryResult?.expectedValue).toBe('6.1, 8');
      });

      test('Alteration 3: identifies Key 17 showing "A7.2" instead of "A7.4"', () => {
        const content = createSDDGContent({
          aircraftType: 'CARGO AIRCRAFT ONLY',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN3165',
          properShippingName: 'AIRCRAFT HYDRAULIC POWER UNIT FUEL TANK',
          hazardClass: '3',
          subsidiaryRisk: '6.1, 8',
          packingGroup: 'I',
          packingInstruction: 'A7.2',  // Wrong - should be A7.4
        });

        const results = validateSDDGInspection(content, material);
        const packingResult = results.find(r => r.key === 'packingInstruction');

        expect(packingResult?.isValid).toBe(false);
        expect(packingResult?.expectedValue).toBe('A7.4');
      });
    });

    describe('Scenario 5: UN1090 - P5 Allows Passenger Aircraft (PG II)', () => {
      const material = createClass3Material(
        'UN1090', 'II', 'A7.2', 'ACETONE', '', 'P5'
      );

      test('validates successful SDDG with Passenger and Cargo aircraft type', () => {
        const content = createSDDGContent({
          aircraftType: 'PASSENGER AND CARGO AIRCRAFT',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN1090',
          properShippingName: 'ACETONE',
          hazardClass: '3',
          subsidiaryRisk: '',
          packingGroup: 'II',
          packingInstruction: 'A7.2',
        });

        const results = validateSDDGInspection(content, material);
        const failures = results.filter(r => !r.isValid);

        expect(failures).toHaveLength(0);
      });
    });

    describe('Scenario 7: UN1987 - N.O.S. with Technical Name', () => {
      const material = createClass3Material(
        'UN1987', 'II', 'A7.2', 'ALCOHOLS, N.O.S. (contains ethanol, methanol)', '', 'P5'
      );

      test('validates successful SDDG with N.O.S. technical name', () => {
        const content = createSDDGContent({
          aircraftType: 'PASSENGER AND CARGO AIRCRAFT',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN1987',
          properShippingName: 'ALCOHOLS, N.O.S. (contains ethanol, methanol)',
          hazardClass: '3',
          subsidiaryRisk: '',
          packingGroup: 'II',
          packingInstruction: 'A7.2',
        });

        const results = validateSDDGInspection(content, material);
        const failures = results.filter(r => !r.isValid);

        expect(failures).toHaveLength(0);
      });

      test('Alteration 1: identifies Key 12 missing technical name', () => {
        const content = createSDDGContent({
          aircraftType: 'PASSENGER AND CARGO AIRCRAFT',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN1987',
          properShippingName: 'ALCOHOLS, N.O.S.',  // Missing technical name
          hazardClass: '3',
          subsidiaryRisk: '',
          packingGroup: 'II',
          packingInstruction: 'A7.2',
        });

        const results = validateSDDGInspection(content, material);
        const psnResult = results.find(r => r.key === 'properShippingName');

        expect(psnResult?.isValid).toBe(false);
      });
    });

    describe('Scenario 9: UN2733 - P4 Requires CAO', () => {
      const material = createClass3Material(
        'UN2733', 'II', 'A7.2', 'AMINES, FLAMMABLE, CORROSIVE N.O.S. (contains diethylamine)', '8', 'P4'
      );

      test('validates successful SDDG with CAO and subsidiary risk 8', () => {
        const content = createSDDGContent({
          aircraftType: 'CARGO AIRCRAFT ONLY',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN2733',
          properShippingName: 'AMINES, FLAMMABLE, CORROSIVE N.O.S. (contains diethylamine)',
          hazardClass: '3',
          subsidiaryRisk: '8',
          packingGroup: 'II',
          packingInstruction: 'A7.2',
        });

        const results = validateSDDGInspection(content, material);
        const failures = results.filter(r => !r.isValid);

        expect(failures).toHaveLength(0);
      });

      test('Alteration 1: identifies Key 7 showing "Passenger and Cargo" when P4 requires CAO', () => {
        const content = createSDDGContent({
          aircraftType: 'PASSENGER AND CARGO AIRCRAFT',  // Wrong - P4 requires CAO
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN2733',
          properShippingName: 'AMINES, FLAMMABLE, CORROSIVE N.O.S. (contains diethylamine)',
          hazardClass: '3',
          subsidiaryRisk: '8',
          packingGroup: 'II',
          packingInstruction: 'A7.2',
        });

        const results = validateSDDGInspection(content, material);
        const aircraftResult = results.find(r => r.key === 'aircraftType');

        expect(aircraftResult?.isValid).toBe(false);
        expect(aircraftResult?.expectedValue).toBe('CARGO AIRCRAFT ONLY');
      });
    });

    describe('Scenario 13: UN2332 - PG III Material', () => {
      const material = createClass3Material(
        'UN2332', 'III', 'A7.2', 'ACETALDEHYDE OXIME', '', 'P5'
      );

      test('validates successful SDDG with PG III', () => {
        const content = createSDDGContent({
          aircraftType: 'PASSENGER AND CARGO AIRCRAFT',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN2332',
          properShippingName: 'ACETALDEHYDE OXIME',
          hazardClass: '3',
          subsidiaryRisk: '',
          packingGroup: 'III',
          packingInstruction: 'A7.2',
        });

        const results = validateSDDGInspection(content, material);
        const failures = results.filter(r => !r.isValid);

        expect(failures).toHaveLength(0);
      });

      test('Alteration 1: identifies Key 15 showing "II" instead of "III"', () => {
        const content = createSDDGContent({
          aircraftType: 'PASSENGER AND CARGO AIRCRAFT',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN2332',
          properShippingName: 'ACETALDEHYDE OXIME',
          hazardClass: '3',
          subsidiaryRisk: '',
          packingGroup: 'II',  // Wrong - should be III
          packingInstruction: 'A7.2',
        });

        const results = validateSDDGInspection(content, material);
        const pgResult = results.find(r => r.key === 'packingGroup');

        expect(pgResult?.isValid).toBe(false);
        expect(pgResult?.expectedValue).toBe('III');
      });
    });

    describe('Scenario 18: UN2985 - A7.10 Specialized Packaging', () => {
      const material = createClass3Material(
        'UN2985', 'II', 'A7.10', 'CHLOROSILANES, FLAMMABLE, CORROSIVE, N.O.S.', '8', 'P4'
      );

      test('validates successful SDDG with specialized packaging instruction', () => {
        const content = createSDDGContent({
          aircraftType: 'CARGO AIRCRAFT ONLY',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN2985',
          properShippingName: 'CHLOROSILANES, FLAMMABLE, CORROSIVE, N.O.S.',
          hazardClass: '3',
          subsidiaryRisk: '8',
          packingGroup: 'II',
          packingInstruction: 'A7.10',
        });

        const results = validateSDDGInspection(content, material);
        const failures = results.filter(r => !r.isValid);

        expect(failures).toHaveLength(0);
      });

      test('Alteration 1: identifies Key 17 showing "A7.2" instead of "A7.10"', () => {
        const content = createSDDGContent({
          aircraftType: 'CARGO AIRCRAFT ONLY',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN2985',
          properShippingName: 'CHLOROSILANES, FLAMMABLE, CORROSIVE, N.O.S.',
          hazardClass: '3',
          subsidiaryRisk: '8',
          packingGroup: 'II',
          packingInstruction: 'A7.2',  // Wrong - should be A7.10
        });

        const results = validateSDDGInspection(content, material);
        const packingResult = results.find(r => r.key === 'packingInstruction');

        expect(packingResult?.isValid).toBe(false);
        expect(packingResult?.expectedValue).toBe('A7.10');
      });
    });

    describe('Scenario 19: NA1993 - Domestic Shipment', () => {
      const material = createClass3Material(
        'NA1993', 'III', 'A12.2', 'COMPOUNDS, CLEANING LIQUID', '', 'P5'
      );

      test('validates successful SDDG with NA number for domestic', () => {
        const content = createSDDGContent({
          aircraftType: 'PASSENGER AND CARGO AIRCRAFT',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'NA1993',
          properShippingName: 'COMPOUNDS, CLEANING LIQUID',
          hazardClass: '3',
          subsidiaryRisk: '',
          packingGroup: 'III',
          packingInstruction: 'A12.2',
        });

        const results = validateSDDGInspection(content, material);
        const failures = results.filter(r => !r.isValid);

        expect(failures).toHaveLength(0);
      });

      test('Alteration 1: identifies Key 11 showing "UN1993" instead of "NA1993"', () => {
        const content = createSDDGContent({
          aircraftType: 'PASSENGER AND CARGO AIRCRAFT',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN1993',  // Wrong - should be NA1993 for domestic
          properShippingName: 'COMPOUNDS, CLEANING LIQUID',
          hazardClass: '3',
          subsidiaryRisk: '',
          packingGroup: 'III',
          packingInstruction: 'A12.2',
        });

        const results = validateSDDGInspection(content, material);
        const unidResult = results.find(r => r.key === 'unIdNo');

        expect(unidResult?.isValid).toBe(false);
        expect(unidResult?.expectedValue).toBe('NA1993');
      });
    });

    describe('Scenario 20: UN3528 - Engine with No Packing Group', () => {
      const material = createClass3Material(
        'UN3528', '', 'A7.11', 'ENGINE, INTERNAL COMBUSTION, FLAMMABLE LIQUID POWERED', '', 'P5'
      );

      test('validates successful SDDG with no packing group for engine', () => {
        const content = createSDDGContent({
          aircraftType: 'PASSENGER AND CARGO AIRCRAFT',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN3528',
          properShippingName: 'ENGINE, INTERNAL COMBUSTION, FLAMMABLE LIQUID POWERED',
          hazardClass: '3',
          subsidiaryRisk: '',
          packingGroup: '',
          packingInstruction: 'A7.11',
        });

        const results = validateSDDGInspection(content, material);
        const failures = results.filter(r => !r.isValid);

        expect(failures).toHaveLength(0);
      });

      test('Alteration 1: identifies Key 15 showing "II" when no PG expected', () => {
        const content = createSDDGContent({
          aircraftType: 'PASSENGER AND CARGO AIRCRAFT',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN3528',
          properShippingName: 'ENGINE, INTERNAL COMBUSTION, FLAMMABLE LIQUID POWERED',
          hazardClass: '3',
          subsidiaryRisk: '',
          packingGroup: 'II',  // Wrong - engines shouldn't have PG
          packingInstruction: 'A7.11',
        });

        const results = validateSDDGInspection(content, material);
        const pgResult = results.find(r => r.key === 'packingGroup');

        expect(pgResult?.isValid).toBe(false);
        expect(pgResult?.expectedValue).toBe('None');
      });
    });

    describe('Multiple Errors Detection', () => {
      test('identifies multiple validation failures in single SDDG', () => {
        const material = createClass3Material(
          'UN1090', 'II', 'A7.2', 'ACETONE', '', 'P5'
        );

        const content = createSDDGContent({
          aircraftType: 'CARGO AIRCRAFT ONLY',  // Wrong - P5 allows PAX
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN1091',  // Wrong UN number
          properShippingName: 'ACETALDEHYDE',  // Wrong PSN
          hazardClass: '3',
          subsidiaryRisk: '',
          packingGroup: 'III',  // Wrong PG
          packingInstruction: 'A7.3',  // Wrong instruction
        });

        const results = validateSDDGInspection(content, material);
        const failures = results.filter(r => !r.isValid);

        // Should catch multiple errors
        expect(failures.length).toBeGreaterThanOrEqual(3);

        // Verify specific failures are identified
        const failedKeys = failures.map(f => f.key);
        expect(failedKeys).toContain('unIdNo');
        expect(failedKeys).toContain('packingGroup');
        expect(failedKeys).toContain('packingInstruction');
      });
    });

    describe('Edge Cases', () => {
      test('returns empty array when material is null', () => {
        const content = createSDDGContent({
          unIdNo: 'UN1090',
          hazardClass: '3',
        });

        const results = validateSDDGInspection(content, null);
        expect(results).toHaveLength(0);
      });

      test('returns empty array when content is null', () => {
        const material = createClass3Material('UN1090', 'II', 'A7.2', 'ACETONE');
        const results = validateSDDGInspection(null, material);
        expect(results).toHaveLength(0);
      });
    });
  });
});
