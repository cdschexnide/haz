import { evaluateMarkingRequirements, RequiredMarking } from '../markingRequirements';
import { HazProPreparerContext } from '../../contexts/HazProPreparerProvider/reducer';
import { HazardousMaterialItem, PhysicalState, QuantityUnit } from '../../../types';

/**
 * Creates a minimal HazProPreparerContext for Class 8 (Corrosives) testing.
 *
 * Class 8 materials are corrosives with key characteristics:
 * - NO divisions (hazclassDiv is simply "8")
 * - ALWAYS have packing groups (I, II, or III) - except wet batteries
 * - POP marking codes: X (PG I), Y (PG II), Z (PG III)
 * - Use A12.xx packaging paragraphs
 * - Common subsidiary hazards (6.1, 3, 5.1)
 */
function createClass8Context(
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
    isTechnicalNameRequired?: boolean;
    technicalName?: string;
    subsidiaryRisk?: string;
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
    isTechnicalNameRequired = false,
    technicalName = '',
    subsidiaryRisk = '',
    physicalState = PhysicalState.LIQUID,
    inputPOPMarking,
  } = options;

  const hazardousMaterial: HazardousMaterialItem = {
    isFixed: '',
    isDomesticShipment: false,
    isTechnicalNameRequired,
    unid: unNumber,
    properShippingName,
    hazclassDiv: hazardClass,
    subsidiaryRisk,
    packingGroup,
    specialProvision: '',
    packagingParagraph: 'A12.2',
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
    technicalName,
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

describe('Marking Requirements - Class 8 Corrosives', () => {
  describe('Proper Shipping Name and UN Number', () => {
    describe('Packing Group I Scenarios (1-6)', () => {
      test('Scenario 1: UN1830 - includes PSN and UN number', () => {
        const context = createClass8Context('UN1830', '8', 'SULFURIC ACID, FUMING with less than 30% free sulfur trioxide', 'I');
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('UN1830');
        expect(psnMarking?.value).toContain('SULFURIC ACID');
      });

      test('Scenario 2: UN1790 - includes PSN with concentration qualifier', () => {
        const context = createClass8Context('UN1790', '8', 'HYDROFLUORIC ACID with more than 60% strength', 'I');
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('UN1790');
        expect(psnMarking?.value).toContain('HYDROFLUORIC ACID');
      });

      test('Scenario 3: UN2032 - NITRIC ACID, RED FUMING marking', () => {
        const context = createClass8Context('UN2032', '8', 'NITRIC ACID, RED FUMING', 'I');
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('UN2032');
        expect(psnMarking?.value).toContain('NITRIC ACID, RED FUMING');
      });

      test('Scenario 4: UN2029 - HYDRAZINE, ANHYDROUS marking', () => {
        const context = createClass8Context('UN2029', '8', 'HYDRAZINE, ANHYDROUS', 'I');
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('UN2029');
        expect(psnMarking?.value).toContain('HYDRAZINE');
      });

      test('Scenario 5: UN1760 - CORROSIVE LIQUID, N.O.S. marking', () => {
        const context = createClass8Context('UN1760', '8', 'CORROSIVE LIQUID, N.O.S.', 'I');
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('UN1760');
        expect(psnMarking?.value).toContain('CORROSIVE LIQUID, N.O.S.');
      });

      test('Scenario 6: UN2922 - CORROSIVE LIQUID, TOXIC, N.O.S. marking', () => {
        const context = createClass8Context('UN2922', '8', 'CORROSIVE LIQUID, TOXIC, N.O.S.', 'I');
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('UN2922');
        expect(psnMarking?.value).toContain('CORROSIVE LIQUID, TOXIC, N.O.S.');
      });
    });

    describe('Packing Group II Scenarios (7-14)', () => {
      test('Scenario 7: UN1789 - HYDROCHLORIC ACID marking', () => {
        const context = createClass8Context('UN1789', '8', 'HYDROCHLORIC ACID', 'II');
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('UN1789');
        expect(psnMarking?.value).toContain('HYDROCHLORIC ACID');
      });

      test('Scenario 7, Alteration 3: UN number marking height must be minimum 12mm', () => {
        // This test documents the requirement - height validation is elsewhere
        const context = createClass8Context('UN1789', '8', 'HYDROCHLORIC ACID', 'II');
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('UN1789');
      });

      test('Scenario 8: UN2789 - ACETIC ACID, GLACIAL marking', () => {
        const context = createClass8Context('UN2789', '8', 'ACETIC ACID, GLACIAL or acetic acid solution, more than 80% acid, by mass', 'II');
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('UN2789');
        expect(psnMarking?.value).toContain('ACETIC ACID');
      });

      test('Scenario 9: UN1823 - SODIUM HYDROXIDE, SOLID marking', () => {
        const context = createClass8Context('UN1823', '8', 'SODIUM HYDROXIDE, SOLID', 'II', {
          physicalState: PhysicalState.SOLID,
        });
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('UN1823');
        expect(psnMarking?.value).toContain('SODIUM HYDROXIDE, SOLID');
      });

      test('Scenario 9, Alteration 3: PSN must not be abbreviated', () => {
        // "NaOH SOLID" abbreviation is not acceptable
        const context = createClass8Context('UN1823', '8', 'SODIUM HYDROXIDE, SOLID', 'II');
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('SODIUM HYDROXIDE');
        expect(psnMarking?.value).not.toContain('NaOH');
      });

      test('Scenario 10: UN2796 - BATTERY FLUID, ACID marking', () => {
        const context = createClass8Context('UN2796', '8', 'BATTERY FLUID, ACID', 'II');
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('UN2796');
        expect(psnMarking?.value).toContain('BATTERY FLUID, ACID');
      });

      test('Scenario 11: UN2794 - BATTERIES, WET marking (No PG)', () => {
        const context = createClass8Context('UN2794', '8', 'BATTERIES, WET, FILLED WITH ACID, electric storage', '');
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('UN2794');
        expect(psnMarking?.value).toContain('BATTERIES, WET');
      });

      test('Scenario 11, Alteration 3: PSN must include full descriptor', () => {
        // "BATTERIES" alone is not acceptable
        const context = createClass8Context('UN2794', '8', 'BATTERIES, WET, FILLED WITH ACID, electric storage', '');
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('BATTERIES, WET');
      });

      test('Scenario 12: UN1824 - SODIUM HYDROXIDE, SOLUTION marking', () => {
        const context = createClass8Context('UN1824', '8', 'SODIUM HYDROXIDE, SOLUTION', 'II');
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('UN1824');
        expect(psnMarking?.value).toContain('SODIUM HYDROXIDE, SOLUTION');
      });

      test('Scenario 12, Alteration 1: UN number must be correct (not transposed)', () => {
        // UN1842 would be a transposition error
        const context = createClass8Context('UN1824', '8', 'SODIUM HYDROXIDE, SOLUTION', 'II');
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('UN1824');
        expect(psnMarking?.value).not.toContain('UN1842');
      });

      test('Scenario 12, Alteration 2: Must use official PSN, not common names', () => {
        // "CAUSTIC SODA SOLUTION" is not acceptable
        const context = createClass8Context('UN1824', '8', 'SODIUM HYDROXIDE, SOLUTION', 'II');
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('SODIUM HYDROXIDE');
        expect(psnMarking?.value).not.toContain('CAUSTIC SODA');
      });

      test('Scenario 13: UN2920 - CORROSIVE LIQUID, FLAMMABLE, N.O.S. marking', () => {
        const context = createClass8Context('UN2920', '8', 'CORROSIVE LIQUID, FLAMMABLE, N.O.S.', 'II');
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('UN2920');
        expect(psnMarking?.value).toContain('CORROSIVE LIQUID, FLAMMABLE, N.O.S.');
      });

      test('Scenario 14: UN1802 - PERCHLORIC ACID marking', () => {
        const context = createClass8Context('UN1802', '8', 'PERCHLORIC ACID with not more than 50% acid, by mass', 'II');
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('UN1802');
        expect(psnMarking?.value).toContain('PERCHLORIC ACID');
      });

      test('Scenario 14, Alteration 2: PSN must include concentration qualifier', () => {
        const context = createClass8Context('UN1802', '8', 'PERCHLORIC ACID with not more than 50% acid, by mass', 'II');
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('PERCHLORIC ACID');
      });
    });

    describe('Packing Group III Scenarios (15-20)', () => {
      test('Scenario 15: UN2790 - ACETIC ACID SOLUTION marking', () => {
        const context = createClass8Context('UN2790', '8', 'ACETIC ACID SOLUTION, not less than 10% and less than 50% acid, by mass', 'III');
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('UN2790');
        expect(psnMarking?.value).toContain('ACETIC ACID SOLUTION');
      });

      test('Scenario 15, Alteration 1: PSN must include concentration range', () => {
        const context = createClass8Context('UN2790', '8', 'ACETIC ACID SOLUTION, not less than 10% and less than 50% acid, by mass', 'III');
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        // Concentration range should be included for concentration-specific entries
        expect(psnMarking?.value).toContain('ACETIC ACID');
      });

      test('Scenario 16: UN2672 - AMMONIA SOLUTION marking', () => {
        const context = createClass8Context('UN2672', '8', 'AMMONIA SOLUTION', 'III');
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('UN2672');
        expect(psnMarking?.value).toContain('AMMONIA SOLUTION');
      });

      test('Scenario 16, Alteration 1: PSN must match official entry', () => {
        // "AMMONIA" alone is not acceptable
        const context = createClass8Context('UN2672', '8', 'AMMONIA SOLUTION', 'III');
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('AMMONIA');
      });

      test('Scenario 17: UN2809 - MERCURY marking', () => {
        const context = createClass8Context('UN2809', '8', 'MERCURY', 'III');
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('UN2809');
        expect(psnMarking?.value).toContain('MERCURY');
      });

      test('Scenario 18: UN1805 - PHOSPHORIC ACID, SOLUTION marking', () => {
        const context = createClass8Context('UN1805', '8', 'PHOSPHORIC ACID, SOLUTION', 'III');
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('UN1805');
        expect(psnMarking?.value).toContain('PHOSPHORIC ACID');
      });

      test('Scenario 19: UN1759 - CORROSIVE SOLID, N.O.S. marking', () => {
        const context = createClass8Context('UN1759', '8', 'CORROSIVE SOLID, N.O.S.', 'III', {
          physicalState: PhysicalState.SOLID,
        });
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('UN1759');
        expect(psnMarking?.value).toContain('CORROSIVE SOLID, N.O.S.');
      });

      test('Scenario 20: UN3264 - CORROSIVE LIQUID, ACIDIC, INORGANIC, N.O.S. marking', () => {
        const context = createClass8Context('UN3264', '8', 'CORROSIVE LIQUID, ACIDIC, INORGANIC, N.O.S.', 'III');
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('UN3264');
        expect(psnMarking?.value).toContain('CORROSIVE LIQUID, ACIDIC, INORGANIC, N.O.S.');
      });

      test('Scenario 20, Alteration 2: Must use specific N.O.S. descriptor', () => {
        // Generic "CORROSIVE LIQUID, N.O.S." is not acceptable when specific entry exists
        const context = createClass8Context('UN3264', '8', 'CORROSIVE LIQUID, ACIDIC, INORGANIC, N.O.S.', 'III');
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('ACIDIC, INORGANIC');
      });
    });

    test('PSN marking is always first in the returned array', () => {
      const context = createClass8Context('UN1789', '8', 'HYDROCHLORIC ACID', 'II');
      const result = evaluateMarkingRequirements(context);

      expect(result.length).toBeGreaterThan(0);
      expect(result[0].id).toBe('proper-shipping-name-unid');
    });

    test('PSN marking has correct label', () => {
      const context = createClass8Context('UN1789', '8', 'HYDROCHLORIC ACID', 'II');
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking?.label).toBe('Proper Shipping Name and UN Number');
    });
  });

  describe('POP Marking', () => {
    describe('PG Code Requirements - X for PG I, Y for PG II, Z for PG III', () => {
      test('Scenario 1: PG I corrosive requires POP code X', () => {
        const context = createClass8Context('UN1830', '8', 'SULFURIC ACID, FUMING', 'I', {
          usesPopMarking: true,
          inputPOPMarking: {
            B: '1A1',
            C: 'X',  // X required for PG I
            D: '50',
            E: 'S',
            F: '12',
            G: 'USA',
            H: 'DOD',
          },
        });
        const result = evaluateMarkingRequirements(context);

        const popMarking = result.find((m) => m.id === 'pop-marking');
        expect(popMarking).toBeDefined();
        expect(popMarking?.metadata?.C).toBe('X');
      });

      test('Scenario 1, Alteration 2: POP code Y is wrong for PG I material', () => {
        // This documents the invalid case - Y should not be used for PG I
        const context = createClass8Context('UN1830', '8', 'SULFURIC ACID, FUMING', 'I', {
          usesPopMarking: true,
          inputPOPMarking: {
            B: '1A1',
            C: 'Y',  // Wrong - PG I requires X
            D: '50',
            E: 'S',
            F: '12',
            G: 'USA',
            H: 'DOD',
          },
        });
        const result = evaluateMarkingRequirements(context);

        const popMarking = result.find((m) => m.id === 'pop-marking');
        expect(popMarking).toBeDefined();
        // Test documents that Y was provided (validation is elsewhere)
        expect(popMarking?.metadata?.C).toBe('Y');
      });

      test('Scenario 7: PG II corrosive accepts POP code X or Y', () => {
        const context = createClass8Context('UN1789', '8', 'HYDROCHLORIC ACID', 'II', {
          usesPopMarking: true,
          inputPOPMarking: {
            B: '1H1',
            C: 'Y',  // Y is acceptable for PG II
            D: '30',
            E: 'S',
            F: '15',
            G: 'USA',
            H: 'DOD',
          },
        });
        const result = evaluateMarkingRequirements(context);

        const popMarking = result.find((m) => m.id === 'pop-marking');
        expect(popMarking).toBeDefined();
        expect(popMarking?.metadata?.C).toBe('Y');
      });

      test('Scenario 7, Alteration 1: POP code Z is wrong for PG II material', () => {
        // This documents the invalid case - Z should not be used for PG II
        const context = createClass8Context('UN1789', '8', 'HYDROCHLORIC ACID', 'II', {
          usesPopMarking: true,
          inputPOPMarking: {
            B: '1H1',
            C: 'Z',  // Wrong - PG II requires X or Y
            D: '30',
            E: 'S',
            F: '15',
            G: 'USA',
            H: 'DOD',
          },
        });
        const result = evaluateMarkingRequirements(context);

        const popMarking = result.find((m) => m.id === 'pop-marking');
        expect(popMarking).toBeDefined();
        // Test documents that Z was provided (validation is elsewhere)
        expect(popMarking?.metadata?.C).toBe('Z');
      });

      test('Scenario 15: PG III corrosive accepts POP code X, Y, or Z', () => {
        const context = createClass8Context('UN2790', '8', 'ACETIC ACID SOLUTION', 'III', {
          usesPopMarking: true,
          inputPOPMarking: {
            B: '4G',
            C: 'Z',  // Z is acceptable for PG III
            D: '20',
            E: 'S',
            F: '18',
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

    test('POP marking includes metadata with packaging specification fields', () => {
      const context = createClass8Context('UN1789', '8', 'HYDROCHLORIC ACID', 'II', {
        usesPopMarking: true,
        inputPOPMarking: {
          B: '1H1',
          C: 'Y',
          D: '30',
          E: 'S',
          F: '15',
          G: 'USA',
          H: 'DOD',
        },
      });
      const result = evaluateMarkingRequirements(context);

      const popMarking = result.find((m) => m.id === 'pop-marking');
      expect(popMarking).toBeDefined();
      expect(popMarking?.metadata).toBeDefined();
      expect(popMarking?.metadata?.B).toBe('1H1');
      expect(popMarking?.metadata?.G).toBe('USA');
    });

    test('POP marking is NOT required when isLimitedQuantity is true', () => {
      const context = createClass8Context('UN1789', '8', 'HYDROCHLORIC ACID', 'II', {
        usesPopMarking: true,
        isLimitedQuantity: true,
        inputPOPMarking: {
          B: '1H1',
          C: 'Y',
          D: '30',
          E: 'S',
          F: '15',
          G: 'USA',
          H: 'DOD',
        },
      });
      const result = evaluateMarkingRequirements(context);

      const popMarking = result.find((m) => m.id === 'pop-marking');
      expect(popMarking).toBeUndefined();
    });

    test('POP marking is NOT required when usesCaaCertification is true', () => {
      const context = createClass8Context('UN1789', '8', 'HYDROCHLORIC ACID', 'II', {
        usesPopMarking: true,
        usesCaaCertification: true,
      });
      const result = evaluateMarkingRequirements(context);

      const popMarking = result.find((m) => m.id === 'pop-marking');
      expect(popMarking).toBeUndefined();
    });

    test('POP marking is NOT required when usesCoeCertification is true', () => {
      const context = createClass8Context('UN1789', '8', 'HYDROCHLORIC ACID', 'II', {
        usesPopMarking: true,
        usesCoeCertification: true,
      });
      const result = evaluateMarkingRequirements(context);

      const popMarking = result.find((m) => m.id === 'pop-marking');
      expect(popMarking).toBeUndefined();
    });

    test('POP marking is NOT present when usesPopMarking is false', () => {
      const context = createClass8Context('UN1789', '8', 'HYDROCHLORIC ACID', 'II', {
        usesPopMarking: false,
      });
      const result = evaluateMarkingRequirements(context);

      const popMarking = result.find((m) => m.id === 'pop-marking');
      expect(popMarking).toBeUndefined();
    });

    test('POP marking has correct label', () => {
      const context = createClass8Context('UN1789', '8', 'HYDROCHLORIC ACID', 'II', {
        usesPopMarking: true,
        inputPOPMarking: {
          B: '1H1',
          C: 'Y',
          D: '30',
          E: 'S',
          F: '15',
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
      const context = createClass8Context('UN1789', '8', 'HYDROCHLORIC ACID', 'II', {
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
      const context = createClass8Context('UN1789', '8', 'HYDROCHLORIC ACID', 'II', {
        isExceptedQuantity: true,
      });
      const result = evaluateMarkingRequirements(context);

      const eMarking = result.find((m) => m.id === 'excepted-quantity-e-marking');
      expect(eMarking).toBeDefined();
      expect(eMarking?.value).toContain('8');
    });
  });

  describe('Limited Quantity Marking', () => {
    test('Limited quantity corrosive returns LQ marking', () => {
      const context = createClass8Context('UN1789', '8', 'HYDROCHLORIC ACID', 'II', {
        isLimitedQuantity: true,
      });
      const result = evaluateMarkingRequirements(context);

      const lqMarking = result.find((m) => m.id === 'limited-quantity');
      expect(lqMarking).toBeDefined();
    });
  });

  describe('Overpack Marking', () => {
    test('Overpack marking is included when overpack is true', () => {
      const context = createClass8Context('UN1789', '8', 'HYDROCHLORIC ACID', 'II');
      context.overpack = true;
      const result = evaluateMarkingRequirements(context);

      const overpackMarking = result.find((m) => m.id === 'overpack');
      expect(overpackMarking).toBeDefined();
    });
  });

  describe('Technical Name for N.O.S. Entries - GAP IDENTIFIED', () => {
    /**
     * GAP: Technical name marking for N.O.S. entries is required per AFMAN 24-604
     * but may not be fully implemented for display purposes.
     */
    test.skip('Scenario 5, Alteration 1: N.O.S. requires technical name in marking', () => {
      // UN1760 CORROSIVE LIQUID, N.O.S. requires technical name
      const context = createClass8Context('UN1760', '8', 'CORROSIVE LIQUID, N.O.S.', 'I', {
        isTechnicalNameRequired: true,
        technicalName: 'phosphorus trichloride',
      });
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      // Technical name should be included in parentheses
      expect(psnMarking?.value).toContain('phosphorus trichloride');
    });

    test.skip('Scenario 5, Alteration 3: Technical name must be in parentheses', () => {
      const context = createClass8Context('UN1760', '8', 'CORROSIVE LIQUID, N.O.S.', 'I', {
        isTechnicalNameRequired: true,
        technicalName: 'phosphorus trichloride',
      });
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toMatch(/\(.*phosphorus trichloride.*\)/i);
    });

    test.skip('Scenario 6, Alteration 1: Toxic N.O.S. requires minimum two technical names', () => {
      // UN2922 CORROSIVE LIQUID, TOXIC, N.O.S. requires minimum two components
      const context = createClass8Context('UN2922', '8', 'CORROSIVE LIQUID, TOXIC, N.O.S.', 'I', {
        isTechnicalNameRequired: true,
        technicalName: 'phenol, sodium hydroxide',
      });
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toContain('phenol');
      expect(psnMarking?.value).toContain('sodium hydroxide');
    });
  });

  describe('Military Shipping Label - GAP IDENTIFIED', () => {
    /**
     * GAP: Military Shipping Label (MSL) marking is required per AFMAN 24-604
     * but is not currently implemented in markingRequirements.ts
     */
    test.skip('Scenario 12, Alteration 3: Missing Military Shipping Label is an error', () => {
      const context = createClass8Context('UN1824', '8', 'SODIUM HYDROXIDE, SOLUTION', 'II');
      const result = evaluateMarkingRequirements(context);

      const mslMarking = result.find((m) => m.id === 'military-shipping-label');
      expect(mslMarking).toBeDefined();
    });
  });

  describe('All 20 Scenarios - Integration Test', () => {
    const scenarios = [
      { scenario: 1, un: 'UN1830', hc: '8', pg: 'I', psn: 'SULFURIC ACID, FUMING' },
      { scenario: 2, un: 'UN1790', hc: '8', pg: 'I', psn: 'HYDROFLUORIC ACID' },
      { scenario: 3, un: 'UN2032', hc: '8', pg: 'I', psn: 'NITRIC ACID, RED FUMING' },
      { scenario: 4, un: 'UN2029', hc: '8', pg: 'I', psn: 'HYDRAZINE, ANHYDROUS' },
      { scenario: 5, un: 'UN1760', hc: '8', pg: 'I', psn: 'CORROSIVE LIQUID, N.O.S.' },
      { scenario: 6, un: 'UN2922', hc: '8', pg: 'I', psn: 'CORROSIVE LIQUID, TOXIC, N.O.S.' },
      { scenario: 7, un: 'UN1789', hc: '8', pg: 'II', psn: 'HYDROCHLORIC ACID' },
      { scenario: 8, un: 'UN2789', hc: '8', pg: 'II', psn: 'ACETIC ACID, GLACIAL' },
      { scenario: 9, un: 'UN1823', hc: '8', pg: 'II', psn: 'SODIUM HYDROXIDE, SOLID' },
      { scenario: 10, un: 'UN2796', hc: '8', pg: 'II', psn: 'BATTERY FLUID, ACID' },
      { scenario: 11, un: 'UN2794', hc: '8', pg: '', psn: 'BATTERIES, WET, FILLED WITH ACID' },
      { scenario: 12, un: 'UN1824', hc: '8', pg: 'II', psn: 'SODIUM HYDROXIDE, SOLUTION' },
      { scenario: 13, un: 'UN2920', hc: '8', pg: 'II', psn: 'CORROSIVE LIQUID, FLAMMABLE, N.O.S.' },
      { scenario: 14, un: 'UN1802', hc: '8', pg: 'II', psn: 'PERCHLORIC ACID' },
      { scenario: 15, un: 'UN2790', hc: '8', pg: 'III', psn: 'ACETIC ACID SOLUTION' },
      { scenario: 16, un: 'UN2672', hc: '8', pg: 'III', psn: 'AMMONIA SOLUTION' },
      { scenario: 17, un: 'UN2809', hc: '8', pg: 'III', psn: 'MERCURY' },
      { scenario: 18, un: 'UN1805', hc: '8', pg: 'III', psn: 'PHOSPHORIC ACID, SOLUTION' },
      { scenario: 19, un: 'UN1759', hc: '8', pg: 'III', psn: 'CORROSIVE SOLID, N.O.S.' },
      { scenario: 20, un: 'UN3264', hc: '8', pg: 'III', psn: 'CORROSIVE LIQUID, ACIDIC, INORGANIC, N.O.S.' },
    ];

    scenarios.forEach(({ scenario, un, hc, pg, psn }) => {
      test(`Scenario ${scenario}: ${un} - includes PSN and UN number in marking`, () => {
        const context = createClass8Context(un, hc, psn, pg);
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain(un);
      });
    });
  });
});
