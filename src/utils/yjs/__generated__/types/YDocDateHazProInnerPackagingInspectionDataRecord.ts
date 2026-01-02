import { Reference } from "./Reference";

export interface YDocDateHazProInnerPackagingInspectionDataRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value: Reference<string>;
    __typename: string;
}

export interface YDocDateHazProInnerPackagingInspectionDataRecord {
    uuid: string;
    innerPackagingInspectionData: Reference<string>;
    eventHistory: YDocDateHazProInnerPackagingInspectionDataRecordEvent[];
    currentValue?: Reference<string>;
    __typename: string;
}
