import { ValtioStringHazProQuantityValueRecord, ValtioLifeCycleQuantityValueEvent } from ".";
import { store } from "./../__generated__/store";
import { proxy } from "valtio";
import { YDocQuantityValue } from "./../../yjs";
import { buildStringHazProQuantityValueRecord } from "./StringHazProQuantityValueRecord";

export interface ValtioQuantityValue {
    uuid: string;
    /** Quantity in pounds */
    lbsRecord: ValtioStringHazProQuantityValueRecord;
    /** Quantity in kilograms */
    kgsRecord: ValtioStringHazProQuantityValueRecord;
    /** Lifecycle events tracking creation and archival */
    lifeCycleEvents: ValtioLifeCycleQuantityValueEvent[];
    __typename: string;
    path: string;
    _version: number;
    update: <K extends FieldName>(field: K, value: QuantityValueFieldPayloadMap[K]) => Promise<string>;
}

export function buildLifeCycleQuantityValueEvents(events: any[]): ValtioLifeCycleQuantityValueEvent[] {
    return events.map((event) => {
        return {
            uuid: event.uuid,
            quantityValue__REF: event.quantityValue__REF,
            type: event.type,
            value: event.value === '' ? undefined : new Date(event.value),
            createdAt: new Date(event.createdAt),
            __typename: 'LifeCycleQuantityValueEvent',
        }
    });
}

export async function upsertQuantityValueValtioEntity(ydoc: YDocQuantityValue) {
    if (!store.QuantityValueMap[ydoc.uuid]) {
        store.QuantityValueMap[ydoc.uuid] = proxy({} as ValtioQuantityValue)
    }

    const quantityValue = store.QuantityValueMap[ydoc.uuid]
    if (!quantityValue) {
        throw new Error('QuantityValue does not exist')
    }

    quantityValue.__typename = 'QuantityValue';
    quantityValue.path = ydoc.path;
    quantityValue._version = 0;
    quantityValue.uuid = ydoc.uuid;
    quantityValue.lbsRecord = buildStringHazProQuantityValueRecord(ydoc.lbsRecord);
    quantityValue.kgsRecord = buildStringHazProQuantityValueRecord(ydoc.kgsRecord);
    quantityValue.lifeCycleEvents = buildLifeCycleQuantityValueEvents(ydoc.lifeCycleEvents);
}
