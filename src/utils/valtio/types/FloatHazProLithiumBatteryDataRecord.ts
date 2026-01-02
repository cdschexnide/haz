import { ValtioLithiumBatteryData, ValtioFloatHazProLithiumBatteryDataRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildFloatHazProLithiumBatteryDataRecordEvent } from "./FloatHazProLithiumBatteryDataRecordEvent";

export interface ValtioFloatHazProLithiumBatteryDataRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the LithiumBatteryData entity */
    lithiumBatteryData__REF: Reference<string>;
    /** Back reference to the LithiumBatteryData entity */
    get lithiumBatteryData(): ValtioLithiumBatteryData;
    /** Complete history of all changes to this field */
    eventHistory: ValtioFloatHazProLithiumBatteryDataRecordEvent[];
    /** Current Float value */
    currentValue?: number;
    __typename: string;
}

export function buildFloatHazProLithiumBatteryDataRecord(input: any): ValtioFloatHazProLithiumBatteryDataRecord {
    return {
        __typename: 'FloatHazProLithiumBatteryDataRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildFloatHazProLithiumBatteryDataRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
