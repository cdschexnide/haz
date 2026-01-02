import { Reference } from "./Reference";
import { YDocStringHazProBatteryVehicleDataRecord } from "./YDocStringHazProBatteryVehicleDataRecord";
import { YDocFloatHazProBatteryVehicleDataRecord } from "./YDocFloatHazProBatteryVehicleDataRecord";
import { YDocIntHazProBatteryVehicleDataRecord } from "./YDocIntHazProBatteryVehicleDataRecord";
import { YDocBooleanHazProBatteryVehicleDataRecord } from "./YDocBooleanHazProBatteryVehicleDataRecord";

export interface YDocLifeCycleBatteryVehicleDataEvent {
    uuid: string;
    batteryVehicleData__REF: Reference<string>;
    type: string;
    value__REF?: Reference<string>;
    createdAt__REF: Reference<string>;
    __typename: string;
}

export interface YDocBatteryVehicleData {
    uuid: string;
    vehicleType: YDocStringHazProBatteryVehicleDataRecord;
    batteryType: YDocStringHazProBatteryVehicleDataRecord;
    wattHours: YDocFloatHazProBatteryVehicleDataRecord;
    numberOfBatteries: YDocIntHazProBatteryVehicleDataRecord;
    batteryLocation: YDocStringHazProBatteryVehicleDataRecord;
    isDrained: YDocBooleanHazProBatteryVehicleDataRecord;
    protectionMeasures?: YDocStringHazProBatteryVehicleDataRecord;
    lifeCycleEvents: YDocLifeCycleBatteryVehicleDataEvent[];
    path: string;
    __typename: string;
}
