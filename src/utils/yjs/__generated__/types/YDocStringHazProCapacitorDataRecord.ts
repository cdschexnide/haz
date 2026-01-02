import { Reference } from "./Reference";

export interface YDocStringHazProCapacitorDataRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value?: string;
    __typename: string;
}

export interface YDocStringHazProCapacitorDataRecord {
    uuid: string;
    capacitorData: Reference<string>;
    eventHistory: YDocStringHazProCapacitorDataRecordEvent[];
    currentValue?: string;
    __typename: string;
}
