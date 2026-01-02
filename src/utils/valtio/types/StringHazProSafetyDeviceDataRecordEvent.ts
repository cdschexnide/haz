import { ValtioUser } from ".";
import { Reference } from "./../../yjs";

export interface ValtioStringHazProSafetyDeviceDataRecordEvent {
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

export function buildStringHazProSafetyDeviceDataRecordEvent(input: any): ValtioStringHazProSafetyDeviceDataRecordEvent {
    return {
        __typename: 'StringHazProSafetyDeviceDataRecordEvent',
        uuid: input.uuid,


        value: input.value !== "" ? input.value : undefined,
    }
}
