import { ValtioExtractedSDDGContent, ValtioStringHazProExtractedSDDGContentRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildStringHazProExtractedSDDGContentRecordEvent } from "./StringHazProExtractedSDDGContentRecordEvent";

export interface ValtioStringHazProExtractedSDDGContentRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the ExtractedSDDGContent entity */
    extractedSDDGContent__REF: Reference<string>;
    /** Back reference to the ExtractedSDDGContent entity */
    get extractedSDDGContent(): ValtioExtractedSDDGContent;
    /** Complete history of all changes to this field */
    eventHistory: ValtioStringHazProExtractedSDDGContentRecordEvent[];
    /** Current String value */
    currentValue?: string;
    __typename: string;
}

export function buildStringHazProExtractedSDDGContentRecord(input: any): ValtioStringHazProExtractedSDDGContentRecord {
    return {
        __typename: 'StringHazProExtractedSDDGContentRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildStringHazProExtractedSDDGContentRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
