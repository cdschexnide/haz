import { ValtioStringHazProShipperAddressRecord, ValtioLifeCycleShipperAddressEvent } from ".";
import { store } from "./../__generated__/store";
import { proxy } from "valtio";
import { YDocShipperAddress } from "./../../yjs";
import { buildStringHazProShipperAddressRecord } from "./StringHazProShipperAddressRecord";

export interface ValtioShipperAddress {
    uuid: string;
    /** Shipper name */
    nameRecord: ValtioStringHazProShipperAddressRecord;
    /** Street address */
    streetRecord: ValtioStringHazProShipperAddressRecord;
    /** City */
    cityRecord: ValtioStringHazProShipperAddressRecord;
    /** State or province */
    stateRecord: ValtioStringHazProShipperAddressRecord;
    /** Postal code */
    zipRecord: ValtioStringHazProShipperAddressRecord;
    /** Country */
    countryRecord: ValtioStringHazProShipperAddressRecord;
    /** Lifecycle events tracking creation and archival */
    lifeCycleEvents: ValtioLifeCycleShipperAddressEvent[];
    __typename: string;
    path: string;
    _version: number;
    update: <K extends FieldName>(field: K, value: ShipperAddressFieldPayloadMap[K]) => Promise<string>;
}

export function buildLifeCycleShipperAddressEvents(events: any[]): ValtioLifeCycleShipperAddressEvent[] {
    return events.map((event) => {
        return {
            uuid: event.uuid,
            shipperAddress__REF: event.shipperAddress__REF,
            type: event.type,
            value: event.value === '' ? undefined : new Date(event.value),
            createdAt: new Date(event.createdAt),
            __typename: 'LifeCycleShipperAddressEvent',
        }
    });
}

export async function upsertShipperAddressValtioEntity(ydoc: YDocShipperAddress) {
    if (!store.ShipperAddressMap[ydoc.uuid]) {
        store.ShipperAddressMap[ydoc.uuid] = proxy({} as ValtioShipperAddress)
    }

    const shipperAddress = store.ShipperAddressMap[ydoc.uuid]
    if (!shipperAddress) {
        throw new Error('ShipperAddress does not exist')
    }

    shipperAddress.__typename = 'ShipperAddress';
    shipperAddress.path = ydoc.path;
    shipperAddress._version = 0;
    shipperAddress.uuid = ydoc.uuid;
    shipperAddress.nameRecord = buildStringHazProShipperAddressRecord(ydoc.nameRecord);
    shipperAddress.streetRecord = buildStringHazProShipperAddressRecord(ydoc.streetRecord);
    shipperAddress.cityRecord = buildStringHazProShipperAddressRecord(ydoc.cityRecord);
    shipperAddress.stateRecord = buildStringHazProShipperAddressRecord(ydoc.stateRecord);
    shipperAddress.zipRecord = buildStringHazProShipperAddressRecord(ydoc.zipRecord);
    shipperAddress.countryRecord = buildStringHazProShipperAddressRecord(ydoc.countryRecord);
    shipperAddress.lifeCycleEvents = buildLifeCycleShipperAddressEvents(ydoc.lifeCycleEvents);
}
