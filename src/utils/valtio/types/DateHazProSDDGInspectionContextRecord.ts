import { ValtioSDDGInspectionContext, ValtioDateHazProSDDGInspectionContextRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildDateHazProSDDGInspectionContextRecordEvent } from "./DateHazProSDDGInspectionContextRecordEvent";

export interface ValtioDateHazProSDDGInspectionContextRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the SDDGInspectionContext entity */
    sddgInspectionContext__REF: Reference<string>;
    /** Back reference to the SDDGInspectionContext entity */
    get sddgInspectionContext(): ValtioSDDGInspectionContext;
    /** Complete history of all changes to this field */
    eventHistory: ValtioDateHazProSDDGInspectionContextRecordEvent[];
    /** Current Date value */
    currentValue__REF?: Reference<string>;
    __typename: string;
}

export function buildDateHazProSDDGInspectionContextRecord(input: any): ValtioDateHazProSDDGInspectionContextRecord {
    return {
        __typename: 'DateHazProSDDGInspectionContextRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildDateHazProSDDGInspectionContextRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
