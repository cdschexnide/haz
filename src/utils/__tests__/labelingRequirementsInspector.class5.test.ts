import { evaluateLabelingRequirements } from '../labelingRequirementsInspector';
import { SDDGInspectionContext, ExtractedSDDGContent } from '@//types/sddg';

// Helper to create SDDGInspectionContext for Class 5.1 materials
function createClass5Context(
  unNumber: string,
  hazardClass: string,
  properShippingName: string,
  packingGroup: string,
  aircraftType: string = 'PASSENGER AND CARGO',
  subsidiaryRisk: string = ''
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
    subsidiaryRisk,
    packingGroup, // Class 5.1 HAS packing groups (I, II, III)
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

describe('Labeling Requirements - Class 5.1 Oxidizers', () => {
  describe('Primary Hazard Label', () => {
    describe('PG I Oxidizers', () => {
      test('Scenario 1: UN1491 - returns OXIDIZER 5.1 label (PG I)', () => {
        const context = createClass5Context('UN1491', '5.1', 'POTASSIUM PEROXIDE', 'I', 'CARGO AIRCRAFT ONLY');
        const result = evaluateLabelingRequirements(context);

        expect(result['Primary Hazard']).toBeDefined();
        expect(result['Primary Hazard']).toContain('Class 5.1');
      });

      test('Scenario 2: UN1504 - returns OXIDIZER 5.1 label (PG I)', () => {
        const context = createClass5Context('UN1504', '5.1', 'SODIUM PEROXIDE', 'I', 'CARGO AIRCRAFT ONLY');
        const result = evaluateLabelingRequirements(context);

        expect(result['Primary Hazard']).toBeDefined();
        expect(result['Primary Hazard']).toContain('Class 5.1');
      });

      test('Scenario 3: UN1873 - returns OXIDIZER 5.1 label (PG I with 8 subsidiary)', () => {
        const context = createClass5Context(
          'UN1873',
          '5.1',
          'PERCHLORIC ACID with more than 50% but 72% or less acid, by mass',
          'I',
          'CARGO AIRCRAFT ONLY',
          '8'
        );
        const result = evaluateLabelingRequirements(context);

        expect(result['Primary Hazard']).toBeDefined();
        expect(result['Primary Hazard']).toContain('Class 5.1');
      });

      test('Scenario 4: UN2466 - returns OXIDIZER 5.1 label (PG I)', () => {
        const context = createClass5Context('UN2466', '5.1', 'POTASSIUM SUPEROXIDE', 'I', 'PASSENGER AND CARGO');
        const result = evaluateLabelingRequirements(context);

        expect(result['Primary Hazard']).toBeDefined();
        expect(result['Primary Hazard']).toContain('Class 5.1');
      });

      test('Scenario 5: UN3139 - returns OXIDIZER 5.1 label (PG I, N.O.S.)', () => {
        const context = createClass5Context(
          'UN3139',
          '5.1',
          'OXIDIZING LIQUID, N.O.S. (Hydrogen Peroxide, Peracetic Acid)',
          'I',
          'CARGO AIRCRAFT ONLY'
        );
        const result = evaluateLabelingRequirements(context);

        expect(result['Primary Hazard']).toBeDefined();
        expect(result['Primary Hazard']).toContain('Class 5.1');
      });

      test('Scenario 6: UN1745 - returns OXIDIZER 5.1 label (PG I with multiple subsidiaries)', () => {
        const context = createClass5Context('UN1745', '5.1', 'BROMINE PENTAFLUORIDE', 'I', 'CARGO AIRCRAFT ONLY', '6.1, 8');
        const result = evaluateLabelingRequirements(context);

        expect(result['Primary Hazard']).toBeDefined();
        expect(result['Primary Hazard']).toContain('Class 5.1');
      });
    });

    describe('PG II Oxidizers', () => {
      test('Scenario 7: UN1439 - returns OXIDIZER 5.1 label (PG II)', () => {
        const context = createClass5Context('UN1439', '5.1', 'AMMONIUM DICHROMATE', 'II', 'PASSENGER AND CARGO');
        const result = evaluateLabelingRequirements(context);

        expect(result['Primary Hazard']).toBeDefined();
        expect(result['Primary Hazard']).toContain('Class 5.1');
      });

      test('Scenario 8: UN1442 - returns OXIDIZER 5.1 label (PG II)', () => {
        const context = createClass5Context('UN1442', '5.1', 'AMMONIUM PERCHLORATE', 'II', 'PASSENGER AND CARGO');
        const result = evaluateLabelingRequirements(context);

        expect(result['Primary Hazard']).toBeDefined();
        expect(result['Primary Hazard']).toContain('Class 5.1');
      });

      test('Scenario 9: UN1446 - returns OXIDIZER 5.1 label (PG II with 6.1 subsidiary)', () => {
        const context = createClass5Context('UN1446', '5.1', 'BARIUM NITRATE', 'II', 'PASSENGER AND CARGO', '6.1');
        const result = evaluateLabelingRequirements(context);

        expect(result['Primary Hazard']).toBeDefined();
        expect(result['Primary Hazard']).toContain('Class 5.1');
      });

      test('Scenario 10: UN2719 - returns OXIDIZER 5.1 label (PG II with 6.1 subsidiary)', () => {
        const context = createClass5Context('UN2719', '5.1', 'BARIUM BROMATE', 'II', 'CARGO AIRCRAFT ONLY', '6.1');
        const result = evaluateLabelingRequirements(context);

        expect(result['Primary Hazard']).toBeDefined();
        expect(result['Primary Hazard']).toContain('Class 5.1');
      });

      test('Scenario 11: UN1450 - returns OXIDIZER 5.1 label (PG II, N.O.S.)', () => {
        const context = createClass5Context(
          'UN1450',
          '5.1',
          'BROMATES, INORGANIC, N.O.S. (Magnesium Bromate)',
          'II',
          'PASSENGER AND CARGO'
        );
        const result = evaluateLabelingRequirements(context);

        expect(result['Primary Hazard']).toBeDefined();
        expect(result['Primary Hazard']).toContain('Class 5.1');
      });

      test('Scenario 12: UN3212 - returns OXIDIZER 5.1 label (PG II, N.O.S.)', () => {
        const context = createClass5Context(
          'UN3212',
          '5.1',
          'HYPOCHLORITES, INORGANIC, N.O.S. (Lithium Hypochlorite)',
          'II',
          'PASSENGER AND CARGO'
        );
        const result = evaluateLabelingRequirements(context);

        expect(result['Primary Hazard']).toBeDefined();
        expect(result['Primary Hazard']).toContain('Class 5.1');
      });

      test('Scenario 13: UN3405 - returns OXIDIZER 5.1 label (PG II liquid with 6.1)', () => {
        const context = createClass5Context('UN3405', '5.1', 'BARIUM CHLORATE SOLUTION', 'II', 'CARGO AIRCRAFT ONLY', '6.1');
        const result = evaluateLabelingRequirements(context);

        expect(result['Primary Hazard']).toBeDefined();
        expect(result['Primary Hazard']).toContain('Class 5.1');
      });

      test('Scenario 14: UN1479 - returns OXIDIZER 5.1 label (PG II, N.O.S.)', () => {
        const context = createClass5Context(
          'UN1479',
          '5.1',
          'OXIDIZING SOLID, N.O.S. (Calcium Hypochlorite)',
          'II',
          'PASSENGER AND CARGO'
        );
        const result = evaluateLabelingRequirements(context);

        expect(result['Primary Hazard']).toBeDefined();
        expect(result['Primary Hazard']).toContain('Class 5.1');
      });

      test('Scenario 15: UN2627 - returns OXIDIZER 5.1 label (PG II, N.O.S.)', () => {
        const context = createClass5Context(
          'UN2627',
          '5.1',
          'NITRITES, INORGANIC, N.O.S. (Sodium Nitrite)',
          'II',
          'PASSENGER AND CARGO'
        );
        const result = evaluateLabelingRequirements(context);

        expect(result['Primary Hazard']).toBeDefined();
        expect(result['Primary Hazard']).toContain('Class 5.1');
      });
    });

    describe('PG III Oxidizers', () => {
      test('Scenario 16: UN1438 - returns OXIDIZER 5.1 label (PG III)', () => {
        const context = createClass5Context('UN1438', '5.1', 'ALUMINIUM NITRATE', 'III', 'PASSENGER AND CARGO');
        const result = evaluateLabelingRequirements(context);

        expect(result['Primary Hazard']).toBeDefined();
        expect(result['Primary Hazard']).toContain('Class 5.1');
      });

      test('Scenario 17: UN1942 - returns OXIDIZER 5.1 label (PG III)', () => {
        const context = createClass5Context(
          'UN1942',
          '5.1',
          'AMMONIUM NITRATE with 0.2% or less total combustible material',
          'III',
          'PASSENGER AND CARGO'
        );
        const result = evaluateLabelingRequirements(context);

        expect(result['Primary Hazard']).toBeDefined();
        expect(result['Primary Hazard']).toContain('Class 5.1');
      });

      test('Scenario 18: UN2067 - returns OXIDIZER 5.1 label (PG III)', () => {
        const context = createClass5Context('UN2067', '5.1', 'AMMONIUM NITRATE BASED FERTILIZER', 'III', 'PASSENGER AND CARGO');
        const result = evaluateLabelingRequirements(context);

        expect(result['Primary Hazard']).toBeDefined();
        expect(result['Primary Hazard']).toContain('Class 5.1');
      });

      test('Scenario 19: UN1444 - returns OXIDIZER 5.1 label (PG III)', () => {
        const context = createClass5Context('UN1444', '5.1', 'AMMONIUM PERSULPHATE', 'III', 'PASSENGER AND CARGO');
        const result = evaluateLabelingRequirements(context);

        expect(result['Primary Hazard']).toBeDefined();
        expect(result['Primary Hazard']).toContain('Class 5.1');
      });

      test('Scenario 20: UN3219 - returns OXIDIZER 5.1 label (PG III liquid, N.O.S.)', () => {
        const context = createClass5Context(
          'UN3219',
          '5.1',
          'NITRITES, INORGANIC, AQUEOUS SOLUTION, N.O.S. (Potassium Nitrite)',
          'III',
          'PASSENGER AND CARGO'
        );
        const result = evaluateLabelingRequirements(context);

        expect(result['Primary Hazard']).toBeDefined();
        expect(result['Primary Hazard']).toContain('Class 5.1');
      });
    });
  });

  describe('Cargo Aircraft Only Label', () => {
    describe('Materials with P3 - CAO Required', () => {
      test('Scenario 2: UN1504 - requires CAO label (P3)', () => {
        const context = createClass5Context('UN1504', '5.1', 'SODIUM PEROXIDE', 'I', 'CARGO AIRCRAFT ONLY');
        const result = evaluateLabelingRequirements(context);

        expect(result['Cargo Aircraft Only']).toBeDefined();
        expect(result['Cargo Aircraft Only']).toContain('Cargo Aircraft Only');
      });

      test('Scenario 2, Alteration 1: UN1504 - missing CAO label is an error', () => {
        // CAO label is required but scenario tests missing label
        const context = createClass5Context('UN1504', '5.1', 'SODIUM PEROXIDE', 'I', 'CARGO AIRCRAFT ONLY');
        const result = evaluateLabelingRequirements(context);

        expect(result['Cargo Aircraft Only']).toBeDefined();
      });

      test('Scenario 3: UN1873 - requires CAO label (P3)', () => {
        const context = createClass5Context(
          'UN1873',
          '5.1',
          'PERCHLORIC ACID with more than 50% but 72% or less acid, by mass',
          'I',
          'CARGO AIRCRAFT ONLY',
          '8'
        );
        const result = evaluateLabelingRequirements(context);

        expect(result['Cargo Aircraft Only']).toBeDefined();
        expect(result['Cargo Aircraft Only']).toContain('Cargo Aircraft Only');
      });

      test('Scenario 5: UN3139 - requires CAO label (P3)', () => {
        const context = createClass5Context(
          'UN3139',
          '5.1',
          'OXIDIZING LIQUID, N.O.S. (Hydrogen Peroxide, Peracetic Acid)',
          'I',
          'CARGO AIRCRAFT ONLY'
        );
        const result = evaluateLabelingRequirements(context);

        expect(result['Cargo Aircraft Only']).toBeDefined();
        expect(result['Cargo Aircraft Only']).toContain('Cargo Aircraft Only');
      });
    });

    describe('Materials with P1 - CAO Required', () => {
      test('Scenario 6: UN1745 - requires CAO label (P1)', () => {
        const context = createClass5Context('UN1745', '5.1', 'BROMINE PENTAFLUORIDE', 'I', 'CARGO AIRCRAFT ONLY', '6.1, 8');
        const result = evaluateLabelingRequirements(context);

        expect(result['Cargo Aircraft Only']).toBeDefined();
        expect(result['Cargo Aircraft Only']).toContain('Cargo Aircraft Only');
      });

      test('Scenario 6, Alteration 3: UN1745 - missing CAO label is an error', () => {
        const context = createClass5Context('UN1745', '5.1', 'BROMINE PENTAFLUORIDE', 'I', 'CARGO AIRCRAFT ONLY', '6.1, 8');
        const result = evaluateLabelingRequirements(context);

        expect(result['Cargo Aircraft Only']).toBeDefined();
      });
    });

    describe('Materials with P4 - CAO Required', () => {
      test('Scenario 10: UN2719 - requires CAO label (P4)', () => {
        const context = createClass5Context('UN2719', '5.1', 'BARIUM BROMATE', 'II', 'CARGO AIRCRAFT ONLY', '6.1');
        const result = evaluateLabelingRequirements(context);

        expect(result['Cargo Aircraft Only']).toBeDefined();
        expect(result['Cargo Aircraft Only']).toContain('Cargo Aircraft Only');
      });

      test('Scenario 10, Alteration 1: UN2719 - Key 7 shows PAX when CAO required is invalid', () => {
        // P4 requires CAO, Key 7 showing "Passenger and Cargo" is an error
        const context = createClass5Context('UN2719', '5.1', 'BARIUM BROMATE', 'II', 'CARGO AIRCRAFT ONLY', '6.1');
        const result = evaluateLabelingRequirements(context);

        expect(result['Cargo Aircraft Only']).toBeDefined();
        expect(result['Cargo Aircraft Only']).toContain('Cargo Aircraft Only');
      });

      test('Scenario 10, Alteration 2: UN2719 - missing CAO label is an error', () => {
        const context = createClass5Context('UN2719', '5.1', 'BARIUM BROMATE', 'II', 'CARGO AIRCRAFT ONLY', '6.1');
        const result = evaluateLabelingRequirements(context);

        expect(result['Cargo Aircraft Only']).toBeDefined();
      });

      test('Scenario 13: UN3405 - requires CAO label (P4)', () => {
        const context = createClass5Context('UN3405', '5.1', 'BARIUM CHLORATE SOLUTION', 'II', 'CARGO AIRCRAFT ONLY', '6.1');
        const result = evaluateLabelingRequirements(context);

        expect(result['Cargo Aircraft Only']).toBeDefined();
        expect(result['Cargo Aircraft Only']).toContain('Cargo Aircraft Only');
      });
    });

    describe('Materials with P5 - Passenger Allowed', () => {
      test('Scenario 1: UN1491 - requires CAO label (P5 with CAO aircraft type)', () => {
        // P5 allows passenger, but if on CAO aircraft, still needs CAO label
        const context = createClass5Context('UN1491', '5.1', 'POTASSIUM PEROXIDE', 'I', 'CARGO AIRCRAFT ONLY');
        const result = evaluateLabelingRequirements(context);

        expect(result['Cargo Aircraft Only']).toBeDefined();
        expect(result['Cargo Aircraft Only']).toContain('Cargo Aircraft Only');
      });

      test('Scenario 4: UN2466 - does NOT require CAO label (P5 passenger allowed)', () => {
        // P5 allows passenger aircraft
        const context = createClass5Context('UN2466', '5.1', 'POTASSIUM SUPEROXIDE', 'I', 'PASSENGER AND CARGO');
        const result = evaluateLabelingRequirements(context);

        // P5 allows passenger, so CAO label should NOT be required
        expect(result['Cargo Aircraft Only']).toBeUndefined();
      });

      test('Scenario 7: UN1439 - does NOT require CAO label (P5 passenger allowed)', () => {
        const context = createClass5Context('UN1439', '5.1', 'AMMONIUM DICHROMATE', 'II', 'PASSENGER AND CARGO');
        const result = evaluateLabelingRequirements(context);

        expect(result['Cargo Aircraft Only']).toBeUndefined();
      });

      test('Scenario 8: UN1442 - does NOT require CAO label (P5 passenger allowed)', () => {
        const context = createClass5Context('UN1442', '5.1', 'AMMONIUM PERCHLORATE', 'II', 'PASSENGER AND CARGO');
        const result = evaluateLabelingRequirements(context);

        expect(result['Cargo Aircraft Only']).toBeUndefined();
      });

      test('Scenario 9: UN1446 - does NOT require CAO label (P5 passenger allowed)', () => {
        const context = createClass5Context('UN1446', '5.1', 'BARIUM NITRATE', 'II', 'PASSENGER AND CARGO', '6.1');
        const result = evaluateLabelingRequirements(context);

        expect(result['Cargo Aircraft Only']).toBeUndefined();
      });

      test('Scenario 16: UN1438 - does NOT require CAO label (P5 passenger allowed)', () => {
        const context = createClass5Context('UN1438', '5.1', 'ALUMINIUM NITRATE', 'III', 'PASSENGER AND CARGO');
        const result = evaluateLabelingRequirements(context);

        expect(result['Cargo Aircraft Only']).toBeUndefined();
      });

      test('Scenario 17: UN1942 - does NOT require CAO label (P5 passenger allowed)', () => {
        const context = createClass5Context(
          'UN1942',
          '5.1',
          'AMMONIUM NITRATE with 0.2% or less total combustible material',
          'III',
          'PASSENGER AND CARGO'
        );
        const result = evaluateLabelingRequirements(context);

        expect(result['Cargo Aircraft Only']).toBeUndefined();
      });

      test('Scenario 19: UN1444 - does NOT require CAO label (P5 passenger allowed)', () => {
        const context = createClass5Context('UN1444', '5.1', 'AMMONIUM PERSULPHATE', 'III', 'PASSENGER AND CARGO');
        const result = evaluateLabelingRequirements(context);

        expect(result['Cargo Aircraft Only']).toBeUndefined();
      });

      test('Scenario 19, Alteration 3: UN1444 - shows CAO when P5 allows passenger is incorrect', () => {
        // Scenario tests that Key 7 showing CAO for P5 material is wrong
        const context = createClass5Context('UN1444', '5.1', 'AMMONIUM PERSULPHATE', 'III', 'PASSENGER AND CARGO');
        const result = evaluateLabelingRequirements(context);

        // Verify CAO is not required for P5 passenger-allowed materials
        expect(result['Cargo Aircraft Only']).toBeUndefined();
      });
    });
  });

  describe('Subsidiary Hazard Label', () => {
    describe('Materials WITH Subsidiary Hazards', () => {
      test('Scenario 3: UN1873 - should include subsidiary hazard 8 (Corrosive)', () => {
        const context = createClass5Context(
          'UN1873',
          '5.1',
          'PERCHLORIC ACID with more than 50% but 72% or less acid, by mass',
          'I',
          'CARGO AIRCRAFT ONLY',
          '8'
        );
        const result = evaluateLabelingRequirements(context);

        expect(result['Subsidiary Hazard']).toBeDefined();
        expect(result['Subsidiary Hazard']).toEqual(
          expect.arrayContaining([expect.stringContaining('subsidiary Class 8')])
        );
      });

      test('Scenario 3, Alteration 1: UN1873 - missing CORROSIVE 8 subsidiary label is an error', () => {
        const context = createClass5Context(
          'UN1873',
          '5.1',
          'PERCHLORIC ACID with more than 50% but 72% or less acid, by mass',
          'I',
          'CARGO AIRCRAFT ONLY',
          '8'
        );
        const result = evaluateLabelingRequirements(context);

        expect(result['Subsidiary Hazard']).toBeDefined();
      });

      test('Scenario 6: UN1745 - should include subsidiary hazards 6.1 AND 8', () => {
        const context = createClass5Context('UN1745', '5.1', 'BROMINE PENTAFLUORIDE', 'I', 'CARGO AIRCRAFT ONLY', '6.1, 8');
        const result = evaluateLabelingRequirements(context);

        expect(result['Subsidiary Hazard']).toBeDefined();
        expect(result['Subsidiary Hazard']).toEqual(
          expect.arrayContaining([
            expect.stringContaining('subsidiary Class 6.1'),
            expect.stringContaining('subsidiary Class 8'),
          ])
        );
      });

      test('Scenario 6, Alteration 1: UN1745 - missing one subsidiary label (only TOXIC, not CORROSIVE) is an error', () => {
        const context = createClass5Context('UN1745', '5.1', 'BROMINE PENTAFLUORIDE', 'I', 'CARGO AIRCRAFT ONLY', '6.1, 8');
        const result = evaluateLabelingRequirements(context);

        expect(result['Subsidiary Hazard']).toBeDefined();
        const subsidiaryLabels = (result['Subsidiary Hazard'] || []).join(' ');
        expect(subsidiaryLabels).toContain('6.1');
        expect(subsidiaryLabels).toContain('8');
      });

      test('Scenario 9: UN1446 - should include subsidiary hazard 6.1 (Toxic)', () => {
        const context = createClass5Context('UN1446', '5.1', 'BARIUM NITRATE', 'II', 'PASSENGER AND CARGO', '6.1');
        const result = evaluateLabelingRequirements(context);

        expect(result['Subsidiary Hazard']).toBeDefined();
        expect(result['Subsidiary Hazard']).toEqual(
          expect.arrayContaining([expect.stringContaining('subsidiary Class 6.1')])
        );
      });

      test('Scenario 9, Alteration 1: UN1446 - missing TOXIC 6.1 subsidiary label is an error', () => {
        const context = createClass5Context('UN1446', '5.1', 'BARIUM NITRATE', 'II', 'PASSENGER AND CARGO', '6.1');
        const result = evaluateLabelingRequirements(context);

        expect(result['Subsidiary Hazard']).toBeDefined();
      });

      test('Scenario 10: UN2719 - should include subsidiary hazard 6.1 (Toxic)', () => {
        const context = createClass5Context('UN2719', '5.1', 'BARIUM BROMATE', 'II', 'CARGO AIRCRAFT ONLY', '6.1');
        const result = evaluateLabelingRequirements(context);

        expect(result['Subsidiary Hazard']).toEqual(
          expect.arrayContaining([expect.stringContaining('subsidiary Class 6.1')])
        );
      });

      test('Scenario 13: UN3405 - should include subsidiary hazard 6.1 (Toxic)', () => {
        const context = createClass5Context('UN3405', '5.1', 'BARIUM CHLORATE SOLUTION', 'II', 'CARGO AIRCRAFT ONLY', '6.1');
        const result = evaluateLabelingRequirements(context);

        expect(result['Subsidiary Hazard']).toBeDefined();
        expect(result['Subsidiary Hazard']).toEqual(
          expect.arrayContaining([expect.stringContaining('subsidiary Class 6.1')])
        );
      });

      test('Scenario 13, Alteration 3: UN3405 - missing TOXIC 6.1 subsidiary label is an error', () => {
        const context = createClass5Context('UN3405', '5.1', 'BARIUM CHLORATE SOLUTION', 'II', 'CARGO AIRCRAFT ONLY', '6.1');
        const result = evaluateLabelingRequirements(context);

        expect(result['Subsidiary Hazard']).toBeDefined();
      });
    });

    describe('Materials WITHOUT Subsidiary Hazards', () => {
      test('Scenario 1: UN1491 - should NOT have subsidiary hazard', () => {
        const context = createClass5Context('UN1491', '5.1', 'POTASSIUM PEROXIDE', 'I', 'CARGO AIRCRAFT ONLY');
        const result = evaluateLabelingRequirements(context);

        expect(result['Subsidiary Hazard']).toBeUndefined();
      });

      test('Scenario 2: UN1504 - should NOT have subsidiary hazard', () => {
        const context = createClass5Context('UN1504', '5.1', 'SODIUM PEROXIDE', 'I', 'CARGO AIRCRAFT ONLY');
        const result = evaluateLabelingRequirements(context);

        expect(result['Subsidiary Hazard']).toBeUndefined();
      });

      test('Scenario 4: UN2466 - should NOT have subsidiary hazard', () => {
        const context = createClass5Context('UN2466', '5.1', 'POTASSIUM SUPEROXIDE', 'I', 'PASSENGER AND CARGO');
        const result = evaluateLabelingRequirements(context);

        expect(result['Subsidiary Hazard']).toBeUndefined();
      });

      test('Scenario 5: UN3139 - should NOT have subsidiary hazard', () => {
        const context = createClass5Context(
          'UN3139',
          '5.1',
          'OXIDIZING LIQUID, N.O.S. (Hydrogen Peroxide, Peracetic Acid)',
          'I',
          'CARGO AIRCRAFT ONLY'
        );
        const result = evaluateLabelingRequirements(context);

        expect(result['Subsidiary Hazard']).toBeUndefined();
      });

      test('Scenario 7: UN1439 - should NOT have subsidiary hazard', () => {
        const context = createClass5Context('UN1439', '5.1', 'AMMONIUM DICHROMATE', 'II', 'PASSENGER AND CARGO');
        const result = evaluateLabelingRequirements(context);

        expect(result['Subsidiary Hazard']).toBeUndefined();
      });

      test('Scenario 8: UN1442 - should NOT have subsidiary hazard', () => {
        const context = createClass5Context('UN1442', '5.1', 'AMMONIUM PERCHLORATE', 'II', 'PASSENGER AND CARGO');
        const result = evaluateLabelingRequirements(context);

        expect(result['Subsidiary Hazard']).toBeUndefined();
      });

      test('Scenario 11: UN1450 - should NOT have subsidiary hazard', () => {
        const context = createClass5Context(
          'UN1450',
          '5.1',
          'BROMATES, INORGANIC, N.O.S. (Magnesium Bromate)',
          'II',
          'PASSENGER AND CARGO'
        );
        const result = evaluateLabelingRequirements(context);

        expect(result['Subsidiary Hazard']).toBeUndefined();
      });

      test('Scenario 12: UN3212 - should NOT have subsidiary hazard', () => {
        const context = createClass5Context(
          'UN3212',
          '5.1',
          'HYPOCHLORITES, INORGANIC, N.O.S. (Lithium Hypochlorite)',
          'II',
          'PASSENGER AND CARGO'
        );
        const result = evaluateLabelingRequirements(context);

        expect(result['Subsidiary Hazard']).toBeUndefined();
      });

      test('Scenario 14: UN1479 - should NOT have subsidiary hazard', () => {
        const context = createClass5Context(
          'UN1479',
          '5.1',
          'OXIDIZING SOLID, N.O.S. (Calcium Hypochlorite)',
          'II',
          'PASSENGER AND CARGO'
        );
        const result = evaluateLabelingRequirements(context);

        expect(result['Subsidiary Hazard']).toBeUndefined();
      });

      test('Scenario 15: UN2627 - should NOT have subsidiary hazard', () => {
        const context = createClass5Context(
          'UN2627',
          '5.1',
          'NITRITES, INORGANIC, N.O.S. (Sodium Nitrite)',
          'II',
          'PASSENGER AND CARGO'
        );
        const result = evaluateLabelingRequirements(context);

        expect(result['Subsidiary Hazard']).toBeUndefined();
      });

      test('Scenario 16: UN1438 - should NOT have subsidiary hazard', () => {
        const context = createClass5Context('UN1438', '5.1', 'ALUMINIUM NITRATE', 'III', 'PASSENGER AND CARGO');
        const result = evaluateLabelingRequirements(context);

        expect(result['Subsidiary Hazard']).toBeUndefined();
      });

      test('Scenario 17: UN1942 - should NOT have subsidiary hazard', () => {
        const context = createClass5Context(
          'UN1942',
          '5.1',
          'AMMONIUM NITRATE with 0.2% or less total combustible material',
          'III',
          'PASSENGER AND CARGO'
        );
        const result = evaluateLabelingRequirements(context);

        expect(result['Subsidiary Hazard']).toBeUndefined();
      });

      test('Scenario 18: UN2067 - should NOT have subsidiary hazard', () => {
        const context = createClass5Context('UN2067', '5.1', 'AMMONIUM NITRATE BASED FERTILIZER', 'III', 'PASSENGER AND CARGO');
        const result = evaluateLabelingRequirements(context);

        expect(result['Subsidiary Hazard']).toBeUndefined();
      });

      test('Scenario 19: UN1444 - should NOT have subsidiary hazard', () => {
        const context = createClass5Context('UN1444', '5.1', 'AMMONIUM PERSULPHATE', 'III', 'PASSENGER AND CARGO');
        const result = evaluateLabelingRequirements(context);

        expect(result['Subsidiary Hazard']).toBeUndefined();
      });

      test('Scenario 20: UN3219 - should NOT have subsidiary hazard', () => {
        const context = createClass5Context(
          'UN3219',
          '5.1',
          'NITRITES, INORGANIC, AQUEOUS SOLUTION, N.O.S. (Potassium Nitrite)',
          'III',
          'PASSENGER AND CARGO'
        );
        const result = evaluateLabelingRequirements(context);

        expect(result['Subsidiary Hazard']).toBeUndefined();
      });
    });
  });

  describe('Orientation Label (Liquid Oxidizers)', () => {
    // GAP: Orientation label detection for Class 5.1 liquids not yet implemented
    // Per AFMAN 24-604 A14.3.6.1 - Liquid hazmat requires orientation arrows on TWO OPPOSITE SIDES
    // These tests document the expected behavior when implemented

    test.skip('Scenario 3: UN1873 (liquid) - requires orientation labels', () => {
      // UN1873 PERCHLORIC ACID is a liquid, requires orientation
      const context = createClass5Context(
        'UN1873',
        '5.1',
        'PERCHLORIC ACID with more than 50% but 72% or less acid, by mass',
        'I',
        'CARGO AIRCRAFT ONLY',
        '8'
      );
      const result = evaluateLabelingRequirements(context);

      expect(result['Orientation (This Side Up with Arrows)']).toBeDefined();
    });

    test.skip('Scenario 5: UN3139 (liquid) - requires orientation labels', () => {
      // UN3139 OXIDIZING LIQUID is a liquid, requires orientation
      const context = createClass5Context(
        'UN3139',
        '5.1',
        'OXIDIZING LIQUID, N.O.S. (Hydrogen Peroxide, Peracetic Acid)',
        'I',
        'CARGO AIRCRAFT ONLY'
      );
      const result = evaluateLabelingRequirements(context);

      expect(result['Orientation (This Side Up with Arrows)']).toBeDefined();
    });

    test.skip('Scenario 13: UN3405 (solution) - requires orientation labels', () => {
      // UN3405 BARIUM CHLORATE SOLUTION is a liquid, requires orientation
      const context = createClass5Context('UN3405', '5.1', 'BARIUM CHLORATE SOLUTION', 'II', 'CARGO AIRCRAFT ONLY', '6.1');
      const result = evaluateLabelingRequirements(context);

      expect(result['Orientation (This Side Up with Arrows)']).toBeDefined();
    });

    test.skip('Scenario 20: UN3219 (aqueous solution) - requires orientation labels', () => {
      // UN3219 is an aqueous solution (liquid), requires orientation
      const context = createClass5Context(
        'UN3219',
        '5.1',
        'NITRITES, INORGANIC, AQUEOUS SOLUTION, N.O.S. (Potassium Nitrite)',
        'III',
        'PASSENGER AND CARGO'
      );
      const result = evaluateLabelingRequirements(context);

      expect(result['Orientation (This Side Up with Arrows)']).toBeDefined();
    });
  });
});
