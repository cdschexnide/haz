import { Reference } from "./Reference";
import { YDocStringHazProFrustrationRecord } from "./YDocStringHazProFrustrationRecord";
import { YDocDateHazProFrustrationRecord } from "./YDocDateHazProFrustrationRecord";

export interface YDocLifeCycleFrustrationEvent {
    uuid: string;
    frustration__REF: Reference<string>;
    type: string;
    value__REF?: Reference<string>;
    createdAt__REF: Reference<string>;
    __typename: string;
}

export interface YDocFrustration {
    uuid: string;
    keyRecord: YDocStringHazProFrustrationRecord;
    fieldLabelRecord: YDocStringHazProFrustrationRecord;
    fieldValueRecord: YDocStringHazProFrustrationRecord;
    correctValueRecord?: YDocStringHazProFrustrationRecord;
    frustrationDateRecord: YDocDateHazProFrustrationRecord;
    defaultMessageRecord: YDocStringHazProFrustrationRecord;
    additionalCommentsRecord?: YDocStringHazProFrustrationRecord;
    inspector__REF: Reference<string>;
    reinspectionHistory__REF: Reference<string[]>;
    lifeCycleEvents: YDocLifeCycleFrustrationEvent[];
    path: string;
    __typename: string;
}
