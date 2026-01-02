import { Reference } from "./Reference";

export interface YDocPackagingTypeHazProPackagingRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value: PackagingType;
    __typename: string;
}

export interface YDocPackagingTypeHazProPackagingRecord {
    uuid: string;
    packaging: Reference<string>;
    eventHistory: YDocPackagingTypeHazProPackagingRecordEvent[];
    currentValue?: PackagingType;
    __typename: string;
}
