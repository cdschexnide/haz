import { DocumentNode } from "../../attachment3/types";

/**
 * Renders a DocumentNode and its child nodes as indented HTML.
 * @param id The ID of the root DocumentNode.
 * @param nodes A list of nodes.
 * @returns The HTML string representation of the document.
 */
export function renderDocumentNode(id: string, nodes: DocumentNode[]): string {
  const visited = new Set<string>();

  function dfs(nodeId: string, depth: number): string {
    if (visited.has(nodeId)) return "";
    visited.add(nodeId);

    const node = nodes.find(node => node.id === nodeId);
    if (!node) {
      console.warn(`Node with id ${nodeId} not found.`);
      return "";
    }
    const marginLeft = `${depth * 20}px`;

    let html = `<div style="margin-left: ${marginLeft};"><strong>${node.id} ${
      node.title || ""
    }</strong> ${node.bodyText || ""}</div>`;

    if (node.childNodeIds) {
      for (const childId of node.childNodeIds) {
        html += dfs(childId, depth + 1);
      }
    }

    return html;
  }

  return dfs(id, 0);
}

export const Attachment7: DocumentNode = {
  id: "A7.",
  parentId: "AFMAN24-604",
  title: "CLASS 3--FLAMMABLE LIQUIDS",
  childNodeIds: [
    "A7.1.",
    "A7.2.",
    "A7.3.",
    "A7.4.",
    "A7.5.",
    "A7.6.",
    "A7.7.",
    "A7.8.",
    "A7.9.",
    "A7.10.",
    "A7.11.",
    "A7.12.",
  ],
};

export const A7_1: DocumentNode = {
  id: "A7.1.",
  parentId: "A7.",
  title: "General Requirements.",
  bodyText:
    "For military members, failure to obey the mandatory provisions from paragraphs A7.2. through A7.9. and any provisions of mandatory subparagraph(s) hereunder is a violation of Article 92, Uniform Code of Military Justice (UCMJ). Civilian employees who fail to obey the provisions from paragraph A7.2. through A7.9. and any provisions of mandatory subparagraph(s) hereunder are subject to administrative disciplinary action without regard to otherwise applicable criminal or civil sanctions. Personnel shall not deviate from these provisions and fully comply with inner/receptacle packaging and outer container options as mandated per each packaging paragraph. (T-0). Not all packaging paragraphs are inclusive and packaging is based on category of flammable liquid, cylinder type and quantity shipped.",
};

export const A7_2: DocumentNode = {
  id: "A7.2.",
  parentId: "A7.",
  title: "Packaging for Class 3 Materials",
  bodyText: "",
  childNodeIds: [
    "A7.2.1.",
    "A7.2.2.",
    "A7.2.3.",
    "A7.2.4.",
    "A7.2.5.",
    "A7.2.6.",
    "A7.2.7.",
    "A7.2.8.",
  ],
};

export const A7_2_1: DocumentNode = {
  id: "A7.2.1.",
  parentId: "A7.2.",
  title: "",
  bodyText: `Package in combination packagings with outer drums, boxes, jerricans, or barrels as follows:
    <table border="1" style="border-collapse: collapse; width: 90%; margin: 20px 0px 20px 0px">
    <thead>
      <tr style="height: 2rem">
        <th style="padding: 0.4rem;">Inner packaging</th>
        <th style="padding: 0.4rem;">Outer packaging</th>
      </tr>
    </thead>
    <tbody>
      <tr style="height: 2rem">
        <td style="padding: 0.4rem;">
          <strong>Receptacles:</strong> glass, earthenware, plastic, or metal<br><br>
          <strong>Note:</strong> For PG I material, pack inner packagings in a rigid and leakproof receptacle or intermediate packaging containing sufficient absorbent material to absorb the entire contents of all inner packagings before packing the inner packaging(s) in the outer package.<br><br>
          <strong>Note:</strong> Ensure inner packaging or receptacle closures of combination packages containing liquids are held securely, tightly and effectively in place by secondary means. See A20.3.
        </td>
        <td style="padding: 0.4rem;">
          <strong>Drums:</strong> removable head steel (1A2), removable head aluminum (1B2), removable head metal other than steel or aluminum (1N2), plywood (1D), fiber (1G), or removable head plastic (1H2)<br>
          <strong><i>or</i></strong><br>
          <strong>Boxes:</strong> steel (4A), aluminum (4B), ordinary natural wood (4C1), sift-proof natural wood (4C2), plywood (4D), reconstituted wood (4F), fiberboard (4G), expanded plastic (4H1), or solid plastic (4H2)<br>
          <strong><i>or</i></strong><br>
          <strong>Jerricans:</strong> removable head steel (3A2), plastic removable head (3H2), or aluminum removable head (3B2)<br>
          <strong><i>or</i></strong><br>
          <strong>Barrel:</strong> wooden (2C2)<br>
          <strong>Note:</strong> Wood barrels not authorized for PG I material.
        </td>
      </tr>
    </tbody>
  </table>`,
};

export const A7_2_2: DocumentNode = {
  id: "A7.2.2.",
  parentId: "A7.2.",
  title: "",
  bodyText: `Package in single packaging drums, jerricans, or barrels as follows:
    <table border="1" style="border-collapse: collapse; width: 90%; margin: 20px 0px 20px 0px">
    <thead>
      <tr style="height: 2rem">
        <th style="padding: 0.4rem;">Inner packaging</th>
        <th style="padding: 0.4rem;">Outer packaging</th>
      </tr>
    </thead>
    <tbody>
      <tr style="height: 2rem">
        <td style="padding: 0.4rem;">
          Not required
        </td>
        <td style="padding: 0.4rem;">
          <strong>Drums:</strong> steel (1A1), removable head steel (1A2), aluminum (1B1), removable head aluminum (1B2), metal drum other than steel or aluminum (1N1), removable head metal other than steel or aluminum (1N2), fiber (1G) with liner, or plastic (1H1 or 1H2)<br>
          <strong>Note:</strong> Fiber drum with liner only authorized for PG II or PG III material.<br>
          <strong><i>or</i></strong><br>
          <strong>Jerricans:</strong> steel (3A1 or 3A2), aluminum (3B1 or 3B2), or plastic (3H1 or 3H2)<br>
          <strong><i>or</i></strong><br>
          <strong>Barrel:</strong> wooden (2C1)<br>
          <strong>Note:</strong> Wooden barrels not authorized for PG I material.
        </td>
      </tr>
    </tbody>
  </table>
    `,
};

export const A7_2_3: DocumentNode = {
  id: "A7.2.3.",
  parentId: "A7.2.",
  title: "",
  bodyText: `Package in composite packagings with plastic inner receptacles as follows:
      <table border="1" style="border-collapse: collapse; width: 90%; margin: 20px 0px 20px 0px">
    <thead>
      <tr style="height: 2rem">
        <th style="padding: 0.4rem;">Inner receptacle</th>
        <th style="padding: 0.4rem;">Outer packaging</th>
      </tr>
    </thead>
    <tbody>
      <tr style="height: 2rem">
        <td style="padding: 0.4rem;">
          Plastic
        </td>
        <td style="padding: 0.4rem;">
          <strong>Boxes:</strong> steel, aluminum, wooden, plywood or fiberboard (6HA2, 6HB2, 6HC, 6HD2 or 6HG2)<br>
          <strong><i>or</i></strong><br>
          <strong>Drum:</strong> steel, aluminum, fiber, plastic or plywood (6HA1, 6HB1, 6HG1, 6HH1, or 6HD1)<br>
          <strong>Note:</strong> Plywood drum (6HD1) only authorized for PG II or PG III.
        </td>
      </tr>
    </tbody>
  </table>
    `,
};

export const A7_2_4: DocumentNode = {
  id: "A7.2.4.",
  parentId: "A7.2.",
  title: "",
  bodyText: `Package in composite packagings with glass, porcelain, or stoneware inner receptacles as follows:
    <table border="1" style="border-collapse: collapse; width: 90%; margin: 20px 0px 20px 0px">
    <thead>
      <tr style="height: 2rem">
        <th style="padding: 0.4rem;">Inner receptacles</th>
        <th style="padding: 0.4rem;">Outer packaging</th>
      </tr>
    </thead>
    <tbody>
      <tr style="height: 2rem">
        <td style="padding: 0.4rem;">
          <strong>Receptacle:</strong> glass, porcelain or stoneware
        </td>
        <td style="padding: 0.4rem;">
          <strong>Drum:</strong> steel, aluminum, fiber, plywood drum (6PA1, 6PB1, 6PG1 or 6PD1) or wickerwork hamper (6PD2)<br>
          <strong>Note:</strong> Plywood drum (6PD1) and wickerwork hamper (6PD2) only authorized for PG II or PG III.<br>
          <strong><i>or</i></strong><br>
          <strong>Box:</strong> steel (6PA2), aluminum (6PB2), wooden (6PC), fiberboard (6PG2), solid plastic (6PH1), or expanded plastic packaging (6PH2)
        </td>
      </tr>
    </tbody>
  </table>
    `,
};

export const A7_2_5: DocumentNode = {
  id: "A7.2.5.",
  parentId: "A7.2.",
  title: "DOT Cylinders.",
  bodyText:
    "DOT specification cylinders as prescribed for any compressed gas, except acetylene (DOT 8, DOT 8AL) and DOT 3HT.",
};

export const A7_2_6: DocumentNode = {
  id: "A7.2.6.",
  parentId: "A7.2.",
  title: "DOT 5L Jerrican.",
  bodyText: "Drain DOT 5L jerry cans to the maximum extent possible.",
};

export const A7_2_7: DocumentNode = {
  id: "A7.2.7.",
  parentId: "A7.2.",
  title: "MIL-D-23119 Drum.",
  bodyText:
    "MIL-D-23119 500-gallon capacity collapsible fabric drums authorized under mobility operations conducted according to DTR 4500.9-R, Part III. Drain five hundred (500) gallon fabric drums shipped on other than mobility missions to the greatest extent possible.",
};

export const A7_2_8: DocumentNode = {
  id: "A7.2.8.",
  parentId: "A7.2.",
  title: "Bulk Fuel.",
  bodyText:
    "Except as authorized in this manual, servicing trucks, trailers, semitrailers, or storage tanks containing bulk fuel, or any bulk hazardous material may not be transported by air. The following draining/purging requirements apply, as appropriate:",
  childNodeIds: ["A7.2.8.1.", "A7.2.8.2.", "A7.2.8.3."],
};

export const A7_2_8_1: DocumentNode = {
  id: "A7.2.8.1.",
  parentId: "A7.2.8.",
  title: "",
  bodyText:
    "Purge bulk tanks for all liquids with a flash point below 38 degrees C (100 degrees F), regardless of whether the technical manual only requires draining. If other hazardous materials are present, certify to the appropriate packaging paragraph. If no other hazards are present, comply with paragraph A3.1.16.4. to identify purged tanks.",
};

export const A7_2_8_2: DocumentNode = {
  id: "A7.2.8.2.",
  parentId: "A7.2.8.",
  title: "",
  bodyText:
    "Drain, but need not purge, liquids with a flash point at or above 38 degrees C (100 degrees F), unless the technical manual specifically requires purging. If other hazardous materials are present, certify to the appropriate packaging paragraph.",
};

export const A7_2_8_3: DocumentNode = {
  id: "A7.2.8.3.",
  parentId: "A7.2.8.",
  title: "",
  bodyText:
    "Transport bulk combustible liquids flash points above 60 degrees C (140 degrees F) in UN specification packaging (e.g., IBCs) meeting air eligibility requirements of paragraph A3.1.7.2. for PG III.",
};

export const A7_3: DocumentNode = {
  id: "A7.3.",
  parentId: "A7.",
  title: "",
  bodyText:
    "Package Refrigerating Machines as follows: A refrigerating machine assembled for shipment and containing 7 kg (15 pounds) or less of flammable liquid for operation in a strong, tight receptacle is excepted from specification packaging, marking, and labeling except for the PSN of the flammable liquid.",
};

export const A7_4: DocumentNode = {
  id: "A7.4.",
  parentId: "A7.",
  title: "",
  bodyText: "Package Aircraft Hydraulic Power Unit Fuel Tank as follows:",
  childNodeIds: ["A7.4.1.", "A7.4.2."],
};

export const A7_4_1: DocumentNode = {
  id: "A7.4.1.",
  parentId: "A7.4.",
  title: "Handling Instructions.",
  bodyText:
    "In the event of a leak during transportation of hydrazine, crew members use their aircraft oxygen masks in a positive pressure mode.",
};

export const A7_4_2: DocumentNode = {
  id: "A7.4.2.",
  parentId: "A7.4.",
  title: "Packaging Requirements.",
  bodyText:
    "Aircraft hydraulic power unit fuel tanks containing a mixture of anhydrous hydrazine and monomethyl hydrazine (M86 fuel) and designed for installation as complete units in aircraft are excepted from specification packaging requirements if the units comply with one of the following:",
  childNodeIds: ["A7.4.2.1.", "A7.4.2.2."],
};

export const A7_4_2_1: DocumentNode = {
  id: "A7.4.2.1.",
  parentId: "A7.4.2.",
  title: "",
  bodyText:
    "Units consisting of an aluminum pressure vessel made from tubing and having welded heads. Primary containment of the fuel within this vessel consists of a welded aluminum bladder having a maximum internal volume of 46 L (12 gallons). The outer vessel has a minimum design gauge pressure of 1,275 kPa (185 psig) and a minimum burst gauge pressure of 2,755 kPa (400 psig). Leak-check each vessel during manufacture and before shipment and ensure the vessel is found leak proof. Securely pack the complete inner unit in noncombustible cushioning material, and in a strong outer tightly closed metal packaging that adequately protects all fittings. The maximum quantity of fuel per unit and package is 42 L (11 gallons).",
};

export const A7_4_2_2: DocumentNode = {
  id: "A7.4.2.2.",
  parentId: "A7.4.2.",
  title: "",
  bodyText:
    "Units consisting of an aluminum pressure vessel. Primary containment of the fuel within this vessel consisting of a welded hermetically sealed fuel compartment with an elastomeric bladder having a maximum internal volume of 46 L (12 gallons). The pressure vessel requires a minimum design gauge pressure of 2,860 kPa (415 psig) and a minimum burst gauge pressure of 5,170 kPa (750 psig). Leak-check each vessel during manufacture and before shipment and ensure the vessel is found leak proof. Securely pack the complete inner unit in noncombustible cushioning material, and in a strong outer tightly closed metal packaging that adequately protects all fittings. The maximum quantity of fuel per unit and package is 42 L (11 gallons).",
};

export const A7_5: DocumentNode = {
  id: "A7.5.",
  parentId: "A7.",
  title: "",
  bodyText:
    "Packaging for Class 3 Materials, Poisonous by Inhalation (Hazard Zone A or B). Package Class 3 materials with an Inhalation Hazard (Hazard Zone A and B) as follows:",
  childNodeIds: ["A7.5.1.", "A7.5.2.", "A7.5.3.", "A7.5.4."],
};

export const A7_5_1: DocumentNode = {
  id: "A7.5.1.",
  parentId: "A7.5.",
  title: "Handling Instructions.",
  bodyText:
    "These items are extremely dangerous. Make approved chemical safety mask and clothing available when handling this material, and wear when handling leaking packages.",
};

export const A7_5_2: DocumentNode = {
  id: "A7.5.2.",
  parentId: "A7.5.",
  title: "DOT Cylinders.",
  bodyText:
    "Package in DOT specification cylinders as identified in 49 CFR Part 178 Subpart C, except that specification 8, 8AL, and 39 cylinders are not authorized. Cylinders must also meet the requirements of A3.3.2. (T-0).",
};

export const A7_5_3: DocumentNode = {
  id: "A7.5.3.",
  parentId: "A7.5.",
  title: "",
  bodyText:
    "Pack in an inner drum (1A1, 1B1, 1H1, 1N1, or 6HA1), then place in an outer drum (1A2 or 1H2). Both the inner and outer drum must be tested to the PG I performance level. (T-0). Ensure the outer 1A2 drum has a minimum thickness of 1.35 mm (0.053 inches). Ensure the outer 1H2 drum has a minimum thickness of 6.30 mm (0.248 inches). The capacity of the inner drum (1A1, 1B1, or 1N1) may not exceed 220 L (58 gallons). Cushion the inner drum within the outer drum with a shock-mitigating, non-reactive material. Ensure there is a minimum of 5.0 cm (2 inches) of cushioning material between the outer surface (side) of the inner drum and the inner surface (side) of the outer drum. There must also be at least 7.6 cm (3 inches) of cushioning material between the outer surface (top and bottom) of the inner drum and the inner surface (top and bottom) of the outer drum. (T-0). The inner drum must also meet all of the following requirements:",
  childNodeIds: [
    "A7.5.3.1.",
    "A7.5.3.2.",
    "A7.5.3.3.",
    "A7.5.3.4.",
    "A7.5.3.5.",
    "A7.5.3.6.",
  ],
};

export const A7_5_3_1: DocumentNode = {
  id: "A7.5.3.1.",
  parentId: "A7.5.3.",
  bodyText:
    "Satisfactorily withstand a hydrostatic pressure test (as outlined in 49 CFR Section 178.605) of 100 kPa (15 psig) for outer drums and 300 kPa (45psig) for inner drums.",
};

export const A7_5_3_2: DocumentNode = {
  id: "A7.5.3.2.",
  parentId: "A7.5.3.",
  bodyText:
    "Satisfactorily withstand a leak proof test (as outlined in 49 CFR Section 178.604) using an internal air pressure at 55 degrees C (131 degrees F) of at least twice the vapor pressure of the material to be packaged.",
};

export const A7_5_3_3: DocumentNode = {
  id: "A7.5.3.3.",
  parentId: "A7.5.3.",
  title: "Have screw-type closures that meet all the following requirements:",
  childNodeIds: ["A7.5.3.3.1.", "A7.5.3.3.2."],
};

export const A7_5_3_3_1: DocumentNode = {
  id: "A7.5.3.3.1.",
  parentId: "A7.5.3.3.",
  bodyText:
    "Closed and tightened to a torque as prescribed by the closure manufacturer, using a device that is capable of measuring torque.",
};

export const A7_5_3_3_2: DocumentNode = {
  id: "A7.5.3.3.2.",
  parentId: "A7.5.3.3.",
  bodyText:
    "Physically held in place by any means capable of preventing backoff or loosening of the closure by impact or vibration during transportation.",
};

export const A7_5_3_4: DocumentNode = {
  id: "A7.5.3.4.",
  parentId: "A7.5.3.",
  bodyText:
    "Provided with a cap seal that is properly applied according to the cap seal manufacturer's recommendations. The cap seal must be capable of withstanding an internal pressure of at least 100 kPa (15 psi).",
};

export const A7_5_3_5: DocumentNode = {
  id: "A7.5.3.5.",
  parentId: "A7.5.3.",
  title:
    "For Zone A materials, meet the following minimum inner drum thickness requirements:",
  childNodeIds: ["A7.5.3.5.1.", "A7.5.3.5.2.", "A7.5.3.5.3.", "A7.5.3.5.4."],
};

export const A7_5_3_5_1: DocumentNode = {
  id: "A7.5.3.5.1.",
  parentId: "A7.5.3.5.",
  bodyText: "1A1 and 1N1 drums- 1.3 mm (0.051 inch)",
};

export const A7_5_3_5_2: DocumentNode = {
  id: "A7.5.3.5.2.",
  parentId: "A7.5.3.5.",
  bodyText: "1B1 drums- 3.9 mm (0.154 inch)",
};

export const A7_5_3_5_3: DocumentNode = {
  id: "A7.5.3.5.3.",
  parentId: "A7.5.3.5.",
  bodyText: "1H1 drums- 3.16 mm (0.124 inch)",
};

export const A7_5_3_5_4: DocumentNode = {
  id: "A7.5.3.5.4.",
  parentId: "A7.5.3.5.",
  bodyText:
    "6HA1 drums- the plastic inner container must be 1.58 mm (0.0622 inch) and the outer steel drum must be 0.96 mm (0.0378 inch) (T-0).",
};

export const A7_5_3_6: DocumentNode = {
  id: "A7.5.3.6.",
  parentId: "A7.5.3.",
  title:
    "For Zone B materials, meet the following minimum inner drum thickness requirements:",
  childNodeIds: ["A7.5.3.6.1.", "A7.5.3.6.2.", "A7.5.3.6.3.", "A7.5.3.6.4."],
};

export const A7_5_3_6_1: DocumentNode = {
  id: "A7.5.3.6.1.",
  parentId: "A7.5.3.6.",
  bodyText: "1A1 and 1N1 drums- 0.69 mm (0.027 inch)",
};

export const A7_5_3_6_2: DocumentNode = {
  id: "A7.5.3.6.2.",
  parentId: "A7.5.3.6.",
  bodyText: "1B1 drums- 3.9 mm (0.154 inch)",
};

export const A7_5_3_6_3: DocumentNode = {
  id: "A7.5.3.6.3.",
  parentId: "A7.5.3.6.",
  bodyText: "1H1 drums- 1.14 mm (0.045 inch)",
};

export const A7_5_3_6_4: DocumentNode = {
  id: "A7.5.3.6.4.",
  parentId: "A7.5.3.6.",
  bodyText:
    "6HA1 drums- the plastic inner container must be 1.58 mm (0.0622 inch) and the outer steel drum must be 0.70 mm (0.027 inch) (T-0).",
};

export const A7_5_4: DocumentNode = {
  id: "A7.5.4.",
  parentId: "A7.5.",
  bodyText:
    "Pack in an inner packaging system that consists of an impact-resistant receptacle of glass, earthenware, plastic, or metal securely cushioned with a nonreactive absorbent material. Pack inner packaging system within a leak-tight packaging of metal or plastic, then pack in a steel drum (1A2), aluminum drum (1B2), metal drum (other than steel or aluminum (1N2)), plywood drum (1D), fiber drum (1G), plastic drum (1H2), steel box (4A), aluminum box (4B), natural wood box (4C1 or 4C2), plywood box (4D), reconstituted wood box (4F), fiberboard box (4G), expanded plastic box (4H1), solid plastic box (4H2), or metal box other than steel or aluminum (4N). The capacity of the inner receptacle may not exceed 4 L (1 gallon). An inner receptacle that has a closure must have a screw-type closure, which is held in place by any means capable of preventing backoff or loosening of the closure by impact or vibration during transportation. (T-0). Both the inner packaging system and the outer container must each meet the test requirements of the PG I performance level independently. (T-0). The total amount of liquid that can be packed in the outer container may not exceed 16 L (4 gallons).",
};

export const A7_6: DocumentNode = {
  id: "A7.6.",
  parentId: "A7.",
  title: "Package Polyester Resin Kits as follows:",
  bodyText:
    "Polyester resin and fiberglass repair kits consist of two components: a base material in Class 3, PG II or III, and an organic peroxide activator. Only organic peroxides of Type D, E, or F not requiring temperature controls are authorized. Assign PG II or III according to the criteria for Class 3, applied to the base material. Ensure each component is separately packed in an inner packaging. The components may be placed in the same outer packaging provided they will not react dangerously in the event of leakage. Secure closures on inner packagings containing liquids by secondary means. The total quantity of activator and base material may not exceed 5 kg (11 pounds) per package for a Packing Group II base material. The total quantity of activator and base material may not exceed 10 kg (22 pounds) per package for a Packing Group III base material. The total quantity of polyester resin kits per package is calculated on a one-to-one basis (e.g., 1 L equals 1 kg).",
  childNodeIds: ["A7.6.1.", "A7.6.2."],
};

export const A7_6_1: DocumentNode = {
  id: "A7.6.1.",
  parentId: "A7.6.",
  bodyText: `Package organic peroxides in drums, jerricans, or boxes as follows:
  <table border="1" style="border-collapse: collapse; width: 90%; margin: 20px 0px 20px 0px">
    <thead>
      <tr style="height: 2rem">
        <th style="padding: 0.4rem;">Inner packaging</th>
        <th style="padding: 0.4rem;">Outer packaging</th>
      </tr>
    </thead>
    <tbody>
      <tr style="height: 2rem">
        <td style="padding: 0.4rem;">
          <strong>Plastic tube packaging</strong><br>
          <strong><i>or</i></strong><br>
          <strong>Flexible tube packaging</strong><br><br>
          <strong>Note:</strong> Maximum quantity of organic peroxide per inner packaging is 125 ml (4.22 ounces) for liquids and 500 g (1 lb.) for solids.
        </td>
        <td style="padding: 0.4rem;">
          <strong>Drums:</strong> steel (1A2), aluminum (1B2), fiber (1G), plastic (1H2), or other metal (1N2)<br>
          <strong><i>or</i></strong><br>
          <strong>Jerricans:</strong> steel (3A2), aluminum (3B2), or plastic (3H2)<br>
          <strong><i>or</i></strong><br>
          <strong>Boxes:</strong> steel (4A), aluminum (4B), wooden (4C1 or 4C2), plywood (4D), reconstituted wood (4F), fiberboard (4G), plastic (4H1 or 4H2), or other metal (4N)
        </td>
      </tr>
    </tbody>
  </table>
  `,
};

export const A7_6_2: DocumentNode = {
  id: "A7.6.2.",
  parentId: "A7.6.",
  bodyText: `Package flammable liquids in drums, jerricans, or boxes as follows:
  <table border="1" style="border-collapse: collapse; width: 90%; margin: 20px 0px 20px 0px">
    <thead>
      <tr style="height: 2rem">
        <th style="padding: 0.4rem;">Inner packaging</th>
        <th style="padding: 0.4rem;">Outer packaging</th>
      </tr>
    </thead>
    <tbody>
      <tr style="height: 2rem">
        <td style="padding: 0.4rem;">
          <strong>Receptacle:</strong> glass or earthenware, plastic, metal or aluminum<br><br>
          <strong>Note:</strong> PG II base material limited to 5 L (1.3 gallons) in metal or plastic inner packagings and 1 L (0.3 gallons) in glass inner packagings. PG III base material limited to 10 L (2.6 gallons) in metal or plastic inner packagings and 2.5 L (0.66 gallons) in glass inner packagings.
        </td>
        <td style="padding: 0.4rem;">
          <strong>Drums:</strong> steel (1A2), aluminum (1B2), fiber (1G), plastic (1H2), or other metal (1N2)<br>
          <strong><i>or</i></strong><br>
          <strong>Jerricans:</strong> steel (3A2), aluminum (3B2), or plastic (3H2)<br>
          <strong><i>or</i></strong><br>
          <strong>Boxes:</strong> steel (4A), aluminum (4B), wooden (4C1 or 4C2), plywood (4D), reconstituted wood (4F), fiberboard (4G), plastic (4H1 or 4H2), or other metal (4N)
        </td>
      </tr>
    </tbody>
  </table>
  `,
};

export const A7_7: DocumentNode = {
  id: "A7.7.",
  parentId: "A7.",
  title: "Fuel Cell Cartridges.",
  bodyText: "",
  childNodeIds: ["A7.7.1."],
};

export const A7_7_1: DocumentNode = {
  id: "A7.7.1.",
  parentId: "A7.7.",
  bodyText: `Package fuel cell cartridges in drums, jerricans or boxes as follows:
  <table border="1" style="border-collapse: collapse; width: 90%; margin: 20px 0px 20px 0px">
    <thead>
      <tr style="height: 2rem">
        <th style="padding: 0.4rem;">Inner packaging</th>
        <th style="padding: 0.4rem;">Outer packaging</th>
      </tr>
    </thead>
    <tbody>
      <tr style="height: 2rem">
        <td style="padding: 0.4rem;">
          <strong>Receptacle:</strong> cartridge
        </td>
        <td style="padding: 0.4rem;">
          <strong>Drums:</strong> removable head steel (1A2), removable head aluminum (1B2), plywood (1D), fiber (1G), plastic (1H2) or removable head other metal (1N2)<br>
          <strong><i>or</i></strong><br>
          <strong>Jerricans:</strong> steel (3A2), aluminum (3B2), or plastic (3H2)<br>
          <strong><i>or</i></strong><br>
          <strong>Boxes:</strong> steel (4A), aluminum (4B), wood (4C1 or 4C2), plywood (4D), reconstituted wood (4F), fiberboard (4G), plastic (4H1 or 4H2), or other metal (4N)
        </td>
      </tr>
    </tbody>
  </table>
  `,
};

export const A7_8: DocumentNode = {
  id: "A7.8.",
  parentId: "A7.",
  title: "Fuel Cell Cartridges Contained in Equipment.",
  bodyText: "",
  childNodeIds: ["A7.8.1.", "A7.8.2."],
};

export const A7_8_1: DocumentNode = {
  id: "A7.8.1.",
  parentId: "A7.8.",
  bodyText: `UN specification packaging is not required. Protect fuel cells installed in equipment against short circuit, and protect the entire system against inadvertent operation. Fuel cell systems may not charge batteries during transport.`,
};

export const A7_8_2: DocumentNode = {
  id: "A7.8.2.",
  parentId: "A7.8.",
  bodyText: `Protect the terminals of the installed fuel cells to prevent short circuit by use of protective coverings, taping, etc.`,
};

export const A7_9: DocumentNode = {
  id: "A7.9.",
  parentId: "A7.",
  title: "Fuel Cell Packed With Equipment.",
  bodyText: "",
  childNodeIds: ["A7.9.1."],
};

export const A7_9_1: DocumentNode = {
  id: "A7.9.1.",
  parentId: "A7.9.",
  title: "UN specification packaging is not required.",
  bodyText: `Pack fuel cells packed with equipment in inner packagings or placed in the outer packaging with cushioning material or divider(s) in order to protect fuel cartridges from damage during transportation. The maximum number of fuel cell cartridges in the intermediate packaging may not be more than the number required to power the equipment plus two spares.`,
};

export const A7_10: DocumentNode = {
  id: "A7.10.",
  parentId: "A7.",
  title: "Package Chlorosilanes as follows:",
  bodyText: `Packaging meeting the PG I or PG II performance standards is required.`,
  childNodeIds: ["A7.10.1.", "A7.10.2.", "A7.10.3.", "A7.10.4."],
};

export const A7_10_1: DocumentNode = {
  id: "A7.10.1.",
  parentId: "A7.10.",
  title: "",
  bodyText: `Package in the following combination drums, or boxes:
  <table border="1" style="border-collapse: collapse; width: 90%; margin: 20px 0px 20px 0px">
    <thead>
      <tr style="height: 2rem">
        <th style="padding: 0.4rem;">Inner packaging</th>
        <th style="padding: 0.4rem;">Outer packaging</th>
      </tr>
    </thead>
    <tbody>
      <tr style="height: 2rem">
        <td style="padding: 0.4rem;">
          <strong>Receptacles:</strong> Glass, or steel
        </td>
        <td style="padding: 0.4rem;">
          <strong>Drums:</strong> steel (1A2), plywood (1D), fiber (1G), or plastic (1H2)<br>
          <strong><i>or</i></strong><br>
          <strong>Boxes:</strong> steel (4A), natural wood (4C1 or 4C2), plywood (4D), reconstituted wood (4F), fiberboard (4G), expanded plastic (4H1), or solid plastic (4H2)
        </td>
      </tr>
    </tbody>
  </table>
  `,
};

export const A7_10_2: DocumentNode = {
  id: "A7.10.2.",
  parentId: "A7.10.",
  bodyText: `Package in the following composite drums:
   <table border="1" style="border-collapse: collapse; width: 90%; margin: 20px 0px 20px 0px">
    <thead>
      <tr style="height: 2rem">
        <th style="padding: 0.4rem;">Inner receptacle</th>
        <th style="padding: 0.4rem;">Outer packaging</th>
      </tr>
    </thead>
    <tbody>
      <tr style="height: 2rem">
        <td style="padding: 0.4rem;">
          <strong>Plastic</strong>
        </td>
        <td style="padding: 0.4rem;">
          <strong>Drums:</strong> steel drum (6HA1)
        </td>
      </tr>
    </tbody>
  </table>
  `,
};

export const A7_10_3: DocumentNode = {
  id: "A7.10.3.",
  parentId: "A7.10.",
  bodyText: `Package in the following single drums, or jerricans:
  <table border="1" style="border-collapse: collapse; width: 90%; margin: 20px 0px 20px 0px">
    <thead>
      <tr style="height: 2rem">
        <th style="padding: 0.4rem;">Inner packaging</th>
        <th style="padding: 0.4rem;">Outer packaging</th>
      </tr>
    </thead>
    <tbody>
      <tr style="height: 2rem">
        <td style="padding: 0.4rem;">
          <strong>Not required</strong>
        </td>
        <td style="padding: 0.4rem;">
          <strong>Drums:</strong> steel (1A1)<br>
          <strong><i>or</i></strong><br>
          <strong>Jerricans:</strong> steel (3A1)
        </td>
      </tr>
    </tbody>
  </table>

  `,
};

export const A7_10_4: DocumentNode = {
  id: "A7.10.4.",
  parentId: "A7.10.",
  title: "Package in cylinders as prescribed for any compressed gas",
  bodyText: `except those for acetylene (DOT 8, 8AL), 3HT, and aluminum cylinders.`,
};

export const A7_11: DocumentNode = {
  id: "A7.11.",
  parentId: "A7.",
  title:
    "Package Flammable Liquid powered engines, machinery and SE as follows:",
  bodyText: "",
  childNodeIds: ["A7.11.1.", "A7.11.2.", "A7.11.3."],
};

export const A7_11_1: DocumentNode = {
  id: "A7.11.1.",
  parentId: "A7.11.",
  title: "Compliance With Technical Orders.",
  bodyText: `Use the euipment service or technical manual to prepare item for shipment.`,
};

export const A7_11_2: DocumentNode = {
  id: "A7.11.2.",
  parentId: "A7.11.",
  title: "Fuel Limitations.",
  bodyText: `Completely drain engine-powered SE of fuel. Up to 500 ml (17 ounces) of fuel may be left in engine components and fuel lines provided all lines and fuel tanks are securely closed to prevent leakage of fuel. Check the serviceability, proper installation and security of the vent caps on diesel generators with vertical, mast-type fuel vents. Drain and purge when required by the applicable technical manual.`,
  childNodeIds: [
    "A7.11.2.1.",
    "A7.11.2.2.",
    "A7.11.2.3.",
    "A7.11.2.4.",
    "A7.11.2.5.",
    "A7.11.2.6.",
    "A7.11.2.7.",
    "A7.11.2.8.",
    "A7.11.2.9.",
    "A7.11.2.10.",
    "A7.11.2.11.",
    "A7.11.2.12.",
  ],
};

export const A7_11_2_1: DocumentNode = {
  id: "A7.11.2.1.",
  parentId: "A7.11.2.",
  title:
    "Drain engine-powered SE with large fuel systems that the shipper determines cannot be drained to 500 ml (17 ounces) within the mechanical limits of the equipment",
  bodyText: `to the extent no free standing liquid remains in the fuel tank, lines, or system.`,
};

export const A7_11_2_2: DocumentNode = {
  id: "A7.11.2.2.",
  parentId: "A7.11.2.",
  title:
    "When transported under the authority of Chapter 3 of this manual, wheeledengine powered SE may contain up to one-half tank of fuel.",
  bodyText: `Ship only the minimum quantity of fuel consistent with operational requirements. Ship the Hobart-86 all models with no more than one-quarter tank of fuel and load with filler neck facing forward. Ensure tanks are securely closed. Drain non-wheeled engine powered SE so that no more than 500 ml (17 ounces) of residual fuel is remaining.`,
};

export const A7_11_2_3: DocumentNode = {
  id: "A7.11.2.3.",
  parentId: "A7.11.2.",
  title:
    "Completely drain single axle equipment loaded with the tongue resting on the aircraft floor.",
  bodyText: ``,
};

export const A7_11_2_4: DocumentNode = {
  id: "A7.11.2.4.",
  parentId: "A7.11.2.",
  title:
    "Drain engines that are damaged or inoperable and purging cannot be accomplished, or proper purging facilities are unavailable to the maximum extent possible",
  bodyText: `and install plugs, caps, and covers over all openings as required by technical directives.`,
};

export const A7_11_2_5: DocumentNode = {
  id: "A7.11.2.5.",
  parentId: "A7.11.2.",
  title:
    "Engines which are drained and purged according to the responsible technical manual, and containing no other hazardous material, are nonhazardous for transportation.",
  bodyText: `Comply with paragraph A3.1.16.4.`,
};

export const A7_11_2_6: DocumentNode = {
  id: "A7.11.2.6.",
  parentId: "A7.11.2.",
  title:
    "Where an engine or machine could possibly be handled in other than an upright position, secure the engines or machinery in a strong, rigid outer packaging in an orientation to prevent accidental leakage and prevent any movement during transport which would change in orientation or cause them to be damaged.",
  bodyText: ``,
};

export const A7_11_2_7: DocumentNode = {
  id: "A7.11.2.7.",
  parentId: "A7.11.2.",
  title:
    "Ship the Aerial Bulk Fuel Delivery System (ABFDS) consisting of 3000 gallon bladders under the following conditions:",
  bodyText: undefined,
  childNodeIds: [
    "A7.11.2.7.1.",
    "A7.11.2.7.2.",
    "A7.11.2.7.3.",
    "A7.11.2.7.4.",
  ],
};

export const A7_11_2_7_1: DocumentNode = {
  id: "A7.11.2.7.1.",
  parentId: "A7.11.2.7.",
  title: "Completely drain the bulk fuel bladders.",
  bodyText:
    "Due to bladder construction there will be residual fuel remaining. Ensure bladders are drained as much as possible.",
};

export const A7_11_2_7_2: DocumentNode = {
  id: "A7.11.2.7.2.",
  parentId: "A7.11.2.7.",
  title: "Completely drain the pump module.",
  bodyText:
    "No more than 500 ml (17 ounces) of fuel may be left in engine components.",
};

export const A7_11_2_7_3: DocumentNode = {
  id: "A7.11.2.7.3.",
  parentId: "A7.11.2.7.",
  title: "Securely close all vents and valves to prevent residual fuel leaks.",
};

export const A7_11_2_7_4: DocumentNode = {
  id: "A7.11.2.7.4.",
  parentId: "A7.11.2.7.",
  bodyText: `When prepared in this manner, ABFDS may be stacked for shipment.
    Note: When shipping AFBDS components separately such as the 3,000 gallon air transportable fuel bladders as stipulated in paragraph A7.11.2.7.1., refer to bulk fuel shipping container procedures identified in A7.2.9.2. For the AFBDS engine and pumping module without the 3,000 gallon fuel bladder, refer to paragraph A3.3.3.4. for shipment instructions.`,
};

export const A7_11_2_8: DocumentNode = {
  id: "A7.11.2.8.",
  parentId: "A7.11.2.",
  title: "When loaded in a freight container, drain fuel tanks.",
  bodyText:
    "Purge the fuel tank and system if required by the item’s technical directive, or if the flash point of the fuel is less than 38 degrees C (100 degrees F). In the absence of specific draining and purging procedures:",
  childNodeIds: [
    "A7.11.2.8.1.",
    "A7.11.2.8.2.",
    "A7.11.2.8.3.",
    "A7.11.2.8.4.",
  ],
};

export const A7_11_2_8_1: DocumentNode = {
  id: "A7.11.2.8.1.",
  parentId: "A7.11.2.8.",
  title: "Completely drain all fuel.",
};

export const A7_11_2_8_2: DocumentNode = {
  id: "A7.11.2.8.2.",
  parentId: "A7.11.2.8.",
  title: "Run engine until it stalls.",
};

export const A7_11_2_8_3: DocumentNode = {
  id: "A7.11.2.8.3.",
  parentId: "A7.11.2.8.",
  title: "Allow fuel tanks and lines to remain open for 24 hours.",
};

export const A7_11_2_8_4: DocumentNode = {
  id: "A7.11.2.8.4.",
  parentId: "A7.11.2.8.",
  title: "Installed batteries must be non-spillable or non-regulated.",
  bodyText: "(T-0).",
};

export const A7_11_2_9: DocumentNode = {
  id: "A7.11.2.9.",
  parentId: "A7.11.2.",
  title:
    "When unit is susceptible to fuel spills or leakage (see paragraph A3.3.3.6.), unit must be drained and capped.",
  bodyText: "(T-0).",
};

export const A7_11_2_10: DocumentNode = {
  id: "A7.11.2.10.",
  parentId: "A7.11.2.",
  title: "Fuel cell powered engines or equipment.",
  bodyText:
    "Secure and protect the fuel cell in a manner to prevent damage to the fuel cell. Describe equipment (other than vehicles, engines or mechanical equipment) such as consumer electronic devices containing fuel cells (fuel cell cartridges) as ‘‘Fuel cell cartridges contained in equipment.’’",
};

export const A7_11_2_11: DocumentNode = {
  id: "A7.11.2.11.",
  parentId: "A7.11.2.",
  title:
    "Engines and generators designed as part of, and integrally mounted to, or contained on a vehicle, trailer, or within a container or transporter that are required to operate during aircraft onload and offload to articulate, self-cool, or otherwise operate equipment necessary on/off loading, may be fueled no more than one-half full.",
  bodyText:
    "Comply with paragraph A3.3.3.4 when determining actual fuel level requirements to meet operational needs.",
};

export const A7_11_2_12: DocumentNode = {
  id: "A7.11.2.12.",
  parentId: "A7.11.2.",
  title: "Lithium batteries.",
  bodyText:
    "Securely fasten lithium batteries contained in vehicles, engines, or mechanical equipment in the battery holder of the vehicle, engine, or mechanical equipment, and protect in such a manner as to prevent damage and short circuits (e.g., by the use of non-conductive caps that cover the terminals entirely). Ensure lithium battery are of a type that has successfully passed each test in the UN Manual of Tests and Criteria. Prototype or low production lithium batteries may be approved by the Associate Administrator of the DOT.",
};

export const A7_11_3: DocumentNode = {
  id: "A7.11.3.",
  parentId: "A7.11.",
  title: "Accessorial hazards.",
  bodyText:
    "Installed components, equipment, and accessorial hazards (e.g., fire extinguishers, jerricans, etc.) are authorized in properly configured and approved holders designed for use with the unit. The following applies:",
  childNodeIds: ["A7.11.3.1.", "A7.11.3.2."],
};

export const A7_11_3_1: DocumentNode = {
  id: "A7.11.3.1.",
  parentId: "A7.11.3.",
  title:
    "Secure batteries upright in designed holders except non-spillable batteries meeting Table A4.2., Special Provision A67 as nonhazardous, which may be oriented in a manner to fit designed holder.",
  bodyText:
    "Protect the terminals of installed batteries to prevent short circuit by use of battery boxes, protective covers, taping, etc. If battery cables are disconnected, secure away from terminals, and protect the terminals.",
};

export const A7_11_3_2: DocumentNode = {
  id: "A7.11.3.2.",
  parentId: "A7.11.3.",
  title:
    "When loaded in a freight container, remove acid or alkali batteries and package according to A12.4.",
  bodyText:
    "Do not ship packaged wet-cell batteries inside a freight container unless accessible during flight. Non-spillable and non-hazardous gel-type batteries may remain in the equipment holder provided they remain upright and the cables are disconnected. Tape the ends of the cables/terminals to prevent short circuit.",
};

export const A7_12: DocumentNode = {
  id: "A7.12.",
  parentId: "A7.",
  title: undefined,
  bodyText:
    "UN3540, Articles containing flammable liquid, N.O.S. are authorized when classified per paragraph A4.2.3., maximum net quantity per package 60 L, when packaged or unpackaged as follows:",
  childNodeIds: ["A7.12.1.", "A7.12.2."],
};

export const A7_12_1: DocumentNode = {
  id: "A7.12.1.",
  parentId: "A7.12.",
  title:
    "When packaged, packagings meeting Packing Group II performance are required.",
  bodyText: undefined,
  childNodeIds: ["A7.12.1.1.", "A7.12.1.2."],
};

export const A7_12_1_1: DocumentNode = {
  id: "A7.12.1.1.",
  parentId: "A7.12.1.",
  title:
    "Pack articles to prevent movement and inadvertent operation during normal conditions of transport.",
};

export const A7_12_1_2: DocumentNode = {
  id: "A7.12.1.2.",
  parentId: "A7.12.1.",
  bodyText: `Pack inner receptacles within their outer packaging with closures correctly oriented.
    <table border="1" style="border-collapse: collapse; width: 90%; margin: 20px 0px 20px 0px">
    <thead>
      <tr style="height: 2rem">
        <th style="padding: 0.4rem;">Inner packaging</th>
        <th style="padding: 0.4rem;">Outer packaging</th>
      </tr>
    </thead>
    <tbody>
      <tr style="height: 2rem">
        <td style="padding: 0.4rem;">
          <strong>Receptacles:</strong> constructed of suitable materials and secured in the article in such a way that, under normal conditions of transport, they cannot break, be punctured, or leak their contents into the article itself or the outer packaging.<br><br>
          Where there is no receptacle within the article, the article must fully enclose the dangerous goods and prevent their release under normal conditions of transport. <strong>(T-0)</strong>
        </td>
        <td style="padding: 0.4rem;">
          <strong>Drums:</strong> removable head steel (1A2), removable head aluminum (1B2), removable head metal other than steel or aluminum (1N2), plywood (1D), fiber (1G), or removable head plastic (1H2)<br>
          <strong><i>or</i></strong><br>
          <strong>Boxes:</strong> steel (4A), aluminum (4B), ordinary natural wood (4C1), sift-proof natural wood (4C2), plywood (4D), reconstituted wood (4F), fiberboard (4G), expanded plastic (4H1), or solid plastic (4H2), other metal (4N)<br>
          <strong><i>or</i></strong><br>
          <strong>Jerricans:</strong> removable head steel (3A2), plastic removable head (3H2), or aluminum removable head (3B2)
        </td>
      </tr>
    </tbody>
  </table>
    `,
};

export const A7_12_2: DocumentNode = {
  id: "A7.12.2.",
  parentId: "A7.12.",
  title: "Robust articles.",
  bodyText: undefined,
  childNodeIds: ["A7.12.2.1.", "A7.12.2.2."],
};

export const A7_12_2_1: DocumentNode = {
  id: "A7.12.2.1.",
  parentId: "A7.12.2.",
  title:
    "Robust articles may be transported in strong outer packagings constructed of suitable material and of adequate strength and design in relation to the packaging capacity and its intended use;",
};

export const A7_12_2_2: DocumentNode = {
  id: "A7.12.2.2.",
  parentId: "A7.12.2.",
  title:
    "Robust articles may be transported unpackaged or on pallets when the dangerous goods are afforded equivalent protection by the article in which they are contained.",
};

export const attachment7DocumentNodesList: DocumentNode[] = [
  Attachment7,
  A7_1,
  A7_2,
  A7_2_1,
  A7_2_2,
  A7_2_3,
  A7_2_4,
  A7_2_5,
  A7_2_6,
  A7_2_7,
  A7_2_8,
  A7_2_8_1,
  A7_2_8_2,
  A7_2_8_3,
  A7_3,
  A7_4,
  A7_4_1,
  A7_4_2,
  A7_4_2_1,
  A7_4_2_2,
  A7_5,
  A7_5_1,
  A7_5_2,
  A7_5_3,
  A7_5_3_1,
  A7_5_3_2,
  A7_5_3_3,
  A7_5_3_3_1,
  A7_5_3_3_2,
  A7_5_3_4,
  A7_5_3_5,
  A7_5_3_5_1,
  A7_5_3_5_2,
  A7_5_3_5_3,
  A7_5_3_5_4,
  A7_5_3_6,
  A7_5_3_6_1,
  A7_5_3_6_2,
  A7_5_3_6_3,
  A7_5_3_6_4,
  A7_5_4,
  A7_6,
  A7_6_1,
  A7_6_2,
  A7_7,
  A7_7_1,
  A7_8,
  A7_8_1,
  A7_8_2,
  A7_9,
  A7_9_1,
  A7_10,
  A7_10_1,
  A7_10_2,
  A7_10_3,
  A7_10_4,
  A7_11,
  A7_11_1,
  A7_11_2,
  A7_11_2_1,
  A7_11_2_2,
  A7_11_2_3,
  A7_11_2_4,
  A7_11_2_5,
  A7_11_2_6,
  A7_11_2_7,
  A7_11_2_7_1,
  A7_11_2_7_2,
  A7_11_2_7_3,
  A7_11_2_7_4,
  A7_11_2_8,
  A7_11_2_8_1,
  A7_11_2_8_2,
  A7_11_2_8_3,
  A7_11_2_8_4,
  A7_11_2_9,
  A7_11_2_10,
  A7_11_2_11,
  A7_11_2_12,
  A7_11_3,
  A7_11_3_1,
  A7_11_3_2,
  A7_12,
  A7_12_1,
  A7_12_1_1,
  A7_12_1_2,
  A7_12_2,
  A7_12_2_1,
  A7_12_2_2,
];
