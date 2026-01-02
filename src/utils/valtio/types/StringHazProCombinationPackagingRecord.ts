import { ValtioCombinationPackaging, ValtioStringHazProCombinationPackagingRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildStringHazProCombinationPackagingRecordEvent } from "./StringHazProCombinationPackagingRecordEvent";

export interface ValtioStringHazProCombinationPackagingRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the CombinationPackaging entity */
    combinationPackaging__REF: Reference<string>;
    /** Back reference to the CombinationPackaging entity */
    get combinationPackaging(): ValtioCombinationPackaging;
    /** Complete history of all changes to this field */
    eventHistory: ValtioStringHazProCombinationPackagingRecordEvent[];
    /** Current String value */
    currentValue?: string;
    __typename: string;
}

export function buildStringHazProCombinationPackagingRecord(input: any): ValtioStringHazProCombinationPackagingRecord {
    return {
        __typename: 'StringHazProCombinationPackagingRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildStringHazProCombinationPackagingRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
