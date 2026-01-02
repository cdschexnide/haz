import { Reference } from "./Reference";

export interface YDocDateHazProFrustrationRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value: Reference<string>;
    __typename: string;
}

export interface YDocDateHazProFrustrationRecord {
    uuid: string;
    frustration: Reference<string>;
    eventHistory: YDocDateHazProFrustrationRecordEvent[];
    currentValue?: Reference<string>;
    __typename: string;
}
