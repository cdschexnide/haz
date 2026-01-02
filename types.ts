import { PackagingTypeCategories } from "./src/utils/getPackagingOptions";

export interface Shipment {
  tcn: string;
  weight?: number;
  portOfEmbarkationICAO?: string;
  portOfEmbarkationAPC: string;
  portOfDebarkationICAO?: string;
  portOfDebarkationAPC: string;
  netExplosiveWeight?: number;
  hazardousMaterial: HazardousMaterial;
  signatory: string;
  inspector?: string;
}

export type HazardousMaterialItem = {
  isFixed: string; // "+""
  isDomesticShipment: boolean; // "D"
  isTechnicalNameRequired: boolean; // "Star"
  unid: string;
  properShippingName: string;
  details?: string;
  hazclassDiv: string; // object? uuid ref to hazmat service?
  subsidiaryRisk: string;
  packingGroup: string;
  specialProvision: string;
  packagingParagraph: string;
  physicalState?: PhysicalState;
  flashPoint?: {
    fahrenheit: number;
    celsius: number;
  };
};

export interface HazardousMaterial {
  unid: String;
  properShippingNames: ProperShippingName[];
  /*  isProperShippingNameFixed fixes the proper shipping name, hazard class, and packing group for that entry - 
  without regard to whether the material meets the definition of that class or packing group,
  or meets any other hazard class definition. */
  isProperShippingNameFixed?: boolean;
  isTechnicalNameRequired?: boolean;
  isDomesticOnly?: boolean;
}

export interface ProperShippingName {
  name: string;
  hazardousSelfReactiveMaterials?: HazardousSelfReactiveMaterial[];
  additionalInformation?: string;
  hazardClass: HazardClass;
  /* isSamplesExplosive denotes UN0190 with undefined hazard class that user must specify.
  Use class/division of sample. */
  isSamplesExplosive?: boolean;
  /* can have 0 or more Hazard Classes; always associated with the UN/ID */
  subsidiaryRisks?: HazardClass[];
  /* alphanumeric corresponding to hazmat table; 5 total; P5 default; AKA "P" Code */
  pgSpecialProvisions?: PGSpecialProvision[];
}

export interface HazardClass {
  /* concatenation of class and division as a string value */
  classDivisionNumber: string;
  class: number; // number 1-9
  division: number | null; // nullable 1-6
  compatibilityGroup: string | null; // a single letter; only for explosives
  hazmatSegregationRequirement?: HazmatSegregationRequirement; // how all classes work (WIP-service to be develop later)
}

export interface HazardousSelfReactiveMaterial {
  uuid: string;
  technicalName: string;
  concentrationPercent: string; // should Concentration (%) and Concentration (mass %) be combined??!
  concentrationMassPercent: string; // should Concentration (%) and Concentration (mass %) be combined??!
  diluentAMassPercent: string;
  diluentBMassPercent: string;
  diluentIMassPercent: string;
  waterMassPercent: string;
  packagingParagraph: string;
  temperatureControl: string;
  temperatureEmergency: string;
  hazardousMaterial: HazardousMaterial;
}

export enum PackingGroup {
  I = "I",
  II = "II",
  III = "III",
}

export interface PGSpecialProvision {
  uuid: string;
  // Packing Group indicates the degree of danger presented by the hazardous material
  packingGroup: PackingGroup;
  specialProvisions: SpecialProvision[];
  packagingParagraph: string;
}

// primary focus "P" Codes
export interface SpecialProvision {
  provision: string; // Including P Codes; unique; index; primary key
  definition: string;
}

enum HazmatSegregationRequirement {
  BLANK = "No Restrictions",
  ZERO = "88 Inches of Separation",
  X = "Cannot Be Loaded",
}

export enum PhysicalState {
  GAS = "GAS",
  LIQUID = "LIQUID",
  SOLID = "SOLID",
}

export enum VehicleFuelType {
  NaturalGas = "Natural Gas",
  Propane = "Propane",
  Gasoline = "Diesel",
  Ethanol = "Ethanol",
  Other = "Other",
}

export interface UN3166Tank {
  mode: "SpecificQuantity" | "TankSize";
  amount?: string;
  tankSize?: string;
  tankFullness?: string;
}

// export interface UN3166Tank {
//   amount?: string;
//   tankSize?: string;
//   tankFullness?: string;
//   unit: "liters" | "gallons";
// }

export interface UN3166Details {
  vehicleNomenclature: string;
  quantity: string | null;
  // fuelType: VehicleFuelType | null;
  fuel: HazardousMaterialItem | null;
  fuelEntryMode: "SpecificQuantity" | "TankSize" | "MultipleTanks" | null;
  amount?: string;
  tankSize?: string;
  tankFullness?: string;
  unit: "liters" | "gallons";
  tankCount?: number;
  multiTanks?: UN3166Tank[];
  accessorialHazards: {
    batteries?: {
      accessorialHazardousMaterialIdentification: HazardousMaterialItem | null;
      quantity: string;
    } | null;
    fireExtinguishers?: {
      accessorialHazardousMaterialIdentification: HazardousMaterialItem | null;
      quantity: string;
    };
    starterFluid?: {
      accessorialHazardousMaterialIdentification: HazardousMaterialItem | null;
      volume: {
        liters: number | null;
        gallons: number | null;
      };
    } | null;
    other?: AccessorialHazard[];
  };
}

export interface HazardousMaterialContext {
  hazardousMaterial: HazardousMaterialItem | null;
  dotCylinderSpecification?: string;
  physicalState?: PhysicalState;
  packagingParameters?: PackagingParameters;
  categoryOfAirlift?: AirliftCategory;
  hazardousMaterialQuantityMeasurement?: HazardousMaterialQuantityMeasurement;
  operationalDetails?: OperationalDetails;
  additionalHazardousMaterials?: HazardousMaterialItem[];
  isChapterThreeAuthorized?: boolean;
  isCombinationPackaging?: boolean; // Added property to check packaging type
  innerPackagingMaterial?: "glass" | "earthenware" | "plastic" | "metal"; // Added material type check
}

export interface PackagingParameters {
  liquidQuantityInLiters?: number;
  transportabilityParameters?: TransportabilityParameters;
}

export enum AirliftCategory {
  MILITARY = "Military",
  CONTRACT = "Contract",
  COMMERCIAL = "Commercial",
}

export interface HazardousMaterialQuantityMeasurement {
  pounds: number;
  kilograms: number;
}

export interface OperationalDetails {
  chapter3_4_1OperationDetails?: Chapter3_4_1OperationDetails;
  chapter3_4_2OperationDetails?: Chapter3_4_2OperationDetails;
}

export interface Chapter3_4_1OperationDetails {
  isAirdrop?: boolean; // on an airdrop parachute platform
  isStoredInApprovedRacks?: boolean; // stored in approved racks or containers
  isSecuredInFreightContainer?: boolean; // secured/restrained in freight containers
  cargoType?: string; // (e.g., Personnel, Vehicles, Explosives)
  fuelLevelPercentage?: number;
}

export interface Chapter3_4_2OperationDetails {
  usesFlammableGas?: boolean; // does engine/machinery use flammable gas
  isPurged?: boolean; // has engine/machinery been purged
  isSecuredInStrongPackaging?: boolean; // is secured in strong, rigid outer packaging
  isCompressedGasFueled?: boolean; // does engine/machinery use compressed gas
  isFuelCellPowered?: boolean; // is engine/machinery powered by fuel cells
  hasAccessorialHazards?: boolean; // are accessorial hazards are present (e.g., fire extinguishers)
  hasNonSpillableBattery?: boolean; // is battery non-spillable
  isLoadedInFreightContainer?: boolean; // is engine/machinery loaded in a freight container
  accessorialHazards?: HazardousMaterialItem[];
}

export type TransportabilityParameters = {
  /* A3.1.2.1.1. Temperature changes (-40 to 65.5 degrees C [-40 to +150 degrees F]) */
  minTemperature: {
    fahrenheit: number;
    celsius: number;
  };
  maxTemperature: {
    fahrenheit: number;
    celsius: number;
  };
  /* A3.1.2.1.2. Pressure changes due to altitude changes (sea level to 3.7 km (12,000 feet)) */
  maxAltitude: {
    kilometers: number;
    feet: number;
  };
  /* A3.1.2.1.3. Pressure changes due to explosive decompression from 3.7 to 15.24 km (12,000 to 50,000 feet). */
  explosiveDecompressionRange: {
    minimum: {
      kilometers: number;
      feet: number;
    };
    maximum: {
      kilometers: number;
      feet: number;
    };
  };
  /* A3.1.2.2. Do not fill a UN specification packaging to a gross mass greater than the
authorized gross mass marked on the packaging. */
  grossMassOfPackage?: number;
  authorizedGrossMassBasedOnPackageMarking?: number;
};

export interface DocumentNode {
  id: string;
  parentId: string;
  title?: string;
  bodyText?: string;
  childNodeIds?: string[];
}

export interface ShipperAddress {
  shipperLocation: string | null;
  shipperStreet: string | null;
  shipperCity: string | null;
  shipperState: string | null;
  selectedShipperCountry: string | null;
  shipperZipcode: string | null;
}

export interface ConsigneeAddress {
  consigneeDodaac: string | null;
  consigneeStreet: string | null;
  consigneeCity: string | null;
  consigneeState: string | null;
  selectedConsigneeCountry: string | null;
  consigneeZipcode: string | null;
}

export interface Preparer {
  preparerName: string | null;
  preparerRank: string | null;
  preparerTitle: string | null;
  certificationPlace: string | null;
  certificationDate: string | null;
  signature: string | null;
}

export interface Inspector {
  inspectorName: string;
  inspectorRank: string | null;
  inspectorTitle: string;
}

export enum WORLDWIDEMOBILITY {
  WWM = "WWM",
}

export enum QuantityUnit {
  LBS = "lbs",
  KG = "kg",
}

type EmergencyPhoneNumber = {
  commercial: string;
  dsn?: string;
};

type EmergencyContactEntry = {
  name: string;
  phoneNumber: EmergencyPhoneNumber;
};

export type EmergencyPhoneNumberMap = {
  class1Explosives: EmergencyContactEntry[];
  class7RadioactiveMaterial: EmergencyContactEntry[];
  allOtherHazardousMaterials: {
    domestic: {
      phoneNumber: string;
    };
    international: {
      phoneNumber: string;
    };
  };
};

export const emergencyPhoneNumberMap: EmergencyPhoneNumberMap = {
  class1Explosives: [
    {
      name: "The Army Operations Center",
      phoneNumber: {
        commercial: "+1 (703) 695-4695/4696 (COLLECT)",
        dsn: "312-225-4695/4696",
      },
    },
  ],
  class7RadioactiveMaterial: [
    {
      name: "Army",
      phoneNumber: {
        commercial: "+1 (703) 695-4695/4696 (COLLECT)",
        dsn: "(312) 225-4695/4696",
      },
    },
    {
      name: "Air Force",
      phoneNumber: {
        commercial: "+1 (202) 767-4011 (COLLECT)",
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
        commercial: "+1 (717) 770-5283 (COLLECT)",
      },
    },
  ],
  allOtherHazardousMaterials: {
    domestic: {
      phoneNumber: "1-800-851-8061 (toll free)",
    },
    international: {
      phoneNumber: "+1-804-279-3131 (collect)",
    },
  },
};

export type AccessorialHazard = {
  hazardousMaterial: HazardousMaterialItem;
  quantity?: string | null;
  mass?: {
    kg: number;
    lbs: number;
  };
  volume?: {
    liters: number;
    gallons: number;
  };
};

export type Pre1015Question = {
  id: string;
  text: string;
  value: boolean | null;
};

export enum Validation {
  VALID,
  INVALID,
  NOT_APPLICABLE,
}

interface ValidationError {
  [key: string]: string;
}

interface ValidationRule {
  criteria: string;
  isValid: boolean;
  error?: ValidationError;
}

interface BaseWorkflowField {
  id: string;
  description?: string;
  validationRules?: ValidationRule[];
  currentValue: Validation | number | null;
}

export interface WorkflowFieldContext extends BaseWorkflowField {
  identifier: string;
  label: string;
  isValid: boolean;
  childFields: WorkflowFieldContext[];
  discrepancyText?: string;
  isOptional?: boolean;
  hasBeenFailed?: boolean;
  inspectionFailedAt?: Date;
  failureCorrectedAt?: Date;
}

export type WorkflowFieldEvent =
  | { type: "SET_ANSWER_VALID" }
  | { type: "SET_ANSWER_INVALID" }
  | { type: "SET_CHILD_ANSWER_VALID"; value: string }
  | { type: "SET_CHILD_ANSWER_INVALID"; value: string }
  | { type: "SET_ANSWER_NOT_APPLICABLE" }
  | { type: "SET_CHILD_ANSWER_NOT_APPLICABLE"; value: string };

export enum Form1015Subsection {
  SDDG = "SDDG",
  PACKAGING = "Packaging",
  LABELS_AND_MARKING = "Labels and Marking",
  VEHICLES_AND_EQUIPMENT = "Vehicles and Equipment",
}

export enum SatUnsatNa {
  UNSAT = "✕",
  SAT = "✓",
  FRUSTRATED_SAT = "ⓧ",
  NA = "N/A",
  FRUSTRATED = "FRUSTRATED",
}

export type WalkthroughQuestion = {
  id: string;
  label: string;
  currentValue: number | null;
  isFrustrated?: boolean;
  isOptional?: boolean;
};

export interface ListQuestion {
  identifier: string;
  label: string;
  currentValue: number | null;
  isFrustrated?: boolean;
  isOptional?: boolean;
  walkthroughQuestions: WalkthroughQuestion[];
}

export const unitOptions = {
  [PhysicalState.SOLID]: ["kg", "lbs"],
  [PhysicalState.LIQUID]: ["liters", "gallons"],
};

export interface DocumentNode {
  id: string;
  parentId: string;
  title?: string;
  bodyText?: string;
  childNodeIds?: string[];
}

export interface AvailablePackagingTypes {
  label: string;
  key: PackagingTypeCategories;
  available: boolean;
}

export type MagnetizedMaterialData = {
  packagingNumber?: number;
  packagingType: string;
  device1Reading: string;
  device2Reading?: string;
  device7ftReading?: string;
  shieldingMeetsRequirement: boolean;
  bracingNotes?: string;
  handlingInstructions?: string;
  containerWeight?: number;
  containerSize?: number;
};

export type BatteryType = "lithium_metal" | "lithium_metal_equipment";

export type PackagingMethod = "combination" | "single" | "overpack";
export type MassUnit = "kg" | "lb";

export interface SafetyFeatures {
  shortCircuitProtection: boolean;
  safetyVent: boolean;
  reverseCurrentProtection: boolean;
}

export interface Mass {
  value: number;
  unit: MassUnit;
}

export interface LithiumBatteryData {
  batteryType: BatteryType;
  packagingMethod: PackagingMethod;
  outerPackagingType: string;
  innerPackagingDescription: string;
  quantityOfBatteries: number;
  totalWeight: Mass;
  wattHourRating: number;
  lithiumContentInGrams: number;
  safetyFeatures: SafetyFeatures;
  meetsUN38Requirements: boolean;
  isDefectiveOrDamaged: boolean;

  specialInstructions: string;
  handlingInstructions: string;
}

export interface LithiumBatteryExceptionParameters {
  wattHourRating: number;
  quantityIn_Kgs: number;
  lithiumContentInGrams: number;
  numberOfLithiumBatteries: number;
}

export interface ExtractedDataForVerification {
  shipper: string;
  consignee: string;
  airwayBill: string;
  pagination: string;
  shippersReferenceNumber: string;
  inspectionActivity: string;
  aircraftType: "PASSENGER AND CARGO AIRCRAFT" | "CARGO AIRCRAFT ONLY" | string;
  airportOfDeparture: string;
  airportOfDestination: string;
  shipmentType: "RADIOACTIVE" | "NON-RADIOACTIVE" | string;
  hazardousMaterials: HazardousMaterialItem[];
  additionalHandlingInfo: string;
  emergencyTelephoneNumber: string;
  nameOfSignatory: string;
  placeAndDate: string;
  signature: string;
}

// Attachment 19 - Excepted Quantities
export interface ExceptedQuantityData {
  eligible: boolean;
  exclusionReason?: string; // Which A19.2.1.x failed
  isInKit: boolean; // Chemical/first-aid kit exception
  numberOfInnerPackages: number;
  quantityPerInnerPackage: {
    value: number;
    unit: "mL" | "g";
  };
  totalOuterQuantity: {
    value: number;
    unit: "mL" | "g" | "L" | "kg";
  };
  exceedsLimits: boolean;
  limits: {
    maxInner: { value: number; unit: string };
    maxOuter: { value: number; unit: string };
  };
  mixedMaterials?: Array<{
    unid: string;
    quantity: { value: number; unit: string };
  }>;
  qValue?: number; // For mixing formula: n1/M1 + n2/M2 + ... ≤ 1.0
}

// Attachment 19 - Limited Quantities
export interface LimitedQuantityData {
  eligible: boolean;
  exclusionReason?: string; // Which A19.3.1.x failed
  permissionReason?: string; // Which A19.3.2.x passed
  quantityPerInnerPackage: {
    value: number;
    unit: string;
  };
  totalPerPackage: {
    value: number;
    unit: string;
  };
  grossWeight: {
    value: number;
    unit: "kg" | "lbs";
  };
  exceedsLimits: boolean;
  limits: {
    maxInner: { value: number; unit: string };
    maxPerPackage: { value: number; unit: string };
    maxGrossWeight: { value: 30; unit: "kg" };
  };
}
