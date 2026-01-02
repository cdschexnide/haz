import { ValtioBatteryVehicleData, ValtioStringHazProBatteryVehicleDataRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildStringHazProBatteryVehicleDataRecordEvent } from "./StringHazProBatteryVehicleDataRecordEvent";

export interface ValtioStringHazProBatteryVehicleDataRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the BatteryVehicleData entity */
    batteryVehicleData__REF: Reference<string>;
    /** Back reference to the BatteryVehicleData entity */
    get batteryVehicleData(): ValtioBatteryVehicleData;
    /** Complete history of all changes to this field */
    eventHistory: ValtioStringHazProBatteryVehicleDataRecordEvent[];
    /** Current String value */
    currentValue?: string;
    __typename: string;
}

export function buildStringHazProBatteryVehicleDataRecord(input: any): ValtioStringHazProBatteryVehicleDataRecord {
    return {
        __typename: 'StringHazProBatteryVehicleDataRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildStringHazProBatteryVehicleDataRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
