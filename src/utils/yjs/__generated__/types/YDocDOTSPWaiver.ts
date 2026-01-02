import { Reference } from "./Reference";
import { YDocStringHazProDOTSPWaiverRecord } from "./YDocStringHazProDOTSPWaiverRecord";

export interface YDocLifeCycleDOTSPWaiverEvent {
    uuid: string;
    dotspWaiver__REF: Reference<string>;
    type: string;
    value__REF?: Reference<string>;
    createdAt__REF: Reference<string>;
    __typename: string;
}

export interface YDocDOTSPWaiver {
    uuid: string;
    uriRecord: YDocStringHazProDOTSPWaiverRecord;
    base64DataRecord: YDocStringHazProDOTSPWaiverRecord;
    waiverNumberRecord: YDocStringHazProDOTSPWaiverRecord;
    descriptionRecord?: YDocStringHazProDOTSPWaiverRecord;
    dateAddedRecord: YDocStringHazProDOTSPWaiverRecord;
    lifeCycleEvents: YDocLifeCycleDOTSPWaiverEvent[];
    path: string;
    __typename: string;
}
