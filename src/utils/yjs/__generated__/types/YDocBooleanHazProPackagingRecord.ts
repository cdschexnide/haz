import { Reference } from "./Reference";

export interface YDocBooleanHazProPackagingRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value: boolean;
    __typename: string;
}

export interface YDocBooleanHazProPackagingRecord {
    uuid: string;
    packaging: Reference<string>;
    eventHistory: YDocBooleanHazProPackagingRecordEvent[];
    currentValue?: boolean;
    __typename: string;
}
