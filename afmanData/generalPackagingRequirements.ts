import renderDocumentNodes from "../server/renderDocumentNodes/renderDocumentNodes";
import { DocumentNode } from "@../../../types";

export const A1_6: DocumentNode = {
  id: "1.6.",
  parentId: "1.",
  title: "General Packaging Requirements.",
  bodyText: `Package hazardous materials in containers authorized
  by this manual, Title 49 Code of Federal Regulations (CFR) Part 173, Shippers-General
  Requirements for Shipments and Packagings, the International Civil Aviation Organization
  (ICAO) Technical Instructions, or the International Air Transport Association (IATA)
  Dangerous Goods Regulation. All packages and receptacles must be serviceable to include
  closures and cushioning material prior to use. (T-0). Containers must be inspected and free of
  any incompatible residue, rupture or other damage that reduces the structural integrity. (T-0).
  Attachment 3 applies to all military air shipments. See paragraph A17.2 for certification
  instructions.`,
};

export const A1_7: DocumentNode = {
  id: "1.7.",
  parentId: "1.",
  title: "Damaged or Improper Shipments.",
  bodyText: `Do not transport any shipment of damaged, leaking, or
  improperly packed, marked, or labeled hazardous item or material. Items that are damaged or
  leaking in a manner not affecting the hazardous material may be transported provided the
  shipper and aircrew can verify its safety. (e.g., minor non-hazardous oil leak from engine or
  condensation on refrigerated package.)`,
  childNodeIds: ["1.7.1.", "1.7.2.", "1.7.3.", "1.7.4.", "1.7.5.", "1.7.6."],
};

export const A1_7_1: DocumentNode = {
  id: "1.7.1.",
  parentId: "1.7.",
  bodyText: `It is the originator’s responsibility to correct noncompliant packaging. The originating
  shipping activity may provide the transportation function necessary packaging to correct the
  shipment, within the capability of the transportation function, or correct the packaging on
  site. Consider urgency of need when determining the best method for correcting a deficient
  shipment. Costs related to correcting a shipment are the responsibility of the originating
  shipping activity.`,
};

export const A1_7_2: DocumentNode = {
  id: "1.7.2.",
  parentId: "1.7.",
  bodyText: `Report deficiencies in accordance with the procedures detailed in the DTR 4500.9-R,
  Part II, Chapter 210. Report supply discrepancies including item, packaging, and
  documentation discrepancies under official Supply Discrepancy Report (SDR) guidance
  contained in Defense Logistics Manual (DLM) 4000.25-M, Defense Logistics Management
  System (DLMS), Volume 2, Chapter 17, Supply Discrepancy Reporting.`,
};

export const A1_7_3: DocumentNode = {
  id: "1.7.3.",
  parentId: "1.7.",
  bodyText: `Check packages, containers or equipment containing hazardous materials for damage or
  leakage of the hazardous materials when loading or unloading the aircraft. When packages
  or overpacks containing hazardous materials have been transported in equipment or on a
  pallet, check the area where the equipment or pallet was stowed. In the event of leakage or
  suspected leakage of hazardous materials, inspect the compartment in which the package,
  overpack, equipment, or pallet was carried for contamination and decontaminate if
  applicable. Remove any package, baggage or cargo that appears to be leaking or
  contaminated by a hazardous material. In the case of a package, baggage or cargo that
  appears to be leaking hazardous materials, ensure that other packages, baggage or cargo are
  in proper condition for transport and that no other package, baggage or cargo has been
  contaminated or is leaking. Immediately report any release of a hazardous substance in a
  quantity equal to or greater than its reportable quantity to the EPA if located CONUS
  (including Alaska and Hawaii) by calling the US Coast Guard National Response Center at
  800-424-8802 or 202-267-2675. Note: “Hazardous substance” for purposes of this
  requirement is defined in 40 CFR 300.5 (rather than the definition found in this manual).`,
};

export const A1_7_4: DocumentNode = {
  id: "1.7.4.",
  parentId: "1.7.",
  bodyText: `Consult local installation operating procedures for hazardous material emergency
  planning, response, and reporting requirements in the event of an incident involving
  hazardous materials.`,
};

export const A1_7_5: DocumentNode = {
  id: "1.7.5.",
  parentId: "1.7.",
  bodyText: `Do not move dropped or damaged explosive items. Ensure the Transportation or
  Packaging Office immediately contacts Explosive Ordnance Disposal (EOD), unexploded
  ordnance (UXO) qualified personnel to determine disposition. (T-0).`,
};

export const A1_7_6: DocumentNode = {
  id: "1.7.6.",
  parentId: "1.7.",
  title: "Infectious Substance packages.",
  bodyText: `If a package containing infectious substances is found to
  be damaged or leaking notify technical escorts, Biological Personnel Reliability Program
  personnel escorting the sample or medical personnel. Personnel must: 
  (1) avoid handling the package or keep handling to a minimum; 
  (2) inspect adjacent packages for contamination and put aside any that may have been contaminated; 
  (3) notify the shipper and/or the receiver that the package has leaked. (T-0). 

  Upon discovering damage to the package, which indicates damage to the primary container, 
  the carrier must isolate the container, and if located CONUS (including Alaska and Hawaii) 
  notify the US Coast Guard National Response Center at 800-424-8802 or 202-267-2675. (T-0).`,
};

export const A1_8: DocumentNode = {
  id: "1.8.",
  parentId: "1.",
  title: "Stowing Hazardous Materials.",
  bodyText:
    "Ensure proper stowage of hazardous materials to maintain safety and compliance.",
  childNodeIds: ["1.8.1.", "1.8.2.", "1.8.3.", "1.8.4.", "1.8.5."],
};

export const A1_8_1: DocumentNode = {
  id: "1.8.1.",
  parentId: "1.8.",
  bodyText:
    "Ensure hazardous materials are compatible (Attachment 18) when stored in transit.",
};

export const A1_8_2: DocumentNode = {
  id: "1.8.2.",
  parentId: "1.8.",
  bodyText: "Ensure hazardous materials are accessible in flight.",
};

export const A1_8_3: DocumentNode = {
  id: "1.8.3.",
  parentId: "1.8.",
  bodyText:
    "Ensure hazard markings and warning labels are visible to aircrew and unloading personnel.",
};

export const A1_8_4: DocumentNode = {
  id: "1.8.4.",
  parentId: "1.8.",
  bodyText: `Do not stow liquid or toxic hazardous materials on the same aircraft pallet with foodstuff,
  feed, or any other edible material intended for consumption by humans or animals. Solid
  material, such as explosive articles, may be loaded on the same aircraft pallet with foodstuffs
  based on operational requirements. If required by operational necessity, comply with the
  following when loading foodstuff or Meals Ready to Eat (MRE) on the same 463L pallet with
  hazardous materials:`,
  childNodeIds: ["1.8.4.1.", "1.8.4.2.", "1.8.4.3."],
};

export const A1_8_4_1: DocumentNode = {
  id: "1.8.4.1.",
  parentId: "1.8.4.",
  bodyText:
    "Do not load MREs or other edible material on the same pallet with any hazardous material liquid or Class/division 2.3 gases.",
};

export const A1_8_4_2: DocumentNode = {
  id: "1.8.4.2.",
  parentId: "1.8.4.",
  bodyText:
    "Separate hazardous materials (except Class 1) from the foodstuff/MREs by the greatest distance possible, but not less than 44 inches in all directions.",
};

export const A1_8_4_3: DocumentNode = {
  id: "1.8.4.3.",
  parentId: "1.8.4.",
  bodyText: "Do not load hazardous materials above the foodstuff/MRE's.",
};

export const A1_8_5: DocumentNode = {
  id: "1.8.5.",
  parentId: "1.8.",
  bodyText: `Packages bearing orientation arrow (“This Way Up”) labels must be loaded, stowed and
  handled at all times according to label direction. (T-0). Single packagings with end closures
  must be loaded and stowed with closures upward. (T-0).`,
};

export const A1_9: DocumentNode = {
  id: "1.9.",
  parentId: "1.",
  title: "Protective Equipment.",
  bodyText: `Bases ensure availability of protective equipment to cope with
  ground emergencies involving the cargo during loading operations. Coordinate respiratory and
  other personal protection requirements with the medical service. The aircraft operator ensures
  appropriate equipment is available to protect aircrew and passengers when transporting
  materials whose vapors are toxic, irritating or corrosive. Aircraft must have a closed oxygen
  system or protective mask for each person aboard. (T-0). The shipper provides any required
  special equipment to meet unique cargo safety requirements. (T-0). It is the shipper's
  responsibility to consult subject matter experts (SME), and the SME will, based on intimate
  knowledge of the material, determine necessary required protective equipment. (T-0). While
  the exact equipment required depends on the materials being transported, the following are the
  recommended minimum (or equivalent substitutions):`,
  childNodeIds: ["1.9.1.", "1.9.2.", "1.9.3.", "1.9.4.", "1.9.5.", "1.9.6."],
};

export const A1_9_1: DocumentNode = {
  id: "1.9.1.",
  parentId: "1.9.",
  bodyText: "Two pairs of rubber gloves.",
};

export const A1_9_2: DocumentNode = {
  id: "1.9.2.",
  parentId: "1.9.",
  bodyText: "One pair of protective gloves.",
};

export const A1_9_3: DocumentNode = {
  id: "1.9.3.",
  parentId: "1.9.",
  bodyText: "One plastic or rubber apron.",
};

export const A1_9_4: DocumentNode = {
  id: "1.9.4.",
  parentId: "1.9.",
  bodyText:
    "A five-pound (2.3 kg) package of incombustible absorbent material.",
};

export const A1_9_5: DocumentNode = {
  id: "1.9.5.",
  parentId: "1.9.",
  bodyText: "Three large plastic bags (4-mil thick, as a minimum).",
};

export const A1_9_6: DocumentNode = {
  id: "1.9.6.",
  parentId: "1.9.",
  bodyText: "One oxygen or protective mask for each person.",
};

export const A1_10: DocumentNode = {
  id: "1.10.",
  parentId: "1.",
  title: "Unitized, Palletized, Overpacked, or Containerized Loads.",
  bodyText: `Shippers must ensure aerial ports can handle loads. (T-0). Ensure load configurations are:`,
  childNodeIds: [
    "1.10.1.",
    "1.10.2.",
    "1.10.3.",
    "1.10.4.",
    "1.10.5.",
    "1.10.6.",
    "1.10.7.",
    "1.10.8.",
    "1.10.9.",
  ],
};

export const A1_10_1: DocumentNode = {
  id: "1.10.1.",
  parentId: "1.10.",
  bodyText: "Unitized loads will be as stable as a single container. (T-0).",
};

export const A1_10_2: DocumentNode = {
  id: "1.10.2.",
  parentId: "1.10.",
  bodyText: `Freight containers (e.g., Internal airlift and helicopter Slingable Unit (ISU), Container
  Express (CONEX), Military-Owned Demountable Container (MILVAN), etc.) are not
  considered the outer package or overpack for any item stowed inside. Items within freight
  containers must be packaged as prescribed in this manual. (T-0). Since air movement
  subjects cargo to rapid acceleration and deceleration, ensure the contents of freight containers
  are adequately secured/restrained to prevent damage or breakage from shifting. Consider
  both horizontal and vertical movement when securing/restraining the contents.`,
};

export const A1_10_3: DocumentNode = {
  id: "1.10.3.",
  parentId: "1.10.",
  bodyText: `Mark and label individual packages within overpacks and freight containers according
  to this manual and Military Standard – 129 (MIL-STD-129), Military Marking for Shipment
  and Storage.`,
};

export const A1_10_4: DocumentNode = {
  id: "1.10.4.",
  parentId: "1.10.",
  bodyText:
    "Designed to provide installed equipment in approved holders meeting airlift restraint criteria.",
};

export const A1_10_5: DocumentNode = {
  id: "1.10.5.",
  parentId: "1.10.",
  bodyText: "Compatible as required by Attachment 18.",
};

export const A1_10_6: DocumentNode = {
  id: "1.10.6.",
  parentId: "1.10.",
  bodyText:
    "Developed not using fiberboard or plywood sideboards unless specifically required by this manual.",
};

export const A1_10_7: DocumentNode = {
  id: "1.10.7.",
  parentId: "1.10.",
  bodyText: "Marked and labeled according to Attachment 14 and Attachment 15.",
};

export const A1_10_8: DocumentNode = {
  id: "1.10.8.",
  parentId: "1.10.",
  bodyText: `To the greatest extent possible, place packages on aircraft pallets (e.g., 463L) and
  within/on freight containers, vehicles, and trailers so that markings required by Attachment
  14 and labels required by Attachment 15 are visible.`,
  childNodeIds: ["1.10.8.1.", "1.10.8.2.", "1.10.8.3."],
};

export const A1_10_8_1: DocumentNode = {
  id: "1.10.8.1.",
  parentId: "1.10.8.",
  bodyText: `For like items with the same classification, only one of the required hazard label(s)
  need be applied and visible.`,
};

export const A1_10_8_2: DocumentNode = {
  id: "1.10.8.2.",
  parentId: "1.10.8.",
  bodyText: `For items with different hazard classifications, at least one package for each
  classification must be positioned so hazard label(s) are visible. (T-0).`,
};

export const A1_10_8_3: DocumentNode = {
  id: "1.10.8.3.",
  parentId: "1.10.8.",
  bodyText: `When placement prevents hazard labels from being visible, refer to paragraph A15.1.`,
};

export const A1_10_9: DocumentNode = {
  id: "1.10.9.",
  parentId: "1.10.",
  bodyText: `The use of the overpack provision may be limited by requirements in paragraph
  A17.2.3.2.`,
};

export const A1_11: DocumentNode = {
  id: "1.11.",
  parentId: "1.",
  title: "Accessibility.",
  bodyText: `Do not ship hazardous material in freight containers that are not easily accessible to the aircrew during flight. Physically stow hazardous materials next to the container
  opening and position to allow access while on the aircraft. The aircrew must have visual and
  physical access to all hazardous materials to mitigate any hazard posed by an in-flight incident.
  (T-0). If there is evidence of a leak, the crew-member can locate the hazard, determine the
  extent of the risk, and take appropriate action to get the leak under control or declare an in-flight
  emergency. Ensure air transportation personnel performing the joint inspection have knowledge
  and access to transportation containers containing hazardous materials during the joint
  inspection process. Provide a key or combination for locked, unescorted containers to the
  aircraft commander or designated representative. Ship only the following hazardous materials
  in inaccessible containers or tactical shelters when properly secured:`,
  childNodeIds: [
    "1.11.1.",
    "1.11.2.",
    "1.11.3.",
    "1.11.4.",
    "1.11.5.",
    "1.11.6.",
    "1.11.7.",
    "1.11.8.",
    "1.11.9.",
  ],
};

export const A1_11_1: DocumentNode = {
  id: "1.11.1.",
  parentId: "1.11.",
  bodyText: `Recompression vans, support vans, and shelters used by the Underwater Construction
  Team. Hazardous items inside these escorted containers have been identified to and approved
  for shipment by AFMC/A4RT.`,
};

export const A1_11_2: DocumentNode = {
  id: "1.11.2.",
  parentId: "1.11.",
  bodyText: `Fire extinguishers secured in appropriate holders or brackets, or properly packaged
  according to this manual.`,
};

export const A1_11_3: DocumentNode = {
  id: "1.11.3.",
  parentId: "1.11.",
  bodyText: `Vehicles, support equipment (SE), or other mechanical apparatus. Completely drain
  (residual fuel not to exceed 17 oz) items fueled by a flammable liquid with a flash point at
  or above 38 degrees C (100 degrees F). Tightly seal fuel lines and tank to prevent residual
  fuel leaks. Drain and purge items fueled by a flammable liquid with a flash point below 38
  degrees C (100 degrees F). Secure installed batteries in the upright position.`,
};

export const A1_11_4: DocumentNode = {
  id: "1.11.4.",
  parentId: "1.11.",
  bodyText: `Items shipped under the Proper Shipping Name (PSN) "Life Saving Appliances" and
  packaged according to this manual.`,
};

export const A1_11_5: DocumentNode = {
  id: "1.11.5.",
  parentId: "1.11.",
  bodyText: `Air conditioners and environmental control units, magnetic material, radioactive
  material, and thermometers.`,
};

export const A1_11_6: DocumentNode = {
  id: "1.11.6.",
  parentId: "1.11.",
  bodyText: `Class/division 1.4S explosives packaged according to this manual.`,
};

export const A1_11_7: DocumentNode = {
  id: "1.11.7.",
  parentId: "1.11.",
  bodyText: `Non-flammable gases or non-flammable aerosols prepared according to this manual
  and packed in strong outer containers.`,
};

export const A1_11_8: DocumentNode = {
  id: "1.11.8.",
  parentId: "1.11.",
  bodyText: `"Consumer Commodities" not containing a liquid or a flammable gas.`,
};

export const A1_11_9: DocumentNode = {
  id: "1.11.9.",
  parentId: "1.11.",
  bodyText: `Explosives secured for air movement according to the item’s service drawing or
  technical manual.`,
};

export const A1_12: DocumentNode = {
  id: "1.12.",
  parentId: "1.",
  title: "Procedures for Airdropping Hazardous Materials.",
  bodyText: `Prepare airdrop loads according to the TO 13C7/FM 10-500 series. Prepare, mark, label, certify, and accept airdrop hazardous cargo the same as air landed cargo.`,
};

export const A1_13: DocumentNode = {
  id: "1.13.",
  parentId: "1.",
  title: "Nuclear Weapons Material.",
  bodyText: `Use the detailed information and procedures for preparing nuclear weapons material in DOE-DNA TP 45-51/Army TM 39-45-51/Navy SWOP 45-51/Air Force TO 11N-45-51, Transportation of Nuclear Weapons Material (including supplements).
  This document provides a chart indicating the air shipment compatibility of nuclear material with nonnuclear explosives and hazardous materials. Also, determine the inter-compatibility of explosives and hazardous materials according to Attachment 18.
  Packaging and handling of nuclear material not specifically outlined in the above document according to the requirements of this manual.`,
};

export const A1_14: DocumentNode = {
  id: "1.14.",
  parentId: "1.",
  title: "Air Force Interoperability Council Air Standards.",
  bodyText: `Member nations (Australia, Canada, New Zealand, United Kingdom, and United States) agree in Air Standard 1047 to accept the categorization and authorization by participating nations of explosives, radioactive materials, and dangerous cargo for onward carriage in their own military aircraft.
  Label shipments according to the ICAO, IATA, or by nationally approved labels. Certify the shipment meets all requirements for air transport.`,
};

export const A1_15: DocumentNode = {
  id: "1.15.",
  parentId: "1.",
  title:
    "North Atlantic Treaty Organization Standardization Agreement (NATO STANAG) 4441.",
  bodyText: `Part VI of this directive describes NATO standards for fixed and rotary wing aircraft when transporting dangerous goods in NATO Alliance missions by military aircraft.
  Participating nations agree to respect each other’s regulations based on ICAO-TI/IATA-DGR, and based on country-specific deviations approved for military aircraft as listed in this standard.
  US deviations US01 through US04 explain general requirements when using US military aircraft as part of NATO missions.
  Apply the national handling regulations of the carrier when transferring dangerous cargo from one nation to another for onward carriage.`,
  childNodeIds: ["1.15.1."],
};

export const A1_15_1: DocumentNode = {
  id: "1.15.1.",
  parentId: "1.15.",
  bodyText: `Paragraphs 1.14. and 1.15. are subject to international military standardization agreements. Do not make changes or deviations without authorization as prescribed in AFI 60-106, International Military Standardization (IMS) Program, 3 May 2019.`,
};

export const A1_16: DocumentNode = {
  id: "1.16.",
  parentId: "1.",
  title: "Mail Shipments.",
  bodyText: `Shipment of hazardous material by mail is not permitted on military aircraft.`,
};

export const A1_17: DocumentNode = {
  id: "1.17.",
  parentId: "1.",
  title: "Transporting Foreign Troops.",
  bodyText: `Transport hazardous materials belonging to non-U.S. military units using the same guidelines as for U.S. forces.`,
  childNodeIds: ["1.17.1.", "1.17.2.", "1.17.3."],
};

export const A1_17_1: DocumentNode = {
  id: "1.17.1.",
  parentId: "1.17.",
  bodyText: `Comply with paragraph 3.5. for hand-carried items.`,
};

export const A1_17_2: DocumentNode = {
  id: "1.17.2.",
  parentId: "1.17.",
  bodyText: `Ensure use of serviceable United Nations (UN) specification containers or packaging approved by the competent authority of the transported force.
  Packaged hazardous materials must be properly marked and labeled to identify the contents. (T-0).
  Comply with paragraph A3.3.2.10. when transporting cylinders.`,
};

export const A1_17_3: DocumentNode = {
  id: "1.17.3.",
  parentId: "1.17.",
  bodyText: `Equivalent foreign certification documents as approved by the competent authority of the transported force may be accepted in place of the Shipper's Declaration for Dangerous Goods form.
  As a minimum, the foreign certification document must include in English, the proper shipping name, UN identification number, hazard class/division and compatibility group, packing group (if required), and quantity per package of hazardous materials. (T-0).`,
};

export const A1_18: DocumentNode = {
  id: "1.18.",
  parentId: "1.",
  title: "Emergency Response Information.",
  bodyText: `Do not offer for transportation, accept for transportation, transfer, store, or otherwise handle hazardous materials unless emergency response information is available at all times.
  The shipper must provide a 24-hour emergency response telephone number that is monitored at all times by personnel who are knowledgeable of the hazards and characteristics of the materials being shipped. (T-0).
  This information is required in the event of an emergency involving the material. See paragraph A17.2.9.`,
};

export const A1_19: DocumentNode = {
  id: "1.19.",
  parentId: "1.",
  title: "Use of Commercial Airlift.",
  bodyText: `Use DOT special permits 7573 (DOT SP-7573) and 9232 (DOT SP-9232), as outlined in Attachment 23, as required for AMC contracted commercial cargo airlift.`,
};

export const A1_20: DocumentNode = {
  id: "1.20.",
  parentId: "1.",
  title: "Exercises.",
  bodyText: `Hazardous materials should not be air transported during an exercise solely to demonstrate movement capability when there is no planned operational use at the deployed location.
  When possible, inert material should be substituted for hazardous materials.`,
};

export const generalPackagingRequirementsDocumentNodesList: DocumentNode[] = [
  A1_6,
  A1_7,
  A1_7_1,
  A1_7_2,
  A1_7_3,
  A1_7_4,
  A1_7_5,
  A1_7_6,
  A1_8,
  A1_8_1,
  A1_8_2,
  A1_8_3,
  A1_8_4,
  A1_8_4_1,
  A1_8_4_2,
  A1_8_4_3,
  A1_8_5,
  A1_9,
  A1_9_1,
  A1_9_2,
  A1_9_3,
  A1_9_4,
  A1_9_5,
  A1_9_6,
  A1_10,
  A1_10_1,
  A1_10_2,
  A1_10_3,
  A1_10_4,
  A1_10_5,
  A1_10_6,
  A1_10_7,
  A1_10_8,
  A1_10_8_1,
  A1_10_8_2,
  A1_10_8_3,
  A1_10_9,
  A1_11,
  A1_11_1,
  A1_11_2,
  A1_11_3,
  A1_11_4,
  A1_11_5,
  A1_11_6,
  A1_11_7,
  A1_11_8,
  A1_11_9,
  A1_12,
  A1_13,
  A1_14,
  A1_15,
  A1_15_1,
  A1_16,
  A1_17,
  A1_17_1,
  A1_17_2,
  A1_17_3,
  A1_18,
  A1_19,
  A1_20,
];

export const renderGeneralPackagingRequirementsDocumentNodes = (): string => {
  const sections = [
    "1.6.",
    "1.7.",
    "1.8.",
    "1.9.",
    "1.10.",
    "1.11.",
    "1.12.",
    "1.13.",
    "1.14.",
    "1.15.",
    "1.16.",
    "1.17.",
    "1.18.",
    "1.19.",
    "1.20.",
  ];

  // Generate all document nodes
  const renderedSections = sections
    .map(sectionId =>
      renderDocumentNodes(
        sectionId,
        generalPackagingRequirementsDocumentNodesList
      )
    )
    .join(""); // Concatenate all HTML strings

  // Return a single HTML string wrapping all sections
  return `
    <div style="padding: 15px; font-family: Arial, sans-serif; line-height: 1.5;">
      ${renderedSections}
    </div>
  `;
};
