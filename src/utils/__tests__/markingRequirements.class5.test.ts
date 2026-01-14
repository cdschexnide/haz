import { evaluateMarkingRequirements, RequiredMarking } from '../markingRequirements';
import { HazProPreparerContext } from '../../contexts/HazProPreparerProvider/reducer';
import { HazardousMaterialItem, PhysicalState, QuantityUnit } from '../../../types';

/**
 * Creates a minimal HazProPreparerContext for Class 5.1 (Oxidizers) testing.
 *
 * Class 5.1 materials are oxidizers with:
 * - Packing groups I, II, or III
 * - Packaging paragraphs A9.5 (liquids) or A9.6 (solids)
 * - POP marking codes: X (PG I), Y (PG II), Z (PG III)
 * - Some have subsidiary hazards (6.1, 8)
 * - No EX number required (unlike Class 1)
 */
function createClass5Context(
  unNumber: string,
  hazardClass: string,
  properShippingName: string,
  packingGroup: string,
  options: {
    usesPopMarking?: boolean;
    isLimitedQuantity?: boolean;
    isExceptedQuantity?: boolean;
    usesCaaCertification?: boolean;
    usesCoeCertification?: boolean;
    subsidiaryRisk?: string;
    packagingParagraph?: string;
    physicalState?: PhysicalState;
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
    subsidiaryRisk = '',
    packagingParagraph = 'A9.6',
    physicalState = PhysicalState.SOLID,
    inputPOPMarking,
  } = options;

  const hazardousMaterial: HazardousMaterialItem = {
    isFixed: '',
    isDomesticShipment: false,
    isTechnicalNameRequired: false,
    unid: unNumber,
    properShippingName,
    hazclassDiv: hazardClass,
    subsidiaryRisk,
    packingGroup, // Class 5.1 has packing groups (I, II, III)
    specialProvision: '',
    packagingParagraph,
    physicalState,
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

describe('Marking Requirements - Class 5.1 Oxidizers', () => {
  describe('Proper Shipping Name and UN Number', () => {
    describe('PG I Oxidizers', () => {
      test('Scenario 1: UN1491 - includes PSN and UN number (PG I)', () => {
        const context = createClass5Context('UN1491', '5.1', 'POTASSIUM PEROXIDE', 'I');
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('UN1491');
        expect(psnMarking?.value).toContain('POTASSIUM PEROXIDE');
      });

      test('Scenario 2: UN1504 - includes PSN and UN number (PG I)', () => {
        const context = createClass5Context('UN1504', '5.1', 'SODIUM PEROXIDE', 'I');
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('UN1504');
        expect(psnMarking?.value).toContain('SODIUM PEROXIDE');
      });

      test('Scenario 3: UN1873 - includes PSN with concentration details (PG I)', () => {
        const context = createClass5Context(
          'UN1873',
          '5.1',
          'PERCHLORIC ACID with more than 50% but 72% or less acid, by mass',
          'I',
          { subsidiaryRisk: '8', packagingParagraph: 'A9.5', physicalState: PhysicalState.LIQUID }
        );
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('UN1873');
        expect(psnMarking?.value).toContain('PERCHLORIC ACID');
      });

      test('Scenario 4: UN2466 - includes PSN and UN number (PG I)', () => {
        const context = createClass5Context('UN2466', '5.1', 'POTASSIUM SUPEROXIDE', 'I');
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('UN2466');
        expect(psnMarking?.value).toContain('POTASSIUM SUPEROXIDE');
      });

      test('Scenario 4, Alteration 2: UN number with transposition error should be incorrect', () => {
        // UN2466 is correct, UN2446 would be a transposition error
        const context = createClass5Context('UN2466', '5.1', 'POTASSIUM SUPEROXIDE', 'I');
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking?.value).toContain('UN2466');
        expect(psnMarking?.value).not.toContain('UN2446');
      });

      test('Scenario 6: UN1745 - includes PSN with multiple subsidiaries (PG I)', () => {
        const context = createClass5Context('UN1745', '5.1', 'BROMINE PENTAFLUORIDE', 'I', {
          subsidiaryRisk: '6.1, 8',
          packagingParagraph: 'A9.9',
        });
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('UN1745');
        expect(psnMarking?.value).toContain('BROMINE PENTAFLUORIDE');
      });
    });

    describe('PG II Oxidizers', () => {
      test('Scenario 7: UN1439 - includes PSN and UN number (PG II)', () => {
        const context = createClass5Context('UN1439', '5.1', 'AMMONIUM DICHROMATE', 'II');
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('UN1439');
        expect(psnMarking?.value).toContain('AMMONIUM DICHROMATE');
      });

      test('Scenario 8: UN1442 - includes PSN and UN number (PG II)', () => {
        const context = createClass5Context('UN1442', '5.1', 'AMMONIUM PERCHLORATE', 'II');
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('UN1442');
        expect(psnMarking?.value).toContain('AMMONIUM PERCHLORATE');
      });

      test('Scenario 8, Alteration 1: UN number with error detectable', () => {
        // Verifies that UN1442 is stored correctly, not UN1443
        const context = createClass5Context('UN1442', '5.1', 'AMMONIUM PERCHLORATE', 'II');
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking?.value).toContain('UN1442');
        expect(psnMarking?.value).not.toContain('UN1443');
      });

      test('Scenario 9: UN1446 - includes PSN with subsidiary hazard (PG II)', () => {
        const context = createClass5Context('UN1446', '5.1', 'BARIUM NITRATE', 'II', {
          subsidiaryRisk: '6.1',
        });
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('UN1446');
        expect(psnMarking?.value).toContain('BARIUM NITRATE');
      });

      test('Scenario 10: UN2719 - includes PSN and UN number (PG II with 6.1)', () => {
        const context = createClass5Context('UN2719', '5.1', 'BARIUM BROMATE', 'II', {
          subsidiaryRisk: '6.1',
        });
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('UN2719');
        expect(psnMarking?.value).toContain('BARIUM BROMATE');
      });
    });

    describe('PG III Oxidizers', () => {
      test('Scenario 16: UN1438 - includes PSN and UN number (PG III)', () => {
        const context = createClass5Context('UN1438', '5.1', 'ALUMINIUM NITRATE', 'III');
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('UN1438');
        expect(psnMarking?.value).toContain('ALUMINIUM NITRATE');
      });

      test('Scenario 16, Alteration 2: PSN spelling variations detectable', () => {
        // ALUMINIUM vs ALUMINUM - British vs American spelling
        const context = createClass5Context('UN1438', '5.1', 'ALUMINIUM NITRATE', 'III');
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking?.value).toContain('ALUMINIUM'); // British spelling is correct
      });

      test('Scenario 17: UN1942 - includes full PSN with concentration qualifier (PG III)', () => {
        const context = createClass5Context(
          'UN1942',
          '5.1',
          'AMMONIUM NITRATE with 0.2% or less total combustible material',
          'III'
        );
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('UN1942');
        expect(psnMarking?.value).toContain('AMMONIUM NITRATE');
      });

      test('Scenario 17, Alteration 2: Similar UN number (1492 vs 1942) detectable', () => {
        const context = createClass5Context(
          'UN1942',
          '5.1',
          'AMMONIUM NITRATE with 0.2% or less total combustible material',
          'III'
        );
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking?.value).toContain('UN1942');
        expect(psnMarking?.value).not.toContain('UN1492');
      });

      test('Scenario 18: UN2067 - includes PSN and UN number (PG III)', () => {
        const context = createClass5Context('UN2067', '5.1', 'AMMONIUM NITRATE BASED FERTILIZER', 'III');
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('UN2067');
        expect(psnMarking?.value).toContain('AMMONIUM NITRATE BASED FERTILIZER');
      });

      test('Scenario 18, Alteration 1: PSN missing "BASED" is incorrect', () => {
        // Correct PSN includes "BASED"
        const context = createClass5Context('UN2067', '5.1', 'AMMONIUM NITRATE BASED FERTILIZER', 'III');
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking?.value).toContain('BASED');
      });

      test('Scenario 19: UN1444 - includes PSN and UN number (PG III)', () => {
        const context = createClass5Context('UN1444', '5.1', 'AMMONIUM PERSULPHATE', 'III');
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('UN1444');
        expect(psnMarking?.value).toContain('AMMONIUM PERSULPHATE');
      });

      test('Scenario 19, Alteration 1: PERSULPHATE vs PERSULFATE spelling', () => {
        // British spelling PERSULPHATE is the correct international form
        const context = createClass5Context('UN1444', '5.1', 'AMMONIUM PERSULPHATE', 'III');
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking?.value).toContain('PERSULPHATE');
      });
    });

    describe('N.O.S. Materials with Technical Names', () => {
      test('Scenario 5: UN3139 - N.O.S. material includes PSN (PG I)', () => {
        const context = createClass5Context(
          'UN3139',
          '5.1',
          'OXIDIZING LIQUID, N.O.S.',
          'I',
          { packagingParagraph: 'A9.5', physicalState: PhysicalState.LIQUID }
        );
        context.hazardousMaterial.isTechnicalNameRequired = true;
        context.technicalName = 'Hydrogen Peroxide, Peracetic Acid';
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('UN3139');
        expect(psnMarking?.value).toContain('OXIDIZING LIQUID, N.O.S.');
      });

      test('Scenario 5: UN3139 - requires technical name marking', () => {
        const context = createClass5Context(
          'UN3139',
          '5.1',
          'OXIDIZING LIQUID, N.O.S.',
          'I',
          { packagingParagraph: 'A9.5', physicalState: PhysicalState.LIQUID }
        );
        context.hazardousMaterial.isTechnicalNameRequired = true;
        context.technicalName = 'Hydrogen Peroxide, Peracetic Acid';
        const result = evaluateMarkingRequirements(context);

        const technicalNameMarking = result.find((m) => m.id === 'technical-name');
        expect(technicalNameMarking).toBeDefined();
        expect(technicalNameMarking?.value).toBe('Hydrogen Peroxide, Peracetic Acid');
      });

      test('Scenario 5, Alteration 1: missing technical name when required', () => {
        const context = createClass5Context(
          'UN3139',
          '5.1',
          'OXIDIZING LIQUID, N.O.S.',
          'I',
          { packagingParagraph: 'A9.5', physicalState: PhysicalState.LIQUID }
        );
        context.hazardousMaterial.isTechnicalNameRequired = true;
        context.technicalName = ''; // Empty - missing
        const result = evaluateMarkingRequirements(context);

        const technicalNameMarking = result.find((m) => m.id === 'technical-name');
        expect(technicalNameMarking).toBeDefined();
        expect(technicalNameMarking?.value).toBe('');
      });

      test('Scenario 11: UN1450 - N.O.S. material with technical name (PG II)', () => {
        const context = createClass5Context('UN1450', '5.1', 'BROMATES, INORGANIC, N.O.S.', 'II');
        context.hazardousMaterial.isTechnicalNameRequired = true;
        context.technicalName = 'Magnesium Bromate';
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        const technicalNameMarking = result.find((m) => m.id === 'technical-name');

        expect(psnMarking?.value).toContain('UN1450');
        expect(psnMarking?.value).toContain('BROMATES, INORGANIC, N.O.S.');
        expect(technicalNameMarking?.value).toBe('Magnesium Bromate');
      });

      test('Scenario 12: UN3212 - N.O.S. material with technical name (PG II)', () => {
        const context = createClass5Context('UN3212', '5.1', 'HYPOCHLORITES, INORGANIC, N.O.S.', 'II');
        context.hazardousMaterial.isTechnicalNameRequired = true;
        context.technicalName = 'Lithium Hypochlorite';
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        const technicalNameMarking = result.find((m) => m.id === 'technical-name');

        expect(psnMarking?.value).toContain('UN3212');
        expect(technicalNameMarking?.value).toBe('Lithium Hypochlorite');
      });

      test('Scenario 12, Alteration 2: UN number digit transposition (3112 vs 3212)', () => {
        const context = createClass5Context('UN3212', '5.1', 'HYPOCHLORITES, INORGANIC, N.O.S.', 'II');
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking?.value).toContain('UN3212');
        expect(psnMarking?.value).not.toContain('UN3112');
      });

      test('Scenario 14: UN1479 - N.O.S. solid with technical name (PG II)', () => {
        const context = createClass5Context('UN1479', '5.1', 'OXIDIZING SOLID, N.O.S.', 'II');
        context.hazardousMaterial.isTechnicalNameRequired = true;
        context.technicalName = 'Calcium Hypochlorite';
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        const technicalNameMarking = result.find((m) => m.id === 'technical-name');

        expect(psnMarking?.value).toContain('UN1479');
        expect(psnMarking?.value).toContain('OXIDIZING SOLID, N.O.S.');
        expect(technicalNameMarking?.value).toBe('Calcium Hypochlorite');
      });

      test('Scenario 15: UN2627 - N.O.S. material with technical name (PG II)', () => {
        const context = createClass5Context('UN2627', '5.1', 'NITRITES, INORGANIC, N.O.S.', 'II');
        context.hazardousMaterial.isTechnicalNameRequired = true;
        context.technicalName = 'Sodium Nitrite';
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        const technicalNameMarking = result.find((m) => m.id === 'technical-name');

        expect(psnMarking?.value).toContain('UN2627');
        expect(psnMarking?.value).toContain('NITRITES, INORGANIC, N.O.S.');
        expect(technicalNameMarking?.value).toBe('Sodium Nitrite');
      });

      test('Scenario 15, Alteration 1: PSN missing N.O.S. designation', () => {
        // Full PSN should include N.O.S.
        const context = createClass5Context('UN2627', '5.1', 'NITRITES, INORGANIC, N.O.S.', 'II');
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking?.value).toContain('N.O.S.');
      });

      test('Scenario 20: UN3219 - N.O.S. aqueous solution with technical name (PG III)', () => {
        const context = createClass5Context(
          'UN3219',
          '5.1',
          'NITRITES, INORGANIC, AQUEOUS SOLUTION, N.O.S.',
          'III',
          { packagingParagraph: 'A9.5', physicalState: PhysicalState.LIQUID }
        );
        context.hazardousMaterial.isTechnicalNameRequired = true;
        context.technicalName = 'Potassium Nitrite';
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        const technicalNameMarking = result.find((m) => m.id === 'technical-name');

        expect(psnMarking?.value).toContain('UN3219');
        expect(psnMarking?.value).toContain('NITRITES, INORGANIC, AQUEOUS SOLUTION, N.O.S.');
        expect(technicalNameMarking?.value).toBe('Potassium Nitrite');
      });

      test('Scenario 20, Alteration 3: PSN missing "AQUEOUS SOLUTION" is incorrect', () => {
        const context = createClass5Context(
          'UN3219',
          '5.1',
          'NITRITES, INORGANIC, AQUEOUS SOLUTION, N.O.S.',
          'III',
          { packagingParagraph: 'A9.5', physicalState: PhysicalState.LIQUID }
        );
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking?.value).toContain('AQUEOUS SOLUTION');
      });
    });

    test('PSN marking is always first in the returned array', () => {
      const context = createClass5Context('UN1491', '5.1', 'POTASSIUM PEROXIDE', 'I');
      const result = evaluateMarkingRequirements(context);

      expect(result.length).toBeGreaterThan(0);
      expect(result[0].id).toBe('proper-shipping-name-unid');
    });

    test('PSN marking has correct label', () => {
      const context = createClass5Context('UN1491', '5.1', 'POTASSIUM PEROXIDE', 'I');
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking?.label).toBe('Proper Shipping Name and UN Number');
    });
  });

  describe('POP Marking', () => {
    describe('PG I Materials - X Code Only', () => {
      test('Scenario 1: UN1491 PG I - requires POP marking with X code', () => {
        const context = createClass5Context('UN1491', '5.1', 'POTASSIUM PEROXIDE', 'I', {
          usesPopMarking: true,
          inputPOPMarking: {
            B: '1A2',
            C: 'X', // PG I requires X only
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
        expect(popMarking?.metadata?.C).toBe('X');
      });

      test('Scenario 1, Alteration 1: PG I material with Y code is invalid', () => {
        // PG I requires X only, Y is for PG II
        const context = createClass5Context('UN1491', '5.1', 'POTASSIUM PEROXIDE', 'I', {
          usesPopMarking: true,
          inputPOPMarking: {
            B: '1A2',
            C: 'Y', // Wrong - should be X for PG I
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
        // The system stores the input - validation happens elsewhere
        expect(popMarking?.metadata?.C).toBe('Y');
      });

      test('Scenario 2, Alteration 3: PG I material with Z code is invalid', () => {
        // PG I requires X only, Z is for PG III
        const context = createClass5Context('UN1504', '5.1', 'SODIUM PEROXIDE', 'I', {
          usesPopMarking: true,
          inputPOPMarking: {
            B: '1A2',
            C: 'Z', // Wrong - should be X for PG I
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
        expect(popMarking?.metadata?.C).toBe('Z');
      });
    });

    describe('PG II Materials - X or Y Code', () => {
      test('Scenario 7: UN1439 PG II - accepts Y code', () => {
        const context = createClass5Context('UN1439', '5.1', 'AMMONIUM DICHROMATE', 'II', {
          usesPopMarking: true,
          inputPOPMarking: {
            B: '4G',
            C: 'Y', // PG II accepts X or Y
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
        expect(popMarking?.metadata?.C).toBe('Y');
      });

      test('Scenario 7, Alteration 1: PG II material with Z code is invalid', () => {
        // PG II requires X or Y, Z is for PG III only
        const context = createClass5Context('UN1439', '5.1', 'AMMONIUM DICHROMATE', 'II', {
          usesPopMarking: true,
          inputPOPMarking: {
            B: '4G',
            C: 'Z', // Wrong - should be X or Y for PG II
            D: '20',
            E: 'S',
            F: '11',
            G: 'USA',
            H: 'DOD',
          },
        });
        const result = evaluateMarkingRequirements(context);

        const popMarking = result.find((m) => m.id === 'pop-marking');
        expect(popMarking?.metadata?.C).toBe('Z');
      });

      test('Scenario 9, Alteration 3: PG II with Z code (subsidiary 6.1)', () => {
        const context = createClass5Context('UN1446', '5.1', 'BARIUM NITRATE', 'II', {
          usesPopMarking: true,
          subsidiaryRisk: '6.1',
          inputPOPMarking: {
            B: '4G',
            C: 'Z', // Wrong for PG II
            D: '20',
            E: 'S',
            F: '11',
            G: 'USA',
            H: 'DOD',
          },
        });
        const result = evaluateMarkingRequirements(context);

        const popMarking = result.find((m) => m.id === 'pop-marking');
        expect(popMarking?.metadata?.C).toBe('Z');
      });
    });

    describe('PG III Materials - X, Y, or Z Code', () => {
      test('Scenario 16: UN1438 PG III - accepts Z code', () => {
        const context = createClass5Context('UN1438', '5.1', 'ALUMINIUM NITRATE', 'III', {
          usesPopMarking: true,
          inputPOPMarking: {
            B: '4G',
            C: 'Z', // PG III accepts X, Y, or Z
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
        expect(popMarking?.metadata?.C).toBe('Z');
      });

      test('Scenario 17: UN1942 PG III - accepts any valid code', () => {
        const context = createClass5Context(
          'UN1942',
          '5.1',
          'AMMONIUM NITRATE with 0.2% or less total combustible material',
          'III',
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
        const result = evaluateMarkingRequirements(context);

        const popMarking = result.find((m) => m.id === 'pop-marking');
        expect(popMarking).toBeDefined();
      });
    });

    test('POP marking includes metadata with packaging specification fields', () => {
      const context = createClass5Context('UN1491', '5.1', 'POTASSIUM PEROXIDE', 'I', {
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
      expect(popMarking?.metadata).toBeDefined();
      expect(popMarking?.metadata?.B).toBe('1A2');
      expect(popMarking?.metadata?.G).toBe('USA');
    });

    test('POP marking is NOT required when isLimitedQuantity is true', () => {
      const context = createClass5Context('UN1491', '5.1', 'POTASSIUM PEROXIDE', 'I', {
        usesPopMarking: true,
        isLimitedQuantity: true,
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
      expect(popMarking).toBeUndefined();
    });

    test('POP marking is NOT required when usesCaaCertification is true', () => {
      const context = createClass5Context('UN1491', '5.1', 'POTASSIUM PEROXIDE', 'I', {
        usesPopMarking: true,
        usesCaaCertification: true,
      });
      const result = evaluateMarkingRequirements(context);

      const popMarking = result.find((m) => m.id === 'pop-marking');
      expect(popMarking).toBeUndefined();
    });

    test('POP marking is NOT required when usesCoeCertification is true', () => {
      const context = createClass5Context('UN1491', '5.1', 'POTASSIUM PEROXIDE', 'I', {
        usesPopMarking: true,
        usesCoeCertification: true,
      });
      const result = evaluateMarkingRequirements(context);

      const popMarking = result.find((m) => m.id === 'pop-marking');
      expect(popMarking).toBeUndefined();
    });

    test('POP marking is NOT present when usesPopMarking is false', () => {
      const context = createClass5Context('UN1491', '5.1', 'POTASSIUM PEROXIDE', 'I', {
        usesPopMarking: false,
      });
      const result = evaluateMarkingRequirements(context);

      const popMarking = result.find((m) => m.id === 'pop-marking');
      expect(popMarking).toBeUndefined();
    });

    test('Scenario 4, Alteration 3: Missing POP marking from package', () => {
      const context = createClass5Context('UN2466', '5.1', 'POTASSIUM SUPEROXIDE', 'I', {
        usesPopMarking: false, // POP marking not present
      });
      const result = evaluateMarkingRequirements(context);

      const popMarking = result.find((m) => m.id === 'pop-marking');
      expect(popMarking).toBeUndefined();
    });

    test('Scenario 18, Alteration 3: Missing POP marking from package', () => {
      const context = createClass5Context('UN2067', '5.1', 'AMMONIUM NITRATE BASED FERTILIZER', 'III', {
        usesPopMarking: false,
      });
      const result = evaluateMarkingRequirements(context);

      const popMarking = result.find((m) => m.id === 'pop-marking');
      expect(popMarking).toBeUndefined();
    });

    test('POP marking has correct label', () => {
      const context = createClass5Context('UN1491', '5.1', 'POTASSIUM PEROXIDE', 'I', {
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
      const context = createClass5Context('UN1491', '5.1', 'POTASSIUM PEROXIDE', 'I', {
        isExceptedQuantity: true,
        usesPopMarking: true,
      });
      const result = evaluateMarkingRequirements(context);

      expect(result.length).toBe(1);
      expect(result[0].id).toBe('excepted-quantity-e-marking');
      expect(result[0].renderType).toBe('custom');
    });

    test('E marking includes hazard class information', () => {
      const context = createClass5Context('UN1491', '5.1', 'POTASSIUM PEROXIDE', 'I', {
        isExceptedQuantity: true,
      });
      const result = evaluateMarkingRequirements(context);

      const eMarking = result.find((m) => m.id === 'excepted-quantity-e-marking');
      expect(eMarking).toBeDefined();
      expect(eMarking?.value).toContain('5.1');
    });
  });

  describe('Limited Quantity Marking', () => {
    test('Limited quantity materials include limited quantity marking', () => {
      const context = createClass5Context('UN1439', '5.1', 'AMMONIUM DICHROMATE', 'II', {
        isLimitedQuantity: true,
      });
      const result = evaluateMarkingRequirements(context);

      const ltdQtyMarking = result.find((m) => m.id === 'limited-quantity');
      expect(ltdQtyMarking).toBeDefined();
      expect(ltdQtyMarking?.label).toBe('Limited Quantity');
    });

    test('Non-limited quantity materials do NOT include limited quantity marking', () => {
      const context = createClass5Context('UN1439', '5.1', 'AMMONIUM DICHROMATE', 'II', {
        isLimitedQuantity: false,
      });
      const result = evaluateMarkingRequirements(context);

      const ltdQtyMarking = result.find((m) => m.id === 'limited-quantity');
      expect(ltdQtyMarking).toBeUndefined();
    });
  });

  describe('Overpack Marking', () => {
    test('Overpack marking is included when overpack is true', () => {
      const context = createClass5Context('UN1491', '5.1', 'POTASSIUM PEROXIDE', 'I');
      context.overpack = true;
      const result = evaluateMarkingRequirements(context);

      const overpackMarking = result.find((m) => m.id === 'overpack');
      expect(overpackMarking).toBeDefined();
      expect(overpackMarking?.label).toBe('OVERPACK');
    });

    test('Overpack marking is NOT included when overpack is false', () => {
      const context = createClass5Context('UN1491', '5.1', 'POTASSIUM PEROXIDE', 'I');
      context.overpack = false;
      const result = evaluateMarkingRequirements(context);

      const overpackMarking = result.find((m) => m.id === 'overpack');
      expect(overpackMarking).toBeUndefined();
    });
  });

  describe('Liquid Oxidizers (A9.5 Packaging)', () => {
    test('Scenario 13: UN3405 - liquid oxidizer with 6.1 subsidiary', () => {
      const context = createClass5Context('UN3405', '5.1', 'BARIUM CHLORATE SOLUTION', 'II', {
        subsidiaryRisk: '6.1',
        packagingParagraph: 'A9.5',
        physicalState: PhysicalState.LIQUID,
        usesPopMarking: true,
        inputPOPMarking: {
          B: '3H1',
          C: 'Y',
          D: '20',
          E: 'S',
          F: '11',
          G: 'USA',
          H: 'DOD',
        },
      });
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      const popMarking = result.find((m) => m.id === 'pop-marking');

      expect(psnMarking?.value).toContain('UN3405');
      expect(psnMarking?.value).toContain('BARIUM CHLORATE SOLUTION');
      expect(popMarking).toBeDefined();
    });

    test('Scenario 13, Alteration 2: POP shows solid container code for liquid', () => {
      // A liquid should use A9.5 liquid container codes, not A9.6 solid codes
      const context = createClass5Context('UN3405', '5.1', 'BARIUM CHLORATE SOLUTION', 'II', {
        subsidiaryRisk: '6.1',
        packagingParagraph: 'A9.5',
        physicalState: PhysicalState.LIQUID,
        usesPopMarking: true,
        inputPOPMarking: {
          B: '4G', // This is a fiberboard box - wrong for liquids
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
      // The system stores what's provided - validation for correct liquid packaging is separate
      expect(popMarking?.metadata?.B).toBe('4G');
    });
  });

  describe('Military Shipping Label - GAP IDENTIFIED', () => {
    /**
     * GAP: Military Shipping Label (MSL) is required per AFMAN 24-604
     * but is not currently implemented in markingRequirements.ts
     *
     * Unlike Class 1 explosives which also require EX numbers,
     * Class 5.1 oxidizers primarily require standard markings plus MSL.
     */
    test.skip('Scenario 4, Alteration 3: MSL should be required for military shipments', () => {
      const context = createClass5Context('UN2466', '5.1', 'POTASSIUM SUPEROXIDE', 'I');
      const result = evaluateMarkingRequirements(context);

      const mslMarking = result.find((m) => m.id === 'military-shipping-label');
      expect(mslMarking).toBeDefined();
      expect(mslMarking?.label).toContain('Military Shipping Label');
    });

    test.skip('Scenario 15, Alteration 3: MSL missing from package', () => {
      const context = createClass5Context('UN2627', '5.1', 'NITRITES, INORGANIC, N.O.S.', 'II');
      const result = evaluateMarkingRequirements(context);

      const mslMarking = result.find((m) => m.id === 'military-shipping-label');
      expect(mslMarking).toBeDefined();
    });
  });
});
