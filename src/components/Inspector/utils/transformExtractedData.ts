import { ExtractedSDDGContent } from "../../../../src/types/sddg";
import { InspectorShippersDeclarationProps } from "../InspectorShippersDeclarationForm";

/**
 * Transform ExtractedSDDGContent from Valtio store to Inspector component props format
 *
 * This utility handles the conversion between the flat SDDG data structure stored
 * in the Valtio store and the structured format expected by Inspector components.
 */
export const transformExtractedContentToInspectorProps = (
  extractedContent: ExtractedSDDGContent | null
): InspectorShippersDeclarationProps["extractedData"] | null => {
  if (!extractedContent) {
    return null;
  }

  return {
    shipper: extractedContent.shipper || "",
    consignee: extractedContent.consignee || "",
    airwayBill: extractedContent.airWaybillNumber || "",
    pagination: extractedContent.pagination || "",
    shippersReferenceNumber: extractedContent.shippersReferenceNumber || "",
    inspectionActivity: extractedContent.inspectionActivity || "",
    aircraftType: extractedContent.aircraftType || "",
    airportOfDeparture: extractedContent.airportOfDeparture || "",
    airportOfDestination: extractedContent.airportOfDestination || "",
    shipmentType: extractedContent.shipmentType || "",
    hazardousMaterials: [
      {
        airWaybillNumber: extractedContent.airWaybillNumber || "",
        unIdNo: extractedContent.unIdNo || "",
        properShippingName: extractedContent.properShippingName || "",
        hazardClass: extractedContent.hazardClass || "",
        subsidiaryRisk: extractedContent.subsidiaryRisk || "",
        packingGroup: extractedContent.packingGroup || "",
        quantityAndPacking: extractedContent.quantityAndPacking || "",
        packingInstruction: extractedContent.packingInstruction || "",
        authorization: extractedContent.authorization || "",
      },
    ],
    additionalHandlingInfo: extractedContent.additionalHandlingInfo || "",
    emergencyTelephoneNumber: "", // Not available in ExtractedSDDGContent structure
    nameOfSignatory: extractedContent.nameOfSignatory || "",
    placeAndDate: extractedContent.placeAndDate || "",
    signature: extractedContent.signature || "",
  };
};

/**
 * Transform mock data format to Inspector component props format
 *
 * This is used for the mock data flow from SDDGUploadAndParse
 */
export const transformMockDataToInspectorProps = (
  mockData: any
): InspectorShippersDeclarationProps["extractedData"] => {
  return {
    shipper: mockData.shipper || "",
    consignee: mockData.consignee || "",
    airwayBill: mockData.airwayBill || "",
    pagination: mockData.pagination || "",
    shippersReferenceNumber: mockData.shippersReferenceNumber || "",
    inspectionActivity: mockData.inspectionActivity || "",
    aircraftType: mockData.aircraftType || "",
    airportOfDeparture: mockData.airportOfDeparture || "",
    airportOfDestination: mockData.airportOfDestination || "",
    shipmentType: mockData.shipmentType || "",
    hazardousMaterials: mockData.hazardousMaterials || [],
    additionalHandlingInfo: mockData.additionalHandlingInfo || "",
    emergencyTelephoneNumber: mockData.emergencyTelephoneNumber || "",
    nameOfSignatory: mockData.nameOfSignatory || "",
    placeAndDate: mockData.placeAndDate || "",
    signature: mockData.signature || "",
  };
};

/**
 * Check if extracted content has sufficient data for preview
 */
export const hasValidExtractedContent = (
  extractedContent: ExtractedSDDGContent | null
): boolean => {
  if (!extractedContent) return false;

  // Check for at least basic required fields
  return !!(
    extractedContent.shipper ||
    extractedContent.consignee ||
    extractedContent.unIdNo ||
    extractedContent.properShippingName
  );
};

/**
 * Get a default/empty data structure for fallback scenarios
 */
export const getDefaultInspectorData =
  (): InspectorShippersDeclarationProps["extractedData"] => {
    return {
      shipper: "",
      consignee: "",
      airwayBill: "",
      pagination: "",
      shippersReferenceNumber: "",
      inspectionActivity: "",
      aircraftType: "PASSENGER AND CARGO AIRCRAFT",
      airportOfDeparture: "",
      airportOfDestination: "",
      shipmentType: "NON-RADIOACTIVE",
      hazardousMaterials: [
        {
          airWaybillNumber: "",
          unIdNo: "",
          properShippingName: "",
          hazardClass: "",
          subsidiaryRisk: "",
          packingGroup: "",
          quantityAndPacking: "",
          packingInstruction: "",
          authorization: "",
        },
      ],
      additionalHandlingInfo: "",
      emergencyTelephoneNumber: "",
      nameOfSignatory: "",
      placeAndDate: "",
      signature: "",
    };
  };

/**
 * Safe transformation with fallback handling
 */
export const safeTransformExtractedContent = (
  extractedContent: ExtractedSDDGContent | null
): InspectorShippersDeclarationProps["extractedData"] => {
  try {
    const transformed =
      transformExtractedContentToInspectorProps(extractedContent);
    return transformed || getDefaultInspectorData();
  } catch (error) {
    console.warn("Error transforming extracted content:", error);
    return getDefaultInspectorData();
  }
};
