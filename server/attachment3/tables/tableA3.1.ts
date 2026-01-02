type PackagingDetails = {
  typeCode: string[];
  maxCapacity?: {
    liters: number;
    gallons: number;
  };
  maxNetMass: {
    kilograms: number;
    pounds: number;
  };
};

/* Table A3.1. Quantity limits for UN specification Nonbulk Packagings */
const quantityLimits: Record<string, PackagingDetails> = {
  "Steel Drum": {
    typeCode: ["1A1", "1A2"],
    maxCapacity: {
      liters: 450,
      gallons: 119,
    },
    maxNetMass: {
      kilograms: 400,
      pounds: 882,
    },
  },
  "Aluminum Drum": {
    typeCode: ["1B1", "1B2"],
    maxCapacity: {
      liters: 450,
      gallons: 119,
    },
    maxNetMass: {
      kilograms: 400,
      pounds: 882,
    },
  },
  "Metal Drum (other than steel or aluminum)": {
    typeCode: ["1N1", "1N2"],
    maxCapacity: {
      liters: 450,
      gallons: 119,
    },
    maxNetMass: {
      kilograms: 400,
      pounds: 882,
    },
  },
  "Plywood Drum": {
    typeCode: ["1D"],
    maxCapacity: {
      liters: 250,
      gallons: 66,
    },
    maxNetMass: {
      kilograms: 400,
      pounds: 882,
    },
  },
  "Fiber Drum": {
    typeCode: ["1G"],
    maxCapacity: {
      liters: 450,
      gallons: 119,
    },
    maxNetMass: {
      kilograms: 400,
      pounds: 882,
    },
  },
  "Plastic Drum": {
    typeCode: ["1H1", "1H2"],
    maxCapacity: {
      liters: 450,
      gallons: 119,
    },
    maxNetMass: {
      kilograms: 400,
      pounds: 882,
    },
  },
  "Wooden Barrel": {
    typeCode: ["2C1", "2C2"],
    maxCapacity: {
      liters: 250,
      gallons: 66,
    },
    maxNetMass: {
      kilograms: 400,
      pounds: 882,
    },
  },
  "Plastic Jerrican": {
    typeCode: ["3H1", "3H2"],
    maxCapacity: {
      liters: 60,
      gallons: 16,
    },
    maxNetMass: {
      kilograms: 120,
      pounds: 265,
    },
  },
  "Aluminum and Steel Jerrican": {
    typeCode: ["3A1", "3A2", "3B1", "3B2"],
    maxCapacity: {
      liters: 60,
      gallons: 16,
    },
    maxNetMass: {
      kilograms: 120,
      pounds: 265,
    },
  },
  "Aluminum, Steel, and Other Metal Box": {
    typeCode: ["4A", "4B", "4N"],
    maxNetMass: {
      kilograms: 400,
      pounds: 882,
    },
  },
  "Wood Box - Natural Wood, Plywood, and Reconstituted Wood": {
    typeCode: ["4C1", "4C2", "4D", "4F"],
    maxNetMass: {
      kilograms: 400,
      pounds: 882,
    },
  },
  "Fiberboard Box": {
    typeCode: ["4G"],
    maxNetMass: {
      kilograms: 400,
      pounds: 882,
    },
  },
  "Plastic Box": {
    typeCode: ["4H1"],
    maxNetMass: {
      kilograms: 60,
      pounds: 132,
    },
  },
  "Plastic Box Variant": {
    typeCode: ["4H2"],
    maxNetMass: {
      kilograms: 400,
      pounds: 882,
    },
  },
  "Bags - Woven Plastic, Plastic Film, Textile, and Paper": {
    typeCode: ["5H1", "5H2", "5H3", "5H4", "5L1", "5L2", "5L3", "5M1", "5M2"],
    maxNetMass: {
      kilograms: 50,
      pounds: 110,
    },
  },
  "Composite Packaging with inner plastic receptacle and outer drum": {
    typeCode: ["6HA1", "6HB1", "6HD1", "6HG1", "6HH1"],
    maxCapacity: {
      liters: 250,
      gallons: 66,
    },
    maxNetMass: {
      kilograms: 400,
      pounds: 882,
    },
  },
  "Composite Packaging with inner plastic receptacle and outer box": {
    typeCode: ["6HA2", "6HB2", "6HC", "6HD2", "6HG2", "6HH2"],
    maxCapacity: {
      liters: 60,
      gallons: 16,
    },
    maxNetMass: {
      kilograms: 75,
      pounds: 165,
    },
  },
  "Composite Packaging with inner glass porcelain or stoneware receptacles": {
    typeCode: [
      "6PA1",
      "6PA2",
      "6PB1",
      "6PB2",
      "6PC",
      "6PD1",
      "6PD2",
      "6PG1",
      "6PG2",
      "6PH1",
      "6PH2",
    ],
    maxCapacity: {
      liters: 60,
      gallons: 16,
    },
    maxNetMass: {
      kilograms: 75,
      pounds: 165,
    },
  },
};
