// Auto-generated from class9-comprehensive-packaging-paragraphs.md. Do not edit by hand.
export type Class9ScenarioFixture = {
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
      required: boolean;
    };
  };
  alterations: Array<{ id: number; alteration: string; tests: string }>;
};

export const class9ScenarioFixtures: Class9ScenarioFixture[] = 
[
  {
    "scenario": 1,
    "unNumber": "UN2071",
    "title": "A13.2 - AMMONIUM NITRATE BASED FERTILIZER (UN2071)",
    "packagingParagraph": "A13.2",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN2071",
      "PSN": "AMMONIUM NITRATE BASED FERTILIZER",
      "Hazard Class": "9",
      "Packing Group": "III",
      "Packaging Paragraph": "A13.2",
      "Special Provisions": "P5, 132"
    },
    "expectedSddg": {
      "Key 7": "\"Passenger and Cargo Aircraft\" (P5 allows both)",
      "Key 11": "\"UN2071\"",
      "Key 12": "\"AMMONIUM NITRATE BASED FERTILIZER\"",
      "Key 13": "\"9\"",
      "Key 14": "Empty",
      "Key 15": "\"III\"",
      "Key 16": "Net quantity + packaging (e.g., \"2 fiberboard boxes (4G) x 25 kg\")",
      "Key 17": "\"A13.2\""
    },
    "expectedPackage": {
      "labels": [
        "CLASS 9 (Miscellaneous Dangerous Goods)"
      ],
      "markings": [
        "UN2071",
        "PSN: \"AMMONIUM NITRATE BASED FERTILIZER\""
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
          "4H1",
          "4H2",
          "4N",
          "5H1",
          "5L1",
          "5M2"
        ],
        "packingGroupCode": "Z",
        "required": true
      }
    },
    "alterations": [
      {
        "id": 1,
        "alteration": "Key 15 empty",
        "tests": "Packing group required for this material"
      },
      {
        "id": 2,
        "alteration": "POP marking shows \"Y\" instead of \"Z\"",
        "tests": "PG III requires Z code"
      }
    ]
  },
  {
    "scenario": 2,
    "unNumber": "ID8000",
    "title": "A13.3 - CONSUMER COMMODITY (ID8000)",
    "packagingParagraph": "A13.3",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "ID8000",
      "PSN": "CONSUMER COMMODITY",
      "Hazard Class": "9",
      "Packing Group": "None",
      "Packaging Paragraph": "A13.3",
      "Special Provisions": "P5, A503"
    },
    "expectedSddg": {
      "Key 7": "\"Passenger and Cargo Aircraft\"",
      "Key 11": "\"ID8000\"",
      "Key 12": "\"CONSUMER COMMODITY\"",
      "Key 13": "\"9\"",
      "Key 14": "Empty",
      "Key 15": "Empty (no packing group)",
      "Key 16": "Number + packaging (e.g., \"1 fiberboard box x 15 kg\")",
      "Key 17": "\"A13.3\""
    },
    "expectedPackage": {
      "labels": [
        "CLASS 9 (or may be exempt per consumer commodity provisions)"
      ],
      "markings": [
        "ID8000",
        "PSN: \"CONSUMER COMMODITY\"",
        "Package weight not to exceed 30 kg (66 lbs)",
        "Inner packaging: liquids \u2264500 mL, solids \u2264500 g",
        "Must withstand 4-foot drop test"
      ],
      "pop": {
        "allowedCodes": [],
        "packingGroupCode": "",
        "required": true
      }
    },
    "alterations": [
      {
        "id": 1,
        "alteration": "Key 15 shows \"III\"",
        "tests": "Packing group validation (consumer commodities have none)"
      },
      {
        "id": 2,
        "alteration": "Key 11 shows \"UN8000\" instead of \"ID8000\"",
        "tests": "ID prefix required for consumer commodities"
      },
      {
        "id": 3,
        "alteration": "Package exceeds 30 kg weight limit",
        "tests": "Consumer commodity weight limitation"
      }
    ]
  },
  {
    "scenario": 3,
    "unNumber": "UN3166",
    "title": "A13.4 - VEHICLE, FLAMMABLE GAS POWERED (UN3166)",
    "packagingParagraph": "A13.4",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN3166",
      "PSN": "VEHICLE, FLAMMABLE GAS POWERED",
      "Hazard Class": "9",
      "Packing Group": "None",
      "Packaging Paragraph": "A13.4",
      "Special Provisions": "P5, 135"
    },
    "expectedSddg": {
      "Key 7": "\"Passenger and Cargo Aircraft\"",
      "Key 11": "\"UN3166\"",
      "Key 12": "\"VEHICLE, FLAMMABLE GAS POWERED\"",
      "Key 13": "\"9\"",
      "Key 14": "Empty",
      "Key 15": "Empty",
      "Key 16": "Vehicle nomenclature (e.g., \"2 FORKLIFTS\")",
      "Key 17": "\"A13.4\"",
      "Key 19": "Accessorial hazards (fuel type, batteries, fire extinguishers)"
    },
    "expectedPackage": {
      "labels": [
        "CLASS 9 (only if packaged/crated; exempt if readily identifiable)"
      ],
      "markings": [
        "UN3166 (only if packaged/crated)",
        "PSN: \"VEHICLE, FLAMMABLE GAS POWERED\" (only if packaged/crated)",
        "Fuel tank: Standard \u22641/2 full; Chapter 3 \u22643/4 full",
        "Batteries secured, terminals protected",
        "Fire extinguishers in approved holders",
        "LPG vehicles: Completely empty or cylinders per Attachment 6"
      ],
      "pop": {
        "allowedCodes": [],
        "packingGroupCode": "",
        "required": true
      }
    },
    "alterations": [
      {
        "id": 1,
        "alteration": "Key 12 shows \"VEHICLE\" without specifying power type",
        "tests": "PSN must specify power source"
      },
      {
        "id": 2,
        "alteration": "Key 15 shows \"II\"",
        "tests": "Packing group validation (vehicles have none)"
      },
      {
        "id": 3,
        "alteration": "Key 19 missing accessorial hazard documentation",
        "tests": "Accessorial hazards required for vehicles"
      }
    ]
  },
  {
    "scenario": 4,
    "unNumber": "UN3548",
    "title": "A13.5 - ARTICLES CONTAINING MISCELLANEOUS DANGEROUS GOODS, N.O.S. (UN3548)",
    "packagingParagraph": "A13.5",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN3548",
      "PSN": "ARTICLES CONTAINING MISCELLANEOUS DANGEROUS GOODS, N.O.S.",
      "Hazard Class": "9",
      "Packing Group": "None",
      "Packaging Paragraph": "A13.5",
      "Special Provisions": "P5, 391"
    },
    "expectedSddg": {
      "Key 7": "\"Passenger and Cargo Aircraft\"",
      "Key 11": "\"UN3548\"",
      "Key 12": "\"ARTICLES CONTAINING MISCELLANEOUS DANGEROUS GOODS, N.O.S.\"",
      "Key 13": "\"9\"",
      "Key 14": "Empty",
      "Key 15": "Empty",
      "Key 16": "Description + packaging (e.g., \"1 fiberboard box x 2 articles\")",
      "Key 17": "\"A13.5\""
    },
    "expectedPackage": {
      "labels": [
        "CLASS 9"
      ],
      "markings": [
        "UN3548",
        "PSN: \"ARTICLES CONTAINING MISCELLANEOUS DANGEROUS GOODS, N.O.S.\"",
        "Pack to prevent movement and inadvertent operation",
        "Liquids: \u226460 L per package",
        "Solids: \u2264100 kg per package",
        "PG II performance standard when packaged"
      ],
      "pop": {
        "allowedCodes": [],
        "packingGroupCode": "",
        "required": true
      }
    },
    "alterations": [
      {
        "id": 1,
        "alteration": "Key 12 missing \"N.O.S.\" designation",
        "tests": "PSN completeness for generic entries"
      },
      {
        "id": 2,
        "alteration": "Key 17 shows \"A13.14\" instead of \"A13.5\"",
        "tests": "Packaging paragraph validation"
      },
      {
        "id": 3,
        "alteration": "Package exceeds 60 L liquid limit",
        "tests": "Quantity limitation validation"
      }
    ]
  },
  {
    "scenario": 5,
    "unNumber": "UN3171",
    "title": "A13.6 - BATTERY-POWERED EQUIPMENT (UN3171)",
    "packagingParagraph": "A13.6",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN3171",
      "PSN": "BATTERY-POWERED EQUIPMENT",
      "Hazard Class": "9",
      "Packing Group": "None",
      "Packaging Paragraph": "A13.6",
      "Special Provisions": "P5, 134"
    },
    "expectedSddg": {
      "Key 7": "\"Passenger and Cargo Aircraft\"",
      "Key 11": "\"UN3171\"",
      "Key 12": "\"BATTERY-POWERED EQUIPMENT\"",
      "Key 13": "\"9\"",
      "Key 14": "Empty",
      "Key 15": "Empty",
      "Key 16": "Equipment description (e.g., \"1 Electric Forklift\")",
      "Key 17": "\"A13.6\""
    },
    "expectedPackage": {
      "labels": [
        "CLASS 9 (if packaged/crated)"
      ],
      "markings": [
        "UN3171 (if packaged/crated)",
        "PSN: \"BATTERY-POWERED EQUIPMENT\" (if packaged/crated)",
        "Batteries secured upright in designed holders",
        "Terminals protected with non-conductive caps",
        "Lithium batteries: Must pass UN Manual of Tests and Criteria",
        "Non-spillable batteries: Secure against short circuits"
      ],
      "pop": {
        "allowedCodes": [],
        "packingGroupCode": "",
        "required": true
      }
    },
    "alterations": [
      {
        "id": 1,
        "alteration": "Key 17 shows \"A13.4\" instead of \"A13.6\"",
        "tests": "Packaging paragraph (A13.4 is fuel vehicles)"
      },
      {
        "id": 2,
        "alteration": "Key 11 shows UN3166 instead of UN3171",
        "tests": "UN number for battery vs fuel powered"
      },
      {
        "id": 3,
        "alteration": "Key 12 shows \"VEHICLE, FLAMMABLE LIQUID POWERED\" but UN is UN3171",
        "tests": "PSN/UN consistency"
      }
    ]
  },
  {
    "scenario": 6,
    "unNumber": "UN3480",
    "title": "A13.7 - LITHIUM ION BATTERIES (UN3480)",
    "packagingParagraph": "A13.7",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN3480",
      "PSN": "LITHIUM ION BATTERIES (including lithium polymer batteries)",
      "Hazard Class": "9",
      "Packing Group": "None",
      "Packaging Paragraph": "A13.7",
      "Special Provisions": "P5, 388"
    },
    "expectedSddg": {
      "Key 7": "\"Passenger and Cargo Aircraft\" (P5 allows passenger aircraft)",
      "Key 11": "\"UN3480\"",
      "Key 12": "\"LITHIUM ION BATTERIES (including lithium polymer batteries)\"",
      "Key 13": "\"9\"",
      "Key 14": "Empty",
      "Key 15": "Empty (no packing group for lithium batteries)",
      "Key 16": "Net quantity + packaging (e.g., \"1 fiberboard box (4G) x 5 kg\")",
      "Key 17": "\"A13.7\""
    },
    "expectedPackage": {
      "labels": [
        "CLASS 9 (Miscellaneous Dangerous Goods)"
      ],
      "markings": [
        "UN3480",
        "PSN: \"LITHIUM ION BATTERIES\"",
        "Lithium Battery Handling Mark (Figure A14.6) with:",
        "UN3480 in the asterisk position",
        "Telephone number for additional information",
        "Watt-hour (Wh) rating marked on battery/outer case"
      ],
      "pop": {
        "allowedCodes": [],
        "packingGroupCode": "",
        "required": true
      }
    },
    "alterations": [
      {
        "id": 1,
        "alteration": "Key 15 populated with \"II\"",
        "tests": "Packing group validation (should be empty)"
      },
      {
        "id": 2,
        "alteration": "Missing Lithium Battery Handling Mark",
        "tests": "Lithium battery marking requirement"
      }
    ]
  },
  {
    "scenario": 7,
    "unNumber": "UN3536",
    "title": "A13.8 - LITHIUM BATTERIES INSTALLED IN CARGO TRANSPORT UNIT (UN3536)",
    "packagingParagraph": "A13.8",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN3536",
      "PSN": "LITHIUM BATTERIES INSTALLED IN A CARGO TRANSPORT UNIT (lithium ion batteries or lithium metal batteries)",
      "Hazard Class": "9",
      "Packing Group": "None",
      "Packaging Paragraph": "A13.8",
      "Special Provisions": "P5, 389"
    },
    "expectedSddg": {
      "Key 7": "\"Passenger and Cargo Aircraft\"",
      "Key 11": "\"UN3536\"",
      "Key 12": "\"LITHIUM BATTERIES INSTALLED IN A CARGO TRANSPORT UNIT (lithium ion batteries)\" OR \"(lithium metal batteries)\"",
      "Key 13": "\"9\"",
      "Key 14": "Empty",
      "Key 15": "Empty",
      "Key 16": "Description of cargo transport unit",
      "Key 17": "\"A13.8\""
    },
    "expectedPackage": {
      "labels": [
        "CLASS 9"
      ],
      "markings": [
        "UN3536",
        "PSN with battery type specified (ion or metal)",
        "Equipment provides equivalent protection to UN specification packaging",
        "Secure batteries in holders, protect from damage/short circuits",
        "Additional cells/batteries per A13.7.2"
      ],
      "pop": {
        "allowedCodes": [],
        "packingGroupCode": "",
        "required": true
      }
    },
    "alterations": [
      {
        "id": 1,
        "alteration": "Key 12 shows generic \"LITHIUM BATTERIES\" without specifying ion or metal",
        "tests": "PSN must specify battery chemistry"
      },
      {
        "id": 2,
        "alteration": "Key 11 shows UN3480 instead of UN3536",
        "tests": "UN number validation for cargo transport unit"
      }
    ]
  },
  {
    "scenario": 8,
    "unNumber": "UN3481",
    "title": "A13.8 - LITHIUM ION BATTERIES CONTAINED IN EQUIPMENT (UN3481)",
    "packagingParagraph": "A13.8",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN3481",
      "PSN": "LITHIUM ION BATTERIES CONTAINED IN EQUIPMENT (including lithium polymer batteries)",
      "Hazard Class": "9",
      "Packing Group": "None",
      "Packaging Paragraph": "A13.8",
      "Special Provisions": "P5, 388"
    },
    "expectedSddg": {
      "Key 7": "\"Passenger and Cargo Aircraft\"",
      "Key 11": "\"UN3481\"",
      "Key 12": "\"LITHIUM ION BATTERIES CONTAINED IN EQUIPMENT (including lithium polymer batteries)\"",
      "Key 13": "\"9\"",
      "Key 14": "Empty",
      "Key 15": "Empty",
      "Key 16": "Number + packaging (e.g., \"1 fiberboard box x 3 kg\")",
      "Key 17": "\"A13.8\""
    },
    "expectedPackage": {
      "labels": [
        "CLASS 9"
      ],
      "markings": [
        "UN3481",
        "PSN: \"LITHIUM ION BATTERIES CONTAINED IN EQUIPMENT\"",
        "Lithium Battery Handling Mark with UN3481 and telephone number",
        "Inner packagings completely enclose cells/batteries",
        "Prevent short circuits, shifting, movement",
        "PG II performance requirements for outer packaging"
      ],
      "pop": {
        "allowedCodes": [],
        "packingGroupCode": "",
        "required": true
      }
    },
    "alterations": [
      {
        "id": 1,
        "alteration": "Key 12 shows \"PACKED WITH\" but Key 17 shows \"A13.8\" (contained in)",
        "tests": "Packaging instruction must match PSN configuration"
      },
      {
        "id": 2,
        "alteration": "Lithium mark shows \"UN3480\" instead of \"UN3481\"",
        "tests": "UN match on lithium mark"
      },
      {
        "id": 3,
        "alteration": "PSN marking shows \"CONTAINED IN\" instead of \"PACKED WITH\"",
        "tests": "PSN configuration validation"
      }
    ]
  },
  {
    "scenario": 9,
    "unNumber": "UN1845",
    "title": "A13.10 - CARBON DIOXIDE, SOLID (UN1845)",
    "packagingParagraph": "A13.10",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN1845",
      "PSN": "CARBON DIOXIDE, SOLID",
      "Hazard Class": "9",
      "Packing Group": "None",
      "Packaging Paragraph": "A13.10",
      "Special Provisions": "P5"
    },
    "expectedSddg": {
      "Key 7": "\"Passenger and Cargo Aircraft\"",
      "Key 11": "\"UN1845\"",
      "Key 12": "\"CARBON DIOXIDE, SOLID\" or \"DRY ICE\"",
      "Key 13": "\"9\"",
      "Key 14": "Empty",
      "Key 15": "Empty (no packing group for dry ice)",
      "Key 16": "Net mass of dry ice (e.g., \"1 polystyrene container x 10 kg\")",
      "Key 17": "\"A13.10\""
    },
    "expectedPackage": {
      "labels": [
        "CLASS 9"
      ],
      "markings": [
        "UN1845",
        "PSN: \"CARBON DIOXIDE, SOLID\" or \"DRY ICE\"",
        "**Net mass of dry ice** (e.g., \"NET MASS 10 kg\")",
        "Packaging must permit release of CO2 gas",
        "Must NOT be hermetically sealed",
        "Store in well-ventilated areas only"
      ],
      "pop": {
        "allowedCodes": [],
        "packingGroupCode": "",
        "required": true
      }
    },
    "alterations": [
      {
        "id": 1,
        "alteration": "Missing net mass of dry ice marking",
        "tests": "Dry ice net mass requirement (A14.4.8.4)"
      },
      {
        "id": 2,
        "alteration": "Key 15 shows \"III\"",
        "tests": "Packing group validation (dry ice has none)"
      },
      {
        "id": 3,
        "alteration": "Package appears hermetically sealed",
        "tests": "Packaging venting requirement"
      }
    ]
  },
  {
    "scenario": 10,
    "unNumber": "UN2807",
    "title": "A13.11 - MAGNETIZED MATERIAL (UN2807)",
    "packagingParagraph": "A13.11",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN2807",
      "PSN": "MAGNETIZED MATERIAL",
      "Hazard Class": "9",
      "Packing Group": "None",
      "Packaging Paragraph": "A13.11",
      "Special Provisions": "P5"
    },
    "expectedSddg": {
      "Key 7": "\"Passenger and Cargo Aircraft\"",
      "Key 11": "\"UN2807\"",
      "Key 12": "\"MAGNETIZED MATERIAL\"",
      "Key 13": "\"9\"",
      "Key 14": "Empty",
      "Key 15": "Empty",
      "Key 16": "Number + packaging (no net quantity required)",
      "Key 17": "\"A13.11\""
    },
    "expectedPackage": {
      "labels": [
        "**MAGNETIZED MATERIAL label ONLY** (NOT the CLASS 9 label per A15.3.3)"
      ],
      "markings": [
        "UN2807",
        "PSN: \"MAGNETIZED MATERIAL\"",
        "Field strength must not exceed 5.25 milligauss at 15 feet (4.6 m)",
        "Minimum 4 inches (102 mm) between magnetic surface and outside of package",
        "Store \u22654.6 m from compass sensing devices"
      ],
      "pop": {
        "allowedCodes": [],
        "packingGroupCode": "",
        "required": true
      }
    },
    "alterations": [
      {
        "id": 1,
        "alteration": "CLASS 9 label applied instead of Magnetized Material label",
        "tests": "Label type validation (magnetized material uses special label)"
      },
      {
        "id": 2,
        "alteration": "Both CLASS 9 and Magnetized Material labels present",
        "tests": "Only magnetized label should be present (per A15.3.3)"
      },
      {
        "id": 3,
        "alteration": "Missing Magnetized Material label entirely",
        "tests": "Required label validation"
      }
    ]
  },
  {
    "scenario": 11,
    "unNumber": "UN3072",
    "title": "A13.12 - LIFE-SAVING APPLIANCES, NOT SELF INFLATING (UN3072)",
    "packagingParagraph": "A13.12",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN3072",
      "PSN": "LIFE-SAVING APPLIANCES, NOT SELF INFLATING (containing dangerous goods as equipment)",
      "Hazard Class": "9",
      "Packing Group": "None",
      "Packaging Paragraph": "A13.12",
      "Special Provisions": "P5, 182"
    },
    "expectedSddg": {
      "Key 7": "\"Passenger and Cargo Aircraft\"",
      "Key 11": "\"UN3072\"",
      "Key 12": "\"LIFE-SAVING APPLIANCES, NOT SELF INFLATING\"",
      "Key 13": "\"9\"",
      "Key 14": "Empty",
      "Key 15": "Empty",
      "Key 16": "Number + description (e.g., \"1 fiberboard box x 3 life vests\")",
      "Key 17": "\"A13.12\""
    },
    "expectedPackage": {
      "labels": [
        "CLASS 9"
      ],
      "markings": [
        "UN3072",
        "PSN: \"LIFE-SAVING APPLIANCES, NOT SELF INFLATING\"",
        "Weather-resistant fiberboard or strong outer container",
        "Inner packaging to prevent accidental activation",
        "Suitably cushioned",
        "Store in cool, well-ventilated areas away from fire hazards"
      ],
      "pop": {
        "allowedCodes": [],
        "packingGroupCode": "",
        "required": true
      }
    },
    "alterations": [
      {
        "id": 1,
        "alteration": "Key 11 shows UN2990 instead of UN3072",
        "tests": "UN number validation (2990 is SELF-INFLATING)"
      },
      {
        "id": 2,
        "alteration": "Key 12 shows \"SELF INFLATING\" instead of \"NOT SELF INFLATING\"",
        "tests": "PSN accuracy"
      },
      {
        "id": 3,
        "alteration": "Key 17 shows \"A13.4\" instead of \"A13.12\"",
        "tests": "Packaging instruction validation"
      }
    ]
  },
  {
    "scenario": 12,
    "unNumber": "UN3363",
    "title": "A13.13 - DANGEROUS GOODS IN APPARATUS (UN3363)",
    "packagingParagraph": "A13.13",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN3363",
      "PSN": "DANGEROUS GOODS IN APPARATUS",
      "Hazard Class": "9",
      "Packing Group": "None",
      "Packaging Paragraph": "A13.13",
      "Special Provisions": "P5"
    },
    "expectedSddg": {
      "Key 7": "\"Passenger and Cargo Aircraft\"",
      "Key 11": "\"UN3363\"",
      "Key 12": "\"DANGEROUS GOODS IN APPARATUS\"",
      "Key 13": "\"9\"",
      "Key 14": "Empty",
      "Key 15": "Empty",
      "Key 16": "Apparatus description + quantity",
      "Key 17": "\"A13.13\""
    },
    "expectedPackage": {
      "labels": [
        "CLASS 9"
      ],
      "markings": [
        "UN3363",
        "PSN: \"DANGEROUS GOODS IN APPARATUS\"",
        "Strong outer packaging (unless apparatus provides equivalent protection)",
        "Only hazardous materials permitted as limited quantities (A19.3) or Division 2.2 gases",
        "Solids: \u22641 kg per package",
        "Liquids: \u2264500 ml per package",
        "Class 2.2 gases: \u22640.5 kg per package"
      ],
      "pop": {
        "allowedCodes": [],
        "packingGroupCode": "",
        "required": true
      }
    },
    "alterations": [
      {
        "id": 1,
        "alteration": "Key 15 shows \"III\"",
        "tests": "Packing group validation (should be empty)"
      },
      {
        "id": 2,
        "alteration": "Package contains >1 kg of solid hazardous material",
        "tests": "Quantity limitation (1 kg max for solids)"
      },
      {
        "id": 3,
        "alteration": "Key 12 shows \"DANGEROUS GOODS IN MACHINERY\" instead of \"APPARATUS\"",
        "tests": "PSN accuracy"
      }
    ]
  },
  {
    "scenario": 13,
    "unNumber": "UN2328",
    "title": "A10.4 - TRIMETHYLHEXAMETHYLENE DIISOCYANATE (UN2328)",
    "packagingParagraph": "A10.4",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN2328",
      "PSN": "TRIMETHYLHEXAMETHYLENE DIISOCYANATE",
      "Hazard Class": "6.1",
      "Subsidiary Risk": "None",
      "Packing Group": "III",
      "Packaging Paragraph": "A10.4",
      "Special Provisions": "P5"
    },
    "expectedSddg": {
      "Key 7": "\"Passenger and Cargo Aircraft\"",
      "Key 11": "\"UN2328\"",
      "Key 12": "\"TRIMETHYLHEXAMETHYLENE DIISOCYANATE\"",
      "Key 13": "\"6.1\"",
      "Key 14": "Empty",
      "Key 15": "\"III\"",
      "Key 16": "Net quantity + packaging (e.g., \"1 drum (1H1) x 50 L\")",
      "Key 17": "\"A10.4\""
    },
    "expectedPackage": {
      "labels": [
        "TOXIC (Class 6.1)"
      ],
      "markings": [
        "UN2328",
        "PSN: \"TRIMETHYLHEXAMETHYLENE DIISOCYANATE\"",
        "Any appropriate non-bulk packaging meeting Attachment 3 requirements",
        "Not liquid-full at 54C (130F) for containers \u2264208 L",
        "If vapor pressure >110 kPa at 38C: Primary packaging must withstand vapor pressure at 54C"
      ],
      "pop": {
        "allowedCodes": [],
        "packingGroupCode": "Z",
        "required": true
      }
    },
    "alterations": [
      {
        "id": 1,
        "alteration": "Key 15 empty",
        "tests": "Packing group required for this material"
      },
      {
        "id": 2,
        "alteration": "POP marking shows \"Y\" instead of \"Z\"",
        "tests": "PG III requires Z code"
      },
      {
        "id": 3,
        "alteration": "Missing POP marking entirely",
        "tests": "POP marking required for PG III material"
      }
    ]
  },
  {
    "scenario": 14,
    "unNumber": "NA2212",
    "title": "A13.16 - ASBESTOS, AMPHIBOLE (NA2212)",
    "packagingParagraph": "A13.16",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "NA2212",
      "PSN": "ASBESTOS",
      "Hazard Class": "9",
      "Packing Group": "III",
      "Packaging Paragraph": "A13.16",
      "Special Provisions": "P5, 156"
    },
    "expectedSddg": {
      "Key 7": "\"Passenger and Cargo Aircraft\"",
      "Key 11": "\"NA2212\"",
      "Key 12": "\"ASBESTOS\"",
      "Key 13": "\"9\"",
      "Key 14": "Empty",
      "Key 15": "\"III\"",
      "Key 16": "Net quantity + packaging (e.g., \"1 fiberboard box x 20 kg\")",
      "Key 17": "\"A13.16\""
    },
    "expectedPackage": {
      "labels": [
        "CLASS 9"
      ],
      "markings": [
        "NA2212",
        "PSN: \"ASBESTOS\"",
        "Dust and sift-proof packaging",
        "Rigid, leak-tight packaging (metal, plastic, or fiber drums)",
        "Or dust-proof bags palletized and unitized",
        "Minimize occupational exposure to airborne particles"
      ],
      "pop": {
        "allowedCodes": [],
        "packingGroupCode": "Z",
        "required": true
      }
    },
    "alterations": [
      {
        "id": 1,
        "alteration": "Key 11 shows \"UN2212\" instead of \"NA2212\"",
        "tests": "Prefix validation (NA for North American)"
      },
      {
        "id": 2,
        "alteration": "Key 15 shows \"II\" instead of \"III\"",
        "tests": "Packing group accuracy"
      },
      {
        "id": 3,
        "alteration": "POP marking shows \"Y\" instead of \"Z\"",
        "tests": "PG III requires Z code"
      }
    ]
  },
  {
    "scenario": 15,
    "unNumber": "UN2590",
    "title": "A13.16 - WHITE ASBESTOS (UN2590)",
    "packagingParagraph": "A13.16",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN2590",
      "PSN": "ASBESTOS, CHRYSOTILE",
      "Hazard Class": "9",
      "Packing Group": "III",
      "Packaging Paragraph": "A13.16",
      "Special Provisions": "P5"
    },
    "expectedSddg": {
      "Key 7": "\"Passenger and Cargo Aircraft\"",
      "Key 11": "\"UN2590\"",
      "Key 12": "\"ASBESTOS, CHRYSOTILE\"",
      "Key 13": "\"9\"",
      "Key 14": "Empty",
      "Key 15": "\"III\"",
      "Key 16": "Net quantity + packaging",
      "Key 17": "\"A13.16\""
    },
    "expectedPackage": {
      "labels": [
        "CLASS 9"
      ],
      "markings": [
        "UN2590",
        "PSN: \"ASBESTOS, CHRYSOTILE\"",
        "Rigid, leak-tight packaging",
        "Dust and sift-proof bags in strong outer fiberboard/wooden boxes",
        "Palletized and unitized (shrink-wrapped) acceptable"
      ],
      "pop": {
        "allowedCodes": [],
        "packingGroupCode": "Z",
        "required": true
      }
    },
    "alterations": [
      {
        "id": 1,
        "alteration": "Key 12 missing specific asbestos type in parentheses",
        "tests": "PSN completeness"
      },
      {
        "id": 2,
        "alteration": "Key 15 empty",
        "tests": "Packing group required for this material"
      },
      {
        "id": 3,
        "alteration": "Key 17 shows \"A13.15\" instead of \"A13.16\"",
        "tests": "Packaging paragraph validation"
      }
    ]
  },
  {
    "scenario": 16,
    "unNumber": "UN3314",
    "title": "A13.17 - PLASTIC MOULDING COMPOUND (UN3314)",
    "packagingParagraph": "A13.17",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN3314",
      "PSN": "PLASTIC MOULDING COMPOUND (in dough, sheet, or extruded rope form evolving flammable vapor)",
      "Hazard Class": "9",
      "Packing Group": "III",
      "Packaging Paragraph": "A13.17",
      "Special Provisions": "P5"
    },
    "expectedSddg": {
      "Key 7": "\"Passenger and Cargo Aircraft\"",
      "Key 11": "\"UN3314\"",
      "Key 12": "\"PLASTIC MOULDING COMPOUND\"",
      "Key 13": "\"9\"",
      "Key 14": "Empty",
      "Key 15": "\"III\"",
      "Key 16": "Net quantity + packaging (e.g., \"1 drum (1G) x 25 kg\")",
      "Key 17": "\"A13.17\""
    },
    "expectedPackage": {
      "labels": [
        "CLASS 9"
      ],
      "markings": [
        "UN3314",
        "PSN: \"PLASTIC MOULDING COMPOUND\"",
        "Inner: Sealed plastic liner",
        "Outer: Boxes (4A, 4B, 4C1, 4C2, 4D, 4F, 4G, 4H1, 4H2, 4N) or drums (1D, 1G)",
        "Alternative: Vapor-tight metal/plastic drums without liner"
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
        "packingGroupCode": "Z",
        "required": true
      }
    },
    "alterations": [
      {
        "id": 1,
        "alteration": "Key 15 empty",
        "tests": "Packing group required"
      },
      {
        "id": 2,
        "alteration": "POP marking shows \"Y\" instead of \"Z\"",
        "tests": "PG III requires Z code"
      },
      {
        "id": 3,
        "alteration": "Key 13 shows \"3\" instead of \"9\"",
        "tests": "Hazard class validation (not Class 3 flammable)"
      }
    ]
  },
  {
    "scenario": 17,
    "unNumber": "UN3316",
    "title": "A13.18 - CHEMICAL KIT (UN3316)",
    "packagingParagraph": "A13.18",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN3316",
      "PSN": "CHEMICAL KIT",
      "Hazard Class": "9",
      "Packing Group": "None (determined by most restrictive inner)",
      "Packaging Paragraph": "A13.18",
      "Special Provisions": "P5"
    },
    "expectedSddg": {
      "Key 7": "\"Passenger and Cargo Aircraft\"",
      "Key 11": "\"UN3316\"",
      "Key 12": "\"CHEMICAL KIT\"",
      "Key 13": "\"9\"",
      "Key 14": "Empty",
      "Key 15": "Empty (or most restrictive PG if assigned)",
      "Key 16": "Number + packaging (e.g., \"2 wooden boxes x 5 kg\")",
      "Key 17": "\"A13.18\""
    },
    "expectedPackage": {
      "labels": [
        "CLASS 9"
      ],
      "markings": [
        "UN3316",
        "PSN: \"CHEMICAL KIT\"",
        "Inner packaging: \u2264250 ml for liquids, \u2264250 g for solids",
        "Per kit total: \u22641 L liquids or \u22641 kg solids",
        "Per package total: \u226410 kg dangerous goods",
        "Only limited quantities (A19.3.2) and excepted quantities (A19.2) authorized"
      ],
      "pop": {
        "allowedCodes": [],
        "packingGroupCode": "",
        "required": true
      }
    },
    "alterations": [
      {
        "id": 1,
        "alteration": "Key 12 shows \"FIRST AID KIT\" instead of \"CHEMICAL KIT\"",
        "tests": "PSN distinction (different material)"
      },
      {
        "id": 2,
        "alteration": "Package exceeds 10 kg total dangerous goods",
        "tests": "Quantity limitation validation"
      },
      {
        "id": 3,
        "alteration": "Inner receptacle exceeds 250 ml liquid limit",
        "tests": "Inner packaging limitation"
      }
    ]
  },
  {
    "scenario": 18,
    "unNumber": "UN3508",
    "title": "A13.19 - CAPACITOR, ASYMMETRIC (UN3508)",
    "packagingParagraph": "A13.19",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN3508",
      "PSN": "CAPACITOR, ASYMMETRIC (with an energy storage capacity greater than 0.3 Wh)",
      "Hazard Class": "9",
      "Packing Group": "None",
      "Packaging Paragraph": "A13.19",
      "Special Provisions": "P5"
    },
    "expectedSddg": {
      "Key 7": "\"Passenger and Cargo Aircraft\"",
      "Key 11": "\"UN3508\"",
      "Key 12": "\"CAPACITOR, ASYMMETRIC\"",
      "Key 13": "\"9\"",
      "Key 14": "Empty",
      "Key 15": "Empty",
      "Key 16": "Number + packaging (e.g., \"10 fiberboard boxes x 2 kg\")",
      "Key 17": "\"A13.19\""
    },
    "expectedPackage": {
      "labels": [
        "CLASS 9"
      ],
      "markings": [
        "UN3508",
        "PSN: \"CAPACITOR, ASYMMETRIC\"",
        "**Energy storage capacity in Wh** marked on capacitor",
        "Not installed in equipment: Must be uncharged during transport",
        "Protect against short circuit:",
        "\u226410 Wh: Protect or fit metal strap",
        ">10 Wh: Fit metal strap connecting terminals",
        "Design to withstand 95 kPa pressure differential (if electrolyte meets hazard definition)"
      ],
      "pop": {
        "allowedCodes": [],
        "packingGroupCode": "",
        "required": true
      }
    },
    "alterations": [
      {
        "id": 1,
        "alteration": "Key 15 shows \"II\"",
        "tests": "Packing group validation (capacitors have none)"
      },
      {
        "id": 2,
        "alteration": "Missing Wh energy storage marking on capacitor",
        "tests": "Wh rating requirement"
      },
      {
        "id": 3,
        "alteration": "Key 12 shows just \"CAPACITOR\" without \"ASYMMETRIC\"",
        "tests": "PSN completeness"
      }
    ]
  },
  {
    "scenario": 19,
    "unNumber": "UN3530",
    "title": "A13.20 - ENGINE, INTERNAL COMBUSTION (UN3530)",
    "packagingParagraph": "A13.20",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN3530",
      "PSN": "ENGINE, INTERNAL COMBUSTION",
      "Hazard Class": "9",
      "Packing Group": "None",
      "Packaging Paragraph": "A13.20",
      "Special Provisions": "P5, 135, A87"
    },
    "expectedSddg": {
      "Key 7": "\"Passenger and Cargo Aircraft\"",
      "Key 11": "\"UN3530\"",
      "Key 12": "\"ENGINE, INTERNAL COMBUSTION\"",
      "Key 13": "\"9\"",
      "Key 14": "Empty",
      "Key 15": "Empty",
      "Key 16": "Engine description (e.g., \"2 generators\")",
      "Key 17": "\"A13.20\"",
      "Key 19": "Accessorial hazards (fuel, batteries)"
    },
    "expectedPackage": {
      "labels": [
        "CLASS 9 (only if packaged/crated; exempt if readily identifiable per A14.3.15)"
      ],
      "markings": [
        "UN3530 (only if packaged/crated)",
        "PSN: \"ENGINE, INTERNAL COMBUSTION\" (only if packaged/crated)",
        "Completely drain fuel; \u2264500 ml residual allowed in components/fuel lines",
        "All lines/tanks securely closed",
        "Chapter 3 authority (wheeled): Up to 1/2 tank",
        "Batteries: Upright in designed holders, terminals protected",
        "If drained and purged per technical manual: May be nonhazardous (A3.1.16.4)"
      ],
      "pop": {
        "allowedCodes": [],
        "packingGroupCode": "",
        "required": true
      }
    },
    "alterations": [
      {
        "id": 1,
        "alteration": "Key 11 shows UN3528 instead of UN3530",
        "tests": "UN number validation (3528 is fuel cell engine)"
      },
      {
        "id": 2,
        "alteration": "Key 15 shows \"III\"",
        "tests": "Packing group validation (engines have none)"
      },
      {
        "id": 3,
        "alteration": "Key 19 missing accessorial hazards (fuel, batteries)",
        "tests": "Accessorial hazard documentation"
      }
    ]
  }
];
