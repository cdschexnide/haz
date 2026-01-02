import { HazardousMaterialContext } from "../../types";

interface TableA20_1AbsorbentMaterialRequirements {
  quantity: {
    L: number;
    pt?: number;
    qt?: number;
    gal?: number;
  };
  vermiculite: {
    sides: {
      cm: number;
      in: number;
    };
    topBottom: {
      cm: number;
      in: number;
    };
  };
  diatomaceousEarth: {
    sides: {
      cm: number;
      in: number;
    };
    topBottom: {
      cm: number;
      in: number;
    };
  };
  absorbentSheetMaterials: string;
  cellulosicParticulate: string;
}

/* Table A20.1. Absorbent Material Requirements. */
const tableA20_1AbsorbentMaterialRequirements: TableA20_1AbsorbentMaterialRequirements[] =
  [
    {
      quantity: {
        L: 0.5,
        pt: 1,
      },
      vermiculite: {
        sides: { cm: 2.5, in: 1 },
        topBottom: { cm: 3.8, in: 1.5 },
      },
      diatomaceousEarth: {
        sides: { cm: 5.0, in: 2 },
        topBottom: { cm: 11.5, in: 4.5 },
      },
      absorbentSheetMaterials:
        "Completely wrap each inner packaging; for capacity, follow manufacturer's instructions",
      cellulosicParticulate:
        "For capacity, use manufacturer's instructions; if unknown, same as vermiculite",
    },
    {
      quantity: {
        L: 1,
        qt: 1,
      },
      vermiculite: { sides: { cm: 2.5, in: 1 }, topBottom: { cm: 5.0, in: 2 } },
      diatomaceousEarth: {
        sides: { cm: 5.0, in: 2 },
        topBottom: { cm: 14.0, in: 5.5 },
      },
      absorbentSheetMaterials:
        "Completely wrap each inner packaging; for capacity, follow manufacturer's instructions",
      cellulosicParticulate:
        "For capacity, use manufacturer's instructions; if unknown, same as vermiculite",
    },
    {
      quantity: {
        L: 2.5,
        gal: 0.5,
      },
      vermiculite: {
        sides: { cm: 3.8, in: 1.5 },
        topBottom: { cm: 5.0, in: 2 },
      },
      diatomaceousEarth: {
        sides: { cm: 7.5, in: 3 },
        topBottom: { cm: 14, in: 5.5 },
      },
      absorbentSheetMaterials:
        "Completely wrap each inner packaging; for capacity, follow manufacturer's instructions",
      cellulosicParticulate:
        "For capacity, use manufacturer's instructions; if unknown, same as vermiculite",
    },
    {
      quantity: {
        L: 4,
        gal: 1,
      },
      vermiculite: {
        sides: { cm: 3.8, in: 1.5 },
        topBottom: { cm: 6.5, in: 2.5 },
      },
      diatomaceousEarth: {
        sides: { cm: 10, in: 4 },
        topBottom: { cm: 15.5, in: 6 },
      },
      absorbentSheetMaterials:
        "Completely wrap each inner packaging; for capacity, follow manufacturer's instructions",
      cellulosicParticulate:
        "For capacity, use manufacturer's instructions; if unknown, same as vermiculite",
    },
    {
      quantity: {
        L: 7.6,
        gal: 2,
      },
      vermiculite: { sides: { cm: 5.0, in: 2 }, topBottom: { cm: 10, in: 4 } },
      diatomaceousEarth: {
        sides: { cm: 11.5, in: 4.5 },
        topBottom: { cm: 24, in: 9.5 },
      },
      absorbentSheetMaterials:
        "Completely wrap each inner packaging; for capacity, follow manufacturer's instructions",
      cellulosicParticulate:
        "For capacity, use manufacturer's instructions; if unknown, same as vermiculite",
    },
    {
      quantity: {
        L: 20,
        gal: 5,
      },
      vermiculite: {
        sides: { cm: 7.5, in: 3 },
        topBottom: { cm: 15.5, in: 6 },
      },
      diatomaceousEarth: {
        sides: { cm: 15.5, in: 6 },
        topBottom: { cm: 34.5, in: 13.5 },
      },
      absorbentSheetMaterials:
        "Completely wrap each inner packaging; for capacity, follow manufacturer's instructions",
      cellulosicParticulate:
        "For capacity, use manufacturer's instructions; if unknown, same as vermiculite",
    },
    {
      quantity: {
        L: 24.6,
        gal: 6.5,
      },
      vermiculite: {
        sides: { cm: 9, in: 3.5 },
        topBottom: { cm: 16.5, in: 6.5 },
      },
      diatomaceousEarth: {
        sides: { cm: 18, in: 7 },
        topBottom: { cm: 37, in: 14.5 },
      },
      absorbentSheetMaterials:
        "Completely wrap each inner packaging; for capacity, follow manufacturer's instructions",
      cellulosicParticulate:
        "For capacity, use manufacturer's instructions; if unknown, same as vermiculite",
    },
    {
      quantity: {
        L: 49.3,
        gal: 13,
      },
      vermiculite: { sides: { cm: 10, in: 4 }, topBottom: { cm: 19, in: 7.5 } },
      diatomaceousEarth: {
        sides: { cm: 20.5, in: 8 },
        topBottom: { cm: 39.5, in: 15.5 },
      },
      absorbentSheetMaterials:
        "Completely wrap each inner packaging; for capacity, follow manufacturer's instructions",
      cellulosicParticulate:
        "For capacity, use manufacturer's instructions; if unknown, same as vermiculite",
    },
    {
      quantity: {
        L: 56.8,
        gal: 15,
      },
      vermiculite: {
        sides: { cm: 11.5, in: 4.5 },
        topBottom: { cm: 20.5, in: 8 },
      },
      diatomaceousEarth: {
        sides: { cm: 24, in: 9.5 },
        topBottom: { cm: 46, in: 18 },
      },
      absorbentSheetMaterials:
        "Completely wrap each inner packaging; for capacity, follow manufacturer's instructions",
      cellulosicParticulate:
        "For capacity, use manufacturer's instructions; if unknown, same as vermiculite",
    },
  ];

export interface AbsorbentMaterialRequirement {
  liquidQuantityInLiters: number;
  absorbentMaterial: {
    vermiculite: {
      sides: { cm: number; in: number };
      topBottom: { cm: number; in: number };
    };
    diatomaceousEarth: {
      sides: { cm: number; in: number };
      topBottom: { cm: number; in: number };
    };
    absorbentSheetMaterials: string;
    cellulosicParticulate: string;
  };
}

export const absorbentMaterialRequirementLookup = (
  context: HazardousMaterialContext,
  liquidQuantityInLiters: number,
  isCombinationPackaging: boolean,
  innerPackagingMaterial: string
): AbsorbentMaterialRequirement | undefined => {
  const { hazardousMaterial, packagingParameters } = context;
  const hazardClass = hazardousMaterial?.hazclassDiv;
  const packingGroup = hazardousMaterial?.packingGroup;

  if (!hazardClass || !packingGroup) {
    return;
  }

  const isAbsorbentRequired =
    ["3", "4", "8"].includes(hazardClass) ||
    (["5.1", "6.1"].includes(hazardClass) &&
      packingGroup === "I" &&
      isCombinationPackaging &&
      innerPackagingMaterial &&
      ["Glass", "Earthenware", "Plastic", "Metal"].includes(
        innerPackagingMaterial
      ));

  if (!isAbsorbentRequired || !liquidQuantityInLiters) {
    return undefined;
  }

  const matchedRequirement = tableA20_1AbsorbentMaterialRequirements.find(
    req => liquidQuantityInLiters! <= req.quantity.L
  );

  if (!matchedRequirement) {
    return undefined;
  }

  return {
    liquidQuantityInLiters: packagingParameters?.liquidQuantityInLiters!,
    absorbentMaterial: matchedRequirement,
  };
};
