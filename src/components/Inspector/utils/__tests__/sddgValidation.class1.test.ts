import {
  validateHazardClass,
  validatePackingGroup,
  validatePackingInstruction,
} from '../sddgValidation';
import { HazardousMaterialItem } from '@/hazardousMaterials/hazardousMaterialsList';

// Helper to create minimal HazardousMaterialItem for testing
function createClass1Material(
  unid: string,
  hazclassDiv: string,
  packagingParagraph: string,
  properShippingName: string
): HazardousMaterialItem {
  return {
    unid,
    hazclassDiv,
    packagingParagraph,
    properShippingName,
    packingGroup: '', // Class 1 has no packing group
    subsidiaryRisk: '',
    specialProvision: '',
    isTechnicalNameRequired: false,
  } as HazardousMaterialItem;
}

describe('SDDG Validation - Class 1 Explosives', () => {
  describe('Key 13: Hazard Class Validation', () => {
    describe('Positive Cases - Valid Hazard Classes', () => {
      test('Scenario 1: UN0224 - validates 1.1A correctly', () => {
        const material = createClass1Material('UN0224', '1.1A', 'A5.2', 'BARIUM AZIDE, DRY');
        const result = validateHazardClass(material, '1.1A');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 2: UN0027 - validates 1.1D correctly', () => {
        const material = createClass1Material('UN0027', '1.1D', 'A5.3', 'BLACK POWDER (GUNPOWDER)');
        const result = validateHazardClass(material, '1.1D');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 3: UN0004 - validates 1.1D correctly', () => {
        const material = createClass1Material('UN0004', '1.1D', 'A5.2', 'AMMONIUM PICRATE');
        const result = validateHazardClass(material, '1.1D');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 4: UN0160 - validates 1.1C correctly', () => {
        const material = createClass1Material('UN0160', '1.1C', 'A5.21', 'POWDER, SMOKELESS');
        const result = validateHazardClass(material, '1.1C');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 5: UN0136 - validates 1.2D correctly', () => {
        const material = createClass1Material('UN0136', '1.2D', 'A5.10', 'MINES with bursting charge');
        const result = validateHazardClass(material, '1.2D');
        expect(result.isValid).toBe(true);
      });
    });

    describe('Negative Cases - From Alterations', () => {
      test('Scenario 1, Alteration 3: rejects 1.1 without compatibility group A', () => {
        const material = createClass1Material('UN0224', '1.1A', 'A5.2', 'BARIUM AZIDE, DRY');
        const result = validateHazardClass(material, '1.1'); // Missing A
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('1.1A');
      });

      test('Scenario 3, Alteration 1: rejects EXPLOSIVE 1 without division .1', () => {
        const material = createClass1Material('UN0004', '1.1D', 'A5.2', 'AMMONIUM PICRATE');
        const result = validateHazardClass(material, '1'); // Missing .1D
        expect(result.isValid).toBe(false);
      });

      test('Scenario 4, Alteration 2: rejects wrong compatibility group D instead of C', () => {
        const material = createClass1Material('UN0160', '1.1C', 'A5.21', 'POWDER, SMOKELESS');
        const result = validateHazardClass(material, '1.1D'); // Wrong compat group
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('1.1C');
      });

      test('Scenario 5, Alteration 2: rejects wrong division 1.1D instead of 1.2D', () => {
        const material = createClass1Material('UN0136', '1.2D', 'A5.10', 'MINES');
        const result = validateHazardClass(material, '1.1D'); // Wrong division
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('1.2D');
      });

      test('Scenario 5, Alteration 3: rejects 1.2 without compatibility group', () => {
        const material = createClass1Material('UN0136', '1.2D', 'A5.10', 'MINES');
        const result = validateHazardClass(material, '1.2'); // Missing D
        expect(result.isValid).toBe(false);
      });
    });
  });

  describe('Key 15: Packing Group Validation', () => {
    describe('Class 1 Special Case - Empty Packing Group', () => {
      test('Scenario 1: UN0224 - accepts empty packing group', () => {
        const material = createClass1Material('UN0224', '1.1A', 'A5.2', 'BARIUM AZIDE');
        const result = validatePackingGroup(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 2: UN0027 - accepts empty packing group', () => {
        const material = createClass1Material('UN0027', '1.1D', 'A5.3', 'BLACK POWDER');
        const result = validatePackingGroup(material, '');
        expect(result.isValid).toBe(true);
      });

      test('All Class 1 materials should have empty packing group in Key 15', () => {
        const materials = [
          createClass1Material('UN0224', '1.1A', 'A5.2', 'BARIUM AZIDE'),
          createClass1Material('UN0027', '1.1D', 'A5.3', 'BLACK POWDER'),
          createClass1Material('UN0004', '1.1D', 'A5.2', 'AMMONIUM PICRATE'),
          createClass1Material('UN0160', '1.1C', 'A5.21', 'POWDER, SMOKELESS'),
          createClass1Material('UN0136', '1.2D', 'A5.10', 'MINES'),
        ];

        materials.forEach((material) => {
          const result = validatePackingGroup(material, '');
          expect(result.isValid).toBe(true);
        });
      });
    });
  });

  describe('Key 17: Packaging Instruction Validation', () => {
    describe('Positive Cases', () => {
      test('Scenario 1: UN0224 - validates A5.2 correctly', () => {
        const material = createClass1Material('UN0224', '1.1A', 'A5.2', 'BARIUM AZIDE');
        const result = validatePackingInstruction(material, 'A5.2');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 2: UN0027 - validates A5.3 correctly', () => {
        const material = createClass1Material('UN0027', '1.1D', 'A5.3', 'BLACK POWDER');
        const result = validatePackingInstruction(material, 'A5.3');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 4: UN0160 - validates A5.21 correctly', () => {
        const material = createClass1Material('UN0160', '1.1C', 'A5.21', 'POWDER, SMOKELESS');
        const result = validatePackingInstruction(material, 'A5.21');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 5: UN0136 - validates A5.10 correctly', () => {
        const material = createClass1Material('UN0136', '1.2D', 'A5.10', 'MINES');
        const result = validatePackingInstruction(material, 'A5.10');
        expect(result.isValid).toBe(true);
      });
    });

    describe('Negative Cases - From Alterations', () => {
      test('Scenario 4, Alteration 1: rejects A5.2 when A5.21 expected', () => {
        const material = createClass1Material('UN0160', '1.1C', 'A5.21', 'POWDER, SMOKELESS');
        const result = validatePackingInstruction(material, 'A5.2'); // Wrong paragraph
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('A5.21');
      });
    });

    describe('Normalization', () => {
      test('handles trailing period in paragraph reference', () => {
        const material = createClass1Material('UN0224', '1.1A', 'A5.2.', 'BARIUM AZIDE');
        const result = validatePackingInstruction(material, 'A5.2');
        expect(result.isValid).toBe(true);
      });

      test('handles case variations', () => {
        const material = createClass1Material('UN0224', '1.1A', 'A5.2', 'BARIUM AZIDE');
        const result = validatePackingInstruction(material, 'a5.2');
        expect(result.isValid).toBe(true);
      });
    });
  });
});
