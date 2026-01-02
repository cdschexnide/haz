import { Reference } from "./Reference";

export interface YDocQuantityUnitHazProCylinderDetailsRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value: QuantityUnit;
    __typename: string;
}

export interface YDocQuantityUnitHazProCylinderDetailsRecord {
    uuid: string;
    cylinderDetails: Reference<string>;
    eventHistory: YDocQuantityUnitHazProCylinderDetailsRecordEvent[];
    currentValue?: QuantityUnit;
    __typename: string;
}
