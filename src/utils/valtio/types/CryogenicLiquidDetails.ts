import { ValtioStringHazProCryogenicLiquidDetailsRecord, ValtioLifeCycleCryogenicLiquidDetailsEvent } from ".";
import { store } from "./../__generated__/store";
import { proxy } from "valtio";
import { YDocCryogenicLiquidDetails } from "./../../yjs";
import { buildStringHazProCryogenicLiquidDetailsRecord } from "./StringHazProCryogenicLiquidDetailsRecord";

export interface ValtioCryogenicLiquidDetails {
    uuid: string;
    /** Vent rate in standard cubic feet per hour */
    ventRateInSCFHRecord: ValtioStringHazProCryogenicLiquidDetailsRecord;
    /** Lifecycle events tracking creation and archival */
    lifeCycleEvents: ValtioLifeCycleCryogenicLiquidDetailsEvent[];
    __typename: string;
    path: string;
    _version: number;
    update: <K extends FieldName>(field: K, value: CryogenicLiquidDetailsFieldPayloadMap[K]) => Promise<string>;
}

export function buildLifeCycleCryogenicLiquidDetailsEvents(events: any[]): ValtioLifeCycleCryogenicLiquidDetailsEvent[] {
    return events.map((event) => {
        return {
            uuid: event.uuid,
            cryogenicLiquidDetails__REF: event.cryogenicLiquidDetails__REF,
            type: event.type,
            value: event.value === '' ? undefined : new Date(event.value),
            createdAt: new Date(event.createdAt),
            __typename: 'LifeCycleCryogenicLiquidDetailsEvent',
        }
    });
}

export async function upsertCryogenicLiquidDetailsValtioEntity(ydoc: YDocCryogenicLiquidDetails) {
    if (!store.CryogenicLiquidDetailsMap[ydoc.uuid]) {
        store.CryogenicLiquidDetailsMap[ydoc.uuid] = proxy({} as ValtioCryogenicLiquidDetails)
    }

    const cryogenicLiquidDetails = store.CryogenicLiquidDetailsMap[ydoc.uuid]
    if (!cryogenicLiquidDetails) {
        throw new Error('CryogenicLiquidDetails does not exist')
    }

    cryogenicLiquidDetails.__typename = 'CryogenicLiquidDetails';
    cryogenicLiquidDetails.path = ydoc.path;
    cryogenicLiquidDetails._version = 0;
    cryogenicLiquidDetails.uuid = ydoc.uuid;
    cryogenicLiquidDetails.ventRateInSCFHRecord = buildStringHazProCryogenicLiquidDetailsRecord(ydoc.ventRateInSCFHRecord);
    cryogenicLiquidDetails.lifeCycleEvents = buildLifeCycleCryogenicLiquidDetailsEvents(ydoc.lifeCycleEvents);
}
