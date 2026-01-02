export type GasProperties = {
  gasName: string;
  symbol: string;
  molecularWeight: number;
  specificGravity: number;
};

export const commonGases: Record<string, GasProperties> = {
  // Helium = UN1046, UN1963
  "UN1046, UN1963": {
    gasName: "Helium",
    symbol: "He",
    molecularWeight: 4.0,
    specificGravity: 0.138,
  },
  // Argon = UN1006, UN1951
  "UN1006, UN1951": {
    gasName: "Argon",
    symbol: "Ar",
    molecularWeight: 40.0,
    specificGravity: 1.377,
  },
  // Air = UN1002, UN1003
  "UN1002, UN1003": {
    gasName: "Air",
    symbol: ".",
    molecularWeight: 29.0,
    specificGravity: 1.0,
  },
  // Oxygen = UN1072, UN1073
  "UN1072, UN1073": {
    gasName: "Oxygen",
    symbol: "O₂",
    molecularWeight: 32.0,
    specificGravity: 1.103,
  },
  // Nitrogen = UN1066, UN1977
  "UN1066, UN1977": {
    gasName: "Nitrogen",
    symbol: "N₂",
    molecularWeight: 28.0,
    specificGravity: 0.966,
  },
  // Hydrogen = UN1049, UN1966
  "UN1049, UN1966": {
    gasName: "Hydrogen",
    symbol: "H₂",
    molecularWeight: 2.0,
    specificGravity: 0.0695,
  },
  // Nitric Oxide = UN1660
  UN1660: {
    gasName: "Nitric Oxide",
    symbol: "NO",
    molecularWeight: 30.0,
    specificGravity: 1.034,
  },
  // Carbon Monoxide = UN1016, NA9202
  "UN1016, NA9202": {
    gasName: "Carbon Monoxide",
    symbol: "CO",
    molecularWeight: 28.0,
    specificGravity: 0.965,
  },
  // is this a gas?
  // Hydrochloric Acid = UN1789
  UN1789: {
    gasName: "Hydrochloric Acid",
    symbol: "HCl",
    molecularWeight: 36.5,
    specificGravity: 1.256,
  },
  // Steam is not listed in Table A4.1.
  Steam: {
    gasName: "Steam",
    symbol: "H₂O",
    molecularWeight: 18.0,
    specificGravity: 0.623,
  },
  // Carbon Dioxide = UN1013, UN2187
  "UN1013, UN2187": {
    gasName: "Carbon Dioxide",
    symbol: "CO₂",
    molecularWeight: 44.0,
    specificGravity: 1.516,
  },
  // Nitrous Oxide = UN1070, UN2201
  "UN1070, UN2201": {
    gasName: "Nitrous Oxide",
    symbol: "N₂O",
    molecularWeight: 44.0,
    specificGravity: 1.518,
  },
  // Sulfur Dioxide = UN1079
  UN1079: {
    gasName: "Sulfur Dioxide",
    symbol: "SO₂",
    molecularWeight: 64.0,
    specificGravity: 2.208,
  },
  // Ammonia = UN1005
  UN1005: {
    gasName: "Ammonia",
    symbol: "NH₃",
    molecularWeight: 17.0,
    specificGravity: 0.587,
  },
  // Acetylene = UN1001
  UN1001: {
    gasName: "Acetylene",
    symbol: "C₂H₂",
    molecularWeight: 26.0,
    specificGravity: 0.897,
  },
  // Methyl Chloride = UN1063
  UN1063: {
    gasName: "Methyl Chloride",
    symbol: "CH₂Cl",
    molecularWeight: 50.5,
    specificGravity: 1.738,
  },
  // Methane = UN1971, UN1972
  "UN1971, UN1972": {
    gasName: "Methane",
    symbol: "CH₄",
    molecularWeight: 16.0,
    specificGravity: 0.553,
  },
  // Ethylene = UN1962, UN1038
  "UN1962, UN1038": {
    gasName: "Ethylene",
    symbol: "C₂H₄",
    molecularWeight: 28.0,
    specificGravity: 0.967,
  },
};
