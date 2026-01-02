import { Reference } from "./Reference";

export interface YDocStringHazProEnginePreparationDataRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value?: string;
    __typename: string;
}

export interface YDocStringHazProEnginePreparationDataRecord {
    uuid: string;
    enginePreparationData: Reference<string>;
    eventHistory: YDocStringHazProEnginePreparationDataRecordEvent[];
    currentValue?: string;
    __typename: string;
}
