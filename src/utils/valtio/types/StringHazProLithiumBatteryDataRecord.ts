import { ValtioLithiumBatteryData, ValtioStringHazProLithiumBatteryDataRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildStringHazProLithiumBatteryDataRecordEvent } from "./StringHazProLithiumBatteryDataRecordEvent";

export interface ValtioStringHazProLithiumBatteryDataRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the LithiumBatteryData entity */
    lithiumBatteryData__REF: Reference<string>;
    /** Back reference to the LithiumBatteryData entity */
    get lithiumBatteryData(): ValtioLithiumBatteryData;
    /** Complete history of all changes to this field */
    eventHistory: ValtioStringHazProLithiumBatteryDataRecordEvent[];
    /** Current String value */
    currentValue?: string;
    __typename: string;
}

export function buildStringHazProLithiumBatteryDataRecord(input: any): ValtioStringHazProLithiumBatteryDataRecord {
    return {
        __typename: 'StringHazProLithiumBatteryDataRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildStringHazProLithiumBatteryDataRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
