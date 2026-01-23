// Auto-generated from class5-packaging-paragraphs.md. Do not edit by hand.
export type Class5ScenarioFixture = {
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

export const class5ScenarioFixtures: Class5ScenarioFixture[] = 
[
  {
    "scenario": 1,
    "unNumber": "UN3149",
    "title": "A9.5 - HYDROGEN PEROXIDE AND PEROXYACETIC ACID MIXTURES, STABILIZED",
    "packagingParagraph": "A9.5",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN3149",
      "PSN": "HYDROGEN PEROXIDE AND PEROXYACETIC ACID MIXTURES, STABILIZED",
      "Details": "with acids, water and 5% or less peroxyacetic acid",
      "Hazard Class": "5.1",
      "Packing Group": "II",
      "Subsidiary Risk": "8 (Corrosive)",
      "Packaging Paragraph": "A9.5",
      "Special Provisions": "P5, A2, A3",
      "Technical Name Required": "No"
    },
    "expectedSddg": {
      "Key 7": "\"Passenger and Cargo\" (P5 provision)",
      "Key 11": "\"UN3149\"",
      "Key 12": "\"HYDROGEN PEROXIDE AND PEROXYACETIC ACID MIXTURES, STABILIZED with acids, water and 5% or less peroxyacetic acid\"",
      "Key 13": "\"5.1\"",
      "Key 14": "\"8\"",
      "Key 15": "\"II\"",
      "Key 16": "Net quantity + packaging (e.g., \"2 plastic jerricans (3H1) x 10 L\")",
      "Key 17": "\"A9.5\""
    },
    "expectedPackage": {
      "labels": [
        "OXIDIZER 5.1 (primary) - yellow diamond, flame over circle, \"5.1\" in bottom corner",
        "CORROSIVE 8 (subsidiary)"
      ],
      "markings": [
        "UN3149 (minimum 12mm height for packages > 30L)",
        "PSN: \"HYDROGEN PEROXIDE AND PEROXYACETIC ACID MIXTURES, STABILIZED\"",
        "Military Shipping Label (MSL)",
        "Orientation arrows (liquid in combination packaging)"
      ],
      "pop": {
        "allowedCodes": [
          "1A1",
          "1B1",
          "1H1",
          "1N1",
          "3A1",
          "3A2",
          "3B1",
          "3B2",
          "3H1",
          "3H2"
        ],
        "packingGroupCode": "XorY"
      }
    },
    "alterations": [
      {
        "id": 1,
        "alteration": "Missing CORROSIVE 8 subsidiary label",
        "tests": "Subsidiary label validation for 5.1 with 8 subsidiary"
      },
      {
        "id": 2,
        "alteration": "POP marking shows code \"Z\"",
        "tests": "PG code validation (PG II requires X or Y)"
      },
      {
        "id": 3,
        "alteration": "Key 14 empty instead of \"8\"",
        "tests": "Subsidiary hazard documentation on SDDG"
      },
      {
        "id": 4,
        "alteration": "Missing orientation arrows",
        "tests": "Liquid packaging orientation marking requirement"
      },
      {
        "id": 5,
        "alteration": "Key 17 shows \"A9.6\" (solids) instead of \"A9.5\" (liquids)",
        "tests": "Packaging paragraph validation for liquid material"
      }
    ]
  },
  {
    "scenario": 2,
    "unNumber": "UN1438",
    "title": "A9.6 - ALUMINIUM NITRATE",
    "packagingParagraph": "A9.6",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN1438",
      "PSN": "ALUMINIUM NITRATE",
      "Hazard Class": "5.1",
      "Packing Group": "III",
      "Subsidiary Risk": "None",
      "Packaging Paragraph": "A9.6",
      "Special Provisions": "P5, A1, A29",
      "Technical Name Required": "No"
    },
    "expectedSddg": {
      "Key 7": "\"Passenger and Cargo\" (P5 provision)",
      "Key 11": "\"UN1438\"",
      "Key 12": "\"ALUMINIUM NITRATE\"",
      "Key 13": "\"5.1\"",
      "Key 14": "Empty (no subsidiary)",
      "Key 15": "\"III\"",
      "Key 16": "Net quantity + packaging (e.g., \"4 fiberboard boxes (4G) x 25 kg\")",
      "Key 17": "\"A9.6\""
    },
    "expectedPackage": {
      "labels": [
        "OXIDIZER 5.1 (yellow diamond, flame over circle, \"5.1\" in bottom corner)"
      ],
      "markings": [
        "UN1438 (minimum 12mm height for packages > 30 kg)",
        "PSN: \"ALUMINIUM NITRATE\"",
        "Military Shipping Label (MSL)"
      ],
      "pop": {
        "allowedCodes": [
          "1A1",
          "1A2",
          "1G",
          "1H2",
          "4A",
          "4B",
          "4G",
          "4N",
          "5H1",
          "5H2",
          "5L1",
          "5M2"
        ],
        "packingGroupCode": "X,Y,orZ"
      }
    },
    "alterations": [
      {
        "id": 1,
        "alteration": "Key 15 shows \"II\" instead of \"III\"",
        "tests": "Packing group accuracy validation"
      },
      {
        "id": 2,
        "alteration": "PSN spelled \"ALUMINUM NITRATE\" (American spelling)",
        "tests": "PSN spelling validation (AFMAN uses British spelling)"
      },
      {
        "id": 3,
        "alteration": "Label missing \"5.1\" division number",
        "tests": "Division number on OXIDIZER label"
      },
      {
        "id": 4,
        "alteration": "Key 15 empty",
        "tests": "Packing group required validation for 5.1"
      },
      {
        "id": 5,
        "alteration": "Key 17 shows \"A9.5\" (liquids) instead of \"A9.6\" (solids)",
        "tests": "Packaging paragraph for solid material"
      }
    ]
  },
  {
    "scenario": 3,
    "unNumber": "UN2495",
    "title": "A9.7 - IODINE PENTAFLUORIDE",
    "packagingParagraph": "A9.7",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN2495",
      "PSN": "IODINE PENTAFLUORIDE",
      "Hazard Class": "5.1",
      "Packing Group": "I",
      "Subsidiary Risk": "6.1 (Toxic), 8 (Corrosive)",
      "Packaging Paragraph": "A9.7",
      "Special Provisions": "P3",
      "Technical Name Required": "No"
    },
    "expectedSddg": {
      "Key 7": "\"Cargo Aircraft Only\" (P3 provision)",
      "Key 11": "\"UN2495\"",
      "Key 12": "\"IODINE PENTAFLUORIDE\"",
      "Key 13": "\"5.1\"",
      "Key 14": "\"6.1, 8\"",
      "Key 15": "\"I\"",
      "Key 16": "Net quantity + packaging (e.g., \"1 cylinder (3AA) x 5 kg\")",
      "Key 17": "\"A9.7\""
    },
    "expectedPackage": {
      "labels": [
        "OXIDIZER 5.1 (primary)",
        "TOXIC 6.1 (subsidiary)",
        "CORROSIVE 8 (subsidiary)",
        "CARGO AIRCRAFT ONLY (P3 provision)"
      ],
      "markings": [
        "UN2495 (minimum 12mm height)",
        "PSN: \"IODINE PENTAFLUORIDE\"",
        "Military Shipping Label (MSL)"
      ],
      "pop": {
        "allowedCodes": [
          "3A",
          "3AA",
          "3B",
          "3E",
          "4B",
          "4BA",
          "4BW",
          "8AL"
        ],
        "packingGroupCode": "Xonly"
      }
    },
    "alterations": [
      {
        "id": 1,
        "alteration": "POP marking shows drum code \"1A1\" instead of cylinder",
        "tests": "Cylinder-only packaging validation for A9.7"
      },
      {
        "id": 2,
        "alteration": "Missing TOXIC 6.1 subsidiary label",
        "tests": "Multiple subsidiary label validation"
      },
      {
        "id": 3,
        "alteration": "Missing CORROSIVE 8 subsidiary label",
        "tests": "Multiple subsidiary label validation"
      },
      {
        "id": 4,
        "alteration": "POP marking shows packing group \"Y\"",
        "tests": "PG validation (PG I requires X only)"
      },
      {
        "id": 5,
        "alteration": "Key 7 shows \"Passenger and Cargo\"",
        "tests": "Aircraft limitation validation for P3 material"
      },
      {
        "id": 6,
        "alteration": "Missing CARGO AIRCRAFT ONLY label",
        "tests": "CAO label requirement for P3"
      },
      {
        "id": 7,
        "alteration": "Key 14 shows \"6.1\" only, missing \"8\"",
        "tests": "Subsidiary documentation completeness"
      }
    ]
  },
  {
    "scenario": 4,
    "unNumber": "UN3137",
    "title": "A9.8 - OXIDIZING SOLID, FLAMMABLE, N.O.S.",
    "packagingParagraph": "A9.8",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN3137",
      "PSN": "OXIDIZING SOLID, FLAMMABLE, N.O.S.",
      "Hazard Class": "5.1",
      "Packing Group": "I",
      "Subsidiary Risk": "4.1 (Flammable Solid)",
      "Packaging Paragraph": "A9.8",
      "Special Provisions": "P4, 62",
      "Technical Name Required": "**Yes**"
    },
    "expectedSddg": {
      "Key 7": "\"Cargo Aircraft Only\" (P4 provision)",
      "Key 11": "\"UN3137\"",
      "Key 12": "\"OXIDIZING SOLID, FLAMMABLE, N.O.S. (Technical Name)\"",
      "Key 13": "\"5.1\"",
      "Key 14": "\"4.1\"",
      "Key 15": "\"I\"",
      "Key 16": "Net quantity + packaging (per CAA)",
      "Key 17": "\"A9.8\" (and/or CAA reference)"
    },
    "expectedPackage": {
      "labels": [
        "OXIDIZER 5.1 (primary)",
        "FLAMMABLE SOLID 4.1 (subsidiary)",
        "CARGO AIRCRAFT ONLY (P4 provision)"
      ],
      "markings": [
        "UN3137 (minimum 12mm height)",
        "PSN: \"OXIDIZING SOLID, FLAMMABLE, N.O.S.\"",
        "**Technical name in parentheses** (REQUIRED for N.O.S.)",
        "Military Shipping Label (MSL)"
      ],
      "pop": {
        "allowedCodes": [],
        "packingGroupCode": "Xonly"
      }
    },
    "alterations": [
      {
        "id": 1,
        "alteration": "Key 12 missing technical name",
        "tests": "N.O.S. technical name requirement"
      },
      {
        "id": 2,
        "alteration": "Package marking missing technical name",
        "tests": "Package marking completeness for N.O.S."
      },
      {
        "id": 3,
        "alteration": "Missing FLAMMABLE SOLID 4.1 subsidiary label",
        "tests": "Subsidiary label for 4.1"
      },
      {
        "id": 4,
        "alteration": "POP marking shows packing group \"Y\"",
        "tests": "PG validation (PG I requires X only)"
      },
      {
        "id": 5,
        "alteration": "Key 7 shows \"Passenger and Cargo\"",
        "tests": "Aircraft limitation validation for P4"
      },
      {
        "id": 6,
        "alteration": "Missing CARGO AIRCRAFT ONLY label",
        "tests": "CAO label requirement for P4"
      },
      {
        "id": 7,
        "alteration": "Key 14 empty instead of \"4.1\"",
        "tests": "Subsidiary hazard documentation"
      },
      {
        "id": 8,
        "alteration": "Technical name format wrong - no parentheses",
        "tests": "Technical name format validation"
      }
    ]
  },
  {
    "scenario": 5,
    "unNumber": "UN1745",
    "title": "A9.9 - BROMINE PENTAFLUORIDE",
    "packagingParagraph": "A9.9",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN1745",
      "PSN": "BROMINE PENTAFLUORIDE",
      "Hazard Class": "5.1",
      "Packing Group": "I",
      "Subsidiary Risk": "6.1 (Toxic), 8 (Corrosive)",
      "Packaging Paragraph": "A9.9",
      "Special Provisions": "P1, 1",
      "Technical Name Required": "No",
      "isFixed": "true"
    },
    "expectedSddg": {
      "Key 7": "\"Cargo Aircraft Only\" (P1 provision)",
      "Key 11": "\"UN1745\"",
      "Key 12": "\"BROMINE PENTAFLUORIDE\"",
      "Key 13": "\"5.1\"",
      "Key 14": "\"6.1, 8\"",
      "Key 15": "\"I\"",
      "Key 16": "Net quantity + specific cylinder spec (e.g., \"1 cylinder (3AA150) x 10 kg\")",
      "Key 17": "\"A9.9\""
    },
    "expectedPackage": {
      "labels": [
        "OXIDIZER 5.1 (primary)",
        "TOXIC 6.1 (subsidiary)",
        "CORROSIVE 8 (subsidiary)",
        "CARGO AIRCRAFT ONLY (P1 provision)"
      ],
      "markings": [
        "UN1745 (minimum 12mm height)",
        "PSN: \"BROMINE PENTAFLUORIDE\"",
        "Military Shipping Label (MSL)",
        "For 3E1800 cylinders: Outer packaging marked \"INSIDE CONTAINERS COMPLY WITH PRESCRIBED SPECIFICATIONS\""
      ],
      "pop": {
        "allowedCodes": [],
        "packingGroupCode": "Xonly"
      }
    },
    "alterations": [
      {
        "id": 1,
        "alteration": "POP marking shows generic cylinder \"3A\" without pressure rating",
        "tests": "Specific cylinder spec validation for A9.9"
      },
      {
        "id": 2,
        "alteration": "POP marking shows drum code \"1A1\"",
        "tests": "Cylinder-only packaging validation"
      },
      {
        "id": 3,
        "alteration": "Missing TOXIC 6.1 subsidiary label",
        "tests": "Multiple subsidiary label validation"
      },
      {
        "id": 4,
        "alteration": "Missing CORROSIVE 8 subsidiary label",
        "tests": "Multiple subsidiary label validation"
      },
      {
        "id": 5,
        "alteration": "POP marking shows packing group \"Y\"",
        "tests": "PG validation (PG I requires X only)"
      },
      {
        "id": 6,
        "alteration": "Key 7 shows \"Passenger and Cargo\"",
        "tests": "Aircraft limitation validation for P1 (most restrictive)"
      },
      {
        "id": 7,
        "alteration": "Missing CARGO AIRCRAFT ONLY label",
        "tests": "CAO label requirement for P1"
      },
      {
        "id": 8,
        "alteration": "For 3E1800: Missing \"INSIDE CONTAINERS COMPLY WITH PRESCRIBED SPECIFICATIONS\"",
        "tests": "Special marking for 3E1800 overpack"
      }
    ]
  },
  {
    "scenario": 6,
    "unNumber": "UN3356",
    "title": "A9.10 - OXYGEN GENERATORS, CHEMICAL",
    "packagingParagraph": "A9.10",
    "materialDetails": {
      "Field": "Value",
      "UN Number": "UN3356",
      "PSN": "OXYGEN GENERATORS, CHEMICAL",
      "Details": "including when contained in associated equipment, e.g., passenger service units (PSU's) portable breathing equipment (PBE) etc.",
      "Hazard Class": "5.1",
      "Packing Group": "II",
      "Subsidiary Risk": "None",
      "Packaging Paragraph": "A9.10",
      "Special Provisions": "P4, 60",
      "Technical Name Required": "No"
    },
    "expectedSddg": {
      "Key 7": "\"Cargo Aircraft Only\" (P4 provision)",
      "Key 11": "\"UN3356\"",
      "Key 12": "\"OXYGEN GENERATORS, CHEMICAL\" (may include equipment description)",
      "Key 13": "\"5.1\"",
      "Key 14": "Empty (no subsidiary)",
      "Key 15": "\"II\"",
      "Key 16": "Net quantity + packaging (e.g., \"2 fiberboard boxes (4G) x 0.5 kg\")",
      "Key 17": "\"A9.10\""
    },
    "expectedPackage": {
      "labels": [
        "OXIDIZER 5.1",
        "CARGO AIRCRAFT ONLY (P4 provision)"
      ],
      "markings": [
        "UN3356 (minimum 12mm height)",
        "PSN: \"OXYGEN GENERATORS, CHEMICAL\"",
        "**Outside surface marking**: \"oxygen generator, chemical\" (A14.4.4)",
        "If in equipment (e.g., sealed PSU): **\"Oxygen Generator Inside\"**",
        "Military Shipping Label (MSL)"
      ],
      "pop": {
        "allowedCodes": [],
        "packingGroupCode": "XorY"
      }
    },
    "alterations": [
      {
        "id": 1,
        "alteration": "Missing \"oxygen generator, chemical\" outside surface marking",
        "tests": "Special marking requirement for oxygen generators"
      },
      {
        "id": 2,
        "alteration": "Equipment containing generator missing \"Oxygen Generator Inside\" marking",
        "tests": "Equipment marking requirement"
      },
      {
        "id": 3,
        "alteration": "POP marking shows packing group \"Z\"",
        "tests": "PG code validation (PG II requires X or Y)"
      },
      {
        "id": 4,
        "alteration": "Key 7 shows \"Passenger and Cargo\"",
        "tests": "Aircraft limitation validation for P4"
      },
      {
        "id": 5,
        "alteration": "Missing CARGO AIRCRAFT ONLY label",
        "tests": "CAO label requirement for P4"
      },
      {
        "id": 6,
        "alteration": "Oxygen generator past expiration date",
        "tests": "Expiration date validation (FORBIDDEN for air transport)"
      },
      {
        "id": 7,
        "alteration": "Generator contents already expended",
        "tests": "Expended generator validation (FORBIDDEN for air transport)"
      },
      {
        "id": 8,
        "alteration": "Key 15 empty",
        "tests": "Packing group required for 5.1"
      }
    ]
  }
];
