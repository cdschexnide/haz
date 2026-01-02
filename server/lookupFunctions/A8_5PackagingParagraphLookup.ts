// types/packaging.ts

export type CylinderSpec = {
  cylinderType: string;
  specs: string[];
};

export type OuterPackaging = {
  boxes?: string[];
  drums?: string[];
  jerricans?: string[];
};

export type InnerPackaging = {
  receptacles?: string[];
  receptacleType?: string;
  maxCapacityPerReceptacle: string;
  requirements: string[];
};

export type CylinderPackaging = {
  allowedCylinders: CylinderSpec[];
  outerPackaging: OuterPackaging;
  notes: string[];
};

export type CombinationPackaging = {
  outerPackaging: OuterPackaging;
  innerPackaging: InnerPackaging;
  maxInnerContainers?: number;
  outerPackagingLimit?: string;
};

export type HighSpecComboPackaging = {
  innerPackaging: {
    type: string;
    capacities: string[];
    wallThickness: string;
    openings: string[];
    maxDrumsPerOuter: number;
  };
  outerPackaging: {
    type: string;
    maxCapacity: string;
    wallThickness: string;
    closure: string;
  };
};

export type A8_5PackagingParagraphReference = {
  description: string;
  packagingInstructions: {
    cylinderPackaging: CylinderPackaging;
    combinationPackagingSmallCans: CombinationPackaging;
    combinationPackagingMediumCans: CombinationPackaging;
    highSpecComboPackaging: HighSpecComboPackaging;
  };
};

export const A8_5PackagingParagraphReferenceLookup: A8_5PackagingParagraphReference =
  {
    description:
      "Packaging for Pyrophoric Liquid Materials (Class 4.2) is as follows:",
    packagingInstructions: {
      cylinderPackaging: {
        allowedCylinders: [
          {
            cylinderType: "Steel",
            specs: ["Minimum design pressure: 1206 kPa / 175 psig"],
          },
          {
            cylinderType: "Nickel",
            specs: ["Minimum design pressure: 1206 kPa / 175 psig"],
          },
          {
            cylinderType: "Aluminum Alloy DOT 3AL",
            specs: [
              "Minimum design pressure: 12411 kPa / 1800 psig",
              "Maximum water capacity of 49 L (13 gal)",
              "Maximum water capacity of 49 L (13 gal)",
            ],
          },
        ],
        outerPackaging: {
          boxes: [
            "Natural wood (4C1 or 4C2)",
            "Plywood (4D)",
            "Reconstituted wood (4F)",
            "Fiberboard (4G)",
            "Plastic (4H1 or 4H2)",
          ],
        },
        notes: [
          "Valve-equipped cylinders must have steel protection caps or collars",
          "Cylinders must be secured to prevent movement and oriented to keep pressure relief valves in vapor space",
        ],
      },
      combinationPackagingSmallCans: {
        outerPackaging: {
          boxes: [
            "Steel (4A)",
            "Aluminum (4B)",
            "Natural wood (4C1 or 4C2)",
            "Plywood (4D)",
            "Reconstituted wood (4F)",
            "Fiberboard (4G)",
            "Other metal (4N)",
          ],
          drums: [
            "Steel (1A1 or 1A2)",
            "Aluminum (1B1 or 1B2)",
            "Plywood (1D)",
            "Fiber (1G)",
            "Other metal (1N1 or 1N2)",
          ],
          jerricans: ["Steel (3A1 or 3A2)", "Aluminum (3B1 or 3B2)"],
        },
        innerPackaging: {
          receptacles: ["Glass", "Metal"],
          maxCapacityPerReceptacle: "1 L",
          requirements: [
            "Each inner receptacle must have a positive screw cap closure with gasket",
            "All receptacles must be cushioned on all sides with dry, incombustible absorbent sufficient to absorb full contents",
            "Strong, tight metal cans must be closed by positive means (not friction)",
          ],
        },
        maxInnerContainers: 4,
      },
      combinationPackagingMediumCans: {
        outerPackaging: {
          drums: [
            "Steel (1A1 or 1A2)",
            "Aluminum (1B1 or 1B2)",
            "Fiber (1G)",
            "Other metal (1N1 or 1N2)",
          ],
          jerricans: ["Steel (3A1 or 3A2)", "Aluminum (3B1 or 3B2)"],
          boxes: ["Steel (4A)", "Aluminum (4B)", "Other metal (4N)"],
        },
        outerPackagingLimit: "220 L",
        innerPackaging: {
          receptacleType: "Metal cans",
          maxCapacityPerReceptacle: "4 L",
          requirements: ["Must be closed by positive means (not friction)"],
        },
      },
      highSpecComboPackaging: {
        innerPackaging: {
          type: "UN1A1 stainless steel drum",
          capacities: ["10 L", "20 L"],
          wallThickness: "≥1.9 mm",
          openings: [
            "4x NPT or VCR (6.3 mm each)",
            "1 center opening (≤68.3 mm) with threaded closure (316 stainless steel)",
          ],
          maxDrumsPerOuter: 2,
        },
        outerPackaging: {
          type: "UN1A2 steel drum",
          maxCapacity: "208 L",
          wallThickness: "≥1.0 mm",
          closure: "Steel closing ring ≥2.4 mm",
        },
      },
    },
  };
