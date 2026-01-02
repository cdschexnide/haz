import { Reference } from "./Reference";

export interface YDocFloatHazProEnginePreparationDataRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value?: number;
    __typename: string;
}

export interface YDocFloatHazProEnginePreparationDataRecord {
    uuid: string;
    enginePreparationData: Reference<string>;
    eventHistory: YDocFloatHazProEnginePreparationDataRecordEvent[];
    currentValue?: number;
    __typename: string;
}
