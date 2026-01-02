import { ValtioUser } from ".";
import { Reference } from "./../../yjs";

export interface ValtioIntHazProInspectorCountRecordEvent {
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

export function buildIntHazProInspectorCountRecordEvent(input: any): ValtioIntHazProInspectorCountRecordEvent {
    return {
        __typename: 'IntHazProInspectorCountRecordEvent',
        uuid: input.uuid,


        value: input.value !== "" ? Number(input.value) : undefined,
    }
}
