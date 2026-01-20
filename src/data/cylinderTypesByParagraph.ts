/**
 * Cylinder Types by Packaging Paragraph
 *
 * Maps AFMAN 24-604 Attachment 6 packaging paragraphs (A6.2-A6.28)
 * to their valid cylinder/container types for Class 2 compressed gases.
 *
 * IMPORTANT: This file implements two lookup mechanisms:
 * 1. Table A6.1 - Gas name to authorized cylinders (PRIMARY for A6.4, A6.5, A6.6)
 * 2. Paragraph defaults - When gas is NOT listed in Table A6.1
 *
 * Reference: docs/reference/afman-attachment6-cylinder-requirements.md
 * Source: AFMAN 24-604, 9 October 2020, Pages 270-300
 */

// =============================================================================
// INTERFACES
// =============================================================================

export interface CylinderType {
  id: string; // e.g., "DOT-3A", "DOT-3A1800"
  label: string; // e.g., "DOT 3A", "DOT 3A1800"
  restrictions?: string; // e.g., "NOT for Class 8 materials"
  minServicePressure?: number; // If suffix indicates pressure, this is the minimum
  legacy?: boolean; // Existing cylinders only, no new construction
}

export interface GasCylinderMapping {
  gasName: string;
  maxFillDensity?: string; // e.g., "54%", "Not liquid full at 55°C"
  cylinders: CylinderType[];
  notes?: string[];
}

export interface ParagraphInfo {
  paragraph: string;
  title: string;
  requiresCylinderSelection: boolean;
  exemptReason?: "not_cylinders" | "exempt_from_specs" | "equipment" | "emptied";
  exemptMessage?: string; // Message to show inspector
  referencesTableA61: boolean;
  defaultCylinders: CylinderType[];
  legacyCylinders?: CylinderType[];
  otherContainers?: CylinderType[]; // Non-cylinder containers (aerosols, drums, etc.)
  notes?: string[];
}

// =============================================================================
// TABLE A6.1 - GAS TO CYLINDER MAPPING
// =============================================================================

/**
 * Table A6.1 - Cylinder Requirements for Compressed Gases
 *
 * This is the PRIMARY reference for specific gases. When a gas is listed here,
 * these are the ONLY authorized cylinder types (along with same type at higher
 * service pressure).
 *
 * Gases not listed here fall back to paragraph default cylinders.
 */
export const TABLE_A6_1: GasCylinderMapping[] = [
  {
    gasName: "Anhydrous ammonia",
    maxFillDensity: "54%",
    cylinders: [
      { id: "DOT-3A480", label: "DOT 3A480", minServicePressure: 480 },
      { id: "DOT-3AA480", label: "DOT 3AA480", minServicePressure: 480 },
      { id: "DOT-3A480X", label: "DOT 3A480X", minServicePressure: 480 },
      { id: "DOT-4AA480", label: "DOT 4AA480", minServicePressure: 480 },
      { id: "DOT-3", label: "DOT 3" },
      { id: "DOT-3E1800", label: "DOT 3E1800", minServicePressure: 1800 },
      { id: "DOT-3AL480", label: "DOT 3AL480", minServicePressure: 480 },
    ],
  },
  {
    gasName: "Bromotrifluoromethane",
    maxFillDensity: "124%",
    cylinders: [
      { id: "DOT-3A400", label: "DOT 3A400", minServicePressure: 400 },
      { id: "DOT-3AA400", label: "DOT 3AA400", minServicePressure: 400 },
      { id: "DOT-3B400", label: "DOT 3B400", minServicePressure: 400 },
      { id: "DOT-4AA480", label: "DOT 4AA480", minServicePressure: 480 },
      { id: "DOT-4B400", label: "DOT 4B400", minServicePressure: 400 },
      { id: "DOT-4BA400", label: "DOT 4BA400", minServicePressure: 400 },
      { id: "DOT-4BW400", label: "DOT 4BW400", minServicePressure: 400 },
      { id: "DOT-3E1800", label: "DOT 3E1800", minServicePressure: 1800 },
      { id: "DOT-39", label: "DOT 39" },
      { id: "DOT-3AL400", label: "DOT 3AL400", minServicePressure: 400 },
    ],
    notes: ["Also known as R-13B1, Halon 1301"],
  },
  {
    gasName: "Carbon dioxide",
    maxFillDensity: "68%",
    cylinders: [
      { id: "DOT-3A1800", label: "DOT 3A1800", minServicePressure: 1800 },
      { id: "DOT-3AX1800", label: "DOT 3AX1800", minServicePressure: 1800 },
      { id: "DOT-3AA1800", label: "DOT 3AA1800", minServicePressure: 1800 },
      { id: "DOT-3AAX1800", label: "DOT 3AAX1800", minServicePressure: 1800 },
      { id: "DOT-3", label: "DOT 3" },
      { id: "DOT-3E1800", label: "DOT 3E1800", minServicePressure: 1800 },
      { id: "DOT-3T1800", label: "DOT 3T1800", minServicePressure: 1800 },
      {
        id: "DOT-3HT2000",
        label: "DOT 3HT2000",
        minServicePressure: 2000,
        restrictions: "Aircraft use only, 24-year max life",
      },
      { id: "DOT-39", label: "DOT 39" },
      { id: "DOT-3AL1800", label: "DOT 3AL1800", minServicePressure: 1800 },
    ],
    notes: ["See A3.3.2.7 for additional requirements"],
  },
  {
    gasName: "Carbon dioxide, refrigerated liquid",
    cylinders: [{ id: "DOT-4L", label: "DOT 4L" }],
  },
  {
    gasName: "Chlorine",
    maxFillDensity: "125%",
    cylinders: [
      { id: "DOT-3A480", label: "DOT 3A480", minServicePressure: 480 },
      { id: "DOT-3AA480", label: "DOT 3AA480", minServicePressure: 480 },
      { id: "DOT-3", label: "DOT 3" },
      { id: "DOT-3BN480", label: "DOT 3BN480", minServicePressure: 480 },
      { id: "DOT-3E1800", label: "DOT 3E1800", minServicePressure: 1800 },
    ],
    notes: [
      "Max 150 lbs after Nov 1935",
      "Cylinders after Oct 1, 1944 must have single aperture (neck for valve with safety device)",
    ],
  },
  {
    gasName: "Chlorodifluoroethane",
    maxFillDensity: "100%",
    cylinders: [
      { id: "DOT-3A150", label: "DOT 3A150", minServicePressure: 150 },
      { id: "DOT-3AA150", label: "DOT 3AA150", minServicePressure: 150 },
      { id: "DOT-3B150", label: "DOT 3B150", minServicePressure: 150 },
      { id: "DOT-4B150", label: "DOT 4B150", minServicePressure: 150 },
      { id: "DOT-4BA225", label: "DOT 4BA225", minServicePressure: 225 },
      { id: "DOT-4BW225", label: "DOT 4BW225", minServicePressure: 225 },
      { id: "DOT-3E1800", label: "DOT 3E1800", minServicePressure: 1800 },
      { id: "DOT-39", label: "DOT 39" },
      { id: "DOT-3AL150", label: "DOT 3AL150", minServicePressure: 150 },
    ],
    notes: ["Also known as R-142b"],
  },
  {
    gasName: "Chlorodifluoromethane",
    maxFillDensity: "105%",
    cylinders: [
      { id: "DOT-3A240", label: "DOT 3A240", minServicePressure: 240 },
      { id: "DOT-3AA240", label: "DOT 3AA240", minServicePressure: 240 },
      { id: "DOT-3B240", label: "DOT 3B240", minServicePressure: 240 },
      { id: "DOT-4B240", label: "DOT 4B240", minServicePressure: 240 },
      { id: "DOT-4BA240", label: "DOT 4BA240", minServicePressure: 240 },
      { id: "DOT-4BW240", label: "DOT 4BW240", minServicePressure: 240 },
      { id: "DOT-4B240ET", label: "DOT 4B240ET", minServicePressure: 240 },
      { id: "DOT-4E240", label: "DOT 4E240", minServicePressure: 240 },
      { id: "DOT-39", label: "DOT 39" },
      { id: "DOT-3E1800", label: "DOT 3E1800", minServicePressure: 1800 },
      { id: "DOT-3AL240", label: "DOT 3AL240", minServicePressure: 240 },
    ],
    notes: ["Also known as R-22"],
  },
  {
    gasName: "Chloropentafluoroethane",
    maxFillDensity: "110%",
    cylinders: [
      { id: "DOT-3A225", label: "DOT 3A225", minServicePressure: 225 },
      { id: "DOT-3AA225", label: "DOT 3AA225", minServicePressure: 225 },
      { id: "DOT-3B225", label: "DOT 3B225", minServicePressure: 225 },
      { id: "DOT-4A225", label: "DOT 4A225", minServicePressure: 225 },
      { id: "DOT-4BA225", label: "DOT 4BA225", minServicePressure: 225 },
      { id: "DOT-4B225", label: "DOT 4B225", minServicePressure: 225 },
      { id: "DOT-4BW225", label: "DOT 4BW225", minServicePressure: 225 },
      { id: "DOT-3E1800", label: "DOT 3E1800", minServicePressure: 1800 },
      { id: "DOT-39", label: "DOT 39" },
      { id: "DOT-3AL225", label: "DOT 3AL225", minServicePressure: 225 },
    ],
    notes: ["Also known as R-115"],
  },
  {
    gasName: "Chlorotrifluoromethane",
    maxFillDensity: "100%",
    cylinders: [
      { id: "DOT-3A1800", label: "DOT 3A1800", minServicePressure: 1800 },
      { id: "DOT-3AA1800", label: "DOT 3AA1800", minServicePressure: 1800 },
      { id: "DOT-3", label: "DOT 3" },
      { id: "DOT-3E1800", label: "DOT 3E1800", minServicePressure: 1800 },
      { id: "DOT-39", label: "DOT 39" },
      { id: "DOT-3AL1800", label: "DOT 3AL1800", minServicePressure: 1800 },
    ],
    notes: ["Also known as R-13"],
  },
  {
    gasName: "Cyclopropane",
    maxFillDensity: "55%",
    cylinders: [
      { id: "DOT-3A225", label: "DOT 3A225", minServicePressure: 225 },
      { id: "DOT-3A480X", label: "DOT 3A480X", minServicePressure: 480 },
      { id: "DOT-3AA225", label: "DOT 3AA225", minServicePressure: 225 },
      { id: "DOT-3B225", label: "DOT 3B225", minServicePressure: 225 },
      { id: "DOT-4AA480", label: "DOT 4AA480", minServicePressure: 480 },
      { id: "DOT-4B225", label: "DOT 4B225", minServicePressure: 225 },
      { id: "DOT-4BA225", label: "DOT 4BA225", minServicePressure: 225 },
      { id: "DOT-4BW225", label: "DOT 4BW225", minServicePressure: 225 },
      { id: "DOT-4B240ET", label: "DOT 4B240ET", minServicePressure: 240 },
      { id: "DOT-3", label: "DOT 3" },
      { id: "DOT-3E1800", label: "DOT 3E1800", minServicePressure: 1800 },
      { id: "DOT-39", label: "DOT 39" },
      { id: "DOT-3AL225", label: "DOT 3AL225", minServicePressure: 225 },
    ],
  },
  {
    gasName: "Dichlorodifluoromethane",
    maxFillDensity: "119%",
    cylinders: [
      { id: "DOT-3A225", label: "DOT 3A225", minServicePressure: 225 },
      { id: "DOT-3AA225", label: "DOT 3AA225", minServicePressure: 225 },
      { id: "DOT-3B225", label: "DOT 3B225", minServicePressure: 225 },
      { id: "DOT-4B225", label: "DOT 4B225", minServicePressure: 225 },
      { id: "DOT-4BA225", label: "DOT 4BA225", minServicePressure: 225 },
      { id: "DOT-4BW225", label: "DOT 4BW225", minServicePressure: 225 },
      { id: "DOT-4B240ET", label: "DOT 4B240ET", minServicePressure: 240 },
      { id: "DOT-4E225", label: "DOT 4E225", minServicePressure: 225 },
      { id: "DOT-39", label: "DOT 39" },
      { id: "DOT-3E1800", label: "DOT 3E1800", minServicePressure: 1800 },
      { id: "DOT-3AL225", label: "DOT 3AL225", minServicePressure: 225 },
    ],
    notes: ["Also known as R-12"],
  },
  {
    gasName: "Dichlorodifluoromethane and difluoroethane mixture",
    maxFillDensity: "Not liquid full at 55°C",
    cylinders: [
      { id: "DOT-3A240", label: "DOT 3A240", minServicePressure: 240 },
      { id: "DOT-3AA240", label: "DOT 3AA240", minServicePressure: 240 },
      { id: "DOT-3B240", label: "DOT 3B240", minServicePressure: 240 },
      { id: "DOT-3E1800", label: "DOT 3E1800", minServicePressure: 1800 },
      { id: "DOT-4B240", label: "DOT 4B240", minServicePressure: 240 },
      { id: "DOT-4BA240", label: "DOT 4BA240", minServicePressure: 240 },
      { id: "DOT-4BW240", label: "DOT 4BW240", minServicePressure: 240 },
      { id: "DOT-4E240", label: "DOT 4E240", minServicePressure: 240 },
      { id: "DOT-39", label: "DOT 39" },
    ],
    notes: ["Also known as R-500"],
  },
  {
    gasName: "Difluoroethane",
    maxFillDensity: "79%",
    cylinders: [
      { id: "DOT-3A150", label: "DOT 3A150", minServicePressure: 150 },
      { id: "DOT-3AA150", label: "DOT 3AA150", minServicePressure: 150 },
      { id: "DOT-3B150", label: "DOT 3B150", minServicePressure: 150 },
      { id: "DOT-4B150", label: "DOT 4B150", minServicePressure: 150 },
      { id: "DOT-4BA225", label: "DOT 4BA225", minServicePressure: 225 },
      { id: "DOT-4BW225", label: "DOT 4BW225", minServicePressure: 225 },
      { id: "DOT-3E1800", label: "DOT 3E1800", minServicePressure: 1800 },
      { id: "DOT-3AL150", label: "DOT 3AL150", minServicePressure: 150 },
    ],
    notes: ["Also known as R-152a"],
  },
  {
    gasName: "1,1-Difluoroethylene",
    maxFillDensity: "73%",
    cylinders: [
      { id: "DOT-3A2200", label: "DOT 3A2200", minServicePressure: 2200 },
      { id: "DOT-3AA2200", label: "DOT 3AA2200", minServicePressure: 2200 },
      { id: "DOT-3AX2200", label: "DOT 3AX2200", minServicePressure: 2200 },
      { id: "DOT-3AAX2200", label: "DOT 3AAX2200", minServicePressure: 2200 },
      { id: "DOT-3T2200", label: "DOT 3T2200", minServicePressure: 2200 },
      { id: "DOT-39", label: "DOT 39" },
    ],
    notes: ["Also known as R-1132A"],
  },
  {
    gasName: "Dimethylamine, anhydrous",
    maxFillDensity: "59%",
    cylinders: [
      { id: "DOT-3A150", label: "DOT 3A150", minServicePressure: 150 },
      { id: "DOT-3AA150", label: "DOT 3AA150", minServicePressure: 150 },
      { id: "DOT-3B150", label: "DOT 3B150", minServicePressure: 150 },
      { id: "DOT-4B150", label: "DOT 4B150", minServicePressure: 150 },
      { id: "DOT-4BA225", label: "DOT 4BA225", minServicePressure: 225 },
      { id: "DOT-4BW225", label: "DOT 4BW225", minServicePressure: 225 },
      { id: "ICC-3E1800", label: "ICC 3E1800", minServicePressure: 1800 },
    ],
  },
  {
    gasName: "Ethane",
    maxFillDensity: "35.8%",
    cylinders: [
      { id: "DOT-3A1800", label: "DOT 3A1800", minServicePressure: 1800 },
      { id: "DOT-3AX1800", label: "DOT 3AX1800", minServicePressure: 1800 },
      { id: "DOT-3AA1800", label: "DOT 3AA1800", minServicePressure: 1800 },
      { id: "DOT-3AAX1800", label: "DOT 3AAX1800", minServicePressure: 1800 },
      { id: "DOT-3", label: "DOT 3" },
      { id: "DOT-3E1800", label: "DOT 3E1800", minServicePressure: 1800 },
      { id: "DOT-3T1800", label: "DOT 3T1800", minServicePressure: 1800 },
      { id: "DOT-39", label: "DOT 39" },
      { id: "DOT-3AL1800", label: "DOT 3AL1800", minServicePressure: 1800 },
    ],
    notes: ["Higher pressure (36.8%) variant also exists at 2000 psig"],
  },
  {
    gasName: "Ethylene",
    maxFillDensity: "31.0%",
    cylinders: [
      { id: "DOT-3A1800", label: "DOT 3A1800", minServicePressure: 1800 },
      { id: "DOT-3AX1800", label: "DOT 3AX1800", minServicePressure: 1800 },
      { id: "DOT-3AA1800", label: "DOT 3AA1800", minServicePressure: 1800 },
      { id: "DOT-3AAX1800", label: "DOT 3AAX1800", minServicePressure: 1800 },
      { id: "DOT-3", label: "DOT 3" },
      { id: "DOT-3E1800", label: "DOT 3E1800", minServicePressure: 1800 },
      { id: "DOT-3T1800", label: "DOT 3T1800", minServicePressure: 1800 },
      { id: "DOT-39", label: "DOT 39" },
      { id: "DOT-3AL1800", label: "DOT 3AL1800", minServicePressure: 1800 },
    ],
    notes: ["Higher pressure variants: 2000 psig (32.5%), 2400 psig (35.5%)"],
  },
  {
    gasName: "Hydrogen chloride, anhydrous",
    maxFillDensity: "65%",
    cylinders: [
      { id: "DOT-3A1800", label: "DOT 3A1800", minServicePressure: 1800 },
      { id: "DOT-3AA1800", label: "DOT 3AA1800", minServicePressure: 1800 },
      { id: "DOT-3AX1800", label: "DOT 3AX1800", minServicePressure: 1800 },
      { id: "DOT-3AAX1800", label: "DOT 3AAX1800", minServicePressure: 1800 },
      { id: "DOT-3", label: "DOT 3" },
      { id: "DOT-3T1800", label: "DOT 3T1800", minServicePressure: 1800 },
      { id: "DOT-3E1800", label: "DOT 3E1800", minServicePressure: 1800 },
    ],
  },
  {
    gasName: "Hydrogen sulfide",
    maxFillDensity: "62.5%",
    cylinders: [
      { id: "DOT-3A", label: "DOT 3A", restrictions: "NOT 480 psi service" },
      { id: "DOT-3AA", label: "DOT 3AA", restrictions: "NOT 480 psi service" },
      { id: "DOT-3B", label: "DOT 3B" },
      { id: "DOT-4A", label: "DOT 4A" },
      { id: "DOT-4B", label: "DOT 4B" },
      { id: "DOT-4BA", label: "DOT 4BA" },
      { id: "DOT-4BW", label: "DOT 4BW" },
      { id: "DOT-3E1800", label: "DOT 3E1800", minServicePressure: 1800 },
      { id: "DOT-3AL", label: "DOT 3AL" },
    ],
    notes: [
      "DOT spec cylinder with 480 psi service pressure NOT authorized",
      "Each valve outlet must be sealed by threaded cap or threaded solid plug",
    ],
  },
  {
    gasName: "Insecticide gases, liquefied",
    maxFillDensity: "Not liquid full at 55°C",
    cylinders: [
      { id: "DOT-3A300", label: "DOT 3A300", minServicePressure: 300 },
      { id: "DOT-3AA300", label: "DOT 3AA300", minServicePressure: 300 },
      { id: "DOT-3B300", label: "DOT 3B300", minServicePressure: 300 },
      { id: "DOT-4B300", label: "DOT 4B300", minServicePressure: 300 },
      { id: "DOT-4BA300", label: "DOT 4BA300", minServicePressure: 300 },
      { id: "DOT-4BW300", label: "DOT 4BW300", minServicePressure: 300 },
      { id: "DOT-3E1800", label: "DOT 3E1800", minServicePressure: 1800 },
    ],
    notes: ["See A6.4.1 and A6.4.6 - Only DOT 2P authorized for A6.4.6"],
  },
  {
    gasName: "Methylacetylene-propadiene, stabilized",
    maxFillDensity: "Not liquid full at 55°C",
    cylinders: [
      {
        id: "DOT-4B240",
        label: "DOT 4B240",
        minServicePressure: 240,
        restrictions: "No brazed seams",
      },
      {
        id: "DOT-4BA240",
        label: "DOT 4BA240",
        minServicePressure: 240,
        restrictions: "No brazed seams",
      },
      { id: "DOT-3A240", label: "DOT 3A240", minServicePressure: 240 },
      { id: "DOT-3AA240", label: "DOT 3AA240", minServicePressure: 240 },
      { id: "DOT-3B240", label: "DOT 3B240", minServicePressure: 240 },
      { id: "DOT-3E1800", label: "DOT 3E1800", minServicePressure: 1800 },
      { id: "DOT-4BW240", label: "DOT 4BW240", minServicePressure: 240 },
      { id: "DOT-4E240", label: "DOT 4E240", minServicePressure: 240 },
      { id: "DOT-4B240ET", label: "DOT 4B240ET", minServicePressure: 240 },
      { id: "DOT-3AL240", label: "DOT 3AL240", minServicePressure: 240 },
    ],
    notes: ["Also known as MAPP gas"],
  },
  {
    gasName: "Methyl chloride",
    maxFillDensity: "84%",
    cylinders: [
      { id: "DOT-3", label: "DOT 3" },
      { id: "DOT-3A225", label: "DOT 3A225", minServicePressure: 225 },
      { id: "DOT-3AA225", label: "DOT 3AA225", minServicePressure: 225 },
      { id: "DOT-3B225", label: "DOT 3B225", minServicePressure: 225 },
      { id: "DOT-3E1800", label: "DOT 3E1800", minServicePressure: 1800 },
      { id: "DOT-4B225", label: "DOT 4B225", minServicePressure: 225 },
      { id: "DOT-4BA225", label: "DOT 4BA225", minServicePressure: 225 },
      { id: "DOT-4BW225", label: "DOT 4BW225", minServicePressure: 225 },
      { id: "DOT-4B240ET", label: "DOT 4B240ET", minServicePressure: 240 },
    ],
    notes: [
      "Pre-Dec 1936 cylinders: DOT-3A150, 3B150, 4B150 also authorized",
    ],
  },
  {
    gasName: "Methyl mercaptan",
    maxFillDensity: "80%",
    cylinders: [
      { id: "DOT-3A240", label: "DOT 3A240", minServicePressure: 240 },
      { id: "DOT-3AA240", label: "DOT 3AA240", minServicePressure: 240 },
      { id: "DOT-3B240", label: "DOT 3B240", minServicePressure: 240 },
      { id: "DOT-4B240", label: "DOT 4B240", minServicePressure: 240 },
      { id: "DOT-4B240ET", label: "DOT 4B240ET", minServicePressure: 240 },
      { id: "DOT-3E1800", label: "DOT 3E1800", minServicePressure: 1800 },
      { id: "DOT-4BA240", label: "DOT 4BA240", minServicePressure: 240 },
      { id: "DOT-4BW240", label: "DOT 4BW240", minServicePressure: 240 },
    ],
  },
  {
    gasName: "Nitrosyl chloride",
    maxFillDensity: "110%",
    cylinders: [
      {
        id: "DOT-3BN400",
        label: "DOT 3BN400",
        minServicePressure: 400,
        restrictions: "ONLY authorized cylinder",
      },
    ],
  },
  {
    gasName: "Nitrous oxide",
    maxFillDensity: "68%",
    cylinders: [
      { id: "DOT-3A1800", label: "DOT 3A1800", minServicePressure: 1800 },
      { id: "DOT-3AA1800", label: "DOT 3AA1800", minServicePressure: 1800 },
      { id: "DOT-3AX1800", label: "DOT 3AX1800", minServicePressure: 1800 },
      { id: "DOT-3AAX1800", label: "DOT 3AAX1800", minServicePressure: 1800 },
      { id: "DOT-3", label: "DOT 3" },
      { id: "DOT-3E1800", label: "DOT 3E1800", minServicePressure: 1800 },
      { id: "DOT-3T1800", label: "DOT 3T1800", minServicePressure: 1800 },
      {
        id: "DOT-3HT2000",
        label: "DOT 3HT2000",
        minServicePressure: 2000,
        restrictions: "Aircraft use only, 24-year max life",
      },
      { id: "DOT-39", label: "DOT 39" },
      {
        id: "DOT-3AL1800",
        label: "DOT 3AL1800",
        minServicePressure: 1800,
        restrictions: "Brass or stainless steel valves, cleaned per RR-C-901c",
      },
    ],
  },
  {
    gasName: "Refrigerant gas, N.O.S.",
    maxFillDensity: "Not liquid full at 55°C",
    cylinders: [
      { id: "DOT-3A240", label: "DOT 3A240", minServicePressure: 240 },
      { id: "DOT-3AA240", label: "DOT 3AA240", minServicePressure: 240 },
      { id: "DOT-3AL240", label: "DOT 3AL240", minServicePressure: 240 },
      { id: "DOT-3B240", label: "DOT 3B240", minServicePressure: 240 },
      { id: "DOT-3E1800", label: "DOT 3E1800", minServicePressure: 1800 },
      { id: "DOT-4B240", label: "DOT 4B240", minServicePressure: 240 },
      { id: "DOT-4BA240", label: "DOT 4BA240", minServicePressure: 240 },
      { id: "DOT-4BW240", label: "DOT 4BW240", minServicePressure: 240 },
      { id: "DOT-4E240", label: "DOT 4E240", minServicePressure: 240 },
      { id: "DOT-39", label: "DOT 39" },
    ],
    notes: ["Also applies to Dispersant gas, N.O.S."],
  },
  {
    gasName: "Sulfur dioxide",
    maxFillDensity: "125%",
    cylinders: [
      { id: "DOT-3", label: "DOT 3" },
      { id: "DOT-3A225", label: "DOT 3A225", minServicePressure: 225 },
      { id: "DOT-3AA225", label: "DOT 3AA225", minServicePressure: 225 },
      { id: "DOT-3AL225", label: "DOT 3AL225", minServicePressure: 225 },
      { id: "DOT-3B225", label: "DOT 3B225", minServicePressure: 225 },
      { id: "DOT-3E1800", label: "DOT 3E1800", minServicePressure: 1800 },
      { id: "DOT-4B225", label: "DOT 4B225", minServicePressure: 225 },
      { id: "DOT-4BA225", label: "DOT 4BA225", minServicePressure: 225 },
      { id: "DOT-4BW225", label: "DOT 4BW225", minServicePressure: 225 },
      { id: "DOT-4B240ET", label: "DOT 4B240ET", minServicePressure: 240 },
      { id: "DOT-39", label: "DOT 39" },
    ],
  },
  {
    gasName: "Sulfur hexafluoride",
    maxFillDensity: "120%",
    cylinders: [
      { id: "DOT-3A1000", label: "DOT 3A1000", minServicePressure: 1000 },
      { id: "DOT-3AA1000", label: "DOT 3AA1000", minServicePressure: 1000 },
      { id: "DOT-3AAX2400", label: "DOT 3AAX2400", minServicePressure: 2400 },
      { id: "DOT-3", label: "DOT 3" },
      { id: "DOT-3AL1000", label: "DOT 3AL1000", minServicePressure: 1000 },
      { id: "DOT-3E1800", label: "DOT 3E1800", minServicePressure: 1800 },
      { id: "DOT-3T1800", label: "DOT 3T1800", minServicePressure: 1800 },
    ],
  },
  {
    gasName: "Sulfuryl fluoride",
    maxFillDensity: "106%",
    cylinders: [
      { id: "DOT-3A480", label: "DOT 3A480", minServicePressure: 480 },
      { id: "DOT-3AA480", label: "DOT 3AA480", minServicePressure: 480 },
      { id: "DOT-3E1800", label: "DOT 3E1800", minServicePressure: 1800 },
      { id: "DOT-4B480", label: "DOT 4B480", minServicePressure: 480 },
      { id: "DOT-4BA480", label: "DOT 4BA480", minServicePressure: 480 },
      { id: "DOT-4BW480", label: "DOT 4BW480", minServicePressure: 480 },
    ],
  },
  {
    gasName: "Tetrafluoroethylene, stabilized",
    maxFillDensity: "90%",
    cylinders: [
      { id: "DOT-3A1200", label: "DOT 3A1200", minServicePressure: 1200 },
      { id: "DOT-3AA1200", label: "DOT 3AA1200", minServicePressure: 1200 },
      { id: "DOT-3E1800", label: "DOT 3E1800", minServicePressure: 1800 },
    ],
  },
  {
    gasName: "Trifluorochloroethylene, stabilized",
    maxFillDensity: "115%",
    cylinders: [
      { id: "DOT-3A300", label: "DOT 3A300", minServicePressure: 300 },
      { id: "DOT-3AA300", label: "DOT 3AA300", minServicePressure: 300 },
      { id: "DOT-3B300", label: "DOT 3B300", minServicePressure: 300 },
      { id: "DOT-3E1800", label: "DOT 3E1800", minServicePressure: 1800 },
      { id: "DOT-4B300", label: "DOT 4B300", minServicePressure: 300 },
      { id: "DOT-4BA300", label: "DOT 4BA300", minServicePressure: 300 },
      { id: "DOT-4BW300", label: "DOT 4BW300", minServicePressure: 300 },
    ],
  },
  {
    gasName: "Trimethylamine, anhydrous",
    maxFillDensity: "57%",
    cylinders: [
      { id: "DOT-3A150", label: "DOT 3A150", minServicePressure: 150 },
      { id: "DOT-3AA150", label: "DOT 3AA150", minServicePressure: 150 },
      { id: "DOT-3B150", label: "DOT 3B150", minServicePressure: 150 },
      { id: "DOT-4B150", label: "DOT 4B150", minServicePressure: 150 },
      { id: "DOT-4BA225", label: "DOT 4BA225", minServicePressure: 225 },
      { id: "DOT-4BW225", label: "DOT 4BW225", minServicePressure: 225 },
      { id: "DOT-3E1800", label: "DOT 3E1800", minServicePressure: 1800 },
    ],
  },
  {
    gasName: "Vinyl chloride",
    maxFillDensity: "84%",
    cylinders: [
      {
        id: "DOT-4B150",
        label: "DOT 4B150",
        minServicePressure: 150,
        restrictions: "No brazed seams",
      },
      {
        id: "DOT-4BA225",
        label: "DOT 4BA225",
        minServicePressure: 225,
        restrictions: "No brazed seams",
      },
      { id: "DOT-4BW225", label: "DOT 4BW225", minServicePressure: 225 },
      { id: "DOT-3A150", label: "DOT 3A150", minServicePressure: 150 },
      { id: "DOT-3AA150", label: "DOT 3AA150", minServicePressure: 150 },
      { id: "DOT-3AL150", label: "DOT 3AL150", minServicePressure: 150 },
      { id: "DOT-3E1800", label: "DOT 3E1800", minServicePressure: 1800 },
    ],
    notes: ["Acetylide-forming gas - valve parts must not cause acetylide formation"],
  },
  {
    gasName: "Vinyl fluoride, stabilized",
    maxFillDensity: "62%",
    cylinders: [
      { id: "DOT-3A1800", label: "DOT 3A1800", minServicePressure: 1800 },
      { id: "DOT-3AA1800", label: "DOT 3AA1800", minServicePressure: 1800 },
      { id: "DOT-3E1800", label: "DOT 3E1800", minServicePressure: 1800 },
      { id: "DOT-3AL1800", label: "DOT 3AL1800", minServicePressure: 1800 },
    ],
  },
  {
    gasName: "Vinyl methyl ether",
    maxFillDensity: "68%",
    cylinders: [
      {
        id: "DOT-4B150",
        label: "DOT 4B150",
        minServicePressure: 150,
        restrictions: "No brazed seams",
      },
      {
        id: "DOT-4BA225",
        label: "DOT 4BA225",
        minServicePressure: 225,
        restrictions: "No brazed seams",
      },
      { id: "DOT-4BW225", label: "DOT 4BW225", minServicePressure: 225 },
      { id: "DOT-3A150", label: "DOT 3A150", minServicePressure: 150 },
      { id: "DOT-3AA150", label: "DOT 3AA150", minServicePressure: 150 },
      { id: "DOT-3B1800", label: "DOT 3B1800", minServicePressure: 1800 },
      { id: "DOT-3E1800", label: "DOT 3E1800", minServicePressure: 1800 },
    ],
    notes: ["Acetylide-forming gas - valve parts must not cause acetylide formation"],
  },
];

// =============================================================================
// PARAGRAPH REQUIREMENTS
// =============================================================================

/**
 * Paragraph-specific requirements including cylinder lists and exemptions.
 */
export const PARAGRAPH_REQUIREMENTS: Record<string, ParagraphInfo> = {
  // A6.2 - Aerosols
  "A6.2": {
    paragraph: "A6.2",
    title: "Aerosols",
    requiresCylinderSelection: true,
    referencesTableA61: false,
    defaultCylinders: [], // Aerosols use pressure-based container selection
    otherContainers: [
      { id: "DOT-2P", label: "DOT 2P", restrictions: ">140-160 psig at 55°C" },
      { id: "DOT-2Q", label: "DOT 2Q", restrictions: ">160-180 psig at 55°C" },
      { id: "ICAO-IP7", label: "ICAO/IATA IP7", restrictions: ">140-160 psig at 55°C" },
      { id: "ICAO-IP7A", label: "ICAO/IATA IP7A", restrictions: ">140-180 psig at 55°C" },
      { id: "ICAO-IP7B", label: "ICAO/IATA IP7B", restrictions: ">140-217 psig at 55°C" },
      { id: "NON-REFILL-METAL", label: "Non-refillable metal/plastic", restrictions: "≤140 psig at 55°C, ≤1L" },
      { id: "NON-REFILL-NONMETAL", label: "Non-refillable non-metal", restrictions: "≤140 psig at 55°C, ≤120mL" },
    ],
    notes: [
      "Aerosol containers, NOT traditional cylinders",
      "UN specification NOT required for non-toxic aerosols",
    ],
  },

  // A6.3 - Small Receptacles
  "A6.3": {
    paragraph: "A6.3",
    title: "Small Receptacles Containing Compressed Gas",
    requiresCylinderSelection: false,
    exemptReason: "not_cylinders",
    exemptMessage:
      "Non-specification containers - verify per A6.3 requirements",
    referencesTableA61: false,
    defaultCylinders: [],
    notes: [
      "Non-specification containers (≤120 mL, electronic tubes, etc.)",
      "Exception: Vehicle systems (A6.3.6-7) must use Table A6.1 or A6.6 cylinders",
    ],
  },

  // A6.4 - Liquefied Compressed Gases
  "A6.4": {
    paragraph: "A6.4",
    title: "Liquefied Compressed Gases",
    requiresCylinderSelection: true,
    referencesTableA61: true,
    defaultCylinders: [
      { id: "DOT-3", label: "DOT 3" },
      { id: "DOT-3A", label: "DOT 3A" },
      { id: "DOT-3AA", label: "DOT 3AA" },
      {
        id: "DOT-3AL",
        label: "DOT 3AL",
        restrictions: "NOT for Class 8 (corrosive)",
      },
      { id: "DOT-3B", label: "DOT 3B" },
      { id: "DOT-3BN", label: "DOT 3BN" },
      { id: "DOT-3E", label: "DOT 3E" },
      { id: "DOT-4B", label: "DOT 4B" },
      { id: "DOT-4BA", label: "DOT 4BA" },
      { id: "DOT-4B240ET", label: "DOT 4B240ET" },
      { id: "DOT-4BW", label: "DOT 4BW" },
      {
        id: "DOT-4E",
        label: "DOT 4E",
        restrictions: "NOT for pyrophoric, toxic, CS2, EO, nickel carbonyl",
      },
      {
        id: "DOT-39",
        label: "DOT 39",
        restrictions: "NOT for pyrophoric, toxic, CS2, EO, nickel carbonyl",
      },
    ],
    legacyCylinders: [
      { id: "DOT-3", label: "DOT 3 (legacy)", legacy: true },
      { id: "DOT-3D", label: "DOT 3D", legacy: true },
      { id: "DOT-4", label: "DOT 4", legacy: true },
      { id: "DOT-4A", label: "DOT 4A", legacy: true },
      { id: "DOT-9", label: "DOT 9", legacy: true },
      { id: "DOT-25", label: "DOT 25", legacy: true },
      { id: "DOT-26", label: "DOT 26", legacy: true },
      { id: "DOT-38", label: "DOT 38", legacy: true },
      { id: "DOT-40", label: "DOT 40", legacy: true },
      { id: "DOT-41", label: "DOT 41", legacy: true },
    ],
    notes: [
      "Check Table A6.1 first - if gas is listed, use those cylinders only",
      "UN specification cylinders (ISO 9809-1, -2, -3, ISO 7866) also authorized when marked 'USA'",
    ],
  },

  // A6.5 - Nonliquefied Compressed Gases
  "A6.5": {
    paragraph: "A6.5",
    title: "Nonliquefied Compressed Gases",
    requiresCylinderSelection: true,
    referencesTableA61: true,
    defaultCylinders: [
      { id: "DOT-3", label: "DOT 3" },
      { id: "DOT-3A", label: "DOT 3A" },
      { id: "DOT-3AA", label: "DOT 3AA" },
      {
        id: "DOT-3AL",
        label: "DOT 3AL",
        restrictions: "Flammable: cargo aircraft only",
      },
      { id: "DOT-3B", label: "DOT 3B" },
      { id: "DOT-3E", label: "DOT 3E" },
      { id: "DOT-4B", label: "DOT 4B" },
      { id: "DOT-4BA", label: "DOT 4BA" },
      { id: "DOT-4BW", label: "DOT 4BW" },
      {
        id: "DOT-3HT",
        label: "DOT 3HT",
        restrictions: "Aircraft only, 24-year max life, nonflammable only",
      },
      {
        id: "DOT-39",
        label: "DOT 39",
        restrictions: "Flammable: max 1.23L; O2: straight threads, brass/SS valves",
      },
      { id: "DOT-3AX", label: "DOT 3AX" },
      { id: "DOT-3AAX", label: "DOT 3AAX" },
      { id: "DOT-3T", label: "DOT 3T", restrictions: "NOT for hydrogen" },
    ],
    legacyCylinders: [
      { id: "DOT-3", label: "DOT 3 (legacy)", legacy: true },
      { id: "DOT-3C", label: "DOT 3C", legacy: true },
      { id: "DOT-3D", label: "DOT 3D", legacy: true },
      { id: "DOT-4", label: "DOT 4", legacy: true },
      { id: "DOT-4A", label: "DOT 4A", legacy: true },
      { id: "DOT-4C", label: "DOT 4C", legacy: true },
      { id: "DOT-25", label: "DOT 25", legacy: true },
      { id: "DOT-26", label: "DOT 26", legacy: true },
      { id: "DOT-33", label: "DOT 33", legacy: true },
      { id: "DOT-38", label: "DOT 38", legacy: true },
    ],
    notes: [
      "Check Table A6.1 first - if gas is listed, use those cylinders only",
      "UN specification cylinders (ISO 9809-1, -2, -3, ISO 7866) also authorized",
    ],
  },

  // A6.6 - Liquefied Petroleum Gas (LPG)
  "A6.6": {
    paragraph: "A6.6",
    title: "Liquefied Petroleum Gas (LPG)",
    requiresCylinderSelection: true,
    referencesTableA61: true,
    defaultCylinders: [
      { id: "DOT-3", label: "DOT 3" },
      { id: "DOT-3A", label: "DOT 3A" },
      { id: "DOT-3AA", label: "DOT 3AA" },
      { id: "DOT-3AL", label: "DOT 3AL" },
      { id: "DOT-3B", label: "DOT 3B" },
      { id: "DOT-3E", label: "DOT 3E" },
      { id: "DOT-4B", label: "DOT 4B" },
      { id: "DOT-4BA", label: "DOT 4BA" },
      { id: "DOT-4B240ET", label: "DOT 4B240ET" },
      { id: "DOT-4BW", label: "DOT 4BW" },
      { id: "DOT-4E", label: "DOT 4E" },
      {
        id: "DOT-39",
        label: "DOT 39",
        restrictions: "Max 1.23L (75 cubic inches)",
      },
    ],
    otherContainers: [
      { id: "DOT-2P", label: "DOT 2P" },
      { id: "DOT-2Q", label: "DOT 2Q" },
    ],
    notes: ["Must comply with Table A6.1 for named gases"],
  },

  // A6.7 - Fire Extinguishers
  "A6.7": {
    paragraph: "A6.7",
    title: "Fire Extinguishers",
    requiresCylinderSelection: true,
    referencesTableA61: false,
    defaultCylinders: [
      { id: "DOT-3A", label: "DOT 3A" },
      { id: "DOT-3AA", label: "DOT 3AA" },
      { id: "DOT-3AL", label: "DOT 3AL" },
      { id: "DOT-3E", label: "DOT 3E" },
      { id: "DOT-4B", label: "DOT 4B" },
      { id: "DOT-4BA", label: "DOT 4BA" },
      { id: "DOT-4B240ET", label: "DOT 4B240ET" },
      { id: "DOT-4BW", label: "DOT 4BW" },
      { id: "DOT-3HT", label: "DOT 3HT" },
      { id: "DOT-4D", label: "DOT 4D" },
      { id: "DOT-4DA", label: "DOT 4DA" },
      { id: "DOT-4DS", label: "DOT 4DS" },
    ],
    otherContainers: [
      { id: "DOT-2P", label: "DOT 2P", restrictions: ">141-160 psig" },
      { id: "DOT-2Q", label: "DOT 2Q", restrictions: ">160 psig" },
      {
        id: "NON-DOT-SPEC",
        label: "Non-DOT (marked 'MEETS DOT REQUIREMENTS')",
        restrictions: "Max 241 psig, max 18L, nonflammable/nontoxic/noncorrosive",
      },
    ],
    notes: ["May be secured in vehicle holders per A3.3.2.13"],
  },

  // A6.8 - Refrigerating Machines, Air Conditioners
  "A6.8": {
    paragraph: "A6.8",
    title: "Refrigerating Machines/Air Conditioners",
    requiresCylinderSelection: false,
    exemptReason: "exempt_from_specs",
    exemptMessage:
      "Factory-tested units exempt - verify ANSI/ASHRAE Standard 15 compliance",
    referencesTableA61: false,
    defaultCylinders: [],
    notes: [
      "No specification packaging required when conditions met",
      "Verify safety relief device, shut-off valves, factory testing",
    ],
  },

  // A6.9 - Acetylene Gas
  "A6.9": {
    paragraph: "A6.9",
    title: "Acetylene Gas",
    requiresCylinderSelection: true,
    referencesTableA61: false,
    defaultCylinders: [
      { id: "DOT-8", label: "DOT 8" },
      { id: "DOT-8AL", label: "DOT 8AL" },
    ],
    notes: [
      "Metal shells filled with porous material",
      "Charged with suitable solvent per 49 CFR 178.59/178.60",
      "UN specification cylinders per 49 CFR 173.303(f) marked 'USA' also authorized",
    ],
  },

  // A6.10 - Cigarette Lighters
  "A6.10": {
    paragraph: "A6.10",
    title: "Cigarette Lighters",
    requiresCylinderSelection: false,
    exemptReason: "not_cylinders",
    exemptMessage: "Cigarette lighters - verify device requirements per A6.10",
    referencesTableA61: false,
    defaultCylinders: [],
    notes: [
      "Devices, not cylinders",
      "Max 10g liquefied gas per device",
      "Liquid portion ≤85% volumetric capacity at 15°C",
    ],
  },

  // A6.11 - Cryogenic Liquids
  "A6.11": {
    paragraph: "A6.11",
    title: "Cryogenic Liquids",
    requiresCylinderSelection: true,
    referencesTableA61: false,
    defaultCylinders: [{ id: "DOT-4L", label: "DOT 4L" }],
    otherContainers: [
      { id: "TMU-27M", label: "TMU-27M (189L/50gal)", restrictions: "LIN/LOX, trailer mounted" },
      { id: "C-1", label: "C-1 (1892L/500gal)" },
      { id: "DEWAR-25L", label: "Dewar (25L)", restrictions: "Max 6 per aircraft" },
      { id: "DEWAR-100L", label: "Dewar (100L)", restrictions: "Max 1 per aircraft, nonskid base" },
      { id: "NRU-5E", label: "NRU-5/E (1514L/400gal)", restrictions: "Air-transportable" },
      { id: "LS-160", label: "LS-160 (150L max)", restrictions: "LIN, max 1 per aircraft" },
      { id: "TMU-70M", label: "TMU-70/M", restrictions: "LOX servicing trailer" },
      { id: "TMU-24E", label: "TMU-24E (1514L/400gal)", restrictions: "LOX/LIN, cargo pallet" },
      { id: "LSHe-102", label: "LSHe-102 (109L)", restrictions: "Liquid helium" },
      { id: "LSHe-30", label: "LSHe-30 (30L)", restrictions: "Helium/neon, max 5 per aircraft" },
      { id: "LSNe-75", label: "LSNe-75 (75L)", restrictions: "Liquid neon, max 2 per aircraft" },
      { id: "CRU-87U", label: "CRU-87/U (10L)", restrictions: "PTLOX, max 25 per aircraft" },
      { id: "CRU-50A", label: "CRU-50/A (20L)", restrictions: "NPTLOX, max 25 per aircraft" },
    ],
    notes: ["Applies to argon, helium, neon, nitrogen, oxygen, hydrogen"],
  },

  // A6.12 - Ethyl Chloride
  "A6.12": {
    paragraph: "A6.12",
    title: "Ethyl Chloride",
    requiresCylinderSelection: true,
    referencesTableA61: false,
    defaultCylinders: [
      { id: "DOT-3A", label: "DOT 3A" },
      { id: "DOT-3AA", label: "DOT 3AA" },
      { id: "DOT-3B", label: "DOT 3B" },
      { id: "DOT-3E", label: "DOT 3E" },
      { id: "DOT-4B", label: "DOT 4B" },
      { id: "DOT-4BA", label: "DOT 4BA" },
      { id: "DOT-4BW", label: "DOT 4BW" },
    ],
    otherContainers: [
      { id: "DRUM-1A1", label: "Steel Drum 1A1", restrictions: "Max 100L" },
    ],
    notes: [
      "Any DOT spec except acetylene cylinders",
      "NOT aluminum alloy cylinders",
      "PG I performance level, 7.5% outage",
    ],
  },

  // A6.13 - Ethylene Oxide
  "A6.13": {
    paragraph: "A6.13",
    title: "Ethylene Oxide",
    requiresCylinderSelection: true,
    referencesTableA61: false,
    defaultCylinders: [
      {
        id: "DOT-STEEL-SEAMLESS",
        label: "DOT Seamless Steel",
        restrictions: "Any spec except acetylene; >4L: pressurizing valves + insulation",
      },
      {
        id: "DOT-STEEL-WELDED",
        label: "DOT Welded Steel",
        restrictions: "Not brazed; max 115L; fusible relief 69-77°C",
      },
    ],
    otherContainers: [
      { id: "DRUM-1A1-EO", label: "Steel Drum 1A1", restrictions: "Max 231L, lagged, fusible relief 69-77°C" },
    ],
    notes: [
      "NO silver, mercury, copper (or alloys) in parts contacting EO",
      "Copper alloys OK if no free acetylene",
      ">19L cylinders require eductor tubes",
    ],
  },

  // A6.14 - Ethylamine
  "A6.14": {
    paragraph: "A6.14",
    title: "Ethylamine (Monoethylamine)",
    requiresCylinderSelection: true,
    referencesTableA61: false,
    defaultCylinders: [
      { id: "DOT-3A", label: "DOT 3A" },
      { id: "DOT-3AA", label: "DOT 3AA" },
      { id: "DOT-3AL", label: "DOT 3AL" },
      { id: "DOT-3B", label: "DOT 3B" },
      { id: "DOT-3E", label: "DOT 3E" },
      { id: "DOT-4B", label: "DOT 4B" },
      { id: "DOT-4BA", label: "DOT 4BA" },
      { id: "DOT-4BW", label: "DOT 4BW" },
    ],
    otherContainers: [
      { id: "DRUM-1A1", label: "Metal Drum 1A1", restrictions: "PG I level" },
    ],
    notes: ["Any DOT specification cylinder except acetylene"],
  },

  // A6.15 - Toxic Gases
  "A6.15": {
    paragraph: "A6.15",
    title: "Arsine, Cyanogen, Phosgene, etc.",
    requiresCylinderSelection: true,
    referencesTableA61: false,
    defaultCylinders: [
      { id: "DOT-3A1800", label: "DOT 3A1800", minServicePressure: 1800 },
      { id: "DOT-3AA1800", label: "DOT 3AA1800", minServicePressure: 1800 },
      {
        id: "DOT-3AL1800",
        label: "DOT 3AL1800",
        minServicePressure: 1800,
        restrictions: "NOT for Arsine or Phosphine",
      },
      { id: "DOT-3D", label: "DOT 3D" },
      { id: "DOT-3E1800", label: "DOT 3E1800", minServicePressure: 1800 },
      { id: "DOT-33", label: "DOT 33" },
    ],
    notes: [
      "Max 57 kg (125 lbs) water capacity for 3A, 3AA, 3AL, 3D, 33",
      "Phosgene: max 125% fill, max 68 kg (150 lbs), 66°C water bath test",
    ],
  },

  // A6.16 - Toxic Fumigants
  "A6.16": {
    paragraph: "A6.16",
    title: "Bromoacetone, Methyl Bromide, etc.",
    requiresCylinderSelection: true,
    referencesTableA61: false,
    defaultCylinders: [
      { id: "DOT-3A", label: "DOT 3A" },
      { id: "DOT-3AA", label: "DOT 3AA" },
      { id: "DOT-3B", label: "DOT 3B" },
      { id: "DOT-3C", label: "DOT 3C" },
      { id: "DOT-3E", label: "DOT 3E" },
      { id: "DOT-4A", label: "DOT 4A" },
      { id: "DOT-4B", label: "DOT 4B" },
      { id: "DOT-4BA", label: "DOT 4BA" },
      { id: "DOT-4BW", label: "DOT 4BW" },
      { id: "DOT-4C", label: "DOT 4C" },
    ],
    notes: ["Max 113 kg (250 lbs) water capacity (except methyl bromide - no limit)"],
  },

  // A6.17 - Gas Identification Sets
  "A6.17": {
    paragraph: "A6.17",
    title: "Gas Identification Sets",
    requiresCylinderSelection: true,
    referencesTableA61: false,
    defaultCylinders: [],
    otherContainers: [
      { id: "GLASS-40ML", label: "Glass receptacle (≤40mL)", restrictions: "Hermetically sealed" },
      { id: "STEEL-CYL-OUTER", label: "Steel cylinder outer", restrictions: "Wall ≥3.7mm, hermetically sealed" },
      { id: "ABSORBED-5ML", label: "Absorbed material (≤5mL)", restrictions: "Glass in metal can (≥0.30mm)" },
    ],
    notes: [
      "Contains toxic material (PG I)",
      "Max 12 fiberboard receptacles in 4G box, then in steel cylinder",
    ],
  },

  // A6.18 - Toxic Insecticide Mixtures
  "A6.18": {
    paragraph: "A6.18",
    title: "Hexaethyl Tetraphosphate Mixtures",
    requiresCylinderSelection: true,
    referencesTableA61: false,
    defaultCylinders: [
      { id: "DOT-3A240", label: "DOT 3A240", minServicePressure: 240 },
      { id: "DOT-3AA240", label: "DOT 3AA240", minServicePressure: 240 },
      { id: "DOT-3B240", label: "DOT 3B240", minServicePressure: 240 },
      { id: "DOT-4A240", label: "DOT 4A240", minServicePressure: 240 },
      { id: "DOT-4B240", label: "DOT 4B240", minServicePressure: 240 },
      { id: "DOT-4BA240", label: "DOT 4BA240", minServicePressure: 240 },
      { id: "DOT-4BW240", label: "DOT 4BW240", minServicePressure: 240 },
    ],
    notes: [
      "Max 5 kg mixture per cylinder",
      "Max 80% fill density",
      "No eduction tube or fusible plug",
    ],
  },

  // A6.19 - Class 2.3 Hazard Zone A
  "A6.19": {
    paragraph: "A6.19",
    title: "Class 2.3 Hazard Zone A",
    requiresCylinderSelection: true,
    referencesTableA61: false,
    defaultCylinders: [
      { id: "DOT-3A", label: "DOT 3A" },
      { id: "DOT-3AA", label: "DOT 3AA" },
      { id: "DOT-3AL", label: "DOT 3AL" },
      { id: "DOT-3B", label: "DOT 3B" },
      { id: "DOT-3E", label: "DOT 3E" },
      { id: "DOT-4B", label: "DOT 4B" },
      { id: "DOT-4BA", label: "DOT 4BA" },
      { id: "DOT-4BW", label: "DOT 4BW" },
    ],
    otherContainers: [
      { id: "DRUM-1A1", label: "Inner Drum 1A1", restrictions: "With 1A2 outer, cushioning 5cm/7.6cm" },
      { id: "DRUM-1B1", label: "Inner Drum 1B1", restrictions: "With 1A2 outer" },
      { id: "DRUM-1H1", label: "Inner Drum 1H1", restrictions: "With 1H2 outer" },
      { id: "DRUM-1N1", label: "Inner Drum 1N1", restrictions: "With outer drum" },
    ],
    notes: [
      "DOT cylinders per 49 CFR Part 178 Subpart C",
      "NOT authorized: DOT-8, 8AL, 39",
    ],
  },

  // A6.20 - Nitric Oxide
  "A6.20": {
    paragraph: "A6.20",
    title: "Nitric Oxide",
    requiresCylinderSelection: true,
    referencesTableA61: false,
    defaultCylinders: [
      { id: "DOT-3A1800", label: "DOT 3A1800", minServicePressure: 1800 },
      { id: "DOT-3AA1800", label: "DOT 3AA1800", minServicePressure: 1800 },
      { id: "DOT-3AL1800", label: "DOT 3AL1800", minServicePressure: 1800 },
      {
        id: "DOT-3E1800",
        label: "DOT 3E1800",
        minServicePressure: 1800,
        restrictions: "Pack in strong wooden boxes",
      },
    ],
    notes: [
      "ONLY these four cylinder types authorized",
      "Max 750 psi at 21°C",
      "Stainless steel valve required",
      "NO safety relief devices",
      "Valve outlet sealed by threaded cap/plug",
    ],
  },

  // A6.21 - Ethyl Methyl Ether
  "A6.21": {
    paragraph: "A6.21",
    title: "Ethyl Methyl Ether",
    requiresCylinderSelection: true,
    referencesTableA61: false,
    defaultCylinders: [
      { id: "DOT-3A", label: "DOT 3A" },
      { id: "DOT-3AA", label: "DOT 3AA" },
      { id: "DOT-3AL", label: "DOT 3AL" },
      { id: "DOT-3B", label: "DOT 3B" },
      { id: "DOT-3E", label: "DOT 3E" },
      { id: "DOT-4B", label: "DOT 4B" },
      { id: "DOT-4BA", label: "DOT 4BA" },
      { id: "DOT-4BW", label: "DOT 4BW" },
    ],
    otherContainers: [
      { id: "DRUM-1A", label: "Drums (1A1/2, 1B1/2, 1N1/2, 1D, 1G, 1H1/2)" },
      { id: "JERRICAN", label: "Jerricans (3A1/2, 3B1/2, 3H1/2)" },
      { id: "COMPOSITE", label: "Composite (6HA1, 6PA1, etc.)" },
    ],
    notes: [
      "PG I requirements",
      "Any DOT spec except 3HT and acetylene",
    ],
  },

  // A6.22 - Chemical Under Pressure N.O.S.
  "A6.22": {
    paragraph: "A6.22",
    title: "Chemical Under Pressure N.O.S.",
    requiresCylinderSelection: true,
    referencesTableA61: true,
    defaultCylinders: [
      { id: "DOT-3A", label: "DOT 3A" },
      { id: "DOT-3AA", label: "DOT 3AA" },
      { id: "DOT-3AL", label: "DOT 3AL" },
      { id: "DOT-3B", label: "DOT 3B" },
      { id: "DOT-3E", label: "DOT 3E" },
      { id: "DOT-4B", label: "DOT 4B" },
      { id: "DOT-4BA", label: "DOT 4BA" },
      { id: "DOT-4BW", label: "DOT 4BW" },
    ],
    notes: [
      "Use per A6.4 and A6.5 (most restrictive if multiple apply)",
      "Min test pressure: 291 psig (20 bar)",
      "Requalification: max 5 years",
    ],
  },

  // A6.23 - Fuel Cell Cartridges
  "A6.23": {
    paragraph: "A6.23",
    title: "Fuel Cell Cartridges",
    requiresCylinderSelection: false,
    exemptReason: "not_cylinders",
    exemptMessage: "Fuel cell cartridges - verify outer packaging (drums, boxes, jerricans)",
    referencesTableA61: false,
    defaultCylinders: [],
    notes: ["Max 1 kg cartridges", "Package in 1A2, 1B2, 4G, etc."],
  },

  // A6.24 - Fuel Cells in Equipment
  "A6.24": {
    paragraph: "A6.24",
    title: "Fuel Cells Contained in Equipment",
    requiresCylinderSelection: false,
    exemptReason: "exempt_from_specs",
    exemptMessage: "Fuel cell in equipment - UN spec NOT required; verify protection requirements",
    referencesTableA61: false,
    defaultCylinders: [],
    notes: [
      "Protect against short circuit",
      "Protect against inadvertent operation",
      "May not charge batteries during transport",
    ],
  },

  // A6.25 - Fuel Cells Packed With Equipment
  "A6.25": {
    paragraph: "A6.25",
    title: "Fuel Cells Packed With Equipment",
    requiresCylinderSelection: false,
    exemptReason: "exempt_from_specs",
    exemptMessage: "Fuel cells packed with equipment - UN spec NOT required; verify protection",
    referencesTableA61: false,
    defaultCylinders: [],
    notes: [
      "Inner packagings or cushioning/dividers to protect cartridges",
      "Max cartridges: number to power equipment + 2 spares",
    ],
  },

  // A6.26 - Metal Hydride Storage Systems
  "A6.26": {
    paragraph: "A6.26",
    title: "Metal Hydride Storage Systems",
    requiresCylinderSelection: true,
    referencesTableA61: false,
    defaultCylinders: [
      {
        id: "UN-ISO-16111",
        label: "UN Metal Hydride (ISO 16111)",
        restrictions: "≤150L, ≤25 MPa",
      },
    ],
    notes: [
      "UN3468 only",
      "Steel receptacles or composite with steel liners",
      "Marked per 49 CFR 173.301b(f) with 'H' for hydrogen",
      "Requalification: max 5 years",
    ],
  },

  // A6.27 - Flammable Gas Powered Engines
  "A6.27": {
    paragraph: "A6.27",
    title: "Flammable Gas Powered Engines",
    requiresCylinderSelection: false,
    exemptReason: "emptied",
    exemptMessage: "Gas powered engine - verify tanks emptied and securely closed",
    referencesTableA61: false,
    defaultCylinders: [],
    notes: [
      "Engines drained and purged per technical manual: NONHAZARDOUS",
      "LPG/compressed gas: fuel completely emptied, tanks closed",
      "Fuel cell powered: secure and protect fuel cell",
    ],
  },

  // A6.28 - Articles Containing Gas
  "A6.28": {
    paragraph: "A6.28",
    title: "Articles Containing Flammable/Non-flammable Gas",
    requiresCylinderSelection: false,
    exemptReason: "not_cylinders",
    exemptMessage: "Article containing gas - verify PG II outer packaging",
    referencesTableA61: false,
    defaultCylinders: [],
    notes: [
      "UN3537, UN3538",
      "Package in PG II: drums (1A2, 1B2, etc.), boxes (4A, 4B, etc.)",
      "Robust articles may use strong outer or transport unpackaged",
    ],
  },
};

// =============================================================================
// BACKWARDS COMPATIBILITY - CYLINDER_TYPES_BY_PARAGRAPH
// =============================================================================

/**
 * Legacy mapping for backwards compatibility with existing code.
 * Combines defaultCylinders and otherContainers from PARAGRAPH_REQUIREMENTS.
 *
 * @deprecated Use PARAGRAPH_REQUIREMENTS for new code
 */
export const CYLINDER_TYPES_BY_PARAGRAPH: Record<string, CylinderType[]> = {};

// Build legacy mapping from PARAGRAPH_REQUIREMENTS
Object.entries(PARAGRAPH_REQUIREMENTS).forEach(([paragraph, info]) => {
  if (info.requiresCylinderSelection) {
    CYLINDER_TYPES_BY_PARAGRAPH[paragraph] = [
      ...info.defaultCylinders,
      ...(info.otherContainers || []),
    ];
  }
});

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Extract the base A6.X paragraph from a full packaging paragraph string.
 * Examples:
 *   "A6.5.1" -> "A6.5"
 *   "A6.4" -> "A6.4"
 *   "A6.11.2.3" -> "A6.11"
 *
 * @param packagingParagraph The full packaging paragraph string
 * @returns The base A6.X paragraph or null if not found
 */
export function extractA6Paragraph(packagingParagraph: string): string | null {
  if (!packagingParagraph) return null;

  // Match A6.X or A6.XX (e.g., A6.5, A6.11, A6.28)
  const match = packagingParagraph.match(/A6\.(\d{1,2})/i);
  if (match) {
    return `A6.${match[1]}`;
  }

  return null;
}

/**
 * Look up a gas in Table A6.1 by name.
 * Performs case-insensitive partial matching.
 *
 * @param gasName The gas name to look up
 * @returns The matching gas mapping or null if not found
 */
export function lookupGasInTableA61(gasName: string): GasCylinderMapping | null {
  if (!gasName) return null;

  const normalizedName = gasName.toLowerCase().trim();

  // Try exact match first
  const exactMatch = TABLE_A6_1.find(
    (gas) => gas.gasName.toLowerCase() === normalizedName
  );
  if (exactMatch) return exactMatch;

  // Try partial match (gas name contains the search term)
  const partialMatch = TABLE_A6_1.find((gas) =>
    gas.gasName.toLowerCase().includes(normalizedName)
  );
  if (partialMatch) return partialMatch;

  // Try partial match (search term contains the gas name)
  const reverseMatch = TABLE_A6_1.find((gas) =>
    normalizedName.includes(gas.gasName.toLowerCase())
  );
  if (reverseMatch) return reverseMatch;

  return null;
}

/**
 * Get paragraph requirements for a given packaging paragraph.
 *
 * @param packagingParagraph The packaging paragraph (e.g., "A6.5.1", "A6.4")
 * @returns The paragraph info or null if not found
 */
export function getParagraphRequirements(
  packagingParagraph: string
): ParagraphInfo | null {
  const baseParagraph = extractA6Paragraph(packagingParagraph);
  if (!baseParagraph) return null;

  return PARAGRAPH_REQUIREMENTS[baseParagraph] || null;
}

/**
 * Get the list of valid cylinder types for a given packaging paragraph.
 * For paragraphs that reference Table A6.1 (A6.4, A6.5, A6.6), this returns
 * the default cylinders. Use getCylindersForGas for gas-specific lookups.
 *
 * @param packagingParagraph The packaging paragraph (e.g., "A6.5.1", "A6.4")
 * @returns Array of valid cylinder types, or empty array if paragraph not found
 */
export function getCylinderTypesForParagraph(
  packagingParagraph: string
): CylinderType[] {
  const baseParagraph = extractA6Paragraph(packagingParagraph);
  if (!baseParagraph) return [];

  return CYLINDER_TYPES_BY_PARAGRAPH[baseParagraph] || [];
}

/**
 * Get authorized cylinders for a specific gas name and packaging paragraph.
 * This is the primary function for cylinder selection UI.
 *
 * Logic:
 * 1. If paragraph references Table A6.1 and gas is found, return Table A6.1 cylinders
 * 2. Otherwise, return paragraph default cylinders
 *
 * @param packagingParagraph The packaging paragraph
 * @param gasName Optional gas name for Table A6.1 lookup
 * @returns Object with cylinders and source information
 */
export function getCylindersForGas(
  packagingParagraph: string,
  gasName?: string
): {
  cylinders: CylinderType[];
  source: "table_a61" | "paragraph_default" | "not_found";
  gasMapping?: GasCylinderMapping;
  paragraphInfo?: ParagraphInfo;
} {
  const paragraphInfo = getParagraphRequirements(packagingParagraph);

  if (!paragraphInfo) {
    return { cylinders: [], source: "not_found" };
  }

  // If paragraph doesn't require cylinder selection, return empty
  if (!paragraphInfo.requiresCylinderSelection) {
    return {
      cylinders: [],
      source: "not_found",
      paragraphInfo,
    };
  }

  // If paragraph references Table A6.1 and we have a gas name, try table lookup
  if (paragraphInfo.referencesTableA61 && gasName) {
    const gasMapping = lookupGasInTableA61(gasName);
    if (gasMapping) {
      return {
        cylinders: gasMapping.cylinders,
        source: "table_a61",
        gasMapping,
        paragraphInfo,
      };
    }
  }

  // Return paragraph defaults (plus other containers if any)
  const allCylinders = [
    ...paragraphInfo.defaultCylinders,
    ...(paragraphInfo.otherContainers || []),
  ];

  return {
    cylinders: allCylinders,
    source: "paragraph_default",
    paragraphInfo,
  };
}

/**
 * Check if a packaging paragraph has cylinder type requirements.
 * Some paragraphs (A6.8, A6.10, A6.23-A6.25, A6.27, A6.28) don't require
 * cylinder type validation.
 *
 * @param packagingParagraph The packaging paragraph to check
 * @returns true if cylinder selection is required for this paragraph
 */
export function hasCylinderTypeRequirements(
  packagingParagraph: string
): boolean {
  const paragraphInfo = getParagraphRequirements(packagingParagraph);
  return paragraphInfo?.requiresCylinderSelection ?? false;
}

/**
 * Get the exemption message for paragraphs that don't require cylinder selection.
 *
 * @param packagingParagraph The packaging paragraph to check
 * @returns The exemption message or null if cylinder selection is required
 */
export function getExemptionMessage(packagingParagraph: string): string | null {
  const paragraphInfo = getParagraphRequirements(packagingParagraph);
  if (!paragraphInfo || paragraphInfo.requiresCylinderSelection) {
    return null;
  }
  return paragraphInfo.exemptMessage || null;
}

/**
 * Paragraph titles for display purposes.
 */
export const PARAGRAPH_TITLES: Record<string, string> = {};

// Build PARAGRAPH_TITLES from PARAGRAPH_REQUIREMENTS
Object.entries(PARAGRAPH_REQUIREMENTS).forEach(([paragraph, info]) => {
  PARAGRAPH_TITLES[paragraph] = info.title;
});

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type { GasCylinderMapping, ParagraphInfo };
