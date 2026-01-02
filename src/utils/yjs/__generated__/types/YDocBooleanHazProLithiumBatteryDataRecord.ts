import { Reference } from "./Reference";

export interface YDocBooleanHazProLithiumBatteryDataRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value: boolean;
    __typename: string;
}

export interface YDocBooleanHazProLithiumBatteryDataRecord {
    uuid: string;
    lithiumBatteryData: Reference<string>;
    eventHistory: YDocBooleanHazProLithiumBatteryDataRecordEvent[];
    currentValue?: boolean;
    __typename: string;
}
