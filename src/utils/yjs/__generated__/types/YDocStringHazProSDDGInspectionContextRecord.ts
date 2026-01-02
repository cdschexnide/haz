import { Reference } from "./Reference";

export interface YDocStringHazProSDDGInspectionContextRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value: string;
    __typename: string;
}

export interface YDocStringHazProSDDGInspectionContextRecord {
    uuid: string;
    sddgInspectionContext: Reference<string>;
    eventHistory: YDocStringHazProSDDGInspectionContextRecordEvent[];
    currentValue?: string;
    __typename: string;
}
