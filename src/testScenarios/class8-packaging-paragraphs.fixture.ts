// Auto-generated from class8-packaging-paragraphs.md. Do not edit by hand.
export type Class8ScenarioFixture = {
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
  alterations: Array<{ id: number; alteration: string; tests: string }>;
};

export const class8ScenarioFixtures: Class8ScenarioFixture[] = 
[
  {
    "scenario": 1,
    "unNumber": "UN2789",
    "title": "A12.2 - ACETIC ACID, GLACIAL",
    "packagingParagraph": "A12.2",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN2789",
      "PSN": "ACETIC ACID, GLACIAL or acetic acid solution, more than 80% acid, by mass",
      "Hazard Class": "8",
      "Subsidiary Risk": "3 (Flammable)",
      "Packing Group": "II",
      "Packaging Paragraph": "A12.2",
      "Special Provisions": "P5, A3, A7, A10",
      "Physical State": "Liquid"
    },
    "expectedSddg": {
      "Key 7": "\"Passenger and Cargo Aircraft\" (P5 allows passenger)",
      "Key 11": "\"UN2789\"",
      "Key 12": "\"ACETIC ACID, GLACIAL or acetic acid solution, more than 80% acid, by mass\"",
      "Key 13": "\"8\"",
      "Key 14": "\"3\"",
      "Key 15": "\"II\"",
      "Key 16": "Net quantity + packaging (e.g., \"2 x 5L glass carboys in fiberboard box (4G)\")",
      "Key 17": "\"A12.2\""
    },
    "expectedPackage": {
      "labels": [
        "CORROSIVE (Class 8) - white upper half, black lower half, \"8\" in corner",
        "FLAMMABLE LIQUID (Class 3) - subsidiary hazard label",
        "Orientation labels (This Way Up arrows) - on TWO OPPOSITE SIDES"
      ],
      "markings": [
        "UN2789 (12mm minimum height)",
        "PSN: \"ACETIC ACID, GLACIAL or acetic acid solution, more than 80% acid, by mass\"",
        "Military Shipping Label (MSL)",
        "Orientation arrows on TWO OPPOSITE SIDES"
      ],
      "pop": {
        "allowedCodes": [
          "1A1",
          "1A2",
          "1B1",
          "1B2",
          "1H1",
          "1H2",
          "1N1",
          "1N2",
          "6HA1",
          "6HB1",
          "6HD1",
          "6HG1",
          "6HH1"
        ],
        "packingGroupCode": "XorY"
      }
    },
    "alterations": [
      {
        "id": 1,
        "alteration": "Key 14 empty when flammable subsidiary exists",
        "tests": "Subsidiary risk validation"
      },
      {
        "id": 2,
        "alteration": "Missing FLAMMABLE LIQUID 3 subsidiary label",
        "tests": "Subsidiary label requirement"
      },
      {
        "id": 3,
        "alteration": "POP marking shows packing group \"Z\"",
        "tests": "PG II requires X or Y rating validation"
      },
      {
        "id": 4,
        "alteration": "Missing orientation labels on package",
        "tests": "Orientation requirement for corrosive liquids"
      }
    ]
  },
  {
    "scenario": 2,
    "unNumber": "UN2583",
    "title": "A12.3 - ALKYLSULFONIC ACIDS, SOLID",
    "packagingParagraph": "A12.3",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN2583",
      "PSN": "ALKYLSULFONIC ACIDS, SOLID",
      "Details": "with more than 5% free sulfuric acid",
      "Hazard Class": "8",
      "Subsidiary Risk": "None",
      "Packing Group": "II",
      "Packaging Paragraph": "A12.3",
      "Special Provisions": "P5",
      "Physical State": "Solid"
    },
    "expectedSddg": {
      "Key 7": "\"Passenger and Cargo Aircraft\" (P5 allows passenger)",
      "Key 11": "\"UN2583\"",
      "Key 12": "\"ALKYLSULFONIC ACIDS, SOLID with more than 5% free sulfuric acid\"",
      "Key 13": "\"8\"",
      "Key 14": "Empty",
      "Key 15": "\"II\"",
      "Key 16": "Net quantity + packaging (e.g., \"2 x 25kg fiber drums (1G)\")",
      "Key 17": "\"A12.3\""
    },
    "expectedPackage": {
      "labels": [
        "CORROSIVE (Class 8)",
        "NO Cargo Aircraft Only label (P5 allows passenger)",
        "NO orientation labels (solid material - not required)"
      ],
      "markings": [
        "UN2583 (12mm minimum height)",
        "PSN: \"ALKYLSULFONIC ACIDS, SOLID with more than 5% free sulfuric acid\"",
        "Military Shipping Label (MSL)"
      ],
      "pop": {
        "allowedCodes": [
          "1A1",
          "1A2",
          "1B1",
          "1B2",
          "1G",
          "1H1",
          "1H2",
          "1N1",
          "1N2",
          "4A",
          "4B",
          "4C1",
          "4C2",
          "4D",
          "4F",
          "4G",
          "4H2",
          "4N"
        ],
        "packingGroupCode": "XorY"
      }
    },
    "alterations": [
      {
        "id": 1,
        "alteration": "Key 17 shows \"A12.2\" instead of \"A12.3\"",
        "tests": "Solid vs Liquid packaging paragraph validation"
      },
      {
        "id": 2,
        "alteration": "Package has unnecessary orientation labels",
        "tests": "Orientation not required for solids"
      },
      {
        "id": 3,
        "alteration": "POP marking shows unauthorized packaging code (7A1)",
        "tests": "Code 7A1 not authorized for A12.3 solids"
      }
    ]
  },
  {
    "scenario": 3,
    "unNumber": "UN2794",
    "title": "A12.4 - BATTERIES, WET, FILLED WITH ACID",
    "packagingParagraph": "A12.4",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN2794",
      "PSN": "BATTERIES, WET, FILLED WITH ACID",
      "Details": "electric storage",
      "Hazard Class": "8",
      "Subsidiary Risk": "None",
      "Packing Group": "None (batteries exempted)",
      "Packaging Paragraph": "A12.4",
      "Special Provisions": "P5",
      "Physical State": "Liquid (acid-filled)"
    },
    "expectedSddg": {
      "Key 7": "\"Passenger and Cargo Aircraft\" (P5 allows passenger)",
      "Key 11": "\"UN2794\"",
      "Key 12": "\"BATTERIES, WET, FILLED WITH ACID, electric storage\"",
      "Key 13": "\"8\"",
      "Key 14": "Empty",
      "Key 15": "Empty (No PG for wet batteries per Table A4.1)",
      "Key 16": "Number of batteries + weight (e.g., \"2 batteries x 15 kg each\")",
      "Key 17": "\"A12.4\""
    },
    "expectedPackage": {
      "labels": [
        "CORROSIVE (Class 8)",
        "Package Orientation labels (required per A15.4.7.1 for wet-cell batteries)"
      ],
      "markings": [
        "UN2794 (12mm minimum height)",
        "PSN: \"BATTERIES, WET, FILLED WITH ACID, electric storage\"",
        "Military Shipping Label (MSL)",
        "Orientation markings if not obvious"
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
        "alteration": "Key 15 shows \"II\" when wet batteries have no PG",
        "tests": "Battery PG exception validation"
      },
      {
        "id": 2,
        "alteration": "Missing Package Orientation label",
        "tests": "Wet battery orientation requirement"
      },
      {
        "id": 3,
        "alteration": "Key 12 shows only \"BATTERIES\" without full descriptor",
        "tests": "PSN completeness validation"
      },
      {
        "id": 4,
        "alteration": "Key 17 shows \"A12.2\" instead of \"A12.4\"",
        "tests": "Battery-specific packaging instruction"
      }
    ]
  },
  {
    "scenario": 4,
    "unNumber": "UN2028",
    "title": "A12.5 - BOMBS, SMOKE, NON-EXPLOSIVE",
    "packagingParagraph": "A12.5",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN2028",
      "PSN": "BOMBS, SMOKE, NON-EXPLOSIVE",
      "Details": "with corrosive liquid, without initiating device",
      "Hazard Class": "8",
      "Subsidiary Risk": "None",
      "Packing Group": "II",
      "Packaging Paragraph": "A12.5",
      "Special Provisions": "P4",
      "Physical State": "Device containing liquid"
    },
    "expectedSddg": {
      "Key 7": "\"Cargo Aircraft Only\" (P4 provision)",
      "Key 11": "\"UN2028\"",
      "Key 12": "\"BOMBS, SMOKE, NON-EXPLOSIVE with corrosive liquid, without initiating device\"",
      "Key 13": "\"8\"",
      "Key 14": "Empty",
      "Key 15": "\"II\"",
      "Key 16": "Quantity + packaging (e.g., \"4 units in wooden box (4C1)\")",
      "Key 17": "\"A12.5\""
    },
    "expectedPackage": {
      "labels": [
        "CORROSIVE (Class 8)",
        "Cargo Aircraft Only (P4 requires CAO)",
        "Orientation labels (contains liquid corrosive)"
      ],
      "markings": [
        "UN2028 (12mm minimum height)",
        "PSN: \"BOMBS, SMOKE, NON-EXPLOSIVE with corrosive liquid, without initiating device\"",
        "Military Shipping Label (MSL)"
      ],
      "pop": {
        "allowedCodes": [
          "1A2",
          "1B2",
          "1D",
          "1G",
          "1H2",
          "1N2",
          "4A",
          "4B",
          "4C1",
          "4C2",
          "4D",
          "4F",
          "4G",
          "4H2",
          "4N"
        ],
        "packingGroupCode": ""
      }
    },
    "alterations": [
      {
        "id": 1,
        "alteration": "Key 7 shows \"Passenger and Cargo Aircraft\"",
        "tests": "P4 requires CAO validation"
      },
      {
        "id": 2,
        "alteration": "Missing Cargo Aircraft Only label",
        "tests": "CAO label requirement for P4"
      },
      {
        "id": 3,
        "alteration": "Key 17 shows \"A12.2\" instead of \"A12.5\"",
        "tests": "Smoke bomb specific packaging validation"
      },
      {
        "id": 4,
        "alteration": "Key 12 missing \"without initiating device\" qualifier",
        "tests": "PSN completeness for safety devices"
      }
    ]
  },
  {
    "scenario": 5,
    "unNumber": "UN3547",
    "title": "A12.6 - ARTICLES CONTAINING CORROSIVE SUBSTANCE, N.O.S.",
    "packagingParagraph": "A12.6",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN3547",
      "PSN": "ARTICLES CONTAINING CORROSIVE SUBSTANCE, N.O.S.",
      "Hazard Class": "8",
      "Subsidiary Risk": "None",
      "Packing Group": "None",
      "Packaging Paragraph": "A12.6",
      "Special Provisions": "P5, 391",
      "Technical Name Required": "Yes"
    },
    "expectedSddg": {
      "Key 7": "\"Passenger and Cargo Aircraft\" (P5 allows passenger)",
      "Key 11": "\"UN3547\"",
      "Key 12": "\"ARTICLES CONTAINING CORROSIVE SUBSTANCE, N.O.S. (contains sulfuric acid cartridge)\"",
      "Key 13": "\"8\"",
      "Key 14": "Empty",
      "Key 15": "Empty (no PG for articles)",
      "Key 16": "Quantity + description (e.g., \"2 units x 500g each in fiberboard box\")",
      "Key 17": "\"A12.6\""
    },
    "expectedPackage": {
      "labels": [
        "CORROSIVE (Class 8)",
        "Orientation labels if liquid contents"
      ],
      "markings": [
        "UN3547 (12mm minimum height)",
        "PSN with technical name: \"ARTICLES CONTAINING CORROSIVE SUBSTANCE, N.O.S. (contains sulfuric acid cartridge)\"",
        "Military Shipping Label (MSL)"
      ],
      "pop": {
        "allowedCodes": [],
        "packingGroupCode": ""
      }
    },
    "alterations": [
      {
        "id": 1,
        "alteration": "Key 12 missing technical name for N.O.S.",
        "tests": "Technical name requirement for N.O.S. articles"
      },
      {
        "id": 2,
        "alteration": "Package marking missing technical name",
        "tests": "N.O.S. marking requirement"
      },
      {
        "id": 3,
        "alteration": "Key 15 shows \"II\" when articles have no PG",
        "tests": "Article PG exception"
      },
      {
        "id": 4,
        "alteration": "Package exceeds 30L liquid limit",
        "tests": "A12.6 quantity limit validation"
      }
    ]
  },
  {
    "scenario": 6,
    "unNumber": "UN2803",
    "title": "A12.7 - GALLIUM",
    "packagingParagraph": "A12.7",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN2803",
      "PSN": "GALLIUM",
      "Hazard Class": "8",
      "Subsidiary Risk": "None",
      "Packing Group": "III",
      "Packaging Paragraph": "A12.7",
      "Special Provisions": "P3",
      "Physical State": "Liquid (low melting point metal)"
    },
    "expectedSddg": {
      "Key 7": "\"Cargo Aircraft Only\" (P3 provision)",
      "Key 11": "\"UN2803\"",
      "Key 12": "\"GALLIUM\"",
      "Key 13": "\"8\"",
      "Key 14": "Empty",
      "Key 15": "\"III\"",
      "Key 16": "Net quantity + packaging (e.g., \"1 x 2.5 kg plastic inner in fiberboard box\")",
      "Key 17": "\"A12.7\""
    },
    "expectedPackage": {
      "labels": [
        "CORROSIVE (Class 8)",
        "Cargo Aircraft Only (P3 requires CAO)",
        "Orientation labels (liquid metal)"
      ],
      "markings": [
        "UN2803 (12mm minimum height)",
        "PSN: \"GALLIUM\"",
        "Military Shipping Label (MSL)"
      ],
      "pop": {
        "allowedCodes": [],
        "packingGroupCode": ""
      }
    },
    "alterations": [
      {
        "id": 1,
        "alteration": "Key 7 shows \"Passenger and Cargo Aircraft\"",
        "tests": "P3 requires CAO validation"
      },
      {
        "id": 2,
        "alteration": "Key 17 shows \"A12.2\" instead of \"A12.7\"",
        "tests": "Gallium-specific packaging instruction"
      },
      {
        "id": 3,
        "alteration": "Missing leak-tight bag impervious to gallium",
        "tests": "Gallium-specific liner requirement"
      },
      {
        "id": 4,
        "alteration": "POP marking shows PG III rating (Z)",
        "tests": "A12.7 requires PG I performance despite PG III material"
      }
    ]
  },
  {
    "scenario": 7,
    "unNumber": "UN1052",
    "title": "A12.8 - HYDROGEN FLUORIDE, ANHYDROUS",
    "packagingParagraph": "A12.8",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN1052",
      "PSN": "HYDROGEN FLUORIDE, ANHYDROUS",
      "Hazard Class": "8",
      "Subsidiary Risk": "6.1 (Toxic)",
      "Packing Group": "I",
      "Packaging Paragraph": "A12.8",
      "Special Provisions": "P2, 3, N86",
      "Physical State": "Liquefied gas"
    },
    "expectedSddg": {
      "Key 7": "\"Cargo Aircraft Only\" (P2 provision)",
      "Key 11": "\"UN1052\"",
      "Key 12": "\"HYDROGEN FLUORIDE, ANHYDROUS\"",
      "Key 13": "\"8\"",
      "Key 14": "\"6.1\"",
      "Key 15": "\"I\"",
      "Key 16": "Cylinder description (e.g., \"1 x DOT 3AA cylinder, 50 kg\")",
      "Key 17": "\"A12.8\""
    },
    "expectedPackage": {
      "labels": [
        "CORROSIVE (Class 8)",
        "TOXIC (Class 6.1) - subsidiary hazard label",
        "Cargo Aircraft Only (P2 requires CAO)"
      ],
      "markings": [
        "UN1052 (12mm minimum height)",
        "PSN: \"HYDROGEN FLUORIDE, ANHYDROUS\"",
        "Military Shipping Label (MSL)",
        "Cylinder specification marking"
      ],
      "pop": {
        "allowedCodes": [
          "3A",
          "3AA",
          "3B",
          "3BN",
          "3E",
          "4B",
          "4BA",
          "4BW"
        ],
        "packingGroupCode": ""
      }
    },
    "alterations": [
      {
        "id": 1,
        "alteration": "Key 14 empty when toxic subsidiary exists",
        "tests": "Subsidiary risk validation"
      },
      {
        "id": 2,
        "alteration": "Missing TOXIC 6.1 subsidiary label",
        "tests": "Subsidiary label requirement"
      },
      {
        "id": 3,
        "alteration": "Key 17 shows \"A12.2\" instead of \"A12.8\"",
        "tests": "HF cylinder-specific packaging instruction"
      },
      {
        "id": 4,
        "alteration": "Non-cylinder packaging specified",
        "tests": "A12.8 cylinder-only requirement"
      }
    ]
  },
  {
    "scenario": 8,
    "unNumber": "UN2809",
    "title": "A12.9 - MERCURY",
    "packagingParagraph": "A12.9",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN2809",
      "PSN": "MERCURY",
      "Hazard Class": "8",
      "Subsidiary Risk": "6.1 (Toxic)",
      "Packing Group": "III",
      "Packaging Paragraph": "A12.9",
      "Special Provisions": "P5",
      "Physical State": "Liquid (metallic)"
    },
    "expectedSddg": {
      "Key 7": "\"Passenger and Cargo Aircraft\" (P5 allows passenger)",
      "Key 11": "\"UN2809\"",
      "Key 12": "\"MERCURY\"",
      "Key 13": "\"8\"",
      "Key 14": "\"6.1\"",
      "Key 15": "\"III\"",
      "Key 16": "Net quantity + packaging (e.g., \"1 x 3.5 kg glass ampoule in steel drum\")",
      "Key 17": "\"A12.9\""
    },
    "expectedPackage": {
      "labels": [
        "CORROSIVE (Class 8)",
        "TOXIC (Class 6.1) - subsidiary hazard label",
        "Orientation labels (liquid)"
      ],
      "markings": [
        "UN2809 (12mm minimum height)",
        "PSN: \"MERCURY\"",
        "Military Shipping Label (MSL)"
      ],
      "pop": {
        "allowedCodes": [
          "1A1",
          "1A2",
          "1D",
          "1G",
          "1N1",
          "1N2",
          "3A2"
        ],
        "packingGroupCode": ""
      }
    },
    "alterations": [
      {
        "id": 1,
        "alteration": "Key 17 shows \"A12.2\" instead of \"A12.9\"",
        "tests": "Mercury-specific packaging instruction"
      },
      {
        "id": 2,
        "alteration": "Missing TOXIC 6.1 subsidiary label",
        "tests": "Subsidiary label validation"
      },
      {
        "id": 3,
        "alteration": "Key 14 empty when toxic subsidiary exists",
        "tests": "Subsidiary risk validation"
      },
      {
        "id": 4,
        "alteration": "Missing mercury-impervious liner",
        "tests": "Mercury liner requirement"
      }
    ]
  },
  {
    "scenario": 9,
    "unNumber": "UN2031",
    "title": "A12.10 - NITRIC ACID (>20% and <65%)",
    "packagingParagraph": "A12.10",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN2031",
      "PSN": "NITRIC ACID",
      "Details": "other than red fuming, with more than 20% and less than 65% nitric acid",
      "Hazard Class": "8",
      "Subsidiary Risk": "None",
      "Packing Group": "II",
      "Packaging Paragraph": "A12.10",
      "Special Provisions": "P4",
      "Physical State": "Liquid"
    },
    "expectedSddg": {
      "Key 7": "\"Cargo Aircraft Only\" (P4 requires CAO)",
      "Key 11": "\"UN2031\"",
      "Key 12": "\"NITRIC ACID, other than red fuming, with more than 20% and less than 65% nitric acid\"",
      "Key 13": "\"8\"",
      "Key 14": "Empty",
      "Key 15": "\"II\"",
      "Key 16": "Net quantity + packaging (e.g., \"1 x 2.5L glass bottle in wooden box\")",
      "Key 17": "\"A12.10\""
    },
    "expectedPackage": {
      "labels": [
        "CORROSIVE (Class 8)",
        "Cargo Aircraft Only (P4 requires CAO)",
        "Orientation labels"
      ],
      "markings": [
        "UN2031 (12mm minimum height)",
        "PSN: \"NITRIC ACID, other than red fuming, with more than 20% and less than 65% nitric acid\"",
        "Military Shipping Label (MSL)",
        "Orientation arrows"
      ],
      "pop": {
        "allowedCodes": [
          "1A1",
          "5L"
        ],
        "packingGroupCode": ""
      }
    },
    "alterations": [
      {
        "id": 1,
        "alteration": "Key 17 shows \"A12.2\" instead of \"A12.10\"",
        "tests": "Nitric acid specific packaging instruction"
      },
      {
        "id": 2,
        "alteration": "Key 12 missing concentration qualifier",
        "tests": "PSN completeness for concentration-specific entries"
      }
    ]
  },
  {
    "scenario": 10,
    "unNumber": "UN1740",
    "title": "A12.3 - HYDROGENDIFLUORIDES, SOLID N.O.S.",
    "packagingParagraph": "A12.3",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN1740",
      "PSN": "HYDROGENDIFLUORIDES, SOLID N.O.S.",
      "Hazard Class": "8",
      "Subsidiary Risk": "None",
      "Packing Group": "II:III",
      "Packaging Paragraph": "A12.3",
      "Special Provisions": "P5, N3, N34",
      "Physical State": "Solid"
    },
    "expectedSddg": {
      "Key 7": "\"Passenger and Cargo Aircraft\" (P5 allows passenger)",
      "Key 11": "\"UN1740\"",
      "Key 12": "\"HYDROGENDIFLUORIDES, SOLID N.O.S.\"",
      "Key 13": "\"8\"",
      "Key 14": "Empty",
      "Key 15": "\"II:III\"",
      "Key 16": "Net quantity + packaging",
      "Key 17": "\"A12.3.:A12.3.\""
    },
    "expectedPackage": {
      "labels": [
        "CORROSIVE (Class 8)",
        "NO Cargo Aircraft Only label (P5 allows passenger)",
        "NO orientation labels (solid material - not required)"
      ],
      "markings": [
        "UN1740 (12mm minimum height)",
        "PSN: \"HYDROGENDIFLUORIDES, SOLID N.O.S.\"",
        "Military Shipping Label (MSL)"
      ],
      "pop": {
        "allowedCodes": [
          "1A1", "1A2", "1B1", "1B2", "1D", "1G", "1H1", "1H2", "1N1", "1N2",
          "2C1", "2C2",
          "3A1", "3A2", "3B1", "3B2", "3H1", "3H2",
          "4A", "4B", "4C1", "4C2", "4D", "4F", "4G", "4H1", "4H2", "4N",
          "5H1", "5H2", "5H3", "5H4", "5L1", "5L2", "5L3", "5M2",
          "6HA1", "6HA2", "6HB1", "6HB2", "6HC", "6HD1", "6HD2", "6HG1", "6HG2", "6HH1",
          "6PA1", "6PA2", "6PB1", "6PB2", "6PC", "6PD1", "6PG1", "6PG2", "6PH1", "6PH2",
          "DOT"
        ],
        "packingGroupCode": "YorZ"
      }
    },
    "alterations": [
      {
        "id": 1,
        "alteration": "Key 17 shows \"A12.2\" instead of \"A12.3\"",
        "tests": "Solid vs Liquid packaging paragraph validation"
      },
      {
        "id": 2,
        "alteration": "Package has unnecessary orientation labels",
        "tests": "Orientation not required for solids"
      },
      {
        "id": 3,
        "alteration": "Key 15 shows \"I\" instead of \"II\" or \"III\"",
        "tests": "Packing group validation"
      }
    ]
  },
  {
    "scenario": 11,
    "unNumber": "UN3477",
    "title": "A12.12/13/14 - FUEL CELL CARTRIDGES CONTAINED IN EQUIPMENT",
    "packagingParagraph": "A12.12., A12.13., A12.14.",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN3477",
      "PSN": "FUEL CELL CARTRIDGES CONTAINED IN EQUIPMENT",
      "Details": "containing corrosive substances",
      "Hazard Class": "8",
      "Subsidiary Risk": "None",
      "Packing Group": "II",
      "Packaging Paragraph": "A12.12., A12.13., A12.14.",
      "Special Provisions": "P5, 328",
      "Physical State": "Cartridge device"
    },
    "expectedSddg": {
      "Key 7": "\"Passenger and Cargo Aircraft\" (P5 allows passenger)",
      "Key 11": "\"UN3477\"",
      "Key 12": "\"FUEL CELL CARTRIDGES CONTAINED IN EQUIPMENT\"",
      "Key 13": "\"8\"",
      "Key 14": "Empty",
      "Key 15": "\"II\"",
      "Key 16": "Quantity + weight (e.g., \"4 cartridges x 1 kg each in fiberboard box\")",
      "Key 17": "\"A12.12., A12.13., A12.14.\""
    },
    "expectedPackage": {
      "labels": [
        "CORROSIVE (Class 8)",
        "NO Cargo Aircraft Only (P5 allows passenger)"
      ],
      "markings": [
        "UN3477 (12mm minimum height)",
        "PSN: \"FUEL CELL CARTRIDGES CONTAINED IN EQUIPMENT\"",
        "Military Shipping Label (MSL)"
      ],
      "pop": {
        "allowedCodes": [],
        "packingGroupCode": ""
      }
    },
    "alterations": [
      {
        "id": 1,
        "alteration": "Cartridge weight exceeds 1 kg",
        "tests": "A12.12 weight limit validation"
      },
      {
        "id": 2,
        "alteration": "More than equipment need + 2 spare cartridges",
        "tests": "A12.14 cartridge limit"
      },
      {
        "id": 3,
        "alteration": "Key 17 shows \"A12.2\" instead of fuel cell paragraph",
        "tests": "Fuel cell specific packaging instruction"
      },
      {
        "id": 4,
        "alteration": "Fuel cells charging batteries during transport",
        "tests": "A12.13 charging prohibition"
      }
    ]
  },
  {
    "scenario": 12,
    "unNumber": "UN2987",
    "title": "A12.15 - CHLOROSILANES, CORROSIVE, N.O.S.",
    "packagingParagraph": "A12.15",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN2987",
      "PSN": "CHLOROSILANES, CORROSIVE, N.O.S.",
      "Hazard Class": "8",
      "Subsidiary Risk": "None",
      "Packing Group": "II",
      "Packaging Paragraph": "A12.15",
      "Special Provisions": "P4",
      "Technical Name Required": "Yes",
      "Physical State": "Liquid"
    },
    "expectedSddg": {
      "Key 7": "\"Cargo Aircraft Only\" (P4 provision)",
      "Key 11": "\"UN2987\"",
      "Key 12": "\"CHLOROSILANES, CORROSIVE, N.O.S. (contains dimethyldichlorosilane)\"",
      "Key 13": "\"8\"",
      "Key 14": "Empty",
      "Key 15": "\"II\"",
      "Key 16": "Net quantity + packaging (e.g., \"1 x 20L steel drum (1A1)\")",
      "Key 17": "\"A12.15\""
    },
    "expectedPackage": {
      "labels": [
        "CORROSIVE (Class 8)",
        "Cargo Aircraft Only (P4 requires CAO)",
        "Orientation labels (liquid)"
      ],
      "markings": [
        "UN2987 (12mm minimum height)",
        "PSN with technical name: \"CHLOROSILANES, CORROSIVE, N.O.S. (contains dimethyldichlorosilane)\"",
        "Military Shipping Label (MSL)",
        "Orientation arrows"
      ],
      "pop": {
        "allowedCodes": [
          "1A1",
          "3A1",
          "3HT",
          "6HA1",
          "8AL"
        ],
        "packingGroupCode": ""
      }
    },
    "alterations": [
      {
        "id": 1,
        "alteration": "Key 12 missing technical name for N.O.S.",
        "tests": "Technical name requirement"
      },
      {
        "id": 2,
        "alteration": "Package marking missing technical name",
        "tests": "N.O.S. marking requirement"
      },
      {
        "id": 3,
        "alteration": "Key 7 shows \"Passenger and Cargo Aircraft\"",
        "tests": "P4 requires CAO validation"
      },
      {
        "id": 4,
        "alteration": "Plastic single packaging (not composite)",
        "tests": "Chlorosilane packaging material restrictions"
      }
    ]
  }
];
