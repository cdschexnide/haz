import { ValtioLithiumBatteryData, ValtioIntHazProLithiumBatteryDataRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildIntHazProLithiumBatteryDataRecordEvent } from "./IntHazProLithiumBatteryDataRecordEvent";

export interface ValtioIntHazProLithiumBatteryDataRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the LithiumBatteryData entity */
    lithiumBatteryData__REF: Reference<string>;
    /** Back reference to the LithiumBatteryData entity */
    get lithiumBatteryData(): ValtioLithiumBatteryData;
    /** Complete history of all changes to this field */
    eventHistory: ValtioIntHazProLithiumBatteryDataRecordEvent[];
    /** Current Int value */
    currentValue?: number;
    __typename: string;
}

export function buildIntHazProLithiumBatteryDataRecord(input: any): ValtioIntHazProLithiumBatteryDataRecord {
    return {
        __typename: 'IntHazProLithiumBatteryDataRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildIntHazProLithiumBatteryDataRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
