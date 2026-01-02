import { ValtioDOTSPWaiver, ValtioStringHazProDOTSPWaiverRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildStringHazProDOTSPWaiverRecordEvent } from "./StringHazProDOTSPWaiverRecordEvent";

export interface ValtioStringHazProDOTSPWaiverRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the DOTSPWaiver entity */
    dotspWaiver__REF: Reference<string>;
    /** Back reference to the DOTSPWaiver entity */
    get dotspWaiver(): ValtioDOTSPWaiver;
    /** Complete history of all changes to this field */
    eventHistory: ValtioStringHazProDOTSPWaiverRecordEvent[];
    /** Current String value */
    currentValue?: string;
    __typename: string;
}

export function buildStringHazProDOTSPWaiverRecord(input: any): ValtioStringHazProDOTSPWaiverRecord {
    return {
        __typename: 'StringHazProDOTSPWaiverRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildStringHazProDOTSPWaiverRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
