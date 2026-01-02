import { Reference } from "./Reference";

export interface YDocStringHazProFrustrationRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value: string;
    __typename: string;
}

export interface YDocStringHazProFrustrationRecord {
    uuid: string;
    frustration: Reference<string>;
    eventHistory: YDocStringHazProFrustrationRecordEvent[];
    currentValue?: string;
    __typename: string;
}
