import { Reference } from "./Reference";

export interface YDocStringHazProPackagingRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value: string;
    __typename: string;
}

export interface YDocStringHazProPackagingRecord {
    uuid: string;
    packaging: Reference<string>;
    eventHistory: YDocStringHazProPackagingRecordEvent[];
    currentValue?: string;
    __typename: string;
}
