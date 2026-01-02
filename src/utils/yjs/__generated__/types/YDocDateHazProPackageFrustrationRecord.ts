import { Reference } from "./Reference";

export interface YDocDateHazProPackageFrustrationRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value: Reference<string>;
    __typename: string;
}

export interface YDocDateHazProPackageFrustrationRecord {
    uuid: string;
    packageFrustration: Reference<string>;
    eventHistory: YDocDateHazProPackageFrustrationRecordEvent[];
    currentValue?: Reference<string>;
    __typename: string;
}
