import { ValtioUser } from ".";
import { Reference } from "./../../yjs";

export interface ValtioStringHazProPreparerShipmentRecordEvent {
    /** Unique identifier for this event */
    uuid: string;
    /** When this change occurred */
    createdAt__REF: Reference<string>;
    /** User who made this change */
    createdBy__REF: Reference<string>;
    /** User who made this change */
    get createdBy(): ValtioUser;
    /** The String value that was recorded */
    value: string;
    __typename: string;
}

export function buildStringHazProPreparerShipmentRecordEvent(input: any): ValtioStringHazProPreparerShipmentRecordEvent {
    return {
        __typename: 'StringHazProPreparerShipmentRecordEvent',
        uuid: input.uuid,


        value: input.value !== "" ? input.value : undefined,
    }
}
