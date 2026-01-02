import { ValtioHazProReinspectionAttemptDateRecord, ValtioInspector, ValtioHazProReinspectionAttemptActionRecord, ValtioStringHazProReinspectionAttemptRecord, ValtioLifeCycleReinspectionAttemptEvent } from ".";
import { store } from "./../__generated__/store";
import { proxy } from "valtio";
import { YDocReinspectionAttempt, Reference } from "./../../yjs";
import { buildHazProReinspectionAttemptDateRecord } from "./HazProReinspectionAttemptDateRecord";
import { buildHazProReinspectionAttemptActionRecord } from "./HazProReinspectionAttemptActionRecord";
import { buildStringHazProReinspectionAttemptRecord } from "./StringHazProReinspectionAttemptRecord";

export interface ValtioReinspectionAttempt {
    uuid: string;
    /** When the reinspection occurred */
    dateRecord: ValtioHazProReinspectionAttemptDateRecord;
    /** Inspector who performed reinspection */
    inspector__REF: Reference<string>;
    /** Inspector who performed reinspection */
    get inspector(): ValtioInspector;
    /** Result of reinspection */
    actionRecord: ValtioHazProReinspectionAttemptActionRecord;
    /** Optional comments about the reinspection */
    additionalCommentsRecord?: ValtioStringHazProReinspectionAttemptRecord;
    /** Lifecycle events tracking creation and archival */
    lifeCycleEvents: ValtioLifeCycleReinspectionAttemptEvent[];
    __typename: string;
    path: string;
    _version: number;
    update: <K extends FieldName>(field: K, value: ReinspectionAttemptFieldPayloadMap[K]) => Promise<string>;
}

export function buildLifeCycleReinspectionAttemptEvents(events: any[]): ValtioLifeCycleReinspectionAttemptEvent[] {
    return events.map((event) => {
        return {
            uuid: event.uuid,
            reinspectionAttempt__REF: event.reinspectionAttempt__REF,
            type: event.type,
            value: event.value === '' ? undefined : new Date(event.value),
            createdAt: new Date(event.createdAt),
            __typename: 'LifeCycleReinspectionAttemptEvent',
        }
    });
}

export async function upsertReinspectionAttemptValtioEntity(ydoc: YDocReinspectionAttempt) {
    if (!store.ReinspectionAttemptMap[ydoc.uuid]) {
        store.ReinspectionAttemptMap[ydoc.uuid] = proxy({} as ValtioReinspectionAttempt)
    }

    const reinspectionAttempt = store.ReinspectionAttemptMap[ydoc.uuid]
    if (!reinspectionAttempt) {
        throw new Error('ReinspectionAttempt does not exist')
    }

    reinspectionAttempt.__typename = 'ReinspectionAttempt';
    reinspectionAttempt.path = ydoc.path;
    reinspectionAttempt._version = 0;
    reinspectionAttempt.uuid = ydoc.uuid;
    reinspectionAttempt.dateRecord = buildHazProReinspectionAttemptDateRecord(ydoc.dateRecord);
    reinspectionAttempt.inspector__REF = ydoc.inspector__REF;
    reinspectionAttempt.actionRecord = buildHazProReinspectionAttemptActionRecord(ydoc.actionRecord);
    reinspectionAttempt.additionalCommentsRecord = buildStringHazProReinspectionAttemptRecord(ydoc.additionalCommentsRecord);
    reinspectionAttempt.lifeCycleEvents = buildLifeCycleReinspectionAttemptEvents(ydoc.lifeCycleEvents);
    Object.defineProperty(reinspectionAttempt, 'inspector', {
        get() {
            return Object.values(store.InspectorMap).filter((inspector) => inspector?.uuid === this.inspector__REF.uuid)[0];
        }
    });
}
