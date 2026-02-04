// Auto-generated from class6-packaging-paragraphs.md. Do not edit by hand.
export type Class6ScenarioFixture = {
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

export const class6ScenarioFixtures: Class6ScenarioFixture[] = 
[
  {
    "scenario": 1,
    "unNumber": "NA1556",
    "title": "A10.2 - METHYLDICHLOROARSINE (Cylinders)",
    "packagingParagraph": "A10.2",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "NA1556",
      "PSN": "METHYLDICHLOROARSINE",
      "Hazard Class": "6.1",
      "Packing Group": "I",
      "Packaging Paragraph": "A10.2",
      "Special Provisions": "P2, 2",
      "Domestic Only": "Yes (NA prefix)"
    },
    "expectedSddg": {
      "Key 7": "\"Cargo Aircraft Only\" (P2 restricts to CAO)",
      "Key 11": "\"NA1556\"",
      "Key 12": "\"METHYLDICHLOROARSINE\"",
      "Key 13": "\"6.1\"",
      "Key 14": "Empty",
      "Key 15": "\"I\" (Packing Group I required)",
      "Key 16": "Net quantity + cylinder type (e.g., \"1 cylinder (3AA1800) x 25 kg\")",
      "Key 17": "\"A10.2\""
    },
    "expectedPackage": {
      "labels": [
        "TOXIC (skull and crossbones on white background)",
        "Cargo Aircraft Only"
      ],
      "markings": [
        "NA1556",
        "PSN: \"METHYLDICHLOROARSINE\"",
        "\"POISON\" or \"TOXIC\" marking",
        "Military Shipping Label (MSL)"
      ],
      "pop": {
        "allowedCodes": [
          "3A1800",
          "3AA1800",
          "3AL1800",
          "3D"
        ],
        "packingGroupCode": ""
      }
    },
    "alterations": [
      {
        "id": 1,
        "alteration": "Key 7 shows \"Passenger and Cargo Aircraft\"",
        "tests": "Aircraft limitation validation (P2 requires CAO)"
      },
      {
        "id": 2,
        "alteration": "Cylinder type not authorized for A10.2",
        "tests": "Packaging code validation"
      },
      {
        "id": 3,
        "alteration": "Missing Cargo Aircraft Only label",
        "tests": "CAO label requirement for P2 material"
      }
    ]
  },
  {
    "scenario": 2,
    "unNumber": "UN1569",
    "title": "A10.3 - BROMOACETONE",
    "packagingParagraph": "A10.3",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN1569",
      "PSN": "BROMOACETONE",
      "Hazard Class": "6.1",
      "Subsidiary Risk": "3 (Flammable)",
      "Packing Group": "II",
      "Packaging Paragraph": "A10.3",
      "Special Provisions": "P2, 2"
    },
    "expectedSddg": {
      "Key 7": "\"Cargo Aircraft Only\" (P2 restricts to CAO)",
      "Key 11": "\"UN1569\"",
      "Key 12": "\"BROMOACETONE\"",
      "Key 13": "\"6.1\"",
      "Key 14": "\"3\" (Flammable subsidiary)",
      "Key 15": "\"II\"",
      "Key 16": "Net quantity + packaging (e.g., \"1 fiberboard box (4G) x 500 g\")",
      "Key 17": "\"A10.3\""
    },
    "expectedPackage": {
      "labels": [
        "TOXIC (primary hazard)",
        "FLAMMABLE LIQUID (subsidiary Class 3)",
        "Cargo Aircraft Only",
        "Orientation arrows (liquid)"
      ],
      "markings": [
        "UN1569",
        "PSN: \"BROMOACETONE\"",
        "\"POISON\" or \"TOXIC\" marking",
        "Military Shipping Label (MSL)"
      ],
      "pop": {
        "allowedCodes": [
          "3A",
          "3AA",
          "3B",
          "3C",
          "3E",
          "4A",
          "4B",
          "4BA",
          "4BW",
          "4C",
          "4C1",
          "4C2",
          "4D",
          "4F",
          "4N"
        ],
        "packingGroupCode": ""
      }
    },
    "alterations": [
      {
        "id": 1,
        "alteration": "Missing FLAMMABLE LIQUID subsidiary label",
        "tests": "Subsidiary hazard label validation"
      },
      {
        "id": 2,
        "alteration": "Key 14 left empty when subsidiary risk exists",
        "tests": "SDDG subsidiary risk validation"
      },
      {
        "id": 3,
        "alteration": "POP marking shows packing group \"Z\"",
        "tests": "PG validation (Z not sufficient for PG II)"
      }
    ]
  },
  {
    "scenario": 3,
    "unNumber": "UN3426",
    "title": "A10.4 - ACRYLAMIDE SOLUTION (Liquid)",
    "packagingParagraph": "A10.4",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN3426",
      "PSN": "ACRYLAMIDE SOLUTION",
      "Hazard Class": "6.1",
      "Packing Group": "III",
      "Packaging Paragraph": "A10.4",
      "Special Provisions": "P5"
    },
    "expectedSddg": {
      "Key 7": "\"Passenger and Cargo Aircraft\" (P5 allows passenger)",
      "Key 11": "\"UN3426\"",
      "Key 12": "\"ACRYLAMIDE SOLUTION\"",
      "Key 13": "\"6.1\"",
      "Key 14": "Empty",
      "Key 15": "\"III\"",
      "Key 16": "Net quantity + packaging (e.g., \"1 plastic drum (1H1) x 20 L\")",
      "Key 17": "\"A10.4\""
    },
    "expectedPackage": {
      "labels": [
        "TOXIC (or Class 6 PG III designation)",
        "Orientation arrows (liquid)"
      ],
      "markings": [
        "UN3426",
        "PSN: \"ACRYLAMIDE SOLUTION\"",
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
        "alteration": "Missing orientation arrows for liquid",
        "tests": "Orientation label validation"
      },
      {
        "id": 2,
        "alteration": "Key 15 shows \"II\" instead of \"III\"",
        "tests": "Packing group accuracy validation"
      },
      {
        "id": 3,
        "alteration": "POP marking entirely missing",
        "tests": "UN specification marking validation"
      }
    ]
  },
  {
    "scenario": 4,
    "unNumber": "UN2713",
    "title": "A10.5 - ACRIDINE (Solid)",
    "packagingParagraph": "A10.5",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN2713",
      "PSN": "ACRIDINE",
      "Hazard Class": "6.1",
      "Packing Group": "III",
      "Packaging Paragraph": "A10.5",
      "Special Provisions": "P5"
    },
    "expectedSddg": {
      "Key 7": "\"Passenger and Cargo Aircraft\"",
      "Key 11": "\"UN2713\"",
      "Key 12": "\"ACRIDINE\"",
      "Key 13": "\"6.1\"",
      "Key 14": "Empty",
      "Key 15": "\"III\"",
      "Key 16": "Net quantity + packaging (e.g., \"1 fiberboard box (4G) x 10 kg\")",
      "Key 17": "\"A10.5\""
    },
    "expectedPackage": {
      "labels": [
        "TOXIC (or Class 6 PG III designation)"
      ],
      "markings": [
        "UN2713",
        "PSN: \"ACRIDINE\"",
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
          "5H1",
          "5H2",
          "5H3",
          "5H4",
          "5L1",
          "5L2",
          "5L3",
          "5M2"
        ],
        "packingGroupCode": ""
      }
    },
    "alterations": [
      {
        "id": 1,
        "alteration": "Key 17 shows \"A10.4\" instead of \"A10.5\"",
        "tests": "Packaging instruction validation (liquid vs solid)"
      },
      {
        "id": 2,
        "alteration": "Missing Military Shipping Label",
        "tests": "MSL validation"
      },
      {
        "id": 3,
        "alteration": "Key 15 left empty",
        "tests": "Packing group requirement for 6.1"
      }
    ]
  },
  {
    "scenario": 5,
    "unNumber": "UN1541",
    "title": "A10.6 - ACETONE CYANOHYDRIN, STABILIZED (Inhalation Hazard)",
    "packagingParagraph": "A10.6",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN1541",
      "PSN": "ACETONE CYANOHYDRIN, STABILIZED",
      "Hazard Class": "6.1",
      "Packing Group": "I",
      "Packaging Paragraph": "A10.6",
      "Special Provisions": "P2, 2, N34",
      "Inhalation Hazard": "Yes (Hazard Zone A or B)"
    },
    "expectedSddg": {
      "Key 7": "\"Cargo Aircraft Only\" (P2 restricts to CAO)",
      "Key 11": "\"UN1541\"",
      "Key 12": "\"ACETONE CYANOHYDRIN, STABILIZED, INHALATION HAZARD ZONE [A/B]\"",
      "Key 13": "\"6.1\"",
      "Key 14": "Empty",
      "Key 15": "\"I\"",
      "Key 16": "Net quantity + packaging",
      "Key 17": "\"A10.6\""
    },
    "expectedPackage": {
      "labels": [
        "TOXIC INHALATION HAZARD (mandatory for Zone A/B)",
        "Cargo Aircraft Only",
        "Orientation arrows (liquid)"
      ],
      "markings": [
        "UN1541",
        "PSN: \"ACETONE CYANOHYDRIN, STABILIZED\"",
        "\"INHALATION HAZARD\" marking (unless on label)",
        "\"POISON\" or \"TOXIC\" marking",
        "Military Shipping Label (MSL)"
      ],
      "pop": {
        "allowedCodes": [
          "1A2",
          "1B2",
          "1H2",
          "1D",
          "1G",
          "1N2",
          "6HA1"
        ],
        "packingGroupCode": ""
      }
    },
    "alterations": [
      {
        "id": 1,
        "alteration": "Key 12 missing \"INHALATION HAZARD ZONE\" designation",
        "tests": "Zone designation requirement"
      },
      {
        "id": 2,
        "alteration": "Label shows regular TOXIC instead of TOXIC INHALATION HAZARD",
        "tests": "Inhalation hazard label validation (A15.4.5.2 - mandatory)"
      },
      {
        "id": 3,
        "alteration": "POP marking shows packing group \"Y\"",
        "tests": "PG validation (PG I requires X rating only)"
      }
    ]
  },
  {
    "scenario": 6,
    "unNumber": "UN1700",
    "title": "A10.7 - TEAR GAS CANDLES",
    "packagingParagraph": "A10.7",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN1700",
      "PSN": "TEAR GAS CANDLES",
      "Hazard Class": "6.1",
      "Subsidiary Risk": "4.1 (Flammable Solid)",
      "Packing Group": "N/A",
      "Packaging Paragraph": "A10.7",
      "Special Provisions": "P4"
    },
    "expectedSddg": {
      "Key 7": "\"Cargo Aircraft Only\" (P4 restricts to CAO)",
      "Key 11": "\"UN1700\"",
      "Key 12": "\"TEAR GAS CANDLES\"",
      "Key 13": "\"6.1\"",
      "Key 14": "\"4.1\" (Flammable Solid subsidiary)",
      "Key 15": "Empty (no packing group for this entry)",
      "Key 16": "Number of items + packaging (e.g., \"24 tear gas candles in 1 drum (1A2) x 15 kg\")",
      "Key 17": "\"A10.7\""
    },
    "expectedPackage": {
      "labels": [
        "TOXIC (primary hazard)",
        "FLAMMABLE SOLID (subsidiary Class 4.1)",
        "Cargo Aircraft Only"
      ],
      "markings": [
        "UN1700",
        "PSN: \"TEAR GAS CANDLES\"",
        "\"POISON\" or \"TOXIC\" marking",
        "Military Shipping Label (MSL)"
      ],
      "pop": {
        "allowedCodes": [
          "1A2",
          "1B2",
          "1H2",
          "1N2",
          "2P",
          "2Q",
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
        "alteration": "Missing FLAMMABLE SOLID subsidiary label",
        "tests": "Subsidiary hazard label validation"
      },
      {
        "id": 2,
        "alteration": "Key 7 shows \"Passenger and Cargo Aircraft\"",
        "tests": "Aircraft limitation validation (P4 requires CAO)"
      },
      {
        "id": 3,
        "alteration": "Exceeds 50 items per box",
        "tests": "Quantity limitation validation"
      }
    ]
  },
  {
    "scenario": 7,
    "unNumber": "UN2814",
    "title": "A10.8 - INFECTIOUS SUBSTANCE, AFFECTING HUMANS (Category A)",
    "packagingParagraph": "A10.8",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN2814",
      "PSN": "INFECTIOUS SUBSTANCES, AFFECTING HUMANS",
      "Scientific Name": "(Bacillus anthracis - cultures)",
      "Hazard Class": "6.2",
      "Category": "A",
      "Packaging Paragraph": "A10.8",
      "Special Provisions": "P1, A140, A502"
    },
    "expectedSddg": {
      "Key 7": "\"Cargo Aircraft Only\" (P1 restricts to CAO)",
      "Key 11": "\"UN2814\"",
      "Key 12": "\"INFECTIOUS SUBSTANCES, AFFECTING HUMANS (Bacillus anthracis)\"",
      "Key 13": "\"6.2\"",
      "Key 14": "Empty",
      "Key 15": "Empty (Infectious substances do NOT have packing groups)",
      "Key 16": "Net quantity + packaging description (triple packaging)",
      "Key 17": "\"A10.8\"",
      "Key 2/20": "**24-hour emergency contact number** (CRITICAL for 6.2)"
    },
    "expectedPackage": {
      "labels": [
        "INFECTIOUS SUBSTANCE (biohazard symbol on white background)",
        "Cargo Aircraft Only",
        "Orientation arrows (required for ALL 6.2 materials)"
      ],
      "markings": [
        "UN2814",
        "PSN: \"INFECTIOUS SUBSTANCES, AFFECTING HUMANS\"",
        "Scientific name if known: \"(Bacillus anthracis)\"",
        "Shipper name and address",
        "Consignee name and address",
        "Name and telephone of responsible person (24-hour availability)",
        "Military Shipping Label (MSL)",
        "UN specification marking must include \"Class 6.2\" text",
        "Optional \"U\" code when meeting 49 CFR 178.609(i)(3)"
      ],
      "pop": {
        "allowedCodes": [],
        "packingGroupCode": ""
      }
    },
    "alterations": [
      {
        "id": 1,
        "alteration": "Key 15 shows \"II\" (packing group entered when should be empty)",
        "tests": "6.2 packing group validation (must be empty)"
      },
      {
        "id": 2,
        "alteration": "Missing 24-hour emergency contact",
        "tests": "Emergency contact requirement for 6.2 (Key 2/20)"
      },
      {
        "id": 3,
        "alteration": "Using TOXIC label instead of INFECTIOUS SUBSTANCE",
        "tests": "Division label validation (6.1 vs 6.2)"
      }
    ]
  },
  {
    "scenario": 8,
    "unNumber": "UN3373",
    "title": "A10.9 - BIOLOGICAL SUBSTANCE, CATEGORY B",
    "packagingParagraph": "A10.9",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN3373",
      "PSN": "BIOLOGICAL SUBSTANCE, CATEGORY B",
      "Hazard Class": "6.2",
      "Category": "B",
      "Packaging Paragraph": "A10.9",
      "Special Provisions": "P5, A508"
    },
    "expectedSddg": {
      "Key 7": "\"Passenger and Cargo Aircraft\" (generally allowed)",
      "Key 11": "\"UN3373\"",
      "Key 12": "\"BIOLOGICAL SUBSTANCE, CATEGORY B\"",
      "Key 13": "\"6.2\"",
      "Key 14": "Empty",
      "Key 15": "Empty (NO packing group for 6.2)",
      "Key 16": "Net quantity + packaging description",
      "Key 17": "\"A10.9\""
    },
    "expectedPackage": {
      "labels": [
        "**NO HAZARD LABEL** (UN3373 is a critical exception)",
        "Orientation arrows (required for 6.2)"
      ],
      "markings": [
        "\"UN3373\" within a diamond-shaped border (minimum 50mm x 50mm, 2mm line width)",
        "\"BIOLOGICAL SUBSTANCE, CATEGORY B\" text (6mm minimum height)",
        "Shipper name and address",
        "Consignee name and address",
        "Emergency contact name and phone number",
        "Military Shipping Label (MSL)",
        "Primary receptacle: leakproof, max 1 L (liquid) or siftproof (solid)",
        "Secondary packaging: leakproof (liquid) or siftproof (solid), with absorbent",
        "Outer packaging: rigid, drop test at 1.2m, minimum surface 100mm x 100mm",
        "Max 4 L (liquid) or 4 kg (solid) per outer packaging"
      ],
      "pop": {
        "allowedCodes": [],
        "packingGroupCode": ""
      }
    },
    "alterations": [
      {
        "id": 1,
        "alteration": "INFECTIOUS SUBSTANCE label applied (should have NO label)",
        "tests": "UN3373 no-label requirement validation"
      },
      {
        "id": 2,
        "alteration": "Key 15 shows \"II\" (should be empty for 6.2)",
        "tests": "Packing group empty validation for 6.2"
      }
    ]
  },
  {
    "scenario": 9,
    "unNumber": "UN3291",
    "title": "A10.10 - BIOMEDICAL WASTE, N.O.S.",
    "packagingParagraph": "A10.10",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN3291",
      "PSN": "BIOMEDICAL WASTE, N.O.S.",
      "Hazard Class": "6.2",
      "Packing Group": "II",
      "Packaging Paragraph": "A10.10",
      "Special Provisions": "P5, A117"
    },
    "expectedSddg": {
      "Key 7": "\"Passenger and Cargo Aircraft\" (with quantity restrictions)",
      "Key 11": "\"UN3291\"",
      "Key 12": "\"BIOMEDICAL WASTE, N.O.S.\" (or \"CLINICAL WASTE, UNSPECIFIED, N.O.S.\" or \"REGULATED MEDICAL WASTE, N.O.S.\")",
      "Key 13": "\"6.2\"",
      "Key 14": "Empty",
      "Key 15": "\"II\" (UN3291 exceptionally has PG II)",
      "Key 16": "Net quantity + packaging description",
      "Key 17": "\"A10.10\""
    },
    "expectedPackage": {
      "labels": [
        "INFECTIOUS SUBSTANCE (biohazard symbol)",
        "Orientation arrows (for liquids or 6.2 general requirement)"
      ],
      "markings": [
        "UN3291",
        "PSN: \"BIOMEDICAL WASTE, N.O.S.\"",
        "Shipper/consignee information",
        "Responsible person contact",
        "Military Shipping Label (MSL)",
        "Single packaging: drums (1A2, 1B2, 1N2, 1D, 1G, 1H2), boxes (4A, 4B, 4C1, 4C2, 4D, 4F, 4G, 4H1, 4H2, 4N), jerricans (3A2, 3B2, 3H2)",
        "Removable head drums required",
        "Packing group code: X or Y (PG II performance level)",
        "Puncture-resistant for sharp objects"
      ],
      "pop": {
        "allowedCodes": [],
        "packingGroupCode": ""
      }
    },
    "alterations": [
      {
        "id": 1,
        "alteration": "Key 15 empty (should show \"II\" for UN3291)",
        "tests": "UN3291 exception - PG II required"
      },
      {
        "id": 2,
        "alteration": "UN3373 marking applied instead of UN3291",
        "tests": "UN number accuracy for medical waste"
      },
      {
        "id": 3,
        "alteration": "POP marking shows packing group \"Z\"",
        "tests": "PG II requires X or Y rating"
      }
    ]
  },
  {
    "scenario": 10,
    "unNumber": "UN3361",
    "title": "A10.11 - CHLOROSILANES, TOXIC, CORROSIVE, N.O.S.",
    "packagingParagraph": "A10.11",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN3361",
      "PSN": "CHLOROSILANES, TOXIC, CORROSIVE, N.O.S.",
      "Technical Name": "(Required - e.g., Trichlorosilane)",
      "Hazard Class": "6.1",
      "Subsidiary Risk": "8 (Corrosive)",
      "Packing Group": "II",
      "Packaging Paragraph": "A10.11",
      "Special Provisions": "P5"
    },
    "expectedSddg": {
      "Key 7": "\"Passenger and Cargo Aircraft\"",
      "Key 11": "\"UN3361\"",
      "Key 12": "\"CHLOROSILANES, TOXIC, CORROSIVE, N.O.S. (Trichlorosilane)\"",
      "Key 13": "\"6.1\"",
      "Key 14": "\"8\" (Corrosive subsidiary)",
      "Key 15": "\"II\"",
      "Key 16": "Net quantity + packaging",
      "Key 17": "\"A10.11\""
    },
    "expectedPackage": {
      "labels": [
        "TOXIC (primary hazard)",
        "CORROSIVE (subsidiary Class 8)",
        "Orientation arrows (liquid)"
      ],
      "markings": [
        "UN3361",
        "PSN with technical name: \"CHLOROSILANES, TOXIC, CORROSIVE, N.O.S. (Trichlorosilane)\"",
        "\"POISON\" or \"TOXIC\" marking",
        "Military Shipping Label (MSL)",
        "Per A10.11.1: Combination packaging with glass/steel inner; outer drums (1A2, 1D, 1G, 1H2) or boxes (4A, 4C1, 4C2, 4D, 4F, 4G, 4H1, 4H2)",
        "Per A10.11.2: Composite drums (6HA1) with plastic inner",
        "Per A10.11.3: Single packaging drums (1A1) or jerricans (3A1)",
        "Per A10.11.4: Cylinders (NOT 3HT, 8, 8AL)",
        "Packing group code: X or Y"
      ],
      "pop": {
        "allowedCodes": [],
        "packingGroupCode": ""
      }
    },
    "alterations": [
      {
        "id": 1,
        "alteration": "Missing CORROSIVE subsidiary label",
        "tests": "Subsidiary hazard label validation"
      },
      {
        "id": 2,
        "alteration": "Technical name missing from package marking",
        "tests": "N.O.S. marking requirement"
      },
      {
        "id": 3,
        "alteration": "Key 14 left empty when subsidiary risk exists",
        "tests": "SDDG subsidiary risk validation"
      }
    ]
  },
  {
    "scenario": 11,
    "unNumber": "UN3172",
    "title": "A10.12 - TOXINS, EXTRACTED FROM LIVING SOURCES, LIQUID, N.O.S.",
    "packagingParagraph": "A10.12",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN3172",
      "PSN": "TOXINS, EXTRACTED FROM LIVING SOURCES, LIQUID, N.O.S.",
      "Technical Name": "(Required - e.g., Ricin, Botulinum toxin)",
      "Hazard Class": "6.1",
      "Packing Group": "I:II:III",
      "Packaging Paragraph": "A10.12.:A10.12.:A10.12.",
      "Special Provisions": "P4, A43",
      "Transport Mode": "Cargo Aircraft Only"
    },
    "expectedSddg": {
      "Key 7": "\"Cargo Aircraft Only\" (per Table A4.1/A4.2 - CAO only)",
      "Key 11": "\"UN3172\"",
      "Key 12": "\"TOXINS, EXTRACTED FROM LIVING SOURCES, LIQUID, N.O.S. (Ricin)\"",
      "Key 13": "\"6.1\"",
      "Key 14": "Empty",
      "Key 15": "\"I:II:III\"",
      "Key 16": "Net quantity + packaging (e.g., \"1 glass inner x 2.5 L in fiberboard box (4G)\")",
      "Key 17": "\"A10.12.:A10.12.:A10.12.\""
    },
    "expectedPackage": {
      "labels": [
        "TOXIC (skull and crossbones)",
        "Cargo Aircraft Only",
        "Orientation arrows (liquid)"
      ],
      "markings": [
        "UN3172",
        "PSN with technical name: \"TOXINS, EXTRACTED FROM LIVING SOURCES, LIQUID, N.O.S. (Ricin)\"",
        "\"POISON\" or \"TOXIC\" marking",
        "Military Shipping Label (MSL)",
        "Per A10.12.1.1: Combination packaging",
        "Inner: glass/plastic (max 2.5 L for PG II), metal (max 5.0 L for PG II)",
        "Outer: drums, boxes, jerricans",
        "Per A10.12.1.2: Single packaging (drums, jerricans)",
        "Per A10.12.1.3: Composite with plastic inner",
        "Packing group code: X or Y",
        "Max outer packaging: 60 L for PG II"
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
        "tests": "Aircraft limitation validation (toxins are CAO only)"
      },
      {
        "id": 2,
        "alteration": "Missing technical name in Key 12 and package marking",
        "tests": "N.O.S. technical name requirement"
      },
      {
        "id": 3,
        "alteration": "Inner packaging exceeds 2.5 L for glass/plastic (PG II)",
        "tests": "Quantity limitation per inner packaging"
      }
    ]
  },
  {
    "scenario": 12,
    "unNumber": "UN3546",
    "title": "A10.13 - ARTICLES CONTAINING TOXIC SUBSTANCE, N.O.S.",
    "packagingParagraph": "A10.13",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN3546",
      "PSN": "ARTICLES CONTAINING TOXIC SUBSTANCE, N.O.S.",
      "Technical Name": "(Required - describe toxic substance)",
      "Hazard Class": "6.1",
      "Packing Group": "N/A (PG II performance standard)",
      "Packaging Paragraph": "A10.13",
      "Special Provisions": "P5, 391"
    },
    "expectedSddg": {
      "Key 7": "\"Passenger and Cargo Aircraft\"",
      "Key 11": "\"UN3546\"",
      "Key 12": "\"ARTICLES CONTAINING TOXIC SUBSTANCE, N.O.S. (describe article and toxic substance)\"",
      "Key 13": "\"6.1\"",
      "Key 14": "Empty (unless article has subsidiary hazard)",
      "Key 15": "Empty (no packing group assigned, but PG II performance)",
      "Key 16": "Number/type of articles + weight (e.g., \"2 articles x 5 kg\")",
      "Key 17": "\"A10.13\""
    },
    "expectedPackage": {
      "labels": [
        "TOXIC (primary hazard)",
        "Orientation arrows (if containing liquids)"
      ],
      "markings": [
        "UN3546",
        "PSN with description: \"ARTICLES CONTAINING TOXIC SUBSTANCE, N.O.S. (description)\"",
        "Military Shipping Label (MSL)",
        "Per A10.13.1: PG II performance level packagings",
        "Drums (1A2, 1B2, 1N2, 1D, 1G, 1H2) - removable head",
        "Boxes (4A, 4B, 4C1, 4C2, 4D, 4F, 4G, 4H1, 4H2, 4N)",
        "Jerricans (3A2, 3B2, 3H2) - removable head",
        "Per A10.13.2: Robust articles may use strong outer packaging or be unpackaged/on pallets",
        "Packing group code: X or Y (PG II performance)",
        "Max: 60 L liquids, 100 kg solids per package"
      ],
      "pop": {
        "allowedCodes": [],
        "packingGroupCode": ""
      }
    },
    "alterations": [
      {
        "id": 1,
        "alteration": "Key 12 missing article description",
        "tests": "PSN completeness for articles"
      },
      {
        "id": 2,
        "alteration": "Exceeds 60 L liquid content per package",
        "tests": "Quantity limitation validation"
      },
      {
        "id": 3,
        "alteration": "Missing orientation arrows when article contains liquid",
        "tests": "Orientation label requirement for liquids"
      }
    ]
  }
];
