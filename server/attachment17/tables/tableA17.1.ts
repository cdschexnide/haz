interface TableA17_1InstructionsForSDDG {
  [key: string]: InstructionForSDDG;
}

interface InstructionForSDDG {
  title: string;
  description?: string;
  subKeys?: InstructionForSDDGSubKey[];
}

interface InstructionForSDDGSubKey {
  [key: string]: {
    description: string;
    subKeys?: InstructionForSDDGSubKey[];
  };
}

/* Table A17.1. Step-by step Instructions for Completing Shipper's Declaration for Dangerous
Goods Form. */
export const tableA17_1InstructionsForSDDG: TableA17_1InstructionsForSDDG = {
  key1: {
    title: "Shipper.",
    description: `Enter the address and telephone number where the hazardous material was
certified.`,
  },
  key2: {
    title: "Consignee.",
    description: `Enter the six-digit Department of Defense Activity Address Code
(DODAAC) and/or the in-the-clear geographical location of the ultimate consignee, or
“Worldwide Mobility” according to A17.3. For infectious substances, enter also the name
and telephone number of a responsible person for contact in an emergency.`,
  },
  key3: {
    title: "Air Waybill No.",
    description: `The aircraft manifest number to which the Shipper's Declaration
for Dangerous Goods will be attached may be entered in this key. This number need not be
entered by the shipper. It may be entered by the accepting operator at the time it is assigned.
This key may also be left blank.`,
  },
  key4: {
    title: "Page...of...Pages.",
    description: `Enter the page number and total number of pages of the Shipper's
Declaration for Dangerous Goods form. Enter "Page 1 of 1 Pages" or leave blank if there are
no extension pages.`,
  },
  key5: {
    title: "Shipper's Reference Number.",
    description: `Enter the 17-character transportation control
number (TCN).`,
  },
  key6: {
    title: "Optional Block.",
    description: `Inspection activity annotates date of inspection and acceptance for
air movement according to A28.1.2. Shipper unit cargo identification information may also
be entered.`,
  },
  key7: {
    title: "Shipment Within Passenger Aircraft and Cargo Aircraft Limitations.",
    description: `Use the following to determine limitations:`,
    subKeys: [
      {
        key7_1: {
          description: `If the shipment is acceptable for movement on both passenger and cargo aircraft (“P5”
in Table A4.1., Column 7), delete "Cargo Aircraft Only."`,
        },
        key7_2: {
          description: `If the shipment is allowed only by cargo aircraft (“P1” “P4” in Table A4.1., Column 7),
delete "Passengers and Cargo Aircraft."`,
        },
        key7_3: {
          description: `If the shipment is certified to a special approval document which identifies the mode of
transportation as Cargo Aircraft Only, delete “Passengers and Cargo Aircraft.” This applies
even if the PSN is identified as a “P5” in Table A4.1., Column 7.`,
        },
        key7_4: {
          description: `If the shipment is certified to a Special Approval document which identifies the mode
of transportation as acceptable by either Passenger Aircraft or Cargo Aircraft Only, use the
“P” code from Table A4.1., Column 7 to determine passenger limitations.`,
        },
        key7_5: {
          description: `The “shipment” refers to all hazards, primary or secondary, covered by the declaration.`,
        },
      },
    ],
  },
  key8: {
    title: "Airport of Departure.",
    description: `Enter the three-digit Port of Embarkation (POE) and/or the
in-the-clear geographical location of the airport of departure.`,
  },
  key9: {
    title: "Airport of Destination.",
    description: `Enter the three-digit Port of Debarkation (POD) and/or the
in-the-clear geographical location of the airport of destination. Enter "Worldwide Mobility",
if applicable, according to A17.3.`,
  },
  key10: {
    title: "Shipment Type.",
    subKeys: [
      {
        key10_1: {
          description: `Delete "Radioactive" if the shipment contains no radioactive material`,
        },
        key10_2: {
          description: `Delete “Nonradioactive” if the shipment contains radioactive material.`,
        },
      },
    ],
  },
  key11: {
    title: "UN, NA, OR ID No.",
    description: `Enter the UN, North American (NA), or identification
number (ID) given in column 2 of Table A4.1. Include the UN, NA, or ID prefix and the
number. Enter the following information, if applicable, in association with the basic
description:`,
    subKeys: [
      {
        key11_1: {
          description: `The letters “RQ” for a hazardous substance. Enter the letters “RQ” before the basic
description (see A4.4.).`,
        },
      },
    ],
  },
  key12: {
    title: "UN, NA, OR ID No.",
    description: `Proper Shipping Name.`,
    subKeys: [
      {
        key12_1: {
          description: `Technical name, in parentheses, when required by Attachment 4. If a mixture or
solution of two or more hazardous materials, enter the technical names of at least two
components most predominately contributing to the hazards of the mixture or solution.`,
        },
        key12_2: {
          description: `For materials which are toxic (poisonous) by inhalation, without regard to hazard
classification, enter the words "TOXIC-INHALATION HAZARD" and "ZONE A",
"ZONE B", "ZONE C", or "ZONE D" for gases, or "ZONE A" or "ZONE B" for liquids, as
appropriate. The word "TOXIC" need not be repeated if it is already identified in the PSN
(e.g., enter "INHALATION HAZARD" and the appropriate zone).`,
        },
        key12_3: {
          description: `The word "Waste" preceding the PSN for a hazardous material that is a hazardous
waste.`,
        },
        key12_4: {
          description: `Enter the words “EMPTY UNCLEANED” or “ RESIDUE LAST CONTAINED”
before or after the proper shipping name for empty packagings containing residue of
dangerous goods`,
        },
      },
    ],
  },
  key13: {
    title: "Class and Division.",
    description: `Enter the hazard class and division number given in column 4 of Table A4.1.`,
    subKeys: [
      {
        key13_1: {
          description: `For Class 1 material, enter hazard class, division and compatibility group. Other
information assigned in the DOD Joint Hazard Classification System (JHCS) or
classification approval document (e.g., IHC) to include a Subdivision (for division 1.2
materials) and the Inhabited Building Distance (IBD) expressed in feet may be placed on a
separate line beneath the Key 11-16 information or in Key 19. Include some indication that
this information is a DOD IBD and/or subdivision (e.g., “ DOD IBD ”.`,
        },
        key13_2: {
          description: `A storage Compatibility Group (GC) letter for non-Class 1 material, when assigned in
JHCS or on an IHC may be placed on a separate line beneath the Key 11-16 information or
in Key 19. Include some indication that this information is a DOD compatibility group (e.g.,
“ DOD GC 4.2G”.`,
        },
        key13_3: {
          description: `For a single item with more than one hazard, enter the hazard class number of the
item's primary hazard.`,
        },
      },
    ],
  },
  key14: {
    title: "Subsidiary hazard.",
    description: `Enter the subsidiary hazard if given in column 5 of Table
A4.1. in parenthesis following primary hazard classification (e.g., 8 (3,6.1). Subsidiary
hazards may be identified by sources other than Table A4.1 (e.g., SDS). If the subsidiary
hazard was obtained by a source other than Table A4.1, annotate the source in key 19. For
example: “Subsidiary hazard Assigned Per SDS.” Class 1 items identified in the JHCS or by
Service approved interim hazard classification as also requiring a Radioactive Material label
identifies the radioactive material subsidiary hazard identified (e.g., 1.2E (7)).`,
  },
  key15: {
    title: "Packing Group.",
    description: `Enter the applicable Packing Group (PG) given in column 6 of
Table A4.1.`,
  },
  key16: {
    title: "Quantity and Type of Packing.",
    description: `Enter the applicable Packing Group (PG) given in column 6 of
Table A4.1.`,
    subKeys: [
      {
        key16_1: {
          description: `Nonradioactive shipments enter:`,
          subKeys: [
            {
              key16_1_1: {
                description: `The number of packages (of same type and content) and their type of packaging.`,
              },
              key16_1_2: {
                description: `Type of packaging listed in this key is the authorized packaging identified in the
  packaging paragraph. Identify the type of packaging by text description of the outer
  packaging. UN Specification code is optional. For example: 1 fiberboard box x 3 kg (6.6
  pounds); 1 fiberboard box (4G) x 3 kg (6.6 pounds), etc.`,
              },
              key16_1_3: {
                description: `For specifically named self-propelled vehicle and mechanical apparatus enter
  nomenclature or basic description of the item (e.g., truck, generator, etc.). Entering a specific
  M-Series or commercial model number or a specific description (e.g., 50 KW, 60 HZ for
  generator), in addition to the basic description, is optional. The basic description may be
  used for items not requiring an outer package or container (e.g., cylinders) according to this
  manual.`,
              },
              key16_1_4: {
                description: `The weight, volume, or other applicable measure of the actual hazardous material
  (per package).`,
                subKeys: [
                  {
                    key16_1_4_1: {
                      description: `Do not include any nonhazardous content of the shipment.`,
                    },
                    key16_1_4_2: {
                      description: `Enter the net quantity in metric measurement units. The equivalent English unit of
        measure may be entered in parenthesis immediately following the metric unit.`,
                    },
                    key16_1_4_3: {
                      description: `Show the quantity per package immediately following the number and type of
        package (e.g., 2 wooden boxes x 4.5 kg (10 pounds); 1 fiberboard box (4G) x 5 L (1.3
        gallons); 2 cylinders X 15 kg).`,
                    },
                    key16_1_4_4: {
                      description: `For explosives enter the Transportation "Net Explosive Weight (NEW)" in metric
        weight per package or per warehouse pallet or skid (e.g., 3 wooden boxes x 120 kg (264.6
        pounds) NEW; or 1 warehouse pallet x 200 kg (441 pounds) NEW). Entry of pounds in
        association with metric weight is preferred but not required. The NEW listed in JHCS or an
        IHC is the maximum allowed for that item. It is acceptable for the SDDG to show an actual
        NEW less than the maximum. It is acceptable to round up (to the right of the decimal point)
        the net explosives weight (NEW) listed in the Joint Hazard Classification System (JHCS) or
        other classification document required by A3.3.1.4 when completing Key 16. Example:
        0.06432 kg NEW may be shown as “0.07 kg NEW” in Key 16. If, the “Net Explosive QD
        Weight (NEWQD)”, used for aircraft parking and intransit storage, is different than the
        transportation NEW, enter the NEWQD in Key 19.`,
                    },
                    key16_1_4_5: {
                      description: `When shipping unpackaged explosives as specified in paragraph A5.2., enter the
        total net explosives weight per PSN/UN Number (e.g., "On Airdrop Platform X 50 Kg
        N.E.W", "In Ready Racks X 15 Kg N.E.W", and "In ISU X 30 Kg N.E.W.").`,
                    },
                    key16_1_4_6: {
                      description: `For items classified as a non-explosive that contain explosive components (e.g.,
        3L, 3J, 8S, etc.) use the quantity of the assigned predominate hazard.`,
                    },
                    key16_1_4_7: {
                      description: `Express in kilograms (pounds), not pounds per square inch, the quantity of
        compressed gas unless otherwise specified in this instruction. When certifying to A6.2.
        “Aerosols,” A6.3. “Small Receptacles Containing Compressed Gases,” A6.7. “Fire
        Extinguishers,” A6.10. “Cigarette Lighter or Other Similar Devices Charged with Fuel,” and
        A13.3. “Consumer Commodity” (Aerosols) other units of measure; (e.g., fluid ounces,
        gallons, or ounces) are specified and may be shown on this form. See also A26.5.`,
                    },
                  },
                ],
              },
              key16_1_5: {
                description: `Limited Quantity enter either:`,
                subKeys: [
                  {
                    key16_1_5_1: {
                      description: `The type of package and net weight of the hazardous material, or,`,
                    },
                    key16_1_5_2: {
                      description: `Where the letter “G” follows the quantity in Table A19.2., Per Package column,
        enter the the type of package and the gross weight of the package. Enter the letter “G” after
        the unit of measurement. (e.g., 1 wooden box x 28 kg G)`,
                    },
                  },
                ],
              },
              key16_1_6: {
                description: `When an overpack is used for handling purposes and prevents identification of
      contents and/or UN specification markings, enter the words “Overpack Used”. Identify the
      number of overpacks if more than one is used. “Overpack Used" may alternatively be
      entered following the Packaging Instruction (Key 17), or applicable authorizations (Key 18)
      when the open continuous printing form is used. Entering the total quantity per each
      overpack is optional.`,
              },
              key16_1_7: {
                description: `For magnetized material, enter the number and type of packaging. No entry for net
      quantity is required. Weight or size of container is optional.`,
              },
              key16_1_8: {
                description: `When an item is described in Table A4.1. as a "KIT", enter the aggregate quantity of
      hazardous materials in Key 16.`,
              },
              key16_1_9: {
                description: `Multiple-Element Gas Containers:`,
                subKeys: [
                  {
                    key16_1_9_1: {
                      description: `Enter the total number of Multiple-Element Gas Container(s) and the quantity in
        each container (e.g., 1 Multiple-Element Gas Container X 40 kg)`,
                    },
                    key16_1_9_2: {
                      description: `When shipping Multiple-Element Gas Containers, use appropriate packaging
        paragraph from Attachment 6 to identify DOT or UN cylinder`,
                    },
                    key16_1_9_3: {
                      description: `Cylinders which are not manifolded to form a single unit are certified as individual
        cylinders (e.g., 4 DOT 3AA Cylinders X 10 kg).`,
                    },
                  },
                ],
              },
              key16_1_10: {
                description: `For life-saving appliances, Class 9, prepared according to A13.12., show a specific
      description and the number of the items packaged for shipment. For example; "1 wooden
      box x 3 self-inflating life vests".`,
              },
            },
          ],
        },
        key16_2: {
          description: `Radioactive shipments enter:`,
          subKeys: [
            {
              key16_2_1: {
                description: `Name or symbol of the radionuclide in the material.`,
              },
              key16_2_2: {
                description: `Description of the physical and chemical form of the material, if it is not in special
  form (generic chemical description is acceptable for chemical form). If special form, enter
  "Special Form."`,
              },
              key16_2_3: {
                description: `The number of packages (of same type and content), the type of package, and the
  activity contained in each package in terms of Becquerel or Terabecquerel. The equivalent
  customary unit of measure (e.g., Ci, mCi, or uCi) may be included in parenthesis.`,
              },
            },
          ],
        },
      },
    ],
  },
  key17: {
    title: "Packaging Instructions.",
    description: `Enter the hazard class and division number given in column 4 of Table A4.1.`,
    subKeys: [
      {
        key17_1: {
          description: `Nonradioactive shipments enter:`,
          subKeys: [
            {
              key17_1_1: {
                description: `The packaging paragraph from the applicable packaging reference authorized in
  A17.1.2. used to prepare the material for shipment.`,
                subKeys: [
                  {
                    key17_1_1_1: {
                      description: `AFMAN 24-204, use packaging paragraph in Table A4.1, Column 8 (e.g.,
        “A9.8.”, “A13.5.”, etc) or Attachment 27 (e.g., “A27.2.”, “A27.9.”, etc.). Use of subparagraphs from this manual (e.g., "A5.23.1) are not required when completing this key but,
        if used, ensure the sub-paragraph used properly identifies the package, container, or
        shipment configuration.`,
                    },
                    key17_1_1_2: {
                      description: `IATA, Dangerous Goods Regulations, use packing instruction from Section 4,
        “List of Dangerous Goods” (e.g., “806”, “134”, etc.)`,
                    },
                    key17_1_1_3: {
                      description: `ICAO, Technical Instructions, use packing instructions from Table 3-1,
        “Dangerous Goods List” (e.g., “309”, “619”, etc.)`,
                    },
                    key17_1_1_4: {
                      description: `49 CFR, use packaging reference from Part 173 specified in the Hazardous
        Materials Table (49 CFR Section 172.101, Column 8b), (e.g., 173.62, 173.202, etc)`,
                    },
                  },
                ],
              },
              key17_1_2: {
                description: `If the packaging has been approved by a DOT Special Permit, CAA, COE, or
      waiver cite the approval number (e.g., AFMC 24-204-96-09; COE NA-84-505; DOT-SP
      3849; etc.). When the packaging requirement is included as part of the explosives hazard
      classification approval document enter the EX number. `,
              },
              key17_1_3: {
                description: `If a UN packaging specification certified package is overpacked to meet air
      eligibility requirements, cite A3.1.7.3. and the applicable packaging paragraph for the
      material.`,
              },
              key17_1_4: {
                description: `Consumer Commodities enter "A13.3." when an item is classified as a “Consumer
      Commodity” regardless of the original hazard classification of the substance within an
      individual inner packaging or receptacles.`,
              },
              key17_1_5: {
                description: `Limited Quantities enter “A19.3” when an item, regardless of original classification,
      is packaged as a limited quantity. If an item, in a limited quantity, is packaged under a
      Special Permit, CAA, COE, or waiver enter the special authorization approval in place of
      “A19.3.”`,
              },
              key17_1_6: {
                description: `For captured ammunition and ammunition with unknown characteristics shipped
      according to A3.3.1.7., include in key 17 the reference to A3.3.1.7. and the applicable
      packaging paragraph from Table A4.1. (e.g., "A3.3.1.7./A5.20."). Include a copy of the EOD
       safety certification (EOD refer to Joint Service EOD Technical Manual 60A-1-1-7 for an
      example). Comply with A17.2.7. for classified information.`,
              },
              key17_1_7: {
                description: `When shipping unpackaged explosives as specified in paragraph A5.2., enter
      "A5.2.”`,
              },
              key17_1_8: {
                description: `When Class 1 materials are secured in authorized packaging and loaded on a tactical
      vehicle as an operational component according to specified procedures in a technical manual
      or publication, cite appropriate packaging reference from Attachment 5.`,
              },
            },
          ],
        },
        key17_2: {
          description: `Radioactive shipments enter (see Figure A17.2., steps 5 and 6 for assistance):`,
          subKeys: [
            {
              key17_2_1: {
                description: `Packaging paragraph from Table A4.1 used to prepare the material for shipment.`,
              },
              key17_2_2: {
                description: `Category of the package (e.g., “I-White,” “II-Yellow,” or “III-Yellow”).`,
              },
              key17_2_3: {
                description: `The transport index, preceded by the prefix "Ti", assigned each package having a
  "Radioactive Yellow-II" or "Radioactive Yellow-III" label and dimensions of each package,
  including dimensional units (for drums, the capacity is acceptable (e.g., 55 gallons)).`,
              },
              key17_2_4: {
                description: `The fissile class. If the package is exempt enter the words "Fissile Exempt."`,
              },
            },
          ],
        },
      },
    ],
  },
  key18: {
    title: "Authorization.",
    description: `Enter the hazard class and division number given in column 4 of Table A4.1.`,
    subKeys: [
      {
        key18_1: {
          description: `Nonradioactive shipments enter:`,
          subKeys: [
            {
              key18_1_1: {
                description: `When applicable, enter the words "Limited Quantity" or "LTD. QTY."`,
              },
            },
          ],
        },
        key18_2: {
          description: `Radioactive shipments enter Approval Identification Markings (if relevant). List the
package identification markings of any of the documents listed below issued by a competent
authority. Include the words "attached" to indicate that the documents are attached to the
declaration form.`,
          subKeys: [
            {
              key18_2_1: {
                description: `Special form approval certificate.`,
              },
              key18_2_2: {
                description: `Type B package design approval certificate.`,
              },
              key18_2_3: {
                description: `Type B(M) package shipment approval certificate.`,
              },
              key18_2_4: {
                description: `Fissile material package design approval certificate.`,
              },
              key18_2_5: {
                description: `Fissile material package shipment approval certificate.`,
              },
              key18_2_6: {
                description: `Special arrangement approval certificate.`,
              },
              key18_2_7: {
                description: `Any similar documents.`,
              },
            },
          ],
        },
      },
    ],
  },
  key19: {
    title: "Additional Handling Information.",
    description: `Enter:`,
    subKeys: [
      {
        key19_1: {
          description: `General`,
          subKeys: [
            {
              key19_1_1: {
                description: `The PSN and hazard class of each accessorial hazard for items with multiple
  hazards. In addition, the quantity of each accessorial hazard in metric units, U.S. standard
  units may follow the metric units in parenthesis, show if specifically required by any of the
  following block 19 instructions (e.g., fuel, dry ice). Use of the words “Class” or
  “Class/Division” in describing hazard classification (e.g., “Class 3”) is optional.`,
              },
              key19_1_2: {
                description: `Handling instructions, when specified by a packaging paragraph. Only enter if the
  handling instruction applies to the material being shipped.`,
              },
              key19_1_3: {
                description: `For shipments packaged and transported under the authority of a CAA (Packaging
  or Hazard Classification), annotate "PACKAGING AUTHORIZED BY COMPETENT
  AUTHORITY OF THE UNITED STATES OF AMERICA (USA)." If the CAA is from a
  country other than the USA, annotate that country in place of USA on the shipping papers. If
  the CAA does not have a number assigned to it, certify the shipment to A5.3. (see paragraph
  2.5.2.). Ensure a copy of the CAA accompanies the shipment.`,
              },
              key19_1_4: {
                description: `Enter the 24-hour Emergency Response number(s) for the hazardous material listed
  on the Shipper's Declaration for Dangerous Goods. See paragraph A17.2.9.3. for Emergency
  Response numbers used by DOD activities.`,
              },
              key19_1_5: {
                description: `When use of hazard class label(s) are exempted by a DOT Special Permit (DOT-SP)
  for a domestic shipment, annotate "Hazard Class Label (or Labels) exempted by DOT-SP
  (enter permit number, e.g., DOT-SP XXXX).`,
              },
            },
          ],
        },
        key19_2: {
          description: `Kits.`,
          subKeys: [
            {
              key19_2_1: {
                description: `Identify that the item is a kit. This does not apply to an item classified and described
  in Table A4.1. as a "KIT" (e.g., FIRST AID KITS, CHEMICAL KITS, POLYESTER
  RESIN KITS, etc).`,
              },
              key19_2_2: {
                description: `If shipping a kit consisting of more than one container, enter the statement:
  "contained in kit piece number ***" (replace "***" with the piece number which contains
  the hazardous material).`,
              },
            },
          ],
        },
        key19_3: {
          description: `Class 1`,
          subKeys: [
            {
              key19_3_1: {
                description: `If, the “Net Explosive QD Weight (NEWQD)”, used for aircraft parking and intransit
  storage, is different than the transportation NEW, enter the NEWQD (e.g., “NEWQD:
  22.23kg”).`,
                subKeys: [
                  {
                    key19_3_4_1: {
                      description: `"Leak detection indicator not required"`,
                    },
                    key19_3_4_2: {
                      description: `"Monitor leak indicator according to shipper provided instructions."`,
                    },
                    key19_3_4_3: {
                      description: `"Technical escort required."`,
                    },
                  },
                ],
              },
              key19_3_2: {
                description: `Identify any munition or ordnance item containing OTTO Fuel II as a propellant
  with the following entry: "Contains Otto Fuel II as a liquid propellant. In the event of a leak,
  avoid direct skin contact, ingestion, or inhalation of vapors. Vapors are toxic and may cause
  severe headache and nausea.”`,
              },
              key19_3_3: {
                description: `When explosives are installed or embedded according to A3.3.1.9., use the article's
  overall description as the proper shipping name (e.g., Vehicle, Flammable Liquid Powered
  for an aircraft containing the engine). Identify all installed or embedded explosive
  components as accessorial hazards by entering PSN, hazard class/division, and NEW.`,
              },
              key19_3_4: {
                description: `For items containing liquid or hypergolic fuel that is corrosive and/or toxic include
  the following statement in Key 19: "Exercise extreme caution in handling this item. Keep
  well ventilated, away from sparks, fire hazards, and oxidizing materials. Vapors are toxic
  when inhaled. Liquid is corrosive.” Add one of the following statements:`,
              },
              key19_3_5: {
                description: `For Grandfathered munitions certified according to Attachment 27, add the
      statement: “Government-owned goods packaged before January 1, 1990.”`,
              },
            },
          ],
        },
        key19_4: {
          description: `Class 2`,
          subKeys: [
            {
              key19_4_1: {
                description: `For Class 2 materials add the appropriate statement "Ship valve up in vertical
  position" or "Ship in horizontal position" to indicate compliance with A3.3.2.4.`,
              },
              key19_4_2: {
                description: `For fire extinguishers secured in a holder according to A3.3.2.13. of non-regulated
  equipment, certify the fire extinguisher(s) according to the instructions in this table. Identify
  the equipment which the fire extinguisher is attached (e.g., trailer) in this Key.`,
              },
              key19_4_3: {
                description: `Cryogenic Liquids. For cryogenic liquids prepared according to A6.11 enter venting
  instructions. This is not required if venting procedures are provided in a separate instruction
  accompanying the shipment. Include the location and description of the vent valve. If the
  cylinder is empty and purged, venting is not required; comply with paragraph A3.1.16.4. For
  regulated cylinders, include one of the following statements for venting the unit:`,
                subKeys: [
                  {
                    key19_4_3_1: {
                      description: `"Vent container to outside of aircraft. Aircrew members monitor vent valves
        during flight."`,
                    },
                    key19_4_3_2: {
                      description: `"Container is excepted from venting."`,
                    },
                  },
                ],
              },
            },
          ],
        },
        key19_5: {
          description: `Class 4 and Class 5`,
          subKeys: [
            {
              key19_5_1: {
                description: `Enter the control and emergency temperatures for temperature controlled Division
  4.1 and 5.2 materials.`,
              },
              key19_5_2: {
                description: `For Division 4.1 Self-Reactive Substances and Division 5.2 Organic Peroxides enter
  the following statement: "Protect from direct sunlight and all sources of heat and place in
  adequately ventilated area".`,
              },
              key19_5_3: {
                description: `For a Division 4.1 (polymerizing substance and self-reactive) material or a Division
  5.2 (organic peroxide) material enter the following additional information, as appropriate:`,
                subKeys: [
                  {
                    key19_5_3_1: {
                      description: `If notification or competent authority approval is required, enter a statement of
        approval of the classification and conditions of transport.`,
                    },
                    key19_5_3_2: {
                      description: `For Division 4.1 (polymerizing substance and self-reactive) and Division 5.2
        (organic peroxide) materials that require temperature control during transport, add the words
        "TEMPERATURE CONTROLLED" as part of the proper shipping name, unless already
        part of the proper shipping name. Include the control and emergency temperature.`,
                    },
                    key19_5_3_3: {
                      description: `Include the word "SAMPLE" in association with the basic description when a
        sample of a Division 4.1 (polymerizing substance and self-reactive) material or Division 5.2
        (organic peroxide) is offered for transportation.`,
                    },
                  },
                ],
              },
            },
          ],
        },
        key19_6: {
          description: `Class 7`,
          subKeys: [
            {
              key19_6_1: {
                description: `For radioactive Category II-Yellow and Category III-Yellow, enter : “Radioactive
  material is intended for use in, or incident to, research, medical diagnosis, or treatment”
  when applicable (see special provision A507).`,
              },
            },
          ],
        },
        key19_7: {
          description: `Class 9`,
          subKeys: [
            {
              key19_7_1: {
                description: `Vehicles, and Other Equipment prepared according to A13.4. or A13.6.:`,
                subKeys: [
                  {
                    key19_7_1_1: {
                      description: `Enter the PSN, hazard class, and net quantity of flammable fuel within tanks
        and/or system. For example; "Fuel, Aviation, Turbine Engine, Class 3, 38 L". When an item
        is completely drained (but not purged) , the shipper's estimate of the quantity of fuel
        remaining in the unit may be entered. Refer to A3.3.3.4. for authorized fuel levels.`,
                    },
                    key19_7_1_2: {
                      description: `Enter the PSN and hazard class for accessorial hazards (batteries, mounted
        cylinders and fire extinguishers, installed engine starting fluid, etc). Show number of
        accessorial hazards. For example; "1 each Batteries, Wet, Filled with Acid, 8" or "2 ea. Fire
        Extinguishers, 2.2".`,
                    },
                    key19_7_1_3: {
                      description: `Identify any integral installed fire suppression systems as a accessorial hazard.`,
                    },
                    key19_7_1_4: {
                      description: `Identify mounted engines and generators that are by design an approved part of an
        M-Series vehicle as an accessorial hazard (also identify hazardous components such as
        batteries).`,
                    },
                    key19_7_1_5: {
                      description: `Enter the name and quantity of any non-hazardous fuel in vehicles or equipment
        tanks.`,
                    },
                    key19_7_1_6: {
                      description: `When an item is drained and purged of any flammable liquid, but is being certified
        due to another hazard, enter "Drained and Purged."`,
                    },
                    key19_7_1_7: {
                      description: `Include the statement "non-hazardous battery installed" if applicable.`,
                    },
                    key19_7_1_8: {
                      description: `Reference to the technical directive used to prepare the item for military air
        shipment is not required, except for fuel servicing equipment and vehicles drained in
        accordance with technical directives (technical orders, field manuals, etc.). In this case,
        indicate the directive used: "Drained IAW T.O. XX-XX-XX"`,
                    },
                    key19_7_1_9: {
                      description: `For UN specification jerricans secured in permanently configured and approved
        holders of the transporting vehicle or equipment. Identify PSN, hazard class, the number of
        jerricans and quantity of fuel in each jerrican for the transporting vehicle or equipment.
        Example - "4 Jerricans X 19 L"; "1 Jerrican X 19 L”; “1 Jerrican X 12 L." DOT 5L jerricans
        secured in permanently configured and approved holders may be documented in the same
        manner provided they are drained to the greatest extent possible.`,
                    },
                    key19_7_1_10: {
                      description: `For vehicles, equipment, machinery, or apparatus containing magnetized material
        with a magnetic field strength greater than 0.002 gauss or more, measured at 2.1m (7 feet)
        from the source, enter “Contains Magnetized Material.”`,
                    },
                  },
                ],
              },
              key19_7_2: {
                description: `For Dangerous Goods in Machinery or Apparatus, enter the PSN, hazard class, and
      net quantity of hazardous materials in a solid, liquid, or gaseous state contained within the
      article.`,
              },
              key19_7_3: {
                description: `For life-saving appliances, Class 9, prepared according to A13.12., enter the PSN
      and hazard class of each hazardous component within the shipping container.`,
              },
              key19_7_4: {
                description: `When dry ice is used as a refrigerant for another hazardous material, identify the dry
      ice as an accessorial hazard by entering the PSN, hazard class, and net quantity.`,
              },
            },
          ],
        },
      },
    ],
  },
  key20: {
    title: "Name of Signatory.",
    description: `Enter the name of the official signing the form. Military rank may be included.`,
  },
  key21: {
    title: "Date.",
    description: `Enter the date the material was certified.`,
  },
  key22: {
    title: "Signature.",
    description: `The official who certifies that the shipment complies with the
requirements of this instruction signs the form. Signature may be either written manually, by
mechanical entry, or by a digital method. In all cases, ensure the individual who signs the
certification statement personally inspects the HAZMAT item being certified.`,
  },
};
