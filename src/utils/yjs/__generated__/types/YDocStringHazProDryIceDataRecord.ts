import { Reference } from "./Reference";

export interface YDocStringHazProDryIceDataRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value?: string;
    __typename: string;
}

export interface YDocStringHazProDryIceDataRecord {
    uuid: string;
    dryIceData: Reference<string>;
    eventHistory: YDocStringHazProDryIceDataRecordEvent[];
    currentValue?: string;
    __typename: string;
}
