export type PackagingParagraphReferenceLookup = Record<
  string,
  {
    description?: string | undefined;
    handlingInstructions?:
      | string
      | Record<string, { instructions: string } | SubParagraphs>;
    packagingInstructions?: { subParagraphs?: SubParagraphs } & {
      [key: string]: {
        allowedCylinders?: {
          cylinderType: string;
          specs: string[];
        }[];
        maxCapacityPerReceptacle?: string;
        cylinderTypes?: string[];
        subParagraphs?: SubParagraphs;
        "A7.2.5."?: {
          instructions: string;
          subParagraphs?: SubParagraphs;
        };
        "A7.2.6."?: {
          instructions: string;
          subParagraphs?: SubParagraphs;
        };
        "A7.2.7."?: {
          instructions: string;
          subParagraphs?: SubParagraphs;
        };
        "A7.2.8."?: {
          instructions: string;
          subParagraphs?: SubParagraphs;
        };
        "A7.4.2."?: {
          instructions: string;
          subParagraphs?: SubParagraphs;
        };
        "A7.5.3."?: {
          instructions: string;
          subParagraphs?: SubParagraphs;
        };
        "A7.5.4."?: {
          instructions: string;
          subParagraphs?: SubParagraphs;
        };
        "A7.8.1."?: {
          instructions: string;
          subParagraphs?: SubParagraphs;
        };
        "A7.8.2."?: {
          instructions: string;
          subParagraphs?: SubParagraphs;
        };
        "A7.9.1."?: {
          instructions: string;
          subParagraphs?: SubParagraphs;
        };
        "A7.10.4."?: {
          instructions: string;
          subParagraphs?: SubParagraphs;
        };
        "A7.11.1."?: {
          instructions: string;
          subParagraphs?: SubParagraphs;
        };
        "A7.11.2."?: {
          instructions: string;
          subParagraphs?: SubParagraphs;
        };
        "A7.11.3."?: {
          instructions: string;
          subParagraphs?: SubParagraphs;
        };
        "A7.12.1."?: {
          instructions: string;
          subParagraphs?: SubParagraphs;
        };
        "A8.2.5."?: {
          instructions: string;
          subParagraphs?: SubParagraphs;
        };
        "A8.3.5."?: {
          instructions: string;
          subParagraphs?: SubParagraphs;
        };
        "A8.5.1."?: {
          instructions: string;
          subParagraphs?: SubParagraphs;
        };
        "A8.5.2."?: {
          instructions: string;
          subParagraphs?: SubParagraphs;
        };
        "A8.5.3."?: {
          instructions: string;
          subParagraphs?: SubParagraphs;
        };
        "A8.5.4."?: {
          instructions: string;
          subParagraphs?: SubParagraphs;
        };
        "A8.11.1."?: {
          instructions: string;
          subParagraphs?: SubParagraphs;
          innerPackaging?: {
            receptacleType?: string;
            bags?: string[];
            receptacles?: string[];
            sheets?: string[];
            trays?: string[];
            plastics?: string[];
            tubes?: string[];
            glass?: string[];
            reels?: string;
            dividingPartitions?: string[];
            required?: boolean;
            types?: string[];
            note?: string;
            notes?: string[];
          };
          outerPackaging?: {
            bags?: string[];
            boxes?: string[];
            drums?: string[];
            jerricans?: string[];
            barrel?: string[];
            barrels?: string[];
            plastics?: string[];
            other?: string[];
            wickerwork?: string[];
            largePackagings?: string[];
            packagingType?: string;
            note?: string;
            notes?: string[];
          };
        };
        "A8.11.2."?: {
          instructions: string;
          subParagraphs?: SubParagraphs;
          innerPackaging?: {
            bags?: string[];
            receptacles?: string[];
            sheets?: string[];
            trays?: string[];
            plastics?: string[];
            tubes?: string[];
            glass?: string[];
            reels?: string;
            dividingPartitions?: string[];
            required?: boolean;
            types?: string[];
            note?: string;
            notes?: string[];
          };
          outerPackaging?: {
            bags?: string[];
            boxes?: string[];
            drums?: string[];
            jerricans?: string[];
            barrel?: string[];
            barrels?: string[];
            plastics?: string[];
            other?: string[];
            wickerwork?: string[];
            largePackagings?: string[];
            packagingType?: string;
            note?: string;
            notes?: string[];
          };
        };
        "A8.11.3."?: {
          instructions: string;
          subParagraphs?: SubParagraphs;
          innerPackaging?: {
            bags?: string[];
            receptacles?: string[];
            sheets?: string[];
            trays?: string[];
            plastics?: string[];
            tubes?: string[];
            glass?: string[];
            reels?: string;
            dividingPartitions?: string[];
            required?: boolean;
            types?: string[];
            note?: string;
            notes?: string[];
          };
          outerPackaging?: {
            bags?: string[];
            boxes?: string[];
            drums?: string[];
            jerricans?: string[];
            barrel?: string[];
            barrels?: string[];
            plastics?: string[];
            other?: string[];
            wickerwork?: string[];
            largePackagings?: string[];
            packagingType?: string;
            note?: string;
            notes?: string[];
          };
        };
        "A8.11.4."?: {
          instructions: string;
          subParagraphs?: SubParagraphs;
          innerPackaging?: {
            bags?: string[];
            receptacles?: string[];
            sheets?: string[];
            trays?: string[];
            plastics?: string[];
            tubes?: string[];
            glass?: string[];
            reels?: string;
            dividingPartitions?: string[];
            required?: boolean;
            types?: string[];
            note?: string;
            notes?: string[];
          };
          outerPackaging?: {
            bags?: string[];
            boxes?: string[];
            drums?: string[];
            jerricans?: string[];
            barrel?: string[];
            barrels?: string[];
            plastics?: string[];
            other?: string[];
            wickerwork?: string[];
            largePackagings?: string[];
            packagingType?: string;
            note?: string;
            notes?: string[];
          };
        };
        "A8.11.5."?: {
          instructions: string;
          subParagraphs?: SubParagraphs;
          innerPackaging?: {
            bags?: string[];
            receptacles?: string[];
            sheets?: string[];
            trays?: string[];
            plastics?: string[];
            tubes?: string[];
            glass?: string[];
            reels?: string;
            dividingPartitions?: string[];
            required?: boolean;
            types?: string[];
            note?: string;
            notes?: string[];
          };
          outerPackaging?: {
            bags?: string[];
            boxes?: string[];
            drums?: string[];
            jerricans?: string[];
            barrel?: string[];
            barrels?: string[];
            plastics?: string[];
            other?: string[];
            wickerwork?: string[];
            largePackagings?: string[];
            packagingType?: string;
            note?: string;
            notes?: string[];
          };
        };
        "A8.13.1."?: {
          instructions: string;
          subParagraphs?: SubParagraphs;
        };
        "A8.14.1."?: {
          instructions: string;
          subParagraphs?: SubParagraphs;
        };
        "A8.14.2."?: {
          instructions: string;
          subParagraphs?: SubParagraphs;
        };
        "A8.14.3."?: {
          instructions: string;
          subParagraphs?: SubParagraphs;
        };
        "A8.15.1."?: {
          instructions: string;
          subParagraphs?: SubParagraphs;
        };
        "A8.15.2."?: {
          instructions: string;
          subParagraphs?: SubParagraphs;
        };
        "A8.16.1."?: {
          instructions: string;
          subParagraphs?: SubParagraphs;
        };
        "A8.16.2."?: {
          instructions: string;
          subParagraphs?: SubParagraphs;
        };
        "A8.16.3."?: {
          instructions: string;
          subParagraphs?: SubParagraphs;
        };
        "A8.18.1."?: {
          instructions: string;
          subParagraphs?: SubParagraphs;
        };
        "A8.18.2."?: {
          instructions: string;
          subParagraphs?: SubParagraphs;
        };
        "A8.21.1."?: {
          instructions: string;
          subParagraphs?: SubParagraphs;
        };
        "A8.21.2."?: {
          instructions: string;
          subParagraphs?: SubParagraphs;
        };
        "A8.22.1."?: {
          instructions: string;
          subParagraphs?: SubParagraphs;
        };
        "A9.4.1."?: {
          instructions: string;
          subParagraphs?: SubParagraphs;
        };
        "A9.4.2."?: {
          instructions: string;
          subParagraphs?: SubParagraphs;
        };
        "A9.5.5."?: {
          instructions: string;
          subParagraphs?: SubParagraphs;
        };
        "A9.9.1."?: {
          instructions: string;
          subParagraphs?: SubParagraphs;
        };
        "A9.9.2."?: {
          instructions: string;
          subParagraphs?: SubParagraphs;
        };
        "A9.10.1."?: {
          instructions: string;
          subParagraphs?: SubParagraphs;
        };
        "A9.10.2."?: {
          instructions: string;
          subParagraphs?: SubParagraphs;
        };
        "A9.10.3."?: {
          instructions: string;
          subParagraphs?: SubParagraphs;
        };
        "A9.10.4."?: {
          instructions: string;
          subParagraphs?: SubParagraphs;
        };
        "A9.10.5."?: {
          instructions: string;
          subParagraphs?: SubParagraphs;
        };
        "A12.13.1."?: {
          instructions: string;
          subParagraphs?: SubParagraphs;
        };
        "A12.13.2."?: {
          instructions: string;
          subParagraphs?: SubParagraphs;
        };
        "A12.14.1."?: {
          instructions: string;
          subParagraphs?: SubParagraphs;
        };
        compositePackagingWithPlasticInnerReceptacles?: {
          innerPackaging?: {
            bags?: string[];
            receptacles?: string[];
            sheets?: string[];
            trays?: string[];
            plastics?: string[];
            tubes?: string[];
            glass?: string[];
            reels?: string;
            dividingPartitions?: string[];
            required?: boolean;
            types?: string[];
            note?: string;
            notes?: string[];
          };
          outerPackaging?: {
            bags?: string[];
            boxes?: string[];
            drums?: string[];
            jerricans?: string[];
            barrel?: string[];
            barrels?: string[];
            plastics?: string[];
            other?: string[];
            wickerwork?: string[];
            largePackagings?: string[];
            packagingType?: string;
            note?: string;
            notes?: string[];
          };
        };
        compositePackagingWithGlassPorcelainOrStoneware?: {
          innerPackaging?: {
            bags?: string[];
            receptacles?: string[];
            sheets?: string[];
            trays?: string[];
            plastics?: string[];
            tubes?: string[];
            glass?: string[];
            reels?: string;
            dividingPartitions?: string[];
            required?: boolean;
            types?: string[];
            note?: string;
            notes?: string[];
          };
          outerPackaging?: {
            bags?: string[];
            boxes?: string[];
            drums?: string[];
            jerricans?: string[];
            barrel?: string[];
            barrels?: string[];
            plastics?: string[];
            other?: string[];
            wickerwork?: string[];
            largePackagings?: string[];
            packagingType?: string;
            note?: string;
            notes?: string[];
          };
        };
        liquidToxins?: {
          combinationPackaging: {
            innerPackaging: InnerPackaging;
            outerPackaging: OuterPackaging;
          };
          singlePackaging: {
            innerPackaging: {
              required: boolean;
            };
            outerPackaging: OuterPackaging;
          };
          compositePackaging: {
            innerReceptacle: InnerReceptacle;
            outerPackaging: OuterPackaging;
          };
        };
        combinationPackaging?: {
          innerPackaging: InnerPackaging;
          outerPackaging: OuterPackaging;
        };
        singlePackaging?: {
          innerPackaging: {
            required: boolean;
          };
          outerPackaging: OuterPackaging;
        };
        compositePackaging?: {
          innerReceptacle: InnerReceptacle;
          outerPackaging: OuterPackaging;
        };
        description?: string | undefined;
        bags?: string[];
        receptacles?: string[];
        sheets?: string[];
        trays?: string[];
        tubes?: string[];
        reels?: string;
        dividingPartitions?: string[];
        required?: boolean;
        note?: string;
        boxes?: string[];
        plastics?: string[];
        glass?: string[];
        drums?: string[];
        jerricans?: string[];
        barrel?: string[];
        barrels?: string[];
        wickerwork?: string[];
        largePackagings?: string[];
        packagingType?: string;
        innerPackaging?: {
          bags?: string[];
          receptacles?: string[];
          sheets?: string[];
          trays?: string[];
          plastics?: string[];
          tubes?: string[];
          glass?: string[];
          reels?: string;
          dividingPartitions?: string[];
          required?: boolean;
          types?: string[];
          note?: string;
          notes?: string[];
        };
        intermediatePackaging?: {
          bags?: string[];
          receptacles?: string[];
          dividingPartitions?: string[];
          note?: string;
          notes?: string[];
        };
        outerPackaging?: {
          bags?: string[];
          boxes?: string[];
          drums?: string[];
          jerricans?: string[];
          barrel?: string[];
          barrels?: string[];
          plastics?: string[];
          other?: string[];
          wickerwork?: string[];
          largePackagings?: string[];
          packagingType?: string;
          note?: string;
          notes?: string[];
        };
        innerReceptacle?: {
          material?: string | string[];
          materials?: string[];
        };
        outerReceptacle?: {
          material?: string | string[];
          materials?: string[];
        };
        cylinderPackagingInstructions?: CylinderPackagingInstructions;
        notes?: string[];
      };
      // subParagraphs?: SubParagraphs;
    };
    liquidToxins?: {
      combinationPackaging: {
        innerPackaging: InnerPackaging;
        outerPackaging: OuterPackaging;
      };
      singlePackaging: {
        innerPackaging: {
          required: boolean;
        };
        outerPackaging: OuterPackaging;
      };
      compositePackaging: {
        innerReceptacle: InnerReceptacle;
        outerPackaging: OuterPackaging;
      };
    };
    solidToxins?: SolidToxins;
    subParagraphs?: SubParagraphs;
    dotCylinders?: {
      [key: string]: {
        instructions: string;
      };
    };
  }
>;

export type PackagingInstructions = {
  instructions: string;
  subParagraphs?: SubParagraphs;
  innerPackaging?: InnerPackaging;
  outerPackaging?: OuterPackaging;
};

export type SubParagraph = Record<string, PackagingInstructions>;

export type CylinderPackagingInstructions = Record<
  string,
  { instructions: string }
>;

export type QuantityLimits = {
  PG_I?: string | Record<string, string>;
  PG_II?: string | Record<string, string>;
  PG_III?: string | Record<string, string>;
};

export type InnerPackaging = {
  bags?: string[];
  receptacles?: string[];
  sheets?: string[];
  trays?: string[];
  tubes?: string[];
  reels?: string;
  dividingPartitions?: string[];
  required?: boolean;
  note?: string;
  notes?: string[];
  quantityLimits?: QuantityLimits;
};

export type OuterPackaging = {
  bags?: string[];
  boxes?: string[];
  drums?: string[];
  jerricans?: string[];
  barrels?: string[];
  largePackagings?: string[];
  packagingType?: string;
  note?: string;
  notes?: string[];
  quantityLimits?: QuantityLimits;
};

export type LiquidToxins = {
  combinationPackaging: {
    innerPackaging: InnerPackaging;
    outerPackaging: OuterPackaging;
  };
  singlePackaging: {
    innerPackaging: {
      required: boolean;
    };
    outerPackaging: OuterPackaging;
  };
  compositePackaging: {
    innerReceptacle: InnerReceptacle;
    outerPackaging: OuterPackaging;
  };
};

export type SolidToxins = {
  combinationPackaging: {
    innerPackaging: InnerPackaging;
    outerPackaging: OuterPackaging;
  };
  singlePackaging: {
    innerPackaging: {
      required: boolean;
    };
    outerPackaging: OuterPackaging & {
      boxesNote?: string;
      jerricansNote?: string;
    };
  };
  compositePackaging: {
    innerReceptacle: InnerReceptacle;
    outerPackaging: OuterPackaging;
  };
};

export type InnerReceptacle = {
  material?: string | string[];
  materials?: string[];
};

export type SubParagraphs = Record<
  string,
  | { instructions: string }
  | { instructions: string; subParagraphs: SubParagraphs }
  | {
      instructions: string;
      subParagraphs?: SubParagraphs;
      innerPackaging?: {
        bags?: string[];
        receptacles?: string[];
        sheets?: string[];
        trays?: string[];
        plastics?: string[];
        tubes?: string[];
        glass?: string[];
        reels?: string;
        dividingPartitions?: string[];
        required?: boolean;
        types?: string[];
        note?: string;
        notes?: string[];
      };
      outerPackaging?: {
        bags?: string[];
        boxes?: string[];
        drums?: string[];
        jerricans?: string[];
        barrel?: string[];
        barrels?: string[];
        plastics?: string[];
        other?: string[];
        wickerwork?: string[];
        largePackagings?: string[];
        packagingType?: string;
        note?: string;
        notes?: string[];
      };
    }
>;

export const packagingParagraphReferenceLookup: PackagingParagraphReferenceLookup =
  {
    "A5.3.": {
      description:
        "Ship according to a Special Approval (includes CAA or COE) issued for the particular item. See paragraphs 2.5. and 2.6. for more information on CAAs and COEs. Comply with the following handling instructions only when shipping items containing a fuel that is corrosive or toxic.",
      handlingInstructions:
        "Exercise extreme caution in handling this item. Keep well ventilated, away from sparks, fire hazards, and oxidizing materials. Vapors are toxic when inhaled. Liquid is corrosive. Fuel in presence of an oxidizer is self-igniting and highly reactive. Approved protective clothing, gloves, safety goggles, and a positive pressure breathing apparatus must be available during handling of this material, and worn when handling leaking packages.",
    },
    "A5.4.": {
      packagingInstructions: {
        drumPackagingInstructions: {
          description:
            "Fill the intermediate and outer packagings with an appropriate water-saturated material such as an anti-freeze solution or wetted cushioning. Outer packagings must be constructed and sealed to prevent evaporation of the wetting solution, (except UN0224 when shipped dry).",
          innerPackaging: {
            required: true,
            bags: [
              "Plastic textile",
              "Plastic coated or lined rubber textile",
              "Rubberized textile",
            ],
            receptacles: ["Wood"],
          },
          intermediatePackaging: {
            bags: [
              "Plastics",
              "Textile",
              "Plastic coated or lined rubber textile",
              "Rubberized textile bag",
            ],
            receptacles: ["Plastics", "Metal", "Wood"],
          },
          outerPackaging: {
            drums: [
              "Steel (1A1 or 1A2)",
              "Other metal (1N1 or 1N2)",
              "Plastic (1H1 or 1H2)",
            ],
          },
        },
        boxPackagingInstructions: {
          description:
            "Inner packagings must not contain more than 50 g of explosive substance (quantity corresponding to dry substance); separate inner packagings from each other with dividing partitions; and do not partition within the outer packaging with more than 25 compartments.",
          innerPackaging: {
            required: true,
            bags: ["Conductive rubber", "Conductive plastic"],
            receptacles: [
              "Metal",
              "Wood",
              "Conductive rubber",
              "Conductive plastic",
            ],
          },
          intermediatePackaging: {
            dividingPartitions: ["Metal", "Wood", "Plastic", "Fiberboard"],
          },
          outerPackaging: {
            boxes: [
              "Natural wood",
              "Sift-proof wall (4C2)",
              "Plywood (4D)",
              "Reconstituted wood (4F)",
            ],
          },
        },
      },
    },
    "A5.5.": {
      packagingInstructions: {
        innerPackaging: {
          required: true,
          bags: ["Waterproof paper", "Plastic", "Rubberized textile"],
          sheets: ["Plastic", "Rubberized textile"],
          receptacles: ["Wood"],
          note: "Inner packagings are not required for UN0159 when metal (1A1, 1A2, 1B1, 1B2, 1N1, or 1N2) or plastic (1H1 or 1H2) drums are used as the outer packaging.",
        },
        outerPackaging: {
          boxes: [
            "Steel (4A)",
            "Aluminum (4B)",
            "Other metal (4N)",
            "Fiberboard (4G)",
            "Ordinary wood (4C1)",
            "Natural sift-proof wood (4C2)",
            "Plywood (4D)",
            "Reconstituted wood (4F)",
            "Expanded plastic (4H1)",
            "Solid plastic (4H2)",
          ],
          drums: [
            "Steel (1A1 or 1A2)",
            "Aluminum (1B1 or 1B2)",
            "Other metal (1N1 or 1N2)",
            "Plastic (1H1 or 1H2)",
            "Plywood (1D)",
            "Fiberboard (1G)",
          ],
        },
      },
    },
    "A5.6.": {
      description:
        "Packaging must be lead free for UN0004, UN0076, UN0078, UN0154, UN0219, and UN0394.",
      packagingInstructions: {
        wettedSolids: {
          innerPackaging: {
            required: true,
            bags: [
              "Multiwall water resistant paper",
              "Plastic",
              "Textile",
              "Rubberized textile",
              "Woven plastic",
            ],
            receptacles: ["Metal", "Plastic", "Wood"],
          },
          intermediatePackaging: {
            bags: ["Plastics", "Plastic coated or lined rubber textile"],
            receptacles: ["Metal", "Plastic", "Wood"],
            notes: [
              "Intermediate packaging not required if leakproof drums are used as outer packaging or for UN0072 and UN0226",
            ],
          },
          outerPackaging: {
            boxes: [
              "Steel (4A)",
              "Aluminum (4B)",
              "Other metal (4N)",
              "Ordinary natural wood (4C1)",
              "Sift-proof natural wood (4C2)",
              "Plywood (4D)",
              "Reconstituted wood (4F)",
              "Fiberboard (4G)",
              "Expanded plastic (4H1)",
              "Solid plastic (4H2)",
            ],
            drums: [
              "Steel (1A1 or 1A2)",
              "Aluminum (1B1 or 1B2)",
              "Other metal (1N1 or 1N2)",
              "Plywood (1D)",
              "Fiber (1G)",
              "Plastic (1H1 or 1H2)",
            ],
          },
        },
        drySolidsOtherThanPowders: {
          innerPackaging: {
            required: true,
            bags: [
              "Kraft paper",
              "Multiwall water resistant paper",
              "Paper",
              "Plastic",
              "Textile",
              "Rubberized textile",
              "Woven plastic",
            ],
          },
          outerPackaging: {
            bags: [
              "Sift-proof woven plastic (5H2)",
              "Water-resistant woven plastic (5H3)",
              "Plastic film (5H4)",
              "Sift-proof textile (5L2)",
              "Water-resistant textile (5L3)",
              "Multiwall water-resistant paper (5M2)",
            ],
            boxes: [
              "Steel (4A)",
              "Aluminum (4B)",
              "Other metal (4N)",
              "Ordinary natural wood (4C1)",
              "Sift-proof natural wood (4C2)",
              "Plywood (4D)",
              "Reconstituted wood (4F)",
              "Fiberboard (4G)",
              "Expanded plastic (4H1)",
              "Solid plastic (4H2)",
            ],
            drums: [
              "Steel (1A1 or 1A2)",
              "Aluminum (1B1 or 1B2)",
              "Other metal (1N1 or 1N2)",
              "Plywood (1D)",
              "Fiber (1G)",
              "Plastic (1H1 or 1H2)",
            ],
            notes: [
              "For UN0029, bags, sift-proof (5H2) are recommended for flake or prilled TNT in the dry state and a maximum net mass of 30kg",
            ],
          },
        },
        solidDryPowders: {
          description: "At least one of the packagings must be sift-proof",
          innerPackaging: {
            required: true,
            bags: [
              "Multiwall water resistant paper",
              "Plastic",
              "Woven plastic",
            ],
            receptacles: ["Fiberboard", "Metal", "Plastic", "Wood"],
            note: "Inner packagings are not required if drums are used as the outer packaging.",
          },
          intermediatePackaging: {
            bags: [
              "Multiwall water resistant paper",
              "Plastic",
              "Woven plastic",
            ],
            receptacles: ["Fiberboard", "Metal", "Plastic", "Wood"],
          },
          outerPackaging: {
            boxes: [
              "Steel (4A)",
              "Aluminum (4B)",
              "Other metal (4N)",
              "Ordinary natural wood (4C1)",
              "Sift-proof natural wood (4C2)",
              "Plywood (4D)",
              "Reconstituted wood (4F)",
              "Fiberboard (4G)",
              "Solid plastic (4H2)",
            ],
            drums: [
              "Steel (1A1 or 1A2)",
              "Aluminum (1B1 or 1B2)",
              "Other metal (1N1 or 1N2)",
              "Plywood (1D)",
              "Fiber (1G)",
              "Plastic (1H1 or 1H2)",
            ],
            notes: [
              "For UN0029, bags, sift-proof (5H2) are recommended for flake or prilled TNT in the dry state and a maximum net mass of 30kg.",
            ],
          },
        },
      },
    },
    "A5.7.": {
      description: "Packaging must be lead free for UN0216 and UN0386.",
      packagingInstructions: {
        drySolidsOtherThanPowders: {
          innerPackaging: {
            required: true,
            bags: [
              "Kraft paper",
              "Multiwall water resistant paper",
              "Paper",
              "Plastic",
              "Textile",
              "Rubberized plastic textile",
              "Woven plastic",
            ],
            notes: [
              "Inner packaging not required for UN0222",
              "Packaging must be lead free for 0216 and 0386",
            ],
          },
          intermediatePackaging: {
            bags: ["Plastic", "Plastic coated or lined textile"],
            notes: [
              "Required for UN0150 only.",
              "Packaging must be lead free for 0216 and 0386",
            ],
          },
          outerPackaging: {
            bags: [
              "Sift-proof woven plastic (5H2)",
              "Water-resistant woven plastic (5H3)",
              "Plastic film (5H4)",
              "Sift-proof textile (5L2)",
              "Water-resistant textile (5L3)",
              "Multiwall water-resistant paper (5M2)",
            ],
            boxes: [
              "Steel (4A)",
              "Aluminum (4B)",
              "Other metal (4N)",
              "Ordinary natural wood (4C1)",
              "Sift-proof natural wood (4C2)",
              "Plywood (4D)",
              "Reconstituted wood (4F)",
              "Fiberboard (4G)",
              "Expanded plastic (4H1)",
              "Solid plastic (4H2)",
            ],
            drums: [
              "Steel (1A1 or 1A2)",
              "Aluminum (1B1 or 1B2)",
              "Other metal (1N1 or 1N2)",
              "Plywood (1D)",
              "Fiber (1G)",
              "Plastic (1H1 or 1H2)",
            ],
          },
        },
        solidDryPowders: {
          description: "At least one of the packagings must be sift-proof",
          innerPackaging: {
            required: true,
            bags: [
              "Multiwall water resistant paper",
              "Plastic",
              "Woven plastic",
            ],
            receptacles: ["Fiberboard", "Metal", "Plastic", "Wood"],
            notes: [
              "Inner packagings are not required if drums are used as the outer packaging.",
            ],
          },
          intermediatePackaging: {
            bags: [
              "Multiwall water resistant paper",
              "Plastic",
              "Woven plastic",
            ],
            receptacles: ["Fiberboard", "Metal", "Plastic", "Wood"],
          },
          outerPackaging: {
            boxes: [
              "Steel (4A)",
              "Aluminum (4B)",
              "Other metal (4N)",
              "Ordinary natural wood (4C1)",
              "Sift-proof natural wood (4C2)",
              "Plywood (4D)",
              "Reconstituted wood (4F)",
              "Fiberboard (4G)",
              "Solid plastic (4H2)",
            ],
            drums: [
              "Steel (1A1 or 1A2)",
              "Aluminum (1B1 or 1B2)",
              "Other metal (1N1 or 1N2)",
              "Plywood (1D)",
              "Fiber (1G)",
              "Plastic (1H1 or 1H2)",
            ],
            notes: [
              "At least one of the packagings must be sift-proof",
              "Packaging must be lead free for 0216 and 0386",
            ],
          },
        },
      },
    },
    "A5.8.": {
      description:
        "At least one of the packagings must be sift-proof. Do not package more than 50g (1.8oz) of flash powder (UN0094 or UN0305) in each inner packaging.",
      packagingInstructions: {
        innerPackaging: {
          required: true,
          bags: ["Paper", "Plastic", "Rubberized textile"],
          receptacles: ["Fiberboard", "Metal", "Plastic", "Wood"],
          sheets: ["Kraft paper", "Waxed paper (only authorized for UN0028)"],
          notes: [
            "At least one of the packagings must be sift-proof",
            "Do not package more than 50g (1.8oz) of flash powder (UN0094 or UN0305) in each inner packaging",
          ],
        },
        outerPackaging: {
          boxes: [
            "Steel (4A)",
            "Aluminum (4B)",
            "Ordinary natural wood (4C1)",
            "Sift-proof natural wood (4C2)",
            "Plywood (4D)",
            "Reconstituted wood (4F)",
            "Fiberboard (4G)",
            "Solid plastic (4H2)",
            "Other metal (4N)",
          ],
          drums: [
            "Steel (1A1 or 1A2)",
            "Aluminum (1B1 or 1B2)",
            "Plywood (1D)",
            "Fiber (1G)",
            "Plastic (1H1 or 1H2)",
            "Other metal (1N1 or 1N2)",
          ],
          notes: [
            "Inner packaging is not required for UN0027 packed in drums",
            "At least one of the packagings must be sift-proof",
            "Do not package more than 50g (1.8oz) of flash powder (UN0094 or UN0305) in each inner packaging",
          ],
        },
      },
    },
    "A5.9.": {
      description:
        "Packagings must be lead free for UN0077, UN0132, UN0234, UN0235 and UN0236. Use paragraph A5.9.1. for UN0342. Use paragraph A5.9.2. for UN0132, UN0160, UN0161, UN0406, UN0407, UN0448, UN0498, UN0499, and UN0509.",
      packagingInstructions: {
        wettedSolids: {
          innerPackaging: {
            required: true,
            bags: ["Plastic", "Textile", "Woven plastic"],
            receptacles: ["Metal", "Plastic", "Wood"],
            notes: [
              "Inner packaging not required for UN0342 when packed in outer 1A1, 1A2, 1B1, 1B2, 1N1, 1N2, 1H1, or 1H2 drums.",
            ],
          },
          intermediatePackaging: {
            bags: ["Plastic", "Plastic coated or lined textile"],
            receptacles: ["Metal", "Plastic"],
            dividingPartitions: ["Wood"],
            notes: [
              "Intermediate packaging not required if packed in outer leakproof removable head drum.",
            ],
          },
          outerPackaging: {
            boxes: [
              "Steel (4A)",
              "Ordinary natural wood (4C1)",
              "Sift-proof natural wood (4C2)",
              "Plywood (4D)",
              "Reconstituted wood (4F)",
              "Fiberboard (4G)",
              "Solid plastic (4H2)",
              "Other metal (4N)",
            ],
            drums: [
              "Steel (1A1 or 1A2)",
              "Aluminum (1B1 or 1B2)",
              "Plywood (1D)",
              "Fiber (1G)",
              "Plastic (1H1 or 1H2)",
              "Other metal (1N1 or 1N2)",
            ],
          },
        },
        drySolids: {
          innerPackaging: {
            required: true,
            bags: [
              "Kraft paper",
              "Plastic",
              "Sift-proof woven plastic or textile",
            ],
            receptacles: [
              "Fiberboard",
              "Metal",
              "Paper",
              "Plastic",
              "Wood",
              "Sift-proof woven plastic",
            ],
            notes: [
              "Inner packaging not required for UN0160 and UN0161 when packed in drums.",
            ],
          },
          outerPackaging: {
            boxes: [
              "Ordinary natural wood (4C1)",
              "Sift-proof natural wood (4C2)",
              "Plywood (4D)",
              "Reconstituted wood (4F)",
              "Fiberboard (4G)",
            ],
            drums: [
              "Steel (1A1 or 1A2)",
              "Aluminum (1B1 or 1B2)",
              "Plywood (1D)",
              "Fiber (1G)",
              "Plastic (1H1 or 1H2)",
              "Other metal (1N1 or 1N2)",
            ],
            notes: [
              "For UN0160 and 0161, 1A2, 1B2, and 1N2 drums must be constructed so that risk of explosion caused by increased internal pressure (from internal or external causes) is prevented.",
              "For UN0509, do not use metal packagings.",
            ],
          },
        },
      },
    },
    "A5.10.": {
      description:
        "Surround each inner packaging with sufficient amount of noncombustible absorbent material to absorb the entire contents. Cushion metal receptacles from each other in all directions. Liquid substances must not freeze at temperatures above -15 degrees C (5 degrees F). A composite packaging consisting of a plastic receptacle in a metal drum (6HA1) may be used instead of the inner and intermediate packagings.",
      packagingInstructions: {
        innerPackaging: {
          required: true,
          receptacles: ["Plastic", "Wood"],
          notes: [
            "Tape screw cap closures and do not exceed 5 liters capacity each when boxes are used as outer packagings (does not apply to UN0144). Metal receptacles are allowed for UN0144.",
          ],
        },
        intermediatePackaging: {
          bags: ["Plastic in metal receptacles"],
          drums: ["Metal"],
          receptacles: ["Wood"],
          notes: [
            "Intermediate packaging not required for UN0144. For UN0075, 0143, 0495 and 0497 use bags as intermediate packaging when boxes are used as outer packaging.",
          ],
        },
        outerPackaging: {
          boxes: [
            "Ordinary natural wood (4C1)",
            "Sift-proof natural wood (4C2)",
            "Plywood (4D)",
            "Reconstituted wood (4F)",
          ],
          drums: [
            "Steel (1A1 or 1A2)",
            "Aluminum (1B1 or 1B2)",
            "Plywood (1D)",
            "Fiber (1G)",
            "Plastic (1H1 or 1H2)",
            "Other metal (1N1 or 1N2)",
          ],
          notes: [
            "Maximum net mass for box must not exceed 30 kg.",
            "Fiberboard (4G) boxes may be used for UN0144.",
            "Maximum net volume for drum must not exceed 120 liters.",
            "For UN0144, aluminum drums (1B1 and 1B2) and other metal drums (1N1 and 1N2) must not be used.",
          ],
        },
      },
    },
    "A5.11.": {
      packagingInstructions: {
        innerPackaging: {
          required: true,
          bags: [
            "Paper",
            "Water and oil resistant plastic",
            "Textile",
            "Plastic coated or lined woven plastic",
            "Sift-proof",
          ],
          receptacles: [
            "Fiberboard",
            "Water-resistant metal",
            "Plastic",
            "Sift-proof wood",
          ],
          sheets: ["Water-resistant paper", "Waxed paper", "Plastic"],
          notes: [
            "Inner packaging not required for UN0082, UN0241, UN0331, and UN0332 if packed in a leakproof removable head outer drum.",
            "Inner packaging not required for UN0082, UN0241, UN0331, and UN0332 when the explosive is contained in a material that is impervious to liquid.",
            "Inner packaging not required for UN0081 when packed in rigid plastic that is impervious to liquid.",
            "Inner packaging not required for UN0331 when 5H2, 5H3, or 5H4 bags are used as outer packaging.",
          ],
        },
        outerPackaging: {
          boxes: [
            "Steel (4A)",
            "Aluminum (4B)",
            "Ordinary natural wood (4C1)",
            "Sift-proof natural wood (4C2)",
            "Plywood (4D)",
            "Reconstituted wood (4F)",
            "Fiberboard (4G)",
            "Solid plastic (4H2)",
            "Other metal (4N)",
          ],
          drums: [
            "Steel (1A1 or 1A2)",
            "Aluminum (1B1 or 1B2)",
            "Plywood (1D)",
            "Fiber (1G)",
            "Plastic (1H1 or 1H2)",
            "Other metal (1N1 or 1N2)",
          ],
          jerricans: ["Steel (3A1 or 3A2)", "Plastic (3H1 or 3H2)"],
          bags: [
            "Woven plastic (5H1, 5H2, or 5H3)",
            "Multiwall water-resistant paper (5M2)",
            "Plastic film (5H4)",
            "Sift-proof textile (5L2)",
            "Water-resistant textile (5L3)",
          ],
          note: "Do not use any bags for UN0081.",
        },
      },
    },
    "A5.12.": {
      packagingInstructions: {
        innerPackaging: {
          required: false,
          notes: [
            "A5.12.2. Large and Robust Articles of UN numbers UN0006, UN0009, UN0010, UN0015, UN0016, UN0018, UN0019, UN0034, UN0035, UN0038, UN0039, UN0048, UN0056, UN0137, UN0138, UN0168, UN0169, UN0171, UN0181, UN0182, UN0183, UN0186, UN0221, UN0238, UN0243, UN0244, UN0245, UN0246, UN0254, UN0280, UN0281, UN0286, UN0287, UN0297, UN0299, UN0300, UN0301, UN0303, UN0321, UN0328, UN0329, UN0344, UN0345, UN0346, UN0347, UN0362, UN0363, UN0370, UN0412, UN0424, UN0425, UN0434, UN0435, UN0436, UN0437, UN0438, UN0451, UN0459 and UN0488. Large and robust articles without their means of initiation, or with their means of initiation containing at least two effective protective features, may be carried unpacked provided that a negative result was obtained in Test Series 4 of the UN Manual of Tests and Criteria on an unpackaged article. When such articles have propelling charges or are self-propelled, protect their ignition systems against stimuli encountered during normal conditions of transport. Ship such articles in DODapproved containers, crates, cradles, or other suitable handling, storage, or launching devices which have been tested to show that they will not become loose during normal conditions of transport.",
          ],
        },
        outerPackaging: {
          boxes: [
            "Steel (4A)",
            "Aluminum (4B)",
            "Ordinary natural wood (4C1)",
            "Sift-proof natural wood (4C2)",
            "Plywood (4D)",
            "Reconstituted wood (4F)",
            "Fiberboard (4G)",
            "Expanded plastic (4H1)",
            "Solid plastic (4H2)",
            "Other metal (4N)",
          ],
          drums: [
            "Steel (1A1 or 1A2)",
            "Aluminum (1B1 or 1B2)",
            "Plywood (1D)",
            "Fiber (1G)",
            "Plastic (1H1 or 1H2)",
            "Other metal (1N1 or 1N2)",
          ],
          largePackagings: [
            "Steel (50A)",
            "Aluminum (50B)",
            "Natural wood (50C)",
            "Plywood (50D)",
            "Reconstituted wood (50F)",
            "Rigid fiberboard (50G)",
            "Rigid plastic (50H)",
            "Other metal (50N)",
          ],
          notes: [
            "A5.12.2. Large and Robust Articles of UN numbers UN0006, UN0009, UN0010, UN0015, UN0016, UN0018, UN0019, UN0034, UN0035, UN0038, UN0039, UN0048, UN0056, UN0137, UN0138, UN0168, UN0169, UN0171, UN0181, UN0182, UN0183, UN0186, UN0221, UN0238, UN0243, UN0244, UN0245, UN0246, UN0254, UN0280, UN0281, UN0286, UN0287, UN0297, UN0299, UN0300, UN0301, UN0303, UN0321, UN0328, UN0329, UN0344, UN0345, UN0346, UN0347, UN0362, UN0363, UN0370, UN0412, UN0424, UN0425, UN0434, UN0435, UN0436, UN0437, UN0438, UN0451, UN0459 and UN0488. Large and robust articles without their means of initiation, or with their means of initiation containing at least two effective protective features, may be carried unpacked provided that a negative result was obtained in Test Series 4 of the UN Manual of Tests and Criteria on an unpackaged article. When such articles have propelling charges or are self-propelled, protect their ignition systems against stimuli encountered during normal conditions of transport. Ship such articles in DODapproved containers, crates, cradles, or other suitable handling, storage, or launching devices which have been tested to show that they will not become loose during normal conditions of transport.",
          ],
        },
      },
    },
    "A5.13.": {
      description:
        "Inner packagings are not required when detonators are packed in pasteboard tubes, or when their leg wires are wound on spools with the caps either placed inside the spool or securely taped to the wire on the spool, restricting movement of the caps and protecting from impact.",
      packagingInstructions: {
        innerPackaging: {
          required: true,
          bags: ["Paper", "Plastic"],
          receptacles: ["Fiberboard", "Metal", "Plastic", "Wood"],
          reels: "Reels",
        },
        outerPackaging: {
          boxes: [
            "Steel (4A)",
            "Aluminum (4B)",
            "Ordinary natural wood (4C1)",
            "Sift-proof natural wood (4C2)",
            "Plywood (4D)",
            "Reconstituted wood (4F)",
            "Fiberboard (4G)",
            "Solid plastic (4H2)",
            "Other metal (4N)",
          ],
          drums: [
            "Steel (1A1 or 1A2)",
            "Aluminum (1B1 or 1B2)",
            "Plywood (1D)",
            "Fiber (1G)",
            "Plastic (1H1 or 1H2)",
            "Other metal (1N1 or 1N2)",
          ],
        },
      },
    },
    "A5.14.": {
      description:
        "For detonators assemblies (UN0360, UN0361, UN0500), detonators are not required to be attached to the safety fuse, metal clad mild detonating cord, detonating cord, or shock tube. Inner packagings are not required if the packing configuration restricts free movement of the caps and protects them from impact forces. ",
      packagingInstructions: {
        innerPackaging: {
          required: true,
          bags: ["Paper", "Plastic"],
          receptacles: ["Fiberboard", "Metal", "Plastic", "Wood"],
          reels: "Reels",
          note: "For UN0029, UN0267, and UN0455, do not use bags and reels as inner packagings.",
        },
        outerPackaging: {
          boxes: [
            "Steel (4A)",
            "Aluminum (4B)",
            "Ordinary natural wood (4C1)",
            "Sift-proof natural wood (4C2)",
            "Plywood (4D)",
            "Reconstituted wood (4F)",
            "Fiberboard (4G)",
            "Solid plastic (4H2)",
            "Other metal (4N)",
          ],
          drums: [
            "Steel (1A1 or 1A2)",
            "Aluminum (1B1 or 1B2)",
            "Plywood (1D)",
            "Fiber (1G)",
            "Plastic (1H1 or 1H2)",
            "Other metal (1N1 or 1N2)",
          ],
        },
      },
    },
    "A5.15.": {
      packagingInstructions: {
        packagingA5_15_1: {
          description:
            "These are packaging options for articles consisting of closed metal, plastic, or fiberboard casing.",
          innerPackaging: {
            required: false,
            note: "Inner packaging not required.",
          },
          outerPackaging: {
            boxes: [
              "Steel (4A)",
              "Aluminum (4B)",
              "Ordinary natural wood (4C1)",
              "Sift-proof natural wood (4C2)",
              "Plywood (4D)",
              "Reconstituted wood (4F)",
              "Fiberboard (4G)",
              "Solid plastic (4H2)",
              "Other metal (4N)",
            ],
          },
        },
        packagingA5_15_2: {
          description:
            "These are packaging options for articles without closed casings in combination packages.",
          innerPackaging: {
            required: true,
            receptacles: ["Fiberboard", "Metal", "Plastic", "Wood"],
            sheets: ["Paper", "Plastic"],
          },
          outerPackaging: {
            boxes: [
              "Steel (4A)",
              "Aluminum (4B)",
              "Ordinary natural wood (4C1)",
              "Sift-proof natural wood (4C2)",
              "Plywood (4D)",
              "Reconstituted wood (4F)",
              "Fiberboard (4G)",
              "Solid plastic (4H2)",
              "Other metal (4N)",
            ],
          },
        },
      },
    },
    "A5.16.": {
      packagingInstructions: {
        innerPackaging: {
          required: true,
          receptacles: ["Fiberboard", "Metal", "Plastic", "Wood"],
          trays: ["Fiberboard", "Plastics", "Wood"],
          note: "Do not use trays for UN0043, UN0212, UN0225, UN0268, or UN0306.",
        },
        intermediatePackaging: {
          receptacles: ["Fiberboard", "Metal", "Plastic", "Wood"],
          note: "Intermediate packaging only required when trays are used as inner packaging.",
        },
        outerPackaging: {
          boxes: [
            "Steel (4A)",
            "Aluminum (4B)",
            "Ordinary natural wood (4C1)",
            "Sift-proof natural wood (4C2)",
            "Plywood (4D)",
            "Reconstituted wood (4F)",
            "Fiberboard (4G)",
            "Solid plastic (4H2)",
            "Other metal (4N)",
          ],
        },
      },
    },
    "A5.17.": {
      packagingInstructions: {
        innerPackaging: {
          required: true,
          bags: ["Water resistant"],
          receptacles: ["Fiberboard", "Metal", "Plastic", "Wood"],
          sheets: ["Corrugated fiberboard"],
          tubes: ["Fiberboard"],
        },
        outerPackaging: {
          boxes: [
            "Steel (4A)",
            "Aluminum (4B)",
            "Ordinary natural wood (4C1)",
            "Sift-proof natural wood (4C2)",
            "Plywood (4D)",
            "Reconstituted wood (4F)",
            "Fiberboard (4G)",
            "Expanded plastics (4H1)",
            "Solid plastics (4H2)",
            "Other metal (4N)",
          ],
          drums: [
            "Steel (1A1 or 1A2)",
            "Aluminum (1B1 or 1B2)",
            "Plywood (1D)",
            "Fiberboard (1G)",
            "Plastic (1H1 or 1H2)",
            "Other metal (1N1 or 1N2)",
          ],
        },
      },
    },
    "A5.18.": {
      packagingInstructions: {
        innerPackaging: {
          required: true,
          bags: ["Paper", "Plastic"],
          receptacles: ["Fiberboard", "Metal", "Plastic", "Wood"],
          sheets: ["Paper", "Plastic"],
        },
        outerPackaging: {
          boxes: [
            "Steel (4A)",
            "Aluminum (4B)",
            "Ordinary natural wood (4C1)",
            "Sift-proof natural wood (4C2)",
            "Plywood (4D)",
            "Reconstituted wood (4F)",
            "Fiberboard (4G)",
            "Expanded plastics (4H1)",
            "Solid plastics (4H2)",
            "Other metal (4N)",
          ],
          drums: [
            "Steel (1A1 or 1A2)",
            "Aluminum (1B1 or 1B2)",
            "Plywood (1D)",
            "Fiber (1G)",
            "Plastic (1H1 or 1H2)",
            "Other metal (1N1 or 1N2)",
          ],
        },
      },
    },
    "A5.19.": {
      packagingInstructions: {
        innerPackaging: {
          required: true,
          bags: ["Plastic", "Textile"],
          boxes: ["Fiberboard", "Plastic", "Wood"],
          dividingPartitions: ["Within outer packaging"],
        },
        outerPackaging: {
          boxes: [
            "Steel (4A)",
            "Aluminum (4B)",
            "Ordinary natural wood (4C1)",
            "Sift-proof natural wood (4C2)",
            "Plywood (4D)",
            "Reconstituted wood (4F)",
            "Fiberboard (4G)",
            "Solid plastics (4H2)",
            "Other metal (4N)",
          ],
          drums: [
            "Steel (1A1 or 1A2)",
            "Aluminum (1B1 or 1B2)",
            "Plywood (1D)",
            "Fiber (1G)",
            "Plastic (1H1 or 1H2)",
            "Other metal (1N1 or 1N2)",
          ],
        },
      },
    },
    "A5.20.": {
      description:
        "For UN0059, UN0439, UN0440, and UN0441, when shaped charges are packed singly, the conical cavity must face downwards and the package marked with orientation markings meeting the requirements of 49 CFR Subparagraph 172.312(a)(2). When shaped charges are packed in pairs, the conical cavities must face inwards.",
      packagingInstructions: {
        innerPackaging: {
          required: true,
          bags: ["Plastic"],
          boxes: ["Fiberboard", "Wood"],
          tubes: ["Fiberboard", "Metal", "Plastic"],
          dividingPartitions: ["Dividing partitions within outer packaging"],
        },
        outerPackaging: {
          boxes: [
            "Steel (4A)",
            "Aluminum (4B)",
            "Ordinary natural wood (4C1)",
            "Sift-proof natural wood (4C2)",
            "Plywood (4D)",
            "Reconstituted wood (4F)",
            "Fiberboard (4G)",
            "Solid plastic (4H2)",
            "Other metal (4N)",
          ],
          drums: [
            "Steel (1A1 or 1A2)",
            "Aluminum (1B1 or 1B2)",
            "Plywood (1D)",
            "Fiber (1G)",
            "Plastic (1H1 or 1H2)",
            "Other metal (1N1 or 1N2)",
          ],
        },
      },
    },
    "A5.21.": {
      packagingInstructions: {
        innerPackaging: {
          required: true,
          bags: ["Plastic"],
          note: "If ends of articles are sealed, inner packaging is not required.",
        },
        outerPackaging: {
          boxes: [
            "Steel (4A)",
            "Aluminum (4B)",
            "Ordinary natural wood (4C1)",
            "Sift-proof natural wood (4C2)",
            "Plywood (4D)",
            "Reconstituted wood (4F)",
            "Fiberboard (4G)",
            "Solid plastic (4H2)",
            "Other metal (4N)",
          ],
          drums: [
            "Steel (1A1 or 1A2)",
            "Aluminum (1B1 or 1B2)",
            "Fiber (1G)",
            "Plastic (1H1 or 1H2)",
            "Other metal (1N1 or 1N2)",
          ],
        },
      },
    },
    "A5.22.": {
      description: "Seal ends of the detonating cord and fasten securely.",
      packagingInstructions: {
        innerPackaging: {
          required: true,
          bags: ["Plastic"],
          receptacles: ["Fiberboard", "Metal", "Plastic", "Wood"],
          sheets: ["Paper", "Plastic"],
          reels: "",
          notes: [
            "For UN0065, 0104, 0289, 0290, the ends of the detonating cord are not required to be sealed provided the inner packaging containing the detonating cord consists of a static-resistant plastic bag of at least 3 mil thickness and the bag is securely closed.",
            "Inner packaging is not required for UN0065 and UN0289 when securely fastened in coils.",
          ],
        },
        outerPackaging: {
          boxes: [
            "Steel (4A)",
            "Aluminum (4B)",
            "Ordinary natural wood (4C1)",
            "Sift-proof natural wood (4C2)",
            "Plywood (4D)",
            "Reconstituted wood (4F)",
            "Fiberboard (4G)",
            "Solid plastics (4H2)",
            "Other metal (4N)",
          ],
          drums: [
            "Steel (1A1 or 1A2)",
            "Aluminum (1B1 or 1B2)",
            "Plywood (1D)",
            "Fiber (1G)",
            "Plastic (1H1 or 1H2)",
            "Other metal (1N1 or 1N2)",
          ],
        },
      },
    },
    "A5.23.": {
      description:
        "For UN0101, do not use steel, aluminum, or other metal packaging and the packaging must be sift-proof unless the fuse is covered by a paper tube and both ends of the tube are covered with removable caps.",
      packagingInstructions: {
        innerPackaging: {
          required: true,
          bags: ["Plastic"],
          sheets: ["Kraft paper", "Plastic"],
          receptacles: ["Wood"],
          note: "Inner packaging not required for UN0105 if ends are sealed.",
        },
        outerPackaging: {
          boxes: [
            "Steel (4A)",
            "Aluminum (4B)",
            "Ordinary natural wood (4C1)",
            "Sift-proof natural wood (4C2)",
            "Plywood (4D)",
            "Reconstituted wood (4F)",
            "Fiberboard (4G)",
            "Solid plastics (4H2)",
          ],
          drums: [
            "Steel (1A1 or 1A2)",
            "Aluminum (1B1 or 1B2)",
            "Plywood (1D)",
            "Fiber (1G)",
            "Plastic (1H1 or 1H2)",
            "Other metal (1N1 or 1N2)",
          ],
        },
      },
    },
    "A5.24.": {
      packagingInstructions: {
        innerPackaging: {
          required: true,
          receptacles: ["Fiberboard", "Metal", "Plastic", "Wood"],
          trays: ["Plastic", "Wood"],
          dividingPartitions: ["Dividing partitions in the outer packaging"],
        },
        outerPackaging: {
          boxes: [
            "Steel (4A)",
            "Aluminum (4B)",
            "Ordinary natural wood (4C1)",
            "Sift-proof natural wood (4C2)",
            "Plywood (4D)",
            "Reconstituted wood (4F)",
            "Fiberboard (4G)",
            "Solid plastics (4H2)",
            "Other metal (4N)",
          ],
          drums: [
            "Steel (1A1 or 1A2)",
            "Aluminum (1B1 or 1B2)",
            "Plywood (1D)",
            "Fiber (1G)",
            "Plastic (1H1 or 1H2)",
            "Other metal (1N1 or 1N2)",
          ],
        },
      },
    },
    "A5.25.": {
      packagingInstructions: {
        innerPackaging: {
          required: true,
          bags: ["Paper", "Plastic"],
          receptacles: ["Fiberboard", "Metal", "Plastic", "Wood"],
          sheets: ["Paper"],
          trays: ["Plastic"],
        },
        outerPackaging: {
          boxes: [
            "Steel (4A)",
            "Aluminum (4B)",
            "Ordinary natural wood (4C1)",
            "Sift-proof natural wood (4C2)",
            "Plywood (4D)",
            "Reconstituted wood (4F)",
            "Fiberboard (4G)",
            "Solid plastics (4H2)",
            "Other metal (4N)",
          ],
          drums: [
            "Steel (1A1 or 1A2)",
            "Aluminum (1B1 or 1B2)",
            "Plywood (1D)",
            "Fiber (1G)",
            "Plastic (1H1 or 1H2)",
            "Other metal (1N1 or 1N2)",
          ],
        },
      },
    },
    "A5.26.": {
      description:
        "Ensure metal packagings are constructed so that risk of explosion, by reason of increase in internal pressure (from internal or external causes), is prevented.",
      packagingInstructions: {
        combinationPackaging: {
          innerPackaging: {
            required: true,
            bags: ["Kraft paper", "Plastic", "Textile", "Rubberized textile"],
            receptacles: ["Fiberboard", "Metal", "Plastic", "Wood"],
            trays: ["Plastic", "Wood"],
          },
          outerPackaging: {
            boxes: [
              "Steel (4A)",
              "Aluminum (4B)",
              "Ordinary natural wood (4C1)",
              "Sift-proof natural wood (4C2)",
              "Plywood (4D)",
              "Reconstituted wood (4F)",
              "Fiberboard (4G)",
              "Solid plastics (4H2)",
              "Other metal (4N)",
            ],
            drums: [
              "Steel (1A1 or 1A2)",
              "Aluminum (1B1 or 1B2)",
              "Plywood (1D)",
              "Fiber (1G)",
              "Plastic (1H1 or 1H2)",
              "Other metal (1N1 or 1N2)",
            ],
          },
        },
        singlePackaging: {
          innerPackaging: {
            required: true,
            bags: ["Kraft paper", "Plastic", "Textile", "Rubberized textile"],
            receptacles: ["Fiberboard", "Metal", "Plastic", "Wood"],
            trays: ["Plastic", "Wood"],
          },
          outerPackaging: {
            boxes: [
              "Steel (4A)",
              "Aluminum (4B)",
              "Ordinary natural wood (4C1)",
              "Sift-proof natural wood (4C2)",
              "Plywood (4D)",
              "Reconstituted wood (4F)",
              "Fiberboard (4G)",
              "Solid plastics (4H2)",
              "Other metal (4N)",
            ],
            drums: [
              "Steel (1A1 or 1A2)",
              "Aluminum (1B1 or 1B2)",
              "Plywood (1D)",
              "Fiber (1G)",
              "Plastic (1H1 or 1H2)",
              "Other metal (1N1 or 1N2)",
            ],
          },
        },
        compositePackaging: {
          innerPackaging: {
            required: false,
            note: "Inner packaging not required with use of 6HH2 package.",
          },
          outerPackaging: {
            packagingType: "Plastic receptacle with outer solid box (6HH2)",
          },
        },
      },
    },
    "A5.27.": {
      description:
        "Large and robust articles without their means of initiation, or with their means of initiation containing at least two effective protective features, may be carried unpacked provided that a negative result was obtained in Test Series 4 of the UN Manual of Tests and Criteria on an unpackaged article. When such articles have propelling charges or are self-propelled, protect their ignition systems against stimuli encountered during normal conditions of transport. Such articles will be in DOD-approved containers, crates, cradles, or other suitable handling, storage, or launching devices which have been tested to show that they will not become loose during normal conditions of transport. Articles must contain at least two independent features which prevent the ingress of water.",
      packagingInstructions: {
        innerPackaging: {
          required: true,
          receptacles: ["Fiberboard", "Metal", "Plastic", "Wood"],
          dividingPartitions: ["Dividing partitions in the outer packaging"],
        },
        outerPackaging: {
          boxes: [
            "Steel (4A)",
            "Aluminum (4B)",
            "Ordinary natural wood (4C1) with metal liner",
            "Plywood (4D) with metal liner",
            "Reconstituted wood (4F) with metal liner",
            "Expanded plastic (4H1)",
            "Solid plastic (4H2)",
            "Other metal (4N)",
          ],
          drums: [
            "Steel (1A1 or 1A2)",
            "Aluminum (1B1 or 1B2)",
            "Plywood (1D)",
            "Plastic (1H1 or 1H2)",
            "Other metal (1N1 or 1N2)",
          ],
          note: "Seal packagings against the ingress of water.",
        },
      },
    },
    "A7.2.": {
      description: "Packaging for Class 3 Materials is as follows:",
      packagingInstructions: {
        combinationPackaging: {
          innerPackaging: {
            required: true,
            receptacles: ["Glass", "Earthenware", "Plastic", "Metal"],
            notes: [
              "For PG I material, pack inner packagings in a rigid and leakproof receptacle or intermediate packaging containing sufficient absorbent material to absorb the entire contents of all inner packagings before packing the inner packaging(s) in the outer package.",
              "Ensure inner packaging or receptacle closures of combination packages containing liquids are held securely, tightly, and effectively in place by secondary means. See A20.3.",
            ],
          },
          outerPackaging: {
            drums: [
              "Removable head steel (1A2)",
              "Removable head aluminum (1B2)",
              "Removable head metal other than steel or aluminum (1N2)",
              "Plywood (1D)",
              "Fiber (1G)",
              "Removable head plastic (1H2)",
            ],
            boxes: [
              "Steel (4A)",
              "Aluminum (4B)",
              "Ordinary natural wood (4C1)",
              "Sift-proof natural wood (4C2)",
              "Plywood (4D)",
              "Reconstituted wood (4F)",
              "Fiberboard (4G)",
              "Expanded plastic (4H1)",
              "Solid plastic (4H2)",
            ],
            jerricans: [
              "Removable head steel (3A2)",
              "Plastic removable head (3H2)",
              "Aluminum removable head (3B2)",
            ],
            barrel: ["Wooden (2C2)"],
            notes: ["Wood barrels not authorized for PG I material."],
          },
        },
        singlePackaging: {
          innerPackaging: {
            required: false,
          },
          outerPackaging: {
            drums: [
              "Steel (1A1)",
              "Removable head steel (1A2)",
              "Aluminum (1B1)",
              "Removable head aluminum (1B2)",
              "Metal drum other than steel or aluminum (1N1)",
              "Removable head metal other than steel or aluminum (1N2)",
              "Fiber (1G) with liner",
              "Plastic (1H1 or 1H2)",
            ],
            jerricans: [
              "Steel (3A1 or 3A2)",
              "Aluminum (3B1 or 3B2)",
              "Plastic (3H1 or 3H2)",
            ],
            barrel: ["Wooden (2C1)"],
            notes: [
              "Fiber drum with liner only authorized for PG II or PG III material.",
              "Wooden Barrels not authorized for PG I material.",
            ],
          },
        },
        compositePackagingWithPlasticInnerReceptacles: {
          innerPackaging: {
            required: true,
            receptacles: ["Plastic"],
          },
          outerPackaging: {
            boxes: [
              "Steel (6HA2)",
              "Aluminum (6HB2)",
              "Wooden (6HC)",
              "Plywood (6HD2)",
              "Fiberboard (6HG2)",
            ],
            drums: [
              "Steel (6HA1)",
              "Aluminum (6HB1)",
              "Fiber (6HG1)",
              "Plastic (6HH1)",
              "Plywood (6HD1)",
            ],
            note: "Plywood drum (6HD1) only authorized for PG II or PG III.",
          },
        },
        compositePackagingWithGlassPorcelainOrStonewareInnerReceptacles: {
          innerReceptacle: {
            materials: ["Glass", "Porcelain", "Stoneware"],
          },
          outerPackaging: {
            drums: [
              "Steel (6PA1)",
              "Aluminum (6PB1)",
              "Fiber (6PG1)",
              "Plywood drum (6PD1)",
              "Wickerwork hamper (6PD2)",
            ],
            boxes: [
              "Steel (6PA2)",
              "Aluminum (6PB2)",
              "Wooden (6PC)",
              "Fiberboard (6PG2)",
              "Solid plastic (6PH1)",
              "Expanded plastic packaging (6PH2)",
            ],
            notes: [
              "Plywood drum (6PD1) and wickerwork hamper (6PD2) only authorized for PG II or PG III.",
            ],
          },
        },
        subParagraphs: {
          "A7.2.5.": {
            instructions:
              "DOT Cylinders. DOT specification cylinders as prescribed for any compressed gas, except acetylene (DOT 8, DOT 8AL) and DOT 3HT.",
          },
          "A7.2.6.": {
            instructions:
              "DOT 5L Jerrican. Drain DOT 5L jerry cans to the maximum extent possible.",
          },
          "A7.2.7.": {
            instructions:
              "MIL-D-23119 500-gallon capacity collapsible fabric drums authorized under mobility operations conducted according to DTR 4500.9-R, Part III. Drain five hundred (500) gallon fabric drums shipped on other than mobility missions to the greatest extent possible.",
          },
          "A7.2.8.": {
            instructions:
              "Bulk Fuel. Except as authorized in this manual, servicing trucks, trailers, semitrailers, or storage tanks containing bulk fuel, or any bulk hazardous material may not be transported by air. The following draining/purging requirements apply, as appropriate:",
            subParagraphs: {
              "A7.2.8.1.": {
                instructions:
                  "Purge bulk tanks for all liquids with a flash point below 38 degrees C (100 degrees F), regardless of whether the technical manual only requires draining. If other hazardous materials are present, certify to the appropriate packaging paragraph. If no other hazards are present, comply with paragraph A3.1.16.4. to identify purged tanks.",
              },
              "A7.2.8.2.": {
                instructions:
                  "Drain, but need not purge, liquids with a flash point at or above 38 degrees C (100 degrees F), unless the technical manual specifically requires purging. If other hazardous materials are present, certify to the appropriate packaging paragraph.",
              },
              "A7.2.8.3.": {
                instructions:
                  "Transport bulk combustible liquids flash points above 60 degrees C (140 degrees F) in UN specification packaging (e.g., IBCs) meeting air eligibility requirements of paragraph A3.1.7.2. for PG III.",
              },
            },
          },
        },
      },
    },
    "A7.3.": {
      description:
        "Package Refrigerating Machines as follows: A refrigerating machine assembled for shipment and containing 7 kg (15 pounds) or less of flammable liquid for operation in a strong, tight receptacle is excepted from specification packaging, marking, and labeling except for the PSN of the flammable liquid.",
    },
    "A7.4.": {
      handlingInstructions: {
        "A7.4.1.": {
          instructions:
            "In the event of a leak during transportation of hydrazine, crew members use their aircraft oxygen masks in a positive pressure mode.",
        },
      },
      packagingInstructions: {
        subParagraphs: {
          "A7.4.2.": {
            instructions:
              "Aircraft hydraulic power unit fuel tanks containing a mixture of anhydrous hydrazine and monomethyl hydrazine (M86 fuel) and designed for installation as complete units in aircraft are excepted from specification packaging requirements if the units comply with one of the following:",
            subParagraphs: {
              "A7.4.2.1.": {
                instructions:
                  "Units consisting of an aluminum pressure vessel made from tubing and having welded heads. Primary containment of the fuel within this vessel consists of a welded aluminum bladder having a maximum internal volume of 46 L (12 gallons). The outer vessel has a minimum design gauge pressure of 1,275 kPa (185 psig) and a minimum burst gauge pressure of 2,755 kPa (400 psig). Leak-check each vessel during manufacture and before shipment and ensure the vessel is found leak proof. Securely pack the complete inner unit in noncombustible cushioning material, and in a strong outer tightly closed metal packaging that adequately protects all fittings. The maximum quantity of fuel per unit and package is 42 L (11 gallons).",
              },
              "A7.4.2.2.": {
                instructions:
                  "Units consisting of an aluminum pressure vessel. Primary containment of the fuel within this vessel consisting of a welded hermetically sealed fuel compartment with an elastomeric bladder having a maximum internal volume of 46 L (12 gallons). The pressure vessel requires a minimum design gauge pressure of 2,860 kPa (415 psig) and a minimum burst gauge pressure of 5,170 kPa (750 psig). Leak-check each vessel during manufacture and before shipment and ensure the vessel is found leak proof. Securely pack the complete inner unit in noncombustible cushioning material, and in a strong outer tightly closed metal packaging that adequately protects all fittings. The maximum quantity of fuel per unit and package is 42 L (11 gallons).",
              },
            },
          },
        },
      },
    },
    "A7.5.": {
      description:
        "Packaging for Class 3 Materials, Poisonous by Inhalation (Hazard Zone A or B). Package Class 3 materials with an Inhalation Hazard (Hazard Zone A and B) as follows:",
      handlingInstructions: {
        "A7.5.1.": {
          instructions:
            "These items are extremely dangerous. Make approved chemical safety mask and clothing available when handling this material, and wear when handling leaking packages.",
        },
      },
      dotCylinders: {
        "A7.5.2.": {
          instructions:
            "Package in DOT specification cylinders as identified in 49 CFR Part 178 Subpart C, except that specification 8, 8AL, and 39 cylinders are not authorized. Cylinders must also meet the requirements of A3.3.2.",
        },
      },
      packagingInstructions: {
        subParagraphs: {
          "A7.5.3.": {
            instructions:
              "Pack in an inner drum (1A1, 1B1, 1H1, 1N1, or 6HA1), then place in an outer drum (1A2 or 1H2). Both the inner and outer drum must be tested to the PG I performance level. Ensure the outer 1A2 drum has a minimum thickness of 1.35 mm (0.053 inches). Ensure the outer 1H2 drum has a minimum thickness of 6.30 mm (0.248 inches). The capacity of the inner drum (1A1, 1B1, or 1N1) may not exceed 220 L (58 gallons). Cushion the inner drum within the outer drum with a shock-mitigating, non-reactive material. Ensure there is a minimum of 5.0 cm (2 inches) of cushioning material between the outer surface (side) of the inner drum and the inner surface (side) of the outer drum. There must also be at least 7.6 cm (3 inches) of cushioning material between the outer surface (top and bottom) of the inner drum and the inner surface (top and bottom) of the outer drum. The inner drum must also meet all of the following requirements:",
            subParagraphs: {
              "A7.5.3.1.": {
                instructions:
                  "Satisfactorily withstand a hydrostatic pressure test (as outlined in 49 CFR Section 178.605) of 100 kPa (15 psig) for outer drums and 300 kPa (45psig) for inner drums.",
              },
              "A7.5.3.2.": {
                instructions:
                  "Satisfactorily withstand a leak proof test (as outlined in 49 CFR Section 178.604) using an internal air pressure at 55 degrees C (131 degrees F) of at least twice the vapor pressure of the material to be packaged.",
              },
              "A7.5.3.3.": {
                instructions:
                  "Have screw-type closures that meet all the following requirements:",
                subParagraphs: {
                  "A7.5.3.3.1.": {
                    instructions:
                      "Closed and tightened to a torque as prescribed by the closure manufacturer, using a device that is capable of measuring torque.",
                  },
                  "A7.5.3.3.2.": {
                    instructions:
                      "Physically held in place by any means capable of preventing backoff or loosening of the closure by impact or vibration during transportation.",
                  },
                },
              },
              "A7.5.3.4.": {
                instructions:
                  "Provided with a cap seal that is properly applied according to the cap seal manufacturer's recommendations. The cap seal must be capable of withstanding an internal pressure of at least 100 kPa (15 psi).",
              },
              "A7.5.3.5.": {
                instructions:
                  "For Zone A materials, meet the following minimum inner drum thickness requirements:",
                subParagraphs: {
                  "A7.5.3.5.1.": {
                    instructions: "1A1 and 1N1 drums- 1.3 mm (0.051 inch)",
                  },
                  "A7.5.3.5.2.": {
                    instructions: "1B1 drums- 3.9 mm (0.154 inch)",
                  },
                  "A7.5.3.5.3.": {
                    instructions: "1H1 drums- 3.16 mm (0.124 inch)",
                  },
                  "A7.5.3.5.4.": {
                    instructions:
                      "6HA1 drums- the plastic inner container must be 1.58 mm (0.0622 inch) and the outer steel drum must be 0.96 mm (0.0378 inch)",
                  },
                },
              },
              "A7.5.3.6.": {
                instructions:
                  "For Zone B materials, meet the following minimum inner drum thickness requirements:",
                subParagraphs: {
                  "A7.5.3.6.1.": {
                    instructions: "1A1 and 1N1 drums- 0.69 mm (0.027 inch)",
                  },
                  "A7.5.3.6.2.": {
                    instructions: "1B1 drums- 3.9 mm (0.154 inch)",
                  },
                  "A7.5.3.6.3.": {
                    instructions: "1H1 drums- 1.14 mm (0.045 inch)",
                  },
                  "A7.5.3.6.4.": {
                    instructions:
                      "6HA1 drums- the plastic inner container must be 1.58 mm (0.0622 inch) and the outer steel drum must be 0.70 mm (0.027 inch)",
                  },
                },
              },
            },
          },
          "A7.5.4.": {
            instructions:
              "Pack in an inner packaging system that consists of an impact-resistant receptacle of glass, earthenware, plastic, or metal securely cushioned with a nonreactive absorbent material. Pack inner packaging system within a leak-tight packaging of metal or plastic, then pack in a steel drum (1A2), aluminum drum (1B2), metal drum (other than steel or aluminum (1N2)), plywood drum (1D), fiber drum (1G), plastic drum (1H2), steel box (4A), aluminum box (4B), natural wood box (4C1 or 4C2), plywood box (4D), reconstituted wood box (4F), fiberboard box (4G), expanded plastic box (4H1), solid plastic box (4H2), or metal box other than steel or aluminum (4N). The capacity of the inner receptacle may not exceed 4 L (1 gallon). An inner receptacle that has a closure must have a screw-type closure, which is held in place by any means capable of preventing backoff or loosening of the closure by impact or vibration during transportation. Both the inner packaging system and the outer container must each meet the test requirements of the PG I performance level independently. The total amount of liquid that can be packed in the outer container may not exceed 16 L (4 gallons).",
          },
        },
      },
    },
    "A7.6.": {
      description:
        "Polyester resin and fiberglass repair kits consist of two components: a base material in Class 3, PG II or III, and an organic peroxide activator. Only organic peroxides of Type D, E, or F not requiring temperature controls are authorized. Assign PG II or III according to the criteria for Class 3, applied to the base material. Ensure each component is separately packed in an inner packaging. The components may be placed in the same outer packaging provided they will not react dangerously in the event of leakage. Secure closures on inner packagings containing liquids by secondary means. The total quantity of activator and base material may not exceed 5 kg (11 pounds) per package for a Packing Group II base material. The total quantity of activator and base material may not exceed 10 kg (22 pounds) per package for a Packing Group III base material. The total quantity of polyester resin kits per package is calculated on a one-to-one basis (e.g., 1 L equals 1 kg).",
      packagingInstructions: {
        organicPeroxidesPackaging: {
          innerPackaging: {
            required: true,
            types: ["Plastic tube packaging", "Flexible tube packaging"],
            note: "Maximum quantity of organic peroxide per inner packaging is 125 ml (4.22 ounces) for liquids and 500 g (1 lb.) for solids.",
          },
          outerPackaging: {
            drums: [
              "Steel (1A2)",
              "Aluminum (1B2)",
              "Fiber (1G)",
              "Plastic (1H2)",
              "Other metal (1N2)",
            ],
            jerricans: ["Steel (3A2)", "Aluminum (3B2)", "Plastic (3H2)"],
            boxes: [
              "Steel (4A)",
              "Aluminum (4B)",
              "Wooden (4C1 or 4C2)",
              "Plywood (4D)",
              "Reconstituted wood (4F)",
              "Fiberboard (4G)",
              "Plastic (4H1 or 4H2)",
              "Other metal (4N)",
            ],
          },
        },
        flammableLiquidsPackaging: {
          innerPackaging: {
            required: true,
            receptacles: [
              "Glass",
              "Earthenware",
              "Plastic",
              "Metal",
              "Aluminum",
            ],
            notes: [
              "PG II base material limited to 5 L (1.3 gallons) in metal or plastic inner packagings and 1 L (0.3 gallons) in glass inner packagings.",
              "PG III base material limited to 10 L (2.6 gallons) in metal or plastic inner packagings and 2.5 L (0.66 gallons) in glass inner packagings.",
            ],
          },
          outerPackaging: {
            drums: [
              "Steel (1A2)",
              "Aluminum (1B2)",
              "Fiber (1G)",
              "Plastic (1H2)",
              "Other metal (1N2)",
            ],
            jerricans: ["Steel (3A2)", "Aluminum (3B2)", "Plastic (3H2)"],
            boxes: [
              "Steel (4A)",
              "Aluminum (4B)",
              "Wooden (4C1 or 4C2)",
              "Plywood (4D)",
              "Reconstituted wood (4F)",
              "Fiberboard (4G)",
              "Plastic (4H1 or 4H2)",
              "Other metal (4N)",
            ],
          },
        },
      },
    },
    "A7.7.": {
      packagingInstructions: {
        innerPackaging: {
          required: true,
          receptacles: ["Cartridge"],
        },
        outerPackaging: {
          drums: [
            "Removable head steel (1A2)",
            "Removable head aluminum (1B2)",
            "Plywood (1D)",
            "Fiber (1G)",
            "Plastic (1H2)",
            "Removable head other metal (1N2)",
          ],
          jerricans: ["Steel (3A2)", "Aluminum (3B2)", "Plastic (3H2)"],
          boxes: [
            "Steel (4A)",
            "Aluminum (4B)",
            "Wood (4C1 or 4C2)",
            "Plywood (4D)",
            "Reconstituted wood (4F)",
            "Fiberboard (4G)",
            "Plastic (4H1 or 4H2)",
            "Other metal (4N)",
          ],
        },
      },
    },
    "A7.8.": {
      packagingInstructions: {
        subParagraphs: {
          "A7.8.1.": {
            instructions:
              "UN specification packaging is not required. Protect fuel cells installed in equipment against short circuit, and protect the entire system against inadvertent operation. Fuel cell systems may not charge batteries during transport.",
          },
          "A7.8.2.": {
            instructions:
              "Protect the terminals of the installed fuel cells to prevent short circuit by use of protective coverings, taping, etc.",
          },
        },
      },
    },
    "A7.9.": {
      packagingInstructions: {
        subParagraphs: {
          "A7.9.1.": {
            instructions:
              "UN specification packaging is not required. Pack fuel cells packed with equipment in inner packagings or placed in the outer packaging with cushioning material or divider(s) in order to protect fuel cartridges from damage during transportation. The maximum number of fuel cell cartridges in the intermediate packaging may not be more than the number required to power the equipment plus two spares.",
          },
        },
      },
    },
    "A7.10.": {
      packagingInstructions: {
        combinationPackaging: {
          innerPackaging: {
            required: true,
            receptacles: ["Glass", "Steel"],
          },
          outerPackaging: {
            drums: [
              "Steel (1A2)",
              "Plywood (1D)",
              "Fiber (1G)",
              "Plastic (1H2)",
            ],
            boxes: [
              "Steel (4A)",
              "Natural wood (4C1 or 4C2)",
              "Plywood (4D)",
              "Reconstituted wood (4F)",
              "Fiberboard (4G)",
              "Expanded plastic (4H1)",
              "Solid plastic (4H2)",
            ],
          },
        },
        compositePackaging: {
          innerReceptacle: {
            materials: ["Plastic"],
          },
          outerPackaging: {
            drums: ["Steel drum (6HA1)"],
          },
        },
        cylinderPackagingInstructions: {
          "A7.10.4.": {
            instructions:
              "Package in cylinders as prescribed for any compressed gas except those for acetylene (DOT 8, 8AL), 3HT, and aluminum cylinders.",
          },
        },
      },
    },
    "A7.11.": {
      description:
        "Package Flammable Liquid powered engines, machinery, and SE as follows:",
      packagingInstructions: {
        subParagraphs: {
          "A7.11.1.": {
            instructions:
              "Compliance With Technical Orders. Use the equipment service or technical manual to prepare item for shipment.",
          },
          "A7.11.2.": {
            instructions:
              "Fuel Limitations. Completely drain engine-powered SE of fuel. Up to 500 ml (17 ounces) of fuel may be left in engine components and fuel lines provided all lines and fuel tanks are securely closed to prevent leakage of fuel. Check the serviceability, proper installation, and security of the vent caps on diesel generators with vertical, mast-type fuel vents. Drain and purge when required by the applicable technical manual. The following exceptions/additional restrictions apply:",
            subParagraphs: {
              "A7.11.2.1": {
                instructions:
                  "Drain engine-powered SE with large fuel systems that the shipper determines cannot be drained to 500 ml (17 ounces) within the mechanical limits of the equipment to the extent no free-standing liquid remains in the fuel tank, lines, or system.",
              },
              "A7.11.2.2": {
                instructions:
                  "When transported under the authority of Chapter 3 of this manual, wheeled-engine powered SE may contain up to one-half tank of fuel. Ship only the minimum quantity of fuel consistent with operational requirements. Ship the Hobart-86 all models with no more than one-quarter tank of fuel and load with filler neck facing forward. Ensure tanks are securely closed. Drain non-wheeled engine powered SE so that no more than 500 ml (17 ounces) of residual fuel is remaining.",
              },
              "A7.11.2.3": {
                instructions:
                  "Completely drain single axle equipment loaded with the tongue resting on the aircraft floor.",
              },
              "A7.11.2.4": {
                instructions:
                  "Drain engines that are damaged or inoperable and purging cannot be accomplished, or proper purging facilities are unavailable to the maximum extent possible and install plugs, caps, and covers over all openings as required by technical directives.",
              },
              "A7.11.2.5": {
                instructions:
                  "Engines which are drained and purged according to the responsible technical manual, and containing no other hazardous material, are nonhazardous for transportation. Comply with paragraph A3.1.16.4.",
              },
              "A7.11.2.6": {
                instructions:
                  "Where an engine or machine could possibly be handled in other than an upright position, secure the engines or machinery in a strong, rigid outer packaging in an orientation to prevent accidental leakage and prevent any movement during transport which would change in orientation or cause them to be damaged.",
              },
              "A7.11.2.7": {
                instructions:
                  "Ship the Aerial Bulk Fuel Delivery System (ABFDS) consisting of 3000 gallon bladders under the following conditions:",
                subParagraphs: {
                  "A7.11.2.7.1": {
                    instructions:
                      "Completely drain the bulk fuel bladders. Due to bladder construction there will be residual fuel remaining. Ensure bladders are drained as much as possible.",
                  },
                  "A7.11.2.7.2": {
                    instructions:
                      "Completely drain the pump module. No more than 500 ml (17 ounces) of fuel may be left in engine components.",
                  },
                  "A7.11.2.7.3": {
                    instructions:
                      "Securely close all vents and valves to prevent residual fuel leaks.",
                  },
                  "A7.11.2.7.4": {
                    instructions:
                      "When prepared in this manner, ABFDS may be stacked for shipment.",
                  },
                },
              },
              "A7.11.2.8": {
                instructions:
                  "When loaded in a freight container, drain fuel tanks. Purge the fuel tank and system if required by the item’s technical directive, or if the flash point of the fuel is less than 38 degrees C (100 degrees F). In the absence of specific draining and purging procedures:",
                subParagraphs: {
                  "A7.11.2.8.1": {
                    instructions: "Completely drain all fuel.",
                  },
                  "A7.11.2.8.2": {
                    instructions: "Run engine until it stalls.",
                  },
                  "A7.11.2.8.3": {
                    instructions:
                      "Allow fuel tanks and lines to remain open for 24 hours.",
                  },
                  "A7.11.2.8.4": {
                    instructions:
                      "Installed batteries must be non-spillable or non-regulated.",
                  },
                },
              },
              "A7.11.2.9": {
                instructions:
                  "When unit is susceptible to fuel spills or leakage, unit must be drained and capped.",
              },
              "A7.11.2.10": {
                instructions:
                  "Fuel cell powered engines or equipment. Secure and protect the fuel cell in a manner to prevent damage to the fuel cell. Describe equipment (other than vehicles, engines, or mechanical equipment) such as consumer electronic devices containing fuel cells (fuel cell cartridges) as 'Fuel cell cartridges contained in equipment.'",
              },
              "A7.11.2.11": {
                instructions:
                  "Engines and generators designed as part of, and integrally mounted to, or contained on a vehicle, trailer, or within a container or transporter that are required to operate during aircraft onload and offload to articulate, self-cool, or otherwise operate equipment necessary on/off loading, may be fueled no more than one-half full.",
              },
              "A7.11.2.12": {
                instructions:
                  "Lithium batteries. Securely fasten lithium batteries contained in vehicles, engines, or mechanical equipment in the battery holder of the vehicle, engine, or mechanical equipment, and protect in such a manner as to prevent damage and short circuits.",
              },
            },
          },
          "A7.11.3.": {
            instructions:
              "Accessorial hazards. Installed components, equipment, and accessorial hazards (e.g., fire extinguishers, jerricans, etc.) are authorized in properly configured and approved holders designed for use with the unit. The following applies:",
            subParagraphs: {
              "A7.11.3.1": {
                instructions:
                  "Secure batteries upright in designed holders except non-spillable batteries meeting Special Provision A67 as nonhazardous, which may be oriented in a manner to fit designed holder.",
              },
              "A7.11.3.2": {
                instructions:
                  "When loaded in a freight container, remove acid or alkali batteries and package according to A12.4. Do not ship packaged wet-cell batteries inside a freight container unless accessible during flight.",
              },
            },
          },
        },
      },
    },
    "A7.12.": {
      description:
        "UN3540, Articles containing flammable liquid, N.O.S. are authorized when classified per paragraph A4.2.3., maximum net quantity per package 60 L, when packaged or unpackaged as follows:",
      packagingInstructions: {
        subParagraphs: {
          "A7.12.1.": {
            instructions:
              "When packaged, packagings meeting Packing Group II performance are required.",
            subParagraphs: {
              "A7.12.1.1.": {
                instructions:
                  "Pack articles to prevent movement and inadvertent operation during normal conditions of transport.",
              },
              "A7.12.1.2.": {
                instructions:
                  "Pack inner receptacles within their outer packaging with closures correctly oriented.",
              },
            },
          },
        },
        innerPackaging: {
          required: true,
          receptacles: [
            "Constructed of suitable materials and secured in the article in such a way that, under normal conditions of transport, they cannot break, be punctured, or leak their contents into the article itself or the outer packaging.",
          ],
          note: "Where there is no receptacle within the article, the article must fully enclose the dangerous goods and prevent their release under normal conditions of transport.",
        },
        outerPackaging: {
          drums: [
            "Removable head steel (1A2)",
            "Removable head aluminum (1B2)",
            "Removable head metal other than steel or aluminum (1N2)",
            "Plywood (1D)",
            "Fiber (1G)",
            "Removable head plastic (1H2)",
          ],
          boxes: [
            "Steel (4A)",
            "Aluminum (4B)",
            "Ordinary natural wood (4C1)",
            "Sift-proof natural wood (4C2)",
            "Plywood (4D)",
            "Reconstituted wood (4F)",
            "Fiberboard (4G)",
            "Expanded plastic (4H1)",
            "Solid plastic (4H2)",
            "Other metal (4N)",
          ],
          jerricans: [
            "Removable head steel (3A2)",
            "Plastic removable head (3H2)",
            "Aluminum removable head (3B2)",
          ],
        },
      },
    },
    "A8.2.": {
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
            notes: [
              "For PG I material, inner packagings must be packed in a rigid and leakproof receptacle or intermediate packaging containing sufficient absorbent material to absorb the entire contents of all inner packagings before packing them in the outer package.",
              "Ensure inner packaging or receptacle closures of combination packages containing liquids are held securely, tightly, and effectively in place by secondary means. See A20.3.",
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
            note: "Not authorized for PG I material.",
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
              "Plastic (4H1 or 4H2)",
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
              "Fiber (1G) with liner",
              "Plastic (1H1 or 1H2)",
              "Metal other than steel or aluminum (1N1 or 1N2)",
            ],
            notes: [
              "Fiber drum (1G) not authorized for PG I materials.",
              "Wooden barrel (2C1) not authorized for PG I materials.",
            ],
            jerricans: [
              "Steel (3A1 or 3A2)",
              "Aluminum (3B1 or 3B2)",
              "Plastic (3H1 or 3H2)",
            ],
            barrel: ["Wood (2C1)"],
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
            note: "Plywood drum (6HD1) not authorized for PG I materials.",
            boxes: [
              "Steel (6HA2)",
              "Aluminum (6HB2)",
              "Wooden (6HC)",
              "Plywood (6HD2)",
              "Fiberboard (6HG2)",
            ],
          },
        },
        compositePackagingWithGlassPorcelainOrStonewareInnerReceptacles: {
          innerReceptacle: {
            materials: ["Glass", "Porcelain", "Stoneware"],
          },
          outerPackaging: {
            drums: [
              "Steel (6PA1)",
              "Aluminum (6PB1)",
              "Plywood (6PD1)",
              "Wickerwork hamper (6PD2)",
              "Fiber (6PG1)",
            ],
            note: "Plywood drum (6PD1) or wickerwork hamper (6PD2) not authorized for PG I material.",
            boxes: [
              "Steel (6PA2)",
              "Aluminum (6PB2)",
              "Wooden (6PC)",
              "Fiberboard (6PG2)",
              "Solid plastic packaging (6PH1)",
              "Expanded plastic packaging (6PH2)",
            ],
          },
        },
        cylinderPackagingInstructions: {
          "A8.2.5.": {
            instructions:
              "DOT Cylinders. DOT specification cylinders as prescribed for any compressed gas, except acetylene (DOT8, 8AL) and DOT 3HT.",
          },
        },
      },
    },
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
        compositePackagingWithGlassPorcelainOrStonewareInnerReceptacles: {
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
    "A8.4.": {
      description:
        "Prepare Class 4 materials referenced in Table A4.1. to this paragraph, according to a competent authority approval (CAA). Packaging must be in compliance with the CAA. See paragraph 2.5. for more information on CAAs.",
    },
    "A8.6.": {
      description:
        "Package Diphenyloxide-4, 4-Disulphohydrazide; N, N Dinitroso-N, N Dimethyl Teraphthlamide (not more than 72 percent as a paste) as follows: Temperature controls are not required.",
      packagingInstructions: {
        innerPackaging: {
          required: false,
        },
        outerPackaging: {
          drums: [
            "Fiber (1G) with a plastic liner or internal coating",
            "Sift-proof fiber (1G)",
          ],
          notes: [
            "Temperature controls are not required. Maximum gross weight may not exceed 110 pounds (50 kg).",
          ],
        },
      },
    },
    "A8.7.": {
      description:
        "Package 1,1 Azodi-(Hexahydrobenzonitrile); Benzene Sulfohydrazide; Benzene-1,3- Disulfohydrazide (not more than 52 percent as a paste); N,NDinitrosopentamethylenetetramine (not more than 82 percent with phlegmatizer) as follows: Temperature controls are not required.",
      packagingInstructions: {
        drumPackagingInstructions: {
          innerPackaging: {
            required: false,
          },
          outerPackaging: {
            drums: [
              "Fiber (1G) with a plastic liner or internal coating",
              "Sift-proof fiber (1G)",
            ],
            note: "Maximum gross weight is 50 kg (110 pounds).",
          },
        },
        boxPackagingInstructionsA8_7_2: {
          innerPackaging: {
            required: true,
            receptacles: ["Single plastic bag"],
          },
          outerPackaging: {
            boxes: ["Fiberboard (4G)"],
            note: "Maximum gross weight is 50 kg (110 pounds).",
          },
        },
        boxPackagingInstructionsA8_7_3: {
          innerPackaging: {
            required: true,
            receptacles: ["Single plastic bag"],
          },
          outerPackaging: {
            boxes: ["Fiberboard (4G)"],
            note: "Maximum gross weight is 50 kg (110 pounds).",
          },
        },
      },
    },
    "A8.8.": {
      description:
        "Package 3-Chloro-4-Diethylaminobenzenediazonium Zinc Chloride; 4- Dipropylaminobenzenediazonium Zinc Chloride; Sodium 2-Diazo-1Naphthol-4- Sulphonate; Sodium 2-Diazo-1-Naphthol-5-Sulphonate as follows: Temperature controls are not required.",
      packagingInstructions: {
        drumPackagingInstructionsA8_8_1: {
          innerPackaging: {
            required: false,
          },
          outerPackaging: {
            drums: ["Fiber (1G) with a plastic liner or internal coating"],
            note: "Maximum gross weight is 50 kg (110 pounds).",
          },
        },
        drumPackagingInstructinosA8_8_2: {
          innerPackaging: {
            required: true,
            receptacles: ["Plastic bag"],
          },
          outerPackaging: {
            drums: [
              "Steel removable head (1A2)",
              "Aluminum removable head (1B2)",
            ],
            note: "Maximum gross weight is 55 kg (121 pounds).",
          },
        },
      },
    },
    "A8.9.": {
      description:
        "Package 2-Diazo-1-Naphthol-4-Sulphochloride and 2-Diazo-1-Naphhthol-5- Sulphochloride in drums as follows: Temperature controls are not required.",
      packagingInstructions: {
        innerPackaging: {
          required: false,
        },
        outerPackaging: {
          drums: ["Fiber (1G) with plastic liner or internal coating"],
          note: "Maximum gross weight is 50 kg (110 pounds).",
        },
      },
    },
    "A8.10.": {
      description:
        "Package Barium Azide, Wetted (with not less than 50 percent water by mass) as follows: Pack barium azide, wetted (with not less than 50 percent water by mass) in the following packaging. Inner glass receptacles may not be over 0.5 kg (1.1 pounds) capacity each. Inner receptacles require rubber stoppers wire-tied for securement. If transportation is to take place when freezing weather is possible, ensure a suitable antifreeze solution is used to prevent freezing. Package in boxes or drums as follows:",
      packagingInstructions: {
        innerPackaging: {
          required: true,
          receptacles: ["Glass"],
        },
        outerPackaging: {
          boxes: [
            "Wood (4C1)",
            "Sift-proof natural wood (4C2)",
            "Plywood (4D)",
            "Reconstituted wood (4F)",
          ],
          drums: ["Fiber (1G)"],
        },
      },
    },
    "A8.11.": {
      description:
        "Package Calcium Pyrophoric; Magnesium Diphenyl; Metal Catalyst, Dry; Pyrophoric Metals, N.O.S. and Pyrophoric Solids, N.O.S. as follows:",
      packagingInstructions: {
        subParagraphs: {
          "A8.11.1.": {
            instructions:
              "Inner receptacles with positive (not friction) means of closure. Inner metal receptacles may not contain more than 15 kg (33 pounds) each. Package in boxes as follows:",
            innerPackaging: {
              required: true,
              receptacles: ["Metal"],
            },
            outerPackaging: {
              boxes: ["Wood (4C1, 4C2, 4D, or 4F)"],
            },
          },
          "A8.11.2.": {
            instructions:
              "Inner receptacles with positive (not friction) means of closure. Inner metal receptacles may not contain more than 7.5 kg (17 pounds) each. Package in boxes as follows:",
            innerPackaging: {
              required: true,
              receptacles: ["Metal"],
            },
            outerPackaging: {
              boxes: ["Fiberboard (4G)"],
            },
          },
          "A8.11.3.": {
            instructions:
              "Inner receptacles with positive (not friction) means of closure. Inner metal receptacles may not contain more than 15 kg (33 pounds) each. Package in drums as follows:",
            innerPackaging: {
              required: true,
              receptacles: ["Metal"],
            },
            outerPackaging: {
              drums: ["Fiber (1G)", "Plywood (1D)"],
            },
          },
          "A8.11.4.": {
            instructions: "Package in drums as follows:",
            innerPackaging: {
              required: true,
              receptacles: [
                "Metal with a positive (not friction) means of closure",
              ],
              note: "Inner receptacles may not contain more than 15 kg (33 pounds) each.",
            },
            outerPackaging: {
              drums: [
                "Steel (1A1 or 1A2)",
                "Aluminum (1B1 or 1B2)",
                "Plywood (1D)",
                "Fiber (1G)",
                "Other metal (1N1 or 1N2)",
              ],
              note: "For metal drums, gross weight may not exceed 150 kg (331 pounds) each.",
            },
          },
          "A8.11.5.": {
            instructions: "Package in boxes as follows:",
            innerPackaging: {
              required: false,
            },
            outerPackaging: {
              boxes: ["Steel (4A)", "Aluminum (4B)", "Other metal (4N)"],
              note: "May not contain more than 15 kg (33 pounds) each.",
            },
          },
        },
      },
    },
    "A8.12.": {
      description:
        "Package Films, Nitrocellulose Base (gelatin coated [except scrap]) as follows: Each reel in a tightly closed inner packaging with its cover securely held in place with adhesive tape or adhesive paper. Package in drums, jerricans, or boxes as follows:",
      packagingInstructions: {
        innerPackaging: {
          required: true,
          receptacles: [
            "Metal can",
            "Polypropylene canister",
            "Strong fiberboard",
          ],
        },
        outerPackaging: {
          drums: [
            "Steel (1A2)",
            "Aluminum (1B2)",
            "Plywood (1D)",
            "Fiber (1G)",
            "Other metal (4A2)",
          ],
          jerricans: ["Steel (3A2)", "Aluminum (3B2)"],
          boxes: [
            "Steel (4A)",
            "Aluminum (4B)",
            "Wood (4C1, 4C2)",
            "Plywood (4D)",
            "Reconstituted wood (4F)",
            "Fiberboard (4G)",
            "Other metal (4N)",
          ],
          notes: [
            "Fiber drums (1G) may only be used for film not exceeding 600 m (1969 feet).",
            "Fiberboard (4G) may only be used for film not exceeding 600 m (1969 feet).",
          ],
        },
      },
    },
    "A8.13.": {
      description: "Package Fusees (railway or highway) as follows:",
      packagingInstructions: {
        innerPackaging: {
          required: false,
        },
        outerPackaging: {
          drums: ["Steel (1A2)", "Plywood (1D)", "Fiber (1G)"],
          jerricans: ["Steel (3A2)"],
          boxes: [
            "Wood (4C1, 4C2)",
            "Plywood (4D)",
            "Reconstituted wood (4F)",
            "Fiberboard (4G)",
          ],
        },
        subParagraphs: {
          "A8.13.1.": {
            instructions:
              "General Requirements. Fusees that are equipped with spikes having reinforced ends to prevent penetration of the spikes through the outer packaging.\n      Also, ensure the packages are capable of passing at least one drop test with the spike in a downward position.",
          },
        },
      },
    },
    "A8.14.": {
      description:
        "Package Matches, Fusee; Matches, Safety (book, card, or strike-on-box); Matches Strike-Anywhere, and Matches, Wax Vesta as follows: Matches must be of a type that will not ignite spontaneously when subjected to a temperature of 93.3 degrees C (200 degrees F) for 8 consecutive hours in a properly conducted laboratory test.",
      packagingInstructions: {
        innerPackaging: {
          required: true,
          receptacles: [
            "Securely closed chipboard",
            "Fiberboard",
            "Wood",
            "Metal",
          ],
        },
        outerPackaging: {
          drums: [
            "Steel (1A1, 1A2)",
            "Aluminum (1B1, 1B2)",
            "Plywood (1D)",
            "Fiber (1G)",
            "Other metal (1N1, 1N2)",
          ],
          jerricans: ["Steel (3A1, 3A2)", "Aluminum (3B1, 3B2)"],
          boxes: [
            "Steel (4A)",
            "Aluminum (4B)",
            "Wood (4C1, 4C2)",
            "Plywood (4D)",
            "Reconstituted wood (4F)",
            "Fiberboard (4G)",
            "Other metal (4N)",
          ],
        },
        subParagraphs: {
          "A8.14.1.": {
            instructions:
              "Do not pack matches, strike-anywhere, in the same outer packaging with any other article except safety matches or wax vesta matches.\n        Package safety matches or wax vesta matches in separate inside containers.\n        Each inside packaging may not contain over 700 matches. Gross weight may not be over 30 kg (66 pounds) for fiberboard boxes or 45.4 kg (100 pounds) for all other outer packagings.",
          },
          "A8.14.2.": {
            instructions:
              "Do not pack fusee matches, in the same outer packaging with any other article except safety matches or wax vesta matches.\n        Package safety matches or wax vesta matches in separate inside containers.\n        Each inside packaging may not contain over 700 matches. Gross weight may not be over 30 kg (66 pounds) for fiberboard boxes or 45.4 kg (100 pounds) for all other outer packagings.",
          },
          "A8.14.3.": {
            instructions:
              "Tightly pack safety matches (strike-on-box, book, and card) or wax vesta matches in securely closed inside containers then packed in an outer packaging.\n        Safety matches may be packed in the same outer packaging with non hazardous materials.",
          },
        },
      },
    },
    "A8.15.": {
      description:
        "UN3541, Articles containing flammable solid N.O.S. are authorized when classified per paragraph A4.2.3., maximum net quantity per package 50 kg, when packaged, or unpackaged as follows:",
      packagingInstructions: {
        innerPackaging: {
          required: true,
          receptacles: [
            "Constructed of suitable materials and secured in the article in such a way that, under normal conditions of transport, they cannot break, be punctured, or leak their contents into the article itself or the outer packaging.",
          ],
        },
        outerPackaging: {
          drums: [
            "Removable head steel (1A2)",
            "Removable head aluminum (1B2)",
            "Removable head metal other than steel or aluminum (1N2)",
            "Plywood (1D)",
            "Fiber (1G)",
            "Removable head plastic (1H2)",
          ],
          boxes: [
            "Steel (4A)",
            "Aluminum (4B)",
            "Ordinary natural wood (4C1)",
            "Sift-proof natural wood (4C2)",
            "Plywood (4D)",
            "Reconstituted wood (4F)",
            "Fiberboard (4G)",
            "Expanded plastic (4H1)",
            "Solid plastic (4H2)",
            "Other metal (4N)",
          ],
          jerricans: [
            "Removable head steel (3A2)",
            "Plastic removable head (3H2)",
            "Aluminum removable head (3B2)",
          ],
        },
        subParagraphs: {
          "A8.15.1.": {
            instructions:
              "When packaged, packagings meeting Packing Group II performance is required.",
            subParagraphs: {
              "A8.15.1.1.": {
                instructions:
                  "Pack articles to prevent movement and inadvertent operation during normal conditions of transport.",
              },
              "A8.15.1.2.": {
                instructions:
                  "Where there is no receptacle within the article, ensure the article fully encloses the dangerous goods and prevent their release under normal conditions of transport.",
              },
            },
          },
          "A8.15.2.": {
            instructions: "Robust articles.",
            subParagraphs: {
              "A8.15.2.1.": {
                instructions:
                  "Robust articles may be transported in strong outer packagings constructed of suitable material and of adequate strength and design in relation to the packaging capacity and its intended use; or,",
              },
              "A8.15.2.2.": {
                instructions:
                  "Robust articles may be transported unpackaged or on pallets when the dangerous goods are afforded equivalent protection by the article in which they are contained.",
              },
            },
          },
        },
      },
    },
    "A8.16.": {
      description:
        "Package Phosphorus, White or Yellow, Dry, or Under Water, or in Solution as follows:",
      packagingInstructions: {
        subParagraphs: {
          "A8.16.1.": {
            instructions:
              "Phosphorus White or Yellow. Phosphorus white or yellow, when dry, must be cast solid and shipped in containers as follows:",
            subParagraphs: {
              "A8.16.1.1.": {
                instructions:
                  "Steel, aluminum, or other metal drums (1A2, 1B2, 1N2) not over a 115 L (30 gallons) capacity each.",
              },
              "A8.16.1.2.": {
                instructions:
                  "In projectiles or bombs without bursting elements. (T-0).",
              },
            },
          },
          "A8.16.2.": {
            instructions:
              "Phosphorus White or Yellow in Water or Solution. Pack phosphorus, white or yellow, when in water or solution, in:",
            subParagraphs: {
              "A8.16.2.1.": {
                instructions:
                  "Steel, aluminum, or other metal boxes (4A, 4B or 4N), or wooden boxes (4C1, 4C2, 4D, or 4F) with inside soldered or hermetically-sealed metal cans placed inside another soldered or hermetically-sealed metal can.",
              },
              "A8.16.2.2.": {
                instructions:
                  "Steel, aluminum, or other metal boxes (4A, 4B or 4N), or wooden boxes (4C1, 4C2, 4D, or 4F) with inside water-tight metal cans containing not over .5 kg (1 pound) of phosphorus with screw-top closures.",
              },
              "A8.16.2.3.": {
                instructions:
                  "Steel, aluminum, or other metal drums (1A1, 1B1, or 1N1) not over 250 L (66 gallons) capacity each.",
              },
              "A8.16.2.4.": {
                instructions:
                  "Steel, aluminum, or other metal drums (1A2, 1B2, or 1N2) not over 115 L (30 gallons) capacity each.",
              },
            },
          },
          "A8.16.3.": {
            instructions:
              "White Phosphorus Igniters. Pack white phosphorus igniters one each in a hermetically-sealed (soldered) or watertight metal can, sealed airtight and positively fastened. Pack no more than 25 metal cans in a wooden box (4C1, 4C2, 4D, or 4F).",
          },
        },
      },
    },
    "A8.17.": {
      description:
        'Smokeless Powder for Small Arms (100 pounds or less) which has been reclassified to Class 4.1 in accordance with 49CFR Sections 173.56, 173.58, and 173.171 may be transported with the limitations and packaged as follows: The PSN "SMOKELESS POWDER FOR SMALL ARMS" is only valid for domestic movement. For international shipment use the PSN "POWDER, SMOKELESS" and package the material as required by the packaging paragraph for powder, smokeless. Only combination packaging with inner packagings not exceeding 3.6 kg (8 pounds) net mass packed in outer packaging of UN 4G fiberboard boxes meeting the Packing Group I standards are authorized. Arrange and protect inner packagings to prevent simultaneous ignition of the contents. The complete package must be of the same type that has been examined as required in 49 CFR Section 173.56 and meet A3.3.1. Not more than 45.4 kg (100 pounds) is allowed on the aircraft',
    },
    "A8.18.": {
      description:
        "Package Batteries and Cells Containing Sodium as follows: Ensure batteries and cells do not contain any hazardous material other than sodium, sulfur, or sodium compounds (e.g., sodium polysulfides, sodium tetrachloroaluminate, etc.). Do not offer batteries or cells for transportation at a temperature at which there is any liquid elemental sodium present in the battery or cell. Ensure the external battery temperature does not exceed 55 degrees C (130 degrees F). Ensure batteries are protected from external short circuit.",
      packagingInstructions: {
        innerPackaging: {
          required: false,
        },
        outerPackaging: {
          drums: [
            "Steel (1A2)",
            "Aluminum (1B2)",
            "Plywood (1D)",
            "Fiber (1G)",
            "Plastic (1H2)",
            "Other metal (1N2)",
          ],
          jerricans: ["Steel (3A2)", "Aluminum (3B2)", "Plastic (3H2)"],
          boxes: [
            "Steel (4A)",
            "Aluminum (4B)",
            "Wood (4C1, 4C2)",
            "Plywood (4D)",
            "Reconstituted wood (4F)",
            "Fiberboard (4G)",
            "Plastic (4H1, 4H2)",
            "Other metal (4N)",
          ],
        },
        subParagraphs: {
          "A8.18.1.": {
            instructions:
              "Batteries must consist of cells secured within and fully enclosed by a metal casing. (T-0). Ship unpackaged or in nonspecification protective packagings. UN specification containers are not required.",
          },
          "A8.18.2.": {
            instructions:
              "Cells must consist of hermetically sealed metal casings that completely enclose the hazardous material. (T-0). Pack cells with sufficient cushioning material to secure against movement; and to prevent contact between cells and between cells and the internal surfaces of the outer packaging. Pack cells in packaging that meets the PG II performance level.",
          },
        },
      },
    },
    "A8.19.": {
      description:
        "Package Polyester Resin Kits as follows: Polyester resin and fiberglass repair kits consist of two components: a base material in Class 4.1, PG II or III, and an organic peroxide activator. Only organic peroxides of Type D, E, or F not requiring temperature controls are authorized. Assign PG II or III according to the criteria for Class 4.1, applied to the base material. Ensure each component is separately packed in an inner packaging. The components may be placed in the same outer packaging provided they will not react dangerously in the event of leakage. Secure closures on inner packagings containing liquids by secondary means. The total quantity of activator and base material may not exceed 5 kg (11 pounds) per package for a Packing Group II base material. The total quantity of activator and base material may not exceed 10 kg (22 pounds) per package for a Packing Group III base material. The total quantity of polyester resin kits per package is calculated on a one-to-one basis (e.g., 1 L equals 1 kg).",
      packagingInstructions: {
        organicPeroxides: {
          innerPackaging: {
            required: true,
            types: ["Plastic tube packaging", "Flexible tube packaging"],
            note: "Maximum quantity of organic peroxide per inner packaging is 125 ml (4.22 ounces) for liquids and 500 g (1 lb.) for solids.",
          },
          outerPackaging: {
            drums: [
              "Steel (1A2)",
              "Aluminum (1B2)",
              "Fiber (1G)",
              "Plastic (1H2)",
              "Other metal (1N2)",
            ],
            jerricans: ["Steel (3A2)", "Aluminum (3B2)", "Plastic (3H2)"],
            boxes: [
              "Steel (4A)",
              "Aluminum (4B)",
              "Wooden (4C1, 4C2)",
              "Plywood (4D)",
              "Reconstituted wood (4F)",
              "Fiberboard (4G)",
              "Plastic (4H2)",
              "Other metal (4N)",
            ],
          },
        },
        flammableSolids: {
          innerPackaging: {
            required: true,
            receptacles: [
              "Glass or earthenware",
              "Plastic",
              "Metal",
              "Aluminum",
            ],
            note: "PG II base material limited to 5 kg (11 pounds) in metal or plastic inner packagings and 1 kg (2.2 pounds) in glass inner packagings. PG III base material limited to 10 kg (22 pounds) in metal or plastic inner packagings and 2.5 kg (5.5 pounds) in glass inner packagings.",
          },
          outerPackaging: {
            drums: [
              "Steel (1A2)",
              "Aluminum (1B2)",
              "Plywood (1D)",
              "Fiber (1G)",
              "Plastic (1H2)",
              "Other metal (1N2)",
            ],
            jerricans: ["Steel (3A2)", "Aluminum (3B2)", "Plastic (3H2)"],
            boxes: [
              "Steel (4A)",
              "Aluminum (4B)",
              "Wooden (4C1, 4C2)",
              "Plywood (4D)",
              "Reconstituted wood (4F)",
              "Fiberboard (4G)",
              "Plastic (4H1, 4H2)",
              "Other metal (4N)",
            ],
          },
        },
      },
    },
    "A8.20.": {
      description: "Fuel Cell Cartridges.",
      packagingInstructions: {
        innerPackaging: {
          required: false,
          notes: ["The weight of the fuel cells may not exceed 1 kg."],
        },
        outerPackaging: {
          drums: ["Plywood (1D)", "Fiberboard (1G)", "Plastic (1H2)"],
          jerricans: ["Plastic (3H2)"],
          boxes: [
            "Wood (4C1, 4C2)",
            "Plywood (4D)",
            "Reconstituted wood (4F)",
            "Fiberboard (4G)",
            "Plastic (4H2)",
          ],
          notes: ["The weight of the fuel cells may not exceed 1 kg."],
        },
      },
    },
    "A8.21.": {
      description: "Fuel Cells Contained in Equipment",
      packagingInstructions: {
        subParagraphs: {
          "A8.21.1.": {
            instructions:
              "UN specification packaging is not required. Pack fuel cells in strong outer container. Protect installed fuel cells in equipment against short circuit, and protect the entire system against inadvertent operation. Fuel cell systems may not charge batteries during transport.",
          },
          "A8.21.2.": {
            instructions:
              "Protect the terminals of the installed fuel cells to prevent short circuit by use of protective coverings, taping, etc.",
          },
        },
      },
    },
    "A8.22.": {
      description: "Fuel Cells Packed With Equipment",
      packagingInstructions: {
        subParagraphs: {
          "A8.22.1.": {
            instructions:
              "UN specification packaging is not required. Pack fuel cells in strong outer container in inner packagings or placed in the outer packaging with cushioning material or divider(s) in order to protect against damage that may be caused by the movement or placement of contents within the outer packaging. The maximum number of fuel cell cartridges in the intermediate packaging may not be more than the number required to power the equipment plus two spares.",
          },
        },
      },
    },
    "A9.3.": {
      description:
        "Package Class 5.2 Organic Peroxides as follows: Containers meeting PG II performance\n    tests and UN performance markings are required. Corrosion resistant metal packagings or with\n    protection against corrosion for substances with a Class 8 subsidary risk are required.\n    Packagings for UN3103 and UN3105 are limited to a net quantity of 1 L per inner packaging\n    and 10 L per outer packaging. UN3107 and UN3109 are limited to a net quantity of 2.5 L per\n    inner packaging and 25 L per outer packaging. Packagings for UN3104 and UN3106 are limited\n    to a net quantity of 1 kg per inner packaging and 10 kg per outer packaging. UN3108 and\n    UN3110 are limited to a net quantity of 2.5 kg per inner packaging and 25 kg per outer\n    packaging.",
      packagingInstructions: {
        innerPackaging: {
          required: true,
          receptacles: ["Plastic"],
        },
        outerPackaging: {
          drums: ["Plywood (1D)", "Fiber (1G)", "Plastic drum (1H1 or 1H2)"],
          jerricans: ["Plastic (3H1 or 3H2)"],
          boxes: [
            "Natural wood (4C1 or 4C2)",
            "Plywood (4D)",
            "Reconstituted wood (4F)",
            "Fiberboard (4G)",
            "Plastic (4H1 or 4H2)",
            "Other metal (4N)",
          ],
        },
      },
    },
    "A9.4.": {
      description:
        "Package Samples of Organic Peroxides as follows: Samples of new organic peroxides or\n  new formulations of identified organic peroxides for which complete test data is not available,\n  and which are being transported for testing and evaluation, may be transported and assigned a\n  PSN for organic peroxide, Type C. Data available to the person offering the material for\n  transportation must indicate that the sample would pose a threat no greater than that of an\n  organic peroxide, Type B, and that the control temperature, if any, is sufficiently low to prevent\n  any dangerous decomposition and sufficiently high to prevent any dangerous phase separation.\n  (T-0). Packaging requirements are as follows:",
      packagingInstructions: {
        subParagraphs: {
          "A9.4.1.": {
            instructions:
              "Package the sample following the requirements of UN3103 or UN3104 as appropriate\n      and the inner packages are limited to 0.5 L or 0.5 kg as appropriate",
          },
          "A9.4.2.": {
            instructions:
              "Use the PSN organic peroxide type C, liquid or organic peroxide type C, as applicable.",
          },
        },
      },
    },
    "A9.5.": {
      description: "Package Class 5.1 Liquids as follows: See also A3.3.5.",
      packagingInstructions: {
        combinationPackaging: {
          innerPackaging: {
            required: true,
            receptacles: ["Glass or earthenware", "Plastic", "Metal"],
            notes: [
              "For PG I material, inner packagings must be packed in a rigid and leakproof receptacle or intermediate packaging containing sufficient absorbent material to absorb the entire contents of all inner packagings before packing them in the outer package.",
              "Ensure inner packaging or receptacle closures of combination packages containing liquids are held securely, tightly, and effectively in place by secondary means. See A20.3.",
            ],
          },
          outerPackaging: {
            drums: [
              "Steel (1A1, 1A2)",
              "Aluminum (1B1, 1B2)",
              "Plywood (1D)",
              "Fiber (1G)",
              "Plastic (1H1, 1H2)",
              "Other metal (1N1, 1N2)",
            ],
            barrel: ["Wood (2C2)"],
            note: "Wood barrel (2C2) not authorized for PG I material.",
            jerricans: [
              "Steel (3A1, 3A2)",
              "Aluminum (3B1, 3B2)",
              "Plastic (3H1, 3H2)",
            ],
            boxes: [
              "Steel (4A)",
              "Aluminum (4B)",
              "Natural wood (4C1, 4C2)",
              "Plywood (4D)",
              "Reconstituted wood (4F)",
              "Fiberboard (4G)",
              "Plastic (4H1, 4H2)",
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
              "Steel (1A1, 1A2)",
              "Aluminum (1B1, 1B2)",
              "Metal other than steel or aluminum (1N1, 1N2)",
              "Plastic drum (1H1, 1H2)",
            ],
            barrel: ["Wood (2C1)"],
            note: "Wood barrel (2C1) not authorized for PG I material.",
            jerricans: [
              "Steel (3A1, 3A2)",
              "Aluminum (3B1, 3B2)",
              "Plastic (3H1, 3H2)",
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
              "Fiber (6HG1)",
              "Plastic (6HH)",
              "Plywood (6HD1)",
            ],
            note: "Plywood drums not authorized for PG I material.",
            boxes: [
              "Steel (6HA2)",
              "Aluminum (6HB2)",
              "Wooden (6HC)",
              "Plywood (6HD2)",
              "Fiberboard (6HG2)",
            ],
          },
        },
        compositePackagingWithGlassPorcelainOrStonewareInnerReceptacles: {
          innerReceptacle: {
            materials: ["Glass", "Porcelain", "Stoneware"],
          },
          outerPackaging: {
            drums: ["Steel (6PA1)", "Aluminum (6PB1)", "Fiber (6PG1)"],
            boxes: [
              "Steel (6PA2)",
              "Aluminum (6PB2)",
              "Wooden (6PC)",
              "Fiberboard (6PG2)",
            ],
            plastics: [
              "Solid plastic packaging (6PH1)",
              "Expanded plastic packaging (6PH2)",
            ],
            other: ["Plywood drum (6PD1)", "Wickerwork hamper (6PD2)"],
            note: "Plywood drum or wickerwork hamper not authorized for PG I material.",
          },
        },
        cylinderPackagingInstructions: {
          "A9.5.5.": {
            instructions:
              "DOT Cylinders. DOT specification cylinders as prescribed for any compressed gas, except acetylene (DOT 8, 8AL) and DOT 3HT",
          },
        },
      },
    },
    "A9.6.": {
      packagingInstructions: {
        combinationPackaging: {
          innerPackaging: {
            required: true,
            receptacles: ["Glass", "Earthenware", "Plastic", "Metal"],
          },
          outerPackaging: {
            drums: [
              "Steel (1A1, 1A2)",
              "Aluminum (1B1, 1B2)",
              "Plywood (1D)",
              "Fiber (1G)",
              "Plastic (1H1, 1H2)",
              "Metal other than steel or aluminum (1N1, 1N2)",
            ],
            barrel: ["Wood (2C2)"],
            jerricans: [
              "Steel (3A1, 3A2)",
              "Aluminum (3B1, 3B2)",
              "Plastic (3H1, 3H2)",
            ],
            boxes: [
              "Steel (4A)",
              "Aluminum (4B)",
              "Natural wood (4C1, 4C2)",
              "Plywood (4D)",
              "Reconstituted wood (4F)",
              "Fiberboard (4G)",
              "Solid plastic (4H2)",
              "Other metal (4N)",
            ],
          },
          notes: [
            "DOT Cylinders. DOT specification cylinders as prescribed for any compressed gas, except acetylene (DOT 8, 8AL) and DOT 3HT",
          ],
        },
        singlePackaging: {
          innerPackaging: {
            required: false,
          },
          outerPackaging: {
            drums: [
              "Steel (1A1, 1A2)",
              "Aluminum (1B1, 1B2)",
              "Plywood (1D)",
              "Fiber (1G)",
              "Plastic (1H1, 1H2)",
              "Metal other than steel or aluminum (1N1, 1N2)",
            ],
            notes: [
              "Plywood drum not authorized for PG I material.",
              "Wood barrels not authorized for PG I material.",
              "Steel (4A), aluminum (4B), plywood (4D), reconstituted wood (4F), natural wood (4C1), or fiberboard (4G) boxes not authorized for PG I material.",
              "Bags not authorized for PG I material.",
            ],
            barrel: ["Wood (2C1, 2C2)"],
            jerricans: [
              "Steel (3A1, 3A2)",
              "Aluminum (3B1, 3B2)",
              "Plastic (3H1, 3H2)",
            ],
            boxes: [
              "Steel (4A)",
              "Steel with liner (4A)",
              "Aluminum (4B)",
              "Aluminum with liner (4B)",
              "Natural wood (4C1, 4C2)",
              "Plywood (4D)",
              "Reconstituted wood (4F)",
              "Fiberboard (4G)",
              "Plastic (4H1, 4H2)",
              "Other metal (4N)",
            ],

            bags: [
              "Woven plastic (5H1, 5H2, 5H3)",
              "Plastic film (5H4)",
              "Textile (5L1, 5L2, 5L3)",
              "Paper, multiwall, water-resistant (5M2)",
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
              "Plastic (6HH1)",
            ],
            boxes: [
              "Steel (6HA2)",
              "Aluminum (6HB2)",
              "Wood (6HC)",
              "Plywood (6HD2)",
              "Fiberboard (6HG2)",
            ],
          },
        },
        compositePackagingWithGlassPorcelainOrStonewareInnerReceptacles: {
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
            plastics: ["Expanded plastic (6PH1)", "Solid plastic (6PH2)"],
          },
        },
      },
    },
    "A9.7.": {
      description:
        "Package Iodine Pentafluoride as follows: Package in any DOT specification cylinder, except those specified for acetylene",
    },
    "A9.8.": {
      description:
        "Package Oxidizing Substances, Solid, Self-Heating, N.O.S.; Oxidizing Substances, Solid, Flammable, N.O.S.; Oxidizing Substances, Solid, Water Reactive, N.O.S. as follows: Ship according to a competent authority approval (CAA). See paragraph 2.5. for more information on CAAs.",
    },
    "A9.9.": {
      description:
        "Package Bromine Pentafluoride or Bromine Trifluoride as follows:",
      packagingInstructions: {
        subParagraphs: {
          "A9.9.1.": {
            instructions:
              "Handling Instructions. These items are extremely dangerous. Make approved chemical safety mask and clothing available when handling this material, and wear when handling leaking packages.",
          },
          "A9.9.2.": {
            instructions:
              "Packaging Requirements. Package bromine pentafluoride or bromine trifluoride in specification cylinders, 3A150, 3AA150, 3B240, 3BN150, 3E1800, 4B240, 4BA240, or 4BW240. Seal each valve outlet by a threaded cap or a threaded plug. No cylinder may be equipped with any pressure relief device. Overpack specification 3E1800 cylinders in a strong wooden box.",
          },
        },
      },
    },
    "A9.10.": {
      description:
        "Oxygen Generators, Chemical. An oxygen generator, chemical may be transported only under the following conditions:",
      packagingInstructions: {
        subParagraphs: {
          "A9.10.1.": {
            instructions:
              "Approval. A chemical oxygen generator that is shipped with an explosive or non-explosive means of initiation attached must be classed and approved by the Associate Administrator in accordance with the procedures specified in 49 CFR Section 173.56. (T-0).",
          },
          "A9.10.2.": {
            instructions:
              "Impact resistance. Ensure a chemical oxygen generator, without any packaging, is capable of withstanding a 1.8 meter drop onto a rigid, non-resilient, flat and horizontal surface, in the position most likely to cause actuation or loss of contents.",
          },
          "A9.10.3.": {
            instructions:
              "Protection against inadvertent actuation. A chemical oxygen generator must incorporate one of the following means of preventing inadvertent actuation:",
            subParagraphs: {
              "A9.10.3.1.": {
                instructions:
                  "A chemical oxygen generator that is not installed in protective breathing equipment (PBE):",
                subParagraphs: {
                  "A9.10.3.1.1.": {
                    instructions:
                      "Mechanically actuated devices must have two pins, installed so that each is independently capable of preventing the actuator from striking the primer; one pin and one retaining ring, each installed so that each is independently capable of preventing the actuator from striking the primer; or a cover securely installed over the primer and a pin installed so as to prevent the actuator from striking the primer and cover.",
                  },
                  "A9.10.3.1.2.": {
                    instructions:
                      "Electrically actuated devices must have the electrical leads mechanically shorted and the mechanical short must be shielded in metal foil.",
                  },
                  "A9.10.3.1.3.": {
                    instructions:
                      "Devices with a primer but no actuator must have a protective cover over the primer to prevent actuation from external impact.",
                  },
                },
              },
              "A9.10.3.2.": {
                instructions:
                  "A chemical oxygen generator installed in a PBE must contain a pin installed so as to prevent the actuator from striking the primer, and be placed in a protective bag, pouch, case or cover such that the protective breathing equipment is fully enclosed in such a manner that the protective bag, pouch, case or cover prevents unintentional actuation of the oxygen generator. (T-0).",
              },
            },
          },
          "A9.10.4.": {
            instructions:
              "Packaging. Place a chemical oxygen generator and a chemical oxygen generator installed in equipment, (e.g., a PBE) in a rigid outer packaging that conforms to the requirements of either 49 CFR Part 178, Subparts L and M, at the Packing Group I or II performance level; or the performance criteria in Air Transport Association (ATA) Specification No. 300 for a Category I Shipping Container. In addition, with its contents, is capable of meeting the following additional requirements:",
            subParagraphs: {
              "A9.10.4.1.": {
                instructions:
                  "The Flame Penetration Resistance Test specified in 49 CFR Part 178, Appendix E.",
              },
              "A9.10.4.2.": {
                instructions:
                  "The Thermal Resistance Test specified in 49 CFR Part 178, Appendix D.",
              },
            },
          },
          "A9.10.5.": {
            instructions:
              "A chemical oxygen generator is forbidden for transportation by both passenger-carrying and cargo-only aircraft after the manufacturer's expiration date; or after the contents of the generator have been expended.",
          },
        },
      },
    },
    "A10.4.": {
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
            notes: [
              "For PG I material, pack inner packagings in a rigid and leakproof receptacle or intermediate packaging containing sufficient absorbent material to absorb the entire contents of all inner packagings before packing the inner packaging(s) in the outer package.",
              "Ensure inner packaging or receptacle closures of combination packages containing liquids are held securely, tightly, and effectively in place by secondary means. See A20.3.",
            ],
          },
          outerPackaging: {
            drums: [
              "Steel (1A2)",
              "Aluminum (1B2)",
              "Metal other than steel or aluminum (1N2)",
              "Plywood (1D)",
              "Fiber (1G)",
              "Plastic (1H2)",
            ],
            barrel: ["Wood (2C2)"],
            notes: ["Wood barrels not authorized for PG I material."],
            jerricans: ["Steel (3A2)", "Aluminum (3B2)", "Plastic (3H2)"],
            boxes: [
              "Steel (4A)",
              "Aluminum (4B)",
              "Natural wood (4C1, 4C2)",
              "Plywood (4D)",
              "Reconstituted wood (4F)",
              "Fiberboard (4G)",
              "Expanded plastic (4H1)",
              "Solid plastic (4H2)",
            ],
          },
        },
        singlePackaging: {
          innerPackaging: {
            required: false,
          },
          outerPackaging: {
            drums: [
              "Steel (1A1, 1A2)",
              "Aluminum (1B1, 1B2)",
              "Fiber (1G) with liner",
              "Plastic (1H1, 1H2)",
              "Metal other than steel or aluminum (1N1, 1N2)",
            ],
            notes: [
              "Fiber drum with liner only authorized for PG II and III material.",
              "Wood barrel not authorized for PG I material.",
            ],
            barrel: ["Wood (2C1)"],
            jerricans: [
              "Steel (3A1, 3A2)",
              "Aluminum (3B1, 3B2)",
              "Plastic (3H1, 3H2)",
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
              "Fiber (6HG1)",
              "Plastic (6HH1)",
              "Plywood (6HD1)",
            ],
            note: "Plywood drum (6HD1) not authorized for PG I material.",
            boxes: [
              "Steel (6HA2)",
              "Aluminum (6HB2)",
              "Wooden (6HC)",
              "Plywood (6HD2)",
              "Fiberboard (6HG2)",
            ],
          },
        },
        compositePackagingWithGlassPorcelainOrStonewareInnerReceptacles: {
          innerReceptacle: {
            materials: ["Glass", "Porcelain", "Stoneware"],
          },
          outerPackaging: {
            drums: ["Steel (6PA1)", "Aluminum (6PB1)", "Fiber (6PG1)"],
            boxes: [
              "Steel (6PA2)",
              "Aluminum (6PB2)",
              "Wooden (6PC)",
              "Fiberboard (6PG2)",
            ],
            plastics: ["Solid plastic (6PH1)", "Expanded plastic (6PH2)"],
            other: ["Plywood drum (6PD1)", "Wickerwork hamper (6PD2)"],
          },
        },
      },
    },
    "A10.5.": {
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
              "Steel (1A1, 1A2)",
              "Aluminum (1B1, 1B2)",
              "Plywood drum (1D)",
              "Fiber (1G)",
              "Plastic (1H1, 1H2)",
              "Metal other than steel or aluminum (1N1, 1N2)",
            ],
            barrel: ["Wood (2C2)"],
            jerricans: [
              "Steel (3A1, 3A2)",
              "Aluminum (3B1, 3B2)",
              "Plastic (3H1, 3H2)",
            ],
            boxes: [
              "Steel (4A)",
              "Aluminum (4B)",
              "Natural wood (4C1, 4C2)",
              "Plywood (4D)",
              "Reconstituted wood (4F)",
              "Fiberboard (4G)",
              "Solid plastic (4H2)",
              "Metal other than steel or aluminum (4N)",
            ],
          },
        },
        singlePackaging: {
          innerPackaging: {
            required: false,
          },
          outerPackaging: {
            drums: [
              "Steel (1A1, 1A2)",
              "Aluminum (1B1, 1B2)",
              "Plywood (1D)",
              "Fiber (1G)",
              "Plastic (1H1, 1H2)",
              "Metal other than steel or aluminum (1N1, 1N2)",
            ],
            notes: [
              "Plywood drum (1D) not authorized for PG I material.",
              "Wood barrels (2C1, 2C2) not authorized for PG I material.",
              "Steel (4A) without liner, aluminum (4B) without liner, natural wood (4C1), plywood (4D), reconstituted wood (4F), fiberboard (4G), expanded plastic (4H1), solid plastic (4H2) boxes not authorized for PG I material.",
              "Bags not authorized for PG I material.",
            ],
            barrel: ["Wood (2C1, 2C2)"],
            jerricans: [
              "Steel (3A1, 3A2)",
              "Aluminum (3B1, 3B2)",
              "Plastic (3H1, 3H2)",
            ],
            boxes: [
              "Steel (4A)",
              "Steel with liner (4A)",
              "Aluminum (4B)",
              "Aluminum with liner (4B)",
              "Natural wood (4C1)",
              "Natural wood sift-proof (4C2)",
              "Plywood (4D)",
              "Reconstituted wood (4F)",
              "Fiberboard (4G)",
              "Expanded plastic (4H1)",
              "Solid plastic (4H2)",
              "Metal other than steel or aluminum (4N)",
            ],
            bags: [
              "Woven plastic (5H1, 5H2, 5H3)",
              "Plastic film (5H4)",
              "Textile (5L1, 5L2, 5L3)",
              "Paper, multiwall, water-resistant (5M2)",
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
              "Plastic (6HH1)",
            ],
            boxes: [
              "Steel (6HA2)",
              "Aluminum (6HB2)",
              "Wood (6HC)",
              "Plywood (6HD2)",
              "Fiberboard (6HG2)",
            ],
          },
        },
        compositePackagingWithGlassPorcelainOrStonewareInnerReceptacles: {
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
            plastics: ["Expanded plastic (6PH1)", "Solid plastic (6PH2)"],
          },
        },
      },
    },
    "A10.10.": {
      packagingInstructions: {
        innerPackaging: {
          required: false,
        },
        outerPackaging: {
          drums: [
            "Removable head steel (1A2)",
            "Removable head aluminum (1B2)",
            "Removable head metal other than steel or aluminum (1N2)",
            "Plywood (1D)",
            "Fiber (1G)",
            "Removable head plastic (1H2)",
          ],
          boxes: [
            "Steel (4A)",
            "Aluminum (4B)",
            "Ordinary natural wood (4C1)",
            "Sift-proof natural wood (4C2)",
            "Plywood (4D)",
            "Reconstituted wood (4F)",
            "Fiberboard (4G)",
            "Expanded plastic (4H1)",
            "Solid plastic (4H2)",
            "Other metal (4N)",
          ],
          jerricans: [
            "Removable head steel (3A2)",
            "Aluminum removable head (3B2)",
            "Plastic removable head (3H2)",
          ],
        },
      },
    },
    "A10.11.": {
      packagingInstructions: {
        combinationPackaging: {
          innerPackaging: {
            required: true,
            receptacles: ["Glass", "Steel"],
          },
          outerPackaging: {
            drums: [
              "Steel (1A2)",
              "Plywood (1D)",
              "Fiber (1G)",
              "Plastic (1H2)",
            ],
            boxes: [
              "Steel (4A)",
              "Natural wood (4C1, 4C2)",
              "Plywood (4D)",
              "Reconstituted wood (4F)",
              "Fiberboard (4G)",
              "Expanded plastic (4H1)",
              "Solid plastic (4H2)",
            ],
          },
        },
        compositePackaging: {
          innerReceptacle: {
            materials: ["Plastic"],
          },
          outerPackaging: {
            drums: ["Steel drum (6HA1)"],
          },
        },
        singlePackaging: {
          innerPackaging: {
            required: false,
          },
          outerPackaging: {
            drums: ["Steel (1A1)"],
            jerricans: ["Steel (3A1)"],
          },
        },
      },
    },
    "A10.12.": {
      packagingInstructions: {
        liquidToxins: {
          combinationPackaging: {
            innerPackaging: {
              required: true,
              receptacles: ["Glass", "Plastic", "Metal"],
              quantityLimits: {
                PG_I: {
                  glassOrPlastic: "1.0 L",
                  metal: "2.5 L",
                },
                PG_II: {
                  glassOrPlastic: "2.5 L",
                  metal: "5.0 L",
                },
                PG_III: {
                  glassOrPlastic: "5.0 L",
                  metal: "10.0 L",
                },
              },
            },
            outerPackaging: {
              drums: [
                "Steel (1A1, 1A2)",
                "Aluminum (1B1, 1B2)",
                "Plywood (1D)",
                "Fiber (1G)",
                "Plastic (1H1, 1H2)",
                "Other metal (1N1, 1N2)",
              ],
              boxes: [
                "Steel (4A)",
                "Aluminum (4B)",
                "Ordinary natural wood (4C1)",
                "Sift-proof natural wood (4C2)",
                "Plywood (4D)",
                "Reconstituted wood (4F)",
                "Fiberboard (4G)",
                "Expanded plastic (4H1)",
                "Solid plastic (4H2)",
                "Other metal (4N)",
              ],
              jerricans: [
                "Steel (3A1, 3A2)",
                "Aluminum (3B1, 3B2)",
                "Plastic (3H1, 3H2)",
              ],
              quantityLimits: {
                PG_I: "30 L",
                PG_II: "60 L",
                PG_III: "220 L",
              },
            },
          },
          singlePackaging: {
            innerPackaging: {
              required: false,
            },
            outerPackaging: {
              drums: [
                "Steel (1A1, 1A2)",
                "Aluminum (1B1, 1B2)",
                "Plastic (1H1, 1H2)",
                "Other metal (1N1, 1N2)",
              ],
              jerricans: [
                "Steel (3A1, 3A2)",
                "Aluminum (3B1, 3B2)",
                "Plastic (3H1, 3H2)",
              ],
              quantityLimits: {
                PG_I: "30 L",
                PG_II: "60 L",
                PG_III: "220 L",
              },
            },
          },
          compositePackaging: {
            innerReceptacle: {
              materials: ["Plastic"],
            },
            outerPackaging: {
              drums: [
                "Steel (6HA1)",
                "Aluminum (6HB1)",
                "Plywood (6HD1)",
                "Fiber (6HG1)",
                "Plastic (6HH1)",
              ],
              boxes: [
                "Steel (6HA2)",
                "Aluminum (6HB2)",
                "Wooden (6HC)",
                "Plywood (6HD2)",
                "Fiberboard (6HG2)",
                "Plastic (6HH2)",
              ],
              quantityLimits: {
                PG_I: "30 L",
                PG_II: "60 L",
                PG_III: "220 L",
              },
            },
          },
        },
        solidToxins: {
          combinationPackaging: {
            innerPackaging: {
              required: true,
              receptacles: [
                "Fiber",
                "Glass",
                "Paper bag",
                "Plastic",
                "Plastic bag",
                "Metal",
              ],
              quantityLimits: {
                PG_I: {
                  fiberGlassPaperBagPlasticBag: "1.0 kg",
                  plasticOrMetal: "2.5 kg",
                },
                PG_II: {
                  fiberGlassPaperBagPlasticBag: "2.5 kg",
                  plasticOrMetal: "5.0 kg",
                },
                PG_III: {
                  fiberGlassPaperBagPlasticBag: "5.0 kg",
                  plasticOrMetal: "10.0 kg",
                },
              },
            },
            outerPackaging: {
              drums: [
                "Steel (1A1, 1A2)",
                "Aluminum (1B1, 1B2)",
                "Plywood (1D)",
                "Fiber (1G)",
                "Plastic (1H1, 1H2)",
                "Other metal (1N1, 1N2)",
              ],
              boxes: [
                "Steel (4A)",
                "Aluminum (4B)",
                "Ordinary natural wood (4C1)",
                "Sift-proof natural wood (4C2)",
                "Plywood (4D)",
                "Reconstituted wood (4F)",
                "Fiberboard (4G)",
                "Expanded plastic (4H1)",
                "Solid plastic (4H2)",
                "Other metal (4N)",
              ],
              jerricans: [
                "Steel (3A1, 3A2)",
                "Aluminum (3B1, 3B2)",
                "Plastic (3H1, 3H2)",
              ],
              quantityLimits: {
                PG_I: "50 kg",
                PG_II: "100 kg",
                PG_III: "200 kg",
              },
            },
          },
          singlePackaging: {
            innerPackaging: {
              required: false,
            },
            outerPackaging: {
              drums: [
                "Steel (1A1, 1A2)",
                "Aluminum (1B1, 1B2)",
                "Plywood (1D)",
                "Fiber (1G)",
                "Plastic (1H1, 1H2)",
                "Other metal (1N1, 1N2)",
              ],
              boxes: [
                "Steel (4A)",
                "Aluminum (4B)",
                "Ordinary natural wood (4C1)",
                "Sift-proof natural wood (4C2)",
                "Plywood (4D)",
                "Reconstituted wood (4F)",
                "Fiberboard (4G)",
                "Solid plastic (4H2)",
                "Other metal (4N)",
              ],
              notes: [
                "Boxes are not allowed for PG I materials.",
                "Fit fiber, fiberboard, wood, and plywood packagings with a suitable liner.",
              ],
              jerricans: [
                "Steel (3A1, 3A2)",
                "Aluminum (3B1, 3B2)",
                "Plastic (3H1, 3H2)",
              ],
              quantityLimits: {
                PG_I: "50 kg",
                PG_II: "100 kg",
                PG_III: "200 kg",
              },
            },
          },
          compositePackaging: {
            innerReceptacle: {
              materials: ["Plastic"],
            },
            outerPackaging: {
              drums: [
                "Steel (6HA1)",
                "Aluminum (6HB1)",
                "Plywood (6HD1)",
                "Fiber (6HG1)",
                "Plastic (6HH1)",
              ],
              boxes: [
                "Steel (6HA2)",
                "Aluminum (6HB2)",
                "Wood (6HC)",
                "Plywood (6HD2)",
                "Fiberboard (6HG2)",
                "Plastic (6HH2)",
              ],
              quantityLimits: {
                PG_I: "50 kg",
                PG_II: "100 kg",
                PG_III: "200 kg",
              },
            },
          },
        },
      },
    },
    "A10.13.": {
      packagingInstructions: {
        innerPackaging: {
          required: true,
          receptacles: [
            "Constructed of suitable materials and secured in the article in such a way that, under normal conditions of transport, they cannot break, be punctured, or leak their contents into the article itself or the outer packaging.",
          ],
        },
        outerPackaging: {
          drums: [
            "Removable head steel (1A2)",
            "Removable head aluminum (1B2)",
            "Removable head metal other than steel or aluminum (1N2)",
            "Plywood (1D)",
            "Fiber (1G)",
            "Removable head plastic (1H2)",
          ],
          boxes: [
            "Steel (4A)",
            "Aluminum (4B)",
            "Ordinary natural wood (4C1)",
            "Sift-proof natural wood (4C2)",
            "Plywood (4D)",
            "Reconstituted wood (4F)",
            "Fiberboard (4G)",
            "Expanded plastic (4H1)",
            "Solid plastic (4H2)",
            "Other metal (4N)",
          ],
          jerricans: [
            "Removable head steel (3A2)",
            "Plastic removable head (3H2)",
            "Aluminum removable head (3B2)",
          ],
        },
      },
    },
    "A11.7.": {
      description:
        "Packages Containing Uranium Hexafluoride (fissile, fissile excepted, and nonfissile). The mass of uranium hexafluoride in a package shall not have a value that would lead to a ullage smaller than 5% at the maximum temperature of the package as specified for the plant systems where the package is used. The uranium hexafluoride shall be in solid form and the internal pressure of the package shall be below atmospheric pressure when presented for transport. Prepare this material for military air shipment according to 49 CFR Section 173.420.",
    },
    "A11.11.": {
      description:
        "Special Arrangement (Competent Authority Approval). If the radioactive material does not comply with any of the methods of packing provided in this manual, the material may be permitted to be transported by CAA. The provisions for carrying the radioactive material using a CAA must be approved by all countries concerned. These provisions must be adequate to ensure that the overall level of safety in transport and in-transit storage is at least equivalent to the level of safety which would be provided if all the applicable requirements of these regulations had been met. Each consignment must have multilateral approval.",
    },
    "A12.2.": {
      packagingInstructions: {
        combinationPackaging: {
          innerPackaging: {
            required: true,
            receptacles: ["Glass", "Earthenware", "Plastic", "Metal"],
            notes: [
              "For PG I material inner packagings packed in a rigid and leakproof receptacle or intermediate packaging containing sufficient absorbent material to absorb the entire contents of all inner packagings before packing the inner packaging(s) in the outer package.",
              "Inner packaging or receptacle closures of combination packages containing liquids must be held securely, tightly, and effectively in place by secondary means. See A20.3.",
            ],
          },
          outerPackaging: {
            drums: [
              "Steel (1A1 or 1A2)",
              "Aluminum (1B1 or 1B2)",
              "Plywood (1D)",
              "Fiber (1G)",
              "Plastic (1H1 or 1H2)",
              "Other metal than steel or aluminum (1N1 or 1N2)",
            ],
            barrels: ["Wood (2C2)"],
            notes: ["Wood barrel (2C2) not authorized for PG I material."],
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
              "Expanded plastic (4H1)",
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
              "Fiber (1G) with liner",
              "Plastic (1H1 or 1H2)",
              "Other metal than steel or aluminum (1N1 or 1N2)",
            ],
            notes: [
              "Fiber drum (1G) with liner only authorized for PG II and III material.",
              "Wood barrel (2C1) not authorized for PG I material.",
            ],
            barrels: ["Wood (2C1)"],
            jerricans: [
              "Steel (3A1 or 3A2)",
              "Aluminum (3B1 or 3B2)",
              "Plastic (3H1 or 3H2)",
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
              "Fiber (6HG1)",
              "Plastic (6HH1)",
              "Plywood (6HD1)",
            ],
            notes: ["Plywood drums not authorized for PG I material."],
            boxes: [
              "Steel (6HA2)",
              "Aluminum (6HB2)",
              "Wooden (6HC)",
              "Plywood (6HD2)",
              "Fiberboard (6HG2)",
            ],
          },
        },
        compositePackagingWithGlassPorcelainOrStonewareInnerReceptacles: {
          innerReceptacle: {
            materials: ["Glass", "Porcelain", "Stoneware"],
          },
          outerPackaging: {
            drums: ["Steel (6PA1)", "Aluminum (6PB1)", "Fiber (6PG1)"],
            boxes: [
              "Steel (6PA2)",
              "Aluminum (6PB2)",
              "Wooden (6PC)",
              "Fiberboard (6PG2)",
            ],
            plastics: [
              "Solid plastic packaging (6PH1)",
              "Expanded plastic packaging (6PH2)",
            ],
            wickerwork: ["Plywood drum (6PD1)", "Wickerwork hamper (6PD2)"],
            note: "Plywood drum and wickerwork hamper not authorized for PG I material.",
          },
        },
      },
    },
    "A12.3.": {
      packagingInstructions: {
        combinationPackaging: {
          innerPackaging: {
            required: true,
            receptacles: ["Glass", "Earthenware", "Plastic", "Metal"],
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
              "Solid plastic box (4H2)",
              "Metal other than steel or aluminum (4N)",
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
              "Plastic (1H1 or 1H2)",
              "Fiber (1G)",
              "Metal other than steel or aluminum (1N1 or 1N2)",
            ],
            notes: [
              "Plywood (1D) is not authorized for PG I material.",
              "Wood barrels (2C1 or 2C2) are not authorized for PG I material.",
              "Steel (4A), aluminum (4B), natural wood (4C1), plywood (4D), reconstituted wood (4F), fiberboard (4G), expanded plastic (4H1) or solid plastic (4H2) boxes are not authorized for PG I material.",
              "Bags are not authorized for PG I material.",
            ],
            barrel: ["Wood (2C1 or 2C2)"],
            jerricans: [
              "Steel (3A1 or 3A2)",
              "Aluminum (3B1 or 3B2)",
              "Plastic (3H1 or 3H2)",
            ],
            boxes: [
              "Steel or steel with liner (4A)",
              "Aluminum or aluminum with liner (4B)",
              "Natural wood (4C1)",
              "Sift-proof natural wood (4C2)",
              "Plywood (4D)",
              "Reconstituted wood (4F)",
              "Fiberboard (4G)",
              "Expanded plastic (4H1)",
              "Solid plastic (4H2)",
              "Metal other than steel or aluminum (4N)",
            ],
            bags: [
              "Woven plastic (5H1, 5H2, or 5H3)",
              "Plastic film (5H4)",
              "Textile (5L1, 5L2, or 5L3)",
              "Paper, multiwall, water-resistant (5M2)",
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
              "Plastic (6HH1)",
            ],
            boxes: [
              "Steel (6HA2)",
              "Aluminum (6HB2)",
              "Wood (6HC)",
              "Plywood (6HD2)",
              "Fiberboard (6HG2)",
            ],
            note: "Boxes are not authorized for PG I material.",
          },
        },
        compositePackagingWithGlassPorcelainOrStonewareInnerReceptacles: {
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
          },
        },
      },
    },
    "A12.4.": {
      packagingInstructions: {
        packagingInstructionsA12_4_2: {
          description:
            "Pack batteries packed without other materials in boxes, drums, or jerricans as follows:",
          innerPackaging: {
            required: false,
          },
          outerPackaging: {
            boxes: [
              "Wooden (4C1)",
              "Wooden (4C2)",
              "Wooden (4D)",
              "Wooden (4F)",
              "Fiberboard (4G)",
              "Solid plastic (4H2)",
            ],
            drums: ["Plywood (1D)", "Fiber (1G)", "Plastic (1H2)"],
            jerricans: ["Plastic (3H2)"],
            note: "All outer packagings must meet PG II performance standards.",
          },
        },
        packagingInstructionsA12_4_4_1: {
          description:
            "Package in boxes with glass inner receptacles as follows:",
          innerPackaging: {
            required: true,
            glass: ["Glass receptacles"],
            note: "Not over 4.0 L (1 gallon) capacity each.",
          },
          outerPackaging: {
            boxes: [
              "Wooden box (4C1)",
              "Wooden box (4C2)",
              "Wooden box (4D)",
              "Wooden box (4F)",
            ],
            note: "Maximum quantity is 8.0 L (2 gallons) each. Cushion and separate the inside containers from batteries by a strong solid wooden partition.",
          },
        },
        packagingInstructionsA12_4_4_2: {
          description:
            "Package in boxes with plastic inner bottles as follows:",
          innerPackaging: {
            required: true,
            plastics: ["Plastic bottles"],
            note: "Not over 1 L (1 quart) capacity each.",
          },
          outerPackaging: {
            boxes: [
              "Wooden box (4C1)",
              "Wooden box (4C2)",
              "Wooden box (4D)",
              "Wooden box (4F)",
            ],
            note: "Pack no more than 24 bottles, securely separated from storage batteries and filling kits in each package.",
          },
        },
      },
    },
    "A12.5.": {
      description:
        "Package Bombs, Smoke, Nonexplosive as follows: Ship bombs, smoke, nonexplosive\n      provided they are without ignition elements, bursting charges, detonating fuses, or other\n      explosive components. Packaging meeting PG II performance standard is required. Package in\n      steel (4A), aluminum (4B), wooden (4C1, 4C2), plywood (4D), reconstituted wood (4F),\n      fiberboard (4G), solid plastic (4H2), or other metal (4N) boxes; or steel (1A2), aluminum (1B2),\n      plywood (1D), fiber (1G), plastic (1H2), or other metal (1N2) drums.",
    },
    "A12.6.": {
      packagingInstructions: {
        innerPackaging: {
          required: true,
          receptacles: [
            "Constructed of suitable materials and secured in the article in such a way that, under normal conditions of transport, they cannot break, be punctured, or leak their contents into the article itself or the outer packaging.",
          ],
        },
        outerPackaging: {
          drums: [
            "Removable head steel (1A2)",
            "Removable head aluminum (1B2)",
            "Removable head metal other than steel or aluminum (1N2)",
            "Plywood (1D)",
            "Fiber (1G)",
            "Removable head plastic (1H2)",
          ],
          boxes: [
            "Steel (4A)",
            "Aluminum (4B)",
            "Ordinary natural wood (4C1)",
            "Sift-proof natural wood (4C2)",
            "Plywood (4D)",
            "Reconstituted wood (4F)",
            "Fiberboard (4G)",
            "Expanded plastic (4H1)",
            "Solid plastic (4H2)",
            "Other metal (4N)",
          ],
          jerricans: [
            "Removable head steel (3A2)",
            "Plastic removable head (3H2)",
            "Aluminum removable head (3B2)",
          ],
        },
      },
    },
    "A12.7.": {
      description:
        "Package Gallium as follows: Package gallium metal in semi-rigid plastic inside\n      packaging of not more than a 2.5 kg (5.5 pounds) net capacity each, then individually enclosed\n      in a sealed bag of strong, leak-tight, and puncture-resistant material impervious to liquid\n      gallium. Place the sealed bag in a wooden (4C1, 4C2), plywood (4D), reconstituted wood (4F), fiberboard (4G), \n      plastic (4H1, 4H2) or metal, other than steel or aluminum (4N) boxes or in a\n      steel (1A1, 1A2), fiber (1G), plastic (1H1 or 1H2), or metal, other than steel or aluminum (1N1,\n      1N2) drum lined with a strong, leak-tight, and puncture-resistant material impervious to liquid\n      gallium. If necessary to keep in a solid state, enclose this packaging in a strong, water-resistant\n      outer packaging that contains dry ice or other means of refrigeration. Refrigerate the gallium\n      sufficiently to maintain in a completely solid state during the entire anticipated time it will be\n      in transportation to its destination. If a refrigerant is used, ensure all packaging materials are\n      chemically and physically resistant to the refrigerant and have impact resistance at the low\n      temperatures of the refrigerant used. If dry ice is used, ensure the outer package permits the\n      release of carbon dioxide gas. Packaging meeting PG I performance standard is required.\n      Manufactured articles, each not containing more than 100 mg (0.0035 ounce) of gallium and\n      packaged so that the quantity per package does not exceed 1 g (0.35 ounce) are not subject to\n      any other requirements of this manual (see paragraph A3.1.16.3.).",
    },
    "A12.8.": {
      description:
        "Package Hydrogen Fluoride as follows: Package hydrogen fluoride (hydrofluoric acid,\n      anhydrous) in cylinders, DOT 3, 3A, 3AA, 3B, 3BN, or 3E; also DOT 4B, 4BA, 4BW if not\n      brazed. Filling density may not exceed 85 percent of the water weight capacity of the cylinder.\n      In place of the periodic volumetric expansion test required, cylinders used exclusively in this\n      manner may be given a complete external visual inspection in conformance with 49 CFR Part\n      180, Subpart C at the time such periodic inspection becomes due and documented.",
    },
    "A12.12.": {
      packagingInstructions: {
        innerPackaging: {
          required: false,
          notes: ["The weight of the fuel cells may not exceed 1 kg."],
        },
        outerPackaging: {
          drums: [
            "Steel (1A2)",
            "Aluminium (1B2)",
            "Plywood (1D)",
            "Fiber (1G)",
            "Plastic (1H2)",
            "Other metal (1N2)",
          ],
          jerricans: ["Steel (3A2)", "Aluminum (3B2)", "Plastic (3H2)"],
          boxes: [
            "Steel (4A)",
            "Aluminum (4B)",
            "Wood (4C1, 4C2)",
            "Plywood (4D)",
            "Reconstituted wood (4F)",
            "Fiberboard (4G)",
            "Plastic (4H2)",
            "Other metal (4N)",
          ],
          notes: ["The weight of the fuel cells may not exceed 1 kg."],
        },
      },
    },
    "A12.13.": {
      description: "For Fuel Cells Contained in Equipment",
      packagingInstructions: {
        subParagraphs: {
          "A12.13.1.": {
            instructions: `UN specification packaging is not required. Pack fuel cells in strong outer container.
Protect installed fuel cells in equipment against short circuit, and protect the entire system
against inadvertent operation. Fuel cell systems may not charge batteries during transport.`,
          },
          "A12.13.2.": {
            instructions: `Protect the terminals of the installed fuel cells to prevent short circuit by use of
protective coverings, taping, etc.`,
          },
        },
      },
    },
    "A12.14.": {
      description: "For Fuel Cells Packed With Equipment",
      packagingInstructions: {
        subParagraphs: {
          "A12.14.1.": {
            instructions: `UN specification packaging is not required. Pack fuel cells in strong outer container.
Pack fuel cells in inner packagings or pack in the outer packaging with cushioning material or
divider(s) in order to protect against damage that may be caused by the movement or placement
of contents within the outer packaging. The maximum number of fuel cell cartridges in the
intermediate packaging may not be more than the number required to power the equipment
plus two spares.`,
          },
        },
      },
    },
    "A12.15.": {
      description: `Package Chlorosilanes as follows: Packaging meeting the PG I or PG II performance
standard is required.`,
      packagingInstructions: {
        combinationPackaging: {
          innerPackaging: {
            required: true,
            receptacles: ["Glass", "Steel"],
          },
          outerPackaging: {
            drums: [
              "Steel (1A2)",
              "Plywood (1D)",
              "Fiber (1G)",
              "Plastic (1H2)",
            ],
            boxes: [
              "Steel (4A)",
              "Natural wood (4C1, 4C2)",
              "Plywood (4D)",
              "Reconstituted wood (4F)",
              "Fiberboard (4G)",
              "Expanded plastic (4H1)",
              "Solid plastic (4H2)",
            ],
          },
        },
        compositePackaging: {
          innerReceptacle: {
            materials: ["Plastic"],
          },
          outerPackaging: {
            drums: ["Steel drum (6HA1)"],
          },
        },
        singlePackaging: {
          innerPackaging: {
            required: false,
          },
          outerPackaging: {
            drums: ["Steel (1A1)"],
            jerricans: ["Steel (3A1)"],
          },
        },
      },
    },
    "A13.2.": {
      packagingInstructions: {
        liquids: {
          combinationPackaging: {
            innerPackaging: {
              required: true,
              receptacles: ["Glass", "Earthenware", "Plastic", "Metal"],
            },
            outerPackaging: {
              drums: [
                "Steel (1A2)",
                "Aluminum (1B2)",
                "Metal other than steel or aluminum (1N2)",
                "Plywood (1D)",
                "Fiber (1G)",
                "Plastic (1H2)",
              ],
              barrels: ["Wooden (2C2)"],
              jerricans: ["Steel (3A2)", "Aluminum (3B2)", "Plastic (3H2)"],
              boxes: [
                "Steel (4A)",
                "Aluminum (4B)",
                "Natural wood (4C1, 4C2)",
                "Plywood (4D)",
                "Reconstituted wood (4F)",
                "Fiberboard (4G)",
                "Expanded plastic (4H1)",
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
                "Steel (1A1, 1A2)",
                "Aluminum (1B1, 1B2)",
                "Fiber (1G)",
                "Plastic (1H1, 1H2)",
                "Metal other than steel or aluminum (1N1, 1N2)",
              ],
              barrels: ["Wooden (2C1)"],
              jerricans: [
                "Steel (3A1, 3A2)",
                "Aluminum (3B1, 3B2)",
                "Plastic (3H1, 3H2)",
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
                "Plastic (6HH1)",
              ],
              boxes: [
                "Steel (6HA2)",
                "Aluminum (6HB2)",
                "Wooden (6HC)",
                "Plywood (6HD2)",
                "Fiberboard (6HG2)",
              ],
            },
          },
          compositePackagingWithGlassPorcelainOrStoneware: {
            innerPackaging: {
              required: true,
              receptacles: ["Glass", "Porcelain", "Stoneware"],
            },
            outerPackaging: {
              drums: ["Steel (6PA1)", "Aluminum (6PB1)", "Fiber (6PG1)"],
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
              other: ["Plywood drum (6PD1)", "Wickerwork hamper (6PD2)"],
            },
          },
        },
        solids: {
          combinationPackaging: {
            innerPackaging: {
              required: true,
              receptacles: ["Glass", "Earthenware", "Plastic", "Metal"],
            },
            outerPackaging: {
              drums: [
                "Steel (1A1, 1A2)",
                "Aluminum (1B1, 1B2)",
                "Plywood (1D)",
                "Fiber (1G)",
                "Plastic (1H1, 1H2)",
                "Metal other than steel or aluminum (1N1, 1N2)",
              ],
              barrels: ["Wooden (2C2)"],
              jerricans: [
                "Steel (3A1, 3A2)",
                "Aluminum (3B1, 3B2)",
                "Plastic (3H1, 3H2)",
              ],
              boxes: [
                "Steel (4A)",
                "Aluminum (4B)",
                "Natural wood (4C1, 4C2)",
                "Plywood (4D)",
                "Reconstituted wood (4F)",
                "Fiberboard (4G)",
                "Solid plastic (4H2)",
                "Metal other than steel or aluminum (4N)",
              ],
            },
          },
          singlePackaging: {
            innerPackaging: {
              required: false,
            },
            outerPackaging: {
              drums: [
                "Steel (1A1, 1A2)",
                "Aluminum (1B1, 1B2)",
                "Plywood (1D)",
                "Fiber (1G)",
                "Plastic (1H1, 1H2)",
                "Metal other than steel or aluminum (1N1, 1N2)",
              ],
              barrels: ["Wooden (2C1, 2C2)"],
              jerricans: [
                "Steel (3A1, 3A2)",
                "Aluminum (3B1, 3B2)",
                "Plastic (3H1, 3H2)",
              ],
              boxes: [
                "Steel (4A)",
                "Steel with liner (4A)",
                "Aluminum (4B)",
                "Aluminum with liner (4B)",
                "Natural wood (4C1, 4C2)",
                "Sift-proof natural wood (4C2)",
                "Plywood (4D)",
                "Reconstituted wood (4F)",
                "Fiberboard (4G)",
                "Expanded plastic (4H1)",
                "Solid plastic (4H2)",
                "Metal, other than steel or aluminum (4N)",
              ],
              bags: [
                "Woven plastic (5H1, 5H2, 5H3)",
                "Plastic film (5H4)",
                "Textile (5L1, 5L2, 5L3)",
                "Paper, multiwall, water-resistant (5M2)",
              ],
              note: "Bags are not authorized for PG I materials.",
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
                "Plastic (6HH1)",
              ],
              boxes: [
                "Steel (6HA2)",
                "Aluminum (6HB2)",
                "Wood (6HC)",
                "Plywood (6HD2)",
                "Fiberboard (6HG2)",
              ],
              note: "Boxes are not authorized for PG I materials.",
            },
          },
          compositePackagingWithGlassPorcelainOrStoneware: {
            innerPackaging: {
              required: true,
              receptacles: ["Glass", "Porcelain", "Stoneware"],
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
            },
          },
        },
      },
    },
    "A13.5.": {
      packagingInstructions: {
        innerPackaging: {
          required: true,
          receptacles: [
            "Constructed of suitable materials and secured in the article in such a way that, under normal conditions of transport, they cannot break, be punctured, or leak their contents into the article itself or the outer packaging.",
          ],
        },
        outerPackaging: {
          drums: [
            "Removable head steel (1A2)",
            "Removable head aluminum (1B2)",
            "Removable head metal other than steel or aluminum (1N2)",
            "Plywood (1D)",
            "Fiber (1G)",
            "Removable head plastic (1H2)",
          ],
          boxes: [
            "Steel (4A)",
            "Aluminum (4B)",
            "Ordinary natural wood (4C1)",
            "Sift-proof natural wood (4C2)",
            "Plywood (4D)",
            "Reconstituted wood (4F)",
            "Fiberboard (4G)",
            "Expanded plastic (4H1)",
            "Solid plastic (4H2)",
            "Other metal (4N)",
          ],
          jerricans: [
            "Removable head steel (3A2)",
            "Plastic removable head (3H2)",
            "Aluminum removable head (3B2)",
          ],
        },
      },
    },
    "A13.15.": {
      description:
        "Package Air Bag Inflators, Air Bag Modules, and Seat-Belt Pretensioners as follows: items are classified as Class 9 and are approved by DOT according to 49 CFR Section 173.166.",
      packagingInstructions: {
        innerPackaging: {
          required: false,
        },
        outerPackaging: {
          boxes: [
            "Steel (4A)",
            "Aluminum (4B)",
            "Wooden (4C1 or 4C2)",
            "Plywood (4D)",
            "Reconstituted wood (4F)",
            "Fiberboard (4G)",
            "Plastic (4H1 or 4H2)",
            "Other metal (4N)",
          ],
          drums: [
            "Steel (1A2)",
            "Aluminum (1B2)",
            "Plywood (1D)",
            "Fiber (1G)",
            "Plastic (1H2)",
            "Other metal (1N2)",
          ],
          jerricans: ["Steel (3A2)", "Aluminum (3B2)", "Plastic (3H2)"],
        },
      },
    },
    "A13.17.": {
      description:
        "Package Polymeric Beads, Expandable and Plastic Molding Compound: Pack polymeric beads or granules, expandable, evolving flammable vapor and plastic molding compound in dough, sheet, or extruded rope form, evolving flammable vapor in boxes or drums.",
      packagingInstructions: {
        innerPackaging: {
          required: true,
          plastics: ["Sealed plastic liner"],
        },
        outerPackaging: {
          boxes: [
            "Steel (4A)",
            "Aluminum (4B)",
            "Wood (4C1 or 4C2)",
            "Plywood (4D)",
            "Fiberboard (4G)",
            "Reconstituted wood (4F)",
            "Plastic (4H1 or 4H2)",
            "Other metal (4N)",
          ],
          drums: ["Plywood (1D)", "Fiber (1G)"],
          note: "Vapor-tight metal or plastic drums (1A1, 1A2, 1B1, 1B2, 1H1, 1H2, 1N1, or 1N2) may also be used (without liner).",
        },
      },
    },
  };
