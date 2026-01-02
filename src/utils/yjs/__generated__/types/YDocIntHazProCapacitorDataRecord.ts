import { Reference } from "./Reference";

export interface YDocIntHazProCapacitorDataRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value?: number;
    __typename: string;
}

export interface YDocIntHazProCapacitorDataRecord {
    uuid: string;
    capacitorData: Reference<string>;
    eventHistory: YDocIntHazProCapacitorDataRecordEvent[];
    currentValue?: number;
    __typename: string;
}
