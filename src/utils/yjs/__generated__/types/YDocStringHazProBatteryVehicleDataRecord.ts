import { Reference } from "./Reference";

export interface YDocStringHazProBatteryVehicleDataRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value?: string;
    __typename: string;
}

export interface YDocStringHazProBatteryVehicleDataRecord {
    uuid: string;
    batteryVehicleData: Reference<string>;
    eventHistory: YDocStringHazProBatteryVehicleDataRecordEvent[];
    currentValue?: string;
    __typename: string;
}
