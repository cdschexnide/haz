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

// Helper to create minimal HazardousMaterialItem for Class 9 testing
function createClass9Material(
  unid: string,
  packagingParagraph: string,
  properShippingName: string,
  packingGroup: string = '', // VARIES for Class 9
  subsidiaryRisk: string = '',
  specialProvision: string = ''
): HazardousMaterialItem {
  return {
    unid,
    hazclassDiv: '9', // Class 9 has NO divisions
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

describe('SDDG Validation - Class 9 Miscellaneous Dangerous Goods', () => {
  describe('Key 7: Aircraft Type Validation', () => {
    describe('Positive Cases - Passenger and Cargo Aircraft (P5)', () => {
      test('Scenario 1: UN3480 - validates Passenger and Cargo with P5 special provision', () => {
        const material = createClass9Material(
          'UN3480', 'A13.7', 'LITHIUM ION BATTERIES', '', '', 'P5'
        );
        const result = validateAircraftType(material, 'PASSENGER AND CARGO AIRCRAFT');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 2: UN3480 Section II - validates Passenger and Cargo with P5', () => {
        const material = createClass9Material(
          'UN3480', 'A13.7', 'LITHIUM ION BATTERIES', '', '', 'P5'
        );
        const result = validateAircraftType(material, 'PASSENGER AND CARGO AIRCRAFT');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 3: UN3481 CONTAINED IN - validates Passenger and Cargo with P5', () => {
        const material = createClass9Material(
          'UN3481', 'A13.8', 'LITHIUM ION BATTERIES CONTAINED IN EQUIPMENT', '', '', 'P5'
        );
        const result = validateAircraftType(material, 'PASSENGER AND CARGO AIRCRAFT');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 4: UN3481 PACKED WITH - validates Passenger and Cargo with P5', () => {
        const material = createClass9Material(
          'UN3481', 'A13.9', 'LITHIUM ION BATTERIES PACKED WITH EQUIPMENT', '', '', 'P5'
        );
        const result = validateAircraftType(material, 'PASSENGER AND CARGO AIRCRAFT');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 8: UN3536 - validates Passenger and Cargo with P5', () => {
        const material = createClass9Material(
          'UN3536', 'A13.8', 'LITHIUM BATTERIES INSTALLED IN CARGO TRANSPORT UNIT', '', '', 'P5'
        );
        const result = validateAircraftType(material, 'PASSENGER AND CARGO AIRCRAFT');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 9: UN1845 (Dry Ice) - validates Passenger and Cargo with P5', () => {
        const material = createClass9Material(
          'UN1845', 'A13.10', 'CARBON DIOXIDE, SOLID', '', '', 'P5'
        );
        const result = validateAircraftType(material, 'PASSENGER AND CARGO AIRCRAFT');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 10: UN2807 (Magnetized Material) - validates Passenger and Cargo with P5', () => {
        const material = createClass9Material(
          'UN2807', 'A13.11', 'MAGNETIZED MATERIAL', '', '', 'P5'
        );
        const result = validateAircraftType(material, 'PASSENGER AND CARGO AIRCRAFT');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 11: UN3166 - validates Passenger and Cargo with P5', () => {
        const material = createClass9Material(
          'UN3166', 'A13.4', 'VEHICLE, FLAMMABLE LIQUID POWERED', '', '', 'P5'
        );
        const result = validateAircraftType(material, 'PASSENGER AND CARGO AIRCRAFT');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 12: UN3171 - validates Passenger and Cargo with P5', () => {
        const material = createClass9Material(
          'UN3171', 'A13.6', 'BATTERY-POWERED VEHICLE', '', '', 'P5'
        );
        const result = validateAircraftType(material, 'PASSENGER AND CARGO AIRCRAFT');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 13: UN3077 - validates Passenger and Cargo with P5', () => {
        const material = createClass9Material(
          'UN3077', 'A13.2', 'ENVIRONMENTALLY HAZARDOUS SUBSTANCE, SOLID, N.O.S.', 'III', '', 'P5'
        );
        const result = validateAircraftType(material, 'PASSENGER AND CARGO AIRCRAFT');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 14: UN3082 - validates Passenger and Cargo with P5', () => {
        const material = createClass9Material(
          'UN3082', 'A13.2', 'ENVIRONMENTALLY HAZARDOUS SUBSTANCE, LIQUID, N.O.S.', 'III', '', 'P5'
        );
        const result = validateAircraftType(material, 'PASSENGER AND CARGO AIRCRAFT');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 15: UN2315 (PCBs liquid) - validates Passenger and Cargo with P5', () => {
        const material = createClass9Material(
          'UN2315', 'A13.2', 'POLYCHLORINATED BIPHENYLS, LIQUID', 'II', '', 'P5'
        );
        const result = validateAircraftType(material, 'PASSENGER AND CARGO AIRCRAFT');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 16: UN3432 (PCBs solid) - validates Passenger and Cargo with P5', () => {
        const material = createClass9Material(
          'UN3432', 'A13.2', 'POLYCHLORINATED BIPHENYLS, SOLID', 'II', '', 'P5'
        );
        const result = validateAircraftType(material, 'PASSENGER AND CARGO AIRCRAFT');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 17: UN3268 (Safety Devices) - validates Passenger and Cargo with P5', () => {
        const material = createClass9Material(
          'UN3268', 'A13.15', 'SAFETY DEVICES, electrically initiated', '', '', 'P5'
        );
        const result = validateAircraftType(material, 'PASSENGER AND CARGO AIRCRAFT');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 18: UN2212 (Asbestos) - validates Passenger and Cargo with P5', () => {
        const material = createClass9Material(
          'UN2212', 'A13.15', 'ASBESTOS, AMPHIBOLE (amosite)', 'II', '', 'P5'
        );
        const result = validateAircraftType(material, 'PASSENGER AND CARGO AIRCRAFT');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 19: UN3245 (GMOs) - validates Passenger and Cargo with P5', () => {
        const material = createClass9Material(
          'UN3245', 'A10.8', 'GENETICALLY MODIFIED ORGANISMS', '', '', 'P5'
        );
        const result = validateAircraftType(material, 'PASSENGER AND CARGO AIRCRAFT');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 20: UN2990 (Life-saving appliances) - validates Passenger and Cargo with P5', () => {
        const material = createClass9Material(
          'UN2990', 'A13.12', 'LIFE-SAVING APPLIANCES, SELF INFLATING', '', '', 'P5'
        );
        const result = validateAircraftType(material, 'PASSENGER AND CARGO AIRCRAFT');
        expect(result.isValid).toBe(true);
      });
    });

    describe('Positive Cases - Cargo Aircraft Only (P4 - Lithium Metal Batteries)', () => {
      test('Scenario 5: UN3090 - validates CAO with P4 special provision', () => {
        const material = createClass9Material(
          'UN3090', 'A13.7', 'LITHIUM METAL BATTERIES', '', '', 'P4'
        );
        const result = validateAircraftType(material, 'CARGO AIRCRAFT ONLY');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 6: UN3091 CONTAINED IN - validates CAO with P4', () => {
        const material = createClass9Material(
          'UN3091', 'A13.8', 'LITHIUM METAL BATTERIES CONTAINED IN EQUIPMENT', '', '', 'P4'
        );
        const result = validateAircraftType(material, 'CARGO AIRCRAFT ONLY');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 7: UN3091 PACKED WITH - validates CAO with P4', () => {
        const material = createClass9Material(
          'UN3091', 'A13.9', 'LITHIUM METAL BATTERIES PACKED WITH EQUIPMENT', '', '', 'P4'
        );
        const result = validateAircraftType(material, 'CARGO AIRCRAFT ONLY');
        expect(result.isValid).toBe(true);
      });
    });

    describe('Negative Cases - From Alterations', () => {
      test('Scenario 5, Alteration 1: rejects Passenger and Cargo when P4 requires CAO', () => {
        const material = createClass9Material(
          'UN3090', 'A13.7', 'LITHIUM METAL BATTERIES', '', '', 'P4'
        );
        const result = validateAircraftType(material, 'PASSENGER AND CARGO AIRCRAFT');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('CARGO AIRCRAFT ONLY');
      });

      test('Scenario 6: rejects Passenger and Cargo when P4 requires CAO for UN3091', () => {
        const material = createClass9Material(
          'UN3091', 'A13.8', 'LITHIUM METAL BATTERIES CONTAINED IN EQUIPMENT', '', '', 'P4'
        );
        const result = validateAircraftType(material, 'PASSENGER AND CARGO AIRCRAFT');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('CARGO AIRCRAFT ONLY');
      });

      test('Scenario 7, Alteration 3: rejects Passenger and Cargo for P4 PACKED WITH configuration', () => {
        const material = createClass9Material(
          'UN3091', 'A13.9', 'LITHIUM METAL BATTERIES PACKED WITH EQUIPMENT', '', '', 'P4'
        );
        const result = validateAircraftType(material, 'PASSENGER AND CARGO AIRCRAFT');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('CARGO AIRCRAFT ONLY');
      });

      test('P5 materials reject CAO when Passenger and Cargo is expected', () => {
        const material = createClass9Material(
          'UN3480', 'A13.7', 'LITHIUM ION BATTERIES', '', '', 'P5'
        );
        const result = validateAircraftType(material, 'CARGO AIRCRAFT ONLY');
        expect(result.isValid).toBe(false);
      });
    });
  });

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

  describe('Key 11: UN/ID Number Validation', () => {
    describe('Positive Cases - Matching UN Numbers', () => {
      test('Scenario 1: UN3480 - validates UN number correctly', () => {
        const material = createClass9Material('UN3480', 'A13.7', 'LITHIUM ION BATTERIES');
        const result = validateUnidNumber(material, 'UN3480');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 3: UN3481 - validates UN number correctly', () => {
        const material = createClass9Material('UN3481', 'A13.8', 'LITHIUM ION BATTERIES CONTAINED IN EQUIPMENT');
        const result = validateUnidNumber(material, 'UN3481');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 5: UN3090 - validates UN number correctly', () => {
        const material = createClass9Material('UN3090', 'A13.7', 'LITHIUM METAL BATTERIES');
        const result = validateUnidNumber(material, 'UN3090');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 6: UN3091 - validates UN number correctly', () => {
        const material = createClass9Material('UN3091', 'A13.8', 'LITHIUM METAL BATTERIES CONTAINED IN EQUIPMENT');
        const result = validateUnidNumber(material, 'UN3091');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 8: UN3536 - validates UN number correctly', () => {
        const material = createClass9Material('UN3536', 'A13.8', 'LITHIUM BATTERIES INSTALLED IN CARGO TRANSPORT UNIT');
        const result = validateUnidNumber(material, 'UN3536');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 9: UN1845 - validates UN number correctly', () => {
        const material = createClass9Material('UN1845', 'A13.10', 'CARBON DIOXIDE, SOLID');
        const result = validateUnidNumber(material, 'UN1845');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 10: UN2807 - validates UN number correctly', () => {
        const material = createClass9Material('UN2807', 'A13.11', 'MAGNETIZED MATERIAL');
        const result = validateUnidNumber(material, 'UN2807');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 11: UN3166 - validates UN number correctly', () => {
        const material = createClass9Material('UN3166', 'A13.4', 'VEHICLE, FLAMMABLE LIQUID POWERED');
        const result = validateUnidNumber(material, 'UN3166');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 12: UN3171 - validates UN number correctly', () => {
        const material = createClass9Material('UN3171', 'A13.6', 'BATTERY-POWERED VEHICLE');
        const result = validateUnidNumber(material, 'UN3171');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 13: UN3077 - validates UN number correctly', () => {
        const material = createClass9Material('UN3077', 'A13.2', 'ENVIRONMENTALLY HAZARDOUS SUBSTANCE, SOLID, N.O.S.', 'III');
        const result = validateUnidNumber(material, 'UN3077');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 14: UN3082 - validates UN number correctly', () => {
        const material = createClass9Material('UN3082', 'A13.2', 'ENVIRONMENTALLY HAZARDOUS SUBSTANCE, LIQUID, N.O.S.', 'III');
        const result = validateUnidNumber(material, 'UN3082');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 15: UN2315 - validates UN number correctly', () => {
        const material = createClass9Material('UN2315', 'A13.2', 'POLYCHLORINATED BIPHENYLS, LIQUID', 'II');
        const result = validateUnidNumber(material, 'UN2315');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 16: UN3432 - validates UN number correctly', () => {
        const material = createClass9Material('UN3432', 'A13.2', 'POLYCHLORINATED BIPHENYLS, SOLID', 'II');
        const result = validateUnidNumber(material, 'UN3432');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 17: UN3268 - validates UN number correctly', () => {
        const material = createClass9Material('UN3268', 'A13.15', 'SAFETY DEVICES, electrically initiated');
        const result = validateUnidNumber(material, 'UN3268');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 18: UN2212 - validates UN number correctly', () => {
        const material = createClass9Material('UN2212', 'A13.15', 'ASBESTOS, AMPHIBOLE (amosite)', 'II');
        const result = validateUnidNumber(material, 'UN2212');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 19: UN3245 - validates UN number correctly', () => {
        const material = createClass9Material('UN3245', 'A10.8', 'GENETICALLY MODIFIED ORGANISMS');
        const result = validateUnidNumber(material, 'UN3245');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 20: UN2990 - validates UN number correctly', () => {
        const material = createClass9Material('UN2990', 'A13.12', 'LIFE-SAVING APPLIANCES, SELF INFLATING');
        const result = validateUnidNumber(material, 'UN2990');
        expect(result.isValid).toBe(true);
      });

      test('handles lowercase UN prefix', () => {
        const material = createClass9Material('UN3480', 'A13.7', 'LITHIUM ION BATTERIES');
        const result = validateUnidNumber(material, 'un3480');
        expect(result.isValid).toBe(true);
      });
    });

    describe('Negative Cases - From Alterations', () => {
      test('Scenario 3, Alteration 3: rejects UN3480 when UN3481 expected (equipment configuration)', () => {
        const material = createClass9Material('UN3481', 'A13.8', 'LITHIUM ION BATTERIES CONTAINED IN EQUIPMENT');
        const result = validateUnidNumber(material, 'UN3480');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('UN3481');
      });

      test('Scenario 6, Alteration 2: rejects UN3090 when UN3091 expected (equipment configuration)', () => {
        const material = createClass9Material('UN3091', 'A13.8', 'LITHIUM METAL BATTERIES CONTAINED IN EQUIPMENT');
        const result = validateUnidNumber(material, 'UN3090');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('UN3091');
      });

      test('Scenario 8, Alteration 3: rejects UN3480 when UN3536 expected for cargo transport unit', () => {
        const material = createClass9Material('UN3536', 'A13.8', 'LITHIUM BATTERIES INSTALLED IN CARGO TRANSPORT UNIT');
        const result = validateUnidNumber(material, 'UN3480');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('UN3536');
      });

      test('Scenario 12, Alteration 2: rejects UN3166 when UN3171 expected for battery-powered vehicle', () => {
        const material = createClass9Material('UN3171', 'A13.6', 'BATTERY-POWERED VEHICLE');
        const result = validateUnidNumber(material, 'UN3166');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('UN3171');
      });

      test('Scenario 16, Alteration 1: rejects UN2315 when UN3432 expected (solid vs liquid PCBs)', () => {
        const material = createClass9Material('UN3432', 'A13.2', 'POLYCHLORINATED BIPHENYLS, SOLID', 'II');
        const result = validateUnidNumber(material, 'UN2315');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('UN3432');
      });

      test('Scenario 20, Alteration 1: rejects UN3072 when UN2990 expected', () => {
        const material = createClass9Material('UN2990', 'A13.12', 'LIFE-SAVING APPLIANCES, SELF INFLATING');
        const result = validateUnidNumber(material, 'UN3072');
        expect(result.isValid).toBe(false);
        expect(result.expected).toBe('UN2990');
      });

      test('rejects missing UN prefix', () => {
        const material = createClass9Material('UN3480', 'A13.7', 'LITHIUM ION BATTERIES');
        const result = validateUnidNumber(material, '3480');
        expect(result.isValid).toBe(false);
      });
    });
  });

  describe('Key 12: Proper Shipping Name Validation', () => {
    describe('Positive Cases - Matching PSN', () => {
      test('Scenario 1: UN3480 - validates PSN correctly', () => {
        const material = createClass9Material(
          'UN3480', 'A13.7',
          'LITHIUM ION BATTERIES (including lithium polymer batteries)'
        );
        const result = validateProperShippingName(
          material,
          'LITHIUM ION BATTERIES (including lithium polymer batteries)'
        );
        expect(result.isValid).toBe(true);
      });

      test('Scenario 3: UN3481 CONTAINED IN - validates PSN correctly', () => {
        const material = createClass9Material(
          'UN3481', 'A13.8',
          'LITHIUM ION BATTERIES CONTAINED IN EQUIPMENT (including lithium polymer batteries)'
        );
        const result = validateProperShippingName(
          material,
          'LITHIUM ION BATTERIES CONTAINED IN EQUIPMENT (including lithium polymer batteries)'
        );
        expect(result.isValid).toBe(true);
      });

      test('Scenario 4: UN3481 PACKED WITH - validates PSN correctly', () => {
        const material = createClass9Material(
          'UN3481', 'A13.9',
          'LITHIUM ION BATTERIES PACKED WITH EQUIPMENT (including lithium polymer batteries)'
        );
        const result = validateProperShippingName(
          material,
          'LITHIUM ION BATTERIES PACKED WITH EQUIPMENT (including lithium polymer batteries)'
        );
        expect(result.isValid).toBe(true);
      });

      test('Scenario 5: UN3090 - validates PSN correctly', () => {
        const material = createClass9Material(
          'UN3090', 'A13.7',
          'LITHIUM METAL BATTERIES (including lithium alloy batteries)'
        );
        const result = validateProperShippingName(
          material,
          'LITHIUM METAL BATTERIES (including lithium alloy batteries)'
        );
        expect(result.isValid).toBe(true);
      });

      test('Scenario 9: UN1845 - validates PSN correctly', () => {
        const material = createClass9Material('UN1845', 'A13.10', 'CARBON DIOXIDE, SOLID');
        const result = validateProperShippingName(material, 'CARBON DIOXIDE, SOLID');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 9: UN1845 - rejects "DRY ICE" when "CARBON DIOXIDE, SOLID" expected', () => {
        const material = createClass9Material('UN1845', 'A13.10', 'CARBON DIOXIDE, SOLID');
        const result = validateProperShippingName(material, 'DRY ICE');
        // "DRY ICE" is a common name but not the official PSN per AFMAN 24-604
        expect(result.isValid).toBe(false);
      });

      test('Scenario 10: UN2807 - validates PSN correctly', () => {
        const material = createClass9Material('UN2807', 'A13.11', 'MAGNETIZED MATERIAL');
        const result = validateProperShippingName(material, 'MAGNETIZED MATERIAL');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 11: UN3166 - validates PSN correctly', () => {
        const material = createClass9Material('UN3166', 'A13.4', 'VEHICLE, FLAMMABLE LIQUID POWERED');
        const result = validateProperShippingName(material, 'VEHICLE, FLAMMABLE LIQUID POWERED');
        expect(result.isValid).toBe(true);
      });

      test('Scenario 12: UN3171 - validates PSN correctly', () => {
        const material = createClass9Material('UN3171', 'A13.6', 'BATTERY-POWERED VEHICLE');
        const result = validateProperShippingName(material, 'BATTERY-POWERED VEHICLE');
        expect(result.isValid).toBe(true);
      });

      test('handles case insensitivity', () => {
        const material = createClass9Material('UN3480', 'A13.7', 'LITHIUM ION BATTERIES');
        const result = validateProperShippingName(material, 'Lithium Ion Batteries');
        expect(result.isValid).toBe(true);
      });
    });

    describe('N.O.S. Technical Name Cases (Scenarios 13, 14)', () => {
      test('Scenario 13: validates N.O.S. PSN with technical name (Copper sulfate)', () => {
        const material = createClass9Material(
          'UN3077', 'A13.2',
          'ENVIRONMENTALLY HAZARDOUS SUBSTANCE, SOLID, N.O.S. (Copper sulfate)',
          'III'
        );
        const result = validateProperShippingName(
          material,
          'ENVIRONMENTALLY HAZARDOUS SUBSTANCE, SOLID, N.O.S. (Copper sulfate)'
        );
        expect(result.isValid).toBe(true);
      });

      test('Scenario 13, Alteration 1: rejects N.O.S. without technical name', () => {
        const material = createClass9Material(
          'UN3077', 'A13.2',
          'ENVIRONMENTALLY HAZARDOUS SUBSTANCE, SOLID, N.O.S. (Copper sulfate)',
          'III'
        );
        const result = validateProperShippingName(
          material,
          'ENVIRONMENTALLY HAZARDOUS SUBSTANCE, SOLID, N.O.S.'
        );
        expect(result.isValid).toBe(false);
      });

      test('Scenario 14: validates N.O.S. PSN with technical name (Tributyltin oxide)', () => {
        const material = createClass9Material(
          'UN3082', 'A13.2',
          'ENVIRONMENTALLY HAZARDOUS SUBSTANCE, LIQUID, N.O.S. (Tributyltin oxide)',
          'III'
        );
        const result = validateProperShippingName(
          material,
          'ENVIRONMENTALLY HAZARDOUS SUBSTANCE, LIQUID, N.O.S. (Tributyltin oxide)'
        );
        expect(result.isValid).toBe(true);
      });

      test('Scenario 18: validates ASBESTOS with type specification', () => {
        const material = createClass9Material(
          'UN2212', 'A13.15',
          'ASBESTOS, AMPHIBOLE (amosite)',
          'II'
        );
        const result = validateProperShippingName(
          material,
          'ASBESTOS, AMPHIBOLE (amosite)'
        );
        expect(result.isValid).toBe(true);
      });

      test('Scenario 18, Alteration 1: rejects ASBESTOS without amphibole type', () => {
        const material = createClass9Material(
          'UN2212', 'A13.15',
          'ASBESTOS, AMPHIBOLE (amosite)',
          'II'
        );
        const result = validateProperShippingName(material, 'ASBESTOS');
        expect(result.isValid).toBe(false);
      });
    });

    describe('Negative Cases - From Alterations', () => {
      test('Scenario 3, Alteration 1: rejects PSN missing "CONTAINED IN EQUIPMENT"', () => {
        const material = createClass9Material(
          'UN3481', 'A13.8',
          'LITHIUM ION BATTERIES CONTAINED IN EQUIPMENT'
        );
        const result = validateProperShippingName(material, 'LITHIUM ION BATTERIES');
        expect(result.isValid).toBe(false);
      });

      test('Scenario 4, Alteration 3: rejects "CONTAINED IN" when "PACKED WITH" expected', () => {
        const material = createClass9Material(
          'UN3481', 'A13.9',
          'LITHIUM ION BATTERIES PACKED WITH EQUIPMENT'
        );
        const result = validateProperShippingName(
          material,
          'LITHIUM ION BATTERIES CONTAINED IN EQUIPMENT'
        );
        expect(result.isValid).toBe(false);
      });

      test('Scenario 5, Alteration 3: rejects LITHIUM ION when LITHIUM METAL expected', () => {
        const material = createClass9Material(
          'UN3090', 'A13.7',
          'LITHIUM METAL BATTERIES'
        );
        const result = validateProperShippingName(material, 'LITHIUM ION BATTERIES');
        expect(result.isValid).toBe(false);
      });

      test('Scenario 8, Alteration 1: rejects generic "LITHIUM BATTERIES" without specifying type', () => {
        const material = createClass9Material(
          'UN3536', 'A13.8',
          'LITHIUM BATTERIES INSTALLED IN CARGO TRANSPORT UNIT (lithium ion batteries)'
        );
        const result = validateProperShippingName(
          material,
          'LITHIUM BATTERIES INSTALLED IN CARGO TRANSPORT UNIT'
        );
        expect(result.isValid).toBe(false);
      });

      test('Scenario 11, Alteration 1: rejects "VEHICLE" without power type specification', () => {
        const material = createClass9Material(
          'UN3166', 'A13.4',
          'VEHICLE, FLAMMABLE LIQUID POWERED'
        );
        const result = validateProperShippingName(material, 'VEHICLE');
        expect(result.isValid).toBe(false);
      });

      test('Scenario 12, Alteration 3: rejects "VEHICLE, FLAMMABLE LIQUID POWERED" when battery-powered expected', () => {
        const material = createClass9Material(
          'UN3171', 'A13.6',
          'BATTERY-POWERED VEHICLE'
        );
        const result = validateProperShippingName(
          material,
          'VEHICLE, FLAMMABLE LIQUID POWERED'
        );
        expect(result.isValid).toBe(false);
      });

      test('Scenario 15, Alteration 3: rejects abbreviated "PCB, LIQUID"', () => {
        const material = createClass9Material(
          'UN2315', 'A13.2',
          'POLYCHLORINATED BIPHENYLS, LIQUID',
          'II'
        );
        const result = validateProperShippingName(material, 'PCB, LIQUID');
        expect(result.isValid).toBe(false);
      });

      test('Scenario 16, Alteration 3: rejects "LIQUID" when "SOLID" expected for PCBs', () => {
        const material = createClass9Material(
          'UN3432', 'A13.2',
          'POLYCHLORINATED BIPHENYLS, SOLID',
          'II'
        );
        const result = validateProperShippingName(
          material,
          'POLYCHLORINATED BIPHENYLS, LIQUID'
        );
        expect(result.isValid).toBe(false);
      });

      test('Scenario 19: rejects "MICRO-ORGANISMS" when "ORGANISMS" expected', () => {
        const material = createClass9Material(
          'UN3245', 'A10.8',
          'GENETICALLY MODIFIED ORGANISMS'
        );
        const result = validateProperShippingName(material, 'GENETICALLY MODIFIED MICRO-ORGANISMS');
        // PSN must match exactly - MICRO-ORGANISMS is a different term
        expect(result.isValid).toBe(false);
      });

      test('Scenario 20, Alteration 2: rejects PSN missing "SELF INFLATING" qualifier', () => {
        const material = createClass9Material(
          'UN2990', 'A13.12',
          'LIFE-SAVING APPLIANCES, SELF INFLATING'
        );
        const result = validateProperShippingName(material, 'LIFE-SAVING APPLIANCES');
        expect(result.isValid).toBe(false);
      });
    });
  });

  describe('Unified validateSDDGInspection() Function', () => {
    describe('Scenario 1: UN3480 - Complete SDDG Validation (Lithium Ion Batteries)', () => {
      const material = createClass9Material(
        'UN3480', 'A13.7',
        'LITHIUM ION BATTERIES (including lithium polymer batteries)',
        '', '', 'P5'
      );

      test('validates successful SDDG with all correct values', () => {
        const content = createSDDGContent({
          aircraftType: 'PASSENGER AND CARGO AIRCRAFT',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN3480',
          properShippingName: 'LITHIUM ION BATTERIES (including lithium polymer batteries)',
          hazardClass: '9',
          subsidiaryRisk: '',
          packingGroup: '',
          packingInstruction: 'A13.7',
        });

        const results = validateSDDGInspection(content, material);
        const failures = results.filter(r => !r.isValid);

        expect(failures).toHaveLength(0);
      });

      test('Alteration 1: identifies Key 13 showing "9.1" instead of "9"', () => {
        const content = createSDDGContent({
          aircraftType: 'PASSENGER AND CARGO AIRCRAFT',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN3480',
          properShippingName: 'LITHIUM ION BATTERIES (including lithium polymer batteries)',
          hazardClass: '9.1',  // Class 9 has no divisions
          subsidiaryRisk: '',
          packingGroup: '',
          packingInstruction: 'A13.7',
        });

        const results = validateSDDGInspection(content, material);
        const hazardClassResult = results.find(r => r.key === 'hazardClass');

        expect(hazardClassResult?.isValid).toBe(false);
        expect(hazardClassResult?.expectedValue).toBe('9');
      });

      test('Alteration 2: identifies Key 15 populated with "II" when should be empty', () => {
        const content = createSDDGContent({
          aircraftType: 'PASSENGER AND CARGO AIRCRAFT',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN3480',
          properShippingName: 'LITHIUM ION BATTERIES (including lithium polymer batteries)',
          hazardClass: '9',
          subsidiaryRisk: '',
          packingGroup: 'II',  // Should be empty for lithium batteries
          packingInstruction: 'A13.7',
        });

        const results = validateSDDGInspection(content, material);
        const packingGroupResult = results.find(r => r.key === 'packingGroup');

        expect(packingGroupResult?.isValid).toBe(false);
      });
    });

    describe('Scenario 5: UN3090 - Lithium Metal Batteries with CAO (P4)', () => {
      const material = createClass9Material(
        'UN3090', 'A13.7',
        'LITHIUM METAL BATTERIES (including lithium alloy batteries)',
        '', '', 'P4'
      );

      test('validates successful SDDG with CAO aircraft type', () => {
        const content = createSDDGContent({
          aircraftType: 'CARGO AIRCRAFT ONLY',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN3090',
          properShippingName: 'LITHIUM METAL BATTERIES (including lithium alloy batteries)',
          hazardClass: '9',
          subsidiaryRisk: '',
          packingGroup: '',
          packingInstruction: 'A13.7',
        });

        const results = validateSDDGInspection(content, material);
        const failures = results.filter(r => !r.isValid);

        expect(failures).toHaveLength(0);
      });

      test('Alteration 1: identifies Key 7 showing Passenger when P4 requires CAO', () => {
        const content = createSDDGContent({
          aircraftType: 'PASSENGER AND CARGO AIRCRAFT',  // Wrong - P4 requires CAO
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN3090',
          properShippingName: 'LITHIUM METAL BATTERIES (including lithium alloy batteries)',
          hazardClass: '9',
          subsidiaryRisk: '',
          packingGroup: '',
          packingInstruction: 'A13.7',
        });

        const results = validateSDDGInspection(content, material);
        const aircraftResult = results.find(r => r.key === 'aircraftType');

        expect(aircraftResult?.isValid).toBe(false);
        expect(aircraftResult?.expectedValue).toBe('CARGO AIRCRAFT ONLY');
      });
    });

    describe('Scenario 9: UN1845 - Carbon Dioxide, Solid (Dry Ice)', () => {
      const material = createClass9Material(
        'UN1845', 'A13.10', 'CARBON DIOXIDE, SOLID', '', '', 'P5'
      );

      test('validates successful SDDG with all correct values', () => {
        const content = createSDDGContent({
          aircraftType: 'PASSENGER AND CARGO AIRCRAFT',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN1845',
          properShippingName: 'CARBON DIOXIDE, SOLID',
          hazardClass: '9',
          subsidiaryRisk: '',
          packingGroup: '',
          packingInstruction: 'A13.10',
          quantityAndPacking: '1 Fiberboard box (4G) x 10 kg',  // Required for dry ice - must match A13.10 packaging codes
        });

        const results = validateSDDGInspection(content, material);
        const failures = results.filter(r => !r.isValid);

        expect(failures).toHaveLength(0);
      });

      test('Alteration 2: identifies Key 15 showing "III" when should be empty', () => {
        const content = createSDDGContent({
          aircraftType: 'PASSENGER AND CARGO AIRCRAFT',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN1845',
          properShippingName: 'CARBON DIOXIDE, SOLID',
          hazardClass: '9',
          subsidiaryRisk: '',
          packingGroup: 'III',  // Should be empty for dry ice
          packingInstruction: 'A13.10',
        });

        const results = validateSDDGInspection(content, material);
        const packingGroupResult = results.find(r => r.key === 'packingGroup');

        expect(packingGroupResult?.isValid).toBe(false);
      });
    });

    describe('Scenario 13: UN3077 - Environmentally Hazardous (with Packing Group)', () => {
      const material = createClass9Material(
        'UN3077', 'A13.2',
        'ENVIRONMENTALLY HAZARDOUS SUBSTANCE, SOLID, N.O.S. (Copper sulfate)',
        'III', '', 'P5'
      );

      test('validates successful SDDG with Packing Group III', () => {
        const content = createSDDGContent({
          aircraftType: 'PASSENGER AND CARGO AIRCRAFT',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN3077',
          properShippingName: 'ENVIRONMENTALLY HAZARDOUS SUBSTANCE, SOLID, N.O.S. (Copper sulfate)',
          hazardClass: '9',
          subsidiaryRisk: '',
          packingGroup: 'III',
          packingInstruction: 'A13.2',
        });

        const results = validateSDDGInspection(content, material);
        const failures = results.filter(r => !r.isValid);

        expect(failures).toHaveLength(0);
      });

      test('Alteration 1: identifies Key 12 missing technical name for N.O.S.', () => {
        const content = createSDDGContent({
          aircraftType: 'PASSENGER AND CARGO AIRCRAFT',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN3077',
          properShippingName: 'ENVIRONMENTALLY HAZARDOUS SUBSTANCE, SOLID, N.O.S.',  // Missing technical name
          hazardClass: '9',
          subsidiaryRisk: '',
          packingGroup: 'III',
          packingInstruction: 'A13.2',
        });

        const results = validateSDDGInspection(content, material);
        const psnResult = results.find(r => r.key === 'properShippingName');

        expect(psnResult?.isValid).toBe(false);
      });

      test('Alteration 2: identifies Key 15 empty when PG III required', () => {
        const content = createSDDGContent({
          aircraftType: 'PASSENGER AND CARGO AIRCRAFT',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN3077',
          properShippingName: 'ENVIRONMENTALLY HAZARDOUS SUBSTANCE, SOLID, N.O.S. (Copper sulfate)',
          hazardClass: '9',
          subsidiaryRisk: '',
          packingGroup: '',  // Should be III
          packingInstruction: 'A13.2',
        });

        const results = validateSDDGInspection(content, material);
        const packingGroupResult = results.find(r => r.key === 'packingGroup');

        expect(packingGroupResult?.isValid).toBe(false);
        expect(packingGroupResult?.expectedValue).toBe('III');
      });
    });

    describe('Scenario 15: UN2315 - PCBs, Liquid (Packing Group II)', () => {
      const material = createClass9Material(
        'UN2315', 'A13.2',
        'POLYCHLORINATED BIPHENYLS, LIQUID',
        'II', '', 'P5'
      );

      test('validates successful SDDG with Packing Group II', () => {
        const content = createSDDGContent({
          aircraftType: 'PASSENGER AND CARGO AIRCRAFT',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN2315',
          properShippingName: 'POLYCHLORINATED BIPHENYLS, LIQUID',
          hazardClass: '9',
          subsidiaryRisk: '',
          packingGroup: 'II',
          packingInstruction: 'A13.2',
        });

        const results = validateSDDGInspection(content, material);
        const failures = results.filter(r => !r.isValid);

        expect(failures).toHaveLength(0);
      });

      test('Alteration 1: identifies Key 15 showing "III" when "II" expected', () => {
        const content = createSDDGContent({
          aircraftType: 'PASSENGER AND CARGO AIRCRAFT',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN2315',
          properShippingName: 'POLYCHLORINATED BIPHENYLS, LIQUID',
          hazardClass: '9',
          subsidiaryRisk: '',
          packingGroup: 'III',  // Should be II
          packingInstruction: 'A13.2',
        });

        const results = validateSDDGInspection(content, material);
        const packingGroupResult = results.find(r => r.key === 'packingGroup');

        expect(packingGroupResult?.isValid).toBe(false);
        expect(packingGroupResult?.expectedValue).toBe('II');
      });
    });

    describe('Scenario 19: UN3245 - Genetically Modified Organisms', () => {
      const material = createClass9Material(
        'UN3245', 'A10.8',
        'GENETICALLY MODIFIED ORGANISMS',
        '', '', 'P5'
      );

      test('validates successful SDDG with A10.8 packaging instruction', () => {
        const content = createSDDGContent({
          aircraftType: 'PASSENGER AND CARGO AIRCRAFT',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN3245',
          properShippingName: 'GENETICALLY MODIFIED ORGANISMS',
          hazardClass: '9',
          subsidiaryRisk: '',
          packingGroup: '',
          packingInstruction: 'A10.8',
        });

        const results = validateSDDGInspection(content, material);
        const failures = results.filter(r => !r.isValid);

        expect(failures).toHaveLength(0);
      });

      test('Alteration 1: identifies Key 17 showing A13.xx when A10.8 expected', () => {
        const content = createSDDGContent({
          aircraftType: 'PASSENGER AND CARGO AIRCRAFT',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN3245',
          properShippingName: 'GENETICALLY MODIFIED ORGANISMS',
          hazardClass: '9',
          subsidiaryRisk: '',
          packingGroup: '',
          packingInstruction: 'A13.8',  // Wrong - should be A10.8
        });

        const results = validateSDDGInspection(content, material);
        const packingResult = results.find(r => r.key === 'packingInstruction');

        expect(packingResult?.isValid).toBe(false);
        expect(packingResult?.expectedValue).toBe('A10.8');
      });

      test('Alteration 3: identifies Key 13 showing "6.2" when "9" expected', () => {
        const content = createSDDGContent({
          aircraftType: 'PASSENGER AND CARGO AIRCRAFT',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN3245',
          properShippingName: 'GENETICALLY MODIFIED ORGANISMS',
          hazardClass: '6.2',  // Wrong - GMOs are Class 9
          subsidiaryRisk: '',
          packingGroup: '',
          packingInstruction: 'A10.8',
        });

        const results = validateSDDGInspection(content, material);
        const hazardClassResult = results.find(r => r.key === 'hazardClass');

        expect(hazardClassResult?.isValid).toBe(false);
        expect(hazardClassResult?.expectedValue).toBe('9');
      });
    });

    describe('Multiple Errors Detection', () => {
      test('identifies multiple validation failures in single SDDG', () => {
        const material = createClass9Material(
          'UN3480', 'A13.7',
          'LITHIUM ION BATTERIES (including lithium polymer batteries)',
          '', '', 'P5'
        );

        const content = createSDDGContent({
          aircraftType: 'PASSENGER AND CARGO AIRCRAFT',
          shipmentType: 'NON-RADIOACTIVE',
          unIdNo: 'UN3481',  // Wrong UN number
          properShippingName: 'LITHIUM BATTERIES',  // Incomplete PSN
          hazardClass: '9.1',  // Class 9 has no divisions
          subsidiaryRisk: '',
          packingGroup: 'II',  // Should be empty
          packingInstruction: 'A13.8',  // Wrong instruction
        });

        const results = validateSDDGInspection(content, material);
        const failures = results.filter(r => !r.isValid);

        // Should catch multiple errors
        expect(failures.length).toBeGreaterThanOrEqual(3);

        // Verify specific failures are identified
        const failedKeys = failures.map(f => f.key);
        expect(failedKeys).toContain('unIdNo');
        expect(failedKeys).toContain('hazardClass');
        expect(failedKeys).toContain('packingInstruction');
      });
    });

    describe('Edge Cases', () => {
      test('returns empty array when material is null', () => {
        const content = createSDDGContent({
          unIdNo: 'UN3480',
          hazardClass: '9',
        });

        const results = validateSDDGInspection(content, null);
        expect(results).toHaveLength(0);
      });

      test('returns empty array when content is null', () => {
        const material = createClass9Material('UN3480', 'A13.7', 'LITHIUM ION BATTERIES');
        const results = validateSDDGInspection(null, material);
        expect(results).toHaveLength(0);
      });
    });
  });
});
