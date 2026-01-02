import { Reference } from "./Reference";

export interface YDocStringHazProCryogenicLiquidDetailsRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value: string;
    __typename: string;
}

export interface YDocStringHazProCryogenicLiquidDetailsRecord {
    uuid: string;
    cryogenicLiquidDetails: Reference<string>;
    eventHistory: YDocStringHazProCryogenicLiquidDetailsRecordEvent[];
    currentValue?: string;
    __typename: string;
}
