import type { HazProPreparerContext } from "@/contexts/HazProPreparerProvider/reducer";
import { buildLithiumBatteryKey16 } from "@/utils/buildLithiumBatteryKey16";
import { getContainerDescriptionFromCode } from "@/utils/getContainerDescriptionFromPackagingCode";
import { summarizeCylinderDescriptionForSddg } from "@/utils/summarizeCylinderDescriptionForSddg";
import { PhysicalState } from "../../types";

export const getSddgQuantityAndTypeOfPacking = (
  context: HazProPreparerContext
): string => {
  // MEGC has explicit formatting and takes precedence
  if (context.megcProperties) {
    return `1 Multiple-Element Gas Container X ${context.megcProperties.quantityPerCylinder.kg} KG`;
  }

  const vehiclePostfix =
    context.un3166Details &&
    typeof context.un3166Details?.quantity === "string" &&
    parseInt(context.un3166Details?.quantity, 10) > 1
      ? "s"
      : "";

  const vehiclePacking =
    context.un3166Details &&
    context.un3166Details.vehicleNomenclature !== ""
      ? `${context.un3166Details.quantity} ${context.un3166Details.vehicleNomenclature}${vehiclePostfix}`
      : "";

  if (context.capacitorData) {
    return context.capacitorData.outerPackagingDescription || "";
  }
  if (context.safetyDeviceData) {
    return `${context.safetyDeviceData.numberOfArticles} x ${context.safetyDeviceData.outerPackagingTypeLabel} (${context.safetyDeviceData.prepType})`;
  }
  if (context.batteryVehicle) {
    const netQty = context.batteryVehicle.key16.netQuantity;
    let result = `${context.batteryVehicle.key16.description}, ${netQty.valueKg.toFixed(2)} kg`;
    if (netQty.unit === "lbs") {
      result += ` (${netQty.value.toFixed(1)} lbs)`;
    }
    return result;
  }
  if (context.lifeSavingApplianceData) {
    return context.lifeSavingApplianceData.key16;
  }
  if (context.geneticallyModifiedOrganism) {
    return context.geneticallyModifiedOrganism.key16;
  }
  if (context.dryIceData) {
    return `1 ${context.dryIceData.packagingType} x ${context.dryIceData.quantity}KG`;
  }
  if (context.lithiumBatteryData) {
    return buildLithiumBatteryKey16(context.lithiumBatteryData);
  }
  if (context.cylinderProperties) {
    return summarizeCylinderDescriptionForSddg(context.cylinderProperties as any);
  }
  if (
    (context.specialAuthorizationAttested && context.specialAuthorizationType) ||
    context.usesCoeCertification ||
    context.usesCaaCertification ||
    context.usesDotSpPermit
  ) {
    return context.specialAuthorizationQuantityAndTypeOfPacking || "";
  }

  if (context.hazardousMaterial?.hazclassDiv.startsWith("1")) {
    const containerDesc = context.isGrandfatheredExplosive
      ? `1 ${context.grandfatheredExplosive?.generalPackageDescription.toUpperCase()}`
      : context.hazardousMaterial?.physicalState === PhysicalState.SOLID
      ? `1 ${getContainerDescriptionFromCode(context.packaging?.inputPOPMarking?.B ?? undefined)?.toUpperCase()} (${context.packaging?.inputPOPMarking?.B}) x ${context.packaging?.totalNetMass?.kg} KG`
      : `1 ${getContainerDescriptionFromCode(context.packaging?.inputPOPMarking?.B ?? undefined)?.toUpperCase()} (${context.packaging?.inputPOPMarking?.B}) x ${context.packaging?.totalNetVolume?.liters} L`;

    const newData = context.isGrandfatheredExplosive
      ? context.grandfatheredExplosivesContainers[0]?.grossMass
      : context.shipment?.totalNetExplosiveWeight;

    return `${containerDesc} (${newData}KG NEW)`;
  }

  if (context.hazardousMaterial?.unid === "UN2807") {
    return context.magnetizedMaterialData?.wantsToSpecifyWeightAndSize
      ? `${context.magnetizedMaterialData?.outerPackagingDescription} (${context.magnetizedMaterialData?.length}in x ${context.magnetizedMaterialData?.width}in x ${context.magnetizedMaterialData?.height}in x ${context.magnetizedMaterialData?.weight} KG)`
      : context.magnetizedMaterialData?.outerPackagingDescription ?? "";
  }

  if (vehiclePacking) {
    return vehiclePacking;
  }

  return context.isGrandfatheredExplosive
    ? `1 ${context.grandfatheredExplosive?.generalPackageDescription.toUpperCase()}`
    : context.hazardousMaterial?.physicalState === PhysicalState.SOLID
    ? `1 ${getContainerDescriptionFromCode(context.packaging?.inputPOPMarking?.B ?? undefined)?.toUpperCase()} (${context.packaging?.inputPOPMarking?.B}) x ${context.packaging?.totalNetMass?.kg} KG`
    : `1 ${getContainerDescriptionFromCode(context.packaging?.inputPOPMarking?.B ?? undefined)?.toUpperCase()} (${context.packaging?.inputPOPMarking?.B}) x ${context.packaging?.totalNetVolume?.liters} L`;
};
