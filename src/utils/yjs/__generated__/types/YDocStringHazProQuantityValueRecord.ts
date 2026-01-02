import { Reference } from "./Reference";

export interface YDocStringHazProQuantityValueRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value: string;
    __typename: string;
}

export interface YDocStringHazProQuantityValueRecord {
    uuid: string;
    quantityValue: Reference<string>;
    eventHistory: YDocStringHazProQuantityValueRecordEvent[];
    currentValue?: string;
    __typename: string;
}
