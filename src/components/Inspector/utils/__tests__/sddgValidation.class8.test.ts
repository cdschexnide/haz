import {
  validateHazardClass,
  validatePackingGroup,
  validatePackingInstruction,
  validateSubsidiaryRisk,
} from '../sddgValidation';
import { HazardousMaterialItem } from '@/hazardousMaterials/hazardousMaterialsList';

// Helper to create minimal HazardousMaterialItem for testing Class 8 materials
function createClass8Material(
  unid: string,
  hazclassDiv: string,
  packagingParagraph: string,
  properShippingName: string,
  packingGroup: string,
  subsidiaryRisk: string = '',
  isTechnicalNameRequired: boolean = false
): HazardousMaterialItem {
  return {
    unid,
    hazclassDiv,
    packagingParagraph,
    properShippingName,
    packingGroup,
    subsidiaryRisk,
    specialProvision: '',
    isTechnicalNameRequired,
  } as HazardousMaterialItem;
}

describe('SDDG Validation - Class 8 Corrosives', () => {
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
});
