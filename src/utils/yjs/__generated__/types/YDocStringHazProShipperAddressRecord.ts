import { Reference } from "./Reference";

export interface YDocStringHazProShipperAddressRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value: string;
    __typename: string;
}

export interface YDocStringHazProShipperAddressRecord {
    uuid: string;
    shipperAddress: Reference<string>;
    eventHistory: YDocStringHazProShipperAddressRecordEvent[];
    currentValue?: string;
    __typename: string;
}
