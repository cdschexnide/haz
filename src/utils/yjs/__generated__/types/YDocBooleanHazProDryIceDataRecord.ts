import { Reference } from "./Reference";

export interface YDocBooleanHazProDryIceDataRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value?: boolean;
    __typename: string;
}

export interface YDocBooleanHazProDryIceDataRecord {
    uuid: string;
    dryIceData: Reference<string>;
    eventHistory: YDocBooleanHazProDryIceDataRecordEvent[];
    currentValue?: boolean;
    __typename: string;
}
