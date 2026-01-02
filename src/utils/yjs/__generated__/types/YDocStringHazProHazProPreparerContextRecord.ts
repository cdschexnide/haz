import { Reference } from "./Reference";

export interface YDocStringHazProHazProPreparerContextRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value: string;
    __typename: string;
}

export interface YDocStringHazProHazProPreparerContextRecord {
    uuid: string;
    hazProPreparerContext: Reference<string>;
    eventHistory: YDocStringHazProHazProPreparerContextRecordEvent[];
    currentValue?: string;
    __typename: string;
}
