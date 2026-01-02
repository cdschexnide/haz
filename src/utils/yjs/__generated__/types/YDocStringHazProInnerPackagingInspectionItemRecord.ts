import { Reference } from "./Reference";

export interface YDocStringHazProInnerPackagingInspectionItemRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value: string;
    __typename: string;
}

export interface YDocStringHazProInnerPackagingInspectionItemRecord {
    uuid: string;
    innerPackagingInspectionItem: Reference<string>;
    eventHistory: YDocStringHazProInnerPackagingInspectionItemRecordEvent[];
    currentValue?: string;
    __typename: string;
}
