import { ValtioUser } from ".";
import { Reference } from "./../../yjs";

export interface ValtioIntHazProExplosiveContainerRecordEvent {
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

export function buildIntHazProExplosiveContainerRecordEvent(input: any): ValtioIntHazProExplosiveContainerRecordEvent {
    return {
        __typename: 'IntHazProExplosiveContainerRecordEvent',
        uuid: input.uuid,


        value: input.value !== "" ? Number(input.value) : undefined,
    }
}
