import { Reference } from "./Reference";

export interface YDocStringHazProCylinderDetailsRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value: string;
    __typename: string;
}

export interface YDocStringHazProCylinderDetailsRecord {
    uuid: string;
    cylinderDetails: Reference<string>;
    eventHistory: YDocStringHazProCylinderDetailsRecordEvent[];
    currentValue?: string;
    __typename: string;
}
