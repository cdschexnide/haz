import { Reference } from "./Reference";

export interface YDocFloatHazProVolumeValueRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value: number;
    __typename: string;
}

export interface YDocFloatHazProVolumeValueRecord {
    uuid: string;
    volumeValue: Reference<string>;
    eventHistory: YDocFloatHazProVolumeValueRecordEvent[];
    currentValue?: number;
    __typename: string;
}
