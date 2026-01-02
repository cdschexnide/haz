import { Reference } from "./Reference";

export interface YDocStringHazProGMOShipmentDataRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value: string;
    __typename: string;
}

export interface YDocStringHazProGMOShipmentDataRecord {
    uuid: string;
    gmoShipmentData: Reference<string>;
    eventHistory: YDocStringHazProGMOShipmentDataRecordEvent[];
    currentValue?: string;
    __typename: string;
}
