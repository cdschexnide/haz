import { ValtioEnginePreparationData, ValtioBooleanHazProEnginePreparationDataRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildBooleanHazProEnginePreparationDataRecordEvent } from "./BooleanHazProEnginePreparationDataRecordEvent";

export interface ValtioBooleanHazProEnginePreparationDataRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the EnginePreparationData entity */
    enginePreparationData__REF: Reference<string>;
    /** Back reference to the EnginePreparationData entity */
    get enginePreparationData(): ValtioEnginePreparationData;
    /** Complete history of all changes to this field */
    eventHistory: ValtioBooleanHazProEnginePreparationDataRecordEvent[];
    /** Current Boolean value */
    currentValue?: boolean;
    __typename: string;
}

export function buildBooleanHazProEnginePreparationDataRecord(input: any): ValtioBooleanHazProEnginePreparationDataRecord {
    return {
        __typename: 'BooleanHazProEnginePreparationDataRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildBooleanHazProEnginePreparationDataRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
