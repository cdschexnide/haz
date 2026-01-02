import { ValtioUser } from ".";
import { Reference } from "./../../yjs";

export interface ValtioDateHazProSDDGInspectionContextRecordEvent {
    /** Unique identifier for this event */
    uuid: string;
    /** When this change occurred */
    createdAt__REF: Reference<string>;
    /** User who made this change */
    createdBy__REF: Reference<string>;
    /** User who made this change */
    get createdBy(): ValtioUser;
    /** The Date value that was recorded */
    value__REF: Reference<string>;
    __typename: string;
}

export function buildDateHazProSDDGInspectionContextRecordEvent(input: any): ValtioDateHazProSDDGInspectionContextRecordEvent {
    return {
        __typename: 'DateHazProSDDGInspectionContextRecordEvent',
        uuid: input.uuid,



    }
}
