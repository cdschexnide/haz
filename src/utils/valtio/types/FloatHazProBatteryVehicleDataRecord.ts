import { ValtioBatteryVehicleData, ValtioFloatHazProBatteryVehicleDataRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildFloatHazProBatteryVehicleDataRecordEvent } from "./FloatHazProBatteryVehicleDataRecordEvent";

export interface ValtioFloatHazProBatteryVehicleDataRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the BatteryVehicleData entity */
    batteryVehicleData__REF: Reference<string>;
    /** Back reference to the BatteryVehicleData entity */
    get batteryVehicleData(): ValtioBatteryVehicleData;
    /** Complete history of all changes to this field */
    eventHistory: ValtioFloatHazProBatteryVehicleDataRecordEvent[];
    /** Current Float value */
    currentValue?: number;
    __typename: string;
}

export function buildFloatHazProBatteryVehicleDataRecord(input: any): ValtioFloatHazProBatteryVehicleDataRecord {
    return {
        __typename: 'FloatHazProBatteryVehicleDataRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildFloatHazProBatteryVehicleDataRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
