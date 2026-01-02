import { JSX } from "react";
import { PackagingReference } from "../../../server/data/grandfatheredPackagingParagraphReferences";
import { ExplosiveCrossReference } from "../../../server/data/tableA27_1";
import { SpecialProvisionsMap } from "../../../server/informativeStatements/informativeStatements";
import { HazProContextLookupOutput } from "../../../server/lookupFunctions/hazProContextLookup";
import { BatteryDetails } from "../../../src/components/BatteryPoweredVehicle";
import { CapacitorData } from "../../../src/components/Capacitors";
import { EngineOrMachineryPreparationData } from "../../../src/components/EnginesInternalCombustion";
import { ExplosiveContainer } from "../../../src/components/ExplosiveDetailsWizardNew";
import { GMOShipmentData } from "../../../src/components/GeneticallyModifiedOrganisms";
import { KitPreparationData } from "../../../src/components/KitPreparationScreen";
import { LifeSavingApplianceData } from "../../../src/components/LifeSavingAppliances";
import { MagnetizedMaterialData } from "../../../src/components/MagnetizedMaterialsPrepScreen";
import { SafetyDeviceFormValues } from "../../../src/components/SafetyDevices";
import { RequiredLabel } from "../../../src/utils/labelingRequirements";
import { RequiredMarking } from "../../../src/utils/markingRequirements";
import { Cylinder } from "../../../src/utils/summarizeCylinderDescriptionForSddg";
import {
  AccessorialHazard,
  ConsigneeAddress,
  EmergencyPhoneNumberMap,
  ExceptedQuantityData,
  HazardousMaterialItem,
  LimitedQuantityData,
  LithiumBatteryData,
  LithiumBatteryExceptionParameters,
  PhysicalState,
  Preparer,
  QuantityUnit,
  ShipperAddress,
  UN3166Details,
} from "../../../types";

export interface HazProPreparerContext {
  hazardousMaterial: HazardousMaterialItem | null;
  lookupFunctionsOutput: HazProContextLookupOutput | null;
  requiredMarkings?: Record<string, string>;
  requiredLabels?: Record<string, string>;
  requiredMarkingsArray?: RequiredMarking[];
  requiredLabelsArray?: RequiredLabel[];
  specialProvisionsMap?: Record<string, string>;
  modifiersAndRequiredAcknowledgements: {
    generalPackagingRequirementsAcknowledged: boolean;
    informativeStatementsAcknowledged: boolean;
    workflowModifiersAcknowledged: boolean;
    specialProvisionsAcknowledged: boolean;
    documentNodeInformativeStatements: JSX.Element[];
    documentNodeWorkflowModifiers: JSX.Element[];
    specialProvisionsInformativeStatements: SpecialProvisionsMap;
    specialProvisionsWorkflowModifiers: SpecialProvisionsMap;
  } | null;
  packagingMethod?: string;
  usesCoeCertification: boolean;
  usesCaaCertification: boolean;
  usesDotSpPermit: boolean;
  allowablePackingGroups: string;
  magnetizedMaterialData?: MagnetizedMaterialData;
  kitPreparationData?: KitPreparationData;
  batteryVehicle?: BatteryDetails;
  capacitorData?: CapacitorData;
  lifeSavingApplianceData?: LifeSavingApplianceData;
  geneticallyModifiedOrganism?: GMOShipmentData;
  safetyDeviceData?: SafetyDeviceFormValues;
  redirectUnid?: string;
  installedExplosivesDetails?: {
    installationLocation: string;
  };
  overpack: boolean;
  explosivesAuthorizedToBeShippedUnpacked?: boolean;
  coeAndCaaDocuments?: {
    coeDocuments: Array<{
      id: string;
      documentType: "COE";
      base64Data: string;
      name: string;
      dateAdded: string;
    }>;
    caaDocuments: Array<{
      id: string;
      documentType: "CAA";
      base64Data: string;
      name: string;
      dateAdded: string;
    }>;
  };
  dotSpWaivers?: Array<{
    id: string;
    uri: string;
    base64Data: string;
    waiverNumber: string;
    description?: string;
    dateAdded: string;
  }>;
  exceptedLithiumBatteryEmergencyContact?: string;
  engineOrMachineryPreparationData?: EngineOrMachineryPreparationData;
  dryIceData?: {
    packagingType: string;
    quantity: string;
    aircraftType: string;
    isAircraftPressurized: boolean;
    isVentingProvided: boolean;
    specialInstructions: string;
    handlingInstructions: string;
  };
  additionalHandlingInfo: {
    accessorialHazmat: AccessorialHazard[];
    notes: string[];
  };
  coeApprovalEntity?: string;
  caaApprovalEntity?: string;
  packaging: {
    packagingType:
      | "Single"
      | "Combination"
      | "Composite"
      | "CompositePackagingWithPlasticInnerReceptacles"
      | "CompositePackagingWithGlassPorcelainOrStonewareInnerReceptacles"
      | "";
    selectedPackagingOptionId?: string;
    usesPopMarking?: boolean;
    usesDotCylinderMarking?: boolean;
    inputPOPMarking?: {
      type?: "Solid" | "Liquid" | "Bulk";
      A: string | null;
      B: string | null;
      C: string | null;
      D: string | null;
      E: string | null;
      F: string | null;
      G: string | null;
      H: string | null;
    };
    inputCylinderPOPMarking?: string;
    cylinderDetails?: {
      numberOfCylinders: string;
      quantityPerCylinder: {
        lbs: string;
        kgs: string;
      };
      cryogenicLiquidDetails?: {
        ventRateInSCFH: string;
      };
      unit: QuantityUnit;
    };
    /* single packaging properties */
    singlePackagingType?: {
      code: string;
      packagingType: string;
    };

    /* composite packaging properties */
    compositePackagingType?: {
      code: string;
      packagingType: string;
    };

    /* intermediate packaging properties */
    intermediatePackagingType?: {
      code: string;
      packagingType: string;
    };

    /* combination packaging properties */
    combinationPackaging?: {
      innerPackaging?: {
        code: string;
        packagingType: string;
      };
      intermediatePackaging?: {
        code: string;
        packagingType: string;
      };
      outerPackaging?: {
        code: string;
        packagingType: string;
      };
      numberOfInnerContainers?: number;
      quantityPerContainer?: string;
      massPerInnerContainer?: {
        lbs: number;
        kg: number;
      };
      volumePerInnerContainer?: {
        liters: number;
        gallons: number;
      };
    };
    totalNetMass?: {
      lbs: number;
      kg: number;
    };
    totalNetVolume?: {
      liters: number;
      gallons: number;
    };
    popIsValid?: boolean;
  } | null;
  currentShipmentId?: string;
  shipment: {
    poeOption: string;
    podOption: string;
    isChapter3?: string;
    tcn: string;
    poe: string;
    pod: string;
    shipmentType?: string;
    inspector?: string;
    selectedOuterPackaging?: string | null;
    totalNetExplosiveWeight?: number;
    netExplosiveWeightPerRound?: number;
    roundCount?: number;
  } | null;
  preparer: Preparer | null;
  isLithiumBatteryExceptedQuantity?: boolean;
  isLimitedQuantity: boolean;
  isExceptedQuantity: boolean;
  olderThanJanuary1st1990?: boolean;
  activeStep: number | null;
  activeSubstep: number | null;
  completedSubsteps: string[];
  packagingWizardStep?: number;
  absorbentStepRequired: boolean;
  key19Annotations: string[];
  cylinderRestrictions?: {
    waterCapacityLimit?: {
      lbs: number;
      kg: number;
    };
    maxFillingDensityLimit?: {
      percentage: number;
    };
    massCapacityLimit: {
      lbs: number;
      kg: number;
    };
    cylinderTypes: string[];
  };
  cylinderProperties?: Cylinder[];
  lithiumBatteryData?: LithiumBatteryData;
  lithiumBatteryExceptionParameters?: LithiumBatteryExceptionParameters;
  megcProperties?: {
    isUsingMegc: boolean;
    cylinderType: string;
    numberOfCylinders: number;
    waterCapacityPerCylinder: {
      L: number;
    };
    quantityPerCylinder: {
      kg: number;
      g: number;
    };
    totalQuantity: {
      kg: number;
      g: number;
    };
  };
  isGrandfatheredExplosive?: boolean;
  grandfatheredExplosive?: {
    tableA27_1CrossReference: ExplosiveCrossReference;
    packagingParagraphReferenceData: PackagingReference;
    generalPackageDescription: string;
    packageDimensions?: {
      length?: {
        inches?: number;
        centimeters?: number;
      };
      width?: {
        inches?: number;
        centimeters?: number;
      };
      height?: {
        inches?: number;
        centimeters?: number;
      };
      diameter?: {
        inches?: number;
        centimeters?: number;
      };
    };
  };
  grandfatheredExplosivesContainers: ExplosiveContainer[];
  vehiclePreparation?: {
    fuelComplianceConfirmed: boolean;
    batteryComplianceConfirmed: boolean;
    accessoryComplianceConfirmed: boolean;
    technicalManualConfirmed: boolean;
    additionalNotes?: string;
  };
  un3166Details: UN3166Details;
  activePersona: "Preparer" | "Inspector";
  emergencyPhoneNumberMap: EmergencyPhoneNumberMap;
  shipper: {
    name: string;
    movementType: "Channel" | "Mobility" | null;
    address: ShipperAddress;
    worldwideMobility: boolean; // If Mobility, allow this instead of address information
    phoneNumber: {
      type: "DSN" | "Commercial" | "Both";
      format: "Domestic" | "International";
      number: string;
      dsnNumber?: string;
      isInternational?: boolean;
      countryCode?: string;
    } | null;
  } | null;
  consignee: {
    movementType: "Channel" | "Mobility" | null;
    address: ConsigneeAddress;
    worldwideMobility: boolean; // If Mobility, allow this instead of address information
    phoneNumber: {
      type: "DSN" | "Commercial" | "Both";
      format: "Domestic" | "International";
      number: string;
      dsnNumber?: string;
      isInternational?: boolean;
      countryCode?: string;
    } | null;
  } | null;
  technicalName?: string | null;
  packagingEntryMethod?: 'scan' | 'manual' | 'walkthrough' | null;

  // Attachment 19 - Excepted and Limited Quantities
  exceptedQuantityData?: ExceptedQuantityData;
  limitedQuantityData?: LimitedQuantityData;
}

export interface SavedShipment {
  id: string;
  status: "in-progress" | "completed";
  savedAt: Date;
  hazProPreparerContext: HazProPreparerContext;
}

export interface HazProPreparerState {
  hazProPreparerContext: HazProPreparerContext;

  // Database-related state (lightweight)
  shipmentsIndex: {
    [shipmentId: string]: {
      id: string;
      status: "in-progress" | "completed";
      savedAt: string;
      tcn: string;
      title?: string;
      materialName?: string;
    };
  };

  // Loading states
  isLoadingShipments: boolean;
  loadingShipmentId?: string;
  databaseError: string | null;
}

export type HazProPreparerAction =
  | { type: "UPDATE_FIELD"; field: keyof HazProPreparerContext; value: any }
  | { type: "UPDATE_NESTED_FIELD"; field: string; value: any }
  | { type: "COMPLETE_SUBSTEP"; payload: string }
  | { type: "RESET_CONTEXT" }

  // Database-related actions
  | {
      type: "SET_LOADING_STATE";
      payload: {
        isLoading: boolean;
        shipmentId?: string;
        error?: string | null;
      };
    }
  | { type: "LOAD_SHIPMENT_SUCCESS"; payload: HazProPreparerContext }
  | {
      type: "UPDATE_SHIPMENTS_INDEX";
      payload: {
        [shipmentId: string]: {
          id: string;
          status: "in-progress" | "completed";
          savedAt: string;
          tcn: string;
          title?: string;
          materialName?: string;
        };
      };
    }
  | { type: "SET_DATABASE_ERROR"; payload: string | null };

export const hazProPreparerReducer = (
  state: HazProPreparerState,
  action: HazProPreparerAction
): HazProPreparerState => {
  switch (action.type) {
    case "UPDATE_FIELD":
      return {
        ...state,
        hazProPreparerContext: {
          ...state.hazProPreparerContext,
          [action.field]: action.value,
        },
      };

    case "UPDATE_NESTED_FIELD":
      const keys = action.field.split(".");
      return {
        ...state,
        hazProPreparerContext: updateNestedField(
          state.hazProPreparerContext,
          keys,
          action.value
        ),
      };

    case "COMPLETE_SUBSTEP":
      return {
        ...state,
        hazProPreparerContext: {
          ...state.hazProPreparerContext,
          completedSubsteps:
            state.hazProPreparerContext.completedSubsteps.includes(
              action.payload
            )
              ? state.hazProPreparerContext.completedSubsteps
              : [
                  ...state.hazProPreparerContext.completedSubsteps,
                  action.payload,
                ],
        },
      };

    case "SET_LOADING_STATE":
      return {
        ...state,
        isLoadingShipments: action.payload.isLoading,
        loadingShipmentId: action.payload.shipmentId,
        databaseError: action.payload.error ?? state.databaseError,
      };

    case "LOAD_SHIPMENT_SUCCESS":
      return {
        ...state,
        hazProPreparerContext: {
          ...action.payload,
          currentShipmentId:
            action.payload.currentShipmentId || action.payload.shipment?.tcn,
        },
        isLoadingShipments: false,
        loadingShipmentId: undefined,
        databaseError: null,
      };

    case "UPDATE_SHIPMENTS_INDEX":
      return {
        ...state,
        shipmentsIndex: action.payload,
      };

    case "SET_DATABASE_ERROR":
      return {
        ...state,
        databaseError: action.payload,
        isLoadingShipments: false,
        loadingShipmentId: undefined,
      };

    case "RESET_CONTEXT":
      return {
        ...initialHazProPreparerState,
        shipmentsIndex: state.shipmentsIndex, // Preserve the index when resetting
      };

    default:
      return state;
  }
};

const updateNestedField = (
  obj: any,
  keys: string[],
  value: any
): HazProPreparerContext => {
  if (keys.length === 1) {
    return { ...obj, [keys[0]]: value };
  }
  const [firstKey, ...restKeys] = keys;
  return {
    ...obj,
    [firstKey]: updateNestedField(obj[firstKey] || {}, restKeys, value),
  };
};

export const mockSavedShipments: SavedShipment[] = [
  {
    id: "shipment-1",
    status: "completed",
    savedAt: new Date("2025-04-24T16:56:17.657Z"),
    hazProPreparerContext: {
      hazardousMaterial: {
        packingGroup: "II",
        isFixed: "",
        isDomesticShipment: false,
        isTechnicalNameRequired: false,
        unid: "UN1402",
        properShippingName: "CALCIUM CARBIDE",
        hazclassDiv: "4.3",
        packagingParagraph: "A8.3.",
        specialProvision: "P5, A1, A8, N34",
        subsidiaryRisk: "",
        physicalState: PhysicalState.SOLID,
      },
      overpack: false,
      usesCoeCertification: false,
      usesCaaCertification: false,
      usesDotSpPermit: false,
      lookupFunctionsOutput: {
        packaging: {
          packagingOptionsAndInstructions: {
            "A8.3.": {
              description: "Packaging for Class 4 Solids is as follows:",
              packagingInstructions: {
                combinationPackaging: {
                  innerPackaging: {
                    required: true,
                    receptacles: [
                      "Glass",
                      "Earthenware",
                      "Plastic",
                      "Metal",
                      "Glass ampoules",
                    ],
                  },
                  outerPackaging: {
                    drums: [
                      "Steel (1A1 or 1A2)",
                      "Aluminum (1B1 or 1B2)",
                      "Plywood (1D)",
                      "Fiber (1G)",
                      "Plastic (1H1 or 1H2)",
                      "Other metal (1N1 or 1N2)",
                    ],
                    barrel: ["Wood (2C2)"],
                    jerricans: [
                      "Steel (3A1 or 3A2)",
                      "Aluminum (3B1 or 3B2)",
                      "Plastic (3H1 or 3H2)",
                    ],
                    boxes: [
                      "Steel (4A)",
                      "Aluminum (4B)",
                      "Natural wood (4C1 or 4C2)",
                      "Plywood (4D)",
                      "Reconstituted wood (4F)",
                      "Fiberboard (4G)",
                      "Solid plastic (4H2)",
                      "Other metal (4N)",
                    ],
                  },
                },
                singlePackaging: {
                  innerPackaging: {
                    required: false,
                  },
                  outerPackaging: {
                    drums: [
                      "Steel (1A1 or 1A2)",
                      "Aluminum (1B1 or 1B2)",
                      "Plywood (1D)",
                      "Fiber (1G)",
                      "Plastic (1H1 or 1H2)",
                      "Metal other than steel or aluminum (1N1 or 1N2)",
                    ],
                    notes: [
                      "Plywood (1D) not authorized for PG I material.",
                      "Wooden barrels (2C1 or 2C2) not authorized for PG I material.",
                      "Steel boxes (4A) and aluminum boxes (4B) require liners for PG I material.",
                    ],
                    barrels: ["Wood (2C1 or 2C2)"],
                    jerricans: [
                      "Steel (3A1 or 3A2)",
                      "Aluminum (3B1 or 3B2)",
                      "Plastic (3H1 or 3H2)",
                    ],
                    boxes: [
                      "Steel (4A)",
                      "Steel (4A) with liner",
                      "Aluminum (4B)",
                      "Aluminum (4B) with liner",
                      "Natural wood (4C1 or 4C2)",
                      "Plywood (4D)",
                      "Reconstituted wood (4F)",
                      "Fiberboard (4G)",
                      "Plastic (4H1 or 4H2)",
                      "Metal other than steel or other metal (4N)",
                    ],
                  },
                },
                compositePackagingWithPlasticInnerReceptacles: {
                  innerPackaging: {
                    required: true,
                    receptacles: ["Plastic"],
                  },
                  outerPackaging: {
                    drums: [
                      "Steel (6HA1)",
                      "Aluminum (6HB1)",
                      "Plywood (6HD1)",
                      "Fiber (6HG1)",
                      "Plastic drum (6HH1)",
                    ],
                    boxes: [
                      "Steel (6HA2)",
                      "Aluminum (6HB2)",
                      "Wooden (6HC)",
                      "Plywood (6HD2)",
                      "Fiberboard (6HG2)",
                    ],
                    note: "Plastic receptacles in outer boxes are not authorized for PG I material.",
                  },
                },
                compositePackagingWithGlassPorcelainOrStonewareInnerReceptacles:
                  {
                    innerReceptacle: {
                      materials: ["Glass", "Porcelain", "Stoneware"],
                    },
                    outerPackaging: {
                      drums: [
                        "Steel (6PA1)",
                        "Aluminum (6PB1)",
                        "Plywood (6PD1)",
                        "Fiber (6PG1)",
                      ],
                      boxes: [
                        "Steel (6PA2)",
                        "Aluminum (6PB2)",
                        "Wooden (6PC)",
                        "Fiberboard (6PG2)",
                      ],
                      plastics: [
                        "Expanded plastic packaging (6PH1)",
                        "Solid plastic packaging (6PH2)",
                      ],
                      note: "Expanded or solid plastic packagings are not authorized for PG I material.",
                    },
                  },
                cylinderPackagingInstructions: {
                  "A8.3.5.": {
                    instructions:
                      "DOT Cylinders. DOT specification cylinders as prescribed for any compressed gas, except DOT 8, 8AL, and DOT 3HT.",
                  },
                },
              },
            },
          },
          packagingAuthorization: ["A8.3."],
        },
        packingGroup: ["II"],
        specialProvisions: {
          A8: "For combination packagings, if glass inner packagings (including ampoules) are used, they must be packed with cushioning material in tightly closed metal receptacles before packing in outer packaging's. (T-0).",
        },
        pCode: "P5",
        isRadioactive: false,
        reportableQuantityRequirement: {
          pounds: 10,
          kilograms: 4.54,
        },
      },
      grandfatheredExplosivesContainers: [],
      modifiersAndRequiredAcknowledgements: {
        specialProvisionsInformativeStatements: {
          A8: "For combination packagings, if glass inner packagings (including ampoules) are used, they must be packed with cushioning material in tightly closed metal receptacles before packing in outer packaging's. (T-0).",
        },
        specialProvisionsWorkflowModifiers: {
          P5: "Transport this material on passenger or cargo aircraft without passenger restriction.",
          A1: "Single packaging is not permitted on aircraft carrying passengers. P4 restrictions apply.",
          N34: "Aluminum construction materials are not authorized for any part of a packaging which is normally in contact with the hazardous materials.",
        },
        generalPackagingRequirementsAcknowledged: true,
        informativeStatementsAcknowledged: true,
        workflowModifiersAcknowledged: true,
        documentNodeInformativeStatements: [],
        documentNodeWorkflowModifiers: [],
      },
      preparer: {
        preparerName: "Jerry Jaffin",
        preparerTitle: "Supervisory Packaging Specialist",
        certificationPlace: "WPAFB, OH 45433",
        preparerRank: "",
        certificationDate: "",
        signature: "",
      },
      isLimitedQuantity: false,
      isExceptedQuantity: false,
      shipment: {
        poeOption: "Channel",
        podOption: "Channel",
        tcn: "FB50003060051XXW",
        poe: "DOV",
        pod: "RMS",
        isChapter3: "No",
        selectedOuterPackaging: "1A1",
      },
      key19Annotations: [],
      un3166Details: {
        vehicleNomenclature: "",
        quantity: null,
        fuel: null,
        fuelEntryMode: null,
        unit: "liters",
        tankCount: 0,
        multiTanks: [],
        accessorialHazards: {
          batteries: {
            accessorialHazardousMaterialIdentification: null,
            quantity: "",
          },
          fireExtinguishers: {
            accessorialHazardousMaterialIdentification: null,
            quantity: "",
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
      activePersona: "Preparer",
      emergencyPhoneNumberMap: {
        class1Explosives: [
          {
            name: "The Army Operations Center",
            phoneNumber: {
              commercial: "+1 (703) 695-4695/4696",
              dsn: "312-225-4695/4696",
            },
          },
        ],
        class7RadioactiveMaterial: [
          {
            name: "Army",
            phoneNumber: {
              commercial: "+1 (703) 695-4695/4696",
              dsn: "(312) 225-4695/4696",
            },
          },
          {
            name: "Air Force",
            phoneNumber: {
              commercial: "+1 (202) 767-4011",
            },
          },
          {
            name: "Navy/Marines",
            phoneNumber: {
              commercial: "+1 (757) 887-4692",
              dsn: "(312) 953-4692",
            },
          },
          {
            name: "DLA",
            phoneNumber: {
              commercial: "+1 (717) 770-5283",
            },
          },
        ],
        allOtherHazardousMaterials: {
          domestic: {
            phoneNumber: "1-800-851-8061",
          },
          international: {
            phoneNumber: "+1-804-279-3131",
          },
        },
      },
      allowablePackingGroups: "I II",
      packaging: {
        packagingType: "Single",
        cylinderDetails: {
          numberOfCylinders: "",
          quantityPerCylinder: {
            lbs: "",
            kgs: "",
          },
          unit: QuantityUnit.LBS,
        },
        inputPOPMarking: {
          A: "UN",
          B: "1A1",
          C: "X",
          D: "25",
          E: "S",
          F: "12",
          G: "USA",
          H: "DOD",
          type: "Solid",
        },
        totalNetMass: {
          lbs: 52.91087999999999,
          kg: 24,
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
        popIsValid: false,
        usesDotCylinderMarking: false,
        usesPopMarking: true,
      },
      shipper: {
        name: "Traffic Management Flight",
        movementType: "Channel",
        worldwideMobility: false,
        address: {
          shipperLocation: "Traffic Management Flight",
          shipperStreet: "5236 Chase Street",
          shipperCity: "Wright Patterson AFB",
          shipperState: "OH",
          selectedShipperCountry: "United States of America",
          shipperZipcode: "45433-5501",
        },
        phoneNumber: {
          type: "Both",
          dsnNumber: "(562) 590-8668",
          format: "International",
          number: "+1 (895) 786-2585",
        },
      },
      consignee: {
        movementType: "Channel",
        worldwideMobility: false,
        address: {
          consigneeDodaac: "FB5612",
          consigneeStreet: "435 ABW LRS",
          consigneeCity: "Ramstein AB",
          consigneeState: "",
          selectedConsigneeCountry: "Germany",
          consigneeZipcode: "",
        },
        phoneNumber: {
          type: "Both",
          dsnNumber: "(278) 628-9625",
          format: "International",
          number: "+49 (534) 993-4822",
        },
      },
      technicalName: "",
      activeStep: 4,
      activeSubstep: null,
      completedSubsteps: [
        "MaterialID",
        "GeneralPackagingAcknowledgement",
        "InformativeAndWorkflowModifierAcknowledgement",
        "InformativeAndWorkflowModifierAcknowledgement",
        "PackagingScreen",
        "PackagingWizard",
        "POPMarkingDataEntry",
        "LabelingAndMarking",
        "ShippersDeclarationScreen",
      ],
      absorbentStepRequired: false,
    },
  },
  {
    id: "shipment-2",
    status: "completed",
    savedAt: new Date("2025-04-24T16:56:17.657Z"),
    hazProPreparerContext: {
      hazardousMaterial: {
        packingGroup: "II",
        isFixed: "",
        isDomesticShipment: false,
        isTechnicalNameRequired: false,
        unid: "UN1402",
        properShippingName: "CALCIUM CARBIDE",
        hazclassDiv: "4.3",
        packagingParagraph: "A8.3.",
        specialProvision: "P5, A1, A8, N34",
        subsidiaryRisk: "",
        physicalState: PhysicalState.SOLID,
      },
      overpack: false,
      usesCoeCertification: false,
      usesCaaCertification: false,
      usesDotSpPermit: false,
      grandfatheredExplosivesContainers: [],
      lookupFunctionsOutput: {
        packaging: {
          packagingOptionsAndInstructions: {
            "A8.3.": {
              description: "Packaging for Class 4 Solids is as follows:",
              packagingInstructions: {
                combinationPackaging: {
                  innerPackaging: {
                    required: true,
                    receptacles: [
                      "Glass",
                      "Earthenware",
                      "Plastic",
                      "Metal",
                      "Glass ampoules",
                    ],
                  },
                  outerPackaging: {
                    drums: [
                      "Steel (1A1 or 1A2)",
                      "Aluminum (1B1 or 1B2)",
                      "Plywood (1D)",
                      "Fiber (1G)",
                      "Plastic (1H1 or 1H2)",
                      "Other metal (1N1 or 1N2)",
                    ],
                    barrel: ["Wood (2C2)"],
                    jerricans: [
                      "Steel (3A1 or 3A2)",
                      "Aluminum (3B1 or 3B2)",
                      "Plastic (3H1 or 3H2)",
                    ],
                    boxes: [
                      "Steel (4A)",
                      "Aluminum (4B)",
                      "Natural wood (4C1 or 4C2)",
                      "Plywood (4D)",
                      "Reconstituted wood (4F)",
                      "Fiberboard (4G)",
                      "Solid plastic (4H2)",
                      "Other metal (4N)",
                    ],
                  },
                },
                singlePackaging: {
                  innerPackaging: {
                    required: false,
                  },
                  outerPackaging: {
                    drums: [
                      "Steel (1A1 or 1A2)",
                      "Aluminum (1B1 or 1B2)",
                      "Plywood (1D)",
                      "Fiber (1G)",
                      "Plastic (1H1 or 1H2)",
                      "Metal other than steel or aluminum (1N1 or 1N2)",
                    ],
                    notes: [
                      "Plywood (1D) not authorized for PG I material.",
                      "Wooden barrels (2C1 or 2C2) not authorized for PG I material.",
                      "Steel boxes (4A) and aluminum boxes (4B) require liners for PG I material.",
                    ],
                    barrels: ["Wood (2C1 or 2C2)"],
                    jerricans: [
                      "Steel (3A1 or 3A2)",
                      "Aluminum (3B1 or 3B2)",
                      "Plastic (3H1 or 3H2)",
                    ],
                    boxes: [
                      "Steel (4A)",
                      "Steel (4A) with liner",
                      "Aluminum (4B)",
                      "Aluminum (4B) with liner",
                      "Natural wood (4C1 or 4C2)",
                      "Plywood (4D)",
                      "Reconstituted wood (4F)",
                      "Fiberboard (4G)",
                      "Plastic (4H1 or 4H2)",
                      "Metal other than steel or other metal (4N)",
                    ],
                  },
                },
                compositePackagingWithPlasticInnerReceptacles: {
                  innerPackaging: {
                    required: true,
                    receptacles: ["Plastic"],
                  },
                  outerPackaging: {
                    drums: [
                      "Steel (6HA1)",
                      "Aluminum (6HB1)",
                      "Plywood (6HD1)",
                      "Fiber (6HG1)",
                      "Plastic drum (6HH1)",
                    ],
                    boxes: [
                      "Steel (6HA2)",
                      "Aluminum (6HB2)",
                      "Wooden (6HC)",
                      "Plywood (6HD2)",
                      "Fiberboard (6HG2)",
                    ],
                    note: "Plastic receptacles in outer boxes are not authorized for PG I material.",
                  },
                },
                compositePackagingWithGlassPorcelainOrStonewareInnerReceptacles:
                  {
                    innerReceptacle: {
                      materials: ["Glass", "Porcelain", "Stoneware"],
                    },
                    outerPackaging: {
                      drums: [
                        "Steel (6PA1)",
                        "Aluminum (6PB1)",
                        "Plywood (6PD1)",
                        "Fiber (6PG1)",
                      ],
                      boxes: [
                        "Steel (6PA2)",
                        "Aluminum (6PB2)",
                        "Wooden (6PC)",
                        "Fiberboard (6PG2)",
                      ],
                      plastics: [
                        "Expanded plastic packaging (6PH1)",
                        "Solid plastic packaging (6PH2)",
                      ],
                      note: "Expanded or solid plastic packagings are not authorized for PG I material.",
                    },
                  },
                cylinderPackagingInstructions: {
                  "A8.3.5.": {
                    instructions:
                      "DOT Cylinders. DOT specification cylinders as prescribed for any compressed gas, except DOT 8, 8AL, and DOT 3HT.",
                  },
                },
              },
            },
          },
          packagingAuthorization: ["A8.3."],
        },
        packingGroup: ["II"],
        specialProvisions: {
          A8: "For combination packagings, if glass inner packagings (including ampoules) are used, they must be packed with cushioning material in tightly closed metal receptacles before packing in outer packaging's. (T-0).",
        },
        pCode: "P5",
        isRadioactive: false,
        reportableQuantityRequirement: {
          pounds: 10,
          kilograms: 4.54,
        },
      },
      modifiersAndRequiredAcknowledgements: {
        specialProvisionsInformativeStatements: {
          A8: "For combination packagings, if glass inner packagings (including ampoules) are used, they must be packed with cushioning material in tightly closed metal receptacles before packing in outer packaging's. (T-0).",
        },
        specialProvisionsWorkflowModifiers: {
          P5: "Transport this material on passenger or cargo aircraft without passenger restriction.",
          A1: "Single packaging is not permitted on aircraft carrying passengers. P4 restrictions apply.",
          N34: "Aluminum construction materials are not authorized for any part of a packaging which is normally in contact with the hazardous materials.",
        },
        generalPackagingRequirementsAcknowledged: true,
        informativeStatementsAcknowledged: true,
        workflowModifiersAcknowledged: true,
        documentNodeInformativeStatements: [],
        documentNodeWorkflowModifiers: [],
      },
      key19Annotations: [""],
      preparer: {
        preparerName: "Jerry Jaffin",
        preparerTitle: "Supervisory Packaging Specialist",
        certificationPlace: "WPAFB, OH 45433",
        preparerRank: "",
        certificationDate: "",
        signature: "",
      },
      isLimitedQuantity: false,
      isExceptedQuantity: false,
      shipment: {
        poeOption: "Channel",
        podOption: "Channel",
        tcn: "FB50003060002XXW",
        poe: "DOV",
        pod: "RMS",
        isChapter3: "No",
        selectedOuterPackaging: "1A1",
      },
      un3166Details: {
        vehicleNomenclature: "",
        quantity: null,
        fuel: null,
        fuelEntryMode: null,
        unit: "liters",
        tankCount: 0,
        multiTanks: [],
        accessorialHazards: {
          batteries: {
            accessorialHazardousMaterialIdentification: null,
            quantity: "",
          },
          fireExtinguishers: {
            accessorialHazardousMaterialIdentification: null,
            quantity: "",
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
      activePersona: "Preparer",
      emergencyPhoneNumberMap: {
        class1Explosives: [
          {
            name: "The Army Operations Center",
            phoneNumber: {
              commercial: "+1 (703) 695-4695/4696",
              dsn: "312-225-4695/4696",
            },
          },
        ],
        class7RadioactiveMaterial: [
          {
            name: "Army",
            phoneNumber: {
              commercial: "+1 (703) 695-4695/4696",
              dsn: "(312) 225-4695/4696",
            },
          },
          {
            name: "Air Force",
            phoneNumber: {
              commercial: "+1 (202) 767-4011",
            },
          },
          {
            name: "Navy/Marines",
            phoneNumber: {
              commercial: "+1 (757) 887-4692",
              dsn: "(312) 953-4692",
            },
          },
          {
            name: "DLA",
            phoneNumber: {
              commercial: "+1 (717) 770-5283",
            },
          },
        ],
        allOtherHazardousMaterials: {
          domestic: {
            phoneNumber: "1-800-851-8061",
          },
          international: {
            phoneNumber: "+1-804-279-3131",
          },
        },
      },
      allowablePackingGroups: "I II",
      packaging: {
        packagingType: "Single",
        cylinderDetails: {
          numberOfCylinders: "",
          quantityPerCylinder: {
            lbs: "",
            kgs: "",
          },
          unit: QuantityUnit.LBS,
        },
        inputPOPMarking: {
          A: "UN",
          B: "1A1",
          C: "X",
          D: "25",
          E: "S",
          F: "12",
          G: "USA",
          H: "DOD",
          type: "Solid",
        },
        totalNetMass: {
          lbs: 52.91087999999999,
          kg: 24,
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
        popIsValid: false,
        usesDotCylinderMarking: false,
        usesPopMarking: true,
      },
      shipper: {
        name: "Traffic Management Flight",
        movementType: "Channel",
        worldwideMobility: false,
        address: {
          shipperLocation: "Traffic Management Flight",
          shipperStreet: "5236 Chase Street",
          shipperCity: "Wright Patterson AFB",
          shipperState: "OH",
          selectedShipperCountry: "United States of America",
          shipperZipcode: "45433-5501",
        },
        phoneNumber: {
          type: "Both",
          dsnNumber: "(562) 590-8668",
          format: "International",
          number: "+1 (895) 786-2585",
        },
      },
      consignee: {
        movementType: "Channel",
        worldwideMobility: false,
        address: {
          consigneeDodaac: "FB5612",
          consigneeStreet: "435 ABW LRS",
          consigneeCity: "Ramstein AB",
          consigneeState: "",
          selectedConsigneeCountry: "Germany",
          consigneeZipcode: "",
        },
        phoneNumber: {
          type: "Both",
          dsnNumber: "(278) 628-9625",
          format: "International",
          number: "+49 (534) 993-4822",
        },
      },
      technicalName: "",
      activeStep: 4,
      activeSubstep: null,
      completedSubsteps: [
        "MaterialID",
        "GeneralPackagingAcknowledgement",
        "InformativeAndWorkflowModifierAcknowledgement",
        "InformativeAndWorkflowModifierAcknowledgement",
        "PackagingScreen",
        "PackagingWizard",
        "POPMarkingDataEntry",
        "LabelingAndMarking",
        "ShippersDeclarationScreen",
      ],
      absorbentStepRequired: false,
    },
  },
];

export const initialHazProPreparerContext: HazProPreparerContext = {
  hazardousMaterial: null,
  lookupFunctionsOutput: null,
  requiredMarkings: {},
  requiredLabels: {},
  requiredMarkingsArray: [],
  requiredLabelsArray: [],
  specialProvisionsMap: {},
  modifiersAndRequiredAcknowledgements: null,
  // preparer: {
  //   preparerName: "",
  //   preparerTitle: "",
  //   certificationPlace: "",
  //   preparerRank: "",
  //   certificationDate: "",
  //   signature: "",
  // },
  preparer: {
    preparerName: "Jerry Jaffin",
    preparerTitle: "Supervisory Packaging Specialist",
    certificationPlace: "WPAFB, OH 45433",
    preparerRank: "",
    certificationDate: "",
    signature: "",
  },
  overpack: false,
  usesCoeCertification: false,
  usesCaaCertification: false,
  usesDotSpPermit: false,
  isLimitedQuantity: false,
  isExceptedQuantity: false,
  shipment: {
    poeOption: "Channel",
    podOption: "Channel",
    tcn: "FB5000306500012XXX",
    poe: "DOV",
    pod: "RMS",
    isChapter3: "No",
  },
  // shipment: {
  //   poeOption: "",
  //   podOption: "",
  //   tcn: "",
  //   poe: "",
  //   pod: "",
  //   isChapter3: "No",
  // },
  coeAndCaaDocuments: {
    coeDocuments: [],
    caaDocuments: [],
  },
  dotSpWaivers: [],
  grandfatheredExplosivesContainers: [],
  un3166Details: {
    vehicleNomenclature: "",
    quantity: null,
    fuel: null,
    fuelEntryMode: null,
    unit: "liters",
    tankCount: 0,
    multiTanks: [],
    accessorialHazards: {
      batteries: {
        accessorialHazardousMaterialIdentification: null,
        quantity: "",
      },
      fireExtinguishers: {
        accessorialHazardousMaterialIdentification: null,
        quantity: "",
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
  activePersona: "Preparer",
  emergencyPhoneNumberMap: {
    class1Explosives: [
      {
        name: "The Army Operations Center",
        phoneNumber: {
          commercial: "+1 (703) 695-4695/4696",
          dsn: "312-225-4695/4696",
        },
      },
    ],
    class7RadioactiveMaterial: [
      {
        name: "Army",
        phoneNumber: {
          commercial: "+1 (703) 695-4695/4696",
          dsn: "(312) 225-4695/4696",
        },
      },
      {
        name: "Air Force",
        phoneNumber: {
          commercial: "+1 (202) 767-4011",
        },
      },
      {
        name: "Navy/Marines",
        phoneNumber: {
          commercial: "+1 (757) 887-4692",
          dsn: "(312) 953-4692",
        },
      },
      {
        name: "DLA",
        phoneNumber: {
          commercial: "+1 (717) 770-5283",
        },
      },
    ],
    allOtherHazardousMaterials: {
      domestic: {
        phoneNumber: "1-800-851-8061",
      },
      international: {
        phoneNumber: "+1-804-279-3131",
      },
    },
  },
  key19Annotations: [],
  allowablePackingGroups: "",
  packaging: {
    packagingType: "",
    cylinderDetails: {
      numberOfCylinders: "",
      quantityPerCylinder: {
        lbs: "",
        kgs: "",
      },
      unit: QuantityUnit.LBS,
    },
    inputPOPMarking: {
      A: "",
      B: "",
      C: "",
      D: "",
      E: "",
      F: "",
      G: "",
      H: "",
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
  shipper: {
    name: "Traffic Management Flight",
    movementType: "Channel",
    worldwideMobility: false,
    address: {
      shipperLocation: "Traffic Management Flight",
      shipperStreet: "5236 Chase Street",
      shipperCity: "Wright Patterson AFB",
      shipperState: "OH",
      selectedShipperCountry: "United States of America",
      shipperZipcode: "45433-5501",
    },
    phoneNumber: {
      type: "Both",
      dsnNumber: "(562) 590-8668",
      format: "International",
      number: "+1 (895) 786-2585",
    },
  },
  consignee: {
    movementType: "Channel",
    worldwideMobility: false,
    address: {
      consigneeDodaac: "FB5612",
      consigneeStreet: "435 ABW LRS",
      consigneeCity: "Ramstein AB",
      consigneeState: "",
      selectedConsigneeCountry: "Germany",
      consigneeZipcode: "",
    },
    phoneNumber: {
      type: "Both",
      dsnNumber: "(278) 628-9625",
      format: "International",
      number: "+49 (534) 993-4822",
    },
  },
  // shipper: {
  //   name: "",
  //   movementType: null,
  //   worldwideMobility: false,
  //   address: {
  //     shipperLocation: "",
  //     shipperStreet: "",
  //     shipperCity: "",
  //     shipperState: "",
  //     selectedShipperCountry: "",
  //     shipperZipcode: "",
  //   },
  //   phoneNumber: null,
  // },
  // consignee: {
  //   movementType: null,
  //   worldwideMobility: false,
  //   address: {
  //     consigneeDodaac: "",
  //     consigneeStreet: "",
  //     consigneeCity: "",
  //     consigneeState: "",
  //     selectedConsigneeCountry: "",
  //     consigneeZipcode: "",
  //   },
  //   phoneNumber: null
  // },
  technicalName: "",
  activeStep: null,
  activeSubstep: null,
  completedSubsteps: [],
  absorbentStepRequired: false,
  packagingEntryMethod: null,
};

export const initialHazProPreparerState: HazProPreparerState = {
  hazProPreparerContext: initialHazProPreparerContext,

  // Database-related state (starts empty)
  shipmentsIndex: {},

  // Loading states
  isLoadingShipments: false,
  loadingShipmentId: undefined,
  databaseError: null,
};

// export const initialHazProPreparerState: HazProPreparerState = {
//   hazProPreparerContext: {
//     hazardousMaterial: null,
//     lookupFunctionsOutput: null,
//     modifiersAndRequiredAcknowledgements: null,
//     preparer: null,
//     isLimitedQuantity: false,
//     isExceptedQuantity: false,
//     shipment: {
//       poeOption: "Channel",
//       podOption: "Channel",
//       tcn: "",
//       poe: "",
//       pod: "",
//     },
//     un3166Details: {
//       vehicleNomenclature: "",
//       quantity: null,
//       fuelType: null,
//       fuelEntryMode: null,
//       unit: "liters",
//       tankCount: 0,
//       multiTanks: [],
//       accessorialHazards: {
//         batteries: {
//           accessorialHazardousMaterialIdentification: null,
//           quantity: "",
//         },
//         fireExtinguishers: {
//           accessorialHazardousMaterialIdentification: null,
//           quantity: "",
//         },
//         starterFluid: {
//           accessorialHazardousMaterialIdentification: null,
//           volume: {
//             liters: null,
//             gallons: null
//           }
//         },
//         other: [],
//       },
//     },
//     activePersona: "Preparer",
//     emergencyPhoneNumberMap: {
//       class1Explosives: [
//         {
//           name: "The Army Operations Center",
//           phoneNumber: {
//             commercial: "+1 (703) 695-4695/4696",
//             dsn: "312-225-4695/4696",
//           },
//         },
//       ],
//       class7RadioactiveMaterial: [
//         {
//           name: "Army",
//           phoneNumber: {
//             commercial: "+1 (703) 695-4695/4696",
//             dsn: "(312) 225-4695/4696",
//           },
//         },
//         {
//           name: "Air Force",
//           phoneNumber: {
//             commercial: "+1 (202) 767-4011",
//           },
//         },
//         {
//           name: "Navy/Marines",
//           phoneNumber: {
//             commercial: "+1 (757) 887-4692",
//             dsn: "(312) 953-4692",
//           },
//         },
//         {
//           name: "DLA",
//           phoneNumber: {
//             commercial: "+1 (717) 770-5283",
//           },
//         },
//       ],
//       allOtherHazardousMaterials: {
//         domestic: {
//           phoneNumber: "1-800-851-8061",
//         },
//         international: {
//           phoneNumber: "+1-804-279-3131",
//         },
//       },
//     },
//     allowablePackingGroups: "",
//     packaging: {
//       packagingType: "",
//       cylinderDetails: {
//         numberOfCylinders: "",
//         quantityPerCylinder: {
//           lbs: "",
//           kgs: ""
//         },
//         unit: QuantityUnit.LBS
//       },
//       inputPOPMarking: {
//         A: "",
//         B: "",
//         C: "",
//         D: "",
//         E: "",
//         F: "",
//         G: "",
//         H: "",
//         packingGroupOptions: []
//       },
//       totalNetMass: {
//         lbs: 0,
//         kg: 0
//       },
//       totalNetVolume: {
//         liters: 0,
//         gallons: 0
//       },
//       combinationPackaging: {
//         massPerInnerContainer: {
//           lbs: 0,
//           kg: 0
//         },
//         volumePerInnerContainer: {
//           liters: 0,
//           gallons: 0,
//         },
//       },
//       popIsValid: true,
//     },
//     shipper: {
//       name: "",
//       movementType: null,
//       worldwideMobility: false,
//       address: {
//         shipperLocation: "",
//         shipperStreet: "",
//         shipperCity: "",
//         shipperState: "",
//         selectedShipperCountry: "",
//         shipperZipcode: "",
//       },
//       phoneNumber: null,
//     },
//     consignee: {
//       movementType: null,
//       worldwideMobility: false,
//       address: {
//         consigneeDodaac: "",
//         consigneeStreet: "",
//         consigneeCity: "",
//         consigneeState: "",
//         selectedConsigneeCountry: "",
//         consigneeZipcode: "",
//       },
//       phoneNumber: null
//     },
//     airWaybillNo: "",
//     pagination: {
//       currentPage: 1,
//       totalPages: 1,
//     },
//     tcn: "",
//     optionalBlock: {},
//     specialApprovalDocument: {
//       approvalTransportationMode: ""
//     },
//     airportOfDeparture: {
//       portOfEmbarkation: "",
//       geographicalLocation: "",
//     },
//     airportOfDestination: {
//       geographicalLocation: "",
//     },
//     reportableQuantity: undefined,
//     technicalName: "",
//     mixtureTechnicalNames: [],
//     isWaste: false,
//     emptyUncleaned: false,
//     residueLastContained: false,
//     source: "",
//     quantityAndTypeOfPacking: {},
//     packagingInstructions: {},
//     authorization: {},
//     additionalHandlingInformation: {},
//     nameOfSignatory: "",
//     activeStep: null,
//     activeSubstep: null,
//     completedSubsteps: [],
//     Date: new Date(),
//     signature: "",
//     absorbentStepRequired: false,
//     additionalHandlingInfo: {
//       accessorialHazmat: [],
//       notes: []
//     }
//   },
// };
