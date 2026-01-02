import { ValtioUser } from ".";
import { Reference } from "./../../yjs";

export interface ValtioFloatHazProLithiumBatteryDataRecordEvent {
    /** Unique identifier for this event */
    uuid: string;
    /** When this change occurred */
    createdAt__REF: Reference<string>;
    /** User who made this change */
    createdBy__REF: Reference<string>;
    /** User who made this change */
    get createdBy(): ValtioUser;
    /** The Float value that was recorded */
    value: number;
    __typename: string;
}

export function buildFloatHazProLithiumBatteryDataRecordEvent(input: any): ValtioFloatHazProLithiumBatteryDataRecordEvent {
    return {
        __typename: 'FloatHazProLithiumBatteryDataRecordEvent',
        uuid: input.uuid,



    }
}
