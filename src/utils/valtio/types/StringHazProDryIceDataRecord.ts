import { ValtioDryIceData, ValtioStringHazProDryIceDataRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildStringHazProDryIceDataRecordEvent } from "./StringHazProDryIceDataRecordEvent";

export interface ValtioStringHazProDryIceDataRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the DryIceData entity */
    dryIceData__REF: Reference<string>;
    /** Back reference to the DryIceData entity */
    get dryIceData(): ValtioDryIceData;
    /** Complete history of all changes to this field */
    eventHistory: ValtioStringHazProDryIceDataRecordEvent[];
    /** Current String value */
    currentValue?: string;
    __typename: string;
}

export function buildStringHazProDryIceDataRecord(input: any): ValtioStringHazProDryIceDataRecord {
    return {
        __typename: 'StringHazProDryIceDataRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildStringHazProDryIceDataRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
