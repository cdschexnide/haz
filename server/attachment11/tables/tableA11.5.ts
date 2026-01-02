interface CylinderContent {
  maxDiameterInches: number;
  maxDiameterCentimeters: number;
  volumeCubicFeet: number;
  volumeLiters: number;
  maxUranium235EnrichmentWeightPercent: number;
  maxHeelWeightUF6Kg: number;
  maxHeelWeightUF6Lb: number;
  maxHeelWeightUranium235Kg: number;
  maxHeelWeightUranium235Lb: number;
}

/* Table A11.5. Allowable Content of Uranium Hexafluoride (UF6) "Heels" in a Specification
7A Cylinder. */
const TableA11_5: CylinderContent[] = [
  {
    maxDiameterInches: 5,
    maxDiameterCentimeters: 12.7,
    volumeCubicFeet: 0.311,
    volumeLiters: 8.8,
    maxUranium235EnrichmentWeightPercent: 100.0,
    maxHeelWeightUF6Kg: 0.045,
    maxHeelWeightUF6Lb: 0.1,
    maxHeelWeightUranium235Kg: 0.031,
    maxHeelWeightUranium235Lb: 0.07,
  },
  {
    maxDiameterInches: 8,
    maxDiameterCentimeters: 20.3,
    volumeCubicFeet: 1.359,
    volumeLiters: 39,
    maxUranium235EnrichmentWeightPercent: 12.5,
    maxHeelWeightUF6Kg: 0.227,
    maxHeelWeightUF6Lb: 0.5,
    maxHeelWeightUranium235Kg: 0.019,
    maxHeelWeightUranium235Lb: 0.04,
  },
  {
    maxDiameterInches: 12,
    maxDiameterCentimeters: 30.5,
    volumeCubicFeet: 2.41,
    volumeLiters: 68,
    maxUranium235EnrichmentWeightPercent: 5.0,
    maxHeelWeightUF6Kg: 0.454,
    maxHeelWeightUF6Lb: 1.0,
    maxHeelWeightUranium235Kg: 0.015,
    maxHeelWeightUranium235Lb: 0.03,
  },
  {
    maxDiameterInches: 30,
    maxDiameterCentimeters: 76,
    volumeCubicFeet: 25.64,
    volumeLiters: 725,
    maxUranium235EnrichmentWeightPercent: 5.0,
    maxHeelWeightUF6Kg: 11.3,
    maxHeelWeightUF6Lb: 25,
    maxHeelWeightUranium235Kg: 0.383,
    maxHeelWeightUranium235Lb: 0.84,
  },
  {
    maxDiameterInches: 48,
    maxDiameterCentimeters: 122,
    volumeCubicFeet: 108.9,
    volumeLiters: 3084,
    maxUranium235EnrichmentWeightPercent: 4.5,
    maxHeelWeightUF6Kg: 22.7,
    maxHeelWeightUF6Lb: 50,
    maxHeelWeightUranium235Kg: 0.69,
    maxHeelWeightUranium235Lb: 1.52,
  },
  {
    maxDiameterInches: 48,
    maxDiameterCentimeters: 122,
    volumeCubicFeet: 142.7,
    volumeLiters: 4041,
    maxUranium235EnrichmentWeightPercent: 4.5,
    maxHeelWeightUF6Kg: 22.7,
    maxHeelWeightUF6Lb: 50,
    maxHeelWeightUranium235Kg: 0.69,
    maxHeelWeightUranium235Lb: 1.52,
  },
];
