/* Table A3.4. Multiplication Factors for Freight Containers */
const freightContainerMultiplicationFactors: {
  crossSectionalArea: string;
  multiplicationFactor: number;
}[] = [
  {
    crossSectionalArea: "≤ 1 m²",
    multiplicationFactor: 1,
  },
  {
    crossSectionalArea: "> 1 m² to ≤ 5 m²",
    multiplicationFactor: 2,
  },
  {
    crossSectionalArea: "> 5 m² to ≤ 20 m²",
    multiplicationFactor: 3,
  },
  {
    crossSectionalArea: "> 20 m²",
    multiplicationFactor: 10,
  },
];
