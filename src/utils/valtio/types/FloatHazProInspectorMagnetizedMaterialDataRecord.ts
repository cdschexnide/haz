import { ValtioInspectorMagnetizedMaterialData, ValtioFloatHazProInspectorMagnetizedMaterialDataRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildFloatHazProInspectorMagnetizedMaterialDataRecordEvent } from "./FloatHazProInspectorMagnetizedMaterialDataRecordEvent";

export interface ValtioFloatHazProInspectorMagnetizedMaterialDataRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the InspectorMagnetizedMaterialData entity */
    inspectorMagnetizedMaterialData__REF: Reference<string>;
    /** Back reference to the InspectorMagnetizedMaterialData entity */
    get inspectorMagnetizedMaterialData(): ValtioInspectorMagnetizedMaterialData;
    /** Complete history of all changes to this field */
    eventHistory: ValtioFloatHazProInspectorMagnetizedMaterialDataRecordEvent[];
    /** Current Float value */
    currentValue?: number;
    __typename: string;
}

export function buildFloatHazProInspectorMagnetizedMaterialDataRecord(input: any): ValtioFloatHazProInspectorMagnetizedMaterialDataRecord {
    return {
        __typename: 'FloatHazProInspectorMagnetizedMaterialDataRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildFloatHazProInspectorMagnetizedMaterialDataRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
