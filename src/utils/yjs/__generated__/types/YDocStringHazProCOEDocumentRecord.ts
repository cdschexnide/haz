import { Reference } from "./Reference";

export interface YDocStringHazProCOEDocumentRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value: string;
    __typename: string;
}

export interface YDocStringHazProCOEDocumentRecord {
    uuid: string;
    coeDocument: Reference<string>;
    eventHistory: YDocStringHazProCOEDocumentRecordEvent[];
    currentValue?: string;
    __typename: string;
}
