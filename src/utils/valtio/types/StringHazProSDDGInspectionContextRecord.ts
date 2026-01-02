import { ValtioSDDGInspectionContext, ValtioStringHazProSDDGInspectionContextRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildStringHazProSDDGInspectionContextRecordEvent } from "./StringHazProSDDGInspectionContextRecordEvent";

export interface ValtioStringHazProSDDGInspectionContextRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the SDDGInspectionContext entity */
    sddgInspectionContext__REF: Reference<string>;
    /** Back reference to the SDDGInspectionContext entity */
    get sddgInspectionContext(): ValtioSDDGInspectionContext;
    /** Complete history of all changes to this field */
    eventHistory: ValtioStringHazProSDDGInspectionContextRecordEvent[];
    /** Current String value */
    currentValue?: string;
    __typename: string;
}

export function buildStringHazProSDDGInspectionContextRecord(input: any): ValtioStringHazProSDDGInspectionContextRecord {
    return {
        __typename: 'StringHazProSDDGInspectionContextRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildStringHazProSDDGInspectionContextRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
