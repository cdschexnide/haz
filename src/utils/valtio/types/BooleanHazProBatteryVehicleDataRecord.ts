import { ValtioBatteryVehicleData, ValtioBooleanHazProBatteryVehicleDataRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildBooleanHazProBatteryVehicleDataRecordEvent } from "./BooleanHazProBatteryVehicleDataRecordEvent";

export interface ValtioBooleanHazProBatteryVehicleDataRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the BatteryVehicleData entity */
    batteryVehicleData__REF: Reference<string>;
    /** Back reference to the BatteryVehicleData entity */
    get batteryVehicleData(): ValtioBatteryVehicleData;
    /** Complete history of all changes to this field */
    eventHistory: ValtioBooleanHazProBatteryVehicleDataRecordEvent[];
    /** Current Boolean value */
    currentValue?: boolean;
    __typename: string;
}

export function buildBooleanHazProBatteryVehicleDataRecord(input: any): ValtioBooleanHazProBatteryVehicleDataRecord {
    return {
        __typename: 'BooleanHazProBatteryVehicleDataRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildBooleanHazProBatteryVehicleDataRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
