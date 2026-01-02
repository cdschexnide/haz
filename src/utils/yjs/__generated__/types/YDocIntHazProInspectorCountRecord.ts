import { Reference } from "./Reference";

export interface YDocIntHazProInspectorCountRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value: number;
    __typename: string;
}

export interface YDocIntHazProInspectorCountRecord {
    uuid: string;
    inspectorCount: Reference<string>;
    eventHistory: YDocIntHazProInspectorCountRecordEvent[];
    currentValue?: number;
    __typename: string;
}
