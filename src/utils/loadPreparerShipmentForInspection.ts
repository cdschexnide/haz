import ShipmentDatabase from "@/services/shipment/ShipmentDatabase";
import {
  mapPreparerShipmentToInspectionSeed,
  PreparerShipmentInspectionSeed,
} from "@/utils/preparerShipmentToInspection";

/**
 * Loads a preparer shipment by ID and maps it to an InspectionSeed.
 * Pure data utility - callers are responsible for context mutations and navigation.
 */
export async function loadPreparerShipmentForInspection(
  shipmentId: string
): Promise<PreparerShipmentInspectionSeed> {
  const shipmentFile = await ShipmentDatabase.loadShipment(shipmentId);
  const preparerContext = shipmentFile?.hazProPreparerContext;

  if (!preparerContext) {
    throw new Error(
      "Shipment was found but its data is unavailable. Please try another record."
    );
  }

  return mapPreparerShipmentToInspectionSeed(preparerContext);
}
