import type { HazProPreparerContext } from "@/contexts/HazProPreparerProvider/reducer";
import type {
  ExtractedSDDGContent,
  InspectorCAADocument,
  InspectorCOEDocument,
  InspectorDotSpWaiver,
} from "@/types/sddg";
import { getSddgQuantityAndTypeOfPacking } from "@/utils/getSddgQuantityAndTypeOfPacking";
import type { SpecialAuthorizationType } from "@/utils/afmanPackagingParagraphs";

interface SpecialAuthorizationSeed {
  type: SpecialAuthorizationType | null;
  referenceNumber: string;
  attested: boolean;
}

interface AuthorizationDocumentSeed {
  coeDocuments: InspectorCOEDocument[];
  caaDocuments: InspectorCAADocument[];
  dotSpWaivers: InspectorDotSpWaiver[];
}

export interface PreparerShipmentInspectionSeed {
  extractedContent: ExtractedSDDGContent;
  specialAuthorization: SpecialAuthorizationSeed;
  authorizationDocuments: AuthorizationDocumentSeed;
}

const DEFAULT_PAGINATION = "PAGE 1 OF 1 PAGES";
const DEFAULT_AUTHORIZATION = "AFMAN24-604";

type LegacyPreparerFieldShape = {
  preparerName?: string | null;
  preparerTitle?: string | null;
  certificationPlace?: string | null;
  certificationDate?: string | Date | null;
  nameOfSignatory?: string | null;
  placeAndDate?: string | null;
  shipment?: {
    signatory?: string | null;
  };
};

const clean = (value?: unknown) => {
  if (typeof value === "string") {
    return value.trim();
  }
  if (value === null || value === undefined) {
    return "";
  }
  return String(value).trim();
};

const normalizeDate = (value?: unknown) => {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().split("T")[0];
  }
  return clean(value);
};

const asLegacyShape = (context: HazProPreparerContext) =>
  context as HazProPreparerContext & LegacyPreparerFieldShape;

const isCargoAircraftOnly = (
  context: HazProPreparerContext
): boolean => /\bP[1-4]\b/i.test(context.hazardousMaterial?.specialProvision || "");

const joinLines = (lines: Array<string | undefined | null>) =>
  lines
    .map(line => clean(line))
    .filter(Boolean)
    .join("\n");

const formatCityStateZip = (
  city?: string | null,
  state?: string | null,
  zip?: string | null
) => {
  const cityPart = clean(city);
  const statePart = clean(state);
  const zipPart = clean(zip);
  const cityState = [cityPart, statePart].filter(Boolean).join(", ");
  return [cityState, zipPart].filter(Boolean).join(" ");
};

const mapShipper = (context: HazProPreparerContext) => {
  const shipper = context.shipper;
  if (!shipper?.address) return "";

  const addressLine = formatCityStateZip(
    shipper.address.shipperCity,
    shipper.address.shipperState,
    shipper.address.shipperZipcode
  );

  const phone = clean(shipper.phoneNumber?.number);
  const dsn = clean(shipper.phoneNumber?.dsnNumber);

  return joinLines([
    shipper.address.shipperLocation || shipper.name,
    shipper.address.shipperStreet,
    addressLine,
    shipper.address.selectedShipperCountry,
    phone ? `PHONE NUMBER: ${phone}` : "",
    dsn ? `DSN: ${dsn}` : "",
  ]);
};

const mapConsignee = (context: HazProPreparerContext) => {
  const consignee = context.consignee;
  if (!consignee?.address) return "";

  const cityStateZip = formatCityStateZip(
    consignee.address.consigneeCity,
    consignee.address.consigneeState,
    consignee.address.consigneeZipcode
  );

  return joinLines([
    consignee.address.consigneeDodaac,
    consignee.address.consigneeStreet,
    cityStateZip,
    consignee.address.selectedConsigneeCountry,
  ]);
};

const mapSpecialAuthorizationType = (
  context: HazProPreparerContext
): SpecialAuthorizationType | null => {
  if (context.specialAuthorizationAttested && context.specialAuthorizationType) {
    return context.specialAuthorizationType;
  }

  if (context.usesDotSpPermit) {
    return "DOT-SP";
  }
  if (context.usesCoeCertification) {
    return "COE";
  }
  if (context.usesCaaCertification) {
    return "CAA";
  }

  return null;
};

const mapSpecialAuthorizationReference = (
  context: HazProPreparerContext,
  type: SpecialAuthorizationType | null
) => {
  const explicitReference = clean(context.specialAuthorizationReference);
  if (explicitReference) return explicitReference;

  if (type === "COE") {
    const docs = context.coeAndCaaDocuments?.coeDocuments || [];
    return clean(docs[docs.length - 1]?.name);
  }

  if (type === "CAA") {
    const docs = context.coeAndCaaDocuments?.caaDocuments || [];
    return clean(docs[docs.length - 1]?.name);
  }

  if (type === "DOT-SP") {
    const waivers = context.dotSpWaivers || [];
    return clean(waivers[waivers.length - 1]?.waiverNumber);
  }

  return "";
};

const mapSpecialAuthorization = (
  context: HazProPreparerContext
): SpecialAuthorizationSeed => {
  const type = mapSpecialAuthorizationType(context);
  const referenceNumber = mapSpecialAuthorizationReference(context, type);
  const hasCertificationFlags =
    context.usesCoeCertification ||
    context.usesCaaCertification ||
    context.usesDotSpPermit;

  return {
    type,
    referenceNumber,
    attested:
      type !== null &&
      (context.specialAuthorizationAttested || hasCertificationFlags),
  };
};

const mapAuthorizationDocuments = (
  context: HazProPreparerContext
): AuthorizationDocumentSeed => ({
  coeDocuments: (context.coeAndCaaDocuments?.coeDocuments || []).map(doc => ({
    id: doc.id,
    documentType: "COE",
    uri: doc.uri,
    base64Data: doc.base64Data,
    name: doc.name,
    agency: doc.agency,
    dateAdded: doc.dateAdded,
  })),
  caaDocuments: (context.coeAndCaaDocuments?.caaDocuments || []).map(doc => ({
    id: doc.id,
    documentType: "CAA",
    uri: doc.uri,
    base64Data: doc.base64Data,
    name: doc.name,
    agency: doc.agency,
    dateAdded: doc.dateAdded,
  })),
  dotSpWaivers: (context.dotSpWaivers || []).map(doc => ({
    id: doc.id,
    uri: doc.uri,
    base64Data: doc.base64Data,
    waiverNumber: doc.waiverNumber,
    description: doc.description,
    agency: doc.agency,
    dateAdded: doc.dateAdded,
  })),
});

const mapAdditionalHandlingInfo = (context: HazProPreparerContext) =>
  (context.additionalHandlingInfo?.notes || [])
    .map(note => clean(note))
    .filter(Boolean)
    .join("\n");

const mapSignatory = (context: HazProPreparerContext) => {
  const source = asLegacyShape(context);
  const preparerName = clean(
    source.preparer?.preparerName ?? source.preparerName
  );
  const preparerTitle = clean(
    source.preparer?.preparerTitle ?? source.preparerTitle
  );
  const mapped = [preparerName, preparerTitle].filter(Boolean).join(" ");

  if (mapped) return mapped;

  return clean(source.nameOfSignatory ?? source.shipment?.signatory);
};

const mapPlaceAndDate = (context: HazProPreparerContext) =>
  (() => {
    const source = asLegacyShape(context);
    const certificationPlace = clean(
      source.preparer?.certificationPlace ?? source.certificationPlace
    );
    const certificationDate = normalizeDate(
      source.preparer?.certificationDate ?? source.certificationDate
    );

    const mapped = [certificationPlace, certificationDate]
      .filter(Boolean)
      .join(" ");

    if (mapped) return mapped;

    return clean(source.placeAndDate);
  })();

const mapExtractedContent = (
  context: HazProPreparerContext,
  specialAuthorization: SpecialAuthorizationSeed
): ExtractedSDDGContent => {
  const hazardClass = clean(context.hazardousMaterial?.hazclassDiv);
  const isRadioactive = hazardClass.startsWith("7");
  const packingInstructionFromContext =
    clean(context.packingInstruction) ||
    clean(context.hazardousMaterial?.packagingParagraph);
  const packingInstruction =
    specialAuthorization.type && specialAuthorization.referenceNumber
      ? specialAuthorization.referenceNumber
      : packingInstructionFromContext;

  return {
    shipper: mapShipper(context),
    consignee: mapConsignee(context),
    airWaybillNumber: "",
    pagination: DEFAULT_PAGINATION,
    shippersReferenceNumber: clean(context.shipment?.tcn),
    inspectionActivity: clean(context.shipment?.inspector),
    aircraftType: isCargoAircraftOnly(context)
      ? "Cargo Aircraft Only"
      : "Passenger and Cargo Aircraft",
    airportOfDeparture: clean(context.shipment?.poe),
    airportOfDestination: clean(context.shipment?.pod),
    shipmentType: isRadioactive ? "Radioactive" : "Non-Radioactive",
    unIdNo: clean(context.hazardousMaterial?.unid).toUpperCase(),
    properShippingName: clean(context.hazardousMaterial?.properShippingName).toUpperCase(),
    hazardClass,
    subsidiaryRisk: clean(context.hazardousMaterial?.subsidiaryRisk),
    packingGroup: clean(context.hazardousMaterial?.packingGroup),
    quantityAndPacking: getSddgQuantityAndTypeOfPacking(context),
    packingInstruction,
    authorization: specialAuthorization.type || DEFAULT_AUTHORIZATION,
    additionalHandlingInfo: mapAdditionalHandlingInfo(context),
    nameOfSignatory: mapSignatory(context),
    placeAndDate: mapPlaceAndDate(context),
    signature: "",
  };
};

export const mapPreparerShipmentToInspectionSeed = (
  context: HazProPreparerContext
): PreparerShipmentInspectionSeed => {
  const specialAuthorization = mapSpecialAuthorization(context);
  const authorizationDocuments = mapAuthorizationDocuments(context);

  return {
    extractedContent: mapExtractedContent(context, specialAuthorization),
    specialAuthorization,
    authorizationDocuments,
  };
};
