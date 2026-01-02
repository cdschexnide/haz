import { ValtioEnginePreparationData, ValtioFloatHazProEnginePreparationDataRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildFloatHazProEnginePreparationDataRecordEvent } from "./FloatHazProEnginePreparationDataRecordEvent";

export interface ValtioFloatHazProEnginePreparationDataRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the EnginePreparationData entity */
    enginePreparationData__REF: Reference<string>;
    /** Back reference to the EnginePreparationData entity */
    get enginePreparationData(): ValtioEnginePreparationData;
    /** Complete history of all changes to this field */
    eventHistory: ValtioFloatHazProEnginePreparationDataRecordEvent[];
    /** Current Float value */
    currentValue?: number;
    __typename: string;
}

export function buildFloatHazProEnginePreparationDataRecord(input: any): ValtioFloatHazProEnginePreparationDataRecord {
    return {
        __typename: 'FloatHazProEnginePreparationDataRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildFloatHazProEnginePreparationDataRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
