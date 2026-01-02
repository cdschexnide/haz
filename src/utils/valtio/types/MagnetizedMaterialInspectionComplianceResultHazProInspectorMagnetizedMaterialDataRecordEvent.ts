import { ValtioUser } from ".";
import { Reference } from "./../../yjs";

export interface ValtioMagnetizedMaterialInspectionComplianceResultHazProInspectorMagnetizedMaterialDataRecordEvent {
    /** Unique identifier for this event */
    uuid: string;
    /** When this change occurred */
    createdAt__REF: Reference<string>;
    /** User who made this change */
    createdBy__REF: Reference<string>;
    /** User who made this change */
    get createdBy(): ValtioUser;
    /** The MagnetizedMaterialInspectionComplianceResult value that was recorded */
    value: string;
    __typename: string;
}

export function buildMagnetizedMaterialInspectionComplianceResultHazProInspectorMagnetizedMaterialDataRecordEvent(input: any): ValtioMagnetizedMaterialInspectionComplianceResultHazProInspectorMagnetizedMaterialDataRecordEvent {
    return {
        __typename: 'MagnetizedMaterialInspectionComplianceResultHazProInspectorMagnetizedMaterialDataRecordEvent',
        uuid: input.uuid,



    }
}
