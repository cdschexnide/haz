/* Figure A3.8. Maximum Quantities for Dry Ice Aboard C-5 Aircraft */
const dryIceMaxQuantitiesC5: {
  condition: string;
  maxAmount: {
    pounds: number;
    kilograms: number;
  };
  notes: string[];
}[] = [
  {
    condition: "Cruise (mach 0.5 and up) and altitudes up to 30,000 feet",
    maxAmount: {
      pounds: 4700,
      kilograms: 2132,
    },
    notes: [
      "Operate the Environmental Control System (ECS) with both air conditioning units on a 'Normal' flow control valve and the 'Intermediate' setting on the alternative air valve.",
    ],
  },
  {
    condition: "Cruise (mach 0.6 and up) and altitudes up to 30,000 feet",
    maxAmount: {
      pounds: 3120,
      kilograms: 1415,
    },
    notes: [
      "Operate the Environmental Control System (ECS) with both air conditioning units on a 'Normal' flow control valve and the 'Intermediate' setting on the alternative air valve.",
    ],
  },
  {
    condition: "During Non-pressurized up to 10,000 feet",
    maxAmount: {
      pounds: 6500,
      kilograms: 2948,
    },
    notes: ["Open the auxiliary vent value for this condition."],
  },
  {
    condition: "During Ground Operations with one auxiliary power unit",
    maxAmount: {
      pounds: 2950,
      kilograms: 1338,
    },
    notes: [
      "The air turbine motor is at idle. Open the auxiliary vent valve for this condition.",
    ],
  },
];
