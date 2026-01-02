import { ValtioReinspectionAttempt, ValtioHazProReinspectionAttemptDateRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildHazProReinspectionAttemptDateRecordEvent } from "./HazProReinspectionAttemptDateRecordEvent";

export interface ValtioHazProReinspectionAttemptDateRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the ReinspectionAttempt entity */
    reinspectionAttempt__REF: Reference<string>;
    /** Back reference to the ReinspectionAttempt entity */
    get reinspectionAttempt(): ValtioReinspectionAttempt;
    /** Complete history of all changes to this field */
    eventHistory: ValtioHazProReinspectionAttemptDateRecordEvent[];
    /** Current Date value */
    currentValue__REF?: Reference<string>;
    __typename: string;
}

export function buildHazProReinspectionAttemptDateRecord(input: any): ValtioHazProReinspectionAttemptDateRecord {
    return {
        __typename: 'HazProReinspectionAttemptDateRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildHazProReinspectionAttemptDateRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
