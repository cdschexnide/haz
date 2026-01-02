import { Reference } from "./Reference";

export interface YDocBooleanHazProHazProPreparerContextRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value: boolean;
    __typename: string;
}

export interface YDocBooleanHazProHazProPreparerContextRecord {
    uuid: string;
    hazProPreparerContext: Reference<string>;
    eventHistory: YDocBooleanHazProHazProPreparerContextRecordEvent[];
    currentValue?: boolean;
    __typename: string;
}
