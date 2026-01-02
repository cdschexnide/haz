import { Reference } from "./Reference";

export interface YDocStringHazProPreparerRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value: string;
    __typename: string;
}

export interface YDocStringHazProPreparerRecord {
    uuid: string;
    preparer: Reference<string>;
    eventHistory: YDocStringHazProPreparerRecordEvent[];
    currentValue?: string;
    __typename: string;
}
