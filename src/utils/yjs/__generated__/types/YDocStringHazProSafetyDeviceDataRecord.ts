import { Reference } from "./Reference";

export interface YDocStringHazProSafetyDeviceDataRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value: string;
    __typename: string;
}

export interface YDocStringHazProSafetyDeviceDataRecord {
    uuid: string;
    safetyDeviceData: Reference<string>;
    eventHistory: YDocStringHazProSafetyDeviceDataRecordEvent[];
    currentValue?: string;
    __typename: string;
}
