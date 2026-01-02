import { DocumentNode } from "../../types";

export const A3_1_2: DocumentNode = {
  id: "A3.1.2.",
  parentId: "A3.1.",
  title: "Transportability.",
  bodyText: `Securely close and construct containers to prevent leakage due to
changes in temperature, humidity, altitude, and damage during transportation and in-transit
handling. Hazardous materials must be packaged/prepared according to one of the following:
DoD Performance Oriented Packaging Program, DOD SPI or an approved service drawing,
technical publication (e.g., technical order/manual), manufacturer’s supplied closing
instructions, UN specification test report, or technical knowledge/training to construct strong
outer packaging when required by this manual. <strong>(T-0).</strong>`,
  childNodeIds: ["A3.1.2.1.", "A3.1.2.2.", "A3.1.2.3."],
};

export const A3_1_2_1: DocumentNode = {
  id: "A3.1.2.1.",
  parentId: "A3.1.2.",
  bodyText: `Primary and secondary items and their containers (unit or exterior) must provide
    protection without deformation, leakage, or rupture against:`,
  childNodeIds: ["A3.1.2.1.1.", "A3.1.2.1.2.", "A3.1.2.1.3."],
};

export const A3_1_2_1_1: DocumentNode = {
  id: "A3.1.2.1.1.",
  parentId: "A3.1.2.1.",
  bodyText: `Temperature changes (-40 to 65.5 degrees C [-40 to +150 degrees F]).`,
};

export const A3_1_2_1_2: DocumentNode = {
  id: "A3.1.2.1.2.",
  parentId: "A3.1.2.1.",
  bodyText: `Pressure changes due to altitude changes (sea level to 3.7km (12,000 feet)).`,
};

export const A3_1_2_1_3: DocumentNode = {
  id: "A3.1.2.1.3.",
  parentId: "A3.1.2.1.",
  bodyText: `Pressure changes due to explosive decompression from 3.7 to 15.24 km
(12,000 to 50,000 feet). <strong>(T-0).</strong>`,
};

export const A3_1_2_2: DocumentNode = {
  id: "A3.1.2.2.",
  parentId: "A3.1.2.",
  bodyText: `Do not fill a UN specification packaging to a gross mass greater than the
    authorized gross mass marked on the packaging.`,
};

export const A3_1_2_3: DocumentNode = {
  id: "A3.1.2.3.",
  parentId: "A3.1.2.",
  bodyText: `Provide adequate protection for material susceptible to damage by temperature
    extremes during both ground and air operations.`,
};

export const A3_1_3: DocumentNode = {
  id: "A3.1.3.",
  parentId: "A3.1.",
  title: "Compatibility.",
  bodyText: `All containers must be designed and constructed of materials that do
    not react with, or are not decomposed by, the material contained therein. <strong>(T-0).</strong> Plastic
    containers or liners must prevent permeation of contents. <strong>(T-0).</strong> Plastic packaging or
    receptacles used for liquid hazardous materials must be capable of withstanding, without
    failure, the test specified in 49 CFR Part 173, Appendix B, Procedure for Testing Chemical
    Compatibility and Rate of Permeation in Plastic Packagings and Receptacles. <strong>(T-0).</strong>`,
};

export const A3_1_4: DocumentNode = {
  id: "A3.1.4.",
  parentId: "A3.1.",
  title: "Leak Containment (Liner) General Requirements.",
  bodyText: `Leak containment must be provided
    for hazardous liquids when required outer packaging is not liquid-tight. <strong>(T-0).</strong> This does not
    apply to overpacks used only for air shipment consolidation. Use a leak-proof liner, plastic
    bag, or other equally efficient means of containment specified in packaging or closure
    instructions according to A3.1.2. Items drained and purged that are susceptible to leaking
    purging fluid (e.g., small fuel components) will also be contained in a liner to prevent
    leaking. <strong>(T-0).</strong>`,
};

export const A3_1_5: DocumentNode = {
  id: "A3.1.5.",
  parentId: "A3.1.",
  title: "Ullage (Outage).",
  bodyText: `Do not entirely fill containers designed to hold liquids. When filling
    packagings with liquid hazardous material, leave sufficient interior space (outage) to prevent
    leakage of contents or distortion of containers due to change of temperature during
    transportation, storage, and handling. For flammable liquids and other volatile liquids with
    a high coefficient of expansion, a minimum outage of 2 percent at 54 degrees C (130 degrees
    F), is required.`,
};

export const A3_1_6: DocumentNode = {
  id: "A3.1.6.",
  parentId: "A3.1.",
  title: "Closures.",
  bodyText: `Packages and containers must be closed as specified in a test report,
    packaging instruction, drawing, or manufacturers closure instructions except as identified in
    A28.2.2. <strong>(T-0).</strong> When used, stoppers, corks, or other such friction-type devices must be held
    in place securely, tightly, and effectively. <strong>(T-0).</strong> Each screw-type closure on any
    packaging/container (other than UN specification jerricans) containing a hazardous liquid
    must be secured with pressure-sensitive tape, self-shrinking plastic, wire, a device designed
    to prevent the cap from loosening (integral locking cap), or other positive means to prevent
    the closure from loosening due to vibration or substantial temperature change. <strong>(T-0).</strong>`,
};

export const A3_1_7: DocumentNode = {
  id: "A3.1.7.",
  parentId: "A3.1.",
  title: "Air-Eligible Packaging Requirements.",
  childNodeIds: ["A3.1.7.1.", "A3.1.7.2.", "A3.1.7.3."],
};

export const A3_1_7_1: DocumentNode = {
  id: "A3.1.7.1.",
  parentId: "A3.1.7.",
  title: "Combination Packaging Pressure Standard.",
  bodyText: `Inner packagings (including closures)
    used to retain a hazardous liquid or semi-solid in a combination packaging must be 
    AFMAN24-604 9 October 2020 55 capable of withstanding (without leaking) an internal air gauge 
    pressure of not less than 95 kPa (14 psi); or 75 kPa (11 psi) for Packing Group III liquids in Class 3 or Class 6.1;
    or a pressure related to the vapor pressure of the liquid contained in the receptacle,
    whichever is greater. <strong>(T-0).</strong> Repack or pack liquid hazardous materials in containers that
    do not meet the internal hydraulic pressure standard, into supplementary UN certified
    specification containers that meet this requirement. Determine the pressure related to the
    vapor pressure of the liquid by one of the following methods:`,
  childNodeIds: ["A3.1.7.1.1.", "A3.1.7.1.2.", "A3.1.7.1.3."],
};

export const A3_1_7_1_1: DocumentNode = {
  id: "A3.1.7.1.1.",
  parentId: "A3.1.7.1.",
  bodyText: `The total gauge pressure measured in the receptacle (that is, the vapor
    pressure of the liquid and the partial pressure of the air, or other inert gases, less 100
    kPa (15 psi) at 55 degrees C (131 degrees F), multiplied by a safety factor of 1.5. The
    total gauge pressure is determined on the basis of a filling temperature of 15 degrees C
    (59 degrees F) and a degree of filling such that the receptacle is not liquid full at a
    temperature of 55 degrees C (131 degrees F).`,
};

export const A3_1_7_1_2: DocumentNode = {
  id: "A3.1.7.1.2.",
  parentId: "A3.1.7.1.",
  bodyText: `Not less than 1.75 times the vapor pressure at 50 degrees C (122 degrees F)
of the material to be transported minus 100 kPa (15 psi) but with a minimum test
pressure of 100 kPa (15 psi).`,
};

export const A3_1_7_1_3: DocumentNode = {
  id: "A3.1.7.1.3.",
  parentId: "A3.1.7.1.",
  bodyText: `Not less than 1.5 times the vapor pressure at 55 degrees C (131 degrees F) of
the material to be transported minus 100 kPa (15 psi) but with a minimum test pressure
of 100 kPa (15 psi).`,
};

export const A3_1_7_2: DocumentNode = {
  id: "A3.1.7.2.",
  parentId: "A3.1.7.",
  title: "Single and Composite Packaging Pressure Requirement.",
  bodyText: `Single packagings containing liquid hazardous material must meet the hydraulic pressure
    test requirements of 49 CFR Section 178.605. A test pressure of not less than 250 kPa (36 psi)
    for liquids of PG I; 80 kPa (12 psi) for PG III liquids in Class 3 or Class 6.1; and 100 kPa (15 psi)
    for all other liquids as outlined in 49 CFR Paragraph 173.27(c). <strong>(T-0).</strong> If shipping liquid hazardous
    materials in containers that do not meet the internal hydraulic pressure requirement, repack or
    pack into supplementary UN specification certified containers that do meet the requirement.`,
};

export const A3_1_7_3: DocumentNode = {
  id: "A3.1.7.3.",
  parentId: "A3.1.7.",
  title: "Supplementary Packaging.",
  bodyText: `Pack containers holding liquids that do not meet the pressure requirement for air transport
    into a supplementary packaging that does meet the requirement. Separate interior containers by
    absorbent and/or cushioning material as required by Attachment 20. Do not pack pressurized
    containers in sealed metal drums. See Attachment 14 and Attachment 15 for marking/labeling
    requirements and Table A17.1. for certification instructions.`,
};

export const A3_1_8: DocumentNode = {
  id: "A3.1.8.",
  parentId: "A3.1.",
  title: "Indicators.",
  bodyText: `Valves and indicators (with protective caps when required), which are necessary to ensure
    safe transportation, must be installed in the shipping container. <strong>(T-0).</strong> Examples are relief valves
    (vacuum or pressure), humidity indicators, or leak indicators with adequate sensitivity to alert
    monitor or crew of imminent danger.`,
};

export const A3_1_10: DocumentNode = {
  id: "A3.1.10.",
  parentId: "A3.1.",
  title: "Inner Packaging.",
  bodyText: `Pack, secure, and cushion inner packagings of combination packagings to prevent breakage
    or leakage and to control movement within the outer container. When partial contents are removed,
    fill voids to ensure a tight pack. Cushioning material must not react dangerously with the contents
    of the inner packagings. <strong>(T-0).</strong> Inner packagings are required as specified by the applicable packaging
    paragraph. If inner packagings are not required, the packaging paragraph states that inner packagings
    are not necessary. See Attachment 20 for absorbent, closure, and cushioning requirements.`,
};

export const A3_1_11: DocumentNode = {
  id: "A3.1.11.",
  parentId: "A3.1.",
  title: "Outside Package/Container.",
  bodyText: `The package or container must be of such size that there is adequate space to affix all
    markings and labels in a manner required by this manual (Attachment 14 and Attachment 15). <strong>(T-0).</strong>
    If necessary, use overpacks to provide adequate space.`,
};

export const A3_1_12: DocumentNode = {
  id: "A3.1.12.",
  parentId: "A3.1.",
  title: "Solids in a Liquid Single Packaging.",
  bodyText: `A single or composite packaging which is tested and marked for liquid hazardous materials
    may be filled with a solid hazardous material to a gross mass, in kilograms, not exceeding the
    rated capacity of the packaging in liters, multiplied by the specific gravity marked on the packaging,
    or 1.2 if not marked. In addition:`,
  childNodeIds: ["A3.1.12.1.", "A3.1.12.2."],
};

export const A3_1_12_1: DocumentNode = {
  id: "A3.1.12.1.",
  parentId: "A3.1.12.",
  bodyText: `A single or composite packaging which is tested and marked for PG I liquid hazardous
    materials may be filled with:`,
  childNodeIds: ["A3.1.12.1.1.", "A3.1.12.1.2."],
};

export const A3_1_12_1_1: DocumentNode = {
  id: "A3.1.12.1.1.",
  parentId: "A3.1.12.1.",
  bodyText: `A PG II solid hazardous material to a gross mass, in kilograms, not exceeding the rated capacity
    of the packaging in liters, multiplied by 1.5, multiplied by the specific gravity marked on the packaging,
    or 1.2 if not marked.`,
};

export const A3_1_12_1_2: DocumentNode = {
  id: "A3.1.12.1.2.",
  parentId: "A3.1.12.1.",
  bodyText: `A PG III solid hazardous material to a gross mass, in kilograms, not exceeding the rated capacity
    of the packaging in liters, multiplied by 2.25, multiplied by the specific gravity marked on the packaging,
    or 1.2 if not marked.`,
};

export const A3_1_12_2: DocumentNode = {
  id: "A3.1.12.2.",
  parentId: "A3.1.12.",
  bodyText: `A single or composite packaging which is tested and marked for PG II liquid hazardous
    materials may be filled with a PG III solid hazardous material to a gross mass, in kilograms,
    not exceeding the rated capacity of the packaging in liters, multiplied by 1.5, multiplied by
    the specific gravity marked on the packaging, or 1.2 if not marked.`,
};

export const A3_1_13: DocumentNode = {
  id: "A3.1.13.",
  parentId: "A3.1.",
  title: "Quantity limits for UN Specification Nonbulk Packagings.",
  bodyText: `Unless otherwise specified, the maximum capacity allowed in a UN Specification
    packaging is expressed in the following table.`,
};

export const TableA3_1: DocumentNode = {
  id: "Table A3.1.",
  parentId: "A3.1.",
  title: "Quantity limits for UN specification Nonbulk Packagings.",
  bodyText: `
  <table border="1" style="border-collapse: collapse; width: 100%;">
    <thead>
      <tr style="height: 4rem">
        <th>Packaging Type</th>
        <th>Type Code</th>
        <th>Maximum Capacity / Net Mass</th>
      </tr>
    </thead>
    <tbody>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">Steel Drum</td>
        <td style="padding: 0.4rem">1A1, 1A2</td>
        <td style="padding: 0.4rem">450 L (119 gal) / 400 kg (882 lb)</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">Aluminum Drum</td>
        <td style="padding: 0.4rem">1B1, 1B2</td>
        <td style="padding: 0.4rem">450 L (119 gal) / 400 kg (882 lb)</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">Metal Drum (other than steel or aluminum)</td>
        <td style="padding: 0.4rem">1N1, 1N2</td>
        <td style="padding: 0.4rem">450 L (119 gal) / 400 kg (882 lb)</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">Plywood Drum</td>
        <td style="padding: 0.4rem">1D</td>
        <td style="padding: 0.4rem">250 L (66 gal) / 400 kg (882 lb)</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">Fiber Drum</td>
        <td style="padding: 0.4rem">1G</td>
        <td style="padding: 0.4rem">450 L (119 gal) / 400 kg (882 lb)</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">Plastic Drum</td>
        <td style="padding: 0.4rem">1H1, 1H2</td>
        <td style="padding: 0.4rem">450 L (119 gal) / 400 kg (882 lb)</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">Wooden Barrel</td>
        <td style="padding: 0.4rem">2C1, 2C2</td>
        <td style="padding: 0.4rem">250 L (66 gal) / 400 kg (882 lb)</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">Plastic Jerrican</td>
        <td style="padding: 0.4rem">3H1, 3H2</td>
        <td style="padding: 0.4rem">60 L (16 gal) / 120 kg (265 lb)</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">Aluminum and Steel Jerrican</td>
        <td style="padding: 0.4rem">3A1, 3A2, 3B1, 3B2</td>
        <td style="padding: 0.4rem">60 L (16 gal) / 120 kg (265 lb)</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">Aluminum, Steel, and Other Metal Box</td>
        <td style="padding: 0.4rem">4A, 4B, 4N</td>
        <td style="padding: 0.4rem">400 kg (882 lb)</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">Wood Box - Natural Wood, Plywood, and Reconstituted Wood</td>
        <td style="padding: 0.4rem">4C1, 4C2, 4D, 4F</td>
        <td style="padding: 0.4rem">400 kg (882 lb)</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">Fiberboard Box</td>
        <td style="padding: 0.4rem">4G</td>
        <td style="padding: 0.4rem">400 kg (882 lb)</td>
      </tr>
      <tr style="height: 3rem">
        <td style="border-bottom: none; padding: 0.4rem">Plastic Box</td>
        <td style="padding: 0.4rem">4H1</td>
        <td style="padding: 0.4rem">60 kg (132 lb)</td>
      </tr>
      <tr style="height: 3rem">
        <td style="border-top: none; padding: 0.4rem"></td>
        <td style="padding: 0.4rem">4H2</td>
        <td style="padding: 0.4rem">400 kg (882 lb)</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">Bags - Woven Plastic, Plastic Film</td>
        <td style="padding: 0.4rem">5H1, 5H2, 5H3, 5H4</td>
        <td style="padding: 0.4rem">50 kg (110 lb)</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">Textile, and Paper</td>
        <td style="padding: 0.4rem">5L1, 5L2, 5L3, 5M1, 5M2</td>
        <td style="padding: 0.4rem"></td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">Composite Packaging with inner plastic receptacle and outer drum</td>
        <td style="padding: 0.4rem">6HA1, 6HB1, 6HD1, 6HG1, 6HH1</td>
        <td style="padding: 0.4rem">250 L (66 gal) / 400 kg (882 lb)</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">Composite Packaging with inner plastic receptacle and outer box</td>
        <td style="padding: 0.4rem">6HA2, 6HB2, 6HC, 6HD2, 6HG2, 6HH2</td>
        <td style="padding: 0.4rem">60 L (16 gal) / 75 kg (165 lb)</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">Composite Packaging with inner glass porcelain or stoneware receptacles</td>
        <td style="padding: 0.4rem">6PA1, 6PA2, 6PB1, 6PB2, 6PC, 6PD1, 6PD2, 6PG1, 6PG2, 6PH1, 6PH2</td>
        <td style="padding: 0.4rem">60 L (16 gal) / 75 kg (165 lb)</td>
      </tr>
    </tbody>
  </table>
  `,
};

export const A3_1_14: DocumentNode = {
  id: "A3.1.14.",
  parentId: "A3.1.",
  title: "Plastics Drums and Jerricans.",
  bodyText: `The period of use permitted for the transport of a hazardous material in plastics drums and
    jerricans is five years from the date of manufacture. Plastic jerricans used after five years must
    meet all requirements of 49 CFR Section 173.28 for use. <strong>(T-0).</strong>`,
};

export const A3_1_15: DocumentNode = {
  id: "A3.1.15.",
  parentId: "A3.1.",
  title: "Foreign Packaging.",
  bodyText: `UN standard non-bulk packaging manufactured outside the United States may be shipped by
    military air provided packages are marked according to A14.2, when applicable, and all other
    requirements of this manual are complied with. Refer to A3.3.2.10. for shipping of foreign cylinders.`,
};

export const A3_1_16: DocumentNode = {
  id: "A3.1.16.",
  parentId: "A3.1.",
  title:
    "Empty Packagings, (articles, Fuel Tanks, Containers, Cylinders, Radioactive Packages and Nonhazardous Materials).",
  bodyText: `Except as specified in this paragraph, empty packagings are not subject to any other
    requirements of this manual.`,
  childNodeIds: ["A3.1.16.1.", "A3.1.16.2.", "A3.1.16.3.", "A3.1.16.4."],
};

export const A3_1_16_1: DocumentNode = {
  id: "A3.1.16.1.",
  parentId: "A3.1.16.",
  title: "Empty Containers.",
  bodyText: `Inspect packages that formerly contained a hazardous material covered by this manual to
    determine the presence or absence of hazardous material. If there is presence of hazardous
    material, purge the hazardous material or the package is regulated in the same manner as
    prescribed for the package when it was full. A container is considered empty if:`,
  childNodeIds: ["A3.1.16.1.1.", "A3.1.16.1.2."],
};

export const A3_1_16_1_1: DocumentNode = {
  id: "A3.1.16.1.1.",
  parentId: "A3.1.16.1.",
  bodyText: `A hazardous article has been removed from its container and there is no
    possibility of remaining residue (e.g., empty torpedo or missile containers).`,
};

export const A3_1_16_1_2: DocumentNode = {
  id: "A3.1.16.1.2.",
  parentId: "A3.1.16.1.",
  bodyText: `The container has been purged of the hazardous material it previously contained.
    Note: When purging equipment/facilities are not present at a given location, items must
    be properly packaged and certified as hazardous materials. <strong>(T-0).</strong>`,
};

export const A3_1_16_2: DocumentNode = {
  id: "A3.1.16.2.",
  parentId: "A3.1.16.",
  title: "Empty Cylinders.",
  bodyText: `Compressed gas cylinders are empty if the pressure in the cylinder is less than 40 pounds per
    square inch absolute (psia) at 21 degrees C (70 degrees F). Psia equals the gauge pressure plus
    atmospheric pressure (14.7 psi).`,
  childNodeIds: ["A3.1.16.2.1.", "A3.1.16.2.2.", "A3.1.16.2.3."],
};

export const A3_1_16_2_1: DocumentNode = {
  id: "A3.1.16.2.1.",
  parentId: "A3.1.16.2.",
  bodyText: `Before shipment, inspect empty cylinders for dents, bulges, oxidation pits, or other damage.
    Handle faulty cylinders as required by the latest DOT regulations or DLAI 4145.25/A700-68/NAVSUPINST
    4440.128D/MCO 10330.2D/AFMAN 23-227(I), Storage and Handling of Liquefied and Gaseous Compressed
    Gasses and Their Full and Empty Cylinders.`,
};

export const A3_1_16_2_2: DocumentNode = {
  id: "A3.1.16.2.2.",
  parentId: "A3.1.16.2.",
  bodyText: `Tightly close valves of cylinders before offering for transportation. The requirements of
    A3.3.2.3. apply to the protection of the valves.`,
};

export const A3_1_16_2_3: DocumentNode = {
  id: "A3.1.16.2.3.",
  parentId: "A3.1.16.2.",
  bodyText: `If the cylinder contains residue of the following material, ship regulated as full cylinders,
    regardless of psia, unless completely cleaned and purged of residue or vapors:`,
  childNodeIds: ["A3.1.16.2.3.1.", "A3.1.16.2.3.2.", "A3.1.16.2.3.3."],
};

export const A3_1_16_2_3_1: DocumentNode = {
  id: "A3.1.16.2.3.1.",
  parentId: "A3.1.16.2.3.",
  bodyText: `Ammonia, Anhydrous.`,
};

export const A3_1_16_2_3_2: DocumentNode = {
  id: "A3.1.16.2.3.2.",
  parentId: "A3.1.16.2.3.",
  bodyText: `Division 2.2 with a subsidiary hazard (other than division 5.1).`,
};

export const A3_1_16_2_3_3: DocumentNode = {
  id: "A3.1.16.2.3.3.",
  parentId: "A3.1.16.2.3.",
  bodyText: `Contains a flammable or poisonous material.`,
};

export const A3_1_16_3: DocumentNode = {
  id: "A3.1.16.3.",
  parentId: "A3.1.16.",
  title: "Empty Radioactive Material Packaging.",
  bodyText: `Empty the contents of the packaging as far as practical, and ensure the requirements of
    49 CFR Section 173.428 and Attachment 11 are met.`,
};

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

export const A3_1_17: DocumentNode = {
  id: "A3.1.17.",
  parentId: "A3.1.",
  title: "Hidden Hazardous Shipment Indicators.",
  bodyText: `Shippers have not always properly identified all hazardous materials prior to entering the DTS.
    The main reason is lack of knowledge of hazardous materials located or packed in equipment, toolboxes,
    parts, etc. Personnel that ship, inspect or handle cargo in DTS should be aware of potential hidden hazards.
    If hazards are suspected, frustrate the shipment and coordinate with the shipping activity to resolve. The
    following table has examples of cargo that could contain hidden hazards that may endanger the safety of aircraft.`,
};

export const TableA3_2: DocumentNode = {
  id: "Table A3.2.",
  parentId: "A3.",
  title: "Hidden Hazardous Shipment Indicators.",
  bodyText: `
  <table border="1" style="border-collapse: collapse; width: 100%;">
    <thead>
      <tr style="height: 4rem">
        <th>Cargo Type</th>
        <th>May Contain</th>
      </tr>
    </thead>
    <tbody>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">Aircraft and Aircraft Parts</td>
        <td style="padding: 0.4rem">batteries, explosives, chemical oxygen generators, compressed gas cylinders (fire extinguishers)(oxygen bottles), fuel cells, fuel devices, radioactive material, secondary loads, survival kits</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">Breathing Apparatus/SCUBA</td>
        <td style="padding: 0.4rem">compressed air or compressed gasses including oxygen in cylinders</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">Cleaning Supplies</td>
        <td style="padding: 0.4rem">solvents, flammable liquids, corrosive material</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">Containerized Loads</td>
        <td style="padding: 0.4rem">multiple hazards</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">Cryogenics: low temperature, low pressure, or non-pressurized gas</td>
        <td style="padding: 0.4rem">liquid argon, helium, nitrogen, oxygen</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">Cylinders</td>
        <td style="padding: 0.4rem">compressed gas</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">Deployment Equipment</td>
        <td style="padding: 0.4rem">batteries, flammable liquids, gas, or solids, fuel cells, lithium batteries, radioactive material</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">Electrical Equipment</td>
        <td style="padding: 0.4rem">batteries, lithium batteries, magnetized materials, mercury in switches or electron tubes, radioactive material</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">Frozen Foods</td>
        <td style="padding: 0.4rem">dry ice</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">Fuel Devices (e.g., NSN 2915013647174)</td>
        <td style="padding: 0.4rem">residual fuel (especially if used or unserviceable)</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">Generators, Engines, and Ground SE</td>
        <td style="padding: 0.4rem">batteries, compressed gas cylinders (fire extinguishers), explosives, fuel cells, fuel devices</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">Household Products</td>
        <td style="padding: 0.4rem">paint, aerosols, bleach, radioactive material, etc.</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">Individual Equipment Items (GPS equipment, night vision devices, personal protection devices, sighting equipment, etc.)</td>
        <td style="padding: 0.4rem">aerosols, batteries, lithium batteries, flammable gas, radioactive materials</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">Instruments</td>
        <td style="padding: 0.4rem">batteries, lithium batteries, mercury, radioactive materials</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">Laboratory Samples</td>
        <td style="padding: 0.4rem">hazardous chemicals, infectious substances, radioactive material</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">Machinery Parts</td>
        <td style="padding: 0.4rem">adhesives, hazardous chemicals, paints, sealants, solvents</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">Medical Supplies/Equipment</td>
        <td style="padding: 0.4rem">batteries, lithium batteries, hazardous chemicals, radioactive materials</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">Pharmaceuticals, Vaccines</td>
        <td style="padding: 0.4rem">dry ice, hazardous chemicals</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">Repair Kits</td>
        <td style="padding: 0.4rem">adhesives, hazardous chemicals, paints, solvents, organic peroxides</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">Survival Kits</td>
        <td style="padding: 0.4rem">aerosols, batteries, compressed gas, flammable solids, lithium batteries</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">Tool Boxes</td>
        <td style="padding: 0.4rem">adhesives, cleaners, compressed gas, lubricants, paints, sealers, solvents</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">Uninterrupted Power Supply (UPS)</td>
        <td style="padding: 0.4rem">batteries, lithium-ion and metal batteries, lead-acid nonspillable batteries</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">Vehicles and Vehicle Parts</td>
        <td style="padding: 0.4rem">additional fuel, airbag inflators/airbag modules, batteries, fire extinguishers, fuel cells, fuel devices, paints, radioactive material, secondary loads, shocks/struts with compressed gas</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">Vessels and Vessel Parts</td>
        <td style="padding: 0.4rem">batteries, compressed gas cylinders (fire extinguishers)(SCUBA), explosives, flares, fuel cells, fuel devices, life rafts, secondary loads</td>
      </tr>
    </tbody>
  </table>
  `,
};

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
  bodyText: `Flameless Ration Heaters (FRH), containing 8 grams or less of a magnesium-iron alloy
    (e.g., magnesium powder), packed as a component of the MRE, regardless of the number shipped,
    are not regulated by this manual (see A3.3.4). Prepare FRHs shipped separately from the MRE as
    regulated hazardous material according to this manual.`,
};

export const A3_2_1_2: DocumentNode = {
  id: "A3.2.1.2.",
  parentId: "A3.2.1.",
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

export const A3_3_1: DocumentNode = {
  id: "A3.3.1.",
  parentId: "A3.3.",
  title: "Class 1.",
  childNodeIds: [
    "A3.3.1.1.",
    "A3.3.1.2.",
    "A3.3.1.3.",
    "A3.3.1.4.",
    "A3.3.1.5.",
    "A3.3.1.6.",
    "A3.3.1.7.",
    "A3.3.1.8.",
    "A3.3.1.9.",
    "A3.3.1.10.",
  ],
};

export const A3_3_1_1: DocumentNode = {
  id: "A3.3.1.1.",
  parentId: "A3.3.1.",
  title: "General Handling Instructions.",
  bodyText: `Class 1 materials can function by detonation or combustion. Store away from fire hazards, sources
    of heat, ignition, or sparks, and handle carefully.`,
  childNodeIds: [
    "A3.3.1.1.1.",
    "A3.3.1.1.2.",
    "A3.3.1.1.3.",
    "A3.3.1.1.4.",
    "A3.3.1.1.5.",
  ],
};

export const A3_3_1_1_1: DocumentNode = {
  id: "A3.3.1.1.1.",
  parentId: "A3.3.1.1.",
  bodyText: `Comply with safety precautions, standards, and rules in AFMAN 91-201 (Air Force), DA PAM 385-64
    (ARMY), and NAVSEA OP 5 (Navy) during handling, transportation and storage of explosives.`,
};

export const A3_3_1_1_2: DocumentNode = {
  id: "A3.3.1.1.2.",
  parentId: "A3.3.1.1.",
  bodyText: `Do not ship explosives that have been dropped any distance, are leaking, or are otherwise
    damaged during transportation or handling until inspected by qualified munitions/EOD personnel.`,
};

export const A3_3_1_1_3: DocumentNode = {
  id: "A3.3.1.1.3.",
  parentId: "A3.3.1.1.",
  bodyText: `Onward shipment of suspected or damaged explosives may be made provided the shipment is
    inspected, repacked, and certified to be in proper condition for safe transport by qualified personnel.`,
};

export const A3_3_1_1_4: DocumentNode = {
  id: "A3.3.1.1.4.",
  parentId: "A3.3.1.1.",
  bodyText: `Package all Class 1 material in packaging that meets the PG I or II performance level.`,
};

export const A3_3_1_1_5: DocumentNode = {
  id: "A3.3.1.1.5.",
  parentId: "A3.3.1.1.",
  bodyText: `Comply with A3.1.16.1.3 and A3.16.4 for Inert Certification when all explosive components
    have been removed from an item.`,
};

export const A3_3_1_2: DocumentNode = {
  id: "A3.3.1.2.",
  parentId: "A3.3.1.",
  title:
    "Forbidden Explosives. Do not offer explosives listed below for shipment:",
  childNodeIds: [
    "A3.3.1.2.1.",
    "A3.3.1.2.2.",
    "A3.3.1.2.3.",
    "A3.3.1.2.4.",
    "A3.3.1.2.5.",
    "A3.3.1.2.6.",
    "A3.3.1.2.7.",
    "A3.3.1.2.8.",
  ],
};

export const A3_3_1_2_1: DocumentNode = {
  id: "A3.3.1.2.1.",
  parentId: "A3.3.1.2.",
  bodyText: `An explosive not approved according to A3.3.1.4.`,
};

export const A3_3_1_2_2: DocumentNode = {
  id: "A3.3.1.2.2.",
  parentId: "A3.3.1.2.",
  bodyText: `An explosive mixture or device containing a chlorate and also containing:`,
  childNodeIds: ["A3.3.1.2.2.1.", "A3.3.1.2.2.2."],
};

export const A3_3_1_2_2_1: DocumentNode = {
  id: "A3.3.1.2.2.1.",
  parentId: "A3.3.1.2.2.",
  bodyText: `An ammonium salt including a substituted ammonium or quaternary ammonium salt.`,
};

export const A3_3_1_2_2_2: DocumentNode = {
  id: "A3.3.1.2.2.2.",
  parentId: "A3.3.1.2.2.",
  bodyText: `An acidic substance including a salt of a weak base and a strong acid.`,
};

export const A3_3_1_2_3: DocumentNode = {
  id: "A3.3.1.2.3.",
  parentId: "A3.3.1.2.",
  bodyText: `Nitroglycerin, diethylene glycol dinitrate, or any other liquid explosives not specifically
    authorized by Attachment 5.`,
};

export const A3_3_1_2_4: DocumentNode = {
  id: "A3.3.1.2.4.",
  parentId: "A3.3.1.2.",
  bodyText: `A loaded firearm except as authorized by Chapter 3.`,
};

export const A3_3_1_2_5: DocumentNode = {
  id: "A3.3.1.2.5.",
  parentId: "A3.3.1.2.",
  bodyText: `Fireworks that combine an explosive and a detonator.`,
};

export const A3_3_1_2_6: DocumentNode = {
  id: "A3.3.1.2.6.",
  parentId: "A3.3.1.2.",
  bodyText: `Fireworks containing yellow or white phosphorus.`,
};

export const A3_3_1_2_7: DocumentNode = {
  id: "A3.3.1.2.7.",
  parentId: "A3.3.1.2.",
  bodyText: ` A toy torpedo whose outside dimension exceeds 23 mm (0.906 in), or a toy
  torpedo containing a mixture of potassium chlorate, black antimony (antimony
  sulphide), and sulphur if the weight of the explosive material in the device exceeds
  0.26 g (0.01 oz).`,
};

export const A3_3_1_2_8: DocumentNode = {
  id: "A3.3.1.2.8.",
  parentId: "A3.3.1.2.",
  bodyText: `Explosives specifically forbidden in Table A4.1.`,
};

export const A3_3_1_3: DocumentNode = {
  id: "A3.3.1.3.",
  parentId: "A3.3.1.",
  title: "Chemical Munitions.",
  bodyText: `Chemical munitions are dangerous materials that are found
  in a variety of forms such as artillery shells, mortar shells, spray tanks, aircraft bombs,
  grenades, candles, rockets, and containers of chemical agents with no high explosives or
  dispersing charges.`,
  childNodeIds: ["A3.3.1.3.1.", "A3.3.1.3.2."],
};

export const A3_3_1_3_1: DocumentNode = {
  id: "A3.3.1.3.1.",
  parentId: "A3.3.1.3.",
  title: "Handling Chemical Munitions.",
  bodyText: `Use maximum preferential handling. Use the same materials handling equipment for chemical
    munitions that is used for high explosive munitions.`,
};

export const A3_3_1_3_2: DocumentNode = {
  id: "A3.3.1.3.2.",
  parentId: "A3.3.1.3.",
  title: "Reporting and Disposing of Chemical Munitions.",
  bodyText: `Immediately report any leaking chemical munitions to the agency initiating the shipment.
    If the leak is due to causes other than faulty munitions construction, report according to paragraph
    1.7. Dispose of leaking or damaged chemical munitions according to applicable service directives.`,
  childNodeIds: [
    "A3.3.1.3.2.1.",
    "A3.3.1.3.2.2.",
    "A3.3.1.3.2.3.",
    "A3.3.1.3.2.4.",
    "A3.3.1.3.2.5.",
  ],
};

export const A3_3_1_3_2_1: DocumentNode = {
  id: "A3.3.1.3.2.1.",
  parentId: "A3.3.1.3.2.",
  bodyText: `Type and amount of chemical munitions.`,
};

export const A3_3_1_3_2_2: DocumentNode = {
  id: "A3.3.1.3.2.2.",
  parentId: "A3.3.1.3.2.",
  bodyText: `Lot number.`,
};

export const A3_3_1_3_2_3: DocumentNode = {
  id: "A3.3.1.3.2.3.",
  parentId: "A3.3.1.3.2.",
  bodyText: `Date discovered.`,
};

export const A3_3_1_3_2_4: DocumentNode = {
  id: "A3.3.1.3.2.4.",
  parentId: "A3.3.1.3.2.",
  bodyText: `Detailed information concerning the nature and possible cause of leak.`,
};

export const A3_3_1_3_2_5: DocumentNode = {
  id: "A3.3.1.3.2.5.",
  parentId: "A3.3.1.3.2.",
  bodyText: `Disposition or recommendation for disposition.`,
};

export const A3_3_1_4: DocumentNode = {
  id: "A3.3.1.4.",
  parentId: "A3.3.1.",
  title: "Explosives Classification Approval.",
  bodyText: `Explosives, explosive devices, and munitions, including commercial and foreign, to be eligible for
    military air transportation, must be either assigned a DOT hazard classification obtained by the manufacturer
    or foreign authority, a DOD classification, or be approved by a coalition forces' Competent Authority. <strong>(T-0).</strong>
    All explosives indexed in the Joint Hazard Classification System (JHCS) are approved for movement by military
    controlled aircraft. Unless listed in the JHCS, a copy of the classification approval document (e.g., DOT Hazard
    classification obtained by manufacturer or foreign authority or DOD Hazard Classification or Coalition Forces
    Competent Authority Classification) must accompany the shipment. <strong>(T-0).</strong> Coalition forces' approval documentation
    must, at a minimum, include in English: the product's assigned PSN, UN number, Hazard Class/Division, Compatibility
    Group (CG), and the NEW or net explosive mass and an indication whether the mass is per article or per package. <strong>(T-0).</strong>
    A copy of the classification approval document is not required for 1.4S munitions meeting the criteria in paragraph
    A3.3.1.4.7 below. Transport explosives not listed in the JHCS only under one of the following conditions:`,
  childNodeIds: [
    "A3.3.1.4.1.",
    "A3.3.1.4.2.",
    "A3.3.1.4.3.",
    "A3.3.1.4.4.",
    "A3.3.1.4.5.",
    "A3.3.1.4.6.",
    "A3.3.1.4.7.",
  ],
};

export const A3_3_1_4_1: DocumentNode = {
  id: "A3.3.1.4.1.",
  parentId: "A3.3.1.4.",
  bodyText: `Assigned a DOD interim hazard classification (IHC) by a DOD classification authority according
    to TB 700-2, NAVSEAINST 8020.8B, TO 11A-1-47, DLAR 8220.1.`,
};

export const A3_3_1_4_2: DocumentNode = {
  id: "A3.3.1.4.2.",
  parentId: "A3.3.1.4.",
  bodyText: `Assigned a DOE final or interim hazard classification (IHC).`,
};

export const A3_3_1_4_3: DocumentNode = {
  id: "A3.3.1.4.3.",
  parentId: "A3.3.1.4.",
  bodyText: `Assigned a DOT-approved final hazard classification and EX number provided the DOT classification
    approval document accompanies the shipment, and listed in Table A4.1., Column 7 (Special Provision) as "A69".`,
};

export const A3_3_1_4_4: DocumentNode = {
  id: "A3.3.1.4.4.",
  parentId: "A3.3.1.4.",
  bodyText: `An explosive classified as 1.4S in accordance with a foreign issued CAA or Special Approval document.`,
};

export const A3_3_1_4_5: DocumentNode = {
  id: "A3.3.1.4.5.",
  parentId: "A3.3.1.4.",
  bodyText: `Foreign troop (and hazardous materials) movements according to paragraph 1.17.`,
};

export const A3_3_1_4_6: DocumentNode = {
  id: "A3.3.1.4.6.",
  parentId: "A3.3.1.4.",
  bodyText: `Explosives and munitions transported for allied/coalition countries supporting joint operations with U.S.
    forces, provided appropriate coalition forces' classification approval documentation accompanies the shipment.`,
};

export const A3_3_1_4_7: DocumentNode = {
  id: "A3.3.1.4.7.",
  parentId: "A3.3.1.4.",
  childNodeIds: ["A3.3.1.4.7.1.", "A3.3.1.4.7.2.", "A3.3.1.4.7.3."],
};

export const A3_3_1_4_7_1: DocumentNode = {
  id: "A3.3.1.4.7.1.",
  parentId: "A3.3.1.4.7.",
  bodyText: `Ammunition for rifle, pistol, shotgun, machine gun or tools.`,
};

export const A3_3_1_4_7_2: DocumentNode = {
  id: "A3.3.1.4.7.2.",
  parentId: "A3.3.1.4.7.",
  bodyText: `Ammunition with inert projectile, including those containing a tracer or blank ammunition.`,
};

export const A3_3_1_4_7_3: DocumentNode = {
  id: "A3.3.1.4.7.3.",
  parentId: "A3.3.1.4.7.",
  bodyText: `Ammunition not exceeding .50 caliber for rifle or pistol cartridges or 8 gauge for shotgun shells.`,
};

export const A3_3_1_5: DocumentNode = {
  id: "A3.3.1.5.",
  parentId: "A3.3.1.",
  title: "Explosive Components of Airdrop Deployment Systems.",
  bodyText: `Explosive components of parachutes or other airdrop deployment systems prepared or “rigged”
    according to technical directives, and intended for use during flight, are not governed by this manual.`,
};

export const A3_3_1_6: DocumentNode = {
  id: "A3.3.1.6.",
  parentId: "A3.3.1.",
  title: "Unpackaged Explosives.",
  bodyText: `Explosives must be packaged according to Attachment 5 except as identified in paragraph 3.5,
    A3.3.1.9., and A5.2. <strong>(T-0).</strong>`,
};

export const A3_3_1_7: DocumentNode = {
  id: "A3.3.1.7.",
  parentId: "A3.3.1.",
  title: "Captured Ammunition and Ammunition with Unknown Characteristics.",
  bodyText: `Transport this ammunition on military aircraft only under the following provisions:`,
  childNodeIds: ["A3.3.1.7.1.", "A3.3.1.7.2.", "A3.3.1.7.3."],
};

export const A3_3_1_7_1: DocumentNode = {
  id: "A3.3.1.7.1.",
  parentId: "A3.3.1.7.",
  bodyText: `Explosive ordnance disposal (EOD) personnel must inspect the items and complete necessary action
    to make them safe for air shipment, and sign a certificate to this effect. <strong>(T-0).</strong>`,
};

export const A3_3_1_7_2: DocumentNode = {
  id: "A3.3.1.7.2.",
  parentId: "A3.3.1.7.",
  bodyText: `Assigned a Final or Interim Hazard Classification.`,
};

export const A3_3_1_7_3: DocumentNode = {
  id: "A3.3.1.7.3.",
  parentId: "A3.3.1.7.",
  bodyText: `Packed and marked according to the prescribed packaging in Table A4.1., including UN performance
    specification packaging requirements.`,
};

export const A3_3_1_8: DocumentNode = {
  id: "A3.3.1.8.",
  parentId: "A3.3.1.",
  title: "Missiles, Rockets, and Rocket Motors.",
  bodyText: `Missiles, rockets, and rocket motors may not contain liquid propellants forbidden by this manual.
    Shippers must provide written procedures for monitoring shipping containers equipped with leak detection indicators
    and also include emergency actions (to include actions necessary during flight) in the event of a leak for items
    containing liquid or hypergolic fuel that is corrosive and/or toxic. <strong>(T-0).</strong>`,
};

export const A3_3_1_9: DocumentNode = {
  id: "A3.3.1.9.",
  parentId: "A3.3.1.",
  title: "Installed Explosive Devices.",
  bodyText: `Remove installed explosive devices from aircraft systems unless removal is not required according
    to a technical directive or the directive identifies the explosives are permanently imbedded in the system.`,
  childNodeIds: ["A3.3.1.9.1.", "A3.3.1.9.2."],
};

export const A3_3_1_9_1: DocumentNode = {
  id: "A3.3.1.9.1.",
  parentId: "A3.3.1.9.",
  title: "Inert Certification.",
  bodyText: `In accordance with T.O. 11A-1-60, General Instructions Inspection of Reusable Munitions Containers and
    Scrap Material Generated from Items Exposed to, or Containing Explosives, inert certification will be done when
    required inspections are completed and items are free of hazardous or explosive contaminants. <strong>(T-0).</strong> A certifying
    official will issue a certificate of clearance stating item(s) were 100% inspected and are inert and/or free of
    explosives related materials. <strong>(T-0).</strong> Ensure inert certificate is provided for item(s) prior to offering for commercial
    and military transportation.`,
};

export const A3_3_1_9_2: DocumentNode = {
  id: "A3.3.1.9.2.",
  parentId: "A3.3.1.9.",
  bodyText: `When installation is authorized, comply with the technical directive and the following requirements:`,
  childNodeIds: [
    "A3.3.1.9.2.1.",
    "A3.3.1.9.2.2.",
    "A3.3.1.9.2.3.",
    "A3.3.1.9.2.4.",
  ],
};

export const A3_3_1_9_2_1: DocumentNode = {
  id: "A3.3.1.9.2.1.",
  parentId: "A3.3.1.9.2.",
  bodyText: `The safety devices must be in place and secured to the maximum extent possible (including blocking
    or banding when advantageous) to prevent arming. <strong>(T-0).</strong>`,
};

export const A3_3_1_9_2_2: DocumentNode = {
  id: "A3.3.1.9.2.2.",
  parentId: "A3.3.1.9.2.",
  bodyText: `The aircraft system's packaging must provide reasonable security against tampering with the installed
    explosive items or the arming systems. <strong>(T-0).</strong>`,
};

export const A3_3_1_9_2_3: DocumentNode = {
  id: "A3.3.1.9.2.3.",
  parentId: "A3.3.1.9.2.",
  bodyText: `Mark items according to Attachment 14.`,
};

export const A3_3_1_9_2_4: DocumentNode = {
  id: "A3.3.1.9.2.4.",
  parentId: "A3.3.1.9.2.",
  bodyText: `Complete Shipper's Declaration for Dangerous Goods according to Attachment 17.`,
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

export const A3_3_9_2: DocumentNode = {
  id: "A3.3.9.2.",
  parentId: "A3.3.9.",
  title: "Lithium Batteries.",
  bodyText:
    "Lithium cells or batteries must be of a design type proven to meet the requirements of the UN Manual of Tests and Criteria that were in effect based on the date of manufacture. Manufacturers must maintain a record of satisfactory completion of these tests prior to offering the cell or battery for transport. Manufacturers retain this record for as long as that lithium battery design type is offered for transportation and for one year thereafter. Activities that assemble cells or create battery types that differ from the original tested batteries are responsible for battery testing. Those activities must maintain and make available a test summary. The test summary must meet the requirements of 49 CFR Subparagraph 173.185(a)(3).",
  childNodeIds: ["A3.3.9.2.1.", "A3.3.9.2.2.", "A3.3.9.2.3.", "A3.3.9.2.4."],
};

export const A3_3_9_2_1: DocumentNode = {
  id: "A3.3.9.2.1.",
  parentId: "A3.3.9.2.",
  title: "",
  bodyText: "Lithium Batteries must:",
  childNodeIds: [
    "A3.3.9.2.1.1.",
    "A3.3.9.2.1.2.",
    "A3.3.9.2.1.3.",
    "A3.3.9.2.1.4.",
  ],
};

export const A3_3_9_2_1_1: DocumentNode = {
  id: "A3.3.9.2.1.1.",
  parentId: "A3.3.9.2.1.",
  title: "",
  bodyText:
    "Incorporate a safety venting device or otherwise be designed in a manner that precludes a violent rupture under conditions normally incident to transportation.",
};

export const A3_3_9_2_1_2: DocumentNode = {
  id: "A3.3.9.2.1.2.",
  parentId: "A3.3.9.2.1.",
  title: "",
  bodyText:
    "Be equipped with an effective means of preventing external short circuits.",
};

export const A3_3_9_2_1_3: DocumentNode = {
  id: "A3.3.9.2.1.3.",
  parentId: "A3.3.9.2.1.",
  title: "",
  bodyText:
    "Be equipped with an effective means to prevent dangerous reverse current flow (e.g., diodes, fuses, etc.) if a battery contains cells or a series of cells that are connected in parallel.",
};

export const A3_3_9_2_1_4: DocumentNode = {
  id: "A3.3.9.2.1.4.",
  parentId: "A3.3.9.2.1.",
  title: "",
  bodyText: "Be packed in a manner to prevent:",
  childNodeIds: ["A3.3.9.2.1.4.1.", "A3.3.9.2.1.4.2.", "A3.3.9.2.1.4.3."],
};

export const A3_3_9_2_1_4_1: DocumentNode = {
  id: "A3.3.9.2.1.4.1.",
  parentId: "A3.3.9.2.1.4.",
  title: "",
  bodyText: "Short circuits;",
};

export const A3_3_9_2_1_4_2: DocumentNode = {
  id: "A3.3.9.2.1.4.2.",
  parentId: "A3.3.9.2.1.4.",
  title: "",
  bodyText: "Damage caused by movement or placement within the package;",
};

export const A3_3_9_2_1_4_3: DocumentNode = {
  id: "A3.3.9.2.1.4.3.",
  parentId: "A3.3.9.2.1.4.",
  title: "",
  bodyText: "Accidental activation of the equipment.",
};

export const A3_3_9_2_2: DocumentNode = {
  id: "A3.3.9.2.2.",
  parentId: "A3.3.9.2.",
  title: "",
  bodyText:
    "Lithium Batteries identified as defective for safety reasons (e.g., manufacturer recall) or have been damaged, that have the potential of producing a dangerous evolution of heat, fire or short circuit are prohibited from air movement.",
};

export const A3_3_9_2_3: DocumentNode = {
  id: "A3.3.9.2.3.",
  parentId: "A3.3.9.2.",
  title: "Excepted Lithium Batteries.",
  bodyText:
    "Lithium batteries are not subject to any other requirements of this manual when prepared according to this section.",
  childNodeIds: [
    "A3.3.9.2.3.1.",
    "A3.3.9.2.3.2.",
    "A3.3.9.2.3.3.",
    "A3.3.9.2.3.4.",
    "A3.3.9.2.3.5.",
  ],
};

export const A3_3_9_2_3_1: DocumentNode = {
  id: "A3.3.9.2.3.1.",
  parentId: "A3.3.9.2.3.",
  title: "",
  bodyText:
    "Lithium ion cells limited to not more than 20Wh and batteries limited to not more than 100 Wh. After December 31, 2015, each lithium ion battery subject to this provision must be marked with the Watt-hour rating on the outside case.",
};

export const A3_3_9_2_3_2: DocumentNode = {
  id: "A3.3.9.2.3.2.",
  parentId: "A3.3.9.2.3.",
  title: "",
  bodyText:
    "Lithium metal or alloy cells limited to not more than 1 g and batteries limited to not more than 2 g.",
};

export const A3_3_9_2_3_3: DocumentNode = {
  id: "A3.3.9.2.3.3.",
  parentId: "A3.3.9.2.3.",
  title: "",
  bodyText:
    "Pack cells and batteries in strong rigid outer packagings that meet the requirements of Section A3.1. and:",
  childNodeIds: [
    "A3.3.9.2.3.3.1.",
    "A3.3.9.2.3.3.2.",
    "A3.3.9.2.3.3.3.",
    "A3.3.9.2.3.3.4.",
    "A3.3.9.2.3.3.5.",
    "Table A3.5.",
  ],
};

export const A3_3_9_2_3_3_1: DocumentNode = {
  id: "A3.3.9.2.3.3.1.",
  parentId: "A3.3.9.2.3.3.",
  title: "",
  bodyText:
    "Completely encloses the cell or battery in a manner that prevents accidental activation of the power source during transport.",
};

export const A3_3_9_2_3_3_2: DocumentNode = {
  id: "A3.3.9.2.3.3.2.",
  parentId: "A3.3.9.2.3.3.",
  title: "",
  bodyText:
    "Except when lithium cells or batteries are packed with, or contained in, equipment, is capable of withstanding a 1.2 m drop test in any orientation without damage to the cells or batteries, shifting that allows cell to cell or battery to battery contact, or a release of the contents.",
};

export const A3_3_9_2_3_3_3: DocumentNode = {
  id: "A3.3.9.2.3.3.3.",
  parentId: "A3.3.9.2.3.3.",
  title: "",
  bodyText:
    "Except when lithium cells or batteries are packed with, or contained in, equipment, each package must not exceed 30 kg (66 pounds) gross weight.",
};

export const A3_3_9_2_3_3_4: DocumentNode = {
  id: "A3.3.9.2.3.3.4.",
  parentId: "A3.3.9.2.3.3.",
  title: "",
  bodyText:
    "For cells and batteries installed in equipment, pack the equipment in strong rigid outer packagings constructed of suitable materials of adequate strength and design in relation to the packaging’s capacity and its intended use unless the cell or battery is afforded equivalent protection by the equipment in which it is contained.",
};

export const A3_3_9_2_3_3_5: DocumentNode = {
  id: "A3.3.9.2.3.3.5.",
  parentId: "A3.3.9.2.3.3.",
  title: "",
  bodyText: `Lithium cells and batteries of UN3090 and UN3480 may not exceed
the limits in the following table. The limits on the maximum number of batteries
and maximum net quantity of batteries in the following table may not be
combined in the same package:`,
};

export const TableA3_5: DocumentNode = {
  id: "Table A3.5.",
  parentId: "A3.",
  title: "Package limits for Excepted Lithium Batteries.",
  bodyText: `
  <table border="1" style="border-collapse: collapse; width: 100%;">
    <thead>
      <tr style="height: 4rem">
        <th style="padding: 0.4rem">Contents</th>
        <th style="padding: 0.4rem">Lithium metal cells and/or batteries with a lithium content not more than 0.3 g</th>
        <th style="padding: 0.4rem">Lithium metal cells with a lithium content more than 0.3 g but not more than 1 g</th>
        <th style="padding: 0.4rem">Lithium metal batteries with a lithium content more than 0.3 g but not more than 2 g</th>
        <th style="padding: 0.4rem">Lithium ion cells and/or batteries with a Watt-hour rating not more than 2.7 Wh</th>
        <th style="padding: 0.4rem">Lithium ion cells with a Watt-hour rating more than 2.7 Wh but not more than 20 Wh</th>
        <th style="padding: 0.4rem">Lithium ion batteries with a Watt-hour rating more than 2.7 Wh but not more than 100 Wh</th>
      </tr>
    </thead>
    <tbody>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">Maximum number of cells/batteries per package</td>
        <td style="padding: 0.4rem">No Limit</td>
        <td style="padding: 0.4rem">8 cells</td>
        <td style="padding: 0.4rem">2 batteries</td>
        <td style="padding: 0.4rem">No Limit</td>
        <td style="padding: 0.4rem">8 cells</td>
        <td style="padding: 0.4rem">2 batteries</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">Maximum net quantity (mass) per package</td>
        <td style="padding: 0.4rem">2.5 kg</td>
        <td style="padding: 0.4rem">n/a</td>
        <td style="padding: 0.4rem">n/a</td>
        <td style="padding: 0.4rem">2.5 kg</td>
        <td style="padding: 0.4rem">n/a</td>
        <td style="padding: 0.4rem">n/a</td>
      </tr>
    </tbody>
  </table>
  `,
};

export const A3_3_9_2_3_4: DocumentNode = {
  id: "A3.3.9.2.3.4.",
  parentId: "A3.3.9.2.3.",
  title: "",
  bodyText:
    "For lithium batteries packed with, or contained in, equipment, the number of batteries in each package is limited to the minimum number required to power the piece of equipment, plus two spare sets. A “set” of cells or batteries is the number of individual cells or batteries that are required to power each piece of equipment.",
};

export const A3_3_9_2_3_5: DocumentNode = {
  id: "A3.3.9.2.3.5.",
  parentId: "A3.3.9.2.3.",
  title: "",
  bodyText:
    "Mark each package with the lithium battery mark as required by A14.4.8.5. The mark is not required for a package containing button cell batteries installed in equipment (including circuit boards) or when no more than four lithium cells or two lithium batteries are installed in the equipment. Markings do not prohibit the movement of passengers on military or contracted cargo aircraft.",
};

export const A3_3_9_2_4: DocumentNode = {
  id: "A3.3.9.2.4.",
  parentId: "A3.3.9.2.",
  title: "",
  bodyText:
    "A lithium cell or battery that does not conform to the provisions of this manual may be transported only under conditions approved by the competent authority.",
};

export const A3_3_9_3: DocumentNode = {
  id: "A3.3.9.3.",
  parentId: "A3.3.9.",
  title: "Magnetized Material.",
  bodyText:
    "Any package that has a magnetic field strength of more than 0.00525 gauss measured at 4.5 m (15 ft) from any surface of the package is forbidden on military aircraft.",
};

export const A3_3_9_4: DocumentNode = {
  id: "A3.3.9.4.",
  parentId: "A3.3.9.",
  title: "Vehicles and SE.",
  bodyText: "",
  childNodeIds: ["A3.3.9.4.1.", "A3.3.9.4.2.", "A3.3.9.4.3.", "A3.3.9.4.4."],
};

export const A3_3_9_4_1: DocumentNode = {
  id: "A3.3.9.4.1.",
  parentId: "A3.3.9.4.",
  bodyText:
    "Fuel levels for vehicles, engines, equipment, and other mechanical devices are determined by the technical directive used to prepare the item for air movement. However, fuel levels cannot exceed limits established in the packaging paragraph. When technical directives do not specify fuel levels for shipment, the requirements of the packaging paragraph apply. Actual fuel levels are determined by a fuel gauge. In absence of an operational fuel gauge, use a graduated dip stick. If positive means is not available to accurately determine fuel level, drain or siphon the tank. The tank may be refilled to appropriate level in the presence of an inspector (see paragraph A28.1.2.).",
};

export const A3_3_9_4_2: DocumentNode = {
  id: "A3.3.9.4.2.",
  parentId: "A3.3.9.4.",
  title: "",
  bodyText:
    "Do not remove other hazardous materials from their packaging and store in the racks or containers of vehicles or equipment unless authorized by paragraph A5.3.",
};

export const A3_3_9_4_3: DocumentNode = {
  id: "A3.3.9.4.3.",
  parentId: "A3.3.9.4.",
  title: "Fire Suppression Systems.",
  bodyText:
    "Vehicles and equipment integral fire suppression systems are safed, secured, or disabled to prevent accidental activation during transportation.",
};

export const A3_3_9_4_4: DocumentNode = {
  id: "A3.3.9.4.4.",
  parentId: "A3.3.9.4.",
  title: "",
  bodyText:
    "The descriptions for engines installed in SE have changed. UN identification numbers and proper shipping names for engines or machinery internal combustion and assigned a hazard classification based on the type of fuel used.",
};

export const A3_3_9_5: DocumentNode = {
  id: "A3.3.9.5.",
  parentId: "A3.3.9.",
  title: "Unregulated Engines and Fuel Components.",
  bodyText:
    "The following items when drained, purged, and containing no other hazardous materials are nonhazardous for transportation. Comply with paragraph A3.1.16.4.",
  childNodeIds: ["A3.3.9.5.1.", "A3.3.9.5.2.", "A3.3.9.5.3.", "A3.3.9.5.4."],
};

export const A3_3_9_5_1: DocumentNode = {
  id: "A3.3.9.5.1.",
  parentId: "A3.3.9.5.",
  title: "",
  bodyText:
    "Vehicles and internal combustion engines, with or without fuel tanks attached, prepared for shipment according to applicable technical directives or standards. Fuel systems including carburetors, pumps, controls, and fuel tanks must be completely drained, purged, and sealed with appropriate pressure seal type plug and caps with gaskets and “O” rings. <strong>(T-0).</strong>",
};

export const A3_3_9_5_2: DocumentNode = {
  id: "A3.3.9.5.2.",
  parentId: "A3.3.9.5.",
  title: "",
  bodyText:
    "Aircraft engines which are drained and purged according to the responsible technical manual, and containing no other hazardous materials.",
};

export const A3_3_9_5_3: DocumentNode = {
  id: "A3.3.9.5.3.",
  parentId: "A3.3.9.5.",
  title: "",
  bodyText:
    "Fuel tanks, and cells that are drained, purged, and sealed according to the applicable technical directive.",
};

export const A3_3_9_5_4: DocumentNode = {
  id: "A3.3.9.5.4.",
  parentId: "A3.3.9.5.",
  title: "",
  bodyText:
    "All preserved and packed serviceable fuel assemblies, for example, carburetors, fuel pumps, filters, etc., that are drained and purged of all fuel. In addition, seal fuel assemblies with proper caps, plugs, and covers according to the applicable technical directive. Use a barrier bag to contain residual purging fluid. Mark the type of purging fluid used and the flash point on the outer container.",
};

export const A3_3_9_6: DocumentNode = {
  id: "A3.3.9.6.",
  parentId: "A3.3.9.",
  title: "Dry Ice.",
  bodyText: "",
  childNodeIds: [
    "A3.3.9.6.1.",
    "A3.3.9.6.2.",
    "A3.3.9.6.3.",
    "A3.3.9.6.4.",
    "A3.3.9.6.5.",
    "A3.3.9.6.6.",
    "A3.3.9.6.7.",
    "Figure A3.6.",
    "Figure A3.7.",
    "Figure A3.8.",
    "A3.3.9.6.8.",
    "Table A3.6.",
    "A3.3.9.6.9.",
    "A3.3.9.6.10.",
    "A3.3.9.6.11.",
    "A3.3.9.6.12.",
    "A3.3.9.6.13.",
  ],
};

export const A3_3_9_6_1: DocumentNode = {
  id: "A3.3.9.6.1.",
  parentId: "A3.3.9.6.",
  title: "Properties of Carbon Dioxide, Solid.",
  bodyText:
    "At temperatures above -78.5 degrees C (-109.3 degrees F) dry ice sublimates and releases carbon dioxide fumes. If the carbon dioxide concentration in the aircraft is over 0.5 percent, crewmembers may suffer shortness of breath. Carbon dioxide concentrations of 3.0 percent are endurable from 1/2 to 1 hour. Concentrations of 5.0 percent are dangerous from 1/2 to 1 hour and concentrations of 9.0 percent are fatal from 5 to 10 minutes. Carbon dioxide is heavier than air; therefore, the highest concentration is at or near floor level. Caution crewmembers against lying on the cargo compartment floor or remaining in the cargo compartment for a prolonged period. If symptoms of overexposure are noted, use oxygen and increased ventilation to provide rapid relief.",
};

export const A3_3_9_6_2: DocumentNode = {
  id: "A3.3.9.6.2.",
  parentId: "A3.3.9.6.",
  title: "",
  bodyText:
    "Seat passengers forward of and separate by the greatest distance possible (minimum one full pallet position) from dry ice.",
};

export const A3_3_9_6_3: DocumentNode = {
  id: "A3.3.9.6.3.",
  parentId: "A3.3.9.6.",
  title: "",
  bodyText:
    "Ensure passengers and crewmembers do not occupy the same pallet position as dry ice.",
};

export const A3_3_9_6_4: DocumentNode = {
  id: "A3.3.9.6.4.",
  parentId: "A3.3.9.6.",
  title: "",
  bodyText:
    "Do not carry dry ice (exceeding passenger acceptable carry-on quantities specified in Attachment 22) in any upper deck compartment.",
};

export const A3_3_9_6_5: DocumentNode = {
  id: "A3.3.9.6.5.",
  parentId: "A3.3.9.6.",
  title: "",
  bodyText:
    "Vent the aircraft cargo compartment to the greatest extent possible allowed by the flight profile and environmental conditions.",
};

export const A3_3_9_6_6: DocumentNode = {
  id: "A3.3.9.6.6.",
  parentId: "A3.3.9.6.",
  title: "",
  bodyText:
    "Quantity limits specified in this paragraph apply to all personnel, other than aircrew members, who occupy the cargo compartment with dry ice. Aircrew members take precautions to prevent oxygen deprivation (e.g., oxygen masks) when entering cargo compartments exceeding quantity limits specified in this paragraph.",
};

export const A3_3_9_6_7: DocumentNode = {
  id: "A3.3.9.6.7.",
  parentId: "A3.3.9.6.",
  title: "Pressurized Aircraft.",
  bodyText:
    "For pressurized aircraft, the amount of dry ice that can be safely shipped by air regardless of the type container used depends on the sublimation rate of the ice, the volume of the aircraft, and the number of air changes per hour. To minimize the sublimation rate, use insulated containers surrounded with insulating blankets and tarpaulin during shipment to the greatest extent possible. To determine the amount of dry ice that can be safely shipped by air, use the formula in Figure A3.6. The formula in Figure A3.6 does not apply to C-130 Aircraft. Aircraft specific limits for C-17 aircraft are shown in Figure A3.7 and C-5 aircraft are shown in Figure A3.8.",
};

export interface SpecialProvisionsMap {
  [key: string]: string;
}

export const informativeSpecialProvisionsMap: SpecialProvisionsMap = {
  "5": "If this material meets the defining criteria for a material poisonous by inhalation (49 CFR Paragraphs 173.116(a) or 173.133(a)) use an appropriate Class 2.3 or Class 6.1 generic PSN that identifies the inhalation hazard.",
  "9": "EPA in 40 CFR Sections 761.60 and 761.65 prescribes packaging for certain PCBs for disposal and storage.",
  "11": "Package material either as a liquid or solid, as appropriate, depending on its physical form at 55 degrees C (131 degrees F) at atmospheric pressure.",
  "12": "In concentrations greater than 40 percent, this material has strong oxidizing properties and is capable of starting fires in contact with combustible materials. If applicable, a package containing this material must comply with the subsidiary hazard labeling requirements of Attachment 15. (T-0).",
  "14": "Motor fuel anti-knock mixtures are mixtures of one or more organic lead mixtures (such as tetraethyl lead, triethylmethyl lead, diethyldimethyl lead, ethyltrimethyl lead, and tetramethyl lead) with one or more halogen compounds (such as ethylene dibromide and ethylene dichloride), hydrocarbon solvents or other equally efficient stabilizers; or tetraethyl lead.",
  "21": "This material must be stabilized by appropriate means to prevent dangerous polymerization. (T-0).",
  "22": "If the hazardous material is in dispersion in organic liquid, the organic liquid must have a flash point above 50 degrees C (122 degrees F). (T-0).",
  "23": "Classify this material as Class 4.1 only if it is packed so that the percentage of diluent will not fall below that stated in the shipping description at any time during transport.",
  "43": "The nitrogen content of the nitrocellulose must not exceed 11.5 percent. (T-0). Pack each single filter sheet between sheets of glazed paper. Ensure the portion of glazed paper between the filter sheets is not less than 65 percent, by mass. The membrane filters/paper arrangement must not be liable to propagate a detonation. (T-0).",
  "44": "The formulation must be prepared so that it remains homogenous and does not separate during transport. (T-0). Formulations with low nitrocellulose contents and neither showing dangerous properties when tested for their ability to detonate, deflagrate or explode when heated under defined confinement by the appropriate test methods and criteria in the UN Manual of Tests and Criteria, nor classed as a Division 4.1 (flammable solid) when tested in accordance with the procedures specified in 49 CFR Section 173.124 (chips, if necessary, crushed and sieved to a particle size of less than 1.25 mm), are not subject to the requirements of this manual.",
  "47": "Mixtures of solids which are not subject to this subchapter and flammable liquids may be transported under this entry without first applying the classification criteria of Division 4.1, provided there is no free liquid visible at the time the material is loaded or at the time the packaging or transport unit is closed. Each packaging must correspond to a design type that has passed a leakproofness test at the Packing Group II level. (T-0). Small inner packagings consisting of sealed packets containing less than 10 mL of a Class 3 liquid in Packing Group II or III absorbed onto a solid material are not subject to this subchapter provided there is no free liquid in the packet.",
  "48": "Mixtures of solids which are not subject to this subchapter and toxic liquids may be transported under this entry without first applying the classification criteria of Division 6.1, provided there is no free liquid visible at the time the material is loaded or at the time the packaging or transport unit is closed. Each packaging must correspond to a design type that has passed a leakproofness test at the Packing Group II level. (T-0). This entry may not be used for solids containing a Packing Group I liquid.",
  "49": "Mixtures of solids which are not subject to this subchapter and corrosive liquids may be transported under this entry without first applying the classification criteria of Class 8, provided there is no free liquid visible at the time the material is loaded or at the time the packaging or transport unit is closed. Each packaging must correspond to a design type that has passed a leakproofness test at the Packing Group II level. (T-0).",
  "56": "Ensure a means to interrupt and prevent detonation of the detonator from initiating the detonating cord is installed between each electric detonator and the detonating cord ends of the jet perforating guns.",
  "60": "An oxygen generator, chemical, that is shipped with its means of initiation attached must incorporate at least two positive means of preventing unintentional actuation of the generator, and be classed and approved by the Associate Administrator for Hazardous Materials Safety. (T-0).",
  "62": "Oxygen generators are not authorized for transportation under this entry.",
  "102":
    "This article may be transported as Class 1.4D if all of the conditions specified in 49 CFR Paragraph 173.63(a) are met. Reclassification requires approval by a DOD Explosive Hazard Classification Authority according to A3.3.1.4.",
  "103":
    "Detonators that will not mass detonate and undergo only limited propagation in the shipping package may be assigned to Class 1.4B. Mass detonate means that more than 90 percent of the devices tested in a package explode practically simultaneously. Limited propagation means that if one detonator near the center of a shipping package is exploded, the aggregate weight of explosives, excluding ignition and delay charges, in this and all additional detonators in the outer packaging that explode, may not exceed 25 g. Reclassification requires approval by a DOD Explosive Hazard Classification Authority according to A3.3.1.4.",
  "105":
    'The word "Agents" may be used instead of "Explosives" when approved by the DOT.',
  "106":
    "The recognized name of the particular explosive may be specified in addition to the type.",
  "107":
    "The classification of the substance is expected to vary especially with the particle size and packaging, but the borderlines have not been experimentally determined; verify appropriate classifications following the test procedures in 49 CFR Sections 173.57 and 173.58. Reclassification requires approval by a DOD Explosive Hazard Classification Authority according to A3.3.1.4.",
  "108":
    "Fireworks must be constructed and packaged so that loose pyrotechnic composition is not present in packages during transportation. (T-0).",
  "109":
    'Rocket motors must be nonpropulsive in transportation unless approved according to A3.3.1.4. (T-0). To be considered "nonpropulsive", a rocket motor must be capable of unrestrained burning and must not appreciably move in any direction when ignited by any means. (T-0).',
  "110":
    "Fire extinguishers transported under UN1044 and oxygen cylinders transported for emergency use under UN1072 may include installed actuating cartridges (cartridges, power device of Division 1.4C or 1.4S), without changing the classification of Division 2.2 unless listed as a Class 1 material in the JHCS, provided the aggregate quantity of deflagrating (propellant) explosives does not exceed 3.2 grams per cylinder. Oxygen cylinders with installed actuating cartridges as prepared for transportation must have an effective means of preventing inadvertent activation. (T-0).",
  "111":
    "Explosive substances of Class 1.1A are forbidden for transportation if dry or not desensitized, unless incorporated in a device.",
  "112":
    "Cartridges, Small Arms (1.4S) and Cartridges, Power Devices (used to project fastening devices) (1.4S) may be offered for transportation and transported as limited quantities when authorized and transported in accordance with 49 CFR Section 173.63. Ammunition shipped internationally must be classified as explosives (Class 1) and packaged according to Attachment 5. (T-0). For Class 1 material listed in the JHCS, reclassification requires approval by a DOD Explosive Hazard Classification Authority according to A3.3.1.4.",
  "113":
    "The sample must be given a tentative approval by an agency or laboratory according to the provisions of 49 CFR Section 173.56. (T-0).",
  "115":
    "Boosters with detonator (detonating primers) in which the total explosive charge per unit does not exceed 25 g, and which will not mass detonate and undergo only limited propagation in the shipping package may be assigned to Class 1.4B. Mass detonate means more than 90 percent of the devices tested in a package explode practically simultaneously. Limited propagation means that if one booster near the center of the package is exploded, the aggregate weight of explosives, excluding ignition and delay charges, in this and all additional boosters in the outer packaging that explode may not exceed 25 g. Reclassification requires approval by a DOD Explosive Hazard Classification Authority according to A3.3.1.4.",
  "116":
    "Fuzes, detonating, may be classed in Class 1.4 if the fuzes do not contain more than 25 g of explosive per fuze and are made and packaged so that they will not cause functioning of other fuzes, explosives, or other explosive devices if one of the fuzes detonates in a shipping packaging or in adjacent packages. Reclassification requires approval by a DOD Explosive Hazard Classification Authority according to A3.3.1.4.",
  "117":
    "If a shipment of the explosive substance is to take place at a time that freezing weather is anticipated, the water contained in the explosive substance must be mixed with denatured alcohol so that freezing will not occur. (T-0).",
  "118":
    "This substance may not be transported under the provisions of Division 4.1 unless specifically authorized by the Associate Administrator.",
  "123":
    "Any explosive, blasting, type C containing chlorate must be segregated from explosives containing ammonium nitrate or other ammonium salts. (T-0).",
  "127":
    "Mixtures containing oxidizing and organic materials transported under this entry may not meet the definition and criteria of a Class 1 material.",
  "132":
    "This description may only be used for ammonium nitrate-based compound fertilizers. They must be classified in accordance with the procedure as set out in the Manual of Tests and Criteria, part III, section 39. (T-0).",
  "139":
    'Use of the "special arrangement" proper shipping names for international shipments must be made under an IAEA Certificate of Competent Authority issued by the Associate Administrator in accordance with the requirements in 49 CFR Sections 173.471, 173.472, or 173.473. (T-0). Use of these proper shipping names for domestic shipments may be made only under a DOT special permit.',
  "155":
    "Fish meal, fish scrap and krill meal may not be transported if the temperature at the time of loading either exceeds 35 °C (95 °F), or exceeds 5 °C (41 °F) above the ambient temperature, whichever is higher.",
  "156":
    "Asbestos that is immersed or fixed in a natural or artificial binder material, such as cement, plastic, asphalt, resins or mineral ore, or contained in manufactured products is not subject to the requirements of this manual.",
  "160":
    "This entry applies to safety devices for vehicles, vessels or aircraft, e.g., air bag inflators, air bag modules, seat-belt pretensioners, and pyromechanical devices containing Class 1 (explosive) materials or materials of other hazard classes. These articles must be tested in accordance with Test series 6(c) of Part I of the UN Manual of Tests and Criteria, with no explosion of the device, no fragmentation of device casing or pressure vessel, and no projection hazard or thermal effect that would significantly hinder fire-fighting or other emergency response efforts in the immediate vicinity. (T-0). If the air bag inflator unit satisfactorily passes the series 6(c) test, it is not necessary to repeat the test on the air bag module. This entry does not apply to life saving appliances described in 49 CFR Section 173.219 (UN2990 and UN3072).",
  "162":
    "This material may be transported under the provisions of Division 4.1 only if it is packed so that at no time during transport will the percentage of diluent fall below the percentage that is stated in the shipping description. (T-0).",
  "167":
    "These storage systems must always be considered as containing hydrogen. (T-0). A metal hydride storage system installed in or intended to be installed in a vehicle or equipment or in vehicle or equipment components must be approved for transport by the Associate Administrator. (T-0). A copy of the approval must accompany each shipment. (T-0).",
  "198":
    "Nitrocellulose solutions containing not more than 20% nitrocellulose may be transported as paint or printing ink, perfumery products, as applicable, provided the nitrocellulose contains no more 12.6% nitrogen (by dry mass). See UN1210, UN1263, UN3066, UN3469, and UN3470.",
  "237":
    "This entry may only be used for the transport of non-activated batteries that contain dry potassium hydroxide and that are intended to be activated prior to use by the addition of an appropriate amount of water to the individual cells.",
  "347":
    "Substances and articles assigned to these PSNs must pass Test series 6(d) of Part I of the UN Manual of Tests and Criteria, be shipped under an appropriate CAA/DOT-SP, or must be reclassified as other than 1.4S. (T-0).",
  "367":
    "For the purposes of documentation and package marking: a. The proper shipping name “Paint related material” may be used for consignments of packages containing “Paint” and “Paint related material” in the same package; b. The proper shipping name “Paint related material, corrosive, flammable” may be used for consignments of packages containing “Paint, corrosive, flammable” and “Paint related material, corrosive, flammable” in the same package; c. The proper shipping name “Paint related material, flammable, corrosive” may be used for consignments of packages containing “Paint, flammable, corrosive” and “Paint related material, flammable, corrosive” in the same package; and d. The proper shipping name “Printing ink related material” may be used for consignments of packages containing “Printing ink” and “Printing ink related material” in the same package.",
  "372":
    "This entry applies to asymmetric capacitors with an energy storage capacity greater than 0.3 Wh. Capacitors with an energy storage capacity of 0.3 Wh or less are not subject to the requirements of this manual. Energy storage capacity means the energy stored in a capacitor, as calculated according to the following equation, Wh = 1/2CN(UR2−UL2) × (1/3600) Using the nominal capacitance (CN), rated voltage (UR) and the rated lower limit voltage (UL). Nickel-carbon asymmetric capacitors containing Class 8 alkaline electrolytes must be transported as UN2795, Batteries, wet, filled with alkali, electric storage. (T-0).",
  "387":
    "When chemical stabilization is employed, the person offering the material for transport ensures that the level of stabilization is sufficient to prevent the material as packaged from dangerous polymerization at 50 °C (122 °F). If chemical stabilization becomes ineffective at lower temperatures within the anticipated duration of transport, temperature control is required and is forbidden by aircraft.",
  "389":
    "This entry only applies to lithium ion batteries or lithium metal batteries installed in a cargo transport unit and designed only to provide power external to the cargo transport unit. The lithium batteries must meet the requirements paragraph A3.3.9.2. and contain the necessary systems to prevent overcharge and over discharge between the batteries. (T-0). The batteries must be securely attached to the interior structure of the cargo transport unit (e.g., by means of placement in racks, cabinets, etc.) in such a manner as to prevent short circuits, accidental operation, and significant movement relative to the cargo transport unit under the shocks, loadings, and vibrations normally incident to transport. (T-0). Hazardous materials necessary for the safe and proper operation of the cargo transport unit (e.g., fire extinguishing systems and air conditioning systems), must be properly secured to or installed in the cargo transport unit and are not otherwise subject certification by this manual. (T-0). Hazardous materials not necessary for the safe and proper operation of the cargo transport unit must not be transported within the cargo transport unit. (T-0). The batteries inside the cargo transport unit are not subject to marking or labelling requirements of this manual. Display the UN number in a manner in accordance with 49 CFR Section 172.332 and be marked on two opposite sides of the cargo transport unit. (T-0).",
  A7: "Steel packagings must be corrosion-resistant or have protection against corrosion. (T-0).",
  A8: "For combination packagings, if glass inner packagings (including ampoules) are used, they must be packed with cushioning material in tightly closed metal receptacles before packing in outer packaging's. (T-0).",
  A9: "For combination packages, if plastic bags are used, they must be packed in tightly closed metal receptacles before packing in outer packaging's. (T-0).",
  A10: "When aluminum or aluminum alloy construction materials are used, they must be resistant to corrosion. (T-0).",
  A11: "For combination packaging's, when metal inner packaging's are permitted, only specification cylinders constructed of metals which are compatible with the hazardous material may be used.",
  A37: "This entry applies only to a material meeting the definition in 49 CFR Section 171.8 for self-defense spray.",
  A87: "Engines or machinery which are not fully enclosed by packaging, crates, or other means that prevent ready identification, are not subject to the marking requirements of Attachment 14, the labeling requirements of Attachment 15, or the placarding requirements of Attachment 16.",
  A117: "Wastes containing Category A infectious substances must be assigned to UN2814 or UN2900. (T-0). Wastes transported under UN3291 are wastes containing infectious substances in Category B or wastes that are reasonably believed to have a low probability of containing infectious substances. Decontaminated wastes, which previously contained infectious substances, may be considered as not subject to these Regulations unless the criteria of another Class or Division are met.",
  A501: "P3 does not apply to unit maintenance and support personnel traveling on Special Assignment Airlift Missions.",
  A502: "With approval of Shipper’s HAZMAT service focal point (see paragraph 1.2.2.), may be shipped as P2.",
  A503: "Only Class 2 (non-toxic aerosols only), Class 3 (Packing Group II or III only) and Division 6.1 (Packing Group III only) provided such substances do not have a subsidiary hazard may be shipped to an international (non-domestic) location as a Class 9.",
  A506: "Inner receptacles of a combination package and a single package must be capable of meeting the internal air gauge pressure requirements for a packingGroup III liquid. (T-0).",
  A510: "Emergency power units (EPU) for F-16 aircraft are packaged, marked and labeled in accordance with a DOT-SP, CAA or COE.",
  N6: "Battery fluid packaged with electric storage batteries, wet or dry, must conform to the packaging provisions of A12.4.4.",
  N7: "The hazard class or division number of the material must be marked on the package according to 49 CFR Section 172.302. (T-0). However, the hazard label corresponding to the hazard class or division may be substituted for the marking.",
  N45: "For combination packaging's, copper cartridges are permitted as inner packaging's when the hazardous material is not in dispersion.",
  N65: "Outage must be sufficient to prevent cylinders or spheres from becoming liquid full at 55 degrees C (130 degrees F). (T-0). The vacant space (outage) may be charged with a nonflammable, nonliquefied compressed gas if the pressure in the cylinder or sphere at 55 degrees C (130 degrees F) does not exceed 125 percent of the marked service pressure.",
  N73: "Packagings consisting of outer wooden or fiberboard boxes with inner glass, metal, or other strong containers; metal or fiber drums; kegs or barrels; or strong metal cans are authorized and need not conform to the UN test requirements for domestic shipment.",
  N74: "Packages consisting of tightly closed inner containers of glass, earthenware, metal or polyethylene, capacity not over 0.5 kg (1.1 pounds) securely cushioned and packed in outer wooden barrels or wooden or fiberboard boxes, not over 15 kg (33 pounds) net weight, are authorized and need not conform to the UN test requirements for domestic shipment.",
  N75: "Packages consisting of tightly closed inner packagings of glass, earthenware, or metal, securely cushioned and packed in outer wooden barrels, or wooden or fiberboard boxes, capacity not over 2.5 kg (5.5 pounds) net weight, are authorized and need not conform to the UN test requirements for domestic shipment.",
  N76: "For materials of not more than 25 percent active ingredient by weight, packages consisting of inner metal packagings not greater than 250 ml (8 ounces) capacity each, packed in strong outer packagings together with sufficient absorbent material to completely absorb the liquid contents are authorized and need not conform to the UN test requirements for domestic shipment.",
  N77: "For materials of not more than two percent active ingredients by weight and the liquid contents are absorbed in an inert material, the packagings need not conform to the UN test requirements for domestic shipment.",
  N78: "Packages consisting of inner glass, earthenware, polyethylene, or other nonfragile plastic bottles or jars not over 0.5 kg (1.1 pounds) capacity each, or metal cans not over 5 pounds capacity each, packed in outer wooden boxes, barrels, kegs, or fiberboard boxes, are authorized and need not conform to the UN test requirements for domestic shipments. Net weight of contents in fiberboard boxes may not exceed 29 kg (64 pounds). Net weight of contents in wooden boxes, barrels, or kegs may not exceed 45 kg (99 pounds).",
  N79: "Packages consisting of tightly closed metal inner packagings not over 0.5 kg (1.1 pounds) capacity each, packed in outer wooden or fiberboard boxes, or wooden barrels, are authorized and need not conform to UN test requirements for domestic shipment. Net weight of contents may not exceed 15 kg (33 pounds).",
  N88: "Any metal part of a UN pressure receptacle in contact with the contents may not contain more than 65% copper, with a tolerance of 1%.",
  N89: "When steel UN pressure receptacles are used, only those bearing the “H” mark are authorized.",
};
