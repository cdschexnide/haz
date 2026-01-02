import { ValtioSafetyDeviceData, ValtioBooleanHazProSafetyDeviceDataRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildBooleanHazProSafetyDeviceDataRecordEvent } from "./BooleanHazProSafetyDeviceDataRecordEvent";

export interface ValtioBooleanHazProSafetyDeviceDataRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the SafetyDeviceData entity */
    safetyDeviceData__REF: Reference<string>;
    /** Back reference to the SafetyDeviceData entity */
    get safetyDeviceData(): ValtioSafetyDeviceData;
    /** Complete history of all changes to this field */
    eventHistory: ValtioBooleanHazProSafetyDeviceDataRecordEvent[];
    /** Current Boolean value */
    currentValue?: boolean;
    __typename: string;
}

export function buildBooleanHazProSafetyDeviceDataRecord(input: any): ValtioBooleanHazProSafetyDeviceDataRecord {
    return {
        __typename: 'BooleanHazProSafetyDeviceDataRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildBooleanHazProSafetyDeviceDataRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
