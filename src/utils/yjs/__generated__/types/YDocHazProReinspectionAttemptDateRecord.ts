import { Reference } from "./Reference";

export interface YDocHazProReinspectionAttemptDateRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value: Reference<string>;
    __typename: string;
}

export interface YDocHazProReinspectionAttemptDateRecord {
    uuid: string;
    reinspectionAttempt: Reference<string>;
    eventHistory: YDocHazProReinspectionAttemptDateRecordEvent[];
    currentValue?: Reference<string>;
    __typename: string;
}
