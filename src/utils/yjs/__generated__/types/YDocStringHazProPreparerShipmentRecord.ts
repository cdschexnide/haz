import { Reference } from "./Reference";

export interface YDocStringHazProPreparerShipmentRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value: string;
    __typename: string;
}

export interface YDocStringHazProPreparerShipmentRecord {
    uuid: string;
    preparerShipment: Reference<string>;
    eventHistory: YDocStringHazProPreparerShipmentRecordEvent[];
    currentValue?: string;
    __typename: string;
}
