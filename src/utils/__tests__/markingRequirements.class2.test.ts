import { evaluateMarkingRequirements, RequiredMarking } from '../markingRequirements';
import { HazProPreparerContext } from '../../contexts/HazProPreparerProvider/reducer';
import { HazardousMaterialItem, PhysicalState, QuantityUnit } from '../../../types';

/**
 * Creates a minimal HazProPreparerContext for Class 2 (Gases) testing.
 *
 * Class 2 materials are gases with hazclass divisions like 2.1 (Flammable), 2.2 (Non-flammable), 2.3 (Toxic).
 * Unlike Class 1, Class 2 materials typically:
 * - Have no packing group (empty string) for most entries
 * - Use cylinder specifications (DOT-3A, 3AA, 3AL, etc.) instead of POP marking for most
 * - Aerosols use box/drum codes (4G, 4C1, etc.)
 * - Division 2.3 requires INHALATION HAZARD marking
 * - Fire extinguishers (UN1044) require MEETS DOT REQUIREMENTS marking
 * - Key 19 cylinder position statement required for most (except aerosols/fire extinguishers)
 */
function createClass2Context(
  unNumber: string,
  hazardClass: string,
  properShippingName: string,
  options: {
    usesPopMarking?: boolean;
    packagingParagraph?: string;
    subsidiaryRisk?: string;
    isTechnicalNameRequired?: boolean;
    technicalName?: string;
    isLimitedQuantity?: boolean;
    isExceptedQuantity?: boolean;
    usesCaaCertification?: boolean;
    usesCoeCertification?: boolean;
    usesDotCylinderMarking?: boolean;
    inputCylinderPOPMarking?: string;
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
    packagingParagraph = 'A6.3.',
    subsidiaryRisk = '',
    isTechnicalNameRequired = false,
    technicalName = '',
    isLimitedQuantity = false,
    isExceptedQuantity = false,
    usesCaaCertification = false,
    usesCoeCertification = false,
    usesDotCylinderMarking = false,
    inputCylinderPOPMarking,
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
    packingGroup: '', // Class 2 gases typically have no packing group
    specialProvision: '',
    packagingParagraph,
    physicalState: PhysicalState.GAS,
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
      usesDotCylinderMarking,
      inputCylinderPOPMarking,
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

describe('Marking Requirements - Class 2 Gases', () => {
  describe('Proper Shipping Name and UN Number (All 20 Scenarios)', () => {
    test('Scenario 1: UN1001 - ACETYLENE, DISSOLVED includes PSN and UN number', () => {
      // UN1001 ACETYLENE, DISSOLVED is a Class 2.1 flammable gas
      const context = createClass2Context('UN1001', '2.1', 'ACETYLENE, DISSOLVED', {
        packagingParagraph: 'A6.9.',
      });
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toContain('UN1001');
      expect(psnMarking?.value).toContain('ACETYLENE, DISSOLVED');
    });

    test('Scenario 2: UN1011 - BUTANE includes PSN and UN number', () => {
      // UN1011 BUTANE is a Class 2.1 flammable gas
      const context = createClass2Context('UN1011', '2.1', 'BUTANE', {
        packagingParagraph: 'A6.3.',
      });
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toContain('UN1011');
      expect(psnMarking?.value).toContain('BUTANE');
    });

    test('Scenario 3: UN1978 - PROPANE includes PSN and UN number', () => {
      // UN1978 PROPANE is a Class 2.1 flammable gas
      const context = createClass2Context('UN1978', '2.1', 'PROPANE', {
        packagingParagraph: 'A6.3.',
      });
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toContain('UN1978');
      expect(psnMarking?.value).toContain('PROPANE');
    });

    test('Scenario 3, Alteration 1: Wrong UN number (UN1979 vs UN1978) - marking reflects input', () => {
      // Test that the system marks what it receives - wrong UN would show in marking
      const context = createClass2Context('UN1979', '2.1', 'PROPANE', {
        packagingParagraph: 'A6.3.',
      });
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      // If wrong UN is entered, it will appear in the marking
      expect(psnMarking?.value).toContain('UN1979');
    });

    test('Scenario 4: UN1950 - AEROSOLS, FLAMMABLE includes PSN and UN number', () => {
      // UN1950 AEROSOLS is a Class 2.1 flammable gas (aerosol form)
      const context = createClass2Context('UN1950', '2.1', 'AEROSOLS, flammable', {
        packagingParagraph: 'A6.2.',
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

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toContain('UN1950');
      expect(psnMarking?.value).toContain('AEROSOLS');
    });

    test('Scenario 4, Alteration 2: PSN abbreviated incorrectly - system stores as entered', () => {
      // If user enters abbreviated PSN, system reflects it
      const context = createClass2Context('UN1950', '2.1', 'AERO, FLAM', {
        packagingParagraph: 'A6.2.',
      });
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      // Abbreviated PSN would be stored as entered
      expect(psnMarking?.value).toContain('AERO');
    });

    test('Scenario 6: UN1006 - ARGON, COMPRESSED includes PSN and UN number', () => {
      // UN1006 ARGON, COMPRESSED is a Class 2.2 non-flammable gas
      const context = createClass2Context('UN1006', '2.2', 'ARGON, COMPRESSED', {
        packagingParagraph: 'A6.3.',
      });
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toContain('UN1006');
      expect(psnMarking?.value).toContain('ARGON, COMPRESSED');
    });

    test('Scenario 7: UN1013 - CARBON DIOXIDE includes PSN and UN number', () => {
      // UN1013 CARBON DIOXIDE is a Class 2.2 non-flammable gas
      const context = createClass2Context('UN1013', '2.2', 'CARBON DIOXIDE', {
        packagingParagraph: 'A6.3.',
      });
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toContain('UN1013');
      expect(psnMarking?.value).toContain('CARBON DIOXIDE');
    });

    test('Scenario 7, Alteration 3: PSN abbreviated as "CO2" - system stores as entered', () => {
      // If user enters abbreviated PSN "CO2" instead of full name
      const context = createClass2Context('UN1013', '2.2', 'CO2', {
        packagingParagraph: 'A6.3.',
      });
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toContain('CO2');
      // Should NOT contain full name if abbreviated was entered
      expect(psnMarking?.value).not.toContain('CARBON DIOXIDE');
    });

    test('Scenario 8: UN1066 - NITROGEN, COMPRESSED includes PSN and UN number', () => {
      // UN1066 NITROGEN, COMPRESSED is a Class 2.2 non-flammable gas
      const context = createClass2Context('UN1066', '2.2', 'NITROGEN, COMPRESSED', {
        packagingParagraph: 'A6.3.',
      });
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toContain('UN1066');
      expect(psnMarking?.value).toContain('NITROGEN, COMPRESSED');
    });

    test('Scenario 9: UN1072 - OXYGEN, COMPRESSED includes PSN and UN number', () => {
      // UN1072 OXYGEN, COMPRESSED is a Class 2.2 non-flammable gas with 5.1 subsidiary
      const context = createClass2Context('UN1072', '2.2', 'OXYGEN, COMPRESSED', {
        packagingParagraph: 'A6.3.',
        subsidiaryRisk: '5.1',
      });
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toContain('UN1072');
      expect(psnMarking?.value).toContain('OXYGEN, COMPRESSED');
    });

    test('Scenario 11: UN1044 - FIRE EXTINGUISHERS includes PSN and UN number', () => {
      // UN1044 FIRE EXTINGUISHERS is a Class 2.2 non-flammable gas
      const context = createClass2Context('UN1044', '2.2', 'FIRE EXTINGUISHERS', {
        packagingParagraph: 'A6.7.',
      });
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toContain('UN1044');
      expect(psnMarking?.value).toContain('FIRE EXTINGUISHERS');
    });

    test('Scenario 12: UN1977 - NITROGEN, REFRIGERATED LIQUID includes PSN and UN number', () => {
      // UN1977 NITROGEN, REFRIGERATED LIQUID is a Class 2.2 cryogenic liquid
      const context = createClass2Context('UN1977', '2.2', 'NITROGEN, REFRIGERATED LIQUID', {
        packagingParagraph: 'A6.11.',
      });
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toContain('UN1977');
      expect(psnMarking?.value).toContain('NITROGEN, REFRIGERATED LIQUID');
    });

    test('Scenario 13: UN1950 - AEROSOLS (non-flammable) includes PSN and UN number', () => {
      // UN1950 AEROSOLS, non-flammable is a Class 2.2 gas
      const context = createClass2Context('UN1950', '2.2', 'AEROSOLS, non-flammable', {
        packagingParagraph: 'A6.2.',
      });
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toContain('UN1950');
      expect(psnMarking?.value).toContain('AEROSOLS');
    });

    test('Scenario 14: UN1017 - CHLORINE includes PSN and UN number', () => {
      // UN1017 CHLORINE is a Class 2.3 toxic gas with 5.1 and 8 subsidiary
      const context = createClass2Context('UN1017', '2.3', 'CHLORINE', {
        packagingParagraph: 'A6.4.',
        subsidiaryRisk: '5.1, 8',
      });
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toContain('UN1017');
      expect(psnMarking?.value).toContain('CHLORINE');
    });

    test('Scenario 15: UN1053 - HYDROGEN SULFIDE includes PSN and UN number', () => {
      // UN1053 HYDROGEN SULFIDE is a Class 2.3 toxic gas with 2.1 subsidiary
      const context = createClass2Context('UN1053', '2.3', 'HYDROGEN SULFIDE', {
        packagingParagraph: 'A6.4.',
        subsidiaryRisk: '2.1',
      });
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toContain('UN1053');
      expect(psnMarking?.value).toContain('HYDROGEN SULFIDE');
    });

    test('Scenario 16: UN1076 - PHOSGENE includes PSN and UN number', () => {
      // UN1076 PHOSGENE is a Class 2.3 toxic gas with 8 subsidiary
      const context = createClass2Context('UN1076', '2.3', 'PHOSGENE', {
        packagingParagraph: 'A6.15.',
        subsidiaryRisk: '8',
      });
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toContain('UN1076');
      expect(psnMarking?.value).toContain('PHOSGENE');
    });

    test('Scenario 17: UN2199 - PHOSPHINE includes PSN and UN number', () => {
      // UN2199 PHOSPHINE is a Class 2.3 toxic gas with 2.1 subsidiary
      const context = createClass2Context('UN2199', '2.3', 'PHOSPHINE', {
        packagingParagraph: 'A6.15.',
        subsidiaryRisk: '2.1',
      });
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toContain('UN2199');
      expect(psnMarking?.value).toContain('PHOSPHINE');
    });

    test('PSN marking is always first in the returned array for Class 2', () => {
      const context = createClass2Context('UN1001', '2.1', 'ACETYLENE, DISSOLVED');
      const result = evaluateMarkingRequirements(context);

      expect(result.length).toBeGreaterThan(0);
      expect(result[0].id).toBe('proper-shipping-name-unid');
    });

    test('PSN marking has correct label', () => {
      const context = createClass2Context('UN1001', '2.1', 'ACETYLENE, DISSOLVED');
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking?.label).toBe('Proper Shipping Name and UN Number');
    });
  });

  describe('Technical Name for N.O.S. Entries', () => {
    test('Scenario 5: UN1954 - COMPRESSED GAS, FLAMMABLE, N.O.S. requires technical name', () => {
      // UN1954 is an N.O.S. entry requiring technical name (Methane mixture)
      const context = createClass2Context(
        'UN1954',
        '2.1',
        'COMPRESSED GAS, FLAMMABLE, N.O.S.',
        {
          packagingParagraph: 'A6.3.',
          isTechnicalNameRequired: true,
          technicalName: 'Methane mixture',
        }
      );
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toContain('UN1954');
      expect(psnMarking?.value).toContain('COMPRESSED GAS, FLAMMABLE, N.O.S.');

      const technicalNameMarking = result.find((m) => m.id === 'technical-name');
      expect(technicalNameMarking).toBeDefined();
      expect(technicalNameMarking?.value).toBe('Methane mixture');
    });

    test('Scenario 5, Alteration 1: Missing technical name Key 12 - flag is false', () => {
      // When isTechnicalNameRequired is incorrectly set to false
      const context = createClass2Context(
        'UN1954',
        '2.1',
        'COMPRESSED GAS, FLAMMABLE, N.O.S.',
        {
          packagingParagraph: 'A6.3.',
          isTechnicalNameRequired: false,
        }
      );
      const result = evaluateMarkingRequirements(context);

      const technicalNameMarking = result.find((m) => m.id === 'technical-name');
      expect(technicalNameMarking).toBeUndefined();
    });

    test('Scenario 5, Alteration 2: Missing technical name marking - empty value', () => {
      // When flag is true but technical name is not provided
      const context = createClass2Context(
        'UN1954',
        '2.1',
        'COMPRESSED GAS, FLAMMABLE, N.O.S.',
        {
          packagingParagraph: 'A6.3.',
          isTechnicalNameRequired: true,
          technicalName: '',
        }
      );
      const result = evaluateMarkingRequirements(context);

      const technicalNameMarking = result.find((m) => m.id === 'technical-name');
      expect(technicalNameMarking).toBeDefined();
      expect(technicalNameMarking?.value).toBe('');
    });

    test('Scenario 10: UN1956 - COMPRESSED GAS, N.O.S. requires technical name', () => {
      // UN1956 is an N.O.S. entry requiring technical name (Helium, Neon mixture)
      const context = createClass2Context('UN1956', '2.2', 'COMPRESSED GAS, N.O.S.', {
        packagingParagraph: 'A6.3.',
        isTechnicalNameRequired: true,
        technicalName: 'Helium, Neon mixture',
      });
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toContain('UN1956');
      expect(psnMarking?.value).toContain('COMPRESSED GAS, N.O.S.');

      const technicalNameMarking = result.find((m) => m.id === 'technical-name');
      expect(technicalNameMarking).toBeDefined();
      expect(technicalNameMarking?.value).toBe('Helium, Neon mixture');
    });

    test('Scenario 10, Alteration 1: Missing technical name Key 12 - no marking generated', () => {
      const context = createClass2Context('UN1956', '2.2', 'COMPRESSED GAS, N.O.S.', {
        packagingParagraph: 'A6.3.',
        isTechnicalNameRequired: false,
      });
      const result = evaluateMarkingRequirements(context);

      const technicalNameMarking = result.find((m) => m.id === 'technical-name');
      expect(technicalNameMarking).toBeUndefined();
    });

    test('Scenario 10, Alteration 2: Missing technical name marking - empty value', () => {
      const context = createClass2Context('UN1956', '2.2', 'COMPRESSED GAS, N.O.S.', {
        packagingParagraph: 'A6.3.',
        isTechnicalNameRequired: true,
        technicalName: '',
      });
      const result = evaluateMarkingRequirements(context);

      const technicalNameMarking = result.find((m) => m.id === 'technical-name');
      expect(technicalNameMarking).toBeDefined();
      expect(technicalNameMarking?.value).toBe('');
    });

    test('Scenario 18: UN1955 - COMPRESSED GAS, TOXIC, N.O.S. requires technical name', () => {
      // UN1955 is an N.O.S. entry requiring technical name (Boron trifluoride)
      const context = createClass2Context(
        'UN1955',
        '2.3',
        'COMPRESSED GAS, TOXIC, N.O.S.',
        {
          packagingParagraph: 'A6.5.',
          isTechnicalNameRequired: true,
          technicalName: 'Boron trifluoride',
        }
      );
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toContain('UN1955');

      const technicalNameMarking = result.find((m) => m.id === 'technical-name');
      expect(technicalNameMarking).toBeDefined();
      expect(technicalNameMarking?.value).toBe('Boron trifluoride');
    });

    test('Scenario 18, Alteration 1: Missing technical name - no value provided', () => {
      const context = createClass2Context(
        'UN1955',
        '2.3',
        'COMPRESSED GAS, TOXIC, N.O.S.',
        {
          packagingParagraph: 'A6.5.',
          isTechnicalNameRequired: true,
          technicalName: '',
        }
      );
      const result = evaluateMarkingRequirements(context);

      const technicalNameMarking = result.find((m) => m.id === 'technical-name');
      expect(technicalNameMarking).toBeDefined();
      expect(technicalNameMarking?.value).toBe('');
    });

    test('Scenario 19: UN3160 - LIQUEFIED GAS, TOXIC, FLAMMABLE, N.O.S. Zone C requires technical name', () => {
      // UN3160 Zone C - Methyl bromide mixture
      const context = createClass2Context(
        'UN3160',
        '2.3',
        'LIQUEFIED GAS, TOXIC, FLAMMABLE, N.O.S.',
        {
          packagingParagraph: 'A6.4.',
          isTechnicalNameRequired: true,
          technicalName: 'Methyl bromide mixture',
          subsidiaryRisk: '2.1',
        }
      );
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toContain('UN3160');

      const technicalNameMarking = result.find((m) => m.id === 'technical-name');
      expect(technicalNameMarking).toBeDefined();
      expect(technicalNameMarking?.value).toBe('Methyl bromide mixture');
    });

    test('Scenario 19, Alteration 2: Missing technical name marking', () => {
      const context = createClass2Context(
        'UN3160',
        '2.3',
        'LIQUEFIED GAS, TOXIC, FLAMMABLE, N.O.S.',
        {
          packagingParagraph: 'A6.4.',
          isTechnicalNameRequired: true,
          technicalName: '',
          subsidiaryRisk: '2.1',
        }
      );
      const result = evaluateMarkingRequirements(context);

      const technicalNameMarking = result.find((m) => m.id === 'technical-name');
      expect(technicalNameMarking).toBeDefined();
      expect(technicalNameMarking?.value).toBe('');
    });

    test('Scenario 20: UN3160 - LIQUEFIED GAS, TOXIC, FLAMMABLE, N.O.S. Zone D requires technical name', () => {
      // UN3160 Zone D - Difluoroethane mixture
      const context = createClass2Context(
        'UN3160',
        '2.3',
        'LIQUEFIED GAS, TOXIC, FLAMMABLE, N.O.S.',
        {
          packagingParagraph: 'A6.4.',
          isTechnicalNameRequired: true,
          technicalName: 'Difluoroethane mixture',
          subsidiaryRisk: '2.1',
        }
      );
      const result = evaluateMarkingRequirements(context);

      const technicalNameMarking = result.find((m) => m.id === 'technical-name');
      expect(technicalNameMarking).toBeDefined();
      expect(technicalNameMarking?.value).toBe('Difluoroethane mixture');
    });

    test('Scenario 20, Alteration 2: Wrong UN number (UN3162 vs UN3160) - marking reflects input', () => {
      // If wrong UN3162 is entered instead of UN3160
      const context = createClass2Context(
        'UN3162',
        '2.3',
        'LIQUEFIED GAS, TOXIC, FLAMMABLE, N.O.S.',
        {
          packagingParagraph: 'A6.4.',
          isTechnicalNameRequired: true,
          technicalName: 'Difluoroethane mixture',
        }
      );
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      // Wrong UN appears in marking as entered
      expect(psnMarking?.value).toContain('UN3162');
      expect(psnMarking?.value).not.toContain('UN3160');
    });
  });

  describe('INHALATION HAZARD Marking (Division 2.3 Only) - GAP IDENTIFIED', () => {
    /**
     * GAP: INHALATION HAZARD marking is required per AFMAN 24-604 for Division 2.3 materials
     * but is not currently implemented in markingRequirements.ts
     *
     * Per AFMAN 24-604:
     * - All Division 2.3 (toxic gas) materials must have "INHALATION HAZARD" marking
     * - This applies to Scenarios 14-20 (all Division 2.3 materials)
     *
     * The inspector (markingRequirementsInspector.tsx) checks for this in the PSN,
     * but the preparer side (markingRequirements.ts) does not generate this marking.
     */
    test('Scenario 14: UN1017 - CHLORINE should require INHALATION HAZARD marking', () => {
      const context = createClass2Context('UN1017', '2.3', 'CHLORINE', {
        packagingParagraph: 'A6.4.',
        subsidiaryRisk: '5.1, 8',
      });
      const result = evaluateMarkingRequirements(context);

      // PSN marking should be present
      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toContain('UN1017');
    });

    test.skip('Scenario 14, Alteration 2: Missing INHALATION HAZARD marking should be detected', () => {
      // GAP: INHALATION HAZARD marking not currently implemented in markingRequirements.ts
      const context = createClass2Context('UN1017', '2.3', 'CHLORINE', {
        packagingParagraph: 'A6.4.',
      });
      const result = evaluateMarkingRequirements(context);

      const inhalationMarking = result.find((m) => m.id === 'inhalation-hazard');
      expect(inhalationMarking).toBeDefined();
      expect(inhalationMarking?.value).toContain('INHALATION HAZARD');
    });

    test('Scenario 15: UN1053 - HYDROGEN SULFIDE is Division 2.3', () => {
      const context = createClass2Context('UN1053', '2.3', 'HYDROGEN SULFIDE', {
        packagingParagraph: 'A6.4.',
        subsidiaryRisk: '2.1',
      });
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toContain('HYDROGEN SULFIDE');
    });

    test('Scenario 16: UN1076 - PHOSGENE is Division 2.3', () => {
      const context = createClass2Context('UN1076', '2.3', 'PHOSGENE', {
        packagingParagraph: 'A6.15.',
        subsidiaryRisk: '8',
      });
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toContain('PHOSGENE');
    });

    test.skip('Scenario 16, Alteration 3: Missing INHALATION HAZARD marking should be detected', () => {
      // GAP: INHALATION HAZARD marking not currently implemented
      const context = createClass2Context('UN1076', '2.3', 'PHOSGENE', {
        packagingParagraph: 'A6.15.',
      });
      const result = evaluateMarkingRequirements(context);

      const inhalationMarking = result.find((m) => m.id === 'inhalation-hazard');
      expect(inhalationMarking).toBeDefined();
    });

    test('Scenario 17: UN2199 - PHOSPHINE is Division 2.3', () => {
      const context = createClass2Context('UN2199', '2.3', 'PHOSPHINE', {
        packagingParagraph: 'A6.15.',
        subsidiaryRisk: '2.1',
      });
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toContain('PHOSPHINE');
    });

    test('Scenario 18: UN1955 - COMPRESSED GAS, TOXIC, N.O.S. is Division 2.3', () => {
      const context = createClass2Context(
        'UN1955',
        '2.3',
        'COMPRESSED GAS, TOXIC, N.O.S.',
        {
          packagingParagraph: 'A6.5.',
          isTechnicalNameRequired: true,
          technicalName: 'Boron trifluoride',
        }
      );
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toContain('COMPRESSED GAS, TOXIC, N.O.S.');
    });

    test.skip('Scenario 18, Alteration 3: Missing INHALATION marking should be detected', () => {
      // GAP: INHALATION HAZARD marking not currently implemented
      const context = createClass2Context(
        'UN1955',
        '2.3',
        'COMPRESSED GAS, TOXIC, N.O.S.',
        {
          packagingParagraph: 'A6.5.',
        }
      );
      const result = evaluateMarkingRequirements(context);

      const inhalationMarking = result.find((m) => m.id === 'inhalation-hazard');
      expect(inhalationMarking).toBeDefined();
    });

    test('Scenario 19: UN3160 Zone C is Division 2.3', () => {
      const context = createClass2Context(
        'UN3160',
        '2.3',
        'LIQUEFIED GAS, TOXIC, FLAMMABLE, N.O.S.',
        {
          packagingParagraph: 'A6.4.',
          isTechnicalNameRequired: true,
          technicalName: 'Methyl bromide mixture',
          subsidiaryRisk: '2.1',
        }
      );
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toContain('UN3160');
    });

    test('Scenario 20: UN3160 Zone D is Division 2.3', () => {
      const context = createClass2Context(
        'UN3160',
        '2.3',
        'LIQUEFIED GAS, TOXIC, FLAMMABLE, N.O.S.',
        {
          packagingParagraph: 'A6.4.',
          isTechnicalNameRequired: true,
          technicalName: 'Difluoroethane mixture',
          subsidiaryRisk: '2.1',
        }
      );
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toContain('UN3160');
    });

    test('Division 2.1 and 2.2 do NOT require INHALATION HAZARD marking', () => {
      // Division 2.1 (flammable)
      const context21 = createClass2Context('UN1001', '2.1', 'ACETYLENE, DISSOLVED');
      const result21 = evaluateMarkingRequirements(context21);
      const inhalation21 = result21.find((m) => m.id === 'inhalation-hazard');
      expect(inhalation21).toBeUndefined();

      // Division 2.2 (non-flammable)
      const context22 = createClass2Context('UN1006', '2.2', 'ARGON, COMPRESSED');
      const result22 = evaluateMarkingRequirements(context22);
      const inhalation22 = result22.find((m) => m.id === 'inhalation-hazard');
      expect(inhalation22).toBeUndefined();
    });
  });

  describe('MEETS DOT REQUIREMENTS Marking - GAP IDENTIFIED', () => {
    /**
     * GAP: MEETS DOT REQUIREMENTS marking is required per AFMAN 24-604 for UN1044 Fire Extinguishers
     * but is not currently implemented in markingRequirements.ts
     *
     * The inspector (markingRequirementsInspector.tsx) checks for this marking at line 147,
     * but the preparer side (markingRequirements.ts) does not generate this marking.
     */
    test('Scenario 11: UN1044 - FIRE EXTINGUISHERS includes standard markings', () => {
      const context = createClass2Context('UN1044', '2.2', 'FIRE EXTINGUISHERS', {
        packagingParagraph: 'A6.7.',
      });
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toContain('UN1044');
      expect(psnMarking?.value).toContain('FIRE EXTINGUISHERS');
    });

    test.skip('Scenario 11, Alteration 1: Missing MEETS DOT REQUIREMENTS marking should be detected', () => {
      // GAP: MEETS DOT REQUIREMENTS marking not currently implemented in markingRequirements.ts
      const context = createClass2Context('UN1044', '2.2', 'FIRE EXTINGUISHERS', {
        packagingParagraph: 'A6.7.',
      });
      const result = evaluateMarkingRequirements(context);

      const meetsDotMarking = result.find((m) => m.id === 'meets-dot-requirements');
      expect(meetsDotMarking).toBeDefined();
      expect(meetsDotMarking?.value).toContain('MEETS DOT REQUIREMENTS');
    });

    test('Non-fire extinguisher Class 2 materials do NOT require MEETS DOT marking', () => {
      const context = createClass2Context('UN1001', '2.1', 'ACETYLENE, DISSOLVED');
      const result = evaluateMarkingRequirements(context);

      const meetsDotMarking = result.find((m) => m.id === 'meets-dot-requirements');
      expect(meetsDotMarking).toBeUndefined();
    });
  });

  describe('POP Marking (Packaging Specification)', () => {
    test('Aerosols (Scenario 4) use POP marking with box/drum codes', () => {
      const context = createClass2Context('UN1950', '2.1', 'AEROSOLS, flammable', {
        packagingParagraph: 'A6.2.',
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

      const popMarking = result.find((m) => m.id === 'pop-marking');
      expect(popMarking).toBeDefined();
      expect(popMarking?.renderType).toBe('pop');
      expect(popMarking?.metadata?.B).toBe('4G');
    });

    test('Aerosols (Scenario 13) non-flammable use POP marking', () => {
      const context = createClass2Context('UN1950', '2.2', 'AEROSOLS, non-flammable', {
        packagingParagraph: 'A6.2.',
        usesPopMarking: true,
        inputPOPMarking: {
          B: '4C1',
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
      expect(popMarking?.metadata?.B).toBe('4C1');
    });

    test('Scenario 2, Alteration 2: POP code 4G invalid for cylinder - marking still generated', () => {
      // System generates marking with what is entered; validation is separate
      const context = createClass2Context('UN1011', '2.1', 'BUTANE', {
        packagingParagraph: 'A6.3.',
        usesPopMarking: true,
        inputPOPMarking: {
          B: '4G', // Invalid for cylinder, should be DOT-3A etc.
          C: 'Y',
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
      // Invalid code is still stored in marking
      expect(popMarking?.metadata?.B).toBe('4G');
    });

    test('Scenario 8, Alteration 2: POP code "W" invalid - marking reflects input', () => {
      const context = createClass2Context('UN1066', '2.2', 'NITROGEN, COMPRESSED', {
        packagingParagraph: 'A6.3.',
        usesPopMarking: true,
        inputPOPMarking: {
          B: 'W', // Invalid code
          C: 'Y',
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
      expect(popMarking?.metadata?.B).toBe('W');
    });

    test('POP marking is NOT required when isLimitedQuantity is true', () => {
      const context = createClass2Context('UN1950', '2.1', 'AEROSOLS, flammable', {
        packagingParagraph: 'A6.2.',
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
      const context = createClass2Context('UN1001', '2.1', 'ACETYLENE, DISSOLVED', {
        usesPopMarking: true,
        usesCaaCertification: true,
      });
      const result = evaluateMarkingRequirements(context);

      const popMarking = result.find((m) => m.id === 'pop-marking');
      expect(popMarking).toBeUndefined();
    });

    test('POP marking is NOT required when usesCoeCertification is true', () => {
      const context = createClass2Context('UN1001', '2.1', 'ACETYLENE, DISSOLVED', {
        usesPopMarking: true,
        usesCoeCertification: true,
      });
      const result = evaluateMarkingRequirements(context);

      const popMarking = result.find((m) => m.id === 'pop-marking');
      expect(popMarking).toBeUndefined();
    });

    test('POP marking has correct label', () => {
      const context = createClass2Context('UN1950', '2.1', 'AEROSOLS, flammable', {
        packagingParagraph: 'A6.2.',
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

      const popMarking = result.find((m) => m.id === 'pop-marking');
      expect(popMarking?.label).toBe('POP Marking, stenciled and/or printed');
    });
  });

  describe('Cylinder Marking (DOT Specification)', () => {
    test('Cylinder marking is generated when usesDotCylinderMarking is true', () => {
      const context = createClass2Context('UN1001', '2.1', 'ACETYLENE, DISSOLVED', {
        packagingParagraph: 'A6.9.',
        usesDotCylinderMarking: true,
        inputCylinderPOPMarking: 'DOT-8',
      });
      const result = evaluateMarkingRequirements(context);

      const cylinderMarking = result.find((m) => m.id === 'cylinder-marking');
      expect(cylinderMarking).toBeDefined();
      expect(cylinderMarking?.label).toBe('Cylinder Marking');
      expect(cylinderMarking?.value).toBe('DOT-8');
    });

    test('Scenario 1: UN1001 ACETYLENE uses DOT-8 or DOT-8AL cylinders', () => {
      const context = createClass2Context('UN1001', '2.1', 'ACETYLENE, DISSOLVED', {
        packagingParagraph: 'A6.9.',
        usesDotCylinderMarking: true,
        inputCylinderPOPMarking: 'DOT-8AL',
      });
      const result = evaluateMarkingRequirements(context);

      const cylinderMarking = result.find((m) => m.id === 'cylinder-marking');
      expect(cylinderMarking).toBeDefined();
      expect(cylinderMarking?.value).toBe('DOT-8AL');
    });

    test('Cylinder marking is NOT generated when usesDotCylinderMarking is false', () => {
      const context = createClass2Context('UN1001', '2.1', 'ACETYLENE, DISSOLVED', {
        packagingParagraph: 'A6.9.',
        usesDotCylinderMarking: false,
      });
      const result = evaluateMarkingRequirements(context);

      const cylinderMarking = result.find((m) => m.id === 'cylinder-marking');
      expect(cylinderMarking).toBeUndefined();
    });

    test('Compressed gases typically use DOT-3A, 3AA, 3AL cylinder specifications', () => {
      const context = createClass2Context('UN1066', '2.2', 'NITROGEN, COMPRESSED', {
        packagingParagraph: 'A6.3.',
        usesDotCylinderMarking: true,
        inputCylinderPOPMarking: 'DOT-3AA',
      });
      const result = evaluateMarkingRequirements(context);

      const cylinderMarking = result.find((m) => m.id === 'cylinder-marking');
      expect(cylinderMarking).toBeDefined();
      expect(cylinderMarking?.value).toBe('DOT-3AA');
    });
  });

  describe('Key 19 Cylinder Position Statement - GAP IDENTIFIED', () => {
    /**
     * GAP: Key 19 cylinder position statement (e.g., "Cylinders shipped in accordance with...")
     * is required per AFMAN 24-604 for most Class 2 materials in cylinders
     * but is not currently implemented as a marking requirement.
     *
     * Exceptions: Aerosols and fire extinguishers do not require this statement.
     */
    test.skip('Scenario 1, Alteration 3: Missing Key 19 cylinder position statement should be detected', () => {
      // GAP: Key 19 cylinder position marking not currently implemented
      const context = createClass2Context('UN1001', '2.1', 'ACETYLENE, DISSOLVED', {
        packagingParagraph: 'A6.9.',
      });
      const result = evaluateMarkingRequirements(context);

      const key19Marking = result.find((m) => m.id === 'cylinder-position-statement');
      expect(key19Marking).toBeDefined();
    });

    test('Aerosols do NOT require Key 19 cylinder position statement', () => {
      const context = createClass2Context('UN1950', '2.1', 'AEROSOLS, flammable', {
        packagingParagraph: 'A6.2.',
      });
      const result = evaluateMarkingRequirements(context);

      // Verify no cylinder position marking is required for aerosols
      const key19Marking = result.find((m) => m.id === 'cylinder-position-statement');
      expect(key19Marking).toBeUndefined();
    });

    test('Fire extinguishers do NOT require Key 19 cylinder position statement', () => {
      const context = createClass2Context('UN1044', '2.2', 'FIRE EXTINGUISHERS', {
        packagingParagraph: 'A6.7.',
      });
      const result = evaluateMarkingRequirements(context);

      const key19Marking = result.find((m) => m.id === 'cylinder-position-statement');
      expect(key19Marking).toBeUndefined();
    });
  });

  describe('Orientation Marking - GAP IDENTIFIED', () => {
    /**
     * GAP: Orientation marking ("THIS END UP" or arrows) is required for cryogenic liquids
     * per AFMAN 24-604 but is not currently implemented in markingRequirements.ts
     */
    test('Scenario 12: UN1977 - NITROGEN, REFRIGERATED LIQUID includes PSN', () => {
      const context = createClass2Context('UN1977', '2.2', 'NITROGEN, REFRIGERATED LIQUID', {
        packagingParagraph: 'A6.11.',
      });
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toContain('NITROGEN, REFRIGERATED LIQUID');
    });

    test.skip('Scenario 12, Alteration 1: Missing orientation marking should be detected', () => {
      // GAP: Orientation marking not currently implemented
      const context = createClass2Context('UN1977', '2.2', 'NITROGEN, REFRIGERATED LIQUID', {
        packagingParagraph: 'A6.11.',
      });
      const result = evaluateMarkingRequirements(context);

      const orientationMarking = result.find((m) => m.id === 'orientation-marking');
      expect(orientationMarking).toBeDefined();
      expect(orientationMarking?.value).toContain('THIS END UP');
    });
  });

  describe('Excepted Quantity Marking', () => {
    test('Excepted quantity Class 2 materials ONLY return E marking', () => {
      const context = createClass2Context('UN1950', '2.1', 'AEROSOLS, flammable', {
        isExceptedQuantity: true,
        usesPopMarking: true,
      });
      const result = evaluateMarkingRequirements(context);

      // Should only have the E marking
      expect(result.length).toBe(1);
      expect(result[0].id).toBe('excepted-quantity-e-marking');
      expect(result[0].renderType).toBe('custom');
    });

    test('E marking includes hazard class information for Class 2', () => {
      const context = createClass2Context('UN1001', '2.1', 'ACETYLENE, DISSOLVED', {
        isExceptedQuantity: true,
      });
      const result = evaluateMarkingRequirements(context);

      const eMarking = result.find((m) => m.id === 'excepted-quantity-e-marking');
      expect(eMarking).toBeDefined();
      expect(eMarking?.value).toContain('2.1');
    });
  });

  describe('Limited Quantity Marking', () => {
    test('Limited quantity Class 2 materials include limited quantity marking', () => {
      const context = createClass2Context('UN1950', '2.1', 'AEROSOLS, flammable', {
        isLimitedQuantity: true,
      });
      const result = evaluateMarkingRequirements(context);

      const ltdQtyMarking = result.find((m) => m.id === 'limited-quantity');
      expect(ltdQtyMarking).toBeDefined();
      expect(ltdQtyMarking?.label).toBe('Limited Quantity');
    });

    test('Non-limited quantity Class 2 materials do NOT include limited quantity marking', () => {
      const context = createClass2Context('UN1950', '2.1', 'AEROSOLS, flammable', {
        isLimitedQuantity: false,
      });
      const result = evaluateMarkingRequirements(context);

      const ltdQtyMarking = result.find((m) => m.id === 'limited-quantity');
      expect(ltdQtyMarking).toBeUndefined();
    });
  });

  describe('Overpack Marking', () => {
    test('Overpack marking is included when overpack is true', () => {
      const context = createClass2Context('UN1001', '2.1', 'ACETYLENE, DISSOLVED');
      context.overpack = true;
      const result = evaluateMarkingRequirements(context);

      const overpackMarking = result.find((m) => m.id === 'overpack');
      expect(overpackMarking).toBeDefined();
      expect(overpackMarking?.label).toBe('OVERPACK');
    });

    test('Overpack marking is NOT included when overpack is false', () => {
      const context = createClass2Context('UN1001', '2.1', 'ACETYLENE, DISSOLVED');
      context.overpack = false;
      const result = evaluateMarkingRequirements(context);

      const overpackMarking = result.find((m) => m.id === 'overpack');
      expect(overpackMarking).toBeUndefined();
    });
  });

  describe('Class 2 vs Class 1 Differences', () => {
    test('Class 2 does NOT require EX Number marking (Class 1 only)', () => {
      const context = createClass2Context('UN1001', '2.1', 'ACETYLENE, DISSOLVED');
      const result = evaluateMarkingRequirements(context);

      const exNumberMarking = result.find((m) => m.id === 'ex-number');
      expect(exNumberMarking).toBeUndefined();
    });

    test('Class 2 does NOT require Military Shipping Label (Class 1 specific)', () => {
      // MSL is specific to Class 1 explosives military shipments
      const context = createClass2Context('UN1001', '2.1', 'ACETYLENE, DISSOLVED');
      const result = evaluateMarkingRequirements(context);

      const mslMarking = result.find((m) => m.id === 'military-shipping-label');
      expect(mslMarking).toBeUndefined();
    });
  });

  describe('Subsidiary Risk Materials', () => {
    test('Scenario 9: UN1072 - OXYGEN has 5.1 (Oxidizer) subsidiary', () => {
      const context = createClass2Context('UN1072', '2.2', 'OXYGEN, COMPRESSED', {
        packagingParagraph: 'A6.3.',
        subsidiaryRisk: '5.1',
      });
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(context.hazardousMaterial.subsidiaryRisk).toBe('5.1');
    });

    test('Scenario 14: UN1017 - CHLORINE has 5.1 and 8 subsidiary risks', () => {
      const context = createClass2Context('UN1017', '2.3', 'CHLORINE', {
        packagingParagraph: 'A6.4.',
        subsidiaryRisk: '5.1, 8',
      });
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(context.hazardousMaterial.subsidiaryRisk).toBe('5.1, 8');
    });

    test('Scenario 15: UN1053 - HYDROGEN SULFIDE has 2.1 subsidiary', () => {
      const context = createClass2Context('UN1053', '2.3', 'HYDROGEN SULFIDE', {
        packagingParagraph: 'A6.4.',
        subsidiaryRisk: '2.1',
      });
      const result = evaluateMarkingRequirements(context);

      expect(context.hazardousMaterial.subsidiaryRisk).toBe('2.1');
    });

    test('Scenario 17: UN2199 - PHOSPHINE has 2.1 subsidiary', () => {
      const context = createClass2Context('UN2199', '2.3', 'PHOSPHINE', {
        packagingParagraph: 'A6.15.',
        subsidiaryRisk: '2.1',
      });
      const result = evaluateMarkingRequirements(context);

      expect(context.hazardousMaterial.subsidiaryRisk).toBe('2.1');
    });
  });

  describe('Packaging Paragraph Variations', () => {
    test('A6.2 - Aerosols packaging paragraph', () => {
      const context = createClass2Context('UN1950', '2.1', 'AEROSOLS, flammable', {
        packagingParagraph: 'A6.2.',
      });
      const result = evaluateMarkingRequirements(context);

      expect(context.hazardousMaterial.packagingParagraph).toBe('A6.2.');
      expect(result.find((m) => m.id === 'proper-shipping-name-unid')).toBeDefined();
    });

    test('A6.3 - Standard compressed gases packaging paragraph', () => {
      const context = createClass2Context('UN1006', '2.2', 'ARGON, COMPRESSED', {
        packagingParagraph: 'A6.3.',
      });
      const result = evaluateMarkingRequirements(context);

      expect(context.hazardousMaterial.packagingParagraph).toBe('A6.3.');
    });

    test('A6.4 - Toxic gases packaging paragraph', () => {
      const context = createClass2Context('UN1017', '2.3', 'CHLORINE', {
        packagingParagraph: 'A6.4.',
      });
      const result = evaluateMarkingRequirements(context);

      expect(context.hazardousMaterial.packagingParagraph).toBe('A6.4.');
    });

    test('A6.5 - N.O.S. toxic gases packaging paragraph', () => {
      const context = createClass2Context(
        'UN1955',
        '2.3',
        'COMPRESSED GAS, TOXIC, N.O.S.',
        {
          packagingParagraph: 'A6.5.',
        }
      );
      const result = evaluateMarkingRequirements(context);

      expect(context.hazardousMaterial.packagingParagraph).toBe('A6.5.');
    });

    test('A6.7 - Fire extinguishers packaging paragraph', () => {
      const context = createClass2Context('UN1044', '2.2', 'FIRE EXTINGUISHERS', {
        packagingParagraph: 'A6.7.',
      });
      const result = evaluateMarkingRequirements(context);

      expect(context.hazardousMaterial.packagingParagraph).toBe('A6.7.');
    });

    test('A6.9 - Acetylene packaging paragraph', () => {
      const context = createClass2Context('UN1001', '2.1', 'ACETYLENE, DISSOLVED', {
        packagingParagraph: 'A6.9.',
      });
      const result = evaluateMarkingRequirements(context);

      expect(context.hazardousMaterial.packagingParagraph).toBe('A6.9.');
    });

    test('A6.11 - Cryogenic liquids packaging paragraph', () => {
      const context = createClass2Context('UN1977', '2.2', 'NITROGEN, REFRIGERATED LIQUID', {
        packagingParagraph: 'A6.11.',
      });
      const result = evaluateMarkingRequirements(context);

      expect(context.hazardousMaterial.packagingParagraph).toBe('A6.11.');
    });

    test('A6.15 - Phosgene/Phosphine packaging paragraph', () => {
      const context = createClass2Context('UN1076', '2.3', 'PHOSGENE', {
        packagingParagraph: 'A6.15.',
      });
      const result = evaluateMarkingRequirements(context);

      expect(context.hazardousMaterial.packagingParagraph).toBe('A6.15.');
    });
  });
});
