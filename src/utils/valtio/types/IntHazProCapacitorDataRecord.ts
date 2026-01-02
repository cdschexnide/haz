import { ValtioCapacitorData, ValtioIntHazProCapacitorDataRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildIntHazProCapacitorDataRecordEvent } from "./IntHazProCapacitorDataRecordEvent";

export interface ValtioIntHazProCapacitorDataRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the CapacitorData entity */
    capacitorData__REF: Reference<string>;
    /** Back reference to the CapacitorData entity */
    get capacitorData(): ValtioCapacitorData;
    /** Complete history of all changes to this field */
    eventHistory: ValtioIntHazProCapacitorDataRecordEvent[];
    /** Current Int value */
    currentValue?: number;
    __typename: string;
}

export function buildIntHazProCapacitorDataRecord(input: any): ValtioIntHazProCapacitorDataRecord {
    return {
        __typename: 'IntHazProCapacitorDataRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildIntHazProCapacitorDataRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
