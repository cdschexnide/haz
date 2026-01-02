import { Reference } from "./Reference";

export interface YDocHazProReinspectionAttemptActionRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value: ReinspectionAction;
    __typename: string;
}

export interface YDocHazProReinspectionAttemptActionRecord {
    uuid: string;
    reinspectionAttempt: Reference<string>;
    eventHistory: YDocHazProReinspectionAttemptActionRecordEvent[];
    currentValue?: ReinspectionAction;
    __typename: string;
}
