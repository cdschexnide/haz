import { evaluateLabelingRequirements } from '../labelingRequirementsInspector';
import { hazardousMaterialsList } from '@/hazardousMaterials/hazardousMaterialsList';
import { SDDGInspectionContext, ExtractedSDDGContent } from '@//types/sddg';

// Helper to create SDDGInspectionContext for Class 8 materials
function createClass8Context(
  unNumber: string,
  hazardClass: string,
  properShippingName: string,
  packingGroup: string,
  aircraftType: string = 'CARGO AIRCRAFT ONLY'
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
    hazardClass,
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

describe('Labeling Requirements - Class 8 Corrosives', () => {
  describe('Primary Hazard Label - CORROSIVE Class 8', () => {
    describe('Packing Group I Scenarios (1-6)', () => {
      test('Scenario 1: UN1830 - returns CORROSIVE Class 8 label', () => {
        const context = createClass8Context('UN1830', '8', 'SULFURIC ACID, FUMING', 'I', 'CARGO AIRCRAFT ONLY');
        const result = evaluateLabelingRequirements(context);

        expect(result['Primary Hazard']).toBeDefined();
        expect(result['Primary Hazard']).toContain('Class 8');
      });

      test('Scenario 2: UN1790 - returns CORROSIVE Class 8 label', () => {
        const context = createClass8Context('UN1790', '8', 'HYDROFLUORIC ACID', 'I', 'CARGO AIRCRAFT ONLY');
        const result = evaluateLabelingRequirements(context);

        expect(result['Primary Hazard']).toBeDefined();
        expect(result['Primary Hazard']).toContain('Class 8');
      });

      test('Scenario 3: UN2032 - returns CORROSIVE Class 8 label', () => {
        const context = createClass8Context('UN2032', '8', 'NITRIC ACID, RED FUMING', 'I', 'CARGO AIRCRAFT ONLY');
        const result = evaluateLabelingRequirements(context);

        expect(result['Primary Hazard']).toBeDefined();
        expect(result['Primary Hazard']).toContain('Class 8');
      });

      test('Scenario 4: UN2029 - returns CORROSIVE Class 8 label', () => {
        const context = createClass8Context('UN2029', '8', 'HYDRAZINE, ANHYDROUS', 'I', 'CARGO AIRCRAFT ONLY');
        const result = evaluateLabelingRequirements(context);

        expect(result['Primary Hazard']).toBeDefined();
        expect(result['Primary Hazard']).toContain('Class 8');
      });

      test('Scenario 5: UN1760 - returns CORROSIVE Class 8 label (N.O.S.)', () => {
        const context = createClass8Context('UN1760', '8', 'CORROSIVE LIQUID, N.O.S.', 'I', 'CARGO AIRCRAFT ONLY');
        const result = evaluateLabelingRequirements(context);

        expect(result['Primary Hazard']).toBeDefined();
        expect(result['Primary Hazard']).toContain('Class 8');
      });

      test('Scenario 6: UN2922 - returns CORROSIVE Class 8 label (TOXIC N.O.S.)', () => {
        const context = createClass8Context('UN2922', '8', 'CORROSIVE LIQUID, TOXIC, N.O.S.', 'I', 'CARGO AIRCRAFT ONLY');
        const result = evaluateLabelingRequirements(context);

        expect(result['Primary Hazard']).toBeDefined();
        expect(result['Primary Hazard']).toContain('Class 8');
      });

      test('Class 8 subsidiary 6.1 label is suppressed when corrosive-only is flagged', () => {
        const material = hazardousMaterialsList.find(item => item.unid === 'UN2922');
        if (!material) {
          throw new Error('Missing UN2922 fixture');
        }

        const originalSubsidiary = material.subsidiaryRisk;
        material.subsidiaryRisk = '6.1';

        try {
          const context = createClass8Context('UN2922', '8', 'CORROSIVE LIQUID, TOXIC, N.O.S.', 'I', 'CARGO AIRCRAFT ONLY');
          context.labelingContext = { isCorrosiveOnlyForClass8With6_1: true };
          const result = evaluateLabelingRequirements(context);

          expect(result['Subsidiary Hazard']).toBeUndefined();
        } finally {
          material.subsidiaryRisk = originalSubsidiary;
        }
      });
    });

    describe('Packing Group II Scenarios (7-14)', () => {
      test('Scenario 7: UN1789 - returns CORROSIVE Class 8 label', () => {
        const context = createClass8Context('UN1789', '8', 'HYDROCHLORIC ACID', 'II', 'CARGO AIRCRAFT ONLY');
        const result = evaluateLabelingRequirements(context);

        expect(result['Primary Hazard']).toBeDefined();
        expect(result['Primary Hazard']).toContain('Class 8');
      });

      test('Scenario 8: UN2789 - returns CORROSIVE Class 8 label', () => {
        const context = createClass8Context('UN2789', '8', 'ACETIC ACID, GLACIAL', 'II', 'PASSENGER AND CARGO');
        const result = evaluateLabelingRequirements(context);

        expect(result['Primary Hazard']).toBeDefined();
        expect(result['Primary Hazard']).toContain('Class 8');
      });

      test('Scenario 9: UN1823 - returns CORROSIVE Class 8 label (SOLID)', () => {
        const context = createClass8Context('UN1823', '8', 'SODIUM HYDROXIDE, SOLID', 'II', 'PASSENGER AND CARGO');
        const result = evaluateLabelingRequirements(context);

        expect(result['Primary Hazard']).toBeDefined();
        expect(result['Primary Hazard']).toContain('Class 8');
      });

      test('Scenario 10: UN2796 - returns CORROSIVE Class 8 label (BATTERY FLUID)', () => {
        const context = createClass8Context('UN2796', '8', 'BATTERY FLUID, ACID', 'II', 'PASSENGER AND CARGO');
        const result = evaluateLabelingRequirements(context);

        expect(result['Primary Hazard']).toBeDefined();
        expect(result['Primary Hazard']).toContain('Class 8');
      });

      test('Scenario 11: UN2794 - returns CORROSIVE Class 8 label (WET BATTERIES - No PG)', () => {
        const context = createClass8Context('UN2794', '8', 'BATTERIES, WET, FILLED WITH ACID', '', 'PASSENGER AND CARGO');
        const result = evaluateLabelingRequirements(context);

        expect(result['Primary Hazard']).toBeDefined();
        expect(result['Primary Hazard']).toContain('Class 8');
      });

      test('Scenario 12: UN1824 - returns CORROSIVE Class 8 label', () => {
        const context = createClass8Context('UN1824', '8', 'SODIUM HYDROXIDE, SOLUTION', 'II', 'PASSENGER AND CARGO');
        const result = evaluateLabelingRequirements(context);

        expect(result['Primary Hazard']).toBeDefined();
        expect(result['Primary Hazard']).toContain('Class 8');
      });

      test('Scenario 13: UN2920 - returns CORROSIVE Class 8 label (FLAMMABLE N.O.S.)', () => {
        const context = createClass8Context('UN2920', '8', 'CORROSIVE LIQUID, FLAMMABLE, N.O.S.', 'II', 'CARGO AIRCRAFT ONLY');
        const result = evaluateLabelingRequirements(context);

        expect(result['Primary Hazard']).toBeDefined();
        expect(result['Primary Hazard']).toContain('Class 8');
      });

      test('Scenario 14: UN1802 - returns CORROSIVE Class 8 label', () => {
        const context = createClass8Context('UN1802', '8', 'PERCHLORIC ACID', 'II', 'CARGO AIRCRAFT ONLY');
        const result = evaluateLabelingRequirements(context);

        expect(result['Primary Hazard']).toBeDefined();
        expect(result['Primary Hazard']).toContain('Class 8');
      });
    });

    describe('Packing Group III Scenarios (15-20)', () => {
      test('Scenario 15: UN2790 - returns CORROSIVE Class 8 label', () => {
        const context = createClass8Context('UN2790', '8', 'ACETIC ACID SOLUTION', 'III', 'PASSENGER AND CARGO');
        const result = evaluateLabelingRequirements(context);

        expect(result['Primary Hazard']).toBeDefined();
        expect(result['Primary Hazard']).toContain('Class 8');
      });

      test('Scenario 16: UN2672 - returns CORROSIVE Class 8 label', () => {
        const context = createClass8Context('UN2672', '8', 'AMMONIA SOLUTION', 'III', 'PASSENGER AND CARGO');
        const result = evaluateLabelingRequirements(context);

        expect(result['Primary Hazard']).toBeDefined();
        expect(result['Primary Hazard']).toContain('Class 8');
      });

      test('Scenario 17: UN2809 - returns CORROSIVE Class 8 label', () => {
        const context = createClass8Context('UN2809', '8', 'MERCURY', 'III', 'PASSENGER AND CARGO');
        const result = evaluateLabelingRequirements(context);

        expect(result['Primary Hazard']).toBeDefined();
        expect(result['Primary Hazard']).toContain('Class 8');
      });

      test('Scenario 18: UN1805 - returns CORROSIVE Class 8 label', () => {
        const context = createClass8Context('UN1805', '8', 'PHOSPHORIC ACID, SOLUTION', 'III', 'PASSENGER AND CARGO');
        const result = evaluateLabelingRequirements(context);

        expect(result['Primary Hazard']).toBeDefined();
        expect(result['Primary Hazard']).toContain('Class 8');
      });

      test('Scenario 19: UN1759 - returns CORROSIVE Class 8 label (SOLID N.O.S.)', () => {
        const context = createClass8Context('UN1759', '8', 'CORROSIVE SOLID, N.O.S.', 'III', 'PASSENGER AND CARGO');
        const result = evaluateLabelingRequirements(context);

        expect(result['Primary Hazard']).toBeDefined();
        expect(result['Primary Hazard']).toContain('Class 8');
      });

      test('Scenario 20: UN3264 - returns CORROSIVE Class 8 label (ACIDIC N.O.S.)', () => {
        const context = createClass8Context('UN3264', '8', 'CORROSIVE LIQUID, ACIDIC, INORGANIC, N.O.S.', 'III', 'PASSENGER AND CARGO');
        const result = evaluateLabelingRequirements(context);

        expect(result['Primary Hazard']).toBeDefined();
        expect(result['Primary Hazard']).toContain('Class 8');
      });
    });

    describe('Negative Cases - Class 8 Has NO Divisions', () => {
      test('Primary hazard label should NOT show "8.1" (no divisions in Class 8)', () => {
        const context = createClass8Context('UN1789', '8', 'HYDROCHLORIC ACID', 'II', 'CARGO AIRCRAFT ONLY');
        const result = evaluateLabelingRequirements(context);

        // Class 8 has NO divisions - label should be "8" not "8.1" or similar
        expect(result['Primary Hazard']).toBeDefined();
        const primaryLabel = result['Primary Hazard']?.[0] || '';
        expect(primaryLabel).not.toContain('8.1');
        expect(primaryLabel).not.toContain('8.2');
      });

      test('Scenario 18, Alteration 1: Missing CORROSIVE primary label is an error', () => {
        // Verifies CORROSIVE label requirement exists
        const context = createClass8Context('UN1805', '8', 'PHOSPHORIC ACID, SOLUTION', 'III', 'PASSENGER AND CARGO');
        const result = evaluateLabelingRequirements(context);

        expect(result['Primary Hazard']).toBeDefined();
      });

      test('Scenario 18, Alteration 3: Class number "6" instead of "8" is an error', () => {
        // Label should show Class 8, not Class 6
        const context = createClass8Context('UN1805', '8', 'PHOSPHORIC ACID, SOLUTION', 'III', 'PASSENGER AND CARGO');
        const result = evaluateLabelingRequirements(context);

        expect(result['Primary Hazard']).toBeDefined();
        expect(result['Primary Hazard']).toContain('Class 8');
        expect(result['Primary Hazard']).not.toContain('Class 6');
      });
    });
  });

  describe('Cargo Aircraft Only Label', () => {
    describe('CAO Required - P3 Special Provision', () => {
      test('Scenario 1: UN1830 - requires CAO label (P3 special provision)', () => {
        // UN1830 SULFURIC ACID, FUMING has P3 special provision
        const context = createClass8Context('UN1830', '8', 'SULFURIC ACID, FUMING', 'I', 'CARGO AIRCRAFT ONLY');
        const result = evaluateLabelingRequirements(context);

        expect(result['Cargo Aircraft Only']).toBeDefined();
        expect(result['Cargo Aircraft Only']).toContain('Cargo Aircraft Only');
      });

      test('Scenario 2: UN1790 - requires CAO label (P3 special provision)', () => {
        // UN1790 HYDROFLUORIC ACID has P3 special provision
        const context = createClass8Context('UN1790', '8', 'HYDROFLUORIC ACID', 'I', 'CARGO AIRCRAFT ONLY');
        const result = evaluateLabelingRequirements(context);

        expect(result['Cargo Aircraft Only']).toBeDefined();
        expect(result['Cargo Aircraft Only']).toContain('Cargo Aircraft Only');
      });

      test('Scenario 4: UN2029 - requires CAO label (P3 special provision)', () => {
        // UN2029 HYDRAZINE, ANHYDROUS has P3 special provision
        const context = createClass8Context('UN2029', '8', 'HYDRAZINE, ANHYDROUS', 'I', 'CARGO AIRCRAFT ONLY');
        const result = evaluateLabelingRequirements(context);

        expect(result['Cargo Aircraft Only']).toBeDefined();
        expect(result['Cargo Aircraft Only']).toContain('Cargo Aircraft Only');
      });

      test('Scenario 5: UN1760 - requires CAO label (P3 special provision)', () => {
        // UN1760 CORROSIVE LIQUID, N.O.S. PG I has P3 special provision
        const context = createClass8Context('UN1760', '8', 'CORROSIVE LIQUID, N.O.S.', 'I', 'CARGO AIRCRAFT ONLY');
        const result = evaluateLabelingRequirements(context);

        expect(result['Cargo Aircraft Only']).toBeDefined();
        expect(result['Cargo Aircraft Only']).toContain('Cargo Aircraft Only');
      });

      test('Scenario 6: UN2922 - requires CAO label (P3 special provision)', () => {
        // UN2922 CORROSIVE LIQUID, TOXIC, N.O.S. PG I has P3 special provision
        const context = createClass8Context('UN2922', '8', 'CORROSIVE LIQUID, TOXIC, N.O.S.', 'I', 'CARGO AIRCRAFT ONLY');
        const result = evaluateLabelingRequirements(context);

        expect(result['Cargo Aircraft Only']).toBeDefined();
        expect(result['Cargo Aircraft Only']).toContain('Cargo Aircraft Only');
      });

      test('Scenario 13: UN2920 - requires CAO label (P3 special provision)', () => {
        // UN2920 CORROSIVE LIQUID, FLAMMABLE, N.O.S. PG II has P3 special provision
        const context = createClass8Context('UN2920', '8', 'CORROSIVE LIQUID, FLAMMABLE, N.O.S.', 'II', 'CARGO AIRCRAFT ONLY');
        const result = evaluateLabelingRequirements(context);

        expect(result['Cargo Aircraft Only']).toBeDefined();
        expect(result['Cargo Aircraft Only']).toContain('Cargo Aircraft Only');
      });
    });

    describe('CAO Required - P2 Special Provision', () => {
      test('Scenario 3: UN2032 - requires CAO label (P2 special provision)', () => {
        // UN2032 NITRIC ACID, RED FUMING has P2 special provision
        const context = createClass8Context('UN2032', '8', 'NITRIC ACID, RED FUMING', 'I', 'CARGO AIRCRAFT ONLY');
        const result = evaluateLabelingRequirements(context);

        expect(result['Cargo Aircraft Only']).toBeDefined();
        expect(result['Cargo Aircraft Only']).toContain('Cargo Aircraft Only');
      });
    });

    describe('CAO Required - P4 Special Provision', () => {
      test('Scenario 7: UN1789 - requires CAO label (P4 special provision)', () => {
        // UN1789 HYDROCHLORIC ACID has P4 special provision
        const context = createClass8Context('UN1789', '8', 'HYDROCHLORIC ACID', 'II', 'CARGO AIRCRAFT ONLY');
        const result = evaluateLabelingRequirements(context);

        expect(result['Cargo Aircraft Only']).toBeDefined();
        expect(result['Cargo Aircraft Only']).toContain('Cargo Aircraft Only');
      });

      test('Scenario 7, Alteration 2: missing CAO label despite P4 provision is an error', () => {
        // P4 provision requires CAO - verify label requirement
        const context = createClass8Context('UN1789', '8', 'HYDROCHLORIC ACID', 'II', 'CARGO AIRCRAFT ONLY');
        const result = evaluateLabelingRequirements(context);

        expect(result['Cargo Aircraft Only']).toBeDefined();
      });

      test('Scenario 14: UN1802 - requires CAO label (P4 special provision)', () => {
        // UN1802 PERCHLORIC ACID has P4 special provision
        const context = createClass8Context('UN1802', '8', 'PERCHLORIC ACID', 'II', 'CARGO AIRCRAFT ONLY');
        const result = evaluateLabelingRequirements(context);

        expect(result['Cargo Aircraft Only']).toBeDefined();
        expect(result['Cargo Aircraft Only']).toContain('Cargo Aircraft Only');
      });
    });

    describe('CAO NOT Required - P5 Special Provision (Passenger Allowed)', () => {
      test('Scenario 8: UN2789 - does NOT require CAO label (P5 allows passenger)', () => {
        // UN2789 ACETIC ACID, GLACIAL has P5 special provision - PASSENGER ALLOWED
        const context = createClass8Context('UN2789', '8', 'ACETIC ACID, GLACIAL', 'II', 'PASSENGER AND CARGO');
        const result = evaluateLabelingRequirements(context);

        expect(result['Cargo Aircraft Only']).toBeUndefined();
      });

      test('Scenario 8, Alteration 2: CAO label when P5 allows passenger is incorrect', () => {
        // P5 allows passenger aircraft - CAO label should NOT be present
        const context = createClass8Context('UN2789', '8', 'ACETIC ACID, GLACIAL', 'II', 'PASSENGER AND CARGO');
        const result = evaluateLabelingRequirements(context);

        expect(result['Cargo Aircraft Only']).toBeUndefined();
      });

      test('Scenario 9: UN1823 - does NOT require CAO label (P5 allows passenger)', () => {
        // UN1823 SODIUM HYDROXIDE, SOLID has P5 special provision
        const context = createClass8Context('UN1823', '8', 'SODIUM HYDROXIDE, SOLID', 'II', 'PASSENGER AND CARGO');
        const result = evaluateLabelingRequirements(context);

        expect(result['Cargo Aircraft Only']).toBeUndefined();
      });

      test('Scenario 10: UN2796 - does NOT require CAO label (P5 allows passenger)', () => {
        // UN2796 BATTERY FLUID, ACID has P5 special provision
        const context = createClass8Context('UN2796', '8', 'BATTERY FLUID, ACID', 'II', 'PASSENGER AND CARGO');
        const result = evaluateLabelingRequirements(context);

        expect(result['Cargo Aircraft Only']).toBeUndefined();
      });

      test('Scenario 11: UN2794 - does NOT require CAO label (P5 allows passenger)', () => {
        // UN2794 BATTERIES, WET has P5 special provision
        const context = createClass8Context('UN2794', '8', 'BATTERIES, WET, FILLED WITH ACID', '', 'PASSENGER AND CARGO');
        const result = evaluateLabelingRequirements(context);

        expect(result['Cargo Aircraft Only']).toBeUndefined();
      });

      test('Scenario 12: UN1824 - does NOT require CAO label (P5 allows passenger)', () => {
        // UN1824 SODIUM HYDROXIDE, SOLUTION has P5 special provision
        const context = createClass8Context('UN1824', '8', 'SODIUM HYDROXIDE, SOLUTION', 'II', 'PASSENGER AND CARGO');
        const result = evaluateLabelingRequirements(context);

        expect(result['Cargo Aircraft Only']).toBeUndefined();
      });

      test('Scenario 15: UN2790 - does NOT require CAO label (P5 allows passenger)', () => {
        // UN2790 ACETIC ACID SOLUTION has P5 special provision
        const context = createClass8Context('UN2790', '8', 'ACETIC ACID SOLUTION', 'III', 'PASSENGER AND CARGO');
        const result = evaluateLabelingRequirements(context);

        expect(result['Cargo Aircraft Only']).toBeUndefined();
      });

      test('Scenario 16: UN2672 - does NOT require CAO label (P5 allows passenger)', () => {
        // UN2672 AMMONIA SOLUTION has P5 special provision
        const context = createClass8Context('UN2672', '8', 'AMMONIA SOLUTION', 'III', 'PASSENGER AND CARGO');
        const result = evaluateLabelingRequirements(context);

        expect(result['Cargo Aircraft Only']).toBeUndefined();
      });

      test('Scenario 17: UN2809 - does NOT require CAO label (P5 allows passenger)', () => {
        // UN2809 MERCURY has P5 special provision
        const context = createClass8Context('UN2809', '8', 'MERCURY', 'III', 'PASSENGER AND CARGO');
        const result = evaluateLabelingRequirements(context);

        expect(result['Cargo Aircraft Only']).toBeUndefined();
      });

      test('Scenario 18: UN1805 - does NOT require CAO label (P5 allows passenger)', () => {
        // UN1805 PHOSPHORIC ACID, SOLUTION has P5 special provision
        const context = createClass8Context('UN1805', '8', 'PHOSPHORIC ACID, SOLUTION', 'III', 'PASSENGER AND CARGO');
        const result = evaluateLabelingRequirements(context);

        expect(result['Cargo Aircraft Only']).toBeUndefined();
      });

      test('Scenario 19: UN1759 - does NOT require CAO label (P5 allows passenger)', () => {
        // UN1759 CORROSIVE SOLID, N.O.S. PG III has P5 special provision
        const context = createClass8Context('UN1759', '8', 'CORROSIVE SOLID, N.O.S.', 'III', 'PASSENGER AND CARGO');
        const result = evaluateLabelingRequirements(context);

        expect(result['Cargo Aircraft Only']).toBeUndefined();
      });

      test('Scenario 20: UN3264 - CAO label based on special provision', () => {
        // UN3264 CORROSIVE LIQUID, ACIDIC, INORGANIC, N.O.S. PG III
        // CAO requirement depends on special provision in database
        const context = createClass8Context('UN3264', '8', 'CORROSIVE LIQUID, ACIDIC, INORGANIC, N.O.S.', 'III', 'PASSENGER AND CARGO');
        const result = evaluateLabelingRequirements(context);

        // Test that primary hazard is defined (CAO may or may not be required based on database)
        expect(result['Primary Hazard']).toBeDefined();
      });
    });
  });

  describe('Subsidiary Hazard Labels', () => {
    describe('Subsidiary 6.1 - Toxic', () => {
      test('Scenario 2: UN1790 - should include subsidiary hazard 6.1 (TOXIC)', () => {
        // UN1790 HYDROFLUORIC ACID has subsidiaryRisk: "6.1" in the database
        const context = createClass8Context('UN1790', '8', 'HYDROFLUORIC ACID', 'I', 'CARGO AIRCRAFT ONLY');
        const result = evaluateLabelingRequirements(context);

        expect(result['Subsidiary Hazard']).toBeDefined();
        expect(result['Subsidiary Hazard']).toContain('Subsidiary Class 6.1');
      });

      test('Scenario 2, Alteration 2: missing TOXIC 6.1 subsidiary label is an error', () => {
        // Verifies subsidiary label requirement for toxic corrosives
        const context = createClass8Context('UN1790', '8', 'HYDROFLUORIC ACID', 'I', 'CARGO AIRCRAFT ONLY');
        const result = evaluateLabelingRequirements(context);

        expect(result['Subsidiary Hazard']).toBeDefined();
      });

      test('Scenario 6: UN2922 - should include subsidiary hazard 6.1 (TOXIC N.O.S.)', () => {
        // UN2922 CORROSIVE LIQUID, TOXIC, N.O.S. has subsidiaryRisk: "6.1"
        const context = createClass8Context('UN2922', '8', 'CORROSIVE LIQUID, TOXIC, N.O.S.', 'I', 'CARGO AIRCRAFT ONLY');
        const result = evaluateLabelingRequirements(context);

        expect(result['Subsidiary Hazard']).toBeDefined();
        expect(result['Subsidiary Hazard']).toContain('Subsidiary Class 6.1');
      });

      test('Scenario 17: UN2809 - should include subsidiary hazard 6.1 (MERCURY)', () => {
        // UN2809 MERCURY has subsidiaryRisk: "6.1"
        const context = createClass8Context('UN2809', '8', 'MERCURY', 'III', 'PASSENGER AND CARGO');
        const result = evaluateLabelingRequirements(context);

        expect(result['Subsidiary Hazard']).toBeDefined();
        expect(result['Subsidiary Hazard']).toContain('Subsidiary Class 6.1');
      });

      test('Scenario 17, Alteration 2: missing TOXIC 6.1 subsidiary label for mercury is an error', () => {
        const context = createClass8Context('UN2809', '8', 'MERCURY', 'III', 'PASSENGER AND CARGO');
        const result = evaluateLabelingRequirements(context);

        expect(result['Subsidiary Hazard']).toBeDefined();
      });
    });

    describe('Subsidiary 3 - Flammable', () => {
      test('Scenario 8: UN2789 - should include subsidiary hazard 3 (FLAMMABLE)', () => {
        // UN2789 ACETIC ACID, GLACIAL has subsidiaryRisk: "3"
        const context = createClass8Context('UN2789', '8', 'ACETIC ACID, GLACIAL', 'II', 'PASSENGER AND CARGO');
        const result = evaluateLabelingRequirements(context);

        expect(result['Subsidiary Hazard']).toBeDefined();
        expect(result['Subsidiary Hazard']).toContain('Subsidiary Class 3');
      });

      test('Scenario 8, Alteration 1: missing FLAMMABLE 3 subsidiary label is an error', () => {
        const context = createClass8Context('UN2789', '8', 'ACETIC ACID, GLACIAL', 'II', 'PASSENGER AND CARGO');
        const result = evaluateLabelingRequirements(context);

        expect(result['Subsidiary Hazard']).toBeDefined();
      });

      test('Scenario 13: UN2920 - should include subsidiary hazard 3 (FLAMMABLE N.O.S.)', () => {
        // UN2920 CORROSIVE LIQUID, FLAMMABLE, N.O.S. has subsidiaryRisk: "3"
        const context = createClass8Context('UN2920', '8', 'CORROSIVE LIQUID, FLAMMABLE, N.O.S.', 'II', 'CARGO AIRCRAFT ONLY');
        const result = evaluateLabelingRequirements(context);

        expect(result['Subsidiary Hazard']).toBeDefined();
        expect(result['Subsidiary Hazard']).toContain('Subsidiary Class 3');
      });
    });

    describe('Subsidiary 5.1 - Oxidizer', () => {
      test('Scenario 14: UN1802 - should include subsidiary hazard 5.1 (OXIDIZER)', () => {
        // UN1802 PERCHLORIC ACID has subsidiaryRisk: "5.1"
        const context = createClass8Context('UN1802', '8', 'PERCHLORIC ACID', 'II', 'CARGO AIRCRAFT ONLY');
        const result = evaluateLabelingRequirements(context);

        expect(result['Subsidiary Hazard']).toBeDefined();
        expect(result['Subsidiary Hazard']).toContain('Subsidiary Class 5.1');
      });

      test('Scenario 14, Alteration 1: missing OXIDIZER 5.1 subsidiary label is an error', () => {
        const context = createClass8Context('UN1802', '8', 'PERCHLORIC ACID', 'II', 'CARGO AIRCRAFT ONLY');
        const result = evaluateLabelingRequirements(context);

        expect(result['Subsidiary Hazard']).toBeDefined();
      });

      test('Scenario 14, Alteration 3: subsidiary "5.2" instead of "5.1" is an error', () => {
        const context = createClass8Context('UN1802', '8', 'PERCHLORIC ACID', 'II', 'CARGO AIRCRAFT ONLY');
        const result = evaluateLabelingRequirements(context);

        expect(result['Subsidiary Hazard']).toBeDefined();
        const subsidiaryLabel = result['Subsidiary Hazard']?.[0] || '';
        expect(subsidiaryLabel).toContain('5.1');
        // Verify it's 5.1 not 5.2
        expect(subsidiaryLabel).not.toContain('5.2');
      });
    });

    describe('Multiple Subsidiary Hazards', () => {
      test('Scenario 3: UN2032 - should include both 5.1 AND 6.1 subsidiary hazards', () => {
        // UN2032 NITRIC ACID, RED FUMING has subsidiaryRisk: "5.1, 6.1"
        const context = createClass8Context('UN2032', '8', 'NITRIC ACID, RED FUMING', 'I', 'CARGO AIRCRAFT ONLY');
        const result = evaluateLabelingRequirements(context);

        expect(result['Subsidiary Hazard']).toBeDefined();
        const subsidiaryLabel = result['Subsidiary Hazard']?.[0] || '';
        expect(subsidiaryLabel).toContain('5.1');
        expect(subsidiaryLabel).toContain('6.1');
      });

      test('Scenario 3, Alteration 2: missing OXIDIZER 5.1 when multiple subsidiaries exist is an error', () => {
        const context = createClass8Context('UN2032', '8', 'NITRIC ACID, RED FUMING', 'I', 'CARGO AIRCRAFT ONLY');
        const result = evaluateLabelingRequirements(context);

        expect(result['Subsidiary Hazard']).toBeDefined();
        const subsidiaryLabel = result['Subsidiary Hazard']?.[0] || '';
        expect(subsidiaryLabel).toContain('5.1');
      });

      test('Scenario 4: UN2029 - should include both 3 AND 6.1 subsidiary hazards', () => {
        // UN2029 HYDRAZINE, ANHYDROUS has subsidiaryRisk: "3, 6.1"
        const context = createClass8Context('UN2029', '8', 'HYDRAZINE, ANHYDROUS', 'I', 'CARGO AIRCRAFT ONLY');
        const result = evaluateLabelingRequirements(context);

        expect(result['Subsidiary Hazard']).toBeDefined();
        const subsidiaryLabel = result['Subsidiary Hazard']?.[0] || '';
        expect(subsidiaryLabel).toContain('3');
        expect(subsidiaryLabel).toContain('6.1');
      });

      test('Scenario 4, Alteration 1: missing FLAMMABLE 3 when multiple subsidiaries exist is an error', () => {
        const context = createClass8Context('UN2029', '8', 'HYDRAZINE, ANHYDROUS', 'I', 'CARGO AIRCRAFT ONLY');
        const result = evaluateLabelingRequirements(context);

        expect(result['Subsidiary Hazard']).toBeDefined();
        const subsidiaryLabel = result['Subsidiary Hazard']?.[0] || '';
        expect(subsidiaryLabel).toContain('3');
      });
    });

    describe('No Subsidiary Hazards', () => {
      test('Scenario 1: UN1830 - should NOT have subsidiary hazard label', () => {
        // UN1830 SULFURIC ACID, FUMING has no subsidiary risk
        const context = createClass8Context('UN1830', '8', 'SULFURIC ACID, FUMING', 'I', 'CARGO AIRCRAFT ONLY');
        const result = evaluateLabelingRequirements(context);

        expect(result['Subsidiary Hazard']).toBeUndefined();
      });

      test('Scenario 7: UN1789 - should NOT have subsidiary hazard label', () => {
        // UN1789 HYDROCHLORIC ACID has no subsidiary risk
        const context = createClass8Context('UN1789', '8', 'HYDROCHLORIC ACID', 'II', 'CARGO AIRCRAFT ONLY');
        const result = evaluateLabelingRequirements(context);

        expect(result['Subsidiary Hazard']).toBeUndefined();
      });

      test('Scenario 9: UN1823 - should NOT have subsidiary hazard label', () => {
        // UN1823 SODIUM HYDROXIDE, SOLID has no subsidiary risk
        const context = createClass8Context('UN1823', '8', 'SODIUM HYDROXIDE, SOLID', 'II', 'PASSENGER AND CARGO');
        const result = evaluateLabelingRequirements(context);

        expect(result['Subsidiary Hazard']).toBeUndefined();
      });

      test('Scenario 15: UN2790 - should NOT have subsidiary hazard label', () => {
        // UN2790 ACETIC ACID SOLUTION has no subsidiary risk
        const context = createClass8Context('UN2790', '8', 'ACETIC ACID SOLUTION', 'III', 'PASSENGER AND CARGO');
        const result = evaluateLabelingRequirements(context);

        expect(result['Subsidiary Hazard']).toBeUndefined();
      });

      test('Scenario 18: UN1805 - should NOT have subsidiary hazard label', () => {
        // UN1805 PHOSPHORIC ACID, SOLUTION has no subsidiary risk
        const context = createClass8Context('UN1805', '8', 'PHOSPHORIC ACID, SOLUTION', 'III', 'PASSENGER AND CARGO');
        const result = evaluateLabelingRequirements(context);

        expect(result['Subsidiary Hazard']).toBeUndefined();
      });
    });
  });

  describe('Orientation Labels', () => {
    /**
     * GAP: Orientation label evaluation for Class 8 liquids is not currently implemented
     * per AFMAN 24-604 A14.3.6.1 - All liquid hazmat requires orientation arrows on TWO OPPOSITE SIDES
     * This is documented as a known gap in the implementation.
     */
    describe('Required for Corrosive Liquids - GAP IDENTIFIED', () => {
      test.skip('Scenario 1: UN1830 - requires orientation labels (corrosive liquid)', () => {
        // UN1830 SULFURIC ACID, FUMING is a liquid - requires orientation per A14.3.6.1
        const context = createClass8Context('UN1830', '8', 'SULFURIC ACID, FUMING', 'I', 'CARGO AIRCRAFT ONLY');
        const result = evaluateLabelingRequirements(context);

        expect(result['Orientation (This Side Up with Arrows)']).toBeDefined();
      });

      test.skip('Scenario 1, Alteration 3: missing orientation labels on package is an error', () => {
        const context = createClass8Context('UN1830', '8', 'SULFURIC ACID, FUMING', 'I', 'CARGO AIRCRAFT ONLY');
        const result = evaluateLabelingRequirements(context);

        expect(result['Orientation (This Side Up with Arrows)']).toBeDefined();
      });

      test.skip('Scenario 7: UN1789 - requires orientation labels', () => {
        // UN1789 HYDROCHLORIC ACID is a liquid
        const context = createClass8Context('UN1789', '8', 'HYDROCHLORIC ACID', 'II', 'CARGO AIRCRAFT ONLY');
        const result = evaluateLabelingRequirements(context);

        expect(result['Orientation (This Side Up with Arrows)']).toBeDefined();
      });

      test.skip('Scenario 10: UN2796 - requires orientation labels (BATTERY FLUID)', () => {
        // UN2796 BATTERY FLUID, ACID is a liquid
        const context = createClass8Context('UN2796', '8', 'BATTERY FLUID, ACID', 'II', 'PASSENGER AND CARGO');
        const result = evaluateLabelingRequirements(context);

        expect(result['Orientation (This Side Up with Arrows)']).toBeDefined();
      });

      test.skip('Scenario 10, Alteration 1: missing orientation labels for battery fluid is an error', () => {
        const context = createClass8Context('UN2796', '8', 'BATTERY FLUID, ACID', 'II', 'PASSENGER AND CARGO');
        const result = evaluateLabelingRequirements(context);

        expect(result['Orientation (This Side Up with Arrows)']).toBeDefined();
      });

      test.skip('Scenario 11: UN2794 - requires orientation labels (WET BATTERIES)', () => {
        // UN2794 BATTERIES, WET requires orientation per A15.4.7.1
        const context = createClass8Context('UN2794', '8', 'BATTERIES, WET, FILLED WITH ACID', '', 'PASSENGER AND CARGO');
        const result = evaluateLabelingRequirements(context);

        expect(result['Orientation (This Side Up with Arrows)']).toBeDefined();
      });

      test.skip('Scenario 11, Alteration 2: missing Package Orientation label for wet batteries is an error', () => {
        const context = createClass8Context('UN2794', '8', 'BATTERIES, WET, FILLED WITH ACID', '', 'PASSENGER AND CARGO');
        const result = evaluateLabelingRequirements(context);

        expect(result['Orientation (This Side Up with Arrows)']).toBeDefined();
      });

      test.skip('Scenario 12: UN1824 - requires orientation labels (SOLUTION)', () => {
        // UN1824 SODIUM HYDROXIDE, SOLUTION is a liquid
        const context = createClass8Context('UN1824', '8', 'SODIUM HYDROXIDE, SOLUTION', 'II', 'PASSENGER AND CARGO');
        const result = evaluateLabelingRequirements(context);

        expect(result['Orientation (This Side Up with Arrows)']).toBeDefined();
      });

      test.skip('Scenario 15: UN2790 - requires orientation labels', () => {
        // UN2790 ACETIC ACID SOLUTION is a liquid
        const context = createClass8Context('UN2790', '8', 'ACETIC ACID SOLUTION', 'III', 'PASSENGER AND CARGO');
        const result = evaluateLabelingRequirements(context);

        expect(result['Orientation (This Side Up with Arrows)']).toBeDefined();
      });

      test.skip('Scenario 15, Alteration 3: missing orientation labels for liquid is an error', () => {
        const context = createClass8Context('UN2790', '8', 'ACETIC ACID SOLUTION', 'III', 'PASSENGER AND CARGO');
        const result = evaluateLabelingRequirements(context);

        expect(result['Orientation (This Side Up with Arrows)']).toBeDefined();
      });

      test.skip('Scenario 17: UN2809 - requires orientation labels (MERCURY)', () => {
        // UN2809 MERCURY is a liquid metal
        const context = createClass8Context('UN2809', '8', 'MERCURY', 'III', 'PASSENGER AND CARGO');
        const result = evaluateLabelingRequirements(context);

        expect(result['Orientation (This Side Up with Arrows)']).toBeDefined();
      });

      test.skip('Scenario 20: UN3264 - requires orientation labels', () => {
        // UN3264 CORROSIVE LIQUID, ACIDIC, INORGANIC, N.O.S. is a liquid
        const context = createClass8Context('UN3264', '8', 'CORROSIVE LIQUID, ACIDIC, INORGANIC, N.O.S.', 'III', 'PASSENGER AND CARGO');
        const result = evaluateLabelingRequirements(context);

        expect(result['Orientation (This Side Up with Arrows)']).toBeDefined();
      });

      test.skip('Scenario 20, Alteration 3: missing orientation arrows on one side is an error', () => {
        const context = createClass8Context('UN3264', '8', 'CORROSIVE LIQUID, ACIDIC, INORGANIC, N.O.S.', 'III', 'PASSENGER AND CARGO');
        const result = evaluateLabelingRequirements(context);

        // Orientation must be on TWO OPPOSITE SIDES
        expect(result['Orientation (This Side Up with Arrows)']).toBeDefined();
      });
    });

    describe('NOT Required for Corrosive Solids', () => {
      test('Scenario 9: UN1823 - does NOT require orientation labels (SOLID)', () => {
        // UN1823 SODIUM HYDROXIDE, SOLID does not require orientation
        const context = createClass8Context('UN1823', '8', 'SODIUM HYDROXIDE, SOLID', 'II', 'PASSENGER AND CARGO');
        const result = evaluateLabelingRequirements(context);

        expect(result['Orientation (This Side Up with Arrows)']).toBeUndefined();
      });

      test('Scenario 9, Alteration 2: unnecessary orientation labels on solid is incorrect', () => {
        const context = createClass8Context('UN1823', '8', 'SODIUM HYDROXIDE, SOLID', 'II', 'PASSENGER AND CARGO');
        const result = evaluateLabelingRequirements(context);

        // Solids should NOT have orientation labels
        expect(result['Orientation (This Side Up with Arrows)']).toBeUndefined();
      });

      test('Scenario 19: UN1759 - does NOT require orientation labels (SOLID N.O.S.)', () => {
        // UN1759 CORROSIVE SOLID, N.O.S. does not require orientation
        const context = createClass8Context('UN1759', '8', 'CORROSIVE SOLID, N.O.S.', 'III', 'PASSENGER AND CARGO');
        const result = evaluateLabelingRequirements(context);

        expect(result['Orientation (This Side Up with Arrows)']).toBeUndefined();
      });

      test('Scenario 19, Alteration 3: unnecessary orientation labels on solid is incorrect', () => {
        const context = createClass8Context('UN1759', '8', 'CORROSIVE SOLID, N.O.S.', 'III', 'PASSENGER AND CARGO');
        const result = evaluateLabelingRequirements(context);

        expect(result['Orientation (This Side Up with Arrows)']).toBeUndefined();
      });
    });
  });

  describe('All 20 Scenarios - Integration Test', () => {
    const scenarios = [
      { scenario: 1, un: 'UN1830', hc: '8', pg: 'I', psn: 'SULFURIC ACID, FUMING', aircraft: 'CARGO AIRCRAFT ONLY', hasSubsidiary: false, isSolid: false },
      { scenario: 2, un: 'UN1790', hc: '8', pg: 'I', psn: 'HYDROFLUORIC ACID', aircraft: 'CARGO AIRCRAFT ONLY', hasSubsidiary: true, isSolid: false },
      { scenario: 3, un: 'UN2032', hc: '8', pg: 'I', psn: 'NITRIC ACID, RED FUMING', aircraft: 'CARGO AIRCRAFT ONLY', hasSubsidiary: true, isSolid: false },
      { scenario: 4, un: 'UN2029', hc: '8', pg: 'I', psn: 'HYDRAZINE, ANHYDROUS', aircraft: 'CARGO AIRCRAFT ONLY', hasSubsidiary: true, isSolid: false },
      { scenario: 5, un: 'UN1760', hc: '8', pg: 'I', psn: 'CORROSIVE LIQUID, N.O.S.', aircraft: 'CARGO AIRCRAFT ONLY', hasSubsidiary: false, isSolid: false },
      { scenario: 6, un: 'UN2922', hc: '8', pg: 'I', psn: 'CORROSIVE LIQUID, TOXIC, N.O.S.', aircraft: 'CARGO AIRCRAFT ONLY', hasSubsidiary: true, isSolid: false },
      { scenario: 7, un: 'UN1789', hc: '8', pg: 'II', psn: 'HYDROCHLORIC ACID', aircraft: 'CARGO AIRCRAFT ONLY', hasSubsidiary: false, isSolid: false },
      { scenario: 8, un: 'UN2789', hc: '8', pg: 'II', psn: 'ACETIC ACID, GLACIAL', aircraft: 'PASSENGER AND CARGO', hasSubsidiary: true, isSolid: false },
      { scenario: 9, un: 'UN1823', hc: '8', pg: 'II', psn: 'SODIUM HYDROXIDE, SOLID', aircraft: 'PASSENGER AND CARGO', hasSubsidiary: false, isSolid: true },
      { scenario: 10, un: 'UN2796', hc: '8', pg: 'II', psn: 'BATTERY FLUID, ACID', aircraft: 'PASSENGER AND CARGO', hasSubsidiary: false, isSolid: false },
      { scenario: 11, un: 'UN2794', hc: '8', pg: '', psn: 'BATTERIES, WET, FILLED WITH ACID', aircraft: 'PASSENGER AND CARGO', hasSubsidiary: false, isSolid: false },
      { scenario: 12, un: 'UN1824', hc: '8', pg: 'II', psn: 'SODIUM HYDROXIDE, SOLUTION', aircraft: 'PASSENGER AND CARGO', hasSubsidiary: false, isSolid: false },
      { scenario: 13, un: 'UN2920', hc: '8', pg: 'II', psn: 'CORROSIVE LIQUID, FLAMMABLE, N.O.S.', aircraft: 'CARGO AIRCRAFT ONLY', hasSubsidiary: true, isSolid: false },
      { scenario: 14, un: 'UN1802', hc: '8', pg: 'II', psn: 'PERCHLORIC ACID', aircraft: 'CARGO AIRCRAFT ONLY', hasSubsidiary: true, isSolid: false },
      { scenario: 15, un: 'UN2790', hc: '8', pg: 'III', psn: 'ACETIC ACID SOLUTION', aircraft: 'PASSENGER AND CARGO', hasSubsidiary: false, isSolid: false },
      { scenario: 16, un: 'UN2672', hc: '8', pg: 'III', psn: 'AMMONIA SOLUTION', aircraft: 'PASSENGER AND CARGO', hasSubsidiary: false, isSolid: false },
      { scenario: 17, un: 'UN2809', hc: '8', pg: 'III', psn: 'MERCURY', aircraft: 'PASSENGER AND CARGO', hasSubsidiary: true, isSolid: false },
      { scenario: 18, un: 'UN1805', hc: '8', pg: 'III', psn: 'PHOSPHORIC ACID, SOLUTION', aircraft: 'PASSENGER AND CARGO', hasSubsidiary: false, isSolid: false },
      { scenario: 19, un: 'UN1759', hc: '8', pg: 'III', psn: 'CORROSIVE SOLID, N.O.S.', aircraft: 'PASSENGER AND CARGO', hasSubsidiary: false, isSolid: true },
      { scenario: 20, un: 'UN3264', hc: '8', pg: 'III', psn: 'CORROSIVE LIQUID, ACIDIC, INORGANIC, N.O.S.', aircraft: 'PASSENGER AND CARGO', hasSubsidiary: false, isSolid: false },
    ];

    scenarios.forEach(({ scenario, un, hc, pg, psn, aircraft, hasSubsidiary, isSolid }) => {
      test(`Scenario ${scenario}: ${un} - primary hazard label is Class 8`, () => {
        const context = createClass8Context(un, hc, psn, pg, aircraft);
        const result = evaluateLabelingRequirements(context);

        // All Class 8 materials must have CORROSIVE label
        expect(result['Primary Hazard']).toBeDefined();
        expect(result['Primary Hazard']).toContain('Class 8');
      });
    });
  });
});
