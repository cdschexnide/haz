// Type definitions for the packaging structure
interface Material {
  description: string;
  maxQuantity?: string;
  thickness?: string | { minimum?: { inches: number; centimeters: number } };
}

interface ThicknessValue {
  minimum: {
    inches: number;
    centimeters: number;
  };
}

// Union type for container specifications
type ContainerSpecification = {
  item?: string;
  items?: string[];
  containerType?: string;
  shippingNotes?: string[];
  innerPackaging?: {
    description: string;
  };
  configuration?: string;
  notes?: string[];
  maxGrossWeight?: WeightUnits;
};

// Type for the entire containerSpecific array
export type ContainerSpecificArray = ContainerSpecification[];

type Configuration =
  | string
  | {
      itemsPerContainer: number;
      palletization?: string;
      overwrap?: Overwrap;
      pallet?: {
        border?: {
          height?: { exact: { feet: number; meters: number } };
          thickness?: { exact: { inches: number; centimeters: number } };
          material?: string;
        };
        box?: string;
        liner?: string;
      };
      maxContainersPerBox?: number;
      count?: number;
      outerContainer?: string;
      lining?: string;
    };

interface DimensionsWithThickness {
  thickness: ThicknessValue;
}

interface Overwrap {
  material: string;
  dimensions: DimensionsWithThickness;
}

interface DimensionUnits {
  inches: number;
  centimeters: number;
}

interface LengthMeasurement {
  minimum?: DimensionUnits;
  maximum?: DimensionUnits;
  exact?: DimensionUnits;
}

interface Dimension {
  length?: string | LengthMeasurement;
  diameter?: string | LengthMeasurement;
  width?: string | LengthMeasurement;
  height?: string | LengthMeasurement;
  thickness?: string | LengthMeasurement;
  minLengthInches?: number;
}

interface Dimensions {
  diameter?: LengthMeasurement;
  length?: LengthMeasurement;
  width?: LengthMeasurement;
  height?: LengthMeasurement;
  thickness?: LengthMeasurement;
  maxDiameter?: DimensionUnits;
  maxLength?: DimensionUnits;
  minDiameter?: DimensionUnits;
  minLength?: DimensionUnits;
}

export interface WeightUnits {
  lbs: number;
  kg: number;
}

interface MaximumWeightLimits {
  [key: string]: WeightUnits;
}

interface NetWeight {
  minimum: WeightUnits;
  maximum: WeightUnits;
}

interface Weight {
  netWeightLbs?: number | { min?: number; max?: number };
  maxGrossWeight?: WeightUnits | Record<string, WeightUnits>;
  maxGrossWeightLbs?: number | Record<string, number>;
  maxNetWeight?: WeightUnits;
  maxNetWeightLbs?: number;
  maxNetWeightPerPackage?: WeightUnits;
  maxNetWeightPerPackageLbs?: number;
  maxNetWeightPerInnerContainer?: WeightUnits;
  maxNetWeightPerInnerContainer_lbs?: number;
  maxWeight?: WeightUnits;
  maxWeightLbs?: number;
}

interface HandholeDimensions {
  width: { maximum: DimensionUnits };
  height: { maximum: DimensionUnits };
  maxWidth?: { inches: number; centimeters: number };
  maxLength?: { inches: number; centimeters: number };
  minDistanceFromTop?: { inches: number; centimeters: number };
}

interface TestParameters {
  weight: WeightUnits;
  dropHeight: { inches: number; centimeters: number };
  pelletDimensions: {
    thickness: { inches: number; centimeters: number };
    width: { inches: number; centimeters: number };
  };
}

interface CushioningThickness {
  minimum: { inches: number; centimeters: number };
}

interface PelletDiameter {
  minimum?: { inches: number; centimeters: number };
  maximum?: { inches: number; centimeters: number };
}

interface ExplosiveCompositionDensity {
  maximum: {
    grainsPerCubicInch: number;
    grainsPerCubicCentimeter: number;
  };
}

interface MoistureRequirement {
  description: string;
  ratio: string;
  water: WeightUnits;
  dryMaterial: WeightUnits;
}

interface BagThickness {
  inner: { inches: number; centimeters: number };
  outer: { inches: number; centimeters: number };
}

interface SawdustCushioning {
  thickness: { inches: number; centimeters: number };
}

interface WeightLimit {
  maximum: WeightUnits;
  note?: string;
}

interface WeightLimits {
  [key: string]: WeightLimit;
}

interface DropTestHeight {
  feet: number;
  meters: number;
}

interface MinGrainDimensions {
  diameter: { minimum: { inches: number; centimeters: number } };
  length: { minimum: { inches: number; centimeters: number } };
}

interface AnnulusWidth {
  inches: number;
  centimeters: number;
}

interface MaxQuantity {
  grenades: number;
  functioningDevices: number;
}

interface ContentDetails {
  dispensers: number;
  modules: number;
  bomblets: number;
  bombletContents: string;
}

interface InnerContainer {
  type: string;
  material?: string | string[];
  capacity?: string | WeightUnits;
  maxQuantity?: number;
  dimensions?: Dimensions;
  closure?: string;
  notes?: string[];
  requirements?: string[];
  description?: string;
  maxNetWeight?: WeightUnits;
  maxNetWeightLbs?: number;
  materials?: string[];
  thickness?: string | { minimum?: { inches: number; centimeters: number } };
  options?: any[];
  details?: string[];
  maxWeight?: WeightUnits;
  maxWeightLbs?: number;
  diameter?: string;
  length?: string;
}

interface MidLevelPackaging {
  type: string;
  capacity: string;
}

interface OuterPackaging {
  type: string;
  capacity?: string;
  containerType?: string;
  containerTypes?: string[];
  maxQuantity?: number;
  maxGrossWeight?:
    | WeightUnits
    | { wooden: WeightUnits; fiberboard: WeightUnits };
}

interface InnerPackagingOption {
  type: string;
  maxQuantity?: number;
  midLevelPackaging?: MidLevelPackaging;
  outerPackaging?: OuterPackaging;
  safetyRequirements?: string[];
  maxGrossWeight?: WeightUnits;
  maxGrossWeightLbs?: number;
  capacity?: WeightUnits;
  thickness?: { minimum: { inches: number; centimeters: number } };
  details?: string[];
}

interface OuterContainer {
  type: string;
  spec?: string | string[];
  materials?: string[];
  lining?: string;
  closure?: string;
  maxGrossWeight?: WeightUnits | Record<string, WeightUnits>;
  maxGrossWeightLbs?: number | Record<string, number>;
  maxNetWeight?: WeightUnits;
  maxNetWeightLbs?: number;
  requirements?: string[];
  description?: string;
  innerContainers?: InnerContainer[];
  features?: string[];
  approvedBy?: string | string[];
  notes?: string[];
  handholeDimensions?: HandholeDimensions;
  handholes?: HandholeDimensions;
  testParameters?: TestParameters;
  cushioningThickness?: CushioningThickness;
  pelletDiameter?: PelletDiameter;
  bagCapacity?: WeightUnits;
  maxQuantity?: MaxQuantity;
  contentDetails?: ContentDetails;
  marking?: string;
  model?: string;
  contents?: string | any[];
  configuration?: Configuration;
  containerLimit?: string;
  applicableTo?: string | string[];
  exceptions?: { item: string; maxGrossWeight: WeightUnits };
  optionalFeatures?: string[];
  for?: string;
  safetyDesign?: string;
  limit?: string;
  innerPackaging?: any;
  specs?: { wooden: string[]; fiberboard: string[] };
  restrictions?: string[];
  dimensions?: Dimensions;
  containedItem?: string;
  maxExplosivePerRivet?: {
    mg?: number;
  };
  unitContainers?: string[];
}

interface PackagingOption {
  type: string | string[];
  spec?: string | string[];
  materials?: string[];
  description?: string;
  innerContainers?: InnerContainer[];
  innerPackaging?: any;
  maxGrossWeight?: WeightUnits | Record<string, WeightUnits>;
  maxGrossWeightLbs?: number | Record<string, number>;
  maxNetWeight?: WeightUnits;
  maxNetWeightLbs?: number;
  netWeightRestrictions?: NetWeight;
  requirements?: string[];
  restrictions?: string[];
  notes?: string[];
  lining?: string;
  containerType?: string;
  for?: string;
  performanceRequirement?: string;
  substitutions?: string[];
  dimensions?: Dimensions;
  exceptions?: any;
  applicableTo?: string;
  features?: string[];
  construction?: string[];
  maxOuterBoxCount?: number;
  handholeDimensions?: HandholeDimensions;
  outerPackaging?: OuterPackaging;
  details?: string[];
  capacity?: WeightUnits;
  containerLimit?: string;
  mode?: string;
  packagingModes?: { mode: string; requirements?: string[] }[];
  contents?: string;
  dropTestHeight?: DropTestHeight;
  examples?: string[];
  testParameters?: TestParameters;
  limits?: {
    maxDiameter?: DimensionUnits;
    maxLength?: DimensionUnits;
    maxGrossWeight?: WeightUnits;
    maxQuarterGrossCartons?: number;
    maxTotalTorpedoes?: string;
    // maxGrossWeight?: { fiberboard: WeightUnits; wooden: WeightUnits };
  };
  maxQuantity?: MaxQuantity;
  model?: string;
  safetyDesign?: string;
  contentDetails?: ContentDetails;
  marking?: string;
  sawdustCushioning?: SawdustCushioning;
  bagThickness?: BagThickness;
  weightLimits?: WeightLimits | { maxDryWeightPerDrum: WeightUnits };
  cushioning?:
    | string
    | {
        description: string;
        minThickness: { inches: number; centimeters: number };
      };
  minGrainDimensions?: MinGrainDimensions;
  annulusWidth?: AnnulusWidth;
  approvedBy?: string | string[];
  maxExplosivePerRivet?: {
    mg?: number;
  };
  unitContainers?: string[];
}

interface MaterialReference {
  materials: string[];
  requirements: string[];
}

interface SeparationDistance {
  minimum: DimensionUnits;
  description: string;
}

interface BlastingCapsOrDelayConnectors {
  description: string;
  cushioning: string;
  intermediatePackaging: MaterialReference;
  outerSeparation: SeparationDistance;
}

interface SpecialProvision {
  description: string;
  maxQuantity: { oz: number; g: number };
  packaging: string;
  applicableMaterials: string[];
}

interface DeviceLimits {
  description: string;
  maxPerInner: number;
  maxPerOuter: number;
  maxGrossWeight?: WeightUnits;
  notes?: string[];
}

interface AllowedWithItems {
  allowedWith: string[];
  maxWeightPerContainer: WeightUnits | string;
  constructionNotes: string[];
}

export interface RequirementsObject {
  blastingCapsOrDelayConnectors?: BlastingCapsOrDelayConnectors;
  [key: string]: any;
}

export interface ExceptionsWithAppliesTo {
  appliesTo: string[];
  notes: string[];
}

export interface ExceptionWithCondition {
  condition: string;
  packaging: string;
}

export type ExceptionsType =
  | ExceptionsWithAppliesTo
  | ExceptionWithCondition[]
  | string[];

interface ContainerTypeSpecification {
  type: string;
  specs?: string[];
  maxGrossWeight?: WeightUnits;
  applicableTo?: string;
  description?: string;
  requirements?: string[];
  features?: string[];
  model?: string;
  closure?: string;
  minDimension?: DimensionUnits;
  maxNetWeight?: WeightUnits;
}

interface BulkPackaging {
  applicableTo: string;
  type: string;
  requirements: string[];
}

// Update the PackagingInstructions interface
interface PackagingInstructions {
  containerType?: string;
  containerTypes?: string[] | OuterContainer[] | ContainerTypeSpecification[];
  materials?: string[];
  requirements?: string[] | RequirementsObject;
  options?: PackagingOption[];
  general?: Record<string, any> | string[];
  containers?: OuterContainer[];
  weightLimits?:
    | Record<string, WeightUnits>
    | Record<string, { description: string; maxGrossWeight: WeightUnits }>;
  notes?: string[];
  specialProvisions?: string[] | any[];
  outerPackaging?: Record<string, string[]> | any;
  innerPackaging?: Record<string, any>;
  packagingOptions?: PackagingOption[];
  maxGrossWeight?: WeightUnits;
  categories?: any[];
  netWeight?: WeightUnits;
  limits?: Record<string, DeviceLimits>;
  smallArmsPrimersWithAnvils?: { packagingOptions: PackagingOption[] };
  mixedPackagingAllowances?: AllowedWithItems;
  percussionCaps?: { packagingOptions: PackagingOption[] };
  exceptions?: ExceptionsType;
  specialItems?: Record<string, any>;
  generalPackaging?: PackagingOption[];
  compositionLimit?: string;
  explosiveCompositionDensity?: ExplosiveCompositionDensity;
  containerSpecific?: ContainerSpecificArray;
  bulkPackaging?: BulkPackaging;
  applicableTo?: string[];
}

export interface PackagingReference {
  description: string;
  packagingInstructions: PackagingInstructions;
}

// Type for the entire data structure
export type GrandfatheredPackagingReferences = Record<
  string,
  PackagingReference
>;

// Helper function to convert inches to centimeters
function inchesToCm(inches: number): number {
  return Number((inches * 2.54).toFixed(2));
}

// Helper function to convert pounds to kilograms
function lbsToKg(lbs: number): number {
  return Number((lbs * 0.453592).toFixed(2));
}
// The refactored data structure (A27.2. to A27.10.)
export const grandfatheredPackagingReferences: GrandfatheredPackagingReferences =
  {
    // "A27.2.": {
    //   description:
    //     "Ammunition for Cannon (with Empty Projectiles; with Inert Loaded Projectiles; with Solid Projectile; without Projectiles; with Tear Gas Projectiles, Class B Explosives; with Explosives Projectiles; with Gas Projectiles; with Illumination Projectiles; with Incendiary Projectiles; with Smoke Projectiles and with Tear Gas Projectiles, Class A Explosives).",
    //   packagingInstructions: {
    //     containerType: "Strong containers",
    //     materials: ["Wood", "Metal", "Plastic"],
    //     requirements: [
    //       "Plastic containers must be approved by military specifications or drawings.",
    //     ],
    //   },
    // },
    "A27.2.": {
      description:
        "Ammunition for Cannon (with Empty Projectiles; with Inert Loaded Projectiles; with Solid Projectile; without Projectiles; with Tear Gas Projectiles, Class B Explosives; with Explosives Projectiles; with Gas Projectiles; with Illumination Projectiles; with Incendiary Projectiles; with Smoke Projectiles and with Tear Gas Projectiles, Class A Explosives).",
      packagingInstructions: {
        containers: [
          {
            type: "Strong wooden container",
          },
          {
            type: "Strong metal container",
          },
          {
            type: "Strong plastic container",
          },
        ],
      },
    },
    "A27.3.": {
      description:
        "Ammunition for Small Arms with Incendiary Projectiles and Ammunition for Small Arms with Explosives Projectiles.",
      packagingInstructions: {
        containers: [
          {
            type: "Strong wooden container",
            maxGrossWeight: {
              lbs: 175,
              kg: 79.38,
            },
          },
          {
            type: "Strong metal container",
            maxGrossWeight: {
              lbs: 175,
              kg: 79.38,
            },
          },
        ],
      },
    },
    "A27.4.": {
      description: "Black Powder and Low Explosives.",
      packagingInstructions: {
        options: [
          {
            type: "Metal kegs",
            spec: "DOT 1",
            dimensions: {
              length: {
                minimum: {
                  inches: 7,
                  centimeters: 17.78,
                },
              },
            },
            netWeightRestrictions: {
              minimum: {
                lbs: 6.25,
                kg: 2.83,
              },
              maximum: {
                lbs: 150,
                kg: 68.04,
              },
            },
          },
          {
            type: "Wooden Box",
            spec: ["DOT 14", "15A", "16A", "19B"],
            innerContainers: [
              {
                type: "Fiber or metal containers",
                capacity: {
                  lbs: 1.75,
                  kg: 0.79,
                },
              },
              {
                type: "Cotton Bag",
                material: "At least 4-ounce cotton duck",
                capacity: {
                  lbs: 25,
                  kg: 11.34,
                },
              },
            ],
            maxGrossWeight: {
              "DOT 14": {
                lbs: 140,
                kg: 63.5,
              },
              "DOT 15A/16A/19B": {
                lbs: 200,
                kg: 90.72,
              },
            },
          },
          {
            type: "Wooden Box",
            spec: ["DOT 14", "15A", "16A", "19B"],
            innerContainers: [
              {
                type: "Cylindrical fiber cartridge",
                dimensions: {
                  diameter: {
                    maximum: {
                      inches: 5,
                      centimeters: 12.7,
                    },
                  },
                  length: {
                    maximum: {
                      inches: 18,
                      centimeters: 45.72,
                    },
                  },
                  thickness: {
                    minimum: {
                      inches: 0.05,
                      centimeters: 0.13,
                    },
                  },
                },
                description: "Paraffined surface, joints glued or cemented",
              },
              {
                type: "Strong paraffined paper cartridge",
                dimensions: {
                  length: {
                    maximum: {
                      inches: 12,
                      centimeters: 30.48,
                    },
                  },
                },
                notes: ["Only for compressed pellets ≥⅞ inch diameter"],
              },
            ],
            lining:
              "Paraffined paper or waterproofed material without joints or bottom/side openings",
            maxGrossWeight: {
              lbs: 75,
              kg: 34.02,
            },
          },
          {
            type: "Fiberboard Box",
            spec: ["DOT 12H", "23F", "23H"],
            innerContainers: [
              {
                type: "Cylindrical fiber cartridge",
                dimensions: {
                  diameter: {
                    maximum: {
                      inches: 5,
                      centimeters: 12.7,
                    },
                  },
                  length: {
                    maximum: {
                      inches: 18,
                      centimeters: 45.72,
                    },
                  },
                  thickness: {
                    minimum: {
                      inches: 0.05,
                      centimeters: 0.13,
                    },
                  },
                },
                description: "Paraffined surface, joints glued or cemented",
              },
              {
                type: "Strong paraffined paper cartridge",
                dimensions: {
                  length: {
                    maximum: {
                      inches: 12,
                      centimeters: 30.48,
                    },
                  },
                },
                notes: ["Only for compressed pellets ≥⅞ inch diameter"],
              },
            ],
            maxGrossWeight: {
              lbs: 65,
              kg: 29.48,
            },
          },
          {
            type: "Wooden Box",
            spec: ["DOT 14", "15A", "16A", "19B"],
            for: "Black Powder (not low explosive)",
            innerContainers: [
              {
                type: "Cloth or paper bags",
                maxNetWeight: {
                  lbs: 25,
                  kg: 11.34,
                },
              },
            ],
            performanceRequirement:
              "Must withstand 4-foot drop without rupture",
            maxNetWeight: {
              lbs: 50,
              kg: 22.68,
            },
          },
          {
            type: "Fiberboard Box",
            spec: ["DOT 12H", "23F", "23H"],
            innerContainers: [
              {
                type: "Cloth or paper bags",
                maxNetWeight: {
                  lbs: 25,
                  kg: 11.34,
                },
              },
              {
                type: "Polyethylene Bag",
                dimensions: {
                  thickness: {
                    minimum: {
                      inches: 0.004,
                      centimeters: 0.01,
                    },
                  },
                },
                maxNetWeight: {
                  lbs: 50,
                  kg: 22.68,
                },
              },
              {
                type: "Fiber or Metal Container",
                capacity: {
                  lbs: 1,
                  kg: 0.45,
                },
              },
            ],
            performanceRequirement:
              "Must withstand 4-foot drop without rupture",
            substitutions: [
              "Single tube from DOT 23F may replace multiple tubes",
            ],
            maxNetWeight: {
              lbs: 50,
              kg: 22.68,
            },
          },
          {
            type: "Wooden Box",
            spec: ["DOT 14", "15A", "16A", "19B"],
            for: "Black pellet powder primed with electric squib",
            innerContainers: [
              {
                type: "Strong paraffined paper cartridges",
                dimensions: {
                  length: {
                    maximum: {
                      inches: 12,
                      centimeters: 30.48,
                    },
                  },
                },
                notes: ["Only for compressed pellets ≥⅞ inch diameter"],
              },
            ],
            notes: ["Squib wires must be effectively short-circuited"],
            maxGrossWeight: {
              lbs: 65,
              kg: 29.48,
            },
          },
          {
            type: "Wooden Box",
            spec: ["DOT 14", "15A", "16A", "19B"],
            for: "Low explosives (not black powder)",
            innerContainers: [
              {
                type: "Strong paper bags",
                capacity: {
                  lbs: 25,
                  kg: 11.34,
                },
              },
            ],
            maxGrossWeight: {
              "DOT 14": {
                lbs: 140,
                kg: 63.5,
              },
              "DOT 15A/16A": {
                lbs: 200,
                kg: 90.72,
              },
            },
          },
          {
            type: "Fiberboard Box",
            spec: ["DOT 12H", "23F", "23H"],
            innerContainers: [
              {
                type: "Strong paper bags",
                capacity: {
                  lbs: 25,
                  kg: 11.34,
                },
              },
            ],
            maxGrossWeight: {
              lbs: 65,
              kg: 29.48,
            },
          },
          {
            type: "Wooden Box",
            spec: ["DOT 15A", "19B"],
            lining: "Paper, DOT 2L",
            notes: ["For rods or cylinders ≥5/8 inch diameter"],
          },
        ],
      },
    },
    "A27.5.": {
      description: "Detonators, Class A and Class C Explosives",
      packagingInstructions: {
        general: {
          requirements: [
            "Fit detonators snugly in strong inside packaging and snugly overpack in outer packagings specified in A27.5.7. and A27.5.8.",
          ],
        },
        limits: {
          devicesUnder10g: {
            description:
              "Devices containing ≤10 grams of explosives (excluding ignition and delay charges)",
            maxPerInner: 50,
            maxPerOuter: 500,
            maxGrossWeight: {
              lbs: 150,
              kg: 68.04,
            },
            notes: [
              "Or the gross weight permitted by the specification of the outer packaging, whichever is less.",
            ],
          },
          devicesUnder3g: {
            description:
              "Devices containing ≤3 grams of explosives (excluding ignition and delay charges)",
            maxPerInner: 110,
            maxPerOuter: 5000,
          },
          plasticSheathedDevices: {
            description:
              "Electric blasting caps, delay connectors in plastic sheaths, or blasting caps with empty plastic tubing, each containing ≤3 grams of explosives",
            maxPerInner: 100,
            maxPerOuter: 1000,
          },
        },
        requirements: {
          blastingCapsOrDelayConnectors: {
            description:
              "Detonators that are blasting caps (including percussion activated) or delay connectors in metal tubes",
            cushioning: "Cover open ends of devices with cushioning material",
            intermediatePackaging: {
              materials: ["Paper", "Plastic", "Pasteboard"],
              requirements: ["Must fit snugly"],
            },
            outerSeparation: {
              minimum: {
                inches: 1,
                centimeters: 2.54,
              },
              description:
                "At least 1 inch of cushioning material between intermediate and outer packaging",
            },
          },
        },
        exceptions: {
          appliesTo: [
            "Blasting caps with safety fuse",
            "Blasting caps with metal clad mild detonating cord",
            "Blasting caps with detonating cord",
            "Blasting caps with shock tubes",
          ],
          notes: [
            "Caps do not need to be attached to the fuse, detonating cord, or shock tube",
            "Inside packagings not required if packaging restricts movement and protects from impact",
            "No quantity limits apply for Detonators, Class C Explosives",
            "Container weight limits still apply",
          ],
        },
        outerPackaging: {
          woodenBoxes: ["DOT 14", "15A", "16A", "19B"],
          fiberboardBoxes: ["DOT 12H", "23F", "23H"],
        },
      },
    },
    "A27.6.": {
      description:
        "Detonating Fuzes, Class A Explosives; Booster, Explosive; Burster, Explosive and Supplementary Charges, Explosive",
      packagingInstructions: {
        requirements: [
          "Package in well secured strong tight wooden or metal boxes approved by military specifications or drawings.",
        ],
        containerTypes: [
          {
            type: "Wooden Box",
            description:
              "Strong, tight Wooden Box approved by military specifications or drawings",
            maxGrossWeight: {
              lbs: 190,
              kg: 86.18,
            },
            for: "Detonating fuzes, Class A",
          },
          {
            type: "Metal Box",
            description:
              "Strong, tight metal boxes approved by military specifications or drawings",
            maxGrossWeight: {
              lbs: 190,
              kg: 86.18,
            },
            for: "Detonating fuzes, Class A",
          },
          {
            type: "Wooden Box for boosters/bursters",
            description:
              "Strong, tight wooden boxes approved by military specifications or drawings",
            maxGrossWeight: {
              lbs: 300,
              kg: 136.08,
            },
            for: "Boosters, bursters, and supplementary charges (without detonators, shipped separately)",
          },
          {
            type: "Metal Box for Boosters/Bursters",
            description:
              "Strong, tight metal boxes approved by military specifications or drawings",
            maxGrossWeight: {
              lbs: 300,
              kg: 136.08,
            },
            for: "Boosters, bursters, and supplementary charges (without detonators, shipped separately)",
          },
        ],
        weightLimits: {
          detonatingFuzes: {
            description: "Detonating fuzes, Class A",
            maxGrossWeight: {
              lbs: 190,
              kg: 86.18,
            },
          },
          boostersBurstersSupplementary: {
            description:
              "Boosters, bursters, and supplementary charges (without detonators, shipped separately)",
            maxGrossWeight: {
              lbs: 300,
              kg: 136.08,
            },
          },
        },
        notes: [
          "Ensure any fuze with a radioactive component also meets requirements of Attachment 11.",
        ],
      },
    },
    "A27.7.": {
      description:
        "Small Arms Primer; Cannon Primer; Combination Primer; Percussion Cap; Grenades Empty, Primed",
      packagingInstructions: {
        general: {
          primersAndGrenades: {
            requirements: [
              "Package primers and primed grenades in strong, tight Wooden Box with provisions to secure internal packages against movement.",
            ],
          },
          cartridgeCases: {
            requirements: [
              "Package primed empty cartridge cases in wooden or fiberboard boxes or DOT21C fiber drums constructed to specs for 250 lbs net weight.",
            ],
            netWeight: {
              lbs: 250,
              kg: 113.4,
            },
            notes: [
              "Add corrugated pad between contents and metal top/bottom of drum.",
            ],
          },
        },
        smallArmsPrimersWithAnvils: {
          packagingOptions: [
            {
              type: "Cellular Inside Packages",
              requirements: [
                "Use partitions to isolate layers and columns of primers to prevent chain explosion.",
                "Outer packaging: Wooden Box per A27.7.1 or DOT 12B fiberboard boxes with corrugated liner.",
                "Liner bursting test must match or exceed box.",
                "Exception: Full telescopic style DOT 12B box with pressure-sensitive tape requires no liner.",
              ],
              maxOuterBoxCount: 5000,
            },
            {
              type: "DOT 23H Fiberboard Box",
              construction: [
                "Full-depth telescopic style; top: extended end flaps, bottom: extended side flaps.",
                "No glued or stapled joints.",
                "Full-height liner, top/bottom pads made of double-wall corrugated fiberboard.",
                "Optional horizontal hand-holes: 4 in. x 1 in. max.",
              ],
              handholeDimensions: {
                width: {
                  maximum: {
                    inches: 4,
                    centimeters: 10.16,
                  },
                },
                height: {
                  maximum: {
                    inches: 1,
                    centimeters: 2.54,
                  },
                },
              },
              requirements: [
                "Use cellular inside packages to tightly fit primers.",
              ],
              maxOuterBoxCount: 50000,
            },
          ],
        },
        mixedPackagingAllowances: {
          allowedWith: [
            "Nonexplosive and nonflammable articles",
            "Small arms ammunition (see A27.27)",
            "Propellant explosive, Class B (see A27.24.2)",
          ],
          maxWeightPerContainer: {
            lbs: 5,
            kg: 2.27,
          },
          constructionNotes: [
            "Caps and packaging must prevent full-package detonation from partial explosions.",
          ],
        },
        percussionCaps: {
          packagingOptions: [
            {
              type: "Fiberboard Box (DOT 12B)",
              innerPackaging: [
                {
                  type: "Metal cans",
                  maxQuantity: 100,
                  midLevelPackaging: {
                    type: "Chipboard box",
                    capacity: "10 metal cans",
                  },
                  outerPackaging: {
                    type: "DOT 12B fiberboard box",
                    capacity: "5 chipboard boxes",
                  },
                  safetyRequirements: [
                    "Explosion of some caps cannot cause explosion of all",
                  ],
                },
                {
                  type: "Plastic Can",
                  maxQuantity: 100,
                  midLevelPackaging: {
                    type: "Chipboard box",
                    capacity: "up to 8 chipboard boxes",
                  },
                  outerPackaging: {
                    type: "DOT 12B fiberboard box",
                  },
                  safetyRequirements: [
                    "Explosion of some caps cannot cause explosion of all",
                  ],
                  maxGrossWeight: {
                    lbs: 150,
                    kg: 68.04,
                  },
                },
              ],
            },
          ],
        },
      },
    },
    "A27.8.": {
      description:
        "Fuze, Combination; Fuze, Percussion; Fuze, Time; Fuze, Tracer; or Tracer",
      packagingInstructions: {
        containers: [
          {
            type: "Strong, tight outside Wooden Box",
            maxGrossWeight: {
              lbs: 150,
              kg: 68.04,
            },
          },
          {
            type: "Triple-wall Fiberboard Box",
            maxGrossWeight: {
              lbs: 150,
              kg: 68.04,
            },
          },
          {
            type: "Fiberboard Box",
            spec: ["DOT 23F"],
            maxGrossWeight: {
              lbs: 65,
              kg: 29.48,
            },
          },
        ],
        requirements: [
          "Make special provisions for securing individual packages against movement inside the box.",
        ],
      },
    },
    "A27.9.": {
      description:
        "Common Fireworks, Signal Flares, Hand Signal Devices, Smoke Signals, Smoke Candles, Smoke Grenades, Smoke Pots, and Very Signal Cartridges",
      packagingInstructions: {
        containers: [
          {
            type: "Wooden Box",
            spec: ["DOT 15A", "DOT 16A", "DOT 19A", "DOT 19B"],
            maxGrossWeight: {
              lbs: 100,
              kg: 45.36,
            },
            exceptions: {
              item: "Very signal cartridges",
              maxGrossWeight: {
                lbs: 500,
                kg: 226.8,
              },
            },
          },
          {
            type: "Fiberboard Box",
            spec: ["DOT 12B"],
            maxGrossWeight: {
              lbs: 65,
              kg: 29.48,
            },
          },
          {
            type: "Aluminum Drum",
            dimensions: {
              diameter: {
                exact: {
                  inches: 8,
                  centimeters: 20.32,
                },
              },
            },
            features: ["Watertight", "Rubber gasket", "Positive closure"],
            notes: ["Authorized only for smoke pots"],
          },
          {
            type: "Polystyrene Container",
            containedItem: "Smoke signals",
            configuration: {
              itemsPerContainer: 2,
              overwrap: {
                material: "Heat-sealed polystyrene bag",
                dimensions: {
                  thickness: {
                    minimum: {
                      inches: 0.006,
                      centimeters: 0.015,
                    },
                  },
                },
              },
              pallet: {
                border: {
                  height: {
                    exact: {
                      feet: 2,
                      meters: 0.61,
                    },
                  },
                  thickness: {
                    exact: {
                      inches: 0.25,
                      centimeters: 0.64,
                    },
                  },
                  material: "Plywood",
                },
                box: "MIL-B-43096, type II, class 2, wirebound wooden box",
                liner: "PPP-F-320, type W6C or equal fiberboard",
              },
              maxContainersPerBox: 18,
            },
          },
        ],
        notes: [
          "Ensure sparklers or similar fireworks have igniting tips securely covered and protected from friction/contact.",
        ],
        maxGrossWeight: {
          lbs: 100,
          kg: 45.36,
        },
      },
    },
    "A27.10.": {
      description:
        "Cord, Detonating; Fuse, Mild Detonating, Metal Clad; and Flexible Linear Shaped Charges, Metal Clad",
      packagingInstructions: {
        containerTypes: [
          "Wooden Box",
          "Fiberboard boxes",
          "Shipping containers approved by military specification or drawings",
        ],
      },
    },
    "A27.11.": {
      description: "Detonating, Fuzes, Class C Explosives",
      packagingInstructions: {
        options: [
          {
            type: "Fiberboard Box",
            spec: ["DOT 12H"],
            features: [
              "With or without liners",
              "Well-secured inside paperboard cartons",
              "Use filler/lining to prevent movement",
            ],
          },
          {
            type: "Wooden or Metal Box",
            approvedBy: "Military specification or drawing",
            maxGrossWeight: {
              lbs: 190,
              kg: 86.18,
            },
          },
        ],
      },
    },
    "A27.12.": {
      description:
        "Detonating Primers, Class A Explosives and Detonating Primers, Class C Explosives",
      packagingInstructions: {
        containerTypes: [
          {
            type: "Wooden Box",
            spec: ["DOT 14", "DOT 15A", "DOT 16A", "DOT 19B"],
          },
          {
            type: "Fiberboard boxes",
            spec: ["DOT 12H", "DOT 23F", "DOT 23H"],
          },
          {
            type: "Shipping containers approved by military specification or drawing",
            approvedBy: "Military specification or drawing",
          },
        ],
      },
    },
    "A27.13.": {
      description:
        "Explosive Bomb; Explosive Mine; Explosive Projectile; Explosive Torpedo; Grenade, Hand, Explosive; and Grenade, Rifle, Explosive",
      packagingInstructions: {
        general: [
          "Pack and secure explosive bombs, mines, projectiles, torpedoes, or grenades in strong wooden or metal boxes (except A27.13.2).",
        ],
        exceptions: [
          {
            condition:
              "Explosive bombs, mines, projectiles, torpedoes over 90 lbs or projectiles ≥ 4¾ inches diameter",
            packaging:
              "May be shipped unboxed if securely fastened to pallets or blocked/braced",
          },
        ],
        specialProvisions: [
          "Pack gas/smoke/incendiary/bursting charge munitions in strong wooden or metal boxes.",
        ],
        weightLimits: {
          grenadesOrMinesBox: {
            lbs: 250,
            kg: 113.4,
          },
          multipleBombsWarheadsOrProjectiles: {
            lbs: 1400,
            kg: 635.03,
          },
        },
        containerSpecific: [
          {
            items: [
              "XM47",
              "XM42",
              "XM42E1",
              "SX54",
              "XM2",
              "XM12",
              "XM12E1",
              "XM12E2",
              "XM12E3",
              "XM17",
            ],
            containerType: "Wooden or metal containers",
            shippingNotes: [
              "Do not stack wooden containers more than 3 high; allow 3 ft overhead clearance",
              "Provide 2 ft clearance in front of inspection door in aircraft",
              "Tiedown must permit inspection door access (nets not considered obstruction)",
              "Max gross weight of wooden container: 675 lbs",
            ],
          },
          {
            item: "BLU 50/B bomblets",
            containerType: "Specially designed fiberboard-lined plywood boxes",
            innerPackaging: {
              description:
                "10 bomblets per preformed polyurethane cushioning in heat-sealed barrier bag",
            },
          },
          {
            item: "Explosive mines",
            containerType: "Metal drum PA 16",
            configuration:
              "14 inside can assemblies with perforated tops, preformed packing, and 2 base assemblies; filled with liquid freon; 2 sight gauges for liquid level monitoring",
          },
          {
            item: "Explosive mines",
            containerType: "Metal drum PA 17",
            configuration:
              "Preformed packing holding mines below liquid freon level; 2 sight gauges for liquid level monitoring",
          },
          {
            item: "CDU-4/B (SM41E1), CDE-5/B (XM40ES), CDU-10 (XM40ES/SM44), CDU-14/B (XM64)",
            containerType:
              "Wooden Box approved by military specification or drawing",
            notes: ["Fill with liquid freon and electrically monitor level"],
          },
          {
            item: "7.2 inch projector charge",
            containerType: "Assembled to 40x48 inch steel pallet",
            maxGrossWeight: {
              lbs: 2000,
              kg: 907.18,
            },
          },
          {
            item: "CBU-55/B with explosive and ethylene oxide fuel",
            containerType: "CNU-120/E",
          },
          {
            item: "CBU-55/B without fuel",
            containerType: "CNU-120/E",
          },
          {
            item: "CBU-33/A",
            containerType:
              "Plastic containers CNU-104/E conforming to MIL-P-22748A, class A, grade 6",
            maxGrossWeight: {
              lbs: 1200,
              kg: 544.31,
            },
          },
        ],
      },
    },
    "A27.14.": {
      description:
        "Explosive Cable Cutters; Explosive Power Device, Class C; Explosive Release Device; or Starter Cartridges, Jet Engine, Class C Explosive",
      packagingInstructions: {
        containers: [
          {
            type: "Fiberboard boxes",
            spec: ["DOT 12H", "DOT 23F", "DOT 23H"],
            maxGrossWeight: {
              lbs: 65,
              kg: 29.48,
            },
          },
          {
            type: "Wooden or metal boxes",
            approvedBy: "Military specification or drawings",
            notes: [
              "Starter cartridges, jet engine, must have igniter wires short-circuited when packed for shipment",
            ],
          },
        ],
      },
    },
    "A27.15.": {
      description:
        "Explosive Rivets. Package explosive rivets, containing not more than 375 milligrams of explosive composition each, in unit containers or paperboard. Pack the unit containers or paperboard in strong wooden, fiberboard or metal containers approved by military specification or drawings.",
      packagingInstructions: {
        containers: [
          {
            type: "Wooden Container",
            description: "Strong wooden container for explosive rivets",
            approvedBy: ["military specification", "military drawings"],
            maxExplosivePerRivet: { mg: 375 },
            unitContainers: ["Unit containers", "Paperboard"],
          },
          {
            type: "Fiberboard Container",
            description: "Strong fiberboard container for explosive rivets",
            approvedBy: ["military specification", "military drawings"],
            maxExplosivePerRivet: { mg: 375 },
            unitContainers: ["Unit containers", "Paperboard"],
          },
          {
            type: "Metal Container",
            description: "Strong metal container for explosive rivets",
            approvedBy: ["military specification", "military drawings"],
            maxExplosivePerRivet: { mg: 375 },
            unitContainers: ["Unit containers", "Paperboard"],
          },
        ],
      },
    },
    "A27.16.": {
      description:
        "Actuating Cartridges, Explosive, Fire Extinguisher or Actuating Cartridge, Explosive, Valve",
      packagingInstructions: {
        containers: [
          {
            type: "Strong Wooden Box",
          },
          {
            type: "Fiberboard boxes",
          },
        ],
      },
    },
    "A27.17.": {
      description: "Special Fireworks",
      packagingInstructions: {
        containers: [
          {
            type: "Wooden Box",
            spec: ["DOT 15A", "15B", "16A", "19A", "19B"],
            maxGrossWeight: {
              lbs: 500,
              kg: 226.8,
            },
          },
          {
            type: "Fiberboard boxes",
            spec: "DOT 12B",
            maxGrossWeight: {
              lbs: 65,
              kg: 29.48,
            },
            restrictions: [
              "Illuminating projectiles and airplane flares not permitted",
            ],
          },
        ],
        specialItems: {
          flashOrSpreaderCartridges: {
            compositionLimit: "Not more than 72 grains of flash powder",
            innerPackaging: {
              description:
                "Inside fiberboard cartons or tin cans (max 6 cartridges)",
            },
            outerPackaging: {
              containerTypes: ["DOT 15A", "16A", "19A", "19B", "DOT 12B"],
              maxQuantity: 150,
            },
          },
          assembledFlashCartridges: {
            components:
              "Paper cartridge shell, small arms primer, flash composition",
            flashCompositionLimit: "180 grains",
            innerPackaging: {
              maxCartridgesPerCarton: 12,
              maxCartonsPerOuter: 12,
            },
            outerPackaging: {
              containerTypes: [
                "DOT 15A",
                "15B",
                "16A",
                "19A",
                "19B",
                "DOT 12B",
              ],
              notes: [
                "May be packed with nonexplosive, nonflammable, noncorrosive items if ≤ 5 lbs",
              ],
            },
          },
          flashSheets: {
            unitPack: 6,
            intermediatePack: 12,
            intermediatePackaging: {
              type: "Pasteboard box or carton",
            },
            outerPackaging: {
              containerTypes: ["DOT 15A", "16A", "19A", "19B", "DOT 12B"],
              maxGrossWeight: {
                wooden: {
                  lbs: 150,
                  kg: 68.04,
                },
                fiberboard: {
                  lbs: 65,
                  kg: 29.48,
                },
              },
            },
          },
          photographicFlashPowder: {
            similarTo: "A27.17.3",
            innerContainerStrength: "Must hold up to 2 oz",
            packagingOptions: [
              {
                type: "Bottles",
                outerPackaging: {
                  type: "Fiber mailing tubes with metal ends",
                  maxQuantity: 48,
                  containerType: "Wooden box",
                },
              },
              {
                type: "Units ≤ 1 oz without bottles",
                outerPackaging: {
                  type: "Fiber mailing tubes",
                  containerType: "Wooden or fiberboard boxes",
                  maxGrossWeight: {
                    wooden: {
                      lbs: 150,
                      kg: 68.04,
                    },
                    fiberboard: {
                      lbs: 65,
                      kg: 29.48,
                    },
                  },
                },
              },
            ],
          },
          toyTorpedoes: {
            outerPackaging: {
              containerTypes: [
                "DOT 15A",
                "15B",
                "16A",
                "19A",
                "19B",
                "DOT 12B",
              ],
            },
            limits: {
              maxQuarterGrossCartons: 20,
              maxTotalTorpedoes: "5 gross",
              maxGrossWeight: {
                fiberboard: {
                  lbs: 35,
                  kg: 15.88,
                },
                wooden: {
                  lbs: 65,
                  kg: 29.48,
                },
              },
            },
            requirements: [
              "Do not pack with other fireworks",
              "Pack in sawdust in paper/cardboard cartons (min 4 in³ per grain)",
              "Torpedoes with potassium chlorate/black antimony/sulfur: 36 per inner, min 105 in³ capacity, 12 compartments, fill vacant space with sawdust",
            ],
          },
          distressSignals: {
            containerType: "DOT 12 fiberboard boxes",
            innerPackaging: {
              material: "Metal",
              minGauge: 24,
              closure: "Positive (not friction)",
              requirements: ["Must completely fill outer"],
            },
            maxGrossWeight: {
              lbs: 95,
              kg: 43.09,
            },
          },
          marineAndAircraftFlares: {
            containerType:
              'Navy-designed preformed polystyrene, heat-sealed poly bag (0.006")',
            consolidation: {
              count: 18,
              outerContainer:
                "MIL-B-43096, type II, class 2 wirebound wooden box",
              lining: "PPP-F-320, type W6C or equal fiberboard",
            },
          },
          largeProjectiles: {
            types: ["Illuminating", "Incendiary", "Smoke"],
            criteria: "Over 90 lbs or ≥ 4¾ inches in diameter",
            packaging: {
              palletized: true,
              boxed: false,
              securing: "Blocked/braced per military procedures",
            },
          },
          smallProjectiles: {
            types: ["Illuminating", "Incendiary", "Smoke"],
            criteria: "< 4¾ inches in diameter",
            packaging: {
              palletized: true,
              boxed: false,
              securing: "Blocked/braced per military procedures",
            },
          },
          mk27Mk28Flares: {
            types: ["MK27 Mod 0 guided missile flares", "MK28-3 target flares"],
            packaging: "MK2 Mod 0 metal boxes",
          },
          practiceWarheads: {
            contents: "Polytechnics",
            packaging: {
              quantity: 2,
              containerType: "MK34 Mod 0 metal box",
              maxGrossWeight: {
                lbs: 65,
                kg: 29.48,
              },
            },
          },
          flares: {
            containerType: "Flame-retardant polystyrene cases",
            packaging: {
              palletized: true,
              covering: "Plywood or wirebound sheathing",
              securing: "Steel strapping",
            },
          },
        },
      },
    },
    "A27.18.": {
      description: "High Explosives",
      packagingInstructions: {
        categories: [
          {
            name: "High Explosives, Liquids",
            referenceSection: "A27.18.1.",
            requirements: [
              "Use absorbent material (e.g., wood pulp) in sufficient quantity and quality, properly dried at mixing.",
              "Nitrate of soda must have less than 1% moisture at time of mixing.",
            ],
          },
          {
            name: "High Explosives With Liquid Explosive Ingredients",
            referenceSection: "A27.18.2.",
            requirements: [
              "Must be uniformly mixed with absorbent and antacid.",
              "Antacid must neutralize an amount equivalent to 1% magnesium carbonate of the liquid explosive content.",
            ],
          },
          {
            name: "Cartridges",
            referenceSection: "A27.18.3.",
            packaging: {
              type: "Shell",
              materials: [
                "Strong paper",
                "Polyethylene",
                "Paper and polyethylene (combined)",
              ],
              requirements: [
                "Must fully enclose explosive column and be treated to prevent absorption of liquid ingredients",
              ],
            },
          },
          {
            name: "Bags",
            referenceSection: "A27.18.4.",
            packaging: {
              type: "Bag",
              materials: [
                "Strong treated paper",
                "Equally efficient non-absorptive material",
              ],
              requirements: [
                "Must not absorb the liquid ingredient of the explosive",
              ],
            },
          },
          {
            name: "Box Linings",
            referenceSection: "A27.18.5.",
            packaging: [
              {
                type: "Box Lining",
                materials: [
                  "Strong paraffined paper",
                  "Other suitable waterproof material",
                ],
                requirements: [
                  "Lining must be seamless or with cemented joints and impervious to liquid ingredients and water",
                ],
              },
              {
                appliesTo: "Box covers",
                requirements: [
                  "Must be protected from explosive contact using lining paper or equivalent",
                ],
              },
            ],
          },
          {
            name: "Padding Requirements for High Liquid Content",
            referenceSection: "A27.18.6.",
            packaging: {
              appliesTo:
                "Gelatinous explosives and non-gelatinous types ≥30% liquid",
              requirements: [
                "Use ¼ inch sawdust or full-area pad made of absorptive cellulose sheet with nitroglycerin absorptive value equivalent to sawdust",
              ],
            },
          },
          {
            name: "Orientation Requirements",
            referenceSection: "A27.18.7.",
            requirements: [
              "Cartridges over 4 inches long and containing >10% liquid must be packed horizontally",
              "Bags must be packed with filling holes facing up",
            ],
          },
          {
            name: "Movement Prevention",
            referenceSection: "A27.18.8.",
            requirements: [
              "Cartridges and bags must be packed tightly to prevent movement within boxes",
            ],
          },
          {
            name: "Siftproof Containers for Low Liquid Content",
            referenceSection: "A27.18.9.",
            packaging: {
              appliesTo:
                'Dynamite (non-gelatin), bags or cartridges >2" diameter, ≤30% liquid',
              requirements: [
                "Can be packed without sawdust or lining paper if the packaging is siftproof and treated against penetration",
              ],
            },
          },
          {
            name: "Liquid High Explosives in Metal Containers",
            referenceSection: "A27.18.10.",
            packaging: [
              {
                type: "DOT 15L wooden box",
                appliesTo: "Liquid high explosives",
              },
              {
                type: "DOT 15M wooden box",
                appliesTo: "Liquid high explosives",
                containerLimit:
                  "Each metal container inside must be ≤10 quarts",
              },
            ],
          },
          {
            name: "High Explosives With Liquid Explosive Ingredients",
            referenceSection: "A27.18.11.1.",
            packaging: [
              {
                type: "Fiberboard box",
                spec: "DOT 23G",
                maxGrossWeight: {
                  lbs: 65,
                  kg: 29.48,
                },
                limit: "1 cartridge per box",
                appliesTo: "Dynamite with ≤30% liquid explosive ingredients",
              },
              {
                type: ["Wooden box", "Fiberboard box"],
                specs: {
                  wooden: ["DOT 14", "DOT 15A", "DOT 16A", "DOT 19B"],
                  fiberboard: ["DOT 12H", "DOT 23F", "DOT 23H"],
                },
                innerPackaging: {
                  type: ["Cartridges", "Bags"],
                  limits: [
                    "Cartridges ≤ 12 in diameter × 36 in length or ≤ 50 lbs gross weight",
                    "Bags securely closed and ≤ 50 lbs",
                  ],
                },
                maxGrossWeight: {
                  wooden: {
                    lbs: 75,
                    kg: 34.02,
                  },
                  fiberboard: {
                    lbs: 65,
                    kg: 29.48,
                  },
                },
                appliesTo: "Dynamite with ≤30% liquid explosive ingredients",
              },
              {
                type: "Fiberboard box",
                specs: ["DOT 23F", "DOT 23H"],
                innerPackaging: {
                  type: "26-gauge metal container",
                  dimensions: {
                    maxDiameter: {
                      inches: 8,
                      centimeters: 20.32,
                    },
                    maxLength: {
                      inches: 31,
                      centimeters: 78.74,
                    },
                  },
                  contents:
                    "High explosives (ammonium dynamite core) surrounded by blasting agent",
                },
                maxGrossWeight: {
                  lbs: 65,
                  kg: 29.48,
                },
                appliesTo: "Dynamite with ≤30% liquid explosive ingredients",
              },
            ],
          },
          {
            name: "High Explosives With Liquid Explosive Ingredients",
            referenceSection: "A27.18.11.2.",
            packaging: [
              {
                type: ["Wooden box", "Fiberboard box"],
                specs: {
                  wooden: ["DOT 14", "DOT 15A", "DOT 16A", "DOT 19B"],
                  fiberboard: ["DOT 12H", "DOT 23F", "DOT 23H"],
                },
                maxGrossWeight: {
                  lbs: 140,
                  kg: 63.5,
                },
                appliesTo: "Dynamite with ≤10% liquid explosive ingredients",
              },
              {
                type: "Fiberboard box",
                spec: "DOT 23G",
                limit: "1 cartridge per box",
                maxGrossWeight: {
                  lbs: 65,
                  kg: 29.48,
                },
                appliesTo: "Dynamite with ≤10% liquid explosive ingredients",
              },
            ],
          },
          {
            name: "High Explosives With Liquid Explosive Ingredients",
            referenceSection: "A27.18.11.3.",
            packaging: [
              {
                type: ["Wooden box", "Fiberboard box"],
                specs: {
                  wooden: ["DOT 14", "DOT 15A", "DOT 16A", "DOT 19B"],
                  fiberboard: ["DOT 12H", "DOT 23F", "DOT 23H"],
                },
                maxGrossWeight: {
                  wooden: {
                    lbs: 75,
                    kg: 34.02,
                  },
                  fiberboard: {
                    lbs: 65,
                    kg: 29.48,
                  },
                },
                innerPackaging: {
                  options: [
                    {
                      type: "Cartridge",
                      dimensions: {
                        diameter: {
                          maximum: {
                            inches: 4,
                            centimeters: 10.16,
                          },
                        },
                        length: {
                          maximum: {
                            inches: 8,
                            centimeters: 20.32,
                          },
                        },
                      },
                    },
                    {
                      type: "Redipped cartridge",
                      dimensions: {
                        diameter: {
                          minimum: {
                            inches: 4,
                            centimeters: 10.16,
                          },
                          maximum: {
                            inches: 5,
                            centimeters: 12.7,
                          },
                        },
                        length: {
                          minimum: {
                            inches: 8,
                            centimeters: 20.32,
                          },
                          maximum: {
                            inches: 10,
                            centimeters: 25.4,
                          },
                        },
                      },
                      coating: "Melted paraffin or equivalent",
                    },
                    {
                      type: "Composite cartridge",
                      description:
                        'Two or more redipped cartridges enclosed in a strong paper shell, ≤ 30" length, dipped in paraffin',
                      dimensions: {
                        length: {
                          maximum: {
                            inches: 30,
                            centimeters: 76.2,
                          },
                        },
                      },
                    },
                  ],
                },
              },
              {
                type: ["Wooden box", "Fiberboard box"],
                specs: {
                  wooden: ["DOT 14", "DOT 15A", "DOT 16A", "DOT 19B"],
                  fiberboard: ["DOT 12H", "DOT 23F", "DOT 23H"],
                },
                innerPackaging: {
                  options: [
                    {
                      type: "Paper bag",
                      details: [
                        "Two-ply paraffined, ≤ 12 ¾ lbs capacity",
                        "Tops folded and taped closed",
                        "Two such bags may be inserted into another two-ply paper bag, securely closed and dipped in paraffin",
                      ],
                      capacity: {
                        lbs: 12.75,
                        kg: 5.78,
                      },
                    },
                    {
                      type: "Polyethylene bag",
                      details: [
                        "Thickness ≥ 0.0004 inches",
                        "≤ 12 ¾ lbs capacity",
                        "Two securely closed bags may be packed in an intermediate polyethylene or paper bag",
                        "Pack in polyethylene-lined outer fiberboard boxes",
                      ],
                      thickness: {
                        minimum: {
                          inches: 0.0004,
                          centimeters: 0.001016,
                        },
                      },
                      capacity: {
                        lbs: 12.75,
                        kg: 5.78,
                      },
                    },
                  ],
                },
                maxGrossWeight: {
                  wooden: {
                    lbs: 75,
                    kg: 34.02,
                  },
                  fiberboard: {
                    lbs: 65,
                    kg: 29.48,
                  },
                },
              },
            ],
          },
          {
            name: "High Explosives With Liquid Explosive Ingredients",
            referenceSection: "A27.18.11.4.",
            packaging: [
              {
                type: "Fiberboard box",
                spec: "DOT 23G",
                restrictions: ["No more than one cartridge per box"],
                maxGrossWeight: {
                  lbs: 65,
                  kg: 29.48,
                },
              },
              {
                type: ["Wooden box", "Fiberboard box"],
                specs: {
                  wooden: ["DOT 14", "DOT 15A", "DOT 16A", "DOT 19B"],
                  fiberboard: ["DOT 12H", "DOT 23F", "DOT 23H"],
                },
                innerPackaging: {
                  options: [
                    {
                      type: "Cartridge",
                      dimensions: {
                        diameter: {
                          maximum: {
                            inches: 12,
                            centimeters: 30.48,
                          },
                        },
                        length: {
                          maximum: {
                            inches: 36,
                            centimeters: 91.44,
                          },
                        },
                      },
                      maxWeight: {
                        lbs: 50,
                        kg: 22.68,
                      },
                    },
                    {
                      type: "Bag",
                      requirements: [
                        "Not completely sealed bags must be packed with filling holes up",
                      ],
                      maxWeight: {
                        lbs: 50,
                        kg: 22.68,
                      },
                    },
                  ],
                },
                maxGrossWeight: {
                  wooden: {
                    lbs: 75,
                    kg: 34.02,
                  },
                  fiberboard: {
                    lbs: 65,
                    kg: 29.48,
                  },
                },
              },
              {
                type: ["Wooden box", "Fiberboard box"],
                specs: {
                  wooden: [
                    "DOT 14",
                    "DOT 15A",
                    "DOT 16A",
                    "DOT 19B",
                    "DOT 23H",
                  ],
                  fiberboard: ["DOT 12H", "DOT 23G"],
                },
                contents:
                  "Straight gelatin dynamite (≥ 80% strength) and blasting gelatin",
                packagingModes: [
                  {
                    mode: "Cartridges",
                  },
                  {
                    mode: "Bulk",
                    requirements: [
                      "Double-line boxes with paper",
                      "When using DOT 12H fiberboard: replace paper lining with two nested 3-mil polyethylene bags",
                      "Only one such double-bag may be packed per DOT 12H box",
                      "When using DOT 23G fiberboard: must be packed inside an outer container of ≥ 7-ply heavy kraft paper",
                    ],
                  },
                ],
                maxGrossWeight: {
                  wooden: {
                    lbs: 75,
                    kg: 34.02,
                  },
                  fiberboard: {
                    lbs: 65,
                    kg: 29.48,
                  },
                },
              },
            ],
          },
          {
            name: "High Explosives With No Liquid Explosive Ingredient and Propellant Explosives, Class A",
            referenceSection: "A27.18.12.",
            packaging: [
              {
                type: "Wooden Box",
                specs: ["DOT 14", "DOT 15A", "DOT 16A", "DOT 19B"],
                maxGrossWeight: {
                  lbs: 140,
                  kg: 63.5,
                },
              },
              {
                type: "Fiberboard boxes",
                specs: ["DOT 12H", "DOT 23F", "DOT 23H"],
                maxGrossWeight: {
                  lbs: 65,
                  kg: 29.48,
                },
              },
              {
                type: "Box lining",
                materials: [
                  "Polyethylene bag ≥ 6 mils",
                  "Strong paraffined paper",
                  "DOT 2L lining",
                ],
                requirements: [
                  "Required for inner packaging. If explosive has >5% moisture, handhole boxes are not authorized.",
                ],
                thickness: {
                  minimum: {
                    inches: 0.006,
                    centimeters: 0.01524,
                  },
                },
              },
              {
                type: "Outside boxes",
                appliesTo:
                  "Combination cartridges (explosive with dynamite core)",
                requirements: [
                  "Column must be fully enclosed in waterproofed cloth or paper",
                ],
                limits: {
                  maxDiameter: {
                    inches: 6,
                    centimeters: 15.24,
                  },
                  maxLength: {
                    inches: 2,
                    centimeters: 5.08,
                  },
                  maxGrossWeight: {
                    lbs: 25,
                    kg: 11.34,
                  },
                },
                maxGrossWeight: {
                  lbs: 65,
                  kg: 29.48,
                },
              },
              {
                type: "Fiberboard boxes",
                specs: ["DOT 23G"],
                maxGrossWeight: {
                  lbs: 65,
                  kg: 29.48,
                },
                requirements: [
                  'High explosives must pass percussion sensitivity test: 8-lb weight dropped from 7 in onto 0.03" × 0.2" pellet between steel surfaces',
                  "If sensitivity exceeds limit, explosives must be packed in cartridges",
                  "Dry explosives may be packed in siftproof cloth or paper bags ≤ 25 lbs",
                ],
                testParameters: {
                  weight: {
                    lbs: 8,
                    kg: 3.63,
                  },
                  dropHeight: {
                    inches: 7,
                    centimeters: 17.78,
                  },
                  pelletDimensions: {
                    thickness: {
                      inches: 0.03,
                      centimeters: 0.0762,
                    },
                    width: {
                      inches: 0.2,
                      centimeters: 0.508,
                    },
                  },
                },
                bagCapacity: {
                  lbs: 25,
                  kg: 11.34,
                },
              },
            ],
          },
          {
            name: "High Explosives With No Liquid Explosive Ingredient Nor Any Chlorate",
            referenceSection: "A27.18.13.",
            packaging: [
              {
                type: "Box lining",
                requirements: [
                  "If moisture content > 5%, use 6-mil polyethylene bag or DOT 2L lining. Polyethylene only allowed if compatible with contents.",
                ],
                materials: ["Polyethylene bag (≥ 6 mil)", "DOT 2L lining"],
                appliesTo: "Explosives with >5% moisture",
                thickness: {
                  minimum: {
                    inches: 0.006,
                    centimeters: 0.01524,
                  },
                },
              },
              {
                type: "Exterior containers",
                appliesTo: "Combination cartridges with dynamite core",
                requirements: [
                  "Column must be enclosed in waterproof cloth or paper",
                ],
                limits: {
                  maxDiameter: {
                    inches: 6,
                    centimeters: 15.24,
                  },
                  maxLength: {
                    inches: 20,
                    centimeters: 50.8,
                  },
                  maxGrossWeight: {
                    lbs: 25,
                    kg: 11.34,
                  },
                },
                maxGrossWeight: {
                  lbs: 65,
                  kg: 29.48,
                },
              },
              {
                type: "General percussion sensitivity",
                requirements: [
                  'Explosives must pass percussion test: 8-lb weight from 7 in on 0.03" × 0.20" pellet between steel surfaces',
                ],
                appliesTo: "All explosives",
                exceptions: [
                  "Plastic-bonded explosives do not require cartridge/bag/metal container packaging",
                ],
                additionalRequirements: [
                  "Pack and cushion individual pieces to prevent movement inside the outer container",
                  "If too sensitive, must be packed in cartridges",
                  "Dry explosives may be packed in siftproof bags or metal containers ≤ 60 lbs",
                ],
                testParameters: {
                  weight: {
                    lbs: 8,
                    kg: 3.63,
                  },
                  dropHeight: {
                    inches: 7,
                    centimeters: 17.78,
                  },
                  pelletDimensions: {
                    thickness: {
                      inches: 0.03,
                      centimeters: 0.0762,
                    },
                    width: {
                      inches: 0.2,
                      centimeters: 0.508,
                    },
                  },
                },
                containerCapacity: {
                  lbs: 60,
                  kg: 27.22,
                },
              },
              {
                type: "Wooden Box",
                specs: ["DOT 14", "DOT 15A", "DOT 16A", "DOT 19B"],
                maxGrossWeight: {
                  lbs: 140,
                  kg: 63.5,
                },
                optionalFeatures: [
                  'May include handholes ≤ 1" × 4" centered laterally, ≥ 1 5/8" from top edge',
                  "May contain tightly sealed inner metal containers",
                ],
                handholes: {
                  maxWidth: {
                    inches: 1,
                    centimeters: 2.54,
                  },
                  maxLength: {
                    inches: 4,
                    centimeters: 10.16,
                  },
                  minDistanceFromTop: {
                    inches: 1.625,
                    centimeters: 4.13,
                  },
                },
              },
              {
                type: "Fiberboard boxes",
                specs: ["DOT 12H", "DOT 23F", "DOT 23G", "DOT 23H"],
                maxGrossWeight: {
                  lbs: 65,
                  kg: 29.48,
                },
              },
              {
                type: "Metal drums (single-trip)",
                specs: ["DOT 17H", "DOT 37A"],
                liner: "Polyethylene liner ≥ 0.003 inches",
                appliesTo: "Ammonium Perchlorate (particle size 5–15 µm)",
                capacityLimit: "30 gallons",
                linerThickness: {
                  minimum: {
                    inches: 0.003,
                    centimeters: 0.00762,
                  },
                },
                particleSize: {
                  minimum: {
                    micrometers: 5,
                  },
                  maximum: {
                    micrometers: 15,
                  },
                },
              },
            ],
          },
          {
            name: "Amatol and Other Dry Explosives",
            referenceSection: "A27.18.14.",
            applicableMaterials: [
              "Amatol (80% Ammonium Nitrate / 20% TNT)",
              "Ammonium Picrate",
              "Nitroguanidine",
              "Nitrourea",
              "Urea Nitrate",
              "Picric Acid",
              "Tetryl",
              "Trinitroresorcinal",
              "Trinitrotoluene",
              "Pentolite",
              "Cyclotrimethylenetrinitramine (desensitized)",
              "Soda Amatol",
            ],
            packaging: [
              {
                type: "Outer containers",
                description: "Containers described in A27.18.13 are authorized",
                reference: "See packaging options under A27.18.13",
              },
              {
                type: "Wooden Box",
                specs: ["DOT 14", "DOT 15A", "DOT 16A", "DOT 19B"],
                innerPackaging: {
                  type: "Strong paper or cloth bags",
                  maxWeight: {
                    lbs: 50,
                    kg: 22.68,
                  },
                  requirements: ["Pack with filling holes facing upward"],
                },
              },
              {
                type: "Fiber drums",
                specs: ["DOT 21C"],
                maxNetWeight: {
                  lbs: 200,
                  kg: 90.72,
                },
              },
            ],
          },
          {
            name: "Trinitrotoluene and Pentolite (Dry)",
            referenceSection: "A27.18.15.",
            applicableMaterials: ["Trinitrotoluene", "Pentolite"],
            packaging: [
              {
                type: "Reference containers",
                description:
                  "May be packed using container types from A27.18.13 and A27.18.14",
                references: ["A27.18.13", "A27.18.14"],
              },
              {
                type: "Wooden Box",
                specs: ["DOT 14", "DOT 15A", "DOT 16A", "DOT 19B"],
                innerPackaging: {
                  type: "Strong paper or cloth bags",
                  maxWeight: {
                    lbs: 100,
                    kg: 45.36,
                  },
                  requirements: ["Pack with filling holes facing upward"],
                },
              },
              {
                type: "Wooden Box with liners",
                specs: ["DOT 14", "DOT 15A", "DOT 16A", "DOT 19B"],
                linerSpec: "DOT 2L",
                requirements: ["Boxes must include strong siftproof liners"],
              },
              {
                type: "Fiber drums",
                specs: ["DOT 21C"],
                maxNetWeight: {
                  lbs: 200,
                  kg: 90.72,
                },
              },
            ],
            specialProvision: {
              description:
                "Certain dry explosives may be shipped without restriction for medical/reagent use if ≤ 4 oz per package, in securely closed bottles or jars, properly cushioned",
              maxQuantity: {
                oz: 4,
                g: 113.4,
              },
              packaging:
                "Securely closed bottles or jars, cushioned to prevent breakage",
              applicableMaterials: [
                "Ammonium picrate",
                "Dipicrylamine",
                "Dipicrly sulfide",
                "Dinitrophenylhydrazine",
                "Nitroguanidine",
                "Picramide",
                "Picric acid",
                "Picryl chloride",
                "Trinitroanisole",
                "Trinitrobenzene",
                "Trintrobenzoic acid",
                "Trinitro-m-cresol",
                "Trinitronaphthalene",
                "Trinitroresorcinol",
                "Trinitroltoluene",
                "Urea nitrate",
                "Triaminotrinitrobenzene",
                "Trichlortrinitrobenzene",
                "Hexanitrostilbene",
              ],
            },
          },
          {
            name: "Explosives (Wet)",
            referenceSection: "A27.18.16.",
            applicableMaterials: [
              "Ammonium Picrate",
              "Picric Acid",
              "Urea Nitrate",
              "Trinitrobenzene",
              "Trinitroresorcinol",
              "Trinitrotoluene",
              "Cyclotrimethylenetrinitramine",
              "Cyclotetramethylenetetranitramine",
              "Pentaerythrite Tetranitrate (desensitized)",
              "Trinitrobenzoic Acid",
            ],
            packaging: {
              moistureRequirement: {
                description:
                  "Material must be wet with at least 10 lbs of water per 90 lbs of dry explosive",
                ratio: "10:90 water-to-dry-material",
                water: {
                  lbs: 10,
                  kg: 4.54,
                },
                dryMaterial: {
                  lbs: 90,
                  kg: 40.82,
                },
              },
              containerTypes: [
                {
                  type: "Metal barrels or drums",
                  specs: ["DOT 5B"],
                  applicableTo: [
                    "Cyclotrimethylenetrinitramine",
                    "Cyclotetramethylenetetranitramine",
                  ],
                  innerPackaging: {
                    type: "Bags",
                    material:
                      "10-ounce cotton duck, rubber or rubberized cloth",
                    enclosure: {
                      material:
                        "Rubber, rubberized cloth, or other watertight material",
                      requirements: [
                        "Securely closed and placed inside the drum",
                      ],
                    },
                  },
                  weightLimits: {
                    maxDryWeightPerDrum: {
                      lbs: 300,
                      kg: 136.08,
                    },
                  },
                  antifreezeOption: {
                    condition: "If freezing weather anticipated",
                    solution:
                      "Wet with mixture of denatured ethyl alcohol or other suitable antifreeze and water to prevent freezing",
                  },
                },
                {
                  type: "Fiber drums",
                  specs: ["DOT 2C"],
                  applicableTo: [
                    "Cyclotrimethylenetrinitramine",
                    "Cyclotetramethylenetetranitramine",
                  ],
                  innerPackaging: {
                    type: "Bags",
                    material:
                      "10-ounce cotton duck, rubber or rubberized cloth",
                    enclosure: {
                      material:
                        "Rubber, rubberized cloth, or other watertight material",
                      requirements: [
                        "Securely closed and placed inside the drum",
                      ],
                    },
                  },
                  weightLimits: {
                    maxDryWeightPerDrum: {
                      lbs: 225,
                      kg: 102.06,
                    },
                  },
                },
                {
                  type: "Fiber drum",
                  specs: ["DOT 21C"],
                  applicableTo: ["Pentaerythrite Tetranitrate (desensitized)"],
                  innerPackaging: {
                    type: "Polyethylene bag",
                    thickness: {
                      inches: 0.004,
                      centimeters: 0.01016,
                    },
                    requirements: ["Liquid tight closure"],
                  },
                  maxNetWeight: {
                    lbs: 200,
                    kg: 90.72,
                  },
                },
              ],
            },
          },
          {
            name: "Amatol (Cast or Compressed in Solid Block/Column)",
            referenceSection: "A27.18.17.",
            packaging: [
              {
                type: "Metal drum",
                specs: ["DOT 13A"],
                maxGrossWeight: {
                  lbs: 90,
                  kg: 40.82,
                },
                notes: [
                  "Used in addition to containers prescribed in A27.18.5",
                ],
              },
            ],
          },
          {
            name: "Nitrocellulose",
            referenceSection: "A27.18.18.",
            packaging: [
              {
                type: "Wooden box",
                specs: ["DOT 14", "DOT 15A", "DOT 16A", "DOT 19B"],
                innerPackagingOptions: [
                  {
                    contents: "Dry, uncompressed nitrocellulose",
                    wrap: [
                      "Strong paraffined paper",
                      "Suitable sparkproof material",
                    ],
                    maxNetWeight: {
                      lbs: 1,
                      kg: 0.45,
                    },
                    maxTotalPerOuter: {
                      lbs: 10,
                      kg: 4.54,
                    },
                    description:
                      "Each inner package ≤ 1 lb. Total dry nitrocellulose per box ≤ 10 lbs",
                  },
                  {
                    contents:
                      "Compressed sticks or blocks of dry nitrocellulose",
                    wrap: ["Strong paraffined paper"],
                    maxGrossWeight: {
                      lbs: 75,
                      kg: 34.02,
                    },
                    description:
                      "Wrap compressed sticks or blocks. Box gross weight ≤ 75 lbs",
                  },
                ],
              },
            ],
          },
          {
            name: "Shaped Charges, Commercial",
            referenceSection: "A27.18.19.",
            requirements: [
              "Exposed lined conical cavities must be covered and paired cavity-to-cavity.",
              "One or more pairs must be arranged in a fiber tube with end cavities facing inward.",
              "Fit snugly in fiber tubes with no excess space in outer packaging.",
            ],
            packaging: [
              {
                type: "Wooden box",
                specs: ["DOT 14", "DOT 15A", "DOT 16A", "DOT 19B"],
                maxGrossWeight: {
                  lbs: 140,
                  kg: 63.5,
                },
              },
              {
                type: "Fiberboard box",
                specs: ["DOT 12H", "DOT 23F", "DOT 23H"],
                maxGrossWeight: {
                  lbs: 65,
                  kg: 29.48,
                },
              },
              {
                type: "Fiberboard box",
                specs: ["DOT 12B"],
                description:
                  "Double-wall corrugated fiberboard (≥275 lb test), with 200 lb test double-faced lining board",
                innerPackaging: {
                  containerTypes: [
                    "Waterproof plastic containers (securely closed)",
                    "Waterproof containers with metal ends (securely closed)",
                  ],
                  separators: {
                    type: "Corrugated fiberboard partitions",
                    spec: "≥175 lb test (Mullen or Cady)",
                  },
                },
                maxGrossWeight: {
                  lbs: 65,
                  kg: 29.48,
                },
              },
              {
                type: "Navy steel cylindrical container",
                description:
                  "Specially designed with a shock mitigation system",
                configuration: {
                  itemsPerContainer: 1,
                  palletization: "4 containers strapped or banded to a pallet",
                },
              },
            ],
          },
          {
            name: "Cyclotrimethylenetrinitramine (RDX), Desensitized, Pellet Form, Dry",
            referenceSection: "A27.18.20.",
            packaging: [
              {
                applicableTo: "Pellet diameter ≤ ¼ inch",
                outerPackaging: {
                  type: "Wooden box",
                  specs: ["DOT 15A", "DOT 19B"],
                },
                innerPackaging: {
                  type: "Slide-type fiber container with perforated fillers",
                  closure:
                    "All openings securely closed with pressure-sensitive tape",
                },
                cushioning:
                  "Minimum 2 inches of sawdust between inner and outer containers",
                limits: {
                  maxNetWeightPerInnerContainer: {
                    lbs: 0.75,
                    kg: 0.34,
                  },
                  maxNetWeightPerOuterContainer: {
                    lbs: 10,
                    kg: 4.54,
                  },
                },
                cushioningThickness: {
                  minimum: {
                    inches: 2,
                    centimeters: 5.08,
                  },
                },
                pelletDiameter: {
                  maximum: {
                    inches: 0.25,
                    centimeters: 0.635,
                  },
                },
              },
              {
                applicableTo: "Pellet diameter > ¼ inch",
                outerPackaging: {
                  type: "Wooden box",
                  specs: ["DOT 15A", "DOT 19B"],
                },
                innerPackaging: {
                  primary: {
                    type: "Fiber tube with positive closures at both ends",
                  },
                  secondary: {
                    type: "Fiber container",
                    maxNetExplosiveWeight: {
                      lbs: 0.75,
                      kg: 0.34,
                    },
                  },
                },
                cushioning:
                  "Minimum 2 inches of sawdust between inner and outer containers",
                limits: {
                  maxNetWeightPerOuterContainer: {
                    lbs: 10,
                    kg: 4.54,
                  },
                },
                cushioningThickness: {
                  minimum: {
                    inches: 2,
                    centimeters: 5.08,
                  },
                },
                pelletDiameter: {
                  minimum: {
                    inches: 0.25,
                    centimeters: 0.635,
                  },
                },
              },
            ],
          },
          {
            name: "Conversion Kits Containing Composition A-3 Pellets",
            referenceSection: "A27.18.21.",
            packaging: [
              {
                type: "Metal ammunition components box",
                spec: "MK2",
                lining: "Fiberboard lined",
                contents: {
                  description: "8 Composition A-3 pellets per box",
                  packagingRequirements: [
                    "Pellets and kit components must be securely nested",
                    "Components and pellets must be packaged separately within fiberboard separators",
                    "All items must be enclosed in inside fiberboard boxes",
                  ],
                },
              },
            ],
          },
        ],
      },
    },
    "A27.19.": {
      description: "Igniter Cord",
      packagingInstructions: {
        containerTypes: [
          "Fiberboard boxes",
          "Fiberboard drums",
          "Wooden Box",
          "Metal containers",
        ],
        requirements: [
          "Pack in strong, tight, outside containers made of fiberboard, wood, or metal",
        ],
      },
    },
    "A27.20.": {
      description: "Initiating Explosive",
      packagingInstructions: {
        categories: [
          {
            name: "Diazodinitrophenol or Lead Mononitroresorcinate",
            referenceSection: "A27.20.1.",
            requirements: [
              "Must be packed wet with not less than 40% by weight of water.",
            ],
            packaging: [
              {
                type: "DOT 5 or 5B metal barrels or drums",
                description:
                  "Inside bags made of 10 oz cotton duck, rubber, or rubberized cloth. Secondary containment in watertight rubber or plastic bags.",
                weightLimits: {
                  Diazodinitrophenol: {
                    maximum: {
                      lbs: 220,
                      kg: 99.79,
                    },
                    note: "dry weight",
                  },
                  LeadMononitroresorcinate: {
                    maximum: {
                      lbs: 100,
                      kg: 45.36,
                    },
                    note: "dry weight",
                  },
                },
              },
              {
                type: "DOT 21C fiber drum",
                description:
                  "Max 30-gallon, 9-ply with laminated kraft/polyethylene, steel between 5th and 6th ply, watertight fiber/metal head.",
              },
              {
                type: "Polyethylene nested bags (Lead Mononitroresorcinate only)",
                description:
                  'Two layers of 0.004" bags inside one 0.006" water-filled bag. Fully fills outer shipping container.',
                bagThickness: {
                  inner: {
                    inches: 0.004,
                    centimeters: 0.01016,
                  },
                  outer: {
                    inches: 0.006,
                    centimeters: 0.01524,
                  },
                },
                weightLimits: {
                  LeadMononitroresorcinate: {
                    maximum: {
                      lbs: 100,
                      kg: 45.36,
                    },
                    note: "dry weight",
                  },
                },
              },
            ],
          },
          {
            name: "Guanyl Nitrosamino Guanylidene Hydrazine",
            referenceSection: "A27.20.2.",
            requirements: [
              "Packed wet with not less than 30% by weight of water.",
            ],
            packaging: [
              {
                type: "DOT 5 or 5B metal drums",
                description:
                  'Inside 4 oz duck bags, capped with same material. Placed in grain bag, centered in drum and surrounded by 3" water-saturated sawdust. Barrel lined with close-fitting jute bag.',
                sawdustCushioning: {
                  thickness: {
                    inches: 3,
                    centimeters: 7.62,
                  },
                },
                weightLimits: {
                  GuanylNitrosaminoGuanylideneHydrazine: {
                    maximum: {
                      lbs: 75,
                      kg: 34.02,
                    },
                    note: "dry weight",
                  },
                },
              },
            ],
          },
          {
            name: "Lead Azide",
            referenceSection: "A27.20.3.",
            requirements: [
              "Packed wet with not less than 20% by weight of water.",
            ],
            packaging: [
              {
                type: "Same as A27.20.2.",
                weightLimits: {
                  LeadAzide: {
                    maximum: {
                      lbs: 150,
                      kg: 68.04,
                    },
                    note: "dry weight",
                  },
                },
              },
            ],
          },
          {
            name: "Lead Styphnate or Barium Styphnate, Monohydrate",
            referenceSection: "A27.20.4.",
            requirements: [
              "Packed wet with not less than 20% by weight of water.",
            ],
            packaging: [
              {
                type: "DOT 5, 5B, or 17H metal barrels",
                description:
                  'Inside rubber or rubberized cloth bag, capped and subdivided. Bag centered and surrounded with 3" water-saturated sawdust. Drum lined with sewn jute bag.',
                sawdustCushioning: {
                  thickness: {
                    inches: 3,
                    centimeters: 7.62,
                  },
                },
                weightLimits: {
                  LeadStyphnate: {
                    maximum: {
                      lbs: 150,
                      kg: 68.04,
                    },
                    note: "dry weight",
                  },
                  BariumStyphnate: {
                    maximum: {
                      lbs: 150,
                      kg: 68.04,
                    },
                    note: "dry weight",
                  },
                },
              },
            ],
          },
          {
            name: "Nitromannite",
            referenceSection: "A27.20.5.",
            requirements: [
              "Packed wet with not less than 40% by weight of water.",
            ],
            packaging: [
              {
                type: "Same as A27.20.1.",
                weightLimits: {
                  Nitromannite: {
                    maximum: {
                      lbs: 100,
                      kg: 45.36,
                    },
                    note: "dry weight",
                  },
                },
              },
            ],
          },
          {
            name: "Nitrosoguanidine",
            referenceSection: "A27.20.6.",
            requirements: [
              "Packed wet with not less than 10% by weight of water.",
            ],
            packaging: [
              {
                type: "DOT 5, 5B, or 17H metal drums",
                description: "Inside strong cloth bag.",
                weightLimits: {
                  Nitrosoguanidine: {
                    maximum: {
                      lbs: 75,
                      kg: 34.02,
                    },
                    note: "dry weight",
                  },
                },
              },
            ],
          },
          {
            name: "Pentaerythrite Tetranitrate",
            referenceSection: "A27.20.7.",
            requirements: [
              "Packed wet with not less than 40% by weight of water.",
            ],
            packaging: [
              {
                type: "Same as A27.20.1.",
                weightLimits: {
                  PETN: {
                    maximum: {
                      lbs: 300,
                      kg: 136.08,
                    },
                    note: "dry weight",
                  },
                },
              },
            ],
          },
          {
            name: "Tetrazene",
            referenceSection: "A27.20.8.",
            requirements: [
              "Packed wet with not less than 30% by weight of water.",
            ],
            packaging: [
              {
                type: "Same as A27.20.2.",
                weightLimits: {
                  Tetrazene: {
                    maximum: {
                      lbs: 75,
                      kg: 34.02,
                    },
                    note: "dry weight",
                  },
                },
              },
            ],
          },
          {
            name: "Fulminate of Mercury",
            referenceSection: "A27.20.9.",
            requirements: [
              "Packed wet with not less than 25% by weight of water.",
            ],
            packaging: [
              {
                type: "DOT 5, 5B, or 17H metal drums",
                description:
                  'Inside 4 oz duck bag with fabric cap. Placed in strong grain bag. Centered in barrel and surrounded by 3" water-saturated sawdust. Drum lined with close-fitting jute bag.',
                sawdustCushioning: {
                  thickness: {
                    inches: 3,
                    centimeters: 7.62,
                  },
                },
                weightLimits: {
                  FulminateOfMercury: {
                    maximum: {
                      lbs: 150,
                      kg: 68.04,
                    },
                    note: "dry weight",
                  },
                },
              },
            ],
          },
        ],
      },
    },
    "A27.21.": {
      description:
        "Rocket Motors, Jet Thrust Units, and Igniters (Class A Explosives)",
      packagingInstructions: {
        categories: [
          {
            name: "Rocket Motors and Jet Thrust Units",
            referenceSection: "A27.21.",
            containerTypes: [
              {
                type: "Wooden Box or Wooden Box fiberboard lined",
                specs: ["DOT 14", "DOT 15A", "DOT 15E", "DOT 16A", "DOT 19B"],
              },
              {
                type: "Metal containers",
                specs: ["MIL-D-6054", "Other DOT-approved metal containers"],
              },
            ],
            requirements: [
              "Rocket motors must be shipped in a non-propulsive state.",
              "Shipment of rocket motors in a propulsive state via military air requires written approval from the hazard classification authority (see TB 700-2/NAVSEAINST 8020.8B/T.O. 11A-1-47/DLAR 8220.1).",
            ],
          },
          {
            name: "Igniters or Igniter Components",
            referenceSection: "A27.21.2.1.",
            containerTypes: [
              {
                type: "Unit packaging (e.g., metal can, fiberboard box)",
                description:
                  "Igniters or igniter components may be shipped in the same outer packaging as rocket motors or jet thrust units if separately packaged",
              },
            ],
          },
        ],
      },
    },
    "A27.22.": {
      description:
        "Rocket Motors, Jet Thrust Units, and Igniters (Class B Explosives)",
      packagingInstructions: {
        containers: [
          {
            type: "Wooden Box or fiberboard-lined Wooden Box",
            spec: ["DOT 14", "DOT 15A", "DOT 15E", "DOT 16A", "DOT 19B"],
            maxGrossWeight: {
              lbs: 500,
              kg: 226.8,
            },
            applicableTo: "Igniters, ramjet engines",
          },
          {
            type: "Wooden Box",
            spec: ["DOT 15B"],
            description:
              "Authorized only for Class B igniters (jet thrust or ramjet engine)",
            maxGrossWeight: {
              lbs: 500,
              kg: 226.8,
            },
          },
          {
            type: "Service-designated containers",
            description:
              "Approved wood or metal containers identified by OR, MIL-STD, MK/MOD, or CNU number",
          },
          {
            type: "MIL-D-6054 drums",
            spec: ["MS 63052"],
            description:
              "Special interior blocking/bracing; Jet thrust units, Class B only",
          },
          {
            type: "LAU-10/A Launcher",
            description:
              "With unit load adapter MK58 MOD 1, palletized with WR-54/115C; 16 rocket motors per shipment",
          },
          {
            type: "MK4 metal container",
            description:
              "Interior mounting/blocking support; one M77A1 rocket per container",
          },
          {
            type: "Fiberboard box",
            spec: ["DOT 23F"],
            description:
              "For Class B igniters or starter cartridges packed in closed inside boxes (200 lb test) or metal containers",
            requirements: [
              "Starter cartridges must have igniter wires short-circuited when packed",
            ],
          },
          {
            type: "Wooden Box",
            spec: ["MIL-B-2427 Grade A Style 4 Type II"],
            description:
              "Contains 8 igniters, each in hermetically sealed metal containers",
          },
        ],
        requirements: [
          "Igniters or igniter components may be shipped in the same container with jet thrust units, if approved by military specification or drawings.",
          "Rocket motors must be shipped in a non-propulsive state.",
          "Military air shipment of rocket motors in a propulsive state requires written approval from hazard classification authority (see TB 70-2/NAVSEAINST 8020.3/T.O. 11A-1-47/DLAR 8220.1).",
        ],
      },
    },
    "A27.23.": {
      description: "Railway Torpedoes. Packaging Requirements:",
      packagingInstructions: {
        categories: [
          {
            name: "Wooden Box",
            referenceSection: "A27.23.1.",
            containerTypes: [
              {
                type: "Wooden Box",
                specs: ["DOT 15A", "DOT 15B", "DOT 16A", "DOT 19A", "DOT 19B"],
                maxNetWeight: {
                  lbs: 125,
                  kg: 56.7,
                },
                notes: ["Net weight must not exceed 125 pounds"],
              },
            ],
          },
          {
            name: "Fiberboard Boxes (no inside containers)",
            referenceSection: "A27.23.2.",
            containerTypes: [
              {
                type: "Fiberboard boxes",
                specs: ["DOT 12H", "DOT 23F", "DOT 23H"],
                maxGrossWeight: {
                  lbs: 65,
                  kg: 29.48,
                },
                notes: ["Gross weight must not exceed 65 pounds"],
              },
            ],
          },
          {
            name: "Fiberboard Boxes with Inside Cartons",
            referenceSection: "A27.23.3.",
            containerTypes: [
              {
                type: "Fiberboard boxes with inside cartons",
                specs: ["DOT 12B"],
                innerPackaging: {
                  type: "Cartons",
                  maxQuantity: 72,
                  description:
                    "Each carton may contain up to 72 track torpedoes",
                },
                maxGrossWeight: {
                  lbs: 65,
                  kg: 29.48,
                },
                notes: [
                  "Gross weight of the exterior fiberboard box must not exceed 65 pounds",
                ],
              },
            ],
          },
          {
            name: "Fiberboard Boxes without Inside Containers (Limited Quantity)",
            referenceSection: "A27.23.4.",
            containerTypes: [
              {
                type: "Fiberboard boxes without inside containers",
                specs: ["DOT 12B"],
                maxQuantity: 50,
                description: "May be used for not more than 50 track torpedoes",
                requirements: [
                  "Smallest dimension of the box must be at least 6 inches",
                ],
                minDimension: {
                  inches: 6,
                  centimeters: 15.24,
                },
              },
            ],
          },
        ],
        notes: [
          "Railway torpedoes must be packaged according to the specific subparagraph requirements based on container type",
        ],
      },
    },
    "A27.24.": {
      description:
        "Propellant Explosives, Solid or Liquid (Class A or B Explosives)",
      packagingInstructions: {
        categories: [
          {
            name: "Tight Metal Containers",
            referenceSection: "A27.24.1.",
            containerTypes: [
              {
                type: "Tight metal cases or tight metal containers in tight Wooden Box",
                maxGrossWeight: {
                  lbs: 200,
                  kg: 90.72,
                },
                requirements: [
                  "Wooden Box must be free from loose knots and cracks.",
                ],
              },
            ],
          },
          {
            name: "Wooden Box, Metal Lined",
            referenceSection: "A27.24.2.",
            containerTypes: [
              {
                type: "Wooden Box",
                specs: ["DOT 14", "DOT 15A", "DOT 19B", "Metal lined DOT 2F"],
                maxGrossWeight: {
                  lbs: 200,
                  kg: 90.72,
                },
              },
            ],
          },
          {
            name: "Fiberboard Boxes with Bags",
            referenceSection: "A27.24.3.",
            containerTypes: [
              {
                type: "Wooden or fiberboard boxes with inside cloth or paper bags",
                specs: ["DOT 14", "DOT 15A", "DOT 19B", "DOT 23F", "DOT 23H"],
                innerPackaging: {
                  maxCapacity: {
                    lbs: 25,
                    kg: 11.34,
                  },
                },
                performanceRequirement:
                  "Must withstand 2 drops from 4 feet without breaking or sifting",
                dropTestHeight: {
                  feet: 4,
                  meters: 1.22,
                },
                maxNetWeight: {
                  lbs: 50,
                  kg: 22.68,
                },
              },
            ],
          },
          {
            name: "Boxes with Metal Kegs",
            referenceSection: "A27.24.4.",
            containerTypes: [
              {
                type: "Wood or fiberboard boxes with inside DOT 13 metal kegs",
                specs: [
                  "DOT 14",
                  "DOT 15A",
                  "DOT 15B",
                  "DOT 15C",
                  "DOT 19B",
                  "DOT 12B",
                  "DOT 23H",
                ],
                innerPackaging: {
                  type: "DOT 13 metal kegs",
                  maxQuantity: 6,
                  maxNetWeightPerKeg: {
                    lbs: 5,
                    kg: 2.27,
                  },
                },
                maxGrossWeight: {
                  wooden: {
                    lbs: 200,
                    kg: 90.72,
                  },
                  fiberboard: {
                    lbs: 65,
                    kg: 29.48,
                  },
                },
              },
            ],
          },
          {
            name: "Boxes with Strong Metal Containers",
            referenceSection: "A27.24.5.",
            containerTypes: [
              {
                type: "Wood or fiberboard boxes with inside strong metal containers",
                specs: [
                  "DOT 14",
                  "DOT 15A",
                  "DOT 15B",
                  "DOT 15C",
                  "DOT 19B",
                  "DOT 23F",
                  "DOT 23H",
                ],
                innerPackaging: {
                  maxQuantity: 4,
                  maxWeightPerContainer: {
                    lbs: 25,
                    kg: 11.34,
                  },
                },
                maxGrossWeight: {
                  fiberboard: {
                    lbs: 65,
                    kg: 29.48,
                  },
                },
              },
            ],
          },
          {
            name: "Fiber Drums",
            referenceSection: "A27.24.6.",
            containerTypes: [
              {
                type: "Fiber drums",
                specs: ["DOT 21C"],
                maxNetWeight: {
                  lbs: 265,
                  kg: 120.2,
                },
                requirements: [
                  "Drums with wooden heads require a strong sift-proof liner",
                ],
              },
            ],
          },
          {
            name: "Unlined Wooden Box for Grains",
            referenceSection: "A27.24.7.",
            containerTypes: [
              {
                type: "Unlined Wooden Box",
                specs: ["DOT 14", "DOT 15A", "DOT 16A", "DOT 19B"],
                applicableTo: "Grains ≥ 1 inch diameter or ≥ 3 inches length",
                minGrainDimensions: {
                  diameter: {
                    minimum: {
                      inches: 1,
                      centimeters: 2.54,
                    },
                  },
                  length: {
                    minimum: {
                      inches: 3,
                      centimeters: 7.62,
                    },
                  },
                },
                requirements: [
                  "Grains must be tightly packed and coated with a protective material",
                ],
                maxGrossWeight: {
                  lbs: 200,
                  kg: 90.72,
                },
              },
            ],
          },
          {
            name: "Military-Approved Substitutes",
            referenceSection: "A27.24.8.",
            containerTypes: [
              {
                type: "Other wooden or fiberboard boxes",
                description:
                  "Approved by the military services as substitutes for DOT specification containers",
              },
            ],
          },
          {
            name: "Boxes with Small Fiber or Metal Containers",
            referenceSection: "A27.24.9.",
            containerTypes: [
              {
                type: "Wooden or fiberboard boxes with inside fiber or metal containers",
                specs: [
                  "DOT 14",
                  "DOT 15A",
                  "DOT 15B",
                  "DOT 19B",
                  "DOT 12H",
                  "DOT 23F",
                  "DOT 23H",
                ],
                innerPackaging: {
                  maxCapacity: {
                    lbs: 1.75,
                    kg: 0.79,
                  },
                },
                maxGrossWeight: {
                  wooden: {
                    lbs: 200,
                    kg: 90.72,
                  },
                  fiberboard: {
                    lbs: 65,
                    kg: 29.48,
                  },
                },
              },
            ],
          },
          {
            name: "Conversion Kits",
            referenceSection: "A27.24.10.",
            containerTypes: [
              {
                type: "Metal ammunition components box (MK2), fiberboard lined",
                contents: "Eight conversion kits",
                requirements: ["Nest components with fiberboard separators"],
              },
            ],
          },
          {
            name: "Smokeless Powder Packaging",
            referenceSection: "A27.24.11. – A27.24.11.3.",
            containerTypes: [
              {
                type: "Fiberboard box",
                specs: ["DOT 12H", "DOT 23G", "DOT 23H"],
                innerPackaging: {
                  type: "Polyethylene bag",
                  thickness: {
                    minimum: {
                      mils: 6,
                      inches: 0.006,
                      centimeters: 0.01524,
                    },
                  },
                  closure: "Securely closed",
                },
                applicableTo: "Smokeless powder for cannon or small arms",
              },
              {
                type: "Metal barrel or drum",
                specs: ["DOT 5", "DOT 5A", "DOT 5B", "DOT 6B", "DOT 6C"],
                applicableTo: "Smokeless powder in water",
              },
              {
                type: "Wooden box (metal-lined)",
                specs: ["DOT 15A", "DOT 19B"],
                lining: "DOT 2F",
                applicableTo: "Smokeless powder in water",
              },
            ],
          },
          {
            name: "Liquid Propellant Explosives",
            referenceSection: "A27.24.12.",
            containerTypes: [
              {
                type: "Wooden or fiberboard lined Wooden Box",
                specs: ["DOT 15A", "DOT 15B", "DOT 15E"],
                innerPackaging: {
                  type: "Polyethylene bottles (≤ 1 gallon)",
                  secondaryContainment: {
                    type: "Plastic bags",
                    thickness: {
                      inches: 0.004,
                      centimeters: 0.01016,
                    },
                  },
                  tertiaryContainment: "Metal containers",
                },
                cushioning: {
                  description: "Incombustible material on all sides",
                  minThickness: {
                    inches: 2,
                    centimeters: 5.08,
                  },
                },
              },
              {
                type: "Metal barrels or drums",
                specs: ["DOT 5B", "DOT 6B", "DOT 6C", "DOT 6D", "DOT 17C"],
                innerPackaging: {
                  options: [
                    "Polyethylene DOT 2S",
                    {
                      type: "Glass-lined aluminum carboys",
                      maxCapacity: {
                        gallons: 12,
                        liters: 45.42,
                      },
                    },
                  ],
                },
                cushioning: {
                  description: "Incombustible absorbent material",
                  minThickness: {
                    inches: 2,
                    centimeters: 5.08,
                  },
                },
                requirements: ["Leave space to accommodate thermal expansion"],
              },
            ],
          },
          {
            name: "Propellant Explosives with Primers",
            referenceSection: "A27.24.13.",
            packaging: {
              innerPackaging: {
                maxWeightPerContainer: {
                  lbs: 1,
                  kg: 0.45,
                },
                maxPropellantGrains: 1,
                maxTotalWeight: {
                  lbs: 5,
                  kg: 2.27,
                },
                requirements: ["Prevent movement in outer packaging"],
              },
              smallArms: {
                maxQuantity: 1000,
                reference: "see A27.7.3",
              },
              outerPackaging: {
                wooden: {
                  specs: ["DOT 15A", "DOT 15B", "DOT 15C", "DOT 19B"],
                },
                fiberboard: {
                  specs: ["DOT 12B", "DOT 23F", "DOT 23H"],
                  maxNetWeight: {
                    lbs: 10,
                    kg: 4.54,
                  },
                },
              },
            },
          },
          {
            name: "Document Destroyer Package",
            referenceSection: "A27.24.14.",
            containerTypes: [
              {
                type: "Metal or fiber drums",
                contents: [
                  {
                    description:
                      "Kraft bags of sodium nitrate (polyethylene lined)",
                    quantity: 5,
                    weightPerBag: {
                      lbs: 20,
                      kg: 9.07,
                    },
                  },
                  "Mixture bags of sodium nitrate, tricalcium phosphate, sugar, and charcoal",
                  {
                    description: "M-25 igniters with fuses",
                    quantity: 2,
                  },
                  {
                    description: "Mesh wire screen",
                    length: {
                      inches: 24,
                      centimeters: 60.96,
                    },
                    quantity: 1,
                  },
                  "Safety matches",
                ],
                maxNetWeight: {
                  lbs: 120,
                  kg: 54.43,
                },
              },
              {
                type: "Army drawing D-4 11-34 metal drums",
                description:
                  "With fiber drums inside, forming a 2-inch annulus filled with sodium nitrate and a charcoal-sugar tube",
                annulusWidth: {
                  inches: 2,
                  centimeters: 5.08,
                },
              },
            ],
          },
        ],
      },
    },
    "A27.25.": {
      description: "Rocket Ammunition with Various Projectile Types",
      packagingInstructions: {
        notes: ["Must be approved by military specification or drawings"],
        containers: [
          {
            type: "Strong wooden container",
          },
          {
            type: "Strong metal container",
          },
          {
            type: "Aluminum container",
          },
        ],
      },
    },
    "A27.26.": {
      description: "Small Arms Ammunition and Tear Gas Cartridges",
      packagingInstructions: {
        innerPackaging: {
          types: [
            "Pasteboard boxes",
            "Other boxes",
            "Partitions",
            "Metal clips",
          ],
          requirements: [
            "Must fit snugly and protect primers from accidental damage",
          ],
        },
        outerPackaging: {
          types: ["Wooden Box", "Fiberboard boxes", "Metal containers"],
          requirements: [
            "Securely closed",
            "Must hold inside boxes, partitions, or metal clips",
          ],
        },
        bulkPackaging: {
          applicableTo: "Blank industrial power load cartridges",
          type: "Fiberboard boxes",
          requirements: ["Securely closed"],
        },
      },
    },
    "A27.27.": {
      description: "Toy Caps",
      packagingInstructions: {
        compositionLimit:
          "Not more than an average of ¼ grain of explosive composition per cap",
        innerPackaging: {
          materials: [
            {
              type: "Paperboard",
              minThickness: {
                inches: 0.013,
                centimeters: 0.03302,
              },
            },
            {
              type: "Metal",
              minThickness: {
                inches: 0.008,
                centimeters: 0.02032,
              },
            },
            {
              type: "Noncombustible plastic",
              minThickness: {
                inches: 0.015,
                centimeters: 0.0381,
              },
            },
          ],
          requirements: [
            "Complete enclosure with minimum side/end dimension ≥ 1/8 inch",
            "≤ 10 grains of explosive composition per 1 cubic inch",
            "≤ 17.5 grains of explosive composition per inside container",
          ],
          minDimension: {
            inches: 0.125,
            centimeters: 0.3175,
          },
          maxExplosiveCompositionDensity: {
            grainsPerCubicInch: 10,
            grainsPerCubicCentimeter: 0.61,
          },
          maxExplosiveCompositionPerContainer: {
            grains: 17.5,
            grams: 1.134,
          },
        },
        outerPackaging: [
          {
            type: "Wooden Box",
            specs: ["DOT 15A", "DOT 15B", "DOT 16A", "DOT 19A", "DOT 19B"],
            maxGrossWeight: {
              lbs: 150,
              kg: 68.04,
            },
          },
          {
            type: "Fiberboard boxes",
            specs: ["DOT 12B"],
            maxGrossWeight: {
              lbs: 65,
              kg: 29.48,
            },
          },
          {
            type: "Wooden Box (non-spec)",
            requirements: ["Good condition"],
            maxGrossWeight: {
              lbs: 100,
              kg: 45.36,
            },
          },
        ],
      },
    },
    "A27.28.": {
      description: "Explosive Power Device, Class B",
      packagingInstructions: {
        containers: [
          {
            type: "Wooden Box",
            spec: ["DOT 14", "DOT 15A", "DOT 15E", "DOT 16A", "DOT 19B"],
            features: ["May be fiberboard lined"],
          },
          {
            type: "Military-specified containers",
            description:
              "Containers authorized by military specification or drawings",
          },
        ],
      },
    },
    "A27.29.": {
      description: "Rocket Engine (Liquid), Class B Explosives",
      packagingInstructions: {
        containerTypes: [
          {
            type: "Metal containers",
            description:
              "Strong, airtight metal containers approved by military specification or drawings",
          },
        ],
        notes: [
          "Follow handling instructions and special requirements in A3.3.1.8.",
        ],
      },
    },
    "A27.30.": {
      description: "Cartridge, Practice Ammunition",
      packagingInstructions: {
        containerTypes: [
          {
            type: "Wooden box",
            closure: "Strapping",
            requirements: [
              "Place inside boxes, partitions, or metal clips to protect primers from accidental firing",
            ],
          },
          {
            type: "Fiberboard box",
            closure: "Strapping or taping",
            requirements: [
              "Place inside boxes, partitions, or metal clips to protect primers from accidental firing",
            ],
          },
          {
            type: "Metal container",
            requirements: [
              "Place inside boxes, partitions, or metal clips to protect primers from accidental firing",
            ],
          },
        ],
      },
    },
    "A27.31.": {
      description: "Blasting Agent N.O.S.",
      packagingInstructions: {
        options: [
          {
            type: "Rigid packages",
            examples: ["Boxes", "Drums"],
            performanceRequirement:
              "Must withstand 4-foot drop on most vulnerable point without rupture or loss of contents",
            dropTestHeight: {
              feet: 4,
              meters: 1.22,
            },
          },
          {
            type: "Nonrigid packages",
            examples: ["Tubes", "Bags"],
            performanceRequirement:
              "Must withstand three 4-foot drops without rupture or loss of contents",
            dropTestHeight: {
              feet: 4,
              meters: 1.22,
            },
          },
        ],
      },
    },
    "A27.32.": {
      description: "Oil Well Cartridges",
      packagingInstructions: {
        compositionLimit:
          "Explosive composition must not exceed 20 grains per cubic inch of space",
        explosiveCompositionDensity: {
          maximum: {
            grainsPerCubicInch: 20,
            grainsPerCubicCentimeter: 1.22,
          },
        },
        containers: [
          {
            type: "Wooden Box",
            spec: ["DOT 15A", "DOT 15B", "DOT 16A", "DOT 19A", "DOT 19B"],
            maxGrossWeight: {
              lbs: 150,
              kg: 68.04,
            },
          },
          {
            type: "Fiberboard box",
            spec: ["DOT 15B"],
            maxGrossWeight: {
              lbs: 65,
              kg: 29.48,
            },
          },
        ],
      },
    },
    "A27.33.": {
      description: "Moderate Ammunition Explosive Hazards",
      packagingInstructions: {
        containerTypes: [
          {
            type: "Fiberboard boxes",
            description:
              "Strong, suitable for moderate explosive hazard ammunition",
          },
          {
            type: "Wooden Box",
            description:
              "Strong, suitable for moderate explosive hazard ammunition",
          },
          {
            type: "Wooden barrels or drums",
            description:
              "Alternative packaging for moderate explosive hazard ammunition",
          },
          {
            type: "Metal barrels or drums",
            description:
              "Alternative packaging for moderate explosive hazard ammunition",
          },
        ],
      },
    },
    "A27.34.": {
      description: "Tear Gas Grenades",
      packagingInstructions: {
        options: [
          {
            type: "Wooden Box (metal-strapped)",
            spec: ["DOT 15A", "DOT 15B", "DOT 15C", "DOT 19B"],
            requirements: [
              "Functioning elements not assembled in grenades or devices must be packed in separate compartments or separate boxes",
              "Pack and cushion functioning elements to prevent contact with each other or box walls",
              "Max 50 grenades and 50 functioning devices per container",
            ],
            maxGrossWeight: {
              lbs: 75,
              kg: 34.02,
            },
            maxQuantity: {
              grenades: 50,
              functioningDevices: 50,
            },
          },
          {
            type: "Metal drum (single-trip)",
            spec: ["DOT 37A"],
            requirements: [
              "Functioning elements packed in separate compartments",
              "Max 24 grenades and 24 functioning devices per container",
            ],
            maxGrossWeight: {
              lbs: 75,
              kg: 34.02,
            },
            maxQuantity: {
              grenades: 24,
              functioningDevices: 24,
            },
          },
          {
            type: "Metal container",
            model: "CNU-79/E",
            contents:
              "Dispenser and 40 modules (32 bomblets with orthochlorbenzalmalononitrile)",
            safetyDesign:
              "No propagation or accidental functioning during transport",
            maxGrossWeight: {
              lbs: 1200,
              kg: 544.31,
            },
            marking: "TEAR GAS GRENADES",
            contentDetails: {
              dispensers: 1,
              modules: 40,
              bomblets: 32,
              bombletContents: "orthochlorbenzalmalononitrile",
            },
          },
          {
            type: "Fully assembled grenades/devices",
            requirements: [
              "Functioning elements packed to prevent accidental functioning",
            ],
          },
          {
            type: "Plywood box",
            model: "PP-B-601",
            contents: "Riot control canister cluster (E158 or E159)",
            marking: "TEAR GAS GRENADE (DEVICE)",
          },
        ],
      },
    },
  };
