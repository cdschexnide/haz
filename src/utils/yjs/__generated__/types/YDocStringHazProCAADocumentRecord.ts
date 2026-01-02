import { Reference } from "./Reference";

export interface YDocStringHazProCAADocumentRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value: string;
    __typename: string;
}

export interface YDocStringHazProCAADocumentRecord {
    uuid: string;
    caaDocument: Reference<string>;
    eventHistory: YDocStringHazProCAADocumentRecordEvent[];
    currentValue?: string;
    __typename: string;
}
