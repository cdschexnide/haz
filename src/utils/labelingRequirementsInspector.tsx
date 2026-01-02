import React, { useContext } from "react";
import { HazProPreparerContext } from "@//contexts/HazProPreparerProvider/HazProPreparerContext";
import { ExtractedSDDGContent, SDDGInspectionContext } from "@//types/sddg";
import {
  hazardousMaterialsList,
  HazardousMaterialItem,
} from "@//hazardousMaterials/hazardousMaterialsList";

export function evaluateLabelingRequirements(
  sddgInspectionContext: any
): Record<string, string[]> {
  const labels: Record<string, string[]> = {};

  if (!sddgInspectionContext) return labels;

  // Use verification copy (post-verification data) if available, fallback to original extracted content
  const extractedContentFromSddg =
    sddgInspectionContext.verificationCopy ||
    sddgInspectionContext.extractedContent;

  if (!extractedContentFromSddg) return labels;

  // Get the authoritative hazmat data from the database based on UN ID
  const unIdNo = extractedContentFromSddg.unIdNo;
  const hazmatItem = hazardousMaterialsList.find(item => item.unid === unIdNo);

  console.log("🏷️ [LabelingRequirements] Processing UN ID:", unIdNo);
  console.log(
    "🏷️ [LabelingRequirements] Found hazmat item:",
    hazmatItem ? "Yes" : "No"
  );
  if (hazmatItem) {
    console.log(
      "🏷️ [LabelingRequirements] Authoritative hazard class:",
      hazmatItem.hazclassDiv
    );
    console.log(
      "🏷️ [LabelingRequirements] Scanned hazard class:",
      extractedContentFromSddg.hazardClass
    );
  }

  // Special handling for UN2807 - Magnetized Material
  if (unIdNo === "UN2807") {
    labels["Magnetized Material"] = ["Magnetized Material"];
    return labels; // Return early - only show Magnetized Material label
  }

  // Use authoritative hazard class from database, not scanned data
  if (hazmatItem?.hazclassDiv) {
    const authoritativeHazardClass = hazmatItem.hazclassDiv;
    if (authoritativeHazardClass.startsWith("1")) {
      labels["Primary Hazard"] = [`Class ${authoritativeHazardClass}`];
    } else if (
      authoritativeHazardClass === "5.1" ||
      authoritativeHazardClass === "5.2"
    ) {
      labels["Primary Hazard"] = [`Class ${authoritativeHazardClass}`];
    } else {
      labels["Primary Hazard"] = [`Class ${authoritativeHazardClass}`];
    }
  }

  // Use authoritative subsidiary risk from database, not scanned data
  if (hazmatItem?.subsidiaryRisk && hazmatItem.subsidiaryRisk !== "") {
    const authoritativeSubsidiaryRisk = hazmatItem.subsidiaryRisk;
    if (authoritativeSubsidiaryRisk.startsWith("1")) {
      labels["Subsidiary Hazard"] = [
        `Subsidiary Class ${authoritativeSubsidiaryRisk}`,
      ];
    } else {
      labels["Subsidiary Hazard"] = [
        `Subsidiary Class ${authoritativeSubsidiaryRisk}`,
      ];
    }
  }

  // Apply "This Way Up" labels on opposite vertical sides to ensure liquid hazardous materials remain in their intended orientation
  if (extractedContentFromSddg.unIdNo === "UN3363") {
    labels["Package Orientation Labels (applied to opposite vertical sides)"] =
      ["This Way Up"];
  }

  const specialProvisions = extractedContentFromSddg.aircraftType || "";

  if (specialProvisions === "CARGO AIRCRAFT ONLY") {
    labels["Cargo Aircraft Only"] = ["Cargo Aircraft Only"];
  }

  //   if (extractedContentFromSddg.unIdNo === "UN2807" || context.batteryVehicle?.key19?.containsMagnetizedMaterial === true) {
  //     labels["Magnetized Material"] = ["Magnetized Material"];
  //   }

  const selfReactiveRegex = /\bself[- ]?reactive\b/i;
  const authoritativeHazardClass =
    hazmatItem?.hazclassDiv || extractedContentFromSddg.hazardClass;
  const A19_2_1_4Condition =
    authoritativeHazardClass?.includes("4.1") &&
    selfReactiveRegex.test(extractedContentFromSddg.properShippingName);

  if (A19_2_1_4Condition) {
    labels["Keep Away From Heat"] = ["Keep Away From Heat"];
  }

  if (
    extractedContentFromSddg.unIdNo === "UN1072" ||
    extractedContentFromSddg.unIdNo === "UN1073"
  ) {
    labels["OXYGEN"] = ["OXYGEN"];
  }

  // Class 6 – Toxic & Infectious Substances
  // there are no class 6 materials that says they're an inhalation hazard
  if (authoritativeHazardClass?.startsWith("6")) {
    // Use authoritative packing group from database if available
    const authoritativePackingGroup =
      hazmatItem?.packingGroup || extractedContentFromSddg.packingGroup;
    const packingGroups = authoritativePackingGroup
      ? authoritativePackingGroup.split(", ")
      : [];
    const isPGIOrII =
      packingGroups.includes("I") || packingGroups.includes("II");
    const isPGIII = packingGroups.includes("III");

    if (isPGIOrII) {
      // Check if it's specifically an inhalation hazard or just toxic
      if (
        extractedContentFromSddg.properShippingName
          .toLowerCase()
          .includes("inhalation hazard")
      ) {
        labels["TOXIC INHALATION HAZARD"] = ["TOXIC INHALATION HAZARD"];
      } else {
        labels["TOXIC"] = ["TOXIC"];
      }
    } else if (isPGIII) {
      labels["Class 6 PG III"] = ["Class 6 PG III"];
    }
  }

  if (
    extractedContentFromSddg.properShippingName.includes("Hazard Zone A") ||
    extractedContentFromSddg.properShippingName.includes("Hazard Zone B")
  ) {
    labels["TOXIC INHALATION HAZARD"] = ["TOXIC INHALATION HAZARD"];
  }

  /* Still need to do this one */
  if (["UN2814", "UN2900"].includes(extractedContentFromSddg.unIdNo)) {
    labels["INFECTIOUS SUBSTANCE"] = ["INFECTIOUS SUBSTANCE"];
  }

  if (
    ["UN2794", "UN2795", "UN2800"].includes(extractedContentFromSddg.unIdNo)
  ) {
    labels["Package Orientation"] = ["Package Orientation"];
  }

  /* Still need to do this one */
  // add logic to extract multiple hazard classes and add label requirements
  // if (extractedContentFromSddg.unIdNo === "UN3316") {
  //   // This would require additional logic to determine individual hazards within the kit
  //   // For now, we'll include the primary hazard using authoritative data
  //   labels["Chemical Kit Primary Hazard"] = [`Class ${authoritativeHazardClass}`];

  //   // Add subsidiary hazard if present using authoritative data
  //   const authoritativeSubsidiaryRisk = hazmatItem?.subsidiaryRisk || extractedContentFromSddg.subsidiaryRisk;
  //   if (authoritativeSubsidiaryRisk && authoritativeSubsidiaryRisk !== "") {
  //     const existingLabels = labels["Chemical Kit Primary Hazard"] || [];
  //     labels["Chemical Kit Primary Hazard"] = [...existingLabels, `Subsidiary Class ${authoritativeSubsidiaryRisk}`];
  //   }
  // }

  return labels;
}
