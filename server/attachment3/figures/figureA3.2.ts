type TypeOfSteel = string;
type AverageWallStressLimitation = number;
type MaximumWallStressLimitation = number;

/* Figure A3.2. Wall-Stress Limitations */
const wallStressLimitations: Record<
  TypeOfSteel,
  { average: AverageWallStressLimitation; maximum: MaximumWallStressLimitation }
> = {
  "Plain carbon steels over 0.35 carbon and medium manganese steels": {
    average: 53000,
    maximum: 58000,
  },
  "Steels of analysis and heat treatment specified in DOT Specification 3AA": {
    average: 67000,
    maximum: 73000,
  },
  "Steels of analysis and heat treatment specified in DOT Specification 3T": {
    average: 87000,
    maximum: 94000,
  },
  "Plain carbon steels less than 0.35 carbon made before 1920": {
    average: 45000,
    maximum: 48000,
  },
};
