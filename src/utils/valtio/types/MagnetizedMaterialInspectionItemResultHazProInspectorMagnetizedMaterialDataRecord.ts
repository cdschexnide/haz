import { ValtioInspectorMagnetizedMaterialData, ValtioMagnetizedMaterialInspectionItemResultHazProInspectorMagnetizedMaterialDataRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildMagnetizedMaterialInspectionItemResultHazProInspectorMagnetizedMaterialDataRecordEvent } from "./MagnetizedMaterialInspectionItemResultHazProInspectorMagnetizedMaterialDataRecordEvent";

export interface ValtioMagnetizedMaterialInspectionItemResultHazProInspectorMagnetizedMaterialDataRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the InspectorMagnetizedMaterialData entity */
    inspectorMagnetizedMaterialData__REF: Reference<string>;
    /** Back reference to the InspectorMagnetizedMaterialData entity */
    get inspectorMagnetizedMaterialData(): ValtioInspectorMagnetizedMaterialData;
    /** Complete history of all changes to this field */
    eventHistory: ValtioMagnetizedMaterialInspectionItemResultHazProInspectorMagnetizedMaterialDataRecordEvent[];
    /** Current MagnetizedMaterialInspectionItemResult value */
    currentValue?: string;
    __typename: string;
}

export function buildMagnetizedMaterialInspectionItemResultHazProInspectorMagnetizedMaterialDataRecord(input: any): ValtioMagnetizedMaterialInspectionItemResultHazProInspectorMagnetizedMaterialDataRecord {
    return {
        __typename: 'MagnetizedMaterialInspectionItemResultHazProInspectorMagnetizedMaterialDataRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildMagnetizedMaterialInspectionItemResultHazProInspectorMagnetizedMaterialDataRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
