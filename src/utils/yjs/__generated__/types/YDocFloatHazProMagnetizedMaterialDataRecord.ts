import { Reference } from "./Reference";

export interface YDocFloatHazProMagnetizedMaterialDataRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value?: number;
    __typename: string;
}

export interface YDocFloatHazProMagnetizedMaterialDataRecord {
    uuid: string;
    magnetizedMaterialData: Reference<string>;
    eventHistory: YDocFloatHazProMagnetizedMaterialDataRecordEvent[];
    currentValue?: number;
    __typename: string;
}
