interface ActivityLimitsForLimitedQuantities {
  natureOfContents: string;
  materials: {
    packageLimits: {
      specialForm?: string;
      otherForm?: string;
      tritiatedWater?: {
        lessThan0_0037TBqPerLiter?: string;
        from0_0037To0_037TBqPerLiter?: string;
        greaterThan0_037TBqPerLiter?: string;
      };
    };
  };
  instrumentsAndArticles: {
    limitsForEachInstrumentAndArticle?: {
      specialForm?: string;
      otherForm?: string;
    };
    packageLimits?: {
      specialForm?: string;
      otherForm?: string;
    };
  };
}

/* Table A11.2. Activity Limits for Limited Quantities Instruments and Articles. */
const tableA11_2: ActivityLimitsForLimitedQuantities[] = [
  {
    natureOfContents: "Solids",
    materials: {
      packageLimits: {
        specialForm: "10^-3 A1",
        otherForm: "10^-3 A2",
      },
    },
    instrumentsAndArticles: {
      limitsForEachInstrumentAndArticle: {
        specialForm: "10^-2 A1",
        otherForm: "10^-2 A2",
      },
      packageLimits: {
        specialForm: "A1",
        otherForm: "A2",
      },
    },
  },
  {
    natureOfContents: "Liquids",
    materials: {
      packageLimits: {
        tritiatedWater: {
          lessThan0_0037TBqPerLiter: "37 TBq (1000 Ci)",
          from0_0037To0_037TBqPerLiter: "3.7 TBq (100 Ci)",
          greaterThan0_037TBqPerLiter: "0.037 TBq (1 Ci)",
        },
        otherForm: "10^-4 A2",
      },
    },
    instrumentsAndArticles: {
      limitsForEachInstrumentAndArticle: {
        otherForm: "10^-3 A2",
      },
      packageLimits: {
        otherForm: "10^-1 A2",
      },
    },
  },
  {
    natureOfContents: "Gases",
    materials: {
      packageLimits: {
        specialForm: "2 x 10^-2 A2",
        otherForm: "10^-3 A2",
      },
    },
    instrumentsAndArticles: {
      limitsForEachInstrumentAndArticle: {
        specialForm: "2 x 10^-2 A2",
        otherForm: "10^-3 A2",
      },
      packageLimits: {
        specialForm: "2 x 10^-1 A2",
        otherForm: "10^-2 A2",
      },
    },
  },
];
