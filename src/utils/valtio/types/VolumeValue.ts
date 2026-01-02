import { ValtioFloatHazProVolumeValueRecord, ValtioLifeCycleVolumeValueEvent } from ".";
import { store } from "./../__generated__/store";
import { proxy } from "valtio";
import { YDocVolumeValue } from "./../../yjs";
import { buildFloatHazProVolumeValueRecord } from "./FloatHazProVolumeValueRecord";

export interface ValtioVolumeValue {
    uuid: string;
    /** Volume in liters */
    litersRecord: ValtioFloatHazProVolumeValueRecord;
    /** Volume in gallons */
    gallonsRecord: ValtioFloatHazProVolumeValueRecord;
    /** Lifecycle events tracking creation and archival */
    lifeCycleEvents: ValtioLifeCycleVolumeValueEvent[];
    __typename: string;
    path: string;
    _version: number;
    update: <K extends FieldName>(field: K, value: VolumeValueFieldPayloadMap[K]) => Promise<string>;
}

export function buildLifeCycleVolumeValueEvents(events: any[]): ValtioLifeCycleVolumeValueEvent[] {
    return events.map((event) => {
        return {
            uuid: event.uuid,
            volumeValue__REF: event.volumeValue__REF,
            type: event.type,
            value: event.value === '' ? undefined : new Date(event.value),
            createdAt: new Date(event.createdAt),
            __typename: 'LifeCycleVolumeValueEvent',
        }
    });
}

export async function upsertVolumeValueValtioEntity(ydoc: YDocVolumeValue) {
    if (!store.VolumeValueMap[ydoc.uuid]) {
        store.VolumeValueMap[ydoc.uuid] = proxy({} as ValtioVolumeValue)
    }

    const volumeValue = store.VolumeValueMap[ydoc.uuid]
    if (!volumeValue) {
        throw new Error('VolumeValue does not exist')
    }

    volumeValue.__typename = 'VolumeValue';
    volumeValue.path = ydoc.path;
    volumeValue._version = 0;
    volumeValue.uuid = ydoc.uuid;
    volumeValue.litersRecord = buildFloatHazProVolumeValueRecord(ydoc.litersRecord);
    volumeValue.gallonsRecord = buildFloatHazProVolumeValueRecord(ydoc.gallonsRecord);
    volumeValue.lifeCycleEvents = buildLifeCycleVolumeValueEvents(ydoc.lifeCycleEvents);
}
