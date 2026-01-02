import { ValtioCombinationPackaging, ValtioIntHazProCombinationPackagingRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildIntHazProCombinationPackagingRecordEvent } from "./IntHazProCombinationPackagingRecordEvent";

export interface ValtioIntHazProCombinationPackagingRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the CombinationPackaging entity */
    combinationPackaging__REF: Reference<string>;
    /** Back reference to the CombinationPackaging entity */
    get combinationPackaging(): ValtioCombinationPackaging;
    /** Complete history of all changes to this field */
    eventHistory: ValtioIntHazProCombinationPackagingRecordEvent[];
    /** Current Int value */
    currentValue?: number;
    __typename: string;
}

export function buildIntHazProCombinationPackagingRecord(input: any): ValtioIntHazProCombinationPackagingRecord {
    return {
        __typename: 'IntHazProCombinationPackagingRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildIntHazProCombinationPackagingRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
