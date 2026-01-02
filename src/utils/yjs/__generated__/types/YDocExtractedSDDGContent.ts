import { Reference } from "./Reference";
import { YDocStringHazProExtractedSDDGContentRecord } from "./YDocStringHazProExtractedSDDGContentRecord";

export interface YDocLifeCycleExtractedSDDGContentEvent {
    uuid: string;
    extractedSDDGContent__REF: Reference<string>;
    type: string;
    value__REF?: Reference<string>;
    createdAt__REF: Reference<string>;
    __typename: string;
}

export interface YDocExtractedSDDGContent {
    uuid: string;
    shipperRecord: YDocStringHazProExtractedSDDGContentRecord;
    consigneeRecord: YDocStringHazProExtractedSDDGContentRecord;
    airWaybillNumberRecord: YDocStringHazProExtractedSDDGContentRecord;
    paginationRecord: YDocStringHazProExtractedSDDGContentRecord;
    shippersReferenceNumberRecord: YDocStringHazProExtractedSDDGContentRecord;
    inspectionActivityRecord: YDocStringHazProExtractedSDDGContentRecord;
    aircraftTypeRecord: YDocStringHazProExtractedSDDGContentRecord;
    airportOfDepartureRecord: YDocStringHazProExtractedSDDGContentRecord;
    airportOfDestinationRecord: YDocStringHazProExtractedSDDGContentRecord;
    shipmentTypeRecord: YDocStringHazProExtractedSDDGContentRecord;
    unIdNoRecord: YDocStringHazProExtractedSDDGContentRecord;
    properShippingNameRecord: YDocStringHazProExtractedSDDGContentRecord;
    hazardClassRecord: YDocStringHazProExtractedSDDGContentRecord;
    subsidiaryRiskRecord: YDocStringHazProExtractedSDDGContentRecord;
    packingGroupRecord: YDocStringHazProExtractedSDDGContentRecord;
    quantityAndPackingRecord: YDocStringHazProExtractedSDDGContentRecord;
    packingInstructionRecord: YDocStringHazProExtractedSDDGContentRecord;
    authorizationRecord: YDocStringHazProExtractedSDDGContentRecord;
    additionalHandlingInfoRecord: YDocStringHazProExtractedSDDGContentRecord;
    nameOfSignatoryRecord: YDocStringHazProExtractedSDDGContentRecord;
    placeAndDateRecord: YDocStringHazProExtractedSDDGContentRecord;
    signatureRecord: YDocStringHazProExtractedSDDGContentRecord;
    lifeCycleEvents: YDocLifeCycleExtractedSDDGContentEvent[];
    path: string;
    __typename: string;
}
