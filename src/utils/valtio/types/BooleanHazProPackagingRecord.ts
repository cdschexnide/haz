import { ValtioPackaging, ValtioBooleanHazProPackagingRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildBooleanHazProPackagingRecordEvent } from "./BooleanHazProPackagingRecordEvent";

export interface ValtioBooleanHazProPackagingRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the Packaging entity */
    packaging__REF: Reference<string>;
    /** Back reference to the Packaging entity */
    get packaging(): ValtioPackaging;
    /** Complete history of all changes to this field */
    eventHistory: ValtioBooleanHazProPackagingRecordEvent[];
    /** Current Boolean value */
    currentValue?: boolean;
    __typename: string;
}

export function buildBooleanHazProPackagingRecord(input: any): ValtioBooleanHazProPackagingRecord {
    return {
        __typename: 'BooleanHazProPackagingRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildBooleanHazProPackagingRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
