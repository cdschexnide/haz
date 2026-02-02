import {
  ConditionalRequirement,
  PackagingContext,
  PackagingOption,
  PackagingParagraphEntry,
  PackagingSelection,
  ValidationResult,
} from "../../src/types/packagingStructure";
import {
  applyContextualFiltering,
  evaluateConditionalRequirements,
  optimizePackagingCategories,
} from "../../src/utils/packagingCategoryGenerator";
import { validatePackagingSelection } from "../../src/utils/validation";

export const packagingDatabaseV2: Record<string, PackagingParagraphEntry> = {
  "A5.4.": {
    paragraphId: "A5.4.",
    hazardClass: 1,
    description:
      "Barium Azide; Diazodinitrophenol, Wetted; Guanyl Nitrosaminoguanylidene Hydrazine, Wetted; Guanyl Nitrosaminoguanyltetrazene, Wetted; Tetrazene, Wetted; Lead Azide, Wetted; Lead Mononitroresorcinate; Lead Styphnate, Wetted; Lead Trinitroresorcinate, Wetted; and Mercury Fulminate, Wetted",
    lastUpdated: new Date().toISOString(),
    entryType: "specialized",
    materialTypes: [
      "explosive_materials_wetted",
      "barium_azide",
      "diazodinitrophenol",
      "lead_azide",
      "mercury_fulminate",
    ],

    packagingOptions: [
      {
        id: "A5.4.1.drums",
        type: "combination",
        description:
          "Three-tier drum packaging system for wetted explosive materials",
        innerPackaging: {
          required: true,
          materials: [
            "Plastic textile bags",
            "Plastic coated or lined rubber textile bags",
            "Rubberized textile bags",
            "Wood receptacles",
          ],
          // specialRequirements: [
          //   {
          //     type: "material_compatibility",
          //     description:
          //       "Inner packaging: Bags of plastic, textile, or rubber materials, OR receptacles of wood",
          //     mandatory: true,
          //     applicableContainers: ["explosive_substances_water_saturated"],
          //   },
          //   {
          //     type: "material_compatibility",
          //     description:
          //       "Intermediate packaging: Bags of plastics or textile materials, OR receptacles of plastics, metal, or wood",
          //     mandatory: true,
          //     applicableContainers: ["explosive_substances_water_saturated"],
          //   },
          //   {
          //     type: "mass_limits",
          //     description:
          //       "Maximum explosive substance: 50g per inner packaging",
          //     mandatory: true,
          //     applicableContainers: ["explosive_substances_water_saturated"],
          //   },
          //   {
          //     type: "wetting",
          //     description: "All explosive materials must be water-saturated",
          //     mandatory: true,
          //     applicableContainers: ["explosive_substances_water_saturated"],
          //   },
          //   {
          //     type: "cushioning",
          //     description:
          //       "Water-saturated cushioning material required between inner and intermediate packaging",
          //     mandatory: true,
          //     applicableContainers: ["explosive_substances_water_saturated"],
          //   },
          //   {
          //     type: "temperature_control",
          //     description:
          //       "Anti-freeze solution may be added to prevent freezing",
          //     mandatory: false,
          //     applicableContainers: ["explosive_substances_water_saturated"],
          //   },
          //   {
          //     type: "compartment_separation",
          //     description:
          //       "Three-tier packaging system: inner → intermediate → outer",
          //     mandatory: true,
          //     applicableContainers: ["explosive_substances_water_saturated"],
          //   },
          // ],
        },
        intermediatePackaging: {
          required: true,
          description:
            "Bags of plastics or textile materials, or receptacles of plastics, metal, or wood",
          materials: [
            "Plastics bags",
            "Textile bags",
            "Plastic coated or lined rubber textile bags",
            "Rubberized textile bags",
            "Plastics receptacles",
            "Metal receptacles",
            "Wood receptacles",
          ],
        },
        outerPackaging: {
          categories: [
            {
              type: "drums",
              containers: [
                { code: "1A1", material: "steel", description: "Steel drum" },
                {
                  code: "1A2",
                  material: "steel",
                  description: "Steel drum with removable head",
                },
                {
                  code: "1N1",
                  material: "other_metal",
                  description: "Other metal drum",
                },
                {
                  code: "1N2",
                  material: "other_metal",
                  description: "Other metal drum with removable head",
                },
                {
                  code: "1H1",
                  material: "plastic",
                  description: "Plastic drum",
                },
                {
                  code: "1H2",
                  material: "plastic",
                  description: "Plastic drum with removable head",
                },
              ],
            },
          ],
        },
        quantityLimits: [{ scope: "per_inner", value: 50, unit: "g" }],
        notes: [
          "Three-tier packaging system: inner → intermediate → outer",
          "Water saturation required for all explosive materials (except UN0224 when shipped dry)",
          "Anti-freeze solution permitted to prevent freezing",
          "Outer packagings must be constructed and sealed to prevent evaporation of the wetting solution (except UN0224 when shipped dry)",
        ],
      },
      {
        id: "A5.4.2.boxes",
        type: "combination",
        description: "Three-tier box packaging system with dividing partitions",
        innerPackaging: {
          required: true,
          materials: [
            "Conductive rubber bags",
            "Conductive plastic bags",
            "Metal receptacles",
            "Wood receptacles",
            "Conductive rubber receptacles",
            "Conductive plastic receptacles",
          ],
          specialRequirements: [
            "Inner packaging: Bags of conductive rubber or plastic materials, OR receptacles of metal, wood, or other conductive materials",
            "Intermediate packaging: Dividing partitions of metal, wood, plastic, or fiberboard",
            "Maximum explosive substance: 50g per inner packaging",
            "Maximum 25 compartments per outer package",
            "All explosive materials must be water-saturated",
            "Conductive materials required to prevent static buildup",
            "Each compartment must be separated by dividing partitions",
            "Water-saturated cushioning material required in each compartment",
            "Three-tier packaging system with compartmentalized design",
          ],
        },
        intermediatePackaging: {
          required: true,
          description:
            "Dividing partitions of metal, wood, plastic, or fiberboard",
          materials: ["Metal", "Wood", "Plastic", "Fiberboard"],
        },
        outerPackaging: {
          categories: [
            {
              type: "boxes",
              containers: [
                {
                  code: "4C2",
                  material: "natural_wood",
                  description: "Sift-proof natural wood box",
                },
                { code: "4D", material: "plywood", description: "Plywood box" },
                {
                  code: "4F",
                  material: "reconstituted_wood",
                  description: "Reconstituted wood box",
                },
              ],
            },
          ],
        },
        quantityLimits: [
          { scope: "per_inner", value: 50, unit: "g" },
          { scope: "per_outer", value: 25, unit: "compartments" },
        ],
        notes: [
          "Three-tier packaging system with compartmentalized design",
          "Conductive materials required for inner packaging",
          "Maximum 25 compartments with dividing partitions",
          "Water saturation and cushioning required",
        ],
      },
    ],

    specialRequirements: [
      {
        type: "wetting",
        description:
          "All explosive materials must be water-saturated to prevent accidental ignition (except UN0224 when shipped dry)",
        mandatory: true,
        applicableContainers: ["all"],
      },
      {
        type: "quantity_control",
        description: "Maximum 50g explosive substance per inner packaging",
        mandatory: true,
        applicableContainers: ["all"],
      },
      {
        type: "cushioning",
        description:
          "Water-saturated cushioning material required between packaging layers",
        mandatory: true,
        applicableContainers: ["all"],
      },
      {
        type: "static_prevention",
        description:
          "Conductive materials required for box packaging to prevent static buildup",
        mandatory: true,
        applicableContainers: ["A5.4.2.boxes"],
      },
      {
        type: "compartment_separation",
        description:
          "Dividing partitions required with maximum 25 compartments per outer package",
        mandatory: true,
        applicableContainers: ["A5.4.2.boxes"],
      },
    ],

    conditionalRequirements: [
      {
        condition: "un_number_UN0224_dry",
        conditionType: "un_number",
        operator: "equals",
        value: "UN0224",
        effect: "except",
        target: "wetting_requirement",
        description:
          "UN0224 may be shipped dry; water-saturation requirements do not apply when shipped dry",
      },
      {
        condition: "prevent_freezing",
        conditionType: "temperature",
        operator: "less_than",
        value: 0,
        effect: "require",
        target: "anti_freeze_solution",
        description: "Anti-freeze solution required for temperatures below 0°C",
      },
      {
        condition: "static_sensitive_materials",
        conditionType: "material_state",
        operator: "contains",
        value: "static_sensitive",
        effect: "require",
        target: "conductive_packaging",
        description:
          "Conductive packaging required for static-sensitive explosive materials",
      },
    ],

    referencedParagraphs: ["A5.4.1.", "A5.4.2."],
  },
  "A5.5.": {
    paragraphId: "A5.5.",
    hazardClass: 1,
    description:
      "Powder Cake or Powder Paste, Wetted; or Nitrocellulose Plasticized.",
    lastUpdated: new Date().toISOString(),
    entryType: "specialized",
    materialTypes: [
      "powder_cake_wetted",
      "powder_paste_wetted",
      "nitrocellulose_plasticized",
    ],

    packagingOptions: [
      {
        id: "A5.5.combination",
        type: "combination",
        description: "Inner packaging in boxes or drums",
        innerPackaging: {
          required: true,
          materials: [
            "Waterproof paper bags",
            "Plastic bags",
            "Rubberized textile bags",
            "Plastic sheets",
            "Rubberized textile sheets",
            "Wood receptacles",
          ],
          specialRequirements: [
            "Inner packaging: Bags of waterproof paper, plastic, or rubberized textile",
            "OR Sheets of plastic or rubberized textile",
            "OR Receptacles of wood",
            "Inner packagings provide moisture protection and containment",
          ],
        },
        outerPackaging: {
          categories: [
            {
              type: "boxes",
              containers: [
                { code: "4A", material: "steel", description: "Steel box" },
                {
                  code: "4B",
                  material: "aluminum",
                  description: "Aluminum box",
                },
                {
                  code: "4N",
                  material: "other_metal",
                  description: "Other metal box",
                },
                {
                  code: "4C1",
                  material: "natural_wood",
                  description: "Ordinary natural wood box",
                },
                {
                  code: "4C2",
                  material: "natural_wood",
                  description: "Sift-proof natural wood box",
                },
                { code: "4D", material: "plywood", description: "Plywood box" },
                {
                  code: "4F",
                  material: "reconstituted_wood",
                  description: "Reconstituted wood box",
                },
                {
                  code: "4G",
                  material: "fiberboard",
                  description: "Fiberboard box",
                },
                {
                  code: "4H1",
                  material: "plastic",
                  description: "Expanded plastic box",
                },
                {
                  code: "4H2",
                  material: "plastic",
                  description: "Solid plastic box",
                },
              ],
            },
            {
              type: "drums",
              containers: [
                { code: "1A1", material: "steel", description: "Steel drum" },
                {
                  code: "1A2",
                  material: "steel",
                  description: "Steel drum with removable head",
                },
                {
                  code: "1B1",
                  material: "aluminum",
                  description: "Aluminum drum",
                },
                {
                  code: "1B2",
                  material: "aluminum",
                  description: "Aluminum drum with removable head",
                },
                {
                  code: "1N1",
                  material: "other_metal",
                  description: "Other metal drum",
                },
                {
                  code: "1N2",
                  material: "other_metal",
                  description: "Other metal drum with removable head",
                },
                {
                  code: "1H1",
                  material: "plastic",
                  description: "Plastic drum",
                },
                {
                  code: "1H2",
                  material: "plastic",
                  description: "Plastic drum with removable head",
                },
                {
                  code: "1D",
                  material: "plywood",
                  description: "Plywood drum",
                },
                {
                  code: "1G",
                  material: "fiber",
                  description: "Fiberboard drum",
                },
              ],
            },
          ],
        },
        notes: [
          "Suitable for powder cake, powder paste (wetted), and nitrocellulose plasticized materials",
          "Inner packaging provides moisture barrier and containment",
        ],
      },
      {
        id: "A5.5.single_UN0159",
        type: "single",
        description:
          "Direct packaging for UN0159 in metal or plastic drums (no inner packaging required)",
        applicableUNNumbers: ["UN0159"],
        innerPackaging: {
          required: false,
        },
        outerPackaging: {
          categories: [
            {
              type: "drums",
              containers: [
                { code: "1A1", material: "steel", description: "Steel drum" },
                {
                  code: "1A2",
                  material: "steel",
                  description: "Steel drum with removable head",
                },
                {
                  code: "1B1",
                  material: "aluminum",
                  description: "Aluminum drum",
                },
                {
                  code: "1B2",
                  material: "aluminum",
                  description: "Aluminum drum with removable head",
                },
                {
                  code: "1N1",
                  material: "other_metal",
                  description: "Other metal drum",
                },
                {
                  code: "1N2",
                  material: "other_metal",
                  description: "Other metal drum with removable head",
                },
                {
                  code: "1H1",
                  material: "plastic",
                  description: "Plastic drum",
                },
                {
                  code: "1H2",
                  material: "plastic",
                  description: "Plastic drum with removable head",
                },
              ],
            },
          ],
        },
        restrictions: [
          "Only authorized for UN0159",
          "Only metal drums (1A1, 1A2, 1B1, 1B2, 1N1, 1N2) or plastic drums (1H1, 1H2) permitted",
        ],
        notes: [
          "Inner packagings not required for UN0159 when using specified metal or plastic drums",
          "Simplified packaging option for specific UN number",
        ],
      },
    ],

    specialRequirements: [
      {
        type: "moisture_protection",
        description:
          "Waterproof materials required for inner packaging to maintain moisture content",
        mandatory: true,
        applicableContainers: ["A5.5.combination"],
      },
      {
        type: "material_compatibility",
        description:
          "Packaging materials must be compatible with wetted explosive substances",
        mandatory: true,
        applicableContainers: ["all"],
      },
    ],

    conditionalRequirements: [
      {
        condition: "un_number_0159",
        conditionType: "un_number",
        operator: "equals",
        value: "UN0159",
        effect: "modify",
        target: "inner_packaging_optional",
        description:
          "Inner packagings not required for UN0159 when metal or plastic drums are used",
      },
    ],

    referencedParagraphs: ["A5.5."],
  },
  "A5.6.": {
    paragraphId: "A5.6.",
    hazardClass: 1,
    description:
      "Ammonium Picrate; Cyclotetramethylenetetranitramine, HMX, or Octogen Wetted; Cyclotrimethylenetrinitramine and Octogen, Mixtures, Wetted or Desensitized; Cyclotrimethylenetrinitramine, Cyclonite, Hexogen, or RDX Wetted; Cyclotrimethylenetrinitramine and Cyclotetramethylenetetranitramine, Mixtures, Wetted or Desensitized; Cyclotrimethylenetrinitramine and HMX Mixtures, Wetted or Desensitized; Dinitrophenol; Dinitroresorcinol; Dipicryl Sulfide; Hexolite or Hexotol; Hexotonal; Mannitol Hexanitrate or Nitromannite, Wetted; Nitrocellulose; Nitrostarch; Nitro Urea; Nitroguanidine or Picrite Trinitrophenol or Picric Acid; Octolite or Octol; Pentolite; Pentaerythrite Tetranitrate or Pentaerythritol Tetranitrate or PETN, Wetted; or Pentaerythrite Tetranitrate or Pentaerythritol Tetranitrate or PETN, Desensitized; RDX and Cyclotetramethylenetetranitramine, Wetted or Desensitized; Trinitrobenzene; Trinitrobenzoic Acid; Trinitroresorcinol or Styphnic Acid; Trinitroresorcinol, Wetted; Trinitrotoluene or TNT; RDX and HMX Mixtures, Wetted or Desensitized Urea Nitrate.",
    lastUpdated: new Date().toISOString(),
    entryType: "specialized",
    materialTypes: [
      "explosive_compounds_mixed",
      "hmx_octogen",
      "rdx_cyclonite",
      "tnt_trinitrotoluene",
      "petn_wetted",
      "ammonium_picrate",
    ],
    applicableUNNumbers: [
      "UN0004",
      "UN0076",
      "UN0078",
      "UN0154",
      "UN0219",
      "UN0394",
      "UN0072",
      "UN0226",
      "UN0029",
    ],

    packagingOptions: [
      {
        id: "A5.6.1.wetted_solids",
        type: "combination",
        description:
          "Three-tier packaging for wetted solid explosive compounds",
        innerPackaging: {
          required: true,
          materials: [
            "Multiwall water-resistant paper bags",
            "Plastic bags",
            "Textile bags",
            "Rubberized textile bags",
            "Woven plastic bags",
            "Metal receptacles",
            "Plastic receptacles",
            "Wood receptacles",
          ],
          specialRequirements: [
            "Inner packaging: Bags of multiwall water-resistant paper, plastic, textile, rubberized textile, or woven plastic",
            "OR Receptacles of metal, plastic, or wood",
            "Intermediate packaging: Bags of plastics or plastic coated/lined textile",
            "OR Receptacles of metal, plastic, or wood",
            "Intermediate packaging not required if leakproof drums are used as outer packaging",
            "Intermediate packaging not required for UN0072 and UN0226",
          ],
        },
        intermediatePackaging: {
          required: true,
          description:
            "Bags of plastics or plastic coated or lined textile, or receptacles of metal, plastic, or wood",
          materials: [
            "Plastics bags",
            "Plastic coated or lined textile bags",
            "Metal receptacles",
            "Plastic receptacles",
            "Wood receptacles",
          ],
        },
        outerPackaging: {
          categories: [
            {
              type: "boxes",
              containers: [
                { code: "4A", material: "steel", description: "Steel box" },
                {
                  code: "4B",
                  material: "aluminum",
                  description: "Aluminum box",
                },
                {
                  code: "4N",
                  material: "other_metal",
                  description: "Other metal box",
                },
                {
                  code: "4C1",
                  material: "natural_wood",
                  description: "Ordinary natural wood box",
                },
                {
                  code: "4C2",
                  material: "natural_wood",
                  description: "Sift-proof natural wood box",
                },
                { code: "4D", material: "plywood", description: "Plywood box" },
                {
                  code: "4F",
                  material: "reconstituted_wood",
                  description: "Reconstituted wood box",
                },
                {
                  code: "4G",
                  material: "fiberboard",
                  description: "Fiberboard box",
                },
                {
                  code: "4H1",
                  material: "plastic",
                  description: "Expanded plastic box",
                },
                {
                  code: "4H2",
                  material: "plastic",
                  description: "Solid plastic box",
                },
              ],
            },
            {
              type: "drums",
              containers: [
                { code: "1A1", material: "steel", description: "Steel drum" },
                {
                  code: "1A2",
                  material: "steel",
                  description: "Steel drum with removable head",
                },
                {
                  code: "1B1",
                  material: "aluminum",
                  description: "Aluminum drum",
                },
                {
                  code: "1B2",
                  material: "aluminum",
                  description: "Aluminum drum with removable head",
                },
                {
                  code: "1N1",
                  material: "other_metal",
                  description: "Other metal drum",
                },
                {
                  code: "1N2",
                  material: "other_metal",
                  description: "Other metal drum with removable head",
                },
                {
                  code: "1D",
                  material: "plywood",
                  description: "Plywood drum",
                },
                { code: "1G", material: "fiber", description: "Fiber drum" },
                {
                  code: "1H1",
                  material: "plastic",
                  description: "Plastic drum",
                },
                {
                  code: "1H2",
                  material: "plastic",
                  description: "Plastic drum with removable head",
                },
              ],
            },
          ],
        },
        notes: [
          "For wetted solid explosive compounds",
          "Three-tier packaging system with conditional intermediate packaging",
        ],
      },
      {
        id: "A5.6.2.dry_solids_non_powder",
        type: "combination",
        description: "Packaging for dry solid explosives (non-powder forms)",
        innerPackaging: {
          required: true,
          materials: [
            "Kraft paper bags",
            "Multiwall water-resistant paper bags",
            "Plastic bags",
            "Textile bags",
            "Rubberized plastic textile bags",
            "Woven plastic bags",
          ],
          specialRequirements: [
            "Inner packaging: Bags of kraft paper, multiwall water-resistant paper, plastic, textile, rubberized plastic textile, or woven plastic",
            "No intermediate packaging required for this option",
          ],
        },
        outerPackaging: {
          categories: [
            {
              type: "bags",
              containers: [
                {
                  code: "5H2",
                  material: "woven_plastic",
                  description: "Sift-proof woven plastic bag",
                },
                {
                  code: "5H3",
                  material: "woven_plastic",
                  description: "Water-resistant woven plastic bag",
                },
                {
                  code: "5H4",
                  material: "plastic_film",
                  description: "Plastic film bag",
                },
                {
                  code: "5L2",
                  material: "textile",
                  description: "Sift-proof textile bag",
                },
                {
                  code: "5L3",
                  material: "textile",
                  description: "Water-resistant textile bag",
                },
                {
                  code: "5M2",
                  material: "paper",
                  description: "Multiwall water-resistant paper bag",
                },
              ],
            },
            {
              type: "boxes",
              containers: [
                { code: "4A", material: "steel", description: "Steel box" },
                {
                  code: "4B",
                  material: "aluminum",
                  description: "Aluminum box",
                },
                {
                  code: "4N",
                  material: "other_metal",
                  description: "Other metal box",
                },
                {
                  code: "4C1",
                  material: "natural_wood",
                  description: "Ordinary natural wood box",
                },
                {
                  code: "4C2",
                  material: "natural_wood",
                  description: "Sift-proof natural wood box",
                },
                { code: "4D", material: "plywood", description: "Plywood box" },
                {
                  code: "4F",
                  material: "reconstituted_wood",
                  description: "Reconstituted wood box",
                },
                {
                  code: "4G",
                  material: "fiberboard",
                  description: "Fiberboard box",
                },
                {
                  code: "4H1",
                  material: "plastic",
                  description: "Expanded plastic box",
                },
                {
                  code: "4H2",
                  material: "plastic",
                  description: "Solid plastic box",
                },
              ],
            },
            {
              type: "drums",
              containers: [
                { code: "1A1", material: "steel", description: "Steel drum" },
                {
                  code: "1A2",
                  material: "steel",
                  description: "Steel drum with removable head",
                },
                {
                  code: "1B1",
                  material: "aluminum",
                  description: "Aluminum drum",
                },
                {
                  code: "1B2",
                  material: "aluminum",
                  description: "Aluminum drum with removable head",
                },
                {
                  code: "1N1",
                  material: "other_metal",
                  description: "Other metal drum",
                },
                {
                  code: "1N2",
                  material: "other_metal",
                  description: "Other metal drum with removable head",
                },
                {
                  code: "1D",
                  material: "plywood",
                  description: "Plywood drum",
                },
                { code: "1G", material: "fiber", description: "Fiber drum" },
                {
                  code: "1H1",
                  material: "plastic",
                  description: "Plastic drum",
                },
                {
                  code: "1H2",
                  material: "plastic",
                  description: "Plastic drum with removable head",
                },
              ],
            },
          ],
        },
        notes: [
          "For dry solid explosives in non-powder form",
          "Includes bag packaging options (5-series containers)",
          "For UN0029: Sift-proof bags (5H2) recommended for flake or prilled TNT, max 30kg",
        ],
      },
      {
        id: "A5.6.3.dry_powder_solids",
        type: "combination",
        description:
          "Packaging for solid dry powder explosives (sift-proof requirement)",
        innerPackaging: {
          required: true,
          materials: [
            "Multiwall water-resistant paper bags",
            "Plastic bags",
            "Woven plastic bags",
            "Fiberboard receptacles",
            "Metal receptacles",
            "Plastic receptacles",
            "Wood receptacles",
          ],
          specialRequirements: [
            "Inner packaging: Bags of multiwall water-resistant paper, plastic, or woven plastic",
            "OR Receptacles of fiberboard, metal, plastic, or wood",
            "Inner packagings not required if drums are used as outer packaging",
            "Intermediate packaging: Bags of multiwall water-resistant paper, plastic, or woven plastic",
            "OR Receptacles of fiberboard, metal, plastic, or wood",
          ],
        },
        intermediatePackaging: {
          required: true,
          description:
            "Bags of multiwall water-resistant paper, plastic, or woven plastic, or receptacles of fiberboard, metal, plastic, or wood",
          materials: [
            "Multiwall water-resistant paper bags",
            "Plastic bags",
            "Woven plastic bags",
            "Fiberboard receptacles",
            "Metal receptacles",
            "Plastic receptacles",
            "Wood receptacles",
          ],
        },
        outerPackaging: {
          categories: [
            {
              type: "boxes",
              containers: [
                { code: "4A", material: "steel", description: "Steel box" },
                {
                  code: "4B",
                  material: "aluminum",
                  description: "Aluminum box",
                },
                {
                  code: "4N",
                  material: "other_metal",
                  description: "Other metal box",
                },
                {
                  code: "4C1",
                  material: "natural_wood",
                  description: "Ordinary natural wood box",
                },
                {
                  code: "4C2",
                  material: "natural_wood",
                  description: "Sift-proof natural wood box",
                },
                { code: "4D", material: "plywood", description: "Plywood box" },
                {
                  code: "4F",
                  material: "reconstituted_wood",
                  description: "Reconstituted wood box",
                },
                {
                  code: "4G",
                  material: "fiberboard",
                  description: "Fiberboard box",
                },
                {
                  code: "4H2",
                  material: "plastic",
                  description: "Solid plastic box",
                },
              ],
            },
            {
              type: "drums",
              containers: [
                { code: "1A1", material: "steel", description: "Steel drum" },
                {
                  code: "1A2",
                  material: "steel",
                  description: "Steel drum with removable head",
                },
                {
                  code: "1B1",
                  material: "aluminum",
                  description: "Aluminum drum",
                },
                {
                  code: "1B2",
                  material: "aluminum",
                  description: "Aluminum drum with removable head",
                },
                {
                  code: "1N1",
                  material: "other_metal",
                  description: "Other metal drum",
                },
                {
                  code: "1N2",
                  material: "other_metal",
                  description: "Other metal drum with removable head",
                },
                {
                  code: "1D",
                  material: "plywood",
                  description: "Plywood drum",
                },
                { code: "1G", material: "fiber", description: "Fiber drum" },
                {
                  code: "1H1",
                  material: "plastic",
                  description: "Plastic drum",
                },
                {
                  code: "1H2",
                  material: "plastic",
                  description: "Plastic drum with removable head",
                },
              ],
            },
          ],
        },
        restrictions: ["At least one packaging layer must be sift-proof"],
        notes: [
          "For solid dry powder explosives",
          "Sift-proof requirement mandatory",
          "Inner packaging not required when drums are used as outer packaging",
          "For UN0029: Sift-proof bags (5H2) recommended for flake or prilled TNT, max 30kg",
        ],
      },
    ],

    specialRequirements: [
      {
        type: "lead_free",
        description:
          "Packaging must be lead free for UN0004, UN0076, UN0078, UN0154, UN0219, and UN0394",
        mandatory: true,
        applicableContainers: ["all"],
      },
      {
        type: "sift_proof",
        description:
          "At least one packaging layer must be sift-proof for powder materials",
        mandatory: true,
        applicableContainers: ["A5.6.3.dry_powder_solids"],
      },
      {
        type: "leakproof_drums",
        description:
          "When leakproof drums are used, intermediate packaging may be omitted",
        mandatory: false,
        applicableContainers: ["A5.6.1.wetted_solids"],
      },
    ],

    packingGroupRestrictions: [
      {
        packingGroup: "all",
        restriction: "required",
        description: "Lead-free packaging mandatory for specified UN numbers",
        conditions: [
          "UN0004",
          "UN0076",
          "UN0078",
          "UN0154",
          "UN0219",
          "UN0394",
        ],
      },
    ],

    conditionalRequirements: [
      {
        condition: "leakproof_drums_used",
        conditionType: "packaging_type",
        operator: "contains",
        value: "leakproof_drum",
        effect: "modify",
        target: "intermediate_packaging_optional",
        description:
          "Intermediate packaging not required if leakproof drums are used as outer packaging",
      },
      {
        condition: "un_0072_or_0226",
        conditionType: "un_number",
        operator: "in_range",
        value: ["UN0072", "UN0226"],
        effect: "modify",
        target: "intermediate_packaging_optional",
        description:
          "Intermediate packaging not required for UN0072 and UN0226",
      },
      {
        condition: "drums_as_outer",
        conditionType: "packaging_type",
        operator: "contains",
        value: "drum",
        effect: "modify",
        target: "inner_packaging_optional",
        description:
          "Inner packagings not required if drums are used as outer packaging for powder materials",
      },
      {
        condition: "tnt_flake_prilled",
        conditionType: "un_number",
        operator: "equals",
        value: "UN0029",
        effect: "require",
        target: "sift_proof_bags_recommended",
        description:
          "For UN0029: Sift-proof bags (5H2) recommended for flake or prilled TNT, max 30kg",
      },
    ],

    referencedParagraphs: ["A5.6.1.", "A5.6.2.", "A5.6.3."],
  },
  "A5.7.": {
    paragraphId: "A5.7.",
    hazardClass: 1,
    description:
      "Ammonium Nitrate; Ammonium Perchlorate; Cyclotetramethylenetetranitramine, Octogen, or HMX Desensitized; Cyclotrimethylenetrinitramine, Cyclonite, Hexogen, or RDX Desensitized; Dinitroglycoluril or Dingu; Octonal; Tetranitroaniline; Trinitro-MCresol; Trinitroaniline or Picramide; Trinitroanisole; Trinitrobenzenesulphonic Acid; Trinitrochlorobenzene or Picryl Chloride; Trinitrofluorenone; Trinitronaphthalene; Trinitrophenetole; Trinitrotoluene and Trinitrobenzene Mixtures or TNT and Trinitrobenzene Mixtures or TNT and Hexannitrostilbene Mixtures; Trinitrotoluene Mixtures Containing Trinitrobenzene and Hexanitrostilbene or TNT Mixtures containing Trinitrobenzene and Hexanitrostilbene.",
    lastUpdated: new Date().toISOString(),
    entryType: "specialized",
    materialTypes: [
      "ammonium_nitrate",
      "ammonium_perchlorate",
      "hmx_desensitized",
      "rdx_desensitized",
      "tnt_mixtures",
      "trinitro_compounds",
    ],
    applicableUNNumbers: ["UN0222", "UN0150", "UN0216", "UN0386"],

    packagingOptions: [
      {
        id: "A5.7.1.dry_solids_non_powder",
        type: "combination",
        description:
          "Packaging for dry solid explosives (non-powder forms) with selective intermediate packaging",
        innerPackaging: {
          required: true,
          materials: [
            "Kraft paper bags",
            "Multiwall water-resistant paper bags",
            "Plastic bags",
            "Textile bags",
            "Rubberized plastic textile bags",
            "Woven plastic bags",
          ],
          specialRequirements: [
            "Inner packaging: Bags of kraft paper, multiwall water-resistant paper, plastic, textile, rubberized plastic textile, or woven plastic",
            "Inner packaging not required for UN0222",
            "Intermediate packaging: Bags of plastic, plastic-coated or lined textile (required for UN0150 only)",
          ],
        },
        intermediatePackaging: {
          required: false,
          description:
            "Bags of plastic, plastic-coated or lined textile (required for UN0150 only)",
          materials: ["Plastic bags", "Plastic-coated textile bags", "Lined textile bags"],
        },
        outerPackaging: {
          categories: [
            {
              type: "bags",
              containers: [
                {
                  code: "5H2",
                  material: "woven_plastic",
                  description: "Sift-proof woven plastic bag",
                },
                {
                  code: "5H3",
                  material: "woven_plastic",
                  description: "Water-resistant woven plastic bag",
                },
                {
                  code: "5H4",
                  material: "plastic_film",
                  description: "Plastic film bag",
                },
                {
                  code: "5L2",
                  material: "textile",
                  description: "Sift-proof textile bag",
                },
                {
                  code: "5L3",
                  material: "textile",
                  description: "Water-resistant textile bag",
                },
                {
                  code: "5M2",
                  material: "paper",
                  description: "Multiwall water-resistant paper bag",
                },
              ],
            },
            {
              type: "boxes",
              containers: [
                { code: "4A", material: "steel", description: "Steel box" },
                {
                  code: "4B",
                  material: "aluminum",
                  description: "Aluminum box",
                },
                {
                  code: "4N",
                  material: "other_metal",
                  description: "Other metal box",
                },
                {
                  code: "4C1",
                  material: "natural_wood",
                  description: "Ordinary natural wood box",
                },
                {
                  code: "4C2",
                  material: "natural_wood",
                  description: "Sift-proof natural wood box",
                },
                { code: "4D", material: "plywood", description: "Plywood box" },
                {
                  code: "4F",
                  material: "reconstituted_wood",
                  description: "Reconstituted wood box",
                },
                {
                  code: "4G",
                  material: "fiberboard",
                  description: "Fiberboard box",
                },
                {
                  code: "4H1",
                  material: "plastic",
                  description: "Expanded plastic box",
                },
                {
                  code: "4H2",
                  material: "plastic",
                  description: "Solid plastic box",
                },
              ],
            },
            {
              type: "drums",
              containers: [
                { code: "1A1", material: "steel", description: "Steel drum" },
                {
                  code: "1A2",
                  material: "steel",
                  description: "Steel drum with removable head",
                },
                {
                  code: "1B1",
                  material: "aluminum",
                  description: "Aluminum drum",
                },
                {
                  code: "1B2",
                  material: "aluminum",
                  description: "Aluminum drum with removable head",
                },
                {
                  code: "1N1",
                  material: "other_metal",
                  description: "Other metal drum",
                },
                {
                  code: "1N2",
                  material: "other_metal",
                  description: "Other metal drum with removable head",
                },
                {
                  code: "1D",
                  material: "plywood",
                  description: "Plywood drum",
                },
                { code: "1G", material: "fiber", description: "Fiber drum" },
                {
                  code: "1H1",
                  material: "plastic",
                  description: "Plastic drum",
                },
                {
                  code: "1H2",
                  material: "plastic",
                  description: "Plastic drum with removable head",
                },
              ],
            },
          ],
        },
        notes: [
          "For dry solid explosives (non-powder form)",
          "Includes bag packaging options (5-series containers)",
          "Intermediate packaging required only for UN0150",
        ],
      },
      {
        id: "A5.7.2.dry_powder_solids",
        type: "combination",
        description:
          "Packaging for solid dry powder explosives (sift-proof requirement mandatory)",
        innerPackaging: {
          required: true,
          materials: [
            "Multiwall water-resistant paper bags",
            "Plastic bags",
            "Woven plastic bags",
            "Fiberboard receptacles",
            "Metal receptacles",
            "Plastic receptacles",
            "Wood receptacles",
          ],
          specialRequirements: [
            "Inner packaging: Bags of multiwall water-resistant paper, plastic, or woven plastic",
            "OR Receptacles of fiberboard, metal, plastic, or wood",
            "Inner packagings not required if drums are used as outer packaging",
            "Intermediate packaging: Bags of multiwall water-resistant paper, plastic, or woven plastic",
            "OR Receptacles of fiberboard, metal, plastic, or wood",
          ],
        },
        intermediatePackaging: {
          required: true,
          description:
            "Bags of multiwall water-resistant paper, plastic, or woven plastic, or receptacles of fiberboard, metal, plastic, or wood",
          materials: [
            "Multiwall water-resistant paper bags",
            "Plastic bags",
            "Woven plastic bags",
            "Fiberboard receptacles",
            "Metal receptacles",
            "Plastic receptacles",
            "Wood receptacles",
          ],
        },
        outerPackaging: {
          categories: [
            {
              type: "boxes",
              containers: [
                { code: "4A", material: "steel", description: "Steel box" },
                {
                  code: "4B",
                  material: "aluminum",
                  description: "Aluminum box",
                },
                {
                  code: "4N",
                  material: "other_metal",
                  description: "Other metal box",
                },
                {
                  code: "4C1",
                  material: "natural_wood",
                  description: "Ordinary natural wood box",
                },
                {
                  code: "4C2",
                  material: "natural_wood",
                  description: "Sift-proof natural wood box",
                },
                { code: "4D", material: "plywood", description: "Plywood box" },
                {
                  code: "4F",
                  material: "reconstituted_wood",
                  description: "Reconstituted wood box",
                },
                {
                  code: "4G",
                  material: "fiberboard",
                  description: "Fiberboard box",
                },
                {
                  code: "4H2",
                  material: "plastic",
                  description: "Solid plastic box",
                },
              ],
            },
            {
              type: "drums",
              containers: [
                { code: "1A1", material: "steel", description: "Steel drum" },
                {
                  code: "1A2",
                  material: "steel",
                  description: "Steel drum with removable head",
                },
                {
                  code: "1B1",
                  material: "aluminum",
                  description: "Aluminum drum",
                },
                {
                  code: "1B2",
                  material: "aluminum",
                  description: "Aluminum drum with removable head",
                },
                {
                  code: "1N1",
                  material: "other_metal",
                  description: "Other metal drum",
                },
                {
                  code: "1N2",
                  material: "other_metal",
                  description: "Other metal drum with removable head",
                },
                {
                  code: "1D",
                  material: "plywood",
                  description: "Plywood drum",
                },
                { code: "1G", material: "fiber", description: "Fiber drum" },
                {
                  code: "1H1",
                  material: "plastic",
                  description: "Plastic drum",
                },
                {
                  code: "1H2",
                  material: "plastic",
                  description: "Plastic drum with removable head",
                },
              ],
            },
          ],
        },
        restrictions: ["At least one packaging layer must be sift-proof"],
        notes: [
          "For solid dry powder explosives",
          "Sift-proof requirement mandatory",
          "Inner packaging not required when drums are used as outer packaging",
        ],
      },
    ],

    specialRequirements: [
      {
        type: "lead_free",
        description: "Packaging must be lead free for UN0216 and UN0386 (T-0)",
        mandatory: true,
        applicableContainers: ["all"],
      },
      {
        type: "sift_proof",
        description:
          "At least one packaging layer must be sift-proof for powder materials",
        mandatory: true,
        applicableContainers: ["A5.7.2.dry_powder_solids"],
      },
      {
        type: "selective_intermediate",
        description: "Intermediate packaging required for UN0150 only",
        mandatory: false,
        applicableContainers: ["A5.7.1.dry_solids_non_powder"],
      },
    ],

    packingGroupRestrictions: [
      {
        packingGroup: "all",
        restriction: "required",
        description: "Lead-free packaging mandatory for UN0216 and UN0386",
        conditions: ["UN0216", "UN0386"],
      },
    ],

    conditionalRequirements: [
      {
        condition: "un_0222_no_inner",
        conditionType: "un_number",
        operator: "equals",
        value: "UN0222",
        effect: "modify",
        target: "inner_packaging_optional",
        description: "Inner packaging not required for UN0222",
      },
      {
        condition: "un_0150_intermediate_required",
        conditionType: "un_number",
        operator: "equals",
        value: "UN0150",
        effect: "require",
        target: "intermediate_packaging",
        description:
          "Intermediate packaging required for UN0150 only (bags of plastic, plastic-coated or lined textile)",
      },
      {
        condition: "drums_as_outer_powder",
        conditionType: "packaging_type",
        operator: "contains",
        value: "drum",
        effect: "modify",
        target: "inner_packaging_optional",
        description:
          "Inner packagings not required if drums are used as outer packaging for powder materials",
      },
      {
        condition: "lead_free_requirements",
        conditionType: "un_number",
        operator: "in_range",
        value: ["UN0216", "UN0386"],
        effect: "require",
        target: "lead_free_packaging",
        description: "Lead-free packaging mandatory for UN0216 and UN0386",
      },
    ],

    referencedParagraphs: ["A5.7.1.", "A5.7.2."],
  },
  "A5.8.": {
    paragraphId: "A5.8.",
    hazardClass: 1,
    description:
      "Black Powder or Gunpowder; Black Powder, Compressed or Gunpowder, Compressed; Black Powder, in Pellets or Gunpowder, in Pellets, Flash Powder",
    lastUpdated: new Date().toISOString(),
    entryType: "specialized",
    materialTypes: [
      "black_powder",
      "gunpowder",
      "black_powder_compressed",
      "black_powder_pellets",
      "flash_powder",
    ],
    applicableUNNumbers: ["UN0094", "UN0305", "UN0028", "UN0027"],

    packagingOptions: [
      {
        id: "A5.8.general",
        type: "combination",
        description:
          "Standard packaging for black powder, gunpowder, and flash powder (sift-proof requirement)",
        innerPackaging: {
          required: true,
          materials: [
            "Paper bags",
            "Plastic bags",
            "Rubberized textile bags",
            "Fiberboard receptacles",
            "Metal receptacles",
            "Plastic receptacles",
            "Wood receptacles",
            "Kraft paper sheets",
            "Waxed paper sheets",
          ],
          specialRequirements: [
            "Inner packaging: Bags of paper, plastic, or rubberized textile",
            "OR Receptacles of fiberboard, metal, plastic, or wood",
            "OR Sheets of kraft paper or waxed paper (only authorized for UN0028)",
            "Maximum 50g (1.8 oz) of flash powder (UN0094 or UN0305) per inner packaging",
            "At least one packaging layer must be sift-proof",
          ],
        },
        outerPackaging: {
          categories: [
            {
              type: "boxes",
              containers: [
                { code: "4A", material: "steel", description: "Steel box" },
                {
                  code: "4B",
                  material: "aluminum",
                  description: "Aluminum box",
                },
                {
                  code: "4N",
                  material: "other_metal",
                  description: "Other metal box",
                },
                {
                  code: "4C1",
                  material: "natural_wood",
                  description: "Ordinary natural wood box",
                },
                {
                  code: "4C2",
                  material: "natural_wood",
                  description: "Sift-proof natural wood box",
                },
                { code: "4D", material: "plywood", description: "Plywood box" },
                {
                  code: "4F",
                  material: "reconstituted_wood",
                  description: "Reconstituted wood box",
                },
                {
                  code: "4G",
                  material: "fiberboard",
                  description: "Fiberboard box",
                },
                {
                  code: "4H2",
                  material: "plastic",
                  description: "Solid plastic box",
                },
              ],
            },
            {
              type: "drums",
              containers: [
                { code: "1A1", material: "steel", description: "Steel drum" },
                {
                  code: "1A2",
                  material: "steel",
                  description: "Steel drum with removable head",
                },
                {
                  code: "1B1",
                  material: "aluminum",
                  description: "Aluminum drum",
                },
                {
                  code: "1B2",
                  material: "aluminum",
                  description: "Aluminum drum with removable head",
                },
                {
                  code: "1N1",
                  material: "other_metal",
                  description: "Other metal drum",
                },
                {
                  code: "1N2",
                  material: "other_metal",
                  description: "Other metal drum with removable head",
                },
                {
                  code: "1D",
                  material: "plywood",
                  description: "Plywood drum",
                },
                { code: "1G", material: "fiber", description: "Fiber drum" },
                {
                  code: "1H1",
                  material: "plastic",
                  description: "Plastic drum",
                },
                {
                  code: "1H2",
                  material: "plastic",
                  description: "Plastic drum with removable head",
                },
              ],
            },
          ],
        },
        quantityLimits: [
          {
            scope: "per_inner",
            value: 50,
            unit: "g",
            description: "Flash powder (UN0094, UN0305) only",
          },
        ],
        restrictions: [
          "At least one packaging layer must be sift-proof",
          "Maximum 50g flash powder per inner packaging",
        ],
        notes: [
          "For black powder, gunpowder (compressed and pellet forms), and flash powder",
          "Kraft paper or waxed paper sheets only authorized for UN0028",
          "Sift-proof requirement mandatory",
        ],
      },
      {
        id: "A5.8.drums_no_inner",
        type: "single",
        description:
          "Direct drum packaging for UN0027 (no inner packaging required)",
        applicableUNNumbers: ["UN0027"],
        innerPackaging: {
          required: false,
        },
        outerPackaging: {
          categories: [
            {
              type: "drums",
              containers: [
                { code: "1A1", material: "steel", description: "Steel drum" },
                {
                  code: "1A2",
                  material: "steel",
                  description: "Steel drum with removable head",
                },
                {
                  code: "1B1",
                  material: "aluminum",
                  description: "Aluminum drum",
                },
                {
                  code: "1B2",
                  material: "aluminum",
                  description: "Aluminum drum with removable head",
                },
                {
                  code: "1N1",
                  material: "other_metal",
                  description: "Other metal drum",
                },
                {
                  code: "1N2",
                  material: "other_metal",
                  description: "Other metal drum with removable head",
                },
                {
                  code: "1D",
                  material: "plywood",
                  description: "Plywood drum",
                },
                { code: "1G", material: "fiber", description: "Fiber drum" },
                {
                  code: "1H1",
                  material: "plastic",
                  description: "Plastic drum",
                },
                {
                  code: "1H2",
                  material: "plastic",
                  description: "Plastic drum with removable head",
                },
              ],
            },
          ],
        },
        restrictions: [
          "Only authorized for UN0027",
          "At least one packaging layer must be sift-proof",
        ],
        notes: [
          "Inner packaging not required for UN0027 when packed in drums",
          "Simplified packaging option for specific UN number",
        ],
      },
    ],

    specialRequirements: [
      {
        type: "sift_proof",
        description: "At least one packaging layer must be sift-proof (T-0)",
        mandatory: true,
        applicableContainers: ["all"],
      },
      {
        type: "quantity_control",
        description: "Maximum 50g (1.8 oz) of flash powder per inner packaging",
        mandatory: true,
        applicableContainers: ["A5.8.general"],
      },
      {
        type: "paper_sheets_restriction",
        description:
          "Kraft paper or waxed paper sheets only authorized for UN0028",
        mandatory: true,
        applicableContainers: ["A5.8.general"],
      },
    ],

    conditionalRequirements: [
      {
        condition: "flash_powder_quantity_limit",
        conditionType: "un_number",
        operator: "in_range",
        value: ["UN0094", "UN0305"],
        effect: "restrict",
        target: "max_50g_per_inner",
        description:
          "Maximum 50g (1.8 oz) of flash powder per inner packaging for UN0094 and UN0305",
      },
      {
        condition: "paper_sheets_un0028_only",
        conditionType: "un_number",
        operator: "equals",
        value: "UN0028",
        effect: "require",
        target: "paper_sheets_authorized",
        description:
          "Kraft paper or waxed paper sheets only authorized for UN0028",
      },
      {
        condition: "un0027_no_inner_drums",
        conditionType: "un_number",
        operator: "equals",
        value: "UN0027",
        effect: "modify",
        target: "inner_packaging_not_required_drums",
        description:
          "Inner packaging not required for UN0027 when packed in drums",
      },
      {
        condition: "mandatory_sift_proof",
        conditionType: "material_state",
        operator: "contains",
        value: "powder",
        effect: "require",
        target: "sift_proof_packaging",
        description:
          "At least one packaging layer must be sift-proof for all powder materials",
      },
    ],

    referencedParagraphs: ["A5.8."],
  },
  "A5.9.": {
    paragraphId: "A5.9.",
    hazardClass: 1,
    description:
      "Deflagrating Metal Salts of Aromatic Nitroderivatives, N.O.S.; Dinitrophenolates; Dinitrosobenzene; Nitrocellulose, Wetted; 5-Mercaptotetrazol-1-Acetic Acid; Tetrazol-1- Acetic Acid; Powder, Smokeless; Propellant, Solid; Sodium Dinitro-O-Cresolate; Sodium Picramate; and Zirconium Picramate",
    lastUpdated: new Date().toISOString(),
    entryType: "specialized",
    materialTypes: [
      "metal_salts_aromatic",
      "dinitrophenolates",
      "nitrocellulose_wetted",
      "smokeless_powder",
      "solid_propellant",
      "sodium_compounds",
    ],
    applicableUNNumbers: [
      "UN0077",
      "UN0132",
      "UN0234",
      "UN0235",
      "UN0236",
      "UN0342",
      "UN0160",
      "UN0161",
      "UN0406",
      "UN0407",
      "UN0448",
      "UN0498",
      "UN0499",
      "UN0509",
    ],

    packagingOptions: [
      {
        id: "A5.9.1.wetted_solids",
        type: "combination",
        description: "Three-tier packaging for wetted solids (UN0342)",
        applicableUNNumbers: ["UN0342"],
        innerPackaging: {
          required: true,
          materials: [
            "Plastic bags",
            "Textile bags",
            "Woven plastic bags",
            "Metal receptacles",
            "Plastic receptacles",
            "Wood receptacles",
          ],
          specialRequirements: [
            "Inner packaging: Bags of plastic, textile, or woven plastic",
            "OR Receptacles of metal, plastic, or wood",
            "Inner packaging not required for UN0342 when packed in outer drums (1A1, 1A2, 1B1, 1B2, 1N1, 1N2, 1H1, 1H2)",
            "Intermediate packaging: Bags of plastic, plastic coated or lined textile",
            "OR Receptacles of metal or plastic",
            "OR Dividing partitions of wood",
            "Intermediate packaging not required if packed in outer leakproof removable head drum",
          ],
        },
        intermediatePackaging: {
          required: true,
          description:
            "Bags of plastic or plastic coated or lined textile, or receptacles of metal or plastic, or dividing partitions of wood",
          materials: [
            "Plastic bags",
            "Plastic coated or lined textile bags",
            "Metal receptacles",
            "Plastic receptacles",
            "Wood dividing partitions",
          ],
        },
        outerPackaging: {
          categories: [
            {
              type: "boxes",
              containers: [
                { code: "4A", material: "steel", description: "Steel box" },
                {
                  code: "4N",
                  material: "other_metal",
                  description: "Other metal box",
                },
                {
                  code: "4C1",
                  material: "natural_wood",
                  description: "Ordinary natural wood box",
                },
                {
                  code: "4C2",
                  material: "natural_wood",
                  description: "Sift-proof natural wood box",
                },
                { code: "4D", material: "plywood", description: "Plywood box" },
                {
                  code: "4F",
                  material: "reconstituted_wood",
                  description: "Reconstituted wood box",
                },
                {
                  code: "4G",
                  material: "fiberboard",
                  description: "Fiberboard box",
                },
                {
                  code: "4H2",
                  material: "plastic",
                  description: "Solid plastic box",
                },
              ],
            },
            {
              type: "drums",
              containers: [
                { code: "1A1", material: "steel", description: "Steel drum" },
                {
                  code: "1A2",
                  material: "steel",
                  description: "Steel drum with removable head",
                },
                {
                  code: "1B1",
                  material: "aluminum",
                  description: "Aluminum drum",
                },
                {
                  code: "1B2",
                  material: "aluminum",
                  description: "Aluminum drum with removable head",
                },
                {
                  code: "1N1",
                  material: "other_metal",
                  description: "Other metal drum",
                },
                {
                  code: "1N2",
                  material: "other_metal",
                  description: "Other metal drum with removable head",
                },
                {
                  code: "1D",
                  material: "plywood",
                  description: "Plywood drum",
                },
                { code: "1G", material: "fiber", description: "Fiber drum" },
                {
                  code: "1H1",
                  material: "plastic",
                  description: "Plastic drum",
                },
                {
                  code: "1H2",
                  material: "plastic",
                  description: "Plastic drum with removable head",
                },
              ],
            },
          ],
        },
        restrictions: ["Use only for UN0342"],
        notes: [
          "For wetted solid materials (UN0342)",
          "Three-tier packaging system with conditional inner and intermediate packaging",
          "Inner packaging not required when using specified drums",
        ],
      },
      {
        id: "A5.9.2.dry_solids",
        type: "combination",
        description:
          "Packaging for dry solid materials with special drum requirements",
        applicableUNNumbers: [
          "UN0132",
          "UN0160",
          "UN0161",
          "UN0406",
          "UN0407",
          "UN0448",
          "UN0498",
          "UN0499",
          "UN0509",
        ],
        innerPackaging: {
          required: true,
          materials: [
            "Kraft paper bags",
            "Plastic bags",
            "Sift-proof woven plastic bags",
            "Sift-proof textile bags",
            "Fiberboard receptacles",
            "Metal receptacles",
            "Paper receptacles",
            "Plastic receptacles",
            "Wood receptacles",
            "Sift-proof woven plastic receptacles",
          ],
          specialRequirements: [
            "Inner packaging: Bags of kraft paper, plastic, sift-proof woven plastic, or textile",
            "OR Receptacles of fiberboard, metal, paper, plastic, wood, or sift-proof woven plastic",
            "Inner packaging not required for UN0160 and UN0161 when packed in drums",
          ],
        },
        outerPackaging: {
          categories: [
            {
              type: "boxes",
              containers: [
                {
                  code: "4C1",
                  material: "natural_wood",
                  description: "Ordinary natural wood box",
                },
                {
                  code: "4C2",
                  material: "natural_wood",
                  description: "Sift-proof natural wood box",
                },
                { code: "4D", material: "plywood", description: "Plywood box" },
                {
                  code: "4F",
                  material: "reconstituted_wood",
                  description: "Reconstituted wood box",
                },
                {
                  code: "4G",
                  material: "fiberboard",
                  description: "Fiberboard box",
                },
              ],
            },
            {
              type: "drums",
              containers: [
                { code: "1A1", material: "steel", description: "Steel drum" },
                {
                  code: "1A2",
                  material: "steel",
                  description:
                    "Steel drum with removable head (special construction for UN0160/0161)",
                },
                {
                  code: "1B1",
                  material: "aluminum",
                  description: "Aluminum drum",
                },
                {
                  code: "1B2",
                  material: "aluminum",
                  description:
                    "Aluminum drum with removable head (special construction for UN0160/0161)",
                },
                {
                  code: "1N1",
                  material: "other_metal",
                  description: "Other metal drum",
                },
                {
                  code: "1N2",
                  material: "other_metal",
                  description:
                    "Other metal drum with removable head (special construction for UN0160/0161)",
                },
                {
                  code: "1D",
                  material: "plywood",
                  description: "Plywood drum",
                },
                { code: "1G", material: "fiber", description: "Fiber drum" },
                {
                  code: "1H1",
                  material: "plastic",
                  description: "Plastic drum",
                },
                {
                  code: "1H2",
                  material: "plastic",
                  description: "Plastic drum with removable head",
                },
              ],
            },
          ],
        },
        restrictions: [
          "Use for UN0132, UN0160, UN0161, UN0406, UN0407, UN0448, UN0498, UN0499, and UN0509",
          "For UN0160 and 0161: 1A2, 1B2, and 1N2 drums must prevent explosion from internal pressure",
          "For UN0509: Do not use metal packagings",
        ],
        notes: [
          "For dry solid materials",
          "Special drum construction requirements for UN0160 and UN0161",
          "Metal packaging prohibited for UN0509",
        ],
      },
    ],

    specialRequirements: [
      {
        type: "lead_free",
        description:
          "Packaging must be lead free for UN0077, UN0132, UN0234, UN0235, and UN0236 (T-0)",
        mandatory: true,
        applicableContainers: ["all"],
      },
      {
        type: "pressure_resistant",
        description:
          "For UN0160 and 0161: 1A2, 1B2, and 1N2 drums must be constructed to prevent explosion from increased internal pressure",
        mandatory: true,
        applicableContainers: ["A5.9.2.dry_solids"],
      },
      {
        type: "metal_prohibition",
        description: "Metal packagings prohibited for UN0509",
        mandatory: true,
        applicableContainers: ["A5.9.2.dry_solids"],
      },
      {
        type: "leakproof_drums",
        description:
          "When leakproof removable head drums are used, intermediate packaging may be omitted",
        mandatory: false,
        applicableContainers: ["A5.9.1.wetted_solids"],
      },
    ],

    packingGroupRestrictions: [
      {
        packingGroup: "all",
        restriction: "required",
        description: "Lead-free packaging mandatory for specified UN numbers",
        conditions: ["UN0077", "UN0132", "UN0234", "UN0235", "UN0236"],
      },
      {
        packingGroup: "all",
        restriction: "prohibited",
        description: "Metal packagings prohibited for UN0509",
        conditions: ["UN0509"],
      },
    ],

    conditionalRequirements: [
      {
        condition: "un0342_drums_no_inner",
        conditionType: "un_number",
        operator: "equals",
        value: "UN0342",
        effect: "modify",
        target: "inner_packaging_not_required_drums",
        description:
          "Inner packaging not required for UN0342 when packed in outer drums (1A1, 1A2, 1B1, 1B2, 1N1, 1N2, 1H1, 1H2)",
      },
      {
        condition: "leakproof_drums_no_intermediate",
        conditionType: "packaging_type",
        operator: "contains",
        value: "leakproof_removable_head_drum",
        effect: "modify",
        target: "intermediate_packaging_not_required",
        description:
          "Intermediate packaging not required if packed in outer leakproof removable head drum",
      },
      {
        condition: "un0160_0161_no_inner_drums",
        conditionType: "un_number",
        operator: "in_range",
        value: ["UN0160", "UN0161"],
        effect: "modify",
        target: "inner_packaging_not_required_drums",
        description:
          "Inner packaging not required for UN0160 and UN0161 when packed in drums",
      },
      {
        condition: "un0160_0161_pressure_resistant",
        conditionType: "un_number",
        operator: "in_range",
        value: ["UN0160", "UN0161"],
        effect: "require",
        target: "pressure_resistant_construction",
        description:
          "1A2, 1B2, and 1N2 drums must be constructed to prevent explosion from increased internal pressure",
      },
      {
        condition: "un0509_no_metal",
        conditionType: "un_number",
        operator: "equals",
        value: "UN0509",
        effect: "prohibit",
        target: "metal_packagings",
        description: "Metal packagings prohibited for UN0509",
      },
      {
        condition: "lead_free_requirements",
        conditionType: "un_number",
        operator: "in_range",
        value: ["UN0077", "UN0132", "UN0234", "UN0235", "UN0236"],
        effect: "require",
        target: "lead_free_packaging",
        description: "Lead-free packaging mandatory for specified UN numbers",
      },
    ],

    referencedParagraphs: ["A5.9.1.", "A5.9.2."],
  },
  "A5.10.": {
    paragraphId: "A5.10.",
    hazardClass: 1,
    description:
      "Nitroglycerin, Desensitized; Nitroglycerin, Solution in Alcohol; and Propellant, Liquid",
    lastUpdated: new Date().toISOString(),
    entryType: "specialized",
    materialTypes: [
      "nitroglycerin_desensitized",
      "nitroglycerin_alcohol_solution",
      "liquid_propellant",
    ],
    applicableUNNumbers: ["UN0144", "UN0075", "UN0143", "UN0495", "UN0497"],

    packagingOptions: [
      {
        id: "A5.10.combination",
        type: "combination",
        description:
          "Three-tier packaging for liquid explosive materials with absorbent requirements",
        innerPackaging: {
          required: true,
          materials: [
            "Plastic receptacles",
            "Wood receptacles",
            "Metal receptacles",
          ],
          specialRequirements: [
            "Inner packaging: Receptacles of plastic or wood",
            "Metal receptacles allowed for UN0144 only",
            "Tape screw cap closures required",
            "Maximum 5 liters capacity each when boxes are used as outer packaging (does not apply to UN0144)",
            "Surround each inner packaging with sufficient noncombustible absorbent material to absorb entire contents",
            "Cushion metal receptacles from each other in all directions",
            "Intermediate packaging: Bags of plastic in metal receptacles, OR metal drums, OR wood receptacles",
            "Intermediate packaging not required for UN0144",
            "For UN0075, 0143, 0495, and 0497: use bags as intermediate packaging when boxes are outer packaging",
          ],
        },
        intermediatePackaging: {
          required: true,
          description:
            "Bags of plastic in metal receptacles, or metal drums, or wood receptacles",
          materials: [
            "Plastic bags in metal receptacles",
            "Metal drums",
            "Wood receptacles",
          ],
        },
        outerPackaging: {
          categories: [
            {
              type: "boxes",
              containers: [
                {
                  code: "4C1",
                  material: "natural_wood",
                  description: "Ordinary natural wood box",
                },
                {
                  code: "4C2",
                  material: "natural_wood",
                  description: "Sift-proof natural wood box",
                },
                { code: "4D", material: "plywood", description: "Plywood box" },
                {
                  code: "4F",
                  material: "reconstituted_wood",
                  description: "Reconstituted wood box",
                },
                {
                  code: "4G",
                  material: "fiberboard",
                  description: "Fiberboard box (UN0144 only)",
                },
              ],
            },
            {
              type: "drums",
              containers: [
                { code: "1A1", material: "steel", description: "Steel drum" },
                {
                  code: "1A2",
                  material: "steel",
                  description: "Steel drum with removable head",
                },
                {
                  code: "1B1",
                  material: "aluminum",
                  description: "Aluminum drum (not for UN0144)",
                },
                {
                  code: "1B2",
                  material: "aluminum",
                  description:
                    "Aluminum drum with removable head (not for UN0144)",
                },
                {
                  code: "1N1",
                  material: "other_metal",
                  description: "Other metal drum (not for UN0144)",
                },
                {
                  code: "1N2",
                  material: "other_metal",
                  description:
                    "Other metal drum with removable head (not for UN0144)",
                },
                {
                  code: "1D",
                  material: "plywood",
                  description: "Plywood drum",
                },
                { code: "1G", material: "fiber", description: "Fiber drum" },
                {
                  code: "1H1",
                  material: "plastic",
                  description: "Plastic drum",
                },
                {
                  code: "1H2",
                  material: "plastic",
                  description: "Plastic drum with removable head",
                },
              ],
            },
          ],
        },
        quantityLimits: [
          {
            scope: "per_inner",
            value: 5,
            unit: "L",
            description:
              "When boxes are outer packaging (not applicable to UN0144)",
          },
          {
            scope: "per_box",
            value: 30,
            unit: "kg",
            description: "Maximum net mass for boxes",
          },
          {
            scope: "per_drum",
            value: 120,
            unit: "L",
            description: "Maximum net volume for drums",
          },
        ],
        restrictions: [
          "Liquid substances must not freeze at temperatures above -15°C (5°F) (T-0)",
          "Maximum 30kg net mass for boxes (T-0)",
          "Maximum 120L net volume for drums (T-0)",
          "Aluminum and other metal drums prohibited for UN0144",
        ],
        notes: [
          "For nitroglycerin and liquid propellant materials",
          "Requires absorbent material and cushioning",
          "Three-tier packaging with conditional intermediate packaging",
          "Temperature restrictions apply",
        ],
      },
      {
        id: "A5.10.composite",
        type: "composite_plastic",
        description:
          "Composite packaging alternative (plastic receptacle in metal drum)",
        innerPackaging: {
          required: true,
          materials: ["Plastic receptacles"],
          specialRequirements: [
            "Plastic receptacle in metal drum (6HA1) composite packaging",
            "May be used instead of inner and intermediate packagings",
            "Must include absorbent material",
            "Temperature restrictions apply",
          ],
        },
        outerPackaging: {
          categories: [
            {
              type: "composite",
              containers: [
                {
                  code: "6HA1",
                  material: "composite_plastic_metal",
                  description:
                    "Composite packaging: plastic receptacle in metal drum",
                },
              ],
            },
          ],
        },
        restrictions: [
          "Liquid substances must not freeze at temperatures above -15°C (5°F)",
        ],
        notes: [
          "Alternative composite packaging option",
          "Simplifies packaging structure by combining inner and intermediate functions",
        ],
      },
    ],

    specialRequirements: [
      {
        type: "absorbent_material",
        description:
          "Surround each inner packaging with sufficient noncombustible absorbent material to absorb entire contents",
        mandatory: true,
        applicableContainers: ["all"],
      },
      {
        type: "cushioning",
        description:
          "Cushion metal receptacles from each other in all directions",
        mandatory: true,
        applicableContainers: ["all"],
      },
      {
        type: "temperature_control",
        description:
          "Liquid substances must not freeze at temperatures above -15°C (5°F)",
        mandatory: true,
        applicableContainers: ["all"],
      },
      {
        type: "closure_security",
        description: "Tape screw cap closures required",
        mandatory: true,
        applicableContainers: ["A5.10.combination"],
      },
      {
        type: "volume_limits",
        description:
          "Maximum 5L capacity per inner packaging when boxes are outer packaging (except UN0144)",
        mandatory: true,
        applicableContainers: ["A5.10.combination"],
      },
      {
        type: "mass_limits",
        description:
          "Maximum 30kg net mass for boxes, 120L net volume for drums",
        mandatory: true,
        applicableContainers: ["A5.10.combination"],
      },
    ],

    packingGroupRestrictions: [
      {
        packingGroup: "all",
        restriction: "prohibited",
        description: "Aluminum and other metal drums prohibited for UN0144",
        conditions: ["UN0144"],
      },
    ],

    conditionalRequirements: [
      {
        condition: "un0144_metal_receptacles",
        conditionType: "un_number",
        operator: "equals",
        value: "UN0144",
        effect: "require",
        target: "metal_receptacles_allowed",
        description: "Metal receptacles allowed for UN0144 only",
      },
      {
        condition: "un0144_no_intermediate",
        conditionType: "un_number",
        operator: "equals",
        value: "UN0144",
        effect: "modify",
        target: "intermediate_packaging_not_required",
        description: "Intermediate packaging not required for UN0144",
      },
      {
        condition: "un0144_fiberboard_boxes",
        conditionType: "un_number",
        operator: "equals",
        value: "UN0144",
        effect: "require",
        target: "fiberboard_boxes_allowed",
        description: "Fiberboard (4G) boxes may be used for UN0144",
      },
      {
        condition: "un0144_drum_restrictions",
        conditionType: "un_number",
        operator: "equals",
        value: "UN0144",
        effect: "prohibit",
        target: "aluminum_other_metal_drums",
        description:
          "Aluminum drums (1B1, 1B2) and other metal drums (1N1, 1N2) prohibited for UN0144",
      },
      {
        condition: "specific_uns_bags_intermediate",
        conditionType: "un_number",
        operator: "in_range",
        value: ["UN0075", "UN0143", "UN0495", "UN0497"],
        effect: "require",
        target: "bags_intermediate_with_boxes",
        description:
          "Use bags as intermediate packaging when boxes are used as outer packaging",
      },
      {
        condition: "volume_limit_except_un0144",
        conditionType: "un_number",
        operator: "not_equals",
        value: "UN0144",
        effect: "restrict",
        target: "5L_limit_with_boxes",
        description:
          "5L capacity limit per inner packaging when boxes are outer packaging (does not apply to UN0144)",
      },
    ],

    referencedParagraphs: ["A5.10."],
  },
  "A5.11.": {
    paragraphId: "A5.11.",
    hazardClass: 1,
    description:
      "Ammonium Nitrate-Fuel Oil Mixture; Explosive, Blasting, Type A (UN0081); Explosive, Blasting, Type B (UN0082); and Explosive, Blasting, Type E (UN0241); Explosive, Blasting, Type B (UN0331) or Agent Blasting, Type B; Explosive, Blasting, Type C (UN0083); Explosive, Blasting, Type D (UN0084) and Explosive, Blasting, Type E (UN0332)",
    lastUpdated: new Date().toISOString(),
    entryType: "specialized",
    materialTypes: [
      "anfo_mixture",
      "explosive_blasting_type_a",
      "explosive_blasting_type_b",
      "explosive_blasting_type_c",
      "explosive_blasting_type_d",
      "explosive_blasting_type_e",
    ],
    applicableUNNumbers: [
      "UN0081",
      "UN0082",
      "UN0083",
      "UN0084",
      "UN0241",
      "UN0331",
      "UN0332",
    ],

    packagingOptions: [
      {
        id: "A5.11.general",
        type: "combination",
        description:
          "Standard packaging for blasting explosives with conditional inner packaging requirements",
        innerPackaging: {
          required: false,
          materials: [
            "Paper bags",
            "Water and oil resistant plastic bags",
            "Textile bags",
            "Plastic coated woven plastic bags",
            "Sift-proof bags",
            "Fiberboard receptacles",
            "Water resistant metal receptacles",
            "Plastic receptacles",
            "Sift-proof wood receptacles",
            "Water resistant paper sheets",
            "Waxed paper sheets",
            "Plastic sheets",
          ],
          specialRequirements: [
            "Inner packaging: Bags of paper, water and oil resistant plastic, textile, plastic coated or lined woven plastic, sift-proof",
            "OR Receptacles of fiberboard, water resistant metal, plastic, sift-proof wood",
            "OR Sheets of water resistant paper, waxed paper, plastic",
            "Inner packaging not required for UN0082, UN0241, UN0331, and UN0332 if packed in leakproof removable head outer drum",
            "Inner packaging not required for UN0082, UN0241, UN0331, and UN0332 when explosive is contained in material impervious to liquid",
            "Inner packaging not required for UN0081 when packed in rigid plastic that is impervious to liquid",
            "Inner packaging not required for UN0331 when 5H2, 5H3, or 5H4 bags are outer packaging",
          ],
        },
        outerPackaging: {
          categories: [
            {
              type: "boxes",
              containers: [
                { code: "4A", material: "steel", description: "Steel box" },
                {
                  code: "4B",
                  material: "aluminum",
                  description: "Aluminum box",
                },
                {
                  code: "4N",
                  material: "other_metal",
                  description: "Other metal box",
                },
                {
                  code: "4C1",
                  material: "natural_wood",
                  description: "Ordinary natural wood box",
                },
                {
                  code: "4C2",
                  material: "natural_wood",
                  description: "Sift-proof natural wood box",
                },
                { code: "4D", material: "plywood", description: "Plywood box" },
                {
                  code: "4F",
                  material: "reconstituted_wood",
                  description: "Reconstituted wood box",
                },
                {
                  code: "4G",
                  material: "fiberboard",
                  description: "Fiberboard box",
                },
                {
                  code: "4H2",
                  material: "plastic",
                  description: "Solid plastic box",
                },
              ],
            },
            {
              type: "drums",
              containers: [
                { code: "1A1", material: "steel", description: "Steel drum" },
                {
                  code: "1A2",
                  material: "steel",
                  description: "Steel drum with removable head",
                },
                {
                  code: "1B1",
                  material: "aluminum",
                  description: "Aluminum drum",
                },
                {
                  code: "1B2",
                  material: "aluminum",
                  description: "Aluminum drum with removable head",
                },
                {
                  code: "1N1",
                  material: "other_metal",
                  description: "Other metal drum",
                },
                {
                  code: "1N2",
                  material: "other_metal",
                  description: "Other metal drum with removable head",
                },
                {
                  code: "1D",
                  material: "plywood",
                  description: "Plywood drum",
                },
                { code: "1G", material: "fiber", description: "Fiber drum" },
                {
                  code: "1H1",
                  material: "plastic",
                  description: "Plastic drum",
                },
                {
                  code: "1H2",
                  material: "plastic",
                  description: "Plastic drum with removable head",
                },
              ],
            },
            {
              type: "jerricans",
              containers: [
                {
                  code: "3A1",
                  material: "steel",
                  description: "Steel jerrican",
                },
                {
                  code: "3A2",
                  material: "steel",
                  description: "Steel jerrican with removable head",
                },
                {
                  code: "3H1",
                  material: "plastic",
                  description: "Plastic jerrican",
                },
                {
                  code: "3H2",
                  material: "plastic",
                  description: "Plastic jerrican with removable head",
                },
              ],
            },
            {
              type: "bags",
              containers: [
                {
                  code: "5H1",
                  material: "woven_plastic",
                  description: "Woven plastic bag",
                },
                {
                  code: "5H2",
                  material: "woven_plastic",
                  description: "Sift-proof woven plastic bag",
                },
                {
                  code: "5H3",
                  material: "woven_plastic",
                  description: "Water-resistant woven plastic bag",
                },
                {
                  code: "5H4",
                  material: "plastic_film",
                  description: "Plastic film bag",
                },
                {
                  code: "5L2",
                  material: "textile",
                  description: "Sift-proof textile bag",
                },
                {
                  code: "5L3",
                  material: "textile",
                  description: "Water-resistant textile bag",
                },
                {
                  code: "5M2",
                  material: "paper",
                  description: "Multiwall water-resistant paper bag",
                },
              ],
            },
          ],
        },
        restrictions: ["Bags prohibited for UN0081"],
        notes: [
          "For blasting explosives and ANFO mixtures",
          "Multiple conditional requirements for inner packaging",
          "Bag packaging options available (except for UN0081)",
          "Jerricans available as alternative outer packaging",
        ],
      },
    ],

    specialRequirements: [
      {
        type: "water_oil_resistance",
        description:
          "Water and oil resistant materials required for certain inner packaging",
        mandatory: true,
        applicableContainers: ["A5.11.general"],
      },
      {
        type: "impervious_material",
        description:
          "Material impervious to liquid required for certain UN numbers to eliminate inner packaging",
        mandatory: false,
        applicableContainers: ["A5.11.general"],
      },
      {
        type: "leakproof_drums",
        description:
          "Leakproof removable head drums allow elimination of inner packaging for certain UN numbers",
        mandatory: false,
        applicableContainers: ["A5.11.general"],
      },
      {
        type: "bag_prohibition",
        description: "Bag packaging prohibited for UN0081",
        mandatory: true,
        applicableContainers: ["A5.11.general"],
      },
    ],

    packingGroupRestrictions: [
      {
        packingGroup: "all",
        restriction: "prohibited",
        description: "Bag packaging prohibited for UN0081",
        conditions: ["UN0081"],
      },
    ],

    conditionalRequirements: [
      {
        condition: "leakproof_drums_no_inner_multiple",
        conditionType: "un_number",
        operator: "in_range",
        value: ["UN0082", "UN0241", "UN0331", "UN0332"],
        effect: "modify",
        target: "inner_packaging_not_required_leakproof_drums",
        description:
          "Inner packaging not required for UN0082, UN0241, UN0331, and UN0332 if packed in leakproof removable head outer drum",
      },
      {
        condition: "impervious_material_no_inner_multiple",
        conditionType: "un_number",
        operator: "in_range",
        value: ["UN0082", "UN0241", "UN0331", "UN0332"],
        effect: "modify",
        target: "inner_packaging_not_required_impervious",
        description:
          "Inner packaging not required for UN0082, UN0241, UN0331, and UN0332 when explosive is contained in material impervious to liquid",
      },
      {
        condition: "un0081_rigid_plastic_no_inner",
        conditionType: "un_number",
        operator: "equals",
        value: "UN0081",
        effect: "modify",
        target: "inner_packaging_not_required_rigid_plastic",
        description:
          "Inner packaging not required for UN0081 when packed in rigid plastic that is impervious to liquid",
      },
      {
        condition: "un0331_specific_bags_no_inner",
        conditionType: "un_number",
        operator: "equals",
        value: "UN0331",
        effect: "modify",
        target: "inner_packaging_not_required_specific_bags",
        description:
          "Inner packaging not required for UN0331 when 5H2, 5H3, or 5H4 bags are outer packaging",
      },
      {
        condition: "un0081_bag_prohibition",
        conditionType: "un_number",
        operator: "equals",
        value: "UN0081",
        effect: "prohibit",
        target: "bag_packaging",
        description: "Bag packaging prohibited for UN0081",
      },
    ],

    referencedParagraphs: ["A5.11."],
  },
"A5.12.": {
      paragraphId: "A5.12.",
      hazardClass: 1,
      description:
        `Ammunition, Illuminating; Ammunition, Incendiary; Ammunition, Incendiary, White Phosphorus; Ammunition, Practice; Ammunition, Proof; Ammunition, Smoke; Ammunition, Smoke, White Phosphorus; Ammunition, Tear-Producing; Bombs; Bombs, Photo-Flash; Cartridges, Depth;
  Cartridges for Weapons; Cartridges for Weapons, Blank; Cartridges for Weapons, Inert Projectile; Cartridges, Small Arms; Cartridges, Small Arms, Blank; Charges, Bursting, Charges, Demolition; Plastic Bonded; Charges, Propelling for Cannon; Mines; Projectiles; Rocket
  Motors; Rockets; Rockets, Line-Throwing; Torpedoes; Warheads, Rocket; and Warheads, Torpedo`,
      lastUpdated: new Date().toISOString(),
      entryType: "specialized",
      materialTypes: [
        "ammunition_various",
        "ordnance_military",
        "cartridges_weapons",
        "bombs_explosive",
        "rockets_missiles",
        "mines_military",
        "warheads_explosive",
      ],
      applicableUNNumbers: [
        "UN0006",
        "UN0009",
        "UN0010",
        "UN0015",
        "UN0016",
        "UN0018",
        "UN0019",
        "UN0034",
        "UN0035",
        "UN0038",
        "UN0039",
        "UN0048",
        "UN0056",
        "UN0137",
        "UN0138",
        "UN0168",
        "UN0169",
        "UN0171",
        "UN0181",
        "UN0182",
        "UN0183",
        "UN0186",
        "UN0221",
        "UN0238",
        "UN0243",
        "UN0244",
        "UN0245",
        "UN0246",
        "UN0254",
        "UN0280",
        "UN0281",
        "UN0286",
        "UN0287",
        "UN0297",
        "UN0299",
        "UN0300",
        "UN0301",
        "UN0303",
        "UN0321",
        "UN0328",
        "UN0329",
        "UN0344",
        "UN0345",
        "UN0346",
        "UN0347",
        "UN0362",
        "UN0363",
        "UN0370",
        "UN0412",
        "UN0424",
        "UN0425",
        "UN0434",
        "UN0435",
        "UN0436",
        "UN0437",
        "UN0438",
        "UN0451",
        "UN0459",
        "UN0488",
      ],

      packagingOptions: [
        {
          id: "A5.12.1.single",
          type: "single",
          description: "Boxes, drums, or large packagings (inner packaging not required)",
          innerPackaging: {
            required: false,
          },
          outerPackaging: {
            categories: [
              {
                type: "boxes",
                containers: [
                  { code: "4A", material: "steel", description: "Steel box" },
                  { code: "4B", material: "aluminum", description: "Aluminum box" },
                  { code: "4C1", material: "natural_wood", description: "Ordinary natural wood box" },
                  { code: "4C2", material: "natural_wood", description: "Sift-proof natural wood box" },
                  { code: "4D", material: "plywood", description: "Plywood box" },
                  { code: "4F", material: "reconstituted_wood", description: "Reconstituted wood box" },
                  { code: "4G", material: "fiberboard", description: "Fiberboard box" },
                  { code: "4H1", material: "plastic", description: "Expanded plastic box" },
                  { code: "4H2", material: "plastic", description: "Solid plastic box" },
                  { code: "4N", material: "other_metal", description: "Other metal box" },
                ],
              },
              {
                type: "drums",
                containers: [
                  { code: "1A1", material: "steel", description: "Steel drum" },
                  { code: "1A2", material: "steel", description: "Steel drum" },
                  { code: "1B1", material: "aluminum", description: "Aluminum drum" },
                  { code: "1B2", material: "aluminum", description: "Aluminum drum" },
                  { code: "1D", material: "plywood", description: "Plywood drum" },
                  { code: "1G", material: "fiber", description: "Fiber drum" },
                  { code: "1H1", material: "plastic", description: "Plastic drum" },
                  { code: "1H2", material: "plastic", description: "Plastic drum" },
                  { code: "1N1", material: "other_metal", description: "Other metal drum" },
                  { code: "1N2", material: "other_metal", description: "Other metal drum" },
                ],
              },
              {
                type: "large_packagings",
                containers: [
                  { code: "50A", material: "steel", description: "Steel large packaging" },
                  { code: "50B", material: "aluminum", description: "Aluminum large packaging" },
                  { code: "50C", material: "natural_wood", description: "Natural wood large packaging" },
                  { code: "50D", material: "plywood", description: "Plywood large packaging" },
                  { code: "50F", material: "reconstituted_wood", description: "Reconstituted wood large packaging" },
                  { code: "50G", material: "rigid_fiberboard", description: "Rigid fiberboard large packaging" },
                  { code: "50H", material: "rigid_plastic", description: "Rigid plastic large packaging" },
                  { code: "50N", material: "other_metal", description: "Other metal large packaging" },
                ],
              },
            ],
          },
        },
        {
          id: "A5.12.2.large_robust",
          type: "specialized",
          description:
            "Large and robust articles transported unpacked in DOD-approved devices",
          innerPackaging: {
            required: false,
          },
          outerPackaging: {
            categories: [
              {
                type: "specialized",
                containers: [
                  {
                    code: "UNPACKED",
                    material: "none",
                    description:
                      "Unpacked transport in DOD-approved containers, crates, cradles, or handling devices",
                  },
                ],
              },
            ],
          },
          restrictions: [
            "Only for large and robust articles listed in A5.12.2",
            "Negative result required in UN Test Series 4",
            "Means of initiation absent or protected by at least two effective features",
          ],
        },
      ],

      referencedParagraphs: ["A5.12.1.", "A5.12.2."],
    },
  "A5.13.": {
    paragraphId: "A5.13.",
    hazardClass: 1,
    description: "Detonators, Electric",
    lastUpdated: new Date().toISOString(),
    entryType: "specialized",
    materialTypes: ["detonators_electric", "blasting_caps_electric"],

    packagingOptions: [
      {
        id: "A5.13.general",
        type: "combination",
        description:
          "Standard packaging for electric detonators with conditional inner packaging",
        innerPackaging: {
          required: false,
          materials: [
            "Paper bags",
            "Plastic bags",
            "Fiberboard receptacles",
            "Metal receptacles",
            "Plastic receptacles",
            "Wood receptacles",
            "Reels",
          ],
          specialRequirements: [
            "Inner packaging: Bags of paper or plastic",
            "OR Receptacles of fiberboard, metal, plastic, or wood",
            "OR Reels for wire management",
            "Inner packagings not required when detonators are packed in pasteboard tubes",
            "Inner packagings not required when leg wires are wound on spools with caps inside spool or securely taped to wire",
            "Spool packing must restrict movement of caps and protect from impact",
          ],
        },
        outerPackaging: {
          categories: [
            {
              type: "boxes",
              containers: [
                { code: "4A", material: "steel", description: "Steel box" },
                {
                  code: "4B",
                  material: "aluminum",
                  description: "Aluminum box",
                },
                {
                  code: "4N",
                  material: "other_metal",
                  description: "Other metal box",
                },
                {
                  code: "4C1",
                  material: "natural_wood",
                  description: "Ordinary natural wood box",
                },
                {
                  code: "4C2",
                  material: "natural_wood",
                  description: "Sift-proof natural wood box",
                },
                { code: "4D", material: "plywood", description: "Plywood box" },
                {
                  code: "4F",
                  material: "reconstituted_wood",
                  description: "Reconstituted wood box",
                },
                {
                  code: "4G",
                  material: "fiberboard",
                  description: "Fiberboard box",
                },
                {
                  code: "4H2",
                  material: "plastic",
                  description: "Solid plastic box",
                },
              ],
            },
            {
              type: "drums",
              containers: [
                { code: "1A1", material: "steel", description: "Steel drum" },
                {
                  code: "1A2",
                  material: "steel",
                  description: "Steel drum with removable head",
                },
                {
                  code: "1B1",
                  material: "aluminum",
                  description: "Aluminum drum",
                },
                {
                  code: "1B2",
                  material: "aluminum",
                  description: "Aluminum drum with removable head",
                },
                {
                  code: "1N1",
                  material: "other_metal",
                  description: "Other metal drum",
                },
                {
                  code: "1N2",
                  material: "other_metal",
                  description: "Other metal drum with removable head",
                },
                {
                  code: "1D",
                  material: "plywood",
                  description: "Plywood drum",
                },
                { code: "1G", material: "fiber", description: "Fiber drum" },
                {
                  code: "1H1",
                  material: "plastic",
                  description: "Plastic drum",
                },
                {
                  code: "1H2",
                  material: "plastic",
                  description: "Plastic drum with removable head",
                },
              ],
            },
          ],
        },
        notes: [
          "For electric detonators and blasting caps",
          "Special provisions for pasteboard tubes and spool packing",
          "Wire management critical for safety",
          "Impact protection required for caps",
        ],
      },
    ],

    specialRequirements: [
      {
        type: "pasteboard_tube_exception",
        description:
          "Inner packagings not required when detonators are packed in pasteboard tubes",
        mandatory: false,
        applicableContainers: ["A5.13.general"],
      },
      {
        type: "spool_packing_exception",
        description:
          "Inner packagings not required when leg wires are wound on spools with proper cap placement and securing",
        mandatory: false,
        applicableContainers: ["A5.13.general"],
      },
      {
        type: "wire_management",
        description:
          "Leg wires must be properly wound on spools with caps secured to prevent movement",
        mandatory: true,
        applicableContainers: ["A5.13.general"],
      },
      {
        type: "impact_protection",
        description:
          "Caps must be protected from impact forces through proper packing configuration",
        mandatory: true,
        applicableContainers: ["A5.13.general"],
      },
      {
        type: "movement_restriction",
        description:
          "Packing configuration must restrict free movement of detonator caps",
        mandatory: true,
        applicableContainers: ["A5.13.general"],
      },
    ],

    conditionalRequirements: [
      {
        condition: "pasteboard_tubes_used",
        conditionType: "packaging_type",
        operator: "contains",
        value: "pasteboard_tubes",
        effect: "modify",
        target: "inner_packaging_not_required",
        description:
          "Inner packagings not required when detonators are packed in pasteboard tubes",
      },
      {
        condition: "spool_packing_with_caps_inside",
        conditionType: "packaging_configuration",
        operator: "contains",
        value: "caps_inside_spool",
        effect: "modify",
        target: "inner_packaging_not_required",
        description:
          "Inner packagings not required when leg wires wound on spools with caps placed inside spool",
      },
      {
        condition: "spool_packing_with_taped_caps",
        conditionType: "packaging_configuration",
        operator: "contains",
        value: "caps_securely_taped_to_wire",
        effect: "modify",
        target: "inner_packaging_not_required",
        description:
          "Inner packagings not required when leg wires wound on spools with caps securely taped to wire on spool",
      },
      {
        condition: "wire_spool_configuration",
        conditionType: "packaging_configuration",
        operator: "contains",
        value: "wire_wound_on_spool",
        effect: "require",
        target: "movement_restriction_and_impact_protection",
        description:
          "Spool configuration must restrict cap movement and protect from impact",
      },
    ],

    referencedParagraphs: ["A5.13."],
  },
  "A5.14.": {
    paragraphId: "A5.14.",
    hazardClass: 1,
    description:
      "Detonators, Non-electric and Detonator Assemblies, Non-electric",
    lastUpdated: new Date().toISOString(),
    entryType: "specialized",
    materialTypes: [
      "detonators_non_electric",
      "detonator_assemblies_non_electric",
      "blasting_caps_non_electric",
    ],
    applicableUNNumbers: [
      "UN0360",
      "UN0361",
      "UN0500",
      "UN0029",
      "UN0267",
      "UN0455",
    ],

    packagingOptions: [
      {
        id: "A5.14.general",
        type: "combination",
        description:
          "Standard packaging for non-electric detonators with conditional inner packaging and UN-specific restrictions",
        innerPackaging: {
          required: false,
          materials: [
            "Paper bags",
            "Plastic bags",
            "Fiberboard receptacles",
            "Metal receptacles",
            "Plastic receptacles",
            "Wood receptacles",
            "Reels",
          ],
          specialRequirements: [
            "Inner packaging: Bags of paper or plastic",
            "OR Receptacles of fiberboard, metal, plastic, or wood",
            "OR Reels for detonating cord/shock tube management",
            "Inner packagings not required if packing configuration restricts free movement of caps and protects from impact forces",
            "For detonator assemblies (UN0360, 0361, 0500): detonators not required to be attached to safety fuse, metal clad mild detonating cord, detonating cord, or shock tube",
            "For UN0029, UN0267, and UN0455: do not use bags and reels as inner packagings",
          ],
        },
        outerPackaging: {
          categories: [
            {
              type: "boxes",
              containers: [
                { code: "4A", material: "steel", description: "Steel box" },
                {
                  code: "4B",
                  material: "aluminum",
                  description: "Aluminum box",
                },
                {
                  code: "4N",
                  material: "other_metal",
                  description: "Other metal box",
                },
                {
                  code: "4C1",
                  material: "natural_wood",
                  description: "Ordinary natural wood box",
                },
                {
                  code: "4C2",
                  material: "natural_wood",
                  description: "Sift-proof natural wood box",
                },
                { code: "4D", material: "plywood", description: "Plywood box" },
                {
                  code: "4F",
                  material: "reconstituted_wood",
                  description: "Reconstituted wood box",
                },
                {
                  code: "4G",
                  material: "fiberboard",
                  description: "Fiberboard box",
                },
                {
                  code: "4H2",
                  material: "plastic",
                  description: "Solid plastic box",
                },
              ],
            },
            {
              type: "drums",
              containers: [
                { code: "1A1", material: "steel", description: "Steel drum" },
                {
                  code: "1A2",
                  material: "steel",
                  description: "Steel drum with removable head",
                },
                {
                  code: "1B1",
                  material: "aluminum",
                  description: "Aluminum drum",
                },
                {
                  code: "1B2",
                  material: "aluminum",
                  description: "Aluminum drum with removable head",
                },
                {
                  code: "1N1",
                  material: "other_metal",
                  description: "Other metal drum",
                },
                {
                  code: "1N2",
                  material: "other_metal",
                  description: "Other metal drum with removable head",
                },
                {
                  code: "1D",
                  material: "plywood",
                  description: "Plywood drum",
                },
                { code: "1G", material: "fiber", description: "Fiber drum" },
                {
                  code: "1H1",
                  material: "plastic",
                  description: "Plastic drum",
                },
                {
                  code: "1H2",
                  material: "plastic",
                  description: "Plastic drum with removable head",
                },
              ],
            },
          ],
        },
        restrictions: [
          "Bags and reels prohibited as inner packaging for UN0029, UN0267, and UN0455",
        ],
        notes: [
          "For non-electric detonators and detonator assemblies",
          "Detonator assemblies may be shipped unattached to initiation devices",
          "Configuration-based inner packaging exemptions available",
          "UN-specific restrictions on certain inner packaging types",
        ],
      },
    ],

    specialRequirements: [
      {
        type: "assembly_attachment_flexibility",
        description:
          "For detonator assemblies (UN0360, 0361, 0500), detonators not required to be attached to safety fuse, detonating cord, or shock tube",
        mandatory: false,
        applicableContainers: ["A5.14.general"],
      },
      {
        type: "configuration_based_exemption",
        description:
          "Inner packagings not required if packing configuration restricts free movement of caps and protects from impact forces",
        mandatory: false,
        applicableContainers: ["A5.14.general"],
      },
      {
        type: "movement_restriction",
        description:
          "Packing configuration must restrict free movement of detonator caps when inner packaging is omitted",
        mandatory: true,
        applicableContainers: ["A5.14.general"],
      },
      {
        type: "impact_protection",
        description:
          "Caps must be protected from impact forces through proper packing configuration",
        mandatory: true,
        applicableContainers: ["A5.14.general"],
      },
      {
        type: "specific_un_restrictions",
        description:
          "Bags and reels prohibited as inner packaging for UN0029, UN0267, and UN0455",
        mandatory: true,
        applicableContainers: ["A5.14.general"],
      },
    ],

    packingGroupRestrictions: [
      {
        packingGroup: "all",
        restriction: "prohibited",
        description:
          "Bags and reels prohibited as inner packaging for UN0029, UN0267, and UN0455",
        conditions: ["UN0029", "UN0267", "UN0455"],
      },
    ],

    conditionalRequirements: [
      {
        condition: "detonator_assemblies_unattached",
        conditionType: "un_number",
        operator: "in_range",
        value: ["UN0360", "UN0361", "UN0500"],
        effect: "modify",
        target: "attachment_not_required",
        description:
          "For detonator assemblies, detonators not required to be attached to safety fuse, metal clad mild detonating cord, detonating cord, or shock tube",
      },
      {
        condition: "configuration_restricts_movement",
        conditionType: "packaging_configuration",
        operator: "contains",
        value: "movement_restricted_impact_protected",
        effect: "modify",
        target: "inner_packaging_not_required",
        description:
          "Inner packagings not required if packing configuration restricts free movement of caps and protects from impact forces",
      },
      {
        condition: "specific_un_bag_reel_prohibition",
        conditionType: "un_number",
        operator: "in_range",
        value: ["UN0029", "UN0267", "UN0455"],
        effect: "prohibit",
        target: "bags_and_reels_inner_packaging",
        description:
          "Bags and reels prohibited as inner packaging for UN0029, UN0267, and UN0455",
      },
    ],

    referencedParagraphs: ["A5.14."],
  },
  "A5.15.": {
    paragraphId: "A5.15.",
    hazardClass: 1,
    description: "Boosters and Charges, Supplementary Explosive",
    lastUpdated: new Date().toISOString(),
    entryType: "specialized",
    materialTypes: [
      "boosters_explosive",
      "charges_supplementary_explosive",
      "shaped_charges",
      "demolition_charges",
    ],

    packagingOptions: [
      {
        id: "A5.15.1.closed_casing",
        type: "single",
        description:
          "Articles with closed metal, plastic, or fiberboard casing (no inner packaging required)",
        innerPackaging: {
          required: false,
        },
        outerPackaging: {
          categories: [
            {
              type: "boxes",
              containers: [
                { code: "4A", material: "steel", description: "Steel box" },
                {
                  code: "4B",
                  material: "aluminum",
                  description: "Aluminum box",
                },
                {
                  code: "4N",
                  material: "other_metal",
                  description: "Other metal box",
                },
                {
                  code: "4C1",
                  material: "natural_wood",
                  description: "Ordinary natural wood box",
                },
                {
                  code: "4C2",
                  material: "natural_wood",
                  description: "Sift-proof natural wood box",
                },
                { code: "4D", material: "plywood", description: "Plywood box" },
                {
                  code: "4F",
                  material: "reconstituted_wood",
                  description: "Reconstituted wood box",
                },
                {
                  code: "4G",
                  material: "fiberboard",
                  description: "Fiberboard box",
                },
                {
                  code: "4H2",
                  material: "plastic",
                  description: "Solid plastic box",
                },
              ],
            },
          ],
        },
        restrictions: [
          "Only for articles with closed metal, plastic, or fiberboard casing",
        ],
        notes: [
          "For boosters and charges with protective casings",
          "Casing provides sufficient protection - no inner packaging needed",
          "Box packaging only - drums not authorized",
        ],
      },
      {
        id: "A5.15.2.without_casing",
        type: "combination",
        description:
          "Articles without closed casings (combination packaging required)",
        innerPackaging: {
          required: true,
          materials: [
            "Fiberboard receptacles",
            "Metal receptacles",
            "Plastic receptacles",
            "Wood receptacles",
            "Paper sheets",
            "Plastic sheets",
          ],
          specialRequirements: [
            "Inner packaging: Receptacles of fiberboard, metal, plastic, or wood",
            "OR Sheets of paper or plastic",
            "Required for articles without protective casings",
            "Provides necessary containment and protection",
          ],
        },
        outerPackaging: {
          categories: [
            {
              type: "boxes",
              containers: [
                { code: "4A", material: "steel", description: "Steel box" },
                {
                  code: "4B",
                  material: "aluminum",
                  description: "Aluminum box",
                },
                {
                  code: "4N",
                  material: "other_metal",
                  description: "Other metal box",
                },
                {
                  code: "4C1",
                  material: "natural_wood",
                  description: "Ordinary natural wood box",
                },
                {
                  code: "4C2",
                  material: "natural_wood",
                  description: "Sift-proof natural wood box",
                },
                { code: "4D", material: "plywood", description: "Plywood box" },
                {
                  code: "4F",
                  material: "reconstituted_wood",
                  description: "Reconstituted wood box",
                },
                {
                  code: "4G",
                  material: "fiberboard",
                  description: "Fiberboard box",
                },
                {
                  code: "4H2",
                  material: "plastic",
                  description: "Solid plastic box",
                },
              ],
            },
          ],
        },
        restrictions: ["Only for articles without closed casings"],
        notes: [
          "For boosters and charges without protective casings",
          "Inner packaging mandatory for unprotected explosive materials",
          "Box packaging only - drums not authorized",
        ],
      },
    ],

    specialRequirements: [
      {
        type: "casing_based_packaging",
        description:
          "Packaging requirements determined by presence or absence of closed casing",
        mandatory: true,
        applicableContainers: ["all"],
      },
      {
        type: "closed_casing_criteria",
        description:
          "Closed casings must be metal, plastic, or fiberboard to qualify for simplified packaging",
        mandatory: true,
        applicableContainers: ["A5.15.1.closed_casing"],
      },
      {
        type: "box_packaging_only",
        description: "Only box packaging authorized - drums not permitted",
        mandatory: true,
        applicableContainers: ["all"],
      },
      {
        type: "containment_protection",
        description:
          "Inner packaging required for articles without casings to provide containment and protection",
        mandatory: true,
        applicableContainers: ["A5.15.2.without_casing"],
      },
    ],

    conditionalRequirements: [
      {
        condition: "closed_casing_present",
        conditionType: "material_state",
        operator: "contains",
        value: "closed_casing_metal_plastic_fiberboard",
        effect: "modify",
        target: "inner_packaging_not_required",
        description:
          "Inner packaging not required for articles with closed metal, plastic, or fiberboard casing",
      },
      {
        condition: "no_closed_casing",
        conditionType: "material_state",
        operator: "not_contains",
        value: "closed_casing",
        effect: "require",
        target: "inner_packaging_mandatory",
        description:
          "Inner packaging required for articles without closed casings",
      },
      {
        condition: "casing_material_verification",
        conditionType: "material_state",
        operator: "contains",
        value: "closed_casing",
        effect: "require",
        target: "casing_material_metal_plastic_fiberboard",
        description:
          "Closed casings must be metal, plastic, or fiberboard material",
      },
    ],

    referencedParagraphs: ["A5.15.1.", "A5.15.2."],
  },
  "A5.16.": {
    paragraphId: "A5.16.",
    hazardClass: 1,
    description:
      "Boosters with Detonator; Bursters; Detonators for Ammunition; Grenades, Empty Primed; Primers, Cap Type; Primers, Tubular; and Tracers for Ammunition",
    lastUpdated: new Date().toISOString(),
    entryType: "specialized",
    materialTypes: [
      "boosters_with_detonator",
      "bursters",
      "detonators_ammunition",
      "grenades_empty_primed",
      "primers_cap_type",
      "primers_tubular",
      "tracers_ammunition",
    ],
    applicableUNNumbers: ["UN0043", "UN0212", "UN0225", "UN0268", "UN0306"],

    packagingOptions: [
      {
        id: "A5.16.general",
        type: "combination",
        description:
          "Three-tier packaging system for ammunition components with conditional intermediate packaging",
        innerPackaging: {
          required: true,
          materials: [
            "Fiberboard receptacles",
            "Metal receptacles",
            "Plastic receptacles",
            "Wood receptacles",
            "Fiberboard trays with dividing partitions",
            "Plastic trays with dividing partitions",
            "Wood trays with dividing partitions",
          ],
          specialRequirements: [
            "Inner packaging: Receptacles of fiberboard, metal, plastic, or wood",
            "OR Trays fitted with dividing partitions of fiberboard, plastic, or wood",
            "Trays prohibited for UN0043, 0212, 0225, 0268, and 0306",
            "Intermediate packaging: Receptacles of fiberboard, metal, plastic, or wood",
            "Intermediate packaging only required when trays are used as inner packaging",
          ],
        },
        outerPackaging: {
          categories: [
            {
              type: "boxes",
              containers: [
                { code: "4A", material: "steel", description: "Steel box" },
                {
                  code: "4B",
                  material: "aluminum",
                  description: "Aluminum box",
                },
                {
                  code: "4N",
                  material: "other_metal",
                  description: "Other metal box",
                },
                {
                  code: "4C1",
                  material: "natural_wood",
                  description: "Ordinary natural wood box",
                },
                {
                  code: "4C2",
                  material: "natural_wood",
                  description: "Sift-proof natural wood box",
                },
                { code: "4D", material: "plywood", description: "Plywood box" },
                {
                  code: "4F",
                  material: "reconstituted_wood",
                  description: "Reconstituted wood box",
                },
                {
                  code: "4G",
                  material: "fiberboard",
                  description: "Fiberboard box",
                },
                {
                  code: "4H2",
                  material: "plastic",
                  description: "Solid plastic box",
                },
              ],
            },
          ],
        },
        restrictions: [
          "Trays prohibited for UN0043, 0212, 0225, 0268, and 0306",
          "Box packaging only - drums not authorized",
        ],
        notes: [
          "For ammunition components and primers",
          "Trays with dividing partitions provide organized storage",
          "Intermediate packaging required only when trays are used",
          "Box packaging only",
        ],
      },
    ],

    specialRequirements: [
      {
        type: "tray_dividing_partitions",
        description:
          "Trays must be fitted with dividing partitions for proper component separation",
        mandatory: true,
        applicableContainers: ["A5.16.general"],
      },
      {
        type: "tray_prohibition_specific_uns",
        description: "Trays prohibited for UN0043, 0212, 0225, 0268, and 0306",
        mandatory: true,
        applicableContainers: ["A5.16.general"],
      },
      {
        type: "conditional_intermediate_packaging",
        description:
          "Intermediate packaging only required when trays are used as inner packaging",
        mandatory: false,
        applicableContainers: ["A5.16.general"],
      },
      {
        type: "box_packaging_only",
        description: "Only box packaging authorized - drums not permitted",
        mandatory: true,
        applicableContainers: ["A5.16.general"],
      },
      {
        type: "component_organization",
        description:
          "Packaging must provide proper organization and separation of ammunition components",
        mandatory: true,
        applicableContainers: ["A5.16.general"],
      },
    ],

    packingGroupRestrictions: [
      {
        packingGroup: "all",
        restriction: "prohibited",
        description: "Trays prohibited for UN0043, 0212, 0225, 0268, and 0306",
        conditions: ["UN0043", "UN0212", "UN0225", "UN0268", "UN0306"],
      },
    ],

    conditionalRequirements: [
      {
        condition: "tray_inner_packaging_used",
        conditionType: "packaging_configuration",
        operator: "contains",
        value: "trays_with_dividing_partitions",
        effect: "require",
        target: "intermediate_packaging",
        description:
          "Intermediate packaging required when trays are used as inner packaging",
      },
      {
        condition: "receptacle_inner_packaging_used",
        conditionType: "packaging_configuration",
        operator: "contains",
        value: "receptacles_inner",
        effect: "modify",
        target: "intermediate_packaging_not_required",
        description:
          "Intermediate packaging not required when receptacles are used as inner packaging",
      },
      {
        condition: "specific_un_tray_prohibition",
        conditionType: "un_number",
        operator: "in_range",
        value: ["UN0043", "UN0212", "UN0225", "UN0268", "UN0306"],
        effect: "prohibit",
        target: "tray_inner_packaging",
        description:
          "Trays prohibited as inner packaging for UN0043, 0212, 0225, 0268, and 0306",
      },
      {
        condition: "tray_dividing_partitions_required",
        conditionType: "packaging_configuration",
        operator: "contains",
        value: "trays",
        effect: "require",
        target: "dividing_partitions",
        description: "Trays must be fitted with dividing partitions",
      },
    ],

    referencedParagraphs: ["A5.16."],
  },
  "A5.17.": {
    paragraphId: "A5.17.",
    hazardClass: 1,
    description:
      "Cutters, Cable, Explosive; Cartridges, Power Device; Cartridges, Oil Well; Fracturing Devices, Explosive; Release Devices, Explosive; Rivets, Explosive; and Sounding Devices, Explosive",
    lastUpdated: new Date().toISOString(),
    entryType: "specialized",
    materialTypes: [
      "cutters_cable_explosive",
      "cartridges_power_device",
      "cartridges_oil_well",
      "fracturing_devices_explosive",
      "release_devices_explosive",
      "rivets_explosive",
      "sounding_devices_explosive",
    ],

    packagingOptions: [
      {
        id: "A5.17.general",
        type: "combination",
        description:
          "Standard packaging for industrial explosive devices with diverse inner packaging options",
        innerPackaging: {
          required: true,
          materials: [
            "Water resistant bags",
            "Fiberboard receptacles",
            "Metal receptacles",
            "Plastic receptacles",
            "Wood receptacles",
            "Corrugated fiberboard sheets",
            "Fiberboard tubes",
          ],
          specialRequirements: [
            "Inner packaging: Bags of water resistant material",
            "OR Receptacles of fiberboard, metal, plastic, or wood",
            "OR Sheets of corrugated fiberboard",
            "OR Tubes of fiberboard",
            "Water resistance required for bag materials",
            "Corrugated fiberboard provides structural protection",
            "Tubes suitable for elongated explosive devices",
          ],
        },
        outerPackaging: {
          categories: [
            {
              type: "boxes",
              containers: [
                { code: "4A", material: "steel", description: "Steel box" },
                {
                  code: "4B",
                  material: "aluminum",
                  description: "Aluminum box",
                },
                {
                  code: "4N",
                  material: "other_metal",
                  description: "Other metal box",
                },
                {
                  code: "4C1",
                  material: "natural_wood",
                  description: "Ordinary natural wood box",
                },
                {
                  code: "4C2",
                  material: "natural_wood",
                  description: "Sift-proof natural wood box",
                },
                { code: "4D", material: "plywood", description: "Plywood box" },
                {
                  code: "4F",
                  material: "reconstituted_wood",
                  description: "Reconstituted wood box",
                },
                {
                  code: "4G",
                  material: "fiberboard",
                  description: "Fiberboard box",
                },
                {
                  code: "4H1",
                  material: "plastic",
                  description: "Expanded plastic box",
                },
                {
                  code: "4H2",
                  material: "plastic",
                  description: "Solid plastic box",
                },
              ],
            },
            {
              type: "drums",
              containers: [
                { code: "1A1", material: "steel", description: "Steel drum" },
                {
                  code: "1A2",
                  material: "steel",
                  description: "Steel drum with removable head",
                },
                {
                  code: "1B1",
                  material: "aluminum",
                  description: "Aluminum drum",
                },
                {
                  code: "1B2",
                  material: "aluminum",
                  description: "Aluminum drum with removable head",
                },
                {
                  code: "1N1",
                  material: "other_metal",
                  description: "Other metal drum",
                },
                {
                  code: "1N2",
                  material: "other_metal",
                  description: "Other metal drum with removable head",
                },
                {
                  code: "1D",
                  material: "plywood",
                  description: "Plywood drum",
                },
                { code: "1G", material: "fiber", description: "Fiber drum" },
                {
                  code: "1H1",
                  material: "plastic",
                  description: "Plastic drum",
                },
                {
                  code: "1H2",
                  material: "plastic",
                  description: "Plastic drum with removable head",
                },
              ],
            },
          ],
        },
        notes: [
          "For industrial explosive devices and tools",
          "Includes expanded plastic boxes (4H1) - first entry to authorize",
          "Tubes accommodate elongated devices like cable cutters",
          "Water resistant bags protect against moisture",
          "Both boxes and drums authorized",
        ],
      },
    ],

    specialRequirements: [
      {
        type: "water_resistance",
        description:
          "Bags must be water resistant to protect explosive devices from moisture",
        mandatory: true,
        applicableContainers: ["A5.17.general"],
      },
      {
        type: "corrugated_fiberboard_protection",
        description:
          "Corrugated fiberboard sheets provide structural protection for devices",
        mandatory: false,
        applicableContainers: ["A5.17.general"],
      },
      {
        type: "tube_packaging_elongated_devices",
        description:
          "Fiberboard tubes suitable for elongated explosive devices like cable cutters",
        mandatory: false,
        applicableContainers: ["A5.17.general"],
      },
      {
        type: "expanded_plastic_authorization",
        description:
          "Expanded plastic boxes (4H1) authorized for industrial explosive devices",
        mandatory: false,
        applicableContainers: ["A5.17.general"],
      },
      {
        type: "industrial_device_protection",
        description:
          "Packaging must protect industrial explosive devices from environmental factors and impact",
        mandatory: true,
        applicableContainers: ["A5.17.general"],
      },
    ],

    conditionalRequirements: [
      {
        condition: "water_resistant_bags_used",
        conditionType: "packaging_configuration",
        operator: "contains",
        value: "water_resistant_bags",
        effect: "require",
        target: "water_resistance_verification",
        description:
          "Bags must be verified as water resistant when used for inner packaging",
      },
      {
        condition: "elongated_device_shape",
        conditionType: "material_state",
        operator: "contains",
        value: "elongated_explosive_device",
        effect: "recommend",
        target: "tube_packaging",
        description:
          "Tube packaging recommended for elongated devices like cable cutters",
      },
      {
        condition: "moisture_sensitive_devices",
        conditionType: "material_state",
        operator: "contains",
        value: "moisture_sensitive",
        effect: "require",
        target: "water_resistant_protection",
        description:
          "Water resistant protection required for moisture-sensitive devices",
      },
      {
        condition: "structural_protection_needed",
        conditionType: "material_state",
        operator: "contains",
        value: "requires_structural_support",
        effect: "recommend",
        target: "corrugated_fiberboard_sheets",
        description:
          "Corrugated fiberboard sheets recommended for devices requiring structural protection",
      },
    ],

    referencedParagraphs: ["A5.17."],
  },
  "A5.18.": {
    paragraphId: "A5.18.",
    hazardClass: 1,
    description:
      "Air Bag Inflators; Air Bag Modules; Articles, Pyrotechnic; Cartridges, Flash; Cartridges, Signal; Fireworks; Flares, Aerial; Flares, Surface; Seat-Belt Pretensioners; Signal Devices, Hand; Signals, Distress; Signals, Smoke; and Signals, Railway Track, Explosive",
    lastUpdated: new Date().toISOString(),
    entryType: "specialized",
    materialTypes: [
      "airbag_inflators",
      "airbag_modules",
      "pyrotechnic_articles",
      "cartridges_flash",
      "cartridges_signal",
      "fireworks",
      "flares_aerial",
      "flares_surface",
      "seatbelt_pretensioners",
      "signal_devices_hand",
      "signals_distress",
      "signals_smoke",
      "signals_railway_track",
    ],

    packagingOptions: [
      {
        id: "A5.18.general",
        type: "combination",
        description:
          "Standard packaging for pyrotechnic devices and automotive safety systems",
        innerPackaging: {
          required: true,
          materials: [
            "Paper bags",
            "Plastic bags",
            "Fiberboard receptacles",
            "Metal receptacles",
            "Plastic receptacles",
            "Wood receptacles",
            "Paper sheets",
            "Plastic sheets",
          ],
          specialRequirements: [
            "Inner packaging: Bags of paper or plastic",
            "OR Receptacles of fiberboard, metal, plastic, or wood",
            "OR Sheets of paper or plastic",
            "Simple materials suitable for pyrotechnic devices",
            "Paper and plastic options provide basic protection",
            "Sheets suitable for flat pyrotechnic articles",
          ],
        },
        outerPackaging: {
          categories: [
            {
              type: "boxes",
              containers: [
                { code: "4A", material: "steel", description: "Steel box" },
                {
                  code: "4B",
                  material: "aluminum",
                  description: "Aluminum box",
                },
                {
                  code: "4N",
                  material: "other_metal",
                  description: "Other metal box",
                },
                {
                  code: "4C1",
                  material: "natural_wood",
                  description: "Ordinary natural wood box",
                },
                {
                  code: "4C2",
                  material: "natural_wood",
                  description: "Sift-proof natural wood box",
                },
                { code: "4D", material: "plywood", description: "Plywood box" },
                {
                  code: "4F",
                  material: "reconstituted_wood",
                  description: "Reconstituted wood box",
                },
                {
                  code: "4G",
                  material: "fiberboard",
                  description: "Fiberboard box",
                },
                {
                  code: "4H1",
                  material: "plastic",
                  description: "Expanded plastic box",
                },
                {
                  code: "4H2",
                  material: "plastic",
                  description: "Solid plastic box",
                },
              ],
            },
            {
              type: "drums",
              containers: [
                { code: "1A1", material: "steel", description: "Steel drum" },
                {
                  code: "1A2",
                  material: "steel",
                  description: "Steel drum with removable head",
                },
                {
                  code: "1B1",
                  material: "aluminum",
                  description: "Aluminum drum",
                },
                {
                  code: "1B2",
                  material: "aluminum",
                  description: "Aluminum drum with removable head",
                },
                {
                  code: "1N1",
                  material: "other_metal",
                  description: "Other metal drum",
                },
                {
                  code: "1N2",
                  material: "other_metal",
                  description: "Other metal drum with removable head",
                },
                {
                  code: "1D",
                  material: "plywood",
                  description: "Plywood drum",
                },
                { code: "1G", material: "fiber", description: "Fiber drum" },
                {
                  code: "1H1",
                  material: "plastic",
                  description: "Plastic drum",
                },
                {
                  code: "1H2",
                  material: "plastic",
                  description: "Plastic drum with removable head",
                },
              ],
            },
          ],
        },
        notes: [
          "For pyrotechnic devices and automotive safety systems",
          "Includes airbag inflators, fireworks, flares, and signal devices",
          "Both expanded (4H1) and solid (4H2) plastic boxes authorized",
          "Simple inner packaging materials suitable for pyrotechnic articles",
          "Both boxes and drums authorized",
        ],
      },
    ],

    specialRequirements: [
      {
        type: "pyrotechnic_device_protection",
        description:
          "Packaging must protect pyrotechnic devices from accidental activation and environmental factors",
        mandatory: true,
        applicableContainers: ["A5.18.general"],
      },
      {
        type: "automotive_safety_system_transport",
        description:
          "Special considerations for airbag inflators and seat-belt pretensioners in transport",
        mandatory: true,
        applicableContainers: ["A5.18.general"],
      },
      {
        type: "fireworks_signal_device_containment",
        description:
          "Proper containment for fireworks and various signal devices",
        mandatory: true,
        applicableContainers: ["A5.18.general"],
      },
      {
        type: "simple_inner_packaging",
        description:
          "Simple paper and plastic materials sufficient for pyrotechnic article protection",
        mandatory: false,
        applicableContainers: ["A5.18.general"],
      },
      {
        type: "expanded_plastic_suitability",
        description:
          "Expanded plastic boxes suitable for lightweight pyrotechnic devices",
        mandatory: false,
        applicableContainers: ["A5.18.general"],
      },
    ],

    conditionalRequirements: [
      {
        condition: "automotive_safety_systems",
        conditionType: "material_state",
        operator: "contains",
        value: "automotive_safety_system",
        effect: "require",
        target: "enhanced_protection_transport",
        description:
          "Enhanced protection required for airbag inflators and seat-belt pretensioners during transport",
      },
      {
        condition: "fireworks_packaging",
        conditionType: "material_state",
        operator: "contains",
        value: "fireworks",
        effect: "require",
        target: "accidental_activation_prevention",
        description:
          "Packaging must prevent accidental activation of fireworks during transport",
      },
      {
        condition: "signal_device_protection",
        conditionType: "material_state",
        operator: "contains",
        value: "signal_device",
        effect: "require",
        target: "environmental_protection",
        description:
          "Signal devices require protection from environmental factors that could cause activation",
      },
      {
        condition: "lightweight_pyrotechnic_articles",
        conditionType: "material_state",
        operator: "contains",
        value: "lightweight_pyrotechnic",
        effect: "recommend",
        target: "expanded_plastic_boxes",
        description:
          "Expanded plastic boxes recommended for lightweight pyrotechnic articles",
      },
    ],

    referencedParagraphs: ["A5.18."],
  },
  "A5.19.": {
    paragraphId: "A5.19.",
    hazardClass: 1,
    description:
      "Cases, Cartridge, Empty with Primer; and Cases, Combustible, Empty, without Primer",
    lastUpdated: new Date().toISOString(),
    entryType: "specialized",
    materialTypes: [
      "cartridge_cases_empty_with_primer",
      "combustible_cases_empty_without_primer",
    ],

    packagingOptions: [
      {
        id: "A5.19.general",
        type: "combination",
        description: "Standard packaging for empty cartridge cases",
        innerPackaging: {
          required: true,
          materials: [
            "Plastic bags",
            "Textile bags",
            "Fiberboard boxes",
            "Plastic boxes",
            "Wood boxes",
            "Dividing partitions within outer packaging",
          ],
          description:
            "Multiple inner packaging options for empty cartridge cases",
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "boxes",
              subtype: "standard",
              containers: [
                { code: "4A", material: "steel", description: "Steel boxes" },
                {
                  code: "4B",
                  material: "aluminum",
                  description: "Aluminum boxes",
                },
                {
                  code: "4C1",
                  material: "wood",
                  description: "Ordinary natural wood boxes",
                },
                {
                  code: "4C2",
                  material: "wood",
                  description: "Sift-proof natural wood boxes",
                },
                { code: "4D", material: "wood", description: "Plywood boxes" },
                {
                  code: "4F",
                  material: "wood",
                  description: "Reconstituted wood boxes",
                },
                {
                  code: "4G",
                  material: "fiberboard",
                  description: "Fiberboard boxes",
                },
                {
                  code: "4H2",
                  material: "plastic",
                  description: "Solid plastic boxes",
                },
                {
                  code: "4N",
                  material: "metal",
                  description: "Other metal boxes",
                },
              ],
            },
            {
              type: "drums",
              subtype: "standard",
              containers: [
                {
                  code: "1A1",
                  material: "steel",
                  description: "Steel drums, non-removable head",
                },
                {
                  code: "1A2",
                  material: "steel",
                  description: "Steel drums, removable head",
                },
                {
                  code: "1B1",
                  material: "aluminum",
                  description: "Aluminum drums, non-removable head",
                },
                {
                  code: "1B2",
                  material: "aluminum",
                  description: "Aluminum drums, removable head",
                },
                { code: "1D", material: "wood", description: "Plywood drums" },
                { code: "1G", material: "fiber", description: "Fiber drums" },
                {
                  code: "1H1",
                  material: "plastic",
                  description: "Plastic drums, non-removable head",
                },
                {
                  code: "1H2",
                  material: "plastic",
                  description: "Plastic drums, removable head",
                },
                {
                  code: "1N1",
                  material: "metal",
                  description: "Other metal drums, non-removable head",
                },
                {
                  code: "1N2",
                  material: "metal",
                  description: "Other metal drums, removable head",
                },
              ],
            },
          ],
        },
        restrictions: [],
        isComplete: true,
      },
    ],

    specialRequirements: [
      {
        type: "empty_cartridge_case_handling",
        description:
          "Special handling requirements for empty cartridge cases with or without primer",
        mandatory: true,
        applicableContainers: ["A5.19.general"],
      },
      {
        type: "primer_presence_consideration",
        description: "Different handling requirements based on primer presence",
        mandatory: true,
        applicableContainers: ["A5.19.general"],
      },
      {
        type: "textile_bag_option",
        description:
          "Textile bags as alternative to plastic bags for inner packaging",
        mandatory: false,
        applicableContainers: ["A5.19.general"],
      },
      {
        type: "dividing_partition_option",
        description:
          "Dividing partitions within outer packaging as alternative to bags/boxes",
        mandatory: false,
        applicableContainers: ["A5.19.general"],
      },
      {
        type: "comprehensive_outer_container_selection",
        description:
          "Wide range of outer packaging options including boxes and drums",
        mandatory: false,
        applicableContainers: ["A5.19.general"],
      },
    ],

    conditionalRequirements: [
      {
        condition: "material_type='cartridge_cases_empty_with_primer'",
        requirements: [
          {
            type: "primer_safety_handling",
            description: "Enhanced safety requirements for cases with primer",
            mandatory: true,
            applicableContainers: ["A5.19.general"],
          },
        ],
      },
      {
        condition: "material_type='combustible_cases_empty_without_primer'",
        requirements: [
          {
            type: "combustible_material_handling",
            description:
              "Special handling for combustible cases without primer",
            mandatory: true,
            applicableContainers: ["A5.19.general"],
          },
        ],
      },
    ],

    referencedParagraphs: ["A5.19."],
  },
  "A5.20.": {
    paragraphId: "A5.20.",
    hazardClass: 1,
    description: "Charges, Shaped; or charges, Explosive, Commercial",
    lastUpdated: new Date().toISOString(),
    entryType: "specialized",
    materialTypes: ["charges_shaped", "charges_explosive_commercial"],

    packagingOptions: [
      {
        id: "A5.20.general",
        type: "combination",
        description:
          "Standard packaging for shaped charges and commercial explosive charges",
        innerPackaging: {
          required: true,
          materials: [
            "Plastic bags",
            "Fiberboard boxes",
            "Wood boxes",
            "Fiberboard tubes",
            "Metal tubes",
            "Plastic tubes",
            "Dividing partitions within outer packaging",
          ],
          description:
            "Multiple inner packaging options for shaped and explosive charges",
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "boxes",
              subtype: "standard",
              containers: [
                { code: "4A", material: "steel", description: "Steel boxes" },
                {
                  code: "4B",
                  material: "aluminum",
                  description: "Aluminum boxes",
                },
                {
                  code: "4C1",
                  material: "wood",
                  description: "Ordinary natural wood boxes",
                },
                {
                  code: "4C2",
                  material: "wood",
                  description: "Sift-proof natural wood boxes",
                },
                { code: "4D", material: "wood", description: "Plywood boxes" },
                {
                  code: "4F",
                  material: "wood",
                  description: "Reconstituted wood boxes",
                },
                {
                  code: "4G",
                  material: "fiberboard",
                  description: "Fiberboard boxes",
                },
                {
                  code: "4H2",
                  material: "plastic",
                  description: "Solid plastic boxes",
                },
                {
                  code: "4N",
                  material: "metal",
                  description: "Other metal boxes",
                },
              ],
            },
            {
              type: "drums",
              subtype: "standard",
              containers: [
                {
                  code: "1A1",
                  material: "steel",
                  description: "Steel drums, non-removable head",
                },
                {
                  code: "1A2",
                  material: "steel",
                  description: "Steel drums, removable head",
                },
                {
                  code: "1B1",
                  material: "aluminum",
                  description: "Aluminum drums, non-removable head",
                },
                {
                  code: "1B2",
                  material: "aluminum",
                  description: "Aluminum drums, removable head",
                },
                { code: "1D", material: "wood", description: "Plywood drums" },
                { code: "1G", material: "fiber", description: "Fiber drums" },
                {
                  code: "1H1",
                  material: "plastic",
                  description: "Plastic drums, non-removable head",
                },
                {
                  code: "1H2",
                  material: "plastic",
                  description: "Plastic drums, removable head",
                },
                {
                  code: "1N1",
                  material: "metal",
                  description: "Other metal drums, non-removable head",
                },
                {
                  code: "1N2",
                  material: "metal",
                  description: "Other metal drums, removable head",
                },
              ],
            },
          ],
        },
        restrictions: [],
        isComplete: true,
      },
    ],

    specialRequirements: [
      {
        type: "shaped_charge_orientation_single",
        description:
          "For UN0059, 0439, 0440, and 0441, when shaped charges are packed singly, the conical cavity must face downwards and the package marked with orientation markings meeting the requirements of 49 CFR Subparagraph 172.312(a)(2) (T-0)",
        mandatory: true,
        applicableContainers: ["A5.20.general"],
      },
      {
        type: "shaped_charge_orientation_pairs",
        description:
          "When shaped charges are packed in pairs, the conical cavities must face inwards (T-0)",
        mandatory: true,
        applicableContainers: ["A5.20.general"],
      },
      {
        type: "commercial_explosive_charge_handling",
        description:
          "Special handling requirements for commercial explosive charges",
        mandatory: true,
        applicableContainers: ["A5.20.general"],
      },
      {
        type: "tube_packaging_option",
        description:
          "Tubes (fiberboard, metal, plastic) as specialized inner packaging option",
        mandatory: false,
        applicableContainers: ["A5.20.general"],
      },
      {
        type: "dividing_partition_alternative",
        description:
          "Dividing partitions within outer packaging as alternative to bags/boxes/tubes",
        mandatory: false,
        applicableContainers: ["A5.20.general"],
      },
    ],

    conditionalRequirements: [
      {
        condition: "un_number IN ('UN0059', 'UN0439', 'UN0440', 'UN0441')",
        requirements: [
          {
            type: "orientation_marking_requirement",
            description:
              "Orientation markings required per 49 CFR Subparagraph 172.312(a)(2) for specific UN numbers",
            mandatory: true,
            applicableContainers: ["A5.20.general"],
          },
        ],
      },
      {
        condition: "material_type='charges_shaped'",
        requirements: [
          {
            type: "conical_cavity_orientation",
            description:
              "Specific orientation requirements for shaped charges based on packing configuration",
            mandatory: true,
            applicableContainers: ["A5.20.general"],
          },
        ],
      },
      {
        condition: "material_type='charges_explosive_commercial'",
        requirements: [
          {
            type: "commercial_explosive_regulations",
            description:
              "Commercial explosive charge specific regulatory compliance",
            mandatory: true,
            applicableContainers: ["A5.20.general"],
          },
        ],
      },
    ],

    referencedParagraphs: ["A5.20."],
  },
  "A5.21.": {
    paragraphId: "A5.21.",
    hazardClass: 1,
    description: "Charges, Shaped, Flexible, Linear",
    lastUpdated: new Date().toISOString(),
    entryType: "specialized",
    materialTypes: ["charges_shaped_flexible_linear"],

    packagingOptions: [
      {
        id: "A5.21.general",
        type: "combination",
        description: "Standard packaging for flexible linear shaped charges",
        innerPackaging: {
          required: false,
          materials: ["Plastic bags"],
          description:
            "Inner packaging not required if ends of articles are sealed",
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "boxes",
              subtype: "standard",
              containers: [
                { code: "4A", material: "steel", description: "Steel boxes" },
                {
                  code: "4B",
                  material: "aluminum",
                  description: "Aluminum boxes",
                },
                {
                  code: "4C1",
                  material: "wood",
                  description: "Ordinary natural wood boxes",
                },
                {
                  code: "4C2",
                  material: "wood",
                  description: "Sift-proof natural wood boxes",
                },
                { code: "4D", material: "wood", description: "Plywood boxes" },
                {
                  code: "4F",
                  material: "wood",
                  description: "Reconstituted wood boxes",
                },
                {
                  code: "4G",
                  material: "fiberboard",
                  description: "Fiberboard boxes",
                },
                {
                  code: "4H2",
                  material: "plastic",
                  description: "Solid plastic boxes",
                },
                {
                  code: "4N",
                  material: "metal",
                  description: "Other metal boxes",
                },
              ],
            },
            {
              type: "drums",
              subtype: "standard",
              containers: [
                {
                  code: "1A1",
                  material: "steel",
                  description: "Steel drums, non-removable head",
                },
                {
                  code: "1A2",
                  material: "steel",
                  description: "Steel drums, removable head",
                },
                {
                  code: "1B1",
                  material: "aluminum",
                  description: "Aluminum drums, non-removable head",
                },
                {
                  code: "1B2",
                  material: "aluminum",
                  description: "Aluminum drums, removable head",
                },
                { code: "1G", material: "fiber", description: "Fiber drums" },
                {
                  code: "1H1",
                  material: "plastic",
                  description: "Plastic drums, non-removable head",
                },
                {
                  code: "1H2",
                  material: "plastic",
                  description: "Plastic drums, removable head",
                },
                {
                  code: "1N1",
                  material: "metal",
                  description: "Other metal drums, non-removable head",
                },
                {
                  code: "1N2",
                  material: "metal",
                  description: "Other metal drums, removable head",
                },
              ],
            },
          ],
        },
        restrictions: [],
        isComplete: true,
      },
    ],

    specialRequirements: [
      {
        type: "flexible_linear_shaped_charge_handling",
        description:
          "Special handling requirements for flexible linear shaped charges",
        mandatory: true,
        applicableContainers: ["A5.21.general"],
      },
      {
        type: "sealed_ends_inner_packaging_exemption",
        description:
          "If ends of articles are sealed, inner packaging is not required",
        mandatory: true,
        applicableContainers: ["A5.21.general"],
      },
      {
        type: "simplified_inner_packaging",
        description:
          "Only plastic bags required for inner packaging when needed",
        mandatory: false,
        applicableContainers: ["A5.21.general"],
      },
      {
        type: "no_plywood_drums",
        description:
          "Plywood drums not included in drum options for flexible linear charges",
        mandatory: false,
        applicableContainers: ["A5.21.general"],
      },
    ],

    conditionalRequirements: [
      {
        condition: "article_ends_sealed=true",
        requirements: [
          {
            type: "inner_packaging_not_required",
            description:
              "Inner packaging exemption when article ends are properly sealed",
            mandatory: true,
            applicableContainers: ["A5.21.general"],
          },
        ],
      },
      {
        condition: "article_ends_sealed=false",
        requirements: [
          {
            type: "inner_packaging_required",
            description:
              "Plastic bags required for inner packaging when article ends are not sealed",
            mandatory: true,
            applicableContainers: ["A5.21.general"],
          },
        ],
      },
    ],

    referencedParagraphs: ["A5.21."],
  },
  "A5.22.": {
    paragraphId: "A5.22.",
    hazardClass: 1,
    description:
      "Cord or Fuse, Detonating; Cord or Fuse, Detonating, Mild Effect",
    lastUpdated: new Date().toISOString(),
    entryType: "specialized",
    materialTypes: ["cord_fuse_detonating", "cord_fuse_detonating_mild_effect"],

    packagingOptions: [
      {
        id: "A5.22.general",
        type: "combination",
        description: "Standard packaging for detonating cord and fuse",
        innerPackaging: {
          required: true,
          materials: [
            "Plastic bags",
            "Fiberboard receptacles",
            "Metal receptacles",
            "Plastic receptacles",
            "Wood receptacles",
            "Paper sheets",
            "Plastic sheets",
            "Reels",
          ],
          description:
            "Multiple inner packaging options including reels for detonating cord and fuse",
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "boxes",
              subtype: "standard",
              containers: [
                { code: "4A", material: "steel", description: "Steel boxes" },
                {
                  code: "4B",
                  material: "aluminum",
                  description: "Aluminum boxes",
                },
                {
                  code: "4C1",
                  material: "wood",
                  description: "Ordinary natural wood boxes",
                },
                {
                  code: "4C2",
                  material: "wood",
                  description: "Sift-proof natural wood boxes",
                },
                { code: "4D", material: "wood", description: "Plywood boxes" },
                {
                  code: "4F",
                  material: "wood",
                  description: "Reconstituted wood boxes",
                },
                {
                  code: "4G",
                  material: "fiberboard",
                  description: "Fiberboard boxes",
                },
                {
                  code: "4H2",
                  material: "plastic",
                  description: "Solid plastic boxes",
                },
                {
                  code: "4N",
                  material: "metal",
                  description: "Other metal boxes",
                },
              ],
            },
            {
              type: "drums",
              subtype: "standard",
              containers: [
                {
                  code: "1A1",
                  material: "steel",
                  description: "Steel drums, non-removable head",
                },
                {
                  code: "1A2",
                  material: "steel",
                  description: "Steel drums, removable head",
                },
                {
                  code: "1B1",
                  material: "aluminum",
                  description: "Aluminum drums, non-removable head",
                },
                {
                  code: "1B2",
                  material: "aluminum",
                  description: "Aluminum drums, removable head",
                },
                { code: "1D", material: "wood", description: "Plywood drums" },
                { code: "1G", material: "fiber", description: "Fiber drums" },
                {
                  code: "1H1",
                  material: "plastic",
                  description: "Plastic drums, non-removable head",
                },
                {
                  code: "1H2",
                  material: "plastic",
                  description: "Plastic drums, removable head",
                },
                {
                  code: "1N1",
                  material: "metal",
                  description: "Other metal drums, non-removable head",
                },
                {
                  code: "1N2",
                  material: "metal",
                  description: "Other metal drums, removable head",
                },
              ],
            },
          ],
        },
        restrictions: [],
        isComplete: true,
      },
    ],

    specialRequirements: [
      {
        type: "detonating_cord_end_sealing",
        description: "Seal ends of the detonating cord and fasten securely",
        mandatory: true,
        applicableContainers: ["A5.22.general"],
      },
      {
        type: "static_resistant_plastic_bag_exemption",
        description:
          "For UN0065, 0104, 0289, 0290, the ends of the detonating cord are not required to be sealed provided the inner packaging consists of a static-resistant plastic bag of at least 3 mil thickness and the bag is securely closed",
        mandatory: true,
        applicableContainers: ["A5.22.general"],
      },
      {
        type: "coil_fastening_exemption",
        description:
          "Inner packaging is not required for UN0065 and UN0289 when securely fastened in coils",
        mandatory: true,
        applicableContainers: ["A5.22.general"],
      },
      {
        type: "reel_packaging_option",
        description:
          "Reels as specialized inner packaging option for detonating cord",
        mandatory: false,
        applicableContainers: ["A5.22.general"],
      },
      {
        type: "receptacle_variety",
        description: "Multiple receptacle material options for inner packaging",
        mandatory: false,
        applicableContainers: ["A5.22.general"],
      },
    ],

    conditionalRequirements: [
      {
        condition: "un_number IN ('UN0065', 'UN0104', 'UN0289', 'UN0290')",
        requirements: [
          {
            type: "static_resistant_bag_alternative",
            description:
              "Static-resistant plastic bag of at least 3 mil thickness allows exemption from end sealing",
            mandatory: true,
            applicableContainers: ["A5.22.general"],
          },
        ],
      },
      {
        condition:
          "un_number IN ('UN0065', 'UN0289') AND packaging_configuration='coils'",
        requirements: [
          {
            type: "inner_packaging_not_required_coils",
            description:
              "Inner packaging exemption when securely fastened in coils",
            mandatory: true,
            applicableContainers: ["A5.22.general"],
          },
        ],
      },
      {
        condition: "material_type='cord_fuse_detonating'",
        requirements: [
          {
            type: "detonating_cord_specific_handling",
            description: "Specific handling requirements for detonating cord",
            mandatory: true,
            applicableContainers: ["A5.22.general"],
          },
        ],
      },
      {
        condition: "material_type='cord_fuse_detonating_mild_effect'",
        requirements: [
          {
            type: "mild_effect_detonating_handling",
            description:
              "Handling requirements for mild effect detonating cord/fuse",
            mandatory: true,
            applicableContainers: ["A5.22.general"],
          },
        ],
      },
    ],

    referencedParagraphs: ["A5.22."],
  },
  "A5.23.": {
    paragraphId: "A5.23.",
    hazardClass: 1,
    description:
      "Cord, Igniter; Fuse, Igniter; Fuse, Non-detonating; or Fuse, Safety",
    lastUpdated: new Date().toISOString(),
    entryType: "specialized",
    materialTypes: [
      "cord_igniter",
      "fuse_igniter",
      "fuse_non_detonating",
      "fuse_safety",
    ],

    packagingOptions: [
      {
        id: "A5.23.general",
        type: "combination",
        description:
          "Standard packaging for igniter cords and non-detonating fuses",
        innerPackaging: {
          required: true,
          materials: [
            "Plastic bags",
            "Kraft paper sheets",
            "Plastic sheets",
            "Wood receptacles",
          ],
          description:
            "Inner packaging options for igniter cords and safety fuses",
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "boxes",
              subtype: "standard",
              containers: [
                { code: "4A", material: "steel", description: "Steel boxes" },
                {
                  code: "4B",
                  material: "aluminum",
                  description: "Aluminum boxes",
                },
                {
                  code: "4C1",
                  material: "wood",
                  description: "Ordinary natural wood boxes",
                },
                {
                  code: "4C2",
                  material: "wood",
                  description: "Sift-proof natural wood boxes",
                },
                { code: "4D", material: "wood", description: "Plywood boxes" },
                {
                  code: "4F",
                  material: "wood",
                  description: "Reconstituted wood boxes",
                },
                {
                  code: "4G",
                  material: "fiberboard",
                  description: "Fiberboard boxes",
                },
                {
                  code: "4H2",
                  material: "plastic",
                  description: "Solid plastic boxes",
                },
              ],
            },
            {
              type: "drums",
              subtype: "standard",
              containers: [
                {
                  code: "1A1",
                  material: "steel",
                  description: "Steel drums, non-removable head",
                },
                {
                  code: "1A2",
                  material: "steel",
                  description: "Steel drums, removable head",
                },
                {
                  code: "1B1",
                  material: "aluminum",
                  description: "Aluminum drums, non-removable head",
                },
                {
                  code: "1B2",
                  material: "aluminum",
                  description: "Aluminum drums, removable head",
                },
                { code: "1D", material: "wood", description: "Plywood drums" },
                { code: "1G", material: "fiber", description: "Fiber drums" },
                {
                  code: "1H1",
                  material: "plastic",
                  description: "Plastic drums, non-removable head",
                },
                {
                  code: "1H2",
                  material: "plastic",
                  description: "Plastic drums, removable head",
                },
                {
                  code: "1N1",
                  material: "metal",
                  description: "Other metal drums, non-removable head",
                },
                {
                  code: "1N2",
                  material: "metal",
                  description: "Other metal drums, removable head",
                },
              ],
            },
          ],
        },
        restrictions: [],
        isComplete: true,
      },
      {
        id: "A5.23.un0101_restricted",
        type: "combination",
        description:
          "Restricted packaging for UN0101 with metal packaging prohibition",
        applicableUNNumbers: ["UN0101"],
        innerPackaging: {
          required: true,
          materials: [
            "Plastic bags",
            "Kraft paper sheets",
            "Plastic sheets",
            "Wood receptacles",
          ],
          description: "Inner packaging for UN0101 restricted materials",
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "boxes",
              subtype: "non_metal_sift_proof",
              containers: [
                {
                  code: "4C2",
                  material: "wood",
                  description:
                    "Sift-proof natural wood boxes (required for UN0101)",
                },
                { code: "4D", material: "wood", description: "Plywood boxes" },
                {
                  code: "4F",
                  material: "wood",
                  description: "Reconstituted wood boxes",
                },
                {
                  code: "4G",
                  material: "fiberboard",
                  description: "Fiberboard boxes",
                },
                {
                  code: "4H2",
                  material: "plastic",
                  description: "Solid plastic boxes",
                },
              ],
            },
            {
              type: "drums",
              subtype: "non_metal",
              containers: [
                { code: "1D", material: "wood", description: "Plywood drums" },
                { code: "1G", material: "fiber", description: "Fiber drums" },
                {
                  code: "1H1",
                  material: "plastic",
                  description: "Plastic drums, non-removable head",
                },
                {
                  code: "1H2",
                  material: "plastic",
                  description: "Plastic drums, removable head",
                },
              ],
            },
          ],
        },
        restrictions: [
          "No steel, aluminum, or other metal packaging for UN0101",
        ],
        isComplete: true,
      },
    ],

    specialRequirements: [
      {
        type: "un0101_metal_packaging_prohibition",
        description:
          "For UN0101, do not use steel, aluminum, or other metal packaging and the packaging must be sift-proof unless the fuse is covered by a paper tube and both ends of tube are covered with removable caps (T-0)",
        mandatory: true,
        applicableContainers: ["A5.23.un0101_restricted"],
      },
      {
        type: "un0105_inner_packaging_exemption",
        description:
          "Inner packaging is not required for UN0105 if ends are sealed",
        mandatory: true,
        applicableContainers: ["A5.23.general"],
      },
      {
        type: "paper_tube_exemption_un0101",
        description:
          "UN0101 sift-proof requirement exemption when fuse is covered by paper tube with removable caps on both ends",
        mandatory: true,
        applicableContainers: ["A5.23.un0101_restricted"],
      },
      {
        type: "kraft_paper_sheets_option",
        description:
          "Kraft paper sheets as specialized inner packaging for safety fuses",
        mandatory: false,
        applicableContainers: ["A5.23.general", "A5.23.un0101_restricted"],
      },
      {
        type: "wood_receptacles_only",
        description:
          "Only wood receptacles permitted for inner packaging (no metal/plastic/fiberboard receptacles)",
        mandatory: false,
        applicableContainers: ["A5.23.general", "A5.23.un0101_restricted"],
      },
    ],

    conditionalRequirements: [
      {
        condition: "un_number='UN0101'",
        requirements: [
          {
            type: "metal_packaging_prohibition_strict",
            description:
              "Strict prohibition of steel, aluminum, or other metal packaging with sift-proof requirement",
            mandatory: true,
            applicableContainers: ["A5.23.un0101_restricted"],
          },
        ],
      },
      {
        condition:
          "un_number='UN0101' AND paper_tube_coverage=true AND removable_caps=true",
        requirements: [
          {
            type: "sift_proof_exemption",
            description:
              "Sift-proof requirement exemption when properly covered with paper tube and caps",
            mandatory: true,
            applicableContainers: ["A5.23.un0101_restricted"],
          },
        ],
      },
      {
        condition: "un_number='UN0105' AND ends_sealed=true",
        requirements: [
          {
            type: "inner_packaging_not_required",
            description:
              "Inner packaging exemption for UN0105 when ends are sealed",
            mandatory: true,
            applicableContainers: ["A5.23.general"],
          },
        ],
      },
      {
        condition: "material_type IN ('fuse_safety', 'fuse_non_detonating')",
        requirements: [
          {
            type: "safety_fuse_handling",
            description:
              "Specific handling requirements for safety and non-detonating fuses",
            mandatory: true,
            applicableContainers: ["A5.23.general", "A5.23.un0101_restricted"],
          },
        ],
      },
    ],

    referencedParagraphs: ["A5.23."],
  },
  "A5.24.": {
    paragraphId: "A5.24.",
    hazardClass: 1,
    description:
      "Fuzes, Detonating; Fuzes, Igniting; Grenades; and Grenades, Practice",
    lastUpdated: new Date().toISOString(),
    entryType: "specialized",
    materialTypes: [
      "fuzes_detonating",
      "fuzes_igniting",
      "grenades",
      "grenades_practice",
    ],

    packagingOptions: [
      {
        id: "A5.24.general",
        type: "combination",
        description:
          "Standard packaging for fuzes and grenades with specialized tray options",
        innerPackaging: {
          required: true,
          materials: [
            "Fiberboard receptacles",
            "Metal receptacles",
            "Plastic receptacles",
            "Wood receptacles",
            "Plastic trays (individual partitions)",
            "Wood trays (individual partitions)",
            "Dividing partitions in outer packaging",
          ],
          description:
            "Multiple inner packaging options including specialized trays for individual partitions",
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "boxes",
              subtype: "standard",
              containers: [
                { code: "4A", material: "steel", description: "Steel boxes" },
                {
                  code: "4B",
                  material: "aluminum",
                  description: "Aluminum boxes",
                },
                {
                  code: "4C1",
                  material: "wood",
                  description: "Ordinary natural wood boxes",
                },
                {
                  code: "4C2",
                  material: "wood",
                  description: "Sift-proof natural wood boxes",
                },
                { code: "4D", material: "wood", description: "Plywood boxes" },
                {
                  code: "4F",
                  material: "wood",
                  description: "Reconstituted wood boxes",
                },
                {
                  code: "4G",
                  material: "fiberboard",
                  description: "Fiberboard boxes",
                },
                {
                  code: "4H2",
                  material: "plastic",
                  description: "Solid plastic boxes",
                },
                {
                  code: "4N",
                  material: "metal",
                  description: "Other metal boxes",
                },
              ],
            },
            {
              type: "drums",
              subtype: "standard",
              containers: [
                {
                  code: "1A1",
                  material: "steel",
                  description: "Steel drums, non-removable head",
                },
                {
                  code: "1A2",
                  material: "steel",
                  description: "Steel drums, removable head",
                },
                {
                  code: "1B1",
                  material: "aluminum",
                  description: "Aluminum drums, non-removable head",
                },
                {
                  code: "1B2",
                  material: "aluminum",
                  description: "Aluminum drums, removable head",
                },
                { code: "1D", material: "wood", description: "Plywood drums" },
                { code: "1G", material: "fiber", description: "Fiber drums" },
                {
                  code: "1H1",
                  material: "plastic",
                  description: "Plastic drums, non-removable head",
                },
                {
                  code: "1H2",
                  material: "plastic",
                  description: "Plastic drums, removable head",
                },
                {
                  code: "1N1",
                  material: "metal",
                  description: "Other metal drums, non-removable head",
                },
                {
                  code: "1N2",
                  material: "metal",
                  description: "Other metal drums, removable head",
                },
              ],
            },
          ],
        },
        restrictions: [],
        isComplete: true,
      },
    ],

    specialRequirements: [
      {
        type: "fuze_grenade_handling",
        description: "Special handling requirements for fuzes and grenades",
        mandatory: true,
        applicableContainers: ["A5.24.general"],
      },
      {
        type: "individual_partition_trays",
        description:
          "Trays with individual partitions available in plastic and wood materials for secure separation",
        mandatory: false,
        applicableContainers: ["A5.24.general"],
      },
      {
        type: "receptacle_material_variety",
        description:
          "Multiple receptacle materials available (fiberboard, metal, plastic, wood)",
        mandatory: false,
        applicableContainers: ["A5.24.general"],
      },
      {
        type: "dividing_partitions_option",
        description:
          "Dividing partitions within outer packaging as alternative to receptacles/trays",
        mandatory: false,
        applicableContainers: ["A5.24.general"],
      },
      {
        type: "practice_grenade_accommodation",
        description:
          "Same packaging requirements for both live and practice grenades",
        mandatory: false,
        applicableContainers: ["A5.24.general"],
      },
    ],

    conditionalRequirements: [
      {
        condition: "material_type='fuzes_detonating'",
        requirements: [
          {
            type: "detonating_fuze_specific_handling",
            description: "Specific safety requirements for detonating fuzes",
            mandatory: true,
            applicableContainers: ["A5.24.general"],
          },
        ],
      },
      {
        condition: "material_type='fuzes_igniting'",
        requirements: [
          {
            type: "igniting_fuze_specific_handling",
            description: "Specific safety requirements for igniting fuzes",
            mandatory: true,
            applicableContainers: ["A5.24.general"],
          },
        ],
      },
      {
        condition: "material_type IN ('grenades', 'grenades_practice')",
        requirements: [
          {
            type: "grenade_specific_handling",
            description:
              "Specific safety requirements for grenades (live and practice)",
            mandatory: true,
            applicableContainers: ["A5.24.general"],
          },
        ],
      },
      {
        condition: "packaging_configuration='individual_partitions'",
        requirements: [
          {
            type: "tray_partition_requirement",
            description:
              "Individual partition trays required for separated packaging configuration",
            mandatory: true,
            applicableContainers: ["A5.24.general"],
          },
        ],
      },
    ],

    referencedParagraphs: ["A5.24."],
  },
  "A5.25.": {
    paragraphId: "A5.25.",
    hazardClass: 1,
    description: "Igniters or Lighters, Fuse",
    lastUpdated: new Date().toISOString(),
    entryType: "specialized",
    materialTypes: ["igniters_fuse", "lighters_fuse"],

    packagingOptions: [
      {
        id: "A5.25.general",
        type: "combination",
        description: "Standard packaging for fuse igniters and lighters",
        innerPackaging: {
          required: true,
          materials: [
            "Paper bags",
            "Plastic bags",
            "Fiberboard receptacles",
            "Metal receptacles",
            "Plastic receptacles",
            "Wood receptacles",
            "Paper sheets",
            "Plastic trays (individual partitions)",
          ],
          description:
            "Multiple inner packaging options including paper materials and plastic trays for fuse igniters",
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "boxes",
              subtype: "standard",
              containers: [
                { code: "4A", material: "steel", description: "Steel boxes" },
                {
                  code: "4B",
                  material: "aluminum",
                  description: "Aluminum boxes",
                },
                {
                  code: "4C1",
                  material: "wood",
                  description: "Ordinary natural wood boxes",
                },
                {
                  code: "4C2",
                  material: "wood",
                  description: "Sift-proof natural wood boxes",
                },
                { code: "4D", material: "wood", description: "Plywood boxes" },
                {
                  code: "4F",
                  material: "wood",
                  description: "Reconstituted wood boxes",
                },
                {
                  code: "4G",
                  material: "fiberboard",
                  description: "Fiberboard boxes",
                },
                {
                  code: "4H2",
                  material: "plastic",
                  description: "Solid plastic boxes",
                },
                {
                  code: "4N",
                  material: "metal",
                  description: "Other metal boxes",
                },
              ],
            },
            {
              type: "drums",
              subtype: "standard",
              containers: [
                {
                  code: "1A1",
                  material: "steel",
                  description: "Steel drums, non-removable head",
                },
                {
                  code: "1A2",
                  material: "steel",
                  description: "Steel drums, removable head",
                },
                {
                  code: "1B1",
                  material: "aluminum",
                  description: "Aluminum drums, non-removable head",
                },
                {
                  code: "1B2",
                  material: "aluminum",
                  description: "Aluminum drums, removable head",
                },
                { code: "1D", material: "wood", description: "Plywood drums" },
                { code: "1G", material: "fiber", description: "Fiber drums" },
                {
                  code: "1H1",
                  material: "plastic",
                  description: "Plastic drums, non-removable head",
                },
                {
                  code: "1H2",
                  material: "plastic",
                  description: "Plastic drums, removable head",
                },
                {
                  code: "1N1",
                  material: "metal",
                  description: "Other metal drums, non-removable head",
                },
                {
                  code: "1N2",
                  material: "metal",
                  description: "Other metal drums, removable head",
                },
              ],
            },
          ],
        },
        restrictions: [],
        isComplete: true,
      },
    ],

    specialRequirements: [
      {
        type: "fuse_igniter_lighter_handling",
        description:
          "Special handling requirements for fuse igniters and lighters",
        mandatory: true,
        applicableContainers: ["A5.25.general"],
      },
      {
        type: "paper_bag_option",
        description:
          "Paper bags as inner packaging option for fuse igniters and lighters",
        mandatory: false,
        applicableContainers: ["A5.25.general"],
      },
      {
        type: "paper_sheets_option",
        description:
          "Paper sheets as inner packaging alternative for lightweight items",
        mandatory: false,
        applicableContainers: ["A5.25.general"],
      },
      {
        type: "plastic_tray_partitions",
        description:
          "Plastic trays with individual partitions for organized separation of igniters/lighters",
        mandatory: false,
        applicableContainers: ["A5.25.general"],
      },
      {
        type: "receptacle_variety",
        description:
          "Multiple receptacle materials available (fiberboard, metal, plastic, wood)",
        mandatory: false,
        applicableContainers: ["A5.25.general"],
      },
    ],

    conditionalRequirements: [
      {
        condition: "material_type='igniters_fuse'",
        requirements: [
          {
            type: "igniter_specific_handling",
            description: "Specific safety requirements for fuse igniters",
            mandatory: true,
            applicableContainers: ["A5.25.general"],
          },
        ],
      },
      {
        condition: "material_type='lighters_fuse'",
        requirements: [
          {
            type: "lighter_specific_handling",
            description: "Specific safety requirements for fuse lighters",
            mandatory: true,
            applicableContainers: ["A5.25.general"],
          },
        ],
      },
      {
        condition: "packaging_configuration='individual_partitions'",
        requirements: [
          {
            type: "plastic_tray_requirement",
            description:
              "Plastic trays with individual partitions required for separated packaging",
            mandatory: true,
            applicableContainers: ["A5.25.general"],
          },
        ],
      },
      {
        condition: "packaging_preference='paper_materials'",
        requirements: [
          {
            type: "paper_packaging_compatibility",
            description:
              "Paper bags and sheets suitable for compatible fuse igniter/lighter materials",
            mandatory: false,
            applicableContainers: ["A5.25.general"],
          },
        ],
      },
    ],

    referencedParagraphs: ["A5.25."],
  },
  "A5.26.": {
    paragraphId: "A5.26.",
    hazardClass: 1,
    description: "Charges, Propelling package as follows",
    lastUpdated: new Date().toISOString(),
    entryType: "specialized",
    materialTypes: ["charges_propelling"],

    packagingOptions: [
      {
        id: "A5.26.standard",
        type: "combination",
        description: "Standard packaging for propelling charges (A5.26.1)",
        innerPackaging: {
          required: true,
          materials: [
            "Kraft paper bags",
            "Plastic bags",
            "Textile bags",
            "Rubberized textile bags",
            "Fiberboard receptacles",
            "Metal receptacles",
            "Plastic receptacles",
            "Wood receptacles",
            "Plastic trays (individual partitions)",
            "Wood trays (individual partitions)",
          ],
          description:
            "Multiple inner packaging options including textile and rubberized textile bags",
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "boxes",
              subtype: "standard",
              containers: [
                { code: "4A", material: "steel", description: "Steel boxes" },
                {
                  code: "4B",
                  material: "aluminum",
                  description: "Aluminum boxes",
                },
                {
                  code: "4C1",
                  material: "wood",
                  description: "Ordinary natural wood boxes",
                },
                {
                  code: "4C2",
                  material: "wood",
                  description: "Sift-proof natural wood boxes",
                },
                { code: "4D", material: "wood", description: "Plywood boxes" },
                {
                  code: "4F",
                  material: "wood",
                  description: "Reconstituted wood boxes",
                },
                {
                  code: "4G",
                  material: "fiberboard",
                  description: "Fiberboard boxes",
                },
                {
                  code: "4H2",
                  material: "plastic",
                  description: "Solid plastic boxes",
                },
                {
                  code: "4N",
                  material: "metal",
                  description: "Other metal boxes",
                },
              ],
            },
            {
              type: "drums",
              subtype: "standard",
              containers: [
                {
                  code: "1A1",
                  material: "steel",
                  description: "Steel drums, non-removable head",
                },
                {
                  code: "1A2",
                  material: "steel",
                  description: "Steel drums, removable head",
                },
                {
                  code: "1B1",
                  material: "aluminum",
                  description: "Aluminum drums, non-removable head",
                },
                {
                  code: "1B2",
                  material: "aluminum",
                  description: "Aluminum drums, removable head",
                },
                { code: "1D", material: "wood", description: "Plywood drums" },
                { code: "1G", material: "fiber", description: "Fiber drums" },
                {
                  code: "1H1",
                  material: "plastic",
                  description: "Plastic drums, non-removable head",
                },
                {
                  code: "1H2",
                  material: "plastic",
                  description: "Plastic drums, removable head",
                },
                {
                  code: "1N1",
                  material: "metal",
                  description: "Other metal drums, non-removable head",
                },
                {
                  code: "1N2",
                  material: "metal",
                  description: "Other metal drums, removable head",
                },
              ],
            },
          ],
        },
        restrictions: [],
        isComplete: true,
      },
      {
        id: "A5.26.composite",
        type: "composite_plastic",
        description: "Composite packaging for propelling charges (A5.26.2)",
        innerPackaging: {
          required: false,
          materials: [],
          description: "Inner packaging not required with use of 6HH2 package",
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "composite",
              subtype: "plastic_receptacle_solid_box",
              containers: [
                {
                  code: "6HH2",
                  material: "composite",
                  description: "Plastic receptacle with outer solid box",
                },
              ],
            },
          ],
        },
        restrictions: [],
        isComplete: true,
      },
    ],

    specialRequirements: [
      {
        type: "metal_packaging_pressure_safety",
        description:
          "Ensure metal packagings are constructed so that risk of explosion, by reason of increase in internal pressure (from internal or external causes), is prevented",
        mandatory: true,
        applicableContainers: ["A5.26.standard"],
      },
      {
        type: "textile_bag_options",
        description:
          "Textile and rubberized textile bags as specialized inner packaging for propelling charges",
        mandatory: false,
        applicableContainers: ["A5.26.standard"],
      },
      {
        type: "composite_packaging_alternative",
        description:
          "Composite packaging (6HH2) as alternative with no inner packaging requirement",
        mandatory: false,
        applicableContainers: ["A5.26.composite"],
      },
      {
        type: "individual_partition_trays",
        description:
          "Trays with individual partitions available in plastic and wood materials",
        mandatory: false,
        applicableContainers: ["A5.26.standard"],
      },
      {
        type: "kraft_paper_specialized",
        description: "Kraft paper bags as specialized inner packaging option",
        mandatory: false,
        applicableContainers: ["A5.26.standard"],
      },
    ],

    conditionalRequirements: [
      {
        condition: "packaging_type='metal'",
        requirements: [
          {
            type: "pressure_explosion_prevention",
            description:
              "Metal packaging must prevent explosion risk from internal pressure increase",
            mandatory: true,
            applicableContainers: ["A5.26.standard"],
          },
        ],
      },
      {
        condition: "packaging_option='composite'",
        requirements: [
          {
            type: "6HH2_composite_usage",
            description:
              "6HH2 composite package eliminates inner packaging requirement",
            mandatory: true,
            applicableContainers: ["A5.26.composite"],
          },
        ],
      },
      {
        condition: "packaging_configuration='individual_partitions'",
        requirements: [
          {
            type: "tray_partition_requirement",
            description:
              "Individual partition trays required for separated packaging configuration",
            mandatory: true,
            applicableContainers: ["A5.26.standard"],
          },
        ],
      },
      {
        condition: "material_sensitivity='high'",
        requirements: [
          {
            type: "textile_bag_recommendation",
            description:
              "Textile or rubberized textile bags recommended for sensitive propelling charges",
            mandatory: false,
            applicableContainers: ["A5.26.standard"],
          },
        ],
      },
    ],

    referencedParagraphs: ["A5.26.", "A5.26.1.", "A5.26.2."],
  },
  "A5.27.": {
    paragraphId: "A5.27.",
    hazardClass: 1,
    description: "Contrivances, Water-Activated package as follows",
    lastUpdated: new Date().toISOString(),
    entryType: "specialized",
    materialTypes: ["contrivances_water_activated"],

    packagingOptions: [
      {
        id: "A5.27.standard",
        type: "combination",
        description:
          "Standard packaging for water-activated contrivances (A5.27.1)",
        innerPackaging: {
          required: true,
          materials: [
            "Fiberboard receptacles",
            "Metal receptacles",
            "Plastic receptacles",
            "Wood receptacles",
            "Dividing partitions in outer packaging",
          ],
          description:
            "Receptacles in multiple materials or dividing partitions for water-activated contrivances",
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "boxes",
              subtype: "water_sealed",
              containers: [
                {
                  code: "4A",
                  material: "steel",
                  description: "Steel boxes (water-sealed)",
                },
                {
                  code: "4B",
                  material: "aluminum",
                  description: "Aluminum boxes (water-sealed)",
                },
                {
                  code: "4C1",
                  material: "wood",
                  description:
                    "Ordinary natural wood boxes with metal liner (water-sealed)",
                },
                {
                  code: "4D",
                  material: "wood",
                  description: "Plywood boxes with metal liner (water-sealed)",
                },
                {
                  code: "4F",
                  material: "wood",
                  description:
                    "Reconstituted wood boxes with metal liner (water-sealed)",
                },
                {
                  code: "4H1",
                  material: "plastic",
                  description: "Expanded plastic boxes (water-sealed)",
                },
                {
                  code: "4H2",
                  material: "plastic",
                  description: "Solid plastic boxes (water-sealed)",
                },
                {
                  code: "4N",
                  material: "metal",
                  description: "Other metal boxes (water-sealed)",
                },
              ],
            },
            {
              type: "drums",
              subtype: "water_sealed",
              containers: [
                {
                  code: "1A1",
                  material: "steel",
                  description: "Steel drums, non-removable head (water-sealed)",
                },
                {
                  code: "1A2",
                  material: "steel",
                  description: "Steel drums, removable head (water-sealed)",
                },
                {
                  code: "1B1",
                  material: "aluminum",
                  description:
                    "Aluminum drums, non-removable head (water-sealed)",
                },
                {
                  code: "1B2",
                  material: "aluminum",
                  description: "Aluminum drums, removable head (water-sealed)",
                },
                {
                  code: "1D",
                  material: "wood",
                  description: "Plywood drums (water-sealed)",
                },
                {
                  code: "1H1",
                  material: "plastic",
                  description:
                    "Plastic drums, non-removable head (water-sealed)",
                },
                {
                  code: "1H2",
                  material: "plastic",
                  description: "Plastic drums, removable head (water-sealed)",
                },
                {
                  code: "1N1",
                  material: "metal",
                  description:
                    "Other metal drums, non-removable head (water-sealed)",
                },
                {
                  code: "1N2",
                  material: "metal",
                  description:
                    "Other metal drums, removable head (water-sealed)",
                },
              ],
            },
          ],
        },
        restrictions: [],
        isComplete: true,
      },
      {
        id: "A5.27.large_robust",
        type: "specialized",
        description:
          "Large and robust articles with special handling requirements (A5.27.2)",
        innerPackaging: {
          required: false,
          materials: [],
          description:
            "Inner packaging not required for large and robust articles meeting specific criteria",
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "specialized",
              subtype: "dod_approved_containers",
              containers: [
                {
                  code: "DOD",
                  material: "specialized",
                  description:
                    "DOD-approved containers, crates, cradles, or other suitable handling, storage, or launching devices",
                },
              ],
            },
          ],
        },
        restrictions: [
          "Must pass Test Series 4 of UN Manual of Tests and Criteria on unpackaged article",
          "Must contain at least two independent water ingress prevention features",
        ],
        isComplete: true,
      },
    ],

    specialRequirements: [
      {
        type: "water_sealing_mandatory",
        description: "Seal packagings against the ingress of water",
        mandatory: true,
        applicableContainers: ["A5.27.standard"],
      },
      {
        type: "metal_liner_requirement",
        description:
          "Wood boxes (4C1, 4D, 4F) must have metal liner for water protection",
        mandatory: true,
        applicableContainers: ["A5.27.standard"],
      },
      {
        type: "test_series_4_requirement",
        description:
          "Large and robust articles must obtain negative result in Test Series 4 of UN Manual of Tests and Criteria on unpackaged article",
        mandatory: true,
        applicableContainers: ["A5.27.large_robust"],
      },
      {
        type: "dual_water_protection_features",
        description:
          "Articles must contain at least two independent features which prevent the ingress of water (T-0)",
        mandatory: true,
        applicableContainers: ["A5.27.large_robust"],
      },
      {
        type: "ignition_system_protection",
        description:
          "When articles have propelling charges or are self-propelled, protect their ignition systems against stimuli encountered during normal conditions of transport",
        mandatory: true,
        applicableContainers: ["A5.27.large_robust"],
      },
      {
        type: "dod_approved_container_requirement",
        description:
          "Articles must be in DOD-approved containers, crates, cradles, or other suitable handling, storage, or launching devices tested to prevent loosening during transport",
        mandatory: true,
        applicableContainers: ["A5.27.large_robust"],
      },
    ],

    conditionalRequirements: [
      {
        condition: "packaging_type='standard'",
        requirements: [
          {
            type: "water_ingress_prevention",
            description:
              "Standard packaging must be sealed against water ingress",
            mandatory: true,
            applicableContainers: ["A5.27.standard"],
          },
        ],
      },
      {
        condition: "packaging_type='large_robust_articles'",
        requirements: [
          {
            type: "unpacked_transport_criteria",
            description:
              "Large robust articles may be carried unpacked if meeting specific test and protection criteria",
            mandatory: true,
            applicableContainers: ["A5.27.large_robust"],
          },
        ],
      },
      {
        condition: "article_has_propelling_charges=true OR self_propelled=true",
        requirements: [
          {
            type: "ignition_system_stimulus_protection",
            description:
              "Enhanced protection required for ignition systems in self-propelled or propelling charge articles",
            mandatory: true,
            applicableContainers: ["A5.27.large_robust"],
          },
        ],
      },
      {
        condition: "wood_packaging=true",
        requirements: [
          {
            type: "metal_liner_mandatory",
            description:
              "Metal liner required for all wood packaging to ensure water protection",
            mandatory: true,
            applicableContainers: ["A5.27.standard"],
          },
        ],
      },
    ],

    referencedParagraphs: ["A5.27.", "A5.27.1.", "A5.27.2."],
  },
  "A7.2.": {
    paragraphId: "A7.2.",
    hazardClass: 3,
    description: "Packaging for Class 3 Materials is as follows:",
    lastUpdated: new Date().toISOString(),
    entryType: "standard",
    materialTypes: ["flammable_liquids"],

    packagingOptions: [
      {
        id: "A7.2.combination",
        type: "combination",
        description: "Inner packages inside outer package",
        innerPackaging: {
          required: true,
          materials: ["Glass", "Earthenware", "Plastic", "Metal"],
          specialRequirements: [
            "For PG I material, pack inner packagings in a rigid and leakproof receptacle or intermediate packaging containing sufficient absorbent material to absorb the entire contents of all inner packagings before packing the inner packaging(s) in the outer package.",
            "Ensure inner packaging or receptacle closures of combination packages containing liquids are held securely, tightly, and effectively in place by secondary means. See A20.3.",
          ],
        },
        outerPackaging: {
          categories: [
            {
              type: "drums",
              containers: [
                {
                  code: "1A2",
                  material: "steel",
                  description: "Removable head steel",
                },
                {
                  code: "1B2",
                  material: "aluminum",
                  description: "Removable head aluminum",
                },
                {
                  code: "1N2",
                  material: "other_metal",
                  description:
                    "Removable head metal other than steel or aluminum",
                },
                { code: "1D", material: "plywood", description: "Plywood" },
                { code: "1G", material: "fiber", description: "Fiber" },
                {
                  code: "1H2",
                  material: "plastic",
                  description: "Removable head plastic",
                },
              ],
            },
            {
              type: "boxes",
              containers: [
                { code: "4A", material: "steel", description: "Steel" },
                { code: "4B", material: "aluminum", description: "Aluminum" },
                {
                  code: "4C1",
                  material: "natural_wood",
                  description: "Ordinary natural wood",
                },
                {
                  code: "4C2",
                  material: "natural_wood",
                  description: "Sift-proof natural wood",
                },
                { code: "4D", material: "plywood", description: "Plywood" },
                {
                  code: "4F",
                  material: "reconstituted_wood",
                  description: "Reconstituted wood",
                },
                {
                  code: "4G",
                  material: "fiberboard",
                  description: "Fiberboard",
                },
                {
                  code: "4H1",
                  material: "plastic",
                  description: "Expanded plastic",
                },
                {
                  code: "4H2",
                  material: "plastic",
                  description: "Solid plastic",
                },
              ],
            },
            {
              type: "jerricans",
              containers: [
                {
                  code: "3A2",
                  material: "steel",
                  description: "Removable head steel",
                },
                {
                  code: "3H2",
                  material: "plastic",
                  description: "Plastic removable head",
                },
                {
                  code: "3B2",
                  material: "aluminum",
                  description: "Aluminum removable head",
                },
              ],
            },
            {
              type: "barrels",
              containers: [
                { code: "2C2", material: "wood", description: "Wooden" },
              ],
            },
          ],
        },
        notes: ["Wood barrels not authorized for PG I material."],
      },
      {
        id: "A7.2.single",
        type: "single",
        description: "Standalone container",
        innerPackaging: {
          required: false,
        },
        outerPackaging: {
          categories: [
            {
              type: "drums",
              containers: [
                { code: "1A1", material: "steel", description: "Steel" },
                {
                  code: "1A2",
                  material: "steel",
                  description: "Removable head steel",
                },
                { code: "1B1", material: "aluminum", description: "Aluminum" },
                {
                  code: "1B2",
                  material: "aluminum",
                  description: "Removable head aluminum",
                },
                {
                  code: "1N1",
                  material: "other_metal",
                  description: "Metal drum other than steel or aluminum",
                },
                {
                  code: "1N2",
                  material: "other_metal",
                  description:
                    "Removable head metal other than steel or aluminum",
                },
                {
                  code: "1G",
                  material: "fiber",
                  description: "Fiber with liner",
                },
                { code: "1H1", material: "plastic", description: "Plastic" },
                { code: "1H2", material: "plastic", description: "Plastic" },
              ],
            },
            {
              type: "jerricans",
              containers: [
                { code: "3A1", material: "steel", description: "Steel" },
                { code: "3A2", material: "steel", description: "Steel" },
                { code: "3B1", material: "aluminum", description: "Aluminum" },
                { code: "3B2", material: "aluminum", description: "Aluminum" },
                { code: "3H1", material: "plastic", description: "Plastic" },
                { code: "3H2", material: "plastic", description: "Plastic" },
              ],
            },
            {
              type: "barrels",
              containers: [
                { code: "2C1", material: "wood", description: "Wooden" },
              ],
            },
          ],
        },
        notes: [
          "Fiber drum with liner only authorized for PG II or PG III material.",
          "Wooden Barrels not authorized for PG I material.",
        ],
      },
      {
        id: "A7.2.composite_plastic",
        type: "composite_plastic",
        description: "Plastic inner receptacles",
        innerPackaging: {
          required: true,
          materials: ["Plastic"],
        },
        outerPackaging: {
          categories: [
            {
              type: "boxes",
              containers: [
                { code: "6HA2", material: "steel", description: "Steel" },
                { code: "6HB2", material: "aluminum", description: "Aluminum" },
                { code: "6HC", material: "wood", description: "Wooden" },
                { code: "6HD2", material: "plywood", description: "Plywood" },
                {
                  code: "6HG2",
                  material: "fiberboard",
                  description: "Fiberboard",
                },
              ],
            },
            {
              type: "drums",
              containers: [
                { code: "6HA1", material: "steel", description: "Steel" },
                { code: "6HB1", material: "aluminum", description: "Aluminum" },
                { code: "6HG1", material: "fiber", description: "Fiber" },
                { code: "6HH1", material: "plastic", description: "Plastic" },
                { code: "6HD1", material: "plywood", description: "Plywood" },
              ],
            },
          ],
        },
        notes: ["Plywood drum (6HD1) only authorized for PG II or PG III."],
      },
      {
        id: "A7.2.composite_glass",
        type: "composite_glass",
        description: "Fragile inner receptacles",
        innerPackaging: {
          required: true,
          materials: ["Glass", "Porcelain", "Stoneware"],
        },
        outerPackaging: {
          categories: [
            {
              type: "drums",
              containers: [
                { code: "6PA1", material: "steel", description: "Steel" },
                { code: "6PB1", material: "aluminum", description: "Aluminum" },
                { code: "6PG1", material: "fiber", description: "Fiber" },
                {
                  code: "6PD1",
                  material: "plywood",
                  description: "Plywood drum",
                },
                {
                  code: "6PD2",
                  material: "wickerwork",
                  description: "Wickerwork hamper",
                },
              ],
            },
            {
              type: "boxes",
              containers: [
                { code: "6PA2", material: "steel", description: "Steel" },
                { code: "6PB2", material: "aluminum", description: "Aluminum" },
                { code: "6PC", material: "wood", description: "Wooden" },
                {
                  code: "6PG2",
                  material: "fiberboard",
                  description: "Fiberboard",
                },
                {
                  code: "6PH1",
                  material: "plastic",
                  description: "Solid plastic",
                },
                {
                  code: "6PH2",
                  material: "plastic",
                  description: "Expanded plastic packaging",
                },
              ],
            },
          ],
        },
        notes: [
          "Plywood drum (6PD1) and wickerwork hamper (6PD2) only authorized for PG II or PG III.",
        ],
      },
    ],

    packingGroupRestrictions: [
      {
        packingGroup: "I",
        restriction: "prohibited",
        description: "Wood barrels not authorized for PG I material",
        conditions: ["2C1", "2C2"],
      },
      {
        packingGroup: "I",
        restriction: "prohibited",
        description:
          "Fiber drum with liner only authorized for PG II or PG III material",
        conditions: ["1G"],
      },
      {
        packingGroup: "I",
        restriction: "prohibited",
        description: "Plywood drum only authorized for PG II or PG III",
        conditions: ["6HD1"],
      },
      {
        packingGroup: "I",
        restriction: "prohibited",
        description:
          "Plywood drum and wickerwork hamper only authorized for PG II or PG III",
        conditions: ["6PD1", "6PD2"],
      },
    ],

    specialRequirements: [
      {
        type: "closure_type",
        description:
          "Ensure inner packaging or receptacle closures of combination packages containing liquids are held securely, tightly, and effectively in place by secondary means. See A20.3.",
        mandatory: true,
        applicableContainers: ["combination"],
      },
      {
        type: "handling",
        description:
          "For PG I material, pack inner packagings in a rigid and leakproof receptacle or intermediate packaging containing sufficient absorbent material",
        mandatory: true,
        applicableContainers: ["combination"],
      },
    ],

    referencedParagraphs: ["A20.3", "A7.2.5", "A7.2.6", "A7.2.7", "A7.2.8"],
  },
  "A7.3.": {
    paragraphId: "A7.3.",
    hazardClass: 3,
    description: "Package Refrigerating Machines as follows",
    lastUpdated: new Date().toISOString(),
    entryType: "exception",
    materialTypes: ["refrigerating_machines"],

    packagingOptions: [
      {
        id: "A7.3.exception",
        type: "single",
        description:
          "Refrigerating machines excepted from specification packaging requirements",
        innerPackaging: {
          required: false,
          description:
            "Inner packaging not required - machine contains flammable liquid for operation",
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "specialized",
              subtype: "strong_tight_receptacle",
              containers: [
                {
                  code: "STRONG",
                  material: "various",
                  description:
                    "Strong, tight receptacle suitable for refrigerating machine",
                },
              ],
            },
          ],
        },
        restrictions: [],
        isComplete: true,
      },
    ],

    specialRequirements: [
      {
        type: "handling",
        description: "Machine must be assembled for shipment",
        mandatory: true,
        applicableContainers: ["A7.3.exception"],
      },
      {
        type: "quantity_control",
        description:
          "Must contain 7 kg (15 pounds) or less of flammable liquid for operation",
        mandatory: true,
        applicableContainers: ["A7.3.exception"],
      },
      {
        type: "handling",
        description: "Must be in a strong, tight receptacle",
        mandatory: true,
        applicableContainers: ["A7.3.exception"],
      },
      {
        type: "compatibility",
        description:
          "Excepted from specification packaging, marking, and labeling except for the PSN of the flammable liquid",
        mandatory: true,
        applicableContainers: ["A7.3.exception"],
      },
    ],

    quantityLimits: [
      {
        scope: "per_package",
        value: 7,
        unit: "kg",
        description:
          "Maximum 7 kg (15 pounds) of flammable liquid for operation",
      },
    ],

    conditionalRequirements: [
      {
        condition: "flammable_liquid_quantity <= 7",
        requirements: [
          {
            type: "compatibility",
            description:
              "Refrigerating machine qualifies for packaging exception when containing 7 kg or less of flammable liquid",
            mandatory: true,
            applicableContainers: ["A7.3.exception"],
          },
        ],
      },
      {
        condition: "machine_status = 'assembled_for_shipment'",
        requirements: [
          {
            type: "handling",
            description:
              "Machine must be properly assembled and configured for shipment",
            mandatory: true,
            applicableContainers: ["A7.3.exception"],
          },
        ],
      },
    ],

    referencedParagraphs: ["A7.3"],
  },
  "A7.4.": {
    paragraphId: "A7.4.",
    hazardClass: 3,
    description: "Package Aircraft Hydraulic Power Unit Fuel Tank as follows",
    lastUpdated: new Date().toISOString(),
    entryType: "equipment",
    materialTypes: [
      "aircraft_hydraulic_power_unit_fuel_tank",
      "m86_fuel_tanks",
    ],

    packagingOptions: [
      {
        id: "A7.4.option1",
        type: "single",
        description:
          "Aluminum pressure vessel with welded aluminum bladder (A7.4.2.1)",
        innerPackaging: {
          required: true,
          description:
            "Welded aluminum bladder with maximum internal volume of 46 L (12 gallons) contained within aluminum pressure vessel made from tubing with welded heads",
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "specialized",
              subtype: "metal_protective_packaging",
              containers: [
                {
                  code: "METAL",
                  material: "metal",
                  description:
                    "Strong outer tightly closed metal packaging that adequately protects all fittings",
                },
              ],
            },
          ],
        },
        restrictions: [
          "Leak-check each vessel during manufacture and before shipment",
          "Vessel must be found leak proof",
          "Securely pack complete inner unit in noncombustible cushioning material",
        ],
        notes: [
          "Minimum design gauge pressure: 1,275 kPa (185 psig)",
          "Minimum burst gauge pressure: 2,755 kPa (400 psig)",
          "Units designed for installation as complete units in aircraft",
          "Excepted from specification packaging requirements when meeting these conditions",
        ],
        isComplete: true,
      },
      {
        id: "A7.4.option2",
        type: "single",
        description:
          "Aluminum pressure vessel with hermetically sealed fuel compartment (A7.4.2.2)",
        innerPackaging: {
          required: true,
          description:
            "Welded hermetically sealed fuel compartment with elastomeric bladder having maximum internal volume of 46 L (12 gallons) within aluminum pressure vessel",
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "specialized",
              subtype: "metal_protective_packaging",
              containers: [
                {
                  code: "METAL",
                  material: "metal",
                  description:
                    "Strong outer tightly closed metal packaging that adequately protects all fittings",
                },
              ],
            },
          ],
        },
        restrictions: [
          "Leak-check each vessel during manufacture and before shipment",
          "Vessel must be found leak proof",
          "Securely pack complete inner unit in noncombustible cushioning material",
        ],
        notes: [
          "Minimum design gauge pressure: 2,860 kPa (415 psig)",
          "Minimum burst gauge pressure: 5,170 kPa (750 psig)",
          "Units designed for installation as complete units in aircraft",
          "Excepted from specification packaging requirements when meeting these conditions",
        ],
        isComplete: true,
      },
    ],

    specialRequirements: [
      {
        type: "handling",
        description:
          "In the event of a leak during transportation of hydrazine, crew members use their aircraft oxygen masks in a positive pressure mode",
        mandatory: true,
        applicableContainers: ["A7.4.option1", "A7.4.option2"],
      },
      {
        type: "testing",
        description:
          "Leak-check each vessel during manufacture and before shipment and ensure the vessel is found leak proof",
        mandatory: true,
        applicableContainers: ["A7.4.option1", "A7.4.option2"],
      },
      {
        type: "cushioning",
        description:
          "Securely pack the complete inner unit in noncombustible cushioning material",
        mandatory: true,
        applicableContainers: ["A7.4.option1", "A7.4.option2"],
      },
      {
        type: "compatibility",
        description:
          "Aircraft hydraulic power unit fuel tanks containing M86 fuel and designed for installation as complete units in aircraft are excepted from specification packaging requirements",
        mandatory: true,
        applicableContainers: ["A7.4.option1", "A7.4.option2"],
      },
    ],

    quantityLimits: [
      {
        scope: "per_package",
        value: 42,
        unit: "L",
        description:
          "Maximum quantity of fuel per unit and package is 42 L (11 gallons)",
      },
      {
        scope: "bladder_capacity",
        value: 46,
        unit: "L",
        description: "Maximum internal volume of bladder is 46 L (12 gallons)",
      },
    ],

    conditionalRequirements: [
      {
        condition: "packaging_option = 'A7.4.option1'",
        requirements: [
          {
            type: "pressure_resistant",
            description:
              "Minimum design gauge pressure of 1,275 kPa (185 psig) and minimum burst gauge pressure of 2,755 kPa (400 psig)",
            mandatory: true,
            applicableContainers: ["A7.4.option1"],
          },
        ],
      },
      {
        condition: "packaging_option = 'A7.4.option2'",
        requirements: [
          {
            type: "pressure_resistant",
            description:
              "Minimum design gauge pressure of 2,860 kPa (415 psig) and minimum burst gauge pressure of 5,170 kPa (750 psig)",
            mandatory: true,
            applicableContainers: ["A7.4.option2"],
          },
        ],
      },
    ],

    referencedParagraphs: ["A7.4.1", "A7.4.2", "A7.4.2.1", "A7.4.2.2"],
  },
  "A7.5.": {
    paragraphId: "A7.5.",
    hazardClass: 3,
    description:
      "Packaging for Class 3 Materials, Poisonous by Inhalation (Hazard Zone A or B)",
    lastUpdated: new Date().toISOString(),
    entryType: "specialized",
    materialTypes: [
      "class_3_inhalation_hazard_zone_a",
      "class_3_inhalation_hazard_zone_b",
    ],

    packagingOptions: [
      {
        id: "A7.5.cylinders",
        type: "cylinder",
        description: "DOT specification cylinders (A7.5.2)",
        innerPackaging: {
          required: false,
          description: "Not required for cylinder packaging",
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "cylinders",
              subtype: "dot_specification",
              containers: [
                {
                  code: "DOT_SPEC",
                  material: "various",
                  description:
                    "DOT specification cylinders as identified in 49 CFR Part 178 Subpart C",
                },
              ],
            },
          ],
        },
        restrictions: [
          "Specification 8, 8AL, and 39 cylinders are not authorized",
          "Cylinders must meet requirements of A3.3.2",
        ],
        isComplete: true,
      },
      {
        id: "A7.5.double_drum",
        type: "combination",
        description: "Inner drum within outer drum system (A7.5.3)",
        innerPackaging: {
          required: true,
          description:
            "Inner drum (1A1, 1B1, 1H1, 1N1, or 6HA1) tested to PG I performance level",
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "drums",
              subtype: "steel_aluminum_removable_head",
              containers: [
                {
                  code: "1A2",
                  material: "steel",
                  description:
                    "Steel removable head drum (minimum thickness 1.35 mm)",
                },
                {
                  code: "1H2",
                  material: "plastic",
                  description:
                    "Plastic removable head drum (minimum thickness 6.30 mm)",
                },
              ],
            },
          ],
        },
        restrictions: [
          "Both inner and outer drum must be tested to PG I performance level",
          "Capacity of inner drum may not exceed 220 L (58 gallons)",
          "Minimum 5.0 cm cushioning between drum sides",
          "Minimum 7.6 cm cushioning between drum tops/bottoms",
          "Cushion with shock-mitigating, non-reactive material",
        ],
        notes: [
          "Inner drum must meet all requirements in A7.5.3.1 through A7.5.3.6",
          "Specific thickness requirements vary by hazard zone",
        ],
        isComplete: true,
      },
      {
        id: "A7.5.triple_packaging",
        type: "combination",
        description:
          "Inner receptacle within leak-tight packaging within outer container (A7.5.4)",
        innerPackaging: {
          required: true,
          description:
            "Impact-resistant receptacle of glass, earthenware, plastic, or metal (max 4 L capacity) securely cushioned with nonreactive absorbent material",
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "drums",
              subtype: "various_removable_head",
              containers: [
                {
                  code: "1A2",
                  material: "steel",
                  description: "Steel removable head drum",
                },
                {
                  code: "1B2",
                  material: "aluminum",
                  description: "Aluminum removable head drum",
                },
                {
                  code: "1N2",
                  material: "other_metal",
                  description: "Other metal removable head drum",
                },
                {
                  code: "1D",
                  material: "plywood",
                  description: "Plywood drum",
                },
                { code: "1G", material: "fiber", description: "Fiber drum" },
                {
                  code: "1H2",
                  material: "plastic",
                  description: "Plastic removable head drum",
                },
              ],
            },
            {
              type: "boxes",
              subtype: "various_materials",
              containers: [
                { code: "4A", material: "steel", description: "Steel box" },
                {
                  code: "4B",
                  material: "aluminum",
                  description: "Aluminum box",
                },
                {
                  code: "4C1",
                  material: "natural_wood",
                  description: "Natural wood box",
                },
                {
                  code: "4C2",
                  material: "sift_proof_wood",
                  description: "Sift-proof natural wood box",
                },
                { code: "4D", material: "plywood", description: "Plywood box" },
                {
                  code: "4F",
                  material: "reconstituted_wood",
                  description: "Reconstituted wood box",
                },
                {
                  code: "4G",
                  material: "fiberboard",
                  description: "Fiberboard box",
                },
                {
                  code: "4H1",
                  material: "expanded_plastic",
                  description: "Expanded plastic box",
                },
                {
                  code: "4H2",
                  material: "solid_plastic",
                  description: "Solid plastic box",
                },
                {
                  code: "4N",
                  material: "other_metal",
                  description: "Other metal box",
                },
              ],
            },
          ],
        },
        restrictions: [
          "Inner receptacle capacity may not exceed 4 L (1 gallon)",
          "Total liquid per outer container may not exceed 16 L (4 gallons)",
          "Both inner packaging system and outer container must meet PG I performance level independently",
          "Screw-type closures must be held in place to prevent backoff during transportation",
        ],
        isComplete: true,
      },
    ],

    specialRequirements: [
      {
        type: "handling",
        description:
          "These items are extremely dangerous. Make approved chemical safety mask and clothing available when handling this material, and wear when handling leaking packages",
        mandatory: true,
        applicableContainers: [
          "A7.5.cylinders",
          "A7.5.double_drum",
          "A7.5.triple_packaging",
        ],
      },
      {
        type: "testing",
        description:
          "Inner drum must satisfactorily withstand hydrostatic pressure test of 300 kPa (45 psig) for inner drums and 100 kPa (15 psig) for outer drums",
        mandatory: true,
        applicableContainers: ["A7.5.double_drum"],
      },
      {
        type: "testing",
        description:
          "Inner drum must satisfactorily withstand leak proof test using internal air pressure at 55°C (131°F) of at least twice the vapor pressure of the material",
        mandatory: true,
        applicableContainers: ["A7.5.double_drum"],
      },
      {
        type: "closure_security",
        description:
          "Screw-type closures must be closed and tightened to torque as prescribed by manufacturer using torque-measuring device",
        mandatory: true,
        applicableContainers: ["A7.5.double_drum", "A7.5.triple_packaging"],
      },
      {
        type: "closure_security",
        description:
          "Closures must be physically held in place by any means capable of preventing backoff or loosening during transportation",
        mandatory: true,
        applicableContainers: ["A7.5.double_drum", "A7.5.triple_packaging"],
      },
      {
        type: "testing",
        description:
          "Cap seal must be properly applied and capable of withstanding internal pressure of at least 100 kPa (15 psi)",
        mandatory: true,
        applicableContainers: ["A7.5.double_drum"],
      },
      {
        type: "cushioning",
        description:
          "Cushion inner drum with shock-mitigating, non-reactive material with specified minimum distances",
        mandatory: true,
        applicableContainers: ["A7.5.double_drum"],
      },
      {
        type: "absorbent_material",
        description:
          "Pack inner receptacle with nonreactive absorbent material within leak-tight intermediate packaging",
        mandatory: true,
        applicableContainers: ["A7.5.triple_packaging"],
      },
    ],

    quantityLimits: [
      {
        scope: "inner_drum_capacity",
        value: 220,
        unit: "L",
        description: "Maximum capacity of inner drum is 220 L (58 gallons)",
      },
      {
        scope: "per_inner",
        value: 4,
        unit: "L",
        description: "Maximum capacity of inner receptacle is 4 L (1 gallon)",
      },
      {
        scope: "total_liquid_per_container",
        value: 16,
        unit: "L",
        description:
          "Maximum total liquid per outer container is 16 L (4 gallons)",
      },
    ],

    packingGroupRestrictions: [
      {
        packingGroup: "I",
        restrictions: [
          "All packaging options available",
          "Zone A thickness requirements apply for double drum system",
          "Most stringent requirements apply",
        ],
      },
      {
        packingGroup: "II",
        restrictions: [
          "All packaging options available",
          "Zone B thickness requirements may apply depending on material classification",
        ],
      },
    ],

    conditionalRequirements: [
      {
        condition: "hazard_zone = 'A' AND packaging_option = 'double_drum'",
        requirements: [
          {
            type: "material_compatibility",
            description:
              "Zone A minimum thickness: 1A1/1N1 drums 1.3mm, 1B1 drums 3.9mm, 1H1 drums 3.16mm, 6HA1 plastic 1.58mm/steel 0.96mm",
            mandatory: true,
            applicableContainers: ["A7.5.double_drum"],
          },
        ],
      },
      {
        condition: "hazard_zone = 'B' AND packaging_option = 'double_drum'",
        requirements: [
          {
            type: "material_compatibility",
            description:
              "Zone B minimum thickness: 1A1/1N1 drums 0.69mm, 1B1 drums 3.9mm, 1H1 drums 1.14mm, 6HA1 plastic 1.58mm/steel 0.70mm",
            mandatory: true,
            applicableContainers: ["A7.5.double_drum"],
          },
        ],
      },
      {
        condition: "outer_drum_type = '1A2'",
        requirements: [
          {
            type: "material_compatibility",
            description:
              "Outer 1A2 drum must have minimum thickness of 1.35 mm (0.053 inches)",
            mandatory: true,
            applicableContainers: ["A7.5.double_drum"],
          },
        ],
      },
      {
        condition: "outer_drum_type = '1H2'",
        requirements: [
          {
            type: "material_compatibility",
            description:
              "Outer 1H2 drum must have minimum thickness of 6.30 mm (0.248 inches)",
            mandatory: true,
            applicableContainers: ["A7.5.double_drum"],
          },
        ],
      },
    ],

    referencedParagraphs: ["A7.5.1", "A7.5.2", "A7.5.3", "A7.5.4", "A3.3.2"],
  },
  "A7.6.": {
    paragraphId: "A7.6.",
    hazardClass: 3,
    description: "Package Polyester Resin Kits as follows",
    lastUpdated: new Date().toISOString(),
    entryType: "specialized",
    materialTypes: ["polyester_resin_kits", "fiberglass_repair_kits"],

    packagingOptions: [
      {
        id: "A7.6.organic_peroxide",
        type: "combination",
        description: "Organic peroxide activator component packaging (A7.6.1)",
        innerPackaging: {
          required: true,
          description: "Plastic tube packaging or flexible tube packaging",
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "drums",
              subtype: "removable_head_various",
              containers: [
                {
                  code: "1A2",
                  material: "steel",
                  description: "Steel removable head drum",
                },
                {
                  code: "1B2",
                  material: "aluminum",
                  description: "Aluminum removable head drum",
                },
                { code: "1G", material: "fiber", description: "Fiber drum" },
                {
                  code: "1H2",
                  material: "plastic",
                  description: "Plastic removable head drum",
                },
                {
                  code: "1N2",
                  material: "other_metal",
                  description: "Other metal removable head drum",
                },
              ],
            },
            {
              type: "jerricans",
              subtype: "removable_head_various",
              containers: [
                {
                  code: "3A2",
                  material: "steel",
                  description: "Steel removable head jerrican",
                },
                {
                  code: "3B2",
                  material: "aluminum",
                  description: "Aluminum removable head jerrican",
                },
                {
                  code: "3H2",
                  material: "plastic",
                  description: "Plastic removable head jerrican",
                },
              ],
            },
            {
              type: "boxes",
              subtype: "various_materials",
              containers: [
                { code: "4A", material: "steel", description: "Steel box" },
                {
                  code: "4B",
                  material: "aluminum",
                  description: "Aluminum box",
                },
                {
                  code: "4C1",
                  material: "natural_wood",
                  description: "Natural wood box",
                },
                {
                  code: "4C2",
                  material: "sift_proof_wood",
                  description: "Sift-proof natural wood box",
                },
                { code: "4D", material: "plywood", description: "Plywood box" },
                {
                  code: "4F",
                  material: "reconstituted_wood",
                  description: "Reconstituted wood box",
                },
                {
                  code: "4G",
                  material: "fiberboard",
                  description: "Fiberboard box",
                },
                {
                  code: "4H1",
                  material: "expanded_plastic",
                  description: "Expanded plastic box",
                },
                {
                  code: "4H2",
                  material: "solid_plastic",
                  description: "Solid plastic box",
                },
                {
                  code: "4N",
                  material: "other_metal",
                  description: "Other metal box",
                },
              ],
            },
          ],
        },
        restrictions: [
          "Maximum 125 ml (4.22 ounces) organic peroxide per inner packaging for liquids",
          "Maximum 500 g (1 lb) organic peroxide per inner packaging for solids",
          "Only organic peroxides of Type D, E, or F not requiring temperature controls are authorized",
        ],
        isComplete: true,
      },
      {
        id: "A7.6.flammable_liquid",
        type: "combination",
        description:
          "Flammable liquid base material component packaging (A7.6.2)",
        innerPackaging: {
          required: true,
          description:
            "Receptacle of glass, earthenware, plastic, metal or aluminum",
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "drums",
              subtype: "removable_head_various",
              containers: [
                {
                  code: "1A2",
                  material: "steel",
                  description: "Steel removable head drum",
                },
                {
                  code: "1B2",
                  material: "aluminum",
                  description: "Aluminum removable head drum",
                },
                { code: "1G", material: "fiber", description: "Fiber drum" },
                {
                  code: "1H2",
                  material: "plastic",
                  description: "Plastic removable head drum",
                },
                {
                  code: "1N2",
                  material: "other_metal",
                  description: "Other metal removable head drum",
                },
              ],
            },
            {
              type: "jerricans",
              subtype: "removable_head_various",
              containers: [
                {
                  code: "3A2",
                  material: "steel",
                  description: "Steel removable head jerrican",
                },
                {
                  code: "3B2",
                  material: "aluminum",
                  description: "Aluminum removable head jerrican",
                },
                {
                  code: "3H2",
                  material: "plastic",
                  description: "Plastic removable head jerrican",
                },
              ],
            },
            {
              type: "boxes",
              subtype: "various_materials",
              containers: [
                { code: "4A", material: "steel", description: "Steel box" },
                {
                  code: "4B",
                  material: "aluminum",
                  description: "Aluminum box",
                },
                {
                  code: "4C1",
                  material: "natural_wood",
                  description: "Natural wood box",
                },
                {
                  code: "4C2",
                  material: "sift_proof_wood",
                  description: "Sift-proof natural wood box",
                },
                { code: "4D", material: "plywood", description: "Plywood box" },
                {
                  code: "4F",
                  material: "reconstituted_wood",
                  description: "Reconstituted wood box",
                },
                {
                  code: "4G",
                  material: "fiberboard",
                  description: "Fiberboard box",
                },
                {
                  code: "4H1",
                  material: "expanded_plastic",
                  description: "Expanded plastic box",
                },
                {
                  code: "4H2",
                  material: "solid_plastic",
                  description: "Solid plastic box",
                },
                {
                  code: "4N",
                  material: "other_metal",
                  description: "Other metal box",
                },
              ],
            },
          ],
        },
        restrictions: [
          "Secure closures on inner packagings containing liquids by secondary means",
        ],
        isComplete: true,
      },
    ],

    specialRequirements: [
      {
        type: "compatibility",
        description:
          "Polyester resin kits consist of two components: a base material in Class 3, PG II or III, and an organic peroxide activator",
        mandatory: true,
        applicableContainers: [
          "A7.6.organic_peroxide",
          "A7.6.flammable_liquid",
        ],
      },
      {
        type: "compatibility",
        description:
          "Only organic peroxides of Type D, E, or F not requiring temperature controls are authorized",
        mandatory: true,
        applicableContainers: ["A7.6.organic_peroxide"],
      },
      {
        type: "compatibility",
        description:
          "Components may be placed in the same outer packaging provided they will not react dangerously in the event of leakage",
        mandatory: true,
        applicableContainers: [
          "A7.6.organic_peroxide",
          "A7.6.flammable_liquid",
        ],
      },
      {
        type: "closure_security",
        description:
          "Secure closures on inner packagings containing liquids by secondary means",
        mandatory: true,
        applicableContainers: ["A7.6.flammable_liquid"],
      },
      {
        type: "quantity_control",
        description:
          "Ensure each component is separately packed in an inner packaging",
        mandatory: true,
        applicableContainers: [
          "A7.6.organic_peroxide",
          "A7.6.flammable_liquid",
        ],
      },
    ],

    quantityLimits: [
      {
        scope: "organic_peroxide_liquid",
        value: 125,
        unit: "ml",
        description:
          "Maximum 125 ml (4.22 ounces) of organic peroxide per inner packaging for liquids",
      },
      {
        scope: "organic_peroxide_solid",
        value: 500,
        unit: "g",
        description:
          "Maximum 500 g (1 lb) of organic peroxide per inner packaging for solids",
      },
      {
        scope: "pg_ii_base_material_metal_plastic",
        value: 5,
        unit: "L",
        description:
          "PG II base material limited to 5 L (1.3 gallons) in metal or plastic inner packagings",
      },
      {
        scope: "pg_ii_base_material_glass",
        value: 1,
        unit: "L",
        description:
          "PG II base material limited to 1 L (0.3 gallons) in glass inner packagings",
      },
      {
        scope: "pg_iii_base_material_metal_plastic",
        value: 10,
        unit: "L",
        description:
          "PG III base material limited to 10 L (2.6 gallons) in metal or plastic inner packagings",
      },
      {
        scope: "pg_iii_base_material_glass",
        value: 2.5,
        unit: "L",
        description:
          "PG III base material limited to 2.5 L (0.66 gallons) in glass inner packagings",
      },
    ],

    packingGroupRestrictions: [
      {
        packingGroup: "II",
        restrictions: [
          "Total quantity of activator and base material may not exceed 5 kg (11 pounds) per package",
          "Assign PG II according to criteria for Class 3 applied to base material",
        ],
      },
      {
        packingGroup: "III",
        restrictions: [
          "Total quantity of activator and base material may not exceed 10 kg (22 pounds) per package",
          "Assign PG III according to criteria for Class 3 applied to base material",
        ],
      },
    ],

    conditionalRequirements: [
      {
        condition: "base_material_packing_group = 'II'",
        requirements: [
          {
            type: "quantity_control",
            description:
              "Total quantity of activator and base material may not exceed 5 kg (11 pounds) per package",
            mandatory: true,
            applicableContainers: [
              "A7.6.organic_peroxide",
              "A7.6.flammable_liquid",
            ],
          },
        ],
      },
      {
        condition: "base_material_packing_group = 'III'",
        requirements: [
          {
            type: "quantity_control",
            description:
              "Total quantity of activator and base material may not exceed 10 kg (22 pounds) per package",
            mandatory: true,
            applicableContainers: [
              "A7.6.organic_peroxide",
              "A7.6.flammable_liquid",
            ],
          },
        ],
      },
      {
        condition:
          "inner_packaging_material = 'glass' AND base_material_packing_group = 'II'",
        requirements: [
          {
            type: "volume_limits",
            description:
              "PG II base material in glass inner packagings limited to 1 L (0.3 gallons)",
            mandatory: true,
            applicableContainers: ["A7.6.flammable_liquid"],
          },
        ],
      },
      {
        condition:
          "inner_packaging_material = 'glass' AND base_material_packing_group = 'III'",
        requirements: [
          {
            type: "volume_limits",
            description:
              "PG III base material in glass inner packagings limited to 2.5 L (0.66 gallons)",
            mandatory: true,
            applicableContainers: ["A7.6.flammable_liquid"],
          },
        ],
      },
      {
        condition:
          "inner_packaging_material IN ('metal', 'plastic') AND base_material_packing_group = 'II'",
        requirements: [
          {
            type: "volume_limits",
            description:
              "PG II base material in metal or plastic inner packagings limited to 5 L (1.3 gallons)",
            mandatory: true,
            applicableContainers: ["A7.6.flammable_liquid"],
          },
        ],
      },
      {
        condition:
          "inner_packaging_material IN ('metal', 'plastic') AND base_material_packing_group = 'III'",
        requirements: [
          {
            type: "volume_limits",
            description:
              "PG III base material in metal or plastic inner packagings limited to 10 L (2.6 gallons)",
            mandatory: true,
            applicableContainers: ["A7.6.flammable_liquid"],
          },
        ],
      },
    ],

    referencedParagraphs: ["A7.6.1", "A7.6.2"],
  },
  "A7.7.": {
    paragraphId: "A7.7.",
    hazardClass: 3,
    description: "Fuel Cell Cartridges",
    lastUpdated: new Date().toISOString(),
    entryType: "equipment",
    materialTypes: ["fuel_cell_cartridges"],

    packagingOptions: [
      {
        id: "A7.7.cartridge_packaging",
        type: "combination",
        description:
          "Fuel cell cartridge packaging in drums, jerricans or boxes (A7.7.1)",
        innerPackaging: {
          required: true,
          description: "Cartridge receptacle containing fuel cell",
          materials: ["Cartridge receptacle"],
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "drums",
              subtype: "removable_head_various",
              containers: [
                {
                  code: "1A2",
                  material: "steel",
                  description: "Steel removable head drum",
                },
                {
                  code: "1B2",
                  material: "aluminum",
                  description: "Aluminum removable head drum",
                },
                {
                  code: "1D",
                  material: "plywood",
                  description: "Plywood drum",
                },
                { code: "1G", material: "fiber", description: "Fiber drum" },
                {
                  code: "1H2",
                  material: "plastic",
                  description: "Plastic removable head drum",
                },
                {
                  code: "1N2",
                  material: "other_metal",
                  description: "Other metal removable head drum",
                },
              ],
            },
            {
              type: "jerricans",
              subtype: "removable_head_various",
              containers: [
                {
                  code: "3A2",
                  material: "steel",
                  description: "Steel removable head jerrican",
                },
                {
                  code: "3B2",
                  material: "aluminum",
                  description: "Aluminum removable head jerrican",
                },
                {
                  code: "3H2",
                  material: "plastic",
                  description: "Plastic removable head jerrican",
                },
              ],
            },
            {
              type: "boxes",
              subtype: "various_materials",
              containers: [
                { code: "4A", material: "steel", description: "Steel box" },
                {
                  code: "4B",
                  material: "aluminum",
                  description: "Aluminum box",
                },
                {
                  code: "4C1",
                  material: "natural_wood",
                  description: "Natural wood box",
                },
                {
                  code: "4C2",
                  material: "sift_proof_wood",
                  description: "Sift-proof natural wood box",
                },
                { code: "4D", material: "plywood", description: "Plywood box" },
                {
                  code: "4F",
                  material: "reconstituted_wood",
                  description: "Reconstituted wood box",
                },
                {
                  code: "4G",
                  material: "fiberboard",
                  description: "Fiberboard box",
                },
                {
                  code: "4H1",
                  material: "expanded_plastic",
                  description: "Expanded plastic box",
                },
                {
                  code: "4H2",
                  material: "solid_plastic",
                  description: "Solid plastic box",
                },
                {
                  code: "4N",
                  material: "other_metal",
                  description: "Other metal box",
                },
              ],
            },
          ],
        },
        restrictions: [],
        isComplete: true,
      },
    ],

    specialRequirements: [
      {
        type: "equipment",
        description:
          "Fuel cell cartridges are standalone units containing flammable liquid fuel for fuel cell operation",
        mandatory: true,
        applicableContainers: ["A7.7.cartridge_packaging"],
      },
      {
        type: "handling",
        description:
          "Protect cartridges from damage during transportation through proper packaging",
        mandatory: true,
        applicableContainers: ["A7.7.cartridge_packaging"],
      },
    ],

    quantityLimits: [],

    conditionalRequirements: [],

    referencedParagraphs: ["A7.7.1"],
  },
  "A7.8.": {
    paragraphId: "A7.8.",
    hazardClass: 3,
    description: "Fuel Cell Cartridges Contained in Equipment",
    lastUpdated: new Date().toISOString(),
    entryType: "exception",
    materialTypes: ["fuel_cell_cartridges_in_equipment"],

    packagingOptions: [
      {
        id: "A7.8.equipment_packaging",
        type: "single",
        description:
          "Fuel cells installed in equipment - UN specification packaging not required (A7.8.1)",
        innerPackaging: {
          required: false,
          description: "Fuel cells are installed within the equipment itself",
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "equipment",
              subtype: "protective_equipment_housing",
              containers: [
                {
                  code: "EQUIPMENT",
                  material: "various",
                  description:
                    "Equipment housing that protects fuel cells against short circuit and inadvertent operation",
                },
              ],
            },
          ],
        },
        restrictions: [
          "UN specification packaging is not required",
          "Fuel cell systems may not charge batteries during transport",
          "Must protect against short circuit",
          "Must protect against inadvertent operation",
        ],
        notes: [
          "Excepted from standard UN specification packaging requirements",
          "Equipment itself provides protection for installed fuel cells",
        ],
        isComplete: true,
      },
    ],

    specialRequirements: [
      {
        type: "static_prevention",
        description:
          "Protect fuel cells installed in equipment against short circuit",
        mandatory: true,
        applicableContainers: ["A7.8.equipment_packaging"],
      },
      {
        type: "handling",
        description: "Protect the entire system against inadvertent operation",
        mandatory: true,
        applicableContainers: ["A7.8.equipment_packaging"],
      },
      {
        type: "static_prevention",
        description:
          "Protect the terminals of the installed fuel cells to prevent short circuit by use of protective coverings, taping, etc.",
        mandatory: true,
        applicableContainers: ["A7.8.equipment_packaging"],
      },
      {
        type: "equipment",
        description:
          "Fuel cell systems may not charge batteries during transport",
        mandatory: true,
        applicableContainers: ["A7.8.equipment_packaging"],
      },
      {
        type: "compatibility",
        description:
          "UN specification packaging is not required for fuel cells contained in equipment",
        mandatory: true,
        applicableContainers: ["A7.8.equipment_packaging"],
      },
    ],

    quantityLimits: [],

    conditionalRequirements: [
      {
        condition: "fuel_cell_installation_status = 'installed_in_equipment'",
        requirements: [
          {
            type: "static_prevention",
            description:
              "Terminals must be protected to prevent short circuit using protective coverings, taping, or other methods",
            mandatory: true,
            applicableContainers: ["A7.8.equipment_packaging"],
          },
        ],
      },
      {
        condition: "transport_mode = 'active'",
        requirements: [
          {
            type: "equipment",
            description:
              "Fuel cell systems must be deactivated and may not charge batteries during transport",
            mandatory: true,
            applicableContainers: ["A7.8.equipment_packaging"],
          },
        ],
      },
    ],

    referencedParagraphs: ["A7.8.1", "A7.8.2"],
  },
  "A7.9.": {
    paragraphId: "A7.9.",
    hazardClass: 3,
    description: "Fuel Cell Packed With Equipment",
    lastUpdated: new Date().toISOString(),
    entryType: "exception",
    materialTypes: ["fuel_cell_cartridges_packed_with_equipment"],

    packagingOptions: [
      {
        id: "A7.9.packed_with_equipment",
        type: "combination",
        description:
          "Fuel cells packed with equipment - UN specification packaging not required (A7.9.1)",
        innerPackaging: {
          required: true,
          description:
            "Inner packagings or placement in outer packaging with cushioning material or dividers to protect fuel cartridges from damage",
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "protective_packaging",
              subtype: "cushioned_outer_packaging",
              containers: [
                {
                  code: "PROTECTIVE",
                  material: "various",
                  description:
                    "Outer packaging with cushioning material or dividers protecting fuel cartridges from damage during transportation",
                },
              ],
            },
          ],
        },
        restrictions: [
          "UN specification packaging is not required",
          "Fuel cells must be in inner packagings or placed with cushioning/dividers",
          "Maximum cartridges: equipment requirement plus two spares",
          "Protection from damage during transportation required",
        ],
        notes: [
          "Excepted from UN specification packaging requirements",
          "Focus on damage prevention through cushioning and separation",
        ],
        isComplete: true,
      },
      {
        id: "A7.9.packed_with_equipment_single",
        type: "single",
        description:
          "Fuel cells placed in outer packaging with cushioning or dividers (A7.9.1)",
        innerPackaging: {
          required: false,
          description:
            "Fuel cells placed in outer packaging with cushioning material or dividers",
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "protective_packaging",
              subtype: "cushioned_outer_packaging",
              containers: [
                {
                  code: "PROTECTIVE",
                  material: "various",
                  description:
                    "Outer packaging with cushioning material or dividers protecting fuel cartridges from damage during transportation",
                },
              ],
            },
          ],
        },
        restrictions: [
          "UN specification packaging is not required",
          "Fuel cells placed with cushioning/dividers",
          "Maximum cartridges: equipment requirement plus two spares",
        ],
        notes: [
          "Excepted from UN specification packaging requirements",
          "Outer packaging must prevent damage during transportation",
        ],
        isComplete: true,
      },
    ],

    specialRequirements: [
      {
        type: "cushioning",
        description:
          "Pack fuel cells in inner packagings or place in the outer packaging with cushioning material or divider(s) to protect fuel cartridges from damage during transportation",
        mandatory: true,
        applicableContainers: [
          "A7.9.packed_with_equipment",
          "A7.9.packed_with_equipment_single",
        ],
      },
      {
        type: "quantity_control",
        description:
          "The maximum number of fuel cell cartridges in the intermediate packaging may not be more than the number required to power the equipment plus two spares",
        mandatory: true,
        applicableContainers: [
          "A7.9.packed_with_equipment",
          "A7.9.packed_with_equipment_single",
        ],
      },
      {
        type: "compatibility",
        description:
          "UN specification packaging is not required for fuel cells packed with equipment",
        mandatory: true,
        applicableContainers: [
          "A7.9.packed_with_equipment",
          "A7.9.packed_with_equipment_single",
        ],
      },
      {
        type: "handling",
        description:
          "Protect fuel cartridges from damage during transportation through proper cushioning and divider placement",
        mandatory: true,
        applicableContainers: [
          "A7.9.packed_with_equipment",
          "A7.9.packed_with_equipment_single",
        ],
      },
    ],

    quantityLimits: [
      {
        scope: "fuel_cell_cartridges_per_package",
        value: "equipment_requirement_plus_two",
        unit: "cartridges",
        description:
          "Maximum number of fuel cell cartridges may not exceed equipment power requirements plus two spares",
      },
    ],

    conditionalRequirements: [
      {
        condition: "packaging_method = 'inner_packaging'",
        requirements: [
          {
            type: "cushioning",
            description:
              "When using inner packagings, ensure adequate protection from damage during transportation",
            mandatory: true,
            applicableContainers: [
              "A7.9.packed_with_equipment",
              "A7.9.packed_with_equipment_single",
            ],
          },
        ],
      },
      {
        condition: "packaging_method = 'outer_packaging_with_cushioning'",
        requirements: [
          {
            type: "cushioning",
            description:
              "When placing directly in outer packaging, use cushioning material or dividers to protect cartridges",
            mandatory: true,
            applicableContainers: [
              "A7.9.packed_with_equipment",
              "A7.9.packed_with_equipment_single",
            ],
          },
        ],
      },
      {
        condition: "spare_cartridge_count > 2",
        requirements: [
          {
            type: "quantity_control",
            description:
              "May not exceed two spare cartridges beyond equipment power requirements",
            mandatory: true,
            applicableContainers: [
              "A7.9.packed_with_equipment",
              "A7.9.packed_with_equipment_single",
            ],
          },
        ],
      },
    ],

    referencedParagraphs: ["A7.9.1"],
  },
  "A7.10.": {
    paragraphId: "A7.10.",
    hazardClass: 3,
    description: "Package Chlorosilanes as follows",
    lastUpdated: new Date().toISOString(),
    entryType: "specialized",
    materialTypes: ["chlorosilanes"],

    packagingOptions: [
      {
        id: "A7.10.combination",
        type: "combination",
        description: "Combination drums or boxes (A7.10.1)",
        innerPackaging: {
          required: true,
          materials: ["Glass receptacles", "Steel receptacles"],
          description: "Glass or steel receptacles",
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "drums",
              subtype: "removable_head_various",
              containers: [
                {
                  code: "1A2",
                  material: "steel",
                  description: "Steel removable head drum",
                },
                {
                  code: "1D",
                  material: "plywood",
                  description: "Plywood drum",
                },
                { code: "1G", material: "fiber", description: "Fiber drum" },
                {
                  code: "1H2",
                  material: "plastic",
                  description: "Plastic removable head drum",
                },
              ],
            },
            {
              type: "boxes",
              subtype: "various_materials",
              containers: [
                { code: "4A", material: "steel", description: "Steel box" },
                {
                  code: "4C1",
                  material: "natural_wood",
                  description: "Natural wood box",
                },
                {
                  code: "4C2",
                  material: "sift_proof_wood",
                  description: "Sift-proof natural wood box",
                },
                { code: "4D", material: "plywood", description: "Plywood box" },
                {
                  code: "4F",
                  material: "reconstituted_wood",
                  description: "Reconstituted wood box",
                },
                {
                  code: "4G",
                  material: "fiberboard",
                  description: "Fiberboard box",
                },
                {
                  code: "4H1",
                  material: "expanded_plastic",
                  description: "Expanded plastic box",
                },
                {
                  code: "4H2",
                  material: "solid_plastic",
                  description: "Solid plastic box",
                },
              ],
            },
          ],
        },
        restrictions: [
          "Inner receptacles must be glass or steel",
          "Packaging must meet PG I or PG II performance standards",
        ],
        isComplete: true,
      },
      {
        id: "A7.10.composite",
        type: "composite_plastic",
        description: "Composite drums with plastic inner receptacle (A7.10.2)",
        innerPackaging: {
          required: true,
          description: "Plastic inner receptacle",
          materials: ["Plastic inner receptacles"],
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "composite_drum",
              subtype: "steel_drum_plastic_inner",
              containers: [
                {
                  code: "6HA1",
                  material: "steel_plastic_composite",
                  description: "Steel drum with plastic inner receptacle",
                },
              ],
            },
          ],
        },
        restrictions: [
          "Packaging must meet PG I or PG II performance standards",
        ],
        isComplete: true,
      },
      {
        id: "A7.10.single",
        type: "single",
        description: "Single drums or jerricans (A7.10.3)",
        innerPackaging: {
          required: false,
          description: "Not required for single packaging",
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "drums",
              subtype: "steel_non_removable",
              containers: [
                {
                  code: "1A1",
                  material: "steel",
                  description: "Steel drum (non-removable head)",
                },
              ],
            },
            {
              type: "jerricans",
              subtype: "steel_non_removable",
              containers: [
                {
                  code: "3A1",
                  material: "steel",
                  description: "Steel jerrican (non-removable head)",
                },
              ],
            },
          ],
        },
        restrictions: [
          "Packaging must meet PG I or PG II performance standards",
        ],
        isComplete: true,
      },
      {
        id: "A7.10.cylinders",
        type: "cylinder",
        description: "Cylinders as prescribed for compressed gas (A7.10.4)",
        innerPackaging: {
          required: false,
          description: "Not required for cylinder packaging",
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "cylinders",
              subtype: "compressed_gas_specification",
              containers: [
                {
                  code: "CYLINDER",
                  material: "various",
                  description: "Cylinders as prescribed for any compressed gas",
                },
              ],
            },
          ],
        },
        restrictions: [
          "Cylinders for acetylene (DOT 8, 8AL) are not authorized",
          "3HT cylinders are not authorized",
          "Aluminum cylinders are not authorized",
        ],
        isComplete: true,
      },
    ],

    specialRequirements: [
      {
        type: "testing",
        description:
          "Packaging meeting the PG I or PG II performance standards is required",
        mandatory: true,
        applicableContainers: [
          "A7.10.combination",
          "A7.10.composite",
          "A7.10.single",
        ],
      },
      {
        type: "material_compatibility",
        description:
          "Inner receptacles for combination packaging must be glass or steel only",
        mandatory: true,
        applicableContainers: ["A7.10.combination"],
      },
      {
        type: "material_compatibility",
        description:
          "Composite packaging must use plastic inner receptacle with steel drum",
        mandatory: true,
        applicableContainers: ["A7.10.composite"],
      },
      {
        type: "material_compatibility",
        description: "Single packaging must use steel drums or jerricans only",
        mandatory: true,
        applicableContainers: ["A7.10.single"],
      },
      {
        type: "compatibility",
        description:
          "Cylinders for acetylene, 3HT, and aluminum cylinders are not authorized for chlorosilanes",
        mandatory: true,
        applicableContainers: ["A7.10.cylinders"],
      },
    ],

    quantityLimits: [],

    packingGroupRestrictions: [
      {
        packingGroup: "I",
        restrictions: [
          "All packaging options available",
          "Must meet PG I performance standards",
        ],
      },
      {
        packingGroup: "II",
        restrictions: [
          "All packaging options available",
          "Must meet PG II performance standards",
        ],
      },
    ],

    conditionalRequirements: [
      {
        condition: "packaging_type = 'combination'",
        requirements: [
          {
            type: "material_compatibility",
            description:
              "Inner receptacles must be constructed of glass or steel materials only",
            mandatory: true,
            applicableContainers: ["A7.10.combination"],
          },
        ],
      },
      {
        condition: "packaging_type = 'composite'",
        requirements: [
          {
            type: "material_compatibility",
            description:
              "Must use 6HA1 steel drum with plastic inner receptacle configuration",
            mandatory: true,
            applicableContainers: ["A7.10.composite"],
          },
        ],
      },
      {
        condition: "packaging_type = 'single'",
        requirements: [
          {
            type: "material_compatibility",
            description:
              "Must use steel drums (1A1) or steel jerricans (3A1) with non-removable heads",
            mandatory: true,
            applicableContainers: ["A7.10.single"],
          },
        ],
      },
      {
        condition: "packaging_type = 'cylinder'",
        requirements: [
          {
            type: "compatibility",
            description:
              "Must not use acetylene cylinders (DOT 8, 8AL), 3HT cylinders, or aluminum cylinders",
            mandatory: true,
            applicableContainers: ["A7.10.cylinders"],
          },
        ],
      },
    ],

    referencedParagraphs: ["A7.10.1", "A7.10.2", "A7.10.3", "A7.10.4"],
  },
  "A7.11.": {
    paragraphId: "A7.11.",
    hazardClass: 3,
    description:
      "Package Flammable Liquid powered engines, machinery and SE as follows",
    lastUpdated: new Date().toISOString(),
    entryType: "equipment",
    materialTypes: [
      "flammable_liquid_powered_engines",
      "machinery",
      "support_equipment",
    ],

    packagingOptions: [
      {
        id: "A7.11.equipment_packaging",
        type: "single",
        description:
          "Engines, machinery, and support equipment with fuel system preparation",
        innerPackaging: {
          required: false,
          description:
            "Equipment fuel systems and components (engines, fuel tanks, lines)",
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "equipment",
              subtype: "protective_orientation_packaging",
              containers: [
                {
                  code: "EQUIPMENT",
                  material: "various",
                  description:
                    "Strong, rigid outer packaging preventing accidental leakage and movement during transport",
                },
              ],
            },
          ],
        },
        restrictions: [
          "Completely drain engine-powered SE of fuel",
          "Up to 500 ml (17 ounces) may remain in engine components and fuel lines",
          "All lines and fuel tanks must be securely closed to prevent leakage",
          "Equipment must be secured to prevent orientation changes",
        ],
        notes: [
          "Use equipment service or technical manual to prepare item for shipment",
          "Engines drained and purged according to technical manual are nonhazardous",
        ],
        isComplete: true,
      },
    ],

    specialRequirements: [
      {
        type: "handling",
        description:
          "Use the equipment service or technical manual to prepare item for shipment",
        mandatory: true,
        applicableContainers: ["A7.11.equipment_packaging"],
      },
      {
        type: "quantity_control",
        description:
          "Completely drain engine-powered SE of fuel. Up to 500 ml (17 ounces) of fuel may be left in engine components and fuel lines",
        mandatory: true,
        applicableContainers: ["A7.11.equipment_packaging"],
      },
      {
        type: "closure_security",
        description:
          "Ensure all lines and fuel tanks are securely closed to prevent leakage of fuel",
        mandatory: true,
        applicableContainers: ["A7.11.equipment_packaging"],
      },
      {
        type: "handling",
        description:
          "Check serviceability, proper installation and security of vent caps on diesel generators with vertical, mast-type fuel vents",
        mandatory: true,
        applicableContainers: ["A7.11.equipment_packaging"],
      },
      {
        type: "orientation",
        description:
          "Where equipment could be handled in other than upright position, secure in strong, rigid outer packaging to prevent accidental leakage and movement",
        mandatory: true,
        applicableContainers: ["A7.11.equipment_packaging"],
      },
      {
        type: "static_prevention",
        description:
          "Protect terminals of installed batteries to prevent short circuit by use of protective coverings, taping, etc.",
        mandatory: true,
        applicableContainers: ["A7.11.equipment_packaging"],
      },
      {
        type: "compatibility",
        description:
          "Engines drained and purged according to technical manual and containing no other hazardous material are nonhazardous for transportation",
        mandatory: false,
        applicableContainers: ["A7.11.equipment_packaging"],
      },
    ],

    quantityLimits: [
      {
        scope: "residual_fuel_standard",
        value: 500,
        unit: "ml",
        description:
          "Maximum 500 ml (17 ounces) of fuel may remain in engine components and fuel lines",
      },
      {
        scope: "wheeled_equipment_half_tank",
        value: 0.5,
        unit: "tank_fraction",
        description:
          "Wheeled engine powered SE may contain up to one-half tank of fuel when transported under Chapter 3 authority",
      },
      {
        scope: "hobart_86_quarter_tank",
        value: 0.25,
        unit: "tank_fraction",
        description:
          "Hobart-86 all models shipped with no more than one-quarter tank of fuel",
      },
    ],

    conditionalRequirements: [
      {
        condition:
          "equipment_type = 'large_fuel_system' AND fuel_quantity > 500ml",
        requirements: [
          {
            type: "quantity_control",
            description:
              "Drain to extent no free standing liquid remains in fuel tank, lines, or system",
            mandatory: true,
            applicableContainers: ["A7.11.equipment_packaging"],
          },
        ],
      },
      {
        condition:
          "transport_authority = 'chapter_3' AND equipment_type = 'wheeled'",
        requirements: [
          {
            type: "quantity_control",
            description:
              "May contain up to one-half tank of fuel. Ship minimum quantity consistent with operational requirements",
            mandatory: true,
            applicableContainers: ["A7.11.equipment_packaging"],
          },
        ],
      },
      {
        condition: "equipment_model = 'hobart_86'",
        requirements: [
          {
            type: "quantity_control",
            description:
              "Ship with no more than one-quarter tank of fuel and load with filler neck facing forward",
            mandatory: true,
            applicableContainers: ["A7.11.equipment_packaging"],
          },
        ],
      },
      {
        condition:
          "equipment_type = 'single_axle' AND loading_position = 'tongue_on_floor'",
        requirements: [
          {
            type: "quantity_control",
            description:
              "Completely drain single axle equipment loaded with tongue resting on aircraft floor",
            mandatory: true,
            applicableContainers: ["A7.11.equipment_packaging"],
          },
        ],
      },
      {
        condition:
          "equipment_status = 'damaged_or_inoperable' OR purging_facilities = 'unavailable'",
        requirements: [
          {
            type: "quantity_control",
            description:
              "Drain to maximum extent possible and install plugs, caps, and covers over all openings as required by technical directives",
            mandatory: true,
            applicableContainers: ["A7.11.equipment_packaging"],
          },
        ],
      },
      {
        condition: "container_loading = true",
        requirements: [
          {
            type: "quantity_control",
            description:
              "Drain fuel tanks. Purge if required by technical directive or if flash point < 38°C (100°F)",
            mandatory: true,
            applicableContainers: ["A7.11.equipment_packaging"],
          },
        ],
      },
      {
        condition: "flash_point < 38",
        requirements: [
          {
            type: "handling",
            description:
              "Purge bulk tanks for all liquids with flash point below 38°C (100°F) regardless of technical manual requirements",
            mandatory: true,
            applicableContainers: ["A7.11.equipment_packaging"],
          },
        ],
      },
      {
        condition: "spill_susceptibility = true",
        requirements: [
          {
            type: "handling",
            description:
              "Unit must be drained and capped when susceptible to fuel spills or leakage",
            mandatory: true,
            applicableContainers: ["A7.11.equipment_packaging"],
          },
        ],
      },
    ],

    referencedParagraphs: [
      "A7.11.1",
      "A7.11.2",
      "A7.11.3",
      "A3.3.3.4",
      "A3.1.16.4",
    ],
  },
  "A7.12.": {
    paragraphId: "A7.12.",
    hazardClass: 3,
    description: "UN3540, Articles containing flammable liquid, N.O.S.",
    lastUpdated: new Date().toISOString(),
    entryType: "specialized",
    materialTypes: ["articles_containing_flammable_liquid_nos", "un3540"],
    applicableUNNumbers: ["UN3540"],

    packagingOptions: [
      {
        id: "A7.12.packaged_articles",
        type: "combination",
        description: "Packaged articles with internal receptacles (A7.12.1)",
        innerPackaging: {
          required: true,
          description:
            "Receptacles constructed of suitable materials and secured in the article to prevent breakage, puncture, or leakage during normal transport conditions",
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "drums",
              subtype: "removable_head_various",
              containers: [
                {
                  code: "1A2",
                  material: "steel",
                  description: "Steel removable head drum",
                },
                {
                  code: "1B2",
                  material: "aluminum",
                  description: "Aluminum removable head drum",
                },
                {
                  code: "1N2",
                  material: "other_metal",
                  description: "Other metal removable head drum",
                },
                {
                  code: "1D",
                  material: "plywood",
                  description: "Plywood drum",
                },
                { code: "1G", material: "fiber", description: "Fiber drum" },
                {
                  code: "1H2",
                  material: "plastic",
                  description: "Plastic removable head drum",
                },
              ],
            },
            {
              type: "boxes",
              subtype: "various_materials",
              containers: [
                { code: "4A", material: "steel", description: "Steel box" },
                {
                  code: "4B",
                  material: "aluminum",
                  description: "Aluminum box",
                },
                {
                  code: "4C1",
                  material: "natural_wood",
                  description: "Natural wood box",
                },
                {
                  code: "4C2",
                  material: "sift_proof_wood",
                  description: "Sift-proof natural wood box",
                },
                { code: "4D", material: "plywood", description: "Plywood box" },
                {
                  code: "4F",
                  material: "reconstituted_wood",
                  description: "Reconstituted wood box",
                },
                {
                  code: "4G",
                  material: "fiberboard",
                  description: "Fiberboard box",
                },
                {
                  code: "4H1",
                  material: "expanded_plastic",
                  description: "Expanded plastic box",
                },
                {
                  code: "4H2",
                  material: "solid_plastic",
                  description: "Solid plastic box",
                },
                {
                  code: "4N",
                  material: "other_metal",
                  description: "Other metal box",
                },
              ],
            },
            {
              type: "jerricans",
              subtype: "removable_head_various",
              containers: [
                {
                  code: "3A2",
                  material: "steel",
                  description: "Steel removable head jerrican",
                },
                {
                  code: "3H2",
                  material: "plastic",
                  description: "Plastic removable head jerrican",
                },
                {
                  code: "3B2",
                  material: "aluminum",
                  description: "Aluminum removable head jerrican",
                },
              ],
            },
          ],
        },
        restrictions: [
          "Pack articles to prevent movement and inadvertent operation during normal conditions of transport",
          "Pack inner receptacles within their outer packaging with closures correctly oriented",
          "Packagings meeting Packing Group II performance are required",
        ],
        notes: [
          "Articles must be classified per paragraph A4.2.3",
          "Maximum net quantity per package 60 L",
        ],
        isComplete: true,
      },
      {
        id: "A7.12.robust_packaged",
        type: "single",
        description: "Robust articles in strong outer packagings (A7.12.2.1)",
        innerPackaging: {
          required: false,
          description:
            "Article itself provides containment for flammable liquid",
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "specialized",
              subtype: "strong_protective_packaging",
              containers: [
                {
                  code: "STRONG",
                  material: "suitable",
                  description:
                    "Strong outer packagings constructed of suitable material and of adequate strength and design",
                },
              ],
            },
          ],
        },
        restrictions: [
          "Articles must be robust",
          "Outer packaging must be of adequate strength and design in relation to packaging capacity and intended use",
        ],
        isComplete: true,
      },
      {
        id: "A7.12.robust_unpackaged",
        type: "single",
        description: "Robust articles unpackaged or on pallets (A7.12.2.2)",
        innerPackaging: {
          required: false,
          description:
            "Article itself provides containment for flammable liquid",
        },
        outerPackaging: {
          required: false,
          categories: [
            {
              type: "specialized",
              subtype: "equivalent_protection",
              containers: [
                {
                  code: "UNPACKAGED",
                  material: "article",
                  description:
                    "Unpackaged or on pallets when article provides equivalent protection",
                },
              ],
            },
          ],
        },
        restrictions: [
          "Articles must be robust",
          "Dangerous goods must be afforded equivalent protection by the article in which they are contained",
        ],
        isComplete: true,
      },
    ],

    specialRequirements: [
      {
        type: "handling",
        description:
          "Pack articles to prevent movement and inadvertent operation during normal conditions of transport",
        mandatory: true,
        applicableContainers: ["A7.12.packaged_articles"],
      },
      {
        type: "orientation",
        description:
          "Pack inner receptacles within their outer packaging with closures correctly oriented",
        mandatory: true,
        applicableContainers: ["A7.12.packaged_articles"],
      },
      {
        type: "material_compatibility",
        description:
          "Receptacles must be constructed of suitable materials and secured in the article to prevent breakage, puncture, or leakage during normal transport conditions",
        mandatory: true,
        applicableContainers: ["A7.12.packaged_articles"],
      },
      {
        type: "compatibility",
        description:
          "Where there is no receptacle within the article, the article must fully enclose the dangerous goods and prevent their release under normal conditions of transport",
        mandatory: true,
        applicableContainers: [
          "A7.12.packaged_articles",
          "A7.12.robust_packaged",
          "A7.12.robust_unpackaged",
        ],
      },
      {
        type: "testing",
        description:
          "Packagings meeting Packing Group II performance are required for packaged articles",
        mandatory: true,
        applicableContainers: ["A7.12.packaged_articles"],
      },
      {
        type: "material_compatibility",
        description:
          "Strong outer packagings must be constructed of suitable material and of adequate strength and design in relation to the packaging capacity and its intended use",
        mandatory: true,
        applicableContainers: ["A7.12.robust_packaged"],
      },
      {
        type: "compatibility",
        description:
          "For unpackaged robust articles, dangerous goods must be afforded equivalent protection by the article in which they are contained",
        mandatory: true,
        applicableContainers: ["A7.12.robust_unpackaged"],
      },
    ],

    quantityLimits: [
      {
        scope: "per_package",
        value: 60,
        unit: "L",
        description: "Maximum net quantity per package 60 L",
      },
    ],

    packingGroupRestrictions: [
      {
        packingGroup: "II",
        restrictions: [
          "Required performance standard for packaged articles",
          "Classification per paragraph A4.2.3",
        ],
      },
    ],

    conditionalRequirements: [
      {
        condition: "article_type = 'with_internal_receptacles'",
        requirements: [
          {
            type: "material_compatibility",
            description:
              "Receptacles must be constructed of suitable materials and secured to prevent breakage, puncture, or leakage",
            mandatory: true,
            applicableContainers: ["A7.12.packaged_articles"],
          },
        ],
      },
      {
        condition: "article_type = 'without_internal_receptacles'",
        requirements: [
          {
            type: "compatibility",
            description:
              "Article must fully enclose the dangerous goods and prevent their release under normal conditions of transport",
            mandatory: true,
            applicableContainers: [
              "A7.12.packaged_articles",
              "A7.12.robust_packaged",
              "A7.12.robust_unpackaged",
            ],
          },
        ],
      },
      {
        condition: "article_classification = 'robust'",
        requirements: [
          {
            type: "compatibility",
            description:
              "May be transported in strong outer packagings or unpackaged/on pallets when article provides equivalent protection",
            mandatory: true,
            applicableContainers: [
              "A7.12.robust_packaged",
              "A7.12.robust_unpackaged",
            ],
          },
        ],
      },
      {
        condition:
          "packaging_option = 'unpackaged' OR packaging_option = 'palletized'",
        requirements: [
          {
            type: "compatibility",
            description:
              "Article must afford equivalent protection to dangerous goods contained within",
            mandatory: true,
            applicableContainers: ["A7.12.robust_unpackaged"],
          },
        ],
      },
    ],

    referencedParagraphs: [
      "A7.12.1",
      "A7.12.2",
      "A7.12.1.1",
      "A7.12.1.2",
      "A7.12.2.1",
      "A7.12.2.2",
      "A4.2.3",
    ],
  },
  "A8.2.": {
    paragraphId: "A8.2.",
    hazardClass: 4,
    description: "Packaging for Class 4 Liquids",
    lastUpdated: new Date().toISOString(),
    entryType: "standard",
    materialTypes: ["class_4_liquids", "flammable_liquids_class_4"],

    packagingOptions: [
      {
        id: "A8.2.1.combination",
        type: "combination",
        description:
          "Combination packagings with outer drums, barrels, jerricans, or boxes (A8.2.1)",
        innerPackaging: {
          required: true,
          description:
            "Receptacles: glass, earthenware, plastic, metal, or glass ampoules",
          materials: [
            "Glass receptacles",
            "Earthenware receptacles",
            "Plastic receptacles",
            "Metal receptacles",
            "Glass ampoules",
          ],
          specialRequirements: [
            "For PG I material inner packagings packed in a rigid and leakproof receptacle or intermediate packaging containing sufficient absorbent material to absorb the entire contents of all inner packagings before packing the inner packaging(s) in the outer package.",
            "Ensure inner packaging or receptacle closures of combination packages containing liquids are held securely, tightly, and effectively in place by secondary means. See A20.3.",
          ],
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "drums",
              subtype: "various_materials",
              containers: [
                {
                  code: "1A1",
                  material: "steel",
                  description: "Steel drum",
                },
                {
                  code: "1A2",
                  material: "steel",
                  description: "Steel removable head drum",
                },
                {
                  code: "1B1",
                  material: "aluminum",
                  description: "Aluminum drum",
                },
                {
                  code: "1B2",
                  material: "aluminum",
                  description: "Aluminum removable head drum",
                },
                {
                  code: "1D",
                  material: "plywood",
                  description: "Plywood drum",
                },
                { code: "1G", material: "fiber", description: "Fiber drum" },
                {
                  code: "1H1",
                  material: "plastic",
                  description: "Plastic drum",
                },
                {
                  code: "1H2",
                  material: "plastic",
                  description: "Plastic removable head drum",
                },
                {
                  code: "1N1",
                  material: "other_metal",
                  description: "Other metal drum",
                },
                {
                  code: "1N2",
                  material: "other_metal",
                  description: "Other metal removable head drum",
                },
              ],
            },
            {
              type: "barrels",
              subtype: "wood_removable_head",
              containers: [
                {
                  code: "2C2",
                  material: "wood",
                  description: "Wood barrel with removable head",
                },
              ],
            },
            {
              type: "jerricans",
              subtype: "various_materials",
              containers: [
                {
                  code: "3A1",
                  material: "steel",
                  description: "Steel jerrican",
                },
                {
                  code: "3A2",
                  material: "steel",
                  description: "Steel removable head jerrican",
                },
                {
                  code: "3B1",
                  material: "aluminum",
                  description: "Aluminum jerrican",
                },
                {
                  code: "3B2",
                  material: "aluminum",
                  description: "Aluminum removable head jerrican",
                },
                {
                  code: "3H1",
                  material: "plastic",
                  description: "Plastic jerrican",
                },
                {
                  code: "3H2",
                  material: "plastic",
                  description: "Plastic removable head jerrican",
                },
              ],
            },
            {
              type: "boxes",
              subtype: "various_materials",
              containers: [
                { code: "4A", material: "steel", description: "Steel box" },
                {
                  code: "4B",
                  material: "aluminum",
                  description: "Aluminum box",
                },
                {
                  code: "4C1",
                  material: "natural_wood",
                  description: "Natural wood box",
                },
                {
                  code: "4C2",
                  material: "natural_wood",
                  description: "Sift-proof natural wood box",
                },
                { code: "4D", material: "plywood", description: "Plywood box" },
                {
                  code: "4F",
                  material: "reconstituted_wood",
                  description: "Reconstituted wood box",
                },
                {
                  code: "4G",
                  material: "fiberboard",
                  description: "Fiberboard box",
                },
                {
                  code: "4H1",
                  material: "plastic",
                  description: "Expanded plastic box",
                },
                {
                  code: "4H2",
                  material: "solid_plastic",
                  description: "Solid plastic box",
                },
                {
                  code: "4N",
                  material: "other_metal",
                  description: "Other metal box",
                },
              ],
            },
          ],
        },
        // notes: [
        //   "For PG I material, inner packagings must be in rigid and leakproof receptacle/intermediate packaging with absorbent material",
        //   "Inner packaging closures must be held securely by secondary means (see A20.3)",
        // ],
        isComplete: true,
      },
      {
        id: "A8.2.2.single",
        type: "single",
        description: "Single packaging drums, jerricans, or barrels (A8.2.2)",
        innerPackaging: {
          required: false,
          description: "Not required for single packaging",
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "drums",
              subtype: "various_materials_with_liner_option",
              containers: [
                {
                  code: "1A1",
                  material: "steel",
                  description: "Steel drum",
                },
                {
                  code: "1A2",
                  material: "steel",
                  description: "Steel removable head drum",
                },
                {
                  code: "1B1",
                  material: "aluminum",
                  description: "Aluminum drum",
                },
                {
                  code: "1B2",
                  material: "aluminum",
                  description: "Aluminum removable head drum",
                },
                {
                  code: "1G",
                  material: "fiber",
                  description: "Fiber drum with liner",
                },
                {
                  code: "1H1",
                  material: "plastic",
                  description: "Plastic drum",
                },
                {
                  code: "1H2",
                  material: "plastic",
                  description: "Plastic removable head drum",
                },
                {
                  code: "1N1",
                  material: "other_metal",
                  description: "Metal drum (other than steel or aluminum)",
                },
                {
                  code: "1N2",
                  material: "other_metal",
                  description:
                    "Metal removable head drum (other than steel or aluminum)",
                },
              ],
            },
            {
              type: "jerricans",
              subtype: "various_materials",
              containers: [
                {
                  code: "3A1",
                  material: "steel",
                  description: "Steel jerrican",
                },
                {
                  code: "3A2",
                  material: "steel",
                  description: "Steel removable head jerrican",
                },
                {
                  code: "3B1",
                  material: "aluminum",
                  description: "Aluminum jerrican",
                },
                {
                  code: "3B2",
                  material: "aluminum",
                  description: "Aluminum removable head jerrican",
                },
                {
                  code: "3H1",
                  material: "plastic",
                  description: "Plastic jerrican",
                },
                {
                  code: "3H2",
                  material: "plastic",
                  description: "Plastic removable head jerrican",
                },
              ],
            },
            {
              type: "barrels",
              subtype: "wood",
              containers: [
                { code: "2C1", material: "wood", description: "Wood barrel" },
              ],
            },
          ],
        },
        notes: [
          "Fiber drum (1G) not authorized for PG I materials",
          "Wooden barrel (2C1) not authorized for PG I materials",
        ],
        isComplete: true,
      },
      {
        id: "A8.2.3.composite_plastic",
        type: "composite_plastic",
        description:
          "Composite packagings with plastic inner receptacles (A8.2.3)",
        innerPackaging: {
          required: true,
          description: "Plastic inner receptacle",
          materials: ["Plastic receptacle"],
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "composite_drum",
              subtype: "plastic_inner_various_outer",
              containers: [
                {
                  code: "6HA1",
                  material: "steel_plastic",
                  description: "Steel drum with plastic inner receptacle",
                },
                {
                  code: "6HB1",
                  material: "aluminum_plastic",
                  description: "Aluminum drum with plastic inner receptacle",
                },
                {
                  code: "6HD1",
                  material: "plywood_plastic",
                  description: "Plywood drum with plastic inner receptacle",
                },
                {
                  code: "6HG1",
                  material: "fiber_plastic",
                  description: "Fiber drum with plastic inner receptacle",
                },
                {
                  code: "6HH1",
                  material: "plastic_plastic",
                  description: "Plastic drum with plastic inner receptacle",
                },
              ],
            },
            {
              type: "composite_box",
              subtype: "plastic_inner_various_outer",
              containers: [
                {
                  code: "6HA2",
                  material: "steel_plastic",
                  description: "Steel box with plastic inner receptacle",
                },
                {
                  code: "6HB2",
                  material: "aluminum_plastic",
                  description: "Aluminum box with plastic inner receptacle",
                },
                {
                  code: "6HC",
                  material: "wooden_plastic",
                  description: "Wooden box with plastic inner receptacle",
                },
                {
                  code: "6HD2",
                  material: "plywood_plastic",
                  description: "Plywood box with plastic inner receptacle",
                },
                {
                  code: "6HG2",
                  material: "fiberboard_plastic",
                  description: "Fiberboard box with plastic inner receptacle",
                },
              ],
            },
          ],
        },
        notes: ["Plywood drum (6HD1) not authorized for PG I materials"],
        isComplete: true,
      },
      {
        id: "A8.2.4.composite_glass",
        type: "composite_glass",
        description:
          "Composite packagings with glass, porcelain or stoneware inner receptacles (A8.2.4)",
        innerPackaging: {
          required: true,
          description: "Glass, porcelain or stoneware inner receptacle",
          materials: [
            "Glass receptacle",
            "Porcelain receptacle",
            "Stoneware receptacle",
          ],
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "composite_drum",
              subtype: "glass_inner_various_outer",
              containers: [
                {
                  code: "6PA1",
                  material: "steel_glass",
                  description: "Steel drum with glass inner receptacle",
                },
                {
                  code: "6PB1",
                  material: "aluminum_glass",
                  description: "Aluminum drum with glass inner receptacle",
                },
                {
                  code: "6PD1",
                  material: "plywood_glass",
                  description: "Plywood drum with glass inner receptacle",
                },
                {
                  code: "6PD2",
                  material: "wickerwork_glass",
                  description: "Wickerwork hamper with glass inner receptacle",
                },
                {
                  code: "6PG1",
                  material: "fiber_glass",
                  description: "Fiber drum with glass inner receptacle",
                },
              ],
            },
            {
              type: "composite_box",
              subtype: "glass_inner_various_outer",
              containers: [
                {
                  code: "6PA2",
                  material: "steel_glass",
                  description: "Steel box with glass inner receptacle",
                },
                {
                  code: "6PB2",
                  material: "aluminum_glass",
                  description: "Aluminum box with glass inner receptacle",
                },
                {
                  code: "6PC",
                  material: "wooden_glass",
                  description: "Wooden box with glass inner receptacle",
                },
                {
                  code: "6PG2",
                  material: "fiberboard_glass",
                  description: "Fiberboard box with glass inner receptacle",
                },
              ],
            },
            {
              type: "composite_plastic_packaging",
              subtype: "glass_inner_plastic_outer",
              containers: [
                {
                  code: "6PH1",
                  material: "solid_plastic_glass",
                  description:
                    "Solid plastic packaging with glass inner receptacle",
                },
                {
                  code: "6PH2",
                  material: "expanded_plastic_glass",
                  description:
                    "Expanded plastic packaging with glass inner receptacle",
                },
              ],
            },
          ],
        },
        notes: [
          "Plywood drum or wickerwork hamper (6PD1 or 6PD2) not authorized for PG I material",
        ],
        isComplete: true,
      },
      {
        id: "A8.2.5.cylinders",
        type: "cylinder",
        description: "DOT specification cylinders (A8.2.5)",
        innerPackaging: {
          required: false,
          description: "Not required for cylinder packaging",
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "cylinders",
              subtype: "dot_specification",
              containers: [
                {
                  code: "DOT_SPEC",
                  material: "various",
                  description:
                    "DOT specification cylinders as prescribed for any compressed gas",
                },
              ],
            },
          ],
        },
        notes: [
          "DOT specification cylinders as prescribed for any compressed gas, except acetylene (DOT8, 8AL) and DOT 3HT",
        ],
        isComplete: true,
      },
    ],

    packingGroupRestrictions: [
      {
        packingGroup: "I",
        restriction: "prohibited",
        description: "Wood barrel (2C2) not authorized for PG I material",
        conditions: ["2C2"],
      },
      {
        packingGroup: "I",
        restriction: "prohibited",
        description: "Fiber drum (1G) not authorized for PG I materials",
        conditions: ["1G"],
      },
      {
        packingGroup: "I",
        restriction: "prohibited",
        description: "Wooden barrel (2C1) not authorized for PG I materials",
        conditions: ["2C1"],
      },
      {
        packingGroup: "I",
        restriction: "prohibited",
        description: "Plywood drum (6HD1) not authorized for PG I materials",
        conditions: ["6HD1"],
      },
      {
        packingGroup: "I",
        restriction: "prohibited",
        description:
          "Plywood drum or wickerwork hamper (6PD1 or 6PD2) not authorized for PG I material",
        conditions: ["6PD1", "6PD2"],
      },
    ],

    specialRequirements: [
      {
        type: "absorbent_material",
        description:
          "For PG I material, inner packagings must be packed in a rigid and leakproof receptacle or intermediate packaging containing sufficient absorbent material to absorb the entire contents of all inner packagings before packing them in the outer package",
        mandatory: true,
        applicableContainers: ["A8.2.1.combination"],
      },
      {
        type: "closure_type",
        description:
          "Ensure inner packaging or receptacle closures of combination packages containing liquids are held securely, tightly, and effectively in place by secondary means. See A20.3.",
        mandatory: true,
        applicableContainers: ["A8.2.1.combination"],
      },
    ],

    quantityLimits: [],

    conditionalRequirements: [
      {
        condition:
          "packing_group = 'I' AND packaging_type = 'combination' AND container_type = '2C2'",
        requirements: [
          {
            type: "compatibility",
            description: "Wood barrel (2C2) not authorized for PG I material",
            mandatory: true,
            applicableContainers: ["A8.2.1.combination"],
          },
        ],
      },
      {
        condition:
          "packing_group = 'I' AND packaging_type = 'single' AND container_type IN ('1G', '2C1')",
        requirements: [
          {
            type: "compatibility",
            description:
              "Fiber drum (1G) and wooden barrel (2C1) not authorized for PG I materials",
            mandatory: true,
            applicableContainers: ["A8.2.2.single"],
          },
        ],
      },
      {
        condition:
          "packing_group = 'I' AND packaging_type = 'composite_plastic' AND container_type = '6HD1'",
        requirements: [
          {
            type: "compatibility",
            description:
              "Plywood drum (6HD1) not authorized for PG I materials",
            mandatory: true,
            applicableContainers: ["A8.2.3.composite_plastic"],
          },
        ],
      },
      {
        condition:
          "packing_group = 'I' AND packaging_type = 'composite_glass' AND container_type IN ('6PD1', '6PD2')",
        requirements: [
          {
            type: "compatibility",
            description:
              "Plywood drum or wickerwork hamper (6PD1 or 6PD2) not authorized for PG I material",
            mandatory: true,
            applicableContainers: ["A8.2.4.composite_glass"],
          },
        ],
      },
    ],

    referencedParagraphs: [
      "A8.2.1.",
      "A8.2.2.",
      "A8.2.3.",
      "A8.2.4.",
      "A8.2.5.",
      "A20.3.",
    ],
  },
  "A8.3.": {
    paragraphId: "A8.3.",
    hazardClass: 4,
    description: "Packaging for Class 4 Solids",
    lastUpdated: new Date().toISOString(),
    entryType: "standard",
    materialTypes: [
      "flammable_solids",
      "spontaneously_combustible_solids",
      "dangerous_when_wet_solids",
    ],

    packagingOptions: [
      {
        id: "A8.3.combination",
        type: "combination",
        description:
          "Combination packagings with outer drums, barrels, jerricans, or boxes (A8.3.1)",
        innerPackaging: {
          required: true,
          description:
            "Glass or earthenware, plastic, metal, or glass ampoules receptacles",
          materials: [
            "Glass receptacle",
            "Earthenware receptacle",
            "Plastic receptacle",
            "Metal receptacle",
            "Glass ampoule receptacle",
          ],
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "drums",
              subtype: "various_materials",
              containers: [
                { code: "1A1", material: "steel", description: "Steel drum" },
                {
                  code: "1A2",
                  material: "steel",
                  description: "Steel removable head drum",
                },
                {
                  code: "1B1",
                  material: "aluminum",
                  description: "Aluminum drum",
                },
                {
                  code: "1B2",
                  material: "aluminum",
                  description: "Aluminum removable head drum",
                },
                {
                  code: "1D",
                  material: "plywood",
                  description: "Plywood drum",
                },
                { code: "1G", material: "fiber", description: "Fiber drum" },
                {
                  code: "1H1",
                  material: "plastic",
                  description: "Plastic drum",
                },
                {
                  code: "1H2",
                  material: "plastic",
                  description: "Plastic removable head drum",
                },
                {
                  code: "1N1",
                  material: "other_metal",
                  description: "Other metal drum",
                },
                {
                  code: "1N2",
                  material: "other_metal",
                  description: "Other metal removable head drum",
                },
              ],
            },
            {
              type: "barrels",
              subtype: "wood_removable_head",
              containers: [
                {
                  code: "2C2",
                  material: "wood",
                  description: "Wood barrel with removable head",
                },
              ],
            },
            {
              type: "jerricans",
              subtype: "various_materials",
              containers: [
                {
                  code: "3A1",
                  material: "steel",
                  description: "Steel jerrican",
                },
                {
                  code: "3A2",
                  material: "steel",
                  description: "Steel removable head jerrican",
                },
                {
                  code: "3B1",
                  material: "aluminum",
                  description: "Aluminum jerrican",
                },
                {
                  code: "3B2",
                  material: "aluminum",
                  description: "Aluminum removable head jerrican",
                },
                {
                  code: "3H1",
                  material: "plastic",
                  description: "Plastic jerrican",
                },
                {
                  code: "3H2",
                  material: "plastic",
                  description: "Plastic removable head jerrican",
                },
              ],
            },
            {
              type: "boxes",
              subtype: "various_materials",
              containers: [
                { code: "4A", material: "steel", description: "Steel box" },
                {
                  code: "4B",
                  material: "aluminum",
                  description: "Aluminum box",
                },
                {
                  code: "4C1",
                  material: "natural_wood",
                  description: "Natural wood box",
                },
                {
                  code: "4C2",
                  material: "sift_proof_wood",
                  description: "Sift-proof natural wood box",
                },
                { code: "4D", material: "plywood", description: "Plywood box" },
                {
                  code: "4F",
                  material: "reconstituted_wood",
                  description: "Reconstituted wood box",
                },
                {
                  code: "4G",
                  material: "fiberboard",
                  description: "Fiberboard box",
                },
                {
                  code: "4H2",
                  material: "solid_plastic",
                  description: "Solid plastic box",
                },
                {
                  code: "4N",
                  material: "other_metal",
                  description: "Other metal box",
                },
              ],
            },
          ],
        },
        restrictions: [],
        isComplete: true,
      },
      {
        id: "A8.3.single",
        type: "single",
        description:
          "Single packaging drums, jerricans, barrels, boxes, or bags (A8.3.2)",
        innerPackaging: {
          required: false,
          description: "Not required for single packaging",
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "drums",
              subtype: "various_materials",
              containers: [
                { code: "1A1", material: "steel", description: "Steel drum" },
                {
                  code: "1A2",
                  material: "steel",
                  description: "Steel removable head drum",
                },
                {
                  code: "1B1",
                  material: "aluminum",
                  description: "Aluminum drum",
                },
                {
                  code: "1B2",
                  material: "aluminum",
                  description: "Aluminum removable head drum",
                },
                {
                  code: "1D",
                  material: "plywood",
                  description: "Plywood drum",
                },
                { code: "1G", material: "fiber", description: "Fiber drum" },
                {
                  code: "1H1",
                  material: "plastic",
                  description: "Plastic drum",
                },
                {
                  code: "1H2",
                  material: "plastic",
                  description: "Plastic removable head drum",
                },
                {
                  code: "1N1",
                  material: "other_metal",
                  description: "Other metal drum",
                },
                {
                  code: "1N2",
                  material: "other_metal",
                  description: "Other metal removable head drum",
                },
              ],
            },
            {
              type: "barrels",
              subtype: "wood_various",
              containers: [
                { code: "2C1", material: "wood", description: "Wood barrel" },
                {
                  code: "2C2",
                  material: "wood",
                  description: "Wood barrel with removable head",
                },
              ],
            },
            {
              type: "jerricans",
              subtype: "various_materials",
              containers: [
                {
                  code: "3A1",
                  material: "steel",
                  description: "Steel jerrican",
                },
                {
                  code: "3A2",
                  material: "steel",
                  description: "Steel removable head jerrican",
                },
                {
                  code: "3B1",
                  material: "aluminum",
                  description: "Aluminum jerrican",
                },
                {
                  code: "3B2",
                  material: "aluminum",
                  description: "Aluminum removable head jerrican",
                },
                {
                  code: "3H1",
                  material: "plastic",
                  description: "Plastic jerrican",
                },
                {
                  code: "3H2",
                  material: "plastic",
                  description: "Plastic removable head jerrican",
                },
              ],
            },
            {
              type: "boxes",
              subtype: "various_materials_with_liner_options",
              containers: [
                { code: "4A", material: "steel", description: "Steel box" },
                {
                  code: "4B",
                  material: "aluminum",
                  description: "Aluminum box",
                },
                {
                  code: "4C1",
                  material: "natural_wood",
                  description: "Natural wood box",
                },
                {
                  code: "4C2",
                  material: "sift_proof_wood",
                  description: "Sift-proof natural wood box",
                },
                { code: "4D", material: "plywood", description: "Plywood box" },
                {
                  code: "4F",
                  material: "reconstituted_wood",
                  description: "Reconstituted wood box",
                },
                {
                  code: "4G",
                  material: "fiberboard",
                  description: "Fiberboard box",
                },
                {
                  code: "4H1",
                  material: "expanded_plastic",
                  description: "Expanded plastic box",
                },
                {
                  code: "4H2",
                  material: "solid_plastic",
                  description: "Solid plastic box",
                },
                {
                  code: "4N",
                  material: "other_metal",
                  description: "Other metal box",
                },
              ],
            },
            {
              type: "bags",
              subtype: "various_materials",
              containers: [
                {
                  code: "5H1",
                  material: "woven_plastic",
                  description: "Woven plastic bag",
                },
                {
                  code: "5H2",
                  material: "woven_plastic",
                  description: "Woven plastic bag",
                },
                {
                  code: "5H3",
                  material: "woven_plastic",
                  description: "Woven plastic bag",
                },
                {
                  code: "5H4",
                  material: "plastic_film",
                  description: "Plastic film bag",
                },
                {
                  code: "5L1",
                  material: "textile",
                  description: "Textile bag",
                },
                {
                  code: "5L2",
                  material: "textile",
                  description: "Textile bag",
                },
                {
                  code: "5L3",
                  material: "textile",
                  description: "Textile bag",
                },
                {
                  code: "5M2",
                  material: "paper",
                  description: "Paper multiwall water-resistant bag",
                },
              ],
            },
          ],
        },
        notes: [
          "Plywood drums (1D) not authorized for PG I material",
          "Wooden barrels (2C1 or 2C2) not authorized for PG I material",
          "Steel boxes (4A) and aluminum boxes (4B) require liners for PG I material",
          "Natural wood (4C1), plywood (4D), reconstituted wood (4F), or fiberboard (4G) boxes not authorized for PG I material",
          "Bags not authorized for PG I material",
        ],
        isComplete: true,
      },
      {
        id: "A8.3.composite_plastic",
        type: "composite_plastic",
        description:
          "Composite packagings with plastic inner receptacles (A8.3.3)",
        innerPackaging: {
          required: true,
          description: "Plastic inner receptacle",
          materials: ["Plastic inner receptacle"],
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "composite_drum",
              subtype: "plastic_inner_various_outer",
              containers: [
                {
                  code: "6HA1",
                  material: "steel_plastic",
                  description: "Steel drum with plastic inner receptacle",
                },
                {
                  code: "6HB1",
                  material: "aluminum_plastic",
                  description: "Aluminum drum with plastic inner receptacle",
                },
                {
                  code: "6HD1",
                  material: "plywood_plastic",
                  description: "Plywood drum with plastic inner receptacle",
                },
                {
                  code: "6HG1",
                  material: "fiber_plastic",
                  description: "Fiber drum with plastic inner receptacle",
                },
                {
                  code: "6HH1",
                  material: "plastic_plastic",
                  description: "Plastic drum with plastic inner receptacle",
                },
              ],
            },
            {
              type: "composite_box",
              subtype: "plastic_inner_various_outer",
              containers: [
                {
                  code: "6HA2",
                  material: "steel_plastic",
                  description: "Steel box with plastic inner receptacle",
                },
                {
                  code: "6HB2",
                  material: "aluminum_plastic",
                  description: "Aluminum box with plastic inner receptacle",
                },
                {
                  code: "6HC",
                  material: "wooden_plastic",
                  description: "Wooden box with plastic inner receptacle",
                },
                {
                  code: "6HD2",
                  material: "plywood_plastic",
                  description: "Plywood box with plastic inner receptacle",
                },
                {
                  code: "6HG2",
                  material: "fiberboard_plastic",
                  description: "Fiberboard box with plastic inner receptacle",
                },
              ],
            },
          ],
        },
        notes: [
          "Plastic receptacles in outer boxes are not authorized for PG I material",
        ],
        isComplete: true,
      },
      {
        id: "A8.3.composite_glass",
        type: "composite_glass",
        description:
          "Composite packagings with glass, porcelain or stoneware inner receptacles (A8.3.4)",
        innerPackaging: {
          required: true,
          description: "Glass, porcelain or stoneware inner receptacle",
          materials: [
            "Glass inner receptacle",
            "Porcelain inner receptacle",
            "Stoneware inner receptacle",
          ],
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "composite_drum",
              subtype: "glass_inner_various_outer",
              containers: [
                {
                  code: "6PA1",
                  material: "steel_glass",
                  description: "Steel drum with glass inner receptacle",
                },
                {
                  code: "6PB1",
                  material: "aluminum_glass",
                  description: "Aluminum drum with glass inner receptacle",
                },
                {
                  code: "6PD1",
                  material: "plywood_glass",
                  description: "Plywood drum with glass inner receptacle",
                },
                {
                  code: "6PG1",
                  material: "fiber_glass",
                  description: "Fiber drum with glass inner receptacle",
                },
              ],
            },
            {
              type: "composite_box",
              subtype: "glass_inner_various_outer",
              containers: [
                {
                  code: "6PA2",
                  material: "steel_glass",
                  description: "Steel box with glass inner receptacle",
                },
                {
                  code: "6PB2",
                  material: "aluminum_glass",
                  description: "Aluminum box with glass inner receptacle",
                },
                {
                  code: "6PC",
                  material: "wooden_glass",
                  description: "Wooden box with glass inner receptacle",
                },
                {
                  code: "6PG2",
                  material: "fiberboard_glass",
                  description: "Fiberboard box with glass inner receptacle",
                },
              ],
            },
            {
              type: "composite_plastic_packaging",
              subtype: "glass_inner_plastic_outer",
              containers: [
                {
                  code: "6PH1",
                  material: "expanded_plastic_glass",
                  description:
                    "Expanded plastic packaging with glass inner receptacle",
                },
                {
                  code: "6PH2",
                  material: "solid_plastic_glass",
                  description:
                    "Solid plastic packaging with glass inner receptacle",
                },
              ],
            },
          ],
        },
        notes: [
          "Expanded or solid plastic packagings are not authorized for PG I material",
        ],
        isComplete: true,
      },
      {
        id: "A8.3.cylinders",
        type: "cylinder",
        description: "DOT specification cylinders (A8.3.5)",
        innerPackaging: {
          required: false,
          description: "Not required for cylinder packaging",
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "cylinders",
              subtype: "dot_specification",
              containers: [
                {
                  code: "DOT_SPEC",
                  material: "various",
                  description:
                    "DOT specification cylinders as prescribed for any compressed gas",
                },
              ],
            },
          ],
        },
        restrictions: ["DOT 8, 8AL, and DOT 3HT cylinders are not authorized"],
        isComplete: true,
      },
    ],

    specialRequirements: [
      {
        type: "compatibility",
        description:
          "Unless otherwise specified by a packaging paragraph, package a material identified as PG III in a container that meets the PG I or II performance level",
        mandatory: true,
        applicableContainers: [
          "A8.3.combination",
          "A8.3.single",
          "A8.3.composite_plastic",
          "A8.3.composite_glass",
          "A8.3.cylinders",
        ],
      },
    ],

    quantityLimits: [],

    packingGroupRestrictions: [
      {
        packingGroup: "I",
        restriction: "prohibited",
        description: "Plywood drum (1D) not authorized for PG I material",
        conditions: ["1D"],
      },
      {
        packingGroup: "I",
        restriction: "prohibited",
        description:
          "Wooden barrels (2C1 or 2C2) not authorized for PG I material",
        conditions: ["2C1", "2C2"],
      },
      {
        packingGroup: "I",
        restriction: "prohibited",
        description:
          "Natural wood (4C1), plywood (4D), reconstituted wood (4F), or fiberboard (4G) boxes not authorized for PG I material",
        conditions: ["4C1", "4D", "4F", "4G"],
      },
      {
        packingGroup: "I",
        restriction: "prohibited",
        description: "Bags not authorized for PG I material",
        conditions: ["5H1", "5H2", "5H3", "5H4", "5L1", "5L2", "5L3", "5M2"],
      },
      {
        packingGroup: "I",
        restriction: "prohibited",
        description:
          "Plastic receptacles in outer boxes not authorized for PG I material (composite packaging)",
        conditions: ["6HA2", "6HB2", "6HC", "6HD2", "6HG2"],
      },
      {
        packingGroup: "I",
        restriction: "prohibited",
        description:
          "Expanded or solid plastic packagings not authorized for PG I material",
        conditions: ["6PH1", "6PH2"],
      },
    ],

    conditionalRequirements: [
      {
        condition:
          "packing_group = 'I' AND packaging_type = 'single' AND container_type IN ('4A', '4B')",
        requirements: [
          {
            type: "material_compatibility",
            description:
              "Steel boxes (4A) and aluminum boxes (4B) require liners for PG I material",
            mandatory: true,
            applicableContainers: ["A8.3.single"],
          },
        ],
      },
      {
        condition:
          "packing_group = 'I' AND packaging_type = 'single' AND container_type IN ('1D', '2C1', '2C2', '4C1', '4D', '4F', '4G', '5H1', '5H2', '5H3', '5H4', '5L1', '5L2', '5L3', '5M2')",
        requirements: [
          {
            type: "compatibility",
            description:
              "These container types are not authorized for PG I material",
            mandatory: true,
            applicableContainers: ["A8.3.single"],
          },
        ],
      },
      {
        condition:
          "packing_group = 'I' AND packaging_type = 'composite' AND (container_type LIKE '%box%' OR container_type LIKE '6PH%')",
        requirements: [
          {
            type: "compatibility",
            description:
              "Plastic receptacles in outer boxes and expanded/solid plastic packagings not authorized for PG I material",
            mandatory: true,
            applicableContainers: [
              "A8.3.composite_plastic",
              "A8.3.composite_glass",
            ],
          },
        ],
      },
    ],

    referencedParagraphs: [
      "A8.3.1.",
      "A8.3.2.",
      "A8.3.3.",
      "A8.3.4.",
      "A8.3.5.",
      "A3.3.4.2.",
    ],
  },
  "A8.4.": {
    paragraphId: "A8.4.",
    hazardClass: 4,
    description: "Class 4 Materials requiring CAA",
    lastUpdated: new Date().toISOString(),
    entryType: "specialized",
    materialTypes: ["class_4_materials_requiring_caa"],

    packagingOptions: [
      {
        id: "A8.4.caa_packaging",
        type: "specialized",
        description:
          "Packaging according to competent authority approval (CAA)",
        innerPackaging: {
          required: false,
          description: "As specified in the competent authority approval",
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "specialized",
              subtype: "caa_approved_packaging",
              containers: [
                {
                  code: "CAA",
                  material: "as_specified",
                  description:
                    "Packaging must be in compliance with the competent authority approval",
                },
              ],
            },
          ],
        },
        restrictions: [
          "Packaging must be in compliance with the CAA",
          "Materials referenced in Table A4.1",
        ],
        notes: ["See paragraph 2.5 for more information on CAAs"],
        isComplete: true,
      },
    ],

    specialRequirements: [
      {
        type: "compatibility",
        description:
          "Prepare Class 4 materials referenced in Table A4.1 according to a competent authority approval (CAA)",
        mandatory: true,
        applicableContainers: ["A8.4.caa_packaging"],
      },
      {
        type: "testing",
        description: "Packaging must be in compliance with the CAA",
        mandatory: true,
        applicableContainers: ["A8.4.caa_packaging"],
      },
      {
        type: "compatibility",
        description:
          "See paragraph 2.5 for more information on competent authority approvals",
        mandatory: true,
        applicableContainers: ["A8.4.caa_packaging"],
      },
    ],

    quantityLimits: [],

    conditionalRequirements: [
      {
        condition: "material_referenced_in_table_a4_1 = true",
        requirements: [
          {
            type: "compatibility",
            description:
              "Material must be referenced in Table A4.1 to qualify for CAA packaging",
            mandatory: true,
            applicableContainers: ["A8.4.caa_packaging"],
          },
        ],
      },
    ],

    referencedParagraphs: ["A4.1.", "2.5."],
  },
  "A8.5.": {
    paragraphId: "A8.5.",
    hazardClass: 4,
    subclass: ["4.2"],
    description:
      "Package Pyrophoric Liquid Materials (Class 4.2) as follows: See also A3.3.4.2.",
    lastUpdated: new Date().toISOString(),
    entryType: "specialized",
    materialTypes: ["pyrophoric_liquids"],
    applicableUNNumbers: ["UN2845", "UN3194", "UN2844"],

    packagingOptions: [
      // Option 3: A8.5.2 - Combination with three-tier structure (inner receptacles → metal cans → outer)
      {
        id: "A8.5.2.combination_three_tier",
        type: "combination",
        description:
          "Combination packaging with inner receptacles in strong tight metal cans (A8.5.2)",
        innerPackaging: {
          required: true,
          description: "Inner receptacles of glass or metal",
          materials: ["Glass receptacle", "Metal receptacle"],
          maxCapacity: { value: 1, unit: "L" },
          specialRequirements: [
            "Inner receptacles may not be over 1 L (0.3 gallons) capacity each",
            "Inner receptacles require a positive screw cap closure with gasket",
          ],
        },
        intermediatePackaging: {
          required: true,
          description: "Strong, tight metal cans",
          materials: ["Metal cans"],
          maxQuantity: 4,
          closureRequirements: [
            "Close the strong, tight metal cans by positive means, not by friction",
          ],
          specialRequirements: [
            "Not more than four strong, tight metal cans per outer package",
            "Cushion inner packagings on all sides with dry, incombustible absorbent material in a quantity sufficient to absorb the entire contents",
          ],
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "boxes",
              subtype: "various_materials",
              containers: [
                { code: "4A", material: "steel", description: "Steel box" },
                {
                  code: "4B",
                  material: "aluminum",
                  description: "Aluminum box",
                },
                {
                  code: "4C1",
                  material: "natural_wood",
                  description: "Natural wood box",
                },
                {
                  code: "4C2",
                  material: "natural_wood",
                  description: "Natural wood box (sift-proof)",
                },
                {
                  code: "4D",
                  material: "plywood",
                  description: "Plywood box",
                },
                {
                  code: "4F",
                  material: "reconstituted_wood",
                  description: "Reconstituted wood box",
                },
                {
                  code: "4G",
                  material: "fiberboard",
                  description: "Fiberboard box",
                },
                {
                  code: "4N",
                  material: "other_metal",
                  description: "Metal box (other than steel or aluminum)",
                },
              ],
            },
            {
              type: "drums",
              subtype: "various_materials",
              containers: [
                {
                  code: "1A1",
                  material: "steel",
                  description: "Steel drum",
                },
                {
                  code: "1A2",
                  material: "steel",
                  description: "Steel removable head drum",
                },
                {
                  code: "1B1",
                  material: "aluminum",
                  description: "Aluminum drum",
                },
                {
                  code: "1B2",
                  material: "aluminum",
                  description: "Aluminum removable head drum",
                },
                {
                  code: "1D",
                  material: "plywood",
                  description: "Plywood drum",
                },
                {
                  code: "1G",
                  material: "fiber",
                  description: "Fiber drum",
                },
                {
                  code: "1N1",
                  material: "other_metal",
                  description: "Metal drum (other than steel or aluminum)",
                },
                {
                  code: "1N2",
                  material: "other_metal",
                  description:
                    "Metal removable head drum (other than steel or aluminum)",
                },
              ],
            },
            {
              type: "jerricans",
              subtype: "various_materials",
              containers: [
                {
                  code: "3A1",
                  material: "steel",
                  description: "Steel jerrican",
                },
                {
                  code: "3A2",
                  material: "steel",
                  description: "Steel removable head jerrican",
                },
                {
                  code: "3B1",
                  material: "aluminum",
                  description: "Aluminum jerrican",
                },
                {
                  code: "3B2",
                  material: "aluminum",
                  description: "Aluminum removable head jerrican",
                },
              ],
            },
          ],
        },
        quantityLimits: [
          {
            scope: "per_inner",
            value: 1,
            unit: "L",
            description:
              "Inner receptacles max 1 L (0.3 gallons) capacity each",
          },
          {
            scope: "per_intermediate",
            value: 4,
            unit: "pieces",
            description:
              "Not more than four strong tight metal cans per outer package",
          },
        ],
        isComplete: true,
      },

      // Option 4: A8.5.3 - Combination with inner metal cans (simpler two-tier)
      {
        id: "A8.5.3.combination_metal_cans",
        type: "combination",
        description:
          "Drums, jerricans, or boxes with inner metal cans (A8.5.3)",
        innerPackaging: {
          required: true,
          description: "Inner metal cans",
          materials: ["Metal cans"],
          maxCapacity: { value: 4, unit: "L" },
          specialRequirements: [
            "Inner metal cans not over 4 L (1 gallon) capacity each",
            "Closed by positive means, not by friction",
          ],
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "drums",
              subtype: "various_materials_limited_capacity",
              containers: [
                {
                  code: "1A1",
                  material: "steel",
                  description: "Steel drum",
                },
                {
                  code: "1A2",
                  material: "steel",
                  description: "Steel removable head drum",
                },
                {
                  code: "1B1",
                  material: "aluminum",
                  description: "Aluminum drum",
                },
                {
                  code: "1B2",
                  material: "aluminum",
                  description: "Aluminum removable head drum",
                },
                {
                  code: "1G",
                  material: "fiber",
                  description: "Fiber drum",
                },
                {
                  code: "1N1",
                  material: "other_metal",
                  description: "Metal drum (other than steel or aluminum)",
                },
                {
                  code: "1N2",
                  material: "other_metal",
                  description:
                    "Metal removable head drum (other than steel or aluminum)",
                },
              ],
            },
            {
              type: "jerricans",
              subtype: "various_materials",
              containers: [
                {
                  code: "3A1",
                  material: "steel",
                  description: "Steel jerrican",
                },
                {
                  code: "3A2",
                  material: "steel",
                  description: "Steel removable head jerrican",
                },
                {
                  code: "3B1",
                  material: "aluminum",
                  description: "Aluminum jerrican",
                },
                {
                  code: "3B2",
                  material: "aluminum",
                  description: "Aluminum removable head jerrican",
                },
              ],
            },
            {
              type: "boxes",
              subtype: "metal_boxes_limited_capacity",
              containers: [
                { code: "4A", material: "steel", description: "Steel box" },
                {
                  code: "4B",
                  material: "aluminum",
                  description: "Aluminum box",
                },
                {
                  code: "4N",
                  material: "other_metal",
                  description: "Metal box (other than steel or aluminum)",
                },
              ],
            },
          ],
        },
        quantityLimits: [
          {
            scope: "per_inner",
            value: 4,
            unit: "L",
            description:
              "Inner metal cans not over 4 L (1 gallon) capacity each",
          },
          {
            scope: "per_outer",
            value: 220,
            unit: "L",
            description:
              "Outer packaging not exceeding 220 L (58 gallons) capacity",
          },
        ],
        notes: ["Closed by positive means, not by friction"],
        isComplete: true,
      },

      // Option 5: A8.5.4 - Specialized stainless steel drum combination
      {
        id: "A8.5.4.combination_specialized",
        type: "combination",
        description:
          "Specialized combination: Stainless steel UN1A1 inner drums in UN1A2 outer drum (A8.5.4)",
        innerPackaging: {
          required: true,
          description:
            "10 liter or 20 liter UN1A1 drum fabricated from stainless steel",
          materials: ["Stainless steel UN1A1 drum"],
          maxCapacity: { value: 20, unit: "L" },
          specialRequirements: [
            "UN1A1 drum fabricated from stainless steel",
            "Certified to PG I",
            "Minimum wall thickness of 1.9 mm",
            "4 each National Pipe Thread (NPT) or Vacuum Coupling Radiation (VCR) openings, each with a diameter of 6.3 mm",
            "Fitted on the upper head with a center opening with a maximum diameter of 68.3 mm",
            "Opening sealed with a threaded closure fabricated from 316 stainless steel",
          ],
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "drums",
              subtype: "un1a2_certified_drum",
              containers: [
                {
                  code: "1A2",
                  material: "steel",
                  description: "UN1A2 steel removable head drum",
                  specifications: [
                    {
                      property: "certification",
                      value: "PG I",
                      description: "Certified to PG I performance level",
                    },
                    {
                      property: "maximum_capacity",
                      value: 208,
                      unit: "L",
                      description: "55 gallons",
                    },
                    {
                      property: "minimum_wall_thickness",
                      value: 1.0,
                      unit: "mm",
                      description: "Drum wall thickness",
                    },
                    {
                      property: "closing_ring_thickness",
                      value: 2.4,
                      unit: "mm",
                      description: "Steel closing ring minimum thickness (T-0)",
                    },
                  ],
                },
              ],
            },
          ],
        },
        quantityLimits: [
          {
            scope: "per_inner",
            value: 20,
            unit: "L",
            description: "10 liter or 20 liter inner drums",
          },
          {
            scope: "per_outer",
            value: 2,
            unit: "pieces",
            description:
              "No more than two (2) inner drums may be placed inside the outer drum",
          },
          {
            scope: "per_outer",
            value: 208,
            unit: "L",
            description: "Outer drum capacity not to exceed 208 L (55 gal)",
          },
        ],
        notes: [
          "This is T-0 requirement: The drum must have a minimum wall thickness of 1.0 mm and the top head must be closed with a steel closing ring with a minimum thickness of 2.4 mm",
        ],
        isComplete: true,
      },
      // Option 1: A8.5.1.1 - Cylinders with valve protection (no box)
      {
        id: "A8.5.1.1.cylinder_protected",
        type: "cylinder",
        description:
          "Steel or Nickel Cylinders with valve protection caps or collars (A8.5.1.1)",
        innerPackaging: {
          required: false,
          description: "Not required for cylinder packaging",
        },
        outerPackaging: {
          required: false,
          categories: [
            {
              type: "cylinders",
              subtype: "compressed_gas_cylinders",
              containers: [
                {
                  code: "DOT_STEEL",
                  material: "steel",
                  description:
                    "Specification steel cylinder prescribed for any compressed gas except acetylene",
                  specifications: [
                    {
                      property: "minimum_design_pressure",
                      value: 1206,
                      unit: "kPa",
                      description: "175 psig",
                    },
                  ],
                },
                {
                  code: "DOT_NICKEL",
                  material: "nickel",
                  description:
                    "Specification nickel cylinder prescribed for any compressed gas except acetylene",
                  specifications: [
                    {
                      property: "minimum_design_pressure",
                      value: 1206,
                      unit: "kPa",
                      description: "175 psig",
                    },
                  ],
                },
              ],
            },
          ],
        },
        notes: [
          "Ensure cylinders with valves are equipped with steel valve protection caps or collars",
          "Cylinders prescribed for any compressed gas except acetylene and DOT 3HT",
        ],
        isComplete: true,
      },

      // Option 2: A8.5.1.2 - Cylinders in boxes
      {
        id: "A8.5.1.2.cylinder_boxed",
        type: "cylinder",
        description:
          "Cylinders packed in wooden, fiberboard, or plastic boxes (A8.5.1.2)",
        innerPackaging: {
          required: false,
          description: "Cylinder serves as primary container",
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "boxes",
              subtype: "protective_boxes_for_cylinders",
              containers: [
                {
                  code: "4C1",
                  material: "natural_wood",
                  description: "Natural wood box",
                },
                {
                  code: "4C2",
                  material: "natural_wood",
                  description: "Natural wood box (sift-proof)",
                },
                {
                  code: "4D",
                  material: "plywood",
                  description: "Plywood box",
                },
                {
                  code: "4F",
                  material: "reconstituted_wood",
                  description: "Reconstituted wood box",
                },
                {
                  code: "4G",
                  material: "fiberboard",
                  description: "Fiberboard box",
                },
                {
                  code: "4H1",
                  material: "plastic",
                  description: "Expanded plastic box",
                },
                {
                  code: "4H2",
                  material: "solid_plastic",
                  description: "Solid plastic box",
                },
              ],
            },
          ],
        },
        notes: [
          "Secure cylinders to prevent movement in the box",
          "When offered for transportation, load so that the pressure relief devices remain in the vapor space of the cylinder",
        ],
        isComplete: true,
      },
    ],

    packingGroupRestrictions: [],

    specialRequirements: [
      {
        type: "closure_type",
        description:
          "Ensure cylinders with valves are equipped with steel valve protection caps or collars",
        mandatory: true,
        applicableContainers: ["A8.5.1.1.cylinder_protected"],
      },
      {
        type: "orientation",
        description:
          "Secure cylinders to prevent movement in the box and when offered for transportation, load so that the pressure relief devices remain in the vapor space of the cylinder",
        mandatory: true,
        applicableContainers: ["A8.5.1.2.cylinder_boxed"],
      },
      {
        type: "absorbent_material",
        description:
          "Cushion inner packagings on all sides with dry, incombustible absorbent material in a quantity sufficient to absorb the entire contents",
        mandatory: true,
        applicableContainers: ["A8.5.2.combination_three_tier"],
      },
      {
        type: "closure_type",
        description:
          "Inner receptacles require a positive screw cap closure with gasket",
        mandatory: true,
        applicableContainers: ["A8.5.2.combination_three_tier"],
      },
      {
        type: "closure_security",
        description:
          "Close the strong, tight metal cans by positive means, not by friction",
        mandatory: true,
        applicableContainers: [
          "A8.5.2.combination_three_tier",
          "A8.5.3.combination_metal_cans",
        ],
      },
      {
        type: "material_compatibility",
        description:
          "UN1A1 drum fabricated from stainless steel certified to PG I with minimum wall thickness of 1.9 mm",
        mandatory: true,
        applicableContainers: ["A8.5.4.combination_specialized"],
      },
      {
        type: "closure_type",
        description:
          "4 each National Pipe Thread (NPT) or Vacuum Coupling Radiation (VCR) openings, each with diameter of 6.3 mm",
        mandatory: true,
        applicableContainers: ["A8.5.4.combination_specialized"],
      },
      {
        type: "closure_type",
        description:
          "Fitted on upper head with center opening with maximum diameter of 68.3 mm sealed with threaded closure fabricated from 316 stainless steel",
        mandatory: true,
        applicableContainers: ["A8.5.4.combination_specialized"],
      },
      {
        type: "material_compatibility",
        description:
          "Outer drum must be UN1A2 certified to PG I with minimum wall thickness of 1.0 mm and steel closing ring minimum thickness of 2.4 mm (T-0)",
        mandatory: true,
        applicableContainers: ["A8.5.4.combination_specialized"],
      },
    ],

    quantityLimits: [],

    conditionalRequirements: [
      {
        condition: "un_number = 'UN3194'",
        conditionType: "un_number",
        operator: "equals",
        value: "UN3194",
        effect: "allow",
        description:
          "For UN3194 inorganic pyrophoric liquids, DOT 3AL cylinders constructed of aluminum alloy 6061-T6 may be used",
        requirements: [
          {
            type: "material_compatibility",
            description:
              "DOT 3AL cylinders constructed of aluminum alloy 6061-T6 with a minimum marked service pressure of 1,800 psig and a maximum water capacity of 49 liters (13 gal) may be used",
            mandatory: true,
            applicableContainers: [
              "A8.5.1.1.cylinder_protected",
              "A8.5.1.2.cylinder_boxed",
            ],
          },
        ],
      },
    ],

    referencedParagraphs: ["A3.3.4.2.", "A8.5.1.", "A8.5.2.", "A8.5.3.", "A8.5.4."],
  },
  "A8.6.": {
    paragraphId: "A8.6.",
    hazardClass: 4,
    description:
      "Package Diphenyloxide-4, 4-Disulphohydrazide; N, N Dinitroso-N, N Dimethyl Teraphthlamide (not more than 72 percent as a paste) as follows:",
    lastUpdated: new Date().toISOString(),
    entryType: "specialized",
    materialTypes: [
      "diphenyloxide_4_4_disulphohydrazide",
      "n_n_dinitroso_n_n_dimethyl_teraphthlamide",
      "organic_peroxide_paste",
    ],

    packagingOptions: [
      {
        id: "A8.6.single",
        type: "single",
        description: "Single packaging in fiber drums (A8.6.)",
        innerPackaging: {
          required: false,
          description: "Not required for single packaging",
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "drums",
              subtype: "fiber_drum_variants",
              containers: [
                {
                  code: "1G",
                  material: "fiber",
                  description:
                    "Fiber drum with plastic liner or internal coating",
                  specifications: [
                    {
                      property: "liner_type",
                      value: "plastic_liner_or_internal_coating",
                      description:
                        "Must have plastic liner or internal coating",
                    },
                  ],
                },
                {
                  code: "1G",
                  material: "fiber",
                  description: "Sift-proof fiber drum",
                  specifications: [
                    {
                      property: "construction_type",
                      value: "sift_proof",
                      description: "Sift-proof construction",
                    },
                  ],
                },
              ],
            },
          ],
        },
        notes: [],
        isComplete: true,
      },
    ],

    packingGroupRestrictions: [],

    specialRequirements: [
      {
        type: "material_compatibility",
        description:
          "Material concentration not more than 72 percent as a paste",
        mandatory: true,
        applicableContainers: ["A8.6.single"],
      },
      {
        type: "handling",
        description: "Temperature controls are not required",
        mandatory: false,
        applicableContainers: ["A8.6.single"],
      },
      {
        type: "material_compatibility",
        description:
          "Fiber drums must have plastic liner or internal coating, OR be sift-proof construction",
        mandatory: true,
        applicableContainers: ["A8.6.single"],
      },
    ],

    quantityLimits: [
      {
        scope: "concentration_limit",
        value: 72,
        unit: "percent",
        description:
          "Material concentration not more than 72 percent as a paste",
      },
    ],

    conditionalRequirements: [
      {
        condition:
          "container_specification = 'plastic_liner_or_internal_coating'",
        conditionType: "packaging_type",
        operator: "equals",
        value: "plastic_liner_or_internal_coating",
        effect: "require",
        description:
          "Standard fiber drums must have plastic liner or internal coating",
        requirements: [
          {
            type: "material_compatibility",
            description:
              "Fiber drum must be equipped with plastic liner or internal coating",
            mandatory: true,
            applicableContainers: ["A8.6.single"],
          },
        ],
      },
      {
        condition: "container_specification = 'sift_proof'",
        conditionType: "packaging_type",
        operator: "equals",
        value: "sift_proof",
        effect: "allow",
        description:
          "Sift-proof fiber drums do not require additional liner or coating",
        requirements: [],
      },
    ],

    referencedParagraphs: ["A8.6."],
  },
  "A8.7.": {
    paragraphId: "A8.7.",
    hazardClass: 4,
    description:
      "Package 1,1 Azodi-(Hexahydrobenzonitrile); Benzene Sulfohydrazide; Benzene-1,3- Disulfohydrazide (not more than 52 percent as a paste); N,NDinitrosopentamethylenetetramine (not more than 82 percent with phlegmatizer)",
    lastUpdated: new Date().toISOString(),
    entryType: "specialized",
    materialTypes: [
      "azodi_hexahydrobenzonitrile",
      "benzene_sulfohydrazide",
      "benzene_1_3_disulfohydrazide",
      "n_n_dinitrosopentamethylenetetramine",
      "organic_peroxide_compounds",
    ],

    packagingOptions: [
      {
        id: "A8.7.drums_lined",
        type: "single",
        description:
          "Fiber drums with plastic liner or internal coating (A8.7.1)",
        innerPackaging: {
          required: false,
          description: "Not required for single packaging",
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "drums",
              subtype: "fiber_drum_variants",
              containers: [
                {
                  code: "1G",
                  material: "fiber",
                  description: "Fiber drum (1G) with a plastic liner",
                  specifications: [
                    {
                      property: "liner_type",
                      value: "plastic_liner",
                      description: "Must have plastic liner",
                    },
                  ],
                },
                {
                  code: "1G",
                  material: "fiber",
                  description: "Fiber drum (1G) with internal coating",
                  specifications: [
                    {
                      property: "coating_type",
                      value: "internal_coating",
                      description: "Must have internal coating",
                    },
                  ],
                },
                {
                  code: "1G",
                  material: "fiber",
                  description: "Sift-proof fiber drum (1G)",
                  specifications: [
                    {
                      property: "construction_type",
                      value: "sift_proof",
                      description: "Sift-proof construction",
                    },
                  ],
                },
              ],
            },
          ],
        },
        restrictions: ["Maximum gross weight is 50 kg (110 pounds)"],
        // notes: ["Temperature controls are not required"],
        isComplete: true,
      },
      {
        id: "A8.7.fiberboard_box_single_bag",
        type: "combination",
        description: "Fiberboard box with single plastic bag (A8.7.2)",
        innerPackaging: {
          required: true,
          description: "Single plastic bag receptacle",
          materials: ["Single plastic bag receptacle"],
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "boxes",
              subtype: "fiberboard",
              containers: [
                {
                  code: "4G",
                  material: "fiberboard",
                  description: "Fiberboard box (4G)",
                },
              ],
            },
          ],
        },
        restrictions: ["Maximum gross weight is 50 kg (110 pounds)"],
        // notes: ["Temperature controls are not required"],
        isComplete: true,
      },
      {
        id: "A8.7.fiberboard_box_containers",
        type: "combination",
        description:
          "Fiberboard box with plastic boxes, bottles, or jars (A8.7.3)",
        innerPackaging: {
          required: true,
          description: "Plastic boxes, plastic bottles, or jars",
          materials: ["Plastic boxes", "Plastic bottles", "Jars"],
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "boxes",
              subtype: "fiberboard",
              containers: [
                {
                  code: "4G",
                  material: "fiberboard",
                  description: "Fiberboard box (4G)",
                },
              ],
            },
          ],
        },
        restrictions: [
          "Maximum weight of inner packaging is 5 kg (11 pounds)",
          "Maximum gross weight is 40 kg (88 pounds)",
        ],
        // notes: ["Temperature controls are not required"],
        isComplete: true,
      },
    ],

    specialRequirements: [
      {
        type: "temperature_control",
        description: "Temperature controls are not required",
        mandatory: false,
        applicableContainers: [
          "A8.7.drums_lined",
          "A8.7.fiberboard_box_single_bag",
          "A8.7.fiberboard_box_containers",
        ],
      },
      {
        type: "material_compatibility",
        description:
          "Benzene-1,3- Disulfohydrazide not more than 52 percent as a paste",
        mandatory: true,
        applicableContainers: [
          "A8.7.drums_lined",
          "A8.7.fiberboard_box_single_bag",
          "A8.7.fiberboard_box_containers",
        ],
      },
      {
        type: "material_compatibility",
        description:
          "N,NDinitrosopentamethylenetetramine not more than 82 percent with phlegmatizer",
        mandatory: true,
        applicableContainers: [
          "A8.7.drums_lined",
          "A8.7.fiberboard_box_single_bag",
          "A8.7.fiberboard_box_containers",
        ],
      },
    ],

    quantityLimits: [
      {
        scope: "gross_weight_drums_and_single_bag",
        value: 50,
        unit: "kg",
        description:
          "Maximum gross weight is 50 kg (110 pounds) for drums and single bag options",
      },
      {
        scope: "inner_packaging_weight_containers",
        value: 5,
        unit: "kg",
        description:
          "Maximum weight of inner packaging is 5 kg (11 pounds) for plastic containers option",
      },
      {
        scope: "gross_weight_containers",
        value: 40,
        unit: "kg",
        description:
          "Maximum gross weight is 40 kg (88 pounds) for plastic containers option",
      },
      {
        scope: "benzene_disulfohydrazide_concentration",
        value: 52,
        unit: "percent",
        description:
          "Benzene-1,3- Disulfohydrazide not more than 52 percent as a paste",
      },
      {
        scope: "dinitrosopentamethylenetetramine_concentration",
        value: 82,
        unit: "percent",
        description:
          "N,NDinitrosopentamethylenetetramine not more than 82 percent with phlegmatizer",
      },
    ],

    conditionalRequirements: [
      {
        condition:
          "packaging_option = 'drums_lined' OR packaging_option = 'fiberboard_box_single_bag'",
        requirements: [
          {
            type: "mass_limits",
            description: "Maximum gross weight is 50 kg (110 pounds)",
            mandatory: true,
            applicableContainers: [
              "A8.7.drums_lined",
              "A8.7.fiberboard_box_single_bag",
            ],
          },
        ],
      },
      {
        condition: "packaging_option = 'fiberboard_box_containers'",
        requirements: [
          {
            type: "mass_limits",
            description:
              "Maximum weight of inner packaging is 5 kg (11 pounds) and maximum gross weight is 40 kg (88 pounds)",
            mandatory: true,
            applicableContainers: ["A8.7.fiberboard_box_containers"],
          },
        ],
      },
      {
        condition: "material_type = 'benzene_1_3_disulfohydrazide'",
        requirements: [
          {
            type: "material_compatibility",
            description: "Must be not more than 52 percent as a paste",
            mandatory: true,
            applicableContainers: [
              "A8.7.drums_lined",
              "A8.7.fiberboard_box_single_bag",
              "A8.7.fiberboard_box_containers",
            ],
          },
        ],
      },
      {
        condition: "material_type = 'n_n_dinitrosopentamethylenetetramine'",
        requirements: [
          {
            type: "material_compatibility",
            description: "Must be not more than 82 percent with phlegmatizer",
            mandatory: true,
            applicableContainers: [
              "A8.7.drums_lined",
              "A8.7.fiberboard_box_single_bag",
              "A8.7.fiberboard_box_containers",
            ],
          },
        ],
      },
    ],

    referencedParagraphs: ["A8.7.1.", "A8.7.2.", "A8.7.3."],
  },
  "A8.8.": {
    paragraphId: "A8.8.",
    hazardClass: 4,
    description:
      "Package 3-Chloro-4-Diethylaminobenzenediazonium Zinc Chloride; 4- Dipropylaminobenzenediazonium Zinc Chloride; Sodium 2-Diazo-1Naphthol-4- Sulphonate; Sodium 2-Diazo-1-Naphthol-5-Sulphonate",
    lastUpdated: new Date().toISOString(),
    entryType: "specialized",
    materialTypes: [
      "chloro_diethylaminobenzenediazonium_zinc_chloride",
      "dipropylaminobenzenediazonium_zinc_chloride",
      "sodium_diazo_naphthol_4_sulphonate",
      "sodium_diazo_naphthol_5_sulphonate",
      "diazonium_salts",
    ],

    packagingOptions: [
      {
        id: "A8.8.fiber_drum_lined",
        type: "single",
        description:
          "Fiber drum with plastic liner or internal coating (A8.8.1)",
        innerPackaging: {
          required: false,
          description: "Not required for single packaging",
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "drums",
              subtype: "fiber_drum_variants",
              containers: [
                {
                  code: "1G",
                  material: "fiber",
                  description:
                    "Fiber drum (1G) with a plastic liner or internal coating",
                  specifications: [
                    {
                      property: "liner_type",
                      value: "plastic_liner_or_internal_coating",
                      description:
                        "Must have plastic liner or internal coating",
                    },
                  ],
                },
              ],
            },
          ],
        },
        restrictions: ["Maximum gross weight is 50 kg (110 pounds)"],
        isComplete: true,
      },
      {
        id: "A8.8.removable_head_drums_bagged",
        type: "combination",
        description:
          "Steel or aluminum removable head drums with plastic bag (A8.8.2)",
        innerPackaging: {
          required: true,
          description: "Plastic bag receptacle",
          materials: ["Plastic bag receptacle"],
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "drums",
              subtype: "removable_head_metal",
              containers: [
                {
                  code: "1A2",
                  material: "steel",
                  description: "Steel removable head drum (1A2)",
                },
                {
                  code: "1B2",
                  material: "aluminum",
                  description: "Aluminum removable head drum (1B2)",
                },
              ],
            },
          ],
        },
        restrictions: ["Maximum gross weight is 55 kg (121 pounds)"],
        isComplete: true,
      },
    ],

    specialRequirements: [
      {
        type: "temperature_control",
        description: "Temperature controls are not required",
        mandatory: false,
        applicableContainers: [
          "A8.8.fiber_drum_lined",
          "A8.8.removable_head_drums_bagged",
        ],
      },
      {
        type: "material_compatibility",
        description: "Fiber drums must have plastic liner or internal coating",
        mandatory: true,
        applicableContainers: ["A8.8.fiber_drum_lined"],
      },
      {
        type: "material_compatibility",
        description:
          "Steel or aluminum removable head drums must contain material in plastic bag",
        mandatory: true,
        applicableContainers: ["A8.8.removable_head_drums_bagged"],
      },
    ],

    quantityLimits: [
      {
        scope: "per_drum",
        value: 50,
        unit: "kg",
        description:
          "Maximum gross weight is 50 kg (110 pounds) for fiber drum option",
      },
      {
        scope: "per_drum",
        value: 55,
        unit: "kg",
        description:
          "Maximum gross weight is 55 kg (121 pounds) for steel/aluminum removable head drums",
      },
    ],

    conditionalRequirements: [
      {
        condition: "packaging_option = 'fiber_drum_lined'",
        requirements: [
          {
            type: "mass_limits",
            description: "Maximum gross weight is 50 kg (110 pounds)",
            mandatory: true,
            applicableContainers: ["A8.8.fiber_drum_lined"],
          },
        ],
      },
      {
        condition: "packaging_option = 'removable_head_drums_bagged'",
        requirements: [
          {
            type: "mass_limits",
            description: "Maximum gross weight is 55 kg (121 pounds)",
            mandatory: true,
            applicableContainers: ["A8.8.removable_head_drums_bagged"],
          },
        ],
      },
      {
        condition: "drum_material = 'fiber'",
        requirements: [
          {
            type: "material_compatibility",
            description: "Must have plastic liner or internal coating",
            mandatory: true,
            applicableContainers: ["A8.8.fiber_drum_lined"],
          },
        ],
      },
      {
        condition:
          "drum_material IN ('steel', 'aluminum') AND head_type = 'removable'",
        requirements: [
          {
            type: "material_compatibility",
            description: "Must contain material in plastic bag receptacle",
            mandatory: true,
            applicableContainers: ["A8.8.removable_head_drums_bagged"],
          },
        ],
      },
    ],

    referencedParagraphs: ["A8.8.1.", "A8.8.2."],
  },
  "A8.9.": {
    paragraphId: "A8.9.",
    hazardClass: 4,
    description:
      "Package 2-Diazo-1-Naphthol-4-Sulphochloride and 2-Diazo-1-Naphhthol-5- Sulphochloride in drums",
    lastUpdated: new Date().toISOString(),
    entryType: "specialized",
    materialTypes: [
      "diazo_naphthol_4_sulphochloride",
      "diazo_naphthol_5_sulphochloride",
      "diazo_sulphochloride_compounds",
    ],

    packagingOptions: [
      {
        id: "A8.9.fiber_drum_lined",
        type: "single",
        description: "Fiber drum with plastic liner or internal coating",
        innerPackaging: {
          required: false,
          description: "Not required for single packaging",
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "drums",
              subtype: "fiber_drum_variants",
              containers: [
                {
                  code: "1G",
                  material: "fiber",
                  description:
                    "Fiber drum (1G) with a plastic liner or internal coating",
                  specifications: [
                    {
                      property: "liner_type",
                      value: "plastic_liner_or_internal_coating",
                      description:
                        "Must have plastic liner or internal coating",
                    },
                  ],
                },
              ],
            },
          ],
        },
        restrictions: ["Maximum gross weight is 50 kg (110 pounds)"],
        // notes: ["Temperature controls are not required"],
        isComplete: true,
      },
    ],

    specialRequirements: [
      {
        type: "temperature_control",
        description: "Temperature controls are not required",
        mandatory: false,
        applicableContainers: ["A8.9.fiber_drum_lined"],
      },
      {
        type: "material_compatibility",
        description: "Fiber drum must have plastic liner or internal coating",
        mandatory: true,
        applicableContainers: ["A8.9.fiber_drum_lined"],
      },
    ],

    quantityLimits: [
      {
        scope: "per_package",
        value: 50,
        unit: "kg",
        description: "Maximum gross weight is 50 kg (110 pounds)",
      },
    ],

    conditionalRequirements: [
      {
        condition: "drum_material = 'fiber'",
        requirements: [
          {
            type: "material_compatibility",
            description: "Must have plastic liner or internal coating",
            mandatory: true,
            applicableContainers: ["A8.9.fiber_drum_lined"],
          },
        ],
      },
    ],

    referencedParagraphs: [],
  },
  "A8.10.": {
    paragraphId: "A8.10.",
    hazardClass: 4,
    description:
      "Package Barium Azide, Wetted (with not less than 50 percent water by mass)",
    lastUpdated: new Date().toISOString(),
    entryType: "specialized",
    materialTypes: ["barium_azide_wetted"],

    packagingOptions: [
      {
        id: "A8.10.glass_receptacles",
        type: "combination",
        description: "Glass receptacles in wooden boxes or fiber drums",
        innerPackaging: {
          required: true,
          description:
            "Glass receptacles (maximum 0.5 kg capacity each) with rubber stoppers wire-tied for securement",
          materials: ["Glass receptacles"],
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "boxes",
              subtype: "wood_various",
              containers: [
                {
                  code: "4C1",
                  material: "natural_wood",
                  description: "Natural wood box (4C1)",
                },
                {
                  code: "4C2",
                  material: "sift_proof_wood",
                  description: "Sift-proof natural wood box (4C2)",
                },
                {
                  code: "4D",
                  material: "plywood",
                  description: "Plywood box (4D)",
                },
                {
                  code: "4F",
                  material: "reconstituted_wood",
                  description: "Reconstituted wood box (4F)",
                },
              ],
            },
            {
              type: "drums",
              subtype: "fiber",
              containers: [
                {
                  code: "1G",
                  material: "fiber",
                  description: "Fiber drum (1G)",
                },
              ],
            },
          ],
        },
        restrictions: [
          "Inner glass receptacles may not be over 0.5 kg (1.1 pounds) capacity each",
          "Inner receptacles require rubber stoppers wire-tied for securement",
          "Material must contain not less than 50 percent water by mass",
        ],
        notes: [
          "If transportation is to take place when freezing weather is possible, ensure a suitable antifreeze solution is used to prevent freezing",
        ],
        isComplete: true,
      },
    ],

    specialRequirements: [
      {
        type: "material_compatibility",
        description:
          "Pack barium azide wetted with not less than 50 percent water by mass",
        mandatory: true,
        applicableContainers: ["A8.10.glass_receptacles"],
      },
      {
        type: "closure_security",
        description:
          "Inner receptacles require rubber stoppers wire-tied for securement",
        mandatory: true,
        applicableContainers: ["A8.10.glass_receptacles"],
      },
      {
        type: "temperature_control",
        description:
          "If transportation is to take place when freezing weather is possible, ensure a suitable antifreeze solution is used to prevent freezing",
        mandatory: true,
        applicableContainers: ["A8.10.glass_receptacles"],
      },
      {
        type: "material_compatibility",
        description:
          "Use glass receptacles only - other materials not authorized for this wetted azide compound",
        mandatory: true,
        applicableContainers: ["A8.10.glass_receptacles"],
      },
    ],

    quantityLimits: [
      {
        scope: "per_inner",
        value: 0.5,
        unit: "kg",
        description:
          "Inner glass receptacles may not be over 0.5 kg (1.1 pounds) capacity each",
      },
      {
        scope: "per_inner",
        value: 50,
        unit: "percent",
        description: "Must contain not less than 50 percent water by mass",
      },
    ],

    conditionalRequirements: [
      {
        condition: "transport_temperature_conditions = 'freezing_possible'",
        requirements: [
          {
            type: "temperature_control",
            description:
              "Must use suitable antifreeze solution to prevent freezing",
            mandatory: true,
            applicableContainers: ["A8.10.glass_receptacles"],
          },
        ],
      },
      {
        condition: "water_content < 50",
        requirements: [
          {
            type: "material_compatibility",
            description:
              "Material does not qualify for this packaging paragraph - insufficient water content",
            mandatory: true,
            applicableContainers: ["A8.10.glass_receptacles"],
          },
        ],
      },
    ],

    referencedParagraphs: [],
  },
  "A8.11.": {
    paragraphId: "A8.11.",
    hazardClass: 4,
    description:
      "Package Calcium Pyrophoric; Magnesium Diphenyl; Metal Catalyst, Dry; Pyrophoric Metals, N.O.S. and Pyrophoric Solids, N.O.S.",
    lastUpdated: new Date().toISOString(),
    entryType: "standard",
    materialTypes: [
      "pyrophoric_solids",
      "metal_catalyst_dry",
      "calcium_pyrophoric",
      "magnesium_diphenyl",
    ],

    packagingOptions: [
      {
        id: "A8.11.1.metal_wood_boxes",
        type: "combination",
        description: "Metal receptacles in wooden boxes (15 kg inner limit)",
        innerPackaging: {
          required: true,
          materials: ["Metal receptacles"],
          description:
            "Metal receptacles with positive (not friction) means of closure",
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "boxes",
              subtype: "wood_various",
              containers: [
                {
                  code: "4C1",
                  material: "natural_wood",
                  description: "Natural wood box (4C1)",
                },
                {
                  code: "4C2",
                  material: "sift_proof_wood",
                  description: "Sift-proof natural wood box (4C2)",
                },
                {
                  code: "4D",
                  material: "plywood",
                  description: "Plywood box (4D)",
                },
                {
                  code: "4F",
                  material: "reconstituted_wood",
                  description: "Reconstituted wood box (4F)",
                },
              ],
            },
          ],
        },
      },
      {
        id: "A8.11.2.metal_fiberboard_box",
        type: "combination",
        description: "Metal receptacles in fiberboard box (7.5 kg inner limit)",
        innerPackaging: {
          required: true,
          materials: ["Metal receptacles"],
          description:
            "Metal receptacles with positive (not friction) means of closure",
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "boxes",
              subtype: "fiberboard",
              containers: [
                {
                  code: "4G",
                  material: "fiberboard",
                  description: "Fiberboard box (4G)",
                },
              ],
            },
          ],
        },
      },
      {
        id: "A8.11.3.metal_drums_fiber_plywood",
        type: "combination",
        description:
          "Metal receptacles in fiber or plywood drums (15 kg inner limit)",
        innerPackaging: {
          required: true,
          materials: ["Metal receptacles"],
          description:
            "Metal receptacles with positive (not friction) means of closure",
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "drums",
              subtype: "fiber_plywood",
              containers: [
                {
                  code: "1G",
                  material: "fiber",
                  description: "Fiber drum (1G)",
                },
                {
                  code: "1D",
                  material: "plywood",
                  description: "Plywood drum (1D)",
                },
              ],
            },
          ],
        },
      },
      {
        id: "A8.11.4.metal_drums_comprehensive",
        type: "combination",
        description:
          "Metal receptacles in metal drums (15 kg inner limit, 150 kg gross weight limit for metal drums)",
        innerPackaging: {
          required: true,
          materials: ["Metal receptacles"],
          description:
            "Metal receptacles with positive (not friction) means of closure (not required for metal drums)",
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "drums",
              subtype: "metal_comprehensive",
              containers: [
                {
                  code: "1A1",
                  material: "steel",
                  description: "Steel drum (1A1)",
                },
                {
                  code: "1A2",
                  material: "steel",
                  description: "Removable head steel drum (1A2)",
                },
                {
                  code: "1B1",
                  material: "aluminum",
                  description: "Aluminum drum (1B1)",
                },
                {
                  code: "1B2",
                  material: "aluminum",
                  description: "Removable head aluminum drum (1B2)",
                },
                {
                  code: "1D",
                  material: "plywood",
                  description: "Plywood drum (1D)",
                },
                {
                  code: "1G",
                  material: "fiber",
                  description: "Fiber drum (1G)",
                },
                {
                  code: "1N1",
                  material: "other_metal",
                  description: "Other metal drum (1N1)",
                },
                {
                  code: "1N2",
                  material: "other_metal",
                  description: "Removable head other metal drum (1N2)",
                },
              ],
            },
          ],
        },
      },
      {
        id: "A8.11.5.metal_drums_comprehensive_alt",
        type: "combination",
        description:
          "Metal receptacles in drums (15 kg inner limit, 150 kg gross weight limit for metal drums) (A8.11.5)",
        innerPackaging: {
          required: true,
          materials: ["Metal receptacles"],
          description:
            "Metal receptacles with positive (not friction) means of closure (not required for metal drums)",
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "drums",
              subtype: "metal_comprehensive",
              containers: [
                {
                  code: "1A1",
                  material: "steel",
                  description: "Steel drum (1A1)",
                },
                {
                  code: "1A2",
                  material: "steel",
                  description: "Removable head steel drum (1A2)",
                },
                {
                  code: "1B1",
                  material: "aluminum",
                  description: "Aluminum drum (1B1)",
                },
                {
                  code: "1B2",
                  material: "aluminum",
                  description: "Removable head aluminum drum (1B2)",
                },
                {
                  code: "1D",
                  material: "plywood",
                  description: "Plywood drum (1D)",
                },
                {
                  code: "1G",
                  material: "fiber",
                  description: "Fiber drum (1G)",
                },
                {
                  code: "1N1",
                  material: "other_metal",
                  description: "Other metal drum (1N1)",
                },
                {
                  code: "1N2",
                  material: "other_metal",
                  description: "Removable head other metal drum (1N2)",
                },
              ],
            },
          ],
        },
      },
    ],

    specialRequirements: [
      {
        type: "closure_type",
        description:
          "Inner receptacles must have positive (not friction) means of closure",
        mandatory: true,
        applicableContainers: [
          "A8.11.1.metal_wood_boxes",
          "A8.11.2.metal_fiberboard_box",
          "A8.11.3.metal_drums_fiber_plywood",
          "A8.11.4.metal_drums_comprehensive",
        ],
      },
      {
        type: "closure_type",
        description:
          "Positive closure not required for metal drums (inner receptacles)",
        mandatory: false,
        applicableContainers: ["A8.11.4.metal_drums_comprehensive"],
      },
      {
        type: "material_compatibility",
        description: "Only metal receptacles authorized for inner packaging",
        mandatory: true,
        applicableContainers: [
          "A8.11.1.metal_wood_boxes",
          "A8.11.2.metal_fiberboard_box",
          "A8.11.3.metal_drums_fiber_plywood",
          "A8.11.4.metal_drums_comprehensive",
        ],
      },
      {
        type: "weight_limit",
        description:
          "Inner metal receptacles may not contain more than 15 kg (33 pounds) each for most packaging options",
        mandatory: true,
        applicableContainers: [
          "A8.11.1.metal_wood_boxes",
          "A8.11.3.metal_drums_fiber_plywood",
          "A8.11.4.metal_drums_comprehensive",
        ],
      },
      {
        type: "weight_limit",
        description:
          "Inner metal receptacles may not contain more than 7.5 kg (17 pounds) each for fiberboard packaging",
        mandatory: true,
        applicableContainers: ["A8.11.2.metal_fiberboard_box"],
      },
      {
        type: "weight_limit",
        description:
          "For metal drums, gross weight may not exceed 150 kg (331 pounds) each",
        mandatory: true,
        applicableContainers: ["A8.11.4.metal_drums_comprehensive"],
      },
      {
        type: "weight_limit",
        description:
          "Inner metal receptacles may not contain more than 15 kg (33 pounds) each",
        mandatory: true,
        applicableContainers: ["A8.11.5.metal_drums_comprehensive_alt"],
      },
      {
        type: "weight_limit",
        description:
          "For metal drums, gross weight may not exceed 150 kg (331 pounds) each",
        mandatory: true,
        applicableContainers: ["A8.11.5.metal_drums_comprehensive_alt"],
      },
    ],

    quantityLimits: [
      {
        scope: "per_inner",
        value: 15,
        unit: "kg",
        description:
          "Inner metal receptacles may not contain more than 15 kg (33 pounds) each (A8.11.1, A8.11.3, A8.11.4)",
      },
      {
        scope: "per_inner",
        value: 7.5,
        unit: "kg",
        description:
          "Inner metal receptacles may not contain more than 7.5 kg (17 pounds) each (A8.11.2)",
      },
      {
        scope: "per_drum",
        value: 150,
        unit: "kg",
        description:
          "For metal drums, gross weight may not exceed 150 kg (331 pounds) each",
      },
      {
        scope: "per_inner",
        value: 15,
        unit: "kg",
        description:
          "Inner metal receptacles may not contain more than 15 kg (33 pounds) each (A8.11.5)",
      },
    ],

    conditionalRequirements: [
      {
        condition: "container_type == 'metal_drum'",
        requirements: [
          {
            type: "closure_type",
            description:
              "Positive closure not required for metal drums themselves",
            mandatory: false,
            applicableContainers: ["A8.11.4.metal_drums_comprehensive"],
          },
        ],
      },
      {
        condition: "packaging_option == 'A8.11.2'",
        requirements: [
          {
            type: "weight_limit",
            description:
              "Reduced weight limit (7.5 kg) applies for fiberboard packaging",
            mandatory: true,
            applicableContainers: ["A8.11.2.metal_fiberboard_box"],
          },
        ],
      },
      {
        condition: "packaging_option == 'A8.11.5'",
        requirements: [
          {
            type: "weight_limit",
            description:
              "For metal drums, gross weight may not exceed 150 kg (331 pounds) each",
            mandatory: true,
            applicableContainers: ["A8.11.5.metal_drums_comprehensive_alt"],
          },
        ],
      },
    ],

    referencedParagraphs: [],
  },
  "A8.12.": {
    paragraphId: "A8.12.",
    hazardClass: 4,
    description:
      "Package Films, Nitrocellulose Base (gelatin coated [except scrap])",
    lastUpdated: new Date().toISOString(),
    entryType: "specialized",
    materialTypes: ["films_nitrocellulose_base", "gelatin_coated_films"],

    packagingOptions: [
      {
        id: "A8.12.nitrocellulose_films",
        type: "combination",
        description: "Nitrocellulose films in various outer packaging options",
        innerPackaging: {
          required: true,
          materials: [
            "Metal cans",
            "Polypropylene canisters",
            "Strong fiberboard",
          ],
          description:
            "Metal can, polypropylene canister, or strong fiberboard - each reel in a tightly closed inner packaging",
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "drums",
              subtype: "various_drums",
              containers: [
                {
                  code: "1A2",
                  material: "steel",
                  description: "Removable head steel drum (1A2)",
                },
                {
                  code: "1B2",
                  material: "aluminum",
                  description: "Removable head aluminum drum (1B2)",
                },
                {
                  code: "1D",
                  material: "plywood",
                  description: "Plywood drum (1D)",
                },
                {
                  code: "1G",
                  material: "fiber",
                  description: "Fiber drum (1G)",
                },
                {
                  code: "4A2",
                  material: "steel",
                  description: "Other metal drum (4A2)",
                },
              ],
            },
            {
              type: "jerricans",
              subtype: "metal_jerricans",
              containers: [
                {
                  code: "3A2",
                  material: "steel",
                  description: "Removable head steel jerrican (3A2)",
                },
                {
                  code: "3B2",
                  material: "aluminum",
                  description: "Removable head aluminum jerrican (3B2)",
                },
              ],
            },
            {
              type: "boxes",
              subtype: "various_boxes",
              containers: [
                {
                  code: "4A",
                  material: "steel",
                  description: "Steel box (4A)",
                },
                {
                  code: "4B",
                  material: "aluminum",
                  description: "Aluminum box (4B)",
                },
                {
                  code: "4C1",
                  material: "natural_wood",
                  description: "Natural wood box (4C1)",
                },
                {
                  code: "4C2",
                  material: "sift_proof_wood",
                  description: "Sift-proof natural wood box (4C2)",
                },
                {
                  code: "4D",
                  material: "plywood",
                  description: "Plywood box (4D)",
                },
                {
                  code: "4F",
                  material: "reconstituted_wood",
                  description: "Reconstituted wood box (4F)",
                },
                {
                  code: "4G",
                  material: "fiberboard",
                  description: "Fiberboard box (4G)",
                },
                {
                  code: "4N",
                  material: "other_metal",
                  description: "Other metal box (4N)",
                },
              ],
            },
          ],
        },
      },
    ],

    specialRequirements: [
      {
        type: "packaging_method",
        description:
          "Each reel in a tightly closed inner packaging with its cover securely held in place with adhesive tape or adhesive paper",
        mandatory: true,
        applicableContainers: ["A8.12.nitrocellulose_films"],
      },
      {
        type: "material_compatibility",
        description:
          "Inner packaging must be metal can, polypropylene canister, or strong fiberboard",
        mandatory: true,
        applicableContainers: ["A8.12.nitrocellulose_films"],
      },
      {
        type: "film_length_restriction",
        description:
          "Fiber drums (1G) may only be used for film not exceeding 600 m (1969 feet)",
        mandatory: true,
        applicableContainers: ["A8.12.nitrocellulose_films"],
      },
      {
        type: "film_length_restriction",
        description:
          "Fiberboard (4G) may only be used for film not exceeding 600 m (1969 feet)",
        mandatory: true,
        applicableContainers: ["A8.12.nitrocellulose_films"],
      },
      {
        type: "material_exclusion",
        description: "Scrap films are not covered by this packaging paragraph",
        mandatory: true,
        applicableContainers: ["A8.12.nitrocellulose_films"],
      },
    ],

    quantityLimits: [
      {
        scope: "per_package",
        value: 600,
        unit: "m",
        description:
          "Film length restriction for fiber drums (1G) - maximum 600 m (1969 feet)",
      },
      {
        scope: "per_package",
        value: 600,
        unit: "m",
        description:
          "Film length restriction for fiberboard boxes (4G) - maximum 600 m (1969 feet)",
      },
    ],

    conditionalRequirements: [
      {
        condition: "container_code == '1G'",
        requirements: [
          {
            type: "film_length_restriction",
            description:
              "Film length may not exceed 600 m (1969 feet) for fiber drums",
            mandatory: true,
            applicableContainers: ["A8.12.nitrocellulose_films"],
          },
        ],
      },
      {
        condition: "container_code == '4G'",
        requirements: [
          {
            type: "film_length_restriction",
            description:
              "Film length may not exceed 600 m (1969 feet) for fiberboard boxes",
            mandatory: true,
            applicableContainers: ["A8.12.nitrocellulose_films"],
          },
        ],
      },
      {
        condition: "material_type == 'scrap'",
        requirements: [
          {
            type: "material_exclusion",
            description:
              "Scrap films are not authorized under this packaging paragraph",
            mandatory: true,
            applicableContainers: ["A8.12.nitrocellulose_films"],
          },
        ],
      },
    ],

    referencedParagraphs: [],
  },
  "A8.13.": {
    paragraphId: "A8.13.",
    hazardClass: 4,
    description: "Package Fusees (railway or highway)",
    lastUpdated: new Date().toISOString(),
    entryType: "specialized",
    materialTypes: ["fusees_railway", "fusees_highway"],

    packagingOptions: [
      {
        id: "A8.13.fusees_general",
        type: "single",
        description:
          "Fusees in drums, jerricans, or boxes with spike protection",
        innerPackaging: {
          required: false,
          description: "Inner packaging not required",
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "drums",
              subtype: "steel_plywood_fiber",
              containers: [
                {
                  code: "1A2",
                  material: "steel",
                  description: "Removable head steel drum (1A2)",
                },
                {
                  code: "1D",
                  material: "plywood",
                  description: "Plywood drum (1D)",
                },
                {
                  code: "1G",
                  material: "fiber",
                  description: "Fiber drum (1G)",
                },
              ],
            },
            {
              type: "jerricans",
              subtype: "steel_only",
              containers: [
                {
                  code: "3A2",
                  material: "steel",
                  description: "Removable head steel jerrican (3A2)",
                },
              ],
            },
            {
              type: "boxes",
              subtype: "wood_various",
              containers: [
                {
                  code: "4C1",
                  material: "natural_wood",
                  description: "Natural wood box (4C1)",
                },
                {
                  code: "4C2",
                  material: "sift_proof_wood",
                  description: "Sift-proof natural wood box (4C2)",
                },
                {
                  code: "4D",
                  material: "plywood",
                  description: "Plywood box (4D)",
                },
                {
                  code: "4F",
                  material: "reconstituted_wood",
                  description: "Reconstituted wood box (4F)",
                },
                {
                  code: "4G",
                  material: "fiberboard",
                  description: "Fiberboard box (4G)",
                },
              ],
            },
          ],
        },
      },
    ],

    specialRequirements: [
      {
        type: "spike_protection",
        description:
          "Fusees that are equipped with spikes having reinforced ends to prevent penetration of the spikes through the outer packaging",
        mandatory: true,
        applicableContainers: ["A8.13.fusees_general"],
      },
      {
        type: "drop_test",
        description:
          "Ensure the packages are capable of passing at least one drop test with the spike in a downward position",
        mandatory: true,
        applicableContainers: ["A8.13.fusees_general"],
      },
      {
        type: "spike_reinforcement",
        description:
          "Spikes must have reinforced ends to prevent penetration through outer packaging",
        mandatory: true,
        applicableContainers: ["A8.13.fusees_general"],
      },
    ],

    quantityLimits: [],

    conditionalRequirements: [
      {
        condition: "spike_equipped == true",
        requirements: [
          {
            type: "spike_protection",
            description:
              "Reinforced spike ends and drop test requirements apply to spike-equipped fusees",
            mandatory: true,
            applicableContainers: ["A8.13.fusees_general"],
          },
        ],
      },
    ],

    referencedParagraphs: [],
  },
  "A8.14.": {
    paragraphId: "A8.14.",
    hazardClass: 4,
    description:
      "Package Matches, Fusee; Matches, Safety (book, card, or strike-on-box); Matches Strike-Anywhere, and Matches, Wax Vesta",
    lastUpdated: new Date().toISOString(),
    entryType: "standard",
    materialTypes: [
      "matches_fusee",
      "matches_safety",
      "matches_strike_anywhere",
      "matches_wax_vesta",
    ],

    packagingOptions: [
      {
        id: "A8.14.matches_general",
        type: "combination",
        description: "Various match types in securely closed inner containers",
        innerPackaging: {
          required: true,
          materials: [
            "Securely closed chipboard receptacles",
            "Fiberboard receptacles",
            "Wood receptacles",
            "Metal receptacles",
          ],
          description:
            "Securely closed chipboard, fiberboard, wood, or metal receptacles",
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "drums",
              subtype: "metal_comprehensive",
              containers: [
                {
                  code: "1A1",
                  material: "steel",
                  description: "Steel drum (1A1)",
                },
                {
                  code: "1A2",
                  material: "steel",
                  description: "Removable head steel drum (1A2)",
                },
                {
                  code: "1B1",
                  material: "aluminum",
                  description: "Aluminum drum (1B1)",
                },
                {
                  code: "1B2",
                  material: "aluminum",
                  description: "Removable head aluminum drum (1B2)",
                },
                {
                  code: "1D",
                  material: "plywood",
                  description: "Plywood drum (1D)",
                },
                {
                  code: "1G",
                  material: "fiber",
                  description: "Fiber drum (1G)",
                },
                {
                  code: "1N1",
                  material: "other_metal",
                  description: "Other metal drum (1N1)",
                },
                {
                  code: "1N2",
                  material: "other_metal",
                  description: "Removable head other metal drum (1N2)",
                },
              ],
            },
            {
              type: "jerricans",
              subtype: "metal_comprehensive",
              containers: [
                {
                  code: "3A1",
                  material: "steel",
                  description: "Steel jerrican (3A1)",
                },
                {
                  code: "3A2",
                  material: "steel",
                  description: "Removable head steel jerrican (3A2)",
                },
                {
                  code: "3B1",
                  material: "aluminum",
                  description: "Aluminum jerrican (3B1)",
                },
                {
                  code: "3B2",
                  material: "aluminum",
                  description: "Removable head aluminum jerrican (3B2)",
                },
              ],
            },
            {
              type: "boxes",
              subtype: "comprehensive",
              containers: [
                {
                  code: "4A",
                  material: "steel",
                  description: "Steel box (4A)",
                },
                {
                  code: "4B",
                  material: "aluminum",
                  description: "Aluminum box (4B)",
                },
                {
                  code: "4C1",
                  material: "natural_wood",
                  description: "Natural wood box (4C1)",
                },
                {
                  code: "4C2",
                  material: "sift_proof_wood",
                  description: "Sift-proof natural wood box (4C2)",
                },
                {
                  code: "4D",
                  material: "plywood",
                  description: "Plywood box (4D)",
                },
                {
                  code: "4F",
                  material: "reconstituted_wood",
                  description: "Reconstituted wood box (4F)",
                },
                {
                  code: "4G",
                  material: "fiberboard",
                  description: "Fiberboard box (4G)",
                },
                {
                  code: "4N",
                  material: "other_metal",
                  description: "Other metal box (4N)",
                },
              ],
            },
          ],
        },
      },
    ],

    specialRequirements: [
      {
        type: "temperature_test",
        description:
          "Matches must be of a type that will not ignite spontaneously when subjected to a temperature of 93.3 degrees C (200 degrees F) for 8 consecutive hours in a properly conducted laboratory test",
        mandatory: true,
        applicableContainers: ["A8.14.matches_general"],
      },
      {
        type: "packaging_separation",
        description:
          "Do not pack matches, strike-anywhere, in the same outer packaging with any other article except safety matches or wax vesta matches",
        mandatory: true,
        applicableContainers: ["A8.14.matches_general"],
      },
      {
        type: "packaging_separation",
        description:
          "Do not pack fusee matches, in the same outer packaging with any other article except safety matches or wax vesta matches",
        mandatory: true,
        applicableContainers: ["A8.14.matches_general"],
      },
      {
        type: "inner_container_separation",
        description:
          "Package safety matches or wax vesta matches in separate inside containers",
        mandatory: true,
        applicableContainers: ["A8.14.matches_general"],
      },
      {
        type: "packaging_method",
        description:
          "Tightly pack safety matches (strike-on-box, book, and card) or wax vesta matches in securely closed inside containers then packed in an outer packaging",
        mandatory: true,
        applicableContainers: ["A8.14.matches_general"],
      },
      {
        type: "compatibility",
        description:
          "Safety matches may be packed in the same outer packaging with non hazardous materials",
        mandatory: false,
        applicableContainers: ["A8.14.matches_general"],
      },
    ],

    quantityLimits: [
      {
        scope: "per_inner",
        value: 700,
        unit: "pieces",
        description: "Each inside packaging may not contain over 700 matches",
      },
      {
        scope: "per_package",
        value: 30,
        unit: "kg",
        description:
          "Gross weight may not be over 30 kg (66 pounds) for fiberboard boxes",
      },
      {
        scope: "per_package",
        value: 45.4,
        unit: "kg",
        description:
          "Gross weight may not be over 45.4 kg (100 pounds) for all other outer packagings",
      },
    ],

    conditionalRequirements: [
      {
        condition: "match_type == 'strike_anywhere'",
        requirements: [
          {
            type: "packaging_separation",
            description:
              "Strike-anywhere matches may only be packed with safety matches or wax vesta matches",
            mandatory: true,
            applicableContainers: ["A8.14.matches_general"],
          },
        ],
      },
      {
        condition: "match_type == 'fusee'",
        requirements: [
          {
            type: "packaging_separation",
            description:
              "Fusee matches may only be packed with safety matches or wax vesta matches",
            mandatory: true,
            applicableContainers: ["A8.14.matches_general"],
          },
        ],
      },
      {
        condition: "outer_packaging == '4G'",
        requirements: [
          {
            type: "weight_limit",
            description:
              "Maximum gross weight of 30 kg (66 pounds) for fiberboard boxes",
            mandatory: true,
            applicableContainers: ["A8.14.matches_general"],
          },
        ],
      },
      {
        condition: "outer_packaging != '4G'",
        requirements: [
          {
            type: "weight_limit",
            description:
              "Maximum gross weight of 45.4 kg (100 pounds) for non-fiberboard outer packagings",
            mandatory: true,
            applicableContainers: ["A8.14.matches_general"],
          },
        ],
      },
    ],

    referencedParagraphs: [],
  },
  "A8.15.": {
    paragraphId: "A8.15.",
    hazardClass: 4,
    description: "UN3541, Articles containing flammable solid N.O.S.",
    lastUpdated: new Date().toISOString(),
    entryType: "specialized",
    materialTypes: ["articles_flammable_solid_nos"],

    packagingOptions: [
      {
        id: "A8.15.1.packaged_articles",
        type: "combination",
        description:
          "Packaged articles meeting Packing Group II performance requirements",
        innerPackaging: {
          required: true,
          materials: ["Various"],
          description:
            "Receptacles constructed of suitable materials and secured in the article to prevent breakage, puncture or leakage",
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "drums",
              subtype: "removable_head_various",
              containers: [
                {
                  code: "1A2",
                  material: "steel",
                  description: "Removable head steel drum (1A2)",
                },
                {
                  code: "1B2",
                  material: "aluminum",
                  description: "Removable head aluminum drum (1B2)",
                },
                {
                  code: "1N2",
                  material: "other_metal",
                  description:
                    "Removable head metal other than steel or aluminum (1N2)",
                },
                {
                  code: "1D",
                  material: "plywood",
                  description: "Plywood drum (1D)",
                },
                {
                  code: "1G",
                  material: "fiber",
                  description: "Fiber drum (1G)",
                },
                {
                  code: "1H2",
                  material: "plastic",
                  description: "Removable head plastic drum (1H2)",
                },
              ],
            },
            {
              type: "boxes",
              subtype: "comprehensive",
              containers: [
                {
                  code: "4A",
                  material: "steel",
                  description: "Steel box (4A)",
                },
                {
                  code: "4B",
                  material: "aluminum",
                  description: "Aluminum box (4B)",
                },
                {
                  code: "4C1",
                  material: "natural_wood",
                  description: "Ordinary natural wood box (4C1)",
                },
                {
                  code: "4C2",
                  material: "sift_proof_wood",
                  description: "Sift-proof natural wood box (4C2)",
                },
                {
                  code: "4D",
                  material: "plywood",
                  description: "Plywood box (4D)",
                },
                {
                  code: "4F",
                  material: "reconstituted_wood",
                  description: "Reconstituted wood box (4F)",
                },
                {
                  code: "4G",
                  material: "fiberboard",
                  description: "Fiberboard box (4G)",
                },
                {
                  code: "4H1",
                  material: "plastic",
                  description: "Expanded plastic box (4H1)",
                },
                {
                  code: "4H2",
                  material: "plastic",
                  description: "Solid plastic box (4H2)",
                },
                {
                  code: "4N",
                  material: "other_metal",
                  description: "Other metal box (4N)",
                },
              ],
            },
            {
              type: "jerricans",
              subtype: "removable_head",
              containers: [
                {
                  code: "3A2",
                  material: "steel",
                  description: "Removable head steel jerrican (3A2)",
                },
                {
                  code: "3H2",
                  material: "plastic",
                  description: "Plastic removable head jerrican (3H2)",
                },
                {
                  code: "3B2",
                  material: "aluminum",
                  description: "Aluminum removable head jerrican (3B2)",
                },
              ],
            },
          ],
        },
      },
      {
        id: "A8.15.2.robust_articles_packaged",
        type: "single",
        description: "Robust articles in strong outer packagings",
        innerPackaging: {
          required: false,
          description: "Inner packaging not required for robust articles",
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "specialized",
              subtype: "strong_outer_packaging",
              containers: [
                {
                  code: "STRONG",
                  material: "various",
                  description:
                    "Strong outer packagings constructed of suitable material and of adequate strength and design",
                },
              ],
            },
          ],
        },
      },
      {
        id: "A8.15.2.robust_articles_unpackaged",
        type: "specialized",
        description: "Robust articles transported unpackaged or on pallets",
        innerPackaging: {
          required: false,
          description: "Inner packaging not required",
        },
        outerPackaging: {
          required: false,
          categories: [
            {
              type: "specialized",
              subtype: "unpackaged_pallet",
              containers: [
                {
                  code: "UNPACKAGED",
                  material: "none",
                  description:
                    "Unpackaged or on pallets when dangerous goods are afforded equivalent protection by the article",
                },
              ],
            },
          ],
        },
      },
    ],

    specialRequirements: [
      {
        type: "performance_level",
        description:
          "When packaged, packagings meeting Packing Group II performance is required",
        mandatory: true,
        applicableContainers: ["A8.15.1.packaged_articles"],
      },
      {
        type: "movement_prevention",
        description:
          "Pack articles to prevent movement and inadvertent operation during normal conditions of transport",
        mandatory: true,
        applicableContainers: ["A8.15.1.packaged_articles"],
      },
      {
        type: "containment_integrity",
        description:
          "Where there is no receptacle within the article, ensure the article fully encloses the dangerous goods and prevent their release under normal conditions of transport",
        mandatory: true,
        applicableContainers: ["A8.15.1.packaged_articles"],
      },
      {
        type: "receptacle_construction",
        description:
          "Receptacles must be constructed of suitable materials and secured in the article in such a way that, under normal conditions of transport, they cannot break, be punctured or leak their contents into the article itself or the outer packaging",
        mandatory: true,
        applicableContainers: ["A8.15.1.packaged_articles"],
      },
      {
        type: "robust_article_protection",
        description:
          "Robust articles may be transported in strong outer packagings constructed of suitable material and of adequate strength and design in relation to the packaging capacity and its intended use",
        mandatory: false,
        applicableContainers: ["A8.15.2.robust_articles_packaged"],
      },
      {
        type: "equivalent_protection",
        description:
          "Robust articles may be transported unpackaged or on pallets when the dangerous goods are afforded equivalent protection by the article in which they are contained",
        mandatory: false,
        applicableContainers: ["A8.15.2.robust_articles_unpackaged"],
      },
    ],

    quantityLimits: [
      {
        scope: "per_package",
        value: 50,
        unit: "kg",
        description: "Maximum net quantity per package 50 kg",
      },
    ],

    conditionalRequirements: [
      {
        condition: "article_type == 'packaged'",
        requirements: [
          {
            type: "performance_level",
            description: "Must meet Packing Group II performance requirements",
            mandatory: true,
            applicableContainers: ["A8.15.1.packaged_articles"],
          },
        ],
      },
      {
        condition: "article_type == 'robust'",
        requirements: [
          {
            type: "packaging_flexibility",
            description:
              "May be transported packaged in strong outer packaging or unpackaged/on pallets with equivalent protection",
            mandatory: false,
            applicableContainers: [
              "A8.15.2.robust_articles_packaged",
              "A8.15.2.robust_articles_unpackaged",
            ],
          },
        ],
      },
      {
        condition: "receptacle_present == false",
        requirements: [
          {
            type: "containment_integrity",
            description:
              "Article must fully enclose dangerous goods and prevent release under normal transport conditions",
            mandatory: true,
            applicableContainers: ["A8.15.1.packaged_articles"],
          },
        ],
      },
    ],

    referencedParagraphs: ["A4.2.3."],
  },
  "A8.16.": {
    paragraphId: "A8.16.",
    hazardClass: 4,
    description:
      "Package Phosphorus, White or Yellow, Dry, or Under Water, or in Solution",
    lastUpdated: new Date().toISOString(),
    entryType: "specialized",
    materialTypes: [
      "phosphorus_white_yellow_dry",
      "phosphorus_white_yellow_water",
      "phosphorus_white_yellow_solution",
      "white_phosphorus_igniters",
    ],

    packagingOptions: [
      {
        id: "A8.16.1.dry_phosphorus",
        type: "single",
        description: "Phosphorus white or yellow, when dry, cast solid",
        innerPackaging: {
          required: false,
          description: "Inner packaging not required",
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "drums",
              subtype: "metal_drums_small",
              containers: [
                {
                  code: "1A2",
                  material: "steel",
                  description: "Steel removable head drum (1A2)",
                },
                {
                  code: "1B2",
                  material: "aluminum",
                  description: "Aluminum removable head drum (1B2)",
                },
                {
                  code: "1N2",
                  material: "other_metal",
                  description: "Other metal removable head drum (1N2)",
                },
              ],
            },
            {
              type: "specialized",
              subtype: "projectiles_bombs",
              containers: [
                {
                  code: "PROJECTILE",
                  material: "various",
                  description:
                    "In projectiles or bombs without bursting elements",
                },
              ],
            },
          ],
        },
      },
      {
        id: "A8.16.2.water_solution_hermetic",
        type: "combination",
        description:
          "Phosphorus in water or solution with hermetically-sealed metal cans",
        innerPackaging: {
          required: true,
          materials: ["Metal"],
          description:
            "Inside soldered or hermetically-sealed metal cans placed inside another soldered or hermetically-sealed metal can",
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "boxes",
              subtype: "metal_wood",
              containers: [
                {
                  code: "4A",
                  material: "steel",
                  description: "Steel box (4A)",
                },
                {
                  code: "4B",
                  material: "aluminum",
                  description: "Aluminum box (4B)",
                },
                {
                  code: "4N",
                  material: "other_metal",
                  description: "Other metal box (4N)",
                },
                {
                  code: "4C1",
                  material: "natural_wood",
                  description: "Natural wood box (4C1)",
                },
                {
                  code: "4C2",
                  material: "sift_proof_wood",
                  description: "Sift-proof natural wood box (4C2)",
                },
                {
                  code: "4D",
                  material: "plywood",
                  description: "Plywood box (4D)",
                },
                {
                  code: "4F",
                  material: "reconstituted_wood",
                  description: "Reconstituted wood box (4F)",
                },
              ],
            },
          ],
        },
      },
      {
        id: "A8.16.2.water_solution_watertight",
        type: "combination",
        description:
          "Phosphorus in water or solution with water-tight metal cans",
        innerPackaging: {
          required: true,
          materials: ["Metal"],
          description:
            "Inside water-tight metal cans containing not over 0.5 kg (1 pound) of phosphorus with screw-top closures",
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "boxes",
              subtype: "metal_wood",
              containers: [
                {
                  code: "4A",
                  material: "steel",
                  description: "Steel box (4A)",
                },
                {
                  code: "4B",
                  material: "aluminum",
                  description: "Aluminum box (4B)",
                },
                {
                  code: "4N",
                  material: "other_metal",
                  description: "Other metal box (4N)",
                },
                {
                  code: "4C1",
                  material: "natural_wood",
                  description: "Natural wood box (4C1)",
                },
                {
                  code: "4C2",
                  material: "sift_proof_wood",
                  description: "Sift-proof natural wood box (4C2)",
                },
                {
                  code: "4D",
                  material: "plywood",
                  description: "Plywood box (4D)",
                },
                {
                  code: "4F",
                  material: "reconstituted_wood",
                  description: "Reconstituted wood box (4F)",
                },
              ],
            },
          ],
        },
      },
      {
        id: "A8.16.2.large_drums",
        type: "single",
        description: "Phosphorus in water or solution in large drums",
        innerPackaging: {
          required: false,
          description: "Inner packaging not required",
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "drums",
              subtype: "metal_large",
              containers: [
                {
                  code: "1A1",
                  material: "steel",
                  description: "Steel drum (1A1)",
                },
                {
                  code: "1B1",
                  material: "aluminum",
                  description: "Aluminum drum (1B1)",
                },
                {
                  code: "1N1",
                  material: "other_metal",
                  description: "Other metal drum (1N1)",
                },
              ],
            },
          ],
        },
      },
      {
        id: "A8.16.2.medium_drums",
        type: "single",
        description: "Phosphorus in water or solution in medium drums",
        innerPackaging: {
          required: false,
          description: "Inner packaging not required",
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "drums",
              subtype: "metal_medium",
              containers: [
                {
                  code: "1A2",
                  material: "steel",
                  description: "Steel removable head drum (1A2)",
                },
                {
                  code: "1B2",
                  material: "aluminum",
                  description: "Aluminum removable head drum (1B2)",
                },
                {
                  code: "1N2",
                  material: "other_metal",
                  description: "Other metal removable head drum (1N2)",
                },
              ],
            },
          ],
        },
      },
      {
        id: "A8.16.3.igniters",
        type: "combination",
        description:
          "White phosphorus igniters in hermetically-sealed metal cans",
        innerPackaging: {
          required: true,
          materials: ["Metal"],
          description:
            "One each in a hermetically-sealed (soldered) or watertight metal can, sealed airtight and positively fastened",
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "boxes",
              subtype: "wood_only",
              containers: [
                {
                  code: "4C1",
                  material: "natural_wood",
                  description: "Natural wood box (4C1)",
                },
                {
                  code: "4C2",
                  material: "sift_proof_wood",
                  description: "Sift-proof natural wood box (4C2)",
                },
                {
                  code: "4D",
                  material: "plywood",
                  description: "Plywood box (4D)",
                },
                {
                  code: "4F",
                  material: "reconstituted_wood",
                  description: "Reconstituted wood box (4F)",
                },
              ],
            },
          ],
        },
      },
    ],

    specialRequirements: [
      {
        type: "material_state",
        description:
          "Phosphorus white or yellow, when dry, must be cast solid and shipped in containers",
        mandatory: true,
        applicableContainers: ["A8.16.1.dry_phosphorus"],
      },
      {
        type: "projectile_restriction",
        description: "In projectiles or bombs without bursting elements",
        mandatory: true,
        applicableContainers: ["A8.16.1.dry_phosphorus"],
      },
      {
        type: "hermetic_sealing",
        description:
          "Inside soldered or hermetically-sealed metal cans placed inside another soldered or hermetically-sealed metal can",
        mandatory: true,
        applicableContainers: ["A8.16.2.water_solution_hermetic"],
      },
      {
        type: "screw_closure",
        description: "Inside water-tight metal cans with screw-top closures",
        mandatory: true,
        applicableContainers: ["A8.16.2.water_solution_watertight"],
      },
      {
        type: "igniter_sealing",
        description:
          "Pack white phosphorus igniters one each in a hermetically-sealed (soldered) or watertight metal can, sealed airtight and positively fastened",
        mandatory: true,
        applicableContainers: ["A8.16.3.igniters"],
      },
    ],

    quantityLimits: [
      {
        scope: "per_drum",
        value: 115,
        unit: "L",
        description:
          "Dry phosphorus drums - not over 115 L (30 gallons) capacity each",
      },
      {
        scope: "per_inner",
        value: 0.5,
        unit: "kg",
        description:
          "Water-tight metal cans containing not over 0.5 kg (1 pound) of phosphorus",
      },
      {
        scope: "per_drum",
        value: 250,
        unit: "L",
        description:
          "Large drums for phosphorus in water/solution - not over 250 L (66 gallons) capacity each",
      },
      {
        scope: "per_drum",
        value: 115,
        unit: "L",
        description:
          "Medium drums for phosphorus in water/solution - not over 115 L (30 gallons) capacity each",
      },
      {
        scope: "per_box",
        value: 25,
        unit: "pieces",
        description:
          "Pack no more than 25 metal cans in a wooden box for igniters",
      },
    ],

    conditionalRequirements: [
      {
        condition: "material_state == 'dry'",
        requirements: [
          {
            type: "material_state",
            description: "Must be cast solid for dry phosphorus",
            mandatory: true,
            applicableContainers: ["A8.16.1.dry_phosphorus"],
          },
        ],
      },
      {
        condition: "material_state == 'water_solution'",
        requirements: [
          {
            type: "sealing_method",
            description:
              "Must use hermetic sealing or water-tight containers with specific closure requirements",
            mandatory: true,
            applicableContainers: [
              "A8.16.2.water_solution_hermetic",
              "A8.16.2.water_solution_watertight",
            ],
          },
        ],
      },
      {
        condition: "material_type == 'igniters'",
        requirements: [
          {
            type: "individual_packaging",
            description:
              "Each igniter must be individually packaged in hermetically-sealed metal can",
            mandatory: true,
            applicableContainers: ["A8.16.3.igniters"],
          },
        ],
      },
    ],

    referencedParagraphs: [],
  },
  "A8.17.": {
    paragraphId: "A8.17.",
    hazardClass: 4,
    description:
      "Smokeless Powder for Small Arms (100 pounds or less) which has been reclassified to Class 4.1 in accordance with 49CFR Sections 173.56, 173.58, and 173.171",
    lastUpdated: new Date().toISOString(),
    entryType: "specialized",
    materialTypes: ["smokeless_powder_small_arms"],

    packagingOptions: [
      {
        id: "A8.17.smokeless_powder",
        type: "combination",
        description: "Smokeless powder for small arms in combination packaging",
        innerPackaging: {
          required: true,
          materials: ["Various"],
          description:
            "Inner packagings not exceeding 3.6 kg (8 pounds) net mass",
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "boxes",
              subtype: "fiberboard_only",
              containers: [
                {
                  code: "4G",
                  material: "fiberboard",
                  description:
                    "UN 4G fiberboard boxes meeting the Packing Group I standards",
                },
              ],
            },
          ],
        },
      },
    ],

    specialRequirements: [
      {
        type: "proper_shipping_name",
        description:
          "The PSN 'SMOKELESS POWDER FOR SMALL ARMS' is only valid for domestic movement. For international shipment use the PSN 'POWDER, SMOKELESS' and package the material as required by the packaging paragraph for powder, smokeless",
        mandatory: true,
        applicableContainers: ["A8.17.smokeless_powder"],
      },
      {
        type: "packaging_standard",
        description:
          "Only combination packaging with inner packagings not exceeding 3.6 kg (8 pounds) net mass packed in outer packaging of UN 4G fiberboard boxes meeting the Packing Group I standards are authorized",
        mandatory: true,
        applicableContainers: ["A8.17.smokeless_powder"],
      },
      {
        type: "arrangement_protection",
        description:
          "Arrange and protect inner packagings to prevent simultaneous ignition of the contents",
        mandatory: true,
        applicableContainers: ["A8.17.smokeless_powder"],
      },
      {
        type: "examination_requirement",
        description:
          "The complete package must be of the same type that has been examined as required in 49 CFR Section 173.56 and meet A3.3.1",
        mandatory: true,
        applicableContainers: ["A8.17.smokeless_powder"],
      },
      {
        type: "cfr_compliance",
        description:
          "Package material as required by 49CFR Sections 173.56, 173.58, and 173.171",
        mandatory: true,
        applicableContainers: ["A8.17.smokeless_powder"],
      },
    ],

    quantityLimits: [
      {
        scope: "per_inner",
        value: 3.6,
        unit: "kg",
        description:
          "Inner packagings not exceeding 3.6 kg (8 pounds) net mass",
      },
      {
        scope: "per_aircraft",
        value: 45.4,
        unit: "kg",
        description:
          "Not more than 45.4 kg (100 pounds) is allowed on the aircraft",
      },
      {
        scope: "per_package",
        value: 45.4,
        unit: "kg",
        description: "Maximum 100 pounds total per complete package",
      },
    ],

    conditionalRequirements: [
      {
        condition: "shipment_type == 'domestic'",
        requirements: [
          {
            type: "proper_shipping_name",
            description:
              "May use PSN 'SMOKELESS POWDER FOR SMALL ARMS' for domestic movement only",
            mandatory: true,
            applicableContainers: ["A8.17.smokeless_powder"],
          },
        ],
      },
      {
        condition: "shipment_type == 'international'",
        requirements: [
          {
            type: "proper_shipping_name",
            description:
              "Must use PSN 'POWDER, SMOKELESS' and package according to powder, smokeless packaging requirements",
            mandatory: true,
            applicableContainers: ["A8.17.smokeless_powder"],
          },
        ],
      },
      {
        condition: "total_weight > 45.4",
        requirements: [
          {
            type: "weight_restriction",
            description:
              "Exceeds aircraft weight limit - not authorized for air transport",
            mandatory: true,
            applicableContainers: ["A8.17.smokeless_powder"],
          },
        ],
      },
    ],

    referencedParagraphs: [
      "A3.3.1.",
      "49CFR173.56",
      "49CFR173.58",
      "49CFR173.171",
    ],
  },
  "A8.18.": {
    paragraphId: "A8.18.",
    hazardClass: 4,
    description: "Package Batteries and Cells Containing Sodium",
    lastUpdated: new Date().toISOString(),
    entryType: "specialized",
    materialTypes: ["batteries_sodium", "cells_sodium"],

    packagingOptions: [
      {
        id: "A8.18.1.batteries",
        type: "specialized",
        description: "Batteries with cells secured within metal casing",
        innerPackaging: {
          required: false,
          description:
            "Inner packaging not required - batteries must consist of cells secured within and fully enclosed by a metal casing",
        },
        outerPackaging: {
          required: false,
          categories: [
            {
              type: "specialized",
              subtype: "unpackaged_nonspecification",
              containers: [
                {
                  code: "UNPACKAGED",
                  material: "none",
                  description:
                    "Ship unpackaged or in nonspecification protective packagings. UN specification containers are not required",
                },
              ],
            },
          ],
        },
      },
      {
        id: "A8.18.2.cells",
        type: "single",
        description: "Hermetically sealed metal cells in PG II packaging",
        innerPackaging: {
          required: false,
          description:
            "Inner packaging not required - cells must consist of hermetically sealed metal casings",
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "drums",
              subtype: "various_pg2",
              containers: [
                {
                  code: "1A2",
                  material: "steel",
                  description: "Steel removable head drum (1A2)",
                },
                {
                  code: "1B2",
                  material: "aluminum",
                  description: "Aluminum removable head drum (1B2)",
                },
                {
                  code: "1D",
                  material: "plywood",
                  description: "Plywood drum (1D)",
                },
                {
                  code: "1G",
                  material: "fiber",
                  description: "Fiber drum (1G)",
                },
                {
                  code: "1H2",
                  material: "plastic",
                  description: "Plastic removable head drum (1H2)",
                },
                {
                  code: "1N2",
                  material: "other_metal",
                  description: "Other metal removable head drum (1N2)",
                },
              ],
            },
            {
              type: "jerricans",
              subtype: "various_pg2",
              containers: [
                {
                  code: "3A2",
                  material: "steel",
                  description: "Steel removable head jerrican (3A2)",
                },
                {
                  code: "3B2",
                  material: "aluminum",
                  description: "Aluminum removable head jerrican (3B2)",
                },
                {
                  code: "3H2",
                  material: "plastic",
                  description: "Plastic removable head jerrican (3H2)",
                },
              ],
            },
            {
              type: "boxes",
              subtype: "comprehensive_pg2",
              containers: [
                {
                  code: "4A",
                  material: "steel",
                  description: "Steel box (4A)",
                },
                {
                  code: "4B",
                  material: "aluminum",
                  description: "Aluminum box (4B)",
                },
                {
                  code: "4C1",
                  material: "natural_wood",
                  description: "Natural wood box (4C1)",
                },
                {
                  code: "4C2",
                  material: "sift_proof_wood",
                  description: "Sift-proof natural wood box (4C2)",
                },
                {
                  code: "4D",
                  material: "plywood",
                  description: "Plywood box (4D)",
                },
                {
                  code: "4F",
                  material: "reconstituted_wood",
                  description: "Reconstituted wood box (4F)",
                },
                {
                  code: "4G",
                  material: "fiberboard",
                  description: "Fiberboard box (4G)",
                },
                {
                  code: "4H1",
                  material: "plastic",
                  description: "Expanded plastic box (4H1)",
                },
                {
                  code: "4H2",
                  material: "plastic",
                  description: "Solid plastic box (4H2)",
                },
                {
                  code: "4N",
                  material: "other_metal",
                  description: "Other metal box (4N)",
                },
              ],
            },
          ],
        },
      },
    ],

    specialRequirements: [
      {
        type: "material_restriction",
        description:
          "Ensure batteries and cells do not contain any hazardous material other than sodium, sulfur, or sodium compounds (e.g., sodium polysulfides, sodium tetrachloroaluminate, etc.)",
        mandatory: true,
        applicableContainers: ["A8.18.1.batteries", "A8.18.2.cells"],
      },
      {
        type: "temperature_control",
        description:
          "Do not offer batteries or cells for transportation at a temperature at which there is any liquid elemental sodium present in the battery or cell",
        mandatory: true,
        applicableContainers: ["A8.18.1.batteries", "A8.18.2.cells"],
      },
      {
        type: "temperature_limit",
        description:
          "Ensure the external battery temperature does not exceed 55 degrees C (130 degrees F)",
        mandatory: true,
        applicableContainers: ["A8.18.1.batteries", "A8.18.2.cells"],
      },
      {
        type: "short_circuit_protection",
        description:
          "Ensure batteries are protected from external short circuit",
        mandatory: true,
        applicableContainers: ["A8.18.1.batteries", "A8.18.2.cells"],
      },
      {
        type: "battery_construction",
        description:
          "Batteries must consist of cells secured within and fully enclosed by a metal casing",
        mandatory: true,
        applicableContainers: ["A8.18.1.batteries"],
      },
      {
        type: "cell_construction",
        description:
          "Cells must consist of hermetically sealed metal casings that completely enclose the hazardous material",
        mandatory: true,
        applicableContainers: ["A8.18.2.cells"],
      },
      {
        type: "cushioning_material",
        description:
          "Pack cells with sufficient cushioning material to secure against movement; and to prevent contact between cells and between cells and the internal surfaces of the outer packaging",
        mandatory: true,
        applicableContainers: ["A8.18.2.cells"],
      },
      {
        type: "performance_level",
        description:
          "Pack cells in packaging that meets the PG II performance level",
        mandatory: true,
        applicableContainers: ["A8.18.2.cells"],
      },
    ],

    quantityLimits: [
      {
        scope: "per_package",
        value: 55,
        unit: "degrees_celsius",
        description:
          "External battery temperature does not exceed 55 degrees C (130 degrees F)",
      },
    ],

    conditionalRequirements: [
      {
        condition: "item_type == 'batteries'",
        requirements: [
          {
            type: "packaging_exemption",
            description:
              "UN specification containers are not required for batteries - may ship unpackaged or in nonspecification protective packagings",
            mandatory: false,
            applicableContainers: ["A8.18.1.batteries"],
          },
        ],
      },
      {
        condition: "item_type == 'cells'",
        requirements: [
          {
            type: "performance_requirement",
            description:
              "Must meet PG II performance level and include cushioning material",
            mandatory: true,
            applicableContainers: ["A8.18.2.cells"],
          },
        ],
      },
      {
        condition: "temperature > 55",
        requirements: [
          {
            type: "temperature_restriction",
            description:
              "Not authorized for transport - exceeds maximum temperature limit",
            mandatory: true,
            applicableContainers: ["A8.18.1.batteries", "A8.18.2.cells"],
          },
        ],
      },
      {
        condition: "liquid_sodium_present == true",
        requirements: [
          {
            type: "transport_prohibition",
            description:
              "Not authorized for transport when liquid elemental sodium is present",
            mandatory: true,
            applicableContainers: ["A8.18.1.batteries", "A8.18.2.cells"],
          },
        ],
      },
    ],

    referencedParagraphs: [],
  },
  "A8.19.": {
    paragraphId: "A8.19.",
    hazardClass: 4,
    description: "Package Polyester Resin Kits",
    lastUpdated: new Date().toISOString(),
    entryType: "specialized",
    materialTypes: ["polyester_resin_kits", "fiberglass_repair_kits"],

    packagingOptions: [
      {
        id: "A8.19.1.organic_peroxides",
        type: "combination",
        description: "Organic peroxide activator component in tube packaging",
        innerPackaging: {
          required: true,
          materials: ["Plastic tube packaging", "Flexible tube packaging"],
          description: "Plastic tube packaging or flexible tube packaging",
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "drums",
              subtype: "various",
              containers: [
                {
                  code: "1A2",
                  material: "steel",
                  description: "Steel removable head drum (1A2)",
                },
                {
                  code: "1B2",
                  material: "aluminum",
                  description: "Aluminum removable head drum (1B2)",
                },
                {
                  code: "1G",
                  material: "fiber",
                  description: "Fiber drum (1G)",
                },
                {
                  code: "1H2",
                  material: "plastic",
                  description: "Plastic removable head drum (1H2)",
                },
                {
                  code: "1N2",
                  material: "other_metal",
                  description: "Other metal removable head drum (1N2)",
                },
              ],
            },
            {
              type: "jerricans",
              subtype: "various",
              containers: [
                {
                  code: "3A2",
                  material: "steel",
                  description: "Steel removable head jerrican (3A2)",
                },
                {
                  code: "3B2",
                  material: "aluminum",
                  description: "Aluminum removable head jerrican (3B2)",
                },
                {
                  code: "3H2",
                  material: "plastic",
                  description: "Plastic removable head jerrican (3H2)",
                },
              ],
            },
            {
              type: "boxes",
              subtype: "comprehensive",
              containers: [
                {
                  code: "4A",
                  material: "steel",
                  description: "Steel box (4A)",
                },
                {
                  code: "4B",
                  material: "aluminum",
                  description: "Aluminum box (4B)",
                },
                {
                  code: "4C1",
                  material: "natural_wood",
                  description: "Natural wood box (4C1)",
                },
                {
                  code: "4C2",
                  material: "sift_proof_wood",
                  description: "Sift-proof natural wood box (4C2)",
                },
                {
                  code: "4D",
                  material: "plywood",
                  description: "Plywood box (4D)",
                },
                {
                  code: "4F",
                  material: "reconstituted_wood",
                  description: "Reconstituted wood box (4F)",
                },
                {
                  code: "4G",
                  material: "fiberboard",
                  description: "Fiberboard box (4G)",
                },
                {
                  code: "4H2",
                  material: "plastic",
                  description: "Solid plastic box (4H2)",
                },
                {
                  code: "4N",
                  material: "other_metal",
                  description: "Other metal box (4N)",
                },
              ],
            },
          ],
        },
      },
      {
        id: "A8.19.2.flammable_solid",
        type: "combination",
        description: "Flammable solid base material component",
        innerPackaging: {
          required: true,
          materials: [
            "Glass receptacles",
            "Earthenware receptacles",
            "Plastic receptacles",
            "Metal receptacles",
            "Aluminum receptacles",
          ],
          description:
            "Glass or earthenware, plastic, metal or aluminum receptacles",
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "drums",
              subtype: "various",
              containers: [
                {
                  code: "1A2",
                  material: "steel",
                  description: "Steel removable head drum (1A2)",
                },
                {
                  code: "1B2",
                  material: "aluminum",
                  description: "Aluminum removable head drum (1B2)",
                },
                {
                  code: "1D",
                  material: "plywood",
                  description: "Plywood drum (1D)",
                },
                {
                  code: "1G",
                  material: "fiber",
                  description: "Fiber drum (1G)",
                },
                {
                  code: "1H2",
                  material: "plastic",
                  description: "Plastic removable head drum (1H2)",
                },
                {
                  code: "1N2",
                  material: "other_metal",
                  description: "Other metal removable head drum (1N2)",
                },
              ],
            },
            {
              type: "jerricans",
              subtype: "various",
              containers: [
                {
                  code: "3A2",
                  material: "steel",
                  description: "Steel removable head jerrican (3A2)",
                },
                {
                  code: "3B2",
                  material: "aluminum",
                  description: "Aluminum removable head jerrican (3B2)",
                },
                {
                  code: "3H2",
                  material: "plastic",
                  description: "Plastic removable head jerrican (3H2)",
                },
              ],
            },
            {
              type: "boxes",
              subtype: "comprehensive",
              containers: [
                {
                  code: "4A",
                  material: "steel",
                  description: "Steel box (4A)",
                },
                {
                  code: "4B",
                  material: "aluminum",
                  description: "Aluminum box (4B)",
                },
                {
                  code: "4C1",
                  material: "natural_wood",
                  description: "Natural wood box (4C1)",
                },
                {
                  code: "4C2",
                  material: "sift_proof_wood",
                  description: "Sift-proof natural wood box (4C2)",
                },
                {
                  code: "4D",
                  material: "plywood",
                  description: "Plywood box (4D)",
                },
                {
                  code: "4F",
                  material: "reconstituted_wood",
                  description: "Reconstituted wood box (4F)",
                },
                {
                  code: "4G",
                  material: "fiberboard",
                  description: "Fiberboard box (4G)",
                },
                {
                  code: "4H1",
                  material: "plastic",
                  description: "Expanded plastic box (4H1)",
                },
                {
                  code: "4H2",
                  material: "plastic",
                  description: "Solid plastic box (4H2)",
                },
                {
                  code: "4N",
                  material: "other_metal",
                  description: "Other metal box (4N)",
                },
              ],
            },
          ],
        },
      },
    ],

    specialRequirements: [
      {
        type: "kit_composition",
        description:
          "Polyester resin and fiberglass repair kits consist of two components: a base material in Class 4.1, PG II or III, and an organic peroxide activator",
        mandatory: true,
        applicableContainers: [
          "A8.19.1.organic_peroxides",
          "A8.19.2.flammable_solid",
        ],
      },
      {
        type: "organic_peroxide_type",
        description:
          "Only organic peroxides of Type D, E, or F not requiring temperature controls are authorized",
        mandatory: true,
        applicableContainers: ["A8.19.1.organic_peroxides"],
      },
      {
        type: "packing_group_assignment",
        description:
          "Assign PG II or III according to the criteria for Class 4.1, applied to the base material",
        mandatory: true,
        applicableContainers: ["A8.19.2.flammable_solid"],
      },
      {
        type: "separate_packaging",
        description:
          "Ensure each component is separately packed in an inner packaging",
        mandatory: true,
        applicableContainers: [
          "A8.19.1.organic_peroxides",
          "A8.19.2.flammable_solid",
        ],
      },
      {
        type: "compatibility",
        description:
          "The components may be placed in the same outer packaging provided they will not react dangerously in the event of leakage",
        mandatory: true,
        applicableContainers: [
          "A8.19.1.organic_peroxides",
          "A8.19.2.flammable_solid",
        ],
      },
      {
        type: "closure_security",
        description:
          "Secure closures on inner packagings containing liquids by secondary means",
        mandatory: true,
        applicableContainers: [
          "A8.19.1.organic_peroxides",
          "A8.19.2.flammable_solid",
        ],
      },
      {
        type: "quantity_calculation",
        description:
          "The total quantity of polyester resin kits per package is calculated on a one-to-one basis (e.g., 1 L equals 1 kg)",
        mandatory: true,
        applicableContainers: [
          "A8.19.1.organic_peroxides",
          "A8.19.2.flammable_solid",
        ],
      },
    ],

    quantityLimits: [
      {
        scope: "per_inner",
        value: 125,
        unit: "ml",
        description:
          "Maximum quantity of organic peroxide per inner packaging is 125 ml (4.22 ounces) for liquids",
      },
      {
        scope: "per_inner",
        value: 500,
        unit: "g",
        description:
          "Maximum quantity of organic peroxide per inner packaging is 500 g (1 lb.) for solids",
      },
      {
        scope: "per_package",
        value: 5,
        unit: "kg",
        description:
          "Total quantity of activator and base material may not exceed 5 kg (11 pounds) per package for PG II base material",
      },
      {
        scope: "per_package",
        value: 10,
        unit: "kg",
        description:
          "Total quantity of activator and base material may not exceed 10 kg (22 pounds) per package for PG III base material",
      },
      {
        scope: "per_inner",
        value: 5,
        unit: "kg",
        description:
          "PG II base material limited to 5 kg (11 pounds) in metal or plastic inner packagings",
      },
      {
        scope: "per_inner",
        value: 1,
        unit: "kg",
        description:
          "PG II base material limited to 1 kg (2.2 pounds) in glass inner packagings",
      },
      {
        scope: "per_inner",
        value: 10,
        unit: "kg",
        description:
          "PG III base material limited to 10 kg (22 pounds) in metal or plastic inner packagings",
      },
      {
        scope: "per_inner",
        value: 2.5,
        unit: "kg",
        description:
          "PG III base material limited to 2.5 kg (5.5 pounds) in glass inner packagings",
      },
    ],

    conditionalRequirements: [
      {
        condition: "base_material_pg == 'II'",
        requirements: [
          {
            type: "total_quantity_limit",
            description:
              "Total quantity may not exceed 5 kg (11 pounds) per package for PG II base material",
            mandatory: true,
            applicableContainers: [
              "A8.19.1.organic_peroxides",
              "A8.19.2.flammable_solid",
            ],
          },
        ],
      },
      {
        condition: "base_material_pg == 'III'",
        requirements: [
          {
            type: "total_quantity_limit",
            description:
              "Total quantity may not exceed 10 kg (22 pounds) per package for PG III base material",
            mandatory: true,
            applicableContainers: [
              "A8.19.1.organic_peroxides",
              "A8.19.2.flammable_solid",
            ],
          },
        ],
      },
      {
        condition: "inner_packaging_material == 'glass'",
        requirements: [
          {
            type: "reduced_quantity_limit",
            description:
              "Reduced quantity limits apply for glass inner packagings",
            mandatory: true,
            applicableContainers: ["A8.19.2.flammable_solid"],
          },
        ],
      },
      {
        condition: "organic_peroxide_type != 'D,E,F'",
        requirements: [
          {
            type: "peroxide_restriction",
            description:
              "Only Type D, E, or F organic peroxides not requiring temperature controls are authorized",
            mandatory: true,
            applicableContainers: ["A8.19.1.organic_peroxides"],
          },
        ],
      },
    ],

    referencedParagraphs: [],
  },
  "A8.20.": {
    paragraphId: "A8.20.",
    hazardClass: 9,
    description: "Fuel Cell Cartridges",
    lastUpdated: new Date().toISOString(),
    entryType: "standard",
    materialTypes: ["fuel_cells"],

    packagingOptions: [
      {
        id: "A8.20.drums",
        type: "single",
        description: "Drums - plywood, fiberboard, plastic",
        innerPackaging: {
          required: false,
          description: "Inner packaging not required",
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "drums",
              subtype: "various_drums",
              containers: [
                {
                  code: "1D",
                  material: "plywood",
                  description: "Plywood drum (1D)",
                },
                {
                  code: "1G",
                  material: "fiberboard",
                  description: "Fiberboard drum (1G)",
                },
                {
                  code: "1H2",
                  material: "plastic",
                  description: "Plastic drum (1H2)",
                },
              ],
            },
          ],
        },
      },
      {
        id: "A8.20.jerricans",
        type: "single",
        description: "Jerricans - plastic",
        innerPackaging: {
          required: false,
          description: "Inner packaging not required",
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "jerricans",
              subtype: "plastic_jerricans",
              containers: [
                {
                  code: "3H2",
                  material: "plastic",
                  description: "Plastic jerrican (3H2)",
                },
              ],
            },
          ],
        },
      },
      {
        id: "A8.20.boxes",
        type: "single",
        description:
          "Boxes - wood, plywood, reconstituted wood, fiberboard, plastic",
        innerPackaging: {
          required: false,
          description: "Inner packaging not required",
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "boxes",
              subtype: "various_boxes",
              containers: [
                {
                  code: "4C1",
                  material: "natural_wood",
                  description: "Natural wood box (4C1)",
                },
                {
                  code: "4C2",
                  material: "sift_proof_wood",
                  description: "Wood box other than natural wood (4C2)",
                },
                {
                  code: "4D",
                  material: "plywood",
                  description: "Plywood box (4D)",
                },
                {
                  code: "4F",
                  material: "reconstituted_wood",
                  description: "Reconstituted wood box (4F)",
                },
                {
                  code: "4G",
                  material: "fiberboard",
                  description: "Fiberboard box (4G)",
                },
                {
                  code: "4H2",
                  material: "plastic",
                  description: "Plastic box expanded (4H2)",
                },
              ],
            },
          ],
        },
      },
    ],

    specialRequirements: [
      {
        type: "weight_restriction",
        description: "The weight of the fuel cells may not exceed 1 kg",
        mandatory: true,
      },
    ],

    quantityLimits: [
      {
        scope: "per_package",
        value: 1,
        unit: "kg",
        description: "Maximum weight of fuel cells per package",
      },
    ],

    conditionalRequirements: [],

    referencedParagraphs: [],
  },
  "A8.21.": {
    paragraphId: "A8.21.",
    hazardClass: 9,
    description: "Fuel Cells Contained in Equipment",
    lastUpdated: new Date().toISOString(),
    entryType: "equipment",
    materialTypes: ["fuel_cells_in_equipment"],

    packagingOptions: [
      {
        id: "A8.21.strong_outer_container",
        type: "single",
        description:
          "Strong outer container - UN specification packaging not required",
        innerPackaging: {
          required: false,
          description:
            "Inner packaging not required - fuel cells contained in equipment",
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "specialized",
              subtype: "strong_outer_container",
              containers: [
                {
                  code: "STRONG",
                  material: "various",
                  description:
                    "Strong outer container (UN specification not required)",
                },
              ],
            },
          ],
        },
      },
    ],

    specialRequirements: [
      {
        type: "static_prevention",
        description:
          "Protect installed fuel cells in equipment against short circuit",
        mandatory: true,
      },
      {
        type: "orientation",
        description: "Protect the entire system against inadvertent operation",
        mandatory: true,
      },
      {
        type: "handling",
        description:
          "Fuel cell systems may not charge batteries during transport",
        mandatory: true,
      },
      {
        type: "static_prevention",
        description:
          "Protect the terminals of the installed fuel cells to prevent short circuit by use of protective coverings, taping, etc.",
        mandatory: true,
      },
    ],

    quantityLimits: [],

    conditionalRequirements: [
      {
        condition: "fuel_cells_in_equipment",
        conditionType: "packaging_type",
        operator: "equals",
        value: "equipment_contained",
        effect: "require",
        description:
          "UN specification packaging not required for fuel cells contained in equipment",
        requirements: [
          {
            type: "handling",
            description:
              "Strong outer container sufficient - no UN specification packaging required",
            mandatory: true,
          },
        ],
      },
    ],

    referencedParagraphs: [],
  },
  "A8.22.": {
    paragraphId: "A8.22.",
    hazardClass: 9,
    description: "Fuel Cells Packed With Equipment",
    lastUpdated: new Date().toISOString(),
    entryType: "equipment",
    materialTypes: ["fuel_cells_with_equipment"],

    packagingOptions: [
      {
        id: "A8.22.inner_packaging",
        type: "combination",
        description:
          "Fuel cells in inner packaging within strong outer container",
        innerPackaging: {
          required: true,
          description: "Inner packaging required to protect fuel cells",
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "specialized",
              subtype: "strong_outer_container",
              containers: [
                {
                  code: "STRONG",
                  material: "various",
                  description:
                    "Strong outer container (UN specification not required)",
                },
              ],
            },
          ],
        },
      },
      {
        id: "A8.22.cushioning",
        type: "single",
        description:
          "Fuel cells placed in outer packaging with cushioning material or dividers",
        innerPackaging: {
          required: false,
          description:
            "Inner packaging not required when using cushioning materials",
        },
        outerPackaging: {
          required: true,
          categories: [
            {
              type: "specialized",
              subtype: "cushioned_outer_container",
              containers: [
                {
                  code: "CUSHIONED",
                  material: "various",
                  description:
                    "Strong outer container with cushioning material or dividers",
                },
              ],
            },
          ],
        },
      },
    ],

    specialRequirements: [
      {
        type: "cushioning",
        description:
          "Protect against damage that may be caused by the movement or placement of contents within the outer packaging",
        mandatory: true,
      },
      {
        type: "quantity_control",
        description:
          "The maximum number of fuel cell cartridges in the intermediate packaging may not be more than the number required to power the equipment plus two spares",
        mandatory: true,
      },
    ],

    quantityLimits: [
      {
        scope: "per_package",
        value: "equipment_required_plus_two_spares",
        unit: "cartridges",
        description:
          "Maximum fuel cell cartridges: number required to power equipment plus two spares",
      },
    ],

    conditionalRequirements: [
      {
        condition: "packaging_method",
        conditionType: "packaging_type",
        operator: "equals",
        value: "inner_packaging",
        effect: "require",
        description: "Inner packaging method selected",
        requirements: [
          {
            type: "cushioning",
            description: "Inner packaging must protect fuel cells from damage",
            mandatory: true,
          },
        ],
      },
      {
        condition: "packaging_method",
        conditionType: "packaging_type",
        operator: "equals",
        value: "cushioning_dividers",
        effect: "require",
        description: "Cushioning/dividers method selected",
        requirements: [
          {
            type: "cushioning",
            description:
              "Cushioning material or dividers must prevent movement damage",
            mandatory: true,
          },
        ],
      },
    ],

    referencedParagraphs: [],
  },
  "A9.3.": {
    paragraphId: "A9.3.",
    hazardClass: 5,
    description: "Package Class 5.2 Organic Peroxides as follows",
    lastUpdated: new Date().toISOString(),
    entryType: "standard",
    materialTypes: ["organic_peroxides"],
    applicableUNNumbers: [
      "UN3103",
      "UN3104",
      "UN3105",
      "UN3106",
      "UN3107",
      "UN3108",
      "UN3109",
      "UN3110",
    ],

    packagingOptions: [
      {
        id: "A9.3.combination",
        type: "combination",
        description: "Plastic inner receptacles in drums, jerricans, or boxes",
        innerPackaging: {
          required: true,
          materials: ["Plastic receptacles"],
          description: "Plastic receptacles only",
        },
        outerPackaging: {
          categories: [
            {
              type: "drums",
              containers: [
                { code: "1D", material: "plywood", description: "Plywood" },
                { code: "1G", material: "fiber", description: "Fiber" },
                { code: "1H1", material: "plastic", description: "Plastic" },
                { code: "1H2", material: "plastic", description: "Plastic" },
              ],
            },
            {
              type: "jerricans",
              containers: [
                { code: "3H1", material: "plastic", description: "Plastic" },
                { code: "3H2", material: "plastic", description: "Plastic" },
              ],
            },
            {
              type: "boxes",
              containers: [
                {
                  code: "4C1",
                  material: "natural_wood",
                  description: "Ordinary natural wood",
                },
                {
                  code: "4C2",
                  material: "natural_wood",
                  description: "Sift-proof natural wood",
                },
                { code: "4D", material: "plywood", description: "Plywood" },
                {
                  code: "4F",
                  material: "reconstituted_wood",
                  description: "Reconstituted wood",
                },
                {
                  code: "4G",
                  material: "fiberboard",
                  description: "Fiberboard",
                },
                {
                  code: "4H1",
                  material: "plastic",
                  description: "Expanded plastic",
                },
                {
                  code: "4H2",
                  material: "plastic",
                  description: "Solid plastic",
                },
                {
                  code: "4N",
                  material: "other_metal",
                  description: "Other metal",
                },
              ],
            },
          ],
        },
      },
    ],

    specialRequirements: [
      {
        type: "testing",
        description:
          "Containers meeting PG II performance tests and UN performance markings are required",
        mandatory: true,
      },
      {
        type: "material_compatibility",
        description:
          "Corrosion resistant metal packagings or with protection against corrosion for substances with a Class 8 subsidiary risk are required",
        mandatory: true,
      },
    ],

    quantityLimits: [
      {
        scope: "per_inner",
        value: 1,
        unit: "L",
        conditions: ["UN3103", "UN3105"],
        description: "UN3103 and UN3105: 1 L per inner packaging",
      },
      {
        scope: "per_outer",
        value: 10,
        unit: "L",
        conditions: ["UN3103", "UN3105"],
        description: "UN3103 and UN3105: 10 L per outer packaging",
      },
      {
        scope: "per_inner",
        value: 2.5,
        unit: "L",
        conditions: ["UN3107", "UN3109"],
        description: "UN3107 and UN3109: 2.5 L per inner packaging",
      },
      {
        scope: "per_outer",
        value: 25,
        unit: "L",
        conditions: ["UN3107", "UN3109"],
        description: "UN3107 and UN3109: 25 L per outer packaging",
      },
      {
        scope: "per_inner",
        value: 1,
        unit: "kg",
        conditions: ["UN3104", "UN3106"],
        description: "UN3104 and UN3106: 1 kg per inner packaging",
      },
      {
        scope: "per_outer",
        value: 10,
        unit: "kg",
        conditions: ["UN3104", "UN3106"],
        description: "UN3104 and UN3106: 10 kg per outer packaging",
      },
      {
        scope: "per_inner",
        value: 2.5,
        unit: "kg",
        conditions: ["UN3108", "UN3110"],
        description: "UN3108 and UN3110: 2.5 kg per inner packaging",
      },
      {
        scope: "per_outer",
        value: 25,
        unit: "kg",
        conditions: ["UN3108", "UN3110"],
        description: "UN3108 and UN3110: 25 kg per outer packaging",
      },
    ],

    conditionalRequirements: [
      {
        condition: "class_8_subsidiary_risk",
        conditionType: "material_state",
        operator: "contains",
        value: "corrosive_subsidiary",
        effect: "require",
        description: "For substances with Class 8 subsidiary risk",
        requirements: [
          {
            type: "material_compatibility",
            description:
              "Corrosion resistant metal packagings or protection against corrosion required",
            mandatory: true,
          },
        ],
      },
    ],

    referencedParagraphs: ["49 CFR Section 173.225"],
  },
  "A9.4.": {
    paragraphId: "A9.4.",
    hazardClass: 5,
    description: "Package Samples of Organic Peroxides as follows",
    lastUpdated: new Date().toISOString(),
    entryType: "standard",
    materialTypes: ["organic_peroxide_samples"],
    applicableUNNumbers: ["UN3103", "UN3104"],

    packagingOptions: [
      {
        id: "A9.4.samples",
        type: "combination",
        description:
          "Samples following UN3103 or UN3104 requirements with reduced inner packaging limits",
        innerPackaging: {
          required: true,
          materials: ["Plastic"],
          description: "Following UN3103 or UN3104 requirements",
          maxCapacity: {
            value: 0.5,
            unit: "L",
          },
        },
        outerPackaging: {
          categories: [
            {
              type: "drums",
              containers: [
                { code: "1D", material: "plywood", description: "Plywood" },
                { code: "1G", material: "fiber", description: "Fiber" },
                { code: "1H1", material: "plastic", description: "Plastic" },
                { code: "1H2", material: "plastic", description: "Plastic" },
              ],
            },
            {
              type: "jerricans",
              containers: [
                { code: "3H1", material: "plastic", description: "Plastic" },
                { code: "3H2", material: "plastic", description: "Plastic" },
              ],
            },
            {
              type: "boxes",
              containers: [
                {
                  code: "4C1",
                  material: "natural_wood",
                  description: "Ordinary natural wood",
                },
                {
                  code: "4C2",
                  material: "natural_wood",
                  description: "Sift-proof natural wood",
                },
                { code: "4D", material: "plywood", description: "Plywood" },
                {
                  code: "4F",
                  material: "reconstituted_wood",
                  description: "Reconstituted wood",
                },
                {
                  code: "4G",
                  material: "fiberboard",
                  description: "Fiberboard",
                },
                {
                  code: "4H1",
                  material: "plastic",
                  description: "Expanded plastic",
                },
                {
                  code: "4H2",
                  material: "plastic",
                  description: "Solid plastic",
                },
                {
                  code: "4N",
                  material: "other_metal",
                  description: "Other metal",
                },
              ],
            },
          ],
        },
      },
    ],

    specialRequirements: [
      {
        type: "testing",
        description: "Samples are for testing and evaluation purposes only",
        mandatory: true,
      },
      {
        type: "quantity_control",
        description:
          "Complete test data must not be available and sample must pose threat no greater than organic peroxide Type B",
        mandatory: true,
      },
      {
        type: "temperature_control",
        description:
          "Control temperature must be sufficiently low to prevent dangerous decomposition and sufficiently high to prevent dangerous phase separation",
        mandatory: true,
      },
    ],

    quantityLimits: [
      {
        scope: "per_inner",
        value: 0.5,
        unit: "L",
        description: "Inner packages limited to 0.5 L for liquid samples",
      },
      {
        scope: "per_inner",
        value: 0.5,
        unit: "kg",
        description: "Inner packages limited to 0.5 kg for solid samples",
      },
    ],

    conditionalRequirements: [
      {
        condition: "sample_type",
        conditionType: "material_state",
        operator: "equals",
        value: "liquid",
        effect: "require",
        description: "For liquid samples",
        requirements: [
          {
            type: "volume_limits",
            description: "Use PSN organic peroxide type C, liquid",
            mandatory: true,
          },
        ],
      },
      {
        condition: "sample_type",
        conditionType: "material_state",
        operator: "equals",
        value: "solid",
        effect: "require",
        description: "For solid samples",
        requirements: [
          {
            type: "mass_limits",
            description: "Use PSN organic peroxide type C, solid",
            mandatory: true,
          },
        ],
      },
    ],

    referencedParagraphs: ["UN3103", "UN3104", "49 CFR Section 173.128"],
  },
  "A9.5.": {
    paragraphId: "A9.5.",
    hazardClass: 5,
    description: "Package Class 5.1 Liquids as follows",
    lastUpdated: new Date().toISOString(),
    entryType: "standard",
    materialTypes: ["oxidizing_liquids"],

    packagingOptions: [
      {
        id: "A9.5.combination",
        type: "combination",
        description: "Inner packages inside outer package",
        innerPackaging: {
          required: true,
          materials: [
            "Glass receptacles",
            "Earthenware receptacles",
            "Plastic receptacles",
            "Metal receptacles",
          ],
          specialRequirements: [
            "For PG I material inner packagings packed in a rigid and leakproof receptacle or intermediate packaging containing sufficient absorbent material to absorb the entire contents of all inner packagings before packing the inner packaging(s) in the outer package.",
            "Ensure inner packaging or receptacle closures of combination packages containing liquids are held securely, tightly, and effectively in place by secondary means. See A20.3.",
          ],
        },
        outerPackaging: {
          categories: [
            {
              type: "drums",
              containers: [
                { code: "1A1", material: "steel", description: "Steel" },
                { code: "1A2", material: "steel", description: "Steel" },
                { code: "1B1", material: "aluminum", description: "Aluminum" },
                { code: "1B2", material: "aluminum", description: "Aluminum" },
                { code: "1D", material: "plywood", description: "Plywood" },
                { code: "1G", material: "fiber", description: "Fiber" },
                { code: "1H1", material: "plastic", description: "Plastic" },
                { code: "1H2", material: "plastic", description: "Plastic" },
                {
                  code: "1N1",
                  material: "other_metal",
                  description: "Metal other than steel or aluminum",
                },
                {
                  code: "1N2",
                  material: "other_metal",
                  description: "Metal other than steel or aluminum",
                },
              ],
            },
            {
              type: "barrels",
              containers: [
                { code: "2C2", material: "wood", description: "Wooden" },
              ],
            },
            {
              type: "jerricans",
              containers: [
                { code: "3A1", material: "steel", description: "Steel" },
                { code: "3A2", material: "steel", description: "Steel" },
                { code: "3B1", material: "aluminum", description: "Aluminum" },
                { code: "3B2", material: "aluminum", description: "Aluminum" },
                { code: "3H1", material: "plastic", description: "Plastic" },
                { code: "3H2", material: "plastic", description: "Plastic" },
              ],
            },
            {
              type: "boxes",
              containers: [
                { code: "4A", material: "steel", description: "Steel" },
                { code: "4B", material: "aluminum", description: "Aluminum" },
                {
                  code: "4C1",
                  material: "natural_wood",
                  description: "Ordinary natural wood",
                },
                {
                  code: "4C2",
                  material: "natural_wood",
                  description: "Sift-proof natural wood",
                },
                { code: "4D", material: "plywood", description: "Plywood" },
                {
                  code: "4F",
                  material: "reconstituted_wood",
                  description: "Reconstituted wood",
                },
                {
                  code: "4G",
                  material: "fiberboard",
                  description: "Fiberboard",
                },
                {
                  code: "4H1",
                  material: "plastic",
                  description: "Expanded plastic",
                },
                {
                  code: "4H2",
                  material: "plastic",
                  description: "Solid plastic",
                },
                {
                  code: "4N",
                  material: "other_metal",
                  description: "Other metal",
                },
              ],
            },
          ],
        },
        restrictions: ["Wood barrel (2C2) not authorized for PG I material"],
      },
      {
        id: "A9.5.single",
        type: "single",
        description: "Standalone container",
        innerPackaging: {
          required: false,
        },
        outerPackaging: {
          categories: [
            {
              type: "drums",
              containers: [
                { code: "1A1", material: "steel", description: "Steel" },
                { code: "1A2", material: "steel", description: "Steel" },
                { code: "1B1", material: "aluminum", description: "Aluminum" },
                { code: "1B2", material: "aluminum", description: "Aluminum" },
                {
                  code: "1N1",
                  material: "other_metal",
                  description: "Metal other than steel or aluminum",
                },
                {
                  code: "1N2",
                  material: "other_metal",
                  description: "Metal other than steel or aluminum",
                },
                { code: "1H1", material: "plastic", description: "Plastic" },
                { code: "1H2", material: "plastic", description: "Plastic" },
              ],
            },
            {
              type: "barrels",
              containers: [
                { code: "2C1", material: "wood", description: "Wooden" },
              ],
            },
            {
              type: "jerricans",
              containers: [
                { code: "3A1", material: "steel", description: "Steel" },
                { code: "3A2", material: "steel", description: "Steel" },
                { code: "3B1", material: "aluminum", description: "Aluminum" },
                { code: "3B2", material: "aluminum", description: "Aluminum" },
                { code: "3H1", material: "plastic", description: "Plastic" },
                { code: "3H2", material: "plastic", description: "Plastic" },
              ],
            },
          ],
        },
        restrictions: ["Wood barrel (2C1) not authorized for PG I material"],
      },
      {
        id: "A9.5.composite_plastic",
        type: "composite_plastic",
        description: "Plastic inner receptacles",
        innerPackaging: {
          required: true,
          materials: ["Plastic inner receptacles"],
        },
        outerPackaging: {
          categories: [
            {
              type: "drums",
              containers: [
                { code: "6HA1", material: "steel", description: "Steel" },
                { code: "6HB1", material: "aluminum", description: "Aluminum" },
                { code: "6HG1", material: "fiber", description: "Fiber" },
                { code: "6HH", material: "plastic", description: "Plastic" },
                { code: "6HD1", material: "plywood", description: "Plywood" },
              ],
            },
            {
              type: "boxes",
              containers: [
                { code: "6HA2", material: "steel", description: "Steel" },
                { code: "6HB2", material: "aluminum", description: "Aluminum" },
                { code: "6HC", material: "wood", description: "Wooden" },
                { code: "6HD2", material: "plywood", description: "Plywood" },
                {
                  code: "6HG2",
                  material: "fiberboard",
                  description: "Fiberboard",
                },
              ],
            },
          ],
        },
        restrictions: ["Plywood drums not authorized for PG I material"],
      },
      {
        id: "A9.5.composite_glass",
        type: "composite_glass",
        description: "Glass, porcelain, or stoneware inner receptacles",
        innerPackaging: {
          required: true,
          materials: [
            "Glass inner receptacles",
            "Porcelain inner receptacles",
            "Stoneware inner receptacles",
          ],
        },
        outerPackaging: {
          categories: [
            {
              type: "drums",
              containers: [
                { code: "6PA1", material: "steel", description: "Steel" },
                { code: "6PB1", material: "aluminum", description: "Aluminum" },
                { code: "6PG1", material: "fiber", description: "Fiber" },
              ],
            },
            {
              type: "boxes",
              containers: [
                { code: "6PA2", material: "steel", description: "Steel" },
                { code: "6PB2", material: "aluminum", description: "Aluminum" },
                { code: "6PC", material: "wood", description: "Wooden" },
                {
                  code: "6PG2",
                  material: "fiberboard",
                  description: "Fiberboard",
                },
              ],
            },
            {
              type: "composite",
              containers: [
                {
                  code: "6PH1",
                  material: "plastic",
                  description: "Solid plastic packaging",
                },
                {
                  code: "6PH2",
                  material: "plastic",
                  description: "Expanded plastic packaging",
                },
                {
                  code: "6PD1",
                  material: "plywood",
                  description: "Plywood drum",
                },
                {
                  code: "6PD2",
                  material: "wickerwork",
                  description: "Wickerwork hamper",
                },
              ],
            },
          ],
        },
        restrictions: [
          "Plywood drum or wickerwork hamper not authorized for PG I material",
        ],
      },
      {
        id: "A9.5.cylinders",
        type: "cylinder",
        description: "DOT specification cylinders",
        innerPackaging: {
          required: false,
        },
        outerPackaging: {
          categories: [
            {
              type: "cylinders",
              containers: [
                {
                  code: "DOT_SPEC",
                  material: "steel",
                  description:
                    "DOT specification cylinders as prescribed for any compressed gas",
                },
              ],
            },
          ],
        },
        restrictions: ["Except acetylene (DOT 8, 8AL) and DOT 3HT"],
      },
    ],

    specialRequirements: [
      {
        type: "closure_type",
        description:
          "Ensure inner packaging or receptacle closures of combination packages containing liquids are held securely, tightly, and effectively in place by secondary means. See A20.3.",
        mandatory: true,
        applicableContainers: ["combination"],
      },
      {
        type: "handling",
        description:
          "For PG I material, pack inner packagings in a rigid and leakproof receptacle or intermediate packaging containing sufficient absorbent material",
        mandatory: true,
        applicableContainers: ["combination"],
      },
    ],

    packingGroupRestrictions: [
      {
        packingGroup: "I",
        restriction: "prohibited",
        description: "Wood barrels not authorized for PG I material",
        conditions: ["barrel_packaging"],
      },
      {
        packingGroup: "I",
        restriction: "prohibited",
        description:
          "Plywood drums/wickerwork hampers not authorized for PG I material",
        conditions: ["composite_glass_packaging"],
      },
    ],

    referencedParagraphs: ["A3.3.5.", "A20.3."],
  },
  "A9.6.": {
    paragraphId: "A9.6.",
    hazardClass: 5,
    description: "Package Class 5.1 Solids as follows",
    lastUpdated: new Date().toISOString(),
    entryType: "standard",
    materialTypes: ["oxidizing_solids"],

    packagingOptions: [
      {
        id: "A9.6.combination",
        type: "combination",
        description: "Inner packages inside outer package",
        innerPackaging: {
          required: true,
          materials: [
            "Glass receptacles",
            "Earthenware receptacles",
            "Plastic receptacles",
            "Metal receptacles",
          ],
          description: "Glass or earthenware, plastic or metal receptacles",
        },
        outerPackaging: {
          categories: [
            {
              type: "drums",
              containers: [
                { code: "1A1", material: "steel", description: "Steel" },
                { code: "1A2", material: "steel", description: "Steel" },
                { code: "1B1", material: "aluminum", description: "Aluminum" },
                { code: "1B2", material: "aluminum", description: "Aluminum" },
                { code: "1D", material: "plywood", description: "Plywood" },
                { code: "1G", material: "fiber", description: "Fiber" },
                { code: "1H1", material: "plastic", description: "Plastic" },
                { code: "1H2", material: "plastic", description: "Plastic" },
                {
                  code: "1N1",
                  material: "other_metal",
                  description: "Metal other than steel or aluminum",
                },
                {
                  code: "1N2",
                  material: "other_metal",
                  description: "Metal other than steel or aluminum",
                },
              ],
            },
            {
              type: "barrels",
              containers: [
                { code: "2C2", material: "wood", description: "Wooden" },
              ],
            },
            {
              type: "jerricans",
              containers: [
                { code: "3A1", material: "steel", description: "Steel" },
                { code: "3A2", material: "steel", description: "Steel" },
                { code: "3B1", material: "aluminum", description: "Aluminum" },
                { code: "3B2", material: "aluminum", description: "Aluminum" },
                { code: "3H1", material: "plastic", description: "Plastic" },
                { code: "3H2", material: "plastic", description: "Plastic" },
              ],
            },
            {
              type: "boxes",
              containers: [
                { code: "4A", material: "steel", description: "Steel" },
                { code: "4B", material: "aluminum", description: "Aluminum" },
                {
                  code: "4C1",
                  material: "natural_wood",
                  description: "Ordinary natural wood",
                },
                {
                  code: "4C2",
                  material: "natural_wood",
                  description: "Sift-proof natural wood",
                },
                { code: "4D", material: "plywood", description: "Plywood" },
                {
                  code: "4F",
                  material: "reconstituted_wood",
                  description: "Reconstituted wood",
                },
                {
                  code: "4G",
                  material: "fiberboard",
                  description: "Fiberboard",
                },
                {
                  code: "4H2",
                  material: "plastic",
                  description: "Solid plastic",
                },
                {
                  code: "4N",
                  material: "other_metal",
                  description: "Other metal",
                },
              ],
            },
          ],
        },
      },
      {
        id: "A9.6.single",
        type: "single",
        description: "Standalone container",
        innerPackaging: {
          required: false,
        },
        outerPackaging: {
          categories: [
            {
              type: "drums",
              containers: [
                { code: "1A1", material: "steel", description: "Steel" },
                { code: "1A2", material: "steel", description: "Steel" },
                { code: "1B1", material: "aluminum", description: "Aluminum" },
                { code: "1B2", material: "aluminum", description: "Aluminum" },
                { code: "1D", material: "plywood", description: "Plywood" },
                { code: "1G", material: "fiber", description: "Fiber" },
                { code: "1H1", material: "plastic", description: "Plastic" },
                { code: "1H2", material: "plastic", description: "Plastic" },
                {
                  code: "1N1",
                  material: "other_metal",
                  description: "Metal other than steel or aluminum",
                },
                {
                  code: "1N2",
                  material: "other_metal",
                  description: "Metal other than steel or aluminum",
                },
              ],
            },
            {
              type: "barrels",
              containers: [
                { code: "2C1", material: "wood", description: "Wooden" },
                { code: "2C2", material: "wood", description: "Wooden" },
              ],
            },
            {
              type: "jerricans",
              containers: [
                { code: "3A1", material: "steel", description: "Steel" },
                { code: "3A2", material: "steel", description: "Steel" },
                { code: "3B1", material: "aluminum", description: "Aluminum" },
                { code: "3B2", material: "aluminum", description: "Aluminum" },
                { code: "3H1", material: "plastic", description: "Plastic" },
                { code: "3H2", material: "plastic", description: "Plastic" },
              ],
            },
            {
              type: "boxes",
              containers: [
                { code: "4A", material: "steel", description: "Steel" },
                { code: "4B", material: "aluminum", description: "Aluminum" },
                {
                  code: "4C1",
                  material: "natural_wood",
                  description: "Ordinary natural wood",
                },
                {
                  code: "4C2",
                  material: "natural_wood",
                  description: "Sift-proof natural wood",
                },
                { code: "4D", material: "plywood", description: "Plywood" },
                {
                  code: "4F",
                  material: "reconstituted_wood",
                  description: "Reconstituted wood",
                },
                {
                  code: "4G",
                  material: "fiberboard",
                  description: "Fiberboard",
                },
                {
                  code: "4H1",
                  material: "plastic",
                  description: "Expanded plastic",
                },
                {
                  code: "4H2",
                  material: "plastic",
                  description: "Solid plastic",
                },
                {
                  code: "4N",
                  material: "other_metal",
                  description: "Other metal",
                },
              ],
            },
            {
              type: "bags",
              containers: [
                {
                  code: "5H1",
                  material: "plastic",
                  description: "Woven plastic",
                },
                {
                  code: "5H2",
                  material: "plastic",
                  description: "Woven plastic",
                },
                {
                  code: "5H3",
                  material: "plastic",
                  description: "Woven plastic",
                },
                {
                  code: "5H4",
                  material: "plastic",
                  description: "Plastic film",
                },
                { code: "5L1", material: "textile", description: "Textile" },
                { code: "5L2", material: "textile", description: "Textile" },
                { code: "5L3", material: "textile", description: "Textile" },
                {
                  code: "5M2",
                  material: "paper",
                  description: "Paper multiwall water-resistant",
                },
              ],
            },
          ],
        },
      },
      {
        id: "A9.6.composite_plastic",
        type: "composite_plastic",
        description: "Plastic inner receptacles",
        innerPackaging: {
          required: true,
          materials: ["Plastic inner receptacles"],
        },
        outerPackaging: {
          categories: [
            {
              type: "drums",
              containers: [
                { code: "6HA1", material: "steel", description: "Steel" },
                { code: "6HB1", material: "aluminum", description: "Aluminum" },
                { code: "6HD1", material: "plywood", description: "Plywood" },
                { code: "6HG1", material: "fiber", description: "Fiber" },
                { code: "6HH1", material: "plastic", description: "Plastic" },
              ],
            },
            {
              type: "boxes",
              containers: [
                { code: "6HA2", material: "steel", description: "Steel" },
                { code: "6HB2", material: "aluminum", description: "Aluminum" },
                { code: "6HC", material: "wood", description: "Wood" },
                { code: "6HD2", material: "plywood", description: "Plywood" },
                {
                  code: "6HG2",
                  material: "fiberboard",
                  description: "Fiberboard",
                },
              ],
            },
          ],
        },
      },
      {
        id: "A9.6.composite_glass",
        type: "composite_glass",
        description: "Glass, porcelain, or stoneware inner receptacles",
        innerPackaging: {
          required: true,
          materials: [
            "Glass inner receptacles",
            "Porcelain inner receptacles",
            "Stoneware inner receptacles",
          ],
        },
        outerPackaging: {
          categories: [
            {
              type: "drums",
              containers: [
                { code: "6PA1", material: "steel", description: "Steel" },
                { code: "6PB1", material: "aluminum", description: "Aluminum" },
                { code: "6PD1", material: "plywood", description: "Plywood" },
                { code: "6PG1", material: "fiber", description: "Fiber" },
              ],
            },
            {
              type: "boxes",
              containers: [
                { code: "6PA2", material: "steel", description: "Steel" },
                { code: "6PB2", material: "aluminum", description: "Aluminum" },
                { code: "6PC", material: "wood", description: "Wooden" },
                {
                  code: "6PG2",
                  material: "fiberboard",
                  description: "Fiberboard",
                },
              ],
            },
            {
              type: "composite",
              containers: [
                {
                  code: "6PH1",
                  material: "plastic",
                  description: "Expanded plastic",
                },
                {
                  code: "6PH2",
                  material: "plastic",
                  description: "Solid plastic",
                },
              ],
            },
          ],
        },
      },
      {
        id: "A9.6.cylinders",
        type: "cylinder",
        description: "DOT specification cylinders",
        innerPackaging: {
          required: false,
        },
        outerPackaging: {
          categories: [
            {
              type: "cylinders",
              containers: [
                {
                  code: "DOT_SPEC",
                  material: "steel",
                  description:
                    "DOT specification cylinders as prescribed for any compressed gas",
                },
              ],
            },
          ],
        },
        restrictions: ["Except acetylene (DOT 8, 8AL) and DOT 3HT"],
      },
    ],

    packingGroupRestrictions: [
      {
        packingGroup: "I",
        restriction: "prohibited",
        description: "Plywood drum not authorized for PG I material",
        conditions: ["single_drum_packaging"],
      },
      {
        packingGroup: "I",
        restriction: "prohibited",
        description: "Wood barrels not authorized for PG I material",
        conditions: ["single_barrel_packaging"],
      },
      {
        packingGroup: "I",
        restriction: "prohibited",
        description:
          "Steel, aluminum, plywood, reconstituted wood, natural wood, or fiberboard boxes not authorized for PG I material",
        conditions: ["single_box_packaging"],
      },
      {
        packingGroup: "I",
        restriction: "prohibited",
        description: "Bags not authorized for PG I material",
        conditions: ["single_bag_packaging"],
      },
    ],

    referencedParagraphs: ["A3.3.5."],
  },
  "A9.7.": {
    paragraphId: "A9.7.",
    hazardClass: 5,
    description: "Package Iodine Pentafluoride as follows",
    lastUpdated: new Date().toISOString(),
    entryType: "standard",
    materialTypes: ["iodine_pentafluoride"],

    packagingOptions: [
      {
        id: "A9.7.cylinders",
        type: "cylinder",
        description: "DOT specification cylinders",
        innerPackaging: {
          required: false,
        },
        outerPackaging: {
          categories: [
            {
              type: "cylinders",
              containers: [
                {
                  code: "DOT_SPEC",
                  material: "steel",
                  description: "Any DOT specification cylinder",
                },
              ],
            },
          ],
        },
        restrictions: ["Except those specified for acetylene"],
      },
    ],

    specialRequirements: [
      {
        type: "material_compatibility",
        description:
          "Use any DOT specification cylinder except those specified for acetylene",
        mandatory: true,
      },
    ],

    referencedParagraphs: [],
  },
  "A9.8.": {
    paragraphId: "A9.8.",
    hazardClass: 5,
    description:
      "Package Oxidizing Substances, Solid, Self-Heating, N.O.S.; Oxidizing Substances, Solid, Flammable, N.O.S.; Oxidizing Substances, Solid, Water Reactive, N.O.S. as follows",
    lastUpdated: new Date().toISOString(),
    entryType: "exception",
    materialTypes: [
      "oxidizing_substances_self_heating_nos",
      "oxidizing_substances_flammable_nos",
      "oxidizing_substances_water_reactive_nos",
    ],

    packagingOptions: [
      {
        id: "A9.8.caa_approval",
        type: "single",
        description: "Ship according to a competent authority approval (CAA)",
        innerPackaging: {
          required: false,
          description: "As specified in CAA approval",
        },
        outerPackaging: {
          categories: [
            {
              type: "specialized",
              subtype: "caa_approved",
              containers: [
                {
                  code: "CAA",
                  material: "various",
                  description: "As specified in competent authority approval",
                },
              ],
            },
          ],
        },
      },
    ],

    specialRequirements: [
      {
        type: "handling",
        description: "Ship according to a competent authority approval (CAA)",
        mandatory: true,
      },
      {
        type: "handling",
        description: "See paragraph 2.5. for more information on CAAs",
        mandatory: true,
      },
    ],

    referencedParagraphs: ["2.5."],
  },
  "A9.9.": {
    paragraphId: "A9.9.",
    hazardClass: 5,
    description:
      "Package Bromine Pentafluoride or Bromine Trifluoride as follows",
    lastUpdated: new Date().toISOString(),
    entryType: "specialized",
    materialTypes: ["bromine_pentafluoride", "bromine_trifluoride"],

    packagingOptions: [
      {
        id: "A9.9.specification_cylinders",
        type: "cylinder",
        description: "Specification cylinders with specific requirements",
        innerPackaging: {
          required: false,
        },
        outerPackaging: {
          categories: [
            {
              type: "cylinders",
              containers: [
                {
                  code: "3A150",
                  material: "steel",
                  description: "Specification cylinder 3A150",
                },
                {
                  code: "3AA150",
                  material: "steel",
                  description: "Specification cylinder 3AA150",
                },
                {
                  code: "3B240",
                  material: "steel",
                  description: "Specification cylinder 3B240",
                },
                {
                  code: "3BN150",
                  material: "steel",
                  description: "Specification cylinder 3BN150",
                },
                {
                  code: "3E1800",
                  material: "steel",
                  description: "Specification cylinder 3E1800",
                },
                {
                  code: "4B240",
                  material: "steel",
                  description: "Specification cylinder 4B240",
                },
                {
                  code: "4BA240",
                  material: "steel",
                  description: "Specification cylinder 4BA240",
                },
                {
                  code: "4BW240",
                  material: "steel",
                  description: "Specification cylinder 4BW240",
                },
              ],
            },
          ],
        },
      },
      {
        id: "A9.9.overpacked_3e1800",
        type: "combination",
        description:
          "Specification 3E1800 cylinders overpacked in strong wooden box",
        innerPackaging: {
          required: true,
          materials: ["Steel"],
          description: "Specification 3E1800 cylinder",
        },
        outerPackaging: {
          categories: [
            {
              type: "boxes",
              containers: [
                {
                  code: "WOOD_BOX",
                  material: "wood",
                  description: "Strong wooden box",
                },
              ],
            },
          ],
        },
      },
    ],

    specialRequirements: [
      {
        type: "handling",
        description:
          "These items are extremely dangerous. Make approved chemical safety mask and clothing available when handling this material, and wear when handling leaking packages",
        mandatory: true,
      },
      {
        type: "closure_security",
        description:
          "Seal each valve outlet by a threaded cap or a threaded plug",
        mandatory: true,
      },
      {
        type: "closure_security",
        description:
          "No cylinder may be equipped with any pressure relief device",
        mandatory: true,
      },
      {
        type: "protective_packaging",
        description:
          "Overpack specification 3E1800 cylinders in a strong wooden box",
        mandatory: true,
        applicableContainers: ["3E1800"],
      },
    ],

    conditionalRequirements: [
      {
        condition: "cylinder_type",
        conditionType: "packaging_type",
        operator: "equals",
        value: "3E1800",
        effect: "require",
        description: "For 3E1800 cylinders",
        requirements: [
          {
            type: "protective_packaging",
            description: "Must be overpacked in a strong wooden box",
            mandatory: true,
          },
        ],
      },
    ],

    referencedParagraphs: [],
  },
  "A9.10.": {
    paragraphId: "A9.10.",
    hazardClass: 5,
    description: "Oxygen Generators, Chemical",
    lastUpdated: new Date().toISOString(),
    entryType: "equipment",
    materialTypes: ["chemical_oxygen_generators"],

    packagingOptions: [
      {
        id: "A9.10.rigid_outer_packaging",
        type: "single",
        description:
          "Rigid outer packaging meeting specific performance criteria",
        innerPackaging: {
          required: false,
          description: "Chemical oxygen generator (with or without equipment)",
        },
        outerPackaging: {
          categories: [
            {
              type: "specialized",
              subtype: "rigid_performance_packaging",
              containers: [
                {
                  code: "49CFR_178",
                  material: "various",
                  description:
                    "49 CFR Part 178, Subparts L and M, at Packing Group I or II performance level",
                },
                {
                  code: "ATA_300",
                  material: "various",
                  description:
                    "Air Transport Association (ATA) Specification No. 300 for Category I Shipping Container",
                },
              ],
            },
          ],
        },
      },
    ],

    specialRequirements: [
      {
        type: "testing",
        description:
          "A chemical oxygen generator that is shipped with an explosive or nonexplosive means of initiation attached must be classed and approved by the Associate Administrator in accordance with 49 CFR Section 173.56 (T-0)",
        mandatory: true,
      },
      {
        type: "testing",
        description:
          "Ensure a chemical oxygen generator, without any packaging, is capable of withstanding a 1.8 meter drop onto a rigid, non-resilient, flat and horizontal surface, in the position most likely to cause actuation or loss of contents",
        mandatory: true,
      },
      {
        type: "static_prevention",
        description:
          "A chemical oxygen generator must incorporate means of preventing inadvertent actuation",
        mandatory: true,
      },
      {
        type: "testing",
        description:
          "The Flame Penetration Resistance Test specified in 49 CFR Part 178, Appendix E",
        mandatory: true,
      },
      {
        type: "testing",
        description:
          "The Thermal Resistance Test specified in 49 CFR Part 178, Appendix D",
        mandatory: true,
      },
      {
        type: "handling",
        description:
          "A chemical oxygen generator is forbidden for transportation by both passenger-carrying and cargo-only aircraft after the manufacturer's expiration date; or after the contents of the generator have been expended",
        mandatory: true,
      },
    ],

    conditionalRequirements: [
      {
        condition: "not_installed_in_pbe",
        conditionType: "equipment",
        operator: "equals",
        value: "standalone",
        effect: "require",
        description:
          "For generators not installed in protective breathing equipment (PBE)",
        requirements: [
          {
            type: "static_prevention",
            description:
              "Mechanically actuated devices must have two pins, or one pin and one retaining ring, or a cover and pin - each independently capable of preventing actuator from striking primer",
            mandatory: true,
          },
          {
            type: "static_prevention",
            description:
              "Electrically actuated devices must have electrical leads mechanically shorted and the mechanical short must be shielded in metal foil",
            mandatory: true,
          },
          {
            type: "static_prevention",
            description:
              "Devices with a primer but no actuator must have a protective cover over the primer to prevent actuation from external impact",
            mandatory: true,
          },
        ],
      },
      {
        condition: "installed_in_pbe",
        conditionType: "equipment",
        operator: "equals",
        value: "pbe_installed",
        effect: "require",
        description:
          "For generators installed in protective breathing equipment (PBE)",
        requirements: [
          {
            type: "static_prevention",
            description:
              "Must contain a pin installed so as to prevent the actuator from striking the primer, and be placed in a protective bag, pouch, case or cover such that the protective breathing equipment is fully enclosed (T-0)",
            mandatory: true,
          },
        ],
      },
    ],

    referencedParagraphs: [
      "49 CFR Section 173.56",
      "49 CFR Part 178",
      "ATA Specification No. 300",
    ],
  },
  "A10.2.": {
    paragraphId: "A10.2.",
    hazardClass: 6,
    subclass: ["6.1"],
    description: "Package Packing Group I Class 6.1 Toxic Materials",
    lastUpdated: new Date().toISOString(),
    entryType: "standard",
    materialTypes: ["pg_i_toxic_materials", "class_6_1_cylinders"],

    packagingOptions: [
      {
        id: "A10.2.2.cylinders",
        type: "cylinder",
        description:
          "DOT specification cylinders (3A1800, 3AA1800, 3AL1800, 3D, 3E1800, 33) meeting requirements of A3.3.2.",
        innerPackaging: {
          required: false,
          description: "Gas contained in cylinder",
        },
        outerPackaging: {
          categories: [
            {
              type: "cylinders",
              subtype: "dot_specification",
              containers: [
                {
                  code: "3A1800",
                  material: "steel",
                  description: "DOT specification 3A1800 cylinder",
                },
                {
                  code: "3AA1800",
                  material: "steel",
                  description: "DOT specification 3AA1800 cylinder",
                },
                {
                  code: "3AL1800",
                  material: "aluminum",
                  description: "DOT specification 3AL1800 cylinder",
                },
                {
                  code: "3D",
                  material: "steel",
                  description: "DOT specification 3D cylinder",
                },
                {
                  code: "3E1800",
                  material: "steel",
                  description: "DOT specification 3E1800 cylinder",
                },
                {
                  code: "33",
                  material: "steel",
                  description: "DOT specification 33 cylinder",
                },
              ],
            },
          ],
        },
        notes: [
          "Specification 3A, 3AA, and 3AL cylinders may not exceed 57 kg (125 pounds) water capacity (nominal).",
          "Specification 3D and 33 cylinders may not exceed 127 kg (280 pounds) water capacity (nominal).",
          "Do not accept shipments of arsine or phosphine for transportation if packaged in a specification 3AL cylinder.",
          "Cylinders containing phosgene must not exceed a filling density of 125 percent.",
          "The cylinder may not contain more than 68 kg (150 pounds) of phosgene.",
        ],
      },
    ],

    specialRequirements: [
      {
        type: "handling",
        description:
          "These items may produce extremely toxic vapors. Make approved chemical safety mask and clothing available when handling this material, and wear when handling leaking packages.",
        mandatory: true,
      },
      {
        type: "testing",
        description:
          "Each filled cylinder for phosgene must be tested for leakage by immersing the cylinder and valve in a bath of water at approximately 66 degrees C (150 degrees F) for at least 30 minutes. (T-0).",
        mandatory: true,
      },
    ],

    packingGroupRestrictions: [],
    quantityLimits: [
      {
        scope: "per_inner",
        value: 57,
        unit: "kg",
        description:
          "Specification 3A, 3AA, and 3AL cylinders may not exceed 57 kg (125 pounds) water capacity",
        conditions: ["3A1800", "3AA1800", "3AL1800"],
      },
      {
        scope: "per_inner",
        value: 127,
        unit: "kg",
        description:
          "Specification 3D and 33 cylinders may not exceed 127 kg (280 pounds) water capacity",
        conditions: ["3D", "33"],
      },
      {
        scope: "per_inner",
        value: 68,
        unit: "kg",
        description:
          "Cylinder may not contain more than 68 kg (150 pounds) of phosgene",
        conditions: ["phosgene"],
      },
    ],

    conditionalRequirements: [],

    referencedParagraphs: ["A3.3.2.", "2.8."],
  },
  "A10.3.": {
    paragraphId: "A10.3.",
    hazardClass: 6,
    subclass: ["6.1"],
    description:
      "Package Bromoacetone, Methyl Bromide, Chloropicrin, and Methyl Bromide or Methyl Chloride Mixtures",
    lastUpdated: new Date().toISOString(),
    entryType: "standard",
    materialTypes: [
      "bromoacetone",
      "methyl_bromide",
      "chloropicrin",
      "methyl_bromide_mixtures",
      "methyl_chloride_mixtures",
    ],

    packagingOptions: [
      {
        id: "A10.3.2.1.combination",
        type: "combination",
        description:
          "Bromoacetone in boxes with inner glass receptacle in hermetically-sealed metal receptacle in corrugated fiberboard carton",
        innerPackaging: {
          required: true,
          materials: [
            "Glass receptacle or tube in hermetically-sealed metal receptacle in corrugated fiberboard carton",
          ],
          description:
            "Inner glass receptacle or tube in a hermetically-sealed metal receptacle in a corrugated fiberboard carton",
          maxCapacity: { value: 500, unit: "g" },
          specialRequirements: [
            "A bottle may not contain over 500 g (17.6 ounces) of liquid",
            "Cushion inside the can with at least 12.7 mm (0.5 inch) of absorbent material",
          ],
        },
        outerPackaging: {
          categories: [
            {
              type: "boxes",
              subtype: "various_boxes",
              containers: [
                {
                  code: "4A",
                  material: "steel",
                  description: "Steel box (4A)",
                },
                {
                  code: "4B",
                  material: "aluminum",
                  description: "Aluminum box (4B)",
                },
                {
                  code: "4C1",
                  material: "natural_wood",
                  description: "Wooden box (4C1)",
                },
                {
                  code: "4C2",
                  material: "sift_proof_wood",
                  description: "Wooden box (4C2)",
                },
                {
                  code: "4D",
                  material: "plywood",
                  description: "Plywood box (4D)",
                },
                {
                  code: "4F",
                  material: "reconstituted_wood",
                  description: "Reconstituted wood box (4F)",
                },
                {
                  code: "4N",
                  material: "other_metal",
                  description: "Other metal box (4N)",
                },
              ],
            },
          ],
        },
        notes: [
          "Total amount of liquid in the outer box may not exceed 11 kg (24 pounds).",
          "The package must be tested to the PG I performance level. (T-0).",
        ],
      },
      {
        id: "A10.3.2.2.cylinders",
        type: "cylinder",
        description:
          "DOT specification cylinders for bromoacetone, methyl bromide, chloropicrin and mixtures",
        innerPackaging: {
          required: false,
          description: "Material contained in cylinder",
        },
        outerPackaging: {
          categories: [
            {
              type: "cylinders",
              subtype: "dot_specification",
              containers: [
                {
                  code: "3A",
                  material: "steel",
                  description: "DOT specification 3A cylinder",
                },
                {
                  code: "3AA",
                  material: "steel",
                  description: "DOT specification 3AA cylinder",
                },
                {
                  code: "3B",
                  material: "steel",
                  description: "DOT specification 3B cylinder",
                },
                {
                  code: "3C",
                  material: "steel",
                  description: "DOT specification 3C cylinder",
                },
                {
                  code: "3E",
                  material: "steel",
                  description: "DOT specification 3E cylinder",
                },
                {
                  code: "4A",
                  material: "steel",
                  description: "DOT specification 4A cylinder",
                },
                {
                  code: "4B",
                  material: "aluminum",
                  description: "DOT specification 4B cylinder",
                },
                {
                  code: "4BA",
                  material: "steel",
                  description: "DOT specification 4BA cylinder",
                },
                {
                  code: "4BW",
                  material: "steel",
                  description: "DOT specification 4BW cylinder",
                },
                {
                  code: "4C",
                  material: "steel",
                  description: "DOT specification 4C cylinder",
                },
              ],
            },
          ],
        },
        notes: [
          "Water capacity (nominal) not exceeding 113 kg (250 pounds). This capacity does not apply to shipments of methyl bromide.",
          "All cylinders must meet the requirements of A3.3.2. (T-0).",
        ],
      },
    ],

    specialRequirements: [
      {
        type: "handling",
        description:
          "These materials and mixtures are extremely dangerous poisons. Make approved chemical safety mask and clothing available when handling this material, and wear when handling leaking packages.",
        mandatory: true,
      },
    ],

    packingGroupRestrictions: [],
    quantityLimits: [
      {
        scope: "per_outer",
        value: 11,
        unit: "kg",
        description:
          "Total amount of liquid in the outer box may not exceed 11 kg (24 pounds)",
        conditions: ["A10.3.2.1.combination"],
      },
      {
        scope: "per_inner",
        value: 113,
        unit: "kg",
        description:
          "Water capacity (nominal) not exceeding 113 kg (250 pounds) for cylinders",
        conditions: ["A10.3.2.2.cylinders"],
      },
    ],

    conditionalRequirements: [],

    referencedParagraphs: ["A3.3.2.", "2.8."],
  },
  "A10.4.": {
    paragraphId: "A10.4.",
    hazardClass: 6,
    subclass: ["6.1"],
    description: "Package Liquid Class 6.1 Materials",
    lastUpdated: new Date().toISOString(),
    entryType: "standard",
    materialTypes: ["liquid_toxic_materials", "class_6_1_liquids"],

    packagingOptions: [
      {
        id: "A10.4.1.combination",
        type: "combination",
        description:
          "Combination packagings with outer drums, barrels, jerricans, or boxes",
        innerPackaging: {
          required: true,
          materials: [
            "Glass receptacles",
            "Earthenware receptacles",
            "Plastic receptacles",
            "Metal receptacles",
            "Glass ampoules",
          ],
          receptacleTypes: ["glass_ampoules"],
          description:
            "Glass, earthenware, plastic, metal receptacles, or glass ampoules",
        },
        outerPackaging: {
          categories: [
            {
              type: "drums",
              subtype: "removable_head",
              containers: [
                {
                  code: "1A2",
                  material: "steel",
                  description: "Steel drum removable head (1A2)",
                },
                {
                  code: "1B2",
                  material: "aluminum",
                  description: "Aluminum drum removable head (1B2)",
                },
                {
                  code: "1N2",
                  material: "other_metal",
                  description:
                    "Metal drum other than steel/aluminum removable head (1N2)",
                },
                {
                  code: "1D",
                  material: "plywood",
                  description: "Plywood drum (1D)",
                },
                {
                  code: "1G",
                  material: "fiber",
                  description: "Fiber drum (1G)",
                },
                {
                  code: "1H2",
                  material: "plastic",
                  description: "Plastic drum removable head (1H2)",
                },
              ],
            },
            {
              type: "barrels",
              subtype: "wood_barrels",
              containers: [
                {
                  code: "2C2",
                  material: "wood",
                  description: "Wood barrel removable head (2C2)",
                },
              ],
            },
            {
              type: "jerricans",
              subtype: "removable_head",
              containers: [
                {
                  code: "3A2",
                  material: "steel",
                  description: "Steel jerrican removable head (3A2)",
                },
                {
                  code: "3B2",
                  material: "aluminum",
                  description: "Aluminum jerrican removable head (3B2)",
                },
                {
                  code: "3H2",
                  material: "plastic",
                  description: "Plastic jerrican removable head (3H2)",
                },
              ],
            },
            {
              type: "boxes",
              subtype: "various_boxes",
              containers: [
                {
                  code: "4A",
                  material: "steel",
                  description: "Steel box (4A)",
                },
                {
                  code: "4B",
                  material: "aluminum",
                  description: "Aluminum box (4B)",
                },
                {
                  code: "4C1",
                  material: "natural_wood",
                  description: "Natural wood box (4C1)",
                },
                {
                  code: "4C2",
                  material: "sift_proof_wood",
                  description: "Natural wood sift-proof box (4C2)",
                },
                {
                  code: "4D",
                  material: "plywood",
                  description: "Plywood box (4D)",
                },
                {
                  code: "4F",
                  material: "reconstituted_wood",
                  description: "Reconstituted wood box (4F)",
                },
                {
                  code: "4G",
                  material: "fiberboard",
                  description: "Fiberboard box (4G)",
                },
                {
                  code: "4H1",
                  material: "plastic",
                  description: "Expanded plastic box (4H1)",
                },
                {
                  code: "4H2",
                  material: "plastic",
                  description: "Solid plastic box (4H2)",
                },
              ],
            },
          ],
        },
      },
      {
        id: "A10.4.2.single",
        type: "single",
        description: "Single packaging drums, barrels, or jerricans",
        innerPackaging: {
          required: false,
          description: "Inner packaging not required",
        },
        outerPackaging: {
          categories: [
            {
              type: "drums",
              subtype: "steel_aluminum_plastic_metal",
              containers: [
                {
                  code: "1A1",
                  material: "steel",
                  description: "Steel drum tight head (1A1)",
                },
                {
                  code: "1A2",
                  material: "steel",
                  description: "Steel drum removable head (1A2)",
                },
                {
                  code: "1B1",
                  material: "aluminum",
                  description: "Aluminum drum tight head (1B1)",
                },
                {
                  code: "1B2",
                  material: "aluminum",
                  description: "Aluminum drum removable head (1B2)",
                },
                {
                  code: "1G",
                  material: "fiber",
                  description: "Fiber drum with liner (1G)",
                },
                {
                  code: "1H1",
                  material: "plastic",
                  description: "Plastic drum tight head (1H1)",
                },
                {
                  code: "1H2",
                  material: "plastic",
                  description: "Plastic drum removable head (1H2)",
                },
                {
                  code: "1N1",
                  material: "other_metal",
                  description: "Other metal drum tight head (1N1)",
                },
                {
                  code: "1N2",
                  material: "other_metal",
                  description: "Other metal drum removable head (1N2)",
                },
              ],
            },
            {
              type: "barrels",
              subtype: "wood_barrel",
              containers: [
                {
                  code: "2C1",
                  material: "wood",
                  description: "Wood barrel tight head (2C1)",
                },
              ],
            },
            {
              type: "jerricans",
              subtype: "steel_aluminum_plastic",
              containers: [
                {
                  code: "3A1",
                  material: "steel",
                  description: "Steel jerrican tight head (3A1)",
                },
                {
                  code: "3A2",
                  material: "steel",
                  description: "Steel jerrican removable head (3A2)",
                },
                {
                  code: "3B1",
                  material: "aluminum",
                  description: "Aluminum jerrican tight head (3B1)",
                },
                {
                  code: "3B2",
                  material: "aluminum",
                  description: "Aluminum jerrican removable head (3B2)",
                },
                {
                  code: "3H1",
                  material: "plastic",
                  description: "Plastic jerrican tight head (3H1)",
                },
                {
                  code: "3H2",
                  material: "plastic",
                  description: "Plastic jerrican removable head (3H2)",
                },
              ],
            },
          ],
        },
      },
      {
        id: "A10.4.3.composite_plastic",
        type: "composite_plastic",
        description: "Composite packagings with plastic inner receptacles",
        innerPackaging: {
          required: true,
          materials: ["Plastic inner receptacles"],
          description: "Plastic inner receptacle",
        },
        outerPackaging: {
          categories: [
            {
              type: "composite_drum",
              subtype: "plastic_receptacle",
              containers: [
                {
                  code: "6HA1",
                  material: "steel",
                  description: "Plastic receptacle in steel drum (6HA1)",
                },
                {
                  code: "6HB1",
                  material: "aluminum",
                  description: "Plastic receptacle in aluminum drum (6HB1)",
                },
                {
                  code: "6HG1",
                  material: "fiber",
                  description: "Plastic receptacle in fiber drum (6HG1)",
                },
                {
                  code: "6HH1",
                  material: "plastic",
                  description: "Plastic receptacle in plastic drum (6HH1)",
                },
                {
                  code: "6HD1",
                  material: "plywood",
                  description: "Plastic receptacle in plywood drum (6HD1)",
                },
              ],
            },
            {
              type: "composite_box",
              subtype: "plastic_receptacle",
              containers: [
                {
                  code: "6HA2",
                  material: "steel",
                  description: "Plastic receptacle in steel box (6HA2)",
                },
                {
                  code: "6HB2",
                  material: "aluminum",
                  description: "Plastic receptacle in aluminum box (6HB2)",
                },
                {
                  code: "6HC",
                  material: "wood",
                  description: "Plastic receptacle in wooden box (6HC)",
                },
                {
                  code: "6HD2",
                  material: "plywood",
                  description: "Plastic receptacle in plywood box (6HD2)",
                },
                {
                  code: "6HG2",
                  material: "fiberboard",
                  description: "Plastic receptacle in fiberboard box (6HG2)",
                },
              ],
            },
          ],
        },
      },
      {
        id: "A10.4.4.composite_glass_porcelain",
        type: "composite_glass",
        description:
          "Composite packages with glass, porcelain, or stoneware inner receptacles",
        innerPackaging: {
          required: true,
          materials: [
            "Glass inner receptacles",
            "Porcelain inner receptacles",
            "Stoneware inner receptacles",
          ],
          description: "Glass, porcelain, or stoneware inner receptacle",
        },
        outerPackaging: {
          categories: [
            {
              type: "composite_drum",
              subtype: "glass_porcelain_receptacle",
              containers: [
                {
                  code: "6PA1",
                  material: "steel",
                  description:
                    "Glass/porcelain receptacle in steel drum (6PA1)",
                },
                {
                  code: "6PB1",
                  material: "aluminum",
                  description:
                    "Glass/porcelain receptacle in aluminum drum (6PB1)",
                },
                {
                  code: "6PG1",
                  material: "fiber",
                  description:
                    "Glass/porcelain receptacle in fiber drum (6PG1)",
                },
              ],
            },
            {
              type: "composite_box",
              subtype: "glass_porcelain_receptacle",
              containers: [
                {
                  code: "6PA2",
                  material: "steel",
                  description: "Glass/porcelain receptacle in steel box (6PA2)",
                },
                {
                  code: "6PB2",
                  material: "aluminum",
                  description:
                    "Glass/porcelain receptacle in aluminum box (6PB2)",
                },
                {
                  code: "6PC",
                  material: "wood",
                  description: "Glass/porcelain receptacle in wooden box (6PC)",
                },
                {
                  code: "6PG2",
                  material: "fiberboard",
                  description:
                    "Glass/porcelain receptacle in fiberboard box (6PG2)",
                },
              ],
            },
            {
              type: "composite_plastic_packaging",
              subtype: "glass_porcelain_receptacle",
              containers: [
                {
                  code: "6PH1",
                  material: "plastic",
                  description:
                    "Glass/porcelain receptacle in solid plastic packaging (6PH1)",
                },
                {
                  code: "6PH2",
                  material: "plastic",
                  description:
                    "Glass/porcelain receptacle in expanded plastic packaging (6PH2)",
                },
              ],
            },
            {
              type: "specialized",
              subtype: "wickerwork_plywood",
              containers: [
                {
                  code: "6PD1",
                  material: "plywood",
                  description:
                    "Glass/porcelain receptacle in plywood drum (6PD1)",
                },
                {
                  code: "6PD2",
                  material: "wickerwork",
                  description:
                    "Glass/porcelain receptacle in wickerwork hamper (6PD2)",
                },
              ],
            },
          ],
        },
      },
      {
        id: "A10.4.5.cylinders",
        type: "cylinder",
        description:
          "DOT specification cylinders as prescribed for any compressed gas",
        innerPackaging: {
          required: false,
          description: "Gas contained in cylinder",
        },
        outerPackaging: {
          categories: [
            {
              type: "cylinders",
              subtype: "dot_specification",
              containers: [
                {
                  code: "DOT_SPEC",
                  material: "various",
                  description:
                    "DOT specification cylinders (except 8, 8AL acetylene, and 3HT)",
                },
              ],
            },
          ],
        },
      },
    ],

    specialRequirements: [
      {
        type: "absorbent_material",
        description:
          "For PG I material pack inner packagings in a rigid and leakproof receptacle or intermediate packaging containing sufficient absorbent material to absorb the entire contents of all inner packagings",
        mandatory: true,
        applicableContainers: ["A10.4.1.combination"],
      },
      {
        type: "closure_security",
        description:
          "Ensure inner packaging or receptacle closures of combination packages containing liquids are held securely, tightly and effectively in place by secondary means",
        mandatory: true,
        applicableContainers: ["A10.4.1.combination"],
      },
      {
        type: "material_compatibility",
        description: "Wood barrels not authorized for PG I material",
        mandatory: true,
        applicableContainers: ["A10.4.1.combination", "A10.4.2.single"],
      },
      {
        type: "material_compatibility",
        description:
          "Fiber drum with liner only authorized for PG II and III material",
        mandatory: true,
        applicableContainers: ["A10.4.2.single"],
      },
      {
        type: "material_compatibility",
        description: "Wood barrel not authorized for PG I material",
        mandatory: true,
        applicableContainers: ["A10.4.2.single"],
      },
      {
        type: "material_compatibility",
        description: "Plywood drum (6HD1) not authorized for PG I material",
        mandatory: true,
        applicableContainers: ["A10.4.3.composite_plastic"],
      },
    ],

    packingGroupRestrictions: [
      {
        packingGroup: "I",
        restriction: "prohibited",
        description:
          "Wood barrels (2C2, 2C1) not authorized for PG I materials",
        conditions: ["barrel_packaging"],
      },
      {
        packingGroup: "I",
        restriction: "prohibited",
        description: "Fiber drum with liner only for PG II and III",
        conditions: ["fiber_drum_liner"],
      },
      {
        packingGroup: "I",
        restriction: "prohibited",
        description: "Plywood drum (6HD1) not authorized for PG I",
        conditions: ["composite_plywood_drum"],
      },
    ],

    quantityLimits: [],

    conditionalRequirements: [
      {
        condition: "packing_group == 'I'",
        conditionType: "packing_group",
        operator: "equals",
        value: "I",
        effect: "require",
        description: "Additional requirements for PG I materials",
        requirements: [
          {
            type: "absorbent_material",
            description:
              "Must pack in rigid and leakproof receptacle with sufficient absorbent material",
            mandatory: true,
            applicableContainers: ["A10.4.1.combination"],
          },
        ],
      },
      {
        condition: "packaging_type == 'combination_liquids'",
        conditionType: "packaging_type",
        operator: "equals",
        value: "combination",
        effect: "require",
        description:
          "Secondary closure requirements for combination packages with liquids",
        requirements: [
          {
            type: "closure_security",
            description:
              "Inner packaging closures must be held securely by secondary means",
            mandatory: true,
            applicableContainers: ["A10.4.1.combination"],
          },
        ],
      },
    ],

    referencedParagraphs: ["A20.3."],
  },
  "A10.5.": {
    paragraphId: "A10.5.",
    hazardClass: 6,
    subclass: ["6.1"],
    description: "Package Solid Class 6.1 Materials",
    lastUpdated: new Date().toISOString(),
    entryType: "standard",
    materialTypes: ["solid_toxic_materials", "class_6_1_solids"],

    packagingOptions: [
      {
        id: "A10.5.1.combination",
        type: "combination",
        description:
          "Combination packagings with outer drums, barrels, jerricans, or boxes",
        innerPackaging: {
          required: true,
          materials: [
            "Glass receptacles",
            "Earthenware receptacles",
            "Plastic receptacles",
            "Metal receptacles",
            "Glass ampoules",
          ],
          receptacleTypes: ["glass_ampoules"],
          description:
            "Glass, earthenware, plastic or metal receptacles, or glass ampoules",
        },
        outerPackaging: {
          categories: [
            {
              type: "drums",
              subtype: "all_drum_types",
              containers: [
                {
                  code: "1A1",
                  material: "steel",
                  description: "Steel drum tight head (1A1)",
                },
                {
                  code: "1A2",
                  material: "steel",
                  description: "Steel drum removable head (1A2)",
                },
                {
                  code: "1B1",
                  material: "aluminum",
                  description: "Aluminum drum tight head (1B1)",
                },
                {
                  code: "1B2",
                  material: "aluminum",
                  description: "Aluminum drum removable head (1B2)",
                },
                {
                  code: "1D",
                  material: "plywood",
                  description: "Plywood drum (1D)",
                },
                {
                  code: "1G",
                  material: "fiber",
                  description: "Fiber drum (1G)",
                },
                {
                  code: "1H1",
                  material: "plastic",
                  description: "Plastic drum tight head (1H1)",
                },
                {
                  code: "1H2",
                  material: "plastic",
                  description: "Plastic drum removable head (1H2)",
                },
                {
                  code: "1N1",
                  material: "other_metal",
                  description:
                    "Metal drum other than steel/aluminum tight head (1N1)",
                },
                {
                  code: "1N2",
                  material: "other_metal",
                  description:
                    "Metal drum other than steel/aluminum removable head (1N2)",
                },
              ],
            },
            {
              type: "barrels",
              subtype: "wood_barrel",
              containers: [
                {
                  code: "2C2",
                  material: "wood",
                  description: "Wood barrel removable head (2C2)",
                },
              ],
            },
            {
              type: "jerricans",
              subtype: "all_jerrican_types",
              containers: [
                {
                  code: "3A1",
                  material: "steel",
                  description: "Steel jerrican tight head (3A1)",
                },
                {
                  code: "3A2",
                  material: "steel",
                  description: "Steel jerrican removable head (3A2)",
                },
                {
                  code: "3B1",
                  material: "aluminum",
                  description: "Aluminum jerrican tight head (3B1)",
                },
                {
                  code: "3B2",
                  material: "aluminum",
                  description: "Aluminum jerrican removable head (3B2)",
                },
                {
                  code: "3H1",
                  material: "plastic",
                  description: "Plastic jerrican tight head (3H1)",
                },
                {
                  code: "3H2",
                  material: "plastic",
                  description: "Plastic jerrican removable head (3H2)",
                },
              ],
            },
            {
              type: "boxes",
              subtype: "all_box_types",
              containers: [
                {
                  code: "4A",
                  material: "steel",
                  description: "Steel box (4A)",
                },
                {
                  code: "4B",
                  material: "aluminum",
                  description: "Aluminum box (4B)",
                },
                {
                  code: "4C1",
                  material: "natural_wood",
                  description: "Natural wood box (4C1)",
                },
                {
                  code: "4C2",
                  material: "sift_proof_wood",
                  description: "Natural wood sift-proof box (4C2)",
                },
                {
                  code: "4D",
                  material: "plywood",
                  description: "Plywood box (4D)",
                },
                {
                  code: "4F",
                  material: "reconstituted_wood",
                  description: "Reconstituted wood box (4F)",
                },
                {
                  code: "4G",
                  material: "fiberboard",
                  description: "Fiberboard box (4G)",
                },
                {
                  code: "4H2",
                  material: "plastic",
                  description: "Solid plastic box (4H2)",
                },
                {
                  code: "4N",
                  material: "other_metal",
                  description: "Metal box other than steel/aluminum (4N)",
                },
              ],
            },
          ],
        },
      },
      {
        id: "A10.5.2.single",
        type: "single",
        description:
          "Single packaging drums, barrels, jerricans, boxes, or bags",
        innerPackaging: {
          required: false,
          description: "Inner packaging not required",
        },
        outerPackaging: {
          categories: [
            {
              type: "drums",
              subtype: "all_drum_types",
              containers: [
                {
                  code: "1A1",
                  material: "steel",
                  description: "Steel drum tight head (1A1)",
                },
                {
                  code: "1A2",
                  material: "steel",
                  description: "Steel drum removable head (1A2)",
                },
                {
                  code: "1B1",
                  material: "aluminum",
                  description: "Aluminum drum tight head (1B1)",
                },
                {
                  code: "1B2",
                  material: "aluminum",
                  description: "Aluminum drum removable head (1B2)",
                },
                {
                  code: "1D",
                  material: "plywood",
                  description: "Plywood drum (1D)",
                },
                {
                  code: "1G",
                  material: "fiber",
                  description: "Fiber drum (1G)",
                },
                {
                  code: "1H1",
                  material: "plastic",
                  description: "Plastic drum tight head (1H1)",
                },
                {
                  code: "1H2",
                  material: "plastic",
                  description: "Plastic drum removable head (1H2)",
                },
                {
                  code: "1N1",
                  material: "other_metal",
                  description:
                    "Metal drum other than steel/aluminum tight head (1N1)",
                },
                {
                  code: "1N2",
                  material: "other_metal",
                  description:
                    "Metal drum other than steel/aluminum removable head (1N2)",
                },
              ],
            },
            {
              type: "barrels",
              subtype: "wood_barrels",
              containers: [
                {
                  code: "2C1",
                  material: "wood",
                  description: "Wood barrel tight head (2C1)",
                },
                {
                  code: "2C2",
                  material: "wood",
                  description: "Wood barrel removable head (2C2)",
                },
              ],
            },
            {
              type: "jerricans",
              subtype: "all_jerrican_types",
              containers: [
                {
                  code: "3A1",
                  material: "steel",
                  description: "Steel jerrican tight head (3A1)",
                },
                {
                  code: "3A2",
                  material: "steel",
                  description: "Steel jerrican removable head (3A2)",
                },
                {
                  code: "3B1",
                  material: "aluminum",
                  description: "Aluminum jerrican tight head (3B1)",
                },
                {
                  code: "3B2",
                  material: "aluminum",
                  description: "Aluminum jerrican removable head (3B2)",
                },
                {
                  code: "3H1",
                  material: "plastic",
                  description: "Plastic jerrican tight head (3H1)",
                },
                {
                  code: "3H2",
                  material: "plastic",
                  description: "Plastic jerrican removable head (3H2)",
                },
              ],
            },
            {
              type: "boxes",
              subtype: "all_box_types_with_liners",
              containers: [
                {
                  code: "4A",
                  material: "steel",
                  description: "Steel box (4A)",
                },
                {
                  code: "4A_LINER",
                  material: "steel",
                  description: "Steel box with liner (4A)",
                },
                {
                  code: "4B",
                  material: "aluminum",
                  description: "Aluminum box (4B)",
                },
                {
                  code: "4B_LINER",
                  material: "aluminum",
                  description: "Aluminum box with liner (4B)",
                },
                {
                  code: "4C1",
                  material: "natural_wood",
                  description: "Natural wood box (4C1)",
                },
                {
                  code: "4C2",
                  material: "sift_proof_wood",
                  description: "Natural wood sift-proof box (4C2)",
                },
                {
                  code: "4D",
                  material: "plywood",
                  description: "Plywood box (4D)",
                },
                {
                  code: "4F",
                  material: "reconstituted_wood",
                  description: "Reconstituted wood box (4F)",
                },
                {
                  code: "4G",
                  material: "fiberboard",
                  description: "Fiberboard box (4G)",
                },
                {
                  code: "4H1",
                  material: "plastic",
                  description: "Expanded plastic box (4H1)",
                },
                {
                  code: "4H2",
                  material: "plastic",
                  description: "Solid plastic box (4H2)",
                },
                {
                  code: "4N",
                  material: "other_metal",
                  description: "Metal box other than steel/aluminum (4N)",
                },
              ],
            },
            {
              type: "bags",
              subtype: "various_bag_types",
              containers: [
                {
                  code: "5H1",
                  material: "plastic",
                  description:
                    "Woven plastic bag without inner liner or coating (5H1)",
                },
                {
                  code: "5H2",
                  material: "plastic",
                  description: "Woven plastic bag with inner liner (5H2)",
                },
                {
                  code: "5H3",
                  material: "plastic",
                  description: "Woven plastic bag with inner coating (5H3)",
                },
                {
                  code: "5H4",
                  material: "plastic",
                  description: "Plastic film bag (5H4)",
                },
                {
                  code: "5L1",
                  material: "textile",
                  description:
                    "Textile bag without inner liner or coating (5L1)",
                },
                {
                  code: "5L2",
                  material: "textile",
                  description: "Textile bag with inner liner (5L2)",
                },
                {
                  code: "5L3",
                  material: "textile",
                  description: "Textile bag with inner coating (5L3)",
                },
                {
                  code: "5M2",
                  material: "paper",
                  description: "Paper bag, multiwall, water-resistant (5M2)",
                },
              ],
            },
          ],
        },
      },
      {
        id: "A10.5.3.composite_plastic",
        type: "composite_plastic",
        description: "Composite packages with plastic inner receptacles",
        innerPackaging: {
          required: true,
          materials: ["Plastic inner receptacles"],
          description: "Plastic inner receptacle",
        },
        outerPackaging: {
          categories: [
            {
              type: "composite_drum",
              subtype: "plastic_receptacle",
              containers: [
                {
                  code: "6HA1",
                  material: "steel",
                  description: "Plastic receptacle in steel drum (6HA1)",
                },
                {
                  code: "6HB1",
                  material: "aluminum",
                  description: "Plastic receptacle in aluminum drum (6HB1)",
                },
                {
                  code: "6HD1",
                  material: "plywood",
                  description: "Plastic receptacle in plywood drum (6HD1)",
                },
                {
                  code: "6HG1",
                  material: "fiber",
                  description: "Plastic receptacle in fiber drum (6HG1)",
                },
                {
                  code: "6HH1",
                  material: "plastic",
                  description: "Plastic receptacle in plastic drum (6HH1)",
                },
              ],
            },
            {
              type: "composite_box",
              subtype: "plastic_receptacle",
              containers: [
                {
                  code: "6HA2",
                  material: "steel",
                  description: "Plastic receptacle in steel box (6HA2)",
                },
                {
                  code: "6HB2",
                  material: "aluminum",
                  description: "Plastic receptacle in aluminum box (6HB2)",
                },
                {
                  code: "6HC",
                  material: "wood",
                  description: "Plastic receptacle in wood box (6HC)",
                },
                {
                  code: "6HD2",
                  material: "plywood",
                  description: "Plastic receptacle in plywood box (6HD2)",
                },
                {
                  code: "6HG2",
                  material: "fiberboard",
                  description: "Plastic receptacle in fiberboard box (6HG2)",
                },
              ],
            },
          ],
        },
      },
      {
        id: "A10.5.4.composite_glass_porcelain",
        type: "composite_glass",
        description:
          "Composite packages with glass, porcelain, or stoneware inner receptacles",
        innerPackaging: {
          required: true,
          materials: [
            "Glass inner receptacles",
            "Porcelain inner receptacles",
            "Stoneware inner receptacles",
          ],
          description: "Glass, porcelain, or stoneware inner receptacle",
        },
        outerPackaging: {
          categories: [
            {
              type: "composite_drum",
              subtype: "glass_porcelain_receptacle",
              containers: [
                {
                  code: "6PA1",
                  material: "steel",
                  description:
                    "Glass/porcelain receptacle in steel drum (6PA1)",
                },
                {
                  code: "6PB1",
                  material: "aluminum",
                  description:
                    "Glass/porcelain receptacle in aluminum drum (6PB1)",
                },
                {
                  code: "6PD1",
                  material: "plywood",
                  description:
                    "Glass/porcelain receptacle in plywood drum (6PD1)",
                },
                {
                  code: "6PG1",
                  material: "fiber",
                  description:
                    "Glass/porcelain receptacle in fiber drum (6PG1)",
                },
              ],
            },
            {
              type: "composite_box",
              subtype: "glass_porcelain_receptacle",
              containers: [
                {
                  code: "6PA2",
                  material: "steel",
                  description: "Glass/porcelain receptacle in steel box (6PA2)",
                },
                {
                  code: "6PB2",
                  material: "aluminum",
                  description:
                    "Glass/porcelain receptacle in aluminum box (6PB2)",
                },
                {
                  code: "6PC",
                  material: "wood",
                  description: "Glass/porcelain receptacle in wooden box (6PC)",
                },
                {
                  code: "6PG2",
                  material: "fiberboard",
                  description:
                    "Glass/porcelain receptacle in fiberboard box (6PG2)",
                },
              ],
            },
            {
              type: "composite_plastic_packaging",
              subtype: "glass_porcelain_receptacle",
              containers: [
                {
                  code: "6PH1",
                  material: "plastic",
                  description:
                    "Glass/porcelain receptacle in expanded plastic packaging (6PH1)",
                },
                {
                  code: "6PH2",
                  material: "plastic",
                  description:
                    "Glass/porcelain receptacle in solid plastic packaging (6PH2)",
                },
              ],
            },
          ],
        },
      },
    ],

    specialRequirements: [
      {
        type: "material_compatibility",
        description: "Plywood drum (1D) not authorized for PG I material",
        mandatory: true,
        applicableContainers: ["A10.5.2.single"],
      },
      {
        type: "material_compatibility",
        description:
          "Wood barrels (2C1 or 2C2) not authorized for PG I material",
        mandatory: true,
        applicableContainers: ["A10.5.2.single"],
      },
      {
        type: "material_compatibility",
        description:
          "Steel (4A) without liner, aluminum (4B) without liner, natural wood (4C1), plywood (4D), reconstituted wood (4F), fiberboard (4G), expanded plastic (4H1), solid plastic (4H2) boxes not authorized for PG I material",
        mandatory: true,
        applicableContainers: ["A10.5.2.single"],
      },
      {
        type: "material_compatibility",
        description: "Bags not authorized for PG I material",
        mandatory: true,
        applicableContainers: ["A10.5.2.single"],
      },
      {
        type: "material_compatibility",
        description:
          "Fit fiber, fiberboard, wood, and plywood packagings with a suitable liner",
        mandatory: true,
        applicableContainers: ["A10.5.2.single"],
      },
    ],

    packingGroupRestrictions: [
      {
        packingGroup: "I",
        restriction: "prohibited",
        description: "Plywood drum (1D) not authorized for PG I materials",
        conditions: ["plywood_drum"],
      },
      {
        packingGroup: "I",
        restriction: "prohibited",
        description:
          "Wood barrels (2C1, 2C2) not authorized for PG I materials",
        conditions: ["wood_barrels"],
      },
      {
        packingGroup: "I",
        restriction: "prohibited",
        description:
          "Various box types without liners not authorized for PG I materials",
        conditions: ["boxes_without_liners"],
      },
      {
        packingGroup: "I",
        restriction: "prohibited",
        description: "Bags not authorized for PG I materials",
        conditions: ["bag_packaging"],
      },
    ],

    quantityLimits: [],

    conditionalRequirements: [
      {
        condition: "packing_group == 'I'",
        conditionType: "packing_group",
        operator: "equals",
        value: "I",
        effect: "prohibit",
        description: "PG I restrictions for various packaging types",
        requirements: [
          {
            type: "material_compatibility",
            description:
              "Multiple packaging types prohibited for PG I - use only authorized containers",
            mandatory: true,
            applicableContainers: ["A10.5.2.single"],
          },
        ],
      },
      {
        condition:
          "packaging_material in ['fiber', 'fiberboard', 'wood', 'plywood']",
        conditionType: "material_state",
        operator: "contains",
        value: "porous_materials",
        effect: "require",
        description: "Liner requirements for porous packaging materials",
        requirements: [
          {
            type: "material_compatibility",
            description: "Must fit with suitable liner",
            mandatory: true,
            applicableContainers: ["A10.5.2.single"],
          },
        ],
      },
    ],

    referencedParagraphs: [],
  },
  "A10.6.": {
    paragraphId: "A10.6.",
    hazardClass: 6,
    subclass: ["6.1"],
    description:
      "Package Class 6.1, PG I, Hazard Zone A and B (Poisonous by Inhalation)",
    lastUpdated: new Date().toISOString(),
    entryType: "specialized",
    materialTypes: [
      "toxic_inhalation_hazard",
      "hazard_zone_a",
      "hazard_zone_b",
      "packing_group_i",
    ],

    packagingOptions: [
      {
        id: "A10.6.2.1.cylinders",
        type: "cylinder",
        description:
          "Seamless DOT or UN specification cylinders for Hazard Zone A",
        innerPackaging: {
          required: false,
          description: "Material contained in cylinder",
        },
        outerPackaging: {
          categories: [
            {
              type: "cylinders",
              subtype: "dot_un_seamless",
              containers: [
                {
                  code: "DOT_UN_SEAMLESS",
                  material: "various",
                  description:
                    "Seamless DOT or UN specification cylinders (except 8, 8AL, 39)",
                },
              ],
            },
          ],
        },
      },
      {
        id: "A10.6.2.2.inner_outer_drums",
        type: "combination",
        description: "Inner drum in outer drum system for Hazard Zone A",
        innerPackaging: {
          required: true,
          materials: ["Steel", "Aluminum", "Plastic", "Metal"],
          description: "Inner drum (1A1, 1B1, 1H1, 1N1, or 6HA1)",
        },
        outerPackaging: {
          categories: [
            {
              type: "drums",
              subtype: "outer_drum_system",
              containers: [
                {
                  code: "1A2",
                  material: "steel",
                  description:
                    "Outer steel drum removable head (1A2) - min 1.35mm thickness",
                },
                {
                  code: "1H2",
                  material: "plastic",
                  description:
                    "Outer plastic drum removable head (1H2) - min 6.30mm thickness",
                },
              ],
            },
          ],
        },
      },
      {
        id: "A10.6.2.3.combination_packaging",
        type: "combination",
        description:
          "Combination packagings with impact-resistant receptacle for Hazard Zone A",
        innerPackaging: {
          required: true,
          materials: ["Glass", "Earthenware", "Plastic", "Metal"],
          maxCapacity: { value: 4, unit: "L" },
          description:
            "Impact-resistant receptacle in leak-tight packaging (max 4L)",
        },
        outerPackaging: {
          categories: [
            {
              type: "drums",
              subtype: "various_outer_drums",
              containers: [
                {
                  code: "1A2",
                  material: "steel",
                  description: "Steel drum removable head (1A2)",
                },
                {
                  code: "1B2",
                  material: "aluminum",
                  description: "Aluminum drum removable head (1B2)",
                },
                {
                  code: "1D",
                  material: "plywood",
                  description: "Plywood drum (1D)",
                },
                {
                  code: "1G",
                  material: "fiber",
                  description: "Fiber drum (1G)",
                },
                {
                  code: "1H2",
                  material: "plastic",
                  description: "Plastic drum removable head (1H2)",
                },
                {
                  code: "1N2",
                  material: "other_metal",
                  description:
                    "Metal drum other than steel/aluminum removable head (1N2)",
                },
              ],
            },
            {
              type: "boxes",
              subtype: "various_outer_boxes",
              containers: [
                {
                  code: "4A",
                  material: "steel",
                  description: "Steel box (4A)",
                },
                {
                  code: "4B",
                  material: "aluminum",
                  description: "Aluminum box (4B)",
                },
                {
                  code: "4C1",
                  material: "natural_wood",
                  description: "Natural wood box (4C1)",
                },
                {
                  code: "4C2",
                  material: "sift_proof_wood",
                  description: "Natural wood sift-proof box (4C2)",
                },
                {
                  code: "4D",
                  material: "plywood",
                  description: "Plywood box (4D)",
                },
                {
                  code: "4F",
                  material: "reconstituted_wood",
                  description: "Reconstituted wood box (4F)",
                },
                {
                  code: "4G",
                  material: "fiberboard",
                  description: "Fiberboard box (4G)",
                },
                {
                  code: "4H1",
                  material: "plastic",
                  description: "Expanded plastic box (4H1)",
                },
                {
                  code: "4H2",
                  material: "plastic",
                  description: "Solid plastic box (4H2)",
                },
                {
                  code: "4N",
                  material: "other_metal",
                  description: "Metal box other than steel/aluminum (4N)",
                },
              ],
            },
          ],
        },
      },
      {
        id: "A10.6.3.1.cylinders_zone_b",
        type: "cylinder",
        description:
          "Seamless DOT or UN specification cylinders for Hazard Zone B",
        innerPackaging: {
          required: false,
          description: "Material contained in cylinder",
        },
        outerPackaging: {
          categories: [
            {
              type: "cylinders",
              subtype: "dot_un_seamless",
              containers: [
                {
                  code: "DOT_UN_SEAMLESS",
                  material: "various",
                  description:
                    "Seamless DOT or UN specification cylinders (except 8, 8AL, 39)",
                },
              ],
            },
          ],
        },
      },
      {
        id: "A10.6.3.2.inner_outer_drums_zone_b",
        type: "combination",
        description: "Inner drum in outer drum system for Hazard Zone B",
        innerPackaging: {
          required: true,
          materials: ["Steel", "Aluminum", "Plastic", "Metal"],
          description: "Inner drum (1A1, 1B1, 1H1, 1N1, or 6HA1)",
        },
        outerPackaging: {
          categories: [
            {
              type: "drums",
              subtype: "outer_drum_system",
              containers: [
                {
                  code: "1A2",
                  material: "steel",
                  description:
                    "Outer steel drum removable head (1A2) - min 1.35mm thickness",
                },
                {
                  code: "1H2",
                  material: "plastic",
                  description:
                    "Outer plastic drum removable head (1H2) - min 6.30mm thickness",
                },
              ],
            },
          ],
        },
      },
    ],

    specialRequirements: [
      {
        type: "handling",
        description:
          "These items are extremely dangerous. Make approved chemical safety mask and clothing available when handling this material, and wear when handling leaking packages",
        mandatory: true,
      },
      {
        type: "testing",
        description:
          "Cylinders must conform to 49 CFR Section 173.40 and meet requirements of A3.3.2",
        mandatory: true,
        applicableContainers: [
          "A10.6.2.1.cylinders",
          "A10.6.3.1.cylinders_zone_b",
        ],
      },
      {
        type: "testing",
        description:
          "Inner drum must satisfactorily withstand hydrostatic pressure test of 300 kPa (45 psig) for Zone A",
        mandatory: true,
        applicableContainers: ["A10.6.2.2.inner_outer_drums"],
      },
      {
        type: "testing",
        description:
          "Inner drum must satisfactorily withstand leakproofness test using internal air pressure at 55°C of at least twice the vapor pressure",
        mandatory: true,
        applicableContainers: [
          "A10.6.2.2.inner_outer_drums",
          "A10.6.3.2.inner_outer_drums_zone_b",
        ],
      },
      {
        type: "closure_type",
        description:
          "Inner drum must have screw-type closures closed and tightened to prescribed torque using measuring device",
        mandatory: true,
        applicableContainers: [
          "A10.6.2.2.inner_outer_drums",
          "A10.6.3.2.inner_outer_drums_zone_b",
        ],
      },
      {
        type: "closure_security",
        description:
          "Closures must be physically held in place to prevent back-off or loosening during transportation",
        mandatory: true,
        applicableContainers: [
          "A10.6.2.2.inner_outer_drums",
          "A10.6.3.2.inner_outer_drums_zone_b",
        ],
      },
      {
        type: "closure_security",
        description:
          "Cap seal must be properly applied and capable of withstanding internal pressure of at least 100 kPa (15 psig)",
        mandatory: true,
        applicableContainers: [
          "A10.6.2.2.inner_outer_drums",
          "A10.6.3.2.inner_outer_drums_zone_b",
        ],
      },
      {
        type: "testing",
        description:
          "Outer drum must withstand hydrostatic test pressure of 100kPa (15 psig)",
        mandatory: true,
        applicableContainers: [
          "A10.6.2.2.inner_outer_drums",
          "A10.6.3.2.inner_outer_drums_zone_b",
        ],
      },
      {
        type: "cushioning",
        description:
          "Cushion inner drum within outer drum with shock-mitigating, nonreactive material completely surrounding inner packaging",
        mandatory: true,
        applicableContainers: [
          "A10.6.2.2.inner_outer_drums",
          "A10.6.3.2.inner_outer_drums_zone_b",
        ],
      },
      {
        type: "absorbent_material",
        description:
          "Pack inner receptacle with nonreactive absorbent material within leak-tight packaging",
        mandatory: true,
        applicableContainers: ["A10.6.2.3.combination_packaging"],
      },
      {
        type: "closure_security",
        description:
          "Inner receptacle closure must be held in place to prevent back-off or loosening during transportation",
        mandatory: true,
        applicableContainers: ["A10.6.2.3.combination_packaging"],
      },
      {
        type: "testing",
        description:
          "Both inner packaging system and outer container must meet PG I performance level independently",
        mandatory: true,
        applicableContainers: ["A10.6.2.3.combination_packaging"],
      },
    ],

    packingGroupRestrictions: [
      {
        packingGroup: "I",
        restriction: "required",
        description:
          "Only Packing Group I materials authorized for this packaging paragraph",
        conditions: ["hazard_zone_a_b"],
      },
    ],

    quantityLimits: [
      {
        scope: "per_inner",
        value: 220,
        unit: "L",
        description: "Inner drum capacity may not exceed 220 L (58 gallons)",
        conditions: ["inner_outer_drum_system"],
      },
      {
        scope: "per_inner",
        value: 4,
        unit: "L",
        description: "Inner receptacle capacity may not exceed 4 L (1 gallon)",
        conditions: ["combination_packaging"],
      },
      {
        scope: "per_outer",
        value: 16,
        unit: "L",
        description:
          "Total liquid in outer container may not exceed 16 L (4 gallons)",
        conditions: ["combination_packaging"],
      },
    ],

    conditionalRequirements: [
      {
        condition: "hazard_zone == 'A'",
        conditionType: "material_state",
        operator: "equals",
        value: "zone_a",
        effect: "require",
        description: "Additional requirements for Hazard Zone A materials",
        requirements: [
          {
            type: "testing",
            description:
              "Inner drum must withstand 300 kPa hydrostatic pressure test",
            mandatory: true,
            applicableContainers: ["A10.6.2.2.inner_outer_drums"],
          },
        ],
      },
      {
        condition: "hazard_zone == 'B'",
        conditionType: "material_state",
        operator: "equals",
        value: "zone_b",
        effect: "require",
        description: "Requirements for Hazard Zone B materials",
        requirements: [
          {
            type: "testing",
            description:
              "Leakproofness test required but not hydrostatic pressure test",
            mandatory: true,
            applicableContainers: ["A10.6.3.2.inner_outer_drums_zone_b"],
          },
        ],
      },
      {
        condition: "drum_thickness_requirements",
        conditionType: "packaging_type",
        operator: "equals",
        value: "inner_drum",
        effect: "require",
        description: "Minimum thickness requirements for inner drums",
        requirements: [
          {
            type: "testing",
            description:
              "1A1 and 1N1 drums: 1.3mm (Zone A) or 0.69mm (Zone B) minimum thickness",
            mandatory: true,
            applicableContainers: [
              "A10.6.2.2.inner_outer_drums",
              "A10.6.3.2.inner_outer_drums_zone_b",
            ],
          },
          {
            type: "testing",
            description:
              "1B1 drums: 3.9mm (Zone A) or 2.79mm (Zone B) minimum thickness",
            mandatory: true,
            applicableContainers: [
              "A10.6.2.2.inner_outer_drums",
              "A10.6.3.2.inner_outer_drums_zone_b",
            ],
          },
          {
            type: "testing",
            description:
              "1H1 drums: 3.16mm (Zone A) or 1.14mm (Zone B) minimum thickness",
            mandatory: true,
            applicableContainers: [
              "A10.6.2.2.inner_outer_drums",
              "A10.6.3.2.inner_outer_drums_zone_b",
            ],
          },
          {
            type: "testing",
            description:
              "6HA1 drums: plastic inner 1.58mm, steel outer 0.96mm (Zone A) or 0.70mm (Zone B)",
            mandatory: true,
            applicableContainers: [
              "A10.6.2.2.inner_outer_drums",
              "A10.6.3.2.inner_outer_drums_zone_b",
            ],
          },
        ],
      },
    ],

    referencedParagraphs: [
      "49 CFR Section 173.40",
      "49 CFR Part 178, Subpart C",
      "A3.3.2.",
      "49 CFR Section 178.605",
      "49 CFR Section 178.604",
    ],
  },
  "A10.7.": {
    paragraphId: "A10.7.",
    hazardClass: 6,
    subclass: ["6.1"],
    description: "Package Tear Gas Candles",
    lastUpdated: new Date().toISOString(),
    entryType: "specialized",
    materialTypes: [
      "tear_gas_candles",
      "tear_gas_grenades",
      "tear_gas_devices",
    ],

    packagingOptions: [
      {
        id: "A10.7.1.metal_strapped_boxes",
        type: "combination",
        description:
          "Metal-strapped boxes for tear gas devices with functioning elements",
        innerPackaging: {
          required: true,
          description:
            "Functioning elements in separate compartment, inner boxes, or separate outside box",
        },
        outerPackaging: {
          categories: [
            {
              type: "boxes",
              subtype: "metal_strapped",
              containers: [
                {
                  code: "4A",
                  material: "steel",
                  description: "Steel box (4A)",
                },
                {
                  code: "4B",
                  material: "aluminum",
                  description: "Aluminum box (4B)",
                },
                {
                  code: "4C1",
                  material: "natural_wood",
                  description: "Metal-strapped natural wood box (4C1)",
                },
                {
                  code: "4C2",
                  material: "sift_proof_wood",
                  description: "Metal-strapped natural wood box (4C2)",
                },
                {
                  code: "4D",
                  material: "plywood",
                  description: "Metal-strapped plywood box (4D)",
                },
                {
                  code: "4F",
                  material: "reconstituted_wood",
                  description: "Metal-strapped reconstituted wood box (4F)",
                },
                {
                  code: "4N",
                  material: "other_metal",
                  description: "Other metal box (4N)",
                },
              ],
            },
          ],
        },
      },
      {
        id: "A10.7.2.drums",
        type: "combination",
        description:
          "Drums for tear gas devices with functioning elements in separate packaging",
        innerPackaging: {
          required: true,
          description:
            "Functioning elements in separate inner packaging or separate compartment",
        },
        outerPackaging: {
          categories: [
            {
              type: "drums",
              subtype: "removable_head",
              containers: [
                {
                  code: "1A2",
                  material: "steel",
                  description: "Steel drum removable head (1A2)",
                },
                {
                  code: "1B2",
                  material: "aluminum",
                  description: "Aluminum drum removable head (1B2)",
                },
                {
                  code: "1H2",
                  material: "plastic",
                  description: "Plastic drum removable head (1H2)",
                },
                {
                  code: "1N2",
                  material: "other_metal",
                  description: "Other metal drum removable head (1N2)",
                },
              ],
            },
          ],
        },
      },
      {
        id: "A10.7.3.dot_2p_2q",
        type: "combination",
        description: "DOT 2P and 2Q inner containers in fiberboard boxes",
        innerPackaging: {
          required: true,
          materials: ["Metal"],
          description:
            "DOT 2P or 2Q specification inner containers (nonrefillable metal containers)",
        },
        outerPackaging: {
          categories: [
            {
              type: "boxes",
              subtype: "fiberboard_with_tubes",
              containers: [
                {
                  code: "4G",
                  material: "fiberboard",
                  description:
                    "Fiberboard box (4G) with fiberboard tubes with metal ends or suitable padding",
                },
              ],
            },
          ],
        },
      },
    ],

    specialRequirements: [
      {
        type: "handling",
        description:
          "Any newly developed packaging requires approval from the DOT before initial transportation from the manufacturer",
        mandatory: true,
      },
      {
        type: "quantity_control",
        description:
          "No more than 50 items and 50 functioning elements can be packed in one outer container (metal-strapped boxes)",
        mandatory: true,
        applicableContainers: ["A10.7.1.metal_strapped_boxes"],
      },
      {
        type: "weight_limit",
        description:
          "Gross weight of outer container may not exceed 35 kg (77 pounds) for metal-strapped boxes",
        mandatory: true,
        applicableContainers: ["A10.7.1.metal_strapped_boxes"],
      },
      {
        type: "compartment_separation",
        description:
          "Pack functioning elements not assembled in grenades or devices in separate compartment, inner boxes, or separate outside wooden box",
        mandatory: true,
        applicableContainers: ["A10.7.1.metal_strapped_boxes"],
      },
      {
        type: "cushioning",
        description:
          "Pack and cushion elements so they cannot come into contact with each other or the walls during transportation",
        mandatory: true,
        applicableContainers: ["A10.7.1.metal_strapped_boxes"],
      },
      {
        type: "static_prevention",
        description:
          "Tear gas devices can be shipped completely assembled provided functioning elements are packed so they cannot accidentally function",
        mandatory: true,
        applicableContainers: ["A10.7.1.metal_strapped_boxes"],
      },
      {
        type: "quantity_control",
        description:
          "Pack no more than 24 items and 24 functioning elements in one outer drum",
        mandatory: true,
        applicableContainers: ["A10.7.2.drums"],
      },
      {
        type: "weight_limit",
        description:
          "Gross weight of outer container may not exceed 35 kg (77 pounds) for drums",
        mandatory: true,
        applicableContainers: ["A10.7.2.drums"],
      },
      {
        type: "compartment_separation",
        description:
          "Pack functioning elements in separate inner packaging or separate compartment",
        mandatory: true,
        applicableContainers: ["A10.7.2.drums"],
      },
      {
        type: "cushioning",
        description:
          "Place each inside container into fiberboard tubes with metal ends or fiberboard box with suitable padding",
        mandatory: true,
        applicableContainers: ["A10.7.3.dot_2p_2q"],
      },
      {
        type: "quantity_control",
        description:
          "Pack no more than 30 inner packagings in one outer fiberboard box",
        mandatory: true,
        applicableContainers: ["A10.7.3.dot_2p_2q"],
      },
      {
        type: "weight_limit",
        description:
          "Gross weight may not exceed 16 kg (35 pounds) for DOT 2P/2Q packaging",
        mandatory: true,
        applicableContainers: ["A10.7.3.dot_2p_2q"],
      },
    ],

    packingGroupRestrictions: [],

    quantityLimits: [
      {
        scope: "per_package",
        value: 50,
        unit: "pieces",
        description:
          "Maximum 50 items and 50 functioning elements per outer container",
        conditions: ["metal_strapped_boxes"],
      },
      {
        scope: "per_package",
        value: 35,
        unit: "kg",
        description: "Maximum gross weight for metal-strapped boxes and drums",
        conditions: ["metal_strapped_boxes", "drums"],
      },
      {
        scope: "per_package",
        value: 24,
        unit: "pieces",
        description: "Maximum 24 items and 24 functioning elements per drum",
        conditions: ["drums"],
      },
      {
        scope: "per_package",
        value: 30,
        unit: "pieces",
        description: "Maximum 30 inner packagings per outer fiberboard box",
        conditions: ["dot_2p_2q"],
      },
      {
        scope: "per_package",
        value: 16,
        unit: "kg",
        description: "Maximum gross weight for DOT 2P/2Q packaging",
        conditions: ["dot_2p_2q"],
      },
    ],

    conditionalRequirements: [
      {
        condition: "packaging_type == 'metal_strapped_boxes'",
        conditionType: "packaging_type",
        operator: "equals",
        value: "metal_strapped_boxes",
        effect: "require",
        description: "Requirements for metal-strapped box packaging",
        requirements: [
          {
            type: "compartment_separation",
            description:
              "Functioning elements must be separated in compartment, inner boxes, or separate outside wooden box (4C1, 4C2, 4D, 4F)",
            mandatory: true,
            applicableContainers: ["A10.7.1.metal_strapped_boxes"],
          },
          {
            type: "quantity_control",
            description:
              "Maximum 50 items and 50 functioning elements per container",
            mandatory: true,
            applicableContainers: ["A10.7.1.metal_strapped_boxes"],
          },
        ],
      },
      {
        condition: "packaging_type == 'drums'",
        conditionType: "packaging_type",
        operator: "equals",
        value: "drums",
        effect: "require",
        description: "Requirements for drum packaging",
        requirements: [
          {
            type: "quantity_control",
            description:
              "Maximum 24 items and 24 functioning elements per drum",
            mandatory: true,
            applicableContainers: ["A10.7.2.drums"],
          },
        ],
      },
      {
        condition: "packaging_type == 'dot_2p_2q'",
        conditionType: "packaging_type",
        operator: "equals",
        value: "dot_2p_2q",
        effect: "require",
        description: "Requirements for DOT 2P/2Q packaging",
        requirements: [
          {
            type: "quantity_control",
            description: "Maximum 30 inner packagings per outer fiberboard box",
            mandatory: true,
            applicableContainers: ["A10.7.3.dot_2p_2q"],
          },
          {
            type: "cushioning",
            description:
              "Must use fiberboard tubes with metal ends or suitable padding",
            mandatory: true,
            applicableContainers: ["A10.7.3.dot_2p_2q"],
          },
        ],
      },
      {
        condition: "tear_gas_substance > 2_percent",
        conditionType: "concentration",
        operator: "greater_than",
        value: 2,
        effect: "require",
        description:
          "Applies to devices with more than 2 percent tear gas substance by mass",
        requirements: [
          {
            type: "handling",
            description:
              "Must meet all packaging requirements for tear gas devices",
            mandatory: true,
            applicableContainers: [
              "A10.7.1.metal_strapped_boxes",
              "A10.7.2.drums",
              "A10.7.3.dot_2p_2q",
            ],
          },
        ],
      },
    ],

    referencedParagraphs: [],
  },
  "A10.8.": {
    paragraphId: "A10.8.",
    hazardClass: 6,
    subclass: ["6.2"],
    description:
      "Package Infectious Substances and Genetically Modified Microorganisms",
    lastUpdated: new Date().toISOString(),
    entryType: "specialized",
    materialTypes: [
      "infectious_substances_human",
      "infectious_substances_animal",
      "genetically_modified_microorganisms",
      "category_a",
      "category_b",
    ],

    packagingOptions: [
      {
        id: "A10.8.triple_packaging_system",
        type: "combination",
        description:
          "Triple packaging system: primary receptacle, secondary packaging, rigid outer packaging",
        innerPackaging: {
          required: true,
          materials: ["Glass", "Metal", "Plastic"],
          description: "Leakproof primary receptacle",
        },
        outerPackaging: {
          categories: [
            {
              type: "specialized",
              subtype: "triple_packaging",
              containers: [
                {
                  code: "TRIPLE_PKG",
                  material: "various",
                  description:
                    "Triple packaging system meeting 49 CFR Section 178.609 requirements",
                },
              ],
            },
          ],
        },
      },
      {
        id: "A10.8.3.1.lyophilized",
        type: "specialized",
        description: "Lyophilized substances packaging",
        innerPackaging: {
          required: true,
          materials: ["Glass"],
          receptacleTypes: ["flame_sealed_ampoules", "rubber_stopped_vials"],
          description:
            "Flame-sealed glass ampoules or rubber stopped glass vials fitted with metal seals",
        },
        outerPackaging: {
          categories: [
            {
              type: "specialized",
              subtype: "lyophilized_packaging",
              containers: [
                {
                  code: "LYOPH_PKG",
                  material: "various",
                  description:
                    "Specialized packaging for lyophilized substances",
                },
              ],
            },
          ],
        },
      },
      {
        id: "A10.8.3.2.ambient_temp",
        type: "specialized",
        description:
          "Liquid or solid substances shipped at ambient temperatures or higher",
        innerPackaging: {
          required: true,
          materials: ["Glass", "Metal", "Plastic"],
          description: "Glass, metal, or plastic with positive leak proof seal",
        },
        outerPackaging: {
          categories: [
            {
              type: "specialized",
              subtype: "ambient_temp_packaging",
              containers: [
                {
                  code: "AMBIENT_PKG",
                  material: "various",
                  description:
                    "Packaging for ambient or higher temperature shipment",
                },
              ],
            },
          ],
        },
      },
      {
        id: "A10.8.3.3.refrigerated_frozen",
        type: "specialized",
        description:
          "Liquid or solid substances shipped refrigerated or frozen (ice, prefrozen packs, or dry ice)",
        innerPackaging: {
          required: true,
          materials: ["Glass", "Metal", "Plastic"],
          description:
            "Primary receptacle maintaining integrity at refrigeration temperatures",
        },
        outerPackaging: {
          categories: [
            {
              type: "specialized",
              subtype: "refrigerated_packaging",
              containers: [
                {
                  code: "REFRIG_PKG",
                  material: "various",
                  description:
                    "Leak proof outer packaging (ice) or CO2 permeable packaging (dry ice)",
                },
              ],
            },
          ],
        },
      },
      {
        id: "A10.8.3.4.liquid_nitrogen",
        type: "specialized",
        description: "Liquid or solid substances shipped in liquid nitrogen",
        innerPackaging: {
          required: true,
          materials: ["Metal"],
          description:
            "Primary receptacle maintaining integrity at liquid nitrogen temperatures",
        },
        outerPackaging: {
          categories: [
            {
              type: "specialized",
              subtype: "liquid_nitrogen_packaging",
              containers: [
                {
                  code: "LN2_PKG",
                  material: "metal",
                  description:
                    "Metal vacuum insulated vessels or flasks vented to atmosphere",
                },
              ],
            },
          ],
        },
      },
    ],

    specialRequirements: [
      {
        type: "handling",
        description:
          "This material has the potential to cause disease in humans (UN2814) or animals (UN2900)",
        mandatory: true,
      },
      {
        type: "testing",
        description:
          "Each package must be capable of passing tests specified in 49 CFR Section 178.609",
        mandatory: true,
      },
      {
        type: "orientation",
        description:
          "Each package must be at least 100 mm (3.9 inches) in the smallest overall external dimensions",
        mandatory: true,
      },
      {
        type: "handling",
        description:
          "Each package must have an itemized list of contents enclosed between secondary packaging and outer packaging",
        mandatory: true,
      },
      {
        type: "handling",
        description:
          "For suspected Category A substances, show 'Suspected Category A Infectious Substance' in parenthesis on itemized list",
        mandatory: true,
      },
      {
        type: "testing",
        description:
          "Primary receptacle or secondary packaging must withstand internal pressure of not less than 95 kPa (14 psi)",
        mandatory: true,
      },
      {
        type: "temperature_control",
        description:
          "Primary and secondary packaging must withstand temperatures -40°C to +55°C (-40°F to +131°F)",
        mandatory: true,
      },
      {
        type: "handling",
        description:
          "Must meet requirements for biological select agents and toxins per 42 CFR Part 73, 7 CFR Part 331, 9 CFR Part 121",
        mandatory: true,
      },
      {
        type: "handling",
        description:
          "Must make advanced arrangements for permits and ensure transport occurs without delay",
        mandatory: true,
      },
      {
        type: "absorbent_material",
        description:
          "Place absorbent material between primary receptacle and secondary packaging sufficient to absorb entire contents",
        mandatory: true,
        applicableContainers: ["A10.8.triple_packaging_system"],
      },
      {
        type: "closure_security",
        description:
          "Provide positive means of ensuring leak proof seal (heat seal, skirted stopper, or metal crimp seal)",
        mandatory: true,
        applicableContainers: ["A10.8.3.2.ambient_temp"],
      },
      {
        type: "closure_security",
        description: "If screw caps are used, reinforce with adhesive tape",
        mandatory: true,
        applicableContainers: ["A10.8.3.2.ambient_temp"],
      },
      {
        type: "temperature_control",
        description:
          "Place ice or dry ice outside secondary packagings with interior supports to secure position after dissipation",
        mandatory: true,
        applicableContainers: ["A10.8.3.3.refrigerated_frozen"],
      },
      {
        type: "orientation",
        description:
          "Mark package orientation markings and design to prevent release irrespective of orientation",
        mandatory: true,
        applicableContainers: ["A10.8.3.4.liquid_nitrogen"],
      },
      {
        type: "static_prevention",
        description:
          "Safety relief valves, check valves, frangible discs prohibited in vent lines",
        mandatory: true,
        applicableContainers: ["A10.8.3.4.liquid_nitrogen"],
      },
      {
        type: "moisture_protection",
        description:
          "Protect fill and discharge openings against entry of foreign materials",
        mandatory: true,
        applicableContainers: ["A10.8.3.4.liquid_nitrogen"],
      },
    ],

    packingGroupRestrictions: [],

    quantityLimits: [
      {
        scope: "per_package",
        value: 100,
        unit: "mm",
        description:
          "Minimum dimension in smallest overall external dimensions",
        conditions: ["all_packages"],
      },
    ],

    conditionalRequirements: [
      {
        condition: "substance_category == 'A'",
        conditionType: "material_state",
        operator: "equals",
        value: "category_a",
        effect: "require",
        description:
          "Additional requirements for Category A infectious substances",
        requirements: [
          {
            type: "testing",
            description:
              "Must pass all performance tests in 49 CFR Section 178.609",
            mandatory: true,
            applicableContainers: ["A10.8.triple_packaging_system"],
          },
        ],
      },
      {
        condition: "substance_category == 'B'",
        conditionType: "material_state",
        operator: "equals",
        value: "category_b",
        effect: "require",
        description:
          "Requirements for Category B infectious substances (in cultures)",
        requirements: [
          {
            type: "testing",
            description:
              "Must meet triple packaging requirements and performance standards",
            mandatory: true,
            applicableContainers: ["A10.8.triple_packaging_system"],
          },
        ],
      },
      {
        condition: "temperature_control == 'refrigerated'",
        conditionType: "temperature",
        operator: "equals",
        value: "refrigerated",
        effect: "require",
        description: "Requirements for refrigerated or frozen shipments",
        requirements: [
          {
            type: "temperature_control",
            description:
              "Primary and secondary packaging must maintain integrity at refrigeration temperatures and transport pressures",
            mandatory: true,
            applicableContainers: ["A10.8.3.3.refrigerated_frozen"],
          },
        ],
      },
      {
        condition: "temperature_control == 'liquid_nitrogen'",
        conditionType: "temperature",
        operator: "equals",
        value: "liquid_nitrogen",
        effect: "require",
        description: "Requirements for liquid nitrogen shipments",
        requirements: [
          {
            type: "temperature_control",
            description:
              "Must maintain integrity at liquid nitrogen temperatures and transport pressures",
            mandatory: true,
            applicableContainers: ["A10.8.3.4.liquid_nitrogen"],
          },
          {
            type: "orientation",
            description:
              "Must prevent release of refrigerated liquid nitrogen irrespective of packaging orientation",
            mandatory: true,
            applicableContainers: ["A10.8.3.4.liquid_nitrogen"],
          },
        ],
      },
      {
        condition: "material_state == 'lyophilized'",
        conditionType: "material_state",
        operator: "equals",
        value: "lyophilized",
        effect: "require",
        description: "Requirements for lyophilized substances",
        requirements: [
          {
            type: "closure_security",
            description:
              "Must use flame-sealed glass ampoules or rubber stopped glass vials with metal seals",
            mandatory: true,
            applicableContainers: ["A10.8.3.1.lyophilized"],
          },
        ],
      },
      {
        condition: "multiple_primary_receptacles == true",
        conditionType: "packaging_type",
        operator: "equals",
        value: "multiple",
        effect: "require",
        description:
          "Requirements when multiple primary receptacles in single secondary packaging",
        requirements: [
          {
            type: "absorbent_material",
            description:
              "Separate primary receptacles with enough absorbent material to prevent contact and absorb entire contents",
            mandatory: true,
            applicableContainers: ["A10.8.triple_packaging_system"],
          },
        ],
      },
    ],

    referencedParagraphs: [
      "49 CFR Section 178.609",
      "42 CFR Part 73",
      "7 CFR Part 331",
      "9 CFR Part 121",
      "DLAI 4145.21/TB MED 284/NAVSUPINST 4610.31",
    ],
  },
  "A10.9.": {
    paragraphId: "A10.9.",
    hazardClass: 6,
    subclass: ["6.2"],
    description: "Package Biological Substances, Category B",
    lastUpdated: new Date().toISOString(),
    entryType: "specialized",
    materialTypes: ["biological_substances_category_b"],

    packagingOptions: [
      {
        id: "A10.9.category_b_packaging",
        type: "combination",
        description:
          "Primary receptacle, leakproof secondary packaging, and rigid outer packaging",
        innerPackaging: {
          required: true,
          materials: ["Glass", "Metal", "Plastic"],
          description: "Leakproof primary receptacle and leakproof secondary packaging",
        },
        outerPackaging: {
          categories: [
            {
              type: "specialized",
              subtype: "rigid_outer_packaging",
              containers: [
                {
                  code: "RIGID_OUTER",
                  material: "various",
                  description: "Rigid outer packaging meeting A10.9 requirements",
                },
              ],
            },
          ],
        },
      },
    ],

    specialRequirements: [
      {
        type: "handling",
        description:
          "Use packaging consisting of a primary receptacle, secondary packaging, and rigid outer packaging",
        mandatory: true,
      },
      {
        type: "absorbent_material",
        description:
          "Place absorbent material between primary receptacle and secondary packaging for liquids",
        mandatory: true,
      },
      {
        type: "testing",
        description:
          "Package must pass drop test at 1.2 meters (3.9 feet)",
        mandatory: true,
      },
      {
        type: "orientation",
        description:
          "Minimum external dimension of 100 mm (3.9 inches)",
        mandatory: true,
      },
    ],

    packingGroupRestrictions: [],

    quantityLimits: [],

    conditionalRequirements: [],

    referencedParagraphs: ["A14.4.5.3.", "A14.4.5.4.", "49 CFR Section 178.603"],
  },
  "A10.10.": {
    paragraphId: "A10.10.",
    hazardClass: 6,
    subclass: ["6.2"],
    description:
      "Package Regulated Medical Waste, N.O.S.; Biomedical Waste, N.O.S.; Clinical Waste, Unspecified, N.O.S.; Medical Waste, N.O.S.",
    lastUpdated: new Date().toISOString(),
    entryType: "standard",
    materialTypes: ["regulated_medical_waste"],

    packagingOptions: [
      {
        id: "A10.10.1.single_packaging",
        type: "single",
        description: "Single packaging drums, boxes, or jerricans",
        innerPackaging: {
          required: false,
          description: "Inner packaging not required",
        },
        outerPackaging: {
          categories: [
            {
              type: "drums",
              subtype: "removable_head",
              containers: [
                { code: "1A2", material: "steel", description: "Steel drum removable head (1A2)" },
                { code: "1B2", material: "aluminum", description: "Aluminum drum removable head (1B2)" },
                { code: "1N2", material: "other_metal", description: "Other metal drum removable head (1N2)" },
                { code: "1D", material: "plywood", description: "Plywood drum (1D)" },
                { code: "1G", material: "fiber", description: "Fiber drum (1G)" },
                { code: "1H2", material: "plastic", description: "Plastic drum removable head (1H2)" },
              ],
            },
            {
              type: "boxes",
              subtype: "rigid_boxes",
              containers: [
                { code: "4A", material: "steel", description: "Steel box (4A)" },
                { code: "4B", material: "aluminum", description: "Aluminum box (4B)" },
                { code: "4C1", material: "natural_wood", description: "Natural wood box (4C1)" },
                { code: "4C2", material: "sift_proof_wood", description: "Natural wood sift-proof box (4C2)" },
                { code: "4D", material: "plywood", description: "Plywood box (4D)" },
                { code: "4F", material: "reconstituted_wood", description: "Reconstituted wood box (4F)" },
                { code: "4G", material: "fiberboard", description: "Fiberboard box (4G)" },
                { code: "4H1", material: "plastic", description: "Expanded plastic box (4H1)" },
                { code: "4H2", material: "plastic", description: "Solid plastic box (4H2)" },
                { code: "4N", material: "other_metal", description: "Other metal box (4N)" },
              ],
            },
            {
              type: "jerricans",
              subtype: "removable_head",
              containers: [
                { code: "3A2", material: "steel", description: "Steel jerrican removable head (3A2)" },
                { code: "3B2", material: "aluminum", description: "Aluminum jerrican removable head (3B2)" },
                { code: "3H2", material: "plastic", description: "Plastic jerrican removable head (3H2)" },
              ],
            },
          ],
        },
      },
    ],

    specialRequirements: [
      {
        type: "handling",
        description:
          "Prepare packages to arrive in good condition and present no hazard during transport",
        mandatory: true,
      },
      {
        type: "testing",
        description:
          "Use packaging tests appropriate for solids if sufficient absorbent material is present; otherwise tests for liquids",
        mandatory: true,
      },
      {
        type: "closure_security",
        description:
          "Packagings for sharp objects must be puncture resistant and retain liquids",
        mandatory: true,
      },
    ],

    packingGroupRestrictions: [],

    quantityLimits: [],

    conditionalRequirements: [],

    referencedParagraphs: [],
  },
  "A10.11.": {
    paragraphId: "A10.11.",
    hazardClass: 6,
    subclass: ["6.1"],
    description: "Package Chlorosilanes",
    lastUpdated: new Date().toISOString(),
    entryType: "standard",
    materialTypes: ["chlorosilanes"],

    packagingOptions: [
      {
        id: "A10.11.1.combination",
        type: "combination",
        description: "Combination packagings with drums or boxes",
        innerPackaging: {
          required: true,
          materials: ["Glass", "Steel"],
          description: "Glass or steel receptacles",
        },
        outerPackaging: {
          categories: [
            {
              type: "drums",
              subtype: "combination_drums",
              containers: [
                { code: "1A2", material: "steel", description: "Steel drum removable head (1A2)" },
                { code: "1D", material: "plywood", description: "Plywood drum (1D)" },
                { code: "1G", material: "fiber", description: "Fiber drum (1G)" },
                { code: "1H2", material: "plastic", description: "Plastic drum removable head (1H2)" },
              ],
            },
            {
              type: "boxes",
              subtype: "combination_boxes",
              containers: [
                { code: "4A", material: "steel", description: "Steel box (4A)" },
                { code: "4C1", material: "natural_wood", description: "Natural wood box (4C1)" },
                { code: "4C2", material: "sift_proof_wood", description: "Natural wood sift-proof box (4C2)" },
                { code: "4D", material: "plywood", description: "Plywood box (4D)" },
                { code: "4F", material: "reconstituted_wood", description: "Reconstituted wood box (4F)" },
                { code: "4G", material: "fiberboard", description: "Fiberboard box (4G)" },
                { code: "4H1", material: "plastic", description: "Expanded plastic box (4H1)" },
                { code: "4H2", material: "plastic", description: "Solid plastic box (4H2)" },
              ],
            },
          ],
        },
      },
      {
        id: "A10.11.2.composite_drums",
        type: "composite_plastic",
        description: "Composite drums with plastic inner receptacle",
        innerPackaging: {
          required: true,
          materials: ["Plastic"],
        },
        outerPackaging: {
          categories: [
            {
              type: "drums",
              subtype: "composite_drums",
              containers: [
                { code: "6HA1", material: "steel", description: "Composite drum with plastic inner (6HA1)" },
              ],
            },
          ],
        },
      },
      {
        id: "A10.11.3.single",
        type: "single",
        description: "Single drums or jerricans",
        innerPackaging: { required: false },
        outerPackaging: {
          categories: [
            {
              type: "drums",
              subtype: "single_drums",
              containers: [
                { code: "1A1", material: "steel", description: "Steel drum tight head (1A1)" },
              ],
            },
            {
              type: "jerricans",
              subtype: "single_jerricans",
              containers: [
                { code: "3A1", material: "steel", description: "Steel jerrican tight head (3A1)" },
              ],
            },
          ],
        },
      },
      {
        id: "A10.11.4.cylinders",
        type: "cylinder",
        description:
          "Cylinders for compressed gases (excluding 3HT and acetylene specifications 8/8AL)",
        innerPackaging: { required: false },
        outerPackaging: {
          categories: [
            {
              type: "cylinders",
              subtype: "compressed_gas_cylinders",
              containers: [
                { code: "CYLINDER", material: "steel", description: "DOT/UN cylinders per A10.11.4" },
              ],
            },
          ],
        },
      },
    ],

    specialRequirements: [
      {
        type: "handling",
        description: "Packaging meeting PG I or PG II performance standard is required",
        mandatory: true,
      },
    ],

    packingGroupRestrictions: [],

    quantityLimits: [],

    conditionalRequirements: [],

    referencedParagraphs: [],
  },
  "A10.12.": {
    paragraphId: "A10.12.",
    hazardClass: 6,
    subclass: ["6.1"],
    description:
      "Toxins, Extracted From Living Sources, Liquid or Solid, N.O.S.",
    lastUpdated: new Date().toISOString(),
    entryType: "standard",
    materialTypes: ["toxins_extracted_from_living_sources"],

    packagingOptions: [
      {
        id: "A10.12.1.1.liquid_combination",
        type: "combination",
        description: "Liquid toxins in combination packagings",
        innerPackaging: {
          required: true,
          materials: ["Glass", "Plastic", "Metal"],
        },
        outerPackaging: {
          categories: [
            {
              type: "drums",
              subtype: "combination_drums",
              containers: [
                { code: "1A1", material: "steel", description: "Steel drum tight head (1A1)" },
                { code: "1A2", material: "steel", description: "Steel drum removable head (1A2)" },
                { code: "1B1", material: "aluminum", description: "Aluminum drum tight head (1B1)" },
                { code: "1B2", material: "aluminum", description: "Aluminum drum removable head (1B2)" },
                { code: "1D", material: "plywood", description: "Plywood drum (1D)" },
                { code: "1G", material: "fiber", description: "Fiber drum (1G)" },
                { code: "1H1", material: "plastic", description: "Plastic drum tight head (1H1)" },
                { code: "1H2", material: "plastic", description: "Plastic drum removable head (1H2)" },
                { code: "1N1", material: "other_metal", description: "Other metal drum tight head (1N1)" },
                { code: "1N2", material: "other_metal", description: "Other metal drum removable head (1N2)" },
              ],
            },
            {
              type: "boxes",
              subtype: "combination_boxes",
              containers: [
                { code: "4A", material: "steel", description: "Steel box (4A)" },
                { code: "4B", material: "aluminum", description: "Aluminum box (4B)" },
                { code: "4C1", material: "natural_wood", description: "Natural wood box (4C1)" },
                { code: "4C2", material: "sift_proof_wood", description: "Natural wood sift-proof box (4C2)" },
                { code: "4D", material: "plywood", description: "Plywood box (4D)" },
                { code: "4F", material: "reconstituted_wood", description: "Reconstituted wood box (4F)" },
                { code: "4G", material: "fiberboard", description: "Fiberboard box (4G)" },
                { code: "4H1", material: "plastic", description: "Expanded plastic box (4H1)" },
                { code: "4H2", material: "plastic", description: "Solid plastic box (4H2)" },
                { code: "4N", material: "other_metal", description: "Other metal box (4N)" },
              ],
            },
            {
              type: "jerricans",
              subtype: "combination_jerricans",
              containers: [
                { code: "3A1", material: "steel", description: "Steel jerrican tight head (3A1)" },
                { code: "3A2", material: "steel", description: "Steel jerrican removable head (3A2)" },
                { code: "3B1", material: "aluminum", description: "Aluminum jerrican tight head (3B1)" },
                { code: "3B2", material: "aluminum", description: "Aluminum jerrican removable head (3B2)" },
                { code: "3H1", material: "plastic", description: "Plastic jerrican tight head (3H1)" },
                { code: "3H2", material: "plastic", description: "Plastic jerrican removable head (3H2)" },
              ],
            },
          ],
        },
      },
      {
        id: "A10.12.1.2.liquid_single",
        type: "single",
        description: "Liquid toxins in single packagings",
        innerPackaging: { required: false },
        outerPackaging: {
          categories: [
            {
              type: "drums",
              subtype: "single_drums",
              containers: [
                { code: "1A1", material: "steel", description: "Steel drum tight head (1A1)" },
                { code: "1A2", material: "steel", description: "Steel drum removable head (1A2)" },
                { code: "1B1", material: "aluminum", description: "Aluminum drum tight head (1B1)" },
                { code: "1B2", material: "aluminum", description: "Aluminum drum removable head (1B2)" },
                { code: "1H1", material: "plastic", description: "Plastic drum tight head (1H1)" },
                { code: "1H2", material: "plastic", description: "Plastic drum removable head (1H2)" },
                { code: "1N1", material: "other_metal", description: "Other metal drum tight head (1N1)" },
                { code: "1N2", material: "other_metal", description: "Other metal drum removable head (1N2)" },
              ],
            },
            {
              type: "jerricans",
              subtype: "single_jerricans",
              containers: [
                { code: "3A1", material: "steel", description: "Steel jerrican tight head (3A1)" },
                { code: "3A2", material: "steel", description: "Steel jerrican removable head (3A2)" },
                { code: "3B1", material: "aluminum", description: "Aluminum jerrican tight head (3B1)" },
                { code: "3B2", material: "aluminum", description: "Aluminum jerrican removable head (3B2)" },
                { code: "3H1", material: "plastic", description: "Plastic jerrican tight head (3H1)" },
                { code: "3H2", material: "plastic", description: "Plastic jerrican removable head (3H2)" },
              ],
            },
          ],
        },
      },
      {
        id: "A10.12.1.3.liquid_composite_plastic",
        type: "composite_plastic",
        description: "Liquid toxins in composite packagings with plastic inner receptacles",
        innerPackaging: { required: true, materials: ["Plastic"] },
        outerPackaging: {
          categories: [
            {
              type: "drums",
              subtype: "composite_drums",
              containers: [
                { code: "6HA1", material: "steel", description: "Composite drum (6HA1)" },
                { code: "6HB1", material: "aluminum", description: "Composite drum (6HB1)" },
                { code: "6HD1", material: "plywood", description: "Composite drum (6HD1)" },
                { code: "6HG1", material: "fiber", description: "Composite drum (6HG1)" },
                { code: "6HH1", material: "plastic", description: "Composite drum (6HH1)" },
              ],
            },
            {
              type: "boxes",
              subtype: "composite_boxes",
              containers: [
                { code: "6HA2", material: "steel", description: "Composite box (6HA2)" },
                { code: "6HB2", material: "aluminum", description: "Composite box (6HB2)" },
                { code: "6HC", material: "wood", description: "Composite box (6HC)" },
                { code: "6HD2", material: "plywood", description: "Composite box (6HD2)" },
                { code: "6HG2", material: "fiberboard", description: "Composite box (6HG2)" },
                { code: "6HH2", material: "plastic", description: "Composite box (6HH2)" },
              ],
            },
          ],
        },
      },
      {
        id: "A10.12.2.1.solid_combination",
        type: "combination",
        description: "Solid toxins in combination packagings",
        innerPackaging: {
          required: true,
          materials: ["Fiber", "Glass", "Paper", "Plastic", "Metal"],
        },
        outerPackaging: {
          categories: [
            {
              type: "drums",
              subtype: "combination_drums",
              containers: [
                { code: "1A1", material: "steel", description: "Steel drum tight head (1A1)" },
                { code: "1A2", material: "steel", description: "Steel drum removable head (1A2)" },
                { code: "1B1", material: "aluminum", description: "Aluminum drum tight head (1B1)" },
                { code: "1B2", material: "aluminum", description: "Aluminum drum removable head (1B2)" },
                { code: "1D", material: "plywood", description: "Plywood drum (1D)" },
                { code: "1G", material: "fiber", description: "Fiber drum (1G)" },
                { code: "1H1", material: "plastic", description: "Plastic drum tight head (1H1)" },
                { code: "1H2", material: "plastic", description: "Plastic drum removable head (1H2)" },
                { code: "1N1", material: "other_metal", description: "Other metal drum tight head (1N1)" },
                { code: "1N2", material: "other_metal", description: "Other metal drum removable head (1N2)" },
              ],
            },
            {
              type: "boxes",
              subtype: "combination_boxes",
              containers: [
                { code: "4A", material: "steel", description: "Steel box (4A)" },
                { code: "4B", material: "aluminum", description: "Aluminum box (4B)" },
                { code: "4C1", material: "natural_wood", description: "Natural wood box (4C1)" },
                { code: "4C2", material: "sift_proof_wood", description: "Natural wood sift-proof box (4C2)" },
                { code: "4D", material: "plywood", description: "Plywood box (4D)" },
                { code: "4F", material: "reconstituted_wood", description: "Reconstituted wood box (4F)" },
                { code: "4G", material: "fiberboard", description: "Fiberboard box (4G)" },
                { code: "4H1", material: "plastic", description: "Expanded plastic box (4H1)" },
                { code: "4H2", material: "plastic", description: "Solid plastic box (4H2)" },
                { code: "4N", material: "other_metal", description: "Other metal box (4N)" },
              ],
            },
            {
              type: "jerricans",
              subtype: "combination_jerricans",
              containers: [
                { code: "3A1", material: "steel", description: "Steel jerrican tight head (3A1)" },
                { code: "3A2", material: "steel", description: "Steel jerrican removable head (3A2)" },
                { code: "3B1", material: "aluminum", description: "Aluminum jerrican tight head (3B1)" },
                { code: "3B2", material: "aluminum", description: "Aluminum jerrican removable head (3B2)" },
                { code: "3H1", material: "plastic", description: "Plastic jerrican tight head (3H1)" },
                { code: "3H2", material: "plastic", description: "Plastic jerrican removable head (3H2)" },
              ],
            },
          ],
        },
      },
      {
        id: "A10.12.2.2.solid_single",
        type: "single",
        description: "Solid toxins in single packagings",
        innerPackaging: { required: false },
        outerPackaging: {
          categories: [
            {
              type: "drums",
              subtype: "single_drums",
              containers: [
                { code: "1A1", material: "steel", description: "Steel drum tight head (1A1)" },
                { code: "1A2", material: "steel", description: "Steel drum removable head (1A2)" },
                { code: "1B1", material: "aluminum", description: "Aluminum drum tight head (1B1)" },
                { code: "1B2", material: "aluminum", description: "Aluminum drum removable head (1B2)" },
                { code: "1D", material: "plywood", description: "Plywood drum (1D)" },
                { code: "1G", material: "fiber", description: "Fiber drum (1G)" },
                { code: "1H1", material: "plastic", description: "Plastic drum tight head (1H1)" },
                { code: "1H2", material: "plastic", description: "Plastic drum removable head (1H2)" },
                { code: "1N1", material: "other_metal", description: "Other metal drum tight head (1N1)" },
                { code: "1N2", material: "other_metal", description: "Other metal drum removable head (1N2)" },
              ],
            },
            {
              type: "boxes",
              subtype: "single_boxes",
              containers: [
                { code: "4A", material: "steel", description: "Steel box (4A)" },
                { code: "4B", material: "aluminum", description: "Aluminum box (4B)" },
                { code: "4C1", material: "natural_wood", description: "Natural wood box (4C1)" },
                { code: "4C2", material: "sift_proof_wood", description: "Natural wood sift-proof box (4C2)" },
                { code: "4D", material: "plywood", description: "Plywood box (4D)" },
                { code: "4F", material: "reconstituted_wood", description: "Reconstituted wood box (4F)" },
                { code: "4G", material: "fiberboard", description: "Fiberboard box (4G)" },
                { code: "4H2", material: "plastic", description: "Solid plastic box (4H2)" },
                { code: "4N", material: "other_metal", description: "Other metal box (4N)" },
              ],
            },
            {
              type: "jerricans",
              subtype: "single_jerricans",
              containers: [
                { code: "3A1", material: "steel", description: "Steel jerrican tight head (3A1)" },
                { code: "3A2", material: "steel", description: "Steel jerrican removable head (3A2)" },
                { code: "3B1", material: "aluminum", description: "Aluminum jerrican tight head (3B1)" },
                { code: "3B2", material: "aluminum", description: "Aluminum jerrican removable head (3B2)" },
                { code: "3H1", material: "plastic", description: "Plastic jerrican tight head (3H1)" },
                { code: "3H2", material: "plastic", description: "Plastic jerrican removable head (3H2)" },
              ],
            },
          ],
        },
      },
      {
        id: "A10.12.2.3.solid_composite_plastic",
        type: "composite_plastic",
        description: "Solid toxins in composite packagings with plastic inner receptacles",
        innerPackaging: { required: true, materials: ["Plastic"] },
        outerPackaging: {
          categories: [
            {
              type: "drums",
              subtype: "composite_drums",
              containers: [
                { code: "6HA1", material: "steel", description: "Composite drum (6HA1)" },
                { code: "6HB1", material: "aluminum", description: "Composite drum (6HB1)" },
                { code: "6HD1", material: "plywood", description: "Composite drum (6HD1)" },
                { code: "6HG1", material: "fiber", description: "Composite drum (6HG1)" },
                { code: "6HH1", material: "plastic", description: "Composite drum (6HH1)" },
              ],
            },
            {
              type: "boxes",
              subtype: "composite_boxes",
              containers: [
                { code: "6HA2", material: "steel", description: "Composite box (6HA2)" },
                { code: "6HB2", material: "aluminum", description: "Composite box (6HB2)" },
                { code: "6HC", material: "wood", description: "Composite box (6HC)" },
                { code: "6HD2", material: "plywood", description: "Composite box (6HD2)" },
                { code: "6HG2", material: "fiberboard", description: "Composite box (6HG2)" },
                { code: "6HH2", material: "plastic", description: "Composite box (6HH2)" },
              ],
            },
          ],
        },
      },
    ],

    specialRequirements: [
      {
        type: "handling",
        description:
          "Supplement the proper shipping name with a technical name",
        mandatory: true,
      },
      {
        type: "material_compatibility",
        description:
          "Boxes not allowed for PG I materials (solid single packaging)",
        mandatory: true,
        applicableContainers: ["A10.12.2.2.solid_single"],
      },
      {
        type: "material_compatibility",
        description:
          "Fit fiber, fiberboard, wood, and plywood packagings with a suitable liner (solid single packaging)",
        mandatory: true,
        applicableContainers: ["A10.12.2.2.solid_single"],
      },
    ],

    packingGroupRestrictions: [
      {
        packingGroup: "I",
        restriction: "prohibited",
        description:
          "Boxes not allowed for PG I materials (solid single packaging)",
        conditions: ["boxes_solid_single"],
      },
    ],

    quantityLimits: [],

    conditionalRequirements: [],

    referencedParagraphs: ["A4.2.3."],
  },
  "A10.13.": {
    paragraphId: "A10.13.",
    hazardClass: 6,
    subclass: ["6.1"],
    description: "UN3546, Articles containing toxic substance, N.O.S.",
    lastUpdated: new Date().toISOString(),
    entryType: "standard",
    materialTypes: ["articles_containing_toxic_substance"],

    packagingOptions: [
      {
        id: "A10.13.1.packaged_combination",
        type: "combination",
        description: "Packaged articles with inner receptacles and outer packagings",
        innerPackaging: {
          required: true,
          materials: ["Glass", "Metal", "Plastic"],
          description:
            "Receptacles constructed of suitable materials and secured in the article",
        },
        outerPackaging: {
          categories: [
            {
              type: "drums",
              subtype: "removable_head",
              containers: [
                { code: "1A2", material: "steel", description: "Steel drum removable head (1A2)" },
                { code: "1B2", material: "aluminum", description: "Aluminum drum removable head (1B2)" },
                { code: "1N2", material: "other_metal", description: "Other metal drum removable head (1N2)" },
                { code: "1D", material: "plywood", description: "Plywood drum (1D)" },
                { code: "1G", material: "fiber", description: "Fiber drum (1G)" },
                { code: "1H2", material: "plastic", description: "Plastic drum removable head (1H2)" },
              ],
            },
            {
              type: "boxes",
              subtype: "rigid_boxes",
              containers: [
                { code: "4A", material: "steel", description: "Steel box (4A)" },
                { code: "4B", material: "aluminum", description: "Aluminum box (4B)" },
                { code: "4C1", material: "natural_wood", description: "Natural wood box (4C1)" },
                { code: "4C2", material: "sift_proof_wood", description: "Natural wood sift-proof box (4C2)" },
                { code: "4D", material: "plywood", description: "Plywood box (4D)" },
                { code: "4F", material: "reconstituted_wood", description: "Reconstituted wood box (4F)" },
                { code: "4G", material: "fiberboard", description: "Fiberboard box (4G)" },
                { code: "4H1", material: "plastic", description: "Expanded plastic box (4H1)" },
                { code: "4H2", material: "plastic", description: "Solid plastic box (4H2)" },
                { code: "4N", material: "other_metal", description: "Other metal box (4N)" },
              ],
            },
            {
              type: "jerricans",
              subtype: "removable_head",
              containers: [
                { code: "3A2", material: "steel", description: "Steel jerrican removable head (3A2)" },
                { code: "3B2", material: "aluminum", description: "Aluminum jerrican removable head (3B2)" },
                { code: "3H2", material: "plastic", description: "Plastic jerrican removable head (3H2)" },
              ],
            },
          ],
        },
      },
      {
        id: "A10.13.2.strong_outer_packaging",
        type: "single",
        description: "Robust articles in strong outer packagings",
        innerPackaging: { required: false },
        outerPackaging: {
          categories: [
            {
              type: "specialized",
              subtype: "strong_outer_packaging",
              containers: [
                {
                  code: "STRONG_OUTER",
                  material: "various",
                  description: "Strong outer packaging providing adequate protection",
                },
              ],
            },
          ],
        },
      },
    ],

    specialRequirements: [
      {
        type: "handling",
        description:
          "Pack articles to prevent movement and inadvertent operation during transport",
        mandatory: true,
      },
      {
        type: "closure_orientation",
        description:
          "Inner receptacles containing liquids must be oriented correctly",
        mandatory: true,
      },
      {
        type: "handling",
        description:
          "Robust articles may be transported unpackaged or on pallets if equivalent protection is provided",
        mandatory: true,
      },
    ],

    packingGroupRestrictions: [],

    quantityLimits: [],

    conditionalRequirements: [],

    referencedParagraphs: ["A4.2.3."],
  },
  // A12.2 (Package Liquid Class 8 Materials)
    "A12.2.": {
      paragraphId: "A12.2.",
      hazardClass: 8,
      description: "Package Liquid Class 8 Materials",
      lastUpdated: new Date().toISOString(),
      entryType: "standard",
      materialTypes: ["corrosive_liquids"],

      packagingOptions: [
        {
          id: "A12.2.1.combination",
          type: "combination",
          description: "Combination packagings with outer drums, barrels, jerricans, or boxes",
          innerPackaging: {
            required: true,
            materials: [
              "Glass receptacles",
              "Earthenware receptacles",
              "Plastic receptacles",
              "Metal receptacles",
            ],
          },
          outerPackaging: {
            categories: [
              {
                type: "drums",
                containers: [
                  { code: "1A1", material: "steel", description: "Steel drum" },
                  { code: "1A2", material: "steel", description: "Steel drum" },
                  { code: "1B1", material: "aluminum", description: "Aluminum drum" },
                  { code: "1B2", material: "aluminum", description: "Aluminum drum" },
                  { code: "1D", material: "plywood", description: "Plywood drum" },
                  { code: "1G", material: "fiber", description: "Fiber drum" },
                  { code: "1H1", material: "plastic", description: "Plastic drum" },
                  { code: "1H2", material: "plastic", description: "Plastic drum" },
                  {
                    code: "1N1",
                    material: "other_metal",
                    description: "Metal other than steel or aluminum drum",
                  },
                  {
                    code: "1N2",
                    material: "other_metal",
                    description: "Metal other than steel or aluminum drum",
                  },
                ],
              },
              {
                type: "barrels",
                containers: [{ code: "2C2", material: "wood", description: "Wood barrel" }],
              },
              {
                type: "jerricans",
                containers: [
                  { code: "3A1", material: "steel", description: "Steel jerrican" },
                  { code: "3A2", material: "steel", description: "Steel jerrican" },
                  { code: "3B1", material: "aluminum", description: "Aluminum jerrican" },
                  { code: "3B2", material: "aluminum", description: "Aluminum jerrican" },
                  { code: "3H1", material: "plastic", description: "Plastic jerrican" },
                  { code: "3H2", material: "plastic", description: "Plastic jerrican" },
                ],
              },
              {
                type: "boxes",
                containers: [
                  { code: "4A", material: "steel", description: "Steel box" },
                  { code: "4B", material: "aluminum", description: "Aluminum box" },
                  { code: "4C1", material: "natural_wood", description: "Natural wood box" },
                  { code: "4C2", material: "natural_wood", description: "Natural wood box" },
                  { code: "4D", material: "plywood", description: "Plywood box" },
                  { code: "4F", material: "reconstituted_wood", description: "Reconstituted wood box" },
                  { code: "4G", material: "fiberboard", description: "Fiberboard box" },
                  { code: "4H1", material: "plastic", description: "Expanded plastic box" },
                  { code: "4H2", material: "plastic", description: "Solid plastic box" },
                  { code: "4N", material: "other_metal", description: "Other metal box" },
                ],
              },
            ],
          },
        },
        {
          id: "A12.2.2.single_packaging",
          type: "single",
          description: "Single packaging drums, barrels, or jerricans",
          innerPackaging: {
            required: false,
          },
          outerPackaging: {
            categories: [
              {
                type: "drums",
                containers: [
                  { code: "1A1", material: "steel", description: "Steel drum" },
                  { code: "1A2", material: "steel", description: "Steel drum" },
                  { code: "1B1", material: "aluminum", description: "Aluminum drum" },
                  { code: "1B2", material: "aluminum", description: "Aluminum drum" },
                  { code: "1G", material: "fiber", description: "Fiber drum with liner" },
                  { code: "1H1", material: "plastic", description: "Plastic drum" },
                  { code: "1H2", material: "plastic", description: "Plastic drum" },
                  {
                    code: "1N1",
                    material: "other_metal",
                    description: "Metal other than steel or aluminum drum",
                  },
                  {
                    code: "1N2",
                    material: "other_metal",
                    description: "Metal other than steel or aluminum drum",
                  },
                ],
              },
              {
                type: "barrels",
                containers: [{ code: "2C1", material: "wood", description: "Wood barrel" }],
              },
              {
                type: "jerricans",
                containers: [
                  { code: "3A1", material: "steel", description: "Steel jerrican" },
                  { code: "3A2", material: "steel", description: "Steel jerrican" },
                  { code: "3B1", material: "aluminum", description: "Aluminum jerrican" },
                  { code: "3B2", material: "aluminum", description: "Aluminum jerrican" },
                  { code: "3H1", material: "plastic", description: "Plastic jerrican" },
                  { code: "3H2", material: "plastic", description: "Plastic jerrican" },
                ],
              },
            ],
          },
        },
        {
          id: "A12.2.3.composite_plastic",
          type: "composite_plastic",
          description: "Composite packagings with plastic inner receptacles",
          innerPackaging: {
            required: true,
            materials: ["Plastic inner receptacles"],
          },
          outerPackaging: {
            categories: [
              {
                type: "composite_drum",
                containers: [
                  { code: "6HA1", material: "steel_plastic", description: "Steel drum" },
                  { code: "6HB1", material: "aluminum_plastic", description: "Aluminum drum" },
                  { code: "6HG1", material: "fiber_plastic", description: "Fiber drum" },
                  { code: "6HH1", material: "plastic_plastic", description: "Plastic drum" },
                  { code: "6HD1", material: "plywood_plastic", description: "Plywood drum" },
                ],
              },
              {
                type: "composite_box",
                containers: [
                  { code: "6HA2", material: "steel_plastic", description: "Steel box" },
                  { code: "6HB2", material: "aluminum_plastic", description: "Aluminum box" },
                  { code: "6HC", material: "wooden_plastic", description: "Wooden box" },
                  { code: "6HD2", material: "plywood_plastic", description: "Plywood box" },
                  { code: "6HG2", material: "fiberboard_plastic", description: "Fiberboard box" },
                ],
              },
            ],
          },
        },
        {
          id: "A12.2.4.composite_glass",
          type: "composite_glass",
          description: "Composite packagings with glass, porcelain, or stoneware inner receptacles",
          innerPackaging: {
            required: true,
            materials: ["Glass", "Porcelain", "Stoneware"],
          },
          outerPackaging: {
            categories: [
              {
                type: "composite_drum",
                containers: [
                  { code: "6PA1", material: "steel_glass", description: "Steel drum" },
                  { code: "6PB1", material: "aluminum_glass", description: "Aluminum drum" },
                  { code: "6PG1", material: "fiber_glass", description: "Fiber drum" },
                ],
              },
              {
                type: "composite_box",
                containers: [
                  { code: "6PA2", material: "steel_glass", description: "Steel box" },
                  { code: "6PB2", material: "aluminum_glass", description: "Aluminum box" },
                  { code: "6PC", material: "wooden_glass", description: "Wooden box" },
                  { code: "6PG2", material: "fiberboard_glass", description: "Fiberboard box" },
                ],
              },
              {
                type: "composite_plastic_packaging",
                containers: [
                  { code: "6PH1", material: "plastic_glass", description: "Expanded plastic packaging" },
                  { code: "6PH2", material: "plastic_glass", description: "Solid plastic packaging" },
                ],
              },
              {
                type: "composite_plywood",
                containers: [
                  { code: "6PD1", material: "plywood_glass", description: "Plywood drum" },
                  { code: "6PD2", material: "plywood_glass", description: "Wickerwork hamper" },
                ],
              },
            ],
          },
        },
        {
          id: "A12.2.5.cylinder",
          type: "cylinder",
          description: "DOT specification cylinders",
          innerPackaging: {
            required: false,
          },
          outerPackaging: {
            categories: [
              {
                type: "cylinders",
                subtype: "dot_specification",
                containers: [
                  {
                    code: "DOT_SPEC",
                    material: "metal",
                    description:
                      "DOT specification cylinders as prescribed for any compressed gas (except acetylene 8/8AL and DOT 3HT)",
                  },
                ],
              },
            ],
          },
        },
      ],

      packingGroupRestrictions: [],
      specialRequirements: [],
      quantityLimits: [],
      conditionalRequirements: [],
      referencedParagraphs: [
        "A12.2.",
        "A12.2.1.",
        "A12.2.2.",
        "A12.2.3.",
        "A12.2.4.",
        "A12.2.5.",
        "A20.3.",
      ],
    },

  // Phase 3, Week 13: Class 8 Corrosives Entry - A12.3 (Package Solid Class 8 Materials)
  "A12.3.": {
    paragraphId: "A12.3.",
    hazardClass: 8,
    description: "Package Solid Class 8 Materials as follows:",
    lastUpdated: new Date().toISOString(),
    entryType: "standard",
    materialTypes: ["corrosive_solids"],

    packagingOptions: [
      {
        id: "A12.3.1.combination",
        type: "combination",
        description: "Inner packages inside outer package for solid corrosives",
        innerPackaging: {
          required: true,
          materials: [
            "Glass receptacles",
            "Earthenware receptacles",
            "Plastic receptacles",
            "Metal receptacles",
          ],
        },
        outerPackaging: {
          categories: [
            {
              type: "drums",
              containers: [
                { code: "1A1", material: "steel", description: "Steel" },
                {
                  code: "1A2",
                  material: "steel",
                  description: "Removable head steel",
                },
                { code: "1B1", material: "aluminum", description: "Aluminum" },
                {
                  code: "1B2",
                  material: "aluminum",
                  description: "Removable head aluminum",
                },
                { code: "1D", material: "plywood", description: "Plywood" },
                { code: "1G", material: "fiber", description: "Fiber" },
                { code: "1H1", material: "plastic", description: "Plastic" },
                {
                  code: "1H2",
                  material: "plastic",
                  description: "Removable head plastic",
                },
                {
                  code: "1N1",
                  material: "other_metal",
                  description: "Metal other than steel or aluminum",
                },
                {
                  code: "1N2",
                  material: "other_metal",
                  description:
                    "Removable head metal other than steel or aluminum",
                },
              ],
            },
            {
              type: "barrels",
              containers: [
                { code: "2C2", material: "wood", description: "Wood barrel" },
              ],
            },
            {
              type: "jerricans",
              containers: [
                { code: "3A1", material: "steel", description: "Steel" },
                {
                  code: "3A2",
                  material: "steel",
                  description: "Removable head steel",
                },
                { code: "3B1", material: "aluminum", description: "Aluminum" },
                {
                  code: "3B2",
                  material: "aluminum",
                  description: "Removable head aluminum",
                },
                { code: "3H1", material: "plastic", description: "Plastic" },
                {
                  code: "3H2",
                  material: "plastic",
                  description: "Removable head plastic",
                },
              ],
            },
            {
              type: "boxes",
              containers: [
                { code: "4A", material: "steel", description: "Steel" },
                { code: "4B", material: "aluminum", description: "Aluminum" },
                {
                  code: "4C1",
                  material: "natural_wood",
                  description: "Natural wood",
                },
                {
                  code: "4C2",
                  material: "natural_wood",
                  description: "Sift-proof natural wood",
                },
                { code: "4D", material: "plywood", description: "Plywood" },
                {
                  code: "4F",
                  material: "reconstituted_wood",
                  description: "Reconstituted wood",
                },
                {
                  code: "4G",
                  material: "fiberboard",
                  description: "Fiberboard",
                },
                {
                  code: "4H2",
                  material: "plastic",
                  description: "Solid plastic box",
                },
                {
                  code: "4N",
                  material: "other_metal",
                  description: "Metal other than steel or aluminum",
                },
              ],
            },
          ],
        },
        isComplete: true,
      },
      {
        id: "A12.3.2.single_packaging",
        type: "single",
        description:
          "Single packaging drums, barrels, jerricans, boxes, or bags",
        innerPackaging: {
          required: false,
        },
        outerPackaging: {
          categories: [
            {
              type: "drums",
              containers: [
                { code: "1A1", material: "steel", description: "Steel" },
                {
                  code: "1A2",
                  material: "steel",
                  description: "Removable head steel",
                },
                { code: "1B1", material: "aluminum", description: "Aluminum" },
                {
                  code: "1B2",
                  material: "aluminum",
                  description: "Removable head aluminum",
                },
                {
                  code: "1D",
                  material: "plywood",
                  description: "Plywood",
                  // restrictions: ["Plywood (1D) is not authorized for PG I material."]
                },
                { code: "1H1", material: "plastic", description: "Plastic" },
                {
                  code: "1H2",
                  material: "plastic",
                  description: "Removable head plastic",
                },
                { code: "1G", material: "fiber", description: "Fiber" },
                {
                  code: "1N1",
                  material: "other_metal",
                  description: "Metal other than steel or aluminum",
                },
                {
                  code: "1N2",
                  material: "other_metal",
                  description:
                    "Removable head metal other than steel or aluminum",
                },
              ],
            },
            {
              type: "barrels",
              containers: [
                { code: "2C1", material: "wood", description: "Wood barrel" },
                { code: "2C2", material: "wood", description: "Wood barrel" },
              ],
              // restrictions: ["Wood barrels (2C1 or 2C2) not authorized for PG I material."]
            },
            {
              type: "jerricans",
              containers: [
                { code: "3A1", material: "steel", description: "Steel" },
                {
                  code: "3A2",
                  material: "steel",
                  description: "Removable head steel",
                },
                { code: "3B1", material: "aluminum", description: "Aluminum" },
                {
                  code: "3B2",
                  material: "aluminum",
                  description: "Removable head aluminum",
                },
                { code: "3H1", material: "plastic", description: "Plastic" },
                {
                  code: "3H2",
                  material: "plastic",
                  description: "Removable head plastic",
                },
              ],
            },
            {
              type: "boxes",
              containers: [
                {
                  code: "4A",
                  material: "steel",
                  description: "Steel or steel with liner",
                },
                {
                  code: "4B",
                  material: "aluminum",
                  description: "Aluminum or aluminum with liner",
                },
                {
                  code: "4C1",
                  material: "natural_wood",
                  description: "Natural wood",
                },
                {
                  code: "4C2",
                  material: "natural_wood",
                  description: "Sift-proof natural wood",
                },
                { code: "4D", material: "plywood", description: "Plywood" },
                {
                  code: "4F",
                  material: "reconstituted_wood",
                  description: "Reconstituted wood",
                },
                {
                  code: "4G",
                  material: "fiberboard",
                  description: "Fiberboard",
                },
                {
                  code: "4H1",
                  material: "plastic",
                  description: "Expanded plastic",
                },
                {
                  code: "4H2",
                  material: "plastic",
                  description: "Solid plastic",
                },
                {
                  code: "4N",
                  material: "other_metal",
                  description: "Metal other than steel or aluminum",
                },
              ],
              // restrictions: ["Steel (4A) without liner, aluminum (4B) without liner, natural wood (4C1), plywood (4D), reconstituted wood (4F), fiberboard (4G), expanded plastic (4H1), solid plastic (4H2) boxes not authorized for PG I material."]
            },
            {
              type: "bags",
              containers: [
                {
                  code: "5H1",
                  material: "plastic",
                  description: "Woven plastic",
                },
                {
                  code: "5H2",
                  material: "plastic",
                  description: "Woven plastic",
                },
                {
                  code: "5H3",
                  material: "plastic",
                  description: "Woven plastic",
                },
                {
                  code: "5H4",
                  material: "plastic",
                  description: "Plastic film",
                },
                { code: "5L1", material: "textile", description: "Textile" },
                { code: "5L2", material: "textile", description: "Textile" },
                { code: "5L3", material: "textile", description: "Textile" },
                {
                  code: "5M2",
                  material: "paper",
                  description: "Paper, multiwall, water-resistant",
                },
              ],
              // restrictions: ["Bags not authorized for PG I material."]
            },
          ],
        },
        isComplete: true,
      },
      {
        id: "A12.3.3.composite_plastic",
        type: "composite_plastic",
        description: "Composite packagings with plastic inner receptacles",
        innerPackaging: {
          required: true,
          materials: ["Plastic inner receptacles"],
        },
        outerPackaging: {
          categories: [
            {
              type: "composite_drum",
              containers: [
                {
                  code: "6HA1",
                  material: "steel_plastic",
                  description: "Steel drum with plastic inner",
                },
                {
                  code: "6HB1",
                  material: "aluminum_plastic",
                  description: "Aluminum drum with plastic inner",
                },
                {
                  code: "6HD1",
                  material: "plywood_plastic",
                  description: "Plywood drum with plastic inner",
                },
                {
                  code: "6HG1",
                  material: "fiber_plastic",
                  description: "Fiber drum with plastic inner",
                },
                {
                  code: "6HH1",
                  material: "plastic_plastic",
                  description: "Plastic drum with plastic inner",
                },
              ],
            },
            {
              type: "composite_box",
              containers: [
                {
                  code: "6HA2",
                  material: "steel_plastic",
                  description: "Steel box with plastic inner",
                },
                {
                  code: "6HB2",
                  material: "aluminum_plastic",
                  description: "Aluminum box with plastic inner",
                },
                {
                  code: "6HC",
                  material: "wooden_plastic",
                  description: "Wood box with plastic inner",
                },
                {
                  code: "6HD2",
                  material: "plywood_plastic",
                  description: "Plywood box with plastic inner",
                },
                {
                  code: "6HG2",
                  material: "fiberboard_plastic",
                  description: "Fiberboard box with plastic inner",
                },
              ],
              // restrictions: ["Boxes not authorized for PG I material."]
            },
          ],
        },
        isComplete: true,
      },
      {
        id: "A12.3.4.composite_glass",
        type: "composite_glass",
        description:
          "Composite packagings with glass, porcelain, or stoneware inner receptacles",
        innerPackaging: {
          required: true,
          materials: [
            "Glass inner receptacles",
            "Porcelain inner receptacles",
            "Stoneware inner receptacles",
          ],
        },
        outerPackaging: {
          categories: [
            {
              type: "composite_drum",
              containers: [
                {
                  code: "6PA1",
                  material: "steel_glass",
                  description:
                    "Steel drum with glass/porcelain/stoneware inner",
                },
                {
                  code: "6PB1",
                  material: "aluminum_glass",
                  description:
                    "Aluminum drum with glass/porcelain/stoneware inner",
                },
                {
                  code: "6PD1",
                  material: "plywood_glass",
                  description:
                    "Plywood drum with glass/porcelain/stoneware inner",
                },
                {
                  code: "6PG1",
                  material: "fiber_glass",
                  description:
                    "Fiber drum with glass/porcelain/stoneware inner",
                },
              ],
            },
            {
              type: "composite_box",
              containers: [
                {
                  code: "6PA2",
                  material: "steel_glass",
                  description: "Steel box with glass/porcelain/stoneware inner",
                },
                {
                  code: "6PB2",
                  material: "aluminum_glass",
                  description:
                    "Aluminum box with glass/porcelain/stoneware inner",
                },
                {
                  code: "6PC",
                  material: "wooden_glass",
                  description:
                    "Wooden box with glass/porcelain/stoneware inner",
                },
                {
                  code: "6PG2",
                  material: "fiberboard_glass",
                  description:
                    "Fiberboard box with glass/porcelain/stoneware inner",
                },
              ],
            },
            {
              type: "composite_plastic_packaging",
              containers: [
                {
                  code: "6PH1",
                  material: "plastic_glass",
                  description:
                    "Expanded plastic packaging with glass/porcelain/stoneware inner",
                },
                {
                  code: "6PH2",
                  material: "plastic_glass",
                  description:
                    "Solid plastic packaging with glass/porcelain/stoneware inner",
                },
              ],
            },
          ],
        },
        isComplete: true,
      },
      {
        id: "A12.3.5.cylinder",
        type: "cylinder",
        description: "DOT specification cylinders",
        innerPackaging: {
          required: false,
        },
        outerPackaging: {
          categories: [
            {
              type: "cylinders",
              containers: [
                {
                  code: "DOT",
                  material: "metal",
                  description:
                    "DOT specification cylinders as prescribed for any compressed gas, except those for acetylene (8, 8AL) and DOT 3HT",
                },
              ],
            },
          ],
        },
        isComplete: true,
      },
    ],

    specialRequirements: [
      {
        type: "plywood_drum_pgi_restriction",
        description: "Plywood (1D) drum not authorized for PG I material",
        mandatory: true,
        applicableContainers: ["A12.3.2.single_packaging"],
      },
      {
        type: "wood_barrel_pgi_restriction",
        description:
          "Wood barrels (2C1 or 2C2) not authorized for PG I material",
        mandatory: true,
        applicableContainers: ["A12.3.2.single_packaging"],
      },
      {
        type: "box_pgi_restriction",
        description:
          "Multiple box types not authorized for PG I material without proper lining",
        mandatory: true,
        applicableContainers: ["A12.3.2.single_packaging"],
      },
      {
        type: "bags_pgi_restriction",
        description: "Bags not authorized for PG I material",
        mandatory: true,
        applicableContainers: ["A12.3.2.single_packaging"],
      },
      {
        type: "composite_boxes_pgi_restriction",
        description: "Composite boxes not authorized for PG I material",
        mandatory: true,
        applicableContainers: ["A12.3.3.composite_plastic"],
      },
      {
        type: "cylinder_restrictions",
        description:
          "DOT specification cylinders except those for acetylene (8, 8AL) and DOT 3HT",
        mandatory: true,
        applicableContainers: ["A12.3.5.cylinder"],
      },
    ],

    quantityLimits: [
      {
        packingGroup: "I",
        scope: "per_package",
        value: "",
        unit: "kg",
        description:
          "No specific weight limits for PG I solid corrosives in authorized packaging",
      },
      {
        packingGroup: "II",
        scope: "per_package",
        value: "",
        unit: "kg",
        description:
          "No specific weight limits for PG II solid corrosives in authorized packaging",
      },
      {
        packingGroup: "III",
        scope: "per_package",
        value: "",
        unit: "kg",
        description:
          "No specific weight limits for PG III solid corrosives in authorized packaging",
      },
    ],

    conditionalRequirements: [
      {
        condition: "packing_group='I'",
        requirements: [
          {
            type: "plywood_drum_prohibition",
            description: "Plywood (1D) drums not authorized for PG I material",
            mandatory: true,
            applicableContainers: ["A12.3.2.single_packaging"],
          },
          {
            type: "wood_barrel_prohibition",
            description:
              "Wood barrels (2C1, 2C2) not authorized for PG I material",
            mandatory: true,
            applicableContainers: ["A12.3.2.single_packaging"],
          },
          {
            type: "box_liner_requirement",
            description:
              "Steel and aluminum boxes require liner for PG I material; other box types not authorized",
            mandatory: true,
            applicableContainers: ["A12.3.2.single_packaging"],
          },
          {
            type: "bags_prohibition",
            description: "Bags not authorized for PG I material",
            mandatory: true,
            applicableContainers: ["A12.3.2.single_packaging"],
          },
          {
            type: "composite_boxes_prohibition",
            description: "Composite boxes not authorized for PG I material",
            mandatory: true,
            applicableContainers: ["A12.3.3.composite_plastic"],
          },
        ],
      },
      {
        condition: "packing_group='II' OR packing_group='III'",
        requirements: [
          {
            type: "expanded_packaging_authorization",
            description:
              "Additional packaging options authorized for PG II and III materials including bags and various box types",
            mandatory: false,
            applicableContainers: [
              "A12.3.2.single_packaging",
              "A12.3.3.composite_plastic",
            ],
          },
        ],
      },
      {
        condition: "material_state='solid'",
        requirements: [
          {
            type: "sift_proof_requirement",
            description:
              "Ensure packaging is appropriate for solid materials and prevents sifting where applicable",
            mandatory: true,
            applicableContainers: [
              "A12.3.1.combination",
              "A12.3.2.single_packaging",
              "A12.3.3.composite_plastic",
              "A12.3.4.composite_glass",
            ],
          },
        ],
      },
    ],

    referencedParagraphs: [
      "A12.3.",
      "A12.3.1.",
      "A12.3.2.",
      "A12.3.3.",
      "A12.3.4.",
      "A12.3.5.",
    ],
  },

  // Phase 3, Week 13: Class 8 Corrosives Entry - A12.4 (Package Batteries, Wet, Filled with Acid; Batteries, Wet, Filled with Alkali; or Batteries, Wet, Non-spillable)
  "A12.4.": {
    paragraphId: "A12.4.",
    hazardClass: 8,
    description:
      "Package Batteries, Wet, Filled with Acid; Batteries, Wet, Filled with Alkali; or Batteries, Wet, Non-spillable as follows:",
    lastUpdated: new Date().toISOString(),
    entryType: "specialized",
    materialTypes: [
      "batteries_wet_acid",
      "batteries_wet_alkali",
      "batteries_non_spillable",
    ],

    packagingOptions: [
      {
        id: "A12.4.2.batteries_without_other_materials",
        type: "single",
        description:
          "Batteries packed without other materials in boxes, drums, or jerricans",
        innerPackaging: {
          required: false,
        },
        outerPackaging: {
          categories: [
            {
              type: "boxes",
              containers: [
                {
                  code: "4C1",
                  material: "natural_wood",
                  description: "Natural wood box",
                },
                {
                  code: "4C2",
                  material: "natural_wood",
                  description: "Sift-proof natural wood box",
                },
                { code: "4D", material: "plywood", description: "Plywood box" },
                {
                  code: "4F",
                  material: "reconstituted_wood",
                  description: "Reconstituted wood box",
                },
                {
                  code: "4G",
                  material: "fiberboard",
                  description: "Fiberboard box",
                },
                {
                  code: "4H2",
                  material: "plastic",
                  description: "Solid plastic box",
                },
              ],
            },
            {
              type: "drums",
              containers: [
                {
                  code: "1D",
                  material: "plywood",
                  description: "Plywood drum",
                },
                { code: "1G", material: "fiber", description: "Fiber drum" },
                {
                  code: "1H2",
                  material: "plastic",
                  description: "Plastic drum",
                },
              ],
            },
            {
              type: "jerricans",
              containers: [
                {
                  code: "3H2",
                  material: "plastic",
                  description: "Plastic jerrican",
                },
              ],
            },
          ],
        },
        notes: ["All outer packagings must meet PG II performance standards"],
        isComplete: true,
      },
      {
        id: "A12.4.3.non_spillable_batteries",
        type: "specialized",
        description: "Non-spillable batteries in strong outer packagings",
        innerPackaging: {
          required: false,
        },
        outerPackaging: {
          categories: [
            {
              type: "strong_packaging",
              containers: [
                {
                  code: "STRONG",
                  material: "various",
                  description:
                    "Strong outer packagings meeting vibration and pressure differential tests per 49 CFR 173.159(f)",
                },
              ],
            },
          ],
        },
        notes: [
          "Must withstand vibration and pressure differential tests specified in 49 CFR 173.159(f)",
          "Batteries meeting Special Provision A67 are considered dry and not subject to other requirements",
        ],
        isComplete: true,
      },
      {
        id: "A12.4.4.1.electrolyte_glass_receptacles",
        type: "combination",
        description:
          "Electrolyte, acid, or alkali corrosive battery fluid packed with storage batteries - glass inner receptacles",
        innerPackaging: {
          required: true,
          materials: ["Glass receptacles"],
          specialRequirements: [
            "Glass receptacles not over 4.0 L (1 gallon) capacity each",
          ],
        },
        outerPackaging: {
          categories: [
            {
              type: "boxes",
              containers: [
                {
                  code: "4C1",
                  material: "natural_wood",
                  description: "Natural wood box",
                },
                {
                  code: "4C2",
                  material: "natural_wood",
                  description: "Sift-proof natural wood box",
                },
                { code: "4D", material: "plywood", description: "Plywood box" },
                {
                  code: "4F",
                  material: "reconstituted_wood",
                  description: "Reconstituted wood box",
                },
              ],
            },
          ],
        },
        notes: [
          "Maximum quantity is 8.0 L (2 gallons) each",
          "Cushion and separate the inside containers from batteries by a strong solid wooden partition",
        ],
        isComplete: true,
      },
      {
        id: "A12.4.4.2.electrolyte_plastic_bottles",
        type: "combination",
        description:
          "Electrolyte, acid, or alkali corrosive battery fluid packed with storage batteries - plastic inner bottles",
        innerPackaging: {
          required: true,
          materials: ["Plastic bottles"],
          specialRequirements: [
            "Plastic bottles not over 1 L (1 quart) capacity each",
          ],
        },
        outerPackaging: {
          categories: [
            {
              type: "boxes",
              containers: [
                {
                  code: "4C1",
                  material: "natural_wood",
                  description: "Natural wood box",
                },
                {
                  code: "4C2",
                  material: "natural_wood",
                  description: "Sift-proof natural wood box",
                },
                { code: "4D", material: "plywood", description: "Plywood box" },
                {
                  code: "4F",
                  material: "reconstituted_wood",
                  description: "Reconstituted wood box",
                },
              ],
            },
          ],
        },
        notes: [
          "Pack no more than 24 bottles",
          "Securely separated from storage batteries and filling kits in each package",
        ],
        isComplete: true,
      },
      {
        id: "A12.4.4.3.dry_batteries_electrolyte",
        type: "combination",
        description:
          "Dry storage batteries or battery charger devices with inner receptacles containing battery fluid",
        innerPackaging: {
          required: true,
          materials: ["Various"],
          specialRequirements: [
            "Inner receptacles containing battery fluid",
            "Pack no more than 12 inner receptacles in one outer box",
          ],
        },
        outerPackaging: {
          categories: [
            {
              type: "boxes",
              containers: [
                {
                  code: "4G",
                  material: "fiberboard",
                  description: "Fiberboard box",
                },
              ],
            },
          ],
        },
        notes: [
          "Complete package conforms to PG III requirements",
          "Maximum authorized gross weight is 34 kg (75 pounds)",
        ],
        isComplete: true,
      },
      {
        id: "A12.4.5.domestic_only_batteries",
        type: "specialized",
        description:
          "Batteries packed without other materials (Domestic Shipments Only)",
        innerPackaging: {
          required: false,
        },
        outerPackaging: {
          categories: [
            {
              type: "non_specification_packaging",
              containers: [
                {
                  code: "DOMESTIC_1",
                  material: "various",
                  description:
                    "One to three batteries of not over 11.3 kg (25 pounds) each, packed in an outside box. Gross weight may not exceed 34 kg (75 pounds).",
                },
                {
                  code: "DOMESTIC_2",
                  material: "various",
                  description:
                    "Maximum of four batteries not over 7 kg (15 pounds) each in strong outside fiberboard or wooden boxes. Gross weight may not be over 30 kg (65 pounds).",
                },
                {
                  code: "DOMESTIC_3",
                  material: "various",
                  description:
                    "Maximum of five batteries not over 4.5 kg (10 pounds) each in outside fiberboard or wooden box. Gross weight may not exceed 30 kg (65 pounds).",
                },
                {
                  code: "DOMESTIC_4",
                  material: "various",
                  description:
                    "Single batteries not over 34 kg (75 pounds) each, packed in five-sided slipcovers or completely closed fiberboard boxes.",
                },
                {
                  code: "DOMESTIC_5",
                  material: "various",
                  description:
                    "Single batteries exceeding 34 kg (75 pounds) each in completely closed fiberboard boxes. Maximum authorized gross weight is 91 kg (200 pounds).",
                },
                {
                  code: "DOMESTIC_6",
                  material: "various",
                  description:
                    "Large electric storage batteries protected against short circuit and firmly secured to skids or pallets.",
                },
              ],
            },
          ],
        },
        notes: [
          "Domestic shipments only",
          "Various weight and quantity restrictions apply",
        ],
        isComplete: true,
      },
    ],

    specialRequirements: [
      {
        type: "heat_evolution_prevention",
        description: "Package to prevent a dangerous evolution of heat",
        mandatory: true,
        applicableContainers: [
          "A12.4.2.batteries_without_other_materials",
          "A12.4.3.non_spillable_batteries",
          "A12.4.4.1.electrolyte_glass_receptacles",
          "A12.4.4.2.electrolyte_plastic_bottles",
          "A12.4.4.3.dry_batteries_electrolyte",
        ],
      },
      {
        type: "short_circuit_protection",
        description:
          "Completely protect against short circuit with electrically nonconductive material and securely cushion electric storage batteries containing electrolyte acid or alkali corrosive battery fluid within the outer container",
        mandatory: true,
        applicableContainers: [
          "A12.4.2.batteries_without_other_materials",
          "A12.4.3.non_spillable_batteries",
          "A12.4.5.domestic_only_batteries",
        ],
      },
      {
        type: "battery_separation",
        description:
          "Separate batteries and battery-powered devices in a manner to prevent contact with other batteries or devices with electrically conductive materials",
        mandatory: true,
        applicableContainers: [
          "A12.4.2.batteries_without_other_materials",
          "A12.4.3.non_spillable_batteries",
          "A12.4.5.domestic_only_batteries",
        ],
      },
      {
        type: "acid_alkali_proof_liner",
        description:
          "Place batteries inside an acid or alkali-proof liner (not mandatory for nonspillable batteries), adequately sealed to prevent leakage in the event of a spill",
        mandatory: true,
        applicableContainers: ["A12.4.2.batteries_without_other_materials"],
      },
      {
        type: "upward_fill_openings",
        description:
          "Pack batteries so that the fill openings or vents, if any, are upward",
        mandatory: true,
        applicableContainers: [
          "A12.4.2.batteries_without_other_materials",
          "A12.4.3.non_spillable_batteries",
          "A12.4.5.domestic_only_batteries",
        ],
      },
      {
        type: "no_other_articles",
        description:
          "Do not pack with other articles unless authorized by a specific packaging paragraph",
        mandatory: true,
        applicableContainers: [
          "A12.4.2.batteries_without_other_materials",
          "A12.4.3.non_spillable_batteries",
        ],
      },
      {
        type: "searchlight_exception",
        description:
          "Batteries may be packed with portable searchlights, battery parts, or hydrometers, if properly cushioned and securely packed in a separate container",
        mandatory: false,
        applicableContainers: [
          "A12.4.2.batteries_without_other_materials",
          "A12.4.3.non_spillable_batteries",
        ],
      },
      {
        type: "pg_ii_performance_standard",
        description:
          "All outer packagings must meet PG II performance standards",
        mandatory: true,
        applicableContainers: ["A12.4.2.batteries_without_other_materials"],
      },
      {
        type: "vibration_pressure_test",
        description:
          "Non-spillable batteries must withstand without leakage the vibration and pressure differential tests specified in 49 CFR 173.159(f)",
        mandatory: true,
        applicableContainers: ["A12.4.3.non_spillable_batteries"],
      },
      {
        type: "wooden_partition_separation",
        description:
          "Cushion and separate the inside containers from batteries by a strong solid wooden partition",
        mandatory: true,
        applicableContainers: [
          "A12.4.4.1.electrolyte_glass_receptacles",
          "A12.4.4.2.electrolyte_plastic_bottles",
        ],
      },
    ],

    quantityLimits: [
      {
        packingGroup: "II",
        scope: "per_package",
        value: 8.0,
        unit: "L",
        description:
          "Maximum quantity for glass receptacles containing electrolyte - 8.0 L (2 gallons) each",
      },
      {
        packingGroup: "II",
        scope: "per_inner",
        value: 4.0,
        unit: "L",
        description:
          "Glass receptacles not over 4.0 L (1 gallon) capacity each",
      },
      {
        packingGroup: "II",
        scope: "per_inner",
        value: 1.0,
        unit: "L",
        description: "Plastic bottles not over 1 L (1 quart) capacity each",
      },
      {
        packingGroup: "II",
        scope: "per_package",
        value: 24,
        unit: "pieces",
        description: "Pack no more than 24 plastic bottles per package",
      },
      {
        packingGroup: "III",
        scope: "per_package",
        value: 12,
        unit: "pieces",
        description:
          "Pack no more than 12 inner receptacles in one outer box for dry batteries with electrolyte",
      },
      {
        packingGroup: "III",
        scope: "per_package",
        value: 34,
        unit: "kg",
        description:
          "Maximum authorized gross weight for dry batteries with electrolyte is 34 kg (75 pounds)",
      },
    ],

    conditionalRequirements: [
      {
        condition: "battery_type='non_spillable'",
        requirements: [
          {
            type: "vibration_test_requirement",
            description:
              "Must withstand vibration and pressure differential tests per 49 CFR 173.159(f)",
            mandatory: true,
            applicableContainers: ["A12.4.3.non_spillable_batteries"],
          },
          {
            type: "acid_alkali_liner_exemption",
            description:
              "Acid or alkali-proof liner not mandatory for nonspillable batteries",
            mandatory: false,
            applicableContainers: ["A12.4.3.non_spillable_batteries"],
          },
          {
            type: "special_provision_a67",
            description:
              "Batteries meeting Special Provision A67 are considered dry and are not subject to any other requirements of this manual",
            mandatory: false,
            applicableContainers: ["A12.4.3.non_spillable_batteries"],
          },
        ],
      },
      {
        condition: "electrolyte_packed_with_batteries=true",
        requirements: [
          {
            type: "glass_receptacle_limit",
            description:
              "Glass receptacles not over 4.0 L (1 gallon) capacity each, maximum 8.0 L (2 gallons) total",
            mandatory: true,
            applicableContainers: ["A12.4.4.1.electrolyte_glass_receptacles"],
          },
          {
            type: "plastic_bottle_limit",
            description:
              "Plastic bottles not over 1 L (1 quart) capacity each, maximum 24 bottles",
            mandatory: true,
            applicableContainers: ["A12.4.4.2.electrolyte_plastic_bottles"],
          },
          {
            type: "wooden_partition_mandatory",
            description:
              "Strong solid wooden partition required to separate containers from batteries",
            mandatory: true,
            applicableContainers: [
              "A12.4.4.1.electrolyte_glass_receptacles",
              "A12.4.4.2.electrolyte_plastic_bottles",
            ],
          },
        ],
      },
      {
        condition: "shipment_type='domestic_only'",
        requirements: [
          {
            type: "domestic_weight_restrictions",
            description:
              "Various weight and quantity restrictions apply for domestic-only battery shipments",
            mandatory: true,
            applicableContainers: ["A12.4.5.domestic_only_batteries"],
          },
          {
            type: "short_circuit_prevention_domestic",
            description:
              "Cushion and pack to prevent short circuits for domestic shipments",
            mandatory: true,
            applicableContainers: ["A12.4.5.domestic_only_batteries"],
          },
        ],
      },
      {
        condition: "dry_batteries_with_electrolyte=true",
        requirements: [
          {
            type: "pg_iii_conformance",
            description: "Complete package conforms to PG III requirements",
            mandatory: true,
            applicableContainers: ["A12.4.4.3.dry_batteries_electrolyte"],
          },
          {
            type: "inner_receptacle_limit",
            description:
              "Pack no more than 12 inner receptacles in one outer box",
            mandatory: true,
            applicableContainers: ["A12.4.4.3.dry_batteries_electrolyte"],
          },
          {
            type: "gross_weight_limit",
            description: "Maximum authorized gross weight is 34 kg (75 pounds)",
            mandatory: true,
            applicableContainers: ["A12.4.4.3.dry_batteries_electrolyte"],
          },
        ],
      },
    ],

    referencedParagraphs: [
      "A12.4.",
      "A12.4.1.",
      "A12.4.2.",
      "A12.4.3.",
      "A12.4.4.",
      "A12.4.4.1.",
      "A12.4.4.2.",
      "A12.4.4.3.",
      "A12.4.5.",
      "49 CFR 173.159(f)",
      "Special Provision A67",
    ],
  },

  // Phase 3, Week 13: Class 8 Corrosives Entry - A12.5 (Package Bombs, Smoke, Nonexplosive)
  "A12.5.": {
    paragraphId: "A12.5.",
    hazardClass: 8,
    description:
      "Package Bombs, Smoke, Nonexplosive as follows: Ship bombs, smoke, nonexplosive provided they are without ignition elements, bursting charges, detonating fuses, or other explosive components. Packaging meeting PG II performance standard is required.",
    lastUpdated: new Date().toISOString(),
    entryType: "specialized",
    materialTypes: ["smoke_bombs_nonexplosive"],

    packagingOptions: [
      {
        id: "A12.5.boxes",
        type: "single",
        description:
          "Single packaging in boxes meeting PG II performance standard",
        innerPackaging: {
          required: false,
        },
        outerPackaging: {
          categories: [
            {
              type: "boxes",
              containers: [
                { code: "4A", material: "steel", description: "Steel box" },
                {
                  code: "4B",
                  material: "aluminum",
                  description: "Aluminum box",
                },
                {
                  code: "4C1",
                  material: "natural_wood",
                  description: "Natural wood box",
                },
                {
                  code: "4C2",
                  material: "natural_wood",
                  description: "Sift-proof natural wood box",
                },
                { code: "4D", material: "plywood", description: "Plywood box" },
                {
                  code: "4F",
                  material: "reconstituted_wood",
                  description: "Reconstituted wood box",
                },
                {
                  code: "4G",
                  material: "fiberboard",
                  description: "Fiberboard box",
                },
                {
                  code: "4H2",
                  material: "plastic",
                  description: "Solid plastic box",
                },
                {
                  code: "4N",
                  material: "other_metal",
                  description: "Other metal box",
                },
              ],
            },
          ],
        },
        isComplete: true,
      },
      {
        id: "A12.5.drums",
        type: "single",
        description:
          "Single packaging in drums meeting PG II performance standard",
        innerPackaging: {
          required: false,
        },
        outerPackaging: {
          categories: [
            {
              type: "drums",
              containers: [
                {
                  code: "1A2",
                  material: "steel",
                  description: "Removable head steel drum",
                },
                {
                  code: "1B2",
                  material: "aluminum",
                  description: "Removable head aluminum drum",
                },
                {
                  code: "1D",
                  material: "plywood",
                  description: "Plywood drum",
                },
                { code: "1G", material: "fiber", description: "Fiber drum" },
                {
                  code: "1H2",
                  material: "plastic",
                  description: "Removable head plastic drum",
                },
                {
                  code: "1N2",
                  material: "other_metal",
                  description:
                    "Removable head metal drum other than steel or aluminum",
                },
              ],
            },
          ],
        },
        isComplete: true,
      },
    ],

    specialRequirements: [
      {
        type: "nonexplosive_components_only",
        description:
          "Ship bombs, smoke, nonexplosive provided they are without ignition elements, bursting charges, detonating fuses, or other explosive components",
        mandatory: true,
        applicableContainers: ["A12.5.boxes", "A12.5.drums"],
      },
      {
        type: "pg_ii_performance_standard",
        description: "Packaging meeting PG II performance standard is required",
        mandatory: true,
        applicableContainers: ["A12.5.boxes", "A12.5.drums"],
      },
      {
        type: "no_ignition_elements",
        description: "Must be without ignition elements",
        mandatory: true,
        applicableContainers: ["A12.5.boxes", "A12.5.drums"],
      },
      {
        type: "no_bursting_charges",
        description: "Must be without bursting charges",
        mandatory: true,
        applicableContainers: ["A12.5.boxes", "A12.5.drums"],
      },
      {
        type: "no_detonating_fuses",
        description: "Must be without detonating fuses",
        mandatory: true,
        applicableContainers: ["A12.5.boxes", "A12.5.drums"],
      },
      {
        type: "no_explosive_components",
        description: "Must be without other explosive components",
        mandatory: true,
        applicableContainers: ["A12.5.boxes", "A12.5.drums"],
      },
    ],

    quantityLimits: [
      {
        packingGroup: "II",
        scope: "per_package",
        value: "",
        unit: "kg",
        description:
          "No specific weight limits specified for nonexplosive smoke bombs in authorized packaging",
      },
    ],

    conditionalRequirements: [
      {
        condition: "explosive_components_present=true",
        requirements: [
          {
            type: "shipment_prohibition",
            description:
              "Shipment prohibited if ignition elements, bursting charges, detonating fuses, or other explosive components are present",
            mandatory: true,
            applicableContainers: ["A12.5.boxes", "A12.5.drums"],
          },
        ],
      },
      {
        condition: "packaging_performance='PG_II'",
        requirements: [
          {
            type: "performance_standard_compliance",
            description: "All packaging must meet PG II performance standards",
            mandatory: true,
            applicableContainers: ["A12.5.boxes", "A12.5.drums"],
          },
        ],
      },
      {
        condition: "material_type='smoke_bombs_nonexplosive'",
        requirements: [
          {
            type: "nonexplosive_verification",
            description:
              "Verify smoke bombs are completely nonexplosive before packaging",
            mandatory: true,
            applicableContainers: ["A12.5.boxes", "A12.5.drums"],
          },
        ],
      },
    ],

    referencedParagraphs: ["A12.5."],
  },

  // Phase 3, Week 13: Class 8 Corrosives Entry - A12.6 (UN3547, Articles containing corrosive substance, N.O.S.)
  "A12.6.": {
    paragraphId: "A12.6.",
    hazardClass: 8,
    description:
      "UN3547, Articles containing corrosive substance, N.O.S. are authorized when classified per paragraph A4.2.3., maximum net quantity per package 30 L for liquids and 50 kg for solids, when packaged, or unpackaged as follows:",
    lastUpdated: new Date().toISOString(),
    entryType: "specialized",
    materialTypes: ["articles_containing_corrosive_substance"],

    packagingOptions: [
      {
        id: "A12.6.1.packaged_articles",
        type: "combination",
        description:
          "Articles packaged in outer packaging with proper receptacles",
        innerPackaging: {
          required: true,
          materials: ["Various"],
          specialRequirements: [
            "Receptacles constructed of suitable materials and secured in the article in such a way that, under normal conditions of transport, they cannot break, be punctured or leak their contents into the article itself or the outer packaging",
          ],
        },
        outerPackaging: {
          categories: [
            {
              type: "drums",
              containers: [
                {
                  code: "1A2",
                  material: "steel",
                  description: "Removable head steel drum",
                },
                {
                  code: "1B2",
                  material: "aluminum",
                  description: "Removable head aluminum drum",
                },
                {
                  code: "1N2",
                  material: "other_metal",
                  description:
                    "Removable head metal drum other than steel or aluminum",
                },
                {
                  code: "1D",
                  material: "plywood",
                  description: "Plywood drum",
                },
                { code: "1G", material: "fiber", description: "Fiber drum" },
                {
                  code: "1H2",
                  material: "plastic",
                  description: "Removable head plastic drum",
                },
              ],
            },
            {
              type: "boxes",
              containers: [
                { code: "4A", material: "steel", description: "Steel box" },
                {
                  code: "4B",
                  material: "aluminum",
                  description: "Aluminum box",
                },
                {
                  code: "4C1",
                  material: "natural_wood",
                  description: "Ordinary natural wood box",
                },
                {
                  code: "4C2",
                  material: "natural_wood",
                  description: "Sift-proof natural wood box",
                },
                { code: "4D", material: "plywood", description: "Plywood box" },
                {
                  code: "4F",
                  material: "reconstituted_wood",
                  description: "Reconstituted wood box",
                },
                {
                  code: "4G",
                  material: "fiberboard",
                  description: "Fiberboard box",
                },
                {
                  code: "4H1",
                  material: "plastic",
                  description: "Expanded plastic box",
                },
                {
                  code: "4H2",
                  material: "plastic",
                  description: "Solid plastic box",
                },
                {
                  code: "4N",
                  material: "other_metal",
                  description: "Other metal box",
                },
              ],
            },
            {
              type: "jerricans",
              containers: [
                {
                  code: "3A2",
                  material: "steel",
                  description: "Removable head steel jerrican",
                },
                {
                  code: "3H2",
                  material: "plastic",
                  description: "Plastic removable head jerrican",
                },
                {
                  code: "3B2",
                  material: "aluminum",
                  description: "Aluminum removable head jerrican",
                },
              ],
            },
          ],
        },
        isComplete: true,
      },
      {
        id: "A12.6.2.1.robust_articles_strong_packaging",
        type: "specialized",
        description: "Robust articles in strong outer packagings",
        innerPackaging: {
          required: false,
        },
        outerPackaging: {
          categories: [
            {
              type: "strong_packaging",
              containers: [
                {
                  code: "STRONG",
                  material: "various",
                  description:
                    "Strong outer packagings constructed of suitable material and of adequate strength and design in relation to the packaging capacity and its intended use",
                },
              ],
            },
          ],
        },
        isComplete: true,
      },
      {
        id: "A12.6.2.2.robust_articles_unpackaged",
        type: "specialized",
        description: "Robust articles transported unpackaged or on pallets",
        innerPackaging: {
          required: false,
        },
        outerPackaging: {
          categories: [
            {
              type: "unpackaged_or_pallets",
              containers: [
                {
                  code: "UNPACKAGED",
                  material: "none",
                  description:
                    "Unpackaged transport when dangerous goods are afforded equivalent protection by the article in which they are contained",
                },
                {
                  code: "PALLET",
                  material: "various",
                  description:
                    "Transport on pallets when dangerous goods are afforded equivalent protection by the article in which they are contained",
                },
              ],
            },
          ],
        },
        isComplete: true,
      },
    ],

    specialRequirements: [
      {
        type: "classification_requirement",
        description: "Must be classified per paragraph A4.2.3",
        mandatory: true,
        applicableContainers: [
          "A12.6.1.packaged_articles",
          "A12.6.2.1.robust_articles_strong_packaging",
          "A12.6.2.2.robust_articles_unpackaged",
        ],
      },
      {
        type: "pg_ii_performance_standard",
        description:
          "Packagings meeting PG II performance standard is required when packaged",
        mandatory: true,
        applicableContainers: ["A12.6.1.packaged_articles"],
      },
      {
        type: "article_movement_prevention",
        description:
          "Pack articles to prevent movement and inadvertent operation during normal conditions of transport",
        mandatory: true,
        applicableContainers: ["A12.6.1.packaged_articles"],
      },
      {
        type: "liquid_closure_orientation",
        description:
          "Pack inner receptacles containing liquids with closures in outer packagings with their closures correctly oriented",
        mandatory: true,
        applicableContainers: ["A12.6.1.packaged_articles"],
      },
      {
        type: "article_enclosure_requirement",
        description:
          "Where there is no receptacle within the article, ensure the article fully encloses the dangerous goods and prevent their release under normal conditions of transport",
        mandatory: true,
        applicableContainers: ["A12.6.1.packaged_articles"],
      },
      {
        type: "suitable_material_construction",
        description:
          "Receptacles constructed of suitable materials and secured in article to prevent breakage, puncture, or leakage under normal transport conditions",
        mandatory: true,
        applicableContainers: ["A12.6.1.packaged_articles"],
      },
      {
        type: "strong_packaging_suitability",
        description:
          "Strong outer packagings must be constructed of suitable material and of adequate strength and design in relation to packaging capacity and intended use",
        mandatory: true,
        applicableContainers: ["A12.6.2.1.robust_articles_strong_packaging"],
      },
      {
        type: "equivalent_protection_requirement",
        description:
          "Dangerous goods must be afforded equivalent protection by the article in which they are contained when transported unpackaged or on pallets",
        mandatory: true,
        applicableContainers: ["A12.6.2.2.robust_articles_unpackaged"],
      },
    ],

    quantityLimits: [
      {
        packingGroup: "II",
        scope: "per_package",
        value: 30,
        unit: "L",
        description: "Maximum net quantity per package 30 L for liquids",
      },
      {
        packingGroup: "II",
        scope: "per_package",
        value: 50,
        unit: "kg",
        description: "Maximum net quantity per package 50 kg for solids",
      },
    ],

    conditionalRequirements: [
      {
        condition: "packaging_required=true",
        requirements: [
          {
            type: "pg_ii_compliance",
            description:
              "Packagings meeting PG II performance standard required when articles are packaged",
            mandatory: true,
            applicableContainers: ["A12.6.1.packaged_articles"],
          },
          {
            type: "movement_prevention",
            description:
              "Articles must be packed to prevent movement and inadvertent operation",
            mandatory: true,
            applicableContainers: ["A12.6.1.packaged_articles"],
          },
          {
            type: "closure_orientation",
            description:
              "Inner receptacles containing liquids must have closures correctly oriented in outer packaging",
            mandatory: true,
            applicableContainers: ["A12.6.1.packaged_articles"],
          },
        ],
      },
      {
        condition: "article_type='robust'",
        requirements: [
          {
            type: "strong_packaging_option",
            description:
              "Robust articles may be transported in strong outer packagings",
            mandatory: false,
            applicableContainers: [
              "A12.6.2.1.robust_articles_strong_packaging",
            ],
          },
          {
            type: "unpackaged_option",
            description:
              "Robust articles may be transported unpackaged or on pallets when dangerous goods are afforded equivalent protection",
            mandatory: false,
            applicableContainers: ["A12.6.2.2.robust_articles_unpackaged"],
          },
        ],
      },
      {
        condition: "material_state='liquid'",
        requirements: [
          {
            type: "liquid_quantity_limit",
            description: "Maximum net quantity per package 30 L for liquids",
            mandatory: true,
            applicableContainers: [
              "A12.6.1.packaged_articles",
              "A12.6.2.1.robust_articles_strong_packaging",
            ],
          },
          {
            type: "closure_orientation_mandatory",
            description:
              "Closures must be correctly oriented for liquid-containing receptacles",
            mandatory: true,
            applicableContainers: ["A12.6.1.packaged_articles"],
          },
        ],
      },
      {
        condition: "material_state='solid'",
        requirements: [
          {
            type: "solid_quantity_limit",
            description: "Maximum net quantity per package 50 kg for solids",
            mandatory: true,
            applicableContainers: [
              "A12.6.1.packaged_articles",
              "A12.6.2.1.robust_articles_strong_packaging",
            ],
          },
        ],
      },
      {
        condition: "no_internal_receptacle=true",
        requirements: [
          {
            type: "article_enclosure_mandatory",
            description:
              "Article must fully enclose dangerous goods and prevent their release under normal conditions",
            mandatory: true,
            applicableContainers: ["A12.6.1.packaged_articles"],
          },
        ],
      },
    ],

    referencedParagraphs: [
      "A12.6.",
      "A12.6.1.",
      "A12.6.1.1.",
      "A12.6.1.2.",
      "A12.6.1.3.",
      "A12.6.2.",
      "A12.6.2.1.",
      "A12.6.2.2.",
      "A4.2.3.",
    ],
  },

 // A12.7 (Package Gallium)
"A12.7.": {
      paragraphId: "A12.7.",
      hazardClass: 8,
      description: "Package Gallium",
      lastUpdated: new Date().toISOString(),
      entryType: "specialized",
      materialTypes: ["gallium"],

      packagingOptions: [
        {
          id: "A12.7.combination",
          type: "combination",
          description: "Sealed gallium bag in outer drum or box",
          innerPackaging: {
            required: true,
            materials: ["Semi-rigid plastic", "Sealed leak-tight bag"],
          },
          outerPackaging: {
            categories: [
              {
                type: "boxes",
                containers: [
                  { code: "4C1", material: "natural_wood", description: "Natural wood box" },
                  { code: "4C2", material: "natural_wood", description: "Natural wood box" },
                  { code: "4D", material: "plywood", description: "Plywood box" },
                  { code: "4F", material: "reconstituted_wood", description: "Reconstituted wood box" },
                  { code: "4G", material: "fiberboard", description: "Fiberboard box" },
                  { code: "4H1", material: "plastic", description: "Expanded plastic box" },
                  { code: "4H2", material: "plastic", description: "Solid plastic box" },
                  { code: "4N", material: "other_metal", description: "Other metal box" },
                ],
              },
              {
                type: "drums",
                containers: [
                  { code: "1A1", material: "steel", description: "Steel drum" },
                  { code: "1A2", material: "steel", description: "Steel drum" },
                  { code: "1G", material: "fiber", description: "Fiber drum" },
                  { code: "1H1", material: "plastic", description: "Plastic drum" },
                  { code: "1H2", material: "plastic", description: "Plastic drum" },
                  { code: "1N1", material: "other_metal", description: "Other metal drum" },
                  { code: "1N2", material: "other_metal", description: "Other metal drum" },
                ],
              },
            ],
          },
        },
      ],

      packingGroupRestrictions: [
        {
          packingGroup: "I",
          restriction: "required",
          description: "Packaging meeting PG I performance standard is required",
        },
      ],
      referencedParagraphs: ["A12.7.", "A3.1.16.3."],
    },

  // A12.8 (Package Hydrogen Fluoride)
    "A12.8.": {
        paragraphId: "A12.8.",
        hazardClass: 8,
        description: "Package Hydrogen Fluoride",
        lastUpdated: new Date().toISOString(),
        entryType: "specialized",
        materialTypes: ["hydrogen_fluoride"],

        packagingOptions: [
          {
            id: "A12.8.cylinders",
            type: "cylinder",
            description: "DOT specification cylinders for hydrogen fluoride",
            innerPackaging: {
              required: false,
            },
            outerPackaging: {
              categories: [
                {
                  type: "cylinders",
                  containers: [
                    { code: "3", material: "metal", description: "DOT 3 cylinder" },
                    { code: "3A", material: "metal", description: "DOT 3A cylinder" },
                    { code: "3AA", material: "metal", description: "DOT 3AA cylinder" },
                    { code: "3B", material: "metal", description: "DOT 3B cylinder" },
                    { code: "3BN", material: "metal", description: "DOT 3BN cylinder" },
                    { code: "3E", material: "metal", description: "DOT 3E cylinder" },
                    { code: "4B", material: "metal", description: "DOT 4B cylinder (if not brazed)" },
                    { code: "4BA", material: "metal", description: "DOT 4BA cylinder (if not brazed)" },
                    { code: "4BW", material: "metal", description: "DOT 4BW cylinder (if not brazed)" },
                  ],
                },
              ],
            },
          },
        ],

        referencedParagraphs: ["A12.8."],
      },
 // A12.9 (Package Mercury)
  "A12.9.": {
      paragraphId: "A12.9.",
      hazardClass: 8,
      description: "Package Mercury (Metallic and Articles Containing Mercury)",
      lastUpdated: new Date().toISOString(),
      entryType: "specialized",
      materialTypes: ["mercury"],

      packagingOptions: [
        {
          id: "A12.9.2.1.combination",
          type: "combination",
          description: "Inner receptacles in outer drums, jerricans, or boxes",
          innerPackaging: {
            required: true,
            materials: ["Earthenware", "Glass", "Plastic", "Steel flask"],
          },
          outerPackaging: {
            categories: [
              {
                type: "drums",
                containers: [
                  { code: "1A1", material: "steel", description: "Steel drum" },
                  { code: "1A2", material: "steel", description: "Steel drum" },
                  { code: "1D", material: "plywood", description: "Plywood drum" },
                  { code: "1G", material: "fiber", description: "Fiber drum" },
                  { code: "1N1", material: "other_metal", description: "Other metal drum" },
                  { code: "1N2", material: "other_metal", description: "Other metal drum" },
                ],
              },
              {
                type: "jerricans",
                containers: [
                  { code: "3A2", material: "steel", description: "Steel jerrican" },
                ],
              },
              {
                type: "boxes",
                containers: [
                  { code: "4C1", material: "natural_wood", description: "Natural wood box" },
                  { code: "4C2", material: "natural_wood", description: "Natural wood box" },
                  { code: "4D", material: "plywood", description: "Plywood box" },
                  { code: "4F", material: "reconstituted_wood", description: "Reconstituted wood box" },
                  { code: "4G", material: "fiberboard", description: "Fiberboard box" },
                  { code: "4H2", material: "plastic", description: "Solid plastic box" },
                  { code: "4N", material: "other_metal", description: "Other metal box" },
                ],
              },
            ],
          },
        },
      ],

      packingGroupRestrictions: [
        {
          packingGroup: "I",
          restriction: "required",
          description: "Packaging meeting PG I performance standard is required",
        },
      ],
      referencedParagraphs: ["A12.9.", "A12.9.1.", "A12.9.2.", "A12.9.2.1.", "A3.1.16.4."],
    },

    // A12.10 (Package Nitrating Acid Mixtures or Nitric Acid)
    "A12.10.": {
      paragraphId: "A12.10.",
      hazardClass: 8,
      description:
        "Package Nitrating Acid Mixtures; Nitrating Acid Mixtures, Spent; or Nitric Acid",
      lastUpdated: new Date().toISOString(),
      entryType: "specialized",
      materialTypes: ["nitric_acid"],

      packagingOptions: [
        {
          id: "A12.10.single_drums",
          type: "single",
          description: "Single drums for nitric acid",
          innerPackaging: {
            required: false,
          },
          outerPackaging: {
            categories: [
              {
                type: "drums",
                containers: [
                  { code: "1A1", material: "steel", description: "Stainless steel drum" },
                  { code: "1B1", material: "aluminum", description: "Aluminum drum" },
                ],
              },
            ],
          },
        },
        {
          id: "A12.10.combination",
          type: "combination",
          description: "Combination packagings for nitric acid",
          innerPackaging: {
            required: true,
            materials: ["Glass", "Earthenware", "Plastic"],
          },
          outerPackaging: {
            categories: [
              {
                type: "drums",
                containers: [
                  { code: "1A2", material: "steel", description: "Steel drum" },
                  { code: "1B2", material: "aluminum", description: "Aluminum drum" },
                  { code: "1D", material: "plywood", description: "Plywood drum" },
                  { code: "1G", material: "fiber", description: "Fiber drum" },
                  { code: "1H2", material: "plastic", description: "Plastic drum" },
                  { code: "1N2", material: "other_metal", description: "Other metal drum" },
                ],
              },
              {
                type: "jerricans",
                containers: [
                  { code: "3H2", material: "plastic", description: "Plastic jerrican" },
                ],
              },
              {
                type: "boxes",
                containers: [
                  { code: "4A", material: "steel", description: "Steel box" },
                  { code: "4B", material: "aluminum", description: "Aluminum box" },
                  { code: "4C1", material: "natural_wood", description: "Natural wood box" },
                  { code: "4C2", material: "natural_wood", description: "Natural wood box" },
                  { code: "4D", material: "plywood", description: "Plywood box" },
                  { code: "4F", material: "reconstituted_wood", description: "Reconstituted wood box" },
                  { code: "4G", material: "fiberboard", description: "Fiberboard box" },
                  { code: "4N", material: "other_metal", description: "Other metal box" },
                  { code: "4H1", material: "plastic", description: "Expanded plastic box" },
                ],
              },
            ],
          },
        },
        {
          id: "A12.10.composite",
          type: "composite_plastic",
          description: "Composite packagings for nitric acid",
          innerPackaging: {
            required: true,
          },
          outerPackaging: {
            categories: [
              {
                type: "composite_packagings",
                containers: [
                  { code: "6PA1", material: "composite", description: "Composite packaging" },
                  { code: "6PA2", material: "composite", description: "Composite packaging" },
                  { code: "6PB1", material: "composite", description: "Composite packaging" },
                  { code: "6PB2", material: "composite", description: "Composite packaging" },
                  { code: "6PC", material: "composite", description: "Composite packaging" },
                  { code: "6PD1", material: "composite", description: "Composite packaging" },
                  { code: "6PH1", material: "composite", description: "Composite packaging" },
                  { code: "6PH2", material: "composite", description: "Composite packaging" },
                  { code: "6HH1", material: "composite", description: "Composite packaging" },
                  { code: "6HA1", material: "composite", description: "Composite packaging" },
                ],
              },
            ],
          },
        },
      ],

      referencedParagraphs: [
        "A12.10.",
        "A12.10.1.",
        "A12.10.2.",
        "A12.10.3.",
        "A12.10.4.",
        "A12.10.5.",
        "A12.10.6.",
        "A12.10.7.",
        "A12.10.8.",
      ],
    },

    // A12.11 (Package Class 8 Materials With an Inhalation Hazard)
    "A12.11.": {
      paragraphId: "A12.11.",
      hazardClass: 8,
      description: "Package Class 8 Materials With an Inhalation Hazard (Zones A/B)",
      lastUpdated: new Date().toISOString(),
      entryType: "specialized",
      materialTypes: ["corrosive_inhalation_hazard"],

      packagingOptions: [
        {
          id: "A12.11.cylinders",
          type: "cylinder",
          description: "Seamless DOT/UN specification cylinders (except 8/8AL/39)",
          innerPackaging: {
            required: false,
          },
          outerPackaging: {
            categories: [
              {
                type: "cylinders",
                containers: [
                  {
                    code: "DOT_SPEC",
                    material: "metal",
                    description:
                      "DOT/UN spec cylinders per 49 CFR 178 Subpart C (except 8, 8AL, 39)",
                  },
                ],
              },
            ],
          },
        },
        {
          id: "A12.11.double_drum",
          type: "combination",
          description: "Inner drum within outer drum (PG I performance)",
          innerPackaging: {
            required: true,
            materials: ["1A1", "1B1", "1H1", "1N1", "6HA1"],
          },
          outerPackaging: {
            categories: [
              {
                type: "drums",
                containers: [
                  { code: "1A2", material: "steel", description: "Steel drum" },
                  { code: "1H2", material: "plastic", description: "Plastic drum" },
                ],
              },
            ],
          },
        },
        {
          id: "A12.11.inner_system",
          type: "combination",
          description: "Inner system in outer drums or boxes (PG I performance)",
          innerPackaging: {
            required: true,
            materials: ["Glass", "Earthenware", "Plastic", "Metal"],
          },
          outerPackaging: {
            categories: [
              {
                type: "drums",
                containers: [
                  { code: "1A2", material: "steel", description: "Steel drum" },
                  { code: "1B2", material: "aluminum", description: "Aluminum drum" },
                  { code: "1D", material: "plywood", description: "Plywood drum" },
                  { code: "1G", material: "fiber", description: "Fiber drum" },
                  { code: "1H2", material: "plastic", description: "Plastic drum" },
                  { code: "1N2", material: "other_metal", description: "Other metal drum" },
                ],
              },
              {
                type: "boxes",
                containers: [
                  { code: "4A", material: "steel", description: "Steel box" },
                  { code: "4B", material: "aluminum", description: "Aluminum box" },
                  { code: "4C1", material: "natural_wood", description: "Natural wood box" },
                  { code: "4C2", material: "natural_wood", description: "Natural wood box" },
                  { code: "4D", material: "plywood", description: "Plywood box" },
                  { code: "4F", material: "reconstituted_wood", description: "Reconstituted wood box" },
                  { code: "4G", material: "fiberboard", description: "Fiberboard box" },
                  { code: "4H1", material: "plastic", description: "Expanded plastic box" },
                  { code: "4H2", material: "plastic", description: "Solid plastic box" },
                  { code: "4N", material: "other_metal", description: "Other metal box" },
                ],
              },
            ],
          },
        },
      ],

      packingGroupRestrictions: [
        {
          packingGroup: "I",
          restriction: "required",
          description: "Packaging meeting PG I performance standard is required",
        },
      ],
      referencedParagraphs: ["A12.11.", "A12.11.1.", "A12.11.2.", "A12.11.3.", "A3.3.2."],
    },

    // A12.12 (Package Fuel Cell Cartridges)
    "A12.12.": {
      paragraphId: "A12.12.",
      hazardClass: 8,
      description: "Package Fuel Cell Cartridges",
      lastUpdated: new Date().toISOString(),
      entryType: "specialized",
      materialTypes: ["fuel_cell_cartridge"],

      packagingOptions: [
        {
          id: "A12.12.single",
          type: "single",
          description: "Single packagings for fuel cell cartridges",
          innerPackaging: {
            required: false,
          },
          outerPackaging: {
            categories: [
              {
                type: "drums",
                containers: [
                  { code: "1A2", material: "steel", description: "Steel drum" },
                  { code: "1B2", material: "aluminum", description: "Aluminum drum" },
                  { code: "1D", material: "plywood", description: "Plywood drum" },
                  { code: "1G", material: "fiber", description: "Fiber drum" },
                  { code: "1H2", material: "plastic", description: "Plastic drum" },
                  { code: "1N2", material: "other_metal", description: "Other metal drum" },
                ],
              },
              {
                type: "jerricans",
                containers: [
                  { code: "3A2", material: "steel", description: "Steel jerrican" },
                  { code: "3B2", material: "aluminum", description: "Aluminum jerrican" },
                  { code: "3H2", material: "plastic", description: "Plastic jerrican" },
                ],
              },
              {
                type: "boxes",
                containers: [
                  { code: "4A", material: "steel", description: "Steel box" },
                  { code: "4B", material: "aluminum", description: "Aluminum box" },
                  { code: "4C1", material: "natural_wood", description: "Natural wood box" },
                  { code: "4C2", material: "natural_wood", description: "Natural wood box" },
                  { code: "4D", material: "plywood", description: "Plywood box" },
                  { code: "4F", material: "reconstituted_wood", description: "Reconstituted wood box" },
                  { code: "4G", material: "fiberboard", description: "Fiberboard box" },
                  { code: "4H2", material: "plastic", description: "Solid plastic box" },
                  { code: "4N", material: "other_metal", description: "Other metal box" },
                ],
              },
            ],
          },
        },
      ],

      referencedParagraphs: ["A12.12.", "A12.12.1."],
    },

    // A12.13 (Fuel Cells Contained in Equipment)
    "A12.13.": {
      paragraphId: "A12.13.",
      hazardClass: 8,
      description: "Fuel Cells Contained in Equipment",
      lastUpdated: new Date().toISOString(),
      entryType: "equipment",
      materialTypes: ["fuel_cell_contained"],

      packagingOptions: [
        {
          id: "A12.13.strong_outer",
          type: "single",
          description: "Strong outer packaging (UN specification not required)",
          innerPackaging: {
            required: false,
          },
          outerPackaging: {
            categories: [
              {
                type: "strong_outer_packaging",
                containers: [
                  {
                    code: "STRONG_OUTER",
                    material: "various",
                    description: "Strong outer packaging",
                  },
                ],
              },
            ],
          },
        },
      ],

      referencedParagraphs: ["A12.13.", "A12.13.1.", "A12.13.2."],
    },

    // A12.14 (Fuel Cells Packed With Equipment)
    "A12.14.": {
      paragraphId: "A12.14.",
      hazardClass: 8,
      description: "Fuel Cells Packed With Equipment",
      lastUpdated: new Date().toISOString(),
      entryType: "equipment",
      materialTypes: ["fuel_cell_packed"],

      packagingOptions: [
        {
          id: "A12.14.strong_outer",
          type: "single",
          description: "Strong outer packaging (UN specification not required)",
          innerPackaging: {
            required: false,
          },
          outerPackaging: {
            categories: [
              {
                type: "strong_outer_packaging",
                containers: [
                  {
                    code: "STRONG_OUTER",
                    material: "various",
                    description: "Strong outer packaging",
                  },
                ],
              },
            ],
          },
        },
      ],

      referencedParagraphs: ["A12.14.", "A12.14.1."],
    },

    // A12.15 (Package Chlorosilanes)
    "A12.15.": {
      paragraphId: "A12.15.",
      hazardClass: 8,
      description: "Package Chlorosilanes",
      lastUpdated: new Date().toISOString(),
      entryType: "specialized",
      materialTypes: ["chlorosilanes"],

      packagingOptions: [
        {
          id: "A12.15.1.combination",
          type: "combination",
          description: "Combination drums or boxes",
          innerPackaging: {
            required: true,
            materials: ["Glass", "Steel"],
          },
          outerPackaging: {
            categories: [
              {
                type: "drums",
                containers: [
                  { code: "1A2", material: "steel", description: "Steel drum" },
                  { code: "1D", material: "plywood", description: "Plywood drum" },
                  { code: "1G", material: "fiber", description: "Fiber drum" },
                  { code: "1H2", material: "plastic", description: "Plastic drum" },
                ],
              },
              {
                type: "boxes",
                containers: [
                  { code: "4A", material: "steel", description: "Steel box" },
                  { code: "4C1", material: "natural_wood", description: "Natural wood box" },
                  { code: "4C2", material: "natural_wood", description: "Natural wood box" },
                  { code: "4D", material: "plywood", description: "Plywood box" },
                  { code: "4F", material: "reconstituted_wood", description: "Reconstituted wood box" },
                  { code: "4G", material: "fiberboard", description: "Fiberboard box" },
                  { code: "4H1", material: "plastic", description: "Expanded plastic box" },
                  { code: "4H2", material: "plastic", description: "Solid plastic box" },
                ],
              },
            ],
          },
        },
        {
          id: "A12.15.2.composite_plastic",
          type: "composite_plastic",
          description: "Composite drums",
          innerPackaging: {
            required: true,
            materials: ["Plastic"],
          },
          outerPackaging: {
            categories: [
              {
                type: "composite_drum",
                containers: [
                  { code: "6HA1", material: "composite", description: "Composite drum" },
                ],
              },
            ],
          },
        },
        {
          id: "A12.15.3.single",
          type: "single",
          description: "Single drums or jerricans",
          innerPackaging: {
            required: false,
          },
          outerPackaging: {
            categories: [
              {
                type: "drums",
                containers: [
                  { code: "1A1", material: "steel", description: "Steel drum" },
                ],
              },
              {
                type: "jerricans",
                containers: [
                  { code: "3A1", material: "steel", description: "Steel jerrican" },
                ],
              },
            ],
          },
        },
        {
          id: "A12.15.4.cylinders",
          type: "cylinder",
          description: "Cylinders for compressed gas (except 8/8AL/3HT)",
          innerPackaging: {
            required: false,
          },
          outerPackaging: {
            categories: [
              {
                type: "cylinders",
                containers: [
                  {
                    code: "DOT_SPEC",
                    material: "metal",
                    description:
                      "DOT cylinders for compressed gas (except 8, 8AL, 3HT)",
                  },
                ],
              },
            ],
          },
        },
      ],

      packingGroupRestrictions: [
        {
          packingGroup: "I",
          restriction: "required",
          description: "Packaging meeting PG I or PG II performance standard is required",
        },
      ],
      referencedParagraphs: ["A12.15.", "A12.15.1.", "A12.15.2.", "A12.15.3.", "A12.15.4."],
    },
  // Phase 3, Week 14: Class 9 Miscellaneous Entry - A13.2 (Package Ammonium Nitrate Fertilizers; Benzaldehyde; Dibromodifluoromethane; Environmentally Hazardous Substances, N.O.S.; Fish Meal, Stabilized; Fish Scrap, Stabilized; Hazardous Waste, N.O.S.; Other Regulated Substances; Polychlorinated Biphenyls (PCB); Zinc Dithionite, Zinc Hydrosulfite)
  "A13.2.": {
    paragraphId: "A13.2.",
    hazardClass: 9,
    description:
      "Package Ammonium Nitrate Fertilizers; Benzaldehyde; Dibromodifluoromethane (Difluorodibromomethane); Environmentally Hazardous Substances, N.O.S.; Fish Meal, Stabilized; Fish Scrap, Stabilized; Hazardous Waste, N.O.S.; Other Regulated Substances; Polychlorinated Biphenyls (PCB); Zinc Dithionite, Zinc Hydrosulfite as follows:",
    lastUpdated: new Date().toISOString(),
    entryType: "standard",
    materialTypes: [
      "ammonium_nitrate_fertilizers",
      "benzaldehyde",
      "dibromodifluoromethane",
      "environmentally_hazardous_substances_nos",
      "fish_meal_stabilized",
      "fish_scrap_stabilized",
      "hazardous_waste_nos",
      "other_regulated_substances",
      "polychlorinated_biphenyls",
      "zinc_dithionite",
    ],

    packagingOptions: [
      {
        id: "A13.2.2.1.liquids_combination",
        type: "combination",
        description:
          "Combination packaging for Class 9 liquids with inner receptacles",
        innerPackaging: {
          required: true,
          materials: [
            "Glass receptacles",
            "Earthenware receptacles",
            "Plastic receptacles",
            "Metal receptacles",
          ],
          specialRequirements: [
            "Inner receptacles must be compatible with specific Class 9 liquid materials",
            "Ensure proper closure and sealing of inner receptacles",
          ],
        },
        outerPackaging: {
          categories: [
            {
              type: "drums",
              containers: [
                {
                  code: "1A2",
                  material: "steel",
                  description: "Removable head steel drum",
                },
                {
                  code: "1B2",
                  material: "aluminum",
                  description: "Removable head aluminum drum",
                },
                {
                  code: "1N2",
                  material: "other_metal",
                  description:
                    "Removable head metal drum other than steel or aluminum",
                },
                {
                  code: "1D",
                  material: "plywood",
                  description: "Plywood drum",
                },
                { code: "1G", material: "fiber", description: "Fiber drum" },
                {
                  code: "1H2",
                  material: "plastic",
                  description: "Removable head plastic drum",
                },
              ],
            },
            {
              type: "barrels",
              containers: [
                { code: "2C2", material: "wood", description: "Wooden barrel" },
              ],
            },
            {
              type: "jerricans",
              containers: [
                {
                  code: "3A2",
                  material: "steel",
                  description: "Removable head steel jerrican",
                },
                {
                  code: "3B2",
                  material: "aluminum",
                  description: "Removable head aluminum jerrican",
                },
                {
                  code: "3H2",
                  material: "plastic",
                  description: "Removable head plastic jerrican",
                },
              ],
            },
            {
              type: "boxes",
              containers: [
                { code: "4A", material: "steel", description: "Steel box" },
                {
                  code: "4B",
                  material: "aluminum",
                  description: "Aluminum box",
                },
                {
                  code: "4C1",
                  material: "natural_wood",
                  description: "Ordinary natural wood box",
                },
                {
                  code: "4C2",
                  material: "natural_wood",
                  description: "Sift-proof natural wood box",
                },
                { code: "4D", material: "plywood", description: "Plywood box" },
                {
                  code: "4F",
                  material: "reconstituted_wood",
                  description: "Reconstituted wood box",
                },
                {
                  code: "4G",
                  material: "fiberboard",
                  description: "Fiberboard box",
                },
                {
                  code: "4H1",
                  material: "plastic",
                  description: "Expanded plastic box",
                },
                {
                  code: "4H2",
                  material: "plastic",
                  description: "Solid plastic box",
                },
                {
                  code: "4N",
                  material: "other_metal",
                  description: "Other metal box",
                },
              ],
            },
          ],
        },
        isComplete: true,
      },
      {
        id: "A13.2.2.2.liquids_single",
        type: "single",
        description:
          "Single packaging for Class 9 liquids in drums, jerricans, or barrels",
        innerPackaging: {
          required: false,
        },
        outerPackaging: {
          categories: [
            {
              type: "drums",
              containers: [
                { code: "1A1", material: "steel", description: "Steel drum" },
                {
                  code: "1A2",
                  material: "steel",
                  description: "Removable head steel drum",
                },
                {
                  code: "1B1",
                  material: "aluminum",
                  description: "Aluminum drum",
                },
                {
                  code: "1B2",
                  material: "aluminum",
                  description: "Removable head aluminum drum",
                },
                { code: "1G", material: "fiber", description: "Fiber drum" },
                {
                  code: "1H1",
                  material: "plastic",
                  description: "Plastic drum",
                },
                {
                  code: "1H2",
                  material: "plastic",
                  description: "Removable head plastic drum",
                },
                {
                  code: "1N1",
                  material: "other_metal",
                  description: "Metal drum other than steel or aluminum",
                },
                {
                  code: "1N2",
                  material: "other_metal",
                  description:
                    "Removable head metal drum other than steel or aluminum",
                },
              ],
            },
            {
              type: "barrels",
              containers: [
                { code: "2C1", material: "wood", description: "Wooden barrel" },
              ],
            },
            {
              type: "jerricans",
              containers: [
                {
                  code: "3A1",
                  material: "steel",
                  description: "Steel jerrican",
                },
                {
                  code: "3A2",
                  material: "steel",
                  description: "Removable head steel jerrican",
                },
                {
                  code: "3B1",
                  material: "aluminum",
                  description: "Aluminum jerrican",
                },
                {
                  code: "3B2",
                  material: "aluminum",
                  description: "Removable head aluminum jerrican",
                },
                {
                  code: "3H1",
                  material: "plastic",
                  description: "Plastic jerrican",
                },
                {
                  code: "3H2",
                  material: "plastic",
                  description: "Removable head plastic jerrican",
                },
              ],
            },
          ],
        },
        isComplete: true,
      },
      {
        id: "A13.2.2.3.liquids_composite_plastic",
        type: "composite_plastic",
        description:
          "Composite packaging with plastic inner receptacles for Class 9 liquids",
        innerPackaging: {
          required: true,
          materials: ["Plastic inner receptacles"],
        },
        outerPackaging: {
          categories: [
            {
              type: "composite_drum",
              containers: [
                {
                  code: "6HA1",
                  material: "steel_plastic",
                  description: "Steel drum with plastic inner",
                },
                {
                  code: "6HB1",
                  material: "aluminum_plastic",
                  description: "Aluminum drum with plastic inner",
                },
                {
                  code: "6HD1",
                  material: "plywood_plastic",
                  description: "Plywood drum with plastic inner",
                },
                {
                  code: "6HG1",
                  material: "fiber_plastic",
                  description: "Fiber drum with plastic inner",
                },
                {
                  code: "6HH1",
                  material: "plastic_plastic",
                  description: "Plastic drum with plastic inner",
                },
              ],
            },
            {
              type: "composite_box",
              containers: [
                {
                  code: "6HA2",
                  material: "steel_plastic",
                  description: "Steel box with plastic inner",
                },
                {
                  code: "6HB2",
                  material: "aluminum_plastic",
                  description: "Aluminum box with plastic inner",
                },
                {
                  code: "6HC",
                  material: "wooden_plastic",
                  description: "Wooden box with plastic inner",
                },
                {
                  code: "6HD2",
                  material: "plywood_plastic",
                  description: "Plywood box with plastic inner",
                },
                {
                  code: "6HG2",
                  material: "fiberboard_plastic",
                  description: "Fiberboard box with plastic inner",
                },
              ],
            },
          ],
        },
        isComplete: true,
      },
      {
        id: "A13.2.2.4.liquids_composite_glass",
        type: "composite_glass",
        description:
          "Composite packaging with glass, porcelain, or stoneware inner receptacles for Class 9 liquids",
        innerPackaging: {
          required: true,
          materials: [
            "Glass inner receptacles",
            "Porcelain inner receptacles",
            "Stoneware inner receptacles",
          ],
        },
        outerPackaging: {
          categories: [
            {
              type: "composite_drum",
              containers: [
                {
                  code: "6PA1",
                  material: "steel_glass",
                  description:
                    "Steel drum with glass/porcelain/stoneware inner",
                },
                {
                  code: "6PB1",
                  material: "aluminum_glass",
                  description:
                    "Aluminum drum with glass/porcelain/stoneware inner",
                },
                {
                  code: "6PG1",
                  material: "fiber_glass",
                  description:
                    "Fiber drum with glass/porcelain/stoneware inner",
                },
              ],
            },
            {
              type: "composite_box",
              containers: [
                {
                  code: "6PA2",
                  material: "steel_glass",
                  description: "Steel box with glass/porcelain/stoneware inner",
                },
                {
                  code: "6PB2",
                  material: "aluminum_glass",
                  description:
                    "Aluminum box with glass/porcelain/stoneware inner",
                },
                {
                  code: "6PC",
                  material: "wooden_glass",
                  description:
                    "Wooden box with glass/porcelain/stoneware inner",
                },
                {
                  code: "6PG2",
                  material: "fiberboard_glass",
                  description:
                    "Fiberboard box with glass/porcelain/stoneware inner",
                },
              ],
            },
            {
              type: "composite_plastic_packaging",
              containers: [
                {
                  code: "6PH1",
                  material: "plastic_glass",
                  description:
                    "Expanded plastic packaging with glass/porcelain/stoneware inner",
                },
                {
                  code: "6PH2",
                  material: "plastic_glass",
                  description:
                    "Solid plastic packaging with glass/porcelain/stoneware inner",
                },
              ],
            },
            {
              type: "composite_plywood",
              containers: [
                {
                  code: "6PD1",
                  material: "plywood_glass",
                  description:
                    "Plywood drum with glass/porcelain/stoneware inner",
                },
                {
                  code: "6PD2",
                  material: "plywood_glass",
                  description:
                    "Wickerwork hamper with glass/porcelain/stoneware inner",
                },
              ],
            },
          ],
        },
        isComplete: true,
      },
      {
        id: "A13.2.2.5.liquids_cylinder",
        type: "cylinder",
        description: "DOT specification cylinders for Class 9 liquids",
        innerPackaging: {
          required: false,
        },
        outerPackaging: {
          categories: [
            {
              type: "cylinders",
              containers: [
                {
                  code: "DOT_CLASS9",
                  material: "metal",
                  description:
                    "DOT specification cylinders as prescribed for any compressed gas, except acetylene (DOT 8, 8AL) and DOT 3HT",
                },
              ],
            },
          ],
        },
        isComplete: true,
      },
      {
        id: "A13.2.2.6.otto_fuel_ii_torpedoes",
        type: "specialized",
        description:
          "Fired exercise torpedoes or rockets with no explosive components containing Otto fuel II",
        innerPackaging: {
          required: false,
        },
        outerPackaging: {
          categories: [
            {
              type: "specialized_containers",
              containers: [
                {
                  code: "ORIGINAL",
                  material: "various",
                  description: "Original container authorized in Attachment 5",
                },
                {
                  code: "SIMILAR",
                  material: "various",
                  description: "Similar container authorized in Attachment 5",
                },
              ],
            },
          ],
        },
        isComplete: true,
      },
      {
        id: "A13.2.3.1.solids_combination",
        type: "combination",
        description:
          "Combination packaging for Class 9 solids with inner receptacles",
        innerPackaging: {
          required: true,
          materials: [
            "Glass receptacles",
            "Earthenware receptacles",
            "Plastic receptacles",
            "Metal receptacles",
          ],
          specialRequirements: [
            "Inner receptacles must be compatible with specific Class 9 solid materials",
            "Ensure proper closure and sealing of inner receptacles",
          ],
        },
        outerPackaging: {
          categories: [
            {
              type: "drums",
              containers: [
                { code: "1A1", material: "steel", description: "Steel drum" },
                {
                  code: "1A2",
                  material: "steel",
                  description: "Removable head steel drum",
                },
                {
                  code: "1B1",
                  material: "aluminum",
                  description: "Aluminum drum",
                },
                {
                  code: "1B2",
                  material: "aluminum",
                  description: "Removable head aluminum drum",
                },
                {
                  code: "1D",
                  material: "plywood",
                  description: "Plywood drum",
                },
                { code: "1G", material: "fiber", description: "Fiber drum" },
                {
                  code: "1H1",
                  material: "plastic",
                  description: "Plastic drum",
                },
                {
                  code: "1H2",
                  material: "plastic",
                  description: "Removable head plastic drum",
                },
                {
                  code: "1N1",
                  material: "other_metal",
                  description: "Metal drum other than steel or aluminum",
                },
                {
                  code: "1N2",
                  material: "other_metal",
                  description:
                    "Removable head metal drum other than steel or aluminum",
                },
              ],
            },
            {
              type: "barrels",
              containers: [
                { code: "2C2", material: "wood", description: "Wooden barrel" },
              ],
            },
            {
              type: "jerricans",
              containers: [
                {
                  code: "3A1",
                  material: "steel",
                  description: "Steel jerrican",
                },
                {
                  code: "3A2",
                  material: "steel",
                  description: "Removable head steel jerrican",
                },
                {
                  code: "3B1",
                  material: "aluminum",
                  description: "Aluminum jerrican",
                },
                {
                  code: "3B2",
                  material: "aluminum",
                  description: "Removable head aluminum jerrican",
                },
                {
                  code: "3H1",
                  material: "plastic",
                  description: "Plastic jerrican",
                },
                {
                  code: "3H2",
                  material: "plastic",
                  description: "Removable head plastic jerrican",
                },
              ],
            },
            {
              type: "boxes",
              containers: [
                { code: "4A", material: "steel", description: "Steel box" },
                {
                  code: "4B",
                  material: "aluminum",
                  description: "Aluminum box",
                },
                {
                  code: "4C1",
                  material: "natural_wood",
                  description: "Ordinary natural wood box",
                },
                {
                  code: "4C2",
                  material: "natural_wood",
                  description: "Sift-proof natural wood box",
                },
                { code: "4D", material: "plywood", description: "Plywood box" },
                {
                  code: "4F",
                  material: "reconstituted_wood",
                  description: "Reconstituted wood box",
                },
                {
                  code: "4G",
                  material: "fiberboard",
                  description: "Fiberboard box",
                },
                {
                  code: "4H2",
                  material: "plastic",
                  description: "Solid plastic box",
                },
                {
                  code: "4N",
                  material: "other_metal",
                  description: "Other metal box",
                },
              ],
            },
          ],
        },
        isComplete: true,
      },
      {
        id: "A13.2.3.2.solids_single",
        type: "single",
        description:
          "Single packaging for Class 9 solids in drums, barrels, jerricans, boxes, or bags",
        innerPackaging: {
          required: false,
        },
        outerPackaging: {
          categories: [
            {
              type: "drums",
              containers: [
                { code: "1A1", material: "steel", description: "Steel drum" },
                {
                  code: "1A2",
                  material: "steel",
                  description: "Removable head steel drum",
                },
                {
                  code: "1B1",
                  material: "aluminum",
                  description: "Aluminum drum",
                },
                {
                  code: "1B2",
                  material: "aluminum",
                  description: "Removable head aluminum drum",
                },
                {
                  code: "1D",
                  material: "plywood",
                  description: "Plywood drum",
                },
                { code: "1G", material: "fiber", description: "Fiber drum" },
                {
                  code: "1H1",
                  material: "plastic",
                  description: "Plastic drum",
                },
                {
                  code: "1H2",
                  material: "plastic",
                  description: "Removable head plastic drum",
                },
                {
                  code: "1N1",
                  material: "other_metal",
                  description: "Metal drum other than steel or aluminum",
                },
                {
                  code: "1N2",
                  material: "other_metal",
                  description:
                    "Removable head metal drum other than steel or aluminum",
                },
              ],
            },
            {
              type: "barrels",
              containers: [
                { code: "2C1", material: "wood", description: "Wooden barrel" },
                { code: "2C2", material: "wood", description: "Wooden barrel" },
              ],
            },
            {
              type: "jerricans",
              containers: [
                {
                  code: "3A1",
                  material: "steel",
                  description: "Steel jerrican",
                },
                {
                  code: "3A2",
                  material: "steel",
                  description: "Removable head steel jerrican",
                },
                {
                  code: "3B1",
                  material: "aluminum",
                  description: "Aluminum jerrican",
                },
                {
                  code: "3B2",
                  material: "aluminum",
                  description: "Removable head aluminum jerrican",
                },
                {
                  code: "3H1",
                  material: "plastic",
                  description: "Plastic jerrican",
                },
                {
                  code: "3H2",
                  material: "plastic",
                  description: "Removable head plastic jerrican",
                },
              ],
            },
            {
              type: "boxes",
              containers: [
                { code: "4A", material: "steel", description: "Steel box" },
                {
                  code: "4A_LINED",
                  material: "steel",
                  description: "Steel box with liner",
                },
                {
                  code: "4B",
                  material: "aluminum",
                  description: "Aluminum box",
                },
                {
                  code: "4B_LINED",
                  material: "aluminum",
                  description: "Aluminum box with liner",
                },
                {
                  code: "4C1",
                  material: "natural_wood",
                  description: "Natural wood box",
                },
                {
                  code: "4C2",
                  material: "natural_wood",
                  description: "Natural wood, sift-proof box",
                },
                { code: "4D", material: "plywood", description: "Plywood box" },
                {
                  code: "4F",
                  material: "reconstituted_wood",
                  description: "Reconstituted wood box",
                },
                {
                  code: "4G",
                  material: "fiberboard",
                  description: "Fiberboard box",
                },
                {
                  code: "4H1",
                  material: "plastic",
                  description: "Expanded plastic box",
                },
                {
                  code: "4H2",
                  material: "plastic",
                  description: "Solid plastic box",
                },
                {
                  code: "4N",
                  material: "other_metal",
                  description: "Other metal box",
                },
              ],
            },
            {
              type: "bags",
              containers: [
                {
                  code: "5H1",
                  material: "plastic",
                  description: "Woven plastic bag",
                },
                {
                  code: "5H2",
                  material: "plastic",
                  description: "Woven plastic bag",
                },
                {
                  code: "5H3",
                  material: "plastic",
                  description: "Woven plastic bag",
                },
                {
                  code: "5H4",
                  material: "plastic",
                  description: "Plastic film bag",
                },
                {
                  code: "5L1",
                  material: "textile",
                  description: "Textile bag",
                },
                {
                  code: "5L2",
                  material: "textile",
                  description: "Textile bag",
                },
                {
                  code: "5L3",
                  material: "textile",
                  description: "Textile bag",
                },
                {
                  code: "5M2",
                  material: "paper",
                  description: "Paper, multiwall, water-resistant bag",
                },
              ],
              // restrictions: ["Bags are not authorized for PG I materials"]
            },
          ],
        },
        isComplete: true,
      },
      {
        id: "A13.2.3.3.solids_composite_plastic",
        type: "composite_plastic",
        description:
          "Composite packaging with plastic inner receptacles for Class 9 solids",
        innerPackaging: {
          required: true,
          materials: ["Plastic inner receptacles"],
        },
        outerPackaging: {
          categories: [
            {
              type: "composite_drum",
              containers: [
                {
                  code: "6HA1",
                  material: "steel_plastic",
                  description: "Steel drum with plastic inner",
                },
                {
                  code: "6HB1",
                  material: "aluminum_plastic",
                  description: "Aluminum drum with plastic inner",
                },
                {
                  code: "6HD1",
                  material: "plywood_plastic",
                  description: "Plywood drum with plastic inner",
                },
                {
                  code: "6HG1",
                  material: "fiber_plastic",
                  description: "Fiber drum with plastic inner",
                },
                {
                  code: "6HH1",
                  material: "plastic_plastic",
                  description: "Plastic drum with plastic inner",
                },
              ],
            },
            {
              type: "composite_box",
              containers: [
                {
                  code: "6HA2",
                  material: "steel_plastic",
                  description: "Steel box with plastic inner",
                },
                {
                  code: "6HB2",
                  material: "aluminum_plastic",
                  description: "Aluminum box with plastic inner",
                },
                {
                  code: "6HC",
                  material: "wooden_plastic",
                  description: "Wood box with plastic inner",
                },
                {
                  code: "6HD2",
                  material: "plywood_plastic",
                  description: "Plywood box with plastic inner",
                },
                {
                  code: "6HG2",
                  material: "fiberboard_plastic",
                  description: "Fiberboard box with plastic inner",
                },
              ],
              // restrictions: ["Boxes are not authorized for PG I materials"]
            },
          ],
        },
        isComplete: true,
      },
      {
        id: "A13.2.3.4.solids_composite_glass",
        type: "composite_glass",
        description:
          "Composite packaging with glass, porcelain, or stoneware inner receptacles for Class 9 solids",
        innerPackaging: {
          required: true,
          materials: [
            "Glass inner receptacles",
            "Porcelain inner receptacles",
            "Stoneware inner receptacles",
          ],
        },
        outerPackaging: {
          categories: [
            {
              type: "composite_drum",
              containers: [
                {
                  code: "6PA1",
                  material: "steel_glass",
                  description:
                    "Steel drum with glass/porcelain/stoneware inner",
                },
                {
                  code: "6PB1",
                  material: "aluminum_glass",
                  description:
                    "Aluminum drum with glass/porcelain/stoneware inner",
                },
                {
                  code: "6PD1",
                  material: "plywood_glass",
                  description:
                    "Plywood drum with glass/porcelain/stoneware inner",
                },
                {
                  code: "6PG1",
                  material: "fiber_glass",
                  description:
                    "Fiber drum with glass/porcelain/stoneware inner",
                },
              ],
            },
            {
              type: "composite_box",
              containers: [
                {
                  code: "6PA2",
                  material: "steel_glass",
                  description: "Steel box with glass/porcelain/stoneware inner",
                },
                {
                  code: "6PB2",
                  material: "aluminum_glass",
                  description:
                    "Aluminum box with glass/porcelain/stoneware inner",
                },
                {
                  code: "6PC",
                  material: "wooden_glass",
                  description:
                    "Wooden box with glass/porcelain/stoneware inner",
                },
                {
                  code: "6PG2",
                  material: "fiberboard_glass",
                  description:
                    "Fiberboard box with glass/porcelain/stoneware inner",
                },
              ],
            },
            {
              type: "composite_plastic_packaging",
              containers: [
                {
                  code: "6PH1",
                  material: "plastic_glass",
                  description:
                    "Expanded plastic packaging with glass/porcelain/stoneware inner",
                },
                {
                  code: "6PH2",
                  material: "plastic_glass",
                  description:
                    "Solid plastic packaging with glass/porcelain/stoneware inner",
                },
              ],
            },
          ],
        },
        isComplete: true,
      },
    ],

    specialRequirements: [
      {
        type: "dibromodifluoromethane_handling",
        description:
          "Do not expose Dibromodifluoromethane to high temperature; toxic fumes emitted when decomposed. Store in cool, ventilated area away from flame.",
        mandatory: true,
        applicableContainers: [
          "A13.2.2.1.liquids_combination",
          "A13.2.2.2.liquids_single",
          "A13.2.2.3.liquids_composite_plastic",
          "A13.2.2.4.liquids_composite_glass",
          "A13.2.2.5.liquids_cylinder",
        ],
      },
      {
        type: "otto_fuel_ii_handling",
        description:
          "Environmentally Hazardous Substances N.O.S. (Otto Fuel II) - avoid direct skin contact, ingestion, or inhalation of vapors. Vapors are toxic and may cause severe headache and nausea.",
        mandatory: true,
        applicableContainers: [
          "A13.2.2.1.liquids_combination",
          "A13.2.2.2.liquids_single",
          "A13.2.2.3.liquids_composite_plastic",
          "A13.2.2.4.liquids_composite_glass",
          "A13.2.2.5.liquids_cylinder",
          "A13.2.2.6.otto_fuel_ii_torpedoes",
        ],
      },
      {
        type: "material_compatibility",
        description:
          "Inner packagings must be compatible with specific Class 9 materials being transported",
        mandatory: true,
        applicableContainers: [
          "A13.2.2.1.liquids_combination",
          "A13.2.3.1.solids_combination",
          "A13.2.2.3.liquids_composite_plastic",
          "A13.2.2.4.liquids_composite_glass",
          "A13.2.3.3.solids_composite_plastic",
          "A13.2.3.4.solids_composite_glass",
        ],
      },
      {
        type: "proper_closure_sealing",
        description:
          "Ensure proper closure and sealing of inner receptacles to prevent leakage",
        mandatory: true,
        applicableContainers: [
          "A13.2.2.1.liquids_combination",
          "A13.2.3.1.solids_combination",
          "A13.2.2.3.liquids_composite_plastic",
          "A13.2.2.4.liquids_composite_glass",
          "A13.2.3.3.solids_composite_plastic",
          "A13.2.3.4.solids_composite_glass",
        ],
      },
      {
        type: "environmental_protection",
        description:
          "Special handling for environmentally hazardous substances to prevent environmental contamination",
        mandatory: true,
        applicableContainers: [
          "A13.2.2.1.liquids_combination",
          "A13.2.2.2.liquids_single",
          "A13.2.3.1.solids_combination",
          "A13.2.3.2.solids_single",
        ],
      },
      {
        type: "pcb_handling",
        description:
          "Special precautions for Polychlorinated Biphenyls (PCB) due to environmental and health hazards",
        mandatory: true,
        applicableContainers: [
          "A13.2.2.1.liquids_combination",
          "A13.2.2.2.liquids_single",
          "A13.2.3.1.solids_combination",
          "A13.2.3.2.solids_single",
        ],
      },
      {
        type: "stabilized_materials_handling",
        description:
          "Proper handling of stabilized fish meal and fish scrap to maintain stabilization effectiveness",
        mandatory: true,
        applicableContainers: [
          "A13.2.3.1.solids_combination",
          "A13.2.3.2.solids_single",
          "A13.2.3.3.solids_composite_plastic",
          "A13.2.3.4.solids_composite_glass",
        ],
      },
    ],

    quantityLimits: [],

    conditionalRequirements: [
      {
        condition: "packing_group='I'",
        requirements: [
          {
            type: "bag_packaging_prohibition",
            description: "Bags are not authorized for PG I materials",
            mandatory: true,
            applicableContainers: ["A13.2.3.2.solids_single"],
          },
          {
            type: "composite_box_prohibition",
            description: "Composite boxes not authorized for PG I materials",
            mandatory: true,
            applicableContainers: ["A13.2.3.3.solids_composite_plastic"],
          },
        ],
      },
      {
        condition: "material_type='dibromodifluoromethane'",
        requirements: [
          {
            type: "temperature_protection",
            description:
              "Protect from high temperatures to prevent decomposition and toxic fume emission",
            mandatory: true,
            applicableContainers: [
              "A13.2.2.1.liquids_combination",
              "A13.2.2.2.liquids_single",
              "A13.2.2.3.liquids_composite_plastic",
              "A13.2.2.4.liquids_composite_glass",
              "A13.2.2.5.liquids_cylinder",
            ],
          },
          {
            type: "ventilation_requirement",
            description: "Store in cool, ventilated area away from flame",
            mandatory: true,
            applicableContainers: [
              "A13.2.2.1.liquids_combination",
              "A13.2.2.2.liquids_single",
              "A13.2.2.3.liquids_composite_plastic",
              "A13.2.2.4.liquids_composite_glass",
              "A13.2.2.5.liquids_cylinder",
            ],
          },
        ],
      },
      {
        condition: "material_type='otto_fuel_ii'",
        requirements: [
          {
            type: "vapor_protection",
            description:
              "Prevent inhalation of toxic vapors that may cause severe headache and nausea",
            mandatory: true,
            applicableContainers: [
              "A13.2.2.1.liquids_combination",
              "A13.2.2.2.liquids_single",
              "A13.2.2.6.otto_fuel_ii_torpedoes",
            ],
          },
          {
            type: "skin_contact_prevention",
            description: "Avoid direct skin contact and ingestion",
            mandatory: true,
            applicableContainers: [
              "A13.2.2.1.liquids_combination",
              "A13.2.2.2.liquids_single",
              "A13.2.2.6.otto_fuel_ii_torpedoes",
            ],
          },
          {
            type: "torpedo_rocket_packaging",
            description:
              "Fired exercise torpedoes or rockets with no explosive components must be in original or similar containers per Attachment 5",
            mandatory: true,
            applicableContainers: ["A13.2.2.6.otto_fuel_ii_torpedoes"],
          },
        ],
      },
      {
        condition: "material_type='ammonium_nitrate_fertilizer'",
        requirements: [
          {
            type: "oxidizer_precautions",
            description:
              "Take precautions due to oxidizing properties of ammonium nitrate fertilizers",
            mandatory: true,
            applicableContainers: [
              "A13.2.3.1.solids_combination",
              "A13.2.3.2.solids_single",
              "A13.2.3.3.solids_composite_plastic",
              "A13.2.3.4.solids_composite_glass",
            ],
          },
        ],
      },
      {
        condition: "material_type='pcb'",
        requirements: [
          {
            type: "environmental_containment",
            description:
              "Enhanced containment for PCBs to prevent environmental contamination",
            mandatory: true,
            applicableContainers: [
              "A13.2.2.1.liquids_combination",
              "A13.2.2.2.liquids_single",
              "A13.2.3.1.solids_combination",
              "A13.2.3.2.solids_single",
            ],
          },
          {
            type: "regulatory_compliance",
            description:
              "Comply with environmental regulations for PCB transport and handling",
            mandatory: true,
            applicableContainers: [
              "A13.2.2.1.liquids_combination",
              "A13.2.2.2.liquids_single",
              "A13.2.3.1.solids_combination",
              "A13.2.3.2.solids_single",
            ],
          },
        ],
      },
      {
        condition: "material_type='stabilized_organic'",
        requirements: [
          {
            type: "stabilization_maintenance",
            description:
              "Maintain stabilization effectiveness for fish meal and fish scrap during transport",
            mandatory: true,
            applicableContainers: [
              "A13.2.3.1.solids_combination",
              "A13.2.3.2.solids_single",
              "A13.2.3.3.solids_composite_plastic",
              "A13.2.3.4.solids_composite_glass",
            ],
          },
          {
            type: "temperature_control",
            description:
              "Control temperature to prevent decomposition of stabilized organic materials",
            mandatory: true,
            applicableContainers: [
              "A13.2.3.1.solids_combination",
              "A13.2.3.2.solids_single",
              "A13.2.3.3.solids_composite_plastic",
              "A13.2.3.4.solids_composite_glass",
            ],
          },
        ],
      },
      {
        condition: "cylinder_packaging=true",
        requirements: [
          {
            type: "dot_cylinder_restrictions",
            description:
              "DOT specification cylinders except acetylene (DOT 8, 8AL) and DOT 3HT",
            mandatory: true,
            applicableContainers: ["A13.2.2.5.liquids_cylinder"],
          },
        ],
      },
    ],

    referencedParagraphs: [
      "A13.2.",
      "A13.2.1.",
      "A13.2.1.1.",
      "A13.2.1.2.",
      "A13.2.2.",
      "A13.2.2.1.",
      "A13.2.2.2.",
      "A13.2.2.3.",
      "A13.2.2.4.",
      "A13.2.2.5.",
      "A13.2.2.6.",
      "A13.2.3.",
      "A13.2.3.1.",
      "A13.2.3.2.",
      "A13.2.3.3.",
      "A13.2.3.4.",
      "Attachment 5",
    ],
  },

  // Phase 3, Week 14: Class 9 Miscellaneous Entry - A13.5 (UN3548, Articles containing miscellaneous dangerous goods, N.O.S.)
  "A13.5.": {
    paragraphId: "A13.5.",
    hazardClass: 9,
    description:
      "UN3548, Articles containing miscellaneous dangerous goods, N.O.S. are authorized when classified per paragraph A4.2.3., maximum net quantity per package 60 L for liquids and 100 kg for solids, when packaged, or unpackaged as follows:",
    lastUpdated: new Date().toISOString(),
    entryType: "specialized",
    materialTypes: ["articles_containing_miscellaneous_dangerous_goods", "un3548"],
    applicableUNNumbers: ["UN3548"],

    packagingOptions: [
      {
        id: "A13.5.1.packaged_articles_combination",
        type: "combination",
        description: "Packaged articles with internal receptacles (A13.5.1)",
        innerPackaging: {
          required: true,
          materials: ["Various"],
          specialRequirements: [
            "Receptacles constructed of suitable materials and secured in the article in such a way that, under normal conditions of transport, they cannot break, be punctured or leak their contents into the article itself or the outer packaging",
          ],
        },
        outerPackaging: {
          categories: [
            {
              type: "drums",
              containers: [
                {
                  code: "1A2",
                  material: "steel",
                  description: "Removable head steel drum",
                },
                {
                  code: "1B2",
                  material: "aluminum",
                  description: "Removable head aluminum drum",
                },
                {
                  code: "1N2",
                  material: "other_metal",
                  description:
                    "Removable head metal drum other than steel or aluminum",
                },
                {
                  code: "1D",
                  material: "plywood",
                  description: "Plywood drum",
                },
                { code: "1G", material: "fiber", description: "Fiber drum" },
                {
                  code: "1H2",
                  material: "plastic",
                  description: "Removable head plastic drum",
                },
              ],
            },
            {
              type: "boxes",
              containers: [
                { code: "4A", material: "steel", description: "Steel box" },
                {
                  code: "4B",
                  material: "aluminum",
                  description: "Aluminum box",
                },
                {
                  code: "4C1",
                  material: "natural_wood",
                  description: "Ordinary natural wood box",
                },
                {
                  code: "4C2",
                  material: "natural_wood",
                  description: "Sift-proof natural wood box",
                },
                { code: "4D", material: "plywood", description: "Plywood box" },
                {
                  code: "4F",
                  material: "reconstituted_wood",
                  description: "Reconstituted wood box",
                },
                {
                  code: "4G",
                  material: "fiberboard",
                  description: "Fiberboard box",
                },
                {
                  code: "4H1",
                  material: "plastic",
                  description: "Expanded plastic box",
                },
                {
                  code: "4H2",
                  material: "plastic",
                  description: "Solid plastic box",
                },
                {
                  code: "4N",
                  material: "other_metal",
                  description: "Other metal box",
                },
              ],
            },
            {
              type: "jerricans",
              containers: [
                {
                  code: "3A2",
                  material: "steel",
                  description: "Removable head steel jerrican",
                },
                {
                  code: "3H2",
                  material: "plastic",
                  description: "Plastic removable head jerrican",
                },
                {
                  code: "3B2",
                  material: "aluminum",
                  description: "Aluminum removable head jerrican",
                },
              ],
            },
          ],
        },
        isComplete: true,
      },
      {
        id: "A13.5.1.packaged_articles_single",
        type: "single",
        description: "Packaged articles with internal receptacles (A13.5.1)",
        innerPackaging: {
          required: false,
        },
        outerPackaging: {
          categories: [
            {
              type: "drums",
              containers: [
                {
                  code: "1A2",
                  material: "steel",
                  description: "Removable head steel drum",
                },
                {
                  code: "1B2",
                  material: "aluminum",
                  description: "Removable head aluminum drum",
                },
                {
                  code: "1N2",
                  material: "other_metal",
                  description:
                    "Removable head metal drum other than steel or aluminum",
                },
                {
                  code: "1D",
                  material: "plywood",
                  description: "Plywood drum",
                },
                { code: "1G", material: "fiber", description: "Fiber drum" },
                {
                  code: "1H2",
                  material: "plastic",
                  description: "Removable head plastic drum",
                },
              ],
            },
            {
              type: "boxes",
              containers: [
                { code: "4A", material: "steel", description: "Steel box" },
                {
                  code: "4B",
                  material: "aluminum",
                  description: "Aluminum box",
                },
                {
                  code: "4C1",
                  material: "natural_wood",
                  description: "Ordinary natural wood box",
                },
                {
                  code: "4C2",
                  material: "natural_wood",
                  description: "Sift-proof natural wood box",
                },
                { code: "4D", material: "plywood", description: "Plywood box" },
                {
                  code: "4F",
                  material: "reconstituted_wood",
                  description: "Reconstituted wood box",
                },
                {
                  code: "4G",
                  material: "fiberboard",
                  description: "Fiberboard box",
                },
                {
                  code: "4H1",
                  material: "plastic",
                  description: "Expanded plastic box",
                },
                {
                  code: "4H2",
                  material: "plastic",
                  description: "Solid plastic box",
                },
                {
                  code: "4N",
                  material: "other_metal",
                  description: "Other metal box",
                },
              ],
            },
            {
              type: "jerricans",
              containers: [
                {
                  code: "3A2",
                  material: "steel",
                  description: "Removable head steel jerrican",
                },
                {
                  code: "3H2",
                  material: "plastic",
                  description: "Plastic removable head jerrican",
                },
                {
                  code: "3B2",
                  material: "aluminum",
                  description: "Aluminum removable head jerrican",
                },
              ],
            },
          ],
        },
        isComplete: true,
      },
      {
        id: "A13.5.2.1.robust_articles_strong_packaging",
        type: "specialized",
        description: "Robust articles in strong outer packagings",
        innerPackaging: {
          required: false,
        },
        outerPackaging: {
          categories: [
            {
              type: "strong_packaging",
              containers: [
                {
                  code: "STRONG",
                  material: "various",
                  description:
                    "Strong outer packagings constructed of suitable material and of adequate strength and design in relation to the packaging capacity and its intended use",
                },
              ],
            },
          ],
        },
        isComplete: true,
      },
      {
        id: "A13.5.2.2.robust_articles_unpackaged",
        type: "specialized",
        description: "Robust articles transported unpackaged or on pallets",
        innerPackaging: {
          required: false,
        },
        outerPackaging: {
          categories: [
            {
              type: "unpackaged_or_pallets",
              containers: [
                {
                  code: "UNPACKAGED",
                  material: "none",
                  description:
                    "Unpackaged transport when dangerous goods are afforded equivalent protection by the article in which they are contained",
                },
                {
                  code: "PALLET",
                  material: "various",
                  description:
                    "Transport on pallets when dangerous goods are afforded equivalent protection by the article in which they are contained",
                },
              ],
            },
          ],
        },
        isComplete: true,
      },
    ],

    specialRequirements: [
      {
        type: "classification_requirement",
        description: "Must be classified per paragraph A4.2.3",
        mandatory: true,
        applicableContainers: [
          "A13.5.1.packaged_articles_combination",
          "A13.5.1.packaged_articles_single",
          "A13.5.2.1.robust_articles_strong_packaging",
          "A13.5.2.2.robust_articles_unpackaged",
        ],
      },
      {
        type: "pg_ii_performance_standard",
        description:
          "Packagings meeting PG II performance standard is required when packaged",
        mandatory: true,
        applicableContainers: [
          "A13.5.1.packaged_articles_combination",
          "A13.5.1.packaged_articles_single",
        ],
      },
      {
        type: "article_movement_prevention",
        description:
          "Pack articles to prevent movement and inadvertent operation during normal conditions of transport",
        mandatory: true,
        applicableContainers: [
          "A13.5.1.packaged_articles_combination",
          "A13.5.1.packaged_articles_single",
        ],
      },
      {
        type: "liquid_closure_orientation",
        description:
          "Pack inner receptacles containing liquids with closures in outer packagings with their closures correctly oriented",
        mandatory: true,
        applicableContainers: [
          "A13.5.1.packaged_articles_combination",
          "A13.5.1.packaged_articles_single",
        ],
      },
      {
        type: "article_enclosure_requirement",
        description:
          "Where there is no receptacle within the article, ensure the article fully encloses the dangerous goods and prevent their release under normal conditions of transport",
        mandatory: true,
        applicableContainers: [
          "A13.5.1.packaged_articles_combination",
          "A13.5.1.packaged_articles_single",
        ],
      },
      {
        type: "suitable_material_construction",
        description:
          "Receptacles constructed of suitable materials and secured in article to prevent breakage, puncture, or leakage under normal transport conditions",
        mandatory: true,
        applicableContainers: [
          "A13.5.1.packaged_articles_combination",
          "A13.5.1.packaged_articles_single",
        ],
      },
      {
        type: "strong_packaging_suitability",
        description:
          "Strong outer packagings must be constructed of suitable material and of adequate strength and design in relation to packaging capacity and intended use",
        mandatory: true,
        applicableContainers: ["A13.5.2.1.robust_articles_strong_packaging"],
      },
      {
        type: "equivalent_protection_requirement",
        description:
          "Dangerous goods must be afforded equivalent protection by the article in which they are contained when transported unpackaged or on pallets",
        mandatory: true,
        applicableContainers: ["A13.5.2.2.robust_articles_unpackaged"],
      },
    ],

    quantityLimits: [
      {
        packingGroup: "II",
        scope: "per_package",
        value: 60,
        unit: "L",
        description: "Maximum net quantity per package 60 L for liquids",
      },
      {
        packingGroup: "II",
        scope: "per_package",
        value: 100,
        unit: "kg",
        description: "Maximum net quantity per package 100 kg for solids",
      },
    ],

    conditionalRequirements: [
      {
        condition: "packaging_required=true",
        requirements: [
          {
            type: "pg_ii_compliance",
            description:
              "Packagings meeting PG II performance standard required when articles are packaged",
            mandatory: true,
            applicableContainers: [
              "A13.5.1.packaged_articles_combination",
              "A13.5.1.packaged_articles_single",
            ],
          },
          {
            type: "movement_prevention",
            description:
              "Articles must be packed to prevent movement and inadvertent operation",
            mandatory: true,
            applicableContainers: [
              "A13.5.1.packaged_articles_combination",
              "A13.5.1.packaged_articles_single",
            ],
          },
          {
            type: "closure_orientation",
            description:
              "Inner receptacles containing liquids must have closures correctly oriented in outer packaging",
            mandatory: true,
            applicableContainers: [
              "A13.5.1.packaged_articles_combination",
              "A13.5.1.packaged_articles_single",
            ],
          },
        ],
      },
      {
        condition: "article_type='robust'",
        requirements: [
          {
            type: "strong_packaging_option",
            description:
              "Robust articles may be transported in strong outer packagings",
            mandatory: false,
            applicableContainers: [
              "A13.5.2.1.robust_articles_strong_packaging",
            ],
          },
          {
            type: "unpackaged_option",
            description:
              "Robust articles may be transported unpackaged or on pallets when dangerous goods are afforded equivalent protection",
            mandatory: false,
            applicableContainers: ["A13.5.2.2.robust_articles_unpackaged"],
          },
        ],
      },
      {
        condition: "material_state='liquid'",
        requirements: [
          {
            type: "liquid_quantity_limit",
            description: "Maximum net quantity per package 60 L for liquids",
            mandatory: true,
            applicableContainers: [
              "A13.5.1.packaged_articles_combination",
              "A13.5.1.packaged_articles_single",
              "A13.5.2.1.robust_articles_strong_packaging",
            ],
          },
          {
            type: "closure_orientation_mandatory",
            description:
              "Closures must be correctly oriented for liquid-containing receptacles",
            mandatory: true,
            applicableContainers: [
              "A13.5.1.packaged_articles_combination",
              "A13.5.1.packaged_articles_single",
            ],
          },
        ],
      },
      {
        condition: "material_state='solid'",
        requirements: [
          {
            type: "solid_quantity_limit",
            description: "Maximum net quantity per package 100 kg for solids",
            mandatory: true,
            applicableContainers: [
              "A13.5.1.packaged_articles_combination",
              "A13.5.1.packaged_articles_single",
              "A13.5.2.1.robust_articles_strong_packaging",
            ],
          },
        ],
      },
      {
        condition: "no_internal_receptacle=true",
        requirements: [
          {
            type: "article_enclosure_mandatory",
            description:
              "Article must fully enclose dangerous goods and prevent their release under normal conditions",
            mandatory: true,
            applicableContainers: [
              "A13.5.1.packaged_articles_combination",
              "A13.5.1.packaged_articles_single",
            ],
          },
        ],
      },
    ],

    referencedParagraphs: [
      "A13.5.",
      "A13.5.1.",
      "A13.5.1.1.",
      "A13.5.1.2.",
      "A13.5.1.3.",
      "A13.5.2.",
      "A13.5.2.1.",
      "A13.5.2.2.",
      "A4.2.3.",
    ],
  },

  // Phase 3, Week 14: Class 9 Miscellaneous Entry - A13.15 (Air Bag Inflators, Air Bag Modules, Seat-Belt Pretensioners)
  "A13.15.": {
    paragraphId: "A13.15.",
    hazardClass: 9,
    description:
      "Package Air Bag Inflators, Air Bag Modules, and Seat-Belt Pretensioners as follows: Items are classified as Class 9 and are approved by DOT according to 49 CFR Section 173.166.",
    lastUpdated: new Date().toISOString(),
    entryType: "specialized",
    materialTypes: ["safety_devices", "air_bag_inflators", "seat_belt_pretensioners"],
    applicableUNNumbers: ["UN3268"],

    packagingOptions: [
      {
        id: "A13.15.1.packaging_single",
        type: "single",
        description: "Single packaging in boxes, drums, or jerricans",
        innerPackaging: {
          required: false,
        },
        outerPackaging: {
          categories: [
            {
              type: "boxes",
              containers: [
                { code: "4A", material: "steel", description: "Steel box" },
                {
                  code: "4B",
                  material: "aluminum",
                  description: "Aluminum box",
                },
                {
                  code: "4C1",
                  material: "natural_wood",
                  description: "Ordinary natural wood box",
                },
                {
                  code: "4C2",
                  material: "natural_wood",
                  description: "Sift-proof natural wood box",
                },
                { code: "4D", material: "plywood", description: "Plywood box" },
                {
                  code: "4F",
                  material: "reconstituted_wood",
                  description: "Reconstituted wood box",
                },
                {
                  code: "4G",
                  material: "fiberboard",
                  description: "Fiberboard box",
                },
                {
                  code: "4H1",
                  material: "plastic",
                  description: "Expanded plastic box",
                },
                {
                  code: "4H2",
                  material: "plastic",
                  description: "Solid plastic box",
                },
                {
                  code: "4N",
                  material: "other_metal",
                  description: "Other metal box",
                },
              ],
            },
            {
              type: "drums",
              containers: [
                {
                  code: "1A2",
                  material: "steel",
                  description: "Removable head steel drum",
                },
                {
                  code: "1B2",
                  material: "aluminum",
                  description: "Removable head aluminum drum",
                },
                {
                  code: "1D",
                  material: "plywood",
                  description: "Plywood drum",
                },
                { code: "1G", material: "fiber", description: "Fiber drum" },
                {
                  code: "1H2",
                  material: "plastic",
                  description: "Removable head plastic drum",
                },
                {
                  code: "1N2",
                  material: "other_metal",
                  description:
                    "Removable head metal drum other than steel or aluminum",
                },
              ],
            },
            {
              type: "jerricans",
              containers: [
                {
                  code: "3A2",
                  material: "steel",
                  description: "Removable head steel jerrican",
                },
                {
                  code: "3B2",
                  material: "aluminum",
                  description: "Removable head aluminum jerrican",
                },
                {
                  code: "3H2",
                  material: "plastic",
                  description: "Removable head plastic jerrican",
                },
              ],
            },
          ],
        },
        isComplete: true,
      },
      {
        id: "A13.15.1.packaging_combination",
        type: "combination",
        description: "Combination packaging in boxes, drums, or jerricans",
        innerPackaging: {
          required: false,
        },
        outerPackaging: {
          categories: [
            {
              type: "boxes",
              containers: [
                { code: "4A", material: "steel", description: "Steel box" },
                {
                  code: "4B",
                  material: "aluminum",
                  description: "Aluminum box",
                },
                {
                  code: "4C1",
                  material: "natural_wood",
                  description: "Ordinary natural wood box",
                },
                {
                  code: "4C2",
                  material: "natural_wood",
                  description: "Sift-proof natural wood box",
                },
                { code: "4D", material: "plywood", description: "Plywood box" },
                {
                  code: "4F",
                  material: "reconstituted_wood",
                  description: "Reconstituted wood box",
                },
                {
                  code: "4G",
                  material: "fiberboard",
                  description: "Fiberboard box",
                },
                {
                  code: "4H1",
                  material: "plastic",
                  description: "Expanded plastic box",
                },
                {
                  code: "4H2",
                  material: "plastic",
                  description: "Solid plastic box",
                },
                {
                  code: "4N",
                  material: "other_metal",
                  description: "Other metal box",
                },
              ],
            },
            {
              type: "drums",
              containers: [
                {
                  code: "1A2",
                  material: "steel",
                  description: "Removable head steel drum",
                },
                {
                  code: "1B2",
                  material: "aluminum",
                  description: "Removable head aluminum drum",
                },
                {
                  code: "1D",
                  material: "plywood",
                  description: "Plywood drum",
                },
                { code: "1G", material: "fiber", description: "Fiber drum" },
                {
                  code: "1H2",
                  material: "plastic",
                  description: "Removable head plastic drum",
                },
                {
                  code: "1N2",
                  material: "other_metal",
                  description:
                    "Removable head metal drum other than steel or aluminum",
                },
              ],
            },
            {
              type: "jerricans",
              containers: [
                {
                  code: "3A2",
                  material: "steel",
                  description: "Removable head steel jerrican",
                },
                {
                  code: "3B2",
                  material: "aluminum",
                  description: "Removable head aluminum jerrican",
                },
                {
                  code: "3H2",
                  material: "plastic",
                  description: "Removable head plastic jerrican",
                },
              ],
            },
          ],
        },
        isComplete: true,
      },
    ],

    specialRequirements: [
      {
        type: "classification_requirement",
        description:
          "Items must be classified as Class 9 and approved by DOT according to 49 CFR 173.166",
        mandatory: true,
        applicableContainers: [
          "A13.15.1.packaging_single",
          "A13.15.1.packaging_combination",
        ],
      },
    ],

    quantityLimits: [],

    referencedParagraphs: ["A13.15.", "49 CFR 173.166"],
  },

  // Phase 3, Week 14: Class 9 Miscellaneous Entry - A13.17 (Polymeric Beads, Expandable; Plastic Molding Compound)
  "A13.17.": {
    paragraphId: "A13.17.",
    hazardClass: 9,
    description:
      "Package Polymeric Beads, Expandable and Plastic Molding Compound as follows: Pack polymeric beads or granules, expandable, evolving flammable vapor and plastic molding compound in dough, sheet or extruded rope form, evolving flammable vapor in boxes or drums.",
    lastUpdated: new Date().toISOString(),
    entryType: "specialized",
    materialTypes: [
      "polymeric_beads_expandable",
      "plastic_molding_compound",
      "un2211",
      "un3314",
    ],
    applicableUNNumbers: ["UN2211", "UN3314"],

    packagingOptions: [
      {
        id: "A13.17.1.combination_with_liner",
        type: "combination",
        description: "Sealed plastic liner in boxes or drums",
        innerPackaging: {
          required: true,
          materials: ["Sealed plastic liner"],
        },
        outerPackaging: {
          categories: [
            {
              type: "boxes",
              containers: [
                { code: "4A", material: "steel", description: "Steel box" },
                {
                  code: "4B",
                  material: "aluminum",
                  description: "Aluminum box",
                },
                {
                  code: "4C1",
                  material: "natural_wood",
                  description: "Ordinary natural wood box",
                },
                {
                  code: "4C2",
                  material: "natural_wood",
                  description: "Sift-proof natural wood box",
                },
                { code: "4D", material: "plywood", description: "Plywood box" },
                {
                  code: "4F",
                  material: "reconstituted_wood",
                  description: "Reconstituted wood box",
                },
                {
                  code: "4G",
                  material: "fiberboard",
                  description: "Fiberboard box",
                },
                {
                  code: "4H1",
                  material: "plastic",
                  description: "Expanded plastic box",
                },
                {
                  code: "4H2",
                  material: "plastic",
                  description: "Solid plastic box",
                },
                {
                  code: "4N",
                  material: "other_metal",
                  description: "Other metal box",
                },
              ],
            },
            {
              type: "drums",
              containers: [
                {
                  code: "1D",
                  material: "plywood",
                  description: "Plywood drum",
                },
                { code: "1G", material: "fiber", description: "Fiber drum" },
              ],
            },
          ],
        },
        isComplete: true,
      },
      {
        id: "A13.17.2.single_vapor_tight_drums",
        type: "single",
        description: "Vapor tight metal or plastic drums (no liner required)",
        innerPackaging: {
          required: false,
        },
        outerPackaging: {
          categories: [
            {
              type: "drums",
              containers: [
                { code: "1A1", material: "steel", description: "Steel drum" },
                {
                  code: "1A2",
                  material: "steel",
                  description: "Removable head steel drum",
                },
                {
                  code: "1B1",
                  material: "aluminum",
                  description: "Aluminum drum",
                },
                {
                  code: "1B2",
                  material: "aluminum",
                  description: "Removable head aluminum drum",
                },
                {
                  code: "1H1",
                  material: "plastic",
                  description: "Plastic drum",
                },
                {
                  code: "1H2",
                  material: "plastic",
                  description: "Removable head plastic drum",
                },
                {
                  code: "1N1",
                  material: "other_metal",
                  description: "Metal drum other than steel or aluminum",
                },
                {
                  code: "1N2",
                  material: "other_metal",
                  description:
                    "Removable head metal drum other than steel or aluminum",
                },
              ],
            },
          ],
        },
        isComplete: true,
      },
    ],

    specialRequirements: [],
    quantityLimits: [],
    referencedParagraphs: ["A13.17."],
  },
};

/**
 * Get packaging entry by paragraph ID
 */
export function getPackagingEntry(
  paragraphId: string
): PackagingParagraphEntry | null {
  const entry = packagingDatabaseV2[paragraphId];
  return entry || null;
}

/**
 * Get available packaging options with context filtering
 */
export function getAvailablePackagingOptions(
  paragraphId: string,
  userContext: PackagingContext = {}
): PackagingOption[] {
  const entry = getPackagingEntry(paragraphId);
  if (!entry) {
    console.warn(`No packaging entry found for paragraph ${paragraphId}`);
    return [];
  }

  let availableOptions = [...entry.packagingOptions];

  // Apply conditional requirements if present
  if (entry.conditionalRequirements) {
    availableOptions = evaluateConditionalRequirements(
      availableOptions,
      entry.conditionalRequirements,
      userContext
    );
  }

  // Apply context-based filtering to each option
  availableOptions = availableOptions.map(option => {
    const contextualOption = { ...option };

    // Apply contextual filtering to container categories
    if (contextualOption.outerPackaging?.categories) {
      const filteredCategories = contextualOption.outerPackaging.categories.map(
        category => {
          const filteredContainers = applyContextualFiltering(
            category.containers,
            userContext
          );
          return {
            ...category,
            containers: filteredContainers,
          };
        }
      );

      contextualOption.outerPackaging = {
        categories: optimizePackagingCategories(filteredCategories),
      };
    }

    return contextualOption;
  });

  // Filter out options with no available containers
  return availableOptions.filter(option =>
    option.outerPackaging?.categories?.some(
      category => category.containers.length > 0
    )
  );
}

/**
 * Get packaging options by category
 */
export function getPackagingOptionsByCategory(
  paragraphId: string,
  category: "combination" | "single" | "composite" | "cylinder" | "specialized",
  userContext: PackagingContext = {}
): PackagingOption[] {
  const allOptions = getAvailablePackagingOptions(paragraphId, userContext);

  switch (category) {
    case "combination":
      return allOptions.filter(option => option.type === "combination");

    case "single":
      return allOptions.filter(option => option.type === "single");

    case "composite":
      return allOptions.filter(
        option =>
          option.type === "composite_plastic" ||
          option.type === "composite_glass"
      );

    case "cylinder":
      return allOptions.filter(option => option.type === "cylinder");

    case "specialized":
      return allOptions.filter(option => option.type === "specialized");

    default:
      return [];
  }
}

/**
 * Get recommended packaging option based on context
 */
export function getRecommendedPackagingOption(
  paragraphId: string,
  userContext: PackagingContext
): PackagingOption | null {
  const options = getAvailablePackagingOptions(paragraphId, userContext);

  if (options.length === 0) return null;

  // Score options based on context
  const scoredOptions = options.map(option => ({
    option,
    score: scorePackagingOption(option, userContext),
  }));

  // Sort by score (highest first)
  scoredOptions.sort((a, b) => b.score - a.score);

  return scoredOptions[0].option;
}

/**
 * Validate packaging selection against entry requirements
 */
export function validatePackagingForEntry(
  paragraphId: string,
  selection: PackagingSelection,
  userContext: PackagingContext
): ValidationResult {
  const entry = getPackagingEntry(paragraphId);
  if (!entry) {
    return {
      isValid: false,
      errors: [`No packaging entry found for paragraph ${paragraphId}`],
      warnings: [],
    };
  }

  return validatePackagingSelection(selection, entry, userContext);
}

// ============================================================================
// CONDITIONAL LOGIC ENGINE
// ============================================================================

/**
 * Evaluate packaging conditions for a specific context
 */
export function evaluatePackagingConditions(
  option: PackagingOption,
  context: PackagingContext,
  conditions: ConditionalRequirement[]
): boolean {
  if (!conditions || conditions.length === 0) return true;

  return conditions.every(condition => {
    const conditionMet = evaluateCondition(condition, context);

    // If condition is not met, the option is available
    if (!conditionMet) return true;

    // If condition is met, check the effect
    switch (condition.effect) {
      case "prohibit":
        return (
          option.id !== condition.target && option.type !== condition.target
        );

      case "restrict":
        // Option is available but with restrictions
        return true;

      case "require":
        // Option is available but with requirements
        return true;

      case "modify":
        // Option is available but modified
        return true;

      default:
        return true;
    }
  });
}

/**
 * Apply conditional modifications to packaging options
 */
export function applyConditionalModifications(
  options: PackagingOption[],
  context: PackagingContext,
  conditions: ConditionalRequirement[]
): PackagingOption[] {
  if (!conditions || conditions.length === 0) return options;

  return options.map(option => {
    const modifiedOption = { ...option };

    conditions.forEach(condition => {
      const conditionMet = evaluateCondition(condition, context);

      if (
        conditionMet &&
        (option.id === condition.target || option.type === condition.target)
      ) {
        switch (condition.effect) {
          case "restrict":
            modifiedOption.restrictions = [
              ...(modifiedOption.restrictions || []),
              condition.description || "",
            ];
            break;

          case "require":
            modifiedOption.notes = [
              ...(modifiedOption.notes || []),
              `Required: ${condition.description || ""}`,
            ];
            break;

          case "modify":
            modifiedOption.description += ` (${condition.description || ""})`;
            break;
        }
      }
    });

    return modifiedOption;
  });
}

/**
 * Evaluate a single condition
 */
function evaluateCondition(
  condition: ConditionalRequirement,
  context: PackagingContext
): boolean {
  const contextValue = getContextValue(context, condition.conditionType);

  if (contextValue === undefined || contextValue === null) {
    return false;
  }

  try {
    switch (condition.operator) {
      case "equals":
        return contextValue === condition.value;

      case "greater_than":
        return Number(contextValue) > Number(condition.value);

      case "less_than":
        return Number(contextValue) < Number(condition.value);

      case "in_range":
        if (
          typeof condition.value === "object" &&
          condition.value.min !== undefined &&
          condition.value.max !== undefined
        ) {
          const numValue = Number(contextValue);
          return (
            numValue >= condition.value.min && numValue <= condition.value.max
          );
        }
        return false;

      case "contains":
        if (Array.isArray(contextValue)) {
          return contextValue.includes(condition.value);
        }
        return String(contextValue).includes(String(condition.value));

      default:
        return false;
    }
  } catch (error) {
    console.warn(`Error evaluating condition: ${error}`);
    return false;
  }
}

/**
 * Get context value by condition type
 */
function getContextValue(
  context: PackagingContext,
  conditionType: string | undefined
): any {
  if (!conditionType) {
    return undefined;
  }
  switch (conditionType) {
    case "packing_group":
      return context.packingGroup;
    case "concentration":
      return context.concentration;
    case "temperature":
      return context.temperature;
    case "volume":
      return context.volume;
    case "material_state":
      return context.materialState;
    case "un_number":
      return context.unNumber;
    case "hazard_class":
      return context.hazardClass;
    default:
      return undefined;
  }
}

// ============================================================================
// PACKAGING OPTION SCORING
// ============================================================================

/**
 * Score packaging option based on context preferences
 */
function scorePackagingOption(
  option: PackagingOption,
  context: PackagingContext
): number {
  let score = 0;

  // Base scores by type
  const typeScores = {
    single: 100, // Simplest option
    combination: 90, // Standard option
    composite_plastic: 80,
    composite_glass: 70,
    cylinder: 60, // Specialized
    specialized: 50, // Most complex
    equipment: 40, // Equipment-specific
  };

  score += typeScores[option.type] || 0;

  // Bonus for fewer restrictions
  const restrictionPenalty = (option.restrictions?.length || 0) * 5;
  score -= restrictionPenalty;

  // Context-specific scoring
  if (context.materialState === "gas" && option.type === "cylinder") {
    score += 50; // Cylinders preferred for gases
  }

  if (context.packingGroup === "I" && option.type === "single") {
    score += 20; // Single packaging often better for PG I
  }

  // Container material preferences
  if (option.outerPackaging?.categories) {
    const hasSteel = option.outerPackaging.categories.some(cat =>
      cat.containers.some(cont => cont.material === "steel")
    );
    if (hasSteel) score += 10; // Steel containers generally preferred

    const hasPlastic = option.outerPackaging.categories.some(cat =>
      cat.containers.some(cont => cont.material === "plastic")
    );
    if (hasPlastic && context.hazardClass === 8) {
      score -= 5; // Plastic less preferred for corrosives
    }
  }

  return Math.max(0, score); // Ensure non-negative
}

// ============================================================================
// ADVANCED SEARCH AND FILTERING
// ============================================================================

/**
 * Search packaging entries by criteria
 */
export function searchPackagingEntries(criteria: {
  hazardClass?: number;
  entryType?: string;
  description?: string;
  materialTypes?: string[];
}): PackagingParagraphEntry[] {
  return Object.values(packagingDatabaseV2).filter(entry => {
    if (criteria.hazardClass && entry.hazardClass !== criteria.hazardClass) {
      return false;
    }

    if (criteria.entryType && entry.entryType !== criteria.entryType) {
      return false;
    }

    if (
      criteria.description &&
      !entry.description
        .toLowerCase()
        .includes(criteria.description.toLowerCase())
    ) {
      return false;
    }

    if (criteria.materialTypes && entry.materialTypes) {
      const hasMatchingType = criteria.materialTypes.some(type =>
        entry.materialTypes?.includes(type)
      );
      if (!hasMatchingType) return false;
    }

    return true;
  });
}

/**
 * Get all packaging entries for a hazard class
 */
export function getPackagingEntriesByHazardClass(
  hazardClass: number
): PackagingParagraphEntry[] {
  return searchPackagingEntries({ hazardClass });
}

/**
 * Get packaging statistics
 */
export function getPackagingStatistics(): {
  totalEntries: number;
  entriesByClass: Record<number, number>;
  entriesByType: Record<string, number>;
  averageOptionsPerEntry: number;
} {
  const entries = Object.values(packagingDatabaseV2);
  const totalEntries = entries.length;

  const entriesByClass: Record<number, number> = {};
  const entriesByType: Record<string, number> = {};
  let totalOptions = 0;

  entries.forEach(entry => {
    // Count by hazard class
    entriesByClass[entry.hazardClass] =
      (entriesByClass[entry.hazardClass] || 0) + 1;

    // Count by entry type
    entriesByType[entry.entryType] = (entriesByType[entry.entryType] || 0) + 1;

    // Count total options
    totalOptions += entry.packagingOptions.length;
  });

  return {
    totalEntries,
    entriesByClass,
    entriesByType,
    averageOptionsPerEntry: totalEntries > 0 ? totalOptions / totalEntries : 0,
  };
}

// ============================================================================
// PERFORMANCE OPTIMIZATION
// ============================================================================

/**
 * Cache for frequently accessed packaging entries
 */
const packagingCache = new Map<
  string,
  {
    entry: PackagingParagraphEntry;
    timestamp: number;
  }
>();

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Get packaging entry with caching
 */
export function getCachedPackagingEntry(
  paragraphId: string
): PackagingParagraphEntry | null {
  const cached = packagingCache.get(paragraphId);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.entry;
  }

  const entry = getPackagingEntry(paragraphId);
  if (entry) {
    packagingCache.set(paragraphId, {
      entry,
      timestamp: Date.now(),
    });
  }

  return entry;
}

/**
 * Clear packaging cache
 */
export function clearPackagingCache(): void {
  packagingCache.clear();
}

/**
 * Get cache statistics
 */
export function getCacheStatistics(): {
  size: number;
  hitRate: number;
  oldestEntry: number;
} {
  const now = Date.now();
  let oldestTimestamp = now;

  packagingCache.forEach(({ timestamp }) => {
    if (timestamp < oldestTimestamp) {
      oldestTimestamp = timestamp;
    }
  });

  return {
    size: packagingCache.size,
    hitRate: 0, // Would need hit/miss tracking for accurate calculation
    oldestEntry: oldestTimestamp,
  };
}

// ============================================================================
// DEBUGGING AND DEVELOPMENT UTILITIES
// ============================================================================

/**
 * Debug packaging lookup for development
 */
export function debugPackagingLookup(
  paragraphId: string,
  context: PackagingContext = {}
): {
  entry: PackagingParagraphEntry | null;
  options: PackagingOption[];
  appliedConditions: ConditionalRequirement[];
  contextFilters: string[];
  timing: {
    entryLookup: number;
    optionFiltering: number;
    conditionEvaluation: number;
    total: number;
  };
} {
  const startTime = performance.now();

  // Entry lookup timing
  const entryStart = performance.now();
  const entry = getPackagingEntry(paragraphId);
  const entryTime = performance.now() - entryStart;

  if (!entry) {
    return {
      entry: null,
      options: [],
      appliedConditions: [],
      contextFilters: [],
      timing: {
        entryLookup: entryTime,
        optionFiltering: 0,
        conditionEvaluation: 0,
        total: performance.now() - startTime,
      },
    };
  }

  // Option filtering timing
  const filterStart = performance.now();
  const options = getAvailablePackagingOptions(paragraphId, context);
  const filterTime = performance.now() - filterStart;

  // Condition evaluation timing
  const conditionStart = performance.now();
  const appliedConditions =
    entry.conditionalRequirements?.filter(condition =>
      evaluateCondition(condition, context)
    ) || [];
  const conditionTime = performance.now() - conditionStart;

  // Generate context filter description
  const contextFilters: string[] = [];
  if (context.packingGroup)
    contextFilters.push(`Packing Group: ${context.packingGroup}`);
  if (context.materialState)
    contextFilters.push(`Material State: ${context.materialState}`);
  if (context.hazardClass)
    contextFilters.push(`Hazard Class: ${context.hazardClass}`);
  if (context.temperature !== undefined)
    contextFilters.push(`Temperature: ${context.temperature}°C`);
  if (context.volume !== undefined)
    contextFilters.push(`Volume: ${context.volume}L`);

  return {
    entry,
    options,
    appliedConditions,
    contextFilters,
    timing: {
      entryLookup: entryTime,
      optionFiltering: filterTime,
      conditionEvaluation: conditionTime,
      total: performance.now() - startTime,
    },
  };
}
