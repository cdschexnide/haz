import { evaluateMarkingRequirements, RequiredMarking } from '../markingRequirements';
import { HazProPreparerContext } from '../../contexts/HazProPreparerProvider/reducer';
import { HazardousMaterialItem, PhysicalState, QuantityUnit } from '../../../types';

/**
 * Creates a minimal HazProPreparerContext for Class 3 (Flammable Liquids) testing.
 *
 * Class 3 materials are flammable liquids with hazclass of '3'.
 * Unlike Class 1, Class 3 materials:
 * - Always have a packing group (I, II, or III)
 * - POP marking codes are dependent on packing group:
 *   - PG I: Only X code valid
 *   - PG II: X or Y valid
 *   - PG III: X, Y, or Z valid
 * - May require orientation arrows for liquid packaging
 * - May require Marine Pollutant marking (N34 special provision)
 */
function createClass3Context(
  unNumber: string,
  packingGroup: string,
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
    isTechnicalNameRequired?: boolean;
    technicalName?: string;
    subsidiaryRisk?: string;
    isDomesticShipment?: boolean;
    physicalState?: PhysicalState;
  } = {}
): HazProPreparerContext {
  const {
    usesPopMarking = false,
    isLimitedQuantity = false,
    isExceptedQuantity = false,
    usesCaaCertification = false,
    usesCoeCertification = false,
    inputPOPMarking,
    isTechnicalNameRequired = false,
    technicalName = '',
    subsidiaryRisk = '',
    isDomesticShipment = false,
    physicalState = PhysicalState.LIQUID,
  } = options;

  const hazardousMaterial: HazardousMaterialItem = {
    isFixed: '',
    isDomesticShipment,
    isTechnicalNameRequired,
    unid: unNumber,
    properShippingName,
    hazclassDiv: '3',
    subsidiaryRisk,
    packingGroup,
    specialProvision: '',
    packagingParagraph: 'A7.2',
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

describe('Marking Requirements - Class 3 Flammable Liquids', () => {
  describe('Proper Shipping Name and UN Number', () => {
    test('Scenario 1: UN1089 - ACETALDEHYDE includes PSN and UN number', () => {
      const context = createClass3Context('UN1089', 'I', 'ACETALDEHYDE');
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toContain('UN1089');
      expect(psnMarking?.value).toContain('ACETALDEHYDE');
    });

    test('Scenario 2: UN1093 - ACRYLONITRILE, STABILIZED includes PSN with qualifier', () => {
      const context = createClass3Context('UN1093', 'I', 'ACRYLONITRILE, STABILIZED', {
        subsidiaryRisk: '6.1',
      });
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toContain('UN1093');
      expect(psnMarking?.value).toContain('ACRYLONITRILE, STABILIZED');
    });

    test('Scenario 3: UN3165 - AIRCRAFT HYDRAULIC POWER UNIT FUEL TANK includes full PSN', () => {
      const context = createClass3Context('UN3165', 'I', 'AIRCRAFT HYDRAULIC POWER UNIT FUEL TANK', {
        subsidiaryRisk: '6.1, 8',
      });
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toContain('UN3165');
      expect(psnMarking?.value).toContain('AIRCRAFT HYDRAULIC POWER UNIT FUEL TANK');
    });

    test('Scenario 4: UN1991 - CHLOROPRENE, STABILIZED includes PSN with STABILIZED qualifier', () => {
      const context = createClass3Context('UN1991', 'I', 'CHLOROPRENE, STABILIZED', {
        subsidiaryRisk: '6.1',
      });
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toContain('UN1991');
      expect(psnMarking?.value).toContain('CHLOROPRENE, STABILIZED');
    });

    test('Scenario 5: UN1090 - ACETONE includes PSN and UN number', () => {
      const context = createClass3Context('UN1090', 'II', 'ACETONE');
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toContain('UN1090');
      expect(psnMarking?.value).toContain('ACETONE');
    });

    test('Scenario 6: UN1114 - BENZENE includes PSN and UN number', () => {
      const context = createClass3Context('UN1114', 'II', 'BENZENE');
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toContain('UN1114');
      expect(psnMarking?.value).toContain('BENZENE');
    });

    test('Scenario 7: UN1987 - ALCOHOLS, N.O.S. includes PSN for N.O.S. material', () => {
      const context = createClass3Context('UN1987', 'II', 'ALCOHOLS, N.O.S.', {
        isTechnicalNameRequired: true,
        technicalName: 'ethanol, methanol',
      });
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toContain('UN1987');
      expect(psnMarking?.value).toContain('ALCOHOLS, N.O.S.');
    });

    test('Scenario 8: UN3274 - ALCOHOLATES SOLUTION, N.O.S. includes PSN', () => {
      const context = createClass3Context('UN3274', 'II', 'ALCOHOLATES SOLUTION, N.O.S.', {
        subsidiaryRisk: '8',
        isTechnicalNameRequired: true,
        technicalName: 'sodium methoxide',
      });
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toContain('UN3274');
      expect(psnMarking?.value).toContain('ALCOHOLATES SOLUTION, N.O.S.');
    });

    test('Scenario 9: UN2733 - AMINES, FLAMMABLE, CORROSIVE N.O.S. includes PSN', () => {
      const context = createClass3Context('UN2733', 'II', 'AMINES, FLAMMABLE, CORROSIVE N.O.S.', {
        subsidiaryRisk: '8',
        isTechnicalNameRequired: true,
        technicalName: 'diethylamine',
      });
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toContain('UN2733');
      expect(psnMarking?.value).toContain('AMINES, FLAMMABLE, CORROSIVE N.O.S.');
    });

    test('Scenario 10: UN2251 - BICYCLO[2,2,1]HEPTA-2,5-DIENE, STABILIZED includes full chemical name', () => {
      const context = createClass3Context('UN2251', 'II', 'BICYCLO[2,2,1]HEPTA-2,5-DIENE, STABILIZED');
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toContain('UN2251');
      expect(psnMarking?.value).toContain('BICYCLO[2,2,1]HEPTA-2,5-DIENE, STABILIZED');
    });

    test('Scenario 11: UN1278 - 1-CHLOROPROPANE includes PSN', () => {
      const context = createClass3Context('UN1278', 'II', '1-CHLOROPROPANE');
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toContain('UN1278');
      expect(psnMarking?.value).toContain('1-CHLOROPROPANE');
    });

    test('Scenario 12: UN1139 - COATING SOLUTION includes PSN', () => {
      const context = createClass3Context('UN1139', 'II', 'COATING SOLUTION');
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toContain('UN1139');
      expect(psnMarking?.value).toContain('COATING SOLUTION');
    });

    test('Scenario 13: UN2332 - ACETALDEHYDE OXIME includes PSN', () => {
      const context = createClass3Context('UN2332', 'III', 'ACETALDEHYDE OXIME');
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toContain('UN2332');
      expect(psnMarking?.value).toContain('ACETALDEHYDE OXIME');
    });

    test('Scenario 14: UN1986 - ALCOHOLS, FLAMMABLE, TOXIC, N.O.S. includes PSN', () => {
      const context = createClass3Context('UN1986', 'III', 'ALCOHOLS, FLAMMABLE, TOXIC, N.O.S.', {
        subsidiaryRisk: '6.1',
        isTechnicalNameRequired: true,
        technicalName: 'allyl alcohol',
      });
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toContain('UN1986');
      expect(psnMarking?.value).toContain('ALCOHOLS, FLAMMABLE, TOXIC, N.O.S.');
    });

    test('Scenario 15: UN2607 - ACROLEIN DIMER, STABILIZED includes PSN with STABILIZED', () => {
      const context = createClass3Context('UN2607', 'III', 'ACROLEIN DIMER, STABILIZED');
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toContain('UN2607');
      expect(psnMarking?.value).toContain('ACROLEIN DIMER, STABILIZED');
    });

    test('Scenario 16: UN1263 - PAINT includes PSN', () => {
      const context = createClass3Context('UN1263', 'III', 'PAINT');
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toContain('UN1263');
      expect(psnMarking?.value).toContain('PAINT');
    });

    test('Scenario 17: UN1263 - PAINT RELATED MATERIAL includes full PSN', () => {
      const context = createClass3Context('UN1263', 'III', 'PAINT RELATED MATERIAL');
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toContain('UN1263');
      expect(psnMarking?.value).toContain('PAINT RELATED MATERIAL');
    });

    test('Scenario 18: UN2985 - CHLOROSILANES, FLAMMABLE, CORROSIVE, N.O.S. includes PSN', () => {
      const context = createClass3Context('UN2985', 'II', 'CHLOROSILANES, FLAMMABLE, CORROSIVE, N.O.S.', {
        subsidiaryRisk: '8',
        isTechnicalNameRequired: true,
        technicalName: 'dimethyldichlorosilane',
      });
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toContain('UN2985');
      expect(psnMarking?.value).toContain('CHLOROSILANES, FLAMMABLE, CORROSIVE, N.O.S.');
    });

    test('Scenario 19: NA1993 - COMPOUNDS, CLEANING LIQUID uses NA prefix for domestic', () => {
      const context = createClass3Context('NA1993', 'III', 'COMPOUNDS, CLEANING LIQUID', {
        isDomesticShipment: true,
      });
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toContain('NA1993');
      expect(psnMarking?.value).toContain('COMPOUNDS, CLEANING LIQUID');
      // Verify NA prefix is used, not UN
      expect(psnMarking?.value).not.toContain('UN1993');
    });

    test('Scenario 20: UN3528 - ENGINE, INTERNAL COMBUSTION includes PSN', () => {
      const context = createClass3Context('UN3528', '', 'ENGINE, INTERNAL COMBUSTION, FLAMMABLE LIQUID POWERED');
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toContain('UN3528');
      expect(psnMarking?.value).toContain('ENGINE, INTERNAL COMBUSTION');
    });

    test('PSN marking is always first in the returned array', () => {
      const context = createClass3Context('UN1090', 'II', 'ACETONE');
      const result = evaluateMarkingRequirements(context);

      expect(result.length).toBeGreaterThan(0);
      expect(result[0].id).toBe('proper-shipping-name-unid');
    });

    test('PSN marking has correct label', () => {
      const context = createClass3Context('UN1090', 'II', 'ACETONE');
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking?.label).toBe('Proper Shipping Name and UN Number');
    });
  });

  describe('Technical Name Marking', () => {
    test('Scenario 7: UN1987 ALCOHOLS, N.O.S. requires technical name marking', () => {
      const context = createClass3Context('UN1987', 'II', 'ALCOHOLS, N.O.S.', {
        isTechnicalNameRequired: true,
        technicalName: 'ethanol, methanol',
      });
      const result = evaluateMarkingRequirements(context);

      const technicalNameMarking = result.find((m) => m.id === 'technical-name');
      expect(technicalNameMarking).toBeDefined();
      expect(technicalNameMarking?.value).toBe('ethanol, methanol');
    });

    test('Scenario 8: UN3274 ALCOHOLATES SOLUTION, N.O.S. requires technical name', () => {
      const context = createClass3Context('UN3274', 'II', 'ALCOHOLATES SOLUTION, N.O.S.', {
        subsidiaryRisk: '8',
        isTechnicalNameRequired: true,
        technicalName: 'sodium methoxide',
      });
      const result = evaluateMarkingRequirements(context);

      const technicalNameMarking = result.find((m) => m.id === 'technical-name');
      expect(technicalNameMarking).toBeDefined();
      expect(technicalNameMarking?.value).toBe('sodium methoxide');
    });

    test('Scenario 9: UN2733 AMINES, FLAMMABLE, CORROSIVE N.O.S. requires technical name', () => {
      const context = createClass3Context('UN2733', 'II', 'AMINES, FLAMMABLE, CORROSIVE N.O.S.', {
        subsidiaryRisk: '8',
        isTechnicalNameRequired: true,
        technicalName: 'diethylamine',
      });
      const result = evaluateMarkingRequirements(context);

      const technicalNameMarking = result.find((m) => m.id === 'technical-name');
      expect(technicalNameMarking).toBeDefined();
      expect(technicalNameMarking?.value).toBe('diethylamine');
    });

    test('Scenario 14: UN1986 ALCOHOLS, FLAMMABLE, TOXIC, N.O.S. requires technical name', () => {
      const context = createClass3Context('UN1986', 'III', 'ALCOHOLS, FLAMMABLE, TOXIC, N.O.S.', {
        subsidiaryRisk: '6.1',
        isTechnicalNameRequired: true,
        technicalName: 'allyl alcohol',
      });
      const result = evaluateMarkingRequirements(context);

      const technicalNameMarking = result.find((m) => m.id === 'technical-name');
      expect(technicalNameMarking).toBeDefined();
      expect(technicalNameMarking?.value).toBe('allyl alcohol');
    });

    test('Scenario 18: UN2985 CHLOROSILANES, FLAMMABLE, CORROSIVE, N.O.S. requires technical name', () => {
      const context = createClass3Context('UN2985', 'II', 'CHLOROSILANES, FLAMMABLE, CORROSIVE, N.O.S.', {
        subsidiaryRisk: '8',
        isTechnicalNameRequired: true,
        technicalName: 'dimethyldichlorosilane',
      });
      const result = evaluateMarkingRequirements(context);

      const technicalNameMarking = result.find((m) => m.id === 'technical-name');
      expect(technicalNameMarking).toBeDefined();
      expect(technicalNameMarking?.value).toBe('dimethyldichlorosilane');
    });

    test('Alteration: N.O.S. without technical name when isTechnicalNameRequired is false', () => {
      const context = createClass3Context('UN1987', 'II', 'ALCOHOLS, N.O.S.', {
        isTechnicalNameRequired: false,
      });
      const result = evaluateMarkingRequirements(context);

      const technicalNameMarking = result.find((m) => m.id === 'technical-name');
      expect(technicalNameMarking).toBeUndefined();
    });

    test('Scenario 7 Alteration 1: Missing technical name generates marking with empty value', () => {
      const context = createClass3Context('UN1987', 'II', 'ALCOHOLS, N.O.S.', {
        isTechnicalNameRequired: true,
        technicalName: '', // Empty technical name
      });
      const result = evaluateMarkingRequirements(context);

      const technicalNameMarking = result.find((m) => m.id === 'technical-name');
      expect(technicalNameMarking).toBeDefined();
      expect(technicalNameMarking?.value).toBe('');
    });

    test('Non-N.O.S. materials do not require technical name marking', () => {
      const context = createClass3Context('UN1090', 'II', 'ACETONE', {
        isTechnicalNameRequired: false,
      });
      const result = evaluateMarkingRequirements(context);

      const technicalNameMarking = result.find((m) => m.id === 'technical-name');
      expect(technicalNameMarking).toBeUndefined();
    });
  });

  describe('POP Marking', () => {
    describe('Packing Group I - Only X code valid', () => {
      test('Scenario 1: UN1089 PG I accepts X packing group code', () => {
        const context = createClass3Context('UN1089', 'I', 'ACETALDEHYDE', {
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
        });
        const result = evaluateMarkingRequirements(context);

        const popMarking = result.find((m) => m.id === 'pop-marking');
        expect(popMarking).toBeDefined();
        expect(popMarking?.metadata?.C).toBe('X');
      });

      test('Scenario 1 Alteration 1: PG I with Y code (invalid) - documents expected behavior', () => {
        // This test documents that the system accepts Y code input even for PG I
        // Validation of PG code appropriateness should happen elsewhere
        const context = createClass3Context('UN1089', 'I', 'ACETALDEHYDE', {
          usesPopMarking: true,
          inputPOPMarking: {
            B: '1A1',
            C: 'Y', // Invalid for PG I - PG I requires X only
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

      test('Scenario 4 Alteration 2: PG I with Z code (invalid) - documents expected behavior', () => {
        const context = createClass3Context('UN1991', 'I', 'CHLOROPRENE, STABILIZED', {
          usesPopMarking: true,
          inputPOPMarking: {
            B: '1A1',
            C: 'Z', // Invalid for PG I - PG I requires X only
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

    describe('Packing Group II - X or Y valid', () => {
      test('Scenario 5: UN1090 PG II accepts X packing group code', () => {
        const context = createClass3Context('UN1090', 'II', 'ACETONE', {
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
        });
        const result = evaluateMarkingRequirements(context);

        const popMarking = result.find((m) => m.id === 'pop-marking');
        expect(popMarking).toBeDefined();
        expect(popMarking?.metadata?.C).toBe('X');
      });

      test('Scenario 6: UN1114 PG II accepts Y packing group code', () => {
        const context = createClass3Context('UN1114', 'II', 'BENZENE', {
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
        expect(popMarking?.metadata?.C).toBe('Y');
      });

      test('Scenario 5 Alteration 1: PG II with Z code (invalid) - documents expected behavior', () => {
        const context = createClass3Context('UN1090', 'II', 'ACETONE', {
          usesPopMarking: true,
          inputPOPMarking: {
            B: '4G',
            C: 'Z', // Invalid for PG II - PG II requires X or Y
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

      test('Scenario 9 Alteration 3: PG II AMINES with Z code (invalid)', () => {
        const context = createClass3Context('UN2733', 'II', 'AMINES, FLAMMABLE, CORROSIVE N.O.S.', {
          usesPopMarking: true,
          inputPOPMarking: {
            B: '1A2',
            C: 'Z', // Invalid for PG II
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

    describe('Packing Group III - X, Y, or Z all valid', () => {
      test('Scenario 13: UN2332 PG III accepts X packing group code', () => {
        const context = createClass3Context('UN2332', 'III', 'ACETALDEHYDE OXIME', {
          usesPopMarking: true,
          inputPOPMarking: {
            B: '4G',
            C: 'X',
            D: '30',
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

      test('Scenario 16: UN1263 PAINT PG III accepts Y packing group code', () => {
        const context = createClass3Context('UN1263', 'III', 'PAINT', {
          usesPopMarking: true,
          inputPOPMarking: {
            B: '4G',
            C: 'Y',
            D: '25',
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

      test('Scenario 17: UN1263 PAINT RELATED MATERIAL PG III accepts Z packing group code', () => {
        const context = createClass3Context('UN1263', 'III', 'PAINT RELATED MATERIAL', {
          usesPopMarking: true,
          inputPOPMarking: {
            B: '4G',
            C: 'Z',
            D: '20',
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

      test('Scenario 19: NA1993 PG III accepts Z packing group code', () => {
        const context = createClass3Context('NA1993', 'III', 'COMPOUNDS, CLEANING LIQUID', {
          isDomesticShipment: true,
          usesPopMarking: true,
          inputPOPMarking: {
            B: '4G',
            C: 'Z',
            D: '20',
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
    });

    describe('POP Marking Conditional Requirements', () => {
      test('POP marking is NOT required when usesPopMarking is false', () => {
        const context = createClass3Context('UN1090', 'II', 'ACETONE', {
          usesPopMarking: false,
        });
        const result = evaluateMarkingRequirements(context);

        const popMarking = result.find((m) => m.id === 'pop-marking');
        expect(popMarking).toBeUndefined();
      });

      test('POP marking is NOT required when isLimitedQuantity is true', () => {
        const context = createClass3Context('UN1090', 'II', 'ACETONE', {
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
        const context = createClass3Context('UN1090', 'II', 'ACETONE', {
          usesPopMarking: true,
          usesCaaCertification: true,
        });
        const result = evaluateMarkingRequirements(context);

        const popMarking = result.find((m) => m.id === 'pop-marking');
        expect(popMarking).toBeUndefined();
      });

      test('POP marking is NOT required when usesCoeCertification is true', () => {
        const context = createClass3Context('UN1090', 'II', 'ACETONE', {
          usesPopMarking: true,
          usesCoeCertification: true,
        });
        const result = evaluateMarkingRequirements(context);

        const popMarking = result.find((m) => m.id === 'pop-marking');
        expect(popMarking).toBeUndefined();
      });

      test('POP marking has correct label', () => {
        const context = createClass3Context('UN1090', 'II', 'ACETONE', {
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
        expect(popMarking?.label).toBe('POP Marking, stenciled and/or printed');
      });

      test('POP marking has renderType of pop', () => {
        const context = createClass3Context('UN1114', 'II', 'BENZENE', {
          usesPopMarking: true,
          inputPOPMarking: {
            B: '1A1',
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
        expect(popMarking?.renderType).toBe('pop');
      });

      test('POP marking includes all metadata fields', () => {
        const context = createClass3Context('UN1278', 'II', '1-CHLOROPROPANE', {
          usesPopMarking: true,
          inputPOPMarking: {
            B: '1A2',
            C: 'Y',
            D: '25',
            E: 'S',
            F: '11',
            G: 'USA',
            H: 'DOD',
          },
        });
        const result = evaluateMarkingRequirements(context);

        const popMarking = result.find((m) => m.id === 'pop-marking');
        expect(popMarking?.metadata?.B).toBe('1A2');
        expect(popMarking?.metadata?.C).toBe('Y');
        expect(popMarking?.metadata?.D).toBe('25');
        expect(popMarking?.metadata?.E).toBe('S');
        expect(popMarking?.metadata?.F).toBe('11');
        expect(popMarking?.metadata?.G).toBe('USA');
        expect(popMarking?.metadata?.H).toBe('DOD');
      });
    });
  });

  describe('Marine Pollutant Marking', () => {
    /**
     * Scenario 11: UN1278 - 1-CHLOROPROPANE has N34 special provision
     * indicating Marine Pollutant status. Marine Pollutant mark is required
     * for single packagings of 5L or more, or for combination packagings
     * with inner packaging totaling 5L or more.
     *
     * GAP: Marine Pollutant marking is not currently implemented in
     * markingRequirements.ts. These tests document expected behavior.
     */
    test.skip('Scenario 11: UN1278 Marine Pollutant requires marking when quantity >= 5L', () => {
      // GAP: Marine Pollutant marking not currently implemented
      const context = createClass3Context('UN1278', 'II', '1-CHLOROPROPANE');
      context.packaging.totalNetVolume = { liters: 10, gallons: 2.64 };
      const result = evaluateMarkingRequirements(context);

      const marinePollutantMarking = result.find((m) => m.id === 'marine-pollutant');
      expect(marinePollutantMarking).toBeDefined();
      expect(marinePollutantMarking?.label).toContain('Marine Pollutant');
    });

    test.skip('Scenario 11 Alteration 1: Missing Marine Pollutant mark when required', () => {
      // GAP: When implemented, should detect missing marine pollutant mark
      const context = createClass3Context('UN1278', 'II', '1-CHLOROPROPANE');
      context.packaging.totalNetVolume = { liters: 10, gallons: 2.64 };
      const result = evaluateMarkingRequirements(context);

      const marinePollutantMarking = result.find((m) => m.id === 'marine-pollutant');
      expect(marinePollutantMarking).toBeDefined();
    });

    test.skip('Marine Pollutant mark NOT required when quantity < 5L', () => {
      // GAP: When implemented, should not require mark for small quantities
      const context = createClass3Context('UN1278', 'II', '1-CHLOROPROPANE');
      context.packaging.totalNetVolume = { liters: 4, gallons: 1.06 };
      const result = evaluateMarkingRequirements(context);

      const marinePollutantMarking = result.find((m) => m.id === 'marine-pollutant');
      expect(marinePollutantMarking).toBeUndefined();
    });
  });

  describe('Orientation Marking', () => {
    /**
     * GAP: Orientation marking (arrows) is required for liquid combination packaging
     * per AFMAN 24-604 but is intentionally omitted from markingRequirements.ts
     * (noted in code comments).
     *
     * These tests document expected behavior when the feature is implemented.
     */
    test.skip('Scenario 1 Alteration 3: Orientation arrows required for liquid combination packaging', () => {
      // GAP: Orientation marking not currently implemented
      const context = createClass3Context('UN1089', 'I', 'ACETALDEHYDE');
      context.packaging.packagingType = 'Combination';
      const result = evaluateMarkingRequirements(context);

      const orientationMarking = result.find((m) => m.id === 'orientation-marking');
      expect(orientationMarking).toBeDefined();
      expect(orientationMarking?.label).toContain('Orientation');
    });

    test.skip('Scenario 6 Alteration 3: Orientation arrows needed on two opposite sides', () => {
      // GAP: Orientation marking placement requirements not implemented
      const context = createClass3Context('UN1114', 'II', 'BENZENE');
      context.packaging.packagingType = 'Combination';
      const result = evaluateMarkingRequirements(context);

      const orientationMarking = result.find((m) => m.id === 'orientation-marking');
      expect(orientationMarking).toBeDefined();
    });

    test.skip('Scenario 17 Alteration 3: Missing orientation arrows for PAINT RELATED MATERIAL', () => {
      // GAP: Should require orientation arrows for liquid packaging
      const context = createClass3Context('UN1263', 'III', 'PAINT RELATED MATERIAL');
      context.packaging.packagingType = 'Combination';
      const result = evaluateMarkingRequirements(context);

      const orientationMarking = result.find((m) => m.id === 'orientation-marking');
      expect(orientationMarking).toBeDefined();
    });
  });

  describe('Excepted Quantity Marking', () => {
    test('Excepted quantity materials ONLY return E marking (no PSN or POP)', () => {
      const context = createClass3Context('UN1090', 'II', 'ACETONE', {
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
      const context = createClass3Context('UN1114', 'II', 'BENZENE', {
        isExceptedQuantity: true,
      });
      const result = evaluateMarkingRequirements(context);

      const eMarking = result.find((m) => m.id === 'excepted-quantity-e-marking');
      expect(eMarking).toBeDefined();
      expect(eMarking?.value).toContain('3');
    });

    test('Excepted quantity overrides all other marking requirements', () => {
      const context = createClass3Context('UN1987', 'II', 'ALCOHOLS, N.O.S.', {
        isExceptedQuantity: true,
        isTechnicalNameRequired: true,
        technicalName: 'ethanol',
        usesPopMarking: true,
      });
      const result = evaluateMarkingRequirements(context);

      // Only E marking should be present
      expect(result.length).toBe(1);
      expect(result[0].id).toBe('excepted-quantity-e-marking');

      // No technical name or POP marking
      const technicalNameMarking = result.find((m) => m.id === 'technical-name');
      const popMarking = result.find((m) => m.id === 'pop-marking');
      expect(technicalNameMarking).toBeUndefined();
      expect(popMarking).toBeUndefined();
    });
  });

  describe('Limited Quantity Marking', () => {
    test('Limited quantity materials include limited quantity marking', () => {
      const context = createClass3Context('UN1090', 'II', 'ACETONE', {
        isLimitedQuantity: true,
      });
      const result = evaluateMarkingRequirements(context);

      const ltdQtyMarking = result.find((m) => m.id === 'limited-quantity');
      expect(ltdQtyMarking).toBeDefined();
      expect(ltdQtyMarking?.label).toBe('Limited Quantity');
    });

    test('Non-limited quantity materials do NOT include limited quantity marking', () => {
      const context = createClass3Context('UN1090', 'II', 'ACETONE', {
        isLimitedQuantity: false,
      });
      const result = evaluateMarkingRequirements(context);

      const ltdQtyMarking = result.find((m) => m.id === 'limited-quantity');
      expect(ltdQtyMarking).toBeUndefined();
    });

    test('Limited quantity marking present for PG III material', () => {
      const context = createClass3Context('UN1263', 'III', 'PAINT', {
        isLimitedQuantity: true,
      });
      const result = evaluateMarkingRequirements(context);

      const ltdQtyMarking = result.find((m) => m.id === 'limited-quantity');
      expect(ltdQtyMarking).toBeDefined();
    });
  });

  describe('Overpack Marking', () => {
    test('Overpack marking is included when overpack is true', () => {
      const context = createClass3Context('UN1090', 'II', 'ACETONE');
      context.overpack = true;
      const result = evaluateMarkingRequirements(context);

      const overpackMarking = result.find((m) => m.id === 'overpack');
      expect(overpackMarking).toBeDefined();
      expect(overpackMarking?.label).toBe('OVERPACK');
    });

    test('Overpack marking is NOT included when overpack is false', () => {
      const context = createClass3Context('UN1090', 'II', 'ACETONE');
      context.overpack = false;
      const result = evaluateMarkingRequirements(context);

      const overpackMarking = result.find((m) => m.id === 'overpack');
      expect(overpackMarking).toBeUndefined();
    });
  });

  describe('Military Shipping Label - GAP IDENTIFIED', () => {
    /**
     * GAP: Military Shipping Label (MSL) is required per AFMAN 24-604 for Class 3 materials
     * but is not currently implemented in markingRequirements.ts.
     */
    test.skip('Scenario 12 Alteration 3: MSL should be required for all Class 3 shipments', () => {
      // GAP: MSL not currently implemented
      const context = createClass3Context('UN1139', 'II', 'COATING SOLUTION');
      const result = evaluateMarkingRequirements(context);

      const mslMarking = result.find((m) => m.id === 'military-shipping-label');
      expect(mslMarking).toBeDefined();
      expect(mslMarking?.label).toContain('Military Shipping Label');
    });
  });

  describe('Alteration Tests - PSN Completeness', () => {
    test('Scenario 4 Alteration 1: CHLOROPRENE without STABILIZED (PSN incomplete)', () => {
      // This test documents that the system stores exactly what is provided
      // Inspector should catch that "STABILIZED" qualifier is missing
      const contextIncomplete = createClass3Context('UN1991', 'I', 'CHLOROPRENE');
      const resultIncomplete = evaluateMarkingRequirements(contextIncomplete);

      const psnMarking = resultIncomplete.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking?.value).toContain('CHLOROPRENE');
      expect(psnMarking?.value).not.toContain('STABILIZED');
    });

    test('Scenario 10 Alteration 2: BICYCLO missing STABILIZED qualifier', () => {
      const context = createClass3Context('UN2251', 'II', 'BICYCLO[2,2,1]HEPTA-2,5-DIENE');
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking?.value).toContain('BICYCLO[2,2,1]HEPTA-2,5-DIENE');
      expect(psnMarking?.value).not.toContain('STABILIZED');
    });

    test('Scenario 15 Alteration 1: ACROLEIN DIMER without STABILIZED', () => {
      const context = createClass3Context('UN2607', 'III', 'ACROLEIN DIMER');
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking?.value).toContain('ACROLEIN DIMER');
      expect(psnMarking?.value).not.toContain('STABILIZED');
    });

    test('Scenario 17 Alteration 1: Just PAINT instead of PAINT RELATED MATERIAL', () => {
      // Same UN number, different PSN - system stores exact PSN provided
      const context = createClass3Context('UN1263', 'III', 'PAINT');
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking?.value).toContain('PAINT');
      expect(psnMarking?.value).not.toContain('RELATED MATERIAL');
    });
  });

  describe('Alteration Tests - UN Number Validation', () => {
    test('Scenario 5 Alteration 2: Wrong UN number UN1091 instead of UN1090', () => {
      // System stores the UN number provided - validation happens elsewhere
      const context = createClass3Context('UN1091', 'II', 'ACETONE');
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking?.value).toContain('UN1091');
      expect(psnMarking?.value).not.toContain('UN1090');
    });

    test('Scenario 15 Alteration 2: Wrong UN number UN1092 instead of UN2607', () => {
      const context = createClass3Context('UN1092', 'III', 'ACROLEIN DIMER, STABILIZED');
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking?.value).toContain('UN1092');
    });

    test('Scenario 19 Alteration 1: UN1993 instead of NA1993 for domestic', () => {
      // Using UN prefix instead of NA prefix for domestic shipment
      const context = createClass3Context('UN1993', 'III', 'COMPOUNDS, CLEANING LIQUID', {
        isDomesticShipment: true,
      });
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking?.value).toContain('UN1993');
      // Should have used NA1993 for domestic
    });

    test('Scenario 19 Alteration 2: Package shows UN1993 instead of NA1993', () => {
      const context = createClass3Context('UN1993', 'III', 'COMPOUNDS, CLEANING LIQUID');
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking?.value).toContain('UN1993');
    });
  });

  describe('Scenario 20: ENGINE (No Packing Group)', () => {
    test('UN3528 ENGINE has no packing group (special article)', () => {
      // Engines are special articles that don't have packing groups
      const context = createClass3Context('UN3528', '', 'ENGINE, INTERNAL COMBUSTION, FLAMMABLE LIQUID POWERED');
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      expect(psnMarking?.value).toContain('UN3528');
      expect(psnMarking?.value).toContain('ENGINE');
    });

    test('Scenario 20 Alteration 1: Engine incorrectly assigned PG II', () => {
      // Documents that engines shouldn't have packing groups
      const context = createClass3Context('UN3528', 'II', 'ENGINE, INTERNAL COMBUSTION, FLAMMABLE LIQUID POWERED');
      const result = evaluateMarkingRequirements(context);

      // System still generates marking regardless - validation elsewhere
      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
    });

    test('Scenario 20 Alteration 2: MACHINERY instead of ENGINE', () => {
      const context = createClass3Context('UN3528', '', 'MACHINERY, INTERNAL COMBUSTION');
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking?.value).toContain('MACHINERY');
      expect(psnMarking?.value).not.toContain('ENGINE');
    });
  });

  describe('Subsidiary Risk Scenarios', () => {
    test('Scenario 2: UN1093 with 6.1 subsidiary risk (TOXIC)', () => {
      const context = createClass3Context('UN1093', 'I', 'ACRYLONITRILE, STABILIZED', {
        subsidiaryRisk: '6.1',
      });
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
      // Subsidiary risk affects labeling, not PSN marking directly
    });

    test('Scenario 3: UN3165 with multiple subsidiary risks (6.1, 8)', () => {
      const context = createClass3Context('UN3165', 'I', 'AIRCRAFT HYDRAULIC POWER UNIT FUEL TANK', {
        subsidiaryRisk: '6.1, 8',
      });
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
    });

    test('Scenario 8: UN3274 with 8 subsidiary risk (CORROSIVE)', () => {
      const context = createClass3Context('UN3274', 'II', 'ALCOHOLATES SOLUTION, N.O.S.', {
        subsidiaryRisk: '8',
        isTechnicalNameRequired: true,
        technicalName: 'sodium methoxide',
      });
      const result = evaluateMarkingRequirements(context);

      const psnMarking = result.find((m) => m.id === 'proper-shipping-name-unid');
      expect(psnMarking).toBeDefined();
    });
  });
});
