import { HazardousMaterialItem } from "@/hazardousMaterials/hazardousMaterialsList";
import { ExtractedSDDGContent } from "@/types/sddg";

/**
 * Maps a HazardousMaterialItem to a complete ExtractedSDDGContent
 * with sensible defaults for non-material fields.
 */
export function materialToSddg(
  material: HazardousMaterialItem
): ExtractedSDDGContent {
  return {
    // Material-specific fields (from hazardousMaterialsList)
    unIdNo: material.unid,
    properShippingName: material.properShippingName,
    hazardClass: material.hazclassDiv,
    subsidiaryRisk: material.subsidiaryRisk,
    packingGroup: material.packingGroup,
    packingInstruction: material.packagingParagraph,

    // Quantity — use packaging paragraph to build a plausible Key 16
    quantityAndPacking: "1 x Fiberboard Box / 10 kg",

    // Non-material defaults
    shipper: "TEST SHIPPER, BLDG 100, TEST AFB TX 79908",
    consignee: "TEST CONSIGNEE, BLDG 200, DEST AFB CA 93524",
    airWaybillNumber: "",
    pagination: "1/1",
    shippersReferenceNumber: `TCN-TEST-${material.unid}`,
    inspectionActivity: "",
    aircraftType: "CAO",
    airportOfDeparture: "KDOV",
    airportOfDestination: "ETAR",
    shipmentType: "NON-RADIOACTIVE",
    authorization: "",
    additionalHandlingInfo: "24 HR EMERGENCY: 1-800-424-8802",
    nameOfSignatory: "TEST PREPARER / SGT / HAZMAT SPECIALIST",
    placeAndDate: "TEST AFB / 01 FEB 2026",
    signature: "",
  };
}
