import { Rule } from 'json-rules-engine';

export type NoteConditionPair = {
  hazmatObjectPair: HazmatPairBeforeLookup;
  noteCondition: 'note1' | 'note4' | 'note5' | 'note6' | 'note8' | 'note9' | 'note11' | 'note12';
  noteContent: string;
  status: 'compatible' | 'incompatible' | 'segregation';
};

export type CheckCompatibleHazmatOutput = {
  hazmatCompatibilityKeys: HazmatCompatibilityKey[][];
  segregatedHazmatMaterials: SegregatedHazmatMaterial[];
  noteConditionPairs: NoteConditionPair[];
};

export const COMPATIBILITY_GROUPS = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'J',
  'K',
  'L',
  'N',
  'S',
  'N/A',
] as const;

export const compatibilityMap: Record<
  // typeof COMPATIBILITY_GROUPS[number],
  Exclude<typeof COMPATIBILITY_GROUPS[number], 'N/A'>,
  typeof COMPATIBILITY_GROUPS[number][]
> = {
  A: ['A'],
  B: ['B', 'S'],
  C: ['C', 'D', 'E', 'N', 'S'],
  D: ['C', 'D', 'E', 'N', 'S'],
  E: ['C', 'D', 'E', 'N', 'S'],
  F: ['F', 'S'],
  G: ['G', 'S'],
  H: ['H', 'S'],
  J: ['J', 'S'],
  K: ['K', 'S'],
  L: [],
  N: ['C', 'D', 'E', 'N', 'S'],
  S: ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'N', 'S'],
};

export type HazmatCompatibilityKey = {
  compatibilityGroup: typeof COMPATIBILITY_GROUPS[number];
  hazardClassDivisionNumber: string;
  properShippingName: string;
  unid: string;
  numericSpecialProvision?: string;
  packingGroup: string;
};

export type CheckHazmatCompatibilityInput = {
  compatibilityGroup: string;
  hazardClassDivisionNumber: string;
  properShippingName: string;
  unid: string;
};

export type SegregatedHazmatMaterial = {
  hazmatObjectPair: HazmatPairBeforeLookup;
  segregationDescription: string;
  noteCondition?: 'note1' | 'note4' | 'note5' | 'note6' | 'note8' | 'note9' | 'note11' | 'note12' | null;
};

export type HazmatCompatibilityKeyLookup = {
  compatibilityGroup: string;
  hazardClassDivisionNumber: string;
  properShippingName: string;
  unid: string;
  numericSpecialProvision: string;
  additionalInformation?: string;
};

export type HazmatPair = [
  HazmatCompatibilityKeyLookup,
  HazmatCompatibilityKeyLookup,
];

export type HazmatPairBeforeLookup = [
  HazmatCompatibilityKey,
  HazmatCompatibilityKey,
];

export interface CheckHazmatPairingsInput {
  hazmatPairs: HazmatPairBeforeLookup[];
  rules: Rule[];
  debug?: boolean;
}

export type DatabaseQueryResults = {
  pair: string;
};

export enum WeightUnit {
  'OZ',
  'LBS',
  'G',
  'KG',
  'TON',
  'TONNE',
  'SHORT_TON',
}

export type UnitOfMeasurement = WeightUnit;

export type RulesEngineResults = {
  errors: string[];
};

export enum HazmatSegregationRequirement {
  NO_RESTRICTIONS = 'No Restrictions',
  EIGHTY_EIGHT_INCHES_OF_SEPARATION = '88 Inches of Separation',
  CANNOT_BE_LOADED = 'Cannot Be Loaded',
}

export enum PackingGroup {
  III = 'III',
  II = 'II',
  I = 'I',
}

export type CompatibilityGroup =
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'E'
  | 'F'
  | 'G'
  | 'H'
  | 'J'
  | 'K'
  | 'L'
  | 'N'
  | 'S'
  | 'N/A';

export type HazmatClassNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type HazmatClassDivisionNumber = 1 | 2 | 3 | 4 | 5 | 6 | 'N/A';

export type ID = {
  id: string;
};

export interface Shipment {
  uuid: ID;
  tcn: string;
  hazmat: ShipmentHazmat;
  nomenclature?: string; // optional, mobility shipment only
}

export type ShipmentHazmat = {
  hazardClass: HazardClass; // Configuration
  hazardousMaterial: HazardousMaterial; // Actual measurements from deploying units
  secondaryHazardClasses?: [HazardClass]; // mobility shipment only
  secondaryHazardousMaterials?: [HazardousMaterial]; // mobility shipment only
};

export type HazardClass = {
  classDivisionNumber: string; // concatenation of class and division as a string value; Unique; index; primary key
  class: HazmatClassNumber; // number 1-9
  division?: HazmatClassDivisionNumber; // nullable 1-6
  subDivision?: string; // nullable, ask marc
  compatibilityGroup: CompatibilityGroup; // a single letter; only for explosives
  hazmatSegregationRequirement: HazmatSegregationRequirement; // how all classes work
};

export type HazardousMaterial = {
  uuid: ID;
  unid: string; // United Nations or ID number; semi-unique; some values repeat
  properShippingNames: [ProperShippingName]; // description of hazmat
  technicalName?: string;
  hazardClasses: [HazardClass]; // must have at least Hazard Class
  subsidiaryRisks?: [HazardClass]; // can have 0 or more Hazard Classes; always associated with the UN/ID
  pgSpecialProvisions: [PGSpecialProvision]; // alphanumeric corresponding to hazmat table; 5 total; P5 default; AKA "P" Code
  netExplosiveWeight: { unitOfMeasure: string; amount: number };
  quantityOfHazard: HazardQuantity; // move to increment
};

export type HazardQuantity = {
  unitOfMeasure: string; // create specific enum (metric system of measurement)
  amount: number;
};

export type ProperShippingName = {
  uuid: ID;
  name: string;
  material?: HazardousMaterial; // Back reference to hazardous material
};

export type PGSpecialProvision = {
  uuid: ID;
  packingGroup: PackingGroup;
  specialProvisions: [SpecialProvision];
  packagingParagraph: string;
};

// primary focus "P" Codes
export type SpecialProvision = {
  provision: string; // Including P Codes; unique; index; primary key
  definition: string;
};
