import { ValtioUser } from ".";
import { Reference } from "./../../yjs";

export interface ValtioInspectionStatusHazProInspectorShipmentRecordEvent {
    /** Unique identifier for this event */
    uuid: string;
    /** When this change occurred */
    createdAt__REF: Reference<string>;
    /** User who made this change */
    createdBy__REF: Reference<string>;
    /** User who made this change */
    get createdBy(): ValtioUser;
    /** The InspectionStatus value that was recorded */
    value: string;
    __typename: string;
}

export function buildInspectionStatusHazProInspectorShipmentRecordEvent(input: any): ValtioInspectionStatusHazProInspectorShipmentRecordEvent {
    return {
        __typename: 'InspectionStatusHazProInspectorShipmentRecordEvent',
        uuid: input.uuid,



    }
}
