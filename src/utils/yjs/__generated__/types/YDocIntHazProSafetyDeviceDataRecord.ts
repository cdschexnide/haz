import { Reference } from "./Reference";

export interface YDocIntHazProSafetyDeviceDataRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value: number;
    __typename: string;
}

export interface YDocIntHazProSafetyDeviceDataRecord {
    uuid: string;
    safetyDeviceData: Reference<string>;
    eventHistory: YDocIntHazProSafetyDeviceDataRecordEvent[];
    currentValue?: number;
    __typename: string;
}
