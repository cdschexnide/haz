import { ValtioMagnetizedMaterialData, ValtioFloatHazProMagnetizedMaterialDataRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildFloatHazProMagnetizedMaterialDataRecordEvent } from "./FloatHazProMagnetizedMaterialDataRecordEvent";

export interface ValtioFloatHazProMagnetizedMaterialDataRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the MagnetizedMaterialData entity */
    magnetizedMaterialData__REF: Reference<string>;
    /** Back reference to the MagnetizedMaterialData entity */
    get magnetizedMaterialData(): ValtioMagnetizedMaterialData;
    /** Complete history of all changes to this field */
    eventHistory: ValtioFloatHazProMagnetizedMaterialDataRecordEvent[];
    /** Current Float value */
    currentValue?: number;
    __typename: string;
}

export function buildFloatHazProMagnetizedMaterialDataRecord(input: any): ValtioFloatHazProMagnetizedMaterialDataRecord {
    return {
        __typename: 'FloatHazProMagnetizedMaterialDataRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildFloatHazProMagnetizedMaterialDataRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
