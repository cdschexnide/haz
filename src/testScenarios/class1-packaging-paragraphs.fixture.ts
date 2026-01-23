// Auto-generated from class1-packaging-paragraphs.md. Do not edit by hand.
export type Class1ScenarioFixture = {
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

export const class1ScenarioFixtures: Class1ScenarioFixture[] = 
[
  {
    "scenario": 1,
    "unNumber": "UN0224",
    "title": "BARIUM AZIDE",
    "packagingParagraph": "A5.4",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN0224",
      "PSN": "BARIUM AZIDE, dry or wetted with less than 50% water, by mass",
      "Hazard Class": "1.1A",
      "Packaging Paragraph": "A5.4",
      "Special Provisions": "P3, 111, 117",
      "Subsidiary Risk": "6.1 (Toxic)"
    },
    "expectedSddg": {
      "Key": "Expected Value",
      "Key 7": "\"Cargo Aircraft Only\" (P3 requires CAO)",
      "Key 11": "\"UN0224\"",
      "Key 12": "\"BARIUM AZIDE, dry or wetted with less than 50% water, by mass\"",
      "Key 13": "\"1.1A\"",
      "Key 14": "\"6.1\" (Toxic subsidiary risk)",
      "Key 15": "Empty (Class 1)",
      "Key 16": "Net quantity + packaging + NEW (e.g., \"1 steel drum (1A2) x 0.5 kg NEW\")",
      "Key 17": "\"A5.4\""
    },
    "expectedPackage": {
      "labels": [
        "EXPLOSIVE 1.1 with compatibility group A",
        "TOXIC 6.1 (subsidiary)",
        "Cargo Aircraft Only"
      ],
      "markings": [
        "UN0224",
        "PSN: \"BARIUM AZIDE, dry or wetted with less than 50% water, by mass\"",
        "EX number",
        "Military Shipping Label (MSL)"
      ],
      "pop": {
        "allowedCodes": [
          "1A1",
          "1A2",
          "1H1",
          "1H2",
          "1N1",
          "1N2",
          "4C2",
          "4D",
          "4F"
        ],
        "packingGroupCode": "XorY"
      }
    },
    "alterations": [
      {
        "id": 1,
        "alteration": "Missing TOXIC 6.1 subsidiary label",
        "tests": "Subsidiary hazard label validation"
      },
      {
        "id": 2,
        "alteration": "Key 14 left empty when subsidiary risk exists",
        "tests": "SDDG subsidiary risk validation"
      },
      {
        "id": 3,
        "alteration": "POP marking shows \"4G\" (not authorized for A5.4)",
        "tests": "Packaging code validation for wetted primaries"
      },
      {
        "id": 4,
        "alteration": "POP marking shows packing group \"Z\"",
        "tests": "PG validation (Class 1 requires X or Y)"
      }
    ]
  },
  {
    "scenario": 2,
    "unNumber": "UN0343",
    "title": "NITROCELLULOSE, PLASTICIZED",
    "packagingParagraph": "A5.5",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN0343",
      "PSN": "NITROCELLULOSE, PLASTICIZED with not less than 18% plasticizing substance, by mass",
      "Hazard Class": "1.3C",
      "Packaging Paragraph": "A5.5",
      "Special Provisions": "P4",
      "Subsidiary Risk": "None"
    },
    "expectedSddg": {
      "Key": "Expected Value",
      "Key 7": "\"Cargo Aircraft Only\" (P4 requires CAO)",
      "Key 11": "\"UN0343\"",
      "Key 12": "\"NITROCELLULOSE, PLASTICIZED with not less than 18% plasticizing substance, by mass\"",
      "Key 13": "\"1.3C\"",
      "Key 14": "Empty",
      "Key 15": "Empty",
      "Key 16": "Net quantity + packaging + NEW (e.g., \"2 fiberboard boxes (4G) x 5 kg NEW\")",
      "Key 17": "\"A5.5\""
    },
    "expectedPackage": {
      "labels": [
        "EXPLOSIVE 1.3 with compatibility group C",
        "Cargo Aircraft Only"
      ],
      "markings": [
        "UN0343",
        "PSN: \"NITROCELLULOSE, PLASTICIZED with not less than 18% plasticizing substance, by mass\"",
        "EX number",
        "Military Shipping Label (MSL)"
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
        "alteration": "Key 12 shows \"NITROCELLULOSE\" without plasticizing percentage",
        "tests": "PSN completeness validation"
      },
      {
        "id": 2,
        "alteration": "Label shows \"1.1C\" instead of \"1.3C\"",
        "tests": "Division validation"
      },
      {
        "id": 3,
        "alteration": "Missing CAO label despite P4 requirement",
        "tests": "CAO label validation"
      },
      {
        "id": 4,
        "alteration": "Key 17 shows \"A5.9\" instead of \"A5.5\"",
        "tests": "Packaging instruction validation"
      }
    ]
  },
  {
    "scenario": 3,
    "unNumber": "UN0483",
    "title": "CYCLOTRIMETHYLENETRINITRAMINE (RDX), DESENSITIZED",
    "packagingParagraph": "A5.6",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN0483",
      "PSN": "CYCLOTRIMETHYLENETRINITRAMINE (RDX), DESENSITIZED",
      "Hazard Class": "1.1D",
      "Packaging Paragraph": "A5.6",
      "Special Provisions": "P4",
      "Subsidiary Risk": "None"
    },
    "expectedSddg": {
      "Key": "Expected Value",
      "Key 7": "\"Cargo Aircraft Only\"",
      "Key 11": "\"UN0483\"",
      "Key 12": "\"CYCLOTRIMETHYLENETRINITRAMINE (RDX), DESENSITIZED\"",
      "Key 13": "\"1.1D\"",
      "Key 14": "Empty",
      "Key 15": "Empty",
      "Key 16": "Net quantity + packaging + NEW (e.g., \"1 fiberboard box (4G) x 10 kg NEW\")",
      "Key 17": "\"A5.6\""
    },
    "expectedPackage": {
      "labels": [
        "EXPLOSIVE 1.1 with compatibility group D",
        "Cargo Aircraft Only"
      ],
      "markings": [
        "UN0483",
        "PSN: \"CYCLOTRIMETHYLENETRINITRAMINE (RDX), DESENSITIZED\"",
        "EX number",
        "Military Shipping Label (MSL)"
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
          "4A",
          "4B",
          "4C1",
          "4C2",
          "4D",
          "4F",
          "4G",
          "4H1",
          "4H2",
          "4N",
          "5H2",
          "5H3",
          "5H4",
          "5L2",
          "5L3",
          "5M2"
        ],
        "packingGroupCode": "XorY"
      }
    },
    "alterations": [
      {
        "id": 1,
        "alteration": "PSN abbreviated to \"RDX, DESENSITIZED\" without full chemical name",
        "tests": "PSN completeness"
      },
      {
        "id": 2,
        "alteration": "POP marking shows \"3A1\" (jerrican - not authorized for A5.6)",
        "tests": "Packaging code validation"
      },
      {
        "id": 3,
        "alteration": "Key 16 missing \"NEW\" designation",
        "tests": "Explosive quantity format validation"
      },
      {
        "id": 4,
        "alteration": "Package shows \"CYCLONITE\" without \"RDX\"",
        "tests": "PSN technical name validation"
      }
    ]
  },
  {
    "scenario": 4,
    "unNumber": "UN0222",
    "title": "AMMONIUM NITRATE",
    "packagingParagraph": "A5.7",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN0222",
      "PSN": "AMMONIUM NITRATE with more than 0.2% combustible substances, including any organic substance calculated as carbon, to the exclusion of any other added substance",
      "Hazard Class": "1.1D",
      "Packaging Paragraph": "A5.7",
      "Special Provisions": "P4, A69",
      "Subsidiary Risk": "None"
    },
    "expectedSddg": {
      "Key": "Expected Value",
      "Key 7": "\"Cargo Aircraft Only\"",
      "Key 11": "\"UN0222\"",
      "Key 12": "\"AMMONIUM NITRATE with more than 0.2% combustible substances...\" (full PSN)",
      "Key 13": "\"1.1D\"",
      "Key 14": "Empty",
      "Key 15": "Empty",
      "Key 16": "Net quantity + packaging + NEW",
      "Key 17": "\"A5.7\""
    },
    "expectedPackage": {
      "labels": [
        "EXPLOSIVE 1.1 with compatibility group D",
        "Cargo Aircraft Only"
      ],
      "markings": [
        "UN0222",
        "PSN: Full proper shipping name",
        "EX number",
        "Military Shipping Label (MSL)"
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
          "4A",
          "4B",
          "4C1",
          "4C2",
          "4D",
          "4F",
          "4G",
          "4H1",
          "4H2",
          "4N",
          "5H2",
          "5H3",
          "5H4",
          "5L2",
          "5L3",
          "5M2"
        ],
        "packingGroupCode": "XorY"
      }
    },
    "alterations": [
      {
        "id": 1,
        "alteration": "Key 12 shows just \"AMMONIUM NITRATE\" without combustible substance qualifier",
        "tests": "PSN completeness"
      },
      {
        "id": 2,
        "alteration": "Label shows compatibility group \"E\" instead of \"D\"",
        "tests": "Compatibility group validation"
      },
      {
        "id": 3,
        "alteration": "POP marking missing entirely",
        "tests": "UN specification marking validation"
      },
      {
        "id": 4,
        "alteration": "Key 17 shows \"A5.2\" instead of \"A5.7\"",
        "tests": "Packaging paragraph validation"
      }
    ]
  },
  {
    "scenario": 5,
    "unNumber": "UN0027",
    "title": "BLACK POWDER (GUNPOWDER)",
    "packagingParagraph": "A5.8",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN0027",
      "PSN": "BLACK POWDER (GUNPOWDER), granular or as a meal",
      "Hazard Class": "1.1D",
      "Packaging Paragraph": "A5.8",
      "Special Provisions": "P4",
      "Subsidiary Risk": "None"
    },
    "expectedSddg": {
      "Key": "Expected Value",
      "Key 7": "\"Cargo Aircraft Only\"",
      "Key 11": "\"UN0027\"",
      "Key 12": "\"BLACK POWDER (GUNPOWDER), granular or as a meal\"",
      "Key 13": "\"1.1D\"",
      "Key 14": "Empty",
      "Key 15": "Empty",
      "Key 16": "Net quantity + packaging + NEW (e.g., \"2 wooden boxes (4C1) x 4.5 kg NEW\")",
      "Key 17": "\"A5.8\""
    },
    "expectedPackage": {
      "labels": [
        "EXPLOSIVE 1.1 with compatibility group D",
        "Cargo Aircraft Only"
      ],
      "markings": [
        "UN0027",
        "PSN: \"BLACK POWDER (GUNPOWDER), granular or as a meal\"",
        "EX number",
        "Military Shipping Label (MSL)"
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
        "alteration": "Key 12 missing \"(GUNPOWDER)\" qualifier",
        "tests": "PSN completeness validation"
      },
      {
        "id": 2,
        "alteration": "POP marking shows \"4H1\" (expanded plastic - not authorized for A5.8)",
        "tests": "Packaging code validation"
      },
      {
        "id": 3,
        "alteration": "MSL missing from package",
        "tests": "Military Shipping Label check"
      },
      {
        "id": 4,
        "alteration": "Key 16 shows quantity in pounds only without metric",
        "tests": "Metric requirement (Key 16.4.2)"
      }
    ]
  },
  {
    "scenario": 6,
    "unNumber": "UN0132",
    "title": "DEFLAGRATING METAL SALTS OF AROMATIC NITRODERIVATIVES, N.O.S.",
    "packagingParagraph": "A5.9",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN0132",
      "PSN": "DEFLAGRATING METAL SALTS OF AROMATIC NITRODERIVATIVES, N.O.S.",
      "Technical Name": "(specify actual compound, e.g., Sodium Picramate)",
      "Hazard Class": "1.3C",
      "Packaging Paragraph": "A5.9",
      "Special Provisions": "P4",
      "Subsidiary Risk": "None"
    },
    "expectedSddg": {
      "Key": "Expected Value",
      "Key 7": "\"Cargo Aircraft Only\"",
      "Key 11": "\"UN0132\"",
      "Key 12": "\"DEFLAGRATING METAL SALTS OF AROMATIC NITRODERIVATIVES, N.O.S. (Sodium Picramate)\"",
      "Key 13": "\"1.3C\"",
      "Key 14": "Empty",
      "Key 15": "Empty",
      "Key 16": "Net quantity + packaging + NEW",
      "Key 17": "\"A5.9\""
    },
    "expectedPackage": {
      "labels": [
        "EXPLOSIVE 1.3 with compatibility group C",
        "Cargo Aircraft Only"
      ],
      "markings": [
        "UN0132",
        "PSN: \"DEFLAGRATING METAL SALTS OF AROMATIC NITRODERIVATIVES, N.O.S. (Sodium Picramate)\" with technical name in parentheses",
        "EX number",
        "Military Shipping Label (MSL)"
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
          "4A",
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
        "alteration": "Key 12 shows N.O.S. entry without technical name in parentheses",
        "tests": "N.O.S. technical name requirement"
      },
      {
        "id": 2,
        "alteration": "Package marking shows technical name but not in parentheses",
        "tests": "Technical name format"
      },
      {
        "id": 3,
        "alteration": "Label shows \"1.1C\" instead of \"1.3C\"",
        "tests": "Division validation"
      },
      {
        "id": 4,
        "alteration": "POP marking shows \"4B\" (aluminum - may have lead content issues)",
        "tests": "Special packaging restriction"
      }
    ]
  },
  {
    "scenario": 7,
    "unNumber": "UN0143",
    "title": "NITROGLYCERIN, DESENSITIZED",
    "packagingParagraph": "A5.10",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN0143",
      "PSN": "NITROGLYCERIN, DESENSITIZED with not less than 40% non-volatile water insoluble phlegmatizer, by mass",
      "Hazard Class": "1.1D",
      "Packaging Paragraph": "A5.10",
      "Special Provisions": "P4",
      "Subsidiary Risk": "6.1 (Toxic)"
    },
    "expectedSddg": {
      "Key": "Expected Value",
      "Key 7": "\"Cargo Aircraft Only\"",
      "Key 11": "\"UN0143\"",
      "Key 12": "\"NITROGLYCERIN, DESENSITIZED with not less than 40% non-volatile water insoluble phlegmatizer, by mass\"",
      "Key 13": "\"1.1D\"",
      "Key 14": "\"6.1\" (Toxic)",
      "Key 15": "Empty",
      "Key 16": "Net quantity + packaging + NEW (max 30 kg for boxes, 120 L for drums)",
      "Key 17": "\"A5.10\""
    },
    "expectedPackage": {
      "labels": [
        "EXPLOSIVE 1.1 with compatibility group D",
        "TOXIC 6.1 (subsidiary)",
        "Cargo Aircraft Only"
      ],
      "markings": [
        "UN0143",
        "PSN: Full proper shipping name with phlegmatizer percentage",
        "EX number",
        "Military Shipping Label (MSL)"
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
          "4C1",
          "4C2",
          "4D",
          "4F",
          "4G",
          "6HA1"
        ],
        "packingGroupCode": "XorY"
      }
    },
    "alterations": [
      {
        "id": 1,
        "alteration": "Missing TOXIC 6.1 subsidiary label",
        "tests": "Subsidiary label validation"
      },
      {
        "id": 2,
        "alteration": "Key 14 empty when subsidiary risk exists",
        "tests": "SDDG subsidiary risk validation"
      },
      {
        "id": 3,
        "alteration": "POP marking shows \"1B1\" (aluminum drum - not authorized for liquid nitro)",
        "tests": "Packaging code restriction"
      },
      {
        "id": 4,
        "alteration": "Key 12 missing phlegmatizer percentage",
        "tests": "PSN completeness for desensitized explosives"
      }
    ]
  },
  {
    "scenario": 8,
    "unNumber": "NA0331",
    "title": "AMMONIUM NITRATE-FUEL OIL MIXTURE (ANFO)",
    "packagingParagraph": "A5.11",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "NA0331",
      "PSN": "AMMONIUM NITRATE-FUEL OIL MIXTURE containing only prilled ammonium nitrate and fuel oil",
      "Hazard Class": "1.5D",
      "Packaging Paragraph": "A5.11",
      "Special Provisions": "P4",
      "Subsidiary Risk": "None"
    },
    "expectedSddg": {
      "Key": "Expected Value",
      "Key 7": "\"Cargo Aircraft Only\"",
      "Key 11": "\"NA0331\" (Note: NA prefix, not UN)",
      "Key 12": "\"AMMONIUM NITRATE-FUEL OIL MIXTURE containing only prilled ammonium nitrate and fuel oil\"",
      "Key 13": "\"1.5D\"",
      "Key 14": "Empty",
      "Key 15": "Empty",
      "Key 16": "Net quantity + packaging + NEW",
      "Key 17": "\"A5.11\""
    },
    "expectedPackage": {
      "labels": [
        "EXPLOSIVE 1.5 with compatibility group D",
        "Cargo Aircraft Only"
      ],
      "markings": [
        "NA0331",
        "PSN: Full proper shipping name",
        "EX number",
        "Military Shipping Label (MSL)"
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
          "3H1",
          "3H2",
          "4A",
          "4B",
          "4C1",
          "4C2",
          "4D",
          "4F",
          "4G",
          "4H2",
          "4N",
          "5H1",
          "5H2",
          "5H3",
          "5H4",
          "5L2",
          "5L3",
          "5M2"
        ],
        "packingGroupCode": "XorY"
      }
    },
    "alterations": [
      {
        "id": 1,
        "alteration": "Key 11 shows \"UN0331\" instead of \"NA0331\"",
        "tests": "ID number prefix validation"
      },
      {
        "id": 2,
        "alteration": "Label shows \"EXPLOSIVE 1.1D\" instead of \"1.5D\"",
        "tests": "Division validation (1.5 is very insensitive)"
      },
      {
        "id": 3,
        "alteration": "Key 13 shows \"1.5\" without compatibility group \"D\"",
        "tests": "Compatibility group completeness"
      },
      {
        "id": 4,
        "alteration": "POP marking shows PG code \"Z\"",
        "tests": "Packing group validation"
      }
    ]
  },
  {
    "scenario": 9,
    "unNumber": "UN0171",
    "title": "AMMUNITION, ILLUMINATING",
    "packagingParagraph": "A5.12",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN0171",
      "PSN": "AMMUNITION, ILLUMINATING with or without burster, expelling charge, or propelling charge",
      "Hazard Class": "1.2G",
      "Packaging Paragraph": "A5.12",
      "Special Provisions": "P4",
      "Subsidiary Risk": "None"
    },
    "expectedSddg": {
      "Key": "Expected Value",
      "Key 7": "\"Cargo Aircraft Only\"",
      "Key 11": "\"UN0171\"",
      "Key 12": "\"AMMUNITION, ILLUMINATING with or without burster, expelling charge, or propelling charge\"",
      "Key 13": "\"1.2G\" (may include DOD IBD on separate line)",
      "Key 14": "Empty",
      "Key 15": "Empty",
      "Key 16": "Net quantity + packaging + NEW",
      "Key 17": "\"A5.12\""
    },
    "expectedPackage": {
      "labels": [
        "EXPLOSIVE 1.2 with compatibility group G",
        "Cargo Aircraft Only"
      ],
      "markings": [
        "UN0171",
        "PSN: \"AMMUNITION, ILLUMINATING with or without burster, expelling charge, or propelling charge\"",
        "EX number",
        "Military Shipping Label (MSL)"
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
        "alteration": "Label shows \"1.3G\" instead of \"1.2G\"",
        "tests": "Division validation"
      },
      {
        "id": 2,
        "alteration": "Key 16 missing NEW (Net Explosive Weight)",
        "tests": "Quantity validation for explosives"
      },
      {
        "id": 3,
        "alteration": "PSN abbreviated to \"AMMO, ILLUM\"",
        "tests": "PSN abbreviation validation"
      },
      {
        "id": 4,
        "alteration": "Key 17 shows \"A5.18\" instead of \"A5.12\"",
        "tests": "Packaging paragraph validation"
      }
    ]
  },
  {
    "scenario": 10,
    "unNumber": "UN0030",
    "title": "DETONATORS, ELECTRIC",
    "packagingParagraph": "A5.13",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN0030",
      "PSN": "DETONATORS, ELECTRIC for blasting",
      "Hazard Class": "1.1B",
      "Packaging Paragraph": "A5.13",
      "Special Provisions": "P4, A69",
      "Subsidiary Risk": "None"
    },
    "expectedSddg": {
      "Key": "Expected Value",
      "Key 7": "\"Cargo Aircraft Only\"",
      "Key 11": "\"UN0030\"",
      "Key 12": "\"DETONATORS, ELECTRIC for blasting\"",
      "Key 13": "\"1.1B\"",
      "Key 14": "Empty",
      "Key 15": "Empty",
      "Key 16": "Net quantity + packaging + NEW",
      "Key 17": "\"A5.13\""
    },
    "expectedPackage": {
      "labels": [
        "EXPLOSIVE 1.1 with compatibility group B",
        "Cargo Aircraft Only"
      ],
      "markings": [
        "UN0030",
        "PSN: \"DETONATORS, ELECTRIC for blasting\"",
        "EX number",
        "Military Shipping Label (MSL)"
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
        "alteration": "Key 13 shows \"1.4B\" instead of \"1.1B\"",
        "tests": "Division validation (significant safety difference)"
      },
      {
        "id": 2,
        "alteration": "Missing compatibility group \"B\" on label",
        "tests": "Compatibility group validation"
      },
      {
        "id": 3,
        "alteration": "EX number missing from package",
        "tests": "EX number validation"
      },
      {
        "id": 4,
        "alteration": "POP marking shows \"4H1\" (expanded plastic - not authorized for A5.13)",
        "tests": "Packaging code validation"
      }
    ]
  },
  {
    "scenario": 11,
    "unNumber": "UN0360",
    "title": "DETONATOR ASSEMBLIES, NON-ELECTRIC",
    "packagingParagraph": "A5.14",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN0360",
      "PSN": "DETONATOR ASSEMBLIES, NON-ELECTRIC for blasting",
      "Hazard Class": "1.1B",
      "Packaging Paragraph": "A5.14",
      "Special Provisions": "P4, A69",
      "Subsidiary Risk": "None"
    },
    "expectedSddg": {
      "Key": "Expected Value",
      "Key 7": "\"Cargo Aircraft Only\"",
      "Key 11": "\"UN0360\"",
      "Key 12": "\"DETONATOR ASSEMBLIES, NON-ELECTRIC for blasting\"",
      "Key 13": "\"1.1B\"",
      "Key 14": "Empty",
      "Key 15": "Empty",
      "Key 16": "Net quantity + packaging + NEW",
      "Key 17": "\"A5.14\""
    },
    "expectedPackage": {
      "labels": [
        "EXPLOSIVE 1.1 with compatibility group B",
        "Cargo Aircraft Only"
      ],
      "markings": [
        "UN0360",
        "PSN: \"DETONATOR ASSEMBLIES, NON-ELECTRIC for blasting\"",
        "EX number",
        "Military Shipping Label (MSL)"
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
        "alteration": "Key 12 shows \"DETONATORS, NON-ELECTRIC\" missing \"ASSEMBLIES\"",
        "tests": "PSN completeness"
      },
      {
        "id": 2,
        "alteration": "Package labeled with \"1.4B\" instead of \"1.1B\"",
        "tests": "Division validation"
      },
      {
        "id": 3,
        "alteration": "Key 17 shows \"A5.13\" instead of \"A5.14\"",
        "tests": "Packaging paragraph validation"
      },
      {
        "id": 4,
        "alteration": "MSL missing from package",
        "tests": "Military Shipping Label check"
      }
    ]
  },
  {
    "scenario": 12,
    "unNumber": "UN0042",
    "title": "BOOSTERS without detonator",
    "packagingParagraph": "A5.15",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN0042",
      "PSN": "BOOSTERS without detonator",
      "Hazard Class": "1.1D",
      "Packaging Paragraph": "A5.15",
      "Special Provisions": "P4",
      "Subsidiary Risk": "None"
    },
    "expectedSddg": {
      "Key": "Expected Value",
      "Key 7": "\"Cargo Aircraft Only\"",
      "Key 11": "\"UN0042\"",
      "Key 12": "\"BOOSTERS without detonator\"",
      "Key 13": "\"1.1D\"",
      "Key 14": "Empty",
      "Key 15": "Empty",
      "Key 16": "Net quantity + packaging + NEW",
      "Key 17": "\"A5.15\""
    },
    "expectedPackage": {
      "labels": [
        "EXPLOSIVE 1.1 with compatibility group D",
        "Cargo Aircraft Only"
      ],
      "markings": [
        "UN0042",
        "PSN: \"BOOSTERS without detonator\"",
        "EX number",
        "Military Shipping Label (MSL)"
      ],
      "pop": {
        "allowedCodes": [
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
        "alteration": "POP marking shows \"1A2\" (drum - drums not authorized for A5.15)",
        "tests": "Packaging code validation (boxes only)"
      },
      {
        "id": 2,
        "alteration": "Key 12 shows \"BOOSTERS\" without \"without detonator\" qualifier",
        "tests": "PSN completeness (safety-critical distinction)"
      },
      {
        "id": 3,
        "alteration": "Label shows \"1.1B\" instead of \"1.1D\"",
        "tests": "Compatibility group validation"
      },
      {
        "id": 4,
        "alteration": "POP marking shows packing group \"Z\"",
        "tests": "PG validation"
      }
    ]
  },
  {
    "scenario": 13,
    "unNumber": "UN0225",
    "title": "BOOSTERS WITH DETONATOR",
    "packagingParagraph": "A5.16",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN0225",
      "PSN": "BOOSTERS WITH DETONATOR",
      "Hazard Class": "1.1B",
      "Packaging Paragraph": "A5.16",
      "Special Provisions": "P4, 115",
      "Subsidiary Risk": "None"
    },
    "expectedSddg": {
      "Key": "Expected Value",
      "Key 7": "\"Cargo Aircraft Only\"",
      "Key 11": "\"UN0225\"",
      "Key 12": "\"BOOSTERS WITH DETONATOR\"",
      "Key 13": "\"1.1B\"",
      "Key 14": "Empty",
      "Key 15": "Empty",
      "Key 16": "Net quantity + packaging + NEW",
      "Key 17": "\"A5.16\""
    },
    "expectedPackage": {
      "labels": [
        "EXPLOSIVE 1.1 with compatibility group B",
        "Cargo Aircraft Only"
      ],
      "markings": [
        "UN0225",
        "PSN: \"BOOSTERS WITH DETONATOR\"",
        "EX number",
        "Military Shipping Label (MSL)"
      ],
      "pop": {
        "allowedCodes": [
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
        "alteration": "Key 12 shows \"BOOSTERS\" without \"WITH DETONATOR\"",
        "tests": "PSN completeness (critical safety distinction from UN0042)"
      },
      {
        "id": 2,
        "alteration": "POP marking shows \"1G\" (fiberboard drum - drums not authorized)",
        "tests": "Packaging code validation"
      },
      {
        "id": 3,
        "alteration": "Label shows compatibility group \"D\" instead of \"B\"",
        "tests": "Compatibility group validation"
      },
      {
        "id": 4,
        "alteration": "Key 17 shows \"A5.15\" instead of \"A5.16\"",
        "tests": "Packaging paragraph validation"
      }
    ]
  },
  {
    "scenario": 14,
    "unNumber": "UN0277",
    "title": "CARTRIDGES, OIL WELL",
    "packagingParagraph": "A5.17",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN0277",
      "PSN": "CARTRIDGES, OIL WELL",
      "Hazard Class": "1.3C",
      "Packaging Paragraph": "A5.17",
      "Special Provisions": "P4, A69",
      "Subsidiary Risk": "None"
    },
    "expectedSddg": {
      "Key": "Expected Value",
      "Key 7": "\"Cargo Aircraft Only\"",
      "Key 11": "\"UN0277\"",
      "Key 12": "\"CARTRIDGES, OIL WELL\"",
      "Key 13": "\"1.3C\"",
      "Key 14": "Empty",
      "Key 15": "Empty",
      "Key 16": "Net quantity + packaging + NEW",
      "Key 17": "\"A5.17\""
    },
    "expectedPackage": {
      "labels": [
        "EXPLOSIVE 1.3 with compatibility group C",
        "Cargo Aircraft Only"
      ],
      "markings": [
        "UN0277",
        "PSN: \"CARTRIDGES, OIL WELL\"",
        "EX number",
        "Military Shipping Label (MSL)"
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
        "alteration": "Label shows \"1.4C\" instead of \"1.3C\"",
        "tests": "Division validation"
      },
      {
        "id": 2,
        "alteration": "Key 12 abbreviated to \"CART, OIL WELL\"",
        "tests": "PSN abbreviation validation"
      },
      {
        "id": 3,
        "alteration": "POP marking shows \"3A1\" (jerrican - not authorized for A5.17)",
        "tests": "Packaging code validation"
      },
      {
        "id": 4,
        "alteration": "EX number missing from package",
        "tests": "EX number validation"
      }
    ]
  },
  {
    "scenario": 15,
    "unNumber": "UN0507",
    "title": "SIGNALS, SMOKE",
    "packagingParagraph": "A5.18",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN0507",
      "PSN": "SIGNALS, SMOKE",
      "Hazard Class": "1.4S",
      "Packaging Paragraph": "A5.18",
      "Special Provisions": "P5",
      "Subsidiary Risk": "None"
    },
    "expectedSddg": {
      "Key": "Expected Value",
      "Key 7": "\"Passenger and Cargo Aircraft\" (P5 allows passenger aircraft)",
      "Key 11": "\"UN0507\"",
      "Key 12": "\"SIGNALS, SMOKE\"",
      "Key 13": "\"1.4S\"",
      "Key 14": "Empty",
      "Key 15": "Empty",
      "Key 16": "Net quantity + packaging",
      "Key 17": "\"A5.18\""
    },
    "expectedPackage": {
      "labels": [
        "EXPLOSIVE 1.4 with compatibility group S (minimal hazard)",
        "NO Cargo Aircraft Only label (P5 allows passenger)"
      ],
      "markings": [
        "UN0507",
        "PSN: \"SIGNALS, SMOKE\"",
        "EX number",
        "Military Shipping Label (MSL)"
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
        "alteration": "Key 7 shows \"Cargo Aircraft Only\" when P5 allows passenger",
        "tests": "Aircraft limitation validation (overly restrictive)"
      },
      {
        "id": 2,
        "alteration": "Label shows \"1.4G\" instead of \"1.4S\"",
        "tests": "Compatibility group validation (S is unique minimal hazard)"
      },
      {
        "id": 3,
        "alteration": "Package labeled as CAO when material is P5",
        "tests": "Label/SDDG consistency"
      },
      {
        "id": 4,
        "alteration": "Key 13 shows \"1.4\" without \"S\" compatibility group",
        "tests": "Compatibility group completeness"
      }
    ]
  },
  {
    "scenario": 16,
    "unNumber": "UN0379",
    "title": "CASES, CARTRIDGE, EMPTY WITH PRIMER",
    "packagingParagraph": "A5.19",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN0379",
      "PSN": "CASES, CARTRIDGE, EMPTY WITH PRIMER",
      "Hazard Class": "1.4C",
      "Packaging Paragraph": "A5.19",
      "Special Provisions": "P5, A69",
      "Subsidiary Risk": "None"
    },
    "expectedSddg": {
      "Key": "Expected Value",
      "Key 7": "\"Passenger and Cargo Aircraft\" (P5 allows passenger)",
      "Key 11": "\"UN0379\"",
      "Key 12": "\"CASES, CARTRIDGE, EMPTY WITH PRIMER\"",
      "Key 13": "\"1.4C\"",
      "Key 14": "Empty",
      "Key 15": "Empty",
      "Key 16": "Net quantity + packaging",
      "Key 17": "\"A5.19\""
    },
    "expectedPackage": {
      "labels": [
        "EXPLOSIVE 1.4 with compatibility group C",
        "NO Cargo Aircraft Only label (P5 allows passenger)"
      ],
      "markings": [
        "UN0379",
        "PSN: \"CASES, CARTRIDGE, EMPTY WITH PRIMER\"",
        "EX number",
        "Military Shipping Label (MSL)"
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
        "alteration": "Key 12 shows \"CASES, CARTRIDGE, EMPTY\" missing \"WITH PRIMER\"",
        "tests": "PSN completeness (safety-critical)"
      },
      {
        "id": 2,
        "alteration": "Label shows \"1.4S\" instead of \"1.4C\"",
        "tests": "Compatibility group validation"
      },
      {
        "id": 3,
        "alteration": "POP marking shows \"4H1\" (expanded plastic - not authorized for A5.19)",
        "tests": "Packaging code validation"
      },
      {
        "id": 4,
        "alteration": "Key 7 incorrectly shows \"Cargo Aircraft Only\"",
        "tests": "Aircraft limitation validation"
      }
    ]
  },
  {
    "scenario": 17,
    "unNumber": "UN0442",
    "title": "CHARGES, EXPLOSIVE, COMMERCIAL",
    "packagingParagraph": "A5.20",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN0442",
      "PSN": "CHARGES, EXPLOSIVE, COMMERCIAL without detonator",
      "Hazard Class": "1.1D",
      "Packaging Paragraph": "A5.20",
      "Special Provisions": "P4, A69",
      "Subsidiary Risk": "None"
    },
    "expectedSddg": {
      "Key": "Expected Value",
      "Key 7": "\"Cargo Aircraft Only\"",
      "Key 11": "\"UN0442\"",
      "Key 12": "\"CHARGES, EXPLOSIVE, COMMERCIAL without detonator\"",
      "Key 13": "\"1.1D\"",
      "Key 14": "Empty",
      "Key 15": "Empty",
      "Key 16": "Net quantity + packaging + NEW",
      "Key 17": "\"A5.20\""
    },
    "expectedPackage": {
      "labels": [
        "EXPLOSIVE 1.1 with compatibility group D",
        "Cargo Aircraft Only"
      ],
      "markings": [
        "UN0442",
        "PSN: \"CHARGES, EXPLOSIVE, COMMERCIAL without detonator\"",
        "EX number",
        "Military Shipping Label (MSL)"
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
        "alteration": "Key 12 missing \"without detonator\" qualifier",
        "tests": "PSN completeness (safety-critical descriptor)"
      },
      {
        "id": 2,
        "alteration": "Label shows \"1.2D\" instead of \"1.1D\"",
        "tests": "Division validation"
      },
      {
        "id": 3,
        "alteration": "Key 16 missing NEW for explosive article",
        "tests": "Explosive quantity format validation"
      },
      {
        "id": 4,
        "alteration": "POP marking shows \"3H1\" (plastic jerrican - not authorized)",
        "tests": "Packaging code validation"
      }
    ]
  },
  {
    "scenario": 18,
    "unNumber": "UN0288",
    "title": "CHARGES, SHAPED, FLEXIBLE, LINEAR",
    "packagingParagraph": "A5.21",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN0288",
      "PSN": "CHARGES, SHAPED, FLEXIBLE, LINEAR",
      "Hazard Class": "1.1D",
      "Packaging Paragraph": "A5.21",
      "Special Provisions": "P4, A69",
      "Subsidiary Risk": "None"
    },
    "expectedSddg": {
      "Key": "Expected Value",
      "Key 7": "\"Cargo Aircraft Only\"",
      "Key 11": "\"UN0288\"",
      "Key 12": "\"CHARGES, SHAPED, FLEXIBLE, LINEAR\"",
      "Key 13": "\"1.1D\"",
      "Key 14": "Empty",
      "Key 15": "Empty",
      "Key 16": "Net quantity + packaging + NEW",
      "Key 17": "\"A5.21\""
    },
    "expectedPackage": {
      "labels": [
        "EXPLOSIVE 1.1 with compatibility group D",
        "Cargo Aircraft Only"
      ],
      "markings": [
        "UN0288",
        "PSN: \"CHARGES, SHAPED, FLEXIBLE, LINEAR\"",
        "EX number",
        "Military Shipping Label (MSL)"
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
        "alteration": "POP marking shows \"1D\" (plywood drum - not authorized for A5.21)",
        "tests": "Packaging code validation"
      },
      {
        "id": 2,
        "alteration": "PSN abbreviated to \"CHARGES, SHAPED, LINEAR\" missing \"FLEXIBLE\"",
        "tests": "PSN completeness"
      },
      {
        "id": 3,
        "alteration": "Label missing compatibility group \"D\"",
        "tests": "Compatibility group validation"
      },
      {
        "id": 4,
        "alteration": "Key 17 shows \"A5.20\" instead of \"A5.21\"",
        "tests": "Packaging paragraph validation"
      }
    ]
  },
  {
    "scenario": 19,
    "unNumber": "UN0065",
    "title": "CORD, DETONATING (flexible)",
    "packagingParagraph": "A5.22",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN0065",
      "PSN": "CORD, DETONATING flexible",
      "Hazard Class": "1.1D",
      "Packaging Paragraph": "A5.22",
      "Special Provisions": "P4, 102, A69",
      "Subsidiary Risk": "None"
    },
    "expectedSddg": {
      "Key": "Expected Value",
      "Key 7": "\"Cargo Aircraft Only\"",
      "Key 11": "\"UN0065\"",
      "Key 12": "\"CORD, DETONATING flexible\"",
      "Key 13": "\"1.1D\"",
      "Key 14": "Empty",
      "Key 15": "Empty",
      "Key 16": "Net quantity + packaging + NEW",
      "Key 17": "\"A5.22\""
    },
    "expectedPackage": {
      "labels": [
        "EXPLOSIVE 1.1 with compatibility group D",
        "Cargo Aircraft Only"
      ],
      "markings": [
        "UN0065",
        "PSN: \"CORD, DETONATING flexible\"",
        "EX number",
        "Military Shipping Label (MSL)"
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
        "alteration": "Key 12 shows \"DETONATING CORD\" without \"flexible\" descriptor",
        "tests": "PSN completeness"
      },
      {
        "id": 2,
        "alteration": "Ends of detonating cord not sealed",
        "tests": "Special packaging requirement validation"
      },
      {
        "id": 3,
        "alteration": "Label shows \"1.4D\" instead of \"1.1D\"",
        "tests": "Division validation"
      },
      {
        "id": 4,
        "alteration": "POP marking shows \"4H1\" (expanded plastic - not authorized)",
        "tests": "Packaging code validation"
      }
    ]
  },
  {
    "scenario": 20,
    "unNumber": "UN0066",
    "title": "CORD, IGNITER",
    "packagingParagraph": "A5.23",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN0066",
      "PSN": "CORD, IGNITER",
      "Hazard Class": "1.4G",
      "Packaging Paragraph": "A5.23",
      "Special Provisions": "P5, A69",
      "Subsidiary Risk": "None"
    },
    "expectedSddg": {
      "Key": "Expected Value",
      "Key 7": "\"Passenger and Cargo Aircraft\" (P5 allows passenger)",
      "Key 11": "\"UN0066\"",
      "Key 12": "\"CORD, IGNITER\"",
      "Key 13": "\"1.4G\"",
      "Key 14": "Empty",
      "Key 15": "Empty",
      "Key 16": "Net quantity + packaging",
      "Key 17": "\"A5.23\""
    },
    "expectedPackage": {
      "labels": [
        "EXPLOSIVE 1.4 with compatibility group G",
        "NO Cargo Aircraft Only label (P5 allows passenger)"
      ],
      "markings": [
        "UN0066",
        "PSN: \"CORD, IGNITER\"",
        "EX number",
        "Military Shipping Label (MSL)"
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
        "alteration": "POP marking shows \"4N\" (other metal box - not authorized for A5.23)",
        "tests": "Packaging code validation"
      },
      {
        "id": 2,
        "alteration": "Key 7 shows \"Cargo Aircraft Only\" when P5 allows passenger",
        "tests": "Aircraft limitation validation"
      },
      {
        "id": 3,
        "alteration": "Label shows \"1.1G\" instead of \"1.4G\"",
        "tests": "Division validation"
      },
      {
        "id": 4,
        "alteration": "Package incorrectly has CAO label",
        "tests": "Label/SDDG consistency"
      }
    ]
  },
  {
    "scenario": 21,
    "unNumber": "UN0106",
    "title": "FUZES, DETONATING",
    "packagingParagraph": "A5.24",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN0106",
      "PSN": "FUZES, DETONATING",
      "Hazard Class": "1.1B",
      "Packaging Paragraph": "A5.24",
      "Special Provisions": "P4",
      "Subsidiary Risk": "None"
    },
    "expectedSddg": {
      "Key": "Expected Value",
      "Key 7": "\"Cargo Aircraft Only\"",
      "Key 11": "\"UN0106\"",
      "Key 12": "\"FUZES, DETONATING\"",
      "Key 13": "\"1.1B\"",
      "Key 14": "Empty",
      "Key 15": "Empty",
      "Key 16": "Net quantity + packaging + NEW",
      "Key 17": "\"A5.24\""
    },
    "expectedPackage": {
      "labels": [
        "EXPLOSIVE 1.1 with compatibility group B",
        "Cargo Aircraft Only"
      ],
      "markings": [
        "UN0106",
        "PSN: \"FUZES, DETONATING\"",
        "EX number",
        "Military Shipping Label (MSL)"
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
        "alteration": "Package marking shows \"FUSES\" instead of \"FUZES\"",
        "tests": "PSN spelling validation"
      },
      {
        "id": 2,
        "alteration": "Key 13 shows \"1.4B\" instead of \"1.1B\"",
        "tests": "Division validation"
      },
      {
        "id": 3,
        "alteration": "Missing CAO label despite P4 requirement",
        "tests": "CAO label validation"
      },
      {
        "id": 4,
        "alteration": "POP marking shows \"4H1\" (expanded plastic - not authorized)",
        "tests": "Packaging code validation"
      }
    ]
  },
  {
    "scenario": 22,
    "unNumber": "UN0121",
    "title": "IGNITERS",
    "packagingParagraph": "A5.25",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN0121",
      "PSN": "IGNITERS",
      "Hazard Class": "1.1G",
      "Packaging Paragraph": "A5.25",
      "Special Provisions": "P4",
      "Subsidiary Risk": "None"
    },
    "expectedSddg": {
      "Key": "Expected Value",
      "Key 7": "\"Cargo Aircraft Only\"",
      "Key 11": "\"UN0121\"",
      "Key 12": "\"IGNITERS\"",
      "Key 13": "\"1.1G\"",
      "Key 14": "Empty",
      "Key 15": "Empty",
      "Key 16": "Net quantity + packaging + NEW",
      "Key 17": "\"A5.25\""
    },
    "expectedPackage": {
      "labels": [
        "EXPLOSIVE 1.1 with compatibility group G",
        "Cargo Aircraft Only"
      ],
      "markings": [
        "UN0121",
        "PSN: \"IGNITERS\"",
        "EX number",
        "Military Shipping Label (MSL)"
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
        "alteration": "Label shows \"1.4G\" instead of \"1.1G\"",
        "tests": "Division validation"
      },
      {
        "id": 2,
        "alteration": "Key 17 shows \"A5.11\" instead of \"A5.25\"",
        "tests": "Packaging paragraph validation (A5.11 is ANFO)"
      },
      {
        "id": 3,
        "alteration": "POP marking shows packaging code not authorized by A5.25",
        "tests": "Packaging code validation"
      },
      {
        "id": 4,
        "alteration": "Key 13 shows \"1.1\" without compatibility group \"G\"",
        "tests": "Compatibility group completeness"
      }
    ]
  },
  {
    "scenario": 23,
    "unNumber": "UN0271",
    "title": "CHARGES, PROPELLING",
    "packagingParagraph": "A5.26",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN0271",
      "PSN": "CHARGES, PROPELLING",
      "Hazard Class": "1.1C",
      "Packaging Paragraph": "A5.26",
      "Special Provisions": "P4",
      "Subsidiary Risk": "None"
    },
    "expectedSddg": {
      "Key": "Expected Value",
      "Key 7": "\"Cargo Aircraft Only\"",
      "Key 11": "\"UN0271\"",
      "Key 12": "\"CHARGES, PROPELLING\"",
      "Key 13": "\"1.1C\"",
      "Key 14": "Empty",
      "Key 15": "Empty",
      "Key 16": "Net quantity + packaging + NEW",
      "Key 17": "\"A5.26\""
    },
    "expectedPackage": {
      "labels": [
        "EXPLOSIVE 1.1 with compatibility group C",
        "Cargo Aircraft Only"
      ],
      "markings": [
        "UN0271",
        "PSN: \"CHARGES, PROPELLING\"",
        "EX number",
        "Military Shipping Label (MSL)"
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
          "4A",
          "4B",
          "4C1",
          "4C2",
          "4D",
          "4F",
          "4G",
          "4H2",
          "4N",
          "6HH2"
        ],
        "packingGroupCode": "XorY"
      }
    },
    "alterations": [
      {
        "id": 1,
        "alteration": "Label shows compatibility group \"D\" instead of \"C\"",
        "tests": "Compatibility group validation"
      },
      {
        "id": 2,
        "alteration": "Key 12 abbreviated to \"PROPELLING CHARGES\" (word order)",
        "tests": "PSN format validation"
      },
      {
        "id": 3,
        "alteration": "POP marking shows \"4H1\" (expanded plastic - not authorized)",
        "tests": "Packaging code validation"
      },
      {
        "id": 4,
        "alteration": "Key 16 shows quantity without \"NEW\" designation",
        "tests": "Explosive quantity format validation"
      }
    ]
  },
  {
    "scenario": 24,
    "unNumber": "UN0248",
    "title": "CONTRIVANCES, WATER-ACTIVATED",
    "packagingParagraph": "A5.27",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN0248",
      "PSN": "CONTRIVANCES, WATER-ACTIVATED with burster, expelling charge, or propelling charge",
      "Hazard Class": "1.2L",
      "Packaging Paragraph": "A5.27",
      "Special Provisions": "P3",
      "Subsidiary Risk": "None"
    },
    "expectedSddg": {
      "Key": "Expected Value",
      "Key 7": "\"Cargo Aircraft Only\" (P3 requires CAO)",
      "Key 11": "\"UN0248\"",
      "Key 12": "\"CONTRIVANCES, WATER-ACTIVATED with burster, expelling charge, or propelling charge\"",
      "Key 13": "\"1.2L\"",
      "Key 14": "Empty",
      "Key 15": "Empty",
      "Key 16": "Net quantity + packaging + NEW",
      "Key 17": "\"A5.27\""
    },
    "expectedPackage": {
      "labels": [
        "EXPLOSIVE 1.2 with compatibility group L",
        "Cargo Aircraft Only"
      ],
      "markings": [
        "UN0248",
        "PSN: \"CONTRIVANCES, WATER-ACTIVATED with burster, expelling charge, or propelling charge\"",
        "EX number",
        "Military Shipping Label (MSL)"
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
        "alteration": "POP marking shows \"1G\" (fiberboard drum - not authorized for water-activated)",
        "tests": "Packaging code validation"
      },
      {
        "id": 2,
        "alteration": "POP marking shows \"4G\" (fiberboard box - not authorized for A5.27)",
        "tests": "Packaging code validation"
      },
      {
        "id": 3,
        "alteration": "Key 12 missing \"with burster, expelling charge, or propelling charge\"",
        "tests": "PSN completeness"
      },
      {
        "id": 4,
        "alteration": "Label shows \"1.2D\" instead of \"1.2L\"",
        "tests": "Compatibility group validation (L is water-reactive)"
      },
      {
        "id": 5,
        "alteration": "Wood box (4C1) without required metal liner",
        "tests": "Special packaging requirement"
      }
    ]
  }
];
