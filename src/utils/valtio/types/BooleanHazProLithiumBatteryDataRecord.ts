import { ValtioLithiumBatteryData, ValtioBooleanHazProLithiumBatteryDataRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildBooleanHazProLithiumBatteryDataRecordEvent } from "./BooleanHazProLithiumBatteryDataRecordEvent";

export interface ValtioBooleanHazProLithiumBatteryDataRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the LithiumBatteryData entity */
    lithiumBatteryData__REF: Reference<string>;
    /** Back reference to the LithiumBatteryData entity */
    get lithiumBatteryData(): ValtioLithiumBatteryData;
    /** Complete history of all changes to this field */
    eventHistory: ValtioBooleanHazProLithiumBatteryDataRecordEvent[];
    /** Current Boolean value */
    currentValue?: boolean;
    __typename: string;
}

export function buildBooleanHazProLithiumBatteryDataRecord(input: any): ValtioBooleanHazProLithiumBatteryDataRecord {
    return {
        __typename: 'BooleanHazProLithiumBatteryDataRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildBooleanHazProLithiumBatteryDataRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
