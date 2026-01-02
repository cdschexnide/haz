import { ValtioUser } from ".";
import { Reference } from "./../../yjs";

export interface ValtioStringHazProHazProPreparerContextRecordEvent {
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

export function buildStringHazProHazProPreparerContextRecordEvent(input: any): ValtioStringHazProHazProPreparerContextRecordEvent {
    return {
        __typename: 'StringHazProHazProPreparerContextRecordEvent',
        uuid: input.uuid,


        value: input.value !== "" ? input.value : undefined,
    }
}
