import { ValtioUser } from ".";
import { Reference } from "./../../yjs";

export interface ValtioHazProPackageFrustrationCategoryRecordEvent {
    /** Unique identifier for this event */
    uuid: string;
    /** When this change occurred */
    createdAt__REF: Reference<string>;
    /** User who made this change */
    createdBy__REF: Reference<string>;
    /** User who made this change */
    get createdBy(): ValtioUser;
    /** The PackageFrustrationCategory value that was recorded */
    value: string;
    __typename: string;
}

export function buildHazProPackageFrustrationCategoryRecordEvent(input: any): ValtioHazProPackageFrustrationCategoryRecordEvent {
    return {
        __typename: 'HazProPackageFrustrationCategoryRecordEvent',
        uuid: input.uuid,



    }
}
