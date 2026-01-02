import { Reference } from "./Reference";

export interface YDocIntHazProLithiumBatteryDataRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value: number;
    __typename: string;
}

export interface YDocIntHazProLithiumBatteryDataRecord {
    uuid: string;
    lithiumBatteryData: Reference<string>;
    eventHistory: YDocIntHazProLithiumBatteryDataRecordEvent[];
    currentValue?: number;
    __typename: string;
}
