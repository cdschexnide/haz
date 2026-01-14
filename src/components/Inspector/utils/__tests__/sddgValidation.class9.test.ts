import {
  validateHazardClass,
  validatePackingGroup,
  validatePackingInstruction,
  validateSubsidiaryRisk,
} from '../sddgValidation';
import { HazardousMaterialItem } from '@/hazardousMaterials/hazardousMaterialsList';

// Helper to create minimal HazardousMaterialItem for Class 9 testing
function createClass9Material(
  unid: string,
  packagingParagraph: string,
  properShippingName: string,
  packingGroup: string = '', // VARIES for Class 9
  subsidiaryRisk: string = ''
): HazardousMaterialItem {
  return {
    unid,
    hazclassDiv: '9', // Class 9 has NO divisions
    packagingParagraph,
    properShippingName,
    packingGroup,
    subsidiaryRisk,
    specialProvision: '',
    isTechnicalNameRequired: properShippingName.includes('N.O.S.'),
  } as HazardousMaterialItem;
}

describe('SDDG Validation - Class 9 Miscellaneous Dangerous Goods', () => {
  describe('Key 13: Hazard Class Validation', () => {
    describe('Positive Cases - Valid Hazard Class', () => {
      test('Scenario 1: UN3480 - validates hazard class 9 correctly', () => {
        const material = createClass9Material('UN3480', 'A13.7', 'LITHIUM ION BATTERIES');
        const result = validateHazardClass(material, '9');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 2: UN3480 Section II - validates hazard class 9 correctly', () => {
        const material = createClass9Material('UN3480', 'A13.7', 'LITHIUM ION BATTERIES');
        const result = validateHazardClass(material, '9');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 3: UN3481 - validates hazard class 9 correctly', () => {
        const material = createClass9Material('UN3481', 'A13.8', 'LITHIUM ION BATTERIES CONTAINED IN EQUIPMENT');
        const result = validateHazardClass(material, '9');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 4: UN3481 PACKED WITH - validates hazard class 9 correctly', () => {
        const material = createClass9Material('UN3481', 'A13.9', 'LITHIUM ION BATTERIES PACKED WITH EQUIPMENT');
        const result = validateHazardClass(material, '9');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 5: UN3090 - validates hazard class 9 correctly', () => {
        const material = createClass9Material('UN3090', 'A13.7', 'LITHIUM METAL BATTERIES');
        const result = validateHazardClass(material, '9');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 6: UN3091 CONTAINED IN - validates hazard class 9 correctly', () => {
        const material = createClass9Material('UN3091', 'A13.8', 'LITHIUM METAL BATTERIES CONTAINED IN EQUIPMENT');
        const result = validateHazardClass(material, '9');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 7: UN3091 PACKED WITH - validates hazard class 9 correctly', () => {
        const material = createClass9Material('UN3091', 'A13.9', 'LITHIUM METAL BATTERIES PACKED WITH EQUIPMENT');
        const result = validateHazardClass(material, '9');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 8: UN3536 - validates hazard class 9 correctly', () => {
        const material = createClass9Material('UN3536', 'A13.8', 'LITHIUM BATTERIES INSTALLED IN CARGO TRANSPORT UNIT (lithium ion batteries)');
        const result = validateHazardClass(material, '9');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 9: UN1845 (Dry Ice) - validates hazard class 9 correctly', () => {
        const material = createClass9Material('UN1845', 'A13.10', 'CARBON DIOXIDE, SOLID');
        const result = validateHazardClass(material, '9');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 10: UN2807 (Magnetized Material) - validates hazard class 9 correctly', () => {
        const material = createClass9Material('UN2807', 'A13.11', 'MAGNETIZED MATERIAL');
        const result = validateHazardClass(material, '9');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 11: UN3166 - validates hazard class 9 correctly', () => {
        const material = createClass9Material('UN3166', 'A13.4', 'VEHICLE, FLAMMABLE LIQUID POWERED');
        const result = validateHazardClass(material, '9');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 12: UN3171 - validates hazard class 9 correctly', () => {
        const material = createClass9Material('UN3171', 'A13.6', 'BATTERY-POWERED VEHICLE');
        const result = validateHazardClass(material, '9');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 13: UN3077 - validates hazard class 9 correctly', () => {
        const material = createClass9Material('UN3077', 'A13.2', 'ENVIRONMENTALLY HAZARDOUS SUBSTANCE, SOLID, N.O.S. (Copper sulfate)', 'III');
        const result = validateHazardClass(material, '9');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 14: UN3082 - validates hazard class 9 correctly', () => {
        const material = createClass9Material('UN3082', 'A13.2', 'ENVIRONMENTALLY HAZARDOUS SUBSTANCE, LIQUID, N.O.S. (Tributyltin oxide)', 'III');
        const result = validateHazardClass(material, '9');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 15: UN2315 (PCBs liquid) - validates hazard class 9 correctly', () => {
        const material = createClass9Material('UN2315', 'A13.2', 'POLYCHLORINATED BIPHENYLS, LIQUID', 'II');
        const result = validateHazardClass(material, '9');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 16: UN3432 (PCBs solid) - validates hazard class 9 correctly', () => {
        const material = createClass9Material('UN3432', 'A13.2', 'POLYCHLORINATED BIPHENYLS, SOLID', 'II');
        const result = validateHazardClass(material, '9');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 17: UN3268 (Safety Devices) - validates hazard class 9 correctly', () => {
        const material = createClass9Material('UN3268', 'A13.15', 'SAFETY DEVICES, electrically initiated');
        const result = validateHazardClass(material, '9');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 18: UN2212 (Asbestos) - validates hazard class 9 correctly', () => {
        const material = createClass9Material('UN2212', 'A13.15', 'ASBESTOS, AMPHIBOLE (amosite)', 'II');
        const result = validateHazardClass(material, '9');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 19: UN3245 (GMOs) - validates hazard class 9 correctly', () => {
        const material = createClass9Material('UN3245', 'A10.8', 'GENETICALLY MODIFIED ORGANISMS');
        const result = validateHazardClass(material, '9');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 20: UN2990 (Life-saving appliances) - validates hazard class 9 correctly', () => {
        const material = createClass9Material('UN2990', 'A13.12', 'LIFE-SAVING APPLIANCES, SELF INFLATING');
        const result = validateHazardClass(material, '9');
        expect(result.isValid).toBe(true);
      });
    });

    describe('Negative Cases - Class 9 has NO Divisions', () => {
      test('Scenario 1, Alteration 1: rejects 9.1 (Class 9 has no divisions)', () => {
        const material = createClass9Material('UN3480', 'A13.7', 'LITHIUM ION BATTERIES');
        const result = validateHazardClass(material, '9.1');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('9');
      });

      test('Scenario 8, Alteration 2: rejects 9.2 (Class 9 has no divisions)', () => {
        const material = createClass9Material('UN3536', 'A13.8', 'LITHIUM BATTERIES INSTALLED IN CARGO TRANSPORT UNIT');
        const result = validateHazardClass(material, '9.2');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('9');
      });

      test('Scenario 10: rejects 9.3 (Class 9 has no divisions)', () => {
        const material = createClass9Material('UN2807', 'A13.11', 'MAGNETIZED MATERIAL');
        const result = validateHazardClass(material, '9.3');
        expect(result.isValid).toBe(false);
      });

      test('rejects any division number for Class 9', () => {
        const material = createClass9Material('UN1845', 'A13.10', 'CARBON DIOXIDE, SOLID');
        ['9.1', '9.2', '9.3', '9.4', '9.5', '9.6'].forEach((invalidClass) => {
          const result = validateHazardClass(material, invalidClass);
          expect(result.isValid).toBe(false);
        });
      });

      test('Scenario 19, Alteration 3: rejects 6.2 (GMOs are Class 9, not 6.2)', () => {
        const material = createClass9Material('UN3245', 'A10.8', 'GENETICALLY MODIFIED ORGANISMS');
        const result = validateHazardClass(material, '6.2');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('9');
      });
    });
  });

  describe('Key 15: Packing Group Validation', () => {
    describe('Materials WITHOUT Packing Group (Key 15 must be empty)', () => {
      const noPGMaterials = [
        { un: 'UN3480', para: 'A13.7', name: 'LITHIUM ION BATTERIES' },
        { un: 'UN3481', para: 'A13.8', name: 'LITHIUM ION BATTERIES CONTAINED IN EQUIPMENT' },
        { un: 'UN3090', para: 'A13.7', name: 'LITHIUM METAL BATTERIES' },
        { un: 'UN3091', para: 'A13.8', name: 'LITHIUM METAL BATTERIES CONTAINED IN EQUIPMENT' },
        { un: 'UN1845', para: 'A13.10', name: 'CARBON DIOXIDE, SOLID' },
        { un: 'UN2807', para: 'A13.11', name: 'MAGNETIZED MATERIAL' },
        { un: 'UN3166', para: 'A13.4', name: 'VEHICLE, FLAMMABLE LIQUID POWERED' },
        { un: 'UN3171', para: 'A13.6', name: 'BATTERY-POWERED VEHICLE' },
        { un: 'UN3268', para: 'A13.15', name: 'SAFETY DEVICES, electrically initiated' },
        { un: 'UN2990', para: 'A13.12', name: 'LIFE-SAVING APPLIANCES, SELF INFLATING' },
        { un: 'UN3245', para: 'A10.8', name: 'GENETICALLY MODIFIED ORGANISMS' },
        { un: 'UN3536', para: 'A13.8', name: 'LITHIUM BATTERIES INSTALLED IN CARGO TRANSPORT UNIT' },
      ];

      noPGMaterials.forEach(({ un, para, name }) => {
        test(`${un} (${name.substring(0, 30)}...) - accepts empty Key 15`, () => {
          const material = createClass9Material(un, para, name);
          const result = validatePackingGroup(material, '');
          expect(result.isValid).toBe(true);
        });
      });

      describe('Negative Cases - Reject populated Key 15 for no-PG materials', () => {
        test('Scenario 1, Alteration 2: rejects Key 15 = "II" for UN3480 lithium batteries', () => {
          const material = createClass9Material('UN3480', 'A13.7', 'LITHIUM ION BATTERIES');
          const result = validatePackingGroup(material, 'II');
          expect(result.isValid).toBe(false);
        });

        test('Scenario 9, Alteration 2: rejects Key 15 = "III" for UN1845 dry ice', () => {
          const material = createClass9Material('UN1845', 'A13.10', 'CARBON DIOXIDE, SOLID');
          const result = validatePackingGroup(material, 'III');
          expect(result.isValid).toBe(false);
        });

        test('Scenario 11, Alteration 2: rejects Key 15 = "III" for UN3166 vehicle', () => {
          const material = createClass9Material('UN3166', 'A13.4', 'VEHICLE, FLAMMABLE LIQUID POWERED');
          const result = validatePackingGroup(material, 'III');
          expect(result.isValid).toBe(false);
        });

        test('Scenario 17, Alteration 1: rejects Key 15 = "II" for UN3268 safety devices', () => {
          const material = createClass9Material('UN3268', 'A13.15', 'SAFETY DEVICES, electrically initiated');
          const result = validatePackingGroup(material, 'II');
          expect(result.isValid).toBe(false);
        });

        test('Scenario 19, Alteration 2: rejects Key 15 = "III" for UN3245 GMOs', () => {
          const material = createClass9Material('UN3245', 'A10.8', 'GENETICALLY MODIFIED ORGANISMS');
          const result = validatePackingGroup(material, 'III');
          expect(result.isValid).toBe(false);
        });
      });
    });

    describe('Materials WITH Packing Group (Key 15 required)', () => {
      describe('Packing Group III Materials', () => {
        test('Scenario 13: UN3077 - accepts Key 15 = "III"', () => {
          const material = createClass9Material('UN3077', 'A13.2', 'ENVIRONMENTALLY HAZARDOUS SUBSTANCE, SOLID, N.O.S.', 'III');
          const result = validatePackingGroup(material, 'III');
          expect(result.isValid).toBe(true);
        });

        test('Scenario 14: UN3082 - accepts Key 15 = "III"', () => {
          const material = createClass9Material('UN3082', 'A13.2', 'ENVIRONMENTALLY HAZARDOUS SUBSTANCE, LIQUID, N.O.S.', 'III');
          const result = validatePackingGroup(material, 'III');
          expect(result.isValid).toBe(true);
        });

        test('Scenario 13, Alteration 2: rejects empty Key 15 for UN3077', () => {
          const material = createClass9Material('UN3077', 'A13.2', 'ENVIRONMENTALLY HAZARDOUS SUBSTANCE, SOLID, N.O.S.', 'III');
          const result = validatePackingGroup(material, '');
          expect(result.isValid).toBe(false);
        });

        test('Scenario 14, Alteration: rejects empty Key 15 for UN3082', () => {
          const material = createClass9Material('UN3082', 'A13.2', 'ENVIRONMENTALLY HAZARDOUS SUBSTANCE, LIQUID, N.O.S.', 'III');
          const result = validatePackingGroup(material, '');
          expect(result.isValid).toBe(false);
        });
      });

      describe('Packing Group II Materials', () => {
        test('Scenario 15: UN2315 (PCBs liquid) - accepts Key 15 = "II"', () => {
          const material = createClass9Material('UN2315', 'A13.2', 'POLYCHLORINATED BIPHENYLS, LIQUID', 'II');
          const result = validatePackingGroup(material, 'II');
          expect(result.isValid).toBe(true);
        });

        test('Scenario 16: UN3432 (PCBs solid) - accepts Key 15 = "II"', () => {
          const material = createClass9Material('UN3432', 'A13.2', 'POLYCHLORINATED BIPHENYLS, SOLID', 'II');
          const result = validatePackingGroup(material, 'II');
          expect(result.isValid).toBe(true);
        });

        test('Scenario 18: UN2212 (Asbestos) - accepts Key 15 = "II"', () => {
          const material = createClass9Material('UN2212', 'A13.15', 'ASBESTOS, AMPHIBOLE (amosite)', 'II');
          const result = validatePackingGroup(material, 'II');
          expect(result.isValid).toBe(true);
        });

        test('Scenario 15, Alteration 1: rejects Key 15 = "III" when "II" expected for UN2315', () => {
          const material = createClass9Material('UN2315', 'A13.2', 'POLYCHLORINATED BIPHENYLS, LIQUID', 'II');
          const result = validatePackingGroup(material, 'III');
          expect(result.isValid).toBe(false);
        });

        test('Scenario 18, Alteration 2: rejects Key 15 = "III" when "II" expected for UN2212', () => {
          const material = createClass9Material('UN2212', 'A13.15', 'ASBESTOS, AMPHIBOLE (amosite)', 'II');
          const result = validatePackingGroup(material, 'III');
          expect(result.isValid).toBe(false);
        });
      });
    });
  });

  describe('Key 17: Packaging Instruction Validation', () => {
    describe('Lithium Battery Packaging Instructions', () => {
      test('Scenario 1: UN3480 standalone - validates A13.7 correctly', () => {
        const material = createClass9Material('UN3480', 'A13.7', 'LITHIUM ION BATTERIES');
        const result = validatePackingInstruction(material, 'A13.7');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 3: UN3481 CONTAINED IN - validates A13.8 correctly', () => {
        const material = createClass9Material('UN3481', 'A13.8', 'LITHIUM ION BATTERIES CONTAINED IN EQUIPMENT');
        const result = validatePackingInstruction(material, 'A13.8');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 4: UN3481 PACKED WITH - validates A13.9 correctly', () => {
        const material = createClass9Material('UN3481', 'A13.9', 'LITHIUM ION BATTERIES PACKED WITH EQUIPMENT');
        const result = validatePackingInstruction(material, 'A13.9');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 5: UN3090 standalone - validates A13.7 correctly', () => {
        const material = createClass9Material('UN3090', 'A13.7', 'LITHIUM METAL BATTERIES');
        const result = validatePackingInstruction(material, 'A13.7');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 6: UN3091 CONTAINED IN - validates A13.8 correctly', () => {
        const material = createClass9Material('UN3091', 'A13.8', 'LITHIUM METAL BATTERIES CONTAINED IN EQUIPMENT');
        const result = validatePackingInstruction(material, 'A13.8');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 7: UN3091 PACKED WITH - validates A13.9 correctly', () => {
        const material = createClass9Material('UN3091', 'A13.9', 'LITHIUM METAL BATTERIES PACKED WITH EQUIPMENT');
        const result = validatePackingInstruction(material, 'A13.9');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 8: UN3536 - validates A13.8 correctly', () => {
        const material = createClass9Material('UN3536', 'A13.8', 'LITHIUM BATTERIES INSTALLED IN CARGO TRANSPORT UNIT');
        const result = validatePackingInstruction(material, 'A13.8');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 3, Alteration 2: rejects A13.7 when A13.8 expected for CONTAINED IN', () => {
        const material = createClass9Material('UN3481', 'A13.8', 'LITHIUM ION BATTERIES CONTAINED IN EQUIPMENT');
        const result = validatePackingInstruction(material, 'A13.7');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('A13.8');
      });

      test('Scenario 4, Alteration 1: rejects A13.8 when A13.9 expected for PACKED WITH', () => {
        const material = createClass9Material('UN3481', 'A13.9', 'LITHIUM ION BATTERIES PACKED WITH EQUIPMENT');
        const result = validatePackingInstruction(material, 'A13.8');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('A13.9');
      });

      test('Scenario 7, Alteration 1: rejects A13.8 when A13.9 expected for PACKED WITH', () => {
        const material = createClass9Material('UN3091', 'A13.9', 'LITHIUM METAL BATTERIES PACKED WITH EQUIPMENT');
        const result = validatePackingInstruction(material, 'A13.8');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('A13.9');
      });
    });

    describe('Other Class 9 Packaging Instructions', () => {
      test('Scenario 9: UN1845 (Dry Ice) - validates A13.10 correctly', () => {
        const material = createClass9Material('UN1845', 'A13.10', 'CARBON DIOXIDE, SOLID');
        const result = validatePackingInstruction(material, 'A13.10');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 10: UN2807 (Magnetized Material) - validates A13.11 correctly', () => {
        const material = createClass9Material('UN2807', 'A13.11', 'MAGNETIZED MATERIAL');
        const result = validatePackingInstruction(material, 'A13.11');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 11: UN3166 - validates A13.4 correctly', () => {
        const material = createClass9Material('UN3166', 'A13.4', 'VEHICLE, FLAMMABLE LIQUID POWERED');
        const result = validatePackingInstruction(material, 'A13.4');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 12: UN3171 - validates A13.6 correctly', () => {
        const material = createClass9Material('UN3171', 'A13.6', 'BATTERY-POWERED VEHICLE');
        const result = validatePackingInstruction(material, 'A13.6');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 13-14: UN3077/UN3082 - validates A13.2 correctly', () => {
        const materials = [
          createClass9Material('UN3077', 'A13.2', 'ENVIRONMENTALLY HAZARDOUS SUBSTANCE, SOLID, N.O.S.', 'III'),
          createClass9Material('UN3082', 'A13.2', 'ENVIRONMENTALLY HAZARDOUS SUBSTANCE, LIQUID, N.O.S.', 'III'),
        ];
        materials.forEach((material) => {
          const result = validatePackingInstruction(material, 'A13.2');
          expect(result.isValid).toBe(true);
        });
      });

      test('Scenario 15-16: UN2315/UN3432 (PCBs) - validates A13.2 correctly', () => {
        const materials = [
          createClass9Material('UN2315', 'A13.2', 'POLYCHLORINATED BIPHENYLS, LIQUID', 'II'),
          createClass9Material('UN3432', 'A13.2', 'POLYCHLORINATED BIPHENYLS, SOLID', 'II'),
        ];
        materials.forEach((material) => {
          const result = validatePackingInstruction(material, 'A13.2');
          expect(result.isValid).toBe(true);
        });
      });

      test('Scenario 17: UN3268 (Safety Devices) - validates A13.15 correctly', () => {
        const material = createClass9Material('UN3268', 'A13.15', 'SAFETY DEVICES, electrically initiated');
        const result = validatePackingInstruction(material, 'A13.15');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 18: UN2212 (Asbestos) - validates A13.15 correctly', () => {
        const material = createClass9Material('UN2212', 'A13.15', 'ASBESTOS, AMPHIBOLE (amosite)', 'II');
        const result = validatePackingInstruction(material, 'A13.15');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 19: UN3245 (GMOs) - validates A10.8 correctly', () => {
        const material = createClass9Material('UN3245', 'A10.8', 'GENETICALLY MODIFIED ORGANISMS');
        const result = validatePackingInstruction(material, 'A10.8');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 20: UN2990 (Life-saving appliances) - validates A13.12 correctly', () => {
        const material = createClass9Material('UN2990', 'A13.12', 'LIFE-SAVING APPLIANCES, SELF INFLATING');
        const result = validatePackingInstruction(material, 'A13.12');
        expect(result.isValid).toBe(true);
      });
    });

    describe('Negative Cases - From Alterations', () => {
      test('Scenario 12, Alteration 1: rejects A13.4 when A13.6 expected for battery-powered vehicle', () => {
        const material = createClass9Material('UN3171', 'A13.6', 'BATTERY-POWERED VEHICLE');
        const result = validatePackingInstruction(material, 'A13.4');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('A13.6');
      });

      test('Scenario 17, Alteration 2: rejects A5.15 when A13.15 expected (wrong class prefix)', () => {
        const material = createClass9Material('UN3268', 'A13.15', 'SAFETY DEVICES, electrically initiated');
        const result = validatePackingInstruction(material, 'A5.15');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('A13.15');
      });

      test('Scenario 19, Alteration 1: rejects A13.xx when A10.8 expected for GMOs', () => {
        const material = createClass9Material('UN3245', 'A10.8', 'GENETICALLY MODIFIED ORGANISMS');
        const result = validatePackingInstruction(material, 'A13.8');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('A10.8');
      });

      test('Scenario 20, Alteration 3: rejects A13.4 when A13.12 expected for life-saving appliances', () => {
        const material = createClass9Material('UN2990', 'A13.12', 'LIFE-SAVING APPLIANCES, SELF INFLATING');
        const result = validatePackingInstruction(material, 'A13.4');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('A13.12');
      });
    });

    describe('Normalization', () => {
      test('handles trailing period in paragraph reference', () => {
        const material = createClass9Material('UN3480', 'A13.7.', 'LITHIUM ION BATTERIES');
        const result = validatePackingInstruction(material, 'A13.7');
        expect(result.isValid).toBe(true);
      });

      test('handles case variations', () => {
        const material = createClass9Material('UN3480', 'A13.7', 'LITHIUM ION BATTERIES');
        const result = validatePackingInstruction(material, 'a13.7');
        expect(result.isValid).toBe(true);
      });
    });
  });

  describe('Key 14: Subsidiary Risk Validation', () => {
    describe('Positive Cases - No Subsidiary Risk (Most Class 9 materials)', () => {
      test('Scenario 1: UN3480 - validates empty subsidiary risk correctly', () => {
        const material = createClass9Material('UN3480', 'A13.7', 'LITHIUM ION BATTERIES');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 9: UN1845 - validates empty subsidiary risk correctly', () => {
        const material = createClass9Material('UN1845', 'A13.10', 'CARBON DIOXIDE, SOLID');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 10: UN2807 - validates empty subsidiary risk correctly', () => {
        const material = createClass9Material('UN2807', 'A13.11', 'MAGNETIZED MATERIAL');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 13: UN3077 - validates empty subsidiary risk correctly', () => {
        const material = createClass9Material('UN3077', 'A13.2', 'ENVIRONMENTALLY HAZARDOUS SUBSTANCE, SOLID, N.O.S.', 'III');
        const result = validateSubsidiaryRisk(material, '');
        expect(result.isValid).toBe(true);
      });

      test('All 20 scenarios have no subsidiary risk', () => {
        const materials = [
          createClass9Material('UN3480', 'A13.7', 'LITHIUM ION BATTERIES'),
          createClass9Material('UN3481', 'A13.8', 'LITHIUM ION BATTERIES CONTAINED IN EQUIPMENT'),
          createClass9Material('UN3090', 'A13.7', 'LITHIUM METAL BATTERIES'),
          createClass9Material('UN3091', 'A13.8', 'LITHIUM METAL BATTERIES CONTAINED IN EQUIPMENT'),
          createClass9Material('UN1845', 'A13.10', 'CARBON DIOXIDE, SOLID'),
          createClass9Material('UN2807', 'A13.11', 'MAGNETIZED MATERIAL'),
          createClass9Material('UN3166', 'A13.4', 'VEHICLE, FLAMMABLE LIQUID POWERED'),
          createClass9Material('UN3171', 'A13.6', 'BATTERY-POWERED VEHICLE'),
          createClass9Material('UN3077', 'A13.2', 'ENVIRONMENTALLY HAZARDOUS SUBSTANCE, SOLID, N.O.S.', 'III'),
          createClass9Material('UN3082', 'A13.2', 'ENVIRONMENTALLY HAZARDOUS SUBSTANCE, LIQUID, N.O.S.', 'III'),
        ];

        materials.forEach((material) => {
          const result = validateSubsidiaryRisk(material, '');
          expect(result.isValid).toBe(true);
        });
      });
    });
  });
});
