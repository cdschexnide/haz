import { Reference } from "./Reference";

export interface YDocStringHazProPackagePopMarkingRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value: string;
    __typename: string;
}

export interface YDocStringHazProPackagePopMarkingRecord {
    uuid: string;
    packagePopMarking: Reference<string>;
    eventHistory: YDocStringHazProPackagePopMarkingRecordEvent[];
    currentValue?: string;
    __typename: string;
}
