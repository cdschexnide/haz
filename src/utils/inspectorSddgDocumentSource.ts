import type { InspectorShippersDeclarationProps } from "@/components/Inspector/InspectorShippersDeclarationForm";
import type { ExtractedSDDGContent, InspectorShipment } from "@/types/sddg";

export type InspectorSddgDocumentSource = "image" | "digital" | "none";

export interface InspectorSddgDocumentAvailability {
  source: InspectorSddgDocumentSource;
  hasViewableDocument: boolean;
}

const DEFAULT_EMERGENCY_TELEPHONE = "1-800-851-8061 | 1-804-279-3131";

const hasText = (value: unknown): boolean =>
  typeof value === "string" && value.trim().length > 0;

export const getInspectionSddgContent = (
  inspection: InspectorShipment
): ExtractedSDDGContent | null => {
  const context = inspection.inspectionContext;
  if (!context) {
    return null;
  }

  return context.verificationCopy || context.extractedContent || null;
};

export const hasRenderableInspectionSddgContent = (
  inspection: InspectorShipment
): boolean => {
  const content = getInspectionSddgContent(inspection);
  if (!content) {
    return false;
  }

  return (
    hasText(content.shipper) ||
    hasText(content.consignee) ||
    hasText(content.unIdNo) ||
    hasText(content.properShippingName) ||
    hasText(content.shippersReferenceNumber)
  );
};

export const toInspectorSddgFormData = (
  content: ExtractedSDDGContent
): InspectorShippersDeclarationProps["extractedData"] => ({
  shipper: content.shipper || "",
  consignee: content.consignee || "",
  airwayBill: content.airWaybillNumber || "",
  pagination: content.pagination || "",
  shippersReferenceNumber: content.shippersReferenceNumber || "",
  inspectionActivity: content.inspectionActivity || "",
  aircraftType: content.aircraftType || "",
  airportOfDeparture: content.airportOfDeparture || "",
  airportOfDestination: content.airportOfDestination || "",
  shipmentType: content.shipmentType || "",
  hazardousMaterials: [
    {
      airWaybillNumber: content.airWaybillNumber || "",
      unIdNo: content.unIdNo || "",
      properShippingName: content.properShippingName || "",
      hazardClass: content.hazardClass || "",
      subsidiaryRisk: content.subsidiaryRisk || "",
      packingGroup: content.packingGroup || "",
      quantityAndPacking: content.quantityAndPacking || "",
      packingInstruction: content.packingInstruction || "",
      authorization: content.authorization || "",
    },
  ],
  additionalHandlingInfo: content.additionalHandlingInfo || "",
  emergencyTelephoneNumber: DEFAULT_EMERGENCY_TELEPHONE,
  nameOfSignatory: content.nameOfSignatory || "",
  placeAndDate: content.placeAndDate || "",
  signature: content.signature || "",
});

export const getInspectorSddgFormDataFromInspection = (
  inspection: InspectorShipment
): InspectorShippersDeclarationProps["extractedData"] | null => {
  const content = getInspectionSddgContent(inspection);
  if (!content || !hasRenderableInspectionSddgContent(inspection)) {
    return null;
  }

  return toInspectorSddgFormData(content);
};

export const resolveInspectorSddgDocumentAvailability = (
  inspection: InspectorShipment,
  imageUriOverride?: string | null
): InspectorSddgDocumentAvailability => {
  const imageUri =
    inspection.inspectionContext?.originalImageUri || imageUriOverride || null;
  if (hasText(imageUri)) {
    return { source: "image", hasViewableDocument: true };
  }

  if (hasRenderableInspectionSddgContent(inspection)) {
    return { source: "digital", hasViewableDocument: true };
  }

  return { source: "none", hasViewableDocument: false };
};
