import { ValtioStringHazProCAADocumentRecord, ValtioLifeCycleCAADocumentEvent } from ".";
import { store } from "./../__generated__/store";
import { proxy } from "valtio";
import { YDocCAADocument } from "./../../yjs";
import { buildStringHazProCAADocumentRecord } from "./StringHazProCAADocumentRecord";

export interface ValtioCAADocument {
    /** Unique identifier */
    uuid: string;
    /** Type of document */
    documentTypeRecord: ValtioStringHazProCAADocumentRecord;
    /** Base64 encoded document data */
    base64DataRecord: ValtioStringHazProCAADocumentRecord;
    /** Document name */
    nameRecord: ValtioStringHazProCAADocumentRecord;
    /** Date when document was added */
    dateAddedRecord: ValtioStringHazProCAADocumentRecord;
    /** Lifecycle events tracking creation and archival */
    lifeCycleEvents: ValtioLifeCycleCAADocumentEvent[];
    __typename: string;
    path: string;
    _version: number;
    update: <K extends FieldName>(field: K, value: CAADocumentFieldPayloadMap[K]) => Promise<string>;
}

export function buildLifeCycleCAADocumentEvents(events: any[]): ValtioLifeCycleCAADocumentEvent[] {
    return events.map((event) => {
        return {
            uuid: event.uuid,
            cAADocument__REF: event.cAADocument__REF,
            type: event.type,
            value: event.value === '' ? undefined : new Date(event.value),
            createdAt: new Date(event.createdAt),
            __typename: 'LifeCycleCAADocumentEvent',
        }
    });
}

export async function upsertCAADocumentValtioEntity(ydoc: YDocCAADocument) {
    if (!store.CAADocumentMap[ydoc.uuid]) {
        store.CAADocumentMap[ydoc.uuid] = proxy({} as ValtioCAADocument)
    }

    const cAADocument = store.CAADocumentMap[ydoc.uuid]
    if (!cAADocument) {
        throw new Error('CAADocument does not exist')
    }

    cAADocument.__typename = 'CAADocument';
    cAADocument.path = ydoc.path;
    cAADocument._version = 0;
    cAADocument.uuid = ydoc.uuid;
    cAADocument.documentTypeRecord = buildStringHazProCAADocumentRecord(ydoc.documentTypeRecord);
    cAADocument.base64DataRecord = buildStringHazProCAADocumentRecord(ydoc.base64DataRecord);
    cAADocument.nameRecord = buildStringHazProCAADocumentRecord(ydoc.nameRecord);
    cAADocument.dateAddedRecord = buildStringHazProCAADocumentRecord(ydoc.dateAddedRecord);
    cAADocument.lifeCycleEvents = buildLifeCycleCAADocumentEvents(ydoc.lifeCycleEvents);
}
