/**
 * Inner Packaging Inspection Procedures
 *
 * Opening and closing procedures for different container types
 * Based on AFMAN 24-604, Attachment 28, Section A28.2.2
 *
 * Source: docs/attachment28/inner-packaging-inspection.md
 */

import { ContainerType } from "@//types/innerPackaging";

/**
 * Procedure step for opening or closing a container
 */
export interface ProcedureStep {
  /** Unique identifier for the step */
  id: string;

  /** Instruction text to display */
  instruction: string;

  /** Whether this is a critical/required step */
  critical: boolean;

  /** Whether this is a warning message */
  isWarning?: boolean;

  /** AFMAN reference for this procedure */
  afmanRef: string;
}

/**
 * Opening procedures for each container type
 * Reference: AFMAN 24-604 A28.2.2
 */
export const OPENING_PROCEDURES: Record<
  Exclude<ContainerType, null>,
  ProcedureStep[]
> = {
  "fiberboard-box": [
    {
      id: "fb-open-1",
      instruction: "Cut original tape along seam using a shallow blade knife",
      critical: true,
      afmanRef: "A28.2.2.1.1",
    },
    {
      id: "fb-open-2",
      instruction: "Do not tear tape",
      critical: true,
      afmanRef: "A28.2.2.1.1",
    },
    {
      id: "fb-open-warning",
      instruction:
        "If adhesive sealed on inside box flaps or the flaps are stitched/stapled (not closed by tape) opening may damage packaging components",
      critical: true,
      isWarning: true,
      afmanRef: "A28.2.2.1.2",
    },
  ],

  "wood-box": [
    {
      id: "wood-open-1",
      instruction: "Opening causes damage to packaging material",
      critical: true,
      isWarning: true,
      afmanRef: "A28.2.2.3.1",
    },
    {
      id: "wood-open-2",
      instruction:
        "To reduce damage to wood material, use a nail puller to remove nails",
      critical: true,
      afmanRef: "A28.2.2.3.2",
    },
    {
      id: "wood-open-3",
      instruction: "Do not pry open wood box panels using crowbars, etc.",
      critical: true,
      afmanRef: "A28.2.2.3.3",
    },
  ],

  drum: [
    {
      id: "drum-open-restriction",
      instruction: "Only open drums used as a combination package or overpack",
      critical: true,
      afmanRef: "A28.2.2.5",
    },
    {
      id: "drum-open-warning",
      instruction:
        "Do not open drums used as a single package for liquid hazardous material",
      critical: true,
      isWarning: true,
      afmanRef: "A28.2.2.5",
    },
  ],

  overpack: [
    {
      id: "overpack-open-1",
      instruction:
        'Outer packaging used as an "Overpack" (for ease of handling) may be opened for inspection of contents',
      critical: false,
      afmanRef: "A28.2.2.7.1",
    },
    {
      id: "overpack-open-2",
      instruction:
        "Follow inspection guidance for specific opening and closing of inside shipping containers",
      critical: true,
      afmanRef: "A28.2.2.7.1",
    },
  ],

  jerrican: [
    {
      id: "jerrican-open-1",
      instruction: "Caps may be removed for inspection",
      critical: false,
      afmanRef: "A28.2.2.9.1",
    },
  ],

  "non-specification": [
    {
      id: "non-spec-open-1",
      instruction: "Non-specification packaging may be opened for inspection",
      critical: false,
      afmanRef: "A28.2.2.8.1",
    },
  ],
};

/**
 * Closing procedures for each container type
 * Reference: AFMAN 24-604 A28.2.2
 */
export const CLOSING_PROCEDURES: Record<
  Exclude<ContainerType, null>,
  ProcedureStep[]
> = {
  "fiberboard-box": [
    {
      id: "fb-close-1",
      instruction:
        "Apply new tape over the existing tape using same method as original",
      critical: true,
      afmanRef: "A28.2.2.2.1",
    },
    {
      id: "fb-close-2",
      instruction:
        "Use only ASTM D 5486, Type I, Class 2 tape (film backed, pressure-sensitive adhesive, weather resistant)",
      critical: true,
      afmanRef: "A28.2.2.2.2",
    },
    {
      id: "fb-close-3",
      instruction:
        "Ensure the ends of sealing tape extends over the original tape a minimum of one-inch adhering to the fiberboard on the ends of the package",
      critical: true,
      afmanRef: "A28.2.2.2.3",
    },
    {
      id: "fb-close-4",
      instruction:
        "Use three-inch wide tape OR two strips of two-inch wide tape",
      critical: true,
      afmanRef: "A28.2.2.2.4",
    },
    {
      id: "fb-close-5",
      instruction:
        "Ensure surface is clean and dry before applying tape and box flaps meet squarely",
      critical: true,
      afmanRef: "A28.2.2.2.5",
    },
    {
      id: "fb-close-6",
      instruction: "Do not cover markings or labels with tape",
      critical: true,
      afmanRef: "A28.2.2.2.6",
    },
    {
      id: "fb-close-note",
      instruction:
        "When reclosed using these procedures a new shipper's certification is NOT required (based on DOD testing, packaging is considered returned to original condition)",
      critical: false,
      afmanRef: "A28.2.2.2.7",
    },
  ],

  "wood-box": [
    {
      id: "wood-close-1",
      instruction: "Do not close by nailing through existing holes",
      critical: true,
      afmanRef: "A28.2.2.4.1",
    },
    {
      id: "wood-close-2",
      instruction:
        "Replace damaged components using prescribed materials and specifications required by the applicable test report, special packaging instruction, or drawing",
      critical: true,
      afmanRef: "A28.2.2.4.2",
    },
    {
      id: "wood-close-warning",
      instruction:
        "Replacing packaging material components is considered repacking and REQUIRES a new shipper's certification",
      critical: true,
      isWarning: true,
      afmanRef: "A28.2.2.4.3",
    },
  ],

  drum: [
    {
      id: "drum-close-1",
      instruction:
        'Replace old gaskets with new gaskets and seals (old gaskets may "set" and not reseal properly)',
      critical: true,
      afmanRef: "A28.2.2.6.1",
    },
    {
      id: "drum-close-2",
      instruction:
        "Use the torque and closing instructions required by the applicable test report",
      critical: true,
      afmanRef: "A28.2.2.6.2",
    },
    {
      id: "drum-close-warning",
      instruction:
        "Reclosure of drum is considered repacking and REQUIRES new shipper's certification",
      critical: true,
      isWarning: true,
      afmanRef: "A28.2.2.6.3",
    },
  ],

  overpack: [
    {
      id: "overpack-close-1",
      instruction: "Close overpacks in a similar manner as received",
      critical: true,
      afmanRef: "A28.2.2.7.2",
    },
    {
      id: "overpack-close-note",
      instruction: "A new shipper's declaration is NOT required",
      critical: false,
      afmanRef: "A28.2.2.7.2",
    },
  ],

  jerrican: [
    {
      id: "jerrican-close-1",
      instruction:
        'Re-secure cap (hand-tight) ensuring there is no "cross-threading"',
      critical: true,
      afmanRef: "A28.2.2.9.2",
    },
    {
      id: "jerrican-close-note",
      instruction: "A new shipper's declaration is NOT required",
      critical: false,
      afmanRef: "A28.2.2.9.2",
    },
  ],

  "non-specification": [
    {
      id: "non-spec-close-1",
      instruction:
        "Close non-specification packaging in a similar manner as received",
      critical: true,
      afmanRef: "A28.2.2.8.2",
    },
    {
      id: "non-spec-close-note",
      instruction: "A new shipper's declaration is NOT required",
      critical: false,
      afmanRef: "A28.2.2.8.2",
    },
  ],
};

/**
 * Reclosure method options for fiberboard boxes
 * Determines whether new certification is required
 */
export const FIBERBOARD_RECLOSURE_METHODS = [
  {
    value: "tape-only",
    label: "Tape only (following procedures above)",
    requiresCertification: false,
  },
  {
    value: "adhesive-sealed",
    label: "Adhesive sealed on inside flaps",
    requiresCertification: true,
  },
  {
    value: "stapled",
    label: "Stitched/Stapled",
    requiresCertification: true,
  },
] as const;
