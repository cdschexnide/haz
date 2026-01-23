// Auto-generated from class4-attachment8-comprehensive.md. Do not edit by hand.
export type Class4ScenarioFixture = {
  scenario: number;
  unNumber: string;
  title: string;
  packagingParagraph: string;
  materialDetails: Record<string, string>;
  expectedSddg: Record<string, string>;
  expectedPackage: {
    labels: string[];
    markings: string[];
    pop: {
      allowedCodes: string[];
      packingGroupCode: string;
    };
  };
  alterations: Array<{
    id: number;
    category: string;
    alteration: string;
    expectedResult: string;
  }>;
};

export const class4ScenarioFixtures: Class4ScenarioFixture[] = 
[
  {
    "scenario": 1,
    "unNumber": "UN1421",
    "title": "ALKALI METAL ALLOYS, LIQUID, N.O.S.",
    "packagingParagraph": "A8.2",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN1421",
      "PSN": "ALKALI METAL ALLOYS, LIQUID, N.O.S.",
      "Technical Name": "(Sodium-potassium alloy)",
      "Hazard Class/Division": "4.3",
      "Packing Group": "I",
      "Packaging Paragraph": "A8.2.",
      "Special Provisions": "P3, A2, A7, N34",
      "Subsidiary Risk": "None"
    },
    "expectedSddg": {
      "Key 7": "Cargo Aircraft Only",
      "Key 11": "UN1421",
      "Key 12": "ALKALI METAL ALLOYS, LIQUID, N.O.S. (Sodium-potassium alloy)",
      "Key 13": "4.3",
      "Key 14": "(empty)",
      "Key 15": "I",
      "Key 16": "1 steel drum (1A1) x 25 L",
      "Key 17": "A8.2."
    },
    "expectedPackage": {
      "labels": [
        "DANGEROUS WHEN WET (Division 4.3) - Blue",
        "Cargo Aircraft Only",
        "Orientation arrows (This Side Up) - liquid material"
      ],
      "markings": [
        "UN1421 (minimum 12mm height)",
        "ALKALI METAL ALLOYS, LIQUID, N.O.S. (Sodium-potassium alloy)",
        "Technical name visible in parentheses"
      ],
      "pop": {
        "allowedCodes": [
          "1A1"
        ],
        "packingGroupCode": "X"
      }
    },
    "alterations": [
      {
        "id": 1,
        "category": "SDDG - Key 12",
        "alteration": "Technical name missing: \"ALKALI METAL ALLOYS, LIQUID, N.O.S.\"",
        "expectedResult": "Frustration: Missing technical name for N.O.S. entry"
      },
      {
        "id": 2,
        "category": "Label",
        "alteration": "Missing orientation arrows",
        "expectedResult": "Frustration: Liquid materials require orientation labels"
      },
      {
        "id": 3,
        "category": "POP Marking",
        "alteration": "Packing group code \"Y\" instead of \"X\"",
        "expectedResult": "Frustration: PG I material requires X-rated packaging"
      }
    ]
  },
  {
    "scenario": 2,
    "unNumber": "UN1428",
    "title": "SODIUM",
    "packagingParagraph": "A8.3",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN1428",
      "PSN": "SODIUM",
      "Hazard Class/Division": "4.3",
      "Packing Group": "I",
      "Packaging Paragraph": "A8.3.",
      "Special Provisions": "P3, A7, A8, A19, A20, N34",
      "Subsidiary Risk": "None"
    },
    "expectedSddg": {
      "Key 7": "Cargo Aircraft Only",
      "Key 11": "UN1428",
      "Key 12": "SODIUM",
      "Key 13": "4.3",
      "Key 14": "(empty)",
      "Key 15": "I",
      "Key 16": "1 steel drum (1A2) x 25 kg",
      "Key 17": "A8.3."
    },
    "expectedPackage": {
      "labels": [
        "DANGEROUS WHEN WET (Division 4.3) - Blue",
        "Cargo Aircraft Only"
      ],
      "markings": [
        "UN1428 (minimum 12mm height)",
        "SODIUM"
      ],
      "pop": {
        "allowedCodes": [
          "1A2"
        ],
        "packingGroupCode": "X"
      }
    },
    "alterations": [
      {
        "id": 1,
        "category": "Label",
        "alteration": "Division 4.1 FLAMMABLE SOLID label instead of 4.3",
        "expectedResult": "Frustration: Wrong division label"
      },
      {
        "id": 2,
        "category": "SDDG - Key 7",
        "alteration": "Shows \"Passenger and Cargo Aircraft\"",
        "expectedResult": "Frustration: P3 requires Cargo Aircraft Only"
      },
      {
        "id": 3,
        "category": "POP Marking",
        "alteration": "Packing group code \"Z\" instead of \"X\"",
        "expectedResult": "Frustration: PG I requires X-rated packaging"
      }
    ]
  },
  {
    "scenario": 3,
    "unNumber": "UN2956",
    "title": "MUSK XYLENE",
    "packagingParagraph": "A8.4",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN2956",
      "PSN": "MUSK XYLENE",
      "Alternate PSN": "5-TERT-BUTYL-2,4,6-TRINITRO-M-XYLENE",
      "Hazard Class/Division": "4.1",
      "Packing Group": "III",
      "Packaging Paragraph": "A8.4.",
      "Special Provisions": "P5",
      "Subsidiary Risk": "None"
    },
    "expectedSddg": {
      "Key 7": "Passenger and Cargo Aircraft",
      "Key 11": "UN2956",
      "Key 12": "MUSK XYLENE",
      "Key 13": "4.1",
      "Key 14": "(empty)",
      "Key 15": "III",
      "Key 16": "1 fiberboard box (4G) x 25 kg",
      "Key 17": "A8.4."
    },
    "expectedPackage": {
      "labels": [
        "FLAMMABLE SOLID (Division 4.1) - Red/white vertical stripes"
      ],
      "markings": [
        "UN2956 (minimum 12mm height)",
        "MUSK XYLENE"
      ],
      "pop": {
        "allowedCodes": [],
        "packingGroupCode": "Z"
      }
    },
    "alterations": [
      {
        "id": 1,
        "category": "SDDG - Key 17",
        "alteration": "Shows \"A8.3.\" instead of \"A8.4.\"",
        "expectedResult": "Frustration: Incorrect packaging paragraph - CAA materials require A8.4."
      },
      {
        "id": 2,
        "category": "SDDG - Key 15",
        "alteration": "Shows \"II\" instead of \"III\"",
        "expectedResult": "Frustration: Incorrect packing group"
      },
      {
        "id": 3,
        "category": "SDDG - Key 13",
        "alteration": "Shows \"4\" instead of \"4.1\"",
        "expectedResult": "Frustration: Must specify full division"
      }
    ]
  },
  {
    "scenario": 4,
    "unNumber": "UN2870",
    "title": "ALUMINIUM BOROHYDRIDE",
    "packagingParagraph": "A8.5",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN2870",
      "PSN": "ALUMINIUM BOROHYDRIDE",
      "Hazard Class/Division": "4.2",
      "Packing Group": "I",
      "Packaging Paragraph": "A8.5.",
      "Special Provisions": "P3",
      "Subsidiary Risk": "4.3"
    },
    "expectedSddg": {
      "Key 7": "Cargo Aircraft Only",
      "Key 11": "UN2870",
      "Key 12": "ALUMINIUM BOROHYDRIDE",
      "Key 13": "4.2",
      "Key 14": "4.3",
      "Key 15": "I",
      "Key 16": "2 steel cylinders x 5 L each",
      "Key 17": "A8.5."
    },
    "expectedPackage": {
      "labels": [
        "SPONTANEOUSLY COMBUSTIBLE (Division 4.2) - Upper white, lower red",
        "DANGEROUS WHEN WET (4.3) - Blue (subsidiary)",
        "Cargo Aircraft Only",
        "Orientation arrows (This Side Up) - liquid material"
      ],
      "markings": [
        "UN2870 (minimum 12mm height)",
        "ALUMINIUM BOROHYDRIDE"
      ],
      "pop": {
        "allowedCodes": [],
        "packingGroupCode": ""
      }
    },
    "alterations": [
      {
        "id": 1,
        "category": "Label",
        "alteration": "Missing DANGEROUS WHEN WET (4.3) subsidiary label",
        "expectedResult": "Frustration: Subsidiary hazard label required"
      },
      {
        "id": 2,
        "category": "SDDG - Key 14",
        "alteration": "Empty (should be \"4.3\")",
        "expectedResult": "Frustration: Missing subsidiary risk declaration"
      },
      {
        "id": 3,
        "category": "Label",
        "alteration": "Missing orientation arrows",
        "expectedResult": "Frustration: Liquid materials require orientation labels"
      }
    ]
  },
  {
    "scenario": 5,
    "unNumber": "UN3225",
    "title": "SELF-REACTIVE LIQUID TYPE D",
    "packagingParagraph": "A8.7",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN3225",
      "PSN": "SELF-REACTIVE LIQUID TYPE D",
      "Hazard Class/Division": "4.1",
      "Packing Group": "(none - self-reactive)",
      "Packaging Paragraph": "A8.7.",
      "Special Provisions": "P5",
      "Subsidiary Risk": "None",
      "Technical Name Required": "Yes"
    },
    "expectedSddg": {
      "Key 7": "Passenger and Cargo Aircraft",
      "Key 11": "UN3225",
      "Key 12": "SELF-REACTIVE LIQUID TYPE D (technical name per A4.5.3)",
      "Key 13": "4.1",
      "Key 14": "(empty)",
      "Key 15": "(empty - self-reactive substances have no PG)",
      "Key 16": "4 glass bottles in fiberboard box (4G) x 0.5 L each",
      "Key 17": "A8.7."
    },
    "expectedPackage": {
      "labels": [
        "FLAMMABLE SOLID (Division 4.1) - Red/white vertical stripes",
        "KEEP AWAY FROM HEAT (required for self-reactive substances per A15.3.5)",
        "Orientation arrows (liquid)"
      ],
      "markings": [
        "UN3225 (minimum 12mm height)",
        "SELF-REACTIVE LIQUID TYPE D",
        "Technical name in parentheses"
      ],
      "pop": {
        "allowedCodes": [
          "1G",
          "4G"
        ],
        "packingGroupCode": ""
      }
    },
    "alterations": [
      {
        "id": 1,
        "category": "Label",
        "alteration": "Missing KEEP AWAY FROM HEAT label",
        "expectedResult": "Frustration: Required for self-reactive substances"
      },
      {
        "id": 2,
        "category": "SDDG - Key 15",
        "alteration": "Shows \"II\" (should be empty for self-reactive)",
        "expectedResult": "Frustration: Self-reactive substances do not have packing groups"
      },
      {
        "id": 3,
        "category": "SDDG - Key 12",
        "alteration": "Technical name missing",
        "expectedResult": "Frustration: Technical name required per A4.5.3"
      }
    ]
  },
  {
    "scenario": 6,
    "unNumber": "UN3230",
    "title": "SELF-REACTIVE SOLID TYPE F",
    "packagingParagraph": "A8.8",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN3230",
      "PSN": "SELF-REACTIVE SOLID TYPE F",
      "Hazard Class/Division": "4.1",
      "Packing Group": "(none - self-reactive)",
      "Packaging Paragraph": "A8.8.",
      "Special Provisions": "P5",
      "Subsidiary Risk": "None",
      "Technical Name Required": "Yes"
    },
    "expectedSddg": {
      "Key 7": "Passenger and Cargo Aircraft",
      "Key 11": "UN3230",
      "Key 12": "SELF-REACTIVE SOLID TYPE F (technical name per A4.5.3)",
      "Key 13": "4.1",
      "Key 14": "(empty)",
      "Key 15": "(empty - self-reactive)",
      "Key 16": "1 fiber drum (1G) x 50 kg",
      "Key 17": "A8.8."
    },
    "expectedPackage": {
      "labels": [
        "FLAMMABLE SOLID (Division 4.1) - Red/white vertical stripes",
        "KEEP AWAY FROM HEAT"
      ],
      "markings": [
        "UN3230 (minimum 12mm height)",
        "SELF-REACTIVE SOLID TYPE F",
        "Technical name in parentheses"
      ],
      "pop": {
        "allowedCodes": [
          "1G"
        ],
        "packingGroupCode": ""
      }
    },
    "alterations": [
      {
        "id": 1,
        "category": "Label",
        "alteration": "Missing KEEP AWAY FROM HEAT label",
        "expectedResult": "Frustration: Required for self-reactive substances"
      },
      {
        "id": 2,
        "category": "SDDG - Key 17",
        "alteration": "Shows \"A8.7.\" (liquids) instead of \"A8.8.\" (solids)",
        "expectedResult": "Frustration: Incorrect packaging paragraph"
      },
      {
        "id": 3,
        "category": "Marking",
        "alteration": "Technical name missing from package",
        "expectedResult": "Frustration: Technical name required on marking"
      }
    ]
  },
  {
    "scenario": 7,
    "unNumber": "UN1571",
    "title": "BARIUM AZIDE",
    "packagingParagraph": "A8.10",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN1571",
      "PSN": "BARIUM AZIDE",
      "Details": "wetted with 50% or more water, by mass",
      "Hazard Class/Division": "4.1",
      "Packing Group": "I",
      "Packaging Paragraph": "A8.10.",
      "Special Provisions": "P4, 162, A2",
      "Subsidiary Risk": "6.1"
    },
    "expectedSddg": {
      "Key 7": "Cargo Aircraft Only",
      "Key 11": "UN1571",
      "Key 12": "BARIUM AZIDE, wetted with not less than 50% water, by mass",
      "Key 13": "4.1",
      "Key 14": "6.1",
      "Key 15": "I",
      "Key 16": "4 glass receptacles in wooden box (4C1) x 0.5 kg each",
      "Key 17": "A8.10."
    },
    "expectedPackage": {
      "labels": [
        "FLAMMABLE SOLID (Division 4.1) - Red/white vertical stripes",
        "TOXIC (6.1) - White with skull and crossbones",
        "Cargo Aircraft Only"
      ],
      "markings": [
        "UN1571 (minimum 12mm height)",
        "BARIUM AZIDE, wetted with not less than 50% water, by mass"
      ],
      "pop": {
        "allowedCodes": [
          "1G",
          "4C1",
          "4C2",
          "4D",
          "4F"
        ],
        "packingGroupCode": ""
      }
    },
    "alterations": [
      {
        "id": 1,
        "category": "Label",
        "alteration": "Missing TOXIC (6.1) subsidiary label",
        "expectedResult": "Frustration: Subsidiary hazard label required"
      },
      {
        "id": 2,
        "category": "SDDG - Key 14",
        "alteration": "Empty (should be \"6.1\")",
        "expectedResult": "Frustration: Missing subsidiary risk declaration"
      },
      {
        "id": 3,
        "category": "POP Marking",
        "alteration": "Packing group code \"Y\" instead of \"X\"",
        "expectedResult": "Frustration: PG I material requires X-rated packaging"
      }
    ]
  },
  {
    "scenario": 8,
    "unNumber": "UN1855",
    "title": "CALCIUM, PYROPHORIC",
    "packagingParagraph": "A8.11",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN1855",
      "PSN": "CALCIUM, PYROPHORIC",
      "Hazard Class/Division": "4.2",
      "Packing Group": "I",
      "Packaging Paragraph": "A8.11.",
      "Special Provisions": "P3",
      "Subsidiary Risk": "None"
    },
    "expectedSddg": {
      "Key 7": "Cargo Aircraft Only",
      "Key 11": "UN1855",
      "Key 12": "CALCIUM, PYROPHORIC",
      "Key 13": "4.2",
      "Key 14": "(empty)",
      "Key 15": "I",
      "Key 16": "2 metal receptacles in wooden box (4C1) x 15 kg each",
      "Key 17": "A8.11."
    },
    "expectedPackage": {
      "labels": [
        "SPONTANEOUSLY COMBUSTIBLE (Division 4.2) - Upper white, lower red",
        "Cargo Aircraft Only"
      ],
      "markings": [
        "UN1855 (minimum 12mm height)",
        "CALCIUM, PYROPHORIC"
      ],
      "pop": {
        "allowedCodes": [
          "1D",
          "1G",
          "4C1",
          "4C2",
          "4D",
          "4F",
          "4G"
        ],
        "packingGroupCode": ""
      }
    },
    "alterations": [
      {
        "id": 1,
        "category": "Label",
        "alteration": "Division 4.1 FLAMMABLE SOLID label instead of 4.2",
        "expectedResult": "Frustration: Wrong division label"
      },
      {
        "id": 2,
        "category": "SDDG - Key 7",
        "alteration": "Shows \"Passenger and Cargo Aircraft\"",
        "expectedResult": "Frustration: P3 requires Cargo Aircraft Only"
      },
      {
        "id": 3,
        "category": "SDDG - Key 17",
        "alteration": "Shows \"A8.3.\" instead of \"A8.11.\"",
        "expectedResult": "Frustration: Pyrophoric solids require A8.11."
      }
    ]
  },
  {
    "scenario": 9,
    "unNumber": "UN1324",
    "title": "FILMS, NITROCELLULOSE BASE",
    "packagingParagraph": "A8.12",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN1324",
      "PSN": "FILMS, NITROCELLULOSE BASE",
      "Details": "gelatine coated (except scrap)",
      "Hazard Class/Division": "4.1",
      "Packing Group": "III",
      "Packaging Paragraph": "A8.12.",
      "Special Provisions": "P5",
      "Subsidiary Risk": "None"
    },
    "expectedSddg": {
      "Key 7": "Passenger and Cargo Aircraft",
      "Key 11": "UN1324",
      "Key 12": "FILMS, NITROCELLULOSE BASE, gelatine coated (except scrap)",
      "Key 13": "4.1",
      "Key 14": "(empty)",
      "Key 15": "III",
      "Key 16": "2 fiberboard boxes (4G) x 30 kg each",
      "Key 17": "A8.12."
    },
    "expectedPackage": {
      "labels": [
        "FLAMMABLE SOLID (Division 4.1) - Red/white vertical stripes"
      ],
      "markings": [
        "UN1324 (minimum 12mm height)",
        "FILMS, NITROCELLULOSE BASE"
      ],
      "pop": {
        "allowedCodes": [
          "1A2",
          "1B2",
          "1D",
          "1G",
          "3A2",
          "3B2",
          "4A",
          "4B",
          "4C1",
          "4C2",
          "4D",
          "4F",
          "4G",
          "4N"
        ],
        "packingGroupCode": ""
      }
    },
    "alterations": [
      {
        "id": 1,
        "category": "SDDG - Key 15",
        "alteration": "Empty (should be \"III\")",
        "expectedResult": "Frustration: Packing group required"
      },
      {
        "id": 2,
        "category": "SDDG - Key 13",
        "alteration": "Shows \"4\" instead of \"4.1\"",
        "expectedResult": "Frustration: Must specify full division"
      },
      {
        "id": 3,
        "category": "POP Marking",
        "alteration": "Packing group code \"X\" (overkill but valid)",
        "expectedResult": "No frustration - X is authorized for PG III"
      }
    ]
  },
  {
    "scenario": 10,
    "unNumber": "NA1325",
    "title": "FUSEE (Railway or Highway)",
    "packagingParagraph": "A8.13",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "NA1325",
      "PSN": "FUSEE",
      "Details": "railway or highway",
      "Hazard Class/Division": "4.1",
      "Packing Group": "II",
      "Packaging Paragraph": "A8.13.",
      "Special Provisions": "P5",
      "Subsidiary Risk": "None",
      "Domestic Only": "Yes"
    },
    "expectedSddg": {
      "Key 7": "Passenger and Cargo Aircraft",
      "Key 11": "NA1325",
      "Key 12": "FUSEE, railway or highway",
      "Key 13": "4.1",
      "Key 14": "(empty)",
      "Key 15": "II",
      "Key 16": "1 fiberboard box (4G) x 20 kg",
      "Key 17": "A8.13."
    },
    "expectedPackage": {
      "labels": [
        "FLAMMABLE SOLID (Division 4.1) - Red/white vertical stripes"
      ],
      "markings": [
        "NA1325 (minimum 12mm height) - Note: NA prefix for domestic",
        "FUSEE"
      ],
      "pop": {
        "allowedCodes": [
          "1A2",
          "1D",
          "1G",
          "3A2",
          "4C1",
          "4C2",
          "4D",
          "4F",
          "4G"
        ],
        "packingGroupCode": ""
      }
    },
    "alterations": [
      {
        "id": 1,
        "category": "SDDG - Key 11",
        "alteration": "Shows \"UN1325\" instead of \"NA1325\"",
        "expectedResult": "Frustration: Incorrect ID number prefix for domestic shipment"
      },
      {
        "id": 2,
        "category": "POP Marking",
        "alteration": "Packing group code \"Z\" instead of \"Y\"",
        "expectedResult": "Frustration: PG II requires Y or X rated packaging"
      },
      {
        "id": 3,
        "category": "SDDG - Key 17",
        "alteration": "Shows \"A8.3.\" instead of \"A8.13.\"",
        "expectedResult": "Frustration: Fusees require A8.13."
      }
    ]
  },
  {
    "scenario": 11,
    "unNumber": "UN1944",
    "title": "MATCHES, SAFETY",
    "packagingParagraph": "A8.14",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN1944",
      "PSN": "MATCHES, SAFETY",
      "Details": "book, card or strike on box",
      "Hazard Class/Division": "4.1",
      "Packing Group": "III",
      "Packaging Paragraph": "A8.14",
      "Special Provisions": "P5",
      "Subsidiary Risk": "None"
    },
    "expectedSddg": {
      "Key 7": "Passenger and Cargo Aircraft",
      "Key 11": "UN1944",
      "Key 12": "MATCHES, SAFETY (book, card or strike on box)",
      "Key 13": "4.1",
      "Key 14": "(empty)",
      "Key 15": "III",
      "Key 16": "2 fiberboard boxes (4G) x 25 kg each",
      "Key 17": "A8.14."
    },
    "expectedPackage": {
      "labels": [
        "FLAMMABLE SOLID (Division 4.1) - Red/white vertical stripes"
      ],
      "markings": [
        "UN1944 (minimum 12mm height)",
        "MATCHES, SAFETY (book, card or strike on box)"
      ],
      "pop": {
        "allowedCodes": [
          "1A1",
          "1A2",
          "1B1",
          "1B2",
          "1D",
          "1G",
          "1N1",
          "1N2",
          "3A1",
          "3A2",
          "3B1",
          "3B2",
          "3C",
          "4A",
          "4B",
          "4C1",
          "4C2",
          "4D",
          "4F",
          "4G",
          "4N"
        ],
        "packingGroupCode": "Z"
      }
    },
    "alterations": [
      {
        "id": 1,
        "category": "SDDG - Key 13",
        "alteration": "Shows \"4\" instead of \"4.1\"",
        "expectedResult": "Frustration: Must specify full division"
      },
      {
        "id": 2,
        "category": "Marking",
        "alteration": "UN number shows \"UN1945\" (matches, wax)",
        "expectedResult": "Frustration: UN number mismatch with PSN"
      },
      {
        "id": 3,
        "category": "SDDG - Key 15",
        "alteration": "Shows \"II\" instead of \"III\"",
        "expectedResult": "Frustration: Incorrect packing group"
      }
    ]
  },
  {
    "scenario": 12,
    "unNumber": "UN3541",
    "title": "ARTICLES CONTAINING FLAMMABLE SOLID, N.O.S.",
    "packagingParagraph": "A8.15",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN3541",
      "PSN": "ARTICLES CONTAINING FLAMMABLE SOLID, N.O.S.",
      "Hazard Class/Division": "4.1",
      "Packing Group": "(none for articles)",
      "Packaging Paragraph": "A8.15",
      "Special Provisions": "P5, 391",
      "Subsidiary Risk": "None",
      "Technical Name Required": "Yes"
    },
    "expectedSddg": {
      "Key 7": "Passenger and Cargo Aircraft",
      "Key 11": "UN3541",
      "Key 12": "ARTICLES CONTAINING FLAMMABLE SOLID, N.O.S. (technical name)",
      "Key 13": "4.1",
      "Key 14": "(empty)",
      "Key 15": "(empty - articles)",
      "Key 16": "2 fiberboard boxes (4G) x 25 kg each",
      "Key 17": "A8.15"
    },
    "expectedPackage": {
      "labels": [
        "FLAMMABLE SOLID (Division 4.1) - Red/white vertical stripes"
      ],
      "markings": [
        "UN3541 (minimum 12mm height)",
        "ARTICLES CONTAINING FLAMMABLE SOLID, N.O.S.",
        "Technical name in parentheses"
      ],
      "pop": {
        "allowedCodes": [
          "1A2",
          "1B2",
          "1D",
          "1G",
          "1H2",
          "1N2",
          "3A2",
          "3B2",
          "3H2",
          "4A",
          "4B",
          "4C1",
          "4C2",
          "4D",
          "4F",
          "4G",
          "4H1",
          "4H2",
          "4N"
        ],
        "packingGroupCode": ""
      }
    },
    "alterations": [
      {
        "id": 1,
        "category": "SDDG - Key 12",
        "alteration": "Technical name missing",
        "expectedResult": "Frustration: N.O.S. entry requires technical name"
      },
      {
        "id": 2,
        "category": "Marking",
        "alteration": "Technical name missing from package",
        "expectedResult": "Frustration: Technical name required on package marking"
      },
      {
        "id": 3,
        "category": "SDDG - Key 17",
        "alteration": "Shows \"A8.3.\" instead of \"A8.15\"",
        "expectedResult": "Frustration: Articles require A8.15"
      }
    ]
  },
  {
    "scenario": 13,
    "unNumber": "UN1381",
    "title": "PHOSPHORUS, WHITE, DRY",
    "packagingParagraph": "A8.16",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN1381",
      "PSN": "PHOSPHORUS, WHITE, DRY",
      "Hazard Class/Division": "4.2",
      "Packing Group": "I",
      "Packaging Paragraph": "A8.16.",
      "Special Provisions": "P3, N34",
      "Subsidiary Risk": "6.1"
    },
    "expectedSddg": {
      "Key 7": "Cargo Aircraft Only",
      "Key 11": "UN1381",
      "Key 12": "PHOSPHORUS, WHITE, DRY",
      "Key 13": "4.2",
      "Key 14": "6.1",
      "Key 15": "I",
      "Key 16": "1 steel drum (1A2) x 50 kg",
      "Key 17": "A8.16."
    },
    "expectedPackage": {
      "labels": [
        "SPONTANEOUSLY COMBUSTIBLE (Division 4.2) - Upper white, lower red",
        "TOXIC (6.1) - White with skull and crossbones",
        "Cargo Aircraft Only"
      ],
      "markings": [
        "UN1381 (minimum 12mm height)",
        "PHOSPHORUS, WHITE, DRY"
      ],
      "pop": {
        "allowedCodes": [
          "1A2",
          "1B2",
          "1N2"
        ],
        "packingGroupCode": ""
      }
    },
    "alterations": [
      {
        "id": 1,
        "category": "Label",
        "alteration": "Missing TOXIC (6.1) subsidiary label",
        "expectedResult": "Frustration: Subsidiary hazard label required"
      },
      {
        "id": 2,
        "category": "SDDG - Key 14",
        "alteration": "Empty (should be \"6.1\")",
        "expectedResult": "Frustration: Missing subsidiary risk declaration"
      },
      {
        "id": 3,
        "category": "SDDG - Key 7",
        "alteration": "Shows \"Passenger and Cargo Aircraft\"",
        "expectedResult": "Frustration: P3 requires Cargo Aircraft Only"
      }
    ]
  },
  {
    "scenario": 14,
    "unNumber": "NA3178",
    "title": "SMOKELESS POWDER FOR SMALL ARMS",
    "packagingParagraph": "A8.17",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "NA3178",
      "PSN": "SMOKELESS POWDER FOR SMALL ARMS",
      "Details": "100 pounds or less",
      "Hazard Class/Division": "4.1",
      "Packing Group": "I",
      "Packaging Paragraph": "A8.17.",
      "Special Provisions": "P4",
      "Subsidiary Risk": "None",
      "Domestic Only": "Yes"
    },
    "expectedSddg": {
      "Key 7": "Cargo Aircraft Only",
      "Key 11": "NA3178",
      "Key 12": "SMOKELESS POWDER FOR SMALL ARMS (100 pounds or less)",
      "Key 13": "4.1",
      "Key 14": "(empty)",
      "Key 15": "I",
      "Key 16": "10 inner containers in 1 fiberboard box (4G) x 3.6 kg each inner",
      "Key 17": "A8.17."
    },
    "expectedPackage": {
      "labels": [
        "FLAMMABLE SOLID (Division 4.1) - Red/white vertical stripes",
        "Cargo Aircraft Only"
      ],
      "markings": [
        "NA3178 (minimum 12mm height) - Note: NA prefix for domestic",
        "SMOKELESS POWDER FOR SMALL ARMS"
      ],
      "pop": {
        "allowedCodes": [
          "4G"
        ],
        "packingGroupCode": ""
      }
    },
    "alterations": [
      {
        "id": 1,
        "category": "SDDG - Key 7",
        "alteration": "Shows \"Passenger and Cargo Aircraft\"",
        "expectedResult": "Frustration: P4 requires Cargo Aircraft Only"
      },
      {
        "id": 2,
        "category": "Label",
        "alteration": "Missing Cargo Aircraft Only label",
        "expectedResult": "Frustration: P4 requires CAO label"
      },
      {
        "id": 3,
        "category": "POP Marking",
        "alteration": "Packing group code \"Y\" instead of \"X\"",
        "expectedResult": "Frustration: PG I material requires X-rated packaging"
      }
    ]
  },
  {
    "scenario": 15,
    "unNumber": "UN3292",
    "title": "BATTERIES, CONTAINING SODIUM",
    "packagingParagraph": "A8.18",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN3292",
      "PSN": "BATTERIES, CONTAINING SODIUM",
      "Hazard Class/Division": "4.3",
      "Packing Group": "(none for batteries)",
      "Packaging Paragraph": "A8.18.",
      "Special Provisions": "P5",
      "Subsidiary Risk": "None"
    },
    "expectedSddg": {
      "Key 7": "Passenger and Cargo Aircraft",
      "Key 11": "UN3292",
      "Key 12": "BATTERIES, CONTAINING SODIUM",
      "Key 13": "4.3",
      "Key 14": "(empty)",
      "Key 15": "(empty - batteries)",
      "Key 16": "2 batteries (unpackaged or protective packaging)",
      "Key 17": "A8.18."
    },
    "expectedPackage": {
      "labels": [
        "DANGEROUS WHEN WET (Division 4.3) - Blue"
      ],
      "markings": [
        "UN3292 (minimum 12mm height)",
        "BATTERIES, CONTAINING SODIUM"
      ],
      "pop": {
        "allowedCodes": [],
        "packingGroupCode": ""
      }
    },
    "alterations": [
      {
        "id": 1,
        "category": "Label",
        "alteration": "Division 4.1 FLAMMABLE SOLID label instead of 4.3",
        "expectedResult": "Frustration: Wrong division label"
      },
      {
        "id": 2,
        "category": "SDDG - Key 13",
        "alteration": "Shows \"4\" instead of \"4.3\"",
        "expectedResult": "Frustration: Must specify full division"
      },
      {
        "id": 3,
        "category": "SDDG - Key 17",
        "alteration": "Shows \"A8.3.\" instead of \"A8.18.\"",
        "expectedResult": "Frustration: Sodium batteries require A8.18."
      }
    ]
  },
  {
    "scenario": 16,
    "unNumber": "UN3527",
    "title": "POLYESTER RESIN KIT",
    "packagingParagraph": "A8.19",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN3527",
      "PSN": "POLYESTER RESIN KIT",
      "Details": "solid base material",
      "Hazard Class/Division": "4.1",
      "Packing Group": "II",
      "Packaging Paragraph": "A8.19.",
      "Special Provisions": "P5",
      "Subsidiary Risk": "None"
    },
    "expectedSddg": {
      "Key 7": "Passenger and Cargo Aircraft",
      "Key 11": "UN3527",
      "Key 12": "POLYESTER RESIN KIT, solid base material",
      "Key 13": "4.1",
      "Key 14": "(empty)",
      "Key 15": "II",
      "Key 16": "1 fiberboard box (4G) containing base + activator x 5 kg total",
      "Key 17": "A8.19."
    },
    "expectedPackage": {
      "labels": [
        "FLAMMABLE SOLID (Division 4.1) - Red/white vertical stripes"
      ],
      "markings": [
        "UN3527 (minimum 12mm height)",
        "POLYESTER RESIN KIT"
      ],
      "pop": {
        "allowedCodes": [],
        "packingGroupCode": ""
      }
    },
    "alterations": [
      {
        "id": 1,
        "category": "SDDG - Key 15",
        "alteration": "Empty (should be \"II\")",
        "expectedResult": "Frustration: Packing group required"
      },
      {
        "id": 2,
        "category": "POP Marking",
        "alteration": "Packing group code \"Z\" instead of \"Y\"",
        "expectedResult": "Frustration: PG II requires Y or X rated packaging"
      },
      {
        "id": 3,
        "category": "SDDG - Key 17",
        "alteration": "Shows \"A8.3.\" instead of \"A8.19.\"",
        "expectedResult": "Frustration: Polyester resin kits require A8.19."
      }
    ]
  },
  {
    "scenario": 17,
    "unNumber": "UN3476",
    "title": "FUEL CELL CARTRIDGES (water-reactive)",
    "packagingParagraph": "A8.20",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN3476",
      "PSN": "FUEL CELL CARTRIDGES",
      "Details": "containing water-reactive substances",
      "Hazard Class/Division": "4.3",
      "Packing Group": "II",
      "Packaging Paragraph": "A8.20., A8.21., A8.22.",
      "Special Provisions": "P5, 328",
      "Subsidiary Risk": "None"
    },
    "expectedSddg": {
      "Key 7": "Passenger and Cargo Aircraft",
      "Key 11": "UN3476",
      "Key 12": "FUEL CELL CARTRIDGES, containing water-reactive substances",
      "Key 13": "4.3",
      "Key 14": "(empty)",
      "Key 15": "II",
      "Key 16": "4 fuel cell cartridges in fiberboard box (4G) x 1 kg each",
      "Key 17": "A8.20."
    },
    "expectedPackage": {
      "labels": [
        "DANGEROUS WHEN WET (Division 4.3) - Blue"
      ],
      "markings": [
        "UN3476 (minimum 12mm height)",
        "FUEL CELL CARTRIDGES"
      ],
      "pop": {
        "allowedCodes": [
          "1D",
          "1G",
          "1H2",
          "3H2",
          "4C1",
          "4C2",
          "4D",
          "4F",
          "4G",
          "4H2"
        ],
        "packingGroupCode": ""
      }
    },
    "alterations": [
      {
        "id": 1,
        "category": "Label",
        "alteration": "Division 4.1 FLAMMABLE SOLID label instead of 4.3",
        "expectedResult": "Frustration: Wrong division label"
      },
      {
        "id": 2,
        "category": "POP Marking",
        "alteration": "Packing group code \"Z\" instead of \"Y\"",
        "expectedResult": "Frustration: PG II requires Y or X rated packaging"
      },
      {
        "id": 3,
        "category": "SDDG - Key 13",
        "alteration": "Shows \"4\" instead of \"4.3\"",
        "expectedResult": "Frustration: Must specify full division"
      }
    ]
  }
];
