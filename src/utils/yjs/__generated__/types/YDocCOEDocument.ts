import { Reference } from "./Reference";
import { YDocStringHazProCOEDocumentRecord } from "./YDocStringHazProCOEDocumentRecord";

export interface YDocLifeCycleCOEDocumentEvent {
    uuid: string;
    coeDocument__REF: Reference<string>;
    type: string;
    value__REF?: Reference<string>;
    createdAt__REF: Reference<string>;
    __typename: string;
}

export interface YDocCOEDocument {
    uuid: string;
    documentTypeRecord: YDocStringHazProCOEDocumentRecord;
    base64DataRecord: YDocStringHazProCOEDocumentRecord;
    nameRecord: YDocStringHazProCOEDocumentRecord;
    dateAddedRecord: YDocStringHazProCOEDocumentRecord;
    lifeCycleEvents: YDocLifeCycleCOEDocumentEvent[];
    path: string;
    __typename: string;
}
