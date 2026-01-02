import { ValtioStringHazProInnerPackagingInspectionItemRecord, ValtioInnerPackagingInspectionItemStatusHazProInnerPackagingInspectionItemRecord, ValtioLifeCycleInnerPackagingInspectionItemEvent } from ".";
import { store } from "./../__generated__/store";
import { proxy } from "valtio";
import { YDocInnerPackagingInspectionItem } from "./../../yjs";
import { buildStringHazProInnerPackagingInspectionItemRecord } from "./StringHazProInnerPackagingInspectionItemRecord";
import { buildInnerPackagingInspectionItemStatusHazProInnerPackagingInspectionItemRecord } from "./InnerPackagingInspectionItemStatusHazProInnerPackagingInspectionItemRecord";

export interface ValtioInnerPackagingInspectionItem {
    uuid: string;
    /** Unique identifier for the inspection item */
    idRecord: ValtioStringHazProInnerPackagingInspectionItemRecord;
    /** Human-readable label for display */
    labelRecord: ValtioStringHazProInnerPackagingInspectionItemRecord;
    /** Inspection status */
    statusRecord: ValtioInnerPackagingInspectionItemStatusHazProInnerPackagingInspectionItemRecord;
    /** Optional inspector notes for this specific item */
    notesRecord?: ValtioStringHazProInnerPackagingInspectionItemRecord;
    /** AFMAN reference for this inspection requirement */
    afmanReferenceRecord: ValtioStringHazProInnerPackagingInspectionItemRecord;
    /** Lifecycle events tracking creation and archival */
    lifeCycleEvents: ValtioLifeCycleInnerPackagingInspectionItemEvent[];
    __typename: string;
    path: string;
    _version: number;
    update: <K extends FieldName>(field: K, value: InnerPackagingInspectionItemFieldPayloadMap[K]) => Promise<string>;
}

export function buildLifeCycleInnerPackagingInspectionItemEvents(events: any[]): ValtioLifeCycleInnerPackagingInspectionItemEvent[] {
    return events.map((event) => {
        return {
            uuid: event.uuid,
            innerPackagingInspectionItem__REF: event.innerPackagingInspectionItem__REF,
            type: event.type,
            value: event.value === '' ? undefined : new Date(event.value),
            createdAt: new Date(event.createdAt),
            __typename: 'LifeCycleInnerPackagingInspectionItemEvent',
        }
    });
}

export async function upsertInnerPackagingInspectionItemValtioEntity(ydoc: YDocInnerPackagingInspectionItem) {
    if (!store.InnerPackagingInspectionItemMap[ydoc.uuid]) {
        store.InnerPackagingInspectionItemMap[ydoc.uuid] = proxy({} as ValtioInnerPackagingInspectionItem)
    }

    const innerPackagingInspectionItem = store.InnerPackagingInspectionItemMap[ydoc.uuid]
    if (!innerPackagingInspectionItem) {
        throw new Error('InnerPackagingInspectionItem does not exist')
    }

    innerPackagingInspectionItem.__typename = 'InnerPackagingInspectionItem';
    innerPackagingInspectionItem.path = ydoc.path;
    innerPackagingInspectionItem._version = 0;
    innerPackagingInspectionItem.uuid = ydoc.uuid;
    innerPackagingInspectionItem.idRecord = buildStringHazProInnerPackagingInspectionItemRecord(ydoc.idRecord);
    innerPackagingInspectionItem.labelRecord = buildStringHazProInnerPackagingInspectionItemRecord(ydoc.labelRecord);
    innerPackagingInspectionItem.statusRecord = buildInnerPackagingInspectionItemStatusHazProInnerPackagingInspectionItemRecord(ydoc.statusRecord);
    innerPackagingInspectionItem.notesRecord = buildStringHazProInnerPackagingInspectionItemRecord(ydoc.notesRecord);
    innerPackagingInspectionItem.afmanReferenceRecord = buildStringHazProInnerPackagingInspectionItemRecord(ydoc.afmanReferenceRecord);
    innerPackagingInspectionItem.lifeCycleEvents = buildLifeCycleInnerPackagingInspectionItemEvents(ydoc.lifeCycleEvents);
}
