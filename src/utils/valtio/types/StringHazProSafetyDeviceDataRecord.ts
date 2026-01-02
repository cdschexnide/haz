import { ValtioSafetyDeviceData, ValtioStringHazProSafetyDeviceDataRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildStringHazProSafetyDeviceDataRecordEvent } from "./StringHazProSafetyDeviceDataRecordEvent";

export interface ValtioStringHazProSafetyDeviceDataRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the SafetyDeviceData entity */
    safetyDeviceData__REF: Reference<string>;
    /** Back reference to the SafetyDeviceData entity */
    get safetyDeviceData(): ValtioSafetyDeviceData;
    /** Complete history of all changes to this field */
    eventHistory: ValtioStringHazProSafetyDeviceDataRecordEvent[];
    /** Current String value */
    currentValue?: string;
    __typename: string;
}

export function buildStringHazProSafetyDeviceDataRecord(input: any): ValtioStringHazProSafetyDeviceDataRecord {
    return {
        __typename: 'StringHazProSafetyDeviceDataRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildStringHazProSafetyDeviceDataRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
