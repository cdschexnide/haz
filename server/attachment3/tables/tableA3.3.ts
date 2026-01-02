/* Table A3.3. Removable External Radioactive Contamination--Wipe Limits */
const removableRadioactiveContaminationLimits: {
  contaminant: string;
  limits: {
    bqPerCm2: number;
    uCiPerCm2: string; // Using string to represent scientific notation
    dpmPerCm2: number;
  };
}[] = [
  {
    contaminant: "Beta and gamma emitters and low toxicity alpha emitters",
    limits: {
      bqPerCm2: 4,
      uCiPerCm2: "10^-4",
      dpmPerCm2: 220,
    },
  },
  {
    contaminant: "All other alpha emitting radionuclides",
    limits: {
      bqPerCm2: 0.4,
      uCiPerCm2: "10^-5",
      dpmPerCm2: 22,
    },
  },
];
