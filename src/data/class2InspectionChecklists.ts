/**
 * AFMAN 24-604 Attachment 6 Inspection Checklists for Class 2 (Compressed Gases)
 *
 * This file contains inspection checklists for sections A6.2 through A6.28.
 * Each section corresponds to a specific type of compressed gas packaging requirement.
 *
 * Source: AFMAN 24-604 Attachment 6
 */

export interface InspectionCondition {
  id: string;
  label: string;
  description: string;
  afmanRef: string;
  formField: "19" | "40";
}

export interface ChecklistSection {
  paragraphId: string;
  title: string;
  description: string;
  conditions: InspectionCondition[];
}

export const CLASS2_CHECKLISTS: Record<string, ChecklistSection> = {
  "A6.2": {
    paragraphId: "A6.2",
    title: "Aerosols",
    description:
      "Aerosols meeting the definition of Consumer Commodity packaging requirements",
    conditions: [
      {
        id: "a6.2-gross-weight",
        label: "Package gross weight ≤ 30 kg (66 lbs)",
        description:
          "The complete package must not exceed 30 kg (66 lbs) gross weight.",
        afmanRef: "AFMAN 24-604 A6.2",
      },
      {
        id: "a6.2-pressure-limit",
        label: "Pressure ≤ 970 kPa at 55°C (140 psig at 130°F)",
        description:
          "Pressure in the receptacle must not exceed 970 kPa at 55 degrees C (140 psig at 130 degrees F).",
        afmanRef: "AFMAN 24-604 A6.2",
      },
      {
        id: "a6.2-liquid-content",
        label: "Liquid content does not completely fill receptacle at 55°C",
        description:
          "The liquid content of the product and gas must not completely fill the receptacle at 55 degrees C (130 degrees F).",
        afmanRef: "AFMAN 24-604 A6.2",
      },
      {
        id: "a6.2-outer-packaging-performance",
        label: "Outer packaging meets limited quantity performance standards",
        description:
          "The outer packaging must be capable of meeting the limited quantity performance standards outlined in A19.3.4.",
        afmanRef: "AFMAN 24-604 A6.2",
      },
      {
        id: "a6.2-heat-test-large",
        label: "Aerosols >120 mL heat tested without defects",
        description:
          "Each aerosol exceeding 120 mL (4 fluid ounce) capacity must have been heated until the pressure in the aerosol is equivalent to the equilibrium pressure of the contents at 55 degrees C (130 degrees F) without evidence of leakage, distortion, or other defects.",
        afmanRef: "AFMAN 24-604 A6.2",
      },
      {
        id: "a6.2-lot-testing",
        label: "One aerosol per 500 lot heat tested",
        description:
          "One aerosol out of each lot of 500 or less, filled for shipment, must be heated until the pressure in the container is equivalent to the equilibrium pressure of the contents at 55 degrees C (130 degrees F) without evidence of leakage, distortion, or other defects.",
        afmanRef: "AFMAN 24-604 A6.2",
      },
      {
        id: "a6.2-pressure-1245kpa",
        label: "Pressure ≤ 1245 kPa with 1.5x burst capability",
        description:
          "Pressure in the aerosol container must not exceed 1245 kPa at 55 degrees C (180 psig at 130 degrees F) and each receptacle must be capable of withstanding without bursting a pressure of at least 1.5 times the equilibrium pressure of the contents at 55 degrees C (130 degrees F).",
        afmanRef: "AFMAN 24-604 A6.2",
      },
      {
        id: "a6.2-pressure-1500kpa",
        label: "Pressure ≤ 1500 kPa with 1.5x burst capability (if applicable)",
        description:
          "Pressure in the aerosol container must not exceed 1500 kPa at 55 degrees C (217 psig at 130 degrees F) and each receptacle must be capable of withstanding without bursting a pressure of at least 1.5 times the equilibrium pressure of the contents at 55 degrees C (130 degrees F).",
        afmanRef: "AFMAN 24-604 A6.2",
      },
      {
        id: "a6.2-proper-packaging",
        label: "Packaged per A6.2.1 requirements",
        description:
          'Package aerosol products identified under the proper shipping name "Aerosols" as follows: A6.2.1.',
        afmanRef: "AFMAN 24-604 A6.2.1",
      },
      {
        id: "a6.2-outer-packaging-tight",
        label: "Tightly packed in strong outer packaging",
        description:
          "Tightly pack aerosols in a strong outer packaging capable of meeting packaging performance test outlined in A19.3.4.",
        afmanRef: "AFMAN 24-604 A6.2",
      },
    ],
  },

  "A6.3": {
    paragraphId: "A6.3",
    title: "Small Receptacles Containing Compressed Gas",
    description: "Packaging requirements for small compressed gas receptacles",
    conditions: [
      {
        id: "a6.3-gross-weight",
        label: "Package gross weight ≤ 30 kg (66 lbs)",
        description: "Each package must not exceed 30 kg (66 lbs) gross weight.",
        afmanRef: "AFMAN 24-604 A6.3",
      },
      {
        id: "a6.3-cylinder-spec",
        label: "Cylinder complies with 49 CFR Part 178",
        description:
          "Cylinder must comply with one of the cylinder specifications in 49 CFR Part 178, and be authorized for use in A6.6 or Table A6.1.",
        afmanRef: "AFMAN 24-604 A6.3",
      },
      {
        id: "a6.3-filling-requirements",
        label: "Cylinder complies with filling requirements A3.3.2.6",
        description:
          "Cylinder must comply with the filling requirements of A3.3.2.6.",
        afmanRef: "AFMAN 24-604 A6.3",
      },
      {
        id: "a6.3-pressure-limit",
        label: "Pressure ≤ 482.6 kPa at 21°C (70 psig at 70°F)",
        description:
          "Pressure in the container must not exceed 482.6 kPa at 21 degrees C (70 psig at 70 degrees F).",
        afmanRef: "AFMAN 24-604 A6.3",
      },
      {
        id: "a6.3-liquid-fill",
        label: "Liquid portion does not completely fill container at 55°C",
        description:
          "The liquid portion of the gas must not completely fill the container at 55 degrees C (130 degrees F).",
        afmanRef: "AFMAN 24-604 A6.3",
      },
      {
        id: "a6.3-burst-pressure-refillable",
        label: "Refillable container burst pressure ≥ 4x charged pressure",
        description:
          "Each refillable inside container must be designed and fabricated with a burst pressure of not less than four times its charged pressure at 55 degrees C (130 degrees F).",
        afmanRef: "AFMAN 24-604 A6.3",
      },
      {
        id: "a6.3-non-pressurized-samples",
        label: "Non-pressurized gas samples ≤ 105 kPa absolute",
        description:
          "Non-pressurized gas samples must be transported when its pressure corresponding to ambient atmospheric pressure in the container is not more than 105 kPa (15.22 psia) absolute.",
        afmanRef: "AFMAN 24-604 A6.3",
      },
      {
        id: "a6.3-burst-pressure-nonrefillable",
        label: "Non-refillable container burst pressure ≥ 4x charged pressure",
        description:
          "The completely assembled non-refillable container must be designed and fabricated with a burst pressure of not less than four times its charged pressure at 55 degrees C (130 degrees F).",
        afmanRef: "AFMAN 24-604 A6.3",
      },
      {
        id: "a6.3-container-capacity",
        label: "Containers ≤ 120 mL capacity (except lighter refills)",
        description:
          "Use containers, except lighter refills, of not more than 120 mL (4 fluid ounces, 7.22 cubic inches or less) capacity each.",
        afmanRef: "AFMAN 24-604 A6.3",
      },
      {
        id: "a6.3-electronic-tubes",
        label: "Electronic tubes ≤ 489 mL, ≤ 241 kPa",
        description:
          "Package electronic tubes of not more than 489 mL (30 cubic inch) volume charged with gas to a pressure of not more than 241 kPa (35 psig).",
        afmanRef: "AFMAN 24-604 A6.3",
      },
    ],
  },

  "A6.4": {
    paragraphId: "A6.4",
    title: "Liquefied Compressed Gases",
    description: "Packaging requirements for liquefied compressed gases",
    conditions: [
      {
        id: "a6.4-handling-requirements",
        label: "Compliance with general handling requirements A3.1.7.2",
        description:
          "Ensure compliance with general handling requirements in A3.1.7.2.",
        afmanRef: "AFMAN 24-604 A6.4",
      },
      {
        id: "a6.4-pressure-21c",
        label: "Pressure ≤ 599 kPa at 21°C (87 psia at 70°F)",
        description:
          "Pressure in the container must not exceed 599 kPa at 21 degrees C (87 psia at 70 degrees F).",
        afmanRef: "AFMAN 24-604 A6.4",
      },
      {
        id: "a6.4-pressure-54c",
        label: "Pressure ≤ 999 kPa at 54°C (145 psia at 130°F)",
        description:
          "Pressure in the container must not exceed 999 kPa at 54 degrees C (145 psia at 130 degrees F).",
        afmanRef: "AFMAN 24-604 A6.4",
      },
      {
        id: "a6.4-dot-3al-restriction",
        label: "DOT 3AL cylinders not used for Class 8 materials",
        description:
          "DOT 3AL cylinders must not be used for any material with a primary or subsidiary hazard of Class 8.",
        afmanRef: "AFMAN 24-604 A6.4",
      },
      {
        id: "a6.4-liquid-content",
        label: "Liquid content does not completely fill container at 54°C",
        description:
          "The liquid content of the material and gas must not completely fill the container at 54 degrees C (130 degrees F).",
        afmanRef: "AFMAN 24-604 A6.4",
      },
      {
        id: "a6.4-metal-container-burst",
        label: "Metal container withstands 1.5x pressure at 54°C",
        description:
          "Any metal container must be capable of withstanding a pressure of 1 1/2 times the pressure of the content at 54 degrees C (130 degrees F) without bursting.",
        afmanRef: "AFMAN 24-604 A6.4",
      },
      {
        id: "a6.4-dot-4al-compliance",
        label: "DOT 4AL cylinders per 49 CFR 173.304a(e)",
        description:
          "Ship in DOT 4AL cylinders in accordance with 49 CFR Subparagraph 173.304a(e).",
        afmanRef: "AFMAN 24-604 A6.4",
      },
      {
        id: "a6.4-refrigerant-gases",
        label: "Refrigerant gases in prescribed cylinders",
        description:
          "Ship refrigerant gases that are nonpoisonous and nonflammable in cylinders prescribed in A6.4.1.",
        afmanRef: "AFMAN 24-604 A6.4",
      },
      {
        id: "a6.4-high-pressure-dot2p",
        label: "DOT 2P container for pressure > 999 kPa at 54°C",
        description:
          "If the pressure exceeds 999 kPa at 54 degrees C (145 psia at 130 degrees F) use a DOT 2P container.",
        afmanRef: "AFMAN 24-604 A6.4",
      },
      {
        id: "a6.4-table-a6.1-compliance",
        label: "Compliance with Table A6.1 requirements",
        description:
          "Ship liquefied compressed gases, including nontoxic and nonflammable mixtures, in accordance with the filling, pressure, and DOT cylinder specification requirements of Table A6.1.",
        afmanRef: "AFMAN 24-604 A6.4",
      },
    ],
  },

  "A6.5": {
    paragraphId: "A6.5",
    title: "Nonliquefied Compressed Gases",
    description: "Packaging requirements for nonliquefied compressed gases",
    conditions: [
      {
        id: "a6.5-pressure-relief",
        label: "Pressure relief device per 49 CFR 173.301(f)",
        description:
          "Cylinders must be equipped with a pressure relief device in accordance with 49 CFR Paragraph 173.301(f) and, DOT specification cylinders or for the UN pressure receptacles prior to initial use.",
        afmanRef: "AFMAN 24-604 A6.5",
      },
      {
        id: "a6.5-diborane-density",
        label: "Diborane filling density ≤ 7%",
        description:
          "Ensure the maximum filling density of the diborane does not exceed 7 percent.",
        afmanRef: "AFMAN 24-604 A6.5",
      },
      {
        id: "a6.5-flammable-volume",
        label: "Flammable gas internal volume ≤ 1.23 L (75 cu in)",
        description:
          "When used for flammable gases, the internal volume must not exceed 1.23 L (75 cubic inches).",
        afmanRef: "AFMAN 24-604 A6.5",
      },
      {
        id: "a6.5-oxygen-service",
        label: "Oxygen service cylinders per 49 CFR 173.302a(a)(5)",
        description:
          "When used in oxygen service, the cylinders must comply with 49 CFR Subparagraph 173.302a(a)(5).",
        afmanRef: "AFMAN 24-604 A6.5",
      },
      {
        id: "a6.5-pressure-limit",
        label: "Pressure ≤ 20,684 kPa (3000 psig) at 21°C",
        description:
          "The pressure in each cylinder must not exceed 20,684 kPa (3000 psig) at 21 degrees C (70 degrees F).",
        afmanRef: "AFMAN 24-604 A6.5",
      },
      {
        id: "a6.5-chlorine-limit",
        label: "Chlorine cylinders ≤ 150 lbs (post-1935)",
        description:
          "Cylinders purchased after November 1, 1935 and charged with chlorine must not contain over 150 pounds of gas.",
        afmanRef: "AFMAN 24-604 A6.5",
      },
      {
        id: "a6.5-dot-3al-valves",
        label: "DOT-3AL cylinders with brass/stainless valves, cleaned",
        description:
          "Ensure DOT-3AL cylinders are equipped with brass or stainless steel valves and cleaned in compliance with Federal Specification RR-C-901c.",
        afmanRef: "AFMAN 24-604 A6.5",
      },
      {
        id: "a6.5-charge-limit",
        label: "Charge ≤ 2758 kPa (400 psig), contents ≤ 2.7 kg (6 lbs)",
        description:
          "Do not charge cylinders over 2758 kPa at 21 degrees C (400 psig at 70 degrees F) and ensure contents do not exceed 2.7 kg (6 pounds) of gas.",
        afmanRef: "AFMAN 24-604 A6.5",
      },
      {
        id: "a6.5-cylinder-cleaning",
        label: "Cylinder cleaned per DLAI 4145.25 or MIL-STD-1411",
        description:
          "Each cylinder must be cleaned to comply with the requirements of DLAI 4145.25 or MIL-STD-1411, Inspection and Maintenance of Compressed Gas Cylinders.",
        afmanRef: "AFMAN 24-604 A6.5",
      },
      {
        id: "a6.5-rupture-disc-3ht",
        label: "DOT 3HT rupture disc burst pressure = 90% of test pressure",
        description:
          "The rated burst pressure of a rupture disc for a DOT 3HT cylinder must be 90% of the cylinder minimum test pressure with a tolerance of plus zero to minus 10%.",
        afmanRef: "AFMAN 24-604 A6.5",
      },
      {
        id: "a6.5-methane-purity",
        label: "Methane ≥ 98% purity, free of corroding components",
        description:
          "When used in methane service, the methane must be a nonliquefied gas with a minimum purity of 98.0 percent methane and which is commercially free of corroding components.",
        afmanRef: "AFMAN 24-604 A6.5",
      },
    ],
  },

  "A6.6": {
    paragraphId: "A6.6",
    title: "Liquefied Petroleum Gas",
    description: "Packaging requirements for liquefied petroleum gas (LPG)",
    conditions: [
      {
        id: "a6.6-dot39-volume",
        label: "DOT 39 cylinder internal volume ≤ 1.23 L (75 cu in)",
        description:
          "Ensure the internal volume of DOT 39 cylinders is not over 1.23 L (75 cubic inches).",
        afmanRef: "AFMAN 24-604 A6.6",
      },
      {
        id: "a6.6-heat-test",
        label: "Container heat tested to 54°C (130°F) without defects",
        description:
          "Each completed container filled for shipment must have been heated until contents reached a minimum temperature of 54 degrees C (130 degrees F) without evidence of leakage, distortion, or other defects.",
        afmanRef: "AFMAN 24-604 A6.6",
      },
      {
        id: "a6.6-cylinder-types",
        label: "Proper DOT cylinder specification used",
        description:
          "Use DOT 3, 3A, 3AA, 3AL, 3B, 3E, 4B, 4BA, 4B240ET, 4BW, 4E, or 39, cylinders.",
        afmanRef: "AFMAN 24-604 A6.6.1",
      },
      {
        id: "a6.6-2p-2q-containers",
        label: "DOT 2P/2Q containers in protective boxes",
        description:
          "Use DOT 2P or 2Q containers, packed in strong wooden or fiberboard boxes designed to protect valves from damage or accidental functioning under normal transportation conditions.",
        afmanRef: "AFMAN 24-604 A6.6",
      },
      {
        id: "a6.6-2p-2q-capacity",
        label: "DOT 2P/2Q containers ≤ 31.83 cu in capacity",
        description:
          "DOT 2P or 2Q containers with a maximum capacity of 31.83 cubic inches are authorized under the following conditions: A6.6.2.1.",
        afmanRef: "AFMAN 24-604 A6.6.2.1",
      },
      {
        id: "a6.6-filling-pressure-241",
        label: "Filling pressure ≤ 241 kPa at 21°C, ≤ 689.5 kPa at 54°C",
        description:
          "Maximum filling pressure of 241 kPa (35 psig) at 21 degrees C (70 degrees F) and 689.5 kPa (100 psig) at 54 degrees C (130 degrees F).",
        afmanRef: "AFMAN 24-604 A6.6",
      },
      {
        id: "a6.6-filling-pressure-310",
        label: "Filling pressure ≤ 310.3 kPa with safety device",
        description:
          "Maximum filling pressure of 310.3 kPa (45 psig) at 21 degrees C (70 degrees F), and 724 kPa (105 psig) at 54 degrees C (130 degrees F) when equipped with safety devices which prevents rupture of the container and dangerous projection of a closing device when it is exposed to fire.",
        afmanRef: "AFMAN 24-604 A6.6",
      },
    ],
  },

  "A6.7": {
    paragraphId: "A6.7",
    title: "Fire Extinguishers",
    description: "Packaging requirements for fire extinguishers",
    conditions: [
      {
        id: "a6.7-pressure-limit",
        label: "Pressure ≤ 1660 kPa at 21°C (241 psig at 70°F)",
        description:
          "Must not contain more than 1660 kPa at 21 degrees C (241 psig at 70 degrees F).",
        afmanRef: "AFMAN 24-604 A6.7",
      },
      {
        id: "a6.7-large-no-liquefied",
        label: "Fire extinguishers >900 mL must not contain liquefied gas",
        description:
          "Fire extinguishers over 900 mL (35 cubic inches) must not contain liquefied compressed gas.",
        afmanRef: "AFMAN 24-604 A6.7",
      },
      {
        id: "a6.7-retest-requirements",
        label: "Subsequent shipments meet 29 CFR 1910.157(e) retest",
        description:
          "For any subsequent shipments, they must meet retest requirements of 29 CFR Paragraph 1910.157(e).",
        afmanRef: "AFMAN 24-604 A6.7",
      },
      {
        id: "a6.7-metal-container-burst",
        label: "Metal container withstands 1.5x equilibrium pressure",
        description:
          "The metal container must be capable of withstanding, without bursting, a pressure of one and one-half times the equilibrium pressure of the contents at 55 degrees C (130 degrees F).",
        afmanRef: "AFMAN 24-604 A6.7",
      },
      {
        id: "a6.7-burst-pressure-6x",
        label: "Post-1976 units: burst pressure ≥ 6x charged pressure",
        description:
          "Fire extinguishers manufactured on and after 1 January 1976 must be designed and fabricated with a burst pressure not less than six times its charged pressure at 21 degrees C (70 degrees F).",
        afmanRef: "AFMAN 24-604 A6.7",
      },
      {
        id: "a6.7-small-fill-limit",
        label: "Units ≤900 mL: liquid does not completely fill at 55°C",
        description:
          "For fire extinguishers not over 900 mL (55 cubic inch) capacity, the liquid portion of the gas plus any additional liquid or solid must not completely fill the container at 55 degrees C (130 degrees F).",
        afmanRef: "AFMAN 24-604 A6.7",
      },
      {
        id: "a6.7-inner-container-heat-test",
        label: "Inner container heat tested to 55°C without defects",
        description:
          "Each completed inner container filled for shipment must have been heated until the pressure in the container is equivalent to the equilibrium pressure of the contents at 55 degrees C (130 degrees F) without evidence of leakage, distortion, or other defect.",
        afmanRef: "AFMAN 24-604 A6.7",
      },
      {
        id: "a6.7-dot-cylinders",
        label: "DOT specification cylinders per A6.7.1",
        description: "Ship fire extinguishers in DOT specification cylinders identified in paragraphs A6.7.1.",
        afmanRef: "AFMAN 24-604 A6.7.1",
      },
      {
        id: "a6.7-2p-2q-inner",
        label: "DOT 2P/2Q inner nonrefillable metal containers",
        description:
          "Use DOT 2P or 2Q inner nonrefillable metal containers provided: A6.7.2.1.",
        afmanRef: "AFMAN 24-604 A6.7.2.1",
      },
      {
        id: "a6.7-high-pressure-2q",
        label: "DOT 2Q for pressure > 1100 kPa at 55°C",
        description:
          "If the pressure exceeds 1100 kPa (160 psig) at 55 degrees C (130 degrees F) use a DOT 2Q inner metal container.",
        afmanRef: "AFMAN 24-604 A6.7",
      },
    ],
  },

  "A6.8": {
    paragraphId: "A6.8",
    title: "Refrigerating Machines, Air Conditioners",
    description:
      "Packaging requirements for refrigerating machines, air conditioners, and pressurized hydraulic articles",
    conditions: [
      {
        id: "a6.8-refrigerant-limits",
        label: "Refrigerant quantity within limits",
        description:
          "Machines containing two or more charged vessels may not contain more than 907 kg (2,000 pounds) of Group 1 refrigerant, or more than 45.4 kg (100 pounds) of refrigerant other than Group 1.",
        afmanRef: "AFMAN 24-604 A6.8",
      },
      {
        id: "a6.8-fluid-space",
        label: "Article fluid space ≤ 41L (2,500 cu in)",
        description:
          "Each article must have a fluid space not exceeding 41L (2,500 cubic inches) under stored pressure.",
        afmanRef: "AFMAN 24-604 A6.8",
      },
      {
        id: "a6.8-inside-package",
        label: "Ship as inside package",
        description: "Ship each article as an inside package.",
        afmanRef: "AFMAN 24-604 A6.8",
      },
      {
        id: "a6.8-ansi-ashrae-test",
        label: "Parts tested under ANSI/ASHRAE Standard 15",
        description:
          "All parts subject to refrigerant pressure during shipment are tested under ANSI/ ASHRAE Standard 15.",
        afmanRef: "AFMAN 24-604 A6.8",
      },
      {
        id: "a6.8-safety-relief",
        label: "Safety relief device per ANSI/ASHRAE Standard 15",
        description:
          "Each pressure vessel is equipped with a safety relief device meeting the requirements of ANSI/ASHRAE Standard 15.",
        afmanRef: "AFMAN 24-604 A6.8",
      },
      {
        id: "a6.8-liquid-fill",
        label: "Liquid refrigerant does not completely fill vessel at 55°C",
        description:
          "The liquid portion of refrigerant, if any, does not completely fill any pressure vessel at 55 degrees C (130 degrees F).",
        afmanRef: "AFMAN 24-604 A6.8",
      },
      {
        id: "a6.8-low-pressure-conditions",
        label: "Low pressure (≤1380 kPa) conditions apply",
        description:
          "When charged to not more than 1380 kPa (200 psig) at 21 degrees C (70 degrees F), the following conditions apply: A6.8.2.2.1.",
        afmanRef: "AFMAN 24-604 A6.8.2.2.1",
      },
      {
        id: "a6.8-high-pressure-conditions",
        label: "High pressure (>1380 kPa) conditions apply",
        description:
          "When charged over 1380 kPa (200 psig) at 21 degrees C (70 degrees F) the following conditions apply: A6.8.2.3.1.",
        afmanRef: "AFMAN 24-604 A6.8.2.3.1",
      },
      {
        id: "a6.8-group-a1-limit",
        label: "Group A1 refrigerant ≤ 2268 kg, other ≤ 22.7 kg",
        description:
          "Each pressure vessel is charged to not more than 2268 kg (5,000 pounds) of Group A1 refrigerant as classified in ANSI/ASHRAE Standard 15, or not more than 22.7 kg (50 pounds) of refrigerant other than Group A1.",
        afmanRef: "AFMAN 24-604 A6.8",
      },
      {
        id: "a6.8-vessel-manufacture",
        label: "Pressure vessels per ANSI/ASHRAE or ASME",
        description:
          "Pressure vessels are manufactured, inspected, and tested according to ANSI/ASHRAE Standard 15, or when over 152.4 mm (6 inches) internal diameter, according to American Society of Mechanical Engineers (ASME) Code.",
        afmanRef: "AFMAN 24-604 A6.8",
      },
      {
        id: "a6.8-article-test",
        label: "Article tested to 3x charged pressure (min 830 kPa)",
        description:
          "Test each article, without evidence of failure or damage, to at least three times its charged pressure at 21 degrees C (70 degrees F) but not less than 120 psig (830 kPa) before initial shipment and before each refilling and reshipment.",
        afmanRef: "AFMAN 24-604 A6.8",
      },
    ],
  },

  "A6.9": {
    paragraphId: "A6.9",
    title: "Acetylene Gas",
    description: "Packaging requirements for acetylene gas",
    conditions: [
      {
        id: "a6.9-49cfr-compliance",
        label: "Cylinders comply with 49 CFR 173.303(a)-(e)",
        description:
          "Ensure cylinders comply with the provisions of 49 CFR Paragraphs 173.303(a) through (e).",
        afmanRef: "AFMAN 24-604 A6.9",
      },
      {
        id: "a6.9-porous-material",
        label: "Metal shell filled with porous material and solvent",
        description:
          "Ensure the cylinders consist of metal shells filled with a porous material, and this material is charged with a suitable solvent as identified in 49 CFR Sections 178.59 or 178.60 as appropriate.",
        afmanRef: "AFMAN 24-604 A6.9",
      },
      {
        id: "a6.9-dot-8-cylinders",
        label: "DOT 8 or 8AL cylinders with required provisions",
        description:
          "Ship in DOT 8 or 8AL cylinders with the following provisions: A6.9.1.1.",
        afmanRef: "AFMAN 24-604 A6.9.1.1",
      },
    ],
  },

  "A6.10": {
    paragraphId: "A6.10",
    title: "Cigarette Lighters",
    description:
      "Packaging requirements for cigarette lighters or similar devices charged with fuel",
    conditions: [
      {
        id: "a6.10-refill-no-ignition",
        label: "Lighter refills have no ignition element, have release device",
        description:
          "Lighter refills may not contain an ignition element but must contain a release device.",
        afmanRef: "AFMAN 24-604 A6.10",
      },
      {
        id: "a6.10-refill-capacity",
        label: "Refills ≤ 4 fl oz capacity, ≤ 65g Division 2.1 fuel",
        description:
          "Lighter refills may not exceed 4 fluid ounces capacity (7.22 cubic inches) or contain more than 65 grams of a Division 2.1 fuel.",
        afmanRef: "AFMAN 24-604 A6.10",
      },
      {
        id: "a6.10-liquid-fill",
        label: "Liquid portion ≤ 85% volumetric capacity at 15°C",
        description:
          "The liquid portion of the gas may not be over 85 percent of the volumetric capacity of each chamber at 15 degrees C (59 degrees F).",
        afmanRef: "AFMAN 24-604 A6.10",
      },
      {
        id: "a6.10-pressure-capability",
        label: "Device withstands 2x vapor pressure at 55°C",
        description:
          "Each device including closures must be capable of withstanding, without leakage or rupture, an internal pressure of at least two times the vapor pressure of the fuel at 55 degrees C (130 degrees F).",
        afmanRef: "AFMAN 24-604 A6.10",
      },
      {
        id: "a6.10-refill-packaging",
        label: "Refills in rigid UN PG II outer packaging",
        description:
          "Pack lighter refills tightly and secure against movement in any rigid non-bulk UN specification outer packaging authorized in 49 CFR Part 178 at the Packing Group II performance level.",
        afmanRef: "AFMAN 24-604 A6.10",
      },
      {
        id: "a6.10-lighter-packaging",
        label: "Lighters in rigid UN PG II outer packaging",
        description:
          "Pack lighters and their inner packagings tightly and secure against movement in any rigid non-bulk UN specification outer packaging authorized in 49 CFR Part 178 at the Packing Group II performance level.",
        afmanRef: "AFMAN 24-604 A6.10",
      },
      {
        id: "a6.10-plastic-tray-partition",
        label: "Plastic tray requires partition to prevent friction",
        description:
          "If lighters are packed vertically in a plastic tray, use a plastic, fiberboard or paperboard partition to prevent friction between the ignition device and the inner packaging.",
        afmanRef: "AFMAN 24-604 A6.10",
      },
      {
        id: "a6.10-ignition-protection",
        label: "Ignition device and gas lever protected",
        description:
          "The ignition device and gas control lever of each lighter must be designed, or securely sealed, taped, or otherwise fastened or packaged to protect against accidental functioning or leakage of the contents during transport.",
        afmanRef: "AFMAN 24-604 A6.10",
      },
      {
        id: "a6.10-design-approval",
        label: "Device design and packaging approved per 2.3",
        description:
          "Do not ship any package containing a cigarette lighter or other similar ignition device charged with fuel and equipped with an ignition element, or any self-lighting cigarette, unless the design of the device and its packaging has been approved according to 2.3.",
        afmanRef: "AFMAN 24-604 A6.10",
      },
    ],
  },

  "A6.11": {
    paragraphId: "A6.11",
    title: "Cryogenic Liquids",
    description: "Packaging requirements for cryogenic liquids",
    conditions: [
      {
        id: "a6.11-overboard-vent",
        label: "Container connected to aircraft overboard vent system",
        description:
          "Ensure container is connected to the aircraft's overboard vent system as required by paragraph A3.3.2.16.2.",
        afmanRef: "AFMAN 24-604 A6.11",
      },
      {
        id: "a6.11-to-preparation",
        label: "Containers prepared per T.O.",
        description:
          "Ensure all containers are prepared in accordance with T.O.",
        afmanRef: "AFMAN 24-604 A6.11",
      },
      {
        id: "a6.11-hydrogen-density",
        label: "Hydrogen (≥95% parahydrogen) per Figure A3.5",
        description:
          "Ship hydrogen (minimum 95 percent parahydrogen) according to filling density requirements in Figure A3.5.",
        afmanRef: "AFMAN 24-604 A6.11",
      },
      {
        id: "a6.11-cryogenic-density",
        label: "Argon/helium/neon/nitrogen/oxygen per Figure A3.4",
        description:
          "Ship cryogenic liquids of argon, helium, neon, nitrogen, and oxygen according to filling density requirements in Figure A3.4.",
        afmanRef: "AFMAN 24-604 A6.11",
      },
      {
        id: "a6.11-dewar-capacity",
        label: "Dewars 25 L (6.6 gallon) capacity each",
        description: "Dewars, 25 L (6.6 gallon) capacity each.",
        afmanRef: "AFMAN 24-604 A6.11",
      },
      {
        id: "a6.11-container-limit-one",
        label: "Maximum one container per aircraft",
        description: "Ship no more than one container per aircraft.",
        afmanRef: "AFMAN 24-604 A6.11",
      },
      {
        id: "a6.11-c1-capacity",
        label: "C-1 containers 1892 L (500 gallons) capacity",
        description: "C-1, 1892 L (500 gallons) capacity containers.",
        afmanRef: "AFMAN 24-604 A6.11",
      },
      {
        id: "a6.11-container-limit-five",
        label: "Maximum five containers per aircraft",
        description: "Ship no more than five containers per aircraft.",
        afmanRef: "AFMAN 24-604 A6.11",
      },
      {
        id: "a6.11-container-limit-two",
        label: "Maximum two containers per aircraft",
        description: "Ship not more than two containers per aircraft.",
        afmanRef: "AFMAN 24-604 A6.11",
      },
      {
        id: "a6.11-tmu-trailers",
        label: "TMU-27M/MA-1 trailers 189 L (50 gallon) capacity",
        description:
          "Type TMU-27M, MIL-T-38170, or MA-1, trailer mounted, 189 L (50 gallon) capacity containers.",
        afmanRef: "AFMAN 24-604 A6.11",
      },
      {
        id: "a6.11-tmu-70m-lox",
        label: "TMU-70/M LOX trailers with absolute pressure relief",
        description:
          "TMU-70/M (MIL-A-85415) LOX servicing trailers equipped with absolute pressure relief valve.",
        afmanRef: "AFMAN 24-604 A6.11",
      },
    ],
  },

  "A6.12": {
    paragraphId: "A6.12",
    title: "Ethyl Chloride",
    description: "Packaging requirements for ethyl chloride",
    conditions: [
      {
        id: "a6.12-pg1-packaging",
        label: "Packaging meets PG I performance level",
        description:
          "Package ethyl chloride in any of the following single or combination nonbulk packagings which meet the PG I performance level.",
        afmanRef: "AFMAN 24-604 A6.12",
      },
      {
        id: "a6.12-fiberboard-weight",
        label: "4G fiberboard gross weight ≤ 30 kg (66 lbs)",
        description:
          "Reconstituted wood (4F), fiberboard (4G) Note: Gross weight of 4G may not exceed 30 kg (66 pounds).",
        afmanRef: "AFMAN 24-604 A6.12",
      },
      {
        id: "a6.12-outage",
        label: "Outage ≥ 7.5% at 21°C (70°F)",
        description:
          "Outage for all containers must be 7.5 percent or more at 21 degrees C (70 degrees F).",
        afmanRef: "AFMAN 24-604 A6.12",
      },
      {
        id: "a6.12-capsule-outer",
        label: "Capsules in strong outer packaging ≤ 75 kg gross",
        description:
          "Place capsules in a strong outer packaging suitable for the contents and must not exceed a gross mass of 75 kg (165 pounds).",
        afmanRef: "AFMAN 24-604 A6.12",
      },
      {
        id: "a6.12-capsule-quality",
        label: "Capsule free of strength-impairing faults",
        description:
          "The capsule must be free of faults liable to impair its strength.",
        afmanRef: "AFMAN 24-604 A6.12",
      },
      {
        id: "a6.12-capsule-weight",
        label: "Capsules max 150 g (5.30 oz) net mass each",
        description:
          "Package in capsules with a maximum net mass of 150 g (5.30 ounces) per capsule.",
        afmanRef: "AFMAN 24-604 A6.12",
      },
      {
        id: "a6.12-drum-packaging",
        label: "Steel drums (1A1) ≤ 100 L capacity",
        description:
          "Package in drums as follows: Inner packaging not required, Drum: steel (1A1) not over 100 L (26 gallon) capacity each.",
        afmanRef: "AFMAN 24-604 A6.12.3",
      },
      {
        id: "a6.12-closure-integrity",
        label: "Closure maintained by secondary means",
        description:
          "The leakproofness integrity of the closure must be maintained by a secondary means (e.g., cap, crown, seal, binding, etc.) capable of preventing any leakage of the closure while in transportation.",
        afmanRef: "AFMAN 24-604 A6.12",
      },
      {
        id: "a6.12-box-packaging",
        label: "Boxes with glass/earthenware/metal receptacles ≤ 500g each",
        description:
          "Package in boxes as follows: Inner packaging: Receptacles glass, earthenware or metal. Outer packaging: Boxes: ordinary natural wood (4C1), sift-proof natural wood (4C2), plywood (4D). Note: Not over 500 g (17.6 ounces) capacity each.",
        afmanRef: "AFMAN 24-604 A6.12",
      },
    ],
  },

  "A6.13": {
    paragraphId: "A6.13",
    title: "Ethylene Oxide",
    description:
      "Packaging requirements for ethylene oxide (silver, mercury, alloys, or copper prohibited)",
    conditions: [
      {
        id: "a6.13-glass-ampoules",
        label: "Glass ampoules/vials ≤ 100g in wooden/fiberboard boxes",
        description:
          "Glass ampoules/vials in Boxes: wooden (4C1, 4C2, 4D, or 4F) or fiberboard (4G). The capacity of each inner packaging may not exceed 100 g (3.5 ounces).",
        afmanRef: "AFMAN 24-604 A6.13",
      },
      {
        id: "a6.13-metal-receptacles",
        label: "Metal receptacles ≤ 340g in outer packaging",
        description:
          "Metal receptacles: The capacity of each inner packaging may not exceed 340 g (12 ounces). Total quantity in outer packaging containing only metal inner packagings.",
        afmanRef: "AFMAN 24-604 A6.13",
      },
      {
        id: "a6.13-pg1-performance",
        label: "Package meets PG I performance requirements",
        description:
          "Each completed package must meet PG I performance requirements.",
        afmanRef: "AFMAN 24-604 A6.13",
      },
      {
        id: "a6.13-drum-fill",
        label: "Drum not liquid full below 85°C (185°F)",
        description:
          "The drum must not be liquid full below 85 degrees C (185 degrees F).",
        afmanRef: "AFMAN 24-604 A6.13",
      },
      {
        id: "a6.13-eductor-tubes",
        label: "Eductor tubes for cylinders > 19L (5 gal)",
        description:
          "Eductor tubes must be provided for cylinders over 19L (5 gallons) capacity.",
        afmanRef: "AFMAN 24-604 A6.13",
      },
      {
        id: "a6.13-drum-hydrostatic",
        label: "Drums withstand 690 kPa (100 psig) hydrostatic test",
        description:
          "Drums must be capable of withstanding a hydrostatic test pressure of 690 kPa (100 psig).",
        afmanRef: "AFMAN 24-604 A6.13",
      },
      {
        id: "a6.13-drum-leak-test",
        label: "Drums leak tested at ≥ 103 kPa (15 psig) before refilling",
        description:
          "Before each refilling, each drum must be pressure tested for leakage at no less than 103 kPa (15 psig).",
        afmanRef: "AFMAN 24-604 A6.13",
      },
      {
        id: "a6.13-fusible-relief",
        label: "Fusible relief device 69-77°C (157-170°F)",
        description:
          "Each drum must be equipped with a fusible-type relief device with a yield temperature of 69 to 77 degrees C (157 to 170 degrees F).",
        afmanRef: "AFMAN 24-604 A6.13",
      },
      {
        id: "a6.13-cylinder-specs",
        label: "Seamless/welded steel cylinders ≤ 115L, not liquid full <82°C",
        description:
          "Cylinders must be seamless or welded steel (not brazed) with a nominal capacity of no more than 115 L (30 gallons) and must not be liquid full below 82 degrees C (180 degrees F).",
        afmanRef: "AFMAN 24-604 A6.13",
      },
      {
        id: "a6.13-drum-construction",
        label: "Lagged all-welded drum with minimum shell thickness",
        description:
          "The drum must be lagged, of all welded construction with the inner shell having a minimum thickness of 1.7 mm (0.068 inches) and the outer shell must have a minimum thickness of 2.4 mm (0.095 inches).",
        afmanRef: "AFMAN 24-604 A6.13",
      },
      {
        id: "a6.13-cylinder-fire-test",
        label: "Cylinder passes CGA C-14 fire test",
        description:
          "The capacity of the relief device and the effectiveness of the insulation must be such that the charged cylinder will not explode when tested by the method described in CGA Pamphlet C-14 or other equivalent method.",
        afmanRef: "AFMAN 24-604 A6.13",
      },
      {
        id: "a6.13-drum-fire-test",
        label: "Drum passes CGA C-14 fire test",
        description:
          "The capacity of the relief device and the effectiveness of the insulation must be such that the filled drum is capable of passing, without rupture, the test method described in CGA Pamphlet C-14 or other equivalent method.",
        afmanRef: "AFMAN 24-604 A6.13",
      },
    ],
  },

  "A6.14": {
    paragraphId: "A6.14",
    title: "Ethylamine (Monoethylamine, Aminoethane)",
    description: "Packaging requirements for ethylamine",
    conditions: [
      {
        id: "a6.14-metal-drums",
        label: "Metal drums (1A1) meeting PG I",
        description:
          "Use metal drums (1A1) which meet PG I performance level requirements.",
        afmanRef: "AFMAN 24-604 A6.14",
      },
      {
        id: "a6.14-dot-cylinder",
        label: "Any DOT cylinder except acetylene",
        description:
          "Use any DOT specification cylinder prescribed for any compressed gas except acetylene.",
        afmanRef: "AFMAN 24-604 A6.14",
      },
    ],
  },

  "A6.15": {
    paragraphId: "A6.15",
    title: "Arsine, Cyanogen Chloride, Germane, Phosphine, Phosgene",
    description:
      "Packaging requirements for highly toxic gases (arsine, cyanogen chloride stabilized, cyanogen liquefied, germane, phosphine, phosgene)",
    conditions: [
      {
        id: "a6.15-phosgene-limit",
        label: "Phosgene ≤ 68 kg (150 lbs) per cylinder",
        description:
          "The cylinder may not contain more than 68 kg (150 pounds) of phosgene.",
        afmanRef: "AFMAN 24-604 A6.15",
      },
      {
        id: "a6.15-arsine-phosphine-no-3al",
        label: "Arsine/Phosphine not in 3AL cylinders",
        description:
          'Shipments of "Arsine" or "Phosphine" may not be packaged in a specification 3AL cylinder.',
        afmanRef: "AFMAN 24-604 A6.15",
      },
      {
        id: "a6.15-phosgene-density",
        label: "Phosgene filling density ≤ 125%",
        description:
          'Cylinders containing "phosgene" may not exceed a filling density of 125 percent (see A3.3.2.6.).',
        afmanRef: "AFMAN 24-604 A6.15",
      },
      {
        id: "a6.15-cylinder-specs",
        label: "DOT 3A1800, 3AA1800, 3AL1800, 3D, 3E1800, or 33 cylinders",
        description:
          "Package in DOT specification 3A1800, 3AA1800, 3AL1800, 3D, 3E1800, and 33 cylinders.",
        afmanRef: "AFMAN 24-604 A6.15",
      },
      {
        id: "a6.15-safety-equipment",
        label: "Chemical safety mask and clothing available",
        description:
          "Approved chemical safety mask and clothing must be available when handling this material and worn when handling leaking packages.",
        afmanRef: "AFMAN 24-604 A6.15",
      },
      {
        id: "a6.15-small-cylinder-specs",
        label: "Small cylinders: 3A, 3AA, 3AL, 3D, 33 ≤ 57 kg water capacity",
        description:
          "Specification 3A, 3AA, 3AL, 3D, and 33 cylinders not exceeding 57 kg (125 pounds) water capacity (nominal).",
        afmanRef: "AFMAN 24-604 A6.15",
      },
      {
        id: "a6.15-immersion-test",
        label: "Cylinder immersion tested at 66°C (150°F) for 30 min",
        description:
          "This test consists of immersing the cylinder and valve, without the protection cap attached, in a bath of water at a temperature of approximately 66 degrees C (150 degrees F) for at least 30 minutes.",
        afmanRef: "AFMAN 24-604 A6.15",
      },
      {
        id: "a6.15-valve-sealed",
        label: "Valve not loosened after test or during transport",
        description:
          "After the test has been accomplished do not loosen the valve of the cylinder before the cylinder is offered for transportation, and do not be loosen during transportation.",
        afmanRef: "AFMAN 24-604 A6.15",
      },
    ],
  },

  "A6.16": {
    paragraphId: "A6.16",
    title: "Bromoacetone, Methyl Bromide, Chloropicrin Mixtures",
    description:
      "Packaging requirements for bromoacetone, methyl bromide, chloropicrin and methyl bromide mixtures, chloropicrin and methyl chloride mixtures",
    conditions: [
      {
        id: "a6.16-liquid-limit",
        label: "Total liquid in outer box ≤ 11 kg (24 lbs)",
        description:
          "The total amount of liquid in the outer box may not exceed 11 kg (24 pounds).",
        afmanRef: "AFMAN 24-604 A6.16",
      },
      {
        id: "a6.16-bromoacetone-packaging",
        label: "Bromoacetone in glass receptacles with cushioning",
        description:
          "Pack bromoacetone with inner glass receptacles or tubes in hermetically sealed metal receptacles in corrugated fiberboard cartons in the following boxes: steel (4A), aluminum (4B), other metal (4N) natural wood (4C1), natural wood with sift-proof walls (4C2), plywood (4D), or reconstituted wood (4F). Bottles must not contain over 500 g (17.6 ounces) of liquid each and must be cushioned in cans with at least 12.7 mm (.5 inches) of absorbent cushioning material.",
        afmanRef: "AFMAN 24-604 A6.16",
      },
      {
        id: "a6.16-can-fill",
        label: "Cans not liquid full at 55°C (130°F)",
        description:
          "Cans must not be liquid full at 55 degrees C (130 degrees F).",
        afmanRef: "AFMAN 24-604 A6.16",
      },
      {
        id: "a6.16-vapor-pressure-130",
        label: "Vapor pressure ≤ 896.6 kPa (130 psig) at 55°C",
        description:
          "Vapor pressure of the contents must not exceed 896.6 kPa (130 psig) at 55 degrees C (130 degrees F).",
        afmanRef: "AFMAN 24-604 A6.16",
      },
      {
        id: "a6.16-vapor-pressure-140",
        label: "Vapor pressure ≤ 965.6 kPa (140 psig) at 55°C",
        description:
          "Vapor pressure of the contents must not exceed 965.6 kPa (140 psig) at 55 degrees C (130 degrees F).",
        afmanRef: "AFMAN 24-604 A6.16",
      },
      {
        id: "a6.16-1lb-can-pressure",
        label: "1 lb can withstands 896.6 kPa (130 psig)",
        description:
          "The 0.454 kg (1 pound) can must be capable of withstanding an internal pressure of 896.6 kPa (130 psig) without leakage or permanent distortion.",
        afmanRef: "AFMAN 24-604 A6.16",
      },
      {
        id: "a6.16-1.75lb-can-pressure",
        label: "1.75 lb can withstands 965.6 kPa (140 psig)",
        description:
          "The 0.7945 kg (1 3/4 pound) can must be capable of withstanding an internal pressure of 965.6 kPa (140 psig) without leakage or permanent distortion.",
        afmanRef: "AFMAN 24-604 A6.16",
      },
      {
        id: "a6.16-pg1-compliance",
        label: "Packagings conform to PG I",
        description: "Packagings must conform to the PG I performance level.",
        afmanRef: "AFMAN 24-604 A6.16",
      },
      {
        id: "a6.16-can-construction",
        label: "Cans of tinplate or lined, with concave/pressure ends",
        description:
          "Cans must be constructed of tinplate or lined with suitable material and must have concave or pressure ends.",
        afmanRef: "AFMAN 24-604 A6.16",
      },
      {
        id: "a6.16-safety-equipment",
        label: "Chemical safety mask and clothing available",
        description:
          "Approved chemical safety mask and clothing must be available when handling this material, and worn when handling leaking packages.",
        afmanRef: "AFMAN 24-604 A6.16",
      },
      {
        id: "a6.16-methyl-bromide-fiberboard",
        label: "Methyl bromide in 4G box with metal cans ≤ 1.75 lbs",
        description:
          "Package methyl bromide mixtures containing up to 2 percent chloropicrin in a fiberboard (4G) box with inside metal cans containing not over 0.454 kg (1 pound) each, or inside metal cans with a minimum wall thickness of 0.178 mm (0.007 inch) containing not over 0.7945 kg (1 3/4 pounds) each.",
        afmanRef: "AFMAN 24-604 A6.16",
      },
      {
        id: "a6.16-cylinder-packaging",
        label: "DOT cylinders ≤ 113 kg (250 lbs) water capacity",
        description:
          "Pack bromoacetone, methyl bromide, chloropicrin and methyl bromide mixtures, chloropicrin and methyl chloride mixtures, and chloropicrin mixtures charged with a nonflammable, nonliquefied compressed gas in DOT specification 3A, 3AA, 3B, 3C, 3E, 4A, 4B, 4BA, 4BW, or 4C cylinders having not over 113 kg (250 pounds) water capacity (nominal).",
        afmanRef: "AFMAN 24-604 A6.16",
      },
    ],
  },

  "A6.17": {
    paragraphId: "A6.17",
    title: "Gas Identification Sets",
    description:
      "Packaging requirements for gas identification sets containing toxic material",
    conditions: [
      {
        id: "a6.17-metal-can-wall",
        label: "Metal can wall thickness ≥ 0.30 mm (0.012 in)",
        description:
          "The metal can must have a wall thickness of not less than 0.30 mm (0.012 inch).",
        afmanRef: "AFMAN 24-604 A6.17",
      },
      {
        id: "a6.17-cylinder-wall",
        label: "Cylinder wall ≥ 3.7 mm with hermetically sealed closure",
        description:
          "The cylinder must have a wall thickness of at least 3.7 mm (0.146 inches) and must have a hermetically sealed steel closure.",
        afmanRef: "AFMAN 24-604 A6.17",
      },
      {
        id: "a6.17-glass-receptacles",
        label: "Hermetically sealed glass receptacles ≤ 40 mL",
        description:
          "Pack in hermetically sealed glass inner receptacles not over 40 ml (1.4 fluid ounces).",
        afmanRef: "AFMAN 24-604 A6.17",
      },
      {
        id: "a6.17-absorbed-material",
        label: "Absorbed toxic material packaging per A6.17.2.1",
        description:
          "When the toxic material is absorbed in a medium such as activated charcoal or silica gel, pack gas identification sets as follows: A6.17.2.1.",
        afmanRef: "AFMAN 24-604 A6.17.2.1",
      },
      {
        id: "a6.17-pg1-compliance",
        label: "Package meets PG I performance level",
        description:
          "Gas identification sets containing toxic material meeting the requirements of the PG I performance level.",
        afmanRef: "AFMAN 24-604 A6.17",
      },
      {
        id: "a6.17-sawdust-cushioning",
        label: "Metal cans in boxes with 25 mm dry sawdust cushioning",
        description:
          "Then pack metal cans in metal boxes (4A, 4B, or 4N), or wooden boxes (4C1, 4C2, 4D, or 4F) surrounded on all sides by at least 25 mm (1 inch) of dry sawdust.",
        afmanRef: "AFMAN 24-604 A6.17",
      },
      {
        id: "a6.17-glass-in-metal-can",
        label: "Glass receptacle cushioned in hermetically sealed metal can",
        description:
          "Pack each glass receptacle, cushioned with absorbent material in a hermetically sealed metal can.",
        afmanRef: "AFMAN 24-604 A6.17",
      },
      {
        id: "a6.17-small-liquid-toxic",
        label: "Small liquid toxic (≤5 mL) in ≤120 mL glass receptacles",
        description:
          "If the liquid toxic material does not exceed 5 ml (0.2 fluid ounces) or the solid toxic material does not exceed 5 g (0.2 ounces), they may be packed in glass inner receptacles of not over 120 ml (4.1 fluid ounces) each.",
        afmanRef: "AFMAN 24-604 A6.17",
      },
      {
        id: "a6.17-screw-top-glass",
        label: "Hermetically sealed screw-top glass ≥ 60 mL",
        description:
          "If the liquid toxic material does not exceed 5 ml (0.2 fluid ounces) or the solid toxic material does not exceed 20 g (0.7 ounces), they may be packed in glass inner receptacles with screw-top closures of not less than 60 ml (2 fluid ounces) that are hermetically sealed.",
        afmanRef: "AFMAN 24-604 A6.17",
      },
    ],
  },

  "A6.18": {
    paragraphId: "A6.18",
    title: "Hexaethyl Tetraphosphate and Compressed Gas Mixtures",
    description:
      "Packaging requirements for hexaethyl tetraphosphate mixtures and insecticide gases (toxic)",
    conditions: [
      {
        id: "a6.18-cylinder-charge",
        label: "Cylinder charge ≤ 5 kg (11 lbs) of mixture",
        description:
          "Each cylinder may not be charged with more than 5 kg (11.0 pounds) of the mixture.",
        afmanRef: "AFMAN 24-604 A6.18",
      },
      {
        id: "a6.18-filling-density",
        label: "Filling density ≤ 80% of water capacity",
        description:
          "The maximum filling density of the cylinder may not exceed 80 percent of its water capacity.",
        afmanRef: "AFMAN 24-604 A6.18",
      },
      {
        id: "a6.18-fiberboard-protection",
        label: "Cylinders in fiberboard box (4G) with valve protection",
        description:
          "Package cylinders must in a fiberboard box (4G) in a way to protect each valve or other closing device from damage.",
        afmanRef: "AFMAN 24-604 A6.18",
      },
      {
        id: "a6.18-organic-phosphate-limit",
        label: "≤ 20% organic phosphate in DOT 240 series cylinders",
        description:
          "This mixture may not contain more than 20 percent by weight of an organic phosphate and be packaged in DOT specification 3A240, 3AA240, 3B240, 4A240, 4B240, 4BA240, or 4BW240 cylinders meeting the following requirements: A6.18.2.1.1.",
        afmanRef: "AFMAN 24-604 A6.18.2.1.1",
      },
      {
        id: "a6.18-fiberboard-drop-test",
        label: "Fiberboard box passes 1.8 m drop test",
        description:
          "Each box with its closing device protection must be sufficiently strong to protect all parts of each inside cylinder from deformation or breakage if the completed package is dropped 1.8 m (5.9 feet) onto solid concrete impacting at the package's weakest point.",
        afmanRef: "AFMAN 24-604 A6.18",
      },
      {
        id: "a6.18-wooden-box-drop-test",
        label: "Wooden box passes 1.8 m drop test",
        description:
          "Each wooden box with its closing device protection must be sufficiently strong to protect all parts of each inside cylinder from deformation or breakage if the completed package is dropped 1.8 m (5.9 feet) onto solid concrete impacting at the package's weakest point.",
        afmanRef: "AFMAN 24-604 A6.18",
      },
      {
        id: "a6.18-wooden-box-option",
        label: "Wooden box (4C1, 4C2, 4D, 4F) with valve protection",
        description:
          "Cylinders may be packed in a strong wooden box (4C1, 4C2, 4D, or 4F) and packed in a way to protect each valve or other closing device from damage.",
        afmanRef: "AFMAN 24-604 A6.18",
      },
      {
        id: "a6.18-no-eduction-tube",
        label: "No eduction tube or fusible plug on cylinder",
        description:
          "No cylinder may be equipped with an eduction tube or a fusible plug.",
        afmanRef: "AFMAN 24-604 A6.18",
      },
      {
        id: "a6.18-dot-approved-valve",
        label: "Only DOT approved valve type",
        description:
          "No cylinder may be equipped with any valve unless the valve is a type approved by the DOT.",
        afmanRef: "AFMAN 24-604 A6.18",
      },
    ],
  },

  "A6.19": {
    paragraphId: "A6.19",
    title: "Class 2.3 Poisonous by Inhalation (Hazard Zone A)",
    description:
      "Packaging requirements for Class 2.3 materials poisonous by inhalation (Hazard Zone A)",
    conditions: [
      {
        id: "a6.19-inner-receptacle",
        label: "Inner receptacle capacity ≤ 4 L (1 gallon)",
        description:
          "The capacity of the inner receptacle may not exceed 4 L (1 gallon).",
        afmanRef: "AFMAN 24-604 A6.19",
      },
      {
        id: "a6.19-cylinder-requirements",
        label: "Cylinders meet A3.3.2 requirements",
        description: "Cylinders must also meet the requirements of A3.3.2.",
        afmanRef: "AFMAN 24-604 A6.19",
      },
      {
        id: "a6.19-inner-drum-capacity",
        label: "Inner drum capacity ≤ 220 L (58 gallons)",
        description:
          "The capacity of the inner drum must not exceed 220 L (58 gallons).",
        afmanRef: "AFMAN 24-604 A6.19",
      },
      {
        id: "a6.19-outer-1a2-thickness",
        label: "Outer 1A2 drum thickness ≥ 1.35 mm (0.053 in)",
        description:
          "The outer 1A2 drum must have a minimum thickness of 1.35 mm (0.053 inches).",
        afmanRef: "AFMAN 24-604 A6.19",
      },
      {
        id: "a6.19-outer-1h2-thickness",
        label: "Outer 1H2 drum thickness ≥ 6.30 mm (0.248 in)",
        description:
          "The outer 1H2 drum must have a minimum thickness of 6.30 mm (0.248 inches).",
        afmanRef: "AFMAN 24-604 A6.19",
      },
      {
        id: "a6.19-drum-hydrostatic",
        label: "Outer drums withstand 100 kPa (15 psi) hydrostatic test",
        description:
          "The outer 1A2 and 1H2 drums must withstand a hydrostatic test pressure of 100 kPa (15 psi).",
        afmanRef: "AFMAN 24-604 A6.19",
      },
      {
        id: "a6.19-cap-seal",
        label: "Cap seal withstands 100 kPa (15 psi)",
        description:
          "The cap seal must be capable of withstanding an internal pressure of at least 100 kPa (15 psi).",
        afmanRef: "AFMAN 24-604 A6.19",
      },
      {
        id: "a6.19-outer-liquid-limit",
        label: "Total liquid in outer container ≤ 16 L (4 gallons)",
        description:
          "The total amount of liquid that can be packed in the outer container must not exceed 16 L (4 gallons).",
        afmanRef: "AFMAN 24-604 A6.19",
      },
      {
        id: "a6.19-cushioning",
        label: "Minimum 5 cm side / 7.6 cm top-bottom cushioning",
        description:
          "There must be a minimum of 5.0 cm (2 inches) of cushioning material between the outer surface (side) of the inner drum and the inner surface (side) of the outer drum, and at least 7.6 cm (3 inches) of cushioning material between the outer surface (top and bottom) of the inner drum and the inner surface (top and bottom) of the outer drum.",
        afmanRef: "AFMAN 24-604 A6.19",
      },
      {
        id: "a6.19-pg1-drums",
        label: "Both inner and outer drums tested to PG I",
        description:
          "Both the inner and outer drum must be tested to the PG I performance level.",
        afmanRef: "AFMAN 24-604 A6.19",
      },
    ],
  },

  "A6.20": {
    paragraphId: "A6.20",
    title: "Nitric Oxide",
    description: "Packaging requirements for nitric oxide",
    conditions: [
      {
        id: "a6.20-valve-outlets",
        label: "Valve outlets sealed with threaded cap/plug and inert gasket",
        description:
          "Ensure valve outlets are sealed by a solid threaded cap or plug and an inert gasketing material.",
        afmanRef: "AFMAN 24-604 A6.20",
      },
      {
        id: "a6.20-3e1800-wooden-box",
        label: "DOT 3E1800 cylinders in strong wooden boxes",
        description:
          "Pack cylinders, DOT 3E1800, in strong wooden boxes to protect valves from injury or accidental functioning under conditions incident to transportation.",
        afmanRef: "AFMAN 24-604 A6.20",
      },
      {
        id: "a6.20-cylinder-specs",
        label: "DOT 3A1800, 3AA1800, 3AL1800, or 3E1800 ≤ 5170 kPa (750 psi)",
        description:
          "Pack nitric oxide in DOT 3A1800, 3AA1800, 3AL1800, or 3E1800 cylinders, charged to a pressure of not more than 5,170 kPa (750 psi) at 21 degrees C (70 degrees F).",
        afmanRef: "AFMAN 24-604 A6.20",
      },
      {
        id: "a6.20-stainless-valve",
        label: "Stainless steel valve with compatible seat material",
        description:
          "Ensure cylinders are equipped with a valve of stainless steel and a valve seat of material that is not deteriorated by contact with nitric oxide or nitrogen dioxide.",
        afmanRef: "AFMAN 24-604 A6.20",
      },
      {
        id: "a6.20-no-safety-device",
        label: "No pressure relief safety devices",
        description:
          "Cylinders or valves may not be equipped with safety devices (pressure relief) of any type.",
        afmanRef: "AFMAN 24-604 A6.20",
      },
    ],
  },

  "A6.21": {
    paragraphId: "A6.21",
    title: "Ethyl Methyl Ether",
    description: "Packaging requirements for ethyl methyl ether",
    conditions: [
      {
        id: "a6.21-pg1-packaging",
        label: "Packaging meets PG I performance level",
        description:
          "Package Ethyl Methyl Ether in packaging meeting the requirements of the PG I performance level.",
        afmanRef: "AFMAN 24-604 A6.21",
      },
      {
        id: "a6.21-drums-jerricans",
        label: "Drums or jerricans (steel, aluminum, plastic)",
        description:
          "Package in drums or jerricans: Drums: steel (1A1 or 1A2), aluminum (1B1 or 1B2), metal other than steel or aluminum (1N1 or 1N2) or plastic (1H1 or 1H2) or Jerricans: steel (3A1 or 3A2), aluminum (3B1 or 3B2), or plastic (3H1 or 3H2).",
        afmanRef: "AFMAN 24-604 A6.21.3",
      },
      {
        id: "a6.21-plastic-composite",
        label: "Plastic inner receptacle composite packages",
        description:
          "Package in plastic inner receptacle composite packages: Drums: steel, aluminum, fiber or plastic (6HA1, 6HB1, 6HG1, 6HH1) or Boxes: steel, aluminum, wooden, plywood, or fiberboard (6HA2, 6HB2, 6HC, 6HD2, 6HG2).",
        afmanRef: "AFMAN 24-604 A6.21.4",
      },
      {
        id: "a6.21-glass-composite",
        label: "Glass/porcelain/stoneware inner receptacle composite packages",
        description:
          "Package in glass, porcelain, or stoneware inner receptacle composite packages: Drums: steel, aluminum or fiber (6PA1, 6PB1, 6PG1) or Boxes: steel, aluminum, wooden, or fiberboard (6PA2, 6PB2, 6PC, 6PG2) or solid or expanded plastic packaging (6PH1 or 6PH2).",
        afmanRef: "AFMAN 24-604 A6.21.5",
      },
      {
        id: "a6.21-combination-packaging",
        label: "Combination packaging with inner receptacles",
        description:
          "Package in drums, jerricans, or boxes with inner receptacles: glass, earthenware, plastic, metal or glass ampoules in outer Drums, Jerricans, or Boxes of various specifications.",
        afmanRef: "AFMAN 24-604 A6.21.2",
      },
    ],
  },

  "A6.22": {
    paragraphId: "A6.22",
    title: "Chemical Under Pressure N.O.S.",
    description: "Packaging requirements for chemical under pressure N.O.S.",
    conditions: [
      {
        id: "a6.22-internal-pressure",
        label: "Internal pressure at 65°C ≤ cylinder test pressure",
        description:
          "When filled, the internal pressure at 65 °C (149 °F) may not exceed the test pressure of the cylinder.",
        afmanRef: "AFMAN 24-604 A6.22",
      },
      {
        id: "a6.22-minimum-test-pressure",
        label: "Minimum test pressure ≥ 291 psig (20 bar)",
        description:
          "In any case the minimum test pressure must not be less than 291 psig (20 bar).",
        afmanRef: "AFMAN 24-604 A6.22",
      },
      {
        id: "a6.22-service-pressure",
        label: "Minimum service pressure per 49 CFR Part 178",
        description:
          "The minimum service pressure must be in accordance with the design specifications of 49 CFR Part 178 for the propellant.",
        afmanRef: "AFMAN 24-604 A6.22",
      },
      {
        id: "a6.22-fill-limits",
        label: "Non-gaseous phase ≤ 95% at 50°C, not full at 60°C",
        description:
          "Fill cylinders so that at 50 °C (122 °F) the non-gaseous phase does not exceed 95% of their water capacity and they are not completely filled at 60 °C (140 °F).",
        afmanRef: "AFMAN 24-604 A6.22",
      },
      {
        id: "a6.22-attachment-3-compliance",
        label: "DOT cylinders and UN receptacles per Attachment 3 and A6.4",
        description:
          "Offer in cylinder filled for transportation in accordance with the requirements of DOT cylinders and UN pressure receptacles in Attachment 3 and paragraph A6.4.",
        afmanRef: "AFMAN 24-604 A6.22",
      },
    ],
  },

  "A6.23": {
    paragraphId: "A6.23",
    title: "Fuel Cell Cartridges",
    description: "Packaging requirements for fuel cell cartridges",
    conditions: [
      {
        id: "a6.23-weight-limit",
        label: "Fuel cell weight ≤ 1 kg",
        description: "The weight of the fuel cells may not exceed 1 kg.",
        afmanRef: "AFMAN 24-604 A6.23",
      },
      {
        id: "a6.23-packaging-types",
        label: "Proper drums, jerricans, or boxes used",
        description:
          "Package fuel cell cartridges in drums, jerricans or boxes: Drums: removable head steel (1A2), removable head aluminum (1B2), plywood (1D), fiber (1G), plastic (1H2), removable head other metal (1N2) or Jerricans: steel (3A2), aluminum (3B2), plastic (3H2) or Boxes: steel (4A), aluminum (4B), wood (4C1 or 4C2), plywood (4D), reconstituted wood (4F), fiberboard (4G), plastic (4H1 or 4H2), other metal (4N).",
        afmanRef: "AFMAN 24-604 A6.23",
      },
    ],
  },

  "A6.24": {
    paragraphId: "A6.24",
    title: "Fuel Cell Cartridges Contained in Equipment",
    description:
      "Packaging requirements for fuel cell cartridges contained in equipment",
    conditions: [
      {
        id: "a6.24-no-charging",
        label: "Fuel cell systems do not charge batteries during transport",
        description:
          "Fuel cell systems may not charge batteries during transport.",
        afmanRef: "AFMAN 24-604 A6.24",
      },
    ],
  },

  "A6.25": {
    paragraphId: "A6.25",
    title: "Fuel Cell Packed With Equipment",
    description: "Packaging requirements for fuel cells packed with equipment",
    conditions: [
      {
        id: "a6.25-cartridge-limit",
        label: "Cartridges ≤ equipment requirement + 2 spares",
        description:
          "The maximum number of fuel cell cartridges in the intermediate packaging may not be more than the number required to power the equipment plus two spares.",
        afmanRef: "AFMAN 24-604 A6.25",
      },
      {
        id: "a6.25-cushioning-protection",
        label: "Cartridges cushioned/protected in outer packaging",
        description:
          "Pack fuel cells with equipment in inner packagings or place them in the outer packaging with cushioning material or divider(s) in order to protect fuel cartridges from damage during transportation.",
        afmanRef: "AFMAN 24-604 A6.25",
      },
    ],
  },

  "A6.26": {
    paragraphId: "A6.26",
    title: "Metal Hydride Storage Systems",
    description:
      "Packaging requirements for metal hydride storage systems (UN3468)",
    conditions: [
      {
        id: "a6.26-iso-16111",
        label: "Designed and tested per ISO 16111",
        description:
          "Metal hydride storage systems must be designed, constructed, initially inspected and tested in accordance with ISO 16111.",
        afmanRef: "AFMAN 24-604 A6.26",
      },
      {
        id: "a6.26-requalification",
        label: "Requalification ≤ 5 years per 49 CFR 180.207 and ISO 16111",
        description:
          "Requalification intervals must be no more than every five years as specified in 49 CFR Section 180.207 in accordance with the requalification procedures prescribed in ISO 16111.",
        afmanRef: "AFMAN 24-604 A6.26",
      },
      {
        id: "a6.26-h-mark",
        label: "Steel/composite steel receptacles marked with 'H' per 49 CFR 173.301b(f)",
        description:
          'Mark steel pressure receptacles or composite pressure receptacles with steel liners in accordance with 49 CFR Paragraph 173.301b(f) which specifies that a steel UN pressure receptacle bearing an "H" mark must be used for hydrogen bearing gases or other gases that may cause hydrogen embrittlement.',
        afmanRef: "AFMAN 24-604 A6.26",
      },
      {
        id: "a6.26-capacity-limits",
        label: "Receptacles ≤ 150 L, max pressure ≤ 25 MPa",
        description:
          "The following packing instruction is applicable to transportable UN Metal hydride storage systems (UN3468) with pressure receptacles not exceeding 150 liters (40 gallons) in water capacity and having a maximum developed pressure not exceeding 25 MPa.",
        afmanRef: "AFMAN 24-604 A6.26",
      },
    ],
  },

  "A6.27": {
    paragraphId: "A6.27",
    title: "Flammable Gas Powered Engines and Machinery",
    description:
      "Packaging requirements for flammable gas powered engines and machinery",
    conditions: [
      {
        id: "a6.27-components-configured",
        label: "Components and accessories properly configured in holders",
        description:
          "Ensure installed components, equipment, and accessorial hazards (e.g., fire extinguishers, jerricans, etc.) are in properly configured and approved holders designed for use with the unit.",
        afmanRef: "AFMAN 24-604 A6.27",
      },
      {
        id: "a6.27-tanks-closed",
        label: "Tanks securely closed",
        description: "Ensure tanks are securely closed.",
        afmanRef: "AFMAN 24-604 A6.27",
      },
      {
        id: "a6.27-batteries-removed",
        label: "Batteries removed and packaged per A12.4 (freight container)",
        description:
          "When loaded in a freight container, remove acid or alkali batteries and package according to A12.4.",
        afmanRef: "AFMAN 24-604 A6.27",
      },
      {
        id: "a6.27-fuel-emptied",
        label: "LPG/compressed gas completely emptied from non-DOT vessels",
        description:
          "Liquefied petroleum gas or compressed gas powered engines or equipment must have the gaseous fuel completely emptied from any non-DOT specification pressurized vessel (fuel tank), lines, and regulator.",
        afmanRef: "AFMAN 24-604 A6.27",
      },
      {
        id: "a6.27-technical-manuals",
        label: "Items prepared per service technical manuals",
        description:
          "Use service technical manuals to prepare items for shipment.",
        afmanRef: "AFMAN 24-604 A6.27",
      },
      {
        id: "a6.27-wet-cell-accessible",
        label: "Wet-cell batteries accessible during flight (freight container)",
        description:
          "Do not ship packaged wet-cell batteries inside a freight container unless accessible during flight.",
        afmanRef: "AFMAN 24-604 A6.27",
      },
      {
        id: "a6.27-terminal-protection",
        label: "Battery terminals protected from short circuit",
        description:
          "Protect the terminals of installed batteries to prevent short circuit by use of battery boxes, protective covers, taping, etc.",
        afmanRef: "AFMAN 24-604 A6.27",
      },
      {
        id: "a6.27-batteries-upright",
        label: "Batteries secured upright (except non-spillable A67)",
        description:
          "Secure batteries upright in designed holders except non-spillable batteries meeting Table A4.2., Special Provision A67 as nonhazardous, may be oriented in a manner to fit designed holder.",
        afmanRef: "AFMAN 24-604 A6.27",
      },
      {
        id: "a6.27-gel-batteries",
        label: "Non-spillable gel batteries may remain if upright and disconnected",
        description:
          "Non-spillable and non-hazardous gel-type batteries may remain in the equipment holder provided they remain upright and the cables are disconnected.",
        afmanRef: "AFMAN 24-604 A6.27",
      },
      {
        id: "a6.27-orientation-secured",
        label: "Engines/machinery secured to prevent leakage or orientation change",
        description:
          "Where an engine or machine could possibly be handled in other than an upright position, secure the engines or machinery in a strong, rigid outer packaging in an orientation to prevent accidental leakage and prevent any movement during transport which would change in orientation or cause them to be damaged.",
        afmanRef: "AFMAN 24-604 A6.27",
      },
    ],
  },

  "A6.28": {
    paragraphId: "A6.28",
    title: "Articles Containing Flammable Gas N.O.S.",
    description:
      "Packaging requirements for UN3537 Articles containing flammable gas N.O.S. and UN3538 Articles containing non-flammable gas N.O.S.",
    conditions: [
      {
        id: "a6.28-leakage-protection",
        label: "Leakage does not impair protective properties",
        description:
          "Any leakage of the contents must not substantially impair the protective properties of the article or of the outer packaging.",
        afmanRef: "AFMAN 24-604 A6.28",
      },
      {
        id: "a6.28-article-enclosure",
        label: "Article fully encloses dangerous goods (no receptacle)",
        description:
          "Where there is no receptacle within the article, the article must fully enclose the dangerous goods and prevent their release under normal conditions of transport.",
        afmanRef: "AFMAN 24-604 A6.28",
      },
      {
        id: "a6.28-fragile-receptacles",
        label: "Fragile receptacles properly secured",
        description:
          "Receptacles that are liable to break or be punctured easily, such as those made of glass, porcelain or stoneware or of certain plastic materials must be properly secured.",
        afmanRef: "AFMAN 24-604 A6.28",
      },
      {
        id: "a6.28-gas-receptacles",
        label: "Gas receptacles meet compressed gas requirements",
        description:
          "Receptacles containing gases within articles must meet the appropriate requirements for compressed gases or be capable of providing an equivalent level of protection.",
        afmanRef: "AFMAN 24-604 A6.28",
      },
      {
        id: "a6.28-classification",
        label: "Classified per A4.2.3, max 150 kg per package",
        description:
          "Are authorized when classified per paragraph A4.2.3., maximum net quantity per package 150kg, when packaged, or unpackaged.",
        afmanRef: "AFMAN 24-604 A6.28.1",
      },
      {
        id: "a6.28-robust-articles",
        label: "Robust articles in strong outer packaging or unpackaged",
        description:
          "Robust articles may be transported in strong outer packagings constructed of suitable material and of adequate strength and design in relation to the packaging capacity and its intended use.",
        afmanRef: "AFMAN 24-604 A6.28.3.2",
      },
      {
        id: "a6.28-movement-prevention",
        label: "Articles prevent movement and inadvertent operation",
        description:
          "Pack articles to prevent movement and inadvertent operation during normal conditions of transport.",
        afmanRef: "AFMAN 24-604 A6.28",
      },
    ],
  },
};

/**
 * Extract the base A6.X paragraph ID from a packaging paragraph string.
 * Handles formats like: "A6.5", "A6.5.", "A6.5.1", "A6.5.1.2"
 *
 * @param packagingParagraph - The packaging paragraph from SDDG
 * @returns The base paragraph ID (e.g., "A6.5") or null if no match
 */
export function extractA6Paragraph(packagingParagraph: string): string | null {
  const match = packagingParagraph.match(/^A6\.(\d+)/i);
  return match ? `A6.${match[1]}` : null;
}

/**
 * Get the checklist for a given packaging paragraph.
 *
 * @param packagingParagraph - The packaging paragraph from SDDG
 * @returns The checklist section or null if not found
 */
export function getChecklistForParagraph(
  packagingParagraph: string
): ChecklistSection | null {
  const paragraphId = extractA6Paragraph(packagingParagraph);
  if (!paragraphId) {
    return null;
  }
  return CLASS2_CHECKLISTS[paragraphId] || null;
}

/**
 * Check if a packaging paragraph has a corresponding Class 2 checklist.
 *
 * @param packagingParagraph - The packaging paragraph from SDDG
 * @returns True if a checklist exists for this paragraph
 */
export function hasClass2Checklist(packagingParagraph: string): boolean {
  return getChecklistForParagraph(packagingParagraph) !== null;
}
