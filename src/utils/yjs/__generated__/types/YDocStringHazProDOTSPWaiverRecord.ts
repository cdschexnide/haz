import { Reference } from "./Reference";

export interface YDocStringHazProDOTSPWaiverRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value: string;
    __typename: string;
}

export interface YDocStringHazProDOTSPWaiverRecord {
    uuid: string;
    dotspWaiver: Reference<string>;
    eventHistory: YDocStringHazProDOTSPWaiverRecordEvent[];
    currentValue?: string;
    __typename: string;
}
