import { ValtioDryIceData, ValtioBooleanHazProDryIceDataRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildBooleanHazProDryIceDataRecordEvent } from "./BooleanHazProDryIceDataRecordEvent";

export interface ValtioBooleanHazProDryIceDataRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the DryIceData entity */
    dryIceData__REF: Reference<string>;
    /** Back reference to the DryIceData entity */
    get dryIceData(): ValtioDryIceData;
    /** Complete history of all changes to this field */
    eventHistory: ValtioBooleanHazProDryIceDataRecordEvent[];
    /** Current Boolean value */
    currentValue?: boolean;
    __typename: string;
}

export function buildBooleanHazProDryIceDataRecord(input: any): ValtioBooleanHazProDryIceDataRecord {
    return {
        __typename: 'BooleanHazProDryIceDataRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildBooleanHazProDryIceDataRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
