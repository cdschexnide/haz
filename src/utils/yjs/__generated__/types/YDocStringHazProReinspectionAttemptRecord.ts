import { Reference } from "./Reference";

export interface YDocStringHazProReinspectionAttemptRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value: string;
    __typename: string;
}

export interface YDocStringHazProReinspectionAttemptRecord {
    uuid: string;
    reinspectionAttempt: Reference<string>;
    eventHistory: YDocStringHazProReinspectionAttemptRecordEvent[];
    currentValue?: string;
    __typename: string;
}
