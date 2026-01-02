import { ValtioEnginePreparationData, ValtioStringHazProEnginePreparationDataRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildStringHazProEnginePreparationDataRecordEvent } from "./StringHazProEnginePreparationDataRecordEvent";

export interface ValtioStringHazProEnginePreparationDataRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the EnginePreparationData entity */
    enginePreparationData__REF: Reference<string>;
    /** Back reference to the EnginePreparationData entity */
    get enginePreparationData(): ValtioEnginePreparationData;
    /** Complete history of all changes to this field */
    eventHistory: ValtioStringHazProEnginePreparationDataRecordEvent[];
    /** Current String value */
    currentValue?: string;
    __typename: string;
}

export function buildStringHazProEnginePreparationDataRecord(input: any): ValtioStringHazProEnginePreparationDataRecord {
    return {
        __typename: 'StringHazProEnginePreparationDataRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildStringHazProEnginePreparationDataRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
