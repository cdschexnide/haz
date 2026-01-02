import { ValtioSafetyDeviceData, ValtioIntHazProSafetyDeviceDataRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildIntHazProSafetyDeviceDataRecordEvent } from "./IntHazProSafetyDeviceDataRecordEvent";

export interface ValtioIntHazProSafetyDeviceDataRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the SafetyDeviceData entity */
    safetyDeviceData__REF: Reference<string>;
    /** Back reference to the SafetyDeviceData entity */
    get safetyDeviceData(): ValtioSafetyDeviceData;
    /** Complete history of all changes to this field */
    eventHistory: ValtioIntHazProSafetyDeviceDataRecordEvent[];
    /** Current Int value */
    currentValue?: number;
    __typename: string;
}

export function buildIntHazProSafetyDeviceDataRecord(input: any): ValtioIntHazProSafetyDeviceDataRecord {
    return {
        __typename: 'IntHazProSafetyDeviceDataRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildIntHazProSafetyDeviceDataRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
