import { ValtioUser } from ".";
import { Reference } from "./../../yjs";

export interface ValtioContainerTypeHazProInnerPackagingInspectionDataRecordEvent {
    /** Unique identifier for this event */
    uuid: string;
    /** When this change occurred */
    createdAt__REF: Reference<string>;
    /** User who made this change */
    createdBy__REF: Reference<string>;
    /** User who made this change */
    get createdBy(): ValtioUser;
    /** The ContainerType value that was recorded */
    value: string;
    __typename: string;
}

export function buildContainerTypeHazProInnerPackagingInspectionDataRecordEvent(input: any): ValtioContainerTypeHazProInnerPackagingInspectionDataRecordEvent {
    return {
        __typename: 'ContainerTypeHazProInnerPackagingInspectionDataRecordEvent',
        uuid: input.uuid,



    }
}
