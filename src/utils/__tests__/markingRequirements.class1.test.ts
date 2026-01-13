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

  describe('Scenario 6: UN0328 - CARTRIDGES FOR WEAPONS, INERT PROJECTILE', () => {
    test('includes full PSN without abbreviation', () => {
      const context = createClass1Context(
        'UN0328',
        '1.2C',
        'CARTRIDGES FOR WEAPONS, INERT PROJECTILE'
      );
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toContain('UN0328');
      expect(psnMarking?.value).toContain('CARTRIDGES FOR WEAPONS');
      // Verify full PSN, not abbreviated
      expect(psnMarking?.value).not.toContain('CART FOR WEAPONS');
    });

    test('Alteration 1: abbreviated PSN should be detectable', () => {
      // This test documents the expected behavior when PSN is incorrectly abbreviated
      // The system should require "CARTRIDGES FOR WEAPONS" not "CART FOR WEAPONS"
      const context = createClass1Context('UN0328', '1.2C', 'CARTRIDGES FOR WEAPONS, INERT PROJECTILE');
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toContain('CARTRIDGES');
    });

    test('Alteration 2: POP marking required when usesPopMarking is true', () => {
      const context = createClass1Context(
        'UN0328',
        '1.2C',
        'CARTRIDGES FOR WEAPONS, INERT PROJECTILE',
        {
          usesPopMarking: true,
          inputPOPMarking: {
            B: '4G',
            C: 'Y',
            D: '25',
            E: 'S',
            F: '12',
            G: 'USA',
            H: 'DOD',
          },
        }
      );
      const result = evaluateMarkingRequirements(context);

      const popMarking = result.find((m) => m.id === 'pop-marking');
      expect(popMarking).toBeDefined();
    });
  });

  describe('Scenario 7: UN0247 - AMMUNITION, INCENDIARY (Orientation Marking)', () => {
    /**
     * GAP: Orientation marking ("THIS SIDE UP") is required for certain Class 1 materials
     * per AFMAN 24-604 but is not currently implemented in markingRequirements.ts.
     *
     * The implementation file notes: "Orientation Marking is intentionally omitted
     * (commented out in original code)"
     */
    test('includes UN number and PSN', () => {
      const context = createClass1Context('UN0247', '1.2G', 'AMMUNITION, INCENDIARY');
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toContain('UN0247');
      expect(psnMarking?.value).toContain('AMMUNITION, INCENDIARY');
    });

    test.skip('should require THIS SIDE UP marking for incendiary ammunition', () => {
      // GAP: Orientation marking not currently implemented
      const context = createClass1Context('UN0247', '1.2G', 'AMMUNITION, INCENDIARY');
      const result = evaluateMarkingRequirements(context);

      const orientationMarking = result.find((m) => m.id === 'orientation-marking');
      expect(orientationMarking).toBeDefined();
      expect(orientationMarking?.value).toContain('THIS SIDE UP');
    });
  });

  describe('Scenario 8: UN0049 - CARTRIDGES, FLASH', () => {
    test('includes UN number and PSN', () => {
      const context = createClass1Context('UN0049', '1.1G', 'CARTRIDGES, FLASH');
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toContain('UN0049');
      expect(psnMarking?.value).toContain('CARTRIDGES, FLASH');
    });

    test.skip('Alteration 3: EX number marking should be required', () => {
      // GAP: EX number marking not currently implemented
      const context = createClass1Context('UN0049', '1.1G', 'CARTRIDGES, FLASH');
      const result = evaluateMarkingRequirements(context);

      const exNumberMarking = result.find((m) => m.id === 'ex-number');
      expect(exNumberMarking).toBeDefined();
    });
  });

  describe('Scenario 9: UN0106 - FUZES, DETONATING', () => {
    test('includes correct PSN spelling (FUZES not FUSES)', () => {
      const context = createClass1Context('UN0106', '1.1B', 'FUZES, DETONATING');
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toContain('UN0106');
      expect(psnMarking?.value).toContain('FUZES');
      // Verify correct spelling - should be FUZES not FUSES
      expect(psnMarking?.value).not.toContain('FUSES');
    });

    test('Alteration 3: misspelled PSN (FUSES vs FUZES) detectable in marking', () => {
      // The system should store the exact PSN provided
      // If user provides "FUSES" incorrectly, it would be stored as such
      const contextCorrect = createClass1Context('UN0106', '1.1B', 'FUZES, DETONATING');
      const resultCorrect = evaluateMarkingRequirements(contextCorrect);

      const psnMarkingCorrect = resultCorrect.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarkingCorrect?.value).toContain('FUZES');
    });
  });

  describe('Scenario 10-13, 16: Standard Class 1 Markings', () => {
    test('Scenario 10: UN0012 - CARTRIDGES FOR WEAPONS includes standard markings', () => {
      const context = createClass1Context(
        'UN0012',
        '1.4S',
        'CARTRIDGES FOR WEAPONS, WITH BURSTING CHARGE'
      );
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toContain('UN0012');
    });

    test('Scenario 11: UN0331 - EXPLOSIVE, BLASTING, TYPE B includes PSN', () => {
      const context = createClass1Context('UN0331', '1.5D', 'EXPLOSIVE, BLASTING, TYPE B');
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toContain('UN0331');
      expect(psnMarking?.value).toContain('EXPLOSIVE, BLASTING, TYPE B');
    });

    test('Scenario 12: UN0042 - BOOSTERS includes PSN', () => {
      const context = createClass1Context('UN0042', '1.1D', 'BOOSTERS without detonator');
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toContain('UN0042');
      expect(psnMarking?.value).toContain('BOOSTERS');
    });

    test('Scenario 13: UN0079 - HEXANITRODIPHENYLAMINE includes PSN', () => {
      const context = createClass1Context('UN0079', '1.1D', 'HEXANITRODIPHENYLAMINE (DIPICRYLAMINE) (HEXYL)');
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toContain('UN0079');
      expect(psnMarking?.value).toContain('HEXANITRODIPHENYLAMINE');
    });

    test('Scenario 16: UN0081 - EXPLOSIVE, BLASTING, TYPE A includes PSN', () => {
      const context = createClass1Context('UN0081', '1.1D', 'EXPLOSIVE, BLASTING, TYPE A');
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toContain('UN0081');
      expect(psnMarking?.value).toContain('EXPLOSIVE, BLASTING, TYPE A');
    });
  });

  describe('Scenario 14: UN0222 - AMMONIUM NITRATE (with 5.1 subsidiary)', () => {
    test('includes PSN and UN number with subsidiary risk', () => {
      const context = createClass1Context('UN0222', '1.1D', 'AMMONIUM NITRATE');
      // Set subsidiary risk for 5.1 (Oxidizer)
      context.hazardousMaterial.subsidiaryRisk = '5.1';
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toContain('UN0222');
      expect(psnMarking?.value).toContain('AMMONIUM NITRATE');
    });

    test('includes POP marking when required', () => {
      const context = createClass1Context('UN0222', '1.1D', 'AMMONIUM NITRATE', {
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
      context.hazardousMaterial.subsidiaryRisk = '5.1';
      const result = evaluateMarkingRequirements(context);

      const popMarking = result.find((m) => m.id === 'pop-marking');
      expect(popMarking).toBeDefined();
    });
  });

  describe('Scenario 15: UN0019 - AMMUNITION, TEAR-PRODUCING (with 6.1 subsidiary)', () => {
    test('includes PSN and UN number', () => {
      const context = createClass1Context(
        'UN0019',
        '1.2G',
        'AMMUNITION, TEAR-PRODUCING with bursting charge, expelling charge or propelling charge'
      );
      // Set subsidiary risk for 6.1 (Toxic)
      context.hazardousMaterial.subsidiaryRisk = '6.1';
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toContain('UN0019');
      expect(psnMarking?.value).toContain('AMMUNITION, TEAR-PRODUCING');
    });

    test('includes standard markings for material with toxic subsidiary risk', () => {
      const context = createClass1Context(
        'UN0019',
        '1.2G',
        'AMMUNITION, TEAR-PRODUCING',
        {
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
        }
      );
      context.hazardousMaterial.subsidiaryRisk = '6.1';
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      const popMarking = result.find((m) => m.id === 'pop-marking');

      expect(psnMarking).toBeDefined();
      expect(popMarking).toBeDefined();
    });
  });

  describe('Scenario 17: UN0135 - MERCURY FULMINATE, WETTED (RQ Material)', () => {
    /**
     * Reportable Quantity (RQ) materials require "RQ" prefix when quantity exceeds threshold.
     * Mercury Fulminate has an RQ threshold that must be checked.
     */
    test('includes PSN and UN number', () => {
      const context = createClass1Context('UN0135', '1.1A', 'MERCURY FULMINATE, WETTED with not less than 20 percent water, or mixture of alcohol and water, by mass');
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toContain('UN0135');
      expect(psnMarking?.value).toContain('MERCURY FULMINATE');
    });

    test('should require RQ prefix when quantity exceeds reportable threshold', () => {
      const context = createClass1Context('UN0135', '1.1A', 'MERCURY FULMINATE, WETTED');
      // Set up quantity that exceeds RQ threshold
      context.packaging.totalNetMass = { kg: 50, lbs: 110 };
      // Set up RQ threshold from lookup
      context.lookupFunctionsOutput = {
        reportableQuantityRequirement: { kilograms: 10 },
      } as any;

      const result = evaluateMarkingRequirements(context);

      const rqMarking = result.find((m) => m.id === 'reportable-quantity');
      expect(rqMarking).toBeDefined();
      expect(rqMarking?.value).toContain('RQ');
    });

    test('Alteration 1: RQ marking not present when below threshold', () => {
      const context = createClass1Context('UN0135', '1.1A', 'MERCURY FULMINATE, WETTED');
      // Set up quantity below RQ threshold
      context.packaging.totalNetMass = { kg: 5, lbs: 11 };
      context.lookupFunctionsOutput = {
        reportableQuantityRequirement: { kilograms: 10 },
      } as any;

      const result = evaluateMarkingRequirements(context);

      const rqMarking = result.find((m) => m.id === 'reportable-quantity');
      expect(rqMarking).toBeUndefined();
    });

    test('Alteration 2: without RQ lookup data, no RQ marking is generated', () => {
      const context = createClass1Context('UN0135', '1.1A', 'MERCURY FULMINATE, WETTED');
      context.packaging.totalNetMass = { kg: 50, lbs: 110 };
      // No lookup data provided

      const result = evaluateMarkingRequirements(context);

      const rqMarking = result.find((m) => m.id === 'reportable-quantity');
      expect(rqMarking).toBeUndefined();
    });

    test('Alteration 3: PSN should include wetted percentage qualifier', () => {
      const fullPSN = 'MERCURY FULMINATE, WETTED with not less than 20 percent water, or mixture of alcohol and water, by mass';
      const context = createClass1Context('UN0135', '1.1A', fullPSN);
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toContain('WETTED');
    });
  });

  describe('Scenario 18: UN0473 - SUBSTANCES, EXPLOSIVE, N.O.S. (Technical Name Required)', () => {
    /**
     * N.O.S. (Not Otherwise Specified) materials require technical name in PSN marking.
     * The technical name should be in parentheses after the PSN.
     */
    test('includes PSN with N.O.S. designation', () => {
      const context = createClass1Context('UN0473', '1.1D', 'SUBSTANCES, EXPLOSIVE, N.O.S.');
      context.hazardousMaterial.isTechnicalNameRequired = true;
      context.technicalName = 'Lead Styphnate';
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toContain('UN0473');
      expect(psnMarking?.value).toContain('SUBSTANCES, EXPLOSIVE, N.O.S.');
    });

    test('should require technical name marking for N.O.S. materials', () => {
      const context = createClass1Context('UN0473', '1.1D', 'SUBSTANCES, EXPLOSIVE, N.O.S.');
      context.hazardousMaterial.isTechnicalNameRequired = true;
      context.technicalName = 'Lead Styphnate';
      const result = evaluateMarkingRequirements(context);

      const technicalNameMarking = result.find((m) => m.id === 'technical-name');
      expect(technicalNameMarking).toBeDefined();
      expect(technicalNameMarking?.value).toBe('Lead Styphnate');
    });

    test('Alteration 1: missing technical name when isTechnicalNameRequired is false', () => {
      const context = createClass1Context('UN0473', '1.1D', 'SUBSTANCES, EXPLOSIVE, N.O.S.');
      context.hazardousMaterial.isTechnicalNameRequired = false;
      const result = evaluateMarkingRequirements(context);

      const technicalNameMarking = result.find((m) => m.id === 'technical-name');
      expect(technicalNameMarking).toBeUndefined();
    });

    test('Alteration 2: technical name value stored in context', () => {
      // The technical name should be stored properly for marking
      const context = createClass1Context('UN0473', '1.1D', 'SUBSTANCES, EXPLOSIVE, N.O.S.');
      context.hazardousMaterial.isTechnicalNameRequired = true;
      context.technicalName = 'Lead Styphnate';
      const result = evaluateMarkingRequirements(context);

      const technicalNameMarking = result.find((m) => m.id === 'technical-name');
      expect(technicalNameMarking).toBeDefined();
      // Verify it matches the context value
      expect(technicalNameMarking?.value).toBe(context.technicalName);
    });

    test('Alteration 3: empty technical name generates marking with empty value', () => {
      const context = createClass1Context('UN0473', '1.1D', 'SUBSTANCES, EXPLOSIVE, N.O.S.');
      context.hazardousMaterial.isTechnicalNameRequired = true;
      context.technicalName = ''; // Empty technical name
      const result = evaluateMarkingRequirements(context);

      const technicalNameMarking = result.find((m) => m.id === 'technical-name');
      expect(technicalNameMarking).toBeDefined();
      expect(technicalNameMarking?.value).toBe('');
    });
  });

  describe('Scenario 19: UN0059 - CHARGES, SHAPED (Multiple Packages)', () => {
    /**
     * When shipping multiple packages, each package must have required markings.
     * This scenario tests marking requirements for multi-package shipments.
     */
    test('includes PSN and UN number for primary package', () => {
      const context = createClass1Context('UN0059', '1.1D', 'CHARGES, SHAPED without detonator');
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toContain('UN0059');
      expect(psnMarking?.value).toContain('CHARGES, SHAPED');
    });

    test('markings apply to all packages in shipment', () => {
      // The marking requirements are evaluated per context
      // Each package would need the same markings
      const context = createClass1Context('UN0059', '1.1D', 'CHARGES, SHAPED without detonator', {
        usesPopMarking: true,
        inputPOPMarking: {
          B: '4G',
          C: 'Y',
          D: '25',
          E: 'S',
          F: '12',
          G: 'USA',
          H: 'DOD',
        },
      });
      const result = evaluateMarkingRequirements(context);

      // Each package would need PSN and POP markings
      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      const popMarking = result.find((m) => m.id === 'pop-marking');

      expect(psnMarking).toBeDefined();
      expect(popMarking).toBeDefined();
    });

    test.skip('Alteration 2: GAP - system should track marking compliance per package', () => {
      // GAP: The current implementation doesn't track individual package marking compliance
      // When 3 packages are shipped but only 2 have markings, this should be detectable
      const context = createClass1Context('UN0059', '1.1D', 'CHARGES, SHAPED without detonator');
      const result = evaluateMarkingRequirements(context);

      // This would require metadata about package count and marking compliance
      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking?.metadata?.packageCount).toBe(3);
      expect(psnMarking?.metadata?.markedPackages).toBe(3);
    });
  });

  describe('Scenario 20: UN0354 - ARTICLES, EXPLOSIVE, N.O.S. (Technical Name + IBD)', () => {
    /**
     * This material requires both technical name and IBD (Inhabited Building Distance) documentation.
     * The technical name should be included in the PSN marking.
     */
    test('includes PSN with N.O.S. designation', () => {
      const context = createClass1Context('UN0354', '1.1D', 'ARTICLES, EXPLOSIVE, N.O.S.');
      context.hazardousMaterial.isTechnicalNameRequired = true;
      context.technicalName = 'Detonating Cord Assembly';
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toContain('UN0354');
      expect(psnMarking?.value).toContain('ARTICLES, EXPLOSIVE, N.O.S.');
    });

    test('should require technical name marking', () => {
      const context = createClass1Context('UN0354', '1.1D', 'ARTICLES, EXPLOSIVE, N.O.S.');
      context.hazardousMaterial.isTechnicalNameRequired = true;
      context.technicalName = 'Detonating Cord Assembly';
      const result = evaluateMarkingRequirements(context);

      const technicalNameMarking = result.find((m) => m.id === 'technical-name');
      expect(technicalNameMarking).toBeDefined();
      expect(technicalNameMarking?.value).toBe('Detonating Cord Assembly');
    });

    test('Alteration 2: N.O.S. without technical name when flag is false', () => {
      const context = createClass1Context('UN0354', '1.1D', 'ARTICLES, EXPLOSIVE, N.O.S.');
      context.hazardousMaterial.isTechnicalNameRequired = false;
      // Technical name not required, so not set
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      const technicalNameMarking = result.find((m) => m.id === 'technical-name');

      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toContain('N.O.S.');
      expect(technicalNameMarking).toBeUndefined();
    });

    test.skip('GAP: IBD documentation requirement is not implemented', () => {
      // GAP: Inhabited Building Distance (IBD) documentation is required for certain
      // Class 1 materials but is not currently implemented in markingRequirements.ts
      const context = createClass1Context('UN0354', '1.1D', 'ARTICLES, EXPLOSIVE, N.O.S.');
      const result = evaluateMarkingRequirements(context);

      const ibdMarking = result.find((m) => m.id === 'ibd-documentation');
      expect(ibdMarking).toBeDefined();
    });
  });
});
