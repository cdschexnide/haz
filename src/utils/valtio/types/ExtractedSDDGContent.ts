import { ValtioStringHazProExtractedSDDGContentRecord, ValtioLifeCycleExtractedSDDGContentEvent } from ".";
import { store } from "./../__generated__/store";
import { proxy } from "valtio";
import { YDocExtractedSDDGContent } from "./../../yjs";
import { buildStringHazProExtractedSDDGContentRecord } from "./StringHazProExtractedSDDGContentRecord";

export interface ValtioExtractedSDDGContent {
    uuid: string;
    /** Shipper name and address (Key 1) */
    shipperRecord: ValtioStringHazProExtractedSDDGContentRecord;
    /** Consignee name and address (Key 2) */
    consigneeRecord: ValtioStringHazProExtractedSDDGContentRecord;
    /** Air waybill number (Key 3) */
    airWaybillNumberRecord: ValtioStringHazProExtractedSDDGContentRecord;
    /** Page number / total pages (Key 4) */
    paginationRecord: ValtioStringHazProExtractedSDDGContentRecord;
    /** Transportation Control Number (TCN) (Key 5) */
    shippersReferenceNumberRecord: ValtioStringHazProExtractedSDDGContentRecord;
    /** Inspection activity location (Key 6) */
    inspectionActivityRecord: ValtioStringHazProExtractedSDDGContentRecord;
    /** Aircraft type restrictions (Key 7) */
    aircraftTypeRecord: ValtioStringHazProExtractedSDDGContentRecord;
    /** Airport of departure code (Key 8) */
    airportOfDepartureRecord: ValtioStringHazProExtractedSDDGContentRecord;
    /** Airport of destination code (Key 9) */
    airportOfDestinationRecord: ValtioStringHazProExtractedSDDGContentRecord;
    /** Type of shipment (Key 10) */
    shipmentTypeRecord: ValtioStringHazProExtractedSDDGContentRecord;
    /** UN/NA/ID identification number (Key 11) */
    unIdNoRecord: ValtioStringHazProExtractedSDDGContentRecord;
    /** Proper shipping name (Key 12) */
    properShippingNameRecord: ValtioStringHazProExtractedSDDGContentRecord;
    /** Hazard class or division (Key 13) */
    hazardClassRecord: ValtioStringHazProExtractedSDDGContentRecord;
    /** Subsidiary risk class (Key 14) */
    subsidiaryRiskRecord: ValtioStringHazProExtractedSDDGContentRecord;
    /** Packing group (Key 15) */
    packingGroupRecord: ValtioStringHazProExtractedSDDGContentRecord;
    /** Quantity and type of packing (Key 16) */
    quantityAndPackingRecord: ValtioStringHazProExtractedSDDGContentRecord;
    /** Packing instruction number (Key 17) */
    packingInstructionRecord: ValtioStringHazProExtractedSDDGContentRecord;
    /** Authorization reference (Key 18) */
    authorizationRecord: ValtioStringHazProExtractedSDDGContentRecord;
    /** Additional handling information (Key 19) */
    additionalHandlingInfoRecord: ValtioStringHazProExtractedSDDGContentRecord;
    /** Name and title of signatory (Key 20) */
    nameOfSignatoryRecord: ValtioStringHazProExtractedSDDGContentRecord;
    /** Place and date of signature (Key 21) */
    placeAndDateRecord: ValtioStringHazProExtractedSDDGContentRecord;
    /** Signature (Key 22) */
    signatureRecord: ValtioStringHazProExtractedSDDGContentRecord;
    /** Lifecycle events tracking creation and archival */
    lifeCycleEvents: ValtioLifeCycleExtractedSDDGContentEvent[];
    __typename: string;
    path: string;
    _version: number;
    update: <K extends FieldName>(field: K, value: ExtractedSDDGContentFieldPayloadMap[K]) => Promise<string>;
}

export function buildLifeCycleExtractedSDDGContentEvents(events: any[]): ValtioLifeCycleExtractedSDDGContentEvent[] {
    return events.map((event) => {
        return {
            uuid: event.uuid,
            extractedSDDGContent__REF: event.extractedSDDGContent__REF,
            type: event.type,
            value: event.value === '' ? undefined : new Date(event.value),
            createdAt: new Date(event.createdAt),
            __typename: 'LifeCycleExtractedSDDGContentEvent',
        }
    });
}

export async function upsertExtractedSDDGContentValtioEntity(ydoc: YDocExtractedSDDGContent) {
    if (!store.ExtractedSDDGContentMap[ydoc.uuid]) {
        store.ExtractedSDDGContentMap[ydoc.uuid] = proxy({} as ValtioExtractedSDDGContent)
    }

    const extractedSDDGContent = store.ExtractedSDDGContentMap[ydoc.uuid]
    if (!extractedSDDGContent) {
        throw new Error('ExtractedSDDGContent does not exist')
    }

    extractedSDDGContent.__typename = 'ExtractedSDDGContent';
    extractedSDDGContent.path = ydoc.path;
    extractedSDDGContent._version = 0;
    extractedSDDGContent.uuid = ydoc.uuid;
    extractedSDDGContent.shipperRecord = buildStringHazProExtractedSDDGContentRecord(ydoc.shipperRecord);
    extractedSDDGContent.consigneeRecord = buildStringHazProExtractedSDDGContentRecord(ydoc.consigneeRecord);
    extractedSDDGContent.airWaybillNumberRecord = buildStringHazProExtractedSDDGContentRecord(ydoc.airWaybillNumberRecord);
    extractedSDDGContent.paginationRecord = buildStringHazProExtractedSDDGContentRecord(ydoc.paginationRecord);
    extractedSDDGContent.shippersReferenceNumberRecord = buildStringHazProExtractedSDDGContentRecord(ydoc.shippersReferenceNumberRecord);
    extractedSDDGContent.inspectionActivityRecord = buildStringHazProExtractedSDDGContentRecord(ydoc.inspectionActivityRecord);
    extractedSDDGContent.aircraftTypeRecord = buildStringHazProExtractedSDDGContentRecord(ydoc.aircraftTypeRecord);
    extractedSDDGContent.airportOfDepartureRecord = buildStringHazProExtractedSDDGContentRecord(ydoc.airportOfDepartureRecord);
    extractedSDDGContent.airportOfDestinationRecord = buildStringHazProExtractedSDDGContentRecord(ydoc.airportOfDestinationRecord);
    extractedSDDGContent.shipmentTypeRecord = buildStringHazProExtractedSDDGContentRecord(ydoc.shipmentTypeRecord);
    extractedSDDGContent.unIdNoRecord = buildStringHazProExtractedSDDGContentRecord(ydoc.unIdNoRecord);
    extractedSDDGContent.properShippingNameRecord = buildStringHazProExtractedSDDGContentRecord(ydoc.properShippingNameRecord);
    extractedSDDGContent.hazardClassRecord = buildStringHazProExtractedSDDGContentRecord(ydoc.hazardClassRecord);
    extractedSDDGContent.subsidiaryRiskRecord = buildStringHazProExtractedSDDGContentRecord(ydoc.subsidiaryRiskRecord);
    extractedSDDGContent.packingGroupRecord = buildStringHazProExtractedSDDGContentRecord(ydoc.packingGroupRecord);
    extractedSDDGContent.quantityAndPackingRecord = buildStringHazProExtractedSDDGContentRecord(ydoc.quantityAndPackingRecord);
    extractedSDDGContent.packingInstructionRecord = buildStringHazProExtractedSDDGContentRecord(ydoc.packingInstructionRecord);
    extractedSDDGContent.authorizationRecord = buildStringHazProExtractedSDDGContentRecord(ydoc.authorizationRecord);
    extractedSDDGContent.additionalHandlingInfoRecord = buildStringHazProExtractedSDDGContentRecord(ydoc.additionalHandlingInfoRecord);
    extractedSDDGContent.nameOfSignatoryRecord = buildStringHazProExtractedSDDGContentRecord(ydoc.nameOfSignatoryRecord);
    extractedSDDGContent.placeAndDateRecord = buildStringHazProExtractedSDDGContentRecord(ydoc.placeAndDateRecord);
    extractedSDDGContent.signatureRecord = buildStringHazProExtractedSDDGContentRecord(ydoc.signatureRecord);
    extractedSDDGContent.lifeCycleEvents = buildLifeCycleExtractedSDDGContentEvents(ydoc.lifeCycleEvents);
}
