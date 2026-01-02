import { Reference } from "./Reference";

export interface YDocFloatHazProMassValueRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value: number;
    __typename: string;
}

export interface YDocFloatHazProMassValueRecord {
    uuid: string;
    massValue: Reference<string>;
    eventHistory: YDocFloatHazProMassValueRecordEvent[];
    currentValue?: number;
    __typename: string;
}
