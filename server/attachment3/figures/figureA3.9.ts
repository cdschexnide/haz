/* Figure A3.9. Maximum Quantities for Dry Ice Aboard KC-10 Aircraft */
const dryIceMaxQuantitiesKC10: {
  condition: string;
  configuration: {
    packs: string;
    maxAmount: {
      pounds: number;
      kilograms: number;
    };
  }[];
}[] = [
  {
    condition: "No environmental curtain (27 pallet all-cargo configuration)",
    configuration: [
      {
        packs: "Both packs operating",
        maxAmount: {
          pounds: 2295,
          kilograms: 1041,
        },
      },
      {
        packs: "One pack operating",
        maxAmount: {
          pounds: 1251,
          kilograms: 568,
        },
      },
    ],
  },
  {
    condition: "Environmental curtain at station 615",
    configuration: [
      {
        packs: "Both packs operating",
        maxAmount: {
          pounds: 1782,
          kilograms: 808,
        },
      },
      {
        packs: "One pack operating",
        maxAmount: {
          pounds: 969,
          kilograms: 440,
        },
      },
    ],
  },
  {
    condition: "Environmental curtain at station 879",
    configuration: [
      {
        packs: "Both packs operating",
        maxAmount: {
          pounds: 1204,
          kilograms: 546,
        },
      },
      {
        packs: "One pack operating",
        maxAmount: {
          pounds: 653,
          kilograms: 296,
        },
      },
    ],
  },
];
