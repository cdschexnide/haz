import { Reference } from "./Reference";

export interface YDocStringHazProMagnetizedMaterialDataRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value?: string;
    __typename: string;
}

export interface YDocStringHazProMagnetizedMaterialDataRecord {
    uuid: string;
    magnetizedMaterialData: Reference<string>;
    eventHistory: YDocStringHazProMagnetizedMaterialDataRecordEvent[];
    currentValue?: string;
    __typename: string;
}
