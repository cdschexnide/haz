import { ValtioFloatHazProMassValueRecord, ValtioLifeCycleMassValueEvent } from ".";
import { store } from "./../__generated__/store";
import { proxy } from "valtio";
import { YDocMassValue } from "./../../yjs";
import { buildFloatHazProMassValueRecord } from "./FloatHazProMassValueRecord";

export interface ValtioMassValue {
    uuid: string;
    /** Mass in pounds */
    lbsRecord: ValtioFloatHazProMassValueRecord;
    /** Mass in kilograms */
    kgRecord: ValtioFloatHazProMassValueRecord;
    /** Lifecycle events tracking creation and archival */
    lifeCycleEvents: ValtioLifeCycleMassValueEvent[];
    __typename: string;
    path: string;
    _version: number;
    update: <K extends FieldName>(field: K, value: MassValueFieldPayloadMap[K]) => Promise<string>;
}

export function buildLifeCycleMassValueEvents(events: any[]): ValtioLifeCycleMassValueEvent[] {
    return events.map((event) => {
        return {
            uuid: event.uuid,
            massValue__REF: event.massValue__REF,
            type: event.type,
            value: event.value === '' ? undefined : new Date(event.value),
            createdAt: new Date(event.createdAt),
            __typename: 'LifeCycleMassValueEvent',
        }
    });
}

export async function upsertMassValueValtioEntity(ydoc: YDocMassValue) {
    if (!store.MassValueMap[ydoc.uuid]) {
        store.MassValueMap[ydoc.uuid] = proxy({} as ValtioMassValue)
    }

    const massValue = store.MassValueMap[ydoc.uuid]
    if (!massValue) {
        throw new Error('MassValue does not exist')
    }

    massValue.__typename = 'MassValue';
    massValue.path = ydoc.path;
    massValue._version = 0;
    massValue.uuid = ydoc.uuid;
    massValue.lbsRecord = buildFloatHazProMassValueRecord(ydoc.lbsRecord);
    massValue.kgRecord = buildFloatHazProMassValueRecord(ydoc.kgRecord);
    massValue.lifeCycleEvents = buildLifeCycleMassValueEvents(ydoc.lifeCycleEvents);
}
