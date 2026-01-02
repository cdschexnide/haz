import { Reference } from "./Reference";

export interface YDocFloatHazProCapacitorDataRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value?: number;
    __typename: string;
}

export interface YDocFloatHazProCapacitorDataRecord {
    uuid: string;
    capacitorData: Reference<string>;
    eventHistory: YDocFloatHazProCapacitorDataRecordEvent[];
    currentValue?: number;
    __typename: string;
}
