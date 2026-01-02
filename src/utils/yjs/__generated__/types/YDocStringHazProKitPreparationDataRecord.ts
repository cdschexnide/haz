import { Reference } from "./Reference";

export interface YDocStringHazProKitPreparationDataRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value: string;
    __typename: string;
}

export interface YDocStringHazProKitPreparationDataRecord {
    uuid: string;
    kitPreparationData: Reference<string>;
    eventHistory: YDocStringHazProKitPreparationDataRecordEvent[];
    currentValue?: string;
    __typename: string;
}
