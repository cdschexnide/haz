import { Reference } from "./Reference";

export interface YDocIntHazProLifeSavingApplianceDataRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value: number;
    __typename: string;
}

export interface YDocIntHazProLifeSavingApplianceDataRecord {
    uuid: string;
    lifeSavingApplianceData: Reference<string>;
    eventHistory: YDocIntHazProLifeSavingApplianceDataRecordEvent[];
    currentValue?: number;
    __typename: string;
}
