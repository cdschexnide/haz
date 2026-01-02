import { Reference } from "./Reference";

export interface YDocDateHazProSDDGInspectionContextRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value: Reference<string>;
    __typename: string;
}

export interface YDocDateHazProSDDGInspectionContextRecord {
    uuid: string;
    sddgInspectionContext: Reference<string>;
    eventHistory: YDocDateHazProSDDGInspectionContextRecordEvent[];
    currentValue?: Reference<string>;
    __typename: string;
}
