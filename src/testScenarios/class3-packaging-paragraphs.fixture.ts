// Auto-generated from class3-packaging-paragraphs.md. Do not edit by hand.
export type Class3ScenarioFixture = {
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

export const class3ScenarioFixtures: Class3ScenarioFixture[] = 
[
  {
    "scenario": 1,
    "unNumber": "UN1089",
    "title": "ACETALDEHYDE",
    "packagingParagraph": "A7.2",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN1089",
      "PSN": "ACETALDEHYDE",
      "Hazard Class": "3",
      "Subsidiary Risk": "None",
      "Packing Group": "I",
      "Packaging Paragraph": "A7.2.",
      "Special Provisions": "P3",
      "Technical Name Required": "No"
    },
    "expectedSddg": {
      "Key 7": "\"Cargo Aircraft Only\" (P3 = CAO only)",
      "Key 11": "\"UN1089\"",
      "Key 12": "\"ACETALDEHYDE\"",
      "Key 13": "\"3\"",
      "Key 14": "Empty (no subsidiary risk)",
      "Key 15": "\"I\"",
      "Key 16": "Net quantity + packaging (e.g., \"2 steel drums x 20 L\")",
      "Key 17": "\"A7.2\""
    },
    "expectedPackage": {
      "labels": [
        "FLAMMABLE LIQUID (Class 3) - primary hazard (A15.2.1)",
        "Cargo Aircraft Only (A15.3.1) - required for P3 materials"
      ],
      "markings": [
        "UN1089 (12mm minimum height for packages >30L) (A14.3.1)",
        "PSN: \"ACETALDEHYDE\" (12mm minimum height) (A14.3.1)",
        "Orientation arrows on two opposite sides (for combination packaging) (A14.3.6)",
        "Military Shipping Label (MSL) per MIL-STD-129 (A14.1.1)",
        "Flash point marking (A14.4.3.1)"
      ],
      "pop": {
        "allowedCodes": [
          "1A1",
          "1A2",
          "1B1",
          "1B2",
          "1D",
          "1G",
          "1H1",
          "1H2",
          "1N1",
          "1N2",
          "3A1",
          "3A2",
          "3B1",
          "3B2",
          "3H1",
          "3H2",
          "4A",
          "4B",
          "4C1",
          "4C2",
          "4D",
          "4F",
          "4G",
          "4H1",
          "4H2"
        ],
        "packingGroupCode": ""
      }
    },
    "alterations": [
      {
        "id": 1,
        "alteration": "POP marking shows packing group \"Y\" instead of \"X\"",
        "tests": "PG validation failure - PG I requires X only"
      },
      {
        "id": 2,
        "alteration": "Key 7 shows \"Passenger and Cargo\"",
        "tests": "Aircraft limitation violation - P3 requires CAO"
      },
      {
        "id": 3,
        "alteration": "Missing orientation arrows on package",
        "tests": "Orientation marking validation failure"
      },
      {
        "id": 4,
        "alteration": "Missing Cargo Aircraft Only label",
        "tests": "CAO label requirement violation"
      }
    ]
  },
  {
    "scenario": 2,
    "unNumber": "UN2251",
    "title": "BICYCLO[2,2,1] HEPTA-2,5-DIENE, STABILIZED",
    "packagingParagraph": "A7.3",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN2251",
      "PSN": "BICYCLO[2,2,1] HEPTA-2,5-DIENE, STABILIZED",
      "Hazard Class": "3",
      "Subsidiary Risk": "None",
      "Packing Group": "II",
      "Packaging Paragraph": "A7.3",
      "Special Provisions": "P5, 387",
      "Technical Name Required": "No"
    },
    "expectedSddg": {
      "Key 7": "\"Passenger and Cargo\" (P5)",
      "Key 11": "\"UN2251\"",
      "Key 12": "\"BICYCLO[2,2,1] HEPTA-2,5-DIENE, STABILIZED\"",
      "Key 13": "\"3\"",
      "Key 14": "Empty",
      "Key 15": "\"II\"",
      "Key 16": "Net quantity + packaging",
      "Key 17": "\"A7.3\""
    },
    "expectedPackage": {
      "labels": [
        "FLAMMABLE LIQUID (Class 3) - primary hazard (A15.2.1)"
      ],
      "markings": [
        "UN2251 (A14.3.1)",
        "PSN: \"BICYCLO[2,2,1] HEPTA-2,5-DIENE, STABILIZED\" (full chemical name) (A14.3.1)",
        "Orientation arrows on two opposite sides (A14.3.6)",
        "Military Shipping Label (MSL) (A14.1.1)"
      ],
      "pop": {
        "allowedCodes": [],
        "packingGroupCode": ""
      }
    },
    "alterations": [
      {
        "id": 1,
        "alteration": "Key 17 shows \"A7.2\" instead of \"A7.3\"",
        "tests": "Packaging paragraph mismatch"
      },
      {
        "id": 2,
        "alteration": "PSN missing \"STABILIZED\" qualifier",
        "tests": "PSN completeness validation failure"
      },
      {
        "id": 3,
        "alteration": "Missing FLAMMABLE LIQUID label",
        "tests": "Primary hazard label missing"
      }
    ]
  },
  {
    "scenario": 3,
    "unNumber": "UN3165",
    "title": "AIRCRAFT HYDRAULIC POWER UNIT FUEL TANK",
    "packagingParagraph": "A7.4",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN3165",
      "PSN": "AIRCRAFT HYDRAULIC POWER UNIT FUEL TANK",
      "Details": "containing a mixture of anhydrous hydrazine and monomethyl hydrazine; M86 fuel",
      "Hazard Class": "3",
      "Subsidiary Risk": "6.1, 8",
      "Packing Group": "I",
      "Packaging Paragraph": "A7.4.",
      "Special Provisions": "P3, A501",
      "Technical Name Required": "No"
    },
    "expectedSddg": {
      "Key 7": "\"Cargo Aircraft Only\" (P3 = CAO)",
      "Key 11": "\"UN3165\"",
      "Key 12": "\"AIRCRAFT HYDRAULIC POWER UNIT FUEL TANK\"",
      "Key 13": "\"3\"",
      "Key 14": "\"6.1, 8\" (both subsidiaries)",
      "Key 15": "\"I\"",
      "Key 16": "Net quantity + packaging (e.g., \"1 fuel tank unit x 42 L\")",
      "Key 17": "\"A7.4\""
    },
    "expectedPackage": {
      "labels": [
        "FLAMMABLE LIQUID (Class 3) - primary hazard (A15.2.1)",
        "TOXIC (Class 6.1) - first subsidiary (A15.4.5.1)",
        "CORROSIVE (Class 8) - second subsidiary (A15.4.7)",
        "Cargo Aircraft Only (A15.3.1)"
      ],
      "markings": [
        "UN3165 (A14.3.1)",
        "PSN: \"AIRCRAFT HYDRAULIC POWER UNIT FUEL TANK\" (A14.3.1)",
        "Military Shipping Label (MSL) (A14.1.1)"
      ],
      "pop": {
        "allowedCodes": [],
        "packingGroupCode": ""
      }
    },
    "alterations": [
      {
        "id": 1,
        "alteration": "Missing TOXIC subsidiary label",
        "tests": "Subsidiary hazard label missing"
      },
      {
        "id": 2,
        "alteration": "Missing CORROSIVE subsidiary label",
        "tests": "Second subsidiary hazard label missing"
      },
      {
        "id": 3,
        "alteration": "Key 14 shows only \"6.1\" (missing 8)",
        "tests": "Incomplete subsidiary risk"
      },
      {
        "id": 4,
        "alteration": "Key 17 shows \"A7.2\" instead of \"A7.4\"",
        "tests": "Packaging paragraph mismatch"
      },
      {
        "id": 5,
        "alteration": "POP marking shows \"Y\" instead of \"X\"",
        "tests": "PG I requires X only"
      }
    ]
  },
  {
    "scenario": 4,
    "unNumber": "UN3269",
    "title": "POLYESTER RESIN KIT",
    "packagingParagraph": "A7.6",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN3269",
      "PSN": "POLYESTER RESIN KIT",
      "Details": "liquid base material",
      "Hazard Class": "3",
      "Subsidiary Risk": "None",
      "Packing Group": "II (or III)",
      "Packaging Paragraph": "A7.6.",
      "Special Provisions": "P5",
      "Technical Name Required": "No"
    },
    "expectedSddg": {
      "Key 7": "\"Passenger and Cargo\" (P5)",
      "Key 11": "\"UN3269\"",
      "Key 12": "\"POLYESTER RESIN KIT\"",
      "Key 13": "\"3\"",
      "Key 14": "Empty",
      "Key 15": "\"II\" (or \"III\")",
      "Key 16": "**Aggregate quantity** (e.g., \"1 fiberboard box x 5 kg\")",
      "Key 17": "\"A7.6\""
    },
    "expectedPackage": {
      "labels": [
        "FLAMMABLE LIQUID (Class 3) - primary hazard (A15.2.1)"
      ],
      "markings": [
        "UN3269 (A14.3.1)",
        "PSN: \"POLYESTER RESIN KIT\" (A14.3.1)",
        "Orientation arrows on two opposite sides (A14.3.6)",
        "Military Shipping Label (MSL) (A14.1.1)"
      ],
      "pop": {
        "allowedCodes": [
          "1A2",
          "1B2",
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
        "packingGroupCode": "XorY"
      }
    },
    "alterations": [
      {
        "id": 1,
        "alteration": "Total quantity exceeds 5 kg for PG II",
        "tests": "Quantity limit exceeded"
      },
      {
        "id": 2,
        "alteration": "Key 16 shows individual component quantities instead of aggregate",
        "tests": "Quantity format error for KIT"
      },
      {
        "id": 3,
        "alteration": "Missing orientation arrows",
        "tests": "Orientation marking validation failure"
      }
    ]
  },
  {
    "scenario": 5,
    "unNumber": "UN3473",
    "title": "FUEL CELL CARTRIDGES",
    "packagingParagraph": "A7.7",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN3473",
      "PSN": "FUEL CELL CARTRIDGES",
      "Details": "containing flammable liquids",
      "Hazard Class": "3",
      "Subsidiary Risk": "None",
      "Packing Group": "II",
      "Packaging Paragraph": "A7.7., A7.8., A7.9.",
      "Special Provisions": "P5, 328",
      "Technical Name Required": "No"
    },
    "expectedSddg": {
      "Key 7": "\"Passenger and Cargo\" (P5)",
      "Key 11": "\"UN3473\"",
      "Key 12": "\"FUEL CELL CARTRIDGES\"",
      "Key 13": "\"3\"",
      "Key 14": "Empty",
      "Key 15": "\"II\"",
      "Key 16": "\"1 fiberboard box x [number] cartridges\"",
      "Key 17": "\"A7.7\""
    },
    "expectedPackage": {
      "labels": [
        "FLAMMABLE LIQUID (Class 3) - primary hazard (A15.2.1)"
      ],
      "markings": [
        "UN3473 (A14.3.1)",
        "PSN: \"FUEL CELL CARTRIDGES\" (A14.3.1)",
        "Military Shipping Label (MSL) (A14.1.1)"
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
        "packingGroupCode": "XorY"
      }
    },
    "alterations": [
      {
        "id": 1,
        "alteration": "Key 17 shows \"A7.2\" instead of \"A7.7\"",
        "tests": "Packaging paragraph mismatch"
      },
      {
        "id": 2,
        "alteration": "Missing FLAMMABLE LIQUID label",
        "tests": "Primary hazard label missing"
      },
      {
        "id": 3,
        "alteration": "POP marking shows \"Z\"",
        "tests": "PG II requires X or Y, not Z"
      }
    ]
  },
  {
    "scenario": 6,
    "unNumber": "UN3473",
    "title": "FUEL CELL CARTRIDGES CONTAINED IN EQUIPMENT",
    "packagingParagraph": "A7.8",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN3473",
      "PSN": "FUEL CELL CARTRIDGES CONTAINED IN EQUIPMENT",
      "Details": "containing flammable liquids",
      "Hazard Class": "3",
      "Subsidiary Risk": "None",
      "Packing Group": "II",
      "Packaging Paragraph": "A7.7., A7.8., A7.9.",
      "Special Provisions": "P5, 328",
      "Technical Name Required": "No"
    },
    "expectedSddg": {
      "Key 7": "\"Passenger and Cargo\" (P5)",
      "Key 11": "\"UN3473\"",
      "Key 12": "\"FUEL CELL CARTRIDGES CONTAINED IN EQUIPMENT\"",
      "Key 13": "\"3\"",
      "Key 14": "Empty",
      "Key 15": "\"II\"",
      "Key 16": "Description of equipment",
      "Key 17": "\"A7.8\""
    },
    "expectedPackage": {
      "labels": [
        "FLAMMABLE LIQUID (Class 3) - primary hazard (A15.2.1)"
      ],
      "markings": [
        "UN3473 (A14.3.1)",
        "PSN: \"FUEL CELL CARTRIDGES CONTAINED IN EQUIPMENT\" (A14.3.1)",
        "Military Shipping Label (MSL) (A14.1.1)"
      ],
      "pop": {
        "allowedCodes": [],
        "packingGroupCode": ""
      }
    },
    "alterations": [
      {
        "id": 1,
        "alteration": "Key 12 shows \"FUEL CELL CARTRIDGES\" (missing \"CONTAINED IN EQUIPMENT\")",
        "tests": "PSN mismatch"
      },
      {
        "id": 2,
        "alteration": "Missing FLAMMABLE LIQUID label",
        "tests": "Primary hazard label missing"
      }
    ]
  },
  {
    "scenario": 7,
    "unNumber": "UN3473",
    "title": "FUEL CELL CARTRIDGES PACKED WITH EQUIPMENT",
    "packagingParagraph": "A7.9",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN3473",
      "PSN": "FUEL CELL CARTRIDGES PACKED WITH EQUIPMENT",
      "Details": "containing flammable liquids",
      "Hazard Class": "3",
      "Subsidiary Risk": "None",
      "Packing Group": "II",
      "Packaging Paragraph": "A7.7., A7.8., A7.9.",
      "Special Provisions": "P5, 328",
      "Technical Name Required": "No"
    },
    "expectedSddg": {
      "Key 7": "\"Passenger and Cargo\" (P5)",
      "Key 11": "\"UN3473\"",
      "Key 12": "\"FUEL CELL CARTRIDGES PACKED WITH EQUIPMENT\"",
      "Key 13": "\"3\"",
      "Key 14": "Empty",
      "Key 15": "\"II\"",
      "Key 16": "Description (max cartridges = equipment need + 2 spares)",
      "Key 17": "\"A7.9\""
    },
    "expectedPackage": {
      "labels": [
        "FLAMMABLE LIQUID (Class 3) - primary hazard (A15.2.1)"
      ],
      "markings": [
        "UN3473 (A14.3.1)",
        "PSN: \"FUEL CELL CARTRIDGES PACKED WITH EQUIPMENT\" (A14.3.1)",
        "Military Shipping Label (MSL) (A14.1.1)"
      ],
      "pop": {
        "allowedCodes": [],
        "packingGroupCode": ""
      }
    },
    "alterations": [
      {
        "id": 1,
        "alteration": "Key 12 shows \"FUEL CELL CARTRIDGES\" (missing \"PACKED WITH EQUIPMENT\")",
        "tests": "PSN mismatch"
      },
      {
        "id": 2,
        "alteration": "Number of cartridges exceeds equipment need + 2",
        "tests": "Quantity exceeds limit"
      }
    ]
  },
  {
    "scenario": 8,
    "unNumber": "UN2985",
    "title": "CHLOROSILANES, FLAMMABLE, CORROSIVE, N.O.S.",
    "packagingParagraph": "A7.10",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN2985",
      "PSN": "CHLOROSILANES, FLAMMABLE, CORROSIVE, N.O.S.",
      "Hazard Class": "3",
      "Subsidiary Risk": "8",
      "Packing Group": "II",
      "Packaging Paragraph": "A7.10.",
      "Special Provisions": "P4",
      "Technical Name Required": "Yes (N.O.S. entry)"
    },
    "expectedSddg": {
      "Key 7": "\"Cargo Aircraft Only\" (P4 = CAO)",
      "Key 11": "\"UN2985\"",
      "Key 12": "\"CHLOROSILANES, FLAMMABLE, CORROSIVE, N.O.S. (contains [technical name])\"",
      "Key 13": "\"3\"",
      "Key 14": "\"8\"",
      "Key 15": "\"II\"",
      "Key 16": "Net quantity + packaging",
      "Key 17": "\"A7.10\""
    },
    "expectedPackage": {
      "labels": [
        "FLAMMABLE LIQUID (Class 3) - primary hazard (A15.2.1)",
        "CORROSIVE (Class 8) - subsidiary (A15.4.7)",
        "Cargo Aircraft Only (A15.3.1)"
      ],
      "markings": [
        "UN2985 (A14.3.1)",
        "PSN with technical name in parentheses (A14.3.1, A14.3.1.2)",
        "Orientation arrows on two opposite sides (A14.3.6)",
        "Military Shipping Label (MSL) (A14.1.1)"
      ],
      "pop": {
        "allowedCodes": [
          "1A1",
          "1A2",
          "1D",
          "1G",
          "1H2",
          "3A1",
          "4A",
          "4C1",
          "4C2",
          "4D",
          "4F",
          "4G",
          "4H1",
          "4H2",
          "6HA1"
        ],
        "packingGroupCode": "XorY"
      }
    },
    "alterations": [
      {
        "id": 1,
        "alteration": "Key 17 shows \"A7.2\" instead of \"A7.10\"",
        "tests": "Specialized packaging paragraph required"
      },
      {
        "id": 2,
        "alteration": "Key 7 shows \"Passenger and Cargo\"",
        "tests": "P4 requires Cargo Aircraft Only"
      },
      {
        "id": 3,
        "alteration": "Missing Cargo Aircraft Only label",
        "tests": "CAO label required for P4"
      },
      {
        "id": 4,
        "alteration": "Missing CORROSIVE subsidiary label",
        "tests": "Subsidiary hazard label missing"
      },
      {
        "id": 5,
        "alteration": "Technical name missing from Key 12",
        "tests": "N.O.S. requires technical name"
      },
      {
        "id": 6,
        "alteration": "POP marking shows aluminum packaging",
        "tests": "Aluminum not authorized for chlorosilanes"
      }
    ]
  },
  {
    "scenario": 9,
    "unNumber": "UN3528",
    "title": "ENGINE, INTERNAL COMBUSTION, FLAMMABLE LIQUID POWERED",
    "packagingParagraph": "A7.11",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN3528",
      "PSN": "ENGINE, INTERNAL COMBUSTION, FLAMMABLE LIQUID POWERED",
      "Hazard Class": "3",
      "Subsidiary Risk": "None",
      "Packing Group": "**None** (special article)",
      "Packaging Paragraph": "A7.11",
      "Special Provisions": "P5, 135, A87",
      "Technical Name Required": "No"
    },
    "expectedSddg": {
      "Key 7": "\"Passenger and Cargo\" (P5)",
      "Key 11": "\"UN3528\"",
      "Key 12": "\"ENGINE, INTERNAL COMBUSTION, FLAMMABLE LIQUID POWERED\"",
      "Key 13": "\"3\"",
      "Key 14": "Empty",
      "Key 15": "**Empty or \"N/A\"** (engines don't have packing groups)",
      "Key 16": "Description (e.g., \"1 gasoline engine\")",
      "Key 17": "\"A7.11\"",
      "Key 19": "Fuel type, hazard class, and net quantity (e.g., \"Gasoline, 3, 500 ml\")"
    },
    "expectedPackage": {
      "labels": [
        "FLAMMABLE LIQUID (Class 3) - **only if packaged/crated/enclosed** (A15.1.7)",
        "If unpackaged and readily identifiable: **no labels required**"
      ],
      "markings": [
        "UN3528 - **only if packaged/crated/enclosed** (A14.3.15)",
        "PSN: \"ENGINE, INTERNAL COMBUSTION, FLAMMABLE LIQUID POWERED\" - **only if enclosed**",
        "Military Shipping Label (MSL) (A14.1.1)",
        "If unpackaged and readily identifiable: **no markings required except MSL**"
      ],
      "pop": {
        "allowedCodes": [],
        "packingGroupCode": ""
      }
    },
    "alterations": [
      {
        "id": 1,
        "alteration": "Key 15 shows \"II\" (engines shouldn't have PG)",
        "tests": "Packing group not applicable for engines"
      },
      {
        "id": 2,
        "alteration": "Key 12 shows \"MACHINERY\" instead of \"ENGINE\"",
        "tests": "PSN precision (MACHINERY vs ENGINE distinction)"
      },
      {
        "id": 3,
        "alteration": "Missing FLAMMABLE LIQUID label when crated",
        "tests": "Label required when enclosed"
      },
      {
        "id": 4,
        "alteration": "Key 19 missing fuel quantity information",
        "tests": "Accessorial hazard info required"
      },
      {
        "id": 5,
        "alteration": "Fuel quantity exceeds 500 ml (standard engine)",
        "tests": "Fuel limitation exceeded"
      }
    ]
  },
  {
    "scenario": 10,
    "unNumber": "UN3540",
    "title": "ARTICLES CONTAINING FLAMMABLE LIQUID, N.O.S.",
    "packagingParagraph": "A7.12",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN3540",
      "PSN": "ARTICLES CONTAINING FLAMMABLE LIQUID, N.O.S.",
      "Hazard Class": "3",
      "Subsidiary Risk": "None",
      "Packing Group": "**None** (special article)",
      "Packaging Paragraph": "A7.12",
      "Special Provisions": "P5, 391",
      "Technical Name Required": "Yes (N.O.S. entry)"
    },
    "expectedSddg": {
      "Key 7": "\"Passenger and Cargo\" (P5)",
      "Key 11": "\"UN3540\"",
      "Key 12": "\"ARTICLES CONTAINING FLAMMABLE LIQUID, N.O.S. (contains [technical name])\"",
      "Key 13": "\"3\"",
      "Key 14": "Empty",
      "Key 15": "**Empty** (articles don't have packing groups)",
      "Key 16": "Description + net quantity (max 60 L per package)",
      "Key 17": "\"A7.12\""
    },
    "expectedPackage": {
      "labels": [
        "FLAMMABLE LIQUID (Class 3) - primary hazard (A15.2.1)"
      ],
      "markings": [
        "UN3540 (A14.3.1)",
        "PSN with technical name in parentheses (A14.3.1, A14.3.1.2)",
        "Military Shipping Label (MSL) (A14.1.1)",
        "If unpackaged: display PSN and UN number on item itself, cradle, handling/storage/launching device (A14.3.1.1)"
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
        "alteration": "Technical name missing from Key 12",
        "tests": "N.O.S. requires technical name"
      },
      {
        "id": 2,
        "alteration": "Net quantity exceeds 60 L per package",
        "tests": "Quantity limit exceeded"
      },
      {
        "id": 3,
        "alteration": "Missing FLAMMABLE LIQUID label",
        "tests": "Primary hazard label missing"
      },
      {
        "id": 4,
        "alteration": "Key 15 shows \"II\"",
        "tests": "Packing group not applicable for articles"
      },
      {
        "id": 5,
        "alteration": "Unpackaged article missing UN number marking",
        "tests": "Marking required per A14.3.1.1"
      }
    ]
  }
];
