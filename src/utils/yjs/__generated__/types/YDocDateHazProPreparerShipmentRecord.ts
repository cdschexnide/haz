import { Reference } from "./Reference";

export interface YDocDateHazProPreparerShipmentRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value: Reference<string>;
    __typename: string;
}

export interface YDocDateHazProPreparerShipmentRecord {
    uuid: string;
    preparerShipment: Reference<string>;
    eventHistory: YDocDateHazProPreparerShipmentRecordEvent[];
    currentValue?: Reference<string>;
    __typename: string;
}
