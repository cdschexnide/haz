import {
  validateHazardClass,
  validatePackingGroup,
  validatePackingInstruction,
  validateSubsidiaryRisk,
} from '../sddgValidation';
import { HazardousMaterialItem } from '@/hazardousMaterials/hazardousMaterialsList';

// Helper to create minimal HazardousMaterialItem for Class 3 testing
function createClass3Material(
  unid: string,
  packingGroup: string, // 'I', 'II', 'III', or '' for articles
  packagingParagraph: string,
  properShippingName: string,
  subsidiaryRisk: string = ''
): HazardousMaterialItem {
  return {
    unid,
    hazclassDiv: '3', // Always "3" for Class 3
    packagingParagraph,
    properShippingName,
    packingGroup,
    subsidiaryRisk,
    specialProvision: '',
    isTechnicalNameRequired: properShippingName.includes('N.O.S.'),
  } as HazardousMaterialItem;
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
});
