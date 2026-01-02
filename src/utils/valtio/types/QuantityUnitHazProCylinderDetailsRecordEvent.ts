import { ValtioUser } from ".";
import { Reference } from "./../../yjs";

export interface ValtioQuantityUnitHazProCylinderDetailsRecordEvent {
    /** Unique identifier for this event */
    uuid: string;
    /** When this change occurred */
    createdAt__REF: Reference<string>;
    /** User who made this change */
    createdBy__REF: Reference<string>;
    /** User who made this change */
    get createdBy(): ValtioUser;
    /** The QuantityUnit value that was recorded */
    value: string;
    __typename: string;
}

export function buildQuantityUnitHazProCylinderDetailsRecordEvent(input: any): ValtioQuantityUnitHazProCylinderDetailsRecordEvent {
    return {
        __typename: 'QuantityUnitHazProCylinderDetailsRecordEvent',
        uuid: input.uuid,



    }
}
