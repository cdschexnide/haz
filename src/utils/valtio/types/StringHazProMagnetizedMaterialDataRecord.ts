import { ValtioMagnetizedMaterialData, ValtioStringHazProMagnetizedMaterialDataRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildStringHazProMagnetizedMaterialDataRecordEvent } from "./StringHazProMagnetizedMaterialDataRecordEvent";

export interface ValtioStringHazProMagnetizedMaterialDataRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the MagnetizedMaterialData entity */
    magnetizedMaterialData__REF: Reference<string>;
    /** Back reference to the MagnetizedMaterialData entity */
    get magnetizedMaterialData(): ValtioMagnetizedMaterialData;
    /** Complete history of all changes to this field */
    eventHistory: ValtioStringHazProMagnetizedMaterialDataRecordEvent[];
    /** Current String value */
    currentValue?: string;
    __typename: string;
}

export function buildStringHazProMagnetizedMaterialDataRecord(input: any): ValtioStringHazProMagnetizedMaterialDataRecord {
    return {
        __typename: 'StringHazProMagnetizedMaterialDataRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildStringHazProMagnetizedMaterialDataRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
