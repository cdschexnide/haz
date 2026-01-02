import { SpecialProvisionsMap } from "../../../lookupFunctions/specialProvisions";
import { DocumentNode } from "../../types";

export const A3_1_1_1: DocumentNode = {
  id: "A3.1.1.1.",
  parentId: "A3.1.1.",
  title: "Exempt Items.",
  bodyText: `The following materials are exempt from UN performance
  specification packaging test requirements. The packaging paragraph from Table A4.1.
  specifies required packaging. While UN specification packaging is not required, material
  may be subject to package performance tests.`,
  childNodeIds: [
    "A3.1.1.1.1.",
    "A3.1.1.1.2.",
    "A3.1.1.1.3.",
    "A3.1.1.1.4.",
    "A3.1.1.1.5.",
    "A3.1.1.1.6.",
    "A3.1.1.1.7.",
    "A3.1.1.1.8.",
    "A3.1.1.1.9.",
  ],
};

export const A3_1_1_1_1: DocumentNode = {
  id: "A3.1.1.1.1.",
  parentId: "A3.1.1.1.",
  bodyText: "Compressed gas cylinders",
};

export const A3_1_1_1_2: DocumentNode = {
  id: "A3.1.1.1.2.",
  parentId: "A3.1.1.1.",
  bodyText: "Radioactive material",
};

export const A3_1_1_1_3: DocumentNode = {
  id: "A3.1.1.1.3.",
  parentId: "A3.1.1.1.",
  bodyText: "Dry ice",
};

export const A3_1_1_1_4: DocumentNode = {
  id: "A3.1.1.1.4.",
  parentId: "A3.1.1.1.",
  bodyText: "Magnetized material",
};

export const A3_1_1_1_5: DocumentNode = {
  id: "A3.1.1.1.5.",
  parentId: "A3.1.1.1.",
  bodyText: "Life-saving appliances",
};

export const A3_1_1_1_6: DocumentNode = {
  id: "A3.1.1.1.6.",
  parentId: "A3.1.1.1.",
  bodyText: "Mercury contained in manufactured articles",
};

export const A3_1_1_1_7: DocumentNode = {
  id: "A3.1.1.1.7.",
  parentId: "A3.1.1.1.",
  bodyText:
    'Items identified in this manual as requiring "strong outer packaging"',
};

export const A3_1_1_1_8: DocumentNode = {
  id: "A3.1.1.1.8.",
  parentId: "A3.1.1.1.",
  bodyText: "Limited and Excepted Quantities.",
};

export const A3_1_1_1_9: DocumentNode = {
  id: "A3.1.1.1.9.",
  parentId: "A3.1.1.1.",
  bodyText: "Biological Substances, Category B.",
};

export const A3_1_9: DocumentNode = {
  id: "A3.1.9.",
  parentId: "A3.1.",
  title: "Packaging for certain Class/Divisions.",
  bodyText: `A packaging containing a Packing Group III material with a primary or subsidiary hazard
    of Class/Division 4.1, 4.2, 4.3, 5.1, or 8 must meet Packing Group II performance level. <strong>(T-0).</strong>`,
};

export const A3_3_1_1_4: DocumentNode = {
  id: "A3.3.1.1.4.",
  parentId: "A3.3.1.1.",
  bodyText: `Package all Class 1 material in packaging that meets the PG I or II performance level.`,
};

export const A3_3_1_10: DocumentNode = {
  id: "A3.3.1.10.",
  parentId: "A3.3.1.",
  title: "Grandfathered Items.",
  bodyText: `Government-owned explosives (Class 1) packaged before 1 January 1990 are exempt from UN specification
    requirements. Ship these items under the packaging requirements in effect at the time of packaging. Annotate key 19
    of the Shipper's Declaration for Dangerous Goods "Government-owned goods packaged before 1 January 1990." See
    Attachment 17 for certification instructions.`,
};

export const A3_3_3_2_1: DocumentNode = {
  id: "A3.3.3.2.1.",
  parentId: "A3.3.3.2.",
  bodyText:
    "Non-bulk packages must be capable of meeting air-eligible pressure requirements specified for Class 3 Packing Group III specified in A3.1.7.1. or A3.1.7.2. <strong>(T-0).</strong>",
};

export const A3_3_3_2_2: DocumentNode = {
  id: "A3.3.3.2.2.",
  parentId: "A3.3.3.2.",
  bodyText:
    "Bulk combustible liquids must be transported in UN specification packaging (e.g., IBCs) meeting air eligibility requirements of paragraph A3.1.7.2. for PG III. (T0).",
};

export const A3_3_3_5: DocumentNode = {
  id: "A3.3.3.5.",
  parentId: "A3.3.3.",
  title: "Bulk Fuel.",
  bodyText:
    "Do not transport bulk tanks which are part of servicing trucks, trailers, semitrailers, or individual bulk storage tanks containing flammable fuel, or any bulk hazardous material by air (except as authorized in paragraph A7.2.9.). Transport bulk combustible liquids in UN specification packaging (e.g., IBCs) meeting air eligibility requirements of paragraph A3.1.7.2. for PG III. The following draining/purging requirements apply:",
  childNodeIds: ["A3.3.3.5.1.", "A3.3.3.5.2.", "A3.3.3.5.3.", "A3.3.3.5.4."],
};

export const A3_3_3_5_1: DocumentNode = {
  id: "A3.3.3.5.1.",
  parentId: "A3.3.3.5.",
  bodyText:
    "Purge bulk tanks for all liquids with a flash point below 38 degrees C (100 degrees F ), regardless of whether the technical manual only requires draining.",
};

export const A3_3_3_5_2: DocumentNode = {
  id: "A3.3.3.5.2.",
  parentId: "A3.3.3.5.",
  bodyText:
    "Drain, but need not purge, liquids with a flash point at or above 38 degrees C (100 degrees F), unless the technical manual specifically requires purging.",
};

export const A3_3_3_5_3: DocumentNode = {
  id: "A3.3.3.5.3.",
  parentId: "A3.3.3.5.",
  bodyText:
    "Provide air circulation in the cargo compartment of pressurized aircraft.",
};

export const A3_3_3_5_4: DocumentNode = {
  id: "A3.3.3.5.4.",
  parentId: "A3.3.3.5.",
  bodyText:
    "Drain and purge all fuel from the tank, stand-pipe, and internal lines of external aircraft fuel tanks to prevent leaking during transport.",
};

export const A3_3_4_2: DocumentNode = {
  id: "A3.3.4.2.",
  parentId: "A3.3.4.",
  title: "Packaging.",
  bodyText: `Unless otherwise specified by a packaging paragraph, package a material identified as PG III in Table A4.1.
    in a container that meets the PG I or II performance level.`,
};

export const A3_3_4_5: DocumentNode = {
  id: "A3.3.4.5.",
  parentId: "A3.3.4.",
  title: "Fusee.",
  bodyText: `The PSN "FUSEE" is only valid for domestic movement.
    For international shipment use the PSN "SIGNAL DEVICES, HAND" and package the material as required
    by the packaging paragraph for signal devices, hand.`,
};

export const A3_3_5_3: DocumentNode = {
  id: "A3.3.5.3.",
  parentId: "A3.3.5.",
  title: "Packaging.",
  bodyText:
    "Unless otherwise specified by a packaging paragraph, package a material identified as PG III in Table A4.1. in a container that meets the PG I or II performance level.",
};

export const A3_3_8_2: DocumentNode = {
  id: "A3.3.8.2.",
  parentId: "A3.3.8.",
  title: "Packaging.",
  bodyText:
    "Unless otherwise specified by a packaging paragraph, package a liquid material identified as PG III in Table A4.1 in a container that meets the PG I or II performance level.",
};

export const aCodePackagingModifiers: SpecialProvisionsMap = {
  A1: "Single packaging is not permitted on aircraft carrying passengers. P4 restrictions apply.",
  A2: "Single packagings are not permitted.",
  A3: "For combination packagings, if glass inner packagings (including ampoules) are used, they must be packed with absorbent material in tightly closed rigid and leak proof receptacles before packing in outer packaging's. (T-0).",
  A19: "Combination packaging's consisting of outer fiber drums or plywood drums, with inner plastic packaging's, are not authorized.",
  A20: "Plastic bags as inner receptacles of combination packaging's are not authorized.",
  A29: "Combination packaging's consisting of outer expanded plastic boxes with inner plastic bags are not authorized.",
  A30: "Ammonium permanganate is not authorized.",
  /* ??? */ A35: "This includes material which is not covered by any other hazard class but has anesthetic, narcotic, noxious or other properties such that, in the event of spillage or leakage on the aircraft, extreme annoyance or discomfort could be caused to aircrew members so as to prevent correct performance of assigned duties. For material containing aromatic extract or flavoring, use packaging paragraph A13.2. For all other material shipped under this PSN, use packaging paragraph A13.14.",
  A56: "Radioactive material with a subsidiary hazard of Division 4.2 Packing Group I must be transported in Type B packages when offered for transportation by aircraft. Radioactive material with a subsidiary hazard of Division 2.1 is forbidden from transport on passenger aircraft.",
  A61: "When used for purposes such as sterilization, inner packaging's of peroxyacetic acid, stabilized, classified as UN3107 Organic peroxide type E, liquid or UN3109 Organic peroxide type F, liquid may be fitted with a vent consisting of hydrophobic membrane, provided:\n(1) Each inner packaging contains not more than 70 mL;\n(2) The inner packaging is designed so that the vent is not immersed in liquid in any orientation;\n(3) Each inner packaging is enclosed in an intermediate rigid plastic packaging with a small opening to permit release of gas and contains a buffer that neutralizes the contents of the inner packaging in the event of leakage;\n(4) Intermediate packaging's are packed in a fiberboard box (4G) outer packaging;\n(5) Each outer packaging contains not more than 1.4 L of liquid; and\n(6) The rate of oxygen release from the outer packaging does not exceed 15 mL per hour.\nSuch packages must be transported on cargo aircraft only. (T-0).",
  /* ??? */ A124: "Only mixtures with not more than 23.5% oxygen may be transported under this entry. A Division 5.1 subsidiary hazard label is not required for any concentration within this limit.",
  A140: "Technical name must not be shown on the package, but must be shown on the shipper's declaration for dangerous goods. (T-0). When the infectious substances to be transported are unknown, but suspected of meeting the criteria for inclusion in Category A and assigned to UN2814 or UN2900, the words “Suspected Category A Infectious Substance” must be shown in parenthesis following the proper shipping name on the shipper’s declaration for dangerous goods but not on the outer package. (T-0).",
  A197: "Marine Pollutants in single or combination packagings containing a net quantity per single or inner packaging of 5 L or less for liquids or having a net mass of 5 kg or less for solids, are not subject to any other requirements of this mnanual provided the packagings meet the general requirements in Attachment 3. This exception does not apply to marine pollutants that are a hazardous waste or a hazardous substance. In the case of marine pollutants also meeting the criteria for inclusion in another hazard class, all provisions of this manual relevant to any additional hazards continue to apply.",
  A503: "Only Class 2 (non-toxic aerosols only), Class 3 (Packing Group II or III only) and Division 6.1 (Packing Group III only) provided such substances do not have a subsidiary hazard may be shipped to an international (non-domestic) location as a Class 9.",
};

export const nCodePackagingModifiers: SpecialProvisionsMap = {
  N3: "Glass inner packagings are permitted in combination or composite packagings only if the hazardous material is free from hydrofluoric acid.",
  N4: "For combination or composite packagings, glass inner packagings, other than ampoules, are not permitted.",
  N5: "Glass materials of construction are not authorized for any part of the packaging which is normally in contact with the hazardous material.",
  // N8: "Nitroglycerin solution in alcohol may be transported under this entry only when the solution is packed in metal cans of not more than 1 L capacity each, overpacked in a wooden box containing not more than 5 L. Completely surround metal cans with absorbent material. Completely line wooden boxes with a suitable material impervious to water and nitroglycerin.",
  N12: "Plastic packagings are not authorized.",
  N25: "Steel single packagings are not authorized.",
  N32: "Aluminum materials of construction are not authorized for single packagings.",
  N33: "Aluminum drums are not authorized.",
  N34: "Aluminum construction materials are not authorized for any part of a packaging which is normally in contact with the hazardous materials.",
  N36: "Aluminum or aluminum alloy construction materials are permitted only for halogenated hydrocarbons that will not react with aluminum.",
  N37: "This material may be shipped in an integrally-lined fiber drum (1G) which meets the general packaging requirements of Attachment 3, the UN performance tests required based on the packingGroup assigned to the material and to any other special provisions of column 7 of Table A4.1.",
  N40: "This material is not authorized in the following packaging's:\n(1) A combination packaging consisting of a 4G fiberboard box with inner receptacles of glass or earthenware.\n(2) A single packaging of a 4C2 sift-proof, natural wood box.\n(3) A composite packaging 6packingGroup2 (glass, porcelain, or stoneware receptacles within a fiberboard box).",
  N41: "Metal construction materials are not authorized for any part of a packaging that is normally in contact with the hazardous material.",
  // N42: "1A1 drums made of carbon steel with thickness of body and heads of not less than 1.3 mm (0.050 inch) and with a corrosion-resistant phenolic lining are authorized for stabilized benzyl chloride if tested and certified to the Packing Group I performance level at a specific gravity of not less than 1.8.",
  N43: "Metal drums are permitted as single packaging's only if constructed of nickel or Monel.",
  N85: "Packagings certified at the Packing Group I performance level may not be used.",
  N86: "UN pressure receptacles made of aluminum alloy are not authorized.",
  N87: "The use of copper valves on UN pressure receptacles is prohibited.",
  N90: "Metal packagings are not authorized.",
};
