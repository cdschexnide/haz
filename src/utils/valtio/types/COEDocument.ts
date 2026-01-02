import { ValtioStringHazProCOEDocumentRecord, ValtioLifeCycleCOEDocumentEvent } from ".";
import { store } from "./../__generated__/store";
import { proxy } from "valtio";
import { YDocCOEDocument } from "./../../yjs";
import { buildStringHazProCOEDocumentRecord } from "./StringHazProCOEDocumentRecord";

export interface ValtioCOEDocument {
    /** Unique identifier */
    uuid: string;
    /** Type of document */
    documentTypeRecord: ValtioStringHazProCOEDocumentRecord;
    /** Base64 encoded document data */
    base64DataRecord: ValtioStringHazProCOEDocumentRecord;
    /** Document name */
    nameRecord: ValtioStringHazProCOEDocumentRecord;
    /** Date when document was added */
    dateAddedRecord: ValtioStringHazProCOEDocumentRecord;
    /** Lifecycle events tracking creation and archival */
    lifeCycleEvents: ValtioLifeCycleCOEDocumentEvent[];
    __typename: string;
    path: string;
    _version: number;
    update: <K extends FieldName>(field: K, value: COEDocumentFieldPayloadMap[K]) => Promise<string>;
}

export function buildLifeCycleCOEDocumentEvents(events: any[]): ValtioLifeCycleCOEDocumentEvent[] {
    return events.map((event) => {
        return {
            uuid: event.uuid,
            cOEDocument__REF: event.cOEDocument__REF,
            type: event.type,
            value: event.value === '' ? undefined : new Date(event.value),
            createdAt: new Date(event.createdAt),
            __typename: 'LifeCycleCOEDocumentEvent',
        }
    });
}

export async function upsertCOEDocumentValtioEntity(ydoc: YDocCOEDocument) {
    if (!store.COEDocumentMap[ydoc.uuid]) {
        store.COEDocumentMap[ydoc.uuid] = proxy({} as ValtioCOEDocument)
    }

    const cOEDocument = store.COEDocumentMap[ydoc.uuid]
    if (!cOEDocument) {
        throw new Error('COEDocument does not exist')
    }

    cOEDocument.__typename = 'COEDocument';
    cOEDocument.path = ydoc.path;
    cOEDocument._version = 0;
    cOEDocument.uuid = ydoc.uuid;
    cOEDocument.documentTypeRecord = buildStringHazProCOEDocumentRecord(ydoc.documentTypeRecord);
    cOEDocument.base64DataRecord = buildStringHazProCOEDocumentRecord(ydoc.base64DataRecord);
    cOEDocument.nameRecord = buildStringHazProCOEDocumentRecord(ydoc.nameRecord);
    cOEDocument.dateAddedRecord = buildStringHazProCOEDocumentRecord(ydoc.dateAddedRecord);
    cOEDocument.lifeCycleEvents = buildLifeCycleCOEDocumentEvents(ydoc.lifeCycleEvents);
}
