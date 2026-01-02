import { ValtioUser } from ".";
import { Reference } from "./../../yjs";

export interface ValtioMagnetizedMaterialInspectionItemResultHazProInspectorMagnetizedMaterialDataRecordEvent {
    /** Unique identifier for this event */
    uuid: string;
    /** When this change occurred */
    createdAt__REF: Reference<string>;
    /** User who made this change */
    createdBy__REF: Reference<string>;
    /** User who made this change */
    get createdBy(): ValtioUser;
    /** The MagnetizedMaterialInspectionItemResult value that was recorded */
    value: string;
    __typename: string;
}

export function buildMagnetizedMaterialInspectionItemResultHazProInspectorMagnetizedMaterialDataRecordEvent(input: any): ValtioMagnetizedMaterialInspectionItemResultHazProInspectorMagnetizedMaterialDataRecordEvent {
    return {
        __typename: 'MagnetizedMaterialInspectionItemResultHazProInspectorMagnetizedMaterialDataRecordEvent',
        uuid: input.uuid,



    }
}
