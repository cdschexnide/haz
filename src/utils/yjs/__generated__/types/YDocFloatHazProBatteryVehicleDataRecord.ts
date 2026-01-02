import { Reference } from "./Reference";

export interface YDocFloatHazProBatteryVehicleDataRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value?: number;
    __typename: string;
}

export interface YDocFloatHazProBatteryVehicleDataRecord {
    uuid: string;
    batteryVehicleData: Reference<string>;
    eventHistory: YDocFloatHazProBatteryVehicleDataRecordEvent[];
    currentValue?: number;
    __typename: string;
}
