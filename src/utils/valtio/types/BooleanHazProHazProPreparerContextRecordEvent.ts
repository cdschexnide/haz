import { ValtioUser } from ".";
import { Reference } from "./../../yjs";

export interface ValtioBooleanHazProHazProPreparerContextRecordEvent {
    /** Unique identifier for this event */
    uuid: string;
    /** When this change occurred */
    createdAt__REF: Reference<string>;
    /** User who made this change */
    createdBy__REF: Reference<string>;
    /** User who made this change */
    get createdBy(): ValtioUser;
    /** The Boolean value that was recorded */
    value: boolean;
    __typename: string;
}

export function buildBooleanHazProHazProPreparerContextRecordEvent(input: any): ValtioBooleanHazProHazProPreparerContextRecordEvent {
    return {
        __typename: 'BooleanHazProHazProPreparerContextRecordEvent',
        uuid: input.uuid,



    }
}
