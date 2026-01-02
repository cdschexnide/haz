import { Reference } from "./Reference";

export interface YDocBooleanHazProBatteryVehicleDataRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value?: boolean;
    __typename: string;
}

export interface YDocBooleanHazProBatteryVehicleDataRecord {
    uuid: string;
    batteryVehicleData: Reference<string>;
    eventHistory: YDocBooleanHazProBatteryVehicleDataRecordEvent[];
    currentValue?: boolean;
    __typename: string;
}
