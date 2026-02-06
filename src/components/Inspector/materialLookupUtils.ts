import { HazardousMaterialItem } from "../../hazardousMaterials/hazardousMaterialsList";

/**
 * Maps a HazardousMaterialItem to the ExtractedSDDGContent fields
 * used in the NATURE AND QUANTITY OF DANGEROUS GOODS table.
 *
 * All string fields are normalized to "" if undefined/falsy to ensure
 * table cells display "Tap..." for unfilled values.
 */
export function mapMaterialToSDDGFields(material: HazardousMaterialItem) {
  const psn = material.properShippingName || "";

  const hazclassDiv = material.hazclassDiv || "";
  const subsidiaryRisk = material.subsidiaryRisk || "";

  const hazardClass =
    subsidiaryRisk ? `${hazclassDiv} (${subsidiaryRisk})` : hazclassDiv;

  return {
    unIdNo: material.unid || "",
    properShippingName: psn,
    hazardClass,
    subsidiaryRisk,
    packingGroup: material.packingGroup || "",
    packingInstruction: material.packagingParagraph || "",
    authorization: material.specialProvision || "",
  };
}

/**
 * Returns non-FORBIDDEN materials matching a specific UNID.
 */
export function filterMaterialsByUnid(
  materials: HazardousMaterialItem[],
  unid: string
): HazardousMaterialItem[] {
  return materials.filter(
    (m) => m.unid === unid && m.packagingParagraph !== "FORBIDDEN"
  );
}

export interface DeduplicatedUnidEntry {
  unid: string;
  subtitle: string;
}

/**
 * Returns deduplicated UNID entries matching prefix + digits,
 * with the first non-FORBIDDEN PSN as subtitle for each UNID.
 *
 * UNIDs where ALL entries are FORBIDDEN are excluded entirely.
 */
export function getDeduplicatedUnids(
  materials: HazardousMaterialItem[],
  prefix: string,
  digits: string
): DeduplicatedUnidEntry[] {
  if (!digits) return [];

  const searchTerm = prefix + digits;

  // Phase 1: Collect all matching UNIDs and find first non-FORBIDDEN PSN
  const unidMap = new Map<string, string | null>();

  for (const m of materials) {
    if (!m.unid.startsWith(searchTerm)) continue;

    const existing = unidMap.get(m.unid);

    if (existing === undefined) {
      // First time seeing this UNID
      if (m.packagingParagraph !== "FORBIDDEN") {
        unidMap.set(m.unid, m.properShippingName);
      } else {
        unidMap.set(m.unid, null); // Seen but no valid subtitle yet
      }
    } else if (existing === null && m.packagingParagraph !== "FORBIDDEN") {
      // Had only FORBIDDEN entries so far — promote this valid one
      unidMap.set(m.unid, m.properShippingName);
    }
    // If existing is already a string, we already have a valid subtitle — skip
  }

  // Phase 2: Build results, excluding all-FORBIDDEN UNIDs (subtitle === null)
  const result: DeduplicatedUnidEntry[] = [];
  for (const [unid, subtitle] of unidMap) {
    if (subtitle !== null) {
      result.push({ unid, subtitle });
    }
  }

  return result;
}
