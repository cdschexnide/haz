import { Reference } from "./Reference";

export interface YDocBooleanHazProCapacitorDataRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value?: boolean;
    __typename: string;
}

export interface YDocBooleanHazProCapacitorDataRecord {
    uuid: string;
    capacitorData: Reference<string>;
    eventHistory: YDocBooleanHazProCapacitorDataRecordEvent[];
    currentValue?: boolean;
    __typename: string;
}
