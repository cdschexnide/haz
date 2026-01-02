import { Reference } from "./Reference";

export interface YDocIntHazProCombinationPackagingRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value: number;
    __typename: string;
}

export interface YDocIntHazProCombinationPackagingRecord {
    uuid: string;
    combinationPackaging: Reference<string>;
    eventHistory: YDocIntHazProCombinationPackagingRecordEvent[];
    currentValue?: number;
    __typename: string;
}
