import { ValtioReinspectionAttempt, ValtioStringHazProReinspectionAttemptRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildStringHazProReinspectionAttemptRecordEvent } from "./StringHazProReinspectionAttemptRecordEvent";

export interface ValtioStringHazProReinspectionAttemptRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the ReinspectionAttempt entity */
    reinspectionAttempt__REF: Reference<string>;
    /** Back reference to the ReinspectionAttempt entity */
    get reinspectionAttempt(): ValtioReinspectionAttempt;
    /** Complete history of all changes to this field */
    eventHistory: ValtioStringHazProReinspectionAttemptRecordEvent[];
    /** Current String value */
    currentValue?: string;
    __typename: string;
}

export function buildStringHazProReinspectionAttemptRecord(input: any): ValtioStringHazProReinspectionAttemptRecord {
    return {
        __typename: 'StringHazProReinspectionAttemptRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildStringHazProReinspectionAttemptRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
