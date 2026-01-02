import { Reference } from "./Reference";

export interface YDocStringHazProLithiumBatteryDataRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value: string;
    __typename: string;
}

export interface YDocStringHazProLithiumBatteryDataRecord {
    uuid: string;
    lithiumBatteryData: Reference<string>;
    eventHistory: YDocStringHazProLithiumBatteryDataRecordEvent[];
    currentValue?: string;
    __typename: string;
}
