import { Reference } from "./Reference";

export interface YDocContainerTypeHazProInnerPackagingInspectionDataRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value: ContainerType;
    __typename: string;
}

export interface YDocContainerTypeHazProInnerPackagingInspectionDataRecord {
    uuid: string;
    innerPackagingInspectionData: Reference<string>;
    eventHistory: YDocContainerTypeHazProInnerPackagingInspectionDataRecordEvent[];
    currentValue?: ContainerType;
    __typename: string;
}
