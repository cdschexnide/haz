import { Reference } from "./Reference";

export interface YDocBooleanHazProInnerPackagingInspectionDataRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value: boolean;
    __typename: string;
}

export interface YDocBooleanHazProInnerPackagingInspectionDataRecord {
    uuid: string;
    innerPackagingInspectionData: Reference<string>;
    eventHistory: YDocBooleanHazProInnerPackagingInspectionDataRecordEvent[];
    currentValue?: boolean;
    __typename: string;
}
