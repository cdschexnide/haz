import { evaluateLabelingRequirements } from '../labelingRequirementsInspector';
import { SDDGInspectionContext, ExtractedSDDGContent } from '@//types/sddg';

// Helper to create SDDGInspectionContext for Class 1 materials
function createClass1Context(
  unNumber: string,
  hazardClass: string,
  properShippingName: string,
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
    packingGroup: '', // Class 1 has no packing group
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

describe('Labeling Requirements - Class 1 Explosives', () => {
  describe('Primary Hazard Label', () => {
    test('Scenario 1: UN0224 - returns EXPLOSIVE 1.1A label', () => {
      // UN0224 BARIUM AZIDE has hazclassDiv: "1.1A" in the database
      const context = createClass1Context('UN0224', '1.1A', 'BARIUM AZIDE, DRY');
      const result = evaluateLabelingRequirements(context);

      expect(result['Primary Hazard']).toBeDefined();
      expect(result['Primary Hazard']).toContain('Class 1.1A');
    });

    test('Scenario 2: UN0027 - returns EXPLOSIVE 1.1D label (D compatibility)', () => {
      // UN0027 BLACK POWDER has hazclassDiv: "1.1D" in the database
      const context = createClass1Context('UN0027', '1.1D', 'BLACK POWDER');
      const result = evaluateLabelingRequirements(context);

      expect(result['Primary Hazard']).toBeDefined();
      expect(result['Primary Hazard']).toContain('Class 1.1D');
    });

    test('Scenario 3: UN0467 - returns EXPLOSIVE 1.2D label (different division)', () => {
      // UN0467 ARTICLES, EXPLOSIVE, N.O.S. has hazclassDiv: "1.2D" in the database
      const context = createClass1Context('UN0467', '1.2D', 'ARTICLES, EXPLOSIVE, N.O.S.');
      const result = evaluateLabelingRequirements(context);

      expect(result['Primary Hazard']).toBeDefined();
      expect(result['Primary Hazard']).toContain('Class 1.2D');
    });

    test('Scenario 4: UN0004 - returns EXPLOSIVE 1.1D label', () => {
      // UN0004 AMMONIUM PICRATE has hazclassDiv: "1.1D" in the database
      const context = createClass1Context('UN0004', '1.1D', 'AMMONIUM PICRATE');
      const result = evaluateLabelingRequirements(context);

      expect(result['Primary Hazard']).toBeDefined();
      expect(result['Primary Hazard']).toContain('Class 1.1D');
    });

    test('Scenario 5: UN0160 - returns EXPLOSIVE 1.1C label', () => {
      // UN0160 POWDER, SMOKELESS has hazclassDiv: "1.1C" in the database
      const context = createClass1Context('UN0160', '1.1C', 'POWDER, SMOKELESS');
      const result = evaluateLabelingRequirements(context);

      expect(result['Primary Hazard']).toBeDefined();
      expect(result['Primary Hazard']).toContain('Class 1.1C');
    });

    test('Scenario 6: UN0136 - returns EXPLOSIVE 1.1F label', () => {
      // UN0136 MINES has hazclassDiv: "1.1F" in the database
      const context = createClass1Context('UN0136', '1.1F', 'MINES with bursting charge');
      const result = evaluateLabelingRequirements(context);

      expect(result['Primary Hazard']).toBeDefined();
      expect(result['Primary Hazard']).toContain('Class 1.1F');
    });
  });

  describe('Cargo Aircraft Only Label', () => {
    test('Scenario 1: UN0224 (1.1A) with CARGO AIRCRAFT ONLY - requires CAO label', () => {
      const context = createClass1Context('UN0224', '1.1A', 'BARIUM AZIDE, DRY', 'CARGO AIRCRAFT ONLY');
      const result = evaluateLabelingRequirements(context);

      expect(result['Cargo Aircraft Only']).toBeDefined();
      expect(result['Cargo Aircraft Only']).toContain('Cargo Aircraft Only');
    });

    test('All Division 1.1 materials with CAO aircraft type require CAO label', () => {
      const materials = [
        { un: 'UN0224', class: '1.1A', psn: 'BARIUM AZIDE' },
        { un: 'UN0027', class: '1.1D', psn: 'BLACK POWDER' },
        { un: 'UN0004', class: '1.1D', psn: 'AMMONIUM PICRATE' },
        { un: 'UN0160', class: '1.1C', psn: 'POWDER, SMOKELESS' },
      ];

      materials.forEach(({ un, class: hc, psn }) => {
        const context = createClass1Context(un, hc, psn, 'CARGO AIRCRAFT ONLY');
        const result = evaluateLabelingRequirements(context);
        expect(result['Cargo Aircraft Only']).toBeDefined();
        expect(result['Cargo Aircraft Only']).toContain('Cargo Aircraft Only');
      });
    });

    test('Division 1.2 with CAO aircraft type also requires CAO label', () => {
      // UN0467 is Division 1.2D
      const context = createClass1Context('UN0467', '1.2D', 'ARTICLES, EXPLOSIVE, N.O.S.', 'CARGO AIRCRAFT ONLY');
      const result = evaluateLabelingRequirements(context);

      expect(result['Cargo Aircraft Only']).toBeDefined();
      expect(result['Cargo Aircraft Only']).toContain('Cargo Aircraft Only');
    });

    test('Materials with special provision P3 require CAO label regardless of aircraft type', () => {
      // UN0224 has specialProvision: "P3, 111, 117" - P3 triggers CAO requirement
      const context = createClass1Context('UN0224', '1.1A', 'BARIUM AZIDE', 'PASSENGER AND CARGO');
      const result = evaluateLabelingRequirements(context);

      // P3 provision should still require CAO label
      expect(result['Cargo Aircraft Only']).toBeDefined();
      expect(result['Cargo Aircraft Only']).toContain('Cargo Aircraft Only');
    });

    test('Materials with special provision P4 require CAO label regardless of aircraft type', () => {
      // UN0027 has specialProvision: "P4" - P4 triggers CAO requirement
      const context = createClass1Context('UN0027', '1.1D', 'BLACK POWDER', 'PASSENGER AND CARGO');
      const result = evaluateLabelingRequirements(context);

      // P4 provision should still require CAO label
      expect(result['Cargo Aircraft Only']).toBeDefined();
      expect(result['Cargo Aircraft Only']).toContain('Cargo Aircraft Only');
    });
  });

  describe('Subsidiary Hazard Label', () => {
    test('UN0224 - should include subsidiary hazard 6.1 (toxic)', () => {
      // UN0224 BARIUM AZIDE has subsidiaryRisk: "6.1" in the database
      const context = createClass1Context('UN0224', '1.1A', 'BARIUM AZIDE, DRY');
      const result = evaluateLabelingRequirements(context);

      expect(result['Subsidiary Hazard']).toBeDefined();
      expect(result['Subsidiary Hazard']).toContain('Subsidiary Class 6.1');
    });

    test('UN0027 - should NOT have subsidiary hazard (no subsidiary risk)', () => {
      // UN0027 BLACK POWDER has subsidiaryRisk: "" in the database
      const context = createClass1Context('UN0027', '1.1D', 'BLACK POWDER');
      const result = evaluateLabelingRequirements(context);

      expect(result['Subsidiary Hazard']).toBeUndefined();
    });
  });
});
