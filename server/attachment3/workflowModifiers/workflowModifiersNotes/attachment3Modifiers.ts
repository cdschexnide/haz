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

/* changes PG level for hazClasses: 4.1, 4.2, 4.3, 5.1, and 8 */
export const A3_1_9: DocumentNode = {
  id: "A3.1.9.",
  parentId: "A3.1.",
  title: "Packaging for certain Class/Divisions.",
  bodyText: `A packaging containing a Packing Group III material with a primary or subsidiary hazard
    of Class/Division 4.1, 4.2, 4.3, 5.1, or 8 must meet Packing Group II performance level. <strong>(T-0).</strong>`,
};

/* Identifying Nonregulated Material */
export const A3_1_16_4: DocumentNode = {
  id: "A3.1.16.4.",
  parentId: "A3.1.16.",
  title: "Identifying Nonregulated Material, Containers or Cylinders.",
  bodyText: `An item listed in Table A4.1. may not be regulated because it does not meet the definition of
    the hazard class. This includes containers or articles defined as empty according to this paragraph.
    In this situation, when the item is determined to be nonregulated, the shipper alerts the carrier by:`,
  childNodeIds: [
    "A3.1.16.4.1.",
    "A3.1.16.4.2.",
    "A3.1.16.4.3.",
    "A3.1.16.4.4.",
  ],
};

export const A3_1_16_4_1: DocumentNode = {
  id: "A3.1.16.4.1.",
  parentId: "A3.1.16.4.",
  bodyText: `Annotating "NONHAZARDOUS" in the address block of the Military Shipment Label (MSL)
    and/or mark container “Non-Regulated”. In the absence of the MSL, the shipper uses an equivalent
    means of notification.`,
};

export const A3_1_16_4_2: DocumentNode = {
  id: "A3.1.16.4.2.",
  parentId: "A3.1.16.4.",
  bodyText: `Ship the item as general cargo and a Shipper's Declaration for Dangerous Goods form is not required.`,
};

export const A3_1_16_4_3: DocumentNode = {
  id: "A3.1.16.4.3.",
  parentId: "A3.1.16.4.",
  bodyText: `Apply an "EMPTY" label according to Attachment 15, when applicable. A label is not required for
    equipment or articles unless packaged, crated, or otherwise enclosed to prevent ready identification.`,
};

export const A3_1_16_4_4: DocumentNode = {
  id: "A3.1.16.4.4.",
  parentId: "A3.1.16.4.",
  bodyText: `The "NONHAZARDOUS" entry on the MSL and the use of an "EMPTY" label is not required when
    the hazardous contents are completely removed from the container and there is no possibility of remaining
    residue, and the hazard communication markings and labels are removed or covered. Identify cylinders as
    empty as required by A15.3.4.`,
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

export const A3_3_7_12_1: DocumentNode = {
  id: "A3.3.7.12.1.",
  parentId: "A3.3.7.12.",
  title: "",
  bodyText:
    "With the exception of UN2908, UN2909, UN2910, UN2911, UN2977, and UN2978, radioactive material with a subsidiary hazard must meet the following:",
  childNodeIds: ["A3.3.7.12.1.1.", "A3.3.7.12.1.2."],
};

export const A3_3_7_12_1_1: DocumentNode = {
  id: "A3.3.7.12.1.1.",
  parentId: "A3.3.7.12.1.",
  title: "",
  bodyText:
    "Be labeled with subsidiary hazard labels corresponding to each subsidiary hazard exhibited by the material. Affix corresponding placards to transport units in accordance with the provisions of Attachment 16.",
};

export const A3_3_7_12_1_2: DocumentNode = {
  id: "A3.3.7.12.1.2.",
  parentId: "A3.3.7.12.1.",
  title: "",
  bodyText:
    "Be allocated to Packing Groups I, II, or III, and if appropriate, by application of the grouping criteria in A4.2.4. corresponding to the nature of the predominant subsidiary hazard.",
};

export const A3_3_7_12_2: DocumentNode = {
  id: "A3.3.7.12.2.",
  parentId: "A3.3.7.12.",
  title: "",
  bodyText:
    "The basic description required on the Shipper's Declaration for Dangerous Goods must include a description of these subsidiary hazards (e.g., “3, 6.1”), the name of the constituents which most predominantly contribute to the subsidiary hazard(s), and where applicable, the packing group.",
};

export const A3_3_7_12_3: DocumentNode = {
  id: "A3.3.7.12.3.",
  parentId: "A3.3.7.12.",
  title: "",
  bodyText:
    "Transport radioactive material with a subsidiary hazard of Division 4.2 (Packing Group I) in Type B packages. Radioactive material with a subsidiary hazard of Division 2.1 is forbidden from transport on passenger aircraft. Radioactive material with a subsidiary hazard of Division 2.3 is forbidden from transport on passenger and cargo aircraft without a waiver or CAA, as appropriate.",
};

export const A3_3_8_2: DocumentNode = {
  id: "A3.3.8.2.",
  parentId: "A3.3.8.",
  title: "Packaging.",
  bodyText:
    "Unless otherwise specified by a packaging paragraph, package a liquid material identified as PG III in Table A4.1 in a container that meets the PG I or II performance level.",
};
