import { ValtioPackaging, ValtioStringHazProPackagingRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildStringHazProPackagingRecordEvent } from "./StringHazProPackagingRecordEvent";

export interface ValtioStringHazProPackagingRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the Packaging entity */
    packaging__REF: Reference<string>;
    /** Back reference to the Packaging entity */
    get packaging(): ValtioPackaging;
    /** Complete history of all changes to this field */
    eventHistory: ValtioStringHazProPackagingRecordEvent[];
    /** Current String value */
    currentValue?: string;
    __typename: string;
}

export function buildStringHazProPackagingRecord(input: any): ValtioStringHazProPackagingRecord {
    return {
        __typename: 'StringHazProPackagingRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildStringHazProPackagingRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
