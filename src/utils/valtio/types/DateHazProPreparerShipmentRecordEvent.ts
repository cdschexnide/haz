import { ValtioUser } from ".";
import { Reference } from "./../../yjs";

export interface ValtioDateHazProPreparerShipmentRecordEvent {
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

export function buildDateHazProPreparerShipmentRecordEvent(input: any): ValtioDateHazProPreparerShipmentRecordEvent {
    return {
        __typename: 'DateHazProPreparerShipmentRecordEvent',
        uuid: input.uuid,



    }
}
