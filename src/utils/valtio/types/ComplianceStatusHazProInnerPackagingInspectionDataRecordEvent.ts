import { ValtioUser } from ".";
import { Reference } from "./../../yjs";

export interface ValtioComplianceStatusHazProInnerPackagingInspectionDataRecordEvent {
    /** Unique identifier for this event */
    uuid: string;
    /** When this change occurred */
    createdAt__REF: Reference<string>;
    /** User who made this change */
    createdBy__REF: Reference<string>;
    /** User who made this change */
    get createdBy(): ValtioUser;
    /** The ComplianceStatus value that was recorded */
    value: string;
    __typename: string;
}

export function buildComplianceStatusHazProInnerPackagingInspectionDataRecordEvent(input: any): ValtioComplianceStatusHazProInnerPackagingInspectionDataRecordEvent {
    return {
        __typename: 'ComplianceStatusHazProInnerPackagingInspectionDataRecordEvent',
        uuid: input.uuid,



    }
}
