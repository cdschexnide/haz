import { ValtioBatteryVehicleData, ValtioIntHazProBatteryVehicleDataRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildIntHazProBatteryVehicleDataRecordEvent } from "./IntHazProBatteryVehicleDataRecordEvent";

export interface ValtioIntHazProBatteryVehicleDataRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the BatteryVehicleData entity */
    batteryVehicleData__REF: Reference<string>;
    /** Back reference to the BatteryVehicleData entity */
    get batteryVehicleData(): ValtioBatteryVehicleData;
    /** Complete history of all changes to this field */
    eventHistory: ValtioIntHazProBatteryVehicleDataRecordEvent[];
    /** Current Int value */
    currentValue?: number;
    __typename: string;
}

export function buildIntHazProBatteryVehicleDataRecord(input: any): ValtioIntHazProBatteryVehicleDataRecord {
    return {
        __typename: 'IntHazProBatteryVehicleDataRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildIntHazProBatteryVehicleDataRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
