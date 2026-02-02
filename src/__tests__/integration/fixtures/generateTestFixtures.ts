import {
  hazardousMaterialsList,
  HazardousMaterialItem,
} from "@/hazardousMaterials/hazardousMaterialsList";
import { ExtractedSDDGContent } from "@/types/sddg";
import { AggregatedAnalysis } from "@/ml/types/ocr";
import { materialToSddg } from "../helpers/materialToSddg";
import {
  materialToHappyMlResults,
  materialToFrustrationMlResults,
} from "../helpers/materialToMlResults";
import {
  getAllowedPackagingTypes,
  PackagingTypeSelection,
} from "@/utils/getAllowedPackagingTypes";

/**
 * UN numbers that trigger material-specific screens.
 * These always get their own fixture even if they share a packaging paragraph.
 */
export const SPECIAL_ROUTE_UN_NUMBERS = [
  "NA2212",
  "UN2212",
  "UN2590", // Asbestos
  "UN3171", // Battery-powered vehicle
  "UN3373", // Biological substance Cat B
  "UN3508", // Capacitors
  "ID8000", // Consumer commodity
  "UN3363", // Dangerous goods in apparatus
  "UN1845", // Dry ice
  "UN3528",
  "UN3529", // Engines
  "UN3316", // First aid kit
  "UN3166", // Fuel-powered vehicle
  "UN2814",
  "UN2900",
  "UN3245", // Infectious substances
  "UN3072",
  "UN2990", // Life-saving appliances
  "UN3091",
  "UN3481",
  "UN3536", // Lithium batteries (contained/packed)
  "UN3480",
  "UN3090", // Lithium batteries (standalone)
  "UN2807", // Magnetized material
  "UN3548", // Misc dangerous goods articles
  "UN3268", // Safety devices
];

const SPECIAL_ROUTE_SET = new Set(SPECIAL_ROUTE_UN_NUMBERS);

export interface TestFixture {
  /** Deduplication key */
  dedupKey: string;
  /** The representative HazardousMaterialItem */
  material: HazardousMaterialItem;
  /** Pre-populated SDDG data */
  sddgData: ExtractedSDDGContent;
  /** ML results for happy path (correct detections) */
  happyMlResults: AggregatedAnalysis;
  /** ML results for frustration path (missing label, invalid code) */
  frustrationMlResults: AggregatedAnalysis;
  /** Expected allowed packaging types for this material */
  expectedPackagingTypes: PackagingTypeSelection[];
  /** Whether this material triggers a special routing screen */
  hasSpecialRoute: boolean;
  /** The special screen name if applicable */
  specialScreenName: string | null;
}

/**
 * Determines the special route key for deduplication.
 * Special-route materials get their own key by UN number + packaging paragraph
 * to ensure they're never collapsed with non-special materials.
 */
function getSpecialRouteKey(material: HazardousMaterialItem): string {
  if (SPECIAL_ROUTE_SET.has(material.unid)) {
    return material.unid;
  }
  return "none";
}

/**
 * Maps a UN number to its special screen name (mirrors getSpecialMaterialRoute).
 */
function getSpecialScreenName(
  unid: string,
  packagingParagraph: string
): string | null {
  if (["NA2212", "UN2212", "UN2590"].includes(unid))
    return "InspectorAsbestosScreen";
  if (unid === "UN3171") return "InspectorBatteryPoweredVehicleScreen";
  if (unid === "UN3373")
    return "InspectorBiologicalSubstancesCategoryBScreen";
  if (unid === "UN3508") return "InspectorCapacitorsScreen";
  if (unid === "ID8000") return "InspectorConsumerCommodityScreen";
  if (unid === "UN3363") return "InspectorDangerousGoodsInApparatusScreen";
  if (unid === "UN1845") return "InspectorDryIceScreen";
  if (["UN3528", "UN3529"].includes(unid))
    return "InspectorEnginesInternalCombustionScreen";
  if (unid === "UN3316") return "InspectorFirstAidChemicalKitScreen";
  if (unid === "UN3166") return "InspectorFuelPoweredVehicleScreen";
  if (["UN2814", "UN2900", "UN3245"].includes(unid))
    return "InspectorInfectiousSubstancesScreen";
  if (["UN3072", "UN2990"].includes(unid))
    return "InspectorLifeSavingAppliancesScreen";
  const upperParagraph = packagingParagraph.toUpperCase();
  if (
    ["UN3091", "UN3481", "UN3536"].includes(unid) &&
    upperParagraph.startsWith("A13.8")
  )
    return "InspectorLithiumBatteriesContainedInEquipmentScreen";
  if (
    ["UN3091", "UN3481"].includes(unid) &&
    upperParagraph.startsWith("A13.9")
  )
    return "InspectorLithiumBatteriesPackedWithEquipmentScreen";
  if (["UN3480", "UN3090"].includes(unid))
    return "InspectorLithiumBatteriesScreen";
  if (unid === "UN2807") return "InspectorMagnetizedMaterialsScreen";
  if (unid === "UN3548")
    return "InspectorMiscDangerousGoodsArticlesScreen";
  if (unid === "UN3268") return "InspectorSafetyDevicesScreen";
  return null;
}

/**
 * Generates deduplicated test fixtures from the full hazardous materials list.
 */
export function generateTestFixtures(): TestFixture[] {
  const seen = new Map<string, TestFixture>();

  for (const material of hazardousMaterialsList) {
    // Skip forbidden materials
    if (
      material.packagingParagraph === "FORBIDDEN" ||
      material.packagingParagraph === "See Technical Name"
    ) {
      continue;
    }

    // Get primary packaging paragraph (before any colon separators)
    const primaryParagraph =
      material.packagingParagraph.split(/[,:]/)[0]?.trim() || "";
    if (!primaryParagraph) continue;

    const specialRouteKey = getSpecialRouteKey(material);
    const dedupKey = `${primaryParagraph}|${material.hazclassDiv}|${material.packingGroup}|${specialRouteKey}`;

    // Keep first occurrence per dedup key
    if (seen.has(dedupKey)) continue;

    const hasA2 = material.specialProvision.includes("A2");
    let expectedPackagingTypes: PackagingTypeSelection[] = [];
    try {
      expectedPackagingTypes = getAllowedPackagingTypes({
        packagingParagraph: primaryParagraph,
        hasA2Restriction: hasA2,
        unIdNo: material.unid,
        properShippingName: material.properShippingName,
      });
    } catch {
      // If packaging lookup fails, record empty — test will catch it
      expectedPackagingTypes = [];
    }

    const specialScreenName = getSpecialScreenName(
      material.unid,
      material.packagingParagraph
    );

    seen.set(dedupKey, {
      dedupKey,
      material,
      sddgData: materialToSddg(material),
      happyMlResults: materialToHappyMlResults(material),
      frustrationMlResults: materialToFrustrationMlResults(material),
      expectedPackagingTypes,
      hasSpecialRoute: specialScreenName !== null,
      specialScreenName,
    });
  }

  return Array.from(seen.values());
}
