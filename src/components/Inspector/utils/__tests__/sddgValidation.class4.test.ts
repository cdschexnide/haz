import {
  validateHazardClass,
  validatePackingGroup,
  validatePackingInstruction,
  validateSubsidiaryRisk,
} from '../sddgValidation';
import { HazardousMaterialItem } from '@/hazardousMaterials/hazardousMaterialsList';

// Helper to create minimal HazardousMaterialItem for testing
function createClass4Material(
  unid: string,
  hazclassDiv: string,
  packagingParagraph: string,
  properShippingName: string,
  packingGroup: string = '',
  subsidiaryRisk: string = ''
): HazardousMaterialItem {
  return {
    unid,
    hazclassDiv,
    packagingParagraph,
    properShippingName,
    packingGroup, // Class 4 HAS packing groups (I, II, III)
    subsidiaryRisk,
    specialProvision: '',
    isTechnicalNameRequired: false,
  } as HazardousMaterialItem;
}

describe('SDDG Validation - Class 4 (Flammable Solids)', () => {
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
});
