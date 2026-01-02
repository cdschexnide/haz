interface CylinderRequirement {
  name: string;
  alternativeName?: string;
  maxFillingDensityPercent?: number;
  notLiquidFullAt55C?: boolean;
  notes?: string[];
  cylinderTypes: string[];
}

/* Table A6.1. Cylinder Requirements for Compressed Gases. */
export const cylinderRequirementsForCompressGases: CylinderRequirement[] = [
  {
    name: "AMMONIA, ANHYDROUS",
    maxFillingDensityPercent: 54,
    cylinderTypes: [
      "DOT-3A480",
      "DOT-3AA480",
      "DOT3A480X",
      "DOT-4AA480",
      "DOT-3",
      "DOT-3E1800",
      "DOT3AL480",
    ],
  },
  {
    name: "BROMOTRIFLUOROMETHANE (R13B1)",
    maxFillingDensityPercent: 124,
    cylinderTypes: [
      "DOT-3A400",
      "DOT-3AA400",
      "DOT-3B400",
      "DOT-4AA480",
      "DOT-4B400",
      "DOT-4BA400",
      "DOT-4BW400",
      "DOT-3E1800",
      "DOT-39",
      "DOT3AL400",
    ],
  },
  {
    name: "CARBON DIOXIDE",
    maxFillingDensityPercent: 68,
    notes: ["3", "4"],
    cylinderTypes: [
      "DOT-3A1800",
      "DOT-3AX1800",
      "DOT-3AA1800",
      "DOT-3AAX1800",
      "DOT-3",
      "DOT-3E1800",
      "DOT-3T1800",
      "DOT-3HT2000",
      "DOT-39",
      "DOT-3AL1800",
    ],
  },
  {
    name: "CARBON DIOXIDE, REFRIGERATED LIQUID",
    cylinderTypes: ["DOT-4L"],
  },
  {
    name: "Chlorine",
    maxFillingDensityPercent: 125,
    notes: ["1"],
    cylinderTypes: [
      "DOT-3A480",
      "DOT-3AA480",
      "DOT-3",
      "DOT-3BN480",
      "DOT-3E1800",
    ],
  },
  {
    name: "1-CHLORO-1, 1-DIFLUOROETHANES or REFRIGERANT GAS R142B",
    maxFillingDensityPercent: 100,
    notes: ["4"],
    cylinderTypes: [
      "DOT-3A150",
      "DOT-3AA150",
      "DOT-3B150",
      "DOT-4B150",
      "DOT-4BA225",
      "DOT-4BW225",
      "DOT-3E1800",
      "DOT-39",
      "DOT-3AL150",
    ],
  },
  {
    name: "CHLORODIFLUOROMETHANE or REFRIGERANT GAS R22",
    maxFillingDensityPercent: 105,
    notes: ["4"],
    cylinderTypes: [
      "DOT-3A240",
      "DOT-3AA240",
      "DOT-3B240",
      "DOT-4B240",
      "DOT-4BA240",
      "DOT-4BW240",
      "DOT-4B240ET",
      "DOT-4E240",
      "DOT-39",
      "DOT-3E1800",
      "DOT-3ALA240",
    ],
  },
  {
    name: "CHLOROPENTAFLUOROETHANE",
    maxFillingDensityPercent: 110,
    cylinderTypes: [
      "DOT-3A225",
      "DOT-3AA225",
      "DOT-3B225",
      "DOT4A225",
      "DOT-4BA225",
      "DOT-4B225",
      "DOT-4BW225",
      "DOT-3E1800",
      "DOT-39",
      "DOT-3AL225",
    ],
  },
  {
    name: "CHLOROTRIFLUOROMETHANE",
    maxFillingDensityPercent: 100,
    notes: ["4"],
    cylinderTypes: [
      "DOT-3A1800",
      "DOT-3AA1800",
      "DOT-3",
      "DOT-3E1800",
      "DOT-39",
      "DOT-3AL1800",
    ],
  },
  {
    name: "CYCLOPROPANE",
    maxFillingDensityPercent: 55,
    notes: ["4"],
    cylinderTypes: [
      "DOT-3A225",
      "DOT-3A480X",
      "DOT-3AA225",
      "DOT-3B225",
      "DOT-4AA480",
      "DOT-4B225",
      "DOT-4BA225",
      "DOT-4BW225",
      "DOT-4B240ET",
      "DOT-3",
      "DOT-3E1800",
      "DOT-39",
      "DOT-3AL225",
    ],
  },
  {
    name: "DICHLORODIFLUOROMETHANE",
    maxFillingDensityPercent: 119,
    notes: ["4"],
    cylinderTypes: [
      "DOT-3A225",
      "DOT-3AA225",
      "DOT-3B225",
      "DOT-4B225",
      "DOT-4BA225",
      "DOT-4BW225",
      "DOT-4B240ET",
      "DOT-4E225",
      "DOT-39",
      "DOT-3E1800",
      "DOT-3AL225",
    ],
  },
  {
    name: "DICHLORODIFLUOROMETHANE",
    alternativeName:
      "DICHLORODIFLUOROMETHANE AND DIFLUOROETHANE AZEOTROPIC MIXTURE",
    notLiquidFullAt55C: true,
    notes: ["4"],
    cylinderTypes: [
      "DOT-3A240",
      "DOT-3AA240",
      "DOT-3B240",
      "DOT-3E1800",
      "DOT-4B240",
      "DOT-4BA240",
      "DOT-4BW240",
      "DOT-4E240",
      "DOT-39",
    ],
  },
  {
    name: "1,1- DIFLUOROETHANE",
    alternativeName: "REFRIGERANT GASR152A",
    maxFillingDensityPercent: 79,
    notes: ["4"],
    cylinderTypes: [
      "DOT-3A150",
      "DOT-3AA150",
      "DOT-3B150",
      "DOT-4B150",
      "DOT-4BA225",
      "DOT-4BW225",
      "DOT-3E1800",
      "DOT-3AL150",
    ],
  },
  {
    name: "1,1-DIFLUOROETHYLENE or REFRIGERANTGAS R1132A",
    maxFillingDensityPercent: 73,
    cylinderTypes: [
      "DOT-3A2200",
      "DOT-3AA2200",
      "DOT-3AX2200",
      "DOT-3AAX2200",
      "DOT-3T2200",
      "DOT-39",
    ],
  },
  {
    name: "DIMETHYLAMINE, ANHYDROUS",
    maxFillingDensityPercent: 59,
    cylinderTypes: [
      "DOT-3A150",
      "DOT-3AA150",
      "DOT-3B150",
      "DOT-4B150",
      "DOT-4BA225",
      "DOT-4BW225",
      "ICC-3E1800",
    ],
  },
  {
    name: "ETHANE",
    maxFillingDensityPercent: 35.8,
    notes: ["4"],
    cylinderTypes: [
      "DOT-3A1800",
      "DOT-3AX1800",
      "DOT-3AA1800",
      "DOT-3AAX1800",
      "DOT-3",
      "DOT-3E1800",
      "DOT-3T1800",
      "DOT-39",
      "DOT-3AL1800",
    ],
  },
  {
    name: "ETHANE",
    maxFillingDensityPercent: 36.8,
    notes: ["4"],
    cylinderTypes: [
      "DOT-3A2000",
      "DOT-3AX2000",
      "DOT-3AA2000",
      "DOT-3AAX2000",
      "DOT-3T2000",
      "DOT-39",
      "DOT-3AL2000",
    ],
  },
  {
    name: "ETHYLENE",
    maxFillingDensityPercent: 31.0,
    notes: ["4"],
    cylinderTypes: [
      "DOT-3A1800",
      "DOT-3AX1800",
      "DOT-3AA1800",
      "DOT-3AAX1800",
      "DOT-3",
      "DOT-3E1800",
      "DOT-3T1800",
      "DOT-39",
      "DOT-3AL1800",
    ],
  },
  {
    name: "ETHYLENE",
    maxFillingDensityPercent: 32.5,
    notes: ["4"],
    cylinderTypes: [
      "DOT-3A2000",
      "DOT-3AX2000",
      "DOT-3AA2000",
      "DOT-3AAX2000",
      "DOT-3T2000",
      "DOT-39",
      "DOT-3AL2000",
    ],
  },
  {
    name: "ETHYLENE",
    maxFillingDensityPercent: 35.5,
    notes: ["4"],
    cylinderTypes: [
      "DOT-3A2400",
      "DOT-3AX2400",
      "DOT-3AA2400",
      "DOT-3AAX2400",
      "DOT-3T2400",
      "DOT-39",
      "DOT-3AL2400",
    ],
  },
  {
    name: "HYDROGEN CHLORIDE, ANHYDROUS",
    maxFillingDensityPercent: 65,
    cylinderTypes: [
      "DOT-3A1800",
      "DOT-3AA1800",
      "DOT-3AX1800",
      "DOT-3AAX1800",
      "DOT-3",
      "DOT-3T1800",
      "DOT-3E1800",
    ],
  },
  {
    name: "HYDROGEN SULFIDE",
    maxFillingDensityPercent: 62.5,
    notes: ["5", "6"],
    cylinderTypes: [
      "DOT-3A",
      "DOT-3AA",
      "DOT-3B",
      "DOT-4A",
      "DOT-4B",
      "DOT-4BA",
      "DOT-4BW",
      "DOT-3E1800",
      "DOT-3AL",
    ],
  },
  {
    name: "INSECTICIDE GASES, N.O.S.",
    notLiquidFullAt55C: true,
    notes: ["4", "8"],
    cylinderTypes: [
      "DOT-3A300",
      "DOT-3AA300",
      "DOT-3B300",
      "DOT-4B300",
      "DOT-4BA300",
      "DOT-4BW300",
      "DOT-3E1800",
    ],
  },
  {
    name: "Liquefied nonflammable gases (other than classified flammable, corrosive, toxic & mixtures/solutions thereof filled with N2, CO2, or air)",
    notLiquidFullAt55C: true,
    notes: ["3", "4"],
    cylinderTypes: [
      // per A6.4.1
      "DOT-3",
      "DOT-3A",
      "DOT-3AA",
      "DOT-3AL",
      "DOT-3B",
      "DOT-3BN",
      "DOT-3E",
      "DOT-4B",
      "DOT-4BA",
      "DOT-4B240ET",
      "DOT-4BW",
      "DOT-4E",
      "DOT-39",

      /* do not charge and ship DOT-4E or DOT-39 cylinders with a mixture containing:
          - a pyrophoric liquid
          - carbon bisulfide (disulfide)
          - ethyl chloride
          - ethylene oxide
          - nickel carbonyl
          - spirits of nitroglycerin
          - toxic material (Class 6.1 or 2.3)
         unless authorized in a specific packaging paragraph
      */

      /* use of existing cylinders is authorized, but new construction of these cylinders is not authorized */
      "DOT-3",
      "DOT-3D",
      "DOT-4",
      "DOT-4A",
      "DOT-9",
      "DOT-25",
      "DOT-26",
      "DOT-38",
      "DOT-40",
      "DOT-41",

      /* Table A6.1 */
      "DOT-3HT",
      "DOT-4D",
      "DOT-4DA",
      "DOT-4DS",
    ],
  },
  {
    name: "METHYL ACETYLENE AND PROPADIENE MIXTURES, STABILIZED",
    notLiquidFullAt55C: true,
    notes: ["2"],
    cylinderTypes: [
      "DOT-4B240 (without brazed seams)",
      "DOT-4BA240 (without brazed seams)",
      "DOT-3A240",
      "DOT-3AA240",
      "DOT-3B240",
      "DOT-3E1800",
      "DOT-4BW240",
      "DOT-4E240",
      "DOT-4B240ET",
      "DOT-3AL240",
    ],
  },
  {
    name: "METHYL CHLORIDE",
    maxFillingDensityPercent: 84,
    cylinderTypes: [
      "DOT-3",
      "DOT-3A225",
      "DOT-3AA225",
      "DOT-3B225",
      "DOT-3E1800",
      "DOT-4B225",
      "DOT-4BA225",
      "DOT-4BW225",
      "DOT-4B240ET",
      // older cylinders also authorized:
      "DOT-3A150",
      "DOT-3B150",
      "DOT-4B150 (manufactured before 7 Dec 1936)",
    ],
  },
  {
    name: "METHYL MERCAPTAN",
    maxFillingDensityPercent: 80,
    cylinderTypes: [
      "DOT-3A240",
      "DOT-3AA240",
      "DOT-3B240",
      "DOT-4B240",
      "DOT-4B240ET",
      "DOT-3E1800",
      "DOT-4BA240",
      "DOT-4BW240",
    ],
  },
  {
    name: "NITROSYL CHLORIDE",
    maxFillingDensityPercent: 110,
    cylinderTypes: ["DOT-3BN400 only"],
  },
  {
    name: "NITROUS OXIDE",
    maxFillingDensityPercent: 68,
    notes: ["3", "4", "7"],
    cylinderTypes: [
      "DOT-3A1800",
      "DOT-3AA1800",
      "DOT-3AX1800",
      "DOT-3AAX1800",
      "DOT-3",
      "DOT-3E1800",
      "DOT-3T1800",
      "DOT-3HT2000",
      "DOT-39",
      "DOT-3AL1800",
    ],
  },
  {
    name: "REFRIGERANT GASES, N.O.S. or DISPERSANT GASES, N.O.S.",
    notLiquidFullAt55C: true,
    notes: ["4", "9"],
    cylinderTypes: [
      "DOT-3A240",
      "DOT-3AA240",
      "DOT-3AL240",
      "DOT-3B240",
      "DOT-3E1800",
      "DOT-4B240",
      "DOT-4BA240",
      "DOT-4BW240",
      "DOT-4E240",
      "DOT-39",
    ],
  },
  {
    name: "SULFUR DIOXIDE",
    maxFillingDensityPercent: 125,
    notes: ["4"],
    cylinderTypes: [
      "DOT-3",
      "DOT-3A225",
      "DOT-3AA225",
      "DOT-3AL225",
      "DOT-3B225",
      "DOT-3E1800",
      "DOT-4B225",
      "DOT-4BA225",
      "DOT-4BW225",
      "DOT-4B240ET",
      "DOT-39",
    ],
  },
  {
    name: "SULFUR HEXAFLUORIDE",
    maxFillingDensityPercent: 120,
    cylinderTypes: [
      "DOT-3A1000",
      "DOT-3AA1000",
      "DOT-3AAX2400",
      "DOT-3",
      "DOT-3AL1000",
      "DOT-3E1800",
      "DOT-3T1800",
    ],
  },
  {
    name: "SULFURYL FLUORIDE",
    maxFillingDensityPercent: 106,
    cylinderTypes: [
      "DOT-3A480",
      "DOT-3AA480",
      "DOT-3E1800",
      "DOT-4B480",
      "DOT-4BA480",
      "DOT-4BW480",
    ],
  },
  {
    name: "TETRAFLUOROETHYLENE, STABILIZED",
    maxFillingDensityPercent: 90,
    cylinderTypes: ["DOT-3A1200", "DOT-3AA1200", "DOT-3E1800"],
  },
  {
    name: "TRIFLUOROCHLOROETHYLENE, STABILIZED",
    maxFillingDensityPercent: 115,
    cylinderTypes: [
      "DOT-3A300",
      "DOT-3AA300",
      "DOT-3B300",
      "DOT-3E1800",
      "DOT-4B300",
      "DOT-4BA300",
      "DOT-4BW300",
    ],
  },
  {
    name: "TRIMETHYLAMINE, ANHYDROUS",
    maxFillingDensityPercent: 57,
    cylinderTypes: [
      "DOT-3A150",
      "DOT-3AA150",
      "DOT-3B150",
      "DOT-4B150",
      "DOT-4BA225",
      "DOT-4BW225",
      "DOT-3E1800",
    ],
  },
  {
    name: "VINYL CHLORIDE, STABILIZED",
    maxFillingDensityPercent: 84,
    notes: ["2"],
    cylinderTypes: [
      "DOT-4B150 without brazed seams",
      "DOT-4BA225 without brazed seams",
      "DOT-4BW225",
      "DOT-3A150",
      "DOT-3AA150",
      "DOT-3AL150",
      "DOT-3E1800",
    ],
  },
  {
    name: "VINYL CHLORIDE, STABILIZED",
    maxFillingDensityPercent: 62,
    cylinderTypes: ["DOT-3A1800", "DOT-3AA1800", "DOT-3E1800", "DOT-3AL1800"],
  },
  {
    name: "VINYL METHYL ETHER, STABILIZED",
    maxFillingDensityPercent: 68,
    notes: ["2"],
    cylinderTypes: [
      "DOT-4B150 without brazed seams",
      "DOT-4BA225 without brazed seams",
      "DOT-4BW225",
      "DOT-3A150",
      "DOT-3AA150",
      "DOT-3B1800",
      "DOT-3E1800",
    ],
  },
];

/* 

  Notes:

  1. Cylinders purchased after 1 October 1944 for the transportation of chlorine must contain no
     aperture other than that provided in the neck of the cylinder for attachment of a valve equipped
     with an approved safety device. Cylinders purchased after November 1, 1935 and charged with
     chlorine must not contain over 150 pounds of gas. (T-0).

  2. All parts of valve and safety devices in contact with contents of cylinders must be of a
     metal or other material, suitably treated if necessary, which will not cause formation of any
     acetylides. (T-0).
    
  3. DOT-3HT cylinders are authorized for use in aircraft only for a maximum service life of 24
     years. They must be equipped with a frangible disc safety relief device, without fusible metal
     backing, and with a rated bursting pressure not over 9 percent of the minimum required test
     pressure of the cylinder with which the device is used. Ship only nonflammable gases in these
     cylinders and pack in strong outer packagings.

  4. Refer to A3.3.2.7. for additional packaging requirements, if applicable.

  5. Use of a DOT specification cylinder with a service pressure of 480 psi is not Luthorized.

  6. Ensure each valve outlet is sealed by a threaded cap or a threaded solid plug.

  7. Ensure DOT-3AL cylinders are equipped with brass or stainless steel valves and cleaned in
     compliance with Federal Specification RR-C-901c.

  8. See A6.4.1. and A6.4.6. (Only DOT 2P is authorized).

  9. See A6.4.6.

*/
