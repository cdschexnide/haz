import { resolvePackingInstruction } from "./resolvePackingInstruction";

type InspectionLike = {
  verificationCopy?: { unIdNo?: string; packingInstruction?: string };
  extractedContent?: { unIdNo?: string; packingInstruction?: string };
  quantityType?: "standard" | "limited" | "excepted";
  specialAuthorizationAttested?: boolean;
};

export type NextRoute = { screen: string; params?: Record<string, any> };

const getUnIdNo = (inspection: InspectionLike) =>
  inspection?.verificationCopy?.unIdNo ||
  inspection?.extractedContent?.unIdNo ||
  "";

const normalizePackingInstruction = (value: string) => {
  if (!value) return "";
  return value.split(/[,:]/)[0]?.trim().toUpperCase() || "";
};

const getPackingInstruction = (inspection: InspectionLike) => {
  const raw =
    inspection?.verificationCopy?.packingInstruction ||
    inspection?.extractedContent?.packingInstruction ||
    "";
  if (raw) return normalizePackingInstruction(raw);

  return resolvePackingInstruction(
    inspection?.verificationCopy?.unIdNo ||
      inspection?.extractedContent?.unIdNo,
    raw
  );
};

export const getSpecialMaterialRoute = (
  inspection: InspectionLike
): string | null => {
  const unIdNo = getUnIdNo(inspection);

  if (["NA2212", "UN2212", "UN2590"].includes(unIdNo)) {
    return "InspectorAsbestosScreen";
  }
  if (unIdNo === "UN3171") return "InspectorBatteryPoweredVehicleScreen";
  if (unIdNo === "UN3373") return "InspectorBiologicalSubstancesCategoryBScreen";
  if (unIdNo === "UN3508") return "InspectorCapacitorsScreen";
  if (unIdNo === "ID8000") return "InspectorConsumerCommodityScreen";
  if (unIdNo === "UN3363") return "InspectorDangerousGoodsInApparatusScreen";
  if (unIdNo === "UN1845") return "InspectorDryIceScreen";
  if (["UN3528", "UN3529"].includes(unIdNo)) {
    return "InspectorEnginesInternalCombustionScreen";
  }
  if (unIdNo === "UN3316") return "InspectorFirstAidChemicalKitScreen";
  if (unIdNo === "UN3166") return "InspectorFuelPoweredVehicleScreen";
  if (["UN2814", "UN2900", "UN3245"].includes(unIdNo)) {
    return "InspectorInfectiousSubstancesScreen";
  }
  if (["UN3072", "UN2990"].includes(unIdNo)) {
    return "InspectorLifeSavingAppliancesScreen";
  }

  const packingInstruction = getPackingInstruction(inspection).toUpperCase();
  if (
    ["UN3091", "UN3481", "UN3536"].includes(unIdNo) &&
    packingInstruction.startsWith("A13.8")
  ) {
    return "InspectorLithiumBatteriesContainedInEquipmentScreen";
  }
  if (
    ["UN3091", "UN3481"].includes(unIdNo) &&
    packingInstruction.startsWith("A13.9")
  ) {
    return "InspectorLithiumBatteriesPackedWithEquipmentScreen";
  }
  if (["UN3480", "UN3090"].includes(unIdNo)) {
    return "InspectorLithiumBatteriesScreen";
  }
  if (unIdNo === "UN2807") return "InspectorMagnetizedMaterialsScreen";
  if (unIdNo === "UN3548") return "InspectorMiscDangerousGoodsArticlesScreen";
  if (unIdNo === "UN3268") return "InspectorSafetyDevicesScreen";

  return null;
};

export const shouldSkipPopMarking = (inspection: InspectionLike): boolean => {
  const quantityType = inspection?.quantityType || "standard";

  if (inspection?.specialAuthorizationAttested) return true;
  if (getSpecialMaterialRoute(inspection)) return true;
  if (quantityType === "excepted" || quantityType === "limited") return true;
  if (getPackingInstruction(inspection).toUpperCase().startsWith("A6")) return true;

  return false;
};

export const getPostSddgStartRoute = (inspection: InspectionLike): NextRoute => {
  const specialRoute = getSpecialMaterialRoute(inspection);
  if (specialRoute) {
    return { screen: specialRoute };
  }

  return { screen: "InspectorAttachment28WizardScreen" };
};

export const getPostMlDetectionRoute = (inspection: InspectionLike): NextRoute => {
  const unIdNo = getUnIdNo(inspection);
  const quantityType = inspection?.quantityType || "standard";

  if (quantityType === "excepted") {
    return {
      screen:
        unIdNo === "UN3316"
          ? "InspectorFirstAidChemicalKitScreen"
          : "InspectorLabelingExceptionsScreen",
    };
  }

  if (getPackingInstruction(inspection).toUpperCase().startsWith("A6")) {
    return { screen: "InspectorCylinderTypeSelectionScreen" };
  }

  if (quantityType === "limited") {
    return {
      screen:
        unIdNo === "UN3316"
          ? "InspectorFirstAidChemicalKitScreen"
          : "InspectorLabelingExceptionsScreen",
    };
  }

  if (shouldSkipPopMarking(inspection)) {
    return { screen: "InspectorMarkingsLabelsValidationScreen" };
  }

  return { screen: "InspectorPOPMarkingDataEntry" };
};
