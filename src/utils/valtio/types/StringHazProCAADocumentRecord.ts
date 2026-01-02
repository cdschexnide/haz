import { ValtioCAADocument, ValtioStringHazProCAADocumentRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildStringHazProCAADocumentRecordEvent } from "./StringHazProCAADocumentRecordEvent";

export interface ValtioStringHazProCAADocumentRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the CAADocument entity */
    caaDocument__REF: Reference<string>;
    /** Back reference to the CAADocument entity */
    get caaDocument(): ValtioCAADocument;
    /** Complete history of all changes to this field */
    eventHistory: ValtioStringHazProCAADocumentRecordEvent[];
    /** Current String value */
    currentValue?: string;
    __typename: string;
}

export function buildStringHazProCAADocumentRecord(input: any): ValtioStringHazProCAADocumentRecord {
    return {
        __typename: 'StringHazProCAADocumentRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildStringHazProCAADocumentRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
