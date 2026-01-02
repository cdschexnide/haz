import { ValtioInspectorMagnetizedMaterialData, ValtioStringHazProInspectorMagnetizedMaterialDataRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildStringHazProInspectorMagnetizedMaterialDataRecordEvent } from "./StringHazProInspectorMagnetizedMaterialDataRecordEvent";

export interface ValtioStringHazProInspectorMagnetizedMaterialDataRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the InspectorMagnetizedMaterialData entity */
    inspectorMagnetizedMaterialData__REF: Reference<string>;
    /** Back reference to the InspectorMagnetizedMaterialData entity */
    get inspectorMagnetizedMaterialData(): ValtioInspectorMagnetizedMaterialData;
    /** Complete history of all changes to this field */
    eventHistory: ValtioStringHazProInspectorMagnetizedMaterialDataRecordEvent[];
    /** Current String value */
    currentValue?: string;
    __typename: string;
}

export function buildStringHazProInspectorMagnetizedMaterialDataRecord(input: any): ValtioStringHazProInspectorMagnetizedMaterialDataRecord {
    return {
        __typename: 'StringHazProInspectorMagnetizedMaterialDataRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildStringHazProInspectorMagnetizedMaterialDataRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
