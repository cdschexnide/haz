import { ValtioInspectorMagnetizedMaterialData, ValtioMagnetizedMaterialInspectionComplianceResultHazProInspectorMagnetizedMaterialDataRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildMagnetizedMaterialInspectionComplianceResultHazProInspectorMagnetizedMaterialDataRecordEvent } from "./MagnetizedMaterialInspectionComplianceResultHazProInspectorMagnetizedMaterialDataRecordEvent";

export interface ValtioMagnetizedMaterialInspectionComplianceResultHazProInspectorMagnetizedMaterialDataRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the InspectorMagnetizedMaterialData entity */
    inspectorMagnetizedMaterialData__REF: Reference<string>;
    /** Back reference to the InspectorMagnetizedMaterialData entity */
    get inspectorMagnetizedMaterialData(): ValtioInspectorMagnetizedMaterialData;
    /** Complete history of all changes to this field */
    eventHistory: ValtioMagnetizedMaterialInspectionComplianceResultHazProInspectorMagnetizedMaterialDataRecordEvent[];
    /** Current MagnetizedMaterialInspectionComplianceResult value */
    currentValue?: string;
    __typename: string;
}

export function buildMagnetizedMaterialInspectionComplianceResultHazProInspectorMagnetizedMaterialDataRecord(input: any): ValtioMagnetizedMaterialInspectionComplianceResultHazProInspectorMagnetizedMaterialDataRecord {
    return {
        __typename: 'MagnetizedMaterialInspectionComplianceResultHazProInspectorMagnetizedMaterialDataRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildMagnetizedMaterialInspectionComplianceResultHazProInspectorMagnetizedMaterialDataRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
