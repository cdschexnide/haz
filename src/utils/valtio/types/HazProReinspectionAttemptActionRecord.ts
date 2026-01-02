import { ValtioReinspectionAttempt, ValtioHazProReinspectionAttemptActionRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildHazProReinspectionAttemptActionRecordEvent } from "./HazProReinspectionAttemptActionRecordEvent";

export interface ValtioHazProReinspectionAttemptActionRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the ReinspectionAttempt entity */
    reinspectionAttempt__REF: Reference<string>;
    /** Back reference to the ReinspectionAttempt entity */
    get reinspectionAttempt(): ValtioReinspectionAttempt;
    /** Complete history of all changes to this field */
    eventHistory: ValtioHazProReinspectionAttemptActionRecordEvent[];
    /** Current ReinspectionAction value */
    currentValue?: string;
    __typename: string;
}

export function buildHazProReinspectionAttemptActionRecord(input: any): ValtioHazProReinspectionAttemptActionRecord {
    return {
        __typename: 'HazProReinspectionAttemptActionRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildHazProReinspectionAttemptActionRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
