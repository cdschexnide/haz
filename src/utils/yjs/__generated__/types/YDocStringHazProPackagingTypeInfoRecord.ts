import { Reference } from "./Reference";

export interface YDocStringHazProPackagingTypeInfoRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value: string;
    __typename: string;
}

export interface YDocStringHazProPackagingTypeInfoRecord {
    uuid: string;
    packagingTypeInfo: Reference<string>;
    eventHistory: YDocStringHazProPackagingTypeInfoRecordEvent[];
    currentValue?: string;
    __typename: string;
}
