import { Reference } from "./Reference";
import { YDocHazProReinspectionAttemptDateRecord } from "./YDocHazProReinspectionAttemptDateRecord";
import { YDocHazProReinspectionAttemptActionRecord } from "./YDocHazProReinspectionAttemptActionRecord";
import { YDocStringHazProReinspectionAttemptRecord } from "./YDocStringHazProReinspectionAttemptRecord";

export interface YDocLifeCycleReinspectionAttemptEvent {
    uuid: string;
    reinspectionAttempt__REF: Reference<string>;
    type: string;
    value__REF?: Reference<string>;
    createdAt__REF: Reference<string>;
    __typename: string;
}

export interface YDocReinspectionAttempt {
    uuid: string;
    dateRecord: YDocHazProReinspectionAttemptDateRecord;
    inspector__REF: Reference<string>;
    actionRecord: YDocHazProReinspectionAttemptActionRecord;
    additionalCommentsRecord?: YDocStringHazProReinspectionAttemptRecord;
    lifeCycleEvents: YDocLifeCycleReinspectionAttemptEvent[];
    path: string;
    __typename: string;
}
