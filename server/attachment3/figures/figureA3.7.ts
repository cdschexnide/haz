/* Figure A3.7. Maximum Quantities for Dry Ice Aboard C-17 Aircraft */
const dryIceMaxQuantitiesC17: {
  configuration: string;
  altitude: string;
  maxAmount: {
    pounds: number;
    kilograms: number;
  };
}[] = [
  {
    configuration: "Two Packs - High Flow Setting",
    altitude: "35,000 feet",
    maxAmount: {
      pounds: 3430,
      kilograms: 1556,
    },
  },
  {
    configuration: "Two Packs - High Flow Setting",
    altitude: "10,000 feet or less",
    maxAmount: {
      pounds: 2080,
      kilograms: 943,
    },
  },
  {
    configuration: "Two Packs - Normal Flow Setting",
    altitude: "35,000 feet",
    maxAmount: {
      pounds: 1880,
      kilograms: 853,
    },
  },
  {
    configuration: "Two Packs - Normal Flow Setting",
    altitude: "10,000 feet or less",
    maxAmount: {
      pounds: 1040,
      kilograms: 472,
    },
  },
  {
    configuration: "One Pack - High Flow Setting",
    altitude: "35,000 feet",
    maxAmount: {
      pounds: 1720,
      kilograms: 780,
    },
  },
  {
    configuration: "One Pack - High Flow Setting",
    altitude: "Holding at 10,000 feet",
    maxAmount: {
      pounds: 1040,
      kilograms: 472,
    },
  },
];
