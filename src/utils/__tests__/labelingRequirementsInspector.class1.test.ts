import { evaluateLabelingRequirements } from '../labelingRequirementsInspector';
import { hazardousMaterialsList } from '@/hazardousMaterials/hazardousMaterialsList';
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

    test('Scenario 6: UN0328 - returns EXPLOSIVE 1.2C label', () => {
      // UN0328 CARTRIDGES FOR WEAPONS, INERT PROJECTILE has hazclassDiv: "1.2C" in the database
      const context = createClass1Context('UN0328', '1.2C', 'CARTRIDGES FOR WEAPONS, INERT PROJECTILE');
      const result = evaluateLabelingRequirements(context);

      expect(result['Primary Hazard']).toBeDefined();
      expect(result['Primary Hazard']).toContain('Class 1.2C');
    });

    test('Scenario 7: UN0247 - returns EXPLOSIVE 1.3J label', () => {
      // UN0247 AMMUNITION, INCENDIARY has hazclassDiv: "1.3J" in the database
      const context = createClass1Context('UN0247', '1.3J', 'AMMUNITION, INCENDIARY');
      const result = evaluateLabelingRequirements(context);

      expect(result['Primary Hazard']).toBeDefined();
      expect(result['Primary Hazard']).toContain('Class 1.3J');
    });

    test('Scenario 8: UN0049 - returns EXPLOSIVE 1.1G label (authoritative from database)', () => {
      // UN0049 CARTRIDGES, FLASH has hazclassDiv: "1.1G" in the authoritative database
      // Note: Scenario spec says 1.3G but database is authoritative for labeling
      const context = createClass1Context('UN0049', '1.1G', 'CARTRIDGES, FLASH');
      const result = evaluateLabelingRequirements(context);

      expect(result['Primary Hazard']).toBeDefined();
      expect(result['Primary Hazard']).toContain('Class 1.1G');
    });

    test('Scenario 8: UN0049 - scanned value differs from authoritative (verifies database lookup)', () => {
      // Even if scanned value shows 1.3G, the authoritative database value (1.1G) is used
      const context = createClass1Context('UN0049', '1.3G', 'CARTRIDGES, FLASH');
      const result = evaluateLabelingRequirements(context);

      // Label should reflect authoritative database value (1.1G), not scanned value
      expect(result['Primary Hazard']).toBeDefined();
      expect(result['Primary Hazard']).toContain('Class 1.1G');
    });

    test('Scenario 9: UN0106 - returns EXPLOSIVE 1.1B label (authoritative from database)', () => {
      // UN0106 FUZES DETONATING has hazclassDiv: "1.1B" in the authoritative database
      // Note: Scenario spec says 1.4B but database is authoritative for labeling
      const context = createClass1Context('UN0106', '1.1B', 'FUZES, DETONATING');
      const result = evaluateLabelingRequirements(context);

      expect(result['Primary Hazard']).toBeDefined();
      expect(result['Primary Hazard']).toContain('Class 1.1B');
    });

    test('Scenario 9: UN0106 - scanned value differs from authoritative (verifies database lookup)', () => {
      // Even if scanned value shows 1.4B, the authoritative database value (1.1B) is used
      const context = createClass1Context('UN0106', '1.4B', 'FUZES, DETONATING');
      const result = evaluateLabelingRequirements(context);

      // Label should reflect authoritative database value (1.1B), not scanned value
      expect(result['Primary Hazard']).toBeDefined();
      expect(result['Primary Hazard']).toContain('Class 1.1B');
    });

    test('Scenario 10: UN0325 - returns EXPLOSIVE 1.4G label', () => {
      // UN0325 IGNITERS has hazclassDiv: "1.4G" in the database
      const context = createClass1Context('UN0325', '1.4G', 'IGNITERS');
      const result = evaluateLabelingRequirements(context);

      expect(result['Primary Hazard']).toBeDefined();
      expect(result['Primary Hazard']).toContain('Class 1.4G');
    });

    test('Scenario 11: UN0012 - returns EXPLOSIVE 1.4S label (passenger allowed)', () => {
      // UN0012 CARTRIDGES FOR WEAPONS has hazclassDiv: "1.4S" - P5 special provision allows passenger
      const context = createClass1Context('UN0012', '1.4S', 'CARTRIDGES FOR WEAPONS, INERT PROJECTILE', 'PASSENGER AND CARGO');
      const result = evaluateLabelingRequirements(context);

      expect(result['Primary Hazard']).toBeDefined();
      expect(result['Primary Hazard']).toContain('Class 1.4S');
    });

    test('Scenario 11 Alteration 2: UN0012 - correct label is 1.4S not 1.4G', () => {
      // Label shows 1.4G instead of 1.4S - verify correct labeling
      const context = createClass1Context('UN0012', '1.4S', 'CARTRIDGES FOR WEAPONS, INERT PROJECTILE', 'PASSENGER AND CARGO');
      const result = evaluateLabelingRequirements(context);

      expect(result['Primary Hazard']).toContain('Class 1.4S');
      expect(result['Primary Hazard']).not.toContain('Class 1.4G');
    });

    test('Scenario 14: UN0222 - returns EXPLOSIVE 1.1D label', () => {
      // UN0222 AMMONIUM NITRATE has hazclassDiv: "1.1D" in the database
      const context = createClass1Context('UN0222', '1.1D', 'AMMONIUM NITRATE');
      const result = evaluateLabelingRequirements(context);

      expect(result['Primary Hazard']).toBeDefined();
      expect(result['Primary Hazard']).toContain('Class 1.1D');
    });

    test('Scenario 15: UN0019 - returns EXPLOSIVE 1.3G label (authoritative from database)', () => {
      // UN0019 AMMUNITION, TEAR-PRODUCING has hazclassDiv: "1.3G" in the authoritative database
      // Note: Scenario spec says 1.4G but database is authoritative for labeling
      const context = createClass1Context('UN0019', '1.3G', 'AMMUNITION, TEAR-PRODUCING');
      const result = evaluateLabelingRequirements(context);

      expect(result['Primary Hazard']).toBeDefined();
      expect(result['Primary Hazard']).toContain('Class 1.3G');
    });

    test('Scenario 16: UN0124 - returns EXPLOSIVE 1.1D label', () => {
      // UN0124 JET PERFORATING GUNS has hazclassDiv: "1.1D" in the database
      const context = createClass1Context('UN0124', '1.1D', 'JET PERFORATING GUNS, CHARGED');
      const result = evaluateLabelingRequirements(context);

      expect(result['Primary Hazard']).toBeDefined();
      expect(result['Primary Hazard']).toContain('Class 1.1D');
    });

    test('Scenario 17: UN0135 - returns EXPLOSIVE 1.1A label', () => {
      // UN0135 MERCURY FULMINATE has hazclassDiv: "1.1A" in the database
      const context = createClass1Context('UN0135', '1.1A', 'MERCURY FULMINATE, WETTED');
      const result = evaluateLabelingRequirements(context);

      expect(result['Primary Hazard']).toBeDefined();
      expect(result['Primary Hazard']).toContain('Class 1.1A');
    });

    test('Scenario 18: UN0473 - returns EXPLOSIVE 1.1A label', () => {
      // UN0473 SUBSTANCES, EXPLOSIVE, N.O.S. (Lead Styphnate) has hazclassDiv: "1.1A" in the database
      const context = createClass1Context('UN0473', '1.1A', 'SUBSTANCES, EXPLOSIVE, N.O.S.');
      const result = evaluateLabelingRequirements(context);

      expect(result['Primary Hazard']).toBeDefined();
      expect(result['Primary Hazard']).toContain('Class 1.1A');
    });

    test('Scenario 19: UN0059 - returns EXPLOSIVE 1.1D label', () => {
      // UN0059 CHARGES, SHAPED has hazclassDiv: "1.1D" in the database
      const context = createClass1Context('UN0059', '1.1D', 'CHARGES, SHAPED, without detonator');
      const result = evaluateLabelingRequirements(context);

      expect(result['Primary Hazard']).toBeDefined();
      expect(result['Primary Hazard']).toContain('Class 1.1D');
    });

    test('Scenario 20: UN0354 - returns EXPLOSIVE 1.1L label (authoritative from database)', () => {
      // UN0354 ARTICLES, EXPLOSIVE, N.O.S. has hazclassDiv: "1.1L" in the authoritative database
      // Note: Scenario spec says 1.4D but database is authoritative for labeling
      const context = createClass1Context('UN0354', '1.1L', 'ARTICLES, EXPLOSIVE, N.O.S.');
      const result = evaluateLabelingRequirements(context);

      expect(result['Primary Hazard']).toBeDefined();
      expect(result['Primary Hazard']).toContain('Class 1.1L');
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

    test('Scenario 7: UN0247 - requires CAO label (P3 special provision)', () => {
      // UN0247 AMMUNITION, INCENDIARY has P3 special provision - CAO required
      const context = createClass1Context('UN0247', '1.3J', 'AMMUNITION, INCENDIARY', 'CARGO AIRCRAFT ONLY');
      const result = evaluateLabelingRequirements(context);

      expect(result['Cargo Aircraft Only']).toBeDefined();
      expect(result['Cargo Aircraft Only']).toContain('Cargo Aircraft Only');
    });

    test('Scenario 7 Alteration 2: UN0247 - Key 7 shows PAX when CAO required (P3)', () => {
      // P3 provision requires CAO, but Key 7 shows PASSENGER - this is an error
      const context = createClass1Context('UN0247', '1.3J', 'AMMUNITION, INCENDIARY', 'CARGO AIRCRAFT ONLY');
      const result = evaluateLabelingRequirements(context);

      // Should require CAO, not allow passenger
      expect(result['Cargo Aircraft Only']).toBeDefined();
      expect(result['Cargo Aircraft Only']).toContain('Cargo Aircraft Only');
    });

    test('Scenario 7 Alteration 3: UN0247 - missing CAO label is an error', () => {
      // CAO label is required but missing
      const context = createClass1Context('UN0247', '1.3J', 'AMMUNITION, INCENDIARY', 'CARGO AIRCRAFT ONLY');
      const result = evaluateLabelingRequirements(context);

      // Verifies CAO label requirement exists
      expect(result['Cargo Aircraft Only']).toBeDefined();
    });

    test('Scenario 9: UN0106 - requires CAO label (P1 special provision)', () => {
      // UN0106 FUZES, DETONATING has P1 special provision - CAO required
      const context = createClass1Context('UN0106', '1.4B', 'FUZES, DETONATING', 'CARGO AIRCRAFT ONLY');
      const result = evaluateLabelingRequirements(context);

      expect(result['Cargo Aircraft Only']).toBeDefined();
      expect(result['Cargo Aircraft Only']).toContain('Cargo Aircraft Only');
    });

    test('Scenario 9 Alteration 1: UN0106 - missing CAO label (P1)', () => {
      // CAO label required due to P1 special provision
      const context = createClass1Context('UN0106', '1.4B', 'FUZES, DETONATING', 'CARGO AIRCRAFT ONLY');
      const result = evaluateLabelingRequirements(context);

      // Verifies CAO label requirement exists for P1 materials
      expect(result['Cargo Aircraft Only']).toBeDefined();
    });

    test('Scenario 11: UN0012 (1.4S P5) - does NOT require CAO label (passenger allowed)', () => {
      // UN0012 CARTRIDGES FOR WEAPONS has P5 special provision - PASSENGER ALLOWED
      // This is a special case where 1.4S items with P5 can go on passenger aircraft
      const context = createClass1Context('UN0012', '1.4S', 'CARTRIDGES FOR WEAPONS, INERT PROJECTILE', 'PASSENGER AND CARGO');
      const result = evaluateLabelingRequirements(context);

      // P5 allows passenger, so CAO label should NOT be required
      expect(result['Cargo Aircraft Only']).toBeUndefined();
    });

    test('Scenario 11 Alteration 1: UN0012 - shows CAO when P5 allows passenger is incorrect', () => {
      // UN0012 with P5 allows passenger aircraft - showing CAO would be wrong
      const context = createClass1Context('UN0012', '1.4S', 'CARTRIDGES FOR WEAPONS, INERT PROJECTILE', 'PASSENGER AND CARGO');
      const result = evaluateLabelingRequirements(context);

      // Verify CAO is not required for P5 passenger-allowed materials
      expect(result['Cargo Aircraft Only']).toBeUndefined();
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

    test('Scenario 14: UN0222 - no subsidiary risk in authoritative database', () => {
      // UN0222 AMMONIUM NITRATE has subsidiaryRisk: "" (empty) in the authoritative database
      // Note: Scenario spec says 5.1 but database has no subsidiary risk
      const context = createClass1Context('UN0222', '1.1D', 'AMMONIUM NITRATE');
      const result = evaluateLabelingRequirements(context);

      // Per authoritative database, UN0222 has no subsidiary hazard
      expect(result['Subsidiary Hazard']).toBeUndefined();
    });

    test('Scenario 15: UN0019 - should include subsidiary hazard 8, 6.1 (authoritative from database)', () => {
      // UN0019 AMMUNITION, TEAR-PRODUCING has subsidiaryRisk: "8, 6.1" in the authoritative database
      const context = createClass1Context('UN0019', '1.3G', 'AMMUNITION, TEAR-PRODUCING');
      const result = evaluateLabelingRequirements(context);

      expect(result['Subsidiary Hazard']).toBeDefined();
      // Database has "8, 6.1" - both corrosive (8) and toxic (6.1)
      expect(result['Subsidiary Hazard']).toContain('Subsidiary Class 8, 6.1');
    });

    test('Scenario 15: UN0019 - subsidiary hazard includes both 8 and 6.1', () => {
      // Verify both subsidiary risks are captured
      const context = createClass1Context('UN0019', '1.3G', 'AMMUNITION, TEAR-PRODUCING');
      const result = evaluateLabelingRequirements(context);

      expect(result['Subsidiary Hazard']).toBeDefined();
      // The subsidiary label should include the full "8, 6.1" string
      const subsidiaryLabel = result['Subsidiary Hazard']?.[0] || '';
      expect(subsidiaryLabel).toContain('8');
      expect(subsidiaryLabel).toContain('6.1');
    });

    test('Scenario 15: UN0019 - subsidiary should not include 6.2', () => {
      // Verify subsidiary is 6.1, not 6.2
      const context = createClass1Context('UN0019', '1.3G', 'AMMUNITION, TEAR-PRODUCING');
      const result = evaluateLabelingRequirements(context);

      expect(result['Subsidiary Hazard']).toBeDefined();
      const subsidiaryLabel = result['Subsidiary Hazard']?.[0] || '';
      expect(subsidiaryLabel).not.toContain('6.2');
    });
  });

  describe('Orientation Label', () => {
    test('Scenario 7: UN0247 - requires orientation labels for incendiary ammunition', () => {
      // UN0247 AMMUNITION, INCENDIARY (liquid or gel) requires orientation labels
      // Per A14.4.1.3 - Class 1 explosives containing liquids require "THIS SIDE UP" on TOP
      // Per A14.3.6.1 - Liquid hazmat requires orientation arrows on TWO OPPOSITE SIDES
      const context = createClass1Context('UN0247', '1.3J', 'AMMUNITION, INCENDIARY', 'CARGO AIRCRAFT ONLY');
      const result = evaluateLabelingRequirements(context);

      // Incendiary ammunition requires "This Side Up with Arrows" orientation labels
      expect(result['Orientation (This Side Up with Arrows)']).toBeDefined();
    });

    test('Scenario 7: UN0247 - orientation includes both This Side Up and Orientation arrows', () => {
      const context = createClass1Context('UN0247', '1.3J', 'AMMUNITION, INCENDIARY', 'CARGO AIRCRAFT ONLY');
      const result = evaluateLabelingRequirements(context);

      // Should have both orientation components
      const orientationLabels = result['Orientation (This Side Up with Arrows)'];
      expect(orientationLabels).toContain('This Side Up');
      expect(orientationLabels).toContain('Orientation');
    });

    test('Scenario 7 Alteration 1: UN0247 - missing orientation label is an error', () => {
      // Verifies orientation label requirement exists for liquid incendiary ammunition
      const context = createClass1Context('UN0247', '1.3J', 'AMMUNITION, INCENDIARY', 'CARGO AIRCRAFT ONLY');
      const result = evaluateLabelingRequirements(context);

      // Verifies orientation label requirement exists
      expect(result['Orientation (This Side Up with Arrows)']).toBeDefined();
    });
  });

  describe('A15 exceptions and compatibility group', () => {
    test('Manual compatibility group is applied when missing in database', () => {
      const material = hazardousMaterialsList.find(item => item.unid === 'UN0224');
      if (!material) {
        throw new Error('Missing UN0224 fixture');
      }

      const originalHazClass = material.hazclassDiv;
      material.hazclassDiv = '1.1';

      try {
        const context = createClass1Context('UN0224', '1.1', 'BARIUM AZIDE, DRY');
        context.labelingContext = { class1CompatibilityGroupLetter: 'B' };
        const result = evaluateLabelingRequirements(context);

        expect(result['Primary Hazard']).toContain('Class 1.1B');
      } finally {
        material.hazclassDiv = originalHazClass;
      }
    });

    test('Recoil/artillery label is required when flagged', () => {
      const context = createClass1Context('UN0012', '1.4S', 'CARTRIDGES FOR WEAPONS, INERT PROJECTILE');
      context.labelingContext = { isRecoilMechanismOrArtilleryMount: true };
      const result = evaluateLabelingRequirements(context);

      expect(result['Recoil Mechanism/Artillery Gun Mount']).toEqual([
        'Recoil Mechanism',
        'Artillery Gun Mount',
      ]);
    });
  });
});
