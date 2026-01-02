import { Reference } from "./Reference";
import { YDocHazProPackageFrustrationCategoryRecord } from "./YDocHazProPackageFrustrationCategoryRecord";
import { YDocStringHazProPackageFrustrationRecord } from "./YDocStringHazProPackageFrustrationRecord";
import { YDocDateHazProPackageFrustrationRecord } from "./YDocDateHazProPackageFrustrationRecord";

export interface YDocLifeCyclePackageFrustrationEvent {
    uuid: string;
    packageFrustration__REF: Reference<string>;
    type: string;
    value__REF?: Reference<string>;
    createdAt__REF: Reference<string>;
    __typename: string;
}

export interface YDocPackageFrustration {
    uuid: string;
    categoryRecord: YDocHazProPackageFrustrationCategoryRecord;
    itemIdRecord: YDocStringHazProPackageFrustrationRecord;
    itemLabelRecord: YDocStringHazProPackageFrustrationRecord;
    expectedValues: string[];
    verificationStatusRecord: YDocStringHazProPackageFrustrationRecord;
    frustrationDateRecord: YDocDateHazProPackageFrustrationRecord;
    defaultMessageRecord: YDocStringHazProPackageFrustrationRecord;
    additionalCommentsRecord?: YDocStringHazProPackageFrustrationRecord;
    inspector__REF: Reference<string>;
    afmanReferenceRecord?: YDocStringHazProPackageFrustrationRecord;
    reinspectionHistory__REF: Reference<string[]>;
    lifeCycleEvents: YDocLifeCyclePackageFrustrationEvent[];
    path: string;
    __typename: string;
}
