import { ValtioPOPMarking, ValtioStringHazProPOPMarkingRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildStringHazProPOPMarkingRecordEvent } from "./StringHazProPOPMarkingRecordEvent";

export interface ValtioStringHazProPOPMarkingRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the POPMarking entity */
    popMarking__REF: Reference<string>;
    /** Back reference to the POPMarking entity */
    get popMarking(): ValtioPOPMarking;
    /** Complete history of all changes to this field */
    eventHistory: ValtioStringHazProPOPMarkingRecordEvent[];
    /** Current String value */
    currentValue?: string;
    __typename: string;
}

export function buildStringHazProPOPMarkingRecord(input: any): ValtioStringHazProPOPMarkingRecord {
    return {
        __typename: 'StringHazProPOPMarkingRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildStringHazProPOPMarkingRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
