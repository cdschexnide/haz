type FillingDensity = {
  pressureKPa: number;
  pressurePsig: number;
  densities: {
    air: number;
    argon: number;
    nitrogen: number;
    oxygen: number;
    helium: number;
    neon: number;
  };
};

/* Figure A3.4. Filling Density for Cryogenic Liquids Except Hydrogen */
const fillingDensityCryogenicLiquids: FillingDensity[] = [
  {
    pressureKPa: 310.3,
    pressurePsig: 45,
    densities: {
      air: 82.5,
      argon: 133,
      nitrogen: 76,
      oxygen: 108,
      helium: 12.5,
      neon: 109,
    },
  },
  {
    pressureKPa: 517,
    pressurePsig: 75,
    densities: {
      air: 80.3,
      argon: 130,
      nitrogen: 74,
      oxygen: 105,
      helium: 12.5,
      neon: 104,
    },
  },
  {
    pressureKPa: 724,
    pressurePsig: 105,
    densities: {
      air: 78.4,
      argon: 127,
      nitrogen: 72,
      oxygen: 103,
      helium: 12.5,
      neon: 100,
    },
  },
  {
    pressureKPa: 1172,
    pressurePsig: 170,
    densities: {
      air: 76.2,
      argon: 122,
      nitrogen: 70,
      oxygen: 100,
      helium: 12.5,
      neon: 92,
    },
  },
  {
    pressureKPa: 1585.8,
    pressurePsig: 230,
    densities: {
      air: 75.1,
      argon: 119,
      nitrogen: 69,
      oxygen: 98,
      helium: 12.5,
      neon: 85,
    },
  },
  {
    pressureKPa: 2034,
    pressurePsig: 295,
    densities: {
      air: 73.3,
      argon: 115,
      nitrogen: 68,
      oxygen: 96,
      helium: 12.5,
      neon: 77,
    },
  },
  {
    pressureKPa: 2482,
    pressurePsig: 360,
    densities: {
      air: 70.7,
      argon: 113,
      nitrogen: 65,
      oxygen: 93,
      helium: 12.5,
      neon: 72,
    },
  },
  {
    pressureKPa: 3103,
    pressurePsig: 450,
    densities: {
      air: 65.9,
      argon: 111,
      nitrogen: 62,
      oxygen: 88,
      helium: 12.5,
      neon: 64,
    },
  },
  {
    pressureKPa: 3723,
    pressurePsig: 540,
    densities: {
      air: 62.9,
      argon: 107,
      nitrogen: 58,
      oxygen: 88,
      helium: 12.5,
      neon: 57,
    },
  },
  {
    pressureKPa: 4309,
    pressurePsig: 625,
    densities: {
      air: 60.1,
      argon: 104,
      nitrogen: 55,
      oxygen: 86,
      helium: 12.5,
      neon: 56,
    },
  },
];

const designServiceTemperature = {
  air: { fahrenheit: -320, celsius: -196 },
  argon: { fahrenheit: -320, celsius: -196 },
  nitrogen: { fahrenheit: -320, celsius: -196 },
  oxygen: { fahrenheit: -320, celsius: -196 },
  helium: { fahrenheit: -452, celsius: -269 },
  neon: { fahrenheit: -411, celsius: -246 },
};
