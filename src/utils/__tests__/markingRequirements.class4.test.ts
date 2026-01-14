import { evaluateMarkingRequirements, RequiredMarking } from '../markingRequirements';
import { HazProPreparerContext } from '../../contexts/HazProPreparerProvider/reducer';
import { HazardousMaterialItem, PhysicalState, QuantityUnit } from '../../../types';

/**
 * Creates a minimal HazProPreparerContext for Class 4 (Flammable Solids) testing.
 *
 * Class 4 materials include:
 * - Division 4.1: Flammable solids, self-reactive substances, solid desensitized explosives
 * - Division 4.2: Substances liable to spontaneous combustion (pyrophoric)
 * - Division 4.3: Substances which emit flammable gases when wet (dangerous when wet)
 *
 * POP marking codes based on packing group:
 * - X = PG I (highest danger)
 * - Y = PG II (medium danger)
 * - Z = PG III (lowest danger)
 */
function createClass4Context(
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
    packagingParagraph?: string;
    inputPOPMarking?: {
      B?: string | null;
      C?: string | null;
      D?: string | null;
      E?: string | null;
      F?: string | null;
      G?: string | null;
      H?: string | null;
    };
    controlTemperature?: string;
    emergencyTemperature?: string;
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
    packagingParagraph = 'A8.3.',
    inputPOPMarking,
  } = options;

  const hazardousMaterial: HazardousMaterialItem = {
    isFixed: '',
    isDomesticShipment: false,
    isTechnicalNameRequired,
    unid: unNumber,
    properShippingName,
    hazclassDiv: hazardClass,
    subsidiaryRisk: '',
    packingGroup,
    specialProvision: '',
    packagingParagraph,
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
    allowablePackingGroups: packingGroup,
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

describe('Marking Requirements - Class 4 (Flammable Solids)', () => {
  describe('UN Number and PSN Markings', () => {
    describe('Division 4.1 - Flammable Solids', () => {
      test('Scenario 1: UN1325 - FLAMMABLE SOLID, ORGANIC, N.O.S. (PG II)', () => {
        // UN1325 is a flammable solid, N.O.S. entry requiring technical name
        const context = createClass4Context(
          'UN1325',
          '4.1',
          'FLAMMABLE SOLID, ORGANIC, N.O.S.',
          'II',
          {
            isTechnicalNameRequired: true,
            technicalName: 'Naphthalene',
            packagingParagraph: 'A8.3.',
          }
        );
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('UN1325');
        expect(psnMarking?.value).toContain('FLAMMABLE SOLID, ORGANIC, N.O.S.');
      });

      test('Scenario 2: UN1944 - MATCHES, SAFETY (PG III)', () => {
        // UN1944 Safety matches, standard Division 4.1 material
        const context = createClass4Context(
          'UN1944',
          '4.1',
          'MATCHES, SAFETY (book, card or strike on box)',
          'III',
          { packagingParagraph: 'A8.14.' }
        );
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('UN1944');
        expect(psnMarking?.value).toContain('MATCHES, SAFETY');
      });

      test('Scenario 3: UN1310 - AMMONIUM PICRATE, WETTED (PG I)', () => {
        // UN1310 is a high-danger PG I flammable solid
        const context = createClass4Context(
          'UN1310',
          '4.1',
          'AMMONIUM PICRATE, WETTED with not less than 10 percent water, by mass',
          'I',
          { packagingParagraph: 'A8.3.' }
        );
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('UN1310');
        expect(psnMarking?.value).toContain('AMMONIUM PICRATE');
      });

      test('Scenario 4: UN1571 - BARIUM AZIDE, WETTED (PG I)', () => {
        // UN1571 is a PG I material requiring cylinder packaging per A8.10
        const context = createClass4Context(
          'UN1571',
          '4.1',
          'BARIUM AZIDE, WETTED with not less than 50 percent water, by mass',
          'I',
          { packagingParagraph: 'A8.10.' }
        );
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('UN1571');
        expect(psnMarking?.value).toContain('BARIUM AZIDE');
      });

      test('Scenario 5: UN2304 - NAPHTHALENE, MOLTEN (PG III)', () => {
        // UN2304 is a PG III molten material
        const context = createClass4Context(
          'UN2304',
          '4.1',
          'NAPHTHALENE, MOLTEN',
          'III',
          { packagingParagraph: 'A8.2.' }
        );
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('UN2304');
        expect(psnMarking?.value).toContain('NAPHTHALENE, MOLTEN');
      });

      test('Scenario 6: UN3221 - SELF-REACTIVE LIQUID TYPE B (No PG)', () => {
        // UN3221 is a self-reactive substance with no packing group
        // Requires temperature control markings
        const context = createClass4Context(
          'UN3221',
          '4.1',
          'SELF-REACTIVE LIQUID TYPE B',
          '', // No packing group for self-reactive
          { packagingParagraph: 'A8.4.' }
        );
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('UN3221');
        expect(psnMarking?.value).toContain('SELF-REACTIVE LIQUID TYPE B');
      });

      test('Scenario 7: UN2000 - CELLULOID (PG III)', () => {
        // UN2000 is a PG III flammable solid
        const context = createClass4Context(
          'UN2000',
          '4.1',
          'CELLULOID in block, rods, rolls, sheets, tubes, etc., except scrap',
          'III',
          { packagingParagraph: 'A8.3.' }
        );
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('UN2000');
        expect(psnMarking?.value).toContain('CELLULOID');
      });
    });

    describe('Division 4.2 - Spontaneously Combustible', () => {
      test('Scenario 8: UN2845 - PYROPHORIC LIQUID, ORGANIC, N.O.S. (PG I)', () => {
        // UN2845 is a pyrophoric liquid requiring technical name and cylinder spec
        const context = createClass4Context(
          'UN2845',
          '4.2',
          'PYROPHORIC LIQUID, ORGANIC, N.O.S.',
          'I',
          {
            isTechnicalNameRequired: true,
            technicalName: 'Trimethylaluminum',
            packagingParagraph: 'A8.5.',
          }
        );
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('UN2845');
        expect(psnMarking?.value).toContain('PYROPHORIC LIQUID, ORGANIC, N.O.S.');
      });

      test('Scenario 9: UN1383 - PYROPHORIC METAL, N.O.S. or PYROPHORIC ALLOY, N.O.S. (PG I)', () => {
        // UN1383 is a pyrophoric metal requiring technical name
        const context = createClass4Context(
          'UN1383',
          '4.2',
          'PYROPHORIC METAL, N.O.S. or PYROPHORIC ALLOY, N.O.S.',
          'I',
          {
            isTechnicalNameRequired: true,
            technicalName: 'Hafnium powder',
            packagingParagraph: 'A8.5.',
          }
        );
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('UN1383');
        expect(psnMarking?.value).toContain('PYROPHORIC');
      });

      test('Scenario 10: UN3088 - SELF-HEATING SOLID, ORGANIC, N.O.S. (PG II)', () => {
        // UN3088 is a self-heating solid requiring technical name
        const context = createClass4Context(
          'UN3088',
          '4.2',
          'SELF-HEATING SOLID, ORGANIC, N.O.S.',
          'II',
          {
            isTechnicalNameRequired: true,
            technicalName: 'Activated carbon',
            packagingParagraph: 'A8.3.',
          }
        );
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('UN3088');
        expect(psnMarking?.value).toContain('SELF-HEATING SOLID, ORGANIC, N.O.S.');
      });

      test('Scenario 11: UN2447 - PHOSPHORUS, WHITE, MOLTEN (PG I)', () => {
        // UN2447 is molten white phosphorus, extremely dangerous
        const context = createClass4Context(
          'UN2447',
          '4.2',
          'PHOSPHORUS, WHITE, MOLTEN',
          'I',
          { packagingParagraph: 'A8.5.' }
        );
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('UN2447');
        expect(psnMarking?.value).toContain('PHOSPHORUS, WHITE, MOLTEN');
      });

      test('Scenario 12: UN1373 - FIBRES or FABRICS impregnated with oil (PG III)', () => {
        // UN1373 is an oily rags type material, PG III
        const context = createClass4Context(
          'UN1373',
          '4.2',
          'FIBRES or FABRICS, ANIMAL or VEGETABLE or SYNTHETIC, N.O.S. with oil',
          'III',
          { packagingParagraph: 'A8.3.' }
        );
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('UN1373');
        expect(psnMarking?.value).toContain('FIBRES');
      });

      test('Scenario 13: UN3206 - ALKALI METAL ALCOHOLATES, SELF-HEATING, CORROSIVE, N.O.S. (PG II)', () => {
        // UN3206 has subsidiary corrosive risk and requires technical name
        const context = createClass4Context(
          'UN3206',
          '4.2',
          'ALKALI METAL ALCOHOLATES, SELF-HEATING, CORROSIVE, N.O.S.',
          'II',
          {
            isTechnicalNameRequired: true,
            technicalName: 'Potassium tert-butoxide',
            packagingParagraph: 'A8.3.',
          }
        );
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('UN3206');
        expect(psnMarking?.value).toContain('ALKALI METAL ALCOHOLATES');
      });
    });

    describe('Division 4.3 - Dangerous When Wet', () => {
      test('Scenario 14: UN1428 - SODIUM (PG I)', () => {
        // UN1428 is elemental sodium, highly reactive with water
        const context = createClass4Context('UN1428', '4.3', 'SODIUM', 'I', {
          packagingParagraph: 'A8.3.',
        });
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('UN1428');
        expect(psnMarking?.value).toContain('SODIUM');
      });

      test('Scenario 15: UN1415 - LITHIUM (PG I)', () => {
        // UN1415 is elemental lithium
        const context = createClass4Context('UN1415', '4.3', 'LITHIUM', 'I', {
          packagingParagraph: 'A8.3.',
        });
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('UN1415');
        expect(psnMarking?.value).toContain('LITHIUM');
      });

      test('Scenario 16: UN1402 - CALCIUM CARBIDE (PG II)', () => {
        // UN1402 generates acetylene when wet
        const context = createClass4Context('UN1402', '4.3', 'CALCIUM CARBIDE', 'II', {
          packagingParagraph: 'A8.3.',
        });
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('UN1402');
        expect(psnMarking?.value).toContain('CALCIUM CARBIDE');
      });

      test('Scenario 17: UN2813 - WATER-REACTIVE SOLID, N.O.S. (PG II)', () => {
        // UN2813 requires technical name as N.O.S. entry
        const context = createClass4Context(
          'UN2813',
          '4.3',
          'WATER-REACTIVE SOLID, N.O.S.',
          'II',
          {
            isTechnicalNameRequired: true,
            technicalName: 'Lithium silicon',
            packagingParagraph: 'A8.3.',
          }
        );
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('UN2813');
        expect(psnMarking?.value).toContain('WATER-REACTIVE SOLID, N.O.S.');
      });

      test('Scenario 18: UN1396 - ALUMINUM POWDER, UNCOATED (PG II)', () => {
        // UN1396 is uncoated aluminum powder
        const context = createClass4Context(
          'UN1396',
          '4.3',
          'ALUMINUM POWDER, UNCOATED',
          'II',
          { packagingParagraph: 'A8.3.' }
        );
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('UN1396');
        expect(psnMarking?.value).toContain('ALUMINUM POWDER');
      });

      test('Scenario 19: UN1400 - BARIUM (PG II)', () => {
        // UN1400 is elemental barium
        const context = createClass4Context('UN1400', '4.3', 'BARIUM', 'II', {
          packagingParagraph: 'A8.3.',
        });
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('UN1400');
        expect(psnMarking?.value).toContain('BARIUM');
      });

      test('Scenario 20: UN3148 - WATER-REACTIVE LIQUID, N.O.S. (PG I)', () => {
        // UN3148 is a liquid N.O.S. entry requiring technical name
        const context = createClass4Context(
          'UN3148',
          '4.3',
          'WATER-REACTIVE LIQUID, N.O.S.',
          'I',
          {
            isTechnicalNameRequired: true,
            technicalName: 'Titanium tetrachloride',
            packagingParagraph: 'A8.2.',
          }
        );
        const result = evaluateMarkingRequirements(context);

        const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
        expect(psnMarking).toBeDefined();
        expect(psnMarking?.value).toContain('UN3148');
        expect(psnMarking?.value).toContain('WATER-REACTIVE LIQUID, N.O.S.');
      });
    });
  });

  describe('Technical Name Markings', () => {
    test('Scenario 1: UN1325 requires technical name for N.O.S. entry', () => {
      const context = createClass4Context(
        'UN1325',
        '4.1',
        'FLAMMABLE SOLID, ORGANIC, N.O.S.',
        'II',
        {
          isTechnicalNameRequired: true,
          technicalName: 'Naphthalene',
        }
      );
      const result = evaluateMarkingRequirements(context);

      const technicalNameMarking = result.find((m) => m.id === 'technical-name');
      expect(technicalNameMarking).toBeDefined();
      expect(technicalNameMarking?.value).toBe('Naphthalene');
    });

    test('Scenario 8: UN2845 requires technical name for pyrophoric liquid N.O.S.', () => {
      const context = createClass4Context(
        'UN2845',
        '4.2',
        'PYROPHORIC LIQUID, ORGANIC, N.O.S.',
        'I',
        {
          isTechnicalNameRequired: true,
          technicalName: 'Trimethylaluminum',
        }
      );
      const result = evaluateMarkingRequirements(context);

      const technicalNameMarking = result.find((m) => m.id === 'technical-name');
      expect(technicalNameMarking).toBeDefined();
      expect(technicalNameMarking?.value).toBe('Trimethylaluminum');
    });

    test('Scenario 9: UN1383 requires technical name for pyrophoric metal N.O.S.', () => {
      const context = createClass4Context(
        'UN1383',
        '4.2',
        'PYROPHORIC METAL, N.O.S. or PYROPHORIC ALLOY, N.O.S.',
        'I',
        {
          isTechnicalNameRequired: true,
          technicalName: 'Hafnium powder',
        }
      );
      const result = evaluateMarkingRequirements(context);

      const technicalNameMarking = result.find((m) => m.id === 'technical-name');
      expect(technicalNameMarking).toBeDefined();
      expect(technicalNameMarking?.value).toBe('Hafnium powder');
    });

    test('Scenario 10: UN3088 requires technical name for self-heating solid N.O.S.', () => {
      const context = createClass4Context(
        'UN3088',
        '4.2',
        'SELF-HEATING SOLID, ORGANIC, N.O.S.',
        'II',
        {
          isTechnicalNameRequired: true,
          technicalName: 'Activated carbon',
        }
      );
      const result = evaluateMarkingRequirements(context);

      const technicalNameMarking = result.find((m) => m.id === 'technical-name');
      expect(technicalNameMarking).toBeDefined();
      expect(technicalNameMarking?.value).toBe('Activated carbon');
    });

    test('Scenario 13: UN3206 requires technical name for alkali metal alcoholates N.O.S.', () => {
      const context = createClass4Context(
        'UN3206',
        '4.2',
        'ALKALI METAL ALCOHOLATES, SELF-HEATING, CORROSIVE, N.O.S.',
        'II',
        {
          isTechnicalNameRequired: true,
          technicalName: 'Potassium tert-butoxide',
        }
      );
      const result = evaluateMarkingRequirements(context);

      const technicalNameMarking = result.find((m) => m.id === 'technical-name');
      expect(technicalNameMarking).toBeDefined();
      expect(technicalNameMarking?.value).toBe('Potassium tert-butoxide');
    });

    test('Scenario 17: UN2813 requires technical name for water-reactive solid N.O.S.', () => {
      const context = createClass4Context(
        'UN2813',
        '4.3',
        'WATER-REACTIVE SOLID, N.O.S.',
        'II',
        {
          isTechnicalNameRequired: true,
          technicalName: 'Lithium silicon',
        }
      );
      const result = evaluateMarkingRequirements(context);

      const technicalNameMarking = result.find((m) => m.id === 'technical-name');
      expect(technicalNameMarking).toBeDefined();
      expect(technicalNameMarking?.value).toBe('Lithium silicon');
    });

    test('Scenario 20: UN3148 requires technical name for water-reactive liquid N.O.S.', () => {
      const context = createClass4Context(
        'UN3148',
        '4.3',
        'WATER-REACTIVE LIQUID, N.O.S.',
        'I',
        {
          isTechnicalNameRequired: true,
          technicalName: 'Titanium tetrachloride',
        }
      );
      const result = evaluateMarkingRequirements(context);

      const technicalNameMarking = result.find((m) => m.id === 'technical-name');
      expect(technicalNameMarking).toBeDefined();
      expect(technicalNameMarking?.value).toBe('Titanium tetrachloride');
    });

    test('Technical name is NOT required when isTechnicalNameRequired is false', () => {
      const context = createClass4Context('UN1428', '4.3', 'SODIUM', 'I', {
        isTechnicalNameRequired: false,
      });
      const result = evaluateMarkingRequirements(context);

      const technicalNameMarking = result.find((m) => m.id === 'technical-name');
      expect(technicalNameMarking).toBeUndefined();
    });

    test('Empty technical name generates marking with empty value when required', () => {
      const context = createClass4Context(
        'UN1325',
        '4.1',
        'FLAMMABLE SOLID, ORGANIC, N.O.S.',
        'II',
        {
          isTechnicalNameRequired: true,
          technicalName: '',
        }
      );
      const result = evaluateMarkingRequirements(context);

      const technicalNameMarking = result.find((m) => m.id === 'technical-name');
      expect(technicalNameMarking).toBeDefined();
      expect(technicalNameMarking?.value).toBe('');
    });
  });

  describe('POP Marking Validation', () => {
    describe('X-Rating (PG I)', () => {
      test('Scenario 3: UN1310 PG I should use X-rating', () => {
        const context = createClass4Context(
          'UN1310',
          '4.1',
          'AMMONIUM PICRATE, WETTED',
          'I',
          {
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
          }
        );
        const result = evaluateMarkingRequirements(context);

        const popMarking = result.find((m) => m.id === 'pop-marking');
        expect(popMarking).toBeDefined();
        expect(popMarking?.metadata?.C).toBe('X');
      });

      test('Scenario 4: UN1571 PG I with 1A1 packaging', () => {
        const context = createClass4Context(
          'UN1571',
          '4.1',
          'BARIUM AZIDE, WETTED',
          'I',
          {
            usesPopMarking: true,
            inputPOPMarking: {
              B: '1A1',
              C: 'X',
              D: '30',
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
        expect(popMarking?.metadata?.B).toBe('1A1');
        expect(popMarking?.metadata?.C).toBe('X');
      });

      test('Scenario 8: UN2845 PG I pyrophoric with cylinder specification', () => {
        const context = createClass4Context(
          'UN2845',
          '4.2',
          'PYROPHORIC LIQUID, ORGANIC, N.O.S.',
          'I',
          {
            usesPopMarking: true,
            inputPOPMarking: {
              B: '1A1',
              C: 'X',
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
        expect(popMarking?.metadata?.C).toBe('X');
      });

      test('Scenario 9: UN1383 PG I pyrophoric metal with 1A2 packaging', () => {
        const context = createClass4Context(
          'UN1383',
          '4.2',
          'PYROPHORIC METAL, N.O.S.',
          'I',
          {
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
          }
        );
        const result = evaluateMarkingRequirements(context);

        const popMarking = result.find((m) => m.id === 'pop-marking');
        expect(popMarking).toBeDefined();
        expect(popMarking?.metadata?.B).toBe('1A2');
        expect(popMarking?.metadata?.C).toBe('X');
      });

      test('Scenario 11: UN2447 PG I molten phosphorus with 1A1 packaging', () => {
        const context = createClass4Context(
          'UN2447',
          '4.2',
          'PHOSPHORUS, WHITE, MOLTEN',
          'I',
          {
            usesPopMarking: true,
            inputPOPMarking: {
              B: '1A1',
              C: 'X',
              D: '35',
              E: 'S',
              F: '10',
              G: 'USA',
              H: 'DOD',
            },
          }
        );
        const result = evaluateMarkingRequirements(context);

        const popMarking = result.find((m) => m.id === 'pop-marking');
        expect(popMarking).toBeDefined();
        expect(popMarking?.metadata?.C).toBe('X');
      });

      test('Scenario 14: UN1428 PG I sodium with 1A2 packaging', () => {
        const context = createClass4Context('UN1428', '4.3', 'SODIUM', 'I', {
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
        expect(popMarking?.metadata?.C).toBe('X');
      });

      test('Scenario 15: UN1415 PG I lithium with 4G outer packaging', () => {
        const context = createClass4Context('UN1415', '4.3', 'LITHIUM', 'I', {
          usesPopMarking: true,
          inputPOPMarking: {
            B: '4G',
            C: 'X',
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
        expect(popMarking?.metadata?.B).toBe('4G');
        expect(popMarking?.metadata?.C).toBe('X');
      });

      test('Scenario 20: UN3148 PG I water-reactive liquid with 4G packaging', () => {
        const context = createClass4Context(
          'UN3148',
          '4.3',
          'WATER-REACTIVE LIQUID, N.O.S.',
          'I',
          {
            usesPopMarking: true,
            inputPOPMarking: {
              B: '4G',
              C: 'X',
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
        expect(popMarking?.metadata?.C).toBe('X');
      });
    });

    describe('Y-Rating (PG II)', () => {
      test('Scenario 1: UN1325 PG II with 4G packaging', () => {
        const context = createClass4Context(
          'UN1325',
          '4.1',
          'FLAMMABLE SOLID, ORGANIC, N.O.S.',
          'II',
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
        expect(popMarking?.metadata?.B).toBe('4G');
        expect(popMarking?.metadata?.C).toBe('Y');
      });

      test('Scenario 10: UN3088 PG II with 1G packaging', () => {
        const context = createClass4Context(
          'UN3088',
          '4.2',
          'SELF-HEATING SOLID, ORGANIC, N.O.S.',
          'II',
          {
            usesPopMarking: true,
            inputPOPMarking: {
              B: '1G',
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
        expect(popMarking?.metadata?.B).toBe('1G');
        expect(popMarking?.metadata?.C).toBe('Y');
      });

      test('Scenario 13: UN3206 PG II with 1H2 packaging', () => {
        const context = createClass4Context(
          'UN3206',
          '4.2',
          'ALKALI METAL ALCOHOLATES, SELF-HEATING, CORROSIVE, N.O.S.',
          'II',
          {
            usesPopMarking: true,
            inputPOPMarking: {
              B: '1H2',
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
        expect(popMarking?.metadata?.B).toBe('1H2');
        expect(popMarking?.metadata?.C).toBe('Y');
      });

      test('Scenario 16: UN1402 PG II with 1A2 packaging', () => {
        const context = createClass4Context('UN1402', '4.3', 'CALCIUM CARBIDE', 'II', {
          usesPopMarking: true,
          inputPOPMarking: {
            B: '1A2',
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
        expect(popMarking?.metadata?.C).toBe('Y');
      });

      test('Scenario 17: UN2813 PG II with 4G packaging', () => {
        const context = createClass4Context(
          'UN2813',
          '4.3',
          'WATER-REACTIVE SOLID, N.O.S.',
          'II',
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
        expect(popMarking?.metadata?.C).toBe('Y');
      });

      test('Scenario 18: UN1396 PG II with 1B2 packaging', () => {
        const context = createClass4Context(
          'UN1396',
          '4.3',
          'ALUMINUM POWDER, UNCOATED',
          'II',
          {
            usesPopMarking: true,
            inputPOPMarking: {
              B: '1B2',
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
        expect(popMarking?.metadata?.B).toBe('1B2');
        expect(popMarking?.metadata?.C).toBe('Y');
      });

      test('Scenario 19: UN1400 PG II with 1A2 packaging', () => {
        const context = createClass4Context('UN1400', '4.3', 'BARIUM', 'II', {
          usesPopMarking: true,
          inputPOPMarking: {
            B: '1A2',
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
        expect(popMarking?.metadata?.C).toBe('Y');
      });
    });

    describe('Z-Rating (PG III)', () => {
      test('Scenario 2: UN1944 PG III with 4G packaging', () => {
        const context = createClass4Context('UN1944', '4.1', 'MATCHES, SAFETY', 'III', {
          usesPopMarking: true,
          inputPOPMarking: {
            B: '4G',
            C: 'Z',
            D: '15',
            E: 'S',
            F: '10',
            G: 'USA',
            H: 'DOD',
          },
        });
        const result = evaluateMarkingRequirements(context);

        const popMarking = result.find((m) => m.id === 'pop-marking');
        expect(popMarking).toBeDefined();
        expect(popMarking?.metadata?.C).toBe('Z');
      });

      test('Scenario 5: UN2304 PG III with 1A1 packaging', () => {
        const context = createClass4Context(
          'UN2304',
          '4.1',
          'NAPHTHALENE, MOLTEN',
          'III',
          {
            usesPopMarking: true,
            inputPOPMarking: {
              B: '1A1',
              C: 'Z',
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
        expect(popMarking?.metadata?.C).toBe('Z');
      });

      test('Scenario 7: UN2000 PG III with 4D packaging', () => {
        const context = createClass4Context('UN2000', '4.1', 'CELLULOID', 'III', {
          usesPopMarking: true,
          inputPOPMarking: {
            B: '4D',
            C: 'Z',
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
        expect(popMarking?.metadata?.B).toBe('4D');
        expect(popMarking?.metadata?.C).toBe('Z');
      });

      test('Scenario 12: UN1373 PG III with 4G packaging', () => {
        const context = createClass4Context(
          'UN1373',
          '4.2',
          'FIBRES or FABRICS impregnated with oil',
          'III',
          {
            usesPopMarking: true,
            inputPOPMarking: {
              B: '4G',
              C: 'Z',
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
        expect(popMarking?.metadata?.C).toBe('Z');
      });
    });

    describe('No PG Rating (Self-Reactive)', () => {
      test('Scenario 6: UN3221 self-reactive has no packing group', () => {
        // Self-reactive substances do not have a packing group
        // The POP code would not include an X/Y/Z rating based on PG
        const context = createClass4Context(
          'UN3221',
          '4.1',
          'SELF-REACTIVE LIQUID TYPE B',
          '', // Empty packing group
          {
            usesPopMarking: true,
            inputPOPMarking: {
              B: '1A1',
              C: '', // No PG-based code
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
        expect(popMarking?.metadata?.C).toBe('');
      });
    });
  });

  describe('Temperature Control Markings', () => {
    /**
     * Scenario 6: UN3221 - Self-reactive substances require temperature control markings.
     * These materials have a control temperature and emergency temperature that must be
     * maintained during transport.
     *
     * GAP: Temperature control markings are not currently implemented in markingRequirements.ts
     */
    test.skip('Scenario 6: UN3221 self-reactive requires temperature control marking', () => {
      // GAP: Temperature control markings not implemented
      const context = createClass4Context(
        'UN3221',
        '4.1',
        'SELF-REACTIVE LIQUID TYPE B',
        '',
        {
          controlTemperature: '-5C',
          emergencyTemperature: '+5C',
        }
      );
      const result = evaluateMarkingRequirements(context);

      const tempMarking = result.find((m) => m.id === 'temperature-control');
      expect(tempMarking).toBeDefined();
      expect(tempMarking?.value).toContain('-5C');
    });

    test.skip('Temperature control marking includes emergency temperature', () => {
      // GAP: Temperature control markings not implemented
      const context = createClass4Context(
        'UN3221',
        '4.1',
        'SELF-REACTIVE LIQUID TYPE B',
        '',
        {
          controlTemperature: '-5C',
          emergencyTemperature: '+5C',
        }
      );
      const result = evaluateMarkingRequirements(context);

      const tempMarking = result.find((m) => m.id === 'temperature-control');
      expect(tempMarking).toBeDefined();
      expect(tempMarking?.metadata?.emergencyTemperature).toBe('+5C');
    });
  });

  describe('POP Marking Requirements', () => {
    test('POP marking is required when usesPopMarking is true', () => {
      const context = createClass4Context('UN1428', '4.3', 'SODIUM', 'I', {
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

    test('POP marking is NOT required when usesPopMarking is false', () => {
      const context = createClass4Context('UN1428', '4.3', 'SODIUM', 'I', {
        usesPopMarking: false,
      });
      const result = evaluateMarkingRequirements(context);

      const popMarking = result.find((m) => m.id === 'pop-marking');
      expect(popMarking).toBeUndefined();
    });

    test('POP marking is NOT required for limited quantities', () => {
      const context = createClass4Context('UN1325', '4.1', 'FLAMMABLE SOLID', 'II', {
        usesPopMarking: true,
        isLimitedQuantity: true,
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
      expect(popMarking).toBeUndefined();
    });

    test('POP marking is NOT required when usesCaaCertification is true', () => {
      const context = createClass4Context('UN1428', '4.3', 'SODIUM', 'I', {
        usesPopMarking: true,
        usesCaaCertification: true,
      });
      const result = evaluateMarkingRequirements(context);

      const popMarking = result.find((m) => m.id === 'pop-marking');
      expect(popMarking).toBeUndefined();
    });

    test('POP marking is NOT required when usesCoeCertification is true', () => {
      const context = createClass4Context('UN1428', '4.3', 'SODIUM', 'I', {
        usesPopMarking: true,
        usesCoeCertification: true,
      });
      const result = evaluateMarkingRequirements(context);

      const popMarking = result.find((m) => m.id === 'pop-marking');
      expect(popMarking).toBeUndefined();
    });

    test('POP marking includes all metadata fields', () => {
      const context = createClass4Context('UN1428', '4.3', 'SODIUM', 'I', {
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
      expect(popMarking?.metadata?.B).toBe('1A2');
      expect(popMarking?.metadata?.C).toBe('X');
      expect(popMarking?.metadata?.D).toBe('25');
      expect(popMarking?.metadata?.E).toBe('S');
      expect(popMarking?.metadata?.F).toBe('12');
      expect(popMarking?.metadata?.G).toBe('USA');
      expect(popMarking?.metadata?.H).toBe('DOD');
    });

    test('POP marking has correct label', () => {
      const context = createClass4Context('UN1428', '4.3', 'SODIUM', 'I', {
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
    test('Excepted quantity materials ONLY return E marking', () => {
      const context = createClass4Context(
        'UN1325',
        '4.1',
        'FLAMMABLE SOLID, ORGANIC, N.O.S.',
        'II',
        {
          isExceptedQuantity: true,
          usesPopMarking: true,
        }
      );
      const result = evaluateMarkingRequirements(context);

      expect(result.length).toBe(1);
      expect(result[0].id).toBe('excepted-quantity-e-marking');
      expect(result[0].renderType).toBe('custom');
    });

    test('E marking includes hazard class information', () => {
      const context = createClass4Context('UN1428', '4.3', 'SODIUM', 'I', {
        isExceptedQuantity: true,
      });
      const result = evaluateMarkingRequirements(context);

      const eMarking = result.find((m) => m.id === 'excepted-quantity-e-marking');
      expect(eMarking).toBeDefined();
      expect(eMarking?.value).toContain('4.3');
    });
  });

  describe('Limited Quantity Marking', () => {
    test('Limited quantity materials include limited quantity marking', () => {
      const context = createClass4Context(
        'UN1325',
        '4.1',
        'FLAMMABLE SOLID, ORGANIC, N.O.S.',
        'II',
        {
          isLimitedQuantity: true,
        }
      );
      const result = evaluateMarkingRequirements(context);

      const ltdQtyMarking = result.find((m) => m.id === 'limited-quantity');
      expect(ltdQtyMarking).toBeDefined();
      expect(ltdQtyMarking?.label).toBe('Limited Quantity');
    });

    test('Non-limited quantity materials do NOT include limited quantity marking', () => {
      const context = createClass4Context(
        'UN1325',
        '4.1',
        'FLAMMABLE SOLID, ORGANIC, N.O.S.',
        'II',
        {
          isLimitedQuantity: false,
        }
      );
      const result = evaluateMarkingRequirements(context);

      const ltdQtyMarking = result.find((m) => m.id === 'limited-quantity');
      expect(ltdQtyMarking).toBeUndefined();
    });
  });

  describe('Overpack Marking', () => {
    test('Overpack marking is included when overpack is true', () => {
      const context = createClass4Context('UN1428', '4.3', 'SODIUM', 'I');
      context.overpack = true;
      const result = evaluateMarkingRequirements(context);

      const overpackMarking = result.find((m) => m.id === 'overpack');
      expect(overpackMarking).toBeDefined();
      expect(overpackMarking?.label).toBe('OVERPACK');
    });

    test('Overpack marking is NOT included when overpack is false', () => {
      const context = createClass4Context('UN1428', '4.3', 'SODIUM', 'I');
      context.overpack = false;
      const result = evaluateMarkingRequirements(context);

      const overpackMarking = result.find((m) => m.id === 'overpack');
      expect(overpackMarking).toBeUndefined();
    });
  });

  describe('Negative Cases - POP Code Mismatches', () => {
    test('PG I material with Y-rating POP code (incorrect)', () => {
      // This test documents that incorrect POP codes are stored as provided
      // Validation of POP code vs packing group is a separate concern
      const context = createClass4Context('UN1428', '4.3', 'SODIUM', 'I', {
        usesPopMarking: true,
        inputPOPMarking: {
          B: '1A2',
          C: 'Y', // Incorrect - should be X for PG I
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
      // The marking stores what was provided - validation is separate
      expect(popMarking?.metadata?.C).toBe('Y');
    });

    test('PG II material with Z-rating POP code (incorrect)', () => {
      const context = createClass4Context('UN1402', '4.3', 'CALCIUM CARBIDE', 'II', {
        usesPopMarking: true,
        inputPOPMarking: {
          B: '1A2',
          C: 'Z', // Incorrect - should be Y for PG II
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

    test('PG III material with X-rating POP code (incorrect)', () => {
      const context = createClass4Context('UN1944', '4.1', 'MATCHES, SAFETY', 'III', {
        usesPopMarking: true,
        inputPOPMarking: {
          B: '4G',
          C: 'X', // Incorrect - should be Z for PG III
          D: '15',
          E: 'S',
          F: '10',
          G: 'USA',
          H: 'DOD',
        },
      });
      const result = evaluateMarkingRequirements(context);

      const popMarking = result.find((m) => m.id === 'pop-marking');
      expect(popMarking).toBeDefined();
      expect(popMarking?.metadata?.C).toBe('X');
    });

    test('Missing technical name for N.O.S. entry when required but empty', () => {
      const context = createClass4Context(
        'UN1325',
        '4.1',
        'FLAMMABLE SOLID, ORGANIC, N.O.S.',
        'II',
        {
          isTechnicalNameRequired: true,
          technicalName: '', // Missing technical name
        }
      );
      const result = evaluateMarkingRequirements(context);

      const technicalNameMarking = result.find((m) => m.id === 'technical-name');
      expect(technicalNameMarking).toBeDefined();
      expect(technicalNameMarking?.value).toBe('');
    });

    test('Wrong UN number in marking reflects what was provided', () => {
      // If user provides wrong UN number, it will be reflected in marking
      const context = createClass4Context(
        'UN9999', // Wrong UN number
        '4.1',
        'FLAMMABLE SOLID, ORGANIC, N.O.S.',
        'II'
      );
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toContain('UN9999');
    });

    test('Abbreviated PSN is stored as provided', () => {
      // If user provides abbreviated PSN, it will be reflected in marking
      const context = createClass4Context(
        'UN1325',
        '4.1',
        'FLAM SOLID', // Abbreviated - should be full PSN
        'II'
      );
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toContain('FLAM SOLID');
    });
  });

  describe('PSN Marking Properties', () => {
    test('PSN marking is always first in the returned array', () => {
      const context = createClass4Context('UN1428', '4.3', 'SODIUM', 'I');
      const result = evaluateMarkingRequirements(context);

      expect(result.length).toBeGreaterThan(0);
      expect(result[0].id).toBe('proper-shipping-name-unid');
    });

    test('PSN marking has correct label', () => {
      const context = createClass4Context('UN1428', '4.3', 'SODIUM', 'I');
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking?.label).toBe('Proper Shipping Name and UN Number');
    });
  });
});
