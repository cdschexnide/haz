import { ValtioCOEDocument, ValtioStringHazProCOEDocumentRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildStringHazProCOEDocumentRecordEvent } from "./StringHazProCOEDocumentRecordEvent";

export interface ValtioStringHazProCOEDocumentRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the COEDocument entity */
    coeDocument__REF: Reference<string>;
    /** Back reference to the COEDocument entity */
    get coeDocument(): ValtioCOEDocument;
    /** Complete history of all changes to this field */
    eventHistory: ValtioStringHazProCOEDocumentRecordEvent[];
    /** Current String value */
    currentValue?: string;
    __typename: string;
}

export function buildStringHazProCOEDocumentRecord(input: any): ValtioStringHazProCOEDocumentRecord {
    return {
        __typename: 'StringHazProCOEDocumentRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildStringHazProCOEDocumentRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
