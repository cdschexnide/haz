import { Reference } from "./Reference";

export interface YDocStringHazProInspectorRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value: string;
    __typename: string;
}

export interface YDocStringHazProInspectorRecord {
    uuid: string;
    inspector: Reference<string>;
    eventHistory: YDocStringHazProInspectorRecordEvent[];
    currentValue?: string;
    __typename: string;
}
