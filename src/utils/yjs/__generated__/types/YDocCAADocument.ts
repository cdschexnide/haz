import { Reference } from "./Reference";
import { YDocStringHazProCAADocumentRecord } from "./YDocStringHazProCAADocumentRecord";

export interface YDocLifeCycleCAADocumentEvent {
    uuid: string;
    caaDocument__REF: Reference<string>;
    type: string;
    value__REF?: Reference<string>;
    createdAt__REF: Reference<string>;
    __typename: string;
}

export interface YDocCAADocument {
    uuid: string;
    documentTypeRecord: YDocStringHazProCAADocumentRecord;
    base64DataRecord: YDocStringHazProCAADocumentRecord;
    nameRecord: YDocStringHazProCAADocumentRecord;
    dateAddedRecord: YDocStringHazProCAADocumentRecord;
    lifeCycleEvents: YDocLifeCycleCAADocumentEvent[];
    path: string;
    __typename: string;
}
