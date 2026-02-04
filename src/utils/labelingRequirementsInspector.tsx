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

/**
 * Returns the descriptive label name for a given hazard class code.
 * Used for both primary and subsidiary hazard label generation.
 */
function getHazardLabelName(hazardClass: string): string {
  if (hazardClass.startsWith("1")) return "Explosive";
  if (hazardClass === "2.1") return "Flammable Gas";
  if (hazardClass === "2.2") return "Non-Flammable Gas";
  if (hazardClass === "2.3") return "Toxic Gas";
  if (hazardClass === "3") return "Flammable Liquid";
  if (hazardClass === "4.1") return "Flammable Solid";
  if (hazardClass === "4.2") return "Spontaneously Combustible";
  if (hazardClass === "4.3") return "Dangerous When Wet";
  if (hazardClass === "5.1") return "Oxidizer";
  if (hazardClass === "5.2") return "Organic Peroxide";
  if (hazardClass === "6.1") return "Toxic";
  if (hazardClass === "6.2") return "Infectious";
  if (hazardClass === "8") return "Corrosive";
  if (hazardClass === "9") return "Miscellaneous";
  return `Class ${hazardClass}`;
}

/**
 * Generates a comprehensive subsidiary hazard label value for a given class code.
 * The value includes multiple common label description formats so that it can be
 * matched against various human-readable label descriptions in inspection checklists.
 */
function buildSubsidiaryLabelValue(classCode: string): string {
  const name = getHazardLabelName(classCode);
  return `${name} (subsidiary Class ${classCode}) ${name} ${classCode} (subsidiary) ${name} (Class ${classCode}) - subsidiary hazard label`;
}

/**
 * Determines if a material is likely a liquid based on its hazard class and PSN.
 * Class 3 = always liquid. Class 2.x = gas (not liquid). Class 4.x = mostly solid.
 * Class 6.2 = always requires orientation (infectious substances).
 * For mixed classes (5.1, 5.2, 6.1, 8, 9), checks PSN for liquid indicators.
 */
function isLikelyLiquid(hazardClass: string, properShippingName: string): boolean {
  if (hazardClass === "3") return true;
  if (hazardClass.startsWith("2")) return false;
  if (hazardClass.startsWith("4")) return false;
  // Class 6.2 (infectious substances) always require orientation arrows
  if (hazardClass === "6.2") return true;
  // For other classes, check PSN for liquid indicators
  const psnLower = properShippingName.toLowerCase();
  // Check for explicit solid indicators first - if explicitly solid, not liquid
  if (
    psnLower.includes(" solid") ||
    psnLower.includes("powder") ||
    psnLower.includes("dust") ||
    psnLower.includes("pellet") ||
    psnLower.includes("granul")
  ) {
    return false;
  }
  return (
    psnLower.includes("liquid") ||
    psnLower.includes("solution") ||
    psnLower.includes("acid") ||
    psnLower.includes("mercury") ||
    psnLower.includes("gallium") ||
    psnLower.includes("wet") ||
    psnLower.includes("bomb") ||
    psnLower.includes("chlorosilane") ||
    psnLower.includes("acetone") ||
    psnLower.includes("cyanohydrin") ||
    psnLower.includes("hydrin") ||
    psnLower.includes("toxin") ||
    psnLower.includes("article")
  );
}

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
    labels["Primary Hazard"] = ["Class 9"];
    labels["Magnetized Material"] = ["Magnetized Material"];
    return labels; // Return early - only show Magnetized Material and Primary Hazard labels
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
      // Split comma-separated subsidiary risks and generate proper label values
      const subsidiaryClasses = authoritativeSubsidiaryRisk
        .split(",")
        .map((c: string) => c.trim())
        .filter(Boolean);
      labels["Subsidiary Hazard"] = subsidiaryClasses.map((classCode: string) =>
        buildSubsidiaryLabelValue(classCode)
      );
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
      // Check PSN, material details, and additionalHandlingInfo (case-insensitive)
      const class6InhalationFields = [
        extractedContentFromSddg.properShippingName,
        hazmatItem?.details || "",
        extractedContentFromSddg.additionalHandlingInfo || "",
      ].map(f => f.toLowerCase());
      const isInhalationHazardClass6 = class6InhalationFields.some(
        f => f.includes("inhalation hazard")
      );
      if (isInhalationHazardClass6) {
        labels["TOXIC INHALATION HAZARD"] = ["TOXIC INHALATION HAZARD"];
      } else {
        labels["TOXIC"] = ["TOXIC"];
      }
    } else if (isPGIII) {
      labels["Class 6 PG III"] = ["Class 6 PG III"];
    }
  }

  // Check for inhalation hazard across PSN, material details, and additionalHandlingInfo (case-insensitive)
  // Also check for special provision N34 which indicates inhalation hazard materials
  const inhalationFields = [
    extractedContentFromSddg.properShippingName,
    hazmatItem?.details || "",
    extractedContentFromSddg.additionalHandlingInfo || "",
  ].map(f => f.toLowerCase());
  const hasHazardZone = inhalationFields.some(
    f => f.includes("hazard zone a") || f.includes("hazard zone b")
  );
  const hasInhalationHazard = inhalationFields.some(
    f => f.includes("inhalation hazard")
  );
  const hasN34InhalationProvision = hazmatItem && hasSpecialProvisionAlphaCode(hazmatItem.specialProvision, "N34");
  if (hasHazardZone || hasInhalationHazard || hasN34InhalationProvision) {
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

  // AFMAN 24-604: Orientation arrows required for ALL liquids in combination packaging
  // When packaging type is unknown, still flag orientation for liquids (combination is default for most liquid hazmat)
  if (!labels["Package Orientation"] && !labels["Package Orientation Labels (applied to opposite vertical sides)"] && !labels["Orientation (This Side Up with Arrows)"]) {
    const materialHazardClass = hazmatItem?.hazclassDiv || extractedContentFromSddg.hazardClass || "";
    const materialPSN = extractedContentFromSddg.properShippingName || "";
    const materialPackagingType =
      sddgInspectionContext.packagePackagingType ||
      getPackagingTypeFromKey16(extractedContentFromSddg.quantityAndPacking);
    if (isLikelyLiquid(materialHazardClass, materialPSN) && materialPackagingType !== "single") {
      labels["Package Orientation"] = ["Package Orientation"];
    }
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
