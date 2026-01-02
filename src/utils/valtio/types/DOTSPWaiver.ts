import { ValtioStringHazProDOTSPWaiverRecord, ValtioLifeCycleDOTSPWaiverEvent } from ".";
import { store } from "./../__generated__/store";
import { proxy } from "valtio";
import { YDocDOTSPWaiver } from "./../../yjs";
import { buildStringHazProDOTSPWaiverRecord } from "./StringHazProDOTSPWaiverRecord";

export interface ValtioDOTSPWaiver {
    /** Unique identifier */
    uuid: string;
    /** Document URI */
    uriRecord: ValtioStringHazProDOTSPWaiverRecord;
    /** Base64 encoded document data */
    base64DataRecord: ValtioStringHazProDOTSPWaiverRecord;
    /** Waiver number */
    waiverNumberRecord: ValtioStringHazProDOTSPWaiverRecord;
    /** Description of the waiver */
    descriptionRecord?: ValtioStringHazProDOTSPWaiverRecord;
    /** Date when waiver was added */
    dateAddedRecord: ValtioStringHazProDOTSPWaiverRecord;
    /** Lifecycle events tracking creation and archival */
    lifeCycleEvents: ValtioLifeCycleDOTSPWaiverEvent[];
    __typename: string;
    path: string;
    _version: number;
    update: <K extends FieldName>(field: K, value: DOTSPWaiverFieldPayloadMap[K]) => Promise<string>;
}

export function buildLifeCycleDOTSPWaiverEvents(events: any[]): ValtioLifeCycleDOTSPWaiverEvent[] {
    return events.map((event) => {
        return {
            uuid: event.uuid,
            dOTSPWaiver__REF: event.dOTSPWaiver__REF,
            type: event.type,
            value: event.value === '' ? undefined : new Date(event.value),
            createdAt: new Date(event.createdAt),
            __typename: 'LifeCycleDOTSPWaiverEvent',
        }
    });
}

export async function upsertDOTSPWaiverValtioEntity(ydoc: YDocDOTSPWaiver) {
    if (!store.DOTSPWaiverMap[ydoc.uuid]) {
        store.DOTSPWaiverMap[ydoc.uuid] = proxy({} as ValtioDOTSPWaiver)
    }

    const dOTSPWaiver = store.DOTSPWaiverMap[ydoc.uuid]
    if (!dOTSPWaiver) {
        throw new Error('DOTSPWaiver does not exist')
    }

    dOTSPWaiver.__typename = 'DOTSPWaiver';
    dOTSPWaiver.path = ydoc.path;
    dOTSPWaiver._version = 0;
    dOTSPWaiver.uuid = ydoc.uuid;
    dOTSPWaiver.uriRecord = buildStringHazProDOTSPWaiverRecord(ydoc.uriRecord);
    dOTSPWaiver.base64DataRecord = buildStringHazProDOTSPWaiverRecord(ydoc.base64DataRecord);
    dOTSPWaiver.waiverNumberRecord = buildStringHazProDOTSPWaiverRecord(ydoc.waiverNumberRecord);
    dOTSPWaiver.descriptionRecord = buildStringHazProDOTSPWaiverRecord(ydoc.descriptionRecord);
    dOTSPWaiver.dateAddedRecord = buildStringHazProDOTSPWaiverRecord(ydoc.dateAddedRecord);
    dOTSPWaiver.lifeCycleEvents = buildLifeCycleDOTSPWaiverEvents(ydoc.lifeCycleEvents);
}
