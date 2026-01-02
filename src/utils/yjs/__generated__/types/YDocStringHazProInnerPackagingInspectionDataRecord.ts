import { Reference } from "./Reference";

export interface YDocStringHazProInnerPackagingInspectionDataRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value: string;
    __typename: string;
}

export interface YDocStringHazProInnerPackagingInspectionDataRecord {
    uuid: string;
    innerPackagingInspectionData: Reference<string>;
    eventHistory: YDocStringHazProInnerPackagingInspectionDataRecordEvent[];
    currentValue?: string;
    __typename: string;
}
