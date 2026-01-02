import { ValtioKitPreparationData, ValtioStringHazProKitPreparationDataRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildStringHazProKitPreparationDataRecordEvent } from "./StringHazProKitPreparationDataRecordEvent";

export interface ValtioStringHazProKitPreparationDataRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the KitPreparationData entity */
    kitPreparationData__REF: Reference<string>;
    /** Back reference to the KitPreparationData entity */
    get kitPreparationData(): ValtioKitPreparationData;
    /** Complete history of all changes to this field */
    eventHistory: ValtioStringHazProKitPreparationDataRecordEvent[];
    /** Current String value */
    currentValue?: string;
    __typename: string;
}

export function buildStringHazProKitPreparationDataRecord(input: any): ValtioStringHazProKitPreparationDataRecord {
    return {
        __typename: 'StringHazProKitPreparationDataRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildStringHazProKitPreparationDataRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
