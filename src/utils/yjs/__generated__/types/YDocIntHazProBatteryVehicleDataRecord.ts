import { Reference } from "./Reference";

export interface YDocIntHazProBatteryVehicleDataRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value?: number;
    __typename: string;
}

export interface YDocIntHazProBatteryVehicleDataRecord {
    uuid: string;
    batteryVehicleData: Reference<string>;
    eventHistory: YDocIntHazProBatteryVehicleDataRecordEvent[];
    currentValue?: number;
    __typename: string;
}
