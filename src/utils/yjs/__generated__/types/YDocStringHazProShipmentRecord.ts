import { Reference } from "./Reference";

export interface YDocStringHazProShipmentRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value: string;
    __typename: string;
}

export interface YDocStringHazProShipmentRecord {
    uuid: string;
    shipment: Reference<string>;
    eventHistory: YDocStringHazProShipmentRecordEvent[];
    currentValue?: string;
    __typename: string;
}
