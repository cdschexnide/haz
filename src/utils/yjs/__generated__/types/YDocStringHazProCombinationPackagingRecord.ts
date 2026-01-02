import { Reference } from "./Reference";

export interface YDocStringHazProCombinationPackagingRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value: string;
    __typename: string;
}

export interface YDocStringHazProCombinationPackagingRecord {
    uuid: string;
    combinationPackaging: Reference<string>;
    eventHistory: YDocStringHazProCombinationPackagingRecordEvent[];
    currentValue?: string;
    __typename: string;
}
