import { Reference } from "./Reference";

export interface YDocStringHazProPOPMarkingRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value: string;
    __typename: string;
}

export interface YDocStringHazProPOPMarkingRecord {
    uuid: string;
    popMarking: Reference<string>;
    eventHistory: YDocStringHazProPOPMarkingRecordEvent[];
    currentValue?: string;
    __typename: string;
}
