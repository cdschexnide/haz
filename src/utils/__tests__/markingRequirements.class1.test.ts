import { evaluateMarkingRequirements, RequiredMarking } from '../markingRequirements';
import { HazProPreparerContext } from '../../contexts/HazProPreparerProvider/reducer';
import { HazardousMaterialItem, PhysicalState, QuantityUnit } from '../../../types';

/**
 * Creates a minimal HazProPreparerContext for Class 1 (Explosives) testing.
 *
 * Class 1 materials are explosives with hazclass divisions like 1.1A, 1.1D, 1.2D, etc.
 * Unlike other classes, Class 1 materials typically:
 * - Have no packing group (empty string)
 * - Use specialized packaging paragraphs (e.g., A3.3.1.)
 * - Require EX numbers for identification (GAP - not currently implemented)
 * - Require Military Shipping Labels (GAP - not currently implemented)
 */
function createClass1Context(
  unNumber: string,
  hazardClass: string,
  properShippingName: string,
  options: {
    usesPopMarking?: boolean;
    isLimitedQuantity?: boolean;
    isExceptedQuantity?: boolean;
    usesCaaCertification?: boolean;
    usesCoeCertification?: boolean;
    inputPOPMarking?: {
      B?: string | null;
      C?: string | null;
      D?: string | null;
      E?: string | null;
      F?: string | null;
      G?: string | null;
      H?: string | null;
    };
  } = {}
): HazProPreparerContext {
  const {
    usesPopMarking = false,
    isLimitedQuantity = false,
    isExceptedQuantity = false,
    usesCaaCertification = false,
    usesCoeCertification = false,
    inputPOPMarking,
  } = options;

  const hazardousMaterial: HazardousMaterialItem = {
    isFixed: '',
    isDomesticShipment: false,
    isTechnicalNameRequired: false,
    unid: unNumber,
    properShippingName,
    hazclassDiv: hazardClass,
    subsidiaryRisk: '',
    packingGroup: '', // Class 1 explosives typically have no packing group
    specialProvision: '',
    packagingParagraph: 'A3.3.1.',
    physicalState: PhysicalState.SOLID,
  };

  return {
    hazardousMaterial,
    lookupFunctionsOutput: null,
    modifiersAndRequiredAcknowledgements: null,
    preparer: null,
    overpack: false,
    usesCoeCertification,
    usesCaaCertification,
    usesDotSpPermit: false,
    isLimitedQuantity,
    isExceptedQuantity,
    shipment: {
      poeOption: 'Channel',
      podOption: 'Channel',
      tcn: 'TEST123',
      poe: 'DOV',
      pod: 'RMS',
      isChapter3: 'No',
    },
    grandfatheredExplosivesContainers: [],
    un3166Details: {
      vehicleNomenclature: '',
      quantity: null,
      fuel: null,
      fuelEntryMode: null,
      unit: 'liters',
      tankCount: 0,
      multiTanks: [],
      accessorialHazards: {
        batteries: {
          accessorialHazardousMaterialIdentification: null,
          quantity: '',
        },
        fireExtinguishers: {
          accessorialHazardousMaterialIdentification: null,
          quantity: '',
        },
        starterFluid: {
          accessorialHazardousMaterialIdentification: null,
          volume: {
            liters: null,
            gallons: null,
          },
        },
        other: [],
      },
    },
    activePersona: 'Preparer',
    emergencyPhoneNumberMap: {
      class1Explosives: [],
      class7RadioactiveMaterial: [],
      allOtherHazardousMaterials: {
        domestic: { phoneNumber: '' },
        international: { phoneNumber: '' },
      },
    },
    allowablePackingGroups: '',
    packaging: {
      packagingType: 'Single',
      usesPopMarking,
      usesDotCylinderMarking: false,
      inputPOPMarking: inputPOPMarking
        ? {
            A: 'UN',
            B: inputPOPMarking.B ?? null,
            C: inputPOPMarking.C ?? null,
            D: inputPOPMarking.D ?? null,
            E: inputPOPMarking.E ?? null,
            F: inputPOPMarking.F ?? null,
            G: inputPOPMarking.G ?? null,
            H: inputPOPMarking.H ?? null,
          }
        : undefined,
      cylinderDetails: {
        numberOfCylinders: '',
        quantityPerCylinder: {
          lbs: '',
          kgs: '',
        },
        unit: QuantityUnit.LBS,
      },
      totalNetMass: {
        lbs: 0,
        kg: 0,
      },
      totalNetVolume: {
        liters: 0,
        gallons: 0,
      },
      combinationPackaging: {
        massPerInnerContainer: {
          lbs: 0,
          kg: 0,
        },
        volumePerInnerContainer: {
          liters: 0,
          gallons: 0,
        },
      },
      popIsValid: true,
    },
    shipper: null,
    consignee: null,
    technicalName: '',
    activeStep: null,
    activeSubstep: null,
    completedSubsteps: [],
    absorbentStepRequired: false,
    key19Annotations: [],
    additionalHandlingInfo: {
      accessorialHazmat: [],
      notes: [],
    },
  };
}

describe('Marking Requirements - Class 1 Explosives', () => {
  describe('Proper Shipping Name and UN Number', () => {
    test('Scenario 1: UN0224 - includes PSN and UN number', () => {
      // UN0224 BARIUM AZIDE is a Class 1.1A explosive
      const context = createClass1Context('UN0224', '1.1A', 'BARIUM AZIDE, DRY');
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toContain('UN0224');
      expect(psnMarking?.value).toContain('BARIUM AZIDE');
    });

    test('Scenario 2: UN0027 - includes full PSN with qualifier', () => {
      // UN0027 BLACK POWDER (GUNPOWDER) is a Class 1.1D explosive
      const context = createClass1Context('UN0027', '1.1D', 'BLACK POWDER, compressed or BLACK POWDER, IN PELLETS (GUNPOWDER)');
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toContain('UN0027');
      expect(psnMarking?.value).toContain('(GUNPOWDER)');
    });

    test('Scenario 3: UN0467 - includes full PSN for N.O.S. material', () => {
      // UN0467 ARTICLES, EXPLOSIVE, N.O.S. is a Class 1.2D explosive
      const context = createClass1Context('UN0467', '1.2D', 'ARTICLES, EXPLOSIVE, N.O.S.');
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toContain('UN0467');
      expect(psnMarking?.value).toContain('ARTICLES, EXPLOSIVE, N.O.S.');
    });

    test('Scenario 4: UN0004 - AMMONIUM PICRATE marking', () => {
      // UN0004 AMMONIUM PICRATE is a Class 1.1D explosive
      const context = createClass1Context('UN0004', '1.1D', 'AMMONIUM PICRATE, dry or wetted with less than 10 percent water, by mass');
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toContain('UN0004');
      expect(psnMarking?.value).toContain('AMMONIUM PICRATE');
    });

    test('PSN marking is always first in the returned array', () => {
      const context = createClass1Context('UN0224', '1.1A', 'BARIUM AZIDE, DRY');
      const result = evaluateMarkingRequirements(context);

      expect(result.length).toBeGreaterThan(0);
      expect(result[0].id).toBe('proper-shipping-name-unid');
    });

    test('PSN marking has correct label', () => {
      const context = createClass1Context('UN0224', '1.1A', 'BARIUM AZIDE, DRY');
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking?.label).toBe('Proper Shipping Name and UN Number');
    });
  });

  describe('POP Marking', () => {
    test('Class 1 materials require POP marking when packaging.usesPopMarking is true', () => {
      const context = createClass1Context('UN0224', '1.1A', 'BARIUM AZIDE, DRY', {
        usesPopMarking: true,
        inputPOPMarking: {
          B: '1A2',
          C: 'X',
          D: '25',
          E: 'S',
          F: '12',
          G: 'USA',
          H: 'DOD',
        },
      });
      const result = evaluateMarkingRequirements(context);

      const popMarking = result.find((m) => m.id === 'pop-marking');
      expect(popMarking).toBeDefined();
      expect(popMarking?.renderType).toBe('pop');
    });

    test('POP marking includes metadata with packaging specification fields', () => {
      const context = createClass1Context('UN0027', '1.1D', 'BLACK POWDER', {
        usesPopMarking: true,
        inputPOPMarking: {
          B: '4G',
          C: 'Y',
          D: '20',
          E: 'S',
          F: '11',
          G: 'USA',
          H: 'DOD',
        },
      });
      const result = evaluateMarkingRequirements(context);

      const popMarking = result.find((m) => m.id === 'pop-marking');
      expect(popMarking).toBeDefined();
      expect(popMarking?.metadata).toBeDefined();
      expect(popMarking?.metadata?.B).toBe('4G');
      expect(popMarking?.metadata?.G).toBe('USA');
    });

    test('POP marking is NOT required when isLimitedQuantity is true', () => {
      // Per A19.3, limited quantities do not require UN specification packaging
      const context = createClass1Context('UN0027', '1.1D', 'BLACK POWDER', {
        usesPopMarking: true,
        isLimitedQuantity: true,
        inputPOPMarking: {
          B: '4G',
          C: 'Y',
          D: '20',
          E: 'S',
          F: '11',
          G: 'USA',
          H: 'DOD',
        },
      });
      const result = evaluateMarkingRequirements(context);

      const popMarking = result.find((m) => m.id === 'pop-marking');
      expect(popMarking).toBeUndefined();
    });

    test('POP marking is NOT required when usesCaaCertification is true', () => {
      const context = createClass1Context('UN0224', '1.1A', 'BARIUM AZIDE, DRY', {
        usesPopMarking: true,
        usesCaaCertification: true,
      });
      const result = evaluateMarkingRequirements(context);

      const popMarking = result.find((m) => m.id === 'pop-marking');
      expect(popMarking).toBeUndefined();
    });

    test('POP marking is NOT required when usesCoeCertification is true', () => {
      const context = createClass1Context('UN0224', '1.1A', 'BARIUM AZIDE, DRY', {
        usesPopMarking: true,
        usesCoeCertification: true,
      });
      const result = evaluateMarkingRequirements(context);

      const popMarking = result.find((m) => m.id === 'pop-marking');
      expect(popMarking).toBeUndefined();
    });

    test('POP marking is NOT present when usesPopMarking is false', () => {
      const context = createClass1Context('UN0224', '1.1A', 'BARIUM AZIDE, DRY', {
        usesPopMarking: false,
      });
      const result = evaluateMarkingRequirements(context);

      const popMarking = result.find((m) => m.id === 'pop-marking');
      expect(popMarking).toBeUndefined();
    });

    test('POP marking has correct label', () => {
      const context = createClass1Context('UN0224', '1.1A', 'BARIUM AZIDE, DRY', {
        usesPopMarking: true,
        inputPOPMarking: {
          B: '1A2',
          C: 'X',
          D: '25',
          E: 'S',
          F: '12',
          G: 'USA',
          H: 'DOD',
        },
      });
      const result = evaluateMarkingRequirements(context);

      const popMarking = result.find((m) => m.id === 'pop-marking');
      expect(popMarking?.label).toBe('POP Marking, stenciled and/or printed');
    });
  });

  describe('Excepted Quantity Marking', () => {
    test('Excepted quantity materials ONLY return E marking (no PSN or POP)', () => {
      // Per A19.2, excepted quantities are exempt from all other markings
      const context = createClass1Context('UN0027', '1.1D', 'BLACK POWDER', {
        isExceptedQuantity: true,
        usesPopMarking: true,
      });
      const result = evaluateMarkingRequirements(context);

      // Should only have the E marking
      expect(result.length).toBe(1);
      expect(result[0].id).toBe('excepted-quantity-e-marking');
      expect(result[0].renderType).toBe('custom');
    });

    test('E marking includes hazard class information', () => {
      const context = createClass1Context('UN0224', '1.1A', 'BARIUM AZIDE', {
        isExceptedQuantity: true,
      });
      const result = evaluateMarkingRequirements(context);

      const eMarking = result.find((m) => m.id === 'excepted-quantity-e-marking');
      expect(eMarking).toBeDefined();
      expect(eMarking?.value).toContain('1.1A');
    });
  });

  describe('EX Number Marking - GAP IDENTIFIED', () => {
    /**
     * GAP: EX number marking is required per AFMAN 24-604 for Class 1 explosives
     * but is not currently implemented in markingRequirements.ts
     *
     * Per AFMAN 24-604:
     * - The EX number is a unique identifier assigned by the competent authority
     * - Must be marked on packages containing Class 1 materials
     * - Format: "EX" followed by the number (e.g., EX-2020-12345)
     *
     * This test documents the gap and should be enabled when the feature is implemented.
     */
    test.skip('Scenario 1, Alteration 2: EX number should be required for Class 1', () => {
      // GAP: EX number marking is required per AFMAN 24-604 but not
      // currently implemented in markingRequirements.ts
      const context = createClass1Context('UN0224', '1.1A', 'BARIUM AZIDE, DRY');
      const result = evaluateMarkingRequirements(context);

      const exNumberMarking = result.find((m) => m.id === 'ex-number');
      expect(exNumberMarking).toBeDefined();
      expect(exNumberMarking?.label).toContain('EX Number');
    });

    test.skip('EX number should include the approval number value', () => {
      // GAP: When implemented, the EX number value should be populated
      // from the explosive's certification data
      const context = createClass1Context('UN0027', '1.1D', 'BLACK POWDER');
      const result = evaluateMarkingRequirements(context);

      const exNumberMarking = result.find((m) => m.id === 'ex-number');
      expect(exNumberMarking).toBeDefined();
      expect(exNumberMarking?.value).toMatch(/^EX-\d{4}-\d+$/);
    });
  });

  describe('Military Shipping Label - GAP IDENTIFIED', () => {
    /**
     * GAP: Military Shipping Label (MSL) is required per AFMAN 24-604 for Class 1 explosives
     * but is not currently implemented in markingRequirements.ts
     *
     * Per AFMAN 24-604:
     * - MSL is required for all military shipments of Class 1 materials
     * - Contains critical shipping information including NSN, lot number, etc.
     * - Format follows DD Form 1387 requirements
     *
     * This test documents the gap and should be enabled when the feature is implemented.
     */
    test.skip('Scenario 2, Alteration 3: MSL should be required for Class 1', () => {
      // GAP: MSL is required per AFMAN 24-604 but not implemented
      const context = createClass1Context('UN0467', '1.2D', 'ARTICLES, EXPLOSIVE, N.O.S.');
      const result = evaluateMarkingRequirements(context);

      const mslMarking = result.find((m) => m.id === 'military-shipping-label');
      expect(mslMarking).toBeDefined();
      expect(mslMarking?.label).toContain('Military Shipping Label');
    });

    test.skip('MSL should include NSN and lot number metadata', () => {
      // GAP: When implemented, MSL should include National Stock Number
      // and lot number for Class 1 materials
      const context = createClass1Context('UN0027', '1.1D', 'BLACK POWDER');
      const result = evaluateMarkingRequirements(context);

      const mslMarking = result.find((m) => m.id === 'military-shipping-label');
      expect(mslMarking).toBeDefined();
      expect(mslMarking?.metadata?.nsn).toBeDefined();
      expect(mslMarking?.metadata?.lotNumber).toBeDefined();
    });
  });

  describe('Limited Quantity Marking', () => {
    test('Limited quantity materials include limited quantity marking', () => {
      const context = createClass1Context('UN0027', '1.1D', 'BLACK POWDER', {
        isLimitedQuantity: true,
      });
      const result = evaluateMarkingRequirements(context);

      const ltdQtyMarking = result.find((m) => m.id === 'limited-quantity');
      expect(ltdQtyMarking).toBeDefined();
      expect(ltdQtyMarking?.label).toBe('Limited Quantity');
    });

    test('Non-limited quantity materials do NOT include limited quantity marking', () => {
      const context = createClass1Context('UN0027', '1.1D', 'BLACK POWDER', {
        isLimitedQuantity: false,
      });
      const result = evaluateMarkingRequirements(context);

      const ltdQtyMarking = result.find((m) => m.id === 'limited-quantity');
      expect(ltdQtyMarking).toBeUndefined();
    });
  });

  describe('Overpack Marking', () => {
    test('Overpack marking is included when overpack is true', () => {
      const context = createClass1Context('UN0224', '1.1A', 'BARIUM AZIDE, DRY');
      context.overpack = true;
      const result = evaluateMarkingRequirements(context);

      const overpackMarking = result.find((m) => m.id === 'overpack');
      expect(overpackMarking).toBeDefined();
      expect(overpackMarking?.label).toBe('OVERPACK');
    });

    test('Overpack marking is NOT included when overpack is false', () => {
      const context = createClass1Context('UN0224', '1.1A', 'BARIUM AZIDE, DRY');
      context.overpack = false;
      const result = evaluateMarkingRequirements(context);

      const overpackMarking = result.find((m) => m.id === 'overpack');
      expect(overpackMarking).toBeUndefined();
    });
  });
});
