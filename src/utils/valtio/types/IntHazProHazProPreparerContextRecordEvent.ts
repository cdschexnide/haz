import { ValtioUser } from ".";
import { Reference } from "./../../yjs";

export interface ValtioIntHazProHazProPreparerContextRecordEvent {
    /** Unique identifier for this event */
    uuid: string;
    /** When this change occurred */
    createdAt__REF: Reference<string>;
    /** User who made this change */
    createdBy__REF: Reference<string>;
    /** User who made this change */
    get createdBy(): ValtioUser;
    /** The Int value that was recorded */
    value: number;
    __typename: string;
}

export function buildIntHazProHazProPreparerContextRecordEvent(input: any): ValtioIntHazProHazProPreparerContextRecordEvent {
    return {
        __typename: 'IntHazProHazProPreparerContextRecordEvent',
        uuid: input.uuid,


        value: input.value !== "" ? Number(input.value) : undefined,
    }
}
