import { Pre1015Question, WorkflowFieldContext } from "../../types";

const sddgQuestions: WorkflowFieldContext[] = [
  {
    id: "1",
    identifier: "1",
    childFields: [
      {
        id: "1a",
        identifier: "1a",
        label:
          "Separate hazdecs for different PSNs overpacked in the same outside container (for DTR III moves, a single hazdec may be used for more than one type of hazardous material if the material is controlled by one mobility TCN)",
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label:
      "Three original documents for each proper shipping name (PSN) under a single TCN (Only 2 required for Chapter 3)",
    currentValue: null,
    isValid: true,
    isOptional: true,
  },
  {
    id: "2",
    identifier: "2",
    childFields: [
      {
        id: "2a",
        identifier: "2a",
        label:
          "The address and telephone number where the material was certified (the telephone number of the certifier's as- signed unit for DTR III moves). (key 1)",
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label: "Shipper's Address and Phone Number",
    currentValue: null,
    isValid: true,
  },
  {
    id: "3",
    identifier: "3",
    childFields: [
      {
        id: "3a",
        identifier: "3a",
        label:
          "The six-digit DODAAC and/or the in-the-clear geographical location of the ultimate consignee. (key 2)",
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label: "Consignee DODACC or Address (or Worldwide Mobility)",
    currentValue: null,
    isValid: true,
  },
  {
    id: "4",
    identifier: "4",
    childFields: [
      {
        id: "4a",
        identifier: "4a",
        label:
          "The 17-character regular TCN or Mobility TCN. The TCN must match TCN on the piece (key 5)",
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label: "Transportation Control Number (TCN)",
    currentValue: null,
    isValid: true,
  },
  {
    id: "5",
    identifier: "5",
    childFields: [
      {
        id: "5a",
        identifier: "5a",
        label:
          'Either three-digit POE/POD and/or the in-the-clear geographical location of the airport. "Worldwide Mobility" for DTR III moves (keys 8 and 9)',
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label: "Airport of Departure and Destination (or Worldwide Mobility)",
    currentValue: null,
    isValid: true,
  },
  {
    id: "6",
    identifier: "6",
    childFields: [
      {
        id: "6a",
        identifier: "6a",
        label: "(keys 20 and 22)",
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label: "Name and Title of Preparer with Signature",
    currentValue: null,
    isValid: true,
  },
  {
    id: "7",
    identifier: "7",
    childFields: [
      {
        id: "7a",
        identifier: "7a",
        label: "(key 21)",
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label: "Place and Date Material Certified",
    currentValue: null,
    isValid: true,
  },
  {
    id: "8",
    identifier: "8",
    childFields: [
      {
        id: "8a",
        identifier: "8a",
        label:
          "Legible signature of certifying official must be above change. Keys 1 (telephone number only), 2, 3, 5, 8, 9, and 19 may be changed and signed by someone other than the certifying official. (any key)",
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label: "Pen and Ink Changes Signed",
    currentValue: null,
    isValid: true,
  },
  {
    id: "9",
    identifier: "9",
    childFields: [
      {
        id: "9a",
        identifier: "9a",
        label:
          "A 24-hour emergency contact must be provided. Separate numbers for Class 1 Explosives, Class 7 Radioactives, and all other hazardousmaterials are listed on page 18 of AFMAN(I) 24-204. Non-DOD activities may use a company, safety organization, or other contact number applicable to the material (key 19)",
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label: "Emergency Response Number",
    currentValue: null,
    isValid: true,
  },
  {
    id: "10",
    identifier: "10",
    childFields: [
      {
        id: "10a",
        identifier: "10a",
        label: "Anything not covered above blocks 1-9",
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label: "Other (Shipper's Declaration)",
    currentValue: null,
    isValid: true,
  },
  {
    id: "11",
    identifier: "11",
    childFields: [
      {
        id: "11a",
        identifier: "11a",
        label:
          'One item needs to be blocked out dependent on the "P" code (key 7)',
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label: "Identifies whether packed within passenger or cargo aircraft only",
    currentValue: null,
    isValid: true,
  },
  {
    id: "12",
    identifier: "12",
    childFields: [
      {
        id: "12a",
        identifier: "12a",
        label:
          "One item needs to be blocked out depending on type of hazardous. (key 10)",
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label: "Identifies Radioactive or Nonradioactive Shipment",
    currentValue: null,
    isValid: true,
  },
  {
    id: "13",
    identifier: "13",
    childFields: [
      {
        id: "13a",
        identifier: "13a",
        label:
          "Prefix (UN, ID, or NA) must preceed number.  Only UN or ID numbers can be used for international shipments. NA numbers are used just for US, Canada, and Mexico. (key 13)",
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label: "Identification Number (UN, ID, NA)",
    currentValue: null,
    isValid: true,
  },
  {
    id: "14",
    identifier: "14",
    childFields: [
      {
        id: "14a",
        identifier: "14a",
        label:
          "Spelled correctly. Technical name in parenthesis after PSN (key 11)",
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label: "PSN (With Technical Name if Required)",
    currentValue: null,
    isValid: true,
  },
  {
    id: "15",
    identifier: "15",
    childFields: [
      {
        id: "15a",
        identifier: "15a",
        label:
          "Class 1 material include compatibility group letter include the Inhabited Building Distance (IBD) or subdivision if assigned in the DOD Joint Hazard Classification System (JHCS) or classification approval document. (key 12)",
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label:
      "Primary Hazard Class or Division (Compatibility Group for Explosives)",
    currentValue: null,
    isValid: true,
  },
  {
    id: "16",
    identifier: "16",
    childFields: [
      {
        id: "16a",
        identifier: "16a",
        label: "(key 15)",
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label: "Subsidary Risk Class or Division, If Assigned",
    currentValue: null,
    isValid: true,
  },
  {
    id: "17",
    identifier: "17",
    childFields: [
      {
        id: "17a",
        identifier: "17a",
        label:
          "Shipper determines the applicable packing group from table A4.1 (key 14)",
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label: "Packaging Group",
    currentValue: null,
    isValid: true,
  },
  {
    id: "18",
    identifier: "18",
    childFields: [
      {
        id: "18a",
        identifier: "18a",
        label:
          "List the number of packages (same type and content) and type of packaging (must be authorized by packaging paragraph). List type by specification code or text description of outer package, example: 4G or Fiberboard Box. Enter nomenclature or basic description for specifically named self-propelled vehicles or mechanical apparatus (key 16)",
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label: "Number and Type of Packages",
    currentValue: null,
    isValid: true,
  },
  {
    id: "19",
    identifier: "19",
    childFields: [
      {
        id: "19a",
        identifier: "19a",
        label:
          "Must be metric weight, volume, or other applicable measure of actual hazardous material per package excluding the nonhazardous content. For Class 1, enter the metric Net ExplosiveWeight (NEW) per package or per warehouse skid, or pallet. For compressed gases, express the quantity in kilograms, not pounds per square inch unless specified. For overpacks, enter “overpack”. For magnetized material, net quantity not required. (key 16)",
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label: "Net Quantity per Package (Metric unless Excepted)",
    currentValue: null,
    isValid: true,
  },
  {
    id: "20",
    identifier: "20",
    childFields: [
      {
        id: "20a",
        identifier: "20a",
        label:
          "Enter the activity contained in each package in terms of Becquerel or Terabecquerel (key 16)",
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label: "R--Activity per Package Given in Becquerel System",
    currentValue: null,
    isValid: true,
    isOptional: true,
  },
  {
    id: "21",
    identifier: "21",
    childFields: [
      {
        id: "21a",
        identifier: "21a",
        label: "Enter name or symbol of radionuclide (key 16)",
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label: "R--Name and Symbol of Material",
    currentValue: null,
    isValid: true,
    isOptional: true,
  },
  {
    id: "22",
    identifier: "22",
    childFields: [
      {
        id: "22a",
        identifier: "22a",
        label:
          "If not special form, enter description of physical and chemical form of material. If special form, enter “Special Form”. (key 16)",
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label: "R--Material Physical and Chemical Form",
    currentValue: null,
    isValid: true,
    isOptional: true,
  },
  {
    id: "23",
    identifier: "23",
    childFields: [
      {
        id: "23a",
        identifier: "23a",
        label:
          'A. "A.3.2.3" used when POP tested package is overpacked to meet air requirements (key 17) "overpack used" will be identified in Key 16 on the Hazdec. The packaging paragraph must also be entered with "A.3.2.3"',
        currentValue: null,
        isValid: true,
        childFields: [],
      },
      {
        id: "23b",
        identifier: "23b",
        label:
          "B. Packaging reference from attachment 27 used for explosives meeting GRANDFATHER clause (key 17)",
        currentValue: null,
        isValid: true,
        childFields: [],
      },
      {
        id: "23c",
        identifier: "23c",
        label:
          'C. "A.5.4.1" used for items removed from packaging in accordance with a technical order for airdrop (key 17)',
        currentValue: null,
        isValid: true,
        childFields: [],
      },
      {
        id: "23d",
        identifier: "23d",
        label:
          'D. "A.5.4.2" used for items removed from packaging for storage in tactical equipment or vehicles (key 17)',
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label: "Packaging Paragraph (From Attachments 5-13)",
    currentValue: null,
    isValid: true,
  },
  {
    id: "24",
    identifier: "24",
    childFields: [
      {
        id: "24a",
        identifier: "24a",
        label: "Approval number must be in Key 17",
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label:
      "DOT-E, COE, CAA or Other Approved Document Used as Certification Reference (Copy Accompanies Shipment)",
    currentValue: null,
    isValid: true,
  },
  {
    id: "25",
    identifier: "25",
    childFields: [
      {
        id: "25a",
        identifier: "25a",
        label: "Verify passenger limitations are not be exceeded (key 17)",
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label:
      "49CFR, IATA or ICAO Reference Used as Certification Reference (If Meeting Passenger Restrictions)",
    currentValue: null,
    isValid: true,
  },
  {
    id: "26",
    identifier: "26",
    childFields: [
      {
        id: "26a",
        identifier: "26a",
        label: 'Example: "white-I", "yellow-II", or "yellow-III" (key 17)',
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label: "R--Category of Radioactive Package",
    currentValue: null,
    isValid: true,
    isOptional: true,
  },
  {
    id: "27",
    identifier: "27",
    childFields: [
      {
        id: "27a",
        identifier: "27a",
        label: "(key 17)",
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label: "R--Transport Index",
    currentValue: null,
    isValid: true,
    isOptional: true,
  },
  {
    id: "28",
    identifier: "28",
    childFields: [
      {
        id: "28a",
        identifier: "28a",
        label: "If applicable, must preceed the PSN (key 11)",
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label: '"RQ" Identifies a PSN as Hazardous Substance',
    currentValue: null,
    isValid: true,
    isOptional: true,
  },
  {
    id: "29",
    identifier: "29",
    childFields: [
      {
        id: "29a",
        identifier: "29a",
        label: "If applicable, must preceed the PSN (key 11)",
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label: '"Waste" if Marked or Labeled on Package',
    currentValue: null,
    isValid: true,
    isOptional: true,
  },
  {
    id: "30",
    identifier: "30",
    childFields: [
      {
        id: "30a",
        identifier: "30a",
        label: "If applicable, the appropriate entry must be entered (key 11)",
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label: '"Inhalation Hazard (Zone)" (If Material Meets this Definition)',
    currentValue: null,
    isValid: true,
    isOptional: true,
  },
  {
    id: "31",
    identifier: "31",
    childFields: [
      {
        id: "31a",
        identifier: "31a",
        label: "If applicable, must be entered (key 16)",
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label: 'If Overpacked, the Words "Overpacked Used"',
    currentValue: null,
    isValid: true,
    isOptional: true,
  },
  {
    id: "32",
    identifier: "32",
    childFields: [
      {
        id: "32a",
        identifier: "32a",
        label: "If applicable, must be entered (key 18)",
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label: '"Limited Quantity" or "LTD QTY"',
    currentValue: null,
    isValid: true,
    isOptional: true,
  },
  {
    id: "33",
    identifier: "33",
    childFields: [
      {
        id: "33a",
        identifier: "33a",
        label:
          "Shipper must provide specific venting instructions unless instructions are provided in a separate instruction accompanying the shipment or attached to the cargo. Required equipment must be provided. (key 19)",
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label: "Cryogenics Venting Requirements",
    currentValue: null,
    isValid: true,
    isOptional: true,
  },
  {
    id: "34",
    identifier: "34",
    childFields: [
      {
        id: "34a",
        identifier: "34a",
        label:
          'For secondary hazards, ensure the PSN, hazard class, and net quantity of hazardous material is entered. For vehicles, ensure name and quantity of non-hazardous fuel in tanks is entered. If applicable, ensure "non-hazardous battery installed" is entered. For extra fuel, ensure the number of containers, type of containers, and quantity per container is enteredwhen secured in permanently configured and approved holders. (key 19)',
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label: "Secondary Hazard PSN, Class or Division and Net Quantity",
    currentValue: null,
    isValid: true,
    isOptional: true,
  },
  {
    id: "35",
    identifier: "35",
    childFields: [
      {
        id: "35a",
        identifier: "35a",
        label:
          "Must be entered when specified in packaging paragraph. (key 19)",
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label: "Handling Instructions",
    currentValue: null,
    isValid: true,
    isOptional: true,
  },
  {
    id: "36",
    identifier: "36",
    childFields: [
      {
        id: "36a",
        identifier: "36a",
        label:
          "Any item not listed above. (11 to 35) Check Att 17 for additional requirements.",
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label: "Other (Cargo Identification)",
    currentValue: null,
    isValid: true,
    isOptional: true,
  },
];

const packagingQuestions: WorkflowFieldContext[] = [
  {
    id: "37",
    identifier: "37",
    childFields: [
      {
        id: "37a",
        identifier: "37a",
        label: "Check entire container including bottom.",
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label: "Container Servicable; Damage, Leakage or Loss Contents",
    currentValue: null,
    isValid: true,
  },
  {
    id: "38",
    identifier: "38",
    childFields: [
      {
        id: "38a",
        identifier: "38a",
        label: "For cylinders or overpack only.",
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label: "Approved Outer Container (If Required)",
    currentValue: null,
    isValid: true,
  },
  {
    id: "39",
    identifier: "39",
    childFields: [
      {
        id: "39a",
        identifier: "39a",
        label: "Container must be authorized by packaging paragraph",
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label: "Package Permitted By Packaging Reference",
    currentValue: null,
    isValid: true,
  },
  {
    id: "40",
    identifier: "40",
    childFields: [
      {
        id: "40a",
        identifier: "40a",
        label: "Check for specific requirements in Att 3",
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label: "Other (Packaging--Outer)",
    currentValue: null,
    isValid: true,
  },
  {
    id: "41",
    identifier: "41",
    childFields: [
      {
        id: "41a",
        identifier: "41a",
        label:
          "Adequate space within a container to allow expansion of liquids under pressure from airlift. Containers should fall short of being completely full.",
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label: "Ullage",
    currentValue: null,
    isValid: true,
    isOptional: true,
  },
  {
    id: "42",
    identifier: "42",
    childFields: [
      {
        id: "42a",
        identifier: "42a",
        label:
          '"X" containers can be used to package PG I, II, or III items. "Y" containers can be used to package PG II or III items. "Z" containers can be used to package only PG III items. Attachment 3 must be complied with.',
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label:
      "UN Specification or POP Container Matches Corresponding Packing Group",
    currentValue: null,
    isValid: true,
    isOptional: true,
  },
  {
    id: "43",
    identifier: "43",
    childFields: [
      {
        id: "43a",
        identifier: "43a",
        label:
          "The gross weight of the piece converted to kilograms must not exceed theweight indicated in the container's POP marking.",
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label:
      "Gross Weight of Package is Equal to or Less than Tested Weight Indicated as Part of POP Marking",
    currentValue: null,
    isValid: true,
    isOptional: true,
  },
  {
    id: "44",
    identifier: "44",
    childFields: [
      {
        id: "11c-44a",
        identifier: "11c-44a",
        label:
          "Minimal standards in Attachment 3 must meet or exceed container standard indicated in POP marking.",
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label:
      "Single Package (Containing a Liquid) Tested Pressure (KPA) Agrees with Container Requirements",
    currentValue: null,
    isValid: true,
    isOptional: true,
  },
  {
    id: "45",
    identifier: "45",
    childFields: [
      {
        id: "45a",
        identifier: "45a",
        label: "Check for specific requirements in Att 3",
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label: "Other (Packaging--Outer, If Applicable)",
    currentValue: null,
    isValid: true,
    isOptional: true,
  },
  {
    id: "46",
    identifier: "46",
    childFields: [
      {
        id: "46a",
        identifier: "46a",
        label: "Requirements are listed in attachment 20.",
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label: "Absorbent Material",
    currentValue: null,
    isValid: true,
    isOptional: true,
  },
  {
    id: "47",
    identifier: "47",
    childFields: [
      {
        id: "47a",
        identifier: "47a",
        label:
          "Required when absorbent, cushioning material is required and the outer packaging is not liquid tight.",
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label: "Leak or Acid Proof Liner",
    currentValue: null,
    isValid: true,
    isOptional: true,
  },
  {
    id: "48",
    identifier: "48",
    childFields: [
      {
        id: "48a",
        identifier: "48a",
        label: "Ensure package is oriented properly",
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label: "Inner Receptacle Oreintation",
    currentValue: null,
    isValid: true,
    isOptional: true,
  },
  {
    id: "49",
    identifier: "49",
    childFields: [
      {
        id: "49a",
        identifier: "49a",
        label:
          "If doing an internal inspection, verify means to prevent friction and screw-type closures from loosening during vibrations or substantial temperature change.",
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label: "Secondary Closure",
    currentValue: null,
    isValid: true,
    isOptional: true,
  },
  {
    id: "50",
    identifier: "50",
    childFields: [
      {
        id: "50a",
        identifier: "50a",
        label: "Check for specific requirements in Att 3.",
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label: "Other (Packaging--Inner)",
    currentValue: null,
    isValid: true,
    isOptional: true,
  },
];

const markingQuestions: WorkflowFieldContext[] = [
  {
    id: "53",
    identifier: "53",
    childFields: [
      {
        id: "53a",
        identifier: "53a",
        label:
          "Must match table A4.1. If applicable, technical name in parenthesis must follow PSN.",
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label: "PSN and Identification Number",
    currentValue: null,
    isValid: true,
  },
];

const ifApplicableMarkingQuestions: WorkflowFieldContext[] = [
  {
    id: "54",
    identifier: "54",
    childFields: [
      {
        id: "54a",
        identifier: "54a",
        label:
          "Must be marked on piece unless exempt. Grandfathered items are exempt.",
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label: "UN or POP Specification Marking",
    currentValue: null,
    isValid: true,
    isOptional: true,
  },
  {
    id: "55",
    identifier: "55",
    childFields: [
      {
        id: "55a",
        identifier: "55a",
        label: "If applicable, must be marked for hazardous substances.",
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label: '"RQ"',
    currentValue: null,
    isValid: true,
    isOptional: true,
  },
  {
    id: "56",
    identifier: "56",
    childFields: [
      {
        id: "56a",
        identifier: "56a",
        label: "If applicable, must be marked for hazardous substances.",
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label: '"Waste"',
    currentValue: null,
    isValid: true,
    isOptional: true,
  },
  {
    id: "57",
    identifier: "57",
    childFields: [
      {
        id: "57a",
        identifier: "57a",
        label: '"Air approved" is authorized',
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label: '"Air Eligible" Markings or Symbol',
    currentValue: null,
    isValid: true,
    isOptional: true,
  },
  {
    id: "58",
    identifier: "58",
    childFields: [],
    label: '"Overpacks" Identified',
    currentValue: null,
    isValid: true,
    isOptional: true,
  },
  {
    id: "59",
    identifier: "59",
    childFields: [
      {
        id: "59a",
        identifier: "59a",
        label:
          '"INNER (INSIDE) PACKAGE (CONTAINER) COMPLIES WITH PRESCRIBED SPECIFICATIONS" used when shipper\'s declaration states "OVERPACK USED" or when otherwise required. Or arrows if applicable',
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label: '"Orientation Arrows"',
    currentValue: null,
    isValid: true,
    isOptional: true,
  },
  {
    id: "60",
    identifier: "60",
    childFields: [
      {
        id: "60a",
        identifier: "60a",
        label: '"LIMITED QUANTITY" or "LTD QTY"',
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label: "Limited Quantity Identified",
    currentValue: null,
    isValid: true,
    isOptional: true,
  },
  {
    id: "61",
    identifier: "61",
    childFields: [
      {
        id: "61a",
        identifier: "61a",
        label:
          'For domestic only shipment of PSN "CONSUMER COMMODITY" (notidentified as class 9) Used for domestic shipments only. Must be on at least one side after or below the PSN.',
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label: '"ORM-D" or "ORM-D-AIR" for Domestic Only Shipment',
    currentValue: null,
    isValid: true,
    isOptional: true,
  },
  {
    id: "62",
    identifier: "62",
    childFields: [],
    label: '"Inside Containers Comply with Prescribed Specifications"',
    currentValue: null,
    isValid: true,
    isOptional: true,
  },
  {
    id: "63",
    identifier: "63",
    childFields: [
      {
        id: "63a",
        identifier: "63a",
        label: "DOT-E number (when used as certification reference)",
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label: "DOT Special Permit (When Used as a Certification Reference)",
    currentValue: null,
    isValid: true,
    isOptional: true,
  },
  {
    id: "64",
    identifier: "64",
    childFields: [],
    label: "COE Number (When Used as a Certification Reference)",
    currentValue: null,
    isValid: true,
    isOptional: true,
  },
  {
    id: "65",
    identifier: "65",
    childFields: [],
    label: "CAA Number (If Required by CAA)",
    currentValue: null,
    isValid: true,
    isOptional: true,
  },
  {
    id: "66",
    identifier: "66",
    childFields: [],
    label: "Flashpoint (For Flammable Liquids)",
    currentValue: null,
    isValid: true,
    isOptional: true,
  },
  {
    id: "67",
    identifier: "67",
    childFields: [
      {
        id: "67a",
        identifier: "67a",
        label:
          "Is not needed if explosive has interim hazard classification issued according to A3.3.1.2.",
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label: "NSN (or Part Number) for Explosives",
    currentValue: null,
    isValid: true,
    isOptional: true,
  },
  {
    id: "68",
    identifier: "68",
    childFields: [
      {
        id: "68a",
        identifier: "68a",
        label: "Check for specific requirements in Att 14.",
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label: "Other (Marking)",
    currentValue: null,
    isValid: true,
    isOptional: true,
  },
];

const radioactiveLabelingQuestions: WorkflowFieldContext[] = [
  {
    id: "69",
    identifier: "69",
    childFields: [
      {
        id: "69a",
        identifier: "69a",
        label:
          "Must have class number in bottom corner. Class 1 must have compatibility group number. Division 5.1 oxidizers and 5.2 organic peroxides must division number in bottom corner. Attach near PSN if possible.",
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label: "Primary Risk Label",
    currentValue: null,
    isValid: true,
  },
  {
    id: "70",
    identifier: "70",
    childFields: [],
    label: "R--Radioactive Material Labels on Opposite Sides of Package",
    currentValue: null,
    isValid: true,
    isOptional: true,
  },
];

const ifApplicableLabelingQuestions: WorkflowFieldContext[] = [
  {
    id: "71",
    identifier: "71",
    childFields: [
      {
        id: "71a",
        identifier: "71a",
        label: "Must have class number in bottom corner.",
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label: "Subsidiary Risk Labels",
    currentValue: null,
    isValid: true,
    isOptional: true,
  },
  {
    id: "72",
    identifier: "72",
    childFields: [
      {
        id: "72a",
        identifier: "72a",
        label:
          "If so identified on the shipper's declaration, not mandatory for DTR III moves",
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label: '"Cargo Aircraft Only" (Not Mandatory for Mobility Operations)',
    currentValue: null,
    isValid: true,
    isOptional: true,
  },
  {
    id: "73",
    identifier: "73",
    childFields: [
      {
        id: "73a",
        identifier: "73a",
        label: "If item meets definition",
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label: '"Magnetized Material"',
    currentValue: null,
    isValid: true,
    isOptional: true,
  },
  {
    id: "74",
    identifier: "74",
    childFields: [
      {
        id: "74a",
        identifier: "74a",
        label: "If item meets definition",
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label: '"Empty"',
    currentValue: null,
    isValid: true,
    isOptional: true,
  },
  {
    id: "75",
    identifier: "75",
    childFields: [
      {
        id: "75a",
        identifier: "75a",
        label: "Check for specific requirements in Att 15.",
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label: "Other (Labeling)",
    currentValue: null,
    isValid: true,
    isOptional: true,
  },
];

const vehiclesAndEquipmentQuestions: WorkflowFieldContext[] = [
  {
    id: "76",
    identifier: "76",
    childFields: [
      {
        id: "76a",
        identifier: "76a",
        label:
          "Ensure the fuel gauge is working or that a dipstick is available to verify fuel levels, which helps confirm that fuel is within allowable limits.",
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label: "Fuel gauge operative or dip stick avaiable",
    currentValue: null,
    isValid: true,
    isOptional: true,
  },
  {
    id: "77",
    identifier: "77",
    childFields: [
      {
        id: "77a",
        identifier: "77a",
        label:
          "Verify that the fuel tank is no more than half full. Overfilling poses risks during transport and violates shipment requirements.",
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label:
      "Vehicles and self-propelled equipment with fuel qty not exceeding 1/2 tank capacity",
    currentValue: null,
    isValid: true,
  },
  {
    id: "78",
    identifier: "78",
    childFields: [
      {
        id: "78a",
        identifier: "78a",
        label:
          "Check that all support equipment, such as auxiliary tanks or power units, has been properly drained to eliminate potential hazards.",
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label: "Support equipment drained",
    currentValue: null,
    isValid: true,
  },
  {
    id: "79",
    identifier: "79",
    childFields: [
      {
        id: "79a",
        identifier: "79a",
        label:
          "Inspect the entire vehicle or equipment for signs of fuel leakage, including under the vehicle and around the tank fittings.",
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label: "No existing fuel leaks",
    currentValue: null,
    isValid: true,
  },
  {
    id: "80",
    identifier: "80",
    childFields: [
      {
        id: "80a",
        identifier: "80a",
        label:
          "Identify any additional hazardous materials or conditions associated with the equipment, and ensure they are properly documented in Block 36 of the inspection form.",
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label: "All additional hazards identified (see Block 36)",
    currentValue: null,
    isValid: true,
  },
  {
    id: "81",
    identifier: "81",
    childFields: [
      {
        id: "81a",
        identifier: "81a",
        label:
          "Confirm that all secondary loads (items other than the main vehicle) are certified, properly packaged, and marked per applicable regulations.",
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label: "Secondary loads certified, packaged, and marked",
    currentValue: null,
    isValid: true,
  },
  {
    id: "82",
    identifier: "82",
    childFields: [
      {
        id: "82a",
        identifier: "82a",
        label:
          "Ensure that bulk tanks carrying flammable liquids are either fully drained or purged according to regulatory requirements to prevent fire risk.",
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label: "Bulk flammable liquid fuel tanks drained or purged as required",
    currentValue: null,
    isValid: true,
  },
  {
    id: "83",
    identifier: "83",
    childFields: [
      {
        id: "83a",
        identifier: "83a",
        label:
          "Check that any spare fuel is stored in containers that are approved and authorized for transport and meet safety specifications.",
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label: "Spare fuel in authorized containers",
    currentValue: null,
    isValid: true,
  },
  {
    id: "84",
    identifier: "84",
    childFields: [
      {
        id: "84a",
        identifier: "84a",
        label:
          "Battery terminals must be covered or otherwise protected to prevent accidental short circuits during transport.",
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label: "Battery posts protected",
    currentValue: null,
    isValid: true,
  },
  {
    id: "85",
    identifier: "85",
    childFields: [
      {
        id: "85a",
        identifier: "85a",
        label:
          "Verify that fire extinguishers are present and securely mounted in approved holders for safety and compliance.",
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label: "Fire extinguishers in approved holder",
    currentValue: null,
    isValid: true,
  },
  {
    id: "86",
    identifier: "86",
    childFields: [
      {
        id: "86a",
        identifier: "86a",
        label:
          "Capture any additional equipment-related hazard not addressed in previous steps; provide context or notes as needed.",
        currentValue: null,
        isValid: true,
        childFields: [],
      },
    ],
    label: "Other",
    currentValue: null,
    isValid: true,
  },
];

const sddgFields = sddgQuestions.reduce((acc, curr) => {
  return [
    ...acc,
    {
      id: curr.identifier,
      label: curr.label.startsWith("Other") ? "Other" : curr.label,
    },
    ...curr.childFields.map(cf => ({
      id: cf.identifier,
      label: cf.label.startsWith("Other") ? "Other" : cf.label,
    })),
  ];
}, [] as { id: string; label: string }[]);

const packagingFields = packagingQuestions.reduce((acc, curr) => {
  return [
    ...acc,
    {
      id: curr.identifier,
      label: curr.label.startsWith("Other") ? "Other" : curr.label,
    },
    ...curr.childFields.map(cf => ({
      id: cf.identifier,
      label: cf.label.startsWith("Other") ? "Other" : cf.label,
    })),
  ];
}, [] as { id: string; label: string }[]);

const markingFields = markingQuestions.reduce((acc, curr) => {
  return [
    ...acc,
    {
      id: curr.identifier,
      label: curr.label.startsWith("Other") ? "Other" : curr.label,
    },
    ...curr.childFields.map(cf => ({
      id: cf.identifier,
      label: cf.label.startsWith("Other") ? "Other" : cf.label,
    })),
  ];
}, [] as { id: string; label: string }[]);

const ifApplicableMarkingFields = ifApplicableMarkingQuestions.reduce(
  (acc, curr) => {
    return [
      ...acc,
      {
        id: curr.identifier,
        label: curr.label.startsWith("Other") ? "Other" : curr.label,
      },
      ...curr.childFields.map(cf => ({
        id: cf.identifier,
        label: cf.label.startsWith("Other") ? "Other" : cf.label,
      })),
    ];
  },
  [] as { id: string; label: string }[]
);

const radioactiveLabelingFields = radioactiveLabelingQuestions.reduce(
  (acc, curr) => {
    return [
      ...acc,
      {
        id: curr.identifier,
        label: curr.label.startsWith("Other") ? "Other" : curr.label,
      },
      ...curr.childFields.map(cf => ({
        id: cf.identifier,
        label: cf.label.startsWith("Other") ? "Other" : cf.label,
      })),
    ];
  },
  [] as { id: string; label: string }[]
);

const ifApplicableLabelingFields = ifApplicableLabelingQuestions.reduce(
  (acc, curr) => {
    return [
      ...acc,
      {
        id: curr.identifier,
        label: curr.label.startsWith("Other") ? "Other" : curr.label,
      },
      ...curr.childFields.map(cf => ({
        id: cf.identifier,
        label: cf.label.startsWith("Other") ? "Other" : cf.label,
      })),
    ];
  },
  [] as { id: string; label: string }[]
);

const vehiclesAndEquipmentFields = vehiclesAndEquipmentQuestions.reduce(
  (acc, curr) => {
    return [
      ...acc,
      {
        id: curr.identifier,
        label: curr.label.startsWith("Other") ? "Other" : curr.label,
      },
      ...curr.childFields.map(cf => ({
        id: cf.identifier,
        label: cf.label.startsWith("Other") ? "Other" : cf.label,
      })),
    ];
  },
  [] as { id: string; label: string }[]
);

export const form1015Questions = [
  ...sddgQuestions,
  ...packagingQuestions,
  ...markingQuestions,
  ...ifApplicableMarkingQuestions,
  ...radioactiveLabelingQuestions,
  ...ifApplicableLabelingQuestions,
  ...vehiclesAndEquipmentQuestions,
];

export type Form1015Field = {
  id: string;
  label: string;
};

export const form1015Fields: Form1015Field[] = [
  ...sddgFields,
  ...packagingFields,
  ...markingFields,
  ...ifApplicableMarkingFields,
  ...radioactiveLabelingFields,
  ...ifApplicableLabelingFields,
  ...vehiclesAndEquipmentFields,
];

// export const generateForm1015Questions = (
//   inspectorContext: HazProInspectorContext,
//   questions: Pre1015Question[]
// ): WorkflowFieldContext[] => {
//   const filters = {
//     vehicle: {
//       condition: inspectorContext.hazardousMaterial?.unid === "UN3166",
//       allowed: new Set<number>([...Array(16).keys(), 18, 19, 20, 21, 22]),
//     },
//     radioactive: {
//       condition: !questionnaire[0].value,
//       filtered: new Set<number>([20, 21, 22, 26, 27, 70]),
//     },
//     explosive: {
//       condition: !questionnaire[1].value,
//       filtered: new Set<string | number>([67]),
//     },
//     reportableQuantity: {
//       condition: !questionnaire[2].value,
//       filtered: new Set<number>([28, 29, 55, 56]),
//     },
//     liquid: {
//       condition: !questionnaire[3].value,
//       filtered: new Set<number>([41, 44, 46, 47, 48, 59, 66]),
//     },
//     innerPackages: {
//       condition: !questionnaire[4].value,
//       filtered: new Set<number>([46, 47, 48, 49, 50]),
//     },
//     overpack: {
//       condition: !questionnaire[5].value,
//       filtered: new Set<string | number>([31, 57, 58]),
//     },
//   };

//   return form1015Questions.map(q => {
//     const questionId = parseInt(q.identifier);

//     // Vehicle check: Only allow specified questions
//     if (filters.vehicle.condition && !filters.vehicle.allowed.has(questionId)) {
//       if (q.isOptional) {
//         return {
//           ...q,
//           currentValue: 2,
//           childFields: q.childFields.map(cf => ({ ...cf, currentValue: 2 })),
//         };
//       }
//       return {
//         ...q,
//         currentValue: 0,
//         childFields: q.childFields.map(cf => ({ ...cf, currentValue: 0 })),
//       };
//     }

//     for (const key of Object.keys(filters) as Array<keyof typeof filters>) {
//       if (
//         key !== "vehicle" &&
//         filters[key]?.condition &&
//         filters[key]?.filtered?.has(questionId)
//       ) {
//         if (q.isOptional) {
//           return {
//             ...q,
//             currentValue: 2,
//             childFields: q.childFields.map(cf => ({
//               ...cf,
//               currentValue: 2,
//             })),
//           };
//         }

//         return {
//           ...q,
//           currentValue: 0,
//           childFields: q.childFields.map(cf => ({ ...cf, currentValue: 0 })),
//         };
//       }
//     }

//     return q;
//   });
// };

export const initial1015QuestionnaireState: Pre1015Question[] = [
  { id: "radioactive", text: "Is this shipment radioactive?", value: null },
  { id: "explosive", text: "Is this shipment explosive?", value: null },
  {
    id: "rq",
    text: "Is this shipment a reportable quantity or waste?",
    value: null,
  },
  { id: "liquid", text: "Is this shipment a liquid?", value: null },
  {
    id: "innerpackaging",
    text: "Are you inspecting inner packages?",
    value: null,
  },
  { id: "overpack", text: "Is this shipment an overpack?", value: null },
];
