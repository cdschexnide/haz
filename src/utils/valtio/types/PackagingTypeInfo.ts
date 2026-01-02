import { ValtioStringHazProPackagingTypeInfoRecord, ValtioLifeCyclePackagingTypeInfoEvent } from ".";
import { store } from "./../__generated__/store";
import { proxy } from "valtio";
import { YDocPackagingTypeInfo } from "./../../yjs";
import { buildStringHazProPackagingTypeInfoRecord } from "./StringHazProPackagingTypeInfoRecord";

export interface ValtioPackagingTypeInfo {
    uuid: string;
    /** Packaging code */
    codeRecord: ValtioStringHazProPackagingTypeInfoRecord;
    /** Packaging type description */
    packagingTypeRecord: ValtioStringHazProPackagingTypeInfoRecord;
    /** Lifecycle events tracking creation and archival */
    lifeCycleEvents: ValtioLifeCyclePackagingTypeInfoEvent[];
    __typename: string;
    path: string;
    _version: number;
    update: <K extends FieldName>(field: K, value: PackagingTypeInfoFieldPayloadMap[K]) => Promise<string>;
}

export function buildLifeCyclePackagingTypeInfoEvents(events: any[]): ValtioLifeCyclePackagingTypeInfoEvent[] {
    return events.map((event) => {
        return {
            uuid: event.uuid,
            packagingTypeInfo__REF: event.packagingTypeInfo__REF,
            type: event.type,
            value: event.value === '' ? undefined : new Date(event.value),
            createdAt: new Date(event.createdAt),
            __typename: 'LifeCyclePackagingTypeInfoEvent',
        }
    });
}

export async function upsertPackagingTypeInfoValtioEntity(ydoc: YDocPackagingTypeInfo) {
    if (!store.PackagingTypeInfoMap[ydoc.uuid]) {
        store.PackagingTypeInfoMap[ydoc.uuid] = proxy({} as ValtioPackagingTypeInfo)
    }

    const packagingTypeInfo = store.PackagingTypeInfoMap[ydoc.uuid]
    if (!packagingTypeInfo) {
        throw new Error('PackagingTypeInfo does not exist')
    }

    packagingTypeInfo.__typename = 'PackagingTypeInfo';
    packagingTypeInfo.path = ydoc.path;
    packagingTypeInfo._version = 0;
    packagingTypeInfo.uuid = ydoc.uuid;
    packagingTypeInfo.codeRecord = buildStringHazProPackagingTypeInfoRecord(ydoc.codeRecord);
    packagingTypeInfo.packagingTypeRecord = buildStringHazProPackagingTypeInfoRecord(ydoc.packagingTypeRecord);
    packagingTypeInfo.lifeCycleEvents = buildLifeCyclePackagingTypeInfoEvents(ydoc.lifeCycleEvents);
}
