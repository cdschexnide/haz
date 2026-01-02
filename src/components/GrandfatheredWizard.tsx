import {
  ExceptionsWithAppliesTo,
  ExceptionWithCondition,
  RequirementsObject,
  WeightUnits,
} from "../../server/data/grandfatheredPackagingParagraphReferences";
import { useHazProStore } from "@/stores/useHazProStore";
import colors from "@/theming/colors";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { BlackPowderSpecOption } from "./shared/BlackPowerSpecOption";
import { DetonatingFuzesSpecOption } from "./shared/DetonatingFuzesSpecOption";
import { DetonatorsSpecOption } from "./shared/DetonatorsSpecOption";
import { DimensionDisplay } from "./shared/DimensionDisplay";
import { ExceptionContainer } from "./shared/ExceptionContainer";
import { ExplosiveBombMineSpecOption } from "./shared/ExplosiveBombMineSpecOption";
import { ExplosiveMunitionsSpecOption } from "./shared/ExplosiveMunitionsSpecOption";
import { ExplosiveRivetsSpecOption } from "./shared/ExplosiveRivetsSpecOption";
import { FeaturesDisplay } from "./shared/FeaturesDisplay";
import { FuzesSpecOption } from "./shared/FuzesSpecOption";
import { HighExplosivesCartridgesSpecOption } from "./shared/HighExplosivesCartridgesSpecOption";
import { HighExplosivesLiquidsSpecOption } from "./shared/HighExplosivesLiquidsSpecOption";
import { HighExplosivesNitroglycerinSpecOption } from "./shared/HighExplosivesNitroglycerinSpecOption";
import { HighExplosivesNonLiquidSpecOption } from "./shared/HighExplosivesNonLiquidSpecOption";
import { HighExplosivesSpecOption } from "./shared/HighExplosivesSpecOption";
import { InfoCardItem } from "./shared/InfoCardItem";
import { NotesDisplay } from "./shared/NotesDisplay";
import PolystyreneContainerDetails from "./shared/PolystyreneContainerDetails";
import { PracticeAmmoSpecOption } from "./shared/PracticeAmmoSpecOption";
import { PropellantExplosivesSpecOption } from "./shared/PropellantExplosivesSpecOption";
import { RailwayTorpedoesSpecOption } from "./shared/RailwayTorpedoesSpecOption";
import { RocketMotorJetThrustSpecOption } from "./shared/RocketMotorJetThrustSpecOption";
import { SectionHeader } from "./shared/SectionHeader";
import { SelectionOption } from "./shared/SelectionOption";
import SmallArmsAmmunitionSpecOption from "./shared/SmallArmsAmmunitionSpecOption";
import { SmallArmsPrimersSpecOption } from "./shared/SmallArmsPrimersSpecOption";
import { SpecialFireworksSpecOption } from "./shared/SpecialFireworksSpecOption";
import { TearGasGrenadesSpecOption } from "./shared/TearGasGrenadesSpecOption";
import { WeightDisplay } from "./shared/WeightDisplay";

type WizardStep = {
  id: number;
  title: string;
};

type WizardSelections = {
  containerType?: string;
  containerSpec?: string;
  additionalOptions?: Record<string, any>;
  containerData?: any;
};

interface GrandfatheredWizardProps {
  onComplete?: (data: WizardSelections) => void;
  onCancel?: () => void;
  onSaveExit?: (data: WizardSelections) => void;
  initialData?: WizardSelections;
  navigation: any;
}

const GrandfatheredWizard = ({
  onComplete,
  onCancel,
  onSaveExit,
  initialData,
  navigation,
}: GrandfatheredWizardProps) => {
  const { state, store } = useHazProStore();
  const { grandfatheredExplosive } = state.hazProPreparerContext || {};
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selections, setSelections] = useState<WizardSelections>(
    initialData || {}
  );
  const [containerOptions, setContainerOptions] = useState<any[]>([]);
  const [specOptions, setSpecOptions] = useState<string[]>([]);
  const [additionalOptionFields, setAdditionalOptionFields] = useState<any[]>(
    []
  );
  const [dimensionInputs, setDimensionInputs] = useState<{
    length?: { inches: string; centimeters: string };
    width?: { inches: string; centimeters: string };
    height?: { inches: string; centimeters: string };
    diameter?: { inches: string; centimeters: string };
    thickness?: { inches: string; centimeters: string };
  }>({});

  const [dimensionErrors, setDimensionErrors] = useState<{
    length?: string;
    width?: string;
    height?: string;
    diameter?: string;
    thickness?: string;
  }>({});

  const steps: WizardStep[] = [
    { id: 1, title: "Review Information" },
    { id: 2, title: "Select Container Type" },
    { id: 3, title: "Select Specifications" },
  ];

  useEffect(() => {
    if (grandfatheredExplosive?.packagingParagraphReferenceData) {
      extractContainerOptions();
    }
  }, [grandfatheredExplosive]);

  useEffect(() => {
    if (selections.containerData && grandfatheredExplosive?.packageDimensions) {
      const existingDimensions = grandfatheredExplosive.packageDimensions;
      const initialDimensions: typeof dimensionInputs = {};

      for (const [key, value] of Object.entries(existingDimensions)) {
        if (value?.inches || value?.centimeters) {
          initialDimensions[key as keyof typeof dimensionInputs] = {
            inches: value.inches ? value.inches.toString() : "",
            centimeters: value.centimeters ? value.centimeters.toString() : "",
          };
        }
      }

      setDimensionInputs(initialDimensions);
    }
  }, [selections.containerData, grandfatheredExplosive?.packageDimensions]);

  const extractContainerOptions = () => {
    if (!grandfatheredExplosive) return;

    const { packagingInstructions } =
      grandfatheredExplosive.packagingParagraphReferenceData;

    let options: any[] = [];

    const hasA27_18_1SubParagraph =
      grandfatheredExplosive.tableA27_1CrossReference?.afman24_204_SubParagraphReferences?.includes(
        "A27.18.1."
      );

    const hasA27_18_2SubParagraph =
      grandfatheredExplosive.tableA27_1CrossReference?.afman24_204_SubParagraphReferences?.includes(
        "A27.18.2."
      );

    const hasA27_18_3SubParagraph =
      grandfatheredExplosive.tableA27_1CrossReference?.afman24_204_SubParagraphReferences?.includes(
        "A27.18.3."
      );

    const isA27_13 =
      grandfatheredExplosive?.tableA27_1CrossReference
        ?.afman24_204_Paragraph === "A27.13.";

    const isA27_21 =
      grandfatheredExplosive?.tableA27_1CrossReference
        ?.afman24_204_Paragraph === "A27.21.";

    const isA27_23 =
      grandfatheredExplosive?.tableA27_1CrossReference
        ?.afman24_204_Paragraph === "A27.23.";

    const isA27_24 =
      grandfatheredExplosive?.tableA27_1CrossReference
        ?.afman24_204_Paragraph === "A27.24.";

    const isA27_17 =
      grandfatheredExplosive?.tableA27_1CrossReference
        ?.afman24_204_Paragraph === "A27.17.";

    const isA27_26 =
      grandfatheredExplosive?.tableA27_1CrossReference
        ?.afman24_204_Paragraph === "A27.26.";

    const isA27_27 =
      grandfatheredExplosive?.tableA27_1CrossReference
        ?.afman24_204_Paragraph === "A27.27.";

    const hasNonLiquidSubParagraphs =
      grandfatheredExplosive.tableA27_1CrossReference?.afman24_204_SubParagraphReferences?.some(
        ref =>
          [
            "A27.18.4.",
            "A27.18.5.",
            "A27.18.6.",
            "A27.18.7.",
            "A27.18.8.",
            "A27.18.9.",
            "A27.18.10.",
            "A27.18.11.",
            "A27.18.12.",
          ].includes(ref)
      );

    const isA27_7 =
      grandfatheredExplosive?.tableA27_1CrossReference
        ?.afman24_204_Paragraph === "A27.7.";

    // Get the applicable non-liquid subparagraphs
    const applicableNonLiquidSubparagraphs =
      grandfatheredExplosive.tableA27_1CrossReference?.afman24_204_SubParagraphReferences?.filter(
        ref =>
          [
            "A27.18.4.",
            "A27.18.5.",
            "A27.18.6.",
            "A27.18.7.",
            "A27.18.8.",
            "A27.18.9.",
            "A27.18.10.",
            "A27.18.11.",
            "A27.18.12.",
          ].includes(ref)
      ) || [];

    if (
      grandfatheredExplosive.tableA27_1CrossReference?.afman24_204_Paragraph ===
      "A27.5."
    ) {
      if (packagingInstructions.outerPackaging) {
        if (packagingInstructions.outerPackaging.woodenBoxes) {
          packagingInstructions.outerPackaging.woodenBoxes.forEach(
            (spec: any) => {
              options.push({
                type: `Wooden Box (${spec})`,
                spec: spec,
                description: "Detonators, Class A and Class C Explosives",
              });
            }
          );
        }

        if (packagingInstructions.outerPackaging.fiberboardBoxes) {
          packagingInstructions.outerPackaging.fiberboardBoxes.forEach(
            (spec: any) => {
              options.push({
                type: `Fiberboard Box (${spec})`,
                spec: spec,
                description: "Detonators, Class A and Class C Explosives",
              });
            }
          );
        }
      }
    } else if (
      grandfatheredExplosive.tableA27_1CrossReference?.afman24_204_Paragraph ===
        "A27.18." &&
      hasA27_18_1SubParagraph
    ) {
      const liquidExplosivesRequirements = [];
      if (
        packagingInstructions.categories &&
        Array.isArray(packagingInstructions.categories)
      ) {
        const liquidExplosivesCategory = packagingInstructions.categories.find(
          category => category.referenceSection === "A27.18.1."
        );

        if (liquidExplosivesCategory && liquidExplosivesCategory.requirements) {
          liquidExplosivesRequirements.push(
            ...liquidExplosivesCategory.requirements
          );
        }
      }
      options = [
        {
          type: "Wooden Box (DOT 14)",
          description: "Container for high explosives with liquid ingredients",
          spec: "DOT 14",
          maxGrossWeight: { lbs: 75, kg: 34.02 },
          containerRequirements: [
            {
              description: "Absorbent Material Requirements",
              conditions: [
                "Must use sufficient absorbent material to prevent leakage",
                "Absorbent must remain effective under transportation conditions",
              ],
            },
          ],
          notes: [
            "Liquid ingredients must remain thoroughly absorbed under most unfavorable conditions",
            "Ingredients must be uniformly mixed",
          ],
        },
        {
          type: "Wooden Box (DOT 15A)",
          description: "Container for high explosives with liquid ingredients",
          spec: "DOT 15A",
          maxGrossWeight: { lbs: 75, kg: 34.02 },
          containerRequirements: [
            {
              description: "Absorbent Material Requirements",
              conditions: [
                "Must use sufficient absorbent material to prevent leakage",
                "Absorbent must remain effective under transportation conditions",
              ],
            },
          ],
          notes: [
            "Liquid ingredients must remain thoroughly absorbed under most unfavorable conditions",
            "Ingredients must be uniformly mixed",
          ],
        },
        {
          type: "Wooden Box (DOT 16A)",
          description: "Container for high explosives with liquid ingredients",
          spec: "DOT 16A",
          maxGrossWeight: { lbs: 75, kg: 34.02 },
          containerRequirements: [
            {
              description: "Absorbent Material Requirements",
              conditions: [
                "Must use sufficient absorbent material to prevent leakage",
                "Absorbent must remain effective under transportation conditions",
              ],
            },
          ],
          notes: [
            "Liquid ingredients must remain thoroughly absorbed under most unfavorable conditions",
            "Ingredients must be uniformly mixed",
          ],
        },
      ];
    } else if (
      grandfatheredExplosive.tableA27_1CrossReference?.afman24_204_Paragraph ===
        "A27.18." &&
      hasA27_18_2SubParagraph
    ) {
      const antacidRequirements = [
        "Antacid must have neutralizing power equivalent to magnesium carbonate equal to 1% of nitroglycerin content",
        "Mix high explosives containing nitroglycerin uniformly with absorbent material and antacid",
        "Ensure uniform mixing to maintain absorption under all transportation conditions",
      ];

      options = [
        {
          type: "Wooden Box (DOT 14)",
          description: "Container for high explosives with nitroglycerin",
          spec: "DOT 14",
          maxGrossWeight: { lbs: 75, kg: 34.02 },
          antacidRequirements: antacidRequirements,
          subcategory: "High Explosives with Nitroglycerin",
          notes: [
            "Antacid must have neutralizing power of magnesium carbonate equal to 1% of nitroglycerin",
            "Must be uniformly mixed with absorbent material and antacid",
          ],
        },
        {
          type: "Wooden Box (DOT 15A)",
          description: "Container for high explosives with nitroglycerin",
          spec: "DOT 15A",
          maxGrossWeight: { lbs: 75, kg: 34.02 },
          antacidRequirements: antacidRequirements,
          subcategory: "High Explosives with Nitroglycerin",
          notes: [
            "Antacid must have neutralizing power of magnesium carbonate equal to 1% of nitroglycerin",
            "Must be uniformly mixed with absorbent material and antacid",
          ],
        },
        {
          type: "Wooden Box (DOT 16A)",
          description: "Container for high explosives with nitroglycerin",
          spec: "DOT 16A",
          maxGrossWeight: { lbs: 75, kg: 34.02 },
          antacidRequirements: antacidRequirements,
          subcategory: "High Explosives with Nitroglycerin",
          notes: [
            "Antacid must have neutralizing power of magnesium carbonate equal to 1% of nitroglycerin",
            "Must be uniformly mixed with absorbent material and antacid",
          ],
        },
        {
          type: "Metal Drum (DOT 13A)",
          description: "Metal drum for high explosives with nitroglycerin",
          spec: "DOT 13A",
          maxGrossWeight: { lbs: 90, kg: 40.82 },
          antacidRequirements: antacidRequirements,
          subcategory: "High Explosives with Nitroglycerin",
          notes: [
            "Antacid must have neutralizing power of magnesium carbonate equal to 1% of nitroglycerin",
            "Must be uniformly mixed with absorbent material and antacid",
          ],
        },
      ];
    } else if (
      grandfatheredExplosive.tableA27_1CrossReference?.afman24_204_Paragraph ===
        "A27.18." &&
      hasA27_18_3SubParagraph
    ) {
      const shellMaterials = [
        "Strong paper",
        "Polyethylene",
        "Paper and polyethylene (combined)",
      ];
      options = [
        {
          type: "Wooden Box (DOT 14)",
          description: "Container for high explosive cartridges",
          spec: "DOT 14",
          maxGrossWeight: { lbs: 75, kg: 34.02 },
          shellMaterials: shellMaterials,
          requirements: [
            "Must fully enclose explosive column",
            "Shell must be treated to prevent absorption of liquid ingredients",
          ],
          notes: [
            "Packaging suitable for cartridges using approved shell materials",
            "Ensure cartridge shells meet A27.18.3 requirements",
          ],
        },
        {
          type: "Wooden Box (DOT 15A)",
          description: "Container for high explosive cartridges",
          spec: "DOT 15A",
          maxGrossWeight: { lbs: 75, kg: 34.02 },
          shellMaterials: shellMaterials,
          requirements: [
            "Must fully enclose explosive column",
            "Shell must be treated to prevent absorption of liquid ingredients",
          ],
          notes: [
            "Packaging suitable for cartridges using approved shell materials",
            "Ensure cartridge shells meet A27.18.3 requirements",
          ],
        },
        {
          type: "Wooden Box (DOT 16A)",
          description: "Container for high explosive cartridges",
          spec: "DOT 16A",
          maxGrossWeight: { lbs: 75, kg: 34.02 },
          shellMaterials: shellMaterials,
          requirements: [
            "Must fully enclose explosive column",
            "Shell must be treated to prevent absorption of liquid ingredients",
          ],
          notes: [
            "Packaging suitable for cartridges using approved shell materials",
            "Ensure cartridge shells meet A27.18.3 requirements",
          ],
        },
      ];
    } else if (isA27_13) {
      options = [
        {
          type: "Wooden or Metal Boxes (General)",
          description:
            "Strong wooden or metal boxes for explosive bombs, mines, projectiles, torpedoes, or grenades",
          subparagraphReference: "A27.13.1.",
          containerType: "Strong wooden or metal boxes",
        },
        {
          type: "Unboxed with Pallet or Bracing",
          description:
            "Unboxed shipping option for large explosive bombs, mines, projectiles and torpedoes",
          subparagraphReference: "A27.13.2.",
          isException: true,
          exceptionDetails: {
            condition:
              "Explosive bombs, mines, projectiles, torpedoes over 90 lbs or projectiles ≥ 4¾ inches diameter",
            packaging:
              "May be shipped unboxed if securely fastened to pallets or blocked/braced",
          },
        },
        {
          type: "Wooden or Metal Boxes (Gas/Smoke/Incendiary)",
          description:
            "Strong wooden or metal boxes for bombs, grenades, or projectiles with gas, smoke, or incendiary charges",
          subparagraphReference: "A27.13.3.",
          containerType: "Strong wooden or metal boxes",
          notes: [
            "For bombs, grenades, or projectiles containing gas, smoke, or incendiary charges and bursting charges",
          ],
        },
        {
          type: "Multiple Grenades or Mines Package",
          description:
            "Package for multiple grenades or mines with weight limit",
          subparagraphReference: "A27.13.3.1.",
          containerType: "Strong wooden or metal boxes",
          maxGrossWeight: {
            lbs: 250,
            kg: 113.4,
          },
        },
        {
          type: "Multiple Explosive Bombs, Warheads, or Projectiles Package",
          description:
            "Package for multiple explosive bombs, warheads, or projectiles with weight limit",
          subparagraphReference: "A27.13.3.2.",
          containerType: "Strong wooden or metal boxes",
          maxGrossWeight: {
            lbs: 1400,
            kg: 635.03,
          },
        },
        {
          type: "Mine-Dispensing Subsystem Package",
          description:
            "Wooden or metal containers for mine-dispensing subsystems and canisters",
          subparagraphReference: "A27.13.4.",
          containerType: "Wooden or metal containers",
          items: [
            "XM47",
            "XM42",
            "XM42E1",
            "SX54",
            "XM2",
            "XM12",
            "XM12E1",
            "XM12E2",
            "XM12E3",
            "XM17",
          ],
          shippingNotes: [
            "Do not stack wooden containers more than 3 high; allow 3 ft overhead clearance",
            "Provide 2 ft clearance in front of inspection door in aircraft",
            "Tiedown must permit inspection door access (nets not considered obstruction)",
            "Max gross weight of wooden container: 675 lbs",
          ],
          maxGrossWeight: {
            lbs: 675,
            kg: 306.17,
          },
        },
        {
          type: "BLU 50/B Bomblets Package",
          description: "Fiberboard-lined plywood boxes for BLU 50/B bomblets",
          subparagraphReference: "A27.13.5.",
          containerType: "Specially designed fiberboard-lined plywood boxes",
          item: "BLU 50/B bomblets",
          innerPackaging: {
            description:
              "10 bomblets per preformed polyurethane cushioning in heat-sealed barrier bag",
          },
        },
        {
          type: "Explosive Mines in Metal Drum PA 16",
          description: "Metal drums with freon for explosive mines",
          subparagraphReference: "A27.13.6.",
          containerType: "Metal drum PA 16",
          item: "Explosive mines",
          configuration:
            "14 inside can assemblies with perforated tops, preformed packing, and 2 base assemblies; filled with liquid freon; 2 sight gauges for liquid level monitoring",
        },
        {
          type: "Explosive Mines in Metal Drum PA 17",
          description: "Metal drums with freon for explosive mines",
          subparagraphReference: "A27.13.7.",
          containerType: "Metal drum PA 17",
          item: "Explosive mines",
          configuration:
            "Preformed packing holding mines below liquid freon level; 2 sight gauges for liquid level monitoring",
        },
        {
          type: "CDU Package with Freon",
          description:
            "Military-approved wooden boxes for CDUs filled with freon",
          subparagraphReference: "A27.13.8.",
          containerType:
            "Wooden boxes approved by military specification or drawing",
          item: "CDU-4/B (SM41E1), CDE-5/B (XM40ES), CDU-10 (XM40ES/SM44), CDU-14/B (XM64)",
          notes: ["Fill with liquid freon and electrically monitor level"],
        },
        {
          type: "7.2-inch Projector Charge on Steel Pallet",
          description: "Steel pallet for 7.2-inch projector charge",
          subparagraphReference: "A27.13.9.",
          containerType: "Assembled to 40x48 inch steel pallet",
          item: "7.2 inch projector charge",
          maxGrossWeight: {
            lbs: 2000,
            kg: 907.18,
          },
        },
        {
          type: "CBU-55/B with Fuel Package",
          description:
            "CNU-120/E container for CBU-55/B with ethylene oxide fuel",
          subparagraphReference: "A27.13.10.",
          containerType: "CNU-120/E",
          item: "CBU-55/B with explosive and ethylene oxide fuel",
        },
        {
          type: "CBU-55/B without Fuel Package",
          description: "CNU-120/E container for CBU-55/B without fuel",
          subparagraphReference: "A27.13.11.",
          containerType: "CNU-120/E",
          item: "CBU-55/B without fuel",
        },
        {
          type: "CBU-33/A Package",
          description: "Plastic containers for CBU-33/A",
          subparagraphReference: "A27.13.12.",
          containerType:
            "Plastic containers CNU-104/E conforming to MIL-P-22748A, class A, grade 6",
          item: "CBU-33/A",
          maxGrossWeight: {
            lbs: 1200,
            kg: 544.31,
          },
        },
      ];
    } else if (isA27_17) {
      options = [
        {
          type: "Wooden Box (DOT 14)",
          description: "Container for special fireworks",
          spec: "DOT 14",
          maxGrossWeight: { lbs: 125, kg: 56.7 },
          fireworksTypes: [
            "Display or Special Fireworks",
            "Class B Explosives",
          ],
          packagingRequirements: [
            "Must be securely packed",
            "Must prevent movement during transport",
            "Must prevent escape of any explosive substance",
          ],
          notes: [
            "Special fireworks packaging for Class B materials",
            "For display or other special purpose fireworks",
          ],
        },
        {
          type: "Wooden Box (DOT 15A)",
          description: "Container for special fireworks",
          spec: "DOT 15A",
          maxGrossWeight: { lbs: 125, kg: 56.7 },
          fireworksTypes: [
            "Display or Special Fireworks",
            "Class B Explosives",
          ],
          packagingRequirements: [
            "Must be securely packed",
            "Must prevent movement during transport",
            "Must prevent escape of any explosive substance",
          ],
          notes: [
            "Special fireworks packaging for Class B materials",
            "For display or other special purpose fireworks",
          ],
        },
        {
          type: "Wooden Box (DOT 16A)",
          description: "Container for special fireworks",
          spec: "DOT 16A",
          maxGrossWeight: { lbs: 125, kg: 56.7 },
          fireworksTypes: [
            "Display or Special Fireworks",
            "Class B Explosives",
          ],
          packagingRequirements: [
            "Must be securely packed",
            "Must prevent movement during transport",
            "Must prevent escape of any explosive substance",
          ],
          notes: [
            "Special fireworks packaging for Class B materials",
            "For display or other special purpose fireworks",
          ],
        },
      ];
    } else if (isA27_27) {
      options = [
        {
          type: "Wooden Box",
          description: "Wooden box for toy caps",
          specs: ["DOT 15A", "DOT 16A"],
          maxGrossWeight: { lbs: 65, kg: 29.5 },
        },
        {
          type: "Fiberboard Box",
          description: "Fiberboard box for toy caps",
          specs: ["DOT 12H", "DOT 23F", "DOT 23H"],
          maxGrossWeight: { lbs: 65, kg: 29.5 },
        },
      ];
    } else if (
      grandfatheredExplosive.tableA27_1CrossReference?.afman24_204_Paragraph ===
      "A27.26."
    ) {
      options = [
        {
          type: "Wooden Box",
          description: "Small Arms Ammunition and Tear Gas Cartridges",
          innerPackagingTypes: [
            "Pasteboard boxes",
            "Other boxes",
            "Partitions",
            "Metal clips",
          ],
          innerPackagingRequirements: [
            "Must fit snugly and protect primers from accidental damage",
          ],
          outerPackagingTypes: ["Wooden boxes"],
          outerPackagingRequirements: [
            "Securely closed",
            "Must hold inside boxes, partitions, or metal clips",
          ],
          notes: [
            "Small Arms Ammunition and Small Arms Ammunition, Tear Gas Cartridges must be properly contained to prevent primer damage",
          ],
        },
        {
          type: "Fiberboard Box",
          description: "Small Arms Ammunition and Tear Gas Cartridges",
          innerPackagingTypes: [
            "Pasteboard boxes",
            "Other boxes",
            "Partitions",
            "Metal clips",
          ],
          innerPackagingRequirements: [
            "Must fit snugly and protect primers from accidental damage",
          ],
          outerPackagingTypes: ["Fiberboard boxes"],
          outerPackagingRequirements: [
            "Securely closed",
            "Must hold inside boxes, partitions, or metal clips",
          ],
          notes: [
            "Small Arms Ammunition and Small Arms Ammunition, Tear Gas Cartridges must be properly contained to prevent primer damage",
          ],
        },
        {
          type: "Metal Container",
          description: "Small Arms Ammunition and Tear Gas Cartridges",
          innerPackagingTypes: [
            "Pasteboard boxes",
            "Other boxes",
            "Partitions",
            "Metal clips",
          ],
          innerPackagingRequirements: [
            "Must fit snugly and protect primers from accidental damage",
          ],
          outerPackagingTypes: ["Metal containers"],
          outerPackagingRequirements: [
            "Securely closed",
            "Must hold inside boxes, partitions, or metal clips",
          ],
          notes: [
            "Small Arms Ammunition and Small Arms Ammunition, Tear Gas Cartridges must be properly contained to prevent primer damage",
          ],
        },
        {
          type: "Fiberboard Box (Bulk)",
          description: "For Blank Industrial Power Load Cartridges",
          bulkPackagingInfo: {
            applicableTo: "Blank industrial power load cartridges",
            type: "Fiberboard boxes",
            requirements: ["Securely closed"],
          },
          notes: [
            "Only blank industrial power load cartridges may be packed in bulk in securely closed fiberboard boxes",
          ],
        },
      ];
    } else if (
      grandfatheredExplosive.tableA27_1CrossReference?.afman24_204_Paragraph ===
        "A27.18." &&
      hasNonLiquidSubParagraphs
    ) {
      // container options specific to non-liquid high explosives based on applicable paragraphs
      options = [];

      // A27.18.12 specific wooden box options
      if (applicableNonLiquidSubparagraphs.includes("A27.18.12.")) {
        options.push({
          type: "Wooden Box (DOT 14/15A/16A/19B)",
          description:
            "Container for high explosives with no liquid explosive ingredient",
          spec: ["DOT 14", "DOT 15A", "DOT 16A", "DOT 19B"],
          maxGrossWeight: { lbs: 140, kg: 63.5 },
          packagingRequirements: [
            "Must be used for high explosives with no liquid explosive ingredient",
            "Gross weight cannot exceed 140 pounds",
          ],
          liningRequirements: [
            "Requires inside polyethylene bag with minimum thickness of 6 mils",
            "Alternative: lined with strong paraffined paper or other authorized material",
          ],
          applicableSubparagraphs: ["A27.18.12."],
          notes: [
            "When explosives contain over 5% moisture, boxes with handholes are not authorized",
          ],
        });
      }

      // A27.18.12 specific fiberboard box options
      if (applicableNonLiquidSubparagraphs.includes("A27.18.12.")) {
        options.push({
          type: "Fiberboard Box (DOT 12H/23F/23H)",
          description:
            "Fiberboard container for high explosives with no liquid ingredient",
          spec: ["DOT 12H", "DOT 23F", "DOT 23H"],
          maxGrossWeight: { lbs: 65, kg: 29.48 },
          packagingRequirements: [
            "Must be used for high explosives with no liquid explosive ingredient",
            "Gross weight cannot exceed 65 pounds",
          ],
          liningRequirements: [
            "Requires inside polyethylene bag with minimum thickness of 6 mils",
            "Alternative: lined with strong paraffined paper or other authorized material",
          ],
          applicableSubparagraphs: ["A27.18.12."],
          notes: [
            "When explosives contain over 5% moisture, boxes with handholes are not authorized",
          ],
        });
      }

      // A27.18.11 specific options - for explosives with <= 30% liquid ingredients
      if (applicableNonLiquidSubparagraphs.includes("A27.18.11.")) {
        options.push({
          type: "Wooden Box for Dynamite (≤30% liquid)",
          description:
            "Container for high explosives with ≤30% liquid explosive ingredients",
          spec: ["DOT 14", "DOT 15A", "DOT 16A", "DOT 19B"],
          maxGrossWeight: { lbs: 75, kg: 34.02 },
          packagingRequirements: [
            "For high explosives (dynamite) containing no more than 30% liquid explosive ingredients",
            "Inside containers must be cartridges or bags",
            "Inside cartridges max 12 inches diameter by 36 inches length or 50 pounds gross weight",
            "Bags must be securely closed to prevent leakage",
          ],
          applicableSubparagraphs: ["A27.18.11."],
          notes: ["A27.18.11.1.2 requirements apply"],
        });

        options.push({
          type: "Fiberboard Box (DOT 23G)",
          description: "Single cartridge container for high explosives",
          spec: "DOT 23G",
          maxGrossWeight: { lbs: 65, kg: 29.48 },
          packagingRequirements: [
            "No more than one cartridge in each box",
            "The gross weight of the box may not exceed 65 pounds",
          ],
          applicableSubparagraphs: ["A27.18.11."],
          notes: ["A27.18.11.1.1 requirements apply"],
        });
      }

      // A27.18.9 specific options
      if (applicableNonLiquidSubparagraphs.includes("A27.18.9.")) {
        options.push({
          type: "Siftproof Container",
          description:
            "For dynamite (except gelatin) with ≤30% liquid ingredients",
          packagingRequirements: [
            "For high explosive (dynamite), except gelatin dynamite",
            "For explosives in bags or in cartridges over 2 inches in diameter",
            "Containing not more than 30% liquid explosive ingredients",
          ],
          notes: [
            "May be packed in outer packagings without sawdust and without lining paper",
            "Each inside or outer packaging must be siftproof",
            "Must be treated to prevent penetration by the contained explosive",
          ],
          applicableSubparagraphs: ["A27.18.9."],
        });
      }

      // A27.18.5 specific options for lined boxes
      if (applicableNonLiquidSubparagraphs.includes("A27.18.5.")) {
        options.push({
          type: "Lined Box",
          description:
            "Box with strong, paraffined paper lining for high explosives",
          liningRequirements: [
            "Line with strong, paraffined paper or other suitable material",
            "Lining must be without joints or other openings",
            "Alternatively, use cemented joints at the bottom, ends, or sides of boxes",
            "For explosives with liquid ingredients, lining must be impervious to such ingredients and water",
            "Box covers must be protected from contact with explosives by lining paper or other suitable material",
          ],
          applicableSubparagraphs: ["A27.18.5."],
        });
      }

      // A27.18.4 specific options for bagged explosives
      if (applicableNonLiquidSubparagraphs.includes("A27.18.4.")) {
        options.push({
          type: "Bagged Explosives Container",
          description: "For high explosives in strong paper bags",
          bagRequirements: [
            "Bags must be made of strong paper or equally efficient material",
            "Bags must be treated or of such nature that they do not absorb the liquid ingredient of the explosive",
          ],
          applicableSubparagraphs: ["A27.18.4."],
        });
      }

      // A27.18.6 specific options for gelatine explosives
      if (applicableNonLiquidSubparagraphs.includes("A27.18.6.")) {
        options.push({
          type: "Gelatine Explosives Container",
          description: "For gelatine explosives in cartridges or bags",
          packagingRequirements: [
            "Pack gelatine explosives in cartridges or bags",
            "Use dry fine wood pulp or sawdust at least ¼ inch in depth spread over the bottom of the box",
            "The bottom of the box may have a full area pad formed of an absorptive cellulose sheet with equivalent nitroglycerin absorptive value",
          ],
          notes: [
            "Similar materials required for all non-gelatinous types of explosives containing 30% or more of liquid explosive ingredient",
          ],
          applicableSubparagraphs: ["A27.18.6."],
        });
      }

      if (options.length === 0) {
        options.push({
          type: "Container for High Explosives",
          description:
            "Generic container for high explosives with no liquid ingredient",
          applicableSubparagraphs: applicableNonLiquidSubparagraphs,
          notes: [
            "Specific requirements depend on the type of explosive",
            "Please refer to the applicable AFMAN 24-204 subparagraphs",
          ],
        });
      }
    } else if (
      grandfatheredExplosive.tableA27_1CrossReference?.afman24_204_Paragraph ===
      "A27.18."
    ) {
      // container options from High Explosives categories
      if (
        packagingInstructions.categories &&
        Array.isArray(packagingInstructions.categories)
      ) {
        let highExplosivesContainers: any[] = [];

        // available container types from inspection of A27.18 data
        highExplosivesContainers = [
          {
            type: "Wooden boxes (DOT 14)",
            description: "Strong wooden container for high explosives",
            specs: ["DOT 14", "DOT 15A", "DOT 16A", "DOT 19B"],
            subCategory: "High Explosives",
            maxGrossWeight: { lbs: 75, kg: 34.02 },
          },
          {
            type: "Wooden boxes with liners (DOT 15A)",
            description:
              "Wooden boxes with liner for trinitrotoluene and pentolite",
            specs: ["DOT 14", "DOT 15A", "DOT 16A", "DOT 19B"],
            liningRequirements: ["Strong siftproof liners"],
            subCategory: "Trinitrotoluene and Pentolite (Dry)",
          },
          {
            type: "Fiber drums (DOT 21C)",
            description: "Fiber drums for dry high explosives",
            specs: ["DOT 21C"],
            maxNetWeight: { lbs: 200, kg: 90.72 },
            subCategory: "Dry High Explosives",
          },
          {
            type: "Metal drum (DOT 13A)",
            description: "Metal drum for cast or compressed amatol",
            specs: ["DOT 13A"],
            maxGrossWeight: { lbs: 90, kg: 40.82 },
            subCategory: "Amatol (Cast or Compressed)",
          },
        ];

        packagingInstructions.categories.forEach(category => {
          highExplosivesContainers.forEach(container => {
            if (!container.generalRequirements) {
              container.generalRequirements = [];
            }

            if (category.requirements && Array.isArray(category.requirements)) {
              container.generalRequirements.push(...category.requirements);
            }

            if (category.name.includes("Liquid")) {
              if (category.name.includes("≥30%")) {
                container.liquidIngredientPercent = "≥30%";
              } else if (category.name.includes(">10%")) {
                container.liquidIngredientPercent = ">10%";
              } else if (category.name.includes("≤10%")) {
                container.liquidIngredientPercent = "≤10%";
              }
            }
          });
        });

        options = highExplosivesContainers;
      } else if (
        packagingInstructions.containers ||
        packagingInstructions.options ||
        packagingInstructions.containerTypes
      ) {
        options =
          packagingInstructions.containers ||
          packagingInstructions.options ||
          packagingInstructions.containerTypes ||
          [];
      }
    } else if (isA27_24) {
      // container options specific to propellant explosives
      options = [
        {
          type: "Tight Metal Cases in Wooden Boxes",
          description: "Metal cases enclosed in wooden boxes (A27.24.1)",
          subparagraphReference: "A27.24.1.",
          maxGrossWeight: { lbs: 200, kg: 90.7 },
          containerRequirements: [
            "Tight metal cases",
            "Enclosed in tight wooden boxes free from loose knots and cracks",
          ],
          notes: ["Ensure wooden boxes have no loose knots or cracks"],
        },
        {
          type: "Tight Metal Containers",
          description: "Self-contained metal containers (A27.24.1)",
          subparagraphReference: "A27.24.1.",
          maxGrossWeight: { lbs: 200, kg: 90.7 },
          containerRequirements: [
            "Tight metal construction",
            "Secure closures",
          ],
        },
        {
          type: "Metal-Lined Wooden Boxes",
          description: "Wooden boxes with metal lining (A27.24.2)",
          spec: ["DOT 14", "DOT 15A", "DOT 19B", "DOT 2F"],
          subparagraphReference: "A27.24.2.",
          maxGrossWeight: { lbs: 200, kg: 90.7 },
          containerRequirements: [
            "Wooden box must meet DOT specification",
            "Complete metal lining per DOT 2F specification",
          ],
        },
        {
          type: "Cloth/Paper Bag in Wooden Box",
          description: "Cloth or paper bags in wooden containers (A27.24.3)",
          spec: ["DOT 14", "DOT 15A", "DOT 19B"],
          subparagraphReference: "A27.24.3.",
          maxNetWeight: { lbs: 50, kg: 22.7 },
          containerRequirements: [
            "Inner cloth or paper bags, maximum 25 pounds net weight each",
            "Bags must withstand 2 drops on end from 4 feet without breaking",
            "No sifting of contents permitted",
            "Wooden box must meet DOT specification",
          ],
          notes: ["Total net weight in outer package limited to 50 pounds"],
        },
        {
          type: "Cloth/Paper Bag in Fiberboard Box",
          description:
            "Cloth or paper bags in fiberboard containers (A27.24.3)",
          spec: ["DOT 23F", "DOT 23H"],
          subparagraphReference: "A27.24.3.",
          maxNetWeight: { lbs: 50, kg: 22.7 },
          containerRequirements: [
            "Inner cloth or paper bags, maximum 25 pounds net weight each",
            "Bags must withstand 2 drops on end from 4 feet without breaking",
            "No sifting of contents permitted",
            "Fiberboard box must meet DOT specification",
          ],
          notes: ["Total net weight in outer package limited to 50 pounds"],
        },
        {
          type: "Metal Kegs in Wooden Boxes",
          description: "DOT 13 metal kegs in wooden boxes (A27.24.4)",
          spec: ["DOT 14", "DOT 15A", "DOT 15B", "DOT 15C", "DOT 19B"],
          subparagraphReference: "A27.24.4.",
          maxGrossWeight: { lbs: 200, kg: 90.7 },
          containerRequirements: [
            "Inner DOT 13 metal kegs",
            "Wooden box must meet DOT specification",
          ],
        },
        {
          type: "Metal Kegs in Fiberboard Boxes",
          description: "DOT 13 metal kegs in fiberboard boxes (A27.24.4)",
          spec: ["DOT 12B", "DOT 23H"],
          subparagraphReference: "A27.24.4.",
          maxGrossWeight: { lbs: 65, kg: 29.5 },
          containerRequirements: [
            "Inner DOT 13 metal kegs, maximum 5 pounds net weight each",
            "Maximum of six metal kegs per outer package",
            "Fiberboard box must meet DOT specification",
          ],
        },
        {
          type: "Metal Containers in Wooden Boxes",
          description: "Strong metal containers in wooden boxes (A27.24.5)",
          spec: ["DOT 14", "DOT 15A", "DOT 15B", "DOT 15C", "DOT 19B"],
          subparagraphReference: "A27.24.5.",
          containerRequirements: [
            "Strong inner metal containers, maximum 25 pounds each",
            "Maximum of four inner containers per package",
            "Wooden box must meet DOT specification",
          ],
        },
        {
          type: "Metal Containers in Fiberboard Boxes",
          description: "Strong metal containers in fiberboard boxes (A27.24.5)",
          spec: ["DOT 23F", "DOT 23H"],
          subparagraphReference: "A27.24.5.",
          maxGrossWeight: { lbs: 65, kg: 29.5 },
          containerRequirements: [
            "Strong inner metal containers, maximum 25 pounds each",
            "Maximum of four inner containers per package",
            "Fiberboard box must meet DOT specification",
          ],
        },
        {
          type: "Fiber Drums",
          description: "Fiber drums with sift-proof liner (A27.24.6)",
          spec: "DOT 21C",
          subparagraphReference: "A27.24.6.",
          maxNetWeight: { lbs: 265, kg: 120.2 },
          containerRequirements: [
            "Fiber drum must meet DOT 21C specification",
            "Strong sift-proof liner required for drums with wooden heads",
          ],
        },
        {
          type: "Wooden Boxes for Large Grains",
          description:
            "Non-lined wooden boxes for propellant grains (A27.24.7)",
          spec: ["DOT 14", "DOT 15A", "DOT 16A", "DOT 19B"],
          subparagraphReference: "A27.24.7.",
          maxGrossWeight: { lbs: 200, kg: 90.7 },
          containerRequirements: [
            "Only for grains not less than 1 inch in diameter or 3 inches in length",
            "Grains must be tightly packed",
            "Grains must be coated with protective material",
            "Wooden box must meet DOT specification",
          ],
          notes: ["No lining required for these specific grain sizes"],
        },
        {
          type: "Military-Approved Container",
          description: "Containers approved by military services (A27.24.8)",
          subparagraphReference: "A27.24.8.",
          containerRequirements: [
            "Container must be approved by military services",
            "May be used in place of DOT specification containers",
          ],
          notes: ["Ensure proper military service approval documentation"],
        },
        {
          type: "Small Inner Containers in Wooden Boxes",
          description:
            "Small fiber/metal containers in wooden boxes (A27.24.9)",
          spec: ["DOT 14", "DOT 15A", "DOT 15B", "DOT 19B"],
          subparagraphReference: "A27.24.9.",
          maxGrossWeight: { lbs: 200, kg: 90.7 },
          containerRequirements: [
            "Inner fiber or metal containers of not more than 1¾ pound capacity each",
            "Wooden box must meet DOT specification",
          ],
        },
        {
          type: "Small Inner Containers in Fiberboard Boxes",
          description:
            "Small fiber/metal containers in fiberboard boxes (A27.24.9)",
          spec: ["DOT 12H", "DOT 23F", "DOT 23H"],
          subparagraphReference: "A27.24.9.",
          maxGrossWeight: { lbs: 65, kg: 29.5 },
          containerRequirements: [
            "Inner fiber or metal containers of not more than 1¾ pound capacity each",
            "Fiberboard box must meet DOT specification",
          ],
        },
      ];
    }
    // Special handling for A27.23 (Railway Torpedoes)
    else if (isA27_23) {
      // container options specific to railway torpedoes
      options = [
        {
          type: "Wooden Boxes",
          description: "DOT specified wooden boxes for railway torpedoes",
          spec: ["DOT 15A", "DOT 15B", "DOT 16A", "DOT 19A", "DOT 19B"],
          subparagraphReference: "A27.23.1.",
          maxNetWeight: { lbs: 125, kg: 56.7 },
          containerRequirements: [
            "Wooden boxes must meet DOT specification",
            "Must be securely closed",
            "Must prevent escape of contents in transit",
          ],
          notes: ["Total net weight of explosives must not exceed 125 pounds"],
        },
        {
          type: "Fiberboard Boxes (no inside containers)",
          description:
            "DOT specified fiberboard boxes with no inside containers",
          spec: ["DOT 12H", "DOT 23F", "DOT 23H"],
          subparagraphReference: "A27.23.2.",
          maxGrossWeight: { lbs: 65, kg: 29.48 },
          containerRequirements: [
            "Fiberboard boxes must meet DOT specification",
            "Must have sufficient strength to prevent damage during transit",
            "Must prevent escape of contents during transit",
          ],
          notes: ["Total gross weight must not exceed 65 pounds"],
        },
        {
          type: "Fiberboard Boxes with Inside Cartons",
          description: "DOT specified fiberboard boxes with inside cartons",
          spec: ["DOT 12H", "DOT 23F", "DOT 23H"],
          subparagraphReference: "A27.23.3.",
          maxGrossWeight: { lbs: 65, kg: 29.48 },
          containerRequirements: [
            "Fiberboard boxes must meet DOT specification",
            "Inside cartons must have not more than 20 torpedoes each",
            "Inside cartons must be arranged to prevent excessive movement",
          ],
          notes: [
            "Total gross weight must not exceed 65 pounds",
            "Maximum 20 torpedoes per inside carton",
          ],
        },
        {
          type: "Fiberboard Boxes with Compartment Divisions",
          description:
            "DOT specified fiberboard boxes with compartment divisions",
          spec: ["DOT 12H", "DOT 23F", "DOT 23H"],
          subparagraphReference: "A27.23.4.",
          maxGrossWeight: { lbs: 65, kg: 29.48 },
          maxQuantity: 50,
          containerRequirements: [
            "Fiberboard boxes must meet DOT specification",
            "Boxes must contain permanent compartment divisions",
            "Each compartment must hold not more than one torpedo",
            "Total capacity must not exceed 50 torpedoes",
          ],
          notes: [
            "Total gross weight must not exceed 65 pounds",
            "Maximum 50 torpedoes per box",
          ],
          dimensions: {
            length: { inches: 16.25, centimeters: 41.28 },
            width: { inches: 13.25, centimeters: 33.66 },
            height: { inches: 4.5, centimeters: 11.43 },
          },
        },
      ];
    } else if (isA27_21) {
      // container options specific to rocket motors, jet thrust units, and igniters
      options = [
        {
          type: "Wooden Boxes",
          description:
            "Standard or fiberboard lined wooden boxes for rocket motors, jet thrust units, or igniters",
          spec: ["DOT 14", "DOT 15A", "DOT 15E", "DOT 16A", "DOT 19B"],
          subparagraphReference: "A27.21.1.",
          containerRequirements: [
            "Wooden boxes must meet DOT specification",
            "Fiberboard lining where applicable",
            "Must be securely closed to prevent escape of contents",
          ],
          notes: [
            "For rocket motors, jet thrust units, igniters (rocket motors), or igniters (jet thrust)",
          ],
        },
        {
          type: "Metal Containers",
          description:
            "Military or DOT approved metal containers for rocket motors and igniters",
          spec: "MIL-D-6054",
          subparagraphReference: "A27.21.2.",
          containerRequirements: [
            "Metal containers must meet MIL-D-6054 or be DOT approved",
            "Must be securely closed",
            "Must prevent damage during transport",
          ],
          notes: [
            "Metal containers approved by the DOT may be used as alternatives",
          ],
        },
        {
          type: "Combination Package (Motors with Igniters)",
          description:
            "Combined packaging of rocket motors with separate igniter components",
          subparagraphReference: "A27.21.2.1.",
          containerRequirements: [
            "Igniters or igniter components must be separately packed in unit package",
            "Unit packages may be metal cans, fiberboard boxes, etc.",
            "All components must be in the same outer packaging",
          ],
          notes: [
            "Allows rocket motors and igniters to be shipped together when properly separated",
          ],
          innerPackaging: {
            description:
              "Separate unit packages for igniters or igniter components",
            requirements: [
              "Must isolate igniters from rocket motors",
              "Must be securely enclosed in unit packages",
            ],
          },
        },
        {
          type: "Rocket Motors (Nonpropulsive State)",
          description: "Packaging for rocket motors in nonpropulsive state",
          subparagraphReference: "A27.21.2.2.",
          containerRequirements: [
            "Rocket motors must be in nonpropulsive state",
            "Must be securely packaged to prevent activation",
          ],
          notes: [
            "Military air shipment of rocket motors in propulsive state requires written approval",
            "Approval must be obtained from hazard classification authority per TB 700-2/NAVSEAINST 8020.8B/T.O. 11A-1-47/DLAR 8220.1",
          ],
        },
      ];
    } else if (isA27_7) {
      // container options specific to small arms primers
      options = [
        {
          type: "Wooden Boxes (General)",
          description:
            "Strong, tight wooden boxes for primers, percussion caps, and empty primed grenades",
          subparagraphReference: "A27.7.1.",
          requirements: [
            "Package primers and primed grenades in strong, tight wooden boxes",
            "Include provisions to secure internal packages against movement",
          ],
        },
        {
          type: "Fiberboard Boxes or Wooden Boxes",
          description: "Boxes for empty cartridge cases, primed",
          subparagraphReference: "A27.7.2.",
          requirements: [
            "Package primed empty cartridge cases in strong, tight wooden or fiberboard boxes",
            "Alternative: DOT21C fiber drums constructed to specs for 250 lbs net weight",
          ],
          netWeight: {
            lbs: 250,
            kg: 113.4,
          },
          notes: [
            "Add corrugated pad between contents and metal top/bottom of drum",
          ],
        },
        {
          type: "Cellular Inside Packages",
          description:
            "Partitioned packages for small arms primers with anvils",
          subparagraphReference: "A27.7.3.1.",
          requirements: [
            "Use partitions to isolate layers and columns of primers to prevent chain explosion",
            "Outer packaging: wooden boxes per A27.7.1 or DOT 12B fiberboard boxes with corrugated liner",
            "Liner bursting test must match or exceed box",
            "Exception: Full telescopic style DOT 12B box with pressure-sensitive tape requires no liner",
          ],
          maxOuterBoxCount: 5000,
        },
        {
          type: "DOT 23H Fiberboard Boxes",
          description:
            "Full-depth telescopic style fiberboard boxes for small arms primers with anvils",
          subparagraphReference: "A27.7.3.2.",
          construction: [
            "Full-depth telescopic style; top: extended end flaps, bottom: extended side flaps",
            "No glued or stapled joints",
            "Full-height liner, top/bottom pads made of double-wall corrugated fiberboard",
            "Optional horizontal hand-holes: 4 in. x 1 in. max.",
          ],
          handholeDimensions: {
            width: {
              maximum: {
                inches: 4,
                centimeters: 10.16,
              },
            },
            height: {
              maximum: {
                inches: 1,
                centimeters: 2.54,
              },
            },
          },
          requirements: ["Use cellular inside packages to tightly fit primers"],
          maxOuterBoxCount: 50000,
        },
        {
          type: "Mixed Packaging",
          description:
            "Small arms primers and percussion caps packaged with other items",
          subparagraphReference: "A27.7.4.",
          allowedWith: [
            "Nonexplosive and nonflammable articles",
            "Small arms ammunition (see A27.27)",
            "Propellant explosive, Class B (see A27.24.2)",
          ],
          maxWeightPerContainer: {
            lbs: 5,
            kg: 2.27,
          },
          constructionNotes: [
            "Caps and packaging must prevent full-package detonation from partial explosions",
          ],
        },
        {
          type: "Percussion Caps in DOT 12B Fiberboard Boxes (Metal Cans)",
          description: "Specific packaging for percussion caps in metal cans",
          subparagraphReference: "A27.7.4.1.",
          innerPackaging: [
            {
              type: "Metal cans",
              maxQuantity: 100,
              midLevelPackaging: {
                type: "Chipboard box",
                capacity: "10 metal cans",
              },
              outerPackaging: {
                type: "DOT 12B fiberboard box",
                capacity: "5 chipboard boxes",
              },
              safetyRequirements: [
                "Explosion of some caps cannot cause explosion of all",
              ],
            },
          ],
        },
        {
          type: "Percussion Caps in DOT 12B Fiberboard Boxes (Plastic Cans)",
          description: "Specific packaging for percussion caps in plastic cans",
          subparagraphReference: "A27.7.4.2.",
          innerPackaging: [
            {
              type: "Plastic cans",
              maxQuantity: 100,
              midLevelPackaging: {
                type: "Chipboard box",
                capacity: "up to 8 chipboard boxes",
              },
              outerPackaging: {
                type: "DOT 12B fiberboard box",
              },
              safetyRequirements: [
                "Explosion of some caps cannot cause explosion of all",
              ],
              maxGrossWeight: {
                lbs: 150,
                kg: 68.04,
              },
            },
          ],
        },
      ];
    } else if (
      grandfatheredExplosive.tableA27_1CrossReference?.afman24_204_Paragraph ===
      "A27.13."
    ) {
      // basic container options
      options.push({
        type: "Wooden Box",
        description:
          "Strong wooden box for explosive bombs, mines, projectiles, torpedoes, or grenades",
      });

      options.push({
        type: "Metal Box",
        description:
          "Strong metal box for explosive bombs, mines, projectiles, torpedoes, or grenades",
      });

      // unboxed/pallet option for large items
      options.push({
        type: "Unboxed (Palletized)",
        description:
          "For explosive bombs, mines, projectiles, torpedoes over 90 lbs or projectiles ≥ 4¾ inches diameter",
      });

      // container-specific options from containerSpecific array if available
      if (
        packagingInstructions.containerSpecific &&
        Array.isArray(packagingInstructions.containerSpecific)
      ) {
        packagingInstructions.containerSpecific.forEach(container => {
          if (container.containerType) {
            options.push({
              type: container.containerType,
              items: container.items,
              item: container.item,
              configuration: container.configuration,
              innerPackaging: container.innerPackaging,
              shippingNotes: container.shippingNotes,
              notes: container.notes,
              maxGrossWeight: container.maxGrossWeight,
            });
          }
        });
      }
    }
    // Regular handling for other paragraphs
    else {
      if (packagingInstructions.containers) {
        options = packagingInstructions.containers;
      } else if (packagingInstructions.containerTypes) {
        if (Array.isArray(packagingInstructions.containerTypes)) {
          options = packagingInstructions.containerTypes.map(item => {
            // Handle string or object in containerTypes
            return typeof item === "string" ? { type: item } : item;
          });
        }
      } else if (packagingInstructions.options) {
        options = packagingInstructions.options;
      } else if (packagingInstructions.packagingOptions) {
        options = packagingInstructions.packagingOptions;
      } else if (packagingInstructions.generalPackaging) {
        options = packagingInstructions.generalPackaging;
      }
    }

    setContainerOptions(options);
  };

  const handleContainerSelection = (
    containerType: string,
    containerData: any
  ) => {
    setSelections({
      ...selections,
      containerType,
      containerData,
    });
    if (
      store.hazProPreparerContext &&
      !store.hazProPreparerContext.grandfatheredExplosive
    ) {
      store.hazProPreparerContext.grandfatheredExplosive = {};
    }
    if (store.hazProPreparerContext?.grandfatheredExplosive) {
      store.hazProPreparerContext.grandfatheredExplosive.generalPackageDescription =
        containerType;
    }

    if (containerData.spec) {
      const specs = Array.isArray(containerData.spec)
        ? containerData.spec
        : [containerData.spec];
      setSpecOptions(specs);
    } else {
      setSpecOptions([]);
    }
  };

  const handleSpecSelection = (spec: string) => {
    setSelections({
      ...selections,
      containerSpec: spec,
    });

    const containerTypeAndSpec = `${state.hazProPreparerContext.grandfatheredExplosive?.generalPackageDescription} (${spec})`;

    if (store.hazProPreparerContext?.grandfatheredExplosive) {
      store.hazProPreparerContext.grandfatheredExplosive.generalPackageDescription =
        containerTypeAndSpec;
    }

    const isA27_4Paragraph =
      grandfatheredExplosive?.tableA27_1CrossReference
        ?.afman24_204_Paragraph === "A27.4.";

    if (!isA27_4Paragraph) {
      extractAdditionalOptions();
    }
  };

  const extractAdditionalOptions = () => {
    if (!selections.containerData) return;

    const containerData = selections.containerData;
    const additionalFields: any[] = [];

    if (containerData.dimensions) {
      additionalFields.push({
        key: "dimensions",
        label: "Dimensions",
        value: containerData.dimensions,
      });
    }

    if (containerData.features && Array.isArray(containerData.features)) {
      additionalFields.push({
        key: "features",
        label: "Features",
        value: containerData.features,
      });
    }

    if (containerData.notes && Array.isArray(containerData.notes)) {
      additionalFields.push({
        key: "notes",
        label: "Notes",
        value: containerData.notes,
      });
    }

    if (containerData.maxGrossWeight) {
      additionalFields.push({
        key: "maxGrossWeight",
        label: "Maximum Gross Weight",
        value: containerData.maxGrossWeight,
      });
    }

    if (containerData.configuration) {
      additionalFields.push({
        key: "configuration",
        label: "Configuration",
        value: containerData.configuration,
      });
    }

    if (containerData.exceptions) {
      additionalFields.push({
        key: "exceptions",
        label: "Exceptions",
        value: containerData.exceptions,
      });
    }

    if (containerData.containedItem) {
      additionalFields.push({
        key: "containedItem",
        label: "Applicable For",
        value: containerData.containedItem,
      });
    }

    if (containerData.spec && selections.containerSpec) {
      additionalFields.push({
        key: "selectedSpec",
        label: "Selected Specification",
        value: selections.containerSpec,
      });
    }

    setAdditionalOptionFields(additionalFields);
  };

  const inchesToCm = (inches: number): number => {
    return inches * 2.54;
  };

  const cmToInches = (cm: number): number => {
    return cm / 2.54;
  };

  const handleDimensionChange = (
    dimensionType: "length" | "width" | "height" | "diameter" | "thickness",
    unit: "inches" | "centimeters",
    value: string
  ) => {
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setDimensionInputs(prev => {
        const updated = { ...prev };
        if (!updated[dimensionType]) {
          updated[dimensionType] = { inches: "", centimeters: "" };
        }

        updated[dimensionType][unit] = value;

        if (value !== "") {
          const numVal = parseFloat(value);
          if (!isNaN(numVal)) {
            if (unit === "inches") {
              updated[dimensionType].centimeters =
                inchesToCm(numVal).toFixed(2);
            } else {
              updated[dimensionType].inches = cmToInches(numVal).toFixed(2);
            }
          }
        } else {
          updated[dimensionType][unit === "inches" ? "centimeters" : "inches"] =
            "";
        }

        return updated;
      });

      validateDimension(dimensionType, unit, value);
    }
  };

  const validateDimension = (
    dimensionType: "length" | "width" | "height" | "diameter" | "thickness",
    unit: "inches" | "centimeters",
    value: string
  ) => {
    if (!selections.containerData || !value) {
      setDimensionErrors(prev => ({ ...prev, [dimensionType]: "" }));
      return;
    }

    const containerDimensions = selections.containerData.dimensions;
    if (!containerDimensions || !containerDimensions[dimensionType]) {
      return;
    }

    const numVal = parseFloat(value);
    if (isNaN(numVal)) return;

    let errorMessage = "";

    if (containerDimensions[dimensionType].minimum) {
      const minValue = containerDimensions[dimensionType].minimum[unit];
      if (minValue && numVal < minValue) {
        errorMessage = `Minimum ${dimensionType} is ${minValue} ${unit}`;
      }
    }

    if (!errorMessage && containerDimensions[dimensionType].maximum) {
      const maxValue = containerDimensions[dimensionType].maximum[unit];
      if (maxValue && numVal > maxValue) {
        errorMessage = `Maximum ${dimensionType} is ${maxValue} ${unit}`;
      }
    }

    if (!errorMessage && containerDimensions[dimensionType].exact) {
      const exactValue = containerDimensions[dimensionType].exact[unit];
      if (exactValue && numVal !== exactValue) {
        errorMessage = `${dimensionType} must be exactly ${exactValue} ${unit}`;
      }
    }

    setDimensionErrors(prev => ({ ...prev, [dimensionType]: errorMessage }));
  };

  const saveDimensionsToContext = () => {
    const formattedDimensions: any = {};

    for (const [key, value] of Object.entries(dimensionInputs)) {
      if (value && (value.inches || value.centimeters)) {
        const inches = value.inches ? parseFloat(value.inches) : undefined;
        const centimeters = value.centimeters
          ? parseFloat(value.centimeters)
          : undefined;

        if (inches || centimeters) {
          formattedDimensions[key] = {
            inches,
            centimeters,
          };
        }
      }
    }

    if (Object.keys(formattedDimensions).length > 0) {
      if (store.hazProPreparerContext?.grandfatheredExplosive) {
        store.hazProPreparerContext.grandfatheredExplosive.packageDimensions =
          formattedDimensions;
      }
    }
  };

  const canProceedWithDimensions = () => {
    if (!selections.containerData || !selections.containerData.dimensions) {
      return true;
    }

    const requiredDimensions = Object.keys(selections.containerData.dimensions);

    if (requiredDimensions.length === 0) {
      return true;
    }

    for (const dim of requiredDimensions) {
      const typedDim = dim as keyof typeof dimensionInputs;

      if (
        !dimensionInputs[typedDim] ||
        !dimensionInputs[typedDim]?.inches ||
        dimensionErrors[typedDim]
      ) {
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    setIsLoading(true);

    if (currentStep === 2) {
      saveDimensionsToContext();
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinish();
    }
    setIsLoading(false);
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      setCurrentStep(0);
      setSelections({});
    }
  };

  const handleSaveExit = () => {
    if (onSaveExit) {
      onSaveExit(selections);
    }
  };

  const handleFinish = () => {
    if (onComplete) {
      onComplete(selections);
    } else {
      setCurrentStep(0);
      setSelections({});
    }
    navigation.navigate("LabelingAndMarking");
  };

  const renderReviewStep = () => {
    if (!grandfatheredExplosive) return null;

    const {
      tableA27_1CrossReference,
      packagingParagraphReferenceData,
      generalPackageDescription,
    } = grandfatheredExplosive;

    return (
      <View style={styles.stepContainer}>
        <SectionHeader title="Explosive Information" />
        <View style={styles.infoCard}>
          <InfoCardItem label="Name" value={tableA27_1CrossReference.name} />
          <InfoCardItem
            label="AFR 71-4 Paragraph"
            value={tableA27_1CrossReference.afr71_4Paragraph}
          />
          <InfoCardItem
            label="AFMAN 24-204 Paragraph"
            value={tableA27_1CrossReference.afman24_204_Paragraph}
            isLast
          />
        </View>

        <SectionHeader title="Packaging Description" />
        <View style={styles.infoCard}>
          <Text style={styles.paragraphText}>
            {packagingParagraphReferenceData.description}
          </Text>
        </View>

        {generalPackageDescription && (
          <>
            <SectionHeader title="General Package Description" />
            <View style={styles.infoCard}>
              <Text style={styles.paragraphText}>
                {generalPackageDescription}
              </Text>
            </View>
          </>
        )}

        {grandfatheredExplosive.packageDimensions && (
          <>
            <SectionHeader title="Package Dimensions" />
            <View style={styles.infoCard}>
              <DimensionDisplay
                dimensions={grandfatheredExplosive.packageDimensions}
              />
            </View>
          </>
        )}
      </View>
    );
  };

  const renderDimensions = (dimensions: any) => {
    const dimensionItems = [];

    if (dimensions.length) {
      dimensionItems.push(
        <View key="length" style={styles.infoRow}>
          <Text style={styles.infoLabel}>Length:</Text>
          <Text style={styles.infoValue}>
            {dimensions.length?.inches
              ? `${dimensions.length.inches} inches`
              : ""}
            {dimensions.length?.inches && dimensions.length?.centimeters
              ? " / "
              : ""}
            {dimensions.length?.centimeters
              ? `${dimensions.length.centimeters} cm`
              : ""}
          </Text>
        </View>
      );
    }

    if (dimensions.width) {
      dimensionItems.push(
        <View key="width" style={styles.infoRow}>
          <Text style={styles.infoLabel}>Width:</Text>
          <Text style={styles.infoValue}>
            {dimensions.width?.inches
              ? `${dimensions.width.inches} inches`
              : ""}
            {dimensions.width?.inches && dimensions.width?.centimeters
              ? " / "
              : ""}
            {dimensions.width?.centimeters
              ? `${dimensions.width.centimeters} cm`
              : ""}
          </Text>
        </View>
      );
    }

    if (dimensions.height) {
      dimensionItems.push(
        <View key="height" style={styles.infoRow}>
          <Text style={styles.infoLabel}>Height:</Text>
          <Text style={styles.infoValue}>
            {dimensions.height?.inches
              ? `${dimensions.height.inches} inches`
              : ""}
            {dimensions.height?.inches && dimensions.height?.centimeters
              ? " / "
              : ""}
            {dimensions.height?.centimeters
              ? `${dimensions.height.centimeters} cm`
              : ""}
          </Text>
        </View>
      );
    }

    if (dimensions.diameter) {
      dimensionItems.push(
        <View key="diameter" style={styles.infoRow}>
          <Text style={styles.infoLabel}>Diameter:</Text>
          <Text style={styles.infoValue}>
            {dimensions.diameter?.inches
              ? `${dimensions.diameter.inches} inches`
              : ""}
            {dimensions.diameter?.inches && dimensions.diameter?.centimeters
              ? " / "
              : ""}
            {dimensions.diameter?.centimeters
              ? `${dimensions.diameter.centimeters} cm`
              : ""}
          </Text>
        </View>
      );
    }

    return dimensionItems.length > 0 ? (
      dimensionItems
    ) : (
      <Text>No dimensions specified</Text>
    );
  };

  const renderContainerStep = () => {
    const { grandfatheredExplosivesContainers } =
      state.hazProPreparerContext || { grandfatheredExplosivesContainers: [] };

    const isA27_15 =
      grandfatheredExplosive?.tableA27_1CrossReference
        ?.afman24_204_Paragraph === "A27.15.";

    const isA27_34 =
      grandfatheredExplosive?.tableA27_1CrossReference
        ?.afman24_204_Paragraph === "A27.34.";

    const isA27_18 =
      grandfatheredExplosive?.tableA27_1CrossReference
        ?.afman24_204_Paragraph === "A27.18.";

    const isA27_23 =
      grandfatheredExplosive?.tableA27_1CrossReference
        ?.afman24_204_Paragraph === "A27.23.";

    const isA27_24 =
      grandfatheredExplosive?.tableA27_1CrossReference
        ?.afman24_204_Paragraph === "A27.24.";

    const isA27_21 =
      grandfatheredExplosive?.tableA27_1CrossReference
        ?.afman24_204_Paragraph === "A27.21.";

    const isA27_7 =
      grandfatheredExplosive?.tableA27_1CrossReference
        ?.afman24_204_Paragraph === "A27.7.";

    const isA27_13 =
      grandfatheredExplosive?.tableA27_1CrossReference
        ?.afman24_204_Paragraph === "A27.13.";

    const isA27_26 =
      grandfatheredExplosive?.tableA27_1CrossReference
        ?.afman24_204_Paragraph === "A27.26.";

    const isA27_17 =
      grandfatheredExplosive?.tableA27_1CrossReference
        ?.afman24_204_Paragraph === "A27.17.";

    const isA27_27 =
      grandfatheredExplosive?.tableA27_1CrossReference
        ?.afman24_204_Paragraph === "A27.27.";

    const checkWeightExceedsLimits = (container: any) => {
      let isExceedingWeight = false;
      let warningMessage = "";

      if (container.maxGrossWeight) {
        if (container.maxGrossWeight.kg) {
          const containerMaxWeight = container.maxGrossWeight.kg;
          if (maxEnteredGrossMass > containerMaxWeight) {
            isExceedingWeight = true;
            warningMessage = `Exceeds max weight (${containerMaxWeight} kg)`;
          }
        } else if (typeof container.maxGrossWeight === "object") {
          let maxWeightForSpecs = 0;

          if (
            selections.containerSpec &&
            container.maxGrossWeight[selections.containerSpec]
          ) {
            maxWeightForSpecs =
              container.maxGrossWeight[selections.containerSpec].kg;
          } else {
            Object.values(container.maxGrossWeight).forEach((weight: any) => {
              if (weight.kg > maxWeightForSpecs) {
                maxWeightForSpecs = weight.kg;
              }
            });
          }

          if (
            maxEnteredGrossMass > maxWeightForSpecs &&
            maxWeightForSpecs > 0
          ) {
            isExceedingWeight = true;
            warningMessage = `Exceeds max weight (${maxWeightForSpecs} kg)`;
          }
        }
      }

      if (container.netWeightRestrictions) {
        if (
          container.netWeightRestrictions.minimum &&
          container.netWeightRestrictions.minimum.kg
        ) {
          const minWeight = container.netWeightRestrictions.minimum.kg;
          if (maxEnteredGrossMass < minWeight) {
            isExceedingWeight = true;
            warningMessage = `Below minimum weight (${minWeight} kg)`;
          }
        }

        if (
          container.netWeightRestrictions.maximum &&
          container.netWeightRestrictions.maximum.kg
        ) {
          const maxWeight = container.netWeightRestrictions.maximum.kg;
          if (maxEnteredGrossMass > maxWeight) {
            isExceedingWeight = true;
            warningMessage = `Exceeds max weight (${maxWeight} kg)`;
          }
        }
      }

      if (container.maxNetWeight && container.maxNetWeight.kg) {
        const maxNetWeight = container.maxNetWeight.kg;
        if (maxEnteredGrossMass > maxNetWeight) {
          isExceedingWeight = true;
          warningMessage = `Exceeds max net weight (${maxNetWeight} kg)`;
        }
      }

      if (
        container.innerContainers &&
        Array.isArray(container.innerContainers)
      ) {
        let largestInnerLimit = 0;

        container.innerContainers.forEach((innerContainer: any) => {
          if (innerContainer.capacity && innerContainer.capacity.kg) {
            if (innerContainer.capacity.kg > largestInnerLimit) {
              largestInnerLimit = innerContainer.capacity.kg;
            }
          }

          if (innerContainer.maxNetWeight && innerContainer.maxNetWeight.kg) {
            if (innerContainer.maxNetWeight.kg > largestInnerLimit) {
              largestInnerLimit = innerContainer.maxNetWeight.kg;
            }
          }
        });

        if (largestInnerLimit > 0 && maxEnteredGrossMass > largestInnerLimit) {
          if (!isExceedingWeight) {
            isExceedingWeight = true;
            warningMessage = `Exceeds inner container limit (${largestInnerLimit} kg)`;
          }
        }
      }

      return { isExceedingWeight, warningMessage };
    };

    const hasA27_18_1SubParagraph =
      grandfatheredExplosive?.tableA27_1CrossReference?.afman24_204_SubParagraphReferences?.includes(
        "A27.18.1."
      );

    const hasA27_18_2SubParagraph =
      grandfatheredExplosive?.tableA27_1CrossReference?.afman24_204_SubParagraphReferences?.includes(
        "A27.18.2."
      );

    const hasA27_18_3SubParagraph =
      grandfatheredExplosive?.tableA27_1CrossReference?.afman24_204_SubParagraphReferences?.includes(
        "A27.18.3."
      );

    const hasNonLiquidSubParagraphs =
      grandfatheredExplosive?.tableA27_1CrossReference?.afman24_204_SubParagraphReferences?.some(
        ref =>
          [
            "A27.18.4.",
            "A27.18.5.",
            "A27.18.6.",
            "A27.18.7.",
            "A27.18.8.",
            "A27.18.9.",
            "A27.18.10.",
            "A27.18.11.",
            "A27.18.12.",
          ].includes(ref)
      );

    const applicableNonLiquidSubparagraphs =
      grandfatheredExplosive?.tableA27_1CrossReference?.afman24_204_SubParagraphReferences?.filter(
        ref =>
          [
            "A27.18.4.",
            "A27.18.5.",
            "A27.18.6.",
            "A27.18.7.",
            "A27.18.8.",
            "A27.18.9.",
            "A27.18.10.",
            "A27.18.11.",
            "A27.18.12.",
          ].includes(ref)
      ) || [];

    if (isA27_15) {
      return (
        <View style={styles.stepContainer}>
          <SectionHeader title="Select Container Type" />
          {containerOptions.map((container, index) => {
            const { isExceedingWeight, warningMessage } =
              checkWeightExceedsLimits(container);

            return (
              <ExplosiveRivetsSpecOption
                key={`container-${index}`}
                title={container.type}
                description={container.description || "Explosive Rivets"}
                unitContainers={
                  container.unitContainers || ["Unit containers", "Paperboard"]
                }
                maxExplosivePerRivet={{ mg: 375 }}
                outerContainers={[
                  {
                    type: container.type,
                    description: container.description,
                    approvedBy: container.approvedBy || [
                      "military specification",
                      "military drawings",
                    ],
                  },
                ]}
                isSelected={selections.containerType === container.type}
                onSelect={() =>
                  !isExceedingWeight &&
                  handleContainerSelection(container.type, container)
                }
                disabled={isExceedingWeight}
                warningMessage={warningMessage}
              />
            );
          })}
        </View>
      );
    }

    if (isA27_34) {
      return (
        <View style={styles.stepContainer}>
          <SectionHeader title="Select Container Type" />
          {containerOptions.map((container, index) => {
            const { isExceedingWeight, warningMessage } =
              checkWeightExceedsLimits(container);

            return (
              <TearGasGrenadesSpecOption
                key={`container-${index}`}
                title={container.type}
                description="Tear Gas Grenades"
                spec={container.spec}
                model={container.model}
                requirements={container.requirements}
                maxGrossWeight={container.maxGrossWeight}
                maxQuantity={container.maxQuantity}
                contents={container.contents}
                safetyDesign={container.safetyDesign}
                marking={container.marking}
                contentDetails={container.contentDetails}
                isSelected={selections.containerType === container.type}
                onSelect={() =>
                  !isExceedingWeight &&
                  handleContainerSelection(container.type, container)
                }
                disabled={isExceedingWeight}
                warningMessage={warningMessage}
              />
            );
          })}
        </View>
      );
    }

    if (isA27_17) {
      return (
        <View style={styles.stepContainer}>
          <SectionHeader title="Select Container Type" />
          <Text style={styles.sectionDescription}>
            Special Fireworks must be packaged according to AFMAN 24-204 A27.17.
            Select an appropriate container type.
          </Text>
          {containerOptions.map((container, index) => {
            const { isExceedingWeight, warningMessage } =
              checkWeightExceedsLimits(container);

            return (
              <SpecialFireworksSpecOption
                key={`container-${index}`}
                title={container.type}
                description={container.description}
                containerSpec={container}
                fireworksType={container.fireworksTypes || []}
                packagingRequirements={container.packagingRequirements || []}
                isSelected={selections.containerType === container.type}
                onSelect={() =>
                  !isExceedingWeight &&
                  handleContainerSelection(container.type, container)
                }
                disabled={isExceedingWeight}
                warningMessage={warningMessage}
              />
            );
          })}
        </View>
      );
    }
    if (isA27_26) {
      return (
        <View style={styles.stepContainer}>
          <SectionHeader title="Select Container Type" />
          <Text style={styles.sectionDescription}>
            Small Arms Ammunition and Small Arms Ammunition, Tear Gas Cartridges
            must be packaged according to AFMAN 24-204 A27.26. Select an
            appropriate container type.
          </Text>
          {containerOptions.map((container, index) => {
            const { isExceedingWeight, warningMessage } =
              checkWeightExceedsLimits(container);

            return (
              <SmallArmsAmmunitionSpecOption
                key={`container-${index}`}
                title={container.type}
                description={
                  container.description ||
                  "Small Arms Ammunition and Tear Gas Cartridges"
                }
                containerSpec={container}
                innerPackagingTypes={[
                  "Pasteboard boxes",
                  "Other boxes",
                  "Partitions",
                  "Metal clips",
                ]}
                innerPackagingRequirements={[
                  "Must fit snugly and protect primers from accidental damage",
                ]}
                outerPackagingTypes={[
                  "Wooden boxes",
                  "Fiberboard boxes",
                  "Metal containers",
                ]}
                outerPackagingRequirements={[
                  "Securely closed",
                  "Must hold inside boxes, partitions, or metal clips",
                ]}
                bulkPackagingInfo={{
                  applicableTo: "Blank industrial power load cartridges",
                  type: "Fiberboard boxes",
                  requirements: ["Securely closed"],
                }}
                isSelected={selections.containerType === container.type}
                onSelect={() =>
                  !isExceedingWeight &&
                  handleContainerSelection(container.type, container)
                }
                disabled={isExceedingWeight}
                warningMessage={warningMessage}
              />
            );
          })}
        </View>
      );
    }

    if (isA27_7) {
      return (
        <View style={styles.stepContainer}>
          <SectionHeader title="Select Container Type" />
          <Text style={styles.sectionDescription}>
            Small Arms Primers, Cannon Primers, Combination Primers, Percussion
            Caps, and Grenades Empty, Primed must be packaged according to the
            following options from AFMAN 24-204 A27.7.
          </Text>
          {containerOptions.map((container, index) => {
            const { isExceedingWeight, warningMessage } =
              checkWeightExceedsLimits(container);

            return (
              <SmallArmsPrimersSpecOption
                key={`container-${index}`}
                title={container.type}
                description={container.description}
                containerSpec={container}
                subparagraphReference={container.subparagraphReference}
                isSelected={selections.containerType === container.type}
                onSelect={() =>
                  !isExceedingWeight &&
                  handleContainerSelection(container.type, container)
                }
                disabled={isExceedingWeight}
                warningMessage={warningMessage}
              />
            );
          })}
        </View>
      );
    }

    if (isA27_18 && hasA27_18_1SubParagraph) {
      return (
        <View style={styles.stepContainer}>
          <SectionHeader title="High Explosive Liquids (A27.18.1)" />

          <View style={styles.regulationPanel}>
            <Text style={styles.regulationTitle}>A27.18.1. Requirements</Text>
            <Text style={styles.regulationText}>
              High explosives, consisting of a liquid mixed with an absorbent
              material, require the absorbent (wood pulp or similar material) in
              sufficient quantity and be of satisfactory quality, and properly
              dried at the time of mixing. Ensure the nitrate of soda is dried
              at the time of mixing to less than 1 percent of moisture; and the
              ingredients are uniformly mixed so that the liquid remains
              thoroughly absorbed under the most unfavorable atmospheric
              conditions incident to transportation.
            </Text>
          </View>

          <View style={styles.divider} />
          <SectionHeader title="Select Container Type" />
          <Text style={styles.infoText}>
            Note: A27.18.1 only specifies requirements for handling liquid high
            explosives. The container options below are derived from general
            requirements for high explosives.
          </Text>
          {containerOptions.map((container, index) => {
            const { isExceedingWeight, warningMessage } =
              checkWeightExceedsLimits(container);

            return (
              <HighExplosivesLiquidsSpecOption
                key={`container-${index}`}
                title={container.type}
                description={container.description}
                containerSpec={container}
                liquidRequirements={[
                  "Use absorbent material (e.g., wood pulp) in sufficient quantity and quality, properly dried at mixing.",
                  "Nitrate of soda must have less than 1% moisture at time of mixing.",
                  "Ingredients must be uniformly mixed so liquid remains absorbed during transportation.",
                  "The absorbent material must maintain effectiveness under unfavorable atmospheric conditions.",
                ]}
                isSelected={selections.containerType === container.type}
                onSelect={() =>
                  !isExceedingWeight &&
                  handleContainerSelection(container.type, container)
                }
                disabled={isExceedingWeight}
                warningMessage={warningMessage}
              />
            );
          })}
        </View>
      );
    }

    if (isA27_18 && hasA27_18_2SubParagraph) {
      return (
        <View style={styles.stepContainer}>
          <SectionHeader title="High Explosives with Nitroglycerin (A27.18.2)" />

          <View style={styles.regulationPanel}>
            <Text style={styles.regulationTitle}>A27.18.2. Requirements</Text>
            <Text style={styles.regulationText}>
              Mix high explosives containing nitroglycerin or other liquid
              explosive ingredients uniformly with an absorbent material and a
              satisfactory antacid. Ensure the antacid is in sufficient quantity
              to have the neutralizing power of an amount of magnesium carbonate
              equal to 1 percent of the nitroglycerin or other liquid explosive
              ingredient.
            </Text>
          </View>

          <View style={styles.divider} />

          <SectionHeader title="Select Container Type" />
          <Text style={styles.infoText}>
            Note: A27.18.2 only specifies requirements for antacid in high
            explosives with nitroglycerin. The container options below are
            derived from general requirements for high explosives.
          </Text>
          {containerOptions.map((container, index) => {
            const { isExceedingWeight, warningMessage } =
              checkWeightExceedsLimits(container);

            const antacidRequirements = [
              "Antacid must have neutralizing power equivalent to magnesium carbonate equal to 1% of nitroglycerin content",
              "Mix high explosives containing nitroglycerin uniformly with absorbent material and antacid",
              "Ensure uniform mixing to maintain absorption under all transportation conditions",
            ];

            return (
              <HighExplosivesNitroglycerinSpecOption
                key={`container-${index}`}
                title={container.type}
                description={container.description}
                containerSpec={container}
                antacidRequirements={antacidRequirements}
                isSelected={selections.containerType === container.type}
                onSelect={() =>
                  !isExceedingWeight &&
                  handleContainerSelection(container.type, container)
                }
                disabled={isExceedingWeight}
                warningMessage={warningMessage}
              />
            );
          })}
        </View>
      );
    }
    // if (isA27_27) {
    //   const packageData = packagingParagraphReferenceData;
    //   return (
    //     <View style={styles.stepContainer}>
    //       <SectionHeader title="Select Container Type" />
    //       <Text style={styles.sectionDescription}>
    //         Toy Caps must be packaged according to the following options
    //         from AFMAN 24-204 A27.27.
    //       </Text>
    //       {containerOptions.map((container, index) => {
    //         const { isExceedingWeight, warningMessage } =
    //           checkWeightExceedsLimits(container);

    //         return (
    //           <ToyCapSpecOption
    //             key={`container-${index}`}
    //             title={container.type}
    //             description={container.description || "Toy Caps"}
    //             specs={container.specs}
    //             maxGrossWeight={container.maxGrossWeight}
    //             compositionLimit="Not more than an average of ¼ grain of explosive composition per cap"
    //             innerPackaging={
    //               packageData?.packagingInstructions?.innerPackaging
    //             }
    //             isSelected={selections.containerType === container.type}
    //             onSelect={() =>
    //               !isExceedingWeight &&
    //               handleContainerSelection(container.type, container)
    //             }
    //             disabled={isExceedingWeight}
    //             warningMessage={warningMessage}
    //           />
    //         );
    //       })}
    //     </View>
    //   );
    // }

    if (isA27_18 && hasA27_18_3SubParagraph) {
      return (
        <View style={styles.stepContainer}>
          <SectionHeader title="High Explosive Cartridges (A27.18.3)" />

          <View style={styles.regulationPanel}>
            <Text style={styles.regulationTitle}>A27.18.3. Requirements</Text>
            <Text style={styles.regulationText}>
              High explosive cartridges consist of a column of explosives
              completely enclosed in a shell made of strong paper or
              polyethylene or a combination of paper and polyethylene, treated
              so that it does not absorb the liquid ingredient of the explosive.
            </Text>
          </View>

          <View style={styles.divider} />

          <SectionHeader title="Select Container Type" />
          <Text style={styles.infoText}>
            Note: A27.18.3 only specifies requirements for shell materials used
            in high explosive cartridges. The container options below are for
            packaging these pre-enclosed cartridges.
          </Text>
          {containerOptions.map((container, index) => {
            const { isExceedingWeight, warningMessage } =
              checkWeightExceedsLimits(container);

            return (
              <HighExplosivesCartridgesSpecOption
                key={`container-${index}`}
                title={container.type}
                description={container.description}
                containerSpec={container}
                cartridgeRequirements={[
                  "Cartridge shell must be made of strong paper, polyethylene, or a combination of both",
                  "Shell must completely enclose the explosive column",
                  "Shell must be treated to prevent absorption of liquid explosive ingredients",
                ]}
                isSelected={selections.containerType === container.type}
                onSelect={() =>
                  !isExceedingWeight &&
                  handleContainerSelection(container.type, container)
                }
                disabled={isExceedingWeight}
                warningMessage={warningMessage}
              />
            );
          })}
        </View>
      );
    }

    if (isA27_18 && hasNonLiquidSubParagraphs) {
      return (
        <View style={styles.stepContainer}>
          <SectionHeader title="High Explosives (No Liquid Ingredient / No Chlorate)" />

          <View style={styles.regulationPanel}>
            <Text style={styles.regulationTitle}>A27.18.4-12 Requirements</Text>
            <Text style={styles.regulationText}>
              Various requirements for high explosives with no liquid explosive
              ingredient nor any chlorate. These include specific packaging,
              lining, and handling requirements based on the explosive type.
            </Text>
          </View>

          <View style={styles.divider} />

          <SectionHeader title="Select Container Type" />
          <Text style={styles.infoText}>
            Note: The applicable subparagraphs specify different requirements
            for packaging high explosives. Please select a container that meets
            your specific needs.
          </Text>
          {containerOptions.map((container, index) => {
            const { isExceedingWeight, warningMessage } =
              checkWeightExceedsLimits(container);

            return (
              <HighExplosivesNonLiquidSpecOption
                key={`container-${index}`}
                title={container.type}
                description={container.description}
                containerSpec={container}
                applicableSubparagraphs={
                  container.applicableSubparagraphs ||
                  applicableNonLiquidSubparagraphs
                }
                packagingRequirements={[
                  "Ensure proper packaging based on explosive type",
                  "Follow all applicable AFMAN 24-204 requirements",
                  "Consider the explosive composition when selecting a container",
                ]}
                isSelected={selections.containerType === container.type}
                onSelect={() =>
                  !isExceedingWeight &&
                  handleContainerSelection(container.type, container)
                }
                disabled={isExceedingWeight}
                warningMessage={warningMessage}
              />
            );
          })}
        </View>
      );
    }

    if (isA27_18) {
      return (
        <View style={styles.stepContainer}>
          <SectionHeader title="Select Container Type" />
          {containerOptions.map((container, index) => {
            const { isExceedingWeight, warningMessage } =
              checkWeightExceedsLimits(container);

            return (
              <HighExplosivesSpecOption
                key={`container-${index}`}
                title={container.type}
                description={container.description}
                explosiveType={container.explosiveType}
                subCategory={container.subCategory}
                liquidIngredientPercent={container.liquidIngredientPercent}
                containerSpec={container}
                generalRequirements={container.generalRequirements || []}
                isSelected={selections.containerType === container.type}
                onSelect={() =>
                  !isExceedingWeight &&
                  handleContainerSelection(container.type, container)
                }
                disabled={isExceedingWeight}
                warningMessage={warningMessage}
              />
            );
          })}
        </View>
      );
    } else if (isA27_24) {
      return (
        <View style={styles.stepContainer}>
          <SectionHeader title="Select Container Type" />
          <Text style={styles.sectionDescription}>
            Select a container for propellant explosives (solid or liquid). Each
            container has specific requirements based on AFMAN 24-204
            regulations.
          </Text>
          {containerOptions.map((container, index) => {
            const { isExceedingWeight, warningMessage } =
              checkWeightExceedsLimits(container);

            return (
              <PropellantExplosivesSpecOption
                key={`container-${index}`}
                title={container.type}
                description={container.description}
                containerSpec={container}
                subparagraphReference={container.subparagraphReference}
                isSelected={selections.containerType === container.type}
                onSelect={() =>
                  !isExceedingWeight &&
                  handleContainerSelection(container.type, container)
                }
                disabled={isExceedingWeight}
                warningMessage={warningMessage}
              />
            );
          })}
        </View>
      );
    } else if (isA27_23) {
      return (
        <View style={styles.stepContainer}>
          <SectionHeader title="Select Container Type" />
          <Text style={styles.sectionDescription}>
            Railway Torpedoes must be packaged according to the following
            options from AFMAN 24-204 A27.23.
          </Text>
          {containerOptions.map((container, index) => {
            const { isExceedingWeight, warningMessage } =
              checkWeightExceedsLimits(container);

            return (
              <RailwayTorpedoesSpecOption
                key={`container-${index}`}
                title={container.type}
                description={
                  container.description || "Container for Railway Torpedoes"
                }
                specs={container.spec || container.specs}
                maxNetWeight={container.maxNetWeight}
                maxGrossWeight={container.maxGrossWeight}
                maxQuantity={container.maxQuantity}
                innerPackaging={container.innerPackaging}
                minDimension={container.minDimension}
                requirements={container.requirements}
                notes={container.notes}
                referenceSection={container.subparagraphReference}
                isSelected={selections.containerType === container.type}
                onSelect={() =>
                  !isExceedingWeight &&
                  handleContainerSelection(container.type, container)
                }
                disabled={isExceedingWeight}
                warningMessage={warningMessage}
              />
            );
          })}
        </View>
      );
    }
    if (isA27_13) {
      return (
        <View style={styles.stepContainer}>
          <SectionHeader title="Select Container Type" />
          <Text style={styles.sectionDescription}>
            Explosive Bombs, Mines, Projectiles, Torpedoes, and Grenades must be
            packaged according to the following options from AFMAN 24-204
            A27.13.
          </Text>
          {containerOptions.map((container, index) => {
            const { isExceedingWeight, warningMessage } =
              checkWeightExceedsLimits(container);

            return (
              <ExplosiveBombMineSpecOption
                key={`container-${index}`}
                title={container.type}
                description={container.description}
                containerSpec={container}
                subparagraphReference={container.subparagraphReference}
                isSelected={selections.containerType === container.type}
                onSelect={() =>
                  !isExceedingWeight &&
                  handleContainerSelection(container.type, container)
                }
                disabled={isExceedingWeight}
                warningMessage={warningMessage}
              />
            );
          })}
        </View>
      );
    } else if (isA27_21) {
      return (
        <View style={styles.stepContainer}>
          <SectionHeader title="Select Container Type" />
          <Text style={styles.sectionDescription}>
            Rocket motors, Jet Thrust Units, Igniters for Rocket Motors, or
            Igniters for Jet Thrust must be packaged according to the following
            options from AFMAN 24-204 A27.21.
          </Text>
          {containerOptions.map((container, index) => {
            const { isExceedingWeight, warningMessage } =
              checkWeightExceedsLimits(container);

            return (
              <RocketMotorJetThrustSpecOption
                key={`container-${index}`}
                title={container.type}
                description={container.description}
                containerSpec={container}
                subparagraphReference={container.subparagraphReference}
                isSelected={selections.containerType === container.type}
                onSelect={() =>
                  !isExceedingWeight &&
                  handleContainerSelection(container.type, container)
                }
                disabled={isExceedingWeight}
                warningMessage={warningMessage}
              />
            );
          })}
        </View>
      );
    }

    const maxEnteredGrossMass = (
      grandfatheredExplosivesContainers || []
    ).reduce((max, container) => {
      const massInKg =
        container.grossMassUnit === "kg"
          ? parseFloat(container.grossMass)
          : parseFloat(container.grossMass) / 1000;
      return Math.max(max, massInKg);
    }, 0);

    const isA27_4Paragraph =
      grandfatheredExplosive?.tableA27_1CrossReference
        ?.afman24_204_Paragraph === "A27.4.";
    const isA27_30Paragraph =
      grandfatheredExplosive?.tableA27_1CrossReference
        ?.afman24_204_Paragraph === "A27.30.";
    const isA27_31Paragraph =
      grandfatheredExplosive?.tableA27_1CrossReference
        ?.afman24_204_Paragraph === "A27.31.";
    const isPracticeAmmoOrBlastingAgent =
      isA27_30Paragraph || isA27_31Paragraph;
    const isA27_11Paragraph =
      grandfatheredExplosive?.tableA27_1CrossReference
        ?.afman24_204_Paragraph === "A27.11.";
    const isA27_6Paragraph =
      grandfatheredExplosive?.tableA27_1CrossReference
        ?.afman24_204_Paragraph === "A27.6.";
    const isA27_5Paragraph =
      grandfatheredExplosive?.tableA27_1CrossReference
        ?.afman24_204_Paragraph === "A27.5.";
    const isA27_13Paragraph =
      grandfatheredExplosive?.tableA27_1CrossReference
        ?.afman24_204_Paragraph === "A27.13.";
    const isA27_15Paragraph =
      grandfatheredExplosive?.tableA27_1CrossReference
        ?.afman24_204_Paragraph === "A27.15.";

    return (
      <View style={styles.stepContainer}>
        <SectionHeader title="Select Container Type" />
        {containerOptions.length > 0 ? (
          containerOptions.map((container, index) => {
            const { isExceedingWeight, warningMessage } =
              checkWeightExceedsLimits(container);
            if (container.type === "Polystyrene containers") {
              return (
                <TouchableOpacity
                  key={`container-${index}`}
                  style={[
                    styles.selectionCard2,
                    selections.containerType === container.type &&
                      styles.selectedCard,
                    isExceedingWeight && styles.disabledCard,
                  ]}
                  onPress={() =>
                    !isExceedingWeight &&
                    handleContainerSelection(container.type, container)
                  }
                  disabled={isExceedingWeight}
                >
                  <PolystyreneContainerDetails
                    containerData={container}
                    isSelected={selections.containerType === container.type}
                    isDisabled={isExceedingWeight}
                    warningMessage={warningMessage}
                  />
                  {isExceedingWeight && <View style={styles.disabledOverlay} />}
                </TouchableOpacity>
              );
            }

            if (isA27_4Paragraph) {
              return (
                <BlackPowderSpecOption
                  key={`container-${index}`}
                  title={container.type}
                  spec={container.spec}
                  dimensions={container.dimensions}
                  innerContainers={container.innerContainers}
                  netWeightRestrictions={container.netWeightRestrictions}
                  maxGrossWeight={container.maxGrossWeight}
                  lining={container.lining}
                  notes={container.notes}
                  for={container.for}
                  performanceRequirement={container.performanceRequirement}
                  substitutions={container.substitutions}
                  maxNetWeight={container.maxNetWeight}
                  isSelected={selections.containerType === container.type}
                  onSelect={() =>
                    handleContainerSelection(container.type, container)
                  }
                  disabled={isExceedingWeight}
                  warningMessage={warningMessage}
                />
              );
            }

            if (isPracticeAmmoOrBlastingAgent) {
              return (
                <PracticeAmmoSpecOption
                  key={`container-${index}`}
                  title={container.type}
                  closure={container.closure}
                  requirements={container.requirements}
                  examples={container.examples}
                  performanceRequirement={container.performanceRequirement}
                  dropTestHeight={container.dropTestHeight}
                  isSelected={selections.containerType === container.type}
                  onSelect={() =>
                    handleContainerSelection(container.type, container)
                  }
                  disabled={isExceedingWeight}
                  warningMessage={warningMessage}
                />
              );
            }

            if (isA27_11Paragraph) {
              return (
                <FuzesSpecOption
                  key={`container-${index}`}
                  title={container.type}
                  spec={container.spec}
                  features={container.features}
                  approvedBy={container.approvedBy}
                  maxGrossWeight={container.maxGrossWeight}
                  isSelected={selections.containerType === container.type}
                  onSelect={() =>
                    !isExceedingWeight &&
                    handleContainerSelection(container.type, container)
                  }
                  disabled={isExceedingWeight}
                  warningMessage={warningMessage}
                />
              );
            }

            if (isA27_6Paragraph) {
              const packagingInstructions =
                grandfatheredExplosive.packagingParagraphReferenceData
                  .packagingInstructions;
              return (
                <DetonatingFuzesSpecOption
                  key={`container-${index}`}
                  title={container.type}
                  description={container.description}
                  requirements={packagingInstructions.requirements as string[]}
                  weightCategoryDescription={container.for}
                  maxGrossWeight={container.maxGrossWeight}
                  notes={packagingInstructions.notes || []}
                  isSelected={selections.containerType === container.type}
                  onSelect={() =>
                    !isExceedingWeight &&
                    handleContainerSelection(container.type, container)
                  }
                  disabled={isExceedingWeight}
                  warningMessage={warningMessage}
                />
              );
            }

            if (isA27_5Paragraph) {
              const packagingInstructions =
                grandfatheredExplosive.packagingParagraphReferenceData
                  .packagingInstructions;

              const deviceLimits = [];
              if (packagingInstructions.limits) {
                for (const [key, value] of Object.entries(
                  packagingInstructions.limits
                )) {
                  if (typeof value === "object") {
                    deviceLimits.push({
                      deviceType: key,
                      description: value.description,
                      maxPerInner: value.maxPerInner,
                      maxPerOuter: value.maxPerOuter,
                      maxGrossWeight: value.maxGrossWeight,
                      notes: value.notes,
                    });
                  }
                }
              }

              if (isA27_13Paragraph) {
                const packagingInstructions =
                  grandfatheredExplosive.packagingParagraphReferenceData
                    .packagingInstructions;

                return (
                  <ExplosiveMunitionsSpecOption
                    key={`container-${index}`}
                    title={container.type}
                    description="Explosive Bomb; Explosive Mine; Explosive Projectile; Explosive Torpedo; Grenade, Hand, Explosive; and Grenade, Rifle, Explosive"
                    generalRequirements={
                      packagingInstructions.general as string[]
                    }
                    exceptions={
                      packagingInstructions.exceptions as ExceptionWithCondition[]
                    }
                    specialProvisions={packagingInstructions.specialProvisions}
                    weightLimits={
                      packagingInstructions.weightLimits as Record<
                        string,
                        WeightUnits
                      >
                    }
                    containerSpecific={
                      container.items || container.item
                        ? [container]
                        : packagingInstructions.containerSpecific
                    }
                    isSelected={selections.containerType === container.type}
                    onSelect={() =>
                      !isExceedingWeight &&
                      handleContainerSelection(container.type, container)
                    }
                    disabled={isExceedingWeight}
                    warningMessage={warningMessage}
                  />
                );
              }

              if (isA27_15Paragraph) {
                return (
                  <ExplosiveRivetsSpecOption
                    key={`container-${index}`}
                    title={container.type}
                    description={container.description || "Explosive Rivets"}
                    unitContainers={container.unitContainers}
                    maxExplosivePerRivet={{ mg: 375 }}
                    outerContainers={[
                      {
                        type: container.type,
                        description: container.description,
                        approvedBy: Array.isArray(container.approvedBy)
                          ? container.approvedBy
                          : container.approvedBy
                          ? [container.approvedBy]
                          : ["military specification", "military drawings"],
                      },
                    ]}
                    isSelected={selections.containerType === container.type}
                    onSelect={() =>
                      !isExceedingWeight &&
                      handleContainerSelection(container.type, container)
                    }
                    disabled={isExceedingWeight}
                    warningMessage={warningMessage}
                  />
                );
              }

              return (
                <DetonatorsSpecOption
                  key={`container-${index}`}
                  title={container.type}
                  description={
                    container.description ||
                    "Detonators, Class A and Class C Explosives"
                  }
                  deviceLimits={deviceLimits}
                  requirements={
                    (packagingInstructions.requirements as RequirementsObject)
                      ?.blastingCapsOrDelayConnectors
                  }
                  generalRequirements={
                    (packagingInstructions.general as Record<string, any>)
                      .requirements
                  }
                  exceptions={
                    packagingInstructions.exceptions as ExceptionsWithAppliesTo
                  }
                  outerPackaging={packagingInstructions.outerPackaging}
                  isSelected={selections.containerType === container.type}
                  onSelect={() =>
                    !isExceedingWeight &&
                    handleContainerSelection(container.type, container)
                  }
                  disabled={isExceedingWeight}
                  warningMessage={warningMessage}
                />
              );
            }

            return (
              <SelectionOption
                key={`container-${index}`}
                title={container.type}
                isSelected={selections.containerType === container.type}
                onSelect={() =>
                  handleContainerSelection(container.type, container)
                }
                disabled={isExceedingWeight}
                warningMessage={warningMessage}
                details={
                  <View style={styles.detailsContainer}>
                    {container.maxGrossWeight && (
                      <WeightDisplay weight={container.maxGrossWeight} />
                    )}

                    {container.netWeightRestrictions && (
                      <>
                        {container.netWeightRestrictions.minimum && (
                          <InfoCardItem
                            label="Min Weight"
                            value={`${container.netWeightRestrictions.minimum.lbs} lbs / ${container.netWeightRestrictions.minimum.kg} kg`}
                          />
                        )}
                        {container.netWeightRestrictions.maximum && (
                          <InfoCardItem
                            label="Max Weight"
                            value={`${container.netWeightRestrictions.maximum.lbs} lbs / ${container.netWeightRestrictions.maximum.kg} kg`}
                          />
                        )}
                      </>
                    )}

                    {container.dimensions &&
                      container.dimensions.diameter &&
                      container.dimensions.diameter.exact && (
                        <InfoCardItem
                          label="Diameter"
                          value={`${container.dimensions.diameter.exact.inches} in / ${container.dimensions.diameter.exact.centimeters} cm`}
                        />
                      )}

                    {container.features && container.features.length > 0 && (
                      <FeaturesDisplay features={container.features} />
                    )}

                    {container.notes && container.notes.length > 0 && (
                      <NotesDisplay notes={container.notes} />
                    )}

                    {container.containedItem && (
                      <InfoCardItem
                        label="For"
                        value={container.containedItem}
                      />
                    )}

                    {container.exceptions &&
                      (typeof ExceptionContainer !== "undefined" ? (
                        <ExceptionContainer
                          item={container.exceptions.item}
                          maxGrossWeight={container.exceptions.maxGrossWeight}
                          isDisabled={isExceedingWeight}
                        />
                      ) : (
                        <View
                          style={[
                            styles.exceptionContainer,
                            isExceedingWeight &&
                              styles.disabledExceptionContainer,
                          ]}
                        >
                          <Text
                            style={[
                              styles.exceptionLabel,
                              isExceedingWeight &&
                                styles.disabledExceptionLabel,
                            ]}
                          >
                            Exception:
                          </Text>
                          {container.exceptions.item && (
                            <Text
                              style={[
                                styles.exceptionItem,
                                isExceedingWeight && styles.disabledText,
                              ]}
                            >
                              Item: {container.exceptions.item}
                            </Text>
                          )}
                          {container.exceptions.maxGrossWeight && (
                            <Text
                              style={[
                                styles.exceptionWeight,
                                isExceedingWeight && styles.disabledText,
                              ]}
                            >
                              Max Weight:{" "}
                              {container.exceptions.maxGrossWeight.lbs} lbs /{" "}
                              {container.exceptions.maxGrossWeight.kg} kg
                            </Text>
                          )}
                        </View>
                      ))}
                  </View>
                }
              />
            );
          })
        ) : (
          <Text style={styles.noOptionsText}>
            No container options available
          </Text>
        )}
      </View>
    );
  };

  const renderSpecStep = () => {
    const hasRequiredDimensions =
      selections.containerData &&
      selections.containerData.dimensions &&
      Object.keys(selections.containerData.dimensions).length > 0;

    return (
      <View style={styles.stepContainer}>
        <SectionHeader title="Select Specification" />

        {selections.containerType && (
          <View style={styles.selectedInfo}>
            <Text style={styles.selectedLabel}>Selected Container Type:</Text>
            <Text style={styles.selectedValue}>{selections.containerType}</Text>
          </View>
        )}

        {specOptions.length > 0 ? (
          specOptions.map((spec, index) => (
            <SelectionOption
              key={`spec-${index}`}
              title={spec}
              isSelected={selections.containerSpec === spec}
              onSelect={() => handleSpecSelection(spec)}
            />
          ))
        ) : (
          <View style={styles.noSpecsContainer}>
            <Text style={styles.noOptionsText}>
              No specifications required for this container type
            </Text>
            <Text style={styles.helperText}>
              You can proceed to the next step
            </Text>
          </View>
        )}

        {hasRequiredDimensions && (
          <View style={styles.dimensionsInputContainer}>
            <Text style={styles.dimensionsTitle}>Enter Package Dimensions</Text>

            {Object.keys(selections.containerData.dimensions).map(
              dimensionKey => {
                const dimension = dimensionKey as keyof typeof dimensionInputs;
                const dimensionData =
                  selections.containerData.dimensions[dimension];

                let requirementText = "";
                if (dimensionData.minimum) {
                  requirementText += `Minimum: ${dimensionData.minimum.inches} in / ${dimensionData.minimum.centimeters} cm`;
                }
                if (dimensionData.maximum) {
                  requirementText += requirementText ? ", " : "";
                  requirementText += `Maximum: ${dimensionData.maximum.inches} in / ${dimensionData.maximum.centimeters} cm`;
                }
                if (dimensionData.exact) {
                  requirementText += requirementText ? ", " : "";
                  requirementText += `Exact: ${dimensionData.exact.inches} in / ${dimensionData.exact.centimeters} cm`;
                }

                return (
                  <View key={dimension} style={styles.dimensionInputRow}>
                    <Text style={styles.dimensionLabel}>
                      {dimension.charAt(0).toUpperCase() + dimension.slice(1)}:
                    </Text>

                    <View style={styles.dimensionInputGroup}>
                      <View style={styles.dimensionInputWithUnit}>
                        <TextInput
                          style={[
                            styles.dimensionInput,
                            dimensionErrors[dimension]
                              ? styles.inputError
                              : null,
                          ]}
                          placeholder={`Enter ${dimension}`}
                          value={dimensionInputs[dimension]?.inches || ""}
                          onChangeText={value =>
                            handleDimensionChange(dimension, "inches", value)
                          }
                          keyboardType="numeric"
                        />
                        <Text style={styles.dimensionUnit}>in</Text>
                      </View>

                      <View style={styles.dimensionInputWithUnit}>
                        <TextInput
                          style={[
                            styles.dimensionInput,
                            dimensionErrors[dimension]
                              ? styles.inputError
                              : null,
                          ]}
                          placeholder={`Enter ${dimension}`}
                          value={dimensionInputs[dimension]?.centimeters || ""}
                          onChangeText={value =>
                            handleDimensionChange(
                              dimension,
                              "centimeters",
                              value
                            )
                          }
                          keyboardType="numeric"
                        />
                        <Text style={styles.dimensionUnit}>cm</Text>
                      </View>
                    </View>

                    {requirementText && (
                      <Text style={styles.dimensionRequirement}>
                        {requirementText}
                      </Text>
                    )}

                    {dimensionErrors[dimension] && (
                      <Text style={styles.errorText}>
                        {dimensionErrors[dimension]}
                      </Text>
                    )}
                  </View>
                );
              }
            )}
          </View>
        )}

        {additionalOptionFields.length > 0 && (
          <>
            <SectionHeader title="Additional Information" />
            {additionalOptionFields.map((field, index) => (
              <View key={`field-${index}`} style={styles.infoCard}>
                <Text style={styles.fieldLabel}>{field.label}</Text>
                {field.key === "dimensions" ? (
                  <DimensionDisplay dimensions={field.value} />
                ) : field.key === "maxGrossWeight" ? (
                  <WeightDisplay weight={field.value} />
                ) : field.key === "features" ? (
                  <FeaturesDisplay features={field.value} />
                ) : field.key === "notes" ? (
                  <NotesDisplay notes={field.value} />
                ) : (
                  renderFieldValue(field)
                )}
              </View>
            ))}
          </>
        )}
      </View>
    );
  };

  const renderFieldValue = (field: any) => {
    if (field.key === "dimensions") {
      return renderDimensions(field.value);
    }

    if (field.key === "exceptions") {
      return (
        <View style={styles.exceptionContainer}>
          {field.value.item && (
            <InfoCardItem label="Item" value={field.value.item} />
          )}
          {field.value.maxGrossWeight && (
            <WeightDisplay
              weight={field.value.maxGrossWeight}
              label="Exception Max Weight"
            />
          )}
        </View>
      );
    }

    if (field.key === "configuration" && typeof field.value === "object") {
      return (
        <View style={styles.configurationContainer}>
          {field.value.itemsPerContainer && (
            <InfoCardItem
              label="Items Per Container"
              value={field.value.itemsPerContainer.toString()}
            />
          )}
          {field.value.maxContainersPerBox && (
            <InfoCardItem
              label="Max Containers Per Box"
              value={field.value.maxContainersPerBox.toString()}
            />
          )}
          {field.value.overwrap && (
            <View style={styles.nestedSection}>
              <Text style={styles.nestedTitle}>Overwrap</Text>
              {field.value.overwrap.material && (
                <InfoCardItem
                  label="Material"
                  value={field.value.overwrap.material}
                />
              )}
              {field.value.overwrap.dimensions?.thickness?.minimum && (
                <InfoCardItem
                  label="Thickness"
                  value={`${field.value.overwrap.dimensions.thickness.minimum.inches} in / ${field.value.overwrap.dimensions.thickness.minimum.centimeters} cm`}
                />
              )}
            </View>
          )}
        </View>
      );
    }

    if (Array.isArray(field.value)) {
      return (
        <View style={styles.listContainer}>
          {field.value.map((item: any, idx: number) => (
            <Text key={`item-${idx}`} style={styles.listItem}>
              • {typeof item === "string" ? item : JSON.stringify(item)}
            </Text>
          ))}
        </View>
      );
    }

    if (typeof field.value === "object" && field.value !== null) {
      if (field.key === "maxGrossWeight" && field.value.lbs && field.value.kg) {
        return (
          <Text style={styles.fieldValue}>
            {field.value.lbs} lbs / {field.value.kg} kg
          </Text>
        );
      }

      return (
        <View style={styles.objectContainer}>
          {Object.entries(field.value).map(
            ([key, val]: [string, any], idx: number) => (
              <View key={`obj-${idx}`} style={styles.objectItem}>
                <Text style={styles.objectKey}>{key}:</Text>
                <Text style={styles.objectValue}>
                  {typeof val === "object"
                    ? JSON.stringify(val)
                    : val.toString()}
                </Text>
              </View>
            )
          )}
        </View>
      );
    }

    return <Text style={styles.fieldValue}>{field.value.toString()}</Text>;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderReviewStep();
      case 1:
        return renderContainerStep();
      case 2:
        return renderSpecStep();
      default:
        return null;
    }
  };

  const renderHeader = () => {
    return (
      <View style={styles.wizardHeader}>
        <View style={styles.headerContent}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Packaging Wizard</Text>
            <Text style={styles.stepTitle}>{steps[currentStep].title}</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderFooter = () => {
    const isLastStep = currentStep === steps.length - 1;
    const isSpecsRequired = specOptions.length > 0;
    const canProceed =
      currentStep === 0 ||
      (currentStep === 1 && selections.containerType) ||
      (currentStep === 2 &&
        (!isSpecsRequired || (isSpecsRequired && selections.containerSpec)) &&
        canProceedWithDimensions());

    return (
      <SafeAreaView style={styles.footerContainer}>
        <View style={styles.footerButtons}>
          {currentStep > 0 ? (
            <TouchableOpacity
              style={styles.backButton}
              onPress={handlePrevious}
              activeOpacity={0.8}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.saveExitButton}
            onPress={handleSaveExit}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Save & Exit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.nextButton, !canProceed && styles.disabledButton]}
            onPress={handleNext}
            disabled={!canProceed || isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>
                {isLastStep ? "Finish" : "Save & Continue"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  };

  return (
    <View style={styles.container}>
      {renderHeader()}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {renderStepContent()}
      </ScrollView>

      {renderFooter()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 24,
  },
  wizardHeader: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    elevation: 2,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTextContainer: {
    flex: 1,
  },
  headerStepsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6E6E6E",
    marginBottom: 4,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000000",
  },
  stepCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 3,
  },
  stepConnector: {
    height: 2,
    width: 20,
  },
  disabledOption: {
    opacity: 0.6,
    borderColor: "#E0E0E0",
    backgroundColor: "#F5F5F5",
  },
  weightExceededBanner: {
    backgroundColor: "#FFEBEE",
    padding: 8,
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: "#F44336",
    marginTop: -8,
    marginBottom: 12,
  },
  weightExceededText: {
    color: "#D32F2F",
    fontSize: 14,
    fontWeight: "500",
  },
  disabledCard: {
    borderColor: "#E0E0E0",
    backgroundColor: "#FAFAFA",
  },
  disabledOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 8,
    zIndex: 1,
  },
  disabledText: {
    color: "#757575",
  },
  titleRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: 4,
  },
  warningText: {
    fontSize: 14,
    color: "#D32F2F",
    fontWeight: "500",
    flex: 1,
  },
  dimensionsInputContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    marginBottom: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dimensionsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 16,
  },
  dimensionInputRow: {
    marginBottom: 12,
  },
  dimensionLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: "#6E6E6E",
    marginBottom: 8,
  },
  dimensionInputGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dimensionInputWithUnit: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
  },
  dimensionInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 4,
    padding: 8,
    fontSize: 15,
  },
  dimensionUnit: {
    marginLeft: 8,
    fontSize: 15,
    color: "#6E6E6E",
    width: 24,
  },
  dimensionRequirement: {
    fontSize: 13,
    color: "#666666",
    marginTop: 4,
    fontStyle: "italic",
  },
  errorText: {
    color: "#D32F2F",
    fontSize: 13,
    marginTop: 4,
  },
  inputError: {
    borderColor: "#D32F2F",
  },
  infoText: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 8,
    marginBottom: 16,
  },
  regulationPanel: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#FFB74D",
  },
  regulationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#E65100",
    marginBottom: 8,
  },
  regulationText: {
    fontSize: 14,
    color: "#333333",
    marginBottom: 12,
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 16,
  },
  sectionDescription: {
    fontSize: 16,
    color: "#000000",
    marginBottom: 16,
    lineHeight: 22,
  },
  footerContainer: {
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  footerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  backButton: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: colors.blue,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  backButtonText: {
    color: colors.blue,
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: colors.blue,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  cancelButtonText: {
    color: colors.blue,
    fontSize: 16,
    fontWeight: "600",
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  infoLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "#6E6E6E",
  },
  infoValue: {
    flex: 2,
    fontSize: 15,
    color: "#000000",
  },
  paragraphText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#000000",
  },
  saveExitButton: {
    flex: 1,
    height: 48,
    backgroundColor: "#6C757D",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
  },
  nextButton: {
    flex: 1,
    height: 48,
    backgroundColor: colors.blue,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  disabledButton: {
    backgroundColor: "#a0a0a0",
    opacity: 0.7,
  },
  disabledButtonText: {
    color: "#ffffff",
  },
  noOptionsText: {
    fontSize: 16,
    color: "#8E8E93",
    textAlign: "center",
    marginVertical: 24,
  },
  noSpecsContainer: {
    alignItems: "center",
    padding: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginBottom: 16,
  },
  helperText: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 8,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 8,
  },
  fieldValue: {
    fontSize: 15,
    color: "#000000",
  },
  listContainer: {
    marginTop: 4,
  },
  listItem: {
    fontSize: 15,
    color: "#000000",
    marginBottom: 4,
    paddingLeft: 4,
  },
  objectContainer: {
    marginTop: 4,
  },
  objectItem: {
    flexDirection: "row",
    marginBottom: 4,
  },
  objectKey: {
    fontSize: 15,
    fontWeight: "500",
    color: "#6E6E6E",
    width: 120,
  },
  objectValue: {
    flex: 1,
    fontSize: 15,
    color: "#000000",
  },
  selectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: "transparent",
  },
  selectionCard2: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    paddingBottom: 0,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: "transparent",
  },
  stepContainer: {
    padding: 16,
    paddingTop: 5,
  },
  selectedCard: {
    borderColor: "#007AFF",
    backgroundColor: "#F0F8FF",
  },
  selectionItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectionContent: {
    flex: 1,
  },
  selectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 4,
  },
  selectionCheckbox: {
    width: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  detailsContainer: {
    marginTop: 8,
  },
  detailItem: {
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6E6E6E",
  },
  detailValue: {
    fontSize: 14,
    color: "#000000",
  },
  selectedInfo: {
    flexDirection: "row",
    backgroundColor: "#F0F8FF",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: "center",
  },
  selectedLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007AFF",
    marginRight: 8,
  },
  selectedValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000000",
  },
  exceptionContainer: {
    marginTop: 8,
    backgroundColor: "#FFF8E1",
    borderRadius: 6,
    padding: 8,
  },
  disabledExceptionContainer: {
    backgroundColor: "#FAFAFA",
    borderColor: "#EBEBEB",
    borderWidth: 1,
  },
  exceptionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FF9800",
    marginBottom: 4,
  },
  disabledExceptionLabel: {
    color: "#9E9E9E",
  },
  exceptionItem: {
    fontSize: 14,
    color: "#000000",
  },
  exceptionWeight: {
    fontSize: 14,
    color: "#000000",
  },
  configLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0277BD",
    marginTop: 8,
    fontStyle: "italic",
  },
  configurationContainer: {
    marginTop: 4,
  },
  nestedSection: {
    marginLeft: 12,
    marginTop: 8,
    marginBottom: 8,
    borderLeftWidth: 2,
    borderLeftColor: "#E0E0E0",
    paddingLeft: 8,
  },
  nestedTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#424242",
    marginBottom: 4,
  },
});

export default GrandfatheredWizard;
