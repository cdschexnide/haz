import { Reference } from "./Reference";

export interface YDocStringHazProPackageFrustrationRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value: string;
    __typename: string;
}

export interface YDocStringHazProPackageFrustrationRecord {
    uuid: string;
    packageFrustration: Reference<string>;
    eventHistory: YDocStringHazProPackageFrustrationRecordEvent[];
    currentValue?: string;
    __typename: string;
}
