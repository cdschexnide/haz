import { Reference } from "./Reference";

export interface YDocStringHazProLifeSavingApplianceDataRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value: string;
    __typename: string;
}

export interface YDocStringHazProLifeSavingApplianceDataRecord {
    uuid: string;
    lifeSavingApplianceData: Reference<string>;
    eventHistory: YDocStringHazProLifeSavingApplianceDataRecordEvent[];
    currentValue?: string;
    __typename: string;
}
