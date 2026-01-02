import { DocumentNode } from "../../types";

export const A3_2: DocumentNode = {
  id: "A3.2.",
  parentId: "A3.",
  title: "General Requirements Applicable to Specific Items.",
  childNodeIds: ["A3.2.1.", "A3.2.2."],
};

export const A3_2_1: DocumentNode = {
  id: "A3.2.1.",
  parentId: "A3.2.",
  title: "Meals Ready to Eat (MRE).",
  bodyText: `Follow the requirements of paragraph 1.8. for stowing MRE's on the same aircraft pallet as hazardous material.`,
  childNodeIds: ["A3.2.1.1.", "A3.2.1.2."],
};

export const A3_2_1_1: DocumentNode = {
  id: "A3.2.1.1.",
  parentId: "A3.2.1.",
  title: "Flameless Ration Heaters (FRH).",
  bodyText: `Flameless Ration Heaters (FRH), containing 8 grams or less of a magnesium-iron alloy
    (e.g., magnesium powder), packed as a component of the MRE, regardless of the number shipped,
    are not regulated by this manual (see A3.3.4). Prepare FRHs shipped separately from the MRE as
    regulated hazardous material according to this manual.`,
};

export const A3_2_1_2: DocumentNode = {
  id: "A3.2.1.2.",
  parentId: "A3.2.1.",
  title: "Fuel Sources in MREs.",
  bodyText: `Do not open, handle, or activate fuel sources shipped along with the MRE's inside the aircraft.`,
};

export const A3_2_2: DocumentNode = {
  id: "A3.2.2.",
  parentId: "A3.2.",
  title: "Polymerizable Material.",
  bodyText: `Transportation of any liquid, solid, or gaseous material that may polymerize (combine or react
    with itself) or decompose so as to cause dangerous evolution of heat or gas under normal transportation
    conditions is prohibited.`,
};
