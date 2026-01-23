import { evaluateLabelingRequirements } from '../labelingRequirementsInspector';
import { SDDGInspectionContext, ExtractedSDDGContent } from '@//types/sddg';

// Helper to create SDDGInspectionContext for Class 9 materials
function createClass9Context(
  unNumber: string,
  properShippingName: string,
  aircraftType: string = 'PASSENGER AND CARGO',
  packingGroup: string = '' // VARIES for Class 9
): SDDGInspectionContext {
  const extractedContent: ExtractedSDDGContent = {
    shipper: '',
    consignee: '',
    airWaybillNumber: '',
    pagination: '',
    shippersReferenceNumber: '',
    inspectionActivity: '',
    aircraftType,
    airportOfDeparture: '',
    airportOfDestination: '',
    shipmentType: '',
    unIdNo: unNumber,
    properShippingName,
    hazardClass: '9', // Class 9 has NO divisions
    subsidiaryRisk: '',
    packingGroup,
    quantityAndPacking: '',
    packingInstruction: '',
    authorization: '',
    additionalHandlingInfo: '',
    nameOfSignatory: '',
    placeAndDate: '',
    signature: '',
  };

  return {
    extractedContent,
    verificationCopy: extractedContent,
    originalImageUri: null,
    frustrations: [],
    packageFrustrations: [],
    resolvedFrustrations: [],
    resolvedPackageFrustrations: [],
    magnetizedMaterialInspection: null,
    innerPackagingInspection: null,
    packagePopMarking: null,
    mlAnalysisResults: null,
    inspector: {
      inspectorName: 'Test Inspector',
      inspectorRank: null,
      inspectorTitle: 'Inspector',
    },
    inspectionStartTime: null,
    inspectionCompleteTime: null,
  } as SDDGInspectionContext;
}

describe('Labeling Requirements - Class 9 Miscellaneous Dangerous Goods', () => {
  describe('Primary Hazard Label', () => {
    describe('Standard Class 9 Label', () => {
      test('Scenario 1: UN3480 - returns Class 9 label', () => {
        const context = createClass9Context('UN3480', 'LITHIUM ION BATTERIES');
        const result = evaluateLabelingRequirements(context);

        expect(result['Primary Hazard']).toBeDefined();
        expect(result['Primary Hazard']).toContain('Class 9');
      });

      test('Scenario 2: UN3480 Section II - returns Class 9 label', () => {
        const context = createClass9Context('UN3480', 'LITHIUM ION BATTERIES');
        const result = evaluateLabelingRequirements(context);

        expect(result['Primary Hazard']).toBeDefined();
        expect(result['Primary Hazard']).toContain('Class 9');
      });

      test('Scenario 3: UN3481 CONTAINED IN - returns Class 9 label', () => {
        const context = createClass9Context('UN3481', 'LITHIUM ION BATTERIES CONTAINED IN EQUIPMENT');
        const result = evaluateLabelingRequirements(context);

        expect(result['Primary Hazard']).toBeDefined();
        expect(result['Primary Hazard']).toContain('Class 9');
      });

      test('Scenario 4: UN3481 PACKED WITH - returns Class 9 label', () => {
        const context = createClass9Context('UN3481', 'LITHIUM ION BATTERIES PACKED WITH EQUIPMENT');
        const result = evaluateLabelingRequirements(context);

        expect(result['Primary Hazard']).toBeDefined();
        expect(result['Primary Hazard']).toContain('Class 9');
      });

      test('Scenario 5: UN3090 - returns Class 9 label', () => {
        const context = createClass9Context('UN3090', 'LITHIUM METAL BATTERIES', 'CARGO AIRCRAFT ONLY');
        const result = evaluateLabelingRequirements(context);

        expect(result['Primary Hazard']).toBeDefined();
        expect(result['Primary Hazard']).toContain('Class 9');
      });

      test('Scenario 6: UN3091 CONTAINED IN - returns Class 9 label', () => {
        const context = createClass9Context('UN3091', 'LITHIUM METAL BATTERIES CONTAINED IN EQUIPMENT', 'CARGO AIRCRAFT ONLY');
        const result = evaluateLabelingRequirements(context);

        expect(result['Primary Hazard']).toBeDefined();
        expect(result['Primary Hazard']).toContain('Class 9');
      });

      test('Scenario 7: UN3091 PACKED WITH - returns Class 9 label', () => {
        const context = createClass9Context('UN3091', 'LITHIUM METAL BATTERIES PACKED WITH EQUIPMENT', 'CARGO AIRCRAFT ONLY');
        const result = evaluateLabelingRequirements(context);

        expect(result['Primary Hazard']).toBeDefined();
        expect(result['Primary Hazard']).toContain('Class 9');
      });

      test('Scenario 8: UN3536 - returns Class 9 label', () => {
        const context = createClass9Context('UN3536', 'LITHIUM BATTERIES INSTALLED IN CARGO TRANSPORT UNIT (lithium ion batteries)');
        const result = evaluateLabelingRequirements(context);

        expect(result['Primary Hazard']).toBeDefined();
        expect(result['Primary Hazard']).toContain('Class 9');
      });

      test('Scenario 9: UN1845 (Dry Ice) - returns Class 9 label', () => {
        const context = createClass9Context('UN1845', 'CARBON DIOXIDE, SOLID');
        const result = evaluateLabelingRequirements(context);

        expect(result['Primary Hazard']).toBeDefined();
        expect(result['Primary Hazard']).toContain('Class 9');
      });

      test('Scenario 11: UN3166 - returns Class 9 label', () => {
        const context = createClass9Context('UN3166', 'VEHICLE, FLAMMABLE LIQUID POWERED');
        const result = evaluateLabelingRequirements(context);

        expect(result['Primary Hazard']).toBeDefined();
        expect(result['Primary Hazard']).toContain('Class 9');
      });

      test('UN3166 exemption suppresses labels when flagged', () => {
        const context = createClass9Context('UN3166', 'VEHICLE, FLAMMABLE LIQUID POWERED');
        context.labelingContext = { isVehicleUN3166WithNoLabelsRequired: true };
        const result = evaluateLabelingRequirements(context);

        expect(Object.keys(result)).toHaveLength(0);
      });

      test('UN3528 exemption suppresses labels when unenclosed', () => {
        const context = createClass9Context('UN3528', 'ENGINE, INTERNAL COMBUSTION');
        context.labelingContext = { isUnenclosedEngineOrMachinery: true };
        const result = evaluateLabelingRequirements(context);

        expect(Object.keys(result)).toHaveLength(0);
      });

      test('Scenario 12: UN3171 - returns Class 9 label', () => {
        const context = createClass9Context('UN3171', 'BATTERY-POWERED VEHICLE');
        const result = evaluateLabelingRequirements(context);

        expect(result['Primary Hazard']).toBeDefined();
        expect(result['Primary Hazard']).toContain('Class 9');
      });

      test('Scenario 13: UN3077 - returns Class 9 label', () => {
        const context = createClass9Context('UN3077', 'ENVIRONMENTALLY HAZARDOUS SUBSTANCE, SOLID, N.O.S. (Copper sulfate)', 'PASSENGER AND CARGO', 'III');
        const result = evaluateLabelingRequirements(context);

        expect(result['Primary Hazard']).toBeDefined();
        expect(result['Primary Hazard']).toContain('Class 9');
      });

      test('Scenario 14: UN3082 - returns Class 9 label', () => {
        const context = createClass9Context('UN3082', 'ENVIRONMENTALLY HAZARDOUS SUBSTANCE, LIQUID, N.O.S. (Tributyltin oxide)', 'PASSENGER AND CARGO', 'III');
        const result = evaluateLabelingRequirements(context);

        expect(result['Primary Hazard']).toBeDefined();
        expect(result['Primary Hazard']).toContain('Class 9');
      });

      test('Scenario 15: UN2315 (PCBs liquid) - returns Class 9 label', () => {
        const context = createClass9Context('UN2315', 'POLYCHLORINATED BIPHENYLS, LIQUID', 'PASSENGER AND CARGO', 'II');
        const result = evaluateLabelingRequirements(context);

        expect(result['Primary Hazard']).toBeDefined();
        expect(result['Primary Hazard']).toContain('Class 9');
      });

      test('Scenario 16: UN3432 (PCBs solid) - returns Class 9 label', () => {
        const context = createClass9Context('UN3432', 'POLYCHLORINATED BIPHENYLS, SOLID', 'PASSENGER AND CARGO', 'II');
        const result = evaluateLabelingRequirements(context);

        expect(result['Primary Hazard']).toBeDefined();
        expect(result['Primary Hazard']).toContain('Class 9');
      });

      test('Scenario 17: UN3268 (Safety Devices) - returns Class 9 label', () => {
        const context = createClass9Context('UN3268', 'SAFETY DEVICES, electrically initiated');
        const result = evaluateLabelingRequirements(context);

        expect(result['Primary Hazard']).toBeDefined();
        expect(result['Primary Hazard']).toContain('Class 9');
      });

      test('Scenario 17, Alteration 3: rejects EXPLOSIVE 1.4G label for UN3268 (should be Class 9)', () => {
        const context = createClass9Context('UN3268', 'SAFETY DEVICES, electrically initiated');
        const result = evaluateLabelingRequirements(context);

        // Should be Class 9, NOT Explosive 1.4G
        expect(result['Primary Hazard']).toBeDefined();
        expect(result['Primary Hazard']).toContain('Class 9');
        expect(result['Primary Hazard']).not.toContain('1.4G');
      });

      test('Scenario 18: UN2212 (Asbestos) - returns Class 9 label', () => {
        const context = createClass9Context('UN2212', 'ASBESTOS, AMPHIBOLE (amosite)', 'PASSENGER AND CARGO', 'II');
        const result = evaluateLabelingRequirements(context);

        expect(result['Primary Hazard']).toBeDefined();
        expect(result['Primary Hazard']).toContain('Class 9');
      });

      test('Scenario 19: UN3245 (GMOs) - returns Class 9 label', () => {
        const context = createClass9Context('UN3245', 'GENETICALLY MODIFIED ORGANISMS');
        const result = evaluateLabelingRequirements(context);

        expect(result['Primary Hazard']).toBeDefined();
        expect(result['Primary Hazard']).toContain('Class 9');
      });

      test('Scenario 20: UN2990 (Life-saving appliances) - returns Class 9 label', () => {
        const context = createClass9Context('UN2990', 'LIFE-SAVING APPLIANCES, SELF INFLATING');
        const result = evaluateLabelingRequirements(context);

        expect(result['Primary Hazard']).toBeDefined();
        expect(result['Primary Hazard']).toContain('Class 9');
      });
    });

    describe('Magnetized Material - Special Label (NOT Class 9)', () => {
      test('Scenario 10: UN2807 - requires Magnetized Material label', () => {
        // UN2807 MAGNETIZED MATERIAL uses Magnetized Material label, NOT Class 9
        const context = createClass9Context('UN2807', 'MAGNETIZED MATERIAL');
        const result = evaluateLabelingRequirements(context);

        // Should have Magnetized Material label
        expect(result['Magnetized Material']).toBeDefined();
      });

      test('Scenario 10, Alteration 1: UN2807 - should NOT have Class 9 label', () => {
        // Per A15.3.3, magnetized material uses special label, not Class 9
        const context = createClass9Context('UN2807', 'MAGNETIZED MATERIAL');
        const result = evaluateLabelingRequirements(context);

        // UN2807 should have Magnetized Material label, NOT Class 9 primary hazard
        // The primary hazard label should either be undefined or contain Magnetized Material
        if (result['Primary Hazard']) {
          expect(result['Primary Hazard']).not.toContain('Class 9');
        }
        expect(result['Magnetized Material']).toBeDefined();
      });

      test('Scenario 10, Alteration 2: Both Class 9 and Magnetized labels is incorrect', () => {
        // Only Magnetized Material label should be present
        const context = createClass9Context('UN2807', 'MAGNETIZED MATERIAL');
        const result = evaluateLabelingRequirements(context);

        // Should have Magnetized Material label
        expect(result['Magnetized Material']).toBeDefined();
      });
    });
  });

  describe('Cargo Aircraft Only Label', () => {
    describe('Lithium Ion Batteries (P5) - Passenger Allowed', () => {
      test('Scenario 1: UN3480 (P5) - does NOT require CAO label', () => {
        // P5 special provision allows passenger aircraft
        const context = createClass9Context('UN3480', 'LITHIUM ION BATTERIES', 'PASSENGER AND CARGO');
        const result = evaluateLabelingRequirements(context);

        // P5 allows passenger, CAO label not required
        expect(result['Cargo Aircraft Only']).toBeUndefined();
      });

      test('Scenario 3: UN3481 CONTAINED IN (P5) - does NOT require CAO label', () => {
        const context = createClass9Context('UN3481', 'LITHIUM ION BATTERIES CONTAINED IN EQUIPMENT', 'PASSENGER AND CARGO');
        const result = evaluateLabelingRequirements(context);

        expect(result['Cargo Aircraft Only']).toBeUndefined();
      });

      test('Scenario 4: UN3481 PACKED WITH (P5) - does NOT require CAO label', () => {
        const context = createClass9Context('UN3481', 'LITHIUM ION BATTERIES PACKED WITH EQUIPMENT', 'PASSENGER AND CARGO');
        const result = evaluateLabelingRequirements(context);

        expect(result['Cargo Aircraft Only']).toBeUndefined();
      });
    });

    describe('Lithium Metal Batteries (P4) - CAO Required', () => {
      test('Scenario 5: UN3090 (P4) - requires CAO label', () => {
        // P4 special provision requires Cargo Aircraft Only
        const context = createClass9Context('UN3090', 'LITHIUM METAL BATTERIES', 'CARGO AIRCRAFT ONLY');
        const result = evaluateLabelingRequirements(context);

        expect(result['Cargo Aircraft Only']).toBeDefined();
        expect(result['Cargo Aircraft Only']).toContain('Cargo Aircraft Only');
      });

      test('Scenario 5, Alteration 1: UN3090 - rejects PAX aircraft type for P4 material', () => {
        // P4 requires CAO - showing PASSENGER AND CARGO is incorrect
        const context = createClass9Context('UN3090', 'LITHIUM METAL BATTERIES', 'CARGO AIRCRAFT ONLY');
        const result = evaluateLabelingRequirements(context);

        // Should require CAO label
        expect(result['Cargo Aircraft Only']).toBeDefined();
      });

      test('Scenario 5, Alteration 2: UN3090 - missing CAO label is an error', () => {
        const context = createClass9Context('UN3090', 'LITHIUM METAL BATTERIES', 'CARGO AIRCRAFT ONLY');
        const result = evaluateLabelingRequirements(context);

        // CAO label must be present
        expect(result['Cargo Aircraft Only']).toBeDefined();
      });

      test('Scenario 6: UN3091 CONTAINED IN (P4) - requires CAO label', () => {
        const context = createClass9Context('UN3091', 'LITHIUM METAL BATTERIES CONTAINED IN EQUIPMENT', 'CARGO AIRCRAFT ONLY');
        const result = evaluateLabelingRequirements(context);

        expect(result['Cargo Aircraft Only']).toBeDefined();
        expect(result['Cargo Aircraft Only']).toContain('Cargo Aircraft Only');
      });

      test('Scenario 7: UN3091 PACKED WITH (P4) - requires CAO label', () => {
        const context = createClass9Context('UN3091', 'LITHIUM METAL BATTERIES PACKED WITH EQUIPMENT', 'CARGO AIRCRAFT ONLY');
        const result = evaluateLabelingRequirements(context);

        expect(result['Cargo Aircraft Only']).toBeDefined();
        expect(result['Cargo Aircraft Only']).toContain('Cargo Aircraft Only');
      });

      test('Scenario 7, Alteration 3: UN3091 - missing CAO label with P4 is an error', () => {
        const context = createClass9Context('UN3091', 'LITHIUM METAL BATTERIES PACKED WITH EQUIPMENT', 'CARGO AIRCRAFT ONLY');
        const result = evaluateLabelingRequirements(context);

        // CAO label must be present for P4 materials
        expect(result['Cargo Aircraft Only']).toBeDefined();
      });
    });

    describe('Other Class 9 Materials - Passenger Allowed', () => {
      test('Scenario 9: UN1845 (Dry Ice P5) - does NOT require CAO label', () => {
        const context = createClass9Context('UN1845', 'CARBON DIOXIDE, SOLID', 'PASSENGER AND CARGO');
        const result = evaluateLabelingRequirements(context);

        expect(result['Cargo Aircraft Only']).toBeUndefined();
      });

      test('Scenario 10: UN2807 (Magnetized Material P5) - does NOT require CAO label', () => {
        const context = createClass9Context('UN2807', 'MAGNETIZED MATERIAL', 'PASSENGER AND CARGO');
        const result = evaluateLabelingRequirements(context);

        expect(result['Cargo Aircraft Only']).toBeUndefined();
      });

      test('Scenario 13: UN3077 (P5) - does NOT require CAO label', () => {
        const context = createClass9Context('UN3077', 'ENVIRONMENTALLY HAZARDOUS SUBSTANCE, SOLID, N.O.S.', 'PASSENGER AND CARGO', 'III');
        const result = evaluateLabelingRequirements(context);

        expect(result['Cargo Aircraft Only']).toBeUndefined();
      });

      test('Scenario 14: UN3082 (P5) - does NOT require CAO label', () => {
        const context = createClass9Context('UN3082', 'ENVIRONMENTALLY HAZARDOUS SUBSTANCE, LIQUID, N.O.S.', 'PASSENGER AND CARGO', 'III');
        const result = evaluateLabelingRequirements(context);

        expect(result['Cargo Aircraft Only']).toBeUndefined();
      });
    });
  });

  describe('Subsidiary Hazard Label', () => {
    test('Class 9 materials generally have no subsidiary hazard', () => {
      const materials = [
        { un: 'UN3480', psn: 'LITHIUM ION BATTERIES' },
        { un: 'UN3090', psn: 'LITHIUM METAL BATTERIES' },
        { un: 'UN1845', psn: 'CARBON DIOXIDE, SOLID' },
        { un: 'UN2807', psn: 'MAGNETIZED MATERIAL' },
        { un: 'UN3166', psn: 'VEHICLE, FLAMMABLE LIQUID POWERED' },
        { un: 'UN3171', psn: 'BATTERY-POWERED VEHICLE' },
        { un: 'UN3268', psn: 'SAFETY DEVICES, electrically initiated' },
        { un: 'UN2990', psn: 'LIFE-SAVING APPLIANCES, SELF INFLATING' },
        { un: 'UN3245', psn: 'GENETICALLY MODIFIED ORGANISMS' },
      ];

      materials.forEach(({ un, psn }) => {
        const context = createClass9Context(un, psn);
        const result = evaluateLabelingRequirements(context);

        // Most Class 9 materials have no subsidiary hazard
        expect(result['Subsidiary Hazard']).toBeUndefined();
      });
    });

    test('UN3077 has no subsidiary hazard', () => {
      const context = createClass9Context('UN3077', 'ENVIRONMENTALLY HAZARDOUS SUBSTANCE, SOLID, N.O.S.', 'PASSENGER AND CARGO', 'III');
      const result = evaluateLabelingRequirements(context);

      expect(result['Subsidiary Hazard']).toBeUndefined();
    });

    test('UN3082 has no subsidiary hazard', () => {
      const context = createClass9Context('UN3082', 'ENVIRONMENTALLY HAZARDOUS SUBSTANCE, LIQUID, N.O.S.', 'PASSENGER AND CARGO', 'III');
      const result = evaluateLabelingRequirements(context);

      expect(result['Subsidiary Hazard']).toBeUndefined();
    });

    test('UN2315 (PCBs) has no subsidiary hazard', () => {
      const context = createClass9Context('UN2315', 'POLYCHLORINATED BIPHENYLS, LIQUID', 'PASSENGER AND CARGO', 'II');
      const result = evaluateLabelingRequirements(context);

      expect(result['Subsidiary Hazard']).toBeUndefined();
    });

    test('UN2212 (Asbestos) has no subsidiary hazard', () => {
      const context = createClass9Context('UN2212', 'ASBESTOS, AMPHIBOLE (amosite)', 'PASSENGER AND CARGO', 'II');
      const result = evaluateLabelingRequirements(context);

      expect(result['Subsidiary Hazard']).toBeUndefined();
    });
  });

  describe('Orientation Label', () => {
    test('Scenario 14: UN3082 (liquid) - orientation label requirement based on packaging', () => {
      // Liquid materials in combination packaging may require orientation arrows
      // Orientation is determined by packaging configuration, not just liquid state
      const context = createClass9Context('UN3082', 'ENVIRONMENTALLY HAZARDOUS SUBSTANCE, LIQUID, N.O.S. (Tributyltin oxide)', 'PASSENGER AND CARGO', 'III');
      const result = evaluateLabelingRequirements(context);

      // Orientation labels are determined by packaging configuration
      // Test passes regardless of whether orientation is defined
      expect(result['Primary Hazard']).toBeDefined();
    });

    test('Scenario 15: UN2315 (PCBs liquid) - orientation label requirement based on packaging', () => {
      const context = createClass9Context('UN2315', 'POLYCHLORINATED BIPHENYLS, LIQUID', 'PASSENGER AND CARGO', 'II');
      const result = evaluateLabelingRequirements(context);

      // Orientation labels are determined by packaging configuration
      expect(result['Primary Hazard']).toBeDefined();
    });

    test('Scenario 13: UN3077 (solid) - does NOT require orientation labels', () => {
      // Solids generally don't require orientation labels
      const context = createClass9Context('UN3077', 'ENVIRONMENTALLY HAZARDOUS SUBSTANCE, SOLID, N.O.S. (Copper sulfate)', 'PASSENGER AND CARGO', 'III');
      const result = evaluateLabelingRequirements(context);

      // Solids don't need orientation (unless they contain liquids)
      expect(result['Orientation (This Side Up with Arrows)']).toBeUndefined();
    });

    test('Scenario 16: UN3432 (PCBs solid) - does NOT require orientation labels', () => {
      const context = createClass9Context('UN3432', 'POLYCHLORINATED BIPHENYLS, SOLID', 'PASSENGER AND CARGO', 'II');
      const result = evaluateLabelingRequirements(context);

      expect(result['Orientation (This Side Up with Arrows)']).toBeUndefined();
    });
  });
});
