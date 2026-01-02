import { ValtioUser } from ".";
import { Reference } from "./../../yjs";

export interface ValtioInspectionItemStatusHazProInspectorShipmentRecordEvent {
    /** Unique identifier for this event */
    uuid: string;
    /** When this change occurred */
    createdAt__REF: Reference<string>;
    /** User who made this change */
    createdBy__REF: Reference<string>;
    /** User who made this change */
    get createdBy(): ValtioUser;
    /** The InspectionItemStatus value that was recorded */
    value: string;
    __typename: string;
}

export function buildInspectionItemStatusHazProInspectorShipmentRecordEvent(input: any): ValtioInspectionItemStatusHazProInspectorShipmentRecordEvent {
    return {
        __typename: 'InspectionItemStatusHazProInspectorShipmentRecordEvent',
        uuid: input.uuid,



    }
}
