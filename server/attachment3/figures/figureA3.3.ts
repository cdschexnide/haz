type MinimumSpecificGravityAt60degreesF = [number, number];
type MaximumFillingDensityInPercentOfTheWaterCapacityOfTheContainer = number;

/* Figure A3.3. Filling Density for Liquefied Petroleum Gas */
const fillingDensityForLPG: {
  minSpecificGravity: MinimumSpecificGravityAt60degreesF;
  maxSpecificGravity: [number, number];
  maxFillingDensityPercent: number;
}[] = [
  {
    minSpecificGravity: [0.271, 0.289],
    maxSpecificGravity: [0.504, 0.51],
    maxFillingDensityPercent: 42,
  },
  {
    minSpecificGravity: [0.29, 0.306],
    maxSpecificGravity: [0.511, 0.519],
    maxFillingDensityPercent: 43,
  },
  {
    minSpecificGravity: [0.307, 0.322],
    maxSpecificGravity: [0.52, 0.527],
    maxFillingDensityPercent: 44,
  },
  {
    minSpecificGravity: [0.323, 0.338],
    maxSpecificGravity: [0.528, 0.536],
    maxFillingDensityPercent: 45,
  },
  {
    minSpecificGravity: [0.339, 0.354],
    maxSpecificGravity: [0.537, 0.544],
    maxFillingDensityPercent: 46,
  },
  {
    minSpecificGravity: [0.355, 0.371],
    maxSpecificGravity: [0.545, 0.552],
    maxFillingDensityPercent: 47,
  },
  {
    minSpecificGravity: [0.372, 0.398],
    maxSpecificGravity: [0.553, 0.56],
    maxFillingDensityPercent: 48,
  },
  {
    minSpecificGravity: [0.399, 0.425],
    maxSpecificGravity: [0.561, 0.568],
    maxFillingDensityPercent: 49,
  },
  {
    minSpecificGravity: [0.426, 0.44],
    maxSpecificGravity: [0.569, 0.576],
    maxFillingDensityPercent: 50,
  },
  {
    minSpecificGravity: [0.441, 0.452],
    maxSpecificGravity: [0.577, 0.584],
    maxFillingDensityPercent: 51,
  },
  {
    minSpecificGravity: [0.453, 0.462],
    maxSpecificGravity: [0.585, 0.592],
    maxFillingDensityPercent: 52,
  },
  {
    minSpecificGravity: [0.463, 0.472],
    maxSpecificGravity: [0.593, 0.6],
    maxFillingDensityPercent: 53,
  },
  {
    minSpecificGravity: [0.473, 0.48],
    maxSpecificGravity: [0.601, 0.608],
    maxFillingDensityPercent: 54,
  },
  {
    minSpecificGravity: [0.481, 0.488],
    maxSpecificGravity: [0.609, 0.617],
    maxFillingDensityPercent: 55,
  },
  {
    minSpecificGravity: [0.489, 0.495],
    maxSpecificGravity: [0.618, 0.626],
    maxFillingDensityPercent: 56,
  },
  {
    minSpecificGravity: [0.496, 0.503],
    maxSpecificGravity: [0.627, 0.634],
    maxFillingDensityPercent: 57,
  },
];
