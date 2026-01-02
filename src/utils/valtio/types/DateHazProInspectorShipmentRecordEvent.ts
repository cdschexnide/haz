import { ValtioUser } from ".";
import { Reference } from "./../../yjs";

export interface ValtioDateHazProInspectorShipmentRecordEvent {
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

export function buildDateHazProInspectorShipmentRecordEvent(input: any): ValtioDateHazProInspectorShipmentRecordEvent {
    return {
        __typename: 'DateHazProInspectorShipmentRecordEvent',
        uuid: input.uuid,



    }
}
