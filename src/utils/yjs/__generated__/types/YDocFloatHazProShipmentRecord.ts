import { Reference } from "./Reference";

export interface YDocFloatHazProShipmentRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value: number;
    __typename: string;
}

export interface YDocFloatHazProShipmentRecord {
    uuid: string;
    shipment: Reference<string>;
    eventHistory: YDocFloatHazProShipmentRecordEvent[];
    currentValue?: number;
    __typename: string;
}
