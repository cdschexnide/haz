import { Reference } from "./Reference";

export interface YDocStringHazProConsigneeAddressRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value: string;
    __typename: string;
}

export interface YDocStringHazProConsigneeAddressRecord {
    uuid: string;
    consigneeAddress: Reference<string>;
    eventHistory: YDocStringHazProConsigneeAddressRecordEvent[];
    currentValue?: string;
    __typename: string;
}
