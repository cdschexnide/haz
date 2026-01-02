import { ValtioCapacitorData, ValtioStringHazProCapacitorDataRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildStringHazProCapacitorDataRecordEvent } from "./StringHazProCapacitorDataRecordEvent";

export interface ValtioStringHazProCapacitorDataRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the CapacitorData entity */
    capacitorData__REF: Reference<string>;
    /** Back reference to the CapacitorData entity */
    get capacitorData(): ValtioCapacitorData;
    /** Complete history of all changes to this field */
    eventHistory: ValtioStringHazProCapacitorDataRecordEvent[];
    /** Current String value */
    currentValue?: string;
    __typename: string;
}

export function buildStringHazProCapacitorDataRecord(input: any): ValtioStringHazProCapacitorDataRecord {
    return {
        __typename: 'StringHazProCapacitorDataRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildStringHazProCapacitorDataRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
