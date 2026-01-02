import { Reference } from "./Reference";

export interface YDocFloatHazProLithiumBatteryDataRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value: number;
    __typename: string;
}

export interface YDocFloatHazProLithiumBatteryDataRecord {
    uuid: string;
    lithiumBatteryData: Reference<string>;
    eventHistory: YDocFloatHazProLithiumBatteryDataRecordEvent[];
    currentValue?: number;
    __typename: string;
}
