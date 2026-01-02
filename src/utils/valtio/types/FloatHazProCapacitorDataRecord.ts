import { ValtioCapacitorData, ValtioFloatHazProCapacitorDataRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildFloatHazProCapacitorDataRecordEvent } from "./FloatHazProCapacitorDataRecordEvent";

export interface ValtioFloatHazProCapacitorDataRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the CapacitorData entity */
    capacitorData__REF: Reference<string>;
    /** Back reference to the CapacitorData entity */
    get capacitorData(): ValtioCapacitorData;
    /** Complete history of all changes to this field */
    eventHistory: ValtioFloatHazProCapacitorDataRecordEvent[];
    /** Current Float value */
    currentValue?: number;
    __typename: string;
}

export function buildFloatHazProCapacitorDataRecord(input: any): ValtioFloatHazProCapacitorDataRecord {
    return {
        __typename: 'FloatHazProCapacitorDataRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildFloatHazProCapacitorDataRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
