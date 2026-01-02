import { ValtioStringHazProConsigneeAddressRecord, ValtioLifeCycleConsigneeAddressEvent } from ".";
import { store } from "./../__generated__/store";
import { proxy } from "valtio";
import { YDocConsigneeAddress } from "./../../yjs";
import { buildStringHazProConsigneeAddressRecord } from "./StringHazProConsigneeAddressRecord";

export interface ValtioConsigneeAddress {
    uuid: string;
    /** Consignee name */
    nameRecord: ValtioStringHazProConsigneeAddressRecord;
    /** Street address */
    streetRecord: ValtioStringHazProConsigneeAddressRecord;
    /** City */
    cityRecord: ValtioStringHazProConsigneeAddressRecord;
    /** State or province */
    stateRecord: ValtioStringHazProConsigneeAddressRecord;
    /** Postal code */
    zipRecord: ValtioStringHazProConsigneeAddressRecord;
    /** Country */
    countryRecord: ValtioStringHazProConsigneeAddressRecord;
    /** Lifecycle events tracking creation and archival */
    lifeCycleEvents: ValtioLifeCycleConsigneeAddressEvent[];
    __typename: string;
    path: string;
    _version: number;
    update: <K extends FieldName>(field: K, value: ConsigneeAddressFieldPayloadMap[K]) => Promise<string>;
}

export function buildLifeCycleConsigneeAddressEvents(events: any[]): ValtioLifeCycleConsigneeAddressEvent[] {
    return events.map((event) => {
        return {
            uuid: event.uuid,
            consigneeAddress__REF: event.consigneeAddress__REF,
            type: event.type,
            value: event.value === '' ? undefined : new Date(event.value),
            createdAt: new Date(event.createdAt),
            __typename: 'LifeCycleConsigneeAddressEvent',
        }
    });
}

export async function upsertConsigneeAddressValtioEntity(ydoc: YDocConsigneeAddress) {
    if (!store.ConsigneeAddressMap[ydoc.uuid]) {
        store.ConsigneeAddressMap[ydoc.uuid] = proxy({} as ValtioConsigneeAddress)
    }

    const consigneeAddress = store.ConsigneeAddressMap[ydoc.uuid]
    if (!consigneeAddress) {
        throw new Error('ConsigneeAddress does not exist')
    }

    consigneeAddress.__typename = 'ConsigneeAddress';
    consigneeAddress.path = ydoc.path;
    consigneeAddress._version = 0;
    consigneeAddress.uuid = ydoc.uuid;
    consigneeAddress.nameRecord = buildStringHazProConsigneeAddressRecord(ydoc.nameRecord);
    consigneeAddress.streetRecord = buildStringHazProConsigneeAddressRecord(ydoc.streetRecord);
    consigneeAddress.cityRecord = buildStringHazProConsigneeAddressRecord(ydoc.cityRecord);
    consigneeAddress.stateRecord = buildStringHazProConsigneeAddressRecord(ydoc.stateRecord);
    consigneeAddress.zipRecord = buildStringHazProConsigneeAddressRecord(ydoc.zipRecord);
    consigneeAddress.countryRecord = buildStringHazProConsigneeAddressRecord(ydoc.countryRecord);
    consigneeAddress.lifeCycleEvents = buildLifeCycleConsigneeAddressEvents(ydoc.lifeCycleEvents);
}
