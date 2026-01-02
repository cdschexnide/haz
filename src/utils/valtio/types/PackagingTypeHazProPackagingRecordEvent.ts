import { ValtioUser } from ".";
import { Reference } from "./../../yjs";

export interface ValtioPackagingTypeHazProPackagingRecordEvent {
    /** Unique identifier for this event */
    uuid: string;
    /** When this change occurred */
    createdAt__REF: Reference<string>;
    /** User who made this change */
    createdBy__REF: Reference<string>;
    /** User who made this change */
    get createdBy(): ValtioUser;
    /** The PackagingType value that was recorded */
    value: string;
    __typename: string;
}

export function buildPackagingTypeHazProPackagingRecordEvent(input: any): ValtioPackagingTypeHazProPackagingRecordEvent {
    return {
        __typename: 'PackagingTypeHazProPackagingRecordEvent',
        uuid: input.uuid,



    }
}
