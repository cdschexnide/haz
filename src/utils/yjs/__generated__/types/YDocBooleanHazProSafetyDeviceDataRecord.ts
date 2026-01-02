import { Reference } from "./Reference";

export interface YDocBooleanHazProSafetyDeviceDataRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value: boolean;
    __typename: string;
}

export interface YDocBooleanHazProSafetyDeviceDataRecord {
    uuid: string;
    safetyDeviceData: Reference<string>;
    eventHistory: YDocBooleanHazProSafetyDeviceDataRecordEvent[];
    currentValue?: boolean;
    __typename: string;
}
