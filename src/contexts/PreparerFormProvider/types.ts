import { JSX } from "react";

/**
 * PreparerFormProvider Types
 * Mirrors the exact structure of hazProPreparerContext from Valtio store
 */

// ==================== Hazardous Material ====================
export interface HazardousMaterialData {
  isFixed: string;
  isDomesticShipment: boolean;
  isTechnicalNameRequired: boolean;
  unid: string;
  properShippingName: string;
  hazclassDiv: string;
  subsidiaryRisk: string;
  packingGroup: string;
  specialProvision: string;
  packagingParagraph: string;
  physicalState: "SOLID" | "LIQUID" | "GAS" | "";
}

// ==================== Packaging Options & Instructions ====================
export interface PackagingReceptacle {
  required: boolean;
  receptacles?: string[];
  materials?: string[];
}

export interface PackagingOuterOptions {
  drums?: string[];
  barrel?: string[];
  barrels?: string[];
  jerricans?: string[];
  boxes?: string[];
  plastics?: string[];
  notes?: string[];
  note?: string;
}

export interface PackagingInstruction {
  innerPackaging?: PackagingReceptacle;
  innerReceptacle?: { materials: string[] };
  outerPackaging?: PackagingOuterOptions;
}

export interface CylinderPackagingInstruction {
  instructions: string;
}

export interface PackagingInstructions {
  combinationPackaging?: PackagingInstruction;
  singlePackaging?: PackagingInstruction;
  compositePackagingWithPlasticInnerReceptacles?: PackagingInstruction;
  compositePackagingWithGlassPorcelainOrStonewareInnerReceptacles?: PackagingInstruction;
  cylinderPackagingInstructions?: Record<string, CylinderPackagingInstruction>;
}

export interface PackagingOptionsAndInstructions {
  [key: string]: {
    description: string;
    packagingInstructions: PackagingInstructions;
  };
}

export interface PackagingLookup {
  packagingOptionsAndInstructions: PackagingOptionsAndInstructions;
  packagingAuthorization: string[];
}

// ==================== Markings & Labels ====================
export interface RequiredMarkingItem {
  itemKey: string;
  itemValue: string;
}

export interface MarkingRequirementDetail {
  [key: string]: string | { description: string } | { subRequirements: any };
  subRequirements?: any;
}

export interface MarkingsRequired {
  requiredMarkings: RequiredMarkingItem[];
  requiredMarkingsDetails: MarkingRequirementDetail[];
}

export interface ReportableQuantityRequirement {
  pounds: number;
  kilograms: number;
}

// ==================== Lookup Functions Output ====================
export interface LookupFunctionsOutput {
  packaging: PackagingLookup;
  packingGroup: string[];
  specialProvisions: Record<string, string>;
  pCode: string;
  isRadioactive: boolean;
  markingsRequired: MarkingsRequired;
  reportableQuantityRequirement?: ReportableQuantityRequirement;
}

// ==================== Modifiers & Acknowledgements ====================
export interface ModifiersAndRequiredAcknowledgements {
  specialProvisionsInformativeStatements?: Record<string, string>;
  specialProvisionsWorkflowModifiers?: Record<string, any>;
  generalPackagingRequirementsAcknowledged?: boolean;
  informativeStatementsAcknowledged?: boolean;
  workflowModifiersAcknowledged?: boolean;
  documentNodeInformativeStatements?: JSX.Element[];
  documentNodeWorkflowModifiers?: JSX.Element[];
}

// ==================== Preparer ====================
export interface PreparerData {
  preparerName: string;
  preparerTitle: string;
  certificationPlace: string;
  preparerRank: string;
  certificationDate: string;
  signature: string;
}

// ==================== Shipment ====================
export interface ShipmentData {
  poeOption: string;
  podOption: string;
  tcn: string;
  poe: string;
  pod: string;
  isChapter3: string;
  selectedOuterPackaging: string;
}

// ==================== Documents ====================
export interface CoeAndCaaDocuments {
  coeDocuments: any[];
  caaDocuments: any[];
}

// ==================== UN3166 Vehicle Details ====================
export interface AccessorialHazard {
  accessorialHazardousMaterialIdentification: any | null;
  quantity: string;
  volume?: {
    liters: number | null;
    gallons: number | null;
  };
}

export interface Un3166Details {
  vehicleNomenclature: string;
  quantity: number | null;
  fuel: number | null;
  fuelEntryMode: any | null;
  unit: string;
  tankCount: number;
  multiTanks: any[];
  accessorialHazards: {
    batteries: AccessorialHazard;
    fireExtinguishers: AccessorialHazard;
    starterFluid: AccessorialHazard;
    other: any[];
  };
}

// ==================== Emergency Phone Numbers ====================
export interface PhoneNumber {
  commercial?: string;
  dsn?: string;
}

export interface EmergencyContact {
  name: string;
  phoneNumber: PhoneNumber;
}

export interface EmergencyPhoneNumberMap {
  class1Explosives: EmergencyContact[];
  class7RadioactiveMaterial: EmergencyContact[];
  allOtherHazardousMaterials: {
    domestic: { phoneNumber: string };
    international: { phoneNumber: string };
  };
}

// ==================== Packaging ====================
export interface CylinderDetails {
  numberOfCylinders: string;
  quantityPerCylinder: {
    lbs: string;
    kgs: string;
  };
  unit: string;
}

export interface POPMarking {
  A: string;
  B: string;
  C: string;
  D: string;
  E: string;
  F: string;
  G: string;
  H: string;
  type: "Solid" | "Liquid" | "Bulk" | undefined;
}

export interface MassVolume {
  lbs?: number;
  kg?: number;
  liters?: number;
  gallons?: number;
}

export interface PackagingData {
  packagingType: string;
  cylinderDetails: CylinderDetails;
  inputPOPMarking: POPMarking;
  totalNetMass: MassVolume;
  totalNetVolume: MassVolume;
  combinationPackaging: {
    massPerInnerContainer: MassVolume;
    volumePerInnerContainer: MassVolume;
  };
  popIsValid: boolean;
  usesDotCylinderMarking: boolean;
  usesPopMarking: boolean;
}

// ==================== Address ====================
export interface Address {
  shipperLocation?: string;
  shipperStreet?: string;
  shipperCity?: string;
  shipperState?: string;
  selectedShipperCountry?: string;
  shipperZipcode?: string;
  consigneeDodaac?: string;
  consigneeStreet?: string;
  consigneeCity?: string;
  consigneeState?: string;
  selectedConsigneeCountry?: string;
  consigneeZipcode?: string;
}

// ==================== Phone ====================
export interface PhoneData {
  type: string;
  dsnNumber?: string;
  format?: string;
  number?: string;
}

// ==================== Shipper/Consignee ====================
export interface ShipperData {
  name: string;
  movementType: string;
  worldwideMobility: boolean;
  address: Address;
  phoneNumber: PhoneData;
}

export interface ConsigneeData {
  movementType: string;
  worldwideMobility: boolean;
  address: Address;
  phoneNumber: PhoneData;
}

// ==================== Additional Handling Info ====================
export interface AdditionalHandlingInfo {
  accessorialHazmat: any[];
  notes: any[];
}

// ==================== Pagination ====================
export interface Pagination {
  currentPage: number;
  totalPages: number;
}

// ==================== Airport Info ====================
export interface AirportOfDeparture {
  portOfEmbarkation: string;
  geographicalLocation: string;
}

export interface AirportOfDestination {
  geographicalLocation: string;
}

// ==================== Special Approval Document ====================
export interface SpecialApprovalDocument {
  approvalTransportationMode: string;
}

// ==================== Main Preparer Form State ====================
export interface PreparerFormState {
  hazardousMaterial: HazardousMaterialData | null;
  lookupFunctionsOutput: LookupFunctionsOutput | null;
  requiredMarkings: Record<string, string>;
  requiredLabels: Record<string, string>;
  modifiersAndRequiredAcknowledgements: ModifiersAndRequiredAcknowledgements | null;
  preparer: PreparerData;
  usesCoeCertification: boolean;
  usesCaaCertification: boolean;
  usesDotSpPermit: boolean;
  isLimitedQuantity: boolean;
  isExceptedQuantity: boolean;
  shipment: ShipmentData;
  coeAndCaaDocuments: CoeAndCaaDocuments;
  dotSpWaivers: any[];
  grandfatheredExplosivesContainers: any[];
  un3166Details: Un3166Details;
  activePersona: string;
  emergencyPhoneNumberMap: EmergencyPhoneNumberMap;
  key19Annotations: any[];
  allowablePackingGroups: string;
  packaging: PackagingData;
  shipper: ShipperData;
  consignee: ConsigneeData;
  airWaybillNo: string;
  pagination: Pagination;
  tcn: string;
  optionalBlock: Record<string, any>;
  specialApprovalDocument: SpecialApprovalDocument;
  airportOfDeparture: AirportOfDeparture;
  airportOfDestination: AirportOfDestination;
  technicalName: string;
  mixtureTechnicalNames: any[];
  isWaste: boolean;
  emptyUncleaned: boolean;
  residueLastContained: boolean;
  source: string;
  quantityAndTypeOfPacking: Record<string, any>;
  packagingInstructions: Record<string, any>;
  authorization: Record<string, any>;
  additionalHandlingInformation: Record<string, any>;
  nameOfSignatory: string;
  activeStep: number;
  activeSubstep: string | null;
  completedSubsteps: string[];
  Date: string;
  signature: string;
  absorbentStepRequired: boolean;
  additionalHandlingInfo: AdditionalHandlingInfo;
  packagingWizardStep: number;
  packagingMethod: string;
}

// ==================== Initial State ====================
export const initialPreparerFormState: PreparerFormState = {
  hazardousMaterial: null,
  lookupFunctionsOutput: null,
  requiredMarkings: {},
  requiredLabels: {},
  modifiersAndRequiredAcknowledgements: null,
  preparer: {
    preparerName: "John Doe",
    preparerTitle: "Hazmat Specialist",
    certificationPlace: "Travis AFB",
    preparerRank: "SSgt",
    certificationDate: "2025-10-01",
    signature: "",
  },
  usesCoeCertification: false,
  usesCaaCertification: false,
  usesDotSpPermit: false,
  isLimitedQuantity: false,
  isExceptedQuantity: false,
  shipment: {
    poeOption: "Channel",
    podOption: "Channel",
    tcn: "12345678901234567",
    poe: "Dover AFB",
    pod: "Ramstein AB",
    isChapter3: "Yes",
    selectedOuterPackaging: "",
  },
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
        quantity: "",
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
    class1Explosives: [],
    class7RadioactiveMaterial: [],
    allOtherHazardousMaterials: {
      domestic: { phoneNumber: "" },
      international: { phoneNumber: "" },
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
      unit: "lbs",
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
      type: undefined,
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
    popIsValid: false,
    usesDotCylinderMarking: false,
    usesPopMarking: false,
  },
  shipper: {
    name: "",
    movementType: "",
    worldwideMobility: false,
    address: {
      shipperLocation: "60th AMW Travis AFB",
      shipperStreet: "400 Brennan Circle",
      shipperCity: "Travis AFB",
      shipperState: "CA",
      selectedShipperCountry: "United States of America",
      shipperZipcode: "94535",
    },
    phoneNumber: {
      type: "Commercial",
      dsnNumber: "",
      format: "Domestic",
      number: "707-424-1234",
    },
  },
  consignee: {
    movementType: "",
    worldwideMobility: false,
    address: {
      consigneeDodaac: "W8Q6AA",
      consigneeStreet: "Ramstein Air Base",
      consigneeCity: "Ramstein-Miesenbach",
      consigneeState: "",
      selectedConsigneeCountry: "Germany",
      consigneeZipcode: "66877",
    },
    phoneNumber: {
      type: "DSN",
      dsnNumber: "480-1234",
      format: "",
      number: "",
    },
  },
  airWaybillNo: "",
  pagination: {
    currentPage: 1,
    totalPages: 1,
  },
  tcn: "",
  optionalBlock: {},
  specialApprovalDocument: {
    approvalTransportationMode: "",
  },
  airportOfDeparture: {
    portOfEmbarkation: "",
    geographicalLocation: "",
  },
  airportOfDestination: {
    geographicalLocation: "",
  },
  technicalName: "",
  mixtureTechnicalNames: [],
  isWaste: false,
  emptyUncleaned: false,
  residueLastContained: false,
  source: "",
  quantityAndTypeOfPacking: {},
  packagingInstructions: {},
  authorization: {},
  additionalHandlingInformation: {},
  nameOfSignatory: "",
  activeStep: 0,
  activeSubstep: null,
  completedSubsteps: [],
  Date: "",
  signature: "",
  absorbentStepRequired: false,
  additionalHandlingInfo: {
    accessorialHazmat: [],
    notes: [],
  },
  packagingWizardStep: 0,
  packagingMethod: "",
};
