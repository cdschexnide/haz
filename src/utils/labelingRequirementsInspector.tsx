import React, { useContext } from "react";
import { HazProPreparerContext } from "@//contexts/HazProPreparerProvider/HazProPreparerContext";
import { ExtractedSDDGContent, SDDGInspectionContext } from "@//types/sddg";
import {
  hazardousMaterialsList,
  HazardousMaterialItem,
} from "@//hazardousMaterials/hazardousMaterialsList";
import {
  hasSpecialProvisionCode,
  hasSpecialProvisionAlphaCode,
} from "@/utils/specialProvisions";
import { getPackagingTypeFromKey16 } from "@/utils/getPackagingTypeFromKey16";

export function evaluateLabelingRequirements(
  sddgInspectionContext: SDDGInspectionContext
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
  const labelingContext = sddgInspectionContext.labelingContext || {};

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

  const isEngineLabelExempt =
    ["UN3528", "UN3529", "UN3530"].includes(unIdNo) &&
    labelingContext.isUnenclosedEngineOrMachinery === true;
  const isVehicleLabelExempt =
    unIdNo === "UN3166" &&
    labelingContext.isVehicleUN3166WithNoLabelsRequired === true;

  if (isEngineLabelExempt || isVehicleLabelExempt) {
    return labels;
  }

  const resolveClass1Label = (
    hazardClass: string,
    compatibilityGroup?: string
  ) => {
    if (!hazardClass) return hazardClass;
    if (/[A-Z]$/.test(hazardClass)) return hazardClass;
    if (compatibilityGroup) return `${hazardClass}${compatibilityGroup}`;
    return hazardClass;
  };

  // Use authoritative hazard class from database, not scanned data
  if (hazmatItem?.hazclassDiv) {
    const authoritativeHazardClass = hazmatItem.hazclassDiv;
    const shouldSkipDivision41 =
      authoritativeHazardClass.startsWith("4.1") &&
      labelingContext.hasDiv42LabelApplied === true;
    if (!shouldSkipDivision41) {
      if (authoritativeHazardClass.startsWith("1")) {
        const class1Label = resolveClass1Label(
          authoritativeHazardClass,
          labelingContext.class1CompatibilityGroupLetter
        );
        labels["Primary Hazard"] = [`Class ${class1Label}`];
      } else {
        labels["Primary Hazard"] = [`Class ${authoritativeHazardClass}`];
      }
    }
  }

  // Use authoritative subsidiary risk from database, not scanned data
  if (hazmatItem?.subsidiaryRisk && hazmatItem.subsidiaryRisk !== "") {
    const authoritativeSubsidiaryRisk = hazmatItem.subsidiaryRisk;
    const authoritativeHazardClass =
      hazmatItem?.hazclassDiv || extractedContentFromSddg.hazardClass;
    const shouldSkipSubsidiaryToxic =
      authoritativeHazardClass?.startsWith("8") &&
      authoritativeSubsidiaryRisk.startsWith("6.1") &&
      labelingContext.isCorrosiveOnlyForClass8With6_1 === true;
    if (!shouldSkipSubsidiaryToxic) {
      labels["Subsidiary Hazard"] = [
        `Subsidiary Class ${authoritativeSubsidiaryRisk}`,
      ];
    }
  }

  // UN3316 kits: apply labels for each hazard within the kit (A15.4.7.2)
  if (unIdNo === "UN3316" && sddgInspectionContext.kitInspectionData?.contents) {
    const kitPrimaryClasses = new Set<string>();
    const kitSubsidiaryClasses = new Set<string>();

    sddgInspectionContext.kitInspectionData.contents.forEach(item => {
      const hazardClasses = item.hazardClass
        ? item.hazardClass.split(",").map(c => c.trim()).filter(Boolean)
        : [];
      hazardClasses.forEach(hazardClass => kitPrimaryClasses.add(hazardClass));

      const subsidiaryClasses = item.subsidiaryRisk
        ? item.subsidiaryRisk.split(",").map(c => c.trim()).filter(Boolean)
        : [];
      subsidiaryClasses.forEach(subsidiary => kitSubsidiaryClasses.add(subsidiary));
    });

    kitPrimaryClasses.forEach(hazardClass => {
      labels[`Kit Hazard: Class ${hazardClass}`] = [`Class ${hazardClass}`];
    });

    kitSubsidiaryClasses.forEach(subsidiaryClass => {
      labels[`Kit Subsidiary: Class ${subsidiaryClass}`] = [
        `Subsidiary Class ${subsidiaryClass}`,
      ];
    });
  }

  if (hazmatItem && hasSpecialProvisionCode(hazmatItem.specialProvision, "53")) {
    labels["Subsidiary Hazard (Explosive)"] = ["Class 1", "1", "Explosive"];
  }

  // Apply "This Way Up" labels on opposite vertical sides to ensure liquid hazardous materials remain in their intended orientation
  if (extractedContentFromSddg.unIdNo === "UN3363") {
    labels["Package Orientation Labels (applied to opposite vertical sides)"] =
      ["This Way Up"];
  }

  // A14.4.1.3 - Class 1 explosives containing liquids require "THIS SIDE UP" on TOP of package
  // A14.3.6.1 - Liquid hazmat in combination packaging requires orientation arrows on TWO OPPOSITE SIDES
  // UN0247: AMMUNITION, INCENDIARY (liquid or gel) - requires both per AFMAN 24-604
  // ML detection class: thisSideUpWithOrientationArrows
  if (extractedContentFromSddg.unIdNo === "UN0247") {
    labels["Orientation (This Side Up with Arrows)"] = [
      "This Side Up",
      "Orientation",
    ];
  }

  const aircraftTypeValue = extractedContentFromSddg.aircraftType || "";
  const unNumber = extractedContentFromSddg.unIdNo;
  const hazardousMaterial = hazardousMaterialsList.find((material) => material.unid === unNumber);
  const packagingType =
    sddgInspectionContext.packagePackagingType ||
    getPackagingTypeFromKey16(extractedContentFromSddg.quantityAndPacking);
  const hasA1SinglePackagingRestriction =
    hazardousMaterial &&
    hasSpecialProvisionAlphaCode(hazardousMaterial.specialProvision, "A1") &&
    packagingType === "single";

  // Check if Cargo Aircraft Only label is required:
  // 1. Aircraft type is explicitly "CARGO AIRCRAFT ONLY", OR
  // 2. Material has special provision P1, P2, P3, or P4 (word boundary to avoid matching P11, P12, etc.)
  const hasCargoOnlyProvision = hazardousMaterial && /\bP[1-4]\b/.test(hazardousMaterial.specialProvision);
  if (
    aircraftTypeValue === "CARGO AIRCRAFT ONLY" ||
    hasCargoOnlyProvision ||
    hasA1SinglePackagingRestriction
  ) {
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

  if (labelingContext.isRecoilMechanismOrArtilleryMount === true) {
    labels["Recoil Mechanism/Artillery Gun Mount"] = [
      "Recoil Mechanism",
      "Artillery Gun Mount",
    ];
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
