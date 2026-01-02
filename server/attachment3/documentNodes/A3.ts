import { DocumentNode } from "../types";

export const Attachment3: DocumentNode = {
  id: "A3.",
  parentId: "AFMAN24-604",
  title: "GENERAL AND HAZARD CLASS SPECIFIC AIR TRANSPORTATION REQUIREMENTS",
  childNodeIds: ["A3.1.", "A3.2.", "A3.3.", "A3.4."],
};

export const A3_1: DocumentNode = {
  id: "A3.1.",
  parentId: "A3.",
  title: "General Packaging Requirements.",
  bodyText: `The general requirements of Attachment 3 are in
  addition to the specific packaging requirements outlined in Attachment 5 through Attachment
  13. Hazardous material packaging must be authorized by this manual, 49 CFR Part 173, ICAO,
  or IATA, and meet the requirements outlined in this attachment. <strong>(T-0).</strong> Comply with specific
  requirements contained in a technical directive governing the packaging or preparation of an
  item, commodity, or article, when stricter than requirements in this manual.`,
  childNodeIds: [
    "A3.1.1.",
    "A3.1.2.",
    "A3.1.3.",
    "A3.1.4.",
    "A3.1.5.",
    "A3.1.6.",
    "A3.1.7.",
    "A3.1.8.",
    "A3.1.9.",
    "A3.1.10.",
    "A3.1.11.",
    "A3.1.12.",
    "A3.1.13.",
    "Table A3.1.",
    "A3.1.14.",
    "A3.1.15.",
    "A3.1.16.",
    "A3.1.17.",
    "Table A3.2.",
  ],
};

export const A3_1_1: DocumentNode = {
  id: "A3.1.1.",
  parentId: "A3.1.",
  title: "United Nations (UN) Performance Specification Packaging.",
  bodyText: `Prepare hazardous
  materials in UN specification containers unless exempted by a specific packaging
  paragraph in this manual. DOD activities use the DOD POP Program to locate tested and
  authorized DOD packaging configurations. If the hazardous material is procured in a
  manufacturer's UN specification container, use that container. Ensure compliance with all
  other requirements of this manual, including air-eligibility. If the managing activity has
  specified a container SPI, use that UN specification container. For additional information
  concerning UN specification packaging or performance test requirements see DLAR
  4145.41/AR 700-143/AFI 24-210_IP/NAVSUPINST 4030.55/MCO 4030.40, Packaging
  of Hazardous Material. Service Focal Points are unable to waive UN specification
  requirements.`,
  childNodeIds: ["A3.1.1.1."],
};

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

export const A3_1_9: DocumentNode = {
  id: "A3.1.9.",
  parentId: "A3.1.",
  title: "Packaging for certain Class/Divisions.",
  bodyText: `A packaging containing a Packing Group III material with a primary or subsidiary hazard
    of Class/Division 4.1, 4.2, 4.3, 5.1, or 8 must meet Packing Group II performance level. <strong>(T-0).</strong>`,
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
export const A3_3: DocumentNode = {
  id: "A3.3.",
  parentId: "A3.",
  title: "General Requirements Applicable to Hazard Class.",
  childNodeIds: [
    "A3.3.1.",
    "A3.3.2.",
    "A3.3.3.",
    "A3.3.4.",
    "A3.3.5.",
    "A3.3.6.",
    "A3.3.7.",
    "A3.3.8.",
    "A3.3.9.",
  ],
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

export const A3_3_2: DocumentNode = {
  id: "A3.3.2.",
  parentId: "A3.3.",
  title: "Class 2.",
  childNodeIds: [
    "A3.3.2.1.",
    "A3.3.2.2.",
    "A3.3.2.3.",
    "A3.3.2.4.",
    "A3.3.2.5.",
    "A3.3.2.6.",
    "A3.3.2.7.",
    "A3.3.2.8.",
    "A3.3.2.9.",
    "A3.3.2.10.",
    "A3.3.2.11.",
    "A3.3.2.12.",
    "A3.3.2.13.",
    "A3.3.2.14.",
    "A3.3.2.15.",
    "A3.3.2.16.",
    "A3.3.2.17.",
  ],
};

export const A3_3_2_1: DocumentNode = {
  id: "A3.3.2.1.",
  parentId: "A3.3.2.",
  title: "General Handling Instructions for All Compressed Gases.",
  bodyText: "The following applies:",
  childNodeIds: ["A3.3.2.1.1.", "A3.3.2.1.2.", "A3.3.2.1.3.", "A3.3.2.1.4."],
};

export const A3_3_2_1_1: DocumentNode = {
  id: "A3.3.2.1.1.",
  parentId: "A3.3.2.1.",
  bodyText:
    "Store compressed gases in a cool, ventilated area away from fire hazards, sources of heat, ignition, or sparks.",
};

export const A3_3_2_1_2: DocumentNode = {
  id: "A3.3.2.1.2.",
  parentId: "A3.3.2.1.",
  bodyText:
    "When stored in an upright position, secure cylinders to fixed supports. Compressed gas cylinders may be palletized for shipment provided the valves are protected and cylinders are adequately secured to the pallet.",
};

export const A3_3_2_1_3: DocumentNode = {
  id: "A3.3.2.1.3.",
  parentId: "A3.3.2.1.",
  bodyText:
    "Exercise care when handling compressed gases. Do not drop, jar, or slide cylinders since the gas may be toxic or asphyxiating. Ensure personnel know the importance of handling compressed gases properly.",
};

export const A3_3_2_1_4: DocumentNode = {
  id: "A3.3.2.1.4.",
  parentId: "A3.3.2.1.",
  bodyText:
    "Ensure valves are always tightly closed and protected before offering for transportation.",
};

export const A3_3_2_2: DocumentNode = {
  id: "A3.3.2.2.",
  parentId: "A3.3.2.",
  title: "Cylinder Requirements.",
  bodyText:
    "Comply with 49 CFR and this manual for shipping compressed gas cylinders, including safety relief devices. Requirements covering cylinders also apply to spherical pressure vessels. Reference DLAI 4145.25/AR 700-68/NAVSUPINST 4440.128D/MCO 10330.2D/AFMAN 23-227_IP for additional data on compressed gas cylinders.",
  childNodeIds: ["A3.3.2.2.1.", "A3.3.2.2.2.", "A3.3.2.2.3."],
};

export const A3_3_2_2_1: DocumentNode = {
  id: "A3.3.2.2.1.",
  parentId: "A3.3.2.2.",
  bodyText:
    "Cylinders or spherical pressure vessels must not contain gases or materials capable of combining chemically so as to endanger their serviceability. <strong>(T-0).</strong> Make sure all cylinders, including closing devices and cushioning materials, are in good condition so that their contents are well protected during transit.",
};

export const A3_3_2_2_2: DocumentNode = {
  id: "A3.3.2.2.2.",
  parentId: "A3.3.2.2.",
  title: "Cylinder Requalification.",
  bodyText:
    "DOT cylinders, UN pressure receptacles, or cylinders bearing a DOT-SP number offered for transportation must meet requalification and marking requirements in accordance with 49 CFR Part 180 and/or terms of the applicable special permit. <strong>(T-0).</strong>",
};

export const A3_3_2_2_3: DocumentNode = {
  id: "A3.3.2.2.3.",
  parentId: "A3.3.2.2.",
  bodyText:
    "Close each cylinder containing poisonous materials with a plug or valve meeting the following requirements:",
  childNodeIds: [
    "A3.3.2.2.3.1.",
    "A3.3.2.2.3.2.",
    "A3.3.2.2.3.3.",
    "A3.3.2.2.3.4.",
  ],
};

export const A3_3_2_2_3_1: DocumentNode = {
  id: "A3.3.2.2.3.1.",
  parentId: "A3.3.2.2.3.",
  bodyText:
    "Each plug or valve must have a taper-threaded connection directly to the cylinder and be capable of withstanding the test pressure of the cylinder. <strong>(T-0).</strong>",
};

export const A3_3_2_2_3_2: DocumentNode = {
  id: "A3.3.2.2.3.2.",
  parentId: "A3.3.2.2.3.",
  bodyText:
    "Each valve must be of the packless type with nonperforated diaphragm, except that for corrosive materials, the valve may be of the packed type, provided the assembly is made gas-tight by means of a seal cap with gasketed joint attached to the valve body of the cylinder to prevent loss of material through or past the packing. <strong>(T-0).</strong>",
};

export const A3_3_2_2_3_3: DocumentNode = {
  id: "A3.3.2.2.3.3.",
  parentId: "A3.3.2.2.3.",
  bodyText:
    "Each valve outlet must be sealed by a threaded cap or threaded solid plug. <strong>(T-0).</strong>",
};

export const A3_3_2_2_3_4: DocumentNode = {
  id: "A3.3.2.2.3.4.",
  parentId: "A3.3.2.2.3.",
  bodyText:
    "Cylinders, valves, plugs, outlet caps, luting, and gaskets must be compatible with each other and with the material. <strong>(T-0).</strong>",
};

export const A3_3_2_3: DocumentNode = {
  id: "A3.3.2.3.",
  parentId: "A3.3.2.",
  title: "Valve Protection.",
  bodyText:
    "Protect all valves of containers charged with compressed gas by one of the following methods:",
  childNodeIds: ["A3.3.2.3.1.", "A3.3.2.3.2.", "A3.3.2.3.3.", "A3.3.2.3.4."],
};

export const A3_3_2_3_1: DocumentNode = {
  id: "A3.3.2.3.1.",
  parentId: "A3.3.2.3.",
  bodyText:
    "By a securely attached metal cap of sufficient strength to protect the valve from injury during transit.",
};

export const A3_3_2_3_2: DocumentNode = {
  id: "A3.3.2.3.2.",
  parentId: "A3.3.2.3.",
  bodyText:
    "By boxing or crating the cylinder or sphere to give proper protection to the valve. The outer packaging must be capable of meeting drop tests specified for Packing Group I. <strong>(T-0).</strong>",
};

export const A3_3_2_3_3: DocumentNode = {
  id: "A3.3.2.3.3.",
  parentId: "A3.3.2.3.",
  bodyText:
    "By recessed valve or otherwise protected valve so that it cannot be subjected to a blow when the container is dropped on a flat surface.",
};

export const A3_3_2_3_4: DocumentNode = {
  id: "A3.3.2.3.4.",
  parentId: "A3.3.2.3.",
  bodyText:
    "The cylinder or vessel is secured as an attached component of a vehicle, equipment, trailer, or cart in a manner that prevents damage to the valve during transit.",
};

export const A3_3_2_4: DocumentNode = {
  id: "A3.3.2.4.",
  parentId: "A3.3.2.",
  title: "Cylinder Orientation.",
  bodyText:
    "Comply with the orientation requirements in DLAI 4145.25/A700-68/NAVSUPINST 4440.128D/MCO 10330.2D/AFMAN 23-227(I), paragraph 5-9. General Storage Requirements. Cylinders that do not have specific orientation requirements according to the above regulation may be oriented as necessary unless orientation instructions are identified elsewhere in this manual.",
};

export const A3_3_2_5: DocumentNode = {
  id: "A3.3.2.5.",
  parentId: "A3.3.2.",
  title: "Multiple-Element Gas Container.",
  bodyText:
    "DOT Specification and UN approved cylinders may be interconnected by a manifold in accordance with 49 CFR Sections 178.74 and 178.75, provided all valves are securely closed.",
};

export const A3_3_2_6: DocumentNode = {
  id: "A3.3.2.6.",
  parentId: "A3.3.2.",
  title: "Pressure and Filling Requirements.",
  bodyText:
    "Ensure the pressure in the container at 21 degrees C (70 degrees F) is not more than the service pressure for which the container is marked or designated, except as provided below.",
  childNodeIds: [
    "A3.3.2.6.1.",
    "A3.3.2.6.2.",
    "A3.3.2.6.3.",
    "A3.3.2.6.4.",
    "A3.3.2.6.5.",
    "Figure A3.1.",
    "A3.3.2.6.6.",
    "A3.3.2.6.7.",
    "Figure A3.2.",
    "A3.3.2.6.8.",
    "Figure A3.3.",
    "Figure A3.4.",
    "Figure A3.5.",
  ],
};

export const A3_3_2_6_1: DocumentNode = {
  id: "A3.3.2.6.1.",
  parentId: "A3.3.2.6.",
  bodyText:
    "When cylinders with a marked pressure limit are prescribed, other cylinders made under the same specification, but with a higher marked service pressure limit are authorized. For example, a cylinder marked DOT 4B500 may be used where DOT 4B300 is specified.",
};

export const A3_3_2_6_2: DocumentNode = {
  id: "A3.3.2.6.2.",
  parentId: "A3.3.2.6.",
  bodyText:
    "The pressure in the cylinder or sphere at 55 degrees C (131 degrees F) must not exceed 1 1/4 times the service pressure except cylinders of acetylene, liquefied nitrous oxide, and liquefied carbon dioxide which must not exceed the allowable charging pressure of the cylinder. <strong>(T-0).</strong>",
};

export const A3_3_2_6_3: DocumentNode = {
  id: "A3.3.2.6.3.",
  parentId: "A3.3.2.6.",
  bodyText:
    "The pressure of a cylinder containing a Hazard Zone A or Hazard Zone B (poisonous material) must not exceed the service pressure of the cylinder at 55 degrees C (131 degrees F). Provide sufficient outage to ensure the cylinder is not liquid full at 55 degrees C (131 degrees F). <strong>(T-0).</strong>",
};

export const A3_3_2_6_4: DocumentNode = {
  id: "A3.3.2.6.4.",
  parentId: "A3.3.2.6.",
  bodyText:
    "Use the service pressure identified for a current specification for containers made before the effective date of specifications.",
};

export const A3_3_2_6_5: DocumentNode = {
  id: "A3.3.2.6.5.",
  parentId: "A3.3.2.6.",
  bodyText:
    "Use the service pressure identified in Figure A3.1. for authorized cylinders not marked with a service pressure.",
};

export const FigureA3_1: DocumentNode = {
  id: "Figure A3.1.",
  parentId: "A3.",
  title: "Cylinder Specification and Service Pressures.",
  bodyText: `
  <table border="1" style="border-collapse: collapse; width: 100%;">
    <thead>
      <tr style="height: 3rem">
        <th>Specification Marking</th>
        <th>Service Pressure (psig)</th>
      </tr>
    </thead>
    <tbody>
      <tr style="height: 2rem">
        <td style="padding: 0.2rem">3</td>
        <td style="padding: 0.2rem">1800</td>
      </tr>
      <tr style="height: 2rem">
        <td style="padding: 0.2rem">3E</td>
        <td style="padding: 0.2rem">1800</td>
      </tr>
      <tr style="height: 2rem">
        <td style="padding: 0.2rem">8</td>
        <td style="padding: 0.2rem">250</td>
      </tr>
    </tbody>
  </table>
  `,
};

export const A3_3_2_6_6: DocumentNode = {
  id: "A3.3.2.6.6.",
  parentId: "A3.3.2.6.",
  bodyText:
    "Except for carbon dioxide, 1.1-Difluoroethylene (R-1132A), nitrous oxide, and vinyl fluoride, inhibited, the liquid portion of a liquefied gas may not completely fill the packaging at any temperature up to and including 54 degrees C (130 degrees F). The liquid portion of vinyl fluoride, inhibited, may completely fill the cylinder at 54 degrees C (130 degrees F) provided the pressure at the critical temperature does not exceed 1 1/4 times the service pressure of the cylinder (see definition for filling density).",
};

export const A3_3_2_6_7: DocumentNode = {
  id: "A3.3.2.6.7.",
  parentId: "A3.3.2.6.",
  bodyText:
    "DOT 3A, 3AX, 3AA, 3AAX, and 3T cylinders may be charged with compressed gases other than liquefied, dissolved, poisonous, or flammable gases to a pressure of 10 percent over their marked service pressure, provided the following conditions are met:",
  childNodeIds: ["A3.3.2.6.7.1.", "A3.3.2.6.7.2.", "A3.3.2.6.7.3."],
};

export const A3_3_2_6_7_1: DocumentNode = {
  id: "A3.3.2.6.7.1.",
  parentId: "A3.3.2.6.7.",
  bodyText:
    "Equip each cylinder with frangible disc safety devices (without fusible metal backing) having a bursting pressure not over the minimum prescribed test pressure.",
};

export const A3_3_2_6_7_2: DocumentNode = {
  id: "A3.3.2.6.7.2.",
  parentId: "A3.3.2.6.7.",
  bodyText:
    "Determine the elastic expansion at the time of the last test or retest by the water-jacket method.",
};

export const A3_3_2_6_7_3: DocumentNode = {
  id: "A3.3.2.6.7.3.",
  parentId: "A3.3.2.6.7.",
  bodyText:
    "Do not exceed either the average wall stress or the maximum wall stress limitations in Figure A3.2.",
};

export const FigureA3_2: DocumentNode = {
  id: "Figure A3.2.",
  parentId: "A3.",
  title: "Wall-Stress Limitations.",
  bodyText: `
  <table border="1" style="border-collapse: collapse; width: 100%;">
    <thead>
      <tr style="height: 4rem">
        <th>Type of Steel</th>
        <th>Average Wall Stress Limitation</th>
        <th>Maximum Wall Stress Limitation</th>
      </tr>
    </thead>
    <tbody>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">Plain carbon steels over 0.35 carbon and medium manganese steels.</td>
        <td style="padding: 0.4rem">53,000</td>
        <td style="padding: 0.4rem">58,000</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">Steels of analysis and heat treatment specified in DOT Specification 3AA.</td>
        <td style="padding: 0.4rem">67,000</td>
        <td style="padding: 0.4rem">73,000</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">Steels of analysis and heat treatment specified in DOT Specification 3T.</td>
        <td style="padding: 0.4rem">87,000</td>
        <td style="padding: 0.4rem">94,000</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">Plain carbon steels less than 0.35 carbon made before 1920.</td>
        <td style="padding: 0.4rem">45,000</td>
        <td style="padding: 0.4rem">48,000</td>
      </tr>
    </tbody>
  </table>
  `,
};

export const A3_3_2_6_8: DocumentNode = {
  id: "A3.3.2.6.8.",
  parentId: "A3.3.2.6.",
  title: "Filling Density.",
  childNodeIds: ["A3.3.2.6.8.1.", "A3.3.2.6.8.2.", "A3.3.2.6.8.3."],
};

export const A3_3_2_6_8_1: DocumentNode = {
  id: "A3.3.2.6.8.1.",
  parentId: "A3.3.2.6.8.",
  title: "Liquefied Petroleum Gases.",
  bodyText:
    "Use Figure A3.3. for filling density requirements of Liquefied Petroleum Gases. Any filling density prescribed in Figure A3.3. may be increased by 2 percent for liquefied petroleum gas in DOT 3 cylinders (or in DOT 3A cylinders marked for 1,800 pounds or higher service pressure, subject to the bullet above).",
};

export const A3_3_2_6_8_2: DocumentNode = {
  id: "A3.3.2.6.8.2.",
  parentId: "A3.3.2.6.8.",
  title: "Cryogenic Liquids of Argon, Helium, Neon, Nitrogen, and Oxygen.",
  bodyText:
    "Use Figure A3.4. for filling density requirements when shipping cryogenic liquids of argon, helium, neon, nitrogen, and oxygen.",
};

export const A3_3_2_6_8_3: DocumentNode = {
  id: "A3.3.2.6.8.3.",
  parentId: "A3.3.2.6.8.",
  title: "Hydrogen.",
  bodyText:
    "Ship hydrogen (minimum 95 percent parahydrogen) according to Figure A3.5.",
};

export const FigureA3_3: DocumentNode = {
  id: "Figure A3.3.",
  parentId: "A3.",
  title: "Filling Density for Liquefied Petroleum Gas.",
  bodyText: `
  <table border="1" style="border-collapse: collapse; width: 100%;">
    <thead>
      <tr style="height: 4rem">
        <th>Minimum Specific Gravity of the Liquid Material at 60 degrees F (15.5 degrees C)</th>
        <th>Maximum Filling Density in Percent of the Water Capacity of the Container</th>
        <th>Minimum Specific Gravity of the Liquid Material at 60 degrees F (15.5 degrees C)</th>
        <th>Maximum Filling Density in Percent of the Water Capacity of the Container</th>
      </tr>
    </thead>
    <tbody>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">0.271-0.289</td>
        <td style="padding: 0.4rem">26</td>
        <td style="padding: 0.4rem">0.504-0.510</td>
        <td style="padding: 0.4rem">42</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">0.290-0.306</td>
        <td style="padding: 0.4rem">27</td>
        <td style="padding: 0.4rem">0.511-0.519</td>
        <td style="padding: 0.4rem">43</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">0.307-0.322</td>
        <td style="padding: 0.4rem">28</td>
        <td style="padding: 0.4rem">0.520-0.527</td>
        <td style="padding: 0.4rem">44</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">0.323-0.338</td>
        <td style="padding: 0.4rem">29</td>
        <td style="padding: 0.4rem">0.528-0.536</td>
        <td style="padding: 0.4rem">45</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">0.339-0.354</td>
        <td style="padding: 0.4rem">30</td>
        <td style="padding: 0.4rem">0.537-0.544</td>
        <td style="padding: 0.4rem">46</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">0.355-0.371</td>
        <td style="padding: 0.4rem">31</td>
        <td style="padding: 0.4rem">0.545-0.552</td>
        <td style="padding: 0.4rem">47</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">0.372-0.398</td>
        <td style="padding: 0.4rem">32</td>
        <td style="padding: 0.4rem">0.553-0.560</td>
        <td style="padding: 0.4rem">48</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">0.399-0.425</td>
        <td style="padding: 0.4rem">33</td>
        <td style="padding: 0.4rem">0.561-0.568</td>
        <td style="padding: 0.4rem">49</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">0.426-0.440</td>
        <td style="padding: 0.4rem">34</td>
        <td style="padding: 0.4rem">0.569-0.576</td>
        <td style="padding: 0.4rem">50</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">0.441-0.452</td>
        <td style="padding: 0.4rem">35</td>
        <td style="padding: 0.4rem">0.577-0.584</td>
        <td style="padding: 0.4rem">51</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">0.453-0.462</td>
        <td style="padding: 0.4rem">36</td>
        <td style="padding: 0.4rem">0.585-0.592</td>
        <td style="padding: 0.4rem">52</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">0.463-0.472</td>
        <td style="padding: 0.4rem">37</td>
        <td style="padding: 0.4rem">0.593-0.600</td>
        <td style="padding: 0.4rem">53</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">0.473-0.480</td>
        <td style="padding: 0.4rem">38</td>
        <td style="padding: 0.4rem">0.601-0.608</td>
        <td style="padding: 0.4rem">54</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">0.481-0.488</td>
        <td style="padding: 0.4rem">39</td>
        <td style="padding: 0.4rem">0.609-0.617</td>
        <td style="padding: 0.4rem">55</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">0.489-0.495</td>
        <td style="padding: 0.4rem">40</td>
        <td style="padding: 0.4rem">0.618-0.626</td>
        <td style="padding: 0.4rem">56</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">0.496-0.503</td>
        <td style="padding: 0.4rem">41</td>
        <td style="padding: 0.4rem">0.627-0.634</td>
        <td style="padding: 0.4rem">57</td>
      </tr>
    </tbody>
  </table>
  `,
};

export const FigureA3_4: DocumentNode = {
  id: "Figure A3.4.",
  parentId: "A3.",
  title: "Filling Density for Cryogenic Liquids Except Hydrogen.",
  bodyText: `
  <table border="1" style="border-collapse: collapse; width: 100%;">
    <thead>
      <tr style="height: 4rem">
        <th>Pressure control valve setting (maximum start-to-discharge pressure, kPa (psig))</th>
        <th>Maximum permitted filling density (percent by weight)</th>
        <th>Air</th>
        <th>Argon</th>
        <th>Nitrogen</th>
        <th>Oxygen</th>
        <th>Helium</th>
        <th>Neon</th>
      </tr>
    </thead>
    <tbody>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">310.3 (45)</td>
        <td style="padding: 0.4rem">82.5</td>
        <td style="padding: 0.4rem">133</td>
        <td style="padding: 0.4rem">76</td>
        <td style="padding: 0.4rem">108</td>
        <td style="padding: 0.4rem">12.5</td>
        <td style="padding: 0.4rem">109</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">517 (75)</td>
        <td style="padding: 0.4rem">80.3</td>
        <td style="padding: 0.4rem">130</td>
        <td style="padding: 0.4rem">74</td>
        <td style="padding: 0.4rem">105</td>
        <td style="padding: 0.4rem">12.5</td>
        <td style="padding: 0.4rem">104</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">724 (105)</td>
        <td style="padding: 0.4rem">78.4</td>
        <td style="padding: 0.4rem">127</td>
        <td style="padding: 0.4rem">72</td>
        <td style="padding: 0.4rem">100</td>
        <td style="padding: 0.4rem">12.5</td>
        <td style="padding: 0.4rem">100</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">1172 (170)</td>
        <td style="padding: 0.4rem">76.2</td>
        <td style="padding: 0.4rem">122</td>
        <td style="padding: 0.4rem">70</td>
        <td style="padding: 0.4rem">96</td>
        <td style="padding: 0.4rem">12.5</td>
        <td style="padding: 0.4rem">92</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">1585.8 (230)</td>
        <td style="padding: 0.4rem">75.1</td>
        <td style="padding: 0.4rem">119</td>
        <td style="padding: 0.4rem">69</td>
        <td style="padding: 0.4rem">92</td>
        <td style="padding: 0.4rem">12.5</td>
        <td style="padding: 0.4rem">85</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">2034 (295)</td>
        <td style="padding: 0.4rem">73.5</td>
        <td style="padding: 0.4rem">115</td>
        <td style="padding: 0.4rem">68</td>
        <td style="padding: 0.4rem">89</td>
        <td style="padding: 0.4rem">12.5</td>
        <td style="padding: 0.4rem">77</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">2482 (360)</td>
        <td style="padding: 0.4rem">70.7</td>
        <td style="padding: 0.4rem">113</td>
        <td style="padding: 0.4rem">65</td>
        <td style="padding: 0.4rem">86</td>
        <td style="padding: 0.4rem">12.5</td>
        <td style="padding: 0.4rem">70</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">3103 (450)</td>
        <td style="padding: 0.4rem">65.9</td>
        <td style="padding: 0.4rem">111</td>
        <td style="padding: 0.4rem">61</td>
        <td style="padding: 0.4rem">81</td>
        <td style="padding: 0.4rem">12.5</td>
        <td style="padding: 0.4rem">65</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">3723 (540)</td>
        <td style="padding: 0.4rem">62.9</td>
        <td style="padding: 0.4rem">107</td>
        <td style="padding: 0.4rem">58</td>
        <td style="padding: 0.4rem">78</td>
        <td style="padding: 0.4rem">12.5</td>
        <td style="padding: 0.4rem">60</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">4309 (625)</td>
        <td style="padding: 0.4rem">60.1</td>
        <td style="padding: 0.4rem">104</td>
        <td style="padding: 0.4rem">55</td>
        <td style="padding: 0.4rem">86</td>
        <td style="padding: 0.4rem">12.5</td>
        <td style="padding: 0.4rem">55</td>
      </tr>
      <tr style="height: 3rem">
        <td colspan="2" style="padding: 0.4rem"><strong>Design Service Temperature</strong></td>
        <td style="padding: 0.4rem"><strong>(degrees F)</strong></td>
        <td style="padding: 0.4rem"><strong>-320</strong></td>
        <td style="padding: 0.4rem"><strong>-320</strong></td>
        <td style="padding: 0.4rem"><strong>-320</strong></td>
        <td style="padding: 0.4rem"><strong>-452</strong></td>
        <td style="padding: 0.4rem"><strong>-411</strong></td>
      </tr>
      <tr style="height: 3rem">
        <td colspan="2" style="padding: 0.4rem"><strong>(degrees C)</strong></td>
        <td style="padding: 0.4rem"><strong>-196</strong></td>
        <td style="padding: 0.4rem"><strong>-196</strong></td>
        <td style="padding: 0.4rem"><strong>-196</strong></td>
        <td style="padding: 0.4rem"><strong>-269</strong></td>
        <td style="padding: 0.4rem"><strong>-246</strong></td>
      </tr>
    </tbody>
  </table>
  `,
};

export const FigureA3_5: DocumentNode = {
  id: "Figure A3.5.",
  parentId: "A3.",
  title: "Filling Density for Cryogenic Liquids of Hydrogen.",
  bodyText: `
  <div style="border: 1px solid black; padding: 0.4rem">
    <table border="1" style="border-collapse: collapse; width: 100%;">
      <thead>
        <tr style="height: 4rem">
          <th>Column 1</th>
          <th>Column 2</th>
        </tr>
      </thead>
      <tbody>
        <tr style="height: 3rem">
          <td style="padding: 0.4rem">Design service temperature</td>
          <td style="padding: 0.4rem">Minus 253 degrees C (-423 degrees F) or colder</td>
        </tr>
        <tr style="height: 3rem">
          <td style="padding: 0.4rem">Maximum permitted filling density, based on cylinder capacity at -253 degrees C (-423 degrees F)(see note)</td>
          <td style="padding: 0.4rem">6.7 percent</td>
        </tr>
        <tr style="height: 3rem">
          <td style="padding: 0.4rem">The pressure control valve must be designed and set to limit the pressure in the cylinder to not more than</td>
          <td style="padding: 0.4rem">117 kPa (17 psig)</td>
        </tr>
      </tbody>
    </table>
    <p style="margin-top: 1rem; font-size: 0.9rem;">
      <strong>Note:</strong> The filling density for hydrogen, cryogenic liquid, is defined as the percent ratio of the weight of lading in a package to the weight of water that the packaging will hold at -253 degrees C (-423 degrees F). The volume of the packaging at -253 degrees C (-423 degrees F) is determined in cubic inches. The volume is converted to pounds of water (1 pound of water = 27.737 cubic inches). Each cylinder must be constructed, insulated, and maintained so that the total rate of venting must not be over 30 standard cubic feet (SCF) of hydrogen per hour during transportation. (<strong>T-0</strong>).
    </p>
  </div>
  `,
};

export const A3_3_2_7: DocumentNode = {
  id: "A3.3.2.7.",
  parentId: "A3.3.2.",
  title: "Cylinders Requiring an Outer Packaging.",
  bodyText: `Ship DOT 2P, 2Q, 3E, 3HT, spherical type 4BA, 4D, 4DA, 4DS, and 39 cylinders in strong outer packaging. Ensure the package is capable of protecting the cylinder and all its parts from deformation or breakage resulting from a 1.2 m (4 foot) drop on a solid concrete or steel floor. DOT 4BA spherical cylinders may be securely mounted on warehouse pallets to provide protection for the spheres and any attachments.`,
};

export const A3_3_2_8: DocumentNode = {
  id: "A3.3.2.8.",
  parentId: "A3.3.2.",
  title: "Mandatory Color-Code Identification.",
  bodyText: `Exact color-code identification of any material contained in a compressed gas cylinder is mandatory for DOD and DLA owned cylinders and must meet MIL-STD-101, Color Code for Pipelines and for Compressed Gas Cylinders. <strong>(T-0).</strong>`,
};

export const A3_3_2_9: DocumentNode = {
  id: "A3.3.2.9.",
  parentId: "A3.3.2.",
  title: "Unregulated Compressed Gases.",
  bodyText: `Compressed gasses in the following items are not regulated:`,
  childNodeIds: [
    "A3.3.2.9.1.",
    "A3.3.2.9.2.",
    "A3.3.2.9.3.",
    "A3.3.2.9.4.",
    "A3.3.2.9.5.",
    "A3.3.2.9.6.",
    "A3.3.2.9.7.",
    "A3.3.2.9.8.",
    "A3.3.2.9.9.",
    "A3.3.2.9.10.",
  ],
};

export const A3_3_2_9_1: DocumentNode = {
  id: "A3.3.2.9.1.",
  parentId: "A3.3.2.9.",
  bodyText: `Inflated tires, when inflated to a pressure not greater than its rated inflation pressure.`,
};

export const A3_3_2_9_2: DocumentNode = {
  id: "A3.3.2.9.2.",
  parentId: "A3.3.2.9.",
  bodyText: `Inflated balls used for sports.`,
};

export const A3_3_2_9_3: DocumentNode = {
  id: "A3.3.2.9.3.",
  parentId: "A3.3.2.9.",
  bodyText: `Aerosols, containing non-flammable gas, with capacity of 50 ml or less.`,
};

export const A3_3_2_9_4: DocumentNode = {
  id: "A3.3.2.9.4.",
  parentId: "A3.3.2.9.",
  bodyText: `Carbonated beverages.`,
};

export const A3_3_2_9_5: DocumentNode = {
  id: "A3.3.2.9.5.",
  parentId: "A3.3.2.9.",
  bodyText: `Refrigerating machines, including dehumidifiers, air conditioners, and components thereof such as precharged tubing containing any of the following:`,
  childNodeIds: ["A3.3.2.9.5.1.", "A3.3.2.9.5.2.", "A3.3.2.9.5.3."],
};

export const A3_3_2_9_5_1: DocumentNode = {
  id: "A3.3.2.9.5.1.",
  parentId: "A3.3.2.9.5.",
  bodyText: `12 kg (25 pounds) or less of nonflammable liquefied gas,`,
};

export const A3_3_2_9_5_2: DocumentNode = {
  id: "A3.3.2.9.5.2.",
  parentId: "A3.3.2.9.5.",
  bodyText: `12 L (3 gallons) or less of Ammonia Solution (UN2672), or`,
};

export const A3_3_2_9_5_3: DocumentNode = {
  id: "A3.3.2.9.5.3.",
  parentId: "A3.3.2.9.5.",
  bodyText: `100 g (4 ounces) or less of a flammable, non-toxic, liquefied gas.`,
};

export const A3_3_2_9_6: DocumentNode = {
  id: "A3.3.2.9.6.",
  parentId: "A3.3.2.9.",
  bodyText: `Shipping containers and systems pressurized according to a technical directive with a non-flammable gas which has an absolute pressure of 40 psia or less inside the container at 20 degrees C (68 degrees F).`,
};

export const A3_3_2_9_7: DocumentNode = {
  id: "A3.3.2.9.7.",
  parentId: "A3.3.2.9.",
  bodyText: `Cylinders considered empty according to A3.1.16.2.`,
};

export const A3_3_2_9_8: DocumentNode = {
  id: "A3.3.2.9.8.",
  parentId: "A3.3.2.9.",
  title: "Accumulators.",
  bodyText: `Articles containing a non-flammable or non-toxic gas intended to function as shock absorbers that are manufactured to industry quality assurance standards; has a gas space capacity less than 1.6 L and a charge pressure not more than 280 bar where product of capacity (liters) and a charge pressure is not more than 80 (e.g., 0.5 L gas space and 160 bar charge pressure = 80); has a minimum burst pressure of 4 times the charge pressure at 20 degrees C, manufactured from a material which will not fragment; and when subject to fire is protected from rupture by degradable seal or pressure release device.`,
};

export const A3_3_2_9_9: DocumentNode = {
  id: "A3.3.2.9.9.",
  parentId: "A3.3.2.9.",
  title: "Passenger Restraint Systems.",
  bodyText: `A cylinder that is a component part of a passenger restraint system installed in a motor vehicle, and meeting the requirements in A6.3.6.`,
};

export const A3_3_2_9_10: DocumentNode = {
  id: "A3.3.2.9.10.",
  parentId: "A3.3.2.9.",
  bodyText: `Articles containing not more than 100 mg of an inert compressed gases (Argon, Helium, Neon, Nitrogen, and Xenon) and packaged so the quantity per package is 1 g or less.`,
};

export const A3_3_2_10: DocumentNode = {
  id: "A3.3.2.10.",
  parentId: "A3.3.2.",
  title: "Non-DOT Specification Cylinders.",
  bodyText: `The following non-DOT specification cylinders may be transported by military airlift.`,
  childNodeIds: [
    "A3.3.2.10.1.",
    "A3.3.2.10.2.",
    "A3.3.2.10.3.",
    "A3.3.2.10.4.",
  ],
};

export const A3_3_2_10_1: DocumentNode = {
  id: "A3.3.2.10.1.",
  parentId: "A3.3.2.10.",
  bodyText: `UN pressure receptacles complying with the requirements of 49 CFR Parts 173, 178. And 180.`,
};

export const A3_3_2_10_2: DocumentNode = {
  id: "A3.3.2.10.2.",
  parentId: "A3.3.2.10.",
  bodyText: `Foreign cylinder (other than UN cylinders) manufactured, inspected, and tested according to 49 CFR Part 178, or a copy of the competent authority approval of the nation manufacturing the cylinder accompanies the shipment. All other requirements of this manual also apply.`,
};

export const A3_3_2_10_3: DocumentNode = {
  id: "A3.3.2.10.3.",
  parentId: "A3.3.2.10.",
  bodyText: `Cylinders issued a DOT Special Permit or Exemption.`,
};

export const A3_3_2_10_4: DocumentNode = {
  id: "A3.3.2.10.4.",
  parentId: "A3.3.2.10.",
  bodyText: `Cylinders marked with the prefix "ICC" (e.g., ICC-4BA240) are authorized in place of cylinders required by this manual with a "DOT" prefix. The cylinders must comply with all other applicable specification requirements for DOT cylinders. <strong>(T-0).</strong>`,
};

export const A3_3_2_11: DocumentNode = {
  id: "A3.3.2.11.",
  parentId: "A3.3.2.",
  title: "Bulk Compressed Gas Tanks.",
  bodyText: `Bulk compressed gas tanks must meet applicable cylinder specification requirements identified in Attachment 6, or be certified to a Competent Authority Approval (CAA), Certification of Equivalency (COE), or a DOT Special Permit (DOT-SP). <strong>(T-0).</strong> If not certified to the above, the tank must be drained, purged, or otherwise considered empty. <strong>(T-0).</strong> Use paragraph A3.1.16. to identify “empty” tanks.`,
};

export const A3_3_2_12: DocumentNode = {
  id: "A3.3.2.12.",
  parentId: "A3.3.2.",
  title: "Cylinders Containing Poisonous Material.",
  bodyText: `Overpack cylinders containing a poisonous material, which have a wall thickness at any point of less than 2.03 mm (0.080 inch) and do not have fitted valve protection, in a strong outer container. The box must meet the requirements of A3.1. <strong>(T-0).</strong> Ensure box and valve protection is of sufficient strength to protect all parts of the cylinder and valve (if it has a valve) from deformation and breakage resulting from a drop of 2.0 m (7 ft) or more onto a concrete or steel floor, impacting at an orientation most likely to cause damage. If the cylinder is not overpacked, equip the cylinder with a protective cap or other means of valve protection sufficient to protect the valve from deformation and breakage resulting from a drop of 2.0 m (7 ft) or more onto a concrete or steel floor, impacting at an orientation most likely to cause damage.`,
};

export const A3_3_2_13: DocumentNode = {
  id: "A3.3.2.13.",
  parentId: "A3.3.2.",
  title: "Mounted Cylinders and Fire Extinguishers.",
  bodyText: `Cylinders, other than those identified in A3.3.2.7, containing non-flammable gases (e.g., oxygen, air, nitrogen) and fire extinguishers may be shipped secured in holders of equipment and protected from possible accidental damage with safety pin/clip installed. Package fire extinguishers not in an approved holder according to A6.7.`,
};

export const A3_3_2_14: DocumentNode = {
  id: "A3.3.2.14.",
  parentId: "A3.3.2.",
  title: "Aircraft Fire Suppression Bottles.",
  bodyText: `Use description “Liquefied Gases, UN1058”; “Compressed Gas, N.O.S., UN1956”; or the hazard classification assigned by the manufacturer for DOT specification 3HT, 4D, 4DA, or 4DS. See paragraph A6.4.1. and Table A6.1.`,
};

export const A3_3_2_15: DocumentNode = {
  id: "A3.3.2.15.",
  parentId: "A3.3.2.",
  title: "Vehicle Fire Suppression Systems.",
  bodyText: `Identify cylinders and pressure vessels which are an integral part of a vehicle fire suppression system and exceed 40 pounds per square inch absolute (psia) at 21 degrees C (70 degrees F) as an accessorial hazard according to A17.5.2.`,
};

export const A3_3_2_16: DocumentNode = {
  id: "A3.3.2.16.",
  parentId: "A3.3.2.",
  title: "Cryogenic Liquids.",
  bodyText: "",
  childNodeIds: ["A3.3.2.16.1.", "A3.3.2.16.2."],
};

export const A3_3_2_16_1: DocumentNode = {
  id: "A3.3.2.16.1.",
  parentId: "A3.3.2.16.",
  title: "Container Requirements:",
  bodyText: "",
  childNodeIds: [
    "A3.3.2.16.1.1.",
    "A3.3.2.16.1.2.",
    "A3.3.2.16.1.3.",
    "A3.3.2.16.1.4.",
    "A3.3.2.16.1.5.",
    "A3.3.2.16.1.6.",
    "A3.3.2.16.1.7.",
    "A3.3.2.16.1.8.",
    "A3.3.2.16.1.9.",
  ],
};

export const A3_3_2_16_1_1: DocumentNode = {
  id: "A3.3.2.16.1.1.",
  parentId: "A3.3.2.16.1.",
  bodyText:
    "Do not load a cylinder with a cryogenic liquid colder than the design service temperature of the packaging.",
};

export const A3_3_2_16_1_2: DocumentNode = {
  id: "A3.3.2.16.1.2.",
  parentId: "A3.3.2.16.1.",
  bodyText:
    "Do not load a cylinder with any material that may combine chemically with any residue in the packaging to produce an unsafe condition.",
};

export const A3_3_2_16_1_3: DocumentNode = {
  id: "A3.3.2.16.1.3.",
  parentId: "A3.3.2.16.1.",
  bodyText:
    "The jacket covering the insulation on a cylinder used to transport any flammable cryogenic liquid must be made of steel. <strong>(T-0).</strong>",
};

export const A3_3_2_16_1_4: DocumentNode = {
  id: "A3.3.2.16.1.4.",
  parentId: "A3.3.2.16.1.",
  bodyText:
    "Do not install a valve or fitting made of aluminum, with internal rubbing or abrading aluminum parts that may come in contact with oxygen in the cryogenic liquid form, on any cylinder used to transport oxygen, cryogenic liquid unless the parts are anodized according to ASTM Standard B 580.",
};

export const A3_3_2_16_1_5: DocumentNode = {
  id: "A3.3.2.16.1.5.",
  parentId: "A3.3.2.16.1.",
  bodyText:
    "Do not install an aluminum valve, pipe, or fitting on any cylinder used to transport any flammable cryogenic liquid.",
};

export const A3_3_2_16_1_6: DocumentNode = {
  id: "A3.3.2.16.1.6.",
  parentId: "A3.3.2.16.1.",
  bodyText: "Provide each cylinder with one or more pressure relief devices.",
};

export const A3_3_2_16_1_7: DocumentNode = {
  id: "A3.3.2.16.1.7.",
  parentId: "A3.3.2.16.1.",
  bodyText:
    "Install each pressure relief device and locate so that the cooling effect of the contents during venting will not prevent effective operation of the device.",
};

export const A3_3_2_16_1_8: DocumentNode = {
  id: "A3.3.2.16.1.8.",
  parentId: "A3.3.2.16.1.",
  bodyText:
    "The maximum weight of the contents in a cylinder with a design service temperature colder than -195.5 degrees C (-320 degrees F) may not be over the design weight marked on the cylinder.",
};

export const A3_3_2_16_1_9: DocumentNode = {
  id: "A3.3.2.16.1.9.",
  parentId: "A3.3.2.16.1.",
  bodyText:
    "Each cylinder containing a cryogenic liquid must have a pressure control system that conforms to 49 CFR Section 173.316 and must be designed and installed so that it will prevent the cylinder from becoming liquid full. <strong>(T-0).</strong>",
};

export const A3_3_2_16_2: DocumentNode = {
  id: "A3.3.2.16.2.",
  parentId: "A3.3.2.16.",
  title: "Venting Requirements.",
  bodyText:
    "Protect all containers by vent openings or safety relief devices to prevent excessive pressure buildup within the containers. The shipper must provide required equipment and specific venting instructions in the additional handling information block of the Shipper's Declaration for Dangerous Goods (see A17.5.2.), unless venting procedures are provided in a separate instruction accompanying the shipment or attached to the cargo. <strong>(T-0).</strong> Crew members monitor vent valves during flight.",
  childNodeIds: [
    "A3.3.2.16.2.1.",
    "A3.3.2.16.2.2.",
    "A3.3.2.16.2.3.",
    "A3.3.2.16.2.4.",
  ],
};

export const A3_3_2_16_2_1: DocumentNode = {
  id: "A3.3.2.16.2.1.",
  parentId: "A3.3.2.16.2.",
  bodyText:
    "Provide at least 4.6 m (15 feet) of 25.4 mm (one inch) inside diameter tubing or hose compatible with the product. Do not use rubber tubing for liquid oxygen.",
};

export const A3_3_2_16_2_2: DocumentNode = {
  id: "A3.3.2.16.2.2.",
  parentId: "A3.3.2.16.2.",
  bodyText:
    "Provide sufficient clamps to attach tubing to the unit, the aircraft vent adapter, and other hoses if more than one unit is transported. Do not use sealing compound on tubing or hose connections.",
};

export const A3_3_2_16_2_3: DocumentNode = {
  id: "A3.3.2.16.2.3.",
  parentId: "A3.3.2.16.2.",
  bodyText:
    "Provide T fittings and extra tubing or hose for the manifolding of two or more units to one aircraft vent. Route tubing or hose to ensure freedom from kinks, sharp bends, or restrictions that prevent free venting and cause pressure buildup in the tubing or hose.",
};

export const A3_3_2_16_2_4: DocumentNode = {
  id: "A3.3.2.16.2.4.",
  parentId: "A3.3.2.16.2.",
  bodyText:
    "Small containers (net capacity of 25 liters (6.6 gallons) or less) charged with a nonflammable, nonpoisonous cryogenic liquid, are excepted from the overboard venting requirement.",
};

export const A3_3_2_17: DocumentNode = {
  id: "A3.3.2.17.",
  parentId: "A3.3.2.",
  title: "Fuel Cell Cartridges.",
  bodyText: "",
  childNodeIds: ["A3.3.2.17.1.", "A3.3.2.17.2."],
};

export const A3_3_2_17_1: DocumentNode = {
  id: "A3.3.2.17.1.",
  parentId: "A3.3.2.17.",
  bodyText:
    "Except for fuel cell cartridges containing hydrogen in metal hydride, each fuel cell cartridge design type including when contained in or packed with equipment, must pass a 1.2 meter (3.9 feet) drop test onto an unyielding surface in the orientation most likely to result in the failure of the containment system with no loss of contents. <strong>(T-0).</strong> Fuel cell cartridges installed in or integral to a fuel cell system are regarded as contained in equipment.",
  childNodeIds: ["A3.3.2.17.1.1.", "A3.3.2.17.1.2.", "A3.3.2.17.1.3."],
};

export const A3_3_2_17_1_1: DocumentNode = {
  id: "A3.3.2.17.1.1.",
  parentId: "A3.3.2.17.1.",
  bodyText:
    "Be capable of withstanding, without leakage or bursting, a pressure of at least two times the equilibrium pressure of the contents at 55 °C (131 °F);",
};

export const A3_3_2_17_1_2: DocumentNode = {
  id: "A3.3.2.17.1.2.",
  parentId: "A3.3.2.17.1.",
  bodyText:
    "Contain no more than 200 mL of liquefied flammable gas with a vapor pressure not exceeding 1,000 kPa (150 psig) at 55 °C (131 °F); and",
};

export const A3_3_2_17_1_3: DocumentNode = {
  id: "A3.3.2.17.1.3.",
  parentId: "A3.3.2.17.1.",
  bodyText:
    "Pass the hot water bath test prescribed in accordance with 49 CFR Subparagraph 173.306(a)(3)(v). <strong>(T-0).</strong>",
};

export const A3_3_2_17_2: DocumentNode = {
  id: "A3.3.2.17.2.",
  parentId: "A3.3.2.17.",
  bodyText:
    "Fuel cell cartridges containing hydrogen in a metal hydride must conform to the following:",
  childNodeIds: [
    "A3.3.2.17.2.1.",
    "A3.3.2.17.2.2.",
    "A3.3.2.17.2.3.",
    "A3.3.2.17.2.4.",
    "A3.3.2.17.2.5.",
    "A3.3.2.17.2.6.",
    "A3.3.2.17.2.7.",
  ],
};

export const A3_3_2_17_2_1: DocumentNode = {
  id: "A3.3.2.17.2.1.",
  parentId: "A3.3.2.17.2.",
  bodyText: "Have a water capacity less than or equal to 120 mL.",
};

export const A3_3_2_17_2_2: DocumentNode = {
  id: "A3.3.2.17.2.2.",
  parentId: "A3.3.2.17.2.",
  bodyText:
    "The pressure in the fuel cell cartridge must not exceed 5 MPa at 55 degrees C.",
};

export const A3_3_2_17_2_3: DocumentNode = {
  id: "A3.3.2.17.2.3.",
  parentId: "A3.3.2.17.2.",
  bodyText:
    "The design must withstand, without leaking or bursting, a pressure of two times the design pressure of the cartridge at 55 degrees C or 200 kPa more than the design pressure of the design pressure of the cartridge at 55 degrees C, whichever is greater.",
};

export const A3_3_2_17_2_4: DocumentNode = {
  id: "A3.3.2.17.2.4.",
  parentId: "A3.3.2.17.2.",
  bodyText:
    "Each fuel cell cartridge must be filled in accordance with the procedure provided by the manufacturer.",
};

export const A3_3_2_17_2_5: DocumentNode = {
  id: "A3.3.2.17.2.5.",
  parentId: "A3.3.2.17.2.",
  bodyText:
    "Each fuel cell cartridge must contain the following permanent markings:",
  childNodeIds: ["A3.3.2.17.2.5.1.", "A3.3.2.17.2.5.2.", "A3.3.2.17.2.5.3."],
};

export const A3_3_2_17_2_5_1: DocumentNode = {
  id: "A3.3.2.17.2.5.1.",
  parentId: "A3.3.2.17.2.5.",
  bodyText: "Rated charging pressure in megapascals (MPa).",
};

export const A3_3_2_17_2_5_2: DocumentNode = {
  id: "A3.3.2.17.2.5.2.",
  parentId: "A3.3.2.17.2.5.",
  bodyText: "Manufacturers serial number or unique identification number.",
};

export const A3_3_2_17_2_5_3: DocumentNode = {
  id: "A3.3.2.17.2.5.3.",
  parentId: "A3.3.2.17.2.5.",
  bodyText: "Date of expiration based on the maximum service life.",
};

export const A3_3_2_17_2_6: DocumentNode = {
  id: "A3.3.2.17.2.6.",
  parentId: "A3.3.2.17.2.",
  bodyText:
    "Each fuel cell cartridge must pass the following design type tests:",
  childNodeIds: ["A3.3.2.17.2.6.1.", "A3.3.2.17.2.6.2.", "A3.3.2.17.2.6.3."],
};

export const A3_3_2_17_2_6_1: DocumentNode = {
  id: "A3.3.2.17.2.6.1.",
  parentId: "A3.3.2.17.2.6.",
  title: "Drop test.",
  bodyText:
    "A 1.8 m drop test onto an unyielding surface in four different orientations.",
  childNodeIds: [
    "A3.3.2.17.2.6.1.1.",
    "A3.3.2.17.2.6.1.2.",
    "A3.3.2.17.2.6.1.3.",
    "A3.3.2.17.2.6.1.4.",
  ],
};

export const A3_3_2_17_2_6_1_1: DocumentNode = {
  id: "A3.3.2.17.2.6.1.1.",
  parentId: "A3.3.2.17.2.6.1.",
  bodyText: "On the vertical end containing the shut-off valve assembly.",
};

export const A3_3_2_17_2_6_1_2: DocumentNode = {
  id: "A3.3.2.17.2.6.1.2.",
  parentId: "A3.3.2.17.2.6.1.",
  bodyText: "On the vertical end opposite to the shut-off valve assembly.",
};

export const A3_3_2_17_2_6_1_3: DocumentNode = {
  id: "A3.3.2.17.2.6.1.3.",
  parentId: "A3.3.2.17.2.6.1.",
  bodyText:
    "Horizontally, onto a steel apex with a diameter of 38 mm, with the steel apex in the upward position.",
};

export const A3_3_2_17_2_6_1_4: DocumentNode = {
  id: "A3.3.2.17.2.6.1.4.",
  parentId: "A3.3.2.17.2.6.1.",
  bodyText: "At a 45 degree angle on the end containing the shut-off valve.",
};

export const A3_3_2_17_2_6_2: DocumentNode = {
  id: "A3.3.2.17.2.6.2.",
  parentId: "A3.3.2.17.2.6.",
  title: "Fire test.",
  bodyText:
    "The fuel cells cartridge design may include a vent and be subject to one of the following fire tests:",
  childNodeIds: ["A3.3.2.17.2.6.2.1.", "A3.3.2.17.2.6.2.2."],
};

export const A3_3_2_17_2_6_2_1: DocumentNode = {
  id: "A3.3.2.17.2.6.2.1.",
  parentId: "A3.3.2.17.2.6.2.",
  bodyText:
    "The internal pressure vents to zero gauge pressure without rupture of the cartridge.",
};

export const A3_3_2_17_2_6_2_2: DocumentNode = {
  id: "A3.3.2.17.2.6.2.2.",
  parentId: "A3.3.2.17.2.6.2.",
  bodyText:
    "The cartridge withstands the fire for a minimum of 20 minutes without rupture.",
};

export const A3_3_2_17_2_6_3: DocumentNode = {
  id: "A3.3.2.17.2.6.3.",
  parentId: "A3.3.2.17.2.6.",
  title: "Hydrogen cycling test.",
  bodyText:
    "A fuel cell cartridge must be subjected to a hydrogen cycling test described in 49 CFR Subparagraph 173.230(d)(5)(iii), to ensure that the design stress limits are not exceeded during use.",
};

export const A3_3_2_17_2_7: DocumentNode = {
  id: "A3.3.2.17.2.7.",
  parentId: "A3.3.2.17.2.",
  title: "Production leak test.",
  bodyText:
    "Each fuel cell cartridge must be tested for leaks at 15 °C ± 5 °C (59 °F ± 9 °F) while pressurized to its rated charging pressure. There must be no leakage. Leakage must be determined using a soap bubble solution or other equivalent means on all possible leak locations. <strong>(T-0).</strong>",
};

export const A3_3_3: DocumentNode = {
  id: "A3.3.3.",
  parentId: "A3.3.",
  title: "Class 3.",
  childNodeIds: [
    "A3.3.3.1.",
    "A3.3.3.2.",
    "A3.3.3.3.",
    "A3.3.3.4.",
    "A3.3.3.5.",
    "A3.3.3.6.",
    "A3.3.3.7.",
    "A3.3.3.8.",
    "A3.3.3.9.",
  ],
};

export const A3_3_3_1: DocumentNode = {
  id: "A3.3.3.1.",
  parentId: "A3.3.3.",
  title: "General Handling Instructions.",
  bodyText:
    "Store flammable liquids in cool, well-ventilated areas. Do not store near sources of heat, flames, sparks, combustible materials, or oxidizing agents. Keep containers tightly closed to prevent the evaporation of flammable liquids. Although classed as a flammable liquid, some materials in this attachment may also be described as corrosive or toxic. In the event of leakage or spillage, use rubber gloves, goggles, aprons, and respirators.",
};

export const A3_3_3_2: DocumentNode = {
  id: "A3.3.3.2.",
  parentId: "A3.3.3.",
  title: "Combustible Liquids.",
  bodyText:
    "The requirements in this manual does not apply to materials classed as combustible liquids with the following Exceptions:",
  childNodeIds: ["A3.3.3.2.1.", "A3.3.3.2.2.", "A3.3.3.2.3."],
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

export const A3_3_3_2_3: DocumentNode = {
  id: "A3.3.3.2.3.",
  parentId: "A3.3.3.2.",
  bodyText:
    "Use the same fuel level requirements specified in Attachment 13 for flammable liquids when a combustible liquid is used as fuel for a vehicle, selfpropelled item, or SE.",
};

export const A3_3_3_3: DocumentNode = {
  id: "A3.3.3.3.",
  parentId: "A3.3.3.",
  title: "Fuel for Vehicles and Equipment.",
  bodyText:
    "Transport fuel needed to operate vehicles and equipment at the deployment site in air-eligible UN specification containers listed in paragraph A7.2. If required, stow these containers in the vehicle or equipment according to paragraph 1.8. The following applies when using jerricans:",
  childNodeIds: ["A3.3.3.3.1.", "A3.3.3.3.2.", "A3.3.3.3.3.", "A3.3.3.3.4."],
};

export const A3_3_3_3_1: DocumentNode = {
  id: "A3.3.3.3.1.",
  parentId: "A3.3.3.3.",
  bodyText:
    "Allow sufficient ullage (outage) and tightly secure jerrican caps to prevent leakage.",
};

export const A3_3_3_3_2: DocumentNode = {
  id: "A3.3.3.3.2.",
  parentId: "A3.3.3.3.",
  bodyText:
    "Secure jerricans in permanently configured and approved holders on vehicles or equipment. If secured in this manner, they may be considered an accessorial hazard, and included in Key 19 of the Shipper’s Declaration of Dangerous Goods (see A17.5.3.1.).",
};

export const A3_3_3_3_3: DocumentNode = {
  id: "A3.3.3.3.3.",
  parentId: "A3.3.3.3.",
  bodyText:
    "DOT 5L jerricans are not authorized for air shipment of fuel, and must be drained to the greatest extent possible. <strong>(T-0).</strong>",
};

export const A3_3_3_3_4: DocumentNode = {
  id: "A3.3.3.3.4.",
  parentId: "A3.3.3.3.",
  bodyText:
    "UN specification jerricans (not in an approved holder) may be shipped palletized, loaded and secured on a vehicle, or floor loaded. Prepare a separate Shipper’s Declaration of Dangerous Goods according to Attachment 17.",
};

export const A3_3_3_4: DocumentNode = {
  id: "A3.3.3.4.",
  parentId: "A3.3.3.",
  title: "Fuel-in-Tank Limitations.",
  bodyText:
    "Limit fuel in vehicles, self-propelled units, wheeled engine-powered SE, and all other types of SE to a minimum. Commanders consider availability of fuel at the destination and operational requirements for mission readiness when determining fuel levels and ship with less than the maximum allowable amount when possible. Units transported under the provisions of chapter 3 may contain additional quantities of fuel in tank according to the appropriate packaging paragraph, based on operational necessity. During redeployments, unless mission readiness is affected, limit fuel in tank to a minimum. The preparer (certifying official) ensures any unnecessary fuel is drained prior to shipment. See Attachment 17 for certification requirements.",
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

export const A3_3_3_6: DocumentNode = {
  id: "A3.3.3.6.",
  parentId: "A3.3.3.",
  title: "Equipment Fuel Leakers.",
  bodyText:
    "The shipper is responsible for ensuring the maximum allowable fuel-in-tank is not exceeded, the amount of fuel is necessary to meet operational requirements for mission readiness, and the equipment is prepared properly to prevent leakage. Measure the fuel quantity on a level surface. The following items are considered fuel leakers and must be drained of fuel:",
  childNodeIds: [
    "A3.3.3.6.1.",
    "A3.3.3.6.2.",
    "A3.3.3.6.3.",
    "A3.3.3.6.4.",
    "A3.3.3.6.5.",
    "A3.3.3.6.6.",
  ],
};

export const A3_3_3_6_1: DocumentNode = {
  id: "A3.3.3.6.1.",
  parentId: "A3.3.3.6.",
  title: "MC-1A and MC-2A compressors.",
  bodyText:
    "The MC-1A model 2MC-1A, T.O. 34Y1-56-71, CAGE 16004, part number 66950, NSN 4310-01-060-0642 is not considered a leaker and may be shipped with fuel-in-tank according to Chapter 3. Identify the item nomenclature on the Shipper's Declaration form as '2MC-1A'. Units must stencil '2MC-1A' on the item.",
};

export const A3_3_3_6_2: DocumentNode = {
  id: "A3.3.3.6.2.",
  parentId: "A3.3.3.6.",
  bodyText: "MA-3 air conditioner.",
};

export const A3_3_3_6_3: DocumentNode = {
  id: "A3.3.3.6.3.",
  parentId: "A3.3.3.6.",
  bodyText: "H-1 heater.",
};

export const A3_3_3_6_4: DocumentNode = {
  id: "A3.3.3.6.4.",
  parentId: "A3.3.3.6.",
  bodyText:
    "The USCSMK Boston Whaler boat. The United States Navy Patrol Boat Light (PBL) is not considered a leaker and may be shipped with fuel-in-tank as authorized according to this manual.",
};

export const A3_3_3_6_5: DocumentNode = {
  id: "A3.3.3.6.5.",
  parentId: "A3.3.3.6.",
  bodyText: "The USMC River Assault Craft (RAC).",
};

export const A3_3_3_6_6: DocumentNode = {
  id: "A3.3.3.6.6.",
  parentId: "A3.3.3.6.",
  bodyText: "All commercial SE. <strong>(T-0).</strong>",
};

export const A3_3_3_7: DocumentNode = {
  id: "A3.3.3.7.",
  parentId: "A3.3.3.",
  title: "Pads and Swabs.",
  bodyText:
    "Pads, swabs, rags, and similar items soaked with a flammable liquid and sealed in a bag are not subject to the requirements of this manual provided there is no free liquid and each bag or packet contains no more than 10 ml of a flammable liquid in PG II or PG III. If a bag or packet contains an item(s) soaked with PG I flammable liquid or soaked with more than 10 ml of a PG II or PG III flammable liquid refer to requirements for 'Solids Containing Flammable Liquids, N.O.S.', UN3175.",
};

export const A3_3_3_8: DocumentNode = {
  id: "A3.3.3.8.",
  parentId: "A3.3.3.",
  title: "Alcoholic Beverages.",
  bodyText:
    "Alcoholic beverages in packagings of five liters or less are not subject to the requirements of this manual.",
};

export const A3_3_3_9: DocumentNode = {
  id: "A3.3.3.9.",
  parentId: "A3.3.3.",
  title: "Fuel Cell Cartridges.",
  bodyText:
    "Fuel cell cartridges design types using liquids as fuels must pass an internal pressure test at a pressure of 15 psig (100 kPa (gauge) without leakage. <strong>(T-0).</strong> Each fuel cell cartridge design type must pass a 1.2 m drop test onto an unyielding surface in the orientation most likely to result in failure of the containment system with no loss to the contents. <strong>(T-0).</strong>",
};

export const A3_3_4: DocumentNode = {
  id: "A3.3.4.",
  parentId: "A3.3.",
  title: "Class 4.",
  childNodeIds: [
    "A3.3.4.1.",
    "A3.3.4.2.",
    "A3.3.4.3.",
    "A3.3.4.4.",
    "A3.3.4.5.",
    "A3.3.4.6.",
  ],
};

export const A3_3_4_1: DocumentNode = {
  id: "A3.3.4.1.",
  parentId: "A3.3.4.",
  title: "General Handling Instructions.",
  bodyText: `Class/Division 4.1 material containing self-reactive substances must be protected from direct sunlight and stored in a cool and well-ventilated location, away from all sources of heat.
    Do not store near corrosives (Class 8). Tightly and securely close all containers.
    These items may be water reactive and spontaneously combustible.
    Do not pack Class 4 material in the same outer packaging with corrosive liquids,
    unless the corrosive liquids are in bottles cushioned by incombustible, non-reactive absorbent material.
    Place the cushioned bottles in tightly closed metal containers.
    Material in quantities not over 118 ml (4 ounces) in securely closed metal cans can be packed
    for military air transport in the same compartment with other securely packed materials necessary for a complete fumigant.`,
};

export const A3_3_4_2: DocumentNode = {
  id: "A3.3.4.2.",
  parentId: "A3.3.4.",
  title: "Packaging.",
  bodyText: `Unless otherwise specified by a packaging paragraph, package a material identified as PG III in Table A4.1.
    in a container that meets the PG I or II performance level.`,
};

export const A3_3_4_3: DocumentNode = {
  id: "A3.3.4.3.",
  parentId: "A3.3.4.",
  title: "Flameless Ration Heaters (FRH).",
  bodyText: `FRH containing 8 grams or less of a magnesium-iron alloy (e.g., magnesium powder),
    packaged as a component of meals-ready-to-eat are not subject to the requirements of this manual
    (see paragraph A3.2.1.1). This exception does not apply to a heater that is packaged separately from a meal
    or that contains more than 8 grams of a magnesium-iron alloy.`,
};

export const A3_3_4_4: DocumentNode = {
  id: "A3.3.4.4.",
  parentId: "A3.3.4.",
  title: "Charcoal Briquettes.",
  bodyText: `Lump charcoal briquettes, packaged in a form suitable for consumer use,
    generally do not meet the classifying criteria of a Class 4.2 spontaneously combustible material.
    If the charcoal briquettes do not meet the definition of a Class 4.2 material,
    it is not subject to any other requirements of this manual.
    Ensure the specific type and form of charcoal being shipped does not meet the definition
    of a Class 4.2 material and passed the self-heating test for carbon (which indicates that it is not spontaneously combustible).`,
};

export const A3_3_4_5: DocumentNode = {
  id: "A3.3.4.5.",
  parentId: "A3.3.4.",
  title: "Fusee.",
  bodyText: `The PSN "FUSEE" is only valid for domestic movement.
    For international shipment use the PSN "SIGNAL DEVICES, HAND" and package the material as required
    by the packaging paragraph for signal devices, hand.`,
};

export const A3_3_4_6: DocumentNode = {
  id: "A3.3.4.6.",
  parentId: "A3.3.4.",
  title: "Fuel Cell Cartridges.",
  bodyText: "",
  childNodeIds: ["A3.3.4.6.1.", "A3.3.4.6.2.", "A3.3.4.6.3."],
};

export const A3_3_4_6_1: DocumentNode = {
  id: "A3.3.4.6.1.",
  parentId: "A3.3.4.6.",
  bodyText: `Fuel cell cartridges design types using liquids as fuels must pass an internal pressure test
    at a pressure of 15 psig (100 kPa (gauge) without leakage.`,
};

export const A3_3_4_6_2: DocumentNode = {
  id: "A3.3.4.6.2.",
  parentId: "A3.3.4.6.",
  bodyText: `Each fuel cell cartridge design type must pass a 1.2 m drop test onto an unyielding surface
    in the orientation most likely to result in failure of the containment system with no loss to the contents.`,
};

export const A3_3_4_6_3: DocumentNode = {
  id: "A3.3.4.6.3.",
  parentId: "A3.3.4.6.",
  bodyText: `May contain an activator provided it is fitted with two independent means of preventing
    unintended mixing with the fuel during transport.`,
};

export const A3_3_5: DocumentNode = {
  id: "A3.3.5.",
  parentId: "A3.3.",
  title: "Class 5.",
  childNodeIds: ["A3.3.5.1.", "A3.3.5.2.", "A3.3.5.3.", "A3.3.5.4."],
};

export const A3_3_5_1: DocumentNode = {
  id: "A3.3.5.1.",
  parentId: "A3.3.5.",
  title: "General Handling Instructions.",
  bodyText:
    "Organic Peroxides must be protected from direct sunlight and stored in a cool and well-ventilated location, away from all sources of heat. <strong>(T-0).</strong>",
};

export const A3_3_5_2: DocumentNode = {
  id: "A3.3.5.2.",
  parentId: "A3.3.5.",
  title: "Packed with Other Materials.",
  bodyText:
    "Do not pack Class 5 materials in the same outer packaging with corrosive liquids, unless the corrosive liquids are in bottles cushioned by incombustible absorbent material in tightly closed metal containers. Class 5 materials in securely closed metal cans and in quantities not over 118 ml (4 ounces), are acceptable for air shipment if packed in the same compartment with other securely packed materials necessary for a complete fumigant.",
};

export const A3_3_5_3: DocumentNode = {
  id: "A3.3.5.3.",
  parentId: "A3.3.5.",
  title: "Packaging.",
  bodyText:
    "Unless otherwise specified by a packaging paragraph, package a material identified as PG III in Table A4.1. in a container that meets the PG I or II performance level.",
};

export const A3_3_5_4: DocumentNode = {
  id: "A3.3.5.4.",
  parentId: "A3.3.5.",
  title: "Control and Emergency Temperature.",
  bodyText:
    'Packaged items in Class 5.2 may require controlled temperature conditions during shipment. Table A9.1. lists the "control temperatures" for specific organic peroxide items (by technical name), when applicable, in column 8.',
  childNodeIds: ["A3.3.5.4.1.", "A3.3.5.4.2.", "A3.3.5.4.3."],
};

export const A3_3_5_4_1: DocumentNode = {
  id: "A3.3.5.4.1.",
  parentId: "A3.3.5.4.",
  bodyText:
    "The control temperature is the temperature above which a material may not be offered for transportation.",
};

export const A3_3_5_4_2: DocumentNode = {
  id: "A3.3.5.4.2.",
  parentId: "A3.3.5.4.",
  bodyText:
    "The emergency temperature is the temperature at which emergency procedures must be initiated due to imminent danger resulting from overheating of the shipment. <strong>(T-0).</strong>",
};

export const A3_3_5_4_3: DocumentNode = {
  id: "A3.3.5.4.3.",
  parentId: "A3.3.5.4.",
  bodyText:
    "Guidance for packaging medical materiel requiring temperature control during shipment is contained in DLAI 4145.21/TB MED284/NAVSUPINST 4610.31, Preparation of Medical Materiel Requiring Freeze or Chill Environment for Shipment.",
};

export const A3_3_6: DocumentNode = {
  id: "A3.3.6.",
  parentId: "A3.3.",
  title: "Class 6.",
  childNodeIds: ["A3.3.6.1.", "A3.3.6.2.", "A3.3.6.3."],
};

export const A3_3_6_1: DocumentNode = {
  id: "A3.3.6.1.",
  parentId: "A3.3.6.",
  title: "General Handling Instructions.",
  childNodeIds: [
    "A3.3.6.1.1.",
    "A3.3.6.1.2.",
    "A3.3.6.1.3.",
    "A3.3.6.1.4.",
    "A3.3.6.1.5.",
    "A3.3.6.1.6.",
    "A3.3.6.1.7.",
  ],
};

export const A3_3_6_1_1: DocumentNode = {
  id: "A3.3.6.1.1.",
  parentId: "A3.3.6.1.",
  title:
    "Toxic material can react through the skin, respiratory tract, or gastrointestinal tract.",
  bodyText: `In general, solid toxic material that is improperly packaged presents an ingestion hazard.
    Dust and mists result primarily in an inhalation hazard. Liquids may be ingested,
    inhaled as a vapor, or absorbed through the skin.`,
};

export const A3_3_6_1_2: DocumentNode = {
  id: "A3.3.6.1.2.",
  parentId: "A3.3.6.1.",
  title: undefined,
  bodyText: `Keep cool and away from direct rays of the sun and high temperature.
    Store away from sources of ignition and fire hazards. Avoid direct contact with
    the material. Mark storage areas with the appropriate placards.`,
};

export const A3_3_6_1_3: DocumentNode = {
  id: "A3.3.6.1.3.",
  parentId: "A3.3.6.1.",
  title: undefined,
  bodyText: `Keep away from oxidizing materials.`,
};

export const A3_3_6_1_4: DocumentNode = {
  id: "A3.3.6.1.4.",
  parentId: "A3.3.6.1.",
  title: undefined,
  bodyText: `Make sure personnel exposed to leaking materials wear a protective mask or
    self-contained breathing apparatus (specific recommendations can be obtained from the medical services).`,
};

export const A3_3_6_1_5: DocumentNode = {
  id: "A3.3.6.1.5.",
  parentId: "A3.3.6.1.",
  title: undefined,
  bodyText: `Store away from acids or acid fumes.`,
};

export const A3_3_6_1_6: DocumentNode = {
  id: "A3.3.6.1.6.",
  parentId: "A3.3.6.1.",
  title: undefined,
  bodyText: `Do not place any liquid toxic material on the same 463L pallet with foodstuffs or rations.`,
};

export const A3_3_6_1_7: DocumentNode = {
  id: "A3.3.6.1.7.",
  parentId: "A3.3.6.1.",
  title: undefined,
  bodyText: `Handle toxins containing infectious agents meeting the criteria for inclusion as a Division 6.2 material
    as Category A Infectious substances UN2814 or UN2900. Handle all other toxins extracted from living sources
    as UN3172 or UN3462.`,
};

export const A3_3_6_2: DocumentNode = {
  id: "A3.3.6.2.",
  parentId: "A3.3.6.",
  title: "General Requirements.",
  childNodeIds: [
    "A3.3.6.2.1.",
    "A3.3.6.2.2.",
    "A3.3.6.2.3.",
    "A3.3.6.2.4.",
    "A3.3.6.2.5.",
    "A3.3.6.2.6.",
    "A3.3.6.2.7.",
    "A3.3.6.2.8.",
    "A3.3.6.2.9.",
    "A3.3.6.2.10.",
    "A3.3.6.2.11.",
    "A3.3.6.2.12.",
    "A3.3.6.2.13.",
  ],
};

export const A3_3_6_2_1: DocumentNode = {
  id: "A3.3.6.2.1.",
  parentId: "A3.3.6.2.",
  title: undefined,
  bodyText: `Medical or Clinical Waste containing Category A infectious substances or containing Category B
    infectious substances (in cultures) is assigned to UN2814 or UN2900 as appropriate.`,
};

export const A3_3_6_2_2: DocumentNode = {
  id: "A3.3.6.2.2.",
  parentId: "A3.3.6.2.",
  title: undefined,
  bodyText: `Medical or Clinical Waste containing (or has a probability of containing) infectious substances in Category B,
    other than cultures, is assigned to UN3291.`,
};

export const A3_3_6_2_3: DocumentNode = {
  id: "A3.3.6.2.3.",
  parentId: "A3.3.6.2.",
  title: undefined,
  bodyText: `Category B infectious substances in cultures which are in a form capable of causing life threatening or fatal
    disease if exposure to it occurs are assigned to UN2814 or UN2900 as appropriate and shipped as Category A
    Infectious Substances.`,
};

export const A3_3_6_2_4: DocumentNode = {
  id: "A3.3.6.2.4.",
  parentId: "A3.3.6.2.",
  title: undefined,
  bodyText: `Category B infectious substances, other than cultures, are assigned to UN3373 and are excepted from all
    other requirements of this manual provided:`,
  childNodeIds: ["A3.3.6.2.4.1.", "A3.3.6.2.4.2.", "A3.3.6.2.4.3."],
};

export const A3_3_6_2_4_1: DocumentNode = {
  id: "A3.3.6.2.4.1.",
  parentId: "A3.3.6.2.4.",
  title: undefined,
  bodyText: `The package is marked “Biological Substance, Category B.” Marking must be at least 6mm.`,
};

export const A3_3_6_2_4_2: DocumentNode = {
  id: "A3.3.6.2.4.2.",
  parentId: "A3.3.6.2.4.",
  title: undefined,
  bodyText: `"UN3373” is contained within a square-on-point marking displayed on the outer packaging on a background
    of a contrasting color.`,
};

export const A3_3_6_2_4_3: DocumentNode = {
  id: "A3.3.6.2.4.3.",
  parentId: "A3.3.6.2.4.",
  title: undefined,
  bodyText: `The completed package meets the requirements of A10.9.`,
};

export const A3_3_6_2_5: DocumentNode = {
  id: "A3.3.6.2.5.",
  parentId: "A3.3.6.2.",
  title: undefined,
  bodyText: `Biological products known or reasonably believed to contain infectious substances that meet the criteria
    for inclusion in Category A or Category B are assigned to UN2814, UN2900, or UN3373, as appropriate.`,
};

export const A3_3_6_2_6: DocumentNode = {
  id: "A3.3.6.2.6.",
  parentId: "A3.3.6.2.",
  title: undefined,
  bodyText: `A packaging containing inner packagings of Division 6.2 materials may not contain other hazardous
    materials except:`,
  childNodeIds: ["A3.3.6.2.6.1.", "A3.3.6.2.6.2.", "A3.3.6.2.6.3."],
};

export const A3_3_6_2_6_1: DocumentNode = {
  id: "A3.3.6.2.6.1.",
  parentId: "A3.3.6.2.6.",
  title: undefined,
  bodyText: `Refrigerants, such as dry ice or liquid nitrogen, as authorized under 49 CFR Section 173.196;`,
};

export const A3_3_6_2_6_2: DocumentNode = {
  id: "A3.3.6.2.6.2.",
  parentId: "A3.3.6.2.6.",
  title: undefined,
  bodyText: `Anticoagulants used to stabilize blood or plasma;`,
};

export const A3_3_6_2_6_3: DocumentNode = {
  id: "A3.3.6.2.6.3.",
  parentId: "A3.3.6.2.6.",
  title: undefined,
  bodyText: `Small quantities of Class 3, Class 8, Class 9 or other material in Packing Group II or III not exceeding
    30 ml or 30g per inner packaging, and 4L or 4kg per outer package, may be used to stabilize or prevent
    degradation of the sample. Such preservatives are not subject to requirements of this manual.`,
};

export const A3_3_6_2_7: DocumentNode = {
  id: "A3.3.6.2.7.",
  parentId: "A3.3.6.2.",
  title: undefined,
  bodyText: `Infectious agents identified as Biological select agents and toxins (BSAT) under the 42 CFR Section
    73.3, 42 CFR Section 73.4, 7 CFR Section 331.3, and 9 CFR Sections 121.3 and 121.4 must also comply with
    the 42 CFR, 7 CFR, 9 CFR requirements and all other applicable regulatory requirements including but not
    limited to those specified by the United States Department of Health and Human Services (DHHS) Centers for Disease Control and Prevention (CDC), the United States Department of Agriculture (USDA)
    Animal and Plant Health Inspection Service (APHIS), the United States Department of Commerce, and the Department of Defense. <strong>(T-0).</strong>`,
};

export const A3_3_6_2_8: DocumentNode = {
  id: "A3.3.6.2.8.",
  parentId: "A3.3.6.2.",
  title: undefined,
  bodyText: `In addition to meeting applicable packaging standards for Division 6.2 material as required in Attachment
    10, personnel transporting infectious agents, biological research material, patient specimens, genetically modified
    microorganisms, and other associated biological research material or samples ensure all applicable import and export
    permits (including intrastate permits) are obtained prior to transport of specimens. Receivers have the ultimate
    responsibility for ensuring all necessary permits are obtained.`,
};

export const A3_3_6_2_9: DocumentNode = {
  id: "A3.3.6.2.9.",
  parentId: "A3.3.6.2.",
  title: undefined,
  bodyText: `Personnel ensure all necessary transfer documents required by the 42 CFR, 7 CFR, 9 CFR, and applicable
    biosurety regulations are appropriately signed and emplaced prior to transport of specimens. Both the shipper
    and the receiver ensure advanced arrangements are made prior to transfer/transport of samples.`,
};

export const A3_3_6_2_10: DocumentNode = {
  id: "A3.3.6.2.10.",
  parentId: "A3.3.6.2.",
  title: undefined,
  bodyText: `A Division 6.2. packaging to be reused must be disinfected prior to reuse by any means effective for neutralizing
    the infectious substance the packaging previously contained. <strong>(T-0).</strong> A secondary packaging or outer packaging need not be
    disinfected prior to reuse if no leakage from the primary receptacle has occurred.`,
};

export const A3_3_6_2_11: DocumentNode = {
  id: "A3.3.6.2.11.",
  parentId: "A3.3.6.2.",
  title: undefined,
  bodyText: `Body parts, organs or whole bodies believed to be contaminated with an ategory A infectious agent must
    be packaged and shipped as UN2814 or UN2900 unless exceptions to these packaging requirements are obtained through
    Department of Defense channels. <strong>(T-0).</strong>`,
};

export const A3_3_6_2_12: DocumentNode = {
  id: "A3.3.6.2.12.",
  parentId: "A3.3.6.2.",
  title: undefined,
  bodyText: `Radiobioassay samples, meeting the definition of Class 7 other than limited quantities, follow the
    requirements for radioactive materials in this manual.`,
};

export const A3_3_6_2_13: DocumentNode = {
  id: "A3.3.6.2.13.",
  parentId: "A3.3.6.2.",
  title: undefined,
  bodyText: `Forensic material known or suspected of containing an infectious substance or select agent adhere to the
    requirements for a Category A or B infectious substance as appropriate.`,
};

export const A3_3_6_3: DocumentNode = {
  id: "A3.3.6.3.",
  parentId: "A3.3.6.",
  title: "Unregulated Infectious Material.",
  childNodeIds: [
    "A3.3.6.3.1.",
    "A3.3.6.3.2.",
    "A3.3.6.3.3.",
    "A3.3.6.3.4.",
    "A3.3.6.3.5.",
    "A3.3.6.3.6.",
  ],
};

export const A3_3_6_3_1: DocumentNode = {
  id: "A3.3.6.3.1.",
  parentId: "A3.3.6.3.",
  title: undefined,
  bodyText: `Live animals infected or injected with an infectious substance or biological product provided they are
    accompanied by technically qualified escorts.`,
};

export const A3_3_6_3_2: DocumentNode = {
  id: "A3.3.6.3.2.",
  parentId: "A3.3.6.3.",
  title: undefined,
  bodyText: `Blood or blood components which have been collected for the purposes of transfusion or for the preparation
    of blood products to be used for transfusion or transplantation and any tissues or organs intended for use in
    transplantation.`,
};

export const A3_3_6_3_3: DocumentNode = {
  id: "A3.3.6.3.3.",
  parentId: "A3.3.6.3.",
  title: undefined,
  bodyText: `Biological products manufactured and packaged in accordance with the requirements of the appropriate
    national authorities and transported for the purposes of final packaging or distribution, and used for personal health
    care by medical professionals or individuals.`,
};

export const A3_3_6_3_4: DocumentNode = {
  id: "A3.3.6.3.4.",
  parentId: "A3.3.6.3.",
  title: undefined,
  bodyText: `Medical, biomedical, or clinical waste not containing a Category A or B infectious substance unless they meet
    the criteria of another hazard.`,
};

export const A3_3_6_3_5: DocumentNode = {
  id: "A3.3.6.3.5.",
  parentId: "A3.3.6.3.",
  title: undefined,
  bodyText: `Patient/diagnostic specimens not containing a Category A or B infectious substance.`,
};

export const A3_3_6_3_6: DocumentNode = {
  id: "A3.3.6.3.6.",
  parentId: "A3.3.6.3.",
  title: undefined,
  bodyText: `Used health care products meeting the requirements of Title 49 CFR Paragraph 173.134(b).`,
};

export const A3_3_7: DocumentNode = {
  id: "A3.3.7.",
  parentId: "A3.3.",
  title: "Class 7.",
  childNodeIds: [
    "A3.3.7.1.",
    "A3.3.7.2.",
    "A3.3.7.3.",
    "A3.3.7.4.",
    "A3.3.7.5.",
    "A3.3.7.6.",
    "Table A3.3.",
    "A3.3.7.7.",
    "A3.3.7.8.",
    "A3.3.7.9.",
    "A3.3.7.10.",
    "A3.3.7.11.",
    "A3.3.7.12.",
    "A3.3.7.13.",
    "A3.3.7.14.",
    "A3.3.7.15.",
    "A3.3.7.16.",
    "A3.3.7.17.",
    "A3.3.7.18.",
  ],
};

export const A3_3_7_1: DocumentNode = {
  id: "A3.3.7.1.",
  parentId: "A3.3.7.",
  title: "General Handling Instructions.",
  bodyText:
    "Handle radioactive material carefully to ensure there is no contamination of personnel or the transport vehicle. A person may not remain unnecessarily in the immediate vicinity of any package containing radioactive material. Inform Installation Radiation Safety Officer (IRSO) of all shipments containing radioactive materials listed in Table 1 of Appendix A to 10 CFR 37.",
};

export const A3_3_7_2: DocumentNode = {
  id: "A3.3.7.2.",
  parentId: "A3.3.7.",
  title: "Unregulated Radioactive Material.",
  bodyText: `The following radioactive materials are not
  regulated by this manual:`,
  childNodeIds: ["A3.3.7.2.1.", "A3.3.7.2.2.", "A3.3.7.2.3."],
};

export const A3_3_7_2_1: DocumentNode = {
  id: "A3.3.7.2.1.",
  parentId: "A3.3.7.2.",
  bodyText:
    "Radioactive material implanted or incorporated into a person or live animal for diagnosis or treatment.",
};

export const A3_3_7_2_2: DocumentNode = {
  id: "A3.3.7.2.2.",
  parentId: "A3.3.7.2.",
  bodyText:
    "Natural material and ores containing naturally occurring radionuclides, which are either in their natural state or have only been processed for purposes other than for extraction of the radionuclides, and not intended to be processed for use of these radionuclides, provided the activity concentration of the material does not exceed 10 times the values for exempt materials specified in Table A11.1.",
};

export const A3_3_7_2_3: DocumentNode = {
  id: "A3.3.7.2.3.",
  parentId: "A3.3.7.2.",
  bodyText:
    "Non-radioactive solid objects with radioactive substances present on any surfaces in quantities not in excess of the limit specified in A3.3.7.3.3.",
};

export const A3_3_7_3: DocumentNode = {
  id: "A3.3.7.3.",
  parentId: "A3.3.7.",
  title: "Nomenclature.",
  bodyText:
    "Radioactive materials are grouped according to their form and/or characteristics. A radioactive material may meet the definition of one or more of these groups. These groups include Special Form, Low Specific Activity (LSA), Surface Contaminated Object (SCO), Fissile, Low dispersible radioactive material, and Other form.",
  childNodeIds: [
    "A3.3.7.3.1.",
    "A3.3.7.3.2.",
    "A3.3.7.3.3.",
    "A3.3.7.3.4.",
    "A3.3.7.3.5.",
  ],
};

export const A3_3_7_3_1: DocumentNode = {
  id: "A3.3.7.3.1.",
  parentId: "A3.3.7.3.",
  title: "Special Form.",
  childNodeIds: ["A3.3.7.3.1.1.", "A3.3.7.3.1.2."],
};

export const A3_3_7_3_1_1: DocumentNode = {
  id: "A3.3.7.3.1.1.",
  parentId: "A3.3.7.3.1.",
  title: "Design Requirements.",
  bodyText:
    "Special Form radioactive material must meet all requirements in 49 CFR Sections 173.403 and 173.469. <strong>(T-0).</strong>",
};

export const A3_3_7_3_1_2: DocumentNode = {
  id: "A3.3.7.3.1.2.",
  parentId: "A3.3.7.3.1.",
  title: "Approval of Special Form Radioactive Material.",
  childNodeIds: ["A3.3.7.3.1.2.1.", "A3.3.7.3.1.2.2.", "A3.3.7.3.1.2.3."],
};

export const A3_3_7_3_1_2_1: DocumentNode = {
  id: "A3.3.7.3.1.2.1.",
  parentId: "A3.3.7.3.1.2.",
  bodyText:
    "Each shipper of special form radioactive materials must maintain on file for at least 2 years after the latest shipment, a complete safety analysis, including documentation of any tests demonstrating that the special form material meets the requirements of 49 CFR Section 173.469. <strong>(T-0).</strong> An International Atomic Energy Agency (IAEA) certificate of competent authority issued for the special form material may be used to satisfy this requirement.",
};

export const A3_3_7_3_1_2_2: DocumentNode = {
  id: "A3.3.7.3.1.2.2.",
  parentId: "A3.3.7.3.1.2.",
  bodyText:
    "Before the first export shipment of a special form radioactive material from the United States, each shipper must obtain a competent authority certificate for the specific material. <strong>(T-0).</strong> For special form material manufactured outside the United States an IAEA certificate of component authority from the country of origin may be used to meet this requirement. For special form materials manufactured in the United States each shipper must obtain a US competent authority certificate for the specific material. <strong>(T-0).</strong> Submit each petition for a US competent authority certificate according to 49 CFR Section 173.476 and include the following information:",
  childNodeIds: ["A3.3.7.3.1.2.2.1.", "A3.3.7.3.1.2.2.2.", "A3.3.7.3.1.2.2.3."],
};

export const A3_3_7_3_1_2_2_1: DocumentNode = {
  id: "A3.3.7.3.1.2.2.1.",
  parentId: "A3.3.7.3.1.2.2.",
  bodyText:
    "A detailed description of the material or, if a capsule, a detailed description of the contents. Make a particular reference to both physical and chemical states.",
};

export const A3_3_7_3_1_2_2_2: DocumentNode = {
  id: "A3.3.7.3.1.2.2.2.",
  parentId: "A3.3.7.3.1.2.2.",
  bodyText:
    "If a capsule is used, a detailed statement of its design and dimensions, including complete engineering drawings and schedules of material, and methods of construction.",
};

export const A3_3_7_3_1_2_2_3: DocumentNode = {
  id: "A3.3.7.3.1.2.2.3.",
  parentId: "A3.3.7.3.1.2.2.",
  bodyText:
    "A statement of tests performed and their results; evidence based on calculative methods to show that the material is able to pass the tests; or other evidence that the special form radioactive material complies with 49 CFR Section 173.469.",
};

export const A3_3_7_3_1_2_3: DocumentNode = {
  id: "A3.3.7.3.1.2.3.",
  parentId: "A3.3.7.3.1.2.",
  bodyText:
    'The documentation requirements specified in the bullets above do not apply in those cases where A1 equals A2 and the material is not described on the shipping papers as "Radioactive Material, Special Form, N.O.S."',
};

export const A3_3_7_3_2: DocumentNode = {
  id: "A3.3.7.3.2.",
  parentId: "A3.3.7.3.",
  title: "Low Specific Activity (LSA) Material.",
  bodyText: "LSA material is classified in one of three groups:",
  childNodeIds: ["A3.3.7.3.2.1.", "A3.3.7.3.2.2.", "A3.3.7.3.2.3."],
};

export const A3_3_7_3_2_1: DocumentNode = {
  id: "A3.3.7.3.2.1.",
  parentId: "A3.3.7.3.2.",
  title: "LSA-I.",
  bodyText: "LSA-I material is:",
  childNodeIds: [
    "A3.3.7.3.2.1.1.",
    "A3.3.7.3.2.1.2.",
    "A3.3.7.3.2.1.3.",
    "A3.3.7.3.2.1.4.",
  ],
};

export const A3_3_7_3_2_1_1: DocumentNode = {
  id: "A3.3.7.3.2.1.1.",
  parentId: "A3.3.7.3.2.1.",
  title: undefined,
  bodyText:
    "Uranium and thorium ores and concentrates of such ores, and other ores containing naturally occurring radionuclides which are intended to be processed for the use of these radionuclides.",
};

export const A3_3_7_3_2_1_2: DocumentNode = {
  id: "A3.3.7.3.2.1.2.",
  parentId: "A3.3.7.3.2.1.",
  title: undefined,
  bodyText:
    "Solid, unirradiated natural uranium or depleted uranium or natural thorium or their solid or liquid compounds or mixtures.",
};

export const A3_3_7_3_2_1_3: DocumentNode = {
  id: "A3.3.7.3.2.1.3.",
  parentId: "A3.3.7.3.2.1.",
  title: undefined,
  bodyText:
    "Radioactive material, for which the A2 value is unlimited, other than fissile material in quantities not excepted under A3.3.7.3.4.2.",
};

export const A3_3_7_3_2_1_4: DocumentNode = {
  id: "A3.3.7.3.2.1.4.",
  parentId: "A3.3.7.3.2.1.",
  title: undefined,
  bodyText:
    "Other radioactive material in which the activity is distributed throughout and the estimated average specific activity does not exceed 30 times the values for activity concentration for exempt materials specified in Table A11.1, or 30 times the General Exemption Values in 49 CFR Section 173.433, Table 8, excluding fissile material in quantities not excepted under A3.3.7.3.4.2.",
};

export const A3_3_7_3_2_2: DocumentNode = {
  id: "A3.3.7.3.2.2.",
  parentId: "A3.3.7.3.2.",
  title: "LSA-II.",
  bodyText: "LSA material is:",
  childNodeIds: ["A3.3.7.3.2.2.1.", "A3.3.7.3.2.2.2."],
};

export const A3_3_7_3_2_2_1: DocumentNode = {
  id: "A3.3.7.3.2.2.1.",
  parentId: "A3.3.7.3.2.2.",
  title: undefined,
  bodyText: "Water with tritium concentration up to 0.8 TBq/L.",
};

export const A3_3_7_3_2_2_2: DocumentNode = {
  id: "A3.3.7.3.2.2.2.",
  parentId: "A3.3.7.3.2.2.",
  title: undefined,
  bodyText:
    "Other material in which the activity is distributed throughout and the estimated average specific activity does not exceed 10-4 A2/g for solids and gases, and 10-5 A2/g for liquids.",
};

export const A3_3_7_3_2_3: DocumentNode = {
  id: "A3.3.7.3.2.3.",
  parentId: "A3.3.7.3.2.",
  title: "LSA-III.",
  bodyText:
    "LSA-III material is a solid (e.g., consolidated wastes, activated materials), excluding powders, meeting the test requirements of 49 CFR Section 173.468 and in which:",
  childNodeIds: ["A3.3.7.3.2.3.1.", "A3.3.7.3.2.3.2.", "A3.3.7.3.2.3.3."],
};

export const A3_3_7_3_2_3_1: DocumentNode = {
  id: "A3.3.7.3.2.3.1.",
  parentId: "A3.3.7.3.2.3.",
  title: undefined,
  bodyText:
    "The radioactive material is distributed throughout a solid or a collection of solid objects, or is essentially uniformly distributed in a solid compact binding agent (such as concrete, bitumen, ceramic, etc.).",
};

export const A3_3_7_3_2_3_2: DocumentNode = {
  id: "A3.3.7.3.2.3.2.",
  parentId: "A3.3.7.3.2.3.",
  title: undefined,
  bodyText:
    "The radioactive material is relatively insoluble, or it is intrinsically contained in a relatively insoluble material, so that even under loss of packaging, the loss of radioactive material per package by leaching, when placed in water for 7 calendar days, would not exceed 0.1 A2.",
};

export const A3_3_7_3_2_3_3: DocumentNode = {
  id: "A3.3.7.3.2.3.3.",
  parentId: "A3.3.7.3.2.3.",
  title: undefined,
  bodyText:
    "The estimated average specific activity of the solid does not exceed 2 x 10-3 A2/g.",
};

export const A3_3_7_3_3: DocumentNode = {
  id: "A3.3.7.3.3.",
  parentId: "A3.3.7.3.",
  title: "Surface Contaminated Object (SCO).",
  bodyText: "SCO is classified in one of two groups; SCO-I and SCO-II.",
  childNodeIds: ["A3.3.7.3.3.1.", "A3.3.7.3.3.2."],
};

export const A3_3_7_3_3_1: DocumentNode = {
  id: "A3.3.7.3.3.1.",
  parentId: "A3.3.7.3.3.",
  title: "SCO-I.",
  bodyText: "A solid object on which:",
  childNodeIds: ["A3.3.7.3.3.1.1.", "A3.3.7.3.3.1.2.", "A3.3.7.3.3.1.3."],
};

export const A3_3_7_3_3_1_1: DocumentNode = {
  id: "A3.3.7.3.3.1.1.",
  parentId: "A3.3.7.3.3.1.",
  title: undefined,
  bodyText:
    "The nonfixed contamination on the accessible surface averaged over 300 cm2 (or the area of the surface if less than 300 cm2) does not exceed 4 Bq/cm2 (10-4 microcurie/cm2) for beta and gamma and low toxicity alpha emitters, or 0.4 Bq/cm2 (10-5 microcurie/cm2) for all other alpha emitters.",
};

export const A3_3_7_3_3_1_2: DocumentNode = {
  id: "A3.3.7.3.3.1.2.",
  parentId: "A3.3.7.3.3.1.",
  title: undefined,
  bodyText:
    "The fixed contamination on the accessible surface averaged over 300 cm2 (or the area of the surface if less than 300 cm2) does not exceed 4 x 104 Bq/cm2 (1.0 microcurie/cm2) for beta and gamma and low toxicity alpha emitters, or 4 x 103 Bq/cm2 (0.1 microcurie/cm2) for all other alpha emitters.",
};

export const A3_3_7_3_3_1_3: DocumentNode = {
  id: "A3.3.7.3.3.1.3.",
  parentId: "A3.3.7.3.3.1.",
  title: undefined,
  bodyText:
    "The nonfixed contamination plus the fixed contamination on the inaccessible surface averaged over 300 cm2 (or the area of the surface if less than 300 cm2) does not exceed 4 x 104 Bq/cm2 (1 microcurie/cm2) for beta and gamma and low toxicity alpha emitters, or 4 x 103 Bq/cm2 (0.1 microcurie/cm2) for all other alpha emitters.",
};

export const A3_3_7_3_3_2: DocumentNode = {
  id: "A3.3.7.3.3.2.",
  parentId: "A3.3.7.3.3.",
  title: "SCO-II.",
  bodyText:
    "A solid object on which the limits for SCO-I are exceeded and on which:",
  childNodeIds: ["A3.3.7.3.3.2.1.", "A3.3.7.3.3.2.2.", "A3.3.7.3.3.2.3."],
};

export const A3_3_7_3_3_2_1: DocumentNode = {
  id: "A3.3.7.3.3.2.1.",
  parentId: "A3.3.7.3.3.2.",
  title: undefined,
  bodyText:
    "The nonfixed contamination on the accessible surface averaged over 300 cm2 (or the area of the surface if less than 300 cm2) does not exceed 400 Bq/cm2 (10-2 microcurie/cm2) for beta and gamma and low toxicity alpha emitters or 40 Bq/cm2 (10-3 microcurie/cm2) for all other alpha emitters.",
};

export const A3_3_7_3_3_2_2: DocumentNode = {
  id: "A3.3.7.3.3.2.2.",
  parentId: "A3.3.7.3.3.2.",
  title: undefined,
  bodyText:
    "The fixed contamination on the accessible surface averaged over 300 cm2 (or the area of the surface if less than 300 cm2) does not exceed 8 x 105 Bq/cm2 (20 microcuries/cm2) for beta and gamma and low toxicity alpha emitters, or 8 x 104 Bq/cm2 (2 microcuries/cm2) for all other alpha emitters.",
};

export const A3_3_7_3_3_2_3: DocumentNode = {
  id: "A3.3.7.3.3.2.3.",
  parentId: "A3.3.7.3.3.2.",
  title: undefined,
  bodyText:
    "The nonfixed contamination plus the fixed contamination on the inaccessible surface averaged over 300 cm2 (or the area of the surface if less than 300 cm2) does not exceed 8 x 105 Bq/cm2 (20 microcuries/cm2) for beta and gamma and low toxicity alpha emitters, or 8 x 104 Bq/cm2 (2 microcuries/cm2) for all other alpha emitters.",
};

export const A3_3_7_3_4: DocumentNode = {
  id: "A3.3.7.3.4.",
  parentId: "A3.3.7.3.",
  title: "Fissile Material.",
  bodyText:
    "Fissile material includes Uranium-233, Uranium-235, Plutonium-239, Plutonium-241, or any combination of these.",
  childNodeIds: ["A3.3.7.3.4.1.", "A3.3.7.3.4.2."],
};

export const A3_3_7_3_4_1: DocumentNode = {
  id: "A3.3.7.3.4.1.",
  parentId: "A3.3.7.3.4.",
  title: "Specific Requirements for Fissile Shipments.",
  childNodeIds: [
    "A3.3.7.3.4.1.1.",
    "A3.3.7.3.4.1.2.",
    "A3.3.7.3.4.1.3.",
    "A3.3.7.3.4.1.4.",
    "A3.3.7.3.4.1.5.",
    "A3.3.7.3.4.1.6.",
    "A3.3.7.3.4.1.7.",
    "A3.3.7.3.4.1.8.",
  ],
};

export const A3_3_7_3_4_1_1: DocumentNode = {
  id: "A3.3.7.3.4.1.1.",
  parentId: "A3.3.7.3.4.1.",
  title: undefined,
  bodyText:
    "Packages containing fissile radioactive material which are not excepted according to A3.3.7.3.4.2 must be assigned a criticality safety index (CSI) and a transport index (TI). <strong>(T-0).</strong>",
};

export const A3_3_7_3_4_1_2: DocumentNode = {
  id: "A3.3.7.3.4.1.2.",
  parentId: "A3.3.7.3.4.1.",
  title: undefined,
  bodyText:
    "Fissile material packages and conveyances transporting these packages must satisfy the radiation level restrictions in A3.3.7.10. <strong>(T-0).</strong>",
};

export const A3_3_7_3_4_1_3: DocumentNode = {
  id: "A3.3.7.3.4.1.3.",
  parentId: "A3.3.7.3.4.1.",
  title: undefined,
  bodyText:
    "Except for consignments under exclusive use, the CSI of any packages or overpack may not exceed 50. A fissile material package with CSI greater than 50 must be transported by exclusive use. <strong>(T-0).</strong>",
};

export const A3_3_7_3_4_1_4: DocumentNode = {
  id: "A3.3.7.3.4.1.4.",
  parentId: "A3.3.7.3.4.1.",
  title: undefined,
  bodyText:
    "For non-exclusive use shipments of fissile material packages the total sum of CSIs in a freight container or on a conveyance may not exceed 50.",
};

export const A3_3_7_3_4_1_5: DocumentNode = {
  id: "A3.3.7.3.4.1.5.",
  parentId: "A3.3.7.3.4.1.",
  title: undefined,
  bodyText:
    "For exclusive use shipments of fissile material packages the total sum of CSIs in a freight container or on a conveyance may not exceed 100.",
};

export const A3_3_7_3_4_1_6: DocumentNode = {
  id: "A3.3.7.3.4.1.6.",
  parentId: "A3.3.7.3.4.1.",
  title: undefined,
  bodyText:
    "Exclusive use shipments of fissile material packages must satisfy the radiation level and administrative requirements of 49 CFR Paragraph 173.441(b). <strong>(T-0).</strong>",
};

export const A3_3_7_3_4_1_7: DocumentNode = {
  id: "A3.3.7.3.4.1.7.",
  parentId: "A3.3.7.3.4.1.",
  title: undefined,
  bodyText:
    "Mixing fissile material packages with other types of radioactive materials, in any conveyance is authorized only if the TI of any single package does not exceed 10, the CSI of any single package does not exceed 50 and the requirements in this paragraph and in A3.3.7.10 are met.",
};

export const A3_3_7_3_4_1_8: DocumentNode = {
  id: "A3.3.7.3.4.1.8.",
  parentId: "A3.3.7.3.4.1.",
  title: undefined,
  bodyText: "See Attachment 24 for Fissile Class III shipments.",
};

export const A3_3_7_3_4_2: DocumentNode = {
  id: "A3.3.7.3.4.2.",
  parentId: "A3.3.7.3.4.",
  title: "Fissile Material Exception.",
  bodyText:
    "Fissile materials meeting one of the following are excepted from the requirements of this manual that apply to fissile material, including the requirements of A3.3.7.3.4., but are subject to all other requirements of this manual, except as noted.",
  childNodeIds: [
    "A3.3.7.3.4.2.1.",
    "A3.3.7.3.4.2.2.",
    "A3.3.7.3.4.2.3.",
    "A3.3.7.3.4.2.4.",
    "A3.3.7.3.4.2.5.",
    "A3.3.7.3.4.2.6.",
  ],
};

export const A3_3_7_3_4_2_1: DocumentNode = {
  id: "A3.3.7.3.4.2.1.",
  parentId: "A3.3.7.3.4.2.",
  title: undefined,
  bodyText:
    "An individual package containing 2 grams or less of fissile material.",
};

export const A3_3_7_3_4_2_2: DocumentNode = {
  id: "A3.3.7.3.4.2.2.",
  parentId: "A3.3.7.3.4.2.",
  title: undefined,
  bodyText:
    "An individual packaging containing 15 grams or less of fissile material provided the package has at least 200 grams of solid nonfissile material for every gram of fissile material. Lead, beryllium, graphite, and hydrogenous material enriched in deuterium may be present in the package but is not included in determining the required mass for solid nonfissile material.",
};

export const A3_3_7_3_4_2_3: DocumentNode = {
  id: "A3.3.7.3.4.2.3.",
  parentId: "A3.3.7.3.4.2.",
  title: undefined,
  bodyText:
    "Low concentrations of solid fissile material commingled with solid nonfissile material, provide that:",
  childNodeIds: ["A3.3.7.3.4.2.3.1.", "A3.3.7.3.4.2.3.2."],
};

export const A3_3_7_3_4_2_3_1: DocumentNode = {
  id: "A3.3.7.3.4.2.3.1.",
  parentId: "A3.3.7.3.4.2.3.",
  title: undefined,
  bodyText:
    "There is at least 2000 grams of nonfissile material for every gram of fissile material,",
};

export const A3_3_7_3_4_2_3_2: DocumentNode = {
  id: "A3.3.7.3.4.2.3.2.",
  parentId: "A3.3.7.3.4.2.3.",
  title: undefined,
  bodyText:
    "There is no more than 180 grams of fissile material distributed within 360 kg of contiguous nonfissile material. Lead, beryllium, graphite, and hydrogenous material enriched in deuterium may be present in the package but is not included in determining the required mass of solid nonfissile material.",
};

export const A3_3_7_3_4_2_4: DocumentNode = {
  id: "A3.3.7.3.4.2.4.",
  parentId: "A3.3.7.3.4.2.",
  title: undefined,
  bodyText:
    "Uranium enriched in uranium-235 to a maximum of 1 percent by weight, and with total plutonium and uranium-233 content of up to 1 percent of the mass of uranium-235, provided that the mass of any beryllium, graphite, and hydrogenous material enriched in deuterium constitute less than 5 percent of the uranium mass.",
};

export const A3_3_7_3_4_2_5: DocumentNode = {
  id: "A3.3.7.3.4.2.5.",
  parentId: "A3.3.7.3.4.2.",
  title: undefined,
  bodyText:
    "Liquid solutions of uranyl nitrate enriched in uranium-235 to a maximum of 2 percent by mass, with a total plutonium and uranium-233 content not exceeding 0.002 percent of the mass of uranium, and with a minimum nitrogen to uranium atomic ratio (N/U) of 2. The material must be contained in at least a DOT Type A package. <strong>(T-0).</strong>",
};

export const A3_3_7_3_4_2_6: DocumentNode = {
  id: "A3.3.7.3.4.2.6.",
  parentId: "A3.3.7.3.4.2.",
  title: undefined,
  bodyText:
    "Packages containing, individually, a total plutonium mass of not more than 1000 grams, of which not more than 20 percent by mass may consist of plutonium-239, plutonium-241, or any combination of these radionuclides.",
};

export const A3_3_7_3_5: DocumentNode = {
  id: "A3.3.7.3.5.",
  parentId: "A3.3.7.3.",
  title: "Low Dispersible Material.",
  bodyText:
    "Low dispersible material is such that the radiation level at 3m from the unshielded radioactive material does not exceed 10 mSv/h.",
};

export const A3_3_7_4: DocumentNode = {
  id: "A3.3.7.4.",
  parentId: "A3.3.7.",
  title: "General Transportation Requirements.",
  bodyText: "",
  childNodeIds: [
    "A3.3.7.4.1.",
    "A3.3.7.4.2.",
    "A3.3.7.4.3.",
    "A3.3.7.4.4.",
    "A3.3.7.4.5.",
  ],
};

export const A3_3_7_4_1: DocumentNode = {
  id: "A3.3.7.4.1.",
  parentId: "A3.3.7.4.",
  title: "",
  bodyText:
    "Secure each shipment of radioactive materials to prevent shifting during normal transportation conditions.",
};

export const A3_3_7_4_2: DocumentNode = {
  id: "A3.3.7.4.2.",
  parentId: "A3.3.7.4.",
  title: "",
  bodyText:
    "Except as specifically required by a CAA, a package of radioactive materials may be carried among packaged general cargo without special stowage provisions, if one of the following is met:",
  childNodeIds: ["A3.3.7.4.2.1.", "A3.3.7.4.2.2."],
};

export const A3_3_7_4_2_1: DocumentNode = {
  id: "A3.3.7.4.2.1.",
  parentId: "A3.3.7.4.2.",
  title: "",
  bodyText:
    "The heat output in watts is not over 0.1 times the minimum package dimension in centimeters. 49 CFR Section 173.448",
};

export const A3_3_7_4_2_2: DocumentNode = {
  id: "A3.3.7.4.2.2.",
  parentId: "A3.3.7.4.2.",
  title: "",
  bodyText:
    "The average surface heat flux of the package is not over 15 watts per square meter (W/m2 ) and the immediately surrounding cargo is not in sacks or bags or otherwise in a form that would seriously impede air circulation for heat removal. 49 CFR Section 173.448",
};

export const A3_3_7_4_3: DocumentNode = {
  id: "A3.3.7.4.3.",
  parentId: "A3.3.7.4.",
  title: "",
  bodyText:
    "Aircraft in which radioactive materials have been spilled may not again be placed in service or routinely occupied until radiation dose rate at any accessible surface is less than 0.005 mSv/h (0.5 mrem/h) and there is no significant removable radioactive surface contamination as determined in A3.3.7.6. When contamination is present or suspected, segregate the package and any other materials it has touched as far as practical from personnel contact until needed radiological advice or assistance is obtained. For personnel safety, take care to avoid possible inhalation, ingestion, or contact with radioactive materials that may have leaked or spilled from its package. Leave any loose radioactive materials and associated packaging materials in a segregated area pending disposal instructions from responsible radiological authorities.",
};

export const A3_3_7_4_4: DocumentNode = {
  id: "A3.3.7.4.4.",
  parentId: "A3.3.7.4.",
  title: "",
  bodyText: "Do not offer for military airlift:",
  childNodeIds: ["A3.3.7.4.4.1.", "A3.3.7.4.4.2.", "A3.3.7.4.4.3."],
};

export const A3_3_7_4_4_1: DocumentNode = {
  id: "A3.3.7.4.4.1.",
  parentId: "A3.3.7.4.4.",
  title: "",
  bodyText:
    "Any Type B(U) or Type B(M) package with an accessible surface temperature in excess of 50 degrees C (122 degrees F).",
};

export const A3_3_7_4_4_2: DocumentNode = {
  id: "A3.3.7.4.4.2.",
  parentId: "A3.3.7.4.4.",
  title: "",
  bodyText:
    "Any continuously vented Type B(M) packages, which require external cooling by an auxiliary cooling system or packages subject to operational controls during transport.",
};

export const A3_3_7_4_4_3: DocumentNode = {
  id: "A3.3.7.4.4.3.",
  parentId: "A3.3.7.4.4.",
  title: "",
  bodyText: "Any liquid pyrophoric radioactive materials.",
};

export const A3_3_7_4_5: DocumentNode = {
  id: "A3.3.7.4.5.",
  parentId: "A3.3.7.4.",
  title: "",
  bodyText:
    "Do not transport exclusive use shipments of packages having a surface radiation level in excess of 2 mSv/h (200 mrem/h) except by special arrangement.",
};

export const A3_3_7_5: DocumentNode = {
  id: "A3.3.7.5.",
  parentId: "A3.3.7.",
  title: "Stowage on Aircraft or Storage Incident to Transportation.",
  bodyText: "",
  childNodeIds: [
    "A3.3.7.5.1.",
    "A3.3.7.5.2.",
    "A3.3.7.5.3.",
    "A3.3.7.5.4.",
    "A3.3.7.5.5.",
  ],
};

export const A3_3_7_5_1: DocumentNode = {
  id: "A3.3.7.5.1.",
  parentId: "A3.3.7.5.",
  title: "",
  bodyText:
    "Do not ship radioactive Category II-Yellow or Category III-Yellow material on the same aircraft or store in any one area, such as a transit area, terminal building, storeroom, or assembly yard, if the sum of the criticality safety indicesin any individual group of packages exceeds 50. (49 CFR Sections 173.447, 173.457, and 175.702)",
};

export const A3_3_7_5_2: DocumentNode = {
  id: "A3.3.7.5.2.",
  parentId: "A3.3.7.5.",
  title: "",
  bodyText:
    "If the total criticality safety indices for all packages, overpacks, or freight containers exceeds 50, separate the packages overpacks, or freight containers into groups. Store groups of these packages so as to maintain a spacing of at least 6 meters (20 feet) from each other group.",
};

export const A3_3_7_5_3: DocumentNode = {
  id: "A3.3.7.5.3.",
  parentId: "A3.3.7.5.",
  title: "",
  bodyText:
    "Ensure separation of Category II-Yellow or Category III-Yellow material from packages containing undeveloped film according to the distances shown in 49 CFR Section 175.706.",
};

export const A3_3_7_5_4: DocumentNode = {
  id: "A3.3.7.5.4.",
  parentId: "A3.3.7.5.",
  title: "",
  bodyText:
    "Radioactive Category II-Yellow and Category III-Yellow material must be separated from persons or animals by a minimum of 2 pallet positions (176 inches) at all times while on the aircraft. <strong>(T-0).</strong> If the total transport index of all packages on the aircraft exceeds 50, the separation distance between the surfaces of the radioactive materials packages and the surfaces bounding the space occupied by persons or animals must be at least 9 m (30 feet). <strong>(T-0).</strong>",
};

export const A3_3_7_5_5: DocumentNode = {
  id: "A3.3.7.5.5.",
  parentId: "A3.3.7.5.",
  title: "",
  bodyText: "The maximum limits are as follows:",
  childNodeIds: ["A3.3.7.5.5.1.", "A3.3.7.5.5.2.", "A3.3.7.5.5.3."],
};

export const A3_3_7_5_5_1: DocumentNode = {
  id: "A3.3.7.5.5.1.",
  parentId: "A3.3.7.5.5.",
  title: "",
  bodyText: "A maximum transport index of 10 per individual package.",
};

export const A3_3_7_5_5_2: DocumentNode = {
  id: "A3.3.7.5.5.2.",
  parentId: "A3.3.7.5.5.",
  title: "",
  bodyText: "A maximum criticality safety index of 100 per aircraft.",
};

export const A3_3_7_5_5_3: DocumentNode = {
  id: "A3.3.7.5.5.3.",
  parentId: "A3.3.7.5.5.",
  title: "",
  bodyText: "A maximum transport index of 200 per aircraft.",
};

export const A3_3_7_6: DocumentNode = {
  id: "A3.3.7.6.",
  parentId: "A3.3.7.",
  title: "Radioactive Contamination.",
  childNodeIds: ["A3.3.7.6.1.", "A3.3.7.6.2."],
};

export const A3_3_7_6_1: DocumentNode = {
  id: "A3.3.7.6.1.",
  parentId: "A3.3.7.6.",
  title: "Contamination Control.",
  bodyText: `Keep the level of nonfixed (removable) radioactive contamination on the external surfaces
    of each package offered for shipment as low as practical. The level of nonfixed radioactive contamination
    may be determined by wiping an area of 300 cm2 of the surface concerned with an absorbent material,
    using moderate pressure, and measuring the activity on the wiping material. Take sufficient measurements
    in the most appropriate locations to yield a representative assessment of the nonfixed contamination levels.
    The amount of radioactivity measured on any single wiping material divided by the surface area wiped and
    divided by the efficiency of the wipe procedure may not exceed the limits set forth in Table A3.3. at
    any time during transport. Other methods of assessment of equal or greater efficiency may be used.`,
};

export const A3_3_7_6_2: DocumentNode = {
  id: "A3.3.7.6.2.",
  parentId: "A3.3.7.6.",
  title: "Inspecting Aircraft for Contamination.",
  bodyText: `Periodically check aircraft used to routinely transport radioactive materials for radioactive
    contamination. Determine frequency of the checks based on the likelihood of contamination and the extent
    to which radioactive materials are carried aboard the aircraft. Take aircraft out of service if the radiation
    dose rate at any accessible surface is 0.005 mSv/h (0.5 mrem/h) or if there is significant removable
    radioactive surface contamination as outlined above.`,
};

export const TableA3_3: DocumentNode = {
  id: "Table A3.3.",
  parentId: "A3.",
  title: "Removable External Radioactive Contamination--Wipe Limits.",
  bodyText: `
  <table border="1" style="border-collapse: collapse; width: 100%;">
    <thead>
      <tr style="height: 3rem">
        <th>Contaminant</th>
        <th colspan="3">Maximum permissible limits</th>
      </tr>
      <tr style="height: 3rem">
        <th></th>
        <th>Bq/cm²</th>
        <th>uCi/cm²</th>
        <th>dpm/cm²</th>
      </tr>
    </thead>
    <tbody>
      <tr style="height: 2rem">
        <td style="padding: 0.2rem">Beta and gamma emitters and low toxicity alpha emitters.</td>
        <td style="padding: 0.2rem">4</td>
        <td style="padding: 0.2rem">10⁻⁴</td>
        <td style="padding: 0.2rem">220</td>
      </tr>
      <tr style="height: 2rem">
        <td style="padding: 0.2rem">All other alpha emitting radionuclides</td>
        <td style="padding: 0.2rem">0.4</td>
        <td style="padding: 0.2rem">10⁻⁵</td>
        <td style="padding: 0.2rem">22</td>
      </tr>
    </tbody>
  </table>
  `,
};

export const A3_3_7_7: DocumentNode = {
  id: "A3.3.7.7.",
  parentId: "A3.3.7.",
  title: "Transport Index and Criticality Safety Index (CSI).",
  childNodeIds: ["A3.3.7.7.1.", "A3.3.7.7.2."],
};

export const A3_3_7_7_1: DocumentNode = {
  id: "A3.3.7.7.1.",
  parentId: "A3.3.7.7.",
  title: "Transport Index – Radiation Exposure Control.",
  childNodeIds: ["A3.3.7.7.1.1.", "A3.3.7.7.1.2."],
};

export const A3_3_7_7_1_1: DocumentNode = {
  id: "A3.3.7.7.1.1.",
  parentId: "A3.3.7.7.1.",
  bodyText: `The TI for a package, overpack, or freight container is the number derived using the following procedure:`,
  childNodeIds: ["A3.3.7.7.1.1.1.", "A3.3.7.7.1.1.2.", "A3.3.7.7.1.1.3."],
};

export const A3_3_7_7_1_1_1: DocumentNode = {
  id: "A3.3.7.7.1.1.1.",
  parentId: "A3.3.7.7.1.1.",
  bodyText: `Determine the maximum radiation level at a distance of 1 m from the external surfaces of
    the package, overpack, or freight container. If the radiation level is determined in units of millisievert
    per hour (mSv/h), then multiply the value by 100 to convert to units of millirem per hour (mrem/h).
    If the radiation level is determined in units of millirem per hour, then the value is not changed. For uranium
    and thorium ores and concentrates, the maximum radiation dose rate at any point 1 m from the external
    surface of the load may be taken as follows:`,
  childNodeIds: [
    "A3.3.7.7.1.1.1.1.",
    "A3.3.7.7.1.1.1.2.",
    "Table A3.4.",
    "A3.3.7.7.1.1.1.3.",
  ],
};

export const A3_3_7_7_1_1_1_1: DocumentNode = {
  id: "A3.3.7.7.1.1.1.1.",
  parentId: "A3.3.7.7.1.1.1.",
  bodyText: `For ores and physical concentrates of uranium and thorium - 0.4 mSv/h (40 mrem/h).`,
};

export const A3_3_7_7_1_1_1_2: DocumentNode = {
  id: "A3.3.7.7.1.1.1.2.",
  parentId: "A3.3.7.7.1.1.1.",
  bodyText: `For chemical concentrates of thorium – 0.3 mSv/h (30 mrem/h).`,
};

export const A3_3_7_7_1_1_1_3: DocumentNode = {
  id: "A3.3.7.7.1.1.1.3.",
  parentId: "A3.3.7.7.1.1.1.",
  bodyText: `For chemical concentrates of uranium, other than uranium hexafluoride – 0.02 mSv/h (2 mrem/h).`,
};

export const A3_3_7_7_1_1_2: DocumentNode = {
  id: "A3.3.7.7.1.1.2.",
  parentId: "A3.3.7.7.1.1.",
  bodyText: `For freight containers, multiply the value determined in A3.3.7.7.1.1.1. by the appropriate
    factor from Table A3.4.`,
};

export const TableA3_4: DocumentNode = {
  id: "Table A3.4.",
  parentId: "A3.",
  title: "Multiplication Factors for Freight Containers.",
  bodyText: `
  <table border="1" style="border-collapse: collapse; width: 100%;">
    <thead>
      <tr style="height: 3rem">
        <th>Largest Cross-Sectional Area of the Freight Container</th>
        <th>Multiplication Factor</th>
      </tr>
    </thead>
    <tbody>
      <tr style="height: 2rem">
        <td style="padding: 0.2rem">≤ 1 m²</td>
        <td style="padding: 0.2rem">1</td>
      </tr>
      <tr style="height: 2rem">
        <td style="padding: 0.2rem">> 1 m² to ≤ 5 m²</td>
        <td style="padding: 0.2rem">2</td>
      </tr>
      <tr style="height: 2rem">
        <td style="padding: 0.2rem">> 5 m² to ≤ 20 m²</td>
        <td style="padding: 0.2rem">3</td>
      </tr>
      <tr style="height: 2rem">
        <td style="padding: 0.2rem">> 20 m²</td>
        <td style="padding: 0.2rem">10</td>
      </tr>
    </tbody>
  </table>
  `,
};

export const A3_3_7_7_1_1_3: DocumentNode = {
  id: "A3.3.7.7.1.1.3.",
  parentId: "A3.3.7.7.1.1.",
  bodyText: `Round the figure obtained in A3.3.7.7.1.1.1 and A3.3.7.7.1.1.2 up to the first decimal place
    (e.g., 1.13 becomes 1.2), except that a value of 0.05 or less may be considered as zero.`,
};

export const A3_3_7_7_1_2: DocumentNode = {
  id: "A3.3.7.7.1.2.",
  parentId: "A3.3.7.7.1.",
  bodyText: `Transport Index - Consignment. Determine the transport index for each overpack or freight
    container as either the sum of the TIs of all the packages contained, or by direct measurement of radiation
    level, except in the case of nonrigid overpacks for which the transport index is determined as the sum
    of the TIs of all the packages only.`,
};

export const A3_3_7_7_2: DocumentNode = {
  id: "A3.3.7.7.2.",
  parentId: "A3.3.7.7.",
  bodyText: `Determination of Criticality Safety Index (CSI). The Criticality Safety Index (CSI) for packages
    containing fissile material is determined in accordance with the instructions provided in 10 CFR Part 71.
    The CSI for an overpack, freight container, or consignment containing fissile material packages is the sum
    of the CSIs of all the fissile material packages contained within the overpack, freight container, or consignment.`,
};

export const A3_3_7_8: DocumentNode = {
  id: "A3.3.7.8.",
  parentId: "A3.3.7.",
  title: "General Package Design Requirements.",
  childNodeIds: ["A3.3.7.8.1.", "A3.3.7.8.2."],
};

export const A3_3_7_8_1: DocumentNode = {
  id: "A3.3.7.8.1.",
  parentId: "A3.3.7.8.",
  bodyText: `The packaging for the transport of radioactive material must provide the following:`,
  childNodeIds: [
    "A3.3.7.8.1.1.",
    "A3.3.7.8.1.2.",
    "A3.3.7.8.1.3.",
    "A3.3.7.8.1.4.",
  ],
};

export const A3_3_7_8_1_1: DocumentNode = {
  id: "A3.3.7.8.1.1.",
  parentId: "A3.3.7.8.1.",
  bodyText: `Containment to prevent contamination of people and the environment.`,
};

export const A3_3_7_8_1_2: DocumentNode = {
  id: "A3.3.7.8.1.2.",
  parentId: "A3.3.7.8.1.",
  bodyText: `Protection from radiation. The type of packaging depends on the amount and type
    of radiation (alpha, beta, gamma, neutron).`,
};

export const A3_3_7_8_1_3: DocumentNode = {
  id: "A3.3.7.8.1.3.",
  parentId: "A3.3.7.8.1.",
  bodyText: `Prevention of criticality in fissile material.`,
};

export const A3_3_7_8_1_4: DocumentNode = {
  id: "A3.3.7.8.1.4.",
  parentId: "A3.3.7.8.1.",
  bodyText: `Protection from internal heat generation. <strong>(T-0).</strong>`,
};

export const A3_3_7_8_2: DocumentNode = {
  id: "A3.3.7.8.2.",
  parentId: "A3.3.7.8.",
  bodyText: `Design each package used for shipment of radioactive materials so that:`,
  childNodeIds: [
    "A3.3.7.8.2.1.",
    "A3.3.7.8.2.2.",
    "A3.3.7.8.2.3.",
    "A3.3.7.8.2.4.",
    "A3.3.7.8.2.5.",
    "A3.3.7.8.2.6.",
    "A3.3.7.8.2.7.",
    "A3.3.7.8.2.8.",
    "A3.3.7.8.2.9.",
  ],
};

export const A3_3_7_8_2_1: DocumentNode = {
  id: "A3.3.7.8.2.1.",
  parentId: "A3.3.7.8.2.",
  bodyText: `The package can be easily handled and properly secured during transport.`,
};

export const A3_3_7_8_2_2: DocumentNode = {
  id: "A3.3.7.8.2.2.",
  parentId: "A3.3.7.8.2.",
  bodyText: `Each lifting attachment on the package, when used in the intended manner, with a minimum
    safety factor of three, does not impose an unsafe stress on the structure of the package. In addition,
    design the lifting attachment so that failure under excessive load does not impair the ability of the package
    to meet all other requirements of this attachment and Attachment 11. Remove, make inoperable for transport,
    or design with equivalent strength for lifting each attachment or other feature on the outer surface of the
    packaging that could be used to lift the package.`,
};

export const A3_3_7_8_2_3: DocumentNode = {
  id: "A3.3.7.8.2.3.",
  parentId: "A3.3.7.8.2.",
  bodyText: `The external surface, as far as practical, may be easily decontaminated.`,
};

export const A3_3_7_8_2_4: DocumentNode = {
  id: "A3.3.7.8.2.4.",
  parentId: "A3.3.7.8.2.",
  bodyText: `The outer layer of packaging avoids, as far as practicable, pockets or crevices where water might collect.`,
};

export const A3_3_7_8_2_5: DocumentNode = {
  id: "A3.3.7.8.2.5.",
  parentId: "A3.3.7.8.2.",
  bodyText: `Each feature that is added to the package at the time of transport, and is not a part of
    the package, does not reduce the safety of the package.`,
};

export const A3_3_7_8_2_6: DocumentNode = {
  id: "A3.3.7.8.2.6.",
  parentId: "A3.3.7.8.2.",
  bodyText: `The package will be capable of withstanding the effects of any acceleration, vibration, or
    vibration resonance that may occur during transportation without any deterioration in the effectiveness
    of any of the closing devices or in the integrity of the package and without loosening or unintentionally
    releasing the nuts, bolts, or other securing devices. <strong>(T-0).</strong>`,
};

export const A3_3_7_8_2_7: DocumentNode = {
  id: "A3.3.7.8.2.7.",
  parentId: "A3.3.7.8.2.",
  bodyText: `The package will be capable of withstanding, without leakage, an internal pressure that
    produces a pressure differential of not less than the maximum normal operating pressure plus 95 kPa (14 psi). <strong>(T-0).</strong>`,
};

export const A3_3_7_8_2_8: DocumentNode = {
  id: "A3.3.7.8.2.8.",
  parentId: "A3.3.7.8.2.",
  bodyText: `The packaging materials and any components will be physically and chemically compatible
    with each other and the contents. <strong>(T-0).</strong>`,
};

export const A3_3_7_8_2_9: DocumentNode = {
  id: "A3.3.7.8.2.9.",
  parentId: "A3.3.7.8.2.",
  bodyText: `All valves through which the package contents could escape will be protected against unauthorized operation. <strong>(T-0).</strong>`,
};
export const A3_3_7_9: DocumentNode = {
  id: "A3.3.7.9.",
  parentId: "A3.3.7.",
  title: "Additional Packaging Design Requirements for Type A and B Packages.",
  bodyText: "",
  childNodeIds: ["A3.3.7.9.1.", "A3.3.7.9.2.", "A3.3.7.9.3."],
};

export const A3_3_7_9_1: DocumentNode = {
  id: "A3.3.7.9.1.",
  parentId: "A3.3.7.9.",
  title: "",
  bodyText:
    "In addition to meeting the general design requirements each Type A packaging must also meet the design requirements of 49 CFR Section 173.412 and test requirements of 49 CFR Sections 173.461 and 173.465.",
};

export const A3_3_7_9_2: DocumentNode = {
  id: "A3.3.7.9.2.",
  parentId: "A3.3.7.9.",
  title: "",
  bodyText:
    "Each Type B(U) or Type B(M) package must meet the design and test requirements of 10 CFR Part 71.",
};

export const A3_3_7_9_3: DocumentNode = {
  id: "A3.3.7.9.3.",
  parentId: "A3.3.7.9.",
  title: "",
  bodyText:
    "Each shipper of a DOT 7A package must maintain on file for at least 1 year after the latest shipment complete documentation of tests and an engineering evaluation or comparative data showing that the construction methods, packaging design, and materials of construction comply with that specification. Unless otherwise required, the shipper is exempt from maintaining this documentation if it is maintained by the Inventory Control Point (national stock number managing activity).",
};

export const A3_3_7_10: DocumentNode = {
  id: "A3.3.7.10.",
  parentId: "A3.3.7.",
  title: "Radiation Level and Thermal Limitations.",
  bodyText: "",
  childNodeIds: ["A3.3.7.10.1.", "A3.3.7.10.2."],
};

export const A3_3_7_10_1: DocumentNode = {
  id: "A3.3.7.10.1.",
  parentId: "A3.3.7.10.",
  title: "",
  bodyText: "Design each package of radioactive materials so that:",
  childNodeIds: ["A3.3.7.10.1.1.", "A3.3.7.10.1.2."],
};

export const A3_3_7_10_1_1: DocumentNode = {
  id: "A3.3.7.10.1.1.",
  parentId: "A3.3.7.10.1.",
  title: "",
  bodyText:
    "The radiation level is not more than 2 mSv/h (200 mrem/h) at any point on the external surface of the package. 49 CFR Section 173.441",
};

export const A3_3_7_10_1_2: DocumentNode = {
  id: "A3.3.7.10.1.2.",
  parentId: "A3.3.7.10.1.",
  title: "",
  bodyText: "The transport index is not over 10. 49 CFR Section 173.441",
};

export const A3_3_7_10_2: DocumentNode = {
  id: "A3.3.7.10.2.",
  parentId: "A3.3.7.10.",
  title: "",
  bodyText:
    "Design, construct, and load each package of radioactive material so that:",
  childNodeIds: ["A3.3.7.10.2.1.", "A3.3.7.10.2.2."],
};

export const A3_3_7_10_2_1: DocumentNode = {
  id: "A3.3.7.10.2.1.",
  parentId: "A3.3.7.10.2.",
  title: "",
  bodyText:
    "The heat generated within the package due to the radioactive contents will not, at any time during transportation, affect the integrity of the package under normal transportation conditions.",
};

export const A3_3_7_10_2_2: DocumentNode = {
  id: "A3.3.7.10.2.2.",
  parentId: "A3.3.7.10.2.",
  title: "",
  bodyText:
    "The temperature of the accessible external surfaces of the loaded package will not, assuming still air in the shade at an ambient temperature of 38 degrees C (100 degrees F), exceed either a temperature of 50 degrees C (122 degrees F) in other than an exclusive use shipment or 85 degrees C (185 degrees F) in an exclusive use shipment.",
};

export const A3_3_7_11: DocumentNode = {
  id: "A3.3.7.11.",
  parentId: "A3.3.7.",
  title: "Types of Packaging.",
  bodyText:
    "The types of packages used for radioactive material which are subject to the activity limits and material restrictions defined in A11.3., A11.5.8., A11.6.1., A11.7., and A11.10.1., and meet the corresponding requirements are as follows. Packages containing fissile material or uranium hexafluoride are subject to additional requirements (see A3.3.7.3.4. and A3.3.7.18.).",
  childNodeIds: [
    "A3.3.7.11.1.",
    "A3.3.7.11.2.",
    "A3.3.7.11.3.",
    "A3.3.7.11.4.",
    "A3.3.7.11.5.",
    "A3.3.7.11.6.",
    "A3.3.7.11.7.",
  ],
};

export const A3_3_7_11_1: DocumentNode = {
  id: "A3.3.7.11.1.",
  parentId: "A3.3.7.11.",
  bodyText: "Excepted Packages.",
};

export const A3_3_7_11_2: DocumentNode = {
  id: "A3.3.7.11.2.",
  parentId: "A3.3.7.11.",
  bodyText: "Industrial Package, Type 1 (Type IP-1 package).",
};

export const A3_3_7_11_3: DocumentNode = {
  id: "A3.3.7.11.3.",
  parentId: "A3.3.7.11.",
  bodyText: "Industrial Package, Type 2 (Type IP-2 package).",
};

export const A3_3_7_11_4: DocumentNode = {
  id: "A3.3.7.11.4.",
  parentId: "A3.3.7.11.",
  bodyText: "Industrial Package, Type 3 (Type IP-3 package).",
};

export const A3_3_7_11_5: DocumentNode = {
  id: "A3.3.7.11.5.",
  parentId: "A3.3.7.11.",
  bodyText: "Type A Packages.",
};

export const A3_3_7_11_6: DocumentNode = {
  id: "A3.3.7.11.6.",
  parentId: "A3.3.7.11.",
  bodyText: "Type B(U) and B(M) packages.",
};

export const A3_3_7_11_7: DocumentNode = {
  id: "A3.3.7.11.7.",
  parentId: "A3.3.7.11.",
  bodyText: "Type C Packages.",
};

export const A3_3_7_12: DocumentNode = {
  id: "A3.3.7.12.",
  parentId: "A3.3.7.",
  title: "Subsidiary hazards.",
  bodyText: "",
  childNodeIds: ["A3.3.7.12.1.", "A3.3.7.12.2.", "A3.3.7.12.3."],
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
    "The basic description required on the Shipper’s Declaration for Dangerous Goods must include a description of these subsidiary hazards (e.g., “3, 6.1”), the name of the constituents which most predominantly contribute to the subsidiary hazard(s), and where applicable, the packing group.",
};

export const A3_3_7_12_3: DocumentNode = {
  id: "A3.3.7.12.3.",
  parentId: "A3.3.7.12.",
  title: "",
  bodyText:
    "Transport radioactive material with a subsidiary hazard of Division 4.2 (Packing Group I) in Type B packages. Radioactive material with a subsidiary hazard of Division 2.1 is forbidden from transport on passenger aircraft. Radioactive material with a subsidiary hazard of Division 2.3 is forbidden from transport on passenger and cargo aircraft without a waiver or CAA, as appropriate.",
};

export const A3_3_7_13: DocumentNode = {
  id: "A3.3.7.13.",
  parentId: "A3.3.7.",
  title: "Radioactive Material in Excepted Packages.",
  bodyText:
    "Radioactive material in excepted Packages (UN2908 [Empty Packagings], UN2909, UN2910, and UN2911) are not regulated by this manual when prepared according to A11.5. and marked according to A14.4.6.2. If this material meets the definition and criteria of other classes/divisions, prepare and certify the material according to the applicable Identification Number (UN, NA, ID).",
};

export const A3_3_7_14: DocumentNode = {
  id: "A3.3.7.14.",
  parentId: "A3.3.7.",
  title: "Different Radionuclides in One Package.",
  bodyText:
    "When different radionuclides are packaged together in the same package, determine the total activity in accordance with 49 CFR Paragraph 173.433(d).",
};

export const A3_3_7_15: DocumentNode = {
  id: "A3.3.7.15.",
  parentId: "A3.3.7.",
  title: "Radioactive Material Packed with Other Items.",
  bodyText:
    "A package containing radioactive material must not contain any other items except such articles and documents necessary for the use of the radioactive material, provided there is no interaction between them and the packaging or the radioactive contents that would reduce the safety of the package. (T0). LSA and SCO, however, may be packed with other items.",
};

export const A3_3_7_16: DocumentNode = {
  id: "A3.3.7.16.",
  parentId: "A3.3.7.",
  title: "Overpacks Containing Radioactive Material.",
  bodyText: "",
  childNodeIds: ["A3.3.7.16.1.", "A3.3.7.16.2."],
};

export const A3_3_7_16_1: DocumentNode = {
  id: "A3.3.7.16.1.",
  parentId: "A3.3.7.16.",
  title: "",
  bodyText:
    "Packages of radioactive material may be combined together in an overpack for transport, provided that each package contained inside is packaged in accordance with this manual. Fissile material, however, which exceeds a transport index of zero must not be placed in an overpack.",
};

export const A3_3_7_16_2: DocumentNode = {
  id: "A3.3.7.16.2.",
  parentId: "A3.3.7.16.",
  title: "",
  bodyText:
    "Only the original shipper of the packages contained in an overpack is permitted to use the method of direct measurement of radiation level to determine the transport index of the overpack.",
};

export const A3_3_7_17: DocumentNode = {
  id: "A3.3.7.17.",
  parentId: "A3.3.7.",
  title: "Requirements for Foreign-Made Packages.",
  bodyText:
    'In addition to the requirements of Attachment 11, each shipper of a foreign-made Type B(U), Type B(M), Type C, Type CF, Type H(U), Type H(M) or fissile material package for which a competent authority certificate is required by the IAEA "Regulations for the Safe Transport of Radioactive Materials, No. TS-R-1” must meet the requirements of 49 CFR Section 173.473. <strong>(T-0).</strong>',
};

export const A3_3_7_18: DocumentNode = {
  id: "A3.3.7.18.",
  parentId: "A3.3.7.",
  title: "Uranium Hexafluoride (Fissile and Low Specific Activity).",
  bodyText:
    "In addition to any other applicable requirements of Attachment 11, package uranium hexafluoride, fissile or low specific activity, according to the requirements identified in 49 CFR Section 173.420:",
  childNodeIds: [
    "A3.3.7.18.1.",
    "A3.3.7.18.2.",
    "A3.3.7.18.3.",
    "A3.3.7.18.4.",
    "A3.3.7.18.5.",
    "A3.3.7.18.6.",
    "A3.3.7.18.7.",
  ],
};

export const A3_3_7_18_1: DocumentNode = {
  id: "A3.3.7.18.1.",
  parentId: "A3.3.7.18.",
  bodyText:
    "Clean packages before initial filling and during periodic inspection and tests.",
};

export const A3_3_7_18_2: DocumentNode = {
  id: "A3.3.7.18.2.",
  parentId: "A3.3.7.18.",
  bodyText:
    "Design, fabricate, inspect, test, and mark packagings according to 49 CFR Section 173.420.",
};

export const A3_3_7_18_3: DocumentNode = {
  id: "A3.3.7.18.3.",
  parentId: "A3.3.7.18.",
  bodyText:
    "Ensure uranium hexafluoride is in solid form when offered for transportation.",
};

export const A3_3_7_18_4: DocumentNode = {
  id: "A3.3.7.18.4.",
  parentId: "A3.3.7.18.",
  bodyText:
    "The volume of the solid uranium hexafluoride at 20 degrees C (68 degrees F) must not exceed 61 percent of the volumetric capacity of the package. <strong><strong>(T-0).</strong></strong>",
};

export const A3_3_7_18_5: DocumentNode = {
  id: "A3.3.7.18.5.",
  parentId: "A3.3.7.18.",
  bodyText:
    "Ensure the pressure in the package at 20 degrees C (68 degrees F) is less than 101.3kPa (14.8 psig).",
};

export const A3_3_7_18_6: DocumentNode = {
  id: "A3.3.7.18.6.",
  parentId: "A3.3.7.18.",
  bodyText:
    "Periodically inspect, test, and mark packages of uranium hexafluoride in accordance with 49 CFR Section 173.420.",
};

export const A3_3_7_18_7: DocumentNode = {
  id: "A3.3.7.18.7.",
  parentId: "A3.3.7.18.",
  bodyText:
    "Perform repairs to package(s) of uranium hexafluoride according to 49 CFR Section 173.420.",
};

export const A3_3_8: DocumentNode = {
  id: "A3.3.8.",
  parentId: "A3.3.",
  title: "Class 8.",
  childNodeIds: [
    "A3.3.8.1.",
    "A3.3.8.2.",
    "A3.3.8.3.",
    "A3.3.8.4.",
    "A3.3.8.5.",
  ],
};

export const A3_3_8_1: DocumentNode = {
  id: "A3.3.8.1.",
  parentId: "A3.3.8.",
  title: "General Handling Instructions for Corrosive Materials.",
  childNodeIds: ["A3.3.8.1.1.", "A3.3.8.1.2.", "A3.3.8.1.3.", "A3.3.8.1.4."],
};

export const A3_3_8_1_1: DocumentNode = {
  id: "A3.3.8.1.1.",
  parentId: "A3.3.8.1.",
  bodyText:
    "Store corrosive materials in a cool, well ventilated area away from sources of heat and oxidizing agents.",
};

export const A3_3_8_1_2: DocumentNode = {
  id: "A3.3.8.1.2.",
  parentId: "A3.3.8.1.",
  bodyText:
    "Both the vapor and the liquid are corrosive and irritating and may cause burns to the body and damage to aircraft.",
};

export const A3_3_8_1_3: DocumentNode = {
  id: "A3.3.8.1.3.",
  parentId: "A3.3.8.1.",
  bodyText: "Properly placard the storage area.",
};

export const A3_3_8_1_4: DocumentNode = {
  id: "A3.3.8.1.4.",
  parentId: "A3.3.8.1.",
  bodyText:
    "Ensure protective masks or respirators, rubber gloves, goggles, and other protective clothing as required are readily available, and worn when handling leaking packages. Contact Safety and/or Medical Services as appropriate for specific protective requirements.",
};

export const A3_3_8_2: DocumentNode = {
  id: "A3.3.8.2.",
  parentId: "A3.3.8.",
  title: "Packaging.",
  bodyText:
    "Unless otherwise specified by a packaging paragraph, package a liquid material identified as PG III in Table A4.1 in a container that meets the PG I or II performance level.",
};

export const A3_3_8_3: DocumentNode = {
  id: "A3.3.8.3.",
  parentId: "A3.3.8.",
  title: "Packed with Other Materials.",
  bodyText:
    "Do not pack bottles containing corrosive liquids in the same outer packaging with other hazardous materials.",
};

export const A3_3_8_4: DocumentNode = {
  id: "A3.3.8.4.",
  parentId: "A3.3.8.",
  title: "Hypochlorite Solution.",
  bodyText:
    "Hypochlorite solution is not regulated by this manual if the chemical and physical properties, when tested, do not meet the criteria established for corrosive material. Comply with paragraph A3.1.16.4. to identify non-regulated hypochlorite solutions (e.g., liquid bleaches tested according to 49 CFR Section 173.137).",
};

export const A3_3_8_5: DocumentNode = {
  id: "A3.3.8.5.",
  parentId: "A3.3.8.",
  title: "Fuel Cell Cartridges.",
  childNodeIds: ["A3.3.8.5.1.", "A3.3.8.5.2.", "A3.3.8.5.3."],
};

export const A3_3_8_5_1: DocumentNode = {
  id: "A3.3.8.5.1.",
  parentId: "A3.3.8.5.",
  bodyText:
    "Fuel cell cartridges design types using liquids as fuels must pass an internal pressure test at a pressure of 15 psig [100 kPa (gauge)] without leakage. <strong>(T-0).</strong>",
};

export const A3_3_8_5_2: DocumentNode = {
  id: "A3.3.8.5.2.",
  parentId: "A3.3.8.5.",
  bodyText:
    "Each fuel cell cartridge design type must pass a 1.2 m drop test onto an unyielding surface in the orientation most likely to result in failure of the containment system with no loss to the contents. <strong>(T-0).</strong>",
};

export const A3_3_8_5_3: DocumentNode = {
  id: "A3.3.8.5.3.",
  parentId: "A3.3.8.5.",
  bodyText:
    "A fuel cell cartridge may contain an activator provided it's fitted with two independent means of preventing unintended mixing with the fuel during transportation.",
};

export const A3_3_9: DocumentNode = {
  id: "A3.3.9.",
  parentId: "A3.3.",
  title: "Class 9.",
  bodyText: "",
  childNodeIds: [
    "A3.3.9.1.",
    "A3.3.9.2.",
    "A3.3.9.3.",
    "A3.3.9.4.",
    "A3.3.9.5.",
    "A3.3.9.6.",
    "A3.3.9.7.",
  ],
};

export const A3_3_9_1: DocumentNode = {
  id: "A3.3.9.1.",
  parentId: "A3.3.9.",
  title: "General Handling Instructions.",
  bodyText:
    "Class 9 materials present a hazard during transportation but do not meet the definition of any other hazard class. Class 9 materials present a unique and equally hazardous situation during air transport. Personnel exercise care when handling this material and ensure specific handling instructions located in the packaging paragraphs are observed.",
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

export const FigureA3_6: DocumentNode = {
  id: "Figure A3.6.",
  parentId: "A3.",
  title: "Formula for Determining Dry Ice Limitations.",
  bodyText: `
  <table border="1" style="border-collapse: collapse; width: 100%;">
    <tbody>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem; text-align: center;" colspan="2">
          <strong>X = </strong> <span style="font-style: italic;">VA(0.47)</span> / 32.3
        </td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem; text-align: left;">Where:</td>
        <td style="padding: 0.4rem; text-align: left;">
          <ul style="margin: 0; padding-left: 1.5rem;">
            <li><strong>V:</strong> Volume of aircraft</li>
            <li><strong>A:</strong> Air changes per hour</li>
            <li><strong>X:</strong> Maximum dry ice loading in pounds</li>
          </ul>
        </td>
      </tr>
    </tbody>
  </table>
  `,
};

export const FigureA3_7: DocumentNode = {
  id: "Figure A3.7.",
  parentId: "A3.",
  title: "Maximum Quantities for Dry Ice Aboard C-17 Aircraft.",
  bodyText: `
  <div style="border: 1px solid black; padding: 0.4rem">
  <table border="1" style="border-collapse: collapse; width: 100%;">
    <thead>
      <tr style="height: 4rem">
        <th style="padding: 0.4rem">Configuration</th>
        <th style="padding: 0.4rem">Maximum Amount in Pounds</th>
        <th style="padding: 0.4rem">Maximum Amount in Kilograms</th>
      </tr>
    </thead>
    <tbody>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">Two Packs High Flow Setting at 35,000 feet</td>
        <td style="padding: 0.4rem">3,430</td>
        <td style="padding: 0.4rem">1,556</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">Two Packs High Flow Setting at 10,000 feet or less</td>
        <td style="padding: 0.4rem">2,080</td>
        <td style="padding: 0.4rem">943</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">Two Packs Normal Flow Setting at 35,000 feet</td>
        <td style="padding: 0.4rem">1,880</td>
        <td style="padding: 0.4rem">853</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">Two Packs Normal Flow Setting at 10,000 feet or less</td>
        <td style="padding: 0.4rem">1,040</td>
        <td style="padding: 0.4rem">472</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">One Pack High Flow Setting at 35,000 feet</td>
        <td style="padding: 0.4rem">1,720</td>
        <td style="padding: 0.4rem">780</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">One Pack High Flow Setting Holding at 10,000 feet</td>
        <td style="padding: 0.4rem">1,040</td>
        <td style="padding: 0.4rem">472</td>
      </tr>
    </tbody>
  </table>
  <p style="margin-top: 1rem; font-style: italic;">
    Note: Above quantities are the maximum amounts for operating with no passengers in the cargo compartment. Limitation with passengers in the cargo compartment is set at 1,040 pounds (472 kilograms) for both high and normal flow.
  </p>
  </div>
  `,
};

export const FigureA3_8: DocumentNode = {
  id: "Figure A3.8.",
  parentId: "A3.",
  title: "Maximum Quantities for Dry Ice Aboard C-5 Aircraft.",
  bodyText: `
  <div style="border: 1px solid black; padding: 0.4rem">
  <table border="1" style="border-collapse: collapse; width: 100%;">
    <thead>
      <tr style="height: 4rem">
        <th style="padding: 0.4rem">Condition</th>
        <th style="padding: 0.4rem">Maximum Amount in Pounds</th>
        <th style="padding: 0.4rem">Maximum Amount in Kilograms</th>
      </tr>
    </thead>
    <tbody>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">Cruise (mach 0.5 and up) and altitudes up to 30,000 feet (Note 1)</td>
        <td style="padding: 0.4rem">4,700</td>
        <td style="padding: 0.4rem">2,132</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">Cruise (mach 0.6 and up) and altitudes up to 30,000 feet (Note 1)</td>
        <td style="padding: 0.4rem">3,120</td>
        <td style="padding: 0.4rem">1,415</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">During Non-pressurized up to 10,000 feet (Note 2)</td>
        <td style="padding: 0.4rem">6,500</td>
        <td style="padding: 0.4rem">2,948</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">During Ground Operations with one auxiliary power unit (Note 3)</td>
        <td style="padding: 0.4rem">2,950</td>
        <td style="padding: 0.4rem">1,338</td>
      </tr>
    </tbody>
  </table>
  <p style="margin-top: 1rem; font-style: italic;">
    <strong>Notes:</strong><br>
    1. Operate the Environmental Control System (ECS) with “both” air conditioning units on a “Normal” flow control valve and the “Intermediate” setting on the alternative air valve.<br>
    2. Open the auxiliary vent valve for this condition.<br>
    3. The air turbine motor is at idle. Open the auxiliary vent valve for this condition.
  </p>
  </div>
  `,
};

export const A3_3_9_6_8: DocumentNode = {
  id: "A3.3.9.6.8.",
  parentId: "A3.3.9.6.",
  title: "Aircraft on Minimum Air Changes.",
  bodyText:
    "When aircraft is on minimum air changes per hour, safe loads are drastically reduced. When the aircraft is on the ground longer than 45 minutes, recalculate the safe quantity using new numbers of air changes per hour.",
};

export const TableA3_6: DocumentNode = {
  id: "Table A3.6.",
  parentId: "A3.",
  title: "Dry Ice Limitations When Aircraft is on Minimum Air Changes.",
  bodyText: `
  <table border="1" style="border-collapse: collapse; width: 100%;">
    <thead>
      <tr style="height: 3rem">
        <th style="padding: 0.2rem">KC-135 Aircraft</th>
        <th style="padding: 0.2rem">Maximum Amount</th>
      </tr>
      <tr style="height: 3rem">
        <th style="padding: 0.2rem"></th>
        <th style="padding: 0.2rem">In Pounds</th>
        <th style="padding: 0.2rem">In Kilograms</th>
      </tr>
    </thead>
    <tbody>
      <tr style="height: 3rem">
        <td style="padding: 0.2rem">KC-135 Aircraft</td>
        <td style="padding: 0.2rem">200</td>
        <td style="padding: 0.2rem">91</td>
      </tr>
    </tbody>
  </table>
  `,
};

export const A3_3_9_6_9: DocumentNode = {
  id: "A3.3.9.6.9.",
  parentId: "A3.3.9.6.",
  title: "KC-10 Aircraft.",
  bodyText: `Dry ice may be carried in the KC-10 cargo compartment
  under the following aircraft operating conditions:`,
  childNodeIds: ["A3.3.9.6.9.1.", "A3.3.9.6.9.2.", "A3.3.9.6.9.3."],
};

export const A3_3_9_6_9_1: DocumentNode = {
  id: "A3.3.9.6.9.1.",
  parentId: "A3.3.9.6.9.",
  title: "",
  bodyText:
    'If "one" air conditioning pack is lost in flight, then accomplish emergency procedures for cabin. Turn Cargo Smoke Light on per KC-10 flight manual T.O. 1C-10(K)A-1, Section II. Include "Smoke Source is not Accessible" portion of procedure except do not put cabin pressure control in manual and do not depressurize cabin.',
};

export const A3_3_9_6_9_2: DocumentNode = {
  id: "A3.3.9.6.9.2.",
  parentId: "A3.3.9.6.9.",
  title: "",
  bodyText:
    'Environmental curtain at station 615 or 879: If "one" air conditioning pack is lost in flight, then accomplish emergency procedures for cabin, turn cargo smoke light on, mixed passenger and cargo configuration per KC-10 flight manual T.O 1C-10(k) A-1, section II, except do not initiate firefighting procedures.',
};

export const A3_3_9_6_9_3: DocumentNode = {
  id: "A3.3.9.6.9.3.",
  parentId: "A3.3.9.6.9.",
  bodyText:
    "During cargo loading, the following procedures apply to minimize carbon dioxide concentration:",
  childNodeIds: [
    "A3.3.9.6.9.3.1.",
    "A3.3.9.6.9.3.2.",
    "A3.3.9.6.9.3.3.",
    "A3.3.9.6.9.3.4.",
    "A3.3.9.6.9.3.5.",
    "Figure A3.9.",
  ],
};

export const A3_3_9_6_9_3_1: DocumentNode = {
  id: "A3.3.9.6.9.3.1.",
  parentId: "A3.3.9.6.9.3.",
  title: "",
  bodyText:
    'Ensure APU is running and "both" air conditioning packs are operating.',
};

export const A3_3_9_6_9_3_2: DocumentNode = {
  id: "A3.3.9.6.9.3.2.",
  parentId: "A3.3.9.6.9.3.",
  title: "",
  bodyText: "Open number 4 passenger service door for additional ventilation.",
};

export const A3_3_9_6_9_3_3: DocumentNode = {
  id: "A3.3.9.6.9.3.3.",
  parentId: "A3.3.9.6.9.3.",
  title: "",
  bodyText:
    "Open all air inlets in the aerial refueling operator's station and close aerial refueling operators hatch.",
};

export const A3_3_9_6_9_3_4: DocumentNode = {
  id: "A3.3.9.6.9.3.4.",
  parentId: "A3.3.9.6.9.3.",
  title: "",
  bodyText: "Ensure environmental curtain is closed before flight.",
};

export const A3_3_9_6_9_3_5: DocumentNode = {
  id: "A3.3.9.6.9.3.5.",
  parentId: "A3.3.9.6.9.3.",
  title: "",
  bodyText: "Transport maximum quantities as shown in Figure A3.10.",
};

export const FigureA3_9: DocumentNode = {
  id: "Figure A3.9.",
  parentId: "A3.",
  title: "Maximum Quantities for Dry Ice Aboard KC-10 Aircraft.",
  bodyText: `
  <table border="1" style="border-collapse: collapse; width: 100%;">
    <thead>
      <tr style="height: 4rem">
        <th style="padding: 0.4rem">Configuration</th>
        <th style="padding: 0.4rem">Maximum Amount in Pounds</th>
        <th style="padding: 0.4rem">Maximum Amount in Kilograms</th>
      </tr>
    </thead>
    <tbody>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">No environmental curtain (27 pallet all-cargo configuration):<br>Both packs operating</td>
        <td style="padding: 0.4rem">2,295</td>
        <td style="padding: 0.4rem">1,041</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">No environmental curtain (27 pallet all-cargo configuration):<br>One pack operating</td>
        <td style="padding: 0.4rem">1,251</td>
        <td style="padding: 0.4rem">568</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">Environmental curtain at station 615:<br>Both packs operating</td>
        <td style="padding: 0.4rem">1,782</td>
        <td style="padding: 0.4rem">808</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">Environmental curtain at station 615:<br>One pack operating</td>
        <td style="padding: 0.4rem">969</td>
        <td style="padding: 0.4rem">440</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">Environmental curtain at station 879:<br>Both packs operating</td>
        <td style="padding: 0.4rem">1,204</td>
        <td style="padding: 0.4rem">546</td>
      </tr>
      <tr style="height: 3rem">
        <td style="padding: 0.4rem">Environmental curtain at station 879:<br>One pack operating</td>
        <td style="padding: 0.4rem">653</td>
        <td style="padding: 0.4rem">296</td>
      </tr>
    </tbody>
  </table>
  `,
};

export const A3_3_9_6_10: DocumentNode = {
  id: "A3.3.9.6.10.",
  parentId: "A3.3.9.6.",
  title: "C-130 Aircraft.",
  bodyText: `Safety Considerations. Dry ice may be transported aboard
  C-130 Aircraft if the following conditions are met:`,
  childNodeIds: [
    "A3.3.9.6.10.1.",
    "A3.3.9.6.10.2.",
    "A3.3.9.6.10.3.",
    "A3.3.9.6.10.4.",
    "A3.3.9.6.10.5.",
    "Table A3.7.",
    "A3.3.9.6.10.6.",
    "A3.3.9.6.10.7.",
  ],
};

export const A3_3_9_6_10_1: DocumentNode = {
  id: "A3.3.9.6.10.1.",
  parentId: "A3.3.9.6.10.",
  title: "",
  bodyText:
    "Crewmembers should be instructed to monitor themselves and others for any signs/symptoms of possible overexposure to carbon dioxide gas, to include shortness of breath, dizziness, confusion, cognitive impairment/poor decisionmaking, headaches, or nausea.",
};

export const A3_3_9_6_10_2: DocumentNode = {
  id: "A3.3.9.6.10.2.",
  parentId: "A3.3.9.6.10.",
  title: "",
  bodyText:
    "Operate the Environmental Control System (ECS) with both air conditioning packs on. In the event of an air-pack failure the air exchange rate is reduced by half, which reduces the amount of allowable dry ice by half. If this occurs during flight, decrease cruise altitude to the lowest acceptable altitude for safe flight in order to enhance ventilation. Manually open the CROSS FLOW VALVE to allow maximum air interchange between the flight station and cargo compartment.",
};

export const A3_3_9_6_10_3: DocumentNode = {
  id: "A3.3.9.6.10.3.",
  parentId: "A3.3.9.6.10.",
  title: "",
  bodyText:
    "If symptoms of CO2 overexposure become evident and are not mitigated by reducing cruise altitude, the aircraft should land as soon as possible. Supplemental oxygen, using quick-don masks or similar, are to be used if necessary.",
};

export const A3_3_9_6_10_4: DocumentNode = {
  id: "A3.3.9.6.10.4.",
  parentId: "A3.3.9.6.10.",
  title: "",
  bodyText:
    "The formula presented in Figure A3.6 does not apply to C-130 aircraft.",
};

export const A3_3_9_6_10_5: DocumentNode = {
  id: "A3.3.9.6.10.5.",
  parentId: "A3.3.9.6.10.",
  title: "",
  bodyText:
    "Figure A3.11 is for C-130H variants with a quantity of two (2) 70 pound per minute air conditioning packs only.",
};

export const TableA3_7: DocumentNode = {
  id: "Table A3.7.",
  parentId: "A3.",
  title:
    "Maximum Quantities for Dry Ice Aboard C-130H Aircraft with two (2) 70 lb/min Air Packs.",
  bodyText: `
  <table border="1" style="border-collapse: collapse; width: 100%;">
    <thead>
      <tr style="height: 3rem">
        <th style="padding: 0.3rem">Altitude Ceiling [ft]</th>
        <th style="padding: 0.3rem">Allowable Amount of Dry Ice [lb]</th>
      </tr>
    </thead>
    <tbody>
      <tr style="height: 2rem">
        <td style="padding: 0.2rem">10,000</td>
        <td style="padding: 0.2rem">1,500</td>
      </tr>
      <tr style="height: 2rem">
        <td style="padding: 0.2rem">15,000</td>
        <td style="padding: 0.2rem">1,250</td>
      </tr>
      <tr style="height: 2rem">
        <td style="padding: 0.2rem">20,000</td>
        <td style="padding: 0.2rem">1,100</td>
      </tr>
      <tr style="height: 2rem">
        <td style="padding: 0.2rem">25,000</td>
        <td style="padding: 0.2rem">1,030</td>
      </tr>
      <tr style="height: 2rem">
        <td style="padding: 0.2rem">30,000</td>
        <td style="padding: 0.2rem">970</td>
      </tr>
    </tbody>
  </table>
  `,
};

export const A3_3_9_6_10_6: DocumentNode = {
  id: "A3.3.9.6.10.6.",
  parentId: "A3.3.9.6.10.",
  title: "C-130J Aircraft.",
  bodyText: "Figure A3.12 is for C-130J variants only.",
  childNodeIds: ["Table A3.8.", "A3.3.9.6.10.6.1."],
};

export const TableA3_8: DocumentNode = {
  id: "Table A3.8.",
  parentId: "A3.",
  title: "Maximum Quantities for Dry Ice Aboard C-130J Aircraft.",
  bodyText: `
  <table border="1" style="border-collapse: collapse; width: 100%;">
    <thead>
      <tr style="height: 3rem">
        <th style="padding: 0.3rem">Altitude Ceiling [ft]</th>
        <th style="padding: 0.3rem">Allowable Amount of Dry Ice [lb]</th>
      </tr>
    </thead>
    <tbody>
      <tr style="height: 2rem">
        <td style="padding: 0.2rem">10,000</td>
        <td style="padding: 0.2rem">2,470</td>
      </tr>
      <tr style="height: 2rem">
        <td style="padding: 0.2rem">15,000</td>
        <td style="padding: 0.2rem">2,080</td>
      </tr>
      <tr style="height: 2rem">
        <td style="padding: 0.2rem">20,000</td>
        <td style="padding: 0.2rem">1,830</td>
      </tr>
      <tr style="height: 2rem">
        <td style="padding: 0.2rem">25,000</td>
        <td style="padding: 0.2rem">1,710</td>
      </tr>
      <tr style="height: 2rem">
        <td style="padding: 0.2rem">30,000</td>
        <td style="padding: 0.2rem">1,620</td>
      </tr>
    </tbody>
  </table>
  `,
};

export const A3_3_9_6_10_6_1: DocumentNode = {
  id: "A3.3.9.6.10.6.1.",
  parentId: "A3.3.9.6.10.6",
  title: "",
  bodyText: `Use of wing and empennage anti-icing on C-130J aircraft
  deactivates the cargo compartment Environmental Control System. Refer to
  A3.3.9.6.10.2. when wing and empennage anti-icing is used at any time other
  than during taxi, takeoff and descent.`,
};

export const A3_3_9_6_10_7: DocumentNode = {
  id: "A3.3.9.6.10.7.",
  parentId: "A3.3.9.6.10.",
  title: "",
  bodyText: `added: For C-130 aircraft other than C-130H equipped with two
  (2) 70 pound per minute air conditioning packs and C-130J aircraft, the
  maximum allowable amount of dry ice is 600 pounds (272 kilograms) at any
  given altitude`,
};

export const A3_3_9_6_11: DocumentNode = {
  id: "A3.3.9.6.11.",
  parentId: "A3.3.9.6.",
  title: "Non-pressurized Aircraft.",
  bodyText: `For non-pressurized aircraft, the amount of dry
  ice that can be safely shipped by air depends upon the sublimation rate and ventilation
  of the aircraft. To minimize the sublimation rate, use insulated containers surrounded
  with insulating blankets and tarpaulins. Provide maximum ventilation during the
  shipment. With unpressurized cargo compartment, the quantity of dry ice that can be
  transported is unlimited if the fumes are vented overboard the aircraft.`,
};

export const A3_3_9_6_12: DocumentNode = {
  id: "A3.3.9.6.12.",
  parentId: "A3.3.9.6.",
  title: "AMC Contract Aircraft.",
  bodyText: `Do not transport more than 440 pounds (200
  kilograms) of dry ice in a cargo compartment of AMC contract aircraft without prior
  approval from the individual air carrier.`,
};

export const A3_3_9_6_13: DocumentNode = {
  id: "A3.3.9.6.13.",
  parentId: "A3.3.9.6.",
  title: "Packaging.",
  bodyText: `Use fiberboard boxes, polystyrene foam containers, or other
  suitable packaging designed and constructed to permit the release of carbon dioxide
  gas and to prevent a build-up of pressure that could rupture the packaging. Use UN
  specification packaging when required by this manual.`,
};

export const A3_3_9_7: DocumentNode = {
  id: "A3.3.9.7.",
  parentId: "A3.3.9.",
  title: "Consumer Commodities.",
  bodyText: `Ensure inner packagings containing hazardous liquids
  re-classified as a Consumer Commodity are capable of meeting internal air gauge pressure
  requirements of A3.1.7.1.`,
};

export const A3_4: DocumentNode = {
  id: "A3.4.",
  parentId: "A3.",
  title: "Household Goods (HHG) Shipments.",
  bodyText: `DTR 4500.9-R, Part IV, Personal Property
establishes requirements for the movement of HHG and specifies that hazardous materials are
not authorized for military airlift. <strong>Exception:</strong> engine power-driven equipment (motorcycle,
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

export const attachment3DocumentNodesList: DocumentNode[] = [
  Attachment3,
  A3_1,
  A3_1_1,
  A3_1_1_1,
  A3_1_1_1_1,
  A3_1_1_1_2,
  A3_1_1_1_3,
  A3_1_1_1_4,
  A3_1_1_1_5,
  A3_1_1_1_6,
  A3_1_1_1_7,
  A3_1_1_1_8,
  A3_1_1_1_9,
  A3_1_2,
  A3_1_2_1,
  A3_1_2_1_1,
  A3_1_2_1_2,
  A3_1_2_1_3,
  A3_1_2_2,
  A3_1_2_3,
  A3_1_3,
  A3_1_4,
  A3_1_5,
  A3_1_6,
  A3_1_7,
  A3_1_7_1,
  A3_1_7_1_1,
  A3_1_7_1_2,
  A3_1_7_1_3,
  A3_1_7_2,
  A3_1_7_3,
  A3_1_8,
  A3_1_9,
  A3_1_10,
  A3_1_11,
  A3_1_12,
  A3_1_12_1,
  A3_1_12_1_1,
  A3_1_12_1_2,
  A3_1_12_2,
  A3_1_13,
  TableA3_1,
  A3_1_14,
  A3_1_15,
  A3_1_16,
  A3_1_16_1,
  A3_1_16_1_1,
  A3_1_16_1_2,
  A3_1_16_2,
  A3_1_16_2_1,
  A3_1_16_2_2,
  A3_1_16_2_3,
  A3_1_16_2_3_1,
  A3_1_16_2_3_2,
  A3_1_16_2_3_3,
  A3_1_16_3,
  A3_1_16_4,
  A3_1_16_4_1,
  A3_1_16_4_2,
  A3_1_16_4_3,
  A3_1_16_4_4,
  A3_1_17,
  TableA3_2,
  A3_2,
  A3_2_1,
  A3_2_1_1,
  A3_2_1_2,
  A3_2_2,
  A3_3,
  A3_3_1,
  A3_3_1_1,
  A3_3_1_1_1,
  A3_3_1_1_2,
  A3_3_1_1_3,
  A3_3_1_1_4,
  A3_3_1_1_5,
  A3_3_1_2,
  A3_3_1_2_1,
  A3_3_1_2_2,
  A3_3_1_2_2_1,
  A3_3_1_2_2_2,
  A3_3_1_2_3,
  A3_3_1_2_4,
  A3_3_1_2_5,
  A3_3_1_2_6,
  A3_3_1_2_7,
  A3_3_1_2_8,
  A3_3_1_3,
  A3_3_1_3_1,
  A3_3_1_3_2,
  A3_3_1_3_2_1,
  A3_3_1_3_2_2,
  A3_3_1_3_2_3,
  A3_3_1_3_2_4,
  A3_3_1_3_2_5,
  A3_3_1_4,
  A3_3_1_4_1,
  A3_3_1_4_2,
  A3_3_1_4_3,
  A3_3_1_4_4,
  A3_3_1_4_5,
  A3_3_1_4_6,
  A3_3_1_4_7,
  A3_3_1_4_7_1,
  A3_3_1_4_7_2,
  A3_3_1_4_7_3,
  A3_3_1_5,
  A3_3_1_6,
  A3_3_1_7,
  A3_3_1_7_1,
  A3_3_1_7_2,
  A3_3_1_7_3,
  A3_3_1_8,
  A3_3_1_9,
  A3_3_1_9_1,
  A3_3_1_9_2,
  A3_3_1_9_2_1,
  A3_3_1_9_2_2,
  A3_3_1_9_2_3,
  A3_3_1_9_2_4,
  A3_3_1_10,
  A3_3_2,
  A3_3_2_1,
  A3_3_2_1_1,
  A3_3_2_1_2,
  A3_3_2_1_3,
  A3_3_2_1_4,
  A3_3_2_2,
  A3_3_2_2_1,
  A3_3_2_2_2,
  A3_3_2_2_3,
  A3_3_2_2_3_1,
  A3_3_2_2_3_2,
  A3_3_2_2_3_3,
  A3_3_2_2_3_4,
  A3_3_2_3,
  A3_3_2_3_1,
  A3_3_2_3_2,
  A3_3_2_3_3,
  A3_3_2_3_4,
  A3_3_2_4,
  A3_3_2_5,
  A3_3_2_6,
  A3_3_2_6_1,
  A3_3_2_6_2,
  A3_3_2_6_3,
  A3_3_2_6_4,
  A3_3_2_6_5,
  FigureA3_1,
  A3_3_2_6_6,
  A3_3_2_6_7,
  A3_3_2_6_7_1,
  A3_3_2_6_7_2,
  A3_3_2_6_7_3,
  FigureA3_2,
  A3_3_2_6_8,
  A3_3_2_6_8_1,
  A3_3_2_6_8_2,
  A3_3_2_6_8_3,
  FigureA3_3,
  FigureA3_4,
  FigureA3_5,
  A3_3_2_7,
  A3_3_2_8,
  A3_3_2_9,
  A3_3_2_9_1,
  A3_3_2_9_2,
  A3_3_2_9_3,
  A3_3_2_9_4,
  A3_3_2_9_5,
  A3_3_2_9_5_1,
  A3_3_2_9_5_2,
  A3_3_2_9_5_3,
  A3_3_2_9_6,
  A3_3_2_9_7,
  A3_3_2_9_8,
  A3_3_2_9_9,
  A3_3_2_9_10,
  A3_3_2_10,
  A3_3_2_10_1,
  A3_3_2_10_2,
  A3_3_2_10_3,
  A3_3_2_10_4,
  A3_3_2_11,
  A3_3_2_12,
  A3_3_2_13,
  A3_3_2_14,
  A3_3_2_15,
  A3_3_2_16,
  A3_3_2_16_1,
  A3_3_2_16_1_1,
  A3_3_2_16_1_2,
  A3_3_2_16_1_3,
  A3_3_2_16_1_4,
  A3_3_2_16_1_5,
  A3_3_2_16_1_6,
  A3_3_2_16_1_7,
  A3_3_2_16_1_8,
  A3_3_2_16_1_9,
  A3_3_2_16_2,
  A3_3_2_16_2_1,
  A3_3_2_16_2_2,
  A3_3_2_16_2_3,
  A3_3_2_16_2_4,
  A3_3_2_17,
  A3_3_2_17_1,
  A3_3_2_17_1_1,
  A3_3_2_17_1_2,
  A3_3_2_17_1_3,
  A3_3_2_17_2,
  A3_3_2_17_2_1,
  A3_3_2_17_2_2,
  A3_3_2_17_2_3,
  A3_3_2_17_2_4,
  A3_3_2_17_2_5,
  A3_3_2_17_2_5_1,
  A3_3_2_17_2_5_2,
  A3_3_2_17_2_5_3,
  A3_3_2_17_2_6,
  A3_3_2_17_2_6_1,
  A3_3_2_17_2_6_1_1,
  A3_3_2_17_2_6_1_2,
  A3_3_2_17_2_6_1_3,
  A3_3_2_17_2_6_1_4,
  A3_3_2_17_2_6_2,
  A3_3_2_17_2_6_2_1,
  A3_3_2_17_2_6_2_2,
  A3_3_2_17_2_6_3,
  A3_3_2_17_2_7,
  A3_3_3,
  A3_3_3_1,
  A3_3_3_2,
  A3_3_3_2_1,
  A3_3_3_2_2,
  A3_3_3_2_3,
  A3_3_3_3,
  A3_3_3_3_1,
  A3_3_3_3_2,
  A3_3_3_3_3,
  A3_3_3_3_4,
  A3_3_3_4,
  A3_3_3_5,
  A3_3_3_5_1,
  A3_3_3_5_2,
  A3_3_3_5_3,
  A3_3_3_5_4,
  A3_3_3_6,
  A3_3_3_6_1,
  A3_3_3_6_2,
  A3_3_3_6_3,
  A3_3_3_6_4,
  A3_3_3_6_5,
  A3_3_3_6_6,
  A3_3_3_7,
  A3_3_3_8,
  A3_3_3_9,
  A3_3_4,
  A3_3_4_1,
  A3_3_4_2,
  A3_3_4_3,
  A3_3_4_4,
  A3_3_4_5,
  A3_3_4_6,
  A3_3_4_6_1,
  A3_3_4_6_2,
  A3_3_4_6_3,
  A3_3_5,
  A3_3_5_1,
  A3_3_5_2,
  A3_3_5_3,
  A3_3_5_4,
  A3_3_5_4_1,
  A3_3_5_4_2,
  A3_3_5_4_3,
  A3_3_6,
  A3_3_6_1,
  A3_3_6_1_1,
  A3_3_6_1_2,
  A3_3_6_1_3,
  A3_3_6_1_4,
  A3_3_6_1_5,
  A3_3_6_1_6,
  A3_3_6_1_7,
  A3_3_6_2,
  A3_3_6_2_1,
  A3_3_6_2_2,
  A3_3_6_2_3,
  A3_3_6_2_4,
  A3_3_6_2_4_1,
  A3_3_6_2_4_2,
  A3_3_6_2_4_3,
  A3_3_6_2_5,
  A3_3_6_2_6,
  A3_3_6_2_6_1,
  A3_3_6_2_6_2,
  A3_3_6_2_6_3,
  A3_3_6_2_7,
  A3_3_6_2_8,
  A3_3_6_2_9,
  A3_3_6_2_10,
  A3_3_6_2_11,
  A3_3_6_2_12,
  A3_3_6_2_13,
  A3_3_6_3,
  A3_3_6_3_1,
  A3_3_6_3_2,
  A3_3_6_3_3,
  A3_3_6_3_4,
  A3_3_6_3_5,
  A3_3_6_3_6,
  A3_3_7,
  A3_3_7_1,
  A3_3_7_2,
  A3_3_7_2_1,
  A3_3_7_2_2,
  A3_3_7_2_3,
  A3_3_7_3,
  A3_3_7_3_1,
  A3_3_7_3_1_1,
  A3_3_7_3_1_2,
  A3_3_7_3_1_2_1,
  A3_3_7_3_1_2_2,
  A3_3_7_3_1_2_2_1,
  A3_3_7_3_1_2_2_2,
  A3_3_7_3_1_2_2_3,
  A3_3_7_3_1_2_3,
  A3_3_7_3_2,
  A3_3_7_3_2_1,
  A3_3_7_3_2_1_1,
  A3_3_7_3_2_1_2,
  A3_3_7_3_2_1_3,
  A3_3_7_3_2_1_4,
  A3_3_7_3_2_2,
  A3_3_7_3_2_2_1,
  A3_3_7_3_2_2_2,
  A3_3_7_3_2_3,
  A3_3_7_3_2_3_1,
  A3_3_7_3_2_3_2,
  A3_3_7_3_2_3_3,
  A3_3_7_3_3,
  A3_3_7_3_3_1,
  A3_3_7_3_3_1_1,
  A3_3_7_3_3_1_2,
  A3_3_7_3_3_1_3,
  A3_3_7_3_3_2,
  A3_3_7_3_3_2_1,
  A3_3_7_3_3_2_2,
  A3_3_7_3_3_2_3,
  A3_3_7_3_4,
  A3_3_7_3_4_1,
  A3_3_7_3_4_1_1,
  A3_3_7_3_4_1_2,
  A3_3_7_3_4_1_3,
  A3_3_7_3_4_1_4,
  A3_3_7_3_4_1_5,
  A3_3_7_3_4_1_6,
  A3_3_7_3_4_1_7,
  A3_3_7_3_4_1_8,
  A3_3_7_3_4_2,
  A3_3_7_3_4_2_1,
  A3_3_7_3_4_2_2,
  A3_3_7_3_4_2_3,
  A3_3_7_3_4_2_3_1,
  A3_3_7_3_4_2_3_2,
  A3_3_7_3_4_2_4,
  A3_3_7_3_4_2_5,
  A3_3_7_3_4_2_6,
  A3_3_7_3_5,
  A3_3_7_4,
  A3_3_7_4_1,
  A3_3_7_4_2,
  A3_3_7_4_2_1,
  A3_3_7_4_2_2,
  A3_3_7_4_3,
  A3_3_7_4_4,
  A3_3_7_4_4_1,
  A3_3_7_4_4_2,
  A3_3_7_4_4_3,
  A3_3_7_4_5,
  A3_3_7_5,
  A3_3_7_5_1,
  A3_3_7_5_2,
  A3_3_7_5_3,
  A3_3_7_5_4,
  A3_3_7_5_5,
  A3_3_7_5_5_1,
  A3_3_7_5_5_2,
  A3_3_7_5_5_3,
  A3_3_7_6,
  A3_3_7_6_1,
  A3_3_7_6_2,
  TableA3_3,
  A3_3_7_7,
  A3_3_7_7_1,
  A3_3_7_7_1_1,
  A3_3_7_7_1_1_1,
  A3_3_7_7_1_1_1_1,
  A3_3_7_7_1_1_1_2,
  A3_3_7_7_1_1_1_3,
  A3_3_7_7_1_1_2,
  TableA3_4,
  A3_3_7_7_1_1_3,
  A3_3_7_7_1_2,
  A3_3_7_7_2,
  A3_3_7_8,
  A3_3_7_8_1,
  A3_3_7_8_1_1,
  A3_3_7_8_1_2,
  A3_3_7_8_1_3,
  A3_3_7_8_1_4,
  A3_3_7_8_2,
  A3_3_7_8_2_1,
  A3_3_7_8_2_2,
  A3_3_7_8_2_3,
  A3_3_7_8_2_4,
  A3_3_7_8_2_5,
  A3_3_7_8_2_6,
  A3_3_7_8_2_7,
  A3_3_7_8_2_8,
  A3_3_7_8_2_9,
  A3_3_7_9,
  A3_3_7_9_1,
  A3_3_7_9_2,
  A3_3_7_9_3,
  A3_3_7_10,
  A3_3_7_10_1,
  A3_3_7_10_1_1,
  A3_3_7_10_1_2,
  A3_3_7_10_2,
  A3_3_7_10_2_1,
  A3_3_7_10_2_2,
  A3_3_7_11,
  A3_3_7_11_1,
  A3_3_7_11_2,
  A3_3_7_11_3,
  A3_3_7_11_4,
  A3_3_7_11_5,
  A3_3_7_11_6,
  A3_3_7_11_7,
  A3_3_7_12,
  A3_3_7_12_1,
  A3_3_7_12_1_1,
  A3_3_7_12_1_2,
  A3_3_7_12_2,
  A3_3_7_12_3,
  A3_3_7_13,
  A3_3_7_14,
  A3_3_7_15,
  A3_3_7_16,
  A3_3_7_16_1,
  A3_3_7_16_2,
  A3_3_7_17,
  A3_3_7_18,
  A3_3_7_18_1,
  A3_3_7_18_2,
  A3_3_7_18_3,
  A3_3_7_18_4,
  A3_3_7_18_5,
  A3_3_7_18_6,
  A3_3_7_18_7,
  A3_3_8,
  A3_3_8_1,
  A3_3_8_1_1,
  A3_3_8_1_2,
  A3_3_8_1_3,
  A3_3_8_1_4,
  A3_3_8_2,
  A3_3_8_3,
  A3_3_8_4,
  A3_3_8_5,
  A3_3_8_5_1,
  A3_3_8_5_2,
  A3_3_8_5_3,
  A3_3_9,
  A3_3_9_1,
  A3_3_9_2,
  A3_3_9_2_1,
  A3_3_9_2_1_1,
  A3_3_9_2_1_2,
  A3_3_9_2_1_3,
  A3_3_9_2_1_4,
  A3_3_9_2_1_4_1,
  A3_3_9_2_1_4_2,
  A3_3_9_2_1_4_3,
  A3_3_9_2_2,
  A3_3_9_2_3,
  A3_3_9_2_3_1,
  A3_3_9_2_3_2,
  A3_3_9_2_3_3,
  A3_3_9_2_3_3_1,
  A3_3_9_2_3_3_2,
  A3_3_9_2_3_3_3,
  A3_3_9_2_3_3_4,
  A3_3_9_2_3_3_5,
  TableA3_5,
  A3_3_9_2_3_4,
  A3_3_9_2_3_5,
  A3_3_9_2_4,
  A3_3_9_3,
  A3_3_9_4,
  A3_3_9_4_1,
  A3_3_9_4_2,
  A3_3_9_4_3,
  A3_3_9_4_4,
  A3_3_9_5,
  A3_3_9_5_1,
  A3_3_9_5_2,
  A3_3_9_5_3,
  A3_3_9_5_4,
  A3_3_9_6,
  A3_3_9_6_1,
  A3_3_9_6_2,
  A3_3_9_6_3,
  A3_3_9_6_4,
  A3_3_9_6_5,
  A3_3_9_6_6,
  A3_3_9_6_7,
  FigureA3_6,
  FigureA3_7,
  FigureA3_8,
  A3_3_9_6_8,
  TableA3_6,
  A3_3_9_6_9,
  A3_3_9_6_9_1,
  A3_3_9_6_9_2,
  A3_3_9_6_9_3,
  A3_3_9_6_9_3_1,
  A3_3_9_6_9_3_2,
  A3_3_9_6_9_3_3,
  A3_3_9_6_9_3_4,
  A3_3_9_6_9_3_5,
  FigureA3_9,
  A3_3_9_6_10,
  A3_3_9_6_10_1,
  A3_3_9_6_10_2,
  A3_3_9_6_10_3,
  A3_3_9_6_10_4,
  A3_3_9_6_10_5,
  TableA3_7,
  A3_3_9_6_10_6,
  TableA3_8,
  A3_3_9_6_10_6_1,
  A3_3_9_6_10_7,
  A3_3_9_6_11,
  A3_3_9_6_12,
  A3_3_9_6_13,
  A3_3_9_7,
  A3_4,
  A3_4_1,
  A3_4_2,
  A3_4_3,
  A3_4_4,
  A3_4_5,
  A3_4_6,
];
