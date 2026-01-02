import { Reference } from "./Reference";

export interface YDocInnerPackagingInspectionItemStatusHazProInnerPackagingInspectionItemRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value: InnerPackagingInspectionItemStatus;
    __typename: string;
}

export interface YDocInnerPackagingInspectionItemStatusHazProInnerPackagingInspectionItemRecord {
    uuid: string;
    innerPackagingInspectionItem: Reference<string>;
    eventHistory: YDocInnerPackagingInspectionItemStatusHazProInnerPackagingInspectionItemRecordEvent[];
    currentValue?: InnerPackagingInspectionItemStatus;
    __typename: string;
}
