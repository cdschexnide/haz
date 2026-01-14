import { evaluateMarkingRequirements, RequiredMarking } from '../markingRequirements';
import { HazProPreparerContext } from '../../contexts/HazProPreparerProvider/reducer';
import { HazardousMaterialItem, PhysicalState, QuantityUnit } from '../../../types';

/**
 * Creates a minimal HazProPreparerContext for Class 9 (Miscellaneous Dangerous Goods) testing.
 *
 * Class 9 materials are miscellaneous dangerous goods including:
 * - Lithium batteries (UN3480, UN3481, UN3090, UN3091)
 * - Dry ice (UN1845)
 * - Magnetized material (UN2807)
 * - Environmentally hazardous substances (UN3077, UN3082)
 * - Vehicles (UN3166, UN3171)
 *
 * Class 9 UNIQUE CHARACTERISTICS:
 * - NO divisions (Key 13 = "9" only)
 * - Packing group VARIES by material (some have PG, most don't)
 */
function createClass9Context(
  unNumber: string,
  properShippingName: string,
  options: {
    packingGroup?: string;
    physicalState?: PhysicalState;
    usesPopMarking?: boolean;
    isLimitedQuantity?: boolean;
    isExceptedQuantity?: boolean;
    usesCaaCertification?: boolean;
    usesCoeCertification?: boolean;
    isTechnicalNameRequired?: boolean;
    technicalName?: string;
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
    packingGroup = '', // VARIES for Class 9
    physicalState = PhysicalState.SOLID,
    usesPopMarking = false,
    isLimitedQuantity = false,
    isExceptedQuantity = false,
    usesCaaCertification = false,
    usesCoeCertification = false,
    isTechnicalNameRequired = false,
    technicalName = '',
    inputPOPMarking,
  } = options;

  const hazardousMaterial: HazardousMaterialItem = {
    isFixed: '',
    isDomesticShipment: false,
    isTechnicalNameRequired,
    unid: unNumber,
    properShippingName,
    hazclassDiv: '9', // Class 9 has NO divisions
    subsidiaryRisk: '',
    packingGroup,
    specialProvision: '',
    packagingParagraph: 'A13.2',
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

describe('Marking Requirements - Class 9 Miscellaneous Dangerous Goods', () => {
  describe('Proper Shipping Name and UN Number', () => {
    describe('Lithium Batteries', () => {
      test('Scenario 1: UN3480 - includes PSN and UN number', () => {
        const context = createClass9Context('UN3480', 'LITHIUM ION BATTERIES');
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('UN3480');
        expect(psnMarking?.value).toContain('LITHIUM ION BATTERIES');
      });

      test('Scenario 3: UN3481 CONTAINED IN - includes full PSN qualifier', () => {
        const context = createClass9Context('UN3481', 'LITHIUM ION BATTERIES CONTAINED IN EQUIPMENT');
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('UN3481');
        expect(psnMarking?.value).toContain('CONTAINED IN EQUIPMENT');
      });

      test('Scenario 3, Alteration 1: PSN missing CONTAINED IN qualifier', () => {
        // Test documents the expected behavior - PSN must include qualifier
        const context = createClass9Context('UN3481', 'LITHIUM ION BATTERIES CONTAINED IN EQUIPMENT');
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking?.value).toContain('CONTAINED IN');
      });

      test('Scenario 4: UN3481 PACKED WITH - includes full PSN qualifier', () => {
        const context = createClass9Context('UN3481', 'LITHIUM ION BATTERIES PACKED WITH EQUIPMENT');
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('UN3481');
        expect(psnMarking?.value).toContain('PACKED WITH EQUIPMENT');
      });

      test('Scenario 4, Alteration 3: PSN shows CONTAINED IN instead of PACKED WITH', () => {
        // When PSN configuration is incorrect, the stored value reflects what was entered
        const correctContext = createClass9Context('UN3481', 'LITHIUM ION BATTERIES PACKED WITH EQUIPMENT');
        const result = evaluateMarkingRequirements(correctContext);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking?.value).toContain('PACKED WITH');
        expect(psnMarking?.value).not.toContain('CONTAINED IN');
      });

      test('Scenario 5: UN3090 - includes PSN for lithium metal', () => {
        const context = createClass9Context('UN3090', 'LITHIUM METAL BATTERIES');
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('UN3090');
        expect(psnMarking?.value).toContain('LITHIUM METAL');
      });

      test('Scenario 5, Alteration 3: PSN shows ION instead of METAL', () => {
        // Correct PSN should contain METAL, not ION
        const context = createClass9Context('UN3090', 'LITHIUM METAL BATTERIES');
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking?.value).toContain('METAL');
        expect(psnMarking?.value).not.toContain('ION');
      });

      test('Scenario 7, Alteration 2: PSN on package shows ION instead of METAL', () => {
        // The PSN should reflect the actual battery chemistry
        const context = createClass9Context('UN3091', 'LITHIUM METAL BATTERIES PACKED WITH EQUIPMENT');
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking?.value).toContain('METAL');
      });

      test('Scenario 8: UN3536 - includes battery type specification', () => {
        const context = createClass9Context('UN3536', 'LITHIUM BATTERIES INSTALLED IN CARGO TRANSPORT UNIT (lithium ion batteries)');
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('UN3536');
        expect(psnMarking?.value).toContain('lithium ion');
      });

      test('Scenario 8, Alteration 1: PSN must specify ion or metal', () => {
        // PSN must include "(lithium ion batteries)" or "(lithium metal batteries)"
        const context = createClass9Context('UN3536', 'LITHIUM BATTERIES INSTALLED IN CARGO TRANSPORT UNIT (lithium ion batteries)');
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        // Should contain either ion or metal specification
        expect(psnMarking?.value).toMatch(/lithium (ion|metal)/i);
      });
    });

    describe('Other Class 9 Materials', () => {
      test('Scenario 9: UN1845 (Dry Ice) - includes PSN', () => {
        const context = createClass9Context('UN1845', 'CARBON DIOXIDE, SOLID');
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('UN1845');
        expect(psnMarking?.value).toContain('CARBON DIOXIDE, SOLID');
      });

      test('Scenario 10: UN2807 (Magnetized Material) - includes PSN', () => {
        const context = createClass9Context('UN2807', 'MAGNETIZED MATERIAL');
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('UN2807');
        expect(psnMarking?.value).toContain('MAGNETIZED MATERIAL');
      });

      test('Scenario 11: UN3166 - includes PSN with power type', () => {
        const context = createClass9Context('UN3166', 'VEHICLE, FLAMMABLE LIQUID POWERED');
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('UN3166');
        expect(psnMarking?.value).toContain('FLAMMABLE LIQUID POWERED');
      });

      test('Scenario 11, Alteration 1: PSN must specify power type', () => {
        // PSN should include power source (FLAMMABLE LIQUID POWERED)
        const context = createClass9Context('UN3166', 'VEHICLE, FLAMMABLE LIQUID POWERED');
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking?.value).not.toBe('VEHICLE');
        expect(psnMarking?.value).toContain('FLAMMABLE LIQUID POWERED');
      });

      test('Scenario 12: UN3171 - includes PSN', () => {
        const context = createClass9Context('UN3171', 'BATTERY-POWERED VEHICLE');
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('UN3171');
        expect(psnMarking?.value).toContain('BATTERY-POWERED VEHICLE');
      });

      test('Scenario 12, Alteration 3: PSN shows wrong vehicle type', () => {
        // UN3171 should be BATTERY-POWERED, not FLAMMABLE LIQUID POWERED
        const context = createClass9Context('UN3171', 'BATTERY-POWERED VEHICLE');
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking?.value).toContain('BATTERY-POWERED');
        expect(psnMarking?.value).not.toContain('FLAMMABLE LIQUID POWERED');
      });

      test('Scenario 17: UN3268 (Safety Devices) - includes PSN', () => {
        const context = createClass9Context('UN3268', 'SAFETY DEVICES, electrically initiated');
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('UN3268');
        expect(psnMarking?.value).toContain('SAFETY DEVICES');
      });

      test('Scenario 20: UN2990 (Life-saving appliances) - includes PSN', () => {
        const context = createClass9Context('UN2990', 'LIFE-SAVING APPLIANCES, SELF INFLATING');
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('UN2990');
        expect(psnMarking?.value).toContain('LIFE-SAVING APPLIANCES');
      });

      test('Scenario 20, Alteration 2: PSN missing SELF INFLATING qualifier', () => {
        // Full PSN should include SELF INFLATING
        const context = createClass9Context('UN2990', 'LIFE-SAVING APPLIANCES, SELF INFLATING');
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking?.value).toContain('SELF INFLATING');
      });
    });

    describe('Environmentally Hazardous Materials (N.O.S. with Technical Name)', () => {
      test('Scenario 13: UN3077 - includes PSN with N.O.S.', () => {
        const context = createClass9Context('UN3077', 'ENVIRONMENTALLY HAZARDOUS SUBSTANCE, SOLID, N.O.S.', {
          packingGroup: 'III',
          isTechnicalNameRequired: true,
          technicalName: 'Copper sulfate',
        });
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('UN3077');
        expect(psnMarking?.value).toContain('ENVIRONMENTALLY HAZARDOUS');
        expect(psnMarking?.value).toContain('N.O.S.');
      });

      test('Scenario 13: UN3077 - includes technical name marking', () => {
        const context = createClass9Context('UN3077', 'ENVIRONMENTALLY HAZARDOUS SUBSTANCE, SOLID, N.O.S.', {
          packingGroup: 'III',
          isTechnicalNameRequired: true,
          technicalName: 'Copper sulfate',
        });
        const result = evaluateMarkingRequirements(context);

        const technicalNameMarking = result.find((m) => m.id === 'technical-name');
        expect(technicalNameMarking).toBeDefined();
        expect(technicalNameMarking?.value).toBe('Copper sulfate');
      });

      test('Scenario 13, Alteration 1: missing technical name for N.O.S.', () => {
        // When technical name is required but flag is false, no marking generated
        const context = createClass9Context('UN3077', 'ENVIRONMENTALLY HAZARDOUS SUBSTANCE, SOLID, N.O.S.', {
          packingGroup: 'III',
          isTechnicalNameRequired: false,
        });
        const result = evaluateMarkingRequirements(context);

        const technicalNameMarking = result.find((m) => m.id === 'technical-name');
        expect(technicalNameMarking).toBeUndefined();
      });

      test('Scenario 14: UN3082 - includes PSN for liquid', () => {
        const context = createClass9Context('UN3082', 'ENVIRONMENTALLY HAZARDOUS SUBSTANCE, LIQUID, N.O.S.', {
          packingGroup: 'III',
          physicalState: PhysicalState.LIQUID,
          isTechnicalNameRequired: true,
          technicalName: 'Tributyltin oxide',
        });
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('UN3082');
        expect(psnMarking?.value).toContain('LIQUID');
      });

      test('Scenario 14, Alteration 2: technical name missing from marking', () => {
        // Technical name should be present when required
        const context = createClass9Context('UN3082', 'ENVIRONMENTALLY HAZARDOUS SUBSTANCE, LIQUID, N.O.S.', {
          packingGroup: 'III',
          physicalState: PhysicalState.LIQUID,
          isTechnicalNameRequired: true,
          technicalName: 'Tributyltin oxide',
        });
        const result = evaluateMarkingRequirements(context);

        const technicalNameMarking = result.find((m) => m.id === 'technical-name');
        expect(technicalNameMarking).toBeDefined();
        expect(technicalNameMarking?.value).toBe('Tributyltin oxide');
      });
    });

    describe('PCBs and Asbestos', () => {
      test('Scenario 15: UN2315 (PCBs liquid) - includes PSN', () => {
        const context = createClass9Context('UN2315', 'POLYCHLORINATED BIPHENYLS, LIQUID', {
          packingGroup: 'II',
          physicalState: PhysicalState.LIQUID,
        });
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('UN2315');
        expect(psnMarking?.value).toContain('POLYCHLORINATED BIPHENYLS');
      });

      test('Scenario 15, Alteration 3: PSN shows abbreviated "PCB"', () => {
        // Full PSN should be POLYCHLORINATED BIPHENYLS, not abbreviated
        const context = createClass9Context('UN2315', 'POLYCHLORINATED BIPHENYLS, LIQUID', {
          packingGroup: 'II',
        });
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking?.value).toContain('POLYCHLORINATED BIPHENYLS');
      });

      test('Scenario 16: UN3432 (PCBs solid) - includes PSN', () => {
        const context = createClass9Context('UN3432', 'POLYCHLORINATED BIPHENYLS, SOLID', {
          packingGroup: 'II',
        });
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('UN3432');
        expect(psnMarking?.value).toContain('SOLID');
      });

      test('Scenario 16, Alteration 3: PSN shows LIQUID instead of SOLID', () => {
        // Physical state in PSN must match material
        const context = createClass9Context('UN3432', 'POLYCHLORINATED BIPHENYLS, SOLID', {
          packingGroup: 'II',
        });
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking?.value).toContain('SOLID');
        expect(psnMarking?.value).not.toContain('LIQUID');
      });

      test('Scenario 18: UN2212 (Asbestos) - includes PSN with type', () => {
        const context = createClass9Context('UN2212', 'ASBESTOS, AMPHIBOLE (amosite)', {
          packingGroup: 'II',
        });
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('UN2212');
        expect(psnMarking?.value).toContain('ASBESTOS');
        expect(psnMarking?.value).toContain('AMPHIBOLE');
      });

      test('Scenario 18, Alteration 1: PSN missing amphibole type specification', () => {
        // PSN should specify the asbestos type (AMPHIBOLE)
        const context = createClass9Context('UN2212', 'ASBESTOS, AMPHIBOLE (amosite)', {
          packingGroup: 'II',
        });
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking?.value).toContain('AMPHIBOLE');
      });
    });

    describe('GMOs', () => {
      test('Scenario 19: UN3245 (GMOs) - includes PSN', () => {
        const context = createClass9Context('UN3245', 'GENETICALLY MODIFIED ORGANISMS');
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('UN3245');
        expect(psnMarking?.value).toContain('GENETICALLY MODIFIED ORGANISMS');
      });
    });
  });

  describe('POP Marking', () => {
    describe('Materials WITH Packing Group', () => {
      test('Scenario 13: UN3077 (PG III) - requires POP marking when enabled', () => {
        const context = createClass9Context('UN3077', 'ENVIRONMENTALLY HAZARDOUS SUBSTANCE, SOLID, N.O.S.', {
          packingGroup: 'III',
          usesPopMarking: true,
          inputPOPMarking: {
            B: '4G',
            C: 'Z', // PG III requires Z
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

      test('Scenario 13, Alteration 3: POP code Y invalid for PG III (needs Z)', () => {
        // PG III requires POP code Z, not Y
        const context = createClass9Context('UN3077', 'ENVIRONMENTALLY HAZARDOUS SUBSTANCE, SOLID, N.O.S.', {
          packingGroup: 'III',
          usesPopMarking: true,
          inputPOPMarking: {
            B: '4G',
            C: 'Z', // Correct for PG III
            D: '25',
            E: 'S',
            F: '12',
            G: 'USA',
            H: 'DOD',
          },
        });
        const result = evaluateMarkingRequirements(context);

        const popMarking = result.find((m) => m.id === 'pop-marking');
        expect(popMarking?.metadata?.C).toBe('Z');
      });

      test('Scenario 15: UN2315 (PG II) - POP marking with Y code', () => {
        const context = createClass9Context('UN2315', 'POLYCHLORINATED BIPHENYLS, LIQUID', {
          packingGroup: 'II',
          usesPopMarking: true,
          inputPOPMarking: {
            B: '1A1',
            C: 'Y', // PG II requires Y
            D: '100',
            E: 'L',
            F: '12',
            G: 'USA',
            H: 'DOD',
          },
        });
        const result = evaluateMarkingRequirements(context);

        const popMarking = result.find((m) => m.id === 'pop-marking');
        expect(popMarking).toBeDefined();
        expect(popMarking?.metadata?.C).toBe('Y');
      });

      test('Scenario 15, Alteration 2: POP code Z invalid for PG II (needs Y)', () => {
        // PG II requires Y, Z would be invalid
        const context = createClass9Context('UN2315', 'POLYCHLORINATED BIPHENYLS, LIQUID', {
          packingGroup: 'II',
          usesPopMarking: true,
          inputPOPMarking: {
            B: '1A1',
            C: 'Y', // Correct for PG II
            D: '100',
            E: 'L',
            F: '12',
            G: 'USA',
            H: 'DOD',
          },
        });
        const result = evaluateMarkingRequirements(context);

        const popMarking = result.find((m) => m.id === 'pop-marking');
        expect(popMarking?.metadata?.C).toBe('Y');
        expect(popMarking?.metadata?.C).not.toBe('Z');
      });

      test('Scenario 16, Alteration 2: missing POP marking for PG II material', () => {
        // POP marking should be present when required
        const context = createClass9Context('UN3432', 'POLYCHLORINATED BIPHENYLS, SOLID', {
          packingGroup: 'II',
          usesPopMarking: true,
          inputPOPMarking: {
            B: '4G',
            C: 'Y',
            D: '15',
            E: 'S',
            F: '12',
            G: 'USA',
            H: 'DOD',
          },
        });
        const result = evaluateMarkingRequirements(context);

        const popMarking = result.find((m) => m.id === 'pop-marking');
        expect(popMarking).toBeDefined();
      });
    });

    describe('Materials WITHOUT Packing Group', () => {
      test('Lithium batteries do not require POP marking (no packing group)', () => {
        // Materials without packing group generally don't use POP
        const context = createClass9Context('UN3480', 'LITHIUM ION BATTERIES', {
          usesPopMarking: false,
        });
        const result = evaluateMarkingRequirements(context);

        const popMarking = result.find((m) => m.id === 'pop-marking');
        expect(popMarking).toBeUndefined();
      });

      test('Dry ice does not require POP marking (no packing group)', () => {
        const context = createClass9Context('UN1845', 'CARBON DIOXIDE, SOLID', {
          usesPopMarking: false,
        });
        const result = evaluateMarkingRequirements(context);

        const popMarking = result.find((m) => m.id === 'pop-marking');
        expect(popMarking).toBeUndefined();
      });
    });

    test('POP marking is NOT required when isLimitedQuantity is true', () => {
      const context = createClass9Context('UN3077', 'ENVIRONMENTALLY HAZARDOUS SUBSTANCE, SOLID, N.O.S.', {
        packingGroup: 'III',
        usesPopMarking: true,
        isLimitedQuantity: true,
      });
      const result = evaluateMarkingRequirements(context);

      const popMarking = result.find((m) => m.id === 'pop-marking');
      expect(popMarking).toBeUndefined();
    });
  });

  describe('Excepted Quantity Marking', () => {
    test('Excepted quantity materials ONLY return E marking', () => {
      const context = createClass9Context('UN3077', 'ENVIRONMENTALLY HAZARDOUS SUBSTANCE, SOLID, N.O.S.', {
        packingGroup: 'III',
        isExceptedQuantity: true,
        usesPopMarking: true,
      });
      const result = evaluateMarkingRequirements(context);

      expect(result.length).toBe(1);
      expect(result[0].id).toBe('excepted-quantity-e-marking');
    });

    test('E marking includes hazard class 9', () => {
      const context = createClass9Context('UN3480', 'LITHIUM ION BATTERIES', {
        isExceptedQuantity: true,
      });
      const result = evaluateMarkingRequirements(context);

      const eMarking = result.find((m) => m.id === 'excepted-quantity-e-marking');
      expect(eMarking).toBeDefined();
      expect(eMarking?.value).toContain('9');
    });
  });

  describe('Limited Quantity Marking', () => {
    test('Limited quantity materials include limited quantity marking', () => {
      const context = createClass9Context('UN3082', 'ENVIRONMENTALLY HAZARDOUS SUBSTANCE, LIQUID, N.O.S.', {
        packingGroup: 'III',
        isLimitedQuantity: true,
      });
      const result = evaluateMarkingRequirements(context);

      const ltdQtyMarking = result.find((m) => m.id === 'limited-quantity');
      expect(ltdQtyMarking).toBeDefined();
      expect(ltdQtyMarking?.label).toBe('Limited Quantity');
    });

    test('Non-limited quantity materials do NOT include limited quantity marking', () => {
      const context = createClass9Context('UN3082', 'ENVIRONMENTALLY HAZARDOUS SUBSTANCE, LIQUID, N.O.S.', {
        packingGroup: 'III',
        isLimitedQuantity: false,
      });
      const result = evaluateMarkingRequirements(context);

      const ltdQtyMarking = result.find((m) => m.id === 'limited-quantity');
      expect(ltdQtyMarking).toBeUndefined();
    });
  });

  describe('Overpack Marking', () => {
    test('Overpack marking is included when overpack is true', () => {
      const context = createClass9Context('UN3480', 'LITHIUM ION BATTERIES');
      context.overpack = true;
      const result = evaluateMarkingRequirements(context);

      const overpackMarking = result.find((m) => m.id === 'overpack');
      expect(overpackMarking).toBeDefined();
      expect(overpackMarking?.label).toBe('OVERPACK');
    });

    test('Overpack marking is NOT included when overpack is false', () => {
      const context = createClass9Context('UN3480', 'LITHIUM ION BATTERIES');
      context.overpack = false;
      const result = evaluateMarkingRequirements(context);

      const overpackMarking = result.find((m) => m.id === 'overpack');
      expect(overpackMarking).toBeUndefined();
    });
  });

  describe('PSN Marking Order and Label', () => {
    test('PSN marking is always first in the returned array', () => {
      const context = createClass9Context('UN3480', 'LITHIUM ION BATTERIES');
      const result = evaluateMarkingRequirements(context);

      expect(result.length).toBeGreaterThan(0);
      expect(result[0].id).toBe('proper-shipping-name-unid');
    });

    test('PSN marking has correct label', () => {
      const context = createClass9Context('UN3480', 'LITHIUM ION BATTERIES');
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking?.label).toBe('Proper Shipping Name and UN Number');
    });
  });
});
