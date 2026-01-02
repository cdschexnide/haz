import { Reference } from "./Reference";

export interface YDocIntHazProHazProPreparerContextRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value: number;
    __typename: string;
}

export interface YDocIntHazProHazProPreparerContextRecord {
    uuid: string;
    hazProPreparerContext: Reference<string>;
    eventHistory: YDocIntHazProHazProPreparerContextRecordEvent[];
    currentValue?: number;
    __typename: string;
}
