import { ValtioPreparer, ValtioStringHazProPreparerRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildStringHazProPreparerRecordEvent } from "./StringHazProPreparerRecordEvent";

export interface ValtioStringHazProPreparerRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the Preparer entity */
    preparer__REF: Reference<string>;
    /** Back reference to the Preparer entity */
    get preparer(): ValtioPreparer;
    /** Complete history of all changes to this field */
    eventHistory: ValtioStringHazProPreparerRecordEvent[];
    /** Current String value */
    currentValue?: string;
    __typename: string;
}

export function buildStringHazProPreparerRecord(input: any): ValtioStringHazProPreparerRecord {
    return {
        __typename: 'StringHazProPreparerRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildStringHazProPreparerRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
