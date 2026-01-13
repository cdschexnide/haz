import {
  validateHazardClass,
  validatePackingGroup,
  validatePackingInstruction,
  validateSubsidiaryRisk,
} from '../sddgValidation';
import { HazardousMaterialItem } from '@/hazardousMaterials/hazardousMaterialsList';

// Helper to create minimal HazardousMaterialItem for testing
function createClass1Material(
  unid: string,
  hazclassDiv: string,
  packagingParagraph: string,
  properShippingName: string,
  subsidiaryRisk: string = ''
): HazardousMaterialItem {
  return {
    unid,
    hazclassDiv,
    packagingParagraph,
    properShippingName,
    packingGroup: '', // Class 1 has no packing group
    subsidiaryRisk,
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

      test('Scenario 6: UN0328 - validates 1.2C correctly', () => {
        const material = createClass1Material('UN0328', '1.2C', 'A5.5', 'CARTRIDGES FOR WEAPONS, INERT PROJECTILE');
        const result = validateHazardClass(material, '1.2C');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 7: UN0247 - validates 1.3J correctly', () => {
        const material = createClass1Material('UN0247', '1.3J', 'A5.12', 'AMMUNITION, INCENDIARY, liquid or gel');
        const result = validateHazardClass(material, '1.3J');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 8: UN0049 - validates 1.3G correctly', () => {
        const material = createClass1Material('UN0049', '1.3G', 'A5.5', 'CARTRIDGES, FLASH');
        const result = validateHazardClass(material, '1.3G');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 9: UN0106 - validates 1.4B correctly', () => {
        const material = createClass1Material('UN0106', '1.4B', 'A5.9', 'FUZES, DETONATING');
        const result = validateHazardClass(material, '1.4B');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 10: UN0325 - validates 1.4G correctly', () => {
        const material = createClass1Material('UN0325', '1.4G', 'A5.11', 'IGNITERS');
        const result = validateHazardClass(material, '1.4G');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 11: UN0012 - validates 1.4S correctly', () => {
        const material = createClass1Material('UN0012', '1.4S', 'A5.5', 'CARTRIDGES FOR WEAPONS, INERT PROJECTILE');
        const result = validateHazardClass(material, '1.4S');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 12: UN0331 - validates 1.5D correctly', () => {
        const material = createClass1Material('UN0331', '1.5D', 'A5.2', 'EXPLOSIVE, BLASTING, TYPE B');
        const result = validateHazardClass(material, '1.5D');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 13: UN0486 - validates 1.6N correctly', () => {
        const material = createClass1Material('UN0486', '1.6N', 'A5.27', 'ARTICLES, EXPLOSIVE, EXTREMELY INSENSITIVE');
        const result = validateHazardClass(material, '1.6N');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 14: UN0222 - validates 1.1D correctly (with subsidiary 5.1)', () => {
        const material = createClass1Material('UN0222', '1.1D', 'A5.2', 'AMMONIUM NITRATE', '5.1');
        const result = validateHazardClass(material, '1.1D');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 15: UN0019 - validates 1.4G correctly (with subsidiary 6.1)', () => {
        const material = createClass1Material('UN0019', '1.4G', 'A5.12', 'AMMUNITION, TEAR-PRODUCING', '6.1');
        const result = validateHazardClass(material, '1.4G');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 16: UN0124 - validates 1.1D correctly', () => {
        const material = createClass1Material('UN0124', '1.1D', 'A5.10', 'JET PERFORATING GUNS, CHARGED');
        const result = validateHazardClass(material, '1.1D');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 17: UN0135 - validates 1.1A correctly', () => {
        const material = createClass1Material('UN0135', '1.1A', 'A5.2', 'MERCURY FULMINATE, WETTED');
        const result = validateHazardClass(material, '1.1A');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 18: UN0473 - validates 1.1A correctly', () => {
        const material = createClass1Material('UN0473', '1.1A', 'A5.2', 'SUBSTANCES, EXPLOSIVE, N.O.S.');
        const result = validateHazardClass(material, '1.1A');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 19: UN0059 - validates 1.1D correctly', () => {
        const material = createClass1Material('UN0059', '1.1D', 'A5.6', 'CHARGES, SHAPED, FLEXIBLE, LINEAR');
        const result = validateHazardClass(material, '1.1D');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 20: UN0354 - validates 1.4D correctly', () => {
        const material = createClass1Material('UN0354', '1.4D', 'A5.27', 'ARTICLES, EXPLOSIVE, N.O.S.');
        const result = validateHazardClass(material, '1.4D');
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

      test('Scenario 8, Alteration 1: rejects 1.1G when 1.3G expected', () => {
        const material = createClass1Material('UN0049', '1.3G', 'A5.5', 'CARTRIDGES, FLASH');
        const result = validateHazardClass(material, '1.1G'); // Wrong division
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('1.3G');
      });

      test('Scenario 9, Alteration 2: rejects 1.4S when 1.4B expected', () => {
        const material = createClass1Material('UN0106', '1.4B', 'A5.9', 'FUZES, DETONATING');
        const result = validateHazardClass(material, '1.4S'); // Wrong compat group
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('1.4B');
      });

      test('Scenario 11, Alteration 2: rejects 1.4G when 1.4S expected', () => {
        const material = createClass1Material('UN0012', '1.4S', 'A5.5', 'CARTRIDGES FOR WEAPONS, INERT PROJECTILE');
        const result = validateHazardClass(material, '1.4G'); // Wrong compat group
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('1.4S');
      });

      test('Scenario 12, Alteration 1: rejects 1.1D when 1.5D expected', () => {
        const material = createClass1Material('UN0331', '1.5D', 'A5.2', 'EXPLOSIVE, BLASTING, TYPE B');
        const result = validateHazardClass(material, '1.1D'); // Wrong division
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('1.5D');
      });

      test('Scenario 13, Alteration 1: rejects 1.6 without compatibility group N', () => {
        const material = createClass1Material('UN0486', '1.6N', 'A5.27', 'ARTICLES, EXPLOSIVE, EXTREMELY INSENSITIVE');
        const result = validateHazardClass(material, '1.6'); // Missing N
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('1.6N');
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

      test('Scenario 6: UN0328 - validates A5.5 correctly', () => {
        const material = createClass1Material('UN0328', '1.2C', 'A5.5', 'CARTRIDGES FOR WEAPONS, INERT PROJECTILE');
        const result = validatePackingInstruction(material, 'A5.5');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 7: UN0247 - validates A5.12 correctly', () => {
        const material = createClass1Material('UN0247', '1.3J', 'A5.12', 'AMMUNITION, INCENDIARY, liquid or gel');
        const result = validatePackingInstruction(material, 'A5.12');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 8: UN0049 - validates A5.5 correctly', () => {
        const material = createClass1Material('UN0049', '1.3G', 'A5.5', 'CARTRIDGES, FLASH');
        const result = validatePackingInstruction(material, 'A5.5');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 9: UN0106 - validates A5.9 correctly', () => {
        const material = createClass1Material('UN0106', '1.4B', 'A5.9', 'FUZES, DETONATING');
        const result = validatePackingInstruction(material, 'A5.9');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 10: UN0325 - validates A5.11 correctly', () => {
        const material = createClass1Material('UN0325', '1.4G', 'A5.11', 'IGNITERS');
        const result = validatePackingInstruction(material, 'A5.11');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 11: UN0012 - validates A5.5 correctly', () => {
        const material = createClass1Material('UN0012', '1.4S', 'A5.5', 'CARTRIDGES FOR WEAPONS, INERT PROJECTILE');
        const result = validatePackingInstruction(material, 'A5.5');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 12: UN0331 - validates A5.2 correctly', () => {
        const material = createClass1Material('UN0331', '1.5D', 'A5.2', 'EXPLOSIVE, BLASTING, TYPE B');
        const result = validatePackingInstruction(material, 'A5.2');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 13: UN0486 - validates A5.27 correctly', () => {
        const material = createClass1Material('UN0486', '1.6N', 'A5.27', 'ARTICLES, EXPLOSIVE, EXTREMELY INSENSITIVE');
        const result = validatePackingInstruction(material, 'A5.27');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 14: UN0222 - validates A5.2 correctly', () => {
        const material = createClass1Material('UN0222', '1.1D', 'A5.2', 'AMMONIUM NITRATE', '5.1');
        const result = validatePackingInstruction(material, 'A5.2');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 15: UN0019 - validates A5.12 correctly', () => {
        const material = createClass1Material('UN0019', '1.4G', 'A5.12', 'AMMUNITION, TEAR-PRODUCING', '6.1');
        const result = validatePackingInstruction(material, 'A5.12');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 16: UN0124 - validates A5.10 correctly', () => {
        const material = createClass1Material('UN0124', '1.1D', 'A5.10', 'JET PERFORATING GUNS, CHARGED');
        const result = validatePackingInstruction(material, 'A5.10');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 17: UN0135 - validates A5.2 correctly', () => {
        const material = createClass1Material('UN0135', '1.1A', 'A5.2', 'MERCURY FULMINATE, WETTED');
        const result = validatePackingInstruction(material, 'A5.2');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 18: UN0473 - validates A5.2 correctly', () => {
        const material = createClass1Material('UN0473', '1.1A', 'A5.2', 'SUBSTANCES, EXPLOSIVE, N.O.S.');
        const result = validatePackingInstruction(material, 'A5.2');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 19: UN0059 - validates A5.6 correctly', () => {
        const material = createClass1Material('UN0059', '1.1D', 'A5.6', 'CHARGES, SHAPED, FLEXIBLE, LINEAR');
        const result = validatePackingInstruction(material, 'A5.6');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 20: UN0354 - validates A5.27 correctly', () => {
        const material = createClass1Material('UN0354', '1.4D', 'A5.27', 'ARTICLES, EXPLOSIVE, N.O.S.');
        const result = validatePackingInstruction(material, 'A5.27');
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

      test('Scenario 10, Alteration 2: rejects A5.1 when A5.11 expected', () => {
        const material = createClass1Material('UN0325', '1.4G', 'A5.11', 'IGNITERS');
        const result = validatePackingInstruction(material, 'A5.1'); // Typo - missing second 1
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('A5.11');
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

  describe('Key 14: Subsidiary Risk Validation', () => {
    describe('Positive Cases - No Subsidiary Risk (Scenarios 6-13, 16-20)', () => {
      test('Scenario 6: UN0328 - validates empty subsidiary risk correctly', () => {
        const material = createClass1Material('UN0328', '1.2C', 'A5.5', 'CARTRIDGES FOR WEAPONS, INERT PROJECTILE');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 7: UN0247 - validates empty subsidiary risk correctly', () => {
        const material = createClass1Material('UN0247', '1.3J', 'A5.12', 'AMMUNITION, INCENDIARY, liquid or gel');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 8: UN0049 - validates empty subsidiary risk correctly', () => {
        const material = createClass1Material('UN0049', '1.3G', 'A5.5', 'CARTRIDGES, FLASH');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 9: UN0106 - validates empty subsidiary risk correctly', () => {
        const material = createClass1Material('UN0106', '1.4B', 'A5.9', 'FUZES, DETONATING');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 10: UN0325 - validates empty subsidiary risk correctly', () => {
        const material = createClass1Material('UN0325', '1.4G', 'A5.11', 'IGNITERS');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 11: UN0012 - validates empty subsidiary risk correctly', () => {
        const material = createClass1Material('UN0012', '1.4S', 'A5.5', 'CARTRIDGES FOR WEAPONS, INERT PROJECTILE');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 12: UN0331 - validates empty subsidiary risk correctly', () => {
        const material = createClass1Material('UN0331', '1.5D', 'A5.2', 'EXPLOSIVE, BLASTING, TYPE B');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 13: UN0486 - validates empty subsidiary risk correctly', () => {
        const material = createClass1Material('UN0486', '1.6N', 'A5.27', 'ARTICLES, EXPLOSIVE, EXTREMELY INSENSITIVE');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 16: UN0124 - validates empty subsidiary risk correctly', () => {
        const material = createClass1Material('UN0124', '1.1D', 'A5.10', 'JET PERFORATING GUNS, CHARGED');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 17: UN0135 - validates empty subsidiary risk correctly', () => {
        const material = createClass1Material('UN0135', '1.1A', 'A5.2', 'MERCURY FULMINATE, WETTED');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 18: UN0473 - validates empty subsidiary risk correctly', () => {
        const material = createClass1Material('UN0473', '1.1A', 'A5.2', 'SUBSTANCES, EXPLOSIVE, N.O.S.');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 19: UN0059 - validates empty subsidiary risk correctly', () => {
        const material = createClass1Material('UN0059', '1.1D', 'A5.6', 'CHARGES, SHAPED, FLEXIBLE, LINEAR');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 20: UN0354 - validates empty subsidiary risk correctly', () => {
        const material = createClass1Material('UN0354', '1.4D', 'A5.27', 'ARTICLES, EXPLOSIVE, N.O.S.');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });
    });

    describe('Positive Cases - With Subsidiary Risk (Scenarios 14-15)', () => {
      test('Scenario 14: UN0222 - validates subsidiary risk 5.1 correctly', () => {
        const material = createClass1Material('UN0222', '1.1D', 'A5.2', 'AMMONIUM NITRATE', '5.1');
        const result = validateSubsidiaryRisk(material, '5.1');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 15: UN0019 - validates subsidiary risk 6.1 correctly', () => {
        const material = createClass1Material('UN0019', '1.4G', 'A5.12', 'AMMUNITION, TEAR-PRODUCING', '6.1');
        const result = validateSubsidiaryRisk(material, '6.1');
        expect(result.isValid).toBe(true);
      });
    });

    describe('Negative Cases - From Alterations', () => {
      test('Scenario 14, Alteration 2: rejects empty when 5.1 expected', () => {
        const material = createClass1Material('UN0222', '1.1D', 'A5.2', 'AMMONIUM NITRATE', '5.1');
        const result = validateSubsidiaryRisk(material, ''); // Missing subsidiary risk
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('5.1');
      });

      test('Scenario 14, Alteration 3: rejects 4.1 when 5.1 expected', () => {
        const material = createClass1Material('UN0222', '1.1D', 'A5.2', 'AMMONIUM NITRATE', '5.1');
        const result = validateSubsidiaryRisk(material, '4.1'); // Wrong subsidiary risk
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('5.1');
      });

      test('Scenario 15, Alteration 2: rejects 6.2 when 6.1 expected', () => {
        const material = createClass1Material('UN0019', '1.4G', 'A5.12', 'AMMUNITION, TEAR-PRODUCING', '6.1');
        const result = validateSubsidiaryRisk(material, '6.2'); // Wrong subsidiary risk
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('6.1');
      });
    });
  });
});
