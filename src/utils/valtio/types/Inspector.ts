import { ValtioStringHazProInspectorRecord, ValtioLifeCycleInspectorEvent } from ".";
import { store } from "./../__generated__/store";
import { proxy } from "valtio";
import { YDocInspector } from "./../../yjs";
import { buildStringHazProInspectorRecord } from "./StringHazProInspectorRecord";

export interface ValtioInspector {
    uuid: string;
    /** Inspector name */
    inspectorNameRecord: ValtioStringHazProInspectorRecord;
    /** Inspector rank (optional) */
    inspectorRankRecord?: ValtioStringHazProInspectorRecord;
    /** Inspector title */
    inspectorTitleRecord: ValtioStringHazProInspectorRecord;
    /** Lifecycle events tracking creation and archival */
    lifeCycleEvents: ValtioLifeCycleInspectorEvent[];
    __typename: string;
    path: string;
    _version: number;
    update: <K extends FieldName>(field: K, value: InspectorFieldPayloadMap[K]) => Promise<string>;
}

export function buildLifeCycleInspectorEvents(events: any[]): ValtioLifeCycleInspectorEvent[] {
    return events.map((event) => {
        return {
            uuid: event.uuid,
            inspector__REF: event.inspector__REF,
            type: event.type,
            value: event.value === '' ? undefined : new Date(event.value),
            createdAt: new Date(event.createdAt),
            __typename: 'LifeCycleInspectorEvent',
        }
    });
}

export async function upsertInspectorValtioEntity(ydoc: YDocInspector) {
    if (!store.InspectorMap[ydoc.uuid]) {
        store.InspectorMap[ydoc.uuid] = proxy({} as ValtioInspector)
    }

    const inspector = store.InspectorMap[ydoc.uuid]
    if (!inspector) {
        throw new Error('Inspector does not exist')
    }

    inspector.__typename = 'Inspector';
    inspector.path = ydoc.path;
    inspector._version = 0;
    inspector.uuid = ydoc.uuid;
    inspector.inspectorNameRecord = buildStringHazProInspectorRecord(ydoc.inspectorNameRecord);
    inspector.inspectorRankRecord = buildStringHazProInspectorRecord(ydoc.inspectorRankRecord);
    inspector.inspectorTitleRecord = buildStringHazProInspectorRecord(ydoc.inspectorTitleRecord);
    inspector.lifeCycleEvents = buildLifeCycleInspectorEvents(ydoc.lifeCycleEvents);
}
