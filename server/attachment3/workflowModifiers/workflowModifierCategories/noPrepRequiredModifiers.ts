import { DocumentNode } from "../../types";
import { SpecialProvisionsMap } from "../../../lookupFunctions/specialProvisions";

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

export const numericSpecialProvisionsWorkflowStoppers: SpecialProvisionsMap = {
  "30": "Sulphur is not regulated if transported in a non-bulk packaging or if formed to a specific shape (e.g., prills, granules, pellets, pastilles, or flakes).",
  "33": "Ammonium nitrites and mixtures of an inorganic nitrite with an ammonium salt are prohibited.",
  "111":
    "Explosive substances of Class 1.1A are forbidden for transportation if dry or not desensitized, unless incorporated in a device.",
  "332":
    "“Magnesium nitrate hexahydrate” is not subject to the requirements of this manual.",
  "346":
    "“Nitrogen, refrigerated liquid (cryogenic liquid), UN1977” transported in accordance with the requirements for open cryogenic receptacles in 49 CFR Section 173.320 and this special provision are not subject to any other requirements of this manual. The receptacle must contain no hazardous materials other than the liquid nitrogen which must be fully absorbed in a porous material in the receptacle. (T-0).",
  "349":
    "Mixtures of hypochlorite with an ammonium salt are forbidden for transport. A hypochlorite solution, UN1791, is a Class 8 corrosive material.",
  "361":
    "Capacitors with an energy storage capacity of 0.3 Wh or less are not subject to the requirements of this manual. Energy storage capacity means the energy held by a capacitor, as calculated using the nominal voltage and capacitance. This entry does not apply to capacitors that by design maintain a terminal voltage (e.g., asymmetrical capacitors.)",
  /* UN3499 => CAPACITOR, ELECTRIC DOUBLE LAYER with an energy storage capacity greater than 0.3 Wh */
};

export const aCodeWorkflowStoppers: SpecialProvisionsMap = {
  A58: "An aqueous solution containing 24% or less alcohol by volume and more than 50% water is not subject to these regulations.",
  A67: "Non-spillable batteries are considered dry batteries and not subject to any other requirements of this manual if:\n(1) At a temperature of 55 degrees C (130 degrees F), the electrolyte will not flow from a ruptured or cracked case and there is no free liquid to flow; (T-0).\n(2) Securely packed in strong outer packaging's or secured to skids or pallets capable of withstanding the shocks normally incident to transportation. The batteries must be loaded or braced so as to prevent damage and short circuits in transit, and any other material loaded in the same vehicle must be blocked, braced, or otherwise secured to prevent contact with or damage to the batteries. (T-0). A non-spillable battery which is an integral part of and necessary for the operation of mechanical or electronic equipment must be securely fastened in the battery holder on the equipment. (T-0).",
  A508: "Diagnostic, Patient, or Clinical Specimens not containing a Category A or B infectious substances are not regulated by this manual.",
  A509: "Magnesium alloys with 50% or less magnesium in pellets, turning or ribbons are not regulated.",
};
