import { Reference } from "./Reference";

export interface YDocStringHazProExtractedSDDGContentRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value: string;
    __typename: string;
}

export interface YDocStringHazProExtractedSDDGContentRecord {
    uuid: string;
    extractedSDDGContent: Reference<string>;
    eventHistory: YDocStringHazProExtractedSDDGContentRecordEvent[];
    currentValue?: string;
    __typename: string;
}
