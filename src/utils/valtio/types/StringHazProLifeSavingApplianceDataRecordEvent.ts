import { ValtioUser } from ".";
import { Reference } from "./../../yjs";

export interface ValtioStringHazProLifeSavingApplianceDataRecordEvent {
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

export function buildStringHazProLifeSavingApplianceDataRecordEvent(input: any): ValtioStringHazProLifeSavingApplianceDataRecordEvent {
    return {
        __typename: 'StringHazProLifeSavingApplianceDataRecordEvent',
        uuid: input.uuid,


        value: input.value !== "" ? input.value : undefined,
    }
}
