import { ValtioCapacitorData, ValtioBooleanHazProCapacitorDataRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildBooleanHazProCapacitorDataRecordEvent } from "./BooleanHazProCapacitorDataRecordEvent";

export interface ValtioBooleanHazProCapacitorDataRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the CapacitorData entity */
    capacitorData__REF: Reference<string>;
    /** Back reference to the CapacitorData entity */
    get capacitorData(): ValtioCapacitorData;
    /** Complete history of all changes to this field */
    eventHistory: ValtioBooleanHazProCapacitorDataRecordEvent[];
    /** Current Boolean value */
    currentValue?: boolean;
    __typename: string;
}

export function buildBooleanHazProCapacitorDataRecord(input: any): ValtioBooleanHazProCapacitorDataRecord {
    return {
        __typename: 'BooleanHazProCapacitorDataRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildBooleanHazProCapacitorDataRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
