import { Reference } from "./Reference";

export interface YDocBooleanHazProEnginePreparationDataRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value?: boolean;
    __typename: string;
}

export interface YDocBooleanHazProEnginePreparationDataRecord {
    uuid: string;
    enginePreparationData: Reference<string>;
    eventHistory: YDocBooleanHazProEnginePreparationDataRecordEvent[];
    currentValue?: boolean;
    __typename: string;
}
