import { DocumentNode } from "../../types";

export const A3_4: DocumentNode = {
  id: "A3.4.",
  parentId: "A3.",
  title: "Household Goods (HHG) Shipments.",
  bodyText: `DTR 4500.9-R, Part IV, Personal Property
establishes requirements for the movement of HHG and specifies that hazardous materials are
not authorized for military airlift. Exception: engine power-driven equipment (motorcycle,
moped, lawnmower, boat, snowmobile, etc.) may be transported as HHG under the following
requirements`,
  childNodeIds: [
    "A3.4.1.",
    "A3.4.2.",
    "A3.4.3.",
    "A3.4.4.",
    "A3.4.5.",
    "A3.4.6.",
  ],
};

export const A3_4_1: DocumentNode = {
  id: "A3.4.1.",
  parentId: "A3.4.",
  bodyText: `Completely drain all fuel.`,
};

export const A3_4_2: DocumentNode = {
  id: "A3.4.2.",
  parentId: "A3.4.",
  bodyText: `Run until the engine stalls.`,
};

export const A3_4_3: DocumentNode = {
  id: "A3.4.3.",
  parentId: "A3.4.",
  bodyText: `Drain all oil and cooling fluids.`,
};

export const A3_4_4: DocumentNode = {
  id: "A3.4.4.",
  parentId: "A3.4.",
  bodyText: `Allow fuel tanks and lines to remain open for at least 24 hours prior to pickup.`,
};

export const A3_4_5: DocumentNode = {
  id: "A3.4.5.",
  parentId: "A3.4.",
  bodyText: `Disconnect non-spillable gel-type batteries and tape the connection ends to prevent
  short circuit. Batteries may remain in the equipment holder, but ensure they are firmly
  secured and remain upright in the shipping container. Do not ship batteries with acid or alkali.`,
};

export const A3_4_6: DocumentNode = {
  id: "A3.4.6.",
  parentId: "A3.4.",
  bodyText: `Engine power-driven equipment prepared in this manner are not regulated by this
  manual. A Shipper's Declaration for Dangerous Goods is not required.`,
};
