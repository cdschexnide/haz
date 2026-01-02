interface Range {
  min: number;
  max: number;
}

interface PackageLimitEntry {
  description: string;
  lithiumContentRange: Range | null;
  wattHourRating: Range | null;
  maximumNumberOfCellsOrBatteriesPerPackage?: number | string;
  maximumNumberOfCellsPerPackage?: number;
  maximumNetQuantityPerPackage?: number | string;
  maximumNumberOfBatteriesPerPackage?: number;
}

export type PackageLimitsForExceptedLithiumBatteriesTable = Record<
  string,
  PackageLimitEntry
>;

/* Table A3.5. Package limits for Excepted Lithium Batteries */
export const table_A3_5_PackageLimitsForExceptedLithiumMetalCells: PackageLimitsForExceptedLithiumBatteriesTable =
  {
    ["0.3g"]: {
      description:
        "Lithium metal cells and/or batteries with a lithium content not more than 0.3 g",
      lithiumContentRange: { min: 0, max: 0.3 }, // in grams
      wattHourRating: null,
      maximumNumberOfCellsOrBatteriesPerPackage: "No Limit",
      maximumNetQuantityPerPackage: 2.5, // in kgs
    },
    ["0.3g-1g"]: {
      description:
        "Lithium metal cells with a lithium content more than 0.3 g but not more than 1 g",
      lithiumContentRange: { min: 0.3, max: 1 }, // in grams
      wattHourRating: null,
      maximumNumberOfCellsPerPackage: 8,
      maximumNetQuantityPerPackage: "N/A",
    },
  };

export const table_A3_5_PackageLimitsForExceptedLithiumMetalBatteries: PackageLimitsForExceptedLithiumBatteriesTable =
  {
    ["0.3g"]: {
      description:
        "Lithium metal cells and/or batteries with a lithium content not more than 0.3 g",
      lithiumContentRange: { min: 0, max: 0.3 }, // in grams
      wattHourRating: null,
      maximumNumberOfCellsOrBatteriesPerPackage: "No Limit",
      maximumNetQuantityPerPackage: 2.5, // in kgs
    },
    ["0.3g-2g"]: {
      description:
        "Lithium metal batteries with a lithium content more than 0.3 g but not more than 2 g",
      lithiumContentRange: { min: 0.3, max: 2 }, // in grams
      wattHourRating: null,
      maximumNumberOfBatteriesPerPackage: 2,
      maximumNetQuantityPerPackage: "N/A",
    },
  };

export const table_A3_5_PackageLimitsForExceptedLithiumIonCells: PackageLimitsForExceptedLithiumBatteriesTable =
  {
    ["2.7Wh"]: {
      description:
        "Lithium ion cells and/or batteries with a Watt-hour rating not more than 2.7 Wh",
      lithiumContentRange: null,
      wattHourRating: { min: 0, max: 2.7 }, // in Watt-hours
      maximumNumberOfCellsOrBatteriesPerPackage: "No Limit",
      maximumNetQuantityPerPackage: 2.5, // in kgs
    },
    ["2.7Wh-20Wh"]: {
      description:
        "Lithium ion cells with a Watt-hour rating more than 2.7 Wh but not more than 20 Wh",
      lithiumContentRange: null,
      wattHourRating: { min: 2.7, max: 20 }, // in Watt-hours
      maximumNumberOfCellsPerPackage: 8,
      maximumNetQuantityPerPackage: "N/A",
    },
  };

export const table_A3_5_PackageLimitsForExceptedLithiumIonBatteries: PackageLimitsForExceptedLithiumBatteriesTable =
  {
    ["2.7Wh"]: {
      description:
        "Lithium ion cells and/or batteries with a Watt-hour rating not more than 2.7 Wh",
      lithiumContentRange: null,
      wattHourRating: { min: 0, max: 2.7 }, // in Watt-hours
      maximumNumberOfCellsOrBatteriesPerPackage: "No Limit",
      maximumNetQuantityPerPackage: 2.5, // in kgs
    },
    ["2.7Wh-100Wh"]: {
      description:
        "Lithium ion batteries with a Watt-hour rating more than 2.7 Wh but not more than 100 Wh",
      lithiumContentRange: null,
      wattHourRating: { min: 2.7, max: 100 }, // in Watt-hours
      maximumNumberOfBatteriesPerPackage: 2,
      maximumNetQuantityPerPackage: "N/A",
    },
  };
